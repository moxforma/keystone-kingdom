/* Classes, friend groups and live race rooms. Only first names + typing stats leave the device. No chat. */
(function(){
const post=(u,b)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Could not connect');return j});
const pid=()=>{if(!S.cid||!/^[a-z0-9]{6,24}$/.test(S.cid)){S.cid=(Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/g,'').slice(0,16);save()}return S.cid};
const myName=()=>S.name||'Player';
const myLook=()=>({h:typeof heroNow==='function'?heroNow():S.hero,c:S.color||null,eq:S.equip||{}});
const lookOk=l=>{l=l||{};const h=typeof HEROES!=='undefined'&&HEROES[l.h]?l.h:'pop',eq={};Object.entries(l.eq||{}).forEach(([k,v])=>{if(typeof ACC!=='undefined'&&ACC[v])eq[k]=v});return{h,c:l.c&&typeof HCOL!=='undefined'&&HCOL[l.c]?l.c:null,eq}};
const heroIcon=l=>{const L=lookOk(l);try{return kku('hi'+L.h+(L.c||'')+JSON.stringify(L.eq),()=>heroCanvas(L.eq,L.h,L.c))}catch(e){return ''}};
const heroBig=l=>{const L=lookOk(l);try{return zookSVG(L.eq,L.h,L.c)}catch(e){return zookSVG()}};
const BOOK=PXG(["............",".oooo..oooo.","oWWWWooWWWWo","oWLLWooWLLWo","oWWWWooWWWWo","oWLLWooWLLWo","oWWWWooWWWWo","oWWWWooWWWWo","oBBBBooBBBBo",".oooo..oooo.",".....oo....."],{o:'#1b2a2e',W:'#fff6e0',L:'#8ab8c8',B:'#c8604a'}).toDataURL();
const GN={meteor:'Meteor Zap',race:'Typing Race',glitch:'Scrambler Attack',bubble:'Bubble Pop',dig:'Treasure Dig',keeper:'Keylori Keeper',bridge:'Story Bridge'};
const TEACH='kl-teach';const teach=()=>{try{return JSON.parse(localStorage.getItem(TEACH)||'{}')}catch(e){return{}}};const setTeach=t=>{try{localStorage.setItem(TEACH,JSON.stringify(t))}catch(e){}};
const weekStart=()=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime()};
const lessonIdx=()=>Math.floor(nextStage()/NST);

/* ---------- stats sent to the class ---------- */
function stats(){const i=lessonIdx(),h=(S.hist||[]).slice(-8),avg=f=>h.length?Math.round(h.reduce((a,x)=>a+f(x),0)/h.length):0,ws=weekStart();
 if(!S.wk||S.wk.w!==ws)S.wk={w:ws,base:S.time||0};
 const arc={};(S.hs||[]).filter(x=>x.t>=ws).forEach(x=>{if(!arc[x.g]||x.wpm>arc[x.g].wpm)arc[x.g]={wpm:x.wpm,acc:x.acc}});
 const prog=(window.ORDER||LESSONS.map((_,k)=>k)).map(j=>{let n=0,st=0;for(let q=0;q<NST;q++){const b=(S.best||{})[j+'-'+q]||0;if(b>=1)n++;st+=Math.min(3,b)}return String.fromCharCode(48+n)+String.fromCharCode(48+st)}).join('');
 const A=S.asga&&S.cls&&S.asga.code===S.cls.code?S.asga:null;
 return{lesson:`Lesson ${LNUM(i)}: ${lessonTitle(i)}`,pos:LNUM(i),world:worldOf(i),stars:Object.values(S.best||{}).reduce((a,b)=>a+b,0),wpm:avg(x=>x.w),acc:avg(x=>x.a),mins:Math.round(((S.time||0)-S.wk.base)/60),arc,prog,
  asg:S.asgr||{},cur:A?{i:A.i,at:A.at,n:(A.st||[]).length}:null}}
let lastRep=0;
function report(force){if(!S.cls||(!force&&Date.now()-lastRep<15000))return;lastRep=Date.now();post('/api/class',{a:'report',code:S.cls.code,pid:pid(),name:myName(),stats:stats()}).then(info=>{CLS_INFO=info;setLock(info);homeBanner()}).catch(()=>{})}
const _res=results;results=function(){const r=_res.apply(this,arguments);setTimeout(report,1500);return r};
const _md=modal;modal=function(){const r=_md.apply(this,arguments);try{if(screen==='game'&&$('#mbox .rstats'))setTimeout(report,1500)}catch(e){}return r};

/* class-wide grown-up switches from the teacher */
try{window.CLS_LOCK=S.cls&&S.cls.lock||null;applyPar&&applyPar()}catch(e){}
const _ldL=load;load=function(){const r=_ldL.apply(this,arguments);try{window.CLS_LOCK=S.cls&&S.cls.lock||null;applyPar&&applyPar()}catch(e){}return r};
function setLock(i){const L=i&&i.lock||null,was=JSON.stringify(window.CLS_LOCK||null);window.CLS_LOCK=S.cls?L:null;if(S.cls&&JSON.stringify(S.cls.lock||null)!==JSON.stringify(L)){S.cls.lock=L;save()}if(JSON.stringify(window.CLS_LOCK||null)!==was){try{applyPar&&applyPar();if(screen==='home')renderHome()}catch(e){}}}
/* ---------- home: class banner (teacher's pick + open class race) ---------- */
let CLS_INFO=null,lastInfo=0;
function fetchInfo(){if(!S.cls||Date.now()-lastInfo<15000)return;lastInfo=Date.now();post('/api/class',{a:'info',code:S.cls.code}).then(i=>{CLS_INFO=i;setLock(i);S.cls.name=i.name;homeBanner()}).catch(e=>{if(/not found/i.test(e.message)){S.cls=null;save()}})}
function homeBanner(){const home=$('#s-home');if(!home||home.hidden)return;home.querySelector('.clsban')?.remove();if(!S.cls||!CLS_INFO)return;const I=CLS_INFO;
 const pick=I.assign&&LESSONS[I.assign.i]?`<div class="cb-row"><span>Teacher's pick: <b>Lesson ${LNUM(I.assign.i)}: ${esc(lessonTitle(I.assign.i))}</b></span>${(()=>{const R=S.asgr&&S.asgr[I.assign.i];return R&&R.at===I.assign.at?'<span class="cb-done">Done ✓</span>':''})()}<button class="btn sm volt" data-act="clsPick" data-i="${I.assign.i}">Play</button></div>`:'';
 const race=I.race?`<div class="cb-row"><span>A class race is open!</span><button class="btn sm" data-act="raceJoinCode" data-r="${esc(I.race.room)}">Join race</button></div>`:'';
 if(!pick&&!race)return;const tb=home.querySelector('.topbar');const el=document.createElement('div');el.className='clsban panel';el.innerHTML=`<div class="cb-name">${esc(I.name||'My class')}</div>${pick}${race}`;
 tb?tb.insertAdjacentElement('afterend',el):home.prepend(el)}
/* playing the teacher's pick: stages count from when it was assigned, and the last one ends with "Lesson complete!" */
const asgFor=()=>{const a=CLS_INFO&&CLS_INFO.assign;if(!a||!S.cls)return null;if(!S.asga||S.asga.i!==a.i||S.asga.at!==a.at||S.asga.code!==S.cls.code){S.asga={code:S.cls.code,i:a.i,at:a.at,st:[]};save()}return S.asga};
let ASG_RUN=false;
ACT.clsPick=d=>{const i=+d.i,A=asgFor();let s=0;if(A&&A.i===i){for(;s<NST-1;s++)if(!A.st.includes(s))break}else{for(;s<NST-1;s++)if(!((S.best[i+'-'+s]||0)>=1))break}
 closeModal();startStage(i*NST+s)};
const _ssA=startStage;startStage=function(n,mode){const r=_ssA.apply(this,arguments);try{const A=asgFor();ASG_RUN=!!(A&&typeof P!=='undefined'&&P.i===A.i&&!P.mode&&!P.practice)}catch(e){ASG_RUN=false}return r};
function asgButtons(){const A=S.asga,box=document.querySelector('#mbox');if(!A||!box||!box.querySelector('.rstats')||typeof P==='undefined'||P.i!==A.i)return;
 const plays=[...box.querySelectorAll('[data-act=play]')].filter(b=>!b.closest('.stpick')&&!/again/i.test(b.textContent));
 if(A.st.length>=NST){if(box.querySelector('[data-act=asgDone]'))return;const first=plays[0];plays.forEach(b=>b.remove());
  const html='<button class="btn nextbtn" data-act="asgDone">Lesson complete! Next ▸</button>';
  if(first&&first.parentNode)first.insertAdjacentHTML('beforebegin',html);else(box.querySelector('.rbtns')||box).insertAdjacentHTML('afterbegin',html);
  first&&first.remove()}
 else{let nx=null;for(let q=0;q<NST;q++)if(!A.st.includes(q)){nx=q;break}if(nx!=null)plays.forEach(b=>b.dataset.n=A.i*NST+nx)}}
const _res2=results;results=function(r){const out=_res2.apply(this,arguments);try{const A=S.asga;
 if(ASG_RUN&&A&&typeof P!=='undefined'&&!P.mode&&!P.practice&&P.i===A.i&&r){
  if(r.pass&&!A.st.includes(P.s)){A.st.push(P.s);save()}
  if(A.st.length>=NST){S.asgr=S.asgr||{};const prev=S.asgr[A.i];if(!prev||prev.at!==A.at){S.asgr[A.i]={at:A.at,d:Date.now(),w:r.wpm||0,a:r.acc||0};const k=Object.keys(S.asgr);if(k.length>60)delete S.asgr[k[0]];save()}}
  asgButtons();[60,300,900,1800].forEach(t=>setTimeout(()=>{if(ASG_RUN)asgButtons()},t))}}catch(e){console.warn(e)}return out};
ACT.asgDone=()=>{try{document.activeElement&&document.activeElement.blur()}catch(e){}const A=S.asga,R=S.asgr&&A&&S.asgr[A.i];
 modal(`<div class="asgdone"><h2>Lesson complete!</h2><p class="big">Lesson ${LNUM(A.i)}: ${esc(lessonTitle(A.i))}</p>${R?`<div class="rstats2"><div><b>${R.w}</b><span>WPM</span></div><div><b>${R.a}%</b><span>Accuracy</span></div></div>`:''}
 <p class="muted">Send it to your teacher, then head back to the menu.</p><div class="rbtns"><button class="btn nextbtn" data-act="asgSubmit">Submit to teacher</button></div></div>`)};
ACT.asgSubmit=()=>{ASG_RUN=false;const b=document.querySelector('[data-act=asgSubmit]');if(b){b.disabled=true;b.textContent='Sending...'}
 const fin=ok=>{toast(ok?'Sent to your teacher!':'Saved! It will send next time you are online.');closeModal();show('home')};
 lastRep=0;post('/api/class',{a:'report',code:S.cls.code,pid:pid(),name:myName(),stats:stats()}).then(i=>{CLS_INFO=i;fin(true)}).catch(()=>fin(false))};
const _rh=renderHome;renderHome=function(){const r=_rh.apply(this,arguments);try{const row=$('#s-home .hi-btns');row?.querySelector('[data-act=clsHub]')?.remove();
 const tb=$('#s-home .topbar');if(tb&&S.name&&!tb.querySelector('.clsbtn')){const after=tb.querySelector('.roamtog')||tb.querySelector('.selp');const h=`<button class="btn clsbtn" data-act="clsHub"><img class="bico hico" src="${BOOK}" alt="">CLASS</button>`;after?after.insertAdjacentHTML('afterend',h):tb.insertAdjacentHTML('afterbegin',h)}homeBanner();fetchInfo()}catch(e){}return r};
setInterval(()=>{if(typeof screen!=='undefined'&&screen==='home'&&S.cls){lastInfo=0;fetchInfo()}},20000);
/* Race with Others card art: two heroes charging toward the camera with anime speed lines (2-frame run cycle) */
function raceArt(){const W=72,H=56,c=document.createElement('canvas');c.width=W*2;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 const me=typeof heroNow==='function'?heroNow():'pop',other=['rexo','juno','pip','ember','mochi'].find(h=>h!==me&&HEROES[h])||'pip';
 const px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)},rect=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
 /* head sprite + its colors */
 function headOf(cv){const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let x0=99,x1=-1,y0=99,y1=-1;const cnt={};
  for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++){const k=(y*cv.width+x)*4;if(d[k+3]<200)continue;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);const hex='#'+[d[k],d[k+1],d[k+2]].map(v=>v.toString(16).padStart(2,'0')).join('');cnt[hex]=(cnt[hex]||0)+1}
  const cols=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(e=>e[0]);const lum=h=>{const n=parseInt(h.slice(1),16);return (n>>16)*.3+(n>>8&255)*.59+(n&255)*.11};
  const body=cols.find(h=>lum(h)>60&&lum(h)<200)||cols[0],dark=cols.slice().sort((a,b)=>lum(a)-lum(b))[0];return{cv,x0,x1,y0,y1,body,dark}}
 const shade=(h,a)=>typeof shadeHex==='function'?shadeHex(h,a):h;
 /* a chibi runner charging at the camera: head on top, body, swinging arms, one knee up */
 function runner(H_,cx,top,f){const hw=H_.x1-H_.x0+1,hh=H_.y1-H_.y0+1,hx=cx-Math.floor(hw/2);
  const by=top+hh-1,B=H_.body,D=shade(B,-.35),O=H_.dark,SH='#2a2340',SL='#5a4e70';
  /* legs (drawn first, under the body) */
  const L=f?[[-4,7,1],[2,3,0]]:[[-4,3,0],[2,7,1]];
  L.forEach(([dx,len,near])=>{const lx=cx+dx;rect(lx-1,by+5,4,len+2,O);rect(lx,by+5,2,len,D);
   const fy=by+5+len,fw=near?6:4;rect(lx-1-(near?1:0),fy-1,fw+1,near?4:3,O);rect(lx-(near?1:0),fy,fw-1,near?2:1,SH);px(lx-(near?1:0),fy,SL)});
  /* torso */
  rect(cx-6,by-1,12,8,O);rect(cx-5,by,10,6,B);rect(cx+2,by,3,6,D);rect(cx-5,by+4,10,2,D);
  /* arms swinging */
  const A=f?[[-8,-3],[6,2]]:[[-8,2],[6,-3]];A.forEach(([dx,dy])=>{rect(cx+dx-1,by+dy-1,4,7,O);rect(cx+dx,by+dy,2,5,B);rect(cx+dx,by+dy+(dy<0?0:4),2,2,'#ffd8b0')});
  /* head on top */
  g.drawImage(H_.cv,H_.x0,H_.y0,hw,hh,hx,top,hw,hh)}
 const F=headOf(heroCanvas(S.equip||{},me,S.color)),Bk=headOf(heroCanvas({},other,null));
 for(let f=0;f<2;f++){const ox=f*W;g.save();g.beginPath();g.rect(ox,0,W,H);g.clip();
  /* anime speed lines */
  const cx=ox+W/2,cy=22;for(let k=0;k<34;k++){const a=k/34*Math.PI*2+(f?.05:0),len=k%3===0?18:k%3===1?11:7,r0=25+((k*7+f*4)%7);
   for(let t=r0;t<r0+len;t++){const x=Math.round(cx+Math.cos(a)*t*1.5),y=Math.round(cy+Math.sin(a)*t);px(x,y,k%3===0?'#fff6e0':k%3===1?'#c8bff0':'#7a6fb0')}}
  /* shadows */
  rect(ox+12,38,20,2,"rgba(10,6,24,.55)");rect(ox+34,52,26,2,"rgba(10,6,24,.55)");
  /* chaser behind, leader in front */
  runner(Bk,ox+22,2+(f?1:0),f?0:1);runner(F,ox+46,15+(f?0:1),f);
  /* dust puffs + sweat */
  const dust='#e8dcc4';(f?[[ox+38,52],[ox+14,35]]:[[ox+56,52],[ox+30,35]]).forEach(([x,y])=>{px(x,y,dust);px(x+1,y-1,dust);px(x-1,y-1,dust);px(x,y-2,'#fff6e0')});
  px(ox+60,22,'#7fe8ff');px(ox+60,23,'#7fe8ff');px(ox+61,21,'#bff4ff');
  g.restore()}
 return c.toDataURL()}
const _ra=renderArcade;renderArcade=function(){const r=_ra.apply(this,arguments);try{const gs=$('#s-arcade .games');if(gs&&!gs.querySelector('.racecard')){const own=Object.keys(S.cards||{}).slice(0,2).map(k=>k.split('-').map(Number));while(own.length<2)own.push([[3,5][own.length],1]);
 gs.insertAdjacentHTML('beforeend',`<div class="game panel racecard"><div class="gart raceart-wrap"><div class="raceart" style="background-image:url(${raceArt()})"></div></div><h3>Race with Others</h3><p>Race friends and classmates live!</p><div class="arcade-stats"><div class="arcade-stat"><b>${S.netw||0}</b><span>Races won</span></div><div class="arcade-stat"><b>${S.netb||0}</b><span>Best WPM</span></div><div class="arcade-stat level"><b>Up to 40</b><span>Racers per room</span></div></div><button class="btn" data-act="raceHub">Play</button></div>`)}}catch(e){console.warn(e)}return r};

/* ---------- hub ---------- */
const field=(id,ph,act,label)=>`<div class="cl-field"><input id="${id}" class="cl-in" maxlength="6" placeholder="${ph}" autocomplete="off" autocapitalize="characters" data-enter="${act}"><button class="btn sm volt" data-act="${act}">${label}</button></div>`;
ACT.raceHub=()=>{modal(`<h2>Race with Others</h2><div class="raceHubBox"><p class="muted" style="margin:0 0 8px">Everyone types the same story at the same time. Up to 40 racers!</p>
 <div class="cl-sec"><h3>Start a race</h3><div class="cl-btns"><button class="btn racebtn" data-act="raceMake">HOST RACE</button></div></div>
 <div class="cl-sec"><h3>Join a race</h3>${field('raceCode','ZAP12','raceJoin','Join race')}</div>
 <p class="muted cl-note">Only first names are shared. There is no chat.</p></div><div class="rbtns"><button class="btn alt" data-act="close">Close</button></div>`)};
ACT.clsHub=()=>{const c=S.cls;
 modal(`<h2>My Class</h2>
 <div class="cl-sec"><h3>My class or friend group</h3>${c?`<p style="margin:0">You're in <b>${esc(c.name||'a class')}</b> <span class="muted">(code ${esc(c.code)})</span></p><div class="cl-btns"><button class="btn sm" data-act="clsBoard">Class leaderboard</button><button class="btn sm alt" data-act="clsLeave">Leave</button></div>`:`<p class="muted" style="margin:0 0 6px">Got a code from your teacher or a friend's grown-up?</p>${field('clsCode','ABC123','clsJoin','Join')}`}</div>
 <p class="muted cl-note" style="margin-top:10px">Teachers and parents: the class dashboard is in the <button class="linkbtn" data-act="grownups">Teachers' Lounge</button>.</p>
 <p class="muted cl-note">Only first names and typing scores are shared. There is no chat.</p>
 <div class="rbtns"><button class="btn alt" data-act="close">Close</button></div>`)};
document.addEventListener('keydown',e=>{const t=e.target;if(e.key==='Enter'&&t&&t.dataset&&t.dataset.enter){e.preventDefault();e.stopPropagation();ACT[t.dataset.enter]&&ACT[t.dataset.enter]({})}},true);
const val=id=>(document.getElementById(id)?.value||'').trim();
ACT.clsJoin=()=>{const code=val('clsCode');if(!code)return toast('Type the class code');post('/api/class',{a:'join',code,pid:pid(),name:myName()}).then(i=>{S.cls={code:code.toUpperCase(),name:i.name};CLS_INFO=i;setLock(i);save();toast('You joined '+i.name+'!');report(true);ACT.clsHub()}).catch(e=>toast(e.message))};
ACT.clsLeave=()=>{const c=S.cls;if(!c)return;post('/api/class',{a:'leave',code:c.code,pid:pid()}).catch(()=>{});S.cls=null;CLS_INFO=null;setLock(null);save();ACT.clsHub()};
let BTAB='all',BROWS=null;
ACT.clsBoard=d=>{if(d&&d.g){BTAB=d.g;return drawBoard()}if(!S.cls)return;post('/api/class',{a:'board',code:S.cls.code}).then(b=>{BROWS=b;drawBoard()}).catch(e=>toast(e.message))};
function drawBoard(){const b=BROWS;if(!b)return;const rows=(BTAB==='all'?b.rows:b.rows.filter(x=>x.g===BTAB)).slice(0,15),medal=['#f0c860','#c8d0dc','#d08a50'];
 modal(`<h2>${esc(b.name)}: this week</h2><div class="hs-tabs">${['all',...Object.keys(GN)].map(g=>`<button class="${g===BTAB?'on':''}" data-act="clsBoard" data-g="${g}">${g==='all'?'All games':GN[g]}</button>`).join('')}</div>
 ${rows.length?`<table class="hs-tab"><tr><th>#</th><th>Player</th>${BTAB==='all'?'<th>Game</th>':''}<th>WPM</th><th>Accuracy</th></tr>${rows.map((x,k)=>`<tr class="${x.n===myName()?'me':''}"><td><b style="color:${medal[k]||'inherit'}">${k+1}</b></td><td>${esc(x.n)}</td>${BTAB==='all'?`<td>${GN[x.g]||x.g}</td>`:''}<td><b>${x.wpm}</b></td><td>${x.acc}%</td></tr>`).join('')}</table>`:'<p class="muted">No arcade scores yet this week.</p>'}
 <div class="rbtns"><button class="btn alt" data-act="${window.__gu?'grownups':'clsHub'}">Back</button></div>`)}

/* ---------- grown-up gate + dashboard ---------- */
let GATE2=0;
ACT.clsTeach=()=>{if(window.__clsOk)return teachList();const a=6+Math.floor(Math.random()*4),b=3+Math.floor(Math.random()*7);GATE2=a*b;
 modal(`<h2>GROWN-UPS ONLY</h2><div class="pgatebox"><p class="pgq">What is ${a} × ${b}?</p><input id="pgate2" class="pgin" inputmode="numeric" autocomplete="off" maxlength="3" data-enter="clsGateOk" aria-label="Answer"></div>
 <div class="rbtns"><button class="btn" data-act="clsGateOk">OK</button><button class="btn alt" data-act="clsHub">Back</button></div>`);setTimeout(()=>$('#pgate2')?.focus(),50)};
ACT.clsGateOk=()=>{if(+val('pgate2')!==GATE2){toast('Not quite. Ask a grown-up!');return ACT.clsHub()}window.__clsOk=1;teachList()};
window.teachList=()=>teachList();
function teachList(){const t=teach(),codes=Object.keys(t);
 modal(`<h2>Teacher / Parent</h2>${codes.length?`<div class="cl-list">${codes.map(c=>`<button class="btn sm" data-act="clsDash" data-c="${c}">${esc(t[c].name)} <span class="muted">${c}</span></button>`).join('')}</div>`:'<p class="muted">You have no classes on this device yet.</p>'}
 <div class="cl-sec"><h3>Make a new class or friend group</h3><div class="cl-field"><input id="clsName" class="cl-in wide" maxlength="40" placeholder="Room 4, or Cousins" autocomplete="off" data-enter="clsCreate"><button class="btn sm volt" data-act="clsCreate">Make it</button></div></div>
 <p class="muted cl-note">Kids join with the code. You'll see their progress here. Use the same device to come back to this dashboard.</p>
 <div class="rbtns"><button class="btn alt" data-act="clsHub">Back</button></div>`)}
ACT.clsCreate=()=>{const name=val('clsName')||'Our class';post('/api/class',{a:'create',name}).then(r=>{const t=teach();t[r.code]={tk:r.tk,name};setTeach(t);
 modal(`<h2>${esc(name)} is ready!</h2><p style="margin:0">Kids tap <b>CLASS</b> at the top of the home screen and enter:</p><div class="cl-big">${r.code}</div>
 <div class="rbtns"><button class="btn" data-act="clsDash" data-c="${r.code}">Open dashboard</button></div>`)}).catch(e=>toast(e.message))};
let DASH=null,RLVL='easy';
ACT.clsDash=d=>{const c=(d&&d.c)||DASH&&DASH.code,t=teach()[c];if(!t)return teachList();const quiet=d&&d.quiet;
 return post('/api/class',{a:'dash',code:c,tk:t.tk}).then(r=>{DASH={code:c,tk:t.tk,...r};if(!quiet||!document.querySelector('#mbox .dashv'))DVIEW=quiet?DVIEW:null;redraw();dashPoll()}).catch(e=>{if(!quiet)toast(e.message)})};
const ago=ts=>{if(!ts)return'never';const m=Math.round((Date.now()-ts)/60000);return m<2?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago'};
let DVIEW=null,DPOLL=0;
/* refresh every 10 s while the dashboard (or a student page) is open */
function dashPoll(){clearInterval(DPOLL);DPOLL=setInterval(()=>{if($('#modal').hidden||!document.querySelector('#mbox .dashv')){clearInterval(DPOLL);return}
 const ae=document.activeElement;if(ae&&ae.tagName==='SELECT')return;if(document.hidden)return;ACT.clsDash({c:DASH.code,quiet:1})},10000)}
function redraw(){const box=document.querySelector('#mbox .cl-scroll'),y=box?box.scrollTop:0,my=document.querySelector('#mbox')?.scrollTop||0,sel=document.getElementById('asg')?.value;
 DVIEW?drawKid(DVIEW):drawDash();const s2=document.getElementById('asg');if(s2&&sel!=null&&!DASH._justAssigned)s2.value=sel;DASH._justAssigned=0;
 const b2=document.querySelector('#mbox .cl-scroll');if(b2)b2.scrollTop=y;const m2=document.querySelector('#mbox');if(m2)m2.scrollTop=my}
const asgState=(m,a)=>{const s=m.stats||{};if(!a)return null;const R=s.asg&&s.asg[a.i];if(R&&R.at===a.at)return{k:'done',t:'Done ✓',R};
 if(s.cur&&s.cur.i===a.i&&s.cur.at===a.at&&s.cur.n)return{k:'part',t:`In progress ${s.cur.n}/${NST}`};const pg=s.prog&&progOf(m)[a.i];if(pg&&pg.n>=NST)return{k:'own',t:'Done on their own'};return{k:'none',t:'Not started'}};
const progOf=m=>{const p=(m.stats&&m.stats.prog)||'',O=window.ORDER||LESSONS.map((_,k)=>k),o={};O.forEach((i,k)=>{const c=p.charCodeAt(k*2),d=p.charCodeAt(k*2+1);o[i]={n:c>=48?c-48:0,st:d>=48?d-48:0}});return o};
function drawDash(){const D=DASH,ms=D.members.slice().sort((a,b)=>(b.stats?.pos||0)-(a.stats?.pos||0)),A=D.assign;
 const opts=(window.ORDER||LESSONS.map((_,k)=>k)).map(i=>`<option value="${i}" ${A&&A.i===i?'selected':''}>Lesson ${LNUM(i)}: ${esc(lessonTitle(i))}</option>`).join('');
 modal(`<div class="dashv"><h2>${esc(D.name)} <span class="muted" style="font-size:18px">code ${D.code}</span></h2>
 ${ms.length?`<p class="muted cl-tip">Tap a name to see all their lessons. Updates every 10 seconds.</p><div class="cl-scroll"><table class="hs-tab"><tr><th>Name</th>${A?`<th>Lesson ${LNUM(A.i)}</th>`:''}<th>Adventure at</th><th>Stars</th><th>WPM</th><th>Acc.</th><th>Mins this week</th><th>Seen</th><th></th></tr>${ms.map(m=>{const s=m.stats||{},st=asgState(m,A);return `<tr><td><button class="linkbtn cl-kid" data-act="clsKid" data-p="${m.pid}">${esc(m.name)}</button></td>${A?`<td><span class="asg-${st.k}">${st.t}</span></td>`:''}<td>${esc(s.lesson||'–')}</td><td>${s.stars??'–'}</td><td>${s.wpm??'–'}</td><td>${s.acc!=null?s.acc+'%':'–'}</td><td>${s.mins??0}</td><td>${ago(s.seen||m.joined)}</td><td><button class="cl-x" data-act="clsRemove" data-p="${m.pid}" title="Remove ${esc(m.name)}">✕</button></td></tr>`}).join('')}</table></div>`:`<p class="muted">Nobody has joined yet. Share the code <b>${D.code}</b>.</p>`}
 <div class="cl-sec"><h3>Assign a lesson</h3><div class="cl-field"><select id="asg" class="cl-in wide">${opts}</select><button class="btn sm volt" data-act="clsAssign">Assign</button>${A?'<button class="btn sm alt" data-act="clsAssign" data-clear="1">Clear</button>':''}</div>${A?`<p class="muted" style="margin:4px 0 0">Assigned now: Lesson ${LNUM(A.i)}: ${esc(A.title)} · ${ms.filter(m=>asgState(m,A).k==='done').length} of ${ms.length} done</p>`:''}</div>
 <div class="cl-sec"><h3>Class controls</h3><p class="muted" style="margin:0 0 6px;font-size:15px">Turn extras off for everyone in this class. Focus mode keeps it to typing lessons only.</p><div class="cl-btns" style="justify-content:flex-start;margin-bottom:6px"><button class="btn sm" data-act="clsLockAll" data-v="0">Focus mode: all off</button><button class="btn sm alt" data-act="clsLockAll" data-v="1">All on</button></div><div class="lockgrid">${(window.PAR_LIST||[]).map(([k,t])=>{const on=!(D.lock&&D.lock[k]===0);return `<button class="lockbtn ${on?'on':'off'}" data-act="clsLock" data-k="${k}">${esc(t)}<b>${on?'ON':'OFF'}</b></button>`}).join('')}</div></div>
 <div class="cl-sec"><h3>Class race</h3><div class="seg cl-lvl">${lvlsFor(true).map(([v,t])=>`<button class="${RLVL===v?'on':''}" data-act="clsLvl" data-v="${v}">${t}</button>`).join('')}</div><div class="cl-btns cl-racebtn"><button class="btn" data-act="clsRace">OPEN A CLASS RACE</button></div></div>
 <div class="rbtns"><button class="btn sm" data-act="clsRefresh">↻ Refresh</button><button class="btn sm alt" data-act="clsTeach">Back</button></div></div>`)}
/* one student: every assignment + every lesson */
ACT.clsRefresh=()=>{if(!DASH)return;ACT.clsDash({c:DASH.code,quiet:1}).then(()=>toast('Updated'))};
ACT.clsKid=d=>{DVIEW=d.p;drawKid(d.p)};ACT.clsKidBack=()=>{DVIEW=null;drawDash()};
function drawKid(p){const D=DASH,m=D.members.find(x=>x.pid===p);if(!m){DVIEW=null;return drawDash()}const s=m.stats||{},pr=progOf(m),O=window.ORDER||LESSONS.map((_,k)=>k);
 const hist=(D.hist&&D.hist.length?D.hist:(D.assign?[D.assign]:[])).slice().reverse();
 const rows=hist.map(a=>{const st=asgState(m,a);return `<tr><td>Lesson ${LNUM(a.i)}: ${esc(a.title||lessonTitle(a.i))}</td><td>${new Date(a.at).toLocaleDateString()}</td><td><span class="asg-${st.k}">${st.t}</span></td><td>${st.R?st.R.w:'–'}</td><td>${st.R?st.R.a+'%':'–'}</td><td>${st.R?new Date(st.R.d).toLocaleDateString():'–'}</td></tr>`}).join('');
 const worlds={};O.forEach(i=>{const w=worldOf(i);(worlds[w]=worlds[w]||[]).push(i)});
 const done=O.filter(i=>pr[i].n>=NST).length,part=O.filter(i=>pr[i].n>0&&pr[i].n<NST).length;
 const grid=Object.entries(worlds).map(([w,ls])=>`<div class="kw"><div class="kw-h">${esc((typeof WORLDS!=='undefined'&&WORLDS[w-1]&&(WORLDS[w-1].name||WORLDS[w-1].n))||('World '+w))}</div><div class="kw-g">${ls.map(i=>{const q=pr[i],k=q.n>=NST?'done':q.n?'part':'none';return `<span class="kl kl-${k}" title="Lesson ${LNUM(i)}: ${esc(lessonTitle(i))} · ${q.n}/${NST} parts · ${q.st} stars">${LNUM(i)}</span>`}).join('')}</div></div>`).join('');
 modal(`<div class="dashv kidv"><h2>${esc(m.name)}</h2><p class="muted" style="margin-top:-6px">Adventure at ${esc(s.lesson||'–')} · ${s.wpm??'–'} WPM · ${s.acc!=null?s.acc+'%':'–'} accuracy · seen ${ago(s.seen||m.joined)}</p>
 <div class="cl-sec"><h3>Assignments</h3>${rows?`<div class="cl-scroll"><table class="hs-tab"><tr><th>Lesson</th><th>Assigned</th><th>Status</th><th>WPM</th><th>Acc.</th><th>Finished</th></tr>${rows}</table></div>`:'<p class="muted">No lessons assigned yet.</p>'}</div>
 <div class="cl-sec"><h3>All lessons <span class="muted" style="font-size:15px">${done} complete · ${part} started · ${O.length-done-part} not started</span></h3>
 <div class="kleg"><span class="kl kl-done">✓</span> complete <span class="kl kl-part">½</span> started <span class="kl kl-none">·</span> not started</div>${s.prog?grid:'<p class="muted">Their lesson list shows up after they play once with the new version.</p>'}</div>
 <div class="rbtns"><button class="btn sm" data-act="clsRefresh">↻ Refresh</button><button class="btn sm alt" data-act="clsKidBack">Back to class</button></div></div>`)}
ACT.clsLock=d=>{const D=DASH,L=Object.assign({},D.lock||{});L[d.k]=L[d.k]===0?1:0;sendLock(L)};
ACT.clsLockAll=d=>{const L={};(window.PAR_LIST||[]).forEach(([k])=>L[k]=+d.v);sendLock(L)};
function sendLock(L){const D=DASH;post('/api/class',{a:'lock',code:D.code,tk:D.tk,lock:L}).then(r=>{Object.assign(DASH,r);toast('Saved for the class');redraw()}).catch(e=>toast(e.message))}
ACT.clsLvl=d=>{RLVL=d.v;drawDash()};
ACT.clsAssign=d=>{const D=DASH,i=d&&d.clear?null:+val('asg');post('/api/class',{a:'assign',code:D.code,tk:D.tk,i,title:i==null?'':lessonTitle(i)}).then(r=>{Object.assign(DASH,r);DASH._justAssigned=1;toast(i==null?'Cleared':'Assigned!');ACT.clsDash({c:D.code,quiet:1})}).catch(e=>toast(e.message))};
ACT.clsRemove=d=>{const D=DASH;DVIEW=null;post('/api/class',{a:'remove',code:D.code,tk:D.tk,pid:d.p}).then(()=>ACT.clsDash({c:D.code})).catch(e=>toast(e.message))};
ACT.clsRace=()=>{const D=DASH;makeRoom(RLVL,true,room=>post('/api/class',{a:'race',code:D.code,tk:D.tk,room}).catch(()=>{}))};

/* ---------- race text ---------- */
const T=(typeof KK_TEXT!=='undefined'&&KK_TEXT)||{easy:[],medium:[],hard:[]};
const pick=(a,n)=>a.slice().sort(()=>Math.random()-.5).slice(0,n);
const IMP_SENT=["On July 20, 1969, Apollo 11 landed on the Moon at 4:17 p.m. (EDT)!", "\"Quick fact!\" said Dr. Lee: about 71% of Earth is covered by water.", "Light travels ~300,000 km/s; the Moon is ~384,400 km away (about 1.3 s).", "H2O = 2 hydrogen + 1 oxygen; it freezes at 0 C & boils at 100 C.", "The Mariana Trench is ~10,935 m deep; Everest is 8,849 m tall!", "A blue whale's heart weighs ~180 kg: about as much as 2 adults.", "Earth's 7 continents & 5 oceans hold roughly 8,000,000,000 people.", "Is Pluto a planet? No; since 2006 it's called a \"dwarf planet.\""];
const LVLS=[['easy','Easy'],['medium','Medium'],['hard','Hard'],['beast','Beast'],['impossible','Impossible']];
const beatRace=()=>{const h=(S.arc&&S.arc.high||{}).race;return h==='beast'||h==='insanity'||/^beast/.test(h||'')};
const lvlsFor=teacher=>LVLS.filter(([v])=>teacher||v!=='impossible'||beatRace());
/* countdown beeps: short blip each second, a higher longer one on GO */
const beep=go=>{try{if(go){tone(880,.4,'square',.09);tone(1320,.4,'triangle',.06,.05)}else tone(440,.14,'square',.08)}catch(e){}};
function raceText(lv){const BS=typeof BEAST_SENT!=='undefined'?BEAST_SENT:T.hard;if(lv==='beast')return pick(BS,3).join(' ');if(lv==='impossible')return [...pick(BS,2),...pick(IMP_SENT,2)].sort(()=>Math.random()-.5).join(' ');
if(lv==='easy')return pick(T.easy,3).join(' ').toLowerCase().replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim();
 if(lv==='medium')return pick(T.medium,3).join(' ');return pick(T.hard,2).join(' ')}
const myLevel=()=>{const p=EI(lessonIdx());return p<16?'easy':p<44?'medium':'hard'};

/* ---------- rooms + lobby ---------- */
let ROOM=null,OFF=0,POLL=null;
const stopPoll=()=>{clearInterval(POLL);POLL=null};
function makeRoom(lv,spectate,after){post('/api/race',{a:'make',pid:pid(),name:myName(),look:myLook(),text:raceText(lv),lvl:lv,spectate}).then(r=>{ROOM={code:r.room,host:true,spectate,lvl:lv};after&&after(r.room);lobby()}).catch(e=>toast(e.message))}
ACT.raceMake=()=>{const lv=myLevel();modal(`<h2>Host a race</h2><p class="muted" style="margin:0 0 8px">Choose your difficulty</p><div class="cl-btns lvlrow">${lvlsFor(false).map(([v,t])=>`<button class="btn lv-${v} ${v===lv?'':'alt'}" data-act="raceMakeLv" data-v="${v}">${t}</button>`).join('')}</div>${beatRace()?'':'<p class="muted cl-note">Win a Keylori Race on Beast mode to unlock Impossible.</p>'}<div class="rbtns"><button class="btn alt" data-act="raceHub">Back</button></div>`)};
ACT.raceMakeLv=d=>makeRoom(d.v,false);
ACT.raceJoin=()=>joinRoom(val('raceCode'));
ACT.raceJoinCode=d=>joinRoom(d.r);
function joinRoom(code){if(!code)return toast('Type the race code');post('/api/race',{a:'join',room:code,pid:pid(),name:myName(),look:myLook()}).then(r=>{ROOM={code:code.toUpperCase(),host:r.host===pid(),lvl:r.lvl};OFF=r.now-Date.now();ROOM.last=r;lobby()}).catch(e=>toast(e.message))}
function lobby(){stopPoll();const tick=()=>post('/api/race',{a:'get',room:ROOM.code,pid:pid()}).then(r=>{OFF=r.now-Date.now();ROOM.last=r;if(r.state==='go'){stopPoll();return ROOM.spectate?watch():startNet(r)}drawLobby(r)}).catch(e=>{stopPoll();toast(e.message)});
 drawLobby(ROOM.last||{players:[]});tick();POLL=setInterval(()=>{if($('#modal').hidden||!document.querySelector('#mbox .lobby'))return stopPoll();tick()},2000)}
function drawLobby(r){const ps=r.players||[];
 modal(`<h2>Race room</h2><div class="lobby"><p style="margin:0">Friends join with this code:</p><div class="cl-big">${esc(ROOM.code)}</div>
 <div class="cl-chips">${ps.length?ps.map(p=>`<span class="cl-chip ${p.pid===pid()?'me':''}">${esc(p.name)}</span>`).join(''):'<span class="muted">Waiting for racers...</span>'}</div>
 <p class="muted" style="margin:6px 0 0">${ROOM.host?(ps.length?`${ps.length} racer${ps.length>1?'s':''} ready. Start when everyone is in!`:'Waiting for racers...'):'Waiting for the host to start...'}</p></div>
 <div class="cl-btns" style="justify-content:center;margin-top:8px"><button class="btn sm sharebtn" data-act="raceShare">Copy invite link</button></div>
 <div class="rbtns">${(ROOM.host||(!ROOM.last?.spectate&&!ps.some(p=>p.pid===ROOM.last?.host)&&ps[0]&&ps[0].pid===pid()))?`<button class="btn" data-act="raceStart" ${ps.length?'':'disabled'}>Start race!</button>`:''}<button class="btn alt" data-act="raceLeave">Leave</button></div>`)}
ACT.raceStart=()=>post('/api/race',{a:'start',room:ROOM.code,pid:pid()}).then(r=>{OFF=r.now-Date.now();stopPoll();ROOM.spectate?watch():startNet(r)}).catch(e=>toast(e.message));
ACT.raceShare=()=>{if(!ROOM)return;const url=location.origin+location.pathname+'?race='+ROOM.code;
 const ok=()=>toast('Invite link copied to clipboard!'),fallback=()=>{try{const t=document.createElement('textarea');t.value=url;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();ok()}catch(e){toast(url)}};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(ok).catch(fallback);else fallback()};
ACT.raceRematch=()=>{const R=ROOM;if(!R)return ACT.raceHub();post('/api/race',{a:'rematch',room:R.code,pid:pid(),name:myName(),look:myLook(),text:raceText(R.lvl||myLevel())}).then(r=>{stopPoll();OFF=r.now-Date.now();ROOM={code:R.code,host:r.host===pid(),spectate:R.spectate&&r.host===pid(),lvl:r.lvl||R.lvl,last:r};if(screen==='game')show('arcade');lobby()}).catch(e=>toast(e.message))};
ACT.raceLeave=()=>{stopPoll();ROOM=null;closeModal()};

/* ---------- racing ---------- */
const ORD=['1st','2nd','3rd'];const ord=n=>ORD[n-1]||n+'th';
function startNet(r){closeModal();const startLocal=r.startAt-OFF;
 try{startRace()}catch(e){console.warn(e)}
 if(G.raf)cancelAnimationFrame(G.raf);
 const others=r.players.filter(p=>p.pid!==pid()),lanes=others.slice(0,9);
 G.text=r.text;G.pos=0;G.mist=new Set();G.start=0;G.done=false;G.racers=[];
 G.net={room:ROOM.code,startLocal,ps:{},lanes:lanes.map(p=>p.pid),all:r.players,fin:false};
 const met=Object.keys(S.cards).sort(()=>Math.random()-.5);
 $('#garena').innerHTML=`<div class="finish"></div><div class="lane"><div class="runner" id="rn0">${zookSVG()}<span class="rname">${esc(myName())}</span></div></div>`+lanes.map((p,k)=>`<div class="lane"><div class="runner" id="rq${k}">${heroBig(p.look)}<span class="rname">${esc(p.name)}</span></div></div>`).join('')+`<div class="cdown" id="cdown"></div><div class="rlist" id="rlist"></div>`;$('#garena').style.setProperty('--lanes',lanes.length+1);$('#garena').classList.add('netrace');
 $('#gstripIn').innerHTML=[...G.text].map(c=>`<span class="${c===' '?'sp':''}">${c===' '?'·':esc(c)}</span>`).join('');raceStrip();
 const g=G;const loop=()=>{if(G!==g||G.done)return;const now=Date.now();const cd=$('#cdown');
  if(now<startLocal){const n=Math.ceil((startLocal-now)/1000);if(cd&&cd.textContent!==String(n)){cd.textContent=n;if(n<=5)beep(false)}}else{if(cd&&cd.textContent!=='GO!'&&!G.start){cd.textContent='GO!';beep(true);setTimeout(()=>cd&&cd.remove(),700)}if(!G.start)G.start=performance.now()}
  G.net.lanes.forEach((id,k)=>{const p=G.net.ps[id],el=$('#rq'+k);if(p&&el)el.style.left=(Math.min(1,p.pos/G.text.length)*84)+'%'});
  if(G.start){const el=(performance.now()-G.start)/60000;$('#g-a').textContent=G.pos?Math.round(G.pos/5/Math.max(el,1/60)):0}
  G.raf=requestAnimationFrame(loop)};loop();
 const send=()=>{if(G!==g||screen!=='game'){clearInterval(g.net.iv);return}const el=G.start?(performance.now()-G.start)/60000:0;
  post('/api/race',{a:'tick',room:g.net.room,pid:pid(),pos:G.pos,wpm:G.pos&&el?Math.round(G.pos/5/el):0,acc:G.pos?Math.round((G.pos-G.mist.size)/G.pos*100):100,bad:g.net.bad||0}).then(r=>{OFF=r.now-Date.now();g.net.all=r.players;r.players.forEach(p=>g.net.ps[p.pid]=p);
   const me=r.players.findIndex(p=>p.pid===pid())+1;$('#g-b').textContent=me?ord(me):'';const L=$('#rlist');if(L)L.innerHTML=r.players.slice(0,8).map((p,k)=>`<div class="${p.pid===pid()?'me':''}"><b>${k+1}</b> ${esc(p.name)} ${p.ft?'✓':Math.round(p.pos/G.text.length*100)+'%'}</div>`).join('');
   if(g.net.fin)drawNetResult()}).catch(()=>{})};
 g.net.iv=setInterval(send,1500)}
const _ri=raceInput;raceInput=function(ch,caps){if(G.net&&(Date.now()<G.net.startLocal||G.net.fin))return;const g=G,p0=g.pos,r=_ri.apply(this,arguments);if(g.net&&g.pos===p0&&!g.done)g.net.bad=(g.net.bad||0)+1;return r};
const _er=endRace;endRace=function(){if(!G.net)return _er.apply(this,arguments);const g=G;G.done=true;setTarget(null);g.net.fin=true;
 const secs=(performance.now()-g.start)/1000,len=g.text.length;g.net.wpm=Math.round(len/5/Math.max(secs/60,1/60));g.net.acc=Math.round((len-g.mist.size)/len*100);
 S.hist.push({t:Date.now(),w:g.net.wpm,a:g.net.acc});if(S.hist.length>80)S.hist.shift();S.time+=Math.round(secs);S.xp+=len;sfx.win();
 post('/api/race',{a:'tick',room:g.net.room,pid:pid(),pos:len,wpm:g.net.wpm,acc:g.net.acc,bad:g.net.bad||0}).then(r=>{g.net.all=r.players;const place=r.players.findIndex(p=>p.pid===pid())+1;g.net.place=place;const gems=[3,2,1][place-1]||0;S.gems+=gems;if(place===1)S.netw=(S.netw||0)+1;S.netb=Math.max(S.netb||0,g.net.wpm||0);g.net.gems=gems;save();drawNetResult()}).catch(()=>{save();drawNetResult()});
 clearInterval(g.net.iv);g.net.iv=setInterval(()=>{if(!document.querySelector('#mbox .netres')||G!==g)return clearInterval(g.net.iv);post('/api/race',{a:'get',room:g.net.room,pid:pid()}).then(r=>{g.net.all=r.players;drawNetResult(true)}).catch(()=>{})},2500)};
const mmss=ms=>{const t=Math.max(0,Math.round(ms/1000));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
function standingsHTML(ps,len,full){const st=full&&full.startAt,now=Date.now()+OFF;return `<div class="cl-scroll"><table class="hs-tab"><tr><th>#</th><th>Racer</th><th>Progress</th><th>WPM</th>${full?'<th>Accuracy</th><th>Time</th><th>Right / Wrong</th>':''}</tr>${ps.map((p,k)=>`<tr class="${p.pid===pid()?'me':''}"><td><b>${k+1}</b></td><td><img class="cl-hero" src="${heroIcon(p.look)}" alt="" style="height:22px;vertical-align:middle;margin-right:6px">${esc(p.name)}</td><td>${p.ft?'Finished!':`<div class="cl-bar"><i style="width:${Math.round(p.pos/len*100)}%"></i></div>`}</td><td>${p.wpm||'–'}</td>${full?`<td>${p.pos?(p.acc??100)+'%':'–'}</td><td>${st&&now>st?mmss((p.ft||now)-st):'–'}</td><td><span style="color:#6edc8c">${p.pos||0}</span> / <span style="color:#f07a6e">${p.bad||0}</span></td>`:''}</tr>`).join('')}</table></div>`}
function drawNetResult(update){const g=G;if(!g||!g.net)return;const box=document.querySelector('#mbox .netres');if(update&&box){box.innerHTML=standingsHTML(g.net.all,g.text.length);return}
 if(update)return;const pl=g.net.place;
 modal(`<h2>${pl===1?'You won the race!':pl?ord(pl)+' place!':'Race finished!'}</h2>
 <div class="rstats"><div><b>${pl?ord(pl):'–'}</b><span>Place</span></div><div><b>${g.net.wpm}</b><span>WPM</span></div><div><b>${g.net.acc}%</b><span>Accuracy</span></div><div><b>+${g.net.gems||0}</b><span>Diamonds</span></div></div>
 <div class="netres">${standingsHTML(g.net.all,g.text.length)}</div>
 <div class="rbtns"><button class="btn nextbtn" data-act="raceRematch">Rematch</button><button class="btn alt" data-act="raceHub">New race</button><button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`)}

/* ---------- host watching a class race ---------- */
function watch(){const len=(ROOM.last&&ROOM.last.text||'').length||1;const draw=r=>{const now=Date.now(),st=r.startAt-OFF;
  const done=r.players.length&&r.players.every(p=>p.ft);modal(`<h2>Class race ${esc(ROOM.code)}</h2><div class="watch">${now<st?`<div class="cl-big">${Math.ceil((st-now)/1000)}</div>`:''}${standingsHTML(r.players,r.text.length||len,r)}</div><div class="rbtns">${done||now>st+20000?'<button class="btn nextbtn" data-act="raceRematch">Rematch</button>':''}<button class="btn alt" data-act="raceLeave">Close</button></div>`)};
 const tick=()=>post('/api/race',{a:'get',room:ROOM.code,pid:pid()}).then(r=>{OFF=r.now-Date.now();if(!document.querySelector('#mbox .watch')&&POLL)return stopPoll();draw(r);if(r.players.length&&r.players.every(p=>p.ft))stopPoll()}).catch(()=>{});
 modal('<h2>Class race</h2><div class="watch"><p class="muted">Getting ready...</p></div>');tick();POLL=setInterval(tick,1500)}

document.head.insertAdjacentHTML('beforeend',`<style>
.clsban{margin:0 0 10px;padding:8px 12px;display:flex;flex-direction:column;gap:6px}.clsban .cb-name{font-size:15px;color:#b8a8d8}.clsban .cb-row{display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap}
.cl-sec{margin:10px 0 0;text-align:left}.cl-sec h3{margin:0 0 6px;font-size:18px}.cl-btns{display:flex;gap:8px;flex-wrap:wrap}
.cl-field{display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap}.cl-in{font:inherit;font-size:20px;padding:6px 10px;width:9ch;text-transform:uppercase;background:#1b1626;color:#fff6e0;border:3px solid #3a2f4e}.cl-in.wide{width:auto;flex:1;min-width:12ch;text-transform:none;font-size:17px}
#mbox:has(.watch){max-width:860px!important;width:94vw}.watch .hs-tab th,.watch .hs-tab td{white-space:nowrap;padding-left:8px;padding-right:8px}.watch .hs-tab td:nth-child(3){min-width:110px}
.cl-lvl{margin-bottom:14px}.cl-racebtn{justify-content:flex-start!important}.cl-racebtn .btn{min-width:300px;text-transform:uppercase;font-size:18px!important;padding:10px 26px!important}
.cl-kid{font:inherit;font-weight:700;color:#7fe8ff;text-decoration:underline;background:none;border:0;padding:0;cursor:pointer}.cl-tip{margin:0 0 6px;font-size:14px}
.asg-done{color:#6edc8c;font-weight:700}.asg-part{color:#f0c860}.asg-none{color:#9a8fb0}.asg-own{color:#a8d8a0}.clsban .cb-done{color:#6edc8c;font-weight:700;margin-left:auto}
#mbox:has(.kidv),#mbox:has(.dashv){max-width:900px!important;width:94vw}
.kw{margin:6px 0}.kw-h{font-size:14px;color:#b8a8d8;margin-bottom:3px}.kw-g{display:flex;flex-wrap:wrap;gap:4px}
.kl{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:26px;padding:0 4px;font-size:13px;border:2px solid #2a1d3e;box-sizing:border-box}
.kl-done{background:#58a848;color:#fff}.kl-part{background:#f0c860;color:#2a1d3e}.kl-none{background:#3a2f4e;color:#9a8fb0}.kleg{display:flex;gap:8px;align-items:center;font-size:13px;margin:4px 0 6px;flex-wrap:wrap}
.asgdone{text-align:center}.asgdone .big{font-size:20px;margin:4px 0}.rstats2{display:flex;gap:12px;justify-content:center;margin:10px 0}.rstats2 div{background:#1b1626;padding:8px 16px;display:flex;flex-direction:column}.rstats2 b{font-size:26px;color:#f0c860}
.lockgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px}.lockbtn{font:inherit;font-size:15px;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 10px;background:#1b1626;color:#fff6e0;border:3px solid #3a2f4e;cursor:pointer;text-align:left}.lockbtn b{font-size:13px;padding:1px 6px}.lockbtn.on b{background:#6edc8c;color:#1b1626}.lockbtn.off b{background:#f07a6e;color:#1b1626}.lockbtn.off{opacity:.8}
select.cl-in option{font:inherit;font-size:17px;padding:4px 8px;background:#1b1626;color:#fff6e0}
@supports (appearance:base-select){select.cl-in,select.cl-in::picker(select){appearance:base-select}select.cl-in::picker(select){background:#1b1626;border:3px solid #3a2f4e;max-height:60vh}select.cl-in option:checked,select.cl-in option:hover{background:#3a2f4e}}
.cl-note{font-size:15px;margin:10px 0 0}.cl-big{font-size:46px;letter-spacing:.12em;color:#f0c860;margin:8px 0;text-align:center}
.cl-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:6px}.cl-chip{padding:3px 10px;background:#2a2340;border:2px solid #3a2f4e}.cl-chip.me{border-color:#7fe8ff}.cl-chip{display:inline-flex;align-items:center;gap:6px}.cl-hero{height:28px;width:auto;image-rendering:pixelated}
.cl-list{display:flex;flex-wrap:wrap;gap:8px}.cl-scroll{max-height:44vh;overflow:auto}.cl-x{background:none;border:0;color:#b8a8d8;cursor:pointer;font:inherit}
.cl-bar{height:10px;background:#2a2340;border:2px solid #3a2f4e;min-width:80px}.cl-bar i{display:block;height:100%;background:#7fe8ff}
.runner .rname{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);font-size:12px;white-space:nowrap;background:rgba(27,22,38,.8);padding:0 4px;color:#fff6e0}
.cdown{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:72px;color:#f0c860;text-shadow:4px 4px 0 #1b1626;pointer-events:none;z-index:5}
.netrace .lane{height:calc(100% / var(--lanes,4))}.netrace .runner .rname{font-size:11px}
.btn.racebtn{background:#f0c860!important;color:#2a1d3e!important;box-shadow:0 4px 0 #a8802a!important}
#s-home .topbar .btn.clsbtn{background:#7fd8c8!important;color:#1b2a2e!important;box-shadow:4px 4px 0 rgba(4,6,24,.65)!important;height:42px!important;font-family:var(--title)!important;font-size:13px!important;padding:0 10px!important;letter-spacing:.04em;display:inline-flex;align-items:center}#s-home .topbar .btn.clsbtn .bico.hico{height:22px;margin:0 6px 0 0}
#s-home .btn.selp{background:#b8a0e8!important;color:#2a1d3e!important}
#s-home .roamtog.arcade-switch{display:inline-flex;align-items:center;gap:7px;border:2px solid #8862b6;border-radius:10px;background:#2a1d3e;color:#e9dcfa;padding:0 10px;height:42px;cursor:pointer;font:400 12px/1.2 var(--title);letter-spacing:.05em;margin-right:auto;box-shadow:4px 4px 0 rgba(4,6,24,.65)}
#s-home .roamtog.on{background:#6e3f9d;color:#fff;border-color:#c9a4f1}
#s-home .roamtog .switch-track{position:relative;display:inline-block;width:37px;height:19px;border-radius:20px;background:#766887;border:2px solid #d4bfec;box-sizing:border-box}
#s-home .roamtog .switch-thumb{position:absolute;top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:left .15s}
#s-home .roamtog.on .switch-track{background:#bce984}#s-home .roamtog.on .switch-thumb{left:20px;background:#294014}
.btn.sharebtn{background:#6edc8c!important;color:#14301e!important;box-shadow:0 4px 0 #3a9a5a!important}
.raceHubBox .cl-sec{text-align:center}.raceHubBox .cl-btns,.raceHubBox .cl-field{justify-content:center}
.cl-btns.lvlrow{flex-wrap:nowrap;justify-content:center;gap:6px}.cl-btns.lvlrow .btn{padding:8px 10px!important;font-size:15px!important;flex:1 1 0;min-width:0;white-space:nowrap}
.raceart{width:180px;height:140px;background-size:360px 140px;background-repeat:no-repeat;image-rendering:pixelated;animation:raceRun .32s steps(2) infinite}
@keyframes raceRun{from{background-position:0 0}to{background-position:-360px 0}}
#s-arcade .game .gart{height:140px;flex:none;display:flex;align-items:center;justify-content:center;overflow:visible}
#s-arcade .game > h3{flex:none}#s-arcade .game > p{min-height:2.7em;flex:none}
#s-arcade .game .arcade-stats{margin-top:6px!important;margin-bottom:12px!important}
#s-arcade .game .arcade-stat.level{min-height:76px;display:flex;flex-direction:column;justify-content:center;grid-column:1/-1}
#s-arcade .game .arcade-stats ~ *{margin-top:auto}
#s-arcade .game .arcade-stats ~ * ~ *{margin-top:0}
.btn.lv-beast{background:#c8402e!important;color:#fff!important}.btn.lv-impossible{background:#4a1a6a!important;color:#fff!important}
#s-arcade .game > p{min-height:2.9em}
.rlist{position:absolute;right:6px;top:6px;font-size:13px;background:rgba(27,22,38,.8);padding:4px 8px;z-index:4}.rlist .me{color:#7fe8ff}
</style>`);
/* opening an invite link joins the race */
{const q=(new URLSearchParams(location.search).get('race')||'').trim();if(/^[a-z]{3,4}[0-9]{2}$/i.test(q)){try{history.replaceState(null,'',location.pathname)}catch(e){}
 let n=0;const tryJoin=()=>{if(S.name&&typeof screen!=='undefined'&&screen==='home'&&$('#modal').hidden)return joinRoom(q);if(++n<240)setTimeout(tryJoin,500)};setTimeout(tryJoin,800)}}
try{if(screen==='home')renderHome();if(screen==='arcade')renderArcade()}catch(e){}
})();
