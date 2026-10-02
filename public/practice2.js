/* New hero art, text size picker, sentence + paragraph practice */
(function(){
/* ---------- redrawn heroes ---------- */
if(window.NEWH){Object.entries(NEWH).forEach(([k,h])=>{if(HEROES[k])HEROES[k]=Object.assign({},HEROES[k],{rows:h.rows,pal:h.pal})});
 try{Object.keys(KKC).forEach(k=>{if(/ember|bruno|mochi|inky/.test(k))delete KKC[k]})}catch(e){}}

/* ---------- text size: small / medium / large ---------- */
const FS=[['s','A','Smaller text'],['m','A','Medium text'],['l','A','Bigger text']];
function applyFs(){const v=(S.set&&S.set.fsz)||'m';document.body.classList.remove('fs-s','fs-m','fs-l');document.body.classList.add('fs-'+v);
 document.querySelectorAll('.fsz button').forEach(b=>b.classList.toggle('on',b.dataset.v===v))}
const fsHTML=()=>`<div class="fsz" role="group" aria-label="Text size">${FS.map(([v,t,l])=>`<button class="f${v}" data-act="fsz" data-v="${v}" aria-label="${l}" title="${l}">${t}</button>`).join('')}</div>`;
function addFs(){document.querySelectorAll('.screen:not([hidden]) .topbar, #hud, #ghud').forEach(t=>{if(!t.querySelector('.fsz')){const back=t.querySelector('[data-act=go],[data-act=back],[data-act=quit]');
  if(back)back.insertAdjacentHTML('afterend',fsHTML());else t.insertAdjacentHTML('afterbegin',fsHTML())}});applyFs()}
window.addFs=addFs;
ACT.fsz=d=>{S.set.fsz=d.v;save();applyFs();try{sfx.click()}catch(e){}};
const _show=show;show=function(){const r=_show.apply(this,arguments);setTimeout(addFs,0);return r};
const _ss=startStage;startStage=function(){const r=_ss.apply(this,arguments);setTimeout(addFs,0);return r};
if(typeof mountGame==='function'){const _mg=mountGame;mountGame=function(){const r=_mg.apply(this,arguments);setTimeout(addFs,0);return r}}
const _ld=load;load=function(){const r=_ld.apply(this,arguments);applyFs();return r};
const _set=ACT.settings;ACT.settings=function(){_set.apply(this,arguments);const box=$('#modal .mbox')||$('#modal'),first=box&&box.querySelector('.setrow');
 if(first&&!box.querySelector('.fsrow'))first.insertAdjacentHTML('beforebegin',`<div class="setrow fsrow"><span>Text size</span><div class="seg">${FS.map(([v,,l])=>`<button class="${((S.set.fsz||'m')===v)?'on':''}" data-act="fszSet" data-v="${v}">${['Small','Medium','Big'][['s','m','l'].indexOf(v)]}</button>`).join('')}</div></div>`)};
ACT.fszSet=d=>{ACT.fsz(d);ACT.settings()};
applyFs();setTimeout(addFs,0);

/* ---------- sentence + paragraph practice ---------- */
const T=(typeof KK_TEXT!=='undefined'&&KK_TEXT)||{easy:[],medium:[],hard:[],para:[]};
const okText=s=>!s.split(/[^A-Za-z']+/).some(w=>w&&typeof tokBad==='function'&&tokBad(w));
['easy','medium','hard','para'].forEach(k=>T[k]=(T[k]||[]).filter(okText));
const prog=()=>Math.floor(Math.max(0,nextStage())/NST);
const UNLOCK=14;
function fit(t){const p=prog();
 if(p<15)t=t.toLowerCase();
 if(p<22){t=t.replace(/[!?]/g,'.').replace(/["']/g,'')}
 return t.replace(/\s+/g,' ').trim()}
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let LAST={};
function pickN(list,n,key){const pool=shuf(list.filter(s=>!(LAST[key]||[]).includes(s))),out=pool.slice(0,n);LAST[key]=out;return out}
function sentText(){const p=prog(),lv=p<23?'easy':p<44?'medium':'hard',n=Math.max(2,Math.round({easy:4,medium:3,hard:2}[lv]*(S.set.len||1)));return fit(pickN(T[lv],n,lv).join(' '))}
function paraText(){return fit(pickN(T.para,1,'para')[0]||'')}
let MODE=null;
const _gt=genText;genText=function(i,s,pr){if(pr&&MODE){const m=MODE;MODE=null;const t=m==='sent'?sentText():paraText();if(t)return t}return _gt.apply(this,arguments)};
const _pa=ACT.practice;ACT.practice=function(){_pa.apply(this,arguments);const m=$('#mbox .pmenu');if(!m||m.querySelector('[data-m=sent]'))return;const lock=prog()<UNLOCK;
 m.insertAdjacentHTML('afterbegin',`<button class="pm ${lock?'pmlock':''}" data-act="pr2" data-m="sent"><b>Sentences</b><span>${lock?'Unlocks after Lesson '+UNLOCK:'Short sentences that make sense'}</span></button>
 <button class="pm ${lock?'pmlock':''}" data-act="pr2" data-m="para"><b>Paragraphs</b><span>${lock?'Unlocks after Lesson '+UNLOCK:'Type a whole mini story'}</span></button>`)};
ACT.pr2=d=>{if(prog()<UNLOCK){toast('Finish Lesson '+UNLOCK+' to unlock this!');return}closeModal();MODE=d.m;startStage(0,'practice');
 setTimeout(()=>{const b=$('#hud .ht b');if(b)b.textContent=d.m==='sent'?'Practice: sentences':'Practice: paragraph'},0)};
})();
