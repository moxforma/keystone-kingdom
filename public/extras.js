const mb_m={"name": "Mochi", "rows": ["........................", "........................", "....ooo..oooooo..ooo....", "...okkkooLLLLLLookkko...", "...okkkkkLLLLLLLkkkko...", "...okkkkkLLLLLLLkkkko...", "...okkkkLLLLLLLBBkkko...", "..oHLLLLLLLLLLBBBBBBBo..", "..oLLLLLLLLLLBBBBBBBBo..", ".oLLLLLLLLLLBBBBBBBBBBo.", ".oLLLLLkkkBBBBkkkBBBDDo.", ".oLLLLLkkkBBBBkkkBBDDDo.", ".okkLLkwkkkBBkwkkkDDkko.", "okkkLLkkkkkBBkkkkkDDkkko", "okkkLLBkkkBBBBkkkDDDkkko", "kkkkBrrkkkBkkBkkkrrDkkkk", "kkkkBBBBBBBmmDDDDDDDkkkk", "kkkkBBBBBBBBDDDDDDDDkkkk", "okkkBBBBBBBDDDDDDDDXkkko", "okkoBBBBBBDDDDDDDDXXokko", ".oo.oBBBDDDDDDDDXXXo.oo.", ".....oBDDDDDDDDXXXo.....", ".....kkkkkDDDDkkkkk.....", ".........oooooo........."], "pal": {"o": "#1e1a24", "X": "#8a8aa0", "D": "#a8a8bc", "B": "#c4c4d2", "L": "#e0e0ea", "H": "#f6f6fa", "k": "#1e1a24", "w": "#ffffff", "r": "#e8a0a8", "m": "#3a2630", "u": "#2a2632", "O": "#3a3644", "t": "#1e1a24", "T": "#1e1a24", "n": "#e090a0"}},mb_b={"name": "Bruno", "rows": ["........................", "........................", "......o..........o......", ".....oHo........oLo.....", "....oHuuoooooooouuBo....", "....oHLLoLLLLLLoBBBo....", "....oLLLLLLLLLLBBBBo....", ".....oLLLLLLLLBBBBo.....", "....oLLLLLLLLBBBBBBo....", "....oLLLLLLLBBBBBBBo....", "...oLLLLLLBBBBBBBBBBo...", "...oLLLwkBBBBBBwkBBDo...", "....oLLkkBBBBBBkkBDo....", "....oLLBBBBBBBBBBDDo....", ".....rrBBBukkuBBDrr.....", ".....ooBBBuuuuDDDoo.....", "....oBooXXXXXXXXooDo....", "...oBBBBBBBBDDDDDDDDo...", "...oBBBBBBuuuuuDDDDXo...", "...oBBBBBBuuuuuDDDXXo...", "....oBBBDDuuuuuDXXXo....", ".....oooDDDDDDDXooo.....", ".......oDDDDDDXXo.......", ".......oDDDooXDDo......."], "pal": {"o": "#2a1a14", "X": "#5a3a28", "D": "#6a4430", "B": "#8e6242", "L": "#b0845a", "H": "#cca47a", "k": "#1a1210", "w": "#fff8ec", "r": "#e09090", "m": "#5a2a20", "u": "#e0c49a", "O": "#4a3020", "t": "#3a2a20", "T": "#2a1a14", "n": "#d88070"}};
/* Keyloria Kingdom extras: 4 new heroes, legendary closet items, 3 new arcade games. */
/* ---------- new heroes ---------- */
Object.assign(HEROES,{"ember": {"name": "Ember", "rows": ["...o................o...", "..oko..............oko..", "..okLo............oLko..", "..oLuLo..........oLuLo..", "..oLuLLooooooooooLLuLo..", ".oLLuLHHHLLLLLBBBBLuDDo.", ".oLLLHHHHLLLLLLBBBBDDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLBBBBBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkwwwBBwwwkkBDDDXo", ".oBrrrBBBwwmmwwBBBrrrDo.", ".oBBBBBBBBwwwwBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", "..oDBBBBBBBBBBBBBBBDDo..", "..oDDBBBBooooBBBBDDDo...", "..ooooooo....ooooooo...."], "pal": {"o": "#3a1e18", "O": "#5a2a1c", "X": "#7a3a22", "D": "#a8522a", "B": "#d0703a", "L": "#e89a58", "H": "#f6c088", "t": "#3c8f5a", "T": "#2a6a44", "u": "#f6dcc0", "w": "#fff8ec", "k": "#1e1418", "r": "#e4909c", "m": "#6e2440", "n": "#e48a98"}}, "bruno": {"name": "Bruno", "rows": ["........................", "..oooo............oooo..", ".oDuuDo..........oDuuDo.", ".oDuuDooooooooooooDuuDo.", "..oDDLHHHLLLLLBBBBBDDo..", ".oLLHHHHLLLLLLLBBBBBDDo.", ".oLLLHHHHLLLLLLBBBBBDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLBBBBBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBuuuuBBBBrrrDo.", ".oBBBBBBBBunwuBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", "..oDBBBBBBBBBBBBBBBDDo..", "..oDDBBBBooooBBBBDDDo...", "..ooooooo....ooooooo...."], "pal": {"o": "#2a1a14", "O": "#4a3020", "X": "#4a3020", "D": "#6a4430", "B": "#8e6242", "L": "#b0845a", "H": "#cca47a", "t": "#3a2a20", "T": "#2a1a14", "u": "#e0c49a", "w": "#fff8ec", "k": "#1a1210", "r": "#e09090", "m": "#5a2a20", "n": "#d88070"}}, "mochi": {"name": "Mochi", "rows": ["........................", "..oooo............oooo..", ".okkkko..........okkkko.", ".okkkkooooooooooookkkko.", "..oDDLHHHLLLLLBBBBBDDo..", ".oLLHHHHLLLLLLLBBBBBDDo.", ".oLLLHHHHLLLLLLBBBBBDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLkkkkBBBBBBkkkkBDXo.", ".oLLLkkkkBBBBBBkkkkBDXo.", ".oLLLkwkkBBBBBBwkkkBDXo.", ".oLLLkkTkBBBBBBkTkkBDXo.", ".oLLBkTtTBBBBBBTtTkBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBmmmmBBBBrrrDo.", ".oBBBBBBBBmnwmBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", "..oDBBBBBBBBBBBBBBBDDo..", "..oDDBBBBooooBBBBDDDo...", "..ooooooo....ooooooo...."], "pal": {"o": "#1e1a24", "O": "#3a3644", "X": "#5a5a6e", "D": "#8a8aa0", "B": "#c4c4d2", "L": "#e0e0ea", "H": "#f6f6fa", "t": "#3a3644", "T": "#1e1a24", "u": "#2a2632", "w": "#ffffff", "k": "#1e1a24", "r": "#e8a0a8", "m": "#3a2630", "n": "#e090a0"}}, "inky": {"name": "Inky", "rows": ["........................", "........oooooooo........", "......ooLHHHLLBBoo......", "....ooLHHHHLLLLBBBoo....", "...oLLHHHHLLLLLLBBBDo...", ".ooLLHHHLLLLLLLLBBBBDoo.", ".oLLHHHLLLLLLLLLBBBBDDo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLLLLBBBBBBBBBDo.", ".OLLLLLLLBBBBBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBmmmmBBBBrrrDo.", ".oBBBBBBBBmnwmBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oBoBBoBBoBBoBBoBBoBo..", ".oBoBoBoBBoBBoBoBoBoBo..", ".oo.oo.oo.oo.oo.oo.oo...", "........................"], "pal": {"o": "#3a1a1e", "O": "#5a2a2a", "X": "#6a2e2e", "D": "#984440", "B": "#c46450", "L": "#e08a6a", "H": "#f2b490", "t": "#3a8a9a", "T": "#2a5a6a", "u": "#e8f6f0", "w": "#fff8ec", "k": "#1e1418", "r": "#f0a090", "m": "#5a2a2a", "n": "#e88878"}}});
try{Object.keys(KKC).forEach(k=>{if(/ember|bruno|mochi|inky/.test(k))delete KKC[k]})}catch(e){}
HEROES.mochi=Object.assign({},HEROES.mochi,mb_m);HEROES.bruno=Object.assign({},HEROES.bruno,mb_b);
Object.assign(HERO_COLORS,{ember:[null,'gold','red','snow'],bruno:[null,'gold','green','night'],mochi:[null,'pink','mint','blue'],inky:[null,'blue','mint','gold']});


const ICEW=["o.........","oHo.......","oLHo......",".oLHo.....",".oBLHoo...","..oBLLHo..","..oBBLLHo.","...oBBLLo.","...oBoBLo.","....o.oBo.","......oo.."];
const CAPE=["oo","oRo","oRo","oRRo","oRRo","oRDo","oRDo","oRDo","oRRDo","oYYYo"];
const LEGEND={
 royalcape:{slot:'back',name:'Royal Cape',cost:550,lvl:13,back:1,parts:[[["....oooooooooooooooooooooo....", "...oYYYYYYYYYYYYYYYYYYYYYYo...", "...oLRRRDLRRRDLRRRDLRRRDLRo...", "...oLRRRDLRRRDLRRRDLRRRDLRo...", "...oLRRRDLRRRDLRRRDLRRRDLRo...", "..oLRRRDLRRRDLRRRDLRRRDLRRRo..", "..oLRRRDLRRRDLRRRDLRRRDLRRRo..", "..oLRRRDLRRRDLRRRDLRRRDLRRRo..", "..oLRRRDLRRRDLRRRDLRRRDLRRRo..", "..oLRRRDLRRRDLRRRDLRRRDLRRRo..", ".oLRRRDLRRRDLRRRDLRRRDLRRRDLo.", ".oLRRRDLRRRDLRRRDLRRRDLRRRDLo.", ".oLRRRDLRRRDLRRRDLRRRDLRRRDLo.", ".oLRRRDLRRRDLRRRDLRRRDLRRRDLo.", ".oLRRRDLRRRDLRRRDLRRRDLRRRDLo.", "oLRRRDLRRRDLRRRDLRRRDLRRRDLRRo", "oLRRRDLRRRDLRRRDLRRRDLRRRDLRRo", "oYYYYYYYYYYYYYYYYYYYYYYYYYYYYo", "oooooooooooooooooooooooooooooo"],-3,7]],pal:{o:'#2a1418',R:'#b83a3a',L:'#d85a4a',D:'#7a2228',Y:'#f0c860'}},
 crystalwings:{slot:'back',name:'Crystal Wings',cost:700,lvl:14,back:1,parts:[[ICEW,-5,6],[mirror(ICEW),19,6]],pal:{o:'#1a3a5a',B:'#5a9ad0',L:'#9ad8f6',H:'#ffffff'}},
 galaxywings:{slot:'back',name:'Galaxy Wings',cost:850,lvl:15,back:1,parts:[[DWING,-5,6],[mirror(DWING),19,6]],pal:{o:'#140e30',B:'#3a2a8a',L:'#6a5ad0',H:'#f6e08a'}},
 starcrown:{slot:'head',name:'Starlight Crown',cost:900,lvl:15,parts:[[["....o....o....","...oYo..oYo...","o..oYYooYYo..o","oYoYGYYYYGYoYo","oYYYYYRRYYYYYo","oYBYYYRRYYYBYo","oHHHHHHHHHHHHo","oooooooooooooo"],5,-1]],pal:{o:'#5a3a00',Y:'#f6d050',G:'#7fe8ff',R:'#e8584f',B:'#4aa8d8',H:'#fff2b0'}},
 stormblade:{slot:'hand',name:'Storm Blade',cost:700,lvl:14,parts:[[[".o.","oHo","oHo","oLo","oHo","oLo","oHo","oLo","oLo","ooooo","..oYo","..oYo","...o."].map(r=>r.padEnd(5,'.')),21,4]],pal:{o:'#1a2a4a',H:'#ffffff',L:'#9ad8f6',Y:'#8a6a3a'}},
 moonstaff:{slot:'hand',name:'Moon Staff',cost:600,lvl:13,parts:[[[".ooo.","oMMMo","oM.Mo",".oMo.","..o..",".oWo.",".oWo.",".oWo.",".oWo.",".oWo.",".oWo.",".oWo.",".ooo."],-4,2]],pal:{o:'#2a1a10',M:'#f0e08a',W:'#8a5a3a'}}};
Object.entries(LEGEND).forEach(([id,a])=>{ACC[id]={slot:a.slot,name:a.name,cost:a.cost,lvl:a.lvl,svg:'',legend:1};KKDATA.acc[id]=Object.assign({x:0,y:0,rows:[],pal:{}},a)});

/* hero scarf: knitted, striped, with a knot and fringed tail */
KKDATA.acc.scarf=Object.assign({},KKDATA.acc.scarf,{x:2,y:18,rows:["oooooooooooooooooooo","oHHWHHWHHWHHWHHWHHWo","oRRWRRWRRWRRWRRWRRWo","oooooooooooooKKKoooo",".............oRWRo..","............oRWRo...","............offfo..."],pal:{o:'#4a0a14',H:'#f0645a',R:'#c83a3a',W:'#fff2dc',K:'#a82a30',f:'#fff2dc'}});
try{Object.keys(KKC).forEach(k=>{if(/scarf|bruno|royalcape/.test(k))delete KKC[k]})}catch(e){}
/* ---------- shared helpers for the new games ---------- */
function xWords(maxLen=8){const i=arcadeLesson(),ls=learned(i);const ok=WORDS.filter(w=>w.length<=maxLen&&[...w].every(c=>ls.has(c)));
 return ok.length>=8?ok:Array.from({length:30},()=>groups(()=>rand([...ls].filter(c=>/[a-z]/.test(c))),1,2,3))}
function xLetters(){return [...learned(arcadeLesson())].filter(c=>/[a-z]/.test(c))}
const xSpeed=()=>(({easy:.75,medium:1,hard:1.75,beast:2.5}[(S.set.arcd||'auto').split('-')[0]]||Math.min(1.4,Math.max(.7,avgWpm()/14)))*(window.INSANE?1.9:1));
function xEnd(title,stats,gems,again,extra='',share=''){G.done=true;stopGame();setTarget(null);S.gems+=gems;S.xp+=gems*5;save();sfx.win();
 setTimeout(()=>modal(`<h2>${title}</h2><div class="hero-mini">${zookSVG()}</div>${extra}<div class="rstats">${stats.map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}<div><b>+${gems}</b><span>Diamonds</span></div></div>
 <div class="rbtns"><button class="btn" data-act="${again}">Play again</button><button class="btn alt" data-act="go" data-to="arcade">Arcade</button><button class="btn" data-act="go" data-to="home">Main Menu</button>${share}</div>`),500)}
const _gi90=gameInput;gameInput=function(ch,caps){if(G&&G.xin&&!G.done){pressFx(ch===' '?'space':ch.toLowerCase());return G.xin(/[A-Z]/.test(ch)?ch.toLowerCase():ch)}return _gi90(ch,caps)};

/* side-view backdrop: stepped pixel sky + a world's terrain silhouette */
function backdrop(w,sky=['#5a8ac8','#7aa8dc','#9ac4ea','#bfe0f4']){return `<div class="xsky">${sky.map(c=>`<i style="background:${c}"></i>`).join('')}</div><img class="xterr" src="${kku('terr'+w,()=>terrainCanvas(w))}" alt="">`}
const CLOUD=(()=>{const c=PXG(["....oooo......","..ooWWWWoo....",".oWWWWWWWWoooo","oWWWWWWWWWWWWo","oWWWWWWWWWWWWo",".oSSSSSSSSSSo.","..oooooooooo.."],{o:'#d8c8d8',W:'#ffffff',S:'#efe4ef'});return c.toDataURL()})();
function cloudsHTML(){return [[6,8,90],[38,4,70],[66,14,110],[84,6,60]].map(([x,y,w],k)=>`<img class="xcloud" src="${CLOUD}" style="left:${x}%;top:${y}%;width:${w}px;animation-delay:-${k*7}s" alt="">`).join('')}
/* ---------- 1. Bubble Pop ---------- */
const BUBURL=(()=>{const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d');for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x+.5-8,y+.5-8);if(d>7.5)continue;
 g.fillStyle=d>6.5?'#bfe8ff':(x<6&&y<6&&d>3?'rgba(255,255,255,.55)':'rgba(127,200,240,.28)');g.fillRect(x,y,1,1)}g.fillStyle='#fff';g.fillRect(4,4,2,2);g.fillRect(6,3,1,1);return c.toDataURL()})();
ACT.bubble=()=>{mountGame('Bubble Pop','Scramblers trapped Keylori in bubbles! Type the letter to free them!','Freed','Hearts');
 const L=xLetters(),gh=(typeof ghostToStart!=='undefined'&&ghostToStart&&ghostToStart.g==='bubble')?ghostToStart:null;G={type:'bubble',L,deck:gh&&gh.q?gh.q.slice():Array.from({length:40},()=>rand(L)),ghostInvite:gh,ghostStartTime:performance.now(),ghostTimeline:[[0,0]],b:[],score:0,combo:0,best:0,hearts:3,popped:0,missed:0,total:40,spawned:0,t:0,next:.2,done:false,start:performance.now()};
 $('#gsw').hidden=true;$('#garena').className='garena bubble-arena';$('#garena').innerHTML=`${backdrop(1)}<div class="bub-hero gz" id="bubhero">${zookSVG()}</div><div class="gcombo" id="gcombo"></div><div class="gmsg" id="gmsg"></div>`;$('#g-b').textContent='♥♥♥';G.total=G.deck.length;if(gh&&typeof ghostScoreBar==='function'){ghostScoreBar();ghostFooterMount()}
 G.xin=ch=>{const c=G.b.filter(x=>!x.pop&&x.ch===ch);if(!c.length){G.combo=0;sfx.bad();$('#gcombo').textContent='';return}
  const t=c.reduce((a,b)=>a.y<b.y?a:b);t.pop=1;try{laser($('#garena'),$('#bubhero'),t.el,fcol(keyInfo(ch).f),G.combo>=5,.5,.3);const h=$('#bubhero');h.classList.remove('zap');void h.offsetWidth;h.classList.add('zap')}catch(e){}t.el.classList.add('pop');setTimeout(()=>t.el.remove(),300);G.combo++;G.best=Math.max(G.best,G.combo);G.popped++;const age=(performance.now()-t.t0)/1000,quick=Math.max(0,Math.round(15-age*5));G.score+=10*(1+Math.floor(G.combo/5))+quick;if(quick>=8)speedPop(quick);sfx.ok(G.combo%20);
  $('#g-a').textContent=G.popped;if(G.ghostTimeline.at(-1)[0]!==G.score)G.ghostTimeline.push([G.score,Math.max(1,Math.round((performance.now()-G.ghostStartTime)/100))]);$('#gcombo').textContent=G.combo>=5?`x${1+Math.floor(G.combo/5)} combo!`:'';const nx=G.b.filter(x=>!x.pop).sort((a,b)=>a.y-b.y)[0];setTarget(nx?nx.ch:null)};
 let last=performance.now();const tick=now=>{if(G.done||G.type!=='bubble')return;const dt=Math.min(.05,(now-last)/1000);last=now;G.t+=dt;const a=$('#garena');if(!a)return;const H=a.clientHeight,W=a.clientWidth,sp=xSpeed();
  G.next-=dt;if(G.next<=0&&G.spawned<G.total){G.spawned++;G.next=Math.max(.3,1.1-G.spawned*.02)/sp;const ch=G.deck[G.spawned-1]||rand(G.L),el=document.createElement('div');el.className='bub';const kl=Math.floor(Math.random()*Math.min(SPECIES.length,30));el.innerHTML=`<div class="bub-k">${creatureSVG(kl,0,'fit big')}</div><img src="${BUBURL}" alt=""><span>${esc(ch)}</span>`;const x=8+Math.random()*84;el.style.left=x+'%';a.appendChild(el);G.b.push({t0:performance.now(),ch,el,y:H+40,v:(55+Math.random()*30)*sp,w:Math.random()*6.28})}
  G.b.forEach(o=>{if(o.pop)return;o.y-=o.v*dt;o.w+=dt*2;o.el.style.transform=`translate(${Math.sin(o.w)*8}px,${o.y}px)`;if(o.y<-70){o.pop=1;o.el.remove();G.hearts--;G.missed++;G.combo=0;sfx.bad();$('#g-b').textContent='♥'.repeat(Math.max(0,G.hearts))}});
  G.b=G.b.filter(o=>!o.pop||o.el.isConnected);const nx=G.b.filter(x=>!x.pop).sort((p,q)=>p.y-q.y)[0];setTarget(nx?nx.ch:null);
  if(G.hearts<=0||G.spawned>=G.total&&!G.b.some(o=>!o.pop)){const win=G.hearts>0;if(typeof arcadeRecordWin==='function'){G.arcLevel=G.arcLevel||arcadeLevelNow();arcadeRecordWin('bubble',win)}S.arc.bubble=Math.max(S.arc.bubble||0,G.score);if(win)S.arc.bwin=(S.arc.bwin||0)+1;
   const end=Math.max(1,Math.round((performance.now()-G.ghostStartTime)/100)),fr=[...G.ghostTimeline];if(fr.at(-1)[1]<end)fr.push([G.score,end]);
   G.challengeData={v:2,g:'bubble',...ghostSettings(),r:G.score,w:win,f:fr,m:true,q:G.deck};
   const fd=G.ghostInvite,gs=fd?`<div class="ghost-summary"><b>${G.score===fd.r?'A tie with your friend!':G.score>fd.r?'You beat your friend’s ghost!':'Your friend’s ghost won this time!'}</b><span>Your score: ${G.score} · Friend’s score: ${fd.r}</span></div>`:'';
   return xEnd(win?'You freed the Keylori!':'Out of hearts!',[[G.score,'Score'],[G.popped,'Keylori freed'],[G.speedBonus||0,'Speed bonus']],win?Math.min(6,2+Math.floor(G.score/150)):1,'bubble',gs,shareRunHTML('Bubble Pop',`${G.score} points · ${G.popped} Keylori freed`))}
  if(G.ghostInvite&&typeof ghostScoreTick==='function')ghostScoreTick(now);G.raf=requestAnimationFrame(tick)};G.raf=requestAnimationFrame(tick)};

/* ---------- 2. Treasure Dig ---------- */
const SHOVEL=PXG(["....oo....","...oHWo...","...oWWo...","....oWo...","....oWo...","....oWo...","....oWo...","....oWo...","....oWo...","..ooWWoo..",".oMMMMMMo.","oMHMMMMMDo","oMHMMMMMDo","oMMMMMMMDo",".oMMMMMDo.","..oMMMDo..","...oMDo...","....oo...."],{o:'#2a1d3e',W:'#a0703a',H:'#e8eef8',M:'#a8b4c8',D:'#6a768a'}).toDataURL();
function dirtTex(base,seed){const W=64,H=16,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),r=prng(seed);g.fillStyle=base;g.fillRect(0,0,W,H);
 const dk=shadeHex(base,-.25),lt=shadeHex(base,.18);for(let k=0;k<60;k++){g.fillStyle=r()<.5?dk:lt;g.fillRect(Math.floor(r()*W),Math.floor(r()*H),1,1)}
 for(let k=0;k<4;k++){const x=Math.floor(r()*(W-5)),y=Math.floor(r()*(H-4)),R=r();const col=R<.5?['#7a7488','#9a94a8','#4a4458']:R<.75?['#c8a040','#f0d070','#8a6a20']:R<.9?['#4aa8c8','#9ae0f0','#2a6a88']:['#b0503a','#e08060','#6a2a20'];
  [[1,0],[2,0],[0,1],[1,1],[2,1],[3,1],[1,2],[2,2]].forEach(([a,b],q)=>{g.fillStyle=q<2?col[1]:q>5?col[2]:col[0];g.fillRect(x+a,y+b,1,1)})}return c.toDataURL()}
const DIRT=['#8a6a44','#7a5a3a','#6a4a34','#5a4030','#4a3a34','#3e3440','#34304a','#2a2a50'];
const TREAS=(()=>{const mk=(rows,pal)=>PXG(rows,pal).toDataURL();return{
 gem:mk(["..ooo..",".oHLBo.","oHLLBBo","oLLBBDo",".oBBDo.","..oDo..","...o..."],{o:'#1a2a4a',H:'#ffffff',L:'#7fd8f0',B:'#4aa8d8',D:'#2a6aa8'}),
 coin:mk([".oooo.","oYYYyo","oYyYyo","oYyYyo","oYYyyo",".oooo."],{o:'#5a3a00',Y:'#f6d050',y:'#c8981e'}),
 bone:mk(["oo....oo","oWo..oWo",".oWWWWo.","oWo..oWo","oo....oo"],{o:'#4a3a2a',W:'#f2e8d0'}),
 egg:mk(["..oo..",".oWWo.","oWsWWo","oWWWso","oWsWWo",".oooo."],{o:'#4a3a2a',W:'#f6efe0',s:'#7fd8d0'})}})();
const REDDIA=PXG(["...ooooo...","..oHHRRRo..",".oHRRRRRro.","oRRRRRRRrro","oooooooooo.",".oRRRrrrro.","..oRRrrro..","...oRrro...","....oro....",".....o....."].map(r=>r.padEnd(11,'.')),{o:'#3a0a14',H:'#ffd0d0',R:'#e8384f',r:'#a8202e'}).toDataURL();
TREAS.red=REDDIA;
const PRIZE={gem:{n:'gem',g:3,xp:0},coin:{n:'gold coin',g:1,xp:0},bone:{n:'fossil',g:0,xp:15},egg:{n:'Keylori egg',g:0,xp:25},red:{n:'BIG RED DIAMOND',g:200,xp:0}};
ACT.dig=()=>{mountGame('Treasure Dig','Dig 15 layers before time runs out! Pick a word in the row to dig.','Treasure','Time');
 const words=xWords(7).slice().sort(()=>Math.random()-.5);let wi=0;const nw=()=>words[(wi++)%words.length];
 const roll=()=>Math.random()<1/200?'red':Math.random()<.5?rand(['gem','coin','coin','bone','gem','egg']):null;
 const L=Array.from({length:40},()=>{const n=2+(Math.random()<.4?1:0),ws=[];while(ws.length<n){const w=nw();if(!ws.some(x=>x[0]===w[0]))ws.push(w);if(wi>400)break}return {ws,pr:ws.map(roll)}});
 G={type:'dig',arcLevel:arcadeLevelNow(),L,li:0,typed:'',found:0,gems:0,xpg:0,got:{},left:75,done:false,mist:0};$('#gsw').hidden=false;$('#garena').className='garena dig-arena';
 $('#garena').innerHTML=`${backdrop(4,['#e8a050','#f0b868','#f6cc88','#fbe0b0'])}<div class="dig-shaft" id="digshaft">${L.map((l,k)=>`<div class="dl" id="dl${k}" style="background:url(${kku('dt'+Math.min(DIRT.length-1,Math.floor(k/5))+'_'+(k%3),()=>{return {toDataURL:()=>dirtTex(DIRT[Math.min(DIRT.length-1,Math.floor(k/5))],k%3*17+Math.floor(k/5))}})}) 0 0/256px 64px">${l.ws.map((w,q)=>`<span class="dw" id="dw${k}_${q}">${esc(w)}</span>`).join('')}</div>`).join('')}</div><div class="dig-hero" id="dighero">${zookSVG()}</div><img class="shovel" id="digshovel" src="${SHOVEL}" alt=""><div class="timebar"><i id="digtime"></i><span id="diggoal">0/15</span></div><div class="gmsg" id="gmsg"></div>`;
 const strip=()=>{const row=G.L[G.li],m=G.typed?row.ws.find(w=>w.startsWith(G.typed)):null;const show=m||G.typed;
  $('#gstripIn').innerHTML=[...show].map((c,k)=>`<span class="${k<G.typed.length?'ok':k===G.typed.length?'cur':''}">${esc(c)}</span>`).join('')||'<span class="cur">·</span>';
  const cur=$('#gstripIn .cur');if(cur&&m){cur.style.setProperty('--fc',fcol(keyInfo(m[G.typed.length]).f));}if(cur)$('#gstripIn').style.transform=`translateX(${$('#gstrip').clientWidth/2-(cur.offsetLeft+cur.offsetWidth/2)}px)`;
  const nx=G.typed?m&&m[G.typed.length]:null;setTarget(nx||null);$('#ghint').innerHTML=G.typed?(nx?fingerHTML(nx):''):'Pick any word in the glowing row!';
  row.ws.forEach((w,q)=>$(`#dw${G.li}_${q}`)?.classList.toggle('match',!!G.typed&&w.startsWith(G.typed)));
  {const cr=$('#dl'+G.li);$('#digshaft').style.transform=`translateY(${-(cr?cr.offsetTop:G.li*64)}px)`}document.querySelectorAll('.dl.cur').forEach(e=>e.classList.remove('cur'));$('#dl'+G.li)?.classList.add('cur')};
 const finish=()=>{const deep=G.li,win=deep>=15;S.arc.dig=Math.max(S.arc.dig||0,deep);S.arc.digT=Math.max(S.arc.digT||0,G.found);if(typeof arcadeRecordWin==='function')arcadeRecordWin('dig',win);S.xp+=G.xpg;
  const list=Object.entries(G.got).map(([t,n])=>`<span class="dig-got"><img src="${TREAS[t]}" alt="">×${n}</span>`).join('');
  xEnd(win?'Great dig! You reached the goal!':'Time’s up! The tunnel caved in.',[[G.score||0,'Score'],[deep,'Layers dug'],[G.found,'Treasures'],['+'+G.xpg,'XP']],1+G.gems,'dig',list?`<div class="dig-list">${list}</div>`:'')};
 G.xin=ch=>{const row=G.L[G.li],nt=G.typed+ch;if(!row.ws.some(w=>w.startsWith(nt))){G.mist++;sfx.bad();G.typed='';strip();return}
  G.typed=nt;sfx.ok(nt.length);const h=$('#dighero'),sv=$('#digshovel');[h,sv].forEach(e=>{if(!e)return;e.classList.remove('dig');void e.offsetWidth;e.classList.add('dig')});
  const q=row.ws.indexOf(nt);if(q>=0){const el=$(`#dw${G.li}_${q}`),t=row.pr[q];try{burst($('#garena'),el,DIRT[Math.min(DIRT.length-1,Math.floor(G.li/5))],8)}catch(e){}
   G.score=(G.score||0)+10+nt.length*5;if(t){const P=PRIZE[t];G.found++;G.got[t]=(G.got[t]||0)+1;G.gems+=P.g;G.xpg+=P.xp;$('#g-a').textContent=G.found;
    if(el)el.outerHTML=`<span class="dw dug prize"><img src="${TREAS[t]}" alt="">${P.g?'+'+P.g+' ♦':'+'+P.xp+' XP'}</span>`;tone(t==='red'?1200:880,.15,'square',.06);gmsg(t==='red'?'WOW! A BIG RED DIAMOND! +200':`Found a ${P.n}!`,t==='red'?'big good':'good');if(t==='red')sfx.win()}
   else{if(el)el.classList.add('dug');tone(300,.06,'square',.04)}
   G.li++;G.typed='';if(G.li>=G.L.length)return finish()}strip()};
 let last=performance.now();const tick=now=>{if(G.done||G.type!=='dig')return;G.left-=(now-last)/1000;last=now;$('#g-b').textContent=Math.max(0,Math.ceil(G.left));const tb=$('#digtime');if(tb){tb.style.width=Math.max(0,G.left/75*100)+'%';tb.parentElement.classList.toggle('low',G.left<15)}const dg=$('#diggoal');if(dg)dg.textContent=`${Math.min(G.li,15)}/15`;if(G.li>=15&&!G.goalHit){G.goalHit=1;gmsg('Goal reached! Keep digging for treasure!','good')}if(G.left<=0)return finish();G.raf=requestAnimationFrame(tick)};
 strip();G.raf=requestAnimationFrame(tick)};

/* ---------- 3. Keylori Keeper ---------- */
function kpOpts(good,bad){const ok=a=>new Set(a).size===a.length&&!a.some((x,i)=>a.some((y,j)=>i!==j&&y.startsWith(x)));let best=null;for(let t=0;t<60;t++){const a=[rand(good),rand(bad),rand(bad)];if(ok(a)){best=a;break}}
 if(!best){const g=rand(good),b=bad.filter(w=>!w.startsWith(g)&&!g.startsWith(w));const b1=rand(b.length?b:bad),b2=b.filter(w=>w!==b1&&!w.startsWith(b1)&&!b1.startsWith(w));best=b2.length?[g,b1,rand(b2)]:[g,b1]}return best.sort(()=>Math.random()-.5)}
const KP_APPLE=PXG(["....oo....",".....oG...","..ooooooo.",".oRRRRRRRo","oRHRRRRRRo","oRHRRRRRRo","oRRRRRRRDo","oRRRRRRRDo",".oRRRRRDo.","..oooooo.."],{o:'#2a1d3e',R:'#e8484a',H:'#ffb0a0',D:'#a82a2a',G:'#5ab868'}).toDataURL();
function kpGrow(){const f=Math.min(1,G.fed/G.goal),b=$('#kpbelly'),a=$('#kpapple'),pet=$('#kppet');if(b)b.style.width=(f*100)+'%';if(a)a.style.left=`calc(${f*100}% - 14px)`;if(pet)pet.style.setProperty('--grow',(1+f*.55).toFixed(3))}
const WANTS=[{t:'a LONG word (6+ letters)',f:w=>w.length>=6},{t:'a SHORT word (3 letters or less)',f:w=>w.length<=3},{t:'a word with the letter E',f:w=>w.includes('e')},{t:'a word with the letter A',f:w=>w.includes('a')},
 {t:'a word that starts with S',f:w=>w[0]==='s'},{t:'a word with double letters',f:w=>/(.)\1/.test(w)},{t:'a word with the letter O',f:w=>w.includes('o')},{t:'a word that ends with T',f:w=>w.endsWith('t')}];
ACT.keeper=()=>{mountGame('Keylori Keeper','Feed your Keylori the word it wants!','Fed','Time');
 const pool=xWords(9),cards=Object.keys(S.cards),[ci,cf]=(rand(cards.length?cards:['0-0'])).split('-').map(Number);
 G={type:'keeper',pool,ci,cf,goal:15,life:100,fed:0,miss:0,left:60,typed:'',done:false,want:null,opts:[]};$('#gsw').hidden=true;$('#garena').className='garena keeper-arena';
 $('#garena').innerHTML=`${backdrop(0,['#f0a870','#f0c088','#f6d8a8','#fbe8c8'])}${cloudsHTML()}<div class="kp-pet" id="kppet">${creatureSVG(ci,cf,'px')}</div><div class="kp-want bubble" id="kpwant"></div><div class="kp-food" id="kpfood"></div><div class="kp-belly"><i id="kpbelly"></i><img class="kp-apple" id="kpapple" src="${KP_APPLE}" alt=""><span class="kp-full">FULL</span></div><div class="kp-life"><span>♥</span><div><i id="kplife"></i></div></div><div class="kp-typed" id="kptyped"></div>`;
 const round=()=>{const ws=WANTS.filter(W=>pool.some(W.f)&&pool.some(w=>!W.f(w)));G.want=rand(ws.length?ws:WANTS);const good=pool.filter(G.want.f),bad=pool.filter(w=>!G.want.f(w));
  G.opts=kpOpts(good,bad);G.typed='';$('#kpwant').innerHTML=`I want ${G.want.t}!`;$('#kpfood').innerHTML=G.opts.map((w,k)=>`<div class="food" id="fd${k}"><span>${esc(w)}</span></div>`).join('');paint()};
 const paint=()=>{$('#kptyped').textContent=G.typed||' ';G.opts.forEach((w,k)=>{const el=$('#fd'+k);if(el)el.classList.toggle('match',!!G.typed&&w.startsWith(G.typed))});const m=G.opts.find(w=>w.startsWith(G.typed));setTarget(m?m[G.typed.length]:null)};
 G.xin=ch=>{const nt=G.typed+ch;if(!G.opts.some(w=>w.startsWith(nt))){sfx.bad();G.typed='';paint();return}G.typed=nt;sfx.ok(nt.length);const done=G.opts.find(w=>w===nt);
  if(done){const pet=$('#kppet');if(G.want.f(done)){G.fed++;G.score=(G.score||0)+20+done.length*5;$('#g-a').textContent=G.fed;kpGrow();if(G.fed>=G.goal){S.arc.keeper=Math.max(S.arc.keeper||0,G.fed);if(typeof arcadeRecordWin==='function'){G.arcLevel=G.arcLevel||arcadeLevelNow();arcadeRecordWin('keeper',true)}tone(880,.1,'square',.05);return xEnd(`${SPECIES[G.ci].n[G.cf]} is full and happy!`,[[G.score||0,'Score'],[G.fed,'Fed'],[G.speedBonus||0,'Speed bonus']],Math.min(8,1+Math.floor(G.fed/2)),'keeper')}pet.classList.remove('yum','nope');void pet.offsetWidth;pet.classList.add('yum');tone(880,.1,'square',.05);round()}
   else{G.miss++;pet.classList.remove('yum','nope');void pet.offsetWidth;pet.classList.add('nope');G.life-=15;$('#kplife').style.width=Math.max(0,G.life)+'%';if(G.life<=0){S.arc.keeper=Math.max(S.arc.keeper||0,G.fed);if(typeof arcadeRecordWin==='function'){G.arcLevel=G.arcLevel||arcadeLevelNow();arcadeRecordWin('keeper',false)}return xEnd(`${SPECIES[G.ci].n[G.cf]} got too grumpy!`,[[G.score||0,'Score'],[G.fed,'Fed'],[G.speedBonus||0,'Speed bonus']],1,'keeper')}$('#kpwant').innerHTML=`Not that one! I want ${G.want.t}.`;G.typed='';paint()}}else paint()};
 let last=performance.now();const tick=now=>{if(G.done||G.type!=='keeper')return;G.left-=(now-last)/1000;last=now;$('#g-b').textContent=Math.max(0,Math.ceil(G.left));
  if(G.left<=0){S.arc.keeper=Math.max(S.arc.keeper||0,G.fed);if(typeof arcadeRecordWin==='function'){G.arcLevel=G.arcLevel||arcadeLevelNow();arcadeRecordWin('keeper',G.fed>=G.goal)}const name=SPECIES[G.ci].n[G.cf];return xEnd(G.fed>=G.goal?`${name} is full and happy!`:`${name} is still a little hungry!`,[[G.score||0,'Score'],[G.fed,'Fed'],[G.speedBonus||0,'Speed bonus']],Math.min(8,1+Math.floor(G.fed/2)),'keeper')}
  G.raf=requestAnimationFrame(tick)};round();G.raf=requestAnimationFrame(tick)};

/* ---------- arcade screen: 6 games ---------- */
const _ra90=renderArcade;renderArcade=function(){_ra90();const g=$('#s-arcade .games');if(!g)return;
 const bub=`<div class="bubart">${[['f',0],['j',3],['k',6]].map(([c,k])=>`<div class="bub" style="position:relative;transform:none;margin:0"><div class="bub-k">${creatureSVG(k,0,'fit big')}</div><img src="${BUBURL}" alt=""><span>${c}</span></div>`).join('')}</div>`;
 g.insertAdjacentHTML('beforeend',`
 <div class="game panel"><div class="gart">${bub}</div><h3>Bubble Pop</h3><p>Pop the letter bubbles before they float away!</p><div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.bubble||0}</b><span>Best score</span></div><div class="arcade-stat"><b>${S.arc.bwin||0}</b><span>Wins</span></div><div class="arcade-stat level"><b>${arcadeHighest('bubble')}</b><span>Highest level beaten</span></div></div><button class="btn" data-act="bubble">Play</button></div>
 <div class="game panel"><div class="gart digart">${['gem','coin','bone','egg'].map(t=>`<img src="${TREAS[t]}" alt="">`).join('')}</div><h3>Treasure Dig</h3><p>Type words to dig deep and find treasure!</p><div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.digT||0}</b><span>Most treasure</span></div><div class="arcade-stat"><b>${S.arc.dig||0}</b><span>Deepest dig</span></div><div class="arcade-stat level"><b>${arcadeHighest('dig')}</b><span>Highest level beaten</span></div></div><button class="btn" data-act="dig">Play</button></div>
 <div class="game panel"><div class="gart race keepart">${creatureSVG(3,2,'big')}<div class="food">apple</div></div><h3>Keylori Keeper</h3><p>Feed your Keylori the words it wants!</p><div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.keeper||0}</b><span>Most fed</span></div><div class="arcade-stat level"><b>${arcadeHighest('keeper')}</b><span>Highest level beaten</span></div></div><button class="btn" data-act="keeper">Play</button></div>`)};

/* ---------- home: Arcade is a full second mode ---------- */
const _rh90=renderHome;renderHome=function(){_rh90();const ar=$('#s-home [data-to=arcade]'),cont=$('#s-home .btn.big');
 if(ar&&cont&&!ar.classList.contains('arcbig')){ar.classList.add('big','arcbig');cont.after(ar)}};
if(typeof screen!=='undefined'&&screen==='home')renderHome();

/* ghost challenges for Bubble Pop */
const _gim90=ghostInviteModal;ghostInviteModal=function(data){if(data&&data.g==='bubble'){challengeToStart=data;modal(`<h2>A friend challenged you!</h2><p><b>Bubble Pop</b>: Pop the same bubbles in the same order while your friend’s score replays.</p><div class="rbtns"><button class="btn" data-act="ghostStart">Play the challenge</button><button class="btn alt" data-act="ghostDismiss">Maybe later</button></div>${ghostFooterHTML()}`);return}return _gim90(data)};
const _gs90=ACT.ghostStart;ACT.ghostStart=()=>{const c=challengeToStart;if(!c||c.g!=='bubble')return _gs90();S.set.arcd=c.d;S.set.arcNumbers=c.n;S.set.arcSymbols=c.s;S.set.len=c.l;save();ghostToStart=c;closeModal();try{ACT.bubble()}finally{ghostToStart=null}};

/* ---------- speed bonus for every scored arcade game ---------- */
const SPEED_GAMES=['meteor','glitch','bubble','keeper','dig'];
function speedPop(n){const a=$('#garena');if(!a||!n)return;const e=document.createElement('div');e.className='spdpop';e.textContent=`+${n} fast!`;a.appendChild(e);setTimeout(()=>e.remove(),700)}
const _ok90=sfx.ok;sfx.ok=function(){try{if(typeof screen!=='undefined'&&screen==='game'&&G&&!G.done&&SPEED_GAMES.includes(G.type)){const now=performance.now(),dt=now-(G.lastOk||0);G.lastOk=now;
 const b=dt<220?3:dt<350?2:dt<500?1:0;if(b){G.score=(G.score||0)+b;G.speedBonus=(G.speedBonus||0)+b;if(G.type==='meteor'||G.type==='glitch'){const ga=$('#g-a');if(ga)ga.textContent=G.score}if(b>=2&&Math.random()<.35)speedPop(b)}}}catch(e){}return _ok90.apply(this,arguments)};

/* ---------- Keylori roaming the main menu ---------- */
const ROAM={els:[],plats:[],raf:0,last:0,scan:0};
function roamPick(){const best={};Object.entries(S.cards||{}).forEach(([k,c])=>{const [i,f]=k.split('-').map(Number);if(!SPECIES[i])return;
  const rank=f*10+(c.tier==='diamond'?3:c.tier==='gold'?2:c.holo?1:0);if(!best[i]||rank>best[i].rank)best[i]={i,f,tier:c.tier||null,rank}});
 return Object.values(best).sort((a,b)=>b.rank-a.rank).slice(0,Math.min(14,Object.keys(best).length))}
function roamPlats(){const sel=[['#s-home .hero-info',0,0],['#s-home .tcard',0,0]];
 ROAM.plats=[];sel.forEach(([q,ix,it])=>document.querySelectorAll(q).forEach(el=>{const r=el.getBoundingClientRect();if(r.width>20&&r.height>8)ROAM.plats.push({l:r.left+scrollX+r.width*ix,r:r.right+scrollX-r.width*ix,t:r.top+scrollY+r.height*it,b:r.bottom+scrollY})}));
 {const hi=document.querySelector('#s-home .hero-info'),tc=document.querySelector('#s-home .tcard');if(hi&&tc){const A=hi.getBoundingClientRect(),B=tc.getBoundingClientRect();const l=Math.min(A.right,B.right),r=Math.max(A.left,B.left);
  if(r>l)ROAM.plats.push({l:l+scrollX-2,r:r+scrollX+2,t:Math.min(A.top,B.top)+scrollY,b:Math.max(A.bottom,B.bottom)+scrollY,gap:1})}}
 const boxes=[...document.querySelectorAll('#s-home .tcard,#s-home .hero-info')].map(e=>e.getBoundingClientRect().bottom+scrollY);ROAM.floor=boxes.length?Math.max(...boxes):Math.max(document.documentElement.scrollHeight,innerHeight)-4;ROAM.W=document.documentElement.clientWidth}
function roamStart(){roamStop();roamToggleBtn();if((window.parOn&&!parOn('roam'))||typeof screen==='undefined'||screen!=='home'||!S.name||S.set.hideRoam||window.KK_MOBILE||document.body.classList.contains('mobile')||innerWidth<=760)return;const list=roamPick();if(!list.length)return;
 let layer=document.getElementById('roam');if(!layer){layer=document.createElement('div');layer.id='roam';document.body.appendChild(layer)}layer.innerHTML='';roamPlats();
 ROAM.els=list.map((k,n)=>{const el=document.createElement('div');el.className='roamer';el.innerHTML=creatureSVG(k.i,k.f,'px',k.tier);layer.appendChild(el);
  const sz=[112,132,156][k.f];el.style.width=sz+'px';el.style.height=sz+'px';
  const o={el,sz,x:30+Math.random()*(ROAM.W-90),y:-sz-n*30,vx:(Math.random()<.5?-1:1)*(25+Math.random()*30),vy:0,ground:null,hop:1+Math.random()*3,fly:roamFlyer(k),ph:Math.random()*6};roamDrag(o);return o});
 ROAM.last=performance.now();ROAM.raf=requestAnimationFrame(roamTick)}
function roamFlyer(k){try{const ev=EVO[k.i]||[];const feats=k.f>0?(ev[k.f-1]||[]):[];return feats.includes('wings')||/wind|sky|storm|air/i.test(SPECIES[k.i].t||'')}catch(e){return false}}
function roamStop(){cancelAnimationFrame(ROAM.raf);ROAM.raf=0;const l=document.getElementById('roam');if(l)l.innerHTML='';ROAM.els=[]}
function roamTick(now){if(typeof screen!=='undefined'&&screen!=='home'){roamStop();return}
 const dt=Math.min(.05,(now-ROAM.last)/1000);ROAM.last=now;if(now-ROAM.scan>1000){ROAM.scan=now;roamPlats()}
 ROAM.els.forEach(c=>{const w=c.sz,h=c.sz;if(c.held){c.el.style.transform=`translate(${c.x}px,${c.y}px) scaleX(${c.vx<0?-1:1})`;return}
  if(c.fly){c.ph+=dt*1.6;const tvx=(c.vx<0?-1:1)*28;c.vx+=(tvx-c.vx)*Math.min(1,dt*1.5);c.vy+=(Math.sin(c.ph)*30-c.vy)*Math.min(1,dt*2);c.x+=c.vx*dt;c.y+=c.vy*dt;
   const top=60,bot=ROAM.floor-h-10;if(c.y<top){c.y=top;c.vy=Math.abs(c.vy)}if(c.y>bot){c.y=bot;c.vy=-Math.abs(c.vy)}if(c.x<0){c.x=0;c.vx=Math.abs(c.vx)}if(c.x+w>ROAM.W){c.x=ROAM.W-w;c.vx=-Math.abs(c.vx)}
   for(const p of ROAM.plats){const cx=c.x+w*.5;if(cx>p.l-w*.3&&cx<p.r+w*.3&&c.y+h>p.t-6&&c.y<p.b){c.y=p.t-h-6;c.vy=-Math.abs(c.vy)}}
   if(Math.random()<dt*.15)c.vx=-c.vx;c.el.style.transform=`translate(${c.x}px,${c.y}px) scaleX(${c.vx<0?-1:1})`;c.el.classList.add('air','flyer');return}
  // walkers: air drag, and once on the ground ease back to a slow amble
  if(!c.ground)c.vx*=Math.pow(.6,dt);else{const sp=Math.abs(c.vx),t=Math.min(40,Math.max(22,sp));c.vx=(c.vx<0?-1:1)*(sp>t?sp+(t-sp)*Math.min(1,dt*6):t)}
  if(c.ground){c.hop-=dt;if(c.hop<=0){c.vy=-(260+Math.random()*220);c.ground=null;c.hop=1+Math.random()*3.5;if(Math.random()<.25)c.vx=-c.vx}
   else{const p=c.ground;if(p!=='floor'&&(c.x+w*.5<p.l||c.x+w*.5>p.r))c.ground=null}}
  if(!c.ground){c.vy+=900*dt}
  const oy=c.y;c.x+=c.vx*dt;c.y+=c.vy*dt;
  if(c.x<0){c.x=0;c.vx=Math.abs(c.vx)}if(c.x+w>ROAM.W){c.x=ROAM.W-w;c.vx=-Math.abs(c.vx)}
  if(c.vy>0&&!c.ground){const cx=c.x+w*.5;let landed=null;
   for(const p of ROAM.plats){if(cx>=p.l&&cx<=p.r&&oy+h<=p.t+2&&c.y+h>=p.t){if(!landed||p.t<landed.t)landed=p}}
   if(landed){c.y=landed.t-h;c.vy=0;c.ground=landed}else if(c.y+h>=ROAM.floor){c.y=ROAM.floor-h;c.vy=0;c.ground='floor'}}
  // bump into the side of a box while walking: turn around
  if(c.ground){for(const p of ROAM.plats){if(p===c.ground)continue;const feet=c.y+h-2;if(feet>p.t+4&&c.y<p.b&&((c.vx>0&&c.x+w>p.l&&c.x+w<p.l+8)||(c.vx<0&&c.x<p.r&&c.x>p.r-8))){
   const rise=feet-p.t+30;if(rise<520&&Math.random()<.7){c.vy=-Math.sqrt(2*900*rise);c.ground=null}else c.vx=-c.vx;break}}}
  // never stand or walk in front of a menu box: anything inside a box pops up onto its top
  for(const p of ROAM.plats){const cx=c.x+w*.5;if(cx>p.l&&cx<p.r&&c.y+h>p.t+4&&c.y<p.b){c.y=p.t-h;c.vy=0;c.ground=p;break}}
  c.el.style.transform=`translate(${c.x}px,${c.y}px) scaleX(${c.vx<0?-1:1})`;c.el.classList.toggle('air',!c.ground)});
 ROAM.raf=requestAnimationFrame(roamTick)}
const _rh95=renderHome;renderHome=function(){_rh95();setTimeout(roamStart,300)};
const _show95=show;show=function(id){_show95.apply(this,arguments);if(id!=='home')roamStop()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(ROAM.raf);else if(typeof screen!=='undefined'&&screen==='home'&&ROAM.els.length){ROAM.last=performance.now();ROAM.raf=requestAnimationFrame(roamTick)}});
if(typeof screen!=='undefined'&&screen==='home')setTimeout(roamStart,400);

function roamToggleBtn(){const tb=$('#s-home .topbar');if(!tb||!S.name)return;let b=tb.querySelector('.roamtog');const n=roamPick().length;if(!n){b&&b.remove();return}
 if(!b){tb.querySelector('.selp')?.insertAdjacentHTML('afterend','<button class="roamtog arcade-switch" data-act="roamToggle"></button>');b=tb.querySelector('.roamtog')}
 if(b){const on=!S.set.hideRoam;b.className='roamtog arcade-switch '+(on?'on':'');b.setAttribute('role','switch');b.setAttribute('aria-checked',on);b.setAttribute('aria-label','Show Keylori on the home screen');b.innerHTML=`<span>KEYLORI</span><span class="switch-track"><span class="switch-thumb"></span></span><span class="switch-state">${on?'ON':'OFF'}</span>`}}
ACT.roamToggle=()=>{S.set.hideRoam=!S.set.hideRoam;save();sfx.click&&sfx.click();roamStart()};

function roamDrag(c){c.el.addEventListener('pointerdown',e=>{e.preventDefault();c.held=true;c.ground=null;c.el.setPointerCapture(e.pointerId);c.el.classList.add('held');
  const ox=e.pageX-c.x,oy=e.pageY-c.y;let lx=e.pageX,ly=e.pageY,lt=performance.now();
  const mv=ev=>{const now=performance.now(),dt=Math.max(.016,(now-lt)/1000);c.vx=(ev.pageX-lx)/dt*.6;c.vy=(ev.pageY-ly)/dt*.6;lx=ev.pageX;ly=ev.pageY;lt=now;
   c.x=Math.max(0,Math.min(ROAM.W-c.sz,ev.pageX-ox));c.y=Math.min(ROAM.floor-c.sz,ev.pageY-oy)};
  const up=()=>{c.held=false;c.el.classList.remove('held');c.vx=Math.max(-600,Math.min(600,c.vx))||40;c.vy=Math.max(-900,Math.min(600,c.vy));c.hop=1+Math.random()*2;
   c.el.removeEventListener('pointermove',mv);c.el.removeEventListener('pointerup',up);c.el.removeEventListener('pointercancel',up)};
  c.el.addEventListener('pointermove',mv);c.el.addEventListener('pointerup',up);c.el.addEventListener('pointercancel',up)})}

/* closet: taking an item off (or putting one on) ends any preview so the hero shows the real outfit */
const _eq95=ACT.equip;ACT.equip=d=>{SHOPPV=null;return _eq95(d)};
