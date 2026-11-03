// ============================================================================
// Application : direction, établissements, back-office, rapports, expansion
// ============================================================================

const MENU = [
  { g: 'Direction', items: [['net', 'chart-pie', 'Vue générale'], ['team', 'user-shield', 'Équipe & accès'], ['etab', 'location-dot', 'Établissements'], ['exp', 'rocket', 'Expansion']] },
  { g: 'Opérations', items: [['mem', 'users', 'Adhérents'], ['abo', 'arrows-rotate', 'Abonnements'], ['pay', 'money-bill-wave', 'Paiements'], ['pre', 'qrcode', 'Contrôles d’accès'], ['qual', 'shield-halved', 'Qualité des données']] },
  { g: 'Analyse', items: [['rap', 'file-lines', 'Rapports'], ['set', 'gear', 'Paramètres']] }
];
const TAB_LABEL = { dash: 'Tableau de bord', mem: 'Adhérents', abo: 'Abonnements', pay: 'Paiements', pre: 'Contrôles d’accès', qual: 'Qualité des données' };

function navBadge(k) {
  if (k === 'qual') { const n = anomaliesNet().total; return n ? '<span class="nav-badge">' + n + '</span>' : ''; }
  if (k === 'abo') { const n = net.soon + net.exp; return n ? '<span class="nav-badge">' + n + '</span>' : ''; }
  return '';
}

function shell(body) {
  const inSalle = S.view === 'salle';
  const cur = inSalle ? S.tab : S.view;
  const salle = D[S.salle];
  const side = MENU.map(gr =>
    '<div class="nav-group"><span class="nav-g">' + gr.g + '</span>' +
    gr.items.map(m => '<button class="nav-item' + (cur === m[0] ? ' on' : '') + '" ' + (cur === m[0] ? 'aria-current="page" ' : '') +
      'data-tip="' + m[2] + '" onclick="nav(\'' + m[0] + '\')">' +
      '<span class="nav-ic">' + ICON(m[1]) + '</span><span class="lbl">' + m[2] + '</span>' + navBadge(m[0]) + '</button>').join('') +
    '</div>'
  ).join('');

  const opts = '<option value="net"' + (S.view === 'net' ? ' selected' : '') + '>Réseau — direction</option>' +
    SALLES.map(s => '<option value="' + s.id + '"' + (inSalle && S.salle === s.id ? ' selected' : '') + '>' + s.nom + '</option>').join('');

  const crumb = inSalle
    ? '<a href="#" onclick="go({view:\'net\'});return false;">Réseau</a><i class="fa-solid fa-chevron-right"></i><b>' + esc(salle.nom) + '</b><i class="fa-solid fa-chevron-right"></i><span>' + (TAB_LABEL[S.tab] || '') + '</span>'
    : '<b>' + ({ net: 'Vue générale', team: 'Équipe & accès', etab: 'Établissements', exp: 'Expansion', rap: 'Rapports', set: 'Paramètres' }[S.view] || 'Réseau') + '</b>';

  return '<div class="app' + (S.col ? ' col' : '') + '">' +
    '<aside class="side" aria-label="Navigation de l’application">' +
      '<div class="side-top">' +
        '<a class="brand" href="#" onclick="go({view:\'land\'});return false;" aria-label="Retour à l’accueil"><span class="mark">' + ICON('dumbbell') + '</span><span class="brand-t lbl">JUMEAUX <b>OS</b></span></a>' +
        '<button class="btn icon collapse" aria-label="Réduire le menu" onclick="S.col=!S.col;render()">' + ICON('angles-left') + '</button>' +
      '</div>' +
      (inSalle ? '<div class="side-site"><span class="side-site-dot" style="background:' + salle.color + '"></span><span class="lbl"><b>' + esc(salle.nom) + '</b><small>Back-office local</small></span></div>' : '') +
      '<nav class="side-nav">' + side + '</nav>' +
      '<div class="side-foot">' +
        '<div class="user"><span class="av" style="--av:#0E7A4B">DG</span><span class="lbl"><b>Direction générale</b><small>PDG · accès plateforme</small></span></div>' +
        '<button class="nav-item" data-tip="Quitter la démonstration" onclick="go({view:\'land\'})"><span class="nav-ic">' + ICON('right-from-bracket') + '</span><span class="lbl">Quitter la démo</span></button>' +
      '</div>' +
      '<div class="demo-strip lbl">' + ICON('flask') + 'Données fictives</div>' +
    '</aside>' +
    '<div class="content">' +
      '<header class="top">' +
        '<button class="btn icon menu-btn" aria-label="Agrandir ou réduire le menu" onclick="S.col=!S.col;render()">' + ICON('bars') + '</button>' +
        '<nav class="crumb" aria-label="Fil d’Ariane">' + crumb + '</nav>' +
        '<div class="search" role="search"><span class="search-ic">' + ICON('magnifying-glass') + '</span>' +
          '<input id="gq" type="search" placeholder="Rechercher un adhérent, un identifiant…" aria-label="Rechercher un adhérent" value="' + esc(S.q) + '" oninput="searchM(this.value)">' +
          '<kbd>/</kbd></div>' +
        '<div class="top-actions">' +
          '<select class="site-sel" onchange="pick(this.value)" aria-label="Choisir un établissement">' + opts + '</select>' +
          '<button class="btn icon bell" aria-label="Notifications" data-tip="Alertes du réseau" onclick="openNotifs()">' + ICON('bell') + (anomaliesNet().total ? '<span class="bell-dot"></span>' : '') + '</button>' +
          '<button class="btn icon" aria-label="Changer de thème" data-tip="Thème" onclick="toggleTheme()">' + ICON('circle-half-stroke') + '</button>' +
          '<button class="btn s portal-btn" onclick="go({view:\'portal\'})">' + ICON('mobile-screen') + '<span>Espace adhérent</span></button>' +
          '<button class="btn p s" onclick="startPres()">' + ICON('play') + '<span class="pres-lbl">Présenter</span></button>' +
        '</div>' +
      '</header>' +
      '<main class="main" id="main">' + body + '</main>' +
    '</div>' +
    '<div class="mobile-note">' + ICON('circle-info') + '<span>Prototype de démonstration — données fictives</span></div>' +
  '</div>';
}

function nav(k) {
  if (['net', 'team', 'etab', 'exp', 'rap', 'set'].includes(k)) go({ view: k });
  else go({ view: 'salle', tab: k, page: 0 });
}
function pick(v) {
  if (v === 'net') go({ view: 'net', q: '' });
  else go({ view: 'salle', salle: v, tab: (S.view === 'salle' ? S.tab : 'dash'), page: 0, q: '', filter: 'tous' });
}
function searchM(q) {
  S.q = q; S.page = 0;
  if (S.view !== 'salle' || S.tab !== 'mem') {
    S.view = 'salle'; S.tab = 'mem';
    render();
    const el = $('gq');
    if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  } else drawTable();
}

function head(title, sub, actions) {
  return '<div class="page-head"><div><h1 class="page-title">' + title + '</h1>' + (sub ? '<p class="page-sub">' + sub + '</p>' : '') + '</div>' +
    (actions ? '<div class="page-actions">' + actions + '</div>' : '') + '</div>';
}

function openNotifs() {
  const an = anomaliesNet();
  const list = [
    [an.pending + ' paiements à vérifier', 'Des encaissements sont en attente de confirmation.', 'pay', 'shield-halved'],
    [net.soon + ' abonnements expirent sous 7 jours', 'Une relance suffit souvent à éviter un départ.', 'abo', 'clock'],
    [an.noTel + ' fiches sans téléphone', 'Impossible de joindre ces adhérents.', 'qual', 'phone-slash'],
    [net.exp + ' abonnements expirés', 'À reconquérir ou à archiver proprement.', 'mem', 'user-clock']
  ];
  openModal('<h3>Alertes du réseau</h3><p class="mut tiny">Simulation basée sur les données fictives en mémoire.</p><div class="notif-list">' +
    list.map(n => '<button class="notif" onclick="closeModal();' + (n[2] === 'pay' || n[2] === 'abo' ? 'go({view:\'salle\',tab:\'' + n[2] + '\'})' : 'go({view:\'salle\',tab:\'' + n[2] + '\'})') + '"><span class="notif-ic">' + ICON(n[3]) + '</span><span><b>' + n[0] + '</b><small>' + n[1] + '</small></span>' + ICON('chevron-right') + '</button>').join('') +
    '</div><button class="btn w" style="margin-top:14px" onclick="closeModal()">Fermer</button>', { title: 'Alertes du réseau' });
}

// ---------------------------------------------------------------- RÉSEAU
function viewNet() {
  const k = net;
  const obj = SALLES.reduce((a, s) => a + kp(s.id).objectif, 0);
  const managersAct = MANAGERS.filter(m => m.statut === 'actif').length;
  const twofa = MANAGERS.filter(m => m.twofa && m.statut === 'actif').length;
  const plans = [0, 1, 2].map(i => ({ label: PLANS[i].n, value: SALLES.reduce((a, s) => a + D[s.id].mem.filter(m => m.plan === i).length, 0), color: PLANS[i].c }));
  const rows = SALLES.map(s => {
    const x = kp(s.id);
    return '<tr class="c" onclick="go({view:\'salle\',salle:\'' + s.id + '\',tab:\'dash\'})">' +
      '<td data-l="Établissement"><span class="site-dot" style="background:' + s.color + '"></span><b>' + esc(s.nom) + '</b><small class="mut">' + esc(s.resp) + '</small></td>' +
      '<td data-l="Actifs">' + x.act + ' <small class="mut">/ ' + x.tot + '</small><span class="cell-bar"><i style="width:' + x.taux + '%"></i></span></td>' +
      '<td data-l="Présences">' + x.pres + '</td>' +
      '<td data-l="Revenus">' + fmt(x.rev) + '</td>' +
      '<td data-l="Expirés">' + (x.exp ? '<span class="t-ko">' + x.exp + '</span>' : '<span class="t-ok">0</span>') + '</td>' +
      '<td data-l="Évolution"><span class="' + (x.evo >= 0 ? 'up' : 'down') + '">' + (x.evo >= 0 ? '+' : '') + String(x.evo).replace('.', ',') + ' %</span></td>' +
      '<td data-l="Ouvrir"><span class="rowlink">Ouvrir ' + ICON('arrow-right') + '</span></td></tr>';
  }).join('');

  return head('Vue générale du réseau',
    'Tout le réseau sur un seul écran. <span class="pill inline"><span class="dot"></span>Démonstration interactive</span>',
    '<button class="btn s" onclick="go({view:\'rap\'})">' + ICON('file-export') + 'Rapports</button><button class="btn p s" onclick="startPres()">' + ICON('play') + 'Visite guidée</button>') +
    '<section class="dir-banner">' +
      '<div class="dir-avatar" aria-hidden="true">DG<span class="dir-ring"></span></div>' +
      '<div class="dir-copy"><span class="dir-kicker">' + ICON('crown') + 'Espace direction · PDG</span>' +
        '<h2 class="serif">Toute la plateforme, sous votre contrôle.</h2>' +
        '<p>Vous pilotez les ' + SALLES.length + ' salles, les indicateurs consolidés et les accès de chaque gérant. La direction reste l’espace principal ; chaque salle garde son identité.</p></div>' +
      '<div class="dir-facts">' +
        '<span><b>' + managersAct + '</b><small>gérants & équipes actifs</small></span>' +
        '<span><b>' + twofa + '/' + managersAct + '</b><small>comptes avec 2FA</small></span>' +
        '<span><b>' + SALLES.length + '</b><small>salles supervisées</small></span>' +
      '</div>' +
      '<div class="dir-actions">' +
        '<button class="btn p" onclick="go({view:\'team\'})">' + ICON('user-shield') + 'Gérer l’équipe & les accès</button>' +
        '<button class="btn ghost" onclick="go({view:\'set\'})">' + ICON('shield-halved') + 'Sécurité</button>' +
      '</div>' +
    '</section>' +
    '<div class="grid g4">' +
      kpi('Adhérents actifs', k.act + ' <small class="kpi-of">/ ' + k.tot + '</small>', '<span class="up">' + ICON('arrow-trend-up') + ' +' + Math.round(k.tot * .12) + ' ce mois</span>', { spark: spark(D.km.rev) }) +
      kpi('Revenus du mois', fmt(k.rev), '<span class="' + (addv('rev')[11] >= addv('rev')[10] ? 'up' : 'down') + '">' + ICON('arrow-trend-up') + ' +12,4 % vs octobre</span>', { spark: spark(addv('rev')) }) +
      kpi('Présences aujourd’hui', k.pres, '<span class="mut">' + Math.round(k.pres / k.act * 10) / 10 + ' passages / adhérent actif</span>') +
      kpi('Taux de rétention', k.taux + ' %', '<span class="up">' + ICON('shield-heart') + ' ' + k.multi + ' accès multi-salles</span>') +
    '</div>' +
    '<div class="grid g2">' +
      line(addv('rev').map(v => Math.round(v / 1e4) / 100), MOIS, 'Revenus du réseau — 12 mois', ' M FCFA', { total: fmt(k.rev) }) +
      bars(SALLES.map(s => Math.round(kp(s.id).rev / 1e3)), SALLES.map(s => s.nom), 'Revenus par établissement', ' k FCFA', { total: fmt(k.rev) }) +
    '</div>' +
    '<div class="grid g3">' +
      bars([0, 1, 2, 3, 4, 5, 6].map(i => sum(id => D[id].freq[i])), JOURS, 'Fréquentation — 7 derniers jours', '', { total: fmtShort(k.pres) + ' auj.' }) +
      donut(plans, 'Répartition des formules', k.tot) +
      liveCard() +
    '</div>' +
    '<div class="card table-card"><div class="chart-h"><div><h3>Comparaison des établissements</h3><p class="tiny mut">Cliquez une ligne pour ouvrir le back-office.</p></div><span class="badge b-ok">' + SALLES.length + ' salles</span></div>' +
      '<div class="table-scroll"><table><thead><tr><th scope="col">Établissement</th><th scope="col">Actifs</th><th scope="col">Présences</th><th scope="col">Revenus</th><th scope="col">Expirés</th><th scope="col">Évolution</th><th scope="col"></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="table-foot"><span class="mut tiny">Objectif réseau du mois : <b>' + fmt(obj) + '</b> · Réalisé : <b>' + fmt(k.encaisse) + '</b></span><span class="badge ' + (k.encaisse >= obj ? 'b-ok' : 'b-warn') + '">' + Math.round(k.encaisse / obj * 100) + ' % de l’objectif</span></div>' +
    '</div>' +
    '<div class="grid g2">' + activity('pa') + alerts() + '</div>' +
    '<p class="tiny mut center">Version démonstration : les statistiques sont générées localement. La future version connectée les actualisera en temps réel.</p>';
}

function liveCard() {
  const seed = Array.from({ length: 3 }, pickLiveEvent);
  return '<div class="card live-card"><div class="chart-h"><div><h3>Passages en direct</h3><p class="tiny mut">Flux simulé — ' + '<span class="live-tag"><i></i>démo</span></p></div>' +
    '<button class="switch' + (S.live ? ' on' : '') + '" role="switch" aria-checked="' + S.live + '" aria-label="Activer le flux en direct" onclick="toggleLive()"><i></i></button></div>' +
    '<div class="live-meta"><span>' + ICON('qrcode') + ' <b id="liveCount" data-n="' + (net.pres) + '">' + net.pres + '</b> passages aujourd’hui</span><time id="liveClock">' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '</time></div>' +
    '<div class="live-feed" id="liveFeed">' + seed.map(liveItem).join('') + '</div>' +
    '<p class="tiny mut" style="margin-top:auto">' + (S.live ? 'Le flux se met à jour toutes les 4 secondes.' : 'Activez le direct pour voir les passages arriver.') + '</p></div>';
}

function liveItem(ev) {
  const ok = ev.tone === 'ok';
  return '<div class="live-item ' + (ok ? 'ok' : 'ko') + '"><span class="live-ic">' + ICON(ok ? 'circle-check' : 'circle-xmark') + '</span>' +
    '<span class="live-body"><b>' + esc(ev.m.nom) + '</b><small>' + esc(ev.salle.nom) + ' · ' + ev.type + ' · ' + esc(ev.title) + '</small></span>' +
    '<time>' + hhmm(ev.at) + '</time></div>';
}

let _liveTimer = null;
function toggleLive() {
  S.live = !S.live;
  render();
  toast(S.live ? 'Flux temps réel simulé activé' : 'Flux en direct mis en pause', 'info');
}
function initLive() {
  clearInterval(_liveTimer); _liveTimer = null;
  const feed = $('liveFeed');
  if (!feed) return;
  if (S.live) _liveTimer = setInterval(() => {
    const ev = pickLiveEvent();
    const f = $('liveFeed');
    if (!f) { clearInterval(_liveTimer); _liveTimer = null; return; }
    f.insertAdjacentHTML('afterbegin', liveItem(ev));
    while (f.children.length > 5) f.lastElementChild.remove();
    const c = $('liveCount');
    if (c) { const n = (+c.dataset.n || 0) + 1; c.dataset.n = n; c.textContent = n; }
  }, 4000);
}

// ---------------------------------------------------------------- ÉTABLISSEMENTS
function viewEtab() {
  const cards = SALLES.map(s => {
    const k = kp(s.id);
    return '<article class="card site-card"><div class="site-head"><span class="site-mark" style="--c:' + s.color + '">' + ICON('dumbbell') + '</span>' +
      '<div><h3>' + esc(s.nom) + '</h3><p class="mut tiny">' + esc(s.adresse) + '</p></div><span class="badge b-ok">Ouvert</span></div>' +
      '<div class="site-kpis"><div><b>' + k.act + '</b><small>actifs</small></div><div><b>' + k.pres + '</b><small>présences</small></div><div><b>' + fmtShort(k.rev) + '</b><small>FCFA / mois</small></div></div>' +
      '<div class="site-meta"><span>' + ICON('user-tie') + esc(s.resp) + '</span><span>' + ICON('users') + s.staff + ' collaborateurs</span><span>' + ICON('ruler-combined') + s.surface + ' m²</span><span>' + ICON('palette') + esc(s.palette) + '</span></div>' +
      '<div class="progress"><i style="width:' + k.taux + '%;background:' + s.color + '"></i></div><span class="tiny mut">' + k.taux + ' % des adhérents actifs · ' + k.soon + ' expirent bientôt</span>' +
      '<div class="site-actions"><button class="btn s p" onclick="go({view:\'salle\',salle:\'' + s.id + '\',tab:\'dash\'})">Back-office</button><button class="btn s" onclick="go({view:\'salle\',salle:\'' + s.id + '\',tab:\'mem\'})">Adhérents</button></div></article>';
  }).join('');
  return head('Établissements', 'Chaque salle conserve son autonomie. La direction garde la vue d’ensemble.',
    '<button class="btn s" onclick="go({view:\'exp\'})">' + ICON('rocket') + 'Simuler une nouvelle salle</button>') +
    '<div class="grid g2">' + cards + '</div>' +
    '<div class="grid g2">' + bars(SALLES.map(s => kp(s.id).act), SALLES.map(s => s.nom), 'Adhérents actifs par salle', '', { total: net.act + ' actifs' }) + bars(SALLES.map(s => kp(s.id).taux), SALLES.map(s => s.nom), 'Taux de rétention par salle', ' %', { total: net.taux + ' %' }) + '</div>';
}

// ---------------------------------------------------------------- BACK-OFFICE
function viewSalle() {
  const id = S.salle, d = D[id], k = kp(id);
  const tabs = ['dash', 'mem', 'abo', 'pay', 'pre', 'qual'].map(t =>
    '<button class="tab' + (S.tab === t ? ' on' : '') + '" onclick="go({tab:\'' + t + '\',page:0})">' +
    (t === 'mem' ? ICON('users') : t === 'pay' ? ICON('money-bill-wave') : t === 'pre' ? ICON('qrcode') : t === 'qual' ? ICON('shield-halved') : '') + TAB_LABEL[t] +
    (t === 'qual' && anomalies(id).total ? '<span class="tab-badge">' + anomalies(id).total + '</span>' : '') + '</button>').join('');
  const header = '<div class="salle-head"><div>' +
    '<span class="site-brand"><i class="fa-solid fa-palette" aria-hidden="true"></i>' + esc(d.palette) + '</span>' +
    '<div class="row gap8"><span class="site-dot" style="background:' + d.color + '"></span><h1 class="page-title">Jumeaux Fitness — ' + esc(d.nom) + '</h1></div>' +
    '<p class="page-sub">Responsable : ' + esc(d.resp) + ' · ' + esc(d.adresse) + ' · ' + d.tel + '</p></div>' +
    '<div class="salle-head-actions"><span class="badge b-ok"><i></i>Données locales</span><button class="btn s" onclick="go({view:\'net\'})">' + ICON('chart-pie') + 'Vue réseau</button></div></div>' +
    '<div class="tabs" role="tablist">' + tabs + '</div>';

  let b = '';
  if (S.tab === 'dash') b = salleDash(id, d, k);
  if (S.tab === 'mem') b = salleMem(id, d);
  if (S.tab === 'abo') b = salleAbo(id, d, k);
  if (S.tab === 'pay') b = sallePay(id, d, k);
  if (S.tab === 'pre') b = sallePre(id, d, k);
  if (S.tab === 'qual') b = salleQual(id, d);
  return header + b;
}

function salleDash(id, d, k) {
  const spread = PLANS.map((p, i) => ({ label: p.n, value: d.mem.filter(m => m.plan === i).length, color: p.c }));
  return '<div class="grid g4">' +
    kpi('Adhérents actifs', k.act + ' <small class="kpi-of">/ ' + k.tot + '</small>', '<span class="up">' + k.taux + ' % du fichier</span>') +
    kpi('Revenus du mois', fmt(k.rev), '<span class="' + (k.evo >= 0 ? 'up' : 'down') + '">' + (k.evo >= 0 ? '+' : '') + String(k.evo).replace('.', ',') + ' % vs mois dernier</span>', { spark: spark(d.rev) }) +
    kpi('Présences aujourd’hui', k.pres, '<span class="mut">' + Math.round(k.pres / k.act * 10) / 10 + ' par adhérent actif</span>') +
    kpi('Expirent bientôt', k.soon, '<span class="warn-t">' + ICON('clock') + ' sous 7 jours · ' + k.exp + ' expirés</span>') +
    '</div>' +
    '<div class="grid g2">' + line(d.rev.map(v => Math.round(v / 1e4) / 100), MOIS, 'Revenus mensuels', ' M FCFA', { total: fmt(k.rev) }) +
    bars(d.freq, JOURS, 'Fréquentation des 7 derniers jours', '', { total: fmtShort(k.pres) + ' auj.' }) + '</div>' +
    '<div class="grid g2">' + line(d.adh, MOIS, 'Évolution des adhérents', '', { total: k.tot + ' fiches' }) + donut(spread, 'Formules de la salle', k.tot) + '</div>' +
    '<div class="grid g2">' + activity(id) +
      '<div class="card"><div class="chart-h"><h3>Objectif du mois</h3><span class="badge ' + (k.atteinte >= 100 ? 'b-ok' : 'b-warn') + '">' + k.atteinte + ' %</span></div>' +
      '<div class="objectif"><b>' + fmt(k.encaisse) + '</b><span class="mut">encaissés sur ' + fmt(k.objectif) + '</span>' +
      '<div class="progress lg"><i style="width:' + Math.min(100, k.atteinte) + '%"></i></div>' +
      '<div class="row sp tiny mut"><span>' + d.pay.filter(p => p.st === 'confirmé').length + ' paiements confirmés</span><span>' + d.pay.filter(p => p.st === 'en attente').length + ' à vérifier</span></div></div>' +
      '<button class="btn p w" style="margin-top:14px" onclick="go({tab:\'pay\'})">' + ICON('cash-register') + 'Ouvrir la caisse</button></div>' +
    '</div>';
}

function salleMem(id, d) {
  const counts = { tous: d.mem.length, actif: 0, 'bientôt': 0, expiré: 0, suspendu: 0 };
  d.mem.forEach(m => counts[statut(m)]++);
  const chips = ['tous', 'actif', 'bientôt', 'expiré', 'suspendu'].map(f =>
    '<button class="chip' + (S.filter === f ? ' on' : '') + '" onclick="S.filter=\'' + f + '\';S.page=0;go({tab:\'mem\'})">' +
    (f === 'tous' ? 'Tous' : STATUT_META[f][1]) + '<span>' + counts[f] + '</span></button>').join('');
  return head('Adhérents', counts.tous + ' fiches · ' + counts.actif + ' actifs · ' + counts['bientôt'] + ' à renouveler',
    '<button class="btn s" onclick="exportCSV(\'membres\')">' + ICON('file-csv') + 'Exporter</button><button class="btn p s" onclick="addForm()">' + ICON('plus') + 'Nouvel adhérent</button>') +
    '<div class="card table-card"><div class="table-tools"><div class="chips">' + chips + '</div>' +
      '<span class="mut tiny">' + ICON('arrows-up-down') + ' Cliquez un en-tête pour trier</span></div>' +
      '<div id="tbl"></div></div>';
}

function salleAbo(id, d, k) {
  const cards = PLANS.map((p, i) => {
    const n = d.mem.filter(m => m.plan === i).length;
    return '<div class="card plan-card' + (p.pop ? ' pop' : '') + '" style="--c:' + p.c + '">' + (p.pop ? '<span class="plan-flag">Le plus choisi</span>' : '') +
      '<span class="plan-name">' + p.n + '</span><b class="plan-price">' + fmt(p.p) + '</b><span class="tiny mut">' + p.j + ' jours · ' + p.d + '</span>' +
      '<div class="plan-bar"><i style="width:' + Math.round(n / d.mem.length * 100) + '%"></i></div><span class="tiny mut"><b>' + n + '</b> adhérents · ' + Math.round(n / d.mem.length * 100) + ' %</span></div>';
  }).join('');
  const rows = d.mem.filter(m => ['bientôt', 'expiré'].includes(statut(m))).sort((a, b) => a.exp - b.exp).slice(0, 10).map(m =>
    '<tr><td data-l="Adhérent">' + avatar(m.nom) + '<b>' + esc(m.nom) + '</b><small class="mut">' + m.id + '</small></td>' +
    '<td data-l="Formule">' + PLANS[m.plan].n + '</td><td data-l="Échéance">' + dstr(m.exp) + '</td>' +
    '<td data-l="Statut">' + bdg(statut(m)) + '</td>' +
    '<td><div class="row gap6 no-wrap"><button class="btn s p" onclick="renew(\'' + m.id + '\')">' + ICON('rotate') + 'Renouveler</button><button class="btn s" onclick="fiche(\'' + m.id + '\')">Fiche</button></div></td></tr>').join('');
  return head('Abonnements', k.soon + ' échéances sous 7 jours · ' + k.exp + ' expirés · ' + k.multi + ' accès multi-salles',
    '<button class="btn s" onclick="go({tab:\'pay\'})">' + ICON('money-bill-wave') + 'Voir la caisse</button>') +
    '<div class="grid g3">' + cards + '</div>' +
    '<div class="card table-card"><div class="chart-h"><div><h3>Renouvellements à traiter</h3><p class="tiny mut">Un renouvellement met à jour l’échéance et crée un reçu.</p></div><span class="badge b-warn">' + (k.soon + k.exp) + ' dossiers</span></div>' +
      (rows ? '<div class="table-scroll"><table><thead><tr><th>Adhérent</th><th>Formule</th><th>Échéance</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : emptyState('circle-check', 'Aucun renouvellement en attente', 'Toutes les échéances sont à jour.')) +
      '<p class="tiny mut" style="margin-top:10px">' + ICON('circle-info') + ' Le renouvellement est simulé : aucun paiement réel n’est effectué.</p></div>';
}

function sallePay(id, d, k) {
  const st = S.payFilter || 'tous';
  const list = d.pay.filter(p => st === 'tous' || p.st === st);
  const total = d.pay.filter(p => p.st === 'confirmé').reduce((a, p) => a + p.montant, 0);
  const pending = d.pay.filter(p => p.st === 'en attente').reduce((a, p) => a + p.montant, 0);
  const chips = ['tous', 'confirmé', 'en attente', 'annulé'].map(f =>
    '<button class="chip' + (st === f ? ' on' : '') + '" onclick="S.payFilter=\'' + f + '\';go({tab:\'pay\'})">' +
    (f === 'tous' ? 'Tous' : STATUT_META[f][1]) + '<span>' + (f === 'tous' ? d.pay.length : d.pay.filter(p => p.st === f).length) + '</span></button>').join('');
  const rows = list.slice(0, 20).map(p => {
    const m = findMembre(p.m);
    return '<tr><td data-l="Référence"><b class="mono">' + p.ref + '</b><small class="mut">' + p.agent + '</small></td>' +
      '<td data-l="Adhérent">' + avatar(m.nom) + esc(m.nom) + '</td>' +
      '<td data-l="Montant"><b>' + fmt(p.montant) + '</b></td>' +
      '<td data-l="Moyen">' + ICON(MOYENS_ICON[p.moyen] || 'wallet') + ' ' + p.moyen + '</td>' +
      '<td data-l="Date">' + dstr(p.date) + '</td><td data-l="Statut">' + bdg(p.st) + '</td>' +
      '<td><button class="btn s" onclick="receiptRef(\'' + p.ref + '\')">Reçu</button></td></tr>';
  }).join('');
  return head('Paiements', 'Chaque encaissement laisse une trace. Les reçus sont générés dans le navigateur.',
    '<button class="btn s" onclick="exportCSV(\'paiements\')">' + ICON('file-csv') + 'Exporter</button><button class="btn p s" onclick="newPayment()">' + ICON('plus') + 'Enregistrer un paiement</button>') +
    '<div class="grid g4">' + kpi('Encaissé (34 j)', fmt(total), '<span class="up">' + d.pay.filter(p => p.st === 'confirmé').length + ' reçus</span>') +
    kpi('En attente', fmt(pending), '<span class="warn-t">' + d.pay.filter(p => p.st === 'en attente').length + ' à vérifier</span>') +
    kpi('Panier moyen', fmt(Math.round(total / Math.max(1, d.pay.filter(p => p.st === 'confirmé').length))), '<span class="mut">par encaissement</span>') +
    kpi('Taux de recouvrement', Math.round(total / (total + pending || 1) * 100) + ' %', '<span class="mut">sur la période</span>') + '</div>' +
    '<div class="card table-card"><div class="table-tools"><div class="chips">' + chips + '</div><span class="tiny mut">' + list.length + ' opérations</span></div>' +
    (rows ? '<div class="table-scroll"><table><thead><tr><th>Référence</th><th>Adhérent</th><th>Montant</th><th>Moyen</th><th>Date</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : emptyState('receipt', 'Aucun paiement', 'Modifiez le filtre pour afficher d’autres opérations.')) +
    '<p class="tiny mut" style="margin-top:10px">' + ICON('lock') + ' Aucune transaction réelle. Les moyens de paiement sont affichés à titre d’exemple.</p></div>';
}

function sallePre(id, d, k) {
  const logs = d.pre.slice().reverse().slice(0, 10);
  const rows = logs.map(p => {
    const m = findMembre(p.m);
    return '<tr><td data-l="Heure"><b class="mono">' + hhmm(p.at) + '</b></td><td data-l="Adhérent">' + avatar(m.nom) + esc(m.nom) + '</td>' +
      '<td data-l="Type"><span class="type-pill">' + ICON(p.type === 'QR' ? 'qrcode' : 'hand-pointer') + p.type + '</span></td>' +
      '<td data-l="Résultat">' + bdg(p.ok ? 'autorisé' : 'refusé') + '</td></tr>';
  }).join('');
  return head('Contrôles d’accès', 'Le QR de l’adhérent est contrôlé en une seconde. Le résultat est immédiat et sans ambiguïté.',
    '<button class="btn s" onclick="openScanner()">' + ICON('qrcode') + 'Plein écran</button>') +
    '<div class="grid g4">' + kpi('Passages aujourd’hui', k.pres, '<span class="up">' + ICON('qrcode') + ' ' + d.pre.filter(p => p.type === 'QR').length + ' par QR</span>') +
      kpi('Accès autorisés', d.pre.filter(p => p.ok).length, '<span class="mut">sur ' + d.pre.length + ' contrôles</span>') +
      kpi('Refus', d.pre.filter(p => !p.ok).length, '<span class="warn-t">à orienter vers l’accueil</span>') +
      kpi('Temps moyen', '3 s', '<span class="mut">objectif de démonstration</span>') + '</div>' +
    '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><h3>Borne de contrôle</h3><span class="badge b-ok"><i></i>prête</span></div>' +
        '<div class="scanner-shell"><div class="scanner-beam"></div><span class="scanner-corners"></span>' + ICON('qrcode') + '<p class="tiny">Sélectionnez un adhérent pour simuler un scan, ou scannez son QR depuis l’espace membre.</p></div>' +
        '<div class="f"><label>Adhérent à contrôler<select id="sm">' + SALLES.map(s => '<optgroup label="' + s.nom + '">' + D[s.id].mem.slice(0, 18).map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + m.id + ' — ' + statut(m) + '</option>').join('') + '</optgroup>').join('') + '</select></label>' +
        '<label>Salle où a lieu le contrôle<select id="sc">' + SALLES.map(s => '<option value="' + s.id + '"' + (s.id === id ? ' selected' : '') + '>' + s.nom + '</option>').join('') + '</select></label>' +
        '<label>Scénario<select id="ss"><option value="auto">Contrôle réel (statut + multi-salles)</option><option value="inv">QR invalide</option></select></label></div>' +
        '<div class="row gap8" style="margin-top:12px"><button class="btn p" onclick="scan()">' + ICON('qrcode') + 'Lancer le contrôle</button>' +
        '<button class="btn" onclick="startCamera()">' + ICON('camera') + 'Caméra</button></div>' +
        '<div id="sr" class="scan-slot" aria-live="polite"></div>' +
      '</div>' +
      '<div class="card table-card"><div class="chart-h"><div><h3>Dernières entrées</h3><p class="tiny mut">Aujourd’hui — ' + esc(d.nom) + '</p></div><button class="btn s" onclick="exportCSV(\'presences\')">CSV</button></div>' +
        '<div class="table-scroll"><table><thead><tr><th>Heure</th><th>Adhérent</th><th>Type</th><th>Résultat</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<p class="tiny mut" style="margin-top:10px">' + ICON('circle-info') + ' Scannez le QR affiché dans l’espace adhérent avec un téléphone pour ouvrir la borne de démonstration.</p></div>' +
    '</div>';
}

function salleQual(id, d) {
  const a = anomalies(id);
  const cards = [
    ['phone-slash', 'Fiches sans téléphone', a.noTel.length, 'Impossible de joindre l’adhérent pour une relance.', 'Compléter les fiches', 'fixTel'],
    ['copy', 'Doublons potentiels', a.dups.length, 'Deux fiches portent le même nom. Vérification recommandée.', 'Marquer comme vérifiés', 'fixDup'],
    ['money-bill-wave', 'Paiements en attente', a.pending.length, 'Un encaissement non confirmé crée un écart de caisse.', 'Tout confirmer', 'fixPay'],
    ['envelope', 'E-mails manquants', a.noMail.length, 'Nécessaire pour envoyer les reçus numériques.', 'Compléter les e-mails', 'fixMail']
  ];
  return head('Qualité des données', 'Le centre de contrôle repère les erreurs avant qu’elles ne coûtent du temps à l’accueil.',
    '<span class="badge ' + (a.total ? 'b-warn' : 'b-ok') + '">' + a.total + ' point(s) à traiter</span>') +
    '<div class="grid g4">' + kpi('Points ouverts', a.total, '<span class="mut">sur ' + d.mem.length + ' fiches</span>') +
      kpi('Fiches complètes', Math.round((1 - a.noTel.length / d.mem.length) * 100) + ' %', '<span class="up">' + ICON('circle-check') + ' téléphone renseigné</span>') +
      kpi('Paiements à vérifier', a.pending.length, '<span class="warn-t">' + fmt(a.pending.reduce((x, p) => x + p.montant, 0)) + '</span>') +
      kpi('Doublons', a.dups.length, '<span class="mut">détection par nom</span>') + '</div>' +
    '<div class="grid g2">' + cards.map(c =>
      '<div class="card qual-card"><div class="qual-head"><span class="qual-ic">' + ICON(c[0]) + '</span><div><h3>' + c[1] + '</h3><p class="mut tiny">' + c[3] + '</p></div><b class="qual-n ' + (c[2] ? 'warn' : 'ok') + '">' + c[2] + '</b></div>' +
      '<div class="qual-body">' +
        (c[2] ? '<div class="qual-list">' + (c[5] === 'fixTel' ? a.noTel.slice(0, 4) : c[5] === 'fixDup' ? a.dups.slice(0, 4) : c[5] === 'fixPay' ? a.pending.slice(0, 4).map(p => ({ nom: (findMembre(p.m) || {}).nom || p.m, id: p.ref })) : a.noMail.slice(0, 4)).map(x => '<span><b>' + esc(x.nom) + '</b><small>' + esc(x.id) + '</small></span>').join('') + (c[2] > 4 ? '<span class="mut">+' + (c[2] - 4) + ' autres</span>' : '') + '</div>' : '<p class="tiny mut">Aucun point ouvert. Tout est propre.</p>') +
      '</div><button class="btn s ' + (c[2] ? 'p' : '') + '" ' + (c[2] ? 'onclick="' + c[5] + '()"' : 'disabled') + '>' + (c[2] ? c[4] : 'Rien à corriger') + '</button></div>').join('') + '</div>' +
    '<div class="card">' + '<div class="chart-h"><h3>Journal des corrections</h3><span class="badge b-off">simulation</span></div>' +
      '<div id="journal">' + (S.journal && S.journal.length ? S.journal.map(j => '<div class="act"><span class="act-ic">' + ICON('check') + '</span><span><b>' + esc(j.t) + '</b><small>' + j.d + '</small></span></div>').join('') : '<p class="tiny mut">Aucune correction effectuée dans cette session. Les actions ci-dessus modifient réellement les données fictives.</p>') + '</div></div>';
}

// ---------------------------------------------------------------- ÉQUIPE & ACCÈS
function managerSite(m) { return SALLES.find(s => s.id === m.salle) || null; }
function managerColor(m) { const s = managerSite(m); return s ? s.color : '#0E7A4B'; }
function managerPerms(role) {
  return { gerant: ['Toute la salle'], accueil: ['Adhérents', 'Caisse', 'Contrôles'], caisse: ['Paiements', 'Reçus'], coach: ['Présences', 'Planning'] }[role] || ['Accès limité'];
}
function managerCard(m) {
  const s = managerSite(m), role = ROLE_META[m.role] || { n: m.role, d: '' };
  const suspended = m.statut !== 'actif';
  return '<article class="card team-card' + (suspended ? ' team-off' : '') + '" style="--c:' + managerColor(m) + '">' +
    '<div class="team-top">' + avatar(m.nom, 'big') +
      '<div class="team-id"><b>' + esc(m.nom) + '</b><small>' + esc(role.n) + ' · ' + m.id + '</small></div>' +
      bdg(suspended ? 'suspendu' : 'actif') +
    '</div>' +
    '<div class="team-tags"><span class="site-tag" style="--c:' + managerColor(m) + '">' + ICON('location-dot') + esc(s ? s.nom : 'Réseau') + '</span>' +
      '<span class="badge ' + (m.twofa ? 'b-ok' : 'b-warn') + '">' + ICON('shield-halved') + ' 2FA ' + (m.twofa ? 'activée' : 'à activer') + '</span>' +
      '<span class="badge b-off">' + m.sessions + ' session' + (m.sessions > 1 ? 's' : '') + '</span></div>' +
    '<div class="team-meta"><span>' + ICON('envelope') + esc(m.mail) + '</span><span>' + ICON('phone') + esc(m.tel) + '</span>' +
      '<span>' + ICON('clock-rotate-left') + 'Dernière activité : ' + dstr(m.dernier) + '</span></div>' +
    '<div class="team-perms">' + managerPerms(m.role).map(p => '<span>' + ICON('key') + p + '</span>').join('') + '</div>' +
    '<div class="team-actions">' +
      '<button class="btn s" onclick="openManager(\'' + m.id + '\')">' + ICON('pen') + 'Modifier</button>' +
      '<button class="btn s" onclick="revokeSessions(\'' + m.id + '\')">' + ICON('right-from-bracket') + 'Sessions</button>' +
      '<button class="btn s ' + (suspended ? 'p' : 'danger') + '" onclick="toggleManager(\'' + m.id + '\')">' + ICON(suspended ? 'unlock' : 'user-lock') + (suspended ? 'Réactiver' : 'Suspendre') + '</button>' +
    '</div></article>';
}

function viewTeam() {
  const site = S.teamSite || 'all', role = S.teamRole || 'all', q = (S.teamQ || '').toLowerCase();
  const list = MANAGERS.filter(m =>
    (site === 'all' || m.salle === site) &&
    (role === 'all' || m.role === role) &&
    ((m.nom + ' ' + m.mail + ' ' + m.id).toLowerCase().includes(q))
  );
  const act = MANAGERS.filter(m => m.statut === 'actif');
  const twofa = act.filter(m => m.twofa).length;
  const suspended = MANAGERS.length - act.length;
  const coverage = act.length ? Math.round(twofa / act.length * 100) : 100;

  const siteChips = [{ id: 'all', nom: 'Tout le réseau' }].concat(SALLES).map(s =>
    '<button class="chip' + (site === s.id ? ' on' : '') + '" onclick="S.teamSite=\'' + s.id + '\';render()">' +
      (s.id === 'all' ? ICON('layer-group') + ' ' : '<span class="site-dot" style="background:' + s.color + '"></span>') + esc(s.nom) +
      '<span>' + (s.id === 'all' ? MANAGERS.length : MANAGERS.filter(m => m.salle === s.id).length) + '</span></button>').join('');

  const roleOpts = '<option value="all">Tous les rôles</option>' + ROLES.map(r => '<option value="' + r.id + '"' + (role === r.id ? ' selected' : '') + '>' + r.n + '</option>').join('');

  const cards = list.length ? list.map(managerCard).join('') :
    emptyState('user-shield', 'Aucun compte trouvé', 'Modifiez le filtre ou créez un nouveau gérant.');

  const audit = (S.journal || []).slice(0, 5);

  return head('Équipe & accès', 'Le PDG gère les gérants et les accès de chaque salle. Les actions de sécurité sont simulées, sans authentification réelle.',
    '<button class="btn s" onclick="go({view:\'net\'})">' + ICON('chart-pie') + 'Vue direction</button><button class="btn p s" onclick="openManager()">' + ICON('user-plus') + 'Ajouter un gérant</button>') +
    '<section class="dir-banner team-banner">' +
      '<div class="dir-avatar" aria-hidden="true">DG<span class="dir-ring"></span></div>' +
      '<div class="dir-copy"><span class="dir-kicker">' + ICON('lock') + 'Accès réservé · Direction générale</span>' +
        '<h2 class="serif">Les bonnes personnes, au bon niveau.</h2>' +
        '<p>Un compte par collaborateur, un rôle par métier, une salle par défaut. Vous pouvez suspendre un accès ou révoquer ses sessions à tout moment.</p></div>' +
      '<div class="dir-actions"><button class="btn p" onclick="lockAllSessions()">' + ICON('right-from-bracket') + 'Révoquer toutes les sessions</button></div>' +
    '</section>' +
    '<div class="grid g4">' +
      kpi('Comptes gérés', MANAGERS.length, '<span class="mut">' + act.length + ' actifs · ' + suspended + ' suspendus</span>') +
      kpi('Couverture 2FA', coverage + ' %', '<span class="' + (coverage >= 80 ? 'up' : 'warn-t') + '">' + ICON('shield-halved') + ' ' + twofa + ' comptes protégés</span>') +
      kpi('Gérants de salle', MANAGERS.filter(m => m.role === 'gerant').length, '<span class="mut">un par établissement</span>') +
      kpi('Sessions ouvertes', MANAGERS.reduce((a, m) => a + (m.sessions || 0), 0), '<span class="mut">révocables immédiatement</span>') +
    '</div>' +
    '<div class="card table-card"><div class="table-tools team-tools"><div class="chips">' + siteChips + '</div>' +
      '<div class="team-filters"><select onchange="S.teamRole=this.value;render()" aria-label="Filtrer par rôle">' + roleOpts + '</select>' +
      '<div class="search team-search"><span class="search-ic">' + ICON('magnifying-glass') + '</span><input type="search" value="' + esc(S.teamQ || '') + '" placeholder="Nom, e-mail, identifiant…" aria-label="Rechercher un collaborateur" oninput="S.teamQ=this.value;render()"></div></div></div>' +
      '<div class="team-grid">' + cards + '</div></div>' +
    '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><h3>Sécurité & bonnes pratiques</h3><span class="badge b-off">simulation</span></div>' +
        '<ul class="checklist">' +
        ['Double authentification exigée pour les gérants', 'Rôles limités au strict nécessaire (moindre privilège)', 'Suspension immédiate en cas de départ', 'Révocation des sessions à distance', 'Journal d’audit des actions sensibles'].map(x => '<li>' + ICON('circle-check') + x + '</li>').join('') +
        '</ul><p class="tiny mut" style="margin-top:10px">' + ICON('circle-info') + ' Démonstration : aucun mot de passe, aucune 2FA et aucune session réelle ne sont créés.</p></div>' +
      '<div class="card"><div class="chart-h"><h3>Journal d’accès récent</h3><span class="badge b-off">local</span></div>' +
        (audit.length ? audit.map(j => '<div class="act"><span class="act-ic">' + ICON('shield-halved') + '</span><span><b>' + esc(j.t) + '</b><small>' + esc(j.d) + '</small></span></div>').join('') : '<p class="tiny mut">Aucune action de sécurité dans cette session. Ajoutez un compte ou suspendez un accès pour alimenter le journal.</p>') +
        '<button class="btn s w" style="margin-top:12px" onclick="openSecurityNote()">' + ICON('file-shield') + 'Politique d’accès (démo)</button></div>' +
    '</div>';
}

function openManager(id) {
  const m = id ? findManager(id) : null;
  const siteOpts = SALLES.map(s => '<option value="' + s.id + '"' + (m && m.salle === s.id ? ' selected' : '') + '>' + esc(s.nom) + '</option>').join('');
  const roleOpts = ROLES.map(r => '<option value="' + r.id + '"' + (m && m.role === r.id ? ' selected' : '') + '>' + r.n + ' — ' + r.d + '</option>').join('');
  openModal('<h3>' + (m ? 'Modifier le compte' : 'Nouveau compte gérant') + '</h3>' +
    '<p class="tiny mut">' + (m ? esc(m.nom) + ' · ' + m.id : 'Créez un accès fictif pour un collaborateur du réseau.') + '</p>' +
    '<div class="f"><label>Nom complet<input id="mn" value="' + esc(m ? m.nom : '') + '" placeholder="Prénom Nom" autocomplete="off"></label>' +
    '<label>E-mail professionnel<input id="mm" type="email" value="' + esc(m ? m.mail : '') + '" placeholder="prenom.nom@jumeaux.demo" autocomplete="off"></label>' +
    '<label>Téléphone fictif<input id="mt" value="' + esc(m ? m.tel : '') + '" placeholder="77 000 00 00" autocomplete="off"></label>' +
    '<label>Salle de rattachement<select id="ms">' + siteOpts + '</select></label>' +
    '<label>Rôle et permissions<select id="mr">' + roleOpts + '</select></label>' +
    '<label class="check-line"><input type="checkbox" id="m2fa"' + (!m || m.twofa ? ' checked' : '') + '> Exiger la double authentification (simulée)</label></div>' +
    '<div class="callout">' + ICON('circle-info') + ' Aucun mot de passe réel n’est créé. Ce compte sert uniquement à montrer la gestion des accès par la direction.</div>' +
    '<div class="row gap8" style="margin-top:14px"><button class="btn p" onclick="saveManager(' + (m ? "'" + m.id + "'" : 'null') + ')">' + ICON('check') + 'Enregistrer</button>' +
    '<button class="btn" onclick="closeModal()">Annuler</button></div>', { title: m ? 'Compte de ' + m.nom : 'Nouveau gérant' });
}

function saveManager(id) {
  const nom = ($('mn').value || '').trim();
  const mail = ($('mm').value || '').trim();
  if (!nom || !mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return toast('Renseignez un nom et un e-mail valides', 'ko');
  const clash = MANAGERS.find(x => x.mail.toLowerCase() === mail.toLowerCase() && x.id !== id);
  if (clash) return toast('Cet e-mail est déjà utilisé par ' + clash.nom, 'ko');
  const vals = {
    nom, mail,
    tel: ($('mt').value || '').trim() || '77 000 00 00',
    salle: $('ms').value,
    role: $('mr').value,
    twofa: $('m2fa').checked
  };
  if (id) {
    const m = findManager(id);
    Object.assign(m, vals);
    journal('Compte modifié', m.nom + ' · ' + ROLE_META[m.role].n + ' · ' + siteName(m.salle));
    toast('Compte mis à jour (simulation)', 'ok');
  } else {
    const n = MANAGERS.reduce((a, x) => Math.max(a, +x.id.split('-')[1] || 0), 0) + 1;
    MANAGERS.push(Object.assign({ id: 'USR-' + String(n).padStart(3, '0'), statut: 'actif', dernier: AUJ, cree: AUJ, sessions: 0 }, vals));
    journal('Nouveau compte créé', nom + ' · ' + ROLE_META[vals.role].n + ' · ' + siteName(vals.salle));
    toast('Compte gérant créé (simulation)', 'ok');
  }
  closeModal(); render();
}

function toggleManager(id) {
  const m = findManager(id);
  if (!m) return;
  m.statut = m.statut === 'actif' ? 'suspendu' : 'actif';
  if (m.statut === 'suspendu') m.sessions = 0;
  journal(m.statut === 'actif' ? 'Accès réactivé' : 'Accès suspendu', m.nom + ' · ' + siteName(m.salle) + ' · sessions ' + (m.statut === 'actif' ? 'à recréer' : 'révoquées'));
  render();
  toast(m.statut === 'actif' ? 'Accès réactivé (simulation)' : 'Accès suspendu et sessions révoquées', m.statut === 'actif' ? 'ok' : 'ko');
}

function revokeSessions(id) {
  const m = findManager(id);
  if (!m) return;
  m.sessions = 0;
  journal('Sessions révoquées', m.nom + ' · ' + siteName(m.salle));
  render();
  toast('Sessions de ' + m.nom.split(' ')[0] + ' révoquées (simulation)', 'ok');
}

function lockAllSessions() {
  MANAGERS.forEach(m => { m.sessions = 0; });
  journal('Verrouillage réseau', 'Toutes les sessions de démonstration ont été révoquées.');
  render();
  toast('Toutes les sessions ont été révoquées (simulation)', 'ok');
}

function openSecurityNote() {
  openModal('<h3>Politique d’accès — démonstration</h3>' +
    '<ul class="checklist">' +
    ['Un compte nominatif par collaborateur', 'Le rôle détermine les écrans accessibles', '2FA obligatoire pour les gérants', 'Suspension immédiate au départ', 'Sessions révocables par la direction', 'Journal d’audit conservé localement'].map(x => '<li>' + ICON('shield-halved') + x + '</li>').join('') +
    '</ul><div class="callout">' + ICON('triangle-exclamation') + ' Cette politique est illustrée dans la démonstration. Aucun contrôle d’accès réel n’est appliqué : il n’y a ni serveur, ni mot de passe, ni jeton.</div>' +
    '<button class="btn p w" style="margin-top:14px" onclick="closeModal()">J’ai compris</button>', { title: 'Sécurité & accès' });
}

// ---------------------------------------------------------------- RAPPORTS
function viewRap() {
  const rev12 = addv('rev').reduce((a, v) => a + v, 0);
  const rows = MOIS.map((m, i) => {
    const rev = addv('rev')[i], adh = addv('adh')[i];
    return '<tr><td data-l="Mois"><b>' + m.charAt(0).toUpperCase() + m.slice(1) + '</b></td><td data-l="Revenus">' + fmt(rev) + '</td><td data-l="Adhérents">' + adh + '</td><td data-l="Panier moyen">' + fmt(Math.round(rev / adh)) + '</td><td data-l="Tendance"><span class="tspark">' + spark([rev * .9, rev * .94, rev]) + '</span></td></tr>';
  }).join('');
  return head('Rapports', 'Des chiffres exportables, générés localement. Aucun serveur, aucun tableur à reconstruire.',
    '<button class="btn s" onclick="window.print()">' + ICON('print') + 'Imprimer</button><button class="btn p s" onclick="exportCSV(\'membres\')">' + ICON('file-csv') + 'Exporter les adhérents</button>') +
    '<div class="grid g4">' + kpi('Revenus 12 mois', (rev12 / 1e6).toFixed(1).replace('.', ',') + ' M', '<span class="up">FCFA cumulés</span>') +
      kpi('Croissance annuelle', '+' + Math.round((addv('rev')[11] / addv('rev')[0] - 1) * 100) + ' %', '<span class="mut">revenus vs N-1</span>') +
      kpi('Adhérents aujourd’hui', net.act, '<span class="mut">' + net.tot + ' fiches au total</span>') +
      kpi('Taux de rétention', net.taux + ' %', '<span class="up">' + ICON('heart-pulse') + ' réseau consolidé</span>') + '</div>' +
    '<div class="card"><div class="chart-h"><div><h3>Synthèse mensuelle du réseau</h3><p class="tiny mut">12 derniers mois · valeurs fictives</p></div><span class="badge b-off">CSV disponible</span></div>' +
      '<div class="table-scroll"><table><thead><tr><th>Mois</th><th>Revenus</th><th>Adhérents</th><th>Panier moyen</th><th>Tendance</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
    '<div class="grid g2"><div class="card"><h3>Exports disponibles</h3><p class="mut tiny">Générés dans votre navigateur au format CSV (séparateur point-virgule, compatible Excel).</p>' +
      '<div class="export-list">' +
      '<button onclick="exportCSV(\'membres\')">' + ICON('users') + '<span><b>Adhérents</b><small>' + net.tot + ' fiches · statut, formule, salle</small></span>' + ICON('download') + '</button>' +
      '<button onclick="exportCSV(\'paiements\')">' + ICON('money-bill-wave') + '<span><b>Paiements</b><small>' + SALLES.reduce((a, s) => a + D[s.id].pay.length, 0) + ' opérations · reçus et moyens</small></span>' + ICON('download') + '</button>' +
      '<button onclick="exportCSV(\'presences\')">' + ICON('qrcode') + '<span><b>Présences</b><small>' + SALLES.reduce((a, s) => a + D[s.id].pre.length, 0) + ' passages · aujourd’hui</small></span>' + ICON('download') + '</button>' +
      '</div></div>' +
      '<div class="card"><h3>Ce que la version connectée ajoutera</h3><ul class="checklist">' +
      ['Actualisation automatique des indicateurs', 'Envoi de reçus par SMS ou e-mail', 'Clôture de caisse journalière', 'Rôles et permissions par salle', 'Sauvegarde chiffrée et journal d’audit'].map(x => '<li>' + ICON('circle-check') + x + '</li>').join('') +
      '</ul><p class="tiny mut">' + ICON('circle-info') + ' Le prototype actuel ne stocke rien : un rechargement réinitialise les données.</p></div></div>';
}

// ---------------------------------------------------------------- EXPANSION
function viewExp() {
  return head('Préparer l’expansion', 'Le réseau peut accueillir une nouvelle salle sans reconstruire ses outils. Ajustez les hypothèses pour voir l’impact.',
    '<button class="btn s" onclick="go({view:\'etab\'})">' + ICON('location-dot') + 'Voir les salles</button>') +
    '<div class="grid g4">' + kpi('Salles aujourd’hui', '4', '<span class="mut">Keur Massar → Parcelles</span>') +
      kpi('Adhérents réseau', net.act, '<span class="up">' + ICON('arrow-trend-up') + ' prêt à croître</span>') +
      kpi('Revenus mensuels', fmt(net.rev), '<span class="mut">cumul des 4 salles</span>') +
      kpi('Panier moyen', fmt(PRIX_PANIER), '<span class="mut">par adhérent actif</span>') + '</div>' +
    '<div class="grid g2"><div class="card"><div class="chart-h"><div><h3>Simuler une 5ᵉ salle</h3><p class="tiny mut">Hypothèses modifiables — projection instantanée.</p></div><span class="badge b-off">simulation</span></div>' +
      '<div class="exp-form">' +
      '<label>Nom de la nouvelle salle<input id="exName" value="Rufisque" maxlength="28" oninput="simExp()"></label>' +
      '<label>Adhérents visés <output id="exMOut">60</output><input id="exM" type="range" min="30" max="140" step="5" value="60" oninput="simExp()"></label>' +
      '<label>Panier moyen mensuel <output id="exPOut">' + fmt(PRIX_PANIER) + '</output><input id="exP" type="range" min="10000" max="25000" step="500" value="' + PRIX_PANIER + '" oninput="simExp()"></label>' +
      '<label>Charges mensuelles <output id="exCOut">650 000 FCFA</output><input id="exC" type="range" min="300000" max="1500000" step="50000" value="650000" oninput="simExp()"></label>' +
      '<label>Investissement initial <output id="exIOut">4 000 000 FCFA</output><input id="exI" type="range" min="1000000" max="12000000" step="500000" value="4000000" oninput="simExp()"></label>' +
      '</div></div>' +
      '<div class="card exp-result" id="expResult"></div></div>' +
    '<div class="card"><div class="chart-h"><h3>Feuille de route proposée</h3><span class="badge b-warn">à cadrer ensemble</span></div><div class="roadmap">' +
      [['1', 'Cadrage', 'Rôles, tarifs et règles multi-salles validés avec la direction.', '2 semaines'],
       ['2', 'Pilote', 'Une salle pilote, données réelles, formation de l’équipe.', '4 semaines'],
       ['3', 'Déploiement', 'Les 4 salles connectées, migration accompagnée.', '3 semaines'],
       ['4', 'Expansion', 'La 5ᵉ salle ouvre avec les mêmes outils dès le premier jour.', 'en continu']].map((r, i) =>
        '<div class="road-step"><span class="road-n">' + r[0] + '</span><div><b>' + r[1] + '</b><p class="mut">' + r[2] + '</p></div><span class="road-t">' + r[3] + '</span></div>').join('') +
      '</div></div>';
}

function simExp() {
  const membres = +$('exM').value, panier = +$('exP').value, charges = +$('exC').value, inv = +$('exI').value;
  $('exMOut').textContent = membres;
  $('exPOut').textContent = fmt(panier);
  $('exCOut').textContent = fmt(charges);
  $('exIOut').textContent = fmt(inv);
  const p = projection({ membres, panier, charges, investissement: inv });
  $('expResult').innerHTML = '<div class="chart-h"><div><h3>Impact de ' + esc($('exName').value || 'la nouvelle salle') + '</h3><p class="tiny mut">Mois de croisière, hors saisonnalité.</p></div><span class="badge ' + (p.marge > 0 ? 'b-ok' : 'b-ko') + '">' + (p.marge > 0 ? 'rentable' : 'à ajuster') + '</span></div>' +
    '<div class="exp-big"><small>Marge mensuelle</small><b>' + fmt(p.marge) + '</b><span class="mut">CA ' + fmt(p.ca) + ' − charges ' + fmt(charges) + '</span></div>' +
    '<div class="exp-grid"><div><small>Seuil de rentabilité</small><b>' + p.seuil + ' <em>adhérents</em></b></div><div><small>Retour sur investissement</small><b>' + (p.retour ? p.retour + ' <em>mois</em>' : '—') + '</b></div><div><small>Réseau après ouverture</small><b>' + p.nouveaux + ' <em>adhérents</em></b></div><div><small>CA annualisé</small><b>' + (p.caNet / 1e6).toFixed(1).replace('.', ',') + ' <em>M FCFA</em></b></div></div>' +
    '<div class="progress lg"><i style="width:' + Math.min(100, Math.round(p.membres / Math.max(1, p.seuil) * 100)) + '%"></i></div><p class="tiny mut">' + (p.membres >= p.seuil ? 'Hypothèse au-dessus du seuil de rentabilité.' : 'Il manque ' + (p.seuil - p.membres) + ' adhérents pour atteindre le seuil.') + '</p>' +
    '<button class="btn p w" onclick="toast(\'Projection enregistrée pour la présentation (simulation)\',\'ok\')">Retenir cette projection</button>';
}

// ---------------------------------------------------------------- PARAMÈTRES
function openShortcuts() {
  openModal('<h3>Raccourcis</h3><ul class="checklist">' +
    '<li>→ / ← : étape suivante ou précédente en présentation</li>' +
    '<li>Échap : fermer une fenêtre ou quitter la présentation</li>' +
    '<li>/ : rechercher un adhérent depuis le back-office</li>' +
    '<li>Entrée : valider le champ actif</li></ul>' +
    '<p class="tiny mut">Le mode plein écran est disponible dans la barre de présentation.</p>' +
    '<button class="btn w" style="margin-top:12px" onclick="closeModal()">Fermer</button>', { title: 'Raccourcis' });
}

function viewSet() {
  return head('Paramètres', 'Une démonstration sans compte ni serveur. Tous les réglages restent sur cet appareil.',
    '<span class="badge b-ok">' + ICON('shield-halved') + ' 100 % local</span>') +
    '<div class="grid g2"><div class="card"><h3>Apparence</h3><p class="mut tiny">Le thème est mémorisé dans le navigateur.</p>' +
      '<div class="theme-choice"><button class="' + (!S.dark ? 'on' : '') + '" onclick="if(S.dark)toggleTheme()"><span class="tc light"></span>Clair</button><button class="' + (S.dark ? 'on' : '') + '" onclick="if(!S.dark)toggleTheme()"><span class="tc dark"></span>Sombre</button></div>' +
      '<div class="row gap8" style="margin-top:14px"><button class="btn s" onclick="S.col=!S.col;render()">' + ICON('bars') + (S.col ? 'Menu complet' : 'Menu compact') + '</button><button class="btn s" onclick="toggleTheme()">' + ICON('circle-half-stroke') + 'Basculer</button></div></div>' +
      '<div class="card"><h3>Mode présentation</h3><p class="mut tiny">Un parcours guidé de 12 étapes, piloté au clavier. Idéal devant un client.</p>' +
      '<div class="row gap8"><button class="btn p" onclick="startPres()">' + ICON('play') + 'Lancer</button><button class="btn" onclick="openShortcuts()">' + ICON('keyboard') + 'Raccourcis</button></div></div>' +
    '</div>' +
    '<div class="grid g2"><div class="card"><h3>Données de démonstration</h3><p class="mut tiny">Aucune donnée n’est envoyée ni conservée après rechargement. Les créations et corrections sont uniquement en mémoire.</p>' +
      '<div class="data-facts"><span><b>' + net.tot + '</b>adhérents fictifs</span><span><b>4</b>salles</span><span><b>' + SALLES.reduce((a, s) => a + D[s.id].pay.length, 0) + '</b>paiements</span><span><b>0</b>appel serveur</span></div>' +
      '<button class="btn s" style="margin-top:14px" onclick="resetDemo()">' + ICON('rotate-left') + 'Réinitialiser la démonstration</button></div>' +
      '<div class="card"><h3>À propos du prototype</h3><p class="mut tiny">Démonstration commerciale statique, conçue pour être publiée sur GitHub Pages.</p>' +
      '<div class="tech"><span>HTML5</span><span>CSS3</span><span>JavaScript ES6+</span><span>Sans framework</span><span>Sans backend</span><span>QR généré localement</span></div>' +
      '<p class="tiny mut" style="margin-top:12px">Les montants, personnes et établissements sont fictifs. Aucun paiement réel, aucune authentification réelle.</p></div></div>';
}

// ---------------------------------------------------------------- TABLE ADHÉRENTS
const memb = id => findMembre(id);

function drawTable() {
  const t = $('tbl');
  if (!t) return;
  const d = D[S.salle];
  let list = d.mem.filter(m =>
    (S.filter === 'tous' || statut(m) === S.filter) &&
    ((m.nom + ' ' + m.id + ' ' + m.tel + ' ' + m.mail).toLowerCase().includes((S.q || '').toLowerCase()))
  );
  list = list.slice().sort((a, b) => {
    if (S.sort === 'nom') return a.nom.localeCompare(b.nom, 'fr');
    if (S.sort === 'exp') return a.exp - b.exp;
    if (S.sort === 'plan') return a.plan - b.plan;
    return a.id.localeCompare(b.id);
  });
  const pg = 8, np = Math.max(1, Math.ceil(list.length / pg));
  S.page = Math.min(S.page, np - 1);
  const rows = list.slice(S.page * pg, S.page * pg + pg).map(m =>
    '<tr><td data-l="Identifiant"><b class="mono">' + m.id + '</b><small class="mut">' + (m.multi ? 'multi-salles' : 'salle unique') + '</small></td>' +
    '<td data-l="Adhérent"><div class="cell-user">' + avatar(m.nom) + '<span><b>' + esc(m.nom) + '</b><small>' + esc(m.mail || 'Sans e-mail') + '</small></span></div></td>' +
    '<td data-l="Téléphone">' + (m.tel ? esc(m.tel) : '<span class="t-ko">Non renseigné</span>') + '</td>' +
    '<td data-l="Formule"><span class="plan-dot" style="background:' + PLANS[m.plan].c + '"></span>' + PLANS[m.plan].n + '</td>' +
    '<td data-l="Expiration">' + dstr(m.exp) + '<small class="mut">' + (joursRestants(m) >= 0 ? 'dans ' + joursRestants(m) + ' j' : 'il y a ' + Math.abs(joursRestants(m)) + ' j') + '</small></td>' +
    '<td data-l="Statut">' + bdg(statut(m)) + '</td>' +
    '<td><div class="row gap6 no-wrap"><button class="btn s" onclick="fiche(\'' + m.id + '\')">Fiche</button><button class="btn s icon" aria-label="QR de ' + esc(m.nom) + '" onclick="showQr(\'' + m.id + '\')">' + ICON('qrcode') + '</button></div></td></tr>'
  ).join('');
  const th = (key, label) => '<th scope="col"><button class="th-sort' + (S.sort === key ? ' on' : '') + '" onclick="S.sort=\'' + key + '\';drawTable()">' + label + (S.sort === key ? ' ' + ICON('arrow-down-short-wide') : '') + '</button></th>';
  t.innerHTML = (rows ?
    '<div class="table-scroll"><table><thead><tr>' + th('id', 'Identifiant') + th('nom', 'Adhérent') + '<th scope="col">Téléphone</th>' + th('plan', 'Formule') + th('exp', 'Expiration') + '<th scope="col">Statut</th><th scope="col"><span class="sr">Actions</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>' :
    emptyState('user-slash', 'Aucun adhérent trouvé', 'Modifiez la recherche ou le filtre.')) +
    '<div class="pager"><span class="mut tiny"><b>' + list.length + '</b> résultat(s) · page ' + (S.page + 1) + ' / ' + np + '</span>' +
    '<div class="row gap6"><button class="btn s" aria-label="Page précédente" ' + (S.page === 0 ? 'disabled' : '') + ' onclick="S.page=Math.max(0,S.page-1);drawTable()">' + ICON('chevron-left') + '</button>' +
    '<span class="page-dots">' + Array.from({ length: np }, (_, i) => '<i class="' + (i === S.page ? 'on' : '') + '"></i>').join('') + '</span>' +
    '<button class="btn s" aria-label="Page suivante" ' + (S.page >= np - 1 ? 'disabled' : '') + ' onclick="S.page=Math.min(' + (np - 1) + ',S.page+1);drawTable()">' + ICON('chevron-right') + '</button></div></div>';
}

// ---------------------------------------------------------------- ACTIONS QUALITÉ
function fixTel() {
  const d = D[S.salle];
  d.mem.forEach((m, i) => { if (!m.tel) m.tel = '77 ' + String(100 + i).slice(0, 3) + ' ' + String(10 + i % 89).padStart(2, '0') + ' ' + String(10 + (i * 3) % 89).padStart(2, '0'); });
  journal('Fiches téléphone complétées', 'Numéros fictifs générés pour la démonstration.');
  toast('Fiches complétées (simulation)', 'ok'); render();
}
function fixMail() {
  const d = D[S.salle];
  d.mem.forEach(m => { if (!m.mail) m.mail = slug(m.nom) + '@demo.local'; });
  journal('E-mails complétés', 'Adresses fictives générées pour les reçus.');
  toast('E-mails ajoutés (simulation)', 'ok'); render();
}
function fixPay() {
  const d = D[S.salle];
  let n = 0;
  d.pay.forEach(p => { if (p.st === 'en attente') { p.st = 'confirmé'; n++; } });
  journal('Paiements confirmés', n + ' opération(s) marquée(s) comme vérifiée(s).');
  toast(n + ' paiement(s) confirmé(s) (simulation)', 'ok'); render();
}
function fixDup() {
  const d = D[S.salle];
  d.mem.forEach(m => { m.reviewed = true; });
  journal('Doublons vérifiés', 'Les fiches ont été marquées comme contrôlées.');
  toast('Doublons marqués comme vérifiés (simulation)', 'ok'); render();
}
function journal(t, d) {
  S.journal = S.journal || [];
  S.journal.unshift({ t, d: d + ' · ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) });
}

function resetDemo() {
  try { localStorage.removeItem('jfos-theme'); } catch (e) {}
  location.hash = '';
  location.reload();
}
