/* Tidier completion boxes: icon buttons, one-line run stats, Keylori speech bubble, clearer tips */
(function(){
/* clearer tips */
if(typeof TIPS!=='undefined'){const NEW=['Keep your eyes on the screen, not your hands!','Sit up tall and relax your shoulders!','After each key, rest your fingers on A S D F and J K L ;','Slow is OK! Getting it right comes first.'];TIPS.length=0;NEW.forEach(t=>TIPS.push(t))}
const HOME=PXG(["....oooo....","...oRRRRo...","..oRRRRRRo..",".oRRRRRRRRo.","oRRRRRRRRRRo","oooWWWWWWooo","..oWWBBWWo..","..oWWBBWWo..","..oWWBBWWo..","..oooooooo.."],{o:'#2a1d3e',R:'#e8584f',W:'#fff6e0',B:'#8a5a2a'}).toDataURL();
const ICON_FOR={map:['map','Map'],arcade:['pad','Arcade'],binder:['cards','Card binder'],home:[null,'Main menu']};
function tidy(){const box=$('#mbox');if(!box||!box.querySelector('.rstats'))return;
 /* icon buttons */
 const rb=box.querySelector('.rbtns');if(rb){let row=rb.querySelector('.iconrow');rb.querySelectorAll('[data-act=go][data-to]:not(.iconbtn)').forEach(b=>{const m=ICON_FOR[b.dataset.to];if(!m)return;
   b.classList.add('iconbtn');b.title=m[1];b.setAttribute('aria-label',m[1]);b.innerHTML=`<img src="${m[0]?BICU[m[0]]:HOME}" alt="">`;if(!row){row=document.createElement('div');row.className='iconrow'}row.appendChild(b)});
  if(row){const order=['map','arcade','binder','home'];[...row.children].sort((a,b)=>order.indexOf(a.dataset.to)-order.indexOf(b.dataset.to)).forEach(b=>row.appendChild(b));rb.appendChild(row)}}
 /* "Your run" on one line */
 const h3=[...box.querySelectorAll('h3')].find(h=>/your run/i.test(h.textContent));const rs=h3&&h3.nextElementSibling&&h3.nextElementSibling.classList.contains('rstats')?h3.nextElementSibling:box.querySelector('.rstats');
 if(rs){rs.classList.add('oneline');rs.querySelectorAll('span').forEach(s=>{if(/words per minute/i.test(s.textContent))s.textContent='WPM'})}
 /* no-peek: say what it is */
 box.querySelectorAll('.banner').forEach(b=>{if(/No-peek \+1/.test(b.textContent))b.textContent='No-peek bonus +1 diamond (you typed with the keyboard letters hidden)'})}
const _modal=modal;modal=function(html){const r=_modal.apply(this,arguments);try{tidy();setTimeout(tidy,50);setTimeout(tidy,400)}catch(e){}return r};
/* Keylori speaks in a bubble beside its card instead of a big heading */
const SAY_NEW=['Yay, you saved me! Let’s be friends!','Thank you for rescuing me!','You did it! I’m free!'];
const SAY_AGAIN=['Yay, you’re back! I missed you!','Hi again! Let’s keep typing!','I’m so happy to see you!','You’re getting faster!'];
const _res=results;results=function(r){const out=_res.apply(this,arguments);try{if(!r||!r.pass||P.practice)return out;const box=$('#mbox'),flip=box&&box.querySelector('#flip');if(!flip)return out;
 const h2=box.querySelector('h2');if(h2&&/happy to see you/.test(h2.textContent))h2.textContent=r.lvl?'Level up!':'Great job!';
 if(!flip.parentElement.classList.contains('flipwrap')){const w=document.createElement('div');w.className='flipwrap';flip.replaceWith(w);w.appendChild(flip);
  w.insertAdjacentHTML('beforeend',`<div class="kbubble">${esc(rand(r.newCard?SAY_NEW:SAY_AGAIN))}</div>`)}}catch(e){}try{tidy()}catch(e){}return out};
})();
