/* Keyloria Run <-> Keyloria Kingdom bridge.
   1. The Review lesson of every lesson group is played as a runner level (letters learned so far, new ones weighted).
      Passing records progress exactly like finishing a classic lesson and unlocks the Boss Test.
   2. A "Keyloria Run" card in the Arcade opens free play (stars and diamonds; diamonds go to the real save).
   3. Grown-up switch "Runner levels" (default on) and phone/mobile mode fall back to the classic Review. */
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
const title=i=>{try{return lessonTitle(i)}catch(e){return LESSONS[i].t||'Review'}};
const bossN=i=>{try{const o=window.ORDER||[],k=o.indexOf(i),nx=k>=0?o[k+1]:null;return nx!=null&&LESSONS[nx]?nx*ST:null}catch(e){return null}};
const lowerLetters=set=>[...set].filter(c=>/^[a-z]$/.test(c));
function groupNew(i){const r=LESSONS[i].r,s=new Set();LESSONS.forEach((L,j)=>{if(L.r===r&&!(L.sp&&/^x9/.test(L.sp))&&L.k&&j<=(LESSONS[i].src==null?j:LESSONS[i].src))[...L.k].forEach(c=>{if(/[a-z]/.test(c))s.add(c)})});return [...s].join('')}
function cfgFor(i){
 const all=lowerLetters(learned(i)).sort().join('');if(all.length<2)return null;
 const fresh=[...groupNew(i)].filter(c=>all.includes(c)).join('');
 const n=all.length;
 return {name:title(i),sub:'Review run',keys:all,favor:fresh,words:n>=6?.3:0,n:12+(n>=12?2:0),v:66+Math.min(14,n),lv:n<=3?0:n<=6?1:n<=10?2:n<=16?3:4,back:'map'}}

/* ---------- recording progress (mirrors the pass/fail branch of finish() in game.js) ---------- */
const fails=i=>((S.runf||{})[i])|0;
function record(i,info){
 const R=info.R,stars=info.stars,pass=stars>=1;
 try{const secs=(performance.now()-R.start)/1000;S.time+=Math.round(secs);if(typeof sessionSecs!=='undefined')sessionSecs+=secs}catch(e){}
 S.rounds++;S.lastLesson=i;
 const oldL=levelOf(S.xp),out={pass,stars,xp:(R.typed||0)+(pass?20*stars:5),gems:0,newCard:false,evo:null,evoFrom:formNow(i),badge:null,holo:[],lucky:null,egg:null};
 let gems=0;
 if(pass){
  const prev=S.best[i+'-'+(ST-1)]||0;gems=Math.max(0,stars-prev)*2+(prev===0?1:0);
  const f0=formNow(i);
  for(let s=0;s<ST;s++){const k=i+'-'+s;S.best[k]=Math.max(S.best[k]||0,1)}   // a pass completes every part (opens the Boss Test)
  {const s=Array.from({length:ST},(_,s)=>s).find(s=>(S.best[i+'-'+s]||0)<stars);if(s!=null)S.best[i+'-'+s]=stars}   // earned stars raise one part per run, so evolving/holo takes several good runs
  const f1=formNow(i),ck=i+'-'+f0;
  if(!S.cards[ck]){S.cards[ck]={holo:false};out.newCard=true}
  for(let f=f0+1;f<=f1;f++){const nk=i+'-'+f;if(!S.cards[nk])S.cards[nk]={holo:false};out.evo=f}
  [0,1,2].forEach(f=>{const c=S.cards[i+'-'+f];if(c&&!c.holo&&BAND[f].every(s=>(S.best[i+'-'+s]||0)===3)){c.holo=true;out.holo.push(f)}});
  try{out.lucky=rollLucky(i);if(out.lucky&&out.lucky.gems)gems+=out.lucky.gems}catch(e){}
  try{const r=LESSONS[i].r;if(!S.badges.includes(r)&&regionDone(r)){S.badges.push(r);out.badge=REGIONS[r].name}}catch(e){}
  try{const A=S.asga;if(A&&A.i===i&&Array.isArray(A.st))for(let s=0;s<ST;s++)if(!A.st.includes(s))A.st.push(s)}catch(e){}
  S.runf=S.runf||{};S.runf[i]=0;
  try{out.egg=dailyEgg()}catch(e){}
 }else{S.runf=S.runf||{};S.runf[i]=fails(i)+1}
 gems+=info.gems|0;out.gems=gems;
 S.xp+=out.xp;S.gems+=gems;
 try{S.hist.push({t:Date.now(),w:info.wpm,a:info.acc});if(S.hist.length>80)S.hist.shift()}catch(e){}
 const newL=levelOf(S.xp);out.lvl=newL>oldL?newL:0;
 try{save()}catch(e){console.error(e)}
 return out}

const starStr=n=>'★'.repeat(n)+'☆'.repeat(3-n);
function resultsFor(i,info){
 const o=record(i,info),sp=SPECIES[i]?SPECIES[i].n:['Keylori'];let h='';
 const nm=sp[Math.min(sp.length-1,o.evo!=null?Math.max(0,o.evoFrom):formNow(i))];
 if(o.pass){
  if(o.newCard)h+=`<div class="banner">You befriended ${esc(nm)}!</div>`;
  if(o.evo!=null)h+=`<div class="banner gold">${esc(sp[o.evoFrom])} evolved into ${esc(sp[o.evo])}!</div>`;
  o.holo.forEach(f=>{h+=`<div class="banner">Your ${esc(sp[f])} card is now HOLO!</div>`});
  if(o.lvl)h+=`<div class="banner gold">Level up! You are now Level ${o.lvl}: ${titleOf(o.lvl)}</div>`;
  if(o.badge)h+=`<div class="banner gold">You earned the ${esc(o.badge)} badge!</div>`;
  if(o.lucky&&o.lucky.gems)h+=`<div class="banner luck">Lucky find! +${o.lucky.gems} diamonds</div>`;
  try{h+=eggBanner(o.egg)}catch(e){}
  const bn=bossN(i);if(bn!=null)h+=`<div class="banner gold">${esc(title(Math.floor(bn/ST)))} unlocked!</div>`;
  try{setTimeout(()=>{if(o.lvl)sfx.lvl()},500)}catch(e){}
 }else{
  if(fails(i)>=2&&RU.opt.spd>0)h+=`<p class="note" style="margin:0">Want to go slower? Tap Slower.</p>`;
 }
 const stats=`<div class="rstats"><div><b>${o.stars} ★</b><span>Stars</span></div><div><b>${info.acc}%</b><span>Accuracy</span></div><div><b>${info.wpm}</b><span>WPM</span></div><div><b>+${o.xp}</b><span>XP</span></div><div><b>+${o.gems}</b><span>Diamonds</span></div></div>`;
 let btns;
 if(o.pass){const bn=bossN(i);btns=(bn!=null?`<button class="btn nextbtn" data-act="play" data-n="${bn}">Next ▸</button>`:'')+`<button class="btn alt" data-act="runAgain">Play again</button><button class="btn alt" data-act="go" data-to="map">Map</button>`}
 else btns=`<button class="btn nextbtn" data-act="runAgain">Try again</button>${fails(i)>=2&&RU.opt.spd>0?`<button class="btn" data-act="runSlow">Slower</button>`:''}<button class="btn alt" data-act="go" data-to="map">Map</button>`;
 return {html:h,stats,btns,head:o.pass?null:'So close!'}}

/* ---------- opening the Review as a runner level ---------- */
function cfgWithResults(i,cfg){
 cfg.results=info=>resultsFor(i,info);
 cfg.startExtra=()=>{const b=Math.min(3,Math.max(0,...Array.from({length:ST},(_,s)=>S.best[i+'-'+s]||0)));return `<p class="note" style="margin:2px 0 6px">${b?'Best: '+starStr(b):'Get 1 star to open the Boss Test!'}</p>`};
 return cfg}
function openRunner(i,cfg,fallback){
 const go=()=>{try{RU.backTo=null;RU.open(cfgWithResults(i,cfg))}catch(e){console.error('[runner-lesson]',e);try{RU.close()}catch(_){}fallback()}};
 if(fontOK)go();else Promise.race([fontP,new Promise(r=>setTimeout(r,900))]).then(go)}
const _ss=startStage;
startStage=function(n,mode){
 try{if(!mode&&enabled()){const i=Math.floor(n/ST);if(isReview(i)){const cfg=cfgFor(i);if(cfg){try{closeModal()}catch(e){}openRunner(i,cfg,()=>_ss.call(window,n));return}}}}catch(e){console.error('[runner-lesson]',e)}
 return _ss.apply(this,arguments)};

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
})();
