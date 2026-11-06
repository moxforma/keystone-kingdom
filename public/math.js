/* math.js: the MATH stream (registration + CLASSIC mode) for Keyloria Kingdom.
   Same scene as classic typing (hero, Scrambler holding the caged Keylori, HP bar); the strip shows a problem from MATH.problems() in the big pixel font.
   The kid types the answer: digits plus the symbols the answer needs. Backspace fixes. Auto-submit when the typed length equals the answer length
   (Space or Enter submits early). Right = one laser per key + celebration. Wrong = shield splat, same problem again; after 2 misses the answer shows
   for a moment and a similar problem goes to the back of the queue. Stars from first-try accuracy. Finish through KKS.finishClassic (progress is
   recorded under S.streams.math only: KKS swaps S.best etc. while the stream is active).
   Runner and boss runner configs come from runner-math.js (window.RUNNER_MATH). */
(function(){
if(!window.KKS||!window.MATH||typeof P==='undefined'||typeof S==='undefined')return;
const K=window.KKS,M=window.MATH;
const $q=(s,r)=>(r||document).querySelector(s);
const DIG='0123456789';
const PRAISE=['Nice!','Zap!','Great!','You got it!','Awesome!','Super!','Wow!','Yes!'];
const REG=['Count to 20','Add to 10','Add to 20','Tens and ones','Times tables','Multiply and divide','Fractions and decimals','Percent and ratio','Negative numbers','Equations','Mix of early math','Mix of big math'];

/* ---------- registration ---------- */
K.register({
 id:'math',name:'Math',kbd:'digits',regionDesc:REG,
 topicFor(w,slot,kind){try{const t=M.lesson(w,kind==='review'?7:kind==='boss'?8:slot.k);return t?t.id:''}catch(e){return ''}},
 title(id){try{const t=M.topic(id);return t&&t.title?t.title:null}catch(e){return null}},
 classic:n=>{try{classic(n)}catch(e){console.error('[math]',e);try{P.phase='wait';modal('<h2>Math</h2><div class="rbtns"><button class="btn big nextbtn" data-act="go" data-to="map">OK</button></div>')}catch(_){}}},
 runnerCfg:(i,s)=>window.RUNNER_MATH&&RUNNER_MATH.cfg?RUNNER_MATH.cfg(i,s):null,
 bossCfg:i=>window.RUNNER_MATH&&RUNNER_MATH.bossCfg?RUNNER_MATH.bossCfg(i):null
});

/* ---------- small pixel helpers (aids) ---------- */
const INK='#1a1030',CREAM='#fff6e0',GOLD='#f0c860',GOLD2='#b3850f',TEAL='#7fd8d0',TEAL2='#2f8f8a',PINK='#e89ac0',PINK2='#a04c78',SILV='#cfc6e0',SILV2='#8f86a8',COP='#c8794a',COP2='#7a4326';
const GC=[[GOLD,GOLD2],[TEAL,TEAL2],[PINK,PINK2]];
function cv(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w);c.height=Math.max(1,h);const g=c.getContext('2d');g.imageSmoothingEnabled=false;return {c,g}}
function R(g,col,x,y,w,h){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h)}
function dot(g,x,y,k){const a=GC[k%3];R(g,INK,x+1,y,6,8);R(g,INK,x,y+1,8,6);R(g,a[0],x+1,y+1,6,6);R(g,a[1],x+2,y+6,4,1);R(g,CREAM,x+2,y+2,2,1);R(g,CREAM,x+2,y+3,1,1)}
function line(g,col,x0,y0,x1,y1,t){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let k=0;k<=n;k++)R(g,col,x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,t||1,t||1)}
function poly(g,col,pts,t){for(let k=0;k<pts.length;k++){const a=pts[k],b=pts[(k+1)%pts.length];line(g,col,a[0],a[1],b[0],b[1],t||1)}}
function disc(g,col,cx,cy,r){for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.6)R(g,col,cx+x,cy+y,1,1)}
function ring(g,col,cx,cy,r){for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const d=x*x+y*y;if(d<=r*r+r*.6&&d>(r-1)*(r-1)+(r-1)*.6)R(g,col,cx+x,cy+y,1,1)}}
const F35={'0':'XXX,X.X,X.X,X.X,XXX','1':'.X.,XX.,.X.,.X.,XXX','2':'XXX,..X,XXX,X..,XXX','3':'XXX,..X,XXX,..X,XXX','4':'X.X,X.X,XXX,..X,..X','5':'XXX,X..,XXX,..X,XXX','6':'XXX,X..,XXX,X.X,XXX','7':'XXX,..X,.X.,.X.,.X.','8':'XXX,X.X,XXX,X.X,XXX','9':'XXX,X.X,XXX,..X,XXX','$':'.XX,XX.,.X.,.XX,XX.','c':'...,XXX,X..,XXX,...'};
function tiny(g,str,x,y,col){let cx=x;for(const ch of String(str)){const r=F35[ch];if(!r)continue;r.split(',').forEach((row,yy)=>{for(let xx=0;xx<3;xx++)if(row[xx]==='X')R(g,col,cx+xx,y+yy,1,1)});cx+=4}return cx-x-1}
function tinyW(str){return Math.max(0,String(str).length*4-1)}

/* group layouts: each returns {w,h,pts:[[x,y]], frame:bool} in px (dot = 8px) */
function layoutGroup(n,lay,seed){
 n=Math.max(0,Math.min(n|0,30));const C=10;let pts=[],w,h,box=null;
 const grid=(cols)=>{const rows=Math.ceil(n/cols)||1;for(let k=0;k<n;k++)pts.push([(k%cols)*C+1,Math.floor(k/cols)*C+1]);w=Math.min(n,cols)*C;h=rows*C;if(!n){w=C;h=C}};
 if(lay==='frame'||(lay==null&&n<=10&&seed===-1)){
  const frames=Math.max(1,Math.ceil(n/10));w=frames*(5*C+6)-6+4;h=2*C+4;
  for(let k=0;k<n;k++){const f=Math.floor(k/10),q=k%10;pts.push([2+f*(5*C+6)+(q%5)*C+1,2+Math.floor(q/5)*C+1])}
  box=[];for(let f=0;f<frames;f++)box.push([f*(5*C+6),0,5*C+4,2*C+4])}
 else if(lay==='dice'&&n>=1&&n<=6){
  const P9={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]}[n];w=3*C+8;h=3*C+8;
  P9.forEach(p=>pts.push([4+(p%3)*C+1,4+Math.floor(p/3)*C+1]));box=[[0,0,w,h]]}
 else if(lay==='scatter'){
  const cols=Math.max(3,Math.ceil(n/2)+1),rows=3,cells=[];for(let k=0;k<cols*rows;k++)cells.push(k);
  let s=(n*2654435761+seed*97+13)>>>0;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296};
  for(let k=cells.length-1;k>0;k--){const j=Math.floor(rnd()*(k+1));const t=cells[k];cells[k]=cells[j];cells[j]=t}
  cells.slice(0,n).forEach(c=>pts.push([(c%cols)*C+Math.floor(rnd()*3),Math.floor(c/cols)*C+Math.floor(rnd()*3)]));w=cols*C;h=rows*C}
 else if(lay==='circle'&&n>=1){
  const r=n===1?0:Math.max(10,Math.round(n*3.4));w=h=2*r+10;
  for(let k=0;k<n;k++){const a=-Math.PI/2+k*2*Math.PI/n;pts.push([Math.round(r+1+Math.cos(a)*r),Math.round(r+1+Math.sin(a)*r)])}}
 else if(lay==='rows')grid(5);
 else if(lay==='row')grid(10);
 else grid(5);
 return {w,h,pts,box}}
function dotsAid(a){
 const groups=(a.dots||[]).map(x=>+x||0),lay=a.layout,gs=groups.map((n,k)=>layoutGroup(n,lay,groups.length>1&&lay==null?-2:(lay==null?-1:k)));
 const gap=groups.length>1?(lay==='frame'||lay==='dice'?8:12):0;
 const W=gs.reduce((s,g)=>s+g.w,0)+gap*(gs.length-1),H=Math.max(...gs.map(g=>g.h),10);
 const o=cv(W,H);let x=0;
 gs.forEach((g,k)=>{const oy=Math.floor((H-g.h)/2);
  if(g.box)g.box.forEach(b=>{R(o.g,SILV2,x+b[0],oy+b[1],b[2],b[3]);R(o.g,INK,x+b[0]+1,oy+b[1]+1,b[2]-2,b[3]-2);
   if(lay==='frame'){R(o.g,SILV2,x+b[0]+2+5*10/1-0,oy+b[1]+2,0,0)}});
  g.pts.forEach(p=>dot(o.g,x+p[0],oy+p[1],groups.length>1?k:0));x+=g.w+gap;
  if(k<gs.length-1&&groups.length>1&&gap){R(o.g,SILV2,x-gap/2,H/2-1,1,2)}});
 return o.c}
function tenAid(a){
 const t=Math.min(+a.ten[0]||0,10),on=Math.min(+a.ten[1]||0,9),W=t*8+(t&&on?6:0)+Math.ceil(on/5)*8+(on?0:0)||8,H=24,o=cv(Math.max(W,8),H);let x=0;
 for(let k=0;k<t;k++){R(o.g,INK,x,0,7,24);R(o.g,GOLD,x+1,1,5,22);for(let y=1;y<24;y+=2)R(o.g,GOLD2,x+1,y+1,5,1);R(o.g,CREAM,x+1,1,1,22);x+=8}
 if(t&&on)x+=6;
 for(let k=0;k<on;k++){const cx=x+Math.floor(k/5)*8,cy=(k%5)*5;R(o.g,INK,cx,cy,7,5);R(o.g,TEAL,cx+1,cy+1,5,3);R(o.g,CREAM,cx+1,cy+1,2,1)}
 return o.c}
function coinsAid(a){
 const spec={1:[5,COP,COP2,'1'],5:[6,SILV,SILV2,'5'],10:[5,SILV,SILV2,'10'],25:[7,SILV,SILV2,'25'],100:[8,GOLD,GOLD2,'$'],200:[9,GOLD,SILV2,'$'],500:[9,PINK,PINK2,'$'],1000:[9,PINK,PINK2,'$']};
 const cs=(a.coins||[]).map(c=>{c=+c||0;return spec[c]||[6,SILV,SILV2,String(c)]});
 const W=cs.reduce((s,c)=>s+c[0]*2+3,0),o=cv(W,20);let x=0;
 cs.forEach(c=>{const r=c[0],cx=x+r,cy=10;disc(o.g,INK,cx,cy,r+1);disc(o.g,c[2],cx,cy,r);disc(o.g,c[1],cx,cy-1,r-1);ring(o.g,c[2],cx,cy,r-1);
  const lab=c[3];if(lab==='$'){tiny(o.g,'$',cx-1,cy-3,c[2])}else{const w=tinyW(lab);tiny(o.g,lab,cx-Math.floor(w/2),cy-3,c[2])}x+=r*2+3});
 return o.c}
function clockAid(a){
 const o=cv(41,41),g=o.g,cx=20,cy=20,r=19,h=+a.clock.h||12,m=+a.clock.m||0;
 disc(g,INK,cx,cy,r+1);disc(g,CREAM,cx,cy,r);ring(g,SILV2,cx,cy,r);
 for(let k=0;k<12;k++){const an=k*Math.PI/6,big=k%3===0,x=cx+Math.sin(an)*(r-3),y=cy-Math.cos(an)*(r-3);R(g,big?INK:SILV2,Math.round(x)-(big?1:0),Math.round(y)-(big?1:0),big?2:1,big?2:1)}
 const ha=((h%12)+m/60)*Math.PI/6,ma=m*Math.PI/30;
 line(g,PINK2,cx,cy,cx+Math.sin(ha)*9,cy-Math.cos(ha)*9,2);line(g,TEAL2,cx,cy,cx+Math.sin(ma)*14,cy-Math.cos(ma)*14,1);R(g,INK,cx-1,cy-1,3,3);
 return o.c}
function tallyAid(a){
 const n=Math.min(+a.tally||0,30),gr=Math.ceil(n/5),W=gr*20,o=cv(Math.max(W,8),20);
 for(let k=0;k<gr;k++){const c=Math.min(5,n-k*5),x=k*20;for(let s=0;s<Math.min(c,4);s++){R(o.g,INK,x+s*4,2,3,16);R(o.g,CREAM,x+s*4+1,3,1,14)}
  if(c===5)line(o.g,GOLD,x-1,15,x+16,4,2)}
 return o.c}
function fracAid(a){
 const nn=+a.frac.n||0,d=Math.max(1,Math.min(+a.frac.d||1,12)),sw=Math.max(6,Math.min(16,Math.floor(96/d))),W=sw*d+1,o=cv(W,18);
 R(o.g,INK,0,0,W,18);for(let k=0;k<d;k++){R(o.g,k<nn?GOLD:CREAM,1+k*sw,1,sw-1,16);if(k<nn)R(o.g,GOLD2,1+k*sw,15,sw-1,2)}
 for(let k=0;k<=d;k++)R(o.g,INK,k*sw,0,1,18);
 return o.c}
function gridAid(a){
 const w=Math.max(1,Math.min(+a.grid.w||1,16)),h=Math.max(1,Math.min(+a.grid.h||1,8)),o=cv(w*7+1,h*7+1);
 R(o.g,INK,0,0,w*7+1,h*7+1);for(let y=0;y<h;y++)for(let x=0;x<w;x++){R(o.g,TEAL,1+x*7,1+y*7,6,6);R(o.g,TEAL2,1+x*7,6+y*7,6,1)}
 return o.c}
function shapeAid(a){
 const nm=String(a.shape&&a.shape.name||'').toLowerCase(),o=cv(44,40),g=o.g,N={triangle:3,square:4,pentagon:5,hexagon:6,octagon:8};
 const cx=22,cy=20,col=GOLD;
 const fillPoly=(pts)=>{let minY=1e9,maxY=-1e9;pts.forEach(p=>{minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1])});
  for(let y=Math.round(minY);y<=Math.round(maxY);y++){const xs=[];for(let k=0;k<pts.length;k++){const A=pts[k],B=pts[(k+1)%pts.length];if((A[1]<=y&&B[1]>y)||(B[1]<=y&&A[1]>y))xs.push(A[0]+(y-A[1])*(B[0]-A[0])/(B[1]-A[1]))}
   xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2)R(g,col,xs[k],y,Math.max(1,Math.round(xs[k+1])-Math.round(xs[k])),1)}};
 const reg=(n,r,rot)=>{const p=[];for(let k=0;k<n;k++){const an=rot+k*2*Math.PI/n;p.push([cx+Math.sin(an)*r,cy-Math.cos(an)*r])}return p};
 let outline,fillP;
 if(N[nm]){const n=N[nm];fillP=outline=n===4?[[8,8],[36,8],[36,34],[8,34]].map(p=>[p[0]+(0),p[1]-0]).map(p=>[p[0],p[1]]):reg(n,n===3?19:18,n%2?0:Math.PI/n);if(n===4)fillP=outline=[[10,6],[34,6],[34,34],[10,34]]}
 else if(nm==='rectangle')fillP=outline=[[4,10],[40,10],[40,31],[4,31]];
 else if(nm==='cube'||nm==='box'){const wd=nm==='box'?34:26;
  fillPoly([[4,14],[4+wd,14],[4+wd,36],[4,36]]);poly(g,INK,[[4,14],[4+wd,14],[4+wd,36],[4,36]]);
  poly(g,INK,[[4,14],[10,6],[10+wd,6],[4+wd,14]]);R(g,GOLD2,5,14,wd-1,1);line(g,INK,4+wd,14,10+wd,6);line(g,INK,10+wd,6,10+wd,28);line(g,INK,4+wd,36,10+wd,28);
  return o.c}
 else if(nm==='pyramid'){fillPoly([[4,34],[40,34],[22,6]]);poly(g,INK,[[4,34],[40,34],[22,6]]);line(g,INK,22,6,28,34);return o.c}
 else if(/prism/.test(nm)){fillPoly([[4,34],[26,34],[15,10]]);poly(g,INK,[[4,34],[26,34],[15,10]]);poly(g,INK,[[15,10],[34,10],[40,30],[26,34]]);line(g,INK,34,10,40,30);R(g,GOLD2,16,12,17,1);return o.c}
 else fillP=outline=reg(6,18,Math.PI/6);
 fillPoly(fillP);poly(g,INK,outline);return o.c}

/* the aid for a problem (canvas or element) or null */
function aidEl(p,maxW,maxH){
 const a=p&&p.aid;if(!a||typeof a!=='object')return null;let c=null;
 try{
  if(a.bars&&a.bars.length){return barsEl(a.bars,maxH)}
  if(a.dots)c=dotsAid(a);else if(a.ten)c=tenAid(a);else if(a.coins)c=coinsAid(a);else if(a.clock)c=clockAid(a);else if(a.tally!=null)c=tallyAid(a);
  else if(a.frac)c=fracAid(a);else if(a.grid)c=gridAid(a);else if(a.shape)c=shapeAid(a)}
 catch(e){console.warn('[math aid]',e);return null}
 if(!c)return null;
 const sc=Math.max(1,Math.min(Math.floor(maxH/c.height),Math.floor(maxW/c.width),6));
 c.className='mq-aid';c.style.width=c.width*sc+'px';c.style.height=c.height*sc+'px';return c}
function barsEl(bars,maxH){
 const mx=Math.max(1,...bars.map(b=>+b.v||0)),d=document.createElement('div');d.className='mq-aid mq-bars';
 const bh=Math.max(4,Math.min(8,Math.floor((maxH-18)/mx)));
 d.innerHTML=bars.map((b,k)=>`<div class="mb"><div class="mbv" style="height:${(+b.v||0)*bh}px;--bc:${GC[k%3][0]};--bd:${GC[k%3][1]}"></div><span>${esc(String(b.l))}</span></div>`).join('');return d}

/* ---------- text ---------- */
function spoken(p){
 let q=String(p.q||'');if(/^\?$/.test(q.trim()))return p.hint||'How many?';
 q=q.replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/\+/g,' plus ').replace(/(\d)\s*[−-]\s*(\d)/g,'$1 minus $2').replace(/−/g,' minus ').replace(/=/g,' equals ').replace(/[_?□]/g,' what number ').replace(/\//g,' over ');
 return q}
function qSize(q){const L=q.length;return L<=9?'':L<=16?'mid':L<=30?'sm':'xs'}

/* ---------- the classic round ---------- */
const CSS=`<style id="mq-css">
#strip.mq #stripIn{display:none}
#mq{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:clamp(8px,2vw,22px);padding:2px 10px;font-family:'Jersey 10',monospace;color:#fff6e0;overflow:hidden}
#mq .mq-aid{flex:none;image-rendering:pixelated;image-rendering:crisp-edges}
#mq .mq-q{font-size:clamp(46px,7.4vw,74px);line-height:1;white-space:nowrap;text-shadow:3px 3px 0 #1a1030}
#mq .mq-q.mid{font-size:clamp(34px,5vw,52px)}
#mq .mq-q.sm{font-size:clamp(24px,3.4vw,34px);white-space:normal;text-align:center;max-width:62%;line-height:1.05}
#mq .mq-q.xs{font-size:clamp(18px,2.6vw,26px);white-space:normal;text-align:center;max-width:64%;line-height:1.05}
#mq .mq-eq{font-size:clamp(40px,6vw,60px);color:#f0c860;text-shadow:3px 3px 0 #1a1030}
#mq .mq-ans{display:flex;gap:4px;align-items:flex-end;min-width:1.1em;height:1.05em;font-size:clamp(46px,7.4vw,74px);line-height:1}
#mq .mq-ans b{display:block;min-width:.62em;height:1em;text-align:center;border-bottom:5px solid #6f79b8;font-weight:400;color:#7fd8d0;text-shadow:3px 3px 0 #1a1030;box-sizing:border-box}
#mq .mq-ans b.cur{border-bottom-color:#f0c860;animation:mqblink .8s steps(2) infinite}
#mq .mq-ans b.f{border-bottom-color:#7fd8d0}
#mq .mq-ans.ghost b{color:#f0c860;opacity:.85;border-bottom-color:#f0c860}
#mq .mq-ans.ok b{color:#7fd884;border-bottom-color:#7fd884}
#mq .mq-bars,#mqt .mq-bars{display:flex;align-items:flex-end;gap:8px;height:100%;padding-bottom:3px}
#mq .mb,#mqt .mb{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:15px;line-height:1}
#mq .mbv,#mqt .mbv{width:22px;background:repeating-linear-gradient(0deg,var(--bc) 0 6px,var(--bd) 6px 8px);border:2px solid #1a1030;box-sizing:content-box}
#mqt{position:absolute;left:30%;right:2%;top:5%;bottom:5%;z-index:6;display:flex;flex-direction:column;font-family:'Jersey 10',monospace;color:#fff6e0;image-rendering:pixelated}
#mqt .mqt-b{flex:1;min-height:0;display:flex;flex-direction:column;background:#1f3b36;border:6px solid #7a4326;box-shadow:0 0 0 3px #1a1030,6px 6px 0 3px #1a1030,inset 0 0 0 3px #2f5a50;padding:6px 14px 8px;overflow:hidden}
#mqt .mqt-h{display:flex;justify-content:space-between;align-items:center;font-size:clamp(14px,2vw,20px);color:#7fd8d0;letter-spacing:.12em;text-shadow:2px 2px 0 #1a1030}
#mqt .mqt-top{display:flex;align-items:center;gap:12px;border-bottom:3px dashed #2f8f8a;margin:0 0 3px;padding-bottom:3px}#mqt .mqt-top .mq-aid{margin-left:auto}#mqt .mqt-ex{flex:1;min-width:0;font-size:clamp(20px,3vw,30px);line-height:1;color:#f0c860;text-shadow:2px 2px 0 #1a1030;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mqt .mqt-l.two{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;align-content:start;column-gap:14px}#mqt .mqt-l.two .mqt-r{font-size:clamp(16px,2.1vw,22px);gap:8px}#mqt .mqt-l.two .mqt-tip{font-size:clamp(17px,2.3vw,24px)}#mqt .mqt-l.two .mqt-r canvas,#mqt .mqt-l.two .mqt-r .mq-aid{max-height:36px}#mqt .mqt-l.one{justify-content:flex-start}
#mqt .mqt-l{flex:1;padding-top:2px;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;overflow:hidden}
#mqt .mqt-r{display:flex;align-items:center;gap:12px;font-size:clamp(20px,2.8vw,30px);line-height:1.05;text-shadow:2px 2px 0 #1a1030;opacity:.75;animation:mqtin .25s steps(3)}
#mqt .mqt-r.cur{opacity:1}
#mqt .mqt-r canvas,#mqt .mqt-r .mq-aid{flex:none;image-rendering:pixelated}
#mqt .mqt-tip{font-size:clamp(20px,3vw,32px);color:#f0c860;text-shadow:2px 2px 0 #1a1030;animation:mqtin .25s steps(3)}
#mqt .mqt-go{padding:0 14px 2px;background:#f0c860;color:#1a1030;font-size:clamp(18px,2.4vw,24px);letter-spacing:0;box-shadow:0 3px 0 #b3850f,0 0 0 2px #1a1030;animation:mqblink .8s steps(2) infinite}
@keyframes mqtin{from{transform:translateY(8px);opacity:0}}
body.little #mqt .mqt-r{font-size:clamp(24px,3.6vw,38px)}
@keyframes mqblink{50%{border-bottom-color:#2a2350}}
.mq-splat{position:absolute;z-index:5;image-rendering:pixelated;pointer-events:none;animation:mqsplat .6s steps(6) forwards}
@keyframes mqsplat{0%{transform:scale(.5);opacity:1}30%{transform:scale(1.1)}100%{transform:scale(1);opacity:0}}
body.little #mq .mq-q,body.little #mq .mq-ans,body.little #mq .mq-eq{font-size:clamp(56px,9vw,88px)}
</style>`;
function ensureCss(){if(!document.getElementById('mq-css'))document.head.insertAdjacentHTML('beforeend',CSS)}
const SPLAT=['....rr...rr.....','..r.rrr.rrr.r...','.rrr.rRRrRr.rr..','..rRRrRRRRrRr...','.rrRRRRyyRRRrr..','rrRRyyyyyyyRRrr.','.rRRyyYYYyyRRr..','rrRRyyYWYyyRRrr.','.rRRyyYYYyyRRr..','rrRRyyyyyyyRRrr.','.rrRRRRyyRRRrr..','..rRRrRRRRrRr...','.rrr.rRRrRr.rr..','..r.rrr.rrr.r...','....rr...rr.....'];
let splatURL=null;
function splatImg(){if(splatURL)return splatURL;const o=cv(16,15);const pal={r:'#a83030',R:'#e8584f',y:'#f6a844',Y:'#ffe08a',W:'#fff6e0'};SPLAT.forEach((row,y)=>{for(let x=0;x<16;x++){const c=pal[row[x]];if(c)R(o.g,c,x,y,1,1)}});return splatURL=o.c.toDataURL()}

function ensureStream(){S.streams=S.streams||{};return S.streams.math=S.streams.math||{}}
function genSimilar(p,k){
 try{const sd=(M.hash('sim',P.i,P.s,P.n,k,p.q)>>>0)%100000,arr=M.gen(p.topic,p.part|0,sd,6);
  const c=arr.find(x=>x.q!==p.q&&!(P.seen&&P.seen.has(x.q)))||arr[0];if(c){c.rq=1;c.orig=false;return c}}catch(e){}
 return null}

function classic(n){
 ensureCss();
 const i=Math.floor(n/8),s=n%8,sl=K.slot(i)||{kind:'learn',k:0},boss=sl.kind==='boss',st=ensureStream();
 const mult=+(S.set&&S.set.len)||1,count=Math.max(6,Math.min(24,Math.round(12*mult)));
 const seed=M.seedFor(i,s,st.rn|0);
 let probs=[];try{probs=M.problems(i,s,count,seed)||[]}catch(e){console.warn('[math]',e)}
 if(!probs.length)for(let k=0;k<count;k++){const a=k%5+1,b=(k*3)%4+1;probs.push({q:a+' + '+b,a:String(a+b),aid:null,digits:String(a+b).length,keys:String(a+b),hint:'',topic:'m1.1',world:1,part:0,ans:'num'})}
 probs.forEach(p=>{p.orig=true});
 const o=P,me=Object.assign(o,{i,s,n,stream:'math',probs,Q:probs.slice(),len:probs.length,okN:0,done:0,total:probs.length,combo:0,maxCombo:0,mist:new Set(),typed:'',start:0,last:performance.now(),lock:false,seen:new Set(probs.map(p=>p.q)),text:'',pos:0,boss});
 P.mode=undefined;P.practice=false;
 P.tier=null;{const r=Math.random();P.tier=r<1/80?'diamond':r<1/20?'gold':null}
 const fi0=i+'-'+formNow(i),[fi,ff]=fi0.split('-').map(Number);P.fi=fi;P.ff=ff;
 const name=SPECIES[fi].n[ff],vname=villainName(i,boss);
 $('#arena').innerHTML=`${scn()}<div class="bubble" id="bubble"></div><div class="hero" id="hero">${zookSVG()}</div><div class="foe" id="foe"><div class="cage">${creatureSVG(fi,ff,'px',P.tier)}</div></div><div class="villain ${boss?'boss':''}" id="vil">${villainSVG(i,boss)}</div>
 <div class="fmeter"><span class="fname">${vname}</span><div class="bar"><i id="fbar" style="width:100%"></i></div><span class="flab">Free ${name}!</span></div>`;
 const strip=$('#strip');strip.classList.add('mq');
 let mq=$('#mq');if(mq)mq.remove();strip.insertAdjacentHTML('beforeend','<div id="mq"></div>');
 P.phase='play';
 say(P.tier?`WOW! A ${P.tier.toUpperCase()} ${name}! Save it!`:boss?`Boss! Save ${name}!`:'Solve it!');
 clearInterval(P.idle);
 P.idle=setInterval(()=>{if(P!==me){clearInterval(me.idle);return}if(P.phase!=='play'||P.lock)return;
  if(performance.now()-P.last>9000&&P.hinted!==P.idx){P.hinted=P.idx;const p=P.Q[0];if(p){say(esc(p.hint||'Think!'));speak(spoken(p))}}},1000);
 P.onKey=onKey;
 let tid='';try{const t=M.lesson(sl.w,boss?8:sl.kind==='review'?7:sl.k);tid=t?t.id:''}catch(e){}
 P.mTid=tid;try{if(hasTeach(tid)){const b=document.createElement('button');b.className='icon-btn';b.id='mqtb';b.setAttribute('data-act','mTeach');b.setAttribute('aria-label','Watch me');b.title='Watch me (H)';b.textContent='?';b.style.cssText="font-family:'Jersey 10',monospace;font-size:24px;line-height:1";
  const h=$('#hud');if(h&&!h.querySelector('#mqtb')){const sb=h.querySelector('[data-act="sayit"]');sb?sb.before(b):h.appendChild(b)}}}catch(e){}
 if(s===0&&hasTeach(tid)&&!(st.seen&&st.seen[tid])){P.lock=true;teach(tid,()=>{if(P!==me)return;P.lock=false;P.onKey=onKey;showProblem()})}
 else showProblem();
}

/* ---------- "Watch me" mini-lesson: Pop/hero beside a chalkboard; steps reveal one by one (1.2s each, Space = faster) ---------- */
function hasTeach(tid){const T=window.MATH_TEACH&&tid&&MATH_TEACH[tid];return !!(T&&T.steps&&T.steps.length)}
function teach(tid,done){
 const T=window.MATH_TEACH&&MATH_TEACH[tid],ar=$('#arena');
 if(!T||!T.steps||!T.steps.length||!ar){done&&done();return}
 try{const st=ensureStream();st.seen=st.seen||{};if(!st.seen[tid]){st.seen[tid]=1;save()}}catch(e){}
 const me=P,prevKey=P.onKey,prevLock=P.lock;
 const old=$('#mqt');if(old)old.remove();
 const el=document.createElement('div');el.id='mqt';
 el.innerHTML='<div class="mqt-b"><div class="mqt-h"><span>WATCH ME</span></div><div class="mqt-top"><div class="mqt-ex"></div></div><div class="mqt-l"></div></div>';
 const list=$q('.mqt-l',el);let steps=T.steps.slice();
 if(steps.length>1&&String(steps[0].t||'').trim()===String(T.ex||'').trim()&&!steps[0].aid)steps.shift();
 const items=steps.map(x=>({t:x.t,aid:x.aid})).concat(T.tip?[{tip:T.tip}]:[]);
 let idx=0,tm=0,ready=false,shown=false;const two=items.length>3,cap=6;
 list.className='mqt-l '+(two?'two':'one');if(two)list.style.gridTemplateRows='repeat('+Math.min(3,Math.ceil(items.length/2))+',auto)';
 const sayIt=t=>{try{speak(spoken({q:String(t)}))}catch(e){}};
 function alive(){return P===me&&(!shown||el.isConnected)}
 function reveal(it){
  list.querySelectorAll('.mqt-r.cur').forEach(r=>r.classList.remove('cur'));
  if(it.tip){const d=document.createElement('div');d.className='mqt-tip';d.textContent=it.tip;list.appendChild(d);while(list.children.length>cap)list.firstChild.remove();sayIt(it.tip);return}
  const r=document.createElement('div');r.className='mqt-r cur';const sp=document.createElement('span');sp.textContent=String(it.t||'');r.appendChild(sp);
  if(it.aid){try{const a=aidEl({aid:it.aid},Math.floor(el.clientWidth*(two?.2:.4)),Math.max(24,Math.min(two?36:60,Math.floor(el.clientHeight*.3))));if(a)r.appendChild(a)}catch(e){}}
  list.appendChild(r);while(list.children.length>cap)list.firstChild.remove();sayIt(it.t)}
 function next(){
  clearTimeout(tm);if(!alive())return;
  if(idx<items.length){reveal(items[idx++]);tm=setTimeout(next,1200)}
  else if(!ready){ready=true;const g=document.createElement('b');g.className='mqt-go';g.textContent='SPACE';$q('.mqt-h',el).appendChild(g)}}
 function finish(){
  clearTimeout(tm);try{el.remove()}catch(e){}
  if(P===me){P.onKey=prevKey;P.lock=prevLock;P.last=performance.now()}
  try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}
  done&&done()}
 function begin(){   // wait for the lesson splash to close first
  if(P!==me)return;
  if(typeof SPLASH!=='undefined'&&SPLASH){tm=setTimeout(begin,120);return}
  ar.appendChild(el);shown=true;$q('.mqt-ex',el).textContent=String(T.ex||'');sayIt(T.ex);
  if(T.aid){try{const a=aidEl({aid:T.aid},Math.floor(el.clientWidth*.4),Math.max(24,Math.min(60,Math.floor(el.clientHeight*.3))));if(a)$q('.mqt-top',el).appendChild(a)}catch(e){}}
  tm=setTimeout(next,600)}
 P.lock=true;
 P.onKey=ch=>{if(!shown||!alive())return;if(ch===' '||ch==='Enter'){if(ready)finish();else next()}};
 begin()}
ACT.mTeach=()=>{try{document.activeElement&&document.activeElement.blur()}catch(e){}replay()};
function replay(){
 if(P.stream!=='math'||screen!=='play'||P.phase!=='play'||P.mEnd||$('#mqt')||!P.Q)return;
 if(!hasTeach(P.mTid))return;
 const me=P;teach(P.mTid,()=>{})}

function allowedChars(p){
 const set=new Set(DIG);for(const c of String(p.a))set.add(c);if(p.ans==='money'||p.ans==='dec'){set.add('.')}
 return set}
function setKeys(p){
 try{const keys=new Set(['bksp','enter']);let sh=false;for(const c of allowedChars(p)){if(c===' ')continue;const k=keyInfo(c);k.keys.forEach(x=>keys.add(x));if(k.shift)sh=true}
  if(p.units)for(const u of p.units)for(const c of u)keys.add(c);
  setAvail(keys,sh)}catch(e){}}
function hintKey(){
 const p=P.Q[0];if(!p)return;const a=String(p.a),c=a[Math.min(P.typed.length,a.length-1)];
 if(c==null||c===' '){setTarget(null);$('#fhint').innerHTML='';return}
 try{setTarget(c);$('#fhint').innerHTML=fingerHTML(c)}catch(e){}}
function echoKey(ch){try{if(ch===' '){return}setTarget(ch);$('#fhint').innerHTML=fingerHTML(ch)}catch(e){}}

function render(mode){   // mode: undefined | 'ghost' | 'ok'
 const p=P.Q[0],mq=$('#mq');if(!p||!mq)return;
 const a=String(p.a),pure=/^\d+$/.test(a),typed=P.typed;
 if(mq._p!==p){   // new problem: rebuild all
  mq._p=p;const st=$('#strip'),H=st?st.clientHeight||100:100,W=st?st.clientWidth||600:600;
  mq.innerHTML='';const aid=aidEl(p,Math.floor(W*(String(p.q).length>10?.28:.4)),Math.max(30,H-14));
  if(aid)mq.appendChild(aid);
  const q=document.createElement('div');q.className='mq-q '+qSize(String(p.q));q.textContent=String(p.q);mq.appendChild(q);
  if(q.textContent.trim()==='?'&&aid){q.style.display='none'}
  const eq=document.createElement('div');eq.className='mq-eq';eq.textContent=/^(Type|Find|Press) /.test(p.q)||/[=]/.test(p.q)&&!/\?$/.test(p.q)&&!/[_□]/.test(p.q)?'':'=';
  if(/[=]/.test(p.q)||/[?]$/.test(String(p.q).trim())&&String(p.q).trim()!=='?')eq.style.display='none';
  mq.appendChild(eq);const an=document.createElement('div');an.className='mq-ans';mq.appendChild(an)}
 const an=mq.querySelector('.mq-ans');an.className='mq-ans'+(mode?' '+mode:'');
 const shown=mode==='ghost'?a:typed,slots=pure?Math.max(a.length,shown.length):Math.max(1,shown.length+1);
 let h='';for(let k=0;k<slots;k++){const c=shown[k];h+=`<b class="${c!=null?'f':''}${mode?'':(k===typed.length?' cur':'')}">${c!=null?esc(c===' '?' ':c):''}</b>`}
 an.innerHTML=h;
 P.text=a;P.pos=Math.min(typed.length,Math.max(0,a.length-1));
 const w=document.getElementById('h-acc');if(w){const asked=P.okN+P.mist.size;w.textContent=(asked?Math.round(P.okN/Math.max(1,asked)*100):100)+'%'}
 const cmb=document.getElementById('h-cmb');if(cmb)cmb.textContent=P.combo}

function showProblem(){
 const p=P.Q[0];if(!p)return finishRound();
 P.typed='';P.lock=false;P.last=performance.now();P.idx=(P.idx||0)+1;P.hinted=null;P.tries=0;
 render();setKeys(p);try{setTarget(null);$('#fhint').innerHTML=''}catch(e){}
 hpBar();
 if((p.world||1)<=3||!P.spokenOnce){P.spokenOnce=1}
 if((p.world||1)<=3)try{speak(spoken(p))}catch(e){}
}
function hpBar(){const left=P.Q.length,tot=Math.max(P.total,left);const b=$('#fbar');if(b)b.style.width=Math.round(left/tot*100)+'%'}

function onKey(ch){
 if((ch==='h'||ch==='H')&&P.phase==='play'&&!P.lock&&!P.mEnd&&P.Q&&P.Q.length&&!P.typed){replay();return}
 if(P.phase!=='play'||P.lock||!P.Q||!P.Q.length)return;
 const p=P.Q[0],a=String(p.a);if(!P.start)P.start=performance.now();P.last=performance.now();
 if(ch==='Backspace'){if(P.typed.length){P.typed=P.typed.slice(0,-1);render();try{sfx.click()}catch(e){}}return}
 if(ch==='Enter'||ch===' '){
  if(ch===' '&&P.typed.length&&a[P.typed.length]===' '&&a.indexOf(P.typed)===0){P.typed+=' ';render();return}
  if(P.typed.length)submit();return}
 if(typeof ch!=='string'||ch.length!==1)return;
 let c=ch;if(/[A-Z]/.test(c))c=c.toLowerCase();
 if(!allowedChars(p).has(c)&&!(p.units&&/[a-z²³]/.test(c)))return;
 if(P.typed.length>=a.length+(p.units?3:0))return;
 try{pressFx(c)}catch(e){}
 P.typed+=c;echoKey(c);render();try{sfx.click()}catch(e){}
 if(M.isComplete(P.typed,p)&&!(p.units&&0)){P.lock=true;setTimeout(()=>{if(P.phase!=='play')return;P.lock=false;submit()},160)}
}

function laserFor(c,big){try{const col=/[\d.\/:,\-r]/.test(c)?fcol(keyInfo(c).f):'#f0c860';zap(col,big)}catch(e){try{zap('#f0c860',big)}catch(_){}}}
function submit(){
 const p=P.Q[0];if(!p||P.phase!=='play')return;
 if(!P.typed.length)return;
 let ok=false;try{ok=M.check(P.typed,p)}catch(e){}
 P.lock=true;
 if(ok)right(p);else wrong(p)}

function right(p){
 const typed=P.typed.replace(/\s/g,'').split('');P.combo++;P.maxCombo=Math.max(P.maxCombo,P.combo);
 if(!p.miss&&p.orig)P.okN++;
 const big=P.combo%5===0;
 render('ok');
 (typed.length?typed:['1']).forEach((c,k)=>setTimeout(()=>{if(P.stream==='math')laserFor(c,big&&k===typed.length-1)},k*110));
 try{big?sfx.super():sfx.ok(P.combo)}catch(e){}
 const me=P,t=Math.max(1,typed.length)*110;
 setTimeout(()=>{if(P!==me)return;
  try{burst($('#arena'),$('#vil'),big?'#f0c860':'#7fd8d0',big?18:9);$('#hero')?.classList.remove('cheer');void $('#hero')?.offsetWidth;$('#hero')?.classList.add('cheer')}catch(e){}
  say(big?'Super zap!':P.combo%3===0?PRAISE[Math.floor(Math.random()*PRAISE.length)]:'Yes!');
  P.Q.shift();P.done++;hpBar();
  const delay=620;
  setTimeout(()=>{if(P!==me||P.phase!=='play')return;P.Q.length?showProblem():finishRound()},delay)},t);
}

function wrong(p){
 p.miss=(p.miss||0)+1;if(p.orig)P.mist.add(p.q);P.combo=0;P.tries++;
 try{sfx.bad()}catch(e){}
 try{const s=$('#strip');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');kick($('#vil'),'laugh')}catch(e){}
 try{const a=$('#arena'),h=$('#hero');if(a&&h){const ar=a.getBoundingClientRect(),hr=h.getBoundingClientRect(),sc=Math.max(2,Math.min(5,Math.round(hr.height/40))),im=document.createElement('img');im.className='mq-splat';im.src=splatImg();
  im.style.width=16*sc+'px';im.style.height=15*sc+'px';im.style.left=Math.round(hr.right-ar.left-8*sc)+'px';im.style.top=Math.round(hr.top-ar.top+hr.height*.25)+'px';a.appendChild(im);setTimeout(()=>im.remove(),700)}}catch(e){}
 const me=P;
 if(p.miss>=2){
  render('ghost');say('It is '+esc(p.a),true);try{speak('It is '+String(p.a).replace(/\./g,' point '))}catch(e){}hintKey();
  setTimeout(()=>{if(P!==me||P.phase!=='play')return;
   P.Q.shift();P.done++;
   if(!p.rq){const sim=genSimilar(p,P.total);if(sim){P.seen.add(sim.q);P.Q.push(sim);P.total++}}
   hpBar();P.Q.length?showProblem():finishRound()},1900);
  return}
 say('Try again!',true);
 setTimeout(()=>{if(P!==me||P.phase!=='play')return;P.typed='';P.lock=false;render();hintKey()},520);
}

function finishRound(){
 if(P.phase!=='play'||P.mEnd)return;
 try{const st=ensureStream();st.rn=(st.rn|0)+1}catch(e){}
 P.mEnd=1;P.onKey=null;   // phase stays 'play': a Boss Test hands over to the hybrid boss chase (KKS.hybridDone needs it); finishClassic sets 'done'
 const secs=P.start?(performance.now()-P.start)/1000:Math.max(1,P.len*3);
 K.finishClassic({len:P.len,ok:P.okN,secs});
}

/* leaving the play screen: the math strip and the keyboard filter go away */
try{const _sh=show;show=function(id){
 try{if(id!=='play'){const s=document.getElementById('strip');if(s)s.classList.remove('mq');const m=document.getElementById('mq');if(m)m.remove()}}catch(e){}
 return _sh.apply(this,arguments)};}catch(e){}
/* a typing round started after math: restore the strip */
try{const _br=beginRound;beginRound=function(){try{document.getElementById('strip')?.classList.remove('mq');document.getElementById('mq')?.remove()}catch(e){}return _br.apply(this,arguments)}}catch(e){}

window.MATHUI={aidEl,spoken};
})();
