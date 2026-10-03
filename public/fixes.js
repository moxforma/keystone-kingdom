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

/* ---------- tell kids they can press SPACE whenever it skips or continues ---------- */
{const pill=document.createElement('div');pill.id='spacehint';pill.hidden=true;document.body.appendChild(pill);
 document.head.insertAdjacentHTML('beforeend','<style>#spacehint{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:10050;background:#1b1626;color:#fff6e0;border:3px solid #f0c860;padding:6px 14px;font-size:16px;pointer-events:none;white-space:nowrap;box-shadow:0 4px 0 rgba(0,0,0,.4)}#spacehint b{display:inline-block;background:#f0c860;color:#2a1d3e;padding:0 10px;margin-right:6px;letter-spacing:1px}#spacehint[hidden]{display:none}body.mobile #spacehint{display:none!important}</style>');
 const why=()=>{if(window.KK_MOBILE||$('#lvlfx'))return '';if(CATCH_SKIP)return 'to skip';const m=$('#modal');if(!m||m.hidden)return '';
  const eb=$('#evoBtns');if(eb)return eb.style.visibility==='hidden'?'to skip':'to continue';
  const box=$('#mbox');if(!box||!(box.querySelector('.rstats')||box.querySelector('.cutscene')))return '';const fl=box.querySelector('#flip');if(fl&&!fl.classList.contains('go'))return 'to flip the card';return primaryBtn(box)?'to continue':''};
 let last='';setInterval(()=>{const t=why();
  /* also say it right under the buttons in the window */
  const box=$('#mbox'),rb=box&&!$('#modal').hidden&&box.querySelector('.rbtns');if(rb&&t&&t!=='to skip'&&!box.querySelector('.spline')){rb.insertAdjacentHTML('afterend','<p class="spline">or press <b>SPACE</b> '+t+'</p>')}
  const sl=box&&box.querySelector('.spline');if(sl&&!t)sl.remove();
  if(t===last)return;last=t;pill.hidden=!t||!!sl;if(t)pill.innerHTML='Press <b>SPACE</b> '+t;if(sl&&t)sl.innerHTML='or press <b>SPACE</b> '+t},200);
 document.head.insertAdjacentHTML('beforeend','<style>.spline{text-align:center;margin:8px 0 0;font-size:15px;color:#d8cce8}.spline b{background:#f0c860;color:#2a1d3e;padding:0 8px;letter-spacing:1px}body.mobile .spline{display:none}</style>')}

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
 x_names:["Paris is the capital of France.", "The Nile River flows through Egypt.", "Mount Fuji is the tallest mountain in Japan.", "Canberra is the capital of Australia.", "The Amazon River flows through Brazil.", "Neil Armstrong walked on the Moon first.", "Ottawa is the capital of Canada.", "The Sahara Desert covers much of North Africa.", "Marie Curie won two Nobel Prizes.", "Mount Everest stands between Nepal and China.", "The Great Barrier Reef is near Australia.", "Antarctica is home to emperor penguins.", "Tokyo is one of the biggest cities on Earth.", "The Pacific Ocean is the largest ocean.", "Leonardo da Vinci painted the Mona Lisa.", "Lake Superior is one of the Great Lakes."],
 x_punct:["Wait; is that a cloud? No, it is fog!", "Bring these: a hat, water, and sunscreen.", "Is a bat a bird? No, it is a mammal!", "The sun - our closest star - is very hot.", "Wow... the Moon is so bright tonight!", "Insects have six legs; spiders have eight.", "Guess what? Some frogs can freeze and thaw!", "The whale (the biggest animal) eats krill.", "Listen: bees buzz because their wings beat fast.", "Can plants move? Yes, they turn to the light!", "Here's a fact: owls swallow mice whole.", "Penguins swim; they cannot fly."],
 x_mix:["A spider has 8 legs, not 6!", "Water is H2O: 2 hydrogen, 1 oxygen.", "About 70% of your body is water.", "Earth is planet #3 from the sun.", "Light goes about 300,000 km/s!", "A day on Earth is 24 hours (1 spin).", "There are 206 bones in an adult body.", "The Moon takes about 27 days to orbit Earth.", "A bee can visit 100s of flowers on 1 trip!", "A cheetah can hit 100 km/h in seconds.", "Sound travels about 343 m/s in air.", "Score: 5/5 if you know whales are mammals!"],
 x_talk:["\"Did you know bats are mammals?\" asked Nia.", "\"I read that owls swallow mice whole!\" said Tom.", "\"Look,\" said Ava, \"that cloud is full of water drops.\"", "\"How far is the Moon?\" asked Leo.", "\"Very far,\" said Mom, \"about 384,400 km!\"", "\"Shh,\" whispered Kai, \"the deer can hear us.\"", "\"Sharks never stop growing teeth,\" said the diver.", "\"Is Pluto a planet?\" asked Sam. \"It's a dwarf planet,\" said Zoe.", "\"Bees talk by dancing,\" said Grandpa.", "\"Wow!\" shouted Mia. \"A rainbow has so many colors!\""],
 x_sci:['Photosynthesis helps plants turn sunlight into food.','Water freezes at zero degrees Celsius.','The planet Jupiter has a giant red storm.','Volcanoes push hot magma up from below.','Bats use echoes to find their way.','A caterpillar becomes a butterfly.','Gravity pulls everything toward the ground.','Our heart pumps blood all around the body.','Lightning is a giant spark of electricity.','The moon reflects light from the sun.','Bees carry pollen from flower to flower.','Earthquakes happen when rocks shift underground.'],
 x_rift:["The deepest part of the ocean is called the Mariana Trench.", "Glaciers carve wide valleys as they slowly move.", "Earthquakes happen when giant rock plates slip.", "Lava cools and hardens into new rock.", "Caves form when water dissolves limestone.", "Canyons are carved by rivers over millions of years.", "Mountains rise when pieces of the Earth push together.", "Sand is made of tiny pieces of broken rock and shells."],
 z_speed:['the','and','you','that','was','for','are','with','they','have','this','from','one','had','word','but','not','what','all','were','when','your','can','said','there','each','which','she','how','their','will','other','about','out','many','then','them','these','some','would','make','like','time','look','more','write','number','could','people','first'],
 z_code:['let score = 10;','if (hp < 3) heal();','print("Hello, world!")','for (i = 0; i < 5; i++)','x = x + 1;','while (lives > 0) play();','name = "Keylori";','if (a == b) { win(); }','list = [1, 2, 3];','return speed * 2;','jump(); run(); jump();','total += coins;'],
 z_twist:['She sells sea shells by the sea shore.','Red lorry, yellow lorry, red lorry, yellow lorry.','Six slippery snails slid slowly seaward.','Fred fed Ted bread, and Ted fed Fred bread.','A big black bug bit a big black bear.','Fuzzy Wuzzy was a bear; Fuzzy Wuzzy had no hair.','Toy boat, toy boat, toy boat!','Peter Piper picked a peck of pickled peppers.','How can a clam cram in a clean cream can?','Truly rural, truly rural, truly rural.'],
 z_exact:["NASA sent astronauts to the Moon in 1969.", "The T. rex had tiny arms but huge teeth.", "DNA is like a recipe inside every living thing.", "An X-ray lets doctors see your bones.", "The USA has 50 states.", "The UK is made of four countries.", "Dr. Jane Goodall studied chimpanzees in Tanzania.", "The ISS is a home for astronauts in space.", "Mt. Everest is in the Himalayas.", "LED lights use less energy than old bulbs."],
 z_chron:["About 4,500,000,000 years ago, the Earth formed.", "Later, oceans covered most of the planet.", "The first living things were tiny cells in the sea.", "Millions of years later, plants grew on land.", "Then came insects, fish, and amphibians.", "Dinosaurs ruled for more than 160 million years.", "After the dinosaurs, mammals spread across the land.", "At last, people learned to farm, build, and write."],
 z_mara:["Monarch butterflies fly thousands of kilometers from Canada to Mexico, and they find the same forests their great-grandparents visited.", "Arctic terns travel from the far north to the far south every year, so they see more daylight than any other animal.", "The heart beats about one hundred thousand times every day, pumping blood through a path of vessels long enough to circle the Earth.", "Rivers start as tiny streams high in the mountains, join together as they flow downhill, and finally pour into the sea.", "Sea turtles swim across whole oceans, and many females return to the same beach where they hatched to lay their own eggs.", "Light from distant stars can travel for thousands of years before it reaches your eyes on a clear, dark night."],
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
/* sticky header: keep the map's world picker right under the header */
(function(){const set=()=>{try{const t=document.querySelector('.screen:not([hidden])>.topbar');if(t)document.documentElement.style.setProperty('--tbh',Math.round(t.getBoundingClientRect().height)+'px')}catch(e){}};
 const _sh=show;show=function(){const r=_sh.apply(this,arguments);requestAnimationFrame(set);return r};addEventListener('resize',set);setTimeout(set,300)})();
/* Keylori Collection: world boxes + trophy shelf stay put; tap a world box to jump to it */
(function(){const set=()=>{try{const r=document.getElementById('s-binder');if(!r||r.hidden)return;const w=r.querySelector('.wpages'),t=r.querySelector('.trophy'),d=document.documentElement.style;
  if(w)d.setProperty('--wph',Math.round(w.getBoundingClientRect().height)+'px');if(t)d.setProperty('--trh',Math.round(t.getBoundingClientRect().height)+'px');
  if(w)[...w.children].forEach((b,k)=>{b.dataset.act='binderWorld';b.dataset.w=k+1;b.setAttribute('role','button')})}catch(e){}};
 ACT.binderWorld=d=>{const g=document.querySelector('#s-binder .binder'),i=WSTART[(+d.w)-1];const el=g&&g.children[i*3];if(el)el.scrollIntoView({behavior:'smooth',block:'start'})};
 const _rb=renderBinder;renderBinder=function(){const r=_rb.apply(this,arguments);requestAnimationFrame(set);setTimeout(set,200);return r};addEventListener('resize',set)})();

/* ---------- Keyboard Camp + new-key instructions: as big as the arena allows, never cutting words ---------- */
{document.head.insertAdjacentHTML('beforeend',`<style id="introfit">
.arena .intro{grid-template-columns:minmax(90px,22%) 1fr;grid-template-rows:minmax(0,1fr);padding:10px 16px}
.arena .intro .ib{--k:1;align-self:stretch;align-content:center;height:auto;min-height:0;overflow:hidden;box-sizing:border-box;padding:4px 0;gap:calc(6px*var(--k));word-break:normal;overflow-wrap:normal;hyphens:none}
.arena .intro .ib .tag{font-size:calc(12px*var(--k))}
.arena .intro .ib h3{font-size:calc(30px*var(--k));line-height:1.1;margin:0}
.arena .intro .ib p{font-size:calc(21px*var(--k));max-width:none;line-height:1.25}
.arena .intro .ib .row{gap:calc(14px*var(--k))}
.arena .intro .ib .btn{font-size:calc(24px*var(--k))!important;padding:calc(8px*var(--k)) calc(22px*var(--k))!important}
.arena .intro .ib .linkbtn{font-size:calc(22px*var(--k))!important}
.arena .intro .ib .row>.muted{font-size:calc(16px*var(--k))!important}
.arena .intro .ib .bigkey{font-size:calc(40px*var(--k))}
</style>`);
 const fits=ib=>{if(ib.scrollHeight>ib.clientHeight+1||ib.scrollWidth>ib.clientWidth+1)return false;for(const e of ib.querySelectorAll('*'))if(e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow!=='visible')return false;return true};
 window.fitIntro=()=>{const ib=document.querySelector('.arena .intro .ib');if(!ib||!ib.clientHeight)return;let lo=1,hi=3.4;ib.style.setProperty('--k',hi);if(fits(ib))return;
  for(let n=0;n<12;n++){const m=(lo+hi)/2;ib.style.setProperty('--k',m);if(fits(ib))lo=m;else hi=m}ib.style.setProperty('--k',lo);if(!fits(ib)){for(let k=lo;k>.6;k-=.05){ib.style.setProperty('--k',k);if(fits(ib))break}}};
 const later=()=>{fitIntro();requestAnimationFrame(fitIntro);setTimeout(fitIntro,120)};
 const _cp=camp;camp=function(){const r=_cp.apply(this,arguments);later();return r};
 const _ri=renderIntro;renderIntro=function(){const r=_ri.apply(this,arguments);later();return r};
 addEventListener('resize',()=>fitIntro());if(document.fonts)document.fonts.addEventListener?.('loadingdone',()=>fitIntro())}
