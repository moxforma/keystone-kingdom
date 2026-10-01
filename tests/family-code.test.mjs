import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { runInNewContext } from 'node:vm';

const source=readFileSync(new URL('../netlify/functions/keystone-family-code.mjs',import.meta.url),'utf8')
 .replace(/^import .*\r?\n/,'').replace('export default async req =>','const handler=async req =>')
 .replace(/export const config=.*?;\s*$/s,'');

function fixture(){
 const stores=new Map();
 const getStore=({name})=>{
  if(!stores.has(name))stores.set(name,new Map());
  const records=stores.get(name);
  return {get:async key=>records.get(key)||null,setJSON:async(key,value)=>records.set(key,structuredClone(value))};
 };
 const context={getStore,crypto:webcrypto,TextEncoder,Uint8Array,Uint32Array,Response,Date};
 runInNewContext(source+'\nglobalThis.api={handler,validCode}',context);
 const request=(method,secret='',code='')=>new Request('https://example.test/api/keystone-family-code',{
  method,headers:{'x-keystone-code':secret,'x-nf-client-connection-ip':'203.0.113.10'},
  ...(code?{body:JSON.stringify({code})}:{})
 });
 return {...context.api,stores,request};
}

const secret='0123456789abcdef0123456789abcdef';
const familyKey=async value=>[...new Uint8Array(await webcrypto.subtle.digest('SHA-256',new TextEncoder().encode('keystone-kingdom:'+value)))].map(x=>x.toString(16).padStart(2,'0')).join('');

test('a permanent six-character word and number opens an existing family save',async()=>{
 const {handler,stores,request,validCode}=fixture();
 stores.set('keystone-family-saves',new Map([[await familyKey(secret),{saves:{p1:{name:'Kid'}},prof:{list:['p1']}}]]));
 const made=await handler(request('POST',secret));
 assert.equal(made.status,200);
 const {code}=await made.json();
 assert.match(code,/^[A-Z]{3}[0-9]{3}$/);
 assert.equal(validCode(code.toLowerCase()),true);
 const again=await(await handler(request('POST',secret))).json();
 assert.equal(again.code,code);
 const joined=await handler(request('PUT','',code));
 assert.equal((await joined.json()).secret,secret);
});

test('family codes are not issued for missing saves and repeated guesses are limited',async()=>{
 const {handler,request}=fixture();
 assert.equal((await handler(request('POST',secret))).status,404);
 for(let i=0;i<12;i++)assert.equal((await handler(request('PUT','', 'CAT'+String(i).padStart(3,'0')))).status,404);
 assert.equal((await handler(request('PUT','','CAT999'))).status,429);
});
