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
 sents:{'bat':'The bat hung upside down.','mat':'Wipe your feet on the mat.','rat':'A rat is small and quick.','sat':'The puppy sat by the door.','pat':'I pat my dog on the head.','fat':'The pumpkin was big and fat.','flat':'The pizza box is flat.','chat':'We chat on the bus.','that':'Look at that big red truck.','ran':'The kids ran to the swings.','tan':'The sand is tan and warm.','scan':'Please scan the page for me.','dig':'We dig in the sand.','wig':'The clown wore a silly wig.','fig':'I ate a fig for a snack.','twig':'A twig snapped under my boot.','jig':'We danced a jig at the party.','drop':'Do not drop the glass jar.','chop':'Chop the carrots for the soup.','flop':'The pup did a silly flop.','crop':'The farmer grew a big crop.','jug':'Fill the jug with cold water.','dug':'The dog dug a hole in the yard.','snug':'I am snug in my warm bed.','plug':'Put the plug in the wall.',cat:'The cat sat on the mat.',hat:'Mom wears a warm hat in winter.',man:'The man rode his bike to town.',pan:'Mom cooks pancakes in a big pan.',
  fan:'A fan keeps us cool on hot days.',can:'I can hop like a bunny.',van:'The van drove us to the park.',big:'A moose is big and strong.',
  pig:'The pig rolled in the mud.',top:'Stand on top of the hill and look.',hop:'The frog can hop very far.',mop:'I use a mop to clean the floor.',
  pop:'The balloon went pop!',bug:'A bug crawled up the green leaf.',hug:'I give Mom a big hug.',mug:'I drink cocoa from my mug.',
  rug:'The rug is soft and warm.',plan:'We made a plan for the day.',tug:'The dog gave a gentle tug.',stop:'Please stop at the red light.'}});

SPELLD.add({id:'s1.2',world:1,n:2,grade:'0',title:'Beginning sounds',pattern:'initial consonant sounds, picture nouns',
 exp:'JK/SK early literacy: initial sounds in picture-word nouns (Kindergarten Program 2016); Language 2023 Strand C phonological awareness',
 words:'bee|bus|ball|boat|bear|bird|book|car|cup|cake|cow|drum|dog|door|duck|fish|frog|fork|fox|goat|gift|hen|horse|hockey|house|hand|jam|jar|jet|kite|key|lamp|leaf|lion|loon|lake|moon|moose|milk|maple|nest|nut|net|nail|pen|pot|puck|pie|rain|rope|ring|sun|sock|star|snow|sled|skate|seal|sand|tent|toque|toy|tree|vase|wagon|wolf|wing|zoo|zebra',
 sents:{'bus':'The yellow bus stops at my house.','ball':'I kick the ball to my friend.','bear':'A black bear lives in the woods.','bird':'A bird sings in the tree.','book':'I read a book before bed.','car':'Dad drives our car to work.','cup':'Please pour milk in my cup.','cake':'We ate a cake at the party.','cow':'The cow says moo on the farm.','drum':'She plays the drum in band.','dog':'My dog likes to fetch sticks.','door':'Please close the door.','duck':'A duck swims in the pond.','fish':'The fish swims in the tank.','fork':'Use a fork for your pasta.','gift':'I got a gift for my cousin.','hen':'The hen laid one brown egg.','horse':'The horse trotted through the field.','house':'Our house has a red door.','hand':'Wash your hand before lunch.','jam':'I spread jam on my toast.','jar':'Put the cookies in a jar.','jet':'A jet flew high in the sky.','key':'Turn the key to open the door.','lamp':'The lamp lights up my room.','leaf':'A red leaf fell from the tree.','lion':'The lion roared at the zoo.','lake':'We swam in the lake.','moon':'The moon glows at night.','milk':'I drink milk with my lunch.','nest':'The bird built a nest.','nut':'The squirrel found a nut.','net':'The fisher pulled up the net.','nail':'Dad uses a nail for the shelf.','pen':'I write with a blue pen.','pot':'The soup is in the pot.','pie':'We ate apple pie for dessert.','rain':'The rain fell on the roof.','rope':'The climber held a strong rope.','ring':'The ring toss game was fun.','sun':'The sun is hot today.','sock':'I put on a warm sock.','star':'A star twinkles in the sky.','snow':'Snow covers the yard in winter.','skate':'I skate on the ice rink.','seal':'A seal swims in the cold sea.','sand':'We built a castle with sand.','tent':'We slept in a tent at camp.','toy':'My favourite toy is a robot.','tree':'A tall tree grows in our yard.','vase':'Put the flowers in the vase.','wagon':'We pulled the kids in a wagon.','wolf':'A wolf howled in the forest.','wing':'A bird flapped its wing.',bee:'A bee buzzed past the flowers.',boat:'We rode in a boat on the lake.',moose:'A moose lives in the forest.',hockey:'We play hockey on the frozen pond.',
  maple:'Maple trees turn red in the fall.',loon:'A loon calls across the lake.',toque:'Keep your toque on when it is cold.',puck:'The puck slid across the ice.',
  sled:'The sled zoomed down the hill.',fox:'A red fox ran into the woods.',kite:'My kite flew high in the wind.',zoo:'We saw a lion at the zoo.',
  zebra:'A zebra has black and white stripes.',frog:'The frog jumped into the pond.',goat:'The goat ate the green grass.'}});

SPELLD.add({id:'s1.3',world:1,n:3,grade:'0',title:'Short a and i',pattern:'CVC short a and i',
 exp:'JK/SK letter names and sounds with CVC words (a, i); Language 2023 Strand C phonics: short vowels in consonant-vowel-consonant words',
 words:'bad|bag|cab|cap|dab|dam|gap|jab|lab|lad|map|nap|pal|rag|ram|rap|sad|sap|tab|tap|wax|yam|zap|jam|ham|gas|pad|bib|bin|bit|dip|fin|fit|hid|hip|kit|lid|lip|mix|pin|pit|rib|rip|sip|sit|six|tip|tin|win|wig|zip',
 sents:{'bad':'I had a bad dream.','cab':'We took a cab home.','dab':'Dab the paint with a sponge.','dam':'Beavers build a dam in the creek.','gap':'There is a gap in the fence.','jab':'Do not jab the paper with a pencil.','lab':'We did a science lab at school.','lad':'The lad rode his bike to town.','nap':'The baby had a nap at noon.','pal':'Mia is my best pal.','rag':'Wipe the table with a rag.','ram':'A ram has big curved horns.','rap':'Rap on the door before you come in.','sad':'The puppy was sad to say goodbye.','sap':'Maple sap drips from the tree.','tab':'Open a new tab on the browser.','wax':'Crayons are made of wax.','yam':'Mom baked a sweet yam.','zap':'The video game made a zap sound.','gas':'The car needs gas today.','bib':'The baby wore a bib at lunch.','bit':'I ate a bit of cheese.','dip':'Dip your bread in the soup.','fin':'The fish has a fin.','hid':'The kitten hid under the bed.','hip':'We danced the hip hop at the party.','kit':'The first aid kit is in the car.','lip':'Lip balm keeps my lip soft.','pit':'The cherry pit is hard.','rib':'The rib is a bone in your chest.','rip':'Careful, do not rip the paper.','sip':'Take a sip of water.','tin':'The cookies are in a tin.','win':'Our team hopes to win today.','wig':'The actor wore a wig.',bag:'I packed my bag for school.',cap:'Put on your cap, it is sunny.',map:'We read a map of Ontario.',jam:'I like strawberry jam on toast.',
  tap:'Turn off the tap after you wash.',pin:'Mom used a pin to fix my jacket.',sit:'Please sit by me on the bus.',tip:'The pencil has a sharp tip.',
  zip:'Zip your coat up before you go out.',lid:'Put the lid on the box.',six:'We have six eggs in the basket.',bin:'Put the paper in the bin.',
  mix:'We mix milk and cocoa to drink.',fit:'My new boots fit me well.',pad:'I drew on a pad of paper.',ham:'Dad made a ham sandwich for lunch.'}});

SPELLD.add({id:'s1.4',world:1,n:4,grade:'0',title:'Short o, u and e',pattern:'CVC short o, u and e',
 exp:'JK/SK letter sounds with CVC words (o, u, e); Language 2023 Strand C phonics: short vowels in consonant-vowel-consonant words',
 words:'cot|dot|got|hot|job|jog|log|mom|not|pot|nod|pod|tot|box|fox|dog|hog|lot|bug|bun|bus|cub|cup|cut|dug|fun|gum|hug|hum|hut|jug|mud|mug|nut|pup|run|rub|rug|sun|sum|tub|bud|bed|beg|bet|get|hen|jet|leg|let|men|met|net|pen|peg|pet|red|set|ten|vet|web|wet|yes|yet|den|egg|hem',
 sents:{'cot':'The baby sleeps in a cot.','dot':'Draw a dot on the page.','got':'I got a new sticker today.','job':'Feeding the fish is my job.','jog':'We jog around the track.','log':'We sat on a log by the lake.','not':'I am not hungry yet.','pot':'Stir the soup in the pot.','nod':'I nod my head to say yes.','pod':'Peas grow inside a pod.','tot':'A tot played in the sandbox.','box':'The toys are in a box.','hog':'The farmer fed the hog.','lot':'The park has a lot of trees.','bun':'I ate a cinnamon bun.','cub':'The bear cub followed its mom.','cut':'Cut the paper in half.','dug':'The puppy dug in the sand.','fun':'Swimming is so much fun.','gum':'Do not stick gum under the desk.','hug':'Give your mom a big hug.','hum':'I hum a song in the car.','hut':'The fishers sat in a small hut.','jug':'Pour the juice from the jug.','mug':'She sipped tea from a mug.','pup':'The pup wagged its tail.','rub':'Rub your hands to warm them up.','sum':'Add the numbers to find the sum.','tub':'Wash the dog in the tub.','bud':'A flower bud is green.','beg':'The puppy will sit and beg.','bet':'I bet we win the game.','get':'Please get your boots on.','let':'Let me help you carry that.','men':'The men helped fix the bridge.','met':'I met a new friend today.','net':'The goalie stood by the net.','peg':'Hang your coat on the peg.','pet':'My pet cat likes to nap.','red':'A red maple leaf is pretty.','set':'Set the table for dinner.','ten':'I counted to ten.','vet':'Our dog went to the vet.','yet':'The snow has not come yet.','den':'The fox lives in a den.','hem':'Mom sewed a hem on my pants.',dog:'My dog likes to run in the park.',hot:'Cocoa is hot, so blow on it first.',fox:'A red fox ran across the snow.',mom:'Mom made pancakes on Sunday.',
  sun:'The sun feels warm on my face.',cup:'I drink milk from a blue cup.',bus:'We ride the bus to school.',nut:'A squirrel hid a nut in the tree.',
  pen:'I write my name with a pen.',bed:'It is time for bed.',hen:'The hen laid an egg this morning.',web:'A spider spun a web in the corner.',
  wet:'My boots are wet from the snow.',run:'Let us run around the field.',bug:'A bug landed on my arm.',mud:'The puppy jumped in the mud.',
  yes:'Yes, we can go to the park.',jet:'A jet flew high in the sky.',leg:'My leg is strong after the run.',rug:'The rug is soft under my feet.',
  egg:'Our hen gave us a brown egg.'}});

SPELLD.add({id:'s1.5',world:1,n:5,grade:'0',title:'Sight words',pattern:'name and high-frequency sight words',
 exp:'JK/SK early literacy: high-frequency and sight words (the, I, a, to, and, my, is) and name-writing practice; Language 2023 Strand C high-frequency words',
 words:'a|all|am|and|are|at|away|be|big|blue|can|come|do|down|find|for|funny|get|go|help|here|he|i|in|is|it|look|me|my|no|not|on|one|play|red|run|said|see|she|so|the|three|to|two|up|we|where|yes|you',
 sents:{'all':'We all ate lunch together.','am':'I am six years old.','are':'You are my best friend.','at':'Meet me at the park.','away':'The ball rolled away.','be':'Please be quiet in the library.','do':'What do you want to do?','get':'Please get your coat.','in':'The cat is in the box.','no':'No, thank you, I am full.','on':'The book is on the desk.','one':'I have one red ball.','red':'A red apple is my snack.','run':'Let us run to the bus.','so':'I am so happy today.','three':'We have three pets.','two':'Two birds sat on the fence.','yes':'Yes, we can go outside.',a:'I see a red bird.',and:'Cats and dogs can be good pets.',big:'The moose is big and strong.',blue:'The sky is blue today.',
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
 sents:{'happy':'I feel happy when I play.','napkin':'Wipe your mouth with a napkin.','bunny':'The bunny hops across the grass.','pillow':'My head rests on a soft pillow.','blanket':'Pull the blanket up to your chin.','summer':'We swim all summer long.','basket':'Put the apples in the basket.','rocket':'A rocket zoomed up to space.','pizza':'We ordered pizza for supper.','carrot':'A carrot is crunchy and orange.','sister':'My sister likes to draw.','mitten':'I lost one mitten in the snow.','sandbox':'We played in the sandbox.','raincoat':'Wear your raincoat when it rains.','cupcake':'I decorated a cupcake with sprinkles.','bedtime':'It is almost bedtime.','outside':'We play outside at recess.','under':'The cat hid under the chair.','little':'A little bird sang a song.','donkey':'The donkey pulled the cart.','kangaroo':'A kangaroo hops very fast.','tomato':'I like a tomato on my sandwich.','jellyfish':'A jellyfish floats in the sea.',rabbit:'A rabbit hops across the green grass.',puppy:'The puppy wagged its tail.',kitten:'The kitten curled up for a nap.',
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
 sents:{'tan':'My hat is tan.','gold':'The medal is shiny and gold.','teal':'The lake looked teal in the sun.','lime':'A lime is green and sour.','rose':'A pink rose smells sweet.','zero':'The score was zero to zero.','four':'I have four crayons in my box.','six':'A hockey team has six players on ice.','seven':'Seven kids stood in line.','eight':'Eight apples fit in the bag.','nine':'Nine kids came to my party.','eleven':'The soccer team has eleven players.','twelve':'There are twelve months in a year.','second':'I came in second place.','third':'She was third in the race.','fourth':'Today is the fourth day of camp.','fifth':'He sat in the fifth row.','dime':'A dime is a small coin.',
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
