import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const game = readFileSync(new URL('../public/game.js', import.meta.url), 'utf8');
const ghost = readFileSync(new URL('../public/ghost-race.js', import.meta.url), 'utf8');
const shareSource = game.slice(game.indexOf("let runShareText='"), game.indexOf('\nlet ARC_X=', game.indexOf("let runShareText='")));
const copySource = ghost.slice(ghost.indexOf('ACT.copyRun=async()=>{'), ghost.indexOf('\nfunction ghostInviteModal', ghost.indexOf('ACT.copyRun=async()=>{')));

test('only Arcade result links open ghost challenges', async () => {
 const copied = [];
 const posted = [];
 let won=false;
 const context = {
  G: {challengeData:{g:'meteor',v:2,r:100}},
  ACT: {},
  URL,
  location:{href:'https://keystone-kingdom.netlify.app/?old=1'},
  navigator:{clipboard:{writeText:async text=>copied.push(text)}},
  fetch:async (_url,options)=>{posted.push(JSON.parse(options.body));return {ok:true,json:async()=>({id:'ABC123'})}},
  $:()=>null,
  ghostRematchWon:()=>won,
  toast:()=>{}
 };
 runInNewContext(shareSource+'\n'+copySource+'\nglobalThis.share=shareRunHTML',context);

 context.share('Adventure','3 stars');
 await context.ACT.copyRun();
 assert.equal(posted.length,0);
 assert.match(copied.at(-1), /3 stars\nCome explore Keyloria Kingdom and try it yourself!\nhttps:\/\/keystone-kingdom\.netlify\.app\/$/);
 assert.doesNotMatch(copied.at(-1), /ghost|challenge/i);

 for(const [name,kind] of [['Meteor Zap','meteor'],['Scrambler Attack','glitch'],['Keylori Race','race']]){
  context.G={challengeData:{g:kind,v:2,r:100}};
  assert.match(context.share(name,'100 points'),/Challenge a friend/);
  await context.ACT.copyRun();
  assert.equal(posted.at(-1).g,kind);
  assert.match(copied.at(-1), /\?c=ABC123$/);
 }
 assert.equal(posted.length,3);
 won=true;
 context.G={challengeData:{g:'meteor',v:2,r:200}};
 assert.match(context.share('Meteor Zap','200 points'),/Send rematch challenge/);
 await context.ACT.copyRun();
 assert.match(copied.at(-1),/I beat your ghost! Can you beat mine\?/);
 assert.equal(posted.at(-1).r,200);
});
