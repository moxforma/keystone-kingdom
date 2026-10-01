import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/game.js', import.meta.url), 'utf8');
const start = source.indexOf('function glitchProgress(){');
const end = source.indexOf('\nlet trkHero=', start);
const progressSource = source.slice(start, end);

test('Scrambler wave bar advances after every completed target word', () => {
 const G = {waves:3,wave:1,waveWordsTyped:0,waveWordsTotal:6,hearts:5,boss:null};
 const context = { G };
 runInNewContext(progressSource + '\nglobalThis.progress=glitchProgress', context);
 const before = context.progress();
 G.waveWordsTyped = 1;
 const one = context.progress();
 G.waveWordsTyped = 2;
 const two = context.progress();
 assert.equal(before.fraction, 0);
 assert.ok(one.fraction > before.fraction);
 assert.ok(two.fraction > one.fraction);
 assert.equal(two.label, 'Wave 1 · 2/6');
 G.wave = 2; G.waveWordsTyped = 0;
 assert.ok(context.progress().fraction > two.fraction);
 G.boss = {hp:3,txt:'type these words',typed:0}; G.wave=3;
 assert.equal(context.progress().fraction, .75);
 G.boss.typed=5;
 const afterWord=context.progress();
 assert.ok(afterWord.fraction > .75);
 assert.equal(context.progress().label,'Boss · 1/3 words');
 G.boss.typed=0;
 assert.equal(context.progress().fraction,afterWord.fraction);
 G.boss.hp=2;
 assert.ok(context.progress().fraction > .75);
});
