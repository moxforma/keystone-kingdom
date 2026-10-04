/* ================= DATA ================= */
const $=s=>document.querySelector(s);
const rand=a=>a[Math.floor(Math.random()*a.length)];
const OL='#0b1033';
const LS_KEY='keyling-quest-v1';
const DEF={name:'',xp:0,gems:0,best:{},cards:{},owned:[],equip:{},ks:{},set:{sound:true,voice:false,len:1,hide:'show'},camp:false,badges:[],hist:[],time:0,rounds:0,egg:{day:'',w:0},skip:0,placed:false,arc:{meteor:0,race:0,glitch:0,gwin:0}};
let S;
function load(){try{const r=localStorage.getItem(LS_KEY);S=Object.assign(structuredClone(DEF),r?JSON.parse(r):{});S.set=Object.assign({},DEF.set,S.set);S.egg=Object.assign({},DEF.egg,S.egg);Object.values(S.cards).forEach(c=>{if(c.shiny&&!c.tier)c.tier='gold';delete c.shiny});S.arc=Object.assign({},DEF.arc,S.arc)}catch(e){S=structuredClone(DEF)}}
function save(){try{localStorage.setItem(LS_KEY,JSON.stringify(S))}catch(e){}}

const REGIONS=[
 {name:'Home Row Meadow',color:'#4de08a',desc:'Where every finger finds its home.'},
 {name:'Crystal Caves',color:'#7fe8ff',desc:'Reach up to the top row.'},
 {name:'Ember Volcano',color:'#ff7a45',desc:'Dive down to the bottom row.'},
 {name:'Sky Castle',color:'#b9a8ff',desc:'Big letters and whole sentences.'},
 {name:'Star Lab',color:'#ffc93c',desc:'Numbers and the final challenge.'}
];
const LESSONS=[
 {k:'fj',r:0},{k:'dk',r:0},{k:'sl',r:0},{k:'a;',r:0},{k:'gh',r:0},
 {k:'ei',r:1},{k:'ru',r:1},{k:'ty',r:1},{k:'wo',r:1},{k:'qp',r:1},
 {k:'cm',r:2},{k:'vn',r:2},{k:'x,',r:2},{k:'z.',r:2},{k:'b',r:2},
 {k:'',sp:'caps',r:3,t:'Big Letters'},{k:'',sp:'sent',r:3,t:'Sentences'},
 {k:'12345',sp:'num',r:4,t:'Numbers 1 to 5'},{k:'67890',sp:'num',r:4,t:'Numbers 6 to 0'},{k:'',sp:'master',r:4,t:'Keyboard Master'}
];
const STAGES=['Warm-up','Mix-up','Word Battle'];
const lessonTitle=i=>LESSONS[i].t||('Keys '+[...LESSONS[i].k].map(c=>c.toUpperCase()).join(' & '));

const TYPES={Leaf:'#5cd66f',Aqua:'#3d9bff',Spark:'#2fd6c9',Rock:'#c29a70',Flame:'#ff6a3d',Crystal:'#7fe8ff',Shadow:'#8a6be0',Sky:'#8fd3ff',Frost:'#bfe9ff',Star:'#ffcf5c',Bug:'#9ccf3a',Ghost:'#b7a6ff',Metal:'#a9b4c8',Sand:'#e4b86a',Candy:'#ff8fc8',Storm:'#6f8bff',Ocean:'#1fc5bf',Magma:'#ff5a3a',Aurora:'#6ef0c0',Legend:'#ffd166'};
const SPECIES=[
 {n:['Sproutle','Sproutail','Thornadon'],t:'Leaf',c1:'#5cc86b',c2:'#d8f5a2',ear:'leaf',tail:'leaf',pat:'spots',fl:'Naps in sunny meadows and sneezes flower petals.'},
 {n:['Drizzit','Drizzlet','Tsunaroo'],t:'Aqua',c1:'#3d9bff',c2:'#bfe3ff',ear:'fin',tail:'fin',pat:'stripes',fl:'One flick of its tail fin can splash a whole pond.'},
 {n:['Zipp','Zapplet','Voltrix'],t:'Spark',c1:'#2fd6c9',c2:'#fff27a',ear:'antenna',tail:'bolt',pat:'stripes',fang:1,fl:'Charges up by running laps around the house.'},
 {n:['Pebbo','Bouldo','Montagor'],t:'Rock',c1:'#a88a6a',c2:'#e8d9c4',ear:'horn',tail:'spike',pat:'spots',fl:'Loves rolling down hills. Very hard to hug.'},
 {n:['Embit','Emberoo','Infernox'],t:'Flame',c1:'#ff7043',c2:'#ffd0a0',ear:'flame',tail:'flame',pat:'none',fang:1,fl:'Its tail flame glows brighter when it is happy.'},
 {n:['Glintle','Glimmox','Prismaw'],t:'Crystal',c1:'#86e3ff',c2:'#ffffff',ear:'crystal',tail:'spike',pat:'stars',fl:'Collects shiny rocks in a secret cave.'},
 {n:['Duskit','Duskrow','Nocturnyx'],t:'Shadow',c1:'#6a4fc2',c2:'#c9b8ff',ear:'pointy',tail:'swirl',pat:'stars',fang:1,fl:'Only comes out to play when the moon is full.'},
 {n:['Breezle','Galewing','Tempestrix'],t:'Sky',c1:'#9fd8ff',c2:'#ffffff',ear:'fin',tail:'swirl',pat:'none',fl:'Rides the wind higher than any kite.'},
 {n:['Frostby','Frostail','Glaciarch'],t:'Frost',c1:'#d4f1ff',c2:'#7fc6ff',ear:'crystal',tail:'spike',pat:'spots',fl:'When it sneezes, it snows. Even in summer.'},
 {n:['Twinkit','Cometail','Nebulion'],t:'Star',c1:'#4a4fc0',c2:'#ffd166',ear:'round',tail:'star',pat:'stars',fl:'Makes a wish on itself every night.'},
 {n:['Beetix','Scarabolt','Mantitan'],t:'Bug',c1:'#8bc34a',c2:'#e6ff9c',ear:'antenna',tail:'spike',pat:'stripes',fl:'Can lift a pinecone fifty times its size.'},
 {n:['Wispy','Wispurr','Phantomane'],t:'Ghost',c1:'#b9a8ff',c2:'#f1ecff',ear:'round',tail:'swirl',pat:'none',fl:'Hides in your closet, but only to say hi.'},
 {n:['Cogby','Gearix','Mechanaut'],t:'Metal',c1:'#9aa7bd',c2:'#e0e6f0',ear:'antenna',tail:'bolt',pat:'stripes',fl:'Beeps a happy song when you oil its gears.'},
 {n:['Dunelet','Dunerox','Sphinxar'],t:'Sand',c1:'#e0b060',c2:'#fff0c8',ear:'pointy',tail:'spike',pat:'spots',fl:'Swims through sand dunes like they are water.'},
 {n:['Fizzlet','Sugarwing','Confectra'],t:'Candy',c1:'#ff8fc8',c2:'#fff0f7',ear:'round',tail:'swirl',pat:'spots',fl:'Smells exactly like strawberry bubblegum.'},
 {n:['Rumblet','Stormaw','Thundragon'],t:'Storm',c1:'#4c63d9',c2:'#9fe4ff',ear:'horn',tail:'bolt',pat:'stripes',fang:1,fl:'Its roar sounds just like thunder.'},
 {n:['Bubbly','Coralisk','Krakenox'],t:'Ocean',c1:'#1fb5b0',c2:'#ffb4a2',ear:'fin',tail:'fin',pat:'spots',fl:'Blows bubbles shaped like stars.'},
 {n:['Magmite','Magmaul','Volcanorr'],t:'Magma',c1:'#d9402b',c2:'#ffb347',ear:'horn',tail:'flame',pat:'stripes',fang:1,fl:'Takes lava baths to stay cozy.'},
 {n:['Glowbit','Lumiwing','Aurorath'],t:'Aurora',c1:'#58e0b0',c2:'#e0b0ff',ear:'crystal',tail:'star',pat:'stars',fl:'Paints the night sky with ribbons of light.'},
 {n:['Qwertle','Qwertrix','Qwertitan'],t:'Legend',c1:'#ffd166',c2:'#7c5cff',ear:'horn',tail:'star',pat:'stars',fang:1,fl:'The legendary keeper of every key on the keyboard.'}
];

const WORDS=('a as ask asks all add adds dad dads sad lad fall falls flask salad glad hall half has had hash ash dash flash gas shall flag lag he she'+' '+
 'see seed feed feel heel deal seal sea lake like likes hike kid kids lid hid hide side slide fish dish wish his if is life file fig jig field'+' '+
 'shed sled fled egg eggs said ideal idea red rug run fun sun rid ride fire fur rush jug dug hug huge sure rule rules sugar ruler dare hair fair'+' '+
 'hear dear deer ruff the they yes yell try tree trees street star stars start shy sky fly dry toy tidy tail trail stay story tiger two word world wow'+' '+
 'owl owls wolf row slow look took foot good food wood hot dot got lot rock rocks goal hook water tower show sword quest quiet quick quit pop pup pet'+' '+
 'pie pig pal park play plays spot top stop shop ship spark super power poster pirate cat cap came cake cool cute magic comet camp card cards climb come make'+' '+
 'mud mom mice castle crystal cream van vine seven every have give love wave cave oven night moon nest snow win lion fan green dragon legend trainer frog sing song'+' '+
 'dance box fox six fix mix wax next taxi zap zip zoo zoom lazy fizz buzz prize maze pizza bat bug bee bike ball best book bolt blue brave battle'+' '+
 'bubble robot rocket planet storm flame frost shiny rare epic team hero gem gold coin level jump king queen crown knight shield ant ape bear bird bunny camel cheetah chick'+' '+
 'clam cobra crab crane cricket dolphin donkey duck eagle eel elephant falcon ferret finch flamingo gecko giraffe goat goose gorilla hamster hawk hedgehog heron hippo horse jaguar kangaroo kitten koala'+' '+
 'lamb lemur leopard lizard llama lobster magpie monkey moose moth mouse newt octopus otter panda parrot pelican penguin pony puffin puppy rabbit raccoon raven robin salmon shark sheep shrimp sloth'+' '+
 'snail snake spider squid squirrel swan toad turkey turtle walrus whale zebra apple bagel banana bean berry bread butter carrot cereal cheese cherry cookie corn cracker cupcake muffin grape honey'+' '+
 'jam lemon lettuce mango noodle oatmeal olive onion orange pancake pasta peach peanut pear pepper pickle potato pretzel pumpkin raisin rice sandwich soup toast tomato waffle yogurt walnut acorn beach'+' '+
 'branch breeze brook canyon cliff cloud desert dew forest garden glacier hill island jungle lagoon leaf meadow mountain ocean pebble petal puddle rain rainbow river root sand shell spring stone'+' '+
 'stream summer sunset thunder valley volcano wind winter autumn blossom cactus daisy fern flower grass maple mushroom oak pine rose tulip twig weather basket blanket bottle brush bucket button candle'+' '+
 'chair clock crayon desk door drawer eraser glue hammer jacket kettle ladder lamp marker mitten notebook paint paper pencil pillow puzzle ribbon scissors scarf sock spoon table teapot tent ticket'+' '+
 'towel umbrella wagon whistle window zipper bake bounce build carry catch cheer chase clap color cook count dig draw dream explore float giggle glow grow help hop invent juggle kick'+' '+
 'laugh learn listen paddle plant race read rescue sail share skate skip smile spin splash sprint swim think throw travel wander whisper write bright calm clever curious eager gentle happy'+' '+
 'helpful honest kind lucky mighty polite proud silly smart speedy sunny swift tiny wise cozy fuzzy jolly'+' kite drum flute piano violin glass harp').split(' ');
const SENT=["Bees make honey.", "The sun is a star.", "Frogs can jump far.", "Owls hunt at night.", "Ice is frozen water.", "Plants need sun.", "Fish swim with fins.", "Bats sleep in caves.", "A cub is a baby bear.", "Rain falls from clouds.", "Snakes shed their skin.", "Ants work as a team.", "Whales breathe air.", "Mars is a red planet.", "Seeds grow into trees.", "Cows give us milk.", "Crabs walk sideways.", "The moon has craters.", "Ducks like to swim.", "Snow is made of ice.", "Owls have big eyes.", "A foal is a baby horse.", "Bees can see colors.", "Wind moves the clouds.", "Trees make fresh air.", "Koalas eat leaves.", "Sharks have fins.", "Stars shine at night.", "Penguins can swim fast.", "Spiders spin webs."];
const NSENT=["A spider has 8 legs.", "An insect has 6 legs.", "A week has 7 days.", "A year has 12 months.", "An octopus has 3 hearts.", "A day has 24 hours.", "There are 8 planets.", "A starfish has 5 arms.", "Snowflakes have 6 sides.", "An hour has 60 minutes.", "A dog has 4 legs.", "A triangle has 3 sides.", "Adults have 206 bones.", "A square has 4 corners.", "There are 7 continents.", "A minute has 60 seconds.", "A leap year has 366 days.", "A hexagon has 6 sides.", "There are 5 oceans.", "A bee has 5 eyes."];
const MSENT=['The quick brown fox jumps over the lazy dog.','Pop zaps five quick bolts of light.','Pack my box with five dozen jugs.','A wizard jumped over a big quilt box.','Brave trainers type with every finger.','Six crazy kings vowed to jump.','Quick zebras jog past the wavy hill.'];

/* fingers */
const FINGER={};[['`1qaz','lp'],['2wsx','lr'],['3edc','lm'],['45rtfgvb','li'],['67yuhjnm','ri'],['8ik,','rm'],['9ol.','rr'],["0-=p[];'/\\",'rp']].forEach(([s,f])=>[...s].forEach(c=>FINGER[c]=f));
const FN_SPECIAL={tab:'lp',caps:'lp',shiftL:'lp',bksp:'rp',enter:'rp',shiftR:'rp',space:'th'};
const fingerOf=id=>FN_SPECIAL[id]||FINGER[id]||'th';
const FC={p:'#b48ae0',r:'#ff9f45',m:'#ffd84d',i:'#4de08a',t:'#6cc8e0'};
const fcol=f=>FC[f==='th'?'t':f[1]];
const FNAME={lp:'left pinky',lr:'left ring finger',lm:'left middle finger',li:'left pointer finger',ri:'right pointer finger',rm:'right middle finger',rr:'right ring finger',rp:'right pinky',th:'thumb'};
function keyInfo(ch){
 const base=ch===' '?'space':ch.toLowerCase(),up=/[A-Z]/.test(ch),f=fingerOf(base),r={keys:[base],fingers:[f],f};
 if(up){const sh=f[0]==='l'?'shiftR':'shiftL';r.keys.push(sh);r.fingers.push(sh==='shiftR'?'rp':'lp');r.shift=sh==='shiftR'?'rp':'lp'}
 return r;
}
const disp=ch=>ch===' '?'SPACE':/[A-Z]/.test(ch)?'big '+ch:ch.toUpperCase();
function fingerHTML(ch){
 const k=keyInfo(ch),c=fcol(k.f),key=`<span class="chip" style="--fc:${c}">${ch===' '?'SPACE':ch}</span>`;
 if(k.shift)return `SHIFT <b style="--fc:${fcol(k.shift)}">${FNAME[k.shift]}</b> + ${key} <b style="--fc:${c}">${FNAME[k.f]}</b>`;
 return `${key} <b style="--fc:${c}">${FNAME[k.f]}</b>`;
}
function fingerSay(ch){const k=keyInfo(ch);return k.shift?`Shift and ${ch}. Use your ${FNAME[k.f]}.`:`${disp(ch)}. Use your ${FNAME[k.f]}.`}

/* ================= ART ================= */
function shade(h,a){const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return '#'+((1<<24)|(f(n>>16)<<16)|(f(n>>8&255)<<8)|f(n&255)).toString(16).slice(1)}
function starPts(cx,cy,r){let p=[];for(let k=0;k<10;k++){const a=Math.PI/5*k-Math.PI/2,rr=k%2?r*.45:r;p.push((cx+Math.cos(a)*rr).toFixed(1)+','+(cy+Math.sin(a)*rr).toFixed(1))}return p.join(' ')}
const st=`stroke="${OL}" stroke-width="3" stroke-linejoin="round"`;
const EARS={leaf:'M72 72 C44 62 42 28 56 18 C70 34 84 50 72 72Z',pointy:'M62 80 L50 26 L88 66Z',round:'M50 64 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0Z',horn:'M74 70 Q56 44 68 16 Q78 46 90 66Z',fin:'M62 84 Q28 64 36 36 Q60 54 80 70Z',crystal:'M60 76 L54 40 L68 18 L82 44 L84 70Z',flame:'M66 74 C48 60 56 40 60 20 C70 38 90 44 86 68Z'};
function grad(id,c,k=.45){return `<radialGradient id="${id}" cx="36%" cy="28%" r="85%"><stop offset="0" stop-color="${shade(c,k)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade(c,-.5)}"/></radialGradient>`}
const SOFT='<filter id="sft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>';
const irisDef=c=>`<radialGradient id="ir_${c.slice(1)}" cx="50%" cy="72%" r="75%"><stop offset="0" stop-color="${shade(c,.55)}"/><stop offset="1" stop-color="${shade(c,-.35)}"/></radialGradient>`;
const shine=(cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(-28 ${cx} ${cy})" fill="#fff" opacity=".45"/><circle cx="${cx-12}" cy="${cy+14}" r="3.5" fill="#fff" opacity=".45"/>`;
const rim=(o='.32')=>`<path d="M147 110 Q152 142 126 167" fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="4" stroke-linecap="round"/>`;
function eyeSVG(x,y,r,iris,ol){return `<ellipse cx="${x}" cy="${y}" rx="${r-3}" ry="${r}" fill="#fff" stroke="${ol}" stroke-width="2.5"/><path d="M${x-r+3} ${y-1} Q${x} ${y-r-3} ${x+r-3} ${y-1} Q${x} ${y-r+5} ${x-r+3} ${y-1}Z" fill="${ol}" opacity=".2"/><circle cx="${x+1}" cy="${y+2}" r="${r-5}" fill="url(#ir_${iris.slice(1)})"/><circle cx="${x+1}" cy="${y+3}" r="${((r-5)*.55).toFixed(1)}" fill="#0b1033"/><circle cx="${x+4}" cy="${y-3}" r="${(r*.28).toFixed(1)}" fill="#fff"/><circle cx="${x-3}" cy="${y+6}" r="${(r*.12).toFixed(1)}" fill="#fff" opacity=".85"/>`}
function tailSVG(sp,B,C,so,ol,c1){
 const T={leaf:'M146 140 C186 136 198 98 184 78 C172 104 160 118 146 140Z',fin:'M146 146 Q188 156 196 114 Q176 128 148 128Z',spike:'M146 146 L176 140 L168 128 L194 120 L166 112 L178 96 L146 118Z',bolt:'M144 140 L172 124 L162 116 L192 92 L170 102 L178 82 L148 112 L158 118Z'};
 if(T[sp.tail])return `<path d="${T[sp.tail]}" fill="${sp.tail==='bolt'?C:B}" ${so}/>`;
 const curve=d=>`<path d="${d}" fill="none" stroke="${ol}" stroke-width="17" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c1}" stroke-width="11" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round" transform="translate(-2 -3)"/>`;
 if(sp.tail==='swirl')return curve('M146 140 C182 146 194 112 176 102 C162 96 160 116 172 114');
 if(sp.tail==='flame')return curve('M146 142 Q176 146 178 120')+`<path d="M178 124 C162 112 170 96 178 78 C186 96 198 104 190 122Z" fill="url(#flm)" ${so}/><path d="M179 118 C172 110 176 100 179 92 C183 102 188 108 184 118Z" fill="#fff6c2"/>`;
 return curve('M146 142 Q176 146 178 112')+`<polygon points="${starPts(180,100,17)}" fill="${C}" ${so}/>`;
}
function creatureSVG(i,form,cls=''){
 const sp=SPECIES[i],c1=sp.c1,c2=sp.c2,s=[.74,.88,1.02][form],tc=TYPES[sp.t],ol=shade(c1,-.62),iris=shade(tc,-.1),B=`url(#cb${i})`,C=`url(#cc${i})`,D=`url(#cd${i})`;
 const so=`stroke="${ol}" stroke-width="3" stroke-linejoin="round"`;
 let ear=sp.ear==='antenna'?`<path d="M84 72 Q72 46 62 26" fill="none" stroke="${ol}" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="24" r="${form?9:7}" fill="${C}" ${so}/><circle cx="59" cy="21" r="2.5" fill="#fff" opacity=".85"/>`:`<path d="${EARS[sp.ear]}" fill="${B}" ${so}/>`;
 ear=`<g transform="translate(80 72) scale(${form?1:.8}) translate(-80 -72)">${ear}</g>`;
 const ears=ear+`<g transform="translate(200 0) scale(-1 1)">${ear}</g>`;
 const tl=tailSVG(sp,B,C,so,ol,c1),tail=form===0?`<g transform="translate(146 140) scale(.6) translate(-146 -140)">${tl}</g>`:tl;
 const w=`<path d="M62 112 C22 96 12 60 26 44 C34 64 44 72 54 74 C44 58 48 46 58 40 C62 64 70 88 76 104Z" fill="${C}" ${so}/>`;
 const wings=form===2?w+`<g transform="translate(200 0) scale(-1 1)">${w}</g>`:'';
 let pat='';
 if(form>0){
  if(sp.pat==='spots')pat=`<g fill="${c2}" opacity=".85"><circle cx="66" cy="138" r="6"/><circle cx="138" cy="146" r="5"/><circle cx="132" cy="84" r="4"/></g>`;
  if(sp.pat==='stripes')pat=`<path d="M84 78 Q100 70 116 78 M80 88 Q100 80 120 88" stroke="${c2}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>`;
  if(sp.pat==='stars')pat=`<g fill="${c2}"><polygon points="${starPts(66,140,7)}"/><polygon points="${starPts(136,146,6)}"/></g>`;
 }
 const ey=form===0?15:13;
 const brows=form===2?`<path d="M70 88 L92 95 M130 88 L108 95" stroke="${ol}" stroke-width="4.5" stroke-linecap="round"/>`:'';
 const fang=sp.fang&&form>0?`<path d="M102 132 L105 139 L108 131Z" fill="#fff" stroke="${ol}" stroke-width="1.5"/>`:'';
 const aura=form===2?`<circle cx="100" cy="116" r="94" fill="url(#au${i})"/>`:'';
 return `<svg class="cr ${cls}" viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="au${i}"><stop offset="0" stop-color="${tc}" stop-opacity=".6"/><stop offset="1" stop-color="${tc}" stop-opacity="0"/></radialGradient>${grad('cb'+i,c1)}${grad('cc'+i,c2,.6)}${grad('cd'+i,shade(c1,-.2))}${grad('flm','#ffb347',.6)}${irisDef(iris)}${SOFT}</defs>${aura}
<g transform="translate(100 124) scale(${s}) translate(-100 -124)"><ellipse cx="100" cy="180" rx="54" ry="9" fill="#000" opacity=".4" filter="url(#sft)"/>${wings}${tail}${ears}
<ellipse cx="80" cy="168" rx="15" ry="9" fill="${D}" ${so}/><ellipse cx="120" cy="168" rx="15" ry="9" fill="${D}" ${so}/>
<ellipse cx="100" cy="122" rx="54" ry="50" fill="${B}" stroke="${ol}" stroke-width="3.5"/>
<ellipse cx="100" cy="146" rx="30" ry="20" fill="${C}"/>${pat}
<ellipse cx="50" cy="132" rx="9" ry="14" transform="rotate(25 50 132)" fill="${B}" ${so}/><ellipse cx="150" cy="132" rx="9" ry="14" transform="rotate(-25 150 132)" fill="${B}" ${so}/>
${rim()}${shine(78,90,17,9)}
${eyeSVG(82,108,ey,iris,ol)}${eyeSVG(118,108,ey,iris,ol)}${brows}<ellipse cx="68" cy="124" rx="7" ry="4" fill="#ff8fb1" opacity=".6"/><ellipse cx="132" cy="124" rx="7" ry="4" fill="#ff8fb1" opacity=".6"/>
<path d="M92 130 Q100 138 108 130" fill="none" stroke="${ol}" stroke-width="3" stroke-linecap="round"/>${fang}</g></svg>`;
}
/* mascot + accessories */
const ACC={
 beanie:{slot:'head',name:'Cozy Beanie',cost:10,svg:`<path d="M60 84 Q62 36 100 34 Q138 36 140 84Z" fill="#ff7a45" ${st}/><rect x="56" y="76" width="88" height="14" rx="7" fill="#ffb347" ${st}/><circle cx="100" cy="32" r="10" fill="#fff3e0" ${st}/>`},
 goggles:{slot:'head',name:'Pilot Goggles',cost:20,svg:`<rect x="46" y="74" width="108" height="10" rx="5" fill="#7a4f2e" ${st}/><circle cx="82" cy="78" r="13" fill="#9fe8ff" stroke="#c98b12" stroke-width="5"/><circle cx="118" cy="78" r="13" fill="#9fe8ff" stroke="#c98b12" stroke-width="5"/>`},
 phones:{slot:'head',name:'Beat Phones',cost:25,svg:`<path d="M44 118 Q44 40 100 40 Q156 40 156 118" fill="none" stroke="#1b1f3a" stroke-width="9"/><rect x="32" y="98" width="22" height="36" rx="10" fill="#ff5d8f" ${st}/><rect x="146" y="98" width="22" height="36" rx="10" fill="#ff5d8f" ${st}/>`},
 wizard:{slot:'head',name:'Wizard Hat',cost:40,svg:`<path d="M58 80 L112 2 L142 80Z" fill="#3b4bd6" ${st}/><ellipse cx="100" cy="80" rx="54" ry="10" fill="#3b4bd6" ${st}/><polygon points="${starPts(106,44,8)}" fill="#ffc93c"/><polygon points="${starPts(118,66,5)}" fill="#ffc93c"/>`},
 crown:{slot:'head',name:'Champion Crown',cost:60,svg:`<path d="M66 80 L64 42 L84 60 L100 34 L116 60 L136 42 L134 80Z" fill="#ffc93c" ${st}/><circle cx="100" cy="68" r="6" fill="#ff5d8f" ${st}/><circle cx="80" cy="72" r="4" fill="#3ee6ff"/><circle cx="120" cy="72" r="4" fill="#3ee6ff"/>`},
 shades:{slot:'face',name:'Cool Shades',cost:15,svg:`<path d="M60 100 H96 V112 Q96 124 78 124 Q60 124 60 110Z" fill="#111"/><path d="M104 100 H140 V110 Q140 124 122 124 Q104 124 104 112Z" fill="#111"/><path d="M94 104 H106" stroke="#111" stroke-width="5"/><path d="M66 106 L74 106" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`},
 starspecs:{slot:'face',name:'Star Specs',cost:30,svg:`<polygon points="${starPts(80,110,19)}" fill="#ff5d8f" opacity=".9" ${st}/><polygon points="${starPts(120,110,19)}" fill="#ff5d8f" opacity=".9" ${st}/>`},
 bowtie:{slot:'neck',name:'Fancy Bow',cost:10,svg:`<path d="M100 152 L78 140 L78 164Z M100 152 L122 140 L122 164Z" fill="#ff5d8f" ${st}/><circle cx="100" cy="152" r="6" fill="#ff9fc0" ${st}/>`},
 scarf:{slot:'neck',name:'Hero Scarf',cost:15,svg:`<path d="M126 158 L138 192 L118 190 L112 162Z" fill="#e8384f" ${st}/><path d="M50 144 Q100 166 150 144 L150 158 Q100 180 50 158Z" fill="#e8384f" ${st}/>`},
 medal:{slot:'neck',name:'Gold Medal',cost:35,svg:`<path d="M84 138 L100 162 L116 138" fill="none" stroke="#3ee6ff" stroke-width="7"/><circle cx="100" cy="166" r="13" fill="#ffc93c" ${st}/><polygon points="${starPts(100,166,7)}" fill="#fff5c2"/>`},
 cape:{slot:'back',name:'Storm Cape',cost:30,svg:`<path d="M56 108 Q30 186 56 198 L144 198 Q170 186 144 108Z" fill="#e8384f" ${st}/>`},
 jetpack:{slot:'back',name:'Rocket Pack',cost:45,svg:`<path d="M32 158 Q42 192 52 158Z M148 158 Q158 192 168 158Z" fill="#ffc93c"/><rect x="28" y="104" width="26" height="56" rx="11" fill="#c9d2e6" ${st}/><rect x="146" y="104" width="26" height="56" rx="11" fill="#c9d2e6" ${st}/>`},
 wings:{slot:'back',name:'Dragon Wings',cost:50,svg:`<path d="M60 112 C16 98 4 56 20 36 C30 60 40 66 50 70 C42 52 46 40 56 34 C62 62 70 88 76 104Z" fill="#3ee6ff" ${st}/><path d="M140 112 C184 98 196 56 180 36 C170 60 160 66 150 70 C158 52 154 40 144 34 C138 62 130 88 124 104Z" fill="#3ee6ff" ${st}/>`}
};
function zookSVG(eq){
 eq=eq||S.equip;const a=sl=>eq[sl]&&ACC[eq[sl]]?ACC[eq[sl]].svg:'';const zo='#23125e',zs=`stroke="${zo}" stroke-width="3" stroke-linejoin="round"`;
 const ear=`<path d="M64 86 L42 20 L66 48 L74 36 L90 72Z" fill="url(#zb)" ${zs}/><path d="M66 74 L52 38 L66 54 L72 46 L80 70Z" fill="url(#ze)"/>`;
 return `<svg class="zk" viewBox="0 0 200 200" aria-label="Pop the storm dragon"><defs>${grad('zb','#7c5cff')}${grad('zc','#d6ccff',.6)}${grad('zd','#5a3fd6')}${grad('ze','#3ee6ff',.6)}${grad('zg','#ffc93c',.55)}${irisDef('#1fb9d6')}${SOFT}</defs>
<ellipse cx="100" cy="182" rx="58" ry="9" fill="#000" opacity=".42" filter="url(#sft)"/>${a('back')}
<path d="M146 140 L176 128 L166 120 L196 96 L174 104 L184 82 L150 112 L160 118Z" fill="url(#zg)" ${zs}/>
${ear}<g transform="translate(200 0) scale(-1 1)">${ear}</g>
<ellipse cx="80" cy="170" rx="16" ry="9" fill="url(#zd)" ${zs}/><ellipse cx="120" cy="170" rx="16" ry="9" fill="url(#zd)" ${zs}/>
<ellipse cx="100" cy="122" rx="58" ry="54" fill="url(#zb)" stroke="${zo}" stroke-width="3.5"/>
<ellipse cx="100" cy="148" rx="34" ry="22" fill="url(#zc)"/>
<ellipse cx="46" cy="134" rx="9" ry="15" transform="rotate(30 46 134)" fill="url(#zb)" ${zs}/><ellipse cx="154" cy="134" rx="9" ry="15" transform="rotate(-30 154 134)" fill="url(#zb)" ${zs}/>
${rim('.35')}${shine(74,88,18,9)}
<polygon points="100,70 108,81 100,93 92,81" fill="url(#ze)" ${zs}/><polygon points="99,74 103,80 99,84" fill="#fff" opacity=".8"/>
${eyeSVG(80,110,15,'#1fb9d6',zo)}${eyeSVG(120,110,15,'#1fb9d6',zo)}
<ellipse cx="62" cy="129" rx="7" ry="4" fill="#3ee6ff" opacity=".55"/><ellipse cx="138" cy="129" rx="7" ry="4" fill="#3ee6ff" opacity=".55"/>
<path d="M88 132 Q100 144 112 132" fill="none" stroke="${zo}" stroke-width="3.5" stroke-linecap="round"/><path d="M104 135 L107 142 L110 133Z" fill="#fff" stroke="${zo}" stroke-width="1.5"/>
${a('neck')}${a('face')}${a('head')}</svg>`;
}
const ICON={
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
 gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
 sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8a5 5 0 010 8M19 5a9 9 0 010 14"/></svg>',
 mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
 gem:'<svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z" fill="#3ee6ff" stroke="#0b1033" stroke-width="1.5"/><path d="M2 9h20M9 3l3 18 3-18" stroke="#0b1033" stroke-width="1" fill="none" opacity=".5"/></svg>',
 lock:'<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="#a3acdf" stroke-width="2.5"><rect x="5" y="11" width="14" height="10" rx="2" fill="#a3acdf"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>',
 say:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
 star:'<svg viewBox="0 0 24 24"><polygon points="'+starPts(12,12.5,11)+'"/></svg>'
};

/* ================= AUDIO + VOICE ================= */
let AC,audioResume;
function tone(f,d=.1,type='sine',v=.12,w=0){
 if(!S.set.sound)return;
 try{
  if(!AC||AC.state==='closed')AC=new (window.AudioContext||window.webkitAudioContext)();
  if(AC.state!=='running'&&!audioResume){
   audioResume=AC.resume().catch(()=>{}).finally(()=>{audioResume=null});
  }
  const t=AC.currentTime+w,o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.connect(g).connect(AC.destination);
  o.onended=()=>{o.disconnect();g.disconnect()};
  o.start(t);o.stop(t+d+.02);
 }catch(e){}
}
const sfx={
 ok:c=>tone(520+Math.min(c,24)*18,.08,'triangle',.1),
 bad:()=>tone(170,.18,'sine',.14),
 super:()=>{[660,880,1175].forEach((f,k)=>tone(f,.12,'square',.05,k*.06))},
 win:()=>[523,659,784,1047].forEach((f,k)=>tone(f,.22,'triangle',.12,k*.12)),
 lvl:()=>[392,523,659,784,1047,1319].forEach((f,k)=>tone(f,.2,'square',.06,k*.09)),
 click:()=>tone(700,.05,'triangle',.06)
};
function speak(t){if(!S.set.voice)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/<[^>]+>/g,''));u.rate=.95;u.pitch=1.15;speechSynthesis.speak(u)}catch(e){}}

/* ================= KEYBOARD + HANDS ================= */
const KB=[
 ['`','1','2','3','4','5','6','7','8','9','0','-','=',['bksp',2,'⌫']],
 [['tab',1.5,'Tab'],'q','w','e','r','t','y','u','i','o','p','[',']',['\\',1.5,'\\']],
 [['caps',1.8,'Caps'],'a','s','d','f','g','h','j','k','l',';',"'",['enter',2.2,'Enter']],
 [['shiftL',2.4,'Shift'],'z','x','c','v','b','n','m',',','.','/',['shiftR',2.6,'Shift']],
 [['space',7,'Space']]
];
const keyEls=new Map();let vShift=false;
function buildKB(){
 const kb=$('#kb');kb.innerHTML='';
 KB.forEach((row,ri)=>{const r=document.createElement('div');r.className='krow'+(ri===4?' last':'');
  row.forEach(k=>{let id,w=1,lab;if(Array.isArray(k))[id,w,lab]=k;else{id=k;lab=k.toUpperCase()}
   const b=document.createElement('button');b.type='button';b.tabIndex=-1;b.className='key'+(id.length>1?' fn':'');b.dataset.k=id;b.textContent=lab;
   b.style.flex=ri===4?'0 1 55%':`${w} 1 0`;b.style.setProperty('--fc',fcol(fingerOf(id)));
   if(id==='f'||id==='j')b.classList.add('bump');keyEls.set(id,b);r.appendChild(b)});
  kb.appendChild(r)});
 const f=(id,x,y,w,h,rot)=>`<rect id="h-${id}" class="fing" x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2}" fill="${fcol(id[1]==='t'?'th':id)}" ${rot?`transform="rotate(${rot} ${x+w/2} ${y+h})"`:''}/>`;
 const hand=s=>`${f(s+'p',18,58,28,62)}${f(s+'r',52,32,30,88)}${f(s+'m',88,22,30,98)}${f(s+'i',124,34,30,86)}${f(s+'t',140,100,26,54,28)}<rect class="palm" x="16" y="100" width="142" height="64" rx="28"/>`;
 $('#hands').innerHTML=`<svg viewBox="0 0 360 196" aria-label="Hands showing which finger to use">${hand('l')}<g transform="translate(360 0) scale(-1 1)">${hand('r')}</g><text x="87" y="190" text-anchor="middle">LEFT</text><text x="273" y="190" text-anchor="middle">RIGHT</text></svg>`;
 kb.onclick=e=>{const b=e.target.closest('.key');if(!b)return;const id=b.dataset.k;
  if(id==='shiftL'||id==='shiftR'){vShift=!vShift;b.classList.toggle('hl',vShift);return}
  let ch=id==='space'?' ':id.length===1?id:null;if(!ch)return;
  if(vShift){ch=ch.toUpperCase();vShift=false;document.querySelectorAll('.key.hl').forEach(k=>k.classList.remove('hl'))}
  input(ch,false)};
}
function setAvail(set,shift){keyEls.forEach((el,id)=>{const on=id==='space'||set.has(id)||(shift&&(id==='shiftL'||id==='shiftR'));el.classList.toggle('off',!on)})}
function setTarget(ch,extraKeys){
 document.querySelectorAll('.key.tgt').forEach(k=>k.classList.remove('tgt'));
 document.querySelectorAll('.fing.on').forEach(k=>k.classList.remove('on'));
 if(extraKeys)extraKeys.forEach(k=>keyEls.get(k)?.classList.add('tgt'));
 if(ch==null)return;
 const k=keyInfo(ch);k.keys.forEach(x=>keyEls.get(x)?.classList.add('tgt'));
 k.fingers.forEach(f=>(f==='th'?['lt','rt']:[f]).forEach(x=>document.getElementById('h-'+x)?.classList.add('on')));
}
function lightFingers(list){document.querySelectorAll('.fing.on').forEach(k=>k.classList.remove('on'));list.forEach(x=>document.getElementById('h-'+x)?.classList.add('on'))}

/* ================= CONTENT ================= */
function learned(i){let s='';for(let j=0;j<=i;j++)if(!LESSONS[j].sp||LESSONS[j].sp==='num')s+=LESSONS[j].k;return new Set(s)}
function weakKeys(pool){return [...pool].filter(c=>c!==' ').map(c=>{const k=S.ks[c]||{h:0,m:0};return[c,(k.m+1)/(k.h+k.m+3)]}).sort((a,b)=>b[1]-a[1]).slice(0,4).filter(x=>x[1]>.3).map(x=>x[0])}
function groups(pick,len,min,max){let out=[],n=0;while(n<len){const g=min+Math.floor(Math.random()*(max-min+1));let w='';for(let k=0;k<g;k++)w+=pick();out.push(w);n+=w.length+1}return out.join(' ')}
function fillWords(list,len){let out=[],n=0,last='';while(n<len){let w=rand(list);if(w===last&&list.length>1)continue;last=w;out.push(w);n+=w.length+1}return out.join(' ')}
function fillSent(list,len){let out=[],n=0,used=new Set();while(n<len||!out.length){let s=rand(list);if(used.has(s)&&used.size<list.length)continue;used.add(s);out.push(s);n+=s.length+1}return out.join(' ')}
function genText(i,s,practice){
 const L=LESSONS[i],mult=S.set.len,learnedSet=learned(i),letters=[...learnedSet].filter(c=>/[a-z;,.]/.test(c));
 const len=Math.round(([14,22,30][s]+i*[.6,1.2,1.8][s])*mult*(isBoss(i,s)&&!practice?1.25:1));
 if(practice){const w=weakKeys(learnedSet);const pool=w.length?[...w,...w,...letters]:letters;return groups(()=>rand(pool),Math.round(24*mult),2,4)}
 if(L.sp==='caps'){
  if(s===0)return groups(()=>rand([...'FJDKSLAGH',...letters.filter(c=>/[a-z]/.test(c)).map(c=>c.toUpperCase())]),len,1,1);
  if(s===1)return fillWords(WORDS.filter(w=>w.length>2).map(w=>w[0].toUpperCase()+w.slice(1)),len);
  return fillWords(['Pop',...SPECIES.flatMap(x=>x.n)],len);
 }
 if(L.sp==='sent')return fillSent(SENT,len+ s*6);
 if(L.sp==='master')return fillSent(s===0?SENT:MSENT,len+s*8);
 if(L.sp==='num'){
  const nd=[...L.k],all=[...learnedSet].filter(c=>/\d/.test(c));
  if(s===0)return groups(()=>rand(nd),len,1,2);
  if(s===1){let out=[],n=0;while(n<len){const t=Math.random()<.5?groups(()=>rand(all),3,2,3):rand(WORDS.filter(w=>w.length<6));out.push(t);n+=t.length+1}return out.join(' ')}
  return fillSent(NSENT.filter(x=>[...x].every(c=>!/\d/.test(c)||all.includes(c))).concat(i>=18?NSENT:[]),len);
 }
 const nk=[...L.k];
 if(s===0)return groups(()=>Math.random()<.85?rand(nk):rand(letters),len,2,3);
 const weak=weakKeys(learnedSet);
 if(s===1)return groups(()=>{const r=Math.random();return r<.45?rand(nk):r<.6&&weak.length?rand(weak):rand(letters)},len,2,4);
 const ok=WORDS.filter(w=>[...w].every(c=>learnedSet.has(c)));
 if(ok.length<6)return groups(()=>Math.random()<.5?rand(nk):rand(letters),len,3,4);
 const withNew=ok.filter(w=>nk.some(c=>w.includes(c)));
 let out=[],n=0;while(n<len){const w=withNew.length>=3&&Math.random()<.6?rand(withNew):rand(ok);if(out[out.length-1]===w)continue;out.push(w);n+=w.length+1}
 return out.join(' ');
}

/* ================= PROGRESS ================= */
const sk=(i,s)=>i+'-'+s;
const bestOf=n=>S.best[sk(Math.floor(n/8),n%8)]||0;
const unlocked=n=>window.SEQU?SEQU(n):(n<=S.skip||bestOf(n-1)>=1);
let TOTAL=LESSONS.length*3;
function nextStage(){const T=LESSONS.length*8;for(let n=S.skip;n<T;n++)if(bestOf(n)<1)return n;return T-1}
let needXP=L=>30*(L-1)*L;
function levelOf(xp){let L=1;while(xp>=needXP(L+1))L++;return L}
const TITLES=['Rookie','Scout','Explorer','Ranger','Ace','Captain','Hero','Champion','Master','Grand Master','Legend','Keyboard Legend'];
const titleOf=L=>TITLES[Math.min(L-1,TITLES.length-1)];
function regionDone(r){return LESSONS.every((l,i)=>l.r!==r||[0,1,2,3,4,5,6,7].every(s=>(S.best[sk(i,s)]||0)>=1))}

/* ================= SCREENS ================= */
let screen='home';
function show(id){screen=id;document.querySelectorAll('.screen').forEach(x=>x.hidden=x.id!=='s-'+id);if(id!=='play')stopRound();if(id!=='game')stopGame();if(id!=='play'&&id!=='game')setTarget(null);({home:renderHome,map:renderMap,binder:renderBinder,shop:renderShop,arcade:renderArcade,parents:renderParents}[id]||(()=>{}))();window.scrollTo(0,0)}
function toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2200)}
function modal(html){$('#mbox').innerHTML=html;$('#modal').hidden=false}
function closeModal(){$('#modal').hidden=true}
const gemsHTML=()=>`<span class="gem">${ICON.gem}${S.gems}</span>`;
const soundBtn=()=>`<button class="icon-btn" data-act="sound" aria-label="Sound on or off">${S.set.sound?ICON.sound:ICON.mute}</button>`;

function renderHome(){
 const L=levelOf(S.xp),lo=needXP(L),hi=needXP(L+1),pct=Math.round((S.xp-lo)/(hi-lo)*100);
 const cards=Object.keys(S.cards).length,holo=Object.values(S.cards).filter(c=>c.holo).length,n=nextStage();
 const nm=S.name?`<div class="tname"><h2>${esc(S.name)}</h2><span class="lvl">Level ${L} · ${titleOf(L)}</span><button class="btn sm alt" data-act="players" style="margin-left:auto">Switch player</button></div>`:
  `<div><h2 style="font-size:24px">Your name?</h2><div class="namebox" style="margin-top:8px"><input id="nm" maxlength="14" placeholder="Name" autocomplete="off"><button class="btn sm volt" data-act="saveName">Save</button></div></div>`;
 const touch=matchMedia('(pointer:coarse)').matches?'<p class="note">Best with a real keyboard.</p>':'';
 const lines=S.name?[`Hi ${esc(S.name)}!`,`Let's go!`,`Fingers on F and J!`]:[`Hi! I'm Pop!`];
 $('#s-home').innerHTML=`<div class="topbar" style="justify-content:flex-end">${gemsHTML()}${soundBtn()}<button class="icon-btn" data-act="settings" aria-label="Settings">${ICON.gear}</button></div>
 <div class="logo"><span class="l1">KEYLORIA</span><span class="l2">KINGDOM</span></div>
 <div class="home-grid"><div class="hero-big"><div class="pad"></div>${zookSVG()}<div class="say">${rand(lines)}</div></div>
 <div class="tcard panel">${nm}
  <div class="xpbar" title="XP to next level"><i style="width:${pct}%"></i></div>
  <div class="trow"><div><b>${S.xp}</b>XP</div><div><b>${cards}/${TOTAL}</b>Keylori</div><div><b>${holo}</b>Holo cards</div><div><b>${Object.values(S.best).reduce((a,b)=>a+b,0)}</b>Stars</div></div>
  <div class="badges">${REGIONS.map((r,k)=>`<div class="badge ${S.badges.includes(k)?'got':''}" style="--bc:${r.color}" title="${r.name} badge">${k+1}</div>`).join('')}</div>
  <div class="hbtns"><button class="btn big" data-act="play" data-n="${n}">${S.xp?'Continue':'Start adventure'}: ${lessonTitle(Math.floor(n/8))} · ${stageName(Math.floor(n/8),n%8)}</button>
   <button class="btn volt" data-act="go" data-to="map">Adventure Map</button><button class="btn volt" data-act="go" data-to="arcade">Arcade Mode</button><button class="btn alt" data-act="go" data-to="binder">Keylori Collection</button><button class="btn alt" data-act="go" data-to="shop">Hero Closet</button></div>
  <div class="eggrow">${eggSVG(S.egg.w)}<div><b>Daily Egg · ${S.egg.w} of 3 warm</b><span class="note">${S.egg.day===new Date().toDateString()?'Come back tomorrow!':'Play today to warm it.'}</span></div></div>
  ${!S.placed&&S.xp<200?`<p class="note" style="margin:0"><button class="linkbtn" data-act="place">Can you type already? Take a test</button></p>`:''}
  <p class="note" style="margin:0"><button class="linkbtn" data-act="go" data-to="parents">Grown-ups: see the progress report</button></p>
  ${touch}</div></div>`;
}
function renderMap(){
 const nx=nextStage();
 let h=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Adventure Map</h2><button class="btn sm volt" data-act="practice">Practice</button>${gemsHTML()}</div>`;
 REGIONS.forEach((R,r)=>{
  h+=(WREG.includes(r)?worldHead(r):'')+`<section class="region" style="--rc:${R.color}"><div class="rhead"><div class="badge ${S.badges.includes(r)?'got':''}" style="--bc:${R.color}">${r+1}</div><div><h3>${R.name}</h3><p class="muted">${R.desc}</p></div></div><div class="lessons">`;
  LESSONS.forEach((L,i)=>{if(L.r!==r)return;
   const keys=L.k?[...L.k].map(c=>`<span style="--fc:${fcol(fingerOf(c))}">${c.toUpperCase()}</span>`).join(''):'';
   h+=`<div class="lesson panel"><div class="lt"><div class="num">Lesson ${typeof LNUM==='function'?LNUM(i):i+1}</div><h4>${lessonTitle(i)}</h4><div class="minikeys">${keys}</div></div><div class="nodes">`;
   [0,1,2].forEach(s=>{const n=i*3+s,b=S.best[sk(i,s)]||0,u=unlocked(n);
    const thumb=!u?ICON.lock:creatureSVG(i,s,'fit '+(S.cards[sk(i,s)]?'':'sil')),nm=stageName(i,s);
    h+=`<button class="node ${u?'':'locked'} ${n===nx&&u?'next':''} ${isBoss(i,s)?'boss':''}" ${u?`data-act="play" data-n="${n}"`:'disabled'} aria-label="${nm}${u?'':' locked'}"><span class="nc">${thumb}</span><span class="nl">${nm}</span><span class="ns">${'★'.repeat(b)}${'☆'.repeat(u?3-b:0)}</span></button>`});
   h+='</div></div>'});
  h+='</div></section>'});
 $('#s-map').innerHTML=h;
}
function cardHTML(i,f,o={}){
 if(o.locked)return `<div class="cw bk ${o.cls||''}"><div class="card back"><b class="c-no">${String(i*3+f+1).padStart(3,'0')}</b><span>?</span></div></div>`;
 const sp=SPECIES[i];
 return `<div class="cw ${o.cls||''}"><div class="card ${o.holo?'holo':''} ${o.tier||''}" style="--tc:${TYPES[sp.t]}"><div class="c-top"><span class="c-no">${String(i*3+f+1).padStart(3,'0')}</span><span class="c-name">${sp.n[f]}</span><span class="c-form">${['Hatchling','Champion','Mythic'][f]}</span></div>
 <div class="c-art">${creatureSVG(i,f,'fit big',o.tier)}</div><div class="c-type"><span class="tpill">${sp.t}</span><span class="c-rar">${'★'.repeat(f+1)}</span></div>
 <p class="c-flav">${f===0?sp.fl:EVOLUTION_FLAVOR[i]?.[f-1]||sp.fl}</p><div class="c-foot">No. ${String(i*3+f+1).padStart(3,'0')} · ${o.tier==='diamond'?'Diamond ':o.tier==='gold'?'Gold ':''}${o.holo?'Holo':'Keylori'}</div></div></div>`;
}
function renderBinder(){
 const c=Object.keys(S.cards).length,holo=Object.values(S.cards).filter(x=>x.holo).length,gold=Object.values(S.cards).filter(x=>x.tier==='gold').length,dia=Object.values(S.cards).filter(x=>x.tier==='diamond').length;
 let g='';SPECIES.forEach((sp,i)=>[0,1,2].forEach(f=>{const cd=S.cards[sk(i,f)];g+=cd?cardHTML(i,f,cd):cardHTML(i,f,{locked:1})}));
 $('#s-binder').innerHTML=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Keylori Collection</h2><span class="muted">${c} of 60 found · ${holo} holo · ${gold} gold · ${dia} diamond</span></div>
 <p class="muted" style="margin-top:-6px">Win a level to get a card. 3 stars = holo!</p><div class="binder">${g}</div>`;
}
function renderShop(){
 let it='';Object.entries(ACC).forEach(([id,a])=>{const own=S.owned.includes(id),eq=S.equip[a.slot]===id;
  it+=`<div class="item panel ${eq?'eq':''}">${zookSVG({[a.slot]:id})}<span class="slot">${a.slot}</span><h4>${a.name}</h4>
  ${own?`<button class="btn sm ${eq?'alt':'volt'}" data-act="equip" data-id="${id}">${eq?'Take off':'Wear'}</button>`:`<button class="btn sm" data-act="buy" data-id="${id}" ${S.gems<a.cost?'disabled':''}>${ICON.gem.replace('<svg','<svg width="16" height="16"')} ${a.cost}</button>`}</div>`});
 $('#s-shop').innerHTML=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Hero Closet</h2>${gemsHTML()}</div>
 <div class="shop-top"><div class="shop-hero panel">${zookSVG()}<p class="muted" style="margin:0;text-align:center">Get stars to earn gems!</p></div><div class="items">${it}</div></div>`;
}
function settings(){
 const L=S.set.len;
 modal(`<h2>Settings</h2>
 <div class="setrow"><span>Sound effects</span><div class="seg"><button class="${S.set.sound?'on':''}" data-act="set" data-k="sound" data-v="1">On</button><button class="${S.set.sound?'':'on'}" data-act="set" data-k="sound" data-v="0">Off</button></div></div>
 <div class="setrow"><span>Read hints out loud</span><div class="seg"><button class="${S.set.voice?'on':''}" data-act="set" data-k="voice" data-v="1">On</button><button class="${S.set.voice?'':'on'}" data-act="set" data-k="voice" data-v="0">Off</button></div></div>
 <div class="setrow"><span>Letters on the screen keyboard<small class="muted" style="display:block;font-size:16px">Hide them for a no-peek bonus!</small></span><div class="seg">${[['show','Show'],['smart','Hide learned'],['hide','Hide all']].map(([v,t])=>`<button class="${S.set.hide===v?'on':''}" data-act="set" data-k="hide" data-v="${v}">${t}</button>`).join('')}</div></div>
 <div class="setrow"><span>Round length</span><div class="seg">${[[1,'Short'],[1.4,'Normal'],[1.8,'Long']].map(([v,t])=>`<button class="${L===v?'on':''}" data-act="set" data-k="len" data-v="${v}">${t}</button>`).join('')}</div></div>
 <div class="setrow"><span>Trainer name</span><button class="btn sm alt" data-act="rename">Change</button></div>
 <div class="setrow"><span>Start over from zero</span><button class="btn sm alt" data-act="reset1" id="rst">Reset progress</button></div>
 <button class="btn" data-act="close">Done</button>`);
}

/* ================= PLAY ================= */
let P={phase:'off'};
function stopRound(){clearInterval(P.idle);P.phase='off'}
function hud(){
 const L=LESSONS[P.i],R=REGIONS[L.r];
 $('#hud').innerHTML=`<button class="icon-btn" data-act="go" data-to="map" aria-label="Back to map">${ICON.back}</button>
 <div class="ht"><b>${P.mode==='place'?'Skill check':P.practice?'Practice: tricky keys':lessonTitle(P.i)+' · '+stageName(P.i,P.s)}</b><span>${R.name} · Lesson ${typeof LNUM==='function'?LNUM(P.i):P.i+1}${!P.mode&&!P.practice?` · <em class="partno">Part ${P.s+1} of ${NST}</em>`:''}</span></div>
 <div class="stat"><b id="h-acc">100%</b><span>Accuracy</span></div><div class="stat"><b id="h-cmb">0</b><span>Combo</span></div><button class="icon-btn" data-act="sayit" aria-label="Read the hint out loud">${ICON.say}</button>${soundBtn()}`;
 $('#arena').style.setProperty('--rc',R.color);
}
function startStage(n,mode){
 const practice=mode==='practice',place=mode==='place';
 const i=place?14:practice?(typeof EI==='function'?EI(Math.floor(Math.max(0,nextStage()-1)/8)):Math.floor(Math.max(0,nextStage()-1)/8)):Math.floor(n/8),s=practice?1:place?2:n%8;
 P={i,s,n,mode,practice,phase:'off'};
 show('play');$('#s-play').appendChild($('#kbwrap'));hud();
 const L=LESSONS[i],set=learned(i);if(L.sp==='caps'||i>15)[...'abcdefghijklmnopqrstuvwxyz;,.'].forEach(c=>set.add(c));
 setAvail(set,i>=15);if(i>=20)setAvail(new Set([...keyEls.keys()]),true);applyLabels();
 $('#stripIn').innerHTML='';$('#fhint').innerHTML='';
 if(place){let t='',segs=[];[4,9,14].forEach((k,x)=>{const ls=learned(k),p=fillWords(WORDS.filter(w=>w.length<7&&[...w].every(c=>ls.has(c))),26),a=t.length+(x?1:0);t+=(x?' ':'')+p;segs.push([a,t.length])});P.text=t;P.segs=segs;return beginRound()}
 if(!practice&&n===0&&!S.camp)return camp(0);
 if(!practice&&s===0&&introItems(i).length)return intro();
 beginRound();
}
function introItems(i){const L=LESSONS[i];if(L.sp==='caps')return['F','J'];if(L.sp==='sent'||L.sp==='master')return[];return[...L.k]}
const CAMP=[
 {h:'Hi! I am Pop!',p:'Sit up tall. Feet on the floor.',keys:[],f:[]},
 {h:'Find the bumps',p:'Feel the bumps on F and J. Put your pointer fingers there.',keys:['f','j'],f:['li','ri']},
 {h:'Home Row',p:'Put your other fingers next to them.',keys:[...'asdfjkl;'],f:['lp','lr','lm','li','ri','rm','rr','rp']},
 {h:'Thumbs on SPACE',p:'Match your finger color to the key color.',keys:['space'],f:['lt','rt']},
 {h:'Go slow!',p:'Go back to the Home Row after each key.',keys:[...'asdfjkl;'],f:['lp','lr','lm','li','ri','rm','rr','rp','lt','rt']}
];
function camp(k){
 P.phase='camp';P.campK=k;const c=CAMP[k];
 $('#arena').innerHTML=`${scn()}<div class="intro"><div>${zookSVG()}</div><div class="ib"><span class="tag">Keyboard Camp · ${k+1} of ${CAMP.length}</span><h3>${c.h}</h3><p>${c.p}</p>
 <div class="row"><button class="btn sm" data-act="campNext">${k<CAMP.length-1?'Next':"Let's go!"}</button><span class="muted" style="font-size:13px">or press SPACE</span><button class="linkbtn" data-act="campSkip">Skip camp</button></div></div></div>`;
 setTarget(null,c.keys);lightFingers(c.f);speak(c.h+'. '+c.p);
 $('#fhint').innerHTML='';
}
function campNext(){sfx.click();if(P.campK<CAMP.length-1)camp(P.campK+1);else{S.camp=true;save();introItems(P.i).length?intro():beginRound()}}
function intro(){P.phase='intro';P.iq=introItems(P.i);P.ik=0;P.in=0;renderIntro()}
function renderIntro(){
 const ch=P.iq[P.ik],k=keyInfo(ch),c=fcol(k.f),L=LESSONS[P.i];
 const title=L.sp==='caps'?'Big letters':'New key';
 const txt=L.sp==='caps'?`Hold SHIFT with your other pinky. Then press ${ch}.`:`Press ${disp(ch)}.`;
 $('#arena').innerHTML=`${scn()}<div class="intro"><div>${zookSVG()}</div><div class="ib"><span class="tag">${title} · ${P.ik+1} of ${P.iq.length}</span>
 <div class="row"><div class="bigkey" style="--fc:${c}">${ch}</div><div><h3>Use your <span style="color:${c}">${FNAME[k.f]}</span></h3><p>${txt}</p></div></div>
 <div class="row"><button class="linkbtn" data-act="introSkip">Skip</button><span class="muted">3 times</span><div class="dots" style="--fc:${c}">${[0,1,2].map(d=>`<i class="${d<P.in?'on':''}"></i>`).join('')}</div></div></div></div>`;
 setTarget(ch);$('#fhint').innerHTML=fingerHTML(ch);
 if(P.in===0)speak(txt);
}
function beginRound(){
 P.text=P.text||genText(P.i,P.s,P.practice);P.pos=0;P.mist=new Set();P.combo=0;P.start=0;P.last=performance.now();P.phase='play';P.maxCombo=0;
 const foeI=P.mode==='place'?'19-0':P.practice?(Object.keys(S.cards)[0]||'0-0'):(P.i+'-'+formNow(P.i)),[fi,ff]=foeI.split('-').map(Number);P.fi=fi;P.ff=ff;
 P.tier=null;if(!P.mode){const r=Math.random();P.tier=r<1/80?'diamond':r<1/20?'gold':null}
 const name=SPECIES[fi].n[ff],boss=!P.mode&&isBoss(P.i,P.s),vname=villainName(P.i,boss);
 $('#arena').innerHTML=`${scn()}<div class="bubble" id="bubble"></div><div class="hero" id="hero">${zookSVG()}</div><div class="foe" id="foe"><div class="cage">${creatureSVG(fi,ff,'px',P.tier)}</div></div><div class="villain ${boss?'boss':''}" id="vil">${villainSVG(P.i,boss)}</div>
 <div class="fmeter"><span class="fname">${vname}</span><div class="bar"><i id="fbar" style="width:100%"></i></div><span class="flab">Free ${name}!</span></div>`;
 say(P.tier?`WOW! A ${P.tier.toUpperCase()} ${name}! Save it!`:P.mode==='place'?'Type what you see. No rush!':boss?`Boss! Save ${name}!`:`Save ${name}! Type to zap!`);
 $('#stripIn').innerHTML=[...P.text].map(c=>`<span class="${c===' '?'sp':''}">${c===' '?'·':esc(c)}</span>`).join('');
 updateStrip();
 clearInterval(P.idle);P.idle=setInterval(()=>{if(P.phase==='play'&&performance.now()-P.last>7000&&P.hinted!==P.pos){P.hinted=P.pos;const t=P.text[P.pos];say(`Find ${disp(t)}!`);speak(fingerSay(t))}},1000);
}
function say(t,bad){const b=$('#bubble');if(!b)return;b.innerHTML=t;b.classList.toggle('bad',!!bad);b.classList.add('pop');setTimeout(()=>b.classList.remove('pop'),200)}
function updateStrip(){
 const sp=$('#stripIn').children,t=P.text[P.pos];
 for(let k=Math.max(0,P.pos-2);k<Math.min(sp.length,P.pos+2);k++){sp[k].classList.remove('cur');if(k<P.pos){sp[k].classList.add(P.mist.has(k)?'fix':'ok')}}
 if(t!=null){const el=sp[P.pos];el.classList.add('cur');el.style.setProperty('--fc',fcol(keyInfo(t).f));
  if(!document.body.classList.contains('lines2')){const w=$('#strip').clientWidth;$('#stripIn').style.transform=`translateX(${w/2-(el.offsetLeft+el.offsetWidth/2)}px)`}
  setTarget(t);$('#fhint').innerHTML=fingerHTML(t)}
 const len=P.text.length;$('#fbar').style.width=(100-P.pos/len*100)+'%';
 const acc=P.pos?Math.round((P.pos-[...P.mist].filter(x=>x<P.pos).length)/P.pos*100):100;$('#h-acc').textContent=acc+'%';$('#h-cmb').textContent=P.combo;
}
function stat(c,hit){const b=c.toLowerCase();if(b===' ')return;const k=S.ks[b]||(S.ks[b]={h:0,m:0});hit?k.h++:k.m++}
function zap(color,big){const a=$('#arena');laser(a,$('#hero'),$('#vil'),color,big);kick($('#vil'),'hit');kick($('#hero'),'recoil');if(big){kick(a,'quake');burst(a,$('#vil'),color,8)}}
function pressFx(id){const el=keyEls.get(id);if(!el)return;el.classList.add('press');setTimeout(()=>el.classList.remove('press'),120)}
const PRAISE=['Nice!','Zap!','Great typing!','You got it!','Awesome!','Keep going!','Super!','Wow!'];
function matchKey(ch,t,caps){if(t==null)return false;return ch===t||(/[a-z]/.test(t)&&ch.toLowerCase()===t)||(caps&&ch.toLowerCase()===t.toLowerCase()&&/[a-z]/i.test(t))}
function input(ch,caps){
 if(screen==='game')return gameInput(ch,caps);
 if(P.phase==='camp'){if(ch===' '||ch==='\n')campNext();return}
 if(P.phase==='intro'){const t=P.iq[P.ik];pressFx(ch===' '?'space':ch.toLowerCase());
  if(matchKey(ch,t,caps)){P.in++;sfx.ok(P.in*3);if(P.in>=3){P.ik++;P.in=0;if(P.ik>=P.iq.length){P.phase='wait';setTimeout(()=>{sfx.win();beginRound()},450)}else renderIntro()}else renderIntro()}
  else if(ch.length===1){sfx.bad();$('#fhint').innerHTML=`That was ${esc(disp(ch))}. ${fingerHTML(t)}`}
  return}
 if(P.phase!=='play')return;
 const t=P.text[P.pos];if(!P.start)P.start=performance.now();P.last=performance.now();
 pressFx(ch===' '?'space':ch.toLowerCase());
 if(matchKey(ch,t,caps)){
  if(!P.mist.has(P.pos))stat(t,true);
  if(caps&&ch!==t)$('#fhint').innerHTML='<span class="caps-warn">Caps Lock is on. Press Caps Lock once to turn it off.</span>';
  P.pos++;P.combo++;P.maxCombo=Math.max(P.maxCombo,P.combo);
  const big=P.combo%10===0;zap(fcol(keyInfo(t).f),big);big?sfx.super():sfx.ok(P.combo);
  if(big)say(`Super zap!`);else if(P.combo%6===0)say(rand(PRAISE));
  if(P.pos>=P.text.length){updateStrip();return finish()}
  updateStrip();
 }else{
  if(!P.mist.has(P.pos)){P.mist.add(P.pos);stat(t,false)}
  P.combo=0;sfx.bad();const s=$('#strip');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');
  kick($('#vil'),'laugh');
  say(`Oops! Find ${esc(disp(t))}.`,true);updateStrip();
 }
}
function finish(){
 P.phase='done';clearInterval(P.idle);setTarget(null);
 const len=P.text.length,acc=Math.round((len-P.mist.size)/len*100),mins=Math.max((performance.now()-P.start)/60000,1/60),wpm=Math.round(len/5/mins);
 const secs=(performance.now()-P.start)/1000;S.time+=Math.round(secs);sessionSecs+=secs;S.rounds++;
 if(P.mode==='place')return placeResult();
 const stars=acc>=95?3:acc>=85?2:acc>=60?1:0,pass=stars>=1;
 const oldL=levelOf(S.xp);let xp=len+(pass?20*stars:5),gems=0,newCard=false,holoUp=false,badge=null,tierUp=null;
 if(P.practice){gems=0}
 else if(pass){const k=sk(P.i,P.s),prev=S.best[k]||0;gems=Math.max(0,stars-prev)*2+(prev===0?1:0);S.best[k]=Math.max(prev,stars);
  if(!S.cards[k]){S.cards[k]={holo:stars===3};newCard=true}else if(stars===3&&!S.cards[k].holo){S.cards[k].holo=true;holoUp=true}
  if(P.tier&&better(P.tier,S.cards[k].tier)){S.cards[k].tier=P.tier;tierUp=P.tier}
  const r=LESSONS[P.i].r;if(!S.badges.includes(r)&&regionDone(r)){S.badges.push(r);badge=REGIONS[r].name}}
 S.xp+=xp;S.gems+=gems;S.hist.push({t:Date.now(),w:wpm,a:acc});if(S.hist.length>80)S.hist.shift();const egg=pass?dailyEgg():null;save();
 const newL=levelOf(S.xp);
 if(pass){$('#vil')?.classList.add('pop');burst($('#arena'),$('#vil'),GV[P.i%5],22);$('#foe')?.classList.add('friend');$('#hero')?.classList.add('cheer');for(let h=0;h<5;h++)setTimeout(()=>{const e=document.createElement('div');e.className='heart';e.textContent='♥';e.style.right=(14+Math.random()*14)+'%';$('#arena')?.appendChild(e);setTimeout(()=>e.remove(),1300)},h*140);sfx.win();say(`You saved ${SPECIES[P.fi].n[P.ff]}!`)}
 else{$('#vil')?.classList.add('laugh');say('Try again! Go slow.')}
 const R_={acc,wpm,stars,pass,xp,gems,newCard,holoUp,badge,lvl:newL>oldL?newL:0,egg,tierUp,brk:takeBreak()};
 if(pass&&!P.practice)setTimeout(()=>catchAnim(()=>results(R_)),1000);else setTimeout(()=>results(R_),pass?1300:900);
}
function results(r){
 const name=SPECIES[P.fi].n[P.ff],n=P.n,hasNext=!P.practice&&n+1<LESSONS.length*8;
 const st=[1,2,3].map(k=>ICON.star.replace('<svg',`<svg class="${k<=r.stars?'on':''}"`)).join('');
 let card='';
 if(r.pass&&!P.practice)card=`<div class="flip" id="flip"><div class="fi">${cardHTML(P.fi,P.ff,S.cards[P.fi+'-'+P.ff]||{})}${cardHTML(0,0,{locked:1})}</div></div>`;
 const bonusForms=[...new Set([...(r.holoForms||[]),r.tierF].filter(f=>f!=null&&f!==P.ff))];
 const bonusCards=bonusForms.length?`<div class="reward-cards">${bonusForms.map(f=>cardHTML(P.fi,f,S.cards[P.fi+'-'+f]||{})).join('')}</div>`:'';
 const head=P.practice?(r.pass?'Practice complete!':'Good practice!'):r.pass?(r.newCard?`You befriended ${name}!`:`${name} is happy to see you!`):'So close!';
 const tip=r.pass?(r.stars<3?`<p class="muted" style="margin:0">3 stars help your Keylori evolve!</p>`:''):
  `<p style="margin:0">Try again! Go slow.</p>`;
 modal(`<h2>${head}</h2><div class="bigstars">${st}</div>${card}${tip}
 ${(r.holoForms||[]).map(f=>`<div class="banner">Your ${SPECIES[P.fi].n[f]} card is now HOLO!</div>`).join('')}
 ${r.lvl?`<div class="banner gold">Level up! You are now Level ${r.lvl}: ${titleOf(r.lvl)}</div>`:''}
 ${r.badge?`<div class="banner gold">You earned the ${r.badge} badge!</div>`:''}
 ${r.tierUp?`<div class="banner ${r.tierUp==='diamond'?'dia':'gold'}">WOW! You caught a ${r.tierUp.toUpperCase()} ${SPECIES[P.fi].n[r.tierF??P.ff]}!</div>`:''}${bonusCards}${r.evo===2&&!S.cards[P.fi+'-2']?.holo?`<p class="muted" style="margin:0">${SPECIES[P.fi].n[2]} is fully evolved. Earn 3 stars on both final stages to make its card holo.</p>`:''}${eggBanner(r.egg)}
 ${r.brk?`<div class="banner">Break time! Wiggle your fingers.</div>`:`<p class="note" style="margin:0">${rand(TIPS)}</p>`}
 <h3>Your run</h3><div class="rstats"><div><b>${r.stars} ★</b><span>Stars</span></div><div><b>${r.acc}%</b><span>Accuracy</span></div><div><b>${r.wpm}</b><span>Words per minute</span></div><div><b>+${r.xp}</b><span>XP</span></div><div><b>+${r.gems}</b><span>Diamonds</span></div></div>
 <div class="rbtns"><button class="btn" data-act="${P.practice?'practice':'play'}" data-n="${n}">Play again</button>${r.pass&&hasNext?`<button class="btn alt" data-act="play" data-n="${n+1}">Next ▸</button>`:''}${shareRunHTML('Adventure',`${r.stars} stars · ${r.wpm} WPM · ${r.acc}% accuracy`)}<button class="btn alt" data-act="go" data-to="map">Map</button></div>`);
 setTimeout(()=>$('#flip')?.classList.add('go'),350);
 if(r.lvl)setTimeout(sfx.lvl,700);
 speak(head);
}

/* ================= EVENTS ================= */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ACT={
 go:d=>{closeModal();show(d.to)},
 play:d=>{closeModal();startStage(+d.n)},
 practice:()=>{closeModal();startStage(0,'practice')},
 place:()=>{closeModal();startStage(0,'place')},
 sayit:sayIt, meteor:()=>{closeModal();startMeteor()}, glitch:()=>{closeModal();startGlitch()}, race:()=>{closeModal();startRace()},
 campSkip:()=>{S.camp=true;save();introItems(P.i).length?intro():beginRound()},
 introSkip:()=>{if(P.phase==='intro'){P.phase='wait';beginRound()}},
 settings, close:()=>{closeModal();if(screen==='home')renderHome()},
 sound:()=>{S.set.sound=!S.set.sound;save();document.querySelectorAll('[data-act="sound"]').forEach(b=>b.innerHTML=S.set.sound?ICON.sound:ICON.mute)},
 set:d=>{S.set[d.k]=d.k==='len'?+d.v:d.k==='hide'?d.v:d.v==='1';applyLabels();save();settings()},
 saveName:()=>{const v=$('#nm')?.value.trim();if(v){S.name=v;save();renderHome();sfx.win()}},
 rename:()=>{S.name='';save();closeModal();show('home');setTimeout(()=>$('#nm')?.focus(),50)},
 reset1:()=>{const b=$('#rst');b.textContent='Tap again to erase everything';b.dataset.act='reset2'},
 reset2:()=>{try{localStorage.removeItem(LS_KEY)}catch(e){}load();closeModal();show('home');toast('Progress reset')},
 campNext,
 buy:d=>{const a=ACC[d.id];if(S.gems<a.cost)return;S.gems-=a.cost;S.owned.push(d.id);S.equip[a.slot]=d.id;save();sfx.win();toast(a.name+' unlocked!');renderShop()},
 equip:d=>{const a=ACC[d.id];S.equip[a.slot]=S.equip[a.slot]===d.id?null:d.id;save();sfx.click();renderShop()}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const f=ACT[b.dataset.act];if(f)f(b.dataset)});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'&&P.phase!=='done')closeModal()});
document.addEventListener('keydown',e=>{
 if(e.target.matches('input')){if(e.key==='Enter')ACT.saveName();return}
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(!$('#modal').hidden){if(e.key==='Enter'||(e.key===' '&&$('#mbox .rbtns .nextbtn'))){const b=$('#mbox .rbtns .nextbtn')||$('#mbox .rbtns .btn');if(b){e.preventDefault();b.click()}}if(e.key==='Escape'&&P.phase!=='done')closeModal();return}
 if(screen!=='play'&&screen!=='game')return;
 if(e.key==='Escape'){show(screen==='game'?'arcade':'map');return}
 const caps=e.getModifierState&&e.getModifierState('CapsLock');
 if(e.key===' '||e.key==="'"||e.key==='/'||e.key==='Tab')e.preventDefault();
 if(e.key==='Enter'){if(P.phase==='camp')campNext();return}
 if(e.key.length!==1)return;
 e.preventDefault();input(e.key,caps);
});
window.addEventListener('resize',()=>{if(P.phase==='play')updateStrip()});

/* ================= V2: extras, arcade, grown-ups ================= */
let sessionSecs=0,breakShown=false,G={};
function isBoss(i,s){return s===7&&(i===LESSONS.length-1||LESSONS[i+1].r!==LESSONS[i].r)}
const stageName=(i,s)=>isBoss(i,s)?'Boss Battle':(STAGES8[s]||STAGES[s]);
function takeBreak(){if(sessionSecs>600&&!breakShown){breakShown=true;return true}return false}
const TIPS=['Eyes on the screen!','Sit up tall!','Back to the Home Row!','Slow is OK!'];
function mastered(id){const k=S.ks[id];return k&&k.h>=25&&k.h/(k.h+k.m)>=.92}
function applyLabels(){keyEls.forEach((el,id)=>el.classList.toggle('nolab',id.length===1&&(S.set.hide==='hide'||(S.set.hide==='smart'&&mastered(id)))))}
function eggSVG(w){return `<svg viewBox="0 0 100 120" class="egg" aria-hidden="true"><ellipse cx="50" cy="66" rx="36" ry="46" fill="#fff4dc" ${st}/><circle cx="36" cy="50" r="7" fill="#ffc93c"/><circle cx="62" cy="82" r="9" fill="#3ee6ff"/><circle cx="62" cy="40" r="5" fill="#ff8fc8"/>${w>=1?`<path d="M18 72 L30 64 L38 74 L48 64" fill="none" stroke="${OL}" stroke-width="3"/>`:''}${w>=2?`<path d="M54 60 L64 50 L72 60 L82 52" fill="none" stroke="${OL}" stroke-width="3"/>`:''}</svg>`}
function dailyEgg(){const d=new Date().toDateString();if(S.egg.day===d)return null;S.egg.day=d;S.egg.w++;if(S.egg.w<3)return{warm:S.egg.w};S.egg.w=0;
 const t=Math.random()<.2?'diamond':'gold',pool=Object.keys(S.cards).filter(k=>better(t,S.cards[k].tier)),k=pool.length?rand(pool):'0-0';if(!S.cards[k])S.cards[k]={holo:false};S.cards[k].tier=t;S.gems+=5;return{hatch:k,tier:t}}
function eggBanner(e){if(!e)return'';if(e.hatch){const[a,b]=e.hatch.split('-').map(Number);return `<div class="banner ${e.tier==='diamond'?'dia':'gold'}">Your egg hatched a ${(e.tier||'gold').toUpperCase()} ${SPECIES[a].n[b]}! +5 gems</div>`}return `<div class="banner">Daily egg warmed up: ${e.warm} of 3</div>`}
function speakNow(t){const v=S.set.voice;S.set.voice=true;speak(t);S.set.voice=v}
function sayIt(){let t='';if(screen==='game'&&G.next)t=fingerSay(G.next);else if(P.phase==='camp'){const c=CAMP[P.campK];t=c.h+'. '+c.p}else if(P.phase==='intro')t=fingerSay(P.iq[P.ik]);else if(P.phase==='play')t=fingerSay(P.text[P.pos]);if(t)speakNow(t)}
function placeResult(){
 const seg=P.segs.map(([a,b])=>{let m=0;P.mist.forEach(x=>{if(x>=a&&x<b)m++});return Math.round((b-a-m)/(b-a)*100)});
 let skip=0,where='';if(seg[0]>=88){skip=40;where=REGIONS[1].name;if(seg[1]>=88){skip=80;where=REGIONS[2].name;if(seg[2]>=88){skip=120;where=REGIONS[3].name}}}
 S.skip=Math.max(S.skip,skip);S.placed=true;if(skip)S.camp=true;save();sfx.win();
 modal(`<h2>Done!</h2><div class="hero-mini">${zookSVG()}</div>
 <div class="rstats" style="grid-template-columns:repeat(3,1fr)">${['Home row','Top row','All letters'].map((t,k)=>`<div><b>${seg[k]}%</b><span>${t}</span></div>`).join('')}</div>
 <p style="margin:0">${skip?`Start at <b>${where}</b>!`:`Start at the beginning!`}</p>
 <div class="rbtns"><button class="btn" data-act="play" data-n="${nextStage()}">Let's go ▸</button><button class="btn alt" data-act="go" data-to="map">Map</button></div>`);
}
/* ---- arcade ---- */
const arcadeLesson=()=>(typeof EI==='function'?EI(Math.floor(nextStage()/8)):Math.floor(nextStage()/8));
function stopGame(){if(G.raf)cancelAnimationFrame(G.raf);G.done=true;G.raf=0}
let meteorArt=()=>`<svg viewBox="0 0 160 120"><path d="M20 10 L96 70" stroke="#ff9f45" stroke-width="18" stroke-linecap="round" opacity=".5"/><path d="M36 22 L96 70" stroke="#ffd84d" stroke-width="8" stroke-linecap="round" opacity=".7"/><circle cx="104" cy="76" r="30" fill="#8a6446" ${st}/><circle cx="96" cy="68" r="6" fill="#5b3d2a"/><circle cx="114" cy="86" r="8" fill="#5b3d2a"/><text x="104" y="84" text-anchor="middle" font-family="Atkinson Hyperlegible Mono,monospace" font-weight="700" font-size="26" fill="#fff">f</text></svg>`;
function renderArcade(){
 const i=arcadeLesson(),keys=[...learned(i)].filter(c=>/[a-z;,.]/.test(c)).join(' ').toUpperCase();
 $('#s-arcade').innerHTML=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Arcade</h2>${gemsHTML()}</div>
 <p class="muted" style="margin-top:-6px">Your keys: <b style="color:var(--ink)">${keys}</b></p>
 <div class="games">
  <div class="game panel feature"><div class="gart dark">${badSVG("inkblob",false,1)}${badSVG("imp",false,1)}</div><h3>Scrambler Attack</h3><p>Type the words. Zap the bad guys!</p><p class="note">Best score: ${S.arc.glitch} · Wins: ${S.arc.gwin}</p><button class="btn" data-act="glitch">Play</button></div>
  <div class="game panel"><div class="gart">${meteorArt()}</div><h3>Meteor Zap</h3><p>Type to zap the rocks!</p><p class="note">Best score: ${S.arc.meteor}</p><button class="btn" data-act="meteor">Play</button></div>
  <div class="game panel"><div class="gart race">${creatureSVG(2,1,"big")}${creatureSVG(0,1,"big")}</div><h3>Keylori Race</h3><p>Type fast to win the race!</p><p class="note">Races won: ${S.arc.race}</p><button class="btn" data-act="race">Play</button></div>
 </div>`;
}
function mountGame(title,sub,la,lb){
 stopGame();show('game');$('#s-game').appendChild($('#kbwrap'));
 $('#gnotice').hidden=true;$('#gnotice').innerHTML='';
 const i=arcadeLesson(),set=learned(i);if(i>15)[...'abcdefghijklmnopqrstuvwxyz;,.'].forEach(c=>set.add(c));setAvail(set,i>=15);if(i>=20)setAvail(new Set([...keyEls.keys()]),true);applyLabels();
 $('#ghud').innerHTML=`<button class="icon-btn" data-act="go" data-to="arcade" aria-label="Back to arcade">${ICON.back}</button><div class="ht"><b>${title}</b><span>${sub}</span></div><div class="stat"><b id="g-a">0</b><span>${la}</span></div><div class="stat"><b id="g-b">-</b><span>${lb}</span></div><button class="icon-btn" data-act="sayit" aria-label="Read the hint out loud">${ICON.say}</button>${soundBtn()}`;
 $('#ghint').innerHTML='';
}
function cityHTML(){let b='';for(let x=0,k=0;x<1000;k++){const w=40+(k*37)%50,h=20+(k*53)%38;b+=`<rect x="${x}" y="${60-h}" width="${w}" height="${h}" fill="#1c2466"/>`;for(let wy=64-h;wy<56;wy+=10)for(let wx=x+6;wx<x+w-8;wx+=12)if((wx+wy+k)%3)b+=`<rect x="${wx}" y="${wy}" width="4" height="5" fill="#ffd84d" opacity=".7"/>`;x+=w+4}return `<svg class="city" viewBox="0 0 1000 60" preserveAspectRatio="none">${b}</svg>`}
function startMeteor(){
 const i=arcadeLesson(),set=[...learned(i)].filter(c=>/[a-z]/.test(c)),words=WORDS.filter(w=>w.length<=5&&[...w].every(c=>set.includes(c)));
 mountGame('Meteor Zap','Type the letters!','Score','Shields');
 G={type:'meteor',set,words:i>=5&&words.length>=8?words:null,m:[],shields:3,score:0,spawned:0,total:Math.round(24*S.set.len),speed:1,tgt:null,spawnT:1,hits:0,errs:0,zapped:0,done:false,next:null};
 $('#gsw').hidden=true;$('#garena').className='garena met-arena';
 $('#gnotice').innerHTML='<div class="game-note" id="gbub">Here they come!</div>';$('#gnotice').hidden=false;
 $('#garena').innerHTML=`${cityHTML()}<div class="gz">${zookSVG()}</div>`;
 gUpdate();G.last=performance.now();G.raf=requestAnimationFrame(mTick);
}
function spawnMeteor(){const txt=G.wordDeck?.[G.spawned]||arcadeBonus(G.spawned,5)||(G.words&&Math.random()<.6?rand(G.words):rand(G.set)),el=document.createElement('div');el.className='met';el.style.left=(10+Math.random()*74)+'%';
 el.innerHTML=`<span class="rock"></span><span class="mt">${[...txt].map(c=>`<i>${esc(c)}</i>`).join('')}</span>`;$('#garena').appendChild(el);G.m.push({txt,typed:0,y:-70,el});G.spawned++;mHint()}
function mTick(now){
 if(G.done||G.type!=='meteor')return;const dt=Math.min(.05,(now-G.last)/1000);G.last=now;
 const H=$('#garena').clientHeight,v=(G.words?13:19)*G.speed;G.spawnT-=dt;
 if(G.spawnT<=0&&G.spawned<G.total&&G.m.length<(G.words?3:4)){spawnMeteor();G.spawnT=Math.max(1.3,3.4/G.speed)}
 for(const m of [...G.m]){m.y+=v*dt;m.el.style.transform=`translateY(${m.y}px)`;if(m.y>H-110)landed(m)}
 if((G.spawned>=G.total&&!G.m.length)||G.shields<=0)return endMeteor();
 G.raf=requestAnimationFrame(mTick);
}
function removeMet(m,cls){G.m=G.m.filter(x=>x!==m);if(G.tgt===m)G.tgt=null;m.el.classList.add(cls);setTimeout(()=>m.el.remove(),450);mHint()}
function landed(m){G.shields--;G.speed=Math.max(.7,G.speed-.25);removeMet(m,'land');sfx.bad();gsay(G.shields>0?'Ouch!':'Oh no!',true);gUpdate()}
function mHint(){let t=null;if(G.tgt)t=G.tgt.txt[G.tgt.typed];else if(G.m.length)t=G.m.reduce((a,b)=>a.y>b.y?a:b).txt[0];G.next=t;setTarget(t);$('#ghint').innerHTML=t?fingerHTML(t):''}
function gsay(t,bad){const b=$('#gbub');if(b){b.innerHTML=t;b.classList.toggle('bad',!!bad)}}
function gUpdate(){$('#g-a').textContent=G.score;$('#g-b').textContent=G.shields>0?'♥'.repeat(G.shields):'0'}
function zapTo(m){laser($('#garena'),$('#garena .gz'),m.el,fcol(keyInfo(m.txt[m.typed-1]).f),false,.5,.4);return;const a=$('#garena'),ar=a.getBoundingClientRect(),r=m.el.getBoundingClientRect(),b=document.createElement('div');b.className='beam';
 const x1=ar.width/2,y1=ar.height-70,x2=r.left-ar.left+r.width/2,y2=r.top-ar.top+r.height/2;
 b.style.cssText=`left:${x1}px;top:${y1}px;width:${Math.hypot(x2-x1,y2-y1)}px;transform:rotate(${Math.atan2(y2-y1,x2-x1)}rad)`;a.appendChild(b);setTimeout(()=>b.remove(),160)}
function gameInput(ch,caps){
 if(G.done)return;pressFx(ch===' '?'space':ch.toLowerCase());
 if(G.type==='race')return raceInput(ch,caps);
 if(G.type==='glitch')return glitchInput(ch,caps);
 if(caps)ch=ch.toLowerCase();
 let m=G.tgt;if(!m){const c=G.m.filter(x=>matchKey(ch,x.txt[0],caps));if(c.length)m=c.reduce((a,b)=>a.y>b.y?a:b)}
 if(m&&matchKey(ch,m.txt[m.typed],caps)){G.tgt=m;m.typed++;G.hits++;const s=m.el.querySelectorAll('i');s[m.typed-1].className='on';zapTo(m);sfx.ok(G.hits%20);
  if(m.typed>=m.txt.length){G.score+=10*m.txt.length+Math.round(G.speed*5);G.zapped++;G.speed=Math.min(3,G.speed+.07);removeMet(m,'boom');if(G.zapped%5===0)gsay(rand(PRAISE))}else mHint();gUpdate()}
 else{G.errs++;sfx.bad();gsay(G.next?`That was ${esc(disp(ch))}. ${fingerSay(G.next)}`:'Wait for a meteor!',true)}
}
function endMeteor(){
 G.done=true;setTarget(null);const acc=G.hits+G.errs?Math.round(G.hits/(G.hits+G.errs)*100):100,best=G.score>S.arc.meteor;if(best)S.arc.meteor=G.score;
 const gems=Math.floor(G.zapped/6)+(G.shields===3?1:0);S.gems+=gems;S.xp+=G.hits;const egg=G.zapped?dailyEgg():null;save();sfx.win();
 modal(`<h2>${G.shields>0?'You win!':'Nice try!'}</h2><div class="hero-mini">${zookSVG()}</div>${best?'<div class="banner gold">New best score!</div>':''}${eggBanner(egg)}
 <div class="rstats"><div><b>${G.score}</b><span>Score</span></div><div><b>${G.zapped}/${G.total}</b><span>Meteors zapped</span></div><div><b>${acc}%</b><span>Accuracy</span></div><div><b>+${gems}</b><span>Diamonds</span></div></div>
 <div class="rbtns"><button class="btn" data-act="meteor">Play again</button><button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`);
}
function avgWpm(){const h=S.hist.slice(-8);return h.length?Math.min(60,Math.max(3,h.reduce((a,b)=>a+b.w,0)/h.length)):5}
function startRace(){
 const i=arcadeLesson(),ls=learned(i),letters=[...ls].filter(c=>/[a-z]/.test(c)),ok=WORDS.filter(w=>[...w].every(c=>ls.has(c))),len=Math.round(45*S.set.len);
 const text=i>=16?fillSent(i>=19?MSENT:SENT,len):ok.length>=6?fillWords(ok,len):groups(()=>rand(letters),len,2,3);
 const met=Object.keys(S.cards).sort(()=>Math.random()-.5),avg=avgWpm();
 mountGame('Keylori Race','Type to run!','Speed (WPM)','Place');
 G={type:'race',text,pos:0,mist:new Set(),start:0,done:false,order:0,next:null,racers:[.72,.92,1.08].map((f,k)=>{const [a,b]=(met[k]||['0-1','1-1','2-1'][k]).split('-').map(Number);return{a,b,w:avg*f*(.95+Math.random()*.1),p:0,fin:0}})};
 $('#gsw').hidden=false;$('#garena').className='garena race-arena';
 $('#garena').innerHTML=`<div class="finish"></div>`+[null,...G.racers].map((r,k)=>`<div class="lane"><div class="runner" id="rn${k}">${k?creatureSVG(r.a,r.b):zookSVG()}</div></div>`).join('');
 $('#gstripIn').innerHTML=[...text].map(c=>`<span class="${c===' '?'sp':''}">${c===' '?'·':esc(c)}</span>`).join('');
 raceStrip();G.raf=requestAnimationFrame(rTick);
}
function raceStrip(){const box=$('#gstripIn'),sp=box.children,t=G.text[G.pos];
 for(let k=Math.max(0,G.pos-2);k<Math.min(sp.length,G.pos+2);k++){sp[k].classList.remove('cur');if(k<G.pos)sp[k].classList.add(G.mist.has(k)?'fix':'ok')}
 if(t!=null){const el=sp[G.pos];el.classList.add('cur');el.style.setProperty('--fc',fcol(keyInfo(t).f));box.style.transform=`translateX(${$('#gstrip').clientWidth/2-(el.offsetLeft+el.offsetWidth/2)}px)`;setTarget(t);G.next=t;$('#ghint').innerHTML=fingerHTML(t)}}
function raceInput(ch,caps){
 const t=G.text[G.pos];if(!G.start)G.start=performance.now();
 if(matchKey(ch,t,caps)){G.pos++;if(typeof ghostProgress==='function')ghostProgress(G.pos);sfx.ok(G.pos%20);$('#rn0').style.left=(G.pos/G.text.length*84)+'%';if(G.pos>=G.text.length)return endRace();raceStrip()}
 else{G.mist.add(G.pos);sfx.bad();const r=$('#rn0');r.classList.remove('trip');void r.offsetWidth;r.classList.add('trip');$('#ghint').innerHTML=`Oops, that was ${esc(disp(ch))}. ${fingerHTML(t)}`}
}
const ORD=['1st','2nd','3rd','4th'];
function rTick(now){if(G.done)return;
 if(G.start){const el=(now-G.start)/1000,me=G.pos/G.text.length;G.racers.forEach((r,k)=>{r.p=Math.min(1,el*r.w*5/60/G.text.length);if(r.p>=1&&!r.fin)r.fin=++G.order;$('#rn'+(k+1)).style.left=(r.p*84)+'%'});
  $('#g-a').textContent=G.pos?Math.round(G.pos/5/Math.max(el/60,1/60)):0;$('#g-b').textContent=ORD[G.racers.filter(r=>r.fin||r.p>me).length]}
 G.raf=requestAnimationFrame(rTick)}
function endRace(){
 G.done=true;setTarget(null);const secs=(performance.now()-G.start)/1000,len=G.text.length,wpm=Math.round(len/5/Math.max(secs/60,1/60)),acc=Math.round((len-G.mist.size)/len*100),pl=1+G.racers.filter(r=>r.fin).length;
 const gems=[3,2,1,0][pl-1];S.gems+=gems;S.xp+=len;if(pl===1)S.arc.race++;S.hist.push({t:Date.now(),w:wpm,a:acc});if(S.hist.length>80)S.hist.shift();S.time+=Math.round(secs);sessionSecs+=secs;const egg=dailyEgg();save();sfx.win();
 setTimeout(()=>modal(`<h2>${pl===1?'You won the race!':ORD[pl-1]+' place!'}</h2><div class="hero-mini">${zookSVG()}</div>${eggBanner(egg)}
 <div class="rstats"><div><b>${ORD[pl-1]}</b><span>Place</span></div><div><b>${wpm}</b><span>Words per minute</span></div><div><b>${acc}%</b><span>Accuracy</span></div><div><b>+${gems}</b><span>Diamonds</span></div></div>
 <p class="note" style="margin:0">Race again to beat them!</p>
 <div class="rbtns"><button class="btn" data-act="race">Race again</button><button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`),600);
}
/* ---- grown-ups report ---- */
function renderParents(){
 const h=S.hist.slice(-30),last=S.hist.slice(-10),avg=(a,f)=>a.length?Math.round(a.reduce((s,x)=>s+f(x),0)/a.length):0;
 const stars=Object.values(S.best).reduce((a,b)=>a+b,0),done=Object.values(S.best).filter(b=>b>=1).length;
 const W=560,H=170,hi=Math.max(15,...h.map(x=>x.w)),step=[5,10,20,25,50,100].find(v=>hi/v<=6)||200,max=Math.ceil(hi/step)*step,X=k=>40+k*(W-56)/Math.max(1,h.length-1),Y=v=>H-26-v/max*(H-44);
 let chart=`<rect x="40" y="${Y(10)}" width="${W-56}" height="${Y(4)-Y(10)}" fill="#4de08a" opacity=".12"/><text x="${W-18}" y="${Y(10)-4}" text-anchor="end" class="ct">grade 1–2 range</text>`;
 for(let v=0;v<=max;v+=step)chart+=`<line x1="40" x2="${W-16}" y1="${Y(v)}" y2="${Y(v)}" stroke="#34408c" stroke-width="1"/><text x="32" y="${Y(v)+4}" text-anchor="end" class="ct">${v}</text>`;
 if(h.length>1)chart+=`<path d="${h.map((p,k)=>(k?'L':'M')+X(k).toFixed(1)+' '+Y(p.w).toFixed(1)).join('')}" fill="none" stroke="#3ee6ff" stroke-width="3" stroke-linejoin="round"/>`;
 h.forEach((p,k)=>chart+=`<circle cx="${X(k)}" cy="${Y(p.w)}" r="${k===h.length-1?5:3}" fill="#3ee6ff"/>`);
 chart+=`<text x="${W/2}" y="${H-4}" text-anchor="middle" class="ct">last ${h.length} rounds</text>`;
 const heat=['1234567890','qwertyuiop','asdfghjkl;','zxcvbnm,.'].map((r,ri)=>`<div class="hrow" style="padding-left:${ri*14}px">${[...r].map(c=>{const k=S.ks[c],n=k?k.h+k.m:0,a=n?k.h/n:0,col=n<5?'#2a3270':a>=.95?'#4de08a':a>=.85?'#ffd84d':'#ff6b7a';return `<div class="hk" style="background:${col};color:${n<5?'#a3acdf':'#0b1033'}"><b>${c.toUpperCase()}</b><span>${n<5?'–':Math.round(a*100)+'%'}</span></div>`}).join('')}</div>`).join('');
 const weak=Object.entries(S.ks).filter(([c,k])=>k.h+k.m>=8).map(([c,k])=>[c,k.h/(k.h+k.m)]).sort((a,b)=>a[1]-b[1]).slice(0,5).filter(x=>x[1]<.9);
 $('#s-parents').innerHTML=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Progress Report</h2><button class="btn sm alt" data-act="grownups">Teachers</button></div>
 <div class="ptiles">${[[Math.round(S.time/60)+' min','Time typing'],[S.rounds,'Rounds played'],[done+'/'+(LESSONS.length*8),'Levels passed'],[avg(last,x=>x.a)+'%','Accuracy (last 10)'],[avg(last,x=>x.w),'WPM (last 10)'],[stars,'Stars earned']].map(([v,l])=>`<div class="panel"><b>${v}</b><span>${l}</span></div>`).join('')}</div>
 <div class="pgrid"><div class="panel pbox"><h3>Typing speed</h3><div class="chartwrap"><svg viewBox="0 0 ${W} ${H}" class="chart">${h.length?chart:`<text x="${W/2}" y="${H/2}" text-anchor="middle" class="ct">Play a few rounds to see speed here</text>`}</svg></div></div>
 <div class="panel pbox"><h3>Accuracy by key</h3><div class="heat">${heat}</div><p class="note">Green is 95% or better, yellow 85 to 94%, red below 85%. Grey keys need more practice data.</p>
 ${weak.length?`<p style="margin:0">Keys to practice: ${weak.map(([c,a])=>`<span class="chip2">${c.toUpperCase()} ${Math.round(a*100)}%</span>`).join(' ')}</p>`:''}</div></div>
 <div class="panel pbox"><h3>Helping at home</h3><ul class="plist"><li><b>Short and often.</b> About 10 to 15 minutes a day works better than long sessions. Pop suggests a stretch break after 10 minutes.</li>
 <li><b>Accuracy before speed.</b> Stars come from accuracy, not speed. Aim for 85% or better before worrying about WPM.</li>
 <li><b>Typical speeds</b> (<a href="https://www.typesy.com/reasonable-typing-speed-benchmarks-k-12/" target="_blank" rel="noopener">Typesy benchmarks</a>): grade 1 about 4 to 5 WPM, grade 2 about 8 to 10, grade 3 about 12 to 15.</li>
 <li><b>Eyes up.</b> Once letters feel easy, set the on-screen keyboard to "Hide learned" in Settings so your child looks at the screen, not the keys.</li>
 <li><b>Hints out loud.</b> The speech button in each game reads the current hint for early readers.</li></ul></div>`;
}

/* ================= V3: villains, scenes, lasers, Scrambler Attack ================= */
const GV=['#9f7bd8','#9dff3d','#ff8a1f','#3ee6ff','#ffe23d'];
const GLPTS=(()=>{let p=[];for(let k=0;k<16;k++){const a=Math.PI*2*k/16-Math.PI/2,r=k%2?50:63;p.push((100+Math.cos(a)*r*1.05).toFixed(1)+','+(114+Math.sin(a)*r*.92).toFixed(1))}return p.join(' ')})();
function glitchSVG(v=0,king=false){
 const c=GV[v%GV.length],id='glb',gs=`stroke="${c}" stroke-width="3" stroke-linejoin="round"`;
 return `<svg class="gl" viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="${id}" cx="38%" cy="28%" r="85%"><stop offset="0" stop-color="#7a4bb8"/><stop offset=".5" stop-color="#2c1256"/><stop offset="1" stop-color="#0d0420"/></radialGradient><filter id="glw" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>${SOFT}</defs>
<ellipse cx="100" cy="186" rx="52" ry="8" fill="#000" opacity=".45" filter="url(#sft)"/>
<polygon points="${GLPTS}" fill="${c}" opacity=".6" filter="url(#glw)"/>
<path d="M66 70 L54 34 L82 60Z M134 70 L146 34 L118 60Z" fill="${c}" stroke="#0d0420" stroke-width="3" stroke-linejoin="round"/>
<polygon points="${GLPTS}" fill="url(#${id})" ${gs}/>
<ellipse cx="80" cy="84" rx="16" ry="8" transform="rotate(-25 80 84)" fill="#fff" opacity=".22"/>
<g class="px" fill="${c}"><rect x="26" y="62" width="9" height="9"/><rect x="166" y="84" width="7" height="7"/><rect x="34" y="150" width="7" height="7"/><rect x="158" y="146" width="10" height="10"/></g>
<ellipse cx="80" cy="106" rx="15" ry="14" fill="#fff"/><ellipse cx="120" cy="106" rx="15" ry="14" fill="#fff"/>
<circle cx="83" cy="109" r="8" fill="${c}"/><circle cx="117" cy="109" r="8" fill="${c}"/><circle cx="84" cy="110" r="4" fill="#0d0420"/><circle cx="116" cy="110" r="4" fill="#0d0420"/><circle cx="86" cy="106" r="2" fill="#fff"/><circle cx="118" cy="106" r="2" fill="#fff"/>
<path d="M62 90 L98 101 L98 88 L62 86Z M138 90 L102 101 L102 88 L138 86Z" fill="#0d0420"/>
<path d="M70 130 Q100 156 130 130 Q100 142 70 130Z" fill="#0d0420" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>
<polygon points="74,132 80,140 86,135 92,143 98,136 104,143 110,136 116,141 122,134 126,132" fill="#fff"/>
${king?`<path d="M64 60 L60 22 L80 42 L100 14 L120 42 L140 22 L136 60Z" fill="url(#zg)" stroke="#0d0420" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="44" r="7" fill="${c}" stroke="#0d0420" stroke-width="2"/><defs>${grad('zg','#ffc93c',.55)}</defs>`:''}</svg>`;
}
function sceneSVG(c){
 const k=c.slice(1),far=shade(c,-.62),mid=shade(c,-.42),near=shade(c,-.2);
 let stars='';for(let n=0;n<26;n++)stars+=`<circle cx="${(n*389)%1000}" cy="${(n*137)%170}" r="${n%3?1.2:2}" fill="#fff" opacity="${.35+(n%4)*.15}"/>`;
 return `<svg class="scene" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>
<linearGradient id="sk${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c,-.85)}"/><stop offset="1" stop-color="${shade(c,-.5)}"/></linearGradient>
<linearGradient id="gd${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${near}"/><stop offset="1" stop-color="${shade(c,-.7)}"/></linearGradient>
<radialGradient id="mn${k}"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".22" stop-color="${shade(c,.5)}" stop-opacity=".6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<linearGradient id="fg${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}" stop-opacity=".25"/></linearGradient></defs>
<rect width="1000" height="400" fill="url(#sk${k})"/>${stars}<circle cx="780" cy="90" r="130" fill="url(#mn${k})"/>
<path d="M0 250 L90 165 L170 225 L280 130 L380 215 L470 150 L560 225 L660 140 L760 215 L860 160 L1000 235 V400 H0Z" fill="${far}"/>
<path d="M280 130 L300 150 L285 148 L270 160Z M660 140 L680 162 L662 158 L648 170Z" fill="#fff" opacity=".35"/>
<rect y="190" width="1000" height="90" fill="url(#fg${k})"/>
<path d="M0 292 Q120 238 240 282 T480 272 T720 287 T1000 266 V400 H0Z" fill="${mid}"/>
<path d="M0 322 Q250 296 500 318 T1000 310 V400 H0Z" fill="url(#gd${k})"/>
<path d="M0 322 Q250 296 500 318 T1000 310" fill="none" stroke="${shade(c,.3)}" stroke-width="3" opacity=".5"/>
<g fill="${shade(c,-.5)}"><ellipse cx="90" cy="372" rx="70" ry="16"/><ellipse cx="930" cy="366" rx="80" ry="18"/></g></svg>`;
}
const scn=()=>sceneSVG(REGIONS[LESSONS[P.i].r].color);
function laser(a,from,to,color,big,fx=.5,fy=.42){
 if(!a||!from||!to)return;const ar=a.getBoundingClientRect(),f=from.getBoundingClientRect(),t=to.getBoundingClientRect();
 const x1=f.left-ar.left+f.width*fx,y1=f.top-ar.top+f.height*fy,x2=t.left-ar.left+t.width*(.38+Math.random()*.24),y2=t.top-ar.top+t.height*(.4+Math.random()*.2);
 const b=document.createElement('div');b.className='laser'+(big?' big':'');b.style.cssText=`left:${x1}px;top:${y1}px;width:${Math.hypot(x2-x1,y2-y1)}px;transform:rotate(${Math.atan2(y2-y1,x2-x1)}rad);--fc:${color}`;
 const p=document.createElement('div');p.className='impact'+(big?' big':'');p.style.cssText=`left:${x2}px;top:${y2}px;--fc:${color}`;
 a.append(b,p);setTimeout(()=>{b.remove();p.remove()},big?420:280);
}
function burst(a,el,color,n=12){if(!a||!el)return;const ar=a.getBoundingClientRect(),r=el.getBoundingClientRect(),x=r.left-ar.left+r.width/2,y=r.top-ar.top+r.height/2;
 for(let k=0;k<n;k++){const d=document.createElement('div');d.className='shard';const ang=Math.random()*Math.PI*2,dist=50+Math.random()*90;d.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(ang)*dist}px;--dy:${Math.sin(ang)*dist}px;background:${k%3?color:'#fff'}`;a.appendChild(d);setTimeout(()=>d.remove(),700)}}
function kick(el,cls){if(!el)return;el.classList.remove(cls,'hit','laugh');void el.offsetWidth;el.classList.add(cls)}

/* ---- Scrambler Attack (Typing of the Dead style, for kids) ---- */
function pathScene(){
 let grid='',pil='';for(let d=.05;d<1;d+=.1){const y=200+300*d*d;grid+=`<line x1="0" x2="1000" y1="${y}" y2="${y}" stroke="#9f7bd8" stroke-opacity="${.1+d*.25}" stroke-width="${1+d*2}"/>`}
 [.12,.25,.42,.62,.85].forEach(d=>{const y=200+300*d,sc=.2+d*1.1;[-1,1].forEach(sd=>{const x=500+sd*(40+470*d);pil+=`<g transform="translate(${x} ${y}) scale(${sc})"><polygon points="-18,0 -24,-90 0,-150 24,-90 18,0" fill="url(#cry)" stroke="#3ee6ff" stroke-width="3" stroke-linejoin="round"/><polygon points="-6,-20 -10,-90 0,-130 4,-90" fill="#fff" opacity=".35"/></g>`})});
 let st='';for(let n=0;n<40;n++)st+=`<circle cx="${(n*263)%1000}" cy="${(n*97)%180}" r="${n%3?1.2:2.2}" fill="#fff" opacity=".7"/>`;
 return `<svg class="scene" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><defs>
<linearGradient id="gsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07041c"/><stop offset=".7" stop-color="#2d1466"/><stop offset="1" stop-color="#e0707a"/></linearGradient>
<linearGradient id="ggd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241060"/><stop offset="1" stop-color="#070420"/></linearGradient>
<linearGradient id="grd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a8a"/><stop offset="1" stop-color="#1a1250"/></linearGradient>
<linearGradient id="cry" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ff4ff"/><stop offset="1" stop-color="#2a5bd6"/></linearGradient></defs>
<rect width="1000" height="200" fill="url(#gsk)"/>${st}
<g fill="#12082e"><rect x="430" y="140" width="30" height="60"/><rect x="455" y="110" width="40" height="90"/><rect x="495" y="96" width="24" height="104"/><rect x="519" y="124" width="46" height="76"/><polygon points="495,96 507,70 519,96"/></g>
<g fill="#9f7bd8"><rect x="462" y="130" width="6" height="6"/><rect x="500" y="118" width="6" height="6"/><rect x="530" y="150" width="6" height="6"/></g>
<rect y="200" width="1000" height="300" fill="url(#ggd)"/>${grid}
<polygon points="470,200 530,200 930,500 70,500" fill="url(#grd)"/>
<line x1="470" y1="200" x2="70" y2="500" stroke="#3ee6ff" stroke-width="4" opacity=".7"/><line x1="530" y1="200" x2="930" y2="500" stroke="#3ee6ff" stroke-width="4" opacity=".7"/>
<line class="dash" x1="500" y1="200" x2="500" y2="500" stroke="#fff" stroke-width="8" stroke-dasharray="26 30" opacity=".5"/>${pil}</svg>`;
}
function startGlitch(){
 const i=arcadeLesson(),ls=learned(i),letters=[...ls].filter(c=>/[a-z]/.test(c)),ok=WORDS.filter(w=>w.length<=7&&[...w].every(c=>ls.has(c)));
 mountGame('Scrambler Attack','Type the words!','Score','Hearts');
 const mult=S.set.len,met=Object.keys(S.cards);
 G={type:'glitch',i,letters,ok,ents:[],hearts:5,score:0,combo:0,maxCombo:0,hits:0,errs:0,wave:0,waves:3,waveWordsTyped:0,waveWordsTotal:0,queue:[],spawnT:2.5,speed:Math.min(1.5,Math.max(.62,avgWpm()/8)),tgt:null,done:false,next:null,rescued:0,kills:0,boss:null,phase:'wave',met};
 $('#gsw').hidden=true;$('#garena').className='garena glitch-arena';
 $('#garena').innerHTML=`${pathScene()}<div class="gz gz-l" id="gzk">${zookSVG()}</div><div class="gcombo" id="gcombo"></div><div class="gmsg" id="gmsg"></div><div class="gflash" id="gflash"></div>`;
 gUp();nextWave();G.last=performance.now();G.raf=requestAnimationFrame(gTick);
}
function gw(size){if(G.ok.length>=8){const f=G.ok.filter(w=>size==='s'?w.length<=3:size==='m'?w.length>=3&&w.length<=5:w.length>=5);return rand(f.length?f:G.ok)}
 return groups(()=>rand(G.letters),1,size==='s'?1:size==='m'?2:3,size==='s'?2:size==='m'?3:4)}
function gmsg(t,cls=''){const m=$('#gmsg');if(!m)return;m.className='gmsg '+cls;m.innerHTML=t;kick(m,'show')}
function nextWave(){G.wave++;const n=Math.round([5,6,7][G.wave-1]*S.set.len);const sz=[['s','s','m'],['s','m','m'],['m','m','l']][G.wave-1];
 G.queue=G.waveDecks?.[G.wave-1]?.map(sp=>({...sp}))||Array.from({length:n},()=>({kind:'bad',size:rand(sz)}));if(!G.waveDecks?.[G.wave-1])G.queue.splice(Math.floor(n/2),0,{kind:'friend',size:'m'});G.waveWordsTyped=0;G.waveWordsTotal=G.queue.length;G.spawnT=2.6;gmsg(`Wave ${G.wave}`,'big');sfx.lvl()}
function spawnEnt(sp){
 const A=$('#garena'),e={kind:sp.kind,txt:sp.txt||gw(sp.size),typed:0,z:sp.kind==='friend'?.42+Math.random()*.15:0,lane:(Math.random()*1.6-.8),v:{s:1/12,m:1/15,l:1/18}[sp.size],dead:false};
 if(e.kind==='friend'){e.dir=Math.random()<.5?1:-1;e.lane=-1.25*e.dir;const [a,b]=(G.met.length?rand(G.met):rand(['0-0','1-0','2-0','4-0'])).split('-').map(Number);e.name=SPECIES[a].n[b];e.art=creatureSVG(a,b)}
 e.sp=document.createElement('div');e.sp.className='ent '+e.kind;e.sp.innerHTML=e.kind==='bad'?villainArc(Math.floor(Math.random()*5),false):e.art;
 e.lb=document.createElement('div');e.lb.className='elab '+e.kind;
 A.append(e.sp,e.lb);paintLab(e);G.ents.push(e);return e;
}
function paintLab(e){e.lb.innerHTML=(e.kind==='friend'?'<em>Save me!</em>':'')+`<span class="w">${[...e.txt].map((c,k)=>`<i class="${k<e.typed?'on':k===e.typed&&e===G.tgt?'nx':''}">${c===' '?'·':esc(c)}</i>`).join('')}</span>`+(e.boss?`<div class="cbar"><i id="bossbar"></i></div><div class="bhp">${'♦'.repeat(e.hp)}</div>`:'');e.sp.classList.toggle('locked',e===G.tgt)}
function placeEnt(e,W,H){const hz=.4*H,y=hz+(H*.97-hz)*e.z,sc=(.26+.95*e.z)*(e.big||1),x=W/2+e.lane*W*(.06+.4*e.z);
 e.sp.style.transform=`translate(${x}px,${y}px) scale(${sc}) translate(-50%,-100%)`;e.sp.style.zIndex=10+Math.round(e.z*100);
 const top=Math.max(y-150*sc-4,34);e.lb.style.transform=e.boss?`translate(${x}px,${y+8}px) translate(-50%,0)`:`translate(${x}px,${top}px) translate(-50%,-100%)`;e.lb.style.fontSize=(e.boss?22:16+12*e.z)+'px';e.lb.style.zIndex=e===G.tgt?300:200}
function removeEnt(e){e.dead=true;G.ents=G.ents.filter(x=>x!==e);if(G.tgt===e)G.tgt=null;e.lb.remove();setTimeout(()=>e.sp.remove(),500)}
function gTick(now){
 if(G.done||G.type!=='glitch')return;const dt=Math.min(.05,(now-G.last)/1000);G.last=now;const A=$('#garena'),W=A.clientWidth,H=A.clientHeight;
 if(G.phase==='wave'){G.spawnT-=dt;const bads=G.ents.filter(e=>e.kind==='bad').length;
  if(G.spawnT<=0&&G.queue.length&&bads<1+G.wave){const next=G.queue[0];next.txt=next.txt||gw(next.size);if(!G.ents.some(e=>!e.dead&&e.txt[0]===next.txt[0])){spawnEnt(G.queue.shift());G.spawnT=2.6/G.speed;gHint()}}
  if(!G.queue.length&&!G.ents.length){G.wave<G.waves?nextWave():startBoss()}}
 for(const e of [...G.ents]){if(e.boss)continue;if(e.kind==='bad'){e.z+=e.v*G.speed*dt;if(e.z>=1){gAttack(e);continue}}else{e.lane+=e.dir*dt*.2;if(Math.abs(e.lane)>1.3){removeEnt(e);gHint();continue}}placeEnt(e,W,H)}
 const b=G.boss;if(b&&!b.dead){b.t+=dt;const bb=$('#bossbar');if(bb)bb.style.width=Math.min(100,b.t/b.lim*100)+'%';if(b.t>=b.lim)bossAttack();placeEnt(b,W,H)}
 if(G.hearts<=0)return endGlitch(false);
 G.raf=requestAnimationFrame(gTick);
}
function gAttack(e){G.hearts--;G.combo=0;G.speed=Math.max(.55,G.speed*.9);kick(e.sp,'bonk');removeEnt(e);kick($('#gflash'),'on');kick($('#garena'),'quake');sfx.bad();tone(110,.3,'sawtooth',.08);gmsg('Bonk!','bad');gUp();gHint()}
function startBoss(){G.phase='boss';const king=G.i>=15;const e=spawnEnt({kind:'bad',size:'l'});e.boss=true;e.big=1.7;e.z=.42;e.lane=0;e.hp=3;e.sp.innerHTML=villainArc(0,true);e.sp.classList.add('bossent');G.boss=e;G.tgt=e;bossPhrase();gmsg(king?'Boss!':'Boss!','big boss');tone(90,.6,'sawtooth',.1)}
function bossPhrase(){const b=G.boss;b.txt=G.i>=16?rand(SENT.filter(s=>s.length<=22)):G.ok.length>=8?fillWords(G.ok,11):groups(()=>rand(G.letters),7,2,3);b.typed=0;b.t=0;b.lim=b.txt.length*1.5/G.speed+4;paintLab(b);gHint()}
function bossAttack(){G.hearts--;kick($('#gflash'),'on');kick($('#garena'),'quake');kick(G.boss.sp,'stomp');sfx.bad();tone(80,.4,'sawtooth',.1);gmsg('Ouch!','bad');gUp();bossPhrase()}
function gHint(){let t=null;const e=G.tgt;if(e&&!e.dead)t=e.txt[e.typed];else{const c=G.ents.filter(x=>x.kind==='bad'&&!x.dead);if(c.length)t=c.reduce((a,b)=>a.z>b.z?a:b).txt[0];else if(G.ents.length)t=G.ents[0].txt[0]}G.next=t;setTarget(t);$('#ghint').innerHTML=t?fingerHTML(t):''}
function gUp(){$('#g-a').textContent=G.score;$('#g-b').textContent=G.hearts>0?'♥'.repeat(G.hearts):'0';const c=$('#gcombo');if(c){c.textContent=G.combo>=3?`${G.combo} combo${G.combo>=10?' ×'+(1+Math.floor(G.combo/10)):''}`:'';c.classList.toggle('hot',G.combo>=10)}}
function glitchInput(ch,caps){
 let e=G.tgt&&!G.tgt.dead?G.tgt:null;
 if(!e){const c=G.ents.filter(x=>!x.dead&&matchKey(ch,x.txt[0],caps));if(c.length)e=c.reduce((a,b)=>(a.kind==='friend'?.5:a.z)>(b.kind==='friend'?.5:b.z)?a:b)}
 if(e&&matchKey(ch,e.txt[e.typed],caps)){
  const prev=G.tgt;G.tgt=e;if(prev&&prev!==e&&!prev.dead)paintLab(prev);
  e.typed++;G.hits++;G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);
  const big=G.combo%10===0;laser($('#garena'),$('#gzk'),e.sp,fcol(keyInfo(e.txt[e.typed-1]).f),big);kick(e.sp,'hit');big?sfx.super():sfx.ok(G.combo);
  if(e.kind==='bad'&&!e.boss)e.z=Math.max(0,e.z-.012);
  paintLab(e);
  if(e.typed>=e.txt.length){
   if(!e.boss)G.waveWordsTyped=Math.min(G.waveWordsTotal,G.waveWordsTyped+1);
   if(e.boss){e.hp--;G.score+=100;burst($('#garena'),e.sp,GV[0],18);kick($('#garena'),'quake');sfx.win();if(e.hp<=0){e.dead=true;e.sp.classList.remove('locked');e.sp.classList.add('pop');setTimeout(()=>e.sp.remove(),500);burst($('#garena'),e.sp,'#ffc93c',30);e.lb.remove();G.score+=300;setTimeout(()=>endGlitch(true),900);gUp();setTarget(null);return}gmsg('Hit!');bossPhrase()}
   else if(e.kind==='bad'){G.kills++;G.score+=e.txt.length*10*(1+Math.floor(G.combo/10));e.sp.classList.add('pop');burst($('#garena'),e.sp,GV[Math.floor(Math.random()*5)]);removeEnt(e)}
   else{G.rescued++;G.score+=50;G.hearts=Math.min(5,G.hearts+1);e.sp.classList.add('saved');gmsg(`Saved! +1 ♥`,'good');sfx.win();removeEnt(e)}
  }
 }else{G.errs++;G.combo=0;sfx.bad();const t=G.next;$('#ghint').innerHTML=`<span class="caps-warn">Miss!</span> ${t?fingerHTML(t):''}`;gUp();return}
 gUp();gHint();
}
function endGlitch(win){
 G.done=true;setTarget(null);const acc=G.hits+G.errs?Math.round(G.hits/(G.hits+G.errs)*100):100;
 const grade=win&&acc>=95&&G.hearts>=4?'S':acc>=90&&win?'A':acc>=80?'B':'C';
 const best=G.score>S.arc.glitch;if(best)S.arc.glitch=G.score;if(win)S.arc.gwin++;
 const gems=Math.floor(G.kills/3)+G.rescued+(win?3:0)+({S:3,A:2,B:1,C:0}[grade]);S.gems+=gems;S.xp+=G.hits;const egg=G.hits>10?dailyEgg():null;save();
 modal(`<h2>${win?'You win!':'Try again!'}</h2><div class="grade g${grade}">${grade}</div>${best?'<div class="banner gold">New best score!</div>':''}${eggBanner(egg)}
 <div class="rstats"><div><b>${G.score}</b><span>Score</span></div><div><b>${acc}%</b><span>Accuracy</span></div><div><b>${G.maxCombo}</b><span>Best combo</span></div><div><b>+${gems}</b><span>Diamonds</span></div></div>
 <p class="muted" style="margin:0">Zapped: ${G.kills} · Saved: ${G.rescued}</p>
 <div class="rbtns"><button class="btn" data-act="glitch">Play again</button><button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`);
}

/* ================= V4: pixel art ================= */
const PXC={};
const pxu=(key,mk,sc=4)=>PXC[key]||(PXC[key]=mk().url(sc));
const pximg=(cls,url,extra='')=>`<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true" ${extra}><image href="${url}" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMax meet"/></svg>`;
function creatureSVG(i,form,cls=''){return pximg('cr '+cls,pxu('s'+i+'-'+form,()=>PX.SPR.species(i,form)))}
function zookSVG(eq){eq=eq||S.equip;const k='z'+JSON.stringify(eq);return pximg('zk',pxu(k,()=>PX.SPR.zook(eq)))}
function glitchSVG(v=0,king=false){const c=GV[v%GV.length];return pximg('gl',pxu('g'+c+king,()=>PX.SPR.glitch(c,king)))}
function keystoneSVG(){return pximg('ks',pxu('ks',()=>PX.SPR.keystone()))}
const SCN={};
function sceneSVG(c){const kind=['meadow','cave','volcano','sky','star'][REGIONS.findIndex(r=>r.color===c)]||'meadow';const u=SCN[kind]||(SCN[kind]=PX.pixelScene(kind).toDataURL());
 return `<svg class="scene" viewBox="0 0 200 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${u}" width="200" height="72"/></svg>`}
function pathScene(){const u=SCN.road||(SCN.road=PX.roadScene().toDataURL());return `<svg class="scene" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true"><image href="${u}" width="160" height="100" preserveAspectRatio="none"/></svg>`}
/* Keystone catch */
function catchAnim(done){
 const a=$('#arena'),h=$('#hero'),f=$('#foe');if(!a||!h||!f)return done();
 const ar=a.getBoundingClientRect(),hr=h.getBoundingClientRect(),fr=f.getBoundingClientRect();
 const k=document.createElement('div');k.className='kstone';k.innerHTML=keystoneSVG();
 const x1=hr.left-ar.left+hr.width*.6,y1=hr.top-ar.top+hr.height*.3,x2=fr.left-ar.left+fr.width/2,y2=fr.top-ar.top+fr.height*.75;
 k.style.cssText=`left:${x1}px;top:${y1}px`;a.appendChild(k);say('Go, Capture Stone!');tone(520,.15,'square',.06);
 requestAnimationFrame(()=>{k.style.transition='left .5s linear, top .5s cubic-bezier(.2,-0.8,.6,1)';k.style.left=x2+'px';k.style.top=y2+'px'});
 setTimeout(()=>{f.classList.add('caught');burst(a,f,'#3ee6ff',10);tone(880,.1,'square',.06)},520);
 setTimeout(()=>{k.classList.add('wob')},900);
 [1100,1500,1900].forEach((t,i)=>setTimeout(()=>tone(300+i*80,.08,'square',.06),t));
 setTimeout(()=>{k.classList.remove('wob');k.classList.add('click');burst(a,k,'#ffd23a',14);sfx.win();say('Caught!')},2300);
 setTimeout(done,3100);
}

const KKDATA={"order": ["sproutle", "drizzit", "zipp", "pebbo", "embit", "glintle", "duskit", "breezle", "frostby", "twinkit", "beetix", "wispy", "cogby", "dunelet", "fizzlet", "rumblet", "bubbly", "magmite", "glowbit", "qwertle"], "spr": {"sproutle": ["........................", "........................", "..qq................qq..", ".qGGq..............qGgq.", "..qgGq.oooooooooo.qGgq..", "qGGgqoLLHHLLLLBBBDoqgGGq", ".qqqoLHHLLLLLLBBBBDDoqq.", "qGgqoLHLLLLLLBBBBBDXoqGq", ".qqOLLkkkLLLLBBkkkBDXoq.", "qGqOLLwkkLLLLBBwkkBDXoGq", ".qqOLLkekLLLLBBkekBDXoq.", "..oOrrLLLLmmmmLBBrrDXo..", "..oOLLLLLLmnnmBBBBBDXo..", "...oDBBBBBBBBBBBBBDXo...", "....ooDDDDDDDDDDDDoo....", "....oLoBccccccsBoBo.....", "...oLLoBcccccccsBoBBo...", "....ooBBccccccsBBoo.oo..", ".....oBBBccccsBBBoooBDo.", ".....oDBBBBBBBBBDDBBBDo.", ".....oDDBBooBBDDooofffo.", "....oBBBo..oBBBo..fyf...", "....oooo....oooo...f....", "........................"], "drizzit": ["...........oo...........", "...........oho..........", "..b.......ohjo..........", ".bwb......ojho......b...", "..b......ohjho.....bwb..", ".........ojhjo......b...", ".......oooohjoooo.......", ".....ooLHHHLLLLBBBBoo...", "....oOLHHLLLLLLBBBBDXo..", "...oOLHLLLLLLLLBBBBBDXo.", "...oOLLkkkLLLLBBkkkBDXo.", "...oOLLwkkLLLLBBwkkBDXo.", "...oOLLkekLLLLBBkekBDXo.", "...oOrrLLLLmnnmBBBrrDXo.", "..ooOBBBcccccccBBBBDXoo.", ".oLLoBBccccccccsBBDXoLLo", "oLLHoBcccccccccsBBDXoBDo", "oooooBcccccccccsBDXooooo", "....oBBccccccccsBDXo....", "....oDBBcccccsBBDXXo.oo.", ".....oDDBBBBBBDDXXooBBo.", "......ooDDDDDDDDXooBDDo.", "........oooooooooo.ooo..", "........................"], "zipp": ["......y....y............", ".....yg...yg....y.......", "....oyYo.oyYo..yg.......", ".....oyYooyYo.oYo.......", "......oyYyYYooYo........", ".....ooOLHHLLBBBBoo.....", "....oOLHHLLLLLBBBBDXo...", "...oOLHLLLLLLLBBBBBDXo..", "...oOLLkkkLLLBBkkkBBDXo.", "...oOLLwkkLLLBBwkkBBDXyy", "...oOLLkekLLLBBkekBByyyp", "...oOLLLLLLLBBBBBBBYYYYp", "...oOLyLLLLLBBBBBBBDXoo.", "..oOLyyLLccccccBBBBDXo..", "..oOLLyLcccccsBDDBBDXo..", "..oOLLLLcccccsBDXDBDXo..", "..oDBBBBccccsBBDDBBDXo..", "...oDDBBBBBBBBBBBDXXo...", "....ooDDDDDDDDDDXXoo....", ".......oa....oa.........", ".......oa....oa.........", ".......oa....oa.........", ".....oaaAo.oaaAo........", ".....ooooo.ooooo........"], "pebbo": ["........................", "..........I.............", ".........oKo..I.........", "........oKIJooKo........", "........oKIJoKJo........", ".......oQPKJJKJQo.......", ".....ooPRRPQRPRRQoo.....", "....oPRRQoPRRQoPRQQo....", "...oOLLooLLLooLLBBBoo...", "..oOLHHLLLLLLLLBBBBoooo.", ".ooOLHLLLLLLLLBBBBoLHHLo", "oPoOLLLLLLLLLBBBBBoLkkLo", "oRRoLLLLLLLBBBBBBBoLwkBo", "oQRRoLLLLBBBBBBBBDDoBmmo", ".oooOBBccccccccBBDXoBBDo", "....oDBccccccccsBDXXoDo.", "....oDDsssssssssDDXXoo..", "....oXDDDDDDDDDDDDXXo...", "....oBBo.oBBo.oBBo.oBBo.", "....oBDo.oBDo.oBDo.oBDo.", "....owwo.owwo.owwo.owwo.", "....oooo.oooo.oooo.oooo.", "........................", "........................"], "embit": ["..y..........y.....y....", "..Yy........yY..........", ".oYo........oYo.........", ".oHco......ocLo......y..", ".oHcco....occLo.........", ".oLHcLoooooLcBDo...oo...", "OLHHHLLLLLLBBBBDo.oyyo..", "OLHccLLLLLLBccBDo.oYYo..", "OLLkkkLLLLBkkkBDooLBBDo.", "OLLwkkLLLLBwkkBDooHAADo.", "OcckYkBBBBBkYkccooLBBDo.", "OcccDcccncccDccDooBBBDo.", "OLccDccmmmccDcBDooHAAADo", "OBcccccmpmccccBDooLBBBDo", "ODBBccccccccBBDDooBBBBDo", ".oDDBBBBBBBBDDDo.oAAAADo", "..oDBBnnnnnBBDo..oBBBDo.", ".obBBnbnnnbnBBbo.oBBDo..", ".obbBnnbnbnnBbbo.oDDo...", ".obbBBnnnnnBBbbo.oo.....", "..obbbbo.obbbbo.........", "..obbbbo.obbbbo.........", "..onwnwo.onwnwo.........", "..oooooo.oooooo........."], "glintle": ["........................", "........................", "........................", "........................", "........................", "........................", "................I.......", "......oIo..........I....", ".....oKIJo....okko.okko.", "....oKIIJJo...okwo.okwo.", "...oKIKJJJJo...oBo..oBo.", "..oKIKKJJKJJo...oBo.oBo.", ".oKIKKJJKKJJJo...oBooBo.", ".oKKKJJKKJJJJo..oBBBBBo.", ".oJKKJJKKJJJJXo.oLLBBDo.", ".oJJKJJJKJJJXXooLLBBBDo.", "..oJJJJJJJJXXoLLLmmBDDo.", "...ooXXXXXXXooLLLLBBBDo.", ".oooLLLLLLLLLLLLLBBBDDo.", "oOLHHLLLLLLLLLLBBBBBDXo.", "oOLLLLLLLLLBBBBBBBBDDXo.", ".oDDDBBBBBBBBBBBBDDDXo..", "..oooooooooooooooooooo..", "........................"], "duskit": ["........................", "........................", "........................", "...y................y...", "....oy............yo....", ".....oY..........Yo.....", "......oy........yo......", ".oooo..oooooooooo..oooo.", "oUUWWooLHHLLLBBBDooWWVVo", "oUyyWWoLHLLLLBBBBDoWyyVo", "oUyyWWOLkkkLLBkkkDXWyyVo", "oUWWWWOLwkkLLBwkkDXWWWVo", "oUWWWWOLkekLLBkekDXWWWVo", "oUWWWWoLLLLmmBBBBDoWWWVo", ".oUWWWWofffffffffoWWWVo.", "..oWWWWoBBBBBBBBDoWWVo..", "..oUyWWoLBBBBBBDXoWyVo..", "..oUWWWVoLBBBBBDXoVWVo..", "...oVVVo.oDBBBDXo.oVVo..", "....ooo..oDDDDXo...oo...", "..........oDXo..........", "...........oo...........", "........................", "........................"], "breezle": ["........................", "........................", "........................", "........................", "........oooooo..........", "......ooLHHLLBoo........", ".....oLHHLLLLBBBooo.....", "...ooLHLLLLLLBBBBDBBoo..", "..oLHLLoooooooooBBDDXo..", ".oLHLLoyJJFFFFFyoBBDDXo.", ".oLLLoYJkkFFFkkGYoBDDXo.", "oLHLLoJJwkFFFwkGGoBBDXXo", "oLLLLoJJFFFmmFFGGoBBDDXo", "oLLLLLorJFFFFFGroBBBDDXo", ".oLLLBBooGGGGGooBBBDDXo.", "oLHLBBBBBooooooBBBBDDDXo", "oLLBBBBBBBBBBBBBBBDDDXXo", ".oDBBBBDDBBBBDDBBBDDXXo.", "..ooDDDooDDDDDooDDDXoo..", "....olo.olo..olo.olo....", "....olo.olo..olo.olo....", "....oGo.oGo..oGo.oGo....", "....ooo.ooo..ooo.ooo....", "........................"], "frostby": ["....oK..........Ko......", "....oIKo......oKIo......", "....oIJo......oJIo......", "....oHLo......oBDo......", "....oHLo......oBDo......", "....oHLo......oBXo......", "....oLLLoooooooBDo......", "...oOHHLLLLLLBBBBDo.....", "..oOHLLLLLLLLBBBBDXo....", "..oOLLkkkLLLBkkkBDXo....", "..oOLLwkkLLLBwkkBDXo....", "..oOLLkekLLLBkekBDXo....", "..oOrrLLLLpLLLLrrDXo....", "..oOLLLLLmnmLLLBBDXo....", "...oDBBBBBBBBBBBDXo.....", "....ooDDIKIIDDDDoo......", "...oLLoBBBBBBBBoDDo.oo..", "...oLLoBBBBBBBBoDXooHHo.", "....ooBBBBBBBBBDXoooDDo.", "....oLLBBooBBDDDXo..oo..", "...oLLLLo..oBBDDDo......", "...oooooo..ooooooo......", "........................", "........................"], "twinkit": ["........................", "........................", "..........y.............", ".........yYy............", "....y.....y....y........", "........oooooooo........", "......ooLHHLLLBBoo......", ".....oLHHLLyLLBBBBo.....", "....oOLHLLLLLLBByBDo....", "...oOLLkkkLLLBkkkBDXo...", "...oOyLwkkLLLBwkkBDXo...", "...oOLLkekLLLBkekBDXo...", "...oOLLLLLLmmBBBBBDXo...", "..oOLLLLLLLLBBBByBDDXo..", "..oDDDDDDDDDDDDDDDDDXo..", "...otuo.otuo.otuo.otuo..", "...otTo.otTo.otTo.otTo..", "....oto..oto..oto..oto..", "...otTo.otTo.otTo.otTo..", "...oto..oto..oto..oto...", "....oto..oto..oto..oto..", ".....o....o....o....o...", "........................", "........................"], "beetix": ["........................", "........................", "........................", "........................", "...........y............", "..........yYy...........", "..........oYo...........", "........ooojooo.........", ".......ohjjjjjho........", "......ohjkkjkkjho.......", "......ohjwkjwkjho.......", "...o..ohhhjjjhhho..o....", "....o.oOLHHLBBBBo.o.....", ".....oOLHLLLoBBBDXo.....", "..oooOLLyLLLoBByBDXooo..", "....oOLLLLLLoBBBBDXo....", "...ooOLLLyLLoBBByBDXoo..", "....oOLLLLLLoBBBBDXXo...", "..oooDLLLLLLoBBBBDXXooo.", ".....oDDLLLLoBBBDXXo....", "......oDDDDDoDDDXXo.....", ".......oooooooooo.......", "........................", "........................"], "wispy": ["........................", "........................", "........................", "........oooooo..........", "......ooLHHLLBoo........", ".....oLHHLLLLBBDo.......", "....oLHHLLLLLLBBDXo.....", "...oOHLLLLLLLLBBBDXo....", "...oOLLkkLLLLkkBBDXo....", "...oOLkkkLLLkkkBBDXo....", "...oOLkwkLLLkwkBBDXo....", "...oOLkkkLLLkkkBBDXo....", "...oOrLkLLmLLkBrBDXo....", "...oOLLLLLmmLLBBBDXo....", "...oOLLLLLLLLLBBBDXo.ll.", "..oOLLLLLLLLLLBBBDXoolyl", "..oOLLLLLLLLLBBBBDXoBlgl", "..oOLLLLLLLLBBBBDDXo.lyl", "..oDLLLLLLBBBBBDDXXo.lll", "..oDDBBBBBBBBBDDXXXo....", "..oDo.oDDDo.oDDDo.oXo...", "...o...ooo...ooo...o....", "........................", "........................"], "cogby": ["...........r............", "..........rwr...........", "...........o............", "...........o............", ".....oooooooooooooo.....", ".....oHLLLLLLLLLBDo.....", ".....oLssssssssssDo.....", ".....oLsttsssttsDXo.....", ".....oLsttsssttsDXo.....", ".....oLssstttsssDXo.....", ".....oBDDDDDDDDDDXo.....", ".......oooooooooo.......", "....ooHLLLLLLLLBDoo.....", "...oLooLLLyyLLBDXooDo...", "...oLooLLyYYyLBDXooDo...", "...oBooLLLyyLLBDXooXo...", "...owo.oLLLLLLBDXo.owo..", ".......oDDDDDDDDXo......", "........oBo...oBo.......", "........oBo...oBo.......", ".......oaaBo.oaaBo......", ".......ooooo.ooooo......", "........................", "........................"], "dunelet": ["........................", "........................", ".........oooooo.........", "..oo...ooLHHLBoo...oo...", "..oBo.oLHLLLLBBDo.oDo...", "...ooOLLLLLLLBBDXoo.....", "....oOLddLLLddBDXo......", "....oOdkkdLdkkdDXo......", "....oOdwkdLdwkdDXo......", "....oOLddLccLddDXo......", ".....oOLLcckccBDo.......", ".....oLLccmmccBDo.......", "......ooDccccDoo........", ".....oOLccccccBDo.......", "....oOLLccccccBDXo......", "....oBoLccccccBoDo......", "....oBoLccccccBoXo......", "....owoLLccccBBowo......", ".....oOLLLLBBBDXo...oo..", ".....oDLLBBBBBDXo..oDo..", ".....oDDBBoBBDDXo.oDo...", "....oLLBo..oBBDDoooo....", "....ooooo..oooooo.......", "........................"], "fizzlet": ["........................", "........................", "........................", "..........rr............", ".........rwRr...........", ".........oRRo...........", ".......ooLHHLBoo........", "......oLHHLyLLBDo.......", ".....ooLLbLLLLBgBDoo....", "...ooLHHLLLLgLLBBBDDoo..", "..oLHLLyLLLLLLLBBbBDDXo.", ".oLLLLLLLLbLLLBBBBByDXXo", ".oDDLLDDLLLDDBBDDBBDDXXo", ".ooDDooDDDooDDDooDDDoXXo", "..oUWWkkWWWWWWkkWWWVVo..", "..oUWWwkWWWWWWwkWWVVVo..", "..oUWWkkWWmmWWkkWWVVVo..", "...oUUWWWWWWWWWWWVVVo...", "...oUWVWWVWWVWWVWVVVo...", "...oUWVWWVWWVWWVWVVVo...", "....oUWVWWVWWVWWVVVo....", "....oUWVWWVWWVWWVVVo....", "....oooooooooooooooo....", "........................"], "rumblet": ["....y............y......", "....oy..........yo......", ".....oy........yYo......", "......oYoooooooYo.......", ".....oOLHHLLLLBBBDo.....", "....oOLHLLLLLLLBBBDXo...", "....oOLkkkLLLkkkBBDXo...", "....oOLweeLLLweeBBDXo...", "....oOLkkkLLLkkkBBDXo...", "...oOLLLLLLBBBBBBBBBDo..", "...oOLLLmmmmmmmmBBBBDXo.", "...oOLLLmwmwmwmmBBBDXoo.", "..occcoDDDDDDDDDDDXoccc.", ".occCcoBbbbbbbbbBDocCcco", ".oCCCoLBbbbbbbbBBDXoCCCo", "..ooooLBbbbbbbbBDXXoooo.", "....oLLBbbbbbbBBDXo..yo.", "....oLBBBBBBBBBDDXo.oyo.", ".....oDBBBBBBBDDXooyo...", ".....oBBoooooBBDXo......", "....oLBBo...oBBDXo......", "....owwwo...owwwo.......", "....ooooo...ooooo.......", "........................"], "bubbly": ["........................", "........................", "........................", "..b..................b..", ".bwb.....oooooo.....bwb.", "..b....ooLHHLLBoo....b..", "......oLHHLLLLBBBoo.....", ".....oLHLLsLLLLBBBDo....", "....oOLLLLLLLLLBBsBDXo..", "....oOLLLLLLLLBBBBBDXo..", "....oOLkkkLLLLkkkBBDXo..", "....oOLwkkLLLLwkkBBDXo..", "....oOLkekLLLLkekBBDXo..", "....oOsLLLLmmLLLBBsDXo..", ".....oDLLLLLLLBBBBDXo...", "....ooDDBBBBBBBBBDDXoo..", "...oLBoLBoLBoBDoBDoBDo..", "...oLBoLBoLBoBDoBDoBDo..", "...oLsoLsoLsoBsoBsoBso..", "...oBo.oBo.oBo.oDo.oDo..", "..oBo..oo..oBo..oo..oDo.", "..oo........oo.......oo.", "........................", "........................"], "magmite": ["........................", "........................", "........................", "........................", "........oooooooo........", "......ooLHHLLLBBoo......", ".....oLHLLaLLLBBBDo.....", "....oOLLLLaaLLBBBBDo....", "...oOLLLLLLaLLBBBBDXo...", "...oOLggggLLLLggggDXo...", "...oOLgaagLLLLgaagDXo...", "...oOLLLLLLLLLLBBBDXo...", "..ooOLLaAAAAAAaBBBDXoo..", ".oLoOLLLaggggaBBBBDXoBo.", "oLLoOLLLLLLLLBBBBBDXoBDo", "oLHoOLLaLLLLBBBBBaDXoBDo", "oLLoOLLaaLLLBBBBaaDXoDXo", "oBBo.oLLLLLLBBBBBDXo.oXo", ".oo..oDDLLLaBBBBDXXo..o.", ".....oDDDDDaDDDDXXXo....", ".....oLLBo.....oBDXo....", "....oLLBBo.....oBBDXo...", "....oooooo.....oooooo...", "........................"], "glowbit": ["...a.a..........a.a.....", "....aA..........Aa......", "....oAa........aAo......", ".....oAo......oAo.......", "..oo..oAoooooooAo..oo...", "..oBDooLHHLLLBBBoooBDo..", "...oBoOLHLLLLLLBBDXoDo..", "....ooOLkkkLLkkkBDXoo...", ".....oOLwkkLLwkkBDXo....", ".....oOLkekLLkekBDXo....", ".....oOLLLLLLLLLBDXo....", "......oOLLLnnLLBDXo.....", ".......ooLLmmLBDoo......", "........oDDDDDXo........", "...ooooOLLsLLLBBBDooo...", "..oLHLLLLLLsLLBBBsBDXo..", "..oLLsLLLLLLLBBBBBDXXo..", "...oDDBBBBBBBBBBDDXXo...", "....oBo.oBo....oBo.oDo..", "....oBo.oBo....oBo.oDo..", "....oBo.oBo....oBo.oDo..", "....oko.oko....oko.oko..", "....ooo.ooo....ooo.ooo..", "........................"], "qwertle": ["...o..............o.....", "...oPo..........oPo.....", "....oPo........oPo......", ".....oPooooooooPo.......", "....oOLHHLLLLLBBDo......", "...oOLHLLLLLLLBBBDXo....", "...oOLLkkkLLLkkkBDXo....", "...oOLLwekLLLwekBDXo....", "...oOLLkkkLLLkkkBDXo....", "...oOLLLLLLLLBBBBBDXo...", "...oOLLLmmmmmmBBBBDXo...", "...oOLLLmwmmwmBBBBDXo...", "qq..oDDDDDDDDDDDDDXo..qq", "qpPo.oKKoKKoKKoBBDo.oPpq", "qpPPooKQoKQoKQoBBDXooPPq", ".qPPoOJJoJJoJJoBBDXoPPq.", "..qPoOLLLLLLLLBBBDXoPq..", "...ooOLLHHLLLBBBDXoo....", "....oDBBBBBBBBBDXXo..oo.", "....oDDBBoooBBDDXo.oBo..", "....oLBBo...oBBDXooBo...", "....owwwo...owwwoo......", "....ooooo...ooooo.......", "........................"]}, "pal": {"sproutle": {"o": "#4a1e3a", "O": "#7a3a5e", "X": "#b85a84", "D": "#d27aa0", "B": "#eea0be", "L": "#f8c2d6", "H": "#ffe0ea", "g": "#5aa848", "G": "#8cd06a", "q": "#2e6e34", "c": "#fff0f4", "s": "#f0c8d8", "k": "#2a1424", "w": "#ffffff", "e": "#6a3a7a", "m": "#7a2440", "n": "#f08aa0", "r": "#f08aa8", "y": "#f6d65a", "f": "#fff6ee"}, "drizzit": {"o": "#182c52", "O": "#2e4f86", "X": "#2a4e88", "D": "#3a6aa8", "B": "#5a90cc", "L": "#82b4e4", "H": "#b8daf4", "c": "#eef6f8", "s": "#c4d8e4", "h": "#f2e4bc", "j": "#c9a86a", "k": "#0e1a30", "w": "#ffffff", "e": "#3a8ad0", "m": "#5a1a30", "n": "#e88aa0", "r": "#e8949c", "b": "#d8f0ff"}, "zipp": {"o": "#0a3a3e", "O": "#1e6a6a", "X": "#1a6e6a", "D": "#239a94", "B": "#35c2b8", "L": "#6ee0d0", "H": "#b0f4e8", "c": "#e2fff8", "s": "#a8e0d4", "y": "#f2d048", "Y": "#b88a1e", "g": "#fff2a0", "a": "#e8902a", "A": "#a85a14", "k": "#0a1a1a", "w": "#ffffff", "e": "#2a8a8a", "p": "#cfd8e4"}, "pebbo": {"o": "#2e2014", "O": "#5a4028", "X": "#7a5434", "D": "#a07448", "B": "#c89a68", "L": "#e0b888", "H": "#f2d6b0", "c": "#f8ead2", "s": "#d8c09c", "R": "#8a92a6", "Q": "#5a6278", "P": "#b8c0d0", "K": "#b88aee", "J": "#7a4ab8", "I": "#e8d4ff", "k": "#1a1008", "w": "#fff8ec", "m": "#6a2230"}, "embit": {"o": "#2e1a16", "O": "#6a3220", "D": "#84371f", "B": "#b9552e", "L": "#d97a45", "H": "#eda36b", "c": "#f4e6cf", "b": "#4b2a20", "n": "#2e1812", "k": "#1e1316", "w": "#fff9ef", "m": "#6c2232", "p": "#e48a9a", "y": "#f6d878", "Y": "#e0903a", "A": "#e8b070"}, "glintle": {"o": "#22183e", "O": "#3e2e6a", "X": "#6a58a8", "D": "#8a78c8", "B": "#a898e0", "L": "#c8bcf0", "H": "#e6e0fa", "K": "#6ee0f0", "J": "#2e8ab0", "I": "#c8faff", "k": "#1a1030", "w": "#ffffff", "m": "#6a2a5a"}, "duskit": {"o": "#1a1030", "O": "#3a2a60", "X": "#2a1e4e", "D": "#3e2e6e", "B": "#5a46a0", "L": "#7a66c4", "H": "#a898e0", "W": "#6a4ab8", "V": "#3e2a7a", "U": "#9a7ae0", "y": "#f2e08a", "Y": "#c8a848", "f": "#d8ccf4", "k": "#120a20", "w": "#ffffff", "e": "#f2e08a", "m": "#5a2a4a"}, "breezle": {"o": "#34466a", "O": "#5a6e96", "X": "#9aaed0", "D": "#c4d4ec", "B": "#e6eefa", "L": "#f6f9ff", "H": "#ffffff", "F": "#8aa0c8", "G": "#5e7296", "J": "#b0c2e0", "y": "#f0d890", "Y": "#c8a860", "k": "#1e2a44", "w": "#ffffff", "m": "#6a2a4a", "r": "#f0a8b8", "l": "#6a7ea8"}, "frostby": {"o": "#1e3654", "O": "#3e5a82", "X": "#8eb0d0", "D": "#b8d0e6", "B": "#e2eef8", "L": "#f4f9fe", "H": "#ffffff", "I": "#8edcf4", "J": "#4a9ac8", "K": "#d4f6ff", "k": "#0e1a2a", "w": "#ffffff", "e": "#3a7ac0", "m": "#6a2a40", "n": "#f08aa0", "r": "#f2a8b8", "p": "#f08aa0"}, "twinkit": {"o": "#1a1848", "O": "#3a3888", "X": "#3a3a9a", "D": "#4e4eb8", "B": "#6a6ad8", "L": "#8e8ef0", "H": "#c0c0ff", "y": "#f6dc6a", "Y": "#c8a838", "t": "#f08ac8", "T": "#b04a90", "u": "#ffc0e8", "k": "#0e0e2a", "w": "#ffffff", "e": "#2a2a7a", "m": "#5a1a4a"}, "beetix": {"o": "#0e2a1a", "O": "#2a5a3a", "X": "#1e5a3a", "D": "#2e8a52", "B": "#48b874", "L": "#78d89a", "H": "#b8f0cc", "y": "#f2d04a", "Y": "#b08a1a", "h": "#2a4a3e", "j": "#3e6a58", "k": "#0a140e", "w": "#ffffff"}, "wispy": {"o": "#2e2850", "O": "#5a5288", "X": "#a8a0d0", "D": "#c8c2e8", "B": "#e6e2f8", "L": "#f4f2fe", "H": "#ffffff", "k": "#2e2850", "w": "#ffffff", "m": "#6a3a6a", "r": "#f0a8c0", "y": "#f6dc6a", "g": "#fff6c0", "l": "#5a4a3a"}, "cogby": {"o": "#1a2030", "O": "#3a4458", "X": "#5a6478", "D": "#7a8498", "B": "#a0aabe", "L": "#c4ccdc", "H": "#e4e8f0", "s": "#1e2a44", "t": "#6ef0f0", "y": "#f2c848", "Y": "#a87a18", "r": "#f0607a", "w": "#ffffff", "a": "#e8902a"}, "dunelet": {"o": "#3a2410", "O": "#6a4a24", "X": "#8a6030", "D": "#b08048", "B": "#d4a868", "L": "#e8c88c", "H": "#f6e2b8", "c": "#f8ecd0", "k": "#1a0e04", "w": "#ffffff", "d": "#6a4420", "m": "#6a2a20"}, "fizzlet": {"o": "#4a1a3a", "O": "#7a3a5e", "X": "#c86a9a", "D": "#e08ab4", "B": "#f4a8cc", "L": "#fcc8e0", "H": "#fff0f6", "W": "#6ec8b0", "V": "#3e8a7a", "U": "#a8ecd8", "y": "#f2d04a", "b": "#5aa8f0", "g": "#6ad68a", "w": "#ffffff", "k": "#2a0e1e", "r": "#e8384f", "R": "#a01a30", "m": "#7a1a3a"}, "rumblet": {"o": "#141c48", "O": "#2e3a7a", "X": "#2e3e94", "D": "#3e52b8", "B": "#5a72d8", "L": "#7e96ec", "H": "#b0c2fa", "c": "#f2f6ff", "C": "#c4cee8", "y": "#f6d84a", "Y": "#b89418", "b": "#c8d4fa", "k": "#0a0e24", "w": "#ffffff", "e": "#f6d84a", "m": "#3a0e2a"}, "bubbly": {"o": "#0a3434", "O": "#1e5a58", "X": "#1a6a66", "D": "#23948e", "B": "#34bcb4", "L": "#68dcd2", "H": "#b0f4ec", "s": "#ffb8a6", "k": "#06201e", "w": "#ffffff", "e": "#0a4a48", "m": "#5a1a2a", "b": "#d8f4ff"}, "magmite": {"o": "#1a0e0e", "O": "#3e2a2a", "X": "#3a2626", "D": "#4e3636", "B": "#6a4a48", "L": "#8a6662", "H": "#a88480", "a": "#ff7a2a", "A": "#c8401a", "g": "#ffd84a"}, "glowbit": {"o": "#12382e", "O": "#2a5a4a", "X": "#3a9a7a", "D": "#4ec09a", "B": "#6ee8c0", "L": "#9ef4d6", "H": "#d4fff0", "a": "#e0b0ff", "A": "#a070d8", "s": "#f4fffb", "k": "#0a1e18", "w": "#ffffff", "e": "#1a5a4a", "n": "#2a1a3a", "m": "#6a2a4a"}, "qwertle": {"o": "#3a2408", "O": "#6a4a14", "X": "#a87a20", "D": "#c89a30", "B": "#e6bc4a", "L": "#f6d878", "H": "#fff2c0", "K": "#fff8ec", "J": "#d8ccb8", "Q": "#6a5a48", "p": "#7c5cff", "P": "#4e3d86", "q": "#a898f0", "k": "#1a1008", "w": "#ffffff", "e": "#7c5cff", "m": "#4a1a0a"}}, "pop": ["..o..................o..", "..oO................Oo..", "..oHo..............oBo..", "..ouLo............oBuo..", "..otuLo..........oBtuo..", "..oTtLLooooooooooBDtTo..", ".oTuLHHHHLLLLLLBBBBDuTo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLwuBBBBBBBBDo.", ".OLLLLLLLLLtTBBBBBBBBDo.", ".OLLLLLLLBBTTBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBmmmmBBBBrrrDo.", ".oBBBBBBBBmnwmBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", ".oLoBBBcscccsccsBBDoyYo.", ".oBoBBBccscccscBBDDoyo..", "..owoLBBBooooooooBBDoyYo", "...ooooooooooooooooooo.."], "popPal": {"o": "#2b1d3e", "O": "#4a3a74", "X": "#3a2c66", "D": "#4e3d86", "B": "#6e5bb8", "L": "#8f7fd6", "H": "#b9adeb", "t": "#6fd0c8", "T": "#3c8f9a", "u": "#b4f0e6", "w": "#fff8ec", "k": "#1e1530", "r": "#e4909c", "m": "#6e2440", "n": "#e48a98", "c": "#efe1c6", "s": "#c9b291", "y": "#e8bc58", "Y": "#a8762e"}, "gl": ["....o..............o....", "....oGo..........oGo....", "....ogGo........oGgo....", ".....ogGo......oGgo.....", "......ogoooooooogo......", "....oLLLLLLLBBBBBBBDo...", "...oLHLLLLLBBBBBBBBBDo..", "..oLLLLLLLBBBBBBBBBBBDo.", ".goLLkeeeLBBBBeeekBBBDog", ".goLLewkeLBBBBewkeBBBDog", ".goLLeeeeBBBBBeeeeBBBDog", "..oLLLLLBBBBBBBBBBBBDo..", "..oLLkkkkkkkkkkkkkBBDo..", "..oLLtktktktktktktBBDo..", "..oLLkkkkkGGGkkkkkBBDo..", "..oLLktktktktktktkBBDo..", "..oLLLkkkkkkkkkkkBBBDo..", ".goLLLLBBBBBBBBBBBBBDog.", "..oDLLBBBBBBBBBBBBBDDo..", "...oDDDDDDDDDDDDDDDDo...", "...oLLo..........oBBo...", "..oLLLo..........oBBBo..", "..oGoGo..........oGoGo..", "..ooooo..........ooooo.."], "glPal": {"o": "#1a0f26", "D": "#2a1840", "B": "#3e2560", "L": "#5a3a86", "H": "#7a58aa", "k": "#12081c", "w": "#fff4f8", "e": "#e2dc74", "t": "#f4eef0"}, "glVar": [["#c8489c", "#f08ac8"], ["#5aa83a", "#a8e07a"], ["#d0702a", "#f6b070"], ["#3a9ab0", "#8ae0e8"], ["#b8a02a", "#f0e080"]], "ks": ["......oooo......", "....oocccCoo....", "...occcCCCCCo...", "..occCCCCCCCCo..", ".occCCCCCCCCCCo.", ".ocCCCCCCCCCCCo.", "oyyyyoffffoyyyyo", "oYYYYofppfoYYYYo", "oyyyyoffffoyyyyo", ".oVVVoooooVVVvo.", ".oVVVVVVVVVVvvo.", "..oVVVVVVVVvvo..", "...oVVVVVVvvo...", "....ooVVVvoo....", "......oooo......", "................"], "ksPal": {"o": "#1a1450", "C": "#5cc8e8", "c": "#d8fbff", "V": "#8a6ce0", "v": "#5a3cb0", "y": "#f6d050", "Y": "#b8901e", "f": "#fff6d0", "p": "#ff5d8f"}, "acc": {"crown": {"x": 6, "y": 2, "back": 0, "rows": ["o..o.oo.o..o", "oyoyoyyoyoyo", "oyyyyrryyyyo", "oYYYYYYYYYYo", "oooooooooooo"], "pal": {"o": "#5a3a00", "y": "#f6d050", "Y": "#c8981e", "r": "#e84a6a"}}, "beanie": {"x": 5, "y": 1, "back": 0, "rows": ["......oo......", ".....oggo.....", "...ooHLLBoo...", "..oHLLLLLBBo..", ".oHLLLLLLLBBo.", "oaAaAaAaAaAaAo"], "pal": {"o": "#3a1a10", "g": "#fff2dc", "H": "#ff9a6a", "L": "#e86a3a", "B": "#b84a24", "a": "#f6c070", "A": "#c88a40"}}, "wizard": {"x": 5, "y": 0, "back": 0, "rows": ["......o.......", ".....oBo......", "....oBLBo.....", "....oByLBo....", "...oBLLLBBo...", "..oBLLyLLBBo..", "oooooooooooooo"], "pal": {"o": "#141a4a", "B": "#2e3a9a", "L": "#4e5ad0", "y": "#f6d050"}}, "phones": {"x": 0, "y": 4, "back": 0, "rows": ["......oooooooooooo......", "...ooDDDDDDDDDDDDDDoo...", "..oDo..............oDo..", ".oDo................oDo.", ".oDo................oDo.", ".oDo................oDo.", "opPpo..............opPpo", "oPPPo..............oPPPo", "oPPPo..............oPPPo", "opPpo..............opPpo", ".ooo................ooo."], "pal": {"o": "#0e1020", "D": "#2a2f50", "p": "#ff8ab0", "P": "#e04a7a"}}, "shades": {"x": 5, "y": 11, "back": 0, "rows": ["oooooooooooooo", "okwkkoooookwko", ".okko....okko."], "pal": {"o": "#111118", "k": "#2a2a38", "w": "#8a8aa8"}}, "bowtie": {"x": 8, "y": 18, "back": 0, "rows": ["oo....oo", "oPpoopPo", "oPPppPPo", "oPpoopPo", "oo....oo"], "pal": {"o": "#4a0a24", "P": "#e04a7a", "p": "#ff9ac0"}}, "scarf": {"x": 2, "y": 18, "back": 0, "rows": ["oooooooooooooooooooo", "orRrRrRrRrRrRrRrRrRo", "oooooooooooooRrRoooo", ".............oRro...", ".............orRo...", "..............oo...."], "pal": {"o": "#4a0a14", "r": "#e8384f", "R": "#b02038"}}, "cape": {"x": 1, "y": 19, "back": 1, "rows": ["..oooooooooooooooooo..", ".orRRRRRRRRRRRRRRRRro.", "orRRRRRRRRRRRRRRRRRRro", "oRRRRRRRRRRRRRRRRRRRRo", "oooooooooooooooooooooo"], "pal": {"o": "#4a0a14", "r": "#e8384f", "R": "#b02038"}}}};
const KK=(()=>{
const D=KKDATA;
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function paint(g,rows,pal,ox=0,oy=0){rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const col=pal[r[x]];if(col){g.fillStyle=col;g.fillRect(ox+x,oy+y,1,1)}}})}
function species(i,f){const k=D.order[i],c=cv(24,24),g=c.getContext('2d');paint(g,D.spr[k],D.pal[k]);
 if(f===2){g.fillStyle='#f6e08a';[[1,2],[22,4],[0,12],[23,15]].forEach(([x,y])=>{g.fillRect(x,y,1,1)});g.fillStyle='#fffbe0';[[1,1],[1,3],[0,2],[2,2],[22,3],[22,5],[21,4],[23,4]].forEach(([x,y])=>g.fillRect(x,y,1,1))}
 return c}
function pop(eq={}){const c=cv(24,24),g=c.getContext('2d');const A=Object.values(eq).filter(id=>D.acc[id]);
 A.filter(id=>D.acc[id].back).forEach(id=>{const a=D.acc[id];paint(g,a.rows,a.pal,a.x,a.y)});
 paint(g,D.pop,D.popPal);A.filter(id=>!D.acc[id].back).forEach(id=>{const a=D.acc[id];paint(g,a.rows,a.pal,a.x,a.y)});return c}
function scrambler(v=0,king=false){const c=cv(24,24),g=c.getContext('2d'),[a,b]=D.glVar[v%D.glVar.length];paint(g,D.gl,Object.assign({},D.glPal,{g:a,G:b}));
 if(king){const cr=D.acc.crown;paint(g,cr.rows,cr.pal,6,0)}return c}
function keystone(){const c=cv(16,16),g=c.getContext('2d');paint(g,D.ks,D.ksPal);return c}
const REG={meadow:{G:['#365f3c','#4f7f48','#62955a','#7fae6a','#a4c886'],P:['#8a6a44','#b48c5c','#d0ac78'],deco:'bush',fl:['#f2e8f0','#f0b4c8','#f0d478']},
 cave:{G:['#1e3640','#2a4a56','#355a66','#467480','#6a9aa4'],P:['#3a3048','#54466a','#6e5e88'],deco:'crystal',fl:['#8ff0ff','#c8a8ff','#8ff0ff']},
 volcano:{G:['#2e1a1a','#4a2a24','#5a342c','#74463a','#946050'],P:['#8a2a14','#d0501e','#f6a03a'],deco:'rock',fl:['#ffb03a','#ff7a2a','#ffd84a']},
 sky:{G:['#9a8ac8','#c8c0ec','#dcd6f6','#eeeafc','#ffffff'],P:['#a8a0c8','#c0b8dc','#d8d2ee'],deco:'cloud',fl:['#ffd0e8','#ffffff','#f6e08a']},
 star:{G:['#1a1a3a','#262450','#302e62','#3e3c78','#56549a'],P:['#3a2e58','#4e406e','#6a5a8a'],deco:'star',fl:['#f6e08a','#ffffff','#c8b8ff']}};
function field(kind='meadow',w=256,h=72){const R=REG[kind]||REG.meadow,c=cv(w,h),g=c.getContext('2d'),P=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)},Rc=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(x,y,a,b)};
 const [GD,G0,G1,G2,G3]=R.G;Rc(0,0,w,h,G1);
 for(let ty=0;ty<h;ty+=16)for(let tx=0;tx<w;tx+=16){const s=(tx*7+ty*13)%5;[[3,4],[10,9],[5,12],[12,2]].forEach(([x,y],i)=>{if((i+s)%3===0)return;P(tx+x,ty+y,GD);P(tx+x+2,ty+y,GD);P(tx+x+1,ty+y-1,G0);P(tx+x,ty+y-1,G2);P(tx+x+2,ty+y-1,G2)});if(s===1){P(tx+8,ty+6,G3);P(tx+9,ty+6,G3)}}
 const [PD,PB,PL]=R.P;for(let x=0;x<w;x++){const y0=Math.round(44+6*Math.sin(x/22));Rc(x,y0,1,16,PB);P(x,y0,PD);P(x,y0+15,PD);if(x%5===0)P(x,y0+3+(x*7)%10,PL);if(x%7===0)P(x,y0+2+(x*11)%12,PD)}
 for(let i=0;i<10;i++){const x=(i*53+11)%w,y=(i*29+7)%38,col=R.fl[i%3];P(x,y-1,col);P(x-1,y,col);P(x+1,y,col);P(x,y+1,col);P(x,y,'#e8c050')}
 const O=GD;const deco={
  bush:(x,y)=>["...oooooo...","..oLLLBBBo..",".oLLLBBBBBo.","oLLBBBBBDBBo","oLBBBBDBBBDo","oBBBDBBBBDDo",".oDBBBDDDDo.","..oooooooo.."].forEach((r,j)=>[...r].forEach((ch,i)=>{const m={o:'#24402c',D:'#3c6a3e',B:'#55894c',L:'#79ac62'}[ch];if(m)P(x+i,y+j,m)})),
  crystal:(x,y)=>["....o....","...oIo...","..oIKJo..","..oIKJo..",".oIKKJJo.",".oIKKJJo.","oIKKKJJJo","ooooooooo"].forEach((r,j)=>[...r].forEach((ch,i)=>{const m={o:'#12283a',I:'#d8fbff',K:'#6ee0f0',J:'#2e8ab0'}[ch];if(m)P(x+i,y+j,m)})),
  rock:(x,y)=>["..oooooo..",".oLLLBBDo.","oLLBBBBDDo","oLBBaBBDDo","oBBBaaBDDo",".ooooooooo"].forEach((r,j)=>[...r].forEach((ch,i)=>{const m={o:'#1a0e0e',L:'#8a6662',B:'#6a4a48',D:'#4e3636',a:'#ff7a2a'}[ch];if(m)P(x+i,y+j,m)})),
  cloud:(x,y)=>["...oooo.....","..oHHLLo.oo.",".oHLLLLLoLLo","oHLLLLLLLLDo","oLLLLLLLDDDo",".oooooooooo."].forEach((r,j)=>[...r].forEach((ch,i)=>{const m={o:'#8a7ab0',H:'#ffffff',L:'#f0ecfc',D:'#c8c0e0'}[ch];if(m)P(x+i,y+j,m)})),
  star:(x,y)=>["...y...","..yYy..","yyYwYyy","..yYy..","...y..."].forEach((r,j)=>[...r].forEach((ch,i)=>{const m={y:'#c8a838',Y:'#f6dc6a',w:'#fffbe0'}[ch];if(m)P(x+i,y+j,m)}))};
 [[8,6],[70,2],[150,8],[214,4],[120,22],[34,26],[190,26]].forEach(([x,y])=>deco[R.deco](x,y));return c}
return {species,pop,scrambler,keystone,field,order:D.order};
})();
/* ---- swap game art to hand-drawn sprites ---- */
const KKC={};const kku=(k,mk)=>KKC[k]||(KKC[k]=mk().toDataURL());
const kkimg=(cls,url,scale=1)=>{const s=200*scale,o=(200-s)/2;return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true"><image href="${url}" x="${o}" y="${200-s}" width="${s}" height="${s}"/></svg>`};
function creatureSVG(i,form,cls=''){return kkimg('cr '+cls,kku('k'+i+'-'+(form===2?2:0),()=>KK.species(i,form)),[.7,.85,1][form])}
function zookSVG(eq){eq=eq||S.equip;return kkimg('zk',kku('p'+JSON.stringify(eq),()=>KK.pop(eq)))}
function glitchSVG(v=0,king=false){return kkimg('gl',kku('g'+v+king,()=>KK.scrambler(v,king)))}
function keystoneSVG(){return kkimg('ks',kku('ks',()=>KK.keystone()))}
function sceneSVG(c){const kind=['meadow','cave','volcano','sky','star'][REGIONS.findIndex(r=>r.color===c)]||'meadow';const u=kku('f'+kind,()=>KK.field(kind));
 return `<svg class="scene" viewBox="0 0 256 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${u}" width="256" height="72"/></svg>`}
['goggles','starspecs','medal','jetpack','wings'].forEach(k=>delete ACC[k]);

/* ================= V5: evolutions, rare tiers, pixel hands ================= */
const EVO=[[['crest'],['horns','wings','aura']],[['crest'],['wings','aura']],[['crest'],['wings','aura']],[['horns'],['horns','crest','aura']],[['crest'],['horns','wings','aura']],
 [['crest'],['crown','aura']],[['horns'],['crown','aura']],[['horns'],['wings','aura']],[['crest'],['crown','wings','aura']],[['crest'],['crown','aura']],
 [['horns'],['horns','wings','aura']],[['crest'],['crown','aura']],[['horns'],['wings','aura']],[['crest'],['crown','aura']],[['crest'],['crown','wings','aura']],
 [['crest'],['horns','wings','aura']],[['crest'],['crown','aura']],[['horns'],['horns','crest','aura']],[['crest'],['wings','aura']],[['horns'],['crown','wings','aura']]];
const OVL={
 wing:["oo......","oLoo....","oLLLoo..",".oLLLLoo",".oLBLLLo","..oBBLLo","..oBoBLo","...o.oBo","......oo"],
 horn:["..o",".oH","oHL","oLB","oBo"],
 crest:["o.o.o","HoLoH","LLBLL"],
 crown:["o..o.oo.o..o","oyoyoyyoyoyo","oyyyyrryyyyo","oYYYYYYYYYYo"]};
const TIER={gold:['#3a2408','#7a5214','#b8861e','#e6bc4a','#f6dc7a','#fff4c8'],diamond:['#232a5e','#4a64b8','#86aee6','#bfe2f6','#e6f8ff','#ffffff']};
const KEEP=new Set(['k','w','e','m','n','p','r']);
function lum(h){const n=parseInt(h.slice(1),16);return .3*(n>>16)+.59*(n>>8&255)+.11*(n&255)}
function tierPal(pal,tier){if(!tier)return pal;const ramp=TIER[tier],ks=Object.keys(pal).filter(k=>!KEEP.has(k)),ls=ks.map(k=>lum(pal[k])),mn=Math.min(...ls),mx=Math.max(...ls),out=Object.assign({},pal);
 ks.forEach((k,i)=>{const t=(ls[i]-mn)/((mx-mn)||1);out[k]=ramp[Math.min(ramp.length-1,Math.round(t*(ramp.length-1)))]});out.o=ramp[0];return out}
function evolved(i,f,tier){
 const D=KKDATA,k=D.order[i],rows=D.spr[k],pal=tierPal(D.pal[k],tier),W=40,H=32,ox=8,oy=8;
 const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const put=(x,y,col)=>{if(col){g.fillStyle=col;g.fillRect(x,y,1,1)}};
 const draw=(r,x0,y0,p,flip)=>r.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch!=='.')put(flip?x0+row.length-1-x:x0+x,y0+y,p[ch])}));
 let X0=24,X1=0,Y0=24;rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'){X0=Math.min(X0,x);X1=Math.max(X1,x);Y0=Math.min(Y0,y)}}));
 const cx=Math.round((X0+X1)/2),feats=f===0?[]:EVO[i][f-1];
 const gp=Object.assign({y:'#f6d050',Y:'#c8981e',r:'#e84a6a'},pal);
 if(feats.includes('aura')){const ring=tier==='diamond'?'#bfe2f6':tier==='gold'?'#f6dc7a':pal.L||'#ffffff';g.globalAlpha=.55;
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.')[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].forEach(([a,b])=>{const q=rows[y+b];if(!q||q[x+a]===undefined||q[x+a]==='.')put(ox+x+a,oy+y+b,ring)})}));g.globalAlpha=1}
 if(feats.includes('wings')){const wy=oy+Math.round((Y0+14)/2)+2;draw(OVL.wing,ox+X0-7,wy,pal,false);draw(OVL.wing,ox+X1,wy,pal,true)}
 draw(rows,ox,oy,pal,false);
 if(feats.includes('horns')){const hw=Math.max(2,Math.min(6,Math.floor((AN.hr-AN.hl)/2)-2)),xa=cx-hw-1,xb=cx+hw-1;const hp={o:pal.o||'#1b1626',H:'#fff6e0',L:'#e8d4a8',B:'#b8946a'};draw(OVL.horn,ox+xa,oy+AN.top(xa+1)-3,hp,false);draw(OVL.horn,ox+xb,oy+AN.top(xb+1)-3,hp,true)}
 if(feats.includes('crest')){let [hh,ss]=hex2hsl(TYPES[SPECIES[i].t]||'#e8584f');if(hh>280&&hh<345)hh=8;const cp={o:pal.o||'#1b1626',H:hsl2hex(hh,Math.min(.75,ss),.72),L:hsl2hex(hh,Math.min(.75,ss),.55),B:hsl2hex(hh,Math.min(.75,ss),.38)};draw(OVL.crest,ox+cx-2,oy+AN.med2(cx-1,cx+1)-2,cp,false)}
 if(feats.includes('crown'))draw(OVL.crown,ox+cx-6,oy+AN.med2(cx-3,cx+3)-3,gp,false);
 if(f===2||tier){const sp=tier==='diamond'?['#ffffff','#bfe2f6']:['#fff4c8','#f6d050'];[[2,3],[36,6],[1,20],[38,24],[30,1]].forEach(([x,y])=>{put(x,y,sp[0]);put(x-1,y,sp[1]);put(x+1,y,sp[1]);put(x,y-1,sp[1]);put(x,y+1,sp[1])})}
 return c}
function creatureSVG(i,form,cls='',tier){const s=[.6,.8,1][form],u=kku('e'+i+'-'+form+(tier||''),()=>evolved(i,form,tier));
 return `<svg class="cr ${cls} ${tier||''}" viewBox="0 0 200 200" aria-hidden="true"><image href="${u}" x="${(200-200*s)/2}" y="${200-160*s}" width="${200*s}" height="${160*s}"/></svg>`}
const TRANK={gold:1,diamond:2};const better=(a,b)=>(TRANK[a]||0)>(TRANK[b]||0);
/* ---- pixel hands ---- */
let HMASK=null,HON=new Set();
function buildHandMask(){const W=26,H=26,m=Array.from({length:H},()=>new Array(W).fill(''));
 const fill=(x0,x1,y0,y1,id)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m[y][x]=id};
 fill(3,5,8,16,'p');fill(7,9,4,16,'r');fill(11,13,2,16,'m');fill(15,17,4,16,'i');fill(3,18,15,24,'a');
 [[3,24],[18,24],[3,15]].forEach(([x,y])=>m[y][x]='');
 for(let s=0;s<7;s++){const x=18+s,y=21-s;for(let t=-1;t<=1;t++){if(y+t>=0)m[y+t][x]='t';}}
 return m}
function initHands(){HMASK=buildHandMask();$('#hands').innerHTML='<canvas id="hcv" width="58" height="28" aria-label="Hands: the glowing finger presses the key"></canvas><div class="hlab"><span>LEFT</span><span>RIGHT</span></div>';drawHands()}
function drawHands(){const c=$('#hcv');if(!c||!HMASK)return;const g=c.getContext('2d');g.clearRect(0,0,58,28);
 const FCOL={p:'p',r:'r',m:'m',i:'i',t:'t'},SK=['#f2c9a0','#d9a87c','#b8845c'],OUT='#3a2418';
 const draw=(side,ox)=>{const m=HMASK,W=26,H=26;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=side==='l'?x:W-1-x,id=m[y][X];
   const px=(col)=>{g.fillStyle=col;g.fillRect(ox+x,y+1,1,1)};
   if(id){const fid=id==='a'?null:side+(id==='t'?'t':id),on=fid&&HON.has(fid),fc=id==='a'?null:fcol(id==='t'?'th':side+id);
    const up=y>0?m[y-1][X]:'',dn=y<H-1?m[y+1][X]:'',lf=(side==='l'?(x>0?m[y][X-1]:''):(x>0?m[y][X+1]:''));
    let col;if(!fc)col=dn===''?SK[2]:up===''?SK[0]:SK[1];else{col=on?fc:mix(fc,'#3a2f4e',.55);if(up===''||up==='a')col=on?'#ffffff':mix(fc,'#ffffff',.15)}
    if(fc&&dn==='a'&&up!==''&&(lf!==id))col=col;px(col);
    if(fc&&y>0&&m[y-1][X]===''&&on){}}
   else{const nb=[[0,1],[0,-1],[1,0],[-1,0]].some(([a,b])=>{const yy=y+b,xx=X+a;return yy>=0&&yy<H&&xx>=0&&xx<W&&m[yy][xx]});
    if(nb){const glow=[[0,1],[0,-1],[1,0],[-1,0]].some(([a,b])=>{const yy=y+b,xx=X+a;if(yy<0||yy>=H||xx<0||xx>=W)return false;const q=m[yy][xx];return q&&q!=='a'&&HON.has(side+(q==='t'?'t':q))});
     g.fillStyle=glow?'#ffffff':OUT;g.fillRect(ox+x,y+1,1,1)}}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=side==='l'?x:W-1-x,id=m[y][X];if(id&&id!=='a'&&y<15){const nx=side==='l'?X+1:X-1;const q=m[y]?.[nx];if(q!==undefined&&q!==''&&q!==id&&q!=='a'){g.fillStyle=OUT;g.fillRect(ox+x+(side==='l'?1:-1),y+1,1,1)}}}};
 draw('l',2);draw('r',30)}
function mix(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),f=(s)=>Math.round(((A>>s)&255)*(1-t)+((B>>s)&255)*t);return '#'+((1<<24)|(f(16)<<16)|(f(8)<<8)|f(0)).toString(16).slice(1)}
function setTarget(ch,extraKeys){
 document.querySelectorAll('.key.tgt').forEach(k=>k.classList.remove('tgt'));HON=new Set();
 if(extraKeys)extraKeys.forEach(k=>keyEls.get(k)?.classList.add('tgt'));
 if(ch!=null){const k=keyInfo(ch);k.keys.forEach(x=>keyEls.get(x)?.classList.add('tgt'));k.fingers.forEach(f=>(f==='th'?['lt','rt']:[f]).forEach(x=>HON.add(x)))}
 drawHands()}
function lightFingers(list){HON=new Set(list);drawHands()}

/* ================= V6: more closet items by level, binder viewer ================= */
Object.assign(KKDATA.acc,{
 headband:{x:1,y:6,back:0,rows:["o".repeat(22),"o"+"r".repeat(20)+"o","o".repeat(22)],pal:{o:'#4a0a14',r:'#e8384f'}},
 goggles:{x:1,y:7,back:0,rows:["....oooooo..oooooo....","bbbboccTTcooccTTcobbbb","....oooooo..oooooo...."],pal:{o:'#3a2418',b:'#7a4f2e',c:'#9fe8ff',T:'#5ab4d0'}},
 flowers:{x:4,y:4,back:0,rows:["..y...p...y...p.",".ypy.pwp.ypy.pwp","g".repeat(16)],pal:{y:'#f6d050',p:'#f08ab0',w:'#ffffff',g:'#5aa848'}},
 pirate:{x:4,y:0,back:0,rows:["......oooo......","....ooKKKKoo....","..ooKKKwwKKKoo..",".oKKKKwkwkKKKKo.","oKKKKKKwwKKKKKKo","o".repeat(16)],pal:{o:'#0e0a14',K:'#2a2238',w:'#f2ece0',k:'#0e0a14'}},
 halo:{x:6,y:0,back:0,rows:["..oooooooo..",".oyYYYYYYyo.","..oooooooo.."],pal:{o:'#b8901e',y:'#fff4c8',Y:'#f6d050'}},
 knight:{x:5,y:0,back:0,rows:["......rr......",".....rRr......","...oooooooo...","..oLLLLLLBBo..",".oLHLLLLLLBBo.","oLLLLLLLLLLBBo","o".repeat(14)],pal:{o:'#2a2a38',L:'#b8c0d0',H:'#eef2f8',B:'#7a8296',r:'#e8384f',R:'#a01a30'}},
 angel:{x:0,y:10,back:1,rows:["oo....................oo","oWo..................oWo","oWWo................oWWo","oWWWo..............oWWWo",".oWWWo............oWWWo.",".oGWWo............oWWGo.","..oGWo............oWGo..","...oo..............oo..."],pal:{o:'#6a7ea8',W:'#ffffff',G:'#d8e4f4'}},
 jetpack:{x:0,y:14,back:1,rows:["ooo..................ooo","oLo..................oLo","oLo..................oBo","oBo..................oBo","ooo..................ooo",".y....................y.",".Y....................Y."],pal:{o:'#2a3248',L:'#dfe6f2',B:'#a0aabe',y:'#ffd23a',Y:'#ff7a2a'}},
 gemcrown:{x:6,y:1,back:0,rows:["o..o.oo.o..o","oDoDoDDoDoDo","oDDDDccDDDDo","oVVVVVVVVVVo","oooooooooooo"],pal:{o:'#1a1450',D:'#e6f8ff',c:'#8ab4e8',V:'#bfe2f6'}}});
Object.values(ACC).forEach(a=>a.lvl=a.lvl||1);
Object.assign(ACC,{headband:{slot:'head',name:'Hero Band',cost:15,lvl:2},goggles:{slot:'head',name:'Pilot Goggles',cost:20,lvl:3},flowers:{slot:'head',name:'Flower Crown',cost:25,lvl:4},
 pirate:{slot:'head',name:'Pirate Hat',cost:30,lvl:5},halo:{slot:'head',name:'Star Halo',cost:35,lvl:6},knight:{slot:'head',name:'Knight Helm',cost:40,lvl:7},
 angel:{slot:'back',name:'Cloud Wings',cost:45,lvl:8},jetpack:{slot:'back',name:'Rocket Pack',cost:50,lvl:9},gemcrown:{slot:'head',name:'Diamond Crown',cost:80,lvl:10}});
function renderShop(){const L=levelOf(S.xp);
 let it='';Object.entries(ACC).sort((a,b)=>a[1].lvl-b[1].lvl||a[1].cost-b[1].cost).forEach(([id,a])=>{const own=S.owned.includes(id),eq=S.equip[a.slot]===id,lock=L<a.lvl;
  it+=`<div class="item panel ${eq?'eq':''} ${lock?'lockd':''}">${zookSVG({[a.slot]:id})}<span class="slot">${lock?'Level '+a.lvl:a.slot}</span><h4>${a.name}</h4>
  ${lock?`<button class="btn sm alt" disabled>Level ${a.lvl}</button>`:own?`<button class="btn sm ${eq?'alt':'volt'}" data-act="equip" data-id="${id}">${eq?'Take off':'Wear'}</button>`:`<button class="btn sm" data-act="buy" data-id="${id}" ${S.gems<a.cost?'disabled':''}>${ICON.gem.replace('<svg','<svg width="16" height="16"')} ${a.cost}</button>`}</div>`});
 $('#s-shop').innerHTML=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Hero Closet</h2>${gemsHTML()}</div>
 <div class="shop-top"><div class="shop-hero panel">${zookSVG()}<p class="muted" style="margin:0;text-align:center">Level up for new outfits!<br>You are Level ${L}.</p></div><div class="items">${it}</div></div>`;
}
function renderBinder(){
 const C=Object.values(S.cards),c=C.length,holo=C.filter(x=>x.holo).length,gold=C.filter(x=>x.tier==='gold').length,dia=C.filter(x=>x.tier==='diamond').length;
 let g='';SPECIES.forEach((sp,i)=>[0,1,2].forEach(f=>{const cd=S.cards[sk(i,f)];g+=cd?`<button class="cardbtn" data-act="card" data-k="${i}-${f}" aria-label="${sp.n[f]}">${cardHTML(i,f,cd)}</button>`:cardHTML(i,f,{locked:1})}));
 $('#s-binder').innerHTML=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Keylori Collection</h2><span class="muted">${c}/${TOTAL} · ${holo} holo · ${gold} gold · ${dia} diamond</span></div>
 <p class="muted" style="margin-top:-6px">Tap a card to see it big!</p><div class="binder">${g}</div>`;
}
ACT.card=d=>{const [i,f]=d.k.split('-').map(Number),cd=S.cards[d.k]||{},sp=SPECIES[i],b=S.best[d.k]||0;
 const rar=cd.tier==='diamond'?['Diamond','dia','Super rare! 1 in 40']:cd.tier==='gold'?['Gold','gold','Rare! 1 in 8']:['Normal','norm','Find a gold or diamond one!'];
 const forms=[0,1,2].map(x=>{const o=S.cards[i+'-'+x];return `<div class="fthumb ${x===f?'on':''}">${o?creatureSVG(i,x,'',o.tier):'<span>?</span>'}<small>${['Hatchling','Champion','Mythic'][x]}</small></div>`}).join('');
 modal(`<div class="bigcard">${cardHTML(i,f,cd)}</div>
 <div class="rbadges"><span class="rb ${rar[1]}">${rar[0]}</span>${cd.holo?'<span class="rb holo">Holo</span>':''}<span class="rb">${'★'.repeat(b)}${'☆'.repeat(3-b)}</span></div>
 <p class="muted" style="margin:0">${rar[2]}</p><div class="forms">${forms}</div><button class="btn" data-act="close">Close</button>`)};

const WDATA={"spr": {"mossling": ["............................", "..........oooooooo..........", "........oorrrrrrrroo........", ".......orrssrrrrssrro.......", ".......orsssrrrrsssro.......", "..ooo..oRrrrrrrrrrrRo..ooo..", ".oqGGo.oRRrrrrrrrrRRo.oGGqo.", ".oGBGooooooooooooooooooGDGo.", ".oLBoOGGqGLLLLBBBBGqGGooDDo.", "..ooOLGqGGLHHLBLLBGGqGBooo..", "...OLHLLLLLLLLBBBBBBBBLBo...", "...OLHLLLLLLLLBBBBBBBBLBo...", "...OLLLkkkLLLLBBBBkkkBBBo...", "...OLLLwkkLLLLBBBBkkwBBBo...", "...OLLLkekLLLLBBBBkekBBBo...", "...OLppLLLLccnnccBBBBppBo...", "...OLppLLLcccnncccBBBppBo...", "...OLLLLLLcccMMcccBBBBBBo...", "...OBLLLLLLccccccBBBBBBBo...", "....oBBLLLLLLLBBBBBBBBBo....", "....ooDBBBBBBBBBBBBBBDoo....", "...oGGooBBBccccccBBBooGGo...", "..oGqGLoBBccccccccBBoBGqGo..", "..oLLLLoBBccccccccBBoBBBDo..", "..owwLLoBBccccccccBBoBBwwo..", "...oooooBBBccccccBBBooooo...", ".....oLLBBooooooooBBBBo.....", ".....ooooo........ooooo....."], "fernix": ["...o....................o...", "...oHo................oLo...", "....oHLo............oBLo....", "....oLHLo..........oBLBo....", ".....oLBLoo......ooBBBo.....", "......oLLLooooooooBBBo......", ".....oOLHHLLLLBBBBLLBoo.....", "....oOLHLLLLLLBBBBBBLBoo....", "...oOLHLrrrrLLBBrrrrBLBoo...", "...oOLLrkkkkrLBrkkkkrBBoo...", "...oOLLrkeekrLBrkeekrBBoo...", "...oOLLrkwekrLBrkewkrBBoo...", "...oOLLrkkkkrLBrkkkkrBBoo...", "...oOLLLrrrrLyyBrrrrBBBoo...", "...oOLBLLLLLLYYBBBBBBBBoo...", "..oDBBBcsccccccccccscBBBXo..", ".oDBLBBccsccccccccsccBBBDXo.", ".oBLBDBcccsccccccscccBDBDDo.", ".oBLBDBccsccccccccsccBDBDDo.", ".oBLBDBcsccccccccccscBDBDDo.", ".oDBBDBcccsccccccscccBDBDXo.", "..oDDDBBccccccccccccBBDDXo..", "...ooDBBBccccccccccBBBDoo...", ".....oDBBBBBBBBBBBBBBDo.....", "......oyYoyYooooYyoYyo......", "......ooo.ooo..ooo.ooo......", "............................", "............................"], "shroomie": ["............................", "..........oooooooo..........", "........oorrssssrroo........", ".......orrsssrrsssrro.......", "..oooo.orrrrrrrrrrrro.oooo..", ".oLHHLooRRRRRRRRRRRRooBLLDo.", "oLHkkkLooooooooooooooBkkkLDo", "oLkwkkkLOLHLLLBBBLBoBkkkwkDo", "oLkekkkLLHLLLLBBBBLBBkkkekDo", "oLLkkkLLLLLLLLBBBBBBBBkkkDDo", ".oLLLLLLLLLLLLBBBBBBBBBBDDo.", "oOLLLLLLLLLLLLBBBBBBBBBBDDoo", "oOLppLLLLLLLLLBBBBBBBBBppDoo", "oOLLLMLLLLLLLLBBBBBBBBMBDDoo", "oOLLLLMMMMMMMMMMMMMMMMBBDDoo", ".oOLLLLLLLLLLLBBBBBBBBBBDoo.", ".oBBLLccccccccccccccccBBDDo.", "oBLBBccccccccccccccccccBDDDo", "oLLBBccccccccccccccccccBDDDo", "oLLLBBccccccccccccccccBBDDDo", ".oLLBBBccccccccccccccBBBDDo.", "..oBBBBBBBBBBBBBBBBBBBBBDo..", ".oLLBoooBBBBBBBBBBBBoooBDDo.", "oLLLLBo.oBBBBBBBBBBo.oBBDDDo", "owLwLwo..oooooooooo..owBwDwo", ".ooooo................ooooo.", "............................", "............................"], "acornet": ["..........oooooooo..........", "........ooobbbbbbooo........", "......oobbAbbAAbbAbboo......", ".....obAbbbAbbbbAbbbAbo.....", "oo..oAAAAAAAAAAAAAAAAAAo..oo", "oLo.oaaaaaaaaaaaaaaaaaao.oDo", "oHLooaaaaaaaaaaaaaaaaaaooDLo", "oLLoOooooooooooooooooooooDDo", ".ooOLHLLLLLLLLBBBBBBBBLBooo.", "..oOLHLLLLLLLLBBBBBBBBLBoo..", "..oOKKKKKLLLLLBBBBBKKKKKoo..", "..oOKKkkkKLLccccBBKkkkKKoo..", "..oOKKwkkKLccccccBKkkwKKoo..", "..oOKKkekKccccccccKkekKKoo..", "..oOLKKKKccccnnccccKKKKBoo..", "..oOLLcccccccnncccccccBBoo..", "..oOLLccccccMMMMccccccBBoo..", "...oOLccccccccccccccccBoo...", "....ooLLLLLLLLBBBBBBBBoo....", "...oLLooBBBBssssBBBBooBBo...", "..oLLLLoBBssssssssBBoBBBDo..", "..oLHLLoBBssssssssBBoBBLDo..", "..owwwLoBBssssssssBBoBwwwo..", "...oooooBBBssssssBBBooooo...", ".....oBBBBooooooooBBBBo.....", ".....oKKKo........oKKKo.....", ".....ooooo........ooooo.....", "............................"], "blinkit": ["....y..................y....", "...ygy................ygy...", "....oy................yo....", ".....o................o.....", "......o..oooooooooo..o......", ".......ooOLHHLBLLBooo.......", "......oOLHLLLLBBBBLBoo......", ".....oOLHLLLLLBBBBBLBoo.....", ".....oOLkkkLLLBBBkkkBoo.....", "oo...oOLkwkLLLBBBkwkBoo...oo", "oWWo.oOLkekLLLBBBkekBoo.oWWo", "oWVWooOLLLLLMLBMBBBBBoooWVWo", "oWVVWoOOLLLLLLBBBBBBoooWVVWo", ".oWVVWooLLLLLLBBBBBBooWVVWo.", "..oWVVWooBBBBBBBBBBooWVVWo..", "...oWVWoDBBBBBBBBBBDoWVWo...", "....oWWoDBBBBBBBBBBDoWWo....", ".....ooYYYYYYYYYYYYYYoo.....", "....oYyyyyyyyyyyyyyyyyYo....", "...oYyygggyyyyyyyygggyyYo...", "...oYyggggggyyyyggggggyYo...", "...oYyyggggyyyyyyggggyyYo...", "...oYYyyyyyyyyyyyyyyyyYYo...", "....oYYYyyyyyyyyyyyyYYYo....", ".....ooYYYYYYYYYYYYYYoo.....", ".......oooooooooooooo.......", "............................", "............................"], "craggle": ["................................", ".....oooo..............oooo.....", "...oojJJho............ohJJjoo...", "..ojhoooojo..........ojoooohjo..", ".ojho....ojo........ojo....ohjo.", ".ojo.....oho........oho.....ojo.", ".oho....ojho........ohjo....oho.", "..oho..ojho..........ohjo..oho..", "...ojjjjho..oooooooo..ohjjjjo...", "....oooooooOLHHLBLLBoooooooo....", "......ooOLHHLLLLBBBBLLBooo......", ".....oOLHLLLLLLLBBBBBBBLBoo.....", "....oOLHLLLLLLLLBBBBBBBBLBoo....", "....oOLLffffffffffffffffBBoo....", "....oOLfkkkffffffffffkkkfBoo....", "....oOLfwkkffffffffffkkwfBoo....", "....oOLfkekffffFFffffkekfBoo....", "....oOLffffffffFFffffffffBoo....", ".....oOffffffnnFFnnffffffoo.....", ".....oOfffffMMMMMMMMfffffoo.....", "......oOLLLLLLLLBBBBBBBBoo......", ".....oOLHLLLLLLLBBBBBBBLBoo.....", "....oOLHLLLLLLLLBBBBBBBBLBoo....", "...oOLHLLLLBBBBBBBBBBBBBBLBoo...", "...oLLLLLLBBBBBBBBBBBBBBBBBDo...", "...oLLLLBBBBBBBBBBBBBBBBBBBDo...", "....oLBBBBDDDDDDDDDDDDBBBBBo....", ".....oFFo..oFFFooFFFo..oFFo.....", ".....oFFo..oFFFooFFFo..oFFo.....", ".....oFFo..oFFFooFFFo..oFFo.....", ".....oKKo..oKKKooKKKo..oKKo.....", ".....oooo..oooooooooo..oooo....."], "yetini": ["................................", "......oooooooooooooooooooo......", "....ooHHHLLLLLLLBBBBBBBLLLoo....", "...oHHLLLLLLLLLLBBBBBBBBBBLLo...", "..oHLLLLLLLLLLLLBBBBBBBBBBBDLo..", "..oHLLLLLLLLLLLLBBBBBBBBBBBDLo..", ".oHLLLLffffffffffffffffffBBDDLo.", ".oHLLLffffffffffffffffffffBDDLo.", ".oHLLffkkkffffffffffffkkkffDDLo.", ".oHLLffwkkffffffffffffkkwffDDLo.", ".oHLLffkekffffffffffffkekffDDLo.", ".oHLLLffffffffnnnnffffffffBDDLo.", ".oHLLLfffffMMMMMMMMMMfffffBDDLo.", ".oHLLLffffMwMwMMMMwMwMffffBDDLo.", ".oHLLLLfffffMMMMMMMMfffffBBDDLo.", "..oHLLLLLLLLLLLLBBBBBBBBBBBDLo..", ".oHLLoooLLLLLLLLBBBBBBBBoooDDLo.", "oHLLLLLooLLccccccccccBBooBBDDDLo", "oHLLLLLLLoLccccccccccBoBBBBDDDLo", "oHLLLLLLLoLccccccccccBoBBBBDDDLo", "oLLBLLLLLoLccccccccccBoBBBBDDDDo", "oLBBBLLLLoLccccccccccBoBBBBDDDDo", ".owBwBwLLoLccccccccccBoBBwBwDwo.", "..oooooLLoLLccccccccBBoBBooooo..", ".......oLLLLLLLLBBBBBBBBo.......", "......oLLLLLooooooooBBBBBo......", "......oLLLLo........oBBBBo......", ".....oHLLLLo........oBBBBLo.....", "....oHLLLLLo........oBBBBBLo....", "....owLwLwLo........oBwBwBwo....", "....ooooooooo......ooooooooo....", "................................"], "gustling": ["................................", "..........oooooooooooo..........", ".........oHHLLLLBBBBLLo.........", "........oHLLLLLLBBBBBBLo........", ".......oHLLLLLLLBBBBBBBLo.......", "......oHLLLLLLLLBBBBBBBBLo......", "......oHLLLLLLLLBBBBBBBBLo......", ".....oOLLkkkLLLLBBBBkkkBBoo.....", ".....oOLLwkkLLLLBBBBkkwBBoo.....", ".....oOLLkekLLLyyBBBkekBBoo.....", ".....oOLLLLLLLyYYyBBBBBBBoo.....", ".....oOLLLLLLLLYYBBBBBBBBoo.....", "......oOLLccccLLBBccccBBoo......", "o.....oOLccccccccccccccBoo.....o", "oHo...oOLccccccccccccccBoo...oLo", "oHLo..oOLccsccccccccsccBoo..oDLo", "oHLLo.oOLccccsccccsccccBoo.oDDLo", "oHLLLooOLcsccccccccccscBoooDDDLo", ".oHLLLooLccccsccccsccccBooBDDLo.", ".oHLLLLooLccccccccccccBooBBDDLo.", "..oHLLLLooLccccccccccBooBBBDLo..", "..oHLLLLLooLccccccccBooBBBBDLo..", "...oHLLLLLooLLccccBBooBBBBBLo...", "....oHLLLLLooLLLBBBooBBBBBLo....", ".....oHLLLLLooLLBBooBBBBBLo.....", "......oooooooBBBBBBooooooo......", "..........oyYooooooYyo..........", "..........oyYo....oYyo..........", "..........oooo....oooo..........", "................................", "................................", "................................"], "burrowby": ["................................", "................................", ".........oooooooooooooo.........", ".......ooYYYYYYYYYYYYYYoo.......", "......oYYyyyyyyyyyyyyyyYYo......", "......oYyyyyyyyggyyyyyyyYo......", ".....oYyyyyyyyywwyyyyyyyyYo.....", "oooooooooooooooooooooooooooooooo", "...oo.oOLHHLLLLLBBBBBLLBoo.oo...", "..oLBooOLHLLLLLLBBBBBBLBoooDDo..", "..oBBoOLHLLLLLLLBBBBBBBLBooDDo..", "...ooOLLkkkLLLLLBBBBBkkkBBooo...", "....oOLLwkkLLLLLBBBBBkkwBBoo....", "....oOLLkekLLLccccBBBkekBBoo....", "....oOLLLLLLLccccccBBBBBBBoo....", "....oOLppLLLccnnnnccBBBppBoo....", "....oOLLLLLLcccMMcccBBBBBBoo....", "....oOLLLLLLLccccccBBBBBBBoo....", ".....oOLLLLLLLLLBBBBBBBBBoo.....", "...ooooLLLLLLLLLBBBBBBBBBoooo...", "..oLLLLoLLccccccccccccBBoBBDDo..", ".oLHLLLLoLccccccccccccBoBBBDLDo.", ".oLLLLLLoLccccccccccccBoBBBDDDo.", ".oLLLLLLoLccccccccccccBoBBBDDDo.", ".oLLLLLLoLLccccccccccBBoBBBDDDo.", "..oLLLLoLLLLccccccccBBBBoBBDDo..", "...oooooLLLLLLLLBBBBBBBBooooo...", ".....oLLLLLooooooooooBBBBBo.....", ".....oDDDDDo........oDDDDDo.....", ".....ooooooo........ooooooo.....", "................................", "................................"], "zenpeak": ["..........I..........I..........", ".........IKI........IKI.........", "........oIKIo......oIKIo........", "....I..oIKJKIo....oIKJKIo..I....", "...IKI.oKKJJKo....oKJJKKo.IKI...", "...oKJooKJJJJo....oJJJJKooJKo...", "...oKJJoooooooo..ooooooooJJKo...", "....ooOLHHHLLLLLBBBBBLLLBooo....", "...oOLHHLLLLLLLLBBBBBBBBLLBoo...", "..oOLHLLLLLLLLLLBBBBBBBBBBLDoo..", "..oOLHLLkkkkLLLLBBBBkkkkBBLDoo..", "..oOLLLLkwekLLLLBBBBkewkBBBDoo..", "..oOLLLLkeekLLLLBBBBkeekBBBDoo..", "..oOLLLLLkkLLLLLBBBBBkkBBBBDoo..", "..oOLLLLLLLLLLLLBBBBBBBBBBBDoo..", "..oOLLLLLLLLLLMMMMBBBBBBBBBDoo..", "...oOLLLLLLLLLMwwMBBBBBBBBBoo...", "....oOLLLLLLLLLLBBBBBBBBBBoo....", "..cc.ooLLLLLLLLLBBBBBBBBBoo.cc..", ".cCCc.oOLLccccccccccccBBoo.cCCc.", "cCWWCc.oOLccccccccccccBoo.cCWWCc", "cWWWWCcoOLccccccccccccBoocCWWWWc", "cWWWWWCooLccccccccccccBooCWWWWWc", ".cCWWWCcoLLccccccccccBBocCWWWCc.", "..cccCCcoLLLccccccccBBBocCCccc..", ".......oLLLLLLLLBBBBBBBBo.......", ".......oLLLooooooooooBBBo.......", "......oLLLo..........oBBBo......", ".....oHLLLo..........oBBBLo.....", ".....owLwLo..........oBwBwo.....", ".....ooooooo........ooooooo.....", "................................"], "scr_forest": ["............................", "...o.o................o.o...", "..oGoGo..............oGoGo..", "..oGgGo..oo......oo..oGgGo..", "...oGo..oGGo....oGGo..oGo...", "....oo.oGgGo....oGgGo.oo....", ".....oooooooooooooooooo.....", "....oqqqqqqqqqqqqqqqqqqo....", "...oqQQQQqqqqqqqqqqQQQQqo...", "..oqQQQQQQqqqqqqqqQQQQQQqo..", "..oqQeeeQQqqqqqqqqQQeeeQqo..", "..oqQewkeQqqqqqqqqQekweQqo..", "..oqQeeeeQqqqqqqqqQeeeeQqo..", "..oqQQQQQQqqqqqqqqQQQQQQqo..", "oooqQQkkkkkkkkkkkkkkkkQQqooo", "oGoqQQktktktkttktktktkQQqoGo", "oGGoqQkGGkkkkkkkkkkGGkQqoGGo", ".oGoqQktktktkttktktktkQqoGo.", "..ooqQQkkkkkkkkkkkkkkQQqoo..", "...oqQQQQqqqqqqqqqqQQQQqo...", "..oGoqQQQqqqqqqqqqqQQQqoGo..", ".oGGooqqqqqqqqqqqqqqqqooGGo.", "..oo..oqqqooooooooqqqo..oo..", ".....oGgo..........ogGo.....", ".....oooo..........oooo.....", "............................", "............................", "............................"], "scr_peak": ["................................", "..o..........................o..", ".oJo........................oJo.", ".oJJo......................oJJo.", "..oJJo....................oJJo..", "...oJJooooooooooooooooooooJJo...", "....oRRRRRRRRRRRRRRRRRRRRRRo....", "...oRrrrrrrrrrrrrrrrrrrrrrrRo...", "..oRrPPrrrrrrrrrrrrrrrrrrPPrRo..", "..oRrPrrrrrrrrrrrrrrrrrrrrPrRo..", ".oRrrreeeerrrrrrrrrrrreeeerrrRo.", ".oRrrewkeeerrrrrrrrrreeekwerrRo.", ".oRrrreeeerrrrrrrrrrrreeeerrrRo.", ".oRrrrrrrrrrrrrrrrrrrrrrrrrrrRo.", "oRRrrkkkkkkkkkkkkkkkkkkkkkkrrRRo", "oRrrrktktktktktkktktktktktkrrrRo", "oRrrrkkkkkJJJkkkkkkJJJkkkkkrrrRo", "oRrrrktktktktktkktktktktktkrrrRo", ".oRrrkkkkkkkkkkkkkkkkkkkkkkrrRo.", ".oRRrrrrrrrrrrrrrrrrrrrrrrrrRRo.", "..oRRrrrrrrrrrrrrrrrrrrrrrrRRo..", ".oRrRRrrrrrrrrrrrrrrrrrrrrRRrRo.", "oRrrroRRRRRRRRRRRRRRRRRRRRorrrRo", "oRrProooooooooooooooooooooorPrRo", "oRrrro....................orrrRo", ".ooooo....................ooooo.", "....oRrrRo............oRrrRo....", "...oRrrrRRo..........oRRrrrRo...", "...oJoJoJoo..........ooJoJoJo...", "...ooooooooo........ooooooooo...", "................................", "................................"]}, "pal": {"mossling": {"o": "#1e2414", "O": "#4a3a24", "X": "#4a3220", "D": "#6a4a2a", "B": "#8a6438", "L": "#ac8250", "H": "#c8a070", "g": "#4a8a3a", "G": "#74b04e", "q": "#2e5a26", "r": "#c8443a", "R": "#8a2a24", "s": "#f6ecd8", "c": "#e8d4b0", "k": "#1a120a", "w": "#ffffff", "e": "#5a3a18", "n": "#2a1a10", "M": "#6a2a2a", "p": "#e8908a"}, "fernix": {"o": "#1a2a1a", "O": "#3a5a32", "X": "#2e5a2e", "D": "#3e6a3a", "B": "#5a8e4a", "L": "#7cb060", "H": "#a8d08a", "c": "#e6eccc", "s": "#b4c890", "y": "#e8b048", "Y": "#b07a20", "k": "#14140a", "w": "#ffffff", "e": "#f0c040", "r": "#f4f0d8"}, "shroomie": {"o": "#1a2e22", "O": "#3a5a44", "X": "#2a5a40", "D": "#3a7a5a", "B": "#58a878", "L": "#7cc896", "H": "#a8e4b8", "r": "#d8603a", "R": "#9a3a22", "s": "#f8ecd4", "c": "#eef2d6", "k": "#0e1a12", "w": "#ffffff", "e": "#e8c040", "M": "#3a1a1a", "p": "#f0a0a0"}, "acornet": {"o": "#1a1a24", "O": "#3a3a4a", "X": "#3a3a48", "D": "#4a4a5a", "B": "#6e6e80", "L": "#9494a6", "H": "#bcbccc", "K": "#2a2a36", "c": "#eeeef4", "a": "#8a5a2a", "A": "#5a3a1a", "b": "#c49a5a", "s": "#d0d0dc", "k": "#0e0e14", "w": "#ffffff", "e": "#5a3a1a", "n": "#1a1a1a", "M": "#5a2a2a"}, "blinkit": {"o": "#12122a", "O": "#2a2a4e", "X": "#22224a", "D": "#2e2e5a", "B": "#44447a", "L": "#5e5ea0", "H": "#8a8ac8", "W": "#d8f0fa", "V": "#8ab0d0", "y": "#f6e870", "Y": "#d8a828", "g": "#fffbd0", "k": "#0a0a18", "w": "#ffffff", "e": "#6ae0d8", "M": "#3a1a3a"}, "craggle": {"o": "#2a2420", "O": "#6a6052", "X": "#7a7266", "D": "#a8a094", "B": "#ccc4b4", "L": "#e6e0d2", "H": "#f8f6ee", "f": "#a89480", "F": "#7a6a5a", "h": "#d8b880", "j": "#8a6a3a", "J": "#f0dcae", "k": "#1a120a", "w": "#ffffff", "e": "#c89a3a", "n": "#3a2a20", "M": "#5a2a2a", "K": "#3a3030"}, "yetini": {"o": "#1e2a44", "O": "#4a5a7a", "X": "#a8b8d0", "D": "#c4d2e4", "B": "#dce6f2", "L": "#eef4fa", "H": "#ffffff", "f": "#8ab4e0", "k": "#0e1a2a", "w": "#ffffff", "e": "#3a7ac8", "n": "#2a3a5a", "M": "#3a1a4a", "c": "#c8daf0"}, "gustling": {"o": "#1e1a2e", "O": "#4a4466", "X": "#5a5478", "D": "#7a7498", "B": "#9a94b8", "L": "#b8b4d4", "H": "#e0dcf0", "c": "#f4f0e6", "s": "#c8c0b0", "y": "#f0b83a", "Y": "#b07a18", "k": "#0e0a18", "w": "#ffffff", "e": "#e0a830"}, "burrowby": {"o": "#2a1c10", "O": "#5a3e24", "X": "#6a4a2a", "D": "#8a6440", "B": "#ac8258", "L": "#c8a070", "H": "#e0c08e", "c": "#f0dcb8", "y": "#f0c840", "Y": "#a8781a", "g": "#fff6c0", "w": "#ffffff", "k": "#120a04", "e": "#3a2410", "n": "#2a1a10", "M": "#5a2a2a", "p": "#e8908a"}, "zenpeak": {"o": "#141a3a", "O": "#2e3a6a", "X": "#3a4a88", "D": "#4a5ea8", "B": "#6a80c8", "L": "#8ea4e4", "H": "#c0d0f8", "K": "#9af0ff", "J": "#3aa0d0", "I": "#e6fcff", "c": "#e8eef8", "C": "#c0cce8", "W": "#ffffff", "k": "#0a0e24", "w": "#ffffff", "e": "#9af0ff", "M": "#2a1040"}, "scr_forest": {"o": "#0e1a0e", "q": "#2a3a22", "Q": "#3e5430", "g": "#7ad04a", "G": "#b8f07a", "e": "#f0e05a", "w": "#ffffff", "k": "#0a0e06", "t": "#e8f0d8"}, "scr_peak": {"o": "#120e1a", "R": "#3a3448", "r": "#56506a", "P": "#7a7496", "J": "#5ad0f0", "e": "#ff5a4a", "w": "#ffffff", "k": "#0a0810", "t": "#e8e4f0"}}};
/* ================= V7: worlds 2-3, players, pixel UI, economy ================= */
(()=>{const W=WDATA;
 const keys=['mossling','fernix','shroomie','acornet','blinkit','craggle','yetini','gustling','burrowby','zenpeak'];
 keys.forEach(k=>{KKDATA.order.push(k);KKDATA.spr[k]=W.spr[k];KKDATA.pal[k]=W.pal[k]});
 Object.assign(TYPES,{Moss:'#8aa04a',Bloom:'#5ab06a',Spore:'#d8703a',Wood:'#a8844a',Glow:'#e8d84a',Peak:'#b8aa90',Snow:'#c8dcf0',Wind:'#9a94c8',Earth:'#b08050'});
 SPECIES.push(
  {n:['Mossling','Mossmane','Mossgrove'],t:'Moss',fl:'Grows a tiny garden on its back.'},
  {n:['Fernix','Fernwing','Fernoracle'],t:'Bloom',fl:'Hoots softly to wake up sleepy flowers.'},
  {n:['Shroomie','Shroomhop','Shroomancer'],t:'Spore',fl:'Its cap glows a little after it rains.'},
  {n:['Acornet','Acornox','Oakaroth'],t:'Wood',fl:'Wears an acorn as a helmet. Very brave.'},
  {n:['Blinkit','Blinkern','Blinktorch'],t:'Glow',fl:'Lights the forest path for lost travelers.'},
  {n:['Craggle','Cragghorn','Craggolith'],t:'Peak',fl:'Can climb straight up a cliff.'},
  {n:['Yetini','Yetimbo','Yetitan'],t:'Snow',fl:'Gives the biggest, fluffiest hugs.'},
  {n:['Gustling','Gustalon','Galeagle'],t:'Wind',fl:'Rides storms above the highest peaks.'},
  {n:['Burrowby','Burrowcap','Burrowking'],t:'Earth',fl:'Digs tunnels to find shiny gems.'},
  {n:['Zenpeak','Zenpeakor','Zenithar'],t:'Legend',fl:'The guardian at the top of the world.'});
 EVO.push([['crest'],['crown','aura']],[['horns'],['wings','aura']],[['crest'],['crown','aura']],[['horns'],['horns','crest','aura']],[['crest'],['wings','crown','aura']],
  [['crest'],['crown','aura']],[['horns'],['horns','aura']],[['crest'],['crown','aura']],[['horns'],['crown','aura']],[['horns'],['crown','wings','aura']]);
 REGIONS.push({name:'Whispering Woods',color:'#4f8a4a',desc:'Long words, names and punctuation.'},{name:'Thunder Peaks',color:'#8a94b8',desc:'Numbers, symbols and big stories.'});
 LESSONS.push({k:'',sp:'long',r:5,t:'Long Words'},{k:'',sp:'names',r:5,t:'Big Names'},{k:'',sp:'punct',r:5,t:'Punctuation'},{k:'',sp:'speedy',r:5,t:'Speed Run'},{k:'',sp:'story',r:5,t:'Forest Story'},
  {k:'',sp:'numw',r:6,t:'Numbers Mix'},{k:'',sp:'symb',r:6,t:'Symbols'},{k:'',sp:'quote',r:6,t:'Quotes'},{k:'',sp:'tricky',r:6,t:'Tricky Words'},{k:'',sp:'summit',r:6,t:'Summit Challenge'});
})();
TOTAL=LESSONS.length*3;
const WORLDS=[{name:'Keyloria',from:0},{name:'Whispering Woods',from:5},{name:'Thunder Peaks',from:6}];
const worldOf=i=>{if(window.SEQW&&i>=0&&LESSONS[i])return SEQW(i);let w=1;for(let k=1;k<WSTART.length;k++)if(i>=WSTART[k])w=k+1;return w};
/* ---- text for new worlds ---- */
const W2={long:'forest branch acorns mossy river stones bridge shadow beetle squirrel mushroom whisper lantern campfire feather thunder blanket rainbow pinecone sparkle journey keyloria trainer monster crystal captain blizzard mountain glacier canyon summit meadow harvest pebble ladder planet rocket tadpole leaflet hollow'.split(' '),
 names:['Pop','Sproutle','Mossling','Fernix','Blinkit','Monday','Friday','Daisy','Sunday','Maple','Luna','Max','Ruby','Leo','Mia','Sam','Forest','River','Oakaroth','Shroomie'],
 punct:['Wow, look at that!','Can you see the owl?','Run, Pop, run!','Where did it go?','Yes! We did it!','Is it a gold one?','Hey, wait for me!','Oh no, a Scrambler!','Look up, there!','Ready, set, go!'],
 story:['Pop walked into the woods.','The trees were tall and green.','A tiny Keylori hid under a leaf.','Pop said hello, and it smiled.','They played until the sun went down.','The owls began to hoot.','A firefly lit the path home.'],
 numw:['We found 25 acorns.','The bridge is 100 steps long.','Pop climbed 3 big hills.','It is 7 degrees today.','We saw 12 eagles.','The peak is 4000 meters high.','I have 2 gold cards.'],
 symb:['Pop is #1!','I have $5.','We are 50% done!','Leo & Pop','Wow!!','3 + 4 = 7','Cost: $10','Win @ noon','#keyloria','Yes & no!'],
 quote:['"Hi!" said Pop.',"It's a gold one!","Don't give up.",'"Run!" yelled Leo.',"We're almost there.","I can't wait!",'"Look," said Mia.',"That's my Keylori!"],
 tricky:'because friend beautiful people through thought enough favorite different together answer question believe surprise special library February Wednesday knight island minute climb'.split(' '),
 summit:['The wind was cold at the top of Thunder Peaks.','"We made it!" shouted Pop, and the Keylori cheered.',"It's 3,000 steps to the summit, and we climbed every one!",'A golden eagle flew past the clouds.','Zenpeak watched over all of Keyloria.']};
const _genText=genText;
genText=function(i,s,practice){if(i<20||practice)return _genText(Math.min(i,19),s,practice);
 const L=LESSONS[i],len=Math.round(([14,22,30][s]+i*[.6,1.2,1.8][s])*S.set.len*(isBoss(i,s)?1.25:1));
 switch(L.sp){case 'long':return fillWords(s===0?W2.long.filter(w=>w.length<=6):W2.long,len);
  case 'names':return fillWords(s===0?W2.names.slice(0,10):W2.names,len);
  case 'punct':return fillSent(W2.punct,len);case 'speedy':return fillSent(SENT,len);
  case 'story':return W2.story.slice(0,Math.max(2,Math.ceil(len/28))).join(' ');
  case 'numw':return fillSent(W2.numw,len);case 'symb':return fillSent(W2.symb,len);case 'quote':return fillSent(W2.quote,len);
  case 'tricky':return fillWords(s===0?W2.tricky.slice(0,10):W2.tricky,len);
  default:return fillSent(W2.summit,len)}};
const SHIFTMAP={'{':'[','}':']','|':'\\','~':'`','!':'1','@':'2','#':'3','$':'4','%':'5','^':'6','&':'7','*':'8','(':'9',')':'0','_':'-','+':'=','?':'/','"':"'",':':';','<':',','>':'.'};
function keyInfo(ch){
 let base=ch===' '?'space':ch.toLowerCase(),up=/[A-Z]/.test(ch);if(SHIFTMAP[ch]){base=SHIFTMAP[ch];up=true}
 const f=fingerOf(base),r={keys:[base],fingers:[f],f};
 if(up){const sh=f[0]==='l'?'shiftR':'shiftL';r.keys.push(sh);r.fingers.push(sh==='shiftR'?'rp':'lp');r.shift=sh==='shiftR'?'rp':'lp'}
 return r}
/* ---- sprites: generalized evolutions, fit mode, world villains ---- */
function evolved(i,f,tier){
 const D=KKDATA,k=D.order[i],rows=D.spr[k],w=rows[0].length,pal=tierPal(D.pal[k],tier),Wd=w+16,H=w+8,ox=8,oy=8;
 const c=document.createElement('canvas');c.width=Wd;c.height=H;const g=c.getContext('2d');
 const put=(x,y,col)=>{if(col){g.fillStyle=col;g.fillRect(x,y,1,1)}};
 const draw=(r,x0,y0,p,flip)=>r.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch!=='.')put(flip?x0+row.length-1-x:x0+x,y0+y,p[ch])}));
 let X0=w,X1=0,Y0=w;rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'){X0=Math.min(X0,x);X1=Math.max(X1,x);Y0=Math.min(Y0,y)}}));
 const cx=Math.round((X0+X1)/2),feats=f===0?[]:EVO[i][f-1],gp=Object.assign({y:'#f6d050',Y:'#c8981e',r:'#e84a6a'},pal);
 if(feats.includes('aura')){const ring=tier==='diamond'?'#bfe2f6':tier==='gold'?'#f6dc7a':pal.L||'#ffffff';g.globalAlpha=.55;
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.')[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].forEach(([a,b])=>{const q=rows[y+b];if(!q||q[x+a]===undefined||q[x+a]==='.')put(ox+x+a,oy+y+b,ring)})}));g.globalAlpha=1}
 if(feats.includes('wings')){const A=kAnchor(k),wr=Math.round((Y0+w*.58)/2)+2;let xl=99,xr=-1;for(let y=wr;y<=wr+5;y++){const r=rows[y]||'';for(let x=0;x<r.length;x++)if(r[x]!=='.'){xl=Math.min(xl,x);xr=Math.max(xr,x)}}if(xr<0){xl=X0;xr=X1}
  if(xl>A.hx-3)xl=X0;if(xr<A.hx+3)xr=X1;draw(OVL.wing,ox+xl-7,oy+wr,pal,false);draw(OVL.wing,ox+xr,oy+wr,pal,true)}
 draw(rows,ox,oy,pal,false);
 if(feats.includes('horns')){const hw=Math.max(2,Math.min(6,Math.floor((AN.hr-AN.hl)/2)-2)),xa=cx-hw-1,xb=cx+hw-1;const hp={o:pal.o||'#1b1626',H:'#fff6e0',L:'#e8d4a8',B:'#b8946a'};draw(OVL.horn,ox+xa,oy+AN.top(xa+1)-3,hp,false);draw(OVL.horn,ox+xb,oy+AN.top(xb+1)-3,hp,true)}
 if(feats.includes('crest')){let [hh,ss]=hex2hsl(TYPES[SPECIES[i].t]||'#e8584f');if(hh>280&&hh<345)hh=8;const cp={o:pal.o||'#1b1626',H:hsl2hex(hh,Math.min(.75,ss),.72),L:hsl2hex(hh,Math.min(.75,ss),.55),B:hsl2hex(hh,Math.min(.75,ss),.38)};draw(OVL.crest,ox+cx-2,oy+AN.med2(cx-1,cx+1)-2,cp,false)}
 if(feats.includes('crown'))draw(OVL.crown,ox+cx-6,oy+AN.med2(cx-3,cx+3)-3,gp,false);
 if(f===2||tier){const sp=tier==='diamond'?['#ffffff','#bfe2f6']:['#fff4c8','#f6d050'];[[2,3],[Wd-4,6],[1,H-12],[Wd-2,H-8],[Wd-10,1]].forEach(([x,y])=>{put(x,y,sp[0]);put(x-1,y,sp[1]);put(x+1,y,sp[1]);put(x,y-1,sp[1]);put(x,y+1,sp[1])})}
 return c}
/* store sprites already blown up with hard pixel edges, so they stay crisp even if the browser smooths a scaled image (zoom, 125% screens) */
function upPx(c,n){const o=document.createElement('canvas');o.width=c.width*n;o.height=c.height*n;const g=o.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(c,0,0,o.width,o.height);return o}
function creatureSVG(i,form,cls='',tier){const k=KKDATA.order[i],w=KKDATA.spr[k][0].length,Wd=w+16,H=w+8,s=[.6,.8,1][form],fit=/\bfit\b/.test(cls);
 const unit=fit?Math.min(5,200/Wd/1)*(w/24>1?24/w*1.05:1):5,iw=Wd*unit*s,ih=H*unit*s,u=kku('e'+i+'-'+form+(tier||''),()=>evolved(i,form,tier));
 const y=fit?(200-ih)/2+ih*.06:200-ih;
 return `<svg class="cr ${cls} ${tier||''}" viewBox="0 0 200 200" aria-hidden="true" style="overflow:visible"><image href="${u}" x="${(200-iw)/2}" y="${y}" width="${iw}" height="${ih}"/></svg>`}
function vcanvas(key,king){const rows=WDATA.spr[key],pal=WDATA.pal[key],w=rows[0].length,c=document.createElement('canvas');c.width=w;c.height=w;const g=c.getContext('2d');
 rows.forEach((r,y)=>[...r].forEach((ch,x)=>{const col=pal[ch];if(col){g.fillStyle=col;g.fillRect(x,y,1,1)}}));
 if(king){const cr=KKDATA.acc.crown;cr.rows.forEach((r,y)=>[...r].forEach((ch,x)=>{const col=cr.pal[ch];if(col){g.fillStyle=col;g.fillRect(Math.round(w/2-6)+x,y,1,1)}}))}return c}
function villainByWorld(world,v,king){if(world===1)return glitchSVG(v,king);const key=world===2?'scr_forest':'scr_peak',w=world===2?28:32,sz=200*w/24;
 return `<svg class="gl" viewBox="0 0 200 200" aria-hidden="true" style="overflow:visible"><image href="${kku('v'+key+king,()=>vcanvas(key,king))}" x="${(200-sz)/2}" y="${200-sz}" width="${sz}" height="${sz}"/></svg>`}
let villainSVG=(i,boss)=>villainByWorld(worldOf(i),i%5,boss&&(i>=15&&i<20||isBoss(i,2)&&i%5===4));
let villainArc=(v,king)=>villainByWorld(worldOf((typeof G!=='undefined'&&G.i)||0),v,king);
let villainName=(i,boss)=>boss?(i===LESSONS.length-1?'Scrambler King':'Mega Scrambler'):['Scrambler','Thorn Scrambler','Rock Scrambler'][worldOf(i)-1];
/* ---- forest & mountain scenes ---- */
function worldField(kind,w=256,h=72){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),P=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)},R=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(x,y,a,b)};
 const F=kind==='forest',G=F?['#22381e','#2e4a28','#3a5a30','#4a6e3a','#6a8a4a']:['#3a3440','#5a5462','#6e6878','#8a8494','#c8c4d0'];
 R(0,0,w,h,G[2]);
 for(let ty=0;ty<h;ty+=12)for(let tx=0;tx<w;tx+=12){const s=(tx*7+ty*13)%5;if(F){P(tx+3,ty+5,G[0]);P(tx+5,ty+5,G[0]);P(tx+4,ty+4,G[3]);if(s===1)P(tx+8,ty+8,G[4])}else{R(tx+2+s,ty+3,3,2,G[1]);P(tx+2+s,ty+3,G[3]);if(s===2)R(tx+7,ty+7,2,1,'#ffffff')}}
 const PD=F?'#5a4228':'#4a4450',PB=F?'#8a6a40':'#7a7484',PL=F?'#a8885a':'#9a94a4';
 for(let x=0;x<w;x++){const y0=Math.round(46+5*Math.sin(x/20));R(x,y0,1,14,PB);P(x,y0,PD);P(x,y0+13,PD);if(x%6===0)P(x,y0+4+(x*7)%8,PL)}
 if(F){const tree=(x,y)=>{const m=["....oooooo....","..ooLLLLBBoo..",".oLLHLLLBBBBo.","oLLHLLLBBBBDDo","oLLLLLBBBBDDDo","oLLLBBBBBDDDDo",".oLBBBBDDDDDo.","..ooDDDDDDoo..","....ootto.....","....otTto.....","....otTto.....","...ootTtoo...."];
   m.forEach((r,j)=>[...r].forEach((ch,i)=>{const col={o:'#14240f',H:'#8ab858',L:'#5a8a3e',B:'#3e6a2e',D:'#2a4a20',t:'#6a4a2a',T:'#4a321c'}[ch];if(col)P(x+i,y+j,col)}))};
  const shroom=(x,y)=>{["oooo","orsr","oooo",".oo."].forEach((r,j)=>[...r].forEach((ch,i)=>{const col={o:'#3a1a10',r:'#c8443a',s:'#f6ecd8'}[ch];if(col)P(x+i,y+j,col)}))};
  [[2,2],[40,0],[90,4],[150,0],[200,3],[236,8],[120,26],[18,28]].forEach(([x,y])=>tree(x,y));[[70,30],[180,34],[60,64],[220,64]].forEach(([x,y])=>shroom(x,y))}
 else{const peak=(x,y)=>{["......oo......",".....oSSo.....","....oSSSSo....","...oSSLLSSo...","...oLLLLBBo...","..oLLLLLBBBo..",".oLLLLLBBBBDo.","oLLLLLBBBBDDDo","oooooooooooooo"].forEach((r,j)=>[...r].forEach((ch,i)=>{const col={o:'#2a2632',S:'#ffffff',L:'#9a94a4',B:'#7a7484',D:'#5a5462'}[ch];if(col)P(x+i,y+j,col)}))};
  const pine=(x,y)=>{["...oo...","..oGGo..",".oGGGGo.","..oGGo..",".oGGGGo.","oGGGGGGo","oooTTooo","...TT..."].forEach((r,j)=>[...r].forEach((ch,i)=>{const col={o:'#14241a',G:'#2e5a3e',T:'#4a321c'}[ch];if(col)P(x+i,y+j,col)}))};
  [[4,6],[50,2],[110,8],[170,2],[226,6]].forEach(([x,y])=>peak(x,y));[[30,24],[86,28],[140,22],[200,30],[244,26],[16,62],[160,62]].forEach(([x,y])=>pine(x,y))}
 return c}
function sceneSVG(c){const idx=REGIONS.findIndex(r=>r.color===c);let u;
 if(idx===5||idx===6){const k=idx===5?'forest':'mountain';u=kku('wf'+k,()=>worldField(k))}else{const kind=['meadow','cave','volcano','sky','star'][idx]||'meadow';u=kku('f'+kind,()=>KK.field(kind))}
 return `<svg class="scene" viewBox="0 0 256 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${u}" width="256" height="72"/></svg>`}
/* ---- pixel icons ---- */
const PXI={
 gear:{p:{o:'#1e1a2a',L:'#d8d0e8',B:'#a89cc0'},r:["....oooo....","..o.oLLo.o..",".oLooLLooLo.","..oLLLLLLo..","ooLLLooLLLoo","oLLLo..oLLBo","oLLLo..oLBBo","ooLLLooLBBoo","..oLLLBBBo..",".oLooBBooBo.","..o.oBBo.o..","....oooo...."]},
 back:{p:{o:'#1e1a2a',L:'#efe6d8'},r:[".....oo.....","....oLo.....","...oLLo.....","..oLLLoooooo",".oLLLLLLLLLo","oLLLLLLLLLLo","oLLLLLLLLLLo",".oLLLLLLLLLo","..oLLLoooooo","...oLLo.....","....oLo.....",".....oo....."]},
 sound:{p:{o:'#1e1a2a',L:'#efe6d8'},r:["............",".....o...o..","....oLo...o.","...oLLo.o..o","oooLLLo..o.o","oLLLLLo..o.o","oLLLLLo..o.o","oooLLLo..o.o","...oLLo.o..o","....oLo...o.",".....o...o..","............"]},
 mute:{p:{o:'#1e1a2a',L:'#efe6d8',r:'#e8584f'},r:["............",".....o......","....oLo.....","...oLLor...r","oooLLLo.r.r.","oLLLLLo..r..","oLLLLLo..r..","oooLLLo.r.r.","...oLLor...r","....oLo.....",".....o......","............"]},
 say:{p:{o:'#1e1a2a',L:'#efe6d8',k:'#6a5a80'},r:["............",".oooooooooo.","oLLLLLLLLLLo","oLkkkkkkkLLo","oLLLLLLLLLLo","oLkkkkkLLLLo","oLLLLLLLLLLo",".ooLoooooooo","..oLo.......","..oo........","............","............"]},
 gem:{p:{o:'#1a3a5a',C:'#5ac8e0',c:'#c8f8ff'},r:["..oooooo..",".oCcCCcCo.","oCcCCCCcCo","oooooooooo","oCCCCCCCCo",".oCCCCCCo.","..oCCCCo..","...oCCo...","....oo....",".........."]},
 lock:{p:{o:'#1e1a2a',L:'#b8a9c9',Y:'#7a6a92'},r:["...oooo...","..oLooLo..","..oo..oo..",".oooooooo.",".oLLLLLLo.",".oLLooLLo.",".oLLooLLo.",".oLLLLLLo.",".oYYYYYYo.",".oooooooo."]},
 star:{p:{o:'#6a4200',y:'#f6d050',Y:'#c8981e'},r:[".....o.....","....oyo....","....oyo....","ooooyyyoooo","oyyyyyyyyyo",".oyyyyyyyo.","..oyyyyYo..","..oyyoyYo..",".oyyo.oYYo.",".oyo...oYo.",".oo.....oo."]}};
const PXU={};function pxIcon(n,cls=''){const d=PXI[n],h=d.r.length,w=d.r[0].length;if(!PXU[n]){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');d.r.forEach((r,y)=>[...r].forEach((ch,x)=>{if(d.p[ch]){g.fillStyle=d.p[ch];g.fillRect(x,y,1,1)}}));PXU[n]=c.toDataURL()}
 return `<svg ${cls?`class="${cls}"`:''} viewBox="0 0 ${w} ${h}"><image href="${PXU[n]}" width="${w}" height="${h}"/></svg>`}
['gear','back','sound','mute','say','gem','star'].forEach(n=>ICON[n]=pxIcon(n));ICON.lock=pxIcon('lock','lock');
const EGG=[".....oooo.....","....oHHcco....","...oHcccccco..","..oHccycccccs.","..oHcyyyccccso",".oHccyccccccso",".occcccccppcso",".occcccccppcso",".occtcccccccso",".occtttccccsso",".occcttcccccso","..occccccccso.","..occccccssso.","...osscccsso..","....oooooo....",".............."];
function eggSVG(w){const key='egg'+w;if(!PXU[key]){const c=document.createElement('canvas');c.width=14;c.height=16;const g=c.getContext('2d'),pal={o:'#3a2a20',c:'#fbf2dc',H:'#ffffff',s:'#e0cfa8',y:'#f6d050',p:'#f0a0b8',t:'#6ac8d8'};
 EGG.forEach((r,y)=>[...r].forEach((ch,x)=>{const col=pal[ch];if(col){g.fillStyle=col;g.fillRect(x,y,1,1)}}));g.fillStyle='#3a2a20';
 if(w>=1)[[2,8],[3,7],[4,8],[5,7],[6,8]].forEach(([x,y])=>g.fillRect(x,y,1,1));if(w>=2)[[8,5],[9,6],[10,5],[11,6]].forEach(([x,y])=>g.fillRect(x,y,1,1));PXU[key]=c.toDataURL()}
 return `<svg class="egg" viewBox="0 0 14 16"><image href="${PXU[key]}" width="14" height="16"/></svg>`}
/* ---- players ---- */
const PKEY='kk-profiles';let PROF={list:['p1'],cur:'p1'};const pkey=id=>LS_KEY+'-'+id;
function load(){try{const ix=JSON.parse(localStorage.getItem(PKEY)||'null');if(ix&&ix.list&&ix.list.length)PROF=ix;else{const old=localStorage.getItem(LS_KEY);if(old)localStorage.setItem(pkey('p1'),old);localStorage.setItem(PKEY,JSON.stringify(PROF))}}catch(e){}
 try{const r=localStorage.getItem(pkey(PROF.cur));S=Object.assign(structuredClone(DEF),r?JSON.parse(r):{})}catch(e){S=structuredClone(DEF)}
 S.set=Object.assign({},DEF.set,S.set);S.egg=Object.assign({},DEF.egg,S.egg);S.arc=Object.assign({},DEF.arc,S.arc);
 Object.values(S.cards).forEach(c=>{if(c.shiny&&!c.tier)c.tier='gold';delete c.shiny})}
function save(){try{localStorage.setItem(pkey(PROF.cur),JSON.stringify(S));localStorage.setItem(PKEY,JSON.stringify(PROF))}catch(e){}}
function peek(id){try{return JSON.parse(localStorage.getItem(pkey(id))||'{}')}catch(e){return {}}}
ACT.players=()=>{save();modal(`<h2>Who is playing?</h2><div class="players">${PROF.list.map(id=>{const d=id===PROF.cur?S:peek(id);return `<button class="pl ${id===PROF.cur?'on':''}" data-act="pickPlayer" data-id="${id}">${zookSVG(d.equip||{},d.hero||'pop',d.color||null)}<b>${esc(d.name||'New player')}</b><small>Level ${levelOf(d.xp||0)}</small></button>`}).join('')}
 <button class="pl add" data-act="newPlayer"><span>+</span><b>New player</b></button></div><button class="btn alt" data-act="close">Close</button>`)};
ACT.pickPlayer=d=>{save();PROF.cur=d.id;try{localStorage.setItem(PKEY,JSON.stringify(PROF))}catch(e){}load();save();closeModal();show('home');sfx.click()};
ACT.newPlayer=()=>{save();const id='p'+Date.now();PROF.list.push(id);PROF.cur=id;S=structuredClone(DEF);save();load();closeModal();show('home');setTimeout(()=>$('#nm')?.focus(),60)};
ACT.reset2=()=>{try{localStorage.removeItem(pkey(PROF.cur))}catch(e){}load();closeModal();show('home');toast('Progress reset')};
/* ---- economy: harder closet ---- */
Object.values(ACC).forEach(a=>a.cost*=4);
/* ---- binder viewer: switch forms, holo thumbs ---- */
ACT.card=d=>{const [i,f]=d.k.split('-').map(Number),cd=S.cards[d.k]||{},b=f+1;
 const rar=cd.tier==='diamond'?['Diamond','dia','Super rare! 1 in 40']:cd.tier==='gold'?['Gold','gold','Rare! 1 in 8']:['Normal','norm','Find a gold or diamond one!'];
 const forms=[0,1,2].map(x=>{const o=S.cards[i+'-'+x];return o?`<button class="fthumb ${x===f?'on':''} ${o.holo?'holo':''} ${o.tier||''}" data-act="card" data-k="${i}-${x}">${creatureSVG(i,x,'fit',o.tier)}<small>${['Hatchling','Champion','Mythic'][x]}</small></button>`:`<div class="fthumb"><span>?</span><small>${['Hatchling','Champion','Mythic'][x]}</small></div>`}).join('');
 modal(`<div class="bigcard">${cardHTML(i,f,cd)}</div>
 <div class="rbadges"><span class="rb ${rar[1]}">${rar[0]}</span>${cd.holo?'<span class="rb holo">Holo</span>':''}<span class="rb">${'★'.repeat(b)}${'☆'.repeat(3-b)}</span></div>
 <p class="muted" style="margin:0">${rar[2]}</p><div class="forms">${forms}</div><button class="btn" data-act="close">Close</button>`)};
function worldHead(r){const wi=r===0?0:r===5?1:2,first=r===0?0:r===5?60:75,open=unlocked(first);
 return `<div class="worldhead w${wi+1} ${open?'':'shut'}"><span>World ${wi+1}</span><h3>${WORLDS[wi].name}</h3>${open?'':`<p>${ICON.lock} Finish World ${wi} to open!</p>`}</div>`}

/* ---- pixel meteor ---- */
const METEOR=["....oooo....","..ooRRRroo..",".oRrRRRRRro.",".orRRdRRRRo.","oRRRRRRdRRDo","oRrRRRRRRRDo","oRRRdRRRRDDo","oRRRRRRRDDDo",".oRRRRRDDDo.",".oDRRRDDDDo.","..ooDDDDoo..","....oooo...."];
function meteorURL(){if(!PXU.met){const c=document.createElement('canvas');c.width=12;c.height=12;const g=c.getContext('2d'),pal={o:'#2a1a12',R:'#8a6446',r:'#b08a62',d:'#5a3e2a',D:'#4a3222'};METEOR.forEach((r,y)=>[...r].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));PXU.met=c.toDataURL()}return PXU.met}
meteorArt=function(){const fire=['#ffe27a','#ff9a3a','#e8582a'];let tr='';for(let i=0;i<5;i++)tr+=`<rect x="${4+i*3}" y="${2+i*3}" width="4" height="4" fill="${fire[i%3]}"/>`;
 return `<svg viewBox="0 0 40 32" style="image-rendering:pixelated">${tr}<image href="${meteorURL()}" x="18" y="12" width="16" height="16"/><rect x="2" y="26" width="36" height="6" fill="#3a2f4e"/></svg>`}
/* ---- arcade difficulty ---- */
const DIFF={auto:'Auto',easy:'Easy',medium:'Medium',hard:'Hard'};
let diffMult=()=>({easy:.65,medium:1,hard:1.45})[S.set.arcd]||Math.min(1.6,Math.max(.6,avgWpm()/8));
const _ra=renderArcade;renderArcade=function(){_ra();const t=$('#s-arcade .topbar');if(!t)return;
 t.insertAdjacentHTML('afterend',`<div class="diffbar"><span>Speed:</span><div class="seg">${Object.entries(DIFF).map(([k,v])=>`<button class="${(S.set.arcd||'auto')===k?'on':''}" data-act="diff" data-v="${k}">${v}</button>`).join('')}</div><div class="arcade-toggles"></div></div>`)};
ACT.diff=d=>{S.set.arcd=d.v;save();renderArcade()};
const _sm=startMeteor;startMeteor=function(){_sm();G.speed=diffMult()};
const _sg=startGlitch;startGlitch=function(){_sg();G.speed=diffMult()};
const _sr=startRace;startRace=function(){_sr();const m=(S.set.arcd&&S.set.arcd!=='auto')?({easy:.7,medium:1,hard:1.3})[S.set.arcd]:1;G.racers.forEach(r=>r.w*=m)};
/* ---- grown-ups: grade level + what to work on ---- */
const GRADES=[[4,'Kindergarten (just starting)'],[8,'Grade 1'],[12,'Grade 2'],[16,'Grade 3'],[21,'Grade 4'],[26,'Grade 5'],[31,'Grade 6'],[999,'Grade 7 or higher']];
const _rp=renderParents;renderParents=function(){_rp();const t=$('#s-parents .topbar');if(!t)return;
 const last=S.hist.slice(-10),n=last.length,wpm=n?Math.round(last.reduce((a,b)=>a+b.w,0)/n):0,acc=n?Math.round(last.reduce((a,b)=>a+b.a,0)/n):0;
 const gi=GRADES.findIndex(g=>wpm<g[0]),grade=GRADES[gi][1],next=GRADES[gi][0];
 const weak=Object.entries(S.ks).filter(([c,k])=>k.h+k.m>=8).map(([c,k])=>[c,k.h/(k.h+k.m)]).sort((a,b)=>a[1]-b[1]).slice(0,4).filter(x=>x[1]<.9);
 const todo=[];
 if(n<3)todo.push('Play a few more rounds so the report can measure speed and accuracy.');
 else{if(acc<85)todo.push(`Accuracy is ${acc}%. Aim for 85% or better before speed. Slow down and watch the finger colors.`);
  if(acc>=85&&next<999)todo.push(`Speed is ${wpm} words per minute. Reaching ${next} WPM would move to the next grade level.`);
  if(weak.length)todo.push(`Tricky keys: ${weak.map(([c,a])=>c.toUpperCase()+' ('+Math.round(a*100)+'%)').join(', ')}. The Practice button on the map drills these.`);}
 const doneN=Object.values(S.best).filter(b=>b>=1).length,w=worldOf(Math.floor(nextStage()/8));
 todo.push(`Now in World ${w}: ${WORLDS[w-1].name}. ${doneN} of ${LESSONS.length*8} levels passed.`);
 t.insertAdjacentHTML('afterend',`<div class="panel gradebox"><div><span class="muted">Typing at about</span><h3>${n<3?'Not enough data yet':grade}</h3><span class="muted">${n?`${wpm} WPM · ${acc}% accuracy (last ${n} rounds)`:'Based on recent rounds'}</span></div>
 <div><b>What to work on</b><ul class="plist">${todo.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>`)};


/* pixel glyph styles */
(()=>{const mk=(rows,pal)=>{const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const g=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));return c.toDataURL()};
 const dia=mk(["...o...","..oWo..",".oWCCo.","oWCCCCo",".oCCCo.","..oCo..","...o..."],{o:'#1a3a5a',W:'#ffffff',C:'#8ad8f0'});
 const st=mk(["...o...","..oyo..","ooyyyoo","oyyyyyo",".oyyyo.","oyo.oyo","oo...oo"],{o:'#6a4200',y:'#f6d050'});
 document.head.insertAdjacentHTML('beforeend',`<style>.met .rock{background-image:url(${meteorURL()})!important}
 .card.diamond .c-name::after{content:"";display:inline-block;width:.8em;height:.8em;margin-left:4px;background:url(${dia}) center/contain no-repeat;image-rendering:pixelated}
 .card.gold .c-name::after{content:"";display:inline-block;width:.8em;height:.8em;margin-left:4px;background:url(${st}) center/contain no-repeat;image-rendering:pixelated}</style>`)})();

const HERODATA={"heroes": {"pop": {"name": "Pop", "rows": ["..o..................o..", "..oO................Oo..", "..oHo..............oBo..", "..ouLo............oBuo..", "..otuLo..........oBtuo..", "..oTtLLooooooooooBDtTo..", ".oTuLHHHHLLLLLLBBBBDuTo.", ".OLLHHHLLLLLLLLBBBBBDDo.", ".OLLHLLLLLLwuBBBBBBBBDo.", ".OLLLLLLLLLtTBBBBBBBBDo.", ".OLLLLLLLBBTTBBBBBBBDXo.", ".oLLLLkkkBBBBBBkkkBBDXo.", ".oLLLLwkkBBBBBBwkkBBDXo.", ".oLLLBkTkBBBBBBkTkBBDXo.", ".oLLBBTtTBBBBBBTtTBBDXo.", "oLLBBBkkkBBBBBBkkkBDDDXo", ".oBrrrBBBBmmmmBBBBrrrDo.", ".oBBBBBBBBmnwmBBBBBDDXo.", ".oDBBBBBBBBBBBBBBBDDDXo.", "..oXDDDDDDDDDDDDDDDDXo..", ".oLoBBBcscccsccsBBDoyYo.", ".oBoBBBccscccscBBDDoyo..", "..owoLBBBooooooooBBDoyYo", "...ooooooooooooooooooo.."], "pal": {"o": "#2b1d3e", "O": "#4a3a74", "X": "#3a2c66", "D": "#4e3d86", "B": "#6e5bb8", "L": "#8f7fd6", "H": "#b9adeb", "t": "#6fd0c8", "T": "#3c8f9a", "u": "#b4f0e6", "w": "#fff8ec", "k": "#1e1530", "r": "#e4909c", "m": "#6e2440", "n": "#e48a98", "c": "#efe1c6", "s": "#c9b291", "y": "#e8bc58", "Y": "#a8762e"}}, "pip": {"name": "Pip", "rows": ["...oo..............oo...", "..oHLo............oBLo..", "..oHpLo..........oBpLo..", "..oHpLo..........oBpLo..", "..oLpLo..........oBpDo..", "..oLpLo..........oBpDo..", "..oLLLooooooooooooBBDo..", ".oOLHHHHLLLLBBBBLLLLDoo.", ".oOLHLLLLLLLBBBBBBBLDoo.", ".oOLLLLLLLLLBBBBBBBBDoo.", ".oOLLLLLLLLLBBBBBBBBDoo.", ".oOLLLkkkLLLBBBkkkBBDoo.", ".oOLLLwkkLLLBBBkkwBBDoo.", ".oOLLLkekLLLBBBkekBBDoo.", ".oOLrrkkkLLLBBBkkkrrDoo.", ".oOLrrLLLLLnnBBBBBrrDoo.", ".oOLLLLLLLmwwmBBBBBBDoo.", "..oDLLLLLLLLBBBBBBBBXo..", "...ooDDDDDDDDDDDDDDoo...", "...oLoBccccccccccBoBo...", "...oLoBccccccccccBoBo...", "...owoBBccccccccBBowo...", "....oLLBBBBBBBBBBBBo....", "....oooooooooooooooo...."], "pal": {"o": "#3a2a3a", "O": "#6a5a7a", "X": "#9a8aae", "D": "#b8a8c8", "B": "#d8ccea", "L": "#eee8f8", "H": "#ffffff", "p": "#f2a8c0", "r": "#f2a8c0", "k": "#2a1a2a", "w": "#ffffff", "e": "#6a4ac8", "n": "#e86a8a", "m": "#6a2a3a", "c": "#fff8fc"}}, "rexo": {"name": "Rexo", "rows": ["..........oooo..........", ".........oyyyyo.........", "......oo.oyyyyo.oo......", ".....oyyooyyyyooyyo.....", ".....oyyooooooooyyo.....", "...ooOLHHHHLBLLLLBooo...", "..oOLHHLLLLLBBBBBLLBoo..", ".oOLHLLLLLLLBBBBBBBLDoo.", ".oOLLLLLLLLLBBBBBBBBDoo.", ".oOLLLLLLLLLBBBBBBBBDoo.", ".oOLLLLLLLLLBBBBBBBBDoo.", ".oOLLLkkkLLLBBBkkkBBDoo.", ".oOLLLwkkLLLBBBkkwBBDoo.", ".oOLLLkekLLLBBBkekBBDoo.", ".oOLrrkkkLLLBBBkkkrrDoo.", ".oOLLLLLLLLLBBBBBBBBDoo.", ".oOLLmmmmmmmmmmmmmmBDoo.", ".oOLLmwmmmmmmmmmmwmBDoo.", "..oDLLLLLLLLBBBBBBBBXo..", "...ooDDDDDDDDDDDDDDoo...", "..oLoBcscscsscscscBoDo..", "..oLoBccccccccccccBoDo..", "...ooBBccccccccccBBoo...", "....oooooooooooooooo...."], "pal": {"o": "#1a2e1a", "O": "#3a5a3a", "X": "#2e6a3a", "D": "#3e8a4a", "B": "#58b062", "L": "#7ed080", "H": "#b0eca8", "y": "#f2c84a", "k": "#0e1a0e", "w": "#ffffff", "e": "#c8781a", "r": "#f0a090", "m": "#5a1a20", "c": "#f4f0c8", "s": "#d8d0a0"}}, "juno": {"name": "Juno", "rows": ["........................", "......oooooooooooo......", "....ooOLHHLLBBLLBooo....", "...oOLHHLLLLBBBBLLBoo...", "..oOLHLLLLLLBBBBBBLBoo..", "..oOLLLLLLLLBBBBBBBBoo..", ".oOLLLLccccccccccBBBDoo.", ".oOLLLccccccccccccBBDoo.", ".oOLLccccccccccccccBDoo.", ".oOLLccccccccccccccBDoo.", ".oOLccccccccccccccccDoo.", ".oOLcckkkcccccckkkccDoo.", ".oOLccwkkcccccckkwccDoo.", ".oOLcckekcccccckekccDoo.", ".oOLcrrkkkcccckkkrrcDoo.", ".oOLccccccaaaaccccccDoo.", ".oOLLccccccaaccccccBDoo.", "..oLLLccccccccccccBBDo..", "oLooLLccccccccccccBBooDo", "oLLoLLccccccccccccBBoDDo", "oLLoDLccccccccccccBDoDDo", ".oooDDccccccccccccDDooo.", "...oDDDccccccccccDDDo...", "...oaaaooooooooooaaao..."], "pal": {"o": "#141a2a", "O": "#3a4a6a", "X": "#22304a", "D": "#2a3a5a", "B": "#3e5276", "L": "#566c98", "H": "#7e94c0", "c": "#f6f8fc", "a": "#f0a030", "k": "#0e1220", "w": "#ffffff", "e": "#3a6ac8", "r": "#f2a0b0"}}}, "colors": {"purple": ["#2b1d3e", "#4a3a74", "#3a2c66", "#4e3d86", "#6e5bb8", "#8f7fd6", "#b9adeb"], "blue": ["#14243e", "#2e4a76", "#24447a", "#2e5a9a", "#4a80c8", "#72a6e4", "#a8ccf4"], "green": ["#14301e", "#2e5a3a", "#286a3a", "#34844a", "#50a862", "#78c884", "#b0e8b0"], "red": ["#3a1416", "#6a2a2a", "#7a2424", "#9a3030", "#c84a44", "#e4706a", "#f4a8a0"], "gold": ["#3a2408", "#6a4a14", "#8a6418", "#b08420", "#d8a838", "#f0cc60", "#fbe8a8"], "pink": ["#3e1a30", "#6e3a5a", "#8a3a66", "#b0507e", "#d874a6", "#f09ac4", "#fcc8e2"], "mint": ["#0e3030", "#2a5a58", "#1e6a66", "#28928a", "#40b8ae", "#6edad0", "#b0f2ea"], "night": ["#10101e", "#2a2a40", "#22223a", "#2e2e50", "#44446e", "#5e5e90", "#8a8ab8"], "snow": ["#3a3a4a", "#6a6a7a", "#9a9aaa", "#b8b8c8", "#d8d8e4", "#eeeef6", "#ffffff"]}};
/* ================= V8: hero choice + colors ================= */
const HEROES=HERODATA.heroes,HCOL=HERODATA.colors,HK=['o','O','X','D','B','L','H'];
const heroName=(d=S)=>HEROES[(d&&d.hero)||'pop'].name;
function heroCanvas(eq={},hero='pop',color=null){const h=HEROES[hero]||HEROES.pop,pal=Object.assign({},h.pal);if(color&&HCOL[color])HCOL[color].forEach((c,i)=>pal[HK[i]]=c);
 const c=document.createElement('canvas');c.width=24;c.height=24;const g=c.getContext('2d'),A=Object.values(eq||{}).filter(id=>KKDATA.acc[id]);
 const paint=(rows,p,ox=0,oy=0)=>rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(p[ch]){g.fillStyle=p[ch];g.fillRect(ox+x,oy+y,1,1)}}));
 A.filter(id=>KKDATA.acc[id].back).forEach(id=>{const a=KKDATA.acc[id];paint(a.rows,a.pal,a.x,a.y)});paint(h.rows,pal);
 A.filter(id=>!KKDATA.acc[id].back).forEach(id=>{const a=KKDATA.acc[id];paint(a.rows,a.pal,a.x,a.y)});return c}
function zookSVG(eq,hero,color){eq=eq||S.equip;hero=hero||heroNow();color=color===undefined?S.color:color;return kkimg('zk',kku('h'+hero+(color||'')+JSON.stringify(eq),()=>heroCanvas(eq,hero,color)))}
ACT.heroes=()=>{const cur=S.hero||'pop',col=S.color||null;
 modal(`<h2>Pick your hero</h2><div class="heroes">${Object.entries(HEROES).map(([k,h])=>`<button class="pl ${k===cur?'on':''}" data-act="pickHero" data-h="${k}">${zookSVG({},k,k===cur?col:null)}<b>${h.name}</b></button>`).join('')}</div>
 <h3 style="font-size:22px">Color</h3><div class="swatch">${[null,...Object.keys(HCOL)].map(c=>`<button class="${(c||null)===col?'on':''}" style="background:${c?HCOL[c][4]:HEROES[cur].pal.B}" data-act="pickColor" data-c="${c||''}" aria-label="${c||'original'} color"></button>`).join('')}</div>
 <div class="bighero">${zookSVG()}</div><button class="btn" data-act="close">Done</button>`)};
ACT.pickHero=d=>{S.hero=d.h;S.color=null;save();sfx.click();ACT.heroes()};
ACT.pickColor=d=>{S.color=d.c||null;save();sfx.click();ACT.heroes()};
const _saveName=ACT.saveName;ACT.saveName=()=>{const first=!S.name;_saveName();if(first&&S.name&&!S.hero)setTimeout(ACT.heroes,300)};
const _rh=renderHome;renderHome=function(){_rh();const nm=$('#s-home .tname');if(nm&&!nm.querySelector('[data-act=heroes]'))nm.insertAdjacentHTML('beforeend','<button class="btn sm alt" data-act="heroes">Hero</button>');
 const say=$('#s-home .say');if(say&&/Pop/.test(say.textContent))say.textContent=say.textContent.replace(/Pop/g,heroName())};
const _rs=renderShop;renderShop=function(){_rs();const h=$('#s-shop .topbar h2');if(h)h.textContent=heroName()+"'s Closet"};

function kingdomRoad(w=160,h=100){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),R=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(a),Math.round(b))};
 const sky=['#2e2258','#3e2a66','#5a3478','#7e4280','#a8547e','#d0707a','#ec9478','#f6b87c'];sky.forEach((col,i)=>R(0,i*5,w,5,col));
 for(let i=0;i<24;i++)R((i*37)%w,(i*11)%16,1,1,'#fff6e0');
 R(70,30,20,10,'#ffd88a');R(66,33,28,7,'#ffd88a');R(72,28,16,2,'#ffe6a8');
 g.fillStyle='#4e3a6a';for(let x=0;x<w;x++){const y=Math.round(33+3*Math.sin(x/11)+2*Math.sin(x/5));R(x,y,1,40-y,'#4e3a6a')}
 // castle
 const S='#9a8cae',SD='#6e6288',RF='#5a2e7a',FL='#f0c860',WN='#ffe27a';
 R(62,24,36,16,S);R(62,24,36,2,SD);for(let x=62;x<98;x+=4)R(x,22,2,2,S);
 [[58,14,8],[94,14,8],[75,8,10]].forEach(([x,y,wd])=>{R(x,y,wd,40-y,S);R(x+wd-2,y,2,40-y,SD);g.fillStyle=RF;g.beginPath();g.moveTo(x-1,y);g.lineTo(x+wd/2,y-9);g.lineTo(x+wd+1,y);g.fill();R(x+wd/2,y-14,1,5,'#3a2a20');R(x+wd/2+1,y-14,3,2,FL);R(x+wd/2-1,y+5,2,3,WN)});
 R(77,32,6,8,'#3a2a3a');R(78,31,4,1,'#3a2a3a');R(66,28,2,3,WN);R(91,28,2,3,WN);
 // fields
 R(0,40,w,h-40,'#3e6a3a');for(let d=.05;d<1;d+=.1){const y=40+60*d*d;R(0,y,w,Math.max(1,6*d),'#4a7a42')}
 // road
 for(let y=40;y<h;y++){const t=(y-40)/60,half=6+t*72,x0=80-half;R(x0,y,half*2,1,'#8a7a6e');R(x0,y,1,1,'#4a3a32');R(80+half-1,y,1,1,'#4a3a32');
  const row=Math.floor(Math.sqrt(t)*12);if(Math.floor(Math.sqrt(t)*12*4)%4===0)R(x0,y,half*2,1,'#6e6058');else{const step=Math.max(2,Math.round(4+t*14)),off=row%2?step/2:0;for(let x=x0+off;x<80+half;x+=step)R(x,y,1,1,'#6e6058')}}
 // trees & lanterns along sides
 const tree=(x,y,s)=>{const col=['#1e3a22','#2e5a32','#447a40'];R(x-3*s,y-9*s,6*s,6*s,col[1]);R(x-2*s,y-10*s,4*s,2*s,col[2]);R(x-3*s,y-4*s,6*s,1*s,col[0]);R(x-.5*s,y-3*s,1*s,3*s,'#4a321c')};
 const lamp=(x,y,s)=>{R(x,y-7*s,Math.max(1,s*.8),7*s,'#2a2030');R(x-s,y-9*s,s*2.6,2*s,'#ffd86a');R(x-1.4*s,y-10*s,s*3.4,1*s,'#2a2030')};
 [.12,.28,.5,.78].forEach((d,i)=>{const y=40+60*d,s=.6+d*2.2;[-1,1].forEach(sd=>{const x=80+sd*(10+76*d);i%2?lamp(x,y,s):tree(x,y,s);tree(x+sd*16*s,y-2*s,s*.8)})});
 return c}

function pathScene(){const u=kku('kroad',()=>kingdomRoad());return `<svg class="scene" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true"><image href="${u}" width="160" height="100" preserveAspectRatio="none"/></svg>`}
const _camp=camp;camp=function(k){CAMP[0].h='Hi! I am '+heroName()+'!';_camp(k)};

const SCR2={"spr": {"inkblob": ["........................", "........................", "........................", "........oooooooo........", "......ooBBBBBBBBoo......", ".....oBBLBBBBBBBBBo.....", "....oBBLBBBBBBBBBBBo....", "...oBBBBBBBBBBBBBBBBo...", "...oBBBBwwwwwwwwBBBBo...", "..oBBBBwwwwwwwwwwBBBDo..", "..oBBBBwwwkkkkwwwBBBDo..", "..oBBBBwwwkkkkwwwBBBDo..", "..oBBBBBwwwwwwwwBBBBDo..", ".oBBsBBBBBBBBBBBBBBsDDo.", ".oBsssBBBBBBBBBBBBsssDo.", ".oBBsBBkkkkkkkkkkBBsDDo.", ".oBBBBBktktkktktkBBBDDo.", ".oBBBBBBkkkkkkkkBBBBDDo.", "..oBBBBBBBBBBBBBBBBBDo..", ".oBoBBBBBBBBBBBBBBBBoDo.", ".oBooBBBoBBBBBBoBBBooDo.", "..o..oBo.oBBBBo.oBo..o..", ".....oBo..oooo..oBo.....", "......o..........o......"], "imp": ["...........oo...........", "..........oHLo..........", ".........oHLBLo.........", "........oHLLBBLo........", ".......oHLLLBBBLo.......", "......oHLLLLBBBBLo......", ".....oHLLLLLBBBBBLo.....", "....oHLLkkkkkkkkBBLo..eo", "...oHLLkkkkkkkkkkBBLoeo.", "...oHLkkyykkkkyykkBLopo.", "...oHLkkyykkkkyykkBLpo..", "..oHLLkkkkkkkkkkkkBBpo..", "..oHLLkwkwkkkkwkwkBpoo..", "..oHLLLkkkkkkkkkkBBpoo..", ".oHLLLLLLLLLBBBBBBpoDLo.", ".oHLLLLDLLLLBBBBDBqBDLo.", ".oHLLLLLLLLLBBBBBgBBDLo.", "oHLLLLLLLLLLBBBBBBBBDDLo", "oHLLLLLLLLLLBBBBBBBBDDLo", "oHLLDLLLDLLLBBBDBBBDDDLo", ".oLDoLLDoLLLBBBoDBBoXDo.", "..oo.oo..oooooo..oo.oo..", "........................", "........................"], "inkling": ["..........o..o..........", ".........oBooBo.........", "......o..oBooBo..o......", ".....oBo.oBBBBo.oBo.....", ".....oBBoBBBBBBoBBo.....", "....oBBBBBBBBBBBBBBo....", "....oBLBBBBBBBBBBBBo....", "...oBLBBBBBBBBBBBBBBo...", "...oBLwwwBBBBBBwwwBBo...", "...oBwwkwBBBBBBwkwwBo...", "...oBwkkwBBBBBBwkkwBo...", "...oBBwwBBBBBBBBwwBBo...", "...oBBBBBBBBBBBBBBBBo...", "..oBsBBBkkkkkkkkBBBsDo..", "..oBssBktktkktktkBssDo..", "..oBBBBBkkkkkkkkBBBBDo..", "..oBBBBBBBBBBBBBBBBBDo..", "..oBBBsBBBBBBBBBBsBBDo..", ".oBBBsssBBBBBBBBsssBDDo.", ".oBoBBsBBoBBBBoBBsBBoDo.", ".oo.oBBBo.oBBo.oBBBo.oo.", "....oBo...oooo...oBo....", ".....o............o.....", "........................"], "splotch": ["........................", "........................", "........................", "........................", "....oooo........oooo....", "...owwwwo......owwwwo...", "...owkkwo......owkkwo...", "...owkkwo......owkkwo...", "....oooo........oooo....", ".....oBo........oBo.....", ".....oBo........oBo.....", ".....oBo........oBo.....", "......oBo......oBo......", "......oBooooooooBo......", "....ooBBBBBBBBBBBBoo....", "..ooBBLBBBBBBBBBBBBBoo..", ".oBBLBBBBBBBBBBBBBBBDDo.", "oBBLBBkkkkkkkkkkkkBBDDDo", "oBLBBBktktkttktktkBBDDDo", "oBBBsBBkkkkkkkkkkBBsDDDo", "oBBsssBBBBBBBBBBBBsssDDo", ".oBBsBBBBBBBBBBBBBBsDDo.", "..oooBBoooBBBBoooBBooo..", ".....oo...oooo...oo....."], "quill": ["...........oo...........", "..........oHLo..........", ".........oHLBLo.........", "........oHLLBBLo........", ".......oHLLLBBBLo.......", "......oHLLLLBBBBLo......", "....oHHLLLLLBBBBBLLo....", "..ooyyyyyyyyyyyyyyyyoo..", ".oHHHHHLLLLLBBBBBLLLLLo.", "..ooooookkkkkkkkoooooof.", ".....okkyykkkkyykko..fF.", ".....okkyykkkkyykko..f..", ".....okkkkkkkkkkkko.F...", "......okwkwkkwkwko..f...", "....ooLLLLLLBBBBBBof....", "...oHLLLLLLLBBBBBBBko...", "..oHLLLLLLLLBBBBBBBkLo..", "..oHLLDLLLLLBBBBBDBBLo..", ".oHLLLLLLLLLBBBBBBBBDLo.", ".oHLLDLLLDLLBBDBBBDBDLo.", "oHLLLLLLLLLLBBBBBBBBDDLo", "oLDoLLDoLLDooDBBoDBBoXDo", ".oo.oo..oo....oo..oo.oo.", "........................"], "eraser": ["...........oo....ooooooo", "..........oHLo...oEEEEEo", ".........oHLBLo..obeeeeo", "........oHLLBBLo.obeeeeo", ".......oHhLLBBhLoobeeeeo", "......oHhLLLBBBhLoEEEEEo", ".....oHLLLLLBBBBBooooooo", "....oHLLkkkkkkkkBBLoo.Lo", "...oHLLkkkkkkkkkkBBLoLo.", "...oHLkkyykkkkyykkBLoLo.", "...oHLkkyykkkkyykkBLoo..", "..oHLLkkkkkkkkkkkkBBoo..", "..oHLLkwkwkkkkwkwkBLoo..", "..oHLLLkkkkkkkkkkBBLoo..", ".oHLLLLLLLLLBBBBBBLoDLo.", ".oHLLLLDLLLLBBBBDBLBDLo.", ".oHLLLLLLLLLBBBBBLBBDLo.", "oHLLLLLLLLLLBBBBBBBBDDLo", "oHLLLLLLLLLLBBBBBBBBDDLo", "oHLLDLLLDLLLBBBDBBBDDDLo", ".oLDoLLDoLLLBBBoDBBoXDo.", "..oo.oo..oooooo..oo.oo..", "........................", "........................"]}, "pal": {"inkblob": {"o": "#0a0a1a", "B": "#26264e", "L": "#40407e", "D": "#1a1a3a", "X": "#141430", "H": "#5a5aa0", "w": "#f4f0e6", "k": "#0a0a12", "t": "#f4f0e6", "s": "#e8e0c8"}, "imp": {"o": "#120a1a", "H": "#7a5aaa", "L": "#4e3474", "B": "#3a2660", "D": "#2e1e48", "X": "#24183a", "k": "#0a0610", "y": "#f6e05a", "w": "#f4f0e6", "p": "#f0c040", "q": "#e8c090", "g": "#2a2a2a", "e": "#f08aa0"}, "inkling": {"o": "#0a1414", "B": "#1e3a40", "L": "#2e5a62", "H": "#4a8088", "D": "#16302e", "X": "#102624", "w": "#f4f0e6", "k": "#060c0c", "t": "#f4f0e6", "s": "#e8e0c8"}, "splotch": {"o": "#140a1e", "B": "#3a2456", "L": "#5a3a80", "H": "#7a5aa8", "D": "#2a1840", "X": "#201234", "w": "#f4f0e6", "k": "#0a0610", "t": "#f4f0e6", "s": "#e8e0c8"}, "quill": {"o": "#0e1220", "H": "#4a6ab0", "L": "#2e4680", "B": "#24386a", "D": "#1a2850", "X": "#141e40", "y": "#f0c860", "k": "#06080e", "w": "#f4f0e6", "f": "#f4f0ff", "F": "#8ad0e0"}, "eraser": {"o": "#1a0a0a", "H": "#c8504a", "L": "#9a3030", "B": "#7a2424", "D": "#5a1818", "X": "#4a1414", "k": "#0a0606", "y": "#9df05a", "w": "#f4f0e6", "h": "#e8e0d0", "e": "#f08aa0", "E": "#c0607a", "b": "#5a7ab0", "p": "#f0c040", "q": "#e8c090", "g": "#2a2a2a"}}, "names": {"inkblob": "Ink Blob", "imp": "Scribble Imp", "inkling": "Inkling", "splotch": "Splotch", "quill": "Quill Witch", "eraser": "Eraser Imp"}};
/* ================= V9: pixel pass, baddies, road, fonts ================= */
const PXG=(rows,pal)=>{const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const g=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));return c};
function blit(g,rows,pal,x0,y0){rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(x0+x,y0+y,1,1)}}))}
/* --- kingdom road, hand-styled --- */
function kingdomRoad(w=160,h=100){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),R=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(x,y,a,b)},P=(x,y,col)=>R(x,y,1,1,col);
 const sky=['#2a2050','#3a2864','#56347a','#7a4482','#a4567e','#cc6e78','#e8907a','#f4b47e'];
 sky.forEach((col,i)=>{R(0,i*5,w,5,col);if(i)for(let x=0;x<w;x+=2)P(x+(i%2),i*5,sky[i-1])});
 [[12,4],[40,9],[118,3],[146,10],[90,2]].forEach(([x,y])=>P(x,y,'#fff6e0'));
 const cloud=["...oooo....","..oHHHLo...",".oHHLLLLoo.","oHLLLLLLLLo",".ooooooooo."];[[16,8],[120,12],[60,4]].forEach(([x,y])=>blit(g,cloud,{o:'#6a3a6a',H:'#fbe0d8',L:'#e0a8b8'},x,y));
 R(72,30,16,10,'#ffd88a');R(70,32,20,8,'#ffd88a');R(74,29,12,1,'#ffe6a8');
 // mountains with outline
 const mt=[];for(let x=0;x<w;x++)mt[x]=Math.round(32+3*Math.sin(x/11)+2*Math.sin(x/5));
 for(let x=0;x<w;x++){R(x,mt[x],1,40-mt[x],'#4a3a6a');P(x,mt[x],'#1e1a2a');if(mt[x]<=mt[x-1]||x===0)P(x,mt[x]+1,'#6e5a8e')}
 // castle (filled then auto-outlined)
 const CW=46,CH=34,cg=Array.from({length:CH},()=>Array(CW).fill(''));const F=(x,y,a,b,v)=>{for(let j=y;j<y+b;j++)for(let i=x;i<x+a;i++)if(j>=0&&j<CH&&i>=0&&i<CW)cg[j][i]=v};
 const roof=(x,top,wd,base)=>{for(let j=top;j<=base;j++){const half=Math.round((j-top)/(base-top)*(wd/2+1));F(x+wd/2-half,j,half*2,1,j%2?'r':'R')}};
 F(6,18,34,16,'S');for(let i=6;i<40;i+=3)F(i,16,2,2,'S');F(2,10,9,24,'S');F(35,10,9,24,'S');F(17,6,12,28,'S');
 roof(1,1,11,9);roof(34,1,11,9);roof(16,-3,14,5);
 [[5,15],[38,15],[21,11],[25,11],[12,22],[32,22]].forEach(([x,y])=>F(x,y,2,3,'Y'));F(20,25,6,9,'G');F(21,24,4,1,'G');
 for(let j=0;j<CH;j++)for(let i=0;i<CW;i++)if(cg[j][i]==='S'&&((j%4===0&&i%2===0)||(j%4===2&&i%4===1)))cg[j][i]='s';
 for(let j=0;j<CH;j++)for(let i=CW-1;i>=0;i--)if(cg[j][i]==='S'&&(i===CW-1||cg[j][i+1]===''||cg[j][i+2]===''))cg[j][i]='d';
 const CP={S:'#a89cbe',s:'#8c80a8',d:'#6e6290',R:'#6a3a8a',r:'#58307a',Y:'#ffd86a',G:'#2a1e2e'},cx0=57,cy0=6;
 for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const v=cg[j][i];if(v)P(cx0+i,cy0+j,CP[v]);else if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>cg[j+b]?.[i+a]))P(cx0+i,cy0+j,'#1e1a2a')}
 [[cx0+6,cy0-1],[cx0+39,cy0-1],[cx0+23,cy0-6]].forEach(([x,y])=>{R(x,y-5,1,6,'#3a2a20');R(x+1,y-5,3,2,'#f0c860');P(x+1,y-3,'#c8981e')});
 // grass with tufts
 R(0,40,w,h-40,'#4f7f48');for(let y=40;y<h;y+=3)for(let x=(y*7)%9;x<w;x+=9+((x*y)%5)){P(x,y,'#365f3c');P(x+2,y,'#365f3c');P(x+1,y-1,'#62955a')}
 for(let x=0;x<w;x++)P(x,40,'#2e4a28');
 // road of cobbles
 for(let y=41;y<h;y++){const t=(y-40)/60,half=Math.round(6+t*72),x0=80-half;R(x0,y,half*2,1,'#8a7a6e');P(x0,y,'#3a2e2a');P(x0+1,y,'#b0a090');P(80+half-1,y,'#3a2e2a');P(80+half-2,y,'#6e6058')}
 let y=41,row=0;while(y<h){const t=(y-40)/60,rh=Math.max(1,Math.round(1+t*5)),sw=Math.max(2,Math.round(3+t*12)),half=Math.round(6+t*72),x0=80-half+2,x1=80+half-2;
  R(x0,y,x1-x0,1,'#5a4a42');for(let x=x0+(row%2?Math.round(sw/2):0);x<x1;x+=sw){R(x,y,1,rh,'#5a4a42');if(rh>1)P(x+1,y+1,'#a8988a')}y+=rh+1;row++}
 // trees and lanterns: three sizes (no stretching)
 const TP={o:'#14240f',H:'#9ac868',L:'#6a9a48',B:'#4a7a36',D:'#2e5a26',t:'#7a5432',T:'#4a321c'},LP={o:'#1e1a2a',y:'#ffd86a',Y:'#f0a840',g:'#fff6c0'};
 const tS=["..ooo..",".oLLBo.","oLHLBBo","oLLBBDo","oBBBDDo",".oDDDo.","..oto..","..oto..","..ooo.."];
 const tM=["...ooooo...","..oLLLBBo..",".oLHHLLBBo.","oLHLLLBBBDo","oLLLLBBBBDo","oLLBBBBBDDo","oBBBBBBDDDo",".oBBBDDDDo.","..ooDDDoo..","....oto....","....oTo....","....otTo...","...oottoo.."];
 const tL=[".....ooooo.....","...ooLLLBBoo...","..oLLHHLLBBBo..",".oLHHLLLLBBBBo.",".oLHLLLLBBBBDo.","oLLLLLLBBBBBDDo","oLLLLLBBBBBBDDo","oLLLBBBBBBBDDDo","oBBBBBBBBBDDDDo",".oBBBBBBBDDDDo.",".ooBBBDDDDDDoo.","...ooDDDDDoo...",".....ootto.....","......oto......","......oTo......","......otTo.....",".....otTto.....","....oottTtoo..."];
 const lS=["oYo","oyo","ooo",".o.",".o.",".o.","ooo"],lM=[".ooo.","oYyYo","oyYyo","ooooo","..o..","..o..","..o..","..o..","..o..","..o..",".ooo.","ooooo"],lL=["..ooo..",".oYYYo.","oYygyYo","oyyyyyo","oYyyyYo","ooooooo","...o...","...o...","...o...","...o...","...o...","...o...","...o...","..ooo..",".ooooo."];
 const place=(spr,pal,x,yb)=>blit(g,spr,pal,Math.round(x-spr[0].length/2),Math.round(yb-spr.length));
 [[.08,tS,lS],[.3,tM,lM],[.62,tL,lL]].forEach(([d,T,L])=>{const yb=40+60*d,off=12+76*d;[-1,1].forEach(sd=>{place(L,LP,80+sd*off,yb);place(T,TP,80+sd*(off+T[0].length+4),yb-2)})});
 place(tL,TP,8,99);place(tL,TP,152,99);
 return c}
function pathScene(){const u=kku('kroad2',()=>kingdomRoad());return `<svg class="scene" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true"><image href="${u}" width="160" height="100" preserveAspectRatio="none"/></svg>`}
/* --- random baddies (B/E family) --- */
const BADKEYS=Object.keys(SCR2.spr);
function badCanvas(k,king){const c=PXG(SCR2.spr[k],SCR2.pal[k]);if(king){const g=c.getContext('2d'),cr=KKDATA.acc.crown;blit(g,cr.rows,cr.pal,6,0)}return c}
function badSVG(k,king,scale){const sz=200*scale;return `<svg class="gl" viewBox="0 0 200 200" aria-hidden="true" style="overflow:visible"><image href="${kku('b'+k+king,()=>badCanvas(k,king))}" x="${(200-sz)/2}" y="${200-sz}" width="${sz}" height="${sz}"/></svg>`}
villainName=(i,boss)=>{P.vkey=rand(BADKEYS);const n=SCR2.names[P.vkey];return boss?(i===LESSONS.length-1?'Scrambler King':'Mega '+n):n};
villainSVG=(i,boss)=>badSVG(P.vkey||rand(BADKEYS),boss,[1,1.15,1.3][worldOf(i)-1]*(boss?1.2:1));
villainArc=(v,king)=>badSVG(rand(BADKEYS),king,king?1.2:1);
/* --- hero colors: 4 distinct each --- */
const HERO_COLORS={pop:[null,'red','green','gold'],pip:[null,'pink','mint','night'],rexo:[null,'blue','red','gold'],juno:[null,'red','mint','pink']};
ACT.heroes=()=>{const cur=S.hero||'pop';if(!HERO_COLORS[cur].includes(S.color||null))S.color=null;const col=S.color||null;
 modal(`<h2>Pick your hero</h2><div class="heroes">${Object.entries(HEROES).map(([k,h])=>`<button class="pl ${k===cur?'on':''}" data-act="pickHero" data-h="${k}">${zookSVG({},k,k===cur?col:null)}<b>${h.name}</b></button>`).join('')}</div>
 <h3>Color</h3><div class="swatch">${HERO_COLORS[cur].map(c=>`<button class="${(c||null)===col?'on':''}" style="background:${c?HCOL[c][4]:HEROES[cur].pal.B}" data-act="pickColor" data-c="${c||''}" aria-label="${c||'original'} color"></button>`).join('')}</div>
 <div class="bighero">${zookSVG()}</div><button class="btn" data-act="close">Done</button>`)};
/* --- pixel FX layer: lasers, hits, shards --- */
const FXS=4;
function fxLayer(a){let c=a.querySelector('canvas.fx');const W=Math.ceil(a.clientWidth/FXS),H=Math.ceil(a.clientHeight/FXS);if(!c){c=document.createElement('canvas');c.className='fx';a.appendChild(c);c._fx=[]}if(c.width!==W||c.height!==H){c.width=W;c.height=H}return c}
function fxRun(c){if(c._run)return;c._run=true;const g=c.getContext('2d');const step=()=>{const now=performance.now();g.clearRect(0,0,c.width,c.height);c._fx=c._fx.filter(f=>now-f.t<f.d);
 c._fx.forEach(f=>{const p=(now-f.t)/f.d;
  if(f.k==='beam'){const n=Math.max(Math.abs(f.x2-f.x1),Math.abs(f.y2-f.y1))||1,start=p<.5?0:(p-.5)*2;for(let s=Math.floor(start*n);s<=n;s++){const x=Math.round(f.x1+(f.x2-f.x1)*s/n),y=Math.round(f.y1+(f.y2-f.y1)*s/n);g.fillStyle=f.c;g.fillRect(x-f.w,y-f.w,f.w*2+1,f.w*2+1);g.fillStyle='#ffffff';g.fillRect(x,y,1,1)}}
  else if(f.k==='hit'){const r=1+Math.floor(p*(f.big?5:3));g.fillStyle=f.c;[[0,-r],[0,r],[-r,0],[r,0],[-r+1,-r+1],[r-1,r-1],[-r+1,r-1],[r-1,-r+1]].forEach(([a,b])=>g.fillRect(f.x+a,f.y+b,1,1));g.fillStyle='#ffffff';g.fillRect(f.x-(p<.5?1:0),f.y-(p<.5?1:0),p<.5?3:1,p<.5?3:1)}
  else{const x=Math.round(f.x+f.vx*p*f.d/16),y=Math.round(f.y+f.vy*p*f.d/16+p*p*6);g.fillStyle=f.c;g.fillRect(x,y,f.s,f.s)}});
 if(c._fx.length)requestAnimationFrame(step);else{c._run=false;g.clearRect(0,0,c.width,c.height)}};requestAnimationFrame(step)}
function laser(a,from,to,color,big,fx=.5,fy=.42){if(!a||!from||!to)return;const c=fxLayer(a),ar=a.getBoundingClientRect(),f=from.getBoundingClientRect(),t=to.getBoundingClientRect();
 const x1=(f.left-ar.left+f.width*fx)/FXS,y1=(f.top-ar.top+f.height*fy)/FXS,x2=(t.left-ar.left+t.width*(.4+Math.random()*.2))/FXS,y2=(t.top-ar.top+t.height*(.4+Math.random()*.2))/FXS,now=performance.now();
 c._fx.push({k:'beam',x1:Math.round(x1),y1:Math.round(y1),x2:Math.round(x2),y2:Math.round(y2),c:color,w:big?2:1,t:now,d:big?260:180},{k:'hit',x:Math.round(x2),y:Math.round(y2),c:color,big,t:now+60,d:big?320:220});fxRun(c)}
function burst(a,el,color,n=12){if(!a||!el)return;const c=fxLayer(a),ar=a.getBoundingClientRect(),r=el.getBoundingClientRect(),x=(r.left-ar.left+r.width/2)/FXS,y=(r.top-ar.top+r.height/2)/FXS,now=performance.now();
 for(let i=0;i<n;i++){const an=Math.random()*Math.PI*2,sp=.6+Math.random()*1.2;c._fx.push({k:'sh',x,y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp-0.4,c:i%3?color:'#ffffff',s:Math.random()<.4?2:1,t:now,d:520+Math.random()*200})}fxRun(c)}
/* --- pixel decorations: sky stars, badges, hero shadow --- */
const SHIELD=["oooooooooooo","oHHLLLLLLLBo","oHLLLLLLLLBo","oLLLLyyLLLBo","oLLLyyyyLLBo","oLLLLyyLLLBo","oLLLLLLLLLBo",".oLLLLLLLBo.",".oLLLLLLLBo.","..oLLLLLBo..","...oLLLBo...","....oooo...."];
function shieldURL(col,got){const k='sh'+col+got;if(!PXU[k]){const pal=got?{o:'#1e1a2a',H:shadeHex(col,.45),L:col,B:shadeHex(col,-.3),y:'#fff4c8'}:{o:'#1e1a2a',H:'#5a5070',L:'#3e3552',B:'#2e2840',y:'#4a4060'};PXU[k]=PXG(SHIELD,pal).toDataURL()}return PXU[k]}
function pixBadges(root){root.querySelectorAll('.badge').forEach(b=>{const col=getComputedStyle(b).getPropertyValue('--bc').trim()||'#888888';b.textContent='';b.style.backgroundImage=`url(${shieldURL(col,b.classList.contains('got'))})`})}
const _rh2=renderHome;renderHome=function(){_rh2();pixBadges($('#s-home'))};
const _rm2=renderMap;renderMap=function(){_rm2();pixBadges($('#s-map'))};
(()=>{const st=document.createElement('canvas');st.width=64;st.height=64;const g=st.getContext('2d');[[5,7,'#fff6e0',1],[40,12,'#fff6e0',1],[22,30,'#c8b8ff',1],[55,44,'#fff6e0',2],[12,52,'#f0c860',1],[33,58,'#fff6e0',1]].forEach(([x,y,c,s])=>{g.fillStyle=c;g.fillRect(x,y,s,s)});
 const sh=PXG(["....oooooooo....","..oooooooooooo..","oooooooooooooooo","..oooooooooooo..","....oooooooo...."],{o:'rgba(10,6,20,.45)'});
 document.head.insertAdjacentHTML('beforeend',`<style>.sky{background-image:url(${st.toDataURL()})!important;background-size:256px 256px!important;image-rendering:pixelated;opacity:.8}.hero-big .pad{background:url(${sh.toDataURL()}) center/100% 100% no-repeat!important;image-rendering:pixelated;height:24px!important}</style>`)})();

/* ================= V10: hero ownership + player cards ================= */
const HERO_COST=60,COLOR_COST=20;
let HPV=null;
ACT.heroes=()=>{const first=!S.hero;const cur=heroNow();if(!HERO_COLORS[cur].includes(S.color||null))S.color=null;
 if(!HPV)HPV={h:first?(cur):cur,c:S.color||null};const pv=HPV,owned=!first&&pv.h===cur&&(pv.c||null)===(S.color||null);
 const cost=first?0:(pv.h!==cur?HERO_COST:0)+((pv.c||null)!==(S.color||null)?COLOR_COST:0);
 const gem=ICON.gem.replace('<svg','<svg width="18" height="18"');
 modal(`<h2>${first?'Pick your hero':'Your hero'}</h2>${first?'':`<p class="muted hnote">New hero ${gem}${HERO_COST} · New color ${gem}${COLOR_COST}</p>`}
 <div class="heroes">${Object.entries(HEROES).map(([k,h])=>`<button class="pl ${k===pv.h?'on':''}" data-act="pvHero" data-h="${k}">${zookSVG({},k,k===pv.h?pv.c:null)}<b>${h.name}</b></button>`).join('')}</div>
 <h3>Color</h3><div class="swatch">${HERO_COLORS[pv.h].map(c=>`<button class="${(c||null)===(pv.c||null)?'on':''}" style="background:${c?HCOL[c][4]:HEROES[pv.h].pal.B}" data-act="pvColor" data-c="${c||''}" aria-label="${c||'original'} color"></button>`).join('')}</div>
 <div class="bighero">${zookSVG(S.equip,pv.h,pv.c)}</div>
 ${first?`<button class="btn" data-act="buyHero">This is my hero!</button>`:owned?`<button class="btn" data-act="closeHero">Done</button>`:`<div class="row hbuy"><button class="btn" data-act="buyHero" ${S.gems<cost?'disabled':''}>Switch ${gem}${cost}</button><button class="btn alt" data-act="closeHero">Keep mine</button></div>${S.gems<cost?'<p class="muted hnote">Need more gems</p>':''}`}`)};
ACT.pvHero=d=>{HPV.h=d.h;HPV.c=d.h===heroNow()?S.color||null:null;sfx.click();ACT.heroes()};
ACT.pvColor=d=>{HPV.c=d.c||null;sfx.click();ACT.heroes()};
ACT.closeHero=()=>{HPV=null;closeModal()};
ACT.buyHero=()=>{const first=!S.hero,cur=heroNow();const cost=first?0:(HPV.h!==cur?HERO_COST:0)+((HPV.c||null)!==(S.color||null)?COLOR_COST:0);
 if(S.gems<cost)return;S.gems-=cost;S.hero=HPV.h;S.color=HPV.c||null;HPV=null;save();sfx.click();closeModal();show('home');if(!first)toast('New look!')};
ACT.pickHero=d=>ACT.pvHero(d);ACT.pickColor=d=>ACT.pvColor(d);
ACT.players=()=>{save();modal(`<h2>Who is playing?</h2><div class="players">${PROF.list.map(id=>{const d=id===PROF.cur?S:peek(id),h=d.hero||'pop';return `<button class="pl ${id===PROF.cur?'on':''}" data-act="pickPlayer" data-id="${id}">${zookSVG(d.equip||{},h,d.color||null)}<b>${esc(d.name||'New player')}</b><small>${d.hero?HEROES[h].name+' · ':''}Level ${levelOf(d.xp||0)}</small></button>`}).join('')}
 <button class="pl add" data-act="newPlayer"><span>+</span><b>New player</b></button></div><button class="btn alt" data-act="close">Close</button>`)};
/* hero must be picked before playing */
const _rh3=renderHome;renderHome=function(){_rh3();if(S.name&&!S.hero&&$('#modal').hidden)setTimeout(()=>{if(!S.hero&&$('#modal').hidden)ACT.heroes()},250)};

/* ================= V12: family sync (Netlify) ================= */
const SYNC={key:'kk-family',shortKey:'kk-family-short',api:'/api/keystone-sync',codeApi:'/api/keystone-family-code',t:null,busy:false,ok:null};
const famCode=()=>{try{return localStorage.getItem(SYNC.key)||''}catch(e){return ''}};
const famShort=()=>{try{return strongFamCode(famCode())?localStorage.getItem(SYNC.shortKey)||'':''}catch(e){return ''}};
const newFamCode=()=>{const b=crypto.getRandomValues(new Uint8Array(16));return [...b].map(x=>x.toString(16).padStart(2,'0')).join('')};
const strongFamCode=c=>/^[0-9a-f]{32}$/.test(c);
const syncHeaders=c=>({'x-keystone-code':c});
function localBundle(){const saves={};PROF.list.forEach(id=>{saves[id]=id===PROF.cur?S:peek(id)});return {prof:PROF,saves,t:Date.now()}}
function mergeBundle(r){if(!r||!r.saves)return false;let changed=false;const loc=localBundle();
 // keep local players whose id collides with a different remote kid
 Object.entries(loc.saves).forEach(([id,d])=>{const rd=r.saves[id];if(rd&&rd.name&&d.name&&rd.name!==d.name){const nid='p'+Date.now()+Math.floor(Math.random()*999);
  try{localStorage.setItem(pkey(nid),JSON.stringify(d));localStorage.removeItem(pkey(id))}catch(e){}PROF.list=PROF.list.map(x=>x===id?nid:x);if(PROF.cur===id)PROF.cur=nid;delete loc.saves[id];loc.saves[nid]=d;changed=true}});
 Object.entries(r.saves).forEach(([id,rd])=>{const d=loc.saves[id];if(!d||(rd.upd||0)>(d.upd||0)){try{localStorage.setItem(pkey(id),JSON.stringify(rd))}catch(e){}if(!PROF.list.includes(id))PROF.list.push(id);changed=true}});
 PROF.list=PROF.list.filter(id=>{const d=peek(id);return d.name||id===PROF.cur});if(!PROF.list.length)PROF.list=[PROF.cur];
 try{localStorage.setItem(PKEY,JSON.stringify(PROF))}catch(e){}if(changed)load();return changed}
async function syncPull(){const c=famCode();if(!c||SYNC.busy)return;try{const r=await fetch(SYNC.api,{cache:'no-store',headers:syncHeaders(c)});if(r.status===410)SYNC.revoked=true;if(!r.ok)throw 0;const j=await r.json();SYNC.ok=true;SYNC.revoked=false;
 if(mergeBundle(j.data)&&typeof screen!=='undefined')show(screen||'home');await syncPush(true)}catch(e){SYNC.ok=false}}
async function syncPush(now){const c=famCode();if(!c||SYNC.busy)return;clearTimeout(SYNC.t);const go=async(keep)=>{try{const r=await fetch(SYNC.api,{method:'PUT',headers:{'content-type':'application/json',...syncHeaders(c)},body:JSON.stringify(localBundle()),keepalive:!!keep});SYNC.ok=r.ok;if(r.status===410)SYNC.revoked=true}catch(e){SYNC.ok=false}};
 if(now)return go();SYNC.t=setTimeout(go,2500)}
const _save0=save;save=function(){S.upd=Date.now();_save0();syncPush()};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&famCode()){clearTimeout(SYNC.t);try{fetch(SYNC.api,{method:'PUT',headers:{'content-type':'application/json',...syncHeaders(famCode())},body:JSON.stringify(localBundle()),keepalive:true})}catch(e){}}else if(document.visibilityState==='visible')syncPull()});
const _set0=ACT.settings;ACT.settings=()=>{_set0();const c=famCode(),short=famShort(),box=$('#modal .mbox')||$('#modal'),done=box.querySelector('[data-act=close]');
 const message=!c?'Make a family code here, or enter one from another device. Keep it private.':
  SYNC.revoked?'This family code was changed on another device. Turn sync off here, then enter the new code.':
  SYNC.ok===false?'Can’t connect right now. Your progress is still saved on this device.':
  !strongFamCode(c)?'This older code is easy to guess. Change it to get a safer family link.':
  short?'Your family code is <b>'+esc(short)+'</b>. Type it on another device to share your saves. Keep it private.':
  'Your saves are ready. Make a short family code to use them on another device.';
 const actions=!c?'<input id="fam" maxlength="40" placeholder="FOX482" autocomplete="off"><button class="btn sm volt" data-act="syncGenerate">Make a code</button><button class="btn sm volt" data-act="syncOn">Use code</button>':
  SYNC.revoked?'<button class="btn sm alt" data-act="syncOff">Turn off</button>':
  !strongFamCode(c)?'<button class="btn sm volt" data-act="syncUpgradeAsk">Change code</button><button class="btn sm alt" data-act="syncOff">Turn off</button>':
  `${short?'<button class="btn sm volt" data-act="syncCopy">Copy code</button>':'<button class="btn sm volt" data-act="syncGenerate">Make a code</button>'}<button class="btn sm volt" data-act="syncUpgradeAsk">Change code</button><button class="btn sm alt" data-act="syncOff">Turn off</button>`;
 done.insertAdjacentHTML('beforebegin',`<div class="setrow sync"><span>Play on more than one device?<small class="muted">${message}</small></span><span class="namebox">${actions}</span></div>`)};
ACT.syncGenerate=async()=>{
 let secret=famCode();
 if(secret&&!strongFamCode(secret)){toast('Change your old code first');return}
 if(!secret){
  secret=newFamCode();
  try{localStorage.setItem(SYNC.key,secret)}catch(e){toast('Could not save the code');return}
  await syncPush(true);
  if(!SYNC.ok){toast('Can’t connect right now. Try again later.');ACT.settings();return}
 }
 try{
  const response=await fetch(SYNC.codeApi,{method:'POST',headers:syncHeaders(secret)});
  const body=await response.json();
  if(!response.ok||!body.code)throw 0;
  localStorage.setItem(SYNC.shortKey,body.code);
  toast('Your family code is ready!');
  ACT.settings();
 }catch(e){toast('Could not make a code. Try again.')}
};
ACT.syncCopy=async()=>{try{await navigator.clipboard.writeText(famShort());toast('Family code copied! Keep it private.')}catch(e){toast('Could not copy the code')}};
ACT.syncOn=async()=>{const v=($('#fam').value||'').trim().toLowerCase();if(v.length<6){toast('Enter a valid family code');return}
 let secret=v,short='';
 if(/^[a-z]{3}[0-9]{3}$/.test(v)){
  try{const r=await fetch(SYNC.codeApi,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({code:v})});const j=await r.json();if(!r.ok||!strongFamCode(j.secret)){toast(j.error||'That code was not found');return}secret=j.secret;short=v.toUpperCase()}
  catch(e){toast('Can’t check that code right now');return}
 }else if(!strongFamCode(v)){
  try{const r=await fetch(SYNC.api,{cache:'no-store',headers:syncHeaders(v)});const j=await r.json();if(!r.ok||!j.data){toast('That code was not found');return}}
  catch(e){toast('Can’t check that code right now');return}
 }
 try{localStorage.setItem(SYNC.key,secret);if(short)localStorage.setItem(SYNC.shortKey,short)}catch(e){}
 await syncPull();toast(SYNC.ok?'Family sync on!':'Can’t reach the server');ACT.settings()};
ACT.syncUpgradeAsk=()=>modal(`<h2>Change your family code?</h2><p>We’ll make a new code for everyone on this computer. The old code will stop working. If you play on other devices, enter the new code there too.</p><div class="rbtns"><button class="btn" data-act="syncUpgrade">Change code</button><button class="btn alt" data-act="settings">Cancel</button></div>`);
ACT.syncUpgrade=async()=>{const old=famCode();if(!old)return;const pendingKey='kk-family-upgrade';let next;
 try{const pending=JSON.parse(localStorage.getItem(pendingKey)||'null');next=pending?.old===old&&strongFamCode(pending.code)?pending.code:newFamCode();localStorage.setItem(pendingKey,JSON.stringify({old,code:next}))}catch(e){toast('Could not save the new code');return}
 clearTimeout(SYNC.t);
 try{let data=null;const existing=await fetch(SYNC.api,{cache:'no-store',headers:syncHeaders(next)});if(existing.ok)data=(await existing.json()).data;
  if(data){const oldState=await fetch(SYNC.api,{cache:'no-store',headers:syncHeaders(old)});if(oldState.status!==410)throw 0}
  if(!data){await syncPull();if(!SYNC.ok)throw 0;SYNC.busy=true;clearTimeout(SYNC.t);const r=await fetch(SYNC.api,{method:'POST',headers:{'content-type':'application/json',...syncHeaders(old)},body:JSON.stringify({newCode:next,bundle:localBundle()})});if(!r.ok)throw 0;data=(await r.json()).data}
  SYNC.busy=true;
  localStorage.setItem(SYNC.key,next);localStorage.removeItem(SYNC.shortKey);localStorage.removeItem(pendingKey);mergeBundle(data);SYNC.ok=true;SYNC.revoked=false;SYNC.busy=false;save();await syncPush(true);await ACT.syncGenerate()}
 catch(e){SYNC.busy=false;toast('Could not replace the code. Try again.')}};
ACT.syncOff=()=>{try{localStorage.removeItem(SYNC.key);localStorage.removeItem(SYNC.shortKey)}catch(e){}SYNC.ok=null;SYNC.revoked=false;toast('Sync off');ACT.settings()};
setTimeout(syncPull,400);

/* ================= V13: arcade diamonds + progress trackers ================= */
let runShareText='',runShareChallenge=null;
function shareRunHTML(game,stats){const arcadeGame={ 'Meteor Zap':'meteor','Scrambler Attack':'glitch','Keylori Race':'race','Bubble Pop':'bubble' }[game];runShareChallenge=arcadeGame&&G.challengeData?.g===arcadeGame?G.challengeData:null;const challenge=!!runShareChallenge,rematch=challenge&&typeof ghostRematchWon==='function'&&ghostRematchWon();runShareText=`Keyloria Kingdom — ${game}\n${stats}\n${rematch?'I beat your ghost! Can you beat mine?':challenge?'Can you beat my arcade ghost?':'Come explore Keyloria Kingdom and try it yourself!'}`;return `<button class="btn alt" data-act="copyRun">${rematch?'Send rematch challenge':arcadeGame?'Challenge a friend':'Share result'}</button>`}
ACT.copyRun=async()=>{try{await navigator.clipboard.writeText(runShareText);toast('Result copied!')}catch(e){toast('Could not copy the result')}};
let ARC_X=()=>({easy:.75,medium:1,hard:1.5})[S.set.arcd]||1;
function arcReward(parts){const x=ARC_X();let tot=0;const rows=parts.filter(p=>p[1]>0).map(([t,n])=>{tot+=n;return `<div><span>${t}</span><b>+${n}</b></div>`});
 if(x!==1&&tot){const extra=Math.round(tot*x)-tot;rows.push(`<div><span>${S.set.arcd==='beast'?'BEAST bonus':x>1?'Hard bonus':'Easy speed'}</span><b>${extra>=0?'+':''}${extra}</b></div>`);tot+=extra}
 tot=Math.max(tot,parts.some(p=>p[1]>0)?1:0);
 const bb=beastBeat();if(bb){tot+=bb[1];rows.push(`<div class="bbeat"><span>${bb[0]}</span><b>+${bb[1]}</b></div>`)}S.gems+=tot;
 const g=ICON.gem.replace('<svg','<svg width="26" height="26"');
 return {tot,html:`<div class="reward"><div class="rtot">${g}<b>+${tot}</b><span>diamonds</span></div>${rows.join('')}</div>`}}
const accPts=a=>a>=95?3:a>=85?2:a>=70?1:0;
function patchRewardModal(r){const st=$('#mbox .rstats');if(!st)return;[...st.children].forEach(d=>{if(/Gems/.test(d.textContent))d.remove()});st.insertAdjacentHTML('afterend',r.html)}
endMeteor=function(){G.done=true;setTarget(null);const acc=G.hits+G.errs?Math.round(G.hits/(G.hits+G.errs)*100):100,best=G.score>S.arc.meteor;if(best)S.arc.meteor=G.score;
 const mins=Math.max((performance.now()-(G.runStart||G.t0||performance.now()))/60000,1/60),wpm=Math.round(G.hits/5/mins);
 const r=arcReward([['Meteors zapped',Math.floor(G.zapped/4)],['Accuracy',accPts(acc)],['Shields left',G.shields],['New best',best?2:0]]);S.xp+=G.hits;const egg=G.zapped?dailyEgg():null;save();sfx.win();
 modal(`<h2>${G.shields>0?'You win!':'Nice try!'}</h2><div class="hero-mini">${zookSVG()}</div>${best?'<div class="banner gold">New best score!</div>':''}${eggBanner(egg)}
 <h3>Your run</h3><div class="rstats"><div><b>${G.score}</b><span>Score</span></div><div><b>${wpm}</b><span>Words per minute</span></div><div><b>${acc}%</b><span>Accuracy</span></div><div><b>${G.zapped}/${G.total}</b><span>Zapped</span></div></div>${r.html}
 ${typeof ghostArcadeSummary==='function'?ghostArcadeSummary():''}<div class="rbtns"><button class="btn" data-act="meteor">Play again</button>${shareRunHTML('Meteor Zap',`${G.score} points · ${wpm} WPM · ${acc}% accuracy`)}<button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`)};
endRace=function(){G.done=true;setTarget(null);const secs=(performance.now()-G.start)/1000,len=G.text.length,wpm=Math.round(len/5/Math.max(secs/60,1/60)),acc=Math.round((len-G.mist.size)/len*100),pl=1+G.racers.filter(r=>r.fin).length;
 const r=arcReward([['Place',[5,3,2,1][pl-1]],['Speed',Math.floor(wpm/8)],['Accuracy',accPts(acc)]]);S.xp+=len;if(pl===1)S.arc.race++;S.hist.push({t:Date.now(),w:wpm,a:acc});if(S.hist.length>80)S.hist.shift();S.time+=Math.round(secs);sessionSecs+=secs;const egg=dailyEgg();save();sfx.win();
 setTimeout(()=>modal(`<h2>${pl===1?'You won the race!':ORD[pl-1]+' place!'}</h2><div class="hero-mini">${zookSVG()}</div>${eggBanner(egg)}
 <h3>Your run</h3><div class="rstats"><div><b>${ORD[pl-1]}</b><span>Place</span></div><div><b>${wpm}</b><span>Words per minute</span></div><div><b>${acc}%</b><span>Accuracy</span></div></div>${typeof ghostRaceSummary==='function'?ghostRaceSummary():''}${r.html}
 <div class="rbtns"><button class="btn" data-act="race">Race again</button>${shareRunHTML('Keylori Race',`${ORD[pl-1]} place · ${wpm} WPM · ${acc}% accuracy`)}<button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`),600)};
endGlitch=function(win){G.done=true;setTarget(null);const acc=G.hits+G.errs?Math.round(G.hits/(G.hits+G.errs)*100):100;const grade=win&&acc>=95&&G.hearts>=4?'S':acc>=90&&win?'A':acc>=80?'B':'C';
 const mins=Math.max((performance.now()-(G.runStart||G.t0||performance.now()))/60000,1/60),wpm=Math.round(G.hits/5/mins);
 const best=G.score>S.arc.glitch;if(best)S.arc.glitch=G.score;if(win)S.arc.gwin++;
 const r=arcReward([['Scramblers zapped',Math.floor(G.kills/2)],['Keylori saved',G.rescued*2],['Beat the boss',win?4:0],['Grade '+grade,{S:5,A:3,B:2,C:0}[grade]],['New best',best?2:0]]);S.xp+=G.hits;const egg=G.hits>10?dailyEgg():null;save();
 modal(`<h2>${win?'You win!':'Try again!'}</h2><div class="grade g${grade}">${grade}</div>${best?'<div class="banner gold">New best score!</div>':''}${eggBanner(egg)}
 <h3>Your run</h3><div class="rstats"><div><b>${G.score}</b><span>Score</span></div><div><b>${wpm}</b><span>Words per minute</span></div><div><b>${acc}%</b><span>Accuracy</span></div><div><b>${G.maxCombo}</b><span>Best combo</span></div></div>${r.html}
 ${typeof ghostArcadeSummary==='function'?ghostArcadeSummary():''}<div class="rbtns"><button class="btn" data-act="glitch">Play again</button>${shareRunHTML('Scrambler Attack',`${G.score} points · ${wpm} WPM · ${acc}% accuracy`)}<button class="btn alt" data-act="go" data-to="arcade">Arcade</button></div>`)};
/* --- level tracker: hero walks to the flag --- */
const FLAG=["oo......","oRRRRo..","oRrRRRRo","oRRRRRRo","oRRRro..","oo......","o.......","o.......","o.......","oo......"];
const flagURL=()=>PXU.flag||(PXU.flag=PXG(FLAG,{o:'#2a1d3e',R:'#e8584f',r:'#f6a09a'}).toDataURL());
function trackerHTML(id){return `<div class="trk" id="${id}"><div class="trk-bar"><i></i></div><div class="trk-hero">${zookSVG()}</div><img class="trk-flag" src="${flagURL()}" alt=""><span class="trk-pct">0%</span></div>`}
function ensureTrackers(){if(!$('#trkP')){$('#strip').parentElement.insertAdjacentHTML('afterbegin',trackerHTML('trkP'))}if(!$('#trkG')){$('#garena').insertAdjacentHTML('beforebegin',trackerHTML('trkG'))}}
function setTrk(el,f,label){if(!el)return;f=Math.max(0,Math.min(1,f||0));el.querySelector('.trk-bar i').style.width=(f*100)+'%';el.querySelector('.trk-hero').style.left=`calc((100% - 170px) * ${f} - ${f*34}px)`;el.querySelector('.trk-pct').textContent=label||Math.round(f*100)+'%'}
function glitchProgress(){
 const W=G.waves+1;
 if(G.boss?.dead&&G.hearts>0)return {fraction:1,label:'Boss beaten!',wave:W,done:G.bmax||3,total:G.bmax||3};
 if(G.boss&&!G.boss.dead){
  const boss=G.boss;G.bmax=G.bmax||boss.hp;
  const text=String(boss.txt||''),words=Math.max(1,text.trim().split(/\s+/).length);
  const typed=text.slice(0,boss.typed||0);
  const done=Math.min(words,(typed.match(/\S+\s+/g)||[]).length+(text.length&&(boss.typed||0)>=text.length?1:0));
  const hits=G.bmax-boss.hp;
  const fraction=(G.waves+(hits+done/words)/G.bmax)/W;
  G.bossProgressPeak=Math.max(G.bossProgressPeak||0,fraction);
  return {fraction:G.bossProgressPeak,label:`Boss · ${done}/${words} words`,wave:W,done,total:words};
 }
 const wave=Math.min(Math.max(G.wave,1),G.waves),done=Math.min(G.waveWordsTyped||0,G.waveWordsTotal||0),total=G.waveWordsTotal||1;
 return {fraction:(wave-1+done/total)/W,label:`Wave ${wave} · ${done}/${total}`,wave,done,total};
}
let trkHero='';
setInterval(()=>{ensureTrackers();const hk=(S.hero||'')+(S.color||'')+JSON.stringify(S.equip);if(hk!==trkHero){trkHero=hk;document.querySelectorAll('.trk-hero').forEach(h=>h.innerHTML=zookSVG())}
 const tp=$('#trkP');if(tp){const on=typeof P!=='undefined'&&P.text&&(P.phase==='play'||P.phase==='done'||P.phase==='end');tp.style.visibility=on?'visible':'hidden';if(on){const left=P.text.slice(P.pos).split(' ').filter(Boolean).length;setTrk(tp,P.pos/P.text.length,left?`${left} word${left>1?'s':''} left`:'Done!')}}
 const tg=$('#trkG');if(tg&&typeof G!=='undefined'&&G&&G.type){let f=0,lab='';
  if(G.type==='meteor'){f=(G.spawned-G.m.length)/G.total;lab=`${Math.max(0,G.total-(G.spawned-G.m.length))} left`}
  else if(G.type==='race'){f=G.pos/G.text.length;lab=Math.round(f*100)+'%'}
  else if(G.type==='glitch'){const progress=glitchProgress();f=progress.fraction;lab=progress.label}
  else if(G.type==='bubble'){const n=G.popped+G.missed;f=n/G.total;lab=`${G.total-n} left`}
  else if(G.type==='dig'){f=G.li/G.L.length;lab=`${G.li} layers`}
  else if(G.type==='keeper'){f=Math.min(1,G.fed/G.goal);lab=`${G.fed}/${G.goal} fed`}
  else if(G.type==='bridge'){f=G.pos/G.text.length;lab=`${G.wi}/${G.words.length} words`}
  if(G.done&&G.type!=='glitch')f=1;setTrk(tg,f,lab);if(typeof ghostWaveDisplay==='function')ghostWaveDisplay()}},150);
/* --- whole-game progress on home --- */
const _rh4=renderHome;renderHome=function(){_rh4();const xb=$('#s-home .trow');if(!xb||!S.name)return;const tot=LESSONS.length*8,done=Object.keys(S.best).length,pc=Math.round(done/tot*100);
 xb.insertAdjacentHTML('afterend',`<div class="gprog"><div class="gp-top"><span>Whole game</span><b>${pc}% done</b></div><div class="gp-bar"><i style="width:${pc}%"></i></div><small>${done} of ${tot} levels · World ${worldOf(Math.min(LESSONS.length-1,(typeof EI==='function'?EI(Math.floor(nextStage()/8)):Math.floor(nextStage()/8))))} of ${WORLDS.length}</small></div>`)};

/* ================= V14: delete player ================= */
const TRASH=[".oooooo.","oHHHHHHo","oooooooo",".oLoLoL.",".oLoLoL.",".oLoLoL.",".oLoLoL.",".oooooo."];
const trashURL=()=>PXU.trash||(PXU.trash=PXG(TRASH,{o:'#2a1d3e',H:'#c8bedc',L:'#8a80a8'}).toDataURL());
const _pl1=ACT.players;ACT.players=()=>{_pl1();document.querySelectorAll('#mbox .players .pl[data-id]').forEach(b=>{const w=document.createElement('div');w.className='plwrap';b.replaceWith(w);w.appendChild(b);
 w.insertAdjacentHTML('beforeend',`<button class="pldel" data-act="delAsk" data-id="${b.dataset.id}" aria-label="Delete player"><img src="${trashURL()}" alt=""></button>`)})};
ACT.delAsk=d=>{const p=d.id===PROF.cur?S:peek(d.id),nm=esc(p.name||'New player');sfx.click();
 modal(`<h2>Delete ${nm}?</h2><div class="hero-mini">${zookSVG(p.equip||{},p.hero||'pop',p.color||null)}</div><p class="delwarn">All of ${nm}'s cards, stars and diamonds will be gone forever.</p>
 <div class="rbtns"><button class="btn danger" data-act="delYes" data-id="${d.id}">Yes, delete</button><button class="btn alt" data-act="players">No, keep</button></div>`)};
ACT.delYes=d=>{const id=d.id;PROF.del=[...new Set([...(PROF.del||[]),id])];PROF.list=PROF.list.filter(x=>x!==id);try{localStorage.removeItem(pkey(id))}catch(e){}
 if(PROF.cur===id){if(PROF.list.length)PROF.cur=PROF.list[0];else{const nid='p'+Date.now();PROF.list=[nid];PROF.cur=nid;try{localStorage.setItem(pkey(nid),JSON.stringify(DEF))}catch(e){}}
  try{localStorage.setItem(PKEY,JSON.stringify(PROF))}catch(e){}load()}
 try{localStorage.setItem(PKEY,JSON.stringify(PROF))}catch(e){}save();syncPush(true);toast('Player deleted');show('home');ACT.players()};
/* sync: honor deletions everywhere */
localBundle=function(){const saves={};PROF.list.forEach(id=>{saves[id]=id===PROF.cur?S:peek(id)});return {prof:{list:PROF.list,del:PROF.del||[]},saves,t:Date.now()}};
const _mb=mergeBundle;mergeBundle=function(r){if(r&&r.prof&&r.prof.del&&r.prof.del.length){PROF.del=[...new Set([...(PROF.del||[]),...r.prof.del])];const gone=PROF.list.filter(id=>PROF.del.includes(id));
  gone.forEach(id=>{try{localStorage.removeItem(pkey(id))}catch(e){}});PROF.list=PROF.list.filter(id=>!PROF.del.includes(id));
  if(!PROF.list.length){const nid='p'+Date.now();PROF.list=[nid]}if(!PROF.list.includes(PROF.cur))PROF.cur=PROF.list[0];
  r={...r,saves:Object.fromEntries(Object.entries(r.saves||{}).filter(([id])=>!PROF.del.includes(id)))};const ch=_mb(r);if(gone.length&&!ch)load();return ch||gone.length>0}return _mb(r)};


/* ================= V15: modal always fits the window ================= */
function fitModal(){const m=$('#mbox');if(!m||$('#modal').hidden)return;m.style.removeProperty('zoom');m.style.removeProperty('max-height');m.style.removeProperty('overflow')}
const _modal0=modal;modal=function(h){_modal0(h);fitModal();$('#mbox').scrollTop=0};

/* ================= V16: BEAST MODE ================= */
const BEAST={
 s:['rhythm','sphinx','zephyr','quartz','jinxed','xylem','fjord','glyph','psyche','myth','yacht','twelfth','sixths','colonel','queue','gnome','knack','wry','tsk-tsk','awry','lymph','crypt','pygmy','sylph','gypsum'],
 m:['pharaoh','bourgeois','silhouette','mnemonic','kaleidoscope','conscience','quizzical','liaison','misspell','embarrass','occurrence','millennium','threshold','archipelago','handkerchief','entrepreneur','privilege','maneuver','Wednesday','labyrinth','aesthetic','jeopardy','rhinoceros','vacuum','pseudonym','#42-B','$1,299.99','3:45 p.m.','(x+y)/2','A+ grade'],
 l:['onomatopoeia','serendipity','idiosyncrasy','conscientious','pneumonia','chrysanthemum','bureaucracy','sesquipedalian','Wednesday morning','acquaintance','accommodate',"hors d'oeuvre",'rendezvous','questionnaire','psychoanalysis','hippopotamus','x = (y^2) / 4','50 km/h','C++ & code!','"Quick!" she said.','50% off; ~$19.99','#1 & #2 @ noon','the glacier\'s ice']};
const BEAST_SENT=["A hummingbird's heart can beat over 1,000 times a minute!", "Jupiter's Great Red Spot is a storm wider than Earth.", "\"Octopuses have three hearts,\" said the marine biologist.", "Is a tomato a fruit? Yes; it holds the plant's seeds.", "Light from the sun takes about 8 minutes to reach us.", "Chameleons can move each eye on its own: up, down, or sideways.", "Water boils at 100 degrees Celsius (212 Fahrenheit) at sea level.", "An adult's skeleton has 206 bones; a baby's has more.", "The cheetah (the fastest land animal) can reach 100 km/h.", "Hippopotamuses, rhinoceroses, and giraffes are all herbivores.", "Mount Everest, at 8,849 meters, is Earth's highest peak.", "Saturn's rings are made of ice, dust, and rock.", "Sound travels about 343 meters per second through air.", "The Pacific Ocean is larger than all of Earth's land combined.", "Bats aren't blind; many also use echoes to hunt at night.", "Antarctica is Earth's coldest, windiest, and driest continent."];
DIFF.beast='BEAST MODE';
const _dm0=diffMult;diffMult=()=>S.set.arcd==='beast'?3.4:_dm0();
const isBeast=()=>S.set.arcd==='beast';
function beastKeys(){setAvail(new Set([...keyEls.keys()]),true);applyLabels()}
const _gw0=gw;gw=size=>isBeast()&&G.beast?rand(BEAST[size]):_gw0(size);
const _bp0=bossPhrase;bossPhrase=function(){if(!(isBeast()&&G.beast))return _bp0();const b=G.boss;b.txt=typeof beastBossText==='function'?beastBossText():rand(BEAST_SENT);b.typed=0;b.t=0;b.lim=b.txt.length/7+2.5;paintLab(b);gHint()};
const _sg2=startGlitch;startGlitch=function(){_sg2();if(isBeast()){G.beast=true;G.speed=3.4;beastKeys()}};
const _sm2=startMeteor;startMeteor=function(){_sm2();if(isBeast()){G.beast=true;G.speed=4.2;G.words=[...BEAST.s,...BEAST.m];G.set=[...BEAST.s];G.total=Math.round(30*S.set.len);beastKeys()}};
const _sr2=startRace;startRace=function(){_sr2();if(isBeast()){G.beast=true;G.text=fillSent(BEAST_SENT,Math.round(240*S.set.len));G.pos=0;G.mist=new Set();
 [72,82,94].forEach((w,k)=>G.racers[k].w=w);beastKeys();try{const box=$('#gstripIn');if(box){box.innerHTML=[...G.text].map(c=>`<span class="${c===' '?'sp':''}">${c===' '?'·':esc(c)}</span>`).join('')}}catch(e){}if(typeof raceStrip==='function')raceStrip()}};
const _ax0=ARC_X;ARC_X=()=>isBeast()?2:_ax0();


/* ================= V17: home menu always fits the window ================= */
function homeCols(on){const t=$('#s-home .tcard');if(!t)return;const L=t.querySelector(':scope>.tc-l'),R=t.querySelector(':scope>.tc-r');
 if(on&&!L){const l=document.createElement('div'),r=document.createElement('div');l.className='tc-l';r.className='tc-r';
  [...t.children].forEach(c=>(c.matches('.hbtns,.eggrow,p,.note')?r:l).appendChild(c));t.append(l,r)}
 else if(!on&&L){[...L.children,...R.children].forEach(c=>t.insertBefore(c,L));L.remove();R.remove()}}
function fitHome(){const h=document.getElementById('s-home');if(!h||h.hidden)return;h.style.transform='';h.style.marginBottom='';h.classList.remove('wide');document.body.classList.remove('homewide');homeCols(false);
 if(innerWidth<700)return;const room=()=>innerHeight-(h.getBoundingClientRect().top+scrollY)-16;
 if(h.offsetHeight>room()&&innerWidth>=900){h.classList.add('wide');document.body.classList.add('homewide');homeCols(true)}
 const H=h.offsetHeight,z=Math.max(.35,Math.min(1,room()/H));
 if(z<1){h.style.transformOrigin='top center';h.style.transform=`scale(${z.toFixed(3)})`;h.style.marginBottom=(-H*(1-z)).toFixed(0)+'px'}}
const _rh5=renderHome;renderHome=function(){_rh5();requestAnimationFrame(fitHome);setTimeout(fitHome,150)};
addEventListener('resize',()=>{fitHome();fitModal()});


function beastBeat(){if(typeof G==='undefined'||!G||!G.beast||S.set.arcd!=='beast')return null;
 const BN='BEAST MODE beaten!';if(G.type==='glitch')return G.boss&&G.boss.dead&&G.hearts>0?[BN,30]:null;
 if(G.type==='meteor')return G.shields>0?[BN,25]:null;
 if(G.type==='race'){const pl=1+G.racers.filter(r=>r.fin).length;return pl===1?['Beat the BEAST racers!',30]:pl===2?['BEAST race finish',10]:null}return null}

/* ================= V18: 8 levels per lesson, points evolution, rare finds ================= */
const NST=8,STAGES8=['Warm-up','Practice','Mix-up','Mix-up 2','Word Hunt','Word Battle','Speed Battle','Final Battle'];
const EVO_PTS=[0,8,16],BAND=[[0,1,2],[3,4,5],[6,7]];
const lessonPts=i=>{let t=0;for(let s=0;s<NST;s++)t+=S.best[i+'-'+s]||0;return t};
const formNow=i=>{const p=lessonPts(i);return p>=EVO_PTS[2]?2:p>=EVO_PTS[1]?1:0};
function migrate8(){if(S.v8)return;const nb={},M={0:[0,1,2],1:[3,4,5],2:[6,7]};
 Object.entries(S.best||{}).forEach(([k,v])=>{const [i,s]=k.split('-').map(Number);(M[s]||[s]).forEach(ns=>{const nk=i+'-'+ns;nb[nk]=Math.max(nb[nk]||0,v)})});
 S.best=nb;const sk0=S.skip||0;S.skip=Math.floor(sk0/3)*NST+[0,3,6][sk0%3];S.v8=1;try{localStorage.setItem(pkey(PROF.cur),JSON.stringify(S))}catch(e){}}
const _ld8=load;load=function(){_ld8();migrate8()};
const _gt8=genText;genText=function(i,s,pr){if(pr||(typeof P!=='undefined'&&P.mode==='place'))return _gt8(i,s,pr);const L0=S.set.len;S.set.len=L0*.8;try{return _gt8(i,[0,0,1,1,1,2,2,2][s]??s,pr)}finally{S.set.len=L0}};
/* --- color helpers --- */
function hex2hsl(h){let r=parseInt(h.slice(1,3),16)/255,g=parseInt(h.slice(3,5),16)/255,b=parseInt(h.slice(5,7),16)/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H=0,S_=0,L=(mx+mn)/2;
 if(mx!==mn){const d=mx-mn;S_=L>.5?d/(2-mx-mn):d/(mx+mn);H=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;H*=60}return [H,S_,L]}
function hsl2hex(H,S_,L){H=((H%360)+360)%360;const c=(1-Math.abs(2*L-1))*S_,x=c*(1-Math.abs((H/60)%2-1)),m=L-c/2;let r,g,b;[r,g,b]=H<60?[c,x,0]:H<120?[x,c,0]:H<180?[0,c,x]:H<240?[0,x,c]:H<300?[x,0,c]:[c,0,x];
 return '#'+[r,g,b].map(v=>Math.round(Math.min(1,Math.max(0,v+m))*255).toString(16).padStart(2,'0')).join('')}
const CW={frost:{n:'Frost',h:198,s:.5,l:1.06},ember:{n:'Ember',h:16,s:.72,l:1},jade:{n:'Jade',h:152,s:.5,l:1},shadow:{n:'Shadow',h:262,s:.32,l:.62},sunny:{n:'Sunny',h:46,s:.78,l:1.08}};
function cwPal(pal,cw){const T=CW[cw];if(!T)return pal;const out={};Object.entries(pal).forEach(([k,c])=>{if(typeof c!=='string'||c[0]!=='#'||KEEP.has(k)){out[k]=c;return}
 const [h,s,l]=hex2hsl(c);out[k]=k==='o'?hsl2hex(T.h,.45,.13):hsl2hex(T.h+(h%40)-20,Math.min(1,T.s*(.6+s*.6)),Math.min(.95,l*T.l))});return out}
/* --- props --- */
const PROPS={bow:{n:'Red Bow',side:1,r:["oo...oo","oRo.oRo","oRRoRRo","oRo.oRo","oo...oo"],p:{o:'#3a1214',R:'#d8483a'}},
 flower:{n:'Flower',side:1,r:[".o.o.","oWoWo",".oyo.","oWoWo",".o.o."],p:{o:'#3a2a1a',W:'#fff6e0',y:'#f0c860'}},
 tophat:{n:'Top Hat',side:0,r:[".oooooo.",".oKKKKo.",".oKKKKo.",".oRRRRo.","oooooooo"],p:{o:'#120c18',K:'#3a3248',R:'#d8483a'}},
 party:{n:'Party Hat',side:0,r:["..y..","..o..",".oCo.",".oCo.","oCyCo","oCCCo","ooooo"],p:{o:'#1a2a3a',C:'#6cc8e0',y:'#f0c860'}},
 sprout:{n:'Lucky Sprout',side:1,r:["oo..","oLo.",".oLo","..o.","..o."],p:{o:'#14240f',L:'#7fc858'}}};
/* outlines: a deep shade of the Keylori's own color instead of hard black (dark Keylori keep their dark outline) */
function softOutline(pal,tier){if(tier||!pal.o)return pal;const base=pal.D||pal.B;if(!base||!/^#[0-9a-f]{6}$/i.test(base))return pal;
 const l=lum(base);if(l<62)return pal;const [h,s0]=hex2hsl(base);const o=hsl2hex(h,Math.min(.55,s0*.9),Math.max(.13,Math.min(.2,l/255*.32)));return Object.assign({},pal,{o})}
/* head anchors: find eyes, head top contour and head width so accessories sit ON the head */
const ANCH={};
function kAnchor(k){if(ANCH[k])return ANCH[k];const rows=KKDATA.spr[k],w=rows[0].length,h=rows.length,at=(x,y)=>(rows[y]||'')[x]||'.';
 const tops=[];for(let x=0;x<w;x++){let t=-1;for(let y=0;y<h;y++)if(at(x,y)!=='.'){t=y;break}tops.push(t)}
 const eyes=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(at(x,y)==='w'){let near=false;for(let a=-2;a<=2&&!near;a++)for(let b=-2;b<=2;b++)if(at(x+a,y+b)==='k'){near=true;break}if(near)eyes.push([x,y])}
 let X0=w,X1=0,Y0=h,Y1=0;rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'){X0=Math.min(X0,x);X1=Math.max(X1,x);Y0=Math.min(Y0,y);Y1=Math.max(Y1,y)}}));
 let hx=Math.round((X0+X1)/2),ey=Math.round((Y0+Y1)/2);
 if(eyes.length){const xs=eyes.map(e=>e[0]).sort((a,b)=>a-b);hx=Math.round((xs[0]+xs[xs.length-1])/2);ey=Math.min(...eyes.map(e=>e[1]))}
 let hl=hx,hr=hx;const row=rows[ey]||'';for(let x=hx;x>=0&&row[x]&&row[x]!=='.'&&row[x]!=='o';x--)hl=x;for(let x=hx;x<w&&row[x]&&row[x]!=='.'&&row[x]!=='o';x++)hr=x;
 if(eyes.length){const xs=eyes.map(e=>e[0]);hl=Math.min(hl,Math.min(...xs)-1);hr=Math.max(hr,Math.max(...xs)+1)}
 let chin=-1;for(let y=ey;y<=Math.min(h-1,ey+14);y++)for(let x=hl;x<=hr;x++)if("Mm".includes(at(x,y)))chin=Math.max(chin,y);
 if(chin<0){for(let y=ey;y<=Math.min(h-1,ey+7);y++)for(let x=hl;x<=hr;x++)if(at(x,y)==='n')chin=Math.max(chin,y+1)}if(chin<0)chin=ey+5;
 const med=(a,b)=>{const v=[];for(let x=a;x<=b;x++)if(tops[x]>=0)v.push(tops[x]);if(!v.length)return Y0;v.sort((m,n)=>m-n);return v[Math.floor(v.length/2)]};
 return ANCH[k]={tops,hx,ey,chin,hl,hr,X0,X1,Y0,Y1,med,top:x=>{const t=tops[Math.max(0,Math.min(w-1,x))];return t<0?med(x-2,x+2):t},med2:(a,b)=>med(a,b)}}
/* --- evolution art: baby soft, teen marked, grown bold --- */
function evolvedV(i,f,tier,v={}){const D=KKDATA,k=D.order[i],rows=D.spr[k],w=rows[0].length;let pal=tierPal(cwPal(D.pal[k],v.cw),tier);
 pal=softOutline(pal,tier);
 if(f===0){const p=Object.assign({},pal);if(pal.L&&pal.H)p.L=pal.H;if(pal.B&&pal.L)p.B=pal.L;if(pal.D&&pal.B)p.D=pal.B;pal=p}
 const Wd=w+16,H=w+8,ox=8,oy=8,c=document.createElement('canvas');c.width=Wd;c.height=H;const g=c.getContext('2d');
 const put=(x,y,col)=>{if(col){g.fillStyle=col;g.fillRect(x,y,1,1)}};
 const draw=(r,x0,y0,p,flip)=>r.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch!=='.')put(flip?x0+row.length-1-x:x0+x,y0+y,p[ch])}));
 let X0=w,X1=0,Y0=w,Y1=0;rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'){X0=Math.min(X0,x);X1=Math.max(X1,x);Y0=Math.min(Y0,y);Y1=Math.max(Y1,y)}}));
 const AN=kAnchor(k),cx=AN.hx,ev=(EVO[i]||[['crest'],['wings','aura']]),feats=f===0?[]:ev[f-1],gp=Object.assign({y:'#f6d050',Y:'#c8981e',r:'#e84a6a'},pal);
 if(feats.includes('aura')){const ring=tier==='diamond'?'#bfe2f6':tier==='gold'?'#f6dc7a':pal.L||'#ffffff';g.globalAlpha=.55;
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.')[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].forEach(([a,b])=>{const q=rows[y+b];if(!q||q[x+a]===undefined||q[x+a]==='.')put(ox+x+a,oy+y+b,ring)})}));g.globalAlpha=1}
 if(feats.includes('wings')){const A=kAnchor(k),wr=Math.round((Y0+w*.58)/2)+2;let xl=99,xr=-1;for(let y=wr;y<=wr+5;y++){const r=rows[y]||'';for(let x=0;x<r.length;x++)if(r[x]!=='.'){xl=Math.min(xl,x);xr=Math.max(xr,x)}}if(xr<0){xl=X0;xr=X1}
  if(xl>A.hx-3)xl=X0;if(xr<A.hx+3)xr=X1;draw(OVL.wing,ox+xl-7,oy+wr,pal,false);draw(OVL.wing,ox+xr,oy+wr,pal,true)}
 // body: teen gets stripe markings + a belly band; grown gets bold dark markings
 const mid=Math.round((Y0+Y1)/2);
 rows.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='.')return;let col=pal[ch];
  if(f===1&&(ch==='B'||ch==='L'||ch==='H')&&y>=Y0+2&&y<=mid&&(x-cx+40)%4===1&&row[x-1]!=='o'&&row[x+1]!=='o')col=pal.D||col;
  put(ox+x,oy+y,col)}));
 if(f===1){const sc=(TYPES[SPECIES[i].t]||'#e8584f');let [hh,ss,ll]=hex2hsl(sc);if(hh>280&&hh<345)hh=8;const S1=hsl2hex(hh,Math.min(.75,ss),.55),S2=hsl2hex(hh,Math.min(.75,ss),.36),O=pal.o||'#1b1626',ty=Math.min(Y1-2,AN.chin+4);
  let xa=99,xb=-1;for(let yy=ty;yy<=ty+1;yy++){const r=rows[yy];if(!r)continue;for(let x=0;x<r.length;x++)if(r[x]!=='.'&&r[x]!=='o'){xa=Math.min(xa,x);xb=Math.max(xb,x)}}
  const onBody=(by,hf)=>{for(let r=-1;r<=hf;r++){const q=rows[by+r]||'';if(!q[cx]||q[cx]==='.')return false;const ww=hf-Math.max(0,r);if(q[cx-ww]==='.'||q[cx+ww]==='.')return false}return true};
  const half0=Math.max(3,Math.min(5,Math.floor((xb-xa)/4)));
  if(xb>xa&&AN.chin+3<=Y1-4&&onBody(AN.chin+3,half0)){const by=AN.chin+3,half=half0;
   // bandana: a triangle hanging from the neck, knot on top, shaded + outlined
   for(let r=0;r<=half;r++){const w=half-r;for(let x=-w;x<=w;x++){const edge=x===-w||x===w;put(ox+cx+x,oy+by+r,edge?O:(x>0?S2:S1))}}
   put(ox+cx,oy+by+half+1,O);for(let x=-half-1;x<=half+1;x++){put(ox+cx+x,oy+by-1,O)}for(let x=-half;x<=half;x++)put(ox+cx+x,oy+by,x>0?S2:S1);
   put(ox+cx-1,oy+by+1,'#ffffff');}}
 if(feats.includes('horns')){const hw=Math.max(2,Math.min(6,Math.floor((AN.hr-AN.hl)/2)-2)),xa=cx-hw-1,xb=cx+hw-1;const hp={o:pal.o||'#1b1626',H:'#fff6e0',L:'#e8d4a8',B:'#b8946a'};draw(OVL.horn,ox+xa,oy+AN.top(xa+1)-3,hp,false);draw(OVL.horn,ox+xb,oy+AN.top(xb+1)-3,hp,true)}
 if(feats.includes('crest')){let [hh,ss]=hex2hsl(TYPES[SPECIES[i].t]||'#e8584f');if(hh>280&&hh<345)hh=8;const cp={o:pal.o||'#1b1626',H:hsl2hex(hh,Math.min(.75,ss),.72),L:hsl2hex(hh,Math.min(.75,ss),.55),B:hsl2hex(hh,Math.min(.75,ss),.38)};draw(OVL.crest,ox+cx-2,oy+AN.med2(cx-1,cx+1)-2,cp,false)}
 if(feats.includes('crown'))draw(OVL.crown,ox+cx-6,oy+AN.med2(cx-3,cx+3)-3,gp,false);
 const pr=PROPS[v.prop];if(pr){const pw=pr.r[0].length,ph=pr.r.length;if(pr.side){const sx=Math.min(AN.hr-pw+1,Math.max(cx+2,Math.round((cx+AN.hr)/2)-1));draw(pr.r,ox+sx,oy+AN.med2(sx,sx+pw-1)-ph+2,pr.p,false)}else{const sx=cx-Math.floor(pw/2);draw(pr.r,ox+sx,oy+AN.med2(sx+1,sx+pw-2)-ph+1,pr.p,false)}}
 if(f===2||tier||v.cw){const sp=tier==='diamond'?['#ffffff','#bfe2f6']:v.cw&&!tier?['#ffffff','#c8e8f0']:['#fff4c8','#f6d050'];[[2,3],[Wd-4,6],[1,H-12],[Wd-2,H-8],[Wd-10,1]].forEach(([x,y])=>{put(x,y,sp[0]);put(x-1,y,sp[1]);put(x+1,y,sp[1]);put(x,y-1,sp[1]);put(x,y+1,sp[1])})}
 return c}
function creatureSVG(i,form,cls='',tier){const k=KKDATA.order[i],w=KKDATA.spr[k][0].length,Wd=w+16,H=w+8,px=/\bpx\b/.test(cls),s=px||/\bbig\b/.test(cls)?1:[.6,.8,1][form],fit=/\bfit\b/.test(cls);
 const v=(S.kv&&S.kv[i])||{},unit=fit?Math.min(5,200/Wd)*(w/24>1&&!/\bbig\b/.test(cls)?24/w*1.05:1):px?5*Math.min(1,30/w):5,iw=Wd*unit*s,ih=H*unit*s,u=kku('e11'+i+'-'+form+(tier||'')+(v.cw||'')+(v.prop||''),()=>upPx(evolvedV(i,form,tier,v),6));
 const y=fit?(200-ih)/2+ih*.06:200-ih;
 return `<svg class="cr ${cls} ${tier||''}" viewBox="0 0 200 200" aria-hidden="true" style="overflow:visible"><image href="${u}" x="${(200-iw)/2}" y="${y}" width="${iw}" height="${ih}"/></svg>`}
/* --- rare finds --- */
function rollLucky(i){S.kv=S.kv||{};const v=S.kv[i]||(S.kv[i]={}),r=Math.random();
 if(r<.012&&!v.cw){v.cw=rand(Object.keys(CW));return {kind:'cw',cw:v.cw}}
 if(r<.045&&!v.prop){v.prop=rand(Object.keys(PROPS));return {kind:'prop',prop:v.prop}}
 if(r<.16)return {kind:'gems',gems:5+Math.floor(Math.random()*11)};return null}
/* --- finish with points evolution --- */
function finish(){
 P.phase='done';clearInterval(P.idle);setTarget(null);
 const len=P.text.length,acc=Math.round((len-P.mist.size)/len*100),mins=Math.max((performance.now()-P.start)/60000,1/60),wpm=Math.round(len/5/mins);
 const secs=(performance.now()-P.start)/1000;S.time+=Math.round(secs);sessionSecs+=secs;S.rounds++;
 if(P.mode==='place')return placeResult();
 const stars=acc>=95?3:acc>=85?2:acc>=60?1:0,pass=stars>=1;
 const oldL=levelOf(S.xp);let xp=len+(pass?20*stars:5),gems=0,newCard=false,holoUp=false,badge=null,tierUp=null,tierF=null,evo=null,lucky=null,evoFrom=P.ff,holoF=null,holoForms=[];
 if(pass&&!P.practice){const k=sk(P.i,P.s),prev=S.best[k]||0;gems=Math.max(0,stars-prev)*2+(prev===0?1:0);
  const f0=formNow(P.i);S.best[k]=Math.max(prev,stars);const f1=formNow(P.i),ck=P.i+'-'+f0;
  if(!S.cards[ck]){S.cards[ck]={holo:false};newCard=true}
  if(P.tier&&better(P.tier,S.cards[ck].tier)){S.cards[ck].tier=P.tier;tierUp=P.tier;tierF=f0}
  for(let f=f0+1;f<=f1;f++){const nk=P.i+'-'+f;if(!S.cards[nk])S.cards[nk]={holo:false};evo=f}
  if(evo!=null)P.ff=evo;
  [0,1,2].forEach(f=>{const c=S.cards[P.i+'-'+f];if(c&&!c.holo&&BAND[f].every(s=>(S.best[P.i+'-'+s]||0)===3)){c.holo=true;holoUp=true;holoF=f;holoForms.push(f)}});
  lucky=rollLucky(P.i);if(lucky&&lucky.gems)gems+=lucky.gems;
  const r=LESSONS[P.i].r;if(!S.badges.includes(r)&&regionDone(r)){S.badges.push(r);badge=REGIONS[r].name}}
 S.xp+=xp;S.gems+=gems;S.hist.push({t:Date.now(),w:wpm,a:acc});if(S.hist.length>80)S.hist.shift();const egg=pass?dailyEgg():null;save();
 const newL=levelOf(S.xp);
 if(pass){$('#vil')?.classList.add('pop');burst($('#arena'),$('#vil'),'#f0c860',22);$('#foe')?.classList.add('friend');$('#hero')?.classList.add('cheer');for(let h=0;h<5;h++)setTimeout(()=>{const e=document.createElement('div');e.className='heart';e.textContent='♥';e.style.right=(14+Math.random()*14)+'%';$('#arena')?.appendChild(e);setTimeout(()=>e.remove(),1300)},h*140);sfx.win();say(`You saved ${SPECIES[P.fi].n[evoFrom]}!`)}
 else{$('#vil')?.classList.add('laugh');say('Try again! Go slow.')}
 const R_={acc,wpm,stars,pass,xp,gems,newCard,holoUp,badge,lvl:newL>oldL?newL:0,egg,tierUp,tierF,brk:takeBreak(),evo,evoFrom,lucky,holoF,holoForms};
 if(pass&&!P.practice)setTimeout(()=>catchAnim(()=>results(R_)),1000);else setTimeout(()=>results(R_),pass?1300:900);
}
const _res8=results;results=function(r){_res8(r);if(P.practice||!r.pass)return;const box=$('#mbox .bigstars');if(!box)return;const i=P.fi,sp=SPECIES[i],pts=lessonPts(i),f=formNow(i),nxt=EVO_PTS[f+1];
 let h='';
 if(r.evo!=null)h+=`<div class="banner gold">${sp.n[r.evoFrom]} evolved into ${sp.n[r.evo]}!</div>`;
 if(r.lucky){const L=r.lucky;h+=L.kind==='gems'?`<div class="banner luck">Lucky find! +${L.gems} diamonds</div>`:L.kind==='prop'?'':`<div class="banner dia">SUPER RARE! ${sp.n[P.ff]} turned ${CW[L.cw].n} colors!</div>`}
 h+=evoPanel(i,pts,f,nxt);
 box.insertAdjacentHTML('afterend',h)};
/* --- map: 8 levels per lesson + evolution meter --- */
function renderMap(){
 const nx=nextStage();
 let h=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>Adventure Map</h2><button class="btn sm volt" data-act="practice">Practice</button>${gemsHTML()}</div>`;
 REGIONS.forEach((R,r)=>{
  h+=(WREG.includes(r)?worldHead(r):'')+`<section class="region" style="--rc:${R.color}"><div class="rhead"><div class="badge ${S.badges.includes(r)?'got':''}" style="--bc:${R.color}">${r+1}</div><div><h3>${R.name}</h3><p class="muted">${R.desc}</p></div></div><div class="lessons l8s">`;
  (window.ORDER||LESSONS.map((_,k)=>k)).forEach(i=>{const L=LESSONS[i];if(L.r!==r)return;
   const keys=L.k?[...L.k].map(c=>`<span style="--fc:${fcol(fingerOf(c))}">${c.toUpperCase()}</span>`).join(''):'';
   const f=formNow(i),has=!!S.cards[i+'-'+f],pts=lessonPts(i),nxt=EVO_PTS[f+1];
   h+=`<div class="lesson panel l8"><div class="l8top"><span class="evo-art">${creatureSVG(i,f,'fit '+(has?'':'sil'))}</span><div class="lt"><div class="num">Lesson ${typeof LNUM==='function'?LNUM(i):i+1}</div><h4>${lessonTitle(i)}</h4><div class="minikeys">${keys}</div>
    <div class="evo-meter" title="Stars help your Keylori evolve"><div class="eb"><i style="width:${nxt?Math.round(pts/nxt*100):100}%"></i></div><small>${has?SPECIES[i].n[f]:'???'} · ${nxt?pts+'/'+nxt+' to evolve':'Fully evolved'}</small></div></div></div><div class="stages">`;
   for(let s=0;s<NST;s++){const n=i*NST+s,b=S.best[sk(i,s)]||0,u=unlocked(n),boss=isBoss(i,s);
    h+=`<button class="st8 ${u?'':'locked'} ${n===nx&&u?'next':''} ${boss?'boss':''}" ${u?`data-act="play" data-n="${n}"`:'disabled'} title="${stageName(i,s)}" aria-label="Level ${s+1} ${stageName(i,s)}${u?'':' locked'}"><b>${u?(boss?'BOSS':s+1):'🔒'}</b><span>${'★'.repeat(b)}${'☆'.repeat(u?3-b:0)}</span></button>`}
   h+='</div></div>'});
  h+='</div></section>'});
 $('#s-map').innerHTML=h;
}
/* --- pixel paralysis squiggles over the trapped Keylori --- */
(()=>{const mk=seed=>{const c=document.createElement('canvas');c.width=32;c.height=32;const g=c.getContext('2d');const cols=['#7fe8ff','#f0c860','#ffffff'];
  [[6,0],[14,1],[22,2]].forEach(([y0,ci],k)=>{let x=2+((seed+k)%3),y=y0+((seed*3+k)%4);g.fillStyle=cols[(ci+seed)%3];while(x<30){const dy=((x+seed+k)%4<2)?1:-1;for(let t=0;t<2;t++){g.fillRect(x,y,1,1);x++}y=Math.max(2,Math.min(29,y+dy*2))}});return c.toDataURL()};
 const a=mk(0),b=mk(1);document.head.insertAdjacentHTML('beforeend',`<style>
 .foe{right:1%!important;bottom:3%!important;width:min(25%,230px)!important}
 .foe.friend{width:min(25%,230px)!important}
 .foe .cage{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;border-radius:0!important;position:relative}
 .foe .cage::before,.foe .cage::after{content:"";position:absolute;left:20%;right:20%;top:30%;bottom:6%;background:url(${a}) center/100% 100% no-repeat;image-rendering:pixelated;animation:zapA .36s steps(1) infinite;pointer-events:none;z-index:2}
 .foe .cage::after{background-image:url(${b});animation-name:zapB}
 @keyframes zapA{0%{opacity:1}50%{opacity:0}} @keyframes zapB{0%{opacity:0}50%{opacity:1}}
 .foe .cage svg{filter:saturate(.75) brightness(.92)}
 .foe.friend .cage::before,.foe.friend .cage::after,.foe.caught .cage::before,.foe.caught .cage::after{display:none}
 .foe.friend .cage svg{filter:none}
 </style>`)})();

const NEWW=[{"w":4,"name":"Coral Coast","sp":[{"key":"pinchip","names":["Pinchip","Snapclaw","Crustadon"],"type":"Tide","typeColor":"#b8684e","flavor":"It waves both claws hello, then pinches your sandwich while you wave back.","evo":[["horns"],["crest","aura"]],"rows":["................................","................................","................................","................................","................................",".........oooo......oooo.........","...oo..ookkkko....okkkkoo..oo...","..oHHoookwwkkko..okwwkkkoooBDo..","..oHLoBokwwkkko..okwwkkkoDoBDo..",".oHLLoBokkkkwko..okkkkwkoDoBBDo.",".oHLLLBokeeeeko..okeeeekoLBBBDo.",".oHLLLBBokeeko....okeekoLLBBBDo.",".oHLLLBBBoooo......ooooLLLBBBDo.",".oHLLLBBBoLDo......oLDoLLLBBBDo.","..oHLLBBDooooooooooooooHLLBBDo..","..oHDLBDooHHHHocCoBBDDooDLBDDo..","...ooHDoHHLLLHLLBBLBBBLDoHDoo...","....oooHLLLLLLLLBBBBBBBDDooo....","....ooHLLLLLLLLLBBBBBBBBDDoo....","....oHLLLLLLLLLLBBBBBBBBBDDo....","....oHLLLppLLmLLBBmBBppBBDDo....","....oHLLLLLLLLmmmmBBBBBBBDDo....","....oHLLLLLLLLLrrBBBBBBBDDDo....","....oHLLLLLLLLLLBBBBBBBBBDDo....",".....oHLLLLLLLLLBBBBBBBBDDo.....",".....ooHCccccccccccccccCDoo.....","....oLBoHCCccccccccccCCDoDDo....","...oLDDoooHCCCCCCCCCCDoooDDDo...","...oLooLBDooooooooooooBDDooDo...","....o.oLDooLDo....oDDooDDo.o....",".......oo..oo......oo..oo.......","................................"],"pal":{"o":"#2e1418","H":"#f4a07a","L":"#d8704e","B":"#b04e3c","D":"#7a3034","c":"#f2e2c4","C":"#d0b494","k":"#1c1018","w":"#fffaf0","e":"#4a8aa0","m":"#3a1418","r":"#c85a5a","p":"#f4b0a0"}},{"key":"shellby","names":["Shellby","Shellwave","Carapacio"],"type":"Reef","typeColor":"#5e9a76","flavor":"It naps on warm rocks and wears a tiny coral sprig like a lucky hat.","evo":[["crest"],["horns","aura"]],"rows":["................................","................................","................................",".....................o.o........","..........ooooooooooororo.......","........ooaaaaaASsssorRo........",".......oaaAAAAAASssssoRoo.......","......oaAAAAAASSSSsssoRoSo......",".....oaAAAAASSAAssSSssssSSo.....","....oaSAAAASAAAAssssSssssSSo....","...oaAASSAASAAaassssSssSSsSSo...","...oaAAAASSAAAaAsssssSSsssSSo...","..oaAAAAAAASAAAAssssSssssssSSo..","..oaAAAAAAASAAAAssssSssssssSSo..","..oaAAAAAAAASSAAssSSsssssssSSo..","..oaAAAAAAAASooooooSsssssssSSo..","..oaAAAAAAAooHHLBDDoossssssSSo..","..oaAAAAAAoHHLLLBBBDDosssssSSo..","...oaAAAAoHLLLLLBBBBDDosssSSo...","..oyyyyyoHLkkkLLBBkkkDDoaaaaao..","...oSyyoHLkwwkkLBkwwkkDDoSaao...","....oaooHLkwwkkLBkwwkkDDooao....","...oooBoHLkkkwkLBkkkwkDDoDooo...","..oHHLBoHLkkeekLBkkeekDDoBBBDo..","..oHLLBoHLLkkkLLBBkkkBDDoBBBDo..","..oHLLDDoppLLLoLBoBBBppoDDBBDo..",".oHLDDooooHLLLLooBBBDDooooDDDDo.","..ooooLLBBoHLLLLBBBDDoBBBBoooo..","....oHLLBBDooHDDDDDooLBBBBDo....",".....oHDDDo..oooooo..oLDDDo.....","......oooo............oooo......","................................"],"pal":{"o":"#14281e","H":"#a8dca0","L":"#6eb47e","B":"#4a8c66","D":"#30604e","a":"#d8b070","A":"#b08848","s":"#8a6438","S":"#5e4026","y":"#ecdcaa","r":"#f09070","R":"#c0604e","k":"#101a16","w":"#ffffff","e":"#3a7a6a","p":"#f0a898"}},{"key":"ripplet","names":["Ripplet","Seacolt","Tidestrider"],"type":"Tide","typeColor":"#8a7cb0","flavor":"It curls its tail around kelp so the waves can't carry it off during naps.","evo":[["crest"],["crown","aura"]],"rows":["................................",".....ooo....oo..................","....offfooooHLoo................",".....offfoHoLBoDo...............","......oFoHLLLBBDDo..............","...oooooHLLLLBBBDDo.............","..offfoHLkkkLBBkkkDo............","...ofFoHkwwkkBkwwkko............","....ooHLkwwkkBkwwkkDo...........","...oooHLkkkwkBkkkwkDooo.........","..offfoHkkeekBkkeekoHHHoooo.....","..offFoHLkkkLBBkkkDoLLLHoLDo....","...ooooppLLLLBBBDDppLLLLoLDmo...","...ooo.ooHLLLBBDDoLLLLLLoLDo....","..offFooooHDDDDDooooooooooo.....","..offfFoHLooooooCCCo............","..offFFoHLLLLLBcccCo............","..offfFoHLLLLLBcccCo............","..offFFoHLLLLLBCCCCo............","..offfFoHLLLLLBcccCo............","...ofFFFoHLLLLBccCoo............","...oFFFFoHLLLLBCCofFo...........","....ooooooHLLLBCCoFo............","........oLooHDDoooo.............","........oLBDoooDBBDo............","........oLBBBBDoDBBDo...........","........oLBBBBDooBBDo...........","........oLBDBBBBBBDo............",".........oLBBBBBBBDo............","..........oooDDDDDo.............",".............ooooo..............","................................"],"pal":{"o":"#211a34","H":"#d4c8ec","L":"#a898d0","B":"#7e6eaa","D":"#58487e","c":"#f4e4c0","C":"#d2b892","f":"#9ad0c8","F":"#64a2a4","k":"#141020","w":"#ffffff","e":"#5aa0b0","m":"#3a2440","p":"#f0b0b0"}},{"key":"puffip","names":["Puffip","Puffwing","Squallbill"],"type":"Breeze","typeColor":"#6c84a0","flavor":"It dives for fish with a splash and always wears its lucky sailor scarf.","evo":[["crest"],["wings","aura"]],"rows":["................................","................................","................................","................................","................................","................................","................................",".............oooooo.............","...........ooHHLBDDoo...........",".........ooHHLLLBBBDDoo.........","........oVVWWVLLBBWWWVVo........","........okkkWWVLBWWWkkko........",".......okwwkkWVLBWWkwwkko.......",".......okwwkkWWWWWWkwwkko.......","......oWkkkwkWWWWWWkkkwkVo......","......oVkkeekWWWWWWkkeekVo......","......oLppkkWWooooookkppBo......",".....oLBVWWWWogrrrrBoWWVDDo.....","....oLBBBVVVogyrrrrrBoVDDDDo....","....oLBBBDoLogyyrrrrroBDDDDo....","....oLBBBDoLLoyyyrrRooBDDDDo....","....oLBBBooooWoooooooooDDDDo....","....oLBBBoddDoooooodDDoDDDDo....","....oLBBBDoddddWWddDDoBDDDDo....",".....oLBBDWooodWWdDooVBDDDo.....",".....oLBBVWWWWoddoWWWWVDDDo.....",".....oLBDoWWWWWooWWWWVoBDDo.....","......oLooVWWWWWWWWWWVooBo......",".......o..oVVWWWWWWVVoo.o.......",".........oyRoVVVVVVRoRRo........",".........ooooooooooooooo........","................................"],"pal":{"o":"#16141e","H":"#8a88a4","L":"#5e5c78","B":"#44425a","D":"#2e2c40","W":"#f4f0e6","V":"#c4c2c8","g":"#8a8a96","y":"#f0a050","r":"#d8643c","R":"#9a3c30","d":"#4c8cb0","k":"#141018","w":"#ffffff","e":"#5a6a8a","p":"#f0aaa0"}},{"key":"spinnow","names":["Spinnow","Spinefin","Urchinox"],"type":"Reef","typeColor":"#b89048","flavor":"When it gets nervous it puffs up like a spiky beach ball, then giggles.","evo":[["horns"],["crest","crown","aura"]],"rows":["................................","................................","................................","...............oo...............","............o.ofFo.o............","...........oCoofFooCo...........","...........oCCooooCCo...........","......o....oooooooooo....o......",".....oCooooHHHHLBBBDDooooCo.....","......oCCoHLLLjjBBBjjDoCCo......","......oCoHLLLLLLBBBBBDDoCo......",".......oHLjjLLLLBBBBBBDDo.......","......oHLLkkkkLLBBkkkkjDDo......","...oooHLLkwwkkkLBkwwkkkBDDooo...","..oCCoHLLkwwkkkLBkwwkkkBDDoCCo..",".ofoCoHLjkkkkkkLBkkkkkkBDDoCoFo.",".ofFooHLLkkkkwkLBkkkkwkBjDooFFo.",".offoHLLLkeeeekLBkeeeekBBDDoFFo.",".offooHLLLkeekLLBBkeekBBDDooFFo.",".ofoCoHppLLLLLLooBBBBBBppDoCoFo.",".ooCCoHLccccccomrocccccCDDoCCoo.","..ooooHLcccccccooccccccCDDoooo..","......oHcccccccccccccccCDo......",".......oCCccCccCccCccCcCo.......","......oCoCccccccccccccCoCo......","......oCCoCCccccccccCCoCCo......",".....oCooooHCCCCCCCCDooooCo.....","......o....oooooooooo....o......","................................","................................","................................","................................"],"pal":{"o":"#2e2014","H":"#f6dc8a","L":"#e0b452","B":"#c08a3a","D":"#8a5e2e","c":"#f4ecd4","C":"#c8b892","j":"#9a6a36","f":"#8ac4bc","F":"#5a9a98","k":"#1a1210","w":"#ffffff","e":"#3a7a8a","m":"#3a1a14","r":"#c8605a","p":"#f2a890"}},{"key":"starfry","names":["Starfry","Starstrand","Asteridon"],"type":"Shore","typeColor":"#5a7cb0","flavor":"If it loses an arm playing tag, it just grows a brand-new one.","evo":[["crest"],["crown","aura"]],"rows":["................................","...............oo...............","..............oHDoooo...........",".............oHLDoyyYo..........",".............oHLDoyYYo..........",".............oHLDDoYo...........","............oHLLLDDo............","............oHLLcDDo............","............oHLLLDDo............","...........oHLLLLBDDo...........","...........oHLLLcBDDo...........","..ooooooooooHLLLLBDDoooooooooo..",".oHHHHHHHHHHLLLLLBBBBBBBBBBBDDo.",".oHLLLLLLLLkkkkLLBkkkkBBBBBBDDo.",".oHLLcLLLLkwwkkkLkwwkkkBBBcBDDo.","..oHLLLLcLkwwkkkLkwwkkkcBBBDDo..","...oHLLLLLkkkkkkLkkkkkkBBBDDo...","....ooHLLLkkkkwkLkkkkwkBDDoo....","......oHLLkeeeekLkeeeekDDo......",".......oHLLkeekLLBkeekDDo.......",".......oppLLLLLLLBBBBDppo.......",".......oHLLLLLmLLmBBBBDDo.......",".......oHLLLLLLrrBBBBBDDo.......",".......oHLLcLLLLLBBBcBDDo.......","......oHLLLLLLLDDBBBBBBDDo......","......oHLcLLLLLooDDBBBcDDo......","......oHLLLLLoo..ooDBBBDDo......",".....oHLLLLLo......oDBBBDDo.....",".....oHLLLLo........oDDDDDo.....","......ooooo..........ooooo......","................................","................................"],"pal":{"o":"#141c34","H":"#a4c4ec","L":"#6c94d0","B":"#4a6eac","D":"#324c80","c":"#dce8f4","y":"#f4dcb0","Y":"#d4a878","k":"#10141e","w":"#ffffff","e":"#5a8ad0","m":"#1c2034","r":"#c86060","p":"#f0b0b0"}}],"vil":[{"key":"scr_squinkle","name":"Squinkle Scrambler","rows":["................................",".............................oo.","............oooooo..........oqo.",".........oooHHLBDDooo......oqVo.","........oHHHLLLBBBBDDo....oqqVo.",".......oHoossLLBBBBooDo...oqVo..","......oHLLLooooooooBBDDo.oqVVo..",".....oHLssLoWWWWWVoBBBDDooqVo...","....oHLLsSoWWWWeWWVoBssDDogo....","....oHLLLoWWwwekeeWVosSDDooDo...","....oHLLLoWWwekkkeWVoBBDDooBDo..","....oHLLLoWWWekkkeWVoBBDDoBBDo..","...oBLLLLoVWWeekeeWVoBBBDDoBDo..","....oHLLLLoVWeekeeVoBBBDDoBBDo..","....oHLLLLLoVVVeVVoBBBBDDoBBDo..","....oHLssLLLooooooBBBBBDDoBDo...","....oHLsSLLLLLLBBBBBBBBDDoBDo...",".....oHLLooooooooooooBDDoDDo....",".....ooHLomtmtmtmtmtoDDoDoo.....","....oLBoHLomtmmmmtmoDDoDo.......","....oLBBoHLooooooooDDooo........","...oLBBBooooHDDDDDoooBDo........","..ooLBBBoLBBoooooooBBBDo........",".oLLBBBDoLBBBoLBBDoBBBDo........",".oLBBBDDoLBBDoLBBDoLBBDo........",".oLBBDoooLBBDoLBBDoLBBDo........",".oLBBoBoLBBBDoLBBDoLBBBDo.......","..oLooDLBBBDooLBBDooLBBBDoo.....","...ooLoBBBDo.oLBBDooooBBBBDo....",".....oLBDDo...oLDo.oBoDDDDo.....","......oooo.....oo...o.oooo......","................................"],"pal":{"o":"#0e0a18","H":"#6a6aa4","L":"#45467a","B":"#30325e","D":"#222244","s":"#e08a6a","S":"#a85a4e","W":"#f2ecd8","V":"#c4b8a4","e":"#e8b448","k":"#120a10","w":"#ffffff","m":"#140a18","t":"#f0e8d0","q":"#ece4d4","g":"#d4a850"}},{"key":"scr_conch_imp","name":"Conch Scribbler","rows":["................................","...............oo.........oo....","..............oHDo.......okko...",".............oHLDDo......oqYo...",".............oHHDDo......oqYo...","............oBBBBDDo.....oqYo...","...........oBLLLBLDDo....oyyo...","...........oHLLHLDDDo....oyYo...","..........oHHHHBDBBDDo...oyYo...",".........oHHBBBLBBLLDDo..oyYo...",".......ooHBBBooooooDBDDoooyYo...","......ooBBLookkkkkkooBLDDooYo...",".....ooHoLokkkkkkkkkkoDDDoBoo...",".....oHLLokwekkkkkkewkoBDDoYo...",".....oHHHokeeekkkkeeekoLDDoYo...",".....oHBokkkkkkkkkkkkkkooooYo...",".....oHLLokkkkkkkkkkkkooLLBoo...","......ooookkttttttttkkooLBBoo...","......ogGookktkkktkkkoohoooRo...","......ogGGGookkkkkkoohhhhooo....",".....ooGGGGGGoooooohhhhhhho.....","....oLBoGGGGGGGoohhhhhhhhho.....","....oLBoGGGGGGorRohhhhhhhho.....",".....ooGGGGGGGoRRohhhhhhhho.....","....ogGGGGGGGGGoohhhhhhhhhho....","....ogGGGGGGGGGGhhhhhhhhhhho....","....ogGGGGGGGGGGhhhhhhhhhhho....","....ogGGGGGGGGGGhhhhhhhhhhho....","...ogoGGoGGoGGohhohhohhohhoho...","....o.oo.oo.oo.oo.oo.oo.oo.o....","................................","................................"],"pal":{"o":"#1e1018","H":"#f4d4b0","L":"#dca684","B":"#b87a62","D":"#84504a","g":"#6a8a4e","G":"#4a6a3e","h":"#33482e","k":"#120a10","e":"#f0d050","w":"#fffbe0","t":"#f0e8d0","q":"#d4d0c8","y":"#e8c060","Y":"#b08a3c","r":"#d07060","R":"#984a44"}}]},{"w":5,"name":"Sunscorch Dunes","sp":[{"key":"fennip","names":["Fennip","Fennimble","Siroccox"],"type":"Sand","typeColor":"#c89a5a","flavor":"Its giant ears can hear a grain of sand land on a dune far away.","evo":[["crest"],["crown","aura"]],"rows":["................................",".....oo.................oo......","....oLLoo.............ooLLo.....","...oHHHLLo...........oHHLLBo....","...oHHHLLLo.........oHHHLLBo....","...oHHHiLLo.........oHHiLLBo....","...oHHiiiLBo.......oHHiiiBDo....","...oLHiiiLBo.ooooo.oHHiiIBDo....","...oLLLiiioooHHLLLoooiiiBBDo....","...oLLLiioHHHHHHLLLLBoiIBDDo....","....oLLioHHHHHHHLLLLBBoIDDo.....","....oBBoHHHHHHHLLLLLBBDoDDo.....",".....oBoHHHHHHHLLLLLBBDoDo......","......oLHHkkkkLLLLkkkkDDooooo...","......oLLHkwekLLLLkewkDDocccco..","......oLLLkeekLLLBkeekDDocccco..",".....oLLLLLkkcccccckkDDDDocCCo..",".....oLLLppccccnncccDppDDoBBDo..",".....oBBBBBcccmccmccDDDDDoBDDo..","......ooDoBccccmmccCDoDooBBDo...","........oooooooooooooooLBBDDo...",".......ottttttttytojjtooBDDo....","........oTTTTyTTTTotttoBDDo.....","........oooooooooooTTToDDo......","........oLLLccccccoTTooDo.......","........oLLLcccccoTToDoo........",".........ooooocccoTToo..........",".........oHHLBocoHooLo..........","........oLLLLDoCoLLLLDo.........",".........oBoDDoooBBoDo..........","..........oooo...oooo...........","................................"],"pal":{"o":"#3e2018","H":"#ffe0a8","L":"#f2b86e","B":"#d68c48","D":"#a8603a","c":"#fbf0d8","C":"#e2c8a0","i":"#eeb4a0","I":"#d48a80","k":"#2a1410","w":"#ffffff","e":"#8a5a2e","n":"#3a1e18","m":"#5a2420","p":"#ec9a90","j":"#9ad6c4","t":"#56a89c","T":"#2e6e70","y":"#f0d070"}},{"key":"scarabit","names":["Scarabit","Scarabeam","Kheptaurus"],"type":"Sun","typeColor":"#c8a048","flavor":"It rolls a tiny sun across the sky every morning so the day can start.","evo":[["horns"],["wings","crown","aura"]],"rows":["................................","........y....ooooo.....y........",".......yjy..ojjjjyo...yjy.......","........y..ojjjjjyyo...y........","...........ojjjjyyyo............","..........ojjjjjyyyyo...........",".........oojjjyyyyyyoo..........",".........oGoyyyyyyyogo..........","........oGGoyyyyyyyoGgo.........",".......ooGgoooyyyoooGgoo........","......ooGGgoHLoooLHoGGgoo.......",".....oLoGGoLLLLoDLLLoGgoBo......","....oLLLooLLLLLoDLLLLooBBBo.....","....oLLHLHLLLLLoDLLLBBBBBBo.....","...oLLLHHLLLLLLoDLLBBBBBBBDo....","...oLLLLLYLLLLLoDLBBBBYBBDDo....","...oLLLLLLgLLLLoDBBBBgBBDDDo....","..ooLLLLLLLgLoooooBBgBBDDDDoo...",".oGGoLLLLLLoojjjyyooBBDDDDoGGo..",".oGGoBBBBBojjjjjyyyyoDDDDDoGGo..",".oGo.oBBBokkkkjjyykkkkDDDo.oGo..",".oGo..oBojkwekjyyykewkoDo..ogo..",".oGo.oGooykeekyyyykeekooGo.ogo..",".oGooGggoyykkyyyyyykkyoGGgoogo..",".ogooGgo.pyyyyyyyyyyyopoGgoogo..","..o.oGgo..oyyymyymyyo..oGgo.o...",".....oGo...oyyymmYYo...oGo......",".....oGo....ooooooo....oGo......",".....oGo...............ogo......","......o.................o.......","................................","................................"],"pal":{"o":"#151a38","H":"#94d0c8","L":"#5486bc","B":"#3a5a9e","D":"#2a3c78","j":"#fff0b4","y":"#eec462","Y":"#bc8638","g":"#26285a","G":"#4a4c86","k":"#1a1420","w":"#ffffff","e":"#3a6aa8","m":"#6a3020","p":"#ea9a7c"}},{"key":"spinnet","names":["Spinnet","Spinarro","Saguardian"],"type":"Thorn","typeColor":"#7a9a58","flavor":"It stores a whole oasis of water in its plump body and shares it with thirsty travellers.","evo":[["crest"],["crown","aura"]],"rows":["................................",".................oo.............","...............ooffoo...........","..............offffffo..........","............oofffFFffFo.........","...........ooofffyyfFFo.........","..........ooffoffyyFFo..........",".........oHHofFofFffFo..oooo....","........oHHLHoofFFfFFoooHHLBo...","....ooo.oHHLsHLooooooDooHLLBo...","...oHHLoLHHLSLLLLLBSDDDoLLLBo...","..oHHLLoLLHBLLLLLLBBDDDoLLLBo...","..oLLLBoLLLBLLLLLBBBDDDoLLsBo...","..oLLLBoLLLBLLLLLBBBDDDoLLSBo...","..oLLsBoLLkkkkLLLBkkkkDoHHLBo...","..oLLSBoLLkwekLLLBkewkDoLsLBo...","..oLLLBoLLkeekLLLBkeekDoLSLBo...","..oLLLBoLLLkkLLLLBBkkDDoBBBBo...","..oLHHsoLppBLLLLLBBBDppoDDDo....","..oHHLSoLLLBLLmLLmBBDDDoooo.....","..oLLLLoLLLBLLLmmBBBDDDo........","...oBBBoLLLBLLLLLBBBDDDo........","....ooooLsLBLLLLLBBBDDDo........",".......oLSLBLLLLLBBBDsDo........","........oLLBLLLBBBBDDSo.........","........oLLBLLBBBBBDDDo.........","........oBBDBsBBBDsDDDo.........","........ooBBBSBBDDSDDoo.........","........oLoDDDDDDDDDoLo.........",".........oLooDDDDDooDo..........","..........ooooooooooo...........","................................"],"pal":{"o":"#16301e","H":"#cadf8e","L":"#94bc64","B":"#68964c","D":"#466c3e","s":"#f6eecc","S":"#bcb48a","f":"#f4b090","F":"#cc7462","y":"#f2d474","k":"#14201a","w":"#ffffff","e":"#4a6a3a","m":"#4a2020","p":"#e8a090"}},{"key":"frillip","names":["Frillip","Frillizard","Blazefrill"],"type":"Scorch","typeColor":"#bc6a4c","flavor":"When it is excited its frill pops open like a sunburst.","evo":[["crest"],["horns","aura"]],"rows":["................................","................................","...........o.......o............","..........oQoo...ooQo...........","..........oQQQoooQQQo...........",".........oQQRQQQQQRQQo..........",".....oooooQqRqqtqqRqQooooo......","....oQQQQtqqRqqqqqRqqtQQQQo.....","....oQRRqqqqoooooooqqqqRRQo.....","....oQQRRqjoHHHHLLLojqRRQQo.....","....oQqqqRoHHDHHLLDBoRqqqQo.....","...ooqtqjoHHHHHLLLLDBojqtqoo....","..oQQqqqoHkkkkHLLLkkkkoqqqQQo...",".oQRRRRjoHkwekLLLLkewkojRRRRQo..","..oQQqqRoLkeekLLLBkeekoRqqQQo...","...oQqqjoLLkkLLLBBBkkDojqqQo....","...oQtqjoppLmLBBBBDmDppjqtQo....","...oQqqqRoBBBmmmmmmDDoRqqqQo....","..oQQRRRjjoBBBDDDDDDojjRRRQQo...","..oQRQqqqjjooDDDDDoojjqqqQRQo...","...ooooooooHtotyytLtoooooooo....",".........oLoHHcccLBoLo.....oo...",".........oLLocccccoLLo....oBLo..",".........oLLLoCCCoBLLo....oLBo..",".........ooLLocccoBBoooo.oLLo...",".........oLoBoCCCoBoDoLLoHHDo...","........ooooocccCCoooooLLHBDo...",".......oHHHLBoCCCoHHLLDoBBBo....",".......oLLLLLoDDDoLLLLDoooo.....","........oLDDo.ooo.oLDDoo........",".........ooo.......ooo..........","................................"],"pal":{"o":"#3a1820","H":"#f2ac88","L":"#d47a60","B":"#b05648","D":"#843c42","c":"#f6dcb8","C":"#d8ac8a","j":"#f6e2a4","q":"#ecbc6c","Q":"#d88848","R":"#a65438","t":"#5ab0a6","y":"#f2d070","k":"#22101a","w":"#ffffff","e":"#c06a2a","m":"#5a1a22","p":"#f0a090"}},{"key":"sidlet","names":["Sidlet","Sidewynd","Miragon"],"type":"Mirage","typeColor":"#8a7aaa","flavor":"It glides sideways over hot sand and leaves wiggly letters behind.","evo":[["crest"],["horns","crown","aura"]],"rows":["................................","................................","................................","................................",".............ooooo..............","..........oooHoooLooo...........","........ooHoooHGgoooLoo.........",".......oHHoHHHHggLLBoBBo........","......oHHoHHHHHHLLLBBoBBo.......",".....oHHHokkkkHLLLkkkkBBDo......",".....oHHoLkwekLLLLkewkoBDo......",".....oHHoLkeekLLLBkeekoDDo......",".....oLLoLLkkLLBBBBkkDoDDo......",".....oLLLppLLmBBBBmDDppDDo......",".....oLLLLoBBBmmmmDDoDDDDo......",".....oLLLLLoDDDrDDDoDDDDDo......","......oBBBBBooorrooDDDDDo.......",".......oBBBBLLCCCBDDDDDo........","........ooDDLLcccBDDDoo.........","..........ooLLCCCBDoo...........",".......oooHHLLcccBDLooo.........","......oHHHHHLLCCCBDLBBDo........",".....oLHHHHHLLccCDBBByYDo...oo..","......oLLyYLLBBBDDBBDDDo..ooLDo.",".....oooBBBBBBBDBDDDDDoBooBLBo..","....oHHHoooDDDDDDDDoooBBBDoBo...","....oLLyYLLoyYoooooByYBByYoo....","....oLLLLLLLLLLBBBBBBDDDDDo.....",".....ooBBBBBBBBBBDDDDDDDoo......",".......ooooDDDDDDDDDoooo........","...........ooooooooo............","................................"],"pal":{"o":"#1e1632","H":"#d2c4e4","L":"#a292c8","B":"#7a6aa6","D":"#564880","c":"#f2e2c0","C":"#d4bc98","y":"#eccb70","Y":"#b88a48","g":"#5ab4aa","G":"#b0ece0","r":"#d8605a","k":"#160e20","w":"#ffffff","e":"#5a4a90","m":"#2a1630","p":"#e8a0a8"}},{"key":"sphinkit","names":["Sphinkit","Sphinxar","Pharaolux"],"type":"Ruin","typeColor":"#a88e64","flavor":"It guards the old sandstone ruins and asks a riddle to everyone who passes.","evo":[["crown"],["wings","aura"]],"rows":["................................","................................","......o.................o.......",".....oHoo......o......ooLo......",".....oHHHoo.ooojooo.ooLLDo......",".....oHiiHoouoyeYouooLiiDo......",".....oHLioyyyoyyYoyyyoiio.......","......oHouuuuuooouuuuuoDo.......","......oouuuuuuuuuuuuuuvoo.......","......oyyyyyoooooooyyyyyo.......","......ouuuooHHHLLLLoouvvo.......",".....ouuuoHHHHHLLLLLLovvvo......",".....oyyokkkkkHLLLkkkkkyyo......","....ouuuoHkwekLLLLkewkovvvo.....","....ouuuoLkeekLLLLkeekovvvo.....","....oyyyoLLkkLLLLLLkkBoyyyo.....","....ouuuoppLLLLnnLBBBppvvvo.....","...ouuuuoLLLLLmLLmBBBBovvvvo....","...oyyyyyoLLLLBmmBBBBoyyyyyo....","...ouuuuuuooooooooooouvvvvvo....","...ouuuuuojjjjjjjjjjjovvvvvo....","..oyyyyyyoyyyyyyyyyyyoyyyyyyo...","..ouuuuuuuoueuueuueuuuvvvvvvo...","...oooooooooooooooooooooooooo...","........oLLLLLLLLBBBDDoHLBoo....","........oLLLLLLBBBBDDDoHHo......","........ooooooBBBoooooooo.......","........oHHLLLoBoHHLLLo.........","........oLLLLLoDoLLLLLo.........",".........oLoDoooooLoDo..........","..........ooo.....ooo...........","................................"],"pal":{"o":"#3a2626","H":"#faeac8","L":"#eccc9c","B":"#cca676","D":"#a07e5c","u":"#4a6aa8","v":"#30487e","y":"#eec66a","Y":"#b88c40","j":"#fff2c0","i":"#e8a894","k":"#20141a","w":"#ffffff","e":"#3a9a9a","n":"#c86a6a","m":"#5a2a2a","p":"#eea494"}}],"vil":[{"key":"scr_mumble_blot","name":"Mumble Blot","rows":["................................","................................","................................","................................","............ooooooo.............",".........oooHHHLLLLooo..........","........oHbbbbbHLLLLLLo.........",".......oHHXXXXoooLLLLLBo........","......oHHHooooooooooooBBo.......",".....oHHHoBBBBBBBBBBBBoBBo......","....obbbHHowoooooooooLBcBoo.....","...oHbbbHowwwywyyyYwwoBcobbo....","...oHXXbHowwwyykkyYwWoBXobbo....","...oHHHXHowwwyykkyYwWoBBXobbo...","...oLHHHHHowwYYYYYYWoBBBBobbbo..","..oLLLLLLLowwwwwwWWWoBBBDDobbo..","...obLLLLLLooWWWWWooBcBDDDDobCo.","...obbbbLLLLLoooooBccccCDDDobCo.","...oXbbbbbLLLLLBBBBXXcCCCCCobCo.","...oLXXbbkbbBBBBBBBBDXkXCCobco..","....oBBXXkkkkkkkkkkkkkkLXXobco..",".....oLBBBktkktkktkktkDLLDooo...","....oLLBDBHkkkkkkkkkkDDLLDo.....","....oLLBDBLLBDXXXXXXDDDLLDo.....","....oLLBDDLLBDDDDDLLDDoLLDo.....","....oLLBDoLLBDDDDDLLDooLLDoD....","....oLLBDoLLBDooooLLDooLLDo.....","....oLLBDoLLBDoBBoLLDoDoooo.....","...oBoLBooLLBDoBBoBBDoDDDDDo....","....DoooDDoLBoDDDDoooDDDDoo.....","......ooooooooooooooooooo.......","................................"],"pal":{"o":"#100c16","H":"#6a5a82","L":"#4a3e5e","B":"#30283e","D":"#221c2e","X":"#18121e","b":"#ece2c8","c":"#c8b898","C":"#9a8a72","w":"#f4ecdc","W":"#cfc4ae","k":"#0a0810","y":"#e8c060","Y":"#b08a3a","t":"#f4ecdc"}},{"key":"scr_sandscrawl_imp","name":"Sandscrawl Imp","rows":["................................","...................oo...........","...............o.ooHHo..........","..............oLoHHHHo..........",".............oLLHHHoo....oo.....","............oLLLLBo.....oggo....","...........oLLLLBBDo....ogGo....","..........oHLLLLBBDXo...oggo....","..........oHLLLLBBDXo...oggo....",".........oHLXXXXXXXDXo..oGgo....",".........oHXXkkkkkXXXo..ooooo...","........oHLkkkkkkkkkkXo.oqqogo..","........oHLkjykkkjjyDXo.oqqogo..","........oHLkyykkkkyyDXo.oqqogo..",".......oHHLXkkkkkkkXDDXooQQoo...",".......oHHLLkwkwwkwkDDXooqqo....",".......ooooooooooooooooooooo....",".......oossssssssssoooLLohho....","......oosossssssssoLLLBohhho....",".....ossSSooooooooBLBBDohhho....","...oosssSoLLLLLLBBoDDDDooooo....","..ossssSoooooLLLBBBooooXoqqo....","..oSSoSSosssSoLLBBBBBDDXoQQo....","...ooSSoossySoLLBBBBBDDDXoQo....","....oSoHossSSoLLBBBBBDDDXoQo....",".....oHHLoSSoLLLBBBBBDDDXoQo....",".....oHHLLooLLLLBBBBBDDDXoQo....",".....oHHLLLLLLLLBBBBBDDDXoQo....","......oooooooooooooooooooqQo....",".........................oo.....","................................","................................"],"pal":{"o":"#2a1a14","H":"#ecd09a","L":"#c8a068","B":"#a47e50","D":"#7a5a3c","X":"#5a3e2c","k":"#120a0c","y":"#f0d060","j":"#fff4b0","w":"#f4f0e6","s":"#b05a44","S":"#7e3a34","q":"#e2c48a","Q":"#a88454","g":"#2a2440","G":"#5a5480","h":"#6a5a7a"}}]},{"w":6,"name":"Frostfang Tundra","sp":[{"key":"flurrkit","names":["Flurrkit","Flurrfox","Aurovulpa"],"type":"Frost","typeColor":"#7a9cc0","flavor":"It curls its fluffy tail around its paws and naps happily in a snowstorm.","evo":[["crest"],["wings","aura"]],"rows":["..................................","..................................",".....oo..................oo.......","....oHHoo..............ooBDo......","....oHDHDoo..........ooBBDDo......","....oHDLLBDooooooooooLBBBDDo......","....oHLqLBoooHHLHDDoooBBqBDo......","....oHLqqoHHHLLHBBBBDDoqqBDo......","....oHLooHLLLLLLBBBBBDDooqDo......","....oHoHHkkkLLLLBBBBkkkDDoDo......","....oHoHkwwkkLLLBBBkwwkkDoDo......","....ooHLkwwkkLLLBBBkwwkkDDoo......","....oHLLkkkwkLLLBBBkkkwkBDDo......","....oHLLkkeekLLLBBBkkeekBDDo......","...oHLppckkkLLLLBBBBkkkcppDDo.....","....oCCcccccccCLBccccccccCCo......",".....ooCCccccccccccccccCCoo.......",".......ooCCccccnnccccCCoooo.......",".........ooCCcnccncCCoo.oBDo......","...........ooCCnnCCoo..oBBBDo.....","..........oaaaaagggggooHBBBBDo....","..........oggvggGvGGGooHBBBBDo....",".........oagoccccCBBDoHLBBBBBDo...",".........oavocccccCBDoHLBBBBBDo...","........ooaGocccccCBBoHLBBBBBDo...","........oHooCoocccooBDoHBBBBDo....","........oHLooooooooooooHBBBBDo....",".........oocCHHHHHHHHHHLBBBDo.....","........occcCLLLLLLLLLLLBBDo......","........oCccCLLLLLLLLLLLBBDo......",".........oCCCLLLLLLLLLDDDDo.......","..........ooooHLLLLLLLoooo........","..............oooooooo............",".................................."],"pal":{"o":"#1e1a34","H":"#e6eaf6","L":"#bcc4e0","B":"#909ac2","D":"#666c98","c":"#f8f8f4","C":"#d0d4e4","q":"#d8a8b0","a":"#9ae0c4","g":"#5ab49c","G":"#3a7c78","v":"#8aa4dc","k":"#141428","w":"#ffffff","e":"#5a8ad0","n":"#2c2440","p":"#ecb0b8"}},{"key":"blubbit","names":["Blubbit","Blubbern","Floemaw"],"type":"Tide","typeColor":"#5a8ca0","flavor":"It slides on its tummy across the ice faster than you can say \"brrr!\"","evo":[["crest"],["crown","aura"]],"rows":["..................................","..................................","..................................","..................................","..................................",".............ooooooo..............","..........oooHHHLBDDoo............",".........oHHHLLLLBBBDDo...........",".........oHLLLLLLBBBBDDo..........","........oHLLLLLLLBBBBBDDo.........",".......oHLLLLLLLLBBBBBBDDo........",".......oHkkkkLLLLBBBkkkkDo........",".......okwwkkkLLLBBkwwkkko........",".......okwwkkkLLLBBkwwkkko........",".......okkkkwkLLLBBkkkkwko........",".......okkeeekLLLBBkkeeeko........","......ooHkkkkccnnncCkkkkDoo.......",".....oppHLLLccccncccCBBDDppo......","......oooHLLCDccccccDBDDooo.......",".......oHLLLDCCDCCDCBDBDDo........","......oHLLLLLLLLmBBBBBBBDDo.......",".....oooDLLLcccccccCBBBDDDooo.....","....oHLBoLLcccccccccCBBBDoLBDo....","...oHLBBoLLcccccccccCBBBBoBBDDo...","...oLBBDoLcccccccccccCBBDDoBDDo...","...oBBDoLLcccccccccccCBBDDooDDo...","....oooHLLCccccccccccCBBDDo.oo....",".......oHLLcccccccccCBBDDo.ooo....","........oHLCccccccccCBDDo.oBBDo...",".....ooooooooooooooooooooooooDDo..","....oiiwiiiiwiiiiwiiiiwiiiiwioDo..","....oIIIIIIIIIIIIIIIIIIIIIIIIooo..",".....oooooooooooooooooooooooo.....",".................................."],"pal":{"o":"#16263a","H":"#c4dae2","L":"#94b8c8","B":"#6c92aa","D":"#4c6a8a","c":"#eef2ee","C":"#c6d0d4","i":"#d8eef4","I":"#9cc4d8","k":"#101824","w":"#ffffff","e":"#4a6a9a","n":"#2a2a3a","m":"#3a2a34","p":"#e8b0b4"}},{"key":"mammel","names":["Mammel","Woolumph","Mastodrift"],"type":"Tundra","typeColor":"#9a7458","flavor":"Its shaggy coat is so warm that snowflakes melt before they ever land.","evo":[["horns"],["crest","aura"]],"rows":["..................................","..................................","..................................","................oo................",".............ooocCooo.............","...........oocccccccCoo...........","..........occCCcccCCccCo..........",".........oHCCLLCCCBBCCDDo.........",".....ooooHLLDLDDDBDBDDDDDoooo.....","....oHLBoHLLLLLLLBBBBBBDDoBDDo....","...oHLLBoHkkkLLLLBBBBkkkDoBDDDo...","...oHLLoHkwwkkLLLBBBkwwkkDoDDDo...","..oHLLDoHkwwkkLLLBBBkwwkkDoDDDDo..","..oHLLDBokkkwkLLLBBBkkkwkoBDDDDo..","..oHLLLBokkeekLooooBkkeekoBDDDDo..","...oHLLBoHkkkLoHLBDoBkkkDoBDDDo...","...oHLLppoHLLLoHLBDoBBDDoppDDDo...","....oHDDDooHLLoDDDDoBDDooLDDDo....",".....ooooooooHoHLBDoDoooooooo.....",".....ottoHHHLooDDDDooBBDDotto.....",".....ottoLLLLLoHLBDoBBBBDotTo.....",".....ottToLLLLoDDDDoBBBBotTTo.....",".....ootTToooLoHLBDooooottToo.....",".....oHoTTTTTooDDDBnnoTTTToDo.....","....oHLLoooooLoHLBBBDoooooBDDo....",".....oHLLLLLLLLoHBBBDoBBBBDDo.....",".....oHLLLLLLLLoHDDDDoBBBBDDo.....","......oHoHLLBoLLoooooLBBDooo......",".......ooLLBBoLLLBBBoBBDDoo.......","........oLBBDoDLDBDBoBBDDo........","........ottottoDoDoDottotto.......","........oooooooooooooooooo........","..................................",".................................."],"pal":{"o":"#2a1618","H":"#d89a6a","L":"#b26e48","B":"#8a4e36","D":"#64342c","c":"#f4f6f6","C":"#c8d2dc","t":"#f2e8cc","T":"#c4b08c","k":"#1c1012","w":"#ffffff","e":"#6a9ab0","n":"#4a2420","p":"#e8a090"}},{"key":"pebbill","names":["Pebbill","Puffbeak","Frostbeak"],"type":"Gale","typeColor":"#8890b0","flavor":"It dives into icy waves and pops back up with a beak full of fish.","evo":[["crest"],["wings","aura"]],"rows":["..................................","..................................","................o.o...............",".............oooHoLoo.............","...........ooHHoHLBoDoo...........","..........oHHLLLLBBBBDDo..........",".........oHLLLLLLBBBBBDDo.........","........oHLLLLLLLBBBBBBDDo........","........oHsscccCLBccccCsso........","........oHkkkcccccccckkkDo........",".......oHkwwkkcccccckwwkkDo.......",".......oHkwwkkcccccckwwkkDo.......","........okkkwksccccskkkwko........","........okkeekcccccckkeeko........",".......ooHkkkcoooooockkkDoo.......","......oppoCccouuuuuuoccCoppo......",".......ooooCCoyyyyyyoCCoooo.......","........ooHoorrrrrrRRooDooo.......",".......oHLoLorwrrrRRRoBDoLBo......","......oHLLoLLorrrrRRoBBDoBBDo.....","......oLLBoLLoyrrRRyoBBDoBBDo.....","......oLBBoLccorrRRocCBDoBDDo.....","......oLBDoLcccoRRoccCBDoBDDo.....",".......oBDocccccooccccCDoDDo......","........oDocccccccccccCDoDo.......","........ooLcccccccccccCDDo........",".........oHCccccccccccCDo.........",".........oHLcccccccccCDDo.........","..........oHCccccccccCDo..........","...........oHCccccccCDo...........","..........oyyyrrooyyrRRo..........","..........oooooooooooooo..........","..................................",".................................."],"pal":{"o":"#14141e","H":"#7c8098","L":"#585c74","B":"#3e4058","D":"#2a2a3e","c":"#f2f0ea","C":"#c4c4d0","s":"#8a8a9c","y":"#f2c46a","r":"#e07c40","R":"#b0503a","u":"#a8b4c8","k":"#101018","w":"#ffffff","e":"#5a7a8a","p":"#e8a8a8"}},{"key":"hoolume","names":["Hoolume","Hoolumist","Nivahoot"],"type":"Gale","typeColor":"#8890b0","flavor":"It glides so quietly over the snow that not a single flake gets disturbed.","evo":[["crest"],["wings","crown","aura"]],"rows":["..................................","..................................","..................................",".........ooo...oooo...ooo.........","........oHHHoooHLDDoooBDDo........",".......oHLLLHsHLLBBBBBBBDDo.......","........oHLLLLLLLBBBBBBDDo........",".......osHLLLLLLLBBBBBBDDo........",".......oHLwwwwwCLBwwwwwCDso.......","......oHLwkkkkwwwwwwkkkkCDDo......","......oHwkwwkkkwwwwkwwkkkCDo......","......oHwkwweekwwwwkwweekCDo......","......oHwkeeeekwwwwkeeeekCDo......","......oHCkeeeekwnNwkeeeekCDo......","......ooHCkkkkwwnNwwkkkkCDoo......",".....oppoHCCCCCCLNCCCCCCDoppo.....","......ooHoHLLLLLLBBBBBDDoDoo......","......oHLBoHLLLLLBBDDDDoBDDo......",".....oHLLBBooooHDDDooooBBDDDo.....",".....oHLLBBBoLLooooBBoLBBDDDo.....",".....oHLLBBBoLsLsBBBBoLBBDDDo.....",".....oHsLBBoLLLsLBBsBsoLBDsDo.....",".....oHLsBBoLLLLLBBBsBoLBsDDo.....",".....oHLLBBoLLLLLBBBBBoLBDDDo.....",".....oHsLBBoLLLLsBsBBBoLBDsDo.....",".....oHLsBBoLsLsLsBBsBsLBsDDo.....",".....oHLLBoLLLsLLBBBBsDoLDDDo.....",".....ooHBooHLooLoooBooDooDDoo.....","....oioHBoioonnonnnonnoioDDoio....","....oiioowiiioooooooowiiiooiio....","....oIIIIIIIIIIIIIIIIIIIIIIIIo....","....oJJJJJJJJJJJJJJJJJJJJJJJJo....",".....oooooooooooooooooooooooo.....",".................................."],"pal":{"o":"#26222e","H":"#fdfbf4","L":"#e6e4dc","B":"#c4c0cc","D":"#948fa8","C":"#dcdce4","s":"#8a7470","i":"#cde8f2","I":"#98c4dc","J":"#6a90b4","k":"#1c1418","w":"#ffffff","e":"#e0b040","n":"#3a3036","N":"#6a5a52","p":"#ecb4b4"}},{"key":"glintle","names":["Glintle","Shardlume","Auroracrys"],"type":"Aurora","typeColor":"#5aa494","flavor":"On clear nights it hums softly, and the northern lights dance along to its song.","evo":[["crown"],["wings","aura"]],"rows":["..................................","..................................","................oo................","...............oHDo...............","...o.....o.....oHDo.....o.........","..ojo...oHo...oHooDo...oDo........",".ojjjo..oHo...ooHDoo...oDo....o...","..ojo...oHDo.oHHLDDoo.oBDo...ojo..","...o....oHLooHLLLBBDDooBDo..ojjjo.","........oooHHLLLLBBBBDDoDo...ojo..","........oHHLLLLLLBBBBBDDoo....o...",".......oHLLjLLLLLBBBBBBBDDo.......","......oHLLjkkkLLLBBBkkkBBDDo......","......oHLLkwwkkLLBBkwwkkBDDo......","......oHLLkwwkkLLBBkwwkkBDDo......","...o..oHLLkkkwkLLBBkkkwkBDDo..o...","..oHo.oHLLkkeekLLBBkkeekBDDo.oLo..",".oHLo.oHppLkkkLmLBmBkkkBppDo.oLBo.",".oLBo.oHLLLLLLLLmmBBBBBBBDDo.oBDo.","..oBo.oHLLLLLLLLLBBBBBBBBDDo.oDo..","...o...oHBBBBBBBBBDDDDDDDDo...o...","........oHLLLLLLLBBBBBBDDo........",".........oHLLLLLLBBBBBDDo.........","..........oHLLLLLBBBBDDo.....o....","...........oHLLLLBBBDDo.....ojo...","............oHLLLBBDDo.....ojjjo..",".............oHLLBDDo.......ojo...","..............oHLDDo.........o....","......oo.......oHDoo..............",".....oaaooo....oooaao.............","......oaaggooooggaago.............",".......ooGggggggggoo..............",".........ooooooooo................",".................................."],"pal":{"o":"#162436","H":"#e8fcfa","L":"#a8e2e6","B":"#70b8cc","D":"#4a86a8","j":"#ffffff","a":"#a6e6b8","g":"#6cbca0","G":"#4a8a8c","k":"#122030","w":"#ffffff","e":"#3a9ab0","m":"#24384a","p":"#e4b4c0"}}],"vil":[{"key":"scr_slushblot","name":"Slush Scrambler","rows":["..................................","..................................",".............................o....","............................oio...","............................oiIo..","...........................oiiIo..","...........................oiiIo..",".............oooooooo......oiIJo..","..........ooocccccccCooo...oiIJo..",".........occcccccccccccCo..okkJo..","........ocCCccooooooccCCCo..okko..",".......oCCLLooiiiiiIooBBCCooBBBBo.","......oHLLLoiiwwwwwWIIoBBDoLBBBDo.",".....oHLLLLoiwwwwwwwWIoBBBDoBBDo..","....oHLLLLoiwwwwwEwwwWIoBBBDoDDo..","....oHLLLLoiwwweekeEwWJoBBBDDoo...","....oHLLLLoiwwwekkkEwWJoBBBDDo....","....oHLLLLoiwwEekkkeEWJoBBBDDo....","....oHLLLLoiwwwekkkEwWJoBBBDDo....","...oooLLLLoIWwwEEkEEwWJoBBBDDo....","..oHLLooLLLoIWwwwEwwWJoBBBBDDo....",".oHLLBBoLLLoIIWWWWWWJJoBBBBDDo....",".oLoBBoLLLLLooIJJJJJooBBBBDDo.....","..o.oDoLLLLLLLooooooBBBBBBDDo.....",".....oHLLkkLLLLLLBBBBBBBBBkDo.....",".....oHLLLktttttttttttttkBDDo.....","......oHLLLktktkktkktktkBDDo......","......oHLLLLLkkkkkkkkkBBBDDo......","......oHLLLLLLLDDiIDDBBDDDDo......",".......oIiooHLoooiiooDDooiIo......",".......oiiooIio..oo.oiIooiio......","........oo.oiio.....oiio.oo.......","............oo.......oo...........",".................................."],"pal":{"o":"#0a0c1c","H":"#4e6494","L":"#384a76","B":"#283658","D":"#1c2440","c":"#eef4f8","C":"#b4c6d8","i":"#d4f0f8","I":"#90c4dc","J":"#5a8cb0","w":"#f2f4f0","W":"#c0c8d0","k":"#080a14","e":"#64c0c8","E":"#3a8a9a","t":"#e8f4f8"}},{"key":"scr_parkaimp","name":"Parka Scrambler","rows":["..................................","..................................","............oooooooo........oo....","..........ooHHHLBBDDoo.....oiIo...",".........oHHLLLLBBBBDDo....oiIo...","........oHLLLLLLBBBBBDDo..oiiIo...",".......oHLLLLfffffFBBBDDo.oiIIo...",".......oHLLfffFfffffFBDDo.oUUUo...","......oHLLFffffffFfffFBDDooqqQo...","......oHLLfffkkkkkkfFFBDDooqqQo...","......oHLFffkkkkkkkkffFDDooqqQo...",".....oHLLffkykkkkkkkyfFBDDoqqQo...",".....oHLLffkkyykkkyykfFBDDoqqQo...","......oHLffkkyMykyMykfFDDooqqQo...","......oHLffkkkkkkkkkkFFDDooqqQo...","......oHLFFkkfrrrrfkkfFDDooqqQo...","....oo.oHLffkkkfkkkkFFDDooooqQo...","...ommooHLFffkkkkkkffFooLBBoqQo...","...omMMooHLFFffffffFFoLLBBDmmoo...","...oMMBBooHLLFFFFFFBoLBBDDoMMoo...","....ooBBoLooHLDDDDDDoooooooMMoo...","......oDoLLLooooooooBBBDDooooUo...","......ooLLLLLLLLDBBBBBBDDooffko...","......oHLLiLLLLLDBBBBBBDDo.oko....",".....oHLLiIiLLLLDBBBBBBBDDo.o.....",".....oHLLLiLLLLffBBBBBBBDDo.......",".....oHLLLLLLLLLDBBBBBBBDDo.......",".....oHLLLLLLLLLDBBBBBBBDDo.......","....offfffffffffffffffffffFo......","....oFFFFFFFFFFFFFFFFFFFFFFo......",".....ooooooooooooooooooooooo......","..................................","..................................",".................................."],"pal":{"o":"#1a1016","H":"#b8786a","L":"#965444","B":"#743e36","D":"#542c2c","f":"#ece4d4","F":"#bcae9a","k":"#140c14","r":"#a84a48","y":"#f4dc6a","i":"#d8f2f8","I":"#94c8e0","U":"#6a7084","q":"#5a8a8c","Q":"#3c6466","m":"#d0a850","M":"#9a7434"}}]},{"w":7,"name":"Glowcap Hollow","sp":[{"key":"glimmtoad","names":["Croaklet","Glowcroak","Lanternoad"],"type":"Bog","typeColor":"#4e7a86","flavor":"It dangles a glowing lure to guide lost friends home through the swamp.","evo":[["crest"],["horns","aura"]],"rows":["..................................","................ooo...............","..............ooyyyoo.............","..............oywyYYo.............","..............oyyYYeo.............","........oooo..ooYeeoo.oooo........",".......oHHHLo...ooo..oHHLLo.......","......oHHkkkLo..oBo.oHHkkkBo......","......oHkwwkkLooogooHHkwwkko......",".....oHHkwkkkgLHHHHHLgkwkkkDo.....",".....oHHkkkekLLLLLLLLLkkkekDo.....","......oHLkkkLLLLLLLLLLLkkkBo......",".....oHHLLLLLLLLLLLLLLLBBBBBo.....","....oHHHLLLLLLLLLLLLLLLBBBBBDo....","....oHHppLLLLLLLLLLLLLLBBBppDo....","....oLLLLLLLLLLLLLLLLLLBBBBDDo....","....oLLLLLLmLLLLLLLLLLBmBBDDDo....",".....oBBLLLLmmmmmmmmmmmBBDDDo.....","......oBBBBBBBBmpppmBBBDDDDo......",".......ooBBBBBBBmmmBDDDDDoo.......","........oooooBDDDDDDDooooo........",".......oHoHHLooooooooLLLoBo.......",".......ooHoLcccccccccCLoLoo.......",".......oHHBocccccccccCoLLDo.......","...oooooHLBoccccccccCCoLBDooooo...","...oLLBoHLDocccccccCCCoLBDoLBDo...","..oLBBDoLBDoccccccCCCCoBDDoBDDDo..","...oDDDoBDDocccccCCCCCoDDDoDDDo...","..oooooLLoLLoccCCCCCCCoBBoBDoooo..",".ogggggoooooooCCCCCCooooooooGoGqo.",".ooggggggqggggggggGGGGGGGqGqqqooo.","...ooooGGGGGGqGGGGGGGqGqqqqoooo...",".......oooooooooooooooooooo.......",".................................."],"pal":{"o":"#1a2236","H":"#acd8c8","L":"#7cabbe","B":"#5c80a8","D":"#485890","c":"#ece6c2","C":"#c4c098","k":"#0e121c","w":"#ffffff","e":"#e0a048","m":"#3a1c2c","p":"#e8a49c","y":"#fbeab0","Y":"#f0bc5c","g":"#9cc062","G":"#6a9a4a","q":"#3e6a3a"}},{"key":"sparkewt","names":["Sparkewt","Glimmewt","Lumandra"],"type":"Glow","typeColor":"#b0784a","flavor":"Its lime spots twinkle brighter every time it feels brave.","evo":[["crest"],["wings","aura"]],"rows":["..................................","..............ooo.................",".........oo..oKKKo..oo............","........oKKo.oKJKo.oKKo...........",".......oKKKKooKJJooKKKKo..........",".....o.oKKJKooKKJooKKJKo.o........","...ooKooKKJJoooooooKKJJooKoo......","...oKKKoKoooooHHLoooooJoKKKo......","...oKJKooHHgHHHLLLLgLLooKJKo......","...oKJoHHHHGHLLLLLLGLLLBoJJo......","...oKoHHHHLLLLLLLLLLLLLBBoJo......","...oooHHkkkkLLLLLLLkkkkBBooo......",".....oHkwwkkkLLLLLkwwkkkDo........",".....oHkwkkkkLLLLLkwkkkkDo........",".....oLkkkkekLLLLLkkkkekDoooo.....",".....oLLkkkkLLLLLBBkkkkDDoHLLo....","......ppBBBBmBBBBBBmDDDppoLLLBo...",".......ooBBBBmmmmmmDDDooo.ogLBo...",".........oooooDDDooooo.oo..oLBBo..","......ooooHHHHoooLBoooo....oLLBo..","......oHogHHLLLLLLBgoLo....oLLBo..",".....oHLBoHLcccccLBoLBDo...ogBDo..",".....oHLDoHcccccCCBoLBDo..oHGBDo..",".....oLBDoLcccccCCBoBDDo.oHHLBDo..","......oDoLccccccCCCDoDo.oHHLBDo...",".....oooLocccccCCCCDoBoooHLLBDo...","........oLBcccCCCCDDoHHHHgLBDDo...",".......oooBccCCCCCDoooLLLGBDDo....",".......oLLoocCCCCooBDoBBBDDDo.....",".......oBBDDoooooBBDDoDDDDoo......","......oLoLoLo...oBoBoDoooo........",".......ooooo.....ooooo............","..................................",".................................."],"pal":{"o":"#2c1828","H":"#f8d08a","L":"#eca45c","B":"#cc7842","D":"#9c4e3a","c":"#f6e6b6","C":"#dcbc84","k":"#1a0e14","w":"#ffffff","e":"#6aa040","m":"#4a1a24","p":"#f0a090","g":"#d2ec84","G":"#94c050","K":"#86ccb8","J":"#4a8c90"}},{"key":"mothkin","names":["Mothkin","Duskmoth","Nocturnyx"],"type":"Dusk","typeColor":"#6e6490","flavor":"The glowing eyes on its wings stare down any shadow that sneaks too close.","evo":[["crown"],["crest","aura"]],"rows":["..................................","...........oo........oo...........","..........occo......occo..........","..........ocCCo....oCCco..........","....oooooo.oCCo....oCCo.oooooo....","...occcccco.oCo....oCo.occcccco...","..occUUUUUco.oooooooo.ocUUUUVcco..","..ocUUUUUUVo.oocccCoo.oUUUUUVVco..",".occUJJJJVVooHooooooLooUUJJJJWcco.",".ocUJKKKKJoHHHHHLLLLLLBoJKKKKJWco.",".ocUJKckKoHHHHLLLLLLLLBBoKckKJWco.",".ocUJKkkKoHkkkLLLLLLkkkBoKkkKJWco.",".ocUJKKKoHkwwkkLLLLkwwkkDoKKJJWco.","..oUUJJJoHkwkkkLLLLkwkkkDoJJJWWo..","..ocUVVUoLkkkekLLLLkkkekDoVWWWco..","...oVVVVVoLkkkLLLLLBkkkDoVWWWWo...","....oooVVppLLLLmBBmBBDDDppWooo....",".......oVWoBBBBBmmBBDDDoWWo.......","........oWWooBBDDDDDDooWWo........","........oUoccoooooooocCoUo........",".......oUUocccccccccCCCoUVo.......","....oooUUUoccccccCCCCCCoUVVooo....","...ocUUUUUVooocCCCCCoooUUVVVVco...","...oUUUUUVVWCWooCoooCUoUUVVVVWo...","..ocUUUJJVVWWooHHLBoooUUUJJVWWco..","..ocUUJKKJWWWooHHBDooUVVJKKJWWco..","...ocVJKJJWWo.oBBDDo.oVVJKJJWco...","...occVJJWWco.oHLBDo.ocVWJJWcco...","....oooccooo..oBBDDo..oooccooo....",".......oo......oBDo......oo.......","...............oooo...............","..................................","..................................",".................................."],"pal":{"o":"#241c34","H":"#e2d8e6","L":"#b8acd0","B":"#9084b0","D":"#6a5e8c","c":"#f6eedc","C":"#d8ccb4","k":"#120c1c","w":"#ffffff","e":"#7cd0c0","m":"#3a1a30","p":"#e8a8b0","K":"#8edac6","J":"#3e8a8c","U":"#8a76a8","V":"#6a5888","W":"#4e406c"}},{"key":"jarslug","names":["Jarslug","Lanternail","Beaconacle"],"type":"Glow","typeColor":"#8a9a54","flavor":"It carries a tiny lantern on its back so nobody gets lost at night.","evo":[["horns"],["crown","aura"]],"rows":["..................................","..................................","..................................","..ooo......ooo....................",".owgGo....owgGo.....oooooo........",".ogGGo....ogGGo....o......o.......","..ooo......ooo.....o......o.......","..oLo......oDo.....gg.g...........","...oBo....oLo.....gGGgGoooo.......","...oBo....oBo....oMMMMMMMMNo......","...oBo....oBo....oMMMMMMNNPo......","...oBo....oBo....oMMMMMNNNPo......","...oDo....oDo....oPPPPPPPPPo......","....oDoooooo....oooooooooooo......","....ooHHHLLoo..oyyyyyYyYYYYAo.....","...oHHHHLLLLBo.oyyyYYYyYYYYAo.....","..oHHHLLLLLLBBoyyyYYYyyyYYAAAo....","..oHkkkLLLLkkkoyyyYYyyyyyYAAAo....",".oHkwwkkLLkwwkkoyYYYyywyyYAAAo....",".oHkwkkkLLkwkkkoyYYYywwwyYAAAo....",".oLkkkAkLLkkkAkoyYYYywwwyYAAAo....",".oLLkkkLLLLkkkDoYYYYywwwyAAAAo....","..ppLLLLLLBBDDppYYYYYyyyAAAAo.....","..oLBBBmBBmDDDooYYYYYYYAAAAAo.....","...oBBBBmmDDDo..oooooooooooo......","....ooBDDDDoooooooMMMMMMMMNo......","......oooooooHHHHoMMMNNNNNPo......","...oooHHHHHHHHHHLoooooooooooo.....","...oHHHHHHHHLLLLLLLLLLBBBBBBo.....","...ooLLBBBBLBBBBBBBBBBDDDDDDDo....",".....oooooBBBBBDDDDDDDoooooooooo..","..........oooooooooooo............","..................................",".................................."],"pal":{"o":"#1c2a22","H":"#dce6a4","L":"#b0c47c","B":"#86a05e","D":"#5e7a4c","k":"#0e140e","w":"#ffffff","m":"#3a1c22","p":"#e8a094","y":"#fcecb4","Y":"#f2c060","A":"#cc8840","M":"#a8989e","N":"#706072","P":"#463a4e","g":"#cce67c","G":"#86b44c"}},{"key":"flickit","names":["Flickit","Wispling","Willowraith"],"type":"Wisp","typeColor":"#4e8a8c","flavor":"A giggly little flame that plays hide-and-seek between the reeds.","evo":[["wings"],["crown","aura"]],"rows":["..................................","..................................","................o............Y....","................oo..........YyY...","................oLo..........Y....","................oHo...............","...Y...........oHHLo..............","..YyY...o.....oHHHLBo.....o.......","...Y....ooo...oHHLLBo....oo.......","........oHHoo.oHHLLBo.oooBo.......","........oHHHo.oHLLLLLoLLLBo.......",".......oHHHHHoHLLLLLLLLLLDo.......",".......oHHHLLLLLLLLLLLLBBDo.......",".......oHHLLLLLLLLLLLBBBBDo.......",".......oHHLkkkkLLLLkkkkBDDo...Y...","........oHkwwkkkLLkwwkkkDDo..YyY..","........oHkwkkkkLLkwkkkkDo....Y...","........oHkkkkkkcckkkkkkDo........",".......oHHHkkkkcccckkkkBBDo.......",".......oHppccccccccccccppDo.......",".....ooHooLccccmccmccccBooLoo.....",".....oHLBoLcccccmmcccccBoLBDo.....",".....oLBBoLccccccccccccDoBDDo.....",".....ooBooLccccccccccccDooDoo.....",".......o.otggoccccccccDto.o.......","..........gGotttttttttto..........","...........oBBLLLLBBDDoggo........","............oBBBLBBBDogGo.........",".............oBBBBBBo.............","..............oBBBBBDo............","...............oooDDDDo...........","..................oooooooo........","..................................",".................................."],"pal":{"o":"#14283a","H":"#e6f6d8","L":"#a8e0c8","B":"#6cbcb2","D":"#4a8a9c","c":"#f4fbe8","k":"#0c1624","w":"#ffffff","m":"#2a1a30","p":"#e8b0a8","Y":"#f2c060","y":"#fbe6a8","t":"#7a5a40","g":"#b4d66e","G":"#6e9a48"}},{"key":"shelfpup","names":["Shelfpup","Bracketback","Polyporex"],"type":"Spore","typeColor":"#8a6450","flavor":"Glowing shelf fungus grows on its back, and it shares a nibble with friends.","evo":[["horns"],["crest","crown","aura"]],"rows":["..................................","..............oooooo..............","............oocccccCoo............","...........occCCCCAAAAo...........","...........oooooooooooo...........",".....oooooooJKJKJKJKJKooooooo.....","....occccccCooKKKKKKooccccccCo....","...occCCCAAAAooooooooccCCCAAAAo...","...ooooooooooo.oooo.ooooooooooo...","....oJoHLoKooooHHHLooooKoLBoJo....",".....oHLBDoHHHHHHLLLLLLoLBDDo.....","...oooLLpoHHHHLLLLLLLLLBoBDDooo...",".oocccoBoHkkkLLLLLLLLkkkBoDoccCoo.",".occCCooHkwwkkLLLLLLkwwkkBooCAAAo.",".oooooooHkwkkkLLLLLLkwkkkBooooooo.","..oKJKJoHkkkKkLLLLLLkkkKkDoJKJKo..","..oooKKoLLkkkLLLccLLLkkkDDoKKooo..",".....oooLppLLccnnnncCBBppDooo.....","........oLLLccccnncCCCBBDo........",".........oLLccmccCCmCCBBo.........",".......ggqHLLccmmmmCCBBBBqgg......",".......gqHHLLLLLCCLLLLBBBBqg......",".......oHHLLLLccccccLLBBBBo.......","......oHHHLLccccccccCCBBBBDo......","......oLLLLcccccccccCCCBBDDo......","......ooLLLccccccccCCCCBDDoo......","....ooHoLLLcccccccCCCCCDDDoBoo....","....oHHLoBooocccCCCCCoooDoLBDo....","...oHHLBDoHHBocCCCCCoLLDoLBDDDo...","....oLBDDoHLDoCCCCCCoLBDoBDDDo....","....ooDDooLBDooooooooBDDooDDoo....","......oo.ooooo......ooooo.oo......","..................................",".................................."],"pal":{"o":"#26161e","H":"#dcb490","L":"#b8866a","B":"#906050","D":"#6a4246","c":"#f2e0b4","C":"#d8aa72","A":"#a8744c","K":"#8ad6c2","J":"#4a9a96","k":"#160c10","w":"#ffffff","n":"#3a2026","m":"#3a1420","p":"#e8a098","g":"#9cbc5a","q":"#5e7e3e"}}],"vil":[{"key":"scr_bogblot","name":"Bog Blot","rows":["....................................","...........................ooooooo..","...........................owkkkwo..","............yy.............okwwwko..","...........yGo.............owkwwWo..","............Go.............owwkwWo..","..oo......oooooooo.........owwwwWo..",".oHo...ooogggggoogooo......owWkWWo..",".oHLo..ogggggggggGGqooo....ooooooo..",".oLLo..ooggGGGGGqqqooLLoo......o....","..oLo....ooooooLLLLLLLLBBo....oLo...","..oLo....oHHHLLLLLLLBBBBBBo...oBo...","...oHo..oHsHLLBBBBDDDDDDBBBo.oBDo...","...oHHooHsHLooooooDoooooBBBLoLBo....","...oLHHHHsLowwwweeoeewwWoBBBBBDo....","....oLLLLLLowwweeekeEEwWoBBBBDXo....","....oLLLLLLowwweewkkEEwWoBBBDDo.....",".....oLLLLLowwweekkkEEwWoBBBDXo.....","......oLLLLowwweekkkEEWWoBBBDo......","......oLLLLLowweeekEEEWoBBBDDo......","......oLLLLLLowwEEEEEWoBBBBDDo......","......oLLLLLLLooooooooBBBBBDDo......","......oLLLLLLLLLLLBBBBBBBBBDDo......","......oLLLLLLLLLLLBBBBBBBBBDDo......",".......oLLokwkkwkkwkkwkkwoBDo.......",".......oHLLkkkkkkkkkkkkkkBBDo.o.....",".....ooHHLLLkwwkkwkkwwkBBBBBDoo.....",".....oHHBLLLLLLLBBBBBBBBBBBBDDo.....",".....oLLBBBBBBBBBBBBBBBBBDBDDXo.....",".....ooBBBBBBBBBBBBBBBDDDDBXXoo.....",".....oooBooDDDBDDDDDDDDDXoBoooo.....","..oooLLLLLLoooBooooooooooLBLLBBooo..","..oooLLLBBBBBBLLLLBBBBBDDDDDDDDooo..",".....oooooooooBBBBBDDDooooooooo.....","..............oooooooo..............","...................................."],"pal":{"o":"#0a0c18","H":"#56649a","L":"#3a4676","B":"#2a3258","D":"#1e2442","X":"#141832","w":"#f2eedc","W":"#c8c4b4","k":"#0a0a12","e":"#eab44a","E":"#b07a2c","s":"#7a8cc4","g":"#9cc062","G":"#6a9a4a","q":"#3e6a3a","y":"#d4ee88"}},{"key":"scr_capscrawl","name":"Capscrawl Imp","rows":["....................................","................................o...","................................o...",".............ooooooooo..........o...","..........oooRRRRKKKSSooo......oTo..","........ooRRRRRRKKKKJSSSSoo...oTTUo.",".......oRRKRRRRSSKKJSSSSSSSo..oTTUo.","......oRRKKKRSSSSSSSSSSSKKSTo.oTTUo.",".....oRRRKKJSSSSSSSSSSSKKKJTTooTTUo.",".....oRRRRJSSSSSSSSSSSSSJJTTTooTTUo.",".....oRRRSSSSSKSSSSSSSKSSSTTTooTTUo.",".....oRRSSSSSKKJSSSSSKKJTTTTUooTTUo.",".....oRSSSSSSSSTTTTTTTTTTTTUUo.oUo..",".....oSSTTTTTTTTTTTTTTTTUUUUUo.ooo..","......ooooooooooooooooooooooo..ogo..",".........oHkkkkkkkkkkkkkkBo....ogo..","........oHHkyykkkkkkkyykkBBo...ogo..","........oHHkyyykkkkkyyykkBDo...ogo..","........oHHkkYYkkkkkYYkkkBDo...ogo..","........oHHkkwkwkwkwkwkkkBBooooogo..","........oHHLkkwkwkwkwkkkBBBoLLBDoo..","......ooooHLLkkkkkkkkkkBBBBoLBBDoo..",".....oHHLBoLLLLLkkkkLLBBBBBoDDDDoo..",".....oLBBBoLLLLLLLyLLLBBBBBDoooogo..","......ooooLLLLLLLyYyLLBBBBBDo..ogo..",".......oHHLLLLLLLLYLLLBBBBBDo..ogo..",".......oHHLLoLLLLLLLLLBBBBoBo..ogo..","......oHHHoDDoLLLLLLLLBoBBBBDo.ogo..","......oHHHDDDDLLLLLLLBBBBBBBDo.ogo..","......oHHLoDDoLLLLBBBBBBBBBBDo.ogo..","......oHLLLBBBBBBBBBBBBBoBDDDo.ooo..","......gLBBBBBBBBBBBDDDDDDDgDDo.oio..",".....oggooooooooooooooooogGoooooio..","...............................ooo..","....................................","...................................."],"pal":{"o":"#0e0e14","H":"#6a9a82","L":"#4a7664","B":"#365c50","D":"#28443e","R":"#d49462","S":"#b4643e","T":"#8a4434","U":"#5a2a2c","K":"#8ed4be","J":"#4a9a90","k":"#08080c","y":"#f6d070","Y":"#d08c30","w":"#f2eedc","g":"#86ac58","G":"#527440","i":"#202640"}}]},{"w":8,"name":"Cogwork City","sp":[{"key":"tickoo","names":["Tickoo","Chronowl","Horologowl"],"type":"Clockwork","typeColor":"#b0864a","flavor":"Its goggle eyes can tell the time in the dark, and it never, ever oversleeps.","evo":[["crest"],["wings","aura"]],"rows":["....................................","...............o.oo.o...............","......o.......oaoaaogo.......o......",".....oHo......oaaaggGo......oDo.....",".....oHHoo...oaagjjgGGo...ooBDo.....",".....oHLHDo...oagjjgGo...oHBBDo.....",".....oHLLLDoo.oaagggGo.ooHLBBDo.....",".....oHLLLBBDo.oogGoo.oHHLLBBDo.....","....oHLLLLBBoooHHLBDDoooLLLBBDo.....","....oHLLLLBoHHHLLLBBBBDDoLLBBBDo....","....oHLLLLooooooLLBBooooooLBBBDo....","....oHLLDoccccccoLBoCCCCCCoDBBDo....","....oHLLoccaaggccooCCaaggCCoDDDo....","....oHooccakkkkgccCCakkkkgCCooDo....",".....ooocakwwkkkGgGakwwkkkGCooo.....",".....ooccakwwkkkGcCakwwkkkGCCoo.....","....oHLocgkkkkwkGcCgkkkkwkGCoBDo....","....oHLocgkeeeekGCCgkeeeekGCoBDo....","...oHLgLocGkeekGoynoGkeekGCoBGBDo...","...oHLLLLocGGGGcoynoCGGGGCoBBBBDo...","...oHDLLLBooooooLogBooooooBBBBDDo...","...oHLDDLBDoLLgggcCgggBBoLBBDDBDo...","..oHLLLLLBBDogcccjjccCGoLBBBBBBBDo..","...oHDLLLBDogcccckccccCGoLBBBBDDo...","...oHLDDLBDogcccckccccCGoLBBDDBDo...","...oHLLLLBDogcccckccccCGoLBBBBBDo...","...oHDLLLBDogjccckkkkcjGoLBBBBDDo...","....oHDDLDoLgcccccccccCGDoLBDDDo....","....oHLLLDoHgCccccccccCGDoLBBBDo....",".....oHDDo.oHgCCCccCCCGDo.oDDDo.....","......ooo...oggoGjjGoggo...ooo......","...........oaggGooooagGGo...........","...........owgwgo..owgwGo...........","............oooo....oooo............","....................................","...................................."],"pal":{"o":"#2a1a20","H":"#d8a878","L":"#b07a54","B":"#8a5a40","D":"#623c32","a":"#f4dc94","g":"#d4a850","G":"#a07834","j":"#6a4a2a","c":"#f4e8cc","C":"#d0bc98","k":"#1c1220","w":"#fffaf0","e":"#e89a3a","y":"#f0c060","n":"#c07838"}},{"key":"kettlet","names":["Kettlet","Brewster","Samovaroar"],"type":"Steam","typeColor":"#b8705a","flavor":"When it gets excited it whistles, and little puffs of steam pop out of its spout.","evo":[["horns"],["crest","aura"]],"rows":["....................................","..............................ooo...","............................oossSo..","...........................osssssSo.","..........................ossssSSSo.","................oo.........oSSSSSo..","...............oaGo.........ooSSo...","..............oaaGGo..........oo....","..............oagGGo...........oo...",".............ooagGGoo.........osSo..","...........ooHHoGGoBDoo.......oSSo..","..........oHHLLLooBBBBDo.......oo...","..........oHLLLLLBBBBBDo........oo..",".........oHLLLLLLBBBBBBDo......ooko.","........ooooooooooooooooooo...oBBDo.",".......oaaaaaaaaagggggggggGo.oHBBDo.","...oooooggggggggggGGGGGGGGGooHLBDo..","..oaaggoooooooooooooooooooooHLLDo...","..oagGoHLLLLLLLLLBBBBBBBBDDoLLLDo...",".oaggoHLLLLLLLLLLBBBBBBBBBDDoLDo....",".oagGoHLLLLLLLLLLBBBBBBBBBDDoLDo....",".oagooHLLLLkkkLLLBBBkkkBBBDDoLo.....",".oagooHLLLkwwkkLLBBkwwkkBBDDoDo.....",".oagaoHLLLkwwkkLLBBkwwkkBBDDoo......",".oaggoHLLLkkkwkLLBBkkkwkBBDDoo......","..oagoHLLLkkeekLLBBkkeekBBDDoo......","..oaGoHLLLLkkkLLLBBBkkkBBBDDo.......","...ooooHLppLLLLMMMMBBBBppDDoo.......",".......oHLLLLLLLrrMBBBBBDDoo........","........oHLLLLLLLBBBBBBDDo..........",".........ooHLLLLLBBBDDDoo...........",".........oLBooHDDDDDooBDo...........",".........oHBo.oooooo.oBDo...........",".........oooo........oooo...........","....................................","...................................."],"pal":{"o":"#2c1418","H":"#f2b48a","L":"#d8845a","B":"#b05e3e","D":"#7c3a30","a":"#f4dc94","g":"#d4a850","G":"#a07834","s":"#f4f0ec","S":"#c8c4d0","k":"#1e1014","w":"#fffaf0","e":"#4a9a96","p":"#f0a08a","M":"#3a1418","r":"#c8564a"}},{"key":"wyndle","names":["Wyndle","Wyndwhisk","Torquemaus"],"type":"Spring","typeColor":"#5a9a8a","flavor":"Give its key a twist and it zooms around the room until it runs out of spring.","evo":[["crest"],["horns","aura"]],"rows":["....................................","....................................",".......o....................o.......","....oooHooo..............oooHooo....","...oHHHLBBDo............oHHHLBBDo...","..oHLLLLBBBDo..........oHLLLLBBBDo..","..oHLLLQQBBDo..........oHLLQQBBBDo..",".oHLLLQqqQBBDooooooooooHLLQqqQBBBDo.",".oHLLQqqqqQooHHHHLBBBDDooQqqqqQBBDo.",".oHLLQqqqqoHHLLLLLDBBBBDDoqqqqqBBDo.",".oHLLQqqqoHLLLLLLLBBBBBBDDoqqqqBBDo.","..oHLLQqoHLLLLLLLLBBBBBBBDDoqqBBDo..","..oHLLLQoHLLkkkLLLBBBkkkBDDoqBBBDo..","...oHLDoHLLkwwkkLLBBkwwkkBDDoDDDo...","....ooooHLLkwwkkLLBBkwwkkBDDoooo....",".......oHLLkkkwkLLBBkkkwkBDDo.......",".......oHLLkkeekLLBBkkeekBDDo.......","...oooooHLLLkkkcccccCkkkBBDDo.......","..oqqQQooppLLLcccnnccCBBBppo........",".oqQooqQoHLLLLcccccccCBBBDDo..ooo...",".oqo..oqooHLLLCckcckcCBBDDo..ogggo..",".oqo..oqo.oHLLLCCkkCCBBDDo...ogoGo..","..oo.oqQo.oooHLLDDDDDDDoooooooggGo..","....oqQo.oHLooooooooooooDDogggGGo...","...oqQo..oHoHLoccccccoLBoDooooggGo..","...oqQo..oHoLBoccccccoBDoDo..ogoGo..","...oqQooooHLoocccccccCooDDo..oGGGo..","....oqqqQoHLLLcccccccCBBDDo...ooo...",".....ooooooHLLcccccccCBDDo..........","...........oHLCCccccCCDDo...........","...........ooooLCCCCBoooo...........","..........oHLLBoDDDDoLBBDo..........","..........oooooooooooooooo..........","....................................","....................................","...................................."],"pal":{"o":"#132a30","H":"#a8dcc4","L":"#70b8a0","B":"#4c8e82","D":"#34646a","c":"#e6efe0","C":"#b8cfc4","q":"#d8a08e","Q":"#b07a72","g":"#d4a850","G":"#a07834","k":"#10181e","w":"#ffffff","e":"#3a6a8a","n":"#7a3a3a","p":"#f0a8a0"}},{"key":"clackit","names":["Clackit","Clackjaw","Typewrex"],"type":"Clatter","typeColor":"#6a7890","flavor":"It gobbles up blank paper and burps out silly poems, one clack at a time.","evo":[["horns"],["crest","crown","aura"]],"rows":["....................................","....................................","...........oooooooooooooo...........","..........oPPPPPPPPPPPPPQo..........","..........oPPPPPPPPPPPPPQo..........","...oo.....oPPttPttttPtPPQo..........","...oaoo...oPPPPPPPPPPPPPQo..........","....ogaoo.oPPtPttttPPPPPQo..........",".....ooggooPPPPPPPPPPPPPQo..........","..oo...ooooPPPttttPttttPQo......oo..",".oagooooooooooooooooooooooooooooago.",".oagouuuuuuuuuuuuuuuuuuuuuuuuuuoago.",".oagouuuuuuuuuuuuuuuuuuuuuuuuuuoago.",".oagooooooooooooooooooooooooooooago.","..ooooaaaaaaaaaaaaggggggggggggoooo..",".....oHLLLkkkLLLLLBBBBBkkkBBDDo.....","....oHLLLkwwkkLLLLBBBBkwwkkBBDDo....","....oHLLLkwwkkLLLLBBBBkwwkkBBDDo....","....oHLLLkkkwkLLLLBBBBkkkwkBBDDo....","....oHLLLkkeekLLLLBBBBkkeekBBDDo....","....oHLLLooooooooooooooooooBBDDo....","...oHLLLoMMMMMMMMMMMMMMMMMMoBBDDo...","...oHLLLoMPPMPPMPPMPPMPPMPPoBBDDo...","...oHLLoMMQQMQQMQQMQQMQQMQQMoBDDo...","...oHLLoMMPPMPPMPPMPPMPPMPPMoBDDo...","...oHLLoMMQQMQQMQQMQQMQQMQQMoBDDo...","..oHLLoMPPMPPMPPrrrrPPMPPMPPMoBDDo..","..oHLLLoQQoQQoQQoQQoQQoQQoQQoDDDDo..","...oooooooooooooooooooooooooooooo...",".....oLBo..................oBDo.....","....oHLBDo................oLBDDo....","....owLwDo................owBwDo....","....oooooo................oooooo....","....................................","....................................","...................................."],"pal":{"o":"#161a28","H":"#a4b0c0","L":"#76869c","B":"#56647c","D":"#3a445e","P":"#f4efe0","Q":"#d4ccbc","t":"#8a8698","u":"#3a3446","a":"#f4dc94","g":"#d4a850","M":"#1e1a2a","r":"#c0503e","k":"#12141e","w":"#ffffff","e":"#d8a040"}},{"key":"glimmet","names":["Glimmet","Lampwick","Gaslumen"],"type":"Glow","typeColor":"#c89a4a","flavor":"It lights up the foggy alleys so nobody ever gets lost on the way home.","evo":[["crest"],["wings","aura"]],"rows":["....................................","...............oooooo...............","..............ojjXXIXo..............","..............ojXooXXo..............",".............ojio..oIXo.............",".............oooooooooo.............","............ojjjjiIIIIXo............","...........ojiiiiiIIIIIXo...........",".........oojiiiiiiIIIIIIXoo.........","........ojjiiiXiiXXIIXIIIIXo........","......oooooooooooooooooooooooo......",".....ojjjjjjjjjjjiIIIIIIIIIIIXo.....",".....oIIIIooooooooooooooooXXXXo.....","......ooioBBBBBBBfBBBBBBBDoIoo......",".......oiBBwBBLfffyLLLBBBBDIo.......",".......oiBwBBLLLfyyfLLLBBBDIo.......",".......oiBwBLLLLLyyLLLLLBBDIo.......",".......oiBwLLLLHHHHHHLLLLBDIo.......",".......oiBwLkkkHHHHHHkkkLBDIo.......",".....oooiBBkwwkkHHHHkwwkkBDIooo.....","....oiiiiBBkwwkkHHHHkwwkkBDIIIIo....","....oIooiBBkkkwkHHHHkkkwkBDIooXo....",".....o.oiBBkkeekHHHHkkeekBDIo.o.....",".......oiBBBkkkLLHHLLkkkBBDIo.......",".......oiBppBLLLmLLmLLLBppDIo.......",".......oiBBBBBLLLmmLLLBBBBDIo.......",".......oiBBBBBBBBBBBBBBBBBDIo.......",".......oiDBBBBBBBBBBBBBBBBDIo.......",".......oooooooooooooooooooooo.......","......ojjjjjjjjjjiIIIIIIIIIIXo......","......oIIIIIIIIIIIXXXXXXXXXXXo......",".......ooojIooooooooooooiIooo.......",".........oooo..........oooo.........","....................................","....................................","...................................."],"pal":{"o":"#2e1a1a","H":"#fff2c0","L":"#f8d47c","B":"#e4a84e","D":"#b8763a","j":"#8a7a8e","i":"#5e5266","I":"#463c4e","X":"#2e2836","f":"#fff8e8","y":"#f6c04a","k":"#2a1410","w":"#ffffff","e":"#d8703a","p":"#f09a7a","m":"#5a2418"}},{"key":"rivlet","names":["Rivlet","Rivetron","Pistonaut"],"type":"Gearwork","typeColor":"#7e74a8","flavor":"It rolls along on tiny treads, fixing squeaky hinges and humming happy beeps.","evo":[["horns"],["crown","wings","aura"]],"rows":["....................................","................oooo................","...............oyyrro...............","...............oyrrro...............","................orro................",".................oGo................",".......oooooooooooooooooooooo.......","......oHHHHHHHHHHLBBBBBBBBBDDo......",".....oHLLLLLLLLLLLBBBBBBBBBBDDo.....","....oHLHLLLLLLLLLLBBBBBBBBBBDDDo....","...ooHLLLLLLLLLLLLBBBBBBBBBBBDDoo...","..ogoHLLLLkkkkLLLLBBBBkkkkBBBDDoGo..","..ogoHLLLkwwkkkLLLBBBkwwkkkBBDDoGo..","..ogoHLLLkwwkkkLLLBBBkwwkkkBBDDoGo..","..ogoHLLLkkkkwkLLLBBBkkkkwkBBDDoGo..","..ogoHLLLkkeekkLLLBBBkkeekkBBDDoGo..","...ooHLLLLkkkkLLLLBBBBkkkkBBBDDoo...","....oHLLppLLLLmLLLBBBmBBBBppBDDo....","....oHLLLLLLLLLmmmmmmBBBBBBBBDDo....","....oHLHLLLLLLLLLLBBBBBBBBBBDDDo....",".....oHLLLLLLLLooooooBBBBBBBDDo.....","......oHLLLLLooHHLBDDooDDDDDDo......",".......ooooooHHLLLBBBDDoooooo.......","......ogggooHooooooooooDoogGGo......",".....oggoooHLoccccccccoDDoooGGo.....",".....ogo..oHLocrocyoecoDDo..oGo.....",".....ogo..oHLoccccccccoDDo..oGo.....",".....oGGo..oHooooooooooDo..oGGo.....",".....oooooooooooooooooooooooooo.....",".......ouuuuuuuuuuuuuuuuuuuuo.......","......ouuugGuuugGuuugGuuugGuuo......","......ouuuGGuuuGGuuuGGuuuGGuuo......","......ouuuuuuuuuuuuuuuuuuuuuuo......",".......ououououououououououoo.......","........oooooooooooooooooooo........","...................................."],"pal":{"o":"#1e1a34","H":"#cac2ec","L":"#a096d0","B":"#7a70ac","D":"#58508a","g":"#d8905a","G":"#a8603e","u":"#3e3a50","c":"#f2ecd8","y":"#fff0a8","r":"#e07a4a","k":"#141228","w":"#ffffff","e":"#5ab0c8","m":"#2a2440","p":"#f0a8b0"}}],"vil":[{"key":"scr_smog","name":"Smog Scrambler","rows":["....................................","....................................","....................................","....................................","....................................","....................................",".................o..................","..............oooHooo...............",".........ooo.oHHHLLDDo..............",".......ooHHHoHLHHHLBDDo........oo...","......oHHLLLHLLaoooogDDoooooo.oago..",".....oHLLLHLLLoaaaaggoBBBBBDDooaGGo.",".....oHLLHHLLoaawwwWggoBBBBBDoagkGo.",".....oHLHHLLoaawwwwwWggoBBBBDoagGo..",".....oHLHLLaaawwwwwwwWggGBBBBogGGo..",".....oHLLLLoawwwwekEwwWGoBBBDoojjo..",".....oHLLLLoawwwekkeEwWGoBBBDoBBBBo.",".....oHLLLLoawwwekkeEwWGoBBBDDoBDo..",".....oHLLLLogWwwEkkeEwWGoBBBDDooo...","....oooLLLLgggWwwEkEwWGGGBBBDDo.....","...oHLLooLLLoggWwwwwWGGoBBBBDDo.....","..oHLLBBoLLLLoggWWWWGGoBBBBBDDo.....","..oLoBBoLLLLLLogGGGGGoBBBBBBDDoo....","...o.oDoLLLLLLLGooooGBBBBBBBBBDDo...",".....ooLLLLLLLLLLLLBBBBBBBBBBDDDo...","......oHLkkLLLLLLLLBBBBBBkkDDoDDo...",".......oHLkttttttttttttttkDDooBDo...","........oHLktktktkktktktkDDo..oo....",".......oHLoHLkktktkktkkDDoDDo.......",".......oHLooHLLLLLDDDDDoooDDo.......",".......oHLooBDooHLoooDDo.oDDo.......",".......oHLo.oo.oHLo.oDBo.oBDo.......",".......oBDo....oHLo..oo...oo........","........oo.....oBDo.................","................oo..................","...................................."],"pal":{"o":"#0c0a18","H":"#5c5890","L":"#403c68","B":"#2c2a4c","D":"#1e1c34","j":"#7a7486","a":"#f2da92","g":"#d2a64e","G":"#9a7034","w":"#f4f0e6","W":"#c8c0b4","k":"#0a0812","e":"#e0703c","E":"#a84a30","t":"#f4f0e6"}},{"key":"scr_wrench","name":"Wrench Scrambler","rows":["....................................",".................oo.................","................oHDo......oo...oo...","...............oHLDDo....osso.osTo..","..............oHLLBDDo...ossooosTo..",".............oHLLLBBDDo..ossssssTo..",".............oHLLLBBDDo...ossssTo...","...........ooooLLLBBDoooo..ossTo....","..........ogggGoLLBBogggGo.ossTo....","..........ogllGogGXXogllGo.ossTo....","..........oglLGoXXXXoglLGo.ossTo....","..........oGGGXokkkkoGGGXo.ossTo....","...........ooookkkkkkoooo..ossTo....","...........oXkkkkkkkkkkXo..ossTo....","..........ooykkkkkkkkkkyoo.ossTo....","..........oXyyykkkkkkyyyXo.ossTo....","..........ookyyykkkkyyykoo.ooooo....",".........oHokkkkkkkkkkkkoooqqqqo....",".........oHLokkttttttkkooBoqqqqo....",".........oHLLokktkktkkoBBDDooooo....","........oHLLLLookkkkooBDDDXXo.......","........oHLLLLLLoooooBDDXXoo........","........oHLLLLLLLooBBoooooDo........",".......oHLLLLLLLoggGBBBBBBDDo.......",".......oHLLLLLLLogXGBBBBBBDDo.......",".......oHLLLLLLLLGGBBBBBBBDDo.......","......oHLLLLLLLLLLBBBBBBBBBDDo......","......oHccLLLLLLLLBBBBBBBBBDDo......","......oHccLLLLLLLLBBBBBBccBDDo......",".....oHLLLLLLLLLLLBBBBBBBBBBDDo.....",".....oHLLLLLLLLLDDDDDDDDDDDDDDo.....","......oooooooooooooooooooooooo......","....................................","....................................","....................................","...................................."],"pal":{"o":"#141a10","H":"#8e9e60","L":"#6a7a42","B":"#505e32","D":"#3a4426","X":"#2a3020","k":"#0a0c08","y":"#f6e05a","t":"#f4f0e6","g":"#d2a64e","G":"#9a7034","l":"#8ac8c8","s":"#d2d6e0","T":"#5c6076","q":"#c8a888","c":"#b8704a"}}]},{"w":9,"name":"Skyreach Isles","sp":[{"key":"puffleece","names":["Puffleece","Nimbuleece","Cumulamb"],"type":"Cloud","typeColor":"#9a94b8","flavor":"Its wool is made of real cloud, so it naps wherever the wind drifts it.","evo":[["horns"],["crown","aura"]],"rows":["....................................","....................................","....................................",".................oo.................","...............ooHDoo...............","..............oHHLBBDo..............","..........ooooHLLLBBBDoooo..........",".........oHHLHLLLLBBBBDBBDo.........","........oHLLLHLLLLBBBBDBBBDo........",".......oHLLLqHLLLLBBBBDqBBBDo.......",".......oooLLqHLLLHLBBBDqBBooo.......","......oaaGoLLqHHHHLLLLqBBoaaGo......","......oaoGoLLHHHHHLLLLLBBoGoGo......",".....ooGGoLLHHHHHHLLLLLLBBoGGoo.....","....oHLooHLLLHHHHHLLLLLBBBDooBDo....","...oHooooooDoqHHHqqLLLqoDooooooDo...","...oofffFFFogkkkqffkkkfFoFFFFFFoo...","...oHoffFFFokwwkkfkwwkkFoFFFFFoDo...","...oHoFFFFogkwwkkfkwwkkfFoFFFFoDo...","....oHooooogkkeekfkkeekfFoooooDo....","....oHHLBDogfkkkfffkkkffFoHHLBDo....","...oHLLLBBDogffffffffffFoHLLLBBDo...","..oHLLLLBBBoppfffnnffffppLLLLBBBDo..","..oHLLLLBBBDogffmffmffFoHLLLLBBBDo..","..oHLLLLBHHHLogffmmfFFoBBBDLLBBBDo..","..oHLLLLHLLLLBoogFFFooLBBBBDLBBBDo..","...oHLLLHLLLLBBBooooLLLBBBBDLBBDo...","....oHDqHLLLLBBBBqHLLLLBBBBDqDDo....",".....oooHLLLLBBBBqHLLLLBBBBDooo.....","........oHLDLBDDDooHLDLBDDDo........",".........oooHDoooJooooHDoooo........","..........ojooojjJoojjoojjJo........","..........oJJJoJJJooJJJoJJJo........","...........ooo.ooo..ooo.ooo.........","....................................","...................................."],"pal":{"o":"#3a3050","H":"#fffbf2","L":"#efe8de","B":"#d2cadc","D":"#aaa0c0","q":"#b8aecc","g":"#f4dcc0","f":"#e2bc9c","F":"#b88c78","j":"#7e6476","J":"#5a4458","a":"#f0d494","G":"#b88e58","k":"#241a30","w":"#ffffff","e":"#7aa0c8","p":"#e8a0a0","n":"#9a6464","m":"#7a4a52"}},{"key":"kitelet","names":["Kitelet","Glidray","Stratomanta"],"type":"Gale","typeColor":"#5e9a92","flavor":"It rides the high winds like a kite and ties its tail in lucky bows.","evo":[["wings"],["crest","aura"]],"rows":["....................................","....................................","....................................","....................................","....................................","....................................","...........oo..........oo...........","..........oHLo........oLBo..........","..........oLBLooooooooLBDo..........","..........ooLBoHHLBBBoBDoo..........",".........oHHooLLLLBBBBooDDo.........",".......ooHLLLLLLLLBBBBBBBDDoo.......","......oHHLLHkkkkLLBBkkkkBLBDDo......",".....oHLLLLkwwkkkLBkwwkkkBBBDDo.....","....oHLLLLLkwwkkkLBkwwkkkBBBBDDo....","...oHLLLHHLkkkkwkLBkkkkwkBBLLBDDo...","...oHLLLLLLkkeeekLBkkeeekBDDBBDDo...","..oHLLLLLLLLkkkkLLBBkkkkBBBBDDBDDo..","..occcLLLLLLLLLLLLBBBBBBBBBBBBDCCo..","..occoHLLLLppLLmLLBBBmBBppBBDDoocco.","...oo.ooHLLLLLLLmmmmmBBBBBDDoo..oo..","........ooHLLLLLLrrrBBBBDDoo........","..........ooHLLLLLBBBBDDoo..........","............oHLLLLBBBDDo............",".............oHLLLBBDDo.............","..............oHDDDDDo..............","...............ooooooo..............","................orrDrro.............","................orrRrro.....o.......","................orrorrooo.ooDo......",".................oo.oDDyyoyyo.......",".....................ooyyYyyo.......","......................oyyoyyo.......",".......................oo.oo........","....................................","...................................."],"pal":{"o":"#1a2c3a","H":"#b4e2d0","L":"#7cc0b0","B":"#55988e","D":"#386c70","c":"#f4ecd8","C":"#c8bca4","r":"#c86858","R":"#8e4442","y":"#e2b85c","Y":"#a8803c","k":"#14202a","w":"#ffffff","e":"#5aa8b8","p":"#e8a6a0","m":"#1e2c34"}},{"key":"grifkin","names":["Grifkin","Gryffalon","Aerigrand"],"type":"Gale","typeColor":"#b8905a","flavor":"It guards its cloud-top nest and practices flapping every single morning.","evo":[["crest"],["wings","aura"]],"rows":["....................................","....................................","....................................","........oo.......oo.......oo........","........oco.....occo.....oCo........","........occo..ooooCooo..oCxo........",".........occoocccccccCooCCxo........",".........oCCocccccccccCoCxo.........","..........occcccccccccccCo..........","..........occcccccccccccCo..........",".........ockkkkcccccckkkkCo.........",".........okwwkkkcccckwwkkko.........","...o.....okwwkkkcccckwwkkko.....o...","..oco....okkkkwkcccckkkkwko....oxo..","..occo...okkeeekcccckkeeeko...oCxo..","..occo...ockkkkcoyyYokkkkCo...oCxo..","..occco...oppcccoyyYocccppo..oCCxo..","..ocxxCo..occccccoYocccCCo..oCCxxo..","..occcxCo..oocccccocccCoo..oCCxCxo..","..occccCo.ocCcCcCcCcCcCco..oCCCCxo..","...oxxccCoooCLCoxoCoxoxoo.oCCCCxxo..","...occxccCoHLLLLLLBBBBBDDoCCCCxxo...","...occcccCoHLLLLHHHHBBBDDoCCCCCxo...","...oxxcccooooLLHLLLLHBBooooCCCxxxo..","....ooxCCoHLDoHLLLLLLHoLBDoCxxxBo...","......oooHLLBDHLLLLLLLLBBBDoooBo....",".......oHLLLBBHLLLLLLLBBBBBDooBo....",".......oHLLLBoccCoLLoccCoBBDoBo.....",".......oHLLLBoccCoLLoccCoBBDoo......",".......oHLLLBoxccxLLoxccxBBDo.......","........oHLLoyyyYYooyyyYYoDo........",".........oHDowywYwoowywYwoo.........","..........oooooooooooooooo..........","....................................","....................................","...................................."],"pal":{"o":"#2e1c22","H":"#f2cc8c","L":"#d8a264","B":"#b07a4a","D":"#7e5238","c":"#f4eee0","C":"#d2c4b0","x":"#a29280","y":"#f0c464","Y":"#c08c3c","k":"#201418","w":"#ffffff","e":"#d08a3a","p":"#e8a094"}},{"key":"zaplet","names":["Zaplet","Thundrizzle","Tempestorm"],"type":"Storm","typeColor":"#7c7898","flavor":"When it giggles, tiny sparks crackle and it starts to drizzle.","evo":[["horns"],["wings","aura"]],"rows":["....................................","....................................","...................oooo.............","..................oyyYo.............",".................oyyYo..............","................oyyyyoo.............","..............ooooyyYYo.............",".............oHHLLoyYoo.............","........ooooooHLLLoYoDoooooo........",".......oHHLBDHLLLLooBBDHHLBDo.......","......oHLLLBBHLLLLBBBBHLLLBBDo......","......oHLLLBqHLLLLBBBBHLLLBBDo......",".....oHLLLLooqHLLLBBBHLLooBBBDo.....",".....oHLLLLBooooLLBBqooooLBBBDo.....","......oHLLLBkkkkHDDDkkkkLLBBDo......","......oHLLLkwwkkkqqkwwkkkLBBDo......",".......oHDDkwwkkkLBkwwkkkDDDo.......","......ooHDqkkkkwkLBkkkkwkqHDoo......","....ooHHLBBkkeeekLBkkeeekHLBBDo.oo..","...oLLooLBBBkkkkLLBBkkkkLLLBBBooLLo.","...oHLLBoBBBDLLLLLBBBBBHLLLBBoBBBDo.","....oooBoyYBDqLLLLBBBBqHLLyYBoBooo..","....oHooLBBBDqLmmmmmmBqHLLLBBBoo....",".....oHDLBDDqLLLmtmmBBBqHDLBDDo.....","......ooHDoqLLLLLmmBBBBBqoHDoo......","........oo.oHLLLLLBBBBDDoyoo........","............ooHLDDDDDDooyYo.........","..........o...oooooooooyyooo........",".........oso.........oyyyyyYo.......",".........oSo.........ooooyyo........","..........o...o.........oyYo........",".............oso.......oyYo.........",".............oSo.......oyo..........","..............o.......oyo...........","......................oo............","...................................."],"pal":{"o":"#1a1828","H":"#aaa4c0","L":"#837c9c","B":"#625b7c","D":"#464060","q":"#524c6c","y":"#f4d870","Y":"#c89a42","s":"#a8d4e4","S":"#6a9ab4","k":"#141220","w":"#ffffff","e":"#e0b04a","m":"#2a1c2a","t":"#f4f0e6"}},{"key":"floatot","names":["Floatot","Balloonix","Zeppelord"],"type":"Float","typeColor":"#c88462","flavor":"It puffs up with warm air and carries its snacks in a tiny basket.","evo":[["crest"],["crown","aura"]],"rows":["....................................","..........o..............o..........",".........oHo............oLo.........","........oHLDo..oooooo..oLBDo........",".......oHLLBoooHHLBDDoooBBBDo.......",".......oHLLoHHHLLLBBBBDDoBBDo.......",".......oHLoHLLLLLLBBBBBDDoBDo.......",".......oHoHLwwLLLLBBBBBBDDoDo.......",".......ooHLwLLLLLLBBBBBBBDDoo.......","........oHwLDLLLLLBBBBBDBDDo........",".......oHLLLkkkkLLBBkkkkBBDDo.......",".......oHLLkwwkkkLBkwwkkkBDDo.......",".......oHLLkwwkkkLBkwwkkkBDDo.......",".......oHLLkkkkwkLBkkkkwkBDDo.......",".......oHLLkkeeekLBkkeeekBDDo.......",".......oHLLLkkkkLLBBkkkkBBDDo.......",".......oHLLLLLLLLLBBBBBBBBDDo.......",".......oHLppLLLLmLBBmBBBBppDo.......","........oHLLLLLLLmrmBBBBBDDo........","........oHLLLLLLLLBBBBBBBDDo........",".........ossssssssssSSSSSSo.........","..........osssssssssSSSSSo..........","...........oDDDDDDDDDDDDo...........","............oojLDDDDDDjo............","..............joooooooj.............",".............j..oDDDo..j............",".............j...oDo...j............",".............ooooooooooo............","............occccccccccco...........","............obKbbbKbbbKKo...........","............obbbKbbbKbbKo...........","............obKbbbKbbbKKo...........","............oKKKKKKKKKKKo...........",".............ooooooooooo............","....................................","...................................."],"pal":{"o":"#3a1e26","H":"#f8c6a0","L":"#e89a72","B":"#c87458","D":"#985048","s":"#f4e6c8","S":"#d6bea0","b":"#c89a5c","K":"#8e6440","c":"#e8c890","j":"#b08a64","k":"#2a1620","w":"#fffaf2","e":"#5a9a8a","p":"#f0aa98","m":"#5a2a30","r":"#d06a5a"}},{"key":"whalet","names":["Whalet","Cirruswhale","Leviaskye"],"type":"Cloud","typeColor":"#7486b8","flavor":"It swims through the clouds and sneezes little rainbows.","evo":[["crest"],["wings","aura"]],"rows":["....................................","..........ooo.......................",".......ooorrro......................","......orrryyyo.o....................",".....orryygsgsoso...................","....oryyggssSsSsso.......ooo....oo..","...oryygooosssSso........oHLo..oLBo.","..orrygo...ossSo.........oLLBooLBBo.","..orygo....ossSo..........oLBBBBBo..","..orygo....osSSo...........oLBBBo...",".orygo......oDDoo...........oLBDo...","..ooo.....ooooooHoooooo.....oLBDo...","........ooHHHHHHLBBBBDDoo...oLBDo...",".......oHHLLLLLLLBBBBBBHDo..oLBDo...",".....ooHLLLLLLLLLBBBBBBBDDoo.ooo....","....oHHLLLLLLLLLLBBBBBBBHBDDo.......","....oHLLkkkkLLLLkkkkBBBBBBHDo.......","...oHLLkwwkkkLLkwwkkkBBBBBBDDo......","..oHLLLkwwkkkLLkwwkkkBBBBBBHDDo.....","..oHLLLkkkkwkLLkkkkwkBBBBBBBDDo.....","..oHLLLkkeeekLLkkeeekBBBBBBBDDo.....","..oHLLLLkkkkcccckkkkCBBBBBBBDDo.....","..oHLLLLcccccccccccccccCBBBBDDo.....","..oHLLppccccmcccmccccppccCBBDDo.....","...oHccccccccmmmccccccccccCDDo......","....ooooCCCCCCCCCCCCCCCCCCCDo.......","....oLLoccccccccccccccccccCDo.......","....oLBoCCCCCCCCCCCCCCCCCoooo.......",".....oooCCCccccccccccCCCDoBBDo......","........ooHCCCCCCCCCCDDoo.oDDo......","..........ooooooHoooooo....oo.......","................o...................","....................................","....................................","....................................","...................................."],"pal":{"o":"#1e2242","H":"#bccbee","L":"#92a6da","B":"#6c80bc","D":"#4c5a92","c":"#f2ecdc","C":"#ccc2b4","s":"#d0eef4","S":"#86b8d0","r":"#cc7464","y":"#e6c46a","g":"#8cb48a","k":"#161a30","w":"#ffffff","e":"#6a90d0","p":"#e6a8a4","m":"#262a48"}}],"vil":[{"key":"scr_thunderblot","name":"Thunderblot Scrambler","rows":["......................................","......................................","..............oooooooo............oo..",".............oHHHLBBBDo..........oyo..","............oHLLLLBBBBDo........oyYo..","...........oHLLLLLBBBBBDo......oyyoo..",".......ooooHLLLLLLBBBBBBDooooooyyyyYo.",".....ooHLBDHLLLLLLBBBBBBDHssBBDooyYo..","....oHHLLBBHLLLLLLBBBBBBHLLLsBBDoyo...","...oHLLLLBqHLLLLLLBBBBBHLLLsBBBoyYo...","...oHLLLLBqHLLLLLLBBBBBHLLLLBBBoYo....","...oHLLLLBBqHLLLooooooHLLLLLBBoaaoo...","...oHLLLLBBBqHLoLLLBBBoHLLLLBBoaGo....","...oHssLLBBBBqoLLLLBBBBoLLLLBBBooo....","...osLLsLBBBBooooooooooooLLLBBBDooo...","....oHsLLBBDDovwwwekeEvWoHDDDDDooLBo..","....ooqHDDDqovvvweekeEvvWoqqqqqDoBDo..","..ooHLBDqqqLovvvEeekeeEWWoBBBBHLBooo..",".oHHLLBBBDLLLovvveekeEvWoBBBHHLLBBBDo.",".oHLLLBBBDLLLovvvEekeEWWoBBBHLLLBBBDo.",".oHLLLBBBDLLLLovvvEEEWWoBBBBHLLLBBBDo.",".oHLLLBBBDqLLLLoWWWWWWoBBBBqHLLLBBBDo.",".oHLLLBBBDqLLLLLooooooBBBBBqHLLLBBBDo.",".oHLLLBBDDqLLLLLLLLBBBBBBBBqHLLLBBDDo.","..ooHDDDqqLkkLLLLLLBBBBBBBBkkqHDDDoo..","....oooooHLLktktktktktktktkkDBDooo....","........oBDLLktkkktkkkkkkkkDoBDo......","........oBDoHLLkkkkkkkkkkDoooBDo......","........oBDoooBDLDDDDDDooBDooDDo......","........oDDo.oBDooooBDo.oBDo.oo.......",".........oo..oBDo..oBDo.oBDo..........",".............oBDo..oDDo.oBDo..........",".............oBDo...oo..oBDo..........",".............oDDo.......oBDo..........","..............oo........oDDo..........",".........................oo...........","......................................","......................................"],"pal":{"o":"#0c0c1a","H":"#626a94","L":"#454c72","B":"#30365a","D":"#20243e","q":"#272c4a","W":"#f2eee4","v":"#c4bec8","w":"#ffffff","e":"#e8b84a","E":"#a87a30","k":"#08080f","t":"#f4f0e6","y":"#f6dc72","Y":"#c89a42","a":"#5a5878","G":"#3a3850","s":"#7a84b0"}},{"key":"scr_squall","name":"Squall Scrambler","rows":["......................................",".....oo...............................","....occo..........ooo.ooo.............","...occCCo.......ooHDDooLBoo...........","..occkcCCo.....oHHLBDDooBDDoo..oo.....",".occcCkCCCo...oHLLLBBDDoooDDDooPpo....","..oCCkCkCo...oHLLLLBBBDDo.oooooPpo....","...oCCCCo...oHLLooooooDDo....oiiIo....","....oCCo....oHooXXXXXXooDo...oiiIo....","....ooo.....ooXXkkkkkkXXoo..oaggGo....","...oroxo...ooXkkkkkkkkkkXo..oaggGo....","..orooxo...ookykkkkkkkkkyoo.oaggGo....",".orao.oxo..ookyyykkkkkyyyoooaggGo.....",".oro..oxo.oHokkyYYkkkYYykoooaggGo.....",".oro..oxo.oHokkkkkkkkkkkkoDoaggGo.....",".orao.oxo.oHokkttttttttkkooagooo......","..oo...oxoHLLokktkktktkkoDoaoqqQo.....",".......oxoHLLLookkkkkkooBBocoqQQo.....",".......oxoHLLooooooooooooBoccooo......","........oHLLoaggggggggggGoDokko.......",".......oooLoagGGGGGGGGGGGoBoko........","......oqqQoLooooooooogGGoBBDoo...o....","......oqQQoLLLLLLLLBBBBBBBBDDo..oso...",".......oooLLLLLLLDLBBBBBDBBBDDoososo..",".......oHLLLLLLLLDLBBBBBDBBBDDoossso..","..oo..oHLLLLLLLLLDLBBBBBDBBBDDoososo..",".osso.oHLLLLLLLLDLLBBBBBBDBBBDDoo.o...",".ososooHLLLLLLLLDLLBBBBBBDBBBDDo......",".ossooHLLLLLLLLLDLLBBBBBBDBBBDDo......",".ososoHLLLLLLLLDLLLBBBBBBBDBBBDDo.....",".ossooHLLLLLLLLDLLDDBBBBBBDDDBDDo.....","..oooHLLooHLLLLLLDooDBBBBDDooDDDo.....","....oHoo..oHLLLLLo..oDDBDDo..ooDDo....",".....o.....ooHLoo....ooDDo.....oo.....",".............oo........oo.............","......................................","......................................","......................................"],"pal":{"o":"#121a22","H":"#7ea2a8","L":"#5a7e88","B":"#405c68","D":"#2c4250","X":"#24323c","k":"#080c10","y":"#f6e05a","Y":"#d0a830","t":"#f4f0e6","a":"#f2d48a","g":"#d4a24e","G":"#9a6a34","c":"#ece2c8","C":"#c0b296","r":"#c0584a","x":"#b0a898","q":"#c8a888","Q":"#9a7a62","P":"#c87060","p":"#9a4e44","i":"#b4b8c4","I":"#7a7e8e","s":"#8ab0b4"}}]},{"w":10,"name":"Starfall Citadel","sp":[{"key":"cometfox","names":["Sparkit","Cometail","Halleyon"],"type":"Comet","typeColor":"#c08a4a","flavor":"Its glowing tail leaves a trail of stardust wherever it runs.","evo":[["crest"],["wings","aura"]],"rows":["......................................","......o...............o.oo....t.......","......ooo...........ooo.oToo.......t..","......oBBo.........oBBo.oTTTooo...tTt.",".....oBsBBo...y...oBBsBoottTTTTo...t..",".....oBssBoooyYyoooBssso.ottTTTo......",".....oBsooHHHLyLLLBoosso..ottTtto.....",".....oBoHHHHHLLLLLBBBoso..oTTTtto.....",".....ooHHHHHLLLLLBBBBBoo..oTTTTtto....",".....ooHHHHLLLLLLBBBBDoo...oTTTttto.T.","....ooLHHkkkLLLLBBkkkDDoo..oTTTTtto...","....ooLLkwwkkLLBBkwwkkDoo..oTTTTttto..",".....oLLkwkkkLBBBkwkkkDo....oTTTttto..",".....oLLkkeekBBBBkkeekDo....oTTTTtto..","....oLccckkkcLLBBckkkccBo...otTTTtto..","...oLccccccccckkcccccccBoo..ottTTtto..","..oLcppcccccmcmmcmccpppcBo..occTTtto..",".oLccccccccccmccmcccccccCBo.occTttcco.","..oocccccccccccccccccCCCooo.occctccco.","....ooocccccccccccCCooo.....occccccco.","......oLooocccccCCooBDo....oLccccccCo.","......oLLoooooooooBBDo.....oLcccccCCo.","......oHLccccccccccCBDo....oLLLcccCo..",".....oHLLcccccccccCCBDDo...oLLLccCCo..",".....oHLLLccccccccCCBBDo..oLLLLBBDDo..","....ooHLLLLcccccCCCBBDDo.oHHLLLBBDDo..","...oHHLLLLLccccccCCBBBDDoHHLLLBBBDDo..","...oHLLLLoLLccccCCLBoBDDoHLLLLBBBDo...","...oHLLLoLLLLooooLLLBoDDDoLLBBBBDDo...","...oLLLLoHLLBoHLLLBBoBDDoLLBBBDDDDo...","...oLLLLoLLLBoLLLLBBoDDDooBBBDDDoo....","...oLLLBoLLLBoLLLBBBoDDDooBBDDDo......","...oLLBBoSSSsoSSSssoBDDooBBDDoo.......","....oBBBoSSSsoSSSssoDDoDoDDDo.........","....ooooSSssoSSssoooooooDDoo..........","........oooooooooooo....oo............","............o...o.....................","......................................"],"pal":{"o":"#2c1420","H":"#f6c27a","L":"#e6964e","B":"#c46a38","D":"#8e4430","c":"#f6ecd8","C":"#d6c0a6","s":"#4a2a30","S":"#6a3e3e","T":"#eef8f6","t":"#a8dce4","u":"#6aa6c2","k":"#1c0e18","w":"#ffffff","e":"#4a8aa0","m":"#6a2a34","n":"#3a1a22","p":"#e8a08a","y":"#f6dc8a","Y":"#d09a48"}},{"key":"galaxcat","names":["Twinkit","Nebulynx","Andromeow"],"type":"Nebula","typeColor":"#6a70a8","flavor":"It naps on the crescent moon and dreams up brand-new stars.","evo":[["horns"],["crown","aura"]],"rows":[".......o.................o............",".......oo................o............",".......o.................o............",".......oo...............o.............",".......oBo............ooo.............","...s...oBBo..........oiio....y........","..sss..oBiioo.......oiiio...yYy.......","...s...oBiiiioooooooiiiio..yYwYy......",".......oBiiooHHyyLLoooiiio..yYyBoo....",".......oBooHHHHyLLLLBsoiio...yBBBBo...",".......ooHHsHHLyyLLBBBBoio....oBBBBo..",".......ooHHHHLLLLLLBBBBDoo.....oLLBo..",".......oHHkkkLLLLLBBkkkDDo......oLBo..",".......oLkwwkkLLLBBkwwkkDo......oLBBo.",".......oLkwkkkLLBBBkwkkkDo......oLBBo.",".......oLkkeekLBBBBkkeekDo.......oLBo.","......oBBBkkkGGGGGGGkkkDDo......oLLBo.",".o....oBppBBGGGnnGGGGDDppDo.....oLBBo.",".o...ooooBBBGGmGmmGGgDDDDDDo....oLBBo.",".oo......ooBGGGGGGGggDooooo....oLLBoo.",".oo........ooGGGGGGoooLLLBBoo..oLBBoo.",".oqo.........ooooooLLLLLsBBBBooLLBoxo.","..oqo........oHLLLLLLLLLBBoooDoLLoxo..","..oqqo.....ooooLLLoLLLLsBoLsLooLoxxo..","..oqqqo....oLLoLLoBoGGGgogLLBBooxxxo..","...oQQQo...oLLoLoLBBoGGgogLBBDoxxxo...","...oQQQQo..oLLoLoLBBoGggogBBDDoxxxo...","....oQQQQooLLBoooLBBoggggoBDDoxxxo....","....oQQQQQoLBBo.oLBBoooooooooxxxxo....",".....oQQQQoBBBoooLBBoooxxxxxxxxxo.....","......xxQQQoooQQQoBoxxxxxxxxxxxo......",".......oQQQQQQxxxxoxxxxxxxxxxxxx......","........ooQxxxxxxxxxxxxxxxxxoo....s...","..........ooxxxxxxxxxxxxxxoo.....sss..","............ooxxxxxxxxxooo........s...","...............oooooooo...............","......................................","......................................"],"pal":{"o":"#161636","H":"#a2aee6","L":"#7480c8","B":"#545aa2","D":"#3a3c78","g":"#6aa6bc","G":"#a8c8dc","i":"#8a6aa8","s":"#f2eedc","q":"#f4e4b0","Q":"#d6bc80","x":"#a68858","k":"#0e0c22","w":"#ffffff","e":"#e8c25a","m":"#3a2a5a","n":"#2a2048","p":"#d8a0b0","y":"#f6dc8a","Y":"#d6a650"}},{"key":"novadrake","names":["Novakin","Novawyrm","Supernovus"],"type":"Astral","typeColor":"#a8604e","flavor":"Its crystal horns hum when a shooting star flies past.","evo":[["horns"],["wings","crown","aura"]],"rows":["......................................","......................................","........oo..................oo........",".oo......oo.......oo.......oo......oo.",".oBo.....oJo......oo......oKo.....oBo.","..oo......oKo..oooooooo..oJo......oo..","..oso.....oKKooHHHLLLLBooJJo.....oos..","..ooBo....oKoHHHHHLLLLBBBoJo....oLoo..","..ovoo.....oHHHHHLLLLLBBBBo.....ooVo..","...oooo...oHHHHHLLLLLLBBBBBo...oooo...","...oVooo..oHkkkLLLLLLBBkkkDo..oooVo...","...oVVoVoookwwkkLLLLBBkwwkkoooVoVVo...","...osVooVoLkwkkkLLLBBBkwkkkDoVooVVs...","...oVVVoooLkkeekLLBBBBkkeekDoooVVVo...","...oVVVVoooLkkkBBBBBBBBkkkDoooVVVVo...","...oVVVVoBoBBBBccccccccDDDDoBoVVVVo...","...oVVVVVppBBBcccncncccCDDDppVVVVVo...","..oVVVVVVVooBccccccccccCCDooVVVVVVVo..","..oVVVVVVVoBocccmcccmCCCCoBoVVVVVVVo..","..ooVVVVVVVooooccmrmCCCooooVVVVsVVoo..","....ooVsVVVo...oooooooo...oVVVVVoo....","......oVVVVoo.oHHHLLLBBo.ooVVVVo......","......oVVVVoBoHHHHccLBBBoBoVVVVo....o.","......oVVoooBoHHcCccccBBoBoooVVo....o.","......ooo.oLLoHHccccccBBoBBo.ooo...oo.","..........oLLoLccCCCCCCDoBBo......oKo.","..........oLoLLcccccccCDDoBo......oKo.","..........oLoLLcccccccCDDoBo.....oooo.","...........ooBBccCCCCCCDDoo.....oLLo..","............oBBccccccCCDDo.....oLLLo..","............ooBcccccCCCDoooooooLLBo...","...........oLLoccCCCCCCoBBoLLLLBBBo...","..........oLLLBoCCCCCCoBBBBoLBBBBo....","..........oLLBBBooooooBBBBBoBBBoo.....","...........oBBBBo....oBBBBoBBoo.......","............oooo......oooo.oo.........","......................................","......................................"],"pal":{"o":"#26101e","H":"#e88c84","L":"#c25a5a","B":"#963c4a","D":"#66283c","c":"#f2dca4","C":"#cfae74","v":"#f0c878","V":"#c88e4e","s":"#fff4d8","j":"#d4f4ee","J":"#86ccc8","K":"#4a8c9c","k":"#1a0c16","w":"#ffffff","e":"#e8b84a","m":"#5a1e2a","r":"#d0705a","n":"#4a1a24","p":"#f0a890"}},{"key":"starsquire","names":["Squirkle","Starsquire","Paladinova"],"type":"Valor","typeColor":"#6a7ea4","flavor":"A brave little knight who guards the citadel gates every night.","evo":[["crest"],["wings","aura"]],"rows":["......................................","...............................o......","..................oo..........oyo.....","........ooo......oYYo......oooyyyoo...",".......offfo.....oooo.....offfowyyo...","......offfffo.ooooLLoooo.offfffoyo....",".....offppppFoHHHHLLLLBBofppppfFoyo...",".....offppppoHHHHHLLLLBBBoppppFFooo...",".....offpppoHHHHHLLLLLBBBBopppFFo.....","......ofppoHHHHHLLLLLBBBBBBoppFooo....",".......oFFoHHHHHLLLLLLLLLLLoFFoZo.....","........oooLooooooooooooooLooooZo.....","..........oLofkkkffffkkkfoLo...o......","..........oLokwwkkffkwwkkoLo...o......","..........oLokwkkkffkwkkkoLo...o......","..........oBokkeekffkkeekoDo...o......","..........oBBokkkffffkkkoDDo...o......","...........oBppfffnnFFFppDo....o......","...........ooofffmfFmFFFooo....o......",".........ooLLooooommoooooLLoo..o......","..ooooooooooBBooooDDooooLLBBo..o......","..oggggggggoBBoHHHooLBBoLBBBo..o......","..ogbbbbsbboBooHHHLLLBBooBBoo..o......","..ogbsbbbbboooHHHLLyLBBBoooBoooo......","..ogbbbbbbbooLHLLyyyyyBBDooBofffo.....","..ogbbbbbsbooLLLLLyYyBBDDoooofffo.....","..ogbbbbbbbooLLLLyBBByDDDoo.oooo......","..ogbbsbbbGooLLLBBBBBBDDDouo...o......","...oGbbbbGoVoBBBBBBBDDDDDouo...o......","....oGbsGoVVVoBBBBBDDDDDouuo...o......",".....oGbGoVVVooByyyyYYYoouuo...o......","......oGooVVoLLooyyYYooZZouuo..o......","......oo.oVVoLLLLooooBZZZouuo..o......","........oVVVoLBBDooooBBBDouuo..o......","........oooooBBDDo..oBBDDooooo.o......",".............oooo....oooo......o......","...............................o......","......................................"],"pal":{"o":"#161a30","H":"#eef2f8","L":"#bcc8de","B":"#8696b8","D":"#5a6890","v":"#3e8a8a","V":"#2a6468","u":"#1e4650","y":"#f4d68a","Y":"#d0a250","Z":"#9a7038","g":"#d0a250","G":"#9a7038","b":"#344a7e","s":"#f4f0d8","f":"#f0dcc0","F":"#c8a888","k":"#12101e","w":"#ffffff","e":"#5a9ad0","m":"#5a2a36","n":"#3a2028","p":"#e8a4a0"}},{"key":"orbiling","names":["Globbit","Orbitot","Planetitan"],"type":"Orbit","typeColor":"#4a9090","flavor":"A tiny planet with its own moon that follows it like a puppy.","evo":[["crest"],["crown","aura"]],"rows":["......................................","......................................",".......s.......................oooo...","..............................oqqqQo..","...s..........................oqxQQo..","..sss.........................oqQQxo..","...s..........................oQQxxo..","...............................oooo...","..............oooooooooo..............",".............oHHHLLLLLLco.............","...........ooHHHHLLLLLcccoo...........","..........oggGGHHLLLLLLCCCCo..........","..........ogGGGGHLLLLLLBBBBo..........",".........oGGGGGGLLLLLLBBBBBDo......s..","........oGGGGGkkkLLLLLkkkBBDDoooo.sss.","........oLLLLkwwkkLLLkwwkkBDDoAAAoos..","........oLLLLkwkkkLLLkwkkkBDDoAAAAAoo.","........oLLLLkkeekLLBkkeekDDDooAAAAoo.","......oooLLLLLkkkLLBBBkkkBDDDo.oooooo.","....ooaaoLLppLLLLBmBBmBBBppDDo.oooozo.","...oaaaooLLLLLLLBBBmmBBBDDDDDooAAzzo..","..oaaaoLoLLLLLBBBBBBBBBDDDDDooAAzzo...",".oaooooLoBBBBBBBBBBBBBDDooooAAAAoo....",".ooooooLoBBBBBBBBBBBooooAAAAAAooo.....",".ooAAAAoooooooooooooAAAAAAAoooBBBo....",".ooAAAAAAAAAAAAAAAAAAAAAoooo..oBBo....","...ooAAAAAAAAAAAAAAAooooGGGo...oo.....",".....oooooooooooooooDDDDGoo...........",".............oDDDDDDDDDDo.............","..............oooooooooo..............","............oooo......oooo............","...........oLLLBo....oLLLBo...........","....s......oLLBBo....oLLBBo...........","...........oLBBDo....oLBBDo...........","...........oBBDDo....oBBDDo...........","............oooo......oooo............","......................................","......................................"],"pal":{"o":"#102830","H":"#9cdcc8","L":"#5cb4a6","B":"#3c8a8a","D":"#2a606c","g":"#a6c070","G":"#6e9050","c":"#f2f6ee","C":"#c8dcdc","a":"#eed6a4","A":"#c6a072","z":"#8e6c56","q":"#e4e0d6","Q":"#b0aaa0","x":"#7c766e","s":"#fff6d8","k":"#0c1a1e","w":"#ffffff","e":"#6ab0e0","m":"#3a1e2a","p":"#eca896"}},{"key":"lunaut","names":["Lunabun","Lunanaut","Selenaut"],"type":"Lunar","typeColor":"#8a86b0","flavor":"It hops so high on the moon that it needs a space helmet.","evo":[["crest"],["wings","aura"]],"rows":["..........................yyy.........",".................oooo......y..........","..............ooojjjjooo...o..........",".............oojjjjjjjjoo..o..........","...........ooWWojjjjjjoffoo...........","...........oWffojjjjjjoffoo...........","..........oWjofojjjjjjofoJJo..........",".........ojWjofojjjjjjofoJJJo.........",".........ojjjoffojoojoffoJJJo.........",".........ojjjofoooffooofoJJJo.........",".........ojjjoooffffffoooJJJo.........",".........ojjjoffffffffffoJJJo.........",".........ojjoffkkkfffkkkFoJJo.........",".........ojjofkwwkkfkwwkkoJJo.........",".........ojjofkwkkkfkwkkkoJJo.........",".........ojjofkkeekfkkeekoJJo.........","..........oJJofkkkffFkkkoJJo..........","...........oJppffFnnFFFppJo...........","...........ooJJoomFFmooJJoo...........","........ooooooJJJJmmJJJJoooooo........","........oqqooyoooJJJJoooYooQQo........","........oqqooooooooooooooooQQo........","........oqoLLoooHHLLLBoooLLoQo........","........oqoLLoHHHHLLLBBBoLBoQo........","........ooLLLoHHooooooBBoLBBoo........","........ooLLLoHLorgbyoBBoLBBoo........","........ooLLoLLLooooooBDDoLBoo........","........ooLLoLLLLLBBBBBDDoLLoo........","........oooooLLLBBBBBBDDDooooo........","........oYYYoBBBBBBBBDDDDoYYYo........","........oooo.oBBBBBDDDDDo.oooo........","............oooBBDDDDDDooo............","............oyyoooDDoooYYo............","...........oyyYYYooooYYYYYo...........","............oYYYYo..oYYYYo............",".............oooo....oooo.............","......................................","......................................"],"pal":{"o":"#20203a","H":"#f8f6fc","L":"#dcd6ec","B":"#b0a8d0","D":"#7c74a4","f":"#f6ecdc","F":"#d6c2b0","j":"#c8e6ee","J":"#94c2d4","W":"#ffffff","y":"#f2cc78","Y":"#c49048","q":"#9aa0b4","Q":"#747a92","x":"#545a72","r":"#d86a52","g":"#7cc08c","b":"#6aa2d8","k":"#141228","w":"#ffffff","e":"#a87ac8","m":"#4a2a3a","n":"#c87a8a","p":"#eeaaa8"}}],"vil":[{"key":"scr_voidblot","name":"Voidblot Scrambler","rows":["........................................",".ooooo..................................",".oPPPo..................................",".oPkPo.........................o........",".oQPQo..oo....................oBo.......",".ooooo.oLLo...oooooooooooo....oBo.......",".......oLLo.ooHHHLLLLLLLLLoo..oBo.......",".......oLLLoHHHHHHooooLLLNNNoo.o........","........oHHHHHHooottttoooNNNNMo.........","........oHHsHHottttttttttoNNMMMo........",".......oHHHHHottttttotttttoMMMMDo.......","......oHHHHHottttttoeoottttoBBBDDo......","......sHHHHHotttttekkeeotttoBBBDDos.....",".....sSsHHHHotttoeekkeeeottoBBBDDDo.....",".....osHHHHottttoeekkeeeottToBBDDDo.....",".....oLLsLLLotttoeekkeeeotToBBDDDDo.....",".....oLLLLLLotttoeekkeeEoTToBDDDDDo.....",".....oLLLLLLottttoekkeEoTTToBDDDsDo.....",".....oLLLLLLLottttooEooTTToBDDDDDDo.....",".....oLLLLLLLLotttttoTTTToBDDDDDDDo.....",".....oLLLLLLLLLoooTTTToooBDDDDDDDDo.....","....oBBsBBNNNNNBBBooooBBBDDDDDDDDDDo....","...oLBBBBNNNNNNNMBBBBBBBDDDDDDDDDDDBo...",".ooLLBBBNNNNNNNMMMBBBBDDDDDDDDDDDDBBBoo.",".oLBBBBBNNNoooooooooooooooooosDDDDBBBBo.",".oBBBooBBMMokttktkttkttktkttkoDDDooBBBo.",".oBBo.oBBBMMokkkkkkkkkkkkkkkoDDDBo.oBBo.",".oBo..oLBDDDDokttktkkkkttktkoDDsBo..oBo.",".oBo.oLLBDooDDoooooooooooooooosSsBo.oBo.",".oo..oLLBo..oDDDDDDDDDDDsDDo..osBBo..oo.",".....oLBBo..oDDDDoDDDDDDDDBo..oLBBo.....",".....oLBo...oLBBo.oLLLooLBBo...oBBBo....","....oBBBo...oLBBooLLLBBoLBBo....oBooooo.","....oBBo....oLBBooLLBBBoLLBo....oBoPkPo.","....oBBo....oLBBooBBBBBoLLBo.....ookPko.",".....oo.....oBBo..oBBBo.oLBo......oQQQo.","............oBBo...ooo..oBBo......ooooo.","............oBBo........oBBo............","............oooo.........oo.............","........................................"],"pal":{"o":"#0a0a1c","H":"#5a64a8","L":"#3e4486","B":"#2c2e62","D":"#1e1e46","N":"#4a7aa0","M":"#3a5280","s":"#f4f0e6","S":"#f0d890","t":"#f4f0e6","T":"#c8c0b4","e":"#e8b448","E":"#b07230","k":"#0a0a12","P":"#e8dcc0","Q":"#b8a888"}},{"key":"scr_starimp","name":"Starquill Scrambler","rows":["........................................",".........oooooooo...................oo..","............ooLLLo................ooo...","..............oLBBo..............oFoo...","..............oBBBo.............oFFo....","..............oBBBBo............oFoo....",".............oBsBBBBo..........oFFoo....",".............osSsBBBBo........oFFoo.....",".............oBsBBBBBBo.......oFFo......","............oBBBBBBBBBBo.....oFFoo......","...........oBBBBBBBBBBBBo....oFFo.......","..........oBBBBBBBBBBBBBDo..oFFoo.......",".........oBBBBBooooooooDDDoooFFo........","........oyyyyyyyyyyyyyyyyyyyyyoo........",".......ooLLLLLokkkkkkkkoBBBDDoo.........","......oLLLLLLokkkkkkkkkkoBDDDDDo........",".......ooLLLokkwykkyykkkkoDDDoo.........",".........ooookkyykkyykkkkooooo..........","...........ookkkkkkkkkkkkoooo...........","..........oLokkkkkkkkkkkkoGooo..........",".........oLLBokwkwkwkwkkooooBBo.........","........oLLBBBokkkkkkkkoBoooBBo.........",".......oLLBBBoBoookkoooBBBoBBBBo........","......oLLBBBoBBBBsooBBBBBooBBBBo........",".....oLLBBBoBBBBBBBBBBBBBoBoooooo.......","....ooooBBooBBBBBBBBBBBBooBooqqoo.......","....oqqqoooBBBsBBBBBBBBBooBBoooo........","....oqqQo.oBBBBBBBBBBBBooBBBBoo.........",".....ooo..oBBBBBBBBBBBBooBBBDo..........",".........oBBBBBBBBBBBBBooBDDDDo.........",".........oBBBBBBBBBBsBBBBDDDDDo.........",".........oBBBBBBBBBBBBBDDDDDDDo.........",".........oBBBBBBBBBBBBDDDDDDDDo.........","........oBBBsBBBBBBBBDDkDDDDDDDo........","........oBBBBBBBBBBDDDDksDDDDDDo........","........oBBBBBBBBBDDDDDDDDDDDDDo........",".......oooooooooooooooooooooooooo.......",".........o...o...o...o...o...o...o......","........................................","........................................"],"pal":{"o":"#08141c","H":"#4e8a94","L":"#336c78","B":"#245460","D":"#183c4a","k":"#06080e","y":"#f6e05a","Y":"#c8a040","w":"#f4f0e6","s":"#f4f0e6","S":"#f0d890","f":"#f4f0fa","F":"#b8c8e8","G":"#7a8cbc","Z":"#d8c8a0","q":"#e8c090","Q":"#b88a60"}}]}];
function worldField2(kind,w=256,h=72){
 const c=document.createElement('canvas');c.width=w;c.height=h;
 const g=c.getContext('2d');
 const P=(x,y,col)=>{if(x<0||y<0||x>=w||y>=h)return;g.fillStyle=col;g.fillRect(x|0,y|0,1,1)};
 const R=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(x|0,y|0,a|0,b|0)};
 // deterministic hash 0..1
 const N=(a,b)=>{let n=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263))|0;n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296};
 // sprite: rows of chars, pal map, optional horizontal flip
 const S=(x,y,m,pal,fl)=>m.forEach((r,j)=>{for(let i=0;i<r.length;i++){const col=pal[r[i]];if(col)P(fl?x+r.length-1-i:x+i,y+j,col)}});
 // sky bands with ALttP style dithered transitions
 const sky=(cols,ys)=>{for(let i=0;i<cols.length;i++)R(0,ys[i],w,ys[i+1]-ys[i],cols[i]);
  for(let i=1;i<cols.length;i++){const y=ys[i];for(let x=0;x<w;x++){if((x+y)%2===0)P(x,y-1,cols[i]);if((x+y*2)%4===0)P(x,y-2,cols[i]);if((x+y*2)%4===2)P(x,y,cols[i-1])}}};
 const E=(cx,cy,rx,ry,col)=>{for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if((x*x)/(rx*rx+.01)+(y*y)/(ry*ry+.01)<=1)P(cx+x,cy+y,col)};
 // terrain silhouette: top(x) -> filled to y1; rim + shade fn
 const ridge=(top,y1,base,rim,dark,shade)=>{for(let x=0;x<w;x++){const t=Math.round(top(x));R(x,t,1,y1-t,base);P(x,t,rim);if(shade)shade(x,t)}};
 // walking lane
 const lane=(c0,amp,per,ph,hh,base,edge,hi,tex)=>{for(let x=0;x<w;x++){const yc=Math.round(c0+amp*Math.sin(x/per+ph)),t=yc-hh,b=yc+hh;R(x,t,1,b-t+1,base);P(x,t,edge);P(x,b,edge);P(x,t+1,hi);if(tex)tex(x,t,b)}};
 const laneY=(c0,amp,per,ph,x)=>Math.round(c0+amp*Math.sin(x/per+ph));
 const MK=(x0,y0,ww,hh,ins,col,ol)=>{for(let y=0;y<hh;y++)for(let x=0;x<ww;x++)if(ins(x,y))P(x0+x,y0+y,(!ins(x-1,y)||!ins(x+1,y)||!ins(x,y-1)||!ins(x,y+1))?ol:col(x,y))};
 const steam=(x,y,cs)=>{[[0,8,2],[2,4,3],[5,-1,4]].forEach(([dx,dy,r])=>MK(x+dx-r,y+dy-r,r*2+1,r*2+1,(i,j)=>Math.hypot(i-r,(j-r)*1.2)<=r+.3,(i,j)=>i+j<r?cs[0]:i+j>r*3-1?cs[2]:cs[1],cs[3]))};
 const puff=(x,y,cs)=>{const b=[[3,6,3],[7,4,4],[11,6,3],[6,7,3]];MK(x,y,16,11,(i,j)=>b.some(([a,c,r])=>Math.hypot(i-a,j-c)<=r),(i,j)=>{const t=i+j;return t<8?cs[0]:j>7||t>15?cs[2]:cs[1]},cs[3])};
 const cloud=(x,y,s,cl)=>{const m=s?["....oooo.......","..ooWWWWo.oooo.",".oWWWWWWWoWWWWo","oWWWWWWWWWWWWLo","oLWWWWWWWWWLLLo",".oLLLLLLLLLLLo.","..ooooooooooo.."]:["...ooo....",".ooWWWoo..","oWWWWWWWoo","oLLWWWWLLo",".oooooooo."];S(x,y,m,cl)};

 if(kind==='coast'){
  sky(['#4a78b8','#5c88c4','#6e98ce','#84aad8','#9cbce0'],[0,5,10,15,20,25]);
  const cl={o:'#9aaccc',W:'#f2f4f6',L:'#cdd8e8'};
  cloud(6,3,1,cl);cloud(74,7,0,cl);cloud(132,2,1,cl);cloud(196,6,0,cl);cloud(232,1,1,cl);
  // distant island
  S(176,19,["......oooo......","...ooo2222oo....",".oo22221111ooo..","o222211111111oo."],{o:'#3e6a7a','2':'#5a8a88','1':'#4a7a80'});
  // sea
  R(0,23,w,4,'#2e5c8c');R(0,27,w,5,'#36709e');R(0,32,w,4,'#3e8ca4');R(0,36,w,4,'#58aaae');
  for(let x=0;x<w;x++){if((x+1)%2===0)P(x,26,'#36709e');if(x%2===0)P(x,31,'#3e8ca4');if(x%2===1)P(x,35,'#58aaae');
   if(N(x,1)<.12)R(x,24+((x*7)%3)*2,3,1,'#6a9cc8');if(N(x,2)<.08)R(x,28+(x*3)%3,2,1,'#a8cce4')}
  // reef shapes in shallow water
  for(let x=4;x<w;x+=14+((x*7)%9)){const t=N(x,3);const col=t<.33?'#c4785c':t<.66?'#8aa86a':'#b8906a';const sh=t<.33?'#9a5a4c':t<.66?'#5e8456':'#8a6a54';
   R(x,34,3,2,col);P(x+1,33,col);P(x+3,35,sh);P(x+2,35,sh);if(t>.5)P(x,33,col)}
  // shoreline foam
  for(let x=0;x<w;x++){const y=Math.round(39+1.5*Math.sin(x/9)+Math.sin(x/4));R(x,y,1,3,'#e6efe8');P(x,y-1,'#b8dcd4');R(x,y+3,1,40,'#dcc08a');P(x,y+3,'#b89a68')}
  // sand texture
  for(let y=42;y<h;y+=3)for(let x=(y*5)%7;x<w;x+=7){const n=N(x,y);if(n<.3)P(x,y,'#c8a670');else if(n<.45)P(x,y,'#ecd8a8');else if(n<.5)R(x,y,2,1,'#c8a670')}
  // boardwalk
  lane(53,2,30,0,5,'#a88058','#5a3c2c','#c8a07a',(x,t,b)=>{if((x+Math.round(2*Math.sin(x/30)))%6===0)R(x,t+1,1,b-t-1,'#7a583e');else{if(N(x,4)<.15)P(x,t+3+((x*3)%6),'#94704c')}P(x,b+1,'#b89a68')});
  for(let x=3;x<w;x+=24){const y=laneY(53,2,30,0,x)+6;S(x,y,["oo","nn","nn","oo"],{o:'#4a3024',n:'#7a583e'})}
  // palm
  const palm=(x,y,fl)=>{for(let i=0;i<30;i++){const tx=x+Math.round(Math.pow((30-i)/30,2)*(fl?-5:5));const yy=y+8+i;R(tx-1,yy,4,1,i%3===0?'#6a4a34':'#8a6444');P(tx-2,yy,'#3e2a20');P(tx+3,yy,'#3e2a20');P(tx-1,yy,i%3===0?'#7a583c':'#a07a54')}
   S(x-12,y,["........oo..........oo....","......ooGGo....oo..oGGoo..","....ooGGLLGo..oGGooGLLGGo.","..ooGGLLLGGGooGLLGGGGGLLGo",".oGGLLGGGGDDGGGGGDDGGGGGLo","oGLLGo.ooGGcGcGGGGoo.oGGGo","oLGo..oGGDccccDDGGGo..oGo.","oLo..oGGDoo.ccooDDGGo..oo.","oo..oGDo.........oDGGo....","...oGDo...........oDGo....","...oDo.............oDo....","...oo...............oo...."],{o:'#1e3a2a',G:'#4a8a4a',L:'#7ab060',D:'#2e6238',c:'#8a5a3a'},fl)};
  palm(118,4,0);palm(232,10,1);palm(18,12,0);
  // tide pools
  const pool=(x,y,big)=>{const rx=big?9:6;E(x,y,rx+1,3,'#8a8478');E(x,y,rx,2,'#3e8ca4');E(x-1,y-1,rx-2,1,'#58aaae');P(x+2,y,'#c4785c');P(x-3,y+1,'#8aa86a');E(x,y+2,rx-1,0,'#2e6e8c');for(let i=-rx-1;i<=rx+1;i+=3)P(x+i,y-2+(i%2),'#a8a294')};
  pool(68,66,1);pool(176,65,0);pool(246,64,0);
  // shells & starfish & crab
  const star=["..o..",".oSo.","oSSSo",".oSo.","o...o"],sp={o:'#8a4a3a',S:'#d8885a'};
  S(40,62,star,sp);S(150,67,star,sp);S(212,40,star,sp);
  const shell=["..oo..",".oSSo.","oSLSLo","oSLSLo",".oooo."],shp={o:'#8a6a5a',S:'#e8d4c0',L:'#c8a894'};
  S(98,64,shell,shp);S(198,68,shell,shp);S(8,66,shell,shp);S(136,43,shell,shp);
  S(88,40,["o.o..o.o","oo.oo.oo",".oCCCCo.","oCCwCwCo",".oCCCCo.","o.o..o.o"],{o:'#6a2e28',C:'#c8644c',w:'#f4ece0'});
 }
 else if(kind==='desert'){
  sky(['#5e88bc','#7298c4','#88a8c8','#a4b8c8','#c4c8c0','#dcd2b4'],[0,6,11,16,21,25,29]);
  // sun
  E(206,10,8,8,'#f0dca8');E(206,10,6,6,'#fbeec8');E(205,9,4,4,'#fff8e0');
  for(let a=0;a<16;a++){const x=Math.round(206+11*Math.cos(a*Math.PI/8)),y=Math.round(10+11*Math.sin(a*Math.PI/8));if(a%2===0)P(x,y,'#f0dca8')}
  // mesas
  ridge(x=>{const m=[[20,60,19],[96,140,16],[180,236,20]];for(const [a,b,t] of m)if(x>=a&&x<=b)return t+(x-a<3?3-(x-a):0)+(b-x<4?4-(b-x):0);return 27+2*Math.sin(x/11)},42,'#b4826a','#d0a080','#8a5a54',(x,t)=>{for(let y=t+1;y<34;y++){if((y+x*0)%4===0&&N(x,y)<.6)P(x,y,'#a07060');if(y>t+5&&(x+y)%2===0&&y>30)P(x,y,'#9a6a5c')}});
  // dunes
  ridge(x=>31+3*Math.sin(x/18)+2*Math.sin(x/7+1),42,'#d6a464','#ecc890','#b8844e',(x,t)=>{const s=Math.cos(x/18)*3+Math.cos(x/7+1)*2*18/7;if(s>0)for(let y=t+1;y<t+4;y++)if((x+y)%2)P(x,y,'#c08a52')});
  R(0,40,w,h-40,'#dcae6c');
  for(let x=0;x<w;x++){if(x%2)P(x,40,'#c8985a')}
  // ripples
  for(let y=44;y<h;y+=4)for(let x=0;x<w;x++){const yy=y+Math.round(Math.sin(x/6+y));if(N(x>>2,y)<.55){P(x,yy,'#c4945a');if(N(x,y)<.3)P(x,yy-1,'#ecc890')}}
  // sandstone road
  lane(53,2,26,1,5,'#b8906c','#6e4a3a','#d4ae86',(x,t,b)=>{const o=Math.round(2*Math.sin(x/26+1));if((x+o*0)%9===0)R(x,t+1,1,b-t-1,'#8a6450');if(x%9===4)P(x,t+6,'#8a6450');if(x%18===8)R(x,t+5,5,1,'#8a6450');if(N(x,6)<.1)P(x,t+3,'#c8a07c');P(x,b+1,'#b07e48')});
  // ruins: column
  const col=(x,y,hgt,broken)=>{S(x-1,y,broken?["..oo.oo.o.","oo11o22oo.","o1111222o."]:["oooooooooo","o11111222o","oooooooooo"],{o:'#5a3a34','1':'#e0b88a','2':'#b48868'});
   for(let i=3;i<hgt;i++){R(x,y+i,8,1,'#c89c74');P(x,y+i,'#5a3a34');P(x+7,y+i,'#5a3a34');R(x+1,y+i,2,1,'#e0b88a');R(x+5,y+i,2,1,'#a07a5e');if(i%6===0)R(x+1,y+i,6,1,'#a07a5e')}
   S(x-1,y+hgt,["oooooooooo","o11111222o","oooooooooo"],{o:'#5a3a34','1':'#e0b88a','2':'#b48868'})};
  col(104,14,26,1);col(124,22,18,1);col(44,24,16,1);
  // arch
  S(160,18,["......oooooooooo......","....oo1111111222oo....","...o1111oooooo2222o...","..o111oo......oo222o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..","..o11o..........o22o..",".o1111o........o2222o.","oooooooo......oooooooo"],{o:'#5a3a34','1':'#d8ae84','2':'#a87e64'});
  for(let y=24;y<38;y+=5){P(163,y,'#a87e64');P(178,y+2,'#8a6450')}
  // cacti
  const cact=(x,y)=>S(x,y,["....oo....","...oGLo...","...oGLo.oo","oo.oGLo.oLo","oLo.oGLooGLo","oGLooGLLLGLo",".oGLLGLGGGo.","..ooGLGooo..","....oGLo....","....oGLo....","....oGDo....","...ooGDoo..."].map(r=>r.padEnd(12,'.')),{o:'#24402e',G:'#4e8a50',L:'#7ab06a',D:'#3a6a42'});
  cact(70,26);cact(226,28);cact(146,32);
  const barrel=(x,y)=>S(x,y,[".oyo.","oGLGo","oGLGo",".ooo."],{o:'#24402e',G:'#4e8a50',L:'#7ab06a',y:'#e8c860'});
  barrel(90,62);barrel(196,64);barrel(30,60);
  // fallen block & pot
  S(136,62,[".oooooooo.","o1111222o","o1111222o","oooooooooo"],{o:'#5a3a34','1':'#d8ae84','2':'#a87e64'});
  S(240,60,["..oo..",".o11o.","o1122o","o1122o",".oooo."],{o:'#5a2e28','1':'#c87a54','2':'#9a5a44'});
  S(12,42,[".ooo.","o111o","oooo."],{o:'#5a3a34','1':'#c4946c'});
 }
 else if(kind==='tundra'){
  sky(['#121a32','#18223c','#1e2a48','#263454','#304062','#3c4e70'],[0,6,11,16,21,25,29]);
  for(let i=0;i<70;i++){const x=Math.floor(N(i,7)*w),y=Math.floor(N(i,8)*24);P(x,y,N(i,9)<.3?'#ffffff':'#8a9ac0')}
  // aurora curtains
  for(let x=0;x<w;x++){const yc=Math.round(6+3*Math.sin(x/19)+2*Math.sin(x/7));const L=6+Math.round(4*Math.sin(x/11)+2*Math.sin(x/5));
   P(x,yc,'#a4e6c0');for(let i=1;i<L;i++){const y=yc+i;if(i<3)P(x,y,'#68c49e');else if(i<L-2){if((x+y)%2===0)P(x,y,'#4a9a86');}else if((x*2+y)%4===0)P(x,y,'#3a7a7a')}
   const y2=Math.round(3+2*Math.sin(x/13+2));if(Math.sin(x/9)>.2){P(x,y2,'#7aa8c8');if((x+y2)%2===0)P(x,y2+1,'#4a7096')}
  }
  // glaciers
  const pk=[[8,14],[36,20],[62,12],[96,18],[132,10],[168,19],[198,13],[232,16],[256,20]];
  const gh=x=>{let m=40;for(const[p,t] of pk){const v=t+Math.abs(x-p)*0.9;if(v<m)m=v}return m};
  for(let x=0;x<w;x++){const t=Math.round(gh(x)+(N(x,30)<.2?1:0));let near=pk[0];for(const p of pk)if(Math.abs(x-p[0])<Math.abs(x-near[0]))near=p;const left=x<near[0];const cap=near[1]+4+Math.round(2*Math.sin(x*1.7));
   for(let y=t;y<38;y++){let col=left?'#b4cce2':'#7896ba';if(y<cap)col=left?'#f6faff':'#c4d6e8';else if((x*7+near[0])%5===0&&y>cap+1)col=left?'#98b6d4':'#6080a8';if(y>32)col=left?((x+y)%2?'#98b6d4':'#b4cce2'):((x+y)%2?'#6080a8':'#7896ba');P(x,y,col)}
   P(x,t,'#2e4468');if(x===near[0])R(x,t+1,1,cap-t+2,'#a8c2dc')}
  // snowfield
  R(0,36,w,h-36,'#d4e2ee');
  for(let x=0;x<w;x++){const y=Math.round(36+1.5*Math.sin(x/13));P(x,y,'#ffffff');R(x,y+1,1,1,'#e6eef6');if(x%2)P(x,35,'#d4e2ee')}
  for(let y=40;y<h;y+=3)for(let x=(y*3)%5;x<w;x+=5){const n=N(x,y);if(n<.25)R(x,y,2,1,'#b4c8dc');else if(n<.32)P(x,y,'#ffffff')}
  // ice lane
  lane(53,2,28,2,5,'#9ec2dc','#5a7ca4','#c8e0f0',(x,t,b)=>{if(N(x,10)<.18)R(x,t+3+((x*5)%5),2,1,'#d8ecf8');if(x%23===0){P(x,t+4,'#6a8cb4');P(x+1,t+5,'#6a8cb4');P(x+2,t+5,'#6a8cb4');P(x+3,t+6,'#6a8cb4')}P(x,b+1,'#b4c8dc')});
  // snowy pine
  const pine=(x,y)=>S(x,y,["....oo....","...oWWo...","..oWWGWo..","..oGWGGo..",".oWWWGWGo.",".oGWGGGDo.","oWWWGWGGDo","oGGWGGGDDo",".oooDDDoo.","oWWWGWGGDo","oGGGGGDDDo","ooooTTDooo","....TT....","....TT...."],{o:'#16283a',W:'#f0f6fa',G:'#2e5a52',D:'#1e4040',T:'#4a3428'});
  const drift=(x,y,l)=>{R(x,y,l,1,'#b4c8dc');R(x+2,y+1,l-4,1,'#c4d4e4')};[[16,38],[82,40],[108,36],[184,38],[238,42]].forEach(([x,y])=>drift(x,y,14));
  E(128,66,12,3,'#7a9cc0');E(128,66,11,2,'#a8cce4');R(120,65,8,1,'#d8ecf8');R(132,67,4,1,'#d8ecf8');for(let i=-12;i<=12;i+=2)P(128+i,63+(Math.abs(i)>9?1:0),'#ffffff');
  pine(18,24);pine(84,26);pine(110,22);pine(186,24);pine(240,28);pine(150,57);drift(148,70,14);
  // ice crystals
  const cry=(x,y)=>S(x,y,["..o.....","..oo..o.",".oWo.oLo",".oWLoLLo","oWWLoLBo","oWLBoLBo","oWLBBBBo","oooooooo"],{o:'#2e4a74',W:'#f4fbff',L:'#b4dcf0',B:'#78aad4'});
  cry(56,58);cry(206,60);cry(126,38);cry(2,60);
  // snowy rock
  const rock=(x,y)=>S(x,y,["..oooo...",".oWWWWo..","oWWWWGGo.","oGGGGGDDo","oDDDDDDDo",".ooooooo."],{o:'#2a3448',W:'#f0f6fa',G:'#7a849a',D:'#5a6478'});
  rock(36,40);rock(166,42);rock(92,63);
 }
 else if(kind==='fungal'){
  sky(['#1c1a34','#241f3c','#2e2544','#3a2c4c','#463452','#523e58'],[0,6,11,15,19,23,27]);
  for(let i=0;i<40;i++){const x=Math.floor(N(i,11)*w),y=Math.floor(N(i,12)*18);P(x,y,N(i,13)<.3?'#d8d4e8':'#6a6488')}
  E(170,7,4,4,'#e8e2c4');E(172,6,4,4,'#241f3c');
  // far giant mushroom domes
  const dome=(x,y,s,st)=>{R(x-1,y,3,30,'#2a2640');P(x-1,y,'#221e36');MK(x-s,y-s,s*2+1,s+1,(i,j)=>{const dx=(i-s)/s,dy=(j-s)/(s*.6);return dx*dx+dy*dy<=1},(i,j)=>((i*3+j*5)%7===0&&j<s-1)?st:'#342e4c','#221e36')};
  dome(30,24,10,'#3e9a8e');dome(96,20,13,'#8aa84a');dome(158,25,7,'#c08a48');dome(214,21,12,'#3e9a8e');dome(250,26,6,'#8aa84a');
  // swamp water
  R(0,28,w,10,'#1a3034');for(let x=0;x<w;x++){if(x%2)P(x,27,'#1a3034');if(N(x,14)<.14)R(x,30+((x*3)%7),3,1,'#28484a')}
  for(const [xx,cc] of [[30,'#3e9a8e'],[96,'#8aa84a'],[158,'#c08a48'],[214,'#3e9a8e']])for(let y=29;y<37;y+=2){const L=Math.max(1,4-((y-29)>>1));R(xx-(L>>1)+((y>>1)%2),y,L,1,cc)}
  const lily=(x,y)=>S(x,y,[".oooo.","oLLGGo","oGG.oo",".ooo.."],{o:'#16301e',L:'#86b466',G:'#4e8048'});
  [[10,31],[44,33],[120,30],[136,33],[188,31],[236,33]].forEach(([x,y],i)=>{lily(x,y);if(i%2===0){P(x+2,y,'#f0e2b0');P(x+1,y,'#d8b878')}});
  // mossy bank
  R(0,37,w,h-37,'#30462f');
  for(let x=0;x<w;x++){const y=Math.round(37+1.5*Math.sin(x/11));R(x,37,1,y-37,'#1a3034');P(x,y,'#152a20');P(x,y+1,'#5a7e48');P(x,y+2,'#466a3e')}
  for(let y=42;y<h;y+=3)for(let x=(y*7)%6;x<w;x+=6){const n=N(x,y);if(n<.3)R(x,y,2,1,'#263a28');else if(n<.42){P(x,y,'#466a3e');P(x+1,y-1,'#466a3e')}}
  // stepping-stone path
  lane(53,2,24,3,5,'#3c4a36','#1a2620','#4a5a40',(x,t,b)=>{P(x,b+1,'#263a28')});
  for(let x=1;x<w;x+=9){const t=laneY(53,2,24,3,x+4)-4,k=(x*7)%3;MK(x,t+k,8,6-((x*5)%2),(i,j)=>!((i===0||i===7)&&(j===0||j>=4)),(i,j)=>j===1&&i<6?'#a4ac8a':i+j>8?'#5e6a50':'#7e886a','#1e2a22')}
  // glowing mushrooms
  const shroom=(x,y,p,big)=>{const m=big?["...oooo...","..oLLCCo..",".oLwCCwCo.","oLLCCCCDDo","oCwCCDDwDo","oooooooooo","....oSo...","....oSo...","...oSSo...","...ooooo.."]:["..oooo..",".oLwCCo.","oLCCCDDo","oCwCDDwo","oooooooo","...oSo..","...oSo..","..ooooo."];
   const W2=m[0].length;for(let j=-3;j<m.length;j++)for(let i=-3;i<W2+3;i++){const d=Math.hypot(i-W2/2+.5,(j-2)*1.3);if(d<W2/2+3&&d>W2/2-1&&(i+j)%2===0)P(x+i,y+j,p[3])}
   S(x,y,m,{o:'#1a1828',L:p[1],C:p[0],D:p[2],w:'#f2f8e8',S:'#d4cab2'})};
  const T=['#4ab8a8','#9ae0cc','#2e7a7a','#2c5a58'],Lm=['#94c454','#d0ec8a','#5e8a3a','#3e5a32'],Am=['#d89a48','#f4d08a','#a0663a','#5a4430'];
  [[40,38,T,1],[54,43,Lm,0],[98,40,Am,1],[140,39,T,0],[174,38,Lm,1],[222,40,Am,0],[28,61,Am,1],[106,63,T,0],[150,61,Lm,1],[244,62,T,0],[6,42,Lm,0],[208,63,Am,0]].forEach(([x,y,p,b])=>shroom(x,y,p,b));
  // big glowing mushroom
  for(let j=0;j<14;j++)for(let i=-3;i<22;i++){const d=Math.hypot(i-9,(j-4)*1.6);if(d<14&&d>9&&(i+j)%2===0)P(114+i,10+j,'#2c5a58')}
  S(114,10,["......oooooo......","....ooLLLCCCoo....","..ooLLLLCCCCCCoo..",".oLLLwLCCCwCCCDDo.","oLLLCCCCCCCCCDDDDo","oCCwCCCCwCCCCDDwDo","oooooooooooooooooo",".......oSSo.......",".......oSSo.......",".......oSSo.......","......oSSSSo......",".......oSSo.......",".......oSSo.......",".......oSSo.......",".......oSSo.......","......oSSSSo......","......oSSSSo......",".....oooooooo....."],{o:'#1a1828',L:'#9ae0cc',C:'#4ab8a8',D:'#2e7a7a',w:'#e0f8f0',S:'#b8ae98'});
  const reed=(x,y)=>S(x,y,[".o..o",".b..b","ob.ob","ob.ob","g.g.g","g.g.g","gg.gg"],{o:'#2a1e18',b:'#7a5434',g:'#4a7a3a'});
  reed(80,31);reed(196,31);reed(166,32);reed(18,32);
  for(let i=0;i<24;i++){const x=Math.floor(N(i,17)*w),y=6+Math.floor(N(i,18)*40);P(x,y,'#eef4a0');if(i%2===0){P(x-1,y,'#5e6e42');P(x+1,y,'#5e6e42');P(x,y-1,'#5e6e42');P(x,y+1,'#5e6e42')}}
 }
 else if(kind==='clockwork'){
  sky(['#2e2838','#3c3040','#4e3a46','#644a4c','#7e5c52','#9a7058'],[0,6,11,15,19,23,28]);
  // far skyline
  for(let x=0;x<w;x++){const b=Math.floor(x/11),t=14+Math.floor(N(b,19)*12);R(x,t,1,40-t,'#3a3038');if(x%11===0)R(x,t,1,40-t,'#2e2630');
   if(x%11>1&&x%11<10&&x%3===1)for(let y=t+3;y<34;y+=4)if(N(x,y)<.35)P(x,y,'#d8a860');}
  // chimneys & smoke
  for(const x of [22,72,180,236]){const t=10+(x%7);R(x,t,3,10,'#2e2630');steam(x-1,t-12,['#b4aaa6','#968a8c','#7a6e72','#5a4e54'])}
  // big gear
  const gear=(cx,cy,r,n,cols)=>{const S2=r+3;MK(cx-S2,cy-S2,S2*2+1,S2*2+1,(i,j)=>{const x=i-S2,y=j-S2,d=Math.hypot(x,y),a=Math.atan2(y,x)+Math.PI;const tooth=((a/(2*Math.PI)*n)%1)<.45;return d<=(tooth?r+2.5:r+.5)&&d>=r*.22},(i,j)=>{const x=i-S2,y=j-S2,d=Math.hypot(x,y);if(d<r*.42)return d<r*.34?cols[2]:cols[0];if(r>5&&d>r*.6&&d<r*.72)return cols[2];if(r>5&&d>=r*.72&&d<r*.82)return x+y<0?cols[0]:cols[1];return x+y<-r*.4?cols[0]:x+y>r*.5?cols[2]:cols[1]},cols[3])};
  const brass=['#e8c878','#c49a4a','#94703a','#4a3426'],copper=['#e09a6a','#b0704a','#7e4c38','#3e2620'];
  gear(68,32,6,6,copper);gear(52,25,10,9,brass);gear(206,24,9,8,brass);
  // clock tower
  const tx=114;R(tx,6,24,36,'#7a5a48');R(tx,6,1,36,'#3a2622');R(tx+23,6,1,36,'#3a2622');R(tx+1,6,6,36,'#9a7458');R(tx+17,6,6,36,'#5e4438');
  for(let y=10;y<42;y+=4)for(let x=tx+1;x<tx+23;x+=6)R(x+((y/4)%2)*3,y,1,1,'#3a2622');
  S(tx-2,0,["....oooooooooooooooooo....","..oo222222211111111111oo..","oooooooooooooooooooooooooo"],{o:'#3a2622','1':'#b0704a','2':'#e09a6a'});
  E(tx+12,17,8,8,'#3a2622');E(tx+12,17,7,7,'#c49a4a');E(tx+12,17,6,6,'#efe2c4');E(tx+13,18,5,5,'#efe2c4');
  for(let a=0;a<12;a++)P(Math.round(tx+12+5*Math.cos(a*Math.PI/6)),Math.round(17+5*Math.sin(a*Math.PI/6)),'#6a4a3a');
  R(tx+12,12,1,6,'#3a2622');R(tx+12,17,4,1,'#3a2622');P(tx+12,17,'#c44a3a');
  S(tx+8,30,["oooooooo","o##oo##o","o##oo##o","o##oo##o"],{o:'#3a2622','#':'#e8b860'});
  // pipes
  for(let x=0;x<w;x++){R(x,37,1,4,'#b0704a');P(x,36,'#3e2620');P(x,37,'#e09a6a');P(x,40,'#7e4c38');P(x,41,'#3e2620');if(x%20===0){R(x,36,3,6,'#c49a4a');P(x,37,'#e8c878');R(x,36,1,6,'#4a3426')}}
  S(160,30,["..oooo..","..oRRo..","...oo...","..oSSo..","oooSSooo"],{o:'#3e2620',R:'#b84a3a',S:'#c49a4a'});
  // cobblestones
  R(0,42,w,h-42,'#4a4248');
  for(let y=42;y<h;y+=3){const off=(y/3)%2*3;for(let x=-3+off;x<w;x+=6){R(x+1,y,4,2,'#6a6064');P(x+1,y,'#867c7c');P(x+4,y+1,'#564c52')}}
  // street with tram rails
  lane(53,1,40,0,5,'#7a6c64','#2e2830','#9a8c80',(x,t,b)=>{if(x%7===0)R(x,t+2,1,b-t-3,'#62564f');P(x,t+3,'#c49a4a');P(x,t+4,'#7e5c34');P(x,b-3,'#c49a4a');P(x,b-2,'#7e5c34');if(x%4===0){P(x,t+3,'#5a4434');P(x,b-3,'#5a4434')}P(x,b+1,'#3a3238')});
  // lamps
  const lamp=(x,y)=>{S(x,y,["..ooo..",".oLLLo.","oLYYYLo","oYYYYYo",".oLLLo.","..ooo..","...o...","...o...","...o...","...o...","...o...","...o...","...o...","..ooo..",".ooooo."],{o:'#2a2224',L:'#94703a',Y:'#f4d68a'});P(x-1,y+3,'#a07a48');P(x+7,y+3,'#a07a48');P(x-2,y+3,'#7a5a3e')};
  lamp(84,26);lamp(172,27);lamp(14,26);lamp(244,28);
  // little gears & steam vents
  const crate=(x,y)=>S(x,y,["oooooooooo","o1222222Do","o2o2222oDo","o22o22o2Do","o222oo22Do","o22o22o2Do","o2o2222oDo","oDDDDDDDDo","oooooooooo"],{o:'#2e2020','1':'#c4945c','2':'#a07448',D:'#7a5434'});crate(146,60);crate(30,62);S(156,63,["..oooo..",".o1122o.","o112222o","o122222o","o122222o",".o2222o.","..oooo.."],{o:'#2e2020','1':'#e8c878','2':'#94703a'});
  const vent=(x,y)=>{steam(x,y-11,['#f0ece6','#d4ccc6','#aca4a4','#7a7074']);S(x,y,["oooooo","o2112o","oooooo"],{o:'#2a2224','1':'#3a2a26','2':'#94703a'})};
  vent(100,64);vent(220,66);
 }
 else if(kind==='skyisle'){
  sky(['#4e84c8','#5e92d0','#70a0d8','#84b0e0','#9cc0e6','#b4d0ec'],[0,6,12,18,24,30,40]);
  // rainbow
  const rb=['#d47a6a','#dca064','#e2cc7a','#8abc78','#6c9ad0','#8678b4'];
  for(let y=0;y<40;y++)for(let x=0;x<w;x++){const d=Math.hypot((x-128)/1.6,(y-62));const bi=Math.floor((58-d));if(bi>=0&&bi<6){const f=58-d-bi;if(bi===0&&f<.5&&(x+y)%2)continue;if(bi===5&&f>.5&&(x+y)%2)continue;P(x,y,rb[bi])}}
  // distant floating islands with waterfalls
  const isle=(x,y,s)=>{const W=s*2;for(let i=0;i<W;i++){const dd=Math.round(s*0.9*Math.sqrt(Math.max(0,1-Math.pow((i-s)/s,2))));R(x+i,y+2,1,dd,'#8a7462');if(i>s)R(x+i,y+2,1,dd,'#6e5a52');P(x+i,y+2+dd,'#4a3a3a');R(x+i,y,1,2,'#6aa850');if(i%3===0)P(x+i,y,'#8ac868');P(x+i,y-1,'#3e6a3a')}};
  isle(14,14,9);isle(196,8,12);isle(150,26,5);
  const fall=(x,y,len)=>{for(let j=0;j<len;j++){R(x,y+j,3,1,'#d8ecf8');P(x+((j>>1)%3),y+j,'#9cc8e8');if(j%3===0)P(x+1,y+j,'#ffffff')}E(x+1,y+len,3,1,'#f4f8fc')};
  fall(24,18,14);fall(210,13,20);fall(214,13,12);
  // cloud sea
  const cl={o:'#9fb4d4',W:'#f4f6fa',L:'#d4deec'};
  for(let x=-6;x<w;x+=13)cloud(x,30+((x*7)%4),(x/13)%2,cl);
  // main island
  R(0,40,w,h-40,'#5a9a48');
  for(let x=0;x<w;x++){const y=Math.round(39+Math.sin(x/10)*1.2);R(x,y,1,3,'#7ab858');P(x,y-1,'#2e5a30');if(x%3===0)P(x,y,'#9ad06a')}
  for(let y=44;y<h;y+=3)for(let x=(y*5)%6;x<w;x+=6){const n=N(x,y);if(n<.25){P(x,y,'#4a8440');P(x+1,y-1,'#4a8440')}else if(n<.33)P(x,y,'#8ac466')}
  for(let i=0;i<40;i++){const x=Math.floor(N(i,31)*w),y=44+Math.floor(N(i,32)*26);if(Math.abs(y-laneY(53,2,32,4,x))<8)continue;S(x,y,['o.o.o','.ooo.'].map(r=>r),{o:'#3e7a3a'})}
  // path
  lane(53,2,32,4,5,'#c8b08a','#6a5440','#e0cca4',(x,t,b)=>{if(N(x,20)<.14)R(x,t+3+((x*3)%5),2,1,'#ac9472');if(x%12===0)R(x,t+2,1,3,'#ac9472');P(x,b+1,'#3e7a3a')});
  // round trees
  const tree=(x,y)=>S(x,y,["...oooooo...","..oLLLGGGo..",".oLHLLGGGDo.","oLHLLGGGGDDo","oLLLGGGGDDDo","oGGGGGGDDDDo",".oGGGDDDDDo.","..oooTToooo.","....oTTo....","....oTTo....","...ooTToo..."],{o:'#1e3e2a',H:'#a4d478',L:'#76b05a',G:'#4e8a44',D:'#36683a',T:'#6a4a34'});
  tree(70,28);tree(176,30);tree(240,30);tree(4,32);
  // shrine pillars
  S(120,24,["oooooooooooo","o2222111111o","oooooooooooo",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.",".o21o..o21o.","oooooooooooo"],{o:'#3a3a52','1':'#c8c8d8','2':'#f0f0f8'});
  E(126,30,1,1,'#f4d878');
  // flowers
  for(let i=0;i<30;i++){const x=Math.floor(N(i,21)*w),y=42+Math.floor(N(i,22)*28);const ly=laneY(53,2,32,4,x);if(Math.abs(y-ly)<8)continue;const f=['#f0e8d8','#e8c860','#a8b8e8'][i%3];P(x,y,f);P(x,y+1,'#2e5a30')}
  // floating rocks
  S(100,14,[".oooo.","oG11Go","o1122o",".o22o.","..oo.."],{o:'#3e3640',G:'#7ab858','1':'#9a8474','2':'#6e5a52'});
  S(164,6,[".ooo.","oG1Go","o112o",".oo.."],{o:'#3e3640',G:'#7ab858','1':'#9a8474','2':'#6e5a52'});
 }
 else { // cosmos
  sky(['#0c0c20','#10122a','#141834','#1a1e40','#20264a'],[0,7,14,21,28,38]);
  // nebula clouds from soft blobs, quantised and dithered
  const blobs=[[30,10,40,9,0],[110,22,36,7,1],[150,8,30,6,0],[232,18,34,9,1],[70,30,30,5,0]];
  for(let y=0;y<37;y++)for(let x=0;x<w;x++){let v=[0,0];for(const[bx,by,rx,ry,k] of blobs){const d=((x-bx)/rx)**2+((y-by)/ry)**2;v[k]+=Math.exp(-d*1.6)}
   for(let k=0;k<2;k++){const f=v[k]*(1+.35*Math.sin(x/5+y/3+k*2)+.25*Math.sin(x/9-y/2));const ramp=k?['#20304e','#284a66','#3a6a80','#5a92a0']:['#22224c','#2e2c62','#423a7a','#5e5096'];
    if(f>1.05)P(x,y,ramp[3]);else if(f>.8)P(x,y,(x+y)%2?ramp[3]:ramp[2]);else if(f>.6)P(x,y,ramp[2]);else if(f>.42)P(x,y,(x+y)%2?ramp[2]:ramp[1]);else if(f>.28)P(x,y,ramp[1]);else if(f>.18&&(x+y)%2===0)P(x,y,ramp[0])}}
  for(let i=0;i<90;i++){const x=Math.floor(N(i,23)*w),y=Math.floor(N(i,24)*36),n=N(i,25);P(x,y,n<.2?'#ffffff':n<.6?'#b8c4e8':'#7a84b8');if(n<.06){P(x-1,y,'#8a94c8');P(x+1,y,'#8a94c8');P(x,y-1,'#8a94c8');P(x,y+1,'#8a94c8')}}
  // ringed planet
  const pcx=196,pcy=13;const ring=(front)=>{for(let a=0;a<360;a+=2){const t=a*Math.PI/180,sy=Math.sin(t);if((sy>0)!==front)continue;const x=Math.round(pcx+15*Math.cos(t)),y=Math.round(pcy+3.2*sy-Math.cos(t)*1.5);P(x,y,'#d4c494');P(x,y+1,'#8a7c5e')}};
  ring(false);MK(pcx-8,pcy-8,17,17,(i,j)=>Math.hypot(i-8,j-8)<=7.6,(i,j)=>{const t=(i-8)+(j-8);return t<-7?'#b4c4e8':t<-1?'#8a9ad0':t<5?'#6a7ab8':(i+j)%2?'#4a568e':'#6a7ab8'},'#24244c');
  for(let x=pcx-6;x<=pcx+6;x+=1)if((x+1)%3)P(x,pcy+3,'#5a68a6');ring(true);
  E(56,9,5,5,'#d0d4e4');E(58,8,5,5,'#10122a');P(52,10,'#a8acc4');
  E(132,4,2,2,'#8a8ea8');P(131,3,'#c4c8d8');
  // far crystal spires
  const spire=(x,base,hgt,wd,cols)=>{for(let j=0;j<hgt;j++){const hw=Math.max(0,Math.round(wd*(j/hgt)));for(let i=-hw;i<=hw;i++){let col=i<0?cols[0]:cols[1];if(i===-hw||i===hw)col=cols[2];P(x+i,base-hgt+j,col)}}P(x,base-hgt,cols[2])};
  const far=['#343c78','#262a58','#16183a'];
  [[14,38,18,3],[40,38,12,2],[72,38,22,4],[150,38,16,3],[176,38,24,4],[232,38,20,3],[250,38,10,2],[118,38,9,2]].forEach(([x,b,hh,wd])=>spire(x,b,hh,wd,far));
  // starry glass floor
  R(0,38,w,h-38,'#22224a');R(0,38,w,1,'#7a8ad0');R(0,39,w,1,'#46509a');for(let x=0;x<w;x+=2){P(x,40,'#46509a');P(x+1,37,'#22224a')}
  for(let y=44;y<h;y+=8)for(let x=0;x<w;x++)if(x%3!==2)P(x,y+(y>60?0:0),'#2a2c5a');
  for(let y=42;y<h;y+=2)for(let x=(y*3)%5;x<w;x+=5){const n=N(x,y);if(n<.1)P(x,y,'#8a9ad8');else if(n<.13)P(x,y,'#ffffff');else if(n<.3)P(x,y,'#1a1a3c')}
  // glowing lane
  lane(53,2,30,5,5,'#323c74','#9cc4ec','#5a6cb0',(x,t,b)=>{if(x%10===0)R(x,t+2,1,b-t-3,'#262e60');if(x%10===5){P(x,t+5,'#9cc4ec');P(x-1,t+5,'#5a6cb0');P(x+1,t+5,'#5a6cb0')}P(x,b-1,'#262e60');P(x,b+1,'#46509a')});
  const cr=(x,y,fl)=>S(x,y,["....o.....","...oWo....","...oWLo...","..oWLLo...","..oWLBo.o.","..oWLBo.oo","..oWLBooLo",".oWLLBooLBo",".oWLBBDoLBo","oWLLBBDoLBo","oWLBBDDoBBo","oooooooooooo"].map(r=>r.padEnd(12,'.')),{o:'#1e2250',W:'#e4f4fc',L:'#94d0e8',B:'#5a96c8',D:'#3a6a9e'},fl);
  cr(96,27,0);cr(206,27,1);cr(2,30,0);cr(150,60,1);cr(40,59,0);cr(236,60,0);
  for(const [x,y] of [[120,20],[164,30],[84,14]]){P(x,y,'#e4f4fc');P(x-1,y,'#5a96c8');P(x+1,y,'#5a96c8');P(x,y-1,'#5a96c8');P(x,y+1,'#5a96c8')}
 }
 return c}

/* ---- text for worlds 4-10 ---- */
const WT={
 c_top:'the and you that was for are with his they have this from one had word but not what all were when your can said there use each which she how their will other about out many then them these some her would make like him into time has look two more write see number way could people than first water been call who oil its now find long down day did get come made may part'.split(' '),
 c_pairs:['big wave','sea shell','sand castle','blue fish','warm sun','tide pool','red crab','soft sand','sea turtle','palm tree','salty air','beach ball','sun hat','surf board','star fish','fast boat','cool breeze','low tide','high tide','reef fish'],
 c_caps:['Crabs walk sideways.', 'Turtles lay eggs on beaches.', 'Whales breathe air.', 'Sharks have no bones.', 'Seals can hold their breath.', 'Octopuses have eight arms.', 'Sea stars have no brain.', 'Dolphins live in pods.', 'Coral is alive.', 'Pelicans scoop up fish.', 'Most of Earth is ocean.', 'Seahorses swim upright.', 'Jellyfish have no heart.', 'Clams live in shells.', 'Puffins dive for fish.'],
 c_sea:'ocean coral seaweed lagoon harbor lighthouse anchor seagull pelican dolphin octopus jellyfish seahorse starfish sandbar driftwood shoreline current treasure snorkel island voyage compass horizon'.split(' '),
 c_tide:['The tide comes in twice a day. The moon pulls on the sea.', 'Hermit crabs borrow shells. They move when they grow.', 'Sea turtles swim far. They come back to lay eggs.', 'Gulls eat fish and crabs. They nest by the shore.', 'Seaweed is a kind of algae. Many fish hide in it.', 'Dolphins click and whistle. That is how they talk.', 'Sand is made of tiny rocks. Waves grind them down.', 'A starfish can grow a new arm. It eats clams and snails.', 'Whales sing songs. Their songs travel far underwater.', 'Crabs have hard shells. They grow new ones as they grow.', 'Otters float on their backs. They crack shells on rocks.', 'Puffins can fly and swim. They catch fish in their beaks.'],
 c_reef:['Coral reefs are home to many kinds of fish.','Sea turtles can swim for thousands of miles.','A starfish can grow back a lost arm.','The ocean covers most of our planet.','Puffins dive deep to catch little fish.','Crabs carry their skeletons on the outside.','Pufferfish puff up when they feel scared.','Seahorse dads carry the eggs until they hatch.'],
 d_comma:["Red, orange, and yellow are warm colors.", "Lions, tigers, and leopards are big cats.", "Mercury, Venus, Earth, and Mars are rocky planets.", "Bees make honey, wax, and royal jelly.", "First, a caterpillar hatches from an egg.", "Frogs, toads, and newts are amphibians.", "Yes, whales breathe air just like us.", "Rain, snow, sleet, and hail all fall from clouds.", "Corn, rice, and wheat feed most of the world.", "Your heart, lungs, and brain never stop working.", "After a storm, you might see a rainbow.", "Owls, bats, and moths are busy at night.", "Plants need sunlight, water, and air to grow.", "In winter, some bears sleep for months.", "Ants, bees, and termites live in colonies.", "Salmon, trout, and tuna are kinds of fish.", "Today, there are eight planets in our solar system.", "Ice, water, and steam are all the same stuff."],
 d_ask:["Did you know bats can fly?", "How many legs does a spider have?", "Wow, a cheetah is fast!", "Can a penguin fly? No, but it can swim!", "What is the biggest planet?", "Look, a shooting star!", "Why is the sky blue?", "Is a tomato a fruit? Yes, it is!", "Which animal has the longest neck?", "Watch out, that cactus is spiky!", "How old are the oldest trees?", "What a huge blue whale!", "Do fish sleep? Yes, they rest!", "Where do penguins live?", "Why do leaves change color?", "How hot is the sun?", "Can an octopus change color? Yes!", "Who was the first person on the Moon?"],
 d_apos:["It's true that bees can dance.", "A bird's bones are light and hollow.", "Don't forget that the Earth spins.", "The cheetah's spots help it hide.", "We're made of about sixty percent water.", "A cat's whiskers help it feel its way.", "Owls can't move their eyes.", "The sun's light reaches us in minutes.", "Penguins aren't able to fly.", "A giraffe's tongue is dark purple.", "It's cold on top of tall mountains.", "A frog's skin must stay wet.", "They're called joeys, not babies.", "Saturn's rings are made of ice and rock.", "You'll see more stars far from city lights.", "An elephant's trunk has no bones.", "Snakes don't have eyelids.", "The Moon's craters are very old."],
 d_talk:["\"Bats can fly,\" said Mia.", "\"Is the sun a star?\" asked Leo. \"Yes!\" said Ava.", "\"Look at those bees,\" whispered Sam.", "\"Whales breathe air,\" explained the guide.", "\"How tall is a giraffe?\" asked Nia. \"Taller than a bus,\" said Dad.", "\"Octopuses have three hearts!\" shouted Kai.", "\"Frogs drink through their skin,\" said Zoe.", "\"Wow,\" said Omar, \"that comet has a tail!\"", "\"Penguins live in the south,\" said Ms. Lee.", "\"Which planet is red?\" asked Max. \"Mars,\" said Lily.", "\"Plants make oxygen,\" said Grandma.", "\"Sharks have no bones,\" said Ben."],
 d_colon:["Insects have three body parts: head, thorax, abdomen.", "Plants need three things: light, water, air.", "Rule one: cover your mouth when you cough.", "The sun is a star; it is very hot.", "Bats sleep in the day; they hunt at night.", "Primary colors: red, blue, and yellow.", "Fun fact: snails can sleep for years.", "Frogs lay eggs; the eggs become tadpoles.", "Three states of water: ice, liquid, steam.", "Remember this: the Moon has no air.", "Owls are quiet; their feathers are soft.", "Big cats: lions, tigers, jaguars, leopards.", "The sea is salty; lakes are usually fresh.", "Gas giants: Jupiter, Saturn, Uranus, Neptune."],
 d_dash:["The cheetah - the fastest land animal - can sprint very fast.", "Jupiter (the biggest planet) has many moons.", "Penguins - unlike most birds - cannot fly.", "The heart (a strong muscle) pumps blood.", "Venus - not Mercury - is the hottest planet.", "Koalas (from Australia) eat eucalyptus leaves.", "A baby kangaroo - a joey - lives in a pouch.", "Mars (the red planet) has giant volcanoes.", "Spiders - not insects - have eight legs.", "The blue whale (the biggest animal) eats tiny krill.", "Bamboo - a kind of grass - grows very fast.", "Ice (frozen water) floats on top of water."],
 f_row:['12 34 56 78 90','10 20 30 40 50','13 57 92 46 80','21 43 65 87 09','111 222 333 444','555 666 777 888 999','19 28 37 46 55','64 73 82 91 100'],
 f_count:["A spider has 8 legs.", "An insect has 6 legs.", "An octopus has 3 hearts.", "A starfish often has 5 arms.", "There are 7 days in a week.", "There are 12 months in a year.", "A year has 365 days.", "There are 8 planets around the sun.", "There are 7 continents on Earth.", "A day has 24 hours.", "An adult has 32 teeth.", "A cat has 18 toes.", "Snowflakes have 6 sides.", "A crab has 10 legs.", "An hour has 60 minutes.", "Most kids have 20 baby teeth."],
 f_money:["A penny is worth $0.01.", "A nickel is worth $0.05.", "A dime is worth $0.10.", "A quarter is worth $0.25.", "Four quarters make $1.00.", "Ten dimes also make $1.00.", "Two quarters are worth $0.50.", "Twenty nickels make $1.00.", "If seeds cost $2 and a pot is $3, both cost $5.", "Saving $1 a week gives you $52 in a year.", "Half of $10 is $5.", "Three $5 bills make $15."],
 f_time:["Noon is 12:00 in the middle of the day.", "Midnight is 12:00 at night.", "People first walked on the Moon on July 20, 1969.", "The first day of the year is January 1.", "There are 60 seconds in 1 minute.", "Half past three is 3:30.", "A quarter past seven is 7:15.", "Earth Day is on April 22.", "Winter in the north starts around December 21.", "The shortest month is February, with 28 days.", "Leap years add February 29.", "The Wright brothers flew on December 17, 1903."],
 f_math:['2 + 2 = 4','5 + 3 = 8','10 - 4 = 6','3 x 3 = 9','12 - 7 = 5','6 + 7 = 13','4 x 5 = 20','20 / 4 = 5','9 + 9 = 18','100 - 1 = 99'],
 f_big:["The Moon is about 384,400 km away.", "The sun is about 150,000,000 km from Earth.", "Mount Everest is about 8,849 meters tall.", "Light travels about 300,000 km every second.", "The Nile River is about 6,650 km long.", "A blue whale can weigh over 100,000 kg.", "The Great Wall of China is over 20,000 km long.", "Earth is about 12,742 km across.", "There are about 10,000 kinds of birds.", "The Pacific Ocean covers about 165,000,000 square km.", "A cheetah's top speed is about 100 km an hour.", "The deepest ocean spot is about 10,900 meters down."],
 g_at:['@pop','#1 fan','@glowcap','#keylori','@mia_99','#swamp','#2 place','@frog','#fireflies','@team'],
 g_star:['salt & pepper','5 + 5','A = 1','4 * 2','Pop & Leo','x + y = z','3 * 3 = 9','fish & chips','10 = ten','2 + 2 = 4'],
 g_brack:['(hello)','[glow]','(frog)','[1] [2] [3]','(yes or no)','[map]','(see page 4)','[open]','(look up!)','[the end]'],
 g_slash:['yes/no','up/down','and/or','glow_cap','swamp-frog','day/night','my_file','tip-top','left/right','lily_pad'],
 g_mail:['meet @ noon','2 pens @ $1 each','see you @ the park','lunch @ 12:30','game night @ 7','3 apples @ 50 cents','class @ 9:00','pick up @ 3:15'],
 g_web:['3.5 km','a.m. and p.m.','half/half','1.25 kg','yes/no/maybe','9.99 points','up/down/left','4.0 stars'],
 e_double:'apple balloon coffee letter rabbit summer hammer kitten mirror puppy happen ladder bubble giggle carrot butter pillow little middle tunnel'.split(' '),
 e_silent:'knight knee know write wrong lamb thumb climb island listen castle whistle ghost honest hour gnome sign answer doubt calm'.split(' '),
 e_tion:'nation station motion action lotion fraction mention question vacation invention television decision vision explosion collision division confusion attention position solution'.split(' '),
 e_homo:['their there','to too two','your you\'re','its it\'s','hear here','knew new','right write','sea see','by buy','one won','four for','son sun'],
 e_fix:'unhappy redo preview untie misread careful helpful kindness fearless quickly brightness replay unlock spotless sadness rewind joyful hopeless darkness'.split(' '),
 e_giant:'extraordinary imagination temperature environment refrigerator encyclopedia unbelievable communication independence electricity architecture mathematics transportation responsibility kaleidoscope'.split(' '),
 s_fable:['The slow turtle kept going and won the race.','A tiny mouse helped a big lion get free.','The ant worked hard all summer and had food in winter.','The boy who cried wolf learned that lying is not smart.','The crow dropped pebbles into the jar until it could drink.','The wind and the sun both tried to win, but kindness won.'],
 s_fact:['Clouds are made of tiny drops of water.','Lightning is hotter than the surface of the sun.','A rainbow has seven colors.','Some birds can sleep while they fly.','Wind is air that is moving from place to place.','Hot air rises, so hot air balloons float up.','Snowflakes always have six sides.'],
 s_poem:['Up in the sky, the islands float by.','Clouds so white, kites in flight.','The wind will blow, and off we go.','Rain on the hill, the air is still.','Puffleece leaps over cotton heaps.','A whale of cloud, singing loud.'],
 s_letter:["Dear Sam, did you know bees can dance? Love, Ava.", "Dear Grandma, I learned that owls can turn their heads very far!", "Hi Leo, my class saw Saturn's rings in a telescope today.", "Dear Ms. Lee, I read that octopuses have three hearts. Wow!", "To Kai: a group of lions is called a pride. From Zoe.", "Dear Dad, did you know a snail can sleep for years? Love, Mia.", "Hi Nia, I found out that frogs drink water through their skin.", "Dear Uncle Ray, the sun is a star. It is very far away!"],
 s_twist:['She sells sea shells by the sea shore.','Red lorry, yellow lorry.','Six sticky skeletons.','Fresh fried fish, fish fresh fried.','Kitelet kites quickly in quiet clouds.','Grifkin grabs great green grapes.','Whalet waves while whistling.'],
 s_saga:["Long ago, dinosaurs ruled the Earth for millions of years. Then a giant space rock hit, and their time came to an end.", "The first people to walk on the Moon landed in 1969. They left footprints that are still there today.", "Thousands of years ago, the Egyptians built huge pyramids. They moved giant stone blocks without modern machines.", "Long ago, sailors used the stars to find their way. The North Star helped them know which way was north.", "Vikings sailed across stormy seas in long wooden ships. Some of them reached North America about a thousand years ago.", "Ancient Romans built long roads and bridges. Some of their roads are still used today."],
 l_sprint:['the quick brown fox jumps over the lazy dog','how quickly daft jumping zebras vex','how vexingly quick daft zebras jump','the big wizard quickly jumps over foxes near the pond','the five boxing wizards jump quickly','quick brown foxes jump over the lazy green wizard'],
 l_perfect:["Every key counts.", "Bees make honey.", "Water boils when it gets hot.", "The Earth goes around the sun.", "Plants grow toward the light.", "Sharks have no bones.", "Owls can see in the dark.", "A rainbow has many colors."],
 l_mix:["About 71% of Earth is covered by water!", "A spider has 8 legs; an ant has 6.", "The Moon is about 384,400 km away (that's far!).", "Mercury is planet #1 from the sun.", "Water freezes at 0 C and boils at 100 C.", "An octopus has 3 hearts & 8 arms!", "Light takes about 8 minutes to reach Earth.", "Fact #7: koalas sleep up to 20 hours a day.", "Earth has 7 continents & 5 oceans.", "Score: 10/10 for knowing that bats are mammals!"],
 l_code:['let x = 5;','if (stars > 10) { win(); }','print("Hello, world!")','total = a + b * 2','for i in range(10):','name = "Novadrake"','score += 100;','const pet = { name: "Orbiling" };'],
 l_epic:["At night, the sky is full of stars. Each one is a giant ball of burning gas, and many are bigger than our sun. Some are so far away that their light left them before you were born.", "Deep in the ocean, it is dark and cold. Strange fish make their own light to find food. Giant squid and tiny glowing jellyfish live where sunlight never reaches.", "The Amazon rainforest is huge and full of life. It is home to jaguars, sloths, parrots, and millions of insects. Its trees make a lot of the oxygen in our air.", "Volcanoes can build whole islands. Hot lava pours out, cools into rock, and piles higher and higher. Over thousands of years, a new island rises from the sea."],
 l_final:['You have mastered every key on the keyboard.','Your fingers know the way, even with your eyes closed.','Speed, symbols, numbers, stories: nothing can scramble you now.','Welcome, Keyboard Legend, to the top of Keyloria Kingdom!']};
const NEWLESSONS=[
 [['c_top','Top Words'],['c_pairs','Word Pairs'],['c_caps','Capital Start'],['c_sea','Sea Words'],['c_tide','Tide Sentences'],['c_reef','Reef Race']],
 [['d_comma','Commas'],['d_ask','Ask and Shout'],['d_apos','Apostrophes'],['d_talk','Talking Quotes'],['d_colon','Colons'],['d_dash','Dashes and Brackets']],
 [['f_row','Number Row'],['f_count','Counting'],['f_money','Prices'],['f_time','Times and Dates'],['f_math','Math Facts'],['f_big','Big Numbers']],
 [['g_at','@ and #'],['g_star','& * + ='],['g_brack','Brackets'],['g_slash','Slashes and Lines'],['g_mail','At Signs'],['g_web','Dots and Slashes']],
 [['e_double','Double Letters'],['e_silent','Silent Letters'],['e_tion','-tion and -sion'],['e_homo','Sound-alikes'],['e_fix','Prefix and Suffix'],['e_giant','Giant Words']],
 [['s_fable','Fables'],['s_fact','Fun Facts'],['s_poem','Rhymes'],['s_letter','Letters'],['s_twist','Tongue Twisters'],['s_saga','Sky Saga']],
 [['l_sprint','Star Sprint'],['l_perfect','Perfect Run'],['l_mix','Everything Mix'],['l_code','Code Lines'],['l_epic','Epic Tale'],['l_final','Legend Trial']]];
const NEWREG=[['#5a9ab0','Fast typing with common words.'],['#c8a060','Commas, quotes and more.'],['#8ab8d0','Numbers, prices and times.'],['#5aa88a','Symbols, emails and web links.'],['#b08a50','Tricky spelling and giant words.'],['#8aa0d8','Stories, facts and rhymes.'],['#7a6ab0','Everything. Become a Legend!']];
/* ================= V19: worlds 4-10, sprite binder, pet play ================= */
const WSTART=[0,20,25],WREG=[0,5,6],VIL={};
(()=>{NEWW.forEach((W,k)=>{const r=REGIONS.length;WSTART.push(LESSONS.length);WREG.push(r);
  REGIONS.push({name:W.name,color:NEWREG[k][0],desc:NEWREG[k][1]});WORLDS.push({name:W.name,from:r});
  W.sp.forEach((s,j)=>{KKDATA.order.push(s.key);KKDATA.spr[s.key]=s.rows;KKDATA.pal[s.key]=s.pal;
   if(!TYPES[s.type])TYPES[s.type]=s.typeColor;SPECIES.push({n:s.names,t:s.type,fl:s.flavor});EVO.push(s.evo);
   const [sp,t]=NEWLESSONS[k][j];LESSONS.push({k:'',sp,r,t})});
  VIL[W.w]=W.vil;W.vil.forEach(v=>{SCR2.spr[v.key]=v.rows;SCR2.pal[v.key]=v.pal;SCR2.names[v.key]=v.name})});
 TOTAL=LESSONS.length*3})();
function worldHead(r){const wi=WREG.indexOf(r),first=WSTART[wi]*8,open=unlocked(first);
 return `<div class="worldhead w${wi+1} ${open?'':'shut'}"><span>World ${wi+1}</span><h3>${WORLDS[wi].name}</h3>${open?'':`<p>${ICON.lock} Finish World ${wi} to open!</p>`}</div>`}
/* text */
const _gt19=genText;genText=function(i,s,pr){const L=LESSONS[i];if(!L||!WT[L.sp]||pr)return _gt19(i,s,pr);
 const list=WT[L.sp],len=Math.round((16+s*5+(i-30)*.9)*S.set.len*.85*(isBoss(i,s)?1.25:1)),n=Math.max(3,Math.ceil(list.length*Math.min(1,.45+s*.09)));
 const sub=list.slice(0,n),isWords=sub.every(x=>!/\s/.test(x));
 if(['s_saga','l_epic','l_final'].includes(L.sp)){let out=[],k=s%sub.length;while(out.join(' ').length<len){out.push(sub[k%sub.length]);k++}return out.join(' ')}
 return isWords?fillWords(sub,len):fillSent(sub,len)};
/* villains per world */
const worldPool=w=>w>=4&&VIL[w]?VIL[w].map(v=>v.key):BADKEYS;
function vilCanvas(k,king){const rows=SCR2.spr[k],w=rows[0].length,c=PXG(rows,SCR2.pal[k]);if(king){const g=c.getContext('2d'),cr=KKDATA.acc.crown;blit(g,cr.rows,cr.pal,Math.round(w/2-6),0)}return c}
function vilSVG(k,king,scale){const w=SCR2.spr[k][0].length,sz=200*scale*w/24;return `<svg class="gl" viewBox="0 0 200 200" aria-hidden="true" style="overflow:visible"><image href="${kku('v19'+k+king,()=>vilCanvas(k,king))}" x="${(200-sz)/2}" y="${200-sz}" width="${sz}" height="${sz}"/></svg>`}
const wScale=w=>w<=3?[1,1.15,1.3][w-1]:([.8,.8,.75,.75,.72,.72,.7][w-4]||.7);
villainName=(i,boss)=>{P.vkey=rand(worldPool(worldOf(i)));const n=SCR2.names[P.vkey];return boss?(i===LESSONS.length-1?'Scrambler King':'Mega '+n):n};
villainSVG=(i,boss)=>{const w=worldOf(i);return vilSVG(P.vkey||rand(worldPool(w)),boss,wScale(w)*(boss?(w>=4?1.05:1.2):1))};
villainArc=(v,king)=>{const w=worldOf(arcadeLesson());return vilSVG(rand(worldPool(w)),king,(w<=3?1:.75)*(king?1.2:1))};
/* scenes */
function sceneSVG(c){const idx=REGIONS.findIndex(r=>r.color===c);let u;
 if(idx>=7){const k=['coast','desert','tundra','fungal','clockwork','skyisle','cosmos'][idx-7];u=kku('w2'+k,()=>worldField2(k))}
 else if(idx===5||idx===6){const k=idx===5?'forest':'mountain';u=kku('wf'+k,()=>worldField(k))}
 else{const kind=['meadow','cave','volcano','sky','star'][idx]||'meadow';u=kku('f'+kind,()=>KK.field(kind))}
 return `<svg class="scene" viewBox="0 0 256 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${u}" width="256" height="72"/></svg>`}
/* ---- card binder: sprite view ---- */
const _rb19=renderBinder;renderBinder=function(){_rb19();const sv=true;
 if(!sv)return;let g='';SPECIES.forEach((sp,i)=>[0,1,2].forEach(f=>{const cd=S.cards[sk(i,f)];
  g+=cd?`<button class="sprtile ${cd.holo?'holo':''} ${cd.tier||''}" data-act="card" data-k="${i}-${f}" aria-label="${sp.n[f]}"><b class="s-no">${String(i*3+f+1).padStart(3,'0')}</b>${cd.tier||cd.holo?`<span class="s-rar ${cd.holo?'holo':cd.tier} ${cd.holo&&cd.tier?'both':''}">${cd.tier==='diamond'?'Diamond':cd.tier==='gold'?'Gold':''}${cd.holo?(cd.tier?' + Holo':'Holo'):''}</span>`:''}${creatureSVG(i,f,'fit big',cd.tier)}<small>${sp.n[f]}</small><span class="s-st">${'★'.repeat(f+1)}${'☆'.repeat(2-f)}</span></button>`:`<div class="sprtile locked"><b class="s-no">${String(i*3+f+1).padStart(3,'0')}</b>${creatureSVG(i,f,'fit big sil')}<small>???</small></div>`}));
 const b=$('#s-binder .binder');if(b){b.className='binder sprgrid';b.innerHTML=g}
 const m=$('#s-binder p.muted');if(m)m.textContent='Tap a Keylori to see its card!'};
ACT.bview=d=>{S.set.bview=d.v;save();renderBinder()};
const _card19=ACT.card;ACT.card=d=>{_card19(d);const [i,f]=d.k.split('-').map(Number),bc=$('#mbox .bigcard');if(!bc)return;
 if(false){bc.innerHTML=`<div class="bigsprite">${creatureSVG(i,f,'fit big',(S.cards[d.k]||{}).tier)}</div><h3 class="bsname">${SPECIES[i].n[f]}</h3>`}
 const cl=$('#mbox [data-act=close]');
 cl&&cl.insertAdjacentHTML('beforebegin',`<div class="rbtns"><button class="btn volt" data-act="petPlay" data-k="${d.k}">Play with ${SPECIES[i].n[f]}</button></div>`);
 $('#mbox .rb.dia')&&($('#mbox .rbadges').nextElementSibling.textContent=$('#mbox .rbadges').nextElementSibling.textContent.replace('1 in 40','1 in 80'));
 const pp=$('#mbox .rbadges')?.nextElementSibling;if(pp)pp.textContent=pp.textContent.replace('1 in 40','1 in 80').replace('1 in 8','1 in 20');fitModal()};
/* ---- pet play: type the lesson's keys to make your Keylori do tricks ---- */
let PET=null;const TRICKS=['hop','spin','wiggle','flip'];
ACT.petPlay=d=>{const [i,f]=d.k.split('-').map(Number);let words=genText(i,1,false).split(' ').filter(Boolean);
 if(words.length<6)words=words.concat(genText(i,2,false).split(' ').filter(Boolean));PET={i,f,words:words.slice(0,8),w:0,c:0,miss:0};petDraw(true)};
function petDraw(first){const p=PET;if(!p)return;const w=p.words[p.w]||'',name=SPECIES[p.i].n[p.f];
 const html=`<h2>Play with ${name}</h2><div class="petstage"><div class="petspr" id="petspr">${creatureSVG(p.i,p.f,'fit big',(S.cards[p.i+'-'+p.f]||{}).tier)}</div><div class="petcheer" id="petcheer"></div></div>
  <p class="muted petsay" id="petsay">${first?`Type all the words to earn 10 XP and 1 diamond!`:''}</p>
  <div class="petword">${[...w].map((ch,k)=>`<span class="${k<p.c?'ok':k===p.c?'cur':''}" style="--fc:${fcol(keyInfo(ch).f)}">${ch===' '?'·':esc(ch)}</span>`).join('')}</div>
  <div class="petprog">${p.words.map((_,k)=>`<i class="${k<p.w?'on':''}"></i>`).join('')}</div>
  <div class="rbtns"><button class="btn alt" data-act="petStop">Done</button></div>`;
 if(first)modal(html);else{$('#mbox').innerHTML=html;fitModal()}
 const ch=w[p.c];if(ch){setTarget(ch);const fh=$('#petsay');if(fh&&!first)fh.innerHTML=fingerHTML(ch)}}
ACT.petStop=()=>{PET=null;setTarget(null);closeModal()};
function petKey(ch){const p=PET,w=p.words[p.w],t=w[p.c];
 if(ch===t){p.c++;sfx.ok(p.c);
  if(p.c>=w.length){p.w++;p.c=0;const tr=rand(TRICKS);petDraw();const s=$('#petspr');if(s){s.classList.add(tr)}const cheer=$('#petcheer');if(cheer){cheer.innerHTML='<span>★</span>';}
   sfx.win&&tone(660+p.w*40,.12,'square',.05);
   if(p.w>=p.words.length)return petDone();}else petDraw()}
 else{p.miss++;sfx.bad();const s=$('#petspr');if(s){s.classList.remove('tilt');void s.offsetWidth;s.classList.add('tilt')}const say=$('#petsay');if(say)say.innerHTML=`Oops! Look for <b class="pk" style="--fc:${fcol(keyInfo(t).f)}">${t===' '?'space':esc(t)}</b>`}}
function petDone(){const p=PET;PET=null;setTarget(null);S.xp+=10;S.gems+=1;save();sfx.win();const name=SPECIES[p.i].n[p.f];
 modal(`<h2>${name} had so much fun!</h2><div class="petstage"><div class="petspr flip">${creatureSVG(p.i,p.f,'fit big',(S.cards[p.i+'-'+p.f]||{}).tier)}</div></div><h3>Your rewards</h3><div class="rstats"><div><b>+10</b><span>XP</span></div><div><b>+1</b><span>Diamond</span></div></div>
  <div class="rbtns"><button class="btn" data-act="petPlay" data-k="${p.i}-${p.f}">Play again</button><button class="btn alt" data-act="go" data-to="binder">Binder</button></div>`)}
addEventListener('keydown',e=>{if(!PET||$('#modal').hidden)return;if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.key==='Escape'){ACT.petStop();e.preventDefault();e.stopImmediatePropagation();return}
 if(e.key.length!==1)return;e.preventDefault();e.stopImmediatePropagation();petKey(e.key)},true);

/* ================= V20: research-based practice ================= */
DEF.set.hide='smart';
const todayKey=()=>new Date().toDateString();
const GOAL_MIN=10;
/* --- 1. daily goal + streak (time comes from S.time) --- */
function dailyTick(){S.daily=S.daily||{day:'',secs:0,streak:0,met:'',lastT:S.time||0};const d=S.daily,t=S.time||0;
 if(d.day!==todayKey()){d.day=todayKey();d.secs=0}
 const add=Math.max(0,t-(d.lastT||0));d.lastT=t;d.secs+=add;
 if(d.secs>=GOAL_MIN*60&&d.met!==todayKey()){const y=new Date(Date.now()-864e5).toDateString();d.streak=d.met===y?d.streak+1:1;d.met=todayKey();S.gems+=5;setTimeout(()=>toast(`Daily goal done! +5 diamonds · ${d.streak} day streak`),900)}}
const _save20=save;save=function(){try{dailyTick()}catch(e){}_save20()};
['startMeteor','startGlitch'].forEach(n=>{const f=window[n];window[n]=function(){f();G.t0=performance.now()}});
startMeteor=window.startMeteor;startGlitch=window.startGlitch;
const _em20=endMeteor;endMeteor=function(){if(G.t0)S.time+=Math.round((performance.now()-G.t0)/1000);G.runStart=G.t0;G.t0=0;_em20()};
const _eg20=endGlitch;endGlitch=function(w){if(G.t0)S.time+=Math.round((performance.now()-G.t0)/1000);G.runStart=G.t0;G.t0=0;_eg20(w)};
function dailyHTML(){const d=S.daily||{},mins=d.day===todayKey()?Math.floor((d.secs||0)/60):0,pc=Math.min(100,Math.round(mins/GOAL_MIN*100)),st=d.met===todayKey()||d.met===new Date(Date.now()-864e5).toDateString()?d.streak||0:0;
 return `<div class="daily"><div class="gp-top"><span>Daily goal</span><b>${Math.min(mins,GOAL_MIN)} / ${GOAL_MIN} min</b></div><div class="gp-bar"><i style="width:${pc}%;background:repeating-linear-gradient(90deg,#7fe8ff 0 10px,#3a9ab0 10px 12px)"></i></div><small>${pc>=100?'Done for today! Great job.':'A little every day works best.'} · Streak: ${st} day${st===1?'':'s'}</small></div>`}
const _rh20=renderHome;renderHome=function(){_rh20();const g=$('#s-home .gprog');if(g&&S.name)g.insertAdjacentHTML('beforebegin',dailyHTML());
 const hb=$('#s-home .hbtns');if(hb&&!hb.querySelector('[data-act=practice]'))hb.insertAdjacentHTML('beforeend','<button class="btn alt" data-act="practice">Practice</button>')};
/* --- 2. no-peek bonus --- */
const _res20=results;results=function(r){_res20(r);if(!r.pass||P.practice||S.set.hide==='show')return;S.gems+=1;save();const b=$('#mbox .bigstars');b&&b.insertAdjacentHTML('afterend','<div class="banner luck">No-peek +1 diamond</div>')};
/* --- 3/4. practice menu: trouble keys, letter combos, free write --- */
const COMBOS=['th','he','in','er','an','re','on','at','en','nd','ti','es','or','te','of','ed','is','it','al','ar','st','to','nt','ng','se','ha','as','ou','io','le','ve','co','me','de','hi','ri','ro','ic','ne','ea','ra','ce','the','ing','and','ion','ent','her','for','tha','ter','was','you','ith','ver','all','wit','thi','tio'];
let PRACT=null;
ACT.practice=()=>{const i=(typeof EI==='function'?EI(Math.max(0,Math.floor(Math.max(0,nextStage()-1)/8))):Math.max(0,Math.floor(Math.max(0,nextStage()-1)/8))),wk=weakKeys(learned(Math.min(i,19)));
 modal(`<h2>Practice</h2><div class="pmenu">
 <button class="pm" data-act="pr" data-m="weak"><b>Trouble keys</b><span>${wk.length?'Work on: '+wk.map(x=>x[0].toUpperCase()).join(' '):'Keys you miss the most'}</span></button>
 <button class="pm" data-act="pr" data-m="combo"><b>Letter combos</b><span>th, ing, the... type them in one smooth move</span></button>
 <button class="pm" data-act="pr" data-m="free"><b>Free write</b><span>Type your own words. No wrong answers!</span></button>
 </div><button class="btn alt" data-act="close">Close</button>`)};
ACT.pr=d=>{closeModal();if(d.m==='free')return freeWrite();PRACT=d.m;startStage(0,'practice')};
function comboText(){const L=learned(Math.min(19,Math.floor(Math.max(0,nextStage()-1)/8)));const all=nextStage()>=8*20;
 const ok=COMBOS.filter(c=>all||[...c].every(ch=>L.has(ch)));const pool=ok.length>=4?ok:['fj','jf','dk','kd','sl','ls'];
 const words=(typeof WORDS!=='undefined'?WORDS:[]).filter(w=>(all||[...w].every(ch=>L.has(ch))));const len=Math.round(60*S.set.len);let out=[];
 while(out.join(' ').length<len){const c=rand(pool),ws=words.filter(w=>w.includes(c));out.push(c,c,ws.length?rand(ws):c+c)}return out.join(' ')}
const _gt20=genText;genText=function(i,s,pr){
 if(pr&&PRACT==='combo'){PRACT=null;return comboText()}
 if(pr){PRACT=null;return _gt20(i,s,pr)}
 let t=_gt20(i,s,pr);REVIEW=null;
 // 4. weave in a quick review of trouble keys (letters only, ones already learned)
 if(typeof P!=="undefined"&&!P.mode&&i<15){const L=learned(Math.min(i,19)),cur=new Set((LESSONS[i].k||'').split(''));
  const wk=Object.entries(S.ks).filter(([c,k])=>/^[a-z]$/.test(c)&&L.has(c)&&!cur.has(c)&&k.h+k.m>=8&&k.h/(k.h+k.m)<.9).sort((a,b)=>a[1].h/(a[1].h+a[1].m)-b[1].h/(b[1].h+b[1].m)).slice(0,2).map(x=>x[0]);
  if(wk.length){const chunk=[0,1,2].map(()=>wk.map(c=>c+c).join('')).join(' ');REVIEW=wk;t=chunk+' '+t}}
 return t};
let REVIEW=null;
const _br20=beginRound;beginRound=function(){_br20();if(REVIEW&&!P.mode&&!P.practice){say(`Quick review: ${REVIEW.map(c=>c.toUpperCase()).join(' and ')} first!`)}};
/* --- 5. free write --- */
const FW_PROMPTS=['Tell me about your favorite Keylori.','What would you do with a pet dragon?','Describe your dream treehouse.','What is the best food in the world? Why?','Write a story about a lost key to Keyloria.','If you could fly, where would you go?','What makes a good friend?','Invent a new Keylori. What can it do?','Tell me about the best day ever.','What would you pack for a trip to the moon?'];
function freeWrite(){const p=rand(FW_PROMPTS);FW={t0:0};
 modal(`<h2>Free write</h2><p class="fwp">${p}</p><textarea id="fw" rows="5" placeholder="Start typing..." spellcheck="false"></textarea><p class="muted fwc" id="fwc">0 words</p>
 <div class="rbtns"><button class="btn" data-act="fwDone">I'm done!</button><button class="btn alt" data-act="close">Close</button></div>`);
 setTimeout(()=>$('#fw')?.focus(),50)}
let FW=null;
document.addEventListener('input',e=>{if(e.target.id!=='fw')return;if(!FW.t0)FW.t0=performance.now();const n=(e.target.value.match(/\S+/g)||[]).length;$('#fwc').textContent=n+' word'+(n===1?'':'s')});
addEventListener('keydown',e=>{if(e.target&&e.target.id==='fw'){e.stopImmediatePropagation()}},true);
ACT.fwDone=()=>{const v=($('#fw')?.value||'').trim(),words=(v.match(/\S+/g)||[]).length;if(!words){toast('Type a few words first!');return}
 const secs=Math.max(FW.t0?(performance.now()-FW.t0)/1000:30,v.length/12),wpm=Math.round(v.length/5/Math.max(secs/60,1/60)),gems=Math.min(5,Math.floor(words/15)),xp=words*2;
 S.time+=Math.round(secs);S.xp+=xp;S.gems+=gems;S.fw=(S.fw||0)+1;save();sfx.win();
 modal(`<h2>Great writing!</h2><div class="hero-mini">${zookSVG()}</div><div class="rstats"><div><b>${words}</b><span>Words</span></div><div><b>${wpm}</b><span>Words per minute</span></div><div><b>+${xp}</b><span>XP</span></div><div><b>+${gems}</b><span>Diamonds</span></div></div>
 <div class="rbtns"><button class="btn" data-act="pr" data-m="free">Write more</button><button class="btn alt" data-act="close">Done</button></div>`)};

/* ================= V21: placement into any world, BEAST levels ================= */
/* --- placement test, part 2 --- */
function segAcc(){return P.segs.map(([a,b])=>{let m=0;P.mist.forEach(x=>{if(x>=a&&x<b)m++});return Math.round((b-a-m)/(b-a)*100)})}
let PLACE1=null;
const _pr21=placeResult;placeResult=function(){const seg=segAcc();
 if(!P.place2){if(!P.noPart2&&seg.every(x=>x>=88)){PLACE1=seg;sfx.win();
   modal(`<h2>Wow, great typing!</h2><div class="hero-mini">${zookSVG()}</div><p style="margin:0">Let's see how far you can go. One more part!</p><div class="rbtns"><button class="btn" data-act="place2">Keep going ▸</button></div>`);return}
  return _pr21()}
 const mins=Math.max((performance.now()-P.start)/60000,1/60),wpm=Math.round(P.text.length/5/mins),[cap,num,spd]=seg,all=Math.min(cap,num,spd);
 const mn=Math.min(cap,num,spd);let L=P.direct&&mn<85?(mn<70?0:10):15;const R=[[L===15&&cap>=88&&wpm>=10,20],[num>=85&&wpm>=14,25],[all>=90&&wpm>=20,30],[cap>=92&&wpm>=26,36],[num>=92&&wpm>=30,42],[all>=92&&wpm>=35,48],[all>=92&&wpm>=40,54],[all>=93&&wpm>=48,60],[all>=95&&wpm>=58,66]];
 for(const [ok,l] of R){if(ok)L=l;else break}
 S.skip=Math.max(S.skip,L*8);S.placed=true;S.camp=true;S.hist.push({t:Date.now(),w:wpm,a:Math.round((cap+num+spd)/3)});save();sfx.win();
 const w=worldOf(L),where=w>1?`World ${w}: ${WORLDS[w-1].name}`:REGIONS[LESSONS[L].r].name;
 modal(`<h2>Skill check done!</h2><div class="hero-mini">${zookSVG()}</div>
 <div class="rstats">${[['Sentences',cap+'%'],['Numbers',num+'%'],['Speed words',spd+'%'],['Speed',wpm+' WPM']].map(([t,v])=>`<div><b>${v}</b><span>${t}</span></div>`).join('')}</div>
 <p style="margin:0">Start at <b>${where}</b>!</p>
 <div class="rbtns"><button class="btn" data-act="play" data-n="${nextStage()}">Let's go ▸</button><button class="btn alt" data-act="go" data-to="map">Map</button></div>`)};
ACT.place2=()=>{closeModal();startStage(0,'place');const parts=[fillSent(SENT.concat(W2.punct),60),fillSent(W2.numw.concat(W2.symb),44),fillWords(WT.c_top,70)];
 let t='',segs=[];parts.forEach((p,x)=>{const a=t.length+(x?1:0);t+=(x?' ':'')+p;segs.push([a,t.length])});
 setAvail(new Set([...keyEls.keys()]),true);applyLabels();P.text=t;P.segs=segs;P.place2=true;beginRound();say('Part 2: sentences, numbers and speed!')};

/* ================= V22: map shows worlds as you reach them; world badges ================= */
const worldOfRegion=r=>{let w=0;WREG.forEach((x,k)=>{if(r>=x)w=k});return w+1};
const worldDone=w=>{const a=WSTART[w-1],b=WSTART[w]||LESSONS.length;for(const i of (window.SEQWL?SEQWL(w):Array.from({length:b-a},(_,k)=>a+k)))for(let s=0;s<8;s++)if(!(S.best[i+'-'+s]>=1))return false;return true};
const _rm22=renderMap;renderMap=function(){_rm22();const cur=worldOf(Math.floor(nextStage()/8));
 const root=$('#s-map');let w=0;[...root.children].forEach(el=>{if(el.classList.contains('worldhead')){w++;if(w>cur+1)el.remove();else if(w===cur+1&&!el.classList.contains('shut'))w=w}else if(el.classList.contains('region')){if(w>cur)el.remove()}})};
const _rh22=renderHome;renderHome=function(){_rh22();$('#s-home .gprog')?.remove();const b=$('#s-home .badges');if(!b)return;
 b.innerHTML=WORLDS.map((W,k)=>`<div class="badge ${worldDone(k+1)?'got':''}" style="--bc:${REGIONS[WREG[k]].color}" title="${W.name} badge">${k+1}</div>`).join('');pixBadges($('#s-home'))};

/* ================= V23: random starter hero, pixel logo, new gem, Key Box catch ================= */
let PREVIEW_HERO=rand(Object.keys(HEROES));
const heroNow=()=>S.hero||PREVIEW_HERO;
Object.defineProperty(CAMP[0],'h',{get:()=>`Hi! I am ${HEROES[heroNow()].name}!`,configurable:true});
const _np23=ACT.newPlayer;ACT.newPlayer=()=>{PREVIEW_HERO=rand(Object.keys(HEROES));_np23()};
/* --- gem --- */
const GEM=["...ooooooo...","..oHHhhhLBo..",".oHhhLLLhLBo.","oHhLLLLLLhBDo","ohhhhhhhhhhho",".oLLhBBBhDDo.","..oLhBBBhDo..","...oLhBhDo...","....oLhDo....",".....oDo.....","......o......"];
const GEMP={o:'#1a2a4a',H:'#ffffff',h:'#c8f0ff',L:'#7fd8f0',B:'#4aa8d8',D:'#2a6aa8'};
const gemURL=PXG(GEM,GEMP).toDataURL();
ICON.gem=`<svg viewBox="0 0 13 11" style="image-rendering:pixelated"><image href="${gemURL}" width="13" height="11"/></svg>`;
if(typeof PXI!=='undefined'&&PXI.gem){PXI.gem={p:GEMP,r:GEM};delete PXU.gem}
/* --- pixel logo --- */
const F5={K:["X...X","X..X.","X.X..","XX...","X.X..","X..X.","X...X"],E:["XXXXX","X....","X....","XXXX.","X....","X....","XXXXX"],Y:["X...X","X...X",".X.X.","..X..","..X..","..X..","..X.."],
 L:["X....","X....","X....","X....","X....","X....","XXXXX"],R:["XXXX.","X...X","X...X","XXXX.","X.X..","X..X.","X...X"],A:[".XXX.","X...X","X...X","XXXXX","X...X","X...X","X...X"],
 S:[".XXXX","X....","X....",".XXX.","....X","....X","XXXX."],T:["XXXXX","..X..","..X..","..X..","..X..","..X..","..X.."],O:[".XXX.","X...X","X...X","X...X","X...X","X...X",".XXX."],
 N:["X...X","XX..X","X.X.X","X..XX","X...X","X...X","X...X"],I:["XXX",".X.",".X.",".X.",".X.",".X.","XXX"],G:[".XXXX","X....","X....","X.XXX","X...X","X...X",".XXX."],
 D:["XXXX.","X...X","X...X","X...X","X...X","X...X","XXXX."],M:["X...X","XX.XX","X.X.X","X.X.X","X...X","X...X","X...X"]};
function logoCanvas(){const W=240,H=78,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const m=Array.from({length:H},()=>new Array(W).fill(''));const set=(x,y,v)=>{if(x>=0&&y>=0&&x<W&&y<H)m[y][x]=v};
 const cx=120;
 // wings (scaled 2x) + crown (scaled 2x)
 const wing=["ooo.............","oHHoo...........",".oHLLoo.........",".oLLLLLoo.......","..oLLBLLLoo.....","..oBLLBLLLLoo...","...oBBLBBLLLLoo.","...oBBBoBBBLLLLo","....ooBBoBBBBBBo","......oooBBoBBo.",".........oooBo..","............oo.."];
 const put2=(rows,x0,y0,flip,map,sc=2)=>rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch==='.')return;const X=flip?r.length-1-x:x;for(let a=0;a<sc;a++)for(let b=0;b<sc;b++)set(x0+X*sc+a,y0+y*sc+b,map[ch])}));
 const WM={o:'',B:'wB',L:'wL',H:'wH'};
 put2(wing,cx-19-32,0,false,{o:'wo',B:'wB',L:'wL',H:'wH'});put2(wing,cx+19,0,true,{o:'wo',B:'wB',L:'wL',H:'wH'});
 const crown=["o..o.oo.o..o","oyoyoyyoyoyo","oyyyyrryyyyo","oYYYYYYYYYYo","oooooooooooo"];put2(crown,cx-18,6,false,{o:'co',y:'cy',Y:'cY',r:'cr'},3);
 // bold KEYLORIA
 const bold=gph=>gph.map(r=>{let o='';for(let x=0;x<=r.length;x++)o+=(r[x]==='X'||r[x-1]==='X')?'X':'.';return o});
 const tw=(w,b)=>[...w].reduce((a,ch)=>a+(F5[ch][0].length+(b?1:0)+1),-1);
 const word=(w,x0,y0,sc,tag,b)=>{let x=x0;[...w].forEach(ch=>{const gph=b?bold(F5[ch]):F5[ch];gph.forEach((row,yy)=>[...row].forEach((v,xx)=>{if(v==='X')for(let a=0;a<sc;a++)for(let q=0;q<sc;q++){const Y=yy*sc+q,T=gph.length*sc;set(x+xx*sc+a,y0+Y,tag+(Y<2?'0':Y<T*.45?'1':Y<T*.7?'2':'3'))}}));x+=(gph[0].length+1)*sc});return x};
 word('KEYLORIA',Math.round((W-tw('KEYLORIA',1)*3)/2),26,3,'t',1);
 put2(GEM,6,22,false,{o:'go',H:'gH',h:'gh',L:'gL',B:'gB',D:'gD'});put2(GEM,W-6-26,22,true,{o:'go',H:'gH',h:'gh',L:'gL',B:'gB',D:'gD'});
 // ribbon + big KINGDOM
 const KF={K:["XX..XX","XX.XX.","XXXX..","XXX...","XXXX..","XX.XX.","XX..XX"],I:["XXXXXX","..XX..","..XX..","..XX..","..XX..","..XX..","XXXXXX"],
  N:["XX...XX","XXX..XX","XXXX.XX","XX.XXXX","XX..XXX","XX...XX","XX...XX"],G:[".XXXXX.","XX...XX","XX.....","XX.XXXX","XX...XX","XX...XX",".XXXXX."],
  D:["XXXXX.","XX..XX","XX..XX","XX..XX","XX..XX","XX..XX","XXXXX."],O:[".XXXX.","XX..XX","XX..XX","XX..XX","XX..XX","XX..XX",".XXXX."],
  M:["XX....XX","XXX..XXX","XXXXXXXX","XX.XX.XX","XX....XX","XX....XX","XX....XX"]};
 const kw=[...'KINGDOM'].reduce((t,ch)=>t+KF[ch][0].length+1,-1)*2,rw=kw+20,rx=Math.round((W-rw)/2),ry=52,rh=20;
 [[-11,rx-11],[1,rx+rw]].forEach(([d,x0])=>{for(let y=3;y<rh+3;y++)for(let x=0;x<11;x++){const mid=(rh+6)/2,dd=Math.abs(y-mid),cut=dd<4?4-Math.round(dd):0;const notch=d<0?x<cut:x>10-cut;if(!notch)set(x0+x,ry+y,'rD')}});
 for(let y=0;y<rh;y++)for(let x=0;x<rw;x++)set(rx+x,ry+y,y<2?'rH':y>rh-3?'rD':'rB');
 const wordK=(x0,y0,tag)=>{let x=x0;[...'KINGDOM'].forEach(ch=>{const gph=KF[ch];gph.forEach((row,yy)=>[...row].forEach((v,xx)=>{if(v==='X')for(let a=0;a<2;a++)for(let q=0;q<2;q++){const Y=yy*2+q;set(x+xx*2+a,y0+Y,tag==='wS'?tag:'w'+(Y<2?'0':Y<6?'1':Y<10?'2':'3'))}}));x+=(gph[0].length+1)*2})};
 wordK(rx+10,ry+3+1,'wS');wordK(rx+10,ry+3,'w1');
 const P={go:'#1a2a4a',gH:'#ffffff',gh:'#c8f0ff',gL:'#7fd8f0',gB:'#4aa8d8',gD:'#2a6aa8',wo:'#2a1d3e',wB:'#c8a040',wL:'#f6d878',wH:'#fffbe0',co:'#5a3a00',cy:'#f6d050',cY:'#c8981e',cr:'#e8584f',t0:'#fffbe0',t1:'#ffe680',t2:'#f6c040',t3:'#e0842a',rH:'#8fe0d8',rB:'#3a8a84',rD:'#22605c',wS:'#123c3a',w0:'#ffffff',w1:'#fff6d8',w2:'#f6e2a8',w3:'#e0bf7a'};
 for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const v=m[y][x];if(v&&v[0]!=='w'&&y+3<H&&x+2<W&&!m[y+3][x+2]){g.fillStyle='#120c1c';g.fillRect(x+2,y+3,1,1)}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(m[y][x])continue;let near=false;for(let b=-1;b<=1&&!near;b++)for(let a=-1;a<=1;a++){const v=m[y+b]?.[x+a];if(v&&v[0]!=='w'||v&&v.length===2&&v[0]==='w'&&'oBLH'.includes(v[1])){near=true;break}}if(near){g.fillStyle='#4a2a1a';g.fillRect(x,y,1,1)}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=m[y][x];if(v){g.fillStyle=P[v]||'#fff';g.fillRect(x,y,1,1)}}
 return c}
const LOGO_URL=logoCanvas().toDataURL();
const _rh23=renderHome;renderHome=function(){_rh23();const lg=$('#s-home .logo');if(lg)lg.innerHTML=`<img class="pxlogo" src="${LOGO_URL}" alt="Keyloria Kingdom">`;
 const say=$('#s-home .say');if(say&&!S.name)say.textContent=`Hi! I'm ${HEROES[heroNow()].name}!`};
/* --- Key Box catch --- */
const BOXC=["..................","..................","..................","..................","..................","..................",
 "..oooooooooooooo..",".oLLLLLLYYLLLLLLo.","oLLBBBBBYYBBBBBBDo","oBBBBBBBYYBBBBBBDo","oooooooooooooooooo","oYYYYYYYYYYYYYYYyo",
 "oLBBBBBByyBBBBBBDo","oLBBBBBBkkBBBBBBDo","oLBBBBBBkkBBBBBBDo","oLBBBBBBBBBBBBBBDo","oLBBBBBBYYBBBBBBDo","oDDDDDDDDDDDDDDDDo",".oooooooooooooooo."];
const BOXO=["..oooooooooooooo..",".oDDDDDDDDDDDDDDo.","oDDDDDDDDDDDDDDDDo","oDDDDDDYYDDDDDDDDo","oYYYYYYYYYYYYYYYyo",".oooooooooooooooo.",
 "..................","..................","..................","..................","oooooooooooooooooo","oggggggggggggggggo",
 "oLBBBBBByyBBBBBBDo","oLBBBBBBkkBBBBBBDo","oLBBBBBBkkBBBBBBDo","oLBBBBBBBBBBBBBBDo","oLBBBBBBYYBBBBBBDo","oDDDDDDDDDDDDDDDDo",".oooooooooooooooo."];
const BOXP={o:'#2a1d3e',L:'#8f7fd6',B:'#6a58b8',D:'#4a3a8a',Y:'#f0c860',y:'#b8901e',k:'#2a1d3e',g:'#fff4c8'};
const BOXC_URL=PXG(BOXC,BOXP).toDataURL(),BOXO_URL=PXG(BOXO,BOXP).toDataURL();
function catchAnim(done){const a=$('#arena'),f=$('#foe');if(!a||!f)return done();
 const ar=a.getBoundingClientRect(),fr=f.getBoundingClientRect(),bw=Math.min(110,fr.width*.5),bh=bw*19/18;
 const bx=fr.left-ar.left+fr.width/2-bw/2,by=Math.min(fr.top-ar.top+fr.height-bh*1.05,ar.height-bh-6);
 const box=document.createElement('img');box.className='kbox';box.src=BOXC_URL;box.style.cssText=`left:${bx}px;top:${by-160}px;width:${bw}px;height:${bh}px`;a.appendChild(box);
 say('Go, Key Box!');tone(520,.15,'square',.06);
 requestAnimationFrame(()=>{box.style.transition='top .35s steps(5)';box.style.top=by+'px'});
 setTimeout(()=>{box.src=BOXO_URL;tone(700,.1,'square',.06);kick(box,'bump')},450);
 setTimeout(()=>{const cr=f.querySelector('.cage')||f;const r=cr.getBoundingClientRect(),dx=(bx+bw/2)-(r.left-ar.left+r.width/2),dy=(by+bh*.55)-(r.top-ar.top+r.height/2);
  cr.style.transition='transform .7s steps(8)';cr.style.transform=`translate(${dx}px,${dy}px) scale(.05) rotate(540deg)`;[0,1,2].forEach(k=>setTimeout(()=>tone(400+k*120,.08,'square',.05),k*200))},650);
 setTimeout(()=>{box.src=BOXC_URL;kick(box,'bump');burst(a,box,'#f0c860',16);sfx.win();say('Caught!');f.style.visibility='hidden'},1450);
 setTimeout(()=>{kick(box,'bump')},1900);
 setTimeout(done,2500)}

/* ================= V25: premium closet items (wings, aura, props) ================= */
const mirror=r=>r.map(x=>[...x].reverse().join(''));
const DWING=["oo........","oBoo......","oBLBoo....","oBLLLBoo..",".oBLLLLBo.",".oBLHLLLBo","..oBLLLLBo","..oBoBLLBo","...o.oBLBo","......oBBo",".......ooo"];
const PREMIUM={
 drakewings:{slot:'back',name:'Dragon Wings',cost:400,lvl:11,parts:[[DWING,-5,7],[mirror(DWING),19,7]],pal:{o:'#2a1420',B:'#8a2a2a',L:'#c8443a',H:'#f08a5a'},back:1},
 starwings:{slot:'back',name:'Star Wings',cost:520,lvl:13,parts:[[DWING,-5,6],[mirror(DWING),19,6]],pal:{o:'#123a4a',B:'#3a8ab0',L:'#7fd8f0',H:'#fff6c0'},back:1},
 horns:{slot:'head',name:'Dragon Horns',cost:300,lvl:11,parts:[[["..o",".oH","oHL","oLB","oBo"],6,1],[mirror(["..o",".oH","oHL","oLB","oBo"]),15,1]],pal:{o:'#1e1a2a',H:'#f6ecd8',L:'#c8b8a0',B:'#8a7a68'}},
 phoenix:{slot:'head',name:'Phoenix Crest',cost:360,lvl:12,parts:[[["..o.o.o..",".oYoRoYo.","oYRYRYRYo",".oRRRRRo."],8,2]],pal:{o:'#4a1a10',Y:'#f6d050',R:'#e8584f'}},
 keyblade:{slot:'hand',name:'Key Blade',cost:450,lvl:12,parts:[[[".ooo.","oYYYo","oY.Yo","oYYYo",".oYo.",".oYo.",".oYo.",".oYo.",".oYoo",".oYYo",".oYo.",".oYoo",".oYYo",".ooo."],22,6]],pal:{o:'#5a3a00',Y:'#f6d050'}},
 orb:{slot:'hand',name:'Spirit Orb',cost:380,lvl:11,parts:[[[".oooo.","oHLLBo","oLLLBo","oLLBBo","oBBBDo",".oooo."],-4,3]],pal:{o:'#123a4a',H:'#ffffff',L:'#7fe8ff',B:'#3aa8c8',D:'#1a6a88'}},
 sparkles:{slot:'fx',name:'Star Sparkles',cost:260,lvl:10,fx:'sparkle'},
 aura:{slot:'fx',name:'Legend Aura',cost:650,lvl:14,fx:'aura'}};
Object.entries(PREMIUM).forEach(([id,a])=>{ACC[id]={slot:a.slot,name:a.name,cost:a.cost,lvl:a.lvl,svg:''};KKDATA.acc[id]=Object.assign({x:0,y:0,rows:[],pal:{}},a)});
function heroCanvas(eq={},hero='pop',color=null){const h=HEROES[hero]||HEROES.pop,pal=Object.assign({},h.pal);if(color&&HCOL[color])HCOL[color].forEach((c,i)=>pal[HK[i]]=c);
 const OX=6,OY=6,c=document.createElement('canvas');c.width=36;c.height=32;const g=c.getContext('2d'),A=Object.values(eq||{}).filter(id=>KKDATA.acc[id]);
 const paint=(rows,p,ox=0,oy=0)=>rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(p[ch]){g.fillStyle=p[ch];g.fillRect(OX+ox+x,OY+oy+y,1,1)}}));
 const draw=a=>{if(a.parts)a.parts.forEach(([r,x,y])=>paint(r,a.pal,x,y));else paint(a.rows,a.pal,a.x,a.y)};
 A.filter(id=>KKDATA.acc[id].back).forEach(id=>draw(KKDATA.acc[id]));paint(h.rows,pal);
 A.filter(id=>!KKDATA.acc[id].back&&!KKDATA.acc[id].fx).forEach(id=>draw(KKDATA.acc[id]));
 if(A.includes('aura')){const d=g.getImageData(0,0,36,32).data,on=(x,y)=>x>=0&&y>=0&&x<36&&y<32&&d[(y*36+x)*4+3]>0;const ring=[];
  for(let y=0;y<32;y++)for(let x=0;x<36;x++)if(!on(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>on(x+a,y+b)))ring.push([x,y]);
  ring.forEach(([x,y])=>{g.fillStyle=(x+y)%2?'#7fe8ff':'#f6d050';g.fillRect(x,y,1,1)})}
 if(A.includes('sparkles')){[[2,3,'#fff6c0'],[32,6,'#ffffff'],[1,22,'#ffffff'],[33,25,'#fff6c0'],[28,1,'#f6d050']].forEach(([x,y,col])=>{g.fillStyle=col;[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>g.fillRect(x+a,y+b,1,1))})}
 return c}
function zookSVG(eq,hero,color){eq=eq||S.equip;hero=hero||heroNow();color=color===undefined?S.color:color;const u=kku('h3'+hero+(color||'')+JSON.stringify(eq),()=>heroCanvas(eq,hero,color)),k=200/24;
 return `<svg class="zk" viewBox="0 0 200 200" aria-hidden="true" style="overflow:visible"><image href="${u}" x="${-6*k}" y="${-6*k}" width="${36*k}" height="${32*k}" style="image-rendering:pixelated"/></svg>`}

/* ================= V27: closet preview + confirm, buy sound, evolve + holo animations ================= */
sfx.buy=()=>{[1046,1318,1568,2093].forEach((f,k)=>tone(f,.12,'triangle',.07,k*.07));tone(2637,.25,'sine',.05,.3)};
let SHOPPV=null;
renderShop=function(){const L=levelOf(S.xp),pv=SHOPPV&&ACC[SHOPPV]?SHOPPV:null,gem=ICON.gem.replace('<svg','<svg width="16" height="16"');
 let it='';Object.entries(ACC).sort((a,b)=>a[1].lvl-b[1].lvl||a[1].cost-b[1].cost).forEach(([id,a])=>{const own=S.owned.includes(id),eq=S.equip[a.slot]===id,lock=L<a.lvl;
  it+=`<div class="item panel ${eq?'eq':''} ${lock?'lockd':''} ${pv===id?'pv':''}" data-act="shopPv" data-id="${id}">${zookSVG({[a.slot]:id})}<span class="slot">${lock?'Level '+a.lvl:a.slot}</span><h4>${a.name}</h4>
  ${lock?`<button class="btn sm alt" data-act="shopPv" data-id="${id}">Level ${a.lvl}</button>`:own?`<button class="btn sm ${eq?'alt':'volt'}" data-act="equip" data-id="${id}">${eq?'Take off':'Wear'}</button>`:`<button class="btn sm ${S.gems<a.cost?'alt':''}" data-act="buy" data-id="${id}">${gem} ${a.cost}</button>`}</div>`});
 let note=`Level up for new outfits!<br>You are Level ${L}.`,eqv=S.equip;
 if(pv){const a=ACC[pv],own=S.owned.includes(pv);eqv=Object.assign({},S.equip,{[a.slot]:pv});
  note=L<a.lvl?`<b class="pvbad">Reach Level ${a.lvl} to unlock ${a.name}.</b><br>You are Level ${L}.`:own?`You own ${a.name}!`:S.gems<a.cost?`<b class="pvbad">You need ${a.cost-S.gems} more diamonds for ${a.name}.</b>`:`<b class="pvok">${a.name}: tap the price to buy!</b>`;
  note+=`<br><button class="linkbtn" data-act="shopPvOff">Stop preview</button>`}
 $('#s-shop').innerHTML=`<div class="topbar"><button class="icon-btn" data-act="go" data-to="home" aria-label="Back">${ICON.back}</button><h2>${heroName()}'s Closet</h2>${gemsHTML()}</div>
 <div class="shop-top"><div class="shop-hero panel">${pv?'<span class="pvtag">Preview</span>':''}${zookSVG(eqv)}<p class="muted shopnote">${note}</p></div><div class="items">${it}</div></div>`};
ACT.shopPv=d=>{SHOPPV=d.id;sfx.click();renderShop()};
ACT.shopPvOff=()=>{SHOPPV=null;renderShop()};
ACT.buy=d=>{const a=ACC[d.id];if(levelOf(S.xp)<a.lvl||S.gems<a.cost){SHOPPV=d.id;sfx.bad();renderShop();return}
 const gem=ICON.gem.replace('<svg','<svg width="22" height="22"');
 modal(`<h2>Buy ${a.name}?</h2><div class="hero-mini">${zookSVG(Object.assign({},S.equip,{[a.slot]:d.id}))}</div><p style="margin:0;font-size:22px">It costs ${gem} ${a.cost}. You have ${gem} ${S.gems}.</p>
 <div class="rbtns"><button class="btn" data-act="buyYes" data-id="${d.id}">Yes, buy it!</button><button class="btn alt" data-act="close">No thanks</button></div>`)};
ACT.buyYes=d=>{const a=ACC[d.id];if(S.gems<a.cost)return closeModal();S.gems-=a.cost;S.owned.push(d.id);S.equip[a.slot]=d.id;SHOPPV=null;save();closeModal();sfx.buy();toast(a.name+' unlocked!');renderShop()};
const _bh27=ACT.buyHero;ACT.buyHero=()=>{if(!S.hero)return _bh27();const cur=heroNow(),cost=(HPV.h!==cur?HERO_COST:0)+((HPV.c||null)!==(S.color||null)?COLOR_COST:0);if(!cost)return _bh27();
 if(S.gems<cost)return;const gem=ICON.gem.replace('<svg','<svg width="22" height="22"'),pv={...HPV};
 modal(`<h2>Switch to this look?</h2><div class="hero-mini">${zookSVG(S.equip,pv.h,pv.c)}</div><p style="margin:0;font-size:22px">It costs ${gem} ${cost}. You have ${gem} ${S.gems}.</p>
 <div class="rbtns"><button class="btn" data-act="heroYes">Yes, switch!</button><button class="btn alt" data-act="heroNo">No thanks</button></div>`);ACT.heroYes=()=>{HPV=pv;_bh27();sfx.buy()};ACT.heroNo=()=>{HPV=pv;ACT.heroes()}};
/* --- evolution animation --- */
let EVO_DONE=null;
function evolveAnim(i,from,to,done){const sp=SPECIES[i],t=(S.cards[i+'-'+to]||{}).tier;EVO_DONE=done;
 modal(`<h2>What? ${sp.n[from]} is evolving!</h2><div class="evostage"><div class="evospr" id="evoA">${creatureSVG(i,from,'fit',t)}</div><div class="evospr" id="evoB" style="display:none">${creatureSVG(i,to,'fit',t)}</div></div><p class="muted" id="evoMsg" style="margin:0">&nbsp;</p><div class="rbtns" id="evoBtns" style="visibility:hidden"><button class="btn" data-act="evoNext">Yay!</button></div>`);
 const A=$('#evoA'),B=$('#evoB');A.classList.add('wsil');B.classList.add('wsil');let k=0;const gaps=[420,380,340,300,260,220,190,160,140,120,110,100,90,80,80,70,70,60];
 let fin=false;const step=()=>{if(fin||!document.getElementById('evoA'))return;if(k>=gaps.length){fin=true;A.style.display='none';B.style.display='';B.classList.remove('wsil');B.classList.add('evoreveal');burst($('#mbox'),B,'#f0c860',24);sfx.lvl();
   $('#evoMsg').innerHTML=`<b style="font-size:24px;color:#f0c860">${sp.n[from]} evolved into ${sp.n[to]}!</b>`;$('#evoBtns').style.visibility='visible';return}
  const show=k%2===0;A.style.display=show?'none':'';B.style.display=show?'':'none';tone(400+k*40,.06,'square',.05);k++;setTimeout(step,gaps[k-1])};
 window._evoFF=()=>{k=gaps.length;step()};setTimeout(step,700)}
ACT.evoNext=()=>{const d=EVO_DONE;EVO_DONE=null;closeModal();d&&d()};
const _res27=results;results=function(r){if(r.evo!=null&&!r._ev&&!P.practice){r._ev=1;return evolveAnim(P.fi,r.evoFrom,r.evo,()=>results(r))}
 _res27(r);if(r.holoUp&&r.holoF!=null&&(r.evo==null||r.holoF===r.evo)){const fl=$('#flip .fi');if(fl){const cw=fl.querySelector('.cw:not(.bk)');if(cw)cw.outerHTML=cardHTML(P.fi,r.holoF,S.cards[P.fi+'-'+r.holoF]||{})}const f=$('#flip');f&&f.classList.add('goholo');setTimeout(()=>sfx.buy(),700)}};

/* ================= V28: hero column on home ================= */
const _rh28=renderHome;renderHome=function(){_rh28();const tn=$('#s-home .tname'),hb=$('#s-home .hero-big');if(!tn||!hb||!S.name)return;
 const name=tn.querySelector('h2'),lvl=tn.querySelector('.lvl'),xp=$('#s-home .xpbar'),btns=[...tn.querySelectorAll('button')];
 const info=document.createElement('div');info.className='hero-info';
 info.innerHTML=`<h2 class="hi-name">${name?name.innerHTML:''}</h2><div class="hi-lvl">${lvl?lvl.innerHTML:''}</div>`;
 if(xp)info.appendChild(xp);
 const row=document.createElement('div');row.className='hi-btns';btns.forEach(b=>{b.classList.remove('sm');b.style.marginLeft='';row.appendChild(b)});info.appendChild(row);
 hb.appendChild(info);tn.remove();requestAnimationFrame(()=>typeof fitHome==='function'&&fitHome())};

/* ================= V29: balanced home + level-up celebration ================= */
const _rh29=renderHome;renderHome=function(){_rh29();const info=$('#s-home .hero-info');if(!info)return;
 const tr=$('#s-home .trow'),bd=$('#s-home .badges');const row=info.querySelector('.hi-btns');
 if(tr)info.insertBefore(tr,row);if(bd)info.appendChild(bd);requestAnimationFrame(()=>typeof fitHome==='function'&&fitHome())};
let LVL_DONE=null;
function levelUpFX(L,done){LVL_DONE=done;const un=Object.entries(ACC).filter(([k,a])=>a.lvl===L).map(([k,a])=>a.name);
 const conf=Array.from({length:40},(_,k)=>`<i style="left:${(k*37)%100}%;animation-delay:${(k%10)*.12}s;background:${['#f0c860','#7fe8ff','#6edc8c','#f07a6e','#fff6e0'][k%5]}"></i>`).join('');
 const d=document.createElement('div');d.id='lvlfx';d.innerHTML=`<div class="lf-rays"></div><div class="lf-conf">${conf}</div>
  <div class="lf-box"><div class="lf-title">LEVEL UP!</div><div class="lf-hero">${zookSVG()}</div><div class="lf-lvl">Level ${L}</div><div class="lf-name">${titleOf(L)}</div>
  ${un.length?`<div class="lf-un">New in the Hero Closet: <b>${un.join(', ')}</b></div>`:''}<button class="btn" data-act="lvlNext">Awesome!</button></div>`;
 document.body.appendChild(d);sfx.lvl();setTimeout(()=>sfx.buy(),500)}
ACT.lvlNext=()=>{$('#lvlfx')?.remove();const f=LVL_DONE;LVL_DONE=null;f&&f()};
addEventListener('keydown',e=>{if($('#lvlfx')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopImmediatePropagation();ACT.lvlNext()}},true);
const _res29=results;results=function(r){if(r.lvl&&!r._lv){r._lv=1;return levelUpFX(r.lvl,()=>results(r))}_res29(r)};

/* ================= V31: button colors, switch player in settings ================= */
const _rh31=renderHome;renderHome=function(){_rh31();$('#s-home .hi-btns [data-act=players]')?.remove();
 const hb=$('#s-home .hi-btns [data-act=heroes]');if(hb){hb.textContent='Change hero';hb.className='btn volt'}
 const set=(sel,cls)=>{const b=$('#s-home .hbtns '+sel);if(b)b.className='btn '+cls};
 set('[data-to=binder]','lav');set('[data-to=shop]','lav');set('[data-act=practice]','coral')};


const _rh32=renderHome;renderHome=function(){_rh32();document.querySelectorAll('#s-home .hero-info .trow > div').forEach(d=>{if(/Holo/.test(d.textContent))d.remove()})};

/* ================= V33: pixel icons on home buttons ================= */
const BICO={
 sword:{r:["..........oo",".........oWo","........oWo.",".......oWo..","......oWo...","..o..oWo....","..oooWo.....","...oBo......","..oBooo.....",".oBo..o.....","oBo.........","oo.........."],p:{o:'#2a1d3e',W:'#e8f0f8',B:'#8a5a2a'}},
 map:{r:["oooooooooooo","oPPPPoPPPPPo","oPPgPoPPrPro","oPgggoPPPrPo","oPPgPoPPrPro","oPPPPoPPPPPo","oPPPPoPgPPPo","oPPPPoPPPPPo","oooooooooooo"],p:{o:'#2a1d3e',P:'#f0dcb0',g:'#4a8a3a',r:'#d8483a'}},
 pad:{r:["..oooooooo..",".oGGGGGGGGo.","oGGkGGGGrGGo","oGkkkGGrGrGo","oGGkGGGGrGGo","oGGGGooGGGGo",".oGGo..oGGo.","..oo....oo.."],p:{o:'#2a1d3e',G:'#d8d0e8',k:'#2a1d3e',r:'#e8584f'}},
 cards:{r:["...oooooo...","...oCCCCo...",".oooooooCo..",".oWWWWWoCo..",".oWYYYWoCo..",".oWYYYWoCo..",".oWWWWWooo..",".oWWWWWo....",".ooooooo...."],p:{o:'#2a1d3e',C:'#7a6ab0',W:'#fff6e0',Y:'#f0c860'}},
 shirt:{r:[".ooo....ooo.","oSSSoooooSSo","oSSSSSSSSSSo","ooSSSSSSSSoo","..oSSSSSSo..","..oSSYYSSo..","..oSSSSSSo..","..oooooooo.."],p:{o:'#2a1d3e',S:'#4a9a94',Y:'#f0c860'}},
 target:{r:["...oooooo...","..oRRRRRRo..",".oRWWWWWWRo.",".oRWRRRRWRo.",".oRWRWWRWRo.",".oRWRWWRWRo.",".oRWRRRRWRo.",".oRWWWWWWRo.","..oRRRRRRo..","...oooooo..."],p:{o:'#2a1d3e',R:'#d8483a',W:'#fff6e0'}},
 swap:{r:["....o.......","....oo......","ooooYYo.....","oYYYYYYo....","ooooYYo.....","....oo..o...","....o..oo...",".....oYYoooo","....oYYYYYYo",".....oYYoooo","......oo....",".......o...."],p:{o:'#1a3a40',Y:'#fff6e0'}}};
const BICU={};Object.entries(BICO).forEach(([k,v])=>BICU[k]=PXG(v.r,v.p).toDataURL());
const _rh33=renderHome;renderHome=function(){_rh33();const ic=(sel,k)=>{const b=$('#s-home '+sel);if(b&&!b.querySelector('.bico'))b.insertAdjacentHTML('afterbegin',`<img class="bico" src="${BICU[k]}" alt="">`)};
 ic('.hbtns [data-act=play]','sword');ic('.hbtns [data-to=map]','map');ic('.hbtns [data-to=arcade]','pad');ic('.hbtns [data-to=binder]','cards');ic('.hbtns [data-to=shop]','shirt');ic('.hbtns [data-act=practice]','target');{const b=$('#s-home .hi-btns [data-act=heroes]');if(b&&!b.querySelector('.bico'))b.insertAdjacentHTML('afterbegin',`<img class="bico hico" src="${heroCanvas({},heroNow(),S.color).toDataURL()}" alt="">`)}
 const bd=$('#s-home .hero-info .badges'),dl=$('#s-home .tcard .daily');if(bd&&dl){dl.insertAdjacentElement('afterend',bd);bd.classList.add('rbadges2')}
 requestAnimationFrame(()=>typeof fitHome==='function'&&fitHome())};

/* ================= V34: age-based skill check for new players ================= */
const AGES=['5','6','7','8','9','10','11','12','13+','Grown-up'];
function onboardTest(){const sel=S.age||'';
 modal(`<h2 class="ob-title">Can you type already?</h2><div class="hero-mini">${zookSVG()}</div>
 <p class="ob-q">How old are you?</p><div class="ob-ages">${AGES.map(a=>`<button class="${sel===a?'on':''}" data-act="ageSel" data-a="${a}">${a}</button>`).join('')}</div>
 <div class="rbtns ob-btns"><button class="btn big" data-act="ageTest" ${sel?'':'disabled'}>Take the skill check</button><button class="btn alt" data-act="ageNew">I'm new! Start at the beginning</button></div>`)}
ACT.ageSel=d=>{S.age=d.a;save();sfx.click();onboardTest()};
ACT.ageNew=()=>{S.placed=true;save();closeModal();show('home')};
ACT.ageTest=()=>{const a=S.age;closeModal();const n=a==='13+'||a==='Grown-up'?99:+a;
 if(n>=13){ACT.place2();P.direct=true;return}
 startStage(0,'place');if(n<=6){const ls=learned(4),t=fillWords(WORDS.filter(w=>w.length<5&&[...w].every(c=>ls.has(c))),24);P.text=t;P.segs=[[0,t.length]];P.noPart2=true;beginRound()}
 else if(n<=8){P.noPart2=false}};
const _bh34=ACT.buyHero;ACT.buyHero=()=>{const first=!S.hero;_bh34();if(first&&!S.placed)setTimeout(onboardTest,350)};


ACT.place=()=>{closeModal();onboardTest()};
const _rh35=renderHome;renderHome=function(){_rh35();const tb=$('#s-home .topbar');if(tb&&S.name&&!tb.querySelector('.selp'))tb.insertAdjacentHTML('afterbegin',`<button class="btn selp" data-act="players"><img class="bico hico" src="${heroCanvas({},heroNow(),S.color).toDataURL()}" alt="">SELECT PLAYER</button>`)};

/* ================= V36: new-player layout + SELECT PLAYER always ================= */
const _rh36=renderHome;renderHome=function(){_rh36();
 document.querySelectorAll('#s-home .trow > div').forEach(d=>{if(/Holo/.test(d.textContent))d.remove()});
 const tb=$('#s-home .topbar');if(tb&&!tb.querySelector('.selp'))tb.insertAdjacentHTML('afterbegin',`<button class="btn selp" data-act="players"><img class="bico hico" src="${heroCanvas({},heroNow(),S.color).toDataURL()}" alt="">SELECT PLAYER</button>`);
 const hb=$('#s-home .hero-big'),nb=$('#s-home .namebox');if(S.name||!hb||!nb||hb.querySelector('.hero-info'))return;
 const box=nb.parentElement,info=document.createElement('div');info.className='hero-info newp';
 info.innerHTML='<h2 class="hi-name">Your name?</h2>';info.appendChild(nb);
 const xp=$('#s-home .xpbar'),tr=$('#s-home .trow');if(xp)info.appendChild(xp);if(tr)info.appendChild(tr);
 hb.appendChild(info);box.remove();requestAnimationFrame(()=>typeof fitHome==='function'&&fitHome())};
/* ================= V37: slower levels, binder button on results ================= */
needXP=L=>L<=1?0:Math.round(200*Math.pow(L-1,1.75)/10)*10;
const _res37=results;results=function(r){_res37(r);setTimeout(()=>{const rb=document.querySelector('#mbox .rbtns');if(rb)rb.querySelectorAll('.btn').forEach(b=>/again/i.test(b.textContent)&&(b.classList.remove('alt'),b.classList.add('coral')));if(rb&&document.querySelector('#mbox .bigstars')&&!rb.querySelector('[data-to=binder]')){rb.insertAdjacentHTML('beforeend','<button class="btn lav" data-act="go" data-to="binder">Keylori Collection</button>');typeof fitModal==='function'&&fitModal()}},0)};
/* ================= V38: clean-name filter ================= */
const BAD_SUB='fuck,fuk,fuq,phuck,shit,shyt,cunt,bitch,biatch,nigg,nigga,fag,slut,whore,dick,penis,vagina,pussy,porn,nazi,hitler,kkk,twat,wank,boob,bastard,asshole,arsehole,jackass,dumbass,badass,asshat,jizz,retard,dildo,horny,sex,poop,pee pee,pedo,molest,butthole,buttface,damn,goddam,piss,crap,prick,testicle,scrot,nipple,naked,nude,bollock,bugger,motherf,stfu,wtf,milf,thot,suckmy,cocks'.split(',').map(w=>w.replace(/ /g,''));
const BAD_WORD='anal,anus,cock,kill,killer,ass,arse,cum,tit,tits,rape,rapist,butt,poo,nude,sexy,hell,die,dead,kys,gay,homo,lesbo,wtf,omfg,fu,fk,sob,stupid,idiot,dumb,loser,hate'.split(',');
function nameNorm(s){return s.toLowerCase().replace(/[0@4]/g,m=>({'0':'o','@':'a','4':'a'})[m]).replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/[5$]/g,'s').replace(/7/g,'t').replace(/8/g,'b')}
function badName(s){if(!s)return false;const n=nameNorm(s),flat=n.replace(/[^a-z]/g,''),col=flat.replace(/(.)\1+/g,'$1');
 if(BAD_SUB.some(w=>{const cw=w.replace(/(.)\1+/g,'$1');return flat.includes(w)||(cw.length>=3&&col.includes(cw))}))return true;
 const words=n.split(/[^a-z]+/).filter(Boolean);return words.some(w=>BAD_WORD.includes(w)||BAD_WORD.includes(w.replace(/(.)\1+/g,'$1')))||BAD_WORD.includes(flat)}
const _sn38=ACT.saveName;ACT.saveName=()=>{const i=$('#nm'),v=i?.value.trim();
 if(v&&badName(v)){i.value='';i.classList.remove('nmbad');void i.offsetWidth;i.classList.add('nmbad');i.placeholder='Try a different name';sfx.bad&&sfx.bad();toast('Oops! Please pick a kind name.');return}
 _sn38()};

const _ld38=load;load=function(){_ld38.apply(this,arguments);if(badName(S.name)){S.name='';save()}};
/* ================= V40: controversial + innuendo words ================= */
BAD_WORD.push(...'hoe,hoes,gay,gays,lesbian,lesbians,queer,trans,tranny,dyke,shaft,shafts,balls,ballsack,nuts,nutsack,screw,screwed,hump,humping,bang,banging,blowjob,beaver,pecker,wiener,weiner,willy,knob,knockers,jugs,melons,booty,thong,bra,panties,undies,kinky,kiss,kissing,lick,licking,moan,erect,erection,stroke,stripper,strip,hooker,pimp,booze,beer,wine,vodka,drunk,drug,drugs,weed,pot,crack,cocaine,meth,gun,guns,shoot,shot,bomb,bombs,knife,blood,bloody,murder,suicide,god,jesus,allah,satan,devil,demon,church,bible,quran,religion,trump,biden,obama,democrat,republican,liberal,abortion,racist,slave,slavery,terror,terrorist,isis,wet,moist,thrust,spank,sperm,semen,ejaculate,orgasm,climax,lube,condom,virgin,seduce,sexual,breast,breasts,butts,buns,crotch,groin'.split(','));
BAD_SUB.push(...'lesbian,blowjob,handjob,rimjob,boner,titty,tittie,orgasm,ejacul,erection,stripper,hooker,cocaine,heroin,terroris,suicid,nutsack,ballsack,boobie,booty'.split(','));
/* ================= V39: clean typing text ================= */
function tokBad(t){const n=nameNorm(t).replace(/[^a-z]/g,'');if(!n)return false;return BAD_SUB.some(w=>w.length>=3&&n.includes(w))||BAD_WORD.includes(n)}
function cleanText(txt){if(typeof txt!=='string')return txt;return txt.split(' ').map(t=>{if(!tokBad(t))return t;const a=[...t];
 for(let k=0;k<30;k++){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}const s=a.join('');if(!tokBad(s))return s}return ''}).filter((t,i,arr)=>t!==''||false).join(' ')}
const _gt39=genText;genText=function(){return cleanText(_gt39.apply(this,arguments))};
if(typeof comboText==='function'){const _ct39=comboText;comboText=function(){return cleanText(_ct39.apply(this,arguments))}}
/* ================= V41: feedback + about ================= */
const _rh41=renderHome;renderHome=function(){_rh41();const g=$('#s-home .home-grid');if(g&&!$('#s-home .footbtns'))g.insertAdjacentHTML('afterend','<div class="footbtns"><button class="btn alt sm" data-act="feedback">Feedback / Report a bug</button><button class="btn alt sm howtobtn" data-act="howto">How to play</button></div>')};
ACT.feedback=()=>{modal(`<h2>Feedback</h2><p class="muted" style="margin:0">Found a bug or have an idea? Tell us!</p>
 <div class="seg fbtype" style="justify-content:center"><button class="on" data-act="fbType" data-v="Bug">Bug</button><button data-act="fbType" data-v="Idea">Idea</button><button data-act="fbType" data-v="Other">Other</button></div>
 <textarea id="fbmsg" rows="5" maxlength="2000" placeholder="What happened?"></textarea>
 <input id="fbmail" type="email" maxlength="120" placeholder="Grown-up email (optional)"><p class="muted" style="margin:0">Only your message, type, and optional email will be sent.</p>
 <div class="rbtns"><button class="btn" data-act="fbSend">Send</button><button class="btn alt" data-act="close">Cancel</button></div>`);setTimeout(()=>$('#fbmsg')?.focus(),50)};
ACT.fbType=d=>{document.querySelectorAll('.fbtype button').forEach(b=>b.classList.toggle('on',b.dataset.v===d.v))};
ACT.fbSend=async()=>{const msg=($('#fbmsg')?.value||'').trim();if(msg.length<3){toast('Type a little more first!');return}
 const type=document.querySelector('.fbtype .on')?.dataset.v||'Other';
 const body=new URLSearchParams({'form-name':'feedback',type,message:msg,email:$('#fbmail')?.value||''}).toString();
 try{const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});if(!r.ok)throw 0;
  modal(`<h2>Thank you!</h2><p style="margin:0">Your message was sent.</p><div class="rbtns"><button class="btn" data-act="close">OK</button></div>`)}
 catch(e){toast('Could not send. Try again on the website.')}};
ACT.about=()=>{modal(`<h2>About</h2><div class="hero-mini">${zookSVG()}</div>
 <p style="margin:0;font-size:22px">KEYLORIA KINGDOM</p>
 <p style="margin:0">A typing adventure made by<br><b>Andy Tsang</b></p>
 <p style="margin:0">Vibecoded with help from <b>Claude</b> (Anthropic) and <b>ChatGPT</b> (OpenAI).</p>
 <p class="muted" style="margin:0">© ${Math.max(2026,new Date().getFullYear())} Andy Tsang. All rights reserved.</p>
 <div class="rbtns"><button class="btn" data-act="close">Close</button></div>`)};
addEventListener('keydown',e=>{if(e.target&&(e.target.id==='fbmsg'||e.target.id==='fbmail'))e.stopImmediatePropagation()},true);
let UID=0;function uniq(svg){const u='_'+(++UID);return svg.replace(/id="([^"]+)"/g,`id="$1${u}"`).replace(/url\(#([^)]+)\)/g,`url(#$1${u})`)}
[['zookSVG'],['creatureSVG'],['glitchSVG'],['sceneSVG'],['pathScene']].forEach(()=>{});
/* --- evolution progress panel (results) --- */
function evoPanel(i,pts,f,nxt){const sp=SPECIES[i],p0=Math.min(P.pts0??pts,pts),gain=pts-p0;
 if(!nxt)return masteryPanel(i,pts,p0,gain);
 const base=EVO_PTS[f],span=nxt-base,w0=Math.max(0,Math.round((Math.max(p0,base)-base)/span*100)),w1=Math.round((pts-base)/span*100),left=nxt-pts;
 const miss=[];for(let s=0;s<NST;s++){const b=S.best[i+'-'+s]||0;if(b<3)miss.push({s,b})}
 const tip=miss.length?miss.slice(0,3).map(m=>`<span class="ev-lv">${STAGES8[m.s]} ${'★'.repeat(m.b)}${'☆'.repeat(3-m.b)}</span>`).join(''):'';
 return `<div class="evobar evo2"><div class="ev-top"><b>${sp.n[f]}</b><span class="ev-next">${creatureSVG(i,f+1,'fit sil')}<em>???</em></span></div>
 <div class="eb ev-eb"><i class="ev-old" style="width:${w0}%"></i><i class="ev-new" style="left:${w0}%;width:0%" data-w="${Math.max(0,w1-w0)}"></i></div>
 <div class="ev-msg">${gain>0?`<b class="ev-gain">+${gain} star${gain>1?'s':''} of power!</b> `:''}${left} more star${left>1?'s':''} to evolve!</div>
 ${gain>0?'':`<div class="ev-tip">${miss.length?'Beat your best stars on:':'Earn more stars to evolve!'} ${tip}</div>`}</div>`}
const _ss50=startStage;startStage=function(n,mode){const i=Math.floor(n/NST);P.pts0=undefined;const r=_ss50.apply(this,arguments);try{if(LESSONS[i])P.pts0=lessonPts(i)}catch(e){}return r};
const _res50=results;results=function(r){_res50(r);const nw=document.querySelector('#mbox .ev-new');if(nw)setTimeout(()=>{nw.style.width=nw.dataset.w+'%';if(+nw.dataset.w>0&&sfx.ok)[0,1,2].forEach(k=>setTimeout(()=>tone&&tone(500+k*150,.08,'square',.05),k*120))},500)};
/* --- mastery track after full evolution --- */
const MAST_PTS=NST*3,MAST_GEMS=10;
function masteryPanel(i,pts,p0,gain){const sp=SPECIES[i],m=(S.mast||{})[i],w0=Math.round(Math.max(p0,16)/MAST_PTS*100),w1=Math.round(pts/MAST_PTS*100),left=MAST_PTS-pts;
 const holo=[0,1,2].map(f=>{const c=S.cards[i+'-'+f],got=c&&c.holo,need=BAND[f].filter(s=>(S.best[i+'-'+s]||0)<3).length;
  return `<span class="ms-h ${got?'got':''}">${creatureSVG(i,f,'fit big')}<small>${got?'HOLO ✓':need+' to holo'}</small></span>`}).join('');
 const miss=[];for(let s=0;s<NST;s++){const b=S.best[i+'-'+s]||0;if(b<3)miss.push(`<span class="ev-lv">${STAGES8[s]} ${'★'.repeat(b)}${'☆'.repeat(3-b)}</span>`)}
 if(m)return `<div class="evobar evo2 mast"><div class="ev-top"><b>${sp.n[2]}</b><span class="ms-crown">♛ MASTERED</span></div><div class="ms-holo">${holo}</div></div>`;
 return `<div class="evobar evo2 mast"><div class="ev-top"><b>${sp.n[2]} · Mastery</b><span>${pts} / ${MAST_PTS}</span></div>
 <div class="eb ev-eb"><i class="ev-old" style="width:${w0}%"></i><i class="ev-new" style="left:${w0}%;width:0%" data-w="${Math.max(0,w1-w0)}"></i></div>
 <div class="ev-msg">${gain>0?`<b class="ev-gain">+${gain} mastery star${gain>1?'s':''}!</b> `:''}${left} more to master ${sp.n[2]} and win <b class="ms-g">${MAST_GEMS} diamonds</b> + a crown!</div>
 <div class="ms-holo">${holo}</div>${gain>0?'':`<div class="ev-tip">Get 3 stars on: ${miss.slice(0,3).join('')}</div>`}</div>`}
const _res51=results;results=function(r){if(r&&r.pass&&!P.practice&&!r._ms){const i=P.fi;if(SPECIES[i]&&lessonPts(i)>=MAST_PTS&&!(S.mast||{})[i]){r._ms=1;S.mast=S.mast||{};S.mast[i]=1;S.gems+=MAST_GEMS;save();r._newMast=1}}
 _res51(r);if(r&&r._newMast){const b=document.querySelector('#mbox .bigstars');b&&b.insertAdjacentHTML('afterend',`<div class="banner gold">♛ ${SPECIES[P.fi].n[2]} MASTERED! +${MAST_GEMS} diamonds</div>`);sfx.win&&sfx.win()}};
/* results: Next is gold, goes first, and is the Enter/Space default */
const _res53=results;results=function(r){_res53(r);const rb=document.querySelector('#mbox .rbtns');if(!rb)return;
 const nx=[...rb.querySelectorAll('.btn')].find(b=>/next/i.test(b.textContent));if(nx){nx.classList.remove('alt','coral');nx.classList.add('nextbtn');rb.prepend(nx)}};
/* --- lucky item: gift tile beside the card, tap to put it on --- */
const _res54=results;results=function(r){const L=r&&r.lucky,i=P.fi;let stash=null;
 if(L&&L.kind==='prop'&&!r._gave&&S.kv&&S.kv[i]&&S.kv[i].prop===L.prop){stash=L.prop;delete S.kv[i].prop}
 try{_res54(r)}finally{if(stash){S.kv[i].prop=stash}}
 const m=document.querySelector('#mbox');if(!m)return;
 // compact chips for small bonuses
 const chips=[...m.querySelectorAll('.banner.luck')];if(chips.length){const row=document.createElement('div');row.className='chiprow';chips.forEach(c=>{c.className='rchip';row.appendChild(c)});m.querySelector('.bigstars')?.after(row)}
 if(stash&&!r._gave){const fl=m.querySelector('#flip');if(!fl)return;const pr=PROPS[stash],u=PXG(pr.r,pr.p).toDataURL();
  const wrap=document.createElement('div');wrap.className='cardrow';fl.before(wrap);wrap.appendChild(fl);
  wrap.insertAdjacentHTML('beforeend',`<button class="gift" data-act="giveProp" aria-label="Give ${esc(pr.n)}"><b>Found!</b><img src="${u}" alt=""><span>${esc(pr.n)}</span><em>Tap to give</em></button>`);
  r._gave=1}};
ACT.giveProp=()=>{const g=document.querySelector('#mbox .gift'),fl=document.querySelector('#mbox #flip');if(!g||!fl||g.classList.contains('done'))return;
 const img=g.querySelector('img'),a=img.getBoundingClientRect(),b=fl.querySelector('.c-art')?.getBoundingClientRect()||fl.getBoundingClientRect();
 const f=img.cloneNode();f.className='giftfly';f.style.cssText=`left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px`;document.body.appendChild(f);
 requestAnimationFrame(()=>{f.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height*.3-a.top-a.height/2}px) scale(.6)`});
 tone&&tone(660,.08,'square',.05);
 setTimeout(()=>{f.remove();const cw=fl.querySelector('.cw:not(.bk)');if(cw)cw.outerHTML=cardHTML(P.fi,P.ff,S.cards[P.fi+'-'+P.ff]||{});fl.classList.remove('goholo');void fl.offsetWidth;fl.classList.add('gave');
  g.classList.add('done');g.querySelector('em').textContent='Wearing it!';sfx.win&&sfx.win()},600)};
/* --- lesson splash: blinking LESSON N + short summary --- */
const LSUM={caps:'Shift for capital letters',sent:'Type your first full sentences',num:'Reach up to the numbers',master:'Every key, all together',long:'Longer words, steady fingers',names:'Names with capital letters',punct:'Periods, commas and question marks',speedy:'Go fast, stay accurate',story:'Type a whole forest story',numw:'Numbers mixed with words',symb:'Find the tricky symbols',quote:'Quotes and talking words',tricky:'Tricky spellings to master',summit:'The big mountain challenge',
 c_top:'The most common words',c_pairs:'Two words at a time',c_caps:'Start sentences with capitals',c_sea:'Ocean words, smooth typing',c_tide:'Short sentences by the sea',c_reef:'Race through reef facts',
 d_comma:'Pause with commas',d_ask:'Question marks and exclamations',d_apos:"Apostrophes: it's and don't",d_talk:'Quotes for talking characters',d_colon:'Colons and semicolons',d_dash:'Dashes and brackets',
 f_row:'Master the number row',f_count:'Counting with words',f_money:'Prices with dollar signs',f_time:'Times and dates',f_math:'Type math facts',f_big:'Big numbers with commas',
 g_at:'@ and # symbols',g_star:'& * + = symbols',g_brack:'Round and square brackets',g_slash:'Slashes, dashes, underscores',g_mail:'Use @ in sentences',g_web:'Dots and slashes in numbers',
 e_double:'Words with double letters',e_silent:'Words with silent letters',e_tion:'Endings: -tion and -sion',e_homo:'Words that sound alike',e_fix:'Prefixes and suffixes',e_giant:'Giant words, letter by letter',
 s_fable:'Type classic fables',s_fact:'Type fun science facts',s_poem:'Type rhyming lines',s_letter:'Write little letters',s_twist:'Tongue twisters for fingers',s_saga:'An epic sky story',
 l_sprint:'Every letter, full speed',l_perfect:'No mistakes allowed',l_mix:'Letters, numbers and symbols',l_code:'Type real code lines',l_epic:'The epic final tale',l_final:'Become a Keyboard Legend'};
function lessonSummary(i){const L=LESSONS[i];if(LSUM[L.sp])return LSUM[L.sp];if(L.k){const ks=[...L.k].map(c=>c==='.'?'period':c===','?'comma':c===';'?'semicolon':c.toUpperCase());return 'New keys: '+(ks.length>1?ks.slice(0,-1).join(', ')+' and '+ks[ks.length-1]:ks[0])}return lessonTitle(i)}
let SPLASH=null;
function lessonSplash(i){const pl=document.getElementById('s-play');if(!pl)return;document.getElementById('lsplash')?.remove();
 const el=document.createElement('div');el.id='lsplash';el.innerHTML=`<div class="ls-box"><div class="ls-world">${esc(REGIONS[LESSONS[i].r]?.name||'')}</div><div class="ls-num">LESSON ${typeof LNUM==='function'?LNUM(i):i+1}</div><div class="ls-title">${esc(lessonTitle(i))}</div><div class="ls-sum">${esc(lessonSummary(i))}</div><div class="ls-go">Press SPACE to start</div></div>`;
 pl.appendChild(el);SPLASH=el;[523,659,784,1047].forEach((f,k)=>setTimeout(()=>tone&&tone(f,.12,'square',.06),k*110));
 const done=()=>{if(SPLASH!==el)return;SPLASH=null;el.classList.add('out');setTimeout(()=>el.remove(),300)};el.addEventListener('click',done);el._done=done;setTimeout(()=>el.classList.add('ready'),700);setTimeout(done,6000)}
addEventListener('keydown',e=>{if(!SPLASH)return;e.preventDefault();e.stopImmediatePropagation();if((e.key===' '||e.key==='Enter')&&SPLASH.classList.contains('ready'))SPLASH._done()},true);
const _ss55=startStage;startStage=function(n,mode){const r=_ss55.apply(this,arguments);try{const i=Math.floor(n/NST);
 if(!mode&&LESSONS[i]&&(n%NST===0||S.lastLesson!==i))lessonSplash(i);if(!mode&&LESSONS[i]){S.lastLesson=i}}catch(e){}return r};
/* arcade button on results */
const _res55=results;results=function(r){_res55(r);const rb=document.querySelector('#mbox .rbtns');if(rb&&document.querySelector('#mbox .bigstars')&&!rb.querySelector('[data-to=arcade]')){const m=rb.querySelector('[data-to=map]');(m||rb.lastElementChild).insertAdjacentHTML('afterend','<button class="btn" data-act="go" data-to="arcade">Arcade</button>')}
 if(rb&&document.querySelector('#mbox .bigstars')&&!rb.querySelector('[data-to=home]')){rb.insertAdjacentHTML('beforeend','<button class="btn" data-act="go" data-to="home">Main Menu</button>');
  const cp=rb.querySelector('[data-act=copyRun]');if(cp)rb.appendChild(cp)}};
/* --- world header terrain silhouette (no sky), rises from the bar bottom --- */
const TERR=[{kind:'hills',deco:'tree'},{kind:'hills',deco:'pine'},{kind:'peaks',deco:'snow'},{kind:'flat',deco:'palm'},{kind:'dunes',deco:'cactus'},{kind:'peaks',deco:'snowall'},{kind:'hills',deco:'shroom'},{kind:'city',deco:'gear'},{kind:'clouds',deco:'cloud'},{kind:'peaks',deco:'crystal'}];
function terrainCanvas(w){const T=TERR[w%TERR.length],G=GLOBE[w%GLOBE.length],W=180,H=44,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),rnd=prng(w*331+7);
 const px=(x,y,col)=>{if(x>=0&&y>=0&&x<W&&y<H){g.fillStyle=col;g.fillRect(x,y,1,1)}};
 const ph=[rnd()*6,rnd()*6,rnd()*6];
 const prof=(x,layer)=>{const t=x/W,ramp=Math.min(1,Math.max(0,(t-.02)/.55));const amp=T.kind==='peaks'?30:T.kind==='dunes'?14:T.kind==='flat'?12:T.kind==='city'?10:T.kind==='clouds'?12:18;
  let n=Math.sin(x*.045+ph[0]+layer)*.5+Math.sin(x*.11+ph[1]+layer*2)*.3+Math.sin(x*.023+ph[2])*.4;
  if(T.kind==='peaks')n=1-Math.abs(Math.sin(x*.05+ph[0]+layer*1.7))+Math.sin(x*.17+ph[1])*.15;
  if(T.kind==='city')n=Math.floor((Math.sin(Math.floor(x/9)*2.3+ph[0]+layer)+1)*2)/4;
  const base=ramp*((layer?amp*.8+8:amp)*(0.6+0.4*n)+2);return Math.round(H-base)};
 const back=shadeHex(G.land,-.35),front=G.land,hi=G.l2,edge=shadeHex(G.land,-.55);
 // back layer
 for(let x=0;x<W;x++){const top=prof(x,1);for(let y=top;y<H;y++)px(x,y,back)}
 // front layer with lit edge
 const tops=[];for(let x=0;x<W;x++){const top=prof(x,0);tops.push(top);for(let y=top;y<H;y++)px(x,y,y===top?hi:(y>H-6?shadeHex(front,-.18):front))}
 // decorations
 const snow=y=>T.deco==='snowall'||(T.deco==='snow'&&y<H-24);
 for(let x=0;x<W;x++){const y=tops[x];if(snow(y))for(let k=0;k<2;k++)px(x,y+k,'#eef4fa')}
 const sprite=(x,rows,pal)=>{const y0=tops[x]-rows.length+1;rows.forEach((r,yy)=>[...r].forEach((ch,xx)=>{if(pal[ch])px(x-Math.floor(r.length/2)+xx,y0+yy,pal[ch])}))};
 const D={tree:[[' gg ','gggg','gGGg',' tt ',' tt '],{g:shadeHex(G.l2,-.1),G:shadeHex(G.land,-.3),t:'#6a4a34'}],
  pine:[['  g  ',' ggg ',' gGg ','ggggg','  t  '],{g:'#2f6a3e',G:'#1f4a2e',t:'#5a3a2a'}],
  palm:[['gg gg',' gtg ','  t  ','  t  ','  t  '],{g:'#4a9a52',t:'#8a6a44'}],
  cactus:[[' c ','cc c','c cc',' c ',' c '],{c:'#4a8a4a'}],
  shroom:[[' rrr ','rrwrr','  s  ','  s  '],{r:'#c86a5a',w:'#fff2e0',s:'#e8dcc8'}],
  gear:[['y y y',' yyy ','yy yy',' yyy ','y y y'],{y:'#f0c860'}],
  cloud:[[' ww  ','wwwww'],{w:'#ffffff'}],
  crystal:[[' c ',' c ','cCc','cCc'],{c:'#c8a8f0',C:'#8a6ad8'}],snow:null,snowall:null};
 const d=D[T.deco];if(d){for(let x=W*.35|0;x<W-4;x+=8+Math.floor(rnd()*14)){if(rnd()<.75)sprite(x,d[0],d[1])}}
 if(T.kind==='flat'){for(let x=0;x<W;x++)for(let y=H-3;y<H;y++)if((x+y)%7===0)px(x,y,'#7fc8e0')}
 return c}
/* after joining a family, switch away from a blank new player to the family's players */
const _sp56=syncPull;syncPull=async function(){await _sp56.apply(this,arguments);try{
 const blank=d=>!d.name&&!(d.xp>0)&&!Object.keys(d.best||{}).length;if(!blank(S))return;
 const others=PROF.list.filter(id=>id!==PROF.cur).map(id=>({id,d:peek(id)})).filter(o=>o.d.name);if(!others.length)return;
 others.sort((a,b)=>(b.d.upd||0)-(a.d.upd||0));const dead=PROF.cur;PROF.list=PROF.list.filter(id=>id!==dead);PROF.cur=others[0].id;
 try{localStorage.setItem(PKEY,JSON.stringify(PROF));localStorage.removeItem(pkey(dead))}catch(e){}load();closeModal();show('home');toast(`Welcome back, ${S.name}!`);
 if(others.length>1)setTimeout(()=>ACT.players&&ACT.players(),900)}catch(e){}};
function fitNames(root){(root||document).querySelectorAll('.sprtile small').forEach(el=>{el.style.fontSize='';let f=parseFloat(getComputedStyle(el).fontSize)||13;let n=0;while(el.scrollWidth>el.clientWidth+1&&f>7&&n++<20){f-=.5;el.style.setProperty('font-size',f+'px','important')}})}
const _rb50=renderBinder;renderBinder=function(){const r=_rb50.apply(this,arguments);requestAnimationFrame(()=>fitNames());return r};
addEventListener('resize',()=>{if(document.querySelector('.sprtile'))fitNames()});
/* ================= V52: world globes + new meteor ================= */
if(typeof shadeHex==='undefined')window.shadeHex=function(h,a){const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return '#'+((1<<24)|(f(n>>16)<<16)|(f(n>>8&255)<<8)|f(n&255)).toString(16).slice(1)};
function prng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%10000)/10000}}
/* sea/land palettes per world: [sea, land, land2, special] */
const GLOBE=[
 {sea:'#3f74a8',land:'#5aa64a',l2:'#8ac85a',ice:1},            // 1 Keyloria meadows
 {sea:'#2f5f78',land:'#2f7a46',l2:'#4a9a52',dots:'#1f5a36'},   // 2 forest
 {sea:'#46628a',land:'#7a6e5e',l2:'#9a8e7a',peaks:'#eef0f6'},  // 3 mountains
 {sea:'#2f8ab0',land:'#d8c08a',l2:'#e8d6a4',reef:'#e08a6a'},   // 4 coral coast
 {sea:'#b88a4a',land:'#e0b060',l2:'#f0cc80',dune:'#a0703a',dry:1}, // 5 desert
 {sea:'#6a9ac0',land:'#dfe8f2',l2:'#ffffff',ice:2},            // 6 tundra
 {sea:'#3a5a48',land:'#6a8a3a',l2:'#8aa84a',dots:'#c8e06a'},   // 7 swamp
 {sea:'#4a4a62',land:'#8a7a5a',l2:'#c8a050',grid:'#f0c860'},   // 8 clockwork
 {sea:'#7aa8e0',land:'#f0f4fa',l2:'#ffffff',cloud:1},          // 9 sky
 {sea:'#3a2a6a',land:'#6a4ab0',l2:'#9a7ad8',ring:'#f0c860',stars:1}]; // 10 cosmos
function globeCanvas(w){const G=GLOBE[w%GLOBE.length],N=28,R=11.5,cx=13.5,cy=13.5,c=document.createElement('canvas');c.width=N;c.height=N;const g=c.getContext('2d'),rnd=prng(w*977+13);
 const px=(x,y,col)=>{g.fillStyle=col;g.fillRect(x,y,1,1)};
 // continent blobs
 const blobs=[];for(let k=0;k<(G.dry?4:6);k++){const a=rnd()*6.283,r=rnd()*8;blobs.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r,3.5+rnd()*3.5])}
 const land=(x,y)=>{let v=0;blobs.forEach(([bx,by,br])=>{const d=Math.hypot(x-bx,y-by);if(d<br)v+=1-d/br});return v};
 if(G.ring){g.fillStyle=shadeHex(G.ring,-.25);for(let x=0;x<N;x++){const y=Math.round(cy+ (x-cx)*0.28+1);if(Math.abs(x-cx)>R-1)px(x,y,G.ring),px(x,y+1,shadeHex(G.ring,-.35))}}
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const dx=x+.5-cx,dy=y+.5-cy,d=Math.hypot(dx,dy);if(d>R)continue;
  if(d>R-1.1){px(x,y,'#1b1626');continue}
  const ld=Math.hypot(x+.5-9,y+.5-8)/(2*R),shade=ld<.22?.24:ld<.5?0:ld<.7?-.2:-.4;
  let col=G.sea;const v=land(x,y);
  if(G.dry)col=v>.25?G.l2:v>0?G.land:G.sea;else if(v>.55)col=G.l2;else if(v>.15)col=G.land;
  if(G.ice&&(y<4+G.ice||y>N-5-G.ice))col='#eef4fa';
  if(G.peaks&&v>1.35)col=G.peaks;else if(G.peaks&&v>.4&&(x+y)%5===0)col=shadeHex(G.land,-.3);
  if(G.dots&&v>.15&&(x*7+y*3)%9===0)col=G.dots;
  if(G.reef&&v>0.05&&v<.18)col=G.reef;
  if(G.dune&&v>.1&&(x+y*2)%6===0)col=G.dune;
  if(G.grid&&v>.15&&(x%4===0||y%4===0))col=G.grid;
  if(G.cloud&&v>.15)col=v>.5?'#ffffff':'#d8e4f4';
  px(x,y,shadeHex(col,shade))}
 // cloud streaks (most worlds)
 if(!G.dry&&!G.cloud){for(let k=0;k<3;k++){const y=Math.round(6+rnd()*15),x0=Math.round(5+rnd()*12),L=3+Math.round(rnd()*4);for(let x=x0;x<x0+L;x++){const d=Math.hypot(x+.5-cx,y+.5-cy);if(d<R-1.5)px(x,y,'rgba(255,255,255,.75)')}}}
 if(G.ring){for(let x=0;x<N;x++){const y=Math.round(cy+(x-cx)*0.28+1);if(Math.abs(x-cx)<=R-1&&y>cy-2)px(x,y,G.ring),px(x,y+1,shadeHex(G.ring,-.35))}}
 // highlight
 px(8,7,'rgba(255,255,255,.85)');px(9,7,'rgba(255,255,255,.55)');px(8,8,'rgba(255,255,255,.55)');
 if(G.stars){[[2,3],[24,5],[3,23],[25,22]].forEach(([x,y])=>{px(x,y,'#f0c860')})}
 return c}
const globeURL=w=>kku('globe'+w,()=>globeCanvas(w));
function globeImg(w,cls=''){return `<img class="globe ${cls}" src="${globeURL(w)}" alt="">`}
/* world headers get a globe + picker row on top of the map */
const _rm52=renderMap;renderMap=function(){const r=_rm52.apply(this,arguments);const root=$('#s-map');if(!root)return r;
 const heads=[...root.querySelectorAll('.worldhead')];heads.forEach((h,k)=>{if(!h.querySelector('.globe')){h.insertAdjacentHTML('afterbegin',globeImg(k));h.classList.add('hasglobe');h.id='world-'+(k+1);
  try{h.insertAdjacentHTML('beforeend',`<img class="wh-land" src="${kku('terr'+k,()=>terrainCanvas(k))}" alt="">`)}catch(e){}}});
 const cur=worldOf(Math.floor(nextStage()/8));
 if(!root.querySelector('.wpick')){const tb=root.querySelector('.topbar');tb&&tb.insertAdjacentHTML('afterend',`<div class="wpick">${WORLDS.map((W,k)=>{const open=k<heads.length&&!heads[k].classList.contains('shut');
  return `<button class="wp ${open?'':'lockd'} ${k+1===cur?'cur':''}" ${open?`data-act="gotoWorld" data-w="${k+1}"`:'disabled'} title="${open?esc(W.name):'Locked'}">${globeImg(k)}<small>${open?esc(W.name):'???'}</small></button>`}).join('')}</div>`)}
 return r};
ACT.gotoWorld=d=>{const el=document.getElementById('world-'+d.w);if(!el)return;const root=$('#s-map'),tb=root&&root.querySelector('.topbar'),wp=root&&root.querySelector('.wpick');
 const off=(tb?tb.getBoundingClientRect().height:0)+(wp?wp.getBoundingClientRect().height:0)+12;scrollTo({top:el.getBoundingClientRect().top+scrollY-off,behavior:'smooth'})};
/* ---- new meteor: craggy rock + 2-frame flame trail ---- */
function meteorSheet(){const FW=24,FH=36,c=document.createElement('canvas');c.width=FW*2;c.height=FH;const g=c.getContext('2d');
 const P={o:'#1e1218',H:'#e8c8a0',L:'#c09468',B:'#946a4a',D:'#6a4a44',K:'#4a3440',hot:'#ffe08a',hot2:'#f0903a'};
 for(let f=0;f<2;f++){const ox=f*FW,rnd=prng(7+f*31),px=(x,y,col)=>{g.fillStyle=col;g.fillRect(ox+x,y,1,1)};
  // flame trail (upward), tapered, flickers
  for(let y=0;y<20;y++){const t=y/20,half=Math.max(1,Math.round(1+t*8+(rnd()-.5)*2));for(let x=12-half;x<12+half;x++){const e=Math.abs(x+.5-12)/Math.max(1,half);
   const col=e<.35&&t>.45?'#fff2b0':e<.65?(t>.3?'#f0c860':'#e8a040'):(t>.5?'#e8783a':'#b8482a');if(rnd()<.04+(1-t)*.42)continue;px(x,y+2,col)}}
  // sparks
  for(let k=0;k<4;k++)px(Math.round(4+rnd()*16),Math.round(rnd()*12),rnd()<.5?'#fff2b0':'#f0c860');
  // rock (irregular circle)
  const cx=12,cy=25,R=9.5;for(let y=14;y<FH;y++)for(let x=0;x<FW;x++){const a=Math.atan2(y-cy,x-cx),rr=R+Math.sin(a*3+1)*0.9+Math.cos(a*5)*0.6,d=Math.hypot(x+.5-cx,y+.5-cy);if(d>rr)continue;
   let col;if(d>rr-1)col=P.o;else{const lit=(-(x-cx)*.5+(y-cy)*.85)/R;col=lit>.5?P.hot:lit>.25?P.hot2:lit>-.1?P.L:lit>-.5?P.B:P.D;if(d<rr-1&&(x-cx)<-4&&(y-cy)<-3)col=P.H}px(x,y,col)}
  // craters
  [[9,23,2],[15,27,1.6],[11,29,1.2]].forEach(([x0,y0,r])=>{for(let y=Math.floor(y0-r);y<=y0+r;y++)for(let x=Math.floor(x0-r);x<=x0+r;x++){const d=Math.hypot(x+.5-x0,y+.5-y0);if(d<r)px(x,y,d<r-.8?P.K:P.D)}px(Math.round(x0+r*.5),Math.round(y0+r*.6),P.H)})}
 return c}
const METEOR2=kku('meteor2',()=>meteorSheet());
document.head.insertAdjacentHTML('beforeend',`<style>.met .rock{background:none!important}
.met .mt{top:auto!important;bottom:-34px;transform:translateX(-50%)!important}
.met .rock::before{content:"";position:absolute;left:-14%;right:-14%;bottom:-8%;height:190%;background:url(${METEOR2}) 0 0/200% 100% no-repeat;image-rendering:pixelated;animation:metfl .24s steps(1) infinite}
@keyframes metfl{0%{background-position:0 0}50%{background-position:100% 0}}</style>`);
const METEOR1=kku('meteor1',()=>{const sh=meteorSheet(),c=document.createElement('canvas');c.width=24;c.height=36;c.getContext('2d').drawImage(sh,0,0);return c});
if(typeof meteorArt==='function')meteorArt=function(){return `<svg viewBox="0 0 40 40" style="image-rendering:pixelated"><image href="${METEOR1}" x="6" y="0" width="26" height="39"/></svg>`};
zookSVG=(f=>(...a)=>uniq(f(...a)))(zookSVG);creatureSVG=(f=>(...a)=>uniq(f(...a)))(creatureSVG);glitchSVG=(f=>(...a)=>uniq(f(...a)))(glitchSVG);sceneSVG=(f=>(...a)=>uniq(f(...a)))(sceneSVG);pathScene=(f=>(...a)=>uniq(f(...a)))(pathScene);
load();buildKB();initHands();show('home');
