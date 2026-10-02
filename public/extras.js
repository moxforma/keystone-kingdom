/* Keyloria Kingdom extras: 4 new heroes, legendary closet items, 3 new arcade games. */
/* ---------- new heroes ---------- */
Object.assign(HEROES,{"ember": {"name": "Ember", "rows": ["...o................o...", "..oko..............oko..", "..okLo............oLko..", "..oLuLo..........oLuLo..", "..oLuLLooooooooooLLuLo..", ".oLLuLHHHLLLLLBBBBLuDDo.", ".oLLLHHHHLLLLLLBBBBDDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLBBBBBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkwwwBBwwwkkBDDDXo", ".oBrrrBBBwwmmwwBBBrrrDo.", ".oBBBBBBBBwwwwBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", "..oDBBBBBBBBBBBBBBBDDo..", "..oDDBBBBooooBBBBDDDo...", "..ooooooo....ooooooo...."], "pal": {"o": "#3a1e18", "O": "#5a2a1c", "X": "#7a3a22", "D": "#a8522a", "B": "#d0703a", "L": "#e89a58", "H": "#f6c088", "t": "#3c8f5a", "T": "#2a6a44", "u": "#f6dcc0", "w": "#fff8ec", "k": "#1e1418", "r": "#e4909c", "m": "#6e2440", "n": "#e48a98"}}, "bruno": {"name": "Bruno", "rows": ["........................", "..oooo............oooo..", ".oDuuDo..........oDuuDo.", ".oDuuDooooooooooooDuuDo.", "..oDDLHHHLLLLLBBBBBDDo..", ".oLLHHHHLLLLLLLBBBBBDDo.", ".oLLLHHHHLLLLLLBBBBBDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLBBBBBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBuuuuBBBBrrrDo.", ".oBBBBBBBBunwuBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", "..oDBBBBBBBBBBBBBBBDDo..", "..oDDBBBBooooBBBBDDDo...", "..ooooooo....ooooooo...."], "pal": {"o": "#2a1a14", "O": "#4a3020", "X": "#4a3020", "D": "#6a4430", "B": "#8e6242", "L": "#b0845a", "H": "#cca47a", "t": "#3a2a20", "T": "#2a1a14", "u": "#e0c49a", "w": "#fff8ec", "k": "#1a1210", "r": "#e09090", "m": "#5a2a20", "n": "#d88070"}}, "mochi": {"name": "Mochi", "rows": ["........................", "..oooo............oooo..", ".okkkko..........okkkko.", ".okkkkooooooooooookkkko.", "..oDDLHHHLLLLLBBBBBDDo..", ".oLLHHHHLLLLLLLBBBBBDDo.", ".oLLLHHHHLLLLLLBBBBBDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLkkkkBBBBBBkkkkBDXo.", ".oLLLkkkkBBBBBBkkkkBDXo.", ".oLLLkwkkBBBBBBwkkkBDXo.", ".oLLLkkTkBBBBBBkTkkBDXo.", ".oLLBkTtTBBBBBBTtTkBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBmmmmBBBBrrrDo.", ".oBBBBBBBBmnwmBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", "..oDBBBBBBBBBBBBBBBDDo..", "..oDDBBBBooooBBBBDDDo...", "..ooooooo....ooooooo...."], "pal": {"o": "#1e1a24", "O": "#3a3644", "X": "#5a5a6e", "D": "#8a8aa0", "B": "#c4c4d2", "L": "#e0e0ea", "H": "#f6f6fa", "t": "#3a3644", "T": "#1e1a24", "u": "#2a2632", "w": "#ffffff", "k": "#1e1a24", "r": "#e8a0a8", "m": "#3a2630", "n": "#e090a0"}}, "inky": {"name": "Inky", "rows": ["........................", "........oooooooo........", "......ooLHHHLLBBoo......", "....ooLHHHHLLLLBBBoo....", "...oLLHHHHLLLLLLBBBDo...", ".ooLLHHHLLLLLLLLBBBBDoo.", ".oLLHHHLLLLLLLLLBBBBDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLBBBBBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBmmmmBBBBrrrDo.", ".oBBBBBBBBmnwmBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oBoBBoBBoBBoBBoBBoBo..", ".oBoBoBoBBoBBoBoBoBoBo..", ".oo.oo.oo.oo.oo.oo.oo...", "........................"], "pal": {"o": "#3a1a1e", "O": "#5a2a2a", "X": "#6a2e2e", "D": "#984440", "B": "#c46450", "L": "#e08a6a", "H": "#f2b490", "t": "#3a8a9a", "T": "#2a5a6a", "u": "#e8f6f0", "w": "#fff8ec", "k": "#1e1418", "r": "#f0a090", "m": "#5a2a2a", "n": "#e88878"}}});
try{Object.keys(KKC).forEach(k=>{if(/ember|bruno|mochi|inky/.test(k))delete KKC[k]})}catch(e){}
Object.assign(HERO_COLORS,{ember:[null,'gold','red','snow'],bruno:[null,'gold','green','night'],mochi:[null,'pink','mint','blue'],inky:[null,'blue','mint','gold']});

/* ---------- legendary closet items ---------- */
const ICEW=["o.........","oHo.......","oLHo......",".oLHo.....",".oBLHoo...","..oBLLHo..","..oBBLLHo.","...oBBLLo.","...oBoBLo.","....o.oBo.","......oo.."];
const CAPE=["oo","oRo","oRo","oRRo","oRRo","oRDo","oRDo","oRDo","oRRDo","oYYYo"];
const LEGEND={
 royalcape:{slot:'back',name:'Royal Cape',cost:550,lvl:13,back:1,parts:[[CAPE,-3,12],[mirror(CAPE),22,12]],pal:{o:'#2a1418',R:'#b83a3a',D:'#7a2228',Y:'#f0c860'}},
 crystalwings:{slot:'back',name:'Crystal Wings',cost:700,lvl:14,back:1,parts:[[ICEW,-5,6],[mirror(ICEW),19,6]],pal:{o:'#1a3a5a',B:'#5a9ad0',L:'#9ad8f6',H:'#ffffff'}},
 galaxywings:{slot:'back',name:'Galaxy Wings',cost:850,lvl:15,back:1,parts:[[DWING,-5,6],[mirror(DWING),19,6]],pal:{o:'#140e30',B:'#3a2a8a',L:'#6a5ad0',H:'#f6e08a'}},
 starcrown:{slot:'head',name:'Starlight Crown',cost:900,lvl:15,parts:[[["....o....o....","...oYo..oYo...","o..oYYooYYo..o","oYoYGYYYYGYoYo","oYYYYYRRYYYYYo","oYBYYYRRYYYBYo","oHHHHHHHHHHHHo","oooooooooooooo"],5,-1]],pal:{o:'#5a3a00',Y:'#f6d050',G:'#7fe8ff',R:'#e8584f',B:'#4aa8d8',H:'#fff2b0'}},
 stormblade:{slot:'hand',name:'Storm Blade',cost:700,lvl:14,parts:[[[".o.","oHo","oHo","oLo","oHo","oLo","oHo","oLo","oLo","ooooo","..oYo","..oYo","...o."].map(r=>r.padEnd(5,'.')),21,4]],pal:{o:'#1a2a4a',H:'#ffffff',L:'#9ad8f6',Y:'#8a6a3a'}},
 moonstaff:{slot:'hand',name:'Moon Staff',cost:600,lvl:13,parts:[[[".ooo.","oMMMo","oM.Mo",".oMo.","..o..",".oWo.",".oWo.",".oWo.",".oWo.",".oWo.",".oWo.",".oWo.",".ooo."],-4,2]],pal:{o:'#2a1a10',M:'#f0e08a',W:'#8a5a3a'}}};
Object.entries(LEGEND).forEach(([id,a])=>{ACC[id]={slot:a.slot,name:a.name,cost:a.cost,lvl:a.lvl,svg:'',legend:1};KKDATA.acc[id]=Object.assign({x:0,y:0,rows:[],pal:{}},a)});

/* ---------- shared helpers for the new games ---------- */
function xWords(maxLen=8){const i=arcadeLesson(),ls=learned(i);const ok=WORDS.filter(w=>w.length<=maxLen&&[...w].every(c=>ls.has(c)));
 return ok.length>=8?ok:Array.from({length:30},()=>groups(()=>rand([...ls].filter(c=>/[a-z]/.test(c))),1,2,3))}
function xLetters(){return [...learned(arcadeLesson())].filter(c=>/[a-z]/.test(c))}
const xSpeed=()=>({easy:.75,medium:1,hard:1.3,beast:1.6}[(S.set.arcd||'auto').split('-')[0]]||Math.min(1.4,Math.max(.7,avgWpm()/14)));
function xEnd(title,stats,gems,again,extra=''){G.done=true;stopGame();setTarget(null);S.gems+=gems;S.xp+=gems*5;save();sfx.win();
 setTimeout(()=>modal(`<h2>${title}</h2><div class="hero-mini">${zookSVG()}</div>${extra}<div class="rstats">${stats.map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}<div><b>+${gems}</b><span>Diamonds</span></div></div>
 <div class="rbtns"><button class="btn" data-act="${again}">Play again</button><button class="btn alt" data-act="go" data-to="arcade">Arcade</button><button class="btn" data-act="go" data-to="home">Main Menu</button></div>`),500)}
const _gi90=gameInput;gameInput=function(ch,caps){if(G&&G.xin&&!G.done){pressFx(ch===' '?'space':ch.toLowerCase());return G.xin(caps?ch.toLowerCase():ch)}return _gi90(ch,caps)};

/* ---------- 1. Bubble Pop ---------- */
const BUBURL=(()=>{const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x+.5-8,y+.5-8);if(d>7.5)continue;
 g.fillStyle=d>6.5?'#bfe8ff':(x<6&&y<6&&d>3?'rgba(255,255,255,.55)':'rgba(127,200,240,.28)');g.fillRect(x,y,1,1)}g.fillStyle='#fff';g.fillRect(4,4,2,2);g.fillRect(6,3,1,1);return c.toDataURL()})();
ACT.bubble=()=>{mountGame('Bubble Pop','Type the letter to pop the bubble!','Score','Hearts');
 const L=xLetters();G={type:'bubble',L,b:[],score:0,combo:0,best:0,hearts:3,popped:0,missed:0,total:40,spawned:0,t:0,next:.2,done:false,start:performance.now()};
 $('#gsw').hidden=true;$('#garena').className='garena bubble-arena';$('#garena').innerHTML=`<div class="gcombo" id="gcombo"></div><div class="gmsg" id="gmsg"></div>`;$('#g-b').textContent='♥♥♥';
 G.xin=ch=>{const c=G.b.filter(x=>!x.pop&&x.ch===ch);if(!c.length){G.combo=0;sfx.bad();$('#gcombo').textContent='';return}
  const t=c.reduce((a,b)=>a.y<b.y?a:b);t.pop=1;t.el.classList.add('pop');setTimeout(()=>t.el.remove(),300);G.combo++;G.best=Math.max(G.best,G.combo);G.popped++;G.score+=10*(1+Math.floor(G.combo/5));sfx.ok(G.combo%20);
  $('#g-a').textContent=G.score;$('#gcombo').textContent=G.combo>=5?`x${1+Math.floor(G.combo/5)} combo!`:'';const nx=G.b.filter(x=>!x.pop).sort((a,b)=>a.y-b.y)[0];setTarget(nx?nx.ch:null)};
 let last=performance.now();const tick=now=>{if(G.done||G.type!=='bubble')return;const dt=Math.min(.05,(now-last)/1000);last=now;G.t+=dt;const a=$('#garena');if(!a)return;const H=a.clientHeight,W=a.clientWidth,sp=xSpeed();
  G.next-=dt;if(G.next<=0&&G.spawned<G.total){G.spawned++;G.next=Math.max(.45,1.1-G.spawned*.02)/sp;const ch=rand(G.L),el=document.createElement('div');el.className='bub';el.innerHTML=`<img src="${BUBURL}" alt=""><span>${esc(ch)}</span>`;const x=8+Math.random()*84;el.style.left=x+'%';a.appendChild(el);G.b.push({ch,el,y:H+40,v:(55+Math.random()*30)*sp,w:Math.random()*6.28})}
  G.b.forEach(o=>{if(o.pop)return;o.y-=o.v*dt;o.w+=dt*2;o.el.style.transform=`translate(${Math.sin(o.w)*8}px,${o.y}px)`;if(o.y<-70){o.pop=1;o.el.remove();G.hearts--;G.missed++;G.combo=0;sfx.bad();$('#g-b').textContent='♥'.repeat(Math.max(0,G.hearts))}});
  G.b=G.b.filter(o=>!o.pop||o.el.isConnected);const nx=G.b.filter(x=>!x.pop).sort((p,q)=>p.y-q.y)[0];setTarget(nx?nx.ch:null);
  if(G.hearts<=0||G.spawned>=G.total&&!G.b.some(o=>!o.pop)){const win=G.hearts>0;S.arc.bubble=Math.max(S.arc.bubble||0,G.score);if(win)S.arc.bwin=(S.arc.bwin||0)+1;
   return xEnd(win?'All bubbles popped!':'Out of hearts!',[[G.score,'Score'],[G.popped,'Popped'],[G.best,'Best combo']],win?Math.min(6,2+Math.floor(G.score/150)):1,'bubble')}
  G.raf=requestAnimationFrame(tick)};G.raf=requestAnimationFrame(tick)};

/* ---------- 2. Bloom Grove ---------- */
const FLOWERS=[['#e8584f','#f6a0a0'],['#f0c860','#fff2b0'],['#8a7ae0','#c8b8ff'],['#f09a50','#ffd0a0'],['#5ab0e0','#bfe8ff']];
function flowerSVG(stage,k){const [c1,c2]=FLOWERS[k%FLOWERS.length];const s=['','<rect x="7" y="12" width="2" height="4" fill="#5a9a48"/>','<rect x="7" y="8" width="2" height="8" fill="#5a9a48"/><rect x="9" y="10" width="3" height="2" fill="#7ab85a"/>',
 `<rect x="7" y="7" width="2" height="9" fill="#5a9a48"/><rect x="4" y="10" width="3" height="2" fill="#7ab85a"/><rect x="5" y="2" width="6" height="6" fill="${c1}"/><rect x="6" y="3" width="4" height="4" fill="${c2}"/><rect x="7" y="4" width="2" height="2" fill="#f0c860"/>`][stage];
 return `<svg viewBox="0 0 16 16" style="image-rendering:pixelated">${s}<rect x="3" y="15" width="10" height="1" fill="#6a4a34"/></svg>`}
ACT.bloom=()=>{mountGame('Bloom Grove','Type each word to help the garden grow!','Flowers','Accuracy');
 const words=xWords(7).slice().sort(()=>Math.random()-.5),N=12;G={type:'bloom',plots:Array.from({length:N},()=>0),words:words.slice(0,N*2),wi:0,pos:0,typed:0,mist:0,done:false,start:performance.now()};
 $('#gsw').hidden=false;$('#garena').className='garena bloom-arena';
 $('#garena').innerHTML=`<div class="bloom-hero">${zookSVG()}</div><div class="plots">${G.plots.map((_,k)=>`<div class="plot" id="pl${k}">${flowerSVG(0,k)}</div>`).join('')}</div><div class="gmsg" id="gmsg"></div>`;
 const strip=()=>{const w=G.words[G.wi]||'';$('#gstripIn').innerHTML=[...w].map((c,k)=>`<span class="${k<G.pos?'ok':k===G.pos?'cur':''}">${esc(c)}</span>`).join('');const cur=$('#gstripIn .cur');if(cur){cur.style.setProperty('--fc',fcol(keyInfo(w[G.pos]).f));$('#gstripIn').style.transform=`translateX(${$('#gstrip').clientWidth/2-(cur.offsetLeft+cur.offsetWidth/2)}px)`}setTarget(w[G.pos]);$('#ghint').innerHTML=w[G.pos]?fingerHTML(w[G.pos]):''};
 G.xin=ch=>{const w=G.words[G.wi];if(ch===w[G.pos]){G.pos++;G.typed++;sfx.ok(G.pos);if(G.pos>=w.length){const k=G.wi%N;G.plots[k]=Math.min(3,G.plots[k]+(G.wi<N?2:1));const p=$('#pl'+k);if(p){p.innerHTML=flowerSVG(G.plots[k],k);p.classList.remove('grow');void p.offsetWidth;p.classList.add('grow')}
   tone(660+G.wi*20,.1,'square',.05);G.wi++;G.pos=0;const full=G.plots.filter(x=>x===3).length;$('#g-a').textContent=full;
   if(G.wi>=G.words.length){const acc=Math.round(G.typed/(G.typed+G.mist)*100);S.arc.bloom=Math.max(S.arc.bloom||0,full);return xEnd('What a beautiful garden!',[[full,'Flowers'],[acc+'%','Accuracy']],2+Math.floor(full/3)+(acc>=95?2:0),'bloom',`<div class="bloom-done">${G.plots.map((s,k)=>flowerSVG(s,k)).join('')}</div>`)}}strip()}
  else{G.mist++;sfx.bad();$('#ghint').innerHTML=`Oops! ${fingerHTML(w[G.pos])}`}$('#g-b').textContent=Math.round(G.typed/Math.max(1,G.typed+G.mist)*100)+'%'};
 strip()};

/* ---------- 3. Keylori Keeper ---------- */
const WANTS=[{t:'a LONG word (6+ letters)',f:w=>w.length>=6},{t:'a SHORT word (3 letters or less)',f:w=>w.length<=3},{t:'a word with the letter E',f:w=>w.includes('e')},{t:'a word with the letter A',f:w=>w.includes('a')},
 {t:'a word that starts with S',f:w=>w[0]==='s'},{t:'a word with double letters',f:w=>/(.)\1/.test(w)},{t:'a word with the letter O',f:w=>w.includes('o')},{t:'a word that ends with T',f:w=>w.endsWith('t')}];
ACT.keeper=()=>{mountGame('Keylori Keeper','Feed your Keylori the word it wants!','Fed','Time');
 const pool=xWords(9),cards=Object.keys(S.cards),[ci,cf]=(rand(cards.length?cards:['0-0'])).split('-').map(Number);
 G={type:'keeper',pool,ci,cf,fed:0,miss:0,left:60,typed:'',done:false,want:null,opts:[]};$('#gsw').hidden=true;$('#garena').className='garena keeper-arena';
 $('#garena').innerHTML=`<div class="kp-pet" id="kppet">${creatureSVG(ci,cf,'px')}</div><div class="kp-want bubble" id="kpwant"></div><div class="kp-food" id="kpfood"></div><div class="kp-belly"><i id="kpbelly"></i></div><div class="kp-typed" id="kptyped"></div>`;
 const round=()=>{const ws=WANTS.filter(W=>pool.some(W.f)&&pool.some(w=>!W.f(w)));G.want=rand(ws.length?ws:WANTS);const good=pool.filter(G.want.f),bad=pool.filter(w=>!G.want.f(w));
  G.opts=[rand(good),rand(bad),rand(bad)].sort(()=>Math.random()-.5);G.typed='';$('#kpwant').innerHTML=`I want ${G.want.t}!`;$('#kpfood').innerHTML=G.opts.map((w,k)=>`<div class="food" id="fd${k}"><span>${esc(w)}</span></div>`).join('');paint()};
 const paint=()=>{$('#kptyped').textContent=G.typed||' ';G.opts.forEach((w,k)=>{const el=$('#fd'+k);if(el)el.classList.toggle('match',!!G.typed&&w.startsWith(G.typed))});const m=G.opts.find(w=>w.startsWith(G.typed));setTarget(m?m[G.typed.length]:null)};
 G.xin=ch=>{const nt=G.typed+ch;if(!G.opts.some(w=>w.startsWith(nt))){sfx.bad();G.typed='';paint();return}G.typed=nt;sfx.ok(nt.length);const done=G.opts.find(w=>w===nt);
  if(done){const pet=$('#kppet');if(G.want.f(done)){G.fed++;$('#g-a').textContent=G.fed;$('#kpbelly').style.width=Math.min(100,G.fed*8)+'%';pet.classList.remove('yum','nope');void pet.offsetWidth;pet.classList.add('yum');tone(880,.1,'square',.05);round()}
   else{G.miss++;pet.classList.remove('yum','nope');void pet.offsetWidth;pet.classList.add('nope');$('#kpwant').innerHTML=`Not that one! I want ${G.want.t}.`;G.typed='';paint()}}else paint()};
 let last=performance.now();const tick=now=>{if(G.done||G.type!=='keeper')return;G.left-=(now-last)/1000;last=now;$('#g-b').textContent=Math.max(0,Math.ceil(G.left));
  if(G.left<=0){S.arc.keeper=Math.max(S.arc.keeper||0,G.fed);const name=SPECIES[G.ci].n[G.cf];return xEnd(`${name} is full and happy!`,[[G.fed,'Fed'],[G.miss,'Oops']],Math.min(8,1+Math.floor(G.fed/2)),'keeper')}
  G.raf=requestAnimationFrame(tick)};round();G.raf=requestAnimationFrame(tick)};

/* ---------- arcade screen: 6 games ---------- */
const _ra90=renderArcade;renderArcade=function(){_ra90();const g=$('#s-arcade .games');if(!g)return;
 const bub=`<div class="bubart">${['f','j','k'].map(c=>`<div class="bub" style="position:relative;transform:none;margin:0"><img src="${BUBURL}" alt=""><span>${c}</span></div>`).join('')}</div>`;
 g.insertAdjacentHTML('beforeend',`
 <div class="game panel"><div class="gart">${bub}</div><h3>Bubble Pop</h3><p>Pop the letter bubbles before they float away!</p><div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.bubble||0}</b><span>Best score</span></div><div class="arcade-stat"><b>${S.arc.bwin||0}</b><span>Wins</span></div></div><button class="btn" data-act="bubble">Play</button></div>
 <div class="game panel"><div class="gart">${[0,1,2,3].map(k=>flowerSVG(3,k)).join('')}</div><h3>Bloom Grove</h3><p>A calm garden. Type words to grow flowers!</p><div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.bloom||0}</b><span>Most flowers</span></div></div><button class="btn" data-act="bloom">Play</button></div>
 <div class="game panel"><div class="gart">${creatureSVG(1,1,'big')}</div><h3>Keylori Keeper</h3><p>Feed your Keylori the words it wants!</p><div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.keeper||0}</b><span>Most fed</span></div></div><button class="btn" data-act="keeper">Play</button></div>`)};

/* ---------- home: Arcade is a full second mode ---------- */
const _rh90=renderHome;renderHome=function(){_rh90();const ar=$('#s-home [data-to=arcade]'),cont=$('#s-home .btn.big');
 if(ar&&cont&&!ar.classList.contains('arcbig')){ar.classList.add('big','arcbig');cont.after(ar)}};
if(typeof screen!=='undefined'&&screen==='home')renderHome();
