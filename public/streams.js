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
function toStream(id){   // typing view -> stream view (progress maps only)
 const st=ensure(id);
 KEYS.forEach(k=>{TP[k]=S[k]});
 KEYS.forEach(k=>{S[k]=st[k]})}
function toTyping(){     // stream view -> typing view (progress maps only); S.streams[cur] keeps whatever the maps hold now
 const st=S.streams&&S.streams[K.cur];
 if(st)KEYS.forEach(k=>{if(k==='skip')st.skip=+S.skip||0;else if(S[k]&&typeof S[k]==='object')st[k]=S[k]});
 KEYS.forEach(k=>{if(TP[k]===undefined)delete S[k];else S[k]=TP[k]});TP={}}

/* ---------- lesson overlay ---------- */
let RD=null;
function overlay(id){
 const def=K.def(id);K.orig=K.orig||LESSONS.slice();slots();
 LESSONS.forEach((_,i)=>{
  const o=K.orig[i],sl=K.slot(i);if(!o)return;
  let topic='',t=o.t;
  if(sl){try{topic=def.topicFor(sl.w,sl,sl.kind)||''}catch(e){console.warn('[streams topicFor]',e)}
   if(sl.kind==='learn'){let nt=null;try{nt=def.title?def.title(topic,sl):null}catch(e){}t=nt||((def.name||id)+' '+(sl.n+1))}}
  const e={k:'',r:o.r,t,str:id,topic};if(o.sp)e.sp=o.sp;if(o.grp!=null)e.grp=o.grp;if(o.src!=null)e.src=o.src;if(o.bt)e.bt=o.bt;
  LESSONS[i]=e});
 try{RD=RD||REGIONS.map(r=>r.desc);REGIONS.forEach((r,k)=>{const d=def.regionDesc&&def.regionDesc[worldOfRegion(k)-1];r.desc=d||''})}catch(e){}}
function unoverlay(){
 if(K.orig)LESSONS.forEach((_,i)=>{if(K.orig[i])LESSONS[i]=K.orig[i]});
 try{if(RD)REGIONS.forEach((r,k)=>{r.desc=RD[k]})}catch(e){}}

K.enter=function(id){
 if(!id||!IDS.includes(id))id='typing';
 if(id===K.cur)return;
 if(K.cur!=='typing')K.leave();
 if(id==='typing')return;
 K.orig=K.orig||LESSONS.slice();
 toStream(id);overlay(id);K.cur=id};
K.leave=function(){
 if(K.cur==='typing')return;
 toTyping();unoverlay();K.cur='typing'};
const view=id=>{try{(id&&id!=='typing'&&on(id)?K.enter(id):K.leave())}catch(e){console.error('[streams]',e);try{K.leave()}catch(_){}}};

/* ---------- redraw ---------- */
function redraw(){try{if(typeof screen!=='undefined'){if(screen==='home')renderHome();else if(screen==='map')renderMap()}}catch(e){console.warn('[streams]',e)}}
K.set=function(id){
 if(!IDS.includes(id)||!on(id))id='typing';
 view(id);S.stream=id;try{save()}catch(e){}
 try{sfx.click()}catch(e){}redraw()};
ACT.stream=d=>K.set(d&&d.id);

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
 if(K.cur!=='typing'){unoverlay();K.cur='typing';TP={}}   // the old S is gone: nothing to swap back into
 const r=_ld.apply(this,arguments);
 try{view(S.stream)}catch(e){}
 return r};

/* ---------- show: home/map follow the chosen stream; every Typing-only screen sees Typing ---------- */
const TYPING_ONLY=new Set(['arcade','binder','shop','parents','game','spell']);
const _show=show;
show=function(id){
 try{if(id==='home'||id==='map')view(S.stream);else if(TYPING_ONLY.has(id))K.leave()}catch(e){console.error('[streams]',e)}
 return _show.apply(this,arguments)};

/* ---------- starting a part ---------- */
const _ss=startStage;
startStage=function(n,mode){
 try{
  if(mode){K.leave();return _ss.apply(this,arguments)}                  // practice / placement / code course are Typing things
  const id=S.stream;
  if(!id||id==='typing'||!on(id)){K.leave();return _ss.apply(this,arguments)}
  K.enter(id);
  const i=Math.floor(n/ST),s=n%ST,rl=K.rl;
  try{if(typeof storyState==='function'&&typeof STORY!=='undefined'){                     // the world story (intro, boss taunt) is shared by all subjects
   const w=worldOf(i),st=storyState();
   if(STORY[w-1]&&!st.intro[w]){st.intro[w]=1;save();return cutscene(w,STORY[w-1].intro,'intro',()=>startStage(n))}
   if(STORY[w-1]&&i===worldLast(w)&&s===7&&!st.taunt[w]){st.taunt[w]=1;save();return cutscene(w,STORY[w-1].taunt,'taunt',()=>startStage(n))}}}catch(e){console.warn('[streams story]',e)}
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
  if(screen==='home'&&avail().length>1){                                  // subject switch: arrows or 1-3
   const a=avail();let j=a.indexOf(S.stream||'typing');if(j<0)j=0;
   if(e.key==='ArrowRight')j=(j+1)%a.length;else if(e.key==='ArrowLeft')j=(j+a.length-1)%a.length;
   else if(/^[1-3]$/.test(e.key)&&IDS[+e.key-1]&&on(IDS[+e.key-1]))j=a.indexOf(IDS[+e.key-1]);
   else return;
   e.preventDefault();K.set(a[j]);
   setTimeout(()=>{const b=$q('#s-home .strmb.on');b&&b.focus({preventScroll:true})},0)}
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

/* ---------- pixel icons for the switch ---------- */
const ICONS={};
function icon(id,sc){
 if(!ICONS[id]){
  const GL={typing:['.GGG.','G...G','GGGGG','G...G','G...G'],math:['..G..','..G..','GGGGG','..G..','..G..'],spell:['GGGG.','G...G','GGGG.','G...G','GGGG.']}[id]||['.....','.....','.....','.....','.....'];
  const cap={typing:'#7fd8d0',math:'#f0c860',spell:'#e89ac0'}[id]||'#cfc6e0',dk={typing:'#2f8f8a',math:'#b3850f',spell:'#a04c78'}[id]||'#8f86a8';
  const c=document.createElement('canvas');c.width=12;c.height=12;const g=c.getContext('2d');
  g.fillStyle='#1a1030';g.fillRect(0,0,12,12);g.fillStyle=cap;g.fillRect(1,1,10,8);g.fillStyle=dk;g.fillRect(1,9,10,2);
  g.fillStyle='#fff6e0';g.fillRect(1,1,10,1);
  [[0,0],[11,0],[0,11],[11,11]].forEach(([x,y])=>g.clearRect(x,y,1,1));
  g.fillStyle='#1a1030';GL.forEach((r,y)=>{for(let x=0;x<5;x++)if(r[x]==='G')g.fillRect(3+x,2+y,1,1)});
  ICONS[id]=c.toDataURL()}
 return `<img class="strmi" src="${ICONS[id]}" alt="" style="width:${12*(sc||2)}px;height:${12*(sc||2)}px">`}
try{document.head.insertAdjacentHTML('beforeend',`<style>
.strm{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 0 4px}
.strm.two{grid-template-columns:repeat(2,1fr)}
.strmb{display:flex;align-items:center;justify-content:center;gap:6px;padding:7px 4px 9px;border:0;border-radius:0;cursor:pointer;font-family:var(--display);font-size:18px;letter-spacing:.04em;background:var(--panel2);color:var(--ink);box-shadow:0 4px 0 #0a0f2e,inset 0 0 0 2px #4a3d62}
.strmb.on{background:var(--gold);color:#2a1d00;box-shadow:0 4px 0 #b3850f,inset 0 0 0 2px #fff0b0}
.strmb:active{transform:translateY(2px)}
.strmi{image-rendering:pixelated;display:block;flex:none}
.strmph{display:grid;place-items:center;margin:10px 0}
#s-map .strm{max-width:420px;margin:6px auto 2px}
</style>`)}catch(e){}
function tabsHTML(){
 const a=avail();if(a.length<2)return '';const cur=S.stream&&a.includes(S.stream)?S.stream:'typing';
 return `<div class="strm${a.length===2?' two':''}" role="tablist" aria-label="Subject">${a.map(id=>`<button class="strmb${id===cur?' on':''}" role="tab" aria-selected="${id===cur}" data-act="stream" data-id="${id}" aria-label="${K.names[id]||id}">${icon(id,2)}<span>${(K.names[id]||id).toUpperCase()}</span></button>`).join('')}</div>`}

/* ---------- wrappers: renderHome / renderMap ---------- */
const _rh=renderHome;
renderHome=function(){
 const r=_rh.apply(this,arguments);
 try{const home=$q('#s-home');if(home&&S.name&&!home.querySelector('.strm')){const h=tabsHTML();
  if(h){const hb=home.querySelector('.tcard .hbtns')||home.querySelector('.hbtns');if(hb)hb.insertAdjacentHTML('beforebegin',h)}}}catch(e){console.warn('[streams home]',e)}
 try{if(K.cur!=='typing'){const home=$q('#s-home');if(home){   // the typing placement test and the old separate Spelling mode are Typing things (Spelling has its own stream)
  home.querySelectorAll('[data-act=place]').forEach(b=>{const p=b.closest('p');(p||b).remove()});
  home.querySelectorAll('.homespell').forEach(b=>{const hb=b.parentElement;b.remove();hb&&hb.querySelectorAll('.half').forEach(x=>x.classList.remove('half'))})}}}catch(e){console.warn('[streams home]',e)}
 return r};
const _rm=renderMap;
renderMap=function(){
 const r=_rm.apply(this,arguments);
 try{const m=$q('#s-map');if(m&&!m.querySelector('.strm')){const h=tabsHTML();const tb=m.querySelector('.topbar');if(h&&tb)tb.insertAdjacentHTML('afterend',h)}
  if(m&&K.cur!=='typing')m.querySelectorAll('[data-act=practice]').forEach(b=>b.remove())}catch(e){console.warn('[streams map]',e)}
 return r};

/* ---------- data cores pick their slot from ORDER through us (math-data.js loads after this file, so hook on load too) ---------- */
function wire(){try{if(window.MATH&&MATH.setSlotResolver)MATH.setSlotResolver(K.slot)}catch(e){}try{if(window.SPELLD&&SPELLD.setSlotResolver)SPELLD.setSlotResolver(K.slot)}catch(e){}}
wire();addEventListener('load',wire);K.wire=wire;

/* the lesson splash's blue line is the TYPING lesson's summary: hide it inside Math / Spelling */
try{const _ls=lessonSummary;lessonSummary=function(i){return K.cur&&K.cur!=='typing'?'':_ls.apply(this,arguments)}}catch(e){}
/* ---------- start: S was loaded before this script ran ---------- */
try{if(S.stream&&S.stream!=='typing'){view(S.stream);redraw()}}catch(e){console.warn('[streams init]',e)}
})();
