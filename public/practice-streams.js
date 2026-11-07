/* practice-streams.js: PRACTICE and HIGH SCORES for the Math and Spelling streams (Keyloria Kingdom).
   Contract (the home buttons call these):
     KKS_EXTRA.practice.math() / .spell()     pick a world + topic (or Mix / My tricky words) and play relaxed rounds, no stars, small XP
     KKS_EXTRA.hiscores.math() / .spell()     per-game top scores (everyone on this device) + "Best lessons"
     KKS_EXTRA.addScore(stream, game, {score, acc?, at?})  -> rank (1-10) or 0; stored in S.streams[stream].hi[game], top 10, merged by mergeSave
     KKS_EXTRA.scores(stream, game?)          -> [{score,acc,at}] for one game, or {game:[...]} for all
     KKS_EXTRA.gameNames[stream][game]='Name' (optional, set by the arcade file; unknown games show a tidied id)
   Practice REUSES the stream classic rounds (math.js classic, spell-adv.js classic): a lesson of the chosen world is started with K.startClassic,
   MATH.problems / SPELLD.wordsFor are overridden for that ONE call so the round holds the chosen topic, and KKS.finishClassic is intercepted
   (P.kkPrac) so nothing is written to S.best / cards / stars. Practice gives XP = problems/words right. Spelling misses still land in
   S.spell.tricky (spell-adv does that), and perfect words in "My tricky words" count down (3 perfect spellings clear one). */
(function(){
if(typeof window==='undefined'||!window.KKS||typeof S==='undefined'||typeof modal!=='function')return;
const K=window.KKS,M=window.MATH,SD=window.SPELLD;
const X=window.KKS_EXTRA=window.KKS_EXTRA||{};
const $q=(s,r)=>(r||document).querySelector(s);
const GRADE=['JK/SK','Gr 1','Gr 1','Gr 2','Gr 3','Gr 4','Gr 5','Gr 6','Gr 7','Gr 8','Review K-4','Review 5-8'];
const NAME={math:'Math',spell:'Spelling'};
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const ok1=f=>{try{return f()}catch(e){return undefined}};

/* ================= scores in the save ================= */
function ensureStream(id){S.streams=S.streams&&typeof S.streams==='object'?S.streams:{};const st=S.streams[id]=S.streams[id]&&typeof S.streams[id]==='object'?S.streams[id]:{};return st}
const cmp=(x,y)=>(y.score||0)-(x.score||0)||(y.acc||0)-(x.acc||0)||(x.at||0)-(y.at||0);
X.addScore=function(stream,game,entry){
 try{if(!stream||!game||!entry||!isFinite(+entry.score))return 0;
  const st=ensureStream(stream),hi=st.hi=st.hi&&typeof st.hi==='object'?st.hi:{},e={score:+entry.score,acc:entry.acc!=null?Math.round(+entry.acc)||0:0,at:+entry.at||Date.now()};
  const l=(hi[game]=Array.isArray(hi[game])?hi[game]:[]);l.push(e);l.sort(cmp);hi[game]=l.slice(0,10);
  const rank=hi[game].indexOf(e)+1;
  try{save()}catch(err){}
  return rank}catch(err){console.warn('[practice-streams] addScore',err);return 0}};
X.scores=function(stream,game){
 const hi=(S.streams&&S.streams[stream]&&S.streams[stream].hi)||{};
 if(game==null){const o={};Object.keys(hi).forEach(g=>{o[g]=(hi[g]||[]).map(e=>Object.assign({},e))});return o}
 return (hi[game]||[]).map(e=>Object.assign({},e))};
X.gameNames=X.gameNames||{};

/* ================= helpers: unlocked world, topics ================= */
function enter(id){try{if(K.cur!==id)K.enter(id)}catch(e){console.warn('[practice-streams]',e)}}
function frontier(id){enter(id);let w=1;try{const n=nextStage();w=worldOf(Math.floor(n/8))}catch(e){}return Math.max(1,Math.min(12,w|0||1))}
function topics(id,w){return (id==='math'?ok1(()=>M.topicsOf(w)):ok1(()=>SD.topicsOf(w)))||[]}
function worldName(w){try{for(let k=0;k<REGIONS.length;k++)if(worldOfRegion(k)===w)return REGIONS[k].name}catch(e){}return ''}
function tricky(){const T=(S.spell&&S.spell.tricky)||{};return Object.keys(T)}
let LI=null;
function lessonOf(w){   // a learn lesson of world w (group 0): its slot gives the right scene, and spell-adv's flash timing from its world
 if(!LI){LI={};try{for(let i=0;i<LESSONS.length;i++){const sl=K.slot(i);if(sl&&sl.kind==='learn'&&(sl.g||0)===0&&LI[sl.w]==null)LI[sl.w]=i}}catch(e){}}
 let x=w;while(x>=1&&LI[x]==null)x--;if(x<1){x=w;while(x<=12&&LI[x]==null)x++}
 return LI[x]!=null?LI[x]:0}

/* ================= one-shot overrides of the content calls ================= */
let ONE=null;
function hook(obj,name){if(!obj||obj['_kkp_'+name])return;const orig=obj[name];if(typeof orig!=='function')return;obj['_kkp_'+name]=1;
 obj[name]=function(){if(ONE&&ONE.fn===name){const f=ONE;ONE=null;try{const r=f.make.apply(this,arguments);if(r&&r.length)return r}catch(e){console.warn('[practice-streams]',e)}}return orig.apply(this,arguments)}}
hook(M,'problems');hook(SD,'wordsFor');

function mathMaker(cfg){
 return function(li,part,count){
  count=count||12;const seed=(Math.random()*1e9)|0;
  const topicsFor=()=>cfg.topic?[M.topic(cfg.topic)]:cfg.mix?[].concat(...Array.from({length:cfg.maxW},(_,k)=>M.topicsOf(k+1))):M.topicsOf(cfg.w);
  const pool=topicsFor().filter(Boolean);
  if(cfg.topic)return M.gen(cfg.topic,part,seed,count);
  const out=[],seen={};let tries=0;
  while(out.length<count&&pool.length&&tries<count*30){tries++;const t=pick(pool),p=M.gen(t.id,part,seed+tries,1)[0];if(!p||seen[p.q])continue;seen[p.q]=1;out.push(p)}
  return out}}
function spellMaker(cfg){
 return function(w,slot,part,count){
  count=count||8;const seed=(Math.random()*1e9)|0;
  if(cfg.tricky){const ws=shuf(tricky()).slice(0,Math.max(count,12));return ws.map(x=>({w:x,s:SD.sentence(x)||'',p:'',g:0}))}
  if(cfg.topic)return SD.words(cfg.topic,part,count,seed);
  const L=SD.lesson(cfg.mix?1+rnd(cfg.maxW):cfg.w,7);return L?SD.words(L,part,count,seed):[]}}

/* ================= a round ================= */
function startRound(id,cfg){
 enter(id);
 let w=cfg.w,mw=cfg.maxW||frontier(id);
 const c=Object.assign({maxW:mw},cfg);
 if(c.mix||c.tricky)w=c.tricky?Math.max(2,mw):1+rnd(mw);   // spelling flash timing follows this world; math mix draws from every unlocked world
 const i=lessonOf(w);c.round=(cfg.round||0);
 const look=!(c.round%2),s=id==='math'?4:(look?4:6);       // part 5 (look) / part 7 (hear): no "Watch me", no lesson splash
 ONE={fn:id==='math'?'problems':'wordsFor',make:id==='math'?mathMaker(c):spellMaker(c)};
 try{S.lastLesson=i}catch(e){}
 try{K.startClassic(i*8+s)}catch(e){console.error('[practice-streams]',e)}
 ONE=null;
 if(!P||P.stream!==id)return;
 P.kkPrac=c;
 try{const b=$q('#hud .ht b'),sp=$q('#hud .ht span');if(b)b.textContent='Practice';if(sp)sp.textContent=titleOf(id,c)}catch(e){}}
function titleOf(id,c){
 if(c.tricky)return 'My tricky words';
 if(c.mix)return 'Mix';
 const t=c.topic&&(id==='math'?ok1(()=>M.topic(c.topic)):ok1(()=>SD.topic(c.topic)));
 return 'W'+c.w+' · '+(t&&t.title?t.title:'All topics')}

/* ================= finish: no stars, small XP ================= */
const _fc=K.finishClassic;
K.finishClassic=function(res){
 if(!(P&&P.kkPrac&&P.stream===P.kkPrac.stream))return _fc.apply(this,arguments);
 try{pracFinish(res||{})}catch(e){console.error('[practice-streams]',e);try{leave()}catch(_){}}};
function pracFinish(res){
 const c=P.kkPrac,id=c.stream||P.stream,len=Math.max(1,res.len|0||1),ok=Math.max(0,Math.min(len,res.ok==null?len:res.ok|0));
 P.phase='done';try{clearInterval(P.idle)}catch(e){}try{setTarget(null)}catch(e){}
 if(id==='spell'){try{
  const R=P.sp,T=(S.spell=S.spell||{}).tricky=(S.spell&&S.spell.tricky)||{};
  if(R&&R.q){const first=R.q.filter(x=>!x.retry);first.forEach((x,k)=>{if(R.res[k]===true&&T[x.w]){T[x.w].left=(T[x.w].left||3)-1;if(T[x.w].left<=0)delete T[x.w]}})}}catch(e){}}
 const xp=ok;S.xp+=xp;try{S.time+=Math.round(res.secs||0)}catch(e){}
 try{save()}catch(e){}
 const acc=Math.round(ok/len*100);
 try{$q('#vil')&&$q('#vil').classList.add('pop');$q('#hero')&&$q('#hero').classList.add('cheer');burst($q('#arena'),$q('#vil'),'#f0c860',16);sfx.win()}catch(e){}
 setTimeout(()=>{
  if(!P||P.kkPrac!==c||screen!=='play')return;
  const more=id==='spell'&&c.tricky&&!tricky().length;
  modal(`<div class="kkp-res"><h2>${acc>=85?'Nice work!':'Good practice!'}</h2>
   <div class="kkp-st"><div><b>${ok}/${len}</b><span>Right</span></div><div><b>+${xp}</b><span>XP</span></div></div>
   ${more?'<p class="muted" style="margin:8px 0 0">All tricky words cleared!</p>':''}
   <div class="rbtns"><button class="btn big nextbtn" data-act="kkpAgain">${more?'Pick':'Again'}</button><button class="btn alt" data-act="kkpDone">Done</button></div></div>`);
  P.phase='done'},700)}
function leave(){const c=P&&P.kkPrac;if(P)P.kkPrac=null;try{closeModal()}catch(e){}show('home')}
ACT.kkpAgain=()=>{const c=P&&P.kkPrac;if(!c)return;try{closeModal()}catch(e){}
 if(c.tricky&&!tricky().length){const id=c.stream;P.kkPrac=null;show('home');return open(id)}
 startRound(c.stream,Object.assign({},c,{round:(c.round||0)+1}))};
ACT.kkpDone=()=>leave();
/* leaving the play screen during practice (Esc twice, back button) goes home, not to the map */
try{const _sh=show;show=function(id){
 try{if(P&&P.kkPrac&&screen==='play'&&id!=='play'){P.kkPrac=null;if(id==='map')id='home'}}catch(e){}
 return _sh.call(this,id)}}catch(e){}

/* ================= picker (modal, the Practice menu look) ================= */
let CUR=null;
const gridHTML=(id,fr)=>{
 const ws=[...Array(12)].map((_,k)=>k+1);
 const tr=id==='spell'?tricky().length:0;
 return `<div class="kkp kkp-w" data-s="${id}"><h2>${NAME[id]} Practice</h2>
  <div class="kkp-grid">${ws.map(w=>`<button class="pm kkp-b${w===fr?' now':''}" data-act="kkpWorld" data-s="${id}" data-w="${w}"><b>W${w}</b><span>${GRADE[w-1]}</span></button>`).join('')}</div>
  <div class="kkp-row"><button class="pm kkp-b" data-act="kkpGo" data-s="${id}" data-k="mix"><b>Mix</b><span>${fr>1?'Worlds 1-'+fr:'World 1'}</span></button>
  ${id==='spell'?`<button class="pm kkp-b${tr?'':' off'}" data-act="kkpGo" data-s="${id}" data-k="tricky"><b>My tricky words</b><span>${tr?tr+(tr>1?' words':' word'):'None yet'}</span></button>`:''}</div>
  <div class="kkp-foot"><button class="btn alt" data-act="kkpClose">Close</button></div></div>`};
function open(id){
 if(id!=='math'&&id!=='spell')return;
 const fr=frontier(id);CUR={id,fr};
 modal(gridHTML(id,fr));focusBtn('.kkp-b.now')}
function focusBtn(sel){setTimeout(()=>{try{const b=$q('#mbox '+sel)||$q('#mbox .kkp-b');b&&b.focus({preventScroll:true})}catch(e){}},30)}
ACT.kkpClose=()=>{CUR=null;closeModal()};
ACT.kkpWorld=d=>{
 const id=d.s,w=+d.w,ts=topics(id,w);if(!CUR)CUR={id,fr:frontier(id)};
 modal(`<div class="kkp kkp-t" data-s="${id}"><h2>W${w} · ${GRADE[w-1]}</h2>${worldName(w)?`<p class="kkp-wn">${esc(worldName(w))}</p>`:''}
  <div class="kkp-list">${ts.map(t=>`<button class="pm kkp-b" data-act="kkpGo" data-s="${id}" data-w="${w}" data-t="${esc(t.id)}"><b>${esc(t.title||t.id)}</b></button>`).join('')}
  <button class="pm kkp-b" data-act="kkpGo" data-s="${id}" data-w="${w}" data-k="world"><b>All of World ${w}</b></button></div>
  <div class="kkp-foot"><button class="btn alt" data-act="kkpBack" data-s="${id}">Back</button></div></div>`);
 focusBtn('.kkp-b')};
ACT.kkpBack=d=>open(d.s);
ACT.kkpGo=d=>{
 const id=d.s;if(d.k==='tricky'&&!tricky().length){try{toast('No tricky words yet!')}catch(e){}return}
 const cfg={stream:id,w:+d.w||1,topic:d.t||null,mix:d.k==='mix',tricky:d.k==='tricky',round:0};
 try{closeModal()}catch(e){}
 startRound(id,cfg)};
/* keys in the pickers and the result pop-up: arrows move, Esc backs out (Esc must not fall through to the game's own handler) */
addEventListener('keydown',e=>{
 try{const m=$q('#modal');if(!m||m.hidden)return;const box=$q('#mbox .kkp'),res=$q('#mbox .kkp-res');
  if(!box&&!res)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();
   if(res)return leave();
   if(box.classList.contains('kkp-t'))return open(box.dataset.s);
   return ACT.kkpClose()}
  if(box&&/^Arrow/.test(e.key)){
   const bs=[...box.querySelectorAll('.kkp-b')],j=bs.indexOf(document.activeElement);if(!bs.length)return;
   const cols=box.classList.contains('kkp-w')?(window.innerWidth<520?3:4):1;let n=j<0?0:j;
   if(e.key==='ArrowRight')n=j<0?0:Math.min(bs.length-1,j+1);else if(e.key==='ArrowLeft')n=Math.max(0,j-1);
   else if(e.key==='ArrowDown')n=j<0?0:Math.min(bs.length-1,j+cols);else n=Math.max(0,j-cols);
   e.preventDefault();e.stopImmediatePropagation();bs[n].focus({preventScroll:true})}
 }catch(err){}},true);

/* ================= HIGH SCORES ================= */
function players(){
 let prof={list:['p1'],cur:'p1'};try{prof=JSON.parse(localStorage.getItem('kk-profiles'))||prof}catch(e){}
 const out=[];(prof.list||[]).forEach(pid=>{let st=null;if(pid===prof.cur)st=S;else try{st=JSON.parse(localStorage.getItem(LS_KEY+'-'+pid))}catch(e){}
  if(st)out.push({st,me:pid===prof.cur,name:st.name||'Player'})});
 if(!out.length)out.push({st:S,me:true,name:S.name||'Player'});return out}
const tidy=g=>String(g).replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
function gameList(id,pl){
 const names=Object.assign({},X.gameNames&&X.gameNames[id]||{}),order=[];
 const arc=X.arcade&&X.arcade[id];
 try{if(Array.isArray(arc))arc.forEach(g=>{const k=typeof g==='string'?g:(g&&(g.id||g.key));if(k){order.push(k);if(g&&g.name&&!names[k])names[k]=g.name}});
  else if(arc&&arc.games){const gs=arc.games;(Array.isArray(gs)?gs:Object.keys(gs).map(k=>Object.assign({id:k},gs[k]))).forEach(g=>{const k=typeof g==='string'?g:(g&&(g.id||g.key));if(k){order.push(k);if(g&&g.name&&!names[k])names[k]=g.name}})}
  else if(arc&&typeof arc==='object')Object.keys(arc).forEach(k=>{if(typeof arc[k]!=='function'||arc[k].name)order.push(k);const g=arc[k];if(g&&typeof g==='object'&&g.name&&!names[k])names[k]=g.name})}catch(e){}
 Object.keys(names).forEach(k=>order.push(k));
 pl.forEach(p=>Object.keys((p.st.streams&&p.st.streams[id]&&p.st.streams[id].hi)||{}).forEach(k=>order.push(k)));
 const seen=new Set(),games=[];order.forEach(k=>{if(!seen.has(k)){seen.add(k);games.push({id:k,name:names[k]||tidy(k)})}});return games}
let HTAB={math:null,spell:null};
function hiscores(id,tab){
 enter(id);
 const pl=players(),games=gameList(id,pl);
 const rowsOf=g=>{const r=[];pl.forEach(p=>(((p.st.streams||{})[id]||{}).hi||{})[g]&&p.st.streams[id].hi[g].forEach(e=>r.push(Object.assign({n:p.name,me:p.me},e))));return r.sort(cmp).slice(0,10)};
 if(tab)HTAB[id]=tab;
 let T=HTAB[id];if(!T||(T!=='lessons'&&!games.some(g=>g.id===T)))T=null;
 if(!T){const g=games.find(g=>rowsOf(g.id).length);T=g?g.id:'lessons'}
 HTAB[id]=T;
 const tabs=[...games.map(g=>[g.id,g.name]),['lessons','Best lessons']];
 let body='';
 if(T==='lessons')body=lessonsHTML(id);
 else{const rows=rowsOf(T),medal=k=>k<3?`<span class="medal m${k+1}">${k+1}</span>`:`<b>${k+1}</b>`;
  body=rows.length?`<table class="hs-tab"><tr><th>#</th><th>Player</th><th>Score</th><th>Accuracy</th><th>Date</th></tr>${rows.map((x,k)=>`<tr class="${x.me?'me':''}"><td>${medal(k)}</td><td>${esc(x.n)}</td><td><b>${x.score}</b></td><td>${x.acc?x.acc+'%':'-'}</td><td style="white-space:nowrap">${new Date(x.at).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</td></tr>`).join('')}</table>`:`<p class="muted">No scores yet. Play an arcade game to get on the board!</p>`}
 modal(`<div class="kkp-hs" data-s="${id}"><h2>${NAME[id]} High Scores</h2><div class="hs-tabs">${tabs.map(([g,n])=>`<button class="${g===T?'on':''}" data-act="kkpHsTab" data-s="${id}" data-g="${esc(g)}">${esc(n)}</button>`).join('')}</div>${body}
  ${T==='lessons'?'':'<p class="muted" style="font-size:16px;margin:6px 0 0">Everyone who plays on this device is on the board.</p>'}
  <div class="rbtns kkp-hsf"><button class="btn nextbtn" data-act="kkpHsClose">Close</button></div></div>`)}
ACT.kkpHsTab=d=>hiscores(d.s,d.g);
ACT.kkpHsClose=()=>closeModal();
function lessonsHTML(id){
 const b=(S.streams&&S.streams[id]&&S.streams[id].best)||{},by={};
 Object.keys(b).forEach(k=>{const [i,s]=k.split('-').map(Number),v=+b[k]||0;if(!(v>0)||isNaN(i))return;const o=by[i]=by[i]||{i,stars:0,parts:0};o.stars+=Math.min(3,v);o.parts++});
 const list=Object.values(by).sort((x,y)=>y.stars-x.stars||x.i-y.i),tot=list.reduce((a,x)=>a+x.stars,0);
 if(!list.length)return `<p class="muted">No stars yet. Play a lesson to get on the list!</p>`;
 const ttl=i=>{let t='';try{t=LESSONS[i]&&LESSONS[i].t||''}catch(e){}const w=ok1(()=>worldOf(i));return (w?'W'+w+' · ':'')+(t||'Lesson '+(i+1))};
 return `<table class="hs-tab"><tr><th>#</th><th>Lesson</th><th>Stars</th></tr>${list.slice(0,10).map((x,k)=>`<tr><td>${k<3?`<span class="medal m${k+1}">${k+1}</span>`:`<b>${k+1}</b>`}</td><td>${esc(ttl(x.i))}</td><td><b>${x.stars}</b>/${x.parts*3}</td></tr>`).join('')}</table>
  <p class="muted" style="font-size:16px;margin:6px 0 0">${list.length} ${list.length>1?'lessons':'lesson'} · ${tot} stars</p>`}

/* ================= wire the contract (merge, never overwrite) ================= */
X.practice=Object.assign(X.practice||{},{math:()=>open('math'),spell:()=>open('spell')});
X.hiscores=Object.assign(X.hiscores||{},{math:()=>hiscores('math'),spell:()=>hiscores('spell')});

try{document.head.insertAdjacentHTML('beforeend',`<style>
.kkp h2,.kkp-hs h2,.kkp-res h2{margin:0 0 8px}
.kkp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 8px}
.kkp-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
.kkp-list{display:grid;gap:8px;max-height:50vh;overflow:auto}
.kkp-b{text-align:center;justify-items:center}
.kkp-list .kkp-b{text-align:left;justify-items:start}
.kkp-b b{font-size:22px}.kkp-b.now{border-color:#f0c860}.kkp-b.off{opacity:.55}.kkp-b:focus-visible{background:#3a2f4e}
.kkp-wn{margin:-4px 0 8px;color:#c8bedc;font-size:18px}
.kkp-foot{display:flex;justify-content:center;margin-top:10px}
.kkp-st{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:6px 0 12px}.kkp-st div{background:#0c1238;padding:8px 4px}.kkp-st b{font-family:var(--display);font-weight:400;font-size:24px;display:block;font-variant-numeric:tabular-nums}.kkp-st span{font-size:14px;color:var(--muted)}
.kkp-hs .hs-tabs{margin-top:4px}.kkp-hsf{margin-top:10px}
@media(max-width:520px){.kkp-grid{grid-template-columns:repeat(3,1fr)}}
</style>`)}catch(e){}
})();
