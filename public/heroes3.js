/* Rare heroes: Drakko (all 10 Keystone shards), Kitsu (Beast mode beaten in every arcade game), Nyx (60-day streak) */
(function(){
if(typeof HEROES==='undefined')return;
Object.assign(HEROES,{"drakko": {"name": "Drakko", "pal": {"w": "#ffffff", "k": "#0a3a7a", "m": "#4a2030", "n": "#3a70a8", "r": "#ffb0d0", "o": "#1a3a6a", "X": "#3a70a8", "D": "#5a98d0", "B": "#8ac8f0", "L": "#b8e8ff", "H": "#ffffff", "u": "#ffffff", "U": "#d8f0ff", "g": "#e0ffff", "G": "#6ad0ff", "S": "#ffe060", "T": "#ff7a20", "R": "#e83a20", "W": "#ffe8a0", "V": "#e0a830", "e": "#4af0ff", "j": "#ff4a8a", "J": "#c01a5a", "*": "#ffffff"}, "rows": [".oo...*....oo....*...oo.", "oggo...*..oSSo..*...oggo", "oggGo....oSTTSo....oGggo", "ogGGo...oSTRRTSo...oGGgo", ".oGGG.ooooTRRToooo.GGGo.", "..ooGLHHHLoRRoLBBBBGoo..", ".oLHHHLLLLLLLLLBBBBBDDo.", ".oLHLLLLLLLooLLBBBBBBDo.", "oLLHLLLLLLojJoBBBBBBBDDo", "oLLLLLLLLLLooBBBBBBBBDDo", "oLLLLLLLLLLBBBBBBBBBBDXo", "oLLLLLkekBBBBBBkekBBBDXo", "oLLLLLwkkBBBBBBwkkBBBDXo", "oLLLLLkkkBBBBBBkkkBBBDXo", "oLLrrLLLuuuuuuuuBBrrBDXo", "oLLLLLLuuunuunuuBBBBBDXo", ".oLLLLLuuuuuuuuuuBBBDXo.", "oWoLLLLLumuuuumuBBBBDoWo", "oWWoLLLLLummmmuBBBDDoWWo", "oVWooooLLLLBBBBBDDoooWVo", "ooVoLoBuuuuuuuuuBDoDoVoo", "oLooLoBuuuuuuuuuDDoDooXo", ".oooooBBuuuuuuuDDDooooo.", "......ooooo..ooooo......"]}, "kitsu": {"name": "Kitsu", "pal": {"o": "#2a4a9a", "X": "#8088aa", "D": "#aab0cc", "B": "#d8dcec", "L": "#f4f4fa", "H": "#ffffff", "u": "#ffffff", "U": "#e6e8f2", "n": "#2a2a44", "m": "#4a2030", "k": "#1a1830", "w": "#ffffff", "r": "#ff8aa8", "f": "#c8ffff", "F": "#5ad0ff", "E": "#2a8af0", "q": "#e8405a"}, "rows": ["..oF................Fo..", ".oFfFo............oFfFo.", ".oFfEo............oEfFo.", "..oLHHLo........oLHHLo..", "...oLHLLooooooooLLHLo...", "...ooLHHHLLFFLLBBBLoo...", ".oLHHHLLLLLFELLBBBBBDDo.", ".oLHLLLLLLLEELLBBBBBBDo.", "oLLHLLLLLLLLELBBBBBBBDDo", "oLLLLLLLLLLLBBBBBBBBBDDo", "oLLLqqqLLLLBBBBBBqqqBDXo", "oLLLqLkkkBBBBBBkkkBqBDXo", "oLLLLLwkkBBBBBBwkkBBBDXo", "oLLLLLkkkBBBBBBkkkBBBDXo", "oLqqrLLLuuuuuuuBBBrrqqXo", "oLLLLLLuuuunnuuuBBBBBDXo", ".oLLLLLuuuuumuuuuBBBDXo.", ".oLLLLLLuuuuuuuuBBBBDoF.", "..ooLLLLLuuuuuuBBBDDoFfo", ".oLLoooLLLLBBBBBDDooFfFo", "oLLLLoBuuuuuuuuuBDooEFfo", "oLLLLoBuuuuuuuuuDDoDoEoo", ".oooooBBuuuuuuuDDDooooo.", "......ooooo..ooooo......"]}, "nyx": {"name": "Nyx", "pal": {"o": "#0a0c22", "X": "#1e2650", "D": "#2c3670", "B": "#3e4a90", "L": "#5a6ab8", "H": "#8a9ae0", "u": "#d8d0f0", "U": "#b0a8d8", "n": "#f0b030", "m": "#c88a20", "k": "#1a1408", "w": "#ffffff", "r": "#a87ad8", "y": "#fff2a0", "Y": "#f0c040", "t": "#ffc838", "s": "#e8f0ff"}, "rows": ["..o..................o..", "..oHo..............oHo..", "..oHLo............oLHo..", "...oHLo..........oLHo...", "....oLLooooooooooLLo....", "...oooLHHLLLLLLBBLooo...", ".oLHHsLLLLLyYLLBBBBBDDo.", ".oLHLLLLLLyLLLLBBBsBBDo.", "oLLsLLLLLLyYLLBBBBBBBDDo", "oLLLLLLLLLLLBBBBBBBBsDDo", "oLLLLotttoLBBBotttoBBDXo", "oLLLLtkkktBBBBtkkktBBDXo", "oLLLLtwkktBBBBtwkktBBDXo", "oLLLLtkkktBBBBtkkktBBDXo", "oLrrrLtuuuunnuuuttrrrrXo", "oLLLLLLuuunnnnuuBBBBBDXo", ".oLLLLLuuuummuuuuBBBDXo.", ".oLLLLLLuuuuuuuuBBBBDXo.", "..ooLLLUuUuUuUuUBBDDoo..", ".oLLoooLsLLBBBBBDDooDDo.", "oLLLLoBuUuUuUuUuBDoDDDXo", "oLLLLoBuuuuuusuuDDoDDXXo", ".oooooBBuuuuuuuDDDooooo.", "......ooooo..ooooo......"]}});
/* anything drawn before these heroes existed fell back to Pop: clear those cached images and redraw */
try{if(typeof KKC!=='undefined')Object.keys(KKC).forEach(k=>{if(/drakko|kitsu|nyx/.test(k))delete KKC[k]})}catch(e){}
setTimeout(()=>{try{if(typeof screen!=='undefined'&&screen==='home')renderHome()}catch(e){}},0);
if(typeof HERO_COLORS!=='undefined')Object.assign(HERO_COLORS,{drakko:[null,'red','gold','purple'],kitsu:[null,'pink','gold','night'],nyx:[null,'purple','green','night']});
const GAMES=['meteor','glitch','race','bubble','dig','keeper','bridge'];
const beastDone=g=>{const h=((S.arc||{}).high||{})[g];return h==='beast'||h==='insanity'||/^beast/.test(h||'')};
const bestStreak=()=>{const d=S.daily||{};return Math.max(d.best||0,d.streak||0)};
const shards=()=>{try{return shardCount()}catch(e){return 0}};
const RARE={
 drakko:{need:'Restore all 10 Keystone shards',prog:()=>`${shards()}/10 shards`,ok:()=>shards()>=10},
 kitsu:{need:'Beat Beast mode in every arcade game',prog:()=>`${GAMES.filter(beastDone).length}/${GAMES.length} games`,ok:()=>GAMES.every(beastDone)},
 nyx:{need:'Keep a 60-day practice streak',prog:()=>`best streak ${bestStreak()} days`,ok:()=>bestStreak()>=60}};
window.RARE_HEROES=RARE;
const unlocked=h=>!RARE[h]||RARE[h].ok()||(S.rareOwn||{})[h];
window.heroUnlocked=unlocked;
/* hero picker: locked rare heroes show as a silhouette with what it takes */
const _he=ACT.heroes;ACT.heroes=function(){const r=_he.apply(this,arguments);try{
 document.querySelectorAll('#mbox .heroes [data-h]').forEach(b=>{const h=b.dataset.h;if(!RARE[h])return;
  if(unlocked(h)){if(!b.querySelector('.raretag'))b.insertAdjacentHTML('beforeend','<span class="raretag">RARE</span>');b.classList.add('rarehero');return}
  b.classList.add('lockedhero');b.dataset.act='lockedHero';const nm=b.querySelector('b');if(nm)nm.textContent='???';
  if(!b.querySelector('.raretag'))b.insertAdjacentHTML('beforeend','<span class="raretag lock">RARE</span>');b.title=RARE[h].need})}catch(e){console.warn(e)}return r};
ACT.lockedHero=d=>{const R=RARE[d.h];if(!R)return;toast(`Rare hero! ${R.need} to unlock (${R.prog()}).`)};
const _pv=ACT.pvHero;if(_pv)ACT.pvHero=function(d){if(d&&RARE[d.h]&&!unlocked(d.h))return ACT.lockedHero(d);return _pv.apply(this,arguments)};
const _pk=ACT.pickHero;if(_pk)ACT.pickHero=function(d){if(d&&RARE[d.h]&&!unlocked(d.h))return ACT.lockedHero(d);return _pk.apply(this,arguments)};
/* unlock moment: shown once, on the home screen */
function checkUnlocks(){if(!S.name||!document.getElementById('modal').hidden)return;S.rareSeen=S.rareSeen||{};
 const h=Object.keys(RARE).find(k=>RARE[k].ok()&&!S.rareSeen[k]);if(!h)return;S.rareSeen[h]=1;S.rareOwn=S.rareOwn||{};S.rareOwn[h]=1;save();
 try{sfx.win()}catch(e){}
 modal(`<div class="rareunlock"><div class="ru-tag">NEW RARE HERO!</div><div class="ru-hero">${zookSVG({},h,null)}</div><h2>${HEROES[h].name} joins you!</h2>
 <p class="muted" style="margin:0 0 10px">You unlocked ${HEROES[h].name} for this: ${RARE[h].need.toLowerCase()}. Only the most dedicated typists ever see this hero.</p>
 <div class="rbtns"><button class="btn" data-act="rareUse" data-h="${h}">Play as ${HEROES[h].name}</button><button class="btn alt" data-act="close">Maybe later</button></div></div>`)}
ACT.rareUse=d=>{S.hero=d.h;S.color=null;save();closeModal();try{renderHome()}catch(e){}toast(`${HEROES[d.h].name} is your hero now!`)};
const _rh=renderHome;renderHome=function(){const r=kkSafe(_rh,this,arguments);setTimeout(checkUnlocks,700);return r};
document.head.insertAdjacentHTML('beforeend',`<style>
.heroes .pl{position:relative}
#mbox .heroes{display:flex!important;flex-wrap:wrap;justify-content:center}#mbox .heroes>.pl{flex:0 0 calc(25% - 10px);box-sizing:border-box}@media (max-width:600px){#mbox .heroes>.pl{flex-basis:calc(50% - 10px)}}
.raretag{position:absolute;top:4px;right:4px;font:400 10px/1 var(--title,monospace);background:#f0c860;color:#2a1d3e;padding:3px 4px}
.raretag.lock{background:#3a2f4e;color:#c8bce0}
.lockedhero svg,.lockedhero img{filter:brightness(0) drop-shadow(0 0 3px #f0c86088);opacity:.75}
.rarehero{box-shadow:0 0 0 3px #f0c860 inset}
.rareunlock{text-align:center}.ru-tag{display:inline-block;font:400 14px var(--title,monospace);background:#f0c860;color:#2a1d3e;padding:6px 10px;margin-bottom:8px;animation:rupulse 1s steps(2) infinite}
.ru-hero{width:180px;height:180px;margin:0 auto;filter:drop-shadow(0 0 14px #f0c860aa)}.ru-hero svg,.ru-hero img{width:100%;height:100%}
@keyframes rupulse{50%{background:#fff6c0}}
</style>`);
})();
