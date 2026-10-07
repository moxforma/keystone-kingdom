import { getStore } from "@netlify/blobs";

/* Race rooms: everyone types the same text after a shared countdown; players post progress every ~1.5s. */
const words = ("zap zip zoom dash bolt fast jet run hop ace air arc bee bop cat cub dot elf fin fun gem hum ice ink joy kit leap lime mint moon nova orb owl pop ray rex ski sky spin star sun toy van wave wiz yak zen").split(" ");
const TTL = 3 * 3600000;
const CACHE = new Map();
/* public ids: other players only ever see a hash of your private player id, so nobody can act as you */
const pubId = async v => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("keyloria-race:" + v)))].slice(0, 6).map(x => x.toString(16).padStart(2, "0")).join("");
/* simple per-IP limits (the IP is hashed, never stored as-is) */
async function limited(store, context, bucket, max) {
  const ip = (context && context.ip) || "x", slot = Math.floor(Date.now() / 3600000), key = "rl:" + bucket + ":" + slot;
  const h = (await pubId("ip:" + ip)).slice(0, 10), m = (await store.get(key, { type: "json" })) || {};
  m[h] = (m[h] || 0) + 1; await store.setJSON(key, m);
  if (m[h] === 1 && store.delete) Promise.resolve(store.delete("rl:" + bucket + ":" + (slot - 2))).catch(() => {});
  return m[h] > max;
}
const json = (v, s = 200) => Response.json({ ...v, now: Date.now() }, { status: s, headers: { "Cache-Control": "no-store" } });
const cleanName = v => String(v || "").replace(/[^A-Za-z0-9 '\-]/g, "").trim().slice(0, 14) || "Player";
const validPid = v => /^[a-z0-9]{6,24}$/.test(v);
const validRoom = v => /^[a-z]{3,4}[0-9]{2}$/.test(v);
const cleanLook = v => { const o = v && typeof v === "object" ? v : {}; const id = x => /^[a-z0-9_]{1,20}$/i.test(String(x || "")) ? String(x) : null; const eq = {}; if (o.eq && typeof o.eq === "object") Object.entries(o.eq).slice(0, 8).forEach(([k, x]) => { if (id(k) && id(x)) eq[k] = x }); return { h: id(o.h), c: id(o.c), eq } };
const num = (v, max) => Math.max(0, Math.min(max, Math.round(+v || 0)));
const cleanText = v => String(v || "").replace(/[^\x20-\x7e]/g, "").replace(/\s+/g, " ").trim().slice(0, 600);
export const standings = ps => ps.slice().sort((a, b) => (a.ft && b.ft) ? a.ft - b.ft : a.ft ? -1 : b.ft ? 1 : b.pos - a.pos);

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let b; try { b = await req.json() } catch { return json({ error: "bad request" }, 400) }
  const store = getStore({ name: "keyloria-races", consistency: "strong" });
  const a = b.a, pid = String(b.pid || "");
  if (!validPid(pid)) return json({ error: "bad player" }, 400);
  if (a === "make") {
    const text = cleanText(b.text); if (text.length < 20) return json({ error: "text too short" }, 400);
    if (await limited(store, context, "make", 40)) return json({ error: "Too many races made. Try again later." }, 429);
    for (let k = 0; k < 20; k++) {
      const r = words[crypto.getRandomValues(new Uint32Array(1))[0] % words.length] + String(crypto.getRandomValues(new Uint32Array(1))[0] % 100).padStart(2, "0");
      const was = await store.get("r:" + r, { type: "json" });
      if (was && Date.now() - was.created < TTL) continue;
      if (was) { const { blobs } = await store.list({ prefix: "p:" + r + ":" }); await Promise.all(blobs.map(x => store.delete(x.key))) }
      await store.setJSON("r:" + r, { host: pid, text, lvl: String(b.lvl || "").slice(0, 12), round: 0, state: "lobby", startAt: 0, created: Date.now(), spectate: !!b.spectate });
      if (!b.spectate) await store.setJSON("p:" + r + ":" + pid, { pid, name: cleanName(b.name), look: cleanLook(b.look), round: 0, pos: 0, errs: 0, wpm: 0, ft: 0, t: Date.now() });
      return json({ room: r.toUpperCase() });
    }
    return json({ error: "Try again" }, 503);
  }
  const room = String(b.room || "").trim().toLowerCase();
  if (!validRoom(room)) return json({ error: "Check the race code" }, 400);
  const meta = await store.get("r:" + room, { type: "json" });
  if (!meta || Date.now() - meta.created > TTL) { if (await limited(store, context, "miss", 60)) return json({ error: "Too many tries. Wait a bit." }, 429); return json({ error: "Race not found" }, 404) }
  /* reading every racer on every tick is expensive, so a warm server reuses the list for about a second */
  const players = async (fresh) => { const c = CACHE.get(room); if (!fresh && c && Date.now() - c.t < 1200 && c.round === (meta.round || 0)) return c.ps;
    const { blobs } = await store.list({ prefix: "p:" + room + ":" }); const ps = (await Promise.all(blobs.slice(0, 80).map(x => store.get(x.key, { type: "json" })))).filter(p => p && (p.round || 0) === (meta.round || 0));
    CACHE.set(room, { t: Date.now(), round: meta.round || 0, ps }); if (CACHE.size > 200) CACHE.delete(CACHE.keys().next().value); return ps };
  const mergeMe = (ps, me) => me ? [...ps.filter(p => p.pid !== me.pid), me] : ps;
  const out = async () => ({ state: meta.state, startAt: meta.startAt, text: meta.text, host: await pubId(meta.host), me: await pubId(pid), lvl: meta.lvl || "", round: meta.round || 0, spectate: !!meta.spectate, players: await Promise.all(standings(await players()).map(async p => ({ pid: await pubId(p.pid), name: p.name, look: p.look || null, pos: p.pos, wpm: p.wpm, ft: p.ft, acc: p.acc, bad: p.bad || 0 }))) });
  const key = "p:" + room + ":" + pid;
  if (a === "join") {
    if (meta.state !== "lobby") return json({ error: "That race already started" }, 409);
    if ((await players(true)).length >= 40) return json({ error: "Race is full" }, 409);
    await store.setJSON(key, { pid, name: cleanName(b.name), look: cleanLook(b.look), round: meta.round || 0, pos: 0, errs: 0, wpm: 0, ft: 0, t: Date.now() });
    CACHE.delete(room);
    return json(await out());
  }
  if (a === "start") { if (meta.host !== pid) { const ps = await players(true); if (ps.some(p => p.pid === meta.host) || meta.spectate || !ps.length || ps[0].pid !== pid) return json({ error: "Only the host can start" }, 403) } if (meta.state === "lobby") { meta.state = "go"; meta.startAt = Date.now() + 5000; await store.setJSON("r:" + room, meta) } return json(await out()) }
  if (a === "tick") {
    const old = await store.get(key, { type: "json" });
    if (old && meta.state === "go" && (old.round || 0) === (meta.round || 0)) {
      const len = meta.text.length, pos = num(b.pos, len), fin = pos >= len;
      const me = { ...old, pos: Math.max(old.pos, pos), wpm: num(b.wpm, 300), acc: num(b.acc, 100), bad: Math.max(old.bad || 0, num(b.bad, 99999)), ft: old.ft || (fin && Date.now() > meta.startAt ? Date.now() : 0), t: Date.now() };
      await store.setJSON(key, me); const c = CACHE.get(room); if (c && c.round === (meta.round || 0)) c.ps = mergeMe(c.ps, me);
    }
    return json(await out());
  }
  if (a === "rematch") {
    const mine = await store.get(key, { type: "json" }), mayReset = pid === meta.host || (mine && mine.ft && (mine.round || 0) === (meta.round || 0)) || Date.now() - meta.startAt > 15 * 60000;
    if (meta.state === "go" && Date.now() > meta.startAt && mayReset) { meta.state = "lobby"; meta.round = (meta.round || 0) + 1; meta.startAt = 0; const t = cleanText(b.text); if (t.length >= 20) meta.text = t; await store.setJSON("r:" + room, meta) }
    if (meta.state !== "lobby") return json({ error: "Race is still going" }, 409);
    CACHE.delete(room);
    if (!(meta.spectate && meta.host === pid)) await store.setJSON(key, { pid, name: cleanName(b.name), look: cleanLook(b.look), round: meta.round || 0, pos: 0, errs: 0, wpm: 0, ft: 0, t: Date.now() });
    return json(await out());
  }
  if (a === "get") return json(await out());
  return json({ error: "unknown" }, 400);
};
export const config = { path: "/api/race" };
