/* math-teach-1.js : "watch me" mini-lessons for worlds 1-4 (m1.1 to m4.7, 28 topics).
 Shown before each math lesson. Self-registering; writes window.MATH_TEACH[id] = {ex, a, steps, aid?, tip?}.
 Rules: 2-5 steps, each step t is 28 characters or fewer, the last step shows the solved problem,
 the answer a is typed exactly as the topic expects. Ontario curriculum strategies, Canadian context. */
(function(){var T=(window.MATH_TEACH=window.MATH_TEACH||{});
T['m1.1']={ex:'How many dots?', a:'5', aid:{dots:[5],layout:'row'}, steps:[{t:'Touch each dot'},{t:'1, 2, 3, 4, 5'},{t:'5 dots!'}], tip:'Touch and count'};
T['m1.2']={ex:'Type 3', a:'3', aid:{dots:[3],layout:'row'}, steps:[{t:'Look at the number: 3'},{t:'Find 3 on the keyboard'},{t:'Press 3'}], tip:'Match the number'};
T['m1.3']={ex:'1 more than 13', a:'14', aid:{dots:[13],layout:'scatter'}, steps:[{t:'Start at 13'},{t:'1 more: 14'},{t:'1 more than 13 = 14'}], tip:'Next number!'};
T['m1.4']={ex:'Smaller: 4 or 5', a:'4', aid:{dots:[4,5],layout:'row'}, steps:[{t:'Which is less?'},{t:'Count: 4, then 5'},{t:'Smaller: 4 or 5 = 4'}], tip:'Less is first'};
T['m1.5']={ex:'5 = 4 + _', a:'1', aid:{dots:[4,1],layout:'frame',obj:'leaf'}, steps:[{t:'4 and what makes 5?'},{t:'4 + 1 = 5'},{t:'5 = 4 + 1, so _ is 1'}], tip:'Make 5!'};
T['m1.6']={ex:'1 8 1 8 _', a:'1', steps:[{t:'Look for the repeat'},{t:'1 8 | 1 8 | _'},{t:'Next is 1'}], tip:'Find the repeat'};
T['m1.7']={ex:'How many goals?', a:'8', aid:{tally:8}, steps:[{t:'Count the marks'},{t:'5 and 3 more'},{t:'8 goals!'}], tip:'Count in fives'};
T['m2.1']={ex:'1 + 4', a:'5', aid:{dots:[1,4],layout:'row'}, steps:[{t:'Start at 4'},{t:'Count on 1: 5'},{t:'1 + 4 = 5'}], tip:'Count on!'};
T['m2.2']={ex:'4 − 2', a:'2', aid:{dots:[4],take:2,layout:'row'}, steps:[{t:'Start with 4 dots'},{t:'Cross out 2'},{t:'2 are left: 4 − 2 = 2'}], tip:'Take away!'};
T['m2.3']={ex:'2 + 3 = 5, so 5 − 2 = _', a:'3', steps:[{t:'Use the same 3 numbers'},{t:'2, 3 and 5 make a family'},{t:'5 − 2 = 3'}], tip:'Flip the facts'};
T['m2.4']={ex:'20, 18, 16, 14, _', a:'12', steps:[{t:'Each jump is 2 less'},{t:'14, then 12'},{t:'20, 18, 16, 14, 12'}], tip:'Count by 2s'};
T['m2.5']={ex:'1 ten 6 ones', a:'16', aid:{ten:[1,6]}, steps:[{t:'1 ten = 10'},{t:'6 ones = 6'},{t:'10 + 6 = 16'}], tip:'Tens, then ones'};
T['m2.6']={ex:'6 = 5 + _', a:'1', steps:[{t:'Both sides must match'},{t:'5 + _ must be 6'},{t:'5 + 1 = 6, so _ is 1'}], tip:'Balance it!'};
T['m2.7']={ex:'2:00 to 9:00. Hours?', a:'7', steps:[{t:'Start at 2 o\'clock'},{t:'3, 4, 5, 6, 7, 8, 9'},{t:'2:00 to 9:00 = 7 hours'}], tip:'Count the hours'};
T['m3.1']={ex:'8 + 4', a:'12', steps:[{t:'Make 10 first: 8 + 2'},{t:'10 + 2 more = 12'},{t:'8 + 4 = 12'}], tip:'Make 10!'};
T['m3.2']={ex:'Before 14?', a:'13', steps:[{t:'Count back from 14'},{t:'14, then 13'},{t:'Before 14 = 13'}], tip:'Count back 1'};
T['m3.3']={ex:'3 dimes = _¢', a:'30', aid:{coins:[10,10,10]}, steps:[{t:'1 dime = 10¢'},{t:'10, 20, 30'},{t:'3 dimes = 30¢'}], tip:'Count by 10s'};
T['m3.4']={ex:'Tag 4, Tennis 3. Total?', a:'7', aid:{bars:[{l:'Tag',v:4},{l:'Tennis',v:3}]}, steps:[{t:'Tag has 4'},{t:'Tennis has 3'},{t:'4 + 3 = 7'}], tip:'Add the bars'};
T['m3.5']={ex:'Sides in a triangle?', a:'3', aid:{shape:{name:'triangle'}}, steps:[{t:'Trace each side'},{t:'1, 2, 3'},{t:'A triangle has 3 sides'}], tip:'Trace with finger'};
T['m3.6']={ex:'Rule +1: 32, 33, 34, _', a:'35', steps:[{t:'Rule: add 1 each time'},{t:'34 + 1 = 35'},{t:'Next number is 35'}], tip:'Find the rule'};
T['m3.7']={ex:'2 canoes, gets 3 more', a:'5', steps:[{t:'Start with 2'},{t:'Add 3 more'},{t:'2 + 3 = 5'}], tip:'Look for key words'};
T['m4.1']={ex:'45 − 5', a:'40', steps:[{t:'45 has 4 tens, 5 ones'},{t:'Take away the 5 ones'},{t:'45 − 5 = 40'}], tip:'Tens, then ones'};
T['m4.2']={ex:'4 tens and 1 one', a:'41', aid:{ten:[4,1]}, steps:[{t:'4 tens = 40'},{t:'1 one = 1'},{t:'40 + 1 = 41'}], tip:'Line up places'};
T['m4.3']={ex:'70, 75, _, 85', a:'80', steps:[{t:'Each jump is 5'},{t:'75 + 5 = 80'},{t:'70, 75, 80, 85'}], tip:'Count by 5s'};
T['m4.4']={ex:'3 groups of 8', a:'24', aid:{dots:[8,8,8]}, steps:[{t:'Three groups of 8'},{t:'8 + 8 + 8'},{t:'3 × 8 = 24'}], tip:'Equal groups!'};
T['m4.5']={ex:'What fraction is shaded?', a:'3/4', aid:{frac:{n:3,d:4}}, steps:[{t:'4 equal parts in all'},{t:'3 parts are shaded'},{t:'Shaded over all: 3/4'}], tip:'Top over bottom'};
T['m4.6']={ex:'10¢ + 5¢ = _¢', a:'15', aid:{coins:[10,5]}, steps:[{t:'Start with the 10¢ dime'},{t:'Add the 5¢ nickel'},{t:'10 + 5 = 15¢'}], tip:'Biggest coin first'};
T['m4.7']={ex:'Equilateral triangle: lines?', a:'3', steps:[{t:'Fold so the halves match'},{t:'Try 3 folds'},{t:'3 lines of symmetry'}], tip:'Fold and check'};
})();
