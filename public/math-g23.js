/* math-g23.js : MATH content for worlds 4-5 (Ontario Grade 2 and Grade 3). 7 topics per world, ids m4.1-m4.7 and m5.1-m5.7.
 Self-registering IIFE; needs math-data.js (MATH) loaded first and does nothing without it.
 Answer conventions: money answers are typed plain: under $1 in cents ('65'), $1 and over in dollars ('1.55').
 Ontario notes marked UNCERTAIN must be checked by the owner against the official 2020 curriculum. */
(function (root) {
  'use strict';
  var M = root.MATH;
  if (!M || typeof M.add !== 'function') return;
  var F = M.fmt, SUB = '−', MUL = '×', DIV = '÷';

  var NAMES = ['Pop', 'Mia', 'Sam', 'Ava', 'Leo', 'Zoe', 'Kai', 'Nia', 'Eli', 'Ivy'];
  var THINGS = ['stickers', 'cards', 'apples', 'pucks', 'berries', 'shells', 'leaves', 'marbles', 'books', 'toques'];

  function ri(r, a, b) { return r.int(a, b); }
  function S(n) { return String(n); }
  function carries(a, b) { var c = 0, k = 0, d; while (a > 0 || b > 0) { d = (a % 10) + (b % 10) + k; k = d >= 10 ? 1 : 0; c += k; a = Math.floor(a / 10); b = Math.floor(b / 10); } return c; }
  function borrows(a, b) { var c = 0, k = 0, d; while (a > 0 || b > 0) { d = (a % 10) - (b % 10) - k; k = d < 0 ? 1 : 0; c += k; a = Math.floor(a / 10); b = Math.floor(b / 10); } return c; }
  function T(o, g) {
    o.neg = false; o.exact = true;
    o.gen = function (r, s, tier) {
      for (var i = 0; i < 80; i++) { var x = g(r, s, tier); if (x) return x; }
      return { q: '10 + 10', a: '20', eq: '10 + 10' };
    };
    return M.add(o);
  }
  function ansM(c) { return c < 100 ? S(c) : F.dollars(c); } // money answer typed form
  function digitsOf(n) { return S(n).split(''); }

  /* ================= WORLD 4: GRADE 2 ================= */

  T({
    id: 'm4.1', run: ['bridge', 'tower'], n: 1, world: 4, strand: 'B', ans: 'num', title: 'Add and take away',
    exp: 'Gr2 B2: add and subtract to 100 (no regrouping, then regrouping), missing number in equations (C UNCERTAIN overlap)'
  }, function (r, s) {
    var lo = [10, 10, 10, 20, 20, 20, 20, 20][s], hi = [59, 99, 79, 99, 99, 99, 100, 100][s];
    var sub = r.chance(0.5), a, b, c, cr, q, nm, th;
    if (!sub) {
      a = ri(r, lo, hi - 1);
      b = s <= 1 ? (r.chance(0.5) ? ri(r, 1, 9) : r.step(10, 90, 10)) : s === 4 ? ri(r, 2, 9) : ri(r, 10, 99);
      c = a + b; if (c > (s >= 6 ? 100 : 99)) return null;
      cr = carries(a, b); if (s < 4 ? cr !== 0 : cr < 1) return null;
    } else {
      a = ri(r, lo + 5, hi);
      b = s <= 1 ? (r.chance(0.5) ? ri(r, 1, 9) : r.step(10, 90, 10)) : s === 4 ? ri(r, 2, 9) : ri(r, 10, 99);
      if (b >= a) return null; c = a - b;
      cr = borrows(a, b); if (s < 4 ? cr !== 0 : cr < 1) return null;
    }
    if (s >= 5 && (s === 7 ? r.chance(0.55) : r.chance(0.15))) {
      var k = ri(r, 0, 3);
      if (!sub) return k === 0 ? { q: '_ + ' + b + ' = ' + c, a: S(a) } : k === 1 ? { q: a + ' + _ = ' + c, a: S(b) } : (k === 2 ? { q: c + ' ' + SUB + ' _ = ' + a, a: S(b) } : { q: c + ' ' + SUB + ' ' + b + ' = _', a: S(a) });
      return k < 2 ? { q: a + ' ' + SUB + ' _ = ' + c, a: S(b) } : { q: '_ ' + SUB + ' ' + b + ' = ' + c, a: S(a) };
    }
    if (s >= 3 && r.chance(0.25)) {
      nm = r.pick(NAMES); th = r.pick(THINGS);
      if (!sub) return { q: nm + ' has ' + a + ' ' + th + '. Gets ' + b + ' more. How many now?', a: S(c), eq: a + ' + ' + b, hint: 'Add' };
      return { q: nm + ' has ' + a + ' ' + th + '. Gives ' + b + ' away. How many left?', a: S(c), eq: a + ' ' + SUB + ' ' + b, hint: 'Take away' };
    }
    return { q: a + (sub ? ' ' + SUB + ' ' : ' + ') + b, a: S(c), hint: sub ? 'Take away tens, then ones' : 'Add tens, then ones' };
  });

  T({
    id: 'm4.2', n: 2, world: 4, strand: 'B', ans: 'num', title: 'Tens, ones, hundreds',
    exp: 'Gr2 B1: place value to 200 (hundreds, tens, ones), 10 more/less, 100 more/less, comparing numbers'
  }, function (r, s) {
    var n, t, o, h, k, d, p, v, ds, x;
    if (s <= 1) {
      t = ri(r, 1, s === 0 ? 5 : 9); o = ri(r, 0, s === 0 ? 5 : 9); n = t * 10 + o;
      return { q: '?', a: S(n), aid: { ten: [t, o] }, hint: 'Count tens and ones', eq: S(n) };
    }
    if (s === 2) {
      k = ri(r, 0, 2);
      if (k === 0) { t = ri(r, 1, 9); o = ri(r, 1, 9); return { q: (t * 10) + ' + ' + o, a: S(t * 10 + o) }; }
      if (k === 1) { n = ri(r, 10, 89); return { q: '10 more than ' + n, a: S(n + 10), eq: n + ' + 10' }; }
      n = ri(r, 20, 99); return { q: '10 less than ' + n, a: S(n - 10), eq: n + ' ' + SUB + ' 10' };
    }
    if (s === 3) {
      n = ri(r, 10, 99); t = Math.floor(n / 10); o = n % 10;
      return r.chance(0.5) ? { q: 'Tens digit of ' + n, a: S(t), eq: S(t) } : { q: 'Ones digit of ' + n, a: S(o), eq: S(o) };
    }
    if (s === 4) {
      n = ri(r, 101, 199); h = 1; t = Math.floor(n / 10) % 10; o = n % 10;
      k = ri(r, 0, 2);
      if (k === 0) return { q: '100 + ' + (t * 10) + ' + ' + o, a: S(n) };
      return k === 1 ? { q: 'Tens digit of ' + n, a: S(t), eq: S(t) } : { q: 'Ones digit of ' + n, a: S(o), eq: S(o) };
    }
    if (s === 5) {
      k = ri(r, 0, 3);
      if (k === 0) { n = ri(r, 100, 190); return { q: '10 more than ' + n, a: S(n + 10), eq: n + ' + 10' }; }
      if (k === 1) { n = ri(r, 110, 200); return { q: '10 less than ' + n, a: S(n - 10), eq: n + ' ' + SUB + ' 10' }; }
      if (k === 2) { n = ri(r, 1, 99); return { q: '100 more than ' + n, a: S(n + 100), eq: n + ' + 100' }; }
      n = ri(r, 100, 200); return { q: '100 less than ' + n, a: S(n - 100), eq: n + ' ' + SUB + ' 100' };
    }
    k = ri(r, 0, s === 6 ? 2 : 5);
    if (k === 0) { n = ri(r, 2, 20); return { q: 'How many tens in ' + (n * 10) + '?', a: S(n), eq: S(n) }; }
    if (k === 1 || k === 3) {
      n = ri(r, 101, 199); ds = digitsOf(n);
      p = ri(r, 1, 2); d = +ds[p]; if (d === 0 || ds.filter(function (z) { return +z === d; }).length > 1) return null;
      v = d * (p === 1 ? 10 : 1);
      return { q: 'Value of ' + d + ' in ' + n + '?', a: S(v), eq: S(v) };
    }
    if (k === 2) {
      t = ri(r, 1, 9) * 10; o = ri(r, 1, 9);
      return { q: o + ' + 100 + ' + t, a: S(100 + t + o) };
    }
    if (k === 4) {
      var a1 = ri(r, 100, 199), b1 = ri(r, 100, 199); if (a1 === b1) return null;
      x = r.chance(0.5);
      return { q: (x ? 'Bigger: ' : 'Smaller: ') + a1 + ' or ' + b1 + '?', a: S(x ? Math.max(a1, b1) : Math.min(a1, b1)), eq: S(x ? Math.max(a1, b1) : Math.min(a1, b1)) };
    }
    n = ri(r, 100, 199); return { q: '1 more than ' + n, a: S(n + 1), eq: n + ' + 1' };
  });

  T({
    id: 'm4.3', run: ['bridge', 'tower'], n: 3, world: 4, strand: 'B', ans: 'num', title: 'Skip counting',
    exp: 'Gr2 B1: skip count by 2s, 5s, 10s, 25s to 200 from various starting points, forward and backward'
  }, function (r, s) {
    var steps = s === 0 ? [2, 10] : s === 1 ? [2, 5, 10] : s === 2 ? [5, 10] : s === 3 ? [2, 5, 10] : [2, 5, 10, 25];
    var step = r.pick(steps), max = [40, 60, 100, 100, 200, 200, 200, 200][s], L = s === 7 ? 5 : 4, down = s >= 5 && r.chance(0.4);
    var off = (s >= 6 && step !== 25) ? ri(r, 1, step - 1) : 0;
    if (step === 2 && off) off = 1;
    var span = (L - 1) * step, start, i, terms = [], blank;
    if (!down) {
      var top = max - span - off; if (top < step) return null;
      start = r.step(step, top, step) + off; if (s <= 1 && start > 20 + step * 2) start = step * ri(r, 1, 6) + off;
      for (i = 0; i < L; i++) terms.push(start + i * step);
    } else {
      start = r.step(step, max, step) + off; if (start > max || start - span < 1) return null;
      for (i = 0; i < L; i++) terms.push(start - i * step);
    }
    blank = s <= 1 ? L - 1 : s === 2 ? ri(r, 1, L - 2) : ri(r, s >= 6 ? 0 : 1, L - 1);
    var ans = terms[blank], shown = terms.map(function (v, j) { return j === blank ? '_' : S(v); });
    return { q: shown.join(', '), a: S(ans), eq: S(ans), hint: down ? 'Count back by ' + step : 'Count by ' + step };
  });

  T({
    id: 'm4.4', n: 4, world: 4, strand: 'B', ans: 'num', title: 'Equal groups',
    exp: 'Gr2 B2: multiplication as equal groups and repeated addition (2s, 5s, 10s), equal sharing, half and quarter of a number'
  }, function (r, s) {
    var f, a, b, k, g, n, i, dots;
    if (s <= 1) {
      f = s === 0 ? 2 : 5; a = ri(r, 1, 5); dots = [];
      for (i = 0; i < a; i++) dots.push(f);
      return { q: a + ' ' + MUL + ' ' + f, a: S(a * f), aid: { dots: dots }, hint: a + ' groups of ' + f };
    }
    if (s === 2) {
      f = r.pick([2, 10]); a = ri(r, 2, 6);
      if (r.chance(0.5)) return { q: new Array(a + 1).join(f + ' + ').slice(0, -3), a: S(a * f) };
      return { q: a + ' ' + MUL + ' ' + f, a: S(a * f), hint: a + ' groups of ' + f };
    }
    if (s === 3) {
      f = r.pick([2, 5, 10]); a = ri(r, 1, 6);
      if (r.chance(0.5)) { dots = []; if (f <= 5) { for (i = 0; i < a; i++) dots.push(f); return { q: f + ' ' + MUL + ' ' + a, a: S(a * f), aid: { dots: dots } }; } }
      return r.chance(0.5) ? { q: a + ' ' + MUL + ' ' + f, a: S(a * f) } : { q: f + ' ' + MUL + ' ' + a, a: S(a * f) };
    }
    if (s === 4) {
      f = r.pick([2, 5, 10]); a = ri(r, 2, 10);
      return r.chance(0.5) ? { q: a + ' ' + MUL + ' ' + f, a: S(a * f) } : { q: f + ' ' + MUL + ' ' + a, a: S(a * f) };
    }
    k = ri(r, 0, s === 5 ? 2 : 5);
    if (k === 0) {
      g = ri(r, 2, 9); n = r.pick([2, 5, 10]);
      return { q: g + ' bags of ' + n + ' ' + r.pick(['pucks', 'apples', 'cards', 'berries']) + '. How many?', a: S(g * n), eq: g + ' ' + MUL + ' ' + n };
    }
    if (k === 1) {
      n = ri(r, 1, s === 5 ? 10 : 20) * 2;
      return { q: 'Half of ' + n, a: S(n / 2), eq: n + ' ' + DIV + ' 2' };
    }
    if (k === 2) {
      n = ri(r, 1, s === 5 ? 5 : 10) * 4;
      return { q: 'Quarter of ' + n, a: S(n / 4), eq: n + ' ' + DIV + ' 4' };
    }
    if (k === 3) {
      f = r.pick([2, 5, 10]); a = ri(r, 2, 10);
      return r.chance(0.5) ? { q: f + ' ' + MUL + ' _ = ' + (f * a), a: S(a) } : { q: '_ ' + MUL + ' ' + f + ' = ' + (f * a), a: S(a) };
    }
    if (k === 4) {
      g = r.pick([2, 5]); n = ri(r, 2, 10);
      return { q: (g * n) + ' ' + r.pick(['cards', 'stickers', 'berries', 'pucks']) + ' shared by ' + g + ' kids. Each?', a: S(n), eq: (g * n) + ' ' + DIV + ' ' + g };
    }
    g = ri(r, 2, 5); n = ri(r, 2, 10);
    return { q: g + ' kids with ' + n + ' ' + r.pick(['stickers', 'toques', 'cards']) + ' each. Total?', a: S(g * n), eq: g + ' ' + MUL + ' ' + n };
  });

  T({
    id: 'm4.5', run: ['bridge', 'tower'], n: 5, world: 4, strand: 'B', ans: 'frac', equiv: true, title: 'Fractions',
    exp: 'Gr2 B1: halves, thirds, fourths and other equal parts of a whole or a set; name fractions; compare unit fractions (largest denominator UNCERTAIN: kept to 8)'
  }, function (r, s) {
    var d, n, k, tot, red, th, x, d2;
    if (s === 0) {
      d = r.pick([2, 3, 4, 2, 4]); x = r.pick(['?', 'What fraction?', '1 of ' + d + ' equal parts', 'Fraction shaded?']);
      return { q: x, a: '1/' + d, aid: { frac: { n: 1, d: d }, layout: r.pick(['circle', 'row']) }, hint: 'One equal part shaded', eq: '1/' + d };
    }
    if (s === 1) { d = r.pick([2, 3, 4]); return { q: '?', a: '1/' + d, aid: { frac: { n: 1, d: d }, layout: r.pick(['circle', 'row']) }, hint: 'One part out of equal parts', eq: '1/' + d }; }
    if (s === 2) { d = ri(r, 2, 6); return { q: '1 of ' + d + ' equal parts', a: '1/' + d, eq: '1/' + d }; }
    if (s === 3) { d = ri(r, 3, 4 + (r.chance(0.5) ? 2 : 0)); n = ri(r, 2, d - 1); return { q: '?', a: n + '/' + d, aid: { frac: { n: n, d: d } }, eq: n + '/' + d, hint: 'Shaded parts over all parts' }; }
    if (s === 4) {
      tot = ri(r, 3, 8); red = ri(r, 1, tot - 1); th = r.pick(['apples', 'stars', 'balls', 'cards', 'berries', 'shells']); x = r.pick(['red', 'blue', 'green', 'gold']);
      return { q: red + ' of ' + tot + ' ' + th + ' are ' + x, a: red + '/' + tot, aid: { dots: [red, tot - red] }, eq: red + '/' + tot };
    }
    if (s === 5) {
      d = ri(r, 2, 6); d2 = ri(r, 2, 6); if (d === d2) return null;
      x = r.chance(0.5);
      return { q: (x ? 'Bigger: ' : 'Smaller: ') + '1/' + d + ' or 1/' + d2 + '?', a: '1/' + (x ? Math.min(d, d2) : Math.max(d, d2)), eq: '1/' + (x ? Math.min(d, d2) : Math.max(d, d2)), hint: 'More parts means smaller parts' };
    }
    k = ri(r, 0, 2);
    if (k === 0) { d = ri(r, 3, 8); n = ri(r, 1, d - 1); return { q: r.pick(['Pizza', 'Pie', 'Pancake', 'Bannock']) + ' cut in ' + d + '. Ate ' + n + '. Fraction eaten?', a: n + '/' + d, eq: n + '/' + d }; }
    if (k === 1) { d = ri(r, 3, 8); n = ri(r, 1, d - 1); return { q: r.pick(['Pizza', 'Pie', 'Pancake', 'Bannock']) + ' cut in ' + d + '. Ate ' + n + '. Fraction left?', a: (d - n) + '/' + d, eq: (d - n) + '/' + d }; }
    d = ri(r, 2, 8); d2 = ri(r, 2, 8); if (d === d2) return null; x = r.chance(0.5);
    return { q: (x ? 'Bigger: ' : 'Smaller: ') + '1/' + d + ' or 1/' + d2 + '?', a: '1/' + (x ? Math.min(d, d2) : Math.max(d, d2)), eq: '1/' + (x ? Math.min(d, d2) : Math.max(d, d2)) };
  });

  T({
    id: 'm4.6', run: ['bridge', 'tower'], n: 6, world: 4, strand: 'F', ans: 'money', title: 'Coins and change',
    exp: 'Gr2 F1: Canadian coins (nickel 5c, dime 10c, quarter 25c, loonie $1, toonie $2), counting amounts to $2, change; no pennies (amounts in 5c steps)'
  }, function (r, s) {
    var coins, i, tot, cost, pay, k, items, a, b, c, nm, ce, pool;
    function sum(arr) { var t = 0, j; for (j = 0; j < arr.length; j++) t += arr[j]; return t; }
    function eqOf(arr) { return arr.map(function (v) { return v + '¢'; }).join(' + '); }
    function changeQ() {
      var maxPay = s >= 5 ? 200 : 100, p = maxPay;
      cost = r.step(s >= 5 ? 45 : 5, maxPay - 5, 5); pay = p;
      if (cost >= pay) return null;
      return { q: 'Cost ' + F.money(cost) + '. Pay ' + F.money(pay) + '. Change?', a: ansM(pay - cost), eq: pay + '¢ ' + SUB + ' ' + cost + '¢', hint: 'Count up from the cost' };
    }
    if (s <= 1) {
      var n = ri(r, 2, s === 0 ? 4 : 6); pool = s === 0 ? [5, 10] : [5, 10, 25];
      coins = []; for (i = 0; i < n; i++) coins.push(r.pick(pool));
      coins.sort(function (x, y) { return y - x; }); tot = sum(coins); if (tot >= 100) return null;
      return { q: 'How many ¢?', a: S(tot), aid: { coins: coins }, eq: eqOf(coins), hint: 'Count by 25s, 10s, 5s' };
    }
    if (s === 2) {
      n = ri(r, 2, 4); coins = []; for (i = 0; i < n; i++) coins.push(r.pick([5, 10, 25]));
      tot = sum(coins); if (tot >= 100) return null;
      return { q: coins.join('¢ + ') + '¢', a: S(tot) };
    }
    if (s === 3) {
      coins = [r.pick([100, 100, 200])]; n = ri(r, 1, 3);
      for (i = 0; i < n; i++) coins.push(r.pick([5, 10, 25, 50]));
      tot = sum(coins); if (tot > 200) return null;
      return { q: coins.map(function (v) { return F.money(v); }).join(' + '), a: ansM(tot) };
    }
    if (s === 4) return changeQ();
    if (s === 5) return changeQ();
    k = ri(r, 0, s === 6 ? 1 : 3);
    if (k === 0) {
      a = r.step(25, 95, 5); b = r.step(25, 105, 5); if (a + b > 200) return null;
      items = r.pick([['Gum', 'toy'], ['Pencil', 'eraser'], ['Apple', 'bun'], ['Map', 'pin']]);
      return { q: items[0] + ' ' + F.money(a) + ', ' + items[1] + ' ' + F.money(b) + '. Total?', a: ansM(a + b), eq: a + '¢ + ' + b + '¢' };
    }
    if (k === 1) return changeQ();
    ce = r.pick([['quarters', 25], ['dimes', 10], ['nickels', 5], ['quarters', 25]]);
    tot = r.pick([50, 100, 100, 200]); if (ce[1] === 5 && tot > 100) tot = 100;
    return { q: ce[0].charAt(0).toUpperCase() + ce[0].slice(1) + ' in ' + F.money(tot) + '?', a: S(tot / ce[1]), eq: tot + '¢ ' + DIV + ' ' + ce[1] + '¢', cnt: true };
  });

  T({
    id: 'm4.7', n: 7, world: 4, strand: 'E', ans: 'num', units: ['cm', 'm', 'min'], title: 'Time, length, symmetry',
    exp: 'Gr2 E1: read analog clocks to 5 minutes (typed as minutes past the hour), days/weeks/hours/months, cm and m, elapsed time within an hour (to 5 minutes); lines of symmetry in common shapes (symmetry placement UNCERTAIN)'
  }, function (r, s) {
    var h, m, a, b, k, st, d, en, sy;
    function symQ() { sy = r.pick([['square', 4], ['rectangle', 2], ['equilateral triangle', 3], ['heart', 1], ['letter A', 1], ['letter H', 2], ['letter T', 1], ['letter M', 1]]); return { q: 'Lines of symmetry: ' + sy[0] + '?', a: S(sy[1]), eq: S(sy[1]), hint: 'Fold it so the halves match' }; }
    function halfQ() { a = ri(r, 2, 9); return { q: 'Mirror line. ' + a + ' squares on one side. Whole shape?', a: S(2 * a), eq: '2 ' + MUL + ' ' + a, hint: 'Both sides match' }; }
    function clk(hh, mm) { return F.time(hh, mm); }
    if (s === 0) { h = ri(r, 1, 12); return { q: 'What hour?', a: S(h), aid: { clock: { h: h, m: 0 } }, eq: S(h), hint: 'Short hand points to the hour' }; }
    if (s === 1) { h = ri(r, 1, 12); m = r.pick([15, 30, 45]); return { q: 'Minutes after the hour?', a: S(m), aid: { clock: { h: h, m: m } }, eq: S(m), hint: 'Long hand: count by 5s' }; }
    if (s === 2) { h = ri(r, 1, 12); m = ri(r, 1, 11) * 5; return { q: 'Minutes after the hour?', a: S(m), aid: { clock: { h: h, m: m } }, eq: S(m), hint: 'Each number is 5 minutes' }; }
    if (s === 3) {
      var facts = [['Days in a week?', 7], ['Days in 2 weeks?', 14], ['Days in 3 weeks?', 21], ['Hours in a day?', 24], ['Months in a year?', 12], ['Minutes in an hour?', 60], ['Minutes in half an hour?', 30], ['Days in 4 weeks?', 28], ['Weeks in 2 weeks?', 2]];
      facts.pop();
      if (r.chance(0.3)) return symQ();
      k = r.pick(facts); return { q: k[0], a: S(k[1]), eq: S(k[1]) };
    }
    if (s === 4) {
      k = ri(r, 0, 2);
      if (k === 0) { a = ri(r, 1, 2); return { q: a + ' m = _ cm', a: S(a * 100), eq: a + ' ' + MUL + ' 100' }; }
      a = ri(r, 10, 60); b = ri(r, 5, 35);
      return k === 1 ? { q: a + ' cm + ' + b + ' cm', a: S(a + b), eq: a + ' + ' + b } : { q: (a + b) + ' cm ' + SUB + ' ' + b + ' cm', a: S(a), eq: (a + b) + ' ' + SUB + ' ' + b };
    }
    if (s === 5) {
      k = ri(r, 0, 2);
      if (k === 0) { a = ri(r, 30, 90); b = ri(r, 10, 25); return { q: 'Ribbon ' + a + ' cm. Cut ' + b + ' cm. Left?', a: S(a - b), eq: a + ' ' + SUB + ' ' + b }; }
      if (k === 1) { a = ri(r, 10, 40); b = ri(r, 5, 20); return { q: 'Pen ' + a + ' cm, pencil ' + (a + b) + ' cm. How much longer?', a: S(b), eq: (a + b) + ' ' + SUB + ' ' + a }; }
      a = ri(r, 20, 60); b = ri(r, 20, 40); return { q: 'Snake ' + a + ' cm. Another ' + b + ' cm. Both?', a: S(a + b), eq: a + ' + ' + b };
    }
    if (s === 6) {
      h = ri(r, 1, 11); m = ri(r, 0, 5) * 5; d = ri(r, 1, Math.floor((55 - m) / 5)) * 5; if (m + d > 55) return null;
      return { q: 'Start ' + clk(h, m) + ', end ' + clk(h, m + d) + '. Minutes?', a: S(d), eq: S(d) };
    }
    k = ri(r, 0, 5);
    if (k === 4) return symQ();
    if (k === 5) return halfQ();
    if (k === 0) { h = ri(r, 1, 11); m = ri(r, 0, 11) * 5; d = ri(r, 2, 11) * 5; en = h * 60 + m + d; return { q: 'Start ' + clk(h, m) + ', end ' + clk(Math.floor(en / 60), en % 60) + '. Minutes?', a: S(d), eq: S(d) }; }
    if (k === 1) { a = ri(r, 2, 8); return { q: 'Days in ' + a + ' weeks?', a: S(a * 7), eq: a + ' ' + MUL + ' 7' }; }
    if (k === 2) { a = ri(r, 2, 4); return { q: 'Hours in ' + a + ' days?', a: S(a * 24), eq: a + ' ' + MUL + ' 24' }; }
    a = ri(r, 1, 6) * 5; b = ri(r, 1, 6) * 5; return { q: a + ' min + ' + b + ' min', a: S(a + b), eq: a + ' + ' + b };
  });

  /* ================= WORLD 5: GRADE 3 ================= */

  T({
    id: 'm5.1', run: ['bridge', 'tower'], n: 1, world: 5, strand: 'B', ans: 'num', title: 'Add and subtract 1000',
    exp: 'Gr3 B2: add and subtract to 1000 (regrouping), missing number in an equation (C)'
  }, function (r, s) {
    var sub = r.chance(0.5), a, b, c, cr, k, nm, th;
    if (s === 0) {
      if (!sub) { a = ri(r, 1, 8) * 100; b = ri(r, 1, 9 - a / 100) * 100; return { q: a + ' + ' + b, a: S(a + b), hint: 'Add the hundreds' }; }
      a = ri(r, 2, 9) * 100; b = ri(r, 1, a / 100 - 1) * 100; return { q: a + ' ' + SUB + ' ' + b, a: S(a - b), hint: 'Take away the hundreds' };
    }
    if (s === 1) {
      a = ri(r, 101, 899); b = r.chance(0.5) ? r.step(10, 90, 10) : r.step(100, 500, 100);
      if (!sub) { c = a + b; if (c > 999 || carries(a, b)) return null; return { q: a + ' + ' + b, a: S(c) }; }
      if (b >= a || borrows(a, b)) return null; return { q: a + ' ' + SUB + ' ' + b, a: S(a - b) };
    }
    if (s === 2) {
      a = ri(r, 101, 899); b = ri(r, 11, 99);
      if (!sub) { c = a + b; if (c > 999 || carries(a, b)) return null; return { q: a + ' + ' + b, a: S(c) }; }
      if (b >= a || borrows(a, b)) return null; return { q: a + ' ' + SUB + ' ' + b, a: S(a - b) };
    }
    if (s === 3) {
      a = ri(r, 101, 899); b = ri(r, 101, 800);
      if (!sub) { c = a + b; if (c > 999 || carries(a, b)) return null; return { q: a + ' + ' + b, a: S(c) }; }
      if (b >= a || borrows(a, b)) return null; return { q: a + ' ' + SUB + ' ' + b, a: S(a - b) };
    }
    var hiB = s === 4 ? 99 : 899;
    if (s === 6 && sub && r.chance(0.4)) { a = ri(r, 2, 10) * 100; b = ri(r, 101, a - 1); if (b >= a) return null; return { q: a + ' ' + SUB + ' ' + b, a: S(a - b) }; }
    a = ri(r, 101, 899); b = ri(r, s === 4 ? 11 : 101, hiB);
    if (!sub) { c = a + b; if (c > 1000) return null; cr = carries(a, b); if (s === 4 ? cr < 1 : s === 5 ? cr < 1 : cr < 2) return null; }
    else { if (b >= a) return null; c = a - b; cr = borrows(a, b); if (s === 4 ? cr < 1 : s === 5 ? cr < 1 : cr < 2) return null; }
    if (s === 7 && r.chance(0.45)) {
      k = ri(r, 0, 3);
      if (!sub) return k === 0 ? { q: '_ + ' + b + ' = ' + c, a: S(a) } : k === 1 ? { q: a + ' + _ = ' + c, a: S(b) } : k === 2 ? { q: c + ' ' + SUB + ' _ = ' + a, a: S(b) } : { q: c + ' ' + SUB + ' ' + b + ' = _', a: S(a) };
      return k < 2 ? { q: a + ' ' + SUB + ' _ = ' + c, a: S(b) } : { q: '_ ' + SUB + ' ' + b + ' = ' + c, a: S(a) };
    }
    if (s >= 5 && r.chance(0.2)) {
      nm = r.pick(NAMES); th = r.pick(THINGS);
      if (!sub) return { q: nm + ' has ' + a + ' ' + th + '. Gets ' + b + ' more. Total?', a: S(c), eq: a + ' + ' + b };
      return { q: nm + ' has ' + a + ' ' + th + '. Gives ' + b + ' away. Left?', a: S(c), eq: a + ' ' + SUB + ' ' + b };
    }
    return { q: a + (sub ? ' ' + SUB + ' ' : ' + ') + b, a: S(c), hint: sub ? 'Borrow when you need to' : 'Carry when you need to' };
  });

  T({
    id: 'm5.2', n: 2, world: 5, strand: 'B', ans: 'num', title: 'Place value and rounding',
    exp: 'Gr3 B1: place value to 1000, 10/100 more or less, comparing and ordering, rounding to the nearest 10 and 100'
  }, function (r, s) {
    var n, t, o, h, k, d, p, v, ds, x, a1, b1, c1, arr;
    if (s === 0) { h = ri(r, 1, 9); t = ri(r, 0, 9); o = ri(r, 1, 9); return { q: (h * 100) + ' + ' + (t * 10) + ' + ' + o, a: S(h * 100 + t * 10 + o) }; }
    if (s === 1) {
      n = ri(r, 101, 999); ds = digitsOf(n); k = ri(r, 0, 2);
      return { q: ['Hundreds', 'Tens', 'Ones'][k] + ' digit of ' + n, a: ds[k], eq: ds[k] };
    }
    if (s === 2) {
      if (r.chance(0.5)) {
        n = ri(r, 101, 999); ds = digitsOf(n); p = ri(r, 0, 2); d = +ds[p];
        if (d === 0 || ds.filter(function (z) { return +z === d; }).length > 1) return null;
        v = d * Math.pow(10, 2 - p); return { q: 'Value of ' + d + ' in ' + n + '?', a: S(v), eq: S(v) };
      }
      n = ri(r, 2, 99); return { q: 'How many tens in ' + (n * 10) + '?', a: S(n), eq: S(n) };
    }
    if (s === 3) {
      n = ri(r, 11, 99); v = Math.round(n / 10) * 10; if (n % 10 === 0) return null;
      return { q: 'Round ' + n + ' to nearest 10', a: S(v), eq: S(v), hint: '5 or more rounds up' };
    }
    if (s === 4) {
      n = ri(r, 101, 999); if (n % 10 === 0) return null; v = Math.round(n / 10) * 10;
      return { q: 'Round ' + n + ' to nearest 10', a: S(v), eq: S(v), hint: '5 or more rounds up' };
    }
    if (s === 5) {
      n = ri(r, 101, 999); if (n % 100 === 0) return null; v = Math.round(n / 100) * 100;
      return { q: 'Round ' + n + ' to nearest 100', a: S(v), eq: S(v), hint: '50 or more rounds up' };
    }
    if (s === 6) {
      k = ri(r, 0, 3);
      if (k === 0) { n = ri(r, 100, 989); return { q: '10 more than ' + n, a: S(n + 10), eq: n + ' + 10' }; }
      if (k === 1) { n = ri(r, 110, 999); return { q: '10 less than ' + n, a: S(n - 10), eq: n + ' ' + SUB + ' 10' }; }
      if (k === 2) { n = ri(r, 100, 899); return { q: '100 more than ' + n, a: S(n + 100), eq: n + ' + 100' }; }
      n = ri(r, 200, 999); return { q: '100 less than ' + n, a: S(n - 100), eq: n + ' ' + SUB + ' 100' };
    }
    k = ri(r, 0, 4);
    if (k === 0) { n = ri(r, 950, 999); if (n % 10 === 0) return null; v = Math.round(n / 10) * 10; return { q: 'Round ' + n + ' to nearest 10', a: S(v), eq: S(v) }; }
    if (k === 1) { n = ri(r, 101, 999); if (n % 100 === 0) return null; v = Math.round(n / 100) * 100; return { q: 'Round ' + n + ' to nearest 100', a: S(v), eq: S(v) }; }
    if (k === 2) {
      a1 = ri(r, 100, 999); b1 = ri(r, 100, 999); if (a1 === b1) return null; x = r.chance(0.5);
      v = x ? Math.max(a1, b1) : Math.min(a1, b1); return { q: (x ? 'Bigger: ' : 'Smaller: ') + a1 + ' or ' + b1 + '?', a: S(v), eq: S(v) };
    }
    if (k === 3) {
      a1 = ri(r, 100, 999); b1 = ri(r, 100, 999); c1 = ri(r, 100, 999); if (a1 === b1 || b1 === c1 || a1 === c1) return null;
      arr = [a1, b1, c1]; x = r.chance(0.5); v = x ? Math.max.apply(null, arr) : Math.min.apply(null, arr);
      return { q: (x ? 'Biggest: ' : 'Smallest: ') + a1 + ', ' + b1 + ', ' + c1, a: S(v), eq: S(v) };
    }
    h = ri(r, 1, 9); t = ri(r, 1, 9); o = ri(r, 1, 9);
    return { q: o + ' + ' + (h * 100) + ' + ' + (t * 10), a: S(h * 100 + t * 10 + o) };
  });

  T({
    id: 'm5.3', n: 3, world: 5, strand: 'B', ans: 'num', title: 'Times tables and sharing',
    exp: 'Gr3 B2: multiplication facts to 7x7, related division facts, missing factor (C), equal groups and sharing word problems'
  }, function (r, s) {
    var a, b, f, k, dots, i, g, n, ds;
    function pr(x, y, aid) { var o = { q: x + ' ' + MUL + ' ' + y, a: S(x * y) }; if (aid) o.aid = aid; return o; }
    if (s === 0) {
      f = r.pick([2, 5]); a = ri(r, 2, 5); dots = [];
      for (i = 0; i < a; i++) dots.push(f);
      return { q: a + ' ' + MUL + ' ' + f, a: S(a * f), aid: { dots: dots }, hint: a + ' groups of ' + f };
    }
    if (s === 1) { f = r.pick([2, 3, 4]); a = ri(r, 2, 7); dots = []; if (a * f <= 21 && r.chance(0.4)) { for (i = 0; i < a; i++) dots.push(f); return pr(a, f, { dots: dots }); } return r.chance(0.5) ? pr(a, f) : pr(f, a); }
    if (s === 2) { f = r.pick([4, 5, 6]); a = ri(r, 2, 7); return r.chance(0.5) ? pr(a, f) : pr(f, a); }
    if (s === 3) { a = ri(r, 2, 7); b = ri(r, 2, 7); return pr(a, b); }
    if (s === 4) { b = ri(r, 2, 5); a = ri(r, 2, 7); return { q: (a * b) + ' ' + DIV + ' ' + b, a: S(a), hint: 'Think of the times table' }; }
    if (s === 5) { b = ri(r, 2, 7); a = ri(r, 2, 7); return { q: (a * b) + ' ' + DIV + ' ' + b, a: S(a), hint: 'Think of the times table' }; }
    k = ri(r, 0, s === 6 ? 3 : 5);
    a = ri(r, 2, 7); b = ri(r, 2, 7);
    if (k === 0) return { q: a + ' ' + MUL + ' _ = ' + (a * b), a: S(b) };
    if (k === 1) return { q: '_ ' + MUL + ' ' + b + ' = ' + (a * b), a: S(a) };
    if (k === 2) return { q: (a * b) + ' ' + DIV + ' _ = ' + a, a: S(b) };
    if (k === 3) return { q: (a * b) + ' ' + DIV + ' ' + a + ' = _', a: S(b) };
    if (k === 4) return { q: a + ' bags of ' + b + ' ' + r.pick(['pucks', 'apples', 'cards', 'berries']) + '. How many?', a: S(a * b), eq: a + ' ' + MUL + ' ' + b };
    ds = r.chance(0.5);
    return ds ? { q: (a * b) + ' ' + r.pick(['cards', 'stickers', 'berries']) + ' shared by ' + a + ' kids. Each?', a: S(b), eq: (a * b) + ' ' + DIV + ' ' + a }
      : { q: a + ' rows of ' + b + ' seats. How many seats?', a: S(a * b), eq: a + ' ' + MUL + ' ' + b };
  });

  T({
    id: 'm5.4', run: ['bridge', 'tower'], n: 4, world: 5, strand: 'B', ans: 'frac', equiv: true, title: 'Fractions',
    exp: 'Gr3 B1: unit and non-unit fractions of a whole or set, compare fractions with the same denominator or the same numerator (unit fractions), add like denominators (UNCERTAIN: may be Gr4 in the 2020 document)'
  }, function (r, s) {
    var d, n, k, tot, red, th, x, d2, n2, v;
    if (s === 0) { d = ri(r, 2, 6); return { q: '?', a: '1/' + d, aid: { frac: { n: 1, d: d }, layout: r.pick(['circle', 'row']) }, eq: '1/' + d, hint: 'One part out of equal parts' }; }
    if (s === 1) { d = ri(r, 3, 8); n = ri(r, 2, d - 1); return { q: '?', a: n + '/' + d, aid: { frac: { n: n, d: d } }, eq: n + '/' + d, hint: 'Shaded parts over all parts' }; }
    if (s === 2) { d = ri(r, 3, 10); n = ri(r, 1, d - 1); return { q: n + ' of ' + d + ' equal parts', a: n + '/' + d, eq: n + '/' + d }; }
    if (s === 3 || s === 4) {
      d = ri(r, 3, 10); n = ri(r, 1, d - 1); n2 = ri(r, 1, d - 1); if (n === n2) return null; x = r.chance(0.5);
      v = x ? Math.max(n, n2) : Math.min(n, n2);
      return { q: (x ? 'Bigger: ' : 'Smaller: ') + n + '/' + d + ' or ' + n2 + '/' + d + '?', a: v + '/' + d, eq: v + '/' + d, hint: 'Same size parts: compare the tops' };
    }
    if (s === 5) {
      d = ri(r, 2, 10); d2 = ri(r, 2, 10); if (d === d2) return null; x = r.chance(0.5);
      v = x ? Math.min(d, d2) : Math.max(d, d2);
      return { q: (x ? 'Bigger: ' : 'Smaller: ') + '1/' + d + ' or 1/' + d2 + '?', a: '1/' + v, eq: '1/' + v, hint: 'More parts means smaller parts' };
    }
    k = ri(r, 0, s === 6 ? 1 : 3);
    if (k === 0) { tot = ri(r, 4, 12); red = ri(r, 1, tot - 1); th = r.pick(['apples', 'stars', 'balls', 'cards']); return { q: red + ' of ' + tot + ' ' + th + ' are red', a: red + '/' + tot, aid: { dots: [red, tot - red] }, eq: red + '/' + tot }; }
    if (k === 1) { tot = ri(r, 4, 12); red = ri(r, 1, tot - 1); th = r.pick(['apples', 'stars', 'balls', 'cards']); return { q: red + ' of ' + tot + ' ' + th + ' are red. Fraction not red?', a: (tot - red) + '/' + tot, eq: (tot - red) + '/' + tot }; }
    d = ri(r, 4, 12); n = ri(r, 1, d - 3); n2 = ri(r, 1, d - n - 1);
    return { q: n + '/' + d + ' + ' + n2 + '/' + d, a: (n + n2) + '/' + d, hint: 'Add the tops. Keep the bottom' };
  });

  T({
    id: 'm5.5', run: ['bridge', 'tower'], n: 5, world: 5, strand: 'F', ans: 'money', title: 'Money and change',
    exp: 'Gr3 F1: Canadian money to $10, adding prices, multiplying a price, change from $5 or $10, rounding cash totals to the nearest 5c (cash rounding UNCERTAIN for Gr3); no pennies'
  }, function (r, s) {
    var a, b, c, cost, pay, k, n, i, coins, tot, ce, items, x, rr;
    function P(c) { return F.money(c); }
    function changeQ(maxPay) {
      cost = r.step(maxPay === 500 ? 55 : 205, maxPay - 5, 5); pay = maxPay; if (cost >= pay) return null;
      return { q: 'Cost ' + P(cost) + '. Pay ' + P(pay) + '. Change?', a: ansM(pay - cost), eq: pay + '¢ ' + SUB + ' ' + cost + '¢', hint: 'Count up from the cost' };
    }
    if (s === 0) {
      n = ri(r, 3, 4); coins = []; for (i = 0; i < n; i++) coins.push(r.pick([5, 10, 25, 25, 100, 200]));
      tot = 0; for (i = 0; i < n; i++) tot += coins[i]; if (tot > 500) return null;
      coins.sort(function (p1, p2) { return p2 - p1; });
      x = coins.map(P).join(' + '); if (x.length > 28) return null;
      return { q: x, a: ansM(tot) };
    }
    if (s === 1) {
      a = r.step(105, 295, 5); b = r.step(105, 295, 5); if (a + b > 500) return null;
      return { q: P(a) + ' + ' + P(b), a: ansM(a + b) };
    }
    if (s === 2) {
      a = r.step(25, 250, 5); n = ri(r, 2, 4); if (a * n > 1000) return null;
      return { q: n + ' ' + MUL + ' ' + P(a), a: ansM(a * n) };
    }
    if (s === 3) return changeQ(500);
    if (s === 4) return changeQ(1000);
    if (s === 5) {
      n = ri(r, 2, 3); a = r.step(75, 395, 5); b = r.step(75, 395, 5); c = n === 3 ? r.step(75, 295, 5) : 0;
      if (a + b + c > 1000) return null;
      items = r.shuffle(['Hat', 'book', 'toy', 'cap', 'map', 'ball', 'cup']);
      return { q: items[0] + ' ' + P(a) + ', ' + items[1] + ' ' + P(b) + (n === 3 ? ', ' + items[2] + ' ' + P(c) : '') + '. Total?', a: ansM(a + b + c), eq: a + '¢ + ' + b + '¢' + (n === 3 ? ' + ' + c + '¢' : '') };
    }
    k = ri(r, 0, s === 6 ? 0 : 3);
    if (k === 0) {
      a = r.step(105, 395, 5); b = r.step(105, 395, 5); pay = 1000; if (a + b >= pay) return null;
      return { q: 'Buy ' + P(a) + ' and ' + P(b) + '. Pay ' + P(pay) + '. Change?', a: ansM(pay - a - b), eq: pay + '¢ ' + SUB + ' (' + a + '¢ + ' + b + '¢)' };
    }
    if (k === 1) { cost = ri(r, 105, 995); x = Math.round(cost / 5) * 5; if (cost % 5 === 0) return null; return { q: 'Round ' + P(cost) + ' to nearest 5¢', a: ansM(x), eq: ansM(x), hint: '1, 2 round down. 3, 4 round up' }; }
    if (k === 2) { ce = r.pick([['quarters', 25, [100, 200, 500]], ['loonies', 100, [300, 500, 800]], ['toonies', 200, [400, 600, 1000]], ['dimes', 10, [100, 200]]]); tot = r.pick(ce[2]); return { q: ce[0].charAt(0).toUpperCase() + ce[0].slice(1) + ' in ' + P(tot) + '?', a: S(tot / ce[1]), eq: tot + '¢ ' + DIV + ' ' + ce[1] + '¢', cnt: true }; }
    n = ri(r, 3, 6); a = r.step(25, 195, 5); if (a * n > 1000) return null;
    return { q: n + ' for ' + P(a * n) + '. Cost of one?', a: ansM(a), eq: '_ ' + MUL + ' ' + n + ' = ' + (a < 100 ? (a * n) : (a * n / 100)) };
  });

  T({
    id: 'm5.6', run: ['bridge', 'tower'], n: 6, world: 5, strand: 'E', ans: 'num', units: ['cm', 'm', 'g', 'kg', 'ml', 'l', 'min', 'km'], title: 'Measure it',
    exp: 'Gr3 E1: perimeter of rectangles, squares and triangles, mass (g, kg), capacity (mL, L), m/cm and km/m, elapsed time in minutes (conversion limits UNCERTAIN); lines of symmetry and reflections (UNCERTAIN placement)'
  }, function (r, s) {
    var w, h, a, b, c, k, h1, m1, d, en, nm;
    if (s === 0) { w = ri(r, 2, 9); h = ri(r, 2, 9); if (w === h) return null; return { q: w + ' cm by ' + h + ' cm. Perimeter?', a: S(2 * (w + h)), aid: { grid: { w: w, h: h } }, eq: '2 ' + MUL + ' (' + w + ' + ' + h + ')', hint: 'Add all four sides' }; }
    if (s === 1) {
      if (r.chance(0.5)) { a = ri(r, 2, 12); return { q: 'Square, side ' + a + ' cm. Perimeter?', a: S(4 * a), eq: '4 ' + MUL + ' ' + a }; }
      w = ri(r, 3, 15); h = ri(r, 3, 15); if (w === h) return null; return { q: w + ' cm by ' + h + ' cm. Perimeter?', a: S(2 * (w + h)), aid: { grid: { w: w, h: h } }, eq: '2 ' + MUL + ' (' + w + ' + ' + h + ')' };
    }
    if (s === 2) {
      a = ri(r, 2, 9); b = ri(r, 2, 9); c = ri(r, 2, 9); if (a + b <= c || a + c <= b || b + c <= a) return null;
      return { q: 'Triangle: ' + a + ', ' + b + ', ' + c + ' cm. Perimeter?', a: S(a + b + c), eq: a + ' + ' + b + ' + ' + c };
    }
    if (s === 3) {
      a = ri(r, 1, 9);
      return r.chance(0.5) ? { q: a + ' kg = _ g', a: S(a * 1000), eq: a + ' ' + MUL + ' 1000' } : { q: (a * 1000) + ' g = _ kg', a: S(a), eq: S(a) };
    }
    if (s === 4) {
      a = ri(r, 1, 9); k = ri(r, 0, 3);
      if (k === 0) return { q: a + ' L = _ mL', a: S(a * 1000), eq: a + ' ' + MUL + ' 1000' };
      if (k === 1) return { q: (a * 1000) + ' mL = _ L', a: S(a), eq: S(a) };
      if (k === 2) return { q: a + ' km = _ m', a: S(a * 1000), eq: a + ' ' + MUL + ' 1000' };
      return { q: a + ' m = _ cm', a: S(a * 100), eq: a + ' ' + MUL + ' 100' };
    }
    if (s === 5) {
      h1 = ri(r, 1, 11); m1 = ri(r, 0, 11) * 5; d = ri(r, 2, 23) * 5; en = h1 * 60 + m1 + d;
      nm = r.pick(['Hockey', 'Swim', 'Class', 'Movie', 'Soccer']);
      return { q: nm + ': ' + F.time(h1, m1) + ' to ' + F.time(Math.floor(en / 60), en % 60) + '. Minutes?', a: S(d), eq: S(d) };
    }
    if (s === 6) {
      k = ri(r, 0, 3);
      if (k === 0) { a = r.step(100, 500, 50); b = r.step(100, 400, 50); return { q: a + ' g + ' + b + ' g', a: S(a + b), eq: a + ' + ' + b }; }
      if (k === 1) { a = r.step(250, 750, 250); b = r.step(250, 750, 250); return { q: a + ' mL + ' + b + ' mL', a: S(a + b), eq: a + ' + ' + b }; }
      if (k === 2) { a = ri(r, 2, 6); b = ri(r, 2, 6); return { q: 'Bag ' + a + ' kg. ' + b + ' bags. Total kg?', a: S(a * b), eq: a + ' ' + MUL + ' ' + b }; }
      a = ri(r, 2, 6); b = ri(r, 2, 5); return { q: 'Jug ' + a + ' L. Pour ' + b + ' L. How many L left?', a: S(Math.abs(a - b)), eq: a > b ? a + ' ' + SUB + ' ' + b : b + ' ' + SUB + ' ' + a, hint: 'Take away' };
    }
    k = ri(r, 0, 4);
    if (k === 3) { a = r.pick([['square', 4], ['regular pentagon', 5], ['regular hexagon', 6], ['regular octagon', 8], ['equilateral triangle', 3], ['rectangle', 2]]); return { q: 'Lines of symmetry: ' + a[0] + '?', a: S(a[1]), eq: S(a[1]), hint: 'Fold it so the halves match' }; }
    if (k === 4) { a = ri(r, 2, 9); return { q: 'Point is ' + a + ' cm from a mirror line. Point to its image (cm)?', a: S(2 * a), eq: '2 ' + MUL + ' ' + a, hint: 'Same distance on the other side' }; }
    if (k === 0) { w = ri(r, 2, 12); h = ri(r, 2, 12); if (w === h) return null; return { q: 'Perimeter ' + (2 * (w + h)) + '. Length ' + Math.max(w, h) + '. Width?', a: S(Math.min(w, h)), eq: (2 * (w + h)) + ' ' + DIV + ' 2 ' + SUB + ' ' + Math.max(w, h), hint: 'Half of the perimeter, take away length' }; }
    if (k === 1) { a = ri(r, 2, 12); return { q: 'Square perimeter ' + (4 * a) + '. Side?', a: S(a), eq: (4 * a) + ' ' + DIV + ' 4' }; }
    a = ri(r, 2, 9); b = ri(r, 2, 9); c = ri(r, 2, 9); if (a + b <= c || a + c <= b || b + c <= a) return null;
    return { q: 'Triangle: ' + a + ', ' + b + ', ' + c + ' cm. Perimeter?', a: S(a + b + c), eq: a + ' + ' + b + ' + ' + c };
  });

  T({
    id: 'm5.7', n: 7, world: 5, strand: 'D', ans: 'num', title: 'Graphs and tallies',
    exp: 'Gr3 D1: read tallies, bar graphs and tables; sums and differences from a graph; scales by 2, 5 or 10 (scale limits UNCERTAIN)'
  }, function (r, s) {
    var sets = [['Hockey', 'Soccer', 'Tennis', 'Swim'], ['Dog', 'Cat', 'Fish', 'Bird'], ['Apple', 'Pear', 'Plum', 'Grape'], ['Red', 'Blue', 'Green', 'Gold'], ['Maple', 'Pine', 'Oak', 'Birch']];
    var cats, nb, vals, i, bars, k, mx, mn, a, b, c, d, scale, labs, hi, i2, j, lst, tot, idx;
    if (s === 0) { a = ri(r, 1, 12); return { q: 'Tally count?', a: S(a), aid: { tally: a }, eq: S(a), hint: 'Each group of 5 is a bundle' }; }
    scale = s <= 4 ? 1 : s === 5 ? 5 : s === 6 ? 2 : r.pick([2, 5, 10]);
    hi = s <= 2 ? 10 : s <= 4 ? 12 : 8;
    if (s === 7 && r.chance(0.4)) {
      nb = ri(r, 3, 4); lst = []; for (i = 0; i < nb; i++) lst.push(ri(r, 2, 9));
      k = ri(r, 0, 2); tot = lst.reduce(function (x, y) { return x + y; }, 0);
      if (k === 0) return { q: r.pick(['Goals', 'Points', 'Books', 'Cards']) + ': ' + lst.join(', ') + '. Total?', a: S(tot), eq: lst.join(' + ') };
      mx = Math.max.apply(null, lst); mn = Math.min.apply(null, lst);
      if (lst.filter(function (x) { return x === mx; }).length > 1 || lst.filter(function (x) { return x === mn; }).length > 1) return null;
      return k === 1 ? { q: 'Hits: ' + lst.join(', ') + '. Most?', a: S(mx), eq: S(mx) } : { q: 'Hits: ' + lst.join(', ') + '. Fewest?', a: S(mn), eq: S(mn) };
    }
    cats = r.pick(sets); nb = s === 1 ? 3 : ri(r, 3, 4); labs = r.shuffle(cats).slice(0, nb); vals = [];
    for (i = 0; i < nb; i++) vals.push(ri(r, 1, hi) * scale);
    for (i = 0; i < nb; i++) for (j = i + 1; j < nb; j++) if (vals[i] === vals[j]) return null;
    bars = labs.map(function (l, ii) { return { l: l, v: vals[ii] }; });
    var VW = 'votes';
    if (s === 1 || s === 5) { idx = ri(r, 0, nb - 1); return { q: labs[idx] + ' ' + VW + '?', a: S(vals[idx]), aid: { bars: bars }, eq: S(vals[idx]) }; }
    if (s === 2) { mx = Math.max.apply(null, vals); return { q: 'Most ' + VW + '?', a: S(mx), aid: { bars: bars }, eq: S(mx) }; }
    if (s === 3) { idx = r.shuffle([0, 1, 2, 3].slice(0, nb)); a = idx[0]; b = idx[1]; if (vals[a] < vals[b]) { c = a; a = b; b = c; } return { q: 'How many more: ' + labs[a] + ' than ' + labs[b] + '?', a: S(vals[a] - vals[b]), aid: { bars: bars }, eq: vals[a] + ' ' + SUB + ' ' + vals[b] }; }
    if (s === 4) { tot = vals.reduce(function (x, y) { return x + y; }, 0); return { q: 'Total ' + VW + '?', a: S(tot), aid: { bars: bars }, eq: vals.join(' + ') }; }
    k = ri(r, 0, 2); idx = r.shuffle([0, 1, 2, 3].slice(0, nb)); a = idx[0]; b = idx[1];
    if (k === 0) return { q: labs[a] + ' + ' + labs[b] + ' ' + VW + '?', a: S(vals[a] + vals[b]), aid: { bars: bars }, eq: vals[a] + ' + ' + vals[b] };
    if (vals[a] < vals[b]) { c = a; a = b; b = c; }
    if (k === 1) return { q: 'How many fewer: ' + labs[b] + ' than ' + labs[a] + '?', a: S(vals[a] - vals[b]), aid: { bars: bars }, eq: vals[a] + ' ' + SUB + ' ' + vals[b] };
    return { q: 'How many more: ' + labs[a] + ' than ' + labs[b] + '?', a: S(vals[a] - vals[b]), aid: { bars: bars }, eq: vals[a] + ' ' + SUB + ' ' + vals[b] };
  });
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
