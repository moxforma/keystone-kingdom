/* Daily hooks: rare visitor, streak rewards, streak freeze */
(function(){
const dayStr=o=>new Date(Date.now()+o*864e5).toDateString();
const dayNum=s=>Math.round(new Date(s).setHours(12)/864e5);
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
function visitorFor(ds){const h=hash('kv'+ds),i=h%SPECIES.length,f=[0,1,1,2][(h>>>5)%4];return{i,f}}

/* streak reward outfits */
const FLAME=["..o....o....o.",".oYo..oYo..oYo","oYRYooYRYooYRo","oRRRRRRRRRRRRo","oWWWWWWWWWWWWo","oRRRRRRRRRRRRo","oooooooooooooo"];
const STREAK={
 flameband:{slot:'head',name:'Blaze Headband',streak:7,parts:[[FLAME,5,2]],pal:{o:'#3a1008',Y:'#ffd23c',R:'#e8483a',W:'#ffe9a8'}},
 phoenixwings:{slot:'back',name:'Phoenix Wings',streak:30,back:1,parts:[[DWING,-5,6],[mirror(DWING),19,6]],pal:{o:'#3a0e08',B:'#d8402a',L:'#ff9a3a',H:'#ffe46a'}}
};
Object.entries(STREAK).forEach(([id,a])=>{ACC[id]={slot:a.slot,name:a.name,cost:0,lvl:0,svg:'',legend:1,streak:a.streak};KKDATA.acc[id]=Object.assign({x:0,y:0,rows:[],pal:{}},a)});

function D(){S.daily=S.daily||{day:'',secs:0,streak:0,met:'',lastT:S.time||0};const d=S.daily;d.frz=d.frz||0;d.best=Math.max(d.best||0,d.streak||0);return d}
/* streak still alive? (met today/yesterday, or missed days covered by freezes) */
function liveStreak(){const d=D();if(!d.met)return 0;const gap=dayNum(todayKey())-dayNum(d.met);return gap<=1||gap-1<=d.frz?d.streak||0:0}
window.liveStreak=liveStreak;

dailyTick=function(){const d=D(),t=S.time||0;
 if(d.day!==todayKey()){d.day=todayKey();d.secs=0}
 const add=Math.max(0,t-(d.lastT||0));d.lastT=t;d.secs+=add;
 if(d.secs>=GOAL_MIN*60&&d.met!==todayKey()){
  const gap=d.met?dayNum(todayKey())-dayNum(d.met):99;let used=0;
  if(gap<=1)d.streak++;else if(gap-1<=d.frz){used=gap-1;d.frz-=used;d.streak++}else d.streak=1;
  d.met=todayKey();S.gems+=5;let msg=`Daily goal done! +5 diamonds · ${d.streak} day streak`;
  if(used)msg=`A streak freeze saved your ${d.streak} day streak!`;
  if(d.streak%5===0&&d.frz<2){d.frz++;msg+=' · +1 streak freeze'}
  d.best=Math.max(d.best||0,d.streak);
  setTimeout(()=>toast(msg),900);
  Object.entries(STREAK).forEach(([id,a])=>{if((!window.parOn||parOn('streak'))&&d.best>=a.streak&&!S.owned.includes(id)){S.owned.push(id);setTimeout(()=>streakPrize(id),2600)}})}};

function streakPrize(id){const a=ACC[id];sfx.win&&sfx.win();
 modal(`<h2>${a.streak} DAY STREAK!</h2><div class="hero-mini">${zookSVG(Object.assign({},S.equip,{[a.slot]:id}))}</div><div class="banner ${a.streak>=30?'dia':'gold'}">You earned the ${a.name.toUpperCase()}!</div>
 <div class="rbtns"><button class="btn" data-act="streakWear" data-id="${id}">WEAR IT</button><button class="btn alt" data-act="close">LATER</button></div>`)}
ACT.streakWear=d=>{const a=ACC[d.id];S.equip[a.slot]=d.id;save();closeModal();typeof renderHome==='function'&&screen==='home'&&renderHome()};

/* streak line in the daily goal panel */
const _dh=dailyHTML;dailyHTML=function(){const d=D(),st=liveStreak();
 let h=_dh().replace(/Streak: \d+ days?/,`Streak: ${st} day${st===1?'':'s'}`);
 const nx=Object.values(STREAK).find(a=>(d.best||0)<a.streak);
 const ice=d.frz?`<span class="frz" title="Streak freezes">${'❄'.repeat(d.frz)}</span>`:'';
 return h.replace('</small>',`${ice}${nx?` · ${nx.streak-st>0?nx.streak-st:0} more for ${nx.name}`:''}</small>`)};

/* daily visitor */
function visitorHTML(){const d=D(),t=visitorFor(todayKey()),tm=visitorFor(dayStr(1)),sp=SPECIES[t.i],met=d.vis===todayKey(),played=S.egg.day===todayKey()||(d.day===todayKey()&&d.secs>0);
 const btn=met?`<span class="note">Friends now! Come back tomorrow.</span>`:played?`<button class="btn sm volt" data-act="befriend">BEFRIEND</button>`:`<span class="note">Play a lesson today to befriend it!</span>`;
 return `<div class="visrow"><div class="vis-art">${creatureSVG(t.i,t.f,'fit big')}</div><div class="vis-txt"><b>Today's visitor: ${sp.n[t.f]}</b>${btn}</div>
 <div class="vis-next" title="Tomorrow's visitor"><div class="sil">${creatureSVG(tm.i,tm.f,'fit big')}</div><small>Tomorrow</small></div></div>`}
ACT.befriend=()=>{const d=D();if(d.vis===todayKey())return;const t=visitorFor(todayKey()),k=t.i+'-'+t.f,sp=SPECIES[t.i];d.vis=todayKey();let msg;
 if(!S.cards[k]){S.cards[k]={holo:false};msg=`${sp.n[t.f]} joined your binder!`}
 else if(!S.cards[k].tier){S.cards[k].tier='gold';msg=`${sp.n[t.f]} turned GOLD in your binder!`}
 else{S.gems+=5;msg=`${sp.n[t.f]} gave you +5 diamonds!`}
 save();sfx.win&&sfx.win();
 modal(`<h2>NEW FRIEND!</h2><div class="banner gold">${msg}</div><div class="vis-card">${cardHTML(t.i,t.f,S.cards[k])}</div><div class="rbtns"><button class="btn" data-act="close">YAY!</button></div>`);renderHome()};

const _rh=renderHome;renderHome=function(){_rh();if(!S.name||(window.parOn&&!parOn('visitor')))return;const e=$('#s-home .eggrow');if(e&&!$('#s-home .visrow'))e.insertAdjacentHTML('afterend',visitorHTML())};

/* closet: streak items can't be bought */
const _rs=renderShop;renderShop=function(){_rs();Object.entries(STREAK).forEach(([id,a])=>{if(S.owned.includes(id))return;const it=document.querySelector(`#s-shop .item[data-id="${id}"]`);if(!it)return;it.classList.add('lockd');
 const b=it.querySelector('button');if(b)b.outerHTML=`<button class="btn sm alt" data-act="shopPv" data-id="${id}">${a.streak} DAY STREAK</button>`;const s=it.querySelector('.slot');if(s)s.textContent='Streak reward'});
 if(SHOPPV&&STREAK[SHOPPV]&&!S.owned.includes(SHOPPV)){const n=$('#s-shop .shopnote');if(n)n.innerHTML=`<b class="pvbad">Reach a ${STREAK[SHOPPV].streak} day streak to earn ${STREAK[SHOPPV].name}.</b><br>Best streak: ${D().best||0} days.<br><button class="linkbtn" data-act="shopPvOff">Stop preview</button>`}};
const _buy=ACT.buy;ACT.buy=d=>{if(STREAK[d.id]&&!S.owned.includes(d.id)){SHOPPV=d.id;renderShop();return}_buy(d)};

try{Object.keys(KKC).forEach(k=>{if(/flameband|phoenix/.test(k))delete KKC[k]})}catch(e){}
try{if(screen==='home')renderHome()}catch(e){}
})();
