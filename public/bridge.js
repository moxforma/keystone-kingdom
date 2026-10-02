/* Story Bridge: type a whole paragraph to build a bridge before the Scrambler cuts the rope */
(function(){
const TXT=(typeof KK_TEXT!=='undefined'&&KK_TEXT)||{para:[]};
const UNLOCK=14;
const progLesson=()=>Math.floor(Math.max(0,nextStage())/NST);
const SYM='!?@#$%&*+-=/';
function prepText(t){const p=progLesson();
 if(p<15)t=t.toLowerCase();
 if(p<22)t=t.replace(/[!?]/g,'.').replace(/["']/g,'');
 if(typeof arcadeNumberOn==='function'){if(!arcadeNumberOn())t=t.replace(/\d/g,'');if(!arcadeSymbolOn())t=t.replace(/[!?]/g,'.').replace(/[@#$%&*+=\/]/g,'')}
 return t.replace(/\s+/g,' ').replace(/\.\.+/g,'.').trim()}
function wpmTarget(){const d=S.set.arcd||'auto';if(window.INSANE)return 66;return d==='beast'?48:d==='hard'?30:d==='medium'?20:d==='easy'?12:Math.max(10,Math.min(40,Math.round((typeof avgWpm==='function'?avgWpm():12)*.85)))}
let LASTP=null;
ACT.bridge=()=>{if(progLesson()<UNLOCK){toast('Story Bridge unlocks after Lesson '+UNLOCK+'!');return}
 const pool=TXT.para.filter(x=>x!==LASTP);let raw=rand(pool.length?pool:TXT.para)||'The bridge is ready. Type to cross it.';LASTP=raw;
 if(S.set.arcd==='beast'){const two=rand(TXT.para.filter(x=>x!==raw));if(two)raw+=' '+two}
 const text=prepText(raw),words=text.split(' '),wpm=wpmTarget(),limit=Math.round(text.length/5/wpm*60+6);
 mountGame('Story Bridge','Type the story to build the bridge!','Words','Rope');
 G={type:'bridge',text,pos:0,mist:new Set(),words,wi:0,limit,left:limit,done:false,start:0,score:0,combo:0,arcLevel:typeof arcadeLevelNow==='function'?arcadeLevelNow():'auto'};
 $('#gsw').hidden=true;const ar=$('#garena');ar.className='garena bridge-arena';
 let starts=[],k=0;words.forEach(w=>{starts.push(k);k+=w.length+1});G.starts=starts;
 ar.innerHTML=`${backdrop(3,['#2a2a6a','#3a3a8a','#5a4a9a','#7a5aa8'])}${cloudsHTML()}
 <div class="br-para" id="brpara">${[...text].map((c,i)=>`<span id="bc${i}" class="${c===' '?'sp':''}">${c===' '?' ':esc(c)}</span>`).join('')}</div>
 <div class="br-chasm"><div class="br-cliff l"></div><div class="br-cliff r"></div>
  <div class="br-rope top" id="brrope"><i id="brropei"></i></div>
  <div class="br-planks" id="brplanks">${words.map((w,i)=>`<i id="bp${i}"></i>`).join('')}</div>
  <div class="br-hero" id="brhero">${zookSVG()}</div><div class="br-goal">${glitchSVG(0,true)}</div></div>`;
 setAvailAll();paint();G.raf=requestAnimationFrame(tick)};
function setAvailAll(){try{setAvail(new Set([...keyEls.keys()]),true);applyLabels()}catch(e){}}
function paint(){const prev=$('#brpara .cur');prev&&prev.classList.remove('cur');const el=$('#bc'+G.pos);if(el){el.classList.add('cur');const box=$('#brpara');const top=el.offsetTop-box.offsetTop;if(top<box.scrollTop+8||top>box.scrollTop+box.clientHeight-40)box.scrollTop=Math.max(0,top-box.clientHeight/3)}
 setTarget(G.text[G.pos]||null);$('#g-a').textContent=G.wi+'/'+G.words.length;
 const f=G.wi/G.words.length,h=$('#brhero');if(h)h.style.left=`calc(4% + ${f*82}%)`}
function wordDone(){const pl=$('#bp'+G.wi);pl&&pl.classList.add('on');G.wi++;G.score+=10+G.combo;try{tone(520+G.wi*6,.06,'square',.04)}catch(e){}}
function finish(won){if(G.done)return;const secs=(performance.now()-(G.start||performance.now()))/1000,wpm=Math.round(G.pos/5/Math.max(secs/60,1/60)),acc=Math.round((G.pos-[...G.mist].length)/Math.max(1,G.pos)*100);
 S.arc.bridge=Math.max(S.arc.bridge||0,won?wpm:0);if(won)S.arc.brwin=(S.arc.brwin||0)+1;if(typeof arcadeRecordWin==='function')arcadeRecordWin('bridge',won);
 const ar=$('#garena');ar&&ar.classList.add(won?'br-won':'br-lost');
 const gems=won?Math.max(2,Math.round(G.words.length/6)+(acc>=95?3:acc>=85?1:0)):Math.max(1,Math.floor(G.wi/12));
 xEnd(won?'You crossed the bridge!':'The rope snapped!',[[wpm,'WPM'],[Math.max(0,acc)+'%','Accuracy'],[G.wi+'/'+G.words.length,'Words']],gems,'bridge',won?'<div class="banner gold">The Scrambler runs away!</div>':'<div class="banner">So close! Try a slower speed setting.</div>')}
function tick(now){if(G.done||G.type!=='bridge')return;if(G.start){G.left=G.limit-(now-G.start)/1000;$('#g-b').textContent=Math.max(0,Math.ceil(G.left));const r=$('#brropei');if(r)r.style.width=Math.max(0,G.left/G.limit*100)+'%';
  if(G.left<8)$('#brrope')?.classList.add('fray');if(G.left<=0)return finish(false)}else $('#g-b').textContent=G.limit;
 G.raf=requestAnimationFrame(tick)}
const _gi=gameInput;gameInput=function(ch,caps){if(!(typeof G!=='undefined'&&G&&G.type==='bridge'))return _gi.apply(this,arguments);if(G.done)return;
 try{pressFx(ch===' '?'space':ch.toLowerCase())}catch(e){}if(!G.start)G.start=performance.now();
 const t=G.text[G.pos];if(t===undefined)return;
 if(matchKey(ch,t,caps)){const el=$('#bc'+G.pos);el&&el.classList.add(G.mist.has(G.pos)?'bad':'ok');G.pos++;G.combo++;try{sfx.ok(G.combo)}catch(e){}
  if(t===' '||G.pos>=G.text.length)wordDone();if(G.pos>=G.text.length){paint();return finish(true)}paint()}
 else{G.mist.add(G.pos);G.combo=0;try{sfx.bad()}catch(e){}const pl=$('#bp'+G.wi);if(pl){pl.classList.remove('wob');void pl.offsetWidth;pl.classList.add('wob')}const el=$('#bc'+G.pos);if(el){el.classList.remove('err');void el.offsetWidth;el.classList.add('err')}}};

/* arcade card */
const _ra=renderArcade;renderArcade=function(){_ra.apply(this,arguments);const g=$('#s-arcade .games');if(!g||g.querySelector('[data-act=bridge]'))return;const lock=progLesson()<UNLOCK;
 g.insertAdjacentHTML('beforeend',`<div class="game panel"><div class="gart brart"><div class="mini-para">Once upon a time, a brave hero typed a whole story...</div><div class="mini-bridge">${'<i></i>'.repeat(7)}</div></div><h3>Story Bridge</h3><p>Type a whole story to build a bridge!</p>
 <div class="arcade-stats"><div class="arcade-stat"><b>${S.arc.bridge||0}</b><span>Best WPM</span></div><div class="arcade-stat"><b>${S.arc.brwin||0}</b><span>Wins</span></div><div class="arcade-stat level"><b>${typeof arcadeHighest==='function'?arcadeHighest('bridge'):''}</b><span>Highest level beaten</span></div></div>
 <button class="btn ${lock?'alt':''}" data-act="bridge">${lock?'After Lesson '+UNLOCK:'Play'}</button></div>`)};
})();
