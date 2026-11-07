import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const FILES = ['math-data.js', 'math-k1.js', 'math-g23.js', 'math-g45.js', 'math-g68.js', 'math-mix.js'];
const ctx = {};
ctx.globalThis = ctx;
for (const f of FILES) {
  const p = new URL('../public/' + f, import.meta.url);
  if (existsSync(p)) runInNewContext(readFileSync(p, 'utf8'), ctx, { filename: f });
}
const MATH = ctx.MATH;

test('core loads and exposes the API', () => {
  assert.ok(MATH);
  for (const k of ['add', 'problems', 'forRunner', 'lesson', 'validate', 'check', 'norm', 'rng', 'fmt', 'chain', 'word', 'seedFor']) assert.ok(MATH[k], k);
});

test('MATH.validate passes for every registered topic', () => {
  const v = MATH.validate({ seeds: 120, minDistinct: 50 });
  assert.equal(JSON.stringify(v.errors), '[]');
  assert.ok(v.topics >= 2);
});

test('deterministic by seed, varied across seeds', () => {
  const a = MATH.problems(9, 2, 12, 5), b = MATH.problems(9, 2, 12, 5), c = MATH.problems(9, 2, 12, 6);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
  assert.notEqual(JSON.stringify(a), JSON.stringify(c));
  assert.equal(a.length, 12);
  assert.equal(new Set(a.map(p => p.q)).size > 6, true);
  assert.equal(MATH.seedFor(3, 2, 1), MATH.seedFor(3, 2, 1));
  assert.notEqual(MATH.seedFor(3, 2, 1), MATH.seedFor(3, 2, 2));
});

test('problem shape and no negatives in early worlds', () => {
  for (const li of [0, 9]) for (let part = 0; part < 8; part++) for (const p of MATH.problems(li, part, 12, 3)) {
    assert.equal(typeof p.q, 'string'); assert.equal(typeof p.a, 'string');
    assert.equal(p.digits, p.a.length);
    assert.match(p.a, /^[0-9]+$/);
    assert.ok(!p.a.startsWith('-'));
    assert.ok(MATH.check(p.a, p));
  }
  const p = MATH.problems(9, 6, 40, 1);
  for (const x of p) assert.ok(MATH.calc(x.q.split('=')[0]) == null || MATH.calc(x.q.split('=')[0]) >= 0 || x.q.includes('_'));
});

test('lessons map to world topics, review and boss are synthetic', () => {
  const w1 = MATH.topicsOf(1);
  assert.equal(w1.length, 7, 'world 1 has 7 learn topics');
  assert.equal(JSON.stringify(w1.map(t => t.n)), '[1,2,3,4,5,6,7]'); // JSON compare: arrays from the vm realm fail deepEqual
  assert.equal(MATH.lesson(1, 0).id, w1[0].id);
  assert.equal(MATH.lesson(1, 6).id, w1[6].id); // slot 6 is the 7th learn topic
  assert.equal(MATH.lesson(2, 7).kind, 'review');
  assert.equal(MATH.lesson(2, 8).kind, 'boss');
  assert.equal(JSON.stringify(MATH.slotFor(0)), JSON.stringify({ w: 1, k: 0, kind: 'learn' }));
  assert.equal(MATH.slotFor(17).kind, 'boss');
  assert.equal(MATH.slotFor(17).w, 2);
  assert.ok(MATH.problems(16, 3, 8, 1).length === 8); // review of world 2
  assert.ok(MATH.problems(17, 7, 8, 1).length === 8); // boss
});

test('money, time, fraction and decimal formatting', () => {
  const f = MATH.fmt;
  assert.equal(f.money(345), '$3.45');
  assert.equal(f.money(75), '75¢');
  assert.equal(f.money(100), '$1.00');
  assert.equal(f.dollars(350), '3.50');
  assert.equal(f.moneyD(5), '$0.05');
  assert.equal(f.time(3, 15), '3:15');
  assert.equal(f.time(0, 5), '12:05');
  assert.equal(f.time24(15, 5), '15:05');
  assert.equal(f.frac(3, 4), '3/4');
  assert.equal(f.dec(0.5, 1), '0.5');
  assert.equal(f.rem(3, 2), '3r2');
  assert.equal(f.unit(12, 'cm'), '12 cm');
  assert.equal(f.big(12345), '12 345');
});

test('answer normalisation and checking', () => {
  const dec = { ans: 'dec', a: '0.5' }, money = { ans: 'money', a: '3.50' }, fr = { ans: 'frac', a: '1/2' }, fe = { ans: 'frac', equiv: true, a: '1/2' };
  assert.ok(MATH.check('.5', dec));
  assert.ok(MATH.check('0.50', dec));
  assert.ok(!MATH.check('0.6', dec));
  assert.ok(MATH.check('$3.50', money));
  assert.ok(MATH.check('3.5', money));
  assert.ok(MATH.check('3.50', money));
  assert.ok(MATH.check('1/2', fr));
  assert.ok(!MATH.check('2/4', fr));
  assert.ok(MATH.check('2/4', fe));
  assert.ok(MATH.check('3/6', fe));
  assert.ok(!MATH.check('1/3', fe));
  assert.ok(MATH.check(' 12 ', { ans: 'num', a: '12' }));
  assert.ok(MATH.check('012', { ans: 'num', a: '12' }));
  assert.ok(MATH.check('12cm', { ans: 'num', a: '12', units: ['cm'] }));
  assert.ok(!MATH.check('12cm', { ans: 'num', a: '12' }));
  assert.ok(MATH.check('03:15', { ans: 'time', a: '3:15' }));
  assert.ok(MATH.check('3 r 2', { ans: 'rem', a: '3r2' }));
  assert.ok(MATH.check('3,4', { ans: 'pair', a: '3,4' }));
  assert.ok(MATH.check('−5', { ans: 'num', a: '-5', neg: true }));
  assert.ok(MATH.check('1 2/4', { ans: 'mixed', equiv: true, a: '1 1/2' }));
  assert.ok(!MATH.check('', { ans: 'num', a: '0' }));
  assert.ok(MATH.isComplete('12', { a: '12' }) && !MATH.isComplete('1', { a: '12' }));
  assert.ok(MATH.prefixOk('1', { a: '12' }) && !MATH.prefixOk('2', { a: '12' }));
});

test('money answers accept cents and dollars where unambiguous', () => {
  const c = { ans: 'money', a: '45', mon: true }, d = { ans: 'money', a: '1.55', mon: true }, w = { ans: 'money', a: '3.00', mon: true }, n = { ans: 'money', a: '4', mon: false };
  for (const t of ['45', '0.45', '$0.45', '45¢', '.45']) assert.ok(MATH.check(t, c), t);
  assert.ok(!MATH.check('46', c) && !MATH.check('4.5', c));
  for (const t of ['1.55', '$1.55', '155']) assert.ok(MATH.check(t, d), t);
  assert.ok(!MATH.check('15.5', d));
  for (const t of ['3', '3.00', '$3', '300']) assert.ok(MATH.check(t, w), t);
  assert.ok(!MATH.check('0.04', n) && MATH.check('4', n));
  assert.ok(!MATH.isComplete('0.', c) && MATH.isComplete('0.45', c) && MATH.isComplete('45', c) && MATH.prefixOk('0.', c));
  for (let s = 0; s < 8; s++) for (const p of MATH.gen('m4.6', s, 3, 30)) assert.ok(MATH.check(p.a, p));
});

test('evaluator handles the problem notation', () => {
  assert.equal(MATH.calc('7 + 5'), 12);
  assert.equal(MATH.calc('3 × (2 + 4)'), 18);
  assert.equal(MATH.calc('$3.45 + 75¢'), 4.2);
  assert.equal(MATH.calc('1/2 + 1/4'), 0.75);
  assert.equal(MATH.calc('2³ − √16'), 4);
  assert.equal(MATH.calc('3 + _ = 8'), null);
  assert.equal(MATH.calc('x + 7', 8), 15);
});

test('validator catches bad topics', () => {
  const before = MATH.validate().errors.length;
  // world 99 is outside the real curriculum, so these ids cannot collide with registered content
  MATH.add({ id: 'm99.3', world: 99, n: 3, title: 'bad', neg: false, ans: 'num', gen: (r) => { const a = r.int(1, 9); return { q: a + ' + 1', a: String(a + 2) }; } });
  MATH.add({ id: 'm99.2', world: 99, n: 2, title: 'neg', neg: false, ans: 'num', gen: (r) => { const a = r.int(1, 9); return { q: a + ' − 12', a: String(a - 12) }; } });
  MATH.add({ id: 'm99.1', world: 99, n: 1, title: 'inexact', ans: 'num', gen: (r) => ({ q: '7 ÷ 2', a: '3' }) });
  const v = MATH.validate({ topics: ['m99.3', 'm99.2', 'm99.1'] });
  assert.equal(v.ok, false);
  assert.ok(v.errors.some(e => /m99\.3: WRONG ANSWER/.test(e)));
  assert.ok(v.errors.some(e => /m99\.2: .*negative/.test(e)));
  assert.ok(v.errors.some(e => /m99\.1: .*WRONG/.test(e)));
  assert.ok(before === 0);
});

test('forRunner: rock 1 digit, bridge longer, keys respected, spell is a chain', () => {
  for (const tier of [0, 1, 5, 11]) {
    const rocks = MATH.forRunner(tier, '0123456789', 'rock', { count: 10, seed: 4 });
    assert.equal(rocks.length, 10);
    for (const p of rocks) assert.equal(p.a.length, 1);
    const br = MATH.forRunner(tier, '0123456789', 'bridge', { count: 8, seed: 4 });
    assert.equal(br.length, 8);
    for (const p of br) assert.ok(p.a.length >= 1 && p.a.length <= 6);
    const only = MATH.forRunner(tier, '12345', 'rock', { count: 6, seed: 2 });
    for (const p of only) assert.ok(/^[1-5]$/.test(p.a) || p.topic === 'fallback');
  }
  const sp = MATH.forRunner(2, '0123456789', 'spell', { seed: 3 });
  assert.equal(sp.length, 3);
  assert.equal(JSON.stringify(sp), JSON.stringify(MATH.forRunner(2, '0123456789', 'spell', { seed: 3 })));
  for (const p of sp) assert.equal(String(MATH.calc(p.q)), p.a);
  assert.equal(JSON.stringify(MATH.forRunner(3, '0123456789', 'tower', { seed: 1 })), JSON.stringify(MATH.forRunner(3, '0123456789', 'tower', { seed: 1 })));
});

test('chain and word problems are correct and non-negative', () => {
  for (let w = 1; w <= 12; w++) for (let s = 0; s < 40; s++) {
    for (const st of MATH.chain(w, s, 4).steps) { assert.equal(String(MATH.calc(st.q)), st.a); assert.ok(+st.a >= 0 && st.a.length <= 4); }
    const x = MATH.word(w, s);
    assert.equal(String(MATH.calc(x.eq)), x.a);
    assert.ok(x.q.split(' ').length <= 12);
  }
});

/* ---- audit 3 content rules ---- */
function allProblems(world, parts = [0, 1, 2, 3, 4, 5, 6, 7], seeds = [1, 2, 3]) {
  const out = [];
  for (let k = 0; k < 9; k++) for (const part of parts) for (const sd of seeds) {
    try { for (const p of MATH.problems({ w: world, k }, part, 12, sd)) out.push(p); } catch (e) { /* lesson slot may not exist */ }
  }
  return out;
}

test('W1 (JK/SK) uses digits only: no number words in any problem', () => {
  const re = /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/i;
  const bad = allProblems(1).filter(p => re.test(p.q)).map(p => p.q);
  assert.deepEqual([...new Set(bad)], []);
});

test('hints match the problem: no fixed money hint, no unrelated random hints', () => {
  const m11 = allProblems(11).filter(p => p.topic === 'm11.5');
  assert.ok(m11.length > 20);
  for (const p of m11) assert.ok(!/Type \d+ or/.test(p.hint), p.q + ' -> ' + p.hint);
  const bad = [];
  for (const p of allProblems(12).concat(allProblems(11))) {
    const h = p.hint || '', q = p.q;
    if (/Halve it, halve again/.test(h) && !/^25%/.test(q)) bad.push(q + ' -> ' + h);
    if (/Count the jumps|Draw it$/.test(h)) bad.push(q + ' -> ' + h);
    if (/Which number times itself/.test(h) && !/√/.test(q)) bad.push(q + ' -> ' + h);
    if (/List the factors/.test(h) && !/Factors/.test(q)) bad.push(q + ' -> ' + h);
    if (/Brackets first/.test(h) && !/\(/.test(q)) bad.push(q + ' -> ' + h);
    if (/Find 10% first/.test(h) && !/%/.test(q)) bad.push(q + ' -> ' + h);
  }
  assert.deepEqual([...new Set(bad)].slice(0, 5), []);
});

test('cryptic prompts were rewritten', () => {
  const all = allProblems(3).concat(allProblems(1));
  for (const p of all) {
    assert.ok(!/Most votes\?|Fewest votes\?|Place behind\?|Place in front\?/.test(p.q), p.q);
    assert.ok(!/^(Votes|Stars|Canoes|Goals|Pucks|Apples|Leaves|Toques): /.test(p.q), p.q);
  }
});

test('unit-conversion hints name the units of the question', () => {
  for (const p of allProblems(11).filter(p => /^\d+ cm = _ mm$/.test(p.q))) assert.equal(p.hint, '10 mm make 1 cm');
  for (const p of allProblems(11).filter(p => /^\d+ (m = _ cm|cm = _ m)$/.test(p.q))) assert.equal(p.hint, '100 cm make 1 m');
});
