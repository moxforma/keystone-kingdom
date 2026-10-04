/* One Grown-ups hub (behind one quick check per visit): progress report, parent settings / Focus mode,
   teacher dashboard, players, devices and reset. Kid Settings keeps only kid things. Home buttons put learning first. */
(function(){
const ICO=PXG(["..oooo..",".oPPPPo.",".oPPPPo.","..oooo..",".oTTTTo.","oTTTTTTo","oTTTTTTo","oooooooo"],{o:'#2a1d3e',P:'#f2cc8c',T:'#b8a0f0'}).toDataURL();
let GATE=0;
const openHub=()=>{window.__gu=1;window.__clsOk=1;window.__guMode='';
 const card=(act,t,d,c)=>`<button class="guitem ${c}" data-act="${act}"><b>${t}</b><small>${d}</small></button>`;
 modal(`<h2>GROWN-UPS</h2><p class="muted" style="margin:0 0 10px">Settings and tools for parents and teachers.</p><div class="gugrid">
 ${card('guReport','Progress report','Speed, accuracy, tricky keys and tips for '+esc(S.name||'this player'),'c1')}
 ${card('guParent','Parent settings','Focus mode and turning game features on or off','c2')}
 ${card('guTeach','Teacher dashboard','Make a class, assign lessons, watch progress, class races','c3')}
 ${card('guPlayers','Players','Add, switch or delete players on this device','c4')}
 ${card('guDevices','Devices and reset','Family code for more devices, or start over from zero','c5')}
 </div><div class="rbtns"><button class="btn" data-act="close">DONE</button></div>`)};
ACT.grownups=()=>{if(window.__gu)return openHub();const a=6+Math.floor(Math.random()*4),b=3+Math.floor(Math.random()*7);GATE=a*b;
 modal(`<h2>GROWN-UPS ONLY</h2><div class="pgatebox"><p class="pgq">What is ${a} × ${b}?</p><input id="gugate" class="pgin" inputmode="numeric" autocomplete="off" maxlength="3" aria-label="Answer"></div>
 <div class="rbtns"><button class="btn" data-act="guCheck">OK</button><button class="btn alt" data-act="close">BACK</button></div>`);setTimeout(()=>document.getElementById('gugate')?.focus(),50)};
ACT.guCheck=()=>{const v=+(document.getElementById('gugate')?.value||0);if(v!==GATE){try{sfx.bad()}catch(e){}toast('Not quite. Ask a grown-up!');return ACT.grownups()}openHub()};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='gugate'){e.preventDefault();e.stopPropagation();ACT.guCheck()}},true);
ACT.guReport=()=>{closeModal();show('parents')};
ACT.guParent=()=>{window.parPanel&&parPanel()};
ACT.guTeach=()=>{window.teachList&&teachList()};
ACT.guPlayers=()=>{window.__guMode='players';ACT.players()};
ACT.guDevices=()=>{window.__guMode='devices';ACT.settings()};
/* the parent-settings gate inside Settings now opens the hub's parent settings directly once checked */
const _pg=ACT.parGate;ACT.parGate=function(){if(window.__gu)return parPanel();return _pg.apply(this,arguments)};

/* ---- Settings: kid things only, unless opened as "Devices and reset" from the hub ---- */
const _set=ACT.settings;ACT.settings=function(){const r=_set.apply(this,arguments);try{const box=document.getElementById('mbox');if(!box)return r;
 const mode=window.__guMode;
 if(mode==='devices'){box.querySelectorAll('.setsec').forEach(s=>{if(!s.classList.contains('famsec')&&!s.classList.contains('dangersec'))s.remove()});
  const h=box.querySelector('h2');if(h)h.textContent='Devices and reset';
  const done=[...box.querySelectorAll('[data-act=close]')].pop();if(done)done.outerHTML='<button class="btn" data-act="grownups">BACK</button>'}
 else{box.querySelectorAll('.famsec,.parsec,.dangersec,.parrow').forEach(s=>s.remove());
  const done=[...box.querySelectorAll('[data-act=close]')].pop();
  if(done&&!box.querySelector('.gurow'))done.insertAdjacentHTML('beforebegin','<section class="setsec gurow"><div class="setrow"><span>Grown-ups<small class="muted" style="display:block;font-size:16px">Progress report, parent settings, teacher dashboard, players and devices</small></span><button class="btn sm volt" data-act="grownups">OPEN</button></div></section>')}
 }catch(e){console.warn(e)}return r};
/* closing anything leaves "devices" mode */
const _cm=closeModal;closeModal=function(){window.__guMode='';return _cm.apply(this,arguments)};

/* ---- Players: deleting only from the Grown-ups hub ---- */
const _pl=ACT.players;ACT.players=function(){const r=_pl.apply(this,arguments);try{const box=document.getElementById('mbox');
 if(window.__guMode!=='players')box.querySelectorAll('.pldel').forEach(b=>b.remove());
 else{const c=[...box.querySelectorAll('[data-act=close]')].pop();if(c&&!box.querySelector('.guback'))c.insertAdjacentHTML('beforebegin','<button class="btn alt guback" data-act="grownups">GROWN-UPS MENU</button>')}}catch(e){}return r};

/* ---- Home: Grown-ups in the header, hero things on the hero card, learning first ---- */
const _rh=renderHome;renderHome=function(){const r=_rh.apply(this,arguments);try{const home=document.getElementById('s-home');if(!home||!S.name)return r;
 const tb=home.querySelector('.topbar');
 if(tb&&!tb.querySelector('.gubtn')){const anchor=tb.querySelector('.clsbtn')||tb.querySelector('.selp');const html=`<button class="btn gubtn" data-act="grownups"><img src="${ICO}" alt="">GROWN-UPS</button>`;anchor?anchor.insertAdjacentHTML('afterend',html):tb.insertAdjacentHTML('beforeend',html)}
 home.querySelectorAll('.linkbtn[data-to=parents]').forEach(l=>(l.closest('p')||l).remove());
 const hb=home.querySelector('.hbtns'),shop=hb&&hb.querySelector('[data-to=shop]'),change=home.querySelector('[data-act=heroes]');
 if(shop&&change){shop.classList.add('closetbtn');change.insertAdjacentElement('afterend',shop);change.parentElement.classList.add('herobtns')}
 if(hb){const q=s=>hb.querySelector(s);const order=[q('[data-act=play]'),q('[data-to=map]'),q('[data-act=practice]'),q('[data-to=arcade]'),q('[data-to=binder]')].filter(Boolean);
  order.forEach(b=>{b.classList.remove('arcbig');if(b.dataset.act!=='play')b.classList.remove('big');hb.appendChild(b)})}
 }catch(e){console.warn(e)}return r};
document.head.insertAdjacentHTML('beforeend',`<style>
#s-home .topbar .btn.gubtn{background:#b8a0f0!important;color:#2a1d3e!important;font-size:inherit;display:inline-flex;align-items:center;gap:6px}
#s-home .topbar .btn.gubtn img{height:18px;image-rendering:pixelated}
.gugrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left}
.guitem{font:inherit;display:flex;flex-direction:column;gap:4px;padding:14px 16px;background:#1b1626;border:3px solid #3a2f4e;border-left-width:10px;color:#fff6e0;cursor:pointer;text-align:left}
.guitem:hover{background:#2a2238}.guitem b{font-size:22px}.guitem small{font-size:16px;color:#c8bce0}
.guitem.c1{border-left-color:#7fe8d0}.guitem.c2{border-left-color:#f0c860}.guitem.c3{border-left-color:#7fc8f0}.guitem.c4{border-left-color:#b8a0f0}.guitem.c5{border-left-color:#f07a6e}
.gugrid .guitem:last-child:nth-child(odd){grid-column:1/-1}
#s-home .hbtns>.btn{grid-column:auto!important;flex:1 1 calc(50% - 8px)!important}
#s-home .hbtns>.btn.big{grid-column:1/-1!important;flex:1 1 100%!important}
#s-home .hbtns>[data-to=arcade],#s-home .hbtns>[data-to=binder]{grid-column:auto!important;flex:1 1 calc(50% - 8px)!important}
#s-home .herobtns{display:grid!important;grid-template-columns:1fr;gap:8px}
#s-home .herobtns>.btn{width:100%;margin:0!important}
#s-home .closetbtn{background:#a8d878!important;color:#2a1d3e!important}
</style>`);
try{if(screen==='home')renderHome()}catch(e){}
})();
