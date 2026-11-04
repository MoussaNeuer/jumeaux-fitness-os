// ============================================================================
// Version « pro » : rôles, pilote, Mobile Money, panne réseau, rappels, QR iOS
// Ce fichier se branche sur les fonctions existantes (go, render, scan…).
// ============================================================================
Object.assign(S, { role: 'dir', rsite: 'km', offline: false, manual: [], dec: {} });

// ---------- Rôles (cahier des charges §4) ----------
const DROITS = {
  dir:     { n: 'Direction générale',   d: 'Vue consolidée des 4 salles', views: null, tabs: null },
  resp:    { n: 'Responsable de salle', d: 'Gère sa salle uniquement',   views: ['salle'], tabs: ['dash', 'mem', 'abo', 'pay', 'pre', 'qual'] },
  accueil: { n: 'Agent d’accueil',      d: 'Recherche adhérent et contrôle QR', views: ['salle'], tabs: ['mem', 'pre'] },
  compta:  { n: 'Comptable',            d: 'Paiements et rapports financiers',  views: ['salle', 'fin'], tabs: ['pay'] }
};
const FREE = ['land', 'portal', 'checkin'];
function allowed(t) {
  const r = DROITS[t.role];
  if (!r.views || FREE.includes(t.view)) return true;
  if (!r.views.includes(t.view)) return false;
  if (t.view === 'salle') return r.tabs.includes(t.tab) && t.salle === t.rsite;
  if (t.view === 'fin') return t.role === 'compta' && t.finSite === t.rsite;
  return true;
}
function canAccessFinanceSite(site) { return S.role === 'dir' || site === S.rsite; }
function homeOf(role) {
  if (role === 'dir') return { view: 'net' };
  return { view: 'salle', tab: { resp: 'dash', accueil: 'pre', compta: 'pay' }[role] };
}
function denied(t) {
  const s = SALLES.find(x => x.id === t.salle);
  const autre = t.view === 'salle' && t.salle !== S.rsite && s;
  journal('Accès refusé', DROITS[S.role].n + ' · ' + (s ? s.nom : t.view));
  openModal('<div class="deny"><span class="deny-ic">' + ICON('lock') + '</span><h3>Accès refusé</h3><p>' +
    (autre ? 'Le compte <b>' + DROITS[S.role].n + ' — ' + esc(D[S.rsite].nom) + '</b> n’a aucun accès aux données de <b>' + esc(s.nom) + '</b>.'
           : 'Le rôle <b>' + DROITS[S.role].n + '</b> ne permet pas d’ouvrir cet écran.') + '</p>' +
    '<div class="callout">' + ICON('shield-halved') + ' Dans la vraie plateforme, c’est le <b>serveur</b> qui vérifie le périmètre à chaque lecture et écriture (critère AC-01). Modifier une adresse ou un identifiant ne suffit pas.</div>' +
    '<button class="btn p w" onclick="closeModal()">Compris</button></div>', { title: 'Accès refusé' });
}
// go() : le périmètre est contrôlé avant chaque navigation
const _go = go;
go = function (p) {
  p = Object.assign({}, p);
  if (S.role !== 'dir' && p.view === 'fin') p.finSite = S.rsite;
  const t = Object.assign({}, S, p);
  if (!allowed(t)) { denied(t); return; }
  _go(p);
};
const _nav = nav;
nav = function (k) { if (k === 'pilot') go({ view: 'pilot' }); else _nav(k); };
MENU[2].items.push(['pilot', 'flag-checkered', 'Pilote & décisions']);

function setRole(role, site) {
  S.role = role; if (site) S.rsite = site;
  const cible = role === 'dir' ? (['salle', 'net'].includes(S.view) ? {} : { view: 'net' }) : Object.assign({ salle: S.rsite }, homeOf(role));
  _go(Object.assign({ q: '', page: 0, filter: 'tous' }, cible));
  toast('Rôle : ' + DROITS[role].n + (role === 'dir' ? '' : ' — ' + D[S.rsite].nom), 'ok');
}
function tryOther() {
  const autre = SALLES.find(s => s.id !== S.rsite);
  go({ view: 'salle', salle: autre.id, tab: DROITS[S.role].tabs[0] });
}
function roleBar() {
  const dir = S.role === 'dir';
  const roles = Object.keys(DROITS).map(k => '<option value="' + k + '"' + (S.role === k ? ' selected' : '') + '>' + DROITS[k].n + '</option>').join('');
  const sites = SALLES.map(s => '<option value="' + s.id + '"' + (S.rsite === s.id ? ' selected' : '') + '>' + s.nom + '</option>').join('');
  const autre = SALLES.find(s => s.id !== S.rsite);
  return '<section class="rolebar' + (S.offline ? ' off' : '') + '" aria-label="Simulation des droits">' +
    '<div class="rb-main"><span class="rb-ic">' + ICON(dir ? 'crown' : 'user-shield') + '</span><div><b>' + DROITS[S.role].n + (dir ? '' : ' — ' + esc(D[S.rsite].nom)) + '</b><small>' + DROITS[S.role].d + ' · simulation des droits</small></div></div>' +
    '<div class="rb-ctl"><label>Rôle<select onchange="setRole(this.value)">' + roles + '</select></label>' +
    (dir ? '' : '<label>Salle<select onchange="setRole(\'' + S.role + '\',this.value)">' + sites + '</select></label><button class="btn s" onclick="tryOther()">' + ICON('lock') + 'Ouvrir ' + esc(autre.nom) + '</button>') +
    '<button class="btn s' + (S.offline ? ' warn' : '') + '" onclick="toggleOffline()">' + ICON(S.offline ? 'wifi' : 'plug-circle-xmark') + (S.offline ? 'Rétablir le réseau' + (S.manual.length ? ' (' + S.manual.length + ' à régulariser)' : '') : 'Simuler une panne réseau') + '</button></div></section>';
}

// ---------- Rendu : écran Pilote + adaptation du menu au rôle ----------
const _render = render;
render = function () {
  if (S.view === 'land') S.role = 'dir';
  if (S.role !== 'dir') {
    S.salle = S.rsite; S.finSite = S.rsite;
    if (!allowed(S)) Object.assign(S, homeOf(S.role));
  }
  document.body.classList.toggle('offline', !!S.offline);
  if (S.view === 'pilot') {
    document.body.classList.remove('borne-mode');
    $('root').innerHTML = shell(viewPilot());
    document.title = 'Pilote & décisions — Jumeaux Fitness OS';
    window.onscroll = null;
  } else _render();
  decorate();
};
function limitSites(scope) {
  if (!scope) return;
  scope.querySelectorAll('optgroup').forEach(o => { if (o.label !== D[S.rsite].nom) o.remove(); });
  scope.querySelectorAll('#sc, #ksc, #fps, #exs').forEach(sel => { sel.innerHTML = '<option value="' + S.rsite + '">' + esc(D[S.rsite].nom) + '</option>'; });
  scope.querySelectorAll('#fps').forEach(finSite => finSite.dispatchEvent(new Event('change')));
}
function decorate() {
  const root = $('root');
  if (!root || !root.querySelector('.app')) return;
  const r = DROITS[S.role], main = root.querySelector('.main');
  if (S.view === 'pilot') { const c = root.querySelector('.crumb b'); if (c) c.textContent = 'Pilote & décisions'; }
  if (r.views) { // menu et données limités au périmètre du rôle
    root.querySelectorAll('.nav-item[onclick^="nav("]').forEach(b => {
      const k = b.getAttribute('onclick').match(/nav\('(\w+)'/)[1];
      if (!((k === 'fin' && r.views.includes('fin')) || r.tabs.includes(k))) b.remove();
    });
    root.querySelectorAll('.nav-group').forEach(g => { if (!g.querySelector('.nav-item')) g.remove(); });
    root.querySelectorAll('.nav-badge, .bell').forEach(x => x.remove());
    if (S.role === 'compta') root.querySelectorAll('.search').forEach(x => x.remove());
    const sel = root.querySelector('.site-sel');
    if (sel) { sel.innerHTML = '<option>' + esc(D[S.rsite].nom) + '</option>'; sel.disabled = true; }
    const u = root.querySelector('.side-foot .user');
    if (u) { u.querySelector('.lbl').innerHTML = '<b>' + r.n + '</b><small>' + esc(D[S.rsite].nom) + '</small>'; u.querySelector('.av').textContent = { resp: 'RS', accueil: 'AC', compta: 'CO' }[S.role]; }
    limitSites(root);
  }
  if (main) main.insertAdjacentHTML('afterbegin', roleBar());
  const act = root.querySelector('.page-actions');
  if (S.view === 'salle' && S.tab === 'pay' && act) act.insertAdjacentHTML('afterbegin', '<button class="btn s p" onclick="openMoMo()">' + ICON('mobile-screen') + 'Demande Wave / Orange Money</button>');
  if (S.view === 'salle' && S.tab === 'abo' && act) act.insertAdjacentHTML('afterbegin', '<button class="btn s" onclick="openReminder()">' + ICON('bell') + 'Aperçu du rappel adhérent</button>');
}
const _openScanner = openScanner;
openScanner = function () { _openScanner(); if (S.role !== 'dir') limitSites($('modal')); };

// ---------- Panne réseau (cahier des charges §12.6) ----------
function toggleOffline() {
  S.offline = !S.offline;
  if (!S.offline && S.manual.length) regulariser();
  toast(S.offline ? 'Panne réseau simulée : aucune validation possible' : 'Réseau rétabli', S.offline ? 'warn' : 'ok');
  render();
}
function offlineBlock() { toast('Hors connexion : aucun paiement n’est confirmé sans réponse du serveur', 'ko'); }
['newPayment', 'newPaymentFin', 'savePay', 'savePayFin', 'renew', 'addM', 'fixPay', 'reconcilePay', 'momoEvent'].forEach(n => {
  const f = window[n];
  if (typeof f === 'function') window[n] = function () { return S.offline ? offlineBlock() : f.apply(this, arguments); };
});
const _scan = scan;
scan = function (target) {
  if (!S.offline) return _scan(target);
  const box = $(target === 'kiosk' ? 'ksr' : 'sr');
  if (box) box.innerHTML = '<div class="scan-result warn"><span class="scan-result-ic">' + ICON('plug-circle-xmark') + '</span><div><small>Contrôle non validé</small><b>Contrôle manuel requis</b><p>Réseau indisponible : l’accès n’est jamais validé à partir d’un cache ou d’une image de QR code.</p></div><time>' + hhmm(new Date()) + '</time></div>' +
    '<button class="btn s w" style="margin-top:10px" onclick="openManual()">' + ICON('clipboard-check') + 'Lancer la procédure manuelle</button>';
  toast('Contrôle manuel requis', 'warn');
};
function openManual() {
  const d = D[S.salle];
  closeModal();
  openModal('<h3>Procédure manuelle contrôlée</h3><p class="tiny mut">Un responsable vérifie l’identité, indique un motif ; l’entrée est régularisée au retour du réseau.</p>' +
    '<div class="f"><label>Adhérent annoncé<select id="mnm">' + d.mem.slice(0, 15).map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + m.id + '</option>').join('') + '</select></label>' +
    '<label>Responsable qui valide<input id="mnr" placeholder="Nom du responsable" autocomplete="off"></label>' +
    '<label>Motif<select id="mnx"><option>Réseau indisponible</option><option>Serveur indisponible</option><option>Lecteur QR en panne</option></select></label></div>' +
    '<button class="btn p w" style="margin-top:12px" onclick="saveManual()">' + ICON('clipboard-check') + 'Enregistrer l’entrée manuelle</button>', { title: 'Contrôle manuel' });
}
function saveManual() {
  const resp = $('mnr').value.trim();
  if (!resp) { toast('Indiquez le responsable qui valide', 'warn'); return; }
  S.manual.push({ site: S.salle, m: $('mnm').value, resp, motif: $('mnx').value, at: new Date() });
  journal('Entrée manuelle', resp + ' · ' + $('mnx').value);
  closeModal(); toast('Entrée manuelle enregistrée, à régulariser', 'warn'); render();
}
function regulariser() {
  const n = S.manual.length;
  S.manual.forEach(e => D[e.site].pre.push({
    at: e.at, m: e.m, ok: true, type: 'Manuel', responsable: e.resp, motif: e.motif
  }));
  S.manual = []; recalc();
  journal('Régularisation', n + ' entrée(s) manuelle(s)');
  openModal('<h3>Régularisation après panne</h3><p>' + n + ' entrée(s) manuelle(s) rapprochée(s) : date, motif et responsable figurent maintenant dans l’historique des contrôles.</p><button class="btn p w" onclick="closeModal()">Terminer</button>', { title: 'Régularisation' });
}

// ---------- Paiement Mobile Money (cahier des charges §12.4) ----------
function openMoMo() {
  if (S.offline) return offlineBlock();
  S.momo = { site: S.salle, ref: null };
  openModal(momoHTML(), { title: 'Paiement Mobile Money' });
}
function momoHTML() {
  const mo = S.momo, d = D[mo.site];
  if (!mo.ref) {
    return '<h3>Demande de paiement Mobile Money</h3><p class="tiny mut">Simulation : aucun débit réel, aucun fournisseur contacté.</p><div class="f">' +
      '<label>Adhérent<select id="mmm">' + d.mem.slice(0, 20).map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + m.id + '</option>').join('') + '</select></label>' +
      '<label>Formule<select id="mmp">' + PLANS.map((p, i) => '<option value="' + i + '">' + p.n + ' — ' + fmt(p.p) + '</option>').join('') + '</select></label>' +
      '<label>Fournisseur<select id="mmv"><option>Wave</option><option>Orange Money</option></select></label></div>' +
      '<button class="btn p w" style="margin-top:12px" onclick="sendMoMo()">' + ICON('paper-plane') + 'Envoyer la demande</button>';
  }
  const p = d.pay.find(x => x.ref === mo.ref), ok = p && p.st === 'confirmé';
  const etapes = [['Demande créée', 'Référence ' + mo.ref + ' · statut « en attente »'], ['Validation du client', 'Le client valide sur ' + mo.prov + ' (code ou application)'],
    ['Preuve du fournisseur', 'Confirmation signée (webhook) reçue par le serveur'], ['Contrôles', 'Signature, référence, montant et commande vérifiés, une seule fois']];
  const fait = ok ? 4 : 1;
  return '<h3>' + (ok ? 'Paiement confirmé' : 'Paiement en attente') + '</h3><p class="tiny mut">' + esc(findMembre(mo.m).nom) + ' · ' + fmt(PLANS[mo.pl].p) + ' · ' + mo.prov + '</p>' +
    '<ol class="mm-steps">' + etapes.map((e, i) => '<li class="' + (i < fait ? 'done' : i === fait ? 'now' : '') + '"><i>' + (i < fait ? ICON('check') : i + 1) + '</i><div><b>' + e[0] + '</b><small>' + e[1] + '</small></div></li>').join('') + '</ol>' +
    (mo.msg ? '<div class="callout ' + mo.msg[0] + '">' + ICON(mo.msg[0] === 'ok' ? 'circle-check' : 'triangle-exclamation') + ' ' + mo.msg[1] + '</div>' : '') +
    (ok ? '' : '<div class="mm-btns"><button class="btn s" onclick="momoEvent(\'redir\')">Le client revient sur le site (redirection)</button><button class="btn s" onclick="momoEvent(\'bad\')">Webhook avec mauvais montant</button><button class="btn s p" onclick="momoEvent(\'ok\')">Webhook signé valide</button></div>') +
    (ok ? '<button class="btn s w" onclick="momoEvent(\'ok\')">Rejouer le webhook (doublon)</button>' : '') +
    '<button class="btn w" style="margin-top:8px" onclick="closeModal()">Fermer</button>';
}
function sendMoMo() {
  const d = D[S.salle], m = findMembre($('mmm').value), pl = +$('mmp').value, prov = $('mmv').value;
  const ref = 'MM-' + S.salle.toUpperCase() + '-' + Date.now().toString().slice(-5);
  d.pay.unshift({ ref, m: m.id, montant: PLANS[pl].p, moyen: prov, date: new Date(), st: 'en attente', agent: DROITS[S.role].n });
  S.momo = { site: S.salle, ref, m: m.id, pl, prov, msg: null };
  journal('Demande Mobile Money', ref + ' · ' + prov); recalc(); render();
  openModal(momoHTML(), { title: 'Paiement Mobile Money' });
}
function momoEvent(e) {
  const mo = S.momo, d = D[mo.site], p = d.pay.find(x => x.ref === mo.ref), m = findMembre(mo.m);
  if (e === 'redir') mo.msg = ['warn', 'Une simple redirection du navigateur ne prouve rien : le paiement reste <b>en attente</b>.'];
  else if (e === 'bad') mo.msg = ['warn', 'Montant reçu ≠ montant attendu : confirmation <b>rejetée</b>, paiement placé en vérification.'];
  else if (p.st === 'confirmé') mo.msg = ['ok', 'Doublon ignoré (idempotence) : la transaction n’est comptée <b>qu’une seule fois</b>.'];
  else {
    p.st = 'confirmé';
    m.exp = new Date(+Math.max(+AUJ, +m.exp) + PLANS[mo.pl].j * J); m.plan = mo.pl; m.susp = false;
    d.act.unshift(['Paiement confirmé', m.nom]); journal('Paiement confirmé', mo.ref + ' · webhook signé');
    mo.msg = ['ok', 'Preuve reçue et contrôlée : paiement <b>confirmé</b>, abonnement prolongé, reçu disponible.'];
    recalc(); render();
  }
  openModal(momoHTML(), { title: 'Paiement Mobile Money' });
}

// ---------- Rappels adhérent (exemples, cahier des charges §7.4 et §13) ----------
const REM = { ch: 'wa', id: null };
const CANAUX = { wa: ['WhatsApp', 'comment-dots'], sms: ['SMS', 'message'], app: ['Notification app', 'bell'] };
function reminderText(m, ch) {
  const j = Math.ceil((m.exp - AUJ) / J);
  const quand = j < 0 ? 'a expiré le ' + dstr(m.exp) : j === 0 ? 'expire aujourd’hui' : 'expire dans ' + j + ' jour' + (j > 1 ? 's' : '') + ' (le ' + dstr(m.exp) + ')';
  const base = 'Bonjour ' + m.nom.split(' ')[0] + ', votre abonnement ' + PLANS[m.plan].n + ' à Jumeaux Fitness — ' + D[S.salle].nom + ' ' + quand + '. ';
  return base + (ch === 'sms' ? 'Renouvelez à l’accueil ou dans votre espace membre.' : ch === 'app' ? 'Touchez pour renouveler.' : 'Vous pouvez renouveler à l’accueil ou depuis votre espace membre. À très vite !');
}
function openReminder(id, ch) {
  const list = D[S.salle].mem.filter(m => ['bientôt', 'expiré'].includes(statut(m))).slice(0, 12);
  if (!list.length) { toast('Aucun abonnement à relancer dans cette salle', 'ok'); return; }
  REM.ch = ch || REM.ch; REM.id = id || (list.find(m => m.id === REM.id) ? REM.id : list[0].id);
  const m = findMembre(REM.id);
  openModal('<h3>Rappel d’expiration</h3><span class="badge b-warn">EXEMPLE — fournisseur, coût et consentement à valider</span>' +
    '<div class="f"><label>Adhérent<select onchange="openReminder(this.value)">' + list.map(x => '<option value="' + x.id + '"' + (x.id === REM.id ? ' selected' : '') + '>' + esc(x.nom) + ' — ' + statut(x) + '</option>').join('') + '</select></label></div>' +
    '<div class="tabs rem-tabs">' + Object.keys(CANAUX).map(k => '<button class="chip' + (REM.ch === k ? ' on' : '') + '" onclick="openReminder(null,\'' + k + '\')">' + ICON(CANAUX[k][1]) + CANAUX[k][0] + '</button>').join('') + '</div>' +
    '<div class="bubble ' + REM.ch + '"><small>' + (REM.ch === 'app' ? 'Jumeaux Fitness · maintenant' : 'Jumeaux Fitness · ' + hhmm(new Date())) + '</small><p>' + esc(reminderText(m, REM.ch)) + '</p></div>' +
    '<p class="tiny mut">Calendrier configurable : J-7 · J-3 · J-1 · jour J. Le canal critique ne doit pas être la seule notification web.</p>' +
    '<div class="row gap8"><button class="btn p" onclick="toast(\'Aperçu uniquement : aucun message envoyé\',\'ok\')">' + ICON('paper-plane') + 'Envoyer l’exemple</button><button class="btn" onclick="closeModal()">Fermer</button></div>', { title: 'Rappel adhérent' });
}

// ---------- Écran « Pilote et décisions » (cahier des charges §17, §23, §24) ----------
const PHASES = [['Cadrage', 'Ateliers direction, processus, règles multi-sites, budget', 'Périmètre validé'], ['Conception', 'Parcours, rôles, maquettes, sécurité, modèle de données', 'Dossier de conception'],
  ['Socle technique', 'Authentification, permissions, audit, séparation des sites', 'Socle testable'], ['MVP métier', 'Adhérents, offres, abonnements, paiements, reçus', 'Parcours validés'],
  ['QR & espace client', 'Carte adhérent, scanner, contrôle d’accès', 'Tests d’accès réussis'], ['PWA & notifications', 'Installation, cache maîtrisé, notifications choisies', 'Recette mobile'],
  ['Pilote', 'Une salle, formation, support, retours', 'Rapport pilote'], ['Extension réseau', 'Activation des trois autres salles', 'Quatre salles opérationnelles'], ['Exploitation', 'Maintenance, sauvegardes, évolutions', 'Feuille de route']];
const ST = { demo: ['Démontré', 'b-ok'], sim: ['Simulé', 'b-warn'], pilot: ['Au pilote', 'b-off'] };
const ACS = [['AC-01', 'Un utilisateur d’une salle ne voit pas les données des autres sans permission', 'demo'], ['AC-02', 'La direction consulte les indicateurs consolidés des quatre salles', 'demo'],
  ['AC-03', 'Un adhérent voit son profil et ses abonnements, jamais ceux d’un autre', 'demo'], ['AC-04', 'Un abonnement expiré ou suspendu est refusé au contrôle d’accès', 'demo'],
  ['AC-05', 'Un paiement n’est confirmé qu’après preuve fiable, et jamais compté deux fois', 'demo'], ['AC-06', 'Chaque opération sensible laisse une trace : acteur, date, action, objet', 'sim'],
  ['AC-07', 'La PWA s’installe et indique clairement ses limites hors connexion', 'demo'], ['AC-08', 'Une sauvegarde peut être restaurée lors d’un test documenté', 'pilot'],
  ['AC-09', 'Les responsables valident les parcours métier et les rapports du pilote', 'pilot']];
const DECISIONS = ['Principe d’une plateforme unique pour les quatre salles', 'Salle pilote et périmètre du pilote', 'Rôles et règles d’accès', 'Compte adhérent unique et accès multi-salles',
  'Formules, statuts, paiements et règles de renouvellement', 'Canaux de notification et fournisseurs éventuels', 'Budget, calendrier, propriété du logiciel et maintenance'];
const LIVRABLES = ['Ateliers métier', 'Maquettes', 'Spécifications validées', 'Plan technique', 'Plan pilote', 'Proposition financière'];
const DECISION_TXT = 'Autoriser une phase de cadrage et de démonstration afin de confirmer les besoins, sélectionner un établissement pilote et établir une proposition technique et financière détaillée. Cette décision ne vaut pas engagement de déploiement sur les quatre sites.';
function pilotGo(i) {
  if (i === 0) { setRole('accueil', 'km'); setTimeout(tryOther, 80); }
  else if (i === 1) { setRole('dir'); go({ view: 'net' }); }
  else if (i === 2) go({ view: 'portal', logged: true });
  else if (i === 3) { S.role = 'dir'; go({ view: 'salle', salle: 'km', tab: 'pre' }); }
  else if (i === 4) { S.role = 'dir'; go({ view: 'salle', salle: 'km', tab: 'pay' }); setTimeout(openMoMo, 120); }
  else if (i === 5) { S.role = 'dir'; go({ view: 'team' }); }
  else go({ view: 'net' });
}
function toggleDec(i) {
  S.dec[i] = !S.dec[i];
  const n = $('decN'); if (n) n.textContent = Object.values(S.dec).filter(Boolean).length + ' / ' + DECISIONS.length;
}
function viewPilot() {
  const nDec = Object.values(S.dec).filter(Boolean).length;
  return head('Pilote & décisions', 'Ce que nous demandons à la Direction générale, et comment le projet avance.',
    '<button class="btn p" onclick="openFiche()">' + ICON('file-pdf') + 'Fiche 1 page (PDF)</button>') +
    '<div class="callout pl-call">' + ICON('flag-checkered') + '<div><b>Décision proposée</b><p>' + DECISION_TXT + '</p></div></div>' +
    '<div class="card"><div class="chart-h"><h3>Trajectoire du projet</h3><span class="badge b-warn">durées à fixer après cadrage</span></div><ol class="pl-ph">' +
    PHASES.map((p, i) => '<li class="' + (i === 0 ? 'now' : '') + '"><span class="pl-n">' + i + '</span><div><b>' + p[0] + (i === 0 ? ' · décision demandée' : '') + '</b><small>' + p[1] + '</small><em>' + ICON('flag-checkered') + p[2] + '</em></div></li>').join('') + '</ol></div>' +
    '<div class="grid g2"><div class="card"><div class="chart-h"><h3>9 critères d’acceptation du pilote</h3></div><ul class="pl-ac">' +
    ACS.map((a, i) => '<li><span class="pl-id">' + a[0] + '</span><span class="pl-t">' + a[1] + '</span><span class="badge ' + ST[a[2]][1] + '">' + ST[a[2]][0] + '</span>' + (a[2] === 'pilot' ? '' : '<button class="btn s" onclick="pilotGo(' + i + ')">Voir</button>') + '</li>').join('') + '</ul></div>' +
    '<div class="card"><div class="chart-h"><h3>Décisions attendues</h3><span class="badge b-ok" id="decN">' + nDec + ' / ' + DECISIONS.length + '</span></div><div class="pl-dec">' +
    DECISIONS.map((t, i) => '<label><input type="checkbox"' + (S.dec[i] ? ' checked' : '') + ' onchange="toggleDec(' + i + ')"><span>' + t + '</span></label>').join('') + '</div>' +
    '<h4 class="pl-h4">Livrables du cadrage</h4><div class="pl-liv">' + LIVRABLES.map(l => '<span class="chip">' + l + '</span>').join('') + '</div></div></div>' +
    '<p class="tiny mut">Prototype de démonstration : « Démontré » signifie visible dans cette démo avec des données fictives, pas validé en production. Prix, délais et budget restent à définir.</p>';
}
function openFiche() {
  openModal('<div class="fiche"><div class="fi-h">' + logoChip('sm') + '<b>JUMEAUX FITNESS OS</b><span>Plateforme multi-salles · synthèse de la proposition</span></div>' +
    '<p><b>Décision proposée :</b> ' + DECISION_TXT + '</p><h4>Trajectoire</h4><p>' + PHASES.map((p, i) => i + '. ' + p[0]).join(' → ') + '</p>' +
    '<h4>Critères d’acceptation du pilote</h4><ul>' + ACS.map(a => '<li><b>' + a[0] + '</b> ' + a[1] + '</li>').join('') + '</ul>' +
    '<h4>Décisions attendues de la direction</h4><ul>' + DECISIONS.map(t => '<li>' + t + '</li>').join('') + '</ul>' +
    '<h4>Livrables du cadrage</h4><p>' + LIVRABLES.join(' · ') + '</p>' +
    '<p class="fi-f">Prototype de démonstration — données fictives, fonctionnalités simulées. Tarifs, délais et budget à définir après cadrage.</p></div>' +
    '<div class="row gap8 no-print" style="margin-top:14px"><button class="btn p" onclick="window.print()">' + ICON('print') + 'Imprimer / PDF</button><button class="btn" onclick="closeModal()">Fermer</button></div>', { title: 'Fiche récapitulative' });
}

// ---------- Lecture QR par caméra sur iPhone (repli jsQR, chargé à la demande) ----------
if (!('BarcodeDetector' in window)) {
  let charge = null;
  const chargerJsQR = () => charge || (charge = new Promise(ok => { const s = document.createElement('script'); s.src = 'assets/vendor/jsQR.js?v=7.3'; s.onload = ok; s.onerror = ok; document.head.appendChild(s); }));
  window.BarcodeDetector = class {
    constructor() { this.c = document.createElement('canvas'); }
    async detect(v) {
      await chargerJsQR();
      const w = v.videoWidth, h = v.videoHeight;
      if (!w || !window.jsQR) return [];
      this.c.width = w; this.c.height = h;
      const x = this.c.getContext('2d', { willReadFrequently: true });
      x.drawImage(v, 0, 0, w, h);
      const r = jsQR(x.getImageData(0, 0, w, h).data, w, h);
      return r ? [{ rawValue: r.data }] : [];
    }
  };
}

// ---------- Mode présentation : nouvelles étapes ----------
STEPS.forEach(s => { s.patch.role = s.patch.role || 'dir'; s.patch.offline = !!s.patch.offline; });
const idx = t => STEPS.findIndex(s => s.t === t);
STEPS.splice(idx('Prochaine étape : cadrer le pilote'), 0, { patch: { view: 'pilot' }, t: 'Ce que nous demandons aujourd’hui', d: 'Autoriser une phase de cadrage, choisir une salle pilote, valider les règles. Aucun engagement de déploiement sur les quatre salles.' });
STEPS.splice(idx('Contrôle d’accès en 3 secondes') + 1, 0, { patch: { view: 'salle', salle: 'km', tab: 'pre', offline: true }, scan: true, t: 'Panne réseau : jamais de faux « accès autorisé »', d: 'Sans réseau, le contrôle ne valide rien à partir d’un cache. Un responsable applique une procédure manuelle tracée, régularisée au retour du réseau.' });
STEPS.splice(idx('Chaque encaissement laisse une trace') + 1, 0, { patch: { view: 'salle', salle: 'km', tab: 'pay' }, momo: true, t: 'Un paiement n’est confirmé qu’après preuve fiable', d: 'Une redirection ne prouve rien. Seule la confirmation signée du fournisseur, avec le bon montant, confirme le paiement, une seule fois.' });
STEPS.splice(idx('Les accès sous contrôle') + 1, 0, { patch: { view: 'salle', salle: 'km', tab: 'mem', role: 'accueil', rsite: 'km' }, t: 'Chacun ne voit que son périmètre', d: 'Un agent d’accueil de Keur Massar n’a ni les finances ni les autres salles. Essayez d’ouvrir Yeumbeul : accès refusé (critères AC-01 et AC-02).' });
const _apply = applyStep;
applyStep = function () { closeModal(); _apply(); if (STEPS[ps].momo) setTimeout(openMoMo, 500); };
