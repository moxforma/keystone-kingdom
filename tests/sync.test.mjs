import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';

const source = readFileSync(new URL('../netlify/functions/keystone-sync.mjs', import.meta.url), 'utf8')
  .replace(/^import \{ getStore \} from "@netlify\/blobs";\r?\n/, '')
  .replace('export const mergeBundles =', 'const mergeBundles =')
  .replace('export default async (req, context) =>', 'const handler = async (req, context) =>')
  .replace(/export const config = \{ path: "\/api\/keystone-sync" \};?/, '');

function fixture() {
  const data = new Map();
  const store = {
    async get(key) { return data.has(key) ? structuredClone(data.get(key)) : null; },
    async setJSON(key, value) { data.set(key, structuredClone(value)); },
  };
  const context = { getStore: () => store, crypto: webcrypto, TextEncoder, URL, Response, Date };
  runInNewContext(`${source}\nglobalThis.exports = { mergeBundles, handler };`, context);
  const request = (method, code, body) => new Request('https://example.test/api/keystone-sync', {
    method, headers: { 'x-keystone-code': code, ...(body ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { ...context.exports, request, data };
}

const strong = '0123456789abcdef0123456789abcdef';
const next = 'fedcba9876543210fedcba9876543210';
const bundle = (name = 'Player') => ({
  prof: { list: ['p1'], del: [] }, saves: { p1: { name, upd: 1 } },
});

test('new sync codes must be strong, while existing saves can be read', async () => {
  const { handler, request } = fixture();
  assert.equal((await handler(request('PUT', 'little1', bundle()))).status, 400);
  assert.equal((await handler(request('PUT', strong, bundle()))).status, 200);
  const result = await (await handler(request('GET', strong))).json();
  assert.equal(result.data.saves.p1.name, 'Player');
});

test('upgrading a short code transfers saves and revokes the old code', async () => {
  const { handler, request, data } = fixture();
  const oldKey = [...new Uint8Array(await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode('keystone-kingdom:little1')))]
    .map(x => x.toString(16).padStart(2, '0')).join('');
  data.set(oldKey, bundle());
  const response = await handler(request('POST', 'little1', { newCode: next, bundle: bundle() }));
  assert.equal(response.status, 200);
  assert.equal((await handler(request('GET', 'little1'))).status, 410);
  assert.equal((await handler(request('PUT', 'little1', bundle('Stale')))).status, 410);
  const transferred = await (await handler(request('GET', next))).json();
  assert.equal(transferred.data.saves.p1.name, 'Player');
});

test('a deleted player cannot be restored by stale sync data', () => {
  const { mergeBundles } = fixture();
  const old = { prof: { list: [], del: ['p1'] }, saves: {} };
  const merged = mergeBundles(old, bundle('Stale'));
  assert.equal(merged.saves.p1, undefined);
  assert.equal(merged.prof.list.includes('p1'), false);
});

test('an upgrade cannot overwrite an existing family code', async () => {
  const { handler, request, data } = fixture();
  const oldKey = [...new Uint8Array(await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode('keystone-kingdom:little1')))]
    .map(x => x.toString(16).padStart(2, '0')).join('');
  data.set(oldKey, bundle('Old family'));
  assert.equal((await handler(request('PUT', next, bundle('Other family')))).status, 200);
  assert.equal((await handler(request('POST', 'little1', { newCode: next, bundle: bundle('Old family') }))).status, 409);
  const untouched = await (await handler(request('GET', next))).json();
  assert.equal(untouched.data.saves.p1.name, 'Other family');
});

test('the newest player save wins when two devices sync', () => {
  const { mergeBundles } = fixture();
  const old = bundle('Earlier');
  const incoming = bundle('Later');
  incoming.saves.p1.upd = 2;
  assert.equal(mergeBundles(old, incoming).saves.p1.name, 'Later');
  assert.equal(mergeBundles(incoming, old).saves.p1.name, 'Later');
});

test('malformed save bundles are rejected', async () => {
  const { handler, request } = fixture();
  assert.equal((await handler(request('PUT', strong, { saves: null, prof: { list: [] } }))).status, 400);
});

test('sync never loses earned progress when device clocks disagree', () => {
 const a = { name: 'Mia', upd: 100, xp: 500, gems: 9, best: { '0-0': 3, '0-1': 1 }, cards: { '0-0': { holo: true } }, owned: ['cap'] };
 const b = { name: 'Mia', upd: 999, xp: 200, gems: 4, best: { '0-1': 2, '1-0': 1 }, cards: { '0-0': { holo: false, tier: 'gold' }, '1-0': {} }, owned: ['scarf'] };
 const { mergeBundles } = fixture();
 const m = JSON.parse(JSON.stringify(mergeBundles({ prof: { list: ['p1'], del: [] }, saves: { p1: a } }, { prof: { list: ['p1'], del: [] }, saves: { p1: b } }).saves.p1));
 assert.deepEqual(m.best, { '0-0': 3, '0-1': 2, '1-0': 1 });
 assert.equal(m.xp, 500); assert.equal(m.gems, 4); assert.equal(m.upd, 999);
 assert.equal(m.cards['0-0'].holo, true); assert.equal(m.cards['0-0'].tier, 'gold'); assert.ok(m.cards['1-0']);
 assert.deepEqual([...m.owned].sort(), ['cap', 'scarf']);
});

test('the game and the server merge saves the same way', () => {
 const ctx = {}; runInNewContext(readFileSync(new URL('../public/savemerge.js', import.meta.url), 'utf8'), ctx);
 const a = { name: 'Leo', upd: 5, xp: 10, best: { '2-0': 2 }, daily: { best: 9 }, arc: { meteor: 50, high: { meteor: 'beast' } } };
 const b = { name: 'Leo', upd: 3, xp: 40, best: { '2-0': 1, '2-1': 3 }, daily: { best: 20 }, arc: { meteor: 80 } };
 const { mergeBundles } = fixture();
 const server = mergeBundles({ prof: { list: ['p'], del: [] }, saves: { p: a } }, { prof: { list: ['p'], del: [] }, saves: { p: b } }).saves.p;
 assert.equal(JSON.stringify(ctx.mergeSave(a, b)), JSON.stringify(server));
});
