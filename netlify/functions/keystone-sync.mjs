import { getStore } from "@netlify/blobs";

const hash = async (s) => {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("keystone-kingdom:" + s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
};

// keep the newest copy of each player, never drop players
export const mergeBundles = (old, inc) => {
  const saves = { ...(old.saves || {}) };
  for (const [id, d] of Object.entries(inc.saves || {})) {
    if (!d || typeof d !== "object") continue;
    if (!saves[id] || (d.upd || 0) >= (saves[id].upd || 0)) saves[id] = d;
  }
  const del = [...new Set([...(old.prof?.del || []), ...(inc.prof?.del || [])])];
  for (const id of del) delete saves[id];
  const list = [...new Set([...(old.prof?.list || []), ...(inc.prof?.list || [])])].filter((id) => saves[id]);
  return { prof: { list, del }, saves, t: Date.now() };
};

export default async (req) => {
  const code = (new URL(req.url).searchParams.get("code") || "").trim().toLowerCase();
  if (code.length < 6 || code.length > 40) return Response.json({ error: "bad code" }, { status: 400 });
  const store = getStore({ name: "keystone-family-saves", consistency: "strong" });
  const key = await hash(code);
  if (req.method === "GET") {
    const data = await store.get(key, { type: "json" });
    return Response.json({ data: data || null });
  }
  if (req.method === "PUT") {
    const body = await req.text();
    if (body.length > 1_000_000) return Response.json({ error: "too big" }, { status: 413 });
    let data;
    try { data = JSON.parse(body); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
    if (!data || typeof data.saves !== "object") return Response.json({ error: "bad data" }, { status: 400 });
    const old = (await store.get(key, { type: "json" })) || { prof: { list: [] }, saves: {} };
    const merged = mergeBundles(old, data);
    await store.setJSON(key, merged);
    return Response.json({ ok: true, data: merged });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/keystone-sync" };
