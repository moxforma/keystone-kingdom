/* New hero art, text size picker, sentence + paragraph practice */
(function(){
/* ---------- redrawn heroes ---------- */
if(window.NEWH){Object.entries(NEWH).forEach(([k,h])=>{if(HEROES[k])HEROES[k]=Object.assign({},HEROES[k],{rows:h.rows,pal:h.pal})});
 try{Object.keys(KKC).forEach(k=>{if(/ember|bruno|mochi|inky/.test(k))delete KKC[k]})}catch(e){}}

/* ---------- wider back items (capes, wings) + Inky's spots follow his color ---------- */
const STRETCH=1.35;
function heroWide(eq,hero,color){eq=eq||{};const h=HEROES[hero]||HEROES.pop;
 const back={},front={};Object.entries(eq).forEach(([sl,id])=>{if(id&&KKDATA.acc[id]&&KKDATA.acc[id].back)back[sl]=id;else front[sl]=id});
 const oldP=h.pal.p;if(color&&HCOL[color]&&oldP){h.pal.p=typeof shadeHex==='function'?shadeHex(HCOL[color][3],-.18):HCOL[color][3]}
 let base;try{base=heroCanvas(front,hero,color)}finally{if(oldP!==undefined)h.pal.p=oldP}
 const c=document.createElement('canvas');c.width=48;c.height=32;const g=c.getContext('2d');
 Object.values(back).forEach(id=>{const a=KKDATA.acc[id],parts=a.parts||[[a.rows,a.x||0,a.y||0]];
  parts.forEach(([rows,x0,y0])=>rows.forEach((r,y)=>[...r].forEach((ch,x)=>{const col=a.pal[ch];if(!col)return;
   const hx=x0+x,nx=12+(hx-12)*STRETCH,nx2=12+(hx+1-12)*STRETCH;g.fillStyle=col;const L=Math.round(nx),R=Math.max(L+1,Math.round(nx2));g.fillRect(12+L,6+y0+y,R-L,1)})))});
 g.drawImage(base,6,0);return c}
zookSVG=function(eq,hero,color){eq=eq||S.equip;hero=hero||heroNow();color=color===undefined?S.color:color;const u=kku('h4'+hero+(color||'')+JSON.stringify(eq),()=>heroWide(eq,hero,color)),k=200/24;
 return `<svg class="zk" viewBox="0 0 200 200" aria-hidden="true" style="overflow:visible"><image href="${u}" x="${-12*k}" y="${-6*k}" width="${48*k}" height="${32*k}" style="image-rendering:pixelated"/></svg>`};
if(typeof uniq==='function'){const _z=zookSVG;zookSVG=(...a)=>uniq(_z(...a))}
try{if(screen==='home')renderHome()}catch(e){}

/* ---------- text size: small / medium / large ---------- */
const FS=[['s','A','Smaller text'],['m','A','Medium text'],['l','A','Bigger text']];
function applyFs(){const v=(S.set&&S.set.fsz)||'s';document.body.classList.remove('fs-s','fs-m','fs-l');document.body.classList.add('fs-'+v);
 document.querySelectorAll('.fsz button').forEach(b=>b.classList.toggle('on',b.dataset.v===v))}
const fsHTML=()=>`<div class="fsz" role="group" aria-label="Text size">${FS.map(([v,t,l])=>`<button class="f${v}" data-act="fsz" data-v="${v}" aria-label="${l}" title="${l}">${t}</button>`).join('')}</div>`;
function addFs(){document.querySelectorAll('.screen:not([hidden]) .topbar, #hud, #ghud').forEach(t=>{if(!t.querySelector('.fsz')){const back=t.querySelector('[data-act=go],[data-act=back],[data-act=quit]');
  if(back)back.insertAdjacentHTML('afterend',fsHTML());else t.insertAdjacentHTML('afterbegin',fsHTML())}});applyFs()}
window.addFs=addFs;
ACT.fsz=d=>{S.set.fsz=d.v;save();applyFs();try{sfx.click()}catch(e){}try{if(S.set.lines2)setTimeout(()=>{beginRound&&document.querySelector('#stripIn')&&window.dispatchEvent(new Event('resize'))},50)}catch(e){}};
const _show=show;show=function(){const r=_show.apply(this,arguments);setTimeout(addFs,0);return r};
const _ss=startStage;startStage=function(){const r=_ss.apply(this,arguments);setTimeout(addFs,0);return r};
if(typeof mountGame==='function'){const _mg=mountGame;mountGame=function(){const r=_mg.apply(this,arguments);setTimeout(addFs,0);return r}}
const _ld=load;load=function(){const r=_ld.apply(this,arguments);applyFs();return r};
const _set=ACT.settings;ACT.settings=function(){_set.apply(this,arguments);const box=$('#modal .mbox')||$('#modal'),first=box&&box.querySelector('.setrow');
 if(first&&!box.querySelector('.fsrow'))first.insertAdjacentHTML('beforebegin',`<div class="setrow fsrow"><span>Text size</span><div class="seg">${FS.map(([v,,l])=>`<button class="${((S.set.fsz||'s')===v)?'on':''}" data-act="fszSet" data-v="${v}">${['Small','Medium','Big'][['s','m','l'].indexOf(v)]}</button>`).join('')}</div></div>`)};
ACT.fszSet=d=>{ACT.fsz(d);ACT.settings()};
const _set2=ACT.settings;ACT.settings=function(){_set2.apply(this,arguments);const box=$('#modal .mbox')||$('#modal'),fs=box&&box.querySelector('.fsrow');
 if(fs&&!box.querySelector('.testrow'))fs.insertAdjacentHTML('afterend',`<div class="setrow testrow"><span>Skill test<small class="muted" style="display:block;font-size:16px">Take the starting test again to jump ahead to a harder world</small></span><button class="btn sm volt" data-act="place">TAKE TEST</button></div>`)};
applyFs();setTimeout(addFs,0);

/* ---------- sentence + paragraph practice ---------- */
const T=(typeof KK_TEXT!=='undefined'&&KK_TEXT)||{easy:[],medium:[],hard:[],para:[]};
const okText=s=>!s.split(/[^A-Za-z']+/).some(w=>w&&typeof tokBad==='function'&&tokBad(w));
['easy','medium','hard','para'].forEach(k=>T[k]=(T[k]||[]).filter(okText));
const prog=()=>{const p=Math.floor(Math.max(0,nextStage())/NST);return typeof EI==='function'?EI(p):p};
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

/* ---------- home balance: keystones + daily egg move to the left box ---------- */
const _rhb=renderHome;renderHome=function(){const r=_rhb.apply(this,arguments);try{const hi=$('#s-home .hero-info'),btns=hi&&hi.querySelector('.hi-btns');if(hi&&btns){
 ['.shards','.eggrow'].forEach(q=>{const el=$('#s-home .tcard '+q);if(el){el.classList.add('moved');btns.insertAdjacentElement('beforebegin',el)}})}}catch(e){}return r};
try{if(screen==='home')renderHome()}catch(e){}
})();
