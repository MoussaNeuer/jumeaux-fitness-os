// ============================================================================
// Point d'entrée : routage, rendu global, horloge et raccourcis
// ============================================================================

const TITLES = {
  land: 'Jumeaux Fitness OS — Le réseau fitness, enfin connecté',
  net: 'Vue générale du réseau — Jumeaux Fitness OS',
  fin: 'Finance & comptabilité — Jumeaux Fitness OS',
  perf: 'Performance des salles — Jumeaux Fitness OS',
  team: 'Équipe & accès — Jumeaux Fitness OS',
  etab: 'Établissements — Jumeaux Fitness OS',
  exp: 'Expansion — Jumeaux Fitness OS',
  rap: 'Rapports — Jumeaux Fitness OS',
  set: 'Paramètres — Jumeaux Fitness OS',
  tarifs: 'Tarifs & promotion — Jumeaux Fitness OS',
  salle: 'Back-office — Jumeaux Fitness OS',
  portal: 'Espace adhérent — Jumeaux Fitness OS',
  checkin: 'Contrôle d’accès — Jumeaux Fitness OS'
};

function render() {
  const root = $('root');
  if (!root) return;
  const v = S.view;
  document.body.classList.toggle('borne-mode', v === 'checkin');
  applySiteTheme();

  if (v === 'checkin') {
    root.innerHTML = viewCheckin();
    document.title = TITLES.checkin;
    window.onscroll = null;
    return;
  }

  if (v === 'land') root.innerHTML = landing();
  else if (v === 'portal') root.innerHTML = portal();
  else if (v === 'net') root.innerHTML = shell(viewNet());
  else if (v === 'fin') root.innerHTML = shell(viewFin());
  else if (v === 'perf') root.innerHTML = shell(viewPerf());
  else if (v === 'team') root.innerHTML = shell(viewTeam());
  else if (v === 'etab') root.innerHTML = shell(viewEtab());
  else if (v === 'exp') root.innerHTML = shell(viewExp());
  else if (v === 'rap') root.innerHTML = shell(viewRap());
  else if (v === 'tarifs') root.innerHTML = shell(viewTarifs());
  else if (v === 'set') root.innerHTML = shell(viewSet());
  else if (v === 'salle') root.innerHTML = shell(viewSalle());
  else root.innerHTML = shell(viewNet());
  // portal() et shell() viennent de définir l'adhérent ou la salle active :
  // on applique l'identité visuelle une seconde fois pour la première ouverture.
  applySiteTheme();

  document.title = TITLES[v] || TITLES.land;

  if (v === 'salle' && S.tab === 'mem') drawTable();
  if (v === 'land') initFx();
  else window.onscroll = null;
  if (v === 'net') initLive();
  if (v === 'exp') simExp();
}

// ---------- Routage par ancre (borne de check-in uniquement) ----------
function hasCheckinHash() {
  return location.hash.replace(/^#/, '').startsWith('checkin=');
}

function syncRoute() {
  if (hasCheckinHash()) {
    // Le hash peut changer alors que la borne est déjà ouverte (scan d’un autre QR) :
    // on rend à nouveau la vue pour refléter l’adhérent et la salle demandés.
    if (S.view !== 'checkin') S.view = 'checkin';
    render();
    return;
  }
  if (S.view === 'checkin') { S.view = 'land'; render(); return; }
  // Les ancres de la page d'accueil (#demo, #produit…) ne déclenchent pas de rendu.
  if (S.view === 'land' && location.hash.length > 1) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

window.addEventListener('hashchange', syncRoute);

// ---------- Démarrage ----------
if (hasCheckinHash()) S.view = 'checkin';
installProRender();
render();

// Conserver le défilement vers une ancre demandée à l'ouverture.
if (S.view === 'land' && location.hash.length > 1 && !hasCheckinHash()) {
  requestAnimationFrame(() => {
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ block: 'start' });
  });
}

// Horloge des vues « direct » et de la borne
setInterval(clockTick, 1000);

// Raccourci « / » : recherche globale
document.addEventListener('keydown', e => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t && (/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName) || t.isContentEditable)) return;
  if (document.body.classList.contains('locked')) return;
  const field = $('gq');
  if (!field) return;
  e.preventDefault();
  field.focus();
  field.select();
});

// Service worker : accélère les visites suivantes, ne bloque jamais la démo.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
