/* Difficulty tuning: Hard is a real step up, Beast is fierce, Impossible is for the very best typists */
(function(){
const lvl=()=>window.INSANE?'imp':(S.set.arcd||'auto');
const T={
 meteor:{hard:{speed:2.1,maxSpeed:3.6,maxOn:4,minGap:1},beast:{speed:4.8,maxSpeed:6.5,maxOn:5,minGap:.75},imp:{speed:7.2,maxSpeed:10,maxOn:6,minGap:.5,shields:1,wordP:.9}},
 glitch:{hard:{speed:1.9},beast:{speed:4},imp:{speed:6.8,hearts:1}},
};
function tune(g){if(typeof G==='undefined'||!G||G.type!==g)return;const t=(T[g]||{})[lvl()];
 if(g==='race'&&G.racers){const L=lvl();if(L==='hard')G.racers.forEach((r,k)=>r.w=Math.max(r.w*1.25,[26,32,38][k]||30));const w={beast:[80,92,104],imp:[115,130,150]}[L];if(w)w.forEach((v,k)=>G.racers[k]&&(G.racers[k].w=v))}
 if((g==='dig'||g==='keeper')&&!G.tuned){const m={hard:.85,beast:.72,imp:.8}[lvl()];if(m&&G.left)G.left=Math.round(G.left*m);if(g==='keeper'&&lvl()==='imp')G.life=30;G.tuned=1}
 if(!t)return;Object.assign(G,t);
 try{if(g==='meteor'&&t.shields)gUpdate();if(g==='glitch'&&t.hearts)gUp()}catch(e){}}
/* every game start (incl. Play again) clears the end-of-game popup first */
['meteor','glitch','race','bubble','dig','keeper','bridge'].forEach(g=>{const f=ACT[g];if(!f)return;ACT[g]=function(){try{closeModal()}catch(e){}const r=f.apply(this,arguments);try{tune(g)}catch(e){console.warn(e)}return r}});
})();
/* no free diamonds for idle play: an arcade run with almost no typing pays nothing */
(function(){let snap=null,keys=0;
const start=()=>{snap={g:S.gems,x:S.xp};keys=0};
if(typeof mountGame==='function'){const _mg=mountGame;mountGame=function(){const r=_mg.apply(this,arguments);start();return r};window.mountGame=mountGame}
document.addEventListener('keydown',e=>{if(snap&&typeof screen!=='undefined'&&screen==='game'&&e.key&&e.key.length===1&&e.key!==' ')keys++},true);
const _md=modal;modal=function(){if(snap&&typeof screen!=='undefined'&&screen==='game'&&typeof G!=='undefined'&&G&&G.done&&(S.gems>snap.g||S.xp>snap.x)){
  const idle=keys<3&&!S.infGems,s=snap;snap=null;
  if(idle){S.gems=s.g;S.xp=s.x;save();const r=_md.apply(this,arguments);try{const rw=document.querySelector('#mbox .reward');const note='<p class="muted idlenote" style="margin:6px 0">No diamonds this time. Type some letters to earn them!</p>';if(rw)rw.outerHTML=note;else document.querySelector('#mbox h2')?.insertAdjacentHTML('afterend',note)}catch(e){}return r}}
 return _md.apply(this,arguments)};
})();
