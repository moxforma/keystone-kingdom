/* runner-spell.js: Keyloria Run for the SPELLING stream (phase E2).
   window.RUNNER_SPELL = {cfg(i,s), bossCfg(i)} (called by spell-adv.js via KKS.register runnerCfg/bossCfg).
   When R.L.stream==='spell' the build hook converts the typing obstacles IN PLACE:
     rock                    -> 'srock'   missing-letter / first-sound word on the keycap, type the missing letter to jump
     fork                    -> stays a fork: two missing-letter words with different letters (HIGH = a longer, harder word, extra gems)
     flap                    -> stays a balloon section: each gap shows a missing-letter word, its letter flaps (repeatable)
     ambush                  -> mini Scramblers throw blobs carrying a missing-letter word (RUNNER.ambushProvider, see runner-action.js)
     gap                     -> bridge    word is spoken and flashes above the gap, then is covered; type it to build planks
     tall                    -> tower     spell a word letter by letter to climb (reuses the engine's tower physics)
   Boss: a Spelling Bee (the Scrambler says a word, blobs carry covered words, weak spots = missing letters, sentence spell = dictation).
   Wraps RUNNER.boss as a dispatcher (spell stream -> Bee, anything else -> the previous boss, unchanged).
   If a RUNNER.bossContent provider exists it is not needed: the Bee is self-contained here. No WPM anywhere. */
(function(){
if(!window.RUNNER)return;
const RN=window.RUNNER,C=RN.C,GROUND=C.GROUND,RX=C.RX,BW=C.BW,HOP=C.HOP,GRAV=C.GRAV,H=C.H,HK=RN.HK,SEG=RN.SEG;
const ri=Math.round,rr=()=>RN.R;
const LETTERS='abcdefghijklmnopqrstuvwxyz';
const TW=28,PLANK=C.PLANK||10;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const say=t=>{try{speak(t)}catch(e){}};
const D=()=>window.SPELLD;
const isSp=R=>!!(R&&R.L&&R.L.stream==='spell');
const clean=w=>/^[a-z]+$/.test(w||'');
const seedNow=()=>Math.floor(Math.random()*1e9);
const flat=(R)=>String(R.L.topic||'');
function items(R,kind,count,part,tier){
 try{const t=tier!=null?tier:(+R.L.tier||0);
  const topic=R.L.topic&&D().topic(R.L.topic)?R.L.topic:undefined;
  let a=D().forRunner(t,kind,{seed:seedNow(),count:count*2,part:part==null?(+R.L.partS||3):part,topic});
  if(kind==='spell')a=a.filter(x=>clean(x.words.join('').replace(/ /g,''))&&x.words.every(clean));
  else a=a.filter(x=>clean(x.w));
  return a.slice(0,count)}catch(e){console.warn('[runner-spell]',e);return[]}}
const hidden=tier=>tier>=1;                         // world 1 (tier 0) keeps words visible; worlds 2+ flash the word, then cover it
/* brief look: worlds 2-3 about 2.0s + .15s/letter, worlds 4-7 1.2s + .1s/letter, worlds 8-12 .8s + .08s/letter */
const flashDur=(tier,n)=>{const w=tier+1,L=n||4;return w<=3?2+.15*L:w<=7?1.2+.1*L:.8+.08*L};

/* ================= cfg ================= */
function cfg(i,s){
 try{if(!window.KKS||!D())return null;const sl=KKS.slot(i);if(!sl)return null;
  const tier=Math.max(0,Math.min(11,sl.w-1)),part=Math.min(7,s+(sl.g?1:0));
  let topic='';if(sl.kind==='learn'){const t=D().lesson(sl.w,sl.k);if(t&&D().topic(t.id))topic=t.id}
  return{stream:'spell',topic,tier,partS:part,keys:LETTERS,favor:'',words:.34,n:9+(s>>1)+Math.round(tier*.5),
   v:Math.round(56*(1+.07*tier)),lv:Math.min(4,1+Math.floor(tier/3)),back:'map',gapMul:Math.max(.7,1-.03*tier),startExtra:()=>'<p style="margin:2px 0">Spell the word!</p>'}}
 catch(e){console.warn('[runner-spell cfg]',e);return null}}
function bossCfg(i){
 try{if(!window.KKS||!D())return null;const sl=KKS.slot(i);if(!sl)return null;const tier=Math.max(0,Math.min(11,sl.w-1));
  return{stream:'spell',topic:'',tier,partS:7,keys:LETTERS,favor:'',words:.3,n:4+Math.floor(tier/3),v:Math.round(56*(1+.07*tier)),lv:Math.min(4,1+Math.floor(tier/3)),back:'map'}}
 catch(e){return null}}
window.RUNNER_SPELL={cfg,bossCfg};

/* ================= helpers: shifting the course ================= */
function shift(R,cut,ex,except){
 if(!ex)return;
 R.obs.forEach(o=>{if(o!==except&&o.x>=cut){o.x+=ex;if(o.gaps)o.gaps.forEach(p=>p.x+=ex)}});
 R.gems.forEach(g=>{if(g.x>=cut)g.x+=ex});R.bossX+=ex;
 try{const a=RN.action&&RN.action.state();if(a&&a.plan)a.plan=a.plan.map(X=>X>=cut?X+ex:X)}catch(e){}}
const nearPlan=o=>{try{const a=RN.action.state();return !!(a&&a.plan.some(X=>X>o.x-170&&X<o.x+200))}catch(e){return false}};   // keep ambushes away from holes (same rule as okAt)
const hintOff=()=>{try{const h=document.getElementById('rhint');if(h&&h.innerHTML)h.innerHTML='';if(typeof setTarget==='function')setTarget(null)}catch(e){}};

/* ================= building ================= */
const SHT={3:18,4:14,5:11,6:9,7:8};
function mkTower(R,i,w,hid){
 const old=R.obs[i],n=w.length,SH=SHT[n]||8,Ht=(n-1)*SH+17;
 R.gems=R.gems.filter(g=>g.tw!==old&&!(old.t==='rock'&&g.x>=old.x-2&&g.x<=old.x+TW+2&&g.y>=GROUND-42&&g.y<=GROUND-30));
 const o={t:'tall',x:old.x,w:TW,h:Ht,n,k:0,letters:hid?Array(n).fill('_'):[...w],word:w,kind:'w',SH,st:'wait',vx:40,sp:1,hid,ans:w};
 const cnt=5,bump=[0,3,4,3,0];
 for(let j=0;j<cnt;j++)R.gems.push({x:o.x+3+Math.round(j*(TW-6)/(cnt-1)),y:GROUND-Ht-8-bump[j],got:0,tw:o});
 const nx=R.obs[i+1],nxX=nx?nx.x:R.bossX,Vf=Math.max(R.v*1.25,HOP),fall=Math.sqrt(2*Ht/GRAV)*Vf,need=o.x+TW+6+fall+50;
 R.obs[i]=o;shift(R,nxX-14,Math.max(0,Math.ceil(need-nxX)),o);return o}
function mkBridge(R,i,w,hid){
 const old=R.obs[i],nw=w.length*PLANK+4,d=nw-old.w,cut=old.x+old.w-1;
 const o={t:'gap',x:old.x,w:nw,word:hid?'_'.repeat(w.length):w,typed:0,sp:1,hid,ans:w};
 o.accK=w=>w?o.ans:(o.ans[o.typed]||'');R.obs[i]=o;shift(R,cut,d,o);return o}
const ROCKSP=[0,1,2];
function mkRock(R,i,it){
 const old=R.obs[i];if(old.t==='flap'&&old.w>40)shift(R,old.x+old.w-1,Math.min(0,10+Math.round(R.v*.9)-old.w),old);
 const spi=ROCKSP[Math.floor(Math.random()*3)];let sp;try{sp=RN.thSprite(spi)}catch(e){}
 R.obs[i]=Object.assign(old.t==='srock'?old:{},{t:'srock',x:old.x,w:(old.t==='rock'?old.w:10)||10,h:(old.t==='rock'?old.h:9)||9,spi,st:'wait',show:it.show,ans:it.ans,word:it.w,sp:1,mode:it.mode})}

const FALLBACK=[{show:'c_t',ans:'a',w:'cat'},{show:'d_g',ans:'o',w:'dog'},{show:'s_n',ans:'u',w:'sun'},{show:'p_n',ans:'e',w:'pen'},{show:'b_g',ans:'i',w:'big'}];
const oneLetter=x=>x&&typeof x.ans==='string'&&x.ans.length===1&&/[a-z]/.test(x.ans)&&String(x.show||'').length<=11;
function build(R){
 if(!isSp(R)||!D()){if(RN.ambushProvider===SPV)RN.ambushProvider=null;return}
 RN.ambushProvider=SPV;                           // ambushes stay (planned by runner-action): their blobs carry a missing-letter word
 const tier=+R.L.tier||0,hid=hidden(tier);
 const need={rock:R.obs.length*2+16,bridge:R.obs.length,tower:R.obs.length};
 const rocks=items(R,'rock',need.rock).filter(oneLetter),bridges=items(R,'bridge',need.bridge),towers=items(R,'tower',need.tower).filter(x=>x.w.length>=3&&x.w.length<=7);
 const hard=items(R,'rock',24,undefined,Math.min(11,tier+2)).filter(oneLetter);
 R.L.spBlobs=items(R,'rock',40).filter(oneLetter).filter(x=>x.show.length<=8);
 const pt=()=>towers.length?towers.shift().w:null,pb=()=>bridges.length?bridges.shift().w:null,pr=()=>rocks.length?rocks.shift():FALLBACK[Math.floor(Math.random()*FALLBACK.length)];
 const prNot=not=>{const i=rocks.findIndex(x=>!not.includes(x.ans));if(i>=0)return rocks.splice(i,1)[0];const f=FALLBACK.filter(x=>!not.includes(x.ans));return f[Math.floor(Math.random()*f.length)]};
 const box=(it,x,y,st)=>{if(!it)return;const wd=it.show.length*8+6;wordBox(RN.g,clamp(ri(x+6-wd/2),1,C.W-wd-2),y,it.show,st?1:0,rr().t)};
 // FORK: LOW = a word of this lesson, HIGH = a longer word from a tier or two up (extra row of gems); the two missing letters always differ
 const behind=o=>{const t=RN.target();return !!t&&t!==o&&t.t==='fork'&&t.st==='wait'&&Math.abs(t.x-o.x)<140};   // a second fork right behind the current one: its wide words wait until the first is done
 const mkFork=o=>{
  const lo=pr();let hs=hard.filter(x=>x.ans!==lo.ans&&x.w!==lo.w).sort((a,b)=>b.w.length-a.w.length);
  const hi=hs.length?hs[Math.floor(Math.random()*Math.min(3,hs.length))]:prNot([lo.ans]);const hx=hard.indexOf(hi);if(hx>=0)hard.splice(hx,1);
  o.sp=1;o.lo=lo.ans;o.hi=hi.ans;o.il=lo;o.ih=hi;o.cap=(k,ch,x,y,st)=>{if(!st&&behind(o))return;box(k==='hi'?o.ih:o.il,x,y,st)};
  const n=Math.floor((o.LW-24)/12);for(let j=0;j<n;j++)R.gems.push({x:o.x+o.p0+12+j*12,y:GROUND-40-19,got:0})};
 // FLAP: a missing-letter word per gap; neighbouring gaps never share a letter
 const mkFlap=o=>{
  const its=[];for(let i=0;i<o.n;i++)its.push(prNot(i?[its[i-1].ans]:[]));
  o.sp=1;o.letters=its.map(x=>x.ans);o.its=its;o.cap=(k,ch,x,y,st)=>box(o.its[k],x,y,st)};
 // 1) convert what the typing builders made
 for(let i=0;i<R.obs.length;i++){const o=R.obs[i];
  if(o.t==='gap'){const w=pb();if(w)mkBridge(R,i,w,hid)}
  else if(o.t==='tall'){const w=pt();if(w)mkTower(R,i,w,hid);else mkRock(R,i,pr())}
  else if(o.t==='rock')mkRock(R,i,pr());
  else if(o.t==='fork')mkFork(o);
  else if(o.t==='flap')mkFlap(o)}
 // 2) make sure there are bridges and towers (more in later worlds)
 const cnt=t=>R.obs.filter(o=>o.t===t).length,N=R.obs.length;
 const wantB=1+(tier>=3?1:0)+(tier>=7?1:0),wantT=1+(tier>=4?1:0)+(tier>=8?1:0);
 const plain=i=>R.obs[i]&&R.obs[i].t==='srock'&&!nearPlan(R.obs[i])&&[-1,1].every(d=>!R.obs[i+d]||R.obs[i+d].t==='srock');
 const spots=[];for(let i=2;i<N-1;i++)spots.push(i);
 const place=(kind,want)=>{let tries=0;while(cnt(kind)<want&&tries++<40){const c=spots.filter(plain);if(!c.length)break;
  const i=c[Math.floor(Math.random()*c.length)];
  if(kind==='gap'){const w=pb();if(!w)break;mkBridge(R,i,w,hid)}else{const w=pt();if(!w)break;mkTower(R,i,w,hid)}}};
 place('gap',wantB);place('tall',wantT);
 R.obs.sort((a,b)=>a.x-b.x)}
HK.build.push(R=>{try{build(R)}catch(e){console.error('[runner-spell build]',e)}});

/* ================= segment: srock ================= */
function wordBox(g,x,y,str,st,t){ // wide keycap with the gapped word
 const n=str.length,wd=n*8+6,col=st===1?'#f0c860':'#e8ecff';
 g.fillStyle='#0b1033';g.fillRect(x-1,y-1,wd+2,15);g.fillStyle=col;g.fillRect(x,y,wd,13);g.fillStyle='#ffffff';g.fillRect(x,y,wd,1);
 if(st!==1){g.fillStyle='#c0c8f0';g.fillRect(x,y+12,wd,1)}
 for(let i=0;i<n;i++){const c=str[i];if(c==='_'){const on=st===1&&Math.floor(t*4)%2;g.fillStyle=on?'#e8584f':'#0b1033';g.fillRect(x+3+i*8,y+10,7,2)}else RN.txt(g,c,x+3+i*8,y+3,'#0b1033',1,'l',null)}}
SEG.srock={
 want:()=>'',
 done:o=>o.st!=='wait',
 strip:()=>['?'],
 typed:o=>o.st!=='wait'?1:0,
 key(){},
 update(o,dt){const R=rr();if(R.phase!=='run')return;const back=R.front-BW;
  if((o.st==='wait'||o.st==='lo')&&R.front>o.x+1&&back<o.x+o.w-1&&-R.y<o.h-2){
   R.bonks++;R.streak=0;R.shake=3;R.stun=R.L.hard?.45:.25;R.kb=0;R.speed=0;R.front=o.x-10;R.cam=R.front-RX;
   if(R.air){R.air=false;R.y=0;R.vy=0}if(R.jt){R.jt.jt=false;R.jt=null}
   RN.popTxt('BONK!',o.x+o.w/2,GROUND-30,'#ff6b7a');RN.snd(120,.15,'square',.07);RN.burst(o.x-R.cam,GROUND-8,'#ffffff',6,40);
   o.st='wait';o.jt=false;RN.updStrip();return}
  if(o.st==='lo'){
   if(back>o.x+o.w){o.st='done';o.done=true;if(o.nice){R.nice++;R.gemN++;RN.popTxt('NICE!',o.x+o.w/2,GROUND-34,'#4de08a');RN.snd(988,.05,'square',.04);RN.snd(1319,.08,'square',.04,.05)}RN.updStrip()}
   else if(o.jt===false){o.st='wait';RN.updStrip()}}},
 block:o=>o.st==='wait'?o.x-10:null,
 draw(o,g,cam,isT){const R=rr(),x=o.x-cam;if(x<-60||x>C.W+10)return;
  let spr=null;try{spr=RN.thSprite(o.spi)}catch(e){}
  if(spr)g.drawImage(spr,ri(x-1),GROUND-spr.height+1);else{g.fillStyle='#74748e';g.fillRect(ri(x),GROUND-10,12,10)}
  if(o.st==='wait'){const n=o.show.length,wd=n*8+6,bob=isT?Math.floor(R.t*6)%2:0;
   wordBox(g,clamp(ri(x+o.w/2-wd/2),1,C.W-wd-2),GROUND-(spr?spr.height:10)-18-bob,o.show,isT?1:0,R.t)}}
};

/* ================= keys (before the engine), speech, flash, hints ================= */
const hiddenT=t=>t&&t.sp&&t.hid&&(t.t==='gap'||t.t==='tall');
const accepts=(t,k)=>t.t==='srock'?(t.st==='wait'&&k===t.ans):t.t==='gap'?k===(t.hid?t.ans:t.word)[t.typed]:t.t==='fork'?(t.st==='wait'&&(k===t.hi||k===t.lo)):t.t==='flap'?(k===t.letters[t.k]||k===t.letters[t.k+1]):(t.hid?k===t.ans[t.k]:k===t.letters[t.k]);
function say1(o,R){o.fs=R.t;o.said=1;say(o.word&&o.t==='srock'?o.word:o.ans)}
function peek(o,R){   // Space says the word again; on a covered bridge/tower the FIRST Space per word also re-flashes it (free in worlds 2-3, a tiny accuracy cost from world 4)
 if(o.hid&&(o.t==='gap'||o.t==='tall')&&!o.pk){o.pk=1;o.fs=R.t;if((+R.L.tier||0)>=3)R.typed++}
 say(o.t==='srock'?o.word:o.ans)}
HK.key.unshift(function(e){
 const R=rr();if(!R||!isSp(R)||R.phase!=='run'||R.fall)return false;
 const caps0=e.getModifierState&&e.getModifierState('CapsLock')&&!e.shiftKey;
 const fl=R.obs.find(f=>f.t==='flap'&&f.sp&&f.st==='fly'&&f.k>=f.n);            // the last balloon letter pressed again: a free flap (runner-paths handles it)
 if(fl&&fl.pl&&e.key===fl.pl&&R.t-fl.pt<1.2)return false;
 const t=RN.target();if(!t||!t.sp)return false;
 const A=RN.action&&RN.action.state(),lk=String(e.key).toLowerCase();             // a blob's letter goes to the blob, unless the obstacle accepts it too
 if(A&&A.blobs&&A.blobs.some(z=>z.st==='in'&&(z.ch===e.key||(caps0&&z.ch===lk)))&&!accepts(t,lk))return false;
 if(t.x-R.cam>C.W+4)return String(e.key).length===1;
 if(e.key===' '){
  if(RN.action&&RN.action.canFire&&RN.action.canFire())return false;            // full charge: Space = the blast (runner-action)
  if(t.t==='fork'||t.t==='flap')return true;                                     // (while ballooning Space is just ignored)
  peek(t,R);return true}
 if(String(e.key).length!==1||!/[a-zA-Z]/.test(e.key))return false;
 const caps=e.getModifierState&&e.getModifierState('CapsLock')&&!e.shiftKey,kk=(caps?e.key.toLowerCase():e.key).toLowerCase();
 const good=()=>{R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak)};
 if(t.t==='flap')return false;                                                    // runner-paths: first press = hit, extra presses = free flaps
 if(t.t==='fork'){
  if(t.st!=='wait'||R.air)return true;
  if(kk===t.hi||kk===t.lo){good();SEG.fork.key(t,kk)}else RN.miss();
  RN.updStrip();return true}
 if(t.t==='srock'){
  if(R.air)return true;
  if(kk===t.ans){good();t.st='lo';RN.jump(t);RN.updStrip()}else{RN.miss();RN.updStrip()}
  return true}
 if(t.t==='gap'&&t.hid){
  if(kk===t.ans[t.typed]){good();t.help=false;t.typed++;t.word=t.ans.slice(0,t.typed)+'_'.repeat(t.ans.length-t.typed);
   RN.snd(440+t.typed*50,.06,'square',.05);RN.burst(t.x+t.typed*PLANK-R.cam,GROUND+2,'#d0ac78',4,30);
   if(t.typed===t.ans.length){RN.popTxt('BRIDGE!',t.x+t.w/2,GROUND-34,'#f0c860');try{sfx.super()}catch(_){}}
   RN.updStrip()}
  else{RN.miss();t.help=true;RN.updStrip()}
  return true}
 if(t.t==='tall'&&t.hid){
  if(kk===t.ans[t.k]){good();t.help=false;const k0=t.k;t.letters[k0]=kk;SEG.tall.key(t,kk);if(t.k===k0)t.letters[k0]='_';RN.updStrip()}
  else{RN.miss();t.help=true;RN.updStrip()}
  return true}
 return false});
{const w0=SEG.tall&&SEG.tall.want,a0=SEG.tall&&SEG.tall.acc;if(w0){SEG.tall.want=o=>o.hid?'':w0(o);SEG.tall.acc=(o,w)=>o.hid?(w?o.ans:(o.ans[o.k]||'')):(a0?a0(o,w):w0(o))}}
/* forks and balloon sections (runner-paths.js) with missing-letter words instead of keycaps: the letter hint stays hidden */
{const F0=SEG.fork,P0=SEG.flap;
 if(F0&&!F0._sp)SEG.fork=Object.assign({},F0,{_sp:1,want:o=>o.sp?'':F0.want(o),acc:(o,w)=>o.sp?F0.want(o):(F0.acc?F0.acc(o,w):F0.want(o)),strip:o=>o.sp?['?','/','?']:F0.strip(o)});
 if(P0&&!P0._sp)SEG.flap=Object.assign({},P0,{_sp:1,want:o=>o.sp?'':P0.want(o),acc:(o,w)=>o.sp?P0.want(o):(P0.acc?P0.acc(o,w):P0.want(o)),strip:o=>o.sp?o.letters.map(()=>'?'):P0.strip(o)})}
{const s0=SEG.srock;s0.acc=o=>o.st==='wait'?o.ans:'';s0.smashable=o=>o.st==='wait';s0.smash=o=>{o.st='done';o.done=true;o.jt=false}}
HK.update.push(function(dt){const R=rr();if(!isSp(R)||R.phase!=='run')return false;
 const t=RN.target();
 if(t&&t.sp&&t.t!=='fork'&&t.t!=='flap'&&t.x-R.cam<C.W-30){if(!t.said)say1(t,R)}
 if(t&&t.sp&&t.hid&&t.help&&(t.t==='gap'||t.t==='tall')){   // help after a miss: show the key and finger for this letter only
  const c=t.t==='gap'?t.ans[t.typed]:t.ans[t.k];try{if(c){setTarget(c);const h=document.getElementById('rhint');if(h)h.innerHTML=fingerHTML(c)}else hintOff()}catch(e){}}
 else if(t&&t.sp&&(t.t==='srock'||t.hid||t.t==='fork'||t.t==='flap'))hintOff();
 return false});

/* flash label above bridges / towers, word label for visible mode */
HK.drawWorld.push(function(g,cam){const R=rr();if(!isSp(R))return;
 const t=RN.target(),tier=+R.L.tier||0;
 R.obs.forEach(o=>{if(!o.sp||(o.t!=='gap'&&o.t!=='tall')||o===undefined)return;
  const x=o.x-cam;if(x<-60||x>C.W+10)return;
  const live=o===t&&(o.t==='gap'?o.typed<o.ans.length:o.k<o.n);if(!live)return;
  const show=!o.hid||(o.fs!=null&&R.t-o.fs<flashDur(tier,o.ans.length));if(!show)return;
  const word=o.ans,wd=word.length*8+8,cx=ri(x+o.w/2),yy=o.t==='gap'?GROUND-58:Math.max(14,GROUND-o.h-30);
  const bx=clamp(cx-ri(wd/2),2,C.W-wd-2);
  g.fillStyle='#0b1033';g.fillRect(bx-1,yy-1,wd+2,13);g.fillStyle='#2a1a4a';g.fillRect(bx,yy,wd,11);g.fillStyle='#f0c860';g.fillRect(bx,yy,wd,1);
  RN.txt(g,word,bx+4,yy+1,'#ffffff',1,'l',null);
  if(o.hid){const k=1-(R.t-o.fs)/flashDur(tier,o.ans.length);g.fillStyle='#8ff0ff';g.fillRect(bx+1,yy+10,ri((wd-2)*Math.max(0,k)),1)}})});

/* ================= ambush blobs: a missing-letter word ================= */
let blobRecent=[];
const SPV={
 pick(sel){
  const R=rr(),src=(R&&R.L&&R.L.spBlobs&&R.L.spBlobs.length?R.L.spBlobs:FALLBACK).filter(x=>!blobRecent.includes(x.w)).map(x=>({ch:x.ans,show:x.show,w:x.w}));
  let it=src.length?sel(src,c=>c.ch):null;
  if(!it)it=sel(FALLBACK.map(x=>({ch:x.ans,show:x.show,w:x.w})),c=>c.ch);
  if(it){blobRecent.push(it.w);if(blobRecent.length>6)blobRecent.shift()}
  return it},
 draw(g,it,cx,y,cur,t,idx){const wd=it.show.length*8+6;wordBox(g,clamp(ri(cx-wd/2),1,C.W-wd-2),y-(idx>0?16:0),it.show,cur?1:0,t)}};

/* ================= SPELLING BEE boss ================= */
const HITX=RX+6,HX=RX-BW/2;
const BLOB_A=RN.PX(["..ooo..",".oiiio.","oiwiwio","oiiiiio","oiiiiio",".oiiio.","..ooo.."],{o:'#150b26',i:'#6a3fb8',w:'#ffffff'});
const BLOB_B=RN.PX([".......",".ooooo.","oiwiwio","oiiiiio","oiiiiio","oiiiiio",".ooooo."],{o:'#150b26',i:'#6a3fb8',w:'#ffffff'});
const SPLAT=RN.PX(["..o...o....",".oio.oio.o.","oiiioiiioio",".oiiiiiiio.","oiiioiiiiio",".oio.oioio.","..o...o.o.."],{o:'#150b26',i:'#6a3fb8'});
const BOLT=RN.PX(["..yyy",".yyy.","yyyyy","..yy.",".yy..","yy..."],{y:'#f0c860'});
let B=null;
const act=()=>(B&&RN.R&&B.R===RN.R)?B:null;
const sfxT=(n,a)=>{try{sfx[n](a)}catch(e){}};
const shake=n=>{RN.R.shake=Math.max(RN.R.shake,n)};
const flush=()=>{try{RN.buildStrip();RN.updStrip()}catch(e){}};
const wx=sx=>ri(RN.R.cam)+sx;
const setMode=(b,m)=>{b.mode=m;b.mt=0;b.dirty=true};
function pull(b,kind){const q=b.q[kind];if(!q.length){const R=b.R,n=kind==='rock'?30:12;
  const src=kind==='blob'?items(R,b.tier<=3?'bridge':'boss',n,7,b.tier).filter(x=>x.w.length<=10):kind==='rock'?items(R,'rock',n,4,b.tier):items(R,'spell',8,7,b.tier);
  b.q[kind]=src.length?src:[kind==='spell'?{s:'The cat sat.',words:['the','cat','sat'],text:'the cat sat'}:{w:'cat',show:'c_t',ans:'a'}]}
 return b.q[kind].shift()}
function cageGeom(){const R=RN.R,K=R.KEY,kw=K?K.width:24,kh=K?K.height:24;return{K,kw,kh,cw:kw+6,ch:kh+5,cx:ri(R.bossX-ri(R.cam)+20)}}
function vgeom(b){const R=RN.R,V=R.VIL,vw=V?V.width:32,vh=V?V.height:32,bx=R.bossX-ri(R.cam),t=b?b.t:R.t;let dx=0,dy=0,img=V;
 if(b){if(b.mode==='intro')dy=b.mt<.8?-ri(Math.abs(Math.sin(b.mt*9))*5):0;else dy=(Math.floor(t*(b.p2?5:3))%2)?-1:0;
  if(b.mode!=='intro')dx+=ri(Math.sin(t*(b.p2?3.4:1.5))*(b.p2?3:1));
  if(b.mode==='wind'&&!b.angryT){const p=Math.min(1,b.mt/b.windDur);dx+=(Math.floor(t*28)%2?1:-1);dy-=Math.floor(p*3);if(p>.35&&Math.floor(t*16)%2)img=R.VILF||img}
  if(b.angryT>0)img=(Math.floor(t*12)%2)?(b.ANG||img):V;
  if(b.laugh>0)dy-=ri(Math.abs(Math.sin(b.laugh*14))*3);
  if(b.mode==='spell'&&b.sp){const p=Math.min(1,b.mt/.7);dy-=ri(p*12);dx+=(Math.floor(t*22)%2?1:-1);if(Math.floor(t*8)%2)img=b.ORB||img}
  if(b.mode==='spfail')dy-=12;
  if(b.mode==='dying'){dx+=ri(RN.rnd(-2,2));img=(Math.floor(t*20)%2)?R.VILF:V}
  if(b.hitT>0){dx+=2;img=R.VILF||img}}
 return{sx:bx+4+dx,dy,img,vw,vh,hasV:!!V,cy:GROUND-vh/2,bx}}
function start(R){
 const tier=Math.max(0,Math.min(14,(+R.L.tier)||0));let ANG=null,ORB=null;
 try{if(R.VIL){ANG=RN.flash(R.VIL,'#ff4a4a');ORB=RN.flash(R.VIL,'#c9a8f0')}}catch(e){}
 const max=8+Math.round(tier*.5),sched=[{at:.66},{at:.33}];if(tier>=8)sched.push({at:.14,final:true});
 B={R,tier,max,hp:max,sched,tm:Math.max(.6,1-.035*tier),p2:false,mode:'intro',mt:0,t:0,bx0:R.bossX,blobs:[],spots:[],lasers:[],splats:[],bars:Array(8).fill(true),
  charge:0,cmax:10,hitT:0,laugh:0,angryT:0,shield:0,crack:0,keyHop:0,say:0,throwsLeft:0,windDur:.8,dirty:true,ANG,ORB,sp:null,fail:null,q:{blob:[],rock:[],spell:[]},done:false,vis:tier<=2};
 R.streak=0}
const brokenCount=b=>b.bars.filter(x=>!x).length;
function breakBar(b){const idx=b.bars.map((v,i)=>v?i:-1).filter(i=>i>=0);if(!idx.length)return;const i=RN.pick(idx);b.bars[i]=false;
 const cg=cageGeom(),x=cg.cx+ri(i*(cg.cw-1)/7);RN.burst(x,GROUND-cg.ch/2,'#c8c8d8',6,45);RN.snd(300+brokenCount(b)*40,.08,'square',.05);b.keyHop=.35}
function syncBars(b){const want=b.hp<=0?8:Math.floor((1-b.hp/b.max)*8+1e-6);while(brokenCount(b)<want)breakBar(b)}
function dmg(n,kill){const b=act();if(!b||b.hp<=0)return;
 let nh=b.hp-n;if(nh<=0&&!kill&&b.sched.some(s=>!s.done))nh=Math.min(1,b.hp);
 b.hp=Math.max(0,nh);b.hitT=.16;syncBars(b);
 if(b.hp<=0)die(b);
 else if(!b.p2&&b.hp<=b.max*.5){b.p2=true;b.angryT=.8;const v=vgeom(b);RN.popTxt('GRR!',wx(v.sx),GROUND-v.vh-10,'#ff6b7a');RN.snd(150,.4,'sawtooth',.07);shake(3);RN.burst(v.sx,v.cy,'#ff4a4a',14,70)}}
function die(b){if(b.mode==='dying'||b.mode==='done')return;
 b.blobs.forEach(z=>RN.burst(ri(z.x)+3,ri(z.y)+3,'#6a3fb8',6,40));b.blobs=[];b.spots=[];b.sp=null;setMode(b,'dying');b.ko=0;sfxT('super')}
const wordLen=b=>b.blobs.reduce((a,z)=>a+z.w.length,0);
function doThrow(b){
 const v=vgeom(b),R=RN.R,n=b.tier>=6?(b.p2?3:2):(b.tier>=2&&b.p2?2:1);
 const f=Math.pow(Math.max(20,R.v)/62,.6),sx0=v.sx-v.vw/2+2;
 let off=0;
 for(let i=0;i<n;i++){const it=pull(b,'blob'),w=it.w,T=Math.max(3.2,(2.6+w.length*1.0*Math.pow(b.tm,.8))/f)*(b.p2?.88:1)+i*1.6;
  const z={x:sx0+off,sx0:sx0+off,v:(sx0+off-HITX)/T,w,i:0,st:'in',arc:Math.random()<.4,y:GROUND-8,ph:RN.rnd(0,3)};b.blobs.push(z);off+=14}
 b.say=.5;RN.snd(220,.12,'square',.06);RN.snd(330,.1,'square',.05,.06);setMode(b,'fly');b.said=null}
function activeBlob(b){return b.blobs.filter(z=>z.st==='in').sort((p,q)=>p.x-q.x)[0]||null}
function spawnSpots(b){
 const n=b.tier>=3?3:2,slots=[[0,-26],[0,-47],[0,-68]],sl=(n<3?[slots[0],slots[2]]:slots),used=[],dur=Math.max(2.4,(b.p2?5.4:6.4)*Math.max(.6,1-.04*b.tier));
 b.spots=[];sl.forEach(s=>{let it=null;for(let k=0;k<12;k++){it=pull(b,'rock');if(!used.includes(it.ans))break}used.push(it.ans);b.spots.push({ans:it.ans,show:it.show,w:it.w,ox:s[0],oy:s[1],l:dur,dur})});
 RN.snd(660,.08,'triangle',.05);RN.snd(880,.1,'triangle',.05,.08);setMode(b,'weak')}
function spotPos(b,s){const v=vgeom(b);return{x:ri(v.sx+s.ox),y:Math.max(32,Math.min(GROUND-10,ri(GROUND+s.oy)))}}
function nextVolley(b){b.throwsLeft=b.p2?2:(b.tier>=4?2:1);b.windDur=(b.p2?.6:.9)*b.tm;setMode(b,'wind')}
function countHit(){const R=RN.R,b=act();R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);sfxT('ok',R.streak);
 if(b.charge<b.cmax){b.charge++;if(b.charge>=b.cmax){RN.snd(880,.1,'square',.05);RN.snd(1175,.15,'square',.05,.1)}}}
const laser=(b,tx,ty,col,big)=>b.lasers.push({tx,ty,c:col,l:big?.55:.12,max:big?.55:.12,big:!!big});
function hitBlob(z){const b=act(),col=RN.fc(z.w[z.w.length-1]);laser(b,ri(z.x)+3,ri(z.y)+3,col);
 const v=vgeom(b);z.st='back';z.x0=z.x;z.y0=z.y;z.bt=0;z.tx=v.sx;z.ty=v.cy;z.col=col;RN.burst(ri(z.x)+3,ri(z.y)+3,col,8,55);RN.snd(700,.08,'square',.05);RN.popTxt('NICE!',wx(ri(z.x)+3),ri(z.y)-24,'#4de08a')}
function hitSpot(s){const b=act(),p=spotPos(b,s),col=RN.fc(s.ans);laser(b,p.x,p.y,col);countHit();
 b.spots=b.spots.filter(q=>q!==s);RN.burst(p.x,p.y,col,10,60);RN.burst(p.x,p.y,'#ffffff',5,40);
 if(b.bars.filter(x=>x).length>2)breakBar(b);b.crack=.25;
 RN.popTxt('CRACK!',wx(cageGeom().cx+14),GROUND-cageGeom().ch-6,'#f0c860');shake(1);dmg(1);
 if(act()&&act().mode==='weak'&&!b.spots.length)setMode(b,'rest')}
function mega(){const b=act(),R=RN.R;b.charge=0;const v=vgeom(b);laser(b,v.sx,v.cy,'#f0c860',true);
 b.blobs.forEach(z=>RN.burst(ri(z.x)+3,ri(z.y)+3,'#c9a8f0',8,60));b.blobs=[];
 R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);
 RN.burst(v.sx,v.cy,'#ffffff',34,120);RN.burst(v.sx,v.cy,'#f0c860',26,90);RN.burst(RX+4,GROUND-16,'#8ff0ff',12,60);shake(6);RN.popTxt('MEGA!',wx(v.sx),GROUND-v.vh-10,'#f0c860');
 RN.snd(180,.5,'sawtooth',.08);RN.snd(360,.4,'square',.06,.05);RN.snd(720,.3,'square',.05,.12);dmg(3);b.dirty=true}
function splat(b,z){const R=RN.R;R.streak=0;b.shield=.45;b.splats.push({x:HITX,y:ri(z.y)+3,l:.65});
 RN.popTxt('SPLAT',wx(HITX+22),ri(z.y)-30,'#c9a8f0');RN.burst(HITX+2,ri(z.y)+3,'#6a3fb8',8,45);RN.snd(130,.15,'triangle',.07);RN.snd(220,.08,'sine',.05,.05)}
/* sentence spell = dictation */
const spellDue=(b,s)=>b.hp<=b.max*s.at+1e-6;
const dueSpell=b=>b.sched.find(s=>!s.done&&spellDue(b,s));
function startSpell(b,s){s.done=true;const it=pull(b,'spell'),txt=it.text||it.words.join(' '),tier=b.tier;
 const showT=b.vis?999:Math.max(1.6,3.2-.12*tier),per=Math.max(.9,2.2-.1*tier);
 b.cur=s;b.sp={txt,sent:it.s||txt,i:0,t:0,final:!!s.final,showT,lim:5+txt.length*per+(b.vis?0:Math.min(showT,4))};
 b.blobs=[];b.spots=[];setMode(b,'spell');const v=vgeom(b);RN.popTxt(s.final?'FINAL SPELL!':'SPELL!',wx(v.sx),GROUND-v.vh-18,'#c9a8f0');
 RN.snd(120,.5,'sawtooth',.07);RN.snd(240,.4,'triangle',.05,.15);RN.burst(v.sx,v.cy,'#c9a8f0',14,60);setTimeout(()=>say(b.sp&&b.sp.sent||it.s),500)}
function spellKey(b,e){const s=b.sp;if(!s||s.state)return;
 if(e.key==='Enter'){say(s.sent);return}
 if(e.key.length!==1)return;
 const want=s.txt[s.i],caps=e.getModifierState&&e.getModifierState('CapsLock')&&!e.shiftKey,kk=caps?e.key.toLowerCase():e.key;
 if(e.key!==want&&kk!==want){RN.miss();b.laugh=.3;return}
 const v=vgeom(b),R=RN.R;laser(b,v.sx,v.cy,RN.fc(want===' '?'f':want));
 R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);sfxT('ok',R.streak);RN.burst(v.sx-6,v.cy,RN.fc(want===' '?'f':want),3,40);
 s.i++;if(s.i>=s.txt.length)spellDone(b);flush()}
function spellDone(b){const s=b.sp,v=vgeom(b);s.state='won';b.sp=null;b.cur=null;
 laser(b,v.sx,v.cy,'#f0c860',true);RN.burst(v.sx,v.cy,'#ffffff',34,120);RN.burst(v.sx,v.cy,'#c9a8f0',24,90);shake(6);
 RN.popTxt('SPELL BROKEN!',wx(v.sx),GROUND-v.vh-16,'#f0c860');RN.snd(180,.5,'sawtooth',.08);RN.snd(360,.4,'square',.06,.05);RN.snd(720,.3,'square',.05,.12);
 b.charge=Math.min(b.cmax,b.charge+2);const fin=!!s.final;setMode(b,'rest');b.mt=-.4;dmg(fin?b.hp:Math.max(2,Math.round(b.max*.25)),fin)}
function spellFail(b){const s=b.sp,v=vgeom(b);b.sp=null;b.fail={x:v.sx,y:v.cy,t:0,fin:!!s.final};b.cur=null;setMode(b,'spfail');RN.snd(200,.3,'sawtooth',.07)}
function spellHit(b){const R=RN.R;R.streak=0;b.shield=.9;b.hp=Math.min(b.max,b.hp+Math.max(1,Math.ceil(b.max*.1)));
 for(let i=0;i<4;i++)b.splats.push({x:HITX-4+i*3,y:GROUND-26+i*9,l:.9});
 RN.popTxt('SPLAT!!',wx(HITX+26),GROUND-40,'#c9a8f0');RN.popTxt('+HP',wx(vgeom(b).sx),GROUND-vgeom(b).vh-10,'#ff6b7a');
 RN.burst(HITX+2,GROUND-16,'#6a3fb8',22,80);shake(5);RN.snd(100,.35,'triangle',.09);b.laugh=.9;
 if(b.fail&&b.fail.fin){const s=b.sched.find(q=>q.final);if(s)s.done=false}
 b.fail=null;setMode(b,'rest');b.mt=-.5}
function update(dt){const b=act();if(!b)return;const R=RN.R;if(b.mode==='done')return;
 b.t+=dt;b.mt+=dt;['hitT','laugh','angryT','shield','crack','keyHop','say'].forEach(k=>{b[k]=Math.max(0,b[k]-dt)});
 b.lasers.forEach(l=>l.l-=dt);b.lasers=b.lasers.filter(l=>l.l>0);b.splats.forEach(s=>s.l-=dt);b.splats=b.splats.filter(s=>s.l>0);
 if(b.mode==='intro'){const k=Math.min(1,b.mt/.8);R.bossX=ri(b.bx0+36*(k*(2-k)));if(b.mt>=1.3){R.bossX=b.bx0+36;nextVolley(b)}}
 else if(b.mode==='wind'){if(b.angryT>0)b.mt=Math.min(b.mt,0);else if(b.mt>=b.windDur)doThrow(b)}
 else if(b.mode==='fly'){const a=activeBlob(b);
  if(a&&b.said!==a){b.said=a;setTimeout(()=>{if(act()===b&&activeBlob(b)===a)say(a.w)},250);b.dirty=true}
  if(!b.blobs.length){const sp=dueSpell(b);if(sp)startSpell(b,sp);else{b.throwsLeft--;if(b.throwsLeft>0){b.windDur=(b.p2?.4:.5)*b.tm;setMode(b,'wind')}else spawnSpots(b)}}}
 else if(b.mode==='weak'){const n0=b.spots.length;b.spots.forEach(s=>s.l-=dt);
  b.spots=b.spots.filter(s=>{if(s.l>0)return true;const p=spotPos(b,s);RN.burst(p.x,p.y,'#b8c0e8',6,30);return false});
  if(b.spots.length!==n0)b.dirty=true;if(!b.spots.length)setMode(b,'rest')}
 else if(b.mode==='rest'){if(b.mt>=.8*b.tm){const sp=dueSpell(b);if(sp)startSpell(b,sp);else nextVolley(b)}}
 else if(b.mode==='spell'){const s=b.sp;if(s){s.t+=dt;if(s.t>=s.lim)spellFail(b)}}
 else if(b.mode==='spfail'){b.fail.t+=dt;if(b.fail.t>=.5)spellHit(b)}
 else if(b.mode==='dying'){const v=vgeom(b);
  if(!b.ko&&b.mt>=.2){b.ko=1;RN.popTxt('K.O.!',wx(v.sx),GROUND-v.vh-34,'#ffffff');RN.burst(v.sx,v.cy,'#6a3fb8',24,110);shake(5);RN.snd(90,.3,'sawtooth',.09)}
  if(b.ko&&Math.floor(b.mt*12)!==Math.floor((b.mt-dt)*12))RN.burst(v.sx+RN.rnd(-v.vw/2,v.vw/2),v.cy+RN.rnd(-v.vh/2,v.vh/2),RN.pick(['#6a3fb8','#c9a8f0','#ffffff']),6,70);
  if(b.mt>=1.5){const cg=cageGeom();b.bars.fill(false);b.done=true;b.mode='done';
   RN.burst(cg.cx+cg.cw/2,GROUND-cg.ch/2,'#c8c8d8',30,110);RN.burst(cg.cx+cg.cw/2,GROUND-cg.ch/2,'#f0c860',20,80);RN.burst(v.sx,v.cy,'#b48ae0',16,80);shake(6);
   RN.popTxt('DEFEATED!',wx(v.sx),GROUND-v.vh-14,'#f0c860');RN.snd(500,.2,'square',.06);RN.snd(800,.3,'triangle',.06,.1);RN.win();return}}
 b.blobs=b.blobs.filter(z=>{
  if(z.st==='in'){z.x-=z.v*dt;const pr=clamp((z.sx0-z.x)/(z.sx0-HITX),0,1);z.y=z.arc?(GROUND-8)-ri(Math.sin(Math.PI*pr)*16):GROUND-8;
   if(z.x<=HITX){splat(b,z);b.dirty=true;return false}return true}
  z.bt+=dt;const k=Math.min(1,z.bt/.22);z.x=z.x0+(z.tx-3-z.x0)*k;z.y=z.y0+(z.ty-3-z.y0)*k;
  if(k>=1){RN.burst(z.tx,z.ty,z.col,12,80);RN.burst(z.tx,z.ty,'#ffffff',5,50);shake(2);RN.snd(260,.08,'square',.06);dmg(1);return false}return true});
 if(b.dirty){b.dirty=false;flush()}
 hintOff()}
function key(e){const b=act();if(!b)return;
 if(b.mode==='dying'&&e.key===' '&&b.mt>.5){b.mt=Math.max(b.mt,1.5);return}
 if(b.mode==='dying'||b.mode==='done'||b.mode==='intro')return;
 if(b.mode==='spell'){spellKey(b,e);return}
 if(b.mode==='spfail')return;
 if(e.key===' '){if(b.charge>=b.cmax){mega();flush()}else{const a=activeBlob(b);if(a)say(a.w)}return}
 if(e.key.length!==1||!/[a-zA-Z]/.test(e.key))return;
 const caps=e.getModifierState&&e.getModifierState('CapsLock')&&!e.shiftKey,kk=(caps?e.key.toLowerCase():e.key).toLowerCase(),R=RN.R;
 const a=activeBlob(b);
 if(a){if(kk===a.w[a.i]){a.i++;R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);sfxT('ok',R.streak);
   const v=a,col=RN.fc(kk);laser(b,ri(v.x)+3,ri(v.y)+3,col);RN.burst(ri(v.x)+3,ri(v.y)+3,col,3,35);
   if(a.i>=a.w.length){countHit();hitBlob(a)}}
  else{RN.miss();b.laugh=.4}
  flush();return}
 const s=b.spots.find(q=>q.ans===kk);
 if(s){hitSpot(s);flush();return}
 if(b.spots.length){RN.miss();b.laugh=.4;flush()}}
function stripHTML(){const b=act();
 if(b&&b.mode==='spell'&&b.sp){const s=b.sp,show=b.vis||s.t<s.showT;return [...s.txt].map((c,i)=>`<span class="${c===' '?'sp':''} ${i<s.i?'ok':''}">${c===' '?'·':(i<s.i||show?esc(c):'_')}</span>`).join('')}
 const a=b&&b.mode!=='dying'&&b.mode!=='done'?activeBlob(b):null;
 if(a)return [...a.w].map((c,i)=>`<span class="${i<a.i?'ok':''}">${i<a.i||b.vis?esc(c):'_'}</span>`).join('');
 if(b&&b.spots.length)return b.spots.map(()=>'<span>?</span>').join('');
 return '<span class="sp">·</span>'}
function strip(){const b=act();if(!b)return{cur:-1,ch:null};
 if(b.mode==='spell'&&b.sp)return{cur:b.sp.i,ch:b.vis?b.sp.txt[b.sp.i]:null};
 const a=activeBlob(b);if(a)return{cur:Math.min(a.i,a.w.length-1),ch:b.vis?a.w[a.i]:null};
 return b.spots.length?{cur:0,ch:null}:{cur:-1,ch:null}}
/* drawing */
function draw(g,cam){
 const R=RN.R,b=act(),bx=R.bossX-cam;if(bx>C.W+50)return;const cg=cageGeom(),K=cg.K,cx=ri(bx+20),t=b?b.t:R.t;
 const hop=b&&b.keyHop>0?-(Math.floor(b.keyHop*14)%2)*2:0;if(K)g.drawImage(K,cx+3,GROUND-cg.kh-2+hop);
 g.fillStyle=b&&b.crack>0?'#ffffff':'#3a3048';g.fillRect(cx,GROUND-cg.ch-2,cg.cw,2);g.fillRect(cx,GROUND-2,cg.cw,2);
 for(let i=0;i<8;i++){const x=cx+ri(i*(cg.cw-1)/7),intact=b?b.bars[i]:true;g.fillStyle='#9a9ab0';
  if(intact){g.fillRect(x,GROUND-cg.ch,1,cg.ch-2);g.fillStyle='#d8d8e8';g.fillRect(x,GROUND-cg.ch,1,2)}else{g.fillRect(x,GROUND-cg.ch,1,3);g.fillRect(x,GROUND-5,1,3)}}
 g.fillStyle='#6e5e88';g.fillRect(cx+1,GROUND-cg.ch-2,cg.cw-2,1);
 const v=vgeom(b);
 if(v.hasV){g.drawImage(v.img,ri(v.sx-v.vw/2),GROUND-v.vh+v.dy)}else{g.fillStyle=(b&&b.hitT>0)?'#ffffff':'#6a3fb8';g.fillRect(ri(v.sx-16),GROUND-32+v.dy,32,32)}
 if(b&&b.mode==='wind'&&!b.angryT&&b.mt/b.windDur>.35&&Math.floor(t*10)%2)RN.txt(g,'!',ri(v.sx)-4,GROUND-v.vh-12+v.dy,'#ff6b7a',1,'l');
 if(b&&b.say>0&&Math.floor(t*8)%2){const sx=ri(v.sx-v.vw/2)-8,sy=GROUND-ri(v.vh/2)-6;g.fillStyle='#f0c860';g.fillRect(sx,sy-6,2,12);g.fillRect(sx-4,sy-4,2,8);g.fillRect(sx-8,sy-2,2,4)}}
function line(g,x0,y0,x1,y1,th,col){g.fillStyle=col;const h=th>>1;if(y0===y1){g.fillRect(Math.min(x0,x1),y0-h,Math.abs(x1-x0)+1,th);return}
 const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++)g.fillRect(x0+ri((x1-x0)*i/n)-h,y0+ri((y1-y0)*i/n)-h,th,th)}
function disc(g,cx,cy,r,col){g.fillStyle=col;for(let dy=-r;dy<=r;dy++){const w=ri(Math.sqrt(Math.max(0,r*r-dy*dy)));g.fillRect(cx-w,cy+dy,2*w+1,1)}}
function shield(g,cx,cy,rx,ry,col){g.fillStyle=col;const hw=d=>d>ry?0:ri(rx*Math.sqrt(Math.max(0,1-(d/ry)*(d/ry))));
 for(let dy=-ry;dy<=ry;dy++){const a=hw(Math.abs(dy)),e=hw(Math.abs(dy)+1),run=Math.max(1,a-e);g.fillRect(cx-a,cy+dy,run,1);g.fillRect(cx+a-run+1,cy+dy,run,1)}}
function banner(g,b){const s=b.sp;if(!s)return;const t=b.t,n=s.txt.length,sc=n*16<=C.W-24?2:1,cw=8*sc,x0=6,bw=C.W-12,y0=22,bh=sc===2?30:26;
 const pop=Math.min(1,b.mt/.25),yy=y0-ri((1-pop)*30),show=b.vis||s.t<s.showT;
 g.fillStyle='#0b1033';g.fillRect(x0-3,yy-1,bw+6,bh+2);g.fillStyle=s.final?'#5a1830':'#2a1a4a';g.fillRect(x0-2,yy,bw+4,bh);
 g.fillStyle=s.final?'#ff6b7a':'#f0c860';g.fillRect(x0-2,yy,bw+4,1);g.fillRect(x0-2,yy+bh-1,bw+4,1);g.fillRect(x0-2,yy,1,bh);g.fillRect(x0+bw+1,yy,1,bh);
 g.fillStyle='#0b1033';g.fillRect(x0,yy+2,bw,bh-4);
 const vis=Math.floor((bw-(sc===2?0:12))/cw),total=n*cw,view=vis*cw;let off=0;if(total>view)off=Math.max(0,Math.min(total-view,s.i*cw-ri(view*.4)));
 const sx=sc===2?ri(x0+(bw-total)/2):x0+6,ty=yy+(sc===2?4:5),first=ri(off/cw),last=Math.min(n-1,first+vis-1);
 for(let i=first;i<=last;i++){const c=s.txt[i],x=sx-ri(off)+i*cw;if(x<x0||x+cw>x0+bw)continue;
  if(i===s.i){const bl=Math.floor(t*6)%2;g.fillStyle=bl?'#ffffff':'#f0c860';g.fillRect(x-1,ty-1,cw+1,9*sc+2);if(c!==' '&&show)RN.txt(g,c,x,ty,'#0b1033',sc,'l',null);else{g.fillStyle='#0b1033';g.fillRect(x+2,ty+9*sc-2,cw-4,2)}}
  else if(i<s.i){if(c!==' ')RN.txt(g,c,x,ty,'#f0c860',sc,'l','#000000')}
  else if(c===' '){g.fillStyle='#39427e';g.fillRect(x+cw/2-1,ty+9*sc-2,2,2)}
  else if(show)RN.txt(g,c,x,ty,'#e6dcff',sc,'l','#000000');else{g.fillStyle='#39427e';g.fillRect(x+1,ty+9*sc-2,cw-2,2)}}
 const k=Math.max(0,1-s.t/s.lim),low=k<.25;g.fillStyle='#0b1033';g.fillRect(x0,yy+bh-5,bw,3);g.fillStyle=low&&Math.floor(t*8)%2?'#ffffff':low?'#ff4a4a':'#8ff0ff';g.fillRect(x0+1,yy+bh-4,ri((bw-2)*k),1)}
function top(g,cam){const b=act();if(!b||RN.R.phase!=='boss')return;const t=b.t;
 b.spots.forEach(s=>{const p=spotPos(b,s),pulse=Math.floor(t*5)%2,late=s.l<1.2&&Math.floor(t*10)%2,wd=s.show.length*8+6,ox=ri(wd/2)+4,oy=9+pulse;
  if(!late){g.fillStyle='#0b1033';g.fillRect(p.x-ox-1,p.y-oy-1,2*ox+2,2*oy+2);const col=pulse?'#ffffff':'#f0c860';g.fillStyle=col;g.fillRect(p.x-ox,p.y-oy,2*ox,2);g.fillRect(p.x-ox,p.y+oy-2,2*ox,2);g.fillRect(p.x-ox,p.y-oy,2,2*oy);g.fillRect(p.x+ox-2,p.y-oy,2,2*oy);g.fillStyle='#0b1033';g.fillRect(p.x-ox+2,p.y-oy+2,2*ox-4,2*oy-4)}
  wordBox(g,p.x-ri(wd/2),p.y-7,s.show,1,t);
  const bw=ri(2*ox*Math.max(0,s.l)/s.dur);g.fillStyle='#f0c860';g.fillRect(p.x-ox,p.y+oy+1,bw,1)});
 const act1=activeBlob(b);
 b.blobs.forEach(z=>{const sp=Math.floor(t*6+z.ph)%2?BLOB_B:BLOB_A,x=ri(z.x),y=ri(z.y);g.drawImage(sp,x,y);
  if(z.st==='in'){const n=z.w.length,wd=n*8+4,bx=clamp(x+3-ri(wd/2),1,C.W-wd-2),by=y-17-(z===act1?Math.floor(t*6)%2:0),cur=z===act1;
   g.fillStyle='#0b1033';g.fillRect(bx-1,by-1,wd+2,13);g.fillStyle=cur?'#f0c860':'#e8ecff';g.fillRect(bx,by,wd,11);
   for(let i=0;i<n;i++){const c=z.w[i];if(i<z.i)RN.txt(g,c,bx+2+i*8,by+1,'#2a8a4a',1,'l',null);else if(b.vis)RN.txt(g,c,bx+2+i*8,by+1,'#6a6a90',1,'l',null);else{g.fillStyle='#0b1033';g.fillRect(bx+3+i*8,by+9,6,1)}}}});
 if(b.mode==='spell'&&b.sp){const v=vgeom(b),p=Math.min(1,b.mt/.9),r=3+ri(p*8),f=Math.floor(t*10)%2,ox=v.sx,oy=GROUND-v.vh-14-ri(p*4);
  disc(g,ox,oy,r+1,'#0b1033');disc(g,ox,oy,r,f?'#c9a8f0':'#8a5fd8');disc(g,ox,oy,Math.max(1,r-3),f?'#ffffff':'#e6dcff');banner(g,b)}
 if(b.mode==='spfail'&&b.fail){const f=b.fail,k=Math.min(1,f.t/.5),ox=ri(f.x+(HITX-f.x)*k),oy=ri(f.y-16+(GROUND-16-(f.y-16))*k);disc(g,ox,oy,12,'#0b1033');disc(g,ox,oy,11,'#8a5fd8');disc(g,ox,oy,8,Math.floor(t*14)%2?'#c9a8f0':'#ffffff')}
 b.lasers.forEach(l=>{const x0=RX+2,y0=GROUND-16;
  if(l.big){const k=l.l/l.max,th=k>.3?10:6,fl=Math.floor(t*30)%2;line(g,x0,y0,l.tx,l.ty,th,fl?'#f0c860':'#ffe9a0');line(g,x0,y0,l.tx,l.ty,th-4,'#ffffff')}
  else{line(g,x0,y0,l.tx,l.ty,2,l.c);line(g,x0,y0,l.tx,l.ty,1,'#ffffff')}});
 b.splats.forEach(s=>{if(s.l>.2||Math.floor(t*20)%2)g.drawImage(SPLAT,s.x-3,s.y-3)});
 if(b.shield>0&&Math.floor(t*24)%4)shield(g,HX+4,GROUND-16,16,19,Math.floor(t*12)%2?'#8ff0ff':'#ffffff')}
function drawHud(g){const R=RN.R,b=act(),f=b?b.hp/b.max:1;
 RN.txt(g,R.vname,C.W-6,4,'#ffffff',1,'r');g.fillStyle='#0b1033';g.fillRect(C.W-88,15,82,6);g.fillStyle='#3a2050';g.fillRect(C.W-87,16,80,4);
 g.fillStyle=b&&b.p2?'#ff9a3a':'#ff6b7a';g.fillRect(C.W-87,16,ri(80*f),4);
 let nm='KEYLORI';try{nm=SPECIES[R.sp].n[0].toUpperCase()}catch(e){}RN.txt(g,'FREE '+nm+'!',6,4,'#f0c860');
 if(!b)return;const seg=6,mw=b.cmax*seg+1,full=b.charge>=b.cmax,fl=Math.floor(b.t*8)%2;
 g.drawImage(BOLT,6,15);g.fillStyle='#0b1033';g.fillRect(13,14,mw+2,8);g.fillStyle='#1a2156';g.fillRect(14,15,mw,6);
 for(let i=0;i<b.cmax;i++)if(i<b.charge){g.fillStyle=full?(fl?'#ffffff':'#f0c860'):'#8ff0ff';g.fillRect(15+i*seg,16,seg-1,4)}
 if(full&&b.mode!=='dying'&&b.mode!=='done'&&b.mode!=='spell'&&b.mode!=='spfail'){const x=HX-24,y=32;g.fillStyle='#0b1033';g.fillRect(x-1,y-1,50,15);g.fillStyle=fl?'#f0c860':'#ffffff';g.fillRect(x,y,48,13);RN.txt(g,'SPACE',x+4,y+2,'#0b1033',1,'l',null)}}
const bee={start,key,update,draw,drawHud,strip,stripHTML,_state:()=>act()};
HK.drawTop.push(top);

/* dispatcher: spell stream -> Bee, everything else -> the boss that was installed before us */
const prev=RN.boss;let cur=prev;
const D2={
 start(R){cur=isSp(R)?bee:(prev||bee);return cur.start&&cur.start(R)},
 key(e){return cur.key&&cur.key(e)},update(dt){return cur.update&&cur.update(dt)},
 draw(g,cam){return cur.draw&&cur.draw(g,cam)},drawHud(g){return cur.drawHud&&cur.drawHud(g)},
 strip(){return cur.strip?cur.strip():{cur:-1,ch:null}},stripHTML(){return cur.stripHTML?cur.stripHTML():''},
 _state(){return cur._state&&cur._state()}};
if(prev)Object.keys(prev).forEach(k=>{if(!(k in D2))D2[k]=prev[k]});
RN.boss=D2;
})();
