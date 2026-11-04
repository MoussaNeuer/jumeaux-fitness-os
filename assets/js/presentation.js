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
  p.innerHTML = '<div class="pres-panel" role="dialog" aria-modal="false" aria-label="Mode présentation">' +
    '<div class="pres-top"><span class="pres-left">' + logoChip('xs') + '<span class="pres-kicker">' + ICON('play') + 'Mode présentation</span></span><span class="pres-count" id="pc"></span></div>' +
    '<h3 id="pt"></h3><p id="px"></p>' +
    '<div class="pres-dots" id="pdots"></div>' +
    '<div class="pbar"><i id="pp"></i></div>' +
    '<div class="pres-actions"><button class="btn s" onclick="step(-1)">' + ICON('arrow-left') + 'Précédent</button>' +
      '<button class="btn s p" onclick="step(1)">Suivant ' + ICON('arrow-right') + '</button>' +
      '<button class="btn s" onclick="toggleFull()">' + ICON('expand') + 'Plein écran</button>' +
      '<button class="btn s" onclick="endPres()">' + ICON('xmark') + 'Quitter</button></div>' +
    '<div class="pres-keys">← → naviguer · Échap quitter · ' + STEPS.length + ' étapes</div></div>';
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
function applyStep() {
  const s = STEPS[ps];
  S.live = !!s.live;
  if (s.login) S.logged = true;
  Object.assign(S, s.patch);
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
  const t = $('pt'), x = $('px'), c = $('pc'), b = $('pp'), dots = $('pdots');
  if (t) t.textContent = s.t;
  if (x) x.textContent = s.d;
  if (c) c.textContent = (ps + 1) + ' / ' + STEPS.length;
  if (b) b.style.width = ((ps + 1) / STEPS.length * 100) + '%';
  if (dots) dots.innerHTML = STEPS.map((_, i) => '<button class="' + (i === ps ? 'on' : i < ps ? 'done' : '') + '" aria-label="Étape ' + (i + 1) + '" onclick="jumpTo(' + i + ')"></button>').join('');
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
