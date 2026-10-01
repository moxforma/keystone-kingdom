import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../netlify/functions/arcade-challenge.mjs', import.meta.url), 'utf8');
const scripted = source.replace(/^import .*\n/m, '').replaceAll('export const ', 'const ')
 .replace('export default async req =>', 'const handler = async req =>');

function service() {
 const records = new Map();
 const context = { URL, Response, Buffer, crypto: webcrypto,
  getStore: () => ({
   get: async id => records.get(id) || null,
   setJSON: async (id, data) => records.set(id, data)
  })
 };
 runInNewContext(scripted + '\nglobalThis.api={handler,validChallenge}', context);
 return context.api;
}

test('short codes save and load each arcade ghost', async () => {
 const { handler } = service();
 for (const game of ['meteor', 'glitch', 'race']) {
  const data = { v: 2, g: game, d: 'medium', n: false, s: false, l: 1,
   ...(game === 'race' ? { t: 'race me', a: 95, f: [[0,0],[7,24]] } :
    { r: 250, w: true, f: [[0,0],[100,10],[250,24]] }) };
  if(game==='glitch')data.p=[[0,0,1,0,6],[42,10,1,1,6],[250,24,2,0,7]];
  const saved = await handler(new Request('https://example.com/api/arcade-challenge', {
   method: 'POST', body: JSON.stringify(data)
  }));
  assert.equal(saved.status, 200);
  const { id } = await saved.json();
  assert.match(id, /^[A-Za-z0-9_-]{12}$/);
  const loaded = await handler(new Request('https://example.com/api/arcade-challenge?id=' + id));
  assert.equal(loaded.status, 200);
  assert.deepEqual((await loaded.json()).data.f, data.f);
  if(game==='glitch'){
   const replay=await handler(new Request('https://example.com/api/arcade-challenge?id=' + id));
   assert.deepEqual((await replay.json()).data.p,data.p);
  }
 }
});

test('invalid or oversized ghost data is rejected', async () => {
 const { handler } = service();
 const bad = { v: 2, g: 'meteor', d: 'easy', n: false, s: false, l: 1,
  r: 200, w: true, f: [[0,0],[300,10]] };
 const result = await handler(new Request('https://example.com/api/arcade-challenge', {
  method: 'POST', body: JSON.stringify(bad)
 }));
 assert.equal(result.status, 400);
 const malformed = {v:2,g:'glitch',d:'easy',n:false,s:false,l:1,r:100,w:false,
  f:[[0,0],[100,10]],p:[[0,0,1,0,6],[1200,10,1,1,6]]};
 const badWave=await handler(new Request('https://example.com/api/arcade-challenge',{
  method:'POST',body:JSON.stringify(malformed)
 }));
 assert.equal(badWave.status,400);
});
