/* math-g68.js : MATH content for Keyloria Kingdom, worlds 8-10 (Ontario Grades 6, 7, 8). 7 topics per world.
 Self-registering IIFE; needs math-data.js (window.MATH) loaded first, does nothing if it is missing.
 W8 Gr6 (no negatives), W9 Gr7 and W10 Gr8 (integers and rational numbers, answers may use '-').
 Curriculum notes are from general knowledge of Ontario Mathematics 2020; grade placement items marked UNCERTAIN should be checked by the owner. */
(function (root) {
  'use strict';
  var M = root.MATH;
  if (!M || !M.add) return;
  var F = M.fmt, gcd = M.gcd;

  /* ---------- helpers ---------- */
  function lv(s, lo, hi) { return Math.round(lo + (hi - lo) * s / 7); }
  function D(x) { var v = Math.round(x * 1e6) / 1e6; return String(v === 0 ? 0 : v); }
  function sg(n) { return n < 0 ? '−' + (-n) : String(n); }
  function pg(n) { return n < 0 ? '(−' + (-n) + ')' : String(n); }
  function bg(n) { return n >= 10000 ? F.big(n) : String(n); }
  function isP(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function ord(k) { var t = k % 100; if (t >= 11 && t <= 13) return k + 'th'; return k + (['th', 'st', 'nd', 'rd'][k % 10] || 'th'); }
  function pow10(k) { return Math.pow(10, k); }
  function srt(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function red(n, d) { var g = gcd(n, d) || 1; return [n / g, d / g]; }
  var NAMES = ['Mia', 'Ben', 'Zoe', 'Sam', 'Noor', 'Leo', 'Ava', 'Kai'];

  /* ================= WORLD 8 : Grade 6 ================= */

  M.add({
    id: 'm8.1', world: 8, n: 1, strand: 'B', title: 'Big numbers and factors', neg: false, exact: true, ans: 'num',
    exp: 'Gr6 Number: whole numbers to 1 000 000 (+, -, x, division), multiples, factors, GCF/LCM, prime and composite',
    gen: function (r, s) {
      var k = r.pick(s < 2 ? ['add', 'sub', 'mul', 'div', 'fac', 'mult'] : ['add', 'sub', 'mul', 'div', 'fac', 'gcf', 'lcm', 'prime', 'nextp', 'mult', 'add', 'mul']), a, b, d, lo, hi, t, n, i, u, v, g, x, y, c, an;
      if (k === 'add' || k === 'sub') {
        d = lv(s, 4, 6); lo = pow10(d - 1); hi = d === 6 ? 499999 : pow10(d) - 1;
        a = r.int(lo, hi); b = r.int(lo, hi);
        if (k === 'add') return { q: bg(a) + ' + ' + bg(b), a: String(a + b) };
        if (a < b) { t = a; a = b; b = t; } if (a === b) a++;
        return { q: bg(a) + ' − ' + bg(b), a: String(a - b) };
      }
      if (k === 'mul') {
        i = Math.min(3, Math.floor(s / 2));
        a = r.int(i < 1 ? 100 : i < 2 ? 1000 : i < 3 ? 100 : 1000, i < 1 ? 999 : i < 2 ? 9999 : i < 3 ? 999 : 9999);
        b = i < 2 ? r.int(2, 9) : r.int(11, i < 3 ? 29 : 99);
        return { q: bg(a) + ' × ' + b, a: String(a * b) };
      }
      if (k === 'div') {
        if (s < 4) { d = r.int(2, 9); n = r.int(lv(s, 12, 100), lv(s, 99, 999)); }
        else { d = r.int(11, lv(s, 20, 48)); n = r.int(lv(s, 20, 100), lv(s, 200, 2000)); }
        return { q: bg(d * n) + ' ÷ ' + d, a: String(n) };
      }
      if (k === 'fac') {
        n = r.int(6, s < 3 ? 40 : 100); c = 0; for (i = 1; i <= n; i++) if (n % i === 0) c++;
        return { q: 'Factors of ' + n + ': how many?', a: String(c), eq: String(c) };
      }
      if (k === 'gcf') {
        g = r.int(2, s < 4 ? 6 : 12); do { u = r.int(2, s < 4 ? 6 : 9); v = r.int(2, s < 4 ? 6 : 9); } while (u === v || gcd(u, v) !== 1);
        return { q: 'GCF of ' + g * u + ' and ' + g * v, a: String(g), eq: String(g), hint: 'Biggest shared factor' };
      }
      if (k === 'lcm') {
        do { x = r.int(2, s < 4 ? 8 : 12); y = r.int(2, s < 4 ? 8 : 12); } while (x === y);
        an = x * y / gcd(x, y);
        return { q: 'LCM of ' + x + ' and ' + y, a: String(an), eq: String(an), hint: 'Smallest shared multiple' };
      }
      if (k === 'prime') {
        var ps = [], cs = [], lim = s < 4 ? 30 : 100;
        for (i = 2; i <= lim; i++) if (isP(i)) ps.push(i);
        var p = r.pick(ps), pool = [];
        for (i = Math.max(4, p - 14); i <= p + 14; i++) if (!isP(i)) pool.push(i);
        pool = r.shuffle(pool).slice(0, 3);
        pool.push(p);
        return { q: 'Which is prime? ' + r.shuffle(pool).join(', '), a: String(p), eq: String(p), hint: 'Only 1 and itself' };
      }
      if (k === 'nextp') {
        n = r.int(lv(s, 10, 50), lv(s, 30, 150)); t = n + 1; while (!isP(t)) t++;
        return { q: 'Next prime after ' + n, a: String(t), eq: String(t) };
      }
      if (r.chance(0.35)) {
        n = r.int(3, lv(s, 9, 15)); t = r.int(lv(s, 10, 30), lv(s, 40, 120)); an = (Math.floor(t / n) + 1) * n;
        return { q: 'First multiple of ' + n + ' over ' + t, a: String(an), eq: String(an) };
      }
      n = r.int(2, lv(s, 9, 25)); c = r.int(3, lv(s, 6, 15));
      return { q: ord(c) + ' multiple of ' + n, a: String(n * c), eq: n + '×' + c };
    }
  });

  M.add({
    id: 'm8.2', world: 8, n: 2, strand: 'B', title: 'Fraction of an amount', neg: false, exact: false, ans: 'num',
    exp: 'Gr6 Number: fractions of a whole number, fraction x whole number, finding the whole from a fraction',
    gen: function (r, s) {
      var ds = s < 2 ? [2, 3, 4, 5] : s < 4 ? [2, 3, 4, 5, 6, 8, 10] : [3, 4, 5, 6, 7, 8, 9, 10, 12], d = r.pick(ds),
        n = (s < 2 || r.chance(0.15)) ? 1 : r.int(1, d - 1), k = r.int(lv(s, 2, 4), lv(s, 5, 15)), w = d * k, a = k * n,
        kinds = s < 3 ? ['of', 'of', 'times'] : s < 5 ? ['of', 'times', 'word', 'missing'] : ['of', 'times', 'word', 'missing', 'word'], kd = r.pick(kinds), f = n + '/' + d, nm, it, T;
      while (gcd(n, d) !== 1) { n = r.int(1, d - 1); a = k * n; f = n + '/' + d; }
      if (kd === 'of') return { q: f + ' of ' + w, a: String(a), hint: 'Divide, then multiply' };
      if (kd === 'times') return { q: w + ' × ' + f, a: String(a) };
      if (kd === 'missing') return { q: f + ' of _ = ' + a, a: String(w), hint: 'Find the whole' };
      nm = r.pick(NAMES);
      T = r.int(0, 2);
      if (T === 0) {
        it = r.pick([['hockey pucks', 'new'], ['apples', 'red'], ['stickers', 'gold'], ['maple trees', 'tall'], ['toques', 'blue']]);
        return { q: nm + ' has ' + w + ' ' + it[0] + '. ' + f + ' are ' + it[1] + '. How many?', a: String(a), eq: w + '×' + n + '/' + d };
      }
      if (T === 1) return { q: 'Canoe trip: ' + w + ' km. We paddled ' + f + '. How far?', a: String(a), eq: w + '×' + n + '/' + d };
      return { q: nm + ' has ' + w + ' stickers. Gives away ' + f + '. Left?', a: String(w - a), eq: w + '-' + w + '×' + n + '/' + d };
    }
  });

  M.add({
    id: 'm8.3', world: 8, n: 3, strand: 'B', title: 'Decimal power', neg: false, exact: false, ans: 'dec',
    exp: 'Gr6 Number: multiply and divide decimals by 10, 100, 1000; add and subtract decimals; decimal x or ÷ whole number; decimal x and ÷ tenths (UNCERTAIN: depth of decimal x decimal in Gr6)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['mul10', 'div10', 'add', 'sub'] : s < 4 ? ['mul10', 'div10', 'add', 'sub', 'mulw', 'divw'] : ['mul10', 'div10', 'add', 'sub', 'mulw', 'divw', 'mulD', 'divD'],
        k = r.pick(kinds), n, dp, p, res, x, y, A, B, k1, k2, w, na, nb, qt, tries = 0, o;
      do {
        tries++;
        if (k === 'mul10') {
          dp = r.int(1, s < 3 ? 1 : 3); n = r.int(11, lv(s, 99, 9999)); if (n % 10 === 0) n++;
          p = r.pick(s < 2 ? [10, 100] : [10, 100, 1000]); res = n * p / pow10(dp);
          o = { q: D(n / pow10(dp)) + ' × ' + p, a: D(res) };
        } else if (k === 'div10') {
          dp = r.int(0, 1); n = r.int(11, lv(s, 999, 9999)); if (dp && n % 10 === 0) n++;
          p = r.pick(s < 2 ? [10, 100] : [10, 100, 1000]); res = n / pow10(dp) / p;
          o = { q: D(n / pow10(dp)) + ' ÷ ' + p, a: D(res) };
        } else if (k === 'add' || k === 'sub') {
          k1 = s < 3 ? 1 : 2; k2 = s < 3 ? 1 : s < 6 ? 2 : r.int(1, 2);
          A = r.int(11, 99 * pow10(k1)); B = r.int(11, 99 * pow10(k2));
          x = A / pow10(k1); y = B / pow10(k2);
          if (k === 'sub' && x < y) { var tt = x; x = y; y = tt; }
          if (k === 'sub' && x === y) x += 1;
          res = k === 'add' ? Math.round(x * 100 + y * 100) / 100 : Math.round(x * 100 - y * 100) / 100;
          o = { q: D(x) + (k === 'add' ? ' + ' : ' − ') + D(y), a: D(res) };
        } else if (k === 'mulw') {
          dp = s < 4 ? 1 : r.int(1, 2); n = r.int(2, lv(s, 9, 99)); w = r.int(2, lv(s, 9, 12)); res = n * w / pow10(dp);
          o = r.chance(0.5) ? { q: D(n / pow10(dp)) + ' × ' + w, a: D(res) } : { q: w + ' × ' + D(n / pow10(dp)), a: D(res) };
        } else if (k === 'divw') {
          dp = s < 4 ? 1 : r.int(1, 2); n = r.int(11, lv(s, 99, 500)); w = r.int(2, 9);
          o = { q: D(n * w / pow10(dp)) + ' ÷ ' + w, a: D(n / pow10(dp)) };
        } else if (k === 'mulD') {
          na = s < 7 ? r.int(2, 9) : r.int(12, 39); nb = r.int(2, 9);
          o = { q: D(na / 10) + ' × ' + D(nb / 10), a: D(na * nb / 100) };
        } else {
          nb = r.int(2, 9); qt = r.int(2, lv(s, 9, 15));
          o = { q: D(nb * qt / 10) + ' ÷ ' + D(nb / 10), a: String(qt), hint: 'Tenths: think x 10' };
        }
      } while (o.a.length > 6 && tries < 20);
      return o;
    }
  });

  M.add({
    id: 'm8.4', world: 8, n: 4, strand: 'B', title: 'Percent and deals', neg: false, exact: false, ans: 'num',
    exp: 'Gr6 Number and Financial Literacy: percent of a number, discounts, simple interest, unit rates (whole-dollar answers; Canadian dollars)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['pct', 'pct', 'rate'] : s < 4 ? ['pct', 'off', 'rate', 'whatpct'] : ['pct', 'off', 'rate', 'whatpct', 'int', 'off'],
        k = r.pick(kinds), pl = s < 2 ? [10, 20, 25, 50] : s < 4 ? [10, 20, 25, 50, 5, 15, 30, 40, 60, 75] : [10, 20, 25, 50, 5, 15, 30, 40, 60, 75, 12, 35, 45, 8, 90, 2, 4, 70, 80],
        p = r.pick(pl), step = 100 / gcd(100, p), kmax = Math.max(1, Math.floor(lv(s, 200, 1000) / step)), base = step * r.int(1, kmax), t, a, it, nm, yr, rt;
      if (base < 20) base = step * Math.ceil(20 / step);
      if (k === 'pct') return { q: p + '% of ' + base, a: String(base * p / 100) };
      if (k === 'off') {
        it = r.pick(['Jacket', 'Skates', 'Backpack', 'Hoodie', 'Kayak', 'Bike']); base = itemBase(r, it, step);
        return { q: it + ' $' + base + ', ' + p + '% off. Sale price ($)?', a: String(base - base * p / 100), eq: base + '-' + p + '% of ' + base, hint: 'Take off the discount' };
      }
      if (k === 'int') {
        yr = r.int(2, 4); rt = r.pick([2, 4, 5, 10]); step = 100 / gcd(100, rt); base = step * r.int(1, Math.max(1, Math.floor(lv(s, 300, 1000) / step)));
        if (base < 100) base = step * Math.ceil(100 / step);
        return { q: '$' + base + ' at ' + rt + '% for ' + yr + ' yr. Interest $?', a: String(base * rt * yr / 100), eq: base + '×' + rt + '%×' + yr, hint: 'Simple interest' };
      }
      if (k === 'whatpct') return { q: (base * p / 100) + ' is what % of ' + base + '?', a: String(p), eq: (base * p / 100) + '/' + base + '×100' };
      t = r.int(2, lv(s, 5, 12)); a = r.int(2, lv(s, 12, 60)) * (r.chance(0.5) ? 1 : 2);
      var T = r.int(0, 2);
      if (T === 0) return { q: a * t + ' km in ' + t + ' h. km per h?', a: String(a), eq: (a * t) + '/' + t };
      if (T === 1) return { q: '$' + (a * t) + ' for ' + t + ' kg. $ per kg?', a: String(a), eq: (a * t) + '/' + t };
      return { q: a * t + ' goals in ' + t + ' games. Per game?', a: String(a), eq: (a * t) + '/' + t };
    }
  });

  /* realistic price ranges (Canadian dollars) so a hoodie is never $565 */
  var PRICE = { Jacket: [40, 300], Skates: [60, 400], Backpack: [20, 150], Hoodie: [20, 120], Kayak: [300, 1000], Bike: [100, 800], 'Phone case': [10, 50] };
  function itemBase(r, it, st) { var lo = PRICE[it][0], hi = PRICE[it][1], kl = Math.ceil(lo / st), kh = Math.max(kl, Math.floor(hi / st)); return st * r.int(kl, kh); }
  var RATN = [['red', 'blue'], ['boys', 'girls'], ['wins', 'losses'], ['cats', 'dogs'], ['canoes', 'kayaks'], ['apples', 'pears'], ['pucks', 'sticks']];
  M.add({
    id: 'm8.5', world: 8, n: 5, strand: 'B', title: 'Ratios', neg: false, exact: false, ans: 'ratio', equiv: false,
    exp: 'Gr6 Number: ratios (part-to-part, part-to-whole) in simplest form, typed a:b',
    verify: function (p) {
      var m = /^(\d+):(\d+)$/.exec(p.a); if (!m) return false;
      var x = +m[1], y = +m[2]; if (gcd(x, y) !== 1) return false;
      var n = (p.q.match(/\d+/g) || []).map(Number); if (n.length < 2) return false;
      var a = n[0], b = n[1], c = [[a, b], [b, a], [a, a + b], [b, a + b], [a + b, a], [a + b, b]];
      return c.some(function (k) { return k[0] * y === k[1] * x; });
    },
    gen: function (r, s) {
      var mx = s < 4 ? 5 : 9, g = r.int(2, s < 2 ? 3 : s < 5 ? 6 : 9), x, y, kd = r.pick(s < 2 ? ['simp', 'simp', 'word'] : ['simp', 'word', 'word', 'whole']), it = r.pick(RATN), A, B, sw = r.chance(0.5);
      do { x = r.int(1, mx); y = r.int(1, mx); } while (x === y || gcd(x, y) !== 1);
      A = g * x; B = g * y;
      if (kd === 'simp') return { q: 'Simplify ' + A + ':' + B, a: x + ':' + y, hint: 'Divide both by the same number' };
      if (kd === 'word') {
        return sw ? { q: A + ' ' + it[0] + ', ' + B + ' ' + it[1] + '. ' + it[0] + ':' + it[1] + '?', a: x + ':' + y, hint: 'Simplest form' }
          : { q: A + ' ' + it[0] + ', ' + B + ' ' + it[1] + '. ' + it[1] + ':' + it[0] + '?', a: y + ':' + x, hint: 'Simplest form' };
      }
      return sw ? { q: A + ' ' + it[0] + ', ' + B + ' ' + it[1] + '. ' + it[1] + ':all?', a: y + ':' + (x + y), hint: 'All = both added' }
        : { q: A + ' ' + it[0] + ', ' + B + ' ' + it[1] + '. ' + it[0] + ':all?', a: x + ':' + (x + y), hint: 'All = both added' };
    }
  });

  M.add({
    id: 'm8.6', world: 8, n: 6, strand: 'E', title: 'Area and circles', neg: false, exact: false, ans: 'dec',
    exp: 'Gr6 Spatial Sense: area of parallelograms and triangles, radius/diameter, circumference using 3.14 (UNCERTAIN: circle circumference placement in Gr6 vs Gr7); translations of a point on the Cartesian plane (first quadrant answers)',
    gen: function (r, s) {
      var kinds = s < 3 ? ['par', 'tri', 'diam', 'move'] : s < 5 ? ['par', 'tri', 'diam', 'circC', 'rect', 'move'] : ['par', 'tri', 'circC', 'rect', 'tri5', 'miss', 'circC', 'move'], k = r.pick(kinds), b, h, d, c, rr, A, B, a;
      if (k === 'move') {
        a = r.int(1, 12); b = r.int(1, 12); c = r.int(1, 8); h = r.int(1, 8); d = r.int(0, 3);
        if (d === 0) return { q: '(' + a + ',' + b + ') moved right ' + c + ', up ' + h + '. New x?', a: String(a + c), eq: a + '+' + c, hint: 'Right changes x' };
        if (d === 1) return { q: '(' + a + ',' + b + ') moved right ' + c + ', up ' + h + '. New y?', a: String(b + h), eq: b + '+' + h, hint: 'Up changes y' };
        if (d === 2) { c = r.int(1, a); return { q: '(' + a + ',' + b + ') moved left ' + c + '. New x?', a: String(a - c), eq: a + '-' + c, hint: 'Left changes x' }; }
        h = r.int(1, b); return { q: '(' + a + ',' + b + ') moved down ' + h + '. New y?', a: String(b - h), eq: b + '-' + h, hint: 'Down changes y' };
      }
      if (k === 'par') { b = r.int(3, lv(s, 9, 25)); h = r.int(2, lv(s, 8, 20)); return { q: 'Parallelogram b ' + b + ', h ' + h + '. Area?', a: String(b * h), eq: b + '×' + h, hint: 'base × height' }; }
      if (k === 'tri') { b = 2 * r.int(2, lv(s, 5, 12)); h = r.int(2, lv(s, 8, 20)); return { q: 'Triangle b ' + b + ', h ' + h + '. Area?', a: D(b * h / 2), eq: b + '×' + h + '÷2', hint: 'base × height ÷ 2' }; }
      if (k === 'tri5') { b = r.int(3, lv(s, 9, 21)); h = r.int(3, lv(s, 8, 20)); return { q: 'Triangle b ' + b + ', h ' + h + '. Area?', a: D(b * h / 2), eq: b + '×' + h + '÷2', hint: 'base × height ÷ 2' }; }
      if (k === 'diam') {
        if (r.chance(0.5)) { rr = r.int(2, lv(s, 9, 40)); return { q: 'Circle r ' + rr + '. Diameter?', a: String(2 * rr), eq: '2×' + rr, hint: 'd = 2 × r' }; }
        rr = r.int(2, lv(s, 9, 40)); return { q: 'Circle d ' + (2 * rr) + '. Radius?', a: String(rr), eq: (2 * rr) + '÷2', hint: 'r = d ÷ 2' };
      }
      if (k === 'circC') {
        if (r.chance(0.5)) { d = r.int(2, lv(s, 12, 30)); return { q: 'Circle d ' + d + ' cm. Circumference?', a: D(314 * d / 100), eq: '3.14×' + d, hint: 'C = 3.14 × d' }; }
        rr = r.int(2, lv(s, 8, 15)); return { q: 'Circle r ' + rr + ' cm. Circumference?', a: D(314 * 2 * rr / 100), eq: '3.14×2×' + rr, hint: 'C = 3.14 × 2 × r' };
      }
      if (k === 'rect') {
        A = r.int(6, lv(s, 10, 20)); B = r.int(4, lv(s, 8, 15)); var ca = r.int(2, Math.floor(A / 2)), cb = r.int(2, Math.floor(B / 2));
        return { q: 'Rect ' + A + ' × ' + B + ' minus ' + ca + ' × ' + cb + '. Area?', a: String(A * B - ca * cb), eq: A + '×' + B + '-' + ca + '×' + cb };
      }
      do { b = r.int(3, 14); h = r.int(3, 14); } while ((b * h) % 2);
      if (r.chance(0.5)) return { q: 'Triangle: area ' + (b * h / 2) + ', b ' + b + '. h?', a: String(h), eq: (b * h / 2) + '×2÷' + b };
      return { q: 'Parallelogram: area ' + (b * h) + ', b ' + b + '. h?', a: String(h), eq: (b * h) + '÷' + b };
    }
  });

  M.add({
    id: 'm8.7', world: 8, n: 7, strand: 'C', title: 'Equations and data', neg: false, exact: false, ans: 'num',
    exp: 'Gr6 Algebra and Data: one- and two-step equations (x + 7 = 15), patterns, coordinates (plot and move points), mean, median, mode',
    gen: function (r, s) {
      var kinds = s < 2 ? ['x1', 'x1', 'pat', 'mean'] : s < 4 ? ['x1', 'x2', 'pat', 'mean', 'median', 'coord'] : ['x2', 'x1', 'mean', 'median', 'mode', 'coord', 'pat', 'x2'],
        k = r.pick(kinds), x, a, b, c, i, L, n, m, v, sum, tries, sorted, md;
      if (k === 'x1') {
        x = r.int(2, lv(s, 12, 40)); a = r.int(2, lv(s, 6, 12)); var t = r.int(0, 4);
        if (t === 0) return { q: 'x + ' + a + ' = ' + (x + a), a: String(x) };
        if (t === 1) return { q: 'x − ' + a + ' = ' + x, a: String(x + a) };
        if (t === 2) return { q: a + ' + x = ' + (x + a), a: String(x) };
        if (t === 3) return { q: a + 'x = ' + (a * x), a: String(x) };
        return { q: 'x ÷ ' + a + ' = ' + x, a: String(x * a) };
      }
      if (k === 'x2') {
        x = r.int(2, lv(s, 9, 15)); a = r.int(2, lv(s, 4, 9)); b = r.int(1, lv(s, 9, 20)); var t2 = r.int(0, 2);
        if (t2 === 0) return { q: a + 'x + ' + b + ' = ' + (a * x + b), a: String(x) };
        if (t2 === 1 && a * x > b) return { q: a + 'x − ' + b + ' = ' + (a * x - b), a: String(x) };
        if (t2 === 2 && s >= 4) return { q: 'x ÷ ' + a + ' + ' + b + ' = ' + (x + b), a: String(a * x) };
        return { q: a + 'x + ' + b + ' = ' + (a * x + b), a: String(x) };
      }
      if (k === 'pat') {
        var st = r.int(1, lv(s, 10, 40)), df = r.int(2, lv(s, 5, 12)), up = s < 4 || r.chance(0.7), seq = [], j;
        if (!up && st < df * 5) up = true;
        if (up || s < 4) { for (j = 0; j < 4; j++) seq.push(st + df * j); return { q: seq.join(', ') + ', _', a: String(st + df * 4), eq: String(st + df * 4) }; }
        for (j = 0; j < 4; j++) seq.push(st + df * 4 - df * j);
        return { q: seq.join(', ') + ', _', a: String(st + df * 4 - df * 4), eq: String(st) };
      }
      if (k === 'mean') {
        n = r.int(3, s < 4 ? 4 : 6); m = r.int(5, lv(s, 12, 60));
        for (tries = 0; tries < 50; tries++) {
          L = []; sum = 0;
          for (i = 0; i < n - 1; i++) { v = m + r.int(-Math.min(m - 1, 8), 8); L.push(v); sum += v; }
          v = m * n - sum; if (v >= 1 && v <= 99) { L.push(v); break; }
        }
        if (L.length < n) { L = []; for (i = 0; i < n; i++) L.push(m); }
        L = r.shuffle(L);
        return { q: 'Mean: ' + L.join(', '), a: String(m), eq: '(' + L.join('+') + ')/' + n, hint: 'Add up, then divide' };
      }
      if (k === 'median') {
        n = r.pick(s < 4 ? [5] : [5, 6, 7]);
        for (tries = 0; tries < 60; tries++) {
          L = []; for (i = 0; i < n; i++) L.push(r.int(1, lv(s, 20, 99)));
          sorted = srt(L);
          if (n % 2) { md = sorted[(n - 1) / 2]; break; }
          if ((sorted[n / 2 - 1] + sorted[n / 2]) % 2 === 0) { md = (sorted[n / 2 - 1] + sorted[n / 2]) / 2; break; }
        }
        if (md == null) { L = [3, 9, 5, 7, 1]; md = 5; }
        return { q: 'Median: ' + L.join(', '), a: String(md), eq: String(md), hint: 'Put in order first' };
      }
      if (k === 'mode') {
        var md2 = r.int(1, lv(s, 20, 60)); L = [md2, md2, md2];
        n = r.int(3, 5);
        while (L.length < 3 + n) { v = r.int(1, lv(s, 20, 60)); if (v !== md2 && L.indexOf(v) < 0) L.push(v); }
        L = r.shuffle(L);
        return { q: 'Mode: ' + L.join(', '), a: String(md2), eq: String(md2), hint: 'Shows up the most' };
      }
      var px = r.int(0, 9), py = r.int(0, 9), dx = r.int(1, 6), dy = r.int(1, 6), t3 = r.int(0, 3);
      if (t3 === 0) return { q: '(' + px + ',' + py + ') right ' + dx + ', up ' + dy + '. New x?', a: String(px + dx), eq: String(px + dx) };
      if (t3 === 1) return { q: '(' + px + ',' + py + ') right ' + dx + ', up ' + dy + '. New y?', a: String(py + dy), eq: String(py + dy) };
      if (t3 === 2) return { q: '(' + px + ',' + py + ') to (' + (px + dx) + ',' + py + '): how far?', a: String(dx), eq: String(dx) };
      return { q: '(' + px + ',' + py + ') to (' + px + ',' + (py + dy) + '): how far?', a: String(dy), eq: String(dy) };
    }
  });

  /* ================= WORLD 9 : Grade 7 ================= */

  M.add({
    id: 'm9.1', world: 9, n: 1, strand: 'B', title: 'Integers', neg: true, exact: true, ans: 'num',
    exp: 'Gr7 Number: add and subtract integers (negatives, number line, temperature); multiply/divide integers is placed in W10 (UNCERTAIN: Gr7 vs Gr8)',
    gen: function (r, s) {
      var mx = lv(s, 9, 40), a, b, kd = r.pick(s < 3 ? ['add', 'sub', 'add', 'sub'] : ['add', 'sub', 'sub2', 'word', 'order', 'add']), res, tries = 0, T, t, d;
      if (kd === 'word') {
        T = r.int(0, 3); a = r.int(2, lv(s, 12, 30)); b = r.int(2, lv(s, 12, 30));
        if (T === 0) return { q: 'It is ' + sg(-a) + '°C. It warms ' + b + '°. Now?', a: String(b - a), eq: sg(-a) + '+' + b };
        if (T === 1) return { q: 'It is ' + a + '°C. It drops ' + b + '°. Now?', a: String(a - b), eq: a + '-' + b };
        if (T === 2) return { q: 'A diver at ' + sg(-a) + ' m rises ' + b + ' m. Depth?', a: String(b - a), eq: sg(-a) + '+' + b };
        return { q: 'Owe $' + a + ', earn $' + b + '. Balance $?', a: String(b - a), eq: sg(-a) + '+' + b };
      }
      if (kd === 'order') {
        var L = [], v;
        while (L.length < 4) { v = r.int(-mx, mx); if (L.indexOf(v) < 0) L.push(v); }
        var small = r.chance(0.5), an = small ? Math.min.apply(null, L) : Math.max.apply(null, L);
        return { q: (small ? 'Smallest: ' : 'Biggest: ') + L.map(sg).join(', '), a: String(an), eq: sg(an) };
      }
      do {
        tries++;
        a = r.int(-mx, mx); b = r.int(1, mx);
        if (kd === 'sub2') b = -b;
        else if (r.chance(s < 3 ? 0.3 : 0.5)) b = -b;
        res = (kd === 'add') ? a + b : a - b;
      } while (tries < 40 && (a === 0 || (a > 0 && b > 0 && res >= 0)));
      return { q: sg(a) + (kd === 'add' ? ' + ' : ' − ') + pg(b), a: String(res) };
    }
  });

  M.add({
    id: 'm9.2', world: 9, n: 2, strand: 'B', title: 'Exponents and roots', neg: true, exact: true, ans: 'num',
    exp: 'Gr7 Number: squares, cubes, powers, perfect-square roots, order of operations with exponents',
    gen: function (r, s) {
      var kinds = s < 2 ? ['sq', 'rt', 'cube'] : s < 4 ? ['sq', 'rt', 'cube', 'pw', 'ord1'] : s < 6 ? ['pw', 'ord1', 'ord2', 'ord3', 'rt', 'negp'] : ['ord1', 'ord2', 'ord3', 'ord4', 'pw', 'negp'], k = r.pick(kinds), a, b, c, n;
      if (k === 'sq') { n = r.int(2, lv(s, 10, 15)); return { q: n + '²', a: String(n * n) }; }
      if (k === 'cube') { n = r.int(2, lv(s, 5, 10)); return { q: n + '³', a: String(n * n * n) }; }
      if (k === 'rt') { n = r.int(2, lv(s, 12, 20)); return { q: '√' + (n * n), a: String(n) }; }
      if (k === 'pw') {
        var t = r.pick([2, 2, 3, 10]);
        if (t === 2) { n = r.int(s < 4 ? 2 : 3, lv(s, 6, 10)); return { q: '2^' + n, a: String(Math.pow(2, n)) }; }
        if (t === 3) { n = r.int(s < 4 ? 2 : 3, lv(s, 4, 5)); return { q: '3^' + n, a: String(Math.pow(3, n)) }; }
        n = r.int(2, 5); return { q: '10^' + n, a: String(Math.pow(10, n)) };
      }
      if (k === 'negp') {
        a = r.int(2, lv(s, 4, 9)); n = r.pick([2, 3]);
        return { q: '(−' + a + ')' + (n === 2 ? '²' : '³'), a: String(Math.pow(-a, n)) };
      }
      if (k === 'ord1') { a = r.int(1, 20); b = r.int(2, lv(s, 6, 10)); return r.chance(0.5) ? { q: a + ' + ' + b + '²', a: String(a + b * b) } : { q: a + b * b + ' − ' + b + '²', a: String(a) }; }
      if (k === 'ord2') { a = r.int(1, 6); b = r.int(1, 6); return { q: '(' + a + ' + ' + b + ')²', a: String((a + b) * (a + b)) }; }
      if (k === 'ord3') { a = r.int(2, 9); b = r.int(2, 4); c = r.int(1, 5); return { q: a + '² − ' + b + '³ + ' + c, a: String(a * a - b * b * b + c) }; }
      a = r.int(2, 9); b = r.int(2, 6); c = r.int(2, 5);
      return r.chance(0.5) ? { q: '√' + (a * a) + ' + ' + b + '² × ' + c, a: String(a + b * b * c) } : { q: '(' + a + ' + ' + b + ')² ÷ ' + (a + b) + ' + ' + c, a: String(a + b + c) };
    }
  });

  function fr(n, d) { return n + '/' + d; }
  M.add({
    id: 'm9.3', world: 9, n: 3, strand: 'B', title: 'Fraction operations', neg: false, exact: false, ans: 'frac', equiv: false,
    exp: 'Gr7 Number: add, subtract, multiply and divide fractions with unlike denominators; answer in simplest form typed a/b',
    verify: function (p) {
      var m = /^(\d+)\/(\d+) ([+−×÷]) (\d+)\/(\d+)$/.exec(p.q), z = /^(\d+)\/(\d+)$/.exec(p.a);
      if (!m || !z) return false;
      var a = +m[1], b = +m[2], c = +m[4], d = +m[5], n, de, op = m[3];
      if (op === '+') { n = a * d + c * b; de = b * d; } else if (op === '−') { n = a * d - c * b; de = b * d; }
      else if (op === '×') { n = a * c; de = b * d; } else { n = a * d; de = b * c; }
      if (n <= 0 || de <= 0) return false;
      var g = gcd(n, de);
      return (n / g) === +z[1] && (de / g) === +z[2] && (de / g) > 1;
    },
    gen: function (r, s) {
      var ops = s < 2 ? ['+', '−'] : s < 4 ? ['+', '−', '+'] : s < 6 ? ['+', '−', '×', '÷'] : ['+', '−', '×', '÷', '×', '÷'], op = r.pick(ops), a, b, c, d, n, de, g, tries = 0, dens = s < 2 ? [4, 5, 6, 8, 10] : s < 4 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
      do {
        tries++;
        b = r.pick(dens);
        if (s < 1) d = b;
        else if (s < 3) d = r.pick(dens.filter(function (x) { return x % b === 0 || b % x === 0; }));
        else d = r.pick(dens);
        a = r.int(1, b - 1); c = r.int(1, d - 1);
        if (op === '+') { n = a * d + c * b; de = b * d; } else if (op === '−') { n = a * d - c * b; de = b * d; }
        else if (op === '×') { n = a * c; de = b * d; } else { n = a * d; de = b * c; }
        if (n <= 0 || de <= 0) continue;
        g = gcd(n, de); n /= g; de /= g;
        if (de === 1) continue;
        if (op !== '+' && n >= de && op !== '÷') continue;
        break;
      } while (tries < 80);
      if (de == null || de === 1 || n <= 0) { a = 1; b = 2; c = 1; d = 3; op = '+'; n = 5; de = 6; }
      return { q: fr(a, b) + ' ' + op + ' ' + fr(c, d), a: fr(n, de), hint: 'Simplest form' };
    }
  });

  M.add({
    id: 'm9.4', world: 9, n: 4, strand: 'B', title: 'Decimals, percent and tax', neg: false, exact: false, ans: 'dec',
    exp: 'Gr7 Number and Financial Literacy: decimal operations, percent of a number, HST (13%), tips, unit price (Canadian dollars typed as decimals)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['dadd', 'pct', 'dmul'] : s < 4 ? ['dadd', 'dmul', 'ddiv', 'pct', 'tip', 'unit'] : ['dmul', 'ddiv', 'pct', 'tax', 'tip', 'unit', 'tax', 'dadd'], k = r.pick(kinds), a, b, na, nb, p, base, qt, cents, n, x, y, pl;
      if (k === 'dadd') {
        x = r.int(101, lv(s, 999, 9999)) / 100; y = r.int(11, lv(s, 99, 999)) / 10;
        if (r.chance(0.5)) return { q: D(x) + ' + ' + D(y), a: D(Math.round(x * 100 + y * 100) / 100) };
        return { q: D(x + y) + ' − ' + D(y), a: D(x), eq: D(x + y) + '-' + D(y) };
      }
      if (k === 'dmul') {
        do { na = r.int(2, lv(s, 9, 39)); nb = r.int(2, lv(s, 9, 29)); } while (na % 10 === 0 || nb % 10 === 0);
        return { q: D(na / 10) + ' × ' + D(nb / 10), a: D(na * nb / 100) };
      }
      if (k === 'ddiv') {
        nb = r.int(2, lv(s, 9, 15)); qt = r.int(2, lv(s, 12, 30));
        if (s >= 5 && r.chance(0.4)) return { q: D(nb * qt / 100) + ' ÷ ' + D(nb / 100), a: String(qt) };
        return { q: D(nb * qt / 10) + ' ÷ ' + D(nb / 10), a: String(qt) };
      }
      if (k === 'pct') {
        p = r.pick(s < 2 ? [10, 20, 25, 50] : [5, 15, 35, 45, 12, 8, 30, 60, 75]); base = 10 * r.int(2, lv(s, 10, 40));
        return { q: p + '% of ' + base, a: D(base * p / 100) };
      }
      if (k === 'tax') {
        base = 5 * r.int(2, lv(s, 20, 80));
        return { q: '$' + base + ' + 13% HST. Total $?', a: D(base + base * 13 / 100), eq: base + '+' + base + '×13%' };
      }
      if (k === 'tip') {
        p = r.pick([10, 15, 20]); base = 5 * r.int(2, lv(s, 12, 24));
        return { q: 'Tip ' + p + '% on $' + base + '. Tip $?', a: D(base * p / 100), eq: base + '×' + p + '%' };
      }
      cents = 5 * r.int(2, lv(s, 30, 100)); n = r.int(2, 8);
      return { q: '$' + F.dollars(cents * n) + ' for ' + n + ' kg. $ per kg?', a: D(cents / 100), eq: (cents * n / 100) + '/' + n, hint: 'Divide the price' };
    }
  });

  M.add({
    id: 'm9.5', world: 9, n: 5, strand: 'B', title: 'Ratios and proportions', neg: false, exact: false, ans: 'num',
    exp: 'Gr7 Number: proportions, unit rates, ratio sharing, scale (whole-number answers)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['prop', 'prop', 'rate'] : s < 4 ? ['prop', 'rate', 'scale', 'unit'] : ['prop', 'rate', 'scale', 'unit', 'ratio', 'share', 'prop2'], k = r.pick(kinds), a, b, c, n, m, f, t, u;
      if (k === 'prop' || k === 'prop2') {
        b = r.int(2, lv(s, 6, 12)); a = r.int(1, b - 1); f = r.int(2, lv(s, 5, 12));
        if (k === 'prop2' && r.chance(0.5)) return { q: a + '/' + b + ' = ' + (a * f) + '/_', a: String(b * f) };
        return { q: a + '/' + b + ' = _/' + (b * f), a: String(a * f) };
      }
      if (k === 'rate') {
        n = r.int(2, lv(s, 5, 9)); u = r.int(2, lv(s, 8, 30)); do { m = r.int(2, lv(s, 6, 12)); } while (m === n); t = r.int(0, 2);
        if (t === 0) return { q: '$' + (u * n) + ' for ' + n + ' kg. ' + m + ' kg costs $?', a: String(u * m), eq: (u * n) + '/' + n + '×' + m };
        if (t === 1) return { q: (u * n) + ' km in ' + n + ' h. Distance in ' + m + ' h?', a: String(u * m), eq: (u * n) + '/' + n + '×' + m };
        return { q: n + ' cups make ' + (n * 3) + ' muffins. ' + (m * 3) + ' muffins: cups?', a: String(m), eq: (m * 3) + '/3' };
      }
      if (k === 'scale') { n = r.int(2, lv(s, 9, 50)); m = r.int(2, lv(s, 9, 25)); return { q: 'Map: 1 cm = ' + n + ' km. ' + m + ' cm is __ km?', a: String(n * m), eq: n + '×' + m }; }
      if (k === 'unit') { n = r.int(2, lv(s, 5, 9)); u = r.int(5, lv(s, 40, 90)); return { q: (u * n) + ' km in ' + n + ' h. km per h?', a: String(u), eq: (u * n) + '/' + n }; }
      if (k === 'ratio') { a = r.int(1, 4); b = r.int(a + 1, 6); f = r.int(2, 9); return { q: 'Ratio red:blue = ' + a + ':' + b + '. ' + (a * f) + ' red. Blue?', a: String(b * f), eq: (a * f) + '/' + a + '×' + b }; }
      a = r.int(1, 4); b = r.int(a + 1, 6); f = r.int(2, 9);
      return { q: 'Share ' + ((a + b) * f) + ' in ratio ' + a + ':' + b + '. Bigger part?', a: String(b * f), eq: ((a + b) * f) + '/(' + a + '+' + b + ')×' + b };
    }
  });

  M.add({
    id: 'm9.6', world: 9, n: 6, strand: 'C', title: 'Solve equations', neg: true, exact: true, ans: 'num',
    exp: 'Gr7 Algebra: solve one- and two-step equations (solutions may be negative), arithmetic patterns',
    gen: function (r, s) {
      var kinds = s < 2 ? ['a1', 'a2', 'a3'] : s < 4 ? ['a1', 'm1', 'd1', 'a2', 'seq'] : s < 6 ? ['m1', 'd1', 't1', 't2', 'seq'] : ['t1', 't2', 't3', 't4', 't5', 'seq'], k = r.pick(kinds), x, a, b, c, lim = lv(s, 9, 15), i, L, df;
      x = r.int(-lim, lim); if (x === 0) x = 3; a = r.int(2, lv(s, 6, 9)); b = r.int(1, lv(s, 9, 15));
      if (k === 'a1') return { q: 'x + ' + b + ' = ' + sg(x + b), a: String(x) };
      if (k === 'a2') return { q: 'x − ' + b + ' = ' + sg(x - b), a: String(x) };
      if (k === 'a3') return { q: b + ' + x = ' + sg(x + b), a: String(x) };
      if (k === 'm1') { if (r.chance(0.3)) return { q: '−' + a + 'x = ' + sg(-a * x), a: String(x) }; return { q: a + 'x = ' + sg(a * x), a: String(x) }; }
      if (k === 'd1') return { q: 'x ÷ ' + a + ' = ' + sg(x), a: String(x * a) };
      if (k === 't1') return { q: a + 'x + ' + b + ' = ' + sg(a * x + b), a: String(x) };
      if (k === 't2') return { q: a + 'x − ' + b + ' = ' + sg(a * x - b), a: String(x) };
      if (k === 't3') return { q: b + ' − ' + a + 'x = ' + sg(b - a * x), a: String(x) };
      if (k === 't4') { c = r.int(1, 8); return { q: 'x ÷ ' + a + ' + ' + c + ' = ' + sg(x + c), a: String(a * x) }; }
      if (k === 't5') return { q: a + '(x + ' + b + ') = ' + sg(a * (x + b)), a: String(x) };
      df = r.int(2, lv(s, 6, 9)); var st = r.int(-6, 20);
      if (s >= 4 && r.chance(0.35)) { var f = r.pick([2, 3]); st = r.int(1, 5); L = []; for (i = 0; i < 4; i++) L.push(st * Math.pow(f, i)); return { q: L.join(', ') + ', _', a: String(st * Math.pow(f, 4)), eq: String(st * Math.pow(f, 4)) }; }
      L = []; var dn = r.chance(0.5);
      for (i = 0; i < 4; i++) L.push(dn ? st - df * i : st + df * i);
      return { q: L.map(sg).join(', ') + ', _', a: String(dn ? st - df * 4 : st + df * 4), eq: sg(dn ? st - df * 4 : st + df * 4) };
    }
  });

  M.add({
    id: 'm9.7', world: 9, n: 7, strand: 'E', title: 'Angles, volume and chance', neg: false, exact: false, ans: 'num',
    exp: 'Gr7 Spatial Sense and Data: angles in triangles, volume of prisms (rectangular, triangular), probability as a percent, rotational symmetry and translations (UNCERTAIN: cylinders use pi and are skipped; transformation placement UNCERTAIN)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['tri', 'tri', 'box', 'pr', 'rot'] : s < 4 ? ['tri', 'iso', 'box', 'pr', 'quad', 'rot', 'trans'] : ['tri', 'iso', 'box', 'tprism', 'pr', 'quad', 'inone', 'bag', 'rot', 'trans'], k = r.pick(kinds), a, b, c, n, t, d, an;
      if (k === 'rot') { a = r.pick([['square', 4], ['equilateral triangle', 3], ['regular hexagon', 6], ['regular pentagon', 5], ['rectangle', 2], ['regular octagon', 8]]); return { q: 'Rotational symmetry order: ' + a[0] + '?', a: String(a[1]), eq: String(a[1]), hint: 'Turns that fit in one full turn' }; }
      if (k === 'trans') { a = r.int(1, 9); b = r.int(1, 9); c = r.int(1, 9); d = r.chance(0.5); return d ? { q: 'A(' + a + ',' + b + ') to A\'(' + (a + c) + ',' + b + '). Moved right?', a: String(c), eq: (a + c) + '-' + a } : { q: 'A(' + a + ',' + b + ') to A\'(' + a + ',' + (b + c) + '). Moved up?', a: String(c), eq: (b + c) + '-' + b }; }
      if (k === 'tri') { a = r.int(20, lv(s, 80, 100)); b = r.int(20, lv(s, 80, 100)); if (a + b > 150) b = 150 - a; if (b < 10) { b = 30; a = 40; } return { q: 'Angles ' + a + '°, ' + b + '°. Third?', a: String(180 - a - b), eq: '180-' + a + '-' + b }; }
      if (k === 'iso') { t = 2 * r.int(10, 80); return { q: 'Isosceles, top ' + t + '°. Base angle?', a: String((180 - t) / 2), eq: '(180-' + t + ')/2' }; }
      if (k === 'quad') { a = r.int(60, 120); b = r.int(60, 120); c = r.int(60, 120); if (a + b + c > 330) { a = 90; b = 90; c = 90; } return { q: 'Four angles: ' + a + '°, ' + b + '°, ' + c + '°, _?', a: String(360 - a - b - c), eq: '360-' + a + '-' + b + '-' + c }; }
      if (k === 'box') { a = r.int(2, lv(s, 6, 12)); b = r.int(2, lv(s, 6, 10)); c = r.int(2, lv(s, 5, 9)); return { q: 'Box ' + a + ' × ' + b + ' × ' + c + ' cm. Volume?', a: String(a * b * c), eq: a + '×' + b + '×' + c, hint: 'l × w × h' }; }
      if (k === 'pr') { a = r.int(2, lv(s, 9, 20)); b = r.int(2, lv(s, 6, 15)); c = r.int(2, 12); return { q: 'Prism: base area ' + (a * b) + ', height ' + c + '. V?', a: String(a * b * c), eq: (a * b) + '×' + c, hint: 'base area × height' }; }
      if (k === 'tprism') { do { a = r.int(3, 12); b = r.int(2, 12); } while ((a * b) % 2); c = r.int(3, 15); return { q: 'Triangular prism: b ' + a + ', h ' + b + ', L ' + c + '. V?', a: String(a * b / 2 * c), eq: a + '×' + b + '÷2×' + c, hint: '½ × b × h × length' }; }
      if (k === 'inone') { n = r.pick([2, 4, 5, 10, 20, 25, 50]); return { q: '1 in ' + n + ' chance. In %?', a: String(100 / n), eq: '100/' + n }; }
      n = r.pick([2, 4, 5, 10, 20]); d = r.int(1, n - 1); t = n * r.int(1, 3);
      var red = d * (t / n), blue = t - red, it = r.pick([['red', 'blue'], ['gold', 'green'], ['new', 'old']]);
      return { q: red + ' ' + it[0] + ', ' + blue + ' ' + it[1] + '. Chance of ' + it[0] + ' in %?', a: String(red * 100 / t), eq: red + '/' + t + '×100' };
    }
  });

  /* ================= WORLD 10 : Grade 8 ================= */

  M.add({
    id: 'm10.1', world: 10, n: 1, strand: 'B', title: 'Rational numbers', neg: true, exact: false, ans: 'dec',
    exp: 'Gr8 Number: operations with integers (including multiply and divide) and decimal rational numbers',
    gen: function (r, s) {
      var kinds = s < 2 ? ['imul', 'idiv', 'dadd'] : s < 4 ? ['imul', 'idiv', 'dadd', 'dsub', 'imul2'] : ['imul2', 'idiv2', 'dadd', 'dsub', 'dmul', 'ddiv'], k = r.pick(kinds), a, b, x, y, n, sa, sb, q, res, tries = 0, mx = lv(s, 9, 15);
      if (k === 'imul' || k === 'imul2') {
        do { a = r.int(2, mx); b = r.int(2, mx); sa = k === 'imul2' ? r.sign() : -1; sb = k === 'imul2' ? r.sign() : 1; if (r.chance(0.4)) sb = -sb; } while (sa * sb > 0 && k === 'imul2' && r.chance(0.5));
        a *= sa; b *= sb;
        return { q: sg(a) + ' × ' + pg(b), a: String(a * b) };
      }
      if (k === 'idiv' || k === 'idiv2') {
        b = r.int(2, mx); n = r.int(2, lv(s, 9, 15)); sa = r.sign(); sb = r.sign();
        if (k === 'idiv' && sa * sb > 0) sb = -sb;
        return { q: sg(b * n * sa) + ' ÷ ' + pg(b * sb), a: String(n * sa * sb) };
      }
      do {
        tries++;
        x = r.int(1, lv(s, 99, 999)) / 10; y = r.int(1, lv(s, 99, 999)) / 10;
        if (k === 'dadd') { sa = r.sign(); sb = r.sign(); res = Math.round((sa * x + sb * y) * 10) / 10; q = sa * x < 0 ? '−' + D(x) : D(x); q += ' + ' + (sb * y < 0 ? '(−' + D(y) + ')' : D(y)); }
        else if (k === 'dsub') { sa = r.sign(); sb = r.sign(); res = Math.round((sa * x - sb * y) * 10) / 10; q = (sa < 0 ? '−' : '') + D(x) + ' − ' + (sb < 0 ? '(−' + D(y) + ')' : D(y)); }
        else if (k === 'dmul') { var na = r.int(2, 9), nb = r.int(2, 9); sa = r.sign(); sb = r.sign(); res = sa * sb * na * nb / 100; q = (sa < 0 ? '−' : '') + D(na / 10) + ' × ' + (sb < 0 ? '(−' + D(nb / 10) + ')' : D(nb / 10)); }
        else { nb = r.int(2, 9); var qq = r.int(2, 12); sa = r.sign(); sb = r.sign(); res = sa * sb * qq; q = (sa < 0 ? '−' : '') + D(nb * qq / 10) + ' ÷ ' + (sb < 0 ? '(−' + D(nb / 10) + ')' : D(nb / 10)); }
      } while (tries < 20 && D(res).length > 6);
      return { q: q, a: D(res) };
    }
  });

  M.add({
    id: 'm10.2', world: 10, n: 2, strand: 'B', title: 'Powers and roots', neg: true, exact: true, ans: 'num',
    exp: 'Gr8 Number: powers, exponent laws (same base), scientific notation, square roots, estimating roots (UNCERTAIN: exact grade for exponent laws)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['sq', 'rt', 'sci1', 'pw'] : s < 4 ? ['sci1', 'sci2', 'rt', 'pw', 'law'] : ['sci2', 'sci3', 'law', 'near', 'negp', 'rt2', 'pw'], k = r.pick(kinds), a, b, c, n, e, t;
      if (k === 'sq') { n = r.int(11, 20); return { q: n + '²', a: String(n * n) }; }
      if (k === 'rt') { n = r.int(6, lv(s, 20, 30)); return { q: '√' + (n * n), a: String(n) }; }
      if (k === 'rt2') { a = r.int(3, 12); b = r.int(1, 12); n = a * a + b * b; return { q: '√' + (a * a) + ' + √' + (b * b), a: String(a + b) }; }
      if (k === 'pw') { var base = r.pick([2, 3, 4, 5, 6, 7]), mx = { 2: 10, 3: 6, 4: 5, 5: 4, 6: 4, 7: 3 }[base]; e = r.int(3, Math.max(3, lv(s, 4, mx))); return { q: base + '^' + e, a: String(Math.pow(base, e)) }; }
      if (k === 'sci1') { a = r.int(2, 9); e = r.int(2, 5); return { q: a + ' × 10^' + e, a: String(a * Math.pow(10, e)) }; }
      if (k === 'sci2') { a = r.int(11, 99) / 10; if (a % 1 === 0) a += 0.5; e = r.int(2, 4); return { q: D(a) + ' × 10^' + e, a: D(a * Math.pow(10, e)) }; }
      if (k === 'sci3') { a = r.int(11, 99) / 10; if (a % 1 === 0) a += 0.5; e = r.int(1, 4); return { q: D(Math.round(a * Math.pow(10, e + 1)) / 10) + ' = ' + D(a) + ' × 10^_', a: String(e), eq: String(e) }; }
      if (k === 'law') {
        a = r.int(2, 5); b = r.int(2, 4); c = r.int(2, 4);
        return r.chance(0.5) ? { q: a + '^' + (b + c) + ' ÷ ' + a + '^' + b, a: String(Math.pow(a, c)) } : { q: a + '^' + b + ' × ' + a + '^' + c, a: String(Math.pow(a, b + c)) };
      }
      if (k === 'negp') { a = r.int(2, 5); return { q: '(−' + a + ')³ + ' + a + '²', a: String(-a * a * a + a * a) }; }
      do { n = r.int(10, 90); t = Math.sqrt(n); } while (t % 1 === 0 || Math.abs((t % 1) - 0.5) < 0.06);
      return { q: 'Nearest whole: √' + n, a: String(Math.round(t)), eq: String(Math.round(t)) };
    }
  });

  M.add({
    id: 'm10.3', world: 10, n: 3, strand: 'B', title: 'Percent change and interest', neg: false, exact: false, ans: 'num',
    exp: 'Gr8 Number and Financial Literacy: percent increase/decrease, percent change, simple and compound interest (Canadian dollars, whole-dollar answers), find the original',
    gen: function (r, s) {
      var kinds = s < 2 ? ['up', 'down', 'chg'] : s < 4 ? ['up', 'down', 'chg', 'simple'] : ['chg', 'orig', 'simple', 'comp', 'up', 'down', 'orig'], k = r.pick(kinds), p, base, st, it, a, b, rt, yr, f, n;
      var pl = [10, 20, 25, 50, 5, 15, 30, 40, 60, 75, 12];
      p = r.pick(s < 2 ? [10, 20, 25, 50] : pl); st = 100 / gcd(100, p); base = st * r.int(1, Math.max(1, Math.floor(lv(s, 200, 1000) / st))); if (base < 20) base = st * Math.ceil(20 / st);
      it = r.pick(['Bike', 'Skates', 'Phone case', 'Backpack', 'Kayak']);
      if (k === 'up' || k === 'down') base = itemBase(r, it, st);
      if (k === 'up') return { q: it + ' $' + base + ', up ' + p + '%. New price $?', a: String(base + base * p / 100), eq: base + '+' + base + '×' + p + '%' };
      if (k === 'down') return { q: it + ' $' + base + ', down ' + p + '%. New price $?', a: String(base - base * p / 100), eq: base + '-' + base + '×' + p + '%' };
      if (k === 'chg') {
        a = base; b = base + (r.chance(0.5) ? 1 : -1) * base * p / 100;
        return { q: a + ' to ' + b + '. Percent change?', a: String(p), eq: '(' + Math.max(a, b) + '-' + Math.min(a, b) + ')/' + a + '×100', hint: 'Change ÷ start × 100' };
      }
      if (k === 'orig') {
        var pp = r.pick([10, 20, 25, 50, 40]), mult = 100 / gcd(100, 100 - pp); n = mult * r.int(1, Math.max(1, Math.floor(lv(s, 20, 120) / mult))); if (n < 10) n = mult * Math.ceil(10 / mult);
        var after = n * (100 - pp) / 100;
        return { q: 'Sale price $' + after + ' after ' + pp + '% off. Was $?', a: String(n), eq: after + '/(1-' + pp + '%)', hint: 'Sale price is ' + (100 - pp) + '% of the old' };
      }
      if (k === 'simple') {
        rt = r.pick([2, 4, 5, 10]); st = 100 / gcd(100, rt); base = st * r.int(1, Math.max(1, Math.floor(lv(s, 300, 1000) / st))); if (base < 100) base = st * Math.ceil(100 / st); yr = r.int(2, 5);
        return { q: '$' + base + ' at ' + rt + '% for ' + yr + ' yr. Interest $?', a: String(base * rt * yr / 100), eq: base + '×' + rt + '%×' + yr };
      }
      var cp = r.pick([[10, 100], [20, 25], [5, 400], [10, 200]]);
      n = cp[1] * r.int(1, 4); f = 1 + cp[0] / 100;
      return { q: '$' + n + ' at ' + cp[0] + '%, 2 yr, compound. Total $?', a: String(Math.round(n * f * f * 100) / 100), eq: n + '×(1+' + cp[0] + '%)×(1+' + cp[0] + '%)', hint: 'Grow it twice' };
    }
  });

  M.add({
    id: 'm10.4', world: 10, n: 4, strand: 'C', title: 'Multi-step equations', neg: true, exact: true, ans: 'num',
    exp: 'Gr8 Algebra: solve multi-step linear equations, variables on both sides, brackets, negative solutions',
    gen: function (r, s) {
      var kinds = s < 2 ? ['t1', 't2', 'bk'] : s < 4 ? ['t1', 'bk', 'neg', 'both'] : ['both', 'bk', 'neg', 'div', 'both2', 'bk2'], k = r.pick(kinds), x, a, b, c, d, lim = lv(s, 9, 14);
      x = r.int(-lim, lim); if (x === 0) x = 4; a = r.int(2, lv(s, 6, 9)); b = r.int(1, lv(s, 9, 15));
      if (k === 't1') return { q: a + 'x + ' + b + ' = ' + sg(a * x + b), a: String(x) };
      if (k === 't2') return { q: a + 'x − ' + b + ' = ' + sg(a * x - b), a: String(x) };
      if (k === 'bk') return { q: a + '(x + ' + b + ') = ' + sg(a * (x + b)), a: String(x) };
      if (k === 'bk2') return { q: a + '(x − ' + b + ') = ' + sg(a * (x - b)), a: String(x) };
      if (k === 'neg') return { q: '−' + a + 'x + ' + b + ' = ' + sg(-a * x + b), a: String(x) };
      if (k === 'div') { c = r.int(2, 5); return { q: 'x ÷ ' + c + ' − ' + b + ' = ' + sg(x - b), a: String(c * x) }; }
      if (k === 'both') {
        c = r.int(1, a - 1); d = a * x + b - c * x;
        return { q: a + 'x + ' + b + ' = ' + (c === 1 ? '' : c) + 'x ' + (d < 0 ? '− ' + (-d) : '+ ' + d), a: String(x) };
      }
      c = r.int(1, a - 1); d = a * x - b - c * x;
      return { q: a + 'x − ' + b + ' = ' + (c === 1 ? '' : c) + 'x ' + (d < 0 ? '− ' + (-d) : '+ ' + d), a: String(x) };
    }
  });

  M.add({
    id: 'm10.5', world: 10, n: 5, strand: 'C', title: 'Linear relationships', neg: true, exact: true, ans: 'num',
    exp: 'Gr8 Algebra: linear relationships, tables of values, y = mx + b, slope and rate of change',
    gen: function (r, s) {
      var kinds = s < 2 ? ['eval', 'table'] : s < 4 ? ['eval', 'table', 'solve', 'slope'] : ['eval', 'table', 'solve', 'slope', 'slope2', 'neg'], k = r.pick(kinds), m, b, x, y, i, xs, ys, x1, x2, y1, y2, dx, dy;
      m = r.int(2, lv(s, 5, 9)); b = r.int(1, lv(s, 6, 12)); x = r.int(2, lv(s, 6, 12));
      if (k === 'eval') { var pm = r.chance(0.5); return { q: 'y = ' + m + 'x ' + (pm ? '+' : '−') + ' ' + b + ', x = ' + x + '. y?', a: String(m * x + (pm ? b : -b)), eq: m + '×' + x + (pm ? '+' : '-') + b }; }
      if (k === 'neg') { x = r.int(1, 8); return { q: 'y = −' + m + 'x + ' + b + ', x = ' + x + '. y?', a: String(-m * x + b), eq: sg(-m) + '×' + x + '+' + b }; }
      if (k === 'table') {
        xs = [1, 2, 3]; ys = xs.map(function (v) { return m * v + b; }); x = r.int(5, lv(s, 8, 20));
        return { q: 'x 1, 2, 3 gives y ' + ys.join(', ') + '. x = ' + x + ', y?', a: String(m * x + b), eq: m + '×' + x + '+' + b };
      }
      if (k === 'solve') { return { q: 'y = ' + m + 'x + ' + b + '. y = ' + (m * x + b) + '. x?', a: String(x), eq: String(x) }; }
      if (k === 'slope') { dx = r.int(2, 5); dy = m * dx; return { q: 'Rises ' + dy + ' over run ' + dx + '. Slope?', a: String(m), eq: dy + '/' + dx }; }
      x1 = r.int(0, 4); dx = r.int(1, 4); var sl = r.int(1, 5) * r.sign(); dy = sl * dx; y1 = r.int(0, 3) + (sl < 0 ? -dy : 0); x2 = x1 + dx; y2 = y1 + dy;
      return { q: '(' + x1 + ',' + y1 + ') and (' + x2 + ',' + y2 + '): slope?', a: String(dy / dx), eq: sg(dy / dx), hint: 'Rise ÷ run' };
    }
  });

  var TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  M.add({
    id: 'm10.6', world: 10, n: 6, strand: 'E', title: 'Pythagoras and solids', neg: false, exact: true, ans: 'num',
    exp: 'Gr8 Spatial Sense: Pythagorean theorem with whole-number triples, surface area and volume of prisms, scale factors and dilations of a point from the origin (UNCERTAIN: cylinders use pi and are skipped)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['hyp', 'cube', 'scale', 'dil'] : s < 4 ? ['hyp', 'leg', 'cube', 'box', 'scale', 'dil'] : ['hyp', 'leg', 'box', 'vol', 'area', 'scale', 'leg', 'dil'], k = r.pick(kinds), t = r.pick(s < 3 ? TRIP.slice(0, 3) : TRIP), f = r.int(1, s < 3 ? 2 : 4), a, b, c, n, m;
      if (k === 'dil') { a = r.int(1, 9); b = r.int(1, 9); m = r.int(2, lv(s, 4, 6)); c = r.chance(0.5); return { q: '(' + a + ',' + b + ') dilated ×' + m + ' from (0,0). New ' + (c ? 'x?' : 'y?'), a: String(m * (c ? a : b)), eq: m + '×' + (c ? a : b) }; }
      if (t[2] * f > 99) f = 1;
      if (k === 'hyp') return { q: 'Legs ' + t[0] * f + ' and ' + t[1] * f + '. Hypotenuse?', a: String(t[2] * f), eq: '√(' + t[0] * f + '²+' + t[1] * f + '²)' };
      if (k === 'leg') return { q: 'Hyp ' + t[2] * f + ', leg ' + t[0] * f + '. Other leg?', a: String(t[1] * f), eq: '√(' + t[2] * f + '²−' + t[0] * f + '²)' };
      if (k === 'cube') { n = r.int(2, lv(s, 6, 10)); return { q: 'Cube side ' + n + ' cm. Surface area?', a: String(6 * n * n), eq: '6×' + n + '²' }; }
      if (k === 'box') { a = r.int(2, lv(s, 6, 9)); b = r.int(2, 9); c = r.int(2, 9); return { q: 'Box ' + a + ' × ' + b + ' × ' + c + '. Surface area?', a: String(2 * (a * b + a * c + b * c)), eq: '2×(' + a + '×' + b + '+' + a + '×' + c + '+' + b + '×' + c + ')' }; }
      if (k === 'vol') { n = r.int(3, 12); return { q: 'Cube side ' + n + ' cm. Volume?', a: String(n * n * n), eq: n + '³' }; }
      if (k === 'area') { n = r.int(2, 9); m = r.int(2, 5); return { q: 'Scale ×' + m + '. Area ' + n + '. New area?', a: String(n * m * m), eq: n + '×' + m + '²' }; }
      n = r.int(2, 15); m = r.int(2, lv(s, 5, 9));
      return { q: 'Scale ×' + m + '. Side ' + n + ' cm. New side?', a: String(n * m), eq: n + '×' + m };
    }
  });

  M.add({
    id: 'm10.7', world: 10, n: 7, strand: 'D', title: 'Data, chance and budgets', neg: false, exact: false, ans: 'num',
    exp: 'Gr8 Data and Financial Literacy: mean, median, range, probability as a percent, unit rates and budgets (Canadian dollars; no currency exchange, not clearly in the Ontario curriculum)',
    gen: function (r, s) {
      var kinds = s < 2 ? ['range', 'mean', 'budget'] : s < 4 ? ['range', 'mean', 'median', 'prob', 'budget', 'plan'] : ['range', 'mean', 'median', 'prob', 'plan', 'save', 'budget', 'prob2'], k = r.pick(kinds), n, L, i, sorted, tries, v, m, sum, a, b, c, d, rt, md, base;
      if (k === 'range') { n = r.int(4, 6); L = []; for (i = 0; i < n; i++) L.push(r.int(2, lv(s, 30, 99))); sorted = srt(L); return { q: 'Range: ' + L.join(', '), a: String(sorted[n - 1] - sorted[0]), eq: sorted[n - 1] + '-' + sorted[0], hint: 'Biggest − smallest' }; }
      if (k === 'mean') {
        n = r.int(4, 6); m = r.int(8, lv(s, 30, 80));
        for (tries = 0; tries < 60; tries++) {
          L = []; sum = 0; for (i = 0; i < n - 1; i++) { v = m + r.int(-8, 8); L.push(v); sum += v; }
          v = m * n - sum; if (v >= 1 && v <= 99) { L.push(v); break; }
        }
        if (L.length < n) { L = []; for (i = 0; i < n; i++) L.push(m); }
        return { q: 'Mean: ' + r.shuffle(L).join(', '), a: String(m), eq: '(' + L.join('+') + ')/' + n, hint: 'Add up, then divide' };
      }
      if (k === 'median') {
        n = r.pick([4, 6, 7]); md = null;
        for (tries = 0; tries < 80; tries++) {
          L = []; for (i = 0; i < n; i++) L.push(r.int(1, lv(s, 30, 99)));
          sorted = srt(L);
          if (n % 2) { md = sorted[(n - 1) / 2]; break; }
          if ((sorted[n / 2 - 1] + sorted[n / 2]) % 2 === 0) { md = (sorted[n / 2 - 1] + sorted[n / 2]) / 2; break; }
        }
        if (md == null) { L = [4, 8, 10, 20]; md = 9; }
        return { q: 'Median: ' + L.join(', '), a: String(md), eq: String(md), hint: 'Put in order first' };
      }
      if (k === 'prob') {
        n = r.pick([2, 4, 5, 10, 20, 25]); a = r.int(1, n - 1);
        return { q: a + ' of ' + n + ' marbles are red. Chance red in %?', a: String(a * 100 / n), eq: a + '/' + n + '×100' };
      }
      if (k === 'prob2') {
        var T = r.int(0, 2);
        if (T === 0) return { q: 'Fair die. Chance of even, in %?', a: '50', eq: '3/6×100' };
        if (T === 1) return { q: 'Two coins. Chance of 2 heads, in %?', a: '25', eq: '1/4×100' };
        return { q: 'Spinner: 5 equal parts, 2 red. Red %?', a: '40', eq: '2/5×100' };
      }
      if (k === 'plan') {
        a = 5 * r.int(3, lv(s, 8, 14)); n = r.int(2, lv(s, 6, 12));
        return { q: 'Phone plan $' + a + ' a month. ' + n + ' months costs $?', a: String(a * n), eq: a + '×' + n };
      }
      if (k === 'save') {
        a = 5 * r.int(2, 8); n = r.int(3, 12); c = 5 * r.int(1, Math.floor(a * n / 5 - 1));
        if (c >= a * n) c = 5;
        return { q: 'Save $' + a + ' a week for ' + n + ' weeks, spend $' + c + '. Left $?', a: String(a * n - c), eq: a + '×' + n + '-' + c };
      }
      b = 5 * r.int(2, lv(s, 8, 30)); c = 5 * r.int(2, lv(s, 6, 20)); a = b + c + 5 * r.int(2, lv(s, 30, 100));
      return { q: 'Budget $' + a + '. Spent $' + b + ' and $' + c + '. Left $?', a: String(a - b - c), eq: a + '-' + b + '-' + c };
    }
  });
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
