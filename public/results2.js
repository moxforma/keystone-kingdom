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
 if(h3)h3.remove();if(rs){rs.classList.add('oneline');rs.querySelectorAll('span').forEach(s=>{if(/words per minute/i.test(s.textContent))s.textContent='WPM'})}
 /* no-peek: say what it is */
 box.querySelectorAll('.banner,.rchip').forEach(b=>{if(/No-peek \+1/.test(b.textContent))b.textContent='No-peek bonus +1 diamond (you typed with the keyboard letters hidden)'})}
const _modal=modal;modal=function(html){const r=_modal.apply(this,arguments);try{tidy();setTimeout(tidy,50);setTimeout(tidy,400)}catch(e){}return r};
/* Keylori speaks in a bubble beside its card instead of a big heading */
const SAY_NEW=['Yay, you saved me! Let’s be friends!','Thank you for rescuing me!','You did it! I’m free!'];
const SAY_AGAIN=['Yay, you’re back! I missed you!','Hi again! Let’s keep typing!','I’m so happy to see you!','You’re getting faster!'];
const _res=results;results=function(r){const out=_res.apply(this,arguments);try{if(!r||!r.pass||P.practice)return out;const box=$('#mbox'),flip=box&&box.querySelector('#flip');if(!flip)return out;
 const h2=box.querySelector('h2');if(h2&&/happy to see you/.test(h2.textContent))h2.textContent=r.lvl?'Level up!':'Great job!';
 if(!flip.parentElement.classList.contains('flipwrap')){const w=document.createElement('div');w.className='flipwrap';flip.replaceWith(w);w.appendChild(flip);
  w.insertAdjacentHTML('beforeend',`<div class="kbubble">${esc(rand(r.evo!=null?['Look! I evolved!','Wow, I grew stronger!','Thanks to you, I evolved!']:r.newCard?SAY_NEW:SAY_AGAIN))}</div>`)}
 const wrap=box.querySelector('.flipwrap'),rc=box.querySelector('.reward-cards');if(wrap&&rc){const key=c=>(c.querySelector('.c-name')?.textContent||'')+'|'+(c.querySelector('.c-form')?.textContent||'');const fc=flip.querySelector('.cw:not(.bk)'),fk=fc?key(fc):'';
  rc.querySelectorAll('.cw').forEach(c=>{if(key(c)===fk)c.remove()});if(!rc.querySelector('.cw'))rc.remove();else if(rc.parentElement!==wrap){wrap.insertBefore(rc,wrap.querySelector('.kbubble'));wrap.classList.add('multi')}}}catch(e){}try{tidy()}catch(e){}return out};

/* ---- compact finish screen: chips, tip in the bubble, share icon, two columns ---- */
const SHARE=PXG([".....oo.....","....oWWo....","...oWWWWo...","..oWWWWWWo..",".....WW.....",".....WW.....","oo...WW...oo","oWo......oWo","oWWoooooooWo","oWWWWWWWWWWo","oooooooooooo"],{o:'#2a1d3e',W:'#fff6e0'}).toDataURL();
function compact(){const box=$('#mbox');if(!box||!box.querySelector('.rstats'))return;
 /* 1. banners -> small chips under the stars */
 const stars=box.querySelector('.bigstars');if(stars){let row=box.querySelector('.chiprow');
  const bans=[...box.querySelectorAll('.banner')].filter(b=>!b.closest('.chiprow')&&!b.closest('.fb-card'));
  if(bans.length){if(!row){row=document.createElement('div');row.className='chiprow';stars.insertAdjacentElement('afterend',row)}bans.forEach(b=>{b.classList.add('chip');row.appendChild(b)})}}
 /* 3. tip goes into the Keylori's bubble */
 const bub=box.querySelector('.kbubble');if(bub&&!bub.querySelector('.ktip')){const tip=[...box.querySelectorAll('p.note')].find(p=>TIPS.includes(p.textContent.trim()));
  if(tip){bub.insertAdjacentHTML('beforeend',`<span class="ktip">Tip: ${esc(tip.textContent.trim())}</span>`);tip.remove()}}
 /* 5. share becomes an icon in the icon row */
 const sh=box.querySelector('[data-act=copyRun]'),row=box.querySelector('.iconrow');
 if(sh&&row&&sh.parentElement!==row){const lab=sh.title||sh.textContent.trim()||'Share';sh.classList.add('iconbtn','shareic');sh.title=lab;sh.setAttribute('aria-label',lab);if(!sh.querySelector('img'))sh.innerHTML=`<img src="${SHARE}" alt="">`;sh.classList.add('iconbtn','shareic');row.appendChild(sh)}
 /* 6. two columns on wide screens: card + bubble left, everything else right */
 const fw=box.querySelector('.flipwrap');if(fw&&!box.querySelector('.fcols')){const cols=document.createElement('div');cols.className='fcols';const L=document.createElement('div');L.className='fcol-l';const R=document.createElement('div');R.className='fcol-r';
  const h2=box.querySelector(':scope > h2');[...box.children].forEach(ch=>{if(ch===h2)return;(ch===fw?L:R).appendChild(ch)});L.appendChild(fw);cols.appendChild(L);cols.appendChild(R);box.appendChild(cols);box.classList.add('finish2')}
 const fl=box.querySelector('.fcol-l'),rbs=box.querySelector('.fcol-r > .rbtns');if(fl&&rbs&&innerWidth>760){fl.appendChild(rbs);rbs.classList.add('lbtns')}}
const _tidy2=tidy;tidy=function(){_tidy2();try{compact()}catch(e){console.warn(e)}};
})();