/* Detailed typing graph after each round + optional two-line text strip */
(function(){
/* ---------- keystroke log ---------- */
const _in=input;input=function(ch,caps){const live=typeof P!=='undefined'&&P.phase==='play'&&screen!=='game'&&P.text;const pos0=live?P.pos:0,m0=live?P.mist.size:0;
 const r=_in.apply(this,arguments);
 if(live&&ch&&ch.length===1){P.log=P.log||[];P.log.push({t:performance.now(),ok:P.pos>pos0,ch:P.text[pos0]})}
 return r};
const _br=beginRound;beginRound=function(){const r=_br.apply(this,arguments);try{P.log=[]}catch(e){}try{lines2Render()}catch(e){}return r};

function analyse(){const L=P.log||[];if(L.length<3||!P.text)return null;const t0=L[0].t,dur=Math.max(1,(L[L.length-1].t-t0)/1000),secs=Math.max(1,Math.ceil(dur));
 const net=[],raw=[],err=[];let ok=0,k=0;
 for(let s=1;s<=secs;s++){let typed=0,bad=0;while(k<L.length&&(L[k].t-t0)/1000<=s){typed++;if(L[k].ok)ok++;else bad++;k++}
  net.push(Math.round(ok/5/(s/60)));raw.push(Math.round(typed*12));err.push(bad)}
 const good=L.filter(x=>x.ok).length,wrong=L.length-good;
 /* words right / wrong */
 let wr=0,ww=0,start=0;const txt=P.text;for(let i=0;i<=txt.length;i++){if(i===txt.length||txt[i]===' '){if(i>start){let bad=false;for(let j=start;j<i;j++)if(P.mist.has(j))bad=true;bad?ww++:wr++}start=i+1}}
 /* slowest + most-missed keys */
 const time={},miss={};let prev=t0;L.forEach(x=>{const c=(x.ch||'').toLowerCase();if(!c||c===' '){prev=x.t;return}if(x.ok){(time[c]=time[c]||[]).push(x.t-prev);prev=x.t}else miss[c]=(miss[c]||0)+1});
 const slow=Object.entries(time).filter(([c,a])=>a.length>=2).map(([c,a])=>[c,a.reduce((p,q)=>p+q,0)/a.length]).sort((a,b)=>b[1]-a[1]).slice(0,3);
 const missed=Object.entries(miss).sort((a,b)=>b[1]-a[1]).slice(0,3);
 const mean=raw.reduce((a,b)=>a+b,0)/raw.length,sd=Math.sqrt(raw.reduce((a,b)=>a+(b-mean)*(b-mean),0)/raw.length),cons=mean?Math.max(0,Math.round(100-sd/mean*100)):0;
 return {net,raw,err,secs,dur,good,wrong,wr,ww,slow,missed,cons,wpm:net[net.length-1]||0,acc:Math.round(good/Math.max(1,L.length)*100)}}

function chartSVG(a,big){const W=big?600:320,H=big?220:96,pl=big?34:22,pb=big?22:12,pt=8,pr=8,n=a.secs;
 const max=Math.max(10,...a.net,...a.raw.map(x=>x*.85));const top=Math.ceil(max/10)*10;
 const X=i=>pl+(n<=1?0:(i/(n-1))*(W-pl-pr)),Y=v=>pt+(1-Math.min(v,top)/top)*(H-pt-pb);
 const step=(arr)=>arr.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
 let g='';for(let k=0;k<=4;k++){const v=top*k/4,y=Y(v);g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" stroke="#3a3458" stroke-width="1"/>`;if(big||k%2===0)g+=`<text x="${pl-4}" y="${y+4}" text-anchor="end" font-size="${big?11:9}" fill="#9a94b8">${Math.round(v)}</text>`}
 if(big)for(let s=0;s<n;s+=Math.max(1,Math.ceil(n/10)))g+=`<text x="${X(s)}" y="${H-6}" text-anchor="middle" font-size="10" fill="#9a94b8">${s+1}s</text>`;
 const errs=a.err.map((e,i)=>e?`<rect x="${X(i)-3}" y="${Y(a.raw[i])-3}" width="6" height="6" fill="#ff5a4a"><title>${e} mistake${e>1?'s':''} at ${i+1}s</title></rect>`:'').join('');
 return `<svg class="tchart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Words per minute over time">${g}
  <path d="${step(a.raw)}" fill="none" stroke="#6a628a" stroke-width="${big?2:1.5}" stroke-dasharray="4 3"/>
  <path d="${step(a.net)}" fill="none" stroke="#f0c860" stroke-width="${big?3:2.5}"/>${errs}</svg>`}
const legend=`<div class="tleg"><span><i class="ln y"></i>Speed (WPM)</span><span><i class="ln g"></i>Raw speed</span><span><i class="sq"></i>Mistake</span></div>`;
const keyChip=(c,v)=>`<span class="kchip">${c===' '?'space':esc(c.toUpperCase())}<small>${v}</small></span>`;
function detail(a){const box=$('#mbox');if(!box)return;const back=box.innerHTML,cls=box.className;
 box.innerHTML=`<h2>Your typing graph</h2>${chartSVG(a,true)}${legend}
 <div class="rstats oneline"><div><b>${a.wpm}</b><span>WPM</span></div><div><b>${a.acc}%</b><span>Accuracy</span></div><div><b>${a.cons}%</b><span>Steady</span></div><div><b>${a.dur.toFixed(1)}s</b><span>Time</span></div></div>
 <div class="rstats oneline"><div><b class="okc">${a.good}</b><span>Right keys</span></div><div><b class="badc">${a.wrong}</b><span>Wrong keys</span></div>${a.wr==null?'':`<div><b class="okc">${a.wr}</b><span>Right words</span></div><div><b class="badc">${a.ww}</b><span>Words with a slip</span></div>`}</div>
 ${a.slow.length?`<p class="tkeys">Slowest keys: ${a.slow.map(([c,v])=>keyChip(c,Math.round(v)+'ms')).join('')}</p>`:''}
 ${a.missed.length?`<p class="tkeys">Missed most: ${a.missed.map(([c,v])=>keyChip(c,'×'+v)).join('')}</p>`:''}
 <p class="muted" style="margin:0;font-size:14px">"Steady" is how even your speed was. 100% means you kept the same pace the whole time.</p>
 <div class="rbtns"><button class="btn" data-act="graphBack">Back</button></div>`;
 ACT.graphBack=()=>{box.innerHTML=back;box.className=cls;wire()}}
let LAST=null;
function wire(){const c=$('#mbox .tmini');if(c&&LAST)c.onclick=()=>detail(LAST)}
const _res=results;results=function(r){const out=kkSafe(_res,this,arguments);try{if(P.mode==='place')return out;const a=analyse();LAST=a;if(!a||a.secs<2)return out;
 const box=$('#mbox'),anchor=box&&(box.querySelector('.rstats'));if(!anchor||box.querySelector('.tmini'))return out;
 anchor.insertAdjacentHTML('afterend',`<button class="tmini" title="Open your typing graph">${chartSVG(a,false)}<span class="tmore">Tap for details</span></button>`);wire()}catch(e){console.warn(e)}return out};

/* ---------- two-line strip ---------- */
const on2=()=>!!(S.set&&S.set.lines2);
function lines2Render(){const si=$('#stripIn'),st=$('#strip');if(!si||!st)return;document.body.classList.toggle('lines2',on2());if(!on2()){st.style.removeProperty('height');return}
 si.querySelectorAll('span.sp').forEach(s=>{if(s.textContent.length===1)s.textContent='·​'});
 requestAnimationFrame(()=>{const kids=[...si.children];let pitch=0;const y0=kids.length?kids[0].offsetTop:0;for(const k of kids){if(k.offsetTop>y0+4){pitch=k.offsetTop-y0;break}}
  if(!pitch){const fs=parseFloat(getComputedStyle(si).fontSize)||48;pitch=fs*1.25}st.style.setProperty('height',Math.round(pitch*2+12)+'px','important');try{updateStrip()}catch(e){}})}
addEventListener('resize',()=>{if(on2())lines2Render()});
const _us=updateStrip;updateStrip=function(){const r=_us.apply(this,arguments);if(on2()){const si=$('#stripIn'),el=si&&si.children[P.pos]||si&&si.lastElementChild;if(el){const y=el.offsetTop;if(y!==si._ly||!si.style.transform.startsWith('translateY')){si._ly=y;si.style.transform=`translateY(${-y}px)`}}}return r};
function lineSwitch(){const h=$('#hands');if(!h||document.querySelector('.linesw'))return;
 h.insertAdjacentHTML('beforeend',`<div class="linesw" role="group" aria-label="Lines of text"><span>LINES</span><button data-act="lines" data-v="1" class="${on2()?'':'on'}">1</button><button data-act="lines" data-v="2" class="${on2()?'on':''}">2</button></div>`)}
ACT.lines=d=>{S.set.lines2=d.v==='2';save();document.querySelectorAll('.linesw button').forEach(b=>b.classList.toggle('on',(b.dataset.v==='2')===S.set.lines2));
 const si=$('#stripIn');if(si&&!S.set.lines2){si.querySelectorAll('span.sp').forEach(s=>s.textContent='·');si.style.transform=''}lines2Render();try{updateStrip()}catch(e){}};
const _ss=startStage;startStage=function(){const r=_ss.apply(this,arguments);lineSwitch();document.body.classList.toggle('lines2',on2());return r};
lineSwitch();

/* ---------- arcade games: log keys + graph on the end screen ---------- */
let GLOG=[],GOBJ=null,BAD=false;
const _bad=sfx.bad;sfx.bad=function(){BAD=true;return _bad.apply(this,arguments)};
const _gi=gameInput;gameInput=function(ch,caps){if(typeof G!=='undefined'&&G!==GOBJ){GOBJ=G;GLOG=[]}BAD=false;const r=_gi.apply(this,arguments);
 if(ch&&ch.length===1&&G&&!G.done)GLOG.push({t:performance.now(),ok:!BAD,ch});else if(ch&&ch.length===1&&G&&G.done&&GLOG.length)GLOG.push({t:performance.now(),ok:!BAD,ch});return r};
function analyseArc(){const L=GLOG;if(L.length<5)return null;const t0=L[0].t,dur=Math.max(1,(L[L.length-1].t-t0)/1000),secs=Math.max(2,Math.ceil(dur));
 const net=[],raw=[],err=[];let ok=0,k=0;for(let s=1;s<=secs;s++){let typed=0,bad=0;while(k<L.length&&(L[k].t-t0)/1000<=s){typed++;if(L[k].ok)ok++;else bad++;k++}net.push(Math.round(ok/5/(s/60)));raw.push(typed*12);err.push(bad)}
 const good=L.filter(x=>x.ok).length,wrong=L.length-good;const time={};let prev=t0;L.forEach(x=>{if(!x.ok||x.ch===' '){prev=x.t;return}(time[x.ch.toLowerCase()]=time[x.ch.toLowerCase()]||[]).push(x.t-prev);prev=x.t});
 const slow=Object.entries(time).filter(([c,a])=>a.length>=2).map(([c,a])=>[c,a.reduce((p,q)=>p+q,0)/a.length]).sort((a,b)=>b[1]-a[1]).slice(0,3);
 const mean=raw.reduce((a,b)=>a+b,0)/raw.length,sd=Math.sqrt(raw.reduce((a,b)=>a+(b-mean)*(b-mean),0)/raw.length);
 return {net,raw,err,secs,dur,good,wrong,wr:null,ww:null,slow,missed:[],cons:mean?Math.max(0,Math.round(100-sd/mean*100)):0,wpm:net[net.length-1]||0,acc:Math.round(good/Math.max(1,L.length)*100)}}
window.kkArcStats=()=>analyseArc();
const _md=modal;modal=function(html){const r=_md.apply(this,arguments);try{if(screen==='game'){setTimeout(()=>{const box=$('#mbox');if(!box||box.querySelector('.tmini'))return;const rs=box.querySelector('.rstats');if(!rs)return;const a=analyseArc();if(!a)return;LAST=a;
  rs.insertAdjacentHTML('afterend',`<button class="tmini" title="Open your typing graph">${chartSVG(a,false)}<span class="tmore">Tap for details</span></button>`);wire()},60)}}catch(e){}return r};
})();