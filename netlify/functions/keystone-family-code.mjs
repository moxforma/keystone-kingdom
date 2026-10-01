import { getStore } from "@netlify/blobs";

const words = ("ant ape ash bag bat bay bed bee bin bit boa bog bow box bud bug bun bus cap car cat cob cod cow cub cup " +
 "dad day den dew dig dip dog dot ear eel egg elk elm fan fig fin fir fit fly fog fox fun fur gap gem gum gym " +
 "ham hat hay hen hip hog hop hub hug hut ice ink ivy jam jar jaw jet job joy jug key kid kit lab lap leg lid " +
 "lip log map mat mix mom mop mud mug nap net nib nod nut oak oat oil owl pad pal pan paw pea pen pet pie pig " +
 "pin pit pod pop pot pup rag ram rat ray red rib rim rip rod row rub rug run rye sap saw sea sew shy sip ski " +
 "sky son sun tag tan tap tea ten tie tin tip toe top toy tub tug urn van vet wax web wig win wit wok wow yak " +
 "yam yes zip zoo").split(" ");
const validSecret = value => /^[0-9a-f]{32}$/.test(value);
const validCode = value => /^[a-z]{3}[0-9]{3}$/.test(value) && words.includes(value.slice(0,3));
const digest = async value => {
 const bytes = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
 return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,"0")).join("");
};
const familyKey = secret => digest("keystone-kingdom:"+secret);
const chooseCode = () => {
 const random=crypto.getRandomValues(new Uint32Array(2));
 return words[random[0]%words.length]+String(random[1]%1000).padStart(3,"0");
};
const json=(value,status=200)=>Response.json(value,{status,headers:{"Cache-Control":"no-store"}});

export default async req => {
 const aliases=getStore({name:"keystone-family-codes",consistency:"strong"});
 const families=getStore({name:"keystone-family-saves",consistency:"strong"});
 const secret=(req.headers.get("x-keystone-code")||"").trim().toLowerCase();
 if(req.method==="GET"||req.method==="POST"){
  if(!validSecret(secret))return json({error:"Family sync is not ready"},400);
  const family=await families.get(await familyKey(secret),{type:"json"});
  if(!family||family.revoked)return json({error:"Family save not found"},404);
  const secretId="secret:"+await digest(secret);
  const saved=await aliases.get(secretId,{type:"json"});
  if(saved?.code)return json({code:saved.code.toUpperCase()});
  if(req.method==="GET")return json({code:null});
  for(let attempt=0;attempt<10;attempt++){
   const code=chooseCode();
   if(await aliases.get("code:"+code,{type:"json"}))continue;
   await aliases.setJSON("code:"+code,{secret});
   await aliases.setJSON(secretId,{code});
   return json({code:code.toUpperCase()});
  }
  return json({error:"Could not make a code. Try again."},503);
 }
 if(req.method==="PUT"){
  let body;
  try{body=await req.json()}catch{return json({error:"Enter a family code"},400)}
  const code=String(body?.code||"").trim().toLowerCase();
  if(!validCode(code))return json({error:"Enter a six-character code"},400);
  const ip=req.headers.get("x-nf-client-connection-ip")||req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";
  const day=Math.floor(Date.now()/86400000),limitKey="tries:"+day+":"+await digest(ip);
  const attempts=await aliases.get(limitKey,{type:"json"})||{count:0};
  if(attempts.count>=12)return json({error:"Too many tries. Try again tomorrow."},429);
  await aliases.setJSON(limitKey,{count:attempts.count+1});
  const match=await aliases.get("code:"+code,{type:"json"});
  if(!match?.secret)return json({error:"Code not found"},404);
  const family=await families.get(await familyKey(match.secret),{type:"json"});
  if(!family||family.revoked)return json({error:"Code not found"},404);
  return json({secret:match.secret});
 }
 return new Response("Method not allowed",{status:405});
};

export const config={path:"/api/keystone-family-code"};
