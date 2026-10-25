/* Keyloria Run (prototype): a side-scrolling runner. Type the letter on the obstacle to jump (you time it),
   type words to build bridges, then zap the Scrambler with lasers to free the caged Keylori.
   Uses the game's own hero, Keylori, Scramblers, keyboard, finger hints, sounds and pop-up boxes. */
(function(){
if(typeof S==='undefined')return;
const APPW=(()=>{try{const m=document.querySelector('main.app'),p=document.createElement('div');m.appendChild(p);const w=p.getBoundingClientRect().width;p.remove();return Math.max(320,Math.floor(w))}catch(e){return 966}})();   // the game's content width (same as the letter strip)
const SC=Math.max(2,Math.min(Math.round(APPW/330),Math.floor((innerHeight-440)/120)||2));   // whole-number pixel scale
const W=Math.max(300,Math.floor((APPW-6)/SC)),H=120,GROUND=100,RX=72;   // width follows the game's own width                 // RX = runner's front edge on screen
const BW=12,PLANK=10;                                // runner body width, bridge plank width
const GRAV=520,JV=-205,HOP=55;                         // jump strength, minimum forward speed of a jump
const SPEEDS=[.6,.8,1,1.25,1.5],SPD_NAME=['Slowest','Slow','Normal','Fast','Fastest'];
const LV=[
 {name:'F and J',     keys:'fj',        n:9,  words:0,  v:62},
 {name:'D and K',     keys:'fjdk',      n:11, words:0,  v:66},
 {name:'Home row',    keys:'asdfjkl',   n:12, words:0,  v:70},
 {name:'First words', keys:'asdfjkl',   n:12, words:.3, v:72},
 {name:'E and I',     keys:'asdfjklei', n:14, words:.3, v:76},
 {name:'Top row',     keys:'asdfghjklqwertyuiop', n:15, words:.35, v:80},
];
const HARD={name:'Super hard',keys:'abcdefghijklmnopqrstuvwxyz0123456789',caps:.15,n:22,words:.3,v:132,hard:1};
const MYWORDS='sad dad add ask lad fall all kid lid aid said fish dish wish kids skill sled red led fed see seed feed deer reef life file fire tire tea sea eat ate rat sat fat hat jet set wet let her the tree free three kite ride side wide hide idea ear star jar far art salt sail tail fail rail lake fake take rake wake'.split(' ');
const pool=(keys,min=3,max=6)=>{const src=(typeof WORDS!=='undefined'&&WORDS.length?WORDS:[]).concat(MYWORDS);return [...new Set(src)].filter(w=>w.length>=min&&w.length<=max&&/^[a-z]+$/.test(w)&&[...w].every(c=>keys.includes(c)))};
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const store={get(k,d){try{const v=localStorage.getItem('kr_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('kr_'+k,JSON.stringify(v))}catch(e){}}};
const fc=ch=>{try{return fcol(keyInfo(ch).f)}catch(e){return '#4de08a'}};
const snd=(f,d,t,v,w)=>{try{tone(f,d,t,v,w)}catch(e){}};

/* ---------- crisp pixel text (Press Start 2P, thresholded so there is no blur) ---------- */
const GLY={};
function glyph(ch,col){const k=ch+col;if(GLY[k])return GLY[k];const c=document.createElement('canvas');c.width=8;c.height=9;const x=c.getContext('2d');
 x.font='8px "Press Start 2P"';x.fillStyle=col;x.fillText(ch,0,8);const d=x.getImageData(0,0,8,9);for(let i=3;i<d.data.length;i+=4)d.data[i]=d.data[i]>100?255:0;x.putImageData(d,0,0);return GLY[k]=c}
function txt(g,s,x,y,col,sc=1,align='l',sh='#0b1033'){s=String(s);const w=s.length*8*sc;x=Math.round(align==='c'?x-w/2:align==='r'?x-w:x);y=Math.round(y);
 [...s].forEach((ch,i)=>{if(ch===' ')return;if(sh)g.drawImage(glyph(ch,sh),x+i*8*sc+sc,y+sc,8*sc,9*sc);g.drawImage(glyph(ch,col),x+i*8*sc,y,8*sc,9*sc)})}

/* ---------- sprites ---------- */
const PX=(rows,pal)=>{const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const g=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));return c};
const ROCK=PX(["....oooo....","..ooLLHLoo..",".oLLLHHLLMo.",".oLLLLLLMMo.","oLLLLLLMMMMo","oMLLLLMMMMDo","oMMLLMMMMDDo","oMMMMMMMDDDo",".oDMMMMDDDo.","..oooooooo.."],{o:'#1e1a2a',H:'#c8c8d8',L:'#9a9ab0',M:'#74748e',D:'#55556e'});
const STUMP=PX(["..oooooooo..",".oRRRRRRRRo.",".oRrrRRrrRo.",".oRRRRRRRRo.",".oBbBBBbBBo.",".oBbBBBbBBo.",".oBbBBBbBDo.",".oBBBBbBBDo.",".oBbBBbBBDo.",".oBbBBBbBDo.","ooBbBBBbBDoo","oGGBBbBBDGGo","oooooooooooo"],{o:'#2a1a12',R:'#e8c088',r:'#b48c5c',B:'#8a5a34',b:'#6a4024',D:'#54301a',G:'#4f7f48'});
const THORN=PX([".....o......","....oPo..o..","..o.oPo.oPo.",".oPooPPooPo.",".oPPoPPoPPo.","oGPPPPPPPPGo","oGgGPPPPGgGo","oGgGgGGgGgGo","oGGgGgGgGGGo",".oooooooooo."],{o:'#1e2a1a',P:'#e8e0f0',G:'#4f7f48',g:'#365f3c'});
const OBS=[ROCK,STUMP,THORN];
const GEM=PX([".oooo.","oCWCCo","oCCCco",".oCco.","..oo.."],{o:'#0b2a4a',W:'#ffffff',C:'#8ff0ff',c:'#4ab4d8'});
const CLOUD=PX(["....oooo.....","..ooHHHHoo...",".oHHHHLLLLoo.","oHHLLLLLLLLLo",".ooooooooooo."],{o:'#7a8ec0',H:'#ffffff',L:'#dfe8f4'});
const FLAG=PX(["ww........","wwYYYYYY..","wwYYYYYYYY","wwYYYYYY..","ww........","ww........","ww........","ww........","ww........","ww........","ww........","ww........","ww........","ww........","ww........","ww........","ww........","ww........"],{w:'#efe6d8',Y:'#f0c860'});
function heroImg(cb){try{const m=zookSVG().match(/href="([^"]+)"/);const im=new Image();im.onload=()=>cb(trim(im));im.src=m[1]}catch(e){cb(null)}}
function trim(src){const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const g=c.getContext('2d');g.drawImage(src,0,0);const d=g.getImageData(0,0,c.width,c.height).data;
 let x0=c.width,x1=0,y0=c.height,y1=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>20){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
 const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,-x0,-y0);return o}
function flash(src,col){const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const g=c.getContext('2d');g.drawImage(src,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);return c}

/* ---------- plug-in hooks (add-on files: runner-boss.js, runner-paths.js, runner-goals.js) ---------- */
const HK={build:[],key:[],update:[],drawWorld:[],drawTop:[],results:[],startModal:[]},SEG={};
const runHooks=(n,...a)=>{let r=false;for(const f of HK[n]){try{if(f(...a))r=true}catch(e){console.error('[runner hook '+n+']',e)}}return r};
const collect=(n,...a)=>HK[n].map(f=>{try{return f(...a)||''}catch(e){console.error(e);return ''}}).join('');
/* ---------- state ---------- */
let R=null,HERO=null,HERO_W=null,cvs=null,g=null,raf=0,last=0,scale=3;
const opt={lv:Math.min(store.get('lv',0),LV.length-1),hard:false,spd:store.get('spd',2)};
let custom=null,saved=null;   // custom = a level config handed in by another screen (the lesson bridge): {name,keys,favor,words,n,v,lv,back,results(info),startExtra()}
const level=()=>custom||(opt.hard?HARD:LV[opt.lv]);
function setCustom(c){if(c){if(!custom)saved={lv:opt.lv,hard:opt.hard};custom=Object.assign({words:.3,n:12,v:72,custom:1},c);custom.keys=[...new Set(String(custom.keys))].join('');opt.hard=false;opt.lv=Math.max(0,Math.min(LV.length-1,custom.lv==null?2:custom.lv))}
 else if(custom){custom=null;if(saved){opt.lv=saved.lv;opt.hard=saved.hard;saved=null}}}

function build(){
 const L=level(),spd=SPEEDS[opt.spd],v=L.v*spd,air=-2*JV/GRAV,jump=Math.max(v,HOP)*air;
 const words=pool(L.hard?'abcdefghijklmnopqrstuvwxyz':L.keys,L.wmin||3,L.hard?7:(L.wmax||5));   // L.wmin/L.wmax: optional word length range (the lesson bridge raises it in later worlds)
 const pickWord=()=>{if(L.wfav&&L.favor){const f=words.filter(w=>[...w].some(c=>L.favor.includes(c)));if(f.length&&Math.random()<L.wfav)return pick(f)}return pick(words)};   // L.wfav: optional share of words that use the favoured (new) letters
 const obs=[],gems=[];let x=RX+150;
 for(let i=0;i<L.n;i++){
  if(words.length&&i>1&&Math.random()<L.words&&obs.length&&obs[obs.length-1].t!=='gap'){const w=pickWord();obs.push({t:'gap',x,word:w,typed:0,w:w.length*PLANK+4});x+=w.length*PLANK+4}
  else{let k=pick([...L.keys,...(L.favor||'')]);if(L.caps&&/[a-z]/.test(k)&&Math.random()<L.caps)k=k.toUpperCase();const sp=OBS[Math.floor(Math.random()*OBS.length)];obs.push({t:'rock',x,key:k,sp,w:sp.width-2,h:sp.height-1})}
  const gap=Math.max(jump+(L.hard?26:44),v*(L.hard?rnd(.85,1.3):rnd(1.6,2.3))*(L.gapMul||1));   // L.gapMul (optional, default 1): tighter spacing in later worlds
  const lo=obs[obs.length-1];if(lo.t==='rock')[-11,0,11].forEach((dx,j)=>gems.push({x:lo.x+lo.w/2+dx,y:GROUND-[32,40,32][j],got:0}));   // gems ride the jump arc: a well-timed jump grabs them
  x+=gap}
 const bossX=x+80;
 const seq=L.hard?[pick(words),pick(words),pick(words)].join(' '):Array.from({length:8+opt.lv*2},()=>pick([...L.keys,...(L.favor||'')])).join('');
 const sp=Math.floor(Math.random()*Math.min(40,SPECIES.length)),vk=pick(typeof BADKEYS!=='undefined'?BADKEYS:['inkblob']);
 let VIL=null,KEY=null;try{VIL=vilCanvas(vk,L.hard)}catch(e){}try{KEY=trim(evolvedV(sp,0,null,(S.kv&&S.kv[sp])||{}))}catch(e){}
 const RR={L,v,obs,gems,bossX,seq,pos:0,sp,vname:(typeof SCR2!=='undefined'&&SCR2.names[vk])||'Scrambler',VIL,VILF:VIL&&flash(VIL,'#ffffff'),KEY,
  front:RX,cam:0,speed:0,y:0,vy:0,air:false,jt:null,stun:0,kb:0,t:0,phase:'ready',hits:0,miss:0,nice:0,bonks:0,gemN:0,streak:0,best:0,
  parts:[],pops:[],beams:[],shake:0,red:0,hitT:0,laugh:0,free:0,start:0,typed:0,jumpScale:1};
 R=RR;runHooks('build',RR);return RR}

/* ---------- screen ---------- */
function mount(){
 if(document.getElementById('s-runner'))return;
 const sec=document.createElement('section');sec.id='s-runner';sec.className='screen';sec.hidden=true;
 sec.innerHTML=`<header class="hud" id="rhud"></header><div class="rbox" id="rbox"><canvas id="rcv" width="${W}" height="${H}"></canvas></div>
 <div class="strip-wrap"><div class="strip" id="rstrip"><div class="strip-in" id="rstripIn"></div></div><div class="fhint" id="rhint"></div></div>`;
 document.querySelector('main.app').appendChild(sec);
 const st=document.createElement('style');st.textContent=`
 #s-runner .rbox{display:flex;justify-content:center;margin:6px 0 10px}
 #rcv{display:block;image-rendering:pixelated;image-rendering:crisp-edges;border:3px solid #2a3270;border-radius:10px;background:#0b1033}
 #rhud .rspd{display:flex;align-items:center;gap:4px;font-family:var(--display);font-size:16px;color:var(--muted)}
 #rhud .rspd button{width:22px;height:22px;border:0;border-radius:5px;background:#1a2156;cursor:pointer;padding:0;box-shadow:0 3px 0 #0a0f2e}
 #rhud .rspd button.on{background:var(--volt);box-shadow:0 3px 0 #1a9fb3}
 #rhud .rspd button.lit{background:#4a9fb3}
 .rpick{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:6px 0}
 .rpick .btn.on{outline:3px solid var(--gold);outline-offset:2px}
 .rpick .btn.hard{background:#e8584f;color:#fff;box-shadow:0 5px 0 #8a2a24}
 .rkeys{display:flex;justify-content:center;gap:6px;margin:4px 0 10px}
 .rkeys .chip{font-size:20px}
 .rfree{display:flex;align-items:center;justify-content:center;gap:12px}.rfree svg{width:120px;height:120px}`;
 document.head.appendChild(st);
 cvs=document.getElementById('rcv');g=cvs.getContext('2d');g.imageSmoothingEnabled=false;
 addEventListener('resize',fit);
}
function fit(){if(!cvs)return;const box=document.getElementById('rbox');
 // the game's screens can be zoomed (text-size setting): size the canvas so each game pixel is a whole number of SCREEN pixels
 const f=(box.getBoundingClientRect().width/(box.offsetWidth||1))||1,sw=box.getBoundingClientRect().width||APPW;
 scale=Math.max(1,Math.min(SC,Math.floor((sw-6)/W)));cvs.style.width=(W*scale/f)+'px';cvs.style.height=(H*scale/f)+'px';cvs.style.borderWidth=(3/f)+'px'}
function hudHTML(){const L=level();
 return `<button class="icon-btn" data-act="go" data-to="${custom?(custom.back||'map'):(RUNNER.backTo||'home')}" aria-label="Back">${ICON.back}</button>
 <div class="ht"><b>${custom?esc(L.name):'Run · '+L.name}</b><span>${custom?esc(custom.sub||'Review run'):opt.hard?'Super hard':'Level '+(opt.lv+1)+' of '+LV.length}</span></div>
 <div class="rspd" title="Speed"><span>Speed</span>${SPEEDS.map((_,i)=>`<button data-act="runSpd" data-v="${i}" class="${i===opt.spd?'on':i<opt.spd?'lit':''}" aria-label="${SPD_NAME[i]}"></button>`).join('')}</div>
 <div class="stat"><b id="r-acc">100%</b><span>Accuracy</span></div><div class="stat"><b id="r-cmb">0</b><span>Combo</span></div>${typeof soundBtn==='function'?soundBtn():''}`}
function stripHTML(){
 if((R.phase==='boss'||R.phase==='free')&&RUNNER.boss&&RUNNER.boss.stripHTML)return RUNNER.boss.stripHTML();
 if(R.phase==='boss'||R.phase==='free')return [...R.seq].map((c,i)=>`<span class="${c===' '?'sp':''} ${i<R.pos?'ok':''}">${c===' '?'·':esc(c)}</span>`).join('');
 const out=[];R.obs.forEach((o,i)=>{if(i)out.push('<span class="sp">·</span>');stripOf(o).forEach(c=>out.push(`<span>${esc(c)}</span>`))});return out.join('')}
let stripMap=[];
function buildStrip(){document.getElementById('rstripIn').innerHTML=stripHTML();stripMap=[];if(R.phase==='boss')return;let k=0;R.obs.forEach((o,i)=>{if(i)k++;o.si=k;k+=stripOf(o).length})}
function updStrip(){
 const sp=document.getElementById('rstripIn').children;if(!sp.length)return;let cur=-1,ch=null;
 if(R.phase==='boss'&&RUNNER.boss&&RUNNER.boss.strip){const b=RUNNER.boss.strip();cur=b.cur;ch=b.ch}
 else if(R.phase==='boss'){cur=R.pos;ch=R.seq[R.pos];for(let i=0;i<sp.length;i++){sp[i].classList.toggle('ok',i<R.pos);sp[i].classList.remove('cur')}}
 else{R.obs.forEach(o=>{const n=stripOf(o).length,ty=typedOf(o);for(let j=0;j<n;j++)sp[o.si+j]&&sp[o.si+j].classList.toggle('ok',j<ty)});
  const t=target();if(t){cur=t.si+Math.min(typedOf(t),stripOf(t).length-1);ch=(wantOf(t)||'')[0]}
  for(let i=0;i<sp.length;i++)sp[i].classList.remove('cur')}
 if(cur>=0&&sp[cur]){const el=sp[cur];el.classList.add('cur');el.style.setProperty('--fc',fc(ch));const w=document.getElementById('rstrip').clientWidth;document.getElementById('rstripIn').style.transform=`translateX(${w/2-(el.offsetLeft+el.offsetWidth/2)}px)`}
 if(ch!=null&&ch!==' '){try{setTarget(ch);document.getElementById('rhint').innerHTML=fingerHTML(ch)}catch(e){}}else if(ch===' '){try{setTarget(' ');document.getElementById('rhint').innerHTML=fingerHTML(' ')}catch(e){}}
 const a=document.getElementById('r-acc'),c=document.getElementById('r-cmb');if(a)a.textContent=Math.round(R.hits/Math.max(1,R.hits+R.miss)*100)+'%';if(c)c.textContent=R.streak}

/* ---------- flow ---------- */
function open(cfg){
 setCustom(cfg&&cfg.keys?cfg:null);
 mount();show('runner');document.getElementById('s-runner').appendChild(document.getElementById('kbwrap'));
 heroImg(h=>{HERO=h;HERO_W=h&&flash(h,'#ffffff')});
 newRun();if(custom&&custom.autoStart){try{go()}catch(e){startModal()}}else startModal();   // autoStart: the bridge's boss chase starts running at once
 cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
function newRun(){R=build();document.getElementById('rhud').innerHTML=hudHTML();buildStrip();fit();updStrip()}
function startModal(){const L=level();
 if(custom){const ks=[...new Set(L.keys)].slice(0,14).map(k=>`<span class="chip" style="--fc:${fc(k)}">${esc(k)}</span>`).join('');let ex='';try{ex=custom.startExtra?custom.startExtra()||'':''}catch(e){}
  return modal(`<div data-runner="start"><h2>${esc(L.name)}</h2><p style="margin:0 0 6px">Type the letter to jump!</p>
  <div class="rkeys">${ks}${L.keys.length>14?'<span class="chip">…</span>':''}</div>${ex}
  <div class="rbtns"><button class="btn big" data-act="runGo">Go! (SPACE)</button><button class="btn alt" data-act="go" data-to="${custom.back||'map'}">Map</button></div></div>`)}
 const keys=[...new Set(L.keys)].slice(0,12).map(k=>`<span class="chip" style="--fc:${fc(k)}">${esc(k)}</span>`).join('');
 modal(`<div data-runner="start"><h2>Keyloria Run</h2><p style="margin:0 0 6px">Type the letter to jump!</p>
 <div class="rkeys">${keys}${L.keys.length>12?'<span class="chip">…</span>':''}</div>
 <div class="rpick">${LV.map((l,i)=>`<button class="btn sm alt ${!opt.hard&&i===opt.lv?'on':''}" data-act="runLv" data-v="${i}" title="${l.name}" ${RUNNER.locked(i)?'disabled style="opacity:.45"':''}>${RUNNER.label(i)}</button>`).join('')}<button class="btn sm hard ${opt.hard?'on':''}" data-act="runHard" ${RUNNER.locked('hard')?'disabled style="opacity:.45"':''}>${RUNNER.label('hard')}</button></div>
 ${collect('startModal')}
 <div class="rbtns"><button class="btn big" data-act="runGo">Go! (SPACE)</button></div></div>`)}
function go(){closeModal();if(R.paused){R.phase=R.paused;R.paused=null}else if(R.phase==='ready'){R.phase='run';R.start=performance.now()}snd(523,.08,'square',.05)}
function results(){
 let acc=Math.round(R.hits/Math.max(1,R.hits+R.miss)*100),stars=acc>=95?3:acc>=85?2:acc>=60?1:0,mins=Math.max((performance.now()-R.start)/60000,1/60),wpm=Math.round(R.typed/5/mins);
 if(custom&&custom.adjust){try{const a=custom.adjust({stars,acc,wpm,R})||{};if(a.stars!=null)stars=a.stars;if(a.acc!=null)acc=a.acc;if(a.wpm!=null)wpm=a.wpm}catch(e){console.error('[runner custom adjust]',e)}}   // adjust(info) may override stars/acc/wpm (hybrid Boss Test: combined with the classic part)
 const name=SPECIES[R.sp].n[0];const st=[1,2,3].map(k=>ICON.star.replace('<svg',`<svg class="${k<=stars?'on':''}"`)).join('');
 if(!custom&&!opt.hard&&stars>0&&opt.lv+1<LV.length)store.set('unl',Math.max(store.get('unl',1),opt.lv+2));
 const tip=R.bonks?'Press the letter just before you reach it!':pick(['Keep your eyes on the screen, not your hands!','Sit up tall and relax your shoulders!','Slow is OK! Getting it right comes first.']);
 const info={stars,acc,wpm,nice:R.nice,gems:R.gemN,bonks:R.bonks,best:R.best,lv:opt.lv,hard:opt.hard,R};
 let cx=null;if(custom&&custom.results){try{cx=custom.results(info)}catch(e){console.error('[runner custom results]',e)}}cx=cx||{};
 const ok=!custom||stars>0;
 modal(`<div data-runner="done"><h2>${cx.head||(ok?'You saved '+esc(name)+'!':'So close!')}</h2><div class="bigstars">${st}</div>
 ${ok?`<div class="rfree">${creatureSVG(R.sp,0,'px')}<div class="bubble" style="position:static;opacity:1;transform:none">Yay, you saved me!</div></div>`:''}
 ${cx.html||''}<p class="note" style="margin:0">${ok?tip:'Try again! Go slow.'}</p>
 ${cx.stats||`<div class="rstats"><div><b>${stars} ★</b><span>Stars</span></div><div><b>${acc}%</b><span>Accuracy</span></div><div><b>${wpm}</b><span>WPM</span></div><div><b>${R.nice}</b><span>Nice jumps</span></div><div><b>${R.gemN}</b><span>Diamonds</span></div></div>`}
 ${custom?'':collect('results',info)}
 <div class="rbtns">${cx.btns||(!opt.hard&&opt.lv+1<LV.length&&!RUNNER.locked(opt.lv+1)?`<button class="btn" data-act="runNext">Next ▸</button>`:'')+`<button class="btn ${opt.hard||opt.lv+1>=LV.length?'':'alt'}" data-act="runAgain">Play again</button><button class="btn alt" data-act="runMenu">Levels</button>`}</div></div>`);
 try{if(ok)sfx.win()}catch(e){}
}
Object.assign(ACT,{
 runGo:()=>go(),
 runLv:d=>{if(RUNNER.locked(+d.v))return;opt.lv=+d.v;opt.hard=false;store.set('lv',opt.lv);newRun();startModal()},
 runHard:()=>{if(RUNNER.locked('hard'))return;opt.hard=!opt.hard;newRun();startModal()},
 runSpd:d=>{opt.spd=+d.v;store.set('spd',opt.spd);const was=R.phase;const k=SPEEDS[opt.spd];R.v=R.L.v*k;document.getElementById('rhud').innerHTML=hudHTML();updStrip();if(document.activeElement)document.activeElement.blur();R.phase=was},
 runNext:()=>{opt.lv=Math.min(LV.length-1,opt.lv+1);store.set('lv',opt.lv);newRun();startModal()},
 runAgain:()=>{newRun();go()},
 runMenu:()=>{newRun();startModal()},
});
window.RUNNER={open,get R(){return R},get custom(){return custom},close:()=>setCustom(null),opt,HK,SEG,boss:null,backTo:null,
 locked:i=>false,label:i=>i==='hard'?'Super hard':String(i+1),
 C:{W,H,GROUND,RX,BW,PLANK,GRAV,JV,HOP,SPEEDS},LV,HARD,level,
 get g(){return g},get HERO(){return HERO},
 txt:(...a)=>txt(...a),PX,cap:(...a)=>cap(...a),fc,snd,rnd,pick,pool,store,flash,trim,
 burst:(...a)=>burst(...a),popTxt:(...a)=>popTxt(...a),miss:()=>miss(),jump:o=>jump(o),
 target:()=>target(),updStrip:()=>updStrip(),buildStrip:()=>buildStrip(),
 win:()=>{R.phase='free';R.free=0},heroY:()=>height()};

/* ---------- rules ---------- */
const isDone=o=>o.t==='gap'?o.typed>=o.word.length:o.t==='rock'?(o.done||o.jt):(SEG[o.t]?SEG[o.t].done(o):true);
const wantOf=o=>o.t==='gap'?o.word[o.typed]:o.t==='rock'?o.key:(SEG[o.t]?SEG[o.t].want(o):'');
const stripOf=o=>o.t==='gap'?[...o.word]:o.t==='rock'?[o.key]:(SEG[o.t]?SEG[o.t].strip(o):[]);
const typedOf=o=>o.t==='gap'?o.typed:o.t==='rock'?((o.done||o.jt)?1:0):(SEG[o.t]?SEG[o.t].typed(o):0);
const target=()=>R.obs.find(o=>!isDone(o));
const height=()=>-R.y;
function burst(x,y,col,n,sp=50){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=rnd(sp*.3,sp);R.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rnd(.25,.5),c:col})}}
function popTxt(s,x,y,col){R.pops.push({s,x,y,col,l:.8})}
function miss(){R.miss++;R.streak=0;R.red=.15;try{sfx.bad()}catch(e){snd(170,.18,'sine',.14)}}
function jump(o){
 R.air=true;R.vy=JV*(R.jumpScale||1);R.jt=o;o.jt=true;R.jumpV=Math.max(R.speed,HOP);
 // was it timed well? (would this jump clear it without slowing down)
 const d=o.x-R.front,v=Math.max(R.speed,HOP),tA=d/v,tB=(d+BW+o.w)/v,yA=-JV*tA-GRAV/2*tA*tA,yB=-JV*tB-GRAV/2*tB*tB;
 o.nice=d>0&&yA>=o.h&&yB>=o.h;
 snd(330,.12,'square',.05);snd(620,.1,'square',.04,.05);burst(R.front-BW/2-R.cam,GROUND,'#e8dcc0',4,25)}
function key(e){
 if(runHooks('key',e))return;
 if(R.phase==='boss'&&RUNNER.boss){RUNNER.boss.key(e);updStrip();return}
 if(R.phase==='boss'){const want=R.seq[R.pos];
  if(e.key===want||(want&&want===want.toLowerCase()&&e.key===want.toUpperCase()&&!e.shiftKey)){R.pos++;R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);
   if(want!==' '){const big=R.streak>0&&R.streak%5===0;R.beams.push({c:fc(want),l:big?.22:.12,big});R.hitT=.12;burst(R.bossX-R.cam+4,GROUND-14,fc(want),big?14:6,big?80:50);R.shake=big?3:1;try{sfx.ok(R.streak)}catch(e){}}
   if(R.pos>=R.seq.length){R.phase='free';R.free=0;burst(R.bossX-R.cam+4,GROUND-14,'#ffffff',30,90);burst(R.bossX-R.cam+4,GROUND-14,'#b48ae0',20,70);snd(180,.4,'sawtooth',.06);setTimeout(()=>{try{sfx.super()}catch(e){}},250)}
  }else{miss();R.laugh=.4}
  updStrip();return}
 if(R.phase!=='run')return;
 const t=target();if(!t)return;
 if(t.x-R.cam>W+4){return}                                   // not on screen yet
 const want=wantOf(t)||'',caps=e.getModifierState&&e.getModifierState('CapsLock')&&!e.shiftKey,kk=caps?e.key.toLowerCase():e.key,ok=[...want].includes(kk);
 if(!ok){if(R.air&&R.jt&&e.key===R.jt.key)return;miss();updStrip();return}
 R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);
 if(SEG[t.t]){SEG[t.t].key(t,kk);updStrip();return}
 if(t.t==='gap'){t.typed++;snd(440+t.typed*50,.06,'square',.05);burst(t.x+t.typed*PLANK-R.cam,GROUND+2,'#d0ac78',4,30);if(t.typed===t.word.length){popTxt('BRIDGE!',t.x+t.w/2,GROUND-34,'#f0c860');try{sfx.super()}catch(e){}}}
 else{if(R.air){R.hits--;R.typed--;R.streak--;return}jump(t)}
 updStrip()}
function bonk(o){
 R.bonks++;R.streak=0;R.shake=3;R.stun=R.L.hard?.45:.25;R.kb=R.L.hard?-70:0;R.speed=0;
 R.front=o.x-(R.L.hard?3:10);R.cam=R.front-RX;if(R.air){R.air=false;R.y=0;R.vy=0}
 if(R.jt){R.jt.jt=false;R.jt=null}
 popTxt('BONK!',o.x+o.w/2,GROUND-30,'#ff6b7a');snd(120,.15,'square',.07);burst(o.x-R.cam,GROUND-8,'#ffffff',6,40);updStrip()}

function update(dt){
 R.t+=dt;R.shake=Math.max(0,R.shake-dt*20);R.red=Math.max(0,R.red-dt);R.hitT=Math.max(0,R.hitT-dt);R.laugh=Math.max(0,R.laugh-dt);
 R.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.9;p.vy*=.9;p.l-=dt});R.parts=R.parts.filter(p=>p.l>0);
 R.pops.forEach(p=>{p.y-=18*dt;p.l-=dt});R.pops=R.pops.filter(p=>p.l>0);R.beams.forEach(b=>b.l-=dt);R.beams=R.beams.filter(b=>b.l>0);
 if(R.phase==='boss'&&RUNNER.boss){RUNNER.boss.update(dt);return}
 if(R.phase==='free'){R.free+=dt;if(R.free>1.8&&!R.shown){R.shown=1;results()}return}
 if(R.phase!=='run')return;
 R.obs.forEach(o=>{if(SEG[o.t]&&SEG[o.t].update)SEG[o.t].update(o,dt)});
 if(runHooks('update',dt))return;
 // speed
 let want=R.v*(1+Math.min(R.streak,10)*.025);
 if(R.stun>0){R.stun-=dt;want=0}
 if(!R.air){
  // never fall into a gap: stop at the end of the bridge
  const gp=R.obs.find(o=>o.t==='gap'&&o.typed<o.word.length&&o.x+o.w>R.front-BW);
  if(gp){const edge=gp.x+2+gp.typed*PLANK,d=edge-R.front;if(d<40)want=Math.min(want,Math.sqrt(2*900*Math.max(0,d)))}
  R.obs.forEach(o=>{if(SEG[o.t]&&SEG[o.t].block){const bx=SEG[o.t].block(o);if(bx!=null){const d=bx-R.front;if(d<40)want=Math.min(want,Math.sqrt(2*1200*Math.max(0,d)))}}});
  // easy modes: skid to a stop in front of a rock instead of bumping it
  if(!R.L.hard){const rk=R.obs.find(o=>o.t==='rock'&&!o.done&&o.x+o.w>R.front-BW);if(rk&&!rk.jt){const d=rk.x-10-R.front;if(d<16)want=Math.min(want,Math.sqrt(2*1400*Math.max(0,d)))}}
  R.speed+=(want-R.speed)*Math.min(1,dt*(want<R.speed?30:3));if(want<R.speed)R.speed=want;
 }
 const vx=R.air?R.jumpV:R.speed+R.kb;R.kb*=.85;if(Math.abs(R.kb)<2)R.kb=0;
 R.front+=vx*dt;R.cam=R.front-RX;
 if(R.air){R.vy+=GRAV*dt;R.y+=R.vy*dt;if(R.y>=0){R.y=0;R.vy=0;R.air=false;snd(110,.05,'triangle',.08);
   const o=R.jt;R.jt=null;if(o&&!o.done){o.jt=false;popTxt('TOO SOON',o.x+o.w/2,GROUND-30,'#b8c0e8');updStrip()}}}
 // obstacles: clear or bonk
 for(const o of R.obs){if(o.t!=='rock'||o.done)continue;const back=R.front-BW;
  if(back>o.x+o.w){o.done=true;if(o.nice){R.nice++;R.gemN++;popTxt('NICE!',o.x+o.w/2,GROUND-34,'#4de08a');snd(988,.05,'square',.04);snd(1319,.08,'square',.04,.05)}updStrip();continue}
  if(R.front>o.x+1&&back<o.x+o.w-1&&height()<o.h-2){bonk(o);break}
  break}
 // gems
 R.gems.forEach(gm=>{if(!gm.got&&gm.x>R.front-BW-4&&gm.x<R.front+2&&(GROUND-gm.y)>=height()-6&&(GROUND-gm.y)<=height()+24){gm.got=1;R.gemN++;snd(1175,.06,'square',.04);burst(gm.x-R.cam,gm.y,'#8ff0ff',5,40)}});
 // reach the Scrambler
 if(R.front>=R.bossX-46){R.front=R.bossX-46;R.cam=R.front-RX;R.speed=0;R.phase='boss';R.pos=0;R.streak=0;buildStrip();updStrip();try{speak('Free '+SPECIES[R.sp].n[0]+'!')}catch(e){}if(RUNNER.boss){RUNNER.boss.start(R);buildStrip();updStrip()}}
}

/* ---------- draw ---------- */
const SKY=['#3b5fa0','#4a72b2','#5c88c2','#729ece','#8cb4d6','#a8c8dc','#c4dadc'];
const hillA=x=>Math.round(26+6*Math.sin(x/37)+4*Math.sin(x/13+1)),hillB=x=>Math.round(14+4*Math.sin(x/23+2)+3*Math.sin(x/9));
function draw(){
 const cam=Math.round(R.cam),sx=R.shake?Math.round(rnd(-R.shake,R.shake)):0;g.setTransform(1,0,0,1,sx,0);
 // sky bands with dithered edges
 SKY.forEach((c,i)=>{g.fillStyle=c;g.fillRect(-4,i*12,W+8,12);if(i){g.fillStyle=SKY[i-1];for(let x=-4;x<W+4;x+=2)g.fillRect(x+(i%2),i*12,1,1)}});g.fillStyle=SKY[SKY.length-1];g.fillRect(-4,84,W+8,20);
 [[20,10],[130,22],[240,8],[330,18]].forEach(([x,y])=>{const px=((x-Math.floor(cam*.1))%(W+60)+W+60)%(W+60)-40;g.drawImage(CLOUD,px,y)});
 // far hills + near bushes (parallax, every pixel on the grid)
 const fa=Math.floor(cam*.25),fb=Math.floor(cam*.5);
 for(let x=-4;x<W+4;x++){const h=hillA(x+fa);g.fillStyle='#4a7a7a';g.fillRect(x,GROUND-h,1,h);g.fillStyle='#2e5458';g.fillRect(x,GROUND-h,1,1)}
 for(let x=-4;x<W+4;x++){const h=hillB(x+fb);g.fillStyle='#4f7f48';g.fillRect(x,GROUND-h,1,h);g.fillStyle=hillB(x+fb-1)<h?'#365f3c':'#7fae6a';g.fillRect(x,GROUND-h,1,1)}
 // ground
 g.fillStyle='#62955a';g.fillRect(-4,GROUND,W+8,3);g.fillStyle='#a4c886';g.fillRect(-4,GROUND,W+8,1);
 g.fillStyle='#b48c5c';g.fillRect(-4,GROUND+3,W+8,H-GROUND);g.fillStyle='#d0ac78';g.fillRect(-4,GROUND+3,W+8,1);
 g.fillStyle='#8a6a44';for(let wx=Math.floor(cam/8)*8-8;wx<cam+W+8;wx+=8){const h=(wx*7919)%53;if(h<14)g.fillRect(wx-cam,GROUND+6+(h%9),2,1);if(h>44)g.fillRect(wx-cam+3,GROUND+12+(h%5),1,1)}
 const FL=['#f2e8f0','#f0b4c8','#f0d478'];for(let wx=Math.floor(cam/16)*16-16;wx<cam+W+16;wx+=16){const h=(wx*104729)%97;if(h<20){g.fillStyle=FL[h%3];g.fillRect(wx-cam,GROUND-1,1,1)}}
 const t=target();
 // obstacles
 for(const o of R.obs){const x=o.x-cam;if(x<-70||x>W+10)continue;
  if(o.t==='gap'){g.fillStyle='#0b1033';g.fillRect(x,GROUND,o.w,H-GROUND);g.fillStyle='#1a2156';g.fillRect(x,GROUND,o.w,1);g.fillStyle='#4f7f48';g.fillRect(x-1,GROUND,1,H-GROUND);g.fillRect(x+o.w,GROUND,1,H-GROUND);
   for(let i=0;i<o.typed;i++){const px=x+2+i*PLANK;g.fillStyle='#2a1a12';g.fillRect(px,GROUND,PLANK,5);g.fillStyle='#b48c5c';g.fillRect(px,GROUND,PLANK-1,4);g.fillStyle='#e8c088';g.fillRect(px,GROUND,PLANK-1,1);g.fillStyle='#8a5a34';g.fillRect(px+2,GROUND+2,1,1);g.fillRect(px+6,GROUND+2,1,1)}
   const cx=x+o.w/2,act=o===t;[...o.word].forEach((c,i)=>{const kx=Math.round(cx+(i-(o.word.length-1)/2)*12-6);cap(c,kx,GROUND-30-(act&&i===o.typed?(Math.floor(R.t*6)%2):0),i<o.typed?2:act&&i===o.typed?1:0)});
  }else if(SEG[o.t]){SEG[o.t].draw(o,g,cam,o===t)}
  else if(!o.done||x>RX-60){g.drawImage(o.sp,x-1,GROUND-o.sp.height+1);if(!o.done&&!o.jt)cap(o.key,Math.round(x+o.w/2-6),GROUND-o.sp.height-16-(o===t?(Math.floor(R.t*6)%2):0),o===t?1:0)}}
 // gems
 R.gems.forEach(gm=>{if(gm.got)return;const x=gm.x-cam;if(x<-8||x>W+8)return;g.drawImage(GEM,x-3,gm.y-2+(Math.floor(R.t*3+gm.x)%2))});
 runHooks('drawWorld',g,cam);
 // Scrambler + cage
 const bx=R.bossX-cam;
 if(RUNNER.boss&&RUNNER.boss.draw&&R.phase!=='free'){RUNNER.boss.draw(g,cam)}
 else if(bx<W+50){
  if(R.phase!=='free'){
   // cage with Keylori
   const cx=bx+20,kw=R.KEY?R.KEY.width:24,kh=R.KEY?R.KEY.height:24,cw=kw+6,ch=kh+5;
   if(R.KEY)g.drawImage(R.KEY,cx+3,GROUND-kh-2);
   g.fillStyle='#3a3048';g.fillRect(cx,GROUND-ch-2,cw,2);g.fillRect(cx,GROUND-2,cw,2);g.fillStyle='#9a9ab0';for(let i=0;i<=cw;i+=4)g.fillRect(cx+Math.min(i,cw-1),GROUND-ch,1,ch-2);g.fillStyle='#6e5e88';g.fillRect(cx+1,GROUND-ch-2,cw-2,1);
   // villain
   if(R.VIL){const vw=R.VIL.width,vh=R.VIL.height,hop=R.laugh?(Math.floor(R.laugh*20)%2)*-2:0,hx=R.hitT?2:0;g.drawImage(R.hitT?R.VILF:R.VIL,bx-vw/2+hx+4,GROUND-vh+hop)}
  }else{
   // freed: Keylori hops to the hero
   const k=Math.min(1,R.free/1.2),kw=R.KEY?R.KEY.width:24,kh=R.KEY?R.KEY.height:24,x0=bx+23,x1=RX+10-0,kx=Math.round(x0+(x1-x0)*k),ky=GROUND-kh-2-Math.round(Math.abs(Math.sin(R.free*9))*10*(1-k*.5));
   if(R.KEY)g.drawImage(R.KEY,kx,ky);if(R.free>1.2){g.fillStyle='#ff6b9a';const hx=kx+kw/2,hy=ky-6-Math.round((R.free-1.2)*10);[[0,1],[1,0],[2,1],[3,0],[4,1],[1,2],[2,2],[3,2],[2,3],[0,1]].forEach(([a,b])=>g.fillRect(hx-2+a,hy+b,1,1))}
  }}
 // hero
 if(HERO){const hw=HERO.width,hh=HERO.height,step=R.phase==='run'&&!R.air&&R.speed>8?(Math.floor(R.t*10)%2):0,stun=R.stun>0?(Math.floor(R.t*30)%2):0;
  const hx=Math.round(RX-BW/2-hw/2)+stun,hy=Math.round(GROUND-hh-height())-step;g.drawImage(R.stun>0&&stun?HERO_W:HERO,hx,hy)}
 else{g.fillStyle='#f0c860';g.fillRect(RX-BW,GROUND-20-Math.round(height()),BW,20)}
 // lasers (straight, hard-edged)
 R.beams.forEach(b=>{const y=GROUND-16,x0=RX+2,x1=bx;const th=b.big?4:2;g.fillStyle=b.c;g.fillRect(x0,y-th/2,x1-x0,th);g.fillStyle='#ffffff';g.fillRect(x0,y-(b.big?1:0),x1-x0,b.big?2:1)});
 // particles
 R.parts.forEach(p=>{g.fillStyle=p.c;const s=p.l>.2?2:1;g.fillRect(Math.round(p.x),Math.round(p.y),s,s)});
 R.pops.forEach(p=>txt(g,p.s,p.x-cam,p.y,p.col,1,'c'));
 runHooks('drawTop',g,cam);
 g.setTransform(1,0,0,1,0,0);
 if(R.red){g.globalAlpha=Math.min(.35,R.red*2);g.fillStyle='#ff6b7a';g.fillRect(0,0,W,H);g.globalAlpha=1}
 // top bar: progress or Scrambler meter
 if(RUNNER.boss&&RUNNER.boss.drawHud&&(R.phase==='boss'||R.phase==='free')){RUNNER.boss.drawHud(g)}
 else if(R.phase==='boss'||R.phase==='free'){const left=1-R.pos/R.seq.length;txt(g,R.vname,W-6,4,'#ffffff',1,'r');g.fillStyle='#0b1033';g.fillRect(W-88,15,82,6);g.fillStyle='#3a2050';g.fillRect(W-87,16,80,4);g.fillStyle='#ff6b7a';g.fillRect(W-87,16,Math.round(80*left),4);
  txt(g,'FREE '+SPECIES[R.sp].n[0].toUpperCase()+'!',6,4,'#f0c860')}
 else{const p=Math.max(0,Math.min(1,(R.front-RX)/(R.bossX-46-RX)));g.fillStyle='#0b1033';g.fillRect(6,5,W-12,5);g.fillStyle='#1a2156';g.fillRect(7,6,W-14,3);g.fillStyle='#f0c860';g.fillRect(7,6,Math.round((W-14)*p),3);
  g.drawImage(GEM,W-40,13);txt(g,'x'+R.gemN,W-32,12,'#8ff0ff');}
 if(R.phase==='run'&&R.stun<=0&&R.speed<3&&!R.air&&t&&wantOf(t)){const ch=wantOf(t)[0];if(Math.floor(R.t*2)%2===0)txt(g,ch,RX-BW/2,GROUND-50,fc(ch),2,'c')}
}
function cap(ch,x,y,st){ // st 0 waiting · 1 next · 2 done
 const col=st===1?fc(ch):st===2?'#2a3270':'#e8ecff';g.fillStyle='#0b1033';g.fillRect(x-1,y-1,14,15);g.fillStyle=col;g.fillRect(x,y,12,13);g.fillStyle=st===1?'#ffffff':st===2?'#1a2156':'#ffffff';g.fillRect(x,y,12,1);
 g.fillStyle=st===1?'rgba(0,0,0,0)':'#c0c8f0';if(st===0)g.fillRect(x,y+12,12,1);txt(g,ch,x+2,y+3,st===2?'#4a5290':'#0b1033',1,'l',null)}

function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(typeof screen!=='undefined'&&screen==='runner'&&R){update(dt);draw()}raf=requestAnimationFrame(loop)}

/* ---------- keys: the runner owns the keyboard while it is on screen ---------- */
addEventListener('keydown',e=>{
 if(typeof screen==='undefined'||screen!=='runner'||!R)return;
 const m=document.getElementById('modal'),box=m&&!m.hidden&&m.querySelector('[data-runner]');
 if(m&&!m.hidden){if(box&&e.key===' '){e.preventDefault();e.stopImmediatePropagation();const b=box.querySelector('.rbtns .btn');b&&b.click()}return}
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(R.phase==='run'||R.phase==='boss'){R.paused=R.phase;R.phase='paused'}startModal();return}
 if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();e.stopImmediatePropagation();ACT.runSpd({v:Math.max(0,Math.min(4,opt.spd+(e.key==='ArrowUp'?1:-1)))});return}
 if(e.key===' '&&R.phase==='ready'){e.preventDefault();e.stopImmediatePropagation();go();return}
 if(e.key.length!==1)return;
 e.preventDefault();e.stopImmediatePropagation();key(e);
},true);

if(/^\/runner\/?/.test(location.pathname)){const start=()=>{(document.fonts?document.fonts.load('8px "Press Start 2P"'):Promise.resolve()).finally(()=>setTimeout(open,50))};document.readyState==='complete'?start():addEventListener('load',start)}
})();
