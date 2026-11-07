/* spell-adv.js: the SPELLING stream (Keyloria Kingdom), Phase D2.
   Registers 'spell' with KKS and runs its CLASSIC parts on the shared stage (hero, Scrambler holding the caged Keylori, lasers, HP bar,
   letter strip, finger hints). Words come from SPELLD.wordsFor. Classic parts alternate LOOK (word shown, then covered: type it from
   memory) and HEAR (the word is spoken, then its sentence). Boss Test classic part = a mini Bee (hear mode, hardest words); KKS.finishClassic
   then hands over to the hybrid runner boss (bossCfg -> RUNNER_SPELL). Runner parts: runnerCfg -> RUNNER_SPELL (runner-spell.js).
   Does not touch spelling.js (the old Spelling modes) and never writes S.hist or S.ks. */
(function(){
if(typeof window==='undefined'||!window.KKS||typeof P==='undefined'&&typeof S==='undefined')return;
const K=window.KKS,$q=(s,r)=>(r||document).querySelector(s);
const hasSpeech=()=>'speechSynthesis' in window;

/* ---------- natural voices: wait ONCE for voiceschanged before the first spoken line (robot voice on the first line otherwise) ---------- */
let vReady=false,vWait=[],vPrimed=false;
function primeVoices(){if(vPrimed||!hasSpeech())return;vPrimed=true;try{speechSynthesis.getVoices();window.kkPickVoice&&window.kkPickVoice()}catch(e){}}
function voicesReady(cb){
 if(vReady||!hasSpeech()){cb();return}
 vWait.push(cb);if(vWait.length>1)return;
 const go=()=>{if(vReady)return;vReady=true;try{window.kkPickVoice&&window.kkPickVoice()}catch(e){}const w=vWait;vWait=[];w.forEach(f=>{try{f()}catch(e){}})};
 try{if(speechSynthesis.getVoices().length)return go();speechSynthesis.addEventListener('voiceschanged',go,{once:true});setTimeout(go,1500)}catch(e){go()}}
primeVoices();
const PRON={the:'thuh',a:'uh',was:'wuz',of:'uv',said:'sed',does:'duz',one:'won',two:'too',once:'wunce',live:'liv'};
const voiceOn=()=>!!(S.set&&S.set.voice);   // same switch as game.js speak() / voice.js: "Read hints out loud"
function sayParts(parts,cb){
 if(!voiceOn()||!hasSpeech()){if(cb)setTimeout(cb,0);return}   // sound off: say nothing, never wait for speech to end
 voicesReady(()=>{try{if(!hasSpeech())return;const v=window.kkPickVoice&&window.kkPickVoice();speechSynthesis.cancel();
  setTimeout(()=>{try{const ps=parts.filter(x=>x[0]);ps.forEach(([t,r],ix)=>{const u=new SpeechSynthesisUtterance(t);if(v){u.voice=v;u.lang=v.lang}u.rate=r;u.pitch=1;if(cb&&ix===ps.length-1){u.onend=()=>cb();u.onerror=()=>{}}speechSynthesis.speak(u)});if(cb&&!ps.length)cb()}catch(e){if(cb)cb()}},60)}catch(e){if(cb)cb()}})}
function sentOf(it){return it.s||(window.SPELLD&&SPELLD.sentence?SPELLD.sentence(it.w):'')||''}
function sayWord(it,slow,cb){const w=it.w,p=PRON[w]||w,sent=sentOf(it);
 try{cuePulse()}catch(e){}
 const r=slow?.55:.8;sayParts([[p+'.',r],[sent,slow?.7:.9],[p+'.',r]],cb)}
const SND={a:'aah',e:'eh',i:'ih',o:'ah',u:'uh',b:'buh',c:'kuh',d:'duh',f:'fff',g:'guh',h:'huh',j:'juh',k:'kuh',l:'lll',m:'mmm',n:'nnn',p:'puh',q:'kwuh',r:'rrr',s:'sss',t:'tuh',v:'vvv',w:'wuh',x:'ks',y:'yuh',z:'zzz'};

/* ---------- small fallback list (only if SPELLD is missing) ---------- */
const FALL=['cat','sun','hat','pig','dog','map','bus','net','fox','cup'];

/* ---------- CSS ---------- */
try{document.head.insertAdjacentHTML('beforeend',`<style>
.sphearb{position:absolute;left:3%;bottom:7%;z-index:4;display:flex;align-items:center;gap:6px;padding:6px 10px 8px;border:0;border-radius:0;background:var(--panel2,#2a2150);color:var(--ink,#fff6e0);font-family:var(--display);font-size:16px;cursor:pointer;box-shadow:0 4px 0 #0a0f2e,inset 0 0 0 2px #4a3d62}
.sphearb img{width:48px;height:32px;image-rendering:pixelated;display:block}.sphearb:active{transform:translateY(2px)}
.spsplat{position:absolute;z-index:5;width:4px;height:4px;pointer-events:none;image-rendering:pixelated;background:#c0407a;
 box-shadow:-8px -4px 0 #c0407a,8px -8px 0 #e070a0,12px 4px 0 #c0407a,-4px 8px 0 #8a2a5a,4px 12px 0 #e070a0,-12px 8px 0 #8a2a5a,0 0 0 4px #c0407a,4px 0 0 4px #c0407a,-4px 4px 0 4px #8a2a5a,16px -4px 0 #8a2a5a;animation:spsplat .6s steps(5) forwards}
@keyframes spsplat{0%{transform:scale(.5);opacity:1}30%{transform:scale(1.5)}100%{transform:scale(1.5);opacity:0}}
#spcue{position:absolute;left:3%;right:3%;bottom:6%;z-index:4;display:flex;align-items:center;justify-content:center;gap:12px;min-height:40px;padding:2px 6px;font-family:'Jersey 10',monospace;font-size:clamp(22px,2.8vw,30px);letter-spacing:.06em;color:#e8e2f4;text-transform:uppercase;text-align:center;line-height:1.05;text-shadow:0 2px 0 #0a0f2e;pointer-events:none}
#spcue .sphearb{position:static;flex:none;pointer-events:auto;padding:4px 8px 6px}
#spcue.pulse img{animation:spcuep .3s steps(2) infinite}
@keyframes spcuep{0%{transform:scale(1)}100%{transform:scale(1.34)}}
#spcue .tk{flex:none;display:inline-block;background:#e8ecff;color:#0b1033;border-bottom:3px solid #8f98d0;padding:4px 8px 1px;font-size:.78em;line-height:1;letter-spacing:.1em;text-shadow:none}
#spcue .tx{background:rgba(10,15,46,.72);padding:2px 8px}#spcue .tx b{color:#f0c860;font-weight:400;letter-spacing:.12em}
#stripIn span.sph{color:#6f79b8}#stripIn span.spdot{color:var(--good)}
.fhint .splook{font-family:var(--display);font-size:20px;letter-spacing:.06em}
</style>`)}catch(e){}

/* pixel speaker icon (the replay button has no text: Tab does the same) */
let SPK=null;
function speakerURL(){return SPK||(SPK=PXG(['....oo......','...oGGo...c.','ooooGGo.c..c','oGGGGGo..c.c','oGGGGGo.c..c','oooGGGo..c.c','...oGGo.c..c','....oo...c..'].map(r=>r.padEnd(12,'.')),{o:'#2a1d3e',G:'#f0c860',c:'#fff6e0'}).toDataURL())}

/* ---------- topics ---------- */
const topicFor=(w,slot,kind)=>{const L=window.SPELLD&&SPELLD.lesson?SPELLD.lesson(w,slot&&slot.k!=null?slot.k:(kind==='boss'?8:kind==='review'?7:0)):null;return L?L.id:''};
const REGION=['Rhymes, sounds and first words','Short vowels, digraphs and blends','Long vowels and word endings','Sounds, plurals and silent letters','Soft c and g, prefixes, Canadian spelling','Word endings and word roots','Roots, -ible and -able, tricky patterns','Greek and Latin word parts','Prefixes, suffixes and school words','Big words and French words in Canada','Review: Kindergarten to Grade 4','Review: Grades 5 to 8'];

/* ---------- build the round ---------- */
function mode(sl,s){return sl&&sl.kind==='boss'?'bee':((s>>1)&1)?'hear':'look'}
function pickWords(sl,s,seed){
 const w=sl.w,cnt=w===1?5:w<=3?6:8,part=Math.min(7,s+(sl.g?2:0));let list=[];
 try{list=SPELLD.wordsFor(w,sl.k,part,w===1?cnt*3:cnt,seed)||[]}catch(e){console.warn('[spell-adv]',e)}
 if(w===1){const sh=list.filter(x=>x.w.length<=4);list=(sh.length>=cnt?sh:sh.concat(list.filter(x=>x.w.length>4))).slice(0,cnt)}
 else list=list.slice(0,cnt);
 if(!list.length)list=FALL.slice(0,cnt).map(x=>({w:x,s:''}));
 return list.map(x=>({w:String(x.w).toLowerCase(),s:x.s||'',miss:0,retry:false}))}

function classic(n){
 primeVoices();
 const i=P.i,s=P.s,sl=K.slot(i)||{w:1,k:0,kind:'learn',g:0},st=(S.streams&&S.streams.spell)||{};
 const rn=(+st.rn||0);st.rn=rn+1;
 const md=mode(sl,s),boss=sl.kind==='boss',w1=sl.w===1;
 const R={md,boss,w1,sl,q:pickWords(sl,s,n+'|'+rn),k:0,pos:0,phase:'off',vis:false,combo:0,typed:0,right:0,res:[],timers:[],noSpeech:!hasSpeech()};
 R.len=R.q.length;R.cleared=0;
 P.sp=R;P.mist=new Set();P.combo=0;P.start=performance.now();P.last=performance.now();P.tier=null;P.maxCombo=0;
 const foeI=P.i+'-'+formNow(P.i),[fi,ff]=foeI.split('-').map(Number);P.fi=fi;P.ff=ff;
 const name=SPECIES[fi].n[ff],vname=villainName(P.i,boss);
  $q('#arena').innerHTML=`${scn()}<div class="bubble" id="bubble"></div><div class="hero" id="hero">${zookSVG()}</div><div class="foe" id="foe"><div class="cage">${creatureSVG(fi,ff,'px',null)}</div></div><div class="villain ${boss?'boss':''}" id="vil">${villainSVG(P.i,boss)}</div>
 <div class="fmeter"><span class="fname">${vname}</span><div class="bar"><i id="fbar" style="width:100%"></i></div><span class="flab">Free ${name}!</span></div>
 ${md!=='look'?`<div id="spcue"><button class="sphearb" id="sphear" data-act="spHear2" aria-label="Hear the word again" title="Hear it again"><img src="${speakerURL()}" alt=""></button><span class="tk">TAB</span><span class="tx"></span></div>`:''}`;
 try{$q('#strip').classList.remove('shake')}catch(e){}
 P.phase='play';P.onKey=(ch,caps)=>onKey(R,ch,caps);
 say(boss?'Spelling Bee!':md==='look'?'Look, cover, type!':md==='hear'?'Listen and spell!':`Save ${name}!`);
 const go=()=>{if(!alive(R))return;if(typeof SPLASH!=='undefined'&&SPLASH){R.timers.push(setTimeout(go,150));return}load(R)};   // the lesson splash must be gone before the first word
 R.timers.push(setTimeout(go,w1?300:700))}

const alive=R=>P&&P.sp===R&&P.stream==='spell'&&screen==='play'&&P.phase==='play';
const cur=R=>R.q[R.k];
function later(R,ms,f){R.timers.push(setTimeout(()=>{if(alive(R))f()},ms))}
function clearT(R){R.timers.forEach(clearTimeout);R.timers=[]}

/* ---------- BRIEF LOOK: how long the word is shown before it is covered (world 1 keeps it visible: copying is the skill there) ---------- */
function flashMs(R,it){const w=R.sl.w,n=it.w.length,t=w<=3?[2000,150]:w<=7?[1200,100]:[800,80];return Math.round(t[0]+t[1]*n)}
function startFlash(R){if(R.phase!=='listen')return;clearT(R);const it=cur(R);R.phase='show';R.vis=true;R.flash=true;draw(R);say('Look!');
 try{setTarget(null);$q('#fhint').innerHTML='<span class="splook">SPACE: cover it</span>'}catch(e){}
 later(R,flashMs(R,it),()=>cover(R))}
function listenThenFlash(R,it,delay){   // say the word, then flash it briefly once the speaking has ended
 R.phase='listen';R.flash=true;R.vis=false;draw(R);try{setTarget(null);$q('#fhint').innerHTML=''}catch(e){}
 if(R.noSpeech||!voiceOn()){later(R,delay,()=>startFlash(R));return}   // no sound: flash the word right away
 const tok=R.tok=(R.tok||0)+1;
 later(R,delay,()=>sayWord(it,false,()=>{if(alive(R)&&R.tok===tok&&R.phase==='listen')startFlash(R)}));
 later(R,delay+9000,()=>{if(R.tok===tok&&R.phase==='listen')startFlash(R)})}

/* ---------- visual for everything spoken: the example sentence with the word blanked (or blanks + letter count when there is no sentence) ---------- */
function blankSentence(it){
 const w=it.w,sent=sentOf(it),blanks='_'.repeat(w.length);
 if(sent){const esc1=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  let re=new RegExp('\\b'+esc1(w)+'\\b','i');
  if(!re.test(sent)){const st=w.length>4?w.slice(0,w.length-1):w;re=new RegExp('\\b'+esc1(st)+'[a-z]*','i')}   // inflected form in the sentence
  if(re.test(sent))return{html:esc(sent).replace(new RegExp(re.source,'i'),()=>'<b>'+blanks+'</b>')}}
 return{html:'<b>'+[...blanks].join(' ')+'</b>'}}
function cueSet(R){const el=$q('#spcue');if(!el)return;const it=cur(R);if(!it)return;const t=el.querySelector('.tx');if(t)t.innerHTML=blankSentence(it).html}
function cuePulse(){const el=$q('#spcue');if(!el)return;el.classList.add('pulse');clearTimeout(cuePulse.t);cuePulse.t=setTimeout(()=>el.classList.remove('pulse'),voiceOn()?2500:600)}

/* ---------- one word ---------- */
function load(R){
 if(R.k>=R.q.length)return end(R);
 const it=cur(R);it.miss=0;R.pos=0;R.rev=false;R.helpPos=-1;clearT(R);cueSet(R);
 if(R.md==='look'&&!R.w1){                                  // show it, then cover it
  R.phase='show';R.vis=true;R.flash=true;draw(R);say(it.retry?'Once more!':'Look!');
  $q('#fhint').innerHTML='<span class="splook">SPACE: cover it</span>';try{setTarget(null)}catch(e){}
  later(R,flashMs(R,it),()=>cover(R))}
 else if(!R.w1){R.vis=false;say(R.boss?'Spell it!':'Listen!');listenThenFlash(R,it,350)}
 else{R.phase='type';R.vis=R.w1||R.noSpeech;draw(R);target(R);
  if(R.md!=='look'&&!R.noSpeech){say(R.boss?'Spell it!':'Listen!');later(R,350,()=>sayWord(it))}
  else if(R.w1){say(it.retry?'Once more!':'Type it!');later(R,250,()=>sayParts([[PRON[it.w]||it.w,.8]]))}
  else say('Type it!')}}
function cover(R){if(R.phase!=='show')return;clearT(R);R.phase='type';R.vis=false;R.flash=false;draw(R);target(R);say('Now type it!')}
function target(R){const it=cur(R),c=it&&it.w[R.pos];
 if(!R.w1&&R.phase==='type'&&!R.vis&&R.helpPos!==R.pos){try{setTarget(null);$q('#fhint').innerHTML=''}catch(e){}return}   // world 2+: no key/finger hint while the word is covered (that would be copying); it comes back as help after a miss on this letter
 try{if(c!=null){setTarget(c);$q('#fhint').innerHTML=fingerHTML(c)}else{setTarget(null);$q('#fhint').innerHTML=''}}catch(e){}}

/* strip: one letter per box. Hidden letters show as _ (typed ones as a dot in a covered LOOK word, as the letter in HEAR / Bee) */
function draw(R){
 const it=cur(R);if(!it)return;const box=$q('#stripIn');if(!box)return;
 const showAll=R.vis||R.phase==='done';
 box.innerHTML=[...it.w].map((c,k)=>{
  const done=k<R.pos||R.phase==='done';
  let cl='',tx;
  if(showAll)tx=esc(c);
  else if(done&&R.md!=='look')tx=esc(c);
  else if(done){tx='•';cl='spdot'}
  else{tx='_';cl='sph'}
  if(done)cl+=(it.miss?' fix':' ok');
  if(R.phase==='type'&&k===R.pos&&R.pos<it.w.length)cl+=' cur';
  return `<span class="${cl}" style="${R.phase==='type'&&k===R.pos?'--fc:'+fcol(keyInfo(c).f):''}">${tx}</span>`}).join('');
 center(R);hudBits(R)}
function center(R){
 try{if(document.body.classList.contains('lines2'))return;const box=$q('#stripIn'),w=$q('#strip').clientWidth,sp=box.children;if(!sp.length)return;
  const el=box.querySelector('.cur')||sp[Math.min(R.pos,sp.length-1)];
  const mid=R.phase==='type'&&el?el.offsetLeft+el.offsetWidth/2:(sp[0].offsetLeft+sp[sp.length-1].offsetLeft+sp[sp.length-1].offsetWidth)/2;
  box.style.transform=`translateX(${w/2-mid}px)`}catch(e){}}
function hudBits(R){try{const acc=R.typed?Math.round(R.right/R.typed*100):100;$q('#h-acc').textContent=acc+'%';$q('#h-cmb').textContent=R.combo;
 $q('#fbar').style.width=(100-R.cleared/R.len*100)+'%'}catch(e){}}

/* ---------- keys ---------- */
function onKey(R,ch,caps){
 if(!alive(R)||P.sp!==R)return;
 P.last=performance.now();
 if(R.phase==='show'){if(ch===' ')cover(R);return}
 if(R.phase==='listen'){if(ch===' ')startFlash(R);return}
 if(R.phase!=='type')return;
 if(!ch||ch.length!==1)return;
 const it=cur(R),want=it.w[R.pos];if(want==null)return;
 try{pressFx(ch===' '?'space':ch.toLowerCase())}catch(e){}
 if(ch===' ')return;
 R.typed++;
 if(matchKey(ch,want,caps)){
  R.right++;R.pos++;R.combo++;P.maxCombo=Math.max(P.maxCombo||0,R.combo);
  const big=R.pos>=it.w.length;
  try{zap(fcol(keyInfo(want).f),false);sfx.ok(R.combo)}catch(e){}
  if(R.w1&&SND[want]&&S.set&&S.set.voice&&typeof speak==='function'&&!big){try{speak(SND[want])}catch(e){}}
  if(big)return wordDone(R);
  draw(R);target(R)}
 else{
  it.miss++;R.combo=0;R.helpPos=R.pos;
  try{sfx.bad();kick($q('#vil'),'laugh');const s=$q('#strip');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');splat()}catch(e){}
  if(it.miss>=2&&!R.rev){R.rev=true;R.vis=true;say('Here it is!',true)}
  else say('Try again!',true);
  draw(R);target(R)}}
function again(R,slow){const it=cur(R);if(it)sayWord(it,slow)}
function splat(){const a=$q('#arena'),v=$q('#vil');if(!a||!v)return;const ar=a.getBoundingClientRect(),r=v.getBoundingClientRect();
 const e=document.createElement('i');e.className='spsplat';e.style.left=Math.round(r.left-ar.left+r.width*.3)+'px';e.style.top=Math.round(r.top-ar.top+r.height*.45)+'px';a.appendChild(e);setTimeout(()=>e.remove(),700)}

function wordDone(R){
 const it=cur(R),perfect=it.miss===0,w=it.w;R.phase='done';R.vis=true;draw(R);
 try{setTarget(null);$q('#fhint').innerHTML='';zap(fcol(keyInfo(w[w.length-1]).f),true);sfx.super()}catch(e){}
 try{kick($q('#vil'),'hit');burst($q('#arena'),$q('#vil'),'#f0c860',perfect?14:8)}catch(e){}
 if(!it.retry){
  R.res.push(perfect);R.cleared++;
  if(!perfect){                                                 // revisit it a few words later; it goes on the Tricky list
   R.q.splice(Math.min(R.k+3,R.q.length),0,{w,s:it.s,miss:0,retry:true});
   try{const T=(S.spell=S.spell||{}).tricky=(S.spell&&S.spell.tricky)||{};T[w]={left:3,miss:((T[w]&&T[w].miss)||0)+1}}catch(e){}}}
 say(perfect?(it.retry?'You got it!':'Zap!'):'Got it!');
 hudBits(R);
 if(R.w1)sayParts([[PRON[w]||w,.8]]);
 later(R,perfect?800:1300,()=>{R.k++;load(R)})}

function end(R){
 R.phase='fin';clearT(R);
 const len=R.len,ok=R.res.filter(Boolean).length;
 try{say('Great spelling!')}catch(e){}
 try{if(hasSpeech()&&voiceOn())speechSynthesis.cancel()}catch(e){}
 setTimeout(()=>{if(P&&P.sp===R){P.phase='play';P.onKey=null;K.finishClassic({len,ok,secs:Math.max(1,(performance.now()-P.start)/1000)})}},500)}

/* ---------- hear again: Tab key or the speaker button ---------- */
/* Tab = hear it again; in worlds 2+ the FIRST Tab per word also re-flashes the word (a "peek"): free in worlds 2-3, a small accuracy cost from world 4 */
function hearAgain(peekOK){const R=P&&P.sp;if(!R||P.stream!=='spell'||screen!=='play'||R.phase!=='type')return;
 const it=cur(R);if(!it)return;const canPeek=peekOK&&!R.w1&&!it.peeked&&!R.rev;
 try{
  if(canPeek){it.peeked=true;if(R.sl.w>=4){R.typed++;hudBits(R)}
   if(R.md==='look'||R.noSpeech){R.phase='listen';startFlash(R);return}
   listenThenFlash(R,it,60);return}
  if(R.md==='look'||R.noSpeech)return;
  again(R)}catch(e){}}
ACT.spHear2=()=>{hearAgain(false);try{document.activeElement&&document.activeElement.blur()}catch(e){}};
addEventListener('keydown',e=>{
 try{if(e.key!=='Tab'||e.ctrlKey||e.metaKey||e.altKey)return;
  if(!P||P.stream!=='spell'||screen!=='play'||!P.sp)return;
  const m=$q('#modal');if(m&&!m.hidden)return;if(typeof SPLASH!=='undefined'&&SPLASH)return;
  e.preventDefault();if(!e.repeat)hearAgain(true)}catch(err){}},true);

/* ---------- register ---------- */
K.register({id:'spell',name:'Spell',kbd:'letters',regionDesc:REGION,topicFor,
 title:(topic,sl)=>{try{const t=SPELLD.topic(topic);return t&&t.title?t.title:'Spell '+(sl.n+1)}catch(e){return 'Spell '+(sl.n+1)}},
 classic,
 runnerCfg:(i,s)=>window.RUNNER_SPELL&&RUNNER_SPELL.cfg?RUNNER_SPELL.cfg(i,s):null,
 bossCfg:i=>window.RUNNER_SPELL&&RUNNER_SPELL.bossCfg?RUNNER_SPELL.bossCfg(i):null});
})();
