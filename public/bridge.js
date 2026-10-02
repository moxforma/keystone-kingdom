/* Story Bridge: type a whole paragraph to build a bridge before the Scrambler cuts the rope */
(function(){
const TXT=(typeof KK_TEXT!=='undefined'&&KK_TEXT)||{para:[]};
const UNLOCK=14;
const progLesson=()=>Math.floor(Math.max(0,nextStage())/NST);
const SYM='!?@#$%&*+-=/';
function prepText(t){const p=progLesson();
 if(p<15)t=t.toLowerCase();
 if(p<22)t=t.replace(/[!?]/g,'.').replace(/["']/g,'');
 if(typeof arcadeNumberOn==='function'){if(!arcadeNumberOn())t=t.replace(/\d/g,'');if(!arcadeSymbolOn())t=t.replace(/[!?;:]/g,'.').replace(/[^A-Za-z0-9\s.,]/g,'')}
 return t.replace(/\s+/g,' ').replace(/\.\.+/g,'.').trim()}
function wpmTarget(){const d=S.set.arcd||'auto';if(window.INSANE)return 85;return d==='beast'?48:d==='hard'?30:d==='medium'?20:d==='easy'?12:Math.max(10,Math.min(40,Math.round((typeof avgWpm==='function'?avgWpm():12)*.85)))}
let LASTP=null;
let BGHOST=null;
function learnedStory(){const p=progLesson(),ls=learned(Math.min(LESSONS.length-1,p));const ok=w=>[...w.toLowerCase()].every(c=>ls.has(c));
 if(p>=UNLOCK){const pool=TXT.para.filter(x=>x!==LASTP);const raw=rand(pool.length?pool:TXT.para);LASTP=raw;return raw}
 /* not all letters yet: use whole sentences that only need letters you know, else simple word lines */
 const sents=[...(TXT.easy||[]),...(TXT.medium||[])].map(x=>x.replace(/[.!?]$/,'')).filter(x=>x.split(' ').every(ok));
 if(sents.length>=3){const pick=[];const sh=sents.slice().sort(()=>Math.random()-.5);for(const x of sh){pick.push(x);if(pick.join(' ').length>110)break}return pick.join('. ')+'.'}
 const words=(typeof WORDS!=='undefined'?WORDS:[]).filter(w=>w.length<=6&&ok(w));
 if(words.length>=6){const out=[];for(let k=0;k<5;k++){out.push(Array.from({length:4},()=>rand(words)).join(' '))}return out.join(' ')}
 const lets=[...ls].filter(c=>/[a-z]/.test(c));return Array.from({length:24},()=>Array.from({length:2+Math.floor(Math.random()*2)},()=>rand(lets)).join('')).join(' ')}
ACT.bridge=()=>{let raw=learnedStory();
 if(S.set.arcd==='beast'&&progLesson()>=UNLOCK){const two=rand(TXT.para.filter(x=>x!==raw));if(two)raw+=' '+two}
 const text=BGHOST?BGHOST.t:prepText(raw),words=text.split(' '),wpm=wpmTarget(),limit=Math.round(text.length/5/wpm*60+6);
 mountGame('Story Bridge','Type the story to build the bridge!','Words','Rope');
 G={type:'bridge',frames:[[0,0]],ghostInvite:BGHOST,text,pos:0,mist:new Set(),words,wi:0,limit,left:limit,done:false,start:0,score:0,combo:0,arcLevel:typeof arcadeLevelNow==='function'?arcadeLevelNow():'auto'};
 $('#gsw').hidden=true;const ar=$('#garena');ar.className='garena bridge-arena';
 let starts=[],k=0;words.forEach(w=>{starts.push(k);k+=w.length+1});G.starts=starts;
 ar.innerHTML=`${backdrop(3,['#2a2a6a','#3a3a8a','#5a4a9a','#7a5aa8'])}${cloudsHTML()}
 <div class="br-para" id="brpara">${[...text].map((c,i)=>`<span id="bc${i}" class="${c===' '?'sp':''}">${c===' '?' ':esc(c)}</span>`).join('')}</div>
 <div class="br-chasm"><div class="br-cliff l"></div><div class="br-cliff r"></div>
  <div class="br-rope top" id="brrope"><i id="brropei"></i></div>
  <div class="br-planks" id="brplanks">${words.map((w,i)=>`<i id="bp${i}"></i>`).join('')}</div>
  <div class="br-hero" id="brhero">${zookSVG()}</div>${BGHOST?`<div class="br-hero br-ghost" id="brghost">${zookSVG()}</div>`:''}<div class="br-goal"><img src="${typeof FBOSS_URL==='function'?FBOSS_URL(10):''}" alt="The Scrambler King"></div></div>`;
 setAvailAll();paint();G.raf=requestAnimationFrame(tick)};
function setAvailAll(){try{setAvail(new Set([...keyEls.keys()]),true);applyLabels()}catch(e){}}
function paint(){const prev=$('#brpara .cur');prev&&prev.classList.remove('cur');const el=$('#bc'+G.pos);if(el){el.classList.add('cur');const box=$('#brpara');const top=el.offsetTop-box.offsetTop;if(top<box.scrollTop+8||top>box.scrollTop+box.clientHeight-40)box.scrollTop=Math.max(0,top-box.clientHeight/3)}
 setTarget(G.text[G.pos]||null);$('#g-a').textContent=G.wi+'/'+G.words.length;
 const f=G.wi/G.words.length,h=$('#brhero');if(h)h.style.left=`calc(4% + ${f*82}%)`}
function wordDone(){if(G.start){const t=Math.max(1,Math.round((performance.now()-G.start)/100));const last=G.frames[G.frames.length-1];if(G.pos>last[0])G.frames.push([G.pos,Math.max(t,last[1])])}const pl=$('#bp'+G.wi);pl&&pl.classList.add('on');G.wi++;G.score+=10+G.combo;try{tone(520+G.wi*6,.06,'square',.04)}catch(e){}}
function finish(won){if(G.done)return;const secs=(performance.now()-(G.start||performance.now()))/1000,wpm=Math.round(G.pos/5/Math.max(secs/60,1/60)),acc=Math.round((G.pos-[...G.mist].length)/Math.max(1,G.pos)*100);
 S.arc.bridge=Math.max(S.arc.bridge||0,won?wpm:0);if(won)S.arc.brwin=(S.arc.brwin||0)+1;if(typeof arcadeRecordWin==='function')arcadeRecordWin('bridge',won);
 const ar=$('#garena');ar&&ar.classList.add(won?'br-won':'br-lost');
 const gems=won?Math.max(2,Math.round(G.words.length/6)+(acc>=95?3:acc>=85?1:0)):Math.max(1,Math.floor(G.wi/12));
 const elapsed=Math.max(1,Math.round(secs*10));if(G.pos>=G.text.length){const fr=G.frames.slice();if(fr[fr.length-1][0]!==G.text.length)fr.push([G.text.length,Math.max(elapsed,fr[fr.length-1][1])]);else fr[fr.length-1][1]=Math.max(fr[fr.length-1][1],elapsed);
  G.challengeData={v:2,g:'bridge',...(typeof ghostSettings==='function'?ghostSettings():{d:'auto',n:false,s:false,l:1}),t:G.text,a:Math.max(0,Math.min(100,acc)),f:fr}}
 G.bridgeMs=elapsed*100;let extra='';if(G.ghostInvite){const fs=G.ghostInvite.f.at(-1)[1]/10,me=won?(elapsed/10):null;const beat=won&&elapsed<G.ghostInvite.f.at(-1)[1];G.ghostBeat=beat;
  extra=`<div class="ghost-summary"><b>${beat?'You beat your friend’s ghost!':'Your friend’s ghost crossed first!'}</b><span>You: ${me?me.toFixed(1)+'s':'did not finish'} · Friend: ${fs.toFixed(1)}s (${G.ghostInvite.a}% accuracy)</span></div>`}
 const share=G.challengeData&&won?shareRunHTML('Story Bridge',`${wpm} WPM · ${acc}% accuracy`):'';
 xEnd(won?'You crossed the bridge!':'The rope snapped!',[[wpm,'WPM'],[Math.max(0,acc)+'%','Accuracy'],[G.wi+'/'+G.words.length,'Words']],gems,'bridge',extra+(won?'<div class="banner gold">The Scrambler runs away!</div>':'<div class="banner">So close! Try a slower speed setting.</div>'),share)}
function tick(now){if(G.done||G.type!=='bridge')return;if(G.ghostInvite&&G.start){const t=(now-G.start)/100,f=G.ghostInvite.f;let pos=f[f.length-1][0];for(let k=1;k<f.length;k++){if(f[k][1]>=t){const a=f[k-1],b=f[k],u=b[1]>a[1]?(t-a[1])/(b[1]-a[1]):1;pos=a[0]+(b[0]-a[0])*u;break}}const gEl=$('#brghost');if(gEl)gEl.style.left=`calc(4% + ${pos/G.text.length*82}%)`}if(G.start){G.left=G.limit-(now-G.start)/1000;$('#g-b').textContent=Math.max(0,Math.ceil(G.left));const r=$('#brropei');if(r)r.style.width=Math.max(0,G.left/G.limit*100)+'%';
  if(G.left<8)$('#brrope')?.classList.add('fray');if(G.left<=0)return finish(false)}else $('#g-b').textContent=G.limit;
 G.raf=requestAnimationFrame(tick)}
const _gi=gameInput;gameInput=function(ch,caps){if(!(typeof G!=='undefined'&&G&&G.type==='bridge'))return _gi.apply(this,arguments);if(G.done)return;
 try{pressFx(ch===' '?'space':ch.toLowerCase())}catch(e){}if(!G.start)G.start=performance.now();
 const t=G.text[G.pos];if(t===undefined)return;
 if(matchKey(ch,t,caps)){const el=$('#bc'+G.pos);el&&el.classList.add(G.mist.has(G.pos)?'bad':'ok');G.pos++;G.combo++;try{sfx.ok(G.combo)}catch(e){}
  if(t===' '||G.pos>=G.text.length)wordDone();if(G.pos>=G.text.length){paint();return finish(true)}paint()}
 else{G.mist.add(G.pos);G.combo=0;try{sfx.bad()}catch(e){}const pl=$('#bp'+G.wi);if(pl){pl.classList.remove('wob');void pl.offsetWidth;pl.classList.add('wob')}const el=$('#bc'+G.pos);if(el){el.classList.remove('err');void el.offsetWidth;el.classList.add('err')}}};

/* arcade card */
const _ra=renderArcade;renderArcade=function(){_ra.apply(this,arguments);const g=$('#s-arcade .games');if(!g||g.querySelector('[data-act=bridge]'))return;const lock=false;
 g.insertAdjacentHTML('beforeend',`<div class="game panel"><div class="gart brart"><div class="mini-para">Once upon a time, a brave hero typed a whole story...</div><div class="mini-bridge">${'<i></i>'.repeat(7)}</div></div><h3>Story Bridge</h3><p>Type a whole story to build a bridge!</p>
 <div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.bridge||0}</b><span>Best WPM</span></div><div class="arcade-stat"><b>${S.arc.brwin||0}</b><span>Wins</span></div><div class="arcade-stat level"><b>${typeof arcadeHighest==='function'?arcadeHighest('bridge'):''}</b><span>Highest level beaten</span></div></div>
 <button class="btn ${lock?'alt':''}" data-act="bridge">${lock?'After Lesson '+UNLOCK:'Play'}</button></div>`)};

/* challenge links */
const _srh=shareRunHTML;shareRunHTML=function(game,stats){if(game!=='Story Bridge')return _srh.apply(this,arguments);
 runShareChallenge=G.challengeData&&G.challengeData.g==='bridge'?G.challengeData:null;const rematch=!!G.ghostBeat;
 runShareText=`Keyloria Kingdom — Story Bridge\n${stats}\n${rematch?'I beat your ghost! Can you beat mine?':'Can you cross the bridge faster than my ghost?'}`;
 return `<button class="btn alt chal" data-act="copyRun">${rematch?'Send rematch challenge':'Challenge a friend'}</button>`};
if(typeof ghostRematchWon==='function'){const _grw=ghostRematchWon;ghostRematchWon=function(){if(G&&G.type==='bridge')return !!G.ghostBeat;return _grw.apply(this,arguments)}}
if(typeof ghostInviteModal==='function'){const _gim=ghostInviteModal;ghostInviteModal=function(data){if(!data||data.g!=='bridge')return _gim.apply(this,arguments);challengeToStart=data;
 modal(`<h2>A friend challenged you!</h2><p><b>Story Bridge</b>: Type the same story and race your friend’s ghost across the bridge.</p><div class="rbtns"><button class="btn" data-act="ghostStart">Play the challenge</button><button class="btn alt" data-act="ghostDismiss">Maybe later</button></div>${typeof ghostFooterHTML==='function'?ghostFooterHTML():''}`)}}
const _gst=ACT.ghostStart;ACT.ghostStart=function(){const c=typeof challengeToStart!=='undefined'?challengeToStart:null;if(!c||c.g!=='bridge')return _gst.apply(this,arguments);
 S.set.arcd=c.d;S.set.arcNumbers=c.n;S.set.arcSymbols=c.s;S.set.len=c.l;save();closeModal();BGHOST=c;try{ACT.bridge()}finally{BGHOST=null}};
})();
