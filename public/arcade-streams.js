/* Keyloria Kingdom: ARCADE MODE for the Math and Spelling streams.
   Contract: KKS_EXTRA.arcade = { math(), spell() } each opens that subject's arcade picker (same look as the typing picker).
   The typing arcade games are NOT rewritten. While a stream arcade is open (ARC.sub), the typing games are started
   normally and then FED different content and given a different face:
     Math  : Meteor Zap, Bubble Pop (single-digit answers), Treasure Dig, Keylori Keeper. Each target shows a problem, the kid types the answer.
     Spell : Meteor Zap, Bubble Pop (type the missing letter), Treasure Dig. The word is shown briefly, then covered as blanks.
   Results go to KKS_EXTRA.addScore(stream, gameId, {score, acc, at}) (same list shape as S.streams[id].hi). Typing records are never touched. */
(function(){
if(typeof S==='undefined'||typeof ACT==='undefined'||typeof renderArcade!=='function'||typeof show!=='function')return;
const X=window.KKS_EXTRA=window.KKS_EXTRA||{};
const ARC={sub:null,game:null,on:false,hits:0,errs:0,snap:null,obs:[],timers:[],deckP:[],dict:{},w:1,items:[],digCov:false,lastLi:-1,tabUsed:{}};
const SUBS={math:{name:'Math',games:['meteor','bubble','dig','keeper']},spell:{name:'Spell',games:['meteor','bubble','dig']}};
const DIG='0123456789';
const rnd=()=>Math.random();
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const q$=s=>document.querySelector(s);
const E=t=>(typeof esc==='function'?esc(t):String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])));

/* ---------- which world is the kid in? (highest world with progress in that stream) ---------- */
function worldOf(sid){
 let w=1;
 try{
  const st=(S.streams&&S.streams[sid])||{},ST=typeof NST!=='undefined'?NST:8;
  const hi=Object.keys(st.best||{}).filter(k=>(st.best[k]|0)>=1).map(Number);
  if((st.skip|0)>0)hi.push((st.skip|0)-1);
  hi.forEach(n=>{const sl=window.KKS&&KKS.slot?KKS.slot(Math.floor(n/ST)):null;if(sl&&sl.w>w)w=sl.w});
  /* a finished lesson opens the next one: if the last lesson of a world is done, that world's neighbour is next */
 }catch(e){}
 return Math.max(1,Math.min(12,w));
}
/* spelling cover time (ms) by world; Infinity = never covered (World 1) */
const coverMs=(w,len)=>w<=1?Infinity:w<=3?2000+150*len:w<=7?1200+100*len:800+80*len;

/* ---------- content ---------- */
function synthMath(w,n){const mx=[5,10,20,20,50,100,100,200,500,1000,1000,1000][w-1]||20,out=[];
 for(let k=0;k<n*3&&out.length<n;k++){let a=1+Math.floor(rnd()*mx),b=1+Math.floor(rnd()*mx),q,ans;
  if(rnd()<.5){q=a+' + '+b;ans=a+b}else{if(a<b)[a,b]=[b,a];q=a+' − '+b;ans=a-b}
  if(!out.some(p=>p.q===q))out.push({q,a:String(ans)})}
 return out}
function mathItems(w,single){
 const tier=Math.max(0,Math.min(11,w-1)),seed=Math.floor(rnd()*1e6),M=window.MATH;
 const get=(kind,c,max)=>{try{return M.forRunner(tier,DIG,kind,{count:c,seed:seed+kind.length}).filter(p=>p&&!p.aid&&/^\d+$/.test(p.a)&&p.a.length<=max&&p.q&&String(p.q).length<=13).map(p=>({q:String(p.q),a:p.a}))}catch(e){return[]}};
 let out=single?get('rock',80,1):get('rock',40,1).concat(get('bridge',100,3));
 const seen=new Set();out=out.filter(p=>{if(seen.has(p.q))return false;seen.add(p.q);return true});
 if(!single&&out.length<8)out=out.concat(synthMath(w,30));
 return shuffle(out)}
function uniqByAnswer(list){const s=new Set();return list.filter(p=>{if(s.has(p.a))return false;s.add(p.a);return true})}
function spellItems(w,n){
 const tier=Math.max(0,Math.min(11,w-1)),D=window.SPELLD,seed=Math.floor(rnd()*1e6);let out=[];
 try{['bridge','tower'].forEach((k,i)=>{D.forRunner(tier,k,{count:n,seed:seed+i}).forEach(x=>{if(x&&/^[a-z]{3,8}$/.test(x.w))out.push(x.w)})})}catch(e){}
 out=[...new Set(out)];
 if(out.length<8)out=out.concat(['cat','dog','pop','fox','hat','pig','bed','cup','sun','owl'].filter(x=>!out.includes(x)));
 return shuffle(out)}
function spellCues(w,n){
 const tier=Math.max(0,Math.min(11,w-1)),D=window.SPELLD,seed=Math.floor(rnd()*1e6);let out=[];
 try{D.forRunner(tier,'rock',{count:n,seed}).forEach(x=>{if(x&&x.show&&/^[a-z]$/.test(x.ans||''))out.push({show:x.show,a:x.ans,w:x.w})})}catch(e){}
 return shuffle(out)}
function mathBubbleOK(){return mathItems(worldOf('math'),true).length>=8}

/* ---------- scores (same list shape as S.streams[id].hi) ---------- */
function bestOf(sid,g){try{const l=S.streams[sid].hi[g]||[];return l.reduce((m,e)=>Math.max(m,e&&e.score||0),0)}catch(e){return 0}}
function addScore(sid,g,e){
 try{
  if(typeof X.addScore==='function')return X.addScore(sid,g,e);
  const st=S.streams&&S.streams[sid];if(!st)return;st.hi=st.hi||{};const l=(st.hi[g]=st.hi[g]||[]);l.push(e);
  l.sort((a,b)=>(b.score||0)-(a.score||0)||(b.acc||0)-(a.acc||0)||(a.at||0)-(b.at||0));l.length=Math.min(l.length,10);save();
 }catch(err){console.warn('arcade-streams score',err)}}
function finishRun(score){
 if(!ARC.sub||!ARC.on)return;ARC.on=false;
 const tot=ARC.hits+ARC.errs,acc=tot?Math.round(ARC.hits/tot*100):100;
 /* the typing records must not change: put S.arc back as it was when the run began */
 try{if(ARC.snap){S.arc=JSON.parse(ARC.snap)}}catch(e){}
 if((score|0)>0)addScore(ARC.sub,ARC.game,{score:score|0,acc,at:Date.now()});   // a 0 is never a high score
}

/* ---------- hints: never give the answer away ---------- */
function allow(){
 if(!ARC.sub||typeof G==='undefined'||!G)return true;
 if(ARC.sub==='math')return false;
 if(G.type==='bubble')return false;
 if(G.type==='meteor'){const m=G.tgt||(G.m&&G.m.length?G.m.reduce((a,b)=>a.y>b.y?a:b):null);return !(m&&m.cov)}
 if(G.type==='dig')return !ARC.digCov;
 return true}
{
 const _st=setTarget;setTarget=function(ch,ex){return _st.call(this,ARC.sub&&!allow()?null:ch,ex)};
 const _fh=fingerHTML;fingerHTML=function(c){return ARC.sub&&!allow()?'':_fh.apply(this,arguments)};
 const _gs=gsay;gsay=function(t,bad){if(ARC.sub&&bad&&/^(That was|Wait for)/.test(String(t))&&!allow())t='Try again!';return _gs.call(this,t,bad)};
 const ok=sfx.ok,bad=sfx.bad;
 sfx.ok=function(){if(ARC.on)ARC.hits++;return ok.apply(this,arguments)};
 sfx.bad=function(){if(ARC.on)ARC.errs++;return bad.apply(this,arguments)};
 const _sh=shareRunHTML;shareRunHTML=function(){return ARC.sub?'':_sh.apply(this,arguments)};
 const _mg=mountGame;mountGame=function(){const r=_mg.apply(this,arguments);
  if(ARC.sub){try{setAvail(new Set([...keyEls.keys()]),true);applyLabels()}catch(e){}}return r};
}

/* ---------- styles ---------- */
document.head.insertAdjacentHTML('beforeend',`<style id="arcstreams-css">
.met .mt i.cov:not(.on){color:transparent;display:inline-block;border-bottom:4px solid #fff6e0;margin:0 2px;min-width:.5em;line-height:.8;height:.8em;vertical-align:baseline}
.met .mt .mq{color:#ffe08a;margin-right:.3em}.mq.mqr{margin-right:0;margin-left:.3em}
.dw.cov{letter-spacing:.12em}
.tabchip{display:inline-block;border:2px solid #fff6e0;background:#2a2340;color:#fff6e0;padding:0 8px;margin:0 8px 0 0;font:700 .7em var(--mono,monospace);vertical-align:middle}
.met .mt .mq{font-size:56px;line-height:1}
.met .mt.arcbig,.met .mt.arcbig i{font-size:56px}
.kp-food .food span{white-space:nowrap}
.bub span{white-space:nowrap;text-transform:none!important}
</style>`);

/* ---------- cleanup ---------- */
function cleanup(){
 ARC.obs.forEach(o=>{try{o.disconnect()}catch(e){}});ARC.obs=[];
 ARC.timers.forEach(t=>{clearTimeout(t);clearInterval(t)});ARC.timers=[];ARC.digCov=false;ARC.tabUsed={};ARC.lastLi=-1}
const _later=(fn,ms)=>{const t=setTimeout(fn,ms);ARC.timers.push(t);return t};
const OWANTS=typeof WANTS!=='undefined'?WANTS.slice():null;let wantsMath=false;
const MATHWANTS=[{t:'an EVEN answer',f:w=>+w%2===0},{t:'an ODD answer',f:w=>+w%2===1},{t:'an answer BIGGER than 10',f:w=>+w>10},{t:'an answer SMALLER than 10',f:w=>+w<10},{t:'an answer with a 1 in it',f:w=>w.includes('1')}];
function ensureWants(math){
 if(!OWANTS||typeof WANTS==='undefined')return;
 if(math&&!wantsMath){WANTS.splice(0,WANTS.length,...MATHWANTS);wantsMath=true}
 else if(!math&&wantsMath){WANTS.splice(0,WANTS.length,...OWANTS);wantsMath=false}}
{const _show=show;show=function(id){
  if(id!=='arcade'&&id!=='game'){ARC.sub=null;ARC.on=false;cleanup();ensureWants(false)}
  if(id==='arcade'&&!ARC.sub){const c=window.KKS&&(typeof KKS.cur==='function'?KKS.cur():KKS.cur);if(c&&SUBS[c]){ARC.sub=c;ARC.on=false;cleanup()}}   /* any route to the arcade while in Math/Spell opens that subject's arcade */
  return _show.apply(this,arguments)}}

/* ---------- wrapped game functions ---------- */
{const _sp=spawnMeteor;spawnMeteor=function(){const n=G.m.length,r=_sp.apply(this,arguments);
  if(ARC.sub&&G.type==='meteor'&&G.m.length>n)try{decMeteor(G.m[G.m.length-1],G.spawned-1)}catch(e){console.warn(e)}return r}}
{const _mh=mHint;mHint=function(){const r=_mh.apply(this,arguments);
  if(ARC.sub&&G.type==='meteor'&&!allow()){G.next=null;setTarget(null);const h=q$('#ghint');if(h)h.innerHTML=ARC.sub==='spell'&&meteorChip()?chip:''}return r}}
{const _gi=gameInput;gameInput=function(ch,caps){const e0=ARC.errs,r=_gi.apply(this,arguments);
  if(ARC.sub==='spell'&&G&&G.type==='meteor'&&ARC.errs>e0){const m=G.tgt||(G.m.length?G.m.reduce((a,b)=>a.y>b.y?a:b):null);if(m&&m.cov)peekMeteor(m)}
  return r}}
{const _em=endMeteor;endMeteor=function(){
  if(!ARC.sub||!ARC.on)return _em.apply(this,arguments);
  const score=G.score;try{S.arc.meteor=bestOf(ARC.sub,'meteor')}catch(e){}   /* so "New best score!" compares with this subject's best */
  const r=_em.apply(this,arguments);finishRun(score);try{save()}catch(e){}return r}}
{const _xe=xEnd;xEnd=function(){
  if(ARC.sub&&ARC.on&&G&&!G.done){finishRun(G.score||0)}
  return _xe.apply(this,arguments)}}
/* stream arcade results: no WPM, no typing graph, no typing share/ghost cards (stats.js adds its graph a moment after the modal opens, so clean again a few times) */
function cleanResults(){
 try{const sb=q$('#ghud .ht span');if(sb&&/type the letters/i.test(sb.textContent))sb.textContent=ARC.sub==='math'?'Type the answer!':'Remember it. Type it!'}catch(e){}
 const b=q$('#mbox');if(!b)return;
 b.querySelectorAll('.tmini,.ghost-summary,[data-act=copyRun],.hs-note,.tchart,.tmore').forEach(x=>x.remove());
 b.querySelectorAll('.idlenote').forEach(x=>{x.textContent=ARC.sub==='math'?'No diamonds this time. Solve some problems to earn them!':'No diamonds this time. Spell some words to earn them!'});   // (difficulty.js idle note says "Type some letters")
 b.querySelectorAll('.rstats > div, .rstats > *, .stat, .rs').forEach(d=>{if(/wpm|words per minute/i.test(d.textContent)&&!/score|accuracy/i.test(d.textContent))d.remove()})}
/* the end modal can be rebuilt after it opens (results2/stats): watch #mbox while a subject arcade is open */
{const mb=document.getElementById('mbox');if(mb&&window.MutationObserver){let busy=false;new MutationObserver(()=>{if(busy||!ARC.sub||typeof screen==='undefined'||screen!=='game')return;busy=true;try{cleanResults()}catch(e){}busy=false}).observe(mb,{childList:true,subtree:true})}}
{const _md=modal;modal=function(){const r=_md.apply(this,arguments);
  if(ARC.sub&&typeof screen!=='undefined'&&screen==='game')[0,80,260,600].forEach(ms=>setTimeout(()=>{if(ARC.sub)cleanResults()},ms));
  return r}}

const chip='<span class="tabchip">TAB</span>';
function meteorChip(){return G.m&&G.m.some(m=>m.cov&&!m.tabUsed)}
function tabFlash(){
 if(!ARC.sub||ARC.sub!=='spell'||!ARC.on||G.done||typeof screen==='undefined'||screen!=='game')return;
 if(G.type==='meteor'){let any=false;
  G.m.forEach(m=>{if(m.cov&&!m.tabUsed){any=true;m.tabUsed=true;peekMeteor(m,Math.max(1800,(m.covMs||2000)))}});
  if(any)try{mHint()}catch(e){}}
 else if(G.type==='dig'){const li=G.li;if(ARC.digCov&&!ARC.tabUsed[li]){ARC.tabUsed[li]=1;flashRow(li,Math.max(1800,coverMs(ARC.w,Math.max(...G.L[li].ws.map(w=>w.length)))));digLayout()}}}
document.addEventListener('keydown',e=>{if(e.key==='Tab'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const mo=q$('#modal');if(mo&&!mo.hidden)return;tabFlash()}});
/* ---------- meteor ---------- */
function placeMeteor(m){
 const ar=q$('#garena'),mt=m.el.querySelector('.mt');if(!ar||!mt)return;
 const W=ar.clientWidth,half=Math.ceil(mt.offsetWidth/2)+12,lo=half,hi=Math.max(lo,W-half);
 const others=G.m.filter(x=>x!==m&&x.cx!=null);let best=null,bd=-1;
 for(let k=0;k<12;k++){const c=lo+rnd()*(hi-lo),d=others.length?Math.min(...others.map(o=>Math.abs(o.cx-c))):1e9;if(d>bd){bd=d;best=c}}
 m.cx=best;m.el.style.left=best+'px'}
function decMeteor(m,idx){
 const mt=m.el.querySelector('.mt');if(!mt)return;
 const is=[...mt.querySelectorAll('i')];mt.classList.add('arcbig');
 if(ARC.sub==='math'){
  const p=(ARC.deckP[idx]&&ARC.deckP[idx].a===m.txt)?ARC.deckP[idx]:ARC.dict[m.txt];
  is.forEach(i=>i.classList.add('cov'));
  if(p){const q=String(p.q),k=q.search(/_+|□|\?/);
   if(k>=0){const L=q.slice(0,k).trimEnd(),R=q.slice(k).replace(/^(_+|□|\?)/,'').trimStart();   /* answer slots sit where the blank is */
    if(L)mt.insertAdjacentHTML('afterbegin',`<span class="mq">${E(L)}</span>`);if(R)mt.insertAdjacentHTML('beforeend',`<span class="mq mqr">${E(R)}</span>`)}
   else mt.insertAdjacentHTML('afterbegin',`<span class="mq">${E(q)}${/=/.test(q)?'':' ='}</span>`)}
  placeMeteor(m);return}
 placeMeteor(m);
 const ms=coverMs(ARC.w,m.txt.length);
 if(ms===Infinity)return;
 m.covMs=ms;_later(()=>coverMeteor(m),ms)}
function coverMeteor(m){if(!ARC.sub||G.done||!m.el.isConnected)return;m.el.querySelectorAll('.mt i').forEach(i=>i.classList.add('cov'));m.cov=true;try{mHint()}catch(e){}}
function peekMeteor(m,ms){m.el.querySelectorAll('.mt i').forEach(i=>i.classList.remove('cov'));m.cov=false;try{mHint()}catch(e){}
 clearTimeout(m.pk);m.pk=_later(()=>coverMeteor(m),ms||1300)}
function prepMeteor(){
 const sub=ARC.sub;let words,deck=[];
 G.beast=false;G.speed=Math.min(G.speed||1,1);G.maxSpeed=Math.min(G.maxSpeed||3,1.5);G.maxOn=3;G.minGap=Math.max(G.minGap||1.3,sub==='math'?5:2.8);
 G.total=Math.round(16*S.set.len);G.shields=5;try{gUpdate()}catch(e){}
 if(sub==='math'){
  const items=ARC.items;ARC.dict={};items.forEach(p=>{if(!ARC.dict[p.a])ARC.dict[p.a]=p});
  while(deck.length<G.total+12)deck=deck.concat(shuffle(items));
  ARC.deckP=deck;words=[...new Set(items.map(p=>p.a))];G.wordDeck=deck.map(p=>p.a);
 }else{
  words=ARC.items;while(deck.length<G.total+12)deck=deck.concat(shuffle(words));G.wordDeck=deck;
 }
 G.words=words;G.set=words;G.wordP=1}

/* ---------- bubble ---------- */
function prepBubble(){
 const sub=ARC.sub;let cues;
 if(sub==='math'){const it=ARC.items;cues=[];while(cues.length<22)cues=cues.concat(shuffle(it));cues=cues.slice(0,22).map(p=>({show:p.q+(/[=_?□]/.test(p.q)?'':' ='),a:p.a}))}
 else{const c=ARC.cues;cues=[];while(cues.length<22)cues=cues.concat(shuffle(c));cues=cues.slice(0,22)}
 ARC.cues=cues;G.deck=cues.map(c=>c.a);G.total=cues.length;G.hearts=5;const hb=q$('#g-b');if(hb)hb.textContent='♥♥♥♥♥';
 const ar=q$('#garena');
 if(ar){const ob=new MutationObserver(ms=>ms.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1&&n.classList.contains('bub')){const c=cues[G.spawned-1],sp=n.querySelector('span');if(c&&sp)sp.textContent=c.show}})));ob.observe(ar,{childList:true});ARC.obs.push(ob)}
 let lastSp=G.spawned;
 const iv=setInterval(()=>{if(G.done||G.type!=='bubble'){clearInterval(iv);return}
  G.b.forEach(o=>{if(!o.slow){o.slow=1;o.v*=.5}});
  if(G.spawned!==lastSp){lastSp=G.spawned;G.next+=1.4}},100);ARC.timers.push(iv)}

/* ---------- dig ---------- */
function digLayout(){
 const box=q$('#gstripIn');if(!box||!G.L)return;const row=G.L[G.li];if(!row)return;
 const hide=ARC.sub==='math'||ARC.digCov;const tc=ARC.sub==='spell'&&ARC.digCov&&!ARC.tabUsed[G.li]?chip:'';
 if(ARC.sub==='spell'&&G.li!==ARC.lastLi)revealRow(G.li);
 if(hide&&G.typed){
  const m=row.ws.find(w=>w.startsWith(G.typed))||G.typed;
  box.innerHTML=[...m].map((c,k)=>`<span class="${k<G.typed.length?'ok':k===G.typed.length?'cur':''}">${k<G.typed.length?E(c):'_'}</span>`).join('');
  const cur=box.querySelector('.cur')||box.lastElementChild,st=q$('#gstrip');
  if(cur&&st)box.style.transform=`translateX(${st.clientWidth/2-(cur.offsetLeft+cur.offsetWidth/2)}px)`;
  const h=q$('#ghint');if(h)h.innerHTML='';
 }else if(!G.typed&&hide){const h=q$('#ghint');if(h)h.innerHTML=ARC.sub==='math'?'Pick any one!':tc+'Pick any word!'}
}
const gap=w=>w[0]+' _'.repeat(w.length-1);
function coverEl(e){if(!e||!e.dataset||!e.dataset.w)return;e.classList.add('cov');e.textContent=gap(e.dataset.w)}
function uncoverEl(e){if(!e||!e.dataset||!e.dataset.w)return;e.classList.remove('cov');e.textContent=e.dataset.w}
function flashRow(li,ms){rowEls(li).forEach(uncoverEl);ARC.digCov=false;clearTimeout(ARC.dt);
 ARC.dt=_later(()=>{if(G.done||G.li!==li)return;rowEls(li).forEach(coverEl);ARC.digCov=true;setTarget(null);digLayout()},ms)}
function rowEls(li){return [...document.querySelectorAll(`[id^="dw${li}_"]`)]}
function revealRow(li){
 ARC.lastLi=li;rowEls(li).forEach(uncoverEl);ARC.digCov=false;
 const ms=coverMs(ARC.w,Math.max(...(G.L[li]?G.L[li].ws:['a']).map(w=>w.length)));
 if(ms===Infinity)return;
 clearTimeout(ARC.dt);ARC.dt=_later(()=>{if(G.done||G.li!==li)return;rowEls(li).forEach(coverEl);ARC.digCov=true;setTarget(null);digLayout()},ms)}
function prepDig(){
 const sub=ARC.sub;
 if(sub==='math'){G.L.forEach((l,k)=>l.ws.forEach((w,q)=>{const el=q$(`#dw${k}_${q}`),p=ARC.dict[w];if(el&&p)el.textContent=p.q}))}
 else{ARC.tabUsed={};G.L.forEach((l,k)=>l.ws.forEach((w,q)=>{const e=q$(`#dw${k}_${q}`);if(e){e.dataset.w=w;if(k!==0)coverEl(e)}}))}
 G.left=Math.round(G.left*1.4);
 const xin=G.xin,e0={n:0};
 G.xin=function(ch){const b=ARC.errs;xin.call(this,ch);
  if(G.done)return;
  if(sub==='spell'&&ARC.errs>b&&ARC.digCov){/* missed: show the row again for a moment */
   flashRow(G.li,1300)}
  digLayout()};
 if(sub==='spell')revealRow(0);digLayout()}

/* ---------- keeper (math) ---------- */
function prepKeeper(){
 G.goal=12;G.left=Math.round(G.left*1.5);
 const fix=()=>{(G.opts||[]).forEach((w,k)=>{const sp=q$('#fd'+k+' span'),p=ARC.dict[w];if(sp&&p)sp.textContent=p.q+(/[=_?□]/.test(p.q)?'':' =')})};
 const f=q$('#kpfood');if(f){const ob=new MutationObserver(fix);ob.observe(f,{childList:true});ARC.obs.push(ob)}fix()}

/* ---------- start a stream arcade game ---------- */
const ORIG={};
function startSub(g,orig,args){
 const sub=ARC.sub,w=worldOf(sub);cleanup();
 ARC.game=g;ARC.w=w;ARC.hits=0;ARC.errs=0;ARC.on=false;
 try{ARC.snap=JSON.stringify(S.arc)}catch(e){ARC.snap=null}
 /* content for this run */
 if(sub==='math'){ARC.items=g==='bubble'?mathItems(w,true):(g==='dig'||g==='keeper'?uniqByAnswer(mathItems(w,false)):mathItems(w,false));
  if(g==='bubble'&&ARC.items.length<8)ARC.items=mathItems(w,false).filter(p=>p.a.length===1);
  if(g==='dig'||g==='keeper'){ARC.dict={};ARC.items.forEach(p=>ARC.dict[p.a]=p)}}
 else{if(g==='bubble')ARC.cues=spellCues(w,40);else ARC.items=spellItems(w,60)}
 const xw=typeof xWords==='function'?xWords:null;
 try{
  if(g==='dig'&&xw){const list=sub==='math'?ARC.items.map(p=>p.a):ARC.items;xWords=()=>list.slice()}
  if(g==='keeper'){ensureWants(true);if(xw){const list=ARC.items.map(p=>p.a);xWords=()=>list.slice()}}
  orig.apply(null,args);
 }finally{if(xw)xWords=xw}
 try{
  const sb=q$('#ghud .ht span');if(sb)sb.textContent=({meteor:sub==='math'?'Type the answer!':'Remember it. Type it!',bubble:sub==='math'?'Type the answer!':'Type the missing letter!',dig:sub==='math'?'Solve it. Type the answer!':'Remember it. Type it!',keeper:'Type the right answer!'})[g];
  G._hs=1;                                   /* keep these runs off the typing high-score board */
  if(g==='meteor')prepMeteor();else if(g==='bubble')prepBubble();else if(g==='dig')prepDig();else if(g==='keeper')prepKeeper();
 }catch(e){console.warn('arcade-streams prep',e)}
 ARC.on=true}
Object.keys(SUBS).forEach(()=>{});
['meteor','bubble','dig','keeper'].forEach(g=>{
 const orig=ACT[g];if(!orig)return;ORIG[g]=orig;
 ACT[g]=function(){
  if(ARC.sub&&SUBS[ARC.sub].games.includes(g))return startSub(g,orig,arguments);
  ensureWants(false);ARC.on=false;return orig.apply(this,arguments)}});


/* ---------- picker card art for Math / Spelling: the typing art shows home-row letters; here the bubbles carry numbers (Math) or letter blanks (Spelling) ---------- */
const F3={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001111','+':'000010111010000','=':'000111000111000','?':'111001011000010','_':'000000000000111','A':'010101111101101','C':'111100100100111','T':'111010010010010','O':'111101101101111','E':'111100110100111','I':'111010010010111'};
function g3(g,str,x,y,col){g.fillStyle=col;[...str].forEach((ch,n)=>{const m=F3[ch];if(!m)return;for(let k=0;k<15;k++)if(m[k]==='1')g.fillRect(x+n*4+k%3,y+Math.floor(k/3),1,1)})}
function artFix(kind,sub){
 try{const A=window.ARCART;if(!A||!A[kind])return '';const c=A[kind](),g=c.getContext('2d'),Wd=84;
  const clr=(x,y,w,h,sx,sy)=>{const d=g.getImageData(sx,sy,1,1).data;g.fillStyle='rgb('+d[0]+','+d[1]+','+d[2]+')';g.fillRect(x,y,w,h)};
  for(let f=0;f<2;f++){const ox=f*Wd;
   if(kind==='bubble'){
    const B=[[38,22-f*2,'big'],[56,12-f*2,f===1],[52,32-f,0],[24,8-f,0],[72,8-f,f===0]],
     tx=sub==='math'?['7+5','3','9','2','4']:['C_T','A','_','O','_'];
    B.forEach(([x,y,pop],i)=>{const big=pop==='big',t=tx[i];
     if(big){clr(ox+x-5,y-2,11,5,ox+x,y+5);g3(g,t,ox+x-5,y-2,'#1e3a68')}
     else{clr(ox+x-1,y-2,3,5,ox+x+3,y);g3(g,t,ox+x-1,y-2,pop?'#fff6e0':'#1e3a68')}})}
   else if(kind==='keeper'&&sub==='math'){g.fillStyle='#f0c860';g.fillRect(ox+61,9,18,7);g3(g,'7+2',ox+65,10,'#2a1d3e')}   /* the sign (was a typing letter 'A' and a dash) */}
  return c.toDataURL()}catch(e){return ''}}
function fixCardArt(card,sub,g){
 if(!((g==='bubble')||(g==='keeper'&&sub==='math')))return;
 const z=card.querySelector('.zimg');if(!z)return;const u=artFix(g,sub);if(u)z.style.backgroundImage='url('+u+')'}

/* ---------- picker (typing picker, filtered and re-worded) ---------- */
const DESC={math:{meteor:'Type the answer to zap the rocks!',bubble:'Type the answer to pop the bubble!',dig:'Solve it to dig for treasure!',keeper:'Feed the Keylori the right answer!'},
 spell:{meteor:'Remember the word. Then type it!',bubble:'Type the missing letter!',dig:'Remember the word. Dig for treasure!'}};
{const _ra=renderArcade;renderArcade=function(){
  const r=_ra.apply(this,arguments);
  if(!ARC.sub)return r;
  try{
   const sub=ARC.sub,def=SUBS[sub],w=worldOf(sub),root=q$('#s-arcade');if(!root)return r;
   const h2=root.querySelector('.topbar h2');if(h2)h2.textContent=def.name+' Arcade';
   root.querySelectorAll('.topbar .hsbtn,.arcade-toggles,#s-arcade>p.muted').forEach(e=>e.remove());
   root.querySelector('.arcade-toggles')?.remove();
   root.querySelectorAll('.diffbar .seg button').forEach(b=>{if(/^beast/.test(b.dataset.v||''))b.remove()});
   const okBub=sub==='spell'||mathBubbleOK();
   root.querySelectorAll('.games .game').forEach(card=>{
    const b=[...card.querySelectorAll('button[data-act]')].find(x=>def.games.includes(x.dataset.act));
    if(!b||(b.dataset.act==='bubble'&&!okBub)){card.remove();return}
    const g=b.dataset.act;card.querySelectorAll('.insbtn').forEach(x=>x.remove());
    const p=card.querySelector('p:not(.note)');if(p)p.textContent=DESC[sub][g];
    fixCardArt(card,sub,g);
    card.querySelectorAll('.arcade-stats,.note').forEach(x=>x.remove());
    b.insertAdjacentHTML('beforebegin',`<div class="arcade-stats"><div class="arcade-stat"><b>${bestOf(sub,g)}</b><span>Best score</span></div><div class="arcade-stat"><b>World ${w}</b><span>Your level</span></div></div>`)});
  }catch(e){console.warn('arcade-streams picker',e)}
  return r}}

/* ---------- public API ---------- */
function open(sub){ARC.sub=sub;ARC.on=false;cleanup();show('arcade')}
X.arcade=Object.assign(X.arcade||{},{math:()=>open('math'),spell:()=>open('spell')});
X.gameNames=Object.assign(X.gameNames||{},{math:Object.assign({},(X.gameNames||{}).math,{meteor:'Meteor Zap',bubble:'Bubble Pop',dig:'Treasure Dig',keeper:'Keylori Keeper'}),spell:Object.assign({},(X.gameNames||{}).spell,{meteor:'Meteor Zap',bubble:'Bubble Pop',dig:'Treasure Dig'})});
X.arcadeDebug=ARC;
})();
