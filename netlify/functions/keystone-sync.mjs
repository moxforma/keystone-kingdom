import { getStore } from "@netlify/blobs";

const hash = async (s) => {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("keystone-kingdom:" + s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
};


/* simple per-IP limits (the IP is hashed, never stored as-is) */
async function limited(store, req, context, bucket, max) {
  const ip = (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "x", slot = Math.floor(Date.now() / 3600000), key = "rl:" + bucket + ":" + slot;
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("keyloria-ip:" + ip));
  const h = [...new Uint8Array(d)].slice(0, 5).map(x => x.toString(16).padStart(2, "0")).join(""), m = (await store.get(key, { type: "json" })) || {};
  m[h] = (m[h] || 0) + 1; await store.setJSON(key, m);
  if (m[h] === 1 && store.delete) Promise.resolve(store.delete("rl:" + bucket + ":" + (slot - 2))).catch(() => {});
  return m[h] > max;
}

const MAX_SAVE = 1_500_000;
const validBundle = (data) => data && data.saves && typeof data.saves === "object" &&
  !Array.isArray(data.saves) && data.prof && Array.isArray(data.prof.list) &&
  (data.prof.del === undefined || Array.isArray(data.prof.del));
const emptyBundle = () => ({ prof: { list: [], del: [] }, saves: {} });

// same merge as public/savemerge.js: newest copy is the base, earned progress is combined from both
const TR={gold:1,diamond:2};
const maxNum=(a,b)=>Math.max(+a||0,+b||0);
const maxMap=(a,b)=>{const o={...(a||{})};for(const[k,v]of Object.entries(b||{}))if(typeof v==='number')o[k]=maxNum(o[k],v);else if(!(k in o))o[k]=v;return o};
const union=(a,b)=>[...new Set([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])])];
function mergeSave(x,y){
 if(!x||typeof x!=='object')return y;if(!y||typeof y!=='object')return x;
 const [base,other]=(y.upd||0)>=(x.upd||0)?[y,x]:[x,y];
 const m=JSON.parse(JSON.stringify(base));
 m.best=maxMap(base.best,other.best);
 const cards={...(base.cards||{})};for(const[k,c]of Object.entries(other.cards||{})){const b=cards[k];if(!b){cards[k]=c;continue}const t=(TR[c&&c.tier]||0)>(TR[b.tier]||0)?c.tier:b.tier;cards[k]={...b,holo:!!(b.holo||(c&&c.holo)),...(t?{tier:t}:{})}}m.cards=cards;
 for(const k of['xp','time','rounds','netw','netb'])if(k in base||k in other)m[k]=maxNum(base[k],other[k]);
 for(const k of['owned','badges'])if(base[k]||other[k])m[k]=union(base[k],other[k]);
 for(const k of['rareOwn','rareSeen','codeBest'])if(base[k]||other[k])m[k]=k==='codeBest'?maxMap(base[k],other[k]):{...(other[k]||{}),...(base[k]||{})};
 if(base.arc||other.arc){m.arc={...maxMap(base.arc,other.arc)};if(base.arc&&base.arc.high||other.arc&&other.arc.high)m.arc.high={...((other.arc||{}).high||{}),...((base.arc||{}).high||{})}}
 if(base.daily||other.daily){m.daily={...(base.daily||{})};m.daily.best=maxNum((base.daily||{}).best,(other.daily||{}).best)}
 if(base.codeOn||other.codeOn)m.codeOn=true;
 m.upd=maxNum(base.upd,other.upd);return m}

// never drop players, never lose earned progress
export const mergeBundles = (old, inc) => {
  const saves = { ...(old.saves || {}) };
  for (const [id, d] of Object.entries(inc.saves || {})) {
    if (!d || typeof d !== "object") continue;
    saves[id] = saves[id] && (!saves[id].name || !d.name || saves[id].name === d.name) ? mergeSave(saves[id], d) : (!saves[id] || (d.upd || 0) >= (saves[id].upd || 0) ? d : saves[id]);
  }
  const del = [...new Set([...(old.prof?.del || []), ...(inc.prof?.del || [])])];
  for (const id of del) delete saves[id];
  const list = [...new Set([...(old.prof?.list || []), ...(inc.prof?.list || [])])].filter((id) => saves[id]);
  return { prof: { list, del }, saves, t: Date.now() };
};

export default async (req, context) => {
  // codes only travel in a header (never in the URL, so they stay out of logs)
  const code = (req.headers.get("x-keystone-code") || "").trim().toLowerCase();
  if (code.length < 6 || code.length > 40) return Response.json({ error: "bad code" }, { status: 400 });
  const store = getStore({ name: "keystone-family-saves", consistency: "strong" });
  const key = await hash(code);
  const weak = !/^[0-9a-f]{32}$/.test(code);
  if (weak && await limited(store, req, context, "weak", 20)) return Response.json({ error: "Too many tries. Change to a new family code." }, { status: 429 });
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
      if (JSON.stringify(merged).length > MAX_SAVE) return Response.json({ error: "too big" }, { status: 413 });
      await store.setJSON(newKey, merged);
      await store.setJSON(key, { revoked: true, t: Date.now() });
      return Response.json({ ok: true, data: merged });
    }
    if (!validBundle(data)) return Response.json({ error: "bad data" }, { status: 400 });
    if (!old && !/^[0-9a-f]{32}$/.test(code))
      return Response.json({ error: "Create a new family code" }, { status: 400 });
    if (!old && await limited(store, req, context, "newfam", 10)) return Response.json({ error: "Too many new families. Try again later." }, { status: 429 });
    const merged = mergeBundles(old || emptyBundle(), data);
    if (JSON.stringify(merged).length > MAX_SAVE) return Response.json({ error: "too big" }, { status: 413 });
    await store.setJSON(key, merged);
    return Response.json({ ok: true, data: merged });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/keystone-sync" };
