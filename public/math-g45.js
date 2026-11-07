/* math-g45.js : MATH content for worlds 6 and 7 (Ontario Mathematics 2020, Grade 4 and Grade 5).
 Self-registering IIFE; needs math-data.js loaded first (harmless if MATH is missing). 7 topics per world, ids m6.1-m6.7 and m7.1-m7.7.
 Grade placement is from general knowledge of the curriculum; check with the owner (see STREAMS_PLAN.md section 9). */
(function (root) {
  'use strict';
  var MATH = root.MATH;
  if (!MATH || typeof MATH.add !== 'function') return;
  var F = MATH.fmt;

  /* ---------- helpers ---------- */
  function L(s, lo, hi) { return Math.round(lo + (hi - lo) * s / 7); }          // ramp with part s (0-7)
  function S(n) { return String(n); }
  function big(n) { return n >= 10000 ? F.big(n) : S(n); }                         // 12 345 style from 5 digits up
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function decStr(n, places) {                                                      // 0.50 -> '0.5', 3.00 -> '3'
    var t = Number(n).toFixed(places);
    if (t.indexOf('.') >= 0) t = t.replace(/0+$/, '').replace(/\.$/, '');
    return t;
  }
  function frac(n, d) { return n + '/' + d; }
  function red(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  function moneyC(c) { return '$' + F.dollars(c); }                                 // cents -> '$12.50'
  function pickItem(r) { return r.pick(['cards', 'pucks', 'apples', 'stickers', 'maple candies', 'marbles']); }

  /* ================= WORLD 6 (Grade 4, numbers to 10 000) ================= */

  /* m6.1 add and subtract within 10 000 */
  MATH.add({
    id: 'm6.1', world: 6, n: 1, strand: 'B', title: 'Add and take away',
    exp: 'Gr4 B2: add and subtract whole numbers to 10 000, missing numbers, simple word problems',
    neg: false, exact: true, ans: 'num', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var hi = L(s, 400, 9900), lo = L(s, 100, 1000), a, b, c, kind, k = r.int(0, 9);
      kind = s < 2 ? (k < 5 ? 'add' : 'sub') : s < 4 ? (k < 4 ? 'add' : k < 8 ? 'sub' : 'miss') : (k < 3 ? 'add' : k < 6 ? 'sub' : k < 8 ? 'miss' : 'word');
      a = r.int(lo, hi); b = r.int(lo, hi);
      if (s < 2) { a = r.int(100, 500); b = r.int(100, 400); }
      if (kind === 'add') {
        if (a + b > 9999) { a = Math.floor(a / 2); b = Math.floor(b / 2); }
        return { q: a + ' + ' + b, a: S(a + b), hint: 'Line up the places' };
      }
      if (kind === 'sub') {
        if (b > a) { c = a; a = b; b = c; }
        if (a === b) a += 7;
        return { q: a + ' − ' + b, a: S(a - b), hint: 'Trade a ten if you need' };
      }
      if (kind === 'miss') {
        if (a + b > 9999) { a = Math.floor(a / 2); b = Math.floor(b / 2); }
        return r.chance(0.5) ? { q: a + ' + _ = ' + (a + b), a: S(b) } : { q: '_ + ' + b + ' = ' + (a + b), a: S(a) };
      }
      var t = r.int(0, 3);
      if (a + b > 9999) { a = Math.floor(a / 2); b = Math.floor(b / 2); }
      if (b > a) { c = a; a = b; b = c; }
      if (t === 0) return { q: 'Hiked ' + a + ' m, then ' + b + ' m. In all?', a: S(a + b), eq: a + ' + ' + b };
      if (t === 1) return { q: a + ' fans came. ' + b + ' left. Still here?', a: S(a - b), eq: a + ' − ' + b };
      if (t === 2) return { q: 'A canoe race: ' + a + ' and ' + b + ' paddlers. Total?', a: S(a + b), eq: a + ' + ' + b };
      return { q: 'A bin had ' + a + ' pucks. ' + b + ' sold. Left?', a: S(a - b), eq: a + ' − ' + b };
    }
  });

  /* m6.2 multiplication and division facts to 10 × 10 */
  MATH.add({
    id: 'm6.2', world: 6, n: 2, strand: 'B', title: 'Times and shares to 10',
    exp: 'Gr4 B2: multiplication facts to 10 × 10 and related division facts, missing factor',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) {
      var mx = L(s, 4, 10), a = r.int(2, mx), b = r.int(2, mx), k = r.int(0, 9), p = a * b, t;
      if (s >= 2 && r.chance(0.4)) { a = r.int(Math.max(2, mx - 4), 10); p = a * b; }
      if (s < 2) return k < 6 ? { q: a + ' × ' + b, a: S(p) } : { q: p + ' ÷ ' + a, a: S(b) };
      if (k < 3) return { q: a + ' × ' + b, a: S(p) };
      if (k < 5) return { q: p + ' ÷ ' + a, a: S(b) };
      if (k < 8) return r.chance(0.5) ? { q: '_ × ' + b + ' = ' + p, a: S(a) } : { q: a + ' × _ = ' + p, a: S(b) };
      if (s < 5) return { q: p + ' ÷ _ = ' + b, a: S(a) };
      t = r.int(0, 2);
      if (t === 0) return { q: a + ' teams of ' + b + ' kids. How many kids?', a: S(p), eq: a + ' × ' + b };
      if (t === 1) return { q: p + ' pucks in ' + a + ' bags. Each bag?', a: S(b), eq: p + ' ÷ ' + a };
      return { q: p + ' cards shared by ' + a + ' kids. Each gets?', a: S(b), eq: p + ' ÷ ' + a };
    }
  });

  /* m6.3 multiply by 1 digit */
  MATH.add({
    id: 'm6.3', world: 6, n: 3, strand: 'B', title: 'Big times small',
    exp: 'Gr4 B2: multiply 2- and 3-digit numbers by 1-digit numbers, multiples of 10 and 100',
    neg: false, exact: true, ans: 'num', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var a, b, t, k = r.int(0, 9);
      if (s < 2) {
        a = r.int(2, 9); b = r.pick([10, 100, 20, 30, 40, 50, 200]);
        return r.chance(0.5) ? { q: a + ' × ' + b, a: S(a * b) } : { q: b + ' × ' + a, a: S(a * b) };
      }
      if (s < 4) { a = r.int(11, 49); b = r.int(2, 5 + s); return { q: a + ' × ' + b, a: S(a * b), hint: 'Split into tens and ones' }; }
      if (s < 6) {
        a = r.int(12, 99); b = r.int(3, 9);
        if (k < 7) return { q: a + ' × ' + b, a: S(a * b) };
        return { q: b + ' boxes of ' + a + ' ' + pickItem(r) + '. How many?', a: S(a * b), eq: b + ' × ' + a };
      }
      a = r.int(102, 999); b = r.int(3, 9);
      if (k < 5) return { q: a + ' × ' + b, a: S(a * b), hint: 'Hundreds, tens, ones' };
      if (k < 8) return { q: b + ' × ' + a, a: S(a * b) };
      t = r.pick(['km', 'mL', 'seeds']);
      return { q: b + ' trips of ' + a + ' ' + t + '. Total?', a: S(a * b), eq: b + ' × ' + a };
    }
  });

  /* m6.4 division with remainders (the only world with remainders) */
  MATH.add({
    id: 'm6.4', world: 6, n: 4, strand: 'B', title: 'Share and leftovers',
    exp: 'Gr4 B2: divide 2- and 3-digit numbers by 1-digit numbers, with remainders (typed as 3r2)',
    neg: false, exact: false, ans: 'rem', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var d = r.int(2, L(s, 4, 9)), qq, rr = r.int(1, d - 1), n;
      if (s < 3) qq = r.int(2, 8);
      else if (s < 6) qq = r.int(5, 14);
      else qq = r.int(12, 33);
      n = d * qq + rr;
      return { q: n + ' ÷ ' + d, a: qq + 'r' + rr, hint: 'Type it like 3r2' };
    }
  });

  /* m6.5 fractions and mixed numbers */
  MATH.add({
    id: 'm6.5', world: 6, n: 5, strand: 'B', title: 'Fractions and mixed numbers',
    exp: 'Gr4 B1: mixed numbers and improper fractions; add and subtract fractions with the same denominator',
    neg: false, exact: false, ans: 'mixed', equiv: true, run: ['tower'],
    gen: function (r, s) {
      var kinds = s < 2 ? ['add', 'sub'] : s < 4 ? ['add', 'sub', 'toMixed', 'toImp'] : s < 6 ? ['toMixed', 'toImp', 'add', 'sub'] : ['toMixed', 'toImp', 'addMixed', 'add'];
      var kind = r.pick(kinds), d = r.int(3, L(s, 6, 10)), n1, n2, w, rr, n, x;
      if (kind === 'add') {
        for (var i = 0; i < 30; i++) { n1 = r.int(1, d - 2); n2 = r.int(1, d - 1 - n1); if (n1 + n2 < d) break; }
        if (!(n1 + n2 < d)) { n1 = 1; n2 = 1; }
        x = red(n1 + n2, d);
        return { q: n1 + '/' + d + ' + ' + n2 + '/' + d, a: frac(x[0], x[1]), eq: n1 + '/' + d + ' + ' + n2 + '/' + d, hint: 'Add the tops' };
      }
      if (kind === 'sub') {
        n1 = r.int(2, d - 1); n2 = r.int(1, n1 - 1); x = red(n1 - n2, d);
        return { q: n1 + '/' + d + ' − ' + n2 + '/' + d, a: frac(x[0], x[1]), eq: n1 + '/' + d + ' − ' + n2 + '/' + d, hint: 'Take away the tops' };
      }
      w = r.int(1, s < 4 ? 3 : 5); rr = r.int(1, d - 1); n = w * d + rr;
      if (kind === 'toMixed') return { q: n + '/' + d + ' as mixed', a: w + ' ' + rr + '/' + d, eq: n + '/' + d, hint: 'How many wholes fit?' };
      if (kind === 'toImp') return { q: w + ' ' + rr + '/' + d + ' as fraction', a: n + '/' + d, eq: n + '/' + d, hint: 'Wholes × bottom + top' };
      // addMixed: whole + mixed with same denominator, no carrying
      n2 = r.int(1, d - 1 - rr > 0 ? d - 1 - rr : 1);
      if (rr + n2 >= d) { rr = 1; n2 = 1; }
      return { q: w + ' ' + rr + '/' + d + ' + ' + n2 + '/' + d, a: w + ' ' + (rr + n2) + '/' + d, eq: (w * d + rr) + '/' + d + ' + ' + n2 + '/' + d };
    }
  });

  /* m6.6 decimals and money */
  MATH.add({
    id: 'm6.6', world: 6, n: 6, strand: 'B', title: 'Decimals and money',
    exp: 'Gr4 B1/B2/F1: decimals to tenths and hundredths, fractions as decimals, add and subtract money to $100 (cash rounds to 5 cents)',
    neg: false, exact: true, ans: 'dec', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var k = r.int(0, 9), a, b, c, d, t;
      if (s < 2) {
        if (k < 4) { a = r.int(1, 9); return { q: a + '/10 = _', a: decStr(a / 10, 1) }; }
        if (k < 7) { a = r.int(1, 4); b = r.int(1, 5 - a > 0 ? 5 - a : 1); return { q: (a / 10).toFixed(1) + ' + ' + (b / 10).toFixed(1), a: decStr((a + b) / 10, 1) }; }
        a = r.int(2, 9); b = r.int(1, a - 1); return { q: (a / 10).toFixed(1) + ' − ' + (b / 10).toFixed(1), a: decStr((a - b) / 10, 1) };
      }
      if (s < 4) {
        if (k < 3) { a = r.int(1, 99); return { q: a + '/100 = _', a: decStr(a / 100, 2) }; }
        if (k < 4) { a = r.int(1, 9); return { q: '0.' + a + ' = _/10', a: S(a) }; }
        if (k < 7) { a = r.int(10, 60); b = r.int(10, 39); return { q: (a / 100).toFixed(2) + ' + ' + (b / 100).toFixed(2), a: decStr((a + b) / 100, 2) }; }
        a = r.int(30, 99); b = r.int(10, a - 5); return { q: (a / 100).toFixed(2) + ' − ' + (b / 100).toFixed(2), a: decStr((a - b) / 100, 2) };
      }
      if (s < 6) {
        a = r.step(105, 4000, 5); b = r.step(105, 4000, 5);
        if (k < 4) return { q: moneyC(a) + ' + ' + moneyC(b), a: F.dollars(a + b), money: true };
        if (k < 7) { if (b > a) { c = a; a = b; b = c; } if (a === b) a += 5; return { q: moneyC(a) + ' − ' + moneyC(b), a: F.dollars(a - b), money: true }; }
        if (k < 8) { a = r.int(11, 99); return { q: a + '/100 = _', a: decStr(a / 100, 2) }; }
        c = r.pick([500, 1000, 2000, 5000]); b = r.step(105, c - 5, 5);
        return { q: 'Pay ' + moneyC(c) + ' for ' + moneyC(b) + '. Change?', a: F.dollars(c - b), money: true, eq: (c / 100) + ' − ' + (b / 100) };
      }
      a = r.step(1005, 6000, 5); b = r.step(505, 3500, 5);
      if (k < 3) return { q: moneyC(a) + ' + ' + moneyC(b), a: F.dollars(a + b), money: true };
      if (k < 5) { if (b > a) { c = a; a = b; b = c; } return { q: moneyC(a) + ' − ' + moneyC(b), a: F.dollars(a - b), money: true }; }
      if (k < 7) {
        c = r.pick([2000, 5000, 10000]); d = r.step(1005, c - 5, 5);
        return { q: 'Pay ' + moneyC(c) + ' for ' + moneyC(d) + '. Change?', a: F.dollars(c - d), money: true, eq: (c / 100) + ' − ' + (d / 100) };
      }
      t = r.int(2, 5); c = r.int(5, 40);
      if (k < 9) return { q: 'Save $' + t + ' a week. $' + (t * c) + ' takes how many weeks?', a: S(c), eq: (t * c) + ' ÷ ' + t };
      a = r.step(1005, 3000, 5); b = r.step(205, 1500, 5); c = r.step(205, 1500, 5);
      return { q: moneyC(a) + ' + ' + moneyC(b) + ' + ' + moneyC(c), a: F.dollars(a + b + c), money: true };
    }
  });

  function ord(n) { var t = n % 100, u = n % 10; return n + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); }
  /* m6.7 area, perimeter, 24-hour clock, mean, mode, patterns, symmetry and grid position */
  MATH.add({
    id: 'm6.7', world: 6, n: 7, strand: 'E', title: 'Shapes, data and patterns',
    exp: 'Gr4 E1/E2/D1/C1: area and perimeter of rectangles, 24-hour time, mode and mean of a small list, number patterns with a rule, lines of symmetry and moving a point on a grid (first quadrant; placement UNCERTAIN)',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) {
      var kinds = s < 2 ? ['perim', 'pattern', 'sym'] : s < 4 ? ['perim', 'area', 'pattern', 'clock', 'sym', 'move'] : s < 6 ? ['area', 'mode', 'clock', 'pattern', 'perim', 'move', 'sym'] : ['mean', 'mode', 'missSide', 'rule', 'area', 'clock', 'move'];
      var kind = r.pick(kinds), w, l, i, st, a0, list, m, sum, n, h, others;
      if (kind === 'sym') {
        m = r.pick([['square', 4], ['rectangle', 2], ['equilateral triangle', 3], ['regular pentagon', 5], ['regular hexagon', 6], ['letter H', 2], ['letter A', 1], ['letter T', 1]]);
        return { q: 'Lines of symmetry: ' + m[0] + '?', a: S(m[1]), eq: S(m[1]), hint: 'Fold it so the halves match' };
      }
      if (kind === 'move') {
        l = r.int(1, 9); w = r.int(1, 9); n = r.int(1, 6); m = r.int(0, 3);
        if (m === 0) return { q: '(' + l + ',' + w + ') moved right ' + n + '. New x?', a: S(l + n), eq: l + ' + ' + n, hint: 'Right changes x' };
        if (m === 1) return { q: '(' + l + ',' + w + ') moved up ' + n + '. New y?', a: S(w + n), eq: w + ' + ' + n, hint: 'Up changes y' };
        if (m === 2) { n = r.int(1, l); return { q: '(' + l + ',' + w + ') moved left ' + n + '. New x?', a: S(l - n), eq: l + ' − ' + n, hint: 'Left changes x' }; }
        n = r.int(1, w); return { q: '(' + l + ',' + w + ') moved down ' + n + '. New y?', a: S(w - n), eq: w + ' − ' + n, hint: 'Down changes y' };
      }
      if (kind === 'perim') {
        l = r.int(3, L(s, 8, 20)); w = r.int(2, L(s, 6, 15));
        if (r.chance(0.2)) return { q: 'Perimeter of a square, side ' + l + ' cm', a: S(4 * l), eq: '4 × ' + l };
        return { q: 'Perimeter of ' + l + ' cm by ' + w + ' cm', a: S(2 * (l + w)), eq: '2 × (' + l + ' + ' + w + ')', hint: 'Add all four sides' };
      }
      if (kind === 'area') {
        l = r.int(3, L(s, 9, 25)); w = r.int(2, L(s, 6, 12));
        return { q: 'Area of ' + l + ' cm by ' + w + ' cm', a: S(l * w), eq: l + ' × ' + w, hint: 'Length × width' };
      }
      if (kind === 'missSide') {
        l = r.int(3, 15); w = r.int(2, 12);
        return r.chance(0.5) ? { q: 'Area ' + (l * w) + ' cm². Width ' + w + ' cm. Length?', a: S(l), eq: (l * w) + ' ÷ ' + w }
          : { q: 'Perimeter ' + (2 * (l + w)) + ' cm. Length ' + l + ' cm. Width?', a: S(w), eq: '(' + (2 * (l + w)) + ' ÷ 2) − ' + l };
      }
      if (kind === 'clock') {
        h = r.int(13, 23);
        return r.chance(0.5) ? { q: h + ':00 is _ p.m.', a: S(h - 12), eq: h + ' − 12' } : { q: (h - 12) + ' p.m. is _:00 in 24 h', a: S(h), eq: (h - 12) + ' + 12' };
      }
      if (kind === 'pattern') {
        st = r.int(2, L(s, 5, 9)); a0 = r.int(1, 20);
        if (s >= 4 && r.chance(0.4)) { a0 = st * 5 + r.int(0, 10); list = [a0, a0 - st, a0 - 2 * st, a0 - 3 * st]; m = a0 - 4 * st; }
        else { list = [a0, a0 + st, a0 + 2 * st, a0 + 3 * st]; m = a0 + 4 * st; }
        return { q: list.join(', ') + ', _', a: S(m), eq: S(m), hint: 'Find the jump' };
      }
      if (kind === 'rule') {
        st = r.int(3, 9); a0 = r.int(2, 15); n = r.int(5, 8);
        return { q: 'Start ' + a0 + ', add ' + st + '. What is the ' + ord(n) + ' number?', a: S(a0 + st * (n - 1)), eq: a0 + ' + ' + st + ' × ' + (n - 1) };
      }
      if (kind === 'mode') {
        m = r.int(1, 20); others = [];
        while (others.length < 3) { var o = r.int(1, 20); if (o !== m && others.indexOf(o) < 0) others.push(o); }
        list = r.shuffle([m, m, m].concat(others));
        return { q: 'Mode: ' + list.join(', '), a: S(m), eq: S(m), hint: 'The number seen most' };
      }
      // mean
      n = r.int(3, 5); list = []; sum = 0;
      for (i = 0; i < n - 1; i++) { list.push(r.int(2, L(s, 12, 30))); sum += list[i]; }
      var last = r.int(2, 20); last += (n - ((sum + last) % n)) % n; list.push(last); sum += last;
      return { q: 'Mean: ' + list.join(', '), a: S(sum / n), eq: '(' + list.join(' + ') + ') ÷ ' + n, hint: 'Add them, then share equally' };
    }
  });

  /* ================= WORLD 7 (Grade 5, numbers to 100 000) ================= */

  /* m7.1 multi-digit add, subtract, multiply */
  MATH.add({
    id: 'm7.1', world: 7, n: 1, strand: 'B', title: 'Big number maths',
    exp: 'Gr5 B2: add and subtract to 100 000, multiply up to 3-digit by 2-digit',
    neg: false, exact: true, ans: 'num', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var a, b, c, k = r.int(0, 9), t;
      if (s < 2) {
        if (k < 5) { a = r.int(2, 9); b = r.int(101, 499); return { q: b + ' × ' + a, a: S(a * b) }; }
        a = r.int(1100, 6000); b = r.int(1100, 3900); return { q: a + ' + ' + b, a: S(a + b) };
      }
      if (s < 4) {
        a = r.int(10000, 79000); b = r.int(1100, 19000);
        if (k >= 5 && k < 9 && b > a) b = a - 500;
        if (k < 5) return { q: big(a) + ' + ' + big(b), a: S(a + b) };
        if (k < 9) return { q: big(a) + ' − ' + big(b), a: S(a - b) };
        return { q: 'A rink sold ' + big(a) + ' and ' + big(b) + ' tickets. Total?', a: S(a + b), eq: a + ' + ' + b };
      }
      if (s < 6) {
        a = r.int(12, 59); b = r.int(11, 49);
        if (k < 7) return { q: a + ' × ' + b, a: S(a * b), hint: 'Do ' + a + ' × ' + (b - b % 10) + ' first' };
        return { q: a + ' boxes with ' + b + ' ' + pickItem(r) + '. Total?', a: S(a * b), eq: a + ' × ' + b };
      }
      a = r.int(102, 499); b = r.int(12, 49);
      if (k < 5) return { q: a + ' × ' + b, a: S(a * b) };
      if (k < 7) { a = r.int(20000, 99000); b = r.int(10000, a - 1000); return { q: big(a) + ' − ' + big(b), a: S(a - b) }; }
      if (k < 9) { a = r.int(20000, 60000); b = r.int(10000, 39000); c = r.int(1000, 9000); if (a + b + c > 99999) c = 1000; return { q: big(a) + ' + ' + big(b) + ' + ' + big(c), a: S(a + b + c) }; }
      t = r.int(100, 450);
      return { q: 'Fill ' + b + ' jugs with ' + t + ' mL. Total mL?', a: S(b * t), eq: b + ' × ' + t };
    }
  });

  /* m7.2 division by 1 digit (exact) */
  MATH.add({
    id: 'm7.2', world: 7, n: 2, strand: 'B', title: 'Divide big numbers',
    exp: 'Gr5 B2: divide up to 4-digit numbers by 1-digit numbers (exact here), division by 10 and 100',
    neg: false, exact: true, ans: 'num', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var d = r.int(2, 9), qq, k = r.int(0, 9);
      if (s < 2) { qq = r.int(5, 20); return { q: (d * qq) + ' ÷ ' + d, a: S(qq) }; }
      if (s < 4) {
        if (k < 2) { qq = r.int(2, 99); return { q: (qq * 10) + ' ÷ 10', a: S(qq) }; }
        qq = r.int(20, 111); return { q: (d * qq) + ' ÷ ' + d, a: S(qq) };
      }
      if (s < 6) {
        qq = r.int(100, 1000);
        if (k < 7) return { q: (d * qq) + ' ÷ ' + d, a: S(qq), hint: 'Divide one place at a time' };
        return { q: (d * qq) + ' ' + pickItem(r) + ' in ' + d + ' bins. Each bin?', a: S(qq), eq: (d * qq) + ' ÷ ' + d };
      }
      qq = r.int(110, 1100);
      if (k < 4) return { q: (d * qq) + ' ÷ ' + d, a: S(qq) };
      if (k < 7) return { q: '_ ÷ ' + d + ' = ' + qq, a: S(d * qq) };
      if (k < 9) return { q: (d * qq) + ' mL poured into ' + d + ' cups. Each?', a: S(qq), eq: (d * qq) + ' ÷ ' + d };
      return { q: (qq * 100) + ' ÷ 100', a: S(qq) };
    }
  });

  /* m7.3 fractions with unlike denominators */
  MATH.add({
    id: 'm7.3', world: 7, n: 3, strand: 'B', title: 'Unlike fractions',
    exp: 'Gr5 B1: add and subtract fractions with unlike denominators (simple cases, one a multiple of the other, then small pairs)',
    neg: false, exact: true, ans: 'frac', equiv: true, run: ['bridge', 'tower'],
    gen: function (r, s) {
      var easy = [[2, 4], [3, 6], [5, 10], [2, 8], [4, 8], [3, 9], [2, 10], [4, 12], [2, 6], [6, 12]];
      var hard = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [2, 7], [3, 8], [5, 6], [3, 10], [4, 6]];
      var pool = s < 3 ? easy : s < 5 ? easy.concat(hard.slice(0, 4)) : hard.concat(easy.slice(0, 4));
      var pr = r.pick(pool), d1 = pr[0], d2 = pr[1], n1, n2, x, op, LCM, top, i, res, word;
      if (r.chance(0.5)) { d1 = pr[1]; d2 = pr[0]; }
      for (i = 0; i < 40; i++) {
        n1 = r.int(1, d1 - 1); n2 = r.int(1, d2 - 1);
        op = (s < 2 || r.chance(0.5)) ? '+' : '−';
        LCM = lcm(d1, d2);
        top = op === '+' ? n1 * LCM / d1 + n2 * LCM / d2 : n1 * LCM / d1 - n2 * LCM / d2;
        if (top <= 0) continue;
        x = red(top, LCM);
        if (x[1] === 1) continue;
        if (op === '+' && s < 6 && top > LCM) continue;
        res = true; break;
      }
      if (!res) { d1 = 2; d2 = 4; n1 = 1; n2 = 1; op = '+'; x = [3, 4]; }
      word = s >= 6 && op === '+' && r.chance(0.5);
      if (word) return { q: top <= LCM ? 'Ate ' + n1 + '/' + d1 + ' of a pizza, then ' + n2 + '/' + d2 + ' more. Total pizza?' : 'Walked ' + n1 + '/' + d1 + ' km, then ' + n2 + '/' + d2 + ' km more. Total km?', a: frac(x[0], x[1]), eq: n1 + '/' + d1 + ' + ' + n2 + '/' + d2 };
      return { q: n1 + '/' + d1 + ' ' + op + ' ' + n2 + '/' + d2, a: frac(x[0], x[1]), hint: 'Make the bottoms match' };
    }
  });

  /* m7.4 fractions, decimals and percent */
  MATH.add({
    id: 'm7.4', world: 7, n: 4, strand: 'B', title: 'Fractions, decimals, percent',
    exp: 'Gr5 B1: relate fractions, decimals and percents (halves, quarters, fifths, tenths, hundredths); percent of a number (benchmarks)',
    neg: false, exact: true, ans: 'dec', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var k = r.int(0, 9), d, n, p, base, t;
      var easyD = [2, 4, 5, 10], midD = [2, 4, 5, 10, 20, 25, 50], pcts = [10, 20, 25, 50, 75, 5, 30, 40, 60, 80, 90];
      if (s < 2) {
        if (k < 5) { d = r.pick(easyD); n = r.int(1, d - 1); return { q: n + '/' + d + ' = _', a: decStr(n / d, 3) }; }
        p = r.pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]); return { q: p + '% = _', a: decStr(p / 100, 2), hint: 'Percent means per 100' };
      }
      if (s < 4) {
        if (k < 3) { d = r.pick(midD); n = r.int(1, d - 1); return { q: n + '/' + d + ' = _', a: decStr(n / d, 3) }; }
        if (k < 6) { p = r.int(1, 99); return { q: decStr(p / 100, 2) + ' = _%', a: S(p) }; }
        d = r.pick(midD); n = r.int(1, d - 1);
        if ((n * 100) % d !== 0) { d = 4; n = r.int(1, 3); }
        return { q: n + '/' + d + ' = _%', a: S(n * 100 / d) };
      }
      if (s < 6) {
        p = r.pick(pcts); base = r.pick([20, 40, 60, 80, 100, 120, 200]);
        if (k < 5) return { q: p + '% of ' + base, a: decStr(p * base / 100, 2) };
        if (k < 7) { d = r.pick(midD); n = r.int(1, d - 1); if ((n * 100) % d !== 0) { d = 20; n = r.int(1, 19); } return { q: n + '/' + d + ' = _%', a: S(n * 100 / d) }; }
        if (k < 9) { p = r.int(1, 99); return { q: p + '% = _', a: decStr(p / 100, 2) }; }
        return { q: p + '% of ' + base, a: decStr(p * base / 100, 2) };
      }
      p = r.pick(pcts); base = r.pick([20, 40, 60, 80, 100, 120, 160, 200, 300, 500]);
      if (k < 4) return { q: p + '% of ' + base, a: decStr(p * base / 100, 2) };
      if (k < 6) { d = r.pick([8, 20, 25, 40, 50]); n = r.int(1, d - 1); return { q: n + '/' + d + ' = _', a: decStr(n / d, 3) }; }
      t = r.pick([20, 40, 60, 80, 100, 120]); p = r.pick([10, 20, 25, 50]);
      if (k < 8) return { q: 'Save ' + p + '% of $' + t + '. Saves $?', a: decStr(p * t / 100, 2), eq: p + '% of ' + t };
      return { q: 'A $' + t + ' game is ' + p + '% off. Save $?', a: decStr(p * t / 100, 2), eq: p + '% of ' + t };
    }
  });

  /* m7.5 decimals to thousandths */
  MATH.add({
    id: 'm7.5', world: 7, n: 5, strand: 'B', title: 'Thousandths',
    exp: 'Gr5 B1/B2: decimals to thousandths; add and subtract decimals; multiply and divide by 10, 100, 1000; rounding',
    neg: false, exact: true, ans: 'dec', run: ['bridge', 'tower'],
    gen: function (r, s) {
      var k = r.int(0, 9), a, b, c, m, x, dp, pl;
      function D(units, places) { return decStr(units / Math.pow(10, places), places); }
      if (s < 2) {
        a = r.int(11, 99); if (a % 10 === 0) a += 1; m = r.pick([10, 100]);
        if (k < 5) return { q: D(a, 1) + ' × ' + m, a: decStr(a * m / 10, 1) };
        return { q: D(a, 1) + ' ÷ 10', a: D(a, 2) };
      }
      if (s < 4) {
        a = r.int(120, 990); b = r.int(110, 800);
        if (k < 4) return { q: D(a, 2) + ' + ' + D(b, 2), a: D(a + b, 2) };
        if (k < 7) { if (b > a) { c = a; a = b; b = c; } return { q: D(a, 2) + ' − ' + D(b, 2), a: D(a - b, 2) }; }
        a = r.int(11, 99); m = r.pick([10, 100, 1000]);
        return { q: D(a, 2) + ' × ' + m, a: decStr(a * m / 100, 2) };
      }
      if (s < 6) {
        a = r.int(1100, 9900); b = r.int(1100, 8800);
        if (k < 3) return { q: D(a, 3) + ' + ' + D(b, 3), a: D(a + b, 3) };
        if (k < 6) { if (b > a) { c = a; a = b; b = c; } if (a === b) a += 7; return { q: D(a, 3) + ' − ' + D(b, 3), a: D(a - b, 3) }; }
        if (k < 8) { a = r.int(111, 999); m = r.pick([10, 100, 1000]); return { q: D(a, 3) + ' × ' + m, a: decStr(a * m / 1000, 3) }; }
        a = r.int(1111, 9999); if (a % 10 === 0) a += 3; x = D(a, 3); pl = r.pick([1, 2]);
        return { q: 'Round ' + x + ' to ' + (pl === 1 ? 'tenths' : 'hundredths'), a: decStr(Math.round(a / Math.pow(10, 3 - pl)) / Math.pow(10, pl), pl), eq: decStr(Math.round(a / Math.pow(10, 3 - pl)) / Math.pow(10, pl), pl) };
      }
      a = r.int(1100, 60000); b = r.int(1100, 39000);
      if (k < 3) return { q: D(a, 3) + ' + ' + D(b, 3), a: D(a + b, 3) };
      if (k < 5) { if (b > a) { c = a; a = b; b = c; } if (a === b) a += 7; return { q: D(a, 3) + ' − ' + D(b, 3), a: D(a - b, 3) }; }
      if (k < 7) { a = r.int(11, 999); m = r.pick([10, 100, 1000]); dp = r.pick([1, 2, 3]); return { q: D(a, dp) + ' × ' + m, a: decStr(a * m / Math.pow(10, dp), 3) }; }
      if (k < 9) { a = r.int(11, 9999); m = r.pick([10, 100]); return { q: D(a, 2) + ' ÷ ' + m, a: decStr(a / 100 / m, 4) }; }
      a = r.int(1111, 99999); if (a % 10 === 0) a += 3; pl = r.pick([1, 2]);
      return { q: 'Round ' + D(a, 3) + ' to ' + (pl === 1 ? 'tenths' : 'hundredths'), a: decStr(Math.round(a / Math.pow(10, 3 - pl)) / Math.pow(10, pl), pl), eq: decStr(Math.round(a / Math.pow(10, 3 - pl)) / Math.pow(10, pl), pl) };
    }
  });

  /* m7.6 volume, triangle area, angle sums */
  MATH.add({
    id: 'm7.6', world: 7, n: 6, strand: 'E', title: 'Volume, area, angles',
    exp: 'Gr5 E2: volume of rectangular prisms (cm³), area of triangles, angle sums in triangles, quadrilaterals and on a straight line; quarter turns and translations of a point (placement UNCERTAIN)',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) {
      var kinds = s < 2 ? ['vol', 'line', 'turn'] : s < 4 ? ['vol', 'tri', 'angTri', 'line', 'shift'] : s < 6 ? ['vol', 'tri', 'angTri', 'quad', 'line', 'turn', 'shift'] : ['volMiss', 'tri', 'quad', 'angTri', 'volWord', 'shift', 'turn'];
      var kind = r.pick(kinds), a, b, c, h, x, y, z;
      if (kind === 'turn') {
        a = r.int(1, 4);
        return r.chance(0.5) ? { q: a + ' quarter turns = _°', a: S(90 * a), eq: a + ' × 90', hint: 'One quarter turn is 90°' } : { q: (90 * a) + '° is _ quarter turns', a: S(a), eq: (90 * a) + ' ÷ 90' };
      }
      if (kind === 'shift') {
        a = r.int(1, 8); b = r.int(1, 8); c = r.int(1, 6); h = r.int(1, 6);
        return r.chance(0.5) ? { q: '(' + a + ',' + b + ') right ' + c + ', up ' + h + '. New x?', a: S(a + c), eq: a + ' + ' + c } : { q: '(' + a + ',' + b + ') right ' + c + ', up ' + h + '. New y?', a: S(b + h), eq: b + ' + ' + h };
      }
      if (kind === 'vol') {
        a = r.int(2, L(s, 4, 10)); b = r.int(2, L(s, 4, 9)); c = r.int(2, L(s, 4, 8));
        return { q: 'Prism ' + a + ' × ' + b + ' × ' + c + ' cm. Volume?', a: S(a * b * c), eq: a + ' × ' + b + ' × ' + c, hint: 'Length × width × height' };
      }
      if (kind === 'volWord') {
        a = r.int(3, 12); b = r.int(2, 9); c = r.int(2, 9);
        return { q: 'A box is ' + a + ' by ' + b + ' by ' + c + ' cm. Volume?', a: S(a * b * c), eq: a + ' × ' + b + ' × ' + c };
      }
      if (kind === 'volMiss') {
        a = r.int(2, 9); b = r.int(2, 9); c = r.int(2, 9);
        return { q: 'Volume ' + (a * b * c) + ' cm³. Base ' + a + ' × ' + b + '. Height?', a: S(c), eq: (a * b * c) + ' ÷ (' + a + ' × ' + b + ')' };
      }
      if (kind === 'tri') {
        b = r.int(2, L(s, 10, 20)); h = r.int(2, L(s, 8, 16));
        if ((b * h) % 2) h += 1;
        return { q: 'Triangle: base ' + b + ', height ' + h + ' cm. Area?', a: S(b * h / 2), eq: b + ' × ' + h + ' ÷ 2', hint: 'Base × height ÷ 2' };
      }
      if (kind === 'angTri') {
        x = r.step(30, 90, 5); y = r.step(30, 150 - x, 5);
        return { q: 'Triangle angles ' + x + '° and ' + y + '°. Third?', a: S(180 - x - y), eq: '180 − ' + x + ' − ' + y, hint: 'A triangle adds to 180°' };
      }
      if (kind === 'quad') {
        x = r.step(60, 120, 10); y = r.step(60, 120, 10); z = r.step(60, 120, 10);
        return { q: 'Three angles: ' + x + '°, ' + y + '°, ' + z + '°. Fourth?', a: S(360 - x - y - z), eq: '360 − ' + x + ' − ' + y + ' − ' + z, hint: 'Four sides add to 360°' };
      }
      x = r.step(20, 160, 5);
      return { q: x + '° + _ = 180°', a: S(180 - x), eq: '180 − ' + x, hint: 'A straight line is 180°' };
    }
  });

  /* m7.7 order of operations, median/mean, sales tax */
  MATH.add({
    id: 'm7.7', world: 7, n: 7, strand: 'C', title: 'Brackets, median, tax',
    exp: 'Gr5 C: order of operations with brackets; Gr5 D: median and mean; Gr5 F: sales tax (HST 13%) typed as cents',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) {
      var kind, k = r.int(0, 9), a, b, c, d, i, list, v, n, t, mid;
      kind = s < 3 ? 'ops' : s < 6 ? (k < 5 ? 'ops' : k < 8 ? 'median' : 'mean') : (k < 4 ? 'ops' : k < 6 ? 'median' : k < 8 ? 'tax' : 'mean');
      if (kind === 'ops') {
        var mx = L(s, 6, 12), T = s < 2 ? r.int(0, 3) : s < 4 ? r.int(0, 5) : r.int(0, 8);
        a = r.int(2, mx + 4); b = r.int(2, mx); c = r.int(2, 9); d = r.int(1, 9);
        switch (T) {
          case 0: return { q: a + ' + ' + b + ' × ' + c, a: S(a + b * c), hint: '× before +' };
          case 1: return { q: '(' + a + ' + ' + b + ') × ' + c, a: S((a + b) * c), hint: 'Brackets first' };
          case 2: c = r.int(1, Math.min(9, Math.floor((a + b - 1) / 2))); return { q: (a + b) + ' − ' + c + ' × 2', a: S(a + b - c * 2) };
          case 3: return { q: a + c + ' − ' + a + ' + ' + b, a: S(c + b), eq: (a + c) + ' − ' + a + ' + ' + b };
          case 4: t = r.int(2, 9); return { q: (t * c) + ' ÷ ' + t + ' + ' + a, a: S(c + a) };
          case 5: return { q: a + ' × (' + (b + c) + ' − ' + c + ')', a: S(a * b) };
          case 6: return { q: '(' + (a + b) + ' − ' + b + ') × ' + c + ' + ' + d, a: S(a * c + d) };
          case 7: t = r.int(2, 9); return { q: '(' + (t * c) + ' ÷ ' + t + ') × (' + a + ' + ' + d + ')', a: S(c * (a + d)) };
          default: if (c * d > a * b) d = 1; return { q: a + ' × ' + b + ' − ' + c + ' × ' + d, a: S(a * b - c * d) };
        }
      }
      if (kind === 'median') {
        n = (s >= 6 && r.chance(0.5)) ? 4 : 5; v = r.int(1, 10); list = [];
        for (i = 0; i < n; i++) { list.push(v); v += r.int(1, L(s, 6, 15)); }
        if (n === 4) { list[2] = list[1] + 2 * r.int(1, 3); list[3] = list[2] + r.int(1, 8); mid = (list[1] + list[2]) / 2; }
        else mid = list[2];
        list = r.shuffle(list);
        return { q: 'Median: ' + list.join(', '), a: S(mid), eq: S(mid), hint: 'Put in order. Find the middle' };
      }
      if (kind === 'tax') {
        t = r.step(5, 50, 5);
        return { q: 'HST 13% on $' + t + '. Tax in ¢?', a: S(13 * t), eq: '13 × ' + t, hint: '13% of $1 is 13¢' };
      }
      n = r.int(3, 6); list = []; var sum = 0;
      for (i = 0; i < n - 1; i++) { list.push(r.int(3, L(s, 20, 60))); sum += list[i]; }
      var last = r.int(3, 30); last += (n - ((sum + last) % n)) % n; list.push(last); sum += last;
      return { q: 'Mean: ' + list.join(', '), a: S(sum / n), eq: '(' + list.join(' + ') + ') ÷ ' + n, hint: 'Add them, then share equally' };
    }
  });
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
