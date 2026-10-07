/* Full screen button on the home screen (desktop, tablets and phones that allow it) */
(function(){
const el=document.documentElement;
const can=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
const isFs=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
const PX=(rows)=>{const c={o:'#fff6e0'};return `<svg viewBox="0 0 9 9" width="20" height="20" shape-rendering="crispEdges" aria-hidden="true">${rows.map((r,y)=>[...r].map((ch,x)=>ch==='o'?`<rect x="${x}" y="${y}" width="1" height="1" fill="${c.o}"/>`:'').join('')).join('')}</svg>`};
const ON=PX(['ooo...ooo','o.......o','o.......o','.........','.........','.........','o.......o','o.......o','ooo...ooo']);
const OFF=PX(['..o...o..','..o...o..','ooo...ooo','.........','.........','.........','ooo...ooo','..o...o..','..o...o..']);
window.kkFullscreen=()=>{try{if(isFs()){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}
 else{const p=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);
  if(p&&p.then)p.then(()=>{if(window.KK_WANTLAND&&screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}).catch(()=>{})}}catch(e){}};
ACT.fullscreen=()=>window.kkFullscreen();
const btnHTML=()=>`<button class="icon-btn fsbtn" data-act="fullscreen" aria-label="${isFs()?'Exit full screen':'Full screen'}" title="${isFs()?'Exit full screen':'Full screen'}">${isFs()?OFF:ON}</button>`;
function place(){if(!can)return;const tb=document.querySelector('#s-home .topbar');if(!tb)return;const old=tb.querySelector('.fsbtn');
 if(old){old.outerHTML=btnHTML();return}const gear=tb.querySelector('[data-act=settings]');gear?gear.insertAdjacentHTML('beforebegin',btnHTML()):tb.insertAdjacentHTML('beforeend',btnHTML())}
const _rh=renderHome;renderHome=function(){const r=kkSafe(_rh,this,arguments);try{place()}catch(e){}return r};
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,place));
document.head.insertAdjacentHTML('beforeend','<style>.fsbtn svg{display:block;margin:auto;image-rendering:pixelated}</style>');
try{place()}catch(e){}
})();
