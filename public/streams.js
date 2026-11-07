/* Keyloria Kingdom: STREAMS (Typing / Math / Spelling) - Phase A framework.
   One game, three subjects. All streams share the heroes, Keylori, Scramblers, worlds, diamonds, XP, outfits, badges and the Lesson Quests map.
   A stream only swaps (a) the CONTENT of LESSONS[i] and (b) the progress maps, so every existing function (stars, formNow, cards, evolution,
   badges, map, boss detection, runner-lesson record) keeps working unchanged. Typing is the default and behaves exactly as before.

   ===================== REGISTRY CONTRACT (window.KKS) =====================
   KKS.register({
     id:'math'|'spell',                 // required
     name:'Math',                       // shown on results/placeholder (tabs read TYPE / MATH / SPELL)
     kbd:'digits'|'letters',            // which keys the stream types (informational)
     regionDesc:[12 strings],           // optional: one line per world (0..11), replaces the map's world descriptions
     topicFor(w,slot,kind)->topicId,    // w = world 1..12; slot = KKS.slot(i) (see below); kind = 'learn'|'review'|'boss'
     title(topicId,slot)->string,       // optional: map/hud title for a learn lesson (default: name+' '+(n+1)); Review/Boss keep the world's own title
     classic(n)->void,                  // build and run classic part n (n = i*8+s, ANY s 0..7: parts 2,4,6,8 come here too when runners are switched off).
                                        //   KKS.startClassic(n) has ALREADY done: closeModal, P={i,s,n,stream,phase:'off'}, show('play'), keyboard moved into
                                        //   #s-play, hud(), lesson splash. classic() sets P (keep i,s,n,stream), builds #arena (hero, #foe cage with P.fi/P.ff,
                                        //   #vil), sets P.phase='play' and P.onKey=(ch,caps)=>... (receives EVERY key while screen==='play': single chars,
                                        //   plus 'Backspace' and 'Enter'; Space is ' '). When the round ends call KKS.finishClassic({len,ok,acc?,stars?,secs?}).
     runnerCfg(i,s)->cfg|null,          // runner part (s = 1,3,5,7): cfg {stream,topic,name,n,v,lv,tier,keys,partS,...} (runner-lesson fills defaults); null = classic
     bossCfg(i)->cfg|null,              // hybrid boss chase after the Boss Test's classic part; null = the classic part only
   })
   KKS.cur                              // active stream id ('typing' default)         KKS.reg[id] = registered defs
   KKS.enter(id) / KKS.leave()          // swap the view (leave = back to 'typing'); KKS.set(id) = enter + remember in S.stream + save + redraw
   KKS.slot(i)->{w,k,kind,n,g,i}        // computed once from ORDER and the typing lessons' sp. w = world 1..12 (worldOf), kind 'learn'|'review'|'boss',
                                        //   k = content slot: learn 0..6 (clamped), review 7, boss 8 (what MATH.lesson / SPELLD.lesson expect), n = raw index among the
                                        //   group's learn lessons (can be 7 in a world with 8 learn lessons and no Review), g = group inside the world (World 1 has TWO
                                        //   groups, g 0 and 1: use g to make the second pass a little harder). Also handed to MATH.setSlotResolver
   KKS.topic(i)                         // topic id of lesson i in the active stream ('' for typing)
   KKS.finishClassic(res)               // shared finish: stars (95/85/60 accuracy unless res.stars), XP, diamonds, Keylori card/evolve/holo, badge, catch animation,
                                        //   results (Right n/m instead of WPM). In a Boss Test's classic part the hybrid boss chase starts instead.
                                        //   Never touches S.hist or S.ks (no WPM). Bump S.streams[id].rn yourself when a lesson restarts (seed variety).
   KKS.rec                              // runner-lesson record(i,s,info,x) (set by runner-lesson.js)
   KKS.startClassic(n)                  // the prepared classic part (runner-lesson fallbacks use it too)
   KKS.names / KKS.on(id)               // tab labels / is the stream switched on (grown-up switch, class lock)
   Save shape: S.stream ('typing'|'math'|'spell'), S.streams[id]={best,skip,btp,mast,runf,rn,done}. While a stream is active S.best/S.skip/S.btp/S.mast/S.runf
   POINT AT S.streams[id].*; save()/localBundle() always serialise the Typing objects (swapped back around the call).
   ========================================================================== */
(function(){
if(typeof S==='undefined'||typeof LESSONS==='undefined'||typeof show!=='function'||typeof startStage!=='function')return;
const K=window.KKS=window.KKS||{};
const ST=typeof NST!=='undefined'?NST:8;
const IDS=['typing','math','spell'];
K.reg=K.reg||{};K.cur='typing';
K.names={typing:'Type',math:'Math',spell:'Spell'};
const KEYS=['best','skip','btp','mast','runf'];
/*SLOTMAP*/
/* ONE shared Keylori collection, OFFSET PER SUBJECT: a lesson's creature is slot (i + k*floor(n/3)) mod n, k = 0 Typing, 1 Math, 2 Spelling,
   so Math starts a third of the way through the creature list and Spelling two thirds (wrapping). Cards are stored under the SLOT, so the
   collection, "you're back" and No. 00N are all the real creature. Typing is unchanged (k = 0). */
const SLOT_K={typing:0,math:1,spell:2};
function slotFor(stream,i,n){const k=SLOT_K[stream]||0;i=+i;if(!k||!(n>0)||!(i>=0)||i>=n)return i;return (i+k*Math.floor(n/3))%n}
function slotBack(stream,j,n){const k=SLOT_K[stream]||0;j=+j;if(!k||!(n>0)||!(j>=0)||j>=n)return j;return (j-k*Math.floor(n/3)%n+n)%n}
/*ENDSLOTMAP*/
const NL=()=>LESSONS.length;
K.slotFor=(id,i)=>slotFor(id,i,NL());
const $q=(s,r)=>(r||document).querySelector(s);

/* ---------- is a stream switched on (grown-up switch, class focus lock) ---------- */
const on=id=>{if(id==='typing')return true;try{return typeof parOn==='function'?!!parOn(id):true}catch(e){return true}};
K.on=on;
const avail=()=>IDS.filter(on);

/* ---------- registry ---------- */
const META={typing:{id:'typing',name:'Type',kbd:'letters'},math:{id:'math',name:'Math',kbd:'digits'},spell:{id:'spell',name:'Spell',kbd:'letters'}};
function placeholder(id){const m=META[id]||{id,name:id};
 return Object.assign({placeholder:true,topicFor:()=>'',runnerCfg:()=>null,bossCfg:()=>null,classic:function(n){
  P.phase='wait';
  modal(`<h2>${esc(m.name)}</h2><div class="strmph">${icon(id,6)}</div><div class="rbtns"><button class="btn big nextbtn" data-act="go" data-to="map">OK</button></div>`)}},m)}
K.def=id=>K.reg[id]||placeholder(id);
K.register=function(def){
 if(!def||!def.id||def.id==='typing')return;
 K.reg[def.id]=Object.assign({runnerCfg:()=>null,bossCfg:()=>null,topicFor:()=>''},META[def.id]||{},def);K.names[def.id]=def.name||K.names[def.id]||def.id;
 if(K.cur===def.id){try{overlay(def.id)}catch(e){console.warn('[streams]',e)}}
 try{redraw()}catch(e){}};

/* ---------- slots: where each lesson sits in its world (computed once) ---------- */
let SL=null;
function slots(){
 if(SL)return SL;SL={};
 const ord=window.ORDER||LESSONS.map((_,i)=>i),byW={},src=K.orig||LESSONS;
 ord.forEach(i=>{const w=worldOf(i);(byW[w]=byW[w]||[]).push(i)});
 Object.entries(byW).forEach(([w,list])=>{
  const gids=[];list.forEach(i=>{const o=src[i],gid=o&&(o.grp!=null?o.grp:o.r);if(!gids.includes(gid))gids.push(gid)});
  const n={};
  list.forEach(i=>{const o=src[i],sp=o&&o.sp,gid=o&&(o.grp!=null?o.grp:o.r),kind=sp==='x9b'?'boss':sp==='x9r'?'review':'learn',g=gids.indexOf(gid);
   const nn=kind==='learn'?(n[gid]=(n[gid]==null?0:n[gid]+1)):0;
   SL[i]={w:+w,k:kind==='boss'?8:kind==='review'?7:Math.min(6,nn),kind,n:nn,g,i}})});
 return SL}
K.slot=i=>slots()[i]||null;
K.world=i=>{try{return worldOf(i)}catch(e){return 1}};
K.runnerCfg=(i,s)=>{try{return K.def(K.cur).runnerCfg(i,s)||null}catch(e){console.warn('[streams runnerCfg]',e);return null}};
K.bossCfg=i=>{try{return K.def(K.cur).bossCfg(i)||null}catch(e){console.warn('[streams bossCfg]',e);return null}};
K.topic=i=>(LESSONS[i]&&LESSONS[i].topic)||'';

/* ---------- save: per-stream progress namespace ---------- */
function ensure(id){
 S.streams=S.streams&&typeof S.streams==='object'?S.streams:{};
 const st=S.streams[id]=S.streams[id]&&typeof S.streams[id]==='object'?S.streams[id]:{};
 st.best=st.best||{};st.btp=st.btp||{};st.mast=st.mast||{};st.runf=st.runf||{};
 st.skip=+st.skip||0;st.rn=+st.rn||0;st.done=+st.done||0;
 return st}
let TP={};   // the Typing objects while a stream view is active
let CPX=null;
function cardsProxy(real,id){   // lesson-keyed view of the shared collection: "i-f" reads and writes the card of slot(i)-f
 const n=NL(),KR=/^(\d+)-(\d+)$/,fw=k=>{if(typeof k!=='string')return k;const m=KR.exec(k);return m?slotFor(id,m[1],n)+'-'+m[2]:k},bw=k=>{if(typeof k!=='string')return k;const m=KR.exec(k);return m?slotBack(id,m[1],n)+'-'+m[2]:k};
 return new Proxy(real,{get:(t,k)=>t[fw(k)],set:(t,k,v)=>{t[fw(k)]=v;return true},has:(t,k)=>fw(k) in t,deleteProperty:(t,k)=>delete t[fw(k)],
  ownKeys:t=>Reflect.ownKeys(t).map(bw),getOwnPropertyDescriptor:(t,k)=>{const d=Object.getOwnPropertyDescriptor(t,fw(k));if(d)d.configurable=true;return d},
  defineProperty:(t,k,d)=>{Object.defineProperty(t,fw(k),d);return true}})}
function toStream(id){   // typing view -> stream view (progress maps only; the card collection is shared, viewed through the slot offset)
 const st=ensure(id);
 KEYS.forEach(k=>{TP[k]=S[k]});
 KEYS.forEach(k=>{S[k]=st[k]});
 if(S.cards&&typeof S.cards==='object'){TP.cards=S.cards;CPX=cardsProxy(S.cards,id);S.cards=CPX}}
function toTyping(){     // stream view -> typing view (progress maps only); S.streams[cur] keeps whatever the maps hold now
 const st=S.streams&&S.streams[K.cur];
 if(st)KEYS.forEach(k=>{if(k==='skip')st.skip=+S.skip||0;else if(S[k]&&typeof S[k]==='object')st[k]=S[k]});
 KEYS.forEach(k=>{if(TP[k]===undefined)delete S[k];else S[k]=TP[k]});
 if(TP.cards&&S.cards===CPX)S.cards=TP.cards;CPX=null;TP={}}

/* ---------- creature view: while Math / Spelling is shown, SPECIES / art / evolution arrays are rotated by the subject's offset ---------- */
let ROT=null,ROTID='',QUIET=0;
const clearKKC=()=>{try{Object.keys(KKC).forEach(k=>{if(/^[ekKs]\d+-/.test(k)||/^e\d/.test(k))delete KKC[k]})}catch(e){}};
function unrotate(){
 if(!ROT){ROTID='';return}
 const R=ROT;ROT=null;ROTID='';
 for(let i=0;i<R.sp.length;i++){SPECIES[i]=R.sp[i];KKDATA.order[i]=R.ord[i];EVO[i]=R.evo[i];if(R.fl)EVOLUTION_FLAVOR[i]=R.fl[i]}
 clearKKC()}
function rotate(id){
 if(ROTID===id)return;unrotate();if(!SLOT_K[id])return;
 const n=Math.min(NL(),SPECIES.length);
 ROT={sp:SPECIES.slice(0,n),ord:KKDATA.order.slice(0,n),evo:EVO.slice(0,n),fl:typeof EVOLUTION_FLAVOR!=='undefined'?EVOLUTION_FLAVOR.slice(0,n):null};ROTID=id;
 for(let i=0;i<n;i++){const j=slotFor(id,i,NL());SPECIES[i]=ROT.sp[j];KKDATA.order[i]=ROT.ord[j];EVO[i]=ROT.evo[j];if(ROT.fl)EVOLUTION_FLAVOR[i]=ROT.fl[j]}
 clearKKC()}
const _ro=window.rarOf;
if(typeof _ro==='function')window.rarOf=i=>_ro(ROTID?slotFor(ROTID,i,NL()):i);
if(typeof cardHTML==='function'){const _ch=cardHTML;      // the card number (No. 00N) is the real slot's, not the lesson's
 cardHTML=function(i,f,o){const h=_ch.apply(this,arguments);
  if(!ROTID||(o&&o.locked))return h;
  const pad=x=>String(x).padStart(3,'0'),a=pad(i*3+f+1),b=pad(slotFor(ROTID,i,NL())*3+f+1);
  return a===b?h:h.split('c-no">'+a+'<').join('c-no">'+b+'<').split('No. '+a+' ').join('No. '+b+' ')}}
/* existing saves: lessons already passed in Math / Spelling get their (new) creature in the collection, never losing the old cards */
function backfillCards(id){
 try{const best=S.best||{},seen={};
  for(const k in best){if(!(best[k]>0))continue;const i=+k.split('-')[0];if(seen[i]||!(i>=0&&i<NL()))continue;seen[i]=1;
   const f1=formNow(i);for(let f=0;f<=f1;f++){const ck=i+'-'+f;if(!S.cards[ck])S.cards[ck]={holo:false}}}}catch(e){console.warn('[streams backfill]',e)}}

/* tips on the results screen: Typing's tips only mention eyes, posture and fingers */
const TIPS_STREAM={math:['Slow is OK! Take your time.','Count it out if you get stuck.','Mistakes help you learn!','Check your answer before you go.'],
 spell:['Say the word out loud.','Slow is OK! Take your time.','Look at each letter, one by one.','Mistakes help you learn!']};
let TIPS_T=null;
function setTips(id){try{if(typeof TIPS==='undefined')return;if(!TIPS_T)TIPS_T=TIPS.slice();const src=TIPS_STREAM[id]||TIPS_T;TIPS.length=0;src.forEach(t=>TIPS.push(t))}catch(e){}}

/* ---------- lesson overlay ---------- */
let RD=null,RN=null;
const NEUT0='Keyloria Meadow';   // region 0 is the typing "Home Row Meadow"; Math / Spelling are not about rows
function overlay(id){
 const def=K.def(id);K.orig=K.orig||LESSONS.slice();slots();
 LESSONS.forEach((_,i)=>{
  const o=K.orig[i],sl=K.slot(i);if(!o)return;
  let topic='',t=o.t;
  if(sl){try{topic=def.topicFor(sl.w,sl,sl.kind)||''}catch(e){console.warn('[streams topicFor]',e)}
   if(sl.kind==='learn'){let nt=null;try{nt=def.title?def.title(topic,sl):null}catch(e){}t=nt||((def.name||id)+' '+(sl.n+1))}}
  if(sl&&sl.kind!=='learn'&&typeof t==='string')t=t.split('Home Row Meadow').join(NEUT0);
  const e={k:'',r:o.r,t,str:id,topic};if(o.sp)e.sp=o.sp;if(o.grp!=null)e.grp=o.grp;if(o.src!=null)e.src=o.src;if(o.bt)e.bt=o.bt;
  LESSONS[i]=e});
 try{RD=RD||REGIONS.map(r=>r.desc);REGIONS.forEach((r,k)=>{const d=def.regionDesc&&def.regionDesc[worldOfRegion(k)-1];r.desc=d||''})}catch(e){}
 try{RN=RN||REGIONS.map(r=>r.name);if(REGIONS[0]&&RN[0]==='Home Row Meadow')REGIONS[0].name=NEUT0}catch(e){}
 setTips(id)}
function unoverlay(){
 if(K.orig)LESSONS.forEach((_,i)=>{if(K.orig[i])LESSONS[i]=K.orig[i]});
 try{if(RD)REGIONS.forEach((r,k)=>{r.desc=RD[k]})}catch(e){}
 try{if(RN)REGIONS.forEach((r,k)=>{r.name=RN[k]})}catch(e){}
 setTips('typing')}

K.enter=function(id){
 if(!id||!IDS.includes(id))id='typing';
 if(id===K.cur)return;
 if(K.cur!=='typing')K.leave();
 if(id==='typing')return;
 K.orig=K.orig||LESSONS.slice();
 toStream(id);overlay(id);K.cur=id;
 if(!QUIET){rotate(id);backfillCards(id)}};
K.leave=function(){
 if(K.cur==='typing')return;
 toTyping();unoverlay();K.cur='typing';
 if(!QUIET)unrotate()};
const view=id=>{try{(id&&id!=='typing'&&on(id)?K.enter(id):K.leave());if(!QUIET){if(K.cur==='typing')unrotate();else rotate(K.cur)}}catch(e){console.error('[streams]',e);try{K.leave()}catch(_){}}};

/* ---------- redraw ---------- */
function redraw(){try{if(typeof screen!=='undefined'){if(screen==='home')renderHome();else if(screen==='map')renderMap()}}catch(e){console.warn('[streams]',e)}}
K.set=function(id){
 if(!IDS.includes(id)||!on(id))id='typing';
 view(id);S.stream=id;try{save()}catch(e){}
 try{sfx.click()}catch(e){}redraw()};
const focusStart=()=>setTimeout(()=>{const b=$q('#s-home .hbtns .btn.big');b&&b.focus({preventScroll:true})},0);
ACT.stream=d=>{K.set(d&&d.id);if(screen==='home')focusStart()};

/* ---------- wrappers: save / localBundle / mergeBundle / load ---------- */
const _save=save;
save=function(){
 if(K.cur==='typing')return _save.apply(this,arguments);
 const id=K.cur;toTyping();
 try{return _save.apply(this,arguments)}finally{toStream(id)}};
const _lb=localBundle;
localBundle=function(){
 if(K.cur==='typing')return _lb.apply(this,arguments);
 const id=K.cur;toTyping();
 try{const b=_lb.apply(this,arguments);if(b&&b.saves&&PROF&&b.saves[PROF.cur]===S)b.saves[PROF.cur]=JSON.parse(JSON.stringify(S));return b}   // a snapshot: S itself is swapped forward again below
 finally{toStream(id)}};
if(typeof mergeBundle==='function'){const _mb=mergeBundle;
 mergeBundle=function(r){
  const had=K.cur;K.leave();
  try{return _mb.apply(this,arguments)}
  finally{view(S.stream||had)}};
 window.mergeBundle=mergeBundle}
const _ld=load;
load=function(){
 if(K.cur!=='typing'){unoverlay();K.cur='typing';TP={};CPX=null}   // the old S is gone: nothing to swap back into
 try{unrotate()}catch(e){}
 const r=_ld.apply(this,arguments);
 try{view(S.stream)}catch(e){}
 return r};

/* ---------- show: home/map follow the chosen stream; every Typing-only screen sees Typing ---------- */
const TYPING_ONLY=new Set(['arcade','binder','shop','parents','game','spell']);
const _show=show;
show=function(id){
 try{if(id==='home'||id==='map')view(S.stream);else if(TYPING_ONLY.has(id))K.leave()}catch(e){console.error('[streams]',e)}
 return _show.apply(this,arguments)};

/* ---------- Math / Spelling story: same lore (Scramblers, Keystone), told in a few basic words ---------- */
const SSTORY={
 math:{intro:['The Scramblers jumbled all the numbers!','The Keylori are stuck in the Keystone.','Solve to save the Keylori!'],taunt:['Hee hee! I mixed up the numbers!','Solve them all if you can!']},
 spell:{intro:['The Scramblers mixed up all the letters!','The Keylori are stuck in the Keystone.','Spell to save the Keylori!'],taunt:['Hee hee! I mixed up the letters!','Spell them all if you can!']}};
function seenOf(id){const st=ensure(id);const v=st.sv=st.sv&&typeof st.sv==='object'?st.sv:{};v.i=v.i||{};v.t=v.t||{};return v}
/* ---------- starting a part ---------- */
const _ss=startStage;
startStage=function(n,mode){
 try{
  if(mode){K.leave();return _ss.apply(this,arguments)}                  // practice / placement / code course are Typing things
  const id=S.stream;
  if(!id||id==='typing'||!on(id)){K.leave();return _ss.apply(this,arguments)}
  K.enter(id);
  const i=Math.floor(n/ST),s=n%ST,rl=K.rl;
  try{if(typeof STORY!=='undefined'&&typeof cutscene==='function'){                     // Math / Spelling have their own short intro and boss taunt (seen once per subject)
   const w=worldOf(i),sv=seenOf(id),SS=SSTORY[id];
   if(STORY[w-1]&&SS&&!sv.i[w]){sv.i[w]=1;save();if(w===1)return cutscene(w,SS.intro,'intro',()=>startStage(n))}
   if(STORY[w-1]&&SS&&i===worldLast(w)&&s===7&&!sv.t[w]){sv.t[w]=1;save();return cutscene(w,SS.taunt,'taunt',()=>startStage(n))}}}catch(e){console.warn('[streams story]',e)}
  if(rl&&rl.enabled()){                                                 // runner parts and the hybrid Boss Test go through runner-lesson (it asks KKS.runnerCfg/bossCfg)
   if(rl.isBossT(i)){if(rl.cfgFor(i))return _ss.apply(this,arguments)}
   else if(rl.isRunnerPart(n)&&rl.cfgForPart(i,s))return _ss.apply(this,arguments)}
  return K.startClassic(n);
 }catch(e){console.error('[streams]',e);try{K.leave()}catch(_){}return _ss.apply(this,arguments)}};
K.startClassic=function(n){
 const id=K.cur,def=K.def(id),i=Math.floor(n/ST),s=n%ST;
 try{closeModal()}catch(e){}
 P={i,s,n,stream:id,phase:'off'};
 show('play');$('#s-play').appendChild($('#kbwrap'));hud();
 try{$('#stripIn').innerHTML='';$('#fhint').innerHTML='';setTarget(null);setAvail(new Set(),false)}catch(e){}
 try{if(!def.placeholder&&LESSONS[i]&&(s===0||S.lastLesson!==i))lessonSplash(i);if(LESSONS[i])S.lastLesson=i}catch(e){}
 def.classic(n)};

/* ---------- keys: the stream round gets every key (Backspace and Enter too) ---------- */
const _in=input;
input=function(ch,caps){
 if(typeof P!=='undefined'&&P&&P.stream&&screen==='play'&&typeof P.onKey==='function'){try{P.onKey(ch,caps)}catch(e){console.error('[streams]',e)}return}
 return _in.apply(this,arguments)};
addEventListener('keydown',e=>{
 try{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
  const m=$q('#modal');
  if(m&&!m.hidden){                                                          // an open pop-up takes the key first: Space / Enter press its primary button (chase, results ...)
   if(screen==='play'&&P&&P.stream&&(e.key===' '||e.key==='Enter')&&!$q('#lvlfx')&&!$q('#evoBtns')&&!$q('#mbox #flip')){
    const b=$q('#mbox .rbtns .nextbtn')||$q('#mbox .rbtns .btn');
    if(b&&!b.disabled){e.preventDefault();e.stopImmediatePropagation();b.click()}}
   return}
  if(screen==='play'&&P&&P.stream&&typeof P.onKey==='function'){
   if(typeof SPLASH!=='undefined'&&SPLASH)return;
   if(e.key==='Backspace'||e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();P.onKey(e.key,false)}
   return}
  if(screen==='home'&&S.name&&(e.key===' '||e.key==='Enter')&&(t===document.body||!t||t.closest&&t.closest('.stile.on'))){   // Space = start the chosen subject
   const b=$q('#s-home .hbtns .btn.big');if(b){e.preventDefault();e.stopImmediatePropagation();b.click()}return}
  if(screen==='home'&&avail().length>1){                                  // subject switch: arrows or 1-3
   const a=avail();let j=a.indexOf(S.stream||'typing');if(j<0)j=0;
   if(e.key==='ArrowRight')j=(j+1)%a.length;else if(e.key==='ArrowLeft')j=(j+a.length-1)%a.length;
   else if(/^[1-3]$/.test(e.key)&&IDS[+e.key-1]&&on(IDS[+e.key-1]))j=a.indexOf(IDS[+e.key-1]);
   else return;
   e.preventDefault();K.set(a[j]);focusStart()}
 }catch(err){console.warn('[streams key]',err)}},true);

/* ---------- finish: the shared twin of finish() for stream classic rounds (no WPM, no S.hist, no S.ks) ---------- */
K.finishClassic=function(res){
 res=res||{};
 const len=Math.max(1,(res.len|0)||1),ok=Math.max(0,Math.min(len,res.ok==null?len:res.ok|0));
 const acc=res.acc!=null?Math.round(res.acc):Math.round(ok/len*100);
 const secs=res.secs||(P.start?(performance.now()-P.start)/1000:Math.max(1,len*2));
 try{if(K.hybridDone&&K.hybridDone({len,ok,secs}))return}catch(e){console.error(e)}
 P.phase='done';try{clearInterval(P.idle)}catch(e){}try{setTarget(null)}catch(e){}
 P.mist=P.mist||new Set();P.fi=P.fi==null?P.i:P.fi;if(P.ff==null)P.ff=formNow(P.i);P.rightTxt=ok+'/'+len;
 S.time+=Math.round(secs);try{sessionSecs+=secs}catch(e){}S.rounds++;
 const stars=res.stars!=null?res.stars:acc>=95?3:acc>=85?2:acc>=60?1:0,pass=stars>=1;
 const oldL=levelOf(S.xp);let xp=len+(pass?20*stars:5),gems=0,newCard=false,holoUp=false,badge=null,tierUp=null,tierF=null,evo=null,lucky=null,evoFrom=P.ff,holoF=null,holoForms=[];
 if(pass){const k=sk(P.i,P.s),prev=S.best[k]||0;gems=Math.max(0,stars-prev)*2+(prev===0?1:0);
  const f0=formNow(P.i);S.best[k]=Math.max(prev,stars);const f1=formNow(P.i),ck=P.i+'-'+f0;
  if(!S.cards[ck]){S.cards[ck]={holo:false};newCard=true}
  if(P.tier&&better(P.tier,S.cards[ck].tier)){S.cards[ck].tier=P.tier;tierUp=P.tier;tierF=f0}
  for(let f=f0+1;f<=f1;f++){const nk=P.i+'-'+f;if(!S.cards[nk])S.cards[nk]={holo:false};evo=f}
  if(evo!=null)P.ff=evo;
  [0,1,2].forEach(f=>{const c=S.cards[P.i+'-'+f];if(c&&!c.holo&&BAND[f].every(q=>(S.best[P.i+'-'+q]||0)===3)){c.holo=true;holoUp=true;holoF=f;holoForms.push(f)}});
  try{lucky=rollLucky(P.i);if(lucky&&lucky.gems)gems+=lucky.gems}catch(e){}
  try{const r=LESSONS[P.i].r;if(!S.badges.includes(r)&&regionDone(r)){S.badges.push(r);badge=REGIONS[r].name}}catch(e){}
  try{const st=S.streams&&S.streams[K.cur];if(st)st.done=(+st.done||0)+1}catch(e){}}
 S.xp+=xp;S.gems+=gems;
 let egg=null;try{egg=pass?dailyEgg():null}catch(e){}
 save();
 const newL=levelOf(S.xp);
 try{if(pass){$('#vil')?.classList.add('pop');burst($('#arena'),$('#vil'),'#f0c860',22);$('#foe')?.classList.add('friend');$('#hero')?.classList.add('cheer');sfx.win();say(`You saved ${SPECIES[P.fi].n[evoFrom]}!`)}
  else{$('#vil')?.classList.add('laugh');say('Try again! Go slow.')}}catch(e){}
 let brk=false;try{brk=takeBreak()}catch(e){}
 const R_={acc,wpm:0,stars,pass,xp,gems,newCard,holoUp,badge,lvl:newL>oldL?newL:0,egg,tierUp,tierF,brk,evo,evoFrom,lucky,holoF,holoForms};
 if(pass)setTimeout(()=>catchAnim(()=>results(R_)),1000);else setTimeout(()=>results(R_),900)};
const _fin=finish;
finish=function(){if(typeof P!=='undefined'&&P&&P.stream)return;return _fin.apply(this,arguments)};

/* ---------- results: Right n/m instead of the WPM box, no share button ---------- */
const _res=results;
results=function(r){
 const out=_res.apply(this,arguments);
 try{if(typeof P!=='undefined'&&P&&P.stream){const box=$q('#mbox');if(box){
  box.querySelectorAll('.rstats > div').forEach(d=>{const sp=d.querySelector('span');if(sp&&/Words per minute|WPM/i.test(sp.textContent))d.innerHTML=`<b>${esc(P.rightTxt||'')}</b><span>Right</span>`});
  box.querySelectorAll('[data-act=copyRun]').forEach(b=>b.remove())}}}catch(e){console.warn('[streams results]',e)}
 return out};

/* ---------- pixel icons: keyboard / numbers / ABC block (hard pixels, muted palette) ---------- */
const ICONS={};
const PAL={typing:['#7fd8d0','#2f8f8a'],math:['#f0c860','#b3850f'],spell:['#e89ac0','#a04c78']};
const FONT={'1':['.#.','##.','.#.','.#.','###'],'2':['###','..#','###','#..','###'],'3':['###','..#','.##','..#','###'],
 A:['.#.','#.#','###','#.#','#.#'],B:['##.','#.#','##.','#.#','##.'],C:['.##','#..','#..','#..','.##']};
const IW=19,IH=14;
function icon(id,sc){
 if(!ICONS[id]){
  const [cap,dk]=PAL[id]||['#cfc6e0','#8f86a8'],INK='#1a1030',KEY='#fff6e0';
  const c=document.createElement('canvas');c.width=IW;c.height=IH;const g=c.getContext('2d');
  g.fillStyle=INK;g.fillRect(0,0,IW,IH);g.fillStyle=cap;g.fillRect(1,1,IW-2,IH-4);g.fillStyle=dk;g.fillRect(1,IH-3,IW-2,2);
  g.fillStyle=KEY;g.fillRect(1,1,IW-2,1);
  [[0,0],[IW-1,0],[0,IH-1],[IW-1,IH-1]].forEach(([x,y])=>g.clearRect(x,y,1,1));
  const px=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  if(id==='typing'){
   [3,6,9,12,15].forEach(x=>px(x,3,2,2,KEY));[4,7,10,13].forEach(x=>px(x,6,2,2,KEY));px(5,9,9,2,KEY);
   [3,6,9,12,15].forEach(x=>px(x,5,2,1,dk));[4,7,10,13].forEach(x=>px(x,8,2,1,dk));px(5,11,9,1,dk)}
  else{const t=id==='math'?'123':'ABC';
   [...t].forEach((ch,k)=>FONT[ch].forEach((r,y)=>{for(let x=0;x<3;x++)if(r[x]==='#')px(3+k*5+x,3+y,1,1,INK)}))}
  ICONS[id]=c.toDataURL()}
 return `<img class="strmi" src="${ICONS[id]}" alt="" style="width:${IW*(sc||2)}px;height:${IH*(sc||2)}px">`}

/* ---------- one profile: stars / next lesson per subject ---------- */
const sumOf=o=>{let n=0;if(o&&typeof o==='object')for(const k in o)n+=+o[k]||0;return n};
const bestMap=(d,id)=>d===S?(id==='typing'?(K.cur==='typing'?S.best:TP.best):(S.streams&&S.streams[id]&&S.streams[id].best)):(id==='typing'?d.best:(d.streams&&d.streams[id]&&d.streams[id].best));
K.starsOf=(id,d)=>sumOf(bestMap(d||S,id));
K.totalStars=d=>IDS.reduce((a,id)=>a+K.starsOf(id,d),0);
const INFO={};
function nextInfo(id){
 const had=K.cur;let r=null;QUIET++;
 try{
  if(had!==id){if(id==='typing')K.leave();else K.enter(id)}
  const n=nextStage(),i=Math.floor(n/ST),s=n%ST,sl=K.slot(i),L=LESSONS[i]||{};
  const num=typeof LNUM==='function'?LNUM(i):i+1,wi=Math.min(LESSONS.length-1,typeof EI==='function'?EI(i):i);
  let w=1;try{w=worldOf(wi)}catch(e){}
  const kind=sl?sl.kind:'learn',reg=(typeof REGIONS!=='undefined'&&REGIONS[L.r])||{};
  r={n,w,s,line:(kind==='boss'?'Boss Test':kind==='review'?'Review':'Lesson '+num)+' · Part '+(s+1),
     sub:kind==='learn'?lessonTitle(i):(reg.name||''),stars:K.starsOf(id)}}
 catch(e){console.warn('[streams info]',e);r={n:0,w:1,s:0,line:'Lesson 1 · Part 1',sub:'',stars:K.starsOf(id)}}
 finally{try{if(had!==id){if(had==='typing')K.leave();else K.enter(had)}}catch(e){console.error(e)}QUIET--}
 return r}
K.info=nextInfo;

try{document.head.insertAdjacentHTML('beforeend',`<style>
.strmi{image-rendering:pixelated;display:block;flex:none}
.strmph{display:grid;place-items:center;margin:10px 0}
.stiles{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 6px}
.stiles.two{grid-template-columns:repeat(2,minmax(0,1fr))}
.stile{--c:#7fd8d0;--d:#2f8f8a;font:inherit;color:var(--ink);text-align:left;cursor:pointer;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto auto auto;column-gap:10px;row-gap:3px;align-items:center;min-width:0;padding:10px 12px 12px;border:0;border-radius:0;background:var(--panel2);box-shadow:inset 0 0 0 3px #4a3d62,0 5px 0 #0a0f2e;position:relative}
.stile.math{--c:#f0c860;--d:#b3850f}.stile.spell{--c:#e89ac0;--d:#a04c78}
.stile .st-name{font-family:var(--display);font-size:32px;letter-spacing:.04em;line-height:1;color:var(--ink)}
.stile .st-ic{grid-row:1}.stile .st-l1,.stile .st-sub,.stile .st-pr{grid-column:1/-1;min-width:0}
.stile .st-l1{font-family:var(--display);font-size:22px;color:var(--c);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.stile .st-sub{font-size:18px;line-height:1.2;color:#d8cfe8;height:2.4em;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.stile .st-pr{font-family:var(--display);font-size:20px;color:var(--muted);display:flex;gap:12px;border-top:3px solid #4a3d62;padding-top:4px;margin-top:2px}
.stile .st-pr b,.stile .st-pr i{font-weight:400;font-style:normal;color:#f0c860}
.stile:hover{background:#463a5e}
.stile.on{background:#53456e;transform:translateY(-2px);box-shadow:inset 0 0 0 4px var(--c),0 7px 0 var(--d),0 0 0 3px #fff0b0}
.stile.on .st-pr{border-color:var(--d)}
.stile:active{transform:translateY(1px)}
.stile:focus-visible{outline:3px dashed #fff0b0;outline-offset:3px}
.subsum{display:grid;gap:4px;margin:8px 0 0;padding:6px 8px;background:#1b1626;border:3px solid #3a2f4e}
.subsum div{display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center;font-family:var(--display);font-size:20px}
.subsum span{color:var(--ink)}.subsum b{font-weight:400;color:#f0c860;min-width:3.4em;text-align:right}.subsum em{font-style:normal;color:var(--muted);min-width:2.4em;text-align:right}
.strm{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 4px}
.strm.two{grid-template-columns:repeat(2,1fr)}
.strmb{--c:#7fd8d0;--d:#2f8f8a;display:flex;align-items:center;justify-content:center;gap:8px;padding:4px 6px 6px;border:0;border-radius:0;cursor:pointer;font-family:var(--display);font-size:20px;letter-spacing:.04em;background:var(--panel2);color:var(--ink);box-shadow:inset 0 0 0 2px #4a3d62,0 3px 0 #0a0f2e}
.strmb.math{--c:#f0c860;--d:#b3850f}.strmb.spell{--c:#e89ac0;--d:#a04c78}
.strmb.on{background:#53456e;box-shadow:inset 0 0 0 3px var(--c),0 3px 0 var(--d)}
.strmb:active{transform:translateY(2px)}
#s-map .strm{max-width:420px;margin:6px auto 2px}
.plst{display:flex;gap:6px;justify-content:center;margin-top:3px;font-family:var(--display);font-size:15px;color:#f0c860}
.plst span{display:flex;align-items:center;gap:2px}#mbox .players .pl .plst img{width:19px!important;height:14px!important;min-width:19px!important;max-width:19px!important;margin:0!important;display:block}
</style>`)}catch(e){}
function tabsHTML(){   // the small subject switch (Lesson Quests map)
 const a=avail();if(a.length<2)return '';const cur=S.stream&&a.includes(S.stream)?S.stream:'typing';
 return `<div class="strm${a.length===2?' two':''}" role="tablist" aria-label="Subject">${a.map(id=>`<button class="strmb ${id}${id===cur?' on':''}" role="tab" aria-selected="${id===cur}" data-act="stream" data-id="${id}" aria-label="${K.names[id]||id}">${icon(id,2)}<span>${esc((K.names[id]||id).toUpperCase())}</span></button>`).join('')}</div>`}
function tilesHTML(){   // the three big subject tiles on Home
 const a=avail(),cur=S.stream&&a.includes(S.stream)?S.stream:'typing';
 return `<div class="stiles${a.length===2?' two':''}" role="tablist" aria-label="Subject">${a.map(id=>{const f=INFO[id]||nextInfo(id);
  return `<button class="stile ${id}${id===cur?' on':''}" role="tab" aria-selected="${id===cur}" data-act="stream" data-id="${id}" aria-label="${esc(K.names[id]||id)}. ${esc(f.line)}">
 <span class="st-ic">${icon(id,3)}</span><span class="st-name">${esc((K.names[id]||id).toUpperCase())}</span>
 <span class="st-l1">${esc(f.line)}</span><span class="st-sub">${esc(f.sub)}</span>
 <span class="st-pr"><span><i>★</i> <b>${f.stars}</b></span><span>World <b>${f.w}</b></span></span></button>`}).join('')}</div>`}
function subsumHTML(){
 return `<div class="subsum" aria-label="Progress">${IDS.map(id=>{const f=INFO[id];return `<div>${icon(id,1)}<span>${esc((K.names[id]||id).toUpperCase())}</span><b>★ ${K.starsOf(id)}</b><em>W${f?f.w:1}</em></div>`}).join('')}</div>`}

/* the daily goal sits under the buttons so the subject tiles lead the panel */
function lowerDaily(){try{const home=$q('#s-home'),bot=home&&home.querySelector('.homebot');if(!bot)return;
 ['.daily','.visrow'].forEach(sel=>{const d=home.querySelector(sel);if(d&&d.previousElementSibling!==bot)bot.insertAdjacentElement('afterend',d)})}catch(e){console.warn('[streams daily]',e)}}
if(typeof homeCols==='function'){const _hc=homeCols;homeCols=function(){const r=_hc.apply(this,arguments);lowerDaily();return r}}
/* ---------- wrappers: renderHome / renderMap ---------- */
const _rh=renderHome;
renderHome=function(){
 const r=_rh.apply(this,arguments);
 try{const home=$q('#s-home');if(home){
  IDS.forEach(id=>{INFO[id]=nextInfo(id)});
  lowerDaily();
  home.querySelectorAll('.nxcard').forEach(b=>b.remove());                         // the tiles show each subject's next lesson
  home.querySelectorAll('.strm,.stiles').forEach(b=>b.remove());
  home.querySelectorAll('.homespell').forEach(b=>b.remove());                       // the old separate Spelling mode: Spell is a subject now
  const cur=S.stream||'typing';
  if(cur!=='typing')home.querySelectorAll('[data-act=place]').forEach(b=>{const p=b.closest('p');(p||b).remove()});   // the placement test is a Typing thing
  const hb=home.querySelector('.hbtns'),h=tilesHTML();
  if(hb&&h)hb.insertAdjacentHTML('afterbegin',h);
  home.querySelectorAll('.trow > div').forEach(d=>{if(/Stars\s*$/.test(d.textContent)){const b=d.querySelector('b');if(b)b.textContent=K.totalStars()}});   // Stars = all subjects
  const tr=home.querySelector('.hero-info .trow');
  if(tr&&S.name&&!home.querySelector('.subsum'))tr.insertAdjacentHTML('afterend',subsumHTML())}}catch(e){console.warn('[streams home]',e)}
 return r};
const _rm=renderMap;
renderMap=function(){
 const r=_rm.apply(this,arguments);
 try{const m=$q('#s-map');if(m&&!m.querySelector('.strm')){const h=tabsHTML();const tb=m.querySelector('.topbar');if(h&&tb)tb.insertAdjacentHTML('afterend',h)}
  const X=window.KKS_EXTRA;
  if(m&&K.cur!=='typing'&&!(X&&X.practice&&typeof X.practice[K.cur]==='function'))m.querySelectorAll('[data-act=practice]').forEach(b=>b.remove())}catch(e){console.warn('[streams map]',e)}
 return r};

/* ---------- Arcade / Practice / High Scores follow the chosen subject (other files define window.KKS_EXTRA) ---------- */
document.addEventListener('click',e=>{
 try{const b=e.target&&e.target.closest&&e.target.closest('#s-home [data-to=arcade],#s-home [data-act=practice],#s-home [data-act=hiscores],#s-map [data-act=practice]');
  if(!b)return;
  const id=S.stream||'typing',X=window.KKS_EXTRA;if(id==='typing'||!X)return;
  const kind=b.dataset.to==='arcade'?'arcade':b.dataset.act==='practice'?'practice':'hiscores';
  const fn=X[kind]&&X[kind][id];if(typeof fn!=='function')return;
  e.preventDefault();e.stopImmediatePropagation();try{fn(id)}catch(err){console.error('[streams extra]',err)}
 }catch(err){console.warn('[streams extra]',err)}},true);

/* ---------- Select Player: one combined summary per player ---------- */
if(typeof ACT.players==='function'){const _pl=ACT.players;
 ACT.players=function(){
  const r=_pl.apply(this,arguments);
  try{document.querySelectorAll('#mbox .players .pl[data-id]').forEach(b=>{if(b.querySelector('.plst'))return;
   const id=b.dataset.id,d=id===PROF.cur?S:peek(id);if(!d||!d.name)return;
   b.insertAdjacentHTML('beforeend',`<span class="plst" title="Stars">${IDS.map(s=>`<span>${icon(s,1)}★${K.starsOf(s,d)}</span>`).join('')}</span>`)})}catch(e){console.warn('[streams players]',e)}
  return r}}

/* ---------- data cores pick their slot from ORDER through us (math-data.js loads after this file, so hook on load too) ---------- */
function wire(){try{if(window.MATH&&MATH.setSlotResolver)MATH.setSlotResolver(K.slot)}catch(e){}try{if(window.SPELLD&&SPELLD.setSlotResolver)SPELLD.setSlotResolver(K.slot)}catch(e){}}
wire();addEventListener('load',wire);K.wire=wire;

/* the lesson splash's blue line is the TYPING lesson's summary: hide it inside Math / Spelling */
try{const _ls=lessonSummary;lessonSummary=function(i){return K.cur&&K.cur!=='typing'?'':_ls.apply(this,arguments)}}catch(e){}
/* ---------- owner: no separate "Crystal Caves" group. Its lessons (top-row keys E I R U T Y) stay in World 1 under World 1's name;
   lesson indexes are untouched so saves keep working. ---------- */
try{
 const R1=REGIONS[1],R0=REGIONS[0];
 if(R1&&R0&&R1.name==='Crystal Caves'){
  LESSONS.forEach(L=>{if(L&&L.r===1&&typeof L.t==='string')L.t=L.t.replace(/^(The )?Crystal Caves\b/,'Top Row')});
  Object.defineProperty(R1,'name',{get:()=>R0.name,configurable:true});
  Object.defineProperty(R1,'color',{get:()=>R0.color,configurable:true});
  Object.defineProperty(R1,'desc',{get:()=>R0.desc,configurable:true});
  /* map: fold the group's lessons into World 1's section instead of a second header */
  const _rmc=renderMap;renderMap=function(){const out=_rmc.apply(this,arguments);
   try{const secs=[...document.querySelectorAll('#s-map section.region')];
    for(let k=1;k<secs.length;k++){const a=secs[k-1],b=secs[k],ha=a.querySelector('.rhead h3'),hb=b.querySelector('.rhead h3');
     if(ha&&hb&&ha.textContent===hb.textContent){const la=a.querySelector('.lessons'),lb=b.querySelector('.lessons');if(la&&lb){while(lb.firstChild)la.appendChild(lb.firstChild);b.remove()}break}}}catch(e){console.warn('[streams map merge]',e)}
   return out};
 }}catch(e){console.warn('[streams crystal merge]',e)}
/* ---------- start: S was loaded before this script ran ---------- */
try{if(S.stream&&S.stream!=='typing'){view(S.stream);redraw()}}catch(e){console.warn('[streams init]',e)}
})();
