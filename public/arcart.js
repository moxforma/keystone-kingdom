/* Arcade card art: Zelda (A Link to the Past) style pixel scenes, 2 frames each (84x50 per frame, made to fill the card's art box) */
(function(){
const W=84,H=50;
const G3={A:['010','101','111','101','101'],F:['111','100','110','100','100'],J:['001','001','001','101','010'],K:['101','110','100','110','101'],Z:['111','001','010','100','111'],Q:['010','101','101','111','011'],R:['110','101','110','101','101'],B:['110','101','110','101','110']};
function mk(){const c=document.createElement('canvas');c.width=W*2;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return [c,g]}
function tools(g){const px=(x,y,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),1,1)},rect=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
 const disc=(cx,cy,r,c)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.6)px(cx+x,cy+y,c)};
 const ring=(cx,cy,r,c)=>{for(let y=-r-1;y<=r+1;y++)for(let x=-r-1;x<=r+1;x++){const d=x*x+y*y;if(d<=r*r+r*.6&&d>(r-1)*(r-1)+(r-1)*.6)px(cx+x,cy+y,c)}};
 const line=(x0,y0,x1,y1,c)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)px(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c)};
 const glyph=(ch,x,y,c)=>G3[ch]&&G3[ch].forEach((r,j)=>[...r].forEach((b,i)=>{if(b==='1')px(x+i,y+j,c)}));
 const blit=(cv,x,y)=>g.drawImage(cv,Math.round(x),Math.round(y));
 return{px,rect,disc,ring,line,glyph,blit}}
/* trimmed sprite canvases */
function trim(cv){const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let x0=1e9,x1=-1,y0=1e9,y1=-1;
 for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++)if(d[(y*cv.width+x)*4+3]>40){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
 if(x1<0)return cv;const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(cv,x0,y0,o.width,o.height,0,0,o.width,o.height);return o}
const keyl=(k,f=1)=>{const i=KKDATA.order.indexOf(k);return trim(evolvedV(i<0?0:i,f,null,{}))};
const vil=k=>trim(PXG(SCR2.spr[k],SCR2.pal[k]));
const hero=(h,c,eq)=>trim(heroCanvas(eq||{},h||'pop',c||null));
const myHero=()=>hero(typeof heroNow==='function'?heroNow():'pop',S.color,S.equip);
/* Zelda-ish ground tiles */
function grass(T,ox,y0=0,h=H,seed=1){T.rect(ox,y0,W,h,'#58a848');let s=seed*977;const r=()=>(s=(s*1103515245+12345)>>>0)%1000/1000;
 for(let k=0;k<26;k++){const x=ox+Math.floor(r()*W),y=y0+Math.floor(r()*h);T.px(x,y,'#3c7c34');T.px(x+2,y,'#3c7c34');T.px(x+1,y-1,'#3c7c34');T.px(x+1,y,'#80c868')}
 for(let k=0;k<5;k++){const x=ox+Math.floor(r()*W),y=y0+Math.floor(r()*h);T.px(x,y,k%2?'#fff6e0':'#f0d850')}}
function shadow(T,cx,y,w){T.rect(cx-w/2,y,w,2,'rgba(16,24,12,.45)');T.rect(cx-w/2+1,y+2,w-2,1,'rgba(16,24,12,.3)')}
function frameBorder(T,ox){}

const ART={};
const star=(T,x,y,a,b)=>{T.px(x,y,a);T.px(x-1,y,b);T.px(x+1,y,b);T.px(x,y-1,b);T.px(x,y+1,b)};
/* 1. Scrambler Attack */
ART.glitch=()=>{const [c,g]=mk(),T=tools(g),H_=myHero(),A=vil('imp'),B=vil('inkblob'),C=vil('quill');
 for(let f=0;f<2;f++){const ox=f*W;grass(T,ox,0,H,3);T.rect(ox,36,W,14,'#c8a060');for(let x=0;x<W;x+=3)T.px(ox+x,36,'#a07840');T.px(ox+20,43,'#8a6838');T.px(ox+60,46,'#8a6838');
  shadow(T,ox+16,46,18);T.blit(H_,ox+16-H_.width/2,46-H_.height);
  if(!f){T.rect(ox+29,8,2,16,'#e8f0ff');T.px(ox+29,7,'#ffffff');T.rect(ox+27,23,6,2,'#c8981e');T.rect(ox+29,25,2,4,'#5a3a20')}
  else{T.rect(ox+29,26,16,2,'#e8f0ff');T.px(ox+45,26,'#ffffff');T.rect(ox+28,24,2,6,'#c8981e');T.rect(ox+25,26,4,2,'#5a3a20');for(let a=0;a<10;a++){const t=-1.3+a*.28;T.px(ox+30+Math.cos(t)*17,26+Math.sin(t)*17,a%2?'#ffffff':'#bfe2f6')}}
  const ax=ox+50+(f?3:0);shadow(T,ox+74,44,14);T.blit(B,ox+74-B.width/2,44-B.height+(f?-1:0));shadow(T,ax,48,12);T.blit(A,ax-A.width/2,48-A.height+(f?-2:0));T.blit(C,ox+62-C.width/2+(f?1:0),30-C.height);
  if(f)[[ax-8,18],[ax+7,14],[ax-2,10]].forEach(([x,y])=>star(T,x,y,'#fff6e0','#f0c860'));
  T.rect(ox+38,2+f,7,9,'#2a1d3e');T.rect(ox+39,3+f,5,7,'#fff6e0');T.glyph('Z',ox+40,4+f,'#2a1d3e');
  T.rect(ox+72,4+(1-f),7,9,'#2a1d3e');T.rect(ox+73,5+(1-f),5,7,'#fff6e0');T.glyph('Q',ox+74,6+(1-f),'#2a1d3e')}
 return c};
/* 2. Meteor Zap */
ART.meteor=()=>{const [c,g]=mk(),T=tools(g),K=keyl('glowbit'),K2=keyl('sparkewt');
 for(let f=0;f<2;f++){const ox=f*W;for(let y=0;y<H;y++)T.rect(ox,y,W,1,y<12?'#121636':y<24?'#1a1e48':'#242a5a');
  [[6,5],[20,10],[34,3],[70,8],[80,18],[12,20],[56,14],[46,6]].forEach(([x,y],i)=>T.px(ox+x,y,(i+f)%3?'#fff6e0':'#8a90c8'));
  for(let x=0;x<W;x++){const h=36+Math.round(Math.sin(x/9)*3);T.rect(ox+x,h,1,H-h,'#1e3a30');T.px(ox+x,h,'#2e5a40')}
  [[2,33],[70,34]].forEach(([x,y])=>{T.rect(ox+x,y,10,8,'#3a2a48');T.rect(ox+x-1,y-3,12,3,'#6a3040');T.px(ox+x+3,y+3,'#f0c860');T.px(ox+x+7,y+3,'#f0c860')});
  shadow(T,ox+30,48,18);T.blit(K,ox+30-K.width/2,48-K.height+(f?-1:0));shadow(T,ox+52,49,18);T.blit(K2,ox+52-K2.width/2,49-K2.height+(f?0:-1));
  const mx=f?40:60,my=f?12:6;for(let t=1;t<12;t++){T.px(ox+mx+t,my-t,t<4?'#ffe080':t<8?'#f08a3a':'#a03a2a');T.px(ox+mx+t+1,my-t,t<5?'#f0c860':'#c8502e')}
  T.disc(ox+mx,my,4,'#6a4a3a');T.px(ox+mx-1,my-2,'#9a7a5a');T.px(ox+mx-2,my-1,'#9a7a5a');T.px(ox+mx+2,my+2,'#3a2a20');
  if(f){const pts=[[ox+31,24],[ox+34,19],[ox+31,15],[ox+36,12],[ox+mx-2,my+3]];for(let i=0;i<pts.length-1;i++){T.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],'#fff6a0');T.line(pts[i][0]+1,pts[i][1],pts[i+1][0]+1,pts[i+1][1],'#f0c860')}
   for(let a=0;a<10;a++){const t=a/10*Math.PI*2;T.px(ox+mx+Math.cos(t)*7,my+Math.sin(t)*7,'#fff6e0');T.px(ox+mx+Math.cos(t)*6,my+Math.sin(t)*6,'#f0c860')}}}
 return c};
/* 3. Keylori Race */
ART.race=()=>{const [c,g]=mk(),T=tools(g),A=keyl('dunelet'),B=keyl('zipp'),C=keyl('beetix');
 for(let f=0;f<2;f++){const ox=f*W;grass(T,ox,0,H,7);T.rect(ox,16,W,30,'#c8a060');T.rect(ox,16,W,1,'#a07840');T.rect(ox,45,W,1,'#a07840');
  for(let x=0;x<W;x+=8)T.rect(ox+x+(f?4:0),31,4,1,'#e8d0a0');
  T.rect(ox+78,2,1,40,'#5a3a20');for(let y=0;y<5;y++)for(let x=0;x<2;x++)T.rect(ox+79+x*2,2+y*2,2,2,(x+y)%2?'#ffffff':'#2a1d3e');
  const b1=f?1:0,b2=f?0:1;shadow(T,ox+58,28,18);T.blit(C,ox+58-C.width/2,28-C.height-b2);shadow(T,ox+44,36,18);T.blit(B,ox+44-B.width/2,36-B.height-b1);shadow(T,ox+22,46,20);T.blit(A,ox+22-A.width/2,46-A.height-b2);
  for(let k=0;k<5;k++)T.rect(ox+1+(f?2:0),20+k*5,6-(k%2)*2,1,'#fff6e0');
  T.disc(ox+9-(f?2:0),44,1+f,'#e8dcc4');T.disc(ox+33-(f?1:0),34,1+(1-f),'#e8dcc4');T.disc(ox+48-(f?1:0),26,1+f,'#e8dcc4')}
 return c};
/* 4. Bubble Pop */
ART.bubble=()=>{const [c,g]=mk(),T=tools(g),K=keyl('bubbly'),K2=keyl('drizzit');
 for(let f=0;f<2;f++){const ox=f*W;for(let y=0;y<H;y++)T.rect(ox,y,W,1,y<32?'#5a9ad8':'#3a78b8');
  for(let x=0;x<W;x+=6)T.rect(ox+x+(f?3:0),34,3,1,'#8ac0f0');T.rect(ox,43,W,7,'#58a848');for(let x=0;x<W;x+=4)T.px(ox+x,43,'#3c7c34');
  T.blit(K,ox+4,45-K.height);T.blit(K2,ox+W-4-K2.width,45-K2.height+(f?1:0));
  const bub=(x,y,r,ch,pop)=>{if(pop){for(let a=0;a<10;a++){const t=a/10*Math.PI*2;T.px(x+Math.cos(t)*(r+2),y+Math.sin(t)*(r+2),'#ffffff');T.px(x+Math.cos(t)*r,y+Math.sin(t)*r,'#bfe8ff')}T.glyph(ch,x-1,y-2,'#fff6e0');return}
   T.disc(x,y,r,'rgba(200,240,255,.35)');T.ring(x,y,r,'#e8f8ff');T.px(x-r+2,y-r+2,'#ffffff');T.px(x-r+3,y-r+2,'#ffffff');T.glyph(ch,x-1,y-2,'#1e3a68')};
  bub(ox+38,22-f*2,8,'F',false);bub(ox+56,12-f*2,6,'J',f===1);bub(ox+52,32-f,5,'K',false);bub(ox+24,8-f,5,'A',false);bub(ox+72,8-f,4,'B',f===0)}
 return c};
/* 5. Treasure Dig */
ART.dig=()=>{const [c,g]=mk(),T=tools(g),H_=myHero(),K=keyl('beetix');
 for(let f=0;f<2;f++){const ox=f*W;grass(T,ox,0,8,11);T.rect(ox,8,W,H-8,'#8a5a32');T.rect(ox,8,W,2,'#6a4224');
  [[8,16],[30,40],[70,16],[56,44],[76,40]].forEach(([x,y])=>{T.rect(ox+x,y,3,2,'#6a4224');T.px(ox+x,y,'#a87a4a')});
  [[80,28,'#7fe8ff'],[4,30,'#f07a6e'],[64,12,'#6edc8c']].forEach(([x,y,col])=>{T.px(ox+x,y,col);T.px(ox+x+1,y,col);T.px(ox+x,y+1,col);T.px(ox+x+1,y-1,'#ffffff')});
  T.rect(ox+40,36,26,12,'#3a2414');T.rect(ox+41,35,24,1,'#5a3a20');
  const cy=f?31:35;T.rect(ox+46,cy,16,10,'#2a1d1e');T.rect(ox+47,cy+1,14,8,'#a0602a');T.rect(ox+47,cy+3,14,1,'#f0c860');T.rect(ox+53,cy+3,2,3,'#f0c860');
  if(f){T.rect(ox+47,cy-3,14,3,'#7a4a20');for(let a=0;a<6;a++)T.px(ox+48+a*2,cy-5-(a%2)*2,a%2?'#f0c860':'#fff6e0')}
  shadow(T,ox+18,48,18);T.blit(H_,ox+18-H_.width/2,48-H_.height);
  if(!f){T.line(ox+30,12,ox+39,36,'#8a6838');T.rect(ox+38,35,4,3,'#c8d0dc')}else{T.line(ox+30,16,ox+41,30,'#8a6838');T.rect(ox+40,29,4,3,'#c8d0dc');[[44,20],[48,16],[40,16],[52,22]].forEach(([x,y])=>T.rect(ox+x,y,2,2,'#6a4224'))}
  T.blit(K,ox+W-2-K.width,48-K.height+(f?-1:0))}
 return c};
/* 6. Keylori Keeper */
ART.keeper=()=>{const [c,g]=mk(),T=tools(g),K=keyl('acornet');
 for(let f=0;f<2;f++){const ox=f*W;grass(T,ox,0,H,13);
  for(let y=0;y<4;y++)for(let x=0;x<11;x++)T.rect(ox+8+x*6,28+y*5,6,5,(x+y)%2?'#e85a4a':'#fff6e0');
  /* basket of food */
  T.rect(ox+62,30,16,10,'#2a1d1e');T.rect(ox+63,31,14,8,'#c8904a');for(let x=0;x<14;x+=3)T.px(ox+63+x,34,'#8a5a2a');T.disc(ox+67,29,2,'#d83a3a');T.disc(ox+72,28,2,'#f0c860');T.disc(ox+75,29,2,'#6edc8c');
  shadow(T,ox+30,46,22);T.blit(K,ox+30-K.width/2,46-K.height+(f?1:0));
  const ax=f?ox+42:ox+58,ay=f?18:6;T.disc(ax,ay,3,'#d83a3a');T.px(ax-1,ay-1,'#ff9a8a');T.rect(ax,ay-5,1,2,'#5a3a20');T.px(ax+1,ay-5,'#58a848');T.px(ax+2,ay-6,'#58a848');
  if(f){T.rect(ax+2,ay-1,2,3,'#58a848');const hx=ox+30,hy=46-K.height-7;[[0,0],[1,0],[3,0],[4,0],[0,1],[1,1],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2],[2,3]].forEach(([x,y])=>T.px(hx-2+x,hy+y,'#f07a8e'))}
  else{for(let t=0;t<6;t++)T.px(ax+4+t*2,ay-1+t,'#fff6e0')}
  T.rect(ox+60,8,20,9,'#2a1d3e');T.rect(ox+61,9,18,7,'#f0c860');T.glyph('A',ox+63,10,'#2a1d3e');T.rect(ox+68,12,8,1,'#2a1d3e')}
 return c};
/* 7. Story Bridge */
ART.bridge=()=>{const [c,g]=mk(),T=tools(g),H_=myHero(),K=keyl('breezle');
 for(let f=0;f<2;f++){const ox=f*W;for(let y=0;y<H;y++)T.rect(ox,y,W,1,y<18?'#7ab8e8':'#9ac8f0');
  T.rect(ox,36,W,14,'#3a78b8');for(let x=0;x<W;x+=7)T.rect(ox+x+(f?3:0),40,4,1,'#8ac0f0');
  T.rect(ox,26,12,24,'#8a7a6a');T.rect(ox,26,12,3,'#58a848');T.rect(ox+72,26,12,24,'#8a7a6a');T.rect(ox+72,26,12,3,'#58a848');
  for(let y=30;y<50;y+=4){T.px(ox+4,y,'#6a5a4a');T.px(ox+78,y+2,'#6a5a4a')}
  T.line(ox+10,23,ox+74,23,'#8a6838');const n=f?7:6;for(let k=0;k<n;k++){T.rect(ox+12+k*9,26,8,3,'#c8904a');T.rect(ox+12+k*9,28,8,1,'#8a5a2a');T.px(ox+16+k*9,24,'#8a6838')}
  if(f)for(let a=0;a<6;a++)T.px(ox+68+(a%3)*2,21-(a>2?3:0),a%2?'#fff6e0':'#f0c860');
  T.blit(H_,ox+24+(f?3:0)-H_.width/2,26-H_.height);T.blit(K,ox+W-2-K.width,26-K.height+(f?1:0));
  T.rect(ox+40,2,28,13,'#5a3a20');T.rect(ox+41,3,26,11,'#f0e0b8');for(let k=0;k<3;k++)T.rect(ox+43,5+k*3,(f||k<2)?20-k*3:9,1,'#8a6838')}
 return c};
/* 8. Race with Others */
ART.racenet=()=>{const [c,g]=mk(),T=tools(g),me=typeof heroNow==='function'?heroNow():'pop';
 const others=['rexo','juno','pip','ember','mochi','bruno','inky'].filter(h=>h!==me&&HEROES[h]);
 const front=myHero(),mid=hero(others[0]),mid2=hero(others[2]||others[0]),far=hero(others[1]||others[0]);
 for(let f=0;f<2;f++){const ox=f*W;T.rect(ox,0,W,H,'#2a2340');
  const cx=ox+W/2,cy=18;for(let k=0;k<40;k++){const a=k/40*Math.PI*2+(f?.05:0),len=k%3===0?18:k%3===1?11:6,r0=18+((k*7+f*4)%7);
   for(let t=r0;t<r0+len;t++){const x=Math.round(cx+Math.cos(a)*t*1.7),y=Math.round(cy+Math.sin(a)*t);if(x>=ox&&x<ox+W)T.px(x,y,k%3===0?'#fff6e0':k%3===1?'#c8bff0':'#7a6fb0')}}
  g.drawImage(far,ox+38,2+(f?1:0),Math.round(far.width/2),Math.round(far.height/2));
  T.blit(mid,ox+4,8+(f?0:1));T.blit(mid2,ox+W-4-mid2.width,7+(f?1:0));
  T.blit(front,ox+W/2-front.width/2,H-front.height+(f?0:1)-1);
  [[ox+14,33],[ox+70,33],[ox+30,49]].forEach(([x,y],i)=>{if((i+f)%2){T.px(x,y,'#e8dcc4');T.px(x+1,y-1,'#e8dcc4');T.px(x-1,y-1,'#e8dcc4')}})}
 return c};
window.ARCART=ART;
/* put the art on the arcade cards: 2-frame back-and-forth */
const MAP={'Scrambler Attack':'glitch','Meteor Zap':'meteor','Keylori Race':'race','Bubble Pop':'bubble','Treasure Dig':'dig','Keylori Keeper':'keeper','Story Bridge':'bridge','Race with Others':'racenet'};
const CACHE={};let ck='';
function url(k){let who='';try{who=JSON.stringify([heroNow(),S.color,S.equip])}catch(e){}if(who!==ck){ck=who;for(const x in CACHE)delete CACHE[x]}
 if(!CACHE[k])try{CACHE[k]=ART[k]().toDataURL()}catch(e){console.warn('arcart',k,e);CACHE[k]=''}return CACHE[k]}
document.head.insertAdjacentHTML('beforeend',`<style id="arcartcss">
#s-arcade .game .gart.zart{padding:0!important;background:none!important;overflow:hidden}
.zart .zimg{width:100%;max-width:252px;aspect-ratio:${W}/${H};background-size:200% 100%;background-repeat:no-repeat;image-rendering:pixelated;border:3px solid #2a1d3e;border-radius:6px;box-sizing:border-box;animation:zartA .9s steps(1) infinite}
@keyframes zartA{0%{background-position:0 0}50%{background-position:100% 0}}
#s-arcade .game.panel.feature{border-color:var(--line);box-shadow:0 12px 30px rgba(0,0,0,.35)}
#s-arcade .game.panel.racecard{border-color:#58c870;box-shadow:0 0 0 3px rgba(88,200,112,.2),0 12px 30px rgba(0,0,0,.35)}
body.mobile #s-arcade .game .gart.zart{transform:none!important;height:auto!important}
</style>`);
const _ra=renderArcade;renderArcade=function(){const r=_ra.apply(this,arguments);try{document.querySelectorAll('#s-arcade .game').forEach(card=>{const h=card.querySelector('h3'),k=h&&MAP[h.textContent.trim()],a=card.querySelector('.gart');
  if(!k||!a)return;const u=url(k);if(!u)return;a.className='gart zart';a.innerHTML=`<div class="zimg" style="background-image:url(${u})"></div>`})}catch(e){console.warn(e)}return r};
try{if(screen==='arcade')renderArcade()}catch(e){}
setTimeout(()=>document.body.classList.add('kkready'),3500);
/* show the home screen only once every script and the fonts have settled (stops the header jumping on load) */
{const ready=()=>{try{if(screen==='home'){renderHome()}}catch(e){}requestAnimationFrame(()=>document.body.classList.add('kkready'))};
 /* wait for the web fonts the home screen actually uses (fonts.ready can resolve before they're even requested) */
 const fonts=()=>{if(!document.fonts||!document.fonts.load)return Promise.resolve();const want=new Set();
  document.querySelectorAll('#s-home, #s-home *').forEach(e=>{const c=getComputedStyle(e);want.add(c.fontStyle+' '+c.fontWeight+' 16px '+c.fontFamily)});
  return Promise.all([...want].map(f=>document.fonts.load(f).catch(()=>{}))).then(()=>document.fonts.ready)};
 Promise.race([fonts(),new Promise(r=>setTimeout(r,2500))]).then(ready)}

/* ---------- a Menu button (house icon) on every header, next to Back ---------- */
{const HOUSE=PXG(["....oooo....","...oRRRRo...","..oRRRRRRo..",".oRRRRRRRRo.","oooooooooooo",".oWWWWWWWWo.",".oWWooWWWWo.",".oWWooWoooo.",".oWWooWoBBo.",".oWWooWoBBo.",".oooooooooo."],{o:'#2a1d3e',R:'#d8584a',W:'#fff6e0',B:'#7fc8f0'}).toDataURL();
 document.head.insertAdjacentHTML('beforeend','<style>.menubtn{display:inline-flex!important;align-items:center;gap:6px;padding:0 10px!important;width:auto!important}.menubtn img{width:22px;height:20px;image-rendering:pixelated}.menubtn span{font-size:14px;letter-spacing:.06em}body.mobile .menubtn span{display:none}</style>');
 const add=()=>{if(typeof screen==='undefined'||screen==='home')return;
  document.querySelectorAll('.screen:not([hidden]):not(#s-home) .topbar, #hud, #ghud').forEach(h=>{if(h.querySelector('.menubtn')||h.closest('[hidden]'))return;
   const back=h.querySelector('.icon-btn[data-act=go]');if(back&&back.dataset.to==='home')return;const b=document.createElement('button');b.className='icon-btn menubtn';b.dataset.act='go';b.dataset.to='home';b.setAttribute('aria-label','Menu');b.title='Main menu';
   b.innerHTML='<img src="'+HOUSE+'" alt=""><span>MENU</span>';back?back.insertAdjacentElement('afterend',b):h.prepend(b)})};
 setInterval(add,300);add()}

/* the text-size picker lives in the header: put it back right away whenever the home screen redraws (stops the header jumping) */
{const _rhF=renderHome;renderHome=function(){const r=_rhF.apply(this,arguments);try{window.addFs&&addFs();if(typeof fitHome==='function')fitHome()}catch(e){}return r}}

/* About window links to the full landing page */
{const _ab=ACT.about;if(_ab)ACT.about=function(){const r=_ab.apply(this,arguments);try{const rb=document.querySelector('#mbox .rbtns');if(rb&&!rb.querySelector('.aboutlink'))rb.insertAdjacentHTML('afterbegin','<a style="text-decoration:none" class="btn aboutlink" href="/" target="_blank" rel="noopener">How to play</a>')}catch(e){}return r}}
})();
