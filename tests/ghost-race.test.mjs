import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/ghost-race.js', import.meta.url), 'utf8');

test('a copied race link carries a playable, timed replay', () => {
 const context = {
  TextEncoder, TextDecoder, URL, URLSearchParams, Uint8Array, atob, btoa,
  location: { search: '', href: 'https://keystone-kingdom.netlify.app/' },
  ACT: {}, G: {}, S: {set:{arcd:'medium',arcNumbers:false,arcSymbols:false,len:1}},
  performance: { now: () => 1000 },
  startRace() {}, rTick() {}, endRace() {},
  startMeteor() {}, startGlitch() {}, gameInput() {}, mTick() {}, gTick() {},
  endMeteor() {}, endGlitch() {}
 };
 runInNewContext(source + '\nglobalThis.ghostApi={ghostEncode,ghostDecode,ghostPosition,ghostScoreAt,ghostArcadeSummary}', context);
 const replay = { v: 1, t: 'race me', d: 'medium', a: 96, f: [[0,0],[4,20],[7,40]] };
 const code = context.ghostApi.ghostEncode(replay);
 const decoded = context.ghostApi.ghostDecode(code);
 assert.equal(decoded.t, replay.t);
 assert.equal(decoded.f.at(-1)[0], replay.t.length);
 assert.equal(context.ghostApi.ghostPosition(decoded.f, 30), 5.5);
 assert.equal(context.ghostApi.ghostDecode(code.slice(0, -2)), null);
 assert.equal(context.ghostApi.ghostScoreAt([[0,0],[100,10],[250,24]], 15), 100);
 context.G = {type:'meteor',score:250,shields:3,ghostStartTime:0,
  ghostTimeline:[[0,0],[250,8]],
  ghostInvite:{g:'meteor',r:300,w:false,f:[[0,0],[300,24]]}};
 context.endMeteor();
 assert.equal(context.G.challengeData.g, 'meteor');
 assert.equal(context.G.challengeData.f.at(-1)[0], 250);
 assert.match(context.ghostApi.ghostArcadeSummary(), /You beat/);
});
