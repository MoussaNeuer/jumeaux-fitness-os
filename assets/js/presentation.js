// ============================================================================
// Mode présentation : parcours guidé commercial
// ============================================================================
const STEPS = [
  { patch: { view: 'land' }, t: 'Vision Jumeaux Fitness OS', d: 'Une plateforme, quatre salles, une gestion enfin connectée. La démonstration est entièrement cliquable.' },
  { patch: { view: 'net' }, live: true, t: 'Le réseau en un écran', d: 'Revenus, charges, résultat, impayés, objectifs et comparaison des salles. Le flux « en direct » simule la version connectée.' },
  { patch: { view: 'fin', finSite: 'net', finTab: 'synthese' }, t: 'La finance consolidée', d: 'CA, charges, marge et recouvrement. La vue distingue l’encaissé, le déclaré à vérifier et le paiement en attente.' },
  { patch: { view: 'fin', finSite: 'km', finTab: 'journal', payFilter: 'déclaré' }, t: 'Rapprocher avant de compter', d: 'Un paiement déclaré par l’adhérent ne devient une recette qu’après vérification. Le journal garde chaque référence et chaque statut.' },
  { patch: { view: 'perf' }, t: 'Comparer les quatre salles', d: 'Actifs, CA, résultat, renouvellements, nouveaux, présences et impayés sur un seul écran. Keur Massar peut mener au CA quand Yeumbeul mène au volume.' },
  { patch: { view: 'team' }, t: 'Les accès sous contrôle', d: 'La direction gère les gérants de chaque salle, leurs rôles, la double authentification et la révocation des sessions. Chaque salle garde son identité.' },
  { patch: { view: 'salle', salle: 'pa', tab: 'dash' }, t: 'Chaque salle reste autonome', d: 'Ici Parcelles, dans son identité violette. L’équipe gère ses adhérents et sa caisse ; la direction voit le consolidé, sans mélanger les données.' },
  { patch: { view: 'salle', salle: 'km', tab: 'mem', filter: 'tous', q: '', page: 0 }, t: 'Un adhérent, une fiche', d: 'Recherche instantanée, filtres par statut, fiche complète et QR personnel. Plus de doublons entre deux fichiers.' },
  { patch: { view: 'salle', salle: 'km', tab: 'abo', aboView: 'traiter' }, t: 'Les renouvellements ne se perdent plus', d: 'Alertes J-7, J-3 et J-1, expirés, inactifs, demandes, suspension et auto-renouvellement : tout est traité au même endroit.' },
  { patch: { view: 'salle', salle: 'km', tab: 'pre' }, scan: true, t: 'Contrôle d’accès en 3 secondes', d: 'Le QR est contrôlé, le statut et la règle multi-salles sont appliqués. Le résultat est immédiatement lisible par l’accueil.' },
  { patch: { view: 'salle', salle: 'km', tab: 'pay' }, t: 'Chaque encaissement laisse une trace', d: 'Wave, Orange Money, espèces ou carte : la référence est unique, le reçu est disponible et exportable.' },
  { patch: { view: 'salle', salle: 'km', tab: 'qual' }, t: 'Les erreurs sont détectées avant l’accueil', d: 'Fiches incomplètes, doublons, paiements en attente : le centre de contrôle propose une correction en un clic.' },
  { patch: { view: 'portal', ptab: 'home' }, login: true, t: 'Le client aussi est connecté', d: 'Carte numérique, QR, abonnement, reçus et présences. L’alerte d’expiration et la demande de renouvellement sont intégrées.' },
  { patch: { view: 'portal', ptab: 'abo' }, t: 'Le renouvellement vient du client', d: 'L’adhérent demande son renouvellement ou un changement de formule. Le gérant retrouve la demande dans son back-office et la traite.' },
  { patch: { view: 'portal', ptab: 'plan' }, t: 'Planning et réservation', d: 'Le programme des cours est visible depuis l’espace adhérent. La réservation est signalée comme une fonctionnalité simulée, à confirmer avec la salle.' },
  { patch: { view: 'exp' }, sim: true, t: 'Préparer la 5ᵉ salle', d: 'Le réseau peut grandir sans changer d’outil. Ajustez les hypothèses et projetez la rentabilité en direct.' },
  { patch: { view: 'land' }, t: 'Prochaine étape : cadrer le pilote', d: 'Présenter, valider, développer, tester dans une salle puis déployer progressivement. Les bénéfices restent des scénarios à confronter aux vrais chiffres.' }
];

let ps = 0;

function startPres() {
  document.body.classList.add('pres');
  document.body.classList.remove('locked');
  ps = 0;
  buildPresUI();
  applyStep();
}
function buildPresUI() {
  const p = $('pres');
  if (!p || p.dataset.built) return;
  p.dataset.built = '1';
  p.innerHTML = '<div class="pres-bar" role="region" aria-label="Mode présentation">' +
    '<div class="pres-head">' +
      '<span class="pres-left">' + logoChip('pres-logo') + '<span class="pres-kicker">' + ICON('play') + 'Mode présentation</span></span>' +
      '<div class="pres-txt" aria-live="polite"><h3 id="pt"></h3><p id="px"></p></div>' +
      '<div class="pres-ctrl">' +
        '<span class="pres-count" id="pc"></span>' +
        '<button type="button" class="pres-nav-btn" id="pPrev" onclick="step(-1)" aria-label="Étape précédente" title="Précédent (←)">' + ICON('arrow-left') + '</button>' +
        '<button type="button" class="pres-nav-btn p" id="pNext" onclick="step(1)" aria-label="Étape suivante" title="Suivant (→)">' + ICON('arrow-right') + '</button>' +
        '<button type="button" class="pres-nav-btn pres-full" onclick="toggleFull()" aria-label="Activer le plein écran" title="Plein écran">' + ICON('expand') + '</button>' +
        '<button type="button" class="pres-nav-btn" onclick="endPres()" aria-label="Quitter le mode présentation" title="Quitter (Échap)">' + ICON('xmark') + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="pres-foot">' +
      '<div class="pres-dots" id="pdots"></div>' +
      '<div class="pbar"><i id="pp"></i></div>' +
      '<span class="pres-hint pres-hint-d">← → naviguer · Échap quitter · ' + STEPS.length + ' étapes</span>' +
      '<span class="pres-hint pres-hint-m">Balayez ← → pour naviguer</span>' +
    '</div></div>';
}
function toggleFull() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}
function endPres() {
  document.body.classList.remove('pres');
  S.live = false;
  if (document.fullscreenElement) document.exitFullscreen?.();
  render();
}
function step(d) {
  ps = Math.max(0, Math.min(STEPS.length - 1, ps + d));
  applyStep();
}
function jumpTo(i) { ps = i; applyStep(); }
function scrollTopInstant() {
  const h = document.documentElement;
  const prev = h.style.scrollBehavior;
  h.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  h.style.scrollBehavior = prev;
}
function applyStep() {
  const s = STEPS[ps];
  S.live = !!s.live;
  if (s.login) S.logged = true;
  Object.assign(S, s.patch);
  render();
  scrollTopInstant();
  const t = $('pt'), x = $('px'), c = $('pc'), b = $('pp'), dots = $('pdots');
  if (t) t.textContent = s.t;
  if (x) x.textContent = s.d;
  if (c) c.textContent = (ps + 1) + ' / ' + STEPS.length;
  if (b) b.style.width = ((ps + 1) / STEPS.length * 100) + '%';
  const box = document.querySelector('.pres-txt');
  if (box) { box.classList.remove('pres-in'); void box.offsetWidth; box.classList.add('pres-in'); }
  const prev = $('pPrev'), next = $('pNext');
  if (prev) prev.disabled = ps === 0;
  if (next) next.disabled = ps === STEPS.length - 1;
  if (dots) dots.innerHTML = STEPS.map((_, i) => '<button type="button" class="' + (i === ps ? 'on' : i < ps ? 'done' : '') + '" aria-label="Étape ' + (i + 1) + '" aria-current="' + (i === ps ? 'step' : 'false') + '" onclick="jumpTo(' + i + ')"></button>').join('');
  if (s.scan) setTimeout(() => {
    const sel = $('sm');
    if (!sel) return;
    const opt = [...sel.querySelectorAll('option')].find(o => /— actif$/.test(o.textContent));
    if (opt) sel.value = opt.value;
    scan();
  }, 420);
  if (s.sim) setTimeout(() => { if ($('expResult')) simExp(); }, 120);
}
document.addEventListener('keydown', e => {
  if (!document.body.classList.contains('pres')) return;
  if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); step(1); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
  if (e.key === 'Escape') { e.preventDefault(); endPres(); }
  if (e.key === 'Home') { e.preventDefault(); jumpTo(0); }
  if (e.key === 'End') { e.preventDefault(); jumpTo(STEPS.length - 1); }
});

// Navigation tactile : balayage horizontal gauche / droite (mobile et tablette).
let presTouch = null;
let presSwipedAt = 0;
document.addEventListener('touchstart', e => {
  presTouch = null;
  if (!document.body.classList.contains('pres') || e.touches.length !== 1) return;
  const t = e.target;
  if (t && t.closest && t.closest('.pres-bar, .tabs, button, a, input, select, textarea, label')) return;
  presTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY, at: Date.now() };
}, { passive: true });
document.addEventListener('touchend', e => {
  if (!presTouch || !document.body.classList.contains('pres')) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - presTouch.x;
  const dy = t.clientY - presTouch.y;
  const dt = Date.now() - presTouch.at;
  presTouch = null;
  if (dt > 900) return;
  if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
  presSwipedAt = Date.now();
  step(dx < 0 ? 1 : -1);
}, { passive: true });
document.addEventListener('touchcancel', () => { presTouch = null; }, { passive: true });
// Un balayage ne doit pas déclencher en plus le clic de la carte survolée.
document.addEventListener('click', e => {
  if (!document.body.classList.contains('pres') || !presSwipedAt) return;
  if (Date.now() - presSwipedAt > 450) { presSwipedAt = 0; return; }
  presSwipedAt = 0;
  e.preventDefault();
  e.stopPropagation();
}, true);
