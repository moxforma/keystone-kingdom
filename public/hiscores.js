/* Arcade high scores shared across every player on this device/account */
(function(){
const GN={meteor:'Meteor Zap',race:'Race with Keylori',glitch:'Scrambler Attack',bubble:'Bubble Pop',dig:'Treasure Dig',keeper:'Keylori Keeper',bridge:'Story Bridge'};
const DIFF=d=>(d||'auto').startsWith('beast')?'Beast':d==='easy'?'Easy':d==='hard'?'Hard':d==='med'||d==='medium'?'Medium':'Auto';
function record(){try{if(screen!=='game'||typeof G==='undefined'||!G||G._hs||!GN[G.type])return;const box=$('#mbox');if(!box||!box.querySelector('.rstats'))return;
 const a=window.kkArcStats&&window.kkArcStats();if(!a||a.good<15)return;G._hs=1;
 const e={g:G.type,wpm:a.wpm,acc:a.acc,d:G.insane?'Impossible':G.beast?'Beast':DIFF(S.set&&S.set.arcd),t:Date.now()};
 S.hs=S.hs||[];S.hs.push(e);const keep=[];Object.keys(GN).forEach(g=>{S.hs.filter(x=>x.g===g).sort((x,y)=>y.wpm-x.wpm||y.acc-x.acc).slice(0,10).forEach(x=>keep.push(x))});S.hs=keep;save();
 const all=allScores().filter(x=>x.g===e.g),rank=all.findIndex(x=>x.t===e.t&&x.me)+1;
 if(rank&&rank<=3){const rs=box.querySelector('.rstats');rs&&rs.insertAdjacentHTML('beforebegin',`<div class="banner gold chip">New high score! #${rank} in ${GN[e.g]}</div>`)}}catch(err){console.warn(err)}}
function allScores(){const out=[];let prof={list:['p1'],cur:'p1'};try{prof=JSON.parse(localStorage.getItem('kk-profiles'))||prof}catch(e){}
 (prof.list||[]).forEach(id=>{let st=null;if(id===prof.cur)st=S;else try{st=JSON.parse(localStorage.getItem(LS_KEY+'-'+id))}catch(e){}
  if(!st||!Array.isArray(st.hs))return;const nm=st.name||'Player';st.hs.forEach(x=>out.push(Object.assign({n:nm,me:id===prof.cur},x)))});
 return out.sort((x,y)=>y.wpm-x.wpm||y.acc-x.acc)}
let TAB='all';
ACT.hiscores=d=>{if(d&&d.g)TAB=d.g;const all=allScores(),rows=(TAB==='all'?all:all.filter(x=>x.g===TAB)).slice(0,10);const medal=['#f0c860','#c8d0dc','#d08a50'];
 modal(`<h2>High Scores</h2><div class="hs-tabs">${['all',...Object.keys(GN)].map(g=>`<button class="${g===TAB?'on':''}" data-act="hiscores" data-g="${g}">${g==='all'?'All games':GN[g]}</button>`).join('')}</div>
 ${rows.length?`<table class="hs-tab"><tr><th>#</th><th>Player</th>${TAB==='all'?'<th>Game</th>':''}<th>WPM</th><th>Accuracy</th><th>Level</th><th>Date</th></tr>${rows.map((x,k)=>`<tr class="${x.me?'me':''}"><td>${k<3?`<span class="medal m${k+1}">${k+1}</span>`:`<b>${k+1}</b>`}</td><td>${esc(x.n)}</td>${TAB==='all'?`<td>${GN[x.g]}</td>`:''}<td><b>${x.wpm}</b></td><td>${x.acc}%</td><td>${x.d}</td><td style="white-space:nowrap">${new Date(x.t).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</td></tr>`).join('')}</table>`:`<p class="muted">No scores yet. Play an arcade game to get on the board!</p>`}
 <p class="muted" style="font-size:16px;margin:6px 0 0">Everyone who plays on this device is on the board.</p><div class="rbtns"><button class="btn" data-act="close">Close</button></div>`)};
const _md=modal;modal=function(){const r=_md.apply(this,arguments);setTimeout(record,120);return r};
const _ra=renderArcade;renderArcade=function(){const r=_ra.apply(this,arguments);try{const tb=$('#s-arcade .topbar');if(tb&&!tb.querySelector('[data-act=hiscores]'))tb.insertAdjacentHTML('beforeend','<button class="btn sm volt hsbtn" data-act="hiscores">High Scores</button>')}catch(e){}return r};
document.head.insertAdjacentHTML('beforeend',`<style>.hs-tabs{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin:4px 0 10px}.hs-tabs button{font:inherit;font-size:15px;padding:4px 8px;background:#2a2340;color:#fff6e0;border:2px solid #3a2f4e;cursor:pointer}.hs-tabs button.on{background:#f0c860;color:#1b1626;border-color:#f0c860}
.hs-tab{width:100%;border-collapse:collapse;font-size:17px}.hs-tab th{text-align:left;color:#b8a8d8;font-weight:normal;padding:4px 6px;border-bottom:2px solid #3a2f4e}.hs-tab td{padding:5px 6px;border-bottom:1px solid #2a2340}.hs-tab tr.me td{background:rgba(127,232,255,.08)}.hsbtn{margin-left:auto}</style>`);
try{if(screen==='arcade')renderArcade()}catch(e){}
})();
