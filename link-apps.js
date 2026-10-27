// App links use the common browser login without putting credentials or tokens
// in a URL. This script reads no account information.
function addRecipeLinks(){
 for(const bar of document.querySelectorAll('.installation-top')){
  if(bar.querySelector('[data-recipe-switch]'))continue;
  const a=document.createElement('a');a.href='/rezepte/';a.className='button secondary recipe-app-switch';a.dataset.recipeSwitch='';a.textContent='🍲 Zu den Rezepten';bar.append(a);
 }
}
new MutationObserver(addRecipeLinks).observe(document.getElementById('app'),{childList:true,subtree:true});
addRecipeLinks();
