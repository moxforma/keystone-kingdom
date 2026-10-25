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
 get g(){return g},get HERO(){return HERO},get theme(){return thSync()},get THEMES(){return THEMES},themeFor:L=>themeFor(L),thSprite:i=>mkSpr(thSync(),i),

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

/* ---------- world themes: one look per world (tier 0 = meadow = the standalone look) ---------- */
const hsh=(a,b=0)=>{let n=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263))|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};
const SH={   // silhouette styles: x -> height above the ground (or [top,bottom] for floating shapes, null for nothing)
 hills:(b,a1,p1,a2,p2,ph1=0,ph2=0)=>x=>Math.round(b+a1*Math.sin(x/p1+ph1)+a2*Math.sin(x/p2+ph2)),
 peaks:(b,a,per,seed=1)=>x=>{const c=Math.floor(x/per),t=((x%per)+per)%per,k=.55+.45*hsh(c,seed),u=1-Math.abs(2*t/per-1);return Math.round(b+a*k*u)+((x*7)%11===0?1:0)},
 dunes:(b,a,per)=>x=>{const c=Math.floor(x/per),t=((x%per)+per)%per/per,k=.6+.4*hsh(c,5),u=t<.72?t/.72:(1-t)/.28;return Math.round(b+a*k*(1-(1-u)*(1-u)))},
 waves:(b,a,p,ph=0)=>x=>Math.round(b+a*(1-Math.abs(Math.sin(x/p+ph)))+((x%p>>0)%7===0?0:0)),
 spires:(b,a,cell,slope,seed=3)=>x=>{let h=b;const c0=Math.floor(x/cell);for(let c=c0-1;c<=c0+1;c++){const px=c*cell+hsh(c,seed)*(cell-4),ph=b+4+a*hsh(c,seed+1);h=Math.max(h,ph-Math.abs(x-px)*slope)}return Math.round(h)},
 blocks:(b,a,cell,seed=7)=>x=>{const c=Math.floor(x/cell),t=((x%cell)+cell)%cell,r=hsh(c,seed);let h=b+Math.floor(r*a);if(r>.8&&t>cell/2-2&&t<cell/2+1)h+=9;if(t%4===0&&r<.35)h-=1;return h},
 castle:(b,a,cell,seed=9)=>x=>{const c=Math.floor(x/cell),t=((x%cell)+cell)%cell,r=hsh(c,seed);let h=b+Math.floor(r*a);if(r>.55&&t>3&&t<cell-3)h+=8+((t>>1)&1?0:2);else if(t%4<2)h+=2;return h},
 gears:(b,r0,per,seed=11)=>x=>{const c0=Math.floor(x/per);let best=0;for(let c=c0-1;c<=c0+1;c++){const r=Math.round(r0*(.6+.6*hsh(c,seed))),cx=c*per+per/2+Math.round((hsh(c,seed+3)-.5)*per*.4),cy=Math.round(2+hsh(c,seed+2)*8),dx=x-cx;if(Math.abs(dx)>r+3)continue;const N=Math.max(8,Math.round(r*.7))&~1;
   for(let dy=r+3;dy>=0;dy--){const ang=Math.atan2(dy,dx),tooth=Math.floor(ang/(Math.PI*2/N)*2)&1,rad=r+(tooth?3:0);if(dx*dx+dy*dy<=rad*rad){if(dy+cy>best)best=dy+cy;break}}}
  return Math.max(best,b)},
 islands:(top,th,cell,seed=13,w0=16)=>x=>{const c=Math.floor(x/cell),cx=c*cell+hsh(c,seed)*(cell*.35)+cell*.3,hw=w0+hsh(c,seed+1)*10,dx=Math.abs(x-cx);if(dx>hw)return null;const t=Math.round(top+hsh(c,seed+2)*12),u=1-dx/hw;return[t+(dx<hw-3?0:-1),t-Math.round(3+th*u*u)]},
 bumps:(b,a,p)=>x=>Math.round(b+a*Math.abs(Math.sin(x/p)))
};
const STONE_M={o:'#1e1a2a',H:'#c8c8d8',L:'#9a9ab0',M:'#74748e',D:'#55556e',G:'#4f7f48',g:'#365f3c',Y:'#f0c860'};
const VINE_M={o:'#1e2a1a',d:'#365f3c',l:'#4f7f48',t:'#e8e0f0'};
const CLOUD_M={o:'#7a8ec0',H:'#ffffff',L:'#dfe8f4',b:'#f4f8ff',w:'#ffffff'};
const rowsOf=(a,b,c)=>[a,b,c];
/* sprite shapes (all 12 wide; rock 10 tall, stump 13, thorn 10 so hitboxes never change) */
const R_ROCK=["....oooo....","..ooLLHLoo..",".oLLLHHLLMo.",".oLLLLLLMMo.","oLLLLLLMMMMo","oMLLLLMMMMDo","oMMLLMMMMDDo","oMMMMMMMDDDo",".oDMMMMDDDo.","..oooooooo.."];
const R_STUMP=["..oooooooo..",".oRRRRRRRRo.",".oRrrRRrrRo.",".oRRRRRRRRo.",".oBbBBBbBBo.",".oBbBBBbBBo.",".oBbBBBbBDo.",".oBBBBbBBDo.",".oBbBBbBBDo.",".oBbBBBbBDo.","ooBbBBBbBDoo","oGGBBbBBDGGo","oooooooooooo"];
const R_THORN=[".....o......","....oPo..o..","..o.oPo.oPo.",".oPooPPooPo.",".oPPoPPoPPo.","oGPPPPPPPPGo","oGgGPPPPGgGo","oGgGgGGgGgGo","oGGgGgGgGGGo",".oooooooooo."];
const SP={
 coral:[
  ["....oooo....","..ooHHPPoo..",".oHPPpPPPpo.",".oPPpPPpPPDo","oPpPPPPPpPPo","oPPPpPPPPpDo","oPpPPpPPPPDo","oPPPPPPpPDDo",".oDPPPPPDDo.","..oooooooo.."],
  ["..o......o..",".oPo....oPo.",".oPo.oo.oPo.",".oPo.oPo.oPo".slice(0,12),"oPpoooPoooPo","oPpPPoPpPPPo",".oPpPPPpPDo.",".oPPpPPPPDo.","..oPPpPPDo..","..oPPpPPDo..","..oPPpPDDo..","..oDPPPDDo..","...oooooo..."],
  ["..o...o.....",".oPo.oPo.o..",".oPo.oPoopo.","oPpooPpoPpo.","oPpPoPpPPPDo","oPpPPPpPPDDo","oDpPPPPPPDDo","oDDPPpPPDDDo",".oDDPPPDDDo.","..oooooooo.."]],
 dunes:[
  ["....oooo....","..ooLLLLoo..",".oLLLHHLLMo.",".oLLLLLLMMo.","oLLLLLMMMMMo","oMLLLLMMMMDo","oMMLLMMMMDDo","oMMMMMMMDDDo",".oDMMMMDDDo.","..oooooooo.."],
  ["....oooo....","...oGLGo....","...oGLGo.oo.","oo.oGLGooGo.","oGooGLGoGLo.","oGLoGLGoGLo.",".oGLGLGGLo..","..ooGLGooo..","....oGLGo...","....oGLGo...","....oGDGo...","...ooGDGoo..","...ooooooo.."],
  [".....yo.....","....oyyo....","...oGLLGo...","..oGLGGLGo..",".oGLGLGGLGo.",".oGLGLGGLGo.",".oGLGLGGLGo.",".oGGGGGGGGo.","..oGGGGGGo..","...oooooo..."]],
 tundra:[
  ["....oooo....","..ooHHWHoo..",".oHHWWHHLLo.",".oHWHHHHLLo.","oHWHHHHLLLLo","oHHHHHLLLLBo","oHLLLLLLLBBo","oLLLLLLLBBBo",".oBLLLLBBBo.","..oooooooo.."],
  ["....oo......","...oWWo.....","..oWWGWo....","..oGWGGo....",".oWWWGWGo...",".oGWGGGDo...","oWWWGWGGDo..","oGGWGGGDDo..",".oooDDDoo...","oWWWGWGGDoo.","oGGGGGDDDDo.","ooooTTDoooo.","....TT......"],
  ["....o...o...","...oHo.oHo..","..oHLo.oHLo.",".oHLLooHLLo.","oHLLLoHLLLBo","oHLLLLLLLLBo","oHLLLLLLLBBo","oLLLLLLLBBBo",".oBLLLLLBBo.","..oooooooo.."]],
 glow:[
  ["....oooo....","..ooLLLLoo..",".oLLGLLLLMo.",".oLLLLLGLMo.","oLLLLLLLLMMo","oMLGLLLLMMMo","oMMLLLMMMGMo","oMMMMMMMMMDo",".oDMMMMMDDo.","..oooooooo.."],
  ["...oooooo...","..oCCCwCCo..",".oCCwCCCCCo.","oCCCCCCwCCDo","oCCwCCCCCCDo","ooooDDDDDooo","...oSSSSo...","...oSSSDo...","...oSSSDo...","...oSSSDo...","..oSSSSDDo..","..oSSSSDDo..","..ooooooooo."],
  ["...oooo.....","..oCCwCo.oo.",".oCwCCCCoCCo",".oCCCCCDoCwo",".ooooDDDooDo","..oSSo.oSSo.","..oSDo.oSDo.",".ooSDoooSDoo",".oSSSDoSSSDo",".ooooooooooo"]],
 gear:[
  ["....oooo....","..oLLHHLLo..",".oLLoooLLMo.","oLLoLLLoLMMo","oLLoLHLoLMMo","oLLoLLLoMMMo","oMLLoooLMMDo",".oMMMLMMMDo.","..oDMMMMDo..","...oooooo..."],
  ["..oooooooo..",".oLLLLLLLLo.",".oHHHHHHHHo.",".oMMMMMMMMo.",".oMLLLLLLMo.",".oMMMMMMMMo.",".oMMMMMMMDo.",".oMLLLLLMDo.",".oMMMMMMMDo.",".oMMMMMMMDo.",".oMLLLLLMDo.","ooMMMMMMMDoo","oooooooooooo"],
  ["...o....o...","..oLo..oLo..",".oLLo..oLLo.",".oLMoooLMMo.","oLLMLLLLMMMo","oLMMMLLMMMDo","oMMMMMMMMMDo","oMMMMMMMMDDo",".oDDMMMMDDo.","..oooooooo.."]],
 crys:[
  ["....oooo....","..ooHKKLoo..",".oHKKKLLLJo.",".oKKLLLLJJo.","oKKLLLLLJJJo","oKLLLLLLJJJo","oLLLLLLLJJDo","oLLLLLLJJDDo",".oDLLLLJDDo.","..oooooooo.."],
  ["....oo......","...oHKo.....","...oHKJo....","..oHKKJo.oo.","..oHKKJooHKo","..oHKLJoHKJo",".oHKLLJoHKJo",".oHKLLJJKKJo","oHKLLLJJKJJo","oHKLLLJJJJJo","oKLLLLJJJJDo","oLLLLLJJJDDo","oooooooooooo"],
  ["....o..o....","...oHo.oHo..","..oHKo.oKJo.","..oHKJooKJo.",".oHKKJoKKJo.",".oHKLJoKLJJo","oHKLLJoKLLJo","oKLLLJJLLLJo","oLLLLLJLLLDo",".oooooooooo."]],
 lava:[
  ["....oooo....","..ooLLLLoo..",".oLLLaLLMMo.",".oLLaaLLMMo.","oLLLLaLLMMMo","oMLLLLaaMMMo","oMMLaaLMMMDo","oMMMaMMMMDDo",".oDMMMMMDDo.","..oooooooo.."],
  R_STUMP,R_THORN]
};
const SPRK={};                                           // sprite cache keyed by theme + shape
function mkSpr(th,i){const k=th.id+'/'+i;if(SPRK[k])return SPRK[k];const s=th.spr,sh=(s.shape&&SP[s.shape])?SP[s.shape][i]:[R_ROCK,R_STUMP,R_THORN][i];return SPRK[k]=PX(sh,Object.assign({},s.base[i]))}
const BASE_SPR=[ROCK,STUMP,THORN];
const thSpr=sp=>{const i=OBS.indexOf(sp);if(i<0||!TH||TH.id===0)return sp;return mkSpr(TH,i)};
const CLK={};const thCloud=th=>CLK[th.id]||(CLK[th.id]=PX(["....oooo.....","..ooHHHHoo...",".oHHHHLLLLoo.","oHHLLLLLLLLLo",".ooooooooooo."],th.cl));
/* palettes for the three sprite kinds from a few colours */
const rk=(o,H,L,M,D)=>({o,H,L,M,D,G:'#4f7f48',g:'#365f3c'});
const sk=(o,R,r,B,b,D,G)=>({o,R,r,B,b,D,G});
const tk=(o,P,G,g)=>({o,P,G,g});
const THEMES=[
 {name:'Keyloria',id:0,
  sky:['#3b5fa0','#4a72b2','#5c88c2','#729ece','#8cb4d6','#a8c8dc','#c4dadc'],cl:CLOUD_M,amb:'cloud',ambFront:0,ac:[],
  A:{f:x=>Math.round(26+6*Math.sin(x/37)+4*Math.sin(x/13+1)),c:'#4a7a7a',e:'#2e5458'},
  B:{f:x=>Math.round(14+4*Math.sin(x/23+2)+3*Math.sin(x/9)),c:'#4f7f48',hi:'#7fae6a',sh:'#365f3c'},
  gnd:{t:'#62955a',th:'#a4c886',f:'#b48c5c',fh:'#d0ac78',sp:'#8a6a44'},gap:['#0b1033','#1a2156'],fl:['#f2e8f0','#f0b4c8','#f0d478'],
  stone:STONE_M,vine:VINE_M,
  spr:{base:[rk('#1e1a2a','#c8c8d8','#9a9ab0','#74748e','#55556e'),sk('#2a1a12','#e8c088','#b48c5c','#8a5a34','#6a4024','#54301a','#4f7f48'),tk('#1e2a1a','#e8e0f0','#4f7f48','#365f3c')]}},
 {name:'Whispering Woods',id:1,
  sky:['#2a4658','#35586a','#456c72','#58847a','#729c84','#8eb48e','#aac8a0'],cl:{o:'#5a7a78',H:'#d8ecd0',L:'#a8c8b0'},amb:'firefly',ambFront:1,ac:['#f6f0a0','#d8e870','#fffbd0'],
  A:{f:SH.peaks(18,22,26,2),c:'#2e4a3c',e:'#1e3430'},
  B:{f:SH.bumps(7,9,8),c:'#2e4a28',hi:'#6a8a4a',sh:'#22381e'},
  gnd:{t:'#3a5a30',th:'#6a8a4a',f:'#8a6a40',fh:'#a8885a',sp:'#5a4228'},gap:['#0a140c','#1c2c18'],fl:['#f6e08a','#f0b4c8','#ffffff'],
  stone:{o:'#14240f',H:'#9aa888',L:'#7a8a6a',M:'#5a6a52',D:'#3e4a3a',G:'#6a9a48',g:'#3e6a2e',Y:'#f0c860'},vine:{o:'#14240f',d:'#2e4a28',l:'#5a8a3e',t:'#f6e08a'},
  spr:{base:[rk('#14240f','#9aa888','#7a8a6a','#5a6a52','#3e4a3a'),sk('#1e1408','#c8a870','#8a6a40','#6a4a2a','#4a321c','#3a2414','#3e6a2e'),tk('#14240f','#d8a8c8','#3a6a34','#2a4a22')]}},
 {name:'Thunder Peaks',id:2,
  sky:['#262a48','#323a60','#424a72','#565e86','#6e7698','#8a90ac','#a6aabe'],cl:{o:'#3c4062',H:'#8a90b0',L:'#5e6488'},amb:'cloud',ambFront:0,ac:[],
  A:{f:SH.peaks(14,34,48,4),c:'#5a5a78',e:'#d8d4e8'},
  B:{f:SH.peaks(6,15,22,6),c:'#6e6878',hi:'#e0dce8',sh:'#4a4452'},
  gnd:{t:'#7a7484',th:'#c8c4d0',f:'#5a5462',fh:'#7a7484',sp:'#3a3440'},gap:['#0a0a1a','#2a2a50'],fl:['#eef0f6','#9ab8e8','#ffffff'],
  stone:{o:'#1e2030',H:'#e0e4f0',L:'#a8aec0',M:'#7a8098',D:'#565c74',G:'#c8d4e8',g:'#8a98b8',Y:'#f0c860'},vine:{o:'#1e2030',d:'#4a5478',l:'#7a88b0',t:'#f0e070'},
  spr:{base:[rk('#1e2030','#eef0f8','#b0b6c8','#8088a0','#5a607a'),sk('#2a2430','#d8dce8','#9a98ac','#6a6478','#4a4458','#3a3446','#c8d4e8'),tk('#1e2030','#fff3a0','#6a789a','#4a5878')]}},
 {name:'Coral Coast',id:3,shape:'coral',
  sky:['#4a78b8','#5c88c4','#6e98ce','#84aad8','#9cbce0','#b4d0ec','#cce0f0'],cl:{o:'#9aaccc',H:'#f2f4f6',L:'#cdd8e8'},amb:'bubble',ambFront:1,ac:['#ffffff','#c8f0f8','#58aaae'],
  A:{f:SH.waves(10,12,14,0),c:'#2e5c8c',e:'#6a9cc8'},
  B:{f:SH.waves(4,8,9,1.2),c:'#3e8ca4',hi:'#cfe8e8',sh:'#2e6e8c'},
  gnd:{t:'#e6efe8',th:'#ffffff',f:'#dcc08a',fh:'#ecd8a8',sp:'#c8a670'},gap:['#0e3a5c','#2e8ca4'],fl:['#d8885a','#e8d4c0','#c4785c'],
  stone:{o:'#5a2438',H:'#ffd0c0',L:'#f0a090',M:'#d07a78',D:'#a85468',G:'#48a89a',g:'#2e7a80',Y:'#f0c860'},vine:{o:'#14303a',d:'#2e7a70',l:'#48a89a',t:'#f8a8b8'},
  spr:{shape:'coral',base:[{o:'#5a2438',H:'#ffe0e0',P:'#f8a8b8',p:'#e0708a',D:'#b04a68'},{o:'#6a3018',P:'#f4a060',p:'#d07038',D:'#a04e28'},{o:'#3a1a50',P:'#c878e0',p:'#9a4cb8',D:'#6a2e88'}]}},
 {name:'Sunscorch Dunes',id:4,shape:'dunes',
  sky:['#5e88bc','#7298c4','#88a8c8','#a4b8c8','#c4c8c0','#dcd2b4','#ecdcb4'],cl:{o:'#b8a890',H:'#fff8e8',L:'#ecdcc0'},amb:'dust',ambFront:1,ac:['#ecd8a8','#fff0c8'],sun:'sun',
  A:{f:SH.dunes(14,28,110),c:'#b4826a',e:'#d0a080'},
  B:{f:SH.dunes(5,13,64),c:'#d6a464',hi:'#ecc890',sh:'#b8844e'},
  gnd:{t:'#d6a464',th:'#ecc890',f:'#dcae6c',fh:'#c8985a',sp:'#c4945a'},gap:['#3a2018','#7a4a30'],fl:['#c8a070','#e8d0a0','#a07858'],
  stone:{o:'#5a3a34',H:'#f0d4a0',L:'#e0b88a',M:'#c89c74',D:'#a07a5e',G:'#7ab06a',g:'#4e8a50',Y:'#f0c860'},vine:{o:'#24402e',d:'#3a6a42',l:'#4e8a50',t:'#e8c860'},
  spr:{shape:'dunes',base:[{o:'#5a3a34',H:'#f0d4a0',L:'#e0b88a',M:'#c89c74',D:'#a07a5e'},{o:'#24402e',G:'#4e8a50',L:'#7ab06a',D:'#3a6a42'},{o:'#24402e',G:'#4e8a50',L:'#7ab06a',y:'#e8c860'}]}},
 {name:'Frostfang Tundra',id:5,shape:'tundra',
  sky:['#18223c','#1e2a48','#263454','#304062','#3c4e70','#52668a','#7088a8'],cl:{o:'#5a6e94',H:'#d4e2ee',L:'#a4b8d0'},amb:'snow',ambFront:1,ac:['#ffffff','#d4e2ee'],
  A:{f:SH.peaks(12,30,52,8),c:'#7896ba',e:'#f6faff'},
  B:{f:SH.hills(8,3,26,2,10,1,0),c:'#b4cce2',hi:'#ffffff',sh:'#8aa6c6'},
  gnd:{t:'#d4e2ee',th:'#ffffff',f:'#9ec2dc',fh:'#c8e0f0',sp:'#b4c8dc'},gap:['#0a1428','#3a6a90'],fl:['#ffffff','#a4e6c0','#d8ecf8'],
  stone:{o:'#2a3448',H:'#ffffff',L:'#c8e0f0',M:'#9ec2dc',D:'#6a8cb4',G:'#f0f6fa',g:'#b4cce2',Y:'#f0c860'},vine:{o:'#2a3448',d:'#6a8cb4',l:'#b4dcf0',t:'#ffffff'},
  spr:{shape:'tundra',base:[{o:'#2a3448',H:'#ffffff',W:'#e8f4fc',L:'#b4dcf0',B:'#78aad4'},{o:'#16283a',W:'#f0f6fa',G:'#2e5a52',D:'#1e4040',T:'#4a3428'},{o:'#2e4a74',H:'#f4fbff',L:'#b4dcf0',B:'#78aad4'}]}},
 {name:'Glowcap Hollow',id:6,shape:'glow',
  sky:['#1c1a34','#241f3c','#2e2544','#3a2c4c','#463452','#523e58','#664a5c'],cl:{o:'#3a2c4c',H:'#8a7aa8',L:'#5e4e7c'},amb:'spore',ambFront:1,ac:['#eef4a0','#4ab8a8','#d0ec8a'],
  A:{f:SH.hills(22,8,17,6,7,0,1),c:'#2c2646',e:'#3e9a8e'},
  B:{f:SH.bumps(8,12,6.5),c:'#26404a',hi:'#8aa84a',sh:'#1a3034'},
  gnd:{t:'#466a3e',th:'#5a7e48',f:'#30462f',fh:'#3c4a36',sp:'#263a28'},gap:['#06100e','#2e7a7a'],fl:['#eef4a0','#4ab8a8','#c08a48'],
  stone:{o:'#1a1828',H:'#8a9a7e',L:'#6a7a5e',M:'#4a5a40',D:'#2e3a30',G:'#8aa84a',g:'#4ab8a8',Y:'#eef4a0'},vine:{o:'#16301e',d:'#2e7a7a',l:'#4ab8a8',t:'#d0ec8a'},
  spr:{shape:'glow',base:[{o:'#1a1828',L:'#6a7a6a',M:'#4a5a50',G:'#8aec9a',D:'#2e3a30'},{o:'#1a1828',C:'#4ab8a8',w:'#d8fff0',D:'#2e7a7a',S:'#d4cab2'},{o:'#1a1828',C:'#d0ec8a',w:'#ffffff',D:'#8aa84a',S:'#d4cab2'}]}},
 {name:'Cogwork City',id:7,shape:'gear',
  sky:['#2e2838','#3c3040','#4e3a46','#644a4c','#7e5c52','#9a7058','#b48a68'],cl:{o:'#5a4a52',H:'#c8b4aa',L:'#968288'},amb:'ember',ambFront:1,ac:['#f4d08a','#e09a48','#a0663a'],
  A:{f:SH.gears(5,18,58,11),c:'#4a3a42',e:'#c49a4a'},
  B:{f:SH.blocks(6,9,10,7),c:'#5e4438',hi:'#d8a860',sh:'#3a2622'},
  gnd:{t:'#a88058',th:'#c8a07a',f:'#7e5a44',fh:'#94704c',sp:'#4a3024'},gap:['#140a0a','#74502e'],fl:['#e8c878','#c49a4a','#e09a6a'],
  stone:{o:'#2a1a18',H:'#f4d890',L:'#d8a860',M:'#a87a44',D:'#74502e',G:'#e09a6a',g:'#b0704a',Y:'#fff0b0'},vine:{o:'#2a1a18',d:'#74502e',l:'#c49a4a',t:'#f4d890'},
  spr:{shape:'gear',base:[{o:'#2a1a18',H:'#f4e0a0',L:'#e8c878',M:'#c49a4a',D:'#94703a'},{o:'#2a1a18',H:'#e0a888',L:'#e09a6a',M:'#b0704a',D:'#7e4c38'},{o:'#2a1a18',L:'#e8c878',M:'#c49a4a',D:'#94703a'}]}},
 {name:'Skyreach Isles',id:8,
  sky:['#4e84c8','#5e92d0','#70a0d8','#84b0e0','#9cc0e6','#b4d0ec','#cce0f4'],cl:{o:'#8a7ab0',H:'#ffffff',L:'#f0ecfc'},amb:'cloud',ambFront:0,ac:[],
  A:{f:SH.islands(28,16,96,13,18),c:'#b4aadc',e:'#a8e0a0',under:'#8a7ab8'},
  B:{f:SH.bumps(6,10,7),c:'#f0ecfc',hi:'#ffffff',sh:'#c8c0e0'},
  gnd:{t:'#dcd6f6',th:'#ffffff',f:'#c8c0ec',fh:'#dcd6f6',sp:'#a8a0c8'},gap:['#3a4a88','#8a9ad0'],fl:['#ffd0e8','#ffffff','#f6e08a'],
  stone:{o:'#8a7ab0',H:'#ffffff',L:'#f0ecfc',M:'#d8d2ee',D:'#b0a8d0',G:'#ffd0e8',g:'#e8a8d0',Y:'#f0c860'},vine:{o:'#8a7ab0',d:'#c8a8e0',l:'#ffd0e8',t:'#ffffff'},
  spr:{base:[{o:'#8a7ab0',H:'#ffffff',L:'#f0ecfc',M:'#d8d2ee',D:'#b0a8d0',G:'#a8d8a0',g:'#78b878'},{o:'#8a6a30',R:'#fff0b0',r:'#e8c860',B:'#f0ecfc',b:'#d8d2ee',D:'#b0a8d0',G:'#a8d8a0'},{o:'#8a3a70',P:'#ffe8f4',G:'#e07ab8',g:'#b04a90'}]}},
 {name:'Starfall Citadel',id:9,shape:'crys',
  sky:['#0c0c20','#10122a','#141834','#1a1e40','#20264a','#2a2e5a','#383a70'],cl:{o:'#2e2e60',H:'#8a88c8',L:'#5a58a0'},amb:'star',ambFront:0,ac:['#ffffff','#f6e08a','#c8b8ff'],sun:'moon',
  A:{f:SH.castle(14,12,18,9),c:'#2e2c60',e:'#7a78c8'},
  B:{f:SH.hills(8,3,28,2,11,0,2),c:'#302e62',hi:'#6a68b8',sh:'#1e1c44'},
  gnd:{t:'#3e3c78',th:'#8a88d0',f:'#262450',fh:'#4e406e',sp:'#56549a'},gap:['#04040e','#3a2e8a'],fl:['#f6e08a','#ffffff','#c8b8ff'],
  stone:{o:'#0e0e24',H:'#9a98d8',L:'#6e6cb8',M:'#4e4c98',D:'#34327a',G:'#f6e08a',g:'#c8a838',Y:'#fff0a0'},vine:{o:'#0e0e24',d:'#4e4c98',l:'#9a98d8',t:'#f6e08a'},
  spr:{shape:'crys',base:[{o:'#0e0e24',H:'#e8e0ff',K:'#b8aaf0',L:'#8a7ad8',J:'#5a4ab0',D:'#3a2e80'},{o:'#0e0e24',H:'#fff8c8',K:'#f6e08a',L:'#d8b848',J:'#a08828',D:'#706018'},{o:'#0e0e24',H:'#e8e0ff',K:'#c8b8ff',L:'#9a8ae0',J:'#6a5ac0',D:'#4a3a90'}]}},
 {name:'Obsidian Rift',id:10,shape:'crys',
  sky:['#0a0818','#100c24','#161030','#1e163e','#281c4c','#34245c','#46306e'],cl:{o:'#241a44',H:'#6a5ab0',L:'#46388a'},amb:'spore',ambFront:1,ac:['#7fe8ff','#c8a8ff','#ffffff'],
  A:{f:SH.spires(10,34,22,2.2,3),c:'#2a2050',e:'#7a6ac0'},
  B:{f:SH.peaks(5,14,18,9),c:'#3e3270',hi:'#7fe8ff',sh:'#1e1640'},
  gnd:{t:'#3a3050',th:'#7fe8ff',f:'#241a3c',fh:'#5a4a78',sp:'#7a6ac0'},gap:['#020208','#5a3ac0'],fl:['#7fe8ff','#c8a8ff','#7fe8ff'],
  stone:{o:'#0a0818',H:'#9a8ae0',L:'#6a5ab0',M:'#463a82',D:'#2e2460',G:'#7fe8ff',g:'#3a9ab8',Y:'#c8a8ff'},vine:{o:'#0a0818',d:'#3e3270',l:'#7a6ac0',t:'#7fe8ff'},
  spr:{shape:'crys',base:[{o:'#0a0818',H:'#d8f8ff',K:'#7fe8ff',L:'#4a9ac8',J:'#2e5a98',D:'#1e3470'},{o:'#0a0818',H:'#f0e0ff',K:'#c8a8ff',L:'#9a6ae0',J:'#6a3ab0',D:'#40207a'},{o:'#0a0818',H:'#d8f8ff',K:'#7fe8ff',L:'#6a8ae0',J:'#4a5ab8',D:'#2e3480'}]}},
 {name:'Eclipse Throne',id:11,shape:'lava',
  sky:['#0e0614','#180a1c','#260e22','#3a1428','#541c2c','#782a30','#a04430'],cl:{o:'#2a1020',H:'#8a4a50',L:'#5a2a3c'},amb:'ember',ambFront:1,ac:['#ffe08a','#ff9a3a','#d0501e'],sun:'eclipse',
  A:{f:SH.blocks(10,18,12,21),c:'#2e1624',e:'#ff7a2a'},
  B:{f:SH.peaks(6,15,20,5),c:'#4a2a24',hi:'#ff9a3a',sh:'#2e1a1a'},
  gnd:{t:'#4a2a24',th:'#ff9a3a',f:'#2e1a1a',fh:'#5a342c',sp:'#d0501e'},gap:['#1a0404','#ff6a1a'],fl:['#ffb03a','#ff7a2a','#ffd84a'],
  stone:{o:'#1a0a0a',H:'#a86a50',L:'#7a4a3c',M:'#563428',D:'#3a2018',G:'#ff7a2a',g:'#c04a1a',Y:'#ffd84a'},vine:{o:'#1a0a0a',d:'#563428',l:'#ff7a2a',t:'#f0c860'},
  spr:{shape:'lava',base:[{o:'#1a0a0a',L:'#8a6662',M:'#6a4a48',D:'#4e3636',a:'#ff8a2a'},{o:'#1a0a0a',R:'#ff9a3a',r:'#d0501e',B:'#4a3030',b:'#322020',D:'#241616',G:'#ff7a2a'},{o:'#1a0a0a',P:'#ffd84a',G:'#5a342c',g:'#3a2020'}]}}
];
const THEME_KEYS={keyloria:0,meadow:0,woods:1,peaks:2,coral:3,dunes:4,tundra:5,glowcap:6,cogwork:7,skyreach:8,starfall:9,obsidian:10,eclipse:11};
function themeFor(L){let i=0;try{if(L&&L.theme!=null){i=typeof L.theme==='object'&&L.theme.id!=null?L.theme.id:(typeof L.theme==='string'?(THEME_KEYS[L.theme.toLowerCase()]|0):(+L.theme|0))}else if(L&&L.tier!=null)i=+L.tier|0}catch(e){}return THEMES[Math.max(0,Math.min(THEMES.length-1,i))]}
let TH=THEMES[0];
const thSync=()=>{const t=themeFor(R&&R.L);if(t!==TH){TH=t}return TH};
/* ---------- draw ---------- */
const SKY=THEMES[0].sky;
function drawSil(g,S,fo,cam0){   // one parallax silhouette layer
 const nb=S.B==null;
 for(let x=-4;x<W+4;x++){const v=S.f(x+fo);if(v==null)continue;
  if(Array.isArray(v)){const t=v[0],b=v[1];g.fillStyle=S.c;g.fillRect(x,GROUND-t,1,t-b);g.fillStyle=S.e;g.fillRect(x,GROUND-t,1,1);g.fillStyle=S.under||S.c;if(S.under)g.fillRect(x,GROUND-b-1,1,1);continue}
  const h=v;g.fillStyle=S.c;g.fillRect(x,GROUND-h,1,h);
  if(S.hi){const pv=S.f(x+fo-1);g.fillStyle=(pv!=null&&!Array.isArray(pv)&&pv<h)?S.sh:S.hi}else g.fillStyle=S.e;
  g.fillRect(x,GROUND-h,1,1)}
}
function drawSun(g,th,cam,t){
 const k=th.sun;if(!k)return;const cx=Math.round(236-((cam*.03)%400)),cy=k==='sun'?22:26;if(cx<-30||cx>W+30)return;
 const disc=(r,c)=>{g.fillStyle=c;for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(r*r+.5-y*y));g.fillRect(cx-w,cy+y,w*2+1,1)}};
 if(k==='sun'){disc(9,'#f0dca8');disc(7,'#fbeec8');disc(5,'#fff8e0')}
 else if(k==='moon'){disc(9,'#e8e4c8');disc(8,'#f6f2d8');g.fillStyle='#10122a';for(let y=-8;y<=8;y++){const w=Math.floor(Math.sqrt(64.5-y*y));g.fillRect(cx+4-w+3,cy+y,w*2+1,1)}g.fillStyle='#ffffff';g.fillRect(cx-5,cy-2,1,1)}
 else{ // eclipse: dark moon over a golden corona
  disc(13,'#7a3a1a');disc(12,'#c08a2a');disc(11,'#f0c860');for(let a=0;a<16;a++){const x=Math.round(cx+(16+(a%2)*2)*Math.cos(a*Math.PI/8)),y=Math.round(cy+(16+(a%2)*2)*Math.sin(a*Math.PI/8));g.fillStyle=a%2?'#f0c860':'#ffe08a';g.fillRect(x,y,1,1)}
  disc(10,'#08040e');g.fillStyle='#2a1020';g.fillRect(cx-6,cy-6,2,1)}
}
function drawAmb(g,th,cam,t){
 const k=th.amb,ac=th.ac,P=(x,y,c)=>{g.fillStyle=c;g.fillRect(x,y,1,1)},wrap=(v,m)=>((v%m)+m)%m;
 if(k==='cloud'){const cl=thCloud(th);[[20,10],[130,22],[240,8],[330,18]].forEach(([x,y])=>{const px=((x-Math.floor(cam*.1))%(W+60)+W+60)%(W+60)-40;g.drawImage(cl,px,y)});return}
 if(k==='star'){for(let i=0;i<46;i++){const x=wrap(Math.round(hsh(i,1)*(W+40)-cam*(.02+.03*(i%3))),W+40)-20,y=Math.floor(hsh(i,2)*70),tw=(Math.floor(t*1.5+i*3)%4);
   if(x<0||x>=W)continue;const c=ac[i%3];P(x,y,tw===0?'#4a4c88':c);if(i%7===0&&tw!==0){P(x-1,y,c);P(x+1,y,c);P(x,y-1,c);P(x,y+1,c)}}return}
 if(k==='ember'){for(let i=0;i<26;i++){const sp=7+(i%5)*3,pr=wrap(t*sp+hsh(i,3)*100,100)/100,y=Math.round(GROUND-4-pr*(GROUND-6)),x=wrap(Math.round(hsh(i,4)*(W+40)-cam*.3+4*Math.sin(t*1.3+i)),W+40)-20;
   if(x<0||x>=W)continue;P(x,y,ac[Math.min(2,Math.floor(pr*3))]);if(i%6===0&&pr<.5){P(x+1,y,ac[1])}}return}
 if(k==='snow'){for(let i=0;i<56;i++){const sp=9+(i%4)*5,y=Math.floor(wrap(t*sp+hsh(i,5)*130,GROUND+8))-4,x=wrap(Math.round(hsh(i,6)*(W+40)-cam*(.15+.1*(i%3))+5*Math.sin(t*.7+i)),W+40)-20;
   if(x<0||x>=W)continue;P(x,y,ac[i%2]);if(i%9===0){P(x+1,y,ac[0]);P(x,y+1,ac[0])}}return}
 if(k==='bubble'){for(let i=0;i<14;i++){const sp=9+(i%4)*4,pr=wrap(t*sp+hsh(i,7)*100,100)/100,y=Math.round(GROUND-2-pr*(GROUND-14)),x=wrap(Math.round(hsh(i,8)*(W+40)-cam*.35+3*Math.sin(t*1.1+i)),W+40)-20;
   if(x<0||x>=W)continue;if(i%3){P(x,y,ac[0]);P(x+1,y+1,ac[1]);P(x+1,y,ac[1])}else{g.fillStyle=ac[1];g.fillRect(x,y,3,1);g.fillRect(x,y+2,3,1);g.fillRect(x,y+1,1,1);g.fillRect(x+2,y+1,1,1);P(x+1,y,ac[0])}}return}
 if(k==='firefly'||k==='spore'){const rise=k==='spore';for(let i=0;i<22;i++){const x=wrap(Math.round(hsh(i,9)*(W+40)-cam*.4+6*Math.sin(t*.6+i*2)),W+40)-20,
   y=rise?Math.round(GROUND-6-wrap(t*(3+i%4)+hsh(i,10)*100,100)/100*(GROUND-20)):Math.round(30+hsh(i,10)*60+4*Math.sin(t*.8+i)),ph=Math.floor(t*1.6+i*5)%5;
   if(x<0||x>=W||ph===0)continue;const c=ac[i%3];P(x,y,c);if(ph>=3){P(x-1,y,ac[2]);P(x+1,y,ac[2]);P(x,y-1,ac[2]);P(x,y+1,ac[2]);P(x,y,'#ffffff')}}return}
 if(k==='dust'){for(let i=0;i<26;i++){const y=34+Math.floor(hsh(i,11)*64),x=wrap(Math.round(hsh(i,12)*(W+60)-t*(50+(i%4)*18)-cam*.9),W+60)-30;
   if(x<0||x>=W)continue;g.fillStyle=ac[i%2];g.fillRect(x,y,i%3?2:3,1)}return}
}
function draw(){
 const th=thSync(),cam=Math.round(R.cam),sx=R.shake?Math.round(rnd(-R.shake,R.shake)):0;g.setTransform(1,0,0,1,sx,0);
 // sky bands with dithered edges
 const SK=th.sky;SK.forEach((c,i)=>{g.fillStyle=c;g.fillRect(-4,i*12,W+8,12);if(i){g.fillStyle=SK[i-1];for(let x=-4;x<W+4;x+=2)g.fillRect(x+(i%2),i*12,1,1)}});g.fillStyle=SK[SK.length-1];g.fillRect(-4,84,W+8,20);
 drawSun(g,th,cam,R.t);
 if(!th.ambFront)drawAmb(g,th,cam,R.t);
 // far hills + near bushes (parallax, every pixel on the grid)
 const fa=Math.floor(cam*.25),fb=Math.floor(cam*.5);
 drawSil(g,th.A,fa);drawSil(g,th.B,fb);
 if(th.ambFront)drawAmb(g,th,cam,R.t);
 // ground
 const gd=th.gnd;g.fillStyle=gd.t;g.fillRect(-4,GROUND,W+8,3);g.fillStyle=gd.th;g.fillRect(-4,GROUND,W+8,1);
 g.fillStyle=gd.f;g.fillRect(-4,GROUND+3,W+8,H-GROUND);g.fillStyle=gd.fh;g.fillRect(-4,GROUND+3,W+8,1);
 g.fillStyle=gd.sp;for(let wx=Math.floor(cam/8)*8-8;wx<cam+W+8;wx+=8){const h=(wx*7919)%53;if(h<14)g.fillRect(wx-cam,GROUND+6+(h%9),2,1);if(h>44)g.fillRect(wx-cam+3,GROUND+12+(h%5),1,1)}
 const FL=th.fl;for(let wx=Math.floor(cam/16)*16-16;wx<cam+W+16;wx+=16){const h=(wx*104729)%97;if(h<20){g.fillStyle=FL[h%3];g.fillRect(wx-cam,GROUND-1,1,1)}}
 const t=target();
 // obstacles
 for(const o of R.obs){const x=o.x-cam;if(x<-70||x>W+10)continue;
  if(o.t==='gap'){g.fillStyle=th.gap[0];g.fillRect(x,GROUND,o.w,H-GROUND);g.fillStyle=th.gap[1];g.fillRect(x,GROUND,o.w,1);g.fillStyle=th.id?th.gnd.t:'#4f7f48';g.fillRect(x-1,GROUND,1,H-GROUND);g.fillRect(x+o.w,GROUND,1,H-GROUND);
   for(let i=0;i<o.typed;i++){const px=x+2+i*PLANK;g.fillStyle='#2a1a12';g.fillRect(px,GROUND,PLANK,5);g.fillStyle='#b48c5c';g.fillRect(px,GROUND,PLANK-1,4);g.fillStyle='#e8c088';g.fillRect(px,GROUND,PLANK-1,1);g.fillStyle='#8a5a34';g.fillRect(px+2,GROUND+2,1,1);g.fillRect(px+6,GROUND+2,1,1)}
   const cx=x+o.w/2,act=o===t;[...o.word].forEach((c,i)=>{const kx=Math.round(cx+(i-(o.word.length-1)/2)*12-6);cap(c,kx,GROUND-30-(act&&i===o.typed?(Math.floor(R.t*6)%2):0),i<o.typed?2:act&&i===o.typed?1:0)});
  }else if(SEG[o.t]){SEG[o.t].draw(o,g,cam,o===t)}
  else if(!o.done||x>RX-60){g.drawImage(thSpr(o.sp),x-1,GROUND-o.sp.height+1);if(!o.done&&!o.jt)cap(o.key,Math.round(x+o.w/2-6),GROUND-o.sp.height-16-(o===t?(Math.floor(R.t*6)%2):0),o===t?1:0)}}
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
