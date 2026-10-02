/* Arcade typing options. Keep these separate from Adventure's lesson text. */
const ARCADE_NUMBERS='0123456789';
const ARCADE_SYMBOLS='!?@#$%&*+-=/';
const ARCADE_LEVELS={auto:[0,'Auto'],easy:[1,'Easy'],medium:[2,'Medium'],hard:[3,'Hard'],beast:[4,'BEAST MODE'],'beast-easy':[4,'BEAST MODE'],'beast-medium':[4,'BEAST MODE'],'beast-hard':[4,'BEAST MODE']};
const arcadeNumberOn=()=>S.set.arcNumbers===true;
const arcadeSymbolOn=()=>S.set.arcSymbols===true;
const arcadeLevelNow=()=>S.set.arcd||'auto';
const arcadeHighest=type=>{const lv=ARCADE_LEVELS[S.arc.high?.[type]];if(!lv)return 'None yet';const m=S.arc.highMod?.[type]||{};
 return lv[1]+(m.n||m.s?`<span class="arc-mods">${m.n?'<i>123</i>':''}${m.s?'<i>#?!</i>':''}</span>`:'')};
const arcadeStat=(label,value,cls='')=>`<div class="arcade-stat ${cls}"><b>${value}</b><span>${label}</span></div>`;
function arcadeRecordWin(type,won){
 if(!won)return;
 S.arc.high=S.arc.high||{};
 const level=G.arcLevel||arcadeLevelNow();
 S.arc.highMod=S.arc.highMod||{};
 const mod={n:arcadeNumberOn(),s:arcadeSymbolOn()},score=(lv,m)=>(ARCADE_LEVELS[lv]?.[0]??-1)*10+(m&&m.n?1:0)+(m&&m.s?1:0);
 if(!S.arc.high[type]||score(level,mod)>score(S.arc.high[type],S.arc.highMod[type])){S.arc.high[type]=level;S.arc.highMod[type]=mod}
}

function arcadeToken(value){
 return [...String(value).toLowerCase()].filter(ch=>/[a-z]/.test(ch)||arcadeNumberOn()&&ARCADE_NUMBERS.includes(ch)||arcadeSymbolOn()&&ARCADE_SYMBOLS.includes(ch)).join('');
}
function arcadePhrase(value,includeSelected=false){
 let text=String(value).replace(/\d/g,ch=>arcadeNumberOn()?ch:'').replace(/[^a-zA-Z0-9\s]/g,ch=>arcadeSymbolOn()?ch:'').replace(/\s+/g,' ').trim();
 if(includeSelected&&arcadeNumberOn()&&!/\d/.test(text))text+=' 7';
 if(includeSelected&&arcadeSymbolOn()&&!/[^a-zA-Z0-9\s]/.test(text))text+=' ?';
 return text;
}
/* keep a word only if the toggles don't change it (no 'wednesdaymorning' mash-ups) */
function arcadeWord(w){const t=arcadeToken(w);return(/\s/.test(String(w))||t!==String(w).toLowerCase())?'':t}
const BEAST_CLEAN=['Seven sleepy sloths quietly juggled glowing jellyfish.','Zany wizards fix broken clocks with quartz and rhythm.','The sphinx asked a quizzical question about the fjord.','Brave knights rarely kneel beside gnomes in the labyrinth.','Jovial pirates sketched a kaleidoscope of whirling galaxies.','A shy rhinoceros waltzed through the misty archipelago.','Twelve plucky penguins zigzagged across the frozen lake.','The colonel recited a mnemonic about the mysterious pharaoh.'];
function beastBossText(){const okS=s=>(arcadeNumberOn()||!/\d/.test(s))&&(arcadeSymbolOn()||![...ARCADE_SYMBOLS].some(c=>s.includes(c)));
 const pool=BEAST_SENT.concat(BEAST_CLEAN).filter(okS);return arcadePhrase(rand(pool.length?pool:BEAST_CLEAN),true)}
function arcadeBonus(index,interval){
 if(index%interval!==interval-1)return null;
 const pool=[...(arcadeNumberOn()?['7','3','9']:[]),...(arcadeSymbolOn()?['?','#','!']:[])];
 return pool.length?pool[Math.floor(index/interval)%pool.length]:null;
}
function arcadeKeys(){if(arcadeNumberOn()||arcadeSymbolOn())setAvail(new Set([...keyEls.keys()]),true);applyLabels()}

const _arcadeOptionsRender=renderArcade;
renderArcade=function(){
 _arcadeOptionsRender();
 const bar=$('#s-arcade .diffbar');if(!bar)return;
 const panels=[...document.querySelectorAll('#s-arcade .games .game')];
 const stats=[
  arcadeStat('Best score',S.arc.glitch)+arcadeStat('Wins',S.arc.gwin)+arcadeStat('Highest level beaten',arcadeHighest('glitch'),'level'),
  arcadeStat('Best score',S.arc.meteor)+arcadeStat('Wins',S.arc.mwin||0)+arcadeStat('Highest level beaten',arcadeHighest('meteor'),'level'),
  arcadeStat('Wins',S.arc.race)+arcadeStat('Best WPM',S.arc.raceBest||0)+arcadeStat('Highest level beaten',arcadeHighest('race'),'level')
 ];
 panels.forEach((panel,index)=>{panel.querySelector('.note')?.remove();panel.querySelector('[data-act]')?.insertAdjacentHTML('beforebegin',`<div class="arcade-stats">${stats[index]}</div>`)});
 bar.querySelector('.arcade-toggles').innerHTML=[['arcNumbers','NUMBERS'],['arcSymbols','SYMBOLS']].map(([key,label])=>{const on=S.set[key]===true;return `<button class="arcade-switch ${on?'on':''}" data-act="arcadeChars" data-key="${key}" role="switch" aria-label="${label} in arcade games" aria-checked="${on}"><span>${label}</span><span class="switch-track"><span class="switch-thumb"></span></span><span class="switch-state">${on?'ON':'OFF'}</span></button>`}).join('');
};
ACT.arcadeChars=d=>{if(!['arcNumbers','arcSymbols'].includes(d.key))return;S.set[d.key]=S.set[d.key]!==true;save();renderArcade()};

const _arcadeOptionsMeteor=startMeteor;
startMeteor=function(){
 _arcadeOptionsMeteor();
 G.arcLevel=arcadeLevelNow();
 G.set=G.set.map(arcadeWord).filter(Boolean);if(!G.set.length)G.set=['go'];
 if(G.words)G.words=G.words.map(arcadeWord).filter(Boolean);
 if(G.words&&!G.words.length)G.words=null;
 arcadeKeys();
};
const _arcadeOptionsGlitch=startGlitch;
startGlitch=function(){_arcadeOptionsGlitch();G.arcLevel=arcadeLevelNow();G.arcBonusCount=0;arcadeKeys()};
const _arcadeOptionsWord=gw;
gw=function(size){const bonus=arcadeBonus(G.arcBonusCount++,4);if(bonus)return bonus;for(let k=0;k<12;k++){const w=arcadeWord(_arcadeOptionsWord(size));if(w)return w}return arcadeToken(_arcadeOptionsWord(size))||'go'};
const _arcadeOptionsBoss=bossPhrase;
bossPhrase=function(){
 _arcadeOptionsBoss();
 const boss=G.boss;boss.txt=arcadePhrase(boss.txt,true);boss.lim=boss.txt.length*1.5/G.speed+4;
 paintLab(boss);gHint();
};
const _arcadeOptionsRace=startRace;
startRace=function(){
 _arcadeOptionsRace();
 G.arcLevel=arcadeLevelNow();
 G.text=arcadePhrase(G.text,true);
 $('#gstripIn').innerHTML=[...G.text].map(ch=>`<span class="${ch===' '?'sp':''}">${ch===' '?'·':esc(ch)}</span>`).join('');
 arcadeKeys();raceStrip();
};

const _arcadeOptionsEndMeteor=endMeteor;
endMeteor=function(){if(G.shields>0){S.arc.mwin=(S.arc.mwin||0)+1;arcadeRecordWin('meteor',true)}_arcadeOptionsEndMeteor()};
const _arcadeOptionsEndGlitch=endGlitch;
endGlitch=function(win){arcadeRecordWin('glitch',win);_arcadeOptionsEndGlitch(win)};
const _arcadeOptionsEndRace=endRace;
endRace=function(){
 const seconds=(performance.now()-G.start)/1000;
 const wpm=Math.round(G.text.length/5/Math.max(seconds/60,1/60));
 S.arc.raceBest=Math.max(S.arc.raceBest||0,wpm);
 arcadeRecordWin('race',G.racers.every(r=>!r.fin));
 _arcadeOptionsEndRace();
};
