import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source=readFileSync(new URL('../public/ghost-race.js',import.meta.url),'utf8');

test('Meteor and Scrambler challenges use the sender’s complete word scripts',()=>{
 const context={TextEncoder,TextDecoder,URL,URLSearchParams,Uint8Array,atob,btoa,
  location:{search:'',href:'https://keystone-kingdom.netlify.app/'},LOGO_URL:'logo',
  ACT:{},S:{set:{arcd:'medium',arcNumbers:false,arcSymbols:false,len:1}},G:{},
  performance:{now:()=>1000},
  $:()=>({remove(){},insertAdjacentHTML(){}}),
  arcadeBonus:()=>null,rand:list=>list[0],gw:size=>({s:'cat',m:'tree',l:'stone'})[size],
  SENT:['a simple boss phrase'],arcadePhrase:text=>text,
  glitchProgress:()=>({fraction:0,wave:1,done:0,total:6}),
  startMeteor(){context.G={type:'meteor',set:['a','b'],words:['cat','dog'],total:6}},
  startGlitch(){context.G={type:'glitch',i:16,ok:[],letters:['a'],beast:false,
   queue:[{kind:'bad',size:'s'},{kind:'friend',size:'m'}]}},
  startRace(){},bossPhrase(){},gameInput(){},mTick(){},gTick(){},rTick(){},
  endMeteor(){},endGlitch(){},endRace(){},paintLab(){},gHint(){},
  setTrk(){},trackerHTML(){return ''},zookSVG(){return ''},
  closeModal(){},save(){},setAvail(){},applyLabels(){},keyEls:new Map(),
  requestAnimationFrame(){return 1}
 };
 runInNewContext(source+'\nglobalThis.setInvite=value=>ghostToStart=value',context);
 context.startMeteor();
 const meteorWords=Array.from(context.G.wordDeck);
 assert.equal(meteorWords.length,6);
 context.setInvite({g:'meteor',q:meteorWords,m:true});
 context.startMeteor();
 assert.deepEqual(Array.from(context.G.wordDeck),meteorWords);
 assert.equal(context.G.total,6);

 context.setInvite(null);
 context.startGlitch();
 const waves=context.G.waveDecks.map(wave=>wave.map(sp=>[sp.kind,sp.size,sp.txt]));
 const bossWords=Array.from(context.G.bossWords);
 assert.equal(waves.length,3);
 assert.equal(bossWords.length,10);
 context.setInvite({g:'glitch',q:waves,b:bossWords});
 context.startGlitch();
 assert.deepEqual(context.G.waveDecks.map(wave=>wave.map(sp=>[sp.kind,sp.size,sp.txt])),waves);
 assert.deepEqual(Array.from(context.G.bossWords),bossWords);
 context.G.boss={};context.bossPhrase();
 assert.equal(context.G.boss.txt,bossWords[0]);
});
