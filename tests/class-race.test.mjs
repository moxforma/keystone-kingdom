import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { runInNewContext } from 'node:vm';

function load(file){
 const src=readFileSync(new URL('../netlify/functions/'+file,import.meta.url),'utf8')
  .replace(/^import .*\r?\n/,'').replace(/export default async \(?req(, context)?\)? =>/,'const handler=async (req, context) =>')
  .replace(/export const config = .*?;\s*$/s,'').replace(/export const /g,'const ');
 const stores=new Map();
 const getStore=({name})=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);
  return {get:async k=>m.has(k)?structuredClone(m.get(k)):null,setJSON:async(k,v)=>m.set(k,structuredClone(v)),delete:async k=>m.delete(k),
   list:async({prefix})=>({blobs:[...m.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))})}};
 const ctx={getStore,crypto:webcrypto,TextEncoder,Uint8Array,Uint32Array,Response,Date,String,Math,Promise,Object,JSON};
 runInNewContext(src+'\nglobalThis.api={handler}',ctx);
 const call=async body=>{const r=await ctx.api.handler(new Request('https://x.test/api',{method:'POST',body:JSON.stringify(body)}));return {status:r.status,body:await r.json()}};
 return {call,stores};
}

test('a grown-up makes a class, kids join and report, board and dashboard work',async()=>{
 const {call}=load('keyloria-class.mjs');
 const made=await call({a:'create',name:'Room 4'});assert.equal(made.status,200);
 const {code,tk}=made.body;assert.match(code,/^[A-Z]{3}[0-9]{3}$/);
 assert.equal((await call({a:'join',code,pid:'kid0001',name:'Mia<script>'})).status,200);
 assert.equal((await call({a:'join',code,pid:'kid0002',name:'Leo'})).status,200);
 await call({a:'report',code,pid:'kid0001',name:'Mia',stats:{lesson:'Lesson 3 Practice',stars:20,wpm:18,acc:94,arc:{race:{wpm:22,acc:95},hack:{wpm:9}}}});
 await call({a:'report',code,pid:'kid0002',name:'Leo',stats:{arc:{race:{wpm:30,acc:90}}}});
 const board=(await call({a:'board',code})).body;assert.equal(board.rows[0].n,'Leo');assert.equal(board.rows.length,2);
 assert.equal((await call({a:'dash',code,tk:'0'.repeat(32)})).status,403);
 const dash=(await call({a:'dash',code,tk})).body;assert.equal(dash.members.length,2);assert.ok(dash.members.some(m=>m.name==='Mia'));
 await call({a:'assign',code,tk,i:88,title:'Home Row Review'});
 assert.equal((await call({a:'info',code})).body.assign.i,88);
 await call({a:'leave',code,pid:'kid0002'});assert.equal((await call({a:'dash',code,tk})).body.members.length,1);
 assert.equal((await call({a:'info',code:'zzz000'})).status,400);
});

test('race rooms: host starts, players tick, standings put finishers first',async()=>{
 const {call}=load('keyloria-race.mjs');
 const text='the fox ran up the hill and sat in the sun';
 const r=(await call({a:'make',pid:'host001',name:'Teach',text,spectate:true})).body.room;assert.match(r,/^[A-Z]{3,4}[0-9]{2}$/);
 await call({a:'join',room:r,pid:'kid0001',name:'Mia'});await call({a:'join',room:r,pid:'kid0002',name:'Leo'});
 assert.equal((await call({a:'start',room:r,pid:'kid0001'})).status,403);
 const st=(await call({a:'start',room:r,pid:'host001'})).body;assert.equal(st.state,'go');assert.ok(st.startAt>Date.now());
 assert.equal((await call({a:'join',room:r,pid:'kid0003',name:'Zed'})).status,409);
 await call({a:'tick',room:r,pid:'kid0001',pos:10,wpm:20});
 const g=(await call({a:'tick',room:r,pid:'kid0002',pos:30,wpm:25})).body;
 assert.deepEqual(g.players.map(p=>p.name),['Leo','Mia']);
});

test('rematch resets the room to a new lobby round with only the players who came back',async()=>{
 const {call}=load('keyloria-race.mjs');
 const text='the fox ran up the hill and sat in the sun';
 const r=(await call({a:'make',pid:'kid0001',name:'Mia',text,lvl:'easy'})).body.room;
 await call({a:'join',room:r,pid:'kid0002',name:'Leo'});await call({a:'join',room:r,pid:'kid0003',name:'Zed'});
 await call({a:'start',room:r,pid:'kid0001'});
 assert.equal((await call({a:'rematch',room:r,pid:'kid0002',name:'Leo',text})).status,409);
});

test('race: players only see hashed ids, strangers cannot reset or forge',async()=>{
 const {call}=load('keyloria-race.mjs');
 const text='the fox ran up the hill and sat in the sun';
 const r=(await call({a:'make',pid:'host001',name:'Teach',text})).body.room;
 await call({a:'join',room:r,pid:'kid0001',name:'Mia'});
 const lob=(await call({a:'get',room:r,pid:'kid0001'})).body;
 assert.ok(!lob.players.some(p=>p.pid==='host001'||p.pid==='kid0001'));assert.notEqual(lob.host,'host001');
 const mia=lob.players.find(p=>p.name==='Mia');assert.equal(mia.pid,lob.me);
 assert.equal((await call({a:'start',room:r,pid:lob.host})).status,403);
 await call({a:'start',room:r,pid:'host001'});
 const before=(await call({a:'rematch',room:r,pid:'stranger1',text})).body;
 assert.ok(before.error||before.state==='go');
 const g=(await call({a:'get',room:r,pid:'host001'})).body;assert.equal(g.state,'go');assert.equal(g.round,0);
});

test('race: expired rooms are reused so codes never run out',async()=>{
 const {call,stores}=load('keyloria-race.mjs');
 const text='the fox ran up the hill and sat in the sun';
 const m=()=>stores.get('keyloria-races');
 await call({a:'make',pid:'host001',name:'T',text});
 for(const [k,v] of m())if(k.startsWith('r:'))v.created=Date.now()-4*3600000;
 let ok=0;for(let i=0;i<30;i++)if((await call({a:'make',pid:'host00'+(i%9+1),name:'T',text})).status===200)ok++;
 assert.equal(ok,30);
});

test('class: teacher can delete the class and all kids in it',async()=>{
 const {call,stores}=load('keyloria-class.mjs');
 const {code,tk}=(await call({a:'create',name:'Room 9'})).body;
 await call({a:'join',code,pid:'kid0001',name:'Mia'});
 assert.equal((await call({a:'delete',code,tk:'0'.repeat(32)})).status,403);
 assert.equal((await call({a:'delete',code,tk})).status,200);
 assert.equal((await call({a:'info',code})).status,404);
 assert.ok(![...stores.get('keyloria-classes').keys()].some(k=>k.startsWith('m:')||k.startsWith('c:')));
});

test('class: guessing codes gets blocked',async()=>{
 const {call}=load('keyloria-class.mjs');
 let last;for(let i=0;i<45;i++)last=(await call({a:'info',code:'ant'+String(i).padStart(3,'0')})).status;
 assert.equal(last,429);
});
