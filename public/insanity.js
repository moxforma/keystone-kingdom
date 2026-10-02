/* IMPOSSIBLE MODE (internal key: insanity): harder than Beast, unlocked per game by beating that game on Beast */
(function(){
window.INSANE=false;let PREV=null;
if(typeof ARCADE_LEVELS!=='undefined')ARCADE_LEVELS.insanity=[5,'IMPOSSIBLE MODE'];
const GAMES=['meteor','glitch','race','bubble','dig','keeper','bridge'];
const beatBeast=g=>{const h=(S.arc&&S.arc.high||{})[g];return h==='beast'||h==='insanity'||/^beast/.test(h||'')};
function boost(){if(!window.INSANE||typeof G==='undefined'||!G||G.insane)return;G.arcLevel='insanity';G.insane=true;
 if(G.type==='meteor'||G.type==='glitch')G.speed=(G.speed||1)*1.8;
 if(G.type==='race'&&G.racers)G.racers.forEach(r=>r.w*=1.45);
 if(G.type==='dig'||G.type==='keeper'){G.left=Math.round(G.left*.55)}
 if(G.type==='keeper')G.life=45;
 try{if(G.type==='meteor'){G.shields=2;gUpdate()}if(G.type==='glitch'){G.hearts=2;gUp()}if(G.type==='bubble'){G.hearts=2;$('#g-b').textContent='♥♥'}}catch(e){}
 if(G.type==='keeper'){const l=$('#kplife');if(l)l.style.width=G.life+'%'}
 const a=$('#garena');a&&a.classList.add('insane');const hd=$('#ghud');if(hd&&!hd.querySelector('.imptag'))(hd.querySelector('.ht')||hd).insertAdjacentHTML('beforeend','<span class="imptag">IMPOSSIBLE MODE</span>');const t=$('#ghud h2, #ghud .gt b, #ghud b');}
ACT.insane=d=>{const g=d.g;if(!GAMES.includes(g)||!ACT[g])return;PREV=window.INSANE?PREV:S.set.arcd;window.INSANE=true;S.set.arcd='beast';
 ACT[g]();boost()};
/* Play again from the end screen keeps INSANITY going */
GAMES.forEach(g=>{const f=ACT[g];if(!f)return;ACT[g]=function(){const r=f.apply(this,arguments);if(window.INSANE){boost()}return r}});
const _show=show;show=function(id){if(id!=='game'&&window.INSANE){window.INSANE=false;if(PREV!=null)S.set.arcd=PREV;PREV=null;try{save()}catch(e){}}return _show.apply(this,arguments)};
const _ra=renderArcade;renderArcade=function(){_ra.apply(this,arguments);
 document.querySelectorAll('#s-arcade .games .game').forEach(p=>{const b=[...p.querySelectorAll('button[data-act]')].find(x=>GAMES.includes(x.dataset.act));if(!b||p.querySelector('.insbtn'))return;const g=b.dataset.act;
  if(!beatBeast(g))return;const wrap=document.createElement('div');wrap.className='playrow';b.replaceWith(wrap);wrap.appendChild(b);
  wrap.insertAdjacentHTML('beforeend',`<button class="btn insbtn" data-act="insane" data-g="${g}" title="Harder than Beast!"><span>IMPOSSIBLE</span><span>MODE</span></button>`)})};
})();
