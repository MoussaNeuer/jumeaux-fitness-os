// ===== Rendu =====
function render(){
  const v = S.view;
  $('root').innerHTML = v==='land' ? landing() : v==='portal' ? portal() : shell(v==='net' ? viewNet() : v==='etab' ? viewEtab() : v==='rap' ? viewMisc('Rapports') : v==='set' ? viewMisc('Paramètres') : viewSalle());
  if(v==='salle' && S.tab==='mem') drawTable();
  if(v==='land') initFx();
  if(v==='portal'&&!document.body.classList.contains('pres')) document.body.style.background = 'var(--bg)';
}
render();
// Service worker simple (cache des ressources statiques uniquement)
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
