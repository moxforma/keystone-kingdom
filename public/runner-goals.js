/* Keyloria Run add-on: stars per level (star-gated levels) and three goals per level. */
(function(){
if(!window.RUNNER)return;
const RU=window.RUNNER,st=RU.store;
const TOTAL=21,KEYS=['0','1','2','3','4','5','hard'];

/* ---------- stars and star-gated levels ---------- */
const starObj=()=>{try{const s=st.get('stars',{});return s&&typeof s==='object'&&!Array.isArray(s)?s:{}}catch(e){return {}}};
const clampStars=v=>Math.max(0,Math.min(3,+v||0));
function bestStars(k){try{return clampStars(starObj()[k])}catch(e){return 0}}
function totalStars(){let t=0;KEYS.forEach(k=>t+=bestStars(k));return t}
function saveStars(k,s){try{const o=starObj();o[k]=Math.max(bestStars(k),clampStars(s));st.set('stars',o)}catch(e){}}
const starStr=s=>'★'.repeat(s)+'☆'.repeat(3-s);

RU.locked=i=>{try{if(i==='hard')return totalStars()<12;const n=+i;if(!(n>0))return false;return totalStars()<2*n}catch(e){return false}};
RU.label=i=>{try{if(i==='hard')return 'Super hard '+starStr(bestStars('hard'));return (+i+1)+' '+starStr(bestStars(String(i)))}catch(e){return String(i)}};

/* ---------- goals ---------- */
const countBridges=R=>{try{return (R.obs||[]).filter(o=>o.t==='gap'&&o.typed>=o.word.length).length}catch(e){return 0}};
const POOL=[
 {id:'gems',  t:'GRAB 15 GEMS',           ok:i=>i.gems>=15,          live:R=>R.gemN>=15},
 {id:'nice',  t:'5 NICE JUMPS',           ok:i=>i.nice>=5,           live:R=>R.nice>=5},
 {id:'nobonk',t:'NO BONKS',               ok:i=>i.bonks===0},
 {id:'combo', t:'COMBO 10',               ok:i=>i.best>=10,          live:R=>R.best>=10},
 {id:'acc',   t:'100% ACCURACY',          ok:i=>!!i.R&&i.R.miss===0&&i.R.hits>0},
 {id:'bridge',t:'BUILD 2 BRIDGES',        ok:i=>countBridges(i.R)>=2,live:R=>countBridges(R)>=2,words:1},
 {id:'fast',  t:'FINISH ON FASTEST SPEED',ok:()=>RU.opt.spd===4}
];
const BY={};POOL.forEach(p=>BY[p.id]=p);
const lkOf=(hard,lv)=>hard?'hard':String(lv);
const LVDEF=lk=>lk==='hard'?RU.HARD:RU.LV[+lk];
const feasible=(p,lk)=>!p.words||!!(LVDEF(lk)&&(LVDEF(lk).hard||LVDEF(lk).words>0));
const goalObj=()=>{try{const g=st.get('goals',{});return g&&typeof g==='object'&&!Array.isArray(g)?g:{}}catch(e){return {}}};
function pickN(lk,n,ex){const c=POOL.filter(p=>feasible(p,lk)&&!ex.includes(p.id)),out=[];while(out.length<n&&c.length)out.push(c.splice(Math.floor(Math.random()*c.length),1)[0].id);return out}
const validIds=(ids,lk)=>Array.isArray(ids)&&ids.length===3&&new Set(ids).size===3&&ids.every(id=>BY[id]&&feasible(BY[id],lk));
function getGoals(lk){try{const g=goalObj();let ids=g[lk];if(!validIds(ids,lk)){ids=pickN(lk,3,[]);g[lk]=ids;st.set('goals',g)}return ids.slice()}catch(e){return pickN(lk,3,[])}}
function replaceDone(lk,ids,doneIds){try{const fresh=pickN(lk,doneIds.length,ids);let k=0;const next=ids.map(id=>doneIds.includes(id)?(fresh[k++]||id):id);const g=goalObj();g[lk]=next;st.set('goals',g)}catch(e){}}

/* goals are fixed for each run when the run is built */
RU.HK.build.push(R=>{try{R._gIds=getGoals(lkOf(RU.opt.hard,RU.opt.lv))}catch(e){}});

/* start screen: star total and the three goals */
RU.HK.startModal.push(()=>{try{const R=RU.R;const ids=(R&&R._gIds)||getGoals(lkOf(RU.opt.hard,RU.opt.lv));
 return `<div class="gbox"><p class="gline">★ ${totalStars()} / ${TOTAL}</p><b class="gt">GOALS</b>${ids.map(id=>`<div class="gline">☐ ${BY[id].t}</div>`).join('')}</div>`}catch(e){return ''}});

/* results: save stars, check goals, show GOAL! banners, swap done goals for new ones */
RU.HK.results.push(info=>{try{
 const lk=lkOf(info.hard,info.lv);saveStars(lk,info.stars);
 const R0=info.R||RU.R;const ids=(R0&&R0._gIds)||getGoals(lk);
 const res=ids.map(id=>{let ok=false;try{ok=!!BY[id].ok(info)}catch(e){}return {p:BY[id],ok}});
 const done=res.filter(r=>r.ok).map(r=>r.p.id);
 if(done.length)replaceDone(lk,ids,done);
 return `<div class="gbox">${res.map(r=>r.ok?`<div class="banner gold">GOAL! ${r.p.t}</div>`:`<div class="gline">☐ ${r.p.t}</div>`).join('')}</div>`
}catch(e){return ''}});

/* mid-run: one small pop the moment a goal is reached (only where it is cheap to detect) */
RU.HK.drawTop.push((g,cam)=>{try{
 const R=RU.R;if(!R||R.phase!=='run'||!R._gIds)return;
 R._gp=R._gp||{};
 R._gIds.forEach(id=>{const p=BY[id];if(!p.live||R._gp[id])return;if(p.live(R)){R._gp[id]=1;RU.popTxt('GOAL!',R.front,RU.C.GROUND-44,'#f0c860')}});
}catch(e){}});

/* small styles for the goal lines */
try{const css=document.createElement('style');css.textContent='.gbox{margin:6px auto 4px;max-width:260px;text-align:left}.gline{font-size:15px;line-height:1.5;margin:2px 0}.gt{display:block;font-size:14px;letter-spacing:.08em;color:var(--gold);margin-top:6px}.gbox .banner{margin:4px 0;padding:6px 10px;text-align:center}';document.head.appendChild(css)}catch(e){}
})();
