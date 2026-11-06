import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

/* both copies of mergeSave: the browser file (savemerge.js) and the server (keystone-sync.mjs, through mergeBundles) */
const clientCtx = {};
runInNewContext(readFileSync(new URL('../public/savemerge.js', import.meta.url), 'utf8'), clientCtx);
const src = readFileSync(new URL('../netlify/functions/keystone-sync.mjs', import.meta.url), 'utf8')
  .replace(/^import \{ getStore \} from "@netlify\/blobs";\r?\n/, '')
  .replace('export const mergeBundles =', 'const mergeBundles =')
  .replace('export default async (req, context) =>', 'const handler = async (req, context) =>')
  .replace(/export const config = \{ path: "\/api\/keystone-sync" \};?/, '');
const sctx = { getStore: () => ({}), crypto: globalThis.crypto, TextEncoder, URL, Response, Date };
runInNewContext(`${src}\nglobalThis.exports = { mergeBundles };`, sctx);
const client = (a, b) => JSON.parse(JSON.stringify(clientCtx.mergeSave(a, b)));
const server = (a, b) => JSON.parse(JSON.stringify(sctx.exports.mergeBundles(
  { prof: { list: ['p'], del: [] }, saves: { p: a } }, { prof: { list: ['p'], del: [] }, saves: { p: b } }).saves.p));
const both = (a, b) => { const c = client(a, b), s = server(a, b); assert.deepEqual(c, s); return c; };

const A = { name: 'Kit', upd: 10, xp: 50, stream: 'math', best: { '0-0': 3 },
  streams: { math: { best: { '0-0': 2, '0-1': 1 }, skip: 8, btp: { 8: 1 }, mast: { 0: 1 }, runf: { '0-1': 2 }, rn: 3, done: 4 } },
  spell: { best2: { 'K-1': 1 }, tricky: { said: 2 }, beeFl: { a: 1 }, lists: { x: [1] }, done: 2 } };
const B = { name: 'Kit', upd: 5, xp: 90, stream: 'spell', best: { '0-0': 1, '0-1': 2 },
  streams: { math: { best: { '0-0': 3, '0-2': 1 }, skip: 16, btp: { 17: 1 }, mast: { 1: 1 }, runf: { '0-1': 0, '0-3': 1 }, rn: 7, done: 1 },
             spell: { best: { '1-0': 2 }, skip: 0, btp: {}, mast: {}, runf: {}, rn: 1, done: 1 } },
  spell: { best2: { 'K-1': 3, 'K-2': 1 }, tricky: { their: 1 }, beeFlawless: 1, done: 5 } };

test('streams merge: max stars, max counters, union of maps, newer copy is the base', () => {
  const m = both(A, B);
  assert.equal(m.stream, 'math');                       // S.stream comes from the newer base
  assert.deepEqual(m.streams.math.best, { '0-0': 3, '0-1': 1, '0-2': 1 });
  assert.equal(m.streams.math.skip, 16); assert.equal(m.streams.math.rn, 7); assert.equal(m.streams.math.done, 4);
  assert.deepEqual(m.streams.math.btp, { 8: 1, 17: 1 });
  assert.deepEqual(m.streams.math.mast, { 0: 1, 1: 1 });
  assert.deepEqual(m.streams.math.runf, { '0-1': 2, '0-3': 1 });  // the newer copy wins a clash
  assert.deepEqual(m.streams.spell.best, { '1-0': 2 });           // a stream only one side has survives
  assert.deepEqual(m.best, { '0-0': 3, '0-1': 2 });               // typing is untouched by the streams
  assert.equal(m.xp, 90);
});

test('streams merge is commutative on best, and a spelling save merges (S.spell was not merged before)', () => {
  const ab = both(A, B), ba = both(B, A);
  assert.deepEqual(ab.streams.math.best, ba.streams.math.best);
  assert.deepEqual(ab.spell.best2, { 'K-1': 3, 'K-2': 1 });
  assert.deepEqual(ab.spell.tricky, { said: 2, their: 1 });
  assert.equal(ab.spell.done, 5); assert.equal(ab.spell.beeFlawless, 1);
  assert.deepEqual(ab.spell.lists, { x: [1] });
});

test('legacy saves without S.streams or S.spell merge exactly as before', () => {
  const o = { name: 'Kit', upd: 2, xp: 5, best: { '1-1': 1 } }, n = { name: 'Kit', upd: 4, xp: 3, best: { '1-1': 3, '1-2': 1 } };
  const m = both(o, n);
  assert.deepEqual(m.best, { '1-1': 3, '1-2': 1 });
  assert.equal('streams' in m, false); assert.equal('spell' in m, false);
  // one side with streams, one without
  const m2 = both(o, A), m3 = both(A, o);
  assert.deepEqual(m2.streams, A.streams); assert.deepEqual(m3.streams, A.streams);
  assert.deepEqual(m2.spell.best2, { 'K-1': 1 });
});

test('merging a save with itself changes nothing', () => {
  const m = both(A, JSON.parse(JSON.stringify(A)));
  assert.deepEqual(m.streams, A.streams);
  assert.deepEqual(m.spell.tricky, A.spell.tricky);
});
