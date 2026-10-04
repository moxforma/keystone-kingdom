/* Arcade ghost challenges replay a friend's progress from a short link. */
const ghostEncode=value=>{
 const bytes=new TextEncoder().encode(JSON.stringify(value));
 return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
};
const ghostDecode=value=>{
 try{
  if(!value||value.length>12000)return null;
  const bytes=Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),ch=>ch.charCodeAt(0));
  const data=JSON.parse(new TextDecoder().decode(bytes));
  if(data.v!==1||typeof data.t!=='string'||data.t.length<4||data.t.length>1000||/[\x00-\x1f]/.test(data.t))return null;
  if(!['auto','easy','medium','hard','beast'].includes(data.d)||!Number.isInteger(data.a)||data.a<0||data.a>100)return null;
  if(!Array.isArray(data.f)||data.f.length<2||data.f.length>202)return null;
  let pos=-1,time=-1;
  for(const pair of data.f){
   if(!Array.isArray(pair)||pair.length!==2||!Number.isInteger(pair[0])||!Number.isInteger(pair[1]))return null;
   if(pair[0]<0||pair[0]>data.t.length||pair[1]<0||pair[1]>36000||pair[0]<=pos||pair[1]<time)return null;
   [pos,time]=pair;
  }
  if(data.f[0][0]!==0||data.f[0][1]!==0||pos!==data.t.length||time<1)return null;
  return data;
 }catch(e){return null}
};
const ghostIncoming=ghostDecode(new URLSearchParams(location.search).get('ghost'));
let ghostToStart=null;
let challengeToStart=ghostIncoming;
const ghostSettings=()=>({d:(S.set.arcd||'auto').startsWith('beast')?'beast':S.set.arcd||'auto',n:S.set.arcNumbers===true,s:S.set.arcSymbols===true,l:S.set.len});
const ghostFooterHTML=()=>`<a class="ghost-home" href="/play/"><img src="${LOGO_URL}" alt="Keyloria Kingdom"><span>Explore the kingdom<small>More typing adventures await.</small></span></a>`;
function ghostFooterMount(){ $('#s-game > .ghost-home')?.remove();if(G.ghostInvite)$('#s-game').insertAdjacentHTML('beforeend',ghostFooterHTML()) }
const ghostElapsed=()=>Math.max(1,Math.round((performance.now()-G.ghostStartTime)/100));
const ghostMeteorWord=index=>arcadeBonus(index,5)||(G.words&&Math.random()<.6?rand(G.words):rand(G.set));
function ghostWaveDeck(queue){return queue.map(sp=>({kind:sp.kind,size:sp.size,txt:gw(sp.size)}))}
function ghostFutureWave(index){
 const n=Math.round([5,6,7][index]*S.set.len),sizes=[['s','s','m'],['s','m','m'],['m','m','l']][index];
 const queue=Array.from({length:n},()=>({kind:'bad',size:rand(sizes)}));
 queue.splice(Math.floor(n/2),0,{kind:'friend',size:'m'});
 return ghostWaveDeck(queue);
}
function ghostBossText(){
 if(G.beast)return beastBossText();
 const text=G.i>=16?rand(SENT.filter(s=>s.length<=22)):G.ok.length>=8?fillWords(G.ok,11):groups(()=>rand(G.letters),7,2,3);
 return arcadePhrase(text,true);
}
function ghostScoreAt(frames,time){
 let score=0;
 for(const [points,at] of frames){if(at>time)break;score=points}
 return score;
}
function ghostWaveFrameAt(frames,time){
 let current=frames[0];
 for(const frame of frames){if(frame[1]>time)break;current=frame}
 return current;
}
function ghostTrackWave(){
 if(G?.type!=='glitch'||!G.ghostWaveTimeline)return;
 const progress=glitchProgress(),position=Math.round(progress.fraction*1000),track=G.ghostWaveTimeline;
 if(track.at(-1)[0]!==position)track.push([position,ghostElapsed(),progress.wave,progress.done,progress.total]);
}
function ghostWaveDisplay(){
 const self=$('#trkG'),invite=G?.ghostInvite;
 if(!self||G?.type!=='glitch'||!invite?.p){$('#trkFriend')?.remove();self?.classList.remove('ghost-self');self?.querySelector('.ghost-owner')?.remove();return}
 if(!self.classList.contains('ghost-self')){
  self.classList.add('ghost-self');self.insertAdjacentHTML('afterbegin','<span class="ghost-owner">YOU</span>');
 }
 let friend=$('#trkFriend');
 if(!friend){
  self.insertAdjacentHTML('afterend',trackerHTML('trkFriend'));
  friend=$('#trkFriend');friend.classList.add('ghost-friend');
  friend.insertAdjacentHTML('afterbegin','<span class="ghost-owner">FRIEND’S GHOST</span>');
 }
 const elapsed=Math.max(0,Math.round((performance.now()-G.ghostStartTime)/100));
 const frame=ghostWaveFrameAt(invite.p,elapsed);
 const label=frame[2]>G.waves?(frame[0]===1000?'Boss beaten!':`Boss · ${frame[3]}/${frame[4]} words`):`Wave ${frame[2]} · ${frame[3]}/${frame[4]}`;
 setTrk(friend,frame[0]/1000,label);
}
function ghostTrackScore(){
 if(!G||!['meteor','glitch'].includes(G.type)||!G.ghostTimeline)return;
 const score=G.score||0,track=G.ghostTimeline;
 if(track.at(-1)[0]!==score)track.push([score,ghostElapsed()]);
}
function ghostScoreBar(){
 $('#ghud').insertAdjacentHTML('afterend','<div class="ghost-scorebar" id="ghostScore"><span>You: <b id="ghostYou">0</b></span><strong>Ghost score challenge</strong><span>Friend: <b id="ghostFriend">0</b></span></div>');
}
function ghostScoreTick(now){
 if(!G.ghostInvite||G.ghostInvite.g==='race'||!G.ghostStartTime)return;
 const friend=ghostScoreAt(G.ghostInvite.f,Math.max(0,Math.round((now-G.ghostStartTime)/100)));
 const you=$('#ghostYou'),them=$('#ghostFriend');
 if(you)you.textContent=G.score;
 if(them)them.textContent=friend;
}

const regularStartMeteor=startMeteor;
startMeteor=function(){
 regularStartMeteor();
 $('#ghostScore')?.remove();
 $('#s-game > .ghost-home')?.remove();
 G.ghostStartTime=performance.now();
 G.ghostTimeline=[[0,0]];
 G.wordDeck=ghostToStart?.g==='meteor'&&ghostToStart.q?ghostToStart.q:Array.from({length:G.total},(_,index)=>ghostMeteorWord(index));
 if(ghostToStart?.g==='meteor'){
  G.ghostInvite=ghostToStart;
  if(ghostToStart.q){G.total=G.wordDeck.length;G.words=ghostToStart.m?G.wordDeck:null}
  ghostScoreBar();ghostFooterMount();
 }
};
const regularStartGlitch=startGlitch;
startGlitch=function(){
 regularStartGlitch();
 $('#ghostScore')?.remove();
 $('#s-game > .ghost-home')?.remove();
 G.ghostStartTime=performance.now();
 G.ghostTimeline=[[0,0]];
 if(ghostToStart?.g==='glitch'&&ghostToStart.q){
  G.waveDecks=ghostToStart.q.map(wave=>wave.map(([kind,size,txt])=>({kind,size,txt})));
  G.bossWords=ghostToStart.b;
 }else{
  G.waveDecks=[ghostWaveDeck(G.queue),ghostFutureWave(1),ghostFutureWave(2)];
  G.bossWords=Array.from({length:10},ghostBossText);
 }
 G.bossWordIndex=0;G.queue=G.waveDecks[0].map(sp=>({...sp}));
 G.waveWordsTotal=G.queue.length;
 const progress=glitchProgress();
 G.ghostWaveTimeline=[[0,0,progress.wave,progress.done,progress.total]];
 if(ghostToStart?.g==='glitch'){G.ghostInvite=ghostToStart;ghostScoreBar();ghostFooterMount()}
};
const regularBossPhrase=bossPhrase;
bossPhrase=function(){
 if(!G.bossWords?.[G.bossWordIndex])return regularBossPhrase();
 const b=G.boss;b.txt=G.bossWords[G.bossWordIndex++];b.typed=0;b.t=0;
 b.lim=G.beast?b.txt.length/7+2.5:b.txt.length*1.5/G.speed+4;
 paintLab(b);gHint();
};
const regularGameInput=gameInput;
gameInput=function(ch,caps){
 const result=regularGameInput(ch,caps);
 ghostTrackScore();
 ghostTrackWave();
 return result;
};
const regularMeteorTick=mTick;
mTick=function(now){ghostScoreTick(now);return regularMeteorTick(now)};
const regularGlitchTick=gTick;
gTick=function(now){ghostScoreTick(now);const result=regularGlitchTick(now);ghostTrackWave();return result};

function ghostProgress(pos){
 if(G.type!=='race'||!G.ghostTrack||!G.start)return;
 const step=Math.max(1,Math.ceil(G.text.length/120));
 if(pos%step===0||pos===G.text.length)G.ghostTrack.push([pos,Math.max(0,Math.round((performance.now()-G.start)/100))]);
}
function ghostPosition(frames,time){
 if(time<=0)return 0;
 for(let i=1;i<frames.length;i++){
  const [p,t]=frames[i], [prevP,prevT]=frames[i-1];
  if(time<=t)return t===prevT?p:prevP+(p-prevP)*(time-prevT)/(t-prevT);
 }
 return frames.at(-1)[0];
}
const regularStartRace=startRace;
startRace=function(){
 regularStartRace();
 $('#ghostScore')?.remove();
 $('#s-game > .ghost-home')?.remove();
 G.ghostTrack=[];
 if(!ghostToStart||ghostToStart.g&&ghostToStart.g!=='race')return;
 const invite=ghostToStart;
 G.ghostInvite=invite;
 ghostFooterMount();
 G.arcLevel=invite.d;
 G.text=invite.t;
 G.pos=0;
 G.mist=new Set();
 G.racers=[{a:0,b:0,w:0,p:0,fin:0}];
 $('#garena').className='garena race-arena ghost-arena';
 $('#garena').innerHTML='<div class="finish"></div><div class="lane"><span class="ghost-label">You</span><div class="runner" id="rn0">'+zookSVG()+'</div></div><div class="lane"><span class="ghost-label">Friend’s ghost</span><div class="runner ghost-runner" id="rn1">'+zookSVG()+'</div></div>';
 $('#gstripIn').innerHTML=[...G.text].map(ch=>`<span class="${ch===' '?'sp':''}">${ch===' '?'·':esc(ch)}</span>`).join('');
 if(/[^a-zA-Z\s]/.test(G.text)){setAvail(new Set([...keyEls.keys()]),true);applyLabels()}
 const subtitle=$('#ghud .ht span');if(subtitle)subtitle.textContent='Race your friend’s ghost!';
 raceStrip();
};
const regularRaceTick=rTick;
rTick=function(now){
 if(!G.ghostInvite)return regularRaceTick(now);
 if(G.done)return;
 if(G.start){
  const elapsed=Math.max(0,Math.round((now-G.start)/100));
  const friend=G.racers[0],me=G.pos/G.text.length;
  friend.p=Math.min(1,ghostPosition(G.ghostInvite.f,elapsed)/G.text.length);
  if(friend.p>=1)friend.fin=1;
  const runner=$('#rn1');if(runner)runner.style.left=friend.p*84+'%';
  $('#g-a').textContent=G.pos?Math.round(G.pos/5/Math.max((now-G.start)/60000,1/60)):0;
  $('#g-b').textContent=friend.p>me?'2nd':'1st';
 }
 G.raf=requestAnimationFrame(rTick);
};
const regularEndRace=endRace;
endRace=function(){
 if(G.type==='race'&&G.start){
  const elapsed=Math.max(1,Math.round((performance.now()-G.start)/100));
  if(G.ghostInvite){
   G.ghostFinishMs=elapsed*100;
   G.racers[0].fin=elapsed>=G.ghostInvite.f.at(-1)[1]?1:0;
  }
  const frames=[[0,0],...(G.ghostTrack||[])];
  if(frames.at(-1)[0]!==G.text.length)frames.push([G.text.length,elapsed]);
  else frames.at(-1)[1]=Math.max(frames.at(-1)[1],elapsed);
  const accuracy=Math.max(0,Math.min(100,Math.round((G.text.length-G.mist.size)/G.text.length*100)));
  G.challengeData={v:2,g:'race',...ghostSettings(),t:G.text,a:accuracy,f:frames};
 }
 regularEndRace();
};
const regularEndMeteor=endMeteor;
endMeteor=function(){
 ghostTrackScore();
 const frames=[...G.ghostTimeline];
 const end=ghostElapsed(),score=G.score;
 if(frames.at(-1)[1]<end)frames.push([score,end]);
 G.challengeData={v:2,g:'meteor',...ghostSettings(),r:score,w:G.shields>0,f:frames,m:!!G.words,q:G.wordDeck};
 return regularEndMeteor();
};
const regularEndGlitch=endGlitch;
endGlitch=function(win){
 ghostTrackScore();
 ghostTrackWave();
 const frames=[...G.ghostTimeline];
 const end=ghostElapsed(),score=G.score;
 if(frames.at(-1)[1]<end)frames.push([score,end]);
 const progress=glitchProgress(),waveFrames=[...G.ghostWaveTimeline];
 if(waveFrames.at(-1)[1]<end)waveFrames.push([Math.round(progress.fraction*1000),end,progress.wave,progress.done,progress.total]);
 G.challengeData={v:2,g:'glitch',...ghostSettings(),r:score,w:!!win,f:frames,p:waveFrames,
  q:G.waveDecks.map(wave=>wave.map(sp=>[sp.kind,sp.size,sp.txt])),b:G.bossWords};
 return regularEndGlitch(win);
};
function ghostArcadeSummary(){
 const friend=G.ghostInvite;
 if(!friend||friend.g==='race')return '';
 const yourWin=G.type==='meteor'?G.shields>0:G.boss?.dead===true;
 const beat=yourWin!==friend.w?yourWin:G.score>friend.r;
 const tied=yourWin===friend.w&&G.score===friend.r;
 const yours=(G.challengeData.f.at(-1)[1]/10).toFixed(1),theirs=(friend.f.at(-1)[1]/10).toFixed(1);
 return `<div class="ghost-summary"><b>${tied?'A tie with your friend!':beat?'You beat your friend’s ghost!':'Your friend’s ghost won this time!'}</b><span>You: ${G.score} points, ${yours}s</span><span>Friend: ${friend.r} points, ${theirs}s</span></div>${ghostFooterHTML()}`;
}
function ghostRematchWon(){
 const friend=G.ghostInvite;
 if(!friend)return false;
 if(friend.g==='race')return !!G.ghostFinishMs&&G.ghostFinishMs<friend.f.at(-1)[1]*100;
 const yourWin=G.type==='meteor'?G.shields>0:G.boss?.dead===true;
 return G.score>friend.r;
}
function ghostRaceSummary(){
 if(!G.ghostInvite)return '';
 const friendSeconds=G.ghostInvite.f.at(-1)[1]/10;
 const yours=(G.ghostFinishMs/1000).toFixed(1);
 const myAcc=G.text&&G.text.length?Math.max(0,Math.min(100,Math.round((G.text.length-(G.mist?G.mist.size:0))/G.text.length*100))):100;
 return `<div class="ghost-summary"><b>${G.racers[0].fin?'Your friend finished first!':'You beat your friend’s ghost!'}</b><span>You: ${yours}s, ${myAcc}% accuracy</span><span>Friend: ${friendSeconds.toFixed(1)}s, ${G.ghostInvite.a}% accuracy</span></div>${ghostFooterHTML()}`;
}
ACT.ghostStart=()=>{
 const challenge=challengeToStart;
 if(!challenge)return;
 if(challenge.v===2){
  S.set.arcd=challenge.d;
  S.set.arcNumbers=challenge.n;
  S.set.arcSymbols=challenge.s;
  S.set.len=challenge.l;
  save();
 }
 ghostToStart=challenge;
 closeModal();
 try{({race:startRace,meteor:startMeteor,glitch:startGlitch})[challenge.g||'race']();setAvail(new Set([...keyEls.keys()]),true);applyLabels()}finally{ghostToStart=null}
};
ACT.ghostDismiss=()=>{
 closeModal();
 const url=new URL(location.href);url.searchParams.delete('ghost');url.searchParams.delete('c');
 history.replaceState(history.state,'',url.href);
};
ACT.copyRun=async()=>{
 const button=$('#mbox [data-act=copyRun]');
 if(button)button.disabled=true;
 try{
  let link='https://keystone-kingdom.netlify.app/';
  if(runShareChallenge){
   if(!G.challengeCode){
    const response=await fetch('/api/arcade-challenge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(runShareChallenge)});
    const body=await response.json();
    if(!response.ok||!body.id)throw new Error(body.error||'Could not create challenge');
    G.challengeCode=body.id;
   }
   const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('c',G.challengeCode);link=url.href;
  }
  const msg=runShareText+'\n'+link;
  try{await navigator.clipboard.writeText(msg)}catch(err){
   if(navigator.share){try{await navigator.share({text:msg});return}catch(e2){if(e2&&e2.name==='AbortError')return}}
   shareFallback(msg);return}
  toast(runShareChallenge?(ghostRematchWon()?'Rematch link copied! Send it to your friend.':'Short challenge link copied!'):'Result copied!');
 }catch(e){shareFallback(runShareText+'\nhttps://keystone-kingdom.netlify.app/')}
 finally{if(button)button.disabled=false}
};
function ghostInviteModal(data){
 challengeToStart=data;
 const name={race:'Keylori Race',meteor:'Meteor Zap',glitch:'Scrambler Attack'}[data.g||'race'];
 const description=data.g==='race'||!data.g?'Race your friend’s typing ghost on the same words.':
  data.g==='glitch'&&data.q?'Type the same words in the same order while your friend’s score and wave bar replay.':
  data.g==='meteor'&&data.q?'Zap the same meteors in the same order while your friend’s score replays.':
  data.g==='glitch'&&data.p?'Watch your friend’s score and wave bar replay as you type.':
  'Watch your friend’s score replay while you play at the same Arcade settings.';
 modal(`<h2>A friend challenged you!</h2><p><b>${name}</b>: ${description}</p><div class="rbtns"><button class="btn" data-act="ghostStart">Play the challenge</button><button class="btn alt" data-act="ghostDismiss">Maybe later</button></div>${ghostFooterHTML()}`);
}
const shortCode=new URLSearchParams(location.search).get('c');
if(shortCode){
 modal('<h2>Loading your challenge…</h2>');
 fetch('/api/arcade-challenge?id='+encodeURIComponent(shortCode))
  .then(response=>response.ok?response.json():Promise.reject())
  .then(body=>{if(!body.data||body.data.v!==2)throw Error('Invalid challenge');ghostInviteModal(body.data)})
  .catch(()=>modal('<h2>Challenge link not found</h2><p>Ask your friend to copy the challenge again.</p><div class="rbtns"><button class="btn" data-act="ghostDismiss">Play normally</button></div>'));
}
if(new URLSearchParams(location.search).has('ghost')){
 if(ghostIncoming)ghostInviteModal(ghostIncoming);
 else modal('<h2>Challenge link not found</h2><p>This race link may be incomplete. Ask your friend to copy the challenge again.</p><div class="rbtns"><button class="btn" data-act="ghostDismiss">Play normally</button></div>');
}

function shareFallback(msg){const box=document.createElement('div');box.className='sharefb';box.innerHTML=`<p>Copy this and send it to a friend:</p><textarea readonly rows="4"></textarea><button class="btn" type="button">Done</button>`;
 box.querySelector('textarea').value=msg;box.querySelector('button').onclick=()=>box.remove();document.body.appendChild(box);const t=box.querySelector('textarea');t.focus();t.select()}
