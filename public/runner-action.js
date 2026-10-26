/* Keyloria Run add-on: ARCADE ACTION in the run.
   1) SCRAMBLER AMBUSH: a mini Scrambler hops in and throws ink blobs with keycaps. Type the letter to laser the blob back and KO it.
      A blob that arrives splats on the shield (short slow-down, combo reset, never damage).
   2) RUN CHARGE + SPACE BLAST: correct keys fill a meter; at full, SPACE fires a mega beam that smashes rocks and ambushers and gives a smooth speed boost.
   No lives, no game over. Hard pixels only. */
(function(){
if(!window.RUNNER)return;
try{
const RN=window.RUNNER,C=RN.C,GROUND=C.GROUND,RX=C.RX,BW=C.BW,HX=RX-BW/2,HITX=RX+6;
const ri=Math.round,HK=RN.HK,SEG=RN.SEG;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sfxTry=(n,a)=>{try{sfx[n](a)}catch(e){}};
const lc=s=>String(s||'').toLowerCase();

/* ---------- sprites ---------- */
const BLOB_A=RN.PX(["..ooo..",".oiiio.","oiwiwio","oiiiiio","oiiiiio",".oiiio.","..ooo.."],{o:'#150b26',i:'#6a3fb8',w:'#ffffff'});
const BLOB_B=RN.PX([".......",".ooooo.","oiwiwio","oiiiiio","oiiiiio","oiiiiio",".ooooo."],{o:'#150b26',i:'#6a3fb8',w:'#ffffff'});
const SPLAT=RN.PX(["..o...o....",".oio.oio.o.","oiiioiiioio",".oiiiiiiio.","oiiioiiiiio",".oio.oioio.","..o...o.o.."],{o:'#150b26',i:'#6a3fb8'});
const BOLT=RN.PX(["..yyy",".yyy.","yyyyy","..yy.",".yy..","yy..."],{y:'#f0c860'});
const GEM=RN.PX([".oooo.","oCWCCo","oCCCco",".oCco.","..oo.."],{o:'#0b2a4a',C:'#8ff0ff',W:'#ffffff',c:'#4ab4d8'});
const MP={o:'#150b26',i:'#8a55d8',d:'#5a2f98',w:'#ffffff',k:'#150b26',m:'#ff4a4a',h:'#f0c860'};
const MINI_A=RN.PX(["oh........ho",".oo......oo.",".oiioooooiio","oiiiiiiiiiio","oiwwiiiiwwio","oiwkiiiikwio","oiiiiiiiiiio","oiimmmmmmiio",".odiiiiiidd.",".oooiiiiooo.","..oo....oo.."],MP);
const MINI_B=RN.PX(["oh........ho",".oo......oo.",".oiioooooiio","oiiiiiiiiiio","oiwwiiiiwwio","oiwkiiiikwio","oiiiiiiiiiio","oiimmmmmmiio",".odiiiiiidd.","..ooiiiioo..",".oo......oo."],MP);
const MINI_W=RN.flash(MINI_A,'#ffffff'),MINI_WB=RN.flash(MINI_B,'#ffffff');
const MW=12,MH=11;

/* ---------- state ---------- */
let A=null;
const rr=()=>RN.R;
function fresh(R){
 const hard=!!R.L.hard,lv=RN.opt.lv||0;
 return{R,hard,lv,plan:[],idx:0,mode:null,mt:0,t:0,sx:0,sy:0,air:false,blobs:[],gems:[],deb:[],beams:[],lasers:[],splats:[],
  shield:0,flash:0,retHits:0,charge:0,cmax:hard?14:7+(lv>=3?1:0),lastHits:R.hits,boostT:-1,slowT:-1,mult:1,hint:'',hintHTML:'',prev:'',wait:0,fullT:0,bmag:hard?.15:.27}}
const act=()=>{const R=rr();if(!R)return null;if(!A||A.R!==R)A=fresh(R);return A};

/* ---------- planning: where ambushes happen ---------- */
const blobTime=(a)=>{const R=a.R,spd=clamp(R.v/R.L.v,.5,1.6);const base=a.hard?1.7:Math.max(2.6,3.2-.1*a.lv);return Math.max(1.4,base/Math.pow(spd,.7))};
const spanPx=a=>(.45+.5+blobTime(a)+.5)*a.R.v*1.2;
function okAt(a,X,span){
 const R=a.R;
 if(X<RX+240||X+span>R.bossX-200)return false;
 for(const o of R.obs){
  if(o.t==='gap'||o.t==='fork'){const e=o.x+(o.w||0);if(X>o.x-120&&X<e+120)return false}
  else if(o.t==='flap'){if(X+span>o.x-120&&X<o.x+o.w+60)return false}}
 return true}
function planRun(R){
 const a=A=fresh(R),hard=a.hard,lv=a.lv;
 let n=hard?2+Math.floor(Math.random()*3):lv<=0?0:lv===1?1:lv===2?2:lv<=4?2+Math.floor(Math.random()*2):3;
 if(hard)n=Math.max(n,3);
 if(!n)return;
 const span=spanPx(a),lo=RX+240,hi=R.bossX-200-span;if(hi<=lo)return;
 const cands=[];for(let X=lo;X<=hi;X+=20)if(okAt(a,X,span))cands.push(X);
 if(!cands.length)return;
 const sep=span+160,out=[];
 for(let k=0;k<n;k++){
  const a0=lo+(hi-lo)*k/n,a1=lo+(hi-lo)*(k+1)/n;
  const seg=cands.filter(X=>X>=a0&&X<a1&&out.every(p=>Math.abs(p-X)>=sep));
  if(seg.length)out.push(seg[Math.floor(Math.random()*seg.length)])}
 a.plan=out.sort((p,q)=>p-q)}
HK.build.push(R=>{try{planRun(R)}catch(e){console.error('[runner-action build]',e);A=fresh(R)}});

/* ---------- letters ---------- */
const wantsOf=o=>{try{
 if(o.t==='gap')return o.word;if(o.t==='rock')return o.key;
 let s=SEG[o.t]?SEG[o.t].want(o):'';if(o.t==='fork')s+=o.hi+o.lo;if(o.t==='flap'&&o.letters)s+=o.letters.join('');return s}catch(e){return ''}};
const isDoneObs=o=>{try{return o.t==='gap'?o.typed>=o.word.length:o.t==='rock'?(o.done||o.jt):(SEG[o.t]?SEG[o.t].done(o):true)}catch(e){return true}};
function curWants(){const t=RN.target();if(!t)return '';try{if(t.t==='gap')return t.word[t.typed]||'';if(t.t==='rock')return t.key;return SEG[t.t]?SEG[t.t].want(t):''}catch(e){return ''}}
function pickCh(a,others){
 const keys=[...new Set([...a.R.L.keys])],R=a.R;
 const oth=others.map(lc);
 let strict=[];
 R.obs.filter(o=>!isDoneObs(o)&&o.x<R.cam+C.W+200).slice(0,4).forEach(o=>{strict.push(...[...wantsOf(o)].map(lc))});
 const loose=[...curWants()].map(lc);
 let pool=keys.filter(k=>!oth.includes(lc(k))&&!strict.includes(lc(k)));
 if(!pool.length)pool=keys.filter(k=>!oth.includes(lc(k))&&!loose.includes(lc(k)));
 if(!pool.length)pool=keys.filter(k=>!oth.includes(lc(k)));
 if(!pool.length)pool=keys;
 const p2=pool.filter(k=>lc(k)!==lc(a.prev));if(p2.length)pool=p2;
 let k=RN.pick(pool);if(a.R.L.caps&&/[a-z]/.test(k)&&Math.random()<a.R.L.caps)k=k.toUpperCase();
 a.prev=k;return k}

/* ---------- ambush flow ---------- */
const wx=sx=>ri(rr().cam)+sx;
const hy=()=>GROUND-16-ri(-rr().y);              // hero centre height (screen y)
function flapActive(R){return R.obs.some(o=>o.t==='flap'&&(o.st==='fly'||o.st==='pop'||o.st==='fall'))}
function forkActive(R){return R.obs.some(o=>o.t==='fork'&&(o.st==='hi'||o.st==='ledge'||o.st==='drop'))}
function nearSpecial(R){return R.obs.some(o=>(o.t==='gap'||o.t==='fork')&&!isDoneObs(o)&&o.x-R.front<120&&o.x+(o.w||0)>R.front-120)}
function startAmbush(a){
 a.air=Math.random()<.45;a.sx=ri(228+Math.random()*30);a.sy=a.air?GROUND-48:GROUND-MH;
 a.x=C.W+16;a.mode='in';a.mt=0;a.retHits=0;a.blobs=[];a.flash=0;
 RN.snd(300,.08,'square',.05);RN.snd(450,.08,'square',.05,.07)}
function throwBlobs(a){
 const n=a.hard?2:1,T=blobTime(a),sx0=a.sx-6,vel=(sx0-HITX)/T,others=[];
 for(let i=0;i<n;i++){
  const ch=pickCh(a,a.blobs.map(z=>z.ch).concat(others));others.push(ch);
  a.blobs.push({x:sx0+i*20,sx0:sx0+i*20,v:vel,ch,st:'in',arc:!a.air&&i===1,y:a.air?a.sy+3:GROUND-8,w:Math.random()*3,y0:a.air?a.sy+3:GROUND-8})}
 RN.snd(220,.12,'square',.06);RN.snd(330,.1,'square',.05,.06);a.mode='fly';a.mt=0}
function koScrambler(a,col){
 if(a.mode==='ko'||!a.mode||a.mode==='flee')return;
 const cx=a.sx,cy=a.sy+MH/2;
 RN.burst(cx,cy,'#ffffff',16,100);RN.burst(cx,cy,'#b48ae0',14,80);RN.burst(cx,cy,col||'#f0c860',10,70);
 RN.popTxt('POW!',wx(cx),a.sy-14,'#f0c860');RN.R.shake=Math.max(RN.R.shake,2);
 RN.snd(200,.2,'sawtooth',.06);RN.snd(520,.1,'square',.05,.05);RN.snd(780,.12,'square',.05,.1);
 for(let i=0;i<3;i++)a.gems.push({x:cx+(i-1)*5,y:cy,x0:cx+(i-1)*5,y0:cy,d:i*.1,t:0,pop:1});
 a.mode='ko';a.mt=0;a.blobs.forEach(z=>RN.burst(ri(z.x)+3,ri(z.y)+3,'#6a3fb8',6,40));a.blobs=[]}
function splat(a,z){
 const R=a.R;R.streak=0;a.shield=.45;a.slowT=0;a.splats.push({x:HITX,y:ri(z.y)+3,l:.65});
 RN.popTxt('SPLAT',wx(HITX+22),ri(z.y)-30,'#c9a8f0');RN.burst(HITX+2,ri(z.y)+3,'#6a3fb8',8,45);
 RN.snd(130,.15,'triangle',.07);RN.snd(220,.08,'sine',.05,.05);RN.updStrip()}
function hitBlob(a,z){
 const R=a.R,col=RN.fc(z.ch);
 a.lasers.push({tx:ri(z.x)+3,ty:ri(z.y)+3,c:col,l:.12});
 R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);sfxTry('ok',R.streak);
 z.st='back';z.x0=z.x;z.y0=z.y;z.bt=0;z.col=col;RN.burst(ri(z.x)+3,ri(z.y)+3,col,6,50);RN.snd(700,.08,'square',.05);
 RN.updStrip()}

/* ---------- mega blast ---------- */
function canFire(a){const R=a.R;return R.phase==='run'&&a.charge>=a.cmax&&!flapActive(R)}
function fire(a){
 const R=a.R,y=hy(),cam=R.cam;a.charge=0;a.boostT=0;
 a.beams.push({l:.38,max:.38,y});
 let nSm=0;
 R.obs.forEach(o=>{
  if(o.t!=='rock'||o.done||o.jt)return;const sx=o.x-cam;if(sx<RX-4||sx>C.W+10)return;
  o.done=true;nSm++;const cx=sx+(o.w||10)/2,delay=Math.max(.02,(cx-RX)/520);
  a.deb.push({o,ox:o.x,delay,hide:1});});
 // hold smashed rocks until the beam reaches them, then burst
 if(a.mode&&a.mode!=='ko'&&a.mode!=='flee')koScrambler(a,'#f0c860');
 a.blobs.forEach(z=>RN.burst(ri(z.x)+3,ri(z.y)+3,'#c9a8f0',8,60));a.blobs=[];
 R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);a.lastHits=R.hits;
 RN.burst(RX+6,y,'#ffffff',14,70);RN.burst(RX+6,y,'#8ff0ff',10,60);R.shake=Math.max(R.shake,3);
 RN.popTxt('MEGA!',R.front,GROUND-46-ri(-R.y),'#f0c860');
 RN.snd(180,.5,'sawtooth',.08);RN.snd(360,.4,'square',.06,.05);RN.snd(720,.3,'square',.05,.12);
 RN.updStrip()}
function smashRock(a,d){
 const R=a.R,o=d.o,sx=d.ox-ri(R.cam),cx=sx+(o.w||10)/2,cy=GROUND-5;
 o.x=-99999;                                     // hide it (engine still draws done rocks near the hero)
 RN.burst(cx,cy,'#c8c8d8',8,70);RN.burst(cx,cy,'#74748e',8,55);RN.burst(cx,cy,'#ffffff',4,60);
 const cols=['#9a9ab0','#74748e','#c8c8d8','#55556e'];
 for(let i=0;i<9;i++){const ang=Math.PI*(1.1+Math.random()*.8)*(i%2?1:1)+(Math.random()-.5)*2,sp=40+Math.random()*60;
  a.deb.push({chunk:1,x:d.ox+(o.w||10)/2+(Math.random()-.5)*8,y:cy-Math.random()*6,vx:Math.cos(ang)*sp*(Math.random()<.5?-1:1),vy:-Math.abs(Math.sin(ang))*sp*.8-8,l:.5+Math.random()*.3,c:cols[i%4],s:i%3?2:3})}
 RN.snd(140,.1,'square',.07);RN.snd(300,.06,'sawtooth',.05,.03)}

/* ---------- key hook ---------- */
HK.key.push(e=>{
 const a=act();if(!a)return false;const R=a.R;
 if(e.key===' '){
  if(R.phase!=='run')return false;
  if(canFire(a)){fire(a);return true}
  return true}                                   // ignored (and not a mistake)
 if(R.phase!=='run'||!a.blobs.length)return false;
 const caps=e.getModifierState&&e.getModifierState('CapsLock')&&!e.shiftKey,kk=caps?e.key.toLowerCase():e.key;
 const z=a.blobs.filter(q=>q.st==='in').sort((p,q)=>p.x-q.x).find(q=>q.ch===e.key||q.ch===kk);
 if(!z)return false;
 // never ambiguous: if the engine would accept this key for an obstacle on screen, let the engine have it
 const t=RN.target();if(t&&t.x-R.cam<=C.W+4&&[...curWants()].includes(kk))return false;
 hitBlob(a,z);return true});

/* ---------- update ---------- */
const sm=k=>{k=clamp(k,0,1);return k*k*(3-2*k)};
function setHint(a,z){
 try{const el=document.getElementById('rhint');if(!el)return;
  if(z){const h=fingerHTML(z.ch);if(a.hint!==z.ch||el.innerHTML!==a.hintHTML){setTarget(z.ch);el.innerHTML=h;a.hint=z.ch;a.hintHTML=el.innerHTML}}
  else if(a.hint){a.hint='';a.hintHTML='';RN.updStrip()}}catch(e){}}
HK.update.push(dt=>{
 const a=act();if(!a)return false;const R=a.R;if(R.phase!=='run')return false;
 a.t+=dt;a.mt+=dt;a.shield=Math.max(0,a.shield-dt);a.flash=Math.max(0,a.flash-dt);
 // charge from correct keys
 if(R.hits>a.lastHits){const d=R.hits-a.lastHits;if(a.charge<a.cmax){a.charge=Math.min(a.cmax,a.charge+d);if(a.charge>=a.cmax){RN.snd(880,.1,'square',.05);RN.snd(1175,.15,'square',.05,.1)}}}
 a.lastHits=R.hits;
 // smooth speed multiplier (blast boost, splat slow-down)
 let eb=0,es=0;
 if(a.boostT>=0){a.boostT+=dt;const D=2.2;eb=a.boostT>=D?0:Math.min(sm(a.boostT/.35),sm((D-a.boostT)/1));if(a.boostT>=D)a.boostT=-1}
 if(a.slowT>=0){a.slowT+=dt;const s=a.slowT;es=s<.2?sm(s/.2):s<.5?1:1-sm((s-.5)/.55);if(s>=1.05){a.slowT=-1;es=0}}
 const m=clamp((1+a.bmag*eb)*(1-.45*es),.5,1.45);
 if(m!==a.mult||m!==1){const base=R.v/a.mult;R.v=base*m;a.mult=m}
 // hide + burst smashed rocks as the beam reaches them; debris chunks
 for(let i=a.deb.length-1;i>=0;i--){const d=a.deb[i];
  if(d.hide){d.delay-=dt;if(d.delay<=0){smashRock(a,d);a.deb.splice(i,1)}}
  else{d.x+=d.vx*dt;d.y+=d.vy*dt;d.vx*=.92;d.vy*=.92;d.l-=dt;if(d.l<=0)a.deb.splice(i,1)}}
 a.beams.forEach(b=>b.l-=dt);a.beams=a.beams.filter(b=>b.l>0);
 a.lasers.forEach(l=>l.l-=dt);a.lasers=a.lasers.filter(l=>l.l>0);
 a.splats.forEach(s=>s.l-=dt);a.splats=a.splats.filter(s=>s.l>0);
 updGems(a,dt);
 // trigger
 if(!a.mode&&a.idx<a.plan.length){
  const X=a.plan[a.idx];
  if(R.front>=X){
   if(R.front>X+160)a.idx++;                                   // missed the window: skip it
   else if(!flapActive(R)&&!forkActive(R)&&!nearSpecial(R)&&R.front<R.bossX-200-120){a.idx++;startAmbush(a)}}}
 // Scrambler states
 if(a.mode==='in'){const k=Math.min(1,a.mt/.45),e=k*(2-k);a.x=ri(C.W+16+(a.sx-C.W-16)*e);if(a.mt>=.45){a.x=a.sx;a.mode='wind';a.mt=0}}
 else if(a.mode==='wind'){if(a.mt>=.5)throwBlobs(a)}
 else if(a.mode==='ko'){if(a.mt>.25){a.mode=null}}
 else if(a.mode==='flee'){a.x=ri(a.sx+a.mt*220);if(a.mt>.7)a.mode=null}
 // blobs
 a.blobs=a.blobs.filter(z=>{
  if(z.st==='in'){
   z.x-=z.v*dt;const pr=clamp((z.sx0-z.x)/(z.sx0-HITX),0,1);
   z.y=a.air?z.y0+(GROUND-9-z.y0)*pr:(z.arc?(GROUND-8)-ri(Math.sin(Math.PI*pr)*16):GROUND-8);z.y=ri(z.y);
   if(z.x<=HITX){splat(a,z);return false}
   return true}
  z.bt+=dt;const k=Math.min(1,z.bt/.22);z.x=z.x0+(a.sx-6-3-z.x0)*k;z.y=z.y0+((a.sy+MH/2-3)-z.y0)*k;
  if(k>=1){RN.burst(a.sx-6,a.sy+MH/2,z.col,12,80);RN.burst(a.sx-6,a.sy+MH/2,'#ffffff',5,50);RN.snd(260,.08,'square',.06);a.flash=.15;a.retHits++;return false}
  return true});
 if(a.mode==='fly'&&!a.blobs.length){
  if(a.retHits>0)koScrambler(a);else{a.mode='flee';a.mt=0;RN.snd(330,.1,'square',.04)}}
 // keep every live blob's letter unambiguous
 if(a.blobs.length){
  const cw=[...curWants()].map(lc);
  a.blobs.forEach(z=>{if(z.st==='in'&&cw.includes(lc(z.ch))){const nc=pickCh(a,a.blobs.filter(q=>q!==z).map(q=>q.ch));if(!cw.includes(lc(nc))){z.ch=nc;a.hint=''}}});
  // finger hint: show the blob's letter while it is the most urgent thing
  const z=a.blobs.filter(q=>q.st==='in').sort((p,q)=>p.x-q.x)[0],t=RN.target();
  if(z){const oeta=(t&&t.x-R.cam<=C.W+4)?Math.max(0,(t.x-R.front))/Math.max(R.speed,40):99,beta=(z.x-HITX)/z.v;setHint(a,beta<=oeta+.4?z:null)}else setHint(a,null)}
 else if(a.hint)setHint(a,null);
 return false});
function updGems(a,dt){
 const tx=C.W-37,ty=16;
 for(let i=a.gems.length-1;i>=0;i--){const g=a.gems[i];
  if(g.d>0){g.d-=dt;continue}
  g.t+=dt;const k=Math.min(1,g.t/.7),e=k*k;
  g.x=ri(g.x0+(tx-g.x0)*e);g.y=ri(g.y0+(ty-g.y0)*e-Math.sin(Math.PI*Math.min(1,k*1.6))*10*(1-k));
  if(k>=1){a.R.gemN++;RN.snd(1175,.06,'square',.04);RN.burst(tx+3,ty+2,'#8ff0ff',4,30);a.gems.splice(i,1)}}}

/* ---------- cleanup when the run part ends (boss) ---------- */
function cleanup(a){
 const R=a.R;
 if(a.mult!==1){R.v=R.v/a.mult;a.mult=1}
 a.boostT=-1;a.slowT=-1;a.charge=0;a.mode=null;a.blobs=[];a.beams=[];a.lasers=[];a.splats=[];a.shield=0;a.idx=a.plan.length;
 a.deb.forEach(d=>{if(d.hide)d.o.x=-99999});a.deb=[];
 a.gems.forEach(()=>{R.gemN++});a.gems=[];
 if(a.hint){a.hint='';a.hintHTML=''}}

/* ---------- drawing ---------- */
function line(g,x0,y0,x1,y1,th,col){
 g.fillStyle=col;const h=th>>1;
 if(y0===y1){g.fillRect(Math.min(x0,x1),y0-h,Math.abs(x1-x0)+1,th);return}
 const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));
 for(let i=0;i<=n;i++)g.fillRect(x0+ri((x1-x0)*i/n)-h,y0+ri((y1-y0)*i/n)-h,th,th)}
function shieldDraw(g,cx,cy,rx,ry,col){
 g.fillStyle=col;const hw=d=>d>ry?0:ri(rx*Math.sqrt(Math.max(0,1-(d/ry)*(d/ry))));
 for(let dy=-ry;dy<=ry;dy++){const a=hw(Math.abs(dy)),e=hw(Math.abs(dy)+1),run=Math.max(1,a-e);g.fillRect(cx-a,cy+dy,run,1);g.fillRect(cx+a-run+1,cy+dy,run,1)}}

HK.drawWorld.push((g,cam)=>{
 const a=act();if(!a)return;const R=a.R;
 if(R.phase==='boss'||R.phase==='free'){if(a.charge||a.mode||a.blobs.length||a.mult!==1||a.deb.length||a.gems.length)cleanup(a);return}
 // the mini Scrambler
 if(a.mode&&a.mode!=='ko'){
  const t=a.t,fr=Math.floor(t*5)%2,spr=(a.flash>0||(a.mode==='wind'&&a.mt>.2&&Math.floor(t*14)%2))?(fr?MINI_WB:MINI_W):(fr?MINI_B:MINI_A);
  let x=a.x,y=a.sy;
  if(a.mode==='in'){y=a.air?a.sy+ri(Math.sin(a.mt*14)*2):GROUND-MH-ri(Math.abs(Math.sin(a.mt*11))*8)}
  else if(a.mode==='flee'){y=GROUND-MH-ri(Math.abs(Math.sin(a.mt*12))*7);if(a.air)y=a.sy+ri(a.mt*18)}
  else{y=a.air?a.sy+ri(Math.sin(t*5)*2):GROUND-MH-(fr&&a.mode==='fly'?1:0)}
  if(a.mode==='wind'){x+=Math.floor(t*30)%2?1:-1}
  g.drawImage(spr,ri(x-MW/2),y);
  if(a.air&&a.mode!=='flee'){g.fillStyle='#0b1033';g.fillRect(ri(x-4),GROUND,8,1)}   // little ground shadow
  if(a.mode==='wind'&&a.mt>.15&&Math.floor(t*10)%2)RN.txt(g,'!',ri(x)-4,y-11,'#ff6b7a',1,'l')}
});

HK.drawTop.push((g,cam)=>{
 const a=act();if(!a)return;const R=a.R;
 if(R.phase==='boss'||R.phase==='free'){if(a.charge||a.mode||a.blobs.length||a.mult!==1||a.deb.length||a.gems.length)cleanup(a);return}
 const t=a.t;
 // debris
 a.deb.forEach(d=>{if(d.hide)return;g.fillStyle=d.c;const x=ri(d.x-cam),y=ri(d.y);g.fillRect(x,y,d.s,d.s)});
 // blobs with floating keycaps
 const inb=a.blobs.filter(z=>z.st==='in').sort((p,q)=>p.x-q.x);
 a.blobs.forEach(z=>{
  const sp=Math.floor(t*6+z.w)%2?BLOB_B:BLOB_A,x=ri(z.x),y=ri(z.y);g.drawImage(sp,x,y);
  if(z.st==='in'){const cur=z===inb[0];RN.cap(z.ch,x+3-6,y-17-(cur?Math.floor(t*6)%2:0),cur?1:0)}});
 // lasers (blob hits) and mega beam
 const y0=hy();
 a.lasers.forEach(l=>{line(g,RX+2,y0,l.tx,l.ty,2,l.c);line(g,RX+2,y0,l.tx,l.ty,1,'#ffffff')});
 a.beams.forEach(b=>{const k=b.l/b.max,th=k>.35?8:4,fl=Math.floor(t*30)%2,by=b.y;
  g.fillStyle=fl?'#f0c860':'#ffe9a0';g.fillRect(RX+2,by-(th>>1),C.W-RX-2,th);g.fillStyle='#ffffff';g.fillRect(RX+2,by-(th>>2),C.W-RX-2,th>>1);
  g.fillStyle='#ffffff';g.fillRect(RX-2,by-6,10,12);g.fillStyle='#f0c860';g.fillRect(RX,by-4,6,8)});
 // splats and shield
 a.splats.forEach(s=>{if(s.l>.2||Math.floor(t*20)%2)g.drawImage(SPLAT,s.x-3,s.y-3)});
 if(a.shield>0&&Math.floor(t*24)%4)shieldDraw(g,HX+4,GROUND-16-ri(-R.y),16,19,Math.floor(t*12)%2?'#8ff0ff':'#ffffff');
 // flying gems
 a.gems.forEach(q=>{if(q.d>0)return;g.drawImage(GEM,q.x-3,q.y-2)});
 // charge meter, under the progress bar
 const seg=a.hard?4:6,mw=a.cmax*seg+1,full=a.charge>=a.cmax,fl=Math.floor(t*8)%2;
 g.drawImage(BOLT,6,15);
 g.fillStyle='#0b1033';g.fillRect(13,14,mw+2,8);g.fillStyle='#1a2156';g.fillRect(14,15,mw,6);
 for(let i=0;i<a.cmax;i++)if(i<a.charge){g.fillStyle=full?(fl?'#ffffff':'#f0c860'):'#8ff0ff';g.fillRect(15+i*seg,16,seg-1,4)}
 if(full&&!flapActive(R)){
  const x=14+mw+8,y=13;g.fillStyle='#0b1033';g.fillRect(x-1,y-1,42,12);g.fillStyle=fl?'#f0c860':'#ffffff';g.fillRect(x,y,40,10);g.fillStyle='#c0a040';g.fillRect(x,y+9,40,1);
  RN.txt(g,'SPACE',x+1,y+1,'#0b1033',1,'l',null)}
});

RN.action={state:()=>act(),cmax:()=>act()&&act().cmax};
}catch(e){console.error('[runner-action]',e)}
})();
