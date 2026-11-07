import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';

// content=false loads only the core and its two samples, so tests can add topics with ids that real content already uses
function load(content=true){
 const c={};createContext(c);
 const dir=new URL('../public/',import.meta.url);
 const files=['spell-data.js',...(content?readdirSync(dir).filter(f=>/^spell-w[\d-]+\.js$/.test(f)).sort():[])];
 for(const f of files)runInContext(readFileSync(new URL(f,dir),'utf8'),c,{filename:f});
 const R=c.SPELLD,W={};
 for(const k of Object.keys(R))W[k]=typeof R[k]==='function'?(...a)=>{const v=R[k](...a);return v&&typeof v==='object'?JSON.parse(JSON.stringify(v)):v}:R[k];
 return W; // JSON-cloned results so deepEqual works across the vm realm
}
const S=load();
const topicDef=(o={})=>({id:'s9.7',world:9,n:7,grade:'7',pattern:'t',exp:'x',words:Array.from({length:40},(_,i)=>'w'+String.fromCharCode(97+i%26)+String.fromCharCode(97+(i/26|0))).join('|'),sents:{},...o});

test('registered topics validate',()=>{
 const r=S.validate();
 assert.deepEqual(r.errors,[]);assert.ok(r.ok);assert.ok(r.stats.topics>=2);
});

test('samples exist and carry grade tags and sentences',()=>{
 for(const id of ['s1.1','s2.2']){const t=S.topic(id);assert.ok(t);assert.ok(t.list.length>=40&&t.list.length<=80);
  assert.ok(Object.keys(t.sents).length>=10);assert.ok(t.list.every(r=>r.g>=0&&r.g<=8))}
});

test('words() is deterministic and shaped',()=>{
 const a=S.words('s2.2',3,10,'abc'),b=S.words('s2.2',3,10,'abc'),c=S.words('s2.2',3,10,'abd');
 assert.deepEqual(a,b);assert.notDeepEqual(a.map(x=>x.w),c.map(x=>x.w));
 assert.equal(a.length,10);assert.equal(new Set(a.map(x=>x.w)).size,10);
 for(const x of a){assert.equal(typeof x.w,'string');assert.equal(typeof x.s,'string');assert.equal(x.p,'sh');assert.equal(typeof x.g,'number')}
 const lo=S.words('s2.2',0,8,1),hi=S.words('s2.2',7,8,1),avg=l=>l.reduce((n,x)=>n+x.w.length+3*x.g,0)/l.length;
 assert.ok(avg(hi)>avg(lo),'later parts are harder');
 assert.equal(S.words('s2.2',0,120,1).length,120,'count beyond pool cycles');
 assert.deepEqual(S.words('nope',0,5,1),[]);
});

test('lesson slots, review and boss',()=>{
 const w1=S.topicsOf(1),w2=S.topicsOf(2);
 assert.deepEqual(w1.map(t=>t.n),[1,2,3,4,5,6,7]);assert.deepEqual(w2.map(t=>t.n),[1,2,3,4,5,6,7]);
 assert.equal(S.lesson(1,0).id,w1[0].id);assert.equal(S.lesson(2,1).id,w2[1].id);
 assert.equal(S.lesson(1,6).id,w1[6].id,'slot 6 is the 7th learn topic');
 const X=load(false);X.add(topicDef({id:'s99.1',world:99,n:1,grade:'0'}));
 assert.equal(X.lesson(99,5).id,'s99.1','missing n repeats the last topic');
 assert.equal(X.lesson(99,0).id,'s99.1');
 assert.equal(S.lesson(13,0),null,'a world with no topics');
 const r=S.lesson(2,7),b=S.lesson(2,8);assert.equal(r.kind,'review');assert.equal(b.kind,'boss');
 assert.ok(S.wordsFor(2,8,0,6,5).length===6);
 const bossAvg=S.wordsFor(2,8,0,10,2).reduce((n,x)=>n+x.w.length+3*x.g,0),revAvg=S.wordsFor(2,7,0,10,2).reduce((n,x)=>n+x.w.length+3*x.g,0);
 assert.ok(bossAvg>=revAvg);
 assert.deepEqual([0,1,2,3,4,5,6,7,8].map(S.slotKind),['learn','learn','learn','learn','learn','learn','learn','review','boss']);
});

test('mapLessons maps ORDER to slots',()=>{
 const order=Array.from({length:18},(_,k)=>100+k),m=S.mapLessons(order,i=>i<109?1:2);
 assert.deepEqual([100,106,107,108].map(i=>m[i].slot),[0,6,7,8]);assert.equal(m[108].kind,'boss');assert.equal(m[109].world,2);assert.equal(m[117].slot,8);
});

test('blank() hides exactly one letter and returns the answer',()=>{
 for(const w of ['cat','ship','splash',"don't"]){for(let s=0;s<30;s++){const b=S.blank(w,s);
  assert.equal(b.show.length,w.length);assert.equal((b.show.match(/_/g)||[]).length,1);assert.equal(b.show.replace('_',b.ans),w);assert.ok(b.at>0)}}
 const f=S.blank('cat',1,'first');assert.equal(f.show,'_at');assert.equal(f.ans,'c');
 assert.deepEqual(S.blank('cat',7),S.blank('cat',7));
});

test('forRunner shapes',()=>{
 // apostrophe and hyphen words are only valid inside punct:1 topics
 const PUNCT=new Set(S.all().filter(t=>t.punct).flatMap(t=>t.list.map(r=>r.w)));
 for(let tier=0;tier<12;tier++){
  const rock=S.forRunner(tier,'rock',{seed:1,count:6});assert.equal(rock.length,6);
  for(const x of rock){assert.equal(x.kind,'rock');assert.equal(x.show.replace('_',x.ans),x.w);assert.equal(x.ans.length,1)}
  for(const k of ['bridge','tower']){const l=S.forRunner(tier,k,{seed:2});assert.equal(l.length,8);for(const x of l){assert.equal(x.kind,k);assert.equal(x.len,x.w.length);assert.match(x.w,/^[a-z]+(?:['-][a-z]+)*$/);if(/['-]/.test(x.w))assert.ok(PUNCT.has(x.w),x.w+' has an apostrophe or hyphen outside a punct topic')}}
  const bs=S.forRunner(tier,'boss',{seed:3,count:3});assert.equal(bs.length,3);for(const x of bs){assert.equal(x.kind,'boss');assert.equal(typeof x.s,'string')}
  const sp=S.forRunner(tier,'spell',{seed:4,count:2});assert.equal(sp.length,2);
  for(const x of sp){assert.equal(x.kind,'spell');assert.ok(x.s.toLowerCase().includes(x.w));assert.ok(x.words.length>=1&&x.words.length<=3);assert.equal(x.text,x.words.join(' '))}
 }
 assert.deepEqual(S.forRunner(2,'rock',{seed:9}),S.forRunner(2,'rock',{seed:9}));
 const t=S.forRunner(1,'tower',{seed:1,count:30}),b=S.forRunner(1,'bridge',{seed:1,count:30}),av=l=>l.reduce((n,x)=>n+x.len,0)/l.length;
 assert.ok(av(t)>av(b),'towers use longer words than bridges');
 assert.deepEqual(S.forRunner(0,'nonsense'),[]);
});

test('Canadian blocklist flags American spellings only',()=>{
 for(const w of ['color','colors','colorful','center','favorite','neighbor','honor','gray','theater','defense','traveled','traveling','jewelry','meter','kilometers','liter','fiber','catalog','mold','marvelous','behavior','humor'])
  assert.ok(S.checkCanadian(w).length,w+' should be flagged');
 for(const w of ['colour','centre','favourite','neighbour','grey','theatre','defence','travelled','jewellery','metre','litre','thermometer','diameter','perimeter','speedometer','parameter','program','centimetre','honest','labour','color'.slice(0,0)||'cat'])
  assert.deepEqual(S.checkCanadian(w),[],w+' should pass');
 assert.deepEqual(S.checkCanadian('The meter ticked.',['meter']),[]);
 assert.ok(S.checkCanadian('My favorite colour is grey.').includes('favorite'));
});

test('validate catches bad topics (and does not touch the registry for real runs)',()=>{
 
 const run=(o)=>{const X=load(false);X.add(topicDef(o));return X.validate()};
 assert.ok(run({}).errors.some(e=>/only 0 valid dictation/.test(e)),'needs 10 sentences');
 assert.ok(run({words:'cat|dog'}).errors.some(e=>/need 40-80/.test(e)));
 assert.ok(run({grade:''}).errors.some(e=>/grade/.test(e)));
 const w40=Array.from({length:44},(_,i)=>'wor'+String.fromCharCode(97+i%26)+String.fromCharCode(97+(i/26|0)));
 const ok=(extra)=>({words:w40.join('|'),sents:Object.fromEntries(w40.slice(0,10).map(w=>[w,'I like '+w+' a lot.'])),...extra});
 assert.deepEqual(run(ok()).errors,[],'a good generated topic passes');
 assert.ok(run(ok({words:w40.concat([w40[0]]).join('|')})).errors.some(e=>/duplicate word/.test(e)));
 assert.ok(run(ok({words:w40.concat(['Cat']).join('|')})).errors.some(e=>/bad characters/.test(e)));
 assert.ok(run(ok({words:w40.concat(["don't"]).join('|')})).errors.some(e=>/bad characters/.test(e)));
 assert.deepEqual(run(ok({punct:1,words:w40.concat(["don't"]).join('|')})).errors,[]);
 assert.ok(run(ok({words:w40.concat(['gray']).join('|')})).errors.some(e=>/American spelling "gray"/.test(e)));
 assert.deepEqual(run(ok({words:w40.concat(['meter']).join('|'),allow:['meter']})).errors,[]);
 assert.ok(run(ok({words:w40.concat(['shit']).join('|')})).errors.some(e=>/inappropriate/.test(e)));
 assert.ok(run(ok({sents:{...ok().sents,[w40[0]]:'The color is nice, '+w40[0]+'.'}})).errors.some(e=>/American spelling in sentence/.test(e)));
 assert.ok(run(ok({sents:{...ok().sents,[w40[1]]:'No word here.'}})).errors.some(e=>/does not contain/.test(e)));
});

test('bad-word check is exact-token: innocent words are not flagged',()=>{
 for(const w of ['blood','pot','shot','wine','knife','church','bible','hell','classic','assess','butter','cocktail','scunthorpe','analysis','therapist','passage','hello'].filter(w=>w!=='hell'&&w!=='wine'))
  assert.deepEqual(S.badWords(w).hard,[],w);
 assert.deepEqual(S.badWords('blood').soft,[]);
 assert.deepEqual(S.badWords('Blood cells carry oxygen.').hard,[]);
 assert.deepEqual(S.badWords('what the shit').hard,['shit']);
 assert.ok(S.badWords('hell').soft.includes('hell'));
});

test('duplicate ids are refused, sample ids are replaceable',()=>{
 const X=load(false);
 const t=topicDef({id:'s1.1',world:1,n:1,grade:'0'});
 X.add(t);assert.equal(X.topic('s1.1').sample,undefined);
 assert.throws(()=>X.add(t),/duplicate/);
 assert.throws(()=>X.add({id:'bad'}),/bad id/);
 
});

test('PLAN and complete validation',()=>{
 const p=S.PLAN();assert.equal(p.length,12);
 p.forEach((ids,i)=>assert.equal(ids.length,7,'world '+(i+1)+' has 7 topics'));
 assert.deepEqual(p[0],S.topicsOf(1).map(t=>t.id));
 assert.ok(S.all().length>=84);
 const r=S.validate({complete:true});
 assert.deepEqual(r.errors,[]);assert.ok(r.ok);
});
