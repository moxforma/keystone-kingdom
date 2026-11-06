/* spell-w1.js: Keyloria Kingdom spelling topics, World 1 (JK/SK). Seven learn topics, s1.1 to s1.7.
   Self-registering: loads in the browser (window) and in node vm tests (globalThis). Words are short and decodable
   where the pattern allows. Canadian spelling and Canadian context throughout. */
(function(){
var R=typeof window!=='undefined'?window:globalThis;
if(!R.SPELLD)return;
var SPELLD=R.SPELLD;

SPELLD.add({id:'s1.1',world:1,n:1,grade:'0',title:'Rhyme families',pattern:'rhyme -at -an -ig -op -ug',
 exp:'JK/SK early literacy (Kindergarten Program 2016) and Language 2023 Strand C phonological awareness: rhyming word families -at, -an, -ig, -op, -ug',
 words:'cat|hat|bat|mat|rat|sat|pat|fat|flat|chat|that|can|man|pan|ran|fan|tan|van|plan|scan|big|dig|pig|wig|fig|twig|jig|top|hop|mop|pop|stop|drop|chop|flop|crop|bug|hug|mug|rug|jug|dug|tug|snug|plug',
 sents:{cat:'The cat sat on the mat.',hat:'Mom wears a warm hat in winter.',man:'The man rode his bike to town.',pan:'Mom cooks pancakes in a big pan.',
  fan:'A fan keeps us cool on hot days.',can:'I can hop like a bunny.',van:'The van drove us to the park.',big:'A moose is big and strong.',
  pig:'The pig rolled in the mud.',top:'Stand on top of the hill and look.',hop:'The frog can hop very far.',mop:'I use a mop to clean the floor.',
  pop:'The balloon went pop!',bug:'A bug crawled up the green leaf.',hug:'I give Mom a big hug.',mug:'I drink cocoa from my mug.',
  rug:'The rug is soft and warm.',plan:'We made a plan for the day.',tug:'The dog gave a gentle tug.',stop:'Please stop at the red light.'}});

SPELLD.add({id:'s1.2',world:1,n:2,grade:'0',title:'Beginning sounds',pattern:'initial consonant sounds, picture nouns',
 exp:'JK/SK early literacy: initial sounds in picture-word nouns (Kindergarten Program 2016); Language 2023 Strand C phonological awareness',
 words:'bee|bus|ball|boat|bear|bird|book|car|cup|cake|cow|drum|dog|door|duck|fish|frog|fork|fox|goat|gift|hen|horse|hockey|house|hand|jam|jar|jet|kite|key|lamp|leaf|lion|loon|lake|moon|moose|milk|maple|nest|nut|net|nail|pen|pot|puck|pie|rain|rope|ring|sun|sock|star|snow|sled|skate|seal|sand|tent|toque|toy|tree|vase|wagon|wolf|wing|zoo|zebra',
 sents:{bee:'A bee buzzed past the flowers.',boat:'We rode in a boat on the lake.',moose:'A moose lives in the forest.',hockey:'We play hockey on the frozen pond.',
  maple:'Maple trees turn red in the fall.',loon:'A loon calls across the lake.',toque:'Keep your toque on when it is cold.',puck:'The puck slid across the ice.',
  sled:'The sled zoomed down the hill.',fox:'A red fox ran into the woods.',kite:'My kite flew high in the wind.',zoo:'We saw a lion at the zoo.',
  zebra:'A zebra has black and white stripes.',frog:'The frog jumped into the pond.',goat:'The goat ate the green grass.'}});

SPELLD.add({id:'s1.3',world:1,n:3,grade:'0',title:'Short a and i',pattern:'CVC short a and i',
 exp:'JK/SK letter names and sounds with CVC words (a, i); Language 2023 Strand C phonics: short vowels in consonant-vowel-consonant words',
 words:'bad|bag|cab|cap|dab|dam|gap|jab|lab|lad|map|nap|pal|rag|ram|rap|sad|sap|tab|tap|wax|yam|zap|jam|ham|gas|pad|bib|bin|bit|dip|fin|fit|hid|hip|kit|lid|lip|mix|pin|pit|rib|rip|sip|sit|six|tip|tin|win|wig|zip',
 sents:{bag:'I packed my bag for school.',cap:'Put on your cap, it is sunny.',map:'We read a map of Ontario.',jam:'I like strawberry jam on toast.',
  tap:'Turn off the tap after you wash.',pin:'Mom used a pin to fix my jacket.',sit:'Please sit by me on the bus.',tip:'The pencil has a sharp tip.',
  zip:'Zip your coat up before you go out.',lid:'Put the lid on the box.',six:'We have six eggs in the basket.',bin:'Put the paper in the bin.',
  mix:'We mix milk and cocoa to drink.',fit:'My new boots fit me well.',pad:'I drew on a pad of paper.',ham:'Dad made a ham sandwich for lunch.'}});

SPELLD.add({id:'s1.4',world:1,n:4,grade:'0',title:'Short o, u and e',pattern:'CVC short o, u and e',
 exp:'JK/SK letter sounds with CVC words (o, u, e); Language 2023 Strand C phonics: short vowels in consonant-vowel-consonant words',
 words:'cot|dot|got|hot|job|jog|log|mom|not|pot|nod|pod|tot|box|fox|dog|hog|lot|bug|bun|bus|cub|cup|cut|dug|fun|gum|hug|hum|hut|jug|mud|mug|nut|pup|run|rub|rug|sun|sum|tub|bud|bed|beg|bet|get|hen|jet|leg|let|men|met|net|pen|peg|pet|red|set|ten|vet|web|wet|yes|yet|den|egg|hem',
 sents:{dog:'My dog likes to run in the park.',hot:'Cocoa is hot, so blow on it first.',fox:'A red fox ran across the snow.',mom:'Mom made pancakes on Sunday.',
  sun:'The sun feels warm on my face.',cup:'I drink milk from a blue cup.',bus:'We ride the bus to school.',nut:'A squirrel hid a nut in the tree.',
  pen:'I write my name with a pen.',bed:'It is time for bed.',hen:'The hen laid an egg this morning.',web:'A spider spun a web in the corner.',
  wet:'My boots are wet from the snow.',run:'Let us run around the field.',bug:'A bug landed on my arm.',mud:'The puppy jumped in the mud.',
  yes:'Yes, we can go to the park.',jet:'A jet flew high in the sky.',leg:'My leg is strong after the run.',rug:'The rug is soft under my feet.',
  egg:'Our hen gave us a brown egg.'}});

SPELLD.add({id:'s1.5',world:1,n:5,grade:'0',title:'Sight words',pattern:'name and high-frequency sight words',
 exp:'JK/SK early literacy: high-frequency and sight words (the, I, a, to, and, my, is) and name-writing practice; Language 2023 Strand C high-frequency words',
 words:'a|all|am|and|are|at|away|be|big|blue|can|come|do|down|find|for|funny|get|go|help|here|he|i|in|is|it|look|me|my|no|not|on|one|play|red|run|said|see|she|so|the|three|to|two|up|we|where|yes|you',
 sents:{a:'I see a red bird.',and:'Cats and dogs can be good pets.',big:'The moose is big and strong.',blue:'The sky is blue today.',
  can:'We can skate on the pond.',come:'Please come to the park with me.',down:'The leaves float down in the fall.',find:'Can you find the red ball?',
  for:'This drawing is for you.',go:'Let us go to the beach.',help:'Can you help me tidy up?',here:'Come here and see the snow.',
  i:'I like to read at night.',is:'It is cold in January.',it:'I like it when it snows.',look:'Look at the big red barn.',
  me:'Please read the story to me.',my:'My favourite colour is blue.',not:'It is not too cold today.',play:'Let us play outside after lunch.',
  see:'I see a rainbow in the sky.',she:'She feeds the ducks at the pond.',the:'The bus is here at eight.',to:'We walk to school together.',
  up:'Wake up, it is a sunny day.',we:'We made a snowman today.',you:'Thank you for helping me.',he:'He likes to skate on the ice.',
  said:'Mom said we can go outside.',funny:'That joke was really funny.',where:'Where is my hat?'}});

SPELLD.add({id:'s1.6',world:1,n:6,grade:'0',title:'Count the syllables',pattern:'syllable count, first letter of each beat',
 exp:'JK/SK early literacy: syllables and word parts (clapping and counting beats); Language 2023 Strand C phonological awareness: syllables in spoken words',
 words:'rabbit|puppy|kitten|happy|tiger|pencil|sunset|napkin|hockey|maple|canoe|beaver|bunny|pillow|blanket|garden|winter|summer|dinner|basket|rocket|dolphin|monkey|pizza|lemon|carrot|turtle|sister|mitten|snowman|sandbox|popcorn|raincoat|cupcake|bedtime|outside|under|little|donkey|bicycle|banana|elephant|kangaroo|tomato|butterfly|umbrella|jellyfish|family',
 sents:{rabbit:'A rabbit hops across the green grass.',puppy:'The puppy wagged its tail.',kitten:'The kitten curled up for a nap.',
  tiger:'A tiger has orange and black stripes.',pencil:'I wrote my name with a pencil.',sunset:'We watched the sunset over the lake.',
  hockey:'Hockey is a fun game in Canada.',maple:'Maple syrup comes from maple trees.',canoe:'We paddled our canoe across the lake.',
  beaver:'A beaver builds a dam with sticks.',garden:'We grew carrots in our garden.',winter:'Snow falls in winter in Ontario.',
  dinner:'We eat dinner together at six.',dolphin:'A dolphin can jump out of the water.',monkey:'The monkey swung from the tree.',
  lemon:'A lemon is yellow and juicy.',turtle:'The turtle sunned itself on a log.',snowman:'We built a snowman in the yard.',
  popcorn:'We eat popcorn at the movies.',bicycle:'I ride my bicycle to the park.',banana:'A banana is a yummy snack.',
  elephant:'An elephant has a long trunk.',butterfly:'A butterfly landed on the flower.',umbrella:'Bring an umbrella if it rains.',
  family:'Our family goes camping in summer.'}});

SPELLD.add({id:'s1.7',world:1,n:7,grade:'0',title:'Colours and numbers',pattern:'colour and number words',
 exp:'JK/SK early math and literacy: colour words, number words to twenty, ordinal words and Canadian coin names (loonie, toonie); Language 2023 Strand C high-frequency words',
 words:"red|blue|pink|grey|black|white|green|brown|orange|purple|yellow|tan|gold|navy|teal|lime|rose|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|first|second|third|fourth|fifth|sixth|quarter|nickel|dime|loonie|toonie",
 sents:{
  "red":"Maple leaves can turn red in the fall.",
  "blue":"The sky is blue on a sunny day.",
  "pink":"The pink flower smells sweet.",
  "grey":"Grey clouds can bring rain.",
  "black":"A black bear lives in the forest.",
  "white":"Snow is white and cold.",
  "green":"Frogs are often green.",
  "brown":"A beaver has brown fur.",
  "orange":"An orange is a healthy snack.",
  "purple":"Purple is my favourite colour.",
  "yellow":"The sun is big and yellow.",
  "navy":"My hoodie is navy blue.",
  "one":"I have one little dog.",
  "two":"Two kids built a sandcastle.",
  "three":"We saw three geese on the lake.",
  "five":"A hand has five fingers.",
  "ten":"I can count to ten.",
  "twenty":"We counted twenty snowflakes.",
  "loonie":"A loonie has a loon on it.",
  "toonie":"A toonie has a polar bear on it.",
  "nickel":"A nickel is worth five cents.",
  "first":"I was first in the line.",
  "sixth":"She finished in sixth place.",
  "quarter":"A quarter is worth twenty-five cents."}});

})();
