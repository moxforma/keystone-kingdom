/* ================= SPELL-DATA: Keyloria Kingdom spelling data core (phase C0) =================
   Global SPELLD. Content files (spell-w1.js ... spell-w10-12.js) self-register topics; spell-adv.js and
   runner-spell.js read them through the API below. Loads harmlessly anywhere (no DOM, no game globals needed).

   TOPIC SHAPE (one SPELLD.add per topic, 7 learn topics per world, world 1-12, n 1-7):
     SPELLD.add({
       id:'s4.3',            // 's<world>.<n>', must match world and n
       world:4, n:3,         // W1 JK/SK, W2-3 Gr1, W4 Gr2, W5 Gr3, W6 Gr4, W7 Gr5, W8 Gr6, W9 Gr7, W10 Gr8, W11-12 reviews
       grade:'2',            // '0'=JK/SK, '1'..'8'; string
       title:'AR words',     // kid-visible, short (<= 24 chars); defaults to pattern
       pattern:'r-controlled ar',  // free text, teacher-facing
       p:'ar',               // optional short tag copied onto each word item (defaults to pattern)
       exp:'Language 2023 C: phonics',  // free-text curriculum note (NOT a code; Ontario codes are uncertain)
       words:'car|far|star|barn|market@3|...',  // 40-80 unique lowercase words, '|' separated; 'word@g' overrides grade (0-8)
       sents:{star:'A star shines at night.', ...},  // >= 10 dictation sentences. KEY = a word of this topic;
                                  // the sentence contains that exact word, starts with a capital, ends . ! or ?, 3-14 words
       punct:1,              // optional: allow ' and - inside words (contractions, compound words)
       allow:['meter']       // optional: exempt exact words from the Canadian blocklist (e.g. the Greek root 'meter')
     });
   Words are a-z only (plus ' and - only with punct:1). Canadian spelling: colour, centre, favourite, neighbour,
   metre, litre, grey, theatre, defence, travelled, jewellery. validate() enforces all of this.
   Sample topics s1.1 and s2.2 carry sample:true and are REPLACED when a content file adds the same id.

   WORLD SLOTS: each world's group has 9 lessons: slot 0-6 = learn topics n=1..7, slot 7 = Review, slot 8 = Boss Test.

   API (deterministic from the seed; seed may be a number or string):
     SPELLD.add(topic) -> topic        SPELLD.topic(id)        SPELLD.topicsOf(world) -> [topic] sorted by n
     SPELLD.all() -> [topic]           SPELLD.PLAN() -> [12][<=7] topic ids
     SPELLD.lesson(world, slot) -> topic  (slot 0-6 learn; 7 = synthetic {kind:'review'}; 8 = synthetic {kind:'boss'};
                                        a missing learn n repeats the world's last topic; null if the world is empty)
     SPELLD.slotKind(slot) -> 'learn'|'review'|'boss'
     SPELLD.mapLessons(order, worldOf, isBoss?) -> {[lessonIndex]:{world,slot,kind}}  (order = game ORDER, worldOf 1-based)
     SPELLD.words(topicRef, part, count, seed) -> [{w:'ship', s:'The ship sailed away.', p:'sh', g:1}]
        topicRef = topic id | topic object | object from lesson(); part 0-7 ramps from shorter/easier to longer/harder words
     SPELLD.wordsFor(world, slot, part, count, seed)  (via lesson(); review pools the whole world, boss = hardest 40%)
     SPELLD.blank(word, seed, mode) -> {w, show:'c_t', ans:'a', at:1, mode:'missing'|'first'}
     SPELLD.sentence(word, topicId?) -> string|''     SPELLD.sentences(topicRef, count, seed) -> [{w,s}]
     SPELLD.forRunner(tier, kind, opts) -> [items]; tier 0-11 (= world-1); kind 'rock'|'bridge'|'tower'|'boss'|'spell';
        opts {seed, count (default 8), part (0-7), topic (id)}. Item shapes:
          rock   {kind:'rock', w, show:'c_t', ans:'a', at, mode, p, g}   (early tiers also give first-sound items: show '_at', ans 'c')
          bridge {kind:'bridge', w, len, p, g}   whole word, shorter words of the world
          tower  {kind:'tower', w, len, p, g}    whole word, longer words of the world
          boss   {kind:'boss', w, s, p, g}       Bee word (speak it; s = its sentence or '')
          spell  {kind:'spell', s:'The ship sailed away.', w:'ship', words:['the','ship','sailed'], text:'the ship sailed'}
     SPELLD.validate(opts) -> {ok, errors[], warnings[], stats}   opts.complete:true also needs 12 worlds x 7 topics and > 3500 words
     SPELLD.checkCanadian(text, allow?) -> [American spellings found]    SPELLD.badWords(text) -> {hard:[], soft:[]}

   BAD-WORD NOTE: the game's own filter lives in public/game.js, section "V38 clean-name filter" through "V39 clean typing
   text" (about lines 2162-2182): BAD_SUB, BAD_WORD (V38 list plus the V40 push), badName, tokBad, cleanText and the
   genText/comboText wrappers. cleanText scrambles the letters of any token tokBad() flags. BAD_WORD contains innocent words
   (blood, pot, shot, wine, god, knife, church, bible, hell, die, dead, strip, kiss, wet...) so Science and Social lessons get
   scrambled (the audit found "blood" in a Science Words lesson). Spelling stream words must NEVER pass through
   genText/cleanText. A later phase should change cleanText to flag only exact hard-profanity tokens (see SPELLD.badWords,
   whose hard list is exact-token only and has no innocent words). */
(function(root){
'use strict';
const T={},SENT={};
const NW=12,SLOTS=9;

/* ---------- seeded rng ---------- */
function hash(v){const s=String(v);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=hash(seed==null?0:seed)>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function shuffle(arr,r){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const x=a[i];a[i]=a[j];a[j]=x}return a}

/* ---------- Canadian spelling blocklist (US token -> Canadian form) ---------- */
const US_EXACT={gray:'grey',grays:'greys',grayer:'greyer',grayest:'greyest',graying:'greying',grayish:'greyish',
 defense:'defence',defenses:'defences',offense:'offence',offenses:'offences',pretense:'pretence',
 jewelry:'jewellery',jeweler:'jeweller',jewelers:'jewellers',
 traveled:'travelled',traveling:'travelling',traveler:'traveller',travelers:'travellers',
 canceled:'cancelled',canceling:'cancelling',labeled:'labelled',labeling:'labelling',modeled:'modelled',modeling:'modelling',
 fueled:'fuelled',fueling:'fuelling',marveled:'marvelled',marveling:'marvelling',marvelous:'marvellous',
 signaled:'signalled',signaling:'signalling',quarreled:'quarrelled',leveled:'levelled',leveling:'levelling',
 counselor:'counsellor',counselors:'counsellors',catalog:'catalogue',catalogs:'catalogues',
 pajamas:'pyjamas',plow:'plough',plows:'ploughs',plowed:'ploughed',aluminum:'aluminium',
 mold:'mould',molds:'moulds',moldy:'mouldy',molded:'moulded',smolder:'smoulder',sulfur:'sulphur',
 ax:'axe',cozy:'cosy',mustache:'moustache',maneuver:'manoeuvre',maneuvers:'manoeuvres',
 fulfill:'fulfil',fulfills:'fulfils',fulfillment:'fulfilment',skillful:'skilful',installment:'instalment',
 theater:'theatre',theaters:'theatres',center:'centre',centers:'centres',centered:'centred',centering:'centring',
 meter:'metre',meters:'metres',kilometer:'kilometre',kilometers:'kilometres',centimeter:'centimetre',centimeters:'centimetres',
 millimeter:'millimetre',millimeters:'millimetres',liter:'litre',liters:'litres',milliliter:'millilitre',milliliters:'millilitres',
 fiber:'fibre',fibers:'fibres',caliber:'calibre',somber:'sombre',saber:'sabre',luster:'lustre',specter:'spectre',
 splendor:'splendour',glamor:'glamour'};
// stems that take suffixes: colour, honour, favour, flavour, neighbour, labour, humour, harbour, rumour, odour, vapour...
const US_STEMS={color:'colour',honor:'honour',favor:'favour',flavor:'flavour',neighbor:'neighbour',labor:'labour',humor:'humour',
 harbor:'harbour',rumor:'rumour',odor:'odour',vapor:'vapour',savior:'saviour',armor:'armour',behavior:'behaviour',tumor:'tumour',
 endeavor:'endeavour',vigor:'vigour',valor:'valour',rigor:'rigour',parlor:'parlour',candor:'candour'};
const STEM_RE=new RegExp('^(?:dis|mis|water|multi|un|non)?('+Object.keys(US_STEMS).join('|')+')(?:s|ed|ing|ful|fully|able|ably|ite|ites|ist|ists|ly|y|less|hood|hoods|er|ers|ize|ized|ise)?$');
function tokens(text){return String(text||'').toLowerCase().replace(/[‘’]/g,"'").match(/[a-z]+(?:['-][a-z]+)*/g)||[]}
function checkCanadian(text,allow){const out=[];allow=allow||[];
 tokens(text).forEach(t=>{if(allow.indexOf(t)>=0)return;
  if(Object.prototype.hasOwnProperty.call(US_EXACT,t)||STEM_RE.test(t))out.push(t)});
 return out}

/* ---------- inappropriate words: exact tokens only, never substrings, never scrambling ---------- */
const HARD=new Set('fuck,fucking,fucked,fuk,shit,shitty,bitch,cunt,dick,penis,vagina,pussy,porn,porno,nazi,hitler,slut,whore,bastard,asshole,arsehole,ass,arse,damn,goddamn,crap,piss,sex,sexy,nude,naked,rape,rapist,nigger,nigga,fag,faggot,retard,retarded,cock,cum,tit,tits,boob,boobs,butt,wtf,stfu,kys,jizz,dildo,horny,prick,twat,wank,poop'.split(','));
const SOFT=new Set('stupid,idiot,dumb,loser,hate,kill,killer,die,dead,hell,god,devil,demon,satan,gun,guns,bomb,bombs,drug,drugs,drunk,beer,wine,vodka,booze,murder,suicide,slave,slavery,terror,terrorist,racist,virgin,sperm,kiss'.split(','));
function badWords(text){const hard=[],soft=[];tokens(text).forEach(t=>{const u=t.replace(/['-]/g,'');
 if(HARD.has(t)||HARD.has(u))hard.push(t);else if(SOFT.has(t)||SOFT.has(u))soft.push(t)});return{hard,soft}}

/* ---------- parsing and registry ---------- */
function parseWords(t){const out=[];const g0=parseInt(t.grade,10);
 String(t.words||'').split('|').map(x=>x.trim()).filter(Boolean).forEach(x=>{
  const m=/^(.*?)(?:@(\d+))?$/.exec(x);const g=m[2]!=null?+m[2]:g0;
  out.push({w:m[1],g:isNaN(g)?0:g,s:''})});return out}
function forget(t){Object.keys(t.sents||{}).forEach(w=>{if(SENT[w]){SENT[w]=SENT[w].filter(x=>x.id!==t.id);if(!SENT[w].length)delete SENT[w]}});delete T[t.id]}
function add(topic){
 if(!topic||typeof topic!=='object')throw new Error('SPELLD.add: topic object required');
 const t=Object.assign({},topic);
 if(!/^s\d+\.\d+$/.test(t.id||''))throw new Error('SPELLD.add: bad id '+t.id);
 const prev=T[t.id];if(prev&&!prev.sample)throw new Error('SPELLD.add: duplicate id '+t.id);
 if(prev)forget(prev);
 t.world=+t.world;t.n=+t.n;t.grade=String(t.grade==null?'':t.grade);t.title=t.title||t.pattern||t.id;t.p=t.p||t.pattern||'';
 t.sents=Object.assign({},t.sents||{});t.list=parseWords(t);
 t.list.forEach(r=>{r.p=t.p;r.s=t.sents[r.w]||''});
 T[t.id]=t;
 Object.keys(t.sents).forEach(w=>{(SENT[w]=SENT[w]||[]).push({id:t.id,s:t.sents[w]})});
 return t}
const all=()=>Object.keys(T).map(k=>T[k]).sort((a,b)=>a.world-b.world||a.n-b.n);
const topic=id=>T[id]||null;
const topicsOf=w=>all().filter(t=>t.world===+w);
function PLAN(){const p=[];for(let w=1;w<=NW;w++)p.push(topicsOf(w).map(t=>t.id));return p}

/* ---------- lessons / slots ---------- */
const slotKind=s=>s===8?'boss':s===7?'review':'learn';
function lesson(world,slot){world=+world;slot=Math.max(0,Math.min(8,slot|0));
 const ts=topicsOf(world);if(!ts.length)return null;
 if(slot<7)return ts.find(t=>t.n===slot+1)||ts[ts.length-1];
 const kind=slotKind(slot),seen=new Set(),list=[],sents={};
 ts.forEach(t=>{Object.assign(sents,t.sents);t.list.forEach(r=>{if(!seen.has(r.w)){seen.add(r.w);list.push(Object.assign({},r))}})});
 return{id:'s'+world+'.'+kind,world,n:slot+1,kind,grade:ts[ts.length-1].grade,title:kind==='review'?'Review':'Boss Test',
  pattern:kind,p:kind,sents,list,synthetic:true}}
function mapLessons(order,worldOf,isBoss){const out={},by={};
 (order||[]).forEach(i=>{const w=worldOf(i);(by[w]=by[w]||[]).push(i)});
 Object.keys(by).forEach(w=>{const seq=by[w],L=seq.length;seq.forEach((i,p)=>{
  let slot=Math.min(p,6);
  if(p===L-1)slot=8;else if(L>=9&&p===L-2)slot=7;
  if(isBoss&&isBoss(i))slot=8;
  out[i]={world:+w,slot,kind:slotKind(slot)}})});
 return out}

/* ---------- picking ---------- */
const ref=r=>!r?null:typeof r==='string'?(T[r]||null):r;
const diff=r=>(r.g||0)*3+r.w.length;
function pick(pool,part,count,seed,hardOnly){
 if(!pool.length)return[];part=Math.max(0,Math.min(7,part|0));count=Math.max(1,count|0);
 const r=rng('w|'+seed+'|'+part);
 const sorted=pool.map((x,i)=>({x,i,d:diff(x)})).sort((a,b)=>a.d-b.d||a.i-b.i).map(o=>o.x);
 const N=sorted.length,win=Math.max(Math.min(N,count),Math.ceil(N*(hardOnly?.4:.5)));
 const start=hardOnly?N-win:Math.round(part/7*(N-win));
 const inWin=sorted.slice(start,start+win),rest=sorted.slice(0,start).reverse().concat(sorted.slice(start+win));
 let res=shuffle(inWin,r).slice(0,count);
 if(res.length<count)res=res.concat(shuffle(rest,r).slice(0,count-res.length));
 while(res.length<count)res=res.concat(shuffle(sorted,r).slice(0,count-res.length));
 return res.map(x=>({w:x.w,s:x.s||'',p:x.p,g:x.g}))}
function words(topicRef,part,count,seed){const t=ref(topicRef);if(!t)return[];
 return pick(t.list,part==null?3:part,count==null?12:count,(seed==null?0:seed)+'|'+t.id,t.kind==='boss')}
function wordsFor(world,slot,part,count,seed){const t=lesson(world,slot);if(!t)return[];
 return words(t,t.kind==='boss'?7:part,count,seed)}
function sentence(word,topicId){const a=SENT[word];if(!a||!a.length)return'';const m=topicId&&a.find(x=>x.id===topicId);return(m||a[0]).s}
function sentences(topicRef,count,seed){const t=ref(topicRef);if(!t)return[];
 const ks=Object.keys(t.sents).sort();return shuffle(ks,rng('s|'+seed+'|'+t.id)).slice(0,count==null?5:count).map(w=>({w,s:t.sents[w]}))}

/* ---------- blanks ---------- */
function blank(word,seed,mode){word=String(word);const idx=[];for(let i=0;i<word.length;i++)if(/[a-z]/.test(word[i]))idx.push(i);
 if(idx.length<2)return{w:word,show:word,ans:'',at:-1,mode:'none'};
 const m=mode==='first'?'first':'missing';let at;
 if(m==='first')at=idx[0];
 else{const inner=idx.slice(1),vs=inner.filter(i=>'aeiou'.indexOf(word[i])>=0),r=rng('b|'+seed+'|'+word);
  const pool=(vs.length&&r()<.7)?vs:inner;at=pool[Math.floor(r()*pool.length)]}
 return{w:word,show:word.slice(0,at)+'_'+word.slice(at+1),ans:word[at],at,mode:m}}

/* ---------- runner / boss items ---------- */
function runnerPool(tier,topicId){
 if(topicId&&T[topicId])return T[topicId].list;
 let w=Math.max(1,Math.min(NW,(tier|0)+1)),ts=topicsOf(w);
 while(!ts.length&&w>1)ts=topicsOf(--w);
 if(!ts.length){const a=all();if(!a.length)return[];ts=[a[0]]}
 return ts.reduce((a,t)=>a.concat(t.list),[])}
function forRunner(tier,kind,opts){opts=opts||{};tier=Math.max(0,Math.min(NW-1,tier|0));
 const count=opts.count==null?8:opts.count,seed=(opts.seed==null?0:opts.seed)+'|'+tier+'|'+kind;
 const part=opts.part==null?Math.min(7,Math.round(tier/11*5)+1):opts.part;
 const pool=runnerPool(tier,opts.topic);if(!pool.length)return[];
 // rocks, bridges and towers spell whole plain words: skip apostrophe and hyphen words (contractions, compounds)
 const plainPool=(kind==='rock'||kind==='bridge'||kind==='tower')?(pool.filter(x=>!/['-]/.test(x.w)).length?pool.filter(x=>!/['-]/.test(x.w)):pool):pool;
 if(kind==='rock'){const cand=plainPool.filter(x=>x.w.replace(/[^a-z]/g,'').length>=3),src=cand.length?cand:plainPool;
  return pick(src,Math.min(part,4),count,seed).map((x,i)=>{const first=tier<=1&&i%3===0,b=blank(x.w,seed+'|'+i,first?'first':'missing');
   return{kind:'rock',w:x.w,show:b.show,ans:b.ans,at:b.at,mode:b.mode,p:x.p,g:x.g}})}
 if(kind==='bridge'||kind==='tower'){
  const lens=plainPool.map(x=>x.w.length).sort((a,b)=>a-b),med=lens[Math.floor(lens.length/2)];
  let c=plainPool.filter(x=>kind==='tower'?x.w.length>=med:x.w.length<=med);if(c.length<Math.min(count,4))c=plainPool;
  return pick(c,part,count,seed).map(x=>({kind,w:x.w,len:x.w.length,p:x.p,g:x.g}))}
 if(kind==='boss')return pick(pool,7,count,seed,true).map(x=>({kind:'boss',w:x.w,s:x.s||sentence(x.w),p:x.p,g:x.g}));
 if(kind==='spell'){const src=pool.filter(x=>x.s);if(!src.length)return[];
  return pick(src,7,count,seed,true).map(x=>{const ws=x.s.toLowerCase().replace(/[^a-z' -]/g,' ').split(/\s+/).filter(Boolean);
   const at=Math.max(0,Math.min(ws.indexOf(x.w),ws.length-3)),three=ws.slice(at,at+3);
   return{kind:'spell',s:x.s,w:x.w,words:three,text:three.join(' ')}})}
 return[]}

/* ---------- validation ---------- */
function validate(opts){opts=opts||{};const errors=[],warnings=[];let nw=0,ns=0,nt=0;
 all().forEach(t=>{nt++;const tag='['+t.id+'] ',err=m=>errors.push(tag+m),warn=m=>warnings.push(tag+m);
  const mm=/^s(\d+)\.(\d+)$/.exec(t.id);
  if(!mm||+mm[1]!==t.world||+mm[2]!==t.n)err('id does not match world/n');
  if(!(t.world>=1&&t.world<=NW))err('world out of range');if(!(t.n>=1&&t.n<=7))err('n out of range');
  if(!/^[0-8]$/.test(t.grade))err('missing or invalid grade tag "'+t.grade+'"');
  if(!t.pattern)err('missing pattern');if(!t.exp)warn('missing exp note');
  if(t.title.length>24)err('title longer than 24 characters');
  const L=t.list;nw+=L.length;
  if(L.length<40||L.length>80)err('has '+L.length+' words (need 40-80)');
  const seen=new Set(),okRe=t.punct?/^[a-z]+(?:['-][a-z]+)*$/:/^[a-z]+$/;
  L.forEach(r=>{
   if(!okRe.test(r.w))err('bad characters in word "'+r.w+'"');
   if(seen.has(r.w))err('duplicate word "'+r.w+'"');seen.add(r.w);
   if(!(r.g>=0&&r.g<=8))err('bad grade tag on "'+r.w+'"');
   if(checkCanadian(r.w,t.allow).length)err('American spelling "'+r.w+'" (use '+(US_EXACT[r.w]||'the Canadian form')+')');
   const b=badWords(r.w);if(b.hard.length)err('inappropriate word "'+r.w+'"');if(b.soft.length)warn('questionable word "'+r.w+'"')});
  let good=0;
  Object.keys(t.sents).forEach(w=>{const s=t.sents[w];
   if(!seen.has(w)){err('sentence key "'+w+'" is not a word of this topic');return}
   if(typeof s!=='string'||!s){err('empty sentence for "'+w+'"');return}
   const n=tokens(s).length;
   if(tokens(s).indexOf(w)<0)err('sentence for "'+w+'" does not contain it: '+s);
   else if(!/^[A-Z]/.test(s)||!/[.!?]$/.test(s))err('sentence needs a capital and end mark: '+s);
   else if(n<3||n>14)err('sentence length '+n+' (need 3-14 words): '+s);
   else good++;
   const us=checkCanadian(s,t.allow);if(us.length)err('American spelling in sentence "'+s+'": '+us.join(','));
   const b=badWords(s);if(b.hard.length)err('inappropriate word in sentence "'+s+'": '+b.hard.join(','));if(b.soft.length)warn('questionable word in sentence "'+s+'": '+b.soft.join(','))});
  ns+=good;if(good<10)err('only '+good+' valid dictation sentences (need 10)')});
 if(opts.complete){for(let w=1;w<=NW;w++){const have=topicsOf(w).map(t=>t.n).join(',');if(have!=='1,2,3,4,5,6,7')errors.push('world '+w+' has topics ['+have+'] (need 1-7)')}
  if(nw<=3500)errors.push('total words '+nw+' (need > 3500)')}
 return{ok:errors.length===0,errors,warnings,stats:{topics:nt,words:nw,sentences:ns}}}

/* ---------- sample topics (replaced by the content files) ---------- */
add({id:'s1.1',sample:true,world:1,n:1,grade:'0',title:'Short a words',pattern:'CVC short a',p:'a',
 exp:'Kindergarten Program early literacy and Language 2023 C phonics: CVC short a (sample topic)',
 words:'cat|hat|bat|mat|rat|sat|pat|fat|vat|can|man|pan|ran|fan|tan|van|ban|bag|tag|rag|wag|nag|sag|lag|bad|dad|had|mad|pad|sad|lad|cap|map|tap|nap|gap|lap|rap|sap|zap|jam|ham|ram|dam|yam|jab|lab|tab|cab|gas|wax|fax|and@1|ant@1|add@1|ask@1',
 sents:{cat:'The cat sat on a mat.',hat:'Dad has a red hat.',bat:'A bat hung in the cave.',man:'The man ran to the van.',pan:'Mom put the pan on the stove.',bag:'I packed my bag for school.',
  dad:'My dad can fix a bike.',cap:'He wore a cap in the sun.',map:'We looked at the map.',jam:'I like jam on my toast.',ham:'She had a ham sandwich.',tap:'Please tap the drum.',
  nap:'The baby had a nap.',sad:'The sad pup hid under the bed.',fan:'A fan cooled the room.',and:'Mia and Sam ran home.'}});
add({id:'s2.2',sample:true,world:2,n:2,grade:'1',title:'Digraph sh',pattern:'digraph sh',p:'sh',
 exp:'Language 2023 C phonics: consonant digraph sh at the start and end of words (sample topic)',
 words:'ship|shop|shed|shin|shut|shot|shell|shelf|shark|sheep|sheet|shirt|short|shore|shower|shine|shape|share|sharp|shade|shadow|shake|shall|shave|she|shy|shrimp|shrub|shock|shout|show|shoe|shove|shampoo@2|shelter@2|shiver@2|shopping@2|shallow@3|fish|dish|wish|wash|cash|dash|rush|brush|crash|splash|flash|fresh|bush|push|trash|mash|hush|plush|smash|swish|finish@2|polish@3|punish@3|radish@2|squash@3',
 sents:{ship:'The ship sailed past the lighthouse.',shop:'We went to the shop for milk.',shed:'Our shovel is in the shed.',shell:'I found a shell on the beach.',shark:'A shark swam in the deep sea.',sheep:'The sheep ate grass on the hill.',
  shirt:'He wore a blue shirt to school.',shine:'The stars shine at night.',fish:'We caught a fish at the lake.',dish:'Please put the dish in the sink.',wish:'Make a wish and blow out the candles.',
  brush:'I brush my teeth every morning.',splash:'The frog made a big splash.',fresh:'The bread smells fresh.',finish:'Can you finish your homework?',trash:'Put the trash in the bin.',shoe:'My left shoe is untied.',push:'Push the door to open it.'}});

const SPELLD={add,topic,all,topicsOf,PLAN,lesson,slotKind,mapLessons,words,wordsFor,blank,sentence,sentences,forRunner,validate,
 checkCanadian,badWords,rng,hash,US_EXACT,US_STEMS,version:1,NW,SLOTS};
root.SPELLD=SPELLD;
if(typeof module!=='undefined'&&module.exports)module.exports=SPELLD;
})(typeof window!=='undefined'?window:globalThis);
