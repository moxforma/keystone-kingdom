/* math-data.js : MATH data core for Keyloria Kingdom (Phase B0). Loaded FIRST of the math files.
 Content files (math-k1.js, math-g23.js, math-g45.js, math-g68.js, math-mix.js) call MATH.add(topic) and nothing else is shared.
 Plain ES5-style IIFE, no DOM, works in the browser (window.MATH) and in node via vm (globalThis.MATH).

 ===== TOPIC SHAPE (follow exactly) =====
 MATH.add({
   id:'m3.2',            // 'm'+world+'.'+n, world 1-12, n 1-7 (unique; 7 learn topics per world; review and boss are built by the core)
   world:3, n:2,
   strand:'B',           // Ontario strand letter B Number, C Algebra, D Data, E Spatial, F Financial ('' if unsure)
   exp:'free text',      // curriculum note, mark UNCERTAIN items; never a code
   title:'Add within 20',// short kid-safe title for the map
   neg:false,            // true only if answers or steps may go negative (allowed from world 9 on)
   exact:true,           // true: every division is exact (default true; remainder topics use ans:'rem' and exact:false)
   ans:'num',            // 'num' | 'dec' | 'frac' | 'money' | 'time' | 'ratio' | 'rem' | 'pair' | 'mixed'  (see charsets)
   equiv:false,          // true: equivalent fractions/ratios are accepted (1/2 = 2/4). Default false (exact form only)
   units:['cm'],         // optional: units that may be typed after the number (a may end with one, the checker strips it)
   run:['rock','bridge','tower'], // optional: runner kinds allowed (default all). rock needs a 1-char answer, bridge 2-4, tower up to 6
   verify:function(p){}, // optional: return true if p (the normalised problem) is correct. Needed only when q is not plain arithmetic and no eq is given
   gen:function(rng,s,tier){ return {q:'7 + 5', a:'12', aid:{dots:[7,5]}, hint:'Count on', eq:'7 + 5'} }
 })
 gen(rng,s,tier): s = part 0-7 (0 easiest ... 7 hardest inside THIS topic; ramp ranges with s). tier = world-1 (0-11).
   rng is a seeded function returning [0,1) with helpers: rng.int(a,b) inclusive, rng.pick(arr), rng.chance(p), rng.shuffle(arr), rng.step(a,b,k) (multiple of k), rng.sign().
   NEVER use Math.random or Date. Every call must be a pure function of rng, s, tier.
   Returns {q, a, aid?, hint?, eq?}: q = problem text shown huge (mostly symbols, word problems at most 12 words, Canadian spelling and Canadian context),
   a = the ANSWER STRING exactly as typed (see charsets), aid = optional picture data (also accepted under the name vis), hint = optional short text (60 chars max),
   eq = optional arithmetic expression that evaluates to the answer (lets MATH.validate prove word problems and picture questions).
   q symbols: use × and ÷ (not x or *), − or - for minus, parentheses, ^ or ² ³, √, _ or ? or □ for a missing number ('5 + _ = 8', answer 3).
   Money in q: '$3.45' and '75¢' (use MATH.fmt.money(cents)). Time '3:15'. Fractions '3/4'. Decimals with a dot, always a leading zero ('0.5').
   aid keys the renderer understands (extra keys ignored): dots:[n,...] groups; layout:'row'|'frame'|'dice'|'scatter'|'rows'|'circle'; ten:[tens,ones] base-ten blocks;
   coins:[cents,...]; clock:{h,m}; tally:n; bars:[{l,v}]; frac:{n,d}; grid:{w,h}; shape:{...}. Distinct problems are counted by q plus JSON of aid.
 ANSWER CHARSETS (a may use only these): digits always; num '-' (only if neg); dec '.' and '-'; frac '/' and '-'; money '.' (plain integer = cents, decimal = dollars; the checker accepts 45 = 0.45 = $0.45 = 45¢ and 155 = 1.55 = $1.55; a problem returns cnt:true when its answer is a count or whole dollars, money:true to opt a non-money topic in);
   time ':' ; ratio ':' ; rem digits+'r' ('3r2', world 6 only); pair ',' ('3,4'); mixed space and '/' ('1 1/2'); units only if listed in units. Max 6 characters. No negatives before world 9.
 AUTO-SUBMIT: the UI submits when typed.length >= a.length (MATH.isComplete); Space/Enter submits early (so '.5' for '0.5' works).
 Minimum: at least 50 distinct problems per topic (the plan asks for 300 over parts; tests ask 200 over seeds 0-999).

 ===== API =====
 MATH.add(topic)  MATH.topic(id)  MATH.list()  MATH.PLAN[w]=[topics sorted by n]  MATH.topicsOf(w)
 MATH.rng(seed)  MATH.hash(...)  MATH.seedFor(i,s,attempt)  MATH.fmt.*  MATH.calc(expr)  MATH.value(str)
 MATH.slotFor(i)->{w,k,kind}  MATH.setSlotResolver(fn)  (game.js lesson index i; default resolver: i = position in ORDER, 9 per world; streams.js should call MATH.setSlotResolver(KKS.slot))
 MATH.lesson(world,k)->topic   k 0-6 learn topics, 7 review, 8 boss (synthetic topics {kind:'review'|'boss',mix:[...]}); worlds with fewer topics repeat the last; empty worlds fall back to the nearest lower world
 MATH.problems(lessonIndex|{w,k}, part 0-7, count=12, seed=0)->[{q,a,aid,digits,keys,hint,topic,world,part,ans,equiv,units}]
 MATH.gen(topicId,s,seed,n)  low level, one topic.
 MATH.forRunner(tier 0-11, keysAllowed, kind:'rock'|'bridge'|'tower'|'boss'|'spell', {count,seed})->problems (rock: 1-char answers, bridge 2-4, tower 2-6, spell: 3-step chain)
 MATH.chain(world,seed,len=3)->{steps:[{q,a,...}]} (q of step k contains the answer of step k-1; math-mix.js may replace MATH.chain)
 MATH.word(world,seed)->{q,a,...}; MATH.addWord({id,world:minWorld,gen:(rng,tier)=>({q,a,eq})}) registers word problem templates (math-mix.js)
 MATH.norm(str,topic) / MATH.check(typed,problem) / MATH.isComplete(typed,problem) / MATH.prefixOk(typed,problem)
 MATH.validate({seeds:120,minDistinct:50}) -> {ok,errors[],warnings[],stats}
*/
(function (root) {
  'use strict';
  var NEG_WORLD = 9, MAXLEN = 6, RUNK = ['rock', 'bridge', 'tower'];
  var USBAD = /\b(color|colors|colored|center|centers|favorite|favorites|neighbor|neighbors|honor|honors|gray|theater|defense|traveled|jewelry|meter|meters|liter|liters|centimeter|centimeters|kilometer|kilometers|millimeter|millimeters|milliliter|milliliters)\b/i;

  /* ---------- rng ---------- */
  function hash() {
    var s = Array.prototype.join.call(arguments, '|'), h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function rng(seed) {
    var f = mulberry32(typeof seed === 'number' ? seed >>> 0 : hash(seed));
    f.int = function (a, b) { return a + Math.floor(f() * (b - a + 1)); };
    f.pick = function (arr) { return arr[Math.floor(f() * arr.length)]; };
    f.chance = function (p) { return f() < p; };
    f.sign = function () { return f() < 0.5 ? -1 : 1; };
    f.step = function (a, b, k) { return a + k * Math.floor(f() * (Math.floor((b - a) / k) + 1)); };
    f.shuffle = function (arr) {
      var o = arr.slice(), j, t;
      for (var i = o.length - 1; i > 0; i--) { j = Math.floor(f() * (i + 1)); t = o[i]; o[i] = o[j]; o[j] = t; }
      return o;
    };
    return f;
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }

  /* ---------- formatting ---------- */
  function dollars(c) { return (c / 100).toFixed(2); }
  var fmt = {
    int: function (n) { return String(Math.round(n)); },
    big: function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); },
    dollars: dollars,                                   // 345 -> '3.45' (typed form)
    cents: function (c) { return String(Math.round(c)); }, // 75 -> '75'
    money: function (c) { c = Math.round(c); return c < 100 ? c + '¢' : '$' + dollars(c); }, // 75 -> '75¢', 345 -> '$3.45'
    moneyD: function (c) { return '$' + dollars(Math.round(c)); },
    time: function (h, m) { h = ((h % 12) + 12) % 12 || 12; return h + ':' + (m < 10 ? '0' : '') + m; },
    time24: function (h, m) { return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; },
    frac: function (n, d) { return n + '/' + d; },
    mixed: function (w, n, d) { return w + ' ' + n + '/' + d; },
    dec: function (x, places) { return Number(x).toFixed(places == null ? 1 : places); },
    unit: function (n, u) { return n + ' ' + u; },
    ratio: function (a, b) { return a + ':' + b; },
    rem: function (q, r) { return q + 'r' + r; },
    pair: function (x, y) { return x + ',' + y; },
    OP: { add: '+', sub: '−', mul: '×', div: '÷' }
  };

  /* ---------- safe expression evaluator (no eval) ---------- */
  function tokenize(s) {
    s = String(s).replace(/(\d)[  ](?=\d)/g, '$1').replace(/[−–]/g, '-');
    var out = [], i = 0, m, c, r;
    while (i < s.length) {
      c = s.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      r = s.slice(i);
      if ((m = /^\$?(\d+\.?\d*|\.\d+)¢?/.exec(r))) {
        var v = parseFloat(m[1]);
        if (m[0].charAt(0) === '$') v = v; else if (/¢$/.test(m[0])) v = v / 100;
        out.push({ t: 'n', v: v }); i += m[0].length; continue;
      }
      if (/^of\b/.test(r)) { out.push({ t: 'o', v: '×' }); i += 2; continue; }
      if ('+-×÷*/()^²³√%'.indexOf(c) >= 0) {
        out.push({ t: 'o', v: c === '*' ? '×' : c }); i++; continue;
      }
      if ('_?□xyn'.indexOf(c) >= 0) { out.push({ t: 'u' }); i++; continue; }
      return null;
    }
    return out;
  }
  function evalSide(s, u, ctx) {
    var tk = tokenize(s), p = 0;
    if (!tk || !tk.length) return null;
    function peek() { return tk[p]; }
    function isOp(t, v) { return t && t.t === 'o' && t.v === v; }
    function expr() {
      var l = term(), t;
      while ((t = peek()) && (isOp(t, '+') || isOp(t, '-'))) {
        p++; var r = term();
        if (t.v === '+') l += r; else { l -= r; if (l < -1e-9) ctx.negMid = true; }
      }
      return l;
    }
    function term() {
      var l = unary(), t;
      for (;;) {
        t = peek();
        if (t && (isOp(t, '×') || isOp(t, '÷') || isOp(t, '/'))) {
          p++; var r = unary();
          if (t.v === '×') l *= r;
          else {
            if (r === 0) throw new Error('div0');
            if (Math.abs(l - Math.round(l)) < 1e-9 && Math.abs(r - Math.round(r)) < 1e-9 && Math.round(l) % Math.round(r) !== 0) ctx.inexact = true;
            l /= r;
          }
        } else if (t && (t.t === 'u' || isOp(t, '(') || isOp(t, '√'))) {
          l *= unary();
        } else break;
      }
      return l;
    }
    function unary() {
      var t = peek();
      if (isOp(t, '-')) { p++; var v = unary(); ctx.negMid = true; return -v; }
      if (isOp(t, '+')) { p++; return unary(); }
      return power();
    }
    function power() {
      var b = postfix();
      if (isOp(peek(), '^')) { p++; b = Math.pow(b, unary()); }
      return b;
    }
    function postfix() {
      var v = atom(), t;
      while ((t = peek()) && (isOp(t, '²') || isOp(t, '³') || isOp(t, '%'))) {
        p++; v = t.v === '²' ? v * v : t.v === '³' ? v * v * v : v / 100;
      }
      return v;
    }
    function atom() {
      var t = tk[p++];
      if (!t) throw new Error('end');
      if (t.t === 'n') return t.v;
      if (t.t === 'u') { if (u == null) { ctx.unknown = true; throw new Error('unk'); } return u; }
      if (isOp(t, '(')) { var v = expr(); if (!isOp(tk[p++], ')')) throw new Error('paren'); return v; }
      if (isOp(t, '√')) return Math.sqrt(atom());
      throw new Error('tok');
    }
    try { var res = expr(); if (p !== tk.length) return null; return res; } catch (e) { return null; }
  }
  function calc(expr, u) { var ctx = {}; var v = evalSide(expr, u, ctx); return v; }

  /* ---------- answers: value, normalise, check ---------- */
  function value(str) {
    var s = String(str).replace(/[−]/g, '-').replace(/[$¢]/g, '').trim(), m;
    if ((m = /^(-?)(\d+) (\d+)\/(\d+)$/.exec(s))) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]);
    s = s.replace(/[a-z²³]+$/i, '').replace(/(\d),(?=\d{3}\b)/g, '$1');
    if ((m = /^(-?\d+)\/(\d+)$/.exec(s))) return +m[2] ? m[1] / m[2] : NaN;
    if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
    return NaN;
  }
  function canonNum(s) {
    var neg = s.charAt(0) === '-', t = neg ? s.slice(1) : s, parts = t.split('.'), ip = parts[0].replace(/^0+(?=\d)/, '') || '0', fp = (parts[1] || '').replace(/0+$/, '');
    var out = ip + (fp ? '.' + fp : '');
    return (neg && out !== '0' ? '-' : '') + out;
  }
  function norm(str, o) {
    o = o || {};
    var type = o.ans || 'num', s = String(str == null ? '' : str).toLowerCase().replace(/[−–]/g, '-').trim();
    s = type === 'mixed' ? s.replace(/\s+/g, ' ') : s.replace(/\s+/g, '');
    s = s.replace(/[$¢]/g, '');
    var us = o.units || (o.unit ? [o.unit] : null), m;
    if (us && type !== 'rem' && (m = /([a-z²³]+)$/.exec(s)) && us.indexOf(m[1]) >= 0) s = s.slice(0, s.length - m[1].length).trim();
    if (type !== 'pair') s = s.replace(/(\d),(?=\d{3}\b)/g, '$1');
    if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return canonNum(s);
    if ((m = /^(-?\d+)\/(\d+)$/.exec(s))) {
      if (o.equiv && +m[2]) { var g = gcd(+m[1], +m[2]) || 1; return (+m[1] / g) + '/' + (+m[2] / g); }
      return +m[1] + '/' + +m[2];
    }
    if ((m = /^(\d{1,2}):(\d{2})$/.exec(s))) return (+m[1]) + ':' + m[2];
    if ((m = /^(\d+)r(\d+)$/.exec(s))) return +m[1] + 'r' + +m[2];
    if ((m = /^(\d+):(\d+)$/.exec(s))) {
      if (o.equiv) { var g2 = gcd(+m[1], +m[2]) || 1; return (+m[1] / g2) + ':' + (+m[2] / g2); }
      return +m[1] + ':' + +m[2];
    }
    if ((m = /^\(?(-?\d+),(-?\d+)\)?$/.exec(s))) return +m[1] + ',' + +m[2];
    if ((m = /^(\d+) (\d+)\/(\d+)$/.exec(s))) {
      if (o.equiv && +m[3]) { var g3 = gcd(+m[2], +m[3]) || 1; return +m[1] + ' ' + (+m[2] / g3) + '/' + (+m[3] / g3); }
      return +m[1] + ' ' + +m[2] + '/' + +m[3];
    }
    return s;
  }
  /* money answers: a plain integer is CENTS, a decimal is DOLLARS; the checker accepts every unambiguous way to type the same amount
     (45 = 0.45 = $0.45 = 45¢; 155 = 1.55 = $1.55). A problem opts out with raw.cnt:true (a count or a whole-dollar answer) or opts in with raw.money:true. */
  function isMon(p) { return p.mon !== undefined ? !!p.mon : p.ans === 'money'; }
  function monCents(a) {
    var s = String(a).replace(/[$¢\s]/g, '');
    if (!/^(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return s.indexOf('.') >= 0 ? Math.round(parseFloat(s) * 100) : parseInt(s, 10);
  }
  function monTyped(typed) {
    var s = String(typed).trim().replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase(), c = /¢$/.test(s), d = /^\$/.test(s) || s.indexOf('.') >= 0, n;
    s = s.replace(/[$¢]/g, '');
    if (!/^(\d+\.?\d*|\.\d+)$/.test(s)) return [];
    n = parseFloat(s);
    if (c) return [Math.round(n)];
    if (d) return [Math.round(n * 100)];
    return [Math.round(n), Math.round(n * 100)];
  }
  function monForms(C) {
    var f = [String(C), (C / 100).toFixed(2)];
    if (C % 100 === 0) f.push(String(C / 100));
    if (C % 10 === 0) f.push((C / 100).toFixed(1));
    if (C < 100) f.push('.' + (C < 10 ? '0' : '') + C);
    return f;
  }
  function check(typed, p) {
    if (typed == null || !p) return false;
    var t = String(typed).trim();
    if (!t) return false;
    if (norm(t, p) === norm(p.a, p)) return true;
    if (isMon(p)) { var C = monCents(p.a); return !isNaN(C) && monTyped(t).indexOf(C) >= 0; }
    return false;
  }
  function isComplete(typed, p) {
    typed = String(typed);
    if (isMon(p)) {
      var C = monCents(p.a), t = typed.replace(/[$¢\s]/g, '');
      if (!isNaN(C)) {
        if (!t) return false;
        if (check(typed, p)) return true;
        if (t.indexOf('.') >= 0) return t.length - t.indexOf('.') - 1 >= 2;
        var m = 99; monForms(C).forEach(function (f) { if (f.indexOf('.') < 0) m = Math.min(m, f.length); });
        return t.length >= Math.max(m, String(C).length);
      }
    }
    return typed.length >= String(p.a).length;
  }
  function prefixOk(typed, p) {
    typed = String(typed);
    if (isMon(p)) {
      var C = monCents(p.a), t = typed.replace(/[$¢\s]/g, '');
      if (!isNaN(C)) return monForms(C).some(function (f) { return f.indexOf(t) === 0; });
    }
    return String(p.a).indexOf(typed) === 0;
  }
  function charset(t) {
    var cs = '0123456789';
    switch (t.ans || 'num') {
      case 'dec': cs += '.'; break;
      case 'frac': cs += '/'; break;
      case 'money': cs += '.$¢'; break;
      case 'time': case 'ratio': cs += ':'; break;
      case 'rem': cs += 'r'; break;
      case 'pair': cs += ','; break;
      case 'mixed': cs += ' /'; break;
    }
    if (t.neg) cs += '-';
    return cs;
  }

  /* ---------- registry ---------- */
  var topics = {}, PLAN = {}, addErrors = [], runtimeErrors = [], words = [];
  function rebuild() {
    PLAN = {};
    Object.keys(topics).forEach(function (id) { var t = topics[id]; (PLAN[t.world] = PLAN[t.world] || []).push(t); });
    Object.keys(PLAN).forEach(function (w) { PLAN[w].sort(function (a, b) { return a.n - b.n; }); });
    MATH.PLAN = PLAN;
  }
  function add(t) {
    if (!t || typeof t !== 'object') { addErrors.push('MATH.add: not an object'); return null; }
    var id = t.id;
    if (typeof id !== 'string' || !/^m\d+\.\d+$/.test(id)) { addErrors.push('bad topic id ' + id); return null; }
    if (typeof t.gen !== 'function') { addErrors.push(id + ': missing gen'); return null; }
    var mm = /^m(\d+)\.(\d+)$/.exec(id);
    t.world = t.world != null ? t.world : +mm[1];
    t.n = t.n != null ? t.n : +mm[2];
    if (id !== 'm' + t.world + '.' + t.n) addErrors.push(id + ': id does not match world.n');
    t.neg = !!t.neg; t.exact = t.exact !== false; t.ans = t.ans || 'num'; t.equiv = !!t.equiv;
    t.title = t.title || id; t.strand = t.strand || ''; t.exp = t.exp || ''; t.tier = t.world - 1;
    if (topics[id] && !topics[id].sample) { addErrors.push(id + ': duplicate id (kept the first)'); return topics[id]; }
    topics[id] = t; rebuild();
    return t;
  }
  function addWord(w) { if (w && typeof w.gen === 'function') words.push(w); return w; }

  /* ---------- problems ---------- */
  function mk(t, raw, s, world) {
    var a = String(raw.a), aid = raw.aid || raw.vis;
    var p = {
      q: String(raw.q), a: a, aid: aid || null, digits: a.length, keys: uniq(a), hint: raw.hint || '',
      topic: t.id, world: world || t.world, part: s, ans: t.ans || 'num', equiv: !!t.equiv, units: t.units || null
    };
    p.mon = raw.cnt ? false : (raw.money || t.ans === 'money') ? true : false;
    if (raw.eq) p.eq = raw.eq;
    return p;
  }
  function uniq(s) { var o = '', i; for (i = 0; i < s.length; i++) if (o.indexOf(s.charAt(i)) < 0) o += s.charAt(i); return o; }
  function safeGen(t, r, s, tier) {
    try {
      var x = t.gen(r, s, tier);
      if (x && x.q != null && x.a != null) return x;
      runtimeErrors.push(t.id + ': gen returned no q/a');
    } catch (e) { runtimeErrors.push(t.id + ': ' + (e && e.message)); }
    var a = 1 + r.int(0, 4), b = r.int(1, 4);
    return { q: a + ' + ' + b, a: String(a + b) };
  }
  function keyOf(p) { return p.q + '|' + (p.aid ? JSON.stringify(p.aid) : ''); }
  function many(pickTopic, s, count, r) {
    var out = [], seen = {}, tries = 0, t, p;
    while (out.length < count && tries < count * 40) {
      tries++;
      t = pickTopic(r);
      var ss = typeof s === 'function' ? s(r) : s;
      p = mk(t, safeGen(t, r, ss, t.tier), ss, t.world);
      if (seen[keyOf(p)] && tries < count * 30) continue;
      seen[keyOf(p)] = 1; out.push(p);
    }
    return out;
  }
  function topicsOf(w) {
    w = clamp(w | 0, 1, 12);
    for (var x = w; x >= 1; x--) if (PLAN[x] && PLAN[x].length) return PLAN[x];
    for (x = w + 1; x <= 12; x++) if (PLAN[x] && PLAN[x].length) return PLAN[x];
    return [];
  }
  function lesson(world, k) {
    var ts = topicsOf(world), w = clamp(world | 0, 1, 12);
    if (!ts.length) return null;
    if (k === 'review') k = 7; if (k === 'boss') k = 8;
    if (k >= 7) {
      return { id: 'm' + w + (k === 7 ? '.R' : '.B'), world: w, tier: w - 1, kind: k === 7 ? 'review' : 'boss', title: k === 7 ? 'Review' : 'Boss', mix: ts, ans: 'num' };
    }
    return ts[Math.min(Math.max(k | 0, 0), ts.length - 1)];
  }
  var resolver = function (i) { i = Math.max(0, i | 0); return slotOf(i); };
  function slotOf(pos) { var w = clamp(Math.floor(pos / 9) + 1, 1, 12), k = pos % 9; return { w: w, k: k, kind: k < 7 ? 'learn' : k === 7 ? 'review' : 'boss' }; }
  function slotFor(i) { var s = resolver(i) || slotOf(i); if (s.k == null) s.k = s.kind === 'review' ? 7 : s.kind === 'boss' ? 8 : (s.n || 0); return s; }
  function setSlotResolver(fn) { if (typeof fn === 'function') resolver = fn; }
  function problems(li, part, count, seed) {
    count = count || 12; seed = seed || 0; part = clamp(part | 0, 0, 7);
    var sl = typeof li === 'object' && li ? li : slotFor(li);
    var k = sl.k != null ? sl.k : sl.kind === 'review' ? 7 : sl.kind === 'boss' ? 8 : 0;
    var t = lesson(sl.w, k);
    if (!t) return [];
    var r = rng(hash('p', seed, t.id, part));
    if (t.mix) {
      var s = t.kind === 'boss' ? Math.max(part, 6) : part;
      return many(function (q) { return q.pick(t.mix); }, s, count, r);
    }
    return many(function () { return t; }, part, count, r);
  }
  function gen(id, s, seed, n) {
    var t = topics[id];
    if (!t) return [];
    var r = rng(hash('g', seed, id, s));
    return many(function () { return t; }, clamp(s | 0, 0, 7), n || 12, r);
  }
  function seedFor(i, s, attempt) { return hash('seed', i, s, attempt || 0); }

  /* ---------- chain and word problems ---------- */
  var LIM = [10, 10, 20, 50, 100, 100, 200, 300, 400, 500, 800, 1000];
  function chain(world, seed, len) {
    world = clamp(world | 0, 1, 12); len = len || 3;
    var r = rng(hash('chain', world, seed)), lim = LIM[world - 1], v = r.int(2, Math.max(3, Math.floor(lim / 2))), steps = [], i, op, y, q, nv, tries;
    for (i = 0; i < len; i++) {
      for (tries = 0; tries < 30; tries++) {
        var ops = ['+'];
        if (world >= 2) ops.push('−');
        if (world >= 5) ops.push('×');
        if (world >= 8) ops.push('÷');
        op = r.pick(ops);
        if (op === '+') { y = r.int(1, Math.max(2, Math.floor(lim / 3))); nv = v + y; }
        else if (op === '−') { y = r.int(1, Math.max(1, v - 1)); nv = v - y; }
        else if (op === '×') { y = r.int(2, world >= 7 ? 9 : 5); nv = v * y; }
        else { var ds = []; for (var d = 2; d <= 9; d++) if (v % d === 0) ds.push(d); if (!ds.length) continue; y = r.pick(ds); nv = v / y; }
        if (nv >= 0 && nv <= 9999 && (i > 0 || tries < 29)) break;
      }
      if (!(nv >= 0 && nv <= 9999)) { op = '+'; y = 1; nv = v + 1; }
      q = (i === 0 ? v : v) + ' ' + op + ' ' + y;
      steps.push({ q: q, a: String(nv), digits: String(nv).length, keys: uniq(String(nv)), hint: '', topic: 'chain', world: world, part: 7, ans: 'num', equiv: false, units: null, aid: null, eq: q });
      v = nv;
    }
    return { steps: steps };
  }
  var BUILTIN_WORDS = [
    { id: 'w.add', world: 1, gen: function (r, t) { var m = [10, 10, 20, 50][Math.min(t, 3)] || 100, a = r.int(1, Math.floor(m / 2)), b = r.int(1, m - a); return { q: 'Pop has ' + a + ' cards. Gets ' + b + ' more. How many?', a: String(a + b), eq: a + ' + ' + b }; } },
    { id: 'w.sub', world: 2, gen: function (r, t) { var m = [10, 10, 20, 50][Math.min(t, 3)] || 100, a = r.int(3, m), b = r.int(1, a - 1); return { q: 'Pop has ' + a + ' cards. Gives ' + b + ' away. How many left?', a: String(a - b), eq: a + ' − ' + b }; } },
    { id: 'w.coins', world: 4, gen: function (r) { var a = r.int(1, 6), b = r.int(1, 5); return { q: a + ' loonies and ' + b + ' toonies. How many dollars?', a: String(a + 2 * b), eq: a + ' + 2 × ' + b }; } },
    { id: 'w.groups', world: 5, gen: function (r) { var g = r.int(2, 9), n = r.int(2, 9); return { q: g + ' bags of ' + n + ' pucks. How many pucks?', a: String(g * n), eq: g + ' × ' + n }; } },
    { id: 'w.share', world: 6, gen: function (r) { var g = r.int(2, 9), n = r.int(2, 9); return { q: g * n + ' cards shared by ' + g + ' kids. How many each?', a: String(n), eq: g * n + ' ÷ ' + g }; } }
  ];
  function word(world, seed) {
    world = clamp(world | 0, 1, 12);
    var r = rng(hash('word', world, seed)), pool = words.concat(BUILTIN_WORDS).filter(function (w) { return w.world <= world; });
    var w = r.pick(pool), x;
    try { x = w.gen(r, world - 1); } catch (e) { runtimeErrors.push(w.id + ': ' + (e && e.message)); x = { q: '2 + 2', a: '4' }; }
    return { q: String(x.q), a: String(x.a), digits: String(x.a).length, keys: uniq(String(x.a)), hint: x.hint || '', topic: w.id, world: world, part: 7, ans: 'num', equiv: false, units: null, aid: null, eq: x.eq };
  }

  /* ---------- runner problems ---------- */
  function forRunner(tier, keys, kind, opts) {
    opts = opts || {};
    var count = opts.count || 12, seed = opts.seed || 0, w = clamp((tier | 0) + 1, 1, 12);
    if (kind === 'spell') return chain(w, seed, opts.len || 3).steps;
    keys = keys || '0123456789';
    var rngs = { rock: [0, 3], bridge: [2, 5], tower: [4, 7], boss: [5, 7] }[kind] || [2, 5];
    var lens = { rock: [1, 1], bridge: [2, 4], tower: [2, 6], boss: [1, 6] }[kind] || [2, 4];
    var rk = kind === 'boss' ? null : kind;
    var r = rng(hash('run', seed, kind, w)), cur = topicsOf(w), pools = [], x, out = [], seen = {}, tries = 0, t, s, p, i, ok;
    function allowed(tp) { return !rk || !tp.run || tp.run.indexOf(rk) >= 0; }
    var own = cur.filter(allowed);
    for (x = w - 1; x >= 1; x--) if (PLAN[x]) pools = pools.concat(PLAN[x].filter(allowed));
    if (!own.length && !pools.length) own = [];
    while (out.length < count && tries < count * 80 && (own.length || pools.length)) {
      tries++;
      t = (own.length && (!pools.length || r.chance(0.75))) ? r.pick(own) : r.pick(pools);
      s = r.int(rngs[0], rngs[1]);
      p = mk(t, safeGen(t, r, s, t.tier), s, t.world);
      if (p.a.length < lens[0] || p.a.length > lens[1]) continue;
      ok = true; for (i = 0; i < p.a.length; i++) if (keys.indexOf(p.a.charAt(i)) < 0) { ok = false; break; }
      if (!ok || seen[keyOf(p)]) continue;
      seen[keyOf(p)] = 1; out.push(p);
    }
    while (out.length < count) {
      var a2, b2, ln = lens[0] === 1 ? 1 : 2;
      if (ln === 1) { a2 = r.int(1, 5); b2 = r.int(0, 4); } else { a2 = r.int(10, 60); b2 = r.int(5, 39); }
      var q2 = a2 + ' + ' + b2;
      if (seen[q2]) { if (out.length > count * 3) break; seen[q2 + out.length] = 1; }
      seen[q2] = 1;
      out.push({ q: q2, a: String(a2 + b2), aid: null, digits: String(a2 + b2).length, keys: uniq(String(a2 + b2)), hint: '', topic: 'fallback', world: 1, part: 0, ans: 'num', equiv: false, units: null });
    }
    return out;
  }

  /* ---------- validator ---------- */
  function checkExpr(expr, val, t) {
    var parts = String(expr).split('='), ctx = {}, l, r;
    if (parts.length > 2) return null;
    if (parts.length === 2 && parts[1].trim() !== '') {
      l = evalSide(parts[0], val, ctx); r = evalSide(parts[1], val, ctx);
      if (l == null || r == null) return null;
      return { ok: Math.abs(l - r) < 1e-9, ctx: ctx };
    }
    r = evalSide(parts[0], undefined, ctx);
    if (r == null) return null;
    var ok = Math.abs(r - val) < 1e-9 || (t.ans === 'money' && (Math.abs(r * 100 - val) < 1e-6 || Math.abs(r - val / 100) < 1e-9));
    return { ok: ok, ctx: ctx, res: r };
  }
  function verifyOne(t, p) {
    var res = { status: 'unk' }, val, c;
    if (typeof t.verify === 'function') { try { return { status: t.verify(p) ? 'ok' : 'bad' }; } catch (e) { return { status: 'bad', why: 'verify threw' }; } }
    if (t.ans === 'rem') {
      var m = /^(\d+)\s*[÷\/]\s*(\d+)/.exec(p.q), mm = /^(\d+)r(\d+)$/.exec(p.a);
      if (!m || !mm || +m[2] === 0) return res;
      return { status: (Math.floor(m[1] / m[2]) === +mm[1] && m[1] % m[2] === +mm[2]) ? 'ok' : 'bad' };
    }
    val = value(p.a);
    if (isNaN(val)) return res;
    var arith = /^[\d\s.+\-−×÷*\/()^²³√%$¢=_?□xyn,  ]+$/.test(p.q) || /\bof\b/.test(p.q) && /^[\d\s.+\-−×÷*\/()^%$¢=_?of]+$/.test(p.q);
    c = arith ? checkExpr(p.q, val, t) : null;
    if (!c && p.eq) c = checkExpr(p.eq, val, t);
    if (!c) return res;
    if (!c.ok) return { status: 'bad', why: 'answer does not match ' + (arith ? 'q' : 'eq') };
    if (t.exact && t.ans !== 'frac' && t.ans !== 'dec' && t.ans !== 'ratio' && c.ctx.inexact) return { status: 'bad', why: 'inexact division' };
    if (!t.neg && c.ctx.negMid) return { status: 'bad', why: 'negative step' };
    return { status: 'ok' };
  }
  function validate(opts) {
    opts = opts || {};
    var seeds = opts.seeds || 120, minD = opts.minDistinct || 50, errors = addErrors.map(function (e) { return 'add: ' + e; }), warnings = [], stats = {}, ids = opts.topics || Object.keys(topics);
    ids.forEach(function (id) {
      var t = topics[id], cs, distinct = {}, nd = 0, unk = 0, runs = { rock: 0, bridge: 0, tower: 0 }, s, sd, i, bad = 0;
      if (!t) { errors.push(id + ': unknown topic'); return; }
      function E(msg) { if (bad < 5) errors.push(id + ': ' + msg); bad++; }
      if (t.neg && t.world < NEG_WORLD) E('neg:true before world ' + NEG_WORLD);
      if (t.run) t.run.forEach(function (k) { if (RUNK.indexOf(k) < 0) E('bad run kind ' + k); });
      if (t.ans === 'rem' && t.world !== 6) E("remainders ('rem') only in world 6");
      if (['num', 'dec', 'frac', 'money', 'time', 'ratio', 'rem', 'pair', 'mixed'].indexOf(t.ans) < 0) E('bad ans type ' + t.ans);
      cs = charset(t);
      for (s = 0; s < 8; s++) {
        for (sd = 0; sd < seeds; sd++) {
          var r1 = rng(hash('v', sd, id, s)), raw, p, r2, raw2;
          try { raw = t.gen(r1, s, t.tier); } catch (e) { E('gen threw at s=' + s + ': ' + e.message); continue; }
          if (!raw || raw.q == null || raw.a == null) { E('gen returned no q/a at s=' + s); continue; }
          p = mk(t, raw, s);
          if (typeof raw.q !== 'string' || typeof raw.a !== 'string') E('q and a must be strings (' + p.q + ')');
          if (!p.q.trim()) E('empty q');
          if (p.q.length > 80) E('q too long: ' + p.q);
          if (p.hint.length > 60) E('hint too long');
          if (/[a-z]/i.test(p.q) && p.q.split(/\s+/).length > 14) E('word problem over 12 words: ' + p.q);
          if (/\d\s*[x*]\s*\d/.test(p.q)) E("use × not x or *: " + p.q);
          if (USBAD.test(p.q + ' ' + p.hint)) E('US spelling in: ' + p.q + ' ' + p.hint);
          if (!p.a.length) E('empty answer');
          if (p.a.length > MAXLEN) E('answer longer than ' + MAXLEN + ': ' + p.a);
          var us = t.units || [], body = p.a;
          for (i = 0; i < us.length; i++) if (body.length > us[i].length && body.slice(-us[i].length) === us[i]) { body = body.slice(0, -us[i].length); break; }
          for (i = 0; i < body.length; i++) if (cs.indexOf(body.charAt(i)) < 0) { E('answer char "' + body.charAt(i) + '" not allowed for ans:' + t.ans + ': ' + p.a); break; }
          if (!t.neg && p.a.charAt(0) === '-') E('negative answer ' + p.a + ' in a non-neg topic');
          if (t.ans === 'num' && !/^-?\d+$/.test(body)) E('num answer must be an integer: ' + p.a);
          if (t.ans === 'dec' && !/^-?(\d+\.\d+|\d+)$/.test(body)) E('bad decimal answer ' + p.a);
          if (t.ans === 'frac' && !/^-?\d+\/\d+$/.test(body)) E('bad fraction answer ' + p.a);
          if (t.ans === 'time' && !/^\d{1,2}:\d{2}$/.test(body)) E('bad time answer ' + p.a);
          if (t.ans === 'ratio' && !/^\d+:\d+$/.test(body)) E('bad ratio answer ' + p.a);
          if (t.ans === 'rem' && !/^\d+r\d+$/.test(body)) E('bad remainder answer ' + p.a);
          if (t.ans === 'pair' && !/^-?\d+,-?\d+$/.test(body)) E('bad pair answer ' + p.a);
          if (p.aid && (typeof p.aid !== 'object' || Array.isArray(p.aid))) E('aid must be an object');
          if (!check(p.a, p)) E('checker rejects its own answer ' + p.a);
          var v = verifyOne(t, p);
          if (v.status === 'bad') E('WRONG ANSWER ' + (v.why ? '(' + v.why + ') ' : '') + p.q + ' -> ' + p.a);
          else if (v.status === 'unk') unk++;
          var k = keyOf(p);
          if (!distinct[k]) { distinct[k] = 1; nd++; }
          if (p.a.length === 1 && /^\d$/.test(p.a)) runs.rock++;
          if (sd < 12) {
            r2 = rng(hash('v', sd, id, s));
            try { raw2 = t.gen(r2, s, t.tier); } catch (e) { raw2 = null; }
            if (!raw2 || JSON.stringify(raw2) !== JSON.stringify(raw)) E('not deterministic for equal seed (s=' + s + ')');
          }
        }
      }
      if (nd < minD) E('only ' + nd + ' distinct problems (need ' + minD + ')');
      if (unk > 0) warnings.push(id + ': ' + unk + ' problems could not be verified (add eq or verify)');
      stats[id] = { distinct: nd, unverified: unk, oneDigit: runs.rock };
    });
    for (var w = 1; w <= 12; w++) { var c = (PLAN[w] || []).length; if (c < 7) warnings.push('world ' + w + ' has ' + c + ' of 7 topics'); }
    return { ok: errors.length === 0, errors: errors, warnings: warnings, stats: stats, topics: ids.length };
  }

  var MATH = {
    version: 1, NEG_WORLD: NEG_WORLD, MAXLEN: MAXLEN, PLAN: PLAN, fmt: fmt, add: add, addWord: addWord, topic: function (id) { return topics[id] || null; },
    list: function () { return Object.keys(topics).map(function (k) { return topics[k]; }); }, topicsOf: topicsOf, rng: rng, hash: hash, seedFor: seedFor,
    calc: calc, value: value, norm: norm, check: check, isComplete: isComplete, prefixOk: prefixOk, charset: charset, gcd: gcd,
    slotFor: slotFor, setSlotResolver: setSlotResolver, lesson: lesson, problems: problems, gen: gen, forRunner: forRunner, chain: chain, word: word,
    validate: validate, errors: runtimeErrors, addErrors: addErrors
  };
  root.MATH = MATH;

  /* ---------- SAMPLE topics (prove the contract; B1 replaces them by registering the same ids) ---------- */
  MATH.add({
    id: 'm1.1', world: 1, n: 1, strand: 'B', sample: true, exp: 'JK/SK: count objects to 10 (sample)', title: 'Count the dots',
    neg: false, exact: true, ans: 'num', run: ['rock'],
    gen: function (r, s) {
      var max = s < 2 ? 5 : s < 4 ? 7 : 10, n = r.int(s < 4 ? 1 : 0, max);
      return { q: '?', a: String(n), aid: { dots: [n], layout: r.pick(['row', 'frame', 'dice', 'scatter', 'rows', 'circle']) }, hint: 'Count them', eq: String(n) };
    }
  });
  MATH.add({
    id: 'm2.1', world: 2, n: 1, strand: 'B', sample: true, exp: 'Gr1: add within 10 (sample)', title: 'Add within 10',
    neg: false, exact: true, ans: 'num', run: ['rock', 'bridge'],
    gen: function (r, s) {
      var max = s < 2 ? 5 : s < 4 ? 7 : 10, a = r.int(0, max), b = r.int(0, max - a), o = { hint: 'Count on' };
      if (s >= 6 && r.chance(0.4)) { o.q = a + ' + _ = ' + (a + b); o.a = String(b); }
      else { o.q = a + ' + ' + b; o.a = String(a + b); if (s < 4 || (s < 6 && r.chance(0.5))) o.aid = { dots: [a, b] }; }
      return o;
    }
  });
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
