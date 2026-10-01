import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/game.js', import.meta.url), 'utf8');
const evolution = source.indexOf('/* --- finish with points evolution --- */');
const finishSource = source.slice(source.indexOf('function finish(){', evolution), source.indexOf('const _res8=results', evolution));
const resultsSource = source.slice(source.indexOf('function results(r){'), source.indexOf('const ACT={'));

function playRound(scores, stage, tier = null) {
  const best = Object.fromEntries(scores.map((score, index) => ['0-' + index, score]));
  const points = () => Object.values(best).reduce((sum, score) => sum + score, 0);
  const currentForm = () => points() >= 16 ? 2 : points() >= 8 ? 1 : 0;
  const cards = { '0-0': { holo: [0, 1, 2].every(i => scores[i] === 3) },
    '0-1': { holo: [3, 4, 5].every(i => scores[i] === 3) }, '0-2': { holo: false } };
  const S = { best, cards, badges: [], xp: 0, gems: 0, hist: [], time: 0, rounds: 0 };
  const P = { text: 'type the comet words', mist: new Set(), start: 1, mode: 'story', practice: false,
    i: 0, fi: 0, ff: currentForm(), s: stage, n: stage, tier, phase: 'play', idle: null };
  let result;
  const context = {
    S, P, sessionSecs: 0, performance: { now: () => 60001 }, clearInterval() {}, setTarget() {},
    setTimeout(callback, delay) { if (delay >= 900) callback(); },
    levelOf: () => 1, sk: (i, s) => `${i}-${s}`, formNow: currentForm,
    better: (candidate, existing) => candidate !== existing,
    BAND: [[0, 1, 2], [3, 4, 5], [6, 7]],
    LESSONS: [{ r: 0 }], REGIONS: [{ name: 'Starfall' }], regionDone: () => false,
    rollLucky: () => null, dailyEgg: () => null, save() {}, takeBreak: () => false,
    $: () => null, burst() {}, sfx: { win() {} }, say() {}, catchAnim: callback => callback(),
    SPECIES: [{ n: ['Sparkit', 'Cometail', 'Halleyon'] }],
    results(value) { result = value; },
  };
  runInNewContext(`${finishSource}\nfinish();`, context);
  return { S, P, result };
}

test('evolving Halleyon does not misattribute Cometail holo and gold rewards', () => {
  const { S, P, result } = playRound([3, 3, 3, 3, 3, 0, 0, 0], 5, 'gold');
  assert.equal(P.ff, 2);
  assert.equal(S.cards['0-1'].holo, true);
  assert.equal(S.cards['0-2'].holo, false);
  assert.deepEqual(Array.from(result.holoForms), [1]);
  assert.equal(result.tierF, 1);
  assert.equal(result.tierUp, 'gold');
});

test('Halleyon becomes holo after three stars on both final stages', () => {
  const { S, result } = playRound([3, 3, 3, 3, 3, 3, 3, 0], 7);
  assert.equal(S.cards['0-2'].holo, true);
  assert.deepEqual(Array.from(result.holoForms), [2]);
});

test('result screen names and displays the card that actually became holo', () => {
  const { S, P, result } = playRound([3, 3, 3, 3, 3, 0, 0, 0], 5, 'gold');
  let html = '';
  const context = {
    S, P, SPECIES: [{ n: ['Sparkit', 'Cometail', 'Halleyon'] }], LESSONS: [{}],
    ICON: { star: '<svg></svg>' },
    cardHTML: (i, f, card) => `<card form="${f}" holo="${!!card.holo}"></card>`,
    eggBanner: () => '', TIPS: ['Keep going'], rand: values => values[0],
    shareRunHTML: () => '', modal: value => { html = value; },
    setTimeout() {}, speak() {}, sfx: { lvl() {} }, titleOf: () => '',
  };
  runInNewContext(`${resultsSource}\nresults(result);`, { ...context, result });
  assert.match(html, /Cometail card is now HOLO/);
  assert.doesNotMatch(html, /Halleyon card is now HOLO/);
  assert.match(html, /GOLD Cometail/);
  assert.match(html, /<card form="1" holo="true">/);
  assert.match(html, /Halleyon is fully evolved\. Earn 3 stars on both final stages/);
});

test('earning final-stage stars names and displays holo Halleyon', () => {
  const { S, P, result } = playRound([3, 3, 3, 3, 3, 3, 3, 0], 7);
  let html = '';
  const context = {
    S, P, SPECIES: [{ n: ['Sparkit', 'Cometail', 'Halleyon'] }], LESSONS: [{}],
    ICON: { star: '<svg></svg>' },
    cardHTML: (i, f, card) => `<card form="${f}" holo="${!!card.holo}"></card>`,
    eggBanner: () => '', TIPS: ['Keep going'], rand: values => values[0],
    shareRunHTML: () => '', modal: value => { html = value; },
    setTimeout() {}, speak() {}, sfx: { lvl() {} }, titleOf: () => '',
  };
  runInNewContext(`${resultsSource}\nresults(result);`, { ...context, result });
  assert.match(html, /Halleyon card is now HOLO/);
  assert.match(html, /<card form="2" holo="true">/);
  assert.doesNotMatch(html, /Earn 3 stars on both final stages/);
});

test('binder badge shows both a rare tier and holo status', () => {
  const start = source.indexOf('const _rb19=renderBinder;');
  const binderSource = source.slice(start, source.indexOf('ACT.bview=', start));
  const binder = { className: '', innerHTML: '' };
  const context = {
    renderBinder() {}, SPECIES: [{ n: ['Sparkit', 'Cometail', 'Halleyon'] }],
    S: { cards: { '0-0': { holo: true, tier: 'gold' } } },
    sk: (i, f) => `${i}-${f}`, creatureSVG: () => '<svg></svg>',
    $: selector => selector === '#s-binder .binder' ? binder : { textContent: '' },
  };
  runInNewContext(`${binderSource}\nrenderBinder();`, context);
  assert.match(binder.innerHTML, /Gold \+ Holo/);
});
