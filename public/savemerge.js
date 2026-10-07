/* Family sync: merge two copies of the same player so progress is never lost,
   whichever device's clock is ahead. The newer copy is the base; earned progress
   (stars, Keylori, XP, outfits, records) is combined from both. Same code runs on the server. */
(function(root){
const TR={gold:1,diamond:2};
const maxNum=(a,b)=>Math.max(+a||0,+b||0);
const maxMap=(a,b)=>{const o={...(a||{})};for(const[k,v]of Object.entries(b||{}))if(typeof v==='number')o[k]=maxNum(o[k],v);else if(!(k in o))o[k]=v;return o};
const union=(a,b)=>[...new Set([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])])];
function mergeSave(x,y){
 if(!x||typeof x!=='object')return y;if(!y||typeof y!=='object')return x;
 const [base,other]=(y.upd||0)>=(x.upd||0)?[y,x]:[x,y];
 const m=JSON.parse(JSON.stringify(base));
 m.best=maxMap(base.best,other.best);
 const cards={...(base.cards||{})};for(const[k,c]of Object.entries(other.cards||{})){const b=cards[k];if(!b){cards[k]=c;continue}const t=(TR[c&&c.tier]||0)>(TR[b.tier]||0)?c.tier:b.tier;cards[k]={...b,holo:!!(b.holo||(c&&c.holo)),...(t?{tier:t}:{})}}m.cards=cards;
 for(const k of['xp','time','rounds','netw','netb'])if(k in base||k in other)m[k]=maxNum(base[k],other[k]);
 for(const k of['owned','badges'])if(base[k]||other[k])m[k]=union(base[k],other[k]);
 for(const k of['rareOwn','rareSeen','codeBest'])if(base[k]||other[k])m[k]=k==='codeBest'?maxMap(base[k],other[k]):{...(other[k]||{}),...(base[k]||{})};
 if(base.arc||other.arc){m.arc={...maxMap(base.arc,other.arc)};if(base.arc&&base.arc.high||other.arc&&other.arc.high)m.arc.high={...((other.arc||{}).high||{}),...((base.arc||{}).high||{})}}
 if(base.daily||other.daily){m.daily={...(base.daily||{})};m.daily.best=maxNum((base.daily||{}).best,(other.daily||{}).best)}
 if(base.codeOn||other.codeOn)m.codeOn=true;
 m.upd=maxNum(base.upd,other.upd);return m}
root.mergeSave=mergeSave;
if(typeof mergeBundle==='function'&&typeof localBundle==='function'){const _mb=mergeBundle;mergeBundle=function(r){
 try{if(r&&r.saves){const loc=localBundle();for(const[id,rd]of Object.entries(r.saves)){const d=loc.saves[id];if(!d||!rd||(rd.name&&d.name&&rd.name!==d.name))continue;
  const m=mergeSave(d,rd);if(JSON.stringify(m)!==JSON.stringify(d)){m.upd=Math.max(d.upd||0,rd.upd||0)+1;r.saves[id]=m}}}}catch(e){console.warn(e)}
 return _mb.apply(this,arguments)};window.mergeBundle=mergeBundle}
})(typeof window!=='undefined'?window:globalThis);
