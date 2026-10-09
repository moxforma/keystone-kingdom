/* ================= SPELLING =================
   Spelling lists (teacher, family or built-in word families), three ways to practise
   (Look-Cover-Type-Check, Hear & Spell, Spelling Bee boss), and Tricky Words that come back
   until they're spelled right three times. */
(function(){
const FAM=[
 {g:'K–1',n:'Short a: -at -an',w:['cat','hat','bat','mat','sat','can','fan','man','pan','ran']},
 {g:'K–1',n:'Short i: -ig -in',w:['big','dig','pig','wig','fig','bin','fin','pin','tin','win']},
 {g:'K–1',n:'Short o: -op -ot',w:['hop','mop','pop','top','stop','dot','hot','lot','pot','not']},
 {g:'K–1',n:'Short u: -ug -un',w:['bug','hug','mug','rug','jug','bun','fun','run','sun','gun']},
 {g:'K–1',n:'Short e: -et -en',w:['bet','jet','net','pet','wet','hen','men','pen','ten','den']},
 {g:'1–2',n:'sh ch th',w:['ship','shop','fish','dish','chip','chat','much','lunch','this','that','with','bath']},
 {g:'1–2',n:'-ck and -ll',w:['back','duck','kick','lock','neck','sock','bell','fill','doll','hill','tell','ball']},
 {g:'1–2',n:'Magic e',w:['cake','game','make','bike','kite','time','bone','home','rope','cute','tube','late']},
 {g:'1–2',n:'Sight words 1',w:['the','said','was','you','they','have','come','some','what','where','there','one']},
 {g:'2–3',n:'ee and ea',w:['bee','feet','green','sleep','tree','eat','sea','read','team','dream','beach','clean']},
 {g:'2–3',n:'ai and ay',w:['rain','train','paint','wait','snail','day','play','stay','tray','away','today','again']},
 {g:'2–3',n:'oa and ow',w:['boat','coat','road','soap','goat','snow','grow','show','slow','yellow','window','below']},
 {g:'2–3',n:'-ight',w:['light','night','right','fight','might','sight','bright','flight','tight','knight']},
 {g:'2–3',n:'-ing and -ed',w:['jumping','playing','reading','running','swimming','jumped','played','wanted','stopped','smiled']},
 {g:'2–3',n:'Sight words 2',w:['because','friend','people','could','would','should','again','every','once','many','water','laugh']},
 {g:'3–4',n:'-tion',w:['action','nation','station','motion','lotion','fraction','question','section','vacation','direction']},
 {g:'3–4',n:'Silent letters',w:['knee','knife','know','write','wrong','lamb','thumb','climb','island','listen','ghost','wrist']},
 {g:'3–4',n:'-ous and -ful',w:['famous','nervous','jealous','curious','careful','helpful','joyful','thankful','wonderful','colorful']},
 {g:'3–4',n:'Homophones',w:['their','there','they\'re','your','you\'re','to','too','two','hear','here','write','right']},
 {g:'4–5',n:'-ough',w:['though','through','thought','enough','tough','rough','cough','bought','brought','dough']},
 {g:'4–5',n:'-able and -ible',w:['comfortable','valuable','reliable','enjoyable','possible','terrible','horrible','visible','sensible','flexible']},
 {g:'4–5',n:'Tricky words',w:['necessary','separate','definitely','believe','receive','weird','calendar','library','February','Wednesday']}
];
const clean=w=>String(w||'').trim().replace(/[^A-Za-z'\-]/g,'').slice(0,20);
const SP=()=>{S.spell=S.spell||{};S.spell.lists=S.spell.lists||{};S.spell.tricky=S.spell.tricky||{};return S.spell};
const teacherList=()=>{const t=window.kkClassSpell;return t&&t.words&&t.words.length?t:null};
let RUN=null;if(/[?&]sptest=1/.test(location.search))window.__spRun=()=>RUN;

/* ---------- screen ---------- */
const host=document.getElementById('s-home')?.parentElement||document.body;
if(!document.getElementById('s-spell')){const sec=document.createElement('section');sec.className='screen';sec.id='s-spell';sec.hidden=true;host.appendChild(sec)}
const BEE=PXG(['....oo..oo....','...oWWooWWo...','...oWWWWWWo...','..ooooooooooo.','.oYYYoYYYoYYo.','oYkYYoYYYoYYYo','oYYYYoYYYoYYYo','oYrrYoYYYoYYYo','.oYYYoYYYoYYo.','..oooooooooo..','...o.o..o.o...'],{o:'#1b1626',W:'#e8f4ff',Y:'#f0c860',k:'#1b1626',r:'#ff8aa8'}).toDataURL();
const SPICO=PXG(['oooooooooooo','oWWWWWWWWWWo','oWkWkWkWWWWo','oWWWWWWWWWWo','oWkkWkkkWWWo','oWWWWWWWWWWo','oWkkkWkWWWWo','oWWWWWWWWWWo','oooooooooooo'],{o:'#2a1d3e',W:'#fff6e0',k:'#5a4a7a'}).toDataURL();

/* ---------- hub ---------- */
ACT.spell=()=>{const sp=SP(),tl=teacherList(),my=Object.entries(sp.lists),tk=Object.keys(sp.tricky);
 const lb=(src,id,name,n,extra='')=>`<button class="btn sm splist ${extra}" data-act="spPick" data-src="${src}" data-id="${id}"><b>${esc(name)}</b><small>${n} words</small></button>`;
 modal(`<h2>SPELLING</h2><p class="muted" style="margin:0 0 10px">Pick a word list, then how to practise.</p>
 <div class="spcols">
 ${tl?`<div class="spsec"><h3>From your teacher</h3>${lb('teach','t',tl.name||'Spelling list',tl.words.length,'volt')}</div>`:''}
 <div class="spsec"><h3>Tricky Words</h3>${tk.length?lb('tricky','x','My tricky words',tk.length,'red'):'<p class="muted">Words you miss will show up here until you spell them right 3 times.</p>'}</div>
 <div class="spsec"><h3>My lists</h3>${my.map(([id,l])=>`<div class="sprow">${lb('mine',id,l.name,l.words.length)}<button class="btn sm alt" data-act="spDelAsk" data-id="${id}" aria-label="Delete list" title="Delete list">✕</button></div>`).join('')}<button class="btn sm alt" data-act="spNew">+ Make a list</button></div>
 <div class="spsec"><h3>Word families</h3><div class="spfam">${FAM.map((f,i)=>`<button class="btn sm alt splist" data-act="spPick" data-src="fam" data-id="${i}"><small>Grade ${f.g}</small><b>${esc(f.n)}</b></button>`).join('')}</div></div>
 </div><div class="rbtns"><button class="btn alt" data-act="close">Back</button></div>`);
 document.getElementById('mbox')?.classList.add('guwide')};
function getList(src,id){const sp=SP();
 if(src==='teach'){const t=teacherList();return t&&{name:t.name||'Teacher list',words:t.words}}
 if(src==='tricky')return {name:'Tricky Words',words:Object.keys(sp.tricky)};
 if(src==='mine')return sp.lists[id]||null;
 if(src==='fam'){const f=FAM[+id];return f&&{name:f.n,words:f.w}}return null}
ACT.spPick=d=>{const L=getList(d.src,d.id);if(!L||!L.words.length)return toast('That list is empty');
 const m=(k,t,s,ico)=>`<button class="btn spmode" data-act="spGo" data-src="${d.src}" data-id="${d.id}" data-m="${k}"><span class="spm-i">${ico}</span><span><b>${t}</b><small>${s}</small></span></button>`;
 modal(`<h2>${esc(L.name)}</h2><p class="muted" style="margin:0 0 10px">${L.words.slice(0,12).map(esc).join(', ')}${L.words.length>12?'…':''}</p>
 <div class="spmodes">${m('look','Look, Cover, Type','See the word, it hides, type it from memory.','👀')}${m('hear','Hear and Spell','Listen to the word and type it. No peeking!','👂')}${m('bee','Spelling Bee','Beat the Bee boss with every word you spell.'+(d.src==='fam'&&FAM[+d.id]&&FAM[+d.id].g==='4–5'&&!SP().beeFlawless?' Win without losing a heart for a secret reward!':''),'🐝')}</div>
 <div class="rbtns"><button class="btn alt" data-act="spell">Back</button></div>`)};
ACT.spNew=()=>{modal(`<h2>MAKE A LIST</h2><p class="muted" style="margin:0 0 8px">Type or paste this week's spelling words, one per line or with commas.</p>
 <input id="spname" class="cl-in wide" maxlength="40" placeholder="Week 3 words" autocomplete="off" style="width:100%;margin-bottom:8px">
 <textarea id="spwords" rows="7" maxlength="1200" placeholder="because&#10;friend&#10;people" style="width:100%"></textarea>
 <div class="rbtns"><button class="btn" data-act="spSave">Save list</button><button class="btn alt" data-act="spell">Back</button></div>`);setTimeout(()=>document.getElementById('spname')?.focus(),50)};
const parseWords=t=>[...new Set(String(t||'').split(/[\s,;]+/).map(clean).filter(w=>w.length>0))].slice(0,40);
ACT.spSave=()=>{const words=parseWords(document.getElementById('spwords')?.value);if(!words.length)return toast('Add some words first');
 const id='l'+Date.now().toString(36);SP().lists[id]={name:(document.getElementById('spname')?.value||'').trim().slice(0,40)||'My list',words};save();toast('List saved');ACT.spell()};
ACT.spDelAsk=d=>{const l=SP().lists[d.id];if(!l)return ACT.spell();modal(`<h2>Delete ${esc(l.name)}?</h2><div class="rbtns"><button class="btn red" data-act="spDel" data-id="${d.id}">Delete</button><button class="btn alt" data-act="spell">Cancel</button></div>`)};
ACT.spDel=d=>{delete SP().lists[d.id];save();ACT.spell()};

/* ---------- a round ---------- */
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function sayWord(w,slow){try{if(!('speechSynthesis' in window))return;const was=S.set.voice;S.set.voice=true;speak(w);S.set.voice=was;if(slow){}}catch(e){}}
ACT.spGo=d=>{const L=getList(d.src,d.id);if(!L)return;closeModal();
 let words=shuffle(L.words);
 if(d.src!=='tricky'){const tk=shuffle(Object.keys(SP().tricky).filter(w=>!words.includes(w))).slice(0,Math.ceil(Math.min(10,words.length)*.3));words=words.slice(0,10-tk.length).concat(tk);words=shuffle(words)}
 else words=words.slice(0,10);
 RUN={src:d.src,id:d.id,name:L.name,mode:d.m,words,i:0,pos:0,miss:0,wordMiss:0,res:[],start:performance.now(),hp:words.length,hearts:3,phase:'show'};
 show('spell');draw();nextWord(true)};
function nextWord(first){const R=RUN;if(!R)return;if(!first)R.i++;if(R.i>=R.words.length||(R.mode==='bee'&&R.hearts<=0))return end();
 R.pos=0;R.wordMiss=0;R.shown='';const w=R.words[R.i];
 if(R.mode==='look'){R.phase='show';draw();sayWord(w);clearTimeout(R.t);R.t=setTimeout(()=>{if(RUN===R&&R.phase==='show'){R.phase='type';draw()}},Math.min(4500,1800+w.length*250))}
 else{R.phase='type';draw();setTimeout(()=>sayWord(w),250)}
 focusMob()}
function focusMob(){if(window.KK_MOBILE){const i=document.getElementById('mobin');try{i&&i.focus({preventScroll:true})}catch(e){}}}
function slots(w,pos,showAll,reveal){return [...w].map((c,k)=>{const done=k<pos,cur=k===pos;const ch=done||showAll?c:(reveal&&reveal[k]?c:'');return `<span class="sps ${done?'ok':''} ${cur&&!showAll?'cur':''} ${reveal&&reveal[k]&&!done?'hint':''}">${ch?esc(c):'&nbsp;'}</span>`}).join('')}
function draw(){const R=RUN,el=document.getElementById('s-spell');if(!R||!el)return;const w=R.words[R.i]||'';
 const title={look:'Look, Cover, Type',hear:'Hear and Spell',bee:'Spelling Bee'}[R.mode];
 const top=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>${title}</h2><span class="spcount">${Math.min(R.i+1,R.words.length)} / ${R.words.length}</span></div>`;
 const bee=R.mode==='bee'?`<div class="spbee"><img src="${BEE}" alt="Spelling Bee" class="${R.hit?'hit':''}"><div class="spbar"><i style="width:${Math.round(R.hp/R.words.length*100)}%"></i></div><div class="sphearts">${'♥'.repeat(Math.max(0,R.hearts))}${'♡'.repeat(Math.max(0,3-R.hearts))}</div></div>`:'';
 let mid='';
 if(R.mode==='look'&&R.phase==='show')mid=`<p class="sphint">Look carefully…</p><div class="spword big">${esc(w)}</div><button class="btn sm alt" data-act="spReady">I'm ready (Enter)</button>`;
 else mid=`<p class="sphint">${R.mode==='look'?'Now type it from memory!':'Listen, then type the word.'}</p><div class="spword">${slots(w,R.pos,false,R.reveal)}</div>${R.mode!=='look'?`<button class="btn sm alt" data-act="spHear">🔊 Hear it again (Enter)</button>`:''}`;
 el.innerHTML=`${top}<div class="spstage">${bee}<div class="sphero">${zookSVG()}</div><div class="spmid">${mid}</div></div><p class="muted spfoot">${esc(R.name)}</p>`}
ACT.spReady=()=>{if(RUN&&RUN.phase==='show'){RUN.phase='type';draw();focusMob()}};
ACT.spHear=()=>{if(RUN)sayWord(RUN.words[RUN.i]);focusMob()};
ACT.spQuit=()=>{RUN=null;show('home')};
document.getElementById('s-spell')?.addEventListener('click',e=>{if(!e.target.closest('[data-act]'))focusMob()});
function key(ch){const R=RUN;if(!R||R.phase!=='type')return;const w=R.words[R.i];if(!w)return;const want=w[R.pos];
 if(ch.toLowerCase()===want.toLowerCase()){R.pos++;R.reveal&&delete R.reveal[R.pos-1];try{sfx.click&&sfx.click()}catch(e){}
  if(R.pos>=w.length){wordDone(true);return}draw()}
 else{R.miss++;R.wordMiss++;try{sfx.bad&&sfx.bad()}catch(e){}
  R.reveal=R.reveal||{};if(R.mode==='hear'||R.mode==='bee'||R.wordMiss>=2)R.reveal[R.pos]=1;
  const s=document.querySelector('#s-spell .spword');draw();const s2=document.querySelector('#s-spell .spword');if(s2){s2.classList.add('shake');setTimeout(()=>s2.classList.remove('shake'),300)}}}
function wordDone(){const R=RUN,w=R.words[R.i],perfect=R.wordMiss===0;R.reveal=null;R.res.push({w,miss:R.wordMiss});
 const T=SP().tricky;if(!perfect){T[w]={left:3,miss:((T[w]&&T[w].miss)||0)+1}}else if(T[w]){T[w].left--;if(T[w].left<=0)delete T[w]}
 if(R.mode==='bee'){if(perfect){R.hp--;R.hit=1;setTimeout(()=>{if(RUN===R){R.hit=0;draw()}},300)}else R.hearts--}
 save();R.phase='done';draw();const mid=document.querySelector('#s-spell .spmid');if(mid)mid.insertAdjacentHTML('beforeend',`<div class="spok ${perfect?'':'meh'}">${perfect?'✔ Perfect!':'✔ Got it. This one goes on your Tricky list.'}</div>`);
 try{perfect?sfx.ok&&sfx.ok():null}catch(e){}setTimeout(()=>{if(RUN===R)nextWord()},perfect?700:1400)}
function end(){const R=RUN;RUN=null;if(!R)return;const n=R.res.length,perfect=R.res.filter(r=>!r.miss).length,acc=n?Math.round(perfect/n*100):0;
 const stars=acc>=90?3:acc>=70?2:acc>=40?1:0,win=R.mode!=='bee'||R.hp<=0;
 if(R.mode==='bee'&&win&&R.hearts>=3&&R.src==='fam'&&FAM[+R.id]&&FAM[+R.id].g==='4–5'&&n>=8&&!SP().beeFlawless){SP().beeFlawless=1}
 const key='spell:'+R.src+':'+R.id+':'+R.mode,b=(SP().best=SP().best||{}),prev=b[key]||0;
 let gems=n?Math.floor(perfect/3)+Math.max(0,stars-prev)*2+(prev===0&&stars>0?1:0):0;if(R.mode==='bee'&&win&&n)gems+=3;if(stars>prev)b[key]=stars;
 const xp=R.res.reduce((a,r)=>a+r.w.length,0)+perfect*5;S.gems+=gems;S.xp+=xp;S.time=(S.time||0)+Math.round((performance.now()-R.start)/1000);SP().done=(SP().done||0)+n;save();try{sfx.win()}catch(e){}
 const rows=R.res.map(r=>`<span class="spr ${r.miss?'bad':'good'}">${esc(r.w)}${r.miss?` <small>×${r.miss}</small>`:''}</span>`).join('');
 show('home');
 modal(`<h2>${R.mode==='bee'?(win?'You beat the Bee!':'The Bee got away!'):'Spelling done!'}</h2><div class="hero-mini">${zookSVG()}</div>
 <div class="rstats"><div><b>${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</b><span>Stars</span></div><div><b>${perfect}/${n}</b><span>Perfect words</span></div><div><b>+${xp}</b><span>XP</span></div><div><b>+${gems}</b><span>Diamonds</span></div></div>
 <h3>Your words</h3><div class="spres">${rows}</div>${R.res.some(r=>r.miss)?'<p class="muted" style="margin:6px 0 0">Red words go on your Tricky Words list. Spell each one right 3 times to clear it.</p>':''}
 <div class="rbtns"><button class="btn" data-act="spGo" data-src="${R.src}" data-id="${R.id}" data-m="${R.mode}">Play again</button><button class="btn alt" data-act="spell">Spelling</button><button class="btn alt" data-act="spHome">Home</button></div>`)}
ACT.spHome=()=>{closeModal();show("home")};
document.addEventListener('keydown',e=>{if(typeof screen==='undefined'||screen!=='spell'||!document.getElementById('modal').hidden)return;if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName)&&e.target.id!=='mobin')return;
 if(e.key==='Enter'){e.preventDefault();if(RUN&&RUN.phase==='show')ACT.spReady();else ACT.spHear();return}
 if(e.key==='Escape'){e.preventDefault();ACT.spQuit();return}
 if(e.key.length===1&&/[A-Za-z'\-]/.test(e.key)){e.preventDefault();key(e.key)}},true);


/* ---------- rare hero: Buzz the bee, for a flawless Spelling Bee on a Grade 4–5 list ---------- */
try{if(typeof HEROES!=='undefined'&&!HEROES.buzz){HEROES.buzz={"name": "Buzz", "pal": {"a": "#140c04", "b": "#1b1208", "o": "#1e1206", "c": "#2a1a08", "e": "#3a2410", "f": "#4a2010", "g": "#5a3a18", "i": "#88c8e4", "X": "#a8740c", "j": "#a8dcf0", "D": "#d09a18", "k": "#e8f8ff", "B": "#f0b828", "m": "#ff8a9a", "L": "#ffd040", "H": "#fff0a0", "n": "#ffffff"}, "rows": [".....oLLo......oLLo.....", "....oLLco......ocLLo....", "oooo.oooco....ocooo.oooo", "nnnno...oco..oco...ojiii", "kknkno.oocoooocoo.ojjnii", "knnkknoHHHHHHBDDXojjjnni", "knnnkkHLLLLLBBBDXXjjnnni", "kknkkHLLLLLLBBBDDXXjjnii", "kkkkHLLLLLLLBBBBDDXXjiii", "ookHLLLLLLLLBBBBDDDXXioo", ".oHLLLbbbLLLBBBbbbDDXXo.", ".oLLLLnbbLLLBBBbbnDDXXo.", ".oLLLLbbbLLLBBBbbbDDXXo.", ".oLLLmmLLLLLBBBBBmmDXXo.", ".oLLLLLLLffffffBBDDDXXo.", ".oLLLLLLLLffffBBBDDDXXo.", ".oggggggggggggcccoooaao.", ".oeeeeeeeeeecccccoooaao.", "..oLLLLLLLLLBBBBDDDXXo..", "..oeeeeeeeeeccccoooaao..", "...oeeeeeeeeccccooaao...", "....oLLLLLLLBBBDDXXo....", ".....ooeeeeeccooaoo.....", ".......ooooccoooo......."]};
 if(typeof HERO_COLORS!=='undefined')HERO_COLORS.buzz=[null,'pink','green','purple'];
 try{if(typeof KKC!=='undefined')Object.keys(KKC).forEach(k=>{if(/buzz/.test(k))delete KKC[k]})}catch(e){}
 if(window.RARE_HEROES)window.RARE_HEROES.buzz={need:'Beat the Spelling Bee on a Grade 4–5 list without losing a heart',prog:()=>SP().beeFlawless?'done!':'not yet',ok:()=>!!SP().beeFlawless}}}catch(e){console.warn(e)}

/* ---------- home button (shares a row with Special Lesson when that's unlocked) ---------- */
const _rh=renderHome;renderHome=function(){const r=kkSafe(_rh,this,arguments);try{const hb=document.querySelector('#s-home .hbtns');if(hb&&S.name&&!hb.querySelector('.homespell')){const code=hb.querySelector('.homecode');
 hb.insertAdjacentHTML('beforeend',`<button class="btn homespell" data-act="spell"><img class="bico" src="${SPICO}" alt="">Spelling${teacherList()?' <span class="spdot">NEW LIST</span>':''}</button>`);
 const sp=hb.querySelector('.homespell');if(code){code.classList.add('half');sp.classList.add('half');hb.insertBefore(sp,code)}}}catch(e){console.warn(e)}return r};

/* ---------- Progress Report: Tricky Words ---------- */
const _rp=renderParents;renderParents=function(){const r=kkSafe(_rp,this,arguments);try{const el=document.getElementById('s-parents');if(!el||el.querySelector('.sptricky'))return r;
 const T=SP().tricky,ws=Object.entries(T).sort((a,b)=>b[1].miss-a[1].miss);
 el.insertAdjacentHTML('beforeend',`<div class="panel pbox sptricky"><h3>Spelling: Tricky Words</h3>${ws.length?`<p class="muted" style="margin:0 0 8px">Words this player is still learning. Each one clears after 3 perfect spellings.</p><div class="spres">${ws.map(([w,t])=>`<span class="spr bad">${esc(w)} <small>${3-t.left}/3</small></span>`).join('')}</div>`:'<p class="muted" style="margin:0">No tricky words right now. Nice spelling!</p>'}<p class="muted" style="margin:8px 0 0">Words practised: ${SP().done||0}</p></div>`)}catch(e){console.warn(e)}return r};

/* ---------- Teacher dashboard: send a spelling list to the class ---------- */
const tkFor=c=>{try{const all=JSON.parse(localStorage.getItem('kl-teach')||'{}'),K=c&&(all[c]?c:all[c.toUpperCase()]?c.toUpperCase():c.toLowerCase()),t=all[K];return t&&(t.tk||(window.__tkPlain||{})[K])}catch(e){return null}};
const dashCode=()=>{const h=document.querySelector('#mbox');const m=h&&h.textContent.match(/\b([A-Za-z]{3}\d{3})\b/);return m&&m[1].toUpperCase()};
new MutationObserver(()=>{const b=document.querySelector('#mbox [data-act=clsRace]');if(b&&!document.querySelector('#mbox [data-act=spTeach]'))b.insertAdjacentHTML('afterend','<button class="btn volt spteachbtn" data-act="spTeach">✎ CLASS SPELLING LIST</button>')}).observe(document.getElementById('mbox'),{childList:true,subtree:true});
new MutationObserver(()=>{if(document.querySelector('#mbox .spres'))document.querySelectorAll('#mbox .rbtns .iconbtn').forEach(x=>x.remove())}).observe(document.getElementById('mbox'),{childList:true,subtree:true});
ACT.spTeach=()=>{const c=dashCode(),t=window.kkClassSpellTeach||{};SPT=c;
 modal(`<h2>CLASS SPELLING LIST</h2><p class="muted" style="margin:0 0 8px">Kids see it in Spelling, with Look-Cover-Type, Hear and Spell, and the Spelling Bee.</p>
 <input id="sptname" class="cl-in wide" maxlength="40" placeholder="Week 3 words" autocomplete="off" style="width:100%;margin-bottom:8px" value="${esc(t.name||'')}">
 <textarea id="sptwords" rows="8" maxlength="1200" placeholder="One word per line" style="width:100%">${esc((t.words||[]).join('\n'))}</textarea>
 <div class="rbtns"><button class="btn" data-act="spTeachSave">Send to class</button><button class="btn alt" data-act="spTeachSave" data-clear="1">Clear list</button><button class="btn alt" data-act="clsDash" data-c="${c||''}">Back</button></div>`);
 if(c&&!t.words)fetch('/api/class',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({a:'info',code:c})}).then(r=>r.json()).then(j=>{if(j&&j.spell&&SPT===c){window.kkClassSpellTeach=j.spell;const n=document.getElementById('sptname'),w=document.getElementById('sptwords');if(n&&!n.value)n.value=j.spell.name||'';if(w&&!w.value)w.value=(j.spell.words||[]).join('\n')}}).catch(()=>{})};
let SPT=null;
ACT.spTeachSave=async d=>{const c=SPT,tk=tkFor(c);if(!c||!tk)return toast('Open your class dashboard first');const clear=d&&d.clear;
 const words=clear?[]:parseWords(document.getElementById('sptwords')?.value);if(!clear&&!words.length)return toast('Add some words first');
 try{const r=await fetch('/api/class',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({a:'spell',code:c,tk,name:clear?'':(document.getElementById('sptname')?.value||'Spelling list'),words})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Could not send');
  window.kkClassSpellTeach=j.spell||null;toast(clear?'List cleared':'Sent to your class!');ACT.clsDash({c})}catch(e){toast(e.message)}};

document.head.insertAdjacentHTML('beforeend',`<style>
#s-home .homespell{background:#7fc8f0!important;color:#2a1d3e!important;box-shadow:0 5px 0 #4a8ab8!important;grid-column:1/-1}#s-home .homespell.half{grid-column:auto}#s-home .homespell:active{box-shadow:0 2px 0 #4a8ab8!important}
#s-home .homecode.half{grid-column:auto}.spteachbtn{margin-top:8px;width:100%}.spdot{background:#c83a5c;color:#fff6e0;font-size:.7em;padding:2px 6px;margin-left:6px}
.spcols{display:grid;gap:12px;max-height:62vh;overflow:auto;padding-right:4px;text-align:left}.spsec h3{margin:0 0 6px;font-size:18px;color:#f0c860}
.splist{display:flex!important;flex-direction:column;align-items:flex-start;text-align:left;height:auto!important;padding:8px 12px!important;gap:2px;width:100%}.splist b{font-size:17px}.splist small{font-size:13px;opacity:.85;text-transform:none;letter-spacing:0}
.spfam{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px}.sprow{display:flex;gap:6px;margin-bottom:6px}.sprow .splist{flex:1}.sprow .btn.alt{flex:none;width:44px;padding:0!important}
.spmodes{display:grid;gap:8px}.spmode{display:grid!important;grid-template-columns:44px 1fr;align-items:center;gap:10px;text-align:left;height:auto!important;padding:10px 14px!important}.spm-i{font-size:28px;text-align:center}.spmode b{display:block;font-size:19px}.spmode small{display:block;font-size:14px;text-transform:none;letter-spacing:0;opacity:.85}
#s-spell .topbar{display:flex;align-items:center;gap:10px}#s-spell .topbar h2{flex:1;margin:0}.spcount{font-size:22px;color:#f0c860}
.spstage{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:20px;background:#2a2238;border:4px solid #3a2f4e;padding:22px;margin-top:12px;min-height:300px;position:relative}
.sphero{width:150px}.sphero svg,.sphero img{width:150px;height:auto}.spmid{display:grid;justify-items:center;gap:14px;text-align:center}
.sphint{margin:0;font-size:22px;color:#c8bce0}.spword{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;font-family:var(--title);font-size:34px}
.spword.big{font-size:56px;letter-spacing:.08em;color:#fff6e0}.sps{min-width:44px;height:58px;border-bottom:5px solid #5a4a7a;display:inline-flex;align-items:center;justify-content:center;color:#fff6e0}
.sps.ok{color:#7fe8a0;border-color:#7fe8a0}.sps.cur{border-color:#f0c860;animation:spblink 1s steps(1) infinite}.sps.hint{color:#f0a860}
@keyframes spblink{50%{border-color:transparent}}.spword.shake{animation:spshake .3s steps(3)}@keyframes spshake{33%{transform:translateX(-8px)}66%{transform:translateX(8px)}}
.spok{font-size:24px;color:#7fe8a0}.spok.meh{color:#f0c860}.spfoot{text-align:center;margin:10px 0 0}
.spbee{position:absolute;right:18px;top:12px;display:grid;justify-items:center;gap:4px;width:150px}.spbee img{width:110px;image-rendering:pixelated;animation:spfly 1.2s steps(2) infinite}.spbee img.hit{filter:brightness(2) saturate(0)}
@keyframes spfly{50%{transform:translateY(-6px)}}.spbar{width:140px;height:12px;background:#3a2f4e;border:3px solid #1b1626}.spbar i{display:block;height:100%;background:#c83a5c}.sphearts{color:#ff8aa8;font-size:22px;letter-spacing:2px}
.spres{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.spr{padding:4px 10px;font-size:18px;border:3px solid #3a2f4e}.spr.good{background:#2f5a3e;color:#c8ffd8}.spr.bad{background:#5a2a3a;color:#ffd0d8}
body.mobile .spstage{grid-template-columns:1fr;padding:12px;min-height:0}body.mobile .sphero{display:none}body.mobile .spbee{position:static;margin:0 auto}body.mobile .sps{min-width:30px;height:44px}body.mobile .spword{font-size:26px}body.mobile .spword.big{font-size:40px}
</style>`);
try{if(typeof screen!=='undefined'&&screen==='home')renderHome()}catch(e){}
})();
