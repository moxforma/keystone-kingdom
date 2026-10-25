/* Keyloria Run: interactive boss fight. Deflect ink blobs, hit weak spots, charge the mega laser (Space). */
(function(){
if(!window.RUNNER)return;
const RN=window.RUNNER,C=RN.C,W=C.W,H=C.H,GROUND=C.GROUND,RX=C.RX,HX=RX-C.BW/2;
const HITX=RX+6;              // a blob that gets this far splats on the shield
const NBARS=8;
let B=null;
const act=()=>(B&&RN.R&&B.R===RN.R)?B:null;
const ri=Math.round;
const sfxTry=(n,a)=>{try{sfx[n](a)}catch(e){}};

/* ---------- sprites ---------- */
const BLOB_A=RN.PX(["..ooo..",".oiiio.","oiwiwio","oiiiiio","oiiiiio",".oiiio.","..ooo.."],{o:'#150b26',i:'#6a3fb8',w:'#ffffff'});
const BLOB_B=RN.PX([".......",".ooooo.","oiwiwio","oiiiiio","oiiiiio","oiiiiio",".ooooo."],{o:'#150b26',i:'#6a3fb8',w:'#ffffff'});
const SPLAT=RN.PX(["..o...o....",".oio.oio.o.","oiiioiiioio",".oiiiiiiio.","oiiioiiiiio",".oio.oioio.","..o...o.o.."],{o:'#150b26',i:'#6a3fb8'});
const BOLT=RN.PX(["..yyy",".yyy.","yyyyy","..yy.",".yy..","yy..."],{y:'#f0c860'});
const ANGER=RN.PX(["rr.rr","r...r",".....","r...r","rr.rr"],{r:'#ff4a4a'});

/* ---------- helpers ---------- */
const uniq=()=>[...new Set([...RN.R.L.keys])];
function chooseCh(avoid,prev){
 const L=RN.R.L,keys=uniq(),av=avoid.map(c=>c.toLowerCase());
 let pool=keys.filter(k=>!av.includes(k.toLowerCase()));if(!pool.length)pool=keys;
 const p2=pool.filter(k=>k!==prev&&k!==(prev||'').toLowerCase());if(p2.length)pool=p2;
 let k=RN.pick(pool);if(L.caps&&/[a-z]/.test(k)&&Math.random()<L.caps)k=k.toUpperCase();return k}
const onScreenChars=b=>b.blobs.filter(z=>z.st==='in').map(z=>z.ch).concat(b.spots.map(s=>s.ch));
const wx=sx=>ri(RN.R.cam)+sx;
const setMode=(b,m)=>{b.mode=m;b.mt=0};
const shake=n=>{RN.R.shake=Math.max(RN.R.shake,n)};
const flush=()=>{try{RN.buildStrip();RN.updStrip()}catch(e){}};

function cageGeom(){const R=RN.R,K=R.KEY,kw=K?K.width:24,kh=K?K.height:24;return{K,kw,kh,cw:kw+6,ch:kh+5,cx:ri(R.bossX-ri(R.cam)+20)}}
function vgeom(b){
 const R=RN.R,V=R.VIL,vw=V?V.width:32,vh=V?V.height:32,bx=R.bossX-ri(R.cam),t=b?b.t:R.t;
 let dx=0,dy=0,img=V;
 if(b){
  if(b.mode==='intro')dy=b.mt<.8?-ri(Math.abs(Math.sin(b.mt*9))*5):0;
  else dy=(Math.floor(t*(b.p2?5:3))%2)?-1:0;
  if(b.mode!=='intro')dx+=ri(Math.sin(t*(b.p2?3.4:1.5))*(b.p2?3:1));
  if(b.mode==='wind'&&!b.angryT){const p=Math.min(1,b.mt/b.windDur),amp=1+Math.floor(p*2);dx+=(Math.floor(t*28)%2?amp:-amp);dy-=Math.floor(p*3);if(p>.35&&Math.floor(t*16)%2)img=R.VILF}
  if(b.p2&&(t%1.1)<.1)img=b.ANG||img;
  if(b.angryT>0)img=(Math.floor(t*12)%2)?(b.ANG||img):V;
  if(b.laugh>0)dy-=ri(Math.abs(Math.sin(b.laugh*14))*3);
  if(b.mode==='dying'){dx+=ri(RN.rnd(-2,2));img=(Math.floor(t*20)%2)?R.VILF:V}
  if(b.hitT>0){dx+=2;img=R.VILF}
 }
 return{sx:bx+4+dx,dy,img,vw,vh,hasV:!!V,cy:GROUND-vh/2,bx}}

/* ---------- fight logic ---------- */
function start(R){
 const L=R.L,hard=!!L.hard,lv=RN.opt.lv||0;
 let ANG=null;try{if(R.VIL)ANG=RN.flash(R.VIL,'#ff4a4a')}catch(e){}
 const max=hard?24:12+Math.floor(lv/2);
 B={R,hard,hp:max,max,p2:false,mode:'intro',mt:0,t:0,bx0:R.bossX,blobs:[],spots:[],lasers:[],splats:[],bars:Array(NBARS).fill(true),
  charge:0,cmax:hard?12:10,hitT:0,laugh:0,angryT:0,shield:0,crack:0,keyHop:0,throwsLeft:0,windDur:.8,prevCh:'',dirty:true,ANG,dieT:0,done:false};
 R.streak=0;
}
const volleyCount=b=>b.p2?2:(b.hard?4:3);
function brokenCount(b){return b.bars.filter(x=>!x).length}
function breakBar(b){
 const idx=b.bars.map((v,i)=>v?i:-1).filter(i=>i>=0);if(!idx.length)return;
 const i=RN.pick(idx);b.bars[i]=false;const cg=cageGeom(),x=cg.cx+ri(i*(cg.cw-1)/(NBARS-1));
 RN.burst(x,GROUND-cg.ch/2,'#c8c8d8',6,45);RN.snd(300+brokenCount(b)*40,.08,'square',.05);b.keyHop=.35}
function syncBars(b){const want=b.hp<=0?NBARS:Math.floor((1-b.hp/b.max)*NBARS+1e-6);while(brokenCount(b)<want)breakBar(b)}
function dmg(n){
 const b=act();if(!b||b.hp<=0)return;const R=RN.R;
 b.hp=Math.max(0,b.hp-n);b.hitT=.16;syncBars(b);
 if(b.hp<=0)die(b);
 else if(!b.p2&&b.hp<=b.max/2){b.p2=true;b.angryT=1;const v=vgeom(b);RN.popTxt('GRR!',wx(v.sx),GROUND-v.vh-10,'#ff6b7a');RN.snd(150,.4,'sawtooth',.07);shake(3);RN.burst(v.sx,v.cy,'#ff4a4a',14,70)}
}
function die(b){
 if(b.mode==='dying'||b.mode==='done')return;
 b.blobs.forEach(z=>RN.burst(ri(z.x)+3,ri(z.y)+3,'#6a3fb8',6,40));b.blobs=[];b.spots=[];b.mode='dying';b.mt=0;b.dieT=0;b.dirty=true;
 sfxTry('super');
}
function doThrow(b){
 const v=vgeom(b),R=RN.R,n=b.p2?2:1,avoid=onScreenChars(b);
 const f=Math.pow(Math.max(20,R.v)/72,.8);let T=Math.max(2.2,Math.min(6.5,4/f));if(b.p2)T=Math.max(1.8,T*.85);
 const sx0=v.sx-v.vw/2+2,vel=(sx0-HITX)/T;
 for(let i=0;i<n;i++){
  const ch=chooseCh(avoid,b.prevCh);avoid.push(ch);b.prevCh=ch;
  const z={x:sx0+i*16,sx0:sx0+i*16,v:vel,ch,st:'in',arc:n===2?i===1:Math.random()<.4,y:GROUND-8,w:RN.rnd(0,3)};
  b.blobs.push(z)}
 RN.snd(220,.12,'square',.06);RN.snd(330,.1,'square',.05,.06);setMode(b,'fly');b.dirty=true}
function spawnSpots(b){
 const v=vgeom(b),n=b.hard?3:(Math.random()<.5?2:3),slots=[[-30,-34],[0,-54],[30,-34]]
 const sl=(n<3?[slots[0],slots[2]]:slots).slice(0,Math.min(n,uniq().length)),avoid=[],dur=b.hard?4.5:(b.p2?5.2:6);
 b.spots=sl.map(s=>{const ch=chooseCh(avoid,b.prevCh);avoid.push(ch);return{ch,ox:s[0],oy:s[1],l:dur,dur}});
 RN.snd(660,.08,'triangle',.05);RN.snd(880,.1,'triangle',.05,.08);setMode(b,'weak');b.dirty=true}
function spotPos(b,s){const v=vgeom(b);return{x:ri(v.sx+s.ox),y:Math.max(32,Math.min(GROUND-10,ri(GROUND+s.oy)))}}
function nextVolley(b){b.throwsLeft=volleyCount(b);b.windDur=b.p2?.6:.9;setMode(b,'wind')}
function countHit(ch){
 const R=RN.R,b=act();R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);sfxTry('ok',R.streak);
 if(b.charge<b.cmax){b.charge++;if(b.charge>=b.cmax){RN.snd(880,.1,'square',.05);RN.snd(1175,.15,'square',.05,.1)}}}
function laser(b,tx,ty,col,big){b.lasers.push({tx,ty,c:col,l:big?.55:.12,max:big?.55:.12,big:!!big})}
function hitBlob(z){
 const b=act(),R=RN.R;const col=RN.fc(z.ch);laser(b,ri(z.x)+3,ri(z.y)+3,col);countHit(z.ch);
 const v=vgeom(b);z.st='back';z.x0=z.x;z.y0=z.y;z.bt=0;z.tx=v.sx;z.ty=v.cy;z.col=col;RN.burst(ri(z.x)+3,ri(z.y)+3,col,6,50);RN.snd(700,.08,'square',.05)}
function hitSpot(s){
 const b=act(),p=spotPos(b,s),col=RN.fc(s.ch);laser(b,p.x,p.y,col);countHit(s.ch);
 b.spots=b.spots.filter(q=>q!==s);RN.burst(p.x,p.y,col,10,60);RN.burst(p.x,p.y,'#ffffff',5,40);
 if(b.bars.filter(x=>x).length>2)breakBar(b);b.crack=.25;
 RN.popTxt('CRACK!',wx(cageGeom().cx+14),GROUND-cageGeom().ch-6,'#f0c860');shake(1);dmg(1);
 if(act()&&act().mode==='weak'&&!b.spots.length)setMode(b,'rest')}
function mega(){
 const b=act(),R=RN.R;b.charge=0;const v=vgeom(b);
 laser(b,v.sx,v.cy,'#f0c860',true);
 b.blobs.forEach(z=>{RN.burst(ri(z.x)+3,ri(z.y)+3,'#c9a8f0',8,60)});b.blobs=b.blobs.filter(z=>false);
 R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);
 RN.burst(v.sx,v.cy,'#ffffff',34,120);RN.burst(v.sx,v.cy,'#f0c860',26,90);RN.burst(RX+4,GROUND-16,'#8ff0ff',12,60);
 shake(6);RN.popTxt('MEGA!',wx(v.sx),GROUND-v.vh-10,'#f0c860');
 RN.snd(180,.5,'sawtooth',.08);RN.snd(360,.4,'square',.06,.05);RN.snd(720,.3,'square',.05,.12);
 dmg(b.hard?4:3);b.dirty=true}
function splat(b,z){
 const R=RN.R;R.streak=0;b.shield=.45;b.splats.push({x:HITX,y:ri(z.y)+3,l:.65});
 RN.popTxt('SPLAT',wx(HITX+22),ri(z.y)-30,'#c9a8f0');RN.burst(HITX+2,ri(z.y)+3,'#6a3fb8',8,45);RN.snd(130,.15,'triangle',.07);RN.snd(220,.08,'sine',.05,.05)}

function update(dt){
 const b=act();if(!b)return;const R=RN.R;
 if(b.mode==='done')return;
 b.t+=dt;b.mt+=dt;
 ['hitT','laugh','angryT','shield','crack','keyHop'].forEach(k=>{b[k]=Math.max(0,b[k]-dt)});
 b.lasers.forEach(l=>l.l-=dt);b.lasers=b.lasers.filter(l=>l.l>0);
 b.splats.forEach(s=>s.l-=dt);b.splats=b.splats.filter(s=>s.l>0);
 if(b.mode==='intro'){
  const k=Math.min(1,b.mt/.8);R.bossX=ri(b.bx0+36*(k*(2-k)));
  if(b.mt>=1.3){R.bossX=b.bx0+36;nextVolley(b);b.dirty=true}
 }else if(b.mode==='wind'){
  if(b.angryT>0)b.mt=Math.min(b.mt,0);
  else if(b.mt>=b.windDur)doThrow(b);
 }else if(b.mode==='fly'){
  if(!b.blobs.length){b.throwsLeft--;if(b.throwsLeft>0){b.windDur=b.p2?.4:.5;setMode(b,'wind')}else spawnSpots(b)}
 }else if(b.mode==='weak'){
  const before=b.spots.length;
  b.spots.forEach(s=>s.l-=dt);
  b.spots=b.spots.filter(s=>{if(s.l>0)return true;const p=spotPos(b,s);RN.burst(p.x,p.y,'#b8c0e8',6,30);return false});
  if(b.spots.length!==before)b.dirty=true;
  if(!b.spots.length)setMode(b,'rest');
 }else if(b.mode==='rest'){
  if(b.mt>=.8){nextVolley(b);b.dirty=true}
 }else if(b.mode==='dying'){
  b.dieT+=dt;
  if(b.dieT>.12){b.dieT=0;const v=vgeom(b);RN.burst(v.sx+RN.rnd(-v.vw/2,v.vw/2),v.cy+RN.rnd(-v.vh/2,v.vh/2),RN.pick(['#ffffff','#f0c860','#b48ae0']),12,80);RN.snd(RN.rnd(200,500),.06,'square',.04);shake(3)}
  if(b.mt>=1.1){
   const v=vgeom(b);b.bars.fill(false);b.done=true;b.mode='done';
   RN.burst(v.sx,v.cy,'#ffffff',44,130);RN.burst(v.sx,v.cy,'#b48ae0',30,100);RN.burst(v.sx,v.cy,'#f0c860',24,80);shake(6);
   RN.win();return}
 }
 // blobs
 b.blobs=b.blobs.filter(z=>{
  if(z.st==='in'){
   z.x-=z.v*dt;const pr=Math.max(0,Math.min(1,(z.sx0-z.x)/(z.sx0-HITX)));
   z.y=z.arc?(GROUND-8)-ri(Math.sin(Math.PI*pr)*16):GROUND-8;
   if(z.x<=HITX){splat(b,z);b.dirty=true;return false}
   return true}
  z.bt+=dt;const k=Math.min(1,z.bt/.22);z.x=z.x0+(z.tx-3-z.x0)*k;z.y=z.y0+(z.ty-3-z.y0)*k;
  if(k>=1){RN.burst(z.tx,z.ty,z.col,12,80);RN.burst(z.tx,z.ty,'#ffffff',5,50);shake(2);RN.snd(260,.08,'square',.06);dmg(1);return false}
  return true});
 if(b.dirty){b.dirty=false;flush()}
}

function key(e){
 const b=act();if(!b)return;
 if(b.mode==='dying'||b.mode==='done'||b.mode==='intro')return;
 if(e.key===' '){if(b.charge>=b.cmax){mega();flush()}return}
 const caps=e.getModifierState&&e.getModifierState('CapsLock')&&!e.shiftKey,kk=caps?e.key.toLowerCase():e.key;
 const m=z=>z.ch===e.key||z.ch===kk;
 const z=b.blobs.filter(q=>q.st==='in').sort((p,q)=>p.x-q.x).find(m);
 if(z){hitBlob(z);flush();return}
 const s=b.spots.find(m);
 if(s){hitSpot(s);flush();return}
 if(b.blobs.some(q=>q.st==='in')||b.spots.length){RN.miss();b.laugh=.4;flush()}
}

/* ---------- strip ---------- */
function items(){
 const b=act();if(!b)return[];const o=[];
 b.blobs.filter(z=>z.st==='in').sort((p,q)=>p.x-q.x).forEach(z=>o.push({ch:z.ch}));
 b.spots.slice().sort((p,q)=>p.l-q.l).forEach(s=>o.push({ch:s.ch}));
 if(b.charge>=b.cmax)o.push({ch:' '});
 return o}
function stripHTML(){
 const it=items();if(!it.length)return '<span class="sp">·</span>';
 return it.map(i=>i.ch===' '?'<span>SPACE</span>':`<span>${esc(i.ch)}</span>`).join('')}
function strip(){const it=items();return it.length?{cur:0,ch:it[0].ch}:{cur:-1,ch:null}}

/* ---------- drawing ---------- */
function draw(g,cam){
 const R=RN.R,b=act(),bx=R.bossX-cam;if(bx>W+50)return;
 const cg=cageGeom(),K=cg.K,cx=ri(bx+20),t=b?b.t:R.t;
 const hop=b&&b.keyHop>0?-(Math.floor(b.keyHop*14)%2)*2:0;
 if(K)g.drawImage(K,cx+3,GROUND-cg.kh-2+hop);
 const fr=b&&b.crack>0?'#ffffff':'#3a3048';
 g.fillStyle=fr;g.fillRect(cx,GROUND-cg.ch-2,cg.cw,2);g.fillRect(cx,GROUND-2,cg.cw,2);
 for(let i=0;i<NBARS;i++){
  const x=cx+ri(i*(cg.cw-1)/(NBARS-1)),intact=b?b.bars[i]:true;
  g.fillStyle='#9a9ab0';
  if(intact){g.fillRect(x,GROUND-cg.ch,1,cg.ch-2);g.fillStyle='#d8d8e8';g.fillRect(x,GROUND-cg.ch,1,2);
   if(b&&b.mode!=='intro'&&b.bars.filter(q=>!q).length>0&&(i%3===1)){g.fillStyle='#3a3048';g.fillRect(x,GROUND-ri(cg.ch/2),1,1)}}
  else{g.fillRect(x,GROUND-cg.ch,1,3);g.fillRect(x,GROUND-5,1,3)}}
 g.fillStyle='#6e5e88';g.fillRect(cx+1,GROUND-cg.ch-2,cg.cw-2,1);
 const v=vgeom(b);
 if(v.hasV)g.drawImage(v.img,ri(v.sx-v.vw/2),GROUND-v.vh+v.dy);
 else{g.fillStyle=(b&&b.hitT>0)?'#ffffff':'#6a3fb8';g.fillRect(ri(v.sx-16),GROUND-32+v.dy,32,32)}
 if(b&&b.p2&&b.mode!=='dying'&&Math.floor(t*6)%3)g.drawImage(ANGER,ri(v.sx+v.vw/2-8),GROUND-v.vh-8+v.dy);
 if(b&&b.mode==='wind'&&!b.angryT&&b.mt/b.windDur>.35&&Math.floor(t*10)%2)RN.txt(g,'!',ri(v.sx)-4,GROUND-v.vh-12+v.dy,'#ff6b7a',1,'l');
}

function line(g,x0,y0,x1,y1,th,col){
 g.fillStyle=col;const h=th>>1;
 if(y0===y1){g.fillRect(Math.min(x0,x1),y0-h,Math.abs(x1-x0)+1,th);return}
 const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));
 for(let i=0;i<=n;i++)g.fillRect(x0+ri((x1-x0)*i/n)-h,y0+ri((y1-y0)*i/n)-h,th,th)}
function shield(g,cx,cy,rx,ry,col){
 g.fillStyle=col;const hw=d=>d>ry?0:ri(rx*Math.sqrt(Math.max(0,1-(d/ry)*(d/ry))));
 for(let dy=-ry;dy<=ry;dy++){const a=hw(Math.abs(dy)),e=hw(Math.abs(dy)+1),run=Math.max(1,a-e);g.fillRect(cx-a,cy+dy,run,1);g.fillRect(cx+a-run+1,cy+dy,run,1)}}

function top(g,cam){
 const b=act();if(!b||RN.R.phase!=='boss')return;
 const t=b.t;
 // weak spots
 b.spots.forEach(s=>{
  const p=spotPos(b,s),pulse=Math.floor(t*5)%2,late=s.l<1.2&&Math.floor(t*10)%2;
  if(!late){const o=11+pulse,col=pulse?'#ffffff':'#f0c860';g.fillStyle='#0b1033';g.fillRect(p.x-o-1,p.y-o-1,2*o+2,2*o+2);
   g.fillStyle=col;g.fillRect(p.x-o,p.y-o,2*o,2);g.fillRect(p.x-o,p.y+o-2,2*o,2);g.fillRect(p.x-o,p.y-o,2,2*o);g.fillRect(p.x+o-2,p.y-o,2,2*o);
   g.fillStyle='#0b1033';g.fillRect(p.x-o+2,p.y-o+2,2*o-4,2*o-4);
   g.fillStyle='#f0c860';[[-o-2,0],[o+1,0],[0,-o-2],[0,o+1]].forEach(([a,c])=>g.fillRect(p.x+a,p.y+c,1,1))}
  RN.cap(s.ch,p.x-6,p.y-7,1);
  const bw=ri(16*Math.max(0,s.l)/s.dur);g.fillStyle='#0b1033';g.fillRect(p.x-9,p.y+o0(),18,3);g.fillStyle='#f0c860';g.fillRect(p.x-8,p.y+o0()+1,bw,1);
 });
 // blobs
 const inb=b.blobs.filter(z=>z.st==='in').sort((p,q)=>p.x-q.x);
 b.blobs.forEach(z=>{
  const sp=Math.floor(t*6+z.w)%2?BLOB_B:BLOB_A,x=ri(z.x),y=ri(z.y);
  g.drawImage(sp,x,y);
  if(z.st==='in'){const cur=z===inb[0];RN.cap(z.ch,x+3-6,y-17-(cur?Math.floor(t*6)%2:0),cur?1:0)}});
 // lasers
 b.lasers.forEach(l=>{
  const x0=RX+2,y0=GROUND-16;
  if(l.big){const k=l.l/l.max,th=k>.3?10:6,fl=Math.floor(t*30)%2;
   line(g,x0,y0,l.tx,l.ty,th,fl?'#f0c860':'#ffe9a0');line(g,x0,y0,l.tx,l.ty,th-4,'#ffffff');
   g.fillStyle='#ffffff';g.fillRect(x0-2,y0-7,10,14);g.fillStyle='#f0c860';g.fillRect(x0,y0-5,6,10)}
  else{line(g,x0,y0,l.tx,l.ty,2,l.c);line(g,x0,y0,l.tx,l.ty,1,'#ffffff')}});
 // splats and shield
 b.splats.forEach(s=>{if(s.l>.2||Math.floor(t*20)%2)g.drawImage(SPLAT,s.x-3,s.y-3)});
 if(b.shield>0&&Math.floor(t*24)%4)shield(g,HX+4,GROUND-16,16,19,Math.floor(t*12)%2?'#8ff0ff':'#ffffff');
}
const o0=()=>14;

function drawHud(g){
 const R=RN.R,b=act(),f=b?b.hp/b.max:1;
 RN.txt(g,R.vname,W-6,4,'#ffffff',1,'r');
 g.fillStyle='#0b1033';g.fillRect(W-88,15,82,6);g.fillStyle='#3a2050';g.fillRect(W-87,16,80,4);
 g.fillStyle=b&&b.p2?'#ff9a3a':'#ff6b7a';g.fillRect(W-87,16,ri(80*f),4);
 g.fillStyle='#ffffff';g.fillRect(W-87+40,15,1,6);
 let nm='KEYLORI';try{nm=SPECIES[R.sp].n[0].toUpperCase()}catch(e){}
 RN.txt(g,'FREE '+nm+'!',6,4,'#f0c860');
 if(!b)return;
 // charge meter
 const seg=b.hard?5:6,mw=b.cmax*seg+1,full=b.charge>=b.cmax,fl=Math.floor(b.t*8)%2;
 g.drawImage(BOLT,6,15);
 g.fillStyle='#0b1033';g.fillRect(13,14,mw+2,8);g.fillStyle='#1a2156';g.fillRect(14,15,mw,6);
 for(let i=0;i<b.cmax;i++){if(i<b.charge){g.fillStyle=full?(fl?'#ffffff':'#f0c860'):'#8ff0ff';g.fillRect(15+i*seg,16,seg-1,4)}}
 if(full&&b.mode!=='dying'&&b.mode!=='done'){
  const x=HX-24,y=32;g.fillStyle='#0b1033';g.fillRect(x-1,y-1,50,15);g.fillStyle=fl?'#f0c860':'#ffffff';g.fillRect(x,y,48,13);g.fillStyle='#c0a040';g.fillRect(x,y+12,48,1);
  RN.txt(g,'SPACE',x+4,y+2,'#0b1033',1,'l',null);
  g.fillStyle='#0b1033';g.fillRect(x+20,y+14,9,2);g.fillRect(x+22,y+16,5,2);g.fillRect(x+24,y+18,1,1);
  g.fillStyle=fl?'#f0c860':'#ffffff';g.fillRect(x+21,y+14,7,1);g.fillRect(x+23,y+15,3,1)}
}

RN.HK.drawTop.push(top);
RN.boss={start,key,update,draw,drawHud,strip,stripHTML,_state:()=>act()};
})();
