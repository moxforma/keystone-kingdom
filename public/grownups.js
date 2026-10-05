/* One Grown-ups hub (behind one quick check per visit): progress report, parent settings / Focus mode,
   teacher dashboard, players, devices and reset. Kid Settings keeps only kid things. Home buttons put learning first. */
(function(){
const ICO=PXG(["..oooo..",".oPPPPo.",".oPPPPo.","..oooo..",".oTTTTo.","oTTTTTTo","oTTTTTTo","oooooooo"],{o:'#2a1d3e',P:'#f2cc8c',T:'#b8a0f0'}).toDataURL();
const CUP=PXG(['oooooooooooo','oYYYYYYYYYYo','oYoYYYYYYoYo','oYoYYYYYYoYo','.ooYYYYYYoo.','..oYYYYYYo..','...oYYYYo...','....oYYo....','...oooooo...','..oYYYYYYo..','..oooooooo..'],{o:'#2a1d3e',Y:'#f0c860'}).toDataURL();
let GATE=0;
const openHub=()=>{window.__gu=1;window.__clsOk=1;window.__guMode='';
 const card=(act,t,d,c)=>`<button class="guitem ${c}" data-act="${act}"><b>${t}</b><small>${d}</small></button>`;
 modal(`<h2>TEACHERS</h2><p class="muted" style="margin:0 0 10px">Settings and tools for parents and teachers.</p><div class="gugrid">
 ${card('guReport','Progress report','Speed, accuracy and tricky keys for every player','c1')}
 ${card('guParent','Focus mode','Turn the arcade, outfits and other extras on or off','c2')}
 ${card('guTeach','Teacher dashboard','Make a class, assign lessons, watch progress, class races','c3')}
 ${card('guPlayers','Players','Add, switch or delete players on this device','c4')}
 ${card('guDevices','Family code and reset','Play on more than one device with a family code, or start over from zero','c5')}
 </div><p class="gusupport">Keyloria is free with no ads. Enjoying it? <a href="https://ko-fi.com/keyloria" target="_blank" rel="noopener">Support Keyloria on Ko-fi</a></p><div class="rbtns"><button class="btn" data-act="close">DONE</button></div>`);const mb=document.getElementById('mbox');if(mb)mb.classList.add('guwide');try{fitModal()}catch(e){}};
ACT.grownups=()=>{if(window.__gu)return openHub();const a=6+Math.floor(Math.random()*4),b=3+Math.floor(Math.random()*7);GATE=a*b;
 modal(`<h2>TEACHERS AND PARENTS</h2><p class="muted" style="margin:0 0 8px">Quick check before you go in.</p><div class="pgatebox"><p class="pgq">What is ${a} × ${b}?</p><input id="gugate" class="pgin" inputmode="numeric" autocomplete="off" maxlength="3" aria-label="Answer"></div>
 <div class="rbtns"><button class="btn" data-act="guCheck">OK</button><button class="btn alt" data-act="close">BACK</button></div>`);setTimeout(()=>document.getElementById('gugate')?.focus(),50)};
ACT.guCheck=()=>{const v=+(document.getElementById('gugate')?.value||0);if(v!==GATE){try{sfx.bad()}catch(e){}toast('Not quite. Ask a grown-up!');return ACT.grownups()}openHub()};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='gugate'){e.preventDefault();e.stopPropagation();ACT.guCheck()}},true);
ACT.kofi=()=>{window.open('https://ko-fi.com/keyloria','_blank','noopener')};
ACT.howto=()=>{window.open('/','_blank','noopener')};
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


/* ---- Teacher password: protects the teacher dashboard (and class controls) on a shared device ---- */
const TPW='kl-teach-pw';
const tpw=()=>{try{return JSON.parse(localStorage.getItem(TPW)||'null')}catch(e){return null}};
const hash=async t=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('keyloria:'+t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
const needPw=()=>!!tpw()&&!window.__tpwOk;
let PW_NEXT=null;
const pwAsk=next=>{PW_NEXT=next;modal(`<h2>TEACHER PASSWORD</h2><p class="muted" style="margin:0 0 10px">The teacher dashboard on this device is locked.</p>
 <div class="pgatebox"><input id="tpwin" class="pgin" type="password" autocomplete="off" aria-label="Teacher password" style="width:260px;letter-spacing:.1em"></div>
 <div class="rbtns"><button class="btn" data-act="tpwCheck">UNLOCK</button><button class="btn alt" data-act="grownups">BACK</button></div>
 <p class="muted" style="margin:10px 0 0"><button class="linkbtn" data-act="tpwForgot">Forgot the password?</button></p>`);setTimeout(()=>document.getElementById('tpwin')?.focus(),50)};
ACT.tpwCheck=async()=>{const p=tpw(),v=document.getElementById('tpwin')?.value||'';if(p&&await hash(v)===p.h){window.__tpwOk=1;const n=PW_NEXT;PW_NEXT=null;return n?n():window.teachList()}
 try{sfx.bad()}catch(e){}toast('Wrong password');const i=document.getElementById('tpwin');if(i){i.value='';i.focus()}};
ACT.tpwForgot=()=>modal(`<h2>FORGOT PASSWORD</h2><p class="muted" style="margin:0 0 10px">Type the recovery code you saved when you set the password.</p>
 <div class="pgatebox"><input id="tpwrec" class="pgin" autocomplete="off" maxlength="9" aria-label="Recovery code" style="width:260px;text-transform:uppercase"></div>
 <div class="rbtns"><button class="btn" data-act="tpwRecover">REMOVE PASSWORD</button><button class="btn alt" data-act="grownups">BACK</button></div>`);
ACT.tpwRecover=async()=>{const p=tpw(),v=(document.getElementById('tpwrec')?.value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
 if(p&&await hash('rec:'+v)===p.r){try{localStorage.removeItem(TPW)}catch(e){}window.__tpwOk=1;toast('Password removed');return window.teachList()}toast('That code does not match')};
ACT.tpwSet=()=>{const has=!!tpw();modal(`<h2>${has?'CHANGE':'SET A'} TEACHER PASSWORD</h2><p class="muted" style="margin:0 0 10px">Locks the teacher dashboard and class controls on this device, so students can't change them even if they pass the maths question.</p>
 <div class="pgatebox" style="display:grid;gap:10px;justify-items:center"><input id="tpw1" class="pgin" type="password" autocomplete="new-password" placeholder="Password" aria-label="New password" style="width:280px"><input id="tpw2" class="pgin" type="password" autocomplete="new-password" placeholder="Type it again" aria-label="Repeat password" style="width:280px"></div>
 <div class="rbtns"><button class="btn" data-act="tpwSave">SAVE</button>${has?'<button class="btn alt" data-act="tpwOff">TURN OFF</button>':''}<button class="btn alt" data-act="tpwBack">BACK</button></div>`);setTimeout(()=>document.getElementById('tpw1')?.focus(),50)};
ACT.tpwBack=()=>ACT.clsDash?ACT.clsDash({}):window.teachList();
ACT.tpwOff=()=>{try{localStorage.removeItem(TPW)}catch(e){}toast('Password turned off');ACT.tpwBack()};
ACT.tpwSave=async()=>{const a=document.getElementById('tpw1')?.value||'',b=document.getElementById('tpw2')?.value||'';
 if(a.length<4)return toast('Use at least 4 characters');if(a!==b)return toast('The two passwords do not match');
 const AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',rnd=crypto.getRandomValues(new Uint8Array(8)),rec=[...rnd].map(x=>AL[x%AL.length]).join('');
 try{localStorage.setItem(TPW,JSON.stringify({h:await hash(a),r:await hash('rec:'+rec)}))}catch(e){return toast('Could not save')}window.__tpwOk=1;
 modal(`<h2>PASSWORD SAVED</h2><p class="muted" style="margin:0 0 8px">Write down this recovery code. It is the only way to remove the password if you forget it.</p><div class="cl-big">${rec.slice(0,4)}-${rec.slice(4)}</div>
 <div class="rbtns"><button class="btn" data-act="tpwBack">I WROTE IT DOWN</button></div>`)};
const _gt=ACT.guTeach;ACT.guTeach=function(){if(needPw())return pwAsk(()=>_gt());return _gt.apply(this,arguments)};
const _ct=ACT.clsTeach;if(_ct)ACT.clsTeach=function(){if(needPw())return pwAsk(()=>_ct());return _ct.apply(this,arguments)};
const _cd=ACT.clsDash;ACT.clsDash=function(d){if(needPw()&&!(d&&d.quiet))return pwAsk(()=>ACT.clsDash(d));const r=_cd.apply(this,arguments);
return r};
document.addEventListener('keydown',e=>{const id=e.target&&e.target.id;if(e.key!=='Enter')return;const m={tpwin:'tpwCheck',tpwrec:'tpwRecover',tpw2:'tpwSave'}[id];if(m){e.preventDefault();e.stopPropagation();ACT[m]()}},true);

/* ---- Keylori Collection: holo / gold / diamond counts get their icons ---- */
const TI={holo:PXG(['..ooo..','.oRYGo.','oRYGBPo','oYGBPRo','oGBPRYo','.oPRYo.','..ooo..'],{o:'#2a1d3e',R:'#ff8a9a',Y:'#f0e070',G:'#7fe8a0',B:'#7fc8f0',P:'#c8a0f0'}).toDataURL(),
 gold:PXG(['..ooo..','.oYYYo.','oYWYYDo','oYYYYDo','oYYYDDo','.oDDDo.','..ooo..'],{o:'#2a1d3e',Y:'#f0c860',W:'#fff6c0',D:'#c8981e'}).toDataURL(),
 diamond:PXG(['..ooooo..','.oWCCCBo.','oWCCCCCBo','ooooooooo','.oCCCCBo.','..oCCBo..','...oBo...','....o....'],{o:'#2a1d3e',W:'#ffffff',C:'#bfe2f6',B:'#7fb8e0'}).toDataURL()};
const _rb=renderBinder;renderBinder=function(){const r=_rb.apply(this,arguments);try{const sp=document.querySelector('#s-binder .topbar>span.muted');if(sp&&!sp.querySelector('.tico')){
 const C=Object.values(S.cards),n=C.length,holo=C.filter(x=>x.holo).length,gold=C.filter(x=>x.tier==='gold').length,dia=C.filter(x=>x.tier==='diamond').length;
 const it=(k,v,l)=>`<span class="tcount" title="${l}"><img class="tico" src="${TI[k]}" alt="">${v} ${l}</span>`;
 sp.innerHTML=`${n}/${typeof TOTAL!=='undefined'?TOTAL:''} ${it('holo',holo,'holo')}${it('gold',gold,'gold')}${it('diamond',dia,'diamond')}`;sp.classList.add('tcounts')}}catch(e){console.warn(e)}return r};
/* ---- Settings: kid things only, unless opened as "Devices and reset" from the hub ---- */
const _set=ACT.settings;ACT.settings=function(){const r=_set.apply(this,arguments);try{const box=document.getElementById('mbox');if(!box)return r;
 const mode=window.__guMode;
 if(mode==='devices'){box.querySelectorAll('.setsec').forEach(s=>{if(!s.classList.contains('famsec')&&!s.classList.contains('dangersec'))s.remove()});
  const h=box.querySelector('h2');if(h)h.textContent='Family code and reset';
  const done=[...box.querySelectorAll('[data-act=close]')].pop();if(done)done.outerHTML='<button class="btn" data-act="grownups">BACK</button>'}
 else{box.querySelectorAll('.parsec,.dangersec,.parrow').forEach(s=>s.remove());
  const done=[...box.querySelectorAll('[data-act=close]')].pop();
  if(done&&!box.querySelector('.gurow'))done.insertAdjacentHTML('beforebegin','<section class="setsec gurow"><div class="setrow"><span>Teachers<small class="muted" style="display:block">Progress report, focus mode, teacher dashboard, players, reset</small></span><button class="btn sm volt" data-act="grownups">OPEN</button></div></section>')}
 }catch(e){console.warn(e)}return r};
/* closing anything leaves "devices" mode */
const _md=modal;modal=function(){const mb=document.getElementById('mbox');if(mb)mb.classList.remove('guwide');const r=_md.apply(this,arguments);
 try{const box=document.getElementById('mbox'),dash=box.querySelector('.dashv'),ready=box.querySelector('.cl-big')&&/is ready/.test(box.querySelector('h2')?.textContent||'');
  if((dash||ready)&&!box.querySelector('.tpwrow')){const on=!!tpw(),rb=[...box.querySelectorAll('.rbtns')].pop();
   if(rb)rb.insertAdjacentHTML('beforebegin',`<p class="muted tpwrow" style="text-align:center;margin:12px 0 0">${on?'Teacher password is on.':ready?'Students use this device too?':'Shared device?'} <button class="linkbtn" data-act="tpwSet">${on?'Change teacher password':'Set a teacher password'}</button></p>`)}}catch(e){}
/* anything too wide for the popup gets a wider popup instead of being cut off */
 try{const box=document.getElementById('mbox');const fit=()=>{if(box&&!box.classList.contains('guwide')&&box.scrollWidth>box.clientWidth+2){box.classList.add('guwide');try{fitModal()}catch(e){}}};fit();requestAnimationFrame(fit);setTimeout(fit,150)}catch(e){}
 return r};
const _cm=closeModal;closeModal=function(){window.__guMode='';return _cm.apply(this,arguments)};

/* ---- Players: deleting only from the Grown-ups hub ---- */
const _pl=ACT.players;ACT.players=function(){const r=_pl.apply(this,arguments);try{const box=document.getElementById('mbox');
 if(window.__guMode!=='players')box.querySelectorAll('.pldel').forEach(b=>b.remove());
 else{const c=[...box.querySelectorAll('[data-act=close]')].pop();if(c&&!box.querySelector('.guback'))c.insertAdjacentHTML('beforebegin','<button class="btn alt guback" data-act="grownups">TEACHERS</button>')}}catch(e){}return r};

/* ---- Home: Grown-ups in the header, hero things on the hero card, learning first ---- */
const _rh=renderHome;renderHome=function(){const r=_rh.apply(this,arguments);try{const home=document.getElementById('s-home');if(!home||!S.name)return r;
 const tb=home.querySelector('.topbar');
 if(tb&&!tb.querySelector('.gubtn')){const anchor=tb.querySelector('.clsbtn')||tb.querySelector('.selp');const html=`<button class="btn gubtn" data-act="grownups"><img src="${ICO}" alt="">TEACHERS</button>`;anchor?anchor.insertAdjacentHTML('afterend',html):tb.insertAdjacentHTML('beforeend',html)}
 home.querySelectorAll('.linkbtn[data-to=parents]').forEach(l=>(l.closest('p')||l).remove());
 const hb=home.querySelector('.hbtns'),shop=hb&&hb.querySelector('[data-to=shop]'),change=home.querySelector('[data-act=heroes]');
 if(shop&&change){shop.classList.add('closetbtn');change.insertAdjacentElement('afterend',shop);change.parentElement.classList.add('herobtns')}
 if(hb){const q=s=>hb.querySelector(s);const order=[q('[data-act=play]'),q('[data-to=arcade]'),q('[data-to=map]'),q('[data-act=practice]'),q('[data-to=binder]')].filter(Boolean);
  if(typeof ACT.hiscores==='function'&&(typeof par!=='function'||par('arcade'))){let hs=q('.homehs');if(!hs){hb.insertAdjacentHTML('beforeend',`<button class="btn homehs" data-act="hiscores"><img class="bico" src="${CUP}" alt="">High Scores</button>`);hs=q('.homehs')}const bi=order.indexOf(q('[data-to=binder]'));order.splice(bi<0?order.length:bi,0,hs)}
  hb.classList.add('hgrid');const pr=q('[data-act=practice]');if(pr)pr.classList.toggle('half',!!q('.homehs'));const hs2=q('.homehs');if(hs2)hs2.classList.add('half');
  order.forEach(b=>{b.classList.remove('arcbig');if(b.dataset.act!=='play')b.classList.remove('big');hb.appendChild(b)})}
 home.querySelectorAll('.badges.rbadges2,.bdglbl').forEach(x=>x.remove());
 /* preview of the lesson they're on, at the top of the right-hand box */
 const tc=home.querySelector('.tcard .tc-l')||home.querySelector('.tcard');
 if(tc&&!home.querySelector('.nxcard')){try{const n=nextStage(),NS=typeof NST!=='undefined'?NST:8,i=Math.floor(n/NS),s=n%NS,L=LESSONS[i],R=REGIONS[L.r]||{};
  const f=typeof formNow==='function'?formNow(i):0,has=!!S.cards[i+'-'+f];
  const keys=L.k?[...L.k].map(c=>`<span style="--fc:${fcol(fingerOf(c))}">${c.toUpperCase()}</span>`).join(''):'';
  const pips=Array.from({length:NS},(_,k)=>`<i class="${(S.best[i+'-'+k]||0)>0?'done':''} ${k===s?'cur':''}"></i>`).join('');
  tc.insertAdjacentHTML('afterbegin',`<button class="nxcard" data-act="play" data-n="${n}" style="--rc:${R.color||'#7fe8d0'}"><span class="nx-art">${creatureSVG(i,f,'fit '+(has?'':'sil'))}</span><span class="nx-txt"><small>UP NEXT · ${esc(R.name||'')}</small><b>Lesson ${typeof LNUM==='function'?LNUM(i):i+1}: ${esc(lessonTitle(i))}</b><span class="nx-part">Part ${s+1} of ${NS} · ${esc(stageName(i,s))}</span><span class="nx-pips">${pips}</span>${keys?`<span class="minikeys">${keys}</span>`:''}</span></button>`)}catch(e){console.warn(e)}}
 }catch(e){console.warn(e)}return r};
document.head.insertAdjacentHTML('beforeend',`<style>
#s-home .topbar .btn.gubtn{background:#f0c860!important;color:#2a1d3e!important;box-shadow:4px 4px 0 rgba(4,6,24,.65)!important;height:42px!important;font-family:var(--title)!important;font-size:11px!important;padding:0 10px!important;letter-spacing:.04em;display:inline-flex;align-items:center;gap:6px;margin:0!important;min-height:0!important;line-height:1!important}
#s-home .topbar .btn.gubtn img{height:18px;image-rendering:pixelated}
.gugrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left}
.guitem{font:inherit;display:flex;flex-direction:column;gap:4px;padding:14px 16px;background:#1b1626;border:3px solid #3a2f4e;border-left-width:10px;color:#fff6e0;cursor:pointer;text-align:left}
.guitem:hover{background:#2a2238}.guitem b{font-size:22px}.guitem small{font-size:16px;color:#c8bce0}
.guitem.c1{border-left-color:#7fe8d0}.guitem.c2{border-left-color:#f0c860}.guitem.c3{border-left-color:#7fc8f0}.guitem.c4{border-left-color:#b8a0f0}.guitem.c5{border-left-color:#f07a6e}
#mbox .dashv .cl-racebtn{display:flex;justify-content:center;margin-top:12px}#mbox .dashv .cl-racebtn .btn{width:100%;font-family:var(--title)!important;font-size:18px!important;letter-spacing:.06em;padding:16px 12px!important;text-transform:uppercase}
#mbox .dashv .cl-lvl{justify-content:center}
#mbox .dashv>.rbtns{margin-top:26px!important}
.tcounts{display:inline-flex;align-items:center;gap:14px}.tcount{display:inline-flex;align-items:center;gap:6px}.tcount .tico{width:22px;height:22px;image-rendering:pixelated}
#s-home .clsban{max-width:640px;margin:4px auto 8px!important;background:#1c2f6e!important;border:4px solid #7fc8f0!important;box-shadow:6px 6px 0 #0d0a16!important;padding:6px 14px!important;color:#fff6e0;display:grid;gap:2px}
#s-home .clsban .cb-name{color:#bfe2f6!important;font-size:16px}
#s-home .clsban .cb-row{gap:12px;padding:0;margin:0!important}#s-home .clsban .cb-row>span:first-child{font-size:20px;color:#fff6e0;line-height:1.1}#s-home .clsban .cb-row b{color:#f0c860;font-weight:400}
#s-home .clsban .cb-row .btn{margin:3px 0 5px!important;min-width:110px;padding-top:6px!important;padding-bottom:6px!important}
#s-home .clsban .cb-name{line-height:1;margin:0}
#mbox .cl-list{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
#mbox .btn .muted{color:#4a3a1a!important;opacity:1!important}
#mbox.guwide{width:min(940px,96vw)!important;max-width:none!important;overflow-x:auto}
#mbox .hs-tab td,#mbox .hs-tab th{padding-left:8px;padding-right:8px}
#mbox .hs-tabs{flex-wrap:wrap!important}
@media (max-width:600px){#mbox .hs-tab{font-size:14px!important;width:100%}#mbox table.hs-tab.hs-tab td,#mbox table.hs-tab.hs-tab th{padding:4px 3px!important;font-size:15px!important}#mbox .hs-tab th:nth-last-child(1),#mbox .hs-tab td:nth-last-child(1),#mbox .hs-tab th:nth-last-child(2),#mbox .hs-tab td:nth-last-child(2){display:none}#mbox .hs-tabs button{font-size:13px!important;padding:4px 6px!important}}
.gusupport{margin:12px 0 0;font-size:17px;color:#c8bce0}.gusupport a{color:#f07a6e}
.gugrid .guitem:last-child:nth-child(odd){grid-column:1/-1}
#s-home .hbtns{display:grid!important;grid-template-columns:1fr 1fr!important;row-gap:11px!important;column-gap:6px!important}
#s-home .hbtns>.btn{grid-column:1/-1!important;width:100%!important;margin:0!important}
#s-home .hbtns>.btn.half{grid-column:auto!important}
#s-home .hbtns>.homehs{background:#c83a5c!important;color:#fff6e0!important;box-shadow:0 5px 0 #8a2240!important}
.nxcard{font:inherit;color:inherit;text-align:left;cursor:pointer;display:grid;grid-template-columns:84px 1fr;gap:14px;align-items:center;width:100%;padding:8px 14px;margin:0 0 10px;background:#1b1626;border:3px solid #3a2f4e;border-left:10px solid var(--rc);box-sizing:border-box}
.nxcard:hover{background:#241c36}.nx-art{width:84px;height:72px;overflow:hidden;position:relative;background:#120e1e;border:3px solid #3a2f4e}.nx-art>svg{position:absolute!important;left:50%!important;top:50%!important;width:210px!important;height:210px!important;max-width:none!important;margin:-112px 0 0 -105px!important;transform:none!important}.nx-art>svg.sil{filter:brightness(0) drop-shadow(0 0 3px #7fe8ff)!important;opacity:.85!important}
.nx-txt{display:flex;flex-direction:column;gap:3px;min-width:0}.nx-txt small{font-size:15px;color:var(--rc);letter-spacing:.06em}.nx-txt b{font-size:24px;color:#fff6e0;font-weight:400;line-height:1.1}
.nx-part{font-size:17px;color:#c8bce0}.nx-pips{display:flex;gap:4px;margin:2px 0}.nx-pips i{width:16px;height:8px;background:#3a2f4e}.nx-pips i.done{background:#f0c860}.nx-pips i.cur{background:#7fe8d0;box-shadow:0 0 0 2px #fff6e0}
.nxcard .minikeys{display:flex;gap:4px;margin-top:2px}.nxcard .minikeys span{min-width:24px;height:24px;display:grid;place-items:center;font-size:15px;background:var(--fc);color:#2a1d3e;padding:0 4px}
#s-home .hbtns>.btn.big{margin-bottom:10px!important}
#s-home .footbtns .kofibtn{background:#f07a6e!important;color:#2a1d3e!important;display:inline-flex;align-items:center;gap:6px}#s-home .footbtns .kofibtn img{height:16px;image-rendering:pixelated}
#s-home .footbtns .howtobtn{background:#6edc8c!important;color:#16301e!important}
#s-home .topbar .btn.selp,#s-home .topbar .btn.clsbtn,#s-home .topbar .btn.gubtn{font-family:var(--display)!important;font-size:22px!important;letter-spacing:.06em!important;text-transform:uppercase}
#mbox :is(p,small,li,td,label,.note,.muted,.cl-note,.setrow span):not(.pgq){font-size:20px!important}
#mbox .cl-sec,#mbox .raceHubBox{text-align:center}#mbox .cl-sec .cl-btns,#mbox .cl-sec .clfield,#mbox .cl-sec>div{justify-content:center;margin-left:auto;margin-right:auto}
.gurepname{text-align:center;margin:18px 0 10px}
.gutabs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 14px}.gutabs .btn.on{background:#f0c860!important;color:#2a1d3e!important}
.guall{width:100%;border-collapse:collapse;margin:0 0 14px;font-size:18px}.guall th,.guall td{padding:6px 10px;border-bottom:2px solid #3a2f4e;text-align:left}.guall tr.on td{color:#f0c860}
#s-home .herobtns{display:grid!important;grid-template-columns:1fr;gap:8px}
#s-home .herobtns>.btn{width:100%;margin:0!important}
#s-home .closetbtn{background:#a8d878!important;color:#2a1d3e!important}
</style>`);
try{if(screen==='home')renderHome()}catch(e){}
})();
