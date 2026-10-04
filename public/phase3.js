/* Collection hooks (world rewards, trophy shelf, friendship) + Grown-up feature switches */
(function(){
/* ---------- grown-up switches ---------- */
const PAR=[['arcade','Arcade games'],['closet','Hero Closet and outfits'],['fx','Catch and evolve animations'],['story','Story cutscenes'],['visitor','Daily visitor'],['streak','Streak rewards'],['roam','Keylori walking on the menu'],['rarity','Rare Keylori glow'],['trophies','Trophy shelf'],['friends','Friendship levels'],['challenge','Share and challenge links']];
/* a feature is on unless this player's grown-up OR their class teacher turned it off */
const par=k=>!(S.par&&S.par[k]===0)&&!(window.CLS_LOCK&&window.CLS_LOCK[k]===0);window.parOn=par;window.PAR_LIST=PAR;
/* worlds moved: quietly credit shards already earned */
function creditShards(){try{if(!S.story||typeof shardWon!=='function')return;const st=storyState();for(let w=1;w<=10;w++)if(shardWon(w)&&!st.shard[w]){st.shard[w]=1;st.intro[w]=1;st.taunt[w]=1}}catch(e){}}
function applyPar(){creditShards();document.body.classList.toggle('little',!!(S&&S.little));const b=document.body;PAR.forEach(([k])=>b.classList.toggle('no-'+k,!par(k)))}
window.applyPar=applyPar;
const _ld=load;load=function(){const r=_ld.apply(this,arguments);applyPar();return r};applyPar();
const _show=show;show=function(id){if((id==='arcade'&&!par('arcade'))||(id==='shop'&&!par('closet')))id='home';const r=_show.call(this,id);applyPar();return r};
if(typeof catchAnim==='function'){const _ca=catchAnim;catchAnim=function(done){if(!par('fx')){done&&done();return}return _ca.apply(this,arguments)}}
if(typeof evolveAnim==='function'){const _ea=evolveAnim;evolveAnim=function(i,from,to,done){if(!par('fx')){done&&done();return}return _ea.apply(this,arguments)}}
if(typeof levelUpFX==='function'){const _lu=levelUpFX;levelUpFX=function(L,done){if(!par('fx')){done&&done();return}return _lu.apply(this,arguments)}}
if(typeof cutscene==='function'){const _cut=cutscene;cutscene=function(w,lines,kind,done){if(!par('story')){done&&done();return}return _cut.apply(this,arguments)}}

let GATE=null;
ACT.parGate=()=>{const a=6+Math.floor(Math.random()*4),b=3+Math.floor(Math.random()*7);GATE=a*b;
 modal(`<h2>GROWN-UPS ONLY</h2><div class="pgatebox"><p class="pgq">What is ${a} × ${b}?</p><input id="pgate" class="pgin" inputmode="numeric" autocomplete="off" maxlength="3" aria-label="Answer"></div>
 <div class="rbtns"><button class="btn" data-act="parCheck">OK</button><button class="btn alt" data-act="settings">BACK</button></div>`);setTimeout(()=>$('#pgate')?.focus(),50)};
ACT.parCheck=()=>{const v=+($('#pgate')?.value||0);if(v!==GATE){sfx.bad&&sfx.bad();toast('Not quite. Ask a grown-up!');return ACT.settings()}parPanel()};
function parPanel(){S.par=S.par||{};
 const cls=window.CLS_LOCK&&Object.values(window.CLS_LOCK).some(v=>v===0);
 modal(`<h2>GROWN-UP SETTINGS</h2><p class="muted" style="margin:0">Turn features on or off for ${esc(S.name||'this player')}.</p>
 <div class="setrow focusrow"><span>Focus mode<small class="muted" style="display:block;font-size:16px">Typing lessons only: turns every extra below off</small></span><div class="seg"><button data-act="parFocus" data-v="1">ALL OFF</button><button data-act="parFocus" data-v="0">ALL ON</button></div></div>${cls?'<p class="muted" style="margin:4px 0">Some features are turned off by your class teacher.</p>':''}
 ${PAR.map(([k,t])=>`<div class="setrow"><span>${t}</span><div class="seg"><button class="${par(k)?'on':''}" data-act="parSet" data-k="${k}" data-v="1">ON</button><button class="${par(k)?'':'on'}" data-act="parSet" data-k="${k}" data-v="0">OFF</button></div></div>`).join('')}
 <div class="rbtns"><button class="btn" data-act="parDone">DONE</button></div>`)}
ACT.parLittle=d=>{setLittle(d.v==='1');save();applyPar();parPanel()};
ACT.parFocus=d=>{S.par=S.par||{};PAR.forEach(([k])=>S.par[k]=d.v==='1'?0:1);save();applyPar();parPanel()};
ACT.parSet=d=>{S.par=S.par||{};S.par[d.k]=+d.v;save();applyPar();parPanel()};
ACT.parDone=()=>{closeModal();try{({home:renderHome,binder:renderBinder,map:renderMap}[screen]||(()=>{}))()}catch(e){}};
const _set=ACT.settings;ACT.settings=function(){_set.apply(this,arguments);const box=$('#modal .mbox')||$('#modal');const done=box&&[...box.querySelectorAll('[data-act=close]')].pop();
 if(done&&!box.querySelector('[data-act=parGate]'))done.insertAdjacentHTML('beforebegin','<div class="setrow parrow"><span>Grown-up settings<small class="muted" style="display:block;font-size:16px">Turn features on or off</small></span><button class="btn sm volt" data-act="parGate">OPEN</button></div>')};

/* ---------- friendship ---------- */
const LIKE={Leaf:'sunny meadows',Aqua:'splashing in puddles',Spark:'zapping static off socks',Rock:'collecting shiny pebbles',Flame:'toasting marshmallows',Crystal:'counting its own sparkles',Shadow:'playing hide and seek',Sky:'racing the clouds',Frost:'making snow angels',Star:'wishing on shooting stars',Bug:'humming along with bees',Ghost:'saying BOO very quietly',Metal:'polishing its armor',Sand:'building sand castles',Candy:'sharing sweets',Storm:'drumming along with thunder',Ocean:'surfing big waves',Magma:'napping somewhere warm',Aurora:'dancing with the northern lights',Legend:'old tales of heroes'};
const CHEER=['Go, go, go!','You have got this!','Fingers of lightning!','Keep it up, hero!','Type like the wind!'];
const FT=[0,3,8,14,20];
const fpts=i=>lessonPts(i)+2*((S.petc||{})[i]||0);
const flvl=i=>FT.filter(t=>fpts(i)>=t).length;
window.friendLevel=flvl;
function stories(i,lv){const sp=SPECIES[i],n=sp.n[0],out=[];
 if(lv>=3)out.push(`${n} told you a secret: it loves ${LIKE[sp.t]||'adventures with you'}.`);
 if(lv>=5)out.push(`${n} says you are its best friend. Every time you type, it cheers: “${CHEER[i%CHEER.length]}”`);return out}
const hearts=lv=>`<span class="hearts">${[1,2,3,4,5].map(k=>`<i class="${k<=lv?'on':''}">♥</i>`).join('')}</span>`;
const _card=ACT.card;ACT.card=function(d){_card.apply(this,arguments);if(!par('friends'))return;const i=+d.k.split('-')[0],box=$('#mbox');if(!box||box.querySelector('.friendbox'))return;
 const lv=flvl(i),st=stories(i,lv),nx=FT[lv];
 const html=`<div class="friendbox"><div class="fb-top"><b>FRIENDSHIP</b>${hearts(lv)}</div>${st.map(s=>`<p class="fstory">${esc(s)}</p>`).join('')}${nx!=null?`<small class="muted">${nx-fpts(i)} more stars or play times to reach level ${lv+1}${lv+1===3||lv+1===5?' and unlock a story':''}.</small>`:'<small class="muted">Best friends forever!</small>'}</div>`;
 const rb=box.querySelector('.rbtns');rb?rb.insertAdjacentHTML('beforebegin',html):box.insertAdjacentHTML('beforeend',html)};
if(typeof petDone==='function'){const _pd=petDone;petDone=function(){try{if(PET){S.petc=S.petc||{};S.petc[PET.i]=(S.petc[PET.i]||0)+1}}catch(e){}return _pd.apply(this,arguments)}}

/* ---------- world completion ---------- */
const wRange=w=>[WSTART[w-1],(WSTART[w]||LESSONS.length)];
const wList=w=>{if(window.SEQWL)return SEQWL(w);const[a,b]=wRange(w);return Array.from({length:b-a},(_,k)=>a+k)};
const wDone=w=>{for(const i of wList(w))for(let f=0;f<3;f++)if(!S.cards[i+'-'+f])return false;return true};
const wCount=w=>{const L=wList(w);let n=0;for(const i of L)for(let f=0;f<3;f++)if(S.cards[i+'-'+f])n++;return[n,L.length*3]};
function checkWorlds(){S.wrew=S.wrew||{};const got=[];for(let w=1;w<WSTART.length+1;w++)if(!S.wrew[w]&&wDone(w)){S.wrew[w]=1;S.gems+=50;got.push(w)}
 if(got.length){save();setTimeout(()=>toast(`World ${got.join(', ')} binder page complete! +${50*got.length} diamonds`),1200)}}

/* results: friendship-up banner + world check */
const _res=results;results=function(r){const i=typeof P!=='undefined'?P.fi:null;const before=(S.frl||{})[i];_res.apply(this,arguments);
 try{if(!r||!r.pass||P.practice||i==null)return;checkWorlds();S.frl=S.frl||{};const lv=flvl(i);
  if(before!=null&&lv>before&&par('friends')){const b=$('#mbox .bigstars');b&&b.insertAdjacentHTML('afterend',`<div class="banner frban">♥ ${esc(SPECIES[i].n[0])} friendship level ${lv}!${lv===3||lv===5?' New story unlocked!':''}</div>`)}
  S.frl[i]=lv;save()}catch(e){}};

/* binder: world pages + trophy shelf */
const _rb=renderBinder;renderBinder=function(){const r=_rb.apply(this,arguments);try{checkWorlds();const root=$('#s-binder');if(!root)return r;const tb=root.querySelector('.topbar');
 let h='<div class="wpages">'+WORLDS.map((W,k)=>{const[n,t]=wCount(k+1),done=n>=t;return `<div class="wpage ${done?'done':''}" title="${esc(W.name)}"><b>W${k+1}</b><small>${done?'★ DONE':n+'/'+t}</small></div>`}).join('')+'</div>';
 const tro=Object.entries(S.cards).filter(([k,c])=>c.tier==='gold'||c.tier==='diamond').sort((a,b)=>(b[1].tier==='diamond')-(a[1].tier==='diamond'));
 h+=`<div class="trophy"><div class="tr-head"><b>TROPHY SHELF</b><small>${tro.length} gold and diamond Keylori</small></div><div class="shelf">${tro.length?tro.map(([k,c])=>{const[i,f]=k.split('-').map(Number);return `<button class="tro ${c.tier}" data-act="card" data-k="${k}" title="${esc(SPECIES[i].n[f])}">${creatureSVG(i,f,'fit big',c.tier)}</button>`}).join(''):'<span class="muted">Catch a gold or diamond Keylori to put it here!</span>'}</div></div>`;
 tb&&!root.querySelector('.wpages')&&tb.insertAdjacentHTML('afterend',h)}catch(e){}return r};

/* ---------- little learners (under 5) ---------- */
/* little-learner mode only makes sense before all letters are learned: switch it off for anyone past that */
function littleCheck(){try{if(S.little&&(S.age!=='u5'||(typeof EI==='function'?EI(Math.floor(Math.max(0,nextStage())/NST)):Math.floor(Math.max(0,nextStage())/NST))>=15)){S.little=false;if(S.age==='u5')S.age=null;if(S.set.len===.6)S.set.len=1.4;save()}}catch(e){}}
const _ldL=load;load=function(){const r=_ldL.apply(this,arguments);littleCheck();return r};setTimeout(littleCheck,0);
function setLittle(on){S.little=!!on;if(on){S.age='u5';S.set.voice=true;S.set.len=.6;S.placed=true;S.skip=0}else{if(S.set.len===.6)S.set.len=1.4}}
window.setLittle=setLittle;
const _gt=genText;genText=function(i,s,pr){if(!S.little||pr||(typeof P!=='undefined'&&P.mode==='place'))return _gt.apply(this,arguments);
 const L=LESSONS[i]||{},ls=[...learned(i)].filter(c=>/[a-z]/.test(c)),nw=[...(L.k||'')].filter(c=>/[a-z]/.test(c));
 const pool=nw.length?[...nw,...nw,...nw,...ls]:ls.length?ls:['f','j'],n=8+Math.min(s||0,7)*1;
 const out=[];for(let k=0;k<n;k++){let c=rand(pool);if(out.length&&c===out[out.length-1]&&pool.length>1)c=rand(pool);out.push(c)}return out.join(' ')};
let AGE=null;
ACT.agePick=d=>{AGE=d.v;document.querySelectorAll('.agerow button').forEach(b=>b.classList.toggle('on',b.dataset.v===AGE));sfx.click&&sfx.click()};
const _sn=ACT.saveName;ACT.saveName=function(){const first=!S.name;const r=_sn.apply(this,arguments);if(first&&S.name&&AGE){S.age=AGE;if(AGE==='u5')setLittle(true);AGE=null;save();applyPar();try{renderHome()}catch(e){}}return r};
const _rh=renderHome;renderHome=function(){_rh.apply(this,arguments);const nb=$('#s-home .namebox');if(nb&&!S.name&&!$('#s-home .agerow'))nb.insertAdjacentHTML('afterend',`<div class="agerow"><span>How old are you?</span><div class="seg">${[['u5','Under 5'],['5to7','5 to 7'],['8up','8 and up']].map(([v,t])=>`<button class="${AGE===v?'on':''}" data-act="agePick" data-v="${v}">${t}</button>`).join('')}</div></div>`);
 if(S.little){const pl=$('#s-home [data-act=place]');pl&&pl.closest('p')?.remove()}};
try{if(screen==='home')renderHome()}catch(e){}
})();
