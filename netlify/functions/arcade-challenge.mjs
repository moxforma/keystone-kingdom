import { getStore } from "@netlify/blobs";

const validFrames = (frames, maxPosition) => {
 if (!Array.isArray(frames) || frames.length < 2 || frames.length > 1000) return false;
 let position = -1, time = -1;
 for (const frame of frames) {
  if (!Array.isArray(frame) || frame.length !== 2 ||
      !Number.isInteger(frame[0]) || !Number.isInteger(frame[1]) ||
      frame[0] < 0 || frame[0] > maxPosition || frame[0] < position ||
      frame[1] < 0 || frame[1] > 36000 || frame[1] < time) return false;
  [position, time] = frame;
 }
 return frames[0][0] === 0 && frames[0][1] === 0 && position === maxPosition && time > 0;
};
const validProgress = frames => {
 if (!Array.isArray(frames) || frames.length < 2 || frames.length > 1000) return false;
 let position = -1, time = -1;
 for (const frame of frames) {
  if (!Array.isArray(frame) || frame.length !== 5 || frame.some(value => !Number.isInteger(value)) ||
      frame[0] < 0 || frame[0] > 1000 || frame[0] < position ||
      frame[1] < 0 || frame[1] > 36000 || frame[1] < time ||
      frame[2] < 1 || frame[2] > 4 || frame[4] < 1 || frame[4] > 1000 ||
      frame[3] < 0 || frame[3] > frame[4]) return false;
  [position, time] = frame;
 }
 return frames[0][0] === 0 && frames[0][1] === 0;
};
const validWord = value => typeof value === "string" && value.length >= 1 && value.length <= 100 && !/[\x00-\x1f]/.test(value);
const validMeteorWords = data => data.q === undefined ||
 typeof data.m === "boolean" && Array.isArray(data.q) && data.q.length >= 1 && data.q.length <= 100 && data.q.every(validWord);
const validGlitchWords = data => data.q === undefined && data.b === undefined ||
 Array.isArray(data.q) && data.q.length === 3 && data.q.every(wave =>
  Array.isArray(wave) && wave.length >= 1 && wave.length <= 25 && wave.every(sp =>
   Array.isArray(sp) && sp.length === 3 && ["bad", "friend"].includes(sp[0]) && ["s", "m", "l"].includes(sp[1]) && validWord(sp[2]))) &&
 Array.isArray(data.b) && data.b.length >= 3 && data.b.length <= 12 && data.b.every(validWord);

export const validChallenge = data => {
 if (!data || data.v !== 2 || !["race", "meteor", "glitch", "bubble"].includes(data.g) ||
     !["auto", "easy", "medium", "hard", "beast"].includes(data.d) ||
     typeof data.n !== "boolean" || typeof data.s !== "boolean" ||
     typeof data.l !== "number" || !Number.isFinite(data.l) || data.l < .2 || data.l > 3) return false;
 if (data.g === "race") {
  return typeof data.t === "string" && data.t.length >= 4 && data.t.length <= 1000 &&
   !/[\x00-\x1f]/.test(data.t) && Number.isInteger(data.a) && data.a >= 0 && data.a <= 100 &&
   validFrames(data.f, data.t.length);
 }
 return Number.isInteger(data.r) && data.r >= 0 && data.r <= 1000000 &&
  typeof data.w === "boolean" && validFrames(data.f, data.r) &&
  (data.g !== "glitch" || data.p === undefined || validProgress(data.p)) &&
  (data.g === "meteor" || data.g === "bubble" ? validMeteorWords(data) : validGlitchWords(data));
};

export default async req => {
 const url = new URL(req.url);
 const store = getStore({ name: "keyloria-arcade-challenges", consistency: "strong" });
 if (req.method === "GET") {
  const id = url.searchParams.get("id") || "";
  if (!/^[A-Za-z0-9_-]{12}$/.test(id)) return Response.json({ error: "Invalid challenge code" }, { status: 400 });
  const data = await store.get(id, { type: "json" });
  return data && validChallenge(data) ? Response.json({ data }, { headers: { "Cache-Control": "public, max-age=300" } }) :
   Response.json({ error: "Challenge not found" }, { status: 404 });
 }
 if (req.method === "POST") {
  const body = await req.text();
  if (body.length > 25000) return Response.json({ error: "Challenge too large" }, { status: 413 });
  let data;
  try { data = JSON.parse(body); } catch { return Response.json({ error: "Invalid challenge" }, { status: 400 }); }
  if (!validChallenge(data)) return Response.json({ error: "Invalid challenge" }, { status: 400 });
  for (let attempt = 0; attempt < 3; attempt++) {
   const id = Buffer.from(crypto.getRandomValues(new Uint8Array(9))).toString("base64url");
   if (await store.get(id)) continue;
   await store.setJSON(id, data);
   return Response.json({ id });
  }
  return Response.json({ error: "Could not make a challenge code" }, { status: 503 });
 }
 return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/arcade-challenge" };
