/* ================= SPELLING =================
   Spelling lists (teacher, family or built-in word families), three ways to practise
   (Look-Cover-Type-Check, Hear & Spell, Spelling Bee boss), and Tricky Words that come back
   until they're spelled right three times. */
(function(){
/* (word sets live in GRADES below) */
const clean=w=>String(w||'').trim().replace(/[^A-Za-z'\-]/g,'').slice(0,20);
const SP=()=>{S.spell=S.spell||{};S.spell.lists=S.spell.lists||{};S.spell.tricky=S.spell.tricky||{};return S.spell};
const teacherList=()=>{const t=window.kkClassSpell;return t&&t.words&&t.words.length?t:null};
let RUN=null;if(/[?&]sptest=1/.test(location.search))window.__spRun=()=>RUN;

/* ---------- screen ---------- */
const host=document.getElementById('s-home')?.parentElement||document.body;
if(!document.getElementById('s-spell')){const sec=document.createElement('section');sec.className='screen';sec.id='s-spell';sec.hidden=true;host.appendChild(sec)}
const BEE=PXG(['....oo..oo....','...oWWooWWo...','...oWWWWWWo...','..ooooooooooo.','.oYYYoYYYoYYo.','oYkYYoYYYoYYYo','oYYYYoYYYoYYYo','oYrrYoYYYoYYYo','.oYYYoYYYoYYo.','..oooooooooo..','...o.o..o.o...'],{o:'#1b1626',W:'#e8f4ff',Y:'#f0c860',k:'#1b1626',r:'#ff8aa8'}).toDataURL();
const SPICO=PXG(['oooooooooooo','oWWWWWWWWWWo','oWkWkWkWWWWo','oWWWWWWWWWWo','oWkkWkkkWWWo','oWWWWWWWWWWo','oWkkkWkWWWWo','oWWWWWWWWWWo','oooooooooooo'],{o:'#2a1d3e',W:'#fff6e0',k:'#5a4a7a'}).toDataURL();

const GRADES=[
 {g:'K–1',sets:[{n:'Short a and i',i:'cat',w:['cat','hat','bat','man','pan','big','pig','dig','pin','win']},{n:'Short o, u, e',i:'sun',w:['hop','top','hot','pot','bug','sun','run','hen','pen','ten']},{n:'First sight words',i:'eye',w:['the','and','you','said','was','they','have','come','some','one']}]},
 {g:'1–2',sets:[{n:'sh, ch, th',i:'fish',w:['ship','shop','fish','chip','chat','lunch','this','that','with','bath']},{n:'-ck and -ll',i:'duck',w:['back','duck','kick','sock','neck','bell','hill','doll','tell','ball']},{n:'Magic e',i:'magic',w:['cake','game','bike','kite','time','bone','home','rope','cute','tube']}]},
 {g:'2–3',sets:[{n:'Vowel teams',i:'boat',w:['rain','play','train','today','feet','green','sea','dream','boat','snow']},{n:'-ight and -ing',i:'star',w:['light','night','bright','knight','jumping','playing','running','swimming','smiled','stopped']},{n:'Sight words 2',i:'eye',w:['because','friend','people','could','would','should','again','every','once','laugh']}]},
 {g:'3–4',sets:[{n:'-tion words',i:'rocket',w:['action','nation','station','motion','fraction','question','vacation','direction','lotion','section']},{n:'Silent letters',i:'ghost',w:['knee','knife','know','write','wrong','lamb','thumb','climb','island','listen']},{n:'Sound-alikes',i:'ear',w:['their','there','your','to','too','two','hear','here','write','right']}]},
 {g:'4–5',sets:[{n:'-ough words',i:'cloud',w:['though','through','thought','enough','tough','rough','cough','bought','brought','dough']},{n:'-able and -ible',i:'tool',w:['comfortable','valuable','reliable','enjoyable','possible','terrible','horrible','visible','sensible','flexible']},{n:'Tricky words',i:'bolt',w:['necessary','separate','definitely','believe','receive','weird','calendar','library','February','Wednesday']}]},
 {g:'5–6',sets:[{n:'Prefixes',i:'puzzle',w:['unhappy','disagree','misplace','preview','rewrite','incorrect','impossible','nonstop','overcome','understand']},{n:'Suffixes',i:'puzzle',w:['careless','kindness','movement','quietly','happiness','beautiful','dangerous','excitement','wonderful','carefully']},{n:'-ance and -ence',i:'scale',w:['balance','distance','entrance','importance','absence','difference','evidence','silence','patience','confidence']}]},
 {g:'6–7',sets:[{n:'ie or ei',i:'scale',w:['achieve','believe','field','piece','niece','ceiling','receipt','deceive','neighbor','weight']},{n:'Double letters',i:'cherry',w:['accommodate','address','committee','embarrass','occasion','recommend','tomorrow','vacuum','millionaire','possess']},{n:'-cial and -tial',i:'gem',w:['special','official','social','crucial','artificial','partial','initial','essential','potential','confidential']}]},
 {g:'7–8',sets:[{n:'Often misspelled',i:'bolt',w:['occurrence','conscience','rhythm','privilege','maintenance','acquire','guarantee','harass','miniature','mischievous']},{n:'Science words',i:'flask',w:['hypothesis','experiment','photosynthesis','molecule','atmosphere','ecosystem','gravity','organism','temperature','chemical']},{n:'Greek and Latin roots',i:'scroll',w:['autograph','biography','telephone','microscope','geography','spectator','transport','inspect','democracy','chronological']}]}
];
const famById=id=>{const m=/^g(\d+)-(\d+)$/.exec(id||'');if(!m)return null;const G=GRADES[+m[1]],s=G&&G.sets[+m[2]];return s?{...s,g:G.g,gi:+m[1]}:null};
/* tiny pixel icons */
const IC={};const ic=(k,rows,pal)=>{try{IC[k]=PXG(rows,Object.assign({o:'#2a1d3e'},pal)).toDataURL()}catch(e){IC[k]=''}};
ic('teach',['..oooooooo..','.oRRRRRRRRo.','.oRWWWWWWRo.','.oRWkkkkWRo.','.oRWWWWWWRo.','.oRWkkkWWRo.','.oRWWWWWWRo.','.oRRRRRRRRo.','..oooooooo..'],{R:'#c83a5c',W:'#fff6e0',k:'#5a4a7a'});
ic('tricky',['......ooo...','.....oYYo...','....oYYo....','...oYYYooo..','..oYYYYYYo..','..oooYYYo...','....oYYo....','...oYYo.....','...oYo......','...oo.......'],{Y:'#f0c860'});
ic('mine',['.........oo.','........oPPo','.......oYYo.','......oYYo..','.....oYYo...','....oYYo....','...oYYo.....','..oWWo......','..oWo.......','..oo........'],{P:'#ff8aa8',Y:'#f0c860',W:'#e8d8b0'});
ic('fam',['oooo..oooo..','oRRo..oBBo..','oRRo..oBBo..','oooooooooooo','..oGGGGGGo..','..oGWGGWGo..','..oGGGGGGo..','..oooooooo..'],{R:'#ff8a7a',B:'#7fc8f0',G:'#a8d878',W:'#2a1d3e'});
ic('eye',['............','...oooooo...','.ooWWWWWWoo.','oWWWoBBoWWWo','oWWoBkkBoWWo','oWWWoBBoWWWo','.ooWWWWWWoo.','...oooooo...'],{W:'#fff6e0',B:'#7fc8f0',k:'#1b1626'});
ic('ear',['...oooooo...','..oPPPPPPo..','.oPPooooPPo.','.oPo....oPo.','.oPo..ooPPo.','.oPPo.oPPo..','..oPPo.oo...','...oPPo.....','....oPPo....','.....ooo....'],{P:'#f0b090'});
ic('plus',['....oooo....','....oGGo....','....oGGo....','oooooGGooooo','oGGGGGGGGGGo','oGGGGGGGGGGo','oooooGGooooo','....oGGo....','....oGGo....','....oooo....'],{G:'#a8d878'});
ic('medal',['.oo....oo.','oRRo..oBBo','.oRRooBBo.','..oRRBBo..','..oYYYYo..','.oYYWYYYo.','.oYWYYYYo.','.oYYYYYYo.','..oYYYYo..','...oooo...'],{R:'#c83a5c',B:'#7fc8f0',Y:'#f0c860',W:'#fff6e0'});
const setIcon={cat:'fam',sun:'fam',eye:'eye',fish:'fam',duck:'fam',magic:'tricky',boat:'fam',star:'tricky',rocket:'tricky',ghost:'eye',ear:'ear',cloud:'fam',tool:'fam',bolt:'tricky',puzzle:'fam',scale:'fam',cherry:'fam',gem:'tricky',flask:'fam',scroll:'mine'};
const SICON=k=>IC[k]?`<img class="spic" src="${IC[k]}" alt="">`:'';
const best=()=>(SP().best2=SP().best2||{});
const starsOf=id=>best()[id]||0;
const st=n=>`<span class="spst">${'★'.repeat(n)}${'☆'.repeat(3-n)}</span>`;
const gradeDone=gi=>GRADES[gi].sets.every((s,k)=>starsOf('g'+gi+'-'+k)>=3);
const tile=(act,attrs,icon,label,sub='',cls='')=>`<button class="sptile ${cls}" data-act="${act}" ${attrs}>${SICON(icon)}<b>${label}</b>${sub?`<small>${sub}</small>`:''}</button>`;
const back=a=>`<button class="spback" data-act="${a}" aria-label="Back">◀</button>`;
const medals=()=>GRADES.filter((G,gi)=>gradeDone(gi)).length;

/* ---------- menus ---------- */
ACT.spell=()=>{const sp=SP(),tl=teacherList(),tk=Object.keys(sp.tricky).length,my=Object.keys(sp.lists).length;
 modal(`<h2>${SICON('fam')} SPELLING</h2>
 <div class="sptiles">
 ${tl?tile('spPick','data-src="teach" data-id="t"','teach','Teacher',esc(tl.name||'New list'),'hot'):''}
 ${tile('spFam','','fam','Word Sets','Grades K–8')}
 ${tile('spTricky','','tricky','Tricky',tk?tk+(tk>1?' words':' word'):'none yet',tk?'warn':'')}
 ${tile('spMine','','mine','My Lists',my?my+(my>1?' lists':' list'):'make one')}
 </div>
 <p class="spsum">${SICON('medal')} ${medals()} grade medals · ${sp.done||0} words spelled</p>
 <div class="rbtns"><button class="btn alt" data-act="close">Back</button></div>`);document.getElementById('mbox')?.classList.add('spbox')};
ACT.spFam=()=>{modal(`<h2>${back('spell')} WORD SETS</h2><p class="spq">Pick your grade</p>
 <div class="sptiles grades">${GRADES.map((G,gi)=>{const got=G.sets.reduce((a,s,k)=>a+starsOf('g'+gi+'-'+k),0);return tile('spGrade',`data-g="${gi}"`,gradeDone(gi)?'medal':'',G.g,`${got}/${G.sets.length*3} ★`,gradeDone(gi)?'done':'')}).join('')}</div>`);document.getElementById('mbox')?.classList.add('spbox')};
ACT.spGrade=d=>{const gi=+d.g,G=GRADES[gi];if(!G)return ACT.spFam();
 modal(`<h2>${back('spFam')} GRADE ${G.g}</h2><p class="spq">${gradeDone(gi)?'Medal earned! ':'Get 3 stars on all three for a medal'}</p>
 <div class="sptiles three">${G.sets.map((s,k)=>{const id='g'+gi+'-'+k;return tile('spPick',`data-src="fam" data-id="${id}"`,setIcon[s.i]||'fam',esc(s.n),st(starsOf(id)))}).join('')}</div>`);document.getElementById('mbox')?.classList.add('spbox')};
ACT.spTricky=()=>{const T=SP().tricky,ws=Object.keys(T);
 if(!ws.length)return modal(`<h2>${back('spell')} TRICKY WORDS</h2><p class="spq">No tricky words yet.<br>Words you miss show up here until you spell them right 3 times.</p><div class="rbtns"><button class="btn" data-act="spFam">Pick a word set</button></div>`);
 ACT.spPick({src:'tricky',id:'x'})};
ACT.spMine=()=>{const L=Object.entries(SP().lists);
 modal(`<h2>${back('spell')} MY LISTS</h2><div class="sptiles three">${L.map(([id,l])=>`<div class="sptwrap">${tile('spPick',`data-src="mine" data-id="${id}"`,'mine',esc(l.name),l.words.length+' words')}<button class="spx" data-act="spDelAsk" data-id="${id}" aria-label="Delete ${esc(l.name)}">✕</button></div>`).join('')}${tile('spNew','','plus','New list','type your words')}</div>`);document.getElementById('mbox')?.classList.add('spbox')};
function getList(src,id){const sp=SP();
 if(src==='teach'){const t=teacherList();return t&&{name:t.name||'Teacher list',words:t.words}}
 if(src==='tricky')return {name:'Tricky Words',words:Object.keys(sp.tricky)};
 if(src==='mine')return sp.lists[id]||null;
 if(src==='fam'){const f=famById(id);return f&&{name:f.n,words:f.w,g:f.g,gi:f.gi}}return null}
ACT.spPick=d=>{const L=getList(d.src,d.id);if(!L||!L.words.length)return toast('That list is empty');
 const backTo=d.src==='fam'?`spGrade" data-g="${L.gi}`:d.src==='mine'?'spMine':'spell';
 const secret=d.src==='fam'&&!SP().beeFlawless,beeDone=d.src==='fam'&&(SP().beeFl||{})[d.id];
 const m=(k,icon,t,s)=>tile('spGo',`data-src="${d.src}" data-id="${d.id}" data-m="${k}"`,icon,t,s);
 modal(`<h2><button class="spback" data-act="${backTo}" aria-label="Back">◀</button> ${esc(L.name)}</h2><p class="spq">How do you want to play?</p>
 <div class="sptiles three">${m('look','eye','Look','see it, then type')}${m('hear','ear','Listen','hear it, type it')}<button class="sptile bee" data-act="spGo" data-src="${d.src}" data-id="${d.id}" data-m="bee"><img class="spic" src="${BEE}" alt=""><b>Bee Battle</b><small>${beeDone?'perfect! ✔':secret?'no hearts lost = ?':'beat the bee'}</small></button></div>`);document.getElementById('mbox')?.classList.add('spbox')};
ACT.spNew=()=>{modal(`<h2>${back('spMine')} NEW LIST</h2>
 <input id="spname" class="cl-in wide" maxlength="40" placeholder="List name" autocomplete="off" style="width:100%;margin-bottom:8px">
 <textarea id="spwords" rows="7" maxlength="1200" placeholder="Type words here, one per line" style="width:100%"></textarea>
 <div class="rbtns"><button class="btn" data-act="spSave">Save</button></div>`);setTimeout(()=>document.getElementById('spname')?.focus(),50)};
const parseWords=t=>[...new Set(String(t||'').split(/[\s,;]+/).map(clean).filter(w=>w.length>0))].slice(0,40);
ACT.spSave=()=>{const words=parseWords(document.getElementById('spwords')?.value);if(!words.length)return toast('Add some words first');
 const id='l'+Date.now().toString(36);SP().lists[id]={name:(document.getElementById('spname')?.value||'').trim().slice(0,40)||'My list',words};save();toast('List saved!');ACT.spMine()};
ACT.spDelAsk=d=>{const l=SP().lists[d.id];if(!l)return ACT.spMine();modal(`<h2>Delete ${esc(l.name)}?</h2><div class="rbtns"><button class="btn red" data-act="spDel" data-id="${d.id}">Delete</button><button class="btn alt" data-act="spMine">Keep it</button></div>`)};
ACT.spDel=d=>{delete SP().lists[d.id];save();ACT.spMine()};

/* ---------- a round ---------- */
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* words that sound like other words get a sentence, like a real spelling bee */
const SENT={their:'Their dog is big.',there:'Put it over there.',your:'Is this your hat?',to:'We walk to school.',too:'I want to come too.',two:'I have two cats.',hear:'I can hear the bird.',here:'Come over here.',write:'Write your name.',right:'Turn right at the corner.',
 sea:'Fish swim in the sea.',knight:'The knight wore armor.',night:'The stars come out at night.',one:'I have one dog.',piece:'Can I have a piece of cake?',weight:'What is your weight?',know:'I know the answer.',son:'He is their son.',sun:'The sun is hot.',
 through:'We walked through the park.',though:'It was cold, though sunny.',thought:'I thought about it.',bought:'Mom bought milk.',brought:'She brought a snack.',accept:'I accept your gift.',address:'Write your address.',dough:'Bread is made from dough.',
 knee:'I hurt my knee.',lamb:'The lamb is fluffy.',bee:'The bee buzzed by.',read:'I like to read books.',rain:'The rain is wet.',wrong:'That answer is wrong.',field:'Cows eat grass in the field.',ceiling:'The fan is on the ceiling.'};
function sayWord(w,slow){try{if(!('speechSynthesis' in window))return;const v=window.kkPickVoice&&window.kkPickVoice(),sent=SENT[String(w).toLowerCase()];speechSynthesis.cancel();
 const say=(t,rate)=>{const u=new SpeechSynthesisUtterance(t);if(v){u.voice=v;u.lang=v.lang}u.rate=rate;u.pitch=1;speechSynthesis.speak(u)};
 const r=slow?.55:.8;say(w+'.',r);if(sent)say(sent,slow?.7:.9);say(w+'.',r)}catch(e){}}
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
 const title={look:'Look and Spell',hear:'Listen and Spell',bee:'Bee Battle'}[R.mode];
 const top=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>${title}</h2><span class="spcount">${Math.min(R.i+1,R.words.length)} / ${R.words.length}</span></div>`;
 const bee=R.mode==='bee'?`<div class="spbee"><img src="${BEE}" alt="Spelling Bee" class="${R.hit?'hit':''}"><div class="spbar"><i style="width:${Math.round(R.hp/R.words.length*100)}%"></i></div><div class="sphearts">${'♥'.repeat(Math.max(0,R.hearts))}${'♡'.repeat(Math.max(0,3-R.hearts))}</div></div>`:'';
 let mid='';
 if(R.mode==='look'&&R.phase==='show')mid=`<p class="sphint">Look carefully…</p><div class="spword big">${esc(w)}</div><button class="btn sm alt" data-act="spReady">I'm ready (Space)</button>`;
 else mid=`<p class="sphint">${R.mode==='look'?'Now type it from memory!':'Listen, then type the word.'}</p><div class="spword">${slots(w,R.pos,false,R.reveal)}</div>${R.mode!=='look'?`<div class="sphear"><button class="btn sm" data-act="spHear">🔊 Again <small>(Space)</small></button><button class="btn sm alt" data-act="spSlow">🐢 Slow <small>(Enter)</small></button></div>`:''}`;
 el.innerHTML=`${top}<div class="spstage">${bee}<div class="sphero">${zookSVG()}</div><div class="spmid">${mid}</div></div><p class="muted spfoot">${esc(R.name)}</p>`}
ACT.spReady=()=>{if(RUN&&RUN.phase==='show'){RUN.phase='type';draw();focusMob()}};
ACT.spHear=()=>{if(RUN)sayWord(RUN.words[RUN.i]);focusMob()};
ACT.spSlow=()=>{if(RUN)sayWord(RUN.words[RUN.i],true);focusMob()};
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
 const stars=acc>=90?3:acc>=70?2:acc>=40?1:0,win=R.mode!=='bee'||R.hp<=0,fam=R.src==='fam'?famById(R.id):null;
 if(R.mode==='bee'&&win&&R.hearts>=3&&fam&&n>=8){const F=(SP().beeFl=SP().beeFl||{});F[R.id]=1;if(GRADES[fam.gi].sets.every((x,k)=>F['g'+fam.gi+'-'+k]))SP().beeFlawless=1}
 const bid=R.src==='fam'?R.id:R.src+':'+R.id,B=best(),prev=B[bid]||0,medalBefore=fam?gradeDone(fam.gi):true;
 if(stars>prev)B[bid]=stars;const medal=fam&&!medalBefore&&gradeDone(fam.gi);
 const rw=[];if(n){rw.push(['Perfect words',Math.ceil(perfect/2)]);if(stars>prev)rw.push([prev?'New best stars':'First stars',(stars-prev)*2+(prev?0:1)]);if(R.mode==='bee'&&win)rw.push(['Beat the Bee',3]);if(medal)rw.push(['Grade '+fam.g+' medal!',10])}
 const gems=rw.reduce((a,r)=>a+r[1],0),xp=R.res.reduce((a,r)=>a+r.w.length,0)+perfect*5;
 S.gems+=gems;S.xp+=xp;S.time=(S.time||0)+Math.round((performance.now()-R.start)/1000);SP().done=(SP().done||0)+n;
 let egg=null;try{if(perfect>=3&&typeof dailyEgg==='function')egg=dailyEgg()}catch(e){}save();try{sfx.win()}catch(e){}
 const g=(typeof ICON!=='undefined'&&ICON.gem)?ICON.gem.replace('<svg','<svg width="26" height="26"'):'';
 const reward=gems?`<div class="reward"><div class="rtot">${g}<b>+${gems}</b><span>diamonds</span></div>${rw.filter(r=>r[1]>0).map(([t,v])=>`<div><span>${t}</span><b>+${v}</b></div>`).join('')}</div>`:'';
 const rows=R.res.map(r=>`<span class="spr ${r.miss?'bad':'good'}">${esc(r.w)}</span>`).join('');
 show('home');
 modal(`<h2>${R.mode==='bee'?(win?'You beat the Bee!':'The Bee got away!'):stars===3?'Super speller!':'Nice spelling!'}</h2><div class="hero-mini">${zookSVG()}</div>
 ${medal?`<div class="banner gold">${SICON('medal')} Grade ${fam.g} medal earned!</div>`:''}${typeof eggBanner==='function'?eggBanner(egg):''}
 <div class="spbig">${st(stars)}</div>
 <div class="rstats"><div><b>${perfect}/${n}</b><span>Perfect</span></div><div><b>+${xp}</b><span>XP</span></div></div>${reward}
 <div class="spres">${rows}</div>${R.res.some(r=>r.miss)?'<p class="muted" style="margin:6px 0 0">Red words go to Tricky Words.</p>':''}
 <div class="rbtns"><button class="btn" data-act="spGo" data-src="${R.src}" data-id="${R.id}" data-m="${R.mode}">Play again</button><button class="btn alt" data-act="${fam?'spGrade" data-g="'+fam.gi:'spell'}">More spelling</button><button class="btn alt" data-act="spHome">Home</button></div>`)}
ACT.spHome=()=>{closeModal();show("home")};
document.addEventListener('keydown',e=>{if(typeof screen==='undefined'||screen!=='spell'||!document.getElementById('modal').hidden)return;if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName)&&e.target.id!=='mobin')return;
 if(e.key===' '){e.preventDefault();if(RUN&&RUN.phase==='show')ACT.spReady();else if(RUN&&RUN.mode!=='look')ACT.spHear();return}
 if(e.key==='Enter'){e.preventDefault();if(RUN&&RUN.mode!=='look')ACT.spSlow();return}
 if(e.key==='Escape'){e.preventDefault();ACT.spQuit();return}
 if(e.key.length===1&&/[A-Za-z'\-]/.test(e.key)){e.preventDefault();key(e.key)}},true);


/* ---------- rare hero: Buzz the bee, for a flawless Spelling Bee on a Grade 4–5 list ---------- */
try{if(typeof HEROES!=='undefined'&&!HEROES.buzz){HEROES.buzz={"name": "Buzz", "pal": {"a": "#140c04", "b": "#1b1208", "o": "#1e1206", "c": "#2a1a08", "e": "#3a2410", "f": "#4a2010", "g": "#5a3a18", "i": "#88c8e4", "X": "#a8740c", "j": "#a8dcf0", "D": "#d09a18", "k": "#e8f8ff", "B": "#f0b828", "m": "#ff8a9a", "L": "#ffd040", "H": "#fff0a0", "n": "#ffffff"}, "rows": [".....oLLo......oLLo.....", "....oLLco......ocLLo....", "oooo.oooco....ocooo.oooo", "nnnno...oco..oco...ojiii", "kknkno.oocoooocoo.ojjnii", "knnkknoHHHHHHBDDXojjjnni", "knnnkkHLLLLLBBBDXXjjnnni", "kknkkHLLLLLLBBBDDXXjjnii", "kkkkHLLLLLLLBBBBDDXXjiii", "ookHLLLLLLLLBBBBDDDXXioo", ".oHLLLbbbLLLBBBbbbDDXXo.", ".oLLLLnbbLLLBBBbbnDDXXo.", ".oLLLLbbbLLLBBBbbbDDXXo.", ".oLLLmmLLLLLBBBBBmmDXXo.", ".oLLLLLLLffffffBBDDDXXo.", ".oLLLLLLLLffffBBBDDDXXo.", ".oggggggggggggcccoooaao.", ".oeeeeeeeeeecccccoooaao.", "..oLLLLLLLLLBBBBDDDXXo..", "..oeeeeeeeeeccccoooaao..", "...oeeeeeeeeccccooaao...", "....oLLLLLLLBBBDDXXo....", ".....ooeeeeeccooaoo.....", ".......ooooccoooo......."]};
 if(typeof HERO_COLORS!=='undefined')HERO_COLORS.buzz=[null,'pink','green','purple'];
 try{if(typeof KKC!=='undefined')Object.keys(KKC).forEach(k=>{if(/buzz/.test(k))delete KKC[k]})}catch(e){}
 if(window.RARE_HEROES)window.RARE_HEROES.buzz={need:'Win a perfect Bee Battle (no hearts lost) on all 3 word sets of any grade',prog:()=>{const F=SP().beeFl||{};return Math.max(0,...GRADES.map((G,gi)=>G.sets.filter((x,k)=>F['g'+gi+'-'+k]).length))+'/3 perfect Bee Battles in one grade'},ok:()=>!!SP().beeFlawless}}}catch(e){console.warn(e)}

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
.spbox h2{display:flex;align-items:center;justify-content:center;gap:10px}.spbox h2 .spic{width:30px;height:auto}
.sptiles{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:8px 0 12px}.sptiles.three{grid-template-columns:repeat(3,1fr)}.sptiles.grades{grid-template-columns:repeat(4,1fr)}
.sptile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:118px;padding:12px 8px;background:#3a2f4e;border:4px solid #5a4a7a;color:#fff6e0;font-family:inherit;cursor:pointer;box-shadow:0 5px 0 #1b1626;width:100%}
.sptile:hover{border-color:#f0c860}.sptile:active{transform:translateY(3px);box-shadow:0 2px 0 #1b1626}.sptile b{font-size:22px;line-height:1.05;text-align:center}.sptile small{font-size:15px;color:#c8bce0;text-transform:none}
.sptile .spic{width:46px;height:auto;image-rendering:pixelated}.sptile.hot{background:#c83a5c;border-color:#ff8aa8}.sptile.warn small{color:#f0c860}.sptile.done{border-color:#f0c860;background:#4a3a20}.sptile.bee{background:#4a3a10;border-color:#f0c860}
.grades .sptile{min-height:84px}.grades .sptile b{font-size:26px}.sptwrap{position:relative}.spx{position:absolute;top:4px;right:4px;width:28px;height:28px;background:#1b1626;color:#fff6e0;border:2px solid #5a4a7a;cursor:pointer}
.spback{background:#3a2f4e;border:3px solid #5a4a7a;color:#fff6e0;width:38px;height:38px;cursor:pointer;font-size:16px;flex:none}.spq{text-align:center;margin:0 0 6px;color:#c8bce0;font-size:20px}.spsum{text-align:center;color:#c8bce0;display:flex;gap:8px;justify-content:center;align-items:center;margin:0}.spsum .spic{width:22px}
.spst{color:#f0c860;letter-spacing:2px;font-size:18px}.spbig{text-align:center}.spbig .spst{font-size:40px}.banner .spic{width:22px;vertical-align:middle}
body.mobile .sptiles.three,body.mobile .sptiles.grades{grid-template-columns:repeat(2,1fr)}body.mobile .sptile{min-height:96px}
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
.sphear{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.sphear small{opacity:.7;font-size:.8em}.spok{font-size:24px;color:#7fe8a0}.spok.meh{color:#f0c860}.spfoot{text-align:center;margin:10px 0 0}
.spbee{position:absolute;right:18px;top:12px;display:grid;justify-items:center;gap:4px;width:150px}.spbee img{width:110px;image-rendering:pixelated;animation:spfly 1.2s steps(2) infinite}.spbee img.hit{filter:brightness(2) saturate(0)}
@keyframes spfly{50%{transform:translateY(-6px)}}.spbar{width:140px;height:12px;background:#3a2f4e;border:3px solid #1b1626}.spbar i{display:block;height:100%;background:#c83a5c}.sphearts{color:#ff8aa8;font-size:22px;letter-spacing:2px}
.spres{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.spr{padding:4px 10px;font-size:18px;border:3px solid #3a2f4e}.spr.good{background:#2f5a3e;color:#c8ffd8}.spr.bad{background:#5a2a3a;color:#ffd0d8}
body.mobile .spstage{grid-template-columns:1fr;padding:12px;min-height:0}body.mobile .sphero{display:none}body.mobile .spbee{position:static;margin:0 auto}body.mobile .sps{min-width:30px;height:44px}body.mobile .spword{font-size:26px}body.mobile .spword.big{font-size:40px}
</style>`);
try{if(typeof screen!=='undefined'&&screen==='home')renderHome()}catch(e){}
})();
