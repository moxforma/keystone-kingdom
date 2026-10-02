/* Final-boss art (one per world) + Final Fantasy style boss battle presentation */
(function(){
const W=40,H=40,SC=40/64;
function grid(){return Array.from({length:H},()=>Array(W).fill(null))}
function T(g){const P=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c};
 const p=(x,y,c)=>P(x*SC,y*SC,c);
 return{p,P,
  ell(cx,cy,rx,ry,c){cx*=SC;cy*=SC;rx=Math.max(.6,rx*SC);ry=Math.max(.6,ry*SC);for(let y=Math.floor(cy-ry);y<=cy+ry+.5;y++)for(let x=Math.floor(cx-rx);x<=cx+rx+.5;x++){const dx=(x-cx)/(rx+.35),dy=(y-cy)/(ry+.35);if(dx*dx+dy*dy<=1)P(x,y,c)}},
  rect(x,y,w,h,c){const X=Math.round(x*SC),Y=Math.round(y*SC),w2=Math.max(1,Math.round(w*SC)),h2=Math.max(1,Math.round(h*SC));for(let j=0;j<h2;j++)for(let i=0;i<w2;i++)P(X+i,Y+j,c)},
  poly(pts,c){pts=pts.map(q=>[q[0]*SC,q[1]*SC]);let y0=1e9,y1=-1e9;pts.forEach(q=>{y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])});
   for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const xs=[];for(let k=0;k<pts.length;k++){const a=pts[k],b=pts[(k+1)%pts.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+(y+.5-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
    xs.sort((m,n)=>m-n);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.round(xs[k]);x<=Math.round(xs[k+1]-.01);x++)P(x,y,c)}},
  line(x0,y0,x1,y1,c,t=1){x0*=SC;y0*=SC;x1*=SC;y1*=SC;t=Math.max(1,Math.round(t*SC));const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*2)+1;for(let k=0;k<=n;k++){const x=x0+(x1-x0)*k/n,y=y0+(y1-y0)*k/n;for(let a=0;a<t;a++)for(let b=0;b<t;b++)P(x+a-(t>>1),y+b-(t>>1),c)}},
  clear(x,y,w,h){const X=Math.round(x*SC),Y=Math.round(y*SC);for(let j=0;j<Math.round(h*SC);j++)for(let i=0;i<Math.round(w*SC);i++){const a=X+i,b=Y+j;if(a>=0&&b>=0&&a<W&&b<H)g[b][a]=null}}}}
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const lerp=(c,d,f)=>{const a=hx(c),b=hx(d);return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*f).toString(16).padStart(2,'0')).join('')};
const mix=(c,f)=>f>0?lerp(c,'#fff8e0',f):lerp(c,'#1a0e38',-f);
/* hero-style ramp: H highlight, L light, B base, D shade, X deep shade (hue-shifted) */
const RAMP=(c,l)=>l===2?lerp(c,'#fffbe8',.5):l===1?lerp(c,'#fff2d0',.24):l===-1?lerp(c,'#2a1a5a',.3):l===-2?lerp(c,'#170c34',.52):c;
/* body: lit from top-left like the heroes, colored outline; fx: flat details, '~-'/'~+' shade what's below */
function render(body,fx,ol='#22142e'){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const B=grid(),F=grid(),O=grid();body(T(B));fx&&fx(T(F));
 const at=(x,y)=>y>=0&&x>=0&&y<H&&x<W?B[y][x]:null;
 const dist=(x,y,m,dx,dy)=>{for(let k=1;k<=4;k++)if(at(x+dx*k,y+dy*k)!==m)return k;return 9};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const m=B[y][x];if(!m)continue;
  const l=dist(x,y,m,-1,0),u=dist(x,y,m,0,-1),r=dist(x,y,m,1,0),d=dist(x,y,m,0,1);let lv=0;
  if(r===1||d===1)lv=-2;else if(r<=3||d===2)lv=-1;else if(u===1&&l<=3||l===1&&u<=2)lv=2;else if(l<=3||u<=2)lv=1;
  O[y][x]=RAMP(m,lv)}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let v=O[y][x];
  if(!v&&!B[y][x]&&(at(x-1,y)||at(x+1,y)||at(x,y-1)||at(x,y+1)))v=ol;
  const f=F[y][x];if(f){if(f[0]==='~'){if(O[y][x])v=RAMP(B[y][x],f[1]==='-'?-2:2)}else v=f}
  if(v){g.fillStyle=v;g.fillRect(x,y,1,1)}}
 return c}
const both=(f)=>{f(x=>x,1);f(x=>63-x,-1)};
const glyph={A:['010','101','111','101','101'],K:['101','110','100','110','101'],Z:['111','001','010','100','111'],Q:['010','101','101','111','011'],R:['110','101','110','101','101']};
const drawGlyph=(t,ch,x,y,c)=>glyph[ch].forEach((r,j)=>[...r].forEach((b,i)=>{if(b==='1')t.P(Math.round(x*SC)+i,Math.round(y*SC)+j,c)}));

const BOSS=[
 /* 1 Smudge: ink blob king with a giant quill */
 ()=>render(t=>{const I='#3a3470',G='#e8b830';
  [[14,46,14],[23,50,11],[41,49,13],[50,46,9]].forEach(([x,y,l])=>{t.rect(x-3,y,6,l,I);t.ell(x,y+l,3,3,I)});
  t.ell(32,40,23,18,I);t.ell(20,27,10,9,I);t.ell(44,26,10,9,I);t.ell(32,23,10,8,I);
  t.line(12,38,4,24,I,6);t.ell(4,21,5,4,I);t.line(52,40,58,30,I,6);t.ell(59,28,4,4,I);
  t.line(60,4,54,52,'#f0e6c8',4);t.poly([[60,2],[64,10],[58,20],[56,10]],'#f0e6c8');t.line(54,52,53,58,'#c8a040',3);
  t.poly([[18,18],[22,6],[27,14],[32,3],[37,14],[42,6],[46,18]],G);t.rect(18,16,28,5,G);
 },f=>{[[22,7],[32,4],[42,7]].forEach(([x,y])=>f.ell(x,y,1.6,1.6,'#e8384f'));f.ell(32,18,2,1.6,'#7fe8ff');
  [[24,35],[40,35]].forEach(([x,y])=>{f.ell(x,y,5,6,'#ffffff');f.ell(x+1,y+1,2.6,3.4,'#9a40ff');f.p(x+2,y,'#ffffff')});
  f.line(16,27,28,31,'#140c20',3);f.line(48,27,36,31,'#140c20',3);
  f.rect(22,46,20,6,'#140c20');for(let x=23;x<41;x+=4){f.rect(x,46,2,2,'#ffffff')}for(let x=25;x<41;x+=4)f.rect(x,50,2,2,'#ffffff');
  [[14,40],[36,56],[44,44]].forEach(([x,y])=>f.p(x,y,'~+'));[[6,56],[30,63],[62,58],[8,8],[2,44]].forEach(([x,y])=>f.ell(x,y,1.6,1.6,'#3a3470'))}),
 /* 2 Thornwick: vine witch */
 ()=>render(t=>{const R='#2f6a3a',V='#4a9a3a',K='#5a2a6a';
  t.poly([[32,26],[9,63],[55,63]],R);t.poly([[32,34],[25,63],[39,63]],'#5a3a20');
  for(let x=10;x<55;x+=6)t.poly([[x,63],[x+3,56],[x+6,63]],V);
  t.line(26,32,6,18,V,4);t.line(38,32,58,18,V,4);t.rect(22,36,20,3,V);
  t.poly([[22,16],[18,40],[26,30]],'#1e3a24');t.poly([[42,16],[46,40],[38,30]],'#1e3a24');
  t.ell(32,23,9,10,'#9ad07a');t.poly([[31,24],[33,24],[32,30]],'#7ab05a');
  t.ell(32,14,19,4,'#24402a');t.poly([[22,13],[42,13],[38,4],[50,0],[34,3]],'#24402a');t.rect(23,10,18,3,K);
 },f=>{[[27,22],[37,22]].forEach(([x,y])=>{f.rect(x-2,y-1,4,3,'#1a1010');f.rect(x-1,y,2,2,'#ff3a3a')});f.line(23,18,30,20,'#1a2a10',2);f.line(41,18,34,20,'#1a2a10',2);
  f.line(27,29,37,29,'#2a1a10',2);f.rect(34,30,2,2,'#ffffff');
  [[6,17],[58,17],[44,11]].forEach(([x,y])=>{f.ell(x,y,3,3,'#d8304a');f.p(x-1,y-1,'#ff9aa8')});
  [[20,46],[42,44],[30,56],[46,58],[16,58]].forEach(([x,y])=>{f.ell(x,y,2.4,2.4,'#d8304a');f.p(x,y,'#ff9aa8')});
  [[16,50],[22,40],[44,52],[38,40]].forEach(([x,y])=>f.line(x,y,x+3,y+6,'~-'))}),
 /* 3 Rumbletusk: storm yeti */
 ()=>render(t=>{const F='#dce8f6',S='#8aa8d0';
  both(m=>{t.poly([[m(22),18],[m(13),9],[m(11),0],[m(7),4],[m(8),12],[m(17),22]],'#a08a68');t.ell(m(7),32,7,10,F);t.ell(m(7),19,6,6,S)});
  t.ell(32,42,23,18,F);t.ell(32,23,15,13,F);t.ell(32,46,12,10,'#eef4fc');
  both(m=>{t.ell(m(20),61,6,3,S)});t.ell(32,27,10,8,S);
 },f=>{both(m=>{f.rect(m(28)-1,23,3,3,'#1a2440');f.rect(m(28),24,2,2,'#ffe46a');f.line(m(23),19,m(30),22,'#1a2440',2);
   f.poly([[m(27),32],[m(30),32],[m(26),41]],'#ffffff')});
  f.rect(26,31,12,3,'#1a2440');
  [[24,44],[32,47],[40,44],[28,52],[36,52]].forEach(([x,y])=>{f.line(x-2,y-2,x,y,'~-');f.line(x,y,x+2,y-2,'~-')});both(m=>[[5,16],[8,15],[11,16]].forEach(([x,y])=>f.rect(m(x),y-3,1.6,3,'#ffffff')));
  [[3,4,7,10,4,12,8,20],[58,2,62,8,58,10,62,18]].forEach(a=>{for(let k=0;k<a.length-2;k+=2)f.line(a[k],a[k+1],a[k+2],a[k+3],'#ffe46a',2)})}),
 /* 4 Captain Clatter: crab pirate */
 ()=>render(t=>{const C='#d8483a';
  both(m=>{for(let k=0;k<3;k++){t.line(m(21-k*3),49,m(10-k*3),55,C,3);t.line(m(10-k*3),55,m(8-k*3),63,C,3)}
   t.line(m(17),40,m(10),28,C,5);t.ell(m(9),20,9,11,C);t.poly([[m(9),9],[m(5),19],[m(13),19]],null)});
  t.ell(32,44,21,13,C);t.line(27,34,25,25,C,3);t.line(37,34,39,25,C,3);
  t.poly([[15,13],[49,13],[43,1],[32,5],[21,1]],'#2a2030');t.rect(16,11,32,3,'#f0c860');
 },f=>{f.ell(25,23,3.4,3.4,'#ffffff');f.rect(25,23,2,2,'#000000');f.ell(39,23,3.4,3.4,'#1a1010');f.line(34,15,44,19,'#1a1010',1);
  f.ell(32,6,2.6,2.6,'#ffffff');f.rect(30,6,1.6,1.6,'#000');f.rect(33,6,1.6,1.6,'#000');
  f.line(24,49,40,49,'#3a1010',2);f.p(22,47,'#3a1010');f.p(42,47,'#3a1010');f.rect(34,50,2,2,'#ffffff');
  [[22,38],[42,38],[32,40],[27,43],[37,43]].forEach(([x,y])=>f.ell(x,y,1.6,1.6,'~+'));[[6,60],[52,60],[60,44]].forEach(([x,y])=>{f.ell(x,y,2,2,'#f6d050')})}),
 /* 5 Mirage: sand genie */
 ()=>render(t=>{const S='#e8c070',A='#d8a858',Q='#5a3a9a';
  t.poly([[18,38],[46,38],[48,46],[42,52],[50,57],[54,50],[58,56],[52,63],[36,63],[28,55],[19,48]],S);t.poly([[10,52],[18,48],[22,56],[14,60]],S);
  t.ell(32,30,14,10,S);both(m=>t.ell(m(18),24,6,5,S));t.rect(21,37,22,4,Q);
  t.ell(32,15,9,10,A);both(m=>t.poly([[m(24),13],[m(17),8],[m(24),19]],A));
  t.line(16,26,38,35,A,6);t.line(48,26,26,35,A,6);
  t.ell(32,6,12,6,'#4ab8c8');t.ell(32,0,4,3,'#4ab8c8');t.poly([[40,5],[54,14],[58,32],[50,22],[42,11]],'#3a98a8');
 },f=>{f.ell(32,6,2.6,2.6,'#e83a3a');f.p(31,5,'#ffb0b0');f.ell(32,-1,1.4,1.4,'#f0c860');
  [[28,14],[36,14]].forEach(([x,y])=>f.rect(x-2,y,4,2,'#7fffe8'));f.line(25,11,30,13,'#4a2a10',2);f.line(39,11,34,13,'#4a2a10',2);
  f.line(25,20,31,19,'#6a4018',2);f.line(39,20,33,19,'#6a4018',2);f.poly([[29,22],[35,22],[32,29]],'#4a2a10');
  f.rect(20,27,3,5,'#f0c860');f.rect(42,27,3,5,'#f0c860');f.ell(32,39,2,1.8,'#f0c860');
  for(let k=0;k<44;k++){const a=k/44*Math.PI*2;if(k%3)f.p(32+Math.cos(a)*30,56+Math.sin(a)*6,'#f6e0a0')}
  [[6,14],[58,10],[4,40],[60,44]].forEach(([x,y])=>{f.line(x-3,y,x+3,y,'#f6e0a0',2);f.line(x-1,y+3,x+4,y+3,'#f6e0a0',2)})}),
 /* 6 Glacia: ice queen */
 ()=>render(t=>{const G='#9ad8f6',A='#e8f8ff';
  t.poly([[32,26],[8,63],[56,63]],G);t.poly([[32,34],[24,63],[40,63]],'#5a9ad0');
  both(m=>{t.poly([[m(24),26],[m(12),22],[m(16),30],[m(22),34]],'#bff0ff');t.poly([[m(23),14],[m(20),44],[m(27),36]],A)});
  t.ell(32,21,8,9,'#eef6ff');
  [[22,10],[27,4],[32,-2],[37,4],[42,10]].forEach(([x,y])=>t.poly([[x-3,14],[x,y],[x+3,14]],'#bff0ff'));t.rect(21,12,22,4,'#7fd0f0');
  t.line(52,14,53,63,'#6ab0d8',3);t.poly([[52,2],[57,9],[52,16],[47,9]],'#bff0ff');
 },f=>{[[28,21],[36,21]].forEach(([x,y])=>{f.rect(x-1.6,y-1,3.4,3,'#1a3a70');f.rect(x,y,1.6,1.6,'#7fe8ff')});f.line(30,26,34,26,'#6a8ab0',2);f.p(26,24,'#ffc0d0');f.p(38,24,'#ffc0d0');
  [[32,-1],[27,4],[37,4]].forEach(([x,y])=>f.ell(x,y+3,1.4,1.4,'#ffffff'));f.ell(32,13,1.8,1.6,'#2a8ae8');f.p(51,7,'#ffffff');
  [[22,46],[40,52],[30,40],[46,58],[16,58]].forEach(([x,y])=>f.p(x,y,'~+'));
  [[5,18],[59,28],[6,44],[12,6],[60,48]].forEach(([x,y])=>f.poly([[x,y-4],[x+2.6,y],[x,y+4],[x-2.6,y]],'#dff6ff'))}),
 /* 7 Sporegloom: mushroom sorcerer */
 ()=>render(t=>{
  t.poly([[20,24],[44,24],[52,63],[12,63]],'#4a2a6a');t.poly([[28,30],[36,30],[39,63],[25,63]],'#6a4a8a');
  t.line(22,32,8,44,'#4a2a6a',6);t.line(42,32,54,42,'#4a2a6a',6);t.ell(55,43,3,3,'#c8b8a0');
  t.line(8,30,8,63,'#7a5a30',3);t.ell(8,27,6,4,'#c8402a');
  t.ell(32,18,28,15,'#7a3aa0');t.clear(0,22,64,8);t.rect(8,21,48,4,'#3a1a50');t.rect(22,25,20,9,'#1e0e30');
 },f=>{[[17,11,3.4],[32,7,4.4],[47,12,3.4],[24,17,2.4],[40,17,2.4],[9,17,2],[55,17,2]].forEach(([x,y,r])=>{f.ell(x,y,r,r*.8,'#f0e070');f.p(x-1,y-1,'#fffbd0')});
  [[27,28],[37,28]].forEach(([x,y])=>{f.rect(x-1.6,y,3.6,2.4,'#a0ff60');f.p(x,y,'#e8ffd0')});f.line(28,32,36,32,'#5a8a30');
  for(let x=10;x<55;x+=4)f.line(x,21,x+1,24,'#5a2a7a');[[8,26],[5,28]].forEach(([x,y])=>f.ell(x,y,1.2,1.2,'#f0e070'));
  [[24,44],[40,50],[30,58]].forEach(([x,y])=>f.line(x,y,x+1,y+6,'~-'));
  [[3,8],[61,6],[59,36],[2,50],[48,30],[16,36],[60,58]].forEach(([x,y])=>f.ell(x,y,1.4,1.4,'#a0ff60'))}),
 /* 8 Gearjam: broken robot */
 ()=>render(t=>{const M='#8a96a8';
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;t.rect(32+Math.cos(a)*26-3,26+Math.sin(a)*26-3,7,7,'#c8983c')}t.ell(32,26,24,24,'#c8983c');t.ell(32,26,9,9,'#7a5a20');
  t.rect(14,52,36,11,'#3a3a48');t.rect(17,26,30,27,M);t.rect(21,9,22,17,'#a0aabc');t.line(32,9,32,2,'#a0aabc',2);
  both(m=>{t.ell(m(14),29,6,5,'#6a7488');t.rect(m(14)-(m(14)>32?5:0),31,6,14,M);t.poly([[m(11),44],[m(5),53],[m(11),50],[m(17),53],[m(17),44]],'#6a7488')});
  t.rect(47,10,5,12,'#5a5a68');
 },f=>{f.rect(23,14,18,7,'#1a1a28');f.rect(27,15,10,5,'#ff4040');f.rect(29,16,3,2,'#ffd0d0');f.line(38,14,35,20,'#1a1a28');f.ell(32,2,1.6,1.6,'#ff4040');
  for(let x=19;x<47;x+=6){f.ell(x,29,1,1,'#e0e6f0');f.ell(x,50,1,1,'#e0e6f0')}for(let x=18;x<48;x+=6)f.ell(x,58,2.6,2.6,'#5a5a68');
  f.rect(25,34,14,11,'#2a3040');f.rect(27,36,4,3,'#ffe46a');f.rect(33,38,4,5,'#7fe8ff');f.ell(49,7,3.4,2.6,'#b0b0b8');f.ell(53,2,2.6,2.2,'#c8c8d0');
  [[20,40],[44,36]].forEach(([x,y])=>f.line(x,y,x+3,y+4,'~-'))}),
 /* 9 Nimbus Rex: cloud dragon */
 ()=>render(t=>{const C='#eef4ff',Y='#f6e8a8';
  both(m=>{t.poly([[m(24),32],[m(2),4],[m(8),18],[m(0),26],[m(10),30],[m(3),42],[m(22),42]],'#a8bce0')});
  t.poly([[40,52],[58,50],[62,40],[56,46],[44,46]],C);
  t.ell(32,44,14,13,C);t.ell(32,46,7,10,Y);[[18,57,8],[32,59,9],[46,57,8]].forEach(([x,y,r])=>t.ell(x,y,r,r-3,'#d8e4f8'));
  both(m=>t.line(m(22),38,m(16),48,C,5));
  t.rect(28,24,8,14,C);t.ell(32,18,10,9,C);t.ell(32,27,8,5,C);
  both(m=>t.poly([[m(25),13],[m(18),-1],[m(29),10]],'#f0d060'));
 },f=>{both(m=>{f.line(m(24),31,m(5),8,'#7a8ac0');f.line(m(23),36,m(6),29,'#7a8ac0');f.rect(m(27)-1.6,15,3.4,3,'#1a2440');f.rect(m(27),16,1.6,1.6,'#ffe46a');f.line(m(22),12,m(29),15,'#1a2440',2)});
  f.rect(26,28,12,3,'#3a4a70');for(let x=27;x<38;x+=3)f.rect(x,28,1.6,2,'#ffffff');
  for(let y=40;y<54;y+=4)f.line(27,y,37,y,'#c8b060');both(m=>[48,50].forEach(y=>f.p(m(13),y,'#ffffff')));
  [[52,6,58,12,54,14,60,22],[10,46,6,52,10,53,4,60]].forEach(a=>{for(let k=0;k<a.length-2;k+=2)f.line(a[k],a[k+1],a[k+2],a[k+3],'#ffe46a',2)})}),
 /* 10 The Scrambler King */
 ()=>render(t=>{
  t.poly([[32,18],[0,63],[64,63]],'#3a1460');t.poly([[32,26],[10,63],[54,63]],'#a02030');
  both(m=>t.poly([[m(24),22],[m(12),8],[m(16),20],[m(10),16],[m(20),28]],'#3a1460'));
  t.poly([[23,26],[41,26],[46,63],[18,63]],'#2a2040');both(m=>t.ell(m(20),28,6,4,'#c8981e'));
  t.ell(32,20,8,9,'#1a1428');
  t.rect(21,8,23,5,'#f0c040');[21,26.5,32,37.5,43].forEach((x,k)=>t.poly([[x-3,9],[x,k===2?-1:2],[x+3,9]],'#f0c040'));
  t.line(53,8,51,63,'#c8981e',3);t.ell(13,40,4,4,'#1a1428');
 },f=>{[[28,19],[36,19]].forEach(([x,y])=>{f.rect(x-1.6,y,3.4,2.4,'#ff5040');f.p(x,y,'#ffd0a0')});f.line(26,16,30,18,'#ff5040');f.line(38,16,34,18,'#ff5040');
  f.rect(27,24,10,3,'#ff5040');for(let x=28;x<37;x+=3)f.rect(x,24,1.6,1.6,'#ffffff');
  [[24,10,'#e8384f'],[32,9,'#7fe8ff'],[40,10,'#5ad87a']].forEach(([x,y,c])=>{f.ell(x,y,1.8,1.6,c)});
  f.poly([[53,0],[58,6],[53,12],[48,6]],'#7fe8ff');f.p(52,4,'#ffffff');
  f.line(25,30,22,62,'#f0c040',2);f.line(39,30,42,62,'#f0c040',2);f.rect(28,38,8,8,'#f0c040');f.rect(30,40,4,4,'#7fe8ff');
  for(let y=34;y<62;y+=6)f.line(14,y,20,y+3,'~-');
  drawGlyph(f,'A',4,6,'#ffffff');drawGlyph(f,'K',58,26,'#ffffff');drawGlyph(f,'Z',6,30,'#7fe8ff');drawGlyph(f,'Q',58,48,'#f0c040');drawGlyph(f,'R',4,52,'#ffffff')})
,
 /* 11 Umbra: hooded shadow wraith of the Obsidian Rift */
 ()=>render(t=>{const C='#2e2a52',H='#3c3870',A='#4a4688';
  t.poly([[32,8],[14,30],[6,63],[58,63],[50,30]],C);
  t.line(18,32,5,46,C,7);t.line(46,32,59,46,C,7);t.ell(5,48,4,3,A);t.ell(59,48,4,3,A);
  t.ell(32,19,13,13,H);t.poly([[32,0],[24,10],[40,10]],H);
  for(let x=6;x<58;x+=9)t.clear(x+2,59,4,5);
 },f=>{f.ell(32,22,8,8,'#0e0a1c');
  [[28,21],[36,21]].forEach(([x,y])=>{f.rect(x-2,y-1,4,3,'#7fe8ff');f.p(x-1,y-1,'#ffffff')});
  f.line(28,27,30,26,'#7fe8ff');f.line(30,26,32,28,'#7fe8ff');f.line(32,28,34,26,'#7fe8ff');f.line(34,26,36,27,'#7fe8ff');
  for(let y=36;y<60;y+=6){f.line(22,y,20,y+4,'~-');f.line(42,y,44,y+4,'~-')}
  f.line(14,40,50,40,'#c8a040',2);[18,26,34,42].forEach(x=>f.rect(x,39,3,3,'#f0c860'));
  f.ell(60,52,4,4,'#7fe8ff');f.p(59,51,'#ffffff');
  drawGlyph(f,'Q',4,8,'#7fe8ff');drawGlyph(f,'Z',56,14,'#9a8ad8');drawGlyph(f,'R',2,30,'#7fe8ff');drawGlyph(f,'K',56,30,'#ffffff')}),
 /* 12 Eclipsar: the eclipse dragon on the Eclipse Throne */
 ()=>render(t=>{const D='#3e3480',W='#2c2460',B='#d8a848';
  t.ell(32,16,17,15,'#e89a30');
  both(m=>t.poly([[m(24),34],[m(2),8],[m(8),26],[m(0),34],[m(10),38],[m(4),48],[m(22),46]],W));
  t.ell(32,48,13,15,D);t.ell(32,52,7,10,B);
  t.poly([[40,58],[56,63],[60,56],[50,54]],D);
  t.rect(27,26,10,12,D);t.ell(32,20,10,9,D);t.ell(32,28,7,4,'#4e449a');
  both(m=>t.poly([[m(25),14],[m(18),2],[m(28),12]],'#e8dcc0'));
  both(m=>t.ell(m(23),58,4,4,D));
 },f=>{f.ell(32,16,12,10,'~-');
  [[28,19],[36,19]].forEach(([x,y])=>{f.rect(x-2,y,4,2,'#ff5040');f.p(x,y,'#ffe080')});f.line(25,16,30,18,'#140c20',2);f.line(39,16,34,18,'#140c20',2);
  f.rect(27,29,10,2,'#140c20');[28,31,34].forEach(x=>f.rect(x,29,2,2,'#ffffff'));
  for(let y=46;y<62;y+=4)f.line(27,y,37,y,'~-');
  [[6,4],[58,4],[2,22],[62,22],[14,60],[50,14]].forEach(([x,y])=>f.ell(x,y,1.4,1.4,'#fff6e0'));
  drawGlyph(f,'A',4,44,'#f0c860');drawGlyph(f,'Z',56,40,'#ffffff')})
];
window.FBOSS_URL=w=>kku('fboss'+w,()=>BOSS[w-1]());

/* is this stage a world's final boss? */
const isFinal=(i,s)=>s===NST-1&&typeof worldLast==='function'&&i===worldLast(worldOf(i));
window.isFinalBoss=isFinal;
const _vs=villainSVG;villainSVG=function(i,boss){if(typeof P!=='undefined'&&boss&&!P.mode&&!P.practice&&isFinal(i,P.s))
 return `<svg class="gl fbart" viewBox="0 0 40 40" aria-hidden="true" style="overflow:visible;image-rendering:pixelated"><image href="${FBOSS_URL(worldOf(i))}" width="40" height="40"/></svg>`;return _vs.apply(this,arguments)};

function fbIntro(w){const ar=document.querySelector('#arena');if(!ar||!ar.classList.contains('finalboss'))return;
 if(document.querySelector('#lsplash')||!$('#modal').hidden)return setTimeout(()=>fbIntro(w),300);
 const st=(typeof STORY!=='undefined'&&STORY[w-1])||{boss:'Boss',bt:''};
 const el=document.createElement('div');el.className='fb-intro';el.innerHTML=`<div class="fb-flash"></div><div class="fb-card"><span>⚔ FINAL BOSS ⚔</span><b>${esc(st.boss.toUpperCase())}</b><small>${esc(st.bt)}</small></div>`;
 ar.appendChild(el);ar.classList.add('shake');try{sfx.bad&&sfx.bad()}catch(e){}setTimeout(()=>ar.classList.remove('shake'),600);setTimeout(()=>el.remove(),2600)}
const _br=beginRound;beginRound=function(){const r=_br.apply(this,arguments);try{const ar=$('#arena');if(ar)ar.classList.remove('finalboss');
 if(!P.mode&&!P.practice&&isFinal(P.i,P.s)&&ar){const w=worldOf(P.i);ar.classList.add('finalboss','fbw'+w);$('#vil')?.classList.add('fb');
  const fm=ar.querySelector('.fmeter');if(fm&&!fm.querySelector('.hp'))fm.insertAdjacentHTML('afterbegin','<span class="hp">HP</span>');
  if(!ar.querySelector('.fb-aura'))ar.insertAdjacentHTML('afterbegin','<div class="fb-aura"></div>');setTimeout(()=>fbIntro(w),200)}}catch(e){}return r};
})();
