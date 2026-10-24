/* Keyloria Run add-on: two new segment types.
   FORK  ('fork'): two keycaps at once. HIGH = big jump up onto a gem ledge (riskier), LOW = normal hop over a rock.
   FLAP  ('flap'): the hero grabs a balloon; each correct letter = one flap; float through gaps in pipes, clouds and thorny vines.
   Everything is built through RUNNER.SEG and the build / update / drawWorld / drawTop hooks. */
(function(){
if(!window.RUNNER)return;
try{
const C=RUNNER.C,GROUND=C.GROUND,RX=C.RX,BW=C.BW,GRAV=C.GRAV,HOP=C.HOP,JV=C.JV;
const HK=RUNNER.HK,SEG=RUNNER.SEG;
const HI_SCALE=1.25,LH=40;                       // big-jump strength, ledge height above ground
const FG=70,GS=58,PW=14;                         // flap gravity, pipe gap size, pipe width
const rr=()=>RUNNER.R;
const height=()=>-rr().y;
const heroH=()=>{try{return RUNNER.HERO?RUNNER.HERO.height:28}catch(e){return 28}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const irnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const ROCK=RUNNER.PX(["....oooo....","..ooLLHLoo..",".oLLLHHLLMo.",".oLLLLLLMMo.","oLLLLLLMMMMo","oMLLLLMMMMDo","oMMLLMMMMDDo","oMMMMMMMDDDo",".oDMMMMDDDo.","..oooooooo.."],{o:'#1e1a2a',H:'#c8c8d8',L:'#9a9ab0',M:'#74748e',D:'#55556e'});
const ARROW=RUNNER.PX(["...Y...","..YYY..",".YYYYY.","YYYYYYY","..YYY..","..YYY.."],{Y:'#f0c860'});
const BALLOON=RUNNER.PX(["...oooo...","..orrrro..",".orHHrrro.",".orHrrrro.",".orrrrrro.",".orrrrDro.","..orrrDo..","..oorDoo..","...oooo...","....oo...."],{o:'#4a1020',r:'#ff6b7a',H:'#ffd0d8',D:'#c8404f'});
const pickKey=(keys,caps,not)=>{for(let i=0;i<40;i++){let k=keys[Math.floor(Math.random()*keys.length)];if(caps&&/[a-z]/.test(k)&&Math.random()<.15)k=k.toUpperCase();if(!not||not.every(n=>n.toLowerCase()!==k.toLowerCase()))return k}return keys[0]};

/* ---------- shared helpers ---------- */
function shiftFrom(R,cut,ex){if(ex<=0)return;R.obs.forEach(o=>{if(o.x>=cut)o.x+=ex});R.gems.forEach(g=>{if(g.x>=cut)g.x+=ex});R.bossX+=ex}
function bonkAt(R,o,x){ // same recipe as the engine's rock bonk
  R.bonks++;R.streak=0;R.shake=3;R.stun=R.L.hard?.45:.25;R.kb=R.L.hard?-70:0;R.speed=0;R.front=x;R.cam=R.front-RX;
  if(R.air){R.air=false;R.y=0;R.vy=0}if(R.jt){R.jt.jt=false;R.jt=null}
  RUNNER.popTxt('BONK!',o.x+o.w/2,GROUND-30,'#ff6b7a');RUNNER.snd(120,.15,'square',.07);RUNNER.burst(o.x-R.cam,GROUND-8,'#ffffff',6,40)}
function grabGems(R){R.gems.forEach(gm=>{if(!gm.got&&gm.x>R.front-BW-4&&gm.x<R.front+2&&(GROUND-gm.y)>=height()-6&&(GROUND-gm.y)<=height()+24){gm.got=1;R.gemN++;RUNNER.snd(1175,.06,'square',.04);RUNNER.burst(gm.x-R.cam,gm.y,'#8ff0ff',5,40)}})}

/* ================= FORK ================= */
SEG.fork={
  want:o=>o.st==='wait'?o.hi+o.lo:'',
  done:o=>o.st!=='wait',
  strip:o=>[o.hi,'/',o.lo],
  typed:o=>o.st!=='wait'?3:0,
  key(o,ch){const R=rr();
    if(R.air){R.hits--;R.typed--;R.streak--;return}          // typed ahead while in the air: ignore, like rocks
    if(o.st!=='wait')return;
    if(ch===o.hi){o.st='hi';o.ph=height();R.jumpScale=HI_SCALE;try{RUNNER.jump(o)}finally{R.jumpScale=1}}
    else{o.st='lo';R.jumpScale=1;RUNNER.jump(o)}
  },
  update(o,dt){const R=rr();if(R.phase!=='run')return;const back=R.front-BW;
    if((o.st==='wait'||o.st==='lo')&&R.front>o.x+1&&back<o.x+o.w-1&&height()<o.h-2){bonkAt(R,o,o.x-(R.L.hard?3:10));o.st='wait';o.jt=false;RUNNER.updStrip();return}
    if(o.st==='lo'){
      if(back>o.x+o.w){o.st='done';o.done=true;if(o.nice){R.nice++;RUNNER.popTxt('NICE!',o.x+o.w/2,GROUND-34,'#4de08a');RUNNER.snd(988,.05,'square',.04);RUNNER.snd(1319,.08,'square',.04,.05)}RUNNER.updStrip()}
      else if(o.jt===false){o.st='wait';RUNNER.updStrip()}                 // engine landed us early ("TOO SOON")
    }
    if(o.st==='drop'&&!R.air){o.st='done';o.done=true;RUNNER.updStrip()}
  },
  block:o=>(o.st==='wait'&&!rr().L.hard)?o.x-10:null,
  draw(){}                                                                  // drawn in drawWorld (the section is wider than the engine's cull)
};

function forkHook(R,dt){
  const o=R.obs.find(f=>f.t==='fork'&&(f.st==='hi'||f.st==='ledge'));if(!o)return false;
  const px0=o.x+o.p0,px1=px0+o.LW;
  if(o.st==='hi'){
    const prev=height();R.front+=R.jumpV*dt;R.cam=R.front-RX;R.vy+=GRAV*dt;R.y+=R.vy*dt;const h=height();grabGems(R);
    if(R.vy>0&&prev>=LH&&h<=LH&&R.front>px0+3&&R.front-BW<px1-2){          // landed on the ledge
      R.y=-LH;R.vy=0;o.st='ledge';R.jt=null;o.jt=false;R.nice++;
      RUNNER.popTxt('HIGH!',R.front-BW/2,GROUND-LH-34,'#f0c860');RUNNER.snd(784,.06,'square',.05);RUNNER.snd(1047,.1,'square',.05,.06);RUNNER.burst(RX-BW/2,GROUND-LH,'#f0c860',8,40)}
    else if(R.y>=0){                                                       // came down on the ground
      R.y=0;R.vy=0;R.air=false;R.jt=null;o.jt=false;RUNNER.snd(110,.05,'triangle',.08);
      if(R.front-BW>px1){o.st='done';o.done=true}                          // flew right over it: fine
      else{o.st='wait';RUNNER.popTxt('TOO SOON',o.x+o.w/2,GROUND-34,'#b8c0e8');if(R.front>o.x-22){R.front=o.x-22;R.cam=R.front-RX}R.speed=0;R.stun=.2}
      RUNNER.updStrip()}
    return true}
  // on the ledge: run along it, collect gems, step off the end
  const want=R.v*(1+Math.min(R.streak,10)*.025);R.speed+=(want-R.speed)*Math.min(1,dt*3);R.kb=0;
  R.front+=R.speed*dt;R.cam=R.front-RX;R.y=-LH;R.vy=0;R.air=true;grabGems(R);
  if(R.front-BW>px1-2){o.st='drop';R.air=true;R.vy=0;R.jumpV=Math.max(R.speed,HOP);R.jt=null}
  return true}

/* ================= FLAP ================= */
const nextPipe=(o,R)=>o.gaps.find(g=>R.front-BW<g.x+PW);
function flapStart(o,R){
  o.st='fly';R.air=true;R.jt=null;R.vy=-50;o.last=0;o.bv=0;o.slow=0;o.assist=0;o.cool=0;o.bumps=0;
  RUNNER.popTxt('FLY!',R.front-BW/2,GROUND-60,'#ff6b7a');RUNNER.snd(660,.08,'square',.05);RUNNER.snd(880,.1,'square',.05,.07);RUNNER.burst(RX-BW/2,GROUND-height()-heroH()-6,'#ff6b7a',10,45)}
SEG.flap={
  want:o=>(o.k<o.n&&(o.st==='pre'||o.st==='fly'))?o.letters[o.k]:'',
  done:o=>o.k>=o.n||o.st==='done',
  strip:o=>o.letters,
  typed:o=>o.k,
  key(o,ch){const R=rr();
    if(o.st==='pre')flapStart(o,R);
    if(o.st!=='fly'||o.k>=o.n)return;
    const gp=nextPipe(o,R);let vy=62;
    if(gp){const t=.42,tf=gp.c-heroH()/2;vy=clamp((tf-height()+.5*FG*t*t)/t,36,118)}
    R.vy=-vy;o.k++;o.last=R.t;
    RUNNER.snd(520+o.k*45,.07,'square',.05);RUNNER.snd(780+o.k*45,.06,'triangle',.04,.04);
    RUNNER.burst(RX-BW/2,GROUND-height()+1,'#ffffff',4,28);
    if(o.k>=o.n)RUNNER.popTxt('GREAT!',R.front-BW/2,GROUND-height()-heroH()-34,'#4de08a');
  },
  update(o,dt){const R=rr();if(R.phase!=='run')return;
    if(o.st==='pre'&&R.front>=o.x)flapStart(o,R);
    if(o.st==='fall'&&!R.air){o.st='done';o.done=true;RUNNER.updStrip()}
  },
  draw(){}
};

function flapHook(R,dt){
  const o=R.obs.find(f=>f.t==='flap'&&(f.st==='fly'||f.st==='pop'));if(!o)return false;
  const hh=heroH();o.slow=Math.max(0,o.slow-dt);o.cool=Math.max(0,o.cool-dt);
  // vertical: gentle gravity, soft pull towards the next gap, floor and ceiling
  R.vy+=FG*dt;
  const gp=nextPipe(o,R);
  if(o.st==='fly'&&gp&&gp.x-R.front<90){const tf=gp.c-hh/2;R.vy-=clamp((tf-height())*(2.5+o.assist),-45-o.assist*20,45+o.assist*20)*dt}
  R.vy=Math.min(R.vy,60);R.y+=R.vy*dt;
  if(R.y>0){R.y=0;R.vy=0}if(-R.y>62){R.y=-62;R.vy=Math.max(R.vy,0)}
  // horizontal: steady drift, wait at the line in front of the next gap until its letter is typed
  let want=o.vxb*(o.slow>0?.5:1);
  if(o.st==='fly'&&o.k<o.n){const d=o.gaps[o.k].x-5-R.front;want*=clamp(d/28,0,1)}
  R.speed+=(want-R.speed)*Math.min(1,dt*5);
  R.front+=(R.speed+o.bv)*dt;o.bv*=Math.pow(.88,dt*60);if(Math.abs(o.bv)<1)o.bv=0;R.cam=R.front-RX;R.kb=0;R.air=true;
  // soft bump on pipes / vines
  if(o.st==='fly'&&!o.cool){const h=height();
    for(const p of o.gaps){if(R.front-2>p.x&&R.front-BW+2<p.x+PW){
      const gb=p.c-GS/2,gt=p.c+GS/2;
      if(h+3<gb||h+hh-3>gt){o.bumps++;o.assist=Math.min(4,o.assist+1.5);o.cool=.45;o.slow=.9;o.bv=-90;R.front=Math.min(R.front,p.x-1);R.cam=R.front-RX;R.vy=h+3<gb?-50:40;R.shake=1;R.streak=R.streak;
        RUNNER.popTxt('OOF!',p.x+PW/2,GROUND-clamp(h+hh+10,30,76),'#b8c0e8');RUNNER.snd(150,.12,'square',.06);RUNNER.burst(p.x-R.cam,GROUND-h-hh/2,'#ffffff',6,35);break}}}}
  // all letters done and past the last gap: pop the balloon, drift, then let the engine land us
  if(o.st==='fly'&&o.k>=o.n){const lp=o.gaps[o.gaps.length-1];if(R.front-BW>lp.x+PW+14){o.st='pop';o.pt=.3;
    RUNNER.popTxt('POP!',R.front-BW/2,GROUND-height()-heroH()-26,'#ffd0d8');RUNNER.snd(220,.12,'sawtooth',.06);RUNNER.snd(1319,.05,'square',.04,.03);
    RUNNER.burst(RX-BW/2,GROUND-height()-heroH()-14,'#ff6b7a',14,70);RUNNER.burst(RX-BW/2,GROUND-height()-heroH()-14,'#ffffff',6,50)}}
  else if(o.st==='pop'){o.pt-=dt;if(o.pt<=0){o.st='fall';R.air=true;R.jumpV=Math.max(R.speed,HOP);R.jt=null;return false}}
  return true}

/* ---------- build: place forks and one flap section ---------- */
function build(R){
  const opt=RUNNER.opt,hard=!!R.L.hard;
  const keys=[...R.L.keys],caps=!!R.L.caps;
  // flap section: once per run, level index >= 2 and super hard
  if((hard||opt.lv>=2)&&R.obs.length>=4){
    const m=clamp(Math.round(R.obs.length*.5),2,R.obs.length-1),prev=R.obs[m-1],nx=R.obs[m];
    const n=irnd(6,10),vxb=Math.max(44,R.v*.62),pitch=Math.min(72,Math.max(54,Math.round(vxb*1.2)));
    const fx=Math.round(prev.x+(prev.w||10)+100),len=70+(n-1)*pitch+PW+110;
    const letters=[];for(let i=0;i<n;i++)letters.push(pickKey(keys,caps,letters.length?[letters[i-1]]:null));
    const gaps=[];let c=irnd(36,48);for(let i=0;i<n;i++){c=clamp(c+irnd(-12,12),34,52);gaps.push({x:fx+70+i*pitch,c,kind:i%3})}
    const o={t:'flap',x:fx,w:len,n,k:0,letters,gaps,vxb,st:'pre',bumps:0};
    const ex=Math.max(0,fx+len+80-nx.x);shiftFrom(R,nx.x-14,ex);
    R.obs.splice(m,0,o);
  }
  // forks: about every 5-6 obstacles, replacing a rock
  const idxs=[];for(let i=irnd(4,5);i<R.obs.length-1;i+=irnd(5,6))idxs.push(i);
  idxs.forEach(i0=>{
    let i=i0;while(i<R.obs.length&&R.obs[i].t!=='rock')i++;
    if(i>=R.obs.length)return;
    const rk=R.obs[i];
    const hi=pickKey(keys,caps),lo=pickKey(keys,caps,[hi]);
    const Vref=Math.max(R.v*1.1,HOP),Vmax=Math.max(R.v*1.25,HOP);
    const d0=clamp(Math.round(Vref*.16),14,34),vy0=-JV*HI_SCALE,tl=(vy0+Math.sqrt(vy0*vy0-2*GRAV*LH))/GRAV;
    const p0=Math.round(-d0+tl*Vref-34),LW=Math.round(.9*Vref)+40,fall=Math.sqrt(2*LH/GRAV)*Vmax;
    const o={t:'fork',x:rk.x,w:rk.w||10,h:rk.h||9,hi,lo,st:'wait',d0,p0,LW};
    const need=o.x+p0+LW+BW+fall+70,nx=R.obs[i+1];
    const nxX=nx?nx.x:R.bossX;
    shiftFrom(R,nxX-14,Math.max(0,Math.ceil(need-nxX)));
    R.obs[i]=o;
    const n=Math.floor((LW-24)/12);for(let j=0;j<n;j++)R.gems.push({x:o.x+p0+12+j*12,y:GROUND-LH-8,got:0});
  });
  R.obs.sort((a,b)=>a.x-b.x);
}
HK.build.push(build);
HK.update.push(function(dt){const R=rr();return forkHook(R,dt)||flapHook(R,dt)});

/* ---------- drawing ---------- */
function drawPipe(g,kind,x,y0,y1,gapAtBottom){
  const hgt=y1-y0;if(hgt<=0)return;
  if(kind===0){                                                    // stone pillar (Keyloria ruins)
    g.fillStyle='#1e1a2a';g.fillRect(x-1,y0,PW+2,hgt);g.fillStyle='#74748e';g.fillRect(x,y0,PW,hgt);g.fillStyle='#9a9ab0';g.fillRect(x+2,y0,3,hgt);g.fillStyle='#55556e';g.fillRect(x+10,y0,4,hgt);
    g.fillStyle='#1e1a2a';for(let yy=y0+7;yy<y1-1;yy+=8)g.fillRect(x,yy,PW,1);g.fillStyle='#4f7f48';for(let yy=y0+3;yy<y1-1;yy+=16)g.fillRect(x+6+((yy>>4)&1)*3,yy,2,3);
    const ry=gapAtBottom?y1-5:y0;g.fillStyle='#1e1a2a';g.fillRect(x-3,ry,PW+6,5);g.fillStyle='#c8c8d8';g.fillRect(x-2,ry+1,PW+4,3);g.fillStyle='#9a9ab0';g.fillRect(x-2,ry+3,PW+4,1);g.fillStyle='#f0c860';g.fillRect(x+PW/2-1,ry+1,2,2)
  }else if(kind===1){                                               // cloud column
    const bands=Math.ceil(hgt/6);
    for(let b=0;b<bands;b++){const yy=y0+b*6,hh=Math.min(6,y1-yy),o=(b&1)?-1:1;g.fillStyle='#7a8ec0';g.fillRect(x+o-1,yy,PW+4,hh)}
    for(let b=0;b<bands;b++){const yy=y0+b*6,hh=Math.min(6,y1-yy),o=(b&1)?-1:1;g.fillStyle='#f4f8ff';g.fillRect(x+o,yy,PW+2,hh);g.fillStyle='#dfe8f4';g.fillRect(x+o+PW-3,yy,5,hh);g.fillStyle='#ffffff';g.fillRect(x+o+1,yy+1,3,2)}
  }else{                                                            // thorny vine
    g.fillStyle='#1e2a1a';g.fillRect(x+4,y0,6,hgt);g.fillStyle='#365f3c';g.fillRect(x+5,y0,4,hgt);g.fillStyle='#4f7f48';g.fillRect(x+6,y0,1,hgt);
    for(let yy=y0+2;yy<y1-2;yy+=8){const L=((yy-y0)>>3)&1;g.fillStyle='#e8e0f0';if(L){g.fillRect(x,yy,5,1);g.fillRect(x+1,yy+1,3,1);g.fillRect(x+2,yy-1,1,1)}else{g.fillRect(x+9,yy,5,1);g.fillRect(x+10,yy+1,3,1);g.fillRect(x+11,yy-1,1,1)}}
    const ty=gapAtBottom?y1-5:y0;g.fillStyle='#1e2a1a';g.fillRect(x+1,ty,12,5);g.fillStyle='#4f7f48';g.fillRect(x+2,ty+1,10,3);g.fillStyle='#e8e0f0';g.fillRect(x+3,ty+1,1,1);g.fillRect(x+6,ty+2,1,1);g.fillRect(x+9,ty+1,1,1)
  }
}
function drawFork(g,o,cam,R,isT){
  const x=o.x-cam,x0=o.x+o.p0-cam,top=GROUND-LH,bob=isT?(Math.floor(R.t*6)%2):0;
  // the ledge (a floating one-way platform) with its gems drawn by the engine
  g.fillStyle='#2a1a12';g.fillRect(x0-1,top-1,o.LW+2,10);g.fillStyle='#b48c5c';g.fillRect(x0,top+2,o.LW,6);
  g.fillStyle='#8a6a44';for(let i=4;i<o.LW-4;i+=9){g.fillRect(x0+i,top+4+(i%4),2,1);g.fillRect(x0+i+4,top+6,1,1)}
  g.fillStyle='#62955a';g.fillRect(x0,top,o.LW,3);g.fillStyle='#a4c886';g.fillRect(x0,top,o.LW,1);g.fillStyle='#365f3c';for(let i=2;i<o.LW-2;i+=7)g.fillRect(x0+i,top+2,2,1);
  g.fillStyle='#2a1a12';for(let i=2;i<o.LW-4;i+=10){g.fillRect(x0+i,top+9,5,1);g.fillRect(x0+i+1,top+10,3,1)}
  // the rock for the low road
  g.drawImage(ROCK,Math.round(x-1),GROUND-ROCK.height+1);
  if(o.st==='wait'){
    const cx=Math.round(x+o.w/2),st=isT?1:0;
    RUNNER.cap(o.lo,cx-2,GROUND-o.h-18-bob,st);
    RUNNER.cap(o.hi,cx-2,GROUND-o.h-42-bob,st);
    g.drawImage(ARROW,cx+1,GROUND-o.h-52-(Math.floor(R.t*4)%2));
  }
}
function drawFlap(g,o,cam,R,isT){
  if(o.x+o.w<cam-10||o.x>cam+C.W+10)return;
  const bob=Math.floor(R.t*6)%2;
  o.gaps.forEach((p,i)=>{const x=Math.round(p.x-cam);if(x<-24||x>C.W+10)return;
    const gb=p.c-GS/2,gt=p.c+GS/2,yTop=GROUND-Math.round(gt),yBot=GROUND-Math.round(gb);
    drawPipe(g,p.kind,x,0,yTop,true);drawPipe(g,p.kind,x,yBot,GROUND,false);
    if(i>=o.k&&o.st!=='done'&&o.st!=='fall'&&o.st!=='pop')RUNNER.cap(o.letters[i],x+2,GROUND-Math.round(p.c)-6-(i===o.k?bob:0),i===o.k&&isT?1:0)});
}
HK.drawWorld.push(function(g,cam){const R=rr(),t=RUNNER.target();
  R.obs.forEach(o=>{
    if(o.t==='fork'){if(o.x+o.p0+o.LW<cam-6||o.x>cam+C.W+10)return;drawFork(g,o,cam,R,o===t)}
    else if(o.t==='flap')drawFlap(g,o,cam,R,o===t)});
  // let the hero run (not glide) while walking on a ledge
  const f=R.obs.find(o=>o.t==='fork'&&o.st==='ledge');if(f&&R.air){R._pathAir=true;R.air=false}});
HK.drawTop.push(function(g,cam){const R=rr();
  if(R._pathAir){R.air=true;R._pathAir=false}
  const o=R.obs.find(f=>f.t==='flap'&&f.st==='fly');if(!o)return;
  const hh=heroH(),hx=RX-Math.round(BW/2),top=GROUND-hh-Math.round(height()),sw=Math.round(Math.sin(R.t*3));
  g.fillStyle='#e8ecff';g.fillRect(hx+sw,top-14,1,10);g.fillRect(hx,top-5,1,6);
  g.drawImage(BALLOON,hx-5+sw,top-26+(Math.floor(R.t*4)%2));
});
}catch(e){console.error('[runner-paths]',e)}
})();
