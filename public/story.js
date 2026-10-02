/* Keyloria Kingdom story: "The Scrambled Keystone" — world intros, boss taunts, shard cutscenes, shard meter. */
const STORY=[
 {boss:'Smudge',bt:'a clumsy ink blob',intro:['Long ago, the Keystone kept every word in Keyloria in perfect order.','Then the Scrambler King smashed it into 10 shards and hid them across the kingdom!','Words got jumbled. The Keylori ran and hid. Only a hero who can type can fix it.','Your journey starts here, on the Home Row. Find your fingers and let’s go!'],
  taunt:['Hee hee! I spilled ink all over the Home Row!','You’ll never get my shard back... unless you can type REALLY well!'],out:'Smudge drops the first shard! The Home Row is clean again.'},
 {boss:'Thornwick',bt:'a sneaky vine witch',intro:['The trail leads into the Whispering Woods.','Vines have tangled the words on every path. Something sneaky lives here...'],taunt:['My vines twist every word into knots!','Let’s see you untangle THIS!'],out:'The vines let go. Thornwick runs off and the second shard glows!'},
 {boss:'Rumbletusk',bt:'a grumpy storm yeti',intro:['High in the Thunder Peaks, the wind howls.','Someone up here only knows how to SHOUT.'],taunt:['WHO DARES CLIMB MY MOUNTAIN?!','I WILL SHOUT YOUR WORDS RIGHT OFF THE CLIFF!'],out:'Rumbletusk finally calms down... and hands over shard number three.'},
 {boss:'Captain Clatter',bt:'a crab pirate',intro:['Waves crash on the Coral Coast.','A pirate ship is anchored nearby... and all the numbers have gone missing!'],taunt:['Arr! I pinched every number in the sea!','Ye’ll have to type faster than me claws can snap!'],out:'Captain Clatter sails away. The numbers wash ashore with shard four!'},
 {boss:'Mirage',bt:'a trickster sand spirit',intro:['The Sunscorch Dunes shimmer in the heat.','Careful... not every word you see out here is real.'],taunt:['Is that word real? Or is it a mirage? Hee hee!','Type the wrong one and you’ll be lost in the sand!'],out:'The illusion fades. Mirage is gone, and shard five sparkles in the sand.'},
 {boss:'Glacia',bt:'an ice queen',intro:['Brr! Frostfang Tundra is frozen solid.','Even the commas and quotes are stuck in the ice.'],taunt:['Every comma, every quote, frozen forever!','Your fingers will freeze before you reach my shard.'],out:'The ice melts! Glacia shivers off, and shard six is free.'},
 {boss:'Sporegloom',bt:'a mushroom sorcerer',intro:['Deep in Glowcap Hollow, the mushrooms glow.','The Keylori here have all fallen asleep. Something is putting them to sleep...'],taunt:['Shhh... my spores make everyone sleepy...','You’re getting sleepy too... yawn...'],out:'The Keylori wake up! Sporegloom slinks away and shard seven glows.'},
 {boss:'Gearjam',bt:'a broken robot',intro:['Cogwork City clanks and whirs.','But the symbols are all jammed: @ # & * are stuck in the gears!'],taunt:['BEEP. SYMBOLS JAMMED. RESISTANCE IS... BZZT... FUTILE.','TYPE ALL MY SYMBOLS. YOU. CANNOT.'],out:'Gearjam reboots as a friendly bot and gives back shard eight!'},
 {boss:'Nimbus Rex',bt:'a cloud dragon',intro:['The Skyreach Isles float among the clouds.','A huge dragon is blowing the letters right out of the sky!'],taunt:['WHOOSH! I blow letters away like leaves!','Only the steadiest fingers can stand against my wind!'],out:'Nimbus Rex bows his head. Shard nine floats down to you.'},
 {boss:'The Scrambler King',bt:'ruler of the Scramblers',intro:['The Starfall Citadel. The last shard is here.','The Scrambler King is waiting at the top of the tower.','Every Keylori you met along the way is cheering for you!'],taunt:['So, you made it all the way here.','I scrambled every word because nobody ever let me play! Type your best!'],out:'The Keystone is whole again! The Scrambler King says sorry... and asks to be your friend. Keyloria is saved!'}];
const storyState=()=>{S.story=S.story||{};S.story.intro=S.story.intro||{};S.story.taunt=S.story.taunt||{};S.story.shard=S.story.shard||{};return S.story};
/* existing players: quietly credit shards they already earned so cutscenes don't pile up */
function storyInit(){if(S.story&&S.story.v)return;const st=storyState();st.v=1;for(let w=1;w<=STORY.length;w++)if(shardWon(w)){st.shard[w]=1;st.intro[w]=1;st.taunt[w]=1}if(Object.keys(S.best||{}).length)st.intro[1]=st.intro[1]||0}
const worldLast=w=>(WSTART[w]||LESSONS.length)-1;
const shardWon=w=>(S.best[worldLast(w)+'-7']||0)>=1;
const shardCount=()=>STORY.reduce((n,_,k)=>n+(shardWon(k+1)?1:0),0);
const SHARD_COL=['#7fd8a0','#5aa04a','#a8a2c8','#5ab0d0','#e0b060','#bfe2f6','#a8c84a','#f0c860','#9ac4ea','#b8a0e8'];
function shardURL(w,on){return kku('shard'+w+(on?1:0),()=>{const c=on?SHARD_COL[w-1]:'#3a2f4e',d=shadeHex(on?c:'#3a2f4e',-.35),l=on?shadeHex(c,.4):'#4a3d62';
 return PXG(["..oo..",".oLHo.","oLHCDo","oLCCDo","oCCCDo",".oCDo.","..oo.."],{o:'#1b1626',H:on?'#ffffff':'#4a3d62',L:l,C:c,D:d})})}
/* boss lieutenant names on each world's final boss stage */
const _vn99=villainName;villainName=(i,boss)=>{const n=_vn99(i,boss);if(!boss)return n;const w=worldOf(i);return i===worldLast(w)&&STORY[w-1]?STORY[w-1].boss:n};
/* cutscene player */
let CUT=null;
function cutscene(w,lines,kind,done){const st=STORY[w-1];CUT={w,lines,kind,i:0,done};cutDraw()}
function cutDraw(){const c=CUT,st=STORY[c.w-1],last=c.i>=c.lines.length-1,vk=(typeof worldPool==='function'?worldPool(c.w):BADKEYS)[0];
 const boss=c.kind!=='intro'||c.i>=c.lines.length-1&&c.w>1?`<div class="cut-boss ${c.kind==='out'?'bye':''}">${typeof vilSVG==='function'?vilSVG(vk,true,1):''}<b>${esc(st.boss)}</b></div>`:'';
 const sky=c.kind==='out'?['#f6d8a8','#fbe8c8','#fff2dc','#fff8ec']:c.kind==='taunt'?['#3a2a5a','#4a3a6e','#5a4a82','#6a5a96']:['#5a8ac8','#7aa8dc','#9ac4ea','#bfe0f4'];
 modal(`<div class="cutscene"><div class="cut-stage">${backdrop(Math.min(9,c.w-1),sky)}<div class="cut-hero">${zookSVG()}</div>${boss}${c.kind==='out'?`<img class="cut-shard" src="${shardURL(c.w,true)}" alt="">`:''}</div>
  <div class="cut-tag">${c.kind==='intro'?`World ${c.w}: ${esc(WORLDS[c.w-1]?.name||'')}`:c.kind==='taunt'?`${esc(st.boss)}, ${esc(st.bt)}`:`Keystone shard ${c.w} of 10!`}</div>
  <p class="cut-text">${esc(c.lines[c.i])}</p><div class="cut-dots">${c.lines.map((_,k)=>`<i class="${k<=c.i?'on':''}"></i>`).join('')}</div>
  <div class="rbtns"><button class="btn" data-act="cutNext">${last?(c.kind==='taunt'?'Let’s battle!':'Continue'):'Next ▸'}</button>${!last?'<button class="btn alt" data-act="cutSkip">Skip</button>':''}</div></div>`);
 if(c.kind==='out'&&last)sfx.win&&sfx.win()}
ACT.cutNext=()=>{const c=CUT;if(!c)return closeModal();if(c.i<c.lines.length-1){c.i++;sfx.click&&sfx.click();return cutDraw()}CUT=null;closeModal();c.done&&c.done()};
ACT.cutSkip=()=>{const c=CUT;CUT=null;closeModal();c&&c.done&&c.done()};
/* hooks: intro before a world's first lesson, taunt before its final boss, shard scene after winning it */
const _ss99=startStage;startStage=function(n,mode){const args=arguments;if(mode)return _ss99.apply(this,args);const i=Math.floor(n/NST),s=n%NST,w=worldOf(i),st=storyState();
 if(STORY[w-1]&&!st.intro[w]){st.intro[w]=1;save();return cutscene(w,STORY[w-1].intro,'intro',()=>startStage(n,mode))}
 if(STORY[w-1]&&i===worldLast(w)&&s===7&&!st.taunt[w]){st.taunt[w]=1;save();return cutscene(w,STORY[w-1].taunt,'taunt',()=>startStage(n,mode))}
 return _ss99.apply(this,args)};
let PENDING_OUT=null;
const _res99=results;results=function(r){_res99(r);try{const st=storyState();for(let w=1;w<=STORY.length;w++)if(shardWon(w)&&!st.shard[w]){st.shard[w]=1;save();PENDING_OUT=w;
  const b=document.querySelector('#mbox .bigstars');b&&b.insertAdjacentHTML('afterend',`<div class="banner gold shardban"><img src="${shardURL(w,true)}" alt=""> You won back Keystone shard ${w}!</div>`);break}}catch(e){}};
const _show99=show;show=function(id){_show99.apply(this,arguments);if(PENDING_OUT&&(id==='home'||id==='map')){const w=PENDING_OUT;PENDING_OUT=null;setTimeout(()=>cutscene(w,[STORY[w-1].out].concat(w===10?['Thank you, hero. Every word in Keyloria is safe again.']:[`${10-shardCount()} shard${10-shardCount()===1?'':'s'} left to find. Onward!`]),'out',()=>{}),250)}};
/* home: Keystone shard meter */
const _rh99=renderHome;renderHome=function(){_rh99();try{storyInit()}catch(e){}const t=$('#s-home .tcard');if(!t||!S.name||t.querySelector('.shards'))return;const n=shardCount();
 t.insertAdjacentHTML('afterbegin',`<button class="shards" data-act="storyRecap" aria-label="Keystone shards"><span class="sh-lab">Keystone ${n}/10</span><span class="sh-row">${STORY.map((_,k)=>`<img src="${shardURL(k+1,shardWon(k+1))}" alt="">`).join('')}</span></button>`)};
ACT.storyRecap=()=>{const n=shardCount(),w=Math.min(10,n+1);modal(`<h2>The Scrambled Keystone</h2><p style="margin:0">${n===10?'You restored the whole Keystone! Keyloria is saved.':`You have ${n} of 10 shards. ${esc(STORY[w-1].boss)} (${esc(STORY[w-1].bt)}) guards shard ${w} in ${esc(WORLDS[w-1]?.name||'')}.`}</p>
 <div class="sh-big">${STORY.map((st,k)=>`<div class="${shardWon(k+1)?'on':''}"><img src="${shardURL(k+1,shardWon(k+1))}" alt=""><small>${shardWon(k+1)?esc(st.boss):'???'}</small></div>`).join('')}</div>
 <div class="rbtns"><button class="btn" data-act="replayIntro">Replay the story</button><button class="btn alt" data-act="close">Close</button></div>`)};
ACT.replayIntro=()=>{closeModal();cutscene(1,STORY[0].intro,'intro',()=>{})};
if(typeof screen!=='undefined'&&screen==='home')renderHome();
