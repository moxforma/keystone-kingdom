/* runner-math.js: the MATH runner (Keyloria Run for the Math stream) + Math boss content.
   window.RUNNER_MATH = {cfg(i,s), bossCfg(i)} (called through KKS.runnerCfg / KKS.bossCfg by runner-lesson.js).
   HK.build (only when R.L.stream==='math') converts the typing obstacles in place:
     rock/fork -> 'mrock'   (problem on the keycap, one-digit answer jumps, timing exactly like a rock)
     gap       -> 'mbridge' (problem above the hole; the multi-digit answer builds the planks; too slow = the hero falls in)
     tall      -> a 'tall' with o.math (problem above the tower, one digit per storey; the keycaps show ? until typed)
     fork      -> stays a fork: two problems (HIGH = harder, with extra gems), each with a different 1-digit answer; the answer picks the path
     flap      -> stays a balloon section: every gap shows a short 1-digit problem; its digit flaps (repeatable like typing's flap)
     ambush    -> mini Scramblers throw blobs that carry a quick 1-digit problem (RUNNER.ambushProvider, see runner-action.js)
   The answer is never shown: the strip shows ? and the finger hint is cleared.
   Boss: RUNNER.bossContent (read by runner-boss.js when present) gives blobs and weak spots a short problem and turns the sentence spell into a chain / word problem. */
(function(){
if(!window.RUNNER)return;
try{
const RN=window.RUNNER,C=RN.C,GROUND=C.GROUND,RX=C.RX,BW=C.BW,PLANK=C.PLANK,GRAV=C.GRAV,JV=C.JV,HOP=C.HOP,HK=RN.HK,SEG=RN.SEG,ri=Math.round;
const DIG='0123456789';
const MA=()=>window.MATH;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const height=()=>-RN.R.y;
let runN=0;
const fmt=q=>String(q).replace(/−/g,'-').replace(/[□_]/g,'?');
const isMath=o=>!!o&&(o.t==='mrock'||o.t==='mbridge'||((o.t==='tall'||o.t==='fork'||o.t==='flap')&&o.math));

/* ---------- content ---------- */
const pure=p=>/^[\d\s+\-×x÷*\/=?().√]+$/.test(p.q)&&/[+\-×x÷*\/√=]/.test(p.q);
const good=p=>p&&/^\d+$/.test(String(p.a))&&p.topic!=='fallback'&&String(p.q).length<=13&&String(p.q).length>0;
const pr=p=>({q:fmt(p.q),a:String(p.a)});
function synth(t){   // tiny safety net, never needed when the lesson pool has problems
 if(t<=1){const a=rint(1,5),b=rint(0,4);return{q:a+' + '+b,a:String(a+b)}}
 if(t<=3){const a=rint(3,9),b=rint(1,a-1);return{q:a+' - '+b,a:String(a-b)}}
 const a=rint(2,3),b=rint(2,3);return{q:a+' x '+b,a:String(a*b)}}
function makePools(L){
 const m=MA(),out={rock:[],bridge:[],tower:[],boss:[],hard:[],pure:[],hardp:[]};if(!m)return out;
 const i=L.mathI|0,s=L.mathS==null?3:L.mathS,t=+L.tier||0,seed=(m.seedFor?m.seedFor(i,s,((window.S&&S.streams&&S.streams.math&&S.streams.math.rn)|0)):i*131+s)+(++runN)*977;
 let les=[];try{les=m.problems(i,s,L.mathBoss?100:90,seed).filter(good)}catch(e){console.warn('[runner-math]',e)}
 const fit=(arr,lo,hi)=>arr.filter(p=>String(p.a).length>=lo&&String(p.a).length<=hi).map(pr);
 out.rock=fit(les,1,1);out.bridge=fit(les,2,4);out.tower=fit(les,2,5);
 try{out.hard=fit(m.forRunner(Math.min(11,t+2),DIG,'rock',{count:60,seed:seed+99}).filter(good),1,1)}catch(e){out.hard=[]}   // the HIGH road of a fork: a tier or two harder
 const extra=(k,lo,hi,cnt)=>{try{return fit(m.forRunner(t,DIG,k,{count:cnt,seed:seed+k.length*7}).filter(good),lo,hi)}catch(e){return []}};
 // forks, balloon gaps and blobs show the problem alone (no picture or graph to look at): plain expressions only
 out.pure=out.rock.filter(pure);out.hardp=out.hard.filter(pure);
 if(out.pure.length<8)out.pure=out.pure.concat(extra('rock',1,1,80).filter(pure));
 if(out.hardp.length<8){try{out.hardp=out.hardp.concat(fit(m.forRunner(Math.min(11,t+2),DIG,'rock',{count:120,seed:seed+17}).filter(good),1,1).filter(pure))}catch(e){}}
 if(out.rock.length<6)out.rock=out.rock.concat(extra('rock',1,1,40));
 if(out.bridge.length<4&&t>=3)out.bridge=out.bridge.concat(extra('bridge',2,4,40));
 if(out.tower.length<4&&t>=3)out.tower=out.tower.concat(extra('tower',2,5,40));
 if(L.mathBoss){let bs=[];try{bs=m.problems(i,7,120,seed+5).filter(good)}catch(e){}
  out.boss=fit(bs,1,1);if(out.boss.length<8)out.boss=out.boss.concat(extra('rock',1,1,50));
  if(out.boss.length<4)out.boss=out.boss.concat(out.rock)}
 return out}

/* ---------- pixel helpers ---------- */
function sign(g,q,cx,y,st){   // problem sign, 15px tall box (y = top of the inner 13px)
 q=String(q);const w=q.length*8+6,x0=clamp(ri(cx-w/2),2,Math.max(2,C.W-w-2));
 g.fillStyle='#0b1033';g.fillRect(x0-1,y-1,w+2,15);g.fillStyle=st?'#f0c860':'#e8ecff';g.fillRect(x0,y,w,13);g.fillStyle='#ffffff';g.fillRect(x0,y,w,1);
 if(!st){g.fillStyle='#c0c8f0';g.fillRect(x0,y+12,w,1)}
 RN.txt(g,q,x0+3,y+3,'#0b1033',1,'l',null)}
function box(g,ch,x,y,st){   // answer box (same size as a keycap): 0 waiting, 1 current, 2 typed
 g.fillStyle='#0b1033';g.fillRect(x-1,y-1,14,15);g.fillStyle=st===1?'#f0c860':st===2?'#2a6a4a':'#e8ecff';g.fillRect(x,y,12,13);
 g.fillStyle=st===2?'#4de08a':'#ffffff';g.fillRect(x,y,12,1);
 RN.txt(g,ch,x+2,y+3,st===2?'#ffffff':'#0b1033',1,'l',null)}
function bonkAt(R,o,x){
 R.bonks++;R.streak=0;R.shake=3;R.stun=R.L.hard?.45:.25;R.kb=R.L.hard?-70:0;R.speed=0;R.front=x;R.cam=R.front-RX;
 if(R.air){R.air=false;R.y=0;R.vy=0}if(R.jt){R.jt.jt=false;R.jt=null}
 RN.popTxt('BONK!',o.x+o.w/2,GROUND-30,'#ff6b7a');RN.snd(120,.15,'square',.07);RN.burst(o.x-R.cam,GROUND-8,'#ffffff',6,40)}
function hit(R){R.hits++;R.typed++;R.streak++;R.best=Math.max(R.best,R.streak);try{sfx.ok(R.streak)}catch(e){}}

/* ---------- mrock ---------- */
SEG.mrock={
 want:()=>'',acc:o=>o.st==='wait'?o.a:'',smashable:o=>o.st==='wait',smash:o=>{o.st='done';o.done=true;o.jt=false},
 done:o=>o.st==='done',strip:()=>['?'],typed:o=>o.st!=='wait'?1:0,key(){},
 update(o){const R=RN.R;if(R.phase!=='run'||R.fall||o.st==='done')return;const back=R.front-BW;
  if(R.front>o.x+1&&back<o.x+o.w-1&&height()<o.h-2){bonkAt(R,o,o.x-(R.L.hard?3:10));o.st='wait';o.jt=false;RN.updStrip();return}
  if(o.st==='jump'){
   if(back>o.x+o.w){o.st='done';o.done=true;if(o.nice){R.nice++;R.gemN++;RN.popTxt('NICE!',o.x+o.w/2,GROUND-34,'#4de08a');RN.snd(988,.05,'square',.04);RN.snd(1319,.08,'square',.04,.05)}RN.updStrip()}
   else if(o.jt===false){o.st='wait';RN.updStrip()}}},
 block:o=>(o.st==='wait'&&!RN.R.L.hard)?o.x-10:null,
 draw(o,g,cam,isT){const R=RN.R,x=ri(o.x-cam);if(x<-40||x>C.W+10)return;
  const sp=RN.thSprite(o.spi);g.drawImage(sp,x-1,GROUND-sp.height+1);
  if(o.st==='wait'){const ky=GROUND-sp.height-17-(isT?(Math.floor(R.t*6)%2):0);sign(g,o.q,x+o.w/2,ky,isT)}}
};

/* ---------- mbridge ---------- */
const edgeOf=o=>o.x+2+o.typed*PLANK;
function doFall(o){const R=RN.R;
 R.fall={t:0,gp:o};R.falls++;R.streak=0;R.speed=0;R.kb=0;R.stun=0;R.shake=2;
 RN.popTxt('WHOOPS!',R.front-BW/2,GROUND-34,'#ff6b7a');
 for(let i=0;i<8;i++)RN.snd(1000-i*100,.07,'sine',.06,i*.05);
 RN.burst(R.front-BW/2-R.cam,GROUND,'#e8dcc0',5,30);o.wait=0;o.free=false;RN.updStrip()}
SEG.mbridge={
 want:()=>'',acc:(o,w)=>w?o.a:(o.a[o.typed]||''),done:o=>o.typed>=o.n,strip:o=>Array(o.n).fill('?'),typed:o=>o.typed,key(){},
 update(o,dt){const R=RN.R;if(R.phase!=='run')return;
  if(R.fall){o.wait=0;o.free=false;return}
  if(o.typed>=o.n)return;
  if(o.typed!==o.lt){o.lt=o.typed;o.wait=0;o.free=false}
  const edge=edgeOf(o);
  if(!R.air&&R.speed<10&&R.front-BW/2>=edge-6&&R.front<o.x+o.w+BW){      // waiting at the edge for the answer
   o.wait+=dt;if(o.wait>o.limit&&!o.free){o.free=true;RN.popTxt('QUICK!',o.x+o.w/2,GROUND-52,'#ffd84d')}}
  if(o.free&&!R.air&&R.front-BW/2>edge)doFall(o)},
 block:o=>(o.typed>=o.n||o.free)?null:edgeOf(o)+BW/2-1,
 draw(o,g,cam,isT){const R=RN.R,x=ri(o.x-cam),th=RN.theme||{};if(x<-70||x>C.W+10)return;
  const gp=th.gap||['#020208','#5a3ac0'];
  g.fillStyle=gp[0];g.fillRect(x,GROUND,o.w,C.H-GROUND);g.fillStyle=gp[1];g.fillRect(x,GROUND,o.w,1);g.fillStyle=th.id?th.gnd.t:'#4f7f48';g.fillRect(x-1,GROUND,1,C.H-GROUND);g.fillRect(x+o.w,GROUND,1,C.H-GROUND);
  for(let i=0;i<o.typed;i++){const px=x+2+i*PLANK;g.fillStyle='#2a1a12';g.fillRect(px,GROUND,PLANK,5);g.fillStyle='#b48c5c';g.fillRect(px,GROUND,PLANK-1,4);g.fillStyle='#e8c088';g.fillRect(px,GROUND,PLANK-1,1);g.fillStyle='#8a5a34';g.fillRect(px+2,GROUND+2,1,1);g.fillRect(px+6,GROUND+2,1,1)}
  if(o.typed>=o.n&&!(x>RX-60))return;
  const cx=x+o.w/2;
  if(o.typed<o.n){sign(g,o.q,cx,GROUND-48,isT);
   for(let i=0;i<o.n;i++){const kx=ri(cx+(i-(o.n-1)/2)*12-6);box(g,i<o.typed?o.a[i]:'?',kx,GROUND-30-(isT&&i===o.typed?(Math.floor(R.t*6)%2):0),i<o.typed?2:isT&&i===o.typed?1:0)}}}
};

/* ---------- math towers (wrap the 'tall' segment of runner-jumps.js) ---------- */
const T0=SEG.tall;
if(T0&&!T0._math){
 SEG.tall=Object.assign({},T0,{_math:1,
  want:o=>o.math?'':T0.want(o),
  acc:(o,w)=>o.math?(w?o.a:(o.k<o.n?o.a[o.k]:'')):(T0.acc?T0.acc(o,w):T0.want(o)),
  strip:o=>o.math?o.letters.map(()=>'?'):T0.strip(o),
  draw(o,g,cam,isT){
   if(!o.math)return T0.draw(o,g,cam,isT);
   const R=RN.R,x=o.x-cam;if(x<-34||x>C.W+4)return;
   const X=ri(x),top=GROUND-o.h,tw=RN.jumps&&RN.jumps.tower;if(!tw)return;
   g.drawImage(tw(o.h,o.kind),X,top);
   const act=isT&&(o.st==='wait'||o.st==='climb'||o.st==='slide');
   for(let i=0;i<o.n;i++){const kx=X+(i%2?15:1),ky=GROUND-(i*o.SH+15),st=i<o.k?2:(i===o.k&&act?1:0);box(g,i<o.k?o.letters[i]:'?',kx,ky-(st===1?Math.floor(R.t*6)%2:0),st)}
   if(o.k<o.n)sign(g,o.q,X+14,Math.max(25,top-17),act)}
 })}

/* ---------- forks and balloon sections (the segment types of runner-paths.js, with problems instead of keycaps) ---------- */
const F0=SEG.fork,P0=SEG.flap;
if(F0&&!F0._math){
 SEG.fork=Object.assign({},F0,{_math:1,
  want:o=>o.math?'':F0.want(o),
  acc:(o,w)=>o.math?F0.want(o):(F0.acc?F0.acc(o,w):F0.want(o)),
  strip:o=>o.math?['?','/','?']:F0.strip(o)})}
if(P0&&!P0._math){
 SEG.flap=Object.assign({},P0,{_math:1,
  want:o=>o.math?'':P0.want(o),
  acc:(o,w)=>o.math?P0.want(o):(P0.acc?P0.acc(o,w):P0.want(o)),
  strip:o=>o.math?o.letters.map(()=>'?'):P0.strip(o)})}
const accepts=(t,ch)=>t.t==='mrock'?(t.st==='wait'&&ch===t.a):t.t==='mbridge'?ch===t.a[t.typed]:t.t==='fork'?(t.st==='wait'&&(ch===t.hi||ch===t.lo)):t.t==='flap'?(ch===t.letters[t.k]||ch===t.letters[t.k+1]):(t.k<t.n&&ch===t.letters[t.k]);

/* ---------- keys ---------- */
HK.key.unshift(e=>{
 const R=RN.R;if(!R||R.phase!=='run'||!R.L||R.L.stream!=='math'||R.fall)return false;
 if(typeof e.key!=='string'||e.key.length!==1)return false;
 if(e.key===' ')return R.obs.some(f=>f.t==='flap'&&f.math&&f.st==='fly');          // Space = the charge blast (runner-action); while ballooning it is just ignored (no mistake)
 const ch=e.key;
 const fl=R.obs.find(f=>f.t==='flap'&&f.math&&f.st==='fly'&&f.k>=f.n);          // the last balloon digit pressed again: a free flap (runner-paths handles it)
 if(fl&&fl.pl&&ch===fl.pl&&R.t-fl.pt<1.2)return false;
 const t=RN.target();if(!isMath(t))return false;
 const A=RN.action&&RN.action.state();                                         // a blob's digit goes to the blob, unless the obstacle accepts it too
 if(/^\d$/.test(ch)&&A&&A.blobs&&A.blobs.some(z=>z.st==='in'&&z.ch===ch)&&!accepts(t,ch))return false;
 if(t.x-R.cam>C.W+4)return true;
 if(!/^\d$/.test(ch))return true;                                              // letters and symbols are simply ignored
 if(t.t==='flap')return false;                                                 // runner-paths: first press = hit, extra presses = free flaps
 if(t.t==='fork'){
  if(t.st!=='wait'||R.air)return true;
  if(ch===t.hi||ch===t.lo){hit(R);SEG.fork.key(t,ch)}else RN.miss();
  RN.updStrip();return true}
 if(t.t==='mrock'){
  if(R.air||t.st!=='wait')return true;
  if(ch===t.a){hit(R);t.st='jump';RN.jump(t)}else{RN.miss()}
  RN.updStrip();return true}
 if(t.t==='mbridge'){
  if(ch===t.a[t.typed]){hit(R);t.typed++;RN.snd(440+t.typed*50,.06,'square',.05);RN.burst(t.x+t.typed*PLANK-R.cam,GROUND+2,'#d0ac78',4,30);
   if(t.typed>=t.n){RN.popTxt('BRIDGE!',t.x+t.w/2,GROUND-34,'#f0c860');try{sfx.super()}catch(_){}}}
  else RN.miss();
  RN.updStrip();return true}
 // tower
 const want=(t.k<t.n&&(t.st==='wait'||t.st==='climb'||t.st==='slide'))?t.letters[t.k]:'';
 if(want&&ch===want){hit(R);T0.key(t,ch);RN.updStrip();return true}
 if(!want||t.letters.includes(ch))return true;
 RN.miss();RN.updStrip();return true});

/* ---------- per-frame: hide the answer in the strip and the finger hint ---------- */
let hintDirty=true;
HK.update.push(dt=>{
 const R=RN.R;if(!R||!R.L||R.L.stream!=='math')return false;
 try{
  const t=RN.target();
  if(isMath(t)){const el=document.getElementById('rhint');if(el&&(hintDirty||el.innerHTML!=='')){el.innerHTML='';hintDirty=false;try{setTarget(null)}catch(e){}}}
  const sp=document.getElementById('rstripIn');if(sp&&R.phase==='run'){const kids=sp.children;
   R.obs.forEach(o=>{if(!isMath(o)||o.si==null)return;
    let arr,ty;
    if(o.t==='mrock'){arr=[o.a];ty=o.st!=='wait'?1:0}else if(o.t==='mbridge'){arr=[...o.a];ty=o.typed}
    else if(o.t==='fork'){arr=[o.hi,'/',o.lo];ty=o.st!=='wait'?3:0}else{arr=o.letters;ty=o.k}
    for(let j=0;j<arr.length;j++){const el=kids[o.si+j];if(!el)continue;const want=arr[j]==='/'?'/':(j<ty?arr[j]:'?');if(el.textContent!==want)el.textContent=want}})}
 }catch(e){}
 return false});

/* ---------- build ---------- */
function build(R){
 const L=R.L,P=L.mathPools=makePools(L),used={},tier=+L.tier||0;
 const take=(kind,len)=>{const all=P[kind]||[];let c=all.filter(p=>(!len||p.a.length===len)&&!used[p.q]);if(!c.length)c=all.filter(p=>!len||p.a.length===len);if(!c.length)return null;const p=RN.pick(c);used[p.q]=1;return p};
 const mkRock=(o)=>{const p=take('rock')||synth(tier),h=o.h||9;return{t:'mrock',x:o.x,w:Math.min(o.w||10,12),h,spi:h>=12?1:RN.pick([0,2]),st:'wait',q:p.q,a:p.a,jt:false}};
const takeNot=(kind,not)=>{const all=P[kind]||[];let c=all.filter(p=>p.a.length===1&&!not.includes(p.a)&&!used[p.q]);if(!c.length)c=all.filter(p=>p.a.length===1&&!not.includes(p.a));
  if(!c.length){let q=synth(tier),k=0;while(not.includes(q.a)&&k++<30)q=synth(tier);return q}
  const p=RN.pick(c);used[p.q]=1;return p};
 // FORK: LOW = a problem of this lesson, HIGH = a harder one (a tier or two up) with a second row of gems; the two answers always differ
 const behind=o=>{const t=RN.target();return !!t&&t!==o&&t.t==='fork'&&t.st==='wait'&&Math.abs(t.x-o.x)<140};   // a second fork right behind the current one: its wide signs wait until the first is done
 const mkFork=o=>{
  const lo=takeNot('pure',[]),hi=takeNot((P.hardp&&P.hardp.length>=3)?'hardp':'pure',[lo.a]);
  o.math=1;o.lo=lo.a;o.hi=hi.a;o.ql=lo.q;o.qh=hi.q;
  o.cap=(k,ch,x,y,st)=>{if(!st&&behind(o))return;sign(RN.g,k==='hi'?o.qh:o.ql,x+6,y,!!st)};
  const n=Math.floor((o.LW-24)/12);for(let j=0;j<n;j++)R.gems.push({x:o.x+o.p0+12+j*12,y:GROUND-40-19,got:0})};
 // FLAP: every gap of the balloon section has its own problem; neighbours never share an answer (the "next / previous digit" presses stay unambiguous)
 const mkFlap=o=>{
  const ans=[],qs=[];for(let i=0;i<o.n;i++){const p=takeNot('pure',i?[ans[i-1]]:[]);ans.push(p.a);qs.push(p.q)}
  o.math=1;o.letters=ans;o.qs=qs;o.cap=(k,ch,x,y,st)=>sign(RN.g,o.qs[k],x+6,y,!!st)};
 const list=[];
 R.obs.forEach(o=>{
  if(o.t==='rock'||o.t==='gap'){list.push(mkRock(o.t==='gap'?{x:o.x,w:10,h:9}:o))}
  else if(o.t==='fork'){mkFork(o);list.push(o)}
  else if(o.t==='flap'){mkFlap(o);list.push(o)}
  else if(o.t==='tall'){
   const p=take('tower',o.n);
   if(p){o.letters=[...p.a];o.math=1;o.q=p.q;o.a=p.a;o.word=null;R.gems=R.gems.filter(g=>g.tw!==o);list.push(o)}   // (the bonus gems over the top would sit on the problem sign)
   else{R.gems=R.gems.filter(g=>g.tw!==o);list.push(mkRock({x:o.x,w:10,h:9}))}}
  else list.push(o)});
 R.obs.length=0;list.forEach(o=>R.obs.push(o));R.obs.sort((a,b)=>a.x-b.x);
 // bridges: some rocks become a hole with planks to build
 const shiftAll=(o,ex)=>{R.obs.forEach(q=>{if(q!==o&&q.x>o.x)q.x+=ex});R.gems.forEach(g=>{if(g.x>o.x+2)g.x+=ex});R.bossX+=ex;
  try{const a=RN.action&&RN.action.state();if(a&&a.plan)a.plan=a.plan.map(X=>X>o.x?X+ex:X)}catch(e){}};
 const nearPlan=o=>{try{const a=RN.action.state();return !!(a&&a.plan.some(X=>X>o.x-170&&X<o.x+200))}catch(e){return false}};   // keep ambushes away from holes (same rule as okAt)
 const toBridge=(i)=>{const o=R.obs[i],p=take('bridge');if(!p)return false;
  const n=p.a.length,bw=n*PLANK+4;
  R.gems=R.gems.filter(g=>!(g.x>=o.x-14&&g.x<=o.x+o.w+14&&g.y>=GROUND-41&&g.y<=GROUND-31));
  const b={t:'mbridge',x:o.x,w:bw,h:0,n,typed:0,q:p.q,a:p.a,wait:0,free:false,lt:0,limit:Math.max(7,16-tier)+n*1.5};
  shiftAll(o,bw-o.w);R.obs[i]=b;return true};
 if(!L.hybrid&&!L.mathBoss){
  const prob=Math.min(.4,.2+.02*tier);let last=-9,made=0;
  for(let i=2;i<R.obs.length-1;i++){const o=R.obs[i];if(o.t!=='mrock'||i-last<3||Math.random()>prob||nearPlan(o))continue;if(toBridge(i)){last=i;made++}}
  if(!made&&tier>=1&&R.obs.length>=6){for(let i=Math.floor(R.obs.length/2);i<R.obs.length-1;i++)if(R.obs[i].t==='mrock'&&!nearPlan(R.obs[i])&&toBridge(i))break}}
 R.obs.sort((a,b)=>a.x-b.x);
 RN.ambushProvider=BA;   // ambushes stay (planned by runner-action): their blobs carry a quick problem
 hintDirty=true;
 try{setTimeout(()=>{const p=document.querySelector('[data-runner="start"] p');if(p&&/Type the letter/.test(p.textContent))p.textContent='Solve it to jump!'},0)}catch(e){}
}
HK.build.push(R=>{
 try{
  if(R.L&&R.L.stream==='math'){RN.bossContent=BC;build(R)}
  else{if(RN.bossContent===BC)RN.bossContent=null;if(RN.ambushProvider===BA)RN.ambushProvider=null}
 }catch(e){console.error('[runner-math build]',e)}});

/* ---------- ambush blobs: a quick problem with a 1-digit answer ---------- */
let blobRecent=[];
function blobSynth(d,t){
 const o=[],r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
 {const a=r(0,d);o.push(a+' + '+(d-a))}
 {const mx=t>=2?9:Math.min(9,d+4),b=r(1,Math.max(1,mx-d+(t>=2?5:0)));o.push((d+b)+' - '+b)}
 if(t>=3)for(let a=2;a<=9;a++)if(d%a===0&&d/a>=2&&d/a<=9)o.push(a+' x '+(d/a));
 return{q:o[Math.floor(Math.random()*o.length)],a:String(d)}}
const BA={
 pick(sel){
  const R=RN.R,L=R&&R.L,t=(L&&+L.tier)||0,P=(L&&L.mathPools)||{};
  const pool=(P.pure||[]).filter(p=>p.q.length<=9&&!blobRecent.includes(p.q)).map(p=>({ch:p.a,q:p.q}));
  let it=pool.length?sel(pool,c=>c.ch):null;
  if(!it){const syn=[];for(let d=0;d<=9;d++)syn.push(blobSynth(d,t));it=sel(syn.map(p=>({ch:p.a,q:p.q})),c=>c.ch)}
  if(it){blobRecent.push(it.q);if(blobRecent.length>6)blobRecent.shift()}
  return it},
 draw(g,it,cx,y,cur,t,idx){sign(g,it.q,cx,y-(idx>0?16:0),cur)}};   // idx: the second blob's sign sits higher so two wide signs never overlap

/* ---------- boss content provider ---------- */
let recent=[],spellN=0;
function bossPick(avoid){
 const R=RN.R,P=(R&&R.L&&R.L.mathPools&&R.L.mathPools.boss)||[];
 let c=P.filter(p=>!avoid.includes(p.a)&&!recent.includes(p.q));
 if(!c.length)c=P.filter(p=>!avoid.includes(p.a));
 if(!c.length){const t=(R&&R.L&&+R.L.tier)||0;let p=synth(t),k=0;while(avoid.includes(p.a)&&k++<20)p=synth(t);return{ch:p.a,q:p.q}}
 const p=RN.pick(c);recent.push(p.q);if(recent.length>6)recent.shift();return{ch:p.a,q:p.q}}
const BC={
 blob:avoid=>bossPick(avoid),
 spot:avoid=>bossPick(avoid),
 cap(g,ch,q,x,y,st,side){const w=String(q).length*8+6,cx=x+6+(side?side*Math.max(0,w/2-8):0);sign(g,q,cx,y,st)},
 spell(b,final){
  const m=MA(),R=RN.R,L=R.L,t=b.tier,w=clamp(t+1,1,12),seed=(L.mathSeed||0)+(++spellN)*131+rint(0,9999);let steps=null,word=false;
  try{
   if(m&&!final&&t>=2&&Math.random()<.5){for(let k=0;k<6&&!steps;k++){const x=m.word(w,seed+k);if(x&&/^\d{1,5}$/.test(String(x.a))&&String(x.q).length<=70){steps=[{q:fmt(x.q),a:String(x.a)}];word=true}}}
   if(!steps&&m){const len=final?(t>=8?4:3):(t<2?2:3);const st=m.chain(w,seed,len).steps.map(s=>({q:fmt(s.q),a:String(s.a)}));if(st.every(s=>/^\d+$/.test(s.a))&&st.reduce((n,s)=>n+s.a.length,0)<=14)steps=st}
  }catch(e){console.warn('[runner-math spell]',e)}
  if(!steps){const a=rint(2,9),c=rint(2,9);steps=[{q:a+' + '+c,a:String(a+c)}]}
  const txt=steps.map(s=>s.a).join('');
  const lim=(6+steps.length*3.5+txt.length*1.1+(word?5:0))*(1.4-.05*Math.min(11,t));
  return{txt,lim,steps,word}},
 banner(g,b,s){   // the spell scroll: the current step's problem + answer boxes + timer
  const mc=s.math,steps=mc.steps,t=b.t;let start=0,k=0;
  for(;k<steps.length-1&&s.i>=start+steps[k].a.length;k++)start+=steps[k].a.length;
  const st=steps[k],q=st.q+' = ?',d=st.a.length,typed=s.i-start;
  let lines=[q];if(q.length>34){const mid=q.lastIndexOf(' ',Math.ceil(q.length/2));lines=[q.slice(0,mid),q.slice(mid+1)]}
  const sc=lines.length===1&&q.length<=12?2:1,x0=6,bw=C.W-12,y0=22,lh=9*sc+3,bh=lines.length*lh+13+17,pop=Math.min(1,b.mt/.25),yy=y0-ri((1-pop)*30);
  g.fillStyle='#0b1033';g.fillRect(x0-3,yy-1,bw+6,bh+2);
  g.fillStyle=s.final?'#5a1830':'#2a1a4a';g.fillRect(x0-2,yy,bw+4,bh);
  g.fillStyle=s.final?'#ff6b7a':'#f0c860';g.fillRect(x0-2,yy,bw+4,1);g.fillRect(x0-2,yy+bh-1,bw+4,1);g.fillRect(x0-2,yy,1,bh);g.fillRect(x0+bw+1,yy,1,bh);
  g.fillStyle='#0b1033';g.fillRect(x0,yy+2,bw,bh-4);
  lines.forEach((ln,j)=>{const lw=ln.length*8*sc;RN.txt(g,ln,ri(x0+(bw-lw)/2),yy+5+j*lh,'#e6dcff',sc,'l','#000000')});
  const by=yy+5+lines.length*lh,bx0=ri(x0+bw/2-d*7);
  for(let i=0;i<d;i++)box(g,i<typed?st.a[i]:'?',bx0+i*14,by,i<typed?2:i===typed?(Math.floor(t*6)%2?1:0):0);
  if(steps.length>1)for(let j=0;j<steps.length;j++){g.fillStyle=j<k?'#4de08a':j===k?'#f0c860':'#39427e';g.fillRect(x0+bw-8-(steps.length-1-j)*6,yy+5,4,4)}
  const kk=Math.max(0,1-s.t/s.lim),low=kk<.25;
  g.fillStyle='#0b1033';g.fillRect(x0,yy+bh-5,bw,3);g.fillStyle=low&&Math.floor(t*8)%2?'#ffffff':low?'#ff4a4a':'#8ff0ff';g.fillRect(x0+1,yy+bh-4,ri((bw-2)*kk),1)}
};
// pools for the boss are built with the run (see makePools); expose them to the provider
HK.build.push(R=>{try{if(R.L&&R.L.stream==='math'&&R.L.mathBoss){recent=[]}}catch(e){console.error('[runner-math boss pools]',e)}});

/* ---------- cfg ---------- */
function tierOf(i){try{return window.runnerTierOf?runnerTierOf(i):0}catch(e){return 0}}
function cfg(i,s){
 if(!MA())return null;
 const t=tierOf(i),lv=t<=1?0:t<=3?1:t<=5?2:t<=8?3:4;
 return{stream:'math',keys:DIG,favor:'',wfav:0,words:0,caps:0,n:8+((s||0)>>1)+Math.floor(t*.5),v:Math.round(54*(1+.05*t)),lv,tier:t,gapMul:1,mathI:i,mathS:s,partS:s}}
function bossCfg(i){
 if(!MA())return null;
 const t=tierOf(i);
 return{stream:'math',keys:DIG,favor:'',wfav:0,words:0,caps:0,n:4+Math.floor(t/3),v:Math.round(54*(1+.05*t)),lv:0,tier:t,mathI:i,mathS:7,mathBoss:1,mathSeed:(MA().seedFor?MA().seedFor(i,7,0):i)}}
window.RUNNER_MATH={cfg,bossCfg,BC};
}catch(e){console.error('[runner-math]',e)}
})();
