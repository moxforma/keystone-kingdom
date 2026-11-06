/* math-k1.js : MATH content for worlds 1-3 (JK/SK, Grade 1 first half, Grade 1 second half). Phase B1.
 Self-registering IIFE; loads after math-data.js and does nothing if MATH is missing. Plain ES5.
 Ontario sources (general knowledge, owner to verify): The Kindergarten Program (2016) math and Ontario Mathematics 2020 Grade 1
 (strands B Number, C Algebra, D Data, E Spatial Sense, F Financial Literacy). UNCERTAIN items are marked in each exp note.
 Replaces the sample topics m1.1 and m2.1. */
(function (root) {
  'use strict';
  var M = root && root.MATH;
  if (!M || typeof M.add !== 'function') return;

  /* ---------- small helpers (pure functions of rng, s) ---------- */
  var NAMES = ['Ava', 'Ben', 'Mia', 'Leo', 'Zoe', 'Sam', 'Noah', 'Maya', 'Pop', 'Finn', 'Ivy', 'Kai'];
  var THINGS = [['puck', 'pucks'], ['apple', 'apples'], ['canoe', 'canoes'], ['toque', 'toques'], ['card', 'cards'],
    ['star', 'stars'], ['syrup jar', 'syrup jars'], ['leaf', 'leaves'], ['Keylori', 'Keylori'], ['book', 'books']];
  var REDOK = [['canoe', 'canoes'], ['apple', 'apples'], ['toque', 'toques'], ['leaf', 'leaves'], ['star', 'stars'], ['card', 'cards']];
  var WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  function pl(t, n) { return n === 1 ? t[0] : t[1]; }
  function S(n) { return String(n); }
  function at(arr, s) { return arr[Math.max(0, Math.min(arr.length - 1, s))]; }
  function name2(r) { var a = r.pick(NAMES), b = r.pick(NAMES), i = 0; while (b === a && i++ < 20) b = r.pick(NAMES); return [a, b]; }
  function join(arr) { return arr.join(', '); }
  function odd(r, p) { return r.chance(p); }

  /* ================= WORLD 1 : JK/SK ================= */

  M.add({
    id: 'm1.1', world: 1, n: 1, strand: 'B', title: 'Count the dots', neg: false, exact: true, ans: 'num',
    exp: 'JK/SK: count objects to 10 (one-to-one, subitizing), then count to 20 with ten frames (Number sense; domain wording UNCERTAIN)',
    gen: function (r, s) {
      var mx = at([5, 5, 6, 7, 8, 10, 15, 20], s), n, layout, objs = ['apple', 'star', 'puck', 'leaf', 'maple'];
      if (s >= 6) n = r.int(s === 6 ? 8 : 11, s === 6 ? 15 : 20);
      else n = r.int(s < 2 ? 1 : 0, mx);
      if (n > 10) layout = r.pick(['frame', 'rows', 'scatter']);
      else if (n >= 1 && n <= 6) layout = r.pick(['row', 'dice', 'frame', 'scatter', 'circle']);
      else layout = r.pick(['row', 'frame', 'scatter', 'circle', 'rows']);
      return { q: r.pick(['?', 'How many?', 'Count', 'How many ' + r.pick(['apples', 'stars', 'pucks', 'leaves', 'maple leaves']) + '?']), a: S(n), aid: { dots: [n], layout: layout, obj: r.pick(objs) }, hint: 'Count them', eq: S(n) };
    }
  });

  M.add({
    id: 'm1.2', world: 1, n: 2, strand: 'B', title: 'Read the numbers', neg: false, exact: true, ans: 'num',
    exp: 'JK/SK: recognize and match numerals and number words to 10, then to 20 (UNCERTAIN: words are Grade 1 reading, used as keyboard practice)',
    gen: function (r, s) {
      var n, pre = r.pick(['Type ', 'Find ']), lay = r.pick(['row', 'frame', 'scatter']);
      if (s < 3) {
        n = r.int(1, s < 1 ? 5 : 10);
        return { q: pre + n, a: S(n), aid: odd(r, 0.6) ? { dots: [n], layout: lay } : null, eq: S(n) };
      }
      if (s < 5) { n = r.int(1, 10); return { q: odd(r, 0.5) ? WORDS[n] : pre + WORDS[n], a: S(n), eq: S(n) }; }
      /* number words only to ten; numerals 11-20 are typed from the numeral (no words above ten in the JK band) */
      if (s < 7) { n = r.int(0, 20); return { q: n <= 10 ? (odd(r, 0.5) ? WORDS[n] : (odd(r, 0.5) ? pre + n : pre + WORDS[n])) : pre + n, a: S(n), eq: S(n) }; }
      n = r.int(11, 20);
      return { q: pre + n, a: S(n), aid: odd(r, 0.5) ? { dots: [n], layout: r.pick(['frame', 'rows']) } : null, eq: S(n) };
    }
  });

  M.add({
    id: 'm1.3', world: 1, n: 3, strand: 'B', title: 'One more, one less', neg: false, exact: true, ans: 'num',
    exp: 'JK/SK: one more and one less than a number to 10, extended to 20 (relationships among numbers)',
    gen: function (r, s) {
      var mx = at([5, 6, 8, 10, 10, 12, 15, 20], s), k = (s >= 5 && odd(r, 0.4)) ? 2 : 1, more = r.chance(0.5), a, q, ans, eq, o;
      if (more) { a = r.int(0, mx - k); ans = a + k; q = odd(r, 0.5) ? k + ' more than ' + a : a + ' and ' + k + ' more'; eq = a + ' + ' + k; }
      else { a = r.int(k, mx); ans = a - k; q = odd(r, 0.5) ? k + ' less than ' + a : a + ', take away ' + k; eq = a + ' − ' + k; }
      o = { q: q, a: S(ans), eq: eq };
      if (s < 3 || odd(r, 0.2)) o.aid = { dots: [a], layout: r.pick(['row', 'frame', 'scatter']) };
      return o;
    }
  });

  M.add({
    id: 'm1.4', world: 1, n: 4, strand: 'B', title: 'Bigger, smaller, order', neg: false, exact: true, ans: 'num',
    exp: 'JK/SK: compare and order quantities to 10, extended to 20; missing number in a counting row',
    gen: function (r, s) {
      var mx = at([5, 6, 8, 10, 10, 10, 15, 20], s), kinds, k, a, b, c, ans, q, o;
      kinds = s < 2 ? ['big', 'small'] : s < 4 ? ['big', 'small', 'seq'] : ['big', 'small', 'seq', 'between', 'big3', 'small3'];
      k = r.pick(kinds);
      if (k === 'big' || k === 'small') {
        a = r.int(0, mx); b = r.int(0, mx); while (b === a) b = r.int(0, mx);
        ans = k === 'big' ? Math.max(a, b) : Math.min(a, b);
        o = { q: (k === 'big' ? 'Bigger: ' : 'Smaller: ') + a + ' or ' + b, a: S(ans), eq: S(ans) };
        if (s < 3) o.aid = { dots: [a, b], layout: 'row' };
        return o;
      }
      if (k === 'seq') {
        a = r.int(1, mx - 2);
        var pos = r.int(0, 2), arr = [a, a + 1, a + 2];
        ans = arr[pos]; arr[pos] = '_';
        if (pos === 0 && a === 0) arr = [1, 2, 3];
        return { q: join(arr), a: S(ans), eq: S(ans) };
      }
      if (k === 'between') {
        a = r.int(0, mx - 2);
        return { q: 'Between ' + a + ' and ' + (a + 2), a: S(a + 1), eq: S(a + 1) };
      }
      a = r.int(0, mx); b = r.int(0, mx); c = r.int(0, mx);
      while (b === a) b = r.int(0, mx);
      while (c === a || c === b) c = r.int(0, mx);
      ans = k === 'big3' ? Math.max(a, b, c) : Math.min(a, b, c);
      return { q: (k === 'big3' ? 'Biggest: ' : 'Smallest: ') + a + ', ' + b + ', ' + c, a: S(ans), eq: S(ans) };
    }
  });

  M.add({
    id: 'm1.5', world: 1, n: 5, strand: 'B', title: 'Make 5 and make 10', neg: false, exact: true, ans: 'num',
    exp: 'JK/SK: partners of 5 and 10 (decomposing numbers); SK number sense. Strand B',
    gen: function (r, s) {
      var t = s < 3 ? 5 : (s < 5 ? 10 : r.pick([5, 10, 10])), a = r.int(1, t - 1), b = t - a, o, f;
      if (s >= 7 && odd(r, 0.4)) {
        var x = r.int(1, t - 2), y = r.int(1, t - x - 1);
        o = { q: x + ' + ' + y + ' + _ = ' + t, a: S(t - x - y) };
        return o;
      }
      f = r.int(0, s >= 3 ? 4 : 3);
      if (f === 0) o = { q: a + ' + _ = ' + t, a: S(b) };
      else if (f === 1) o = { q: '_ + ' + a + ' = ' + t, a: S(b) };
      else if (f === 2) o = { q: t + ' = ' + a + ' + _', a: S(b) };
      else if (f === 3) o = { q: t + ' = _ + ' + a, a: S(b) };
      else o = { q: a + ' and _ make ' + t, a: S(b), eq: S(b) };
      if (s < 5) o.aid = { dots: [a, b], layout: 'frame', obj: r.pick(['apple', 'star', 'puck', 'leaf']) };
      o.hint = 'Make ' + t;
      return o;
    }
  });

  M.add({
    id: 'm1.6', world: 1, n: 6, strand: 'C', title: 'Patterns', neg: false, exact: true, ans: 'num',
    exp: 'JK/SK: repeating patterns (AB, AAB, ABB, ABC) as next number. Strand C Algebra / patterning',
    gen: function (r, s) {
      var digs = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]), unit, L, seq, i, ans, hide;
      if (s < 2) unit = [digs[0], digs[1]];
      else if (s < 4) unit = r.chance(0.5) ? [digs[0], digs[0], digs[1]] : [digs[0], digs[1], digs[1]];
      else if (s < 6) unit = [digs[0], digs[1], digs[2]];
      else unit = r.pick([[digs[0], digs[1], digs[2], digs[3]], [digs[0], digs[0], digs[1], digs[1]], [digs[0], digs[1], digs[2]]]);
      L = unit.length * 2 + r.int(0, unit.length - 1) + 1;
      seq = []; for (i = 0; i < L; i++) seq.push(unit[i % unit.length]);
      if (s >= 6 && odd(r, 0.4)) hide = r.int(unit.length, L - 2); else hide = L - 1;
      ans = seq[hide];
      seq = seq.slice(0, hide === L - 1 ? L : L); seq[hide] = '_';
      if (hide === L - 1) seq = seq.slice(0, L);
      return { q: seq.join(' '), a: S(ans), eq: S(ans), hint: 'What comes next?' };
    }
  });

  M.add({
    id: 'm1.7', world: 1, n: 7, strand: 'D', title: 'Tally marks', neg: false, exact: true, ans: 'num',
    exp: 'JK/SK: sort, count and read a tally under 10 (Data literacy; tally marks are UNCERTAIN for JK, normal by Grade 1)',
    gen: function (r, s) {
      var kinds = s < 3 ? ['read'] : s < 6 ? ['read', 'more1'] : ['read', 'more1', 'to10', 'less1'], k = r.pick(kinds), n, lab;
      lab = r.pick(['Goals', 'Votes', 'Pucks', 'Stars', 'Leaves', 'Apples', 'Canoes', 'Toques']);
      if (k === 'read') { n = r.int(1, s < 3 ? 5 : 9); return { q: lab + '?', a: S(n), aid: { tally: n }, eq: S(n) }; }
      if (k === 'more1') { n = r.int(1, 8); return { q: lab + ': 1 more?', a: S(n + 1), aid: { tally: n }, eq: n + ' + 1' }; }
      if (k === 'less1') { n = r.int(2, 9); return { q: lab + ': 1 less?', a: S(n - 1), aid: { tally: n }, eq: n + ' − 1' }; }
      n = r.int(1, 9); return { q: lab + ': to 10?', a: S(10 - n), aid: { tally: n }, eq: '10 − ' + n };
    }
  });

  /* ================= WORLD 2 : Grade 1 (first half, numbers to 50) ================= */

  M.add({
    id: 'm2.1', world: 2, n: 1, strand: 'B', title: 'Add within 10', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number: addition facts to 10, join stories (Gr1 B2, expectation codes UNCERTAIN)',
    gen: function (r, s) {
      var mx = at([5, 5, 6, 7, 8, 10, 10, 10], s), a, b, c, nm, th, o;
      if (s >= 7 && odd(r, 0.35)) {
        a = r.int(1, 4); b = r.int(1, 4); c = r.int(1, Math.max(1, 10 - a - b));
        return { q: a + ' + ' + b + ' + ' + c, a: S(a + b + c) };
      }
      a = r.int(s >= 2 && odd(r, 0.1) ? 0 : 1, mx - 1); b = r.int(a === 0 ? 1 : 1, mx - a);
      if (s >= 4 && odd(r, 0.4)) {
        nm = r.pick(NAMES); th = r.pick(THINGS);
        return { q: nm + ' has ' + a + ' ' + pl(th, a) + '. Gets ' + b + ' more. How many?', a: S(a + b), eq: a + ' + ' + b };
      }
      o = { q: a + ' + ' + b, a: S(a + b), hint: 'Count on' };
      if (s < 4 || (s < 6 && odd(r, 0.5))) o.aid = { dots: [a, b], layout: 'row' };
      return o;
    }
  });

  M.add({
    id: 'm2.2', world: 2, n: 2, strand: 'B', title: 'Subtract within 10', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number: subtraction facts to 10, take-away stories',
    gen: function (r, s) {
      var mx = at([4, 5, 6, 7, 8, 10, 10, 10], s), a, b, c, nm, th, o;
      if (s >= 6 && odd(r, 0.3)) {
        a = r.int(5, 10); b = r.int(1, a - 2); c = r.int(1, a - b);
        return { q: a + ' − ' + b + ' − ' + c, a: S(a - b - c) };
      }
      a = r.int(2, mx); b = r.int(odd(r, 0.08) ? 0 : 1, a);
      if (s >= 4 && odd(r, 0.4)) {
        nm = r.pick(NAMES); th = r.pick(THINGS);
        return { q: nm + ' has ' + a + ' ' + pl(th, a) + '. Gives ' + b + ' away. How many left?', a: S(a - b), eq: a + ' − ' + b };
      }
      o = { q: a + ' − ' + b, a: S(a - b), hint: 'Take away' };
      if (s < 4 || (s < 6 && odd(r, 0.5))) o.aid = { dots: [a], take: b, layout: 'row' };
      return o;
    }
  });

  M.add({
    id: 'm2.3', world: 2, n: 3, strand: 'B', title: 'Fact families', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number: relate addition and subtraction, fact families within 10 (to 12 later)',
    gen: function (r, s) {
      var mx = at([5, 6, 7, 8, 9, 10, 10, 12], s), kinds = s < 2 ? ['swap', 'inv'] : s < 4 ? ['swap', 'inv', 'inv2'] : ['swap', 'inv', 'inv2', 'sub', 'miss', 'miss2'],
        k = r.pick(kinds), t = r.int(3, mx), a = r.int(1, t - 1), b = t - a;
      if (k === 'swap') return { q: a + ' + ' + b + ' = ' + t + ', so ' + b + ' + ' + a + ' = _', a: S(t), eq: b + ' + ' + a };
      if (k === 'inv') return { q: a + ' + ' + b + ' = ' + t + ', so ' + t + ' − ' + a + ' = _', a: S(b), eq: t + ' − ' + a };
      if (k === 'inv2') return { q: a + ' + ' + b + ' = ' + t + ', so ' + t + ' − ' + b + ' = _', a: S(a), eq: t + ' − ' + b };
      if (k === 'sub') return { q: t + ' − ' + a + ' = ' + b + ', so ' + a + ' + ' + b + ' = _', a: S(t), eq: a + ' + ' + b };
      if (k === 'miss') return { q: 'Family: ' + a + ', ' + b + ', _', a: S(t), eq: a + ' + ' + b };
      return { q: 'Family: ' + a + ', _, ' + t, a: S(b), eq: t + ' − ' + a };
    }
  });

  M.add({
    id: 'm2.4', world: 2, n: 4, strand: 'B', title: 'Skip counting', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number: count by 2s, 5s and 10s to 50, forward and backward',
    gen: function (r, s) {
      var k, back = false, mid = false, st, seq = [], i, hide, ans, len = s >= 4 && odd(r, 0.4) ? 5 : 4;
      if (s < 2) k = 10; else if (s < 4) k = 5; else k = r.pick([2, 5, 10, 2]);
      if (s >= 6) { back = odd(r, 0.4); mid = odd(r, 0.4); }
      if (!back) {
        st = r.step(0, 50 - k * (len - 1), k);
        for (i = 0; i < len; i++) seq.push(st + k * i);
      } else {
        st = r.step(k * len, 50, k);
        for (i = 0; i < len; i++) seq.push(st - k * i);
      }
      hide = mid ? r.int(1, len - 2) : len - 1;
      ans = seq[hide]; seq[hide] = '_';
      return { q: join(seq), a: S(ans), eq: S(ans), hint: 'Count by ' + k };
    }
  });

  M.add({
    id: 'm2.5', world: 2, n: 5, strand: 'B', title: 'Tens and ones', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number: place value to 50, tens and ones, 10 more and 10 less',
    gen: function (r, s) {
      var mx = at([20, 30, 30, 40, 50, 50, 50, 50], s), kinds = s < 3 ? ['blocks', 'words'] : s < 5 ? ['blocks', 'words', 'ones', 'tens'] : ['words', 'ones', 'tens', 'more', 'less'],
        k = r.pick(kinds), n = r.int(10, mx), t = Math.floor(n / 10), o = n % 10;
      if (k === 'blocks') return { q: '?', a: S(n), aid: { ten: [t, o] }, eq: S(n) };
      if (k === 'words') return { q: t + (t === 1 ? ' ten ' : ' tens ') + o + (o === 1 ? ' one' : ' ones'), a: S(n), eq: t + ' × 10 + ' + o };
      if (k === 'ones') return { q: n + ' = ' + t + (t === 1 ? ' ten' : ' tens') + ' _ ones', a: S(o), eq: S(o) };
      if (k === 'tens') return { q: n + ' = _ ' + 'tens ' + o + (o === 1 ? ' one' : ' ones'), a: S(t), eq: S(t) };
      if (k === 'more') { n = r.int(10, 40); return { q: '10 more than ' + n, a: S(n + 10), eq: n + ' + 10' }; }
      n = r.int(20, 50); return { q: '10 less than ' + n, a: S(n - 10), eq: n + ' − 10' };
    }
  });

  M.add({
    id: 'm2.6', world: 2, n: 6, strand: 'C', title: 'Equal and missing', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Algebra: equality as balance, find the missing number in addition and subtraction equations to 10 (20 later)',
    gen: function (r, s) {
      var mx = at([5, 6, 8, 10, 10, 12, 15, 20], s), kinds, k, a, b, t, c, o;
      kinds = s < 2 ? ['addm', 'addm2'] : s < 4 ? ['addm', 'addm2', 'flip', 'subm'] : ['addm', 'addm2', 'flip', 'subm', 'subm2', 'bal', 'bal2'];
      k = r.pick(kinds);
      t = r.int(3, mx); a = r.int(1, t - 1); b = t - a;
      if (k === 'addm') o = { q: a + ' + _ = ' + t, a: S(b) };
      else if (k === 'addm2') o = { q: '_ + ' + a + ' = ' + t, a: S(b) };
      else if (k === 'flip') o = { q: t + ' = ' + a + ' + _', a: S(b) };
      else if (k === 'subm') o = { q: t + ' − _ = ' + a, a: S(b) };
      else if (k === 'subm2') o = { q: '_ − ' + a + ' = ' + b, a: S(t) };
      else {
        c = r.int(1, t - 1);
        if (k === 'bal') o = { q: a + ' + ' + b + ' = ' + c + ' + _', a: S(t - c) };
        else o = { q: a + ' + ' + b + ' = _ + ' + c, a: S(t - c) };
      }
      if (s < 3 && k.indexOf('add') === 0) o.aid = { dots: [a, b], layout: 'row' };
      return o;
    }
  });

  M.add({
    id: 'm2.7', world: 2, n: 7, strand: 'E', title: 'Time and calendar', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Spatial Sense: time to the hour, hours before and after, days of the week and months of the year as numbers (half hours are UNCERTAIN, skipped)',
    gen: function (r, s) {
      var kinds, k, h, d, m, MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      kinds = s < 2 ? ['clock'] : s < 4 ? ['clock', 'after', 'before', 'elapsed'] : ['clock', 'after', 'before', 'elapsed', 'month', 'day', 'fact'];
      k = r.pick(kinds);
      if (k === 'clock') { h = r.int(1, 12); return { q: r.pick(['?', 'Hour?', 'Time?']), a: S(h), aid: { clock: { h: h, m: 0 } }, hint: 'Hour hand', eq: S(h) }; }
      if (k === 'after') { h = r.int(1, 11); d = r.int(1, Math.min(3, 12 - h)); return { q: d + (d === 1 ? ' hour ' : ' hours ') + r.pick(['after ', 'later than ']) + h + ':00 = _:00', a: S(h + d), eq: h + ' + ' + d }; }
      if (k === 'before') { h = r.int(2, 12); d = r.int(1, Math.min(3, h - 1)); return { q: d + (d === 1 ? ' hour ' : ' hours ') + r.pick(['before ', 'earlier than ']) + h + ':00 = _:00', a: S(h - d), eq: h + ' − ' + d }; }
      if (k === 'month') { m = r.int(0, 11); return { q: odd(r, 0.5) ? MON[m] + ' is month _' : 'Month _ is ' + MON[m], a: S(m + 1), eq: S(m + 1) }; }
      if (k === 'day') { d = r.int(0, 6); var sun = odd(r, 0.4), dn = sun ? (d + 1) % 7 + 1 : d + 1; return { q: (sun ? 'Sun is 1. ' : 'Mon is 1. ') + DAY[d] + ' is day _', a: S(dn), eq: S(dn) }; }
      if (k === 'elapsed') { h = r.int(1, 10); d = r.int(1, 12 - h); return { q: h + ':00 to ' + (h + d) + ':00. Hours?', a: S(d), eq: S(d) }; }
      var F = [['Days in a week?', 7], ['Months in a year?', 12], ['Weekend days?', 2], ['School days, Mon to Fri?', 5], ['Months in half a year?', 6], ['Days in 2 weeks?', 14], ['Hours in a day?', 24], ['Days in 3 weeks?', 21]], f;
      f = s >= 6 ? r.pick(F) : r.pick(F.slice(0, 5));
      return { q: f[0], a: S(f[1]), eq: S(f[1]) };
    }
  });

  /* ================= WORLD 3 : Grade 1 (second half) ================= */

  M.add({
    id: 'm3.1', world: 3, n: 1, strand: 'B', title: 'Add and subtract to 20', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number: addition and subtraction facts to 20, doubles, near doubles, make 10 to bridge',
    gen: function (r, s) {
      var cap = at([12, 14, 16, 18, 20, 20, 20, 20], s), kinds, k, a, b, c, n, o;
      kinds = s < 1 ? ['add', 'sub'] : s < 3 ? ['add', 'sub', 'dbl'] : s < 5 ? ['add', 'sub', 'dbl', 'near', 'bridge', 'dsub'] : ['add', 'sub', 'dbl', 'near', 'bridge', 'dsub', 'thru', 'three'];
      k = r.pick(kinds);
      if (k === 'add') { a = r.int(2, cap - 2); b = r.int(1, cap - a); o = { q: a + ' + ' + b, a: S(a + b) }; if (s < 2) o.aid = { dots: [a, b], layout: 'frame' }; return o; }
      if (k === 'sub') { a = r.int(6, cap); b = r.int(1, a - 1); o = { q: a + ' − ' + b, a: S(a - b) }; if (s < 2) o.aid = { dots: [a], take: b, layout: 'frame' }; return o; }
      if (k === 'dbl') { n = r.int(2, Math.min(10, Math.floor(cap / 2))); return { q: n + ' + ' + n, a: S(2 * n), hint: 'Doubles' }; }
      if (k === 'near') { n = r.int(2, Math.min(9, Math.floor((cap - 1) / 2))); return r.chance(0.5) ? { q: n + ' + ' + (n + 1), a: S(2 * n + 1), hint: 'Near doubles' } : { q: (n + 1) + ' + ' + n, a: S(2 * n + 1), hint: 'Near doubles' }; }
      if (k === 'bridge') { a = r.int(6, 9); b = r.int(11 - a, Math.min(9, cap - a)); return { q: a + ' + ' + b, a: S(a + b), hint: 'Make 10 first' }; }
      if (k === 'dsub') { n = r.int(3, Math.min(10, Math.floor(cap / 2))); return { q: (2 * n) + ' − ' + n, a: S(n), hint: 'Half of ' + (2 * n) }; }
      if (k === 'thru') { a = r.int(11, cap); b = r.int(a - 9, 9); if (b < 3) b = 3; if (b >= a) b = a - 1; return { q: a + ' − ' + b, a: S(a - b), hint: 'Back to 10' }; }
      a = r.int(1, 8); b = r.int(1, 9 - 0); c = r.int(1, 9);
      while (a + b + c > cap) { c = r.int(1, 6); b = r.int(1, 6); }
      return { q: a + ' + ' + b + ' + ' + c, a: S(a + b + c) };
    }
  });

  M.add({
    id: 'm3.2', world: 3, n: 2, strand: 'B', title: 'After, before, compare', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number: counting forward and backward to 50, number after and before, compare and order numbers to 50',
    gen: function (r, s) {
      var mx = at([20, 25, 30, 35, 40, 45, 50, 50], s), kinds = s < 2 ? ['after', 'before'] : s < 4 ? ['after', 'before', 'big', 'small'] : ['after', 'before', 'between', 'big', 'small', 'big3', 'small3'],
        k = r.pick(kinds), a, b, c, ans;
      if (k === 'after') { a = r.int(1, mx - 1); return { q: 'After ' + a + '?', a: S(a + 1), eq: a + ' + 1' }; }
      if (k === 'before') { a = r.int(2, mx); return { q: 'Before ' + a + '?', a: S(a - 1), eq: a + ' − 1' }; }
      if (k === 'between') { a = r.int(1, mx - 2); return { q: 'Between ' + a + ' and ' + (a + 2), a: S(a + 1), eq: a + ' + 1' }; }
      a = r.int(1, mx); b = r.int(1, mx); while (b === a) b = r.int(1, mx);
      if (k === 'big') { ans = Math.max(a, b); return { q: 'Bigger: ' + a + ' or ' + b, a: S(ans), eq: S(ans) }; }
      if (k === 'small') { ans = Math.min(a, b); return { q: 'Smaller: ' + a + ' or ' + b, a: S(ans), eq: S(ans) }; }
      c = r.int(1, mx); while (c === a || c === b) c = r.int(1, mx);
      ans = k === 'big3' ? Math.max(a, b, c) : Math.min(a, b, c);
      return { q: (k === 'big3' ? 'Biggest: ' : 'Smallest: ') + a + ', ' + b + ', ' + c, a: S(ans), eq: S(ans) };
    }
  });

  M.add({
    id: 'm3.3', world: 3, n: 3, strand: 'F', title: 'Coins', neg: false, exact: true, ans: 'money',
    exp: 'Gr1 Financial Literacy: identify Canadian coins, nickel 5 cents, dime 10 cents, quarter 25 cents, loonie $1, toonie $2; count to 20 cents (no pennies; grade placement UNCERTAIN)',
    gen: function (r, s) {
      var kinds, k, n, i, tot, coins, one, a, b, V;
      kinds = s < 1 ? ['one', 'pair', 'mult'] : s < 2 ? ['one', 'pair', 'mult'] : s < 5 ? ['count', 'count', 'one', 'mult', 'pair'] : s < 7 ? ['count', 'mult', 'dollar', 'cmp', 'pair', 'mix', 'cc'] : ['dollar', 'mult', 'cmp', 'dcount', 'count', 'qcount', 'mix', 'cc', 'lc'];
      k = r.pick(kinds);
      if (k === 'one') {
        V = [['Nickel = _¢', 5, 5], ['Dime = _¢', 10, 10], ['Quarter = _¢', 25, 25]];
        if (s >= 4) V = V.concat([['Loonie = $_', 1, 100], ['Toonie = $_', 2, 200]]);
        one = r.pick(V);
        return { q: one[0], a: S(one[1]), aid: { coins: [one[2]] }, eq: S(one[1]), cnt: one[2] >= 100 };
      }
      if (k === 'count' || k === 'qcount') {
        n = r.int(2, s >= 4 ? 5 : 4); coins = []; tot = 0;
        var lim = k === 'qcount' ? 40 : (s >= 5 ? 30 : 20);
        for (i = 0; i < n; i++) {
          var c = k === 'qcount' && i === 0 && r.chance(0.6) ? 25 : (r.chance(0.5) ? 5 : 10);
          if (tot + c > lim) c = 5; if (tot + c > lim) break; coins.push(c); tot += c;
        }
        if (coins.length < 2) { coins = [10, 5]; tot = 15; }
        return { q: 'Total ¢?', a: S(tot), aid: { coins: coins }, eq: coins.join(' + ') };
      }
      if (k === 'mix') {
        a = r.int(1, 3); b = r.int(1, 4);
        return { q: odd(r, 0.5) ? a + (a === 1 ? ' dime, ' : ' dimes, ') + b + (b === 1 ? ' nickel' : ' nickels') + ': _¢' : b + (b === 1 ? ' nickel, ' : ' nickels, ') + a + (a === 1 ? ' dime' : ' dimes') + ': _¢', a: S(10 * a + 5 * b), eq: a + ' × 10 + ' + b + ' × 5' };
      }
      if (k === 'cc') {
        if (odd(r, 0.6)) { n = r.int(2, 8); return { q: 5 * n + '¢ = _ nickels', a: S(n), eq: S(n), cnt: true }; }
        n = r.int(2, 6); return { q: 10 * n + '¢ = _ dimes', a: S(n), eq: S(n), cnt: true };
      }
      if (k === 'lc') {
        a = r.int(1, 2); b = r.pick([5, 10, 25]);
        return { q: (a === 1 ? 'Loonie' : 'Toonie') + ' + ' + (b === 5 ? 'nickel' : b === 10 ? 'dime' : 'quarter') + ' = _¢', a: S(100 * a + b), eq: (100 * a) + ' + ' + b };
      }
      if (k === 'pair') {
        var NM = { 5: 'nickel', 10: 'dime' }, c1 = r.pick([5, 10]), c2 = r.pick([5, 10]);
        return { q: cap(NM[c1]) + ' + ' + NM[c2] + ' = _¢', a: S(c1 + c2), aid: { coins: [c1, c2] }, eq: c1 + ' + ' + c2 };
      }
      if (k === 'mult') {
        if (r.chance(0.5)) { n = r.int(2, 4); return { q: n + ' nickels = _¢', a: S(5 * n), eq: n + ' × 5' }; }
        n = r.int(2, 3); return { q: n + ' dimes = _¢', a: S(10 * n), eq: n + ' × 10' };
      }
      if (k === 'cmp') {
        a = r.pick([['Nickels in a dime?', 2], ['Nickels in 20¢?', 4], ['Dimes in 20¢?', 2], ['Nickels in 15¢?', 3], ['Dimes in 30¢?', 3], ['Nickels in 25¢?', 5],
          ['Nickels in a quarter?', 5], ['Quarters in $1?', 4], ['Dimes in $1?', 10], ['Loonies in a toonie?', 2], ['Nickels in 10¢?', 2], ['Dimes in 10¢?', 1]]);
        return { q: a[0], a: S(a[1]), eq: S(a[1]), cnt: true };
      }
      if (k === 'dollar') {
        a = r.int(1, 3); b = r.int(1, 2);
        return { q: a + (a === 1 ? ' loonie' : ' loonies') + ' and ' + b + (b === 1 ? ' toonie' : ' toonies') + ': $_', a: S(a + 2 * b), eq: a + ' + 2 × ' + b, cnt: true };
      }
      var cs = [], tt = 0; n = r.int(2, 5);
      for (i = 0; i < n; i++) { var d = r.chance(0.5) ? 1 : 2; cs.push(d * 100); tt += d; }
      return { q: 'Total $?', a: S(tt), aid: { coins: cs }, eq: cs.map(function (x) { return x / 100; }).join(' + '), cnt: true };
    }
  });

  M.add({
    id: 'm3.4', world: 3, n: 4, strand: 'D', title: 'Graphs and tallies', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Data: read tallies and simple bar graphs, total, most, fewest, how many more',
    gen: function (r, s) {
      var CAT = ['Hockey', 'Soccer', 'Skating', 'Swim', 'Tag', 'Tennis', 'Biking'], cats = r.shuffle(CAT), mx = at([5, 6, 7, 8, 9, 10, 10, 10], s),
        kinds = s < 3 ? ['more', 'total'] : s < 5 ? ['more', 'total', 'most', 'fewest'] : ['more', 'total', 'most', 'fewest', 'total3', 'fewer'],
        k = r.pick(kinds), a, b, c, n = (k === 'most' || k === 'fewest' || k === 'total3') ? 3 : 2, vals = [], i, bars = [], head, pre, ans, qq;
      vals.push(r.int(2, mx));
      for (i = 1; i < n; i++) { var v = r.int(1, mx), guard = 0; while (vals.indexOf(v) >= 0 && guard++ < 30) v = r.int(1, mx); vals.push(v); }
      if (k === 'more' || k === 'fewer') {
        if (vals[0] === vals[1]) vals[1] = vals[0] > 1 ? vals[0] - 1 : vals[0] + 1;
        if (k === 'more' && vals[0] < vals[1]) { var t = vals[0]; vals[0] = vals[1]; vals[1] = t; }
        if (k === 'fewer' && vals[0] > vals[1]) { var t2 = vals[0]; vals[0] = vals[1]; vals[1] = t2; }
      }
      for (i = 0; i < n; i++) bars.push({ l: cats[i], v: vals[i] });
      head = bars.map(function (x) { return x.l + ' ' + x.v; }).join(', ');
      if (k === 'more') { ans = vals[0] - vals[1]; qq = head + '. ' + cats[0] + ' has how many more?'; }
      else if (k === 'fewer') { ans = vals[1] - vals[0]; qq = head + '. ' + cats[0] + ' has how many fewer?'; }
      else if (k === 'total') { ans = vals[0] + vals[1]; qq = head + '. Total?'; }
      else if (k === 'total3') { ans = vals[0] + vals[1] + vals[2]; qq = head + '. Total?'; }
      else if (k === 'most') { ans = Math.max.apply(null, vals); qq = head + '. Most votes?'; }
      else { ans = Math.min.apply(null, vals); qq = head + '. Fewest votes?'; }
      return { q: qq, a: S(ans), aid: { bars: bars }, eq: S(ans) };
    }
  });

  M.add({
    id: 'm3.5', world: 3, n: 5, strand: 'E', title: 'Shapes: sides, corners', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Spatial Sense: attributes of 2-D shapes (sides, corners) and 3-D objects (faces, corners), position words (in front, behind, from the left/right); edges are left to Grade 2+; face counts of prisms and pyramids are UNCERTAIN at this grade',
    gen: function (r, s) {
      var D2 = [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]],
        D3 = [['cube', 6, 12, 8], ['box', 6, 12, 8], ['pyramid', 5, 8, 5], ['triangular prism', 5, 9, 6]], sh, sh2, n, w, m, f;
      function one2(x, wd) { return odd(r, 0.5) ? cap(x) + ' ' + wd + '?' : cap(wd) + ' in ' + (/^[aeiou]/.test(x) ? 'an ' : 'a ') + x + '?'; }
      if (s < 3) {
        sh = r.pick(D2.slice(0, 3)); w = r.pick(['sides', 'corners']);
        return { q: one2(sh[0], w), a: S(sh[1]), aid: { shape: { name: sh[0] } }, eq: S(sh[1]) };
      }
      if (s < 5) {
        if (odd(r, 0.35)) { sh = r.pick(D2.slice(0, 5)); m = r.int(2, 3); w = r.pick(['sides', 'corners']); return { q: m + ' ' + sh[0] + 's: ' + w + ' in all?', a: S(m * sh[1]), eq: m + ' × ' + sh[1] }; }
        sh = r.pick(D2); w = r.pick(['sides', 'corners']);
        return { q: one2(sh[0], w), a: S(sh[1]), aid: { shape: { name: sh[0] } }, eq: S(sh[1]) };
      }
      if (odd(r, 0.3)) {
        n = r.int(4, 9); w = r.int(2, n - 1); f = r.int(0, 2);
        if (f === 0) return { q: 'Row of ' + n + '. Mia is ' + ordn(w) + ' from the left. From the right?', a: S(n - w + 1), eq: n + ' − ' + w + ' + 1', hint: 'Count from the other end' };
        if (f === 1) return { q: cap(r.pick(['Mia', 'Leo', 'Ava', 'Sam'])) + ' is ' + ordn(w) + ' in line. Place behind?', a: S(w + 1), eq: w + ' + 1' };
        return { q: 'Ava is ' + ordn(w) + ' in line. Place in front?', a: S(w - 1), eq: w + ' − 1' };
      }
      f = r.int(0, 3);
      if (s < 7 && f === 0) {
        sh = r.pick(D3); w = r.pick(['faces', 'corners']);
        n = w === 'faces' ? sh[1] : sh[3];
        return { q: one2(sh[0], w), a: S(n), aid: { shape: { name: sh[0] } }, eq: S(n) };
      }
      if (f === 1) {
        sh = r.pick(D3); w = r.pick(['faces', 'corners']);
        n = w === 'faces' ? sh[1] : sh[3];
        return { q: one2(sh[0], w), a: S(n), aid: { shape: { name: sh[0] } }, eq: S(n) };
      }
      if (f === 2) {
        sh = r.pick(D2.slice(0, 5)); m = r.int(2, 5); w = r.pick(['sides', 'corners']);
        return { q: m + ' ' + sh[0] + 's: ' + w + ' in all?', a: S(m * sh[1]), eq: m + ' × ' + sh[1] };
      }
      if (s >= 6 && odd(r, 0.5)) {
        sh = r.pick(D3); sh2 = r.pick(D3); w = r.pick(['faces', 'corners']);
        var ix = w === 'faces' ? 1 : 3;
        return { q: cap(sh[0]) + ' + ' + sh2[0] + ': ' + w + '?', a: S(sh[ix] + sh2[ix]), eq: sh[ix] + ' + ' + sh2[ix] };
      }
      sh = r.pick(D2); sh2 = r.pick(D2); w = r.pick(['sides', 'corners']);
      return { q: cap(sh[0]) + ' + ' + sh2[0] + ': ' + w + '?', a: S(sh[1] + sh2[1]), eq: sh[1] + ' + ' + sh2[1] };
    }
  });

  function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
  function ordn(n) { var t = n % 100, u = n % 10; return n + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); }

  M.add({
    id: 'm3.6', world: 3, n: 6, strand: 'C', title: 'Growing patterns', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Algebra: increasing and decreasing patterns with a given rule (+1, +2, +5, -1, -2, -5); find the rule',
    gen: function (r, s) {
      var steps = s < 2 ? [1, 2] : s < 4 ? [1, 2, 5] : [1, 2, 5, 5, 2], k = r.pick(steps), len = 4, kind, st, seq = [], i, hide, ans;
      kind = s < 4 ? 'up' : s < 6 ? r.pick(['up', 'down', 'up']) : r.pick(['up', 'down', 'rule', 'mid']);
      if (kind === 'rule') {
        st = r.int(0, 50 - k * 4);
        for (i = 0; i < len; i++) seq.push(st + k * i);
        return { q: 'Rule? ' + join(seq), a: S(k), eq: S(k) };
      }
      if (kind === 'down') {
        st = r.int(k * len, 50);
        for (i = 0; i < len; i++) seq.push(st - k * i);
        ans = seq[len - 1]; seq[len - 1] = '_';
        return { q: 'Rule −' + k + ': ' + join(seq), a: S(ans), eq: S(ans) };
      }
      st = r.int(0, 50 - k * len);
      for (i = 0; i < len; i++) seq.push(st + k * i);
      hide = kind === 'mid' ? r.int(1, len - 2) : len - 1;
      ans = seq[hide]; seq[hide] = '_';
      return { q: 'Rule +' + k + ': ' + join(seq), a: S(ans), eq: S(ans) };
    }
  });

  M.add({
    id: 'm3.7', world: 3, n: 7, strand: 'B', title: 'Story problems', neg: false, exact: true, ans: 'num',
    exp: 'Gr1 Number and Financial Literacy: join, separate, part-whole, compare and missing-part stories to 20 with Canadian contexts (mixed review of world 3)',
    gen: function (r, s) {
      var cap2 = at([10, 10, 12, 14, 16, 18, 20, 20], s), kinds, k, a, b, c, n2, th, nm, nn;
      kinds = s < 2 ? ['join', 'sep'] : s < 4 ? ['join', 'sep', 'part'] : s < 6 ? ['join', 'sep', 'part', 'cmp', 'miss'] : ['join', 'sep', 'part', 'cmp', 'miss', 'coin'];
      k = r.pick(kinds); th = r.pick(THINGS); nn = name2(r); nm = nn[0];
      if (k === 'join') { a = r.int(2, cap2 - 2); b = r.int(1, cap2 - a); return { q: nm + ' has ' + a + ' ' + pl(th, a) + '. Gets ' + b + ' more. How many?', a: S(a + b), eq: a + ' + ' + b }; }
      if (k === 'sep') { a = r.int(4, cap2); b = r.int(1, a - 1); return { q: nm + ' has ' + a + ' ' + pl(th, a) + '. Gives ' + b + ' away. How many left?', a: S(a - b), eq: a + ' − ' + b }; }
      if (k === 'part') { th = r.pick(REDOK); a = r.int(5, cap2); b = r.int(1, a - 1); return { q: a + ' ' + pl(th, a) + '. ' + b + ' are red. How many not red?', a: S(a - b), eq: a + ' − ' + b }; }
      if (k === 'cmp') { a = r.int(5, cap2); b = r.int(2, a - 1); return { q: nm + ' has ' + a + ' ' + pl(th, a) + '. ' + nn[1] + ' has ' + b + '. How many more?', a: S(a - b), eq: a + ' − ' + b }; }
      if (k === 'miss') { a = r.int(3, cap2 - 2); c = r.int(a + 1, cap2); return { q: nm + ' has ' + a + ' ' + pl(th, a) + '. Needs ' + c + '. How many more?', a: S(c - a), eq: c + ' − ' + a }; }
      a = r.int(1, 2); b = r.int(1, 4);
      return { q: a + (a === 1 ? ' dime' : ' dimes') + ' and ' + b + (b === 1 ? ' nickel' : ' nickels') + '. How many ¢?', a: S(10 * a + 5 * b), eq: a + ' × 10 + ' + b + ' × 5' };
    }
  });
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
