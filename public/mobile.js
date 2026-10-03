/* Mobile mode: phones/tablets type with their own keyboard (no on-screen keyboard), single-column layouts */
(function(){
const MOB=/[?&]mobile=1/.test(location.search)||(!/[?&]mobile=0/.test(location.search)&&matchMedia('(pointer:coarse)').matches&&Math.min(window.screen.width,window.screen.height)<=900);
window.KK_MOBILE=MOB;if(!MOB)return;
document.body.classList.add('mobile');try{roamStop&&roamStop();document.getElementById('roam')?.remove()}catch(e){}

/* ---------- typing through the phone's own keyboard ---------- */
const inp=document.createElement('input');inp.id='mobin';
Object.entries({type:'text',autocomplete:'off',autocorrect:'off',autocapitalize:'off',spellcheck:'false',inputmode:'text',enterkeyhint:'go','aria-label':'Type here'}).forEach(([k,v])=>inp.setAttribute(k,v));
document.body.appendChild(inp);
const send=key=>document.body.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
inp.addEventListener('input',()=>{const v=inp.value;inp.value='';for(const ch of v)send(ch)});
inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send('Enter')}});
const typing=()=>(screen==='play'||screen==='game')&&$('#modal').hidden;
function focusType(){if(!typing())return;try{inp.focus({preventScroll:true})}catch(e){inp.focus()}}
const btn=document.createElement('button');btn.id='mtype';btn.className='btn';btn.innerHTML='⌨ Tap here to type';document.body.appendChild(btn);
btn.addEventListener('click',e=>{e.preventDefault();focusType()});
const sync=()=>{const show=typing()&&document.activeElement!==inp;btn.hidden=!show;document.body.classList.toggle('mtyping',typing()&&!show)};
inp.addEventListener('focus',()=>{sync();setTimeout(()=>scrollTo(0,0),60)});inp.addEventListener('blur',()=>setTimeout(sync,50));setInterval(sync,500);
document.addEventListener('click',e=>{if(e.target.closest('#arena,#garena,.strip-wrap,#gstrip,#strip'))focusType()});
['startStage','mountGame'].forEach(n=>{if(typeof window[n]!=='function')return;const f=window[n];window[n]=function(){const r=f.apply(this,arguments);focusType();setTimeout(sync,0);return r}});
const _md=modal;modal=function(){const r=_md.apply(this,arguments);if(document.activeElement===inp)inp.blur();return r};
const _cm=closeModal;closeModal=function(){const r=_cm.apply(this,arguments);setTimeout(()=>{if(typing())focusType()},0);return r};
/* tap the lesson splash to start */
document.addEventListener('click',e=>{if(e.target.closest('#lsplash')&&typeof SPLASH!=='undefined'&&SPLASH&&SPLASH.classList.contains('ready')){SPLASH._done();focusType()}});
if(typeof lessonSplash==='function'){const _ls=lessonSplash;lessonSplash=function(){const r=_ls.apply(this,arguments);const g=document.querySelector('#lsplash .ls-go');if(g)g.textContent='Tap to start';return r}}

/* ---------- layout ---------- */
if(typeof fitHome==='function'){fitHome=function(){const h=document.getElementById('s-home');if(h){h.style.transform='';h.style.marginBottom='';h.classList.remove('wide')}document.body.classList.remove('homewide')}}
document.head.insertAdjacentHTML('beforeend',`<style id="mobcss">
#mobin{position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0;font-size:16px;border:0;padding:0;pointer-events:none}
#mtype{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:60;font-size:18px!important;padding:12px 18px!important;background:#f0c860!important;color:#2a1d3e!important}
#mtype[hidden]{display:none}
body.mobile .screen{zoom:1!important;padding-left:10px!important;padding-right:10px!important;max-width:100vw!important;box-sizing:border-box}
body.mobile #kbwrap,body.mobile .kbwrap,body.mobile #roam,body.mobile .roamtog,body.mobile .linesw{display:none!important}
body.mobile #s-home{transform:none!important}
body.mobile #s-home .topbar{flex-wrap:wrap;gap:6px;justify-content:flex-start}
body.mobile #s-home .topbar .selp{margin-right:auto!important}
body.mobile #s-home .logo{max-width:78%;margin:0 auto 6px}
body.mobile #s-home .home-grid{display:flex!important;flex-direction:column;gap:12px!important}
body.mobile #s-home .hero-big{width:100%!important;max-width:none!important;display:flex;flex-direction:column;align-items:center}
body.mobile #s-home .hero-big .zk,body.mobile #s-home .hero-big>svg{max-width:150px;max-height:150px}
body.mobile #s-home .hero-info{width:100%!important;max-width:none!important;box-sizing:border-box}
body.mobile #s-home .tcard{width:100%!important;max-width:none!important;box-sizing:border-box}
body.mobile #s-home .hbtns .btn{font-size:16px!important}
body.mobile #s-home .tcard{order:1}body.mobile #s-home .hero-big{order:2}
body.mobile #s-home .visrow{display:grid!important;grid-template-columns:58px 1fr;gap:8px}body.mobile #s-home .visrow .vis-next{display:none}body.mobile #s-home .vis-txt{width:auto!important}
body.mobile #s-home .tcard p.note:last-child{display:none}
body.mobile #s-home .footbtns{flex-wrap:wrap}
body.mobile #hud .fsz,body.mobile #ghud .fsz{display:none!important}
body.mobile #hud,body.mobile #ghud{gap:6px!important;margin-bottom:6px!important}
body.mobile #hud .ht span,body.mobile #ghud .ht span{font-size:12px!important}
body.mobile #hud .ht b,body.mobile #ghud .ht b,body.mobile #ghud h2{font-size:17px!important}
body.mobile .hud{display:flex!important;flex-wrap:nowrap!important;align-items:center}
body.mobile .hud .ht{flex:1;min-width:0}body.mobile .hud .ht span{display:none!important}body.mobile .hud .ht b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
body.mobile .hud .stat{padding:2px 6px!important;min-width:0!important;flex:none}body.mobile .hud .stat b{font-size:16px!important;line-height:1.1}body.mobile .hud .stat span{font-size:9px!important}
body.mobile .hud [data-act=sayit]{display:none!important}
body.mobile #hud .icon-btn,body.mobile #ghud .icon-btn{width:34px!important;height:34px!important}
body.mobile #s-play{display:flex;flex-direction:column}
body.mobile #s-play .strip-wrap{order:2}body.mobile #s-play .arena{order:3;height:30vh!important;min-height:170px}body.mobile #s-play #hud{order:1}
body.mobile #s-game{display:flex;flex-direction:column}
body.mobile #s-game #gsw{order:2}body.mobile #s-game #garena{order:3;height:34vh!important;min-height:190px}body.mobile #s-game #ghint{order:4}body.mobile #s-game #trkG{order:1}
body.mobile.mtyping .strip-wrap,body.mobile.mtyping .gstrip{position:sticky;top:0;z-index:20}
body.mobile #s-arcade .games{grid-template-columns:1fr 1fr!important;gap:8px}
body.mobile #s-arcade .game .gart{transform:scale(.7);transform-origin:center}
body.mobile #s-arcade .game h3{font-size:17px}body.mobile #s-arcade .game > p{font-size:13px;min-height:3.2em}
body.mobile #s-arcade .topbar{flex-wrap:wrap;gap:6px}
body.mobile #s-map .wpick{grid-template-columns:repeat(6,1fr)!important;gap:4px}
body.mobile #s-map .wpick .wp small{font-size:10px}
body.mobile #s-map .lessons{grid-template-columns:1fr!important}
body.mobile #mbox{max-width:94vw!important;box-sizing:border-box}
body.mobile #mbox .fcols{grid-template-columns:1fr!important;display:block}
body.mobile .ls-box{max-width:90vw}
</style>`);
try{if(screen==='home')renderHome()}catch(e){}
})();
