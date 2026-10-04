/* One Grown-ups hub (behind one quick check per visit): progress report, parent settings / Focus mode,
   teacher dashboard, players, devices and reset. Kid Settings keeps only kid things. Home buttons put learning first. */
(function(){
const ICO=PXG(["..oooo..",".oPPPPo.",".oPPPPo.","..oooo..",".oTTTTo.","oTTTTTTo","oTTTTTTo","oooooooo"],{o:'#2a1d3e',P:'#f2cc8c',T:'#b8a0f0'}).toDataURL();
let GATE=0;
const openHub=()=>{window.__gu=1;window.__clsOk=1;window.__guMode='';
 const card=(act,t,d,c)=>`<button class="guitem ${c}" data-act="${act}"><b>${t}</b><small>${d}</small></button>`;
 modal(`<h2>TEACHERS&#39; LOUNGE</h2><p class="muted" style="margin:0 0 10px">Settings and tools for parents and teachers.</p><div class="gugrid">
 ${card('guReport','Progress report','Speed, accuracy and tricky keys for every player','c1')}
 ${card('guParent','Parent settings','Focus mode and turning game features on or off','c2')}
 ${card('guTeach','Teacher dashboard','Make a class, assign lessons, watch progress, class races','c3')}
 ${card('guPlayers','Players','Add, switch or delete players on this device','c4')}
 ${card('guDevices','Family code and reset','Play on more than one device with a family code, or start over from zero','c5')}
 </div><p class="gusupport">Keyloria is free with no ads. Enjoying it? <a href="https://ko-fi.com/keyloria" target="_blank" rel="noopener">Support Keyloria on Ko-fi</a></p><div class="rbtns"><button class="btn" data-act="close">DONE</button></div>`);const mb=document.getElementById('mbox');if(mb)mb.classList.add('guwide');try{fitModal()}catch(e){}};
ACT.grownups=()=>{if(window.__gu)return openHub();const a=6+Math.floor(Math.random()*4),b=3+Math.floor(Math.random()*7);GATE=a*b;
 modal(`<h2>TEACHERS AND PARENTS</h2><p class="muted" style="margin:0 0 8px">Quick check before you go in.</p><div class="pgatebox"><p class="pgq">What is ${a} × ${b}?</p><input id="gugate" class="pgin" inputmode="numeric" autocomplete="off" maxlength="3" aria-label="Answer"></div>
 <div class="rbtns"><button class="btn" data-act="guCheck">OK</button><button class="btn alt" data-act="close">BACK</button></div>`);setTimeout(()=>document.getElementById('gugate')?.focus(),50)};
ACT.guCheck=()=>{const v=+(document.getElementById('gugate')?.value||0);if(v!==GATE){try{sfx.bad()}catch(e){}toast('Not quite. Ask a grown-up!');return ACT.grownups()}openHub()};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='gugate'){e.preventDefault();e.stopPropagation();ACT.guCheck()}},true);
ACT.guReport=()=>{window.__repId=null;closeModal();show('parents')};
/* progress report covers every player on this device: an overview table + a tab per player */
ACT.guRep=d=>{window.__repId=d.id;renderParents();scrollTo(0,0)};
const _rp=renderParents;renderParents=function(){try{save()}catch(e){}
 const list=(typeof PROF!=='undefined'&&PROF.list)||[],cur=typeof PROF!=='undefined'?PROF.cur:null,id=window.__repId&&list.includes(window.__repId)?window.__repId:cur;
 const get=k=>k===cur?S:Object.assign(structuredClone(DEF),peek(k));
 const keep=S;let r;if(id!==cur)S=get(id);try{r=_rp.apply(this,arguments)}finally{S=keep}
 try{const box=document.getElementById('s-parents'),tb=box&&box.querySelector('.topbar');if(!tb||list.length<1)return r;
  const avg=(a,f)=>a.length?Math.round(a.reduce((s,x)=>s+f(x),0)/a.length):0;
  const rows=list.map(k=>{const d=get(k),last=(d.hist||[]).slice(-10),done=Object.values(d.best||{}).filter(b=>b>=1).length;
   return `<tr class="${k===id?'on':''}"><td><b>${esc(d.name||'Player')}</b></td><td>${Math.round((d.time||0)/60)} min</td><td>${done}/${LESSONS.length*8}</td><td>${last.length?avg(last,x=>x.a)+'%':'–'}</td><td>${last.length?avg(last,x=>x.w):'–'}</td></tr>`}).join('');
  const nm=esc(get(id).name||'Player');
  tb.insertAdjacentHTML('afterend',`<div class="panel pbox"><h3>All players</h3><table class="guall"><tr><th>Player</th><th>Time</th><th>Levels</th><th>Accuracy</th><th>WPM</th></tr>${rows}</table>
   ${list.length>1?`<div class="gutabs">${list.map(k=>`<button class="btn sm ${k===id?'on':'alt'}" data-act="guRep" data-id="${k}">${esc(get(k).name||'Player')}</button>`).join('')}</div>`:''}</div><h2 class="gurepname">Details for ${nm}</h2>`);
 }catch(e){console.warn(e)}return r};
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
  const h=box.querySelector('h2');if(h)h.textContent='Family code and reset';
  const done=[...box.querySelectorAll('[data-act=close]')].pop();if(done)done.outerHTML='<button class="btn" data-act="grownups">BACK</button>'}
 else{box.querySelectorAll('.famsec,.parsec,.dangersec,.parrow').forEach(s=>s.remove());
  const done=[...box.querySelectorAll('[data-act=close]')].pop();
  if(done&&!box.querySelector('.gurow'))done.insertAdjacentHTML('beforebegin','<section class="setsec gurow"><div class="setrow"><span>Teachers&#39; Lounge<small class="muted" style="display:block">Progress report, parent settings, teacher dashboard, players, family code</small></span><button class="btn sm volt" data-act="grownups">OPEN</button></div></section>')}
 }catch(e){console.warn(e)}return r};
/* closing anything leaves "devices" mode */
const _md=modal;modal=function(){const mb=document.getElementById('mbox');if(mb)mb.classList.remove('guwide');return _md.apply(this,arguments)};
const _cm=closeModal;closeModal=function(){window.__guMode='';return _cm.apply(this,arguments)};

/* ---- Players: deleting only from the Grown-ups hub ---- */
const _pl=ACT.players;ACT.players=function(){const r=_pl.apply(this,arguments);try{const box=document.getElementById('mbox');
 if(window.__guMode!=='players')box.querySelectorAll('.pldel').forEach(b=>b.remove());
 else{const c=[...box.querySelectorAll('[data-act=close]')].pop();if(c&&!box.querySelector('.guback'))c.insertAdjacentHTML('beforebegin','<button class="btn alt guback" data-act="grownups">TEACHERS&#39; LOUNGE</button>')}}catch(e){}return r};

/* ---- Home: Grown-ups in the header, hero things on the hero card, learning first ---- */
const _rh=renderHome;renderHome=function(){const r=_rh.apply(this,arguments);try{const home=document.getElementById('s-home');if(!home||!S.name)return r;
 const tb=home.querySelector('.topbar');
 if(tb&&!tb.querySelector('.gubtn')){const anchor=tb.querySelector('.clsbtn')||tb.querySelector('.selp');const html=`<button class="btn gubtn" data-act="grownups"><img src="${ICO}" alt="">TEACHERS&#39; LOUNGE</button>`;anchor?anchor.insertAdjacentHTML('afterend',html):tb.insertAdjacentHTML('beforeend',html)}
 home.querySelectorAll('.linkbtn[data-to=parents]').forEach(l=>(l.closest('p')||l).remove());
 const hb=home.querySelector('.hbtns'),shop=hb&&hb.querySelector('[data-to=shop]'),change=home.querySelector('[data-act=heroes]');
 if(shop&&change){shop.classList.add('closetbtn');change.insertAdjacentElement('afterend',shop);change.parentElement.classList.add('herobtns')}
 if(hb){const q=s=>hb.querySelector(s);const order=[q('[data-act=play]'),q('[data-to=arcade]'),q('[data-to=map]'),q('[data-act=practice]'),q('[data-to=binder]')].filter(Boolean);
  if(typeof ACT.hiscores==='function'&&(typeof par!=='function'||par('arcade'))){let hs=q('.homehs');if(!hs){hb.insertAdjacentHTML('beforeend','<button class="btn homehs" data-act="hiscores">High Scores</button>');hs=q('.homehs')}order.push(hs)}
  order.forEach(b=>{b.classList.remove('arcbig');if(b.dataset.act!=='play')b.classList.remove('big');hb.appendChild(b)})}
 const bd=home.querySelector('.badges.rbadges2');if(bd&&!home.querySelector('.bdglbl'))bd.insertAdjacentHTML('beforebegin','<div class="bdglbl">Region badges<small>finish every lesson in a region to earn its badge</small></div>');
 }catch(e){console.warn(e)}return r};
document.head.insertAdjacentHTML('beforeend',`<style>
#s-home .topbar .btn.gubtn{background:#f0c860!important;color:#2a1d3e!important;box-shadow:4px 4px 0 rgba(4,6,24,.65)!important;height:42px!important;font-family:var(--title)!important;font-size:13px!important;padding:0 10px!important;letter-spacing:.04em;display:inline-flex;align-items:center;gap:6px;margin:0!important;min-height:0!important;line-height:1!important}
#s-home .topbar .btn.gubtn img{height:18px;image-rendering:pixelated}
.gugrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left}
.guitem{font:inherit;display:flex;flex-direction:column;gap:4px;padding:14px 16px;background:#1b1626;border:3px solid #3a2f4e;border-left-width:10px;color:#fff6e0;cursor:pointer;text-align:left}
.guitem:hover{background:#2a2238}.guitem b{font-size:22px}.guitem small{font-size:16px;color:#c8bce0}
.guitem.c1{border-left-color:#7fe8d0}.guitem.c2{border-left-color:#f0c860}.guitem.c3{border-left-color:#7fc8f0}.guitem.c4{border-left-color:#b8a0f0}.guitem.c5{border-left-color:#f07a6e}
#mbox.guwide{width:min(900px,94vw)!important;max-width:none!important}
.gusupport{margin:12px 0 0;font-size:17px;color:#c8bce0}.gusupport a{color:#f07a6e}
.gugrid .guitem:last-child:nth-child(odd){grid-column:1/-1}
#s-home .hbtns{display:flex!important;flex-direction:column!important;gap:8px!important}
#s-home .hbtns>.btn{grid-column:1/-1!important;flex:0 0 auto!important;width:100%!important;margin:0!important}
.bdglbl{font-size:18px;color:#fff6e0;margin:6px 0 0}.bdglbl small{display:block;font-size:15px;color:#c8bce0}
#s-home .footbtns a.btn{font-size:inherit;display:inline-flex;align-items:center}
#mbox :is(p,small,li,td,label,.note,.muted,.cl-note,.setrow span):not(.pgq){font-size:20px!important}
#mbox .cl-sec,#mbox .raceHubBox{text-align:center}#mbox .cl-sec .cl-btns,#mbox .cl-sec .clfield,#mbox .cl-sec>div{justify-content:center;margin-left:auto;margin-right:auto}
.gurepname{text-align:center;margin:18px 0 10px}
.gutabs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 14px}.gutabs .btn.on{background:#f0c860!important;color:#2a1d3e!important}
.guall{width:100%;border-collapse:collapse;margin:0 0 14px;font-size:18px}.guall th,.guall td{padding:6px 10px;border-bottom:2px solid #3a2f4e;text-align:left}.guall tr.on td{color:#f0c860}
#s-home .herobtns{display:grid!important;grid-template-columns:1fr;gap:8px}
#s-home .herobtns>.btn{width:100%;margin:0!important}
#s-home .hbtns>.homehs{background:#f0c860!important;color:#2a1d3e!important}
#s-home .closetbtn{background:#a8d878!important;color:#2a1d3e!important}
</style>`);
try{if(screen==='home')renderHome()}catch(e){}
})();
