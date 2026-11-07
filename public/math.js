/* math.js: the MATH stream (registration + CLASSIC mode) for Keyloria Kingdom.
   Same scene as classic typing (hero, Scrambler holding the caged Keylori, HP bar); the strip shows a problem from MATH.problems() in the big pixel font.
   The kid types the answer: digits plus the symbols the answer needs. Backspace fixes. Auto-submit when the typed length equals the answer length
   (Space or Enter submits early). Right = one laser per key + celebration. Wrong = shield splat, same problem again; after 2 misses the answer shows
   for a moment and a similar problem goes to the back of the queue. Stars from first-try accuracy. Finish through KKS.finishClassic (progress is
   recorded under S.streams.math only: KKS swaps S.best etc. while the stream is active).
   Runner and boss runner configs come from runner-math.js (window.RUNNER_MATH). */
(function(){
if(!window.KKS||!window.MATH||typeof P==='undefined'||typeof S==='undefined')return;
const K=window.KKS,M=window.MATH;
const $q=(s,r)=>(r||document).querySelector(s);
const DIG='0123456789';
const PRAISE=['Nice!','Zap!','Great!','You got it!','Awesome!','Super!','Wow!','Yes!'];
const REG=['Count to 20','Add to 10','Add to 20','Tens and ones','Times tables','Multiply and divide','Fractions and decimals','Percent and ratio','Negative numbers','Equations','Mix of early math','Mix of big math'];

/* ---------- registration ---------- */
K.register({
 id:'math',name:'Math',kbd:'digits',regionDesc:REG,
 topicFor(w,slot,kind){try{const t=M.lesson(w,kind==='review'?7:kind==='boss'?8:slot.k);return t?t.id:''}catch(e){return ''}},
 title(id){try{const t=M.topic(id);return t&&t.title?t.title:null}catch(e){return null}},
 classic:n=>{try{classic(n)}catch(e){console.error('[math]',e);try{P.phase='wait';modal('<h2>Math</h2><div class="rbtns"><button class="btn big nextbtn" data-act="go" data-to="map">OK</button></div>')}catch(_){}}},
 runnerCfg:(i,s)=>window.RUNNER_MATH&&RUNNER_MATH.cfg?RUNNER_MATH.cfg(i,s):null,
 bossCfg:i=>window.RUNNER_MATH&&RUNNER_MATH.bossCfg?RUNNER_MATH.bossCfg(i):null
});

/* ---------- small pixel helpers (aids) ---------- */
const INK='#1a1030',CREAM='#fff6e0',GOLD='#f0c860',GOLD2='#b3850f',TEAL='#7fd8d0',TEAL2='#2f8f8a',PINK='#e89ac0',PINK2='#a04c78',SILV='#cfc6e0',SILV2='#8f86a8',COP='#c8794a',COP2='#7a4326';
const GC=[[GOLD,GOLD2],[TEAL,TEAL2],[PINK,PINK2]];
function cv(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w);c.height=Math.max(1,h);const g=c.getContext('2d');g.imageSmoothingEnabled=false;return {c,g}}
function R(g,col,x,y,w,h){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h)}
function dot(g,x,y,k){const a=GC[k%3];R(g,INK,x+1,y,6,8);R(g,INK,x,y+1,8,6);R(g,a[0],x+1,y+1,6,6);R(g,a[1],x+2,y+6,4,1);R(g,CREAM,x+2,y+2,2,1);R(g,CREAM,x+2,y+3,1,1)}
function line(g,col,x0,y0,x1,y1,t){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let k=0;k<=n;k++)R(g,col,x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,t||1,t||1)}
function poly(g,col,pts,t){for(let k=0;k<pts.length;k++){const a=pts[k],b=pts[(k+1)%pts.length];line(g,col,a[0],a[1],b[0],b[1],t||1)}}
function disc(g,col,cx,cy,r){for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.6)R(g,col,cx+x,cy+y,1,1)}
function ring(g,col,cx,cy,r){for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const d=x*x+y*y;if(d<=r*r+r*.6&&d>(r-1)*(r-1)+(r-1)*.6)R(g,col,cx+x,cy+y,1,1)}}
const F35={'0':'XXX,X.X,X.X,X.X,XXX','1':'.X.,XX.,.X.,.X.,XXX','2':'XXX,..X,XXX,X..,XXX','3':'XXX,..X,XXX,..X,XXX','4':'X.X,X.X,XXX,..X,..X','5':'XXX,X..,XXX,..X,XXX','6':'XXX,X..,XXX,X.X,XXX','7':'XXX,..X,.X.,.X.,.X.','8':'XXX,X.X,XXX,X.X,XXX','9':'XXX,X.X,XXX,..X,XXX','$':'.XX,XX.,.X.,.XX,XX.','c':'...,XXX,X..,XXX,...'};
function tiny(g,str,x,y,col){let cx=x;for(const ch of String(str)){const r=F35[ch];if(!r)continue;r.split(',').forEach((row,yy)=>{for(let xx=0;xx<3;xx++)if(row[xx]==='X')R(g,col,cx+xx,y+yy,1,1)});cx+=4}return cx-x-1}
function tinyW(str){return Math.max(0,String(str).length*4-1)}

/* ---------- object sprites: 12x12 hard-pixel art as string rows. Keys: k ink, w cream, a/A = main colour (tone-able) light/dark,
   g/G green, N/n brown, y/Y gold, r/R red, o/O orange, t/T teal, u/U blue, p/P pink, s/S silver ---------- */
const PAL={k:'#1a1030',w:'#fff6e0',g:'#7fbf6a',G:'#3f7a46',N:'#7a4326',n:'#c8794a',y:'#f0c860',Y:'#b3850f',r:'#d9605a',R:'#8f2f3a',o:'#e8a050',O:'#b06a2a',t:'#7fd8d0',T:'#2f8f8a',u:'#7a86d8',U:'#4a52a0',p:'#e89ac0',P:'#a04c78',s:'#cfc6e0',S:'#8f86a8',c:'#e8d09a',C:'#b89a5e',d:'#6a4a3a'};
const TONES={red:['#d9605a','#8f2f3a'],green:['#7fbf6a','#3f7a46'],gold:['#f0c860','#b3850f'],blue:['#7a86d8','#4a52a0'],teal:['#7fd8d0','#2f8f8a'],pink:['#e89ac0','#a04c78'],orange:['#e8a050','#b06a2a'],purple:['#a98ae0','#6a4aa8'],grey:['#aaa2bd','#6f6788'],ghost:['#4a4166','#2e2748'],white:['#fff6e0','#cfc6e0'],black:['#5a5470','#34304a'],yellow:['#f0c860','#b3850f'],brown:['#c8794a','#7a4326']};
const GEMT=['teal','gold','pink'];
const SPR={
 apple:{tone:'red',rows:['.....kN.....','....kNk.kk..','..kkkNkkggk.','.kaaaakkkGk.','kaawaaaaaaak','kaawaaaaaaak','kaaaaaaaaaAk','kaaaaaaaaaAk','.kaaaaaaaAAk','.kaaaaaaAAk.','..kkaaAAAkk.','....kkkkk...']},
 star:{tone:'gold',rows:['.....kk.....','....kaak....','....kaak....','kkkkkaakkkkk','kaaaawaaaaak','.kaaawaaaAk.','..kaaaaaAk..','..kaaaaAAk..','.kaaaAkAAAk.','.kaaAk.kAAk.','.kaAk...kAk.','.kk.......kk']},
 leaf:{tone:'green',rows:['.........kkk','......kkkaak','....kkaaaaak','...kaawaaaAk','..kaaaaaaAAk','.kaaaaaaAAk.','.kaaaaaAAk..','kNaaaAAAk...','kNkAAkk.....','kN.kk.......','kk..........','............']},
 maple:{tone:'red',rows:['.....kk.....','....kaak....','.k..kaak..k.','kak.kaak.kak','kaakkaaakaak','.kaaaaaaaak.','..kaaaaaak..','.kaaaaaaaak.','kkkaaaaaakkk','...kkaakk...','.....Nk.....','.....Nk.....']},
 puck:{tone:'black',rows:['............','............','............','...kkkkkk...','..kaaaaaak..','.kawwaaaaak.','kaaaaaaaaaak','kkAAAAAAAAkk','kAAAAAAAAAAk','kAAAAAAAAAAk','.kkkkkkkkkk.','............']},
 toque:{tone:'red',rows:['.....kk.....','....kwwk....','....kwwk....','..kkkkkkkk..','.kaaaaaaaak.','.kawaAaAaAk.','kaaaaaaaaaAk','kaAaAaAaAaAk','kwwwwwwwwwwk','kwSwSwSwSwSk','kwwwwwwwwwwk','.kkkkkkkkkk.']},
 canoe:{tone:'red',rows:['..........kk','.........kNk','........kNk.','.......kNk..','......kNk...','.k...kNk...k','kwkkkNkkkkwk','kaaaNaaaaaak','.kAANAAAAAk.','..kNkkkkkk..','.kyyk.......','.kkkk.......']},
 jar:{tone:'orange',rows:['...kkkkkk...','...kYyyyk...','...kkkkkk...','..kwwwwwwk..','.kaaaaaaaak.','.kawwwwwwak.','.kawkkkkwAk.','.kawwwwwwAk.','.kaaaaaaaAk.','.kaaaaaaAAk.','..kkkkkkkk..','............']},
 book:{tone:'blue',rows:['............','..kkkkkkkk..','.kAaaaaaaak.','.kAawwwwaak.','.kAawkkwaak.','.kAawwwwaak.','.kAaaaaaaak.','.kAaaaaaaak.','.kAaaaaaaAk.','.kkkkkkkkkk.','..kwwwwwwk..','..kkkkkkkk..']},
 ball:{tone:'blue',rows:['....kkkk....','..kkaaaakk..','.kaaawaaaak.','.kaawaaaaak.','kaaaaaaaaaak','kwwwwwwwwwwk','kwwwwwwwwwwk','kaaaaaaaaaAk','.kaaaaaaaAk.','.kaaaaaaAAk.','..kkAAAAkk..','....kkkk....']},
 card:{tone:'gold',rows:['..kkkkkkkk..','.kaaaaaaaak.','.kawwwwwwak.','.kwTTTTTTwk.','.kwTttttTwk.','.kwTtwttTwk.','.kwTttttTwk.','.kwTTTTTTwk.','.kawwwwwwak.','.kaaaaaaaAk.','.kkkkkkkkkk.','............']},
 berry:{tone:'blue',rows:['............','.....kk.....','....kGGk....','..kkkGGkkk..','.kaaakkaaak.','kaawaaaaaaak','kawaaaaaaaak','kaaaaaaaaaAk','kaaaaaaaaAAk','.kaaaaaaAAk.','..kkAAAAkk..','....kkkk....']},
 shell:{tone:'pink',rows:['............','....kkkk....','..kkaaaakk..','.kaaAaaAaak.','kaaaAaaAaaak','kaaAaaaaAaak','kaaAaaaaaAak','kaAaaaaaaaAk','.kkaaaaaaAkk','..kkAAAAkk..','...kNNNNk...','....kkkk....']},
 fish:{tone:'orange',rows:['............','............','....kkkk....','k..kaaaakk..','kkkaaaaaaakk','kaaaaawkaaak','kaaaaaaaaAk.','kkkaaAAAAkk.','k..kAAAAkk..','....kkkk....','............','............']},
 bird:{tone:'blue',rows:['............','....kkkk....','...kaaaak...','..kaaawkak..','..kaaaakyyk.','.kaaaaaakkk.','.kaaAAAaak..','.kaAAAAAak..','..kAAAAAk...','...kkkkk....','...n..n.....','..nn.nn.....']},
 cookie:{tone:'brown',rows:['............','...kkkkkk...','..kccccccck.','.kccdcccccck','.kcccccdcck.','kccdccccccck','kcccccdcccck','.kccccccdck.','.kcdccccccck','..kccccdck..','...kkkkkk...','............']},
 balloon:{tone:'red',rows:['...kkkkkk...','..kaaaaaak..','.kaawaaaaak.','.kaawaaaaak.','.kaaaaaaaAk.','.kaaaaaaaAk.','..kaaaaaAk..','...kAAAAk...','....kkkk....','.....kk.....','....k.......','.....k......']},
 bug:{tone:'red',rows:['............','..k......k..','...k.kk.k...','....kkkk....','...kaaaak...','..kaakaaak..','.kakaaakaak.','.kaaaakaaak.','.kakaaaakak.','..kaaakaak..','...kkkkkk...','............']},
 keylori:{tone:'purple',rows:['............','.k........k.','.kak....kak.','.kaakkkkaak.','kaaaaaaaaaak','kaakkaakkaak','kaakwakwaaak','kaaaaaaaaaak','kaapaakaapak','.kaaaaaaaak.','..kAAAAAAk..','...kkkkkk...']},
 gem:{tone:'teal',rows:['............','...kkkkkk...','..kawwaaak..','.kaaaaaaaak.','kkkkkkkkkkkk','kaawaaaaaAAk','.kaaaaaaAAk.','..kaaaaAAk..','...kaaAAk...','....kaAk....','.....kk.....','............']}
};
const sprCache={};
function sprCanvas(name,tone){
 const d=SPR[name]||SPR.gem,tn=TONES[tone||d.tone]||TONES[d.tone],key=name+'/'+(tone||d.tone);if(sprCache[key])return sprCache[key];
 const o=cv(12,12);d.rows.forEach((row,y)=>{for(let x=0;x<12;x++){const ch=row[x];if(!ch||ch==='.')continue;
  const col=ch==='a'?tn[0]:ch==='A'?tn[1]:PAL[ch];if(col)R(o.g,col,x,y,1,1)}});
 return sprCache[key]=o.c}
/* which object does a problem talk about? names in the text win over the (random) obj hint; no name at all -> hint or a gem; unknown name -> plain dots */
const NOUNS=[[/maple leaf|maple leaves/,'maple'],[/\bleaf\b|\bleaves\b/,'leaf'],[/apples?\b/,'apple'],[/\bstars?\b|\bstickers?\b/,'star'],[/\bpucks?\b|\bgoals?\b/,'puck'],[/\btoques?\b|\bhats?\b/,'toque'],[/\bcanoes?\b/,'canoe'],[/\bjars?\b/,'jar'],[/\bbooks?\b/,'book'],[/\bballs?\b/,'ball'],[/\bcards?\b/,'card'],[/\bberry\b|\bberries\b/,'berry'],[/\bshells?\b/,'shell'],[/\bfish\b/,'fish'],[/\bbirds?\b/,'bird'],[/\bcookies?\b|\bmuffins?\b/,'cookie'],[/\bballoons?\b/,'balloon'],[/\bbugs?\b|\bladybugs?\b|\bbees?\b/,'bug'],[/\bkeylori\b/,'keylori'],[/\bgems?\b|\bdiamonds?\b/,'gem']];
const COLORW=/\b(red|green|gold|blue|pink|teal|orange|purple|yellow|white|black|brown)\b/;
function nounOf(q){q=String(q||'').toLowerCase();let best=null,bi=1e9;for(const [re,nm] of NOUNS){const m=re.exec(q);if(m&&m.index<bi){bi=m.index;best=nm}}return best}
function hasNoun(q){return /\b(apples?|stars?|leaf|leaves|pucks?|toques?|canoes?|jars?|books?|balls?|cards?|berry|berries|shells?|fish|birds?|cookies?|balloons?|bugs?|keylori|gems?|stickers?|goals?|muffins?|hats?|bees?)\b/i.test(String(q))}

/* group layouts: each returns {w,h,pts:[[x,y]], box} in px. C = cell size (10 for the 8px dot, 14 for a 12px sprite), f = C/10 */
function layoutGroup(n,lay,seed,C){
 C=C||10;const f=C/10;n=Math.max(0,Math.min(n|0,30));let pts=[],w,h,box=null;
 const grid=(cols)=>{const rows=Math.ceil(n/cols)||1;for(let k=0;k<n;k++)pts.push([(k%cols)*C+1,Math.floor(k/cols)*C+1]);w=Math.min(n,cols)*C;h=rows*C;if(!n){w=C;h=C}};
 if(lay==='frame'||(lay==null&&n<=10&&seed===-1)){
  const frames=Math.max(1,Math.ceil(n/10));w=frames*(5*C+6)-6+4;h=2*C+4;
  for(let k=0;k<n;k++){const fr=Math.floor(k/10),q=k%10;pts.push([2+fr*(5*C+6)+(q%5)*C+1,2+Math.floor(q/5)*C+1])}
  box=[];for(let fr=0;fr<frames;fr++)box.push([fr*(5*C+6),0,5*C+4,2*C+4])}
 else if(lay==='dice'&&n>=1&&n<=6){
  const P9={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]}[n];w=3*C+8;h=3*C+8;
  P9.forEach(p=>pts.push([4+(p%3)*C+1,4+Math.floor(p/3)*C+1]));box=[[0,0,w,h]]}
 else if(lay==='scatter'){
  const cols=Math.max(3,Math.ceil(n/2)+1),rows=3,cells=[];for(let k=0;k<cols*rows;k++)cells.push(k);
  let s=(n*2654435761+seed*97+13)>>>0;const rnd=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296};
  for(let k=cells.length-1;k>0;k--){const j=Math.floor(rnd()*(k+1));const t=cells[k];cells[k]=cells[j];cells[j]=t}
  cells.slice(0,n).forEach(c=>pts.push([(c%cols)*C+Math.floor(rnd()*3*f),Math.floor(c/cols)*C+Math.floor(rnd()*3*f)]));w=cols*C;h=rows*C}
 else if(lay==='circle'&&n>=1){
  const r=n===1?0:Math.max(Math.round(10*f),Math.round(n*3.4*f));w=h=2*r+Math.round(10*f);
  for(let k=0;k<n;k++){const a=-Math.PI/2+k*2*Math.PI/n;pts.push([Math.round(r+1+Math.cos(a)*r),Math.round(r+1+Math.sin(a)*r)])}}
 else if(lay==='rows')grid(5);
 else if(lay==='row')grid(10);
 else grid(5);
 return {w,h,pts,box}}
/* ob = {spr:name, tones:[...], ghost:n}: a sprite for each object, or null for the plain dots */
function dotsAid(a,ob){
 const groups=(a.dots||[]).map(x=>+x||0),lay=a.layout,sp=ob&&ob.spr&&SPR[ob.spr]?ob.spr:null,C=sp?14:10;
 const gs=groups.map((n,k)=>layoutGroup(n,lay,groups.length>1&&lay==null?-2:(lay==null?-1:k),C));
 const gap=groups.length>1?(a.plus?14:(lay==='frame'||lay==='dice'?8:12)):0;
 const W=gs.reduce((s,g)=>s+g.w,0)+gap*(gs.length-1),H=Math.max(...gs.map(g=>g.h),C);
 const o=cv(W,H);let x=0;const take=+a.take||0;
 gs.forEach((g,k)=>{const oy=Math.floor((H-g.h)/2);
  if(g.box)g.box.forEach(b=>{R(o.g,SILV2,x+b[0],oy+b[1],b[2],b[3]);R(o.g,INK,x+b[0]+1,oy+b[1]+1,b[2]-2,b[3]-2)});
  g.pts.forEach((p,j)=>{
   if(sp){const gone=take&&k===0&&j>=g.pts.length-take;
    const tn=gone?'ghost':(ob.tones&&ob.tones[k])||(sp==='gem'?GEMT[k%3]:ob.tone||null);
    o.g.drawImage(sprCanvas(sp,tn),x+p[0],oy+p[1]);
    if(gone){const cx=x+p[0]+5,cy=oy+p[1]+5;line(o.g,'#e8584f',cx-5,cy-5,cx+5,cy+5,2);line(o.g,'#e8584f',cx+5,cy-5,cx-5,cy+5,2)}}
   else dot(o.g,x+p[0],oy+p[1],groups.length>1?k:0)});
  x+=g.w+gap;
  if(k<gs.length-1&&groups.length>1&&gap){const mx=Math.round(x-gap/2),my=Math.round(H/2);
   if(a.plus){R(o.g,INK,mx-4,my-2,9,5);R(o.g,INK,mx-2,my-4,5,9);R(o.g,CREAM,mx-3,my-1,7,3);R(o.g,CREAM,mx-1,my-3,3,7)}   // a clear + between the two groups
   else{R(o.g,INK,mx-1,my-5,3,11);R(o.g,SILV,mx,my-4,1,9)}}});
 return o.c}
function tenAid(a){
 const t=Math.min(+a.ten[0]||0,10),on=Math.min(+a.ten[1]||0,9),W=t*8+(t&&on?6:0)+Math.ceil(on/5)*8+(on?0:0)||8,H=24,o=cv(Math.max(W,8),H);let x=0;
 for(let k=0;k<t;k++){R(o.g,INK,x,0,7,24);R(o.g,GOLD,x+1,1,5,22);for(let y=1;y<24;y+=2)R(o.g,GOLD2,x+1,y+1,5,1);R(o.g,CREAM,x+1,1,1,22);x+=8}
 if(t&&on)x+=6;
 for(let k=0;k<on;k++){const cx=x+Math.floor(k/5)*8,cy=(k%5)*5;R(o.g,INK,cx,cy,7,5);R(o.g,TEAL,cx+1,cy+1,5,3);R(o.g,CREAM,cx+1,cy+1,2,1)}
 return o.c}
/* readable coins: loonie = gold, 11-sided rim, "1"; toonie = silver ring round a gold centre, "2"; 5c, 10c and 25c are silver with a big (2x) value */
function tiny2(g,str,x,y,col){let cx=x;for(const ch of String(str)){const r=F35[ch];if(!r)continue;r.split(',').forEach((row,yy)=>{for(let xx=0;xx<3;xx++)if(row[xx]==='X')R(g,col,cx+xx*2,y+yy*2,2,2)});cx+=8}return cx-x-2}
function coinsAid(a){
 const spec={1:{r:6,k:'cu',l:'1¢'},5:{r:9,k:'si',l:'5'},10:{r:8,k:'si',l:'10'},25:{r:10,k:'si',l:'25'},100:{r:10,k:'loonie',l:'1'},200:{r:11,k:'toonie',l:'2'},500:{r:11,k:'bill',l:'$5'},1000:{r:11,k:'bill',l:'$10'}};
 const cs=(a.coins||[]).map(c=>{c=+c||0;return spec[c]||{r:9,k:'si',l:String(c)}});
 const W=cs.reduce((s,c)=>s+c.r*2+4,0),o=cv(W,26),g=o.g;let x=0;
 cs.forEach(c=>{const r=c.r,cx=x+r+1,cy=13;
  if(c.k==='loonie'){   // 11-sided gold coin
   const pts=[];for(let k=0;k<11;k++){const an=-Math.PI/2+k*2*Math.PI/11;pts.push([cx+Math.cos(an)*(r+.5),cy+Math.sin(an)*(r+.5)])}
   disc(g,INK,cx,cy,r+1);disc(g,GOLD2,cx,cy,r);disc(g,GOLD,cx,cy-1,r-1);for(let k=0;k<11;k++){const p=pts[k],q=pts[(k+1)%11];line(g,GOLD2,p[0],p[1],q[0],q[1],1)}
   ring(g,GOLD2,cx,cy,r-3);tiny2(g,'1',cx-3,cy-5,INK)}
  else if(c.k==='toonie'){   // two-tone: silver ring, gold centre
   disc(g,INK,cx,cy,r+1);disc(g,SILV2,cx,cy,r);disc(g,SILV,cx,cy-1,r-1);disc(g,GOLD2,cx,cy,r-4);disc(g,GOLD,cx,cy-1,r-5);tiny2(g,'2',cx-3,cy-5,INK)}
  else if(c.k==='bill'){R(g,INK,x,cy-8,r*2+2,17);R(g,c.l==='$5'?'#6aa0e0':'#b88adf',x+1,cy-7,r*2,15);R(g,CREAM,x+3,cy-5,r*2-4,11);tiny2(g,c.l.replace('$',''),cx-(c.l.length>2?7:3),cy-5,INK);tiny(g,'$',x+4,cy-5,INK)}
  else{const lt=c.k==='cu'?[COP,COP2]:[SILV,SILV2];disc(g,INK,cx,cy,r+1);disc(g,lt[1],cx,cy,r);disc(g,lt[0],cx,cy-1,r-1);ring(g,lt[1],cx,cy,r-1);
   if(c.l==='1¢')tiny(g,'1',cx-1,cy-3,INK);else{const n=c.l.length;tiny2(g,c.l,cx-Math.floor((n*8-2)/2),cy-5,INK)}}
  x+=r*2+4});
 return o.c}
function clockAid(a){
 const o=cv(41,41),g=o.g,cx=20,cy=20,r=19,h=+a.clock.h||12,m=+a.clock.m||0;
 disc(g,INK,cx,cy,r+1);disc(g,CREAM,cx,cy,r);ring(g,SILV2,cx,cy,r);
 for(let k=0;k<12;k++){const an=k*Math.PI/6,big=k%3===0,x=cx+Math.sin(an)*(r-3),y=cy-Math.cos(an)*(r-3);R(g,big?INK:SILV2,Math.round(x)-(big?1:0),Math.round(y)-(big?1:0),big?2:1,big?2:1)}
 const ha=((h%12)+m/60)*Math.PI/6,ma=m*Math.PI/30;
 line(g,PINK2,cx,cy,cx+Math.sin(ha)*9,cy-Math.cos(ha)*9,2);line(g,TEAL2,cx,cy,cx+Math.sin(ma)*14,cy-Math.cos(ma)*14,1);R(g,INK,cx-1,cy-1,3,3);
 return o.c}
function tallyAid(a){
 const n=Math.min(+a.tally||0,30),gr=Math.ceil(n/5),W=gr*20,o=cv(Math.max(W,8),20);
 for(let k=0;k<gr;k++){const c=Math.min(5,n-k*5),x=k*20;for(let s=0;s<Math.min(c,4);s++){R(o.g,INK,x+s*4,2,3,16);R(o.g,CREAM,x+s*4+1,3,1,14)}
  if(c===5)line(o.g,GOLD,x-1,15,x+16,4,2)}
 return o.c}
function fracAid(a){
 const nn=+a.frac.n||0,d=Math.max(1,Math.min(+a.frac.d||1,12)),sw=Math.max(6,Math.min(16,Math.floor(96/d))),W=sw*d+1,o=cv(W,18);
 R(o.g,INK,0,0,W,18);for(let k=0;k<d;k++){R(o.g,k<nn?GOLD:CREAM,1+k*sw,1,sw-1,16);if(k<nn)R(o.g,GOLD2,1+k*sw,15,sw-1,2)}
 for(let k=0;k<=d;k++)R(o.g,INK,k*sw,0,1,18);
 return o.c}
function gridAid(a){
 const w=Math.max(1,Math.min(+a.grid.w||1,16)),h=Math.max(1,Math.min(+a.grid.h||1,8)),o=cv(w*7+1,h*7+1);
 R(o.g,INK,0,0,w*7+1,h*7+1);for(let y=0;y<h;y++)for(let x=0;x<w;x++){R(o.g,TEAL,1+x*7,1+y*7,6,6);R(o.g,TEAL2,1+x*7,6+y*7,6,1)}
 return o.c}
function shapeAid(a){
 const nm=String(a.shape&&a.shape.name||'').toLowerCase(),o=cv(44,40),g=o.g,N={triangle:3,square:4,pentagon:5,hexagon:6,octagon:8};
 const cx=22,cy=20,col=GOLD;
 const fillPoly=(pts)=>{let minY=1e9,maxY=-1e9;pts.forEach(p=>{minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1])});
  for(let y=Math.round(minY);y<=Math.round(maxY);y++){const xs=[];for(let k=0;k<pts.length;k++){const A=pts[k],B=pts[(k+1)%pts.length];if((A[1]<=y&&B[1]>y)||(B[1]<=y&&A[1]>y))xs.push(A[0]+(y-A[1])*(B[0]-A[0])/(B[1]-A[1]))}
   xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2)R(g,col,xs[k],y,Math.max(1,Math.round(xs[k+1])-Math.round(xs[k])),1)}};
 const reg=(n,r,rot)=>{const p=[];for(let k=0;k<n;k++){const an=rot+k*2*Math.PI/n;p.push([cx+Math.sin(an)*r,cy-Math.cos(an)*r])}return p};
 let outline,fillP;
 if(N[nm]){const n=N[nm];fillP=outline=n===4?[[8,8],[36,8],[36,34],[8,34]].map(p=>[p[0]+(0),p[1]-0]).map(p=>[p[0],p[1]]):reg(n,n===3?19:18,n%2?0:Math.PI/n);if(n===4)fillP=outline=[[10,6],[34,6],[34,34],[10,34]]}
 else if(nm==='rectangle')fillP=outline=[[4,10],[40,10],[40,31],[4,31]];
 else if(nm==='cube'||nm==='box'){const wd=nm==='box'?34:26;
  fillPoly([[4,14],[4+wd,14],[4+wd,36],[4,36]]);poly(g,INK,[[4,14],[4+wd,14],[4+wd,36],[4,36]]);
  poly(g,INK,[[4,14],[10,6],[10+wd,6],[4+wd,14]]);R(g,GOLD2,5,14,wd-1,1);line(g,INK,4+wd,14,10+wd,6);line(g,INK,10+wd,6,10+wd,28);line(g,INK,4+wd,36,10+wd,28);
  return o.c}
 else if(nm==='pyramid'){fillPoly([[4,34],[40,34],[22,6]]);poly(g,INK,[[4,34],[40,34],[22,6]]);line(g,INK,22,6,28,34);return o.c}
 else if(/prism/.test(nm)){fillPoly([[4,34],[26,34],[15,10]]);poly(g,INK,[[4,34],[26,34],[15,10]]);poly(g,INK,[[15,10],[34,10],[40,30],[26,34]]);line(g,INK,34,10,40,30);R(g,GOLD2,16,12,17,1);return o.c}
 else fillP=outline=reg(6,18,Math.PI/6);
 fillPoly(fillP);poly(g,INK,outline);return o.c}
/* the object a counting problem is about (null = unknown name: plain dots) */
function objFor(p,a){
 const q=String(p&&p.q||''),nm=nounOf(q);if(nm)return nm;
 const m=/how many ([a-z ]+?)\?/i.exec(q);
 if(m&&!/^(more|left|now|each|in all|altogether|all|are|do|is|not)\b/i.test(m[1].trim())&&!/^(left|more|now|each)$/i.test(m[1].trim()))return null;
 return a&&a.obj&&SPR[a.obj]?a.obj:'gem'}
const COINW={toonie:200,loonie:100,quarter:25,dime:10,nickel:5};
/* word problems that come without a picture get one when the text tells us what to draw (small counts only) */
function deriveAid(p){
 const q=String(p&&p.q||'').replace(/\s+/g,' ').trim();let m,nm;
 if(/^(\d+ (toonie|loonie|quarter|dime|nickel)s?)(,? and |, | )?/i.test(q)&&/^[\d\sa-z,]+(\.|\?|:)/i.test(q.split(/[.?:]/)[0]+'.')&&!/[a-z]{3,} [a-z]{3,} [a-z]{3,}/.test(q.replace(/toonies?|loonies?|quarters?|dimes?|nickels?|and|total|how|many/gi,''))){
  const cs=[];const re=/(\d+) (toonie|loonie|quarter|dime|nickel)s?/gi;while((m=re.exec(q)))for(let k=0;k<Math.min(+m[1],6);k++)cs.push(COINW[m[2].toLowerCase()]);
  if(cs.length&&cs.length<=9)return {coins:cs}}
 if((m=/(?:after|earlier than|later than|before) (\d{1,2}):00/i.exec(q)))return {clock:{h:+m[1],m:0}};
 const ok=(n)=>n>=0&&n<=20;
 if((m=/has (\d+) ([a-z ]+?)\. Gives (\d+) away/i.exec(q))){nm=nounOf(m[2]);const a=+m[1],b=+m[3];if(nm&&ok(a)&&b<=a)return {dots:[a],take:b,layout:'rows',_n:nm}}
 if((m=/has (\d+) ([a-z ]+?)\. Gets (\d+) more/i.exec(q))){nm=nounOf(m[2]);const a=+m[1],b=+m[3];if(nm&&ok(a+b))return {dots:[a,b],layout:'rows',plus:true,_n:nm}}
 if((m=/has (\d+) ([a-z ]+?)\. [A-Za-z]+ has (\d+)\./i.exec(q))){nm=nounOf(m[2]);const a=+m[1],b=+m[3];if(nm&&ok(a)&&ok(b)&&a+b<=20)return {dots:[a,b],layout:'rows',plus:true,_n:nm}}
 if((m=/^(\d+) ([a-z ]+?)\. (\d+) are (red|green|gold|blue|pink|teal|orange|purple|yellow|white|black|brown)\./i.exec(q))){nm=nounOf(m[2]);const n=+m[1],k=+m[3];if(nm&&ok(n)&&k<=n)return {dots:[k,n-k],layout:'rows',_n:nm,_t:[m[4].toLowerCase(),'grey']}}
 return null}
/* resolve a problem to {aid, ob} */
function resolveAid(p){
 let a=p&&p.aid;if(a&&typeof a!=='object')a=null;
 if(!a){a=deriveAid(p);if(!a)return null}
 let ob=null;
 if(a.dots){const sp=a._n||objFor(p,a);
  if(sp){ob={spr:sp};
   const q=String(p&&p.q||'').toLowerCase();let tn=a._t;
   if(!tn){const cm=/\b(?:are|is) (red|green|gold|blue|pink|teal|orange|purple|yellow|white|black|brown)\b/.exec(q);if(cm&&(a.dots||[]).length===2)tn=[cm[1],'grey']}
   if(tn)ob.tones=tn}}
 return {aid:a,ob}}

/* the aid for a problem (canvas or element) or null. opt.max = biggest whole-number scale (6 for the small boards, more in the arena) */
function aidEl(p,maxW,maxH,opt){
 const r=resolveAid(p);if(!r)return null;const a=r.aid;let c=null;const mx=(opt&&opt.max)||6;
 try{
  if(a.bars&&a.bars.length){return barsEl(a.bars,maxH,maxW)}
  if(a.dots)c=dotsAid(a,r.ob);else if(a.ten)c=tenAid(a);else if(a.coins)c=coinsAid(a);else if(a.clock)c=clockAid(a);else if(a.tally!=null)c=tallyAid(a);
  else if(a.frac)c=fracAid(a);else if(a.grid)c=gridAid(a);else if(a.shape)c=shapeAid(a)}
 catch(e){console.warn('[math aid]',e);return null}
 if(!c)return null;
 const z=zoomNow(),sc=Math.max(1,Math.min(Math.floor(maxH*z/c.height),Math.floor(maxW*z/c.width),mx));   // whole SCREEN pixels per art pixel, even under the text-size zoom
 c.className='mq-aid';c.style.width=(c.width*sc/z)+'px';c.style.height=(c.height*sc/z)+'px';c.dataset.sc=sc;return c}
function zoomNow(){try{const e=document.getElementById('arena')||document.getElementById('s-play');if(!e||!e.offsetWidth)return 1;const z=e.getBoundingClientRect().width/e.offsetWidth;return z>.3&&z<3?Math.round(z*1000)/1000:1}catch(_){return 1}}
function barsEl(bars,maxH,maxW){
 const mx=Math.max(1,...bars.map(b=>+b.v||0)),d=document.createElement('div');d.className='mq-aid mq-bars';
 const big=(maxH||0)>90,lab=big?Math.max(16,Math.min(26,Math.floor(maxH/7))):15,n=bars.length;
 const bh=Math.max(4,Math.min(big?30:8,Math.floor(((maxH||60)-lab-14)/mx)));
 let bw=big?Math.min(64,Math.max(22,bh*2)):22;if(maxW)bw=Math.max(14,Math.min(bw,Math.floor(maxW/n)-14));
 d.style.setProperty('--u',bh+'px');d.style.setProperty('--bw',bw+'px');d.style.setProperty('--lf',lab+'px');
 d.innerHTML=bars.map((b,k)=>`<div class="mb"><div class="mbv" style="height:${(+b.v||0)*bh}px;--bc:${GC[k%3][0]};--bd:${GC[k%3][1]}"></div><span>${esc(String(b.l))}</span></div>`).join('');return d}


/* ---------- text ---------- */
function spoken(p){
 let q=String(p.q||'');if(/^\?$/.test(q.trim()))return p.hint||'How many?';
 q=q.replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/\+/g,' plus ').replace(/(\d)\s*[−-]\s*(\d)/g,'$1 minus $2').replace(/−/g,' minus ').replace(/=/g,' equals ').replace(/[_?□]/g,' what number ').replace(/\//g,' over ');
 return q}
function qSize(q){const L=q.length;return L<=9?'':L<=16?'mid':L<=30?'sm':'xs'}

/* ---------- the classic round ---------- */
const CSS=`<style id="mq-css">
#strip.mq #stripIn{display:none}
#mq{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:clamp(8px,2vw,22px);padding:0 10px;font-family:'Jersey 10',monospace;color:#fff6e0;overflow:hidden}
#strip.mq{height:clamp(56px,7.4vh,80px)!important;flex:none}
#mq .mq-eq{font-size:clamp(34px,5.4vh,54px);line-height:1;color:#f0c860;text-shadow:3px 3px 0 #1a1030}
#mq .mq-ans{display:flex;gap:6px;align-items:center;min-width:1.1em;height:auto;font-size:clamp(28px,4.6vh,46px);line-height:1}
#mq .mq-ans b{display:block;min-width:.9em;height:1.1em;line-height:1.1;text-align:center;background:#0a0f2e;border:4px solid #8a94d8;font-weight:400;color:#7fd8d0;text-shadow:3px 3px 0 #1a1030;box-sizing:border-box}
#mq .mq-ans b.cur{border-color:#f0c860;animation:mqblink .8s steps(2) infinite}
#mq .mq-ans b.f{border-color:#7fd8d0}
#mq .mq-ans.ghost b{color:#f0c860;opacity:.85;border-color:#f0c860}
#mq .mq-ans.ok b{color:#7fd884;border-color:#7fd884}
.mqb-t .mqb-blank{display:inline-block;width:.78em;height:.86em;border:.11em solid #f0c860;background:#0a0f2e;vertical-align:-.12em;margin:0 .08em;box-sizing:border-box}
.mq-aid{flex:none;image-rendering:pixelated;image-rendering:crisp-edges}
.mq-bars,#mqt .mq-bars{display:flex;align-items:flex-end;gap:calc(var(--bw,22px)*.4);height:100%;padding-bottom:3px}
.mb{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:var(--lf,15px);line-height:1;font-family:'Jersey 10',monospace;color:#fff6e0;text-shadow:2px 2px 0 #1a1030}
.mbv{width:var(--bw,22px);background:repeating-linear-gradient(0deg,var(--bc) 0 calc(var(--u,8px) - 2px),var(--bd) calc(var(--u,8px) - 2px) var(--u,8px));border:2px solid #1a1030;box-sizing:content-box}
/* the big problem board in the arena: hero left, board middle, villain and caged Keylori right */
#mqb{position:absolute;left:19%;right:27%;top:2%;bottom:2%;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;box-sizing:border-box;padding:4px 8px;background:#1f3b36;border:4px solid #7a4326;box-shadow:0 0 0 3px #1a1030,5px 5px 0 3px rgba(26,16,48,.7),inset 0 0 0 3px #2f5a50;overflow:hidden;font-family:'Jersey 10',monospace;color:#fff6e0;image-rendering:pixelated;animation:mqtin .25s steps(3)}
#mqb .mqb-t{width:100%;text-align:center;line-height:1;text-shadow:3px 3px 0 #1a1030;text-wrap:balance}
#mqb .mqb-a{flex:1;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
#mqb.ok{border-color:#7fd884}
#mqb.side{flex-direction:row}
#mqb.side .mqb-a{flex:1}
#mqb.noa .mqb-t{flex:1;display:flex;align-items:center;justify-content:center}
#arena:has(>#mqb){height:clamp(240px,calc(30vh + 58px + max(0px,(100vh - 800px)*.85)),440px);flex:none}
.strip-wrap:has(#strip.mq) #trkP{display:none}
#arena:has(>#mqb) .hero{left:2%;bottom:4%;width:min(14%,128px)}
#arena:has(>#mqb) .bubble{left:1.5%;top:3%;max-width:17%;font-size:clamp(13px,1.5vw,18px)!important;padding:5px 8px!important;letter-spacing:.02em!important}
#arena:has(>#mqb) .bubble::after{display:none}
#arena:has(>#mqb) .villain{right:13.5%;bottom:5%;width:min(12%,118px)}
#arena:has(>#mqb) .villain.boss{right:12.5%;width:min(14%,138px)}
#arena:has(>#mqb) .foe{right:1.5%;bottom:10%;width:min(10%,92px)}
#arena:has(>#mqb) .foe.friend{width:min(13%,120px)}
#arena:has(>#mqb) .fmeter{right:2%;top:4%;width:min(25%,210px)}
#arena:has(>#mqt) #mqb{visibility:hidden}
#mqt{position:absolute;left:30%;right:2%;top:5%;bottom:5%;z-index:6;display:flex;flex-direction:column;font-family:'Jersey 10',monospace;color:#fff6e0;image-rendering:pixelated}
#mqt .mqt-b{flex:1;min-height:0;display:flex;flex-direction:column;background:#1f3b36;border:6px solid #7a4326;box-shadow:0 0 0 3px #1a1030,6px 6px 0 3px #1a1030,inset 0 0 0 3px #2f5a50;padding:6px 14px 8px;overflow:hidden}
#mqt .mqt-h{display:flex;justify-content:space-between;align-items:center;font-size:clamp(14px,2vw,20px);color:#7fd8d0;letter-spacing:.12em;text-shadow:2px 2px 0 #1a1030}
#mqt .mqt-top{display:flex;align-items:center;gap:12px;border-bottom:3px dashed #2f8f8a;margin:0 0 3px;padding-bottom:3px}#mqt .mqt-top .mq-aid{margin-left:auto}#mqt .mqt-ex{flex:1;min-width:0;font-size:clamp(20px,3vw,30px);line-height:1;color:#f0c860;text-shadow:2px 2px 0 #1a1030;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#mqt .mqt-l.two{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;align-content:start;column-gap:14px}#mqt .mqt-l.two .mqt-r{font-size:clamp(16px,2.1vw,22px);gap:8px}#mqt .mqt-l.two .mqt-tip{font-size:clamp(17px,2.3vw,24px)}#mqt .mqt-l.two .mqt-r canvas,#mqt .mqt-l.two .mqt-r .mq-aid{max-height:36px}#mqt .mqt-l.one{justify-content:flex-start}
#mqt .mqt-l{flex:1;padding-top:2px;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;overflow:hidden}
#mqt .mqt-r{display:flex;align-items:center;gap:12px;font-size:clamp(20px,2.8vw,30px);line-height:1.05;text-shadow:2px 2px 0 #1a1030;opacity:.75;animation:mqtin .25s steps(3)}
#mqt .mqt-r.cur{opacity:1}
#mqt .mqt-r canvas,#mqt .mqt-r .mq-aid{flex:none;image-rendering:pixelated}
#mqt .mqt-tip{font-size:clamp(20px,3vw,32px);color:#f0c860;text-shadow:2px 2px 0 #1a1030;animation:mqtin .25s steps(3)}
#mqt .mqt-go{padding:0 14px 2px;background:#f0c860;color:#1a1030;font-size:clamp(18px,2.4vw,24px);letter-spacing:0;box-shadow:0 3px 0 #b3850f,0 0 0 2px #1a1030;animation:mqblink .8s steps(2) infinite}
@keyframes mqtin{from{transform:translateY(8px);opacity:0}}
body.little #mqt .mqt-r{font-size:clamp(24px,3.6vw,38px)}
@keyframes mqblink{50%{border-color:#2a2350}}
.mq-splat{position:absolute;z-index:5;image-rendering:pixelated;pointer-events:none;animation:mqsplat .6s steps(6) forwards}
@keyframes mqsplat{0%{transform:scale(.5);opacity:1}30%{transform:scale(1.1)}100%{transform:scale(1);opacity:0}}

</style>`;
function ensureCss(){if(!document.getElementById('mq-css'))document.head.insertAdjacentHTML('beforeend',CSS)}
const SPLAT=['....rr...rr.....','..r.rrr.rrr.r...','.rrr.rRRrRr.rr..','..rRRrRRRRrRr...','.rrRRRRyyRRRrr..','rrRRyyyyyyyRRrr.','.rRRyyYYYyyRRr..','rrRRyyYWYyyRRrr.','.rRRyyYYYyyRRr..','rrRRyyyyyyyRRrr.','.rrRRRRyyRRRrr..','..rRRrRRRRrRr...','.rrr.rRRrRr.rr..','..r.rrr.rrr.r...','....rr...rr.....'];
let splatURL=null;
function splatImg(){if(splatURL)return splatURL;const o=cv(16,15);const pal={r:'#a83030',R:'#e8584f',y:'#f6a844',Y:'#ffe08a',W:'#fff6e0'};SPLAT.forEach((row,y)=>{for(let x=0;x<16;x++){const c=pal[row[x]];if(c)R(o.g,c,x,y,1,1)}});return splatURL=o.c.toDataURL()}

function ensureStream(){S.streams=S.streams||{};return S.streams.math=S.streams.math||{}}
function genSimilar(p,k){
 try{const sd=(M.hash('sim',P.i,P.s,P.n,k,p.q)>>>0)%100000,arr=M.gen(p.topic,p.part|0,sd,6);
  const c=arr.find(x=>x.q!==p.q&&!(P.seen&&P.seen.has(x.q)))||arr[0];if(c){c.rq=1;c.orig=false;return c}}catch(e){}
 return null}

function classic(n){
 ensureCss();
 const i=Math.floor(n/8),s=n%8,sl=K.slot(i)||{kind:'learn',k:0},boss=sl.kind==='boss',st=ensureStream();
 const mult=+(S.set&&S.set.len)||1,count=Math.max(6,Math.min(24,Math.round(12*mult)));
 const seed=M.seedFor(i,s,st.rn|0);
 let probs=[];try{probs=M.problems(i,s,count,seed)||[]}catch(e){console.warn('[math]',e)}
 if(!probs.length)for(let k=0;k<count;k++){const a=k%5+1,b=(k*3)%4+1;probs.push({q:a+' + '+b,a:String(a+b),aid:null,digits:String(a+b).length,keys:String(a+b),hint:'',topic:'m1.1',world:1,part:0,ans:'num'})}
 probs.forEach(p=>{p.orig=true});
 const o=P,me=Object.assign(o,{i,s,n,stream:'math',probs,Q:probs.slice(),len:probs.length,okN:0,done:0,total:probs.length,combo:0,maxCombo:0,mist:new Set(),typed:'',start:0,last:performance.now(),lock:false,seen:new Set(probs.map(p=>p.q)),text:'',pos:0,boss});
 P.mode=undefined;P.practice=false;
 P.tier=null;{const r=Math.random();P.tier=r<1/80?'diamond':r<1/20?'gold':null}
 const fi0=i+'-'+formNow(i),[fi,ff]=fi0.split('-').map(Number);P.fi=fi;P.ff=ff;
 const name=SPECIES[fi].n[ff],vname=villainName(i,boss);
 $('#arena').innerHTML=`${scn()}<div class="bubble" id="bubble"></div><div class="hero" id="hero">${zookSVG()}</div><div class="foe" id="foe"><div class="cage">${creatureSVG(fi,ff,'px',P.tier)}</div></div><div class="villain ${boss?'boss':''}" id="vil">${villainSVG(i,boss)}</div>
 <div class="fmeter"><span class="fname">${vname}</span><div class="bar"><i id="fbar" style="width:100%"></i></div><span class="flab">Free ${name}!</span></div><div id="mqb"></div>`;
 const strip=$('#strip');strip.classList.add('mq');
 let mq=$('#mq');if(mq)mq.remove();strip.insertAdjacentHTML('beforeend','<div id="mq"></div>');
 P.phase='play';
 say(P.tier?`WOW! A ${P.tier.toUpperCase()} ${name}! Save it!`:boss?`Boss! Save ${name}!`:'Solve it!');
 clearInterval(P.idle);
 P.idle=setInterval(()=>{if(P!==me){clearInterval(me.idle);return}if(P.phase!=='play'||P.lock)return;
  if(performance.now()-P.last>9000&&P.hinted!==P.idx){P.hinted=P.idx;const p=P.Q[0];if(p){say(esc(p.hint||'Think!'));speak(spoken(p))}}},1000);
 P.onKey=onKey;
 let tid='';try{const t=M.lesson(sl.w,boss?8:sl.kind==='review'?7:sl.k);tid=t?t.id:''}catch(e){}
 P.mTid=tid;try{if(hasTeach(tid)){const b=document.createElement('button');b.className='icon-btn';b.id='mqtb';b.setAttribute('data-act','mTeach');b.setAttribute('aria-label','Watch me');b.title='Watch me (H)';b.textContent='?';b.style.cssText="font-family:'Jersey 10',monospace;font-size:24px;line-height:1";
  const h=$('#hud');if(h&&!h.querySelector('#mqtb')){const sb=h.querySelector('[data-act="sayit"]');sb?sb.before(b):h.appendChild(b)}}}catch(e){}
 if(s===0&&hasTeach(tid)&&!(st.seen&&st.seen[tid])){P.lock=true;teach(tid,()=>{if(P!==me)return;P.lock=false;P.onKey=onKey;showProblem()})}
 else showProblem();
}

/* ---------- "Watch me" mini-lesson: Pop/hero beside a chalkboard; steps reveal one by one (1.2s each, Space = faster) ---------- */
function hasTeach(tid){const T=window.MATH_TEACH&&tid&&MATH_TEACH[tid];return !!(T&&T.steps&&T.steps.length)}
function teach(tid,done){
 const T=window.MATH_TEACH&&MATH_TEACH[tid],ar=$('#arena');
 if(!T||!T.steps||!T.steps.length||!ar){done&&done();return}
 try{const st=ensureStream();st.seen=st.seen||{};if(!st.seen[tid]){st.seen[tid]=1;save()}}catch(e){}
 const me=P,prevKey=P.onKey,prevLock=P.lock;
 const old=$('#mqt');if(old)old.remove();
 const el=document.createElement('div');el.id='mqt';
 el.innerHTML='<div class="mqt-b"><div class="mqt-h"><span>WATCH ME</span></div><div class="mqt-top"><div class="mqt-ex"></div></div><div class="mqt-l"></div></div>';
 const list=$q('.mqt-l',el);let steps=T.steps.slice();
 if(steps.length>1&&String(steps[0].t||'').trim()===String(T.ex||'').trim()&&!steps[0].aid)steps.shift();
 const items=steps.map(x=>({t:x.t,aid:x.aid})).concat(T.tip?[{tip:T.tip}]:[]);
 let idx=0,tm=0,ready=false,shown=false;const two=items.length>3,cap=6;
 list.className='mqt-l '+(two?'two':'one');if(two)list.style.gridTemplateRows='repeat('+Math.min(3,Math.ceil(items.length/2))+',auto)';
 const sayIt=t=>{try{speak(spoken({q:String(t)}))}catch(e){}};
 function alive(){return P===me&&(!shown||el.isConnected)}
 function reveal(it){
  list.querySelectorAll('.mqt-r.cur').forEach(r=>r.classList.remove('cur'));
  if(it.tip){const d=document.createElement('div');d.className='mqt-tip';d.textContent=it.tip;list.appendChild(d);while(list.children.length>cap)list.firstChild.remove();sayIt(it.tip);return}
  const r=document.createElement('div');r.className='mqt-r cur';const sp=document.createElement('span');sp.textContent=String(it.t||'');r.appendChild(sp);
  if(it.aid){try{const a=aidEl({aid:it.aid},Math.floor(el.clientWidth*(two?.2:.4)),Math.max(24,Math.min(two?36:60,Math.floor(el.clientHeight*.3))));if(a)r.appendChild(a)}catch(e){}}
  list.appendChild(r);while(list.children.length>cap)list.firstChild.remove();sayIt(it.t)}
 function next(){
  clearTimeout(tm);if(!alive())return;
  if(idx<items.length){reveal(items[idx++]);tm=setTimeout(next,1200)}
  else if(!ready){ready=true;const g=document.createElement('b');g.className='mqt-go';g.textContent='SPACE';$q('.mqt-h',el).appendChild(g)}}
 function finish(){
  clearTimeout(tm);try{el.remove()}catch(e){}
  if(P===me){P.onKey=prevKey;P.lock=prevLock;P.last=performance.now()}
  try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}
  done&&done()}
 function begin(){   // wait for the lesson splash to close first
  if(P!==me)return;
  if(typeof SPLASH!=='undefined'&&SPLASH){tm=setTimeout(begin,120);return}
  ar.appendChild(el);shown=true;$q('.mqt-ex',el).textContent=String(T.ex||'');sayIt(T.ex);
  if(T.aid){try{const a=aidEl({aid:T.aid},Math.floor(el.clientWidth*.4),Math.max(24,Math.min(60,Math.floor(el.clientHeight*.3))));if(a)$q('.mqt-top',el).appendChild(a)}catch(e){}}
  tm=setTimeout(next,600)}
 P.lock=true;
 P.onKey=ch=>{if(!shown||!alive())return;if(ch===' '||ch==='Enter'){if(ready)finish();else next()}};
 begin()}
ACT.mTeach=()=>{try{document.activeElement&&document.activeElement.blur()}catch(e){}replay()};
function replay(){
 if(P.stream!=='math'||screen!=='play'||P.phase!=='play'||P.mEnd||$('#mqt')||!P.Q)return;
 if(!hasTeach(P.mTid))return;
 const me=P;teach(P.mTid,()=>{})}

function allowedChars(p){
 const set=new Set(DIG);for(const c of String(p.a))set.add(c);if(p.ans==='money'||p.ans==='dec'){set.add('.')}
 return set}
function setKeys(p){
 try{const keys=new Set(['bksp','enter']);let sh=false;for(const c of allowedChars(p)){if(c===' ')continue;const k=keyInfo(c);k.keys.forEach(x=>keys.add(x));if(k.shift)sh=true}
  if(p.units)for(const u of p.units)for(const c of u)keys.add(c);
  setAvail(keys,sh)}catch(e){}}
function hintKey(){
 const p=P.Q[0];if(!p)return;const a=String(p.a),c=a[Math.min(P.typed.length,a.length-1)];
 if(c==null||c===' '){setTarget(null);$('#fhint').innerHTML='';return}
 try{setTarget(c);$('#fhint').innerHTML=fingerHTML(c)}catch(e){}}
function echoKey(ch){try{if(ch===' '){return}setTarget(ch);$('#fhint').innerHTML=fingerHTML(ch)}catch(e){}}

/* the big board in the arena: question text (fitted, wraps) over the aid picture (whole-number scale) */
function buildBoard(p){
 const ar=$('#arena');if(!ar)return;
 let bd=$('#mqb',ar);if(!bd){bd=document.createElement('div');bd.id='mqb';ar.appendChild(bd)}
 bd.className='';bd._p=p;bd.innerHTML='';
 const q=String(p.q),isQ=q.trim()==='?';
 const t=document.createElement('div');t.className='mqb-t';if(!isQ&&/(^|[^A-Za-z0-9])_([^A-Za-z0-9]|$)/.test(q)){t.innerHTML=q.split(/(?<![A-Za-z0-9])_(?![A-Za-z0-9])/).map(esc).join('<i class="mqb-blank"></i>')}else t.textContent=isQ?'?':q;
 const ad=document.createElement('div');ad.className='mqb-a';
 bd.appendChild(t);bd.appendChild(ad);
 const cs=getComputedStyle(bd),iw=Math.floor(bd.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)),ih=Math.floor(bd.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)),GAP=6;
 const fit=(maxH,cap,w)=>{let fs=Math.max(16,Math.min(cap,Math.floor(maxH)));fs-=fs%2;t.style.width=w+'px';
  for(;fs>16;fs-=2){t.style.fontSize=fs+'px';if(t.scrollHeight<=maxH+1&&t.scrollWidth<=w+1)break}t.style.fontSize=fs+'px';return fs};
 if(!resolveAid(p)||!aidEl(p,iw,ih,{max:14})){bd.classList.add('noa');fit(ih*.86,Math.round(ih*.5),iw);return}
 // A: question on top, picture under it. B: question left, picture right. Keep whichever gives the bigger picture.
 let aA=null,thA=0;
 if(isQ){t.style.display='none';aA=aidEl(p,iw,ih,{max:14});ad.appendChild(aA);return}
 fit(ih*.36,Math.round(ih*.34),iw);thA=t.offsetHeight;aA=aidEl(p,iw,Math.max(24,ih-thA-GAP),{max:14});
 const tw=Math.floor(iw*.36),fsB=fit(ih,Math.round(ih*.3),tw),aw=iw-tw-GAP*2;
 let aB=null;if(fsB>=24){aB=aidEl(p,aw,ih,{max:14})}
 const areaA=aA.tagName==='CANVAS'?parseFloat(aA.style.width)*parseFloat(aA.style.height):0,areaB=aB&&aB.tagName==='CANVAS'?parseFloat(aB.style.width)*parseFloat(aB.style.height):0;
 if(aB&&areaB>areaA*1.15){bd.classList.add('side');t.style.flex='none';ad.appendChild(aB)}
 else{t.style.width='100%';fit(ih*.36,Math.round(ih*.34),iw);ad.appendChild(aA)}
}
function render(mode){   // mode: undefined | 'ghost' | 'ok'
 const p=P.Q[0],mq=$('#mq');if(!p||!mq)return;
 const a=String(p.a),pure=/^\d+$/.test(a),typed=P.typed;
 if(mq._p!==p){   // new problem: the big board in the arena, the answer slots in the strip
  mq._p=p;buildBoard(p);
  mq.innerHTML='';
  const eq=document.createElement('div');eq.className='mq-eq';eq.textContent=/^(Type|Find|Press) /.test(p.q)||/[=]/.test(p.q)&&!/\?$/.test(p.q)&&!/[_□]/.test(p.q)?'':'=';
  if(/[=]/.test(p.q)||/[?]$/.test(String(p.q).trim())&&String(p.q).trim()!=='?')eq.style.display='none';
  mq.appendChild(eq);const an=document.createElement('div');an.className='mq-ans';mq.appendChild(an)}
 const bd=$('#mqb');if(bd)bd.classList.toggle('ok',mode==='ok');
 const an=mq.querySelector('.mq-ans');an.className='mq-ans'+(mode?' '+mode:'');
 const shown=mode==='ghost'?a:typed,slots=pure?Math.max(a.length,shown.length):Math.max(1,shown.length+1);
 let h='';for(let k=0;k<slots;k++){const c=shown[k];h+=`<b class="${c!=null?'f':''}${mode?'':(k===typed.length?' cur':'')}">${c!=null?esc(c===' '?' ':c):''}</b>`}
 an.innerHTML=h;
 P.text=a;P.pos=Math.min(typed.length,Math.max(0,a.length-1));
 const w=document.getElementById('h-acc');if(w){const asked=P.okN+P.mist.size;w.textContent=(asked?Math.round(P.okN/Math.max(1,asked)*100):100)+'%'}
 const cmb=document.getElementById('h-cmb');if(cmb)cmb.textContent=P.combo}
try{window.addEventListener('resize',()=>{try{if(P.stream==='math'&&screen==='play'&&$('#mqb')&&P.Q&&P.Q[0]&&!P.mEnd)buildBoard(P.Q[0])}catch(e){}})}catch(e){}

function showProblem(){
 const p=P.Q[0];if(!p)return finishRound();
 P.typed='';P.lock=false;P.last=performance.now();P.idx=(P.idx||0)+1;P.hinted=null;P.tries=0;
 render();setKeys(p);try{setTarget(null);$('#fhint').innerHTML=''}catch(e){}
 hpBar();
 if((p.world||1)<=3||!P.spokenOnce){P.spokenOnce=1}
 if((p.world||1)<=3)try{speak(spoken(p))}catch(e){}
}
function hpBar(){const left=P.Q.length,tot=Math.max(P.total,left);const b=$('#fbar');if(b)b.style.width=Math.round(left/tot*100)+'%'}

function onKey(ch){
 if((ch==='h'||ch==='H')&&P.phase==='play'&&!P.lock&&!P.mEnd&&P.Q&&P.Q.length&&!P.typed){replay();return}
 if(P.phase!=='play'||P.lock||!P.Q||!P.Q.length)return;
 const p=P.Q[0],a=String(p.a);if(!P.start)P.start=performance.now();P.last=performance.now();
 if(ch==='Backspace'){if(P.typed.length){P.typed=P.typed.slice(0,-1);render();try{sfx.click()}catch(e){}}return}
 if(ch==='Enter'||ch===' '){
  if(ch===' '&&P.typed.length&&a[P.typed.length]===' '&&a.indexOf(P.typed)===0){P.typed+=' ';render();return}
  if(P.typed.length)submit();return}
 if(typeof ch!=='string'||ch.length!==1)return;
 let c=ch;if(/[A-Z]/.test(c))c=c.toLowerCase();
 if(!allowedChars(p).has(c)&&!(p.units&&/[a-z²³]/.test(c)))return;
 if(P.typed.length>=a.length+(p.units?3:0))return;
 try{pressFx(c)}catch(e){}
 P.typed+=c;echoKey(c);render();try{sfx.click()}catch(e){}
 if(M.isComplete(P.typed,p)&&!(p.units&&0)){P.lock=true;setTimeout(()=>{if(P.phase!=='play')return;P.lock=false;submit()},160)}
}

function laserFor(c,big){try{const col=/[\d.\/:,\-r]/.test(c)?fcol(keyInfo(c).f):'#f0c860';zap(col,big)}catch(e){try{zap('#f0c860',big)}catch(_){}}}
function submit(){
 const p=P.Q[0];if(!p||P.phase!=='play')return;
 if(!P.typed.length)return;
 let ok=false;try{ok=M.check(P.typed,p)}catch(e){}
 P.lock=true;
 if(ok)right(p);else wrong(p)}

function right(p){
 const typed=P.typed.replace(/\s/g,'').split('');P.combo++;P.maxCombo=Math.max(P.maxCombo,P.combo);
 if(!p.miss&&p.orig)P.okN++;
 const big=P.combo%5===0;
 render('ok');
 (typed.length?typed:['1']).forEach((c,k)=>setTimeout(()=>{if(P.stream==='math')laserFor(c,big&&k===typed.length-1)},k*110));
 try{big?sfx.super():sfx.ok(P.combo)}catch(e){}
 const me=P,t=Math.max(1,typed.length)*110;
 setTimeout(()=>{if(P!==me)return;
  try{burst($('#arena'),$('#vil'),big?'#f0c860':'#7fd8d0',big?18:9);$('#hero')?.classList.remove('cheer');void $('#hero')?.offsetWidth;$('#hero')?.classList.add('cheer')}catch(e){}
  say(big?'Super zap!':P.combo%3===0?PRAISE[Math.floor(Math.random()*PRAISE.length)]:'Yes!');
  P.Q.shift();P.done++;hpBar();
  const delay=620;
  setTimeout(()=>{if(P!==me||P.phase!=='play')return;P.Q.length?showProblem():finishRound()},delay)},t);
}

function wrong(p){
 p.miss=(p.miss||0)+1;if(p.orig)P.mist.add(p.q);P.combo=0;P.tries++;
 try{sfx.bad()}catch(e){}
 try{const s=$('#strip');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');kick($('#vil'),'laugh')}catch(e){}
 try{const a=$('#arena'),h=$('#hero');if(a&&h){const ar=a.getBoundingClientRect(),hr=h.getBoundingClientRect(),sc=Math.max(2,Math.min(5,Math.round(hr.height/40))),im=document.createElement('img');im.className='mq-splat';im.src=splatImg();
  im.style.width=16*sc+'px';im.style.height=15*sc+'px';im.style.left=Math.round(hr.right-ar.left-8*sc)+'px';im.style.top=Math.round(hr.top-ar.top+hr.height*.25)+'px';a.appendChild(im);setTimeout(()=>im.remove(),700)}}catch(e){}
 const me=P;
 if(p.miss>=2){
  render('ghost');say('It is '+esc(p.a),true);try{speak('It is '+String(p.a).replace(/\./g,' point '))}catch(e){}hintKey();
  setTimeout(()=>{if(P!==me||P.phase!=='play')return;
   P.Q.shift();P.done++;
   if(!p.rq){const sim=genSimilar(p,P.total);if(sim){P.seen.add(sim.q);P.Q.push(sim);P.total++}}
   hpBar();P.Q.length?showProblem():finishRound()},1900);
  return}
 say('Try again!',true);
 setTimeout(()=>{if(P!==me||P.phase!=='play')return;P.typed='';P.lock=false;render();hintKey()},520);
}

function finishRound(){
 if(P.phase!=='play'||P.mEnd)return;
 try{const st=ensureStream();st.rn=(st.rn|0)+1}catch(e){}
 P.mEnd=1;P.onKey=null;   // phase stays 'play': a Boss Test hands over to the hybrid boss chase (KKS.hybridDone needs it); finishClassic sets 'done'
 const secs=P.start?(performance.now()-P.start)/1000:Math.max(1,P.len*3);
 K.finishClassic({len:P.len,ok:P.okN,secs});
}

/* leaving the play screen: the math strip and the keyboard filter go away */
try{const _sh=show;show=function(id){
 try{if(id!=='play'){const s=document.getElementById('strip');if(s)s.classList.remove('mq');const m=document.getElementById('mq');if(m)m.remove()}}catch(e){}
 return _sh.apply(this,arguments)};}catch(e){}
/* a typing round started after math: restore the strip */
try{const _br=beginRound;beginRound=function(){try{document.getElementById('strip')?.classList.remove('mq');document.getElementById('mq')?.remove()}catch(e){}return _br.apply(this,arguments)}}catch(e){}

window.MATHUI={aidEl,spoken,sprCanvas,SPR,TONES,resolveAid,nounOf};
})();
