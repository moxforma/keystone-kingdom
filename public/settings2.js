/* Settings, reorganized: wider box, grouped sections, family code box, parent settings box, reset at the bottom */
(function(){
/* changing a setting re-opens the FULL settings (it used to drop the added rows) */
ACT.set=d=>{S.set[d.k]=d.k==='len'?+d.v:d.k==='hide'?d.v:d.v==='1';applyLabels();save();ACT.settings()};
const find=(rows,re)=>rows.find(r=>re.test(r.textContent));
const _set=ACT.settings;ACT.settings=function(){_set.apply(this,arguments);try{organize()}catch(e){console.warn(e)}};
function sec(title,rows,cls=''){const s=document.createElement('section');s.className='setsec '+cls;if(title)s.innerHTML=`<h3 class="setsec-h">${title}</h3>`;rows.filter(Boolean).forEach(r=>s.appendChild(r));return s}
function organize(){const box=$('#mbox');if(!box||box.querySelector('.setsec'))return;box.classList.add('setwide');
 const rows=[...box.querySelectorAll(':scope > .setrow')],done=[...box.querySelectorAll(':scope > [data-act=close]')].pop();
 const r={size:find(rows,/^Text size/),sound:find(rows,/^Sound effects/),voice:find(rows,/^Read hints/),keys:find(rows,/^Letters on the screen keyboard/),len:find(rows,/^Round length/),
  name:find(rows,/^Trainer name/),test:find(rows,/^Skill test/),reset:find(rows,/^Start over/),sync:box.querySelector(':scope > .setrow.sync'),par:box.querySelector(':scope > .setrow.parrow')};
 const used=new Set(Object.values(r).filter(Boolean));
 const frag=document.createDocumentFragment();
 frag.appendChild(sec('Sound',[r.sound,r.voice]));
 frag.appendChild(sec('Typing',[r.size,r.keys,r.len]));
 frag.appendChild(sec('Player',[r.name,r.test,...rows.filter(x=>!used.has(x))]));
 if(r.sync){const code=typeof famShort==='function'?famShort():'',msg=r.sync.querySelector('small'),acts=r.sync.querySelector('.namebox');
  const s=document.createElement('section');s.className='setsec famsec';
  s.innerHTML=`<h3 class="setsec-h">Play on more than one device</h3>${code?`<div class="famcode" aria-label="Family code">${esc(code)}</div><p class="fammsg">Type this family code on another device to share your saves. Keep it private.</p>`:`<p class="fammsg">${msg?msg.innerHTML:''}</p>`}`;
  if(acts){acts.classList.add('famacts');s.appendChild(acts)}r.sync.remove();frag.appendChild(s)}
 if(r.par){const s=document.createElement('section');s.className='setsec parsec';const t=r.par.querySelector('span');if(t)t.innerHTML='Parent settings<small class="muted" style="display:block;font-size:16px">Turn game features on or off</small>';s.innerHTML='';s.appendChild(r.par);r.par.classList.remove('parrow');frag.appendChild(s)}
 if(r.reset){const s=sec('',[r.reset],'dangersec');frag.appendChild(s)}
 if(done)box.insertBefore(frag,done);else box.appendChild(frag)}
/* wording: grown-up -> parent */
const _gate=ACT.parGate;if(_gate)ACT.parGate=function(){_gate.apply(this,arguments);const h=$('#mbox h2');if(h)h.textContent='PARENTS ONLY'};
const _modal=modal;modal=function(html){if(typeof html==='string')html=html.replace('<h2>GROWN-UP SETTINGS</h2>','<h2>PARENT SETTINGS</h2>');const r=_modal.call(this,html);const b=$('#mbox');if(b&&/PARENT SETTINGS/.test(b.innerHTML))b.classList.add('setwide','parpanel');return r};
})();
