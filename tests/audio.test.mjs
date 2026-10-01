import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/game.js', import.meta.url), 'utf8');
const audio = source.slice(source.indexOf('let AC,audioResume;'), source.indexOf('const sfx='));

test('typing sounds resume a suspended audio connection and clean up afterward', async () => {
 let resumes = 0, disconnects = 0, ended;
 const oscillator = {
  frequency: { setValueAtTime() {} },
  connect() { return this; },
  disconnect() { disconnects++; },
  start() {},
  stop() {},
  set onended(fn) { ended = fn; }
 };
 const gain = {
  gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
  connect() { return this; },
  disconnect() { disconnects++; }
 };
 const context = {
  S: { set: { sound: true } },
  window: { AudioContext: class {
   state = 'suspended';
   currentTime = 0;
   destination = {};
   resume() { resumes++; this.state = 'running'; return Promise.resolve(); }
   createOscillator() { return oscillator; }
   createGain() { return gain; }
  } }
 };
 runInNewContext(audio + '\nglobalThis.playTone=tone', context);
 context.playTone(520);
 context.playTone(540);
 await Promise.resolve();
 assert.equal(resumes, 1);
 ended();
 assert.equal(disconnects, 2);
});
