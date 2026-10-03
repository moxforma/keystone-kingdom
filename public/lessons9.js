/* Every lesson group has 9 lessons: 7 to learn (old lessons + new practice ones), a Review, then a Boss Test with a diamond prize.
   New lessons are appended to LESSONS (old indexes and saves never move); ORDER is the play order. */
(function(){
const BASE=LESSONS.length,BASE_SP=SPECIES.length;
const ORDER_=[],NEWL=[];
/* ---- plan each group ---- */
const groups=REGIONS.map((R,r)=>({r,old:LESSONS.map((L,i)=>L.r===r?i:-1).filter(i=>i>=0)})).filter(g=>g.old.length);
const short=n=>n.replace(/^(The )/,'');
const POS0=(a,j)=>a.indexOf(j);
function add(L){const i=LESSONS.length;LESSONS.push(L);NEWL.push(i);return i}
const keysOf=i=>{const s=new Set();let k=i;while(k>=0){const L=LESSONS[k];if(L&&L.k)[...L.k].forEach(c=>s.add(c.toUpperCase()));k--}return s};
groups.forEach(g=>{const R=REGIONS[g.r],old=g.old,seq=[];
 const need=Math.max(0,7-old.length),after={};
 for(let k=0;k<need;k++){const at=old[Math.min(old.length-1,Math.floor((k+1)*old.length/(need+1)))];after[at]=(after[at]||0)+1}
 let pn=0;
 old.forEach(i=>{seq.push(i);for(let k=0;k<(after[i]||0);k++){pn++;
  const lk=LESSONS[i].k&&/^[a-z;,.]+$/.test(LESSONS[i].k),gk=[...new Set(old.filter(j=>POS0(old,j)<=POS0(old,i)).map(j=>LESSONS[j].k).join(''))].map(c=>c.toUpperCase()).join(' ');
  const t=lk?(k===0?`Practice: ${[...LESSONS[i].k].map(c=>c.toUpperCase()).join(' ')}`:`Mix: ${gk}`):`${short(R.name)} Practice ${pn}`;
  seq.push(add({k:'',sp:'x9p',r:g.r,t,src:i,grp:g.r}))}});
 const last=old[old.length-1];
 if(seq.length<=7)seq.push(add({k:'',sp:'x9r',r:g.r,t:`${short(R.name)} Review`,src:last,grp:g.r}));
 seq.push(add({k:'',sp:'x9b',r:g.r,t:`${short(R.name)} Boss Test`,src:last,grp:g.r,bt:1}));
 g.seq=seq;ORDER_.push(...seq)});
window.ORDER=ORDER_;
const POS={};ORDER_.forEach((i,k)=>POS[i]=k);
const GOLD={};groups.forEach(g=>GOLD[g.r]=g);
window.EI=i=>i>=BASE&&LESSONS[i]?LESSONS[i].src:i;
window.LNUM=i=>POS[i]!=null?POS[i]+1:i+1;
TOTAL=LESSONS.length*3;
try{Object.assign(LSUM,{x9p:'More practice with what you just learned.',x9r:'A mix of everything in this area.',x9b:'Show what you know! Beat the boss for a big diamond prize.'})}catch(e){}

/* ---- play order: next stage, unlocks, worlds, bosses ---- */
const SEQN=ORDER_.flatMap(i=>Array.from({length:NST},(_,s)=>i*NST+s)),PN={};SEQN.forEach((n,k)=>PN[n]=k);
window.SEQP=n=>PN[n]!=null?PN[n]:n;
nextStage=function(){const st=PN[S.skip]||0;for(let k=st;k<SEQN.length;k++)if(bestOf(SEQN[k])<1)return SEQN[k];return SEQN[SEQN.length-1]};
window.SEQU=n=>{const q=PN[n];if(q==null)return false;return q<=(PN[S.skip]||0)||q===0||bestOf(SEQN[q-1])>=1};
window.SEQW=i=>worldOfRegion(LESSONS[i].r);
window.SEQWL=w=>ORDER_.filter(i=>worldOfRegion(LESSONS[i].r)===w);
const lastOfRegion=r=>{const g=GOLD[r];return g?g.seq[g.seq.length-1]:-1};
isBoss=function(i,s){return s===NST-1&&LESSONS[i]&&i===lastOfRegion(LESSONS[i].r)};
const _lr=learned;learned=function(i){return _lr(EI(i))};
const nextInOrder=n=>{const q=PN[n];return q!=null&&q+1<SEQN.length?SEQN[q+1]:null};

/* ---- text for the new lessons ---- */
const _gt=genText;genText=function(i,s,pr){const L=LESSONS[i];if(pr||!L||i<BASE)return _gt.apply(this,arguments);
 const g=GOLD[L.grp],old=g?g.old:[L.src],upto=old.filter(j=>POS[j]<=POS[i]);
 if(L.sp==='x9p'){const pool=upto.slice(-3);const a=_gt.call(this,L.src,Math.min(7,s+1),false),b=_gt.call(this,pool[s%pool.length],Math.min(7,s),false);return s%2?b:a}
 if(L.sp==='x9r'){const j=old[s%old.length],k=old[(s+3)%old.length];const a=_gt.call(this,j,Math.min(6,2+s),false),b=_gt.call(this,k,Math.min(6,1+s),false);return (a.split(' ').slice(0,Math.ceil(a.split(' ').length/2)).join(' ')+' '+b.split(' ').slice(0,Math.ceil(b.split(' ').length/2)).join(' ')).trim()}
 /* boss test: harder mix, last stage is the boss */
 if(s===NST-1)return _gt.call(this,L.src,7,false);
 const j=old[(s*2)%old.length],k=old[(s*2+1)%old.length];const a=_gt.call(this,j,Math.min(7,4+s%4),false),b=_gt.call(this,k,Math.min(7,3+s%4),false);
 return (a.split(' ').slice(0,Math.ceil(a.split(' ').length*.6)).join(' ')+' '+b.split(' ').slice(0,Math.ceil(b.split(' ').length*.6)).join(' ')).trim()};
/* keyboard + intro behave like the lesson the new one is based on */
const _ss=startStage;startStage=function(n,mode){const r=_ss.apply(this,arguments);try{if(!mode&&typeof P!=='undefined'&&P.i>=BASE){const j=EI(P.i),set=_lr(j);
 if(LESSONS[j].sp==='caps'||j>15)[...'abcdefghijklmnopqrstuvwxyz;,.'].forEach(c=>set.add(c));setAvail(set,j>=15);if(j>=20)setAvail(new Set([...keyEls.keys()]),true);applyLabels()}}catch(e){}return r};

/* ---- Boss Test prize + correct "Next" button ---- */
const _res=results;results=function(r){const out=_res.apply(this,arguments);try{const box=$('#mbox');if(!box||typeof P==='undefined'||P.practice||P.mode)return out;
 const nx=nextInOrder(P.n);box.querySelectorAll('[data-act=play]').forEach(b=>{if(+b.dataset.n===P.n+1&&!b.closest('.stpick')){if(nx==null)b.remove();else b.dataset.n=nx}});
 const L=LESSONS[P.i];if(r&&r.pass&&L&&L.bt&&P.s===NST-1&&!r._bt){r._bt=1;S.btp=S.btp||{};if(!S.btp[P.i]){S.btp[P.i]=1;const g=25+(r.stars===3?10:0);S.gems+=g;save();
   const b=box.querySelector('.bigstars');b&&b.insertAdjacentHTML('afterend',`<div class="banner gold">Boss Test beaten! Prize: +${g} diamonds</div>`)}}}catch(e){console.warn(e)}return out};

/* ---- old saves: groups already beaten get the new lessons credited ---- */
function credit(){try{if(!S||!S.best)return;let ch=false;groups.forEach(g=>{const done=g.old.every(i=>{for(let s=0;s<NST;s++)if(!(S.best[i+'-'+s]>=1))return false;return true});
  if(!done)return;g.seq.forEach(i=>{if(i<BASE)return;for(let s=0;s<NST;s++){const k=i+'-'+s;if(!(S.best[k]>=1)){S.best[k]=1;ch=true}}S.btp=S.btp||{};if(LESSONS[i].bt)S.btp[i]=1})});
 if(ch)save()}catch(e){console.warn(e)}}
credit();const _ld=load;load=function(){const r=_ld.apply(this,arguments);credit();return r};

/* ---- Keylori for the new lessons: Prism and Starlight cousins (legendary) ---- */
const hx=c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)),lumv=c=>{const [r,g,b]=hx(c);return (r*.3+g*.59+b*.11)/255};
const KEEPC=new Set(['k','w','e','m','n','p','r','o']);
const PRISM_MIN=.4;
function prismPal(pal,seed){const mk=(spread,sat,lit)=>{const o={};Object.entries(pal).forEach(([ch,c])=>{if(KEEPC.has(ch)||typeof c!=='string'||!/^#[0-9a-f]{6}$/i.test(c)){o[ch]=c;return}
  const l=lumv(c);let h=(seed*47+l*spread)%360;if(h>270&&h<345)h=(h+80)%360;o[ch]=hsl2hex(h,sat(l),lit(l))});return o};
 const rainbow=mk(380,()=>.62,l=>Math.min(.9,.28+l*.62));
 /* if the rainbow flips light and dark shades (looks speckled, like Prism Grifkin did), use a smooth version that keeps the shading */
 const ks=Object.keys(pal).filter(ch=>!KEEPC.has(ch)&&/^#[0-9a-f]{6}$/i.test(pal[ch]||''));
 const spread=P=>{const v=ks.map(ch=>lumv(P[ch]));return Math.max(...v)-Math.min(...v)};const ratio=spread(rainbow)/Math.max(.01,spread(pal));
 return ratio<PRISM_MIN?mk(140,l=>.5+l*.2,l=>Math.min(.9,.1+l*.85)):rainbow}
function starPal(pal){const o={};Object.entries(pal).forEach(([ch,c])=>{if(KEEPC.has(ch)||typeof c!=='string'||!/^#[0-9a-f]{6}$/i.test(c)){o[ch]=c;return}
  const l=lumv(c);o[ch]=hsl2hex(228+l*20,.5,Math.min(.72,.14+l*.55))});return o}
const keys=[...new Set(KKDATA.order.slice(0,72))].sort();
const shadowPick=new Set(Array.from({length:14},(_,k)=>keys[Math.floor(k*keys.length/14)]));
const free=keys.filter(k=>!shadowPick.has(k));
NEWL.forEach((li,m)=>{const key=free[Math.floor(m*free.length/NEWL.length)],idx=KKDATA.order.indexOf(key),base=SPECIES[idx],prism=m%2===0,nk=(prism?'pr_':'st_')+key;
 KKDATA.order[li]=nk;KKDATA.spr[nk]=KKDATA.spr[key];KKDATA.pal[nk]=prism?prismPal(KKDATA.pal[key],m):starPal(KKDATA.pal[key]);
 SPECIES[li]={n:base.n.map(x=>(prism?'Prism ':'Starlight ')+x),t:base.t,fl:prism?'A rare rainbow-crystal cousin. It sparkles when you type fast!':'A rare cousin made of night sky. Count its stars!'};
 EVO[li]=EVO[idx];if(typeof EVOLUTION_FLAVOR!=='undefined')EVOLUTION_FLAVOR[li]=EVOLUTION_FLAVOR[idx]});
{const _ro=window.rarOf;window.rarOf=i=>i>=BASE?3:_ro(i)}
/* sparkles for Prism, stars for Starlight */
const SPK=new WeakMap();const _ev=evolvedV;evolvedV=function(i,f,tier,v){const c0=_ev.apply(this,arguments);let c=c0;try{const k=KKDATA.order[i];if(!/^(pr|st)_/.test(k))return c0;
  /* the base canvas is cached, so sparkle a copy once instead of drawing on top again on every call */
  if(SPK.has(c0))return SPK.get(c0);c=document.createElement('canvas');c.width=c0.width;c.height=c0.height;c.getContext('2d').drawImage(c0,0,0);SPK.set(c0,c);const g=c.getContext('2d'),d=g.getImageData(0,0,c.width,c.height).data,W=c.width;
  const pr=k.startsWith('pr_'),col=pr?['#ffffff','#fff6c8']:['#fff6e0','#9ad0ff'];let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))>>>0;
  for(let n=0;n<(pr?7:12);n++){h=(h*1103515245+12345)>>>0;const x=4+h%(W-8);h=(h*1103515245+12345)>>>0;const y=4+h%(c.height-8);const a=d[(y*W+x)*4+3];if(a<200)continue;
   const p=(x2,y2,cc)=>{g.fillStyle=cc;g.fillRect(x2,y2,1,1)};p(x,y,col[0]);if(pr||n%3===0){p(x-1,y,col[1]);p(x+1,y,col[1]);p(x,y-1,col[1]);p(x,y+1,col[1])}}}catch(e){}return c};
try{if(screen==='home')renderHome();if(screen==='map')renderMap()}catch(e){}
})();
