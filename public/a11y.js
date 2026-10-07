/* Keyboard access: every clickable thing can be reached with Tab and used with Enter/Space,
   and pop-ups behave like dialogs (Tab stays inside, focus returns afterwards). */
(function(){
const NATIVE=/^(BUTTON|A|INPUT|SELECT|TEXTAREA|SUMMARY)$/;
function fix(root){(root||document).querySelectorAll('[data-act]').forEach(el=>{if(NATIVE.test(el.tagName)||el.hasAttribute('tabindex'))return;
 el.setAttribute('tabindex','0');if(!el.hasAttribute('role'))el.setAttribute('role','button');
 if(!el.hasAttribute('aria-label')){const t=(el.getAttribute('title')||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,60);if(t)el.setAttribute('aria-label',t)}})}
let q=0;new MutationObserver(()=>{if(q)return;if(typeof screen!=='undefined'&&(screen==='play'||screen==='game')&&document.getElementById('modal')?.hidden)return;q=requestAnimationFrame(()=>{q=0;fix()})}).observe(document.body,{childList:true,subtree:true});fix();
document.addEventListener('keydown',e=>{const el=e.target;if(!el||!el.dataset||!el.dataset.act||NATIVE.test(el.tagName))return;
 if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();el.click()}},true);
/* dialogs */
const M=document.getElementById('modal'),B=document.getElementById('mbox');if(!M||!B)return;
M.setAttribute('role','dialog');M.setAttribute('aria-modal','true');
let back=null;
const focusables=()=>[...B.querySelectorAll('button:not([disabled]),a[href],input:not([type=hidden]),select,textarea,[tabindex="0"]')].filter(x=>x.offsetParent!==null);
new MutationObserver(()=>{if(!M.hidden){const h=B.querySelector('h2');if(h){h.id=h.id||'mtitle';M.setAttribute('aria-labelledby',h.id)}if(!back&&document.activeElement&&!B.contains(document.activeElement))back=document.activeElement}
 else if(back){const b=back;back=null;try{if(document.body.contains(b)&&b.focus)b.focus({preventScroll:true})}catch(e){}}}).observe(M,{attributes:true,attributeFilter:['hidden']});
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||M.hidden)return;const f=focusables();if(!f.length)return;const i=f.indexOf(document.activeElement);
 if(i<0){e.preventDefault();f[0].focus();return}
 if(e.shiftKey&&i===0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}},true);
document.head.insertAdjacentHTML('beforeend','<style>[data-act][tabindex]:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #f0c860!important;outline-offset:2px}</style>');
})();
/* Enter/Space on a focused pop-up button presses THAT button (not the default one) */
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!document.getElementById('modal')?.hidden){const a=document.activeElement;if(a&&document.getElementById('mbox')?.contains(a)&&/^(BUTTON|A)$/.test(a.tagName))e.stopPropagation()}},true);
/* Escape during a lesson or game asks first: press it twice to leave */
(function(){let armed=0;
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||typeof screen==='undefined'||(screen!=='play'&&screen!=='game')||!document.getElementById('modal')?.hidden)return;
 if(Date.now()-armed<2500){armed=0;return}
 armed=Date.now();e.preventDefault();e.stopPropagation();try{toast('Press Esc again to leave')}catch(x){}},true)})();
