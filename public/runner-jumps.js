/* Keyloria Run add-on: DOUBLE / TRIPLE / WORD JUMP ('tall' segment).
   A stone tower with keycaps stacked up its face. The 1st letter is a normal jump, every next letter (typed while still
   in the air) gives a mid-air boost. The last one lifts the hero onto the top, he walks across and hops down the far side.
   Too slow = the hero gently slides down the face (WHOA) and the letters reset. Never punishing. */
(function(){
if(!window.RUNNER)return;
try{
const RN=window.RUNNER,C=RN.C,W=C.W,GROUND=C.GROUND,RX=C.RX,BW=C.BW,GRAV=C.GRAV,HOP=C.HOP;
const HK=RN.HK,SEG=RN.SEG,ri=Math.round;
const rr=()=>RN.R;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const irnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const TW=28;                                   // tower width
const SHT={d2:20,t3:17,w3:18,w4:14,w5:11};     // storey height (px) by kind+size
const NAME={2:'DOUBLE!',3:'TRIPLE!'};
const ACTIVE={climb:1,mount:1,walk:1,slide:1};
const height=()=>-rr().y;

/* ---------- sprites ---------- */
const PAL={o:'#1e1a2a',H:'#c8c8d8',L:'#9a9ab0',M:'#74748e',D:'#55556e',G:'#4f7f48',g:'#365f3c',Y:'#f0c860'};
const SPR={};
function tower(h,kind){
 const k=h+'/'+kind;if(SPR[k])return SPR[k];
 const c=document.createElement('canvas');c.width=TW;c.height=h;const x=c.getContext('2d');
 const r=(col,a,b,w,hh)=>{x.fillStyle=col;x.fillRect(a,b,w,hh)};
 r(PAL.o,0,0,TW,h);
 const CH=9;let row=0;
 for(let y1=h;y1>4;y1-=CH,row++){
  const y0=Math.max(4,y1-CH),bh=y1-y0,off=(row%2)*7;
  for(let bx=-off;bx<TW-1;bx+=14){
   const a=Math.max(1,bx+1),b=Math.min(TW-1,bx+14),bw=b-a;if(bw<2)continue;
   r(PAL.M,a,y0+1,bw,bh-1);r(PAL.L,a,y0+1,bw,1);r(PAL.L,a,y0+1,1,bh-1);r(PAL.D,a,y0+bh-1,bw,1);r(PAL.D,b-1,y0+1,1,bh-1);
   const s=(bx*31+row*17)&7;if(s===0)r(PAL.H,a+3,y0+2,2,1);if(s===3)r(PAL.D,a+5,y0+4,2,1);}
 }
 // top slab
 r(PAL.o,0,0,TW,5);r(PAL.L,1,1,TW-2,3);r(PAL.H,1,1,TW-2,1);r(PAL.D,1,3,TW-2,1);
 if(kind==='t'||kind==='w'){                     // moss at the base and on the slab
  r(PAL.G,1,h-3,TW-2,2);r(PAL.g,2,h-2,6,1);r(PAL.g,16,h-2,8,1);r(PAL.G,5,h-5,3,2);r(PAL.G,19,h-4,4,1);r(PAL.g,9,h-6,1,3);r(PAL.G,3,1,5,1);r(PAL.G,20,1,4,1)}
 if(kind==='d'){r(PAL.o,12,h-15,1,3);r(PAL.o,13,h-12,1,2);r(PAL.o,11,h-17,1,2)}
 if(kind==='w'){r(PAL.Y,0,2,1,1);r(PAL.Y,TW-1,2,1,1)}
 return SPR[k]=c}
const PUFF=[];                                   // mid-air jump puffs (screen coords)

/* ---------- physics helpers ---------- */
const isHard=R=>!!(R.L&&R.L.hard);
const gc=R=>isHard(R)?GRAV*1.3:GRAV;
const ymin=(R,o)=>o.k*o.SH+(isHard(R)?3:-4);        // lowest height from which the next letter still works
const capK=(o,k)=>k>=o.n?o.h+10:k*o.SH+16;          // height the k-th letter (1-based) boosts the hero towards
const apex1=o=>Math.max(30,Math.min(40,o.SH+16));
const vt=R=>clamp(R.v*.9,50,120);                  // walking speed on top
function grabGems(R){R.gems.forEach(gm=>{if(!gm.got&&gm.x>R.front-BW-4&&gm.x<R.front+2&&(GROUND-gm.y)>=height()-6&&(GROUND-gm.y)<=height()+24){gm.got=1;R.gemN++;RN.snd(1175,.06,'square',.04);RN.burst(gm.x-R.cam,gm.y,'#8ff0ff',5,40)}})}
function puff(h){PUFF.push({y:GROUND-ri(h),t:0})}
function wallHit(R,o){   // the tower face is a solid wall: effects only, never moves the hero
 R.bonks++;R.streak=0;R.shake=3;R.stun=R.L.hard?.45:.25;if(!R.air)R.kb=R.L.hard?-70:0;R.speed=0;
 if(R.jt){R.jt.jt=false;R.jt=null}
 RN.popTxt('BONK!',o.x+o.w/2,GROUND-Math.min(o.h,40)-8,'#ff6b7a');RN.snd(120,.15,'square',.07);RN.burst(o.x-R.cam,GROUND-8,'#ffffff',6,40)}
const ZONE=36;                                  // climb zone: how close to the face the hero must be
const inZone=(R,o)=>o.x-R.front<=ZONE&&R.front<=o.x+2;

/* ---------- boost / start ---------- */
function boost(R,o,first){
 const h=height(),G=gc(R);
 const delta=first?clamp(apex1(o)-h,14,40):clamp(capK(o,o.k)-h,11,32);
 R.vy=-Math.sqrt(2*G*delta);R.air=true;R.jt=null;
 puff(h);
 const k=o.k;
 RN.snd(380+k*95,.08,'square',.05);RN.snd(680+k*140,.1,'square',.045,.05);
 RN.burst(RX-BW/2,GROUND-h,'#e8dcc0',first?4:7,first?25:34)}
function fail(R,o){
 o.k=0;o.last=0;
 RN.popTxt('WHOA',R.front-BW/2-14,GROUND-height()-40,'#b8c0e8');
 RN.snd(260,.14,'triangle',.06);RN.snd(190,.18,'triangle',.05,.08);
 if(R.y>=-1){R.y=0;R.vy=0;R.air=false;o.st='wait';R.speed=0}
 else{o.st='slide';R.vy=0}
 RN.updStrip()}
function land(R,o){
 R.y=-o.h;R.vy=0;o.st='walk';R.air=true;R.jt=null;R.nice++;
 const msg=o.word?'WORD JUMP!':NAME[o.n]||'JUMP!';
 RN.popTxt(msg,o.x+TW/2,Math.max(GROUND-o.h-26,24),'#f0c860');
 [784,988,1319,1568].slice(0,o.n>3?4:o.n+1).forEach((f,i)=>RN.snd(f,.09,'square',.05,i*.07));
 RN.burst(RX-BW/2,GROUND-o.h,'#f0c860',12,60);RN.burst(RX-BW/2,GROUND-o.h,'#ffffff',6,45);
 try{sfx.super()}catch(e){}
 RN.updStrip()}

/* ---------- segment ---------- */
SEG.tall={
 want:o=>(o.k<o.n&&(o.st==='wait'||o.st==='climb'||o.st==='slide'))?o.letters[o.k]:'',
 done:o=>o.k>=o.n||o.st==='done',
 strip:o=>o.letters,
 typed:o=>o.k,
 key(o,ch){const R=rr();
  const bad=()=>{R.hits--;R.typed--;R.streak--};   // typed at a bad moment: ignore silently (not a mistake, no movement)
  if(o.st==='wait'){
   if(R.air)return bad();
   if(!inZone(R,o)){RN.jump(o);RN.updStrip();return}      // too early: a plain jump that lands short (TOO SOON)
   o.k=1;o.st='climb';o.vx=Math.max(R.speed,40);o.t0=R.t;boost(R,o,true);RN.updStrip();return}
  if(o.st==='climb'){
   if(!R.air||!inZone(R,o))return bad();
   o.k++;
   if(o.k>=o.n){o.st='mount'}
   boost(R,o,false);RN.updStrip();return}
  bad()},
 update(o,dt){const R=rr();if(R.phase!=='run')return;
  if(o.st==='drop'&&!R.air){o.st='done';o.done=true;RN.updStrip()}},
 block:o=>(o.st==='wait'&&!rr().L.hard)?o.x-6:null,
 draw(o,g,cam,isT){
  const R=rr(),x=o.x-cam;if(x<-TW-4||x>W+4)return;
  const X=ri(x),top=GROUND-o.h;
  g.drawImage(tower(o.h,o.kind),X,top);
  if(o.word){                                        // little flag on a word tower
   const fl=Math.floor(R.t*4)%2;
   g.fillStyle='#1e1a2a';g.fillRect(X+TW-8,top-11,2,11);g.fillStyle='#efe6d8';g.fillRect(X+TW-8,top-10,1,10);
   g.fillStyle='#f0c860';g.fillRect(X+TW-6,top-10,5+fl,2);g.fillRect(X+TW-6,top-8,4-fl+1,2);g.fillStyle='#1e1a2a';g.fillRect(X+TW-6,top-6,5+fl,1)}
  // keycaps stacked up the face (zig-zag so they never overlap)
  for(let i=0;i<o.n;i++){
   const kx=X+(i%2?15:1),ky=GROUND-(i*o.SH+15);
   const st=i<o.k?2:(i===o.k&&isT&&(o.st==='wait'||o.st==='climb'||o.st==='slide')?1:0);
   RN.cap(o.letters[i],kx,ky-(st===1?Math.floor(R.t*6)%2:0),st)}}
};

/* ---------- the climb itself ---------- */
function tallHook(dt){
 const R=rr();if(R.phase!=='run')return false;
 const o=R.obs.find(q=>q.t==='tall'&&ACTIVE[q.st]);
 if(!o){
  // solid wall: the face of a tower that has not been climbed stops the hero without any snapping
  const w=R.obs.find(q=>q.t==='tall'&&q.st==='wait'&&q.x-R.front<40&&q.x+TW>R.front-BW);
  if(w){const lim=w.x-1,vx=R.air?(R.jumpV||0):(R.speed+R.kb);
   if(R.front<=lim&&R.front+Math.max(vx,0)*dt>=lim){
    if(vx>25&&R.stun<=0)wallHit(R,w);
    R.front=lim;R.cam=R.front-RX;R.speed=0;R.kb=Math.min(R.kb,0);if(R.air)R.jumpV=0}}
  return false}
 const G=gc(R),H=o.h,tx=o.x-4;
 R.kb=0;R.stun=0;R.air=true;R.jt=null;
 if(o.st==='walk'){
  R.speed=vt(R);R.front+=R.speed*dt;R.cam=R.front-RX;R.y=-H;R.vy=0;grabGems(R);
  if(R.front-BW/2>o.x+TW-1){                       // off the far edge: hop down, the engine lands us
   o.st='drop';R.vy=0;R.jumpV=Math.max(R.speed,HOP);R.air=true;R.jt=null;
   R.gems.forEach(gm=>{if(!gm.got&&gm.tw===o){gm.got=1;R.gemN++;RN.burst(gm.x-R.cam,gm.y,'#8ff0ff',5,40)}});
   RN.snd(300,.06,'square',.04);return false}
  return true}
 if(o.st==='slide'){
  R.speed=0;if(R.front<tx)R.front=Math.min(tx,R.front+Math.max(o.vx||40,40)*dt);R.cam=R.front-RX;
  R.y+=70*dt;R.vy=0;
  if(R.y>=0){R.y=0;R.air=false;o.st='wait';RN.snd(110,.05,'triangle',.07);RN.burst(RX-BW/2,GROUND,'#e8dcc0',4,25)}
  return true}
 // climb / mount: vertical physics are ours
 const vy0=R.vy;R.vy+=G*dt;R.y+=R.vy*dt;const h=height();
 // horizontal: glide to the face; once the feet are over the top edge, step onto the top
 const entering=o.st==='mount'&&h>=H-2;
 if(entering)R.front+=vt(R)*dt;
 else if(R.front<tx)R.front=Math.min(tx,R.front+Math.max(o.vx||40,40)*dt);
 R.speed=0;R.cam=R.front-RX;grabGems(R);
 if(o.st==='climb'){
  if(R.y>=0){R.y=0;R.vy=0;fail(R,o);return true}
  if(R.vy>0&&h<ymin(R,o)){fail(R,o);return true}
 }else{ // mount
  if(R.vy>0&&h<=H){
   R.cam=R.front-RX;land(R,o)}
  else if(R.y>=0){R.y=0;R.vy=0;fail(R,o)}
 }
 return true}
HK.update.push(dt=>tallHook(dt));
HK.key.push(e=>{   // tower letters typed when they are not the wanted one: ignore silently (no mistake)
 const R=rr();if(!R||R.phase!=='run')return false;
 const t=RN.target();if(!t||t.t!=='tall')return false;
 const ch=String(e.key).toLowerCase();if(!t.letters.includes(ch))return false;
 return ch!==SEG.tall.want(t)});

/* ---------- puffs (hard pixel clouds under the feet) ---------- */
HK.drawTop.push(g=>{
 const R=rr(),dt=1/60;
 for(let i=PUFF.length-1;i>=0;i--){const p=PUFF[i];p.t+=dt;if(p.t>.3){PUFF.splice(i,1);continue}
  const w=4+Math.floor(p.t*40),x=RX-Math.round(BW/2),a=p.t<.18?'#ffffff':'#dfe8f4';
  g.fillStyle='#7a8ec0';g.fillRect(x-(w>>1)-1,p.y+1,w+2,2);
  g.fillStyle=a;g.fillRect(x-(w>>1),p.y,w,2);g.fillRect(x-(w>>1)-3,p.y+1,3,1);g.fillRect(x+(w>>1),p.y+1,3,1)}
});

/* ---------- build: replace some rocks by towers ---------- */
const lc=s=>String(s==null?'':s).toLowerCase();
function charsOf(o){
 if(!o)return [];
 if(o.t==='rock')return [lc(o.key)];
 if(o.t==='gap')return [lc(o.word&&o.word[o.word.length-1])];
 if(o.t==='fork')return [lc(o.hi),lc(o.lo)];
 if(o.t==='flap')return (o.letters||[]).map(lc);
 if(o.t==='tall')return (o.letters||[]).map(lc);
 return []}
function pickLetters(R,n,prev,next){
 const keys=[...new Set([...R.L.keys].map(lc))];
 const out=[];
 for(let i=0;i<n;i++){
  const used=out.map(lc);
  let p=keys.filter(k=>!used.includes(k)&&!prev.includes(k)&&!next.includes(k));
  if(!p.length)p=keys.filter(k=>!used.includes(k)&&!prev.includes(k));
  if(!p.length)p=keys.filter(k=>!used.includes(k));
  if(!p.length)p=keys;
  if(i>0){const q=p.filter(k=>k!==lc(out[i-1]));if(q.length)p=q}
  out.push(RN.pick(p))}
 return out}
function pickWord(R,prev){
 let ws=RN.pool(R.L.keys,3,5).filter(w=>/^[a-z]+$/.test(w)&&![...w].some((c,i)=>i&&c===w[i-1]));
 if(!ws.length)return null;
 const big=ws.filter(w=>w.length>=4);if(big.length&&Math.random()<.8)ws=big;
 const a=ws.filter(w=>!prev.includes(w[0]));if(a.length)ws=a;
 return RN.pick(ws)}
function shift(R,cut,ex){
 if(ex<=0)return;
 R.obs.forEach(o=>{if(o.x>=cut){o.x+=ex;if(o.gaps)o.gaps.forEach(p=>p.x+=ex)}});
 R.gems.forEach(g=>{if(g.x>=cut)g.x+=ex});R.bossX+=ex;
 try{const a=RN.action&&RN.action.state();if(a&&a.plan)a.plan=a.plan.map(X=>X>=cut?X+ex:X)}catch(e){}}
function plan(R){
 const lv=RN.opt.lv||0,hard=isHard(R);let kinds=[];
 if(hard){kinds=['d','t','t','w','w'].sort(()=>Math.random()-.5).slice(0,irnd(4,5));if(!kinds.includes('w'))kinds[0]='w'}
 else if(lv===1||lv===2)kinds=Array(irnd(1,2)).fill('d');
 else if(lv===3)kinds=['d','t'];
 else if(lv===4)kinds=['d','t','w'];
 else if(lv>=5)kinds=['d','t'].concat(Array(irnd(1,2)).fill('w'));
 return kinds}
function build(R){
 const kinds=plan(R);if(!kinds.length)return;
 const hard=isHard(R),n0=R.obs.length;
 const isR=o=>o&&o.t==='rock';
 const tierOf=i=>{
  if(!isR(R.obs[i])||R.obs[i].x+260>=R.bossX)return 0;
  const nb=d=>R.obs[i+d],plain=d=>!nb(d)||isR(nb(d))||nb(d).t==='tall';
  if([-2,-1,1,2].every(plain))return 1;
  if(plain(-1)&&plain(1))return 2;
  if([-1,1].every(d=>!nb(d)||nb(d).t==='gap'||plain(d)))return 3;
  return 4};
 const tier={};for(let i=2;i<R.obs.length-1;i++){const t=tierOf(i);if(t)tier[i]=t}
 const idx=Object.keys(tier).map(Number);if(!idx.length)return;
 const picks=[];
 kinds.forEach((kd,j)=>{
  const target=2+(R.obs.length-4)*(j+.5)/kinds.length;
  let best=null,bs=1e9;idx.forEach(i=>{if(picks.some(p=>Math.abs(p.i-i)<2))return;const sc=Math.abs(i-target)+3*(tier[i]-1);if(sc<bs){bs=sc;best=i}});
  if(best!=null)picks.push({i:best,kd})});
 picks.sort((a,b)=>a.i-b.i);
 picks.forEach(({i,kd})=>{
  const rk=R.obs[i];if(!isR(rk))return;
  const prev=charsOf(R.obs[i-1]),next=charsOf(R.obs[i+1]);
  let letters,word=null,n,kind,SH;
  if(kd==='w'){word=pickWord(R,prev);if(!word)kd='t'}
  if(kd==='w'){letters=[...word];n=letters.length;kind='w';SH=SHT['w'+n]}
  else if(kd==='t'){n=3;kind='t';SH=SHT.t3;letters=pickLetters(R,3,prev,next)}
  else{n=2;kind='d';SH=SHT.d2;letters=pickLetters(R,2,prev,next)}
  const H=(n-1)*SH+17;
  const o={t:'tall',x:rk.x,w:TW,h:H,n,k:0,letters,word,kind,SH,st:'wait',vx:40};
  // clear the rock's gems, then add an arc of bonus gems over the top
  R.gems=R.gems.filter(g=>!(g.x>=rk.x-2&&g.x<=rk.x+TW+2&&g.y>=GROUND-42&&g.y<=GROUND-30));
  const cnt=n===2?4:5,bump=[0,3,4,3,0];
  for(let j=0;j<cnt;j++){const gm={x:o.x+3+Math.round(j*(TW-6)/(cnt-1)),y:GROUND-H-8-(cnt===4?[0,3,3,0][j]:bump[j]),got:0,tw:o};R.gems.push(gm)}
  // room for the hop down on the far side
  const nx=R.obs[i+1],nxX=nx?nx.x:R.bossX;
  const Vf=Math.max(R.v*1.25,HOP),fall=Math.sqrt(2*H/GRAV)*Vf;
  const need=o.x+TW+6+fall+(hard?36:50);
  shift(R,nxX-14,Math.max(0,Math.ceil(need-nxX)));
  R.obs[i]=o});
 R.obs.sort((a,b)=>a.x-b.x);
 RN.buildStrip&&0}
HK.build.push(R=>{try{build(R)}catch(e){console.error('[runner-jumps build]',e)}});
RN.jumps={SHT,tower};
}catch(e){console.error('[runner-jumps]',e)}
})();
