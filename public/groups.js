/* Classes, friend groups and live race rooms. Only first names + typing stats leave the device. No chat. */
(function(){
const post=(u,b)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Could not connect');return j});
const pid=()=>{if(!S.cid||!/^[a-z0-9]{6,24}$/.test(S.cid)){S.cid=(Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/g,'').slice(0,16);save()}return S.cid};
const myName=()=>S.name||'Player';
const GN={meteor:'Meteor Zap',race:'Typing Race',glitch:'Scrambler Attack',bubble:'Bubble Pop',dig:'Treasure Dig',keeper:'Keylori Keeper',bridge:'Story Bridge'};
const TEACH='kl-teach';const teach=()=>{try{return JSON.parse(localStorage.getItem(TEACH)||'{}')}catch(e){return{}}};const setTeach=t=>{try{localStorage.setItem(TEACH,JSON.stringify(t))}catch(e){}};
const weekStart=()=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime()};
const lessonIdx=()=>Math.floor(nextStage()/NST);

/* ---------- stats sent to the class ---------- */
function stats(){const i=lessonIdx(),h=(S.hist||[]).slice(-8),avg=f=>h.length?Math.round(h.reduce((a,x)=>a+f(x),0)/h.length):0,ws=weekStart();
 if(!S.wk||S.wk.w!==ws)S.wk={w:ws,base:S.time||0};
 const arc={};(S.hs||[]).filter(x=>x.t>=ws).forEach(x=>{if(!arc[x.g]||x.wpm>arc[x.g].wpm)arc[x.g]={wpm:x.wpm,acc:x.acc}});
 return{lesson:`Lesson ${LNUM(i)}: ${lessonTitle(i)}`,pos:LNUM(i),world:worldOf(i),stars:Object.values(S.best||{}).reduce((a,b)=>a+b,0),wpm:avg(x=>x.w),acc:avg(x=>x.a),mins:Math.round(((S.time||0)-S.wk.base)/60),arc}}
let lastRep=0;
function report(force){if(!S.cls||(!force&&Date.now()-lastRep<15000))return;lastRep=Date.now();post('/api/class',{a:'report',code:S.cls.code,pid:pid(),name:myName(),stats:stats()}).then(info=>{CLS_INFO=info;homeBanner()}).catch(()=>{})}
const _res=results;results=function(){const r=_res.apply(this,arguments);setTimeout(report,1500);return r};
const _md=modal;modal=function(){const r=_md.apply(this,arguments);try{if(screen==='game'&&$('#mbox .rstats'))setTimeout(report,1500)}catch(e){}return r};

/* ---------- home: class banner (teacher's pick + open class race) ---------- */
let CLS_INFO=null,lastInfo=0;
function fetchInfo(){if(!S.cls||Date.now()-lastInfo<15000)return;lastInfo=Date.now();post('/api/class',{a:'info',code:S.cls.code}).then(i=>{CLS_INFO=i;S.cls.name=i.name;homeBanner()}).catch(e=>{if(/not found/i.test(e.message)){S.cls=null;save()}})}
function homeBanner(){const home=$('#s-home');if(!home||home.hidden)return;home.querySelector('.clsban')?.remove();if(!S.cls||!CLS_INFO)return;const I=CLS_INFO;
 const pick=I.assign&&LESSONS[I.assign.i]?`<div class="cb-row"><span>Teacher's pick: <b>Lesson ${LNUM(I.assign.i)}: ${esc(lessonTitle(I.assign.i))}</b></span><button class="btn sm volt" data-act="clsPick" data-i="${I.assign.i}">Play</button></div>`:'';
 const race=I.race?`<div class="cb-row"><span>A class race is open!</span><button class="btn sm" data-act="raceJoinCode" data-r="${esc(I.race.room)}">Join race</button></div>`:'';
 if(!pick&&!race)return;const tb=home.querySelector('.topbar');const el=document.createElement('div');el.className='clsban panel';el.innerHTML=`<div class="cb-name">${esc(I.name||'My class')}</div>${pick}${race}`;
 tb?tb.insertAdjacentElement('afterend',el):home.prepend(el)}
ACT.clsPick=d=>{const i=+d.i;let s=0;for(;s<NST-1;s++)if(!((S.best[i+'-'+s]||0)>=1))break;closeModal();startStage(i*NST+s)};
const _rh=renderHome;renderHome=function(){const r=_rh.apply(this,arguments);try{const row=$('#s-home .hi-btns');row?.querySelector('[data-act=clsHub]')?.remove();if(row&&!row.querySelector('[data-act=raceHub]'))row.insertAdjacentHTML('beforeend','<button class="btn racebtn" data-act="raceHub">Race</button>');
 const tb=$('#s-home .topbar');if(tb&&S.name&&!tb.querySelector('.clsbtn')){const after=tb.querySelector('.roamtog')||tb.querySelector('.selp');const h='<button class="btn clsbtn" data-act="clsHub">CLASS</button>';after?after.insertAdjacentHTML('afterend',h):tb.insertAdjacentHTML('afterbegin',h)}homeBanner();fetchInfo()}catch(e){}return r};
setInterval(()=>{if(typeof screen!=='undefined'&&screen==='home'&&S.cls){lastInfo=0;fetchInfo()}},20000);
const _ra=renderArcade;renderArcade=function(){const r=_ra.apply(this,arguments);try{const tb=$('#s-arcade .topbar');if(tb&&!tb.querySelector('[data-act=raceHub]'))tb.insertAdjacentHTML('beforeend','<button class="btn sm racebtn" data-act="raceHub">Race Friends</button>')}catch(e){}return r};

/* ---------- hub ---------- */
const field=(id,ph,act,label)=>`<div class="cl-field"><input id="${id}" class="cl-in" maxlength="6" placeholder="${ph}" autocomplete="off" autocapitalize="characters" data-enter="${act}"><button class="btn sm volt" data-act="${act}">${label}</button></div>`;
ACT.raceHub=()=>{modal(`<h2>Race with friends</h2><p class="muted" style="margin:0 0 8px">Everyone types the same story at the same time. Up to 40 racers!</p>
 <div class="cl-sec"><h3>Start a race</h3><div class="cl-btns"><button class="btn racebtn" data-act="raceMake">Make a race room</button></div></div>
 <div class="cl-sec"><h3>Join a race</h3>${field('raceCode','ZAP12','raceJoin','Join race')}</div>
 <p class="muted cl-note">Only first names are shared. There is no chat.</p><div class="rbtns"><button class="btn alt" data-act="close">Close</button></div>`)};
ACT.clsHub=()=>{const c=S.cls;
 modal(`<h2>My Class</h2>
 <div class="cl-sec"><h3>My class or friend group</h3>${c?`<p style="margin:0">You're in <b>${esc(c.name||'a class')}</b> <span class="muted">(code ${esc(c.code)})</span></p><div class="cl-btns"><button class="btn sm" data-act="clsBoard">Class leaderboard</button><button class="btn sm alt" data-act="clsLeave">Leave</button></div>`:`<p class="muted" style="margin:0 0 6px">Got a code from your teacher or a friend's grown-up?</p>${field('clsCode','ABC123','clsJoin','Join')}`}</div>
 <div class="cl-sec"><h3>Grown-ups</h3><div class="cl-btns"><button class="btn sm alt" data-act="clsTeach">Teacher / parent dashboard</button></div></div>
 <p class="muted cl-note">Only first names and typing scores are shared. There is no chat.</p>
 <div class="rbtns"><button class="btn alt" data-act="close">Close</button></div>`)};
document.addEventListener('keydown',e=>{const t=e.target;if(e.key==='Enter'&&t&&t.dataset&&t.dataset.enter){e.preventDefault();e.stopPropagation();ACT[t.dataset.enter]&&ACT[t.dataset.enter]({})}},true);
const val=id=>(document.getElementById(id)?.value||'').trim();
ACT.clsJoin=()=>{const code=val('clsCode');if(!code)return toast('Type the class code');post('/api/class',{a:'join',code,pid:pid(),name:myName()}).then(i=>{S.cls={code:code.toUpperCase(),name:i.name};CLS_INFO=i;save();toast('You joined '+i.name+'!');report(true);ACT.clsHub()}).catch(e=>toast(e.message))};
ACT.clsLeave=()=>{const c=S.cls;if(!c)return;post('/api/class',{a:'leave',code:c.code,pid:pid()}).catch(()=>{});S.cls=null;CLS_INFO=null;save();ACT.clsHub()};
let BTAB='all',BROWS=null;
ACT.clsBoard=d=>{if(d&&d.g){BTAB=d.g;return drawBoard()}if(!S.cls)return;post('/api/class',{a:'board',code:S.cls.code}).then(b=>{BROWS=b;drawBoard()}).catch(e=>toast(e.message))};
function drawBoard(){const b=BROWS;if(!b)return;const rows=(BTAB==='all'?b.rows:b.rows.filter(x=>x.g===BTAB)).slice(0,15),medal=['#f0c860','#c8d0dc','#d08a50'];
 modal(`<h2>${esc(b.name)}: this week</h2><div class="hs-tabs">${['all',...Object.keys(GN)].map(g=>`<button class="${g===BTAB?'on':''}" data-act="clsBoard" data-g="${g}">${g==='all'?'All games':GN[g]}</button>`).join('')}</div>
 ${rows.length?`<table class="hs-tab"><tr><th>#</th><th>Player</th>${BTAB==='all'?'<th>Game</th>':''}<th>WPM</th><th>Accuracy</th></tr>${rows.map((x,k)=>`<tr class="${x.n===myName()?'me':''}"><td><b style="color:${medal[k]||'inherit'}">${k+1}</b></td><td>${esc(x.n)}</td>${BTAB==='all'?`<td>${GN[x.g]||x.g}</td>`:''}<td><b>${x.wpm}</b></td><td>${x.acc}%</td></tr>`).join('')}</table>`:'<p class="muted">No arcade scores yet this week.</p>'}
 <div class="rbtns"><button class="btn alt" data-act="clsHub">Back</button></div>`)}

/* ---------- grown-up gate + dashboard ---------- */
let GATE2=0;
ACT.clsTeach=()=>{if(window.__clsOk)return teachList();const a=6+Math.floor(Math.random()*4),b=3+Math.floor(Math.random()*7);GATE2=a*b;
 modal(`<h2>GROWN-UPS ONLY</h2><div class="pgatebox"><p class="pgq">What is ${a} × ${b}?</p><input id="pgate2" class="pgin" inputmode="numeric" autocomplete="off" maxlength="3" data-enter="clsGateOk" aria-label="Answer"></div>
 <div class="rbtns"><button class="btn" data-act="clsGateOk">OK</button><button class="btn alt" data-act="clsHub">Back</button></div>`);setTimeout(()=>$('#pgate2')?.focus(),50)};
ACT.clsGateOk=()=>{if(+val('pgate2')!==GATE2){toast('Not quite. Ask a grown-up!');return ACT.clsHub()}window.__clsOk=1;teachList()};
function teachList(){const t=teach(),codes=Object.keys(t);
 modal(`<h2>Teacher / Parent</h2>${codes.length?`<div class="cl-list">${codes.map(c=>`<button class="btn sm" data-act="clsDash" data-c="${c}">${esc(t[c].name)} <span class="muted">${c}</span></button>`).join('')}</div>`:'<p class="muted">You have no classes on this device yet.</p>'}
 <div class="cl-sec"><h3>Make a new class or friend group</h3><div class="cl-field"><input id="clsName" class="cl-in wide" maxlength="40" placeholder="Room 4, or Cousins" autocomplete="off" data-enter="clsCreate"><button class="btn sm volt" data-act="clsCreate">Make it</button></div></div>
 <p class="muted cl-note">Kids join with the code. You'll see their progress here. Use the same device to come back to this dashboard.</p>
 <div class="rbtns"><button class="btn alt" data-act="clsHub">Back</button></div>`)}
ACT.clsCreate=()=>{const name=val('clsName')||'Our class';post('/api/class',{a:'create',name}).then(r=>{const t=teach();t[r.code]={tk:r.tk,name};setTeach(t);
 modal(`<h2>${esc(name)} is ready!</h2><p style="margin:0">Kids tap <b>CLASS</b> at the top of the home screen and enter:</p><div class="cl-big">${r.code}</div>
 <div class="rbtns"><button class="btn" data-act="clsDash" data-c="${r.code}">Open dashboard</button></div>`)}).catch(e=>toast(e.message))};
let DASH=null,RLVL='easy';
ACT.clsDash=d=>{const c=(d&&d.c)||DASH&&DASH.code,t=teach()[c];if(!t)return teachList();post('/api/class',{a:'dash',code:c,tk:t.tk}).then(r=>{DASH={code:c,tk:t.tk,...r};drawDash()}).catch(e=>toast(e.message))};
const ago=ts=>{if(!ts)return'never';const m=Math.round((Date.now()-ts)/60000);return m<2?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago'};
function drawDash(){const D=DASH,ms=D.members.slice().sort((a,b)=>(b.stats?.pos||0)-(a.stats?.pos||0));
 const opts=(window.ORDER||LESSONS.map((_,k)=>k)).map(i=>`<option value="${i}" ${D.assign&&D.assign.i===i?'selected':''}>Lesson ${LNUM(i)}: ${esc(lessonTitle(i))}</option>`).join('');
 modal(`<h2>${esc(D.name)} <span class="muted" style="font-size:18px">code ${D.code}</span></h2>
 ${ms.length?`<div class="cl-scroll"><table class="hs-tab"><tr><th>Name</th><th>Now on</th><th>Stars</th><th>WPM</th><th>Acc.</th><th>Mins this week</th><th>Seen</th><th></th></tr>${ms.map(m=>{const s=m.stats||{};return `<tr><td><b>${esc(m.name)}</b></td><td>${esc(s.lesson||'–')}</td><td>${s.stars??'–'}</td><td>${s.wpm??'–'}</td><td>${s.acc!=null?s.acc+'%':'–'}</td><td>${s.mins??0}</td><td>${ago(s.seen||m.joined)}</td><td><button class="cl-x" data-act="clsRemove" data-p="${m.pid}" title="Remove ${esc(m.name)}">✕</button></td></tr>`}).join('')}</table></div>`:`<p class="muted">Nobody has joined yet. Share the code <b>${D.code}</b>.</p>`}
 <div class="cl-sec"><h3>Assign a lesson</h3><div class="cl-field"><select id="asg" class="cl-in wide">${opts}</select><button class="btn sm volt" data-act="clsAssign">Assign</button>${D.assign?'<button class="btn sm alt" data-act="clsAssign" data-clear="1">Clear</button>':''}</div>${D.assign?`<p class="muted" style="margin:4px 0 0">Assigned now: Lesson ${LNUM(D.assign.i)}: ${esc(D.assign.title)}</p>`:''}</div>
 <div class="cl-sec"><h3>Class race</h3><div class="seg cl-lvl">${lvlsFor(true).map(([v,t])=>`<button class="${RLVL===v?'on':''}" data-act="clsLvl" data-v="${v}">${t}</button>`).join('')}</div><div class="cl-btns"><button class="btn sm" data-act="clsRace">Open a class race</button></div></div>
 <div class="rbtns"><button class="btn sm" data-act="clsDash">Refresh</button><button class="btn sm alt" data-act="clsTeach">Back</button></div>`)}
ACT.clsLvl=d=>{RLVL=d.v;drawDash()};
ACT.clsAssign=d=>{const D=DASH,i=d&&d.clear?null:+val('asg');post('/api/class',{a:'assign',code:D.code,tk:D.tk,i,title:i==null?'':lessonTitle(i)}).then(r=>{Object.assign(DASH,r);toast(i==null?'Cleared':'Assigned!');drawDash()}).catch(e=>toast(e.message))};
ACT.clsRemove=d=>{const D=DASH;post('/api/class',{a:'remove',code:D.code,tk:D.tk,pid:d.p}).then(()=>ACT.clsDash({c:D.code})).catch(e=>toast(e.message))};
ACT.clsRace=()=>{const D=DASH;makeRoom(RLVL,true,room=>post('/api/class',{a:'race',code:D.code,tk:D.tk,room}).catch(()=>{}))};

/* ---------- race text ---------- */
const T=(typeof KK_TEXT!=='undefined'&&KK_TEXT)||{easy:[],medium:[],hard:[]};
const pick=(a,n)=>a.slice().sort(()=>Math.random()-.5).slice(0,n);
const IMP_SENT=['On 12/03 at 4:45pm, 37% of the 1,284 gnomes paid $9.50 each!','"Quick!" yelled Dr. O\'Malley. "Zap the #7 & #8 vortex (now)."','Jinxed wizards pluck 26 ivy twigs; @Max owes Fizzbin 3/4 of a jar.','Pack my box with five dozen liquor jugs? No: 48 jam jars & 19 kiwis.'];
const LVLS=[['easy','Easy'],['medium','Medium'],['hard','Hard'],['beast','Beast'],['impossible','Impossible']];
const beatRace=()=>{const h=(S.arc&&S.arc.high||{}).race;return h==='beast'||h==='insanity'||/^beast/.test(h||'')};
const lvlsFor=teacher=>LVLS.filter(([v])=>teacher||v!=='impossible'||beatRace());
function raceText(lv){const BS=typeof BEAST_SENT!=='undefined'?BEAST_SENT:T.hard;if(lv==='beast')return pick(BS,3).join(' ');if(lv==='impossible')return [...pick(BS,2),...pick(IMP_SENT,2)].sort(()=>Math.random()-.5).join(' ');
if(lv==='easy')return pick(T.easy,3).join(' ').toLowerCase().replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim();
 if(lv==='medium')return pick(T.medium,3).join(' ');return pick(T.hard,2).join(' ')}
const myLevel=()=>{const p=EI(lessonIdx());return p<16?'easy':p<44?'medium':'hard'};

/* ---------- rooms + lobby ---------- */
let ROOM=null,OFF=0,POLL=null;
const stopPoll=()=>{clearInterval(POLL);POLL=null};
function makeRoom(lv,spectate,after){post('/api/race',{a:'make',pid:pid(),name:myName(),text:raceText(lv),spectate}).then(r=>{ROOM={code:r.room,host:true,spectate};after&&after(r.room);lobby()}).catch(e=>toast(e.message))}
ACT.raceMake=()=>{const lv=myLevel();modal(`<h2>Make a race room</h2><p class="muted" style="margin:0 0 8px">Pick how hard the story is.</p><div class="cl-btns">${lvlsFor(false).map(([v,t])=>`<button class="btn lv-${v} ${v===lv?'':'alt'}" data-act="raceMakeLv" data-v="${v}">${t}</button>`).join('')}</div>${beatRace()?'':'<p class="muted cl-note">Win a Keylori Race on Beast mode to unlock Impossible.</p>'}<div class="rbtns"><button class="btn alt" data-act="clsHub">Back</button></div>`)};
ACT.raceMakeLv=d=>makeRoom(d.v,false);
ACT.raceJoin=()=>joinRoom(val('raceCode'));
ACT.raceJoinCode=d=>joinRoom(d.r);
function joinRoom(code){if(!code)return toast('Type the race code');post('/api/race',{a:'join',room:code,pid:pid(),name:myName()}).then(r=>{ROOM={code:code.toUpperCase(),host:false};OFF=r.now-Date.now();ROOM.last=r;lobby()}).catch(e=>toast(e.message))}
function lobby(){stopPoll();const tick=()=>post('/api/race',{a:'get',room:ROOM.code,pid:pid()}).then(r=>{OFF=r.now-Date.now();ROOM.last=r;if(r.state==='go'){stopPoll();return ROOM.spectate?watch():startNet(r)}drawLobby(r)}).catch(e=>{stopPoll();toast(e.message)});
 drawLobby(ROOM.last||{players:[]});tick();POLL=setInterval(()=>{if($('#modal').hidden||!document.querySelector('#mbox .lobby'))return stopPoll();tick()},2000)}
function drawLobby(r){const ps=r.players||[];
 modal(`<h2>Race room</h2><div class="lobby"><p style="margin:0">Friends join with this code:</p><div class="cl-big">${esc(ROOM.code)}</div>
 <div class="cl-chips">${ps.length?ps.map(p=>`<span class="cl-chip ${p.pid===pid()?'me':''}">${esc(p.name)}</span>`).join(''):'<span class="muted">Waiting for racers...</span>'}</div>
 <p class="muted" style="margin:6px 0 0">${ROOM.host?(ps.length?`${ps.length} racer${ps.length>1?'s':''} ready. Start when everyone is in!`:'Waiting for racers...'):'Waiting for the host to start...'}</p></div>
 <div class="cl-btns" style="justify-content:center;margin-top:8px"><button class="btn sm racebtn" data-act="raceShare">Share invite link</button></div>
 <div class="rbtns">${ROOM.host?`<button class="btn" data-act="raceStart" ${ps.length?'':'disabled'}>Start race!</button>`:''}<button class="btn alt" data-act="raceLeave">Leave</button></div>`)}
ACT.raceStart=()=>post('/api/race',{a:'start',room:ROOM.code,pid:pid()}).then(r=>{OFF=r.now-Date.now();stopPoll();ROOM.spectate?watch():startNet(r)}).catch(e=>toast(e.message));
ACT.raceShare=()=>{if(!ROOM)return;const url=location.origin+location.pathname+'?race='+ROOM.code,text=`Join my Keyloria typing race! Code ${ROOM.code}`;
 if(navigator.share)navigator.share({title:'Race me in Keyloria!',text,url}).catch(()=>{});
 else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>toast('Invite link copied! Paste it to a friend.')).catch(()=>toast(url));else toast(url)};
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
 $('#garena').innerHTML=`<div class="finish"></div><div class="lane"><div class="runner" id="rn0">${zookSVG()}<span class="rname">${esc(myName())}</span></div></div>`+lanes.map((p,k)=>{const [a,b]=(met[k]||'0-0').split('-').map(Number);return `<div class="lane"><div class="runner" id="rq${k}">${creatureSVG(a,b)}<span class="rname">${esc(p.name)}</span></div></div>`}).join('')+`<div class="cdown" id="cdown"></div><div class="rlist" id="rlist"></div>`;$('#garena').style.setProperty('--lanes',lanes.length+1);$('#garena').classList.add('netrace');
 $('#gstripIn').innerHTML=[...G.text].map(c=>`<span class="${c===' '?'sp':''}">${c===' '?'·':esc(c)}</span>`).join('');raceStrip();
 const g=G;const loop=()=>{if(G!==g||G.done)return;const now=Date.now();const cd=$('#cdown');
  if(now<startLocal){if(cd)cd.textContent=Math.ceil((startLocal-now)/1000)}else{if(cd&&cd.textContent!=='GO!'&&!G.start){cd.textContent='GO!';setTimeout(()=>cd&&cd.remove(),700)}if(!G.start)G.start=performance.now()}
  G.net.lanes.forEach((id,k)=>{const p=G.net.ps[id],el=$('#rq'+k);if(p&&el)el.style.left=(Math.min(1,p.pos/G.text.length)*84)+'%'});
  if(G.start){const el=(performance.now()-G.start)/60000;$('#g-a').textContent=G.pos?Math.round(G.pos/5/Math.max(el,1/60)):0}
  G.raf=requestAnimationFrame(loop)};loop();
 const send=()=>{if(G!==g||screen!=='game'){clearInterval(g.net.iv);return}const el=G.start?(performance.now()-G.start)/60000:0;
  post('/api/race',{a:'tick',room:g.net.room,pid:pid(),pos:G.pos,wpm:G.pos&&el?Math.round(G.pos/5/el):0,acc:G.pos?Math.round((G.pos-G.mist.size)/G.pos*100):100}).then(r=>{OFF=r.now-Date.now();g.net.all=r.players;r.players.forEach(p=>g.net.ps[p.pid]=p);
   const me=r.players.findIndex(p=>p.pid===pid())+1;$('#g-b').textContent=me?ord(me):'';const L=$('#rlist');if(L)L.innerHTML=r.players.slice(0,8).map((p,k)=>`<div class="${p.pid===pid()?'me':''}"><b>${k+1}</b> ${esc(p.name)} ${p.ft?'✓':Math.round(p.pos/G.text.length*100)+'%'}</div>`).join('');
   if(g.net.fin)drawNetResult()}).catch(()=>{})};
 g.net.iv=setInterval(send,1500)}
const _ri=raceInput;raceInput=function(ch,caps){if(G.net&&(Date.now()<G.net.startLocal||G.net.fin))return;return _ri.apply(this,arguments)};
const _er=endRace;endRace=function(){if(!G.net)return _er.apply(this,arguments);const g=G;G.done=true;setTarget(null);g.net.fin=true;
 const secs=(performance.now()-g.start)/1000,len=g.text.length;g.net.wpm=Math.round(len/5/Math.max(secs/60,1/60));g.net.acc=Math.round((len-g.mist.size)/len*100);
 S.hist.push({t:Date.now(),w:g.net.wpm,a:g.net.acc});if(S.hist.length>80)S.hist.shift();S.time+=Math.round(secs);S.xp+=len;sfx.win();
 post('/api/race',{a:'tick',room:g.net.room,pid:pid(),pos:len,wpm:g.net.wpm,acc:g.net.acc}).then(r=>{g.net.all=r.players;const place=r.players.findIndex(p=>p.pid===pid())+1;g.net.place=place;const gems=[3,2,1][place-1]||0;S.gems+=gems;g.net.gems=gems;save();drawNetResult()}).catch(()=>{save();drawNetResult()});
 clearInterval(g.net.iv);g.net.iv=setInterval(()=>{if(!document.querySelector('#mbox .netres')||G!==g)return clearInterval(g.net.iv);post('/api/race',{a:'get',room:g.net.room,pid:pid()}).then(r=>{g.net.all=r.players;drawNetResult(true)}).catch(()=>{})},2500)};
function standingsHTML(ps,len){return `<div class="cl-scroll"><table class="hs-tab"><tr><th>#</th><th>Racer</th><th>Progress</th><th>WPM</th></tr>${ps.map((p,k)=>`<tr class="${p.pid===pid()?'me':''}"><td><b>${k+1}</b></td><td>${esc(p.name)}</td><td>${p.ft?'Finished!':`<div class="cl-bar"><i style="width:${Math.round(p.pos/len*100)}%"></i></div>`}</td><td>${p.wpm||'–'}</td></tr>`).join('')}</table></div>`}
function drawNetResult(update){const g=G;if(!g||!g.net)return;const box=document.querySelector('#mbox .netres');if(update&&box){box.innerHTML=standingsHTML(g.net.all,g.text.length);return}
 if(update)return;const pl=g.net.place;
 modal(`<h2>${pl===1?'You won the race!':pl?ord(pl)+' place!':'Race finished!'}</h2>
 <div class="rstats"><div><b>${pl?ord(pl):'–'}</b><span>Place</span></div><div><b>${g.net.wpm}</b><span>WPM</span></div><div><b>${g.net.acc}%</b><span>Accuracy</span></div><div><b>+${g.net.gems||0}</b><span>Diamonds</span></div></div>
 <div class="netres">${standingsHTML(g.net.all,g.text.length)}</div>
 <div class="rbtns"><button class="btn" data-act="raceHub">Race again</button><button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`)}

/* ---------- host watching a class race ---------- */
function watch(){const len=(ROOM.last&&ROOM.last.text||'').length||1;const draw=r=>{const now=Date.now(),st=r.startAt-OFF;
  modal(`<h2>Class race ${esc(ROOM.code)}</h2><div class="watch">${now<st?`<div class="cl-big">${Math.ceil((st-now)/1000)}</div>`:''}${standingsHTML(r.players,r.text.length||len)}</div><div class="rbtns"><button class="btn alt" data-act="raceLeave">Close</button></div>`)};
 const tick=()=>post('/api/race',{a:'get',room:ROOM.code,pid:pid()}).then(r=>{OFF=r.now-Date.now();if(!document.querySelector('#mbox .watch')&&POLL)return stopPoll();draw(r);if(r.players.length&&r.players.every(p=>p.ft))stopPoll()}).catch(()=>{});
 modal('<h2>Class race</h2><div class="watch"><p class="muted">Getting ready...</p></div>');tick();POLL=setInterval(tick,1500)}

document.head.insertAdjacentHTML('beforeend',`<style>
.clsban{margin:0 0 10px;padding:8px 12px;display:flex;flex-direction:column;gap:6px}.clsban .cb-name{font-size:15px;color:#b8a8d8}.clsban .cb-row{display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap}
.cl-sec{margin:10px 0 0;text-align:left}.cl-sec h3{margin:0 0 6px;font-size:18px}.cl-btns{display:flex;gap:8px;flex-wrap:wrap}
.cl-field{display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap}.cl-in{font:inherit;font-size:20px;padding:6px 10px;width:9ch;text-transform:uppercase;background:#1b1626;color:#fff6e0;border:3px solid #3a2f4e}.cl-in.wide{width:auto;flex:1;min-width:12ch;text-transform:none;font-size:17px}
.cl-note{font-size:15px;margin:10px 0 0}.cl-big{font-size:46px;letter-spacing:.12em;color:#f0c860;margin:8px 0;text-align:center}
.cl-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:6px}.cl-chip{padding:3px 10px;background:#2a2340;border:2px solid #3a2f4e}.cl-chip.me{border-color:#7fe8ff}
.cl-list{display:flex;flex-wrap:wrap;gap:8px}.cl-scroll{max-height:44vh;overflow:auto}.cl-x{background:none;border:0;color:#b8a8d8;cursor:pointer;font:inherit}
.cl-bar{height:10px;background:#2a2340;border:2px solid #3a2f4e;min-width:80px}.cl-bar i{display:block;height:100%;background:#7fe8ff}
.runner .rname{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);font-size:12px;white-space:nowrap;background:rgba(27,22,38,.8);padding:0 4px;color:#fff6e0}
.cdown{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:72px;color:#f0c860;text-shadow:4px 4px 0 #1b1626;pointer-events:none;z-index:5}
.netrace .lane{height:calc(100% / var(--lanes,4))}.netrace .runner .rname{font-size:11px}
.btn.racebtn{background:#f0c860!important;color:#2a1d3e!important;box-shadow:0 4px 0 #a8802a!important}
.btn.clsbtn{background:#7fd8c8!important;color:#1b2a2e!important;box-shadow:4px 4px 0 rgba(4,6,24,.65)!important;height:42px;font-family:var(--title)!important;font-size:12px!important;padding:0 14px!important;letter-spacing:.05em}
#s-home .btn.selp{background:#b8a0e8!important;color:#2a1d3e!important}
#s-home .roamtog.arcade-switch{display:inline-flex;align-items:center;gap:7px;border:2px solid #8862b6;border-radius:10px;background:#2a1d3e;color:#e9dcfa;padding:0 10px;height:42px;cursor:pointer;font:400 12px/1.2 var(--title);letter-spacing:.05em;margin-right:auto;box-shadow:4px 4px 0 rgba(4,6,24,.65)}
#s-home .roamtog.on{background:#6e3f9d;color:#fff;border-color:#c9a4f1}
#s-home .roamtog .switch-track{position:relative;display:inline-block;width:37px;height:19px;border-radius:20px;background:#766887;border:2px solid #d4bfec;box-sizing:border-box}
#s-home .roamtog .switch-thumb{position:absolute;top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:left .15s}
#s-home .roamtog.on .switch-track{background:#bce984}#s-home .roamtog.on .switch-thumb{left:20px;background:#294014}
.btn.lv-beast{background:#c8402e!important;color:#fff!important}.btn.lv-impossible{background:#4a1a6a!important;color:#fff!important}
#s-arcade .game > p{min-height:2.9em}
.rlist{position:absolute;right:6px;top:6px;font-size:13px;background:rgba(27,22,38,.8);padding:4px 8px;z-index:4}.rlist .me{color:#7fe8ff}
</style>`);
/* opening an invite link joins the race */
{const q=(new URLSearchParams(location.search).get('race')||'').trim();if(/^[a-z]{3,4}[0-9]{2}$/i.test(q)){try{history.replaceState(null,'',location.pathname)}catch(e){}
 let n=0;const tryJoin=()=>{if(S.name&&typeof screen!=='undefined'&&screen==='home'&&$('#modal').hidden)return joinRoom(q);if(++n<240)setTimeout(tryJoin,500)};setTimeout(tryJoin,800)}}
try{if(screen==='home')renderHome();if(screen==='arcade')renderArcade()}catch(e){}
})();
