// ============================================================================
// Espace adhérent (rendu mobile simulé)
// ============================================================================
let ME = null;
let NOTIFS = { exp: true, pay: true, news: false };

function portalMember() {
  if (ME && findMembre(ME.id)) return findMembre(ME.id);
  const pool = [];
  SALLES.forEach(s => D[s.id].mem.forEach(m => {
    if (statut(m) === 'actif' && D[s.id].pre.some(p => p.m === m.id)) pool.push(m);
  }));
  ME = pool.find(m => D[m.home].pay.some(p => p.m === m.id)) || pool[0] || D.km.mem[0];
  return ME;
}

function ensureDemoHistory(m) {
  const d = D[m.home];
  if (!d.pay.some(p => p.m === m.id)) {
    d.pay.unshift({ ref: 'REC-' + m.id + '-D', m: m.id, montant: prixMembre(m), moyen: 'Wave', date: addDays(-9), st: 'confirmé', agent: 'Accueil' });
    d.pay.sort((a, b) => b.date - a.date);
  }
  if (!d.pre.some(p => p.m === m.id)) {
    [1, 3, 5, 8].forEach((n, i) => d.pre.push({ at: new Date(+AUJ - n * J + (17 + i) * 3600000 + 12 * 60000), m: m.id, ok: true, type: i % 2 ? 'QR' : 'Manuel' }));
    d.pre.sort((a, b) => a.at - b.at);
  }
}

const JOURS_SEM = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
function nextCourseDate(jour) {
  const cur = AUJ.getDay() || 7;
  return addDays(((jour - cur) + 7) % 7);
}

function expBanner(m, jr) {
  if (jr < 0) {
    return '<div class="p-banner ko"><span class="p-banner-ic">' + ICON('triangle-exclamation') + '</span><div><b>Votre abonnement a expiré</b><small>Depuis ' + Math.abs(jr) + ' jour(s). L’accès à la salle est simulé comme bloqué.</small></div><button class="btn s danger" onclick="requestMe(\'renouvellement\')">Renouveler</button></div>';
  }
  if (jr <= 7) {
    return '<div class="p-banner warn"><span class="p-banner-ic">' + ICON('bell') + '</span><div><b>Votre abonnement expire dans ' + jr + ' jour' + (jr > 1 ? 's' : '') + '</b><small>Demandez votre renouvellement dès maintenant pour garder votre accès.</small></div><button class="btn s" onclick="requestMe(\'renouvellement\')">Demander</button></div>';
  }
  return '';
}

function promoCard(m) {
  const offres = promoOffres();
  if (!offres.length) return '';
  const moisActuel = PLANS[m.plan].m;
  return '<div class="card p-promo">' +
    '<div class="p-promo-head"><span class="p-promo-flag">' + ICON('tags') + ' ' + esc(PROMO.nom || 'Promotion') + '</span><span class="badge b-warn">Offre limitée</span></div>' +
    '<h3>Des tarifs promo pour vous</h3>' +
    '<p class="tiny mut">Offre valable dans toutes les salles du réseau. Parlez-en au gérant de ' + esc(D[m.home].nom) + ' pour en profiter.</p>' +
    '<div class="p-promo-grid">' + offres.map(o => {
      const base = (m.genre === 'f' ? TARIFS.f : TARIFS.h) * o.mois;
      const eco = Math.max(0, base - o.prix);
      return '<div class="' + (o.mois === moisActuel ? 'on' : '') + '"><small>' + o.mois + ' mois</small><b>' + fmt(o.prix) + '</b><em>' + (eco ? '−' + fmtShort(eco) + ' FCFA' : 'prix promo') + '</em></div>';
    }).join('') + '</div>' +
    '<button class="btn p w" onclick="openPromoMe()">' + ICON('paper-plane') + 'Je veux cette offre</button>' +
    '<p class="tiny center mut" style="margin-top:7px">Montants de démonstration, à valider par la Direction. Le gérant applique la promotion lors de l’abonnement.</p>' +
    '</div>';
}

function portal() {
  const m = portalMember();
  ensureDemoHistory(m);
  const d = D[m.home], p = PLANS[m.plan], jr = joursRestants(m), prix = prixMembre(m);
  if (!S.logged) return portalLogin(m);

  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const members = SALLES.flatMap(s => D[s.id].mem.filter(x => statut(x) === 'actif').slice(0, 3));
  const selector = '<select class="member-switch" aria-label="Changer de compte de démonstration" onchange="switchMember(this.value)">' +
    members.map(x => '<option value="' + x.id + '"' + (x.id === m.id ? ' selected' : '') + '>' + esc(x.nom) + ' — ' + D[x.home].nom + '</option>').join('') + '</select>';

  const sbar = '<div class="statusbar"><span>' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + '</span><span class="statusbar-l"><i class="fa-solid fa-signal"></i><i class="fa-solid fa-wifi"></i><i class="fa-solid fa-battery-full"></i></span></div>';

  const home = '<div class="p-hello"><span>' + hello + ',</span><h2>' + esc(m.nom.split(' ')[0]) + '</h2><small>' + dayLabel(new Date()) + '</small></div>' +
    expBanner(m, jr) +
    promoCard(m) +
    '<div class="idc">' +
      '<div class="idc-top"><span class="idc-brand">' + logoChip('xs') + '</span><span class="badge ' + (statut(m) === 'actif' ? 'b-ok' : 'b-warn') + '">' + esc(statut(m) === 'actif' ? 'Actif' : 'Expire bientôt') + '</span></div>' +
      '<div class="idc-name"><b>' + esc(m.nom) + '</b><span>' + m.id + ' · ' + esc(d.nom) + '</span></div>' +
      '<div class="idc-bottom"><div class="idc-exp"><small>Valable jusqu’au</small><b>' + dstr(m.exp) + '</b><span>' + (jr >= 0 ? jr + ' jours restants' : 'Expiré') + ' · ' + p.n + '</span></div>' +
      '<button class="idc-qr" onclick="bigQr()" aria-label="Agrandir mon QR code">' + qrSvg(m, 70) + '</button></div>' +
      '<span class="idc-chip">' + ICON('wifi') + ' Carte numérique · démonstration</span>' +
    '</div>' +
    '<div class="p-actions"><button class="p-action" onclick="bigQr()">' + ICON('expand') + '<span>Mon QR</span></button>' +
      '<button class="p-action" onclick="S.ptab=\'abo\';render()">' + ICON('arrows-rotate') + '<span>Renouveler</span></button>' +
      '<button class="p-action" onclick="S.ptab=\'pay\';render()">' + ICON('receipt') + '<span>Mes reçus</span></button></div>' +
    '<div class="card p-next"><div class="row sp"><b>Prochaine échéance</b>' + bdg(statut(m)) + '</div>' +
      '<div class="p-next-row"><div><small>' + p.n + '</small><b>' + dstr(m.exp) + '</b></div><div class="p-days"><b>' + Math.max(0, jr) + '</b><small>jours</small></div></div>' +
      '<div class="progress"><i style="width:' + Math.max(4, Math.min(100, (1 - Math.max(0, jr) / p.j) * 100)) + '%"></i></div>' +
      '<button class="btn p w" onclick="S.ptab=\'abo\';render()">Voir mon abonnement</button></div>' +
    '<div class="card p-visits"><div class="row sp"><b>Dernières visites</b><button class="linkbtn" onclick="S.ptab=\'pre\';render()">Tout voir</button></div>' +
      D[m.home].pre.filter(x => x.m === m.id).slice(-3).reverse().map(x => '<div class="p-visit"><span class="p-vic">' + ICON('dumbbell') + '</span><span><b>' + dayLabel(x.at) + '</b><small>' + hhmm(x.at) + ' · ' + d.nom + '</small></span>' + bdg('autorisé') + '</div>').join('') +
      '</div>';

  const pending = m.demande && m.demande.statut === 'à traiter' ? m.demande : null;
  const hist = (m.renouv || []).slice().sort((a, b) => b.date - a.date).slice(0, 5);
  const abo = '<div class="p-hello"><span>Mon abonnement</span><h2>' + p.n + '</h2><small>Formule fictive · ' + fmt(prix) + '</small></div>' +
    expBanner(m, jr) +
    '<div class="card p-plan" style="--pc:' + p.c + '"><div class="row sp"><span class="plan-name">' + p.n + '</span><span class="badge ' + (jr >= 0 ? 'b-ok' : 'b-ko') + '">' + (jr >= 0 ? 'En cours' : 'Expiré') + '</span></div>' +
      '<b class="plan-price">' + fmt(prix) + '</b><span class="tiny mut">' + p.j + ' jours · ' + p.d + '</span>' +
      '<div class="p-plan-dates"><span><small>Début</small><b>' + dstr(m.debut || new Date(+m.exp - p.j * J)) + '</b></span><span><small>Fin</small><b>' + dstr(m.exp) + '</b></span></div>' +
      '<div class="progress lg"><i style="width:' + Math.max(3, Math.min(100, jr / p.j * 100)) + '%"></i></div>' +
      '<span class="tiny mut">' + (jr >= 0 ? jr + ' jours restants' : 'Expiré depuis ' + Math.abs(jr) + ' jours') + '</span>' +
      '<label class="switch-row"><span><b>Renouvellement automatique</b><small>Simulé — aucun prélèvement réel</small></span><input type="checkbox" ' + (m.autoRenew ? 'checked' : '') + ' onchange="toggleAutoMe()"></label>' +
    '</div>' +
    promoCard(m) +
    (pending
      ? '<div class="card p-info p-pending"><h3>' + ICON('clock-rotate-left') + ' Demande en attente</h3><p class="tiny mut">' + (pending.type === 'changement' ? 'Changement vers ' + PLANS[pending.plan].n : 'Renouvellement ' + PLANS[pending.plan].n) + ' · envoyée le ' + dstr(pending.at) + '. Le gérant doit la traiter.</p><button class="btn s w" onclick="cancelMe()">Annuler ma demande</button></div>'
      : '<div class="row gap6" style="margin-bottom:10px"><button class="btn p" style="flex:1" onclick="requestMe(\'renouvellement\')">' + ICON('rotate') + 'Demander un renouvellement</button><button class="btn" onclick="openPlanMe()">' + ICON('shuffle') + 'Changer</button></div>') +
    '<div class="card p-info"><h3>Accès & avantages</h3><ul class="checklist">' +
      ['Accès à ' + esc(d.nom), m.multi ? 'Accès multi-salles inclus' : 'Salle unique (option multi-salles disponible)', 'Carte numérique et QR personnel', 'Reçus disponibles dans l’espace personnel'].map(x => '<li>' + ICON('circle-check') + x + '</li>').join('') + '</ul></div>' +
    '<div class="card p-info"><div class="row sp"><h3>Historique</h3><span class="badge b-off">' + hist.length + '</span></div>' +
      (hist.length ? hist.map(r => '<div class="p-visit"><span class="p-vic">' + ICON(r.type === 'changement' ? 'shuffle' : 'rotate') + '</span><span><b>' + (r.type === 'changement' ? 'Changement de formule' : 'Renouvellement') + ' · ' + PLANS[r.plan].n + '</b><small>' + dstr(r.date) + (r.montant ? ' · ' + fmt(r.montant) : '') + '</small></span></div>').join('') : '<p class="tiny mut">Aucun renouvellement pour le moment.</p>') +
    '</div>' +
    '<button class="btn w" onclick="renewMe()">' + ICON('bolt') + 'Simuler un renouvellement immédiat</button>' +
    '<p class="tiny center mut">Aucun paiement réel. La demande est transmise au gérant de la salle dans cette démonstration.</p>';

  const pays = D[m.home].pay.filter(x => x.m === m.id).slice(0, 8);
  const total = pays.filter(x => x.st === 'confirmé').reduce((a, x) => a + x.montant, 0);
  const lastReceipt = pays.find(x => x.st === 'confirmé');
  const pay = '<div class="p-hello"><span>Mes paiements</span><h2>' + fmt(total) + '</h2><small>Historique fictif · ' + d.nom + '</small></div>' +
    '<div class="card p-pay-list">' + (pays.length ? pays.map(x => '<button class="p-pay" onclick="receiptRef(\'' + x.ref + '\')"><span class="p-pay-ic">' + ICON(MOYENS_ICON[x.moyen] || 'wallet') + '</span><span><b>' + fmt(x.montant) + '</b><small>' + dstr(x.date) + ' · ' + x.moyen + '</small></span>' + bdg(x.st) + ICON('chevron-right') + '</button>').join('') : emptyState('receipt', 'Aucun paiement', 'Votre historique apparaîtra ici.')) + '</div>' +
    (lastReceipt ? '<button class="btn p w" onclick="downloadReceipt(\'' + lastReceipt.ref + '\')">' + ICON('download') + 'Télécharger mon dernier reçu</button>' : '') +
    '<button class="btn w" style="margin-top:8px" onclick="exportCSV(\'paiements\')">' + ICON('file-csv') + 'Exporter mes paiements</button>';

  const visits = D[m.home].pre.filter(x => x.m === m.id).slice().reverse().slice(0, 12);
  const week = [0, 1, 2, 3, 4, 5, 6].map(i => visits.filter(x => +new Date(x.at) >= +AUJ - i * J && +new Date(x.at) < +AUJ - (i - 1) * J).length);
  const pre = '<div class="p-hello"><span>Mes présences</span><h2>' + visits.length + '</h2><small>passages enregistrés · ' + d.nom + '</small></div>' +
    '<div class="card"><div class="row sp"><b>Cette semaine</b><span class="badge b-ok">' + week.reduce((a, b) => a + b, 0) + ' passages</span></div>' +
      '<div class="p-week">' + week.slice().reverse().map((v, i) => '<span><i style="height:' + Math.max(6, v / Math.max(1, ...week) * 48) + 'px"></i><small>' + JOURS[i] + '</small></span>').join('') + '</div></div>' +
    '<div class="card p-pay-list">' + (visits.length ? visits.map(x => '<div class="p-pay"><span class="p-pay-ic">' + ICON('dumbbell') + '</span><span><b>' + dayLabel(x.at) + '</b><small>' + hhmm(x.at) + ' · ' + d.nom + '</small></span>' + bdg(x.ok ? 'autorisé' : 'refusé') + '</div>').join('') : emptyState('dumbbell', 'Aucune visite', 'Votre historique apparaîtra ici.')) + '</div>';

  const plan = '<div class="p-hello"><span>Planning</span><h2>Activités</h2><small>Programme indicatif · ' + d.nom + '</small></div>' +
    '<div class="p-planning">' + COURS.map(c => {
      const booked = (m.resas || []).includes(c.id);
      return '<div class="p-course' + (booked ? ' booked' : '') + '"><div class="p-course-date"><b>' + dstr(nextCourseDate(c.jour)) + '</b><small>' + JOURS_SEM[c.jour - 1] + ' · ' + c.h + '</small></div>' +
        '<div class="p-course-body"><b>' + esc(c.n) + '</b><small>' + esc(c.coach) + ' · ' + esc(c.salle) + ' · ' + c.duree + ' min</small></div>' +
        '<div class="p-course-act"><span class="badge b-off">' + c.places + ' pl.</span><button class="btn s ' + (booked ? 'p' : '') + '" onclick="bookCourse(\'' + c.id + '\')">' + (booked ? 'Annuler' : 'Réserver') + '</button></div></div>';
    }).join('') + '</div>' +
    '<div class="card p-info"><h3>Réservation de séance</h3><p class="tiny mut">La réservation est indicative dans cette démonstration : aucune place réelle n’est bloquée. La version connectée pourra confirmer la présence et envoyer un rappel.</p></div>';

  const prof = '<div class="p-hello"><span>Mon compte</span><h2>' + esc(m.nom.split(' ')[0]) + '</h2><small>' + m.id + ' · membre depuis ' + dstr(m.inscription) + '</small></div>' +
    '<div class="card"><div class="row gap12" style="align-items:center">' + avatar(m.nom, 'big') + '<div><b>' + esc(m.nom) + '</b><br><small class="mut">' + esc(m.mail || 'Sans e-mail') + '</small></div></div>' +
      '<div class="f"><label>Nom d’affichage<input id="pn" value="' + esc(m.nom) + '"></label><label>Téléphone fictif<input id="pt2" value="' + esc(m.tel) + '"></label><label>E-mail fictif<input id="pe" value="' + esc(m.mail) + '"></label></div>' +
      '<button class="btn p w" style="margin-top:12px" onclick="saveProfile()">' + ICON('check') + 'Enregistrer</button></div>' +
    '<div class="card"><h3>Notifications</h3>' +
      [['exp', 'Rappel d’expiration', '7 jours avant l’échéance'], ['pay', 'Reçus de paiement', 'À chaque encaissement'], ['news', 'Actualités de la salle', 'Nouveaux cours et horaires']].map(n =>
        '<label class="switch-row"><span><b>' + n[1] + '</b><small>' + n[2] + '</small></span><input type="checkbox" ' + (NOTIFS[n[0]] ? 'checked' : '') + ' onchange="NOTIFS[\'' + n[0] + '\']=this.checked;toast(\'Préférence enregistrée (démo)\',\'ok\')"></label>').join('') + '</div>' +
    '<button class="btn w" onclick="S.logged=false;S.ptab=\'home\';render()">' + ICON('right-from-bracket') + 'Quitter le mode démo</button>' +
    '<p class="tiny center mut">Espace personnel de démonstration — aucune donnée réelle.</p>';

  const content = { home, abo, pay, pre, plan, prof }[S.ptab] || home;
  const nav = [['home', 'house', 'Accueil'], ['abo', 'id-card', 'Abonnement'], ['pay', 'receipt', 'Paiements'], ['pre', 'dumbbell', 'Présences'], ['plan', 'calendar-days', 'Planning'], ['prof', 'user', 'Profil']]
    .map(t => '<button class="' + (S.ptab === t[0] ? 'on' : '') + '" onclick="S.ptab=\'' + t[0] + '\';render()">' + ICON(t[1]) + '<span>' + t[2] + '</span></button>').join('');

  return '<div class="portal-wrap"><div class="portal-side"><a class="brand" href="#" onclick="go({view:\'land\'});return false;">' + logoChip() + '</a>' +
    '<span class="site-brand on-dark" style="margin-top:18px">' + ICON('palette') + esc(d.nom) + ' · ' + esc(d.palette) + '</span>' +
    '<span class="eyebrow light" style="margin-top:14px">Espace adhérent</span><h2 class="serif">« Ma salle,<br>dans ma poche. »</h2>' +
    '<p class="mut">Carte numérique, QR d’accès, abonnement et reçus. Le client retrouve tout sans installer d’application.</p>' +
    '<div class="portal-side-facts"><span>' + ICON('shield-halved') + 'Données fictives</span><span>' + ICON('wifi') + 'Fonctionne hors ligne</span><span>' + ICON('mobile-screen') + 'Sans installation</span></div>' +
    '<button class="btn ghost" onclick="go({view:\'net\'})">' + ICON('arrow-left') + 'Retour au back-office</button></div>' +
    '<div class="phone-wrap"><div class="phone-label">' + selector + '</div><div class="phone"><div class="phone-screen">' + sbar + '<div class="pb">' + content + '</div><nav class="pnav" aria-label="Navigation adhérent">' + nav + '</nav></div></div>' +
    '<p class="tiny mut center" style="margin-top:10px">' + ICON('circle-info') + ' Compte de démonstration — changez d’adhérent ci-dessus.</p></div></div>';
}

function portalLogin(m) {
  return '<div class="login-wrap"><div class="login-card">' +
    '<a class="brand" href="#" onclick="go({view:\'land\'});return false;">' + logoChip() + '</a>' +
    '<span class="site-brand" style="margin-top:14px">' + ICON('palette') + esc(D[m.home].nom) + ' · ' + esc(D[m.home].palette) + '</span>' +
    '<span class="eyebrow" style="margin-top:12px">Espace adhérent</span><h1 class="serif">Votre salle,<br>dans votre poche.</h1>' +
    '<p class="mut">Carte numérique, QR d’accès, abonnement et reçus. Aucun mot de passe réel n’est demandé.</p>' +
    '<div class="login-demo"><div class="row sp"><span class="tiny mut">Compte de démonstration</span><span class="badge b-off">pré-rempli</span></div>' +
      '<div class="f"><label>Identifiant<input value="' + m.id + '" readonly></label><label>Mot de passe<input type="password" value="demo-demo" readonly></label></div>' +
      '<button class="btn p w lg" onclick="S.logged=true;render()">' + ICON('arrow-right-to-bracket') + 'Entrer dans l’espace démo</button></div>' +
    '<button class="linkbtn" style="margin-top:14px" onclick="go({view:\'land\'})">' + ICON('arrow-left') + 'Retour à la présentation</button></div>' +
    '<div class="login-art"><div class="login-phone">' + qrSvg(m, 150) + '<b>' + esc(m.nom) + '</b><small>' + m.id + '</small></div><span class="pill dark">' + ICON('shield-halved') + 'Accès personnel sécurisé (simulé)</span></div></div>';
}

function switchMember(id) {
  ME = findMembre(id);
  ensureDemoHistory(ME);
  S.ptab = 'home';
  render();
}
function saveProfile() {
  const m = portalMember();
  m.nom = ($('pn').value || m.nom).trim();
  m.tel = $('pt2').value.trim();
  m.mail = $('pe').value.trim();
  recalc(); render();
  toast('Profil mis à jour localement', 'ok');
}
function bigQr() {
  const m = portalMember();
  openModal('<div style="text-align:center"><h3>Mon QR d’accès</h3><p class="tiny mut">' + esc(m.nom) + ' · ' + D[m.home].nom + ' · expire le ' + dstr(m.exp) + '</p>' +
    '<div class="qr-stage">' + qrSvg(m, 250, m.home) + '</div>' +
    '<p class="tiny mut" style="margin:10px 0">Scannez ce code avec un téléphone pour ouvrir la borne de contrôle. QR de démonstration, non valable dans une vraie salle.</p>' +
    '<div class="row gap8 center"><button class="btn p" onclick="closeModal();goCheckin(\'' + m.id + '\',\'' + m.home + '\')">' + ICON('door-open') + 'Ouvrir la borne</button>' +
    '<button class="btn" onclick="copyText(\'' + checkinUrl(m, m.home) + '\')">' + ICON('link') + 'Copier le lien</button></div>' +
    '<p class="tiny mut" style="margin-top:10px">' + (m.multi ? 'Accès multi-salles autorisé.' : 'Accès limité à ' + D[m.home].nom + ' — hors formule multi-salles, la borne refusera l’entrée.') + '</p></div>', { title: 'Mon QR' });
}
function renewMe() {
  const m = portalMember(), d = D[m.home], p = PLANS[m.plan], prix = prixMembre(m);
  m.debut = new Date(+Math.max(+AUJ, +m.exp));
  m.exp = new Date(+m.debut + p.j * J);
  m.susp = false;
  m.multi = m.multi || p.m >= 12;
  m.renouv = m.renouv || [];
  m.renouv.unshift({ date: new Date(), plan: m.plan, montant: prix, moyen: 'Wave', type: 'renouvellement' });
  if (m.demande) { m.demande = null; }
  d.pay.unshift({ ref: 'REC-' + m.id + '-R' + Date.now().toString().slice(-3), m: m.id, montant: prix, moyen: 'Wave', date: new Date(), st: 'confirmé', agent: 'Espace adhérent' });
  d.act.unshift(['Abonnement renouvelé', m.nom]);
  journal('Renouvellement adhérent', m.nom + ' · ' + p.n);
  recalc(); render();
  toast('Renouvellement simulé · reçu disponible', 'ok');
}

function requestMe(type) {
  const m = portalMember();
  if (m.demande && m.demande.statut === 'à traiter') return toast('Une demande est déjà en attente de traitement', 'warn');
  m.demande = { type: type || 'renouvellement', plan: m.plan, at: new Date(), statut: 'à traiter' };
  journal('Demande adhérent', m.nom + ' · ' + (m.demande.type === 'changement' ? 'changement de formule' : 'renouvellement'));
  recalc(); render();
  toast('Demande transmise au gérant (simulation)', 'ok');
}

function openPromoMe() {
  const m = portalMember();
  if (m.demande && m.demande.statut === 'à traiter') return toast('Une demande est déjà en attente de traitement', 'warn');
  const offres = promoOffres();
  if (!offres.length) return toast('Aucune promotion active pour le moment', 'warn');
  openModal('<h3>' + esc(PROMO.nom || 'Promotion') + '</h3><p class="tiny mut">Choisissez la durée qui vous intéresse. Montants fictifs, à valider par la Direction. Le gérant de ' + esc(D[m.home].nom) + ' appliquera le tarif promotionnel à l’accueil.</p>' +
    '<div class="f"><label>Offre souhaitée<select id="promoPlan">' + offres.map(o => {
      const base = (m.genre === 'f' ? TARIFS.f : TARIFS.h) * o.mois;
      return '<option value="' + o.mois + '"' + (o.mois === PLANS[m.plan].m ? ' selected' : '') + '>' + o.mois + ' mois — ' + fmt(o.prix) + ' (au lieu de ' + fmt(base) + ')</option>';
    }).join('') + '</select></label></div>' +
    '<div class="callout">' + ICON('circle-info') + ' Votre demande sera visible par le gérant dans les demandes à traiter. Aucun paiement n’est déclenché. Les prix affichés sont fictifs et restent à valider par la Direction.</div>' +
    '<div class="row gap8" style="margin-top:14px"><button class="btn p" onclick="savePromoMe()">' + ICON('paper-plane') + 'Envoyer au gérant</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Offre promotionnelle' });
}

function savePromoMe() {
  const m = portalMember();
  const months = +$('promoPlan').value;
  const plan = PLANS.findIndex(p => p.m === months);
  if (plan < 0) return;
  const type = plan === m.plan ? 'renouvellement' : 'changement';
  m.demande = { type, plan, at: new Date(), statut: 'à traiter', promo: true };
  journal('Demande offre promotionnelle', m.nom + ' · ' + months + ' mois');
  recalc(); closeModal(); render();
  toast('Demande transmise au gérant : ' + months + ' mois à ' + fmt(prixPlan(months, m.genre)), 'ok');
}

function cancelMe() {
  const m = portalMember();
  if (!m.demande) return;
  m.demande = null;
  journal('Demande annulée', m.nom);
  recalc(); render();
  toast('Demande annulée', 'warn');
}

function toggleAutoMe() {
  const m = portalMember();
  m.autoRenew = !m.autoRenew;
  journal('Renouvellement automatique ' + (m.autoRenew ? 'activé' : 'désactivé'), m.nom);
  recalc(); render();
  toast('Préférence de renouvellement enregistrée (démo)', 'ok');
}

function openPlanMe() {
  const m = portalMember();
  openModal('<h3>Changer de formule</h3><p class="tiny mut">Votre demande sera transmise au gérant de ' + esc(D[m.home].nom) + '.</p>' +
    '<div class="f"><label>Formule souhaitée<select id="mePlan">' + PLANS.map((p, i) => '<option value="' + i + '"' + (i === m.plan ? ' selected' : '') + '>' + planOptionText(p.m) + '</option>').join('') + '</select></label></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="savePlanMe()">' + ICON('paper-plane') + 'Envoyer la demande</button><button class="btn" onclick="closeModal()">Annuler</button></div>' +
    '<p class="tiny mut" style="margin-top:10px">Aucun paiement n’est déclenché. Le changement est une demande simulée.</p>',
    { title: 'Changer de formule' });
}

function savePlanMe() {
  const m = portalMember();
  const next = +$('mePlan').value;
  if (next === m.plan) { closeModal(); return toast('Vous avez déjà cette formule', 'warn'); }
  m.demande = { type: 'changement', plan: next, at: new Date(), statut: 'à traiter' };
  journal('Demande de changement de formule', m.nom + ' → ' + PLANS[next].n);
  recalc(); closeModal(); render();
  toast('Demande de changement envoyée (simulation)', 'ok');
}

function bookCourse(id) {
  const m = portalMember();
  m.resas = m.resas || [];
  const i = m.resas.indexOf(id);
  if (i >= 0) m.resas.splice(i, 1); else m.resas.push(id);
  journal(i >= 0 ? 'Réservation annulée' : 'Séance réservée', m.nom + ' · ' + (COURS.find(c => c.id === id) || {}).n);
  render();
  toast(i >= 0 ? 'Réservation annulée (simulation)' : 'Séance réservée (simulation)', i >= 0 ? 'warn' : 'ok');
}
