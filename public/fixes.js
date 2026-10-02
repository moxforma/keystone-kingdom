/* Space to skip/advance, pixel hearts, instructions on top, longer rounds, no repeated boss phrases, lesson stage picker, bonus worlds 11-12 */
(function(){
/* ---------- round length: Short = old Normal, Normal = old Long, Long = extra long ---------- */
function migLen(){try{if(!S||!S.set||S.set.lenv===2)return;if(!S.little){const m={0.6:1,1:1.4,1.4:1.8};S.set.len=m[S.set.len]!=null?m[S.set.len]:(S.set.len||1.4)}S.set.lenv=2;save()}catch(e){}}
migLen();
const _ld=load;load=function(){const r=_ld.apply(this,arguments);migLen();return r};
const _ss0=startStage;startStage=function(){migLen();return _ss0.apply(this,arguments)};

/* ---------- pixel-art hearts ---------- */
const HEART=PXG([".oo...oo.","oHRo.oRRo","oHRRoRRRo","oRRRRRRDo",".oRRRRDo.","..oRRDo..","...oDo...","....o...."],{o:'#2a1d3e',R:'#e8584f',H:'#ffd0c8',D:'#a83040'}).toDataURL();
document.head.insertAdjacentHTML('beforeend',`<style id="fixcss">
.heart{font-size:0!important;color:transparent!important;width:27px;height:24px;background:url(${HEART}) center/contain no-repeat;image-rendering:pixelated;animation-timing-function:steps(8)!important}
.arena .bubble{z-index:6!important}.arena .intro .ib{position:relative;z-index:4}.arena .intro>div:first-child{position:relative;z-index:1}
.stpick{margin:6px 0 2px;text-align:center}.stp-h{font-size:18px;margin-bottom:4px}.stp-h b{color:#6edc8c}.stp-h em{font-style:normal;color:#f0c860}
.stp-row{display:flex;gap:4px;justify-content:center;flex-wrap:wrap}
.stp{flex:0 0 auto;min-width:40px;padding:3px 4px;border:2px solid #2a1d3e;background:#3a2f4e;color:#fff6e0;font:inherit;font-size:16px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:0 2px 0 #1b1626}
.stp.ok{background:#2f6a4a}.stp.cur{outline:3px solid #f0c860;outline-offset:1px}.stp.boss b{color:#ff9a6a}.stp:disabled{opacity:.4;cursor:default}
.stp:not(:disabled):hover{transform:translateY(-1px)}.stp i{display:flex;gap:1px}.stp i img{width:9px;height:9px;image-rendering:pixelated}
.worldhead.w11{background:#24203e!important}.worldhead.w12{background:#3a2418!important}
</style>`);

/* ---------- Space: skip the catch + evolution, and always press the "next" button ---------- */
let CATCH_SKIP=null;
const _ca=catchAnim;catchAnim=function(done){let f=false;const d=()=>{if(f)return;f=true;CATCH_SKIP=null;done&&done()};CATCH_SKIP=d;return _ca(d)};
function primaryBtn(box){const rb=box.querySelector('.rbtns');if(!rb)return null;const bs=[...rb.querySelectorAll('button')].filter(b=>b.offsetParent&&!b.disabled);
 return rb.querySelector('.nextbtn')||bs.find(b=>/next|continue|let.?s go|let.?s battle|yay|awesome/i.test(b.textContent))||bs.find(b=>!b.classList.contains('alt')&&!b.classList.contains('iconbtn'))||bs[0]}
addEventListener('keydown',e=>{if(e.key!==' '&&e.key!=='Enter')return;const ae=document.activeElement;if(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName))return;
 if($('#lvlfx'))return;
 const stop=()=>{e.preventDefault();e.stopImmediatePropagation()};
 if(CATCH_SKIP){stop();CATCH_SKIP();return}
 const m=$('#modal');if(!m||m.hidden)return;
 const eb=$('#evoBtns');if(eb){stop();if(eb.style.visibility==='hidden'){window._evoFF&&window._evoFF()}else ACT.evoNext();return}
 if(e.key!==' ')return;
 const box=$('#mbox');if(!box||!(box.querySelector('.rstats')||box.querySelector('.cutscene')))return;
 const fl=box.querySelector('#flip');if(fl&&!fl.classList.contains('go')){stop();fl.classList.add('go');return}
 const b=primaryBtn(box);if(b){stop();b.click()}},true);

/* ---------- boss phrases never repeat in one session ---------- */
const SEEN=new Set();let depth=0;
const fresh=(fn,alt)=>function(){if(depth)return fn.apply(this,arguments);depth++;try{let t;for(let k=0;k<30;k++){t=fn.apply(this,arguments);if(!SEEN.has(t))break}
 for(let k=0;alt&&SEEN.has(t)&&k<15;k++){try{t=alt()||t}catch(e){break}}SEEN.add(t);return t}finally{depth--}};
const altBoss=()=>!G.beast&&G.ok&&G.ok.length>=8&&typeof fillWords==='function'?(typeof arcadePhrase==='function'?arcadePhrase(fillWords(G.ok,11+Math.floor(Math.random()*8)),true):fillWords(G.ok,14)):null;
if(typeof ghostBossText==='function')ghostBossText=fresh(ghostBossText,altBoss);
if(typeof beastBossText==='function')beastBossText=fresh(beastBossText);
if(typeof bossPhrase==='function'){const _bp=bossPhrase;bossPhrase=function(){const r=_bp.apply(this,arguments);try{const b=G.boss;if(b&&b.txt&&!G.bossWords){let k=0;while(SEEN.has(b.txt)&&k++<30)_bp.apply(this,arguments);SEEN.add(b.txt)}}catch(e){}return r}}

/* ---------- lesson finish: pick any stage of this lesson ---------- */
const STON=PXG(["..o..",".oYo.","oYYYo",".oYo.","o.o.o"],{o:'#2a1d3e',Y:'#f0c860'}).toDataURL(),STOFF=PXG(["..o..",".oGo.","oGGGo",".oGo.","o.o.o"],{o:'#2a1d3e',G:'#5a4e70'}).toDataURL();
function stagePick(){const box=$('#mbox');if(!box||screen==='game'||typeof P==='undefined'||P.practice||P.mode||P.i==null||!box.querySelector('.rstats')||box.querySelector('.stpick'))return;
 const i=P.i;let done=0,h='';for(let s=0;s<NST;s++){const n=i*NST+s,b=Math.min(3,S.best[i+'-'+s]||0),u=unlocked(n),boss=isBoss(i,s);if(b>=1)done++;
  h+=`<button class="stp ${b>=1?'ok':''} ${s===P.s?'cur':''} ${boss?'boss':''}" ${u?`data-act="play" data-n="${n}"`:'disabled'} title="${esc(stageName(i,s))}"><b>${boss?'BOSS':s+1}</b><i>${[0,1,2].map(k=>`<img src="${k<b?STON:STOFF}" alt="">`).join('')}</i></button>`}
 const el=`<div class="stpick"><div class="stp-h">This lesson: <b>${done} done</b> · <em>${NST-done} to go</em> · tap one to play</div><div class="stp-row">${h}</div></div>`;
 const R=box.querySelector('.fcol-r .rstats')||box.querySelector('.rstats');R.insertAdjacentHTML('afterend',el);
 requestAnimationFrame(()=>dispatchEvent(new Event('resize')))}
const _res=results;results=function(){const r=_res.apply(this,arguments);try{stagePick()}catch(e){console.warn(e)}return r};

/* ---------- bonus worlds 11 + 12 (harder than Starfall Citadel) ---------- */
const BW=[
 {name:'Obsidian Rift',color:'#6a66b0',desc:'Long words, names and tricky punctuation.',
  globe:{sea:'#1a1430',land:'#3a3050',l2:'#5a4a78',dots:'#7fe8ff'},terr:{kind:'peaks',deco:'crystal'},
  story:{boss:'Umbra',bt:'a hooded shadow wraith',intro:['The Keystone is whole again... but it cast a long, dark shadow.','The shadow tore open the Obsidian Rift, where words grow long and twisty.','Only a true Legend can type their way through. Ready?'],
   taunt:['I am the shadow of the Scrambler King!','Your fingers will tangle in my long, long words!'],out:'Umbra fades into the light. The Rift is sealing shut!'},
  les:[['x_long','Long Words'],['x_names','Names and Places'],['x_punct','Tricky Punctuation'],['x_mix','Numbers and Symbols'],['x_talk','Dialogue'],['x_sci','Science Words'],['x_rift','Rift Run']]},
 {name:'Eclipse Throne',color:'#d08a40',desc:'Expert speed, precision and epic stories.',
  globe:{sea:'#120c24',land:'#4a2a20',l2:'#e08a3a',ring:'#f0c860',stars:1},terr:{kind:'city',deco:'gear'},
  story:{boss:'Eclipsar',bt:'an eclipse dragon',intro:['Past the Rift stands the Eclipse Throne, where the sun hides behind the moon.','A dragon sleeps there, guarding the hardest words in all of Keyloria.','This is the final test. Type fast, type true!'],
   taunt:['Who wakes Eclipsar?!','No hero has ever typed past my eclipse!'],out:'Eclipsar bows to you. You are the greatest typist in Keyloria!'},
  les:[['z_speed','Speed Demon'],['z_code','Code Lines'],['z_twist','Mega Twisters'],['z_exact','Precision'],['z_chron','Epic Chronicle'],['z_mara','Marathon'],['z_final','Eclipse Trial']]}];
const TXT={
 x_long:['extraordinary','imagination','adventurous','magnificent','constellation','encyclopedia','thunderstorm','kaleidoscope','unbelievable','transformation','mysterious','invisible','celebration','independence','temperature','championship','hippopotamus','refrigerator','spectacular','photographer','caterpillar','neighborhood','grandparents','understanding','international','responsibility'],
 x_names:['Maya and Leo flew to Paris in June.','Captain Rivera sailed past Iceland.','Dr. Patel lives on Maple Street.','We hiked Mount Fuji in Japan.','Aunt Rosa baked bread in Toronto.','The Nile River flows through Egypt.','Grandpa Joe visited New York City.','Lake Superior is very cold in March.','Ms. Kim teaches music on Fridays.','The Amazon is a giant rainforest in Brazil.','Uncle Sam drove from Texas to Ohio.','Our class read about Antarctica in May.'],
 x_punct:['Wait; is that a dragon? No, it is a cloud!','She packed: maps, rope, and snacks.','Oh no... the bridge is gone!','We need three things: a key, a map, and luck.','Is it lunch yet? Not yet; soon!','The fox ran (very fast) into the woods.','Quick, hide! The giant is coming!','He said yes; she said no.','Ready, set... go!','Wow! Did you see that comet?','First, stretch; then, run.','The sign read: Do not feed the trolls!'],
 x_mix:['Room 42 has 3 doors & 7 keys.','Score: 9/10 (great job!)','Save 25% on 2 kites today.','Meet at 4:30 by gate #12.','I have $5.75 and 8 coins.','Level 3 + level 4 = 7 levels!','Step 1: open the box (gently).','The trip is 120 km, about 2 hours.','Our team won 15-12!','Email me at hero@keyloria.com today.','Mix 2 cups flour & 1 cup milk.','The 1st, 2nd & 3rd place get medals.'],
 x_talk:['"Hurry up!" called Nia. "The bridge is closing!"','"Can you hear that?" asked Tom.','"I found it!" shouted Ava.','"Shh," whispered Leo, "the dragon is asleep."','"Who ate my cookies?" asked Mom.','"Not me!" said the dog. Well, he wagged.','"Let us go home," sighed Max.','"Look up!" cried Zoe. "Stars!"','"Is it far?" asked Ben. "Very," said Gran.','"Ready?" asked the coach. "Ready!" we yelled.'],
 x_sci:['Photosynthesis helps plants turn sunlight into food.','Water freezes at zero degrees Celsius.','The planet Jupiter has a giant red storm.','Volcanoes push hot magma up from below.','Bats use echoes to find their way.','A caterpillar becomes a butterfly.','Gravity pulls everything toward the ground.','Our heart pumps blood all around the body.','Lightning is a giant spark of electricity.','The moon reflects light from the sun.','Bees carry pollen from flower to flower.','Earthquakes happen when rocks shift underground.'],
 x_rift:['The rift glowed purple in the dark.','Our hero stepped onto the floating stones.','Each stone held a long and tricky word.','One wrong key, and the stone would wobble!','The hero breathed slowly and kept typing.','Word by word, the path grew steady and bright.','Far ahead, a hooded shadow waited.','The hero smiled. It was time to finish this.'],
 z_speed:['the','and','you','that','was','for','are','with','they','have','this','from','one','had','word','but','not','what','all','were','when','your','can','said','there','each','which','she','how','their','will','other','about','out','many','then','them','these','some','would','make','like','time','look','more','write','number','could','people','first'],
 z_code:['let score = 10;','if (hp < 3) heal();','print("Hello, world!")','for (i = 0; i < 5; i++)','x = x + 1;','while (lives > 0) play();','name = "Keylori";','if (a == b) { win(); }','list = [1, 2, 3];','return speed * 2;','jump(); run(); jump();','total += coins;'],
 z_twist:['She sells sea shells by the sea shore.','Red lorry, yellow lorry, red lorry, yellow lorry.','Six slippery snails slid slowly seaward.','Fred fed Ted bread, and Ted fed Fred bread.','A big black bug bit a big black bear.','Fuzzy Wuzzy was a bear; Fuzzy Wuzzy had no hair.','Toy boat, toy boat, toy boat!','Peter Piper picked a peck of pickled peppers.','How can a clam cram in a clean cream can?','Truly rural, truly rural, truly rural.'],
 z_exact:['McKenzie and DeShawn met at NASA.','Mr. McGee drove a U-turn.','The T-Rex had tiny arms.','We took an X-ray of my wrist.','LaToya read about DNA.','Ms. O\'Neil saw a UFO!','MacLeod plays the bagpipes.','The USA has 50 states.','DeLuca won Gold in Rome.','Is it 3:15 PM or AM?'],
 z_chron:['Long ago, the Keystone shattered into ten shards.','A young hero set out to find every one.','The hero crossed meadows, woods and stormy peaks.','Pirates, spirits and giants stood in the way.','With every word typed true, a shard came home.','At last the Scrambler King fell, and the Keystone shone.','But a shadow slipped out, and a dragon woke.','Now the hero climbs the Eclipse Throne, ready for the final page.'],
 z_mara:['The race began at dawn, and the runners lined up in a long row.','Some ran fast at first, but the wise ones kept a steady pace.','Our hero sipped water, waved to friends, and kept on going.','The hills were steep, the wind was strong, and the sun was hot.','Still, step by step and key by key, the finish line came closer.','The crowd cheered as the hero crossed the line with a big smile.'],
 z_final:['The eclipse darkened the sky over the throne.','Eclipsar roared, and the letters began to spin!','"Type, hero, type!" called every Keylori at once.','Numbers flew by: 1, 2, 3, 4, 5... and symbols too: @ # & *!','The hero did not panic; fingers stayed on the home row.','One last sentence glowed in golden light.','With the final key, the sun burst free.','Keyloria cheered. A true Legend was born!']};
try{Object.assign(LSUM,{x_long:'Big words with lots of letters.',x_names:'Capital letters for names and places.',x_punct:'Semicolons, colons, dots and more.',x_mix:'Numbers and symbols mixed into sentences.',x_talk:'Quotes for people talking.',x_sci:'Cool science facts to type.',x_rift:'A story about crossing the Rift.',z_speed:'Common words, as fast as you can.',z_code:'Type real lines of code.',z_twist:'Super tricky tongue twisters.',z_exact:'Tricky capitals like McKenzie and NASA.',z_chron:'The whole story of Keyloria.',z_mara:'A long run. Keep a steady pace.',z_final:'Everything at once. Beat Eclipsar!'})}catch(e){}
const PARA=new Set(['x_rift','z_chron','z_mara','z_final']);
Object.assign(WT,TXT);
/* shadow cousins of existing Keylori for the 14 new lessons */
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),lum=c=>{const [r,g,b]=hx(c);return (r*.3+g*.59+b*.11)/255};
const toward=(c,d,f)=>{const a=hx(c),b=hx(d);return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*f).toString(16).padStart(2,'0')).join('')};
const shadowPal=pal=>{const o={};Object.entries(pal).forEach(([k,c])=>{o[k]=typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c)&&lum(c)<.82?toward(c,'#2e2a6a',.42):c});return o};
const BASE=KKDATA.order.length;
const keys=[...new Set(KKDATA.order.slice(0,BASE))].sort(),picks=Array.from({length:14},(_,k)=>keys[Math.floor(k*keys.length/14)]);
BW.forEach((W,wk)=>{const r=REGIONS.length,w=WORLDS.length+1;WSTART.push(LESSONS.length);WREG.push(r);REGIONS.push({name:W.name,color:W.color,desc:W.desc});WORLDS.push({name:W.name,from:r});
 W.les.forEach(([sp,t],j)=>{const key=picks[wk*7+j],idx=KKDATA.order.indexOf(key),base=SPECIES[idx],nk='sh_'+key;
  KKDATA.order.push(nk);KKDATA.spr[nk]=KKDATA.spr[key];KKDATA.pal[nk]=shadowPal(KKDATA.pal[key]);
  SPECIES.push({n:base.n.map(x=>'Shadow '+x),t:base.t,fl:base.fl});EVO.push(EVO[idx]);if(typeof EVOLUTION_FLAVOR!=='undefined')EVOLUTION_FLAVOR.push(EVOLUTION_FLAVOR[idx]);
  LESSONS.push({k:'',sp,r,t})});
 VIL[w]=wk?[...(VIL[9]||[]),...(VIL[10]||[])]:[...(VIL[7]||[]),...(VIL[8]||[])];if(!VIL[w].length)delete VIL[w];
 try{GLOBE.push(W.globe);TERR.push(W.terr)}catch(e){}
 STORY.push(W.story)});
TOTAL=LESSONS.length*3;
if(typeof window.rarOf==='function'){const _ro=window.rarOf;window.rarOf=i=>i>=BASE?2:_ro(i)}
/* story-style lessons read in order */
const _gt=genText;genText=function(i,s,pr){const L=LESSONS[i];if(pr||!L||!PARA.has(L.sp))return _gt.apply(this,arguments);
 const list=TXT[L.sp],len=Math.round((40+s*8)*(S.set.len||1.4)*(isBoss(i,s)?1.25:1));let out=[],k=s%list.length;while(out.join(' ').length<len){out.push(list[k%list.length]);k++}return out.join(' ')};
try{if(screen==='home')renderHome()}catch(e){}
})();
