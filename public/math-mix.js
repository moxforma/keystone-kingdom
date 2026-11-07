/* math-mix.js : MATH content for worlds 11 (review and challenge K-4) and 12 (grand challenge 5-8), 7 topics each.
 Also registers MATH.addWord templates (word problems for the spell chain and runners). Self-registering IIFE; depends only on the MATH core.
 Ontario Mathematics 2020 (Grades 1-8), strands B Number, C Algebra, D Data, E Spatial Sense, F Financial Literacy. Grade placement of items is UNCERTAIN and for the owner to check. */
(function (root) {
  'use strict';
  var MATH = root.MATH;
  if (!MATH || typeof MATH.add !== 'function') return;
  var fmt = MATH.fmt;

  function S(n) { return String(n); }
  /* pick a difficulty level between s-2 and s, then one generator of that level */
  function lvl(r, s, G) { var l = r.int(Math.max(0, s - 2), s); return r.pick(G[l])(r, s); }
  function ms(n) { return n < 0 ? '−' + (-n) : S(n); }              // signed number for display
  function par(n) { return n < 0 ? '(−' + (-n) + ')' : S(n); }       // number inside an expression
  function tm(n) { return n < 0 ? ' − ' + (-n) : ' + ' + n; }        // ' + 4' or ' − 4'
  /* world 12 starts at Grade 6 level: part 0 draws from levels 2-2, part 7 from 5-7 */
  function lvl12(r, s, G) { var l = Math.min(7, r.int(Math.max(0, s - 2), s) + (s < 3 ? 2 : s < 5 ? 1 : 0)); return r.pick(G[l])(r, s); }
  var NAMES = ['Maya', 'Sam', 'Noor', 'Liam', 'Ava', 'Kai', 'Priya', 'Leo', 'Zoe', 'Omar'];

  /* a hint must match the problem in front of the kid: pick it from the question text (first matching rule), never at random */
  function hintBy(q, rules, dflt) { var i; q = String(q); for (i = 0; i < rules.length; i++) if (rules[i][0].test(q)) return rules[i][1]; return dflt || ''; }
  var H_SPRINT = [[/[+].*[−]|[−].*[+]/, 'Add first, then take away'], [/\+.*\+/, 'Add two, then the next'], [/\+/, 'Make a ten, then add the rest'], [/−/, 'Count back, or count up']];
  var H_TIMES = [[/×/, 'Think of the times table'], [/÷/, 'Use the times table backward']];
  var H_MONEY = [[/Change\?/, 'Count up from the cost to what you pay'], [/each|at \$|at \d/, 'Multiply, then add'], [/loonie|toonie/, 'A loonie is $1, a toonie is $2'], [/Total/, 'Add the amounts']];
  var H_MEAS = [
    [/Perimeter \d+, length/, 'Half the perimeter, then take away the length'], [/Area \d+, width/, 'Area ÷ width'],
    [/Perimeter|Fence/, 'Add up all the sides'], [/Area\?|Tiles/, 'Length × width'],
    [/sides\?/, 'Count the sides'], [/faces|corners|edges/, 'Picture the shape'], [/symmetry/, 'Fold it so the halves match'], [/Row of/, 'Count from the other end'],
    [/Minutes\?/, 'Count up from the start time'], [/Days in/, '7 days in 1 week'],
    [/p\.m\.|24 h/, 'For the 24 h clock add 12 (or take away 12)'],
    [/^\d+ cm = _ mm$/, '10 mm make 1 cm'], [/^\d+ m = _ cm$|^\d+ cm = _ m$/, '100 cm make 1 m'], [/^\d+ kg = _ g$|^\d+ g = _ kg$/, '1000 g make 1 kg'], [/^\d+ L = _ mL$/, '1000 mL make 1 L']];
  var H_OPS = [[/\(/, 'Brackets first'], [/[²³]/, 'Powers first, then × ÷'], [/./, '× ÷ before + −']];
  var H_INTS = [[/−\s\(−/, 'Taking away a negative adds'], [/[×÷]/, 'Same signs: positive. Different signs: negative'], [/[²³]/, 'Multiply it out, watch the signs'], [/./, 'Use a number line']];
  var H_PCT = [[/is _% of/, 'Part ÷ whole × 100'], [/% change/, 'Change ÷ start × 100'], [/plus 13% HST/, 'Add 13% of the price'], [/HST/, '13% = 10% + 3%'], [/off/, 'Find the % of the price, then take it off'],
    [/\/\d+ = _%/, 'Make the bottom 100'], [/= _%/, 'Move the point 2 places'], [/^50%/, 'Half of it'], [/^25%/, 'Halve it, halve again'], [/^75%/, 'Find 25%, then times 3'], [/./, 'Find 10% first']];
  var H_POW = [[/GCF/, 'The biggest number that divides both'], [/LCM/, 'The smallest number both go into'], [/Factors/, 'List the factor pairs'], [/Next prime/, 'A prime has only 1 and itself as factors'],
    [/× 10/, 'Move the point 2 or 3 places'], [/√/, 'Which number times itself?'], [/./, 'Multiply it out']];
  var H_GEO = [[/Triangular prism/, 'Triangle area × length'], [/Prism/, 'Base area × height'], [/Triangle b=/, 'Base × height ÷ 2'], [/Triangle angles/, 'Angles in a triangle add to 180°'],
    [/Parallelogram/, 'Base × height'], [/moved/, 'Count the moves on the grid'], [/Surface/, 'Add the area of every face'], [/Volume/, 'Length × width × height'], [/Angles on a line/, 'A straight line is 180°'],
    [/Right angle/, 'A right angle is 90°'], [/Circle r|Circle d=\d+\. Radius/, 'The diameter is 2 radii'], [/C = 3\.14/, 'Multiply by 3.14'], [/dilated/, 'Multiply by the scale'], [/symmetry/, 'Fold it so the halves match'],
    [/Legs|Hyp/, 'a² + b² = c²'], [/Scale/, 'Multiply by the scale'], [/Perimeter/, 'Add up all the sides'], [/Area/, 'Length × width']];
  var H_RATE = [[/% off, plus 13% HST/, 'Take off the discount first, then add HST'], [/HST/, 'Add 13% of the price'], [/off/, 'Find the % of the price, then take it off'], [/How far/, 'Distance = speed × time'], [/Speed \(km\/h\)/, 'Speed = distance ÷ time'],
    [/muffins/, 'Find the cost of one first'], [/Mean/, 'Add them up, then ÷ how many'], [/Range/, 'Biggest minus smallest'], [/Weeks/, 'Money still needed ÷ saved each week'], [/Ratio/, 'Total ÷ all the parts, then times the larger part'],
    [/Warms|°C/, 'Use a number line'], [/interest/, 'Amount × rate × years'], [/tip/, 'Find the % of the bill'], [/Pay \$100/, 'Add up what you bought, then take it from $100']];

  /* ============================================================ WORLD 11 ============================================================ */

  /* ---- m11.1 mental maths sprint ---- */
  function addP(r, a1, a2, b1, b2) { var a = r.int(a1, a2), b = r.int(b1, b2); return { q: a + ' + ' + b, a: S(a + b) }; }
  function subP(r, a1, a2, b1, b2) { var a = r.int(a1, a2), b = r.int(Math.min(b1, a), Math.min(b2, a)); return { q: a + ' − ' + b, a: S(a - b) }; }
  var SPRINT = [
    [function (r) { return addP(r, 1, 12, 1, 8); }, function (r) { return subP(r, 8, 20, 1, 9); }],
    [function (r) { return addP(r, 10, 30, 5, 20); }, function (r) { return subP(r, 20, 50, 5, 25); }],
    [function (r) { return addP(r, 20, 70, 10, 29); }, function (r) { return subP(r, 40, 99, 10, 50); }],
    [function (r) { return addP(r, 25, 75, 18, 24); }, function (r) {
      var a = 10 * r.int(3, 9) + r.int(0, 4), b = 10 * r.int(1, Math.floor(a / 10) - 1) + r.int(5, 9);
      return { q: a + ' − ' + b, a: S(a - b) };
    }],
    [function (r) { var a = r.step(100, 900, 25), b = r.step(25, 400, 25); return { q: a + ' + ' + b, a: S(a + b) }; },
      function (r) { var a = r.step(200, 900, 25), b = r.step(25, a - 25, 25); return { q: a + ' − ' + b, a: S(a - b) }; }],
    [function (r) { var a = r.int(120, 600), b = r.int(101, 999 - a); return { q: a + ' + ' + b, a: S(a + b) }; }, function (r) { var a = r.int(300, 999), b = r.int(100, a - 20); return { q: a + ' − ' + b, a: S(a - b) }; }],
    [function (r) { var a = r.int(10, 60), b = r.int(10, 60), c = r.int(10, 60); return { q: a + ' + ' + b + ' + ' + c, a: S(a + b + c) }; },
      function (r) { var a = r.int(30, 90), b = r.int(10, 40), c = r.int(5, a + b - 5); return { q: a + ' + ' + b + ' − ' + c, a: S(a + b - c) }; },
      function (r) { return addP(r, 90, 99, 30, 99); }],
    [function (r) { return addP(r, 1000, 6000, 100, 3000); }, function (r) { var a = r.int(2000, 9000), b = r.int(100, a - 500); return { q: a + ' − ' + b, a: S(a - b) }; },
      function (r) { var a = r.step(100, 900, 50), b = r.step(100, 900, 50), c = r.step(100, 900, 50); return { q: a + ' + ' + b + ' + ' + c, a: S(a + b + c) }; }]
  ];
  MATH.add({
    id: 'm11.1', world: 11, n: 1, strand: 'B', exp: 'Gr1-4 mental math: add and subtract within 20, 100, 1000, 10 000 (review sprint)', title: 'Math sprint',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl(r, s, SPRINT); x.hint = hintBy(x.q, H_SPRINT); return x; }
  });

  /* ---- m11.2 times and shares ---- */
  function mulP(r, as, bLo, bHi) { var a = r.pick(as), b = r.int(bLo, bHi); return r.chance(0.5) ? { q: a + ' × ' + b, a: S(a * b) } : { q: b + ' × ' + a, a: S(a * b) }; }
  function divP(r, ds, kLo, kHi) { var d = r.pick(ds), k = r.int(kLo, kHi); return { q: (d * k) + ' ÷ ' + d, a: S(k) }; }
  var TIMES = [
    [function (r) { return mulP(r, [2, 5, 10], 1, 10); }, function (r) { return divP(r, [2, 5, 10], 1, 10); }],
    [function (r) { return mulP(r, [3, 4], 1, 10); }, function (r) { return divP(r, [3, 4], 1, 10); }],
    [function (r) { return mulP(r, [6, 7], 1, 10); }, function (r) { return divP(r, [6, 7], 1, 10); }],
    [function (r) { return mulP(r, [2, 3, 4, 5, 6, 7, 8, 9], 2, 9); }, function (r) { return divP(r, [2, 3, 4, 5, 6, 7, 8, 9], 2, 9); }],
    [function (r) { return mulP(r, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2, 12); }, function (r) { return divP(r, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2, 12); }],
    [function (r) { return divP(r, [6, 7, 8, 9, 11, 12], 6, 12); }, function (r) { return mulP(r, [11, 12, 13, 15], 3, 12); }],
    [function (r) { var a = r.int(11, 49), b = r.int(2, 9); return { q: a + ' × ' + b, a: S(a * b) }; }, function (r) { var d = r.int(2, 9), k = r.int(11, 40); return { q: (d * k) + ' ÷ ' + d, a: S(k) }; }],
    [function (r) { var a = r.int(100, 399), b = r.int(2, 9); return { q: a + ' × ' + b, a: S(a * b) }; },
      function (r) { var a = r.pick([20, 30, 40, 50, 60, 70, 80, 90]), b = r.pick([20, 30, 40, 50]); return { q: a + ' × ' + b, a: S(a * b) }; },
      function (r) { var d = r.int(3, 9), k = r.int(30, 120); return { q: (d * k) + ' ÷ ' + d, a: S(k) }; },
      function (r) { var a = r.pick([25, 15, 35, 45, 75]), b = r.pick([2, 4, 6, 8]); return { q: a + ' × ' + b, a: S(a * b) }; }]
  ];
  MATH.add({
    id: 'm11.2', world: 11, n: 2, strand: 'B', exp: 'Gr2-4 multiplication and division facts to 10x10 and beyond, 2-3 digit by 1 digit (review)', title: 'Times and shares',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl(r, s, TIMES); x.hint = hintBy(x.q, H_TIMES); return x; }
  });

  /* ---- m11.3 skip-count challenge ---- */
  function seq(r, start, step, back, blank) {
    var v = [], i, shown = [], eq, a;
    for (i = 0; i < 4; i++) v.push(back ? start - i * step : start + i * step);
    a = v[blank];
    for (i = 0; i < 4; i++) shown.push(i === blank ? '_' : S(v[i]));
    if (blank > 0) eq = v[blank - 1] + (back ? ' − ' : ' + ') + step; else eq = v[1] + (back ? ' + ' : ' − ') + step;
    return { q: shown.join(', '), a: S(a), eq: eq };
  }
  var SKIP = [
    [function (r) { var st = r.pick([2, 5, 10]); return seq(r, st * r.int(1, 3), st, false, 3); }],
    [function (r) { var st = r.pick([2, 5, 10]); return seq(r, st * r.int(1, 6), st, false, r.int(0, 3)); }],
    [function (r) { var st = r.pick([3, 4]); return seq(r, st * r.int(1, 5), st, false, r.int(0, 3)); }],
    [function (r) { var st = r.pick([25, 50, 100]); return seq(r, st * r.int(1, 6), st, false, r.int(0, 3)); }],
    [function (r) { var st = r.pick([2, 3, 4, 5, 10]); return seq(r, st * r.int(5, 12), st, true, r.int(0, 3)); }],
    [function (r) { var st = r.pick([6, 7, 8, 9]), back = r.chance(0.3); return seq(r, st * (back ? r.int(3, 9) : r.int(1, 8)), st, back, r.int(0, 3)); }],
    [function (r) { var st = r.pick([12, 15, 20, 25, 11]), back = r.chance(0.4); return seq(r, back ? st * 3 + r.int(0, 30) : r.int(3, 60), st, back, r.int(0, 3)); }],
    [function (r) { var st = r.pick([50, 75, 125, 250, 11, 12, 15, 150]), back = r.chance(0.4); return seq(r, back ? st * 3 + r.int(0, 200) : r.int(1, 700), st, back, r.int(0, 3)); }]
  ];
  MATH.add({
    id: 'm11.3', world: 11, n: 3, strand: 'C', exp: 'Gr1-4 skip counting forward and backward, number patterns with a constant step (challenge)', title: 'Skip-count challenge',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl(r, s, SKIP); x.hint = 'Find the jump'; return x; }
  });

  /* ---- m11.4 missing number ---- */
  function misAdd(r, lo, hi) { var u = r.int(lo, hi), b = r.int(lo, hi), c = u + b; return r.chance(0.5) ? { q: '_ + ' + b + ' = ' + c, a: S(u) } : { q: b + ' + _ = ' + c, a: S(u) }; }
  function misSub(r, lo, hi) {
    var c = r.int(lo, hi), b = r.int(lo, hi), a = c + b;
    return r.chance(0.5) ? { q: a + ' − _ = ' + c, a: S(b) } : { q: '_ − ' + b + ' = ' + c, a: S(a) };
  }
  function misMul(r, lo, hi) { var u = r.int(lo, hi), b = r.int(lo, hi); return r.chance(0.5) ? { q: '_ × ' + b + ' = ' + (u * b), a: S(u) } : { q: b + ' × _ = ' + (u * b), a: S(u) }; }
  function misDiv(r, lo, hi) { var b = r.int(lo, hi), c = r.int(lo, hi); return r.chance(0.5) ? { q: '_ ÷ ' + b + ' = ' + c, a: S(b * c) } : { q: (b * c) + ' ÷ _ = ' + c, a: S(b) }; }
  var MISSING = [
    [function (r) { return misAdd(r, 1, 9); }],
    [function (r) { return r.chance(0.5) ? misAdd(r, 5, 25) : misSub(r, 3, 20); }],
    [function (r) { return r.chance(0.5) ? misAdd(r, 12, 60) : misSub(r, 10, 50); }],
    [function (r) { return misMul(r, 2, 5); }, function (r) { return misMul(r, 2, 10); }],
    [function (r) { return misDiv(r, 2, 9); }, function (r) { return misMul(r, 3, 9); }],
    [function (r) { return r.pick([misAdd, misSub, misMul, misDiv])(r, 4, 12); }, function (r) { return misAdd(r, 40, 120); }],
    [function (r) { var u = r.int(2, 12), a = r.int(2, 9), b = r.int(1, 20); return { q: '_ × ' + a + ' + ' + b + ' = ' + (u * a + b), a: S(u) }; },
      function (r) { var u = r.int(3, 12), a = r.int(2, 9), b = r.int(1, u * a - 1); return { q: a + ' × _ − ' + b + ' = ' + (u * a - b), a: S(u) }; }],
    [function (r) { return r.chance(0.5) ? misAdd(r, 100, 480) : misSub(r, 100, 480); },
      function (r) { var u = r.int(5, 30), a = r.int(3, 9), b = r.int(5, 60); return { q: '_ × ' + a + ' + ' + b + ' = ' + (u * a + b), a: S(u) }; },
      function (r) { var k = r.int(3, 12), d = r.int(3, 9), b = r.int(1, 30); return { q: '_ ÷ ' + d + ' + ' + b + ' = ' + (k + b), a: S(k * d) }; }]
  ];
  MATH.add({
    id: 'm11.4', world: 11, n: 4, strand: 'C', exp: 'Gr1-4 equality and finding the missing number in addition, subtraction, multiplication and division equations', title: 'Missing number',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl(r, s, MISSING); x.hint = r.pick(['Undo it', 'Work backward', 'Which number fits?']); return x; }
  });

  /* ---- m11.5 money change challenge (Canadian, no pennies: cash rounds to 5 cents) ---- */
  function mAns(c) { return c < 100 ? S(c) : fmt.dollars(c); } // under $1: cents ('35'); $1 and up: dollars ('1.35' or '3.00'); the checker also takes 0.35 and 135
  function dl(c) { return fmt.dollars(c); }
  var ITEMS = ['Juice', 'Bun', 'Toque', 'Mitts', 'Pencil', 'Apple', 'Muffin', 'Card', 'Stickers', 'Cookie', 'Puck', 'Maple candy', 'Eraser', 'Book', 'Poster'];
  var COINS = [5, 10, 25];
  function pr(r, lo, hi) { return 5 * r.int(Math.ceil(lo / 5), Math.floor(hi / 5)); }
  var MONEY = [
    [function (r) { var a = r.pick(COINS), b = r.pick(COINS), c = r.pick(COINS); return { q: a + '¢ + ' + b + '¢ + ' + c + '¢. Total?', a: mAns(a + b + c), eq: dl(a + b + c) }; }],
    [function (r) { var a = r.int(1, 5), b = r.int(1, 4); return { q: a + ' loonies, ' + b + ' toonies. Total $?', a: S(a + 2 * b), eq: a + ' + 2 × ' + b, cnt: true }; },
      function (r) { var b = r.int(1, 4), c = r.int(1, 3); return { q: b + (b === 1 ? ' toonie, ' : ' toonies, ') + c + (c === 1 ? ' quarter' : ' quarters') + '. Total?', a: mAns(200 * b + 25 * c), eq: dl(200 * b + 25 * c) }; }],
    [function (r) { var p = r.pick([100, 200]), c = pr(r, 5, p - 5); return { q: 'Pay ' + fmt.moneyD(p) + '. Cost ' + fmt.money(c) + '. Change?', a: mAns(p - c), eq: dl(p) + ' − ' + dl(c) }; }],
    [function (r) { var x = pr(r, 105, 600), y = pr(r, 105, 500); return { q: r.pick(ITEMS) + ' ' + fmt.moneyD(x) + ' + ' + r.pick(['stickers', 'a bun', 'a pen']) + ' ' + fmt.moneyD(y) + '. Total?', a: mAns(x + y), eq: dl(x) + ' + ' + dl(y) }; },
      function (r) { var x = pr(r, 100, 500), y = pr(r, 100, 450); return { q: fmt.moneyD(x) + ' + ' + fmt.moneyD(y) + '. Total?', a: mAns(x + y), eq: dl(x) + ' + ' + dl(y) }; }],
    [function (r) { var p = r.pick([500, 1000, 2000]), c = pr(r, 105, p - 5); return { q: 'Pay ' + fmt.moneyD(p) + '. Cost ' + fmt.moneyD(c) + '. Change?', a: mAns(p - c), eq: dl(p) + ' − ' + dl(c) }; }],
    [function (r) { var n = r.int(2, 6), p = pr(r, 105, 500); return { q: n + ' ' + r.pick(['muffins', 'pens', 'cards', 'cookies']) + ' at ' + fmt.moneyD(p) + ' each. Total?', a: mAns(n * p), eq: n + ' × ' + dl(p) }; }],
    [function (r) { var n = r.int(2, 5), p = pr(r, 150, 550), pay = r.pick([20, 25, 50]) * 100; if (n * p >= pay) pay = 5000; return { q: n + ' ' + r.pick(['pens', 'muffins', 'cards']) + ' at ' + fmt.moneyD(p) + '. Pay ' + fmt.moneyD(pay) + '. Change?', a: mAns(pay - n * p), eq: dl(pay) + ' − ' + n + ' × ' + dl(p) }; }],
    [function (r) { var n = r.int(2, 4), p = pr(r, 105, 345), x = pr(r, 500, 1295), tot = n * p + x; return { q: n + ' pens at ' + fmt.moneyD(p) + ' + book ' + fmt.moneyD(x) + '. Total?', a: mAns(tot), eq: n + ' × ' + dl(p) + ' + ' + dl(x) }; },
      function (r) { var x = pr(r, 505, 1495), y = pr(r, 305, 995), pay = 5000; return { q: 'Pay $50.00. Cost ' + fmt.moneyD(x) + ' + ' + fmt.moneyD(y) + '. Change?', a: mAns(pay - x - y), eq: '50 − ' + dl(x) + ' − ' + dl(y) }; }]
  ];
  MATH.add({
    id: 'm11.5', world: 11, n: 5, strand: 'F', exp: 'Gr2-4 Canadian money: totals, change, multiples; amounts to 5 cents (no pennies). Under $1 type 35 or 0.35; $1 and up type 1.35', title: 'Money change',
    neg: false, exact: true, ans: 'money',
    gen: function (r, s) { var x = lvl(r, s, MONEY); x.hint = hintBy(x.q, H_MONEY); return x; }
  });

  /* ---- m11.6 measure, time and shapes ---- */
  var SHAPES = [['Triangle', 3], ['Square', 4], ['Pentagon', 5], ['Hexagon', 6], ['Octagon', 8], ['Rectangle', 4]];
  var SOLIDS = [['Cube faces?', 6], ['Cube corners?', 8], ['Cube edges?', 12], ['Box faces?', 6], ['Pyramid faces?', 5]];
  var SYM = [['square', 4], ['rectangle', 2], ['equilateral triangle', 3], ['regular hexagon', 6], ['regular pentagon', 5], ['letter H', 2], ['letter A', 1], ['letter T', 1]];
  function ordn(n) { var t = n % 100, u = n % 10; return n + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); }
  function symQ(r) { var h = r.pick(SYM); return { q: 'Lines of symmetry: ' + h[0] + '?', a: S(h[1]), eq: S(h[1]), cnt: true }; }
  function posQ(r) { var n = r.int(4, 9), k = r.int(2, n - 1); return { q: 'Row of ' + n + '. Mia is ' + ordn(k) + ' from the left. From the right?', a: S(n - k + 1), eq: n + ' − ' + k + ' + 1' }; }
  var MEAS = [
    [function (r) { var h = r.pick(SHAPES); return { q: h[0] + ': how many sides?', a: S(h[1]), eq: S(h[1]) }; },
      function (r) { var h = r.pick(SOLIDS); return { q: h[0], a: S(h[1]), eq: S(h[1]) }; }, symQ, posQ],
    [function (r) { var a = r.int(2, 9); return { q: 'Square side ' + a + ' cm. Perimeter?', a: S(4 * a), eq: '4 × ' + a }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { q: 'Rectangle ' + a + ' cm by ' + b + ' cm. Perimeter?', a: S(2 * (a + b)), eq: '2 × (' + a + ' + ' + b + ')' }; }],
    [function (r) { var h = r.int(1, 11), m1 = 5 * r.int(0, 5), d = 5 * r.int(1, 5); return { q: fmt.time(h, m1) + ' to ' + fmt.time(h, m1 + d) + '. Minutes?', a: S(d), eq: S(d) }; },
      function (r) { var w = r.int(2, 6); return { q: 'Days in ' + w + ' weeks?', a: S(7 * w), eq: '7 × ' + w }; }],
    [function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { q: 'Rectangle ' + a + ' cm by ' + b + ' cm. Area?', a: S(a * b), eq: a + ' × ' + b }; }],
    [function (r) { var k = r.int(2, 9); return r.pick([
      { q: k + ' m = _ cm', a: S(k * 100), eq: k + ' × 100' }, { q: k + ' kg = _ g', a: S(k * 1000), eq: k + ' × 1000' },
      { q: k + ' L = _ mL', a: S(k * 1000), eq: k + ' × 1000' }, { q: k * 100 + ' cm = _ m', a: S(k), eq: (k * 100) + ' ÷ 100' },
      { q: k * 1000 + ' g = _ kg', a: S(k), eq: (k * 1000) + ' ÷ 1000' }, { q: k + ' cm = _ mm', a: S(k * 10), eq: k + ' × 10' }]); }],
    [function (r) {
      var sh = r.int(1, 8), sm = 5 * r.int(0, 11), d = 5 * r.int(4, 36), t = sh * 60 + sm + d, eh = Math.floor(t / 60), em = t % 60;
      return { q: fmt.time(sh, sm) + ' to ' + fmt.time(eh, em) + '. Minutes?', a: S(d), eq: '(' + eh + ' × 60 + ' + em + ') − (' + sh + ' × 60 + ' + sm + ')' };
    }],
    [function (r) { var w = r.int(2, 9), l = r.int(w + 1, 12); return { q: 'Area ' + (w * l) + ', width ' + w + '. Length?', a: S(l), eq: (w * l) + ' ÷ ' + w }; },
      function (r) { var l = r.int(3, 12), w = r.int(2, l - 1); return { q: 'Perimeter ' + (2 * (l + w)) + ', length ' + l + '. Width?', a: S(w), eq: (2 * (l + w)) + ' ÷ 2 − ' + l }; },
      function (r) { var h = r.int(1, 11); return r.chance(0.5) ? { q: h + ':00 p.m. = _:00 in 24 h', a: S(h + 12), eq: h + ' + 12' } : { q: (h + 12) + ':00 = _ p.m.', a: S(h), eq: (h + 12) + ' − 12' }; }],
    [function (r) { var a = r.int(6, 15), b = r.int(4, 12); return { q: 'Garden ' + a + ' m by ' + b + ' m. Area?', a: S(a * b), eq: a + ' × ' + b }; },
      function (r) { var a = r.int(6, 20), b = r.int(4, 15); return { q: 'Fence around ' + a + ' m by ' + b + ' m?', a: S(2 * (a + b)), eq: '2 × (' + a + ' + ' + b + ')' }; },
      function (r) { var a = r.int(6, 12), b = r.int(4, 9); return { q: 'Floor ' + a + ' m by ' + b + ' m. Tiles 1 m². Tiles?', a: S(a * b), eq: a + ' × ' + b }; }]
  ];
  MATH.add({
    id: 'm11.6', world: 11, n: 6, strand: 'E', exp: 'Gr1-4 measurement: perimeter, area, elapsed time, 24-hour clock, unit conversions (cm/m, g/kg, mL/L), sides and faces of shapes (review)', title: 'Measure and time',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl(r, s, MEAS); x.hint = hintBy(x.q, H_MEAS); return x; }
  });

  /* ---- m11.7 multi-step word problems (K-4, Canadian) ---- */
  var WORDS11 = [
    [function (r) { var n = r.pick(NAMES), a = r.int(2, 8), b = r.int(1, 5), c = r.int(1, 5); return { q: n + ' has ' + a + ' pucks. Gets ' + b + ', then ' + c + '. Total?', a: S(a + b + c), eq: a + ' + ' + b + ' + ' + c }; }],
    [function (r) { var n = r.pick(NAMES), a = r.int(15, 30), b = r.int(2, 7), c = r.int(2, 7); return { q: n + ' had ' + a + ' apples. Ate ' + b + ', gave ' + c + '. Left?', a: S(a - b - c), eq: a + ' − ' + b + ' − ' + c }; }],
    [function (r) { var g = r.int(2, 5), n = r.int(2, 5), c = r.int(1, g * n - 1); return { q: g + ' bags of ' + n + ' pucks. Lose ' + c + '. Left?', a: S(g * n - c), eq: g + ' × ' + n + ' − ' + c }; }],
    [function (r) { var a = r.int(3, 6), b = r.int(4, 9), c = r.int(2, a * b - 1); return { q: a + ' rows of ' + b + ' seats. ' + c + ' taken. Free?', a: S(a * b - c), eq: a + ' × ' + b + ' − ' + c }; },
      function (r) { var a = r.int(20, 60), b = r.int(5, 15), c = r.int(5, 20); return { q: 'Bus has ' + a + ' kids. ' + b + ' leave, ' + c + ' join. Now?', a: S(a - b + c), eq: a + ' − ' + b + ' + ' + c }; }],
    [function (r) { var n = r.int(2, 3), p = r.int(3, 6), pay = 20; return { q: 'Pay $20 for ' + n + ' tickets at $' + p + '. Change ($)?', a: S(pay - n * p), eq: '20 − ' + n + ' × ' + p }; },
      function (r) { var k = r.int(3, 6), n = r.int(3, 6), m = r.int(2, k - 1); return { q: (k * n) + ' cards in ' + k + ' packs. Cards in ' + m + ' packs?', a: S(n * m), eq: (k * n) + ' ÷ ' + k + ' × ' + m }; }],
    [function (r) { var a = r.int(2, 5), b = r.int(3, 6), c = r.int(2, 9); return { q: 'Walk ' + a + ' km daily for ' + b + ' days, plus ' + c + ' km. Total?', a: S(a * b + c), eq: a + ' × ' + b + ' + ' + c }; },
      function (r) { var a = r.int(3, 8), b = r.int(3, 7), c = r.int(3, 8), d = r.int(2, 6); return { q: a + ' bags of ' + b + ' pucks, ' + c + ' bags of ' + d + '. Total?', a: S(a * b + c * d), eq: a + ' × ' + b + ' + ' + c + ' × ' + d }; }],
    [function (r) { var a = r.int(3, 8), b = r.int(3, 7), c = r.int(3, 8), d = r.int(2, 6); return { q: a + ' bags of ' + b + ' pucks, ' + c + ' bags of ' + d + '. Total?', a: S(a * b + c * d), eq: a + ' × ' + b + ' + ' + c + ' × ' + d }; },
      function (r) { var n = r.int(2, 4), p = r.int(5, 9), h = r.int(4, 9); return { q: 'Pay $50. ' + n + ' shirts at $' + p + ', a hat $' + h + '. Change?', a: S(50 - n * p - h), eq: '50 − ' + n + ' × ' + p + ' − ' + h }; }],
    []
  ];
  WORDS11[7] = [
    function (r) { var n = r.int(2, 4), p = r.int(5, 9), h = r.int(4, 9), pay = 50; return { q: 'Pay $50. ' + n + ' shirts at $' + p + ', a hat $' + h + '. Change?', a: S(pay - n * p - h), eq: '50 − ' + n + ' × ' + p + ' − ' + h }; },
    function (r) { var a = r.int(3, 9), b = r.int(3, 9), c = r.int(2, 6), d = r.int(2, 8); return { q: a + ' packs of ' + b + ' cards, ' + c + ' packs of ' + d + '. Total?', a: S(a * b + c * d), eq: a + ' × ' + b + ' + ' + c + ' × ' + d }; },
    function (r) { var a = r.int(4, 9), b = r.int(3, 9), c = r.int(2, 9); return { q: a + ' canoes hold ' + b + ' kids. ' + c + ' more kids. Kids?', a: S(a * b + c), eq: a + ' × ' + b + ' + ' + c }; },
    function (r) { var d = r.int(3, 9), k = r.int(4, 12), e = r.int(1, 3); return { q: (d * k) + ' cards shared by ' + d + ' kids, ' + e + ' more each. Each?', a: S(k + e), eq: (d * k) + ' ÷ ' + d + ' + ' + e }; }
  ];
  MATH.add({
    id: 'm11.7', world: 11, n: 7, strand: 'B', exp: 'Gr1-4 multi-step word problems with Canadian contexts (add, subtract, multiply, divide, dollars)', title: 'Word challenge',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl(r, s, WORDS11); x.hint = r.pick(['Do one step at a time', 'Read it twice', 'Draw a picture']); return x; }
  });

  /* ============================================================ WORLD 12 ============================================================ */

  /* ---- m12.1 order of operations ---- */
  var OPS = [
    [function (r) { var a = r.int(2, 20), b = r.int(2, 5), c = r.int(2, 5); return { q: a + ' + ' + b + ' × ' + c, a: S(a + b * c) }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); return { q: a + ' × ' + b + ' + ' + c, a: S(a * b + c) }; }],
    [function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(1, a * b - 1); return { q: a + ' × ' + b + ' − ' + c, a: S(a * b - c) }; },
      function (r) { var b = r.int(2, 5), c = r.int(2, 5), a = r.int(b * c + 1, b * c + 20); return { q: a + ' − ' + b + ' × ' + c, a: S(a - b * c) }; },
      function (r) { var c = r.int(2, 6), b = r.int(2, 9), a = r.int(2, 30); return { q: a + ' + ' + (b * c) + ' ÷ ' + c, a: S(a + b) }; }],
    [function (r) { var a = r.int(2, 12), b = r.int(2, 12), c = r.int(2, 9); return { q: '(' + a + ' + ' + b + ') × ' + c, a: S((a + b) * c) }; },
      function (r) { var b = r.int(2, 12), a = r.int(b + 1, 25), c = r.int(2, 9); return { q: '(' + a + ' − ' + b + ') × ' + c, a: S((a - b) * c) }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), e = r.int(1, 9), d = a + b; return { q: (d * c) + ' ÷ (' + a + ' + ' + b + ') + ' + e, a: S(c + e) }; }],
    [function (r) { var a = r.int(2, 12), b = r.int(2, 6), c = r.int(2, 6), d = r.int(1, a + b * c); return { q: a + ' + ' + b + ' × ' + c + ' − ' + d, a: S(a + b * c - d) }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 6), d = r.int(1, (a + b) * c - 1); return { q: '(' + a + ' + ' + b + ') × ' + c + ' − ' + d, a: S((a + b) * c - d) }; }],
    [function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), d = r.int(2, 9); return { q: a + ' × ' + b + ' + ' + c + ' × ' + d, a: S(a * b + c * d) }; },
      function (r) { var b = r.int(2, 8), a = r.int(b + 1, 20), c = r.int(2, 9), d = r.int(1, 30); return { q: '(' + a + ' − ' + b + ') × ' + c + ' + ' + d, a: S((a - b) * c + d) }; },
      function (r) { var b = r.int(2, 9), a = b * r.int(2, 9), c = r.int(2, 9), d = r.int(2, 9); return { q: a + ' ÷ ' + b + ' + ' + c + ' × ' + d, a: S(a / b + c * d) }; }],
    [function (r) { var a = r.int(2, 30), b = r.int(2, 12); return { q: a + ' + ' + b + '²', a: S(a + b * b) }; },
      function (r) { var b = r.int(2, 9), a = r.int(b + 1, 12); return { q: a + '² − ' + b, a: S(a * a - b) }; },
      function (r) { var c = r.int(2, 6), d = r.int(2, 6); return { q: c + ' × ' + d + '²', a: S(c * d * d) }; },
      function (r) { var a = r.int(1, 8), b = r.int(1, 8); return { q: '(' + a + ' + ' + b + ')²', a: S((a + b) * (a + b)) }; }],
    [function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), e = r.int(2, 6), d = e * r.int(2, 6); var v = a * (b + c) - d / e; return { q: a + ' × (' + b + ' + ' + c + ') − ' + d + ' ÷ ' + e, a: S(v) }; },
      function (r) { var c = r.int(2, 9), d = r.int(1, c - 1), a = r.int(2, 9), b = r.int(2, 9); return { q: '(' + a + ' + ' + b + ') × (' + c + ' − ' + d + ')', a: S((a + b) * (c - d)) }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { q: a + '² + ' + b + '²', a: S(a * a + b * b) }; }],
    [function (r) { var k = r.int(2, 10), c = r.pick([2, 4, 5, 10]), d = r.int(1, 9); if ((k * k) % c) c = k; return { q: k + '² ÷ ' + c + ' + ' + d, a: S(k * k / c + d) }; },
      function (r) { var b = r.int(2, 5), a = r.int(2, 4), c = r.int(2, 5), d = r.int(2, 6); return { q: a + '³ + ' + b + ' × (' + (c + d) + ' − ' + d + ')', a: S(a * a * a + b * c) }; },
      function (r) { var a = r.int(2, 6), b = r.int(1, 5), c = r.int(2, 4), d = r.int(2, 3); return { q: a + ' × (' + b + ' + ' + c + ')² − ' + d + '³', a: S(a * (b + c) * (b + c) - d * d * d) }; }]
  ];
  MATH.add({
    id: 'm12.1', world: 12, n: 1, strand: 'C', exp: 'Gr5-8 order of operations with brackets, exponents (squares, cubes), whole numbers (grand challenge)', title: 'Order of operations',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl12(r, s, OPS); x.hint = hintBy(x.q, H_OPS); return x; }
  });

  /* ---- m12.2 integers ---- */
  function nz(r, lo, hi) { var v, k = 0; do { v = r.int(lo, hi); k++; } while (v === 0 && k < 20); return v || 1; }
  function iAdd(r, m) { var a = nz(r, -m, m), b = nz(r, -m, m); return { q: ms(a) + ' + ' + par(b), a: S(a + b) }; }
  function iSub(r, m) { var a = nz(r, -m, m), b = nz(r, -m, m); return { q: ms(a) + ' − ' + par(b), a: S(a - b) }; }
  function iMul(r, m) { var a = nz(r, -m, m), b = nz(r, -m, m); return { q: ms(a) + ' × ' + par(b), a: S(a * b) }; }
  function iDiv(r, m, k) { var d = r.int(2, m) * r.sign(), q = nz(r, -k, k); return { q: ms(d * q) + ' ÷ ' + par(d), a: S(q) }; }
  var INTS = [
    [function (r) { var a = r.chance(0.75) ? r.int(-9, -1) : r.int(1, 9), b = r.int(1, 9); return { q: ms(a) + ' + ' + b, a: S(a + b) }; }],
    [function (r) { return iAdd(r, 12); }, function (r) { return iSub(r, 10); }],
    [function (r) { var a = nz(r, -15, 15), b = r.int(1, 20); return { q: ms(a) + ' + ' + b, a: S(a + b) }; }, function (r) { return iSub(r, 15); }],
    [function (r) { return iMul(r, 6); }, function (r) { return iSub(r, 20); }, function (r) { return iAdd(r, 25); }],
    [function (r) { return iDiv(r, 9, 9); }, function (r) { return iMul(r, 9); }],
    [function (r) { var a = nz(r, -12, 12), b = nz(r, -12, 12), c = nz(r, -12, 12); return { q: ms(a) + ' + ' + par(b) + ' − ' + par(c), a: S(a + b - c) }; }, function (r) { return iDiv(r, 12, 12); }],
    [function (r) { var a = nz(r, -5, 5), b = r.int(2, 9), c = nz(r, -12, 12); return { q: ms(a) + ' × ' + b + tm(c), a: S(a * b + c) }; },
      function (r) { var a = nz(r, -9, 9), b = nz(r, -5, 5), c = r.int(2, 6); return { q: ms(a) + ' − ' + c + ' × ' + par(b), a: S(a - c * b) }; },
      function (r) { var a = r.int(-9, -2); return { q: '(' + ms(a) + ')²', a: S(a * a) }; }],
    [function (r) { var a = r.int(-4, -2), b = r.int(2, 9); return { q: '(' + ms(a) + ')³ + ' + (b * 10), a: S(a * a * a + b * 10) }; },
      function (r) { var a = nz(r, -9, 9), b = nz(r, -9, 9), d = r.int(2, 6), k = nz(r, -6, 6); return { q: ms(a) + ' × ' + par(b) + ' − ' + par(d * k) + ' ÷ ' + d, a: S(a * b - k) }; },
      function (r) { var a = nz(r, -30, 30), b = nz(r, -30, 30), c = nz(r, -30, 30); return { q: ms(a) + ' + ' + par(b) + ' + ' + par(c), a: S(a + b + c) }; }]
  ];
  MATH.add({
    id: 'm12.2', world: 12, n: 2, strand: 'B', exp: 'Gr7-8 integers: add, subtract, multiply, divide, powers with negatives (answers may be negative; type the minus sign first)', title: 'Integers',
    neg: true, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl12(r, s, INTS); x.hint = hintBy(x.q, H_INTS); return x; }
  });

  /* ---- m12.3 fractions, decimals and percent ---- */
  var PCTS = [
    [function (r) { var a = 10 * r.int(1, 20); return { q: '10% of ' + a, a: S(a / 10) }; }, function (r) { var a = 2 * r.int(1, 50); return { q: '50% of ' + a, a: S(a / 2) }; }],
    [function (r) { var a = 4 * r.int(1, 40); return { q: '25% of ' + a, a: S(a / 4) }; }, function (r) { var a = 4 * r.int(1, 50); return { q: '75% of ' + a, a: S(a * 3 / 4) }; }],
    [function (r) { var d = r.pick([2, 4, 5, 10, 20, 25, 50]), n = r.int(1, d - 1); return { q: n + '/' + d + ' = _%', a: S(n * 100 / d) }; }],
    [function (r) { var p = r.int(1, 99); return { q: fmt.dec(p / 100, 2) + ' = _%', a: S(p) }; }, function (r) { var p = r.int(1, 9) * 10; return { q: fmt.dec(p / 100, 1) + ' = _%', a: S(p) }; }],
    [function (r) { var p = 5 * r.int(1, 18), a = 20 * r.int(1, 10); return { q: p + '% of ' + a, a: S(p * a / 100) }; }],
    [function (r) { var y = r.pick([20, 25, 40, 50, 60, 80, 100, 200, 250]), p, x, t = 0; do { p = 5 * r.int(1, 19); x = y * p / 100; t++; } while (x !== Math.floor(x) && t < 40); if (x !== Math.floor(x)) { p = 50; x = y / 2; } return { q: x + ' is _% of ' + y, a: S(p), eq: x + ' × 100 ÷ ' + y }; }],
    [function (r) { var a = 40 * r.int(1, 7), p = r.pick([10, 20, 25, 50]); return { q: '$' + a + ' with ' + p + '% off. Pay?', a: S(a - a * p / 100), eq: a + ' − ' + p + '% × ' + a }; },
      function (r) { var a = 100 * r.int(1, 8); return { q: '13% HST on $' + a + '. HST ($)?', a: S(a * 13 / 100), eq: '13% × ' + a }; },
      function (r) { var a = 100 * r.int(1, 9); return { q: '$' + a + ' plus 13% HST. Total?', a: S(a * 113 / 100), eq: a + ' + 13% × ' + a }; }],
    [function (r) { var y = r.pick([20, 25, 40, 50, 80, 100, 200]), p = 5 * r.int(1, 19), x = y * p / 100, up = r.chance(0.5), z = up ? y + x : y - x; if (x !== Math.floor(x) || z <= 0) { return { q: '15% of 240', a: '36' }; } return { q: '$' + y + (up ? ' up to $' : ' down to $') + z + '. % change?', a: S(p), eq: x + ' × 100 ÷ ' + y }; },
      function (r) { var p = r.pick([15, 35, 45, 30, 60, 90]), a = 20 * r.int(2, 20); return { q: p + '% of ' + a, a: S(p * a / 100) }; }]
  ];
  MATH.add({
    id: 'm12.3', world: 12, n: 3, strand: 'B', exp: 'Gr5-8 percent of a number, fraction and decimal to percent, sales tax 13% HST, discounts, percent change', title: 'Percent power',
    neg: false, exact: false, ans: 'num',
    gen: function (r, s) { var x = lvl12(r, s, PCTS); x.hint = hintBy(x.q, H_PCT); return x; }
  });

  /* ---- m12.4 equations ---- */
  function eqSide(a, b) { return (a === 1 ? 'x' : a + 'x') + (b === 0 ? '' : tm(b)); }
  var EQS = [
    [function (r) { var x = r.int(1, 20), b = r.int(1, 15); return { q: 'x + ' + b + ' = ' + (x + b), a: S(x) }; },
      function (r) { var b = r.int(1, 12), x = r.int(b + 1, 25); return { q: 'x − ' + b + ' = ' + (x - b), a: S(x) }; }],
    [function (r) { var a = r.int(2, 9), x = r.int(2, 12); return { q: a + 'x = ' + (a * x), a: S(x) }; },
      function (r) { var a = r.int(2, 9), c = r.int(2, 12); return { q: 'x ÷ ' + a + ' = ' + c, a: S(a * c) }; }],
    [function (r) { var a = r.int(2, 6), x = r.int(2, 12), b = r.int(1, 15); return { q: a + 'x + ' + b + ' = ' + (a * x + b), a: S(x) }; },
      function (r) { var a = r.int(2, 6), x = r.int(3, 12), b = r.int(1, a * x - 1); return { q: a + 'x − ' + b + ' = ' + (a * x - b), a: S(x) }; }],
    [function (r) { var a = r.int(3, 9), x = r.int(5, 20), b = r.int(2, 30); return { q: a + 'x + ' + b + ' = ' + (a * x + b), a: S(x) }; },
      function (r) { var a = r.int(2, 6), k = r.int(2, 12), b = r.int(1, 15); return { q: 'x ÷ ' + a + ' + ' + b + ' = ' + (k + b), a: S(a * k) }; }],
    [function (r) { var a = r.int(2, 6), x = r.int(2, 12), b = r.int(1, 9); return { q: a + '(x + ' + b + ') = ' + (a * (x + b)), a: S(x) }; },
      function (r) { var a = r.int(4, 12), x = r.int(5, 30), b = r.int(1, 40); return { q: a + 'x + ' + b + ' = ' + (a * x + b), a: S(x) }; }],
    [function (r) { var c = r.int(1, 5), a = c + r.int(1, 5), x = r.int(1, 15), b = r.int(0, 12), d = (a - c) * x + b; return { q: eqSide(a, b) + ' = ' + eqSide(c, d), a: S(x) }; }],
    [function (r) { var b = r.int(2, 12), x = -r.int(1, 9); return { q: 'x + ' + b + ' = ' + ms(x + b), a: S(x) }; },
      function (r) { var b = r.int(1, 12), x = -r.int(1, 9); return { q: 'x − ' + b + ' = ' + ms(x - b), a: S(x) }; },
      function (r) { var a = r.int(2, 6), x = -r.int(1, 9), b = r.int(1, 12); return { q: a + 'x + ' + b + ' = ' + ms(a * x + b), a: S(x) }; }],
    [function (r) { var c = r.int(1, 5), a = c + r.int(1, 5), x = r.int(-9, 9), b = r.int(0, 12), d = (a - c) * x + b; return { q: eqSide(a, b) + ' = ' + eqSide(c, d), a: S(x) }; },
      function (r) { var a = r.int(2, 5), c = a - 1 === 1 ? 1 : r.int(1, a - 1), x = r.int(-8, 12), b = r.int(1, 6), d = a * (x + b) - c * x; return { q: a + '(x + ' + b + ') = ' + (c === 1 ? 'x' : c + 'x') + tm(d), a: S(x) }; }]
  ];
  MATH.add({
    id: 'm12.4', world: 12, n: 4, strand: 'C', exp: 'Gr6-8 solving one-step, two-step and multi-step equations, variables on both sides (negative solutions possible; type - first)', title: 'Solve for x',
    neg: true, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl12(r, s, EQS); x.hint = /x.*=.*x/.test(x.q) ? 'Do the same to both sides' : 'Undo the last step'; return x; }
  });

  /* ---- m12.5 powers, roots and factors ---- */
  function nfactors(n) { var c = 0, i; for (i = 1; i <= n; i++) if (n % i === 0) c++; return c; }
  function isPrime(n) { var i; if (n < 2) return false; for (i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  var PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  var POW = [
    [function (r) { var a = r.int(2, 10); return { q: a + '²', a: S(a * a) }; }],
    [function (r) { var a = r.int(11, 15); return { q: a + '²', a: S(a * a) }; }, function (r) { var a = r.int(2, 12); return { q: '√' + (a * a), a: S(a) }; }],
    [function (r) { var a = r.int(2, 5); return { q: a + '³', a: S(a * a * a) }; }, function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { q: 'GCF of ' + (a * b) + ' and ' + (a * (b + 1)), a: S(a) }; },
      function (r) { var n = r.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40]); return { q: 'Factors of ' + n + '?', a: S(nfactors(n)) }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { q: 'LCM of ' + a + ' and ' + b, a: S(a * b / MATH.gcd(a, b)) }; },
      function (r) { var a = r.int(3, 12), b = r.int(2, a - 1); return { q: a + '² − ' + b + '²', a: S(a * a - b * b) }; }],
    [function (r) { var k = r.int(2, 8); return { q: '2^' + k, a: S(Math.pow(2, k)) }; }, function (r) { var k = r.int(2, 4); return { q: '10^' + k, a: S(Math.pow(10, k)) }; }, function (r) { var a = r.int(3, 5), k = r.int(2, 4); return { q: a + '^' + k, a: S(Math.pow(a, k)) }; }],
    [function (r) { var a = r.int(3, 12), b = r.int(2, a - 1); return { q: a + '² − ' + b + '²', a: S(a * a - b * b) }; }, function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { q: 'LCM of ' + a + ' and ' + b, a: S(a * b / MATH.gcd(a, b)) }; }, function (r) { var n = r.pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 48]); return { q: 'Factors of ' + n + '?', a: S(nfactors(n)) }; }],
    [function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { q: '√' + (a * a) + ' + ' + b + '²', a: S(a + b * b) }; }, function (r) { var a = r.int(2, 9); return { q: a + '³ − √' + (a * a), a: S(a * a * a - a) }; },
      function (r) { var i = r.int(0, PRIMES.length - 2), n = PRIMES[i]; return { q: 'Next prime after ' + (n) + '?', a: S(PRIMES[i + 1]) }; }],
    [function (r) { var a = r.int(2, 12), b = r.int(2, 12), g = r.pick([2, 3, 4, 5, 6, 8]); return { q: 'GCF of ' + (g * a) + ' and ' + (g * b), a: S(g * MATH.gcd(a, b)) }; },
      function (r) { var a = r.pick([4, 6, 8, 9, 10, 12, 15]), b = r.pick([3, 5, 6, 7, 8, 9, 14]); return { q: 'LCM of ' + a + ' and ' + b, a: S(a * b / MATH.gcd(a, b)) }; },
      function (r) { var m = r.int(1, 9) * 5 + r.pick([0, 0.5]), k = r.int(2, 4); return { q: m + ' × 10' + (k === 2 ? '²' : '³'), a: S(m * (k === 2 ? 100 : 1000)) }; }],
    [function (r) { var a = r.int(2, 5), b = r.int(2, 4), c = r.int(2, 5); return { q: a + '² + ' + b + '³ − √' + (c * c), a: S(a * a + b * b * b - c) }; },
      function (r) { var a = r.int(10, 20); return { q: a + '² − √' + (a * a), a: S(a * a - a) }; },
      function (r) { var m = r.int(12, 99) / 10, k = r.pick([100, 1000]); return { q: m.toFixed(1) + ' × ' + (k === 100 ? '10²' : '10³'), a: S(Math.round(m * k)) }; }]
  ];
  MATH.add({
    id: 'm12.5', world: 12, n: 5, strand: 'B', exp: 'Gr6-8 squares, cubes, powers of 2 and 10, square roots, GCF, LCM, factors, primes, scientific notation (expanded form)', title: 'Powers and roots',
    neg: false, exact: true, ans: 'num',
    verify: function (p) {
      var q = p.q, n = +p.a, m;
      if ((m = /^GCF of (\d+) and (\d+)$/.exec(q))) return MATH.gcd(+m[1], +m[2]) === n;
      if ((m = /^LCM of (\d+) and (\d+)$/.exec(q))) return (+m[1]) * (+m[2]) / MATH.gcd(+m[1], +m[2]) === n;
      if ((m = /^Factors of (\d+)\?$/.exec(q))) return nfactors(+m[1]) === n;
      if ((m = /^Next prime after (\d+)\?$/.exec(q))) { var k = +m[1] + 1; while (!isPrime(k)) k++; return k === n; }
      var v = MATH.calc(q);
      return v != null && Math.abs(v - n) < 1e-9;
    },
    gen: function (r, s) { var x = lvl12(r, s, POW); x.hint = hintBy(x.q, H_POW); return x; }
  });

  /* ---- m12.6 geometry and measurement 5-8 ---- */
  var GEO = [
    [function (r) { var a = r.int(3, 15), b = r.int(2, 12); return { q: 'Rectangle ' + a + ' × ' + b + ' cm. Area?', a: S(a * b), eq: a + ' × ' + b }; },
      function (r) { var a = r.int(3, 15), b = r.int(2, 12); return { q: 'Rectangle ' + a + ' × ' + b + ' cm. Perimeter?', a: S(2 * (a + b)), eq: '2 × (' + a + ' + ' + b + ')' }; }],
    [function (r) { var b = r.int(2, 16), h = r.int(2, 12); if (b * h % 2) b++; return { q: 'Triangle b=' + b + ', h=' + h + '. Area?', a: S(b * h / 2), eq: b + ' × ' + h + ' ÷ 2' }; },
      function (r) { var a = r.int(20, 85), b = r.int(20, 175 - a - 20); return { q: 'Triangle angles ' + a + '°, ' + b + '°. Third?', a: S(180 - a - b), eq: '180 − ' + a + ' − ' + b }; }],
    [function (r) { var b = r.int(3, 14), h = r.int(2, 12); return { q: 'Parallelogram b=' + b + ', h=' + h + '. Area?', a: S(b * h), eq: b + ' × ' + h }; },
      function (r) { var x = r.int(1, 8), y = r.int(1, 8), dx = r.int(2, 7), up = r.chance(0.5); return up ? { q: '(' + x + ',' + y + ') moved right ' + dx + '. New x?', a: S(x + dx), eq: x + ' + ' + dx } : { q: '(' + x + ',' + y + ') moved up ' + dx + '. New y?', a: S(y + dx), eq: y + ' + ' + dx }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); return { q: 'Box ' + a + ' × ' + b + ' × ' + c + ' cm. Volume?', a: S(a * b * c), eq: a + ' × ' + b + ' × ' + c }; }],
    [function (r) { var a = 10 * r.int(2, 16); return { q: 'Angles on a line: ' + a + '° + _°', a: S(180 - a), eq: '180 − ' + a }; },
      function (r) { var d = r.int(2, 9); return r.chance(0.5) ? { q: 'Circle r=' + d + '. Diameter?', a: S(2 * d), eq: '2 × ' + d } : { q: 'Circle d=' + (2 * d) + '. Radius?', a: S(d), eq: (2 * d) + ' ÷ 2' }; },
      function (r) { var a = r.int(20, 120); return { q: 'Right angle: ' + Math.min(a, 80) + '° + _°', a: S(90 - Math.min(a, 80)), eq: '90 − ' + Math.min(a, 80) }; }],
    [function (r) { var a = r.int(2, 9); return { q: 'Cube side ' + a + ' cm. Volume?', a: S(a * a * a), eq: a + '³' }; },
      function (r) { var x = r.int(1, 9), y = r.int(1, 9), k = r.int(2, 5), w = r.chance(0.5); return { q: '(' + x + ',' + y + ') dilated ×' + k + ' from (0,0). New ' + (w ? 'x?' : 'y?'), a: S(k * (w ? x : y)), eq: k + ' × ' + (w ? x : y) }; },
      function (r) { var h = r.pick([['regular hexagon', 6], ['regular octagon', 8], ['regular pentagon', 5], ['square', 4]]); return { q: 'Lines of symmetry: ' + h[0] + '?', a: S(h[1]), eq: S(h[1]), cnt: true }; },
      function (r) { var a = r.int(2, 9); return { q: 'Cube side ' + a + ' cm. Surface area?', a: S(6 * a * a), eq: '6 × ' + a + '²' }; },
      function (r) { var b = r.int(5, 20), h = r.int(3, 12), k = r.int(2, 9); return { q: 'Prism: base area ' + b + ', h ' + h + '. Volume?', a: S(b * h), eq: b + ' × ' + h }; }],
    [function (r) { var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]]); return { q: 'Legs ' + t[0] + ' and ' + t[1] + '. Hypotenuse?', a: S(t[2]), eq: '√(' + t[0] + '² + ' + t[1] + '²)' }; },
      function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); return { q: 'Box ' + a + ' × ' + b + ' × ' + c + ' cm. Volume?', a: S(a * b * c), eq: a + ' × ' + b + ' × ' + c }; }],
    [function (r) { var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]), k = r.int(0, 1); return k ? { q: 'Hyp ' + t[2] + ', leg ' + t[0] + '. Other leg?', a: S(t[1]), eq: '√(' + t[2] + '² − ' + t[0] + '²)' } : { q: 'Hyp ' + t[2] + ', leg ' + t[1] + '. Other leg?', a: S(t[0]), eq: '√(' + t[2] + '² − ' + t[1] + '²)' }; },
      function (r) { var a = r.int(2, 6), b = r.int(2, 6), c = r.int(2, 6); return { q: 'Box ' + a + ' × ' + b + ' × ' + c + ' cm. Surface area?', a: S(2 * (a * b + a * c + b * c)), eq: '2 × (' + a + ' × ' + b + ' + ' + a + ' × ' + c + ' + ' + b + ' × ' + c + ')' }; }],
    [function (r) { var k = r.pick([10, 20, 25, 50, 100]), m = r.int(2, 9); return { q: 'Scale 1:' + k + '. ' + m + ' cm on map = _ cm', a: S(k * m), eq: m + ' × ' + k }; },
      function (r) { var b = r.int(3, 9), h = r.int(3, 9), l = r.int(4, 12); if (b * h % 2) b++; return { q: 'Triangular prism: b=' + b + ', h=' + h + ', long ' + l + '. Volume?', a: S(b * h / 2 * l), eq: b + ' × ' + h + ' ÷ 2 × ' + l }; },
      function (r) { var d = r.pick([50, 100, 200]); return { q: 'Circle d=' + d + '. C = 3.14 × d?', a: S(Math.round(314 * d / 100)), eq: '3.14 × ' + d }; }]
  ];
  MATH.add({
    id: 'm12.6', world: 12, n: 6, strand: 'E', exp: 'Gr5-8 area of rectangle, triangle, parallelogram; volume of prisms; symmetry, translations and dilations on a grid; angle sums; circle radius/diameter, circumference with 3.14; Pythagorean triples; surface area; scale', title: 'Geometry power',
    neg: false, exact: true, ans: 'num',
    gen: function (r, s) { var x = lvl12(r, s, GEO); x.hint = hintBy(x.q, H_GEO); return x; }
  });

  /* ---- m12.7 multi-step word problems and rates (5-8) ---- */
  var RATES = [
    [function (r) { var a = 20 * r.int(2, 10), p = r.pick([10, 50]); return { q: 'Skates $' + a + ', ' + p + '% off. Sale price ($)?', a: S(a - a * p / 100), eq: a + ' − ' + p + '% × ' + a }; },
      function (r) { var a = r.int(2, 9) * 10, b = r.int(2, 6); return { q: 'Speed ' + a + ' km/h for ' + b + ' h. How far (km)?', a: S(a * b), eq: a + ' × ' + b }; }],
    [function (r) { var s = r.int(40, 110), t = r.int(2, 6); return { q: (s * t) + ' km in ' + t + ' h. Speed (km/h)?', a: S(s), eq: (s * t) + ' ÷ ' + t }; },
      function (r) { var a = r.pick([20, 25]), p = a === 20 ? r.pick([10, 20, 25, 50]) : r.pick([20, 40]); a = a * r.int(2, 8); return { q: 'Toque $' + a + ', ' + p + '% off. Sale price ($)?', a: S(a - a * p / 100), eq: a + ' − ' + p + '% × ' + a }; }],
    [function (r) { var n = r.int(2, 6), p = r.int(2, 9), m = r.int(2, 10); return { q: n + ' muffins cost $' + (n * p) + '. Cost of ' + m + ' muffins ($)?', a: S(p * m), eq: (n * p) + ' ÷ ' + n + ' × ' + m }; }],
    [function (r) { var m = r.int(5, 40), d = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)]; d.push(-(d[0] + d[1] + d[2])); return { q: 'Mean of ' + (m + d[0]) + ', ' + (m + d[1]) + ', ' + (m + d[2]) + ', ' + (m + d[3]) + '?', a: S(m), eq: '(' + (m + d[0]) + ' + ' + (m + d[1]) + ' + ' + (m + d[2]) + ' + ' + (m + d[3]) + ') ÷ 4' }; },
      function (r) { var v = [r.int(3, 40), r.int(3, 40), r.int(3, 40), r.int(3, 40), r.int(3, 40)], mx = Math.max.apply(null, v), mn = Math.min.apply(null, v); return { q: 'Range of ' + v.join(', ') + '?', a: S(mx - mn), eq: mx + ' − ' + mn }; }],
    [function (r) { var a = r.int(2, 9) * 5, w = r.int(6, 30), have = r.int(0, 3) * a; return { q: 'Has $' + have + '. Needs $' + (have + a * w) + '. Saves $' + a + '/week. Weeks?', a: S(w), eq: '(' + (have + a * w) + ' − ' + have + ') ÷ ' + a }; },
      function (r) { var a = r.int(1, 4), b = a + r.int(1, 5), k = r.int(2, 9); return { q: 'Ratio ' + a + ':' + b + ', total ' + (k * (a + b)) + '. Larger part?', a: S(k * b), eq: (k * (a + b)) + ' ÷ ' + (a + b) + ' × ' + b }; }],
    [function (r) { var a = 100 * r.int(1, 8); return { q: 'Boots $' + a + ' plus 13% HST. Total ($)?', a: S(a * 113 / 100), eq: a + ' + 13% × ' + a }; },
      function (r) { var a = r.int(-15, -1), b = r.int(a * -1 + 1, a * -1 + 20); return { q: 'It is ' + ms(a) + '°C. Warms by ' + b + '°C. Now?', a: S(a + b), eq: ms(a) + ' + ' + b }; }],
    [function (r) { var p = r.int(2, 8), a = 100 * r.int(1, 8), y = r.int(2, 4); return { q: p + '% simple interest on $' + a + ', ' + y + ' years. Interest ($)?', a: S(a * p * y / 100), eq: a + ' × ' + p + '% × ' + y }; },
      function (r) { var a = 20 * r.int(2, 12), p = r.pick([10, 15, 20]); return { q: 'Bill $' + a + ', tip ' + p + '%. Tip ($)?', a: S(a * p / 100), eq: a + ' × ' + p + '%' }; }],
    [function (r) { var a = r.pick([200, 400, 800]), p = r.pick([25, 50]); var sale = a - a * p / 100; if (sale % 100) { a = 400; p = 25; sale = 300; } return { q: '$' + a + ', ' + p + '% off, plus 13% HST. Total ($)?', a: S(sale * 113 / 100), eq: '(' + a + ' − ' + p + '% × ' + a + ') × 1.13' }; },
      function (r) { var k = r.int(2, 4), a = r.int(2, 6), p = r.int(10, 20), pay = 100; return { q: 'Pay $100. ' + k + ' jerseys at $' + p + ', ' + a + ' pucks at $2. Change?', a: S(pay - k * p - a * 2), eq: '100 − ' + k + ' × ' + p + ' − ' + a + ' × 2' }; }]
  ];
  MATH.add({
    id: 'm12.7', world: 12, n: 7, strand: 'F', exp: 'Gr5-8 multi-step problems: discounts, 13% HST, speed, unit rates, ratios, mean/range, savings plans, simple interest, tips, integer temperatures', title: 'Final word challenge',
    neg: true, exact: false, ans: 'num',
    gen: function (r, s) { var x = lvl12(r, s, RATES); x.hint = hintBy(x.q, H_RATE); return x; }
  });

  /* ============================================================ word templates for MATH.word (spell chain, runners) ============================================================ */
  if (typeof MATH.addWord === 'function') {
    MATH.addWord({ id: 'wm.pucks', world: 4, gen: function (r) { var a = r.int(2, 6), b = r.int(3, 8), c = r.int(1, a * b - 1); return { q: a + ' bags of ' + b + ' pucks. Lose ' + c + '. Left?', a: S(a * b - c), eq: a + ' × ' + b + ' − ' + c }; } });
    MATH.addWord({ id: 'wm.canoe', world: 5, gen: function (r) { var a = r.int(3, 9), b = r.int(2, 6), c = r.int(2, 9); return { q: a + ' canoes hold ' + b + ' kids. ' + c + ' more kids. Kids?', a: S(a * b + c), eq: a + ' × ' + b + ' + ' + c }; } });
    MATH.addWord({ id: 'wm.tickets', world: 5, gen: function (r) { var n = r.int(2, 4), p = r.int(3, 6); return { q: 'Pay $20 for ' + n + ' tickets at $' + p + '. Change?', a: S(20 - n * p), eq: '20 − ' + n + ' × ' + p }; } });
    MATH.addWord({ id: 'wm.syrup', world: 6, gen: function (r) { var k = r.int(3, 9), n = r.int(3, 9), m = r.int(2, 9); return { q: 'A jug holds ' + n + ' cups. ' + k + ' jugs and ' + m + ' cups. Cups?', a: S(n * k + m), eq: n + ' × ' + k + ' + ' + m }; } });
    MATH.addWord({ id: 'wm.area', world: 7, gen: function (r) { var b = 2 * r.int(2, 9), h = r.int(2, 9); return { q: 'Triangle base ' + b + ' cm, height ' + h + ' cm. Area?', a: S(b * h / 2), eq: b + ' × ' + h + ' ÷ 2' }; } });
    MATH.addWord({ id: 'wm.speed', world: 7, gen: function (r) { var a = r.int(2, 9) * 10, b = r.int(2, 6); return { q: a + ' km/h for ' + b + ' hours. How many km?', a: S(a * b), eq: a + ' × ' + b }; } });
    MATH.addWord({ id: 'wm.disc', world: 8, gen: function (r) { var a = 20 * r.int(2, 10), p = r.pick([10, 50]); return { q: 'Skates $' + a + ', ' + p + '% off. Sale price?', a: S(a - a * p / 100), eq: a + ' − ' + a + ' × ' + p + ' ÷ 100' }; } });
    MATH.addWord({ id: 'wm.hst', world: 8, gen: function (r) { var a = 100 * r.int(1, 8); return { q: 'Boots $' + a + ' plus 13% HST. Total in $?', a: S(a * 113 / 100), eq: a + ' + ' + a + ' × 13 ÷ 100' }; } });
    MATH.addWord({ id: 'wm.mean', world: 9, gen: function (r) { var m = r.int(5, 40), x = r.int(-4, 4), y = r.int(-4, 4), z = r.int(-4, 4), w = -(x + y + z); return { q: 'Mean of ' + (m + x) + ', ' + (m + y) + ', ' + (m + z) + ', ' + (m + w) + '?', a: S(m), eq: '(' + (m + x) + ' + ' + (m + y) + ' + ' + (m + z) + ' + ' + (m + w) + ') ÷ 4' }; } });
    MATH.addWord({ id: 'wm.ratio', world: 9, gen: function (r) { var a = r.int(1, 4), b = a + r.int(1, 5), k = r.int(2, 9); return { q: 'Ratio ' + a + ':' + b + ', total ' + (k * (a + b)) + '. Larger part?', a: S(k * b), eq: (k * (a + b)) + ' ÷ ' + (a + b) + ' × ' + b }; } });
    MATH.addWord({ id: 'wm.save', world: 10, gen: function (r) { var a = r.int(2, 9) * 5, w = r.int(6, 30), have = r.int(0, 3) * a; return { q: 'Has $' + have + '. Needs $' + (have + a * w) + '. Saves $' + a + ' a week. Weeks?', a: S(w), eq: '(' + (have + a * w) + ' − ' + have + ') ÷ ' + a }; } });
    MATH.addWord({ id: 'wm.interest', world: 10, gen: function (r) { var p = r.int(2, 8), a = 100 * r.int(1, 8), y = r.int(2, 4); return { q: p + '% interest on $' + a + ', ' + y + ' years. Interest?', a: S(a * p * y / 100), eq: a + ' × ' + p + ' × ' + y + ' ÷ 100' }; } });
    MATH.addWord({ id: 'wm.temp', world: 11, gen: function (r) { var a = r.int(-15, -1), b = r.int(-a + 1, -a + 20); return { q: 'It is ' + ms(a) + '°C. Warms by ' + b + '°C. Now?', a: S(a + b), eq: ms(a) + ' + ' + b }; } });
    MATH.addWord({ id: 'wm.pct', world: 12, gen: function (r) { var p = 5 * r.int(2, 18), a = 20 * r.int(2, 12); return { q: p + '% of ' + a + ' is how many?', a: S(p * a / 100), eq: a + ' × ' + p + ' ÷ 100' }; } });
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
