/* A race challenge carries the text and a small replay in its link. */
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
 G.ghostTrack=[];
 if(!ghostToStart)return;
 const invite=ghostToStart;
 G.ghostInvite=invite;
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
  const url=new URL(location.href);url.search='';url.hash='';
  url.searchParams.set('ghost',ghostEncode({v:1,t:G.text,d:G.arcLevel||'auto',a:accuracy,f:frames}));
  G.ghostLink=url.href;
 }
 regularEndRace();
};
function ghostRaceSummary(){
 if(!G.ghostInvite)return '';
 const friendSeconds=G.ghostInvite.f.at(-1)[1]/10;
 const yours=(G.ghostFinishMs/1000).toFixed(1);
 return `<div class="ghost-summary"><b>${G.racers[0].fin?'Your friend finished first!':'You beat your friend’s ghost!'}</b><span>You: ${yours}s · Friend: ${friendSeconds.toFixed(1)}s (${G.ghostInvite.a}% accuracy)</span></div>`;
}
ACT.ghostStart=()=>{
 if(!ghostIncoming)return;
 ghostToStart=ghostIncoming;
 closeModal();
 try{startRace()}finally{ghostToStart=null}
};
ACT.ghostDismiss=()=>{
 closeModal();
 const url=new URL(location.href);url.searchParams.delete('ghost');
 history.replaceState(history.state,'',url.href);
};
if(new URLSearchParams(location.search).has('ghost')){
 if(ghostIncoming)modal(`<h2>A friend challenged you!</h2><p>Race their typing ghost on the same words. Can you finish first?</p><div class="rbtns"><button class="btn" data-act="ghostStart">Race the ghost</button><button class="btn alt" data-act="ghostDismiss">Maybe later</button></div>`);
 else modal('<h2>Challenge link not found</h2><p>This race link may be incomplete. Ask your friend to copy the challenge again.</p><div class="rbtns"><button class="btn" data-act="ghostDismiss">Play normally</button></div>');
}
