/* Card descriptions for the Champion and Mythic forms, in SPECIES order. */
const EVOLUTION_FLAVOR=[
 ["It plants every petal it sneezes, hoping for a garden.","Wildflowers bloom along the paths it walks."], // Sproutle
 ["It uses its tail fin to rescue leaves from the pond.","The pond creatures follow it on its daily patrol."], // Drizzit
 ["It races beside storm clouds to learn their secret paths.","It returns before thunder to warn the meadow."], // Zipp
 ["It collects smooth stones to make a tiny doorstep.","Travelers rest behind the stone walls it builds."], // Pebbo
 ["It lights a campfire with the flame on its tail.","Its campfire has become the village meeting place."], // Embit
 ["It trades shiny rocks with friends for their stories.","Each stone in its cave marks a friendship."], // Glintle
 ["It follows moonbeams to find sleeping flowers.","It keeps watch until the first flower opens."], // Duskit
 ["It learns the names of winds by riding them.","It carries messages between faraway nests."], // Breezle
 ["It hides snowflakes in its scarf for summer.","Its summer snowflakes cool the whole village."], // Frostby
 ["It sketches star shapes while making wishes.","Its drawings help lost friends find constellations."], // Twinkit
 ["It carries pinecones to places where trees are scarce.","A new grove grows from its traveling collection."], // Beetix
 ["It leaves friendly notes inside the closet.","Children keep the notes beside their beds."], // Wispy
 ["It taps a tune to help the workshop keep time.","Its workshop song plays from every new clock."], // Cogby
 ["It draws maps of the dunes with its footprints.","Travelers trust its maps when the wind erases paths."], // Dunelet
 ["It shares bubblegum with anyone feeling gloomy.","Its treats bring laughter to rainy picnics."], // Fizzlet
 ["It learns to rumble softly near sleeping friends.","Its quiet call guides travelers through fog."], // Rumblet
 ["It seals tiny wishes inside floating bubbles.","Friends gather when its wish bubbles come home."], // Bubbly
 ["It warms stones so cold friends can sit together.","Its warm stone circle becomes a winter shelter."], // Magmite
 ["It traces bright paths for night travelers.","Its ribbons tell stories across the sky."], // Glowbit
 ["It learns which keys open forgotten doors.","It returns lost keys to their rightful homes."], // Qwertle
 ["It plants seeds in the little garden on its back.","Birds visit its traveling garden every spring."], // Mossling
 ["It hoots to wake the flowers before sunrise.","The forest waits for its morning song."], // Fernix
 ["It leaves glowing crumbs along forest trails.","Its lantern mushrooms mark the way home."], // Shroomie
 ["It practices brave speeches beneath its acorn helmet.","It speaks for shy friends at the woodland council."], // Acornet
 ["It blinks in patterns to signal nearby friends.","Its light signals guide travelers through dark woods."], // Blinkit
 ["It stacks pebbles to mark safe climbing routes.","Climbers follow its stone markers to the summit."], // Craggle
 ["It knits warm nests from its fluffy coat.","Its mountain nests welcome any chilly visitor."], // Yetini
 ["It steers lost birds toward the mountain pass.","Migrating flocks greet it like an old friend."], // Gustling
 ["It digs little windows into its tunnels.","Its underground windows reveal hidden crystal rooms."], // Burrowby
 ["It carries tea to friends climbing the mountain.","Visitors share stories at its summit teahouse."], // Zenpeak
 ["It swaps stolen sandwiches for seashells.","It opens a beach stall with a very odd menu."], // Pinchip
 ["It shelters baby fish beneath its coral sprig.","A whole reef gathers around its shell."], // Shellby
 ["It braids kelp into anchors for small boats.","The harbor keeps its kelp knots for stormy days."], // Ripplet
 ["It teaches shy fish to dive beside it.","Its scarf becomes the flag of the diving club."], // Puffip
 ["It rolls beside beach balls to learn their game.","Beachgoers invite it to every seaside match."], // Spinnow
 ["It uses a lost arm to point out treasure.","Its starry trail leads friends to hidden tide pools."], // Starfry
 ["It listens for travelers beyond the dunes.","It guides them toward water by moonlight."], // Fennip
 ["It rolls a little sun to warm desert seeds.","Flowers open wherever its sun has passed."], // Scarabit
 ["It shares its water with wilted desert plants.","A green path grows between the scattered oases."], // Spinnet
 ["It fans its frill to signal the sunrise.","Desert creatures gather for its morning colors."], // Frillip
 ["It writes questions in the sand for passing friends.","Its sand messages become a desert game."], // Sidlet
 ["It trades riddles with the stones at the ruins.","Its favorite answers are carved beside the doorway."], // Sphinkit
 ["It tucks small birds beneath its fluffy tail.","The birds return each winter to the same shelter."], // Flurrkit
 ["It carves silly shapes while sliding on the ice.","Its icy sculptures greet visitors to the lake."], // Blubbit
 ["It shakes snow from trees to clear the path.","Travelers follow the trail beneath its warm coat."], // Mammel
 ["It learns where fish hide beneath the ice.","It shares its catch with the whole shore."], // Pebbill
 ["It circles above friends lost in snowfall.","Its shadow points them toward the mountain cabin."], // Hoolume
 ["It hums a tune beneath the northern lights.","The lights seem to answer with shifting colors."], // Glintle
 ["It lights small floating markers through the fog.","The swamp has a safe path named after it."], // Croaklet
 ["It tries one unfamiliar path each morning.","Its glowing spots mark discoveries for other explorers."], // Sparkewt
 ["It watches shadows with the eyes on its wings.","Night creatures rest safely beneath its wings."], // Mothkin
 ["It leaves its lantern outside for late travelers.","The forest knows its doorway by the warm glow."], // Jarslug
 ["It plays hide and seek among the reeds.","Its flame becomes a beacon when friends need help."], // Flickit
 ["It grows little fungus shelves for woodland snacks.","Forest friends gather around its living picnic table."], // Shelfpup
 ["It fixes the clocks no one remembers to wind.","The town hears its cheerful call every hour."], // Tickoo
 ["It makes tea for friends waiting in the rain.","Its kettle becomes the heart of the station."], // Kettlet
 ["It coils its spring to launch paper airplanes.","Its inventions travel from one workshop to another."], // Wyndle
 ["It writes tiny poems on scraps of paper.","Its paper poems fill the library's quiet corners."], // Clackit
 ["It leaves glowing pebbles outside dark alleys.","Neighbors follow its lights home through the fog."], // Glimmet
 ["It repairs squeaky doors for sleepy neighbors.","Its repaired doors open onto many new friendships."], // Rivlet
 ["It offers its cloud-soft wool to nesting birds.","Birds carry its wool between floating islands."], // Puffleece
 ["It ties messages to the bow on its tail.","Its sky mail connects friends across Keyloria."], // Kitelet
 ["It guards its cloud-top nest from sudden rain.","Other sky creatures shelter there during storms."], // Grifkin
 ["It laughs when rain and sparks meet.","Its laughter turns stormy days into celebrations."], // Zaplet
 ["It carries snacks to friends in hard-to-reach places.","Its basket visits every rooftop in town."], // Floatot
 ["It sneezes colors into the gray morning clouds.","Children search the sky for its surprise rainbows."], // Whalet
 ["It follows a shooting star across the night.","Its stardust trail shows others where to look."], // Sparkit
 ["It sketches dream constellations from its moon perch.","Stargazers name the patterns it dreams."], // Twinkit
 ["It hears distant meteors through its crystal horns.","It warns the sky village before meteors arrive."], // Novakin
 ["It learns every visitor's name at the citadel gate.","Old travelers return just to greet their friend."], // Squirkle
 ["It teaches its little moon to follow safely.","Its moon lights the way for lonely travelers."], // Globbit
 ["It marks moon paths with bright helmet prints.","New explorers follow its prints between craters."], // Lunabun
];
