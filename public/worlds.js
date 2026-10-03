/* World rebalance + random Keylori per lesson + rarity */
(function(){
/* ---- 1. even worlds: 8,8,7,7,7,7,7,7,7,7 lessons ---- */
const NEWSTART=[0,8,16,23,30,37,44,51,58,65];
NEWSTART.forEach((v,k)=>WSTART[k]=v);
const DESC=['Home row and top row letters.','Top row, bottom row and capitals.','Sentences, numbers and punctuation.','Speed runs, symbols and tricky words.','Fast common words and capitals.','Commas, quotes and the number row.','Prices, times and symbols.','Slashes, dots and tricky spelling.','Giant words, stories and rhymes.','Everything. Become a Legend!'];
LESSONS.forEach((L,i)=>{const w=worldOf(i);if(w>=2)L.r=WREG[w-1]});
WREG.forEach((r,k)=>{if(k&&REGIONS[r])REGIONS[r].desc=DESC[k]});
REGIONS[0].desc='Where every finger finds its home.';
/* map: drop regions that no longer have lessons */
const _rm=renderMap;renderMap=function(){const r=_rm.apply(this,arguments);document.querySelectorAll('#s-map section.region').forEach(s=>{const l=s.querySelector('.lessons');if(l&&!l.children.length)s.remove()});return r};

/* ---- 2. rarity (by original species) ---- */
const RN=['common','rare','epic','legendary'],RW=[10,5,2.5,1];
const hsh=n=>{let h=(n+1)*2654435761>>>0;h^=h>>>15;h=Math.imul(h,2246822519)>>>0;h^=h>>>13;return h};
const ORDER=[...Array(SPECIES.length).keys()].sort((a,b)=>hsh(a)-hsh(b));
const RAR0={};ORDER.forEach((o,k)=>RAR0[o]=k<4?3:k<14?2:k<32?1:0);
window.RARITY_NAMES=RN;

/* ---- 3. random Keylori per lesson (per player permutation of species slots) ---- */
const ORIG={sp:SPECIES.slice(),ord:KKDATA.order.slice(),evo:EVO.slice(),fl:(typeof EVOLUTION_FLAVOR!=='undefined'?EVOLUTION_FLAVOR.slice():[])};
const N=ORIG.sp.length;let PERM=[...Array(N).keys()];
window.rarOf=i=>RAR0[PERM[i]]||0;
function rollPerm(){
 const fixed=new Set();Object.keys(S.best||{}).concat(Object.keys(S.cards||{})).forEach(k=>{const i=+k.split('-')[0];if(i<N)fixed.add(i)});
 const p=Array(N).fill(-1);fixed.forEach(i=>p[i]=i);
 const pool=[...Array(N).keys()].filter(o=>!fixed.has(o));
 for(let i=0;i<N;i++){if(p[i]>=0)continue;let tot=pool.reduce((a,o)=>a+RW[RAR0[o]],0),r=Math.random()*tot,k=0;
  for(;k<pool.length-1;k++){r-=RW[RAR0[pool[k]]];if(r<=0)break}p[i]=pool.splice(k,1)[0]}
 return p}
function applyPerm(){
 if(!Array.isArray(S.roll)||S.roll.length!==N||new Set(S.roll).size!==N){S.roll=rollPerm();try{save()}catch(e){}}
 PERM=S.roll;
 for(let i=0;i<N;i++){const o=PERM[i];SPECIES[i]=ORIG.sp[o];KKDATA.order[i]=ORIG.ord[o];EVO[i]=ORIG.evo[o];if(ORIG.fl.length)EVOLUTION_FLAVOR[i]=ORIG.fl[o]}
 try{Object.keys(KKC).forEach(k=>{if(/^[ekKs]\d+-/.test(k)||/^e\d/.test(k))delete KKC[k]})}catch(e){}}
window.applyPerm=applyPerm;
/* never lose access: everything up to the furthest stage you've passed stays open */
function keepFrontier(){try{let far=-1;Object.entries(S.best||{}).forEach(([k,v])=>{if(v>=1){const[i,st]=k.split('-').map(Number);if(i<LESSONS.length&&st<NST){const n=i*NST+st;if(far<0||(window.SEQP?SEQP(n)>SEQP(far):n>far))far=n}}});if(far>=0&&(window.SEQP?SEQP(far)>SEQP(S.skip||0):far>(S.skip||0))){S.skip=far;try{save()}catch(e){}}}catch(e){}}
const _ld=load;load=function(){const r=_ld.apply(this,arguments);applyPerm();keepFrontier();return r};
applyPerm();keepFrontier();

/* ---- 4. rarity looks ---- */
const _cs=creatureSVG;creatureSVG=function(i,f,cls='',tier){const r=rarOf(i);if(r&&!/\bsil\b/.test(cls||''))cls=(cls||'')+' rar'+r;return _cs.call(this,i,f,cls,tier)};
const _ch=cardHTML;cardHTML=function(i,f,o={}){let h=_ch.apply(this,arguments);if(o&&o.locked)return h;const r=rarOf(i);
 h=h.replace('<div class="card ',`<div class="card rar${r} `);
 if(r)h=h.replace('<div class="c-art">',`<div class="c-art"><span class="rtag rt${r}">${RN[r].toUpperCase()}</span>`);
 return h};
/* rare catch banner */
const _res=results;results=function(r){_res.apply(this,arguments);try{if(!r||!r.pass||P.practice||!r.newCard)return;const k=rarOf(P.fi);if(!k)return;
 const b=document.querySelector('#mbox .bigstars');b&&b.insertAdjacentHTML('afterend',`<div class="banner rarban rb${k}">WOW! ${k===2?'AN':'A'} ${RN[k].toUpperCase()} KEYLORI!</div>`)}catch(e){}};

const _rb=renderBinder;renderBinder=function(){const r=_rb.apply(this,arguments);document.querySelectorAll('#s-binder .sprtile[data-k]').forEach(t=>{const k=rarOf(+t.dataset.k.split('-')[0]);if(k){t.classList.add('rar'+k);t.insertAdjacentHTML('beforeend',`<span class="rdot rt${k}">${RN[k][0].toUpperCase()}</span>`)}});return r};
try{if(screen==='home')renderHome()}catch(e){}
})();
