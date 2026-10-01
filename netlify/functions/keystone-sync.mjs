import { getStore } from "@netlify/blobs";

const hash = async (s) => {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("keystone-kingdom:" + s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
};

const validBundle = (data) => data && data.saves && typeof data.saves === "object" &&
  !Array.isArray(data.saves) && data.prof && Array.isArray(data.prof.list) &&
  (data.prof.del === undefined || Array.isArray(data.prof.del));
const emptyBundle = () => ({ prof: { list: [], del: [] }, saves: {} });

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
  // Query fallback keeps existing deployed clients working during an update.
  const code = (req.headers.get("x-keystone-code") || new URL(req.url).searchParams.get("code") || "").trim().toLowerCase();
  if (code.length < 6 || code.length > 40) return Response.json({ error: "bad code" }, { status: 400 });
  const store = getStore({ name: "keystone-family-saves", consistency: "strong" });
  const key = await hash(code);
  const old = await store.get(key, { type: "json" });
  if (old?.revoked) return Response.json({ error: "This family code was replaced" }, { status: 410 });
  if (req.method === "GET") {
    return Response.json({ data: old || null });
  }
  if (req.method === "PUT" || req.method === "POST") {
    const body = await req.text();
    if (body.length > 1_000_000) return Response.json({ error: "too big" }, { status: 413 });
    let data;
    try { data = JSON.parse(body); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
    if (req.method === "POST") {
      const newCode = String(data?.newCode || "").trim().toLowerCase();
      if (!/^[0-9a-f]{32}$/.test(newCode) || newCode === code || !validBundle(data.bundle))
        return Response.json({ error: "bad upgrade" }, { status: 400 });
      const newKey = await hash(newCode);
      if (await store.get(newKey, { type: "json" }))
        return Response.json({ error: "new code in use" }, { status: 409 });
      const merged = mergeBundles(old || emptyBundle(), data.bundle);
      await store.setJSON(newKey, merged);
      await store.setJSON(key, { revoked: true, t: Date.now() });
      return Response.json({ ok: true, data: merged });
    }
    if (!validBundle(data)) return Response.json({ error: "bad data" }, { status: 400 });
    if (!old && !/^[0-9a-f]{32}$/.test(code))
      return Response.json({ error: "Create a new family code" }, { status: 400 });
    const merged = mergeBundles(old || emptyBundle(), data);
    await store.setJSON(key, merged);
    return Response.json({ ok: true, data: merged });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/keystone-sync" };
