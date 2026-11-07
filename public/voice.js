/* More human read-outs: pick the most natural voice the device has, with a voice picker in Settings */
(function(){
if(!('speechSynthesis' in window))return;
const BAD=/robot|espeak|novelty|compact|albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|pipe|ralph|superstar|trinoids|whisper|wobble|zarvox|fred|kathy|grandpa|grandma|rocko|shelley|eddy|flo|reed|sandy/i;
let V=[];
const load=()=>{V=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)&&!BAD.test(v.name))};
load();speechSynthesis.addEventListener?.('voiceschanged',load);
function score(v){const n=v.name;let s=0;
 if(/natural/i.test(n))s+=100;if(/neural|premium|enhanced/i.test(n))s+=80;if(/online/i.test(n))s+=40;if(/google/i.test(n))s+=45;
 if(/\baria\b/i.test(n))s+=40;else if(/jenny|ava|emma|michelle/i.test(n))s+=30;else if(/samantha|allison|serena|libby|sonia|ana\b/i.test(n))s+=20;
 const loc=(navigator.language||'en-US').toLowerCase();if(v.lang.toLowerCase()===loc)s+=15;else if(/en-us|en-gb|en-ca|en-au/i.test(v.lang))s+=8;
 if(v.default)s+=3;return s}
const ranked=()=>V.slice().sort((a,b)=>score(b)-score(a));
function pick(){if(!V.length)load();const want=S.set&&S.set.voiceName;if(want){const v=V.find(x=>x.name===want);if(v)return v}return ranked()[0]||null}
window.kkPickVoice=()=>pick();
/* ---------- SPELLING speech: natural voice, rate .85, pitch 1.0, multi-part with pauses, own gate (S.set.sound, not S.set.voice) ---------- */
function spellScore(v){const n=v.name,l=v.lang.toLowerCase().replace('_','-');let s=0;
 if(/natural|neural|online/i.test(n))s=1000;
 else if(/google uk english female/i.test(n))s=800;else if(/google us english/i.test(n))s=700;
 else if(/samantha/i.test(n))s=600;else if(/karen/i.test(n))s=590;else if(/moira/i.test(n))s=580;else if(/tessa/i.test(n))s=570;else if(/daniel/i.test(n))s=560;
 else if(/google/i.test(n))s=300;else if(/en-ca|en-us|en-gb/.test(l))s=100;else s=10;
 if(l==='en-ca')s+=60;else if(l==='en-us'||l==='en-gb')s+=20;if(v.default)s+=1;return s}
/* owner: use the SAME voice the game used before (the natural one, or the one picked in Settings > Voice) */
function spellVoice(){return pick()}
window.kkSpellVoice=spellVoice;
let sTok=0,sTimers=[];
function sClear(){sTok++;sTimers.forEach(clearTimeout);sTimers=[]}
window.kkSpellStop=()=>{sClear();try{speechSynthesis.cancel()}catch(e){}};
/* parts: [[text, rate, pauseAfterMs],...]. opts: {force (explicit button press: speak even if sound is off), onPart(i) after part i ends, cb after the last} -> true if it will actually speak */
window.kkSpellSay=function(parts,opts){opts=opts||{};const cb=opts.cb;
 const done=f=>{if(f)setTimeout(f,0)};
 const ps=(parts||[]).filter(x=>x&&x[0]);
 if(!ps.length){done(cb);return false}
 if(!opts.force&&!(S.set&&S.set.sound!==false)){done(cb);return false}
 let tok;sClear();tok=sTok;
 const run=()=>{if(tok!==sTok)return;
  try{speechSynthesis.cancel()}catch(e){}
  const v=spellVoice();
  const next=ix=>{if(tok!==sTok)return;if(ix>=ps.length){if(cb)cb();return}
   const[t,r,pause]=ps[ix];let fin=false;
   const end=()=>{if(fin||tok!==sTok)return;fin=true;try{opts.onPart&&opts.onPart(ix)}catch(e){}
    if(ix>=ps.length-1){if(cb)cb();return}sTimers.push(setTimeout(()=>next(ix+1),pause==null?450:pause))};
   try{const u=new SpeechSynthesisUtterance(String(t));if(v){u.voice=v;u.lang=v.lang}else u.lang='en-CA';const hu=v&&score(v)>=40;u.rate=hu?Math.max(.92,r||1):(r||.9);u.pitch=hu?1.05:1;u.volume=1;
    u.onend=end;u.onerror=end;speechSynthesis.speak(u);
    sTimers.push(setTimeout(end,7000))}catch(e){end()}};
  next(0)};
 const go=()=>{sTimers.push(setTimeout(run,60))};
 try{if(speechSynthesis.getVoices().length){go()}else{let d=false;const f=()=>{if(d)return;d=true;load();go()};speechSynthesis.addEventListener('voiceschanged',f,{once:true});sTimers.push(setTimeout(f,1500))}}catch(e){go()}
 return true};

window.speak=speak=function(t){if(!S.set.voice)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g,''));
 const v=pick();if(v){u.voice=v;u.lang=v.lang}
 const human=v&&score(v)>=40;u.rate=human?1:.95;u.pitch=human?1.05:1.15;speechSynthesis.speak(u)}catch(e){}};
ACT.voicePick=()=>{const sel=document.getElementById('voicesel');if(!sel)return;S.set.voiceName=sel.value||'';save();const was=S.set.voice;S.set.voice=true;speak('Hi! Fingers on F and J. You are doing great!');S.set.voice=was};
const _set=ACT.settings;ACT.settings=function(){const r=_set.apply(this,arguments);try{addRow()}catch(e){console.warn(e)}return r};
function addRow(){const box=document.getElementById('mbox');if(!box||box.querySelector('#voicesel'))return;
 const rows=[...box.querySelectorAll('.setrow')],hint=rows.find(x=>/^Read hints/.test(x.textContent));if(!hint)return;
 if(!V.length)load();const list=ranked();if(!list.length)return;const cur=pick();
 const nice=v=>v.name.replace(/^(Microsoft|Google)\s+/,'').replace(/\s*\(.*?\)\s*/g,' ').replace(/\s+-\s+English.*$/,'').trim()+(score(v)>=80?' ★':'');
 hint.insertAdjacentHTML('afterend',`<div class="setrow voicerow"><span>Voice</span><div class="vpick"><select id="voicesel" class="pgin" aria-label="Voice">${list.map(v=>`<option value="${v.name.replace(/"/g,'&quot;')}" ${cur&&cur.name===v.name?'selected':''}>${nice(v)}</option>`).join('')}</select><button class="btn sm" data-act="voicePick">Test</button></div></div>`);
 document.getElementById('voicesel').addEventListener('change',()=>ACT.voicePick())}
document.head.insertAdjacentHTML('beforeend','<style>.vpick{display:flex;gap:8px;align-items:center;min-width:0}.vpick select{font-family:inherit;font-size:18px;max-width:240px;min-width:0;height:40px;background:#171226;color:#fff6e0;border:3px solid #3a2f4e;border-radius:0;padding:0 6px}body.mobile .vpick select{max-width:150px}</style>');
})();
