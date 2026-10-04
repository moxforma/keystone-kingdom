import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/arcade-options.js', import.meta.url), 'utf8');

function arcade(set = {}) {
 const state = { S: { set, arc: { meteor: 0, glitch: 0, race: 0, gwin: 0 } }, G: {} };
 const strip = { innerHTML: '' };
 const context = {
  ...state, ACT: {}, keyEls: new Map(), performance: { now: () => 60000 },
  renderArcade() {}, startMeteor() { state.G = context.G = { set: ['a'], words: ['word'], shields: 2 }; },
  startGlitch() { state.G = context.G = { boss: {} }; },
  startRace() { state.G = context.G = { text: 'Run fast!', start: 1000, racers: [{ fin: 0 }, { fin: 0 }, { fin: 0 }] }; },
  endMeteor() {}, endGlitch() {}, endRace() {},
  gw: () => 'word', bossPhrase() { context.G.boss.txt = 'Boss 7!'; },
  $: selector => selector === '#gstripIn' ? strip : null,
  document: { querySelectorAll: () => [] }, setAvail() {}, applyLabels() {},
  raceStrip() {}, paintLab() {}, gHint() {}, esc: ch => ch, save() {},
 };
 runInNewContext(`${source}\nglobalThis.arcadeApi={arcadeToken,arcadePhrase,arcadeBonus,arcadeRecordWin,arcadeHighest};`, context);
 return { context, state, strip, api: context.arcadeApi };
}

test('arcade numbers and symbols stay off until selected', () => {
 const { api, state } = arcade();
 assert.equal(api.arcadeToken('a7#'), 'a');
 assert.equal(api.arcadePhrase('Run 7! Fast?'), 'Run Fast');
 assert.equal(api.arcadeBonus(4, 5), null);
 state.S.set.arcNumbers = true;
 assert.equal(api.arcadeToken('a7#'), 'a7');
 assert.match(api.arcadePhrase('Run fast', true), /7$/);
 state.S.set.arcSymbols = true;
 assert.equal(api.arcadeToken('a7#'), 'a7#');
 assert.match(api.arcadePhrase('Run fast', true), /7 \?$/);
 assert.equal(api.arcadeBonus(4, 5), '7');
});

test('each game remembers the hardest arcade difficulty it won', () => {
 const { api, state } = arcade({ arcd: 'hard' });
 state.G.arcLevel = 'hard';
 api.arcadeRecordWin('meteor', true);
 assert.equal(api.arcadeHighest('meteor'), 'Hard');
 state.G.arcLevel = 'easy';
 api.arcadeRecordWin('meteor', true);
 assert.equal(api.arcadeHighest('meteor'), 'Hard');
 state.G.arcLevel = 'beast-easy';
 api.arcadeRecordWin('meteor', true);
 assert.equal(api.arcadeHighest('meteor'), 'BEAST MODE');
 assert.equal(api.arcadeHighest('race'), 'None yet');
});

test('only wins raise the saved arcade level', () => {
 const { context, state, api } = arcade({ arcd: 'beast' });
 context.startMeteor();
 context.endMeteor();
 assert.equal(state.S.arc.mwin, 1);
 assert.equal(api.arcadeHighest('meteor'), 'BEAST MODE');
 context.startGlitch();
 context.endGlitch(false);
 assert.equal(api.arcadeHighest('glitch'), 'None yet');
 context.endGlitch(true);
 assert.equal(api.arcadeHighest('glitch'), 'BEAST MODE');
 context.startRace();
 state.G.racers[0].fin = 1;
 context.endRace();
 assert.equal(api.arcadeHighest('race'), 'None yet');
});

test('race text and meteor pool follow the saved choices', () => {
 const { context, state, strip } = arcade({ arcNumbers: true, arcSymbols: false });
 context.startMeteor();
 assert.equal(state.G.arcLevel, 'auto');
 assert.ok(state.G.set.every(token => !/[^a-z0-9]/.test(token)));
 context.startRace();
 assert.match(state.G.text, /7/);
 assert.doesNotMatch(state.G.text, /!/);
 assert.match(strip.innerHTML, />7<\/span>/);
});

test('page loads external styles and game scripts in order', () => {
 const html = readFileSync(new URL('../public/play/index.html', import.meta.url), 'utf8');
 const files = ['styles.css', 'pixel-art.js', 'game.js', 'arcade-options.js'];
 let last = -1;
 for (const file of files) {
  const next = html.indexOf(file);
  assert.ok(next > last, `${file} is missing or out of order`);
  last = next;
 }
 assert.doesNotMatch(html, /<style>|<script>\s*const PX/);
});
