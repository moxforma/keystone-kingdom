/* Keyloria Run <-> Keyloria Kingdom bridge.
   1. PER-PART RUNNERS: inside every lesson the 8 parts alternate classic, runner, classic, runner...: parts 2, 4, 6 and 8 are runner levels
      (Reviews and Practice lessons included, Boss Tests excluded). A runner part uses that lesson's letters (its new keys favoured, plus everything learned so far)
      and words made of them. It records stars for THAT PART only, exactly like a classic part (XP, diamonds, Keylori, evolution, holo, next-part unlock),
      and Next goes to the next part (classic or runner). 2 fails in a row show the Slower button.
   1b. HYBRID BOSS TEST: the Boss Test starts as the classic boss typing and, when that ends, the Scrambler runs away: a short
      boss-only runner (run-up + the runner boss, bigger HP, crown for the last group) follows. One combined results modal.
   1c. WORLD TIER: runners and boss chases get faster and harder in later worlds (tier 0 = first world ... last world), see tierOf() and the cfg builders.
   2. A "Keyloria Run" card in the Arcade opens free play (stars and diamonds; diamonds go to the real save).
   3. Grown-up switch "Runner levels" (default on) and phone/mobile mode fall back to the classic parts. */
(function(){
if(!window.RUNNER||typeof S==='undefined'||typeof startStage!=='function'||typeof LESSONS==='undefined')return;
const RU=window.RUNNER;RU.embedded=true;
const ST=typeof NST!=='undefined'?NST:8;

/* ---------- grown-up switch ---------- */
try{if(window.PAR_LIST&&!PAR_LIST.some(p=>p[0]==='runner'))PAR_LIST.splice(Math.min(1,PAR_LIST.length),0,['runner','Runner levels'])}catch(e){}
const on=k=>{try{return typeof parOn==='function'?parOn(k):true}catch(e){return true}};
const mobile=()=>{try{return !!(window.KK_MOBILE||document.body.classList.contains('mobile'))}catch(e){return false}};
const enabled=()=>on('runner')&&!mobile();

/* ---------- fonts (the runner draws its text from Press Start 2P and caches the glyphs) ---------- */
let fontOK=false;const fontP=(()=>{try{return document.fonts?document.fonts.load('8px "Press Start 2P"').then(()=>{fontOK=true},()=>{fontOK=true}):Promise.resolve()}catch(e){return Promise.resolve()}})();
fontP.then(()=>{fontOK=true});

/* ---------- lesson helpers ---------- */
const isReview=i=>!!(LESSONS[i]&&LESSONS[i].sp==='x9r');
const isBossT=i=>!!(LESSONS[i]&&LESSONS[i].sp==='x9b');
const title=i=>{try{return lessonTitle(i)}catch(e){return LESSONS[i].t||'Review'}};
const nextOf=i=>{try{const o=window.ORDER||[],k=o.indexOf(i),nx=k>=0?o[k+1]:null;return nx!=null&&LESSONS[nx]?nx:null}catch(e){return null}};
const nextN=i=>{const nx=nextOf(i);return nx!=null?nx*ST:null};
const lowerLetters=set=>[...set].filter(c=>/^[a-z]$/.test(c));
const intros=i=>{try{return introItems(i).length}catch(e){return 1}};
function groupNew(i){const r=LESSONS[i].r,s=new Set();LESSONS.forEach((L,j)=>{if(L.r===r&&!(L.sp&&/^x9/.test(L.sp))&&L.k&&j<=(LESSONS[i].src==null?j:LESSONS[i].src))[...L.k].forEach(c=>{if(/[a-z]/.test(c))s.add(c)})});return [...s].join('')}

/* ---------- which parts are runners: parts 2, 4, 6, 8 of every lesson except the Boss Test (the Boss Test is the hybrid below) ---------- */
const isRunnerPart=n=>{try{const i=Math.floor(n/ST),s=n%ST;return !!LESSONS[i]&&!isBossT(i)&&s%2===1}catch(e){return false}};
window.isRunnerPart=isRunnerPart;
/* kept for older callers: a lesson "has runners" when it is not a Boss Test */
window.isRunnerLesson=i=>{try{return !!LESSONS[i]&&!isBossT(i)}catch(e){return false}};
window.runnerLessonMap=()=>(window.ORDER||[]).map((i,k)=>({k,i,t:LESSONS[i].t||lessonTitle(i),r:LESSONS[i].r,runParts:isBossT(i)?[]:[1,3,5,7].filter(s=>!!cfgForPart(i,s)),hy:isBossT(i)&&!!cfgFor(i)}));

/* ---------- difficulty by world ----------
   tier = world index (0 = Keyloria ... last world). Everything below is 0 / unchanged at tier 0 and grows with the tier:
   speed +8% per world, tighter gaps, longer words, more capitals (from world 3), more towers / forks / ambushes (see tierBuild), boss HP and speed (runner-boss.js reads R.L.tier). */
const TIER_MAX=()=>Math.max(1,(window.WORLDS?WORLDS.length:12)-1);
function tierOf(i){try{const w=typeof worldOf==='function'?worldOf(i):1;return Math.max(0,Math.min(TIER_MAX(),(+w||1)-1))}catch(e){return 0}}
window.runnerTierOf=tierOf;
function levelCfg(i,s){
 const all=lowerLetters(learned(i)).sort().join('');if(all.length<2)return null;
 const L=LESSONS[i],n=all.length,t=tierOf(i),rev=isReview(i);
 // the lesson's new keys (practice lessons use the lesson they practise, a Review the whole group's new keys)
 let nw=rev?groupNew(i):lowerLetters((L.sp&&/^x9/.test(L.sp)&&L.src!=null&&LESSONS[L.src]?LESSONS[L.src].k:L.k)||'').join('');
 nw=[...new Set(nw)].filter(c=>all.includes(c)).join('');
 const lvB=n<=3?0:n<=6?1:n<=10?2:n<=16?3:4,wd=n>=6;
 const cfg={name:title(i),keys:all,favor:nw,wfav:nw&&wd?.6:0,caps:Math.max(L.sp==='caps'?.3:0,t>=2?Math.min(.22,.025*(t-1)):0),
  words:wd?Math.min(.5,.3+.02*t):0,n:12+(n>=12?2:0)+((s||0)>>1)+Math.round(.8*t),
  v:Math.round((66+Math.min(14,n))*(1+.08*t)),lv:Math.min(5,lvB+Math.floor(t/3)),tier:t,back:'map'};
 if(t>0){cfg.gapMul=Math.max(.6,1-.04*t);cfg.wmax=5+Math.floor(t/3);if(t>=6)cfg.wmin=4}
 return cfg}
/* a runner part (2, 4, 6, 8 of a lesson) */
function cfgForPart(i,s){
 const cfg=levelCfg(i,s);if(!cfg)return null;
 return Object.assign(cfg,{sub:'Part '+(s+1)+' of '+ST+' · Run',partS:s})}
/* the Boss Test's runner (hybrid) starts from the same numbers */
function cfgFor(i){
 const cfg=levelCfg(i,ST-1);if(!cfg)return null;
 return Object.assign(cfg,{favor:'',wfav:0,sub:'Practice run'})}
/* ---------- recording progress (mirrors the pass/fail branch of finish() in game.js, for ONE part) ---------- */
const fkey=(i,s)=>i+'-'+s;
const fails=(i,s)=>((S.runf||{})[fkey(i,s)])|0;
function record(i,s,info,x){
 const R=info.R,stars=info.stars,pass=stars>=1;
 try{const secs=(performance.now()-R.start)/1000+((x&&x.secs)||0);S.time+=Math.round(secs);if(typeof sessionSecs!=='undefined')sessionSecs+=secs}catch(e){}
 S.rounds++;S.lastLesson=i;
 const oldL=levelOf(S.xp),out={pass,stars,xp:(R.typed||0)+((x&&x.typed)||0)+(pass?20*stars:5),gems:0,newCard:false,evo:null,evoFrom:formNow(i),badge:null,holo:[],lucky:null,egg:null,mast:0,s};
 let gems=0;
 if(pass){
  const k=fkey(i,s),prev=S.best[k]||0;gems=Math.max(0,stars-prev)*2+(prev===0?1:0);
  const f0=formNow(i);
  // the hybrid Boss Test is the only way through a Boss Test (any of its parts opens it), so beating it also clears that lesson's other parts
  if(x)for(let q=0;q<ST-1;q++){const kk=fkey(i,q);S.best[kk]=Math.max(S.best[kk]||0,1)}
  S.best[k]=Math.max(prev,stars);
  const f1=formNow(i),ck=i+'-'+f0;
  if(!S.cards[ck]){S.cards[ck]={holo:false};out.newCard=true}
  for(let f=f0+1;f<=f1;f++){const nk=i+'-'+f;if(!S.cards[nk])S.cards[nk]={holo:false};out.evo=f}
  [0,1,2].forEach(f=>{const c=S.cards[i+'-'+f];if(c&&!c.holo&&BAND[f].every(q=>(S.best[i+'-'+q]||0)===3)){c.holo=true;out.holo.push(f)}});
  try{out.lucky=rollLucky(i);if(out.lucky&&out.lucky.gems)gems+=out.lucky.gems}catch(e){}
  try{if(typeof MAST_PTS!=='undefined'&&lessonPts(i)>=MAST_PTS&&!(S.mast||{})[i]){S.mast=S.mast||{};S.mast[i]=1;S.gems+=MAST_GEMS;out.mast=1}}catch(e){}
  try{const r=LESSONS[i].r;if(!S.badges.includes(r)&&regionDone(r)){S.badges.push(r);out.badge=REGIONS[r].name}}catch(e){}
  try{const A=S.asga;if(A&&A.i===i&&Array.isArray(A.st)){const sl=x?Array.from({length:ST},(_,q)=>q):[s];sl.forEach(q=>{if(!A.st.includes(q))A.st.push(q)})}}catch(e){}
  S.runf=S.runf||{};S.runf[fkey(i,s)]=0;
  try{out.egg=dailyEgg()}catch(e){}
 }else{S.runf=S.runf||{};S.runf[fkey(i,s)]=fails(i,s)+1}
 gems+=info.gems|0;out.gems=gems;
 S.xp+=out.xp;S.gems+=gems;
 try{S.hist.push({t:Date.now(),w:info.wpm,a:info.acc});if(S.hist.length>80)S.hist.shift()}catch(e){}
 const newL=levelOf(S.xp);out.lvl=newL>oldL?newL:0;
 try{save()}catch(e){console.error(e)}
 return out}
/* the part that follows (classic or runner) in play order */
const nextPartN=(i,s)=>s<ST-1?i*ST+s+1:nextN(i);

const starStr=n=>'★'.repeat(n)+'☆'.repeat(3-n);
function resultsFor(i,s,info,hy){
 const o=record(i,s,info,hy?{typed:hy.len,secs:hy.secs}:null),sp=SPECIES[i]?SPECIES[i].n:['Keylori'];let h='';
 const nm=sp[Math.min(sp.length-1,o.evo!=null?Math.max(0,o.evoFrom):formNow(i))];
 const slowOK=fails(i,s)>=2&&RU.opt.spd>0;
 if(o.pass){
  if(o.newCard)h+=`<div class="banner">You befriended ${esc(nm)}!</div>`;
  if(o.evo!=null)h+=`<div class="banner gold">${esc(sp[o.evoFrom])} evolved into ${esc(sp[o.evo])}!</div>`;
  o.holo.forEach(f=>{h+=`<div class="banner">Your ${esc(sp[f])} card is now HOLO!</div>`});
  if(o.mast){try{h+=`<div class="banner gold">♛ ${esc(sp[2])} MASTERED! +${MAST_GEMS} diamonds</div>`}catch(e){}}
  if(o.lvl)h+=`<div class="banner gold">Level up! You are now Level ${o.lvl}: ${titleOf(o.lvl)}</div>`;
  if(o.badge)h+=`<div class="banner gold">You earned the ${esc(o.badge)} badge!</div>`;
  if(o.lucky&&o.lucky.gems)h+=`<div class="banner luck">Lucky find! +${o.lucky.gems} diamonds</div>`;
  try{h+=eggBanner(o.egg)}catch(e){}
  if(hy)h+=hybridExtras(i,o);
  if(s===ST-1){const bn=nextN(i);if(bn!=null)h+=`<div class="banner gold">${esc(title(Math.floor(bn/ST)))} unlocked!</div>`}
  try{setTimeout(()=>{if(o.lvl)sfx.lvl()},500)}catch(e){}
 }else{
  if(slowOK)h+=`<p class="note" style="margin:0">Want to go slower? Tap Slower.</p>`;
 }
 const stats=`<div class="rstats"><div><b>${o.stars} ★</b><span>Stars</span></div><div><b>${info.acc}%</b><span>Accuracy</span></div><div><b>${info.wpm}</b><span>WPM</span></div><div><b>+${o.xp}</b><span>XP</span></div><div><b>+${o.gems}</b><span>Diamonds</span></div></div>`;
 let btns;
 const again=hy?'hyAgain':'runAgain',slow=hy?'hySlow':'runSlow';
 if(o.pass){const bn=nextPartN(i,s);btns=(bn!=null?`<button class="btn nextbtn" data-act="play" data-n="${bn}">Next ▸</button>`:'')+`<button class="btn alt" data-act="${again}">Play again</button><button class="btn alt" data-act="go" data-to="map">Map</button>`}
 else btns=`<button class="btn nextbtn" data-act="${again}">Try again</button>${slowOK?`<button class="btn" data-act="${slow}">Slower</button>`:''}<button class="btn alt" data-act="go" data-to="map">Map</button>`;
 return {html:h,stats,btns,head:o.pass?null:'So close!'}}

/* ---------- opening a runner part ---------- */
function cfgWithResults(i,s,cfg){
 if(cfg.hybrid){const c=HY&&HY.c;cfg.results=info=>resultsFor(i,s,info,c);cfg.startExtra=()=>'';
  cfg.adjust=info=>{const R=info.R,rm=Math.max((performance.now()-R.start)/60000,1/60);
   return {stars:Math.min(c.stars,info.stars),acc:Math.round((c.ok+R.hits)/Math.max(1,c.len+R.hits+R.miss)*100),wpm:Math.round((c.len+R.typed)/5/Math.max(c.secs/60+rm,1/60))}};
  return cfg}
 cfg.results=info=>resultsFor(i,s,info);
 cfg.startExtra=()=>{const b=Math.min(3,S.best[i+'-'+s]||0);return `<p class="note" style="margin:2px 0 6px">${b?'Best: '+starStr(b):'Get 1 star to open the next part!'}</p>`};
 return cfg}
function openRunner(i,s,cfg,fallback){
 const go=()=>{try{try{if(typeof P!=='undefined'&&P){clearInterval(P.idle);P.phase='off'}}catch(e){}RU.backTo=null;RU.open(cfgWithResults(i,s,cfg))}catch(e){console.error('[runner-lesson]',e);try{RU.close()}catch(_){}fallback()}};
 if(fontOK)go();else Promise.race([fontP,new Promise(r=>setTimeout(r,900))]).then(go)}
/* ---------- flow state: hybrid Boss Test + a runner part whose lesson intro was skipped ---------- */
let HY=null,RL=null;   // HY = {i,n,c} the Boss Test being played (c = classic part result); RL = {i,s,cfg,n} a runner part waiting for its lesson's new-key intro (only when part 1 was never played)
const isFinal=i=>{try{return ORDER[ORDER.length-1]===i}catch(e){return false}};
window.isHybridBossTest=i=>{try{return isBossT(i)&&enabled()&&!!cfgFor(i)}catch(e){return false}};
const _ss=startStage;
startStage=function(n,mode){
 HY=null;RL=null;
 try{if(!mode&&enabled()){const i=Math.floor(n/ST),s=n%ST;
  if(isBossT(i)){const cfg=cfgFor(i);if(cfg){try{closeModal()}catch(e){}const bn=i*ST+ST-1;HY={i,n:bn,c:null};return _ss.call(window,bn)}}   // classic boss typing first (any part of the Boss Test starts the whole thing)
  else if(isRunnerPart(n)){const cfg=cfgForPart(i,s);if(cfg){try{closeModal()}catch(e){}
   if(intros(i)>0&&(S.best[i+'-0']||0)<1){RL={i,s,cfg,n};return _ss.call(window,i*ST)}   // part 1 was skipped: show the new-key intro first (normally part 1, a classic part, already did)
   openRunner(i,s,cfg,()=>_ss.call(window,n));return}}}}catch(e){console.error('[runner-lesson]',e)}
 return _ss.apply(this,arguments)};
const _br=beginRound;
beginRound=function(){
 try{if(RL&&typeof P!=='undefined'&&P&&P.i===RL.i&&P.phase==='wait'&&screen==='play'){const r=RL;RL=null;openRunner(r.i,r.s,r.cfg,()=>{try{_br.apply(window)}catch(e){console.error(e)}});return}}catch(e){console.error('[runner-lesson]',e)}
 return _br.apply(this,arguments)};

/* ---------- later worlds: extra towers, forks and ambushes ----------
   The base builders (runner-paths / runner-jumps / runner-action) key off RUNNER.opt.lv. The bridge raises lv with the tier (max 5) and, from world 4 on,
   asks those same builders for extra passes (temporarily choosing a level) so the tier gives more forks, towers (double / triple / word) and ambushes. */
const hookBy=f=>{try{return RU.HK.build.find(h=>h!==tierBuild&&f(h))}catch(e){return null}};
function tierBuild(R){
 const L=R&&R.L,t=(L&&+L.tier)||0;if(!L||!L.custom||L.hybrid||t<3)return;
 const opt=RU.opt,lv0=opt.lv,src=h=>{try{return String(h)}catch(e){return ''}};
 const paths=hookBy(h=>h.name==='build'),jumps=hookBy(h=>/runner-jumps build/.test(src(h))),plan=hookBy(h=>/runner-action build/.test(src(h)));
 const act=()=>{try{return RU.action&&RU.action.state()}catch(e){return null}};
 const pass=(h,lv)=>{if(!h)return;try{opt.lv=lv;h(R)}catch(e){console.warn('[runner-lesson tier]',e)}finally{opt.lv=lv0}};
 // forks: one extra pass from world 6 on (lv 1 keeps the flap section out: there is one per run already)
 const forks=t>=5?1:0;for(let k=0;k<forks;k++)pass(paths,1);
 // ambushes: ask the planner again and keep a few extra, spaced like the originals
 try{const a0=act();const extra=(t>=4?1:0)+(t>=8?1:0)+(t>=11?1:0);
  if(plan&&a0){const p1=[];pass(plan,lv0);const a1=act();if(a1&&a1.plan)p1.push(...a1.plan);   // plan A, on the final geometry
   pass(plan,lv0);const a2=act(),pB=a2&&a2.plan?a2.plan.slice():[];                                // plan B
   const sep=((t>=8?1.7:2.7)+1.45)*R.v*1.2+160,out=p1.slice();let add=0;
   pB.sort(()=>Math.random()-.5).forEach(X=>{if(add<extra&&out.every(q=>Math.abs(q-X)>=sep)){out.push(X);add++}});
   out.sort((p,q)=>p-q);if(a2){a2.plan=out;if(t>=8)a2.hard=true}}}   // world 9+: ambushers throw two blobs and faster (the action module's own hard settings)
 catch(e){console.warn('[runner-lesson tier]',e)}
 // towers: a bigger mix in later worlds (tower builder re-reads lv)
 pass(jumps,t>=9?5:t>=6?3:1);
 try{R.obs.sort((a,b)=>a.x-b.x)}catch(e){}
}
RU.HK.build.push(tierBuild);
/* ---------- hybrid Boss Test: classic part ends -> chase beat -> boss-only runner -> one combined results modal ---------- */
try{const st=document.createElement('style');st.textContent='.hychase{width:112px;height:112px;margin:24px auto 0}.hychase svg{width:100%;height:100%;display:block}';document.head.appendChild(st)}catch(e){}
const _fin=finish;
finish=function(){
 try{if(HY&&typeof P!=='undefined'&&P&&P.i===HY.i&&P.n===HY.n&&!P.mode&&!P.practice&&P.phase==='play'&&screen==='play')return hybridClassicDone()}catch(e){console.error('[runner-lesson]',e);HY=null}
 return _fin.apply(this,arguments)};
function hybridClassicDone(){
 P.phase='done';clearInterval(P.idle);try{setTarget(null)}catch(e){}
 const len=P.text.length,ok=len-P.mist.size,acc=Math.round(ok/len*100),secs=(performance.now()-P.start)/1000,wpm=Math.round(len/5/Math.max(secs/60,1/60)),stars=acc>=95?3:acc>=85?2:acc>=60?1:0;
 const c=HY.c={len,ok,acc,wpm,secs,stars};
 try{HY.vk=P.vkey;HY.vname=(document.querySelector('#s-play .fmeter .fname')||{}).textContent||''}catch(e){}   // the runner boss is the same Scrambler (same name, crowned like the classic boss)
 try{const v=document.getElementById('vil');v&&v.classList.add(stars?'pop':'laugh')}catch(e){}
 if(stars<1){try{say('Try again! Go slow.')}catch(e){}setTimeout(()=>{if(HY&&HY.c===c&&screen==='play')hybridFail(c)},900);return}
 try{sfx.win()}catch(e){}try{say('The Scrambler runs away!')}catch(e){}
 setTimeout(()=>{if(HY&&HY.c===c&&screen==='play')chaseModal()},1100)}
function chaseModal(){
 let nm='The Scrambler',v='';try{nm=(document.querySelector('#s-play .fmeter .fname')||{}).textContent||nm;const e=document.getElementById('vil');v=e?e.innerHTML:''}catch(e){}
 HY.t0=performance.now();
 modal(`<div data-runner="chase"><h2>${esc(nm)} runs away!</h2><div class="hychase">${v}</div><p style="margin:6px 0">Chase it!</p><div class="rbtns"><button class="btn big nextbtn" data-act="hyChase">Chase! (SPACE)</button></div></div>`);
 try{speak('Chase it!')}catch(e){}}
function hybridFail(c){
 const i=HY.i,info={stars:0,acc:c.acc,wpm:c.wpm,gems:0,nice:0,bonks:0,best:0,R:{start:performance.now(),typed:0,hits:0,miss:0}},cx=resultsFor(i,ST-1,info,c);
 const st=[1,2,3].map(k=>ICON.star.replace('<svg','<svg class=""')).join('');
 modal(`<div data-runner="done"><h2>${cx.head||'So close!'}</h2><div class="bigstars">${st}</div>${cx.html||''}<p class="note" style="margin:0">Try again! Go slow.</p>${cx.stats}<div class="rbtns">${cx.btns}</div></div>`)}
/* the Boss Test prize and the Keystone shard, exactly as the classic results screen gives them */
function hybridExtras(i,o){let h='';
 try{const L=LESSONS[i];if(L&&L.bt){S.btp=S.btp||{};if(!S.btp[i]){S.btp[i]=1;const g=25+(o.stars===3?10:0);S.gems+=g;save();h+=`<div class="banner gold">Boss Test beaten! Prize: +${g} diamonds</div>`}}}catch(e){console.warn(e)}
 try{const st=storyState();for(let w=1;w<=STORY.length;w++)if(shardWon(w)&&!st.shard[w]){st.shard[w]=1;save();PENDING_OUT=w;
  h+=w>10?`<div class="banner gold shardban">${esc(WORLDS[w-1]?.name||'Bonus world')} cleared!</div>`:`<div class="banner gold shardban"><img src="${shardURL(w,true)}" alt=""> You won back Keystone shard ${w}!</div>`;break}}catch(e){}
 return h}
function wrapBoss(){const B=RU.boss;if(!B||B._hy||!B.start)return;const s0=B.start;
 B.start=function(R){const r=s0.apply(this,arguments);try{const L=R&&R.L;if(L&&L.hybrid){const b=B._state&&B._state();if(b){const m=Math.round(b.max*(L.bossMul||1.5));b.max=m;b.hp=m}}}catch(e){console.warn(e)}return r};B._hy=1}
/* boss look: the same crowned Scrambler as in the classic part, same name ("Scrambler King" in the last group) */
RU.HK.build.push(R=>{const L=R.L;if(!L||!L.hybrid)return;
 const vk=L.vkey||RU.pick(typeof BADKEYS!=='undefined'?BADKEYS:['inkblob']);
 R.VIL=vilCanvas(vk,true);R.VILF=RU.flash(R.VIL,'#ffffff');R.vname=L.vname||(L.king?'Scrambler King':'Mega '+R.vname)});
ACT.hyChase=()=>{
 if(!HY||!HY.c||performance.now()-(HY.t0||0)<450)return;
 const i=HY.i,cfg=cfgFor(i);try{closeModal()}catch(e){}
 if(!cfg){hybridFail(HY.c);return}
 const final=isFinal(i),all=cfg.keys,gn=[...groupNew(i)].filter(c=>all.includes(c)).join('');
 Object.assign(cfg,{sub:'Boss chase',n:4+Math.floor((cfg.tier|0)/3),words:.25,favor:gn,hybrid:1,king:final,vkey:HY.vk,vname:HY.vname,bossMul:final?1.8:1.5,autoStart:true,back:'map'});
 wrapBoss();openRunner(i,ST-1,cfg,()=>hybridFail(HY.c))};
ACT.hyAgain=()=>{const i=HY?HY.i:null;try{closeModal()}catch(e){}if(i==null)return;startStage(i*ST+ST-1)};
ACT.hySlow=()=>{RU.opt.spd=Math.max(0,RU.opt.spd-1);try{RU.store.set('spd',RU.opt.spd)}catch(e){}try{toast("Let's go slower!")}catch(e){}try{speak("Let's go slower!")}catch(e){}ACT.hyAgain()};

/* safety net: /play/ must always open on the home screen. The runner may only open from a tap/key, or on the standalone /runner/ page. */
(function(){let touched=false;['pointerdown','keydown'].forEach(e=>addEventListener(e,()=>{touched=true},true));
 addEventListener('load',()=>setTimeout(()=>{try{if(!touched&&!/^\/runner/.test(location.pathname)&&typeof screen!=='undefined'&&screen==='runner'){console.warn('[runner-lesson] runner opened on load; going home');try{closeModal()}catch(e){}RU.close();show('home')}}catch(e){}},1500))})();

/* leaving the runner clears the lesson config so free play is untouched */
const _show=show;show=function(id){try{if(typeof screen!=='undefined'&&screen==='runner'&&id!=='runner')RU.close()}catch(e){}return _show.apply(this,arguments)};

/* ---------- Slower ---------- */
ACT.runSlow=()=>{const v=Math.max(0,RU.opt.spd-1);ACT.runSpd({v});try{toast("Let's go slower!")}catch(e){}try{speak("Let's go slower!")}catch(e){}ACT.runAgain()};

/* ---------- Arcade: free play ---------- */
ACT.runFree=()=>{if(!on('arcade'))return;try{closeModal()}catch(e){}
 const go=()=>{try{RU.backTo='arcade';RU.open()}catch(e){console.error('[runner-lesson]',e);try{show('arcade')}catch(_){}}};
 if(fontOK)go();else Promise.race([fontP,new Promise(r=>setTimeout(r,900))]).then(go)};
/* free-play diamonds go into the real save (never lesson progress) */
RU.HK.results.push(info=>{try{if(RU.custom)return '';const g=info.gems|0;if(g>0){S.gems+=g;save();return `<div class="banner">+${g} diamonds added to your treasure!</div>`}}catch(e){console.error(e)}return ''});

let ART=null,ART_LOADING=0;
/* arcade card art: 2 frames side by side (84x50 each), like the other cards */
function scene(g,ox,fr,hero){
 const R_=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(ox+x,y,w,h)};
 ['#3b5fa0','#4a72b2','#5c88c2','#729ece','#8cb4d6','#a8c8dc'].forEach((col,k)=>R_(0,k*7,84,7,col));
 for(let x=0;x<84;x++){const h=Math.round(12+4*Math.sin(x/9)+3*Math.sin(x/4+1));R_(x,38-h,1,h,'#4a7a7a');R_(x,38-h,1,1,'#2e5458')}
 for(let x=0;x<84;x++){const h=Math.round(6+3*Math.sin(x/6+2));R_(x,38-h,1,h,'#4f7f48');R_(x,38-h,1,1,'#7fae6a')}
 R_(0,38,84,3,'#62955a');R_(0,38,84,1,'#a4c886');R_(0,41,84,9,'#b48c5c');R_(0,41,84,1,'#d0ac78');
 [[8,7],[44,10],[66,5]].forEach(([x,y])=>{x+=fr*2;R_(x,y+3,14,3,'#ffffff');R_(x+3,y,8,3,'#ffffff');R_(x,y+6,14,1,'#dfe8f4')});
 const rock=RU.PX(["....oooo....","..ooLLHLoo..",".oLLLHHLLMo.",".oLLLLLLMMo.","oLLLLLLMMMMo","oMLLLLMMMMDo","oMMLLMMMMDDo","oMMMMMMMDDDo",".oDMMMMDDDo.","..oooooooo.."],{o:'#1e1a2a',H:'#c8c8d8',L:'#9a9ab0',M:'#74748e',D:'#55556e'});
 g.drawImage(rock,ox+40,29);
 const gem=RU.PX([".oooo.","oCWCCo","oCCCco",".oCco.","..oo.."],{o:'#0b2a4a',W:'#ffffff',C:'#8ff0ff',c:'#4ab4d8'});
 [[28,19],[53,19],[63,12]].forEach(([x,y])=>g.drawImage(gem,ox+x,y+fr));
 const ky=13-fr;R_(41,ky,12,13,'#0b1033');R_(42,ky+1,10,11,'#4de08a');R_(42,ky+1,10,1,'#ffffff');           // keycap with a J
 [[46,4],[47,4],[48,4],[48,5],[48,6],[48,7],[46,8],[47,8],[45,7]].forEach(([x,y])=>R_(x,ky+y,1,1,'#0b1033'));
 try{const k=RU.trim(evolvedV(1,1,null,{}));g.drawImage(k,ox+60,38-k.height+1-fr)}catch(e){}
 if(hero){const f=Math.max(hero.height,hero.width)>26?2:1,hw=Math.floor(hero.width/f),hh=Math.floor(hero.height/f);g.drawImage(hero,ox+10,38-hh+1-fr,hw,hh)}}
function artURL(hero){if(ART&&!hero)return ART;
 const c=document.createElement('canvas');c.width=168;c.height=50;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 scene(g,0,0,hero);scene(g,84,1,hero);
 const u=c.toDataURL();
 if(hero){ART=u;document.querySelectorAll('#s-arcade .rungame .zimg').forEach(el=>el.style.backgroundImage=`url(${u})`);return u}
 if(!ART_LOADING){ART_LOADING=1;try{const m=zookSVG().match(/href="([^"]+)"/);if(m){const im=new Image();im.onload=()=>{try{artURL(RU.trim(im))}catch(e){}};im.src=m[1]}}catch(e){}}
 return u}
function starTotal(){try{const o=RU.store.get('stars',{});return Object.values(o||{}).reduce((a,v)=>a+Math.max(0,Math.min(3,+v||0)),0)}catch(e){return 0}}
const _ra=renderArcade;
renderArcade=function(){const r=_ra.apply(this,arguments);try{
 const g=document.querySelector('#s-arcade .games');if(!g||g.querySelector('[data-act=runFree]')||mobile())return r;
 const card=document.createElement('div');card.className='game panel rungame';
 card.innerHTML=`<div class="gart zart"><div class="zimg" style="background-image:url(${artURL()})"></div></div><h3>Keyloria Run</h3><p>Run, jump and free the caged Keylori!</p><div class="arcade-stats"><div class="arcade-stat"><b>${starTotal()}</b><span>Stars (of 21)</span></div><div class="arcade-stat"><b>${[0,1,2,3,4,5].filter(i=>!RU.locked(i)).length}</b><span>Levels open</span></div></div><button class="btn" data-act="runFree">Play</button>`;
 const before=[...g.children].find(el=>(el.querySelector('h3')?.textContent||'').trim()==='Race with Keylori');
 before?g.insertBefore(card,before):g.appendChild(card)}catch(e){console.warn(e)}return r};
try{if(screen==='arcade')renderArcade()}catch(e){}

/* ---------- Lesson Quests: mark the runner parts ----------
   Every lesson keeps its normal 8 part buttons. Parts 2, 4, 6 and 8 get a small orange running arrow and "RUN" so kids can see which parts are runners.
   A Boss Test gets an orange BOSS RUN pill. Grown-up switch "Runner levels" off, or phone mode: no badges, nothing changes. */
const RQ_ARROW=(()=>{const rows=[];for(let y=0;y<9;y++){let r='';for(let x=0;x<11;x++){const body=y>=3&&y<=5&&x<5,head=x>=5&&x<=9-Math.abs(y-4);r+=(body||head)?'k':'.'}rows.push(r)}return rows})();
const RQ_ARROW_O=RQ_ARROW.map(r=>r.replace(/k/g,'o')),RQ_IMGS={};
const rqImg=(rows,pal,key)=>RQ_IMGS[key]||(RQ_IMGS[key]=PXG(rows,pal).toDataURL());
const rqArrow=()=>rqImg(RQ_ARROW,{k:'#1e1a2a'},'dark');           // pill (dark arrow on orange)
const rqArrowO=()=>rqImg(RQ_ARROW_O,{o:'#ff9f45'},'orange');      // part buttons (orange arrow on the dark button)
(function(){try{const st=document.createElement('style');st.textContent='.rq-pill{display:inline-flex;align-items:center;gap:6px;margin-top:6px;background:#ff9f45;color:#1e1a2a;border:2px solid #1e1a2a;border-radius:4px;padding:3px 7px 3px 4px;font:9px/1 "Press Start 2P",monospace;letter-spacing:.05em;box-shadow:2px 2px 0 #1e1a2a}.rq-pill img{width:22px;height:18px;image-rendering:pixelated;display:block}.st8 .rq-tag{display:inline-flex;align-items:center;gap:2px;margin-top:2px;color:#ff9f45;font:7px/1 "Press Start 2P",monospace;letter-spacing:0;white-space:nowrap}.st8 .rq-tag img{width:11px;height:9px;image-rendering:pixelated;display:block}.st8.rq{border-color:#7a4a22}.st8.rq.next{border-color:#f0c860}';document.head.appendChild(st)}catch(e){}})();
/* lessons in the order renderMap draws their cards (region by region, play order) */
function rqLessons(){const o=window.ORDER&&ORDER.length?ORDER:LESSONS.map((_,k)=>k),out=[];
 REGIONS.forEach((R,r)=>o.forEach(i=>{if(LESSONS[i]&&LESSONS[i].r===r)out.push(i)}));return out}
function markQuests(){
 const root=document.getElementById('s-map');if(!root||!enabled())return;
 const order=rqLessons();
 root.querySelectorAll('section.region').forEach(sec=>{
  const name=((sec.querySelector('.rhead h3')||{}).textContent||'').trim(),r=REGIONS.findIndex(R=>R.name===name);if(r<0)return;
  const pool=order.filter(i=>LESSONS[i].r===r);   // this region's lessons in play order = its cards in order
  sec.querySelectorAll('.lesson').forEach(card=>{
   const t=((card.querySelector('.lt h4')||{}).textContent||'').trim(),k=pool.findIndex(i=>lessonTitle(i)===t);
   if(k<0)return;   // not recognised: change nothing
   const i=pool.splice(k,1)[0];
   if(isBossT(i)){
    if(!isHybridBossTest(i))return;
    const h4=card.querySelector('.lt h4');
    if(h4){const p=document.createElement('span');p.className='rq-pill';p.innerHTML=`<img src="${rqArrow()}" alt="">BOSS RUN`;h4.insertAdjacentElement('afterend',p)}
    return}
   card.querySelectorAll('.stages .st8').forEach((b,s)=>{
    if(s%2!==1||!cfgForPart(i,s))return;
    b.classList.add('rq');b.insertAdjacentHTML('beforeend',`<em class="rq-tag"><img src="${rqArrowO()}" alt="">RUN</em>`);
    b.setAttribute('aria-label',(b.getAttribute('aria-label')||'')+' (runner)');b.title=(b.title||'')+' (runner)'});
  });
 });
}
const _rmQ=renderMap;
renderMap=function(){const r=kkSafe(_rmQ,this,arguments);try{markQuests()}catch(e){console.warn('[runner-lesson]',e)}return r};
})();
