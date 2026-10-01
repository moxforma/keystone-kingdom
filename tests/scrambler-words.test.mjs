import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source=readFileSync(new URL('../public/game.js',import.meta.url),'utf8');
const tick=source.slice(source.indexOf('function gTick(now){'),source.indexOf('\nfunction gAttack(e)',source.indexOf('function gTick(now){')));

test('Scrambler waits until an existing word with the same first letter is gone',()=>{
 const active={kind:'bad',txt:'cat',z:0,v:0,dead:false};
 const G={type:'glitch',done:false,last:0,phase:'wave',wave:1,waves:3,spawnT:-1,
  queue:[{kind:'bad',size:'s',txt:'car'}],ents:[active],speed:1,hearts:5,boss:null};
 const context={G,$:()=>({clientWidth:600,clientHeight:400}),requestAnimationFrame:()=>1,
  spawnEnt:sp=>{G.ents.push({...sp,dead:false,z:0,v:0});return sp},
  gHint(){},placeEnt(){},nextWave(){},startBoss(){},endGlitch(){},gAttack(){},removeEnt(){}};
 runInNewContext(tick+'\nglobalThis.tick=gTick',context);
 context.tick(16);
 assert.equal(G.queue.length,1);
 assert.equal(G.ents.length,1);
 G.ents=[];
 context.tick(32);
 assert.equal(G.queue.length,0);
 assert.equal(G.ents[0].txt,'car');
});
