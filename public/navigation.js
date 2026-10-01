/* Give the game's screens browser history so mouse Back stays in the game. */
const gameShow=show;
const gameScreens=new Set(['home','map','binder','shop','arcade','parents','play','game']);
let restoringScreen=false;
try{history.replaceState({...history.state,keyloriaScreen:'home'},'')}catch(e){}
show=function(id){
 const previous=screen;
 gameShow(id);
 if(!restoringScreen&&id!==previous&&gameScreens.has(id)){
  try{history.pushState({keyloriaScreen:id},'')}catch(e){}
 }
};
addEventListener('popstate',event=>{
 const saved=event.state?.keyloriaScreen;
 if(!gameScreens.has(saved))return;
 restoringScreen=true;
 try{closeModal();show(saved==='game'?'arcade':saved==='play'?'map':saved)}finally{restoringScreen=false}
});
