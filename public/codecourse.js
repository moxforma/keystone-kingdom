/* Robot Code course: type real Pybricks (LEGO Spike Prime) Python, built up step by step for beginners.
   Unlocked by typing "alex" into the grown-up math box. */
(function(){
const PARTS=[
 {n:"Line 2",tip:"Your first real line of code!",t:"from pybricks.hubs import PrimeHub"},
 {n:"Line 3",tip:"A comma , then a space.",t:"from pybricks.parameters import Direction, Port"},
 {n:"Line 4",tip:"ColorSensor is one word with two big letters.",t:"from pybricks.pupdevices import ColorSensor, Motor"},
 {n:"Line 5",tip:"Last import line!",t:"from pybricks.robotics import DriveBase"},
 {n:"Line 7",tip:"# starts a note for people to read.",t:"# Set up."},
 {n:"Line 8",tip:"() means \"start it up\".",t:"bob = PrimeHub()"},
 {n:"Line 9",tip:"Underscore _ is Shift + minus.",t:"color_sensor = ColorSensor(Port.E)"},
 {n:"Line 10",tip:"CLOCKWISE is all big letters.",t:"motor = Motor(Port.D, Direction.CLOCKWISE)"},
 {n:"Line 11",tip:"COUNTERCLOCKWISE is a long one!",t:"rmotor = Motor(Port.B, Direction.COUNTERCLOCKWISE)"},
 {n:"Line 12",tip:"Almost the same as the last line.",t:"lmotor = Motor(Port.C, Direction.COUNTERCLOCKWISE)"},
 {n:"Line 13",tip:"Numbers: wheel size and wheel gap.",t:"db = DriveBase(lmotor, rmotor, 56, 113)"},
 {n:"Line 16",tip:"A note for where your code goes.",t:"# The main program starts here."},
 {n:"Whole program",tip:"Every line, start to finish. You can do it!",t:"from pybricks.hubs import PrimeHub from pybricks.parameters import Direction, Port from pybricks.pupdevices import ColorSensor, Motor from pybricks.robotics import DriveBase # Set up. bob = PrimeHub() color_sensor = ColorSensor(Port.E) motor = Motor(Port.D, Direction.CLOCKWISE) rmotor = Motor(Port.B, Direction.COUNTERCLOCKWISE) lmotor = Motor(Port.C, Direction.COUNTERCLOCKWISE) db = DriveBase(lmotor, rmotor, 56, 113) # The main program starts here."}
];
const best=()=>(S.codeBest=S.codeBest||{});
const open=k=>k===0||(best()[k-1]||0)>=1;
const starTxt=n=>'★'.repeat(n)+'☆'.repeat(3-n);
window.KK_CODES=window.KK_CODES||{};
KK_CODES.alex=()=>{const first=!S.codeOn;S.codeOn=true;save();try{renderHome()}catch(e){}if(first)toast('Special lesson unlocked!');ACT.codeMenu();return true};
ACT.codeMenu=()=>{const b=best();
 modal(`<h2>SPECIAL LESSON</h2><p style="margin:0 0 4px;color:#7fe8d0">Robot Code</p><p class="muted" style="margin:0 0 10px">Type real Python for a LEGO robot. Start at part 1. Each part unlocks the next.</p>
 <div class="codeparts">${PARTS.map((p,k)=>{const ok=open(k);return `<button class="btn ${ok?'':'alt'} codepart" ${ok?`data-act="codeGo" data-k="${k}"`:'disabled'}><span class="cpn">${k+1}</span><span class="cpt"><b>${p.n}</b><small>${ok?p.tip:'Finish part '+k+' first'}</small></span><span class="cps">${ok?starTxt(b[k]||0):'🔒'}</span></button>`}).join('')}</div>
 <div class="rbtns"><button class="btn alt" data-act="close">Back</button></div>`)};
ACT.codeGo=d=>{closeModal();startCode(+d.k)};
function startCode(k){const p=PARTS[k];if(!p)return;
 _ss(0,'practice');
 P.mode='code';P.code=k;P.n=k;P.text=p.t;
 try{setAvail(new Set([...keyEls.keys()]),true);applyLabels()}catch(e){}
 beginRound();
 try{const b=document.querySelector('#hud .ht b'),sp=document.querySelector('#hud .ht span');if(b)b.textContent=`Special Lesson · ${p.n}`;if(sp)sp.textContent=`Part ${k+1} of ${PARTS.length} · ${p.tip}`;const lb=document.querySelector('#hud .mlbl');if(lb)lb.textContent=`Robot Code ${k+1}/${PARTS.length}`}catch(e){}
 say(p.tip)}
const _ss=startStage;startStage=function(n,mode){if(mode==='code')return startCode(n);return _ss.apply(this,arguments)};
window.startStage=startStage;
const _fin=finish;finish=function(){let k=null,gems=0;try{if(P&&P.mode==='code'){k=P.code;const len=P.text.length,acc=Math.round((len-P.mist.size)/len*100),stars=acc>=95?3:acc>=85?2:acc>=60?1:0,prev=best()[k]||0;
  if(stars>=1){gems=Math.max(0,stars-prev)*2+(prev===0?1:0)}if(stars>prev)best()[k]=stars}}catch(e){}
 const r=_fin.apply(this,arguments);
 if(k!=null){if(gems){S.gems+=gems;save()}let tries=0;const t=setInterval(()=>{const mb=document.getElementById('mbox');if(++tries>60)return clearInterval(t);if(!mb||document.getElementById('modal').hidden||!/Stars/.test(mb.textContent))return;clearInterval(t);
  try{const h=mb.querySelector('h2');if(h&&/Practice/i.test(h.textContent))h.textContent='Special lesson complete!';
   [...mb.querySelectorAll('*')].filter(e=>e.children.length===0&&/^Diamonds$/i.test(e.textContent.trim())).forEach(e=>{const v=e.previousElementSibling;if(v)v.textContent='+'+gems});
   const box=mb.querySelector('.rbtns')||mb;if(!box.querySelector('.codenext')){const nxt=k+1<PARTS.length&&open(k+1);box.insertAdjacentHTML('afterbegin',`${nxt?`<button class="btn codenext" data-act="codeGo" data-k="${k+1}">Next: ${PARTS[k+1].n}</button>`:''}<button class="btn alt codenext" data-act="codeMenu">All parts</button>`)}}catch(e){}
  try{renderHome()}catch(e){}},50)}
 return r};
const CODEICO=PXG(['oooooooooooo','oBBBBBBBBBBo','oBoBBBBBBBBo','oBBoBBBBBBBo','oBoBBoooBBBo','oBBBBBBBBBBo','oooooooooooo','....oooo....','..oooooooo..'],{o:'#1b1626',B:'#7fe8d0'}).toDataURL();
const _rh=renderHome;renderHome=function(){const r=kkSafe(_rh,this,arguments);try{const hb=document.querySelector('#s-home .hbtns');if(hb&&S.codeOn&&!hb.querySelector('.homecode'))hb.insertAdjacentHTML('beforeend',`<button class="btn homecode" data-act="codeMenu"><img class="bico" src="${CODEICO}" alt="">Special Lesson</button>`)}catch(e){}return r};
document.head.insertAdjacentHTML('beforeend',`<style>
#s-home .homecode{grid-column:1/-1;background:#3e4a90!important;color:#fff6e0!important;box-shadow:0 5px 0 #262e66!important}#s-home .homecode:active{box-shadow:0 2px 0 #262e66!important}
.codeparts{display:grid;gap:8px;max-height:60vh;overflow:auto;padding-right:4px}
.codepart{display:grid!important;grid-template-columns:40px 1fr auto;align-items:center;gap:10px;text-align:left;padding:8px 12px!important;height:auto!important;min-height:56px}
.codepart .cpn{font-size:24px;text-align:center}.codepart .cpt b{display:block;font-size:18px}.codepart .cpt small{display:block;font-size:14px;opacity:.8;text-transform:none;letter-spacing:0}
.codepart .cps{font-size:18px;letter-spacing:2px}.codepart[disabled]{opacity:.55;cursor:default}
</style>`);
try{if(screen==='home')renderHome()}catch(e){}
})();
