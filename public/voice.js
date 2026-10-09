/* More human read-outs: pick the most natural voice the device has, with a voice picker in Settings */
(function(){
if(!('speechSynthesis' in window))return;
const BAD=/albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|pipe|ralph|superstar|trinoids|whisper|wobble|zarvox|fred|kathy|grandpa|grandma|rocko|shelley|eddy|flo|reed|sandy/i;
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
