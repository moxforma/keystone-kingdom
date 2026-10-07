import { getStore } from "@netlify/blobs";

/* Classes and friend groups: a grown-up makes a group, kids join with a short code.
   Only first names and typing stats are stored. No chat, no free text from kids except their name. */
const words = ("ant ape bat bee bug cat cow cub dog eel elk emu fox gnu hen jay koi owl pig pup ram yak " +
 "fig nut oak pea yam " + "map hat cup jam kit pod sun sky orb gem").split(" ");
const json = (v, s = 200) => Response.json(v, { status: s, headers: { "Cache-Control": "no-store" } });
const hex = n => [...crypto.getRandomValues(new Uint8Array(n))].map(x => x.toString(16).padStart(2, "0")).join("");
const digest = async v => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("keyloria-class:" + v)))].map(x => x.toString(16).padStart(2, "0")).join("");
/* simple per-IP limits (the IP is hashed, never stored as-is) */
async function limited(store, context, bucket, max) {
  const ip = (context && context.ip) || "x", slot = Math.floor(Date.now() / 3600000), key = "rl:" + bucket + ":" + slot;
  const h = (await digest("ip:" + ip)).slice(0, 10), m = (await store.get(key, { type: "json" })) || {};
  m[h] = (m[h] || 0) + 1; await store.setJSON(key, m);
  if (m[h] === 1 && store.delete) Promise.resolve(store.delete("rl:" + bucket + ":" + (slot - 2))).catch(() => {});
  return m[h] > max;
}
const cleanName = v => String(v || "").replace(/[^A-Za-z0-9 '\-]/g, "").trim().slice(0, 14) || "Player";
const cleanTitle = v => String(v || "").replace(/[<>]/g, "").slice(0, 60);
const validCode = v => /^[a-z]{3}[0-9]{3}$/.test(v) && words.includes(v.slice(0, 3));
const validPid = v => /^[a-z0-9]{6,24}$/.test(v);
const num = (v, max) => { const n = Math.round(+v || 0); return Math.max(0, Math.min(max, n)) };
const GAMES = ["meteor", "race", "glitch", "bubble", "dig", "keeper", "bridge"];
function cleanAsg(a) {
  const o = {};
  if (a && typeof a === "object") for (const [k, v] of Object.entries(a).slice(-60)) if (/^\d{1,4}$/.test(k) && v && typeof v === "object") o[k] = { at: num(v.at, 9e15), d: num(v.d, 9e15), w: num(v.w, 300), a: num(v.a, 100) };
  return o;
}
function cleanStats(s) {
  s = s && typeof s === "object" ? s : {};
  const arc = {};
  for (const g of GAMES) if (s.arc && s.arc[g]) arc[g] = { wpm: num(s.arc[g].wpm, 300), acc: num(s.arc[g].acc, 100) };
  return { lesson: cleanTitle(s.lesson), pos: num(s.pos, 999), world: num(s.world, 99), stars: num(s.stars, 99999),
    wpm: num(s.wpm, 300), acc: num(s.acc, 100), mins: num(s.mins, 100000), arc, seen: Date.now(),
    prog: String(s.prog || "").replace(/[^0-9:;<=>?@A-Z]/g, "").slice(0, 600), asg: cleanAsg(s.asg),
    cur: s.cur && typeof s.cur === "object" ? { i: num(s.cur.i, 9999), at: num(s.cur.at, 9e15), n: num(s.cur.n, 99) } : null };
}
export const weekBoard = members => {
  const rows = [];
  for (const m of members) for (const [g, v] of Object.entries(m.stats?.arc || {})) rows.push({ n: m.name, g, wpm: v.wpm, acc: v.acc });
  return rows.sort((a, b) => b.wpm - a.wpm || b.acc - a.acc);
};

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let b; try { b = await req.json() } catch { return json({ error: "bad request" }, 400) }
  const store = getStore({ name: "keyloria-classes", consistency: "strong" });
  const a = b.a, code = String(b.code || "").trim().toLowerCase();
  if (a === "create") {
    if (await limited(store, context, "create", 20)) return json({ error: "Too many classes made. Try again later." }, 429);
    const tk = hex(16);
    for (let k = 0; k < 12; k++) {
      const c = words[crypto.getRandomValues(new Uint32Array(1))[0] % words.length] + String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000).padStart(3, "0");
      if (await store.get("c:" + c, { type: "json" })) continue;
      await store.setJSON("c:" + c, { name: cleanTitle(b.name) || "Our class", tk: await digest(tk), created: Date.now(), assign: null, race: null });
      return json({ code: c.toUpperCase(), tk });
    }
    return json({ error: "Try again" }, 503);
  }
  if (!validCode(code)) return json({ error: "Check the code" }, 400);
  const meta = await store.get("c:" + code, { type: "json" });
  if (!meta) { if (await limited(store, context, "miss", 40)) return json({ error: "Too many tries. Wait a bit." }, 429); return json({ error: "Class not found" }, 404) }
  const isTeacher = async () => typeof b.tk === "string" && /^[0-9a-f]{32}$/.test(b.tk) && (await digest(b.tk)) === meta.tk;
  const members = async () => {
    const { blobs } = await store.list({ prefix: "m:" + code + ":" });
    const out = await Promise.all(blobs.slice(0, 60).map(x => store.get(x.key, { type: "json" })));
    return out.filter(Boolean);
  };
  const pub = () => ({ name: meta.name, assign: meta.assign, lock: meta.lock || null, race: meta.race && Date.now() - meta.race.at < 30 * 60000 ? meta.race : null });
  const pid = String(b.pid || "");
  if (a === "info") return json(pub());
  if (a === "join" || a === "report") {
    if (!validPid(pid)) return json({ error: "bad player" }, 400);
    const key = "m:" + code + ":" + pid, old = await store.get(key, { type: "json" });
    if (!old && a === "report") return json({ error: "not in class" }, 404);
    if (!old && await limited(store, context, "join", 300)) return json({ error: "Too many joins. Try again later." }, 429);
    if (!old) { const { blobs } = await store.list({ prefix: "m:" + code + ":" }); if (blobs.length >= 60) return json({ error: "This class is full" }, 409) }
    await store.setJSON(key, { pid, name: cleanName(b.name), joined: old?.joined || Date.now(), stats: a === "report" ? cleanStats(b.stats) : (old?.stats || null) });
    return json(pub());
  }
  if (a === "leave") { if (validPid(pid)) await store.delete("m:" + code + ":" + pid); return json({ ok: true }) }
  if (a === "board") return json({ name: meta.name, rows: weekBoard(await members()).slice(0, 60) });
  if (!(await isTeacher())) return json({ error: "Grown-ups only" }, 403);
  if (a === "dash") return json({ ...pub(), hist: meta.hist || (meta.assign ? [meta.assign] : []), members: (await members()).map(m => ({ pid: m.pid, name: m.name, joined: m.joined, stats: m.stats })) });
  if (a === "assign") { meta.assign = b.i == null ? null : { i: num(b.i, 9999), title: cleanTitle(b.title), at: Date.now() }; if (meta.assign) meta.hist = [...(meta.hist || []), meta.assign].slice(-40); await store.setJSON("c:" + code, meta); return json(pub()) }
  if (a === "lock") { const L = {}; if (b.lock && typeof b.lock === "object") for (const [k, v] of Object.entries(b.lock).slice(0, 20)) if (/^[a-z]{2,12}$/.test(k)) L[k] = v === 0 ? 0 : 1; meta.lock = L; await store.setJSON("c:" + code, meta); return json(pub()) }
  if (a === "race") { meta.race = b.room ? { room: String(b.room).toUpperCase().slice(0, 6), at: Date.now() } : null; await store.setJSON("c:" + code, meta); return json(pub()) }
  if (a === "delete") { const { blobs } = await store.list({ prefix: "m:" + code + ":" }); await Promise.all(blobs.map(x => store.delete(x.key))); await store.delete("c:" + code); return json({ ok: true }) }
  if (a === "remove") { if (validPid(pid)) await store.delete("m:" + code + ":" + pid); return json({ ok: true }) }
  return json({ error: "unknown" }, 400);
};
export const config = { path: "/api/class" };
