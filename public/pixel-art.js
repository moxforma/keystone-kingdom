const PX=(()=>{
/* Keylori pixel-art engine: shapes on a grid -> auto shading + colored outlines */
function shadeHex(h,a){const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return '#'+((1<<24)|(f(n>>16)<<16)|(f(n>>8&255)<<8)|f(n&255)).toString(16).slice(1)}
let MID=0;
const M=(b,o)=>({id:++MID,b,l:shadeHex(b,.32),d:shadeHex(b,-.28),o:o||shadeHex(b,-.68)});
const F=c=>({id:++MID,b:c,l:c,d:c,o:shadeHex(c,-.6),flat:1});
class Spr{
 constructor(w=32,h=32,k=2){this.k=k;this.w=w*k;this.h=h*k;this.g=new Array(this.w*this.h).fill(null);this.S=1;this.ox=16;this.oy=31}
 form(f){this.S=[.72,.86,1][f];return this}
 X(x){return this.ox+(x-this.ox)*this.S} Y(y){return this.oy+(y-this.oy)*this.S}
 iX(x){return this.ox+(x-this.ox)/this.S} iY(y){return this.oy+(y-this.oy)/this.S}
 raw(x,y,m){if(x>=0&&y>=0&&x<this.w&&y<this.h)this.g[y*this.w+x]=m}
 set(x,y,m){const k=this.k;x=Math.round(this.X(x));y=Math.round(this.Y(y));for(let j=0;j<k;j++)for(let i=0;i<k;i++)this.raw(x*k+i,y*k+j,m)}
 get(x,y){return x>=0&&y>=0&&x<this.w&&y<this.h?this.g[y*this.w+x]:null}
 ell(cx,cy,rx,ry,m){const k=this.k;cx=this.X(cx);cy=this.Y(cy);rx*=this.S;ry*=this.S;for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){const dx=((x+.5)/k-cx)/rx,dy=((y+.5)/k-cy)/ry;if(dx*dx+dy*dy<=1)this.raw(x,y,m)}return this}
 rect(x,y,w,h,m){return this.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],m)}
 poly(p,m){const k=this.k;p=p.map(([a,b])=>[this.X(a),this.Y(b)]);for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){let c=false;const px=(x+.5)/k,py=(y+.5)/k;for(let i=0,j=p.length-1;i<p.length;j=i++){const[xi,yi]=p[i],[xj,yj]=p[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))c=!c}if(c)this.raw(x,y,m)}return this}
 line(x0,y0,x1,y1,m,t=1){x0=this.X(x0);y0=this.Y(y0);x1=this.X(x1);y1=this.Y(y1);t*=this.S;const k=this.k,n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*k*2||1,T=Math.max(1,Math.round(t*k));for(let s=0;s<=n;s++){const x=(x0+(x1-x0)*s/n)*k,y=(y0+(y1-y0)*s/n)*k;for(let a=0;a<T;a++)for(let b=0;b<T;b++)this.raw(Math.floor(x)+a,Math.floor(y)+b,m)}return this}
 px(list,m){list.forEach(([x,y])=>this.set(x,y,m));return this}
 recolor(from,to,pred){const k=this.k;for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++)if(this.get(x,y)===from&&pred(Math.floor(this.iX(x/k)),Math.floor(this.iY(y/k))))this.raw(x,y,to);return this}
 mirror(fn,axis){const tmp=new Spr(this.w/this.k,this.h/this.k,this.k);tmp.S=this.S;fn(tmp);axis=this.X(axis);for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){const m=tmp.get(x,y);if(m){this.raw(x,y,m);this.raw(2*axis*this.k-1-x,y,m)}}return this}
 colors(){const W=this.w,H=this.h,out=new Array(W*H).fill(null);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const m=this.get(x,y);
   if(m){out[y*W+x]=m.b;continue}
   const n=[[0,1],[0,-1],[1,0],[-1,0]].map(([a,b])=>this.get(x+a,y+b)).find(Boolean);if(n)out[y*W+x]=n.o}
  // inner lines between different materials (non-flat): draw outline on the lower/right part's border
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const m=this.get(x,y);if(!m||m.flat)continue;const u=this.get(x,y-1),l=this.get(x-1,y);if((u&&u!==m&&!u.flat&&u.line!==m.id&&!m.noline)||(l&&l!==m&&!l.flat&&!m.noline))out[y*W+x]=m.o}
  return out}
 canvas(scale=4){const c=document.createElement('canvas');c.width=this.w*scale;c.height=this.h*scale;const g=c.getContext('2d');const col=this.colors();
  col.forEach((v,i)=>{if(v){g.fillStyle=v;g.fillRect((i%this.w)*scale,Math.floor(i/this.w)*scale,scale,scale)}});return c}
 url(scale=4){return this.canvas(scale).toDataURL()}
}
const EYE=(s,x,y,iris,h=3)=>{const k=s.k,X=Math.round(s.X(x)*k),Y=Math.round(s.Y(y)*k),W=Math.round(2.6*k),Hh=Math.round((h+.6)*k),dk=F('#16121e'),wh=F('#ffffff'),ir=F(iris);
 for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){const corner=(i===0||i===W-1)&&(j===0||j===Hh-1);if(!corner)s.raw(X+i,Y+j,dk)}
 for(let j=Math.ceil(Hh*.55);j<Hh-1;j++)for(let i=1;i<W-1;i++)s.raw(X+i,Y+j,ir);
 s.raw(X+1,Y+1,wh);s.raw(X+2,Y+1,wh);s.raw(X+1,Y+2,wh);s.raw(X+2,Y+2,wh);s.raw(X+W-2,Y+Hh-2,wh);return s};
/* ---------- SPRITES (32-unit design grid, rendered 64x64) ---------- */
const W_=F('#ffffff'),MO=F('#7a1a2a'),TG=F('#ff8aa6');
const mouth=(s,x,y,w=4)=>{for(let i=0;i<w;i++)s.set(x+i,y,MO);for(let i=1;i<w-1;i++)s.set(x+i,y+1,TG);return s};
const smile=(s,x,y,c='#2a1430')=>{const m=F(c);s.px([[x,y],[x+1,y+1],[x+2,y+1],[x+3,y]],m);return s};
const blushP=(s,pts)=>s.px(pts,F('#ff8fb4'));
const star=(cx,cy,r)=>{let p=[];for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;p.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr])}return p};

const SPECIES_SPR=[
/*0 Sproutle*/ f=>{const s=new Spr().form(f),P=M('#ffa8c8','#7a2a52'),Wb=M('#fff0f6','#7a2a52'),G=M('#7ddc6a','#1f5a2a'),Fl=F('#ffd23a');
  s.ell(24,25,4.5,3.2,P).px([[27,21],[29,21],[28,20],[28,22]],W_).set(28,21,Fl);
  s.ell(12,29.5,2.5,1.5,P).ell(20,29.5,2.5,1.5,P).ell(16,23,6.5,6.5,P).ell(16,24.5,3.5,4,Wb);
  s.line(10,21,6,16,P,2).line(21,21,25,16,P,2);
  s.mirror(t=>{t.poly([[8,9],[1,4],[1,7],[5,10]],G);t.poly([[7,12],[0,11],[0,14],[7,14]],G);t.poly([[8,16],[1,18],[2,20],[8,17]],G);if(f>0)t.poly([[9,7],[5,1],[4,3],[8,8]],G)},16);
  s.ell(16,13,9.5,7,P);if(f>0)s.px([[12,8],[20,8],[16,7]],F('#ffd0e4'));
  if(f===2){[[11,5],[16,4],[21,5]].forEach(([x,y])=>{s.px([[x-1,y],[x+1,y],[x,y-1],[x,y+1]],W_).set(x,y,Fl)})}
  EYE(s,11,11,'#4a1a50');EYE(s,19,11,'#4a1a50');mouth(s,14,16);blushP(s,[[9,15],[23,15]]);return s},
/*1 Drizzit*/ f=>{const s=new Spr().form(f),B=M('#4fa6f2','#123a78'),Wb=M('#f2f9ff','#3a5a88'),H=M('#fff1c8','#7a5a1a');
  s.poly([[23,25],[30,21],[29,28],[24,29]],B);
  s.line(16,10,f?20:19,f?-1:2,H,2);s.recolor(H,M('#d8b25a','#7a5a1a'),(x,y)=>y%3===0);
  if(f===2)s.poly([[18,10],[24,6],[23,12]],M('#2f7ed0','#123a78'));
  s.ell(16,20,9.5,10,B).ell(16,24,6,5.5,Wb).poly([[8,19],[2,12],[4,11],[10,16]],B).poly([[24,19],[30,12],[28,11],[22,16]],B);
  if(f>0)s.px([[10,24],[11,25],[21,25],[22,24]],F('#2f7ed0'));
  EYE(s,11,15,'#2a5ab8');EYE(s,19,15,'#2a5ab8');mouth(s,14,20);blushP(s,[[9,19],[23,19]]);
  [[3,6],[28,4]].forEach(([x,y])=>s.px([[x,y-1],[x-1,y],[x+1,y],[x,y+1]],F('#dff4ff')));return s},
/*2 Zipp*/ f=>{const s=new Spr().form(f),T=M('#35cbc2','#0a4448'),Wb=M('#d8fff9','#2a6a66'),Y=M('#ffd23a','#6b4200'),O=F('#f39a2a'),Gr=F('#dfe6f2');
  s.poly(f?[[8,12],[5,2],[10,7],[10,0],[14,7],[15,1],[17,8],[21,2],[20,12]]:[[9,12],[7,4],[11,8],[11,2],[14,8],[15,3],[17,9],[20,4],[19,12]],Y);
  if(f===2)s.poly([[4,22],[0,16],[3,17],[1,11],[6,19]],Y);
  s.line(12,26,12,30,O).line(18,26,20,30,O).px([[11,30],[13,30],[21,30],[19,30]],O);
  s.ell(15,19,9.5,8.5,T).ell(14,22,5.5,4,Wb).poly(f===2?[[18,18],[28,11],[25,21]]:[[18,18],[25,14],[24,21]],T);
  s.poly([[23,15],[29,17],[29,19],[23,18]],Y).px([[30,16],[31,16],[30,19],[31,19]],Gr).px([[6,18],[7,17],[8,18],[7,19],[8,20]],Y);
  EYE(s,11,16,'#135a60');EYE(s,17,15,'#135a60');return s},
/*3 Pebbo*/ f=>{const s=new Spr().form(f),T=M('#dcaa78','#3e2614'),Wb=M('#fbe8ce','#6b4a2a'),R=M('#98a1b5','#262a36'),K=M('#cda2ff','#3a1670');
  s.line(6,22,2,17,T,2).ell(2,16,2.4,2.4,R);if(f===2)s.px([[0,14],[4,14],[2,13]],R);
  s.rect(6,24,3,6,T).rect(19,25,3,5,T).ell(14,21,10,6.5,T).ell(14,25,7,2,Wb);
  s.ell(7,16,2.5,2.2,R).ell(11,14.5,2.6,2.4,R).ell(15.5,14,2.6,2.4,R).ell(20,15,2.4,2.2,R);
  s.poly([[13,13],[14,7],[16,13]],K).poly([[16,13],[18,9],[18,14]],K);if(f>0)s.poly([[9,14],[9,9],[11,13]],K);if(f===2)s.poly([[19,14],[22,8],[22,15]],K);
  s.rect(11,26,3,4,T).rect(15,26,3,4,T).ell(25,20,6,5,T).poly([[22,16],[23,13],[25,16]],R).poly([[27,16],[29,13],[29,17]],R);
  if(f===2)s.poly([[29,19],[32,17],[30,21]],R);
  EYE(s,22,17,'#5a3a1a');EYE(s,26.5,17,'#5a3a1a');mouth(s,25,22);s.set(21,21,F('#ff9fae'));return s},
/*4 Embit*/ f=>{const s=new Spr().form(f),R=M('#dd5a2c','#43170a'),C=M('#fff1dc','#6b3a1a'),D=M('#4d2618','#1e0904'),A=M('#ffb33a','#6b2a00'),Fl=M('#ffd84a','#8a3a00');
  if(f===2)s.ell(15.5,11,11,9,M('#ff9a1f','#6b2a00'));
  s.ell(25,17,5,9,R).ell(26,9,3.5,3,R);s.recolor(R,A,(x,y)=>y===11||y===16||y===21);
  s.rect(11,24,3,6,D).rect(17,24,3,6,D).ell(15.5,22,6.5,6.5,R).ell(15.5,24,3,3,D);
  s.line(8,19,4,13,D,2).line(21,20,24,19,D,2);
  s.poly([[8,9],[8,3],[13,7]],R).poly([[23,9],[23,3],[18,7]],R).px([[9,6],[9,7],[22,6],[22,7]],C).px([[8,2],[8,1],[23,2],[23,1]],Fl);
  s.ell(15.5,12,8.5,7,R).ell(10,14.5,2.4,2,C).ell(21,14.5,2.4,2,C).ell(15.5,15.5,3.2,2.2,C).px([[12,8],[19,8]],C);
  if(f>0)s.px([[6,22],[25,24],[14,4]],A);
  EYE(s,11.5,10,'#6a2e14',2.4);EYE(s,17.5,10,'#6a2e14',2.4);s.px([[15,13],[16,13]],F('#2a0e06'));mouth(s,14,15);return s},
/*5 Glintle crystal snail*/ f=>{const s=new Spr().form(f),B=M('#c7b8ff','#3a2a7a'),C=M('#8ff0ff','#1a4a7a'),C2=M('#d8fbff','#1a4a7a');
  s.poly([[3,30],[27,30],[29,26],[24,22],[8,25]],B);
  s.line(24,22,22,13,B,1).line(27,22,28,13,B,1);
  s.poly([[5,25],[7,13],[13,6],[20,9],[22,24]],C).poly([[9,22],[10,14],[14,9],[17,12],[16,22]],C2);
  if(f>0)s.poly([[13,7],[14,1],[16,8]],C);if(f===2)s.poly([[7,14],[3,8],[9,12]],C).poly([[19,10],[23,4],[21,12]],C);
  s.ell(25,24,4,3.5,B);EYE(s,21,10,'#3a2a7a',2.6);EYE(s,27,10,'#3a2a7a',2.6);smile(s,24,26);return s},
/*6 Duskit shadow moth*/ f=>{const s=new Spr().form(f),B=M('#4b3a8a','#140a30'),Wg=M('#8a6be0','#1e1050'),Y=F('#ffe27a'),Fz=M('#c9b8ff','#1e1050');
  const ws=f===2?1.25:1;s.ell(7,15,7*ws,8*ws,Wg).ell(25,15,7*ws,8*ws,Wg).ell(9,25,4,4,Wg).ell(23,25,4,4,Wg);
  s.ell(7,14,2.5,2.5,Y).ell(25,14,2.5,2.5,Y);s.ell(8,13,2,2,Wg).ell(24,13,2,2,Wg);
  if(f>0)s.px([[4,19],[28,19],[5,10],[27,10]],Y);
  s.ell(16,21,4.5,7,B).line(14,8,11,3,B).line(18,8,21,3,B).px([[11,2],[21,2]],Y);
  s.ell(16,11,5.5,4.5,Fz);if(f===2)s.poly([[14,6],[16,3],[18,6],[16,5]],Y);
  EYE(s,12.5,9.5,'#4b3a8a',2.4);EYE(s,17,9.5,'#4b3a8a',2.4);smile(s,14.5,13,'#2a1450');return s},
/*7 Breezle cloud lamb*/ f=>{const s=new Spr().form(f),C=M('#f6fbff','#4a6a9a'),Fc=M('#a9c4e8','#2a4a7a'),Lg=M('#8aa8d8','#2a4a7a'),Rb=['#ff6b7a','#ffd23a','#4de08a','#3ea6ff'];
  if(f===2)Rb.forEach((c,i)=>s.line(0,24+i,6,20+i,F(c),1));
  s.rect(9,24,2,6,Lg).rect(13,25,2,5,Lg).rect(18,25,2,5,Lg).rect(22,24,2,6,Lg);
  [[10,18,5],[16,15,6],[22,18,5],[13,22,5],[20,22,5]].forEach(([x,y,r])=>s.ell(x,y,r,r*.9,C));
  if(f>0)s.poly([[5,14],[0,10],[2,15]],C).poly([[27,14],[32,10],[30,15]],C);
  s.ell(16,15,5,4.5,Fc).ell(10,13,2.4,1.3,Fc).ell(22,13,2.4,1.3,Fc);
  if(f>0){s.ell(11,9,2.3,2.3,M('#ffe9a8','#6b5a20')).ell(21,9,2.3,2.3,M('#ffe9a8','#6b5a20'))}
  s.ell(16,8,4,3,C);EYE(s,12.5,13,'#2a3a6a',2.4);EYE(s,17,13,'#2a3a6a',2.4);smile(s,14.5,17,'#2a3a6a');return s},
/*8 Frostby snow hare*/ f=>{const s=new Spr().form(f),Wh=M('#f4fbff','#2a4a7a'),I=M('#8fdcff','#1a4a7a'),P=F('#ff9fbe');
  s.poly([[10,11],[8,0],[13,9]],Wh).poly([[22,11],[24,0],[19,9]],Wh).poly([[9,4],[8,0],[11,3]],I).poly([[23,4],[24,0],[21,3]],I);
  if(f===2){s.poly([[8,4],[3,0],[6,5]],I).poly([[24,4],[29,0],[26,5]],I)}
  s.ell(11,29.5,3,1.5,Wh).ell(21,29.5,3,1.5,Wh).ell(16,23,7,7,Wh).ell(16,25,4,4,M('#dff2ff','#2a4a7a')).ell(24,24,2.5,2.5,Wh);
  if(f>0)s.rect(9,17,14,2,I).px([[10,19],[13,19],[16,19],[19,19],[22,19]],I);
  s.ell(16,13,6.5,5.5,Wh);EYE(s,12.5,11,'#1a5aa8');EYE(s,17.5,11,'#1a5aa8');s.set(15.5,15,P);smile(s,14.5,16,'#2a4a7a');blushP(s,[[10,15],[22,15]]);return s},
/*9 Twinkit star jelly*/ f=>{const s=new Spr().form(f),D=M('#6f6cff','#1e1a6a'),Y=F('#ffd84a'),Pk=M('#ff9fd8','#6a1a5a');
  const n=f?6:4;for(let i=0;i<n;i++){const x=9+i*(14/(n-1));s.line(x,18,x+(i%2?1:-1),24,Pk).line(x+(i%2?1:-1),24,x,29,Pk)}
  s.ell(16,13,10,8,D);s.rect(5,18,22,3,null);s.ell(16,17,10,2,D);
  s.poly(star(10,9,2),Y).poly(star(22,8,1.6),Y).px([[17,6],[25,13]],Y);
  if(f===2){s.poly(star(16,3,3),Y);s.px([[8,3],[24,2]],Y)}
  EYE(s,12,11,'#1e1a6a');EYE(s,18,11,'#1e1a6a');mouth(s,15,15,3);return s},
/*10 Beetix beetle*/ f=>{const s=new Spr().form(f),G=M('#4fd17a','#124a2a'),Hd=M('#2a5a4a','#0a2018'),Y=F('#ffd23a'),L=F('#1a3a2a');
  [[18,9,24],[21,10,26],[24,11,25]].forEach(([y,a,b])=>{s.line(a,y,a-4,y+3,L);s.line(32-a,y,36-a,y+3,L)});
  if(f===2)s.ell(6,15,5,7,M('#c8f0ff','#2a5a6a')).ell(26,15,5,7,M('#c8f0ff','#2a5a6a'));
  s.ell(16,20,9,9,G).line(16,12,16,29,F('#124a2a'));s.px([[12,18],[20,18],[11,23],[21,23],[14,26],[18,26]],Y);
  s.ell(16,10,6,4.5,Hd);s.poly(f===2?[[15,7],[16,-1],[18,7]]:f?[[15,7],[16,2],[17,7]]:[[15,7],[16,4],[17,7]],M('#ffd23a','#6b4200'));
  EYE(s,12.5,9,'#4fd17a',2.4);EYE(s,17.5,9,'#4fd17a',2.4);return s},
/*11 Wispy ghost*/ f=>{const s=new Spr().form(f),Gh=M('#ece8ff','#3a2a7a'),Ln=M('#ffd23a','#6b4200'),Gl=F('#fff3a8');
  s.ell(16,13,8.5,8.5,Gh).rect(7.5,13,17,11,Gh).poly([[7.5,24],[10,28],[12,24],[14,28],[16,24],[18,28],[20,24],[22,28],[24.5,24]],Gh);
  s.line(23,19,27,20,Gh,2);s.rect(26,20,4,6,Ln).rect(27,21,2,4,Gl);if(f>0)s.px([[25,24],[31,24],[28,27],[28,18]],Gl);
  if(f===2)s.poly([[10,6],[10,2],[13,4],[16,1],[19,4],[22,2],[22,6]],Ln);
  EYE(s,11.5,11,'#3a2a7a',3.4);EYE(s,17.5,11,'#3a2a7a',3.4);smile(s,14.5,17,'#3a2a7a');blushP(s,[[10,16],[22,16]]);return s},
/*12 Cogby robot*/ f=>{const s=new Spr().form(f),Mt=M('#b8c2d6','#2a3248'),Dk=M('#24304a','#0a0e1a'),Cy=F('#3ee6ff'),Y=M('#ffd23a','#6b4200');
  s.line(16,6,16,2,Mt).ell(16,1.5,1.5,1.5,M('#ff5d8f','#6a1a3a'));
  s.rect(10,25,4,5,Mt).rect(18,25,4,5,Mt);if(f>0)s.px([[10,30],[13,30],[18,30],[21,30]],F('#ff9a1f'));
  s.rect(10,16,12,10,Mt).ell(16,21,2.5,2.5,Y).line(10,18,6,23,Mt,2).line(22,18,26,23,Mt,2);
  if(f===2)s.rect(4,15,5,4,Y).rect(23,15,5,4,Y);
  s.rect(8,5,16,11,Mt).rect(10,7,12,7,Dk).rect(12,9,2,3,Cy).rect(18,9,2,3,Cy).px([[14,12],[15,13],[16,13],[17,12]],Cy);return s},
/*13 Dunelet meerkat*/ f=>{const s=new Spr().form(f),S=M('#e0b060','#4a3010'),L=M('#fff0c8','#4a3010'),D=F('#5a3a1a');
  s.line(21,28,26,24,S,2).line(26,24,27,18,S,1.5);
  if(f===2)s.poly([[9,14],[23,14],[25,30],[7,30]],M('#d94a3a','#4a1010'));
  s.ell(12,29.5,2.5,1.4,S).ell(20,29.5,2.5,1.4,S).ell(16,21,5.5,8.5,S).ell(16,23,3,6,L);
  s.line(12,17,13,22,S,1.5).line(20,17,19,22,S,1.5);
  if(f>0)s.rect(11,15,10,2,F('#3ea6ff'));
  s.ell(16,10,5.5,5,S).ell(10.5,9,1.5,1.8,S).ell(21.5,9,1.5,1.8,S).ell(16,12.5,2.5,2,L);
  s.px([[12,8],[12,10],[19,8],[19,10]],D);EYE(s,12.5,8,'#1a0a00',2.4);EYE(s,17.5,8,'#1a0a00',2.4);s.set(16,11,D);smile(s,14.5,13,'#4a3010');return s},
/*14 Fizzlet cupcake*/ f=>{const s=new Spr().form(f),Wr=M('#7fe0c8','#1a5a4a'),Fr=M('#ff9fd0','#7a1a52'),Ch=M('#ff3d5a','#5a0a1a');
  if(f===2)s.ell(5,17,4,5,M('#d8f4ff','#2a5a7a')).ell(27,17,4,5,M('#d8f4ff','#2a5a7a'));
  s.poly([[8,21],[24,21],[22,30],[10,30]],Wr);s.recolor(Wr,M('#5cc8b0','#1a5a4a'),(x,y)=>x%3===0);
  s.ell(16,18,9,5,Fr).ell(16,13,6.5,4,Fr).ell(16,9,3.5,2.6,Fr);
  [[10,17,'#ffd23a'],[21,16,'#3ea6ff'],[13,12,'#4de08a'],[19,11,'#ffffff'],[22,19,'#ffd23a']].forEach(([x,y,c])=>s.set(x,y,F(c)));
  if(f>0)s.ell(16,5.5,2,2,Ch).line(16,4,18,1,F('#4a8a2a'));
  if(f===2)s.poly([[11,8],[11,5],[13,7],[16,4],[19,7],[21,5],[21,8]],M('#ffd23a','#6b4200'));
  EYE(s,12,22.5,'#5a1a3a',2.4);EYE(s,17.5,22.5,'#5a1a3a',2.4);smile(s,14.5,26.5,'#1a5a4a');return s},
/*15 Rumblet storm dragon*/ f=>{const s=new Spr().form(f),B=M('#5f7dff','#16226a'),C=M('#f4f8ff','#3a4a7a'),Y=M('#ffd23a','#6b4200'),Bl=M('#c8d4ff','#16226a');
  s.line(10,25,3,22,B,2).poly([[1,23],[4,18],[3,21],[6,20],[2,25]],Y);
  if(f>0)s.poly(f===2?[[12,16],[2,6],[5,15],[1,17]]:[[12,17],[6,11],[7,17]],Bl).poly(f===2?[[20,16],[30,6],[27,15],[31,17]]:[[20,17],[26,11],[25,17]],Bl);
  s.ell(12,29.5,2.5,1.5,B).ell(20,29.5,2.5,1.5,B).ell(16,23,7,7,B).ell(16,25,4,4.5,Bl);
  [[9,17],[12,15],[16,14.5],[20,15],[23,17]].forEach(([x,y])=>s.ell(x,y,2.3,2,C));
  s.ell(16,10,6.5,5.5,B).poly([[11,6],[9,1],[13,5]],Y).poly([[21,6],[23,1],[19,5]],Y);if(f===2)s.poly([[15,5],[16,0],[18,5]],Y);
  EYE(s,12,8.5,'#ffd23a');EYE(s,17.5,8.5,'#ffd23a');mouth(s,14.5,13);return s},
/*16 Bubbly octopus*/ f=>{const s=new Spr().form(f),O=M('#2cc4bc','#0a4a48'),Sp=F('#ffb4a2'),Cr=M('#ff6f8f','#6a1a2a');
  for(let i=0;i<6;i++){const x=7+i*3.6;s.line(x,18,x+(i<3?-2:2),25,O,2).line(x+(i<3?-2:2),25,x+(i<3?-1:1),29,O,1.5)}
  s.ell(16,13,10,9,O).px([[9,9],[23,8],[21,15]],Sp);
  if(f>0)[[3,6],[29,10],[27,3]].forEach(([x,y])=>s.px([[x,y-1],[x-1,y],[x+1,y],[x,y+1]],F('#dff4ff')));
  if(f===2)s.poly([[10,6],[9,1],[12,4],[14,0],[16,4],[18,0],[20,4],[23,1],[22,6]],Cr);
  EYE(s,11.5,11,'#0a3a38',3.4);EYE(s,17.5,11,'#0a3a38',3.4);mouth(s,14.5,17,3);return s},
/*17 Magmite lava golem*/ f=>{const s=new Spr().form(f),R=M('#5e4c50','#1a1012'),L=F('#ff7a2a'),Y=F('#ffe24a');
  s.ell(5,22,3.5,4,R).ell(27,22,3.5,4,R).ell(11,29,3,2,R).ell(21,29,3,2,R).ell(16,19,10,10,R);
  s.line(9,22,13,26,L).line(22,14,25,19,L).line(18,25,22,27,L);if(f>0)s.line(6,14,9,17,L).ell(16,25,1.6,1.4,Y);
  if(f===2){s.poly([[10,11],[12,4],[20,4],[22,11]],R).ell(16,4.5,3.4,1.2,L);s.px([[14,1],[17,0],[19,2]],F('#9a9aa8'))}
  s.rect(10,14,4,3,Y).rect(18,14,4,3,Y).px([[11,15],[19,15]],L);s.px([[13,20],[14,21],[15,21],[16,21],[17,21],[18,20]],L);return s},
/*18 Glowbit aurora fawn*/ f=>{const s=new Spr().form(f),B=M('#6ee8c0','#124a3a'),Sp=F('#f4fffb'),A=M('#e0b0ff','#4a1a6a');
  if(f===2)s.line(0,24,32,20,F('#b98cff'),1).line(0,26,32,22,F('#6ef0c0'),1);
  s.rect(8,23,2,7,B).rect(11,24,2,6,B).rect(17,24,2,6,B).rect(20,23,2,7,B);
  s.ell(15,21,8,4.5,B).px([[11,19],[14,18],[17,19],[12,22]],Sp).ell(7,18,2,1.5,B);
  const ant=f===2?[[19,7,16,1],[16,4,13,3],[24,7,27,1],[27,4,30,3]]:f?[[20,7,18,2],[24,7,26,2]]:[[20,7,19,4],[24,7,25,4]];
  ant.forEach(([a,b,c,d])=>s.line(a,b,c,d,A,1));
  s.ell(22,11,5,4.5,B).ell(18,8,1.6,2.4,B).ell(26,8,1.6,2.4,B).ell(24.5,13.5,2,1.5,M('#a8f4dc','#124a3a'));
  EYE(s,19,9.5,'#124a3a',2.4);EYE(s,23,9.5,'#124a3a',2.4);s.set(25,13,F('#2a1a3a'));return s},
/*19 Qwertle key dragon*/ f=>{const s=new Spr().form(f),G=M('#ffd166','#6b4200'),K=M('#fff8e6','#4a3a1a'),Pu=M('#7c5cff','#2a1470');
  s.line(10,26,3,24,G,2).poly([[0,24],[3,21],[4,26]],Pu);
  if(f>0)s.poly(f===2?[[11,17],[0,4],[4,15],[0,18]]:[[11,18],[5,11],[6,18]],Pu).poly(f===2?[[21,17],[32,4],[28,15],[32,18]]:[[21,18],[27,11],[26,18]],Pu);
  s.ell(12,29.5,2.5,1.5,G).ell(20,29.5,2.5,1.5,G).ell(16,22,7.5,7,G).ell(16,24.5,4,4,K);
  [[10,17],[13,15.5],[16,15],[19,15.5],[22,17]].forEach(([x,y])=>s.rect(x-1.3,y-1.3,2.6,2.6,K));
  s.ell(16,10,7,5.5,G).poly([[10,6],[8,0],[13,5]],Pu).poly([[22,6],[24,0],[19,5]],Pu);
  if(f===2)s.poly([[11,5],[11,2],[13,3.5],[16,1],[19,3.5],[21,2],[21,5]],M('#ff5d8f','#5a0a2a'));
  EYE(s,12,8.5,'#7c5cff');EYE(s,17.5,8.5,'#7c5cff');mouth(s,14.5,13);return s}
];

const ACC_PX={
 beanie:s=>{s.ell(16,10,7.5,4.5,M('#ff7a45','#5a1a0a')).rect(8.5,10.5,15,2.5,M('#ffb347','#5a2a0a')).ell(16,5,2,2,M('#fff3e0','#5a3a1a'))},
 goggles:s=>{s.rect(6,10,20,2,M('#7a4f2e','#2a1408')).ell(12,11,3,3,M('#9fe8ff','#7a5200')).ell(20,11,3,3,M('#9fe8ff','#7a5200'))},
 phones:s=>{const D=M('#2a2f50','#0a0c1a'),P=M('#ff5d8f','#5a0a2a');s.rect(5,8,2,10,D).rect(25,8,2,10,D).rect(6,6,20,2,D).rect(3,15,4,6,P).rect(25,15,4,6,P)},
 wizard:s=>{const B=M('#3b4bd6','#10184a');s.poly([[8,12],[17,-1],[24,12]],B).rect(5,11,22,2,B).poly(star(17,6,2),F('#ffd23a'))},
 crown:s=>{s.poly([[9,12],[9,6],[12,9],[16,4],[20,9],[23,6],[23,12]],M('#ffc93c','#6b4200')).px([[16,9]],F('#ff5d8f')).px([[12,10],[20,10]],F('#3ee6ff'))},
 shades:s=>{const K=F('#111118');s.rect(10,15.5,5.5,3.5,K).rect(17,15.5,5.5,3.5,K).rect(15,16,2,1,K).px([[11,16]],F('#8a8aa0'))},
 starspecs:s=>{s.poly(star(13,17,3.5),M('#ff5d8f','#5a0a2a')).poly(star(20,17,3.5),M('#ff5d8f','#5a0a2a'))},
 bowtie:s=>{const P=M('#ff5d8f','#5a0a2a');s.poly([[16,21],[12,19],[12,23]],P).poly([[16,21],[20,19],[20,23]],P).rect(15,20,2,2,M('#ff9fc0','#5a0a2a'))},
 scarf:s=>{const R=M('#e8384f','#4a0a14');s.rect(7,23,18,2.5,R).rect(19,25,3,5,R)},
 medal:s=>{s.line(13,19,16,23,F('#3ee6ff')).line(19,19,16,23,F('#3ee6ff')).ell(16,25,2.2,2.2,M('#ffc93c','#6b4200'))},
 cape:s=>{s.poly([[7,16],[25,16],[29,31],[3,31]],M('#e8384f','#4a0a14'))},
 jetpack:s=>{const G=M('#c9d2e6','#2a3248');s.rect(2,15,4,9,G).rect(26,15,4,9,G).px([[3,25],[4,26],[27,25],[28,26]],F('#ffc93c'))},
 wings:s=>{const C=M('#3ee6ff','#0a3a5a');s.poly([[6,18],[0,8],[1,16],[3,20]],C).poly([[26,18],[32,8],[31,16],[29,20]],C)}
};
const ACC_SLOT={beanie:'head',goggles:'head',phones:'head',wizard:'head',crown:'head',shades:'face',starspecs:'face',bowtie:'neck',scarf:'neck',medal:'neck',cape:'back',jetpack:'back',wings:'back'};
const SPR={
 zook(eq={}){const s=new Spr(),P=M('#7c5cff','#2a1470'),L=M('#c9b8ff','#2a1470'),C=M('#3ee6ff','#0b4a6e'),G=M('#ffc93c','#6b4200'),Dk=M('#5a3fd6','#2a1470');
  const A=sl=>{const id=eq[sl];if(id&&ACC_PX[id])ACC_PX[id](s)};A('back');
  s.poly([[24,23],[31,17],[28,17],[31,11],[25,19],[28,19]],G);
  s.poly([[8,15],[6,3],[13,11]],P).poly([[24,15],[26,3],[19,11]],P).px([[7,6],[7,7],[8,8],[8,9],[24,6],[24,7],[23,8],[23,9]],F('#3ee6ff'));
  s.ell(11,29,3.2,1.6,Dk).ell(21,29,3.2,1.6,Dk).ell(16,20,10.5,9.5,P).ell(16,24,6,4,L).ell(5.5,21,2,3,P).ell(26.5,21,2,3,P);
  s.px([[16,12],[15,13],[16,13],[17,13],[16,14]],C);
  EYE(s,11.5,15.5,'#3ee6ff');EYE(s,18.5,15.5,'#3ee6ff');mouth(s,14,21);s.set(17,22,W_);blushP(s,[[9,19],[23,19]]);
  A('neck');A('face');A('head');return s},
 species:(i,f)=>SPECIES_SPR[i](f),
 glitch(c='#9f7bd8',king=false){const s=new Spr(),B=M('#3a1a6a',c),N=F(c),Wh=F('#ffffff'),K=F('#0d0420');
  s.poly([[7,10],[5,3],[11,8]],M(c,'#0d0420')).poly([[25,10],[27,3],[21,8]],M(c,'#0d0420'));
  s.ell(16,18,10,9,B);
  [[3,14,6,16],[3,21,6,20],[29,14,26,16],[29,21,26,20],[10,28,12,25],[22,28,20,25]].forEach(([a,b,c2,d])=>s.line(a,b,c2,d,B,2));
  s.rect(9,14,5,3,Wh).rect(18,14,5,3,Wh).px([[11,15],[12,15],[19,15],[20,15]],N).px([[12,16],[19,16]],K).px([[9,13],[10,13],[11,13],[21,13],[22,13],[20,13]],K);
  s.rect(10,20,12,3,K).px([[10,20],[12,20],[14,20],[16,20],[18,20],[20,20],[11,22],[13,22],[15,22],[17,22],[19,22],[21,22]],Wh);
  s.px([[1,8],[30,6],[2,26],[29,27]],N);
  if(king)s.poly([[9,10],[9,3],[12,6],[16,1],[20,6],[23,3],[23,10]],M('#ffc93c','#6b4200')).px([[16,6]],N);return s},
 keystone(){const s=new Spr(24,24,2),Cy=M('#9ff0ff','#1a1450'),V=M('#9a7cff','#1a1450'),G=M('#ffd23a','#5a3a00'),K=M('#fff6d0','#5a3a00');
  s.ox=12;s.oy=23;s.poly([[12,1],[22,6],[22,11],[2,11],[2,6]],Cy).poly([[2,14],[22,14],[22,18],[12,23],[2,18]],V).rect(2,11,20,3,G);
  s.rect(9,9,6,6,K).px([[12,11],[11,12],[12,12],[13,12],[12,13]],F('#ff5d8f')).px([[5,5],[6,4]],F('#ffffff'));return s}
};
function pixelScene(kind,w=200,h=72){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),R=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(x,y,a,b)};
 const T={meadow:{sky:['#4aa3ec','#7cc4f6','#b4e2ff'],far:'#4fa65a',mid:'#69c454',gr:'#8fd65c',gr2:'#7cc84c',tuft:'#4f9a38',sun:1,clouds:1},
  cave:{sky:['#0e2a3a','#123a4a','#1a4f5e'],far:'#1d5a66',mid:'#2a7a80',gr:'#3a9a92',gr2:'#2f8a82',tuft:'#7fe8ff',crystals:1},
  volcano:{sky:['#5a1a2a','#a83a2a','#ff7a3a'],far:'#3a1a1a',mid:'#5a2a22',gr:'#6e3a2a',gr2:'#5a2e22',tuft:'#ff9a3a',lava:1},
  sky:{sky:['#8f7cff','#c4a8ff','#ffd0ec'],far:'#ffffff',mid:'#f4eaff',gr:'#ffffff',gr2:'#efe4ff',tuft:'#c4a8ff',clouds:1,cloudfloor:1},
  star:{sky:['#0b0a2a','#1a1450','#2a1e70'],far:'#2a2468',mid:'#3a2e86',gr:'#4a3aa0',gr2:'#3e3090',tuft:'#ffd84a',stars:1,moon:1},
  glitch:{sky:['#0d0628','#24104e','#5a1e7a'],far:'#2a1660',mid:'#1a1250',gr:'#1a1250',gr2:'#120c3a',tuft:'#9f7bd8',stars:1}}[kind]||{};
 const p=T;R(0,0,w,14,p.sky[0]);R(0,14,w,14,p.sky[1]);R(0,28,w,16,p.sky[2]);
 if(p.stars)for(let i=0;i<40;i++)R((i*37)%w,(i*13)%34,1,1,i%6?'#ffffff':'#ffd84a');
 if(p.sun){R(160,6,8,8,'#ffe066');R(159,8,10,4,'#ffe066');R(162,5,4,10,'#ffe066')}
 if(p.moon){R(160,6,10,10,'#fff6c8');R(164,5,7,8,p.sky[0])}
 if(p.clouds){const cl=(x,y)=>{R(x+3,y,8,3,'#ffffff');R(x,y+3,15,4,'#ffffff')};cl(10,8);cl(62,4);cl(120,14);cl(176,22)}
 if(p.lava){R(0,40,w,2,'#ff7a2a')}
 const ridge=(base,amp,col,f1,f2)=>{for(let x=0;x<w;x++){const y=Math.round(base+amp*Math.sin(x/f1)+amp*.6*Math.sin(x/f2));R(x,y,1,h-y,col)}};
 if(p.crystals){for(let i=0;i<9;i++){const x=(i*17+4)%w,hh=10+(i*7)%14;g.fillStyle=i%2?'#5ad6e8':'#3aa8c8';g.beginPath();g.moveTo(x,44);g.lineTo(x+4,44-hh);g.lineTo(x+8,44);g.fill()}}
 if(kind==='volcano'){g.fillStyle='#2a1012';g.beginPath();g.moveTo(70,44);g.lineTo(92,16);g.lineTo(104,16);g.lineTo(126,44);g.fill();R(92,14,12,3,'#ff7a2a');R(96,8,3,6,'#8a8aa0')}
 ridge(36,2.5,p.far,9,4);ridge(44,1.5,p.mid,13,5);ridge(50,1,p.gr,17,7);ridge(62,1,p.gr2,11,6);
 for(let i=0;i<16;i++){const x=(i*29+5)%w,y=53+(i*7)%16;R(x,y,1,2,p.tuft);R(x+2,y-1,1,3,p.tuft)}
 return c;
}
function roadScene(w=160,h=100){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),R=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(x,y,a,b)};
 R(0,0,w,14,'#0d0628');R(0,14,w,14,'#24104e');R(0,28,w,8,'#5a1e7a');R(0,36,w,4,'#e0707a');
 for(let i=0;i<40;i++)R((i*41)%w,(i*11)%30,1,1,i%5?'#ffffff':'#9f7bd8');
 R(70,26,8,14,'#12082e');R(76,20,10,20,'#12082e');R(86,24,10,16,'#12082e');R(80,16,3,4,'#12082e');R(78,28,2,2,'#9f7bd8');R(90,30,2,2,'#9f7bd8');
 R(0,40,w,h-40,'#1a1250');
 for(let d=.08;d<1;d+=.12){const y=40+Math.round(60*d*d);R(0,y,w,1,'#4a1e7a')}
 for(let y=40;y<h;y++){const t=(y-40)/60,half=Math.round(5+t*68);R(80-half,y,half*2,1,'#3a2a8a');R(80-half,y,1,1,'#3ee6ff');R(80+half-1,y,1,1,'#3ee6ff');if(Math.floor(t*14)%2===0)R(79,y,2,1,'#ffffff')}
 [.15,.32,.55,.85].forEach(d=>{const y=40+Math.round(60*d),sc=1+d*5;[-1,1].forEach(sd=>{const x=80+sd*(8+72*d);g.fillStyle='#5ad6e8';g.beginPath();g.moveTo(x-2*sc,y);g.lineTo(x,y-7*sc);g.lineTo(x+2*sc,y);g.fill();R(Math.round(x-.5),Math.round(y-5*sc),1,Math.round(3*sc),'#d8fbff')})});
 return c;
}

return {SPR,ACC_SLOT,pixelScene,roadScene};})();