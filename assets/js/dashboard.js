// ============================================================================
// Application : direction, établissements, back-office, rapports, expansion
// ============================================================================

const MENU = [
  { g: 'Direction', items: [['net', 'chart-pie', 'Vue générale'], ['fin', 'scale-balanced', 'Finance & comptabilité'], ['tarifs', 'tags', 'Tarifs & promotion'], ['team', 'user-shield', 'Équipe & accès'], ['etab', 'location-dot', 'Établissements'], ['exp', 'rocket', 'Expansion']] },
  { g: 'Opérations', items: [['mem', 'users', 'Adhérents'], ['abo', 'arrows-rotate', 'Abonnements'], ['pay', 'money-bill-wave', 'Paiements'], ['pre', 'qrcode', 'Contrôles d’accès'], ['qual', 'shield-halved', 'Qualité des données']] },
  { g: 'Analyse', items: [['perf', 'ranking-star', 'Performance des salles'], ['rap', 'file-lines', 'Rapports'], ['set', 'gear', 'Paramètres']] }
];
const TAB_LABEL = { dash: 'Tableau de bord', mem: 'Adhérents', abo: 'Abonnements', pay: 'Paiements', pre: 'Contrôles d’accès', qual: 'Qualité des données' };

function navBadge(k) {
  if (k === 'qual') { const n = anomaliesNet().total; return n ? '<span class="nav-badge">' + n + '</span>' : ''; }
  if (k === 'abo') { const n = net.soon + net.exp; return n ? '<span class="nav-badge">' + n + '</span>' : ''; }
  if (k === 'fin') { const n = net.declares + net.attente; return n ? '<span class="nav-badge">' + Math.round(n / 1000) + 'k</span>' : ''; }
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
    : '<b>' + ({ net: 'Vue générale', fin: 'Finance & comptabilité', tarifs: 'Tarifs & promotion', perf: 'Performance des salles', team: 'Équipe & accès', etab: 'Établissements', exp: 'Expansion', rap: 'Rapports', set: 'Paramètres' }[S.view] || 'Réseau') + '</b>';

  return '<div class="app' + (S.col ? ' col' : '') + '">' +
    '<aside class="side" aria-label="Navigation de l’application">' +
      '<div class="side-top">' +
        '<a class="brand" href="#" onclick="go({view:\'land\'});return false;" aria-label="Retour à l’accueil">' + logoChip() + '</a>' +
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
        '<a class="brand top-brand" href="#" onclick="go({view:\'land\'});return false;" aria-label="Jumeaux Fitness OS, accueil">' + logoChip('sm mark-only') + '</a>' +
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
  if (['net', 'fin', 'tarifs', 'perf', 'team', 'etab', 'exp', 'rap', 'set'].includes(k)) go({ view: k });
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
function forecastNet() {
  return [0, 1, 2].map(i => SALLES.reduce((a, s) => {
    const f = forecast(s.id)[i];
    a.ca += f.ca; a.chg += f.chg; a.profit += f.profit;
    return a;
  }, { mois: i + 1, ca: 0, chg: 0, profit: 0 }));
}

function latePayments() {
  const rows = [];
  ALL.forEach(id => {
    D[id].pay.forEach(p => {
      if ((p.st === 'déclaré' || p.st === 'en attente') && +new Date(p.date) < +AUJ - 7 * J) {
        rows.push({ ...p, salle: id });
      }
    });
  });
  return rows.sort((a, b) => a.date - b.date);
}

function expiringMembers() {
  const rows = [];
  ALL.forEach(id => D[id].mem.forEach(m => {
    const st = statut(m);
    if (st === 'bientôt' || st === 'expiré') rows.push(m);
  }));
  return rows.sort((a, b) => a.exp - b.exp);
}

function viewNet() {
  const k = net;
  const revLeader = SALLES.slice().sort((a, b) => kp(b.id).rev - kp(a.id).rev)[0];
  const actLeader = SALLES.slice().sort((a, b) => kp(b.id).act - kp(a.id).act)[0];
  const revL = kp(revLeader.id), actL = kp(actLeader.id);
  const plans = PLANS.map((p, i) => ({ label: p.n, value: SALLES.reduce((a, s) => a + D[s.id].mem.filter(m => m.plan === i).length, 0), color: p.c }));
  const fc = forecastNet();
  const late = latePayments();
  const exp = expiringMembers();
  const rows = SALLES.map(s => {
    const x = kp(s.id);
    return '<tr class="c" onclick="go({view:\'salle\',salle:\'' + s.id + '\',tab:\'dash\'})">' +
      '<td data-l="Établissement"><span class="site-dot" style="background:' + s.color + '"></span><b>' + esc(s.nom) + '</b><small class="mut">' + esc(s.resp) + '</small></td>' +
      '<td data-l="Actifs">' + x.act + ' <small class="mut">/ ' + x.tot + '</small><span class="cell-bar"><i style="width:' + x.taux + '%"></i></span></td>' +
      '<td data-l="CA du mois">' + fmt(x.rev) + '</td>' +
      '<td data-l="Charges">' + fmt(x.chg) + '</td>' +
      '<td data-l="Résultat">' + fmt(x.profit) + '<small class="' + (x.marge >= 0 ? 't-ok' : 't-ko') + '">' + x.marge + ' %</small></td>' +
      '<td data-l="Impayés">' + (x.impayes ? '<span class="t-ko">' + fmt(x.impayes) + '</span>' : '<span class="t-ok">0</span>') + '</td>' +
      '<td data-l="Renouvellements">' + x.renouv + '</td>' +
      '<td data-l="Nouveaux">' + x.nouv + '</td>' +
      '<td data-l="Présences">' + x.pres + '</td>' +
      '<td data-l="Évolution"><span class="' + (x.evo >= 0 ? 'up' : 'down') + '">' + (x.evo >= 0 ? '+' : '') + String(x.evo).replace('.', ',') + ' %</span></td>' +
      '<td data-l="Ouvrir"><span class="rowlink">Ouvrir ' + ICON('arrow-right') + '</span></td></tr>';
  }).join('');

  return head('Vue générale du réseau',
    'Tout le réseau sur un seul écran : revenus, charges, résultat, impayés et objectifs. <span class="pill inline"><span class="dot"></span>Simulation</span>',
    '<button class="btn s" onclick="go({view:\'fin\'})">' + ICON('scale-balanced') + 'Comptabilité</button><button class="btn p s" onclick="startPres()">' + ICON('play') + 'Visite guidée</button>') +
    '<section class="dir-banner">' +
      '<div class="dir-avatar" aria-hidden="true">DG<span class="dir-ring"></span></div>' +
      '<div class="dir-copy"><span class="dir-kicker">' + ICON('crown') + 'Espace direction · PDG</span>' +
        '<h2 class="serif">Pilotez le réseau, pas des fichiers.</h2>' +
        '<p>Le consolidé financier, les abonnements à risque et la performance des quatre salles sont visibles ici. Chaque chiffre est une hypothèse de démonstration, à confronter aux vrais chiffres Jumeaux Fitness.</p></div>' +
      '<div class="dir-facts">' +
        '<span><b>' + k.act + '</b><small>adhérents actifs</small></span>' +
        '<span><b>' + k.marge + ' %</b><small>marge estimée</small></span>' +
        '<span><b>' + SALLES.length + '</b><small>salles supervisées</small></span>' +
      '</div>' +
      '<div class="dir-actions">' +
        '<button class="btn p" onclick="go({view:\'fin\'})">' + ICON('chart-line') + 'Ouvrir la finance</button>' +
        '<button class="btn ghost" onclick="go({view:\'perf\'})">' + ICON('ranking-star') + 'Performance des salles</button>' +
      '</div>' +
    '</section>' +
    '<div class="grid g4">' +
      kpi('CA mensuel', fmt(k.rev), '<span class="' + (addv('rev')[11] >= addv('rev')[10] ? 'up' : 'down') + '">' + ICON('arrow-trend-up') + ' ' + (addv('rev')[11] >= addv('rev')[10] ? '+' : '') + Math.round((addv('rev')[11] / Math.max(1, addv('rev')[10]) - 1) * 100) + ' % vs mois dernier</span>', { spark: spark(addv('rev')) }) +
      kpi('CA annualisé', fmt(k.rev * 12), '<span class="mut">projection sur 12 mois</span>') +
      kpi('Résultat estimé', fmt(k.profit), '<span class="' + (k.marge >= 0 ? 'up' : 'down') + '">' + ICON('percent') + ' marge ' + k.marge + ' %</span>') +
      kpi('Encaissé (30 j)', fmt(k.encaisse), '<span class="' + (k.recouvrement >= 85 ? 'up' : 'warn-t') + '">' + k.recouvrement + ' % de recouvrement</span>') +
    '</div>' +
    '<section class="insight' + (revLeader.id === actLeader.id ? '' : ' insight-duo') + '">' +
      '<span class="insight-ic">' + ICON('lightbulb') + '</span>' +
      '<div class="insight-copy"><span class="eyebrow">Lecture du PDG</span>' +
        (revLeader.id === actLeader.id
          ? '<b>' + esc(revLeader.nom) + ' mène à la fois sur les revenus et sur le nombre d’actifs.</b>'
          : '<b>' + esc(revLeader.nom) + ' génère le plus de revenus (' + fmt(revL.rev) + '), mais ' + esc(actLeader.nom) + ' compte le plus d’adhérents actifs (' + actL.act + ' contre ' + revL.act + ').</b>') +
        '<p>Deux réalités différentes : le panier moyen et la capacité d’encaissement de ' + esc(revLeader.nom) + ' face au volume de ' + esc(actLeader.nom) + '. C’est exactement le type d’écart qu’un fichier Excel partagé ne montre pas.</p></div>' +
      '<div class="insight-facts">' +
        '<span><small>Panier moyen</small><b>' + fmt(revL.panier) + '</b></span>' +
        '<span><small>Actifs</small><b>' + actL.act + '</b></span>' +
        '<span><small>À traiter</small><b>' + (k.soon + k.exp) + '</b></span>' +
      '</div>' +
    '</section>' +
    '<div class="grid g2">' +
      line(addv('rev').map(v => Math.round(v / 1e3)), MOIS, 'Évolution des revenus du réseau', ' k FCFA', { total: fmt(k.rev) }) +
      bars(SALLES.map(s => Math.round(kp(s.id).rev / 1e3)), SALLES.map(s => s.nom), 'Revenus par établissement', ' k FCFA', { total: fmt(k.rev) }) +
    '</div>' +
    '<div class="grid g2">' +
      bars(SALLES.map(s => Math.round(kp(s.id).chg / 1e3)), SALLES.map(s => s.nom), 'Charges par établissement', ' k FCFA', { total: fmt(k.chg) }) +
      bars(SALLES.map(s => Math.round(kp(s.id).profit / 1e3)), SALLES.map(s => s.nom), 'Résultat estimé par établissement', ' k FCFA', { total: fmt(k.profit) }) +
    '</div>' +
    '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><div><h3>Objectifs d’encaissement</h3><p class="tiny mut">Encaissements réalisés sur l’objectif du mois, par salle.</p></div><span class="badge ' + (k.atteinte >= 90 ? 'b-ok' : 'b-warn') + '">' + k.atteinte + ' % réseau</span></div>' +
        SALLES.map(s => { const x = kp(s.id); return '<div class="obj-row"><span class="site-dot" style="background:' + s.color + '"></span><b>' + esc(s.nom) + '</b><div class="progress"><i style="width:' + Math.min(100, x.atteinte) + '%;background:' + s.color + '"></i></div><small>' + fmt(x.encaisse) + ' / ' + fmt(x.objectif) + '</small><span class="badge ' + (x.atteinte >= 100 ? 'b-ok' : x.atteinte >= 80 ? 'b-warn' : 'b-ko') + '">' + x.atteinte + ' %</span></div>'; }).join('') +
        '<p class="tiny mut" style="margin-top:8px">' + ICON('circle-info') + ' Les objectifs sont des hypothèses de démonstration, pas des engagements contractuels.</p></div>' +
      '<div class="card"><div class="chart-h"><div><h3>Prévisions indicatives</h3><p class="tiny mut">Trois mois, à partir de la tendance actuelle.</p></div><span class="badge b-off">scénario</span></div>' +
        '<div class="fc-row">' + fc.map((f, i) => '<div class="fc-month"><small>Mois +' + (i + 1) + '</small><b>' + fmt(f.ca) + '</b><span class="tiny mut">CA</span><em>Résultat ' + fmt(f.profit) + '</em></div>').join('') + '</div>' +
        '<p class="tiny mut" style="margin-top:10px">' + ICON('triangle-exclamation') + ' Projection de simulation, non garantie. À recalibrer avec les charges et saisonnalités réelles.</p></div>' +
    '</div>' +
    '<div class="card table-card"><div class="chart-h"><div><h3>Comparaison complète des établissements</h3><p class="tiny mut">Cliquez une ligne pour ouvrir le back-office.</p></div><span class="badge b-ok">' + SALLES.length + ' salles</span></div>' +
      '<div class="table-scroll"><table><thead><tr><th scope="col">Établissement</th><th scope="col">Actifs</th><th scope="col">CA</th><th scope="col">Charges</th><th scope="col">Résultat</th><th scope="col">Impayés</th><th scope="col">Renouv.</th><th scope="col">Nouveaux</th><th scope="col">Présences</th><th scope="col">Évolution</th><th scope="col"></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="table-foot"><span class="mut tiny">Objectif d’encaissement du réseau : <b>' + fmt(k.objectif) + '</b> · Encaissé : <b>' + fmt(k.encaisse) + '</b></span><span class="badge ' + (k.atteinte >= 90 ? 'b-ok' : 'b-warn') + '">' + k.atteinte + ' % de l’objectif</span></div>' +
    '</div>' +
    '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><div><h3>Impayés & retards</h3><p class="tiny mut">Déclaré = à vérifier · En attente = non réglé.</p></div><span class="badge ' + (late.length ? 'b-ko' : 'b-ok') + '">' + late.length + ' dossier(s)</span></div>' +
        (late.length ? late.slice(0, 5).map(p => '<div class="act"><span class="act-ic warn">' + ICON('clock') + '</span><span><b>' + esc((findMembre(p.m) || {}).nom || p.m) + ' · ' + fmt(p.montant) + '</b><small>' + esc(siteName(p.salle)) + ' · ' + dstr(p.date) + ' · ' + payMeta(p.st).n + '</small></span><button class="btn s" onclick="openReconcile(\'' + p.ref + '\')">Traiter</button></div>').join('') : '<p class="tiny mut">Aucun retard de plus de 7 jours. La caisse est à jour.</p>') +
        '<button class="btn s w" style="margin-top:10px" onclick="go({view:\'fin\',finTab:\'journal\'})">Ouvrir le journal ' + ICON('arrow-right') + '</button></div>' +
      '<div class="card"><div class="chart-h"><div><h3>Échéances sous 7 jours</h3><p class="tiny mut">Relances J-7, J-3 et J-1.</p></div><span class="badge b-warn">' + k.soon + '</span></div>' +
        (exp.length ? exp.slice(0, 5).map(m => '<div class="act"><span class="act-ic warn">' + ICON('user-clock') + '</span><span><b>' + esc(m.nom) + '</b><small>' + esc(siteName(m.home)) + ' · ' + PLANS[m.plan].n + ' · ' + dstr(m.exp) + '</small></span><span class="badge b-warn">' + (renewalAlert(m) || 'expiré') + '</span></div>').join('') : '<p class="tiny mut">Aucune échéance critique.</p>') +
        '<button class="btn s w" style="margin-top:10px" onclick="go({view:\'salle\',salle:\'km\',tab:\'abo\'})">Traiter les abonnements ' + ICON('arrow-right') + '</button></div>' +
    '</div>' +
    '<div class="grid g3">' +
      donut(plans, 'Répartition des formules', k.tot) +
      activity('pa') + liveCard() +
    '</div>' +
    '<p class="tiny mut center">Simulation locale : les montants, charges et prévisions sont fictifs et ne constituent pas des résultats garantis.</p>';
}

// ---------------------------------------------------------------- FINANCE
const FIN_TABS = [['synthese', 'Synthèse', 'chart-pie'], ['journal', 'Journal des encaissements', 'receipt'], ['charges', 'Charges & dépenses', 'file-invoice-dollar'], ['caisse', 'Caisse & rapprochement', 'cash-register'], ['rapports', 'Rapports & exports', 'file-export']];

function finPayRows(site) {
  if (site === 'net') {
    return ALL.flatMap(id => D[id].pay.map(p => Object.assign({}, p, { site: id }))).sort((a, b) => b.date - a.date);
  }
  return D[site].pay.map(p => Object.assign({}, p, { site }));
}

function finDepRows(site) {
  if (site === 'net') {
    return ALL.flatMap(id => D[id].dep.map(x => Object.assign({}, x, { site: id }))).sort((a, b) => b.date - a.date);
  }
  return D[site].dep.map(x => Object.assign({}, x, { site }));
}

function payMix(site) {
  const since = +AUJ - 30 * J, colors = { 'Espèces': '#D9A441', Wave: '#2E75C9', 'Orange Money': '#F97316', 'Carte bancaire': '#8B5CF6' };
  const rows = finPayRows(site).filter(p => p.st === 'confirmé' && +new Date(p.date) >= since);
  return MOYENS.map(m => ({ label: m, value: rows.filter(p => p.moyen === m).reduce((a, p) => a + p.montant, 0), color: colors[m] || '#0E7A4B' })).filter(x => x.value > 0);
}

function chargeSplitNet() {
  const rows = CHARGE_CATS.map(c => {
    const amount = ALL.reduce((a, id) => a + D[id].dep.filter(x => x.catId === c.id).reduce((b, x) => b + x.amount, 0), 0);
    return Object.assign({}, c, { amount });
  }).filter(x => x.amount > 0);
  return {
    rows,
    fixe: rows.filter(x => x.type === 'fixe').reduce((a, x) => a + x.amount, 0),
    variable: rows.filter(x => x.type === 'variable').reduce((a, x) => a + x.amount, 0),
    total: rows.reduce((a, x) => a + x.amount, 0)
  };
}

function finSiteChips() {
  const cur = S.finSite || 'net';
  const sites = S.role === 'compta' ? SALLES.filter(s => s.id === S.rsite) : [{ id: 'net', nom: 'Tout le réseau', color: '#0E7A4B' }].concat(SALLES);
  return sites.map(s =>
    '<button class="chip' + (cur === s.id ? ' on' : '') + '" onclick="go({view:\'fin\',finSite:\'' + s.id + '\',finTab:S.finTab,depFilter:\'tous\'})">' +
      (s.id === 'net' ? ICON('layer-group') : '<span class="site-dot" style="background:' + s.color + '"></span>') + esc(s.nom) +
      '<span>' + (s.id === 'net' ? Math.round(net.rev / 1000) + 'k' : Math.round(kp(s.id).rev / 1000) + 'k') + '</span></button>').join('');
}

function finSummaryKpis(f, site) {
  const isNet = site === 'net';
  return '<div class="grid g4">' +
    kpi('CA du mois', fmt(f.rev), '<span class="up">' + ICON('arrow-trend-up') + ' ' + (isNet ? net.act : kp(site).act) + ' actifs</span>') +
    kpi('Charges du mois', fmt(f.chg), '<span class="mut">fixes + variables</span>') +
    kpi('Résultat estimé', fmt(f.profit), '<span class="' + (f.marge >= 0 ? 'up' : 'down') + '">marge ' + f.marge + ' %</span>') +
    kpi('Encaissé (30 j)', fmt(f.encaisse), '<span class="' + (f.recouvrement >= 85 ? 'up' : 'warn-t') + '">' + f.recouvrement + ' % recouvré</span>') +
    '</div>' +
    '<div class="grid g4">' +
    kpi('Déclaré à vérifier', fmt(f.declares), '<span class="warn-t">' + ICON('clock-rotate-left') + ' paiements déclarés</span>') +
    kpi('En attente', fmt(f.attente), '<span class="warn-t">' + ICON('hourglass-half') + ' non réglés</span>') +
    kpi('Impayés + retards', fmt(f.impayes), '<span class="' + (f.retard ? 'down' : 'up') + '">' + fmt(f.retard) + ' en retard</span>') +
    kpi('Panier moyen', fmt(f.panier || Math.round(f.rev / Math.max(1, isNet ? net.act : kp(site).act))), '<span class="mut">par adhérent actif</span>') +
    '</div>';
}

function finSynth(site) {
  const isNet = site === 'net';
  const f = isNet ? finNet() : finSite(site);
  const split = isNet ? chargeSplitNet() : f.split;
  const mix = payMix(site);
  const series = isNet
    ? { rev: addv('rev'), chg: addv('chg') }
    : { rev: f.site.rev, chg: f.site.chg };
  const fc = isNet ? forecastNet() : f.forecast;
  const splitItems = split.rows.slice(0, 5).map((c, i) => ({ label: c.n, value: c.amount, color: ['#0E7A4B', '#2E75C9', '#D9A441', '#8B5CF6', '#EF4444'][i % 5] }));
  return finSummaryKpis(f, site) +
    '<div class="grid g2">' +
      line(series.rev.map(v => Math.round(v / 1e3)), MOIS, 'Chiffre d’affaires — 12 mois', ' k FCFA', { total: fmt(f.rev) }) +
      line(series.chg.map(v => Math.round(v / 1e3)), MOIS, 'Charges — 12 mois', ' k FCFA', { total: fmt(f.chg) }) +
    '</div>' +
    '<div class="grid g3">' +
      donut(splitItems, 'Répartition des charges', fmtShort(split.total) + ' F') +
      donut(mix, 'Encaissements (30 j)', fmtShort(f.encaisse) + ' F') +
      '<div class="card"><div class="chart-h"><h3>Prévisions indicatives</h3><span class="badge b-off">scénario</span></div>' +
        fc.map((x, i) => '<div class="fin-fc"><span><small>Mois +' + (i + 1) + '</small><b>' + fmt(x.ca) + '</b></span><span class="tiny mut">Charges ' + fmt(x.chg) + '</span><span class="badge ' + (x.profit >= 0 ? 'b-ok' : 'b-ko') + '">' + fmt(x.profit) + '</span></div>').join('') +
        '<p class="tiny mut" style="margin-top:8px">' + ICON('triangle-exclamation') + ' Hypothèses de simulation — aucun gain garanti.</p></div>' +
    '</div>' +
    '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><h3>Objectif & recouvrement</h3><span class="badge ' + (f.atteinte >= 90 ? 'b-ok' : 'b-warn') + '">' + f.atteinte + ' %</span></div>' +
        '<div class="objectif"><b>' + fmt(f.encaisse) + '</b><span class="mut">encaissés sur ' + fmt(f.objectif) + '</span><div class="progress lg"><i style="width:' + Math.min(100, f.atteinte) + '%"></i></div></div>' +
        '<div class="fin-states"><span><i class="st-dot ok"></i><b>' + fmt(f.encaisse) + '</b><small>Confirmé</small></span><span><i class="st-dot info"></i><b>' + fmt(f.declares) + '</b><small>Déclaré</small></span><span><i class="st-dot warn"></i><b>' + fmt(f.attente) + '</b><small>En attente</small></span></div>' +
        '<p class="tiny mut">Un paiement déclaré n’est pas encore encaissé. Il doit être rapproché avant d’être compté comme recette confirmée.</p></div>' +
      '<div class="card"><div class="chart-h"><h3>Dernières opérations</h3><button class="linkbtn" onclick="go({finTab:\'journal\'})">Tout voir</button></div>' +
        finPayRows(site).slice(0, 5).map(p => '<div class="act"><span class="act-ic">' + ICON(MOYENS_ICON[p.moyen] || 'wallet') + '</span><span><b>' + fmt(p.montant) + ' · ' + esc((findMembre(p.m) || {}).nom || p.m) + '</b><small>' + (isNet ? siteName(p.site) + ' · ' : '') + dstr(p.date) + ' · ' + p.moyen + '</small></span>' + bdg(p.st) + '</div>').join('') +
      '</div>' +
    '</div>';
}

function finJournal(site) {
  const st = S.payFilter || 'tous';
  const all = finPayRows(site);
  const list = all.filter(p => st === 'tous' || p.st === st);
  const chips = ['tous', 'confirmé', 'déclaré', 'en attente', 'annulé'].map(x =>
    '<button class="chip' + (st === x ? ' on' : '') + '" onclick="S.payFilter=\'' + x + '\';go({finTab:\'journal\'})">' +
      (x === 'tous' ? 'Toutes' : payMeta(x).n) + '<span>' + (x === 'tous' ? all.length : all.filter(p => p.st === x).length) + '</span></button>').join('');
  const rows = list.slice(0, 60).map(p => {
    const m = findMembre(p.m) || { nom: p.m };
    const actionable = p.st === 'déclaré' || p.st === 'en attente';
    return '<tr><td data-l="Date">' + dstr(p.date) + '<small class="mut">' + hhmm(p.date) + '</small></td>' +
      '<td data-l="Référence"><b class="mono">' + p.ref + '</b><small class="mut">' + esc(p.agent || '') + '</small></td>' +
      '<td data-l="Adhérent">' + avatar(m.nom) + esc(m.nom) + (site === 'net' ? '<small class="mut">' + esc(siteName(p.site)) + '</small>' : '') + '</td>' +
      '<td data-l="Montant"><b>' + fmt(p.montant) + '</b></td>' +
      '<td data-l="Moyen">' + ICON(MOYENS_ICON[p.moyen] || 'wallet') + ' ' + esc(p.moyen) + '</td>' +
      '<td data-l="Statut">' + bdg(p.st) + (actionable ? '<small class="warn-t tiny">à rapprocher</small>' : '') + '</td>' +
      '<td><div class="row gap6 no-wrap">' + (actionable ? '<button class="btn s p" onclick="openReconcile(\'' + p.ref + '\')">Vérifier</button>' : '<button class="btn s" onclick="receiptRef(\'' + p.ref + '\')">Reçu</button>') + '</div></td></tr>';
  }).join('');
  return head('Journal des encaissements', 'Trois états distincts : <b>encaissé</b> (confirmé), <b>déclaré</b> (à vérifier) et <b>en attente</b> (non réglé).',
    '<button class="btn s" onclick="exportFin(\'journal\')">' + ICON('file-excel') + 'Excel</button><button class="btn p s" onclick="newPaymentFin()">' + ICON('plus') + 'Encaisser</button>') +
    '<div class="fin-legend"><span><i class="st-dot ok"></i><b>Confirmé</b> — argent encaissé et vérifié</span><span><i class="st-dot info"></i><b>Déclaré</b> — le client dit avoir payé, à contrôler</span><span><i class="st-dot warn"></i><b>En attente</b> — aucun règlement reçu</span></div>' +
    '<div class="card table-card"><div class="table-tools"><div class="chips">' + chips + '</div><span class="tiny mut">' + list.length + ' opération(s)</span></div>' +
      (rows ? '<div class="table-scroll"><table><thead><tr><th>Date</th><th>Référence</th><th>Adhérent</th><th>Montant</th><th>Moyen</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : emptyState('receipt', 'Aucune opération', 'Modifiez le filtre pour afficher d’autres paiements.')) +
      '<p class="tiny mut" style="margin-top:10px">' + ICON('lock') + ' Aucune transaction réelle. Le rapprochement met simplement à jour les données fictives de la session.</p></div>';
}

function finCharges(site) {
  const isNet = site === 'net';
  const split = isNet ? chargeSplitNet() : chargeSplit(site);
  const f = isNet ? finNet() : finSite(site);
  const dep = finDepRows(site).filter(x => S.depFilter === 'tous' || x.cat === S.depFilter);
  const rows = dep.slice(0, 70).map(x => '<tr><td data-l="Date">' + dstr(x.date) + '</td><td data-l="Libellé"><b>' + esc(x.label) + '</b><small class="mut">' + esc((CHARGE_META[x.catId] || {}).n || x.cat) + '</small></td>' +
    (isNet ? '<td data-l="Salle">' + esc(siteName(x.site)) + '</td>' : '') +
    '<td data-l="Type">' + bdg(x.cat === 'fixe' ? 'actif' : 'bientôt').replace(x.cat === 'fixe' ? 'Actif' : 'Expire bientôt', x.cat === 'fixe' ? 'Fixe' : 'Variable') + '</td>' +
    '<td data-l="Moyen">' + esc(x.moyen) + '</td><td data-l="Montant"><b>' + fmt(x.amount) + '</b></td>' +
    '<td><button class="btn s icon danger" aria-label="Supprimer" onclick="delExpense(\'' + x.site + '\',\'' + x.id + '\')">' + ICON('trash') + '</button></td></tr>').join('');
  const cats = split.rows.map((c, i) => '<div class="cat-row"><span class="cat-ic">' + ICON(c.icon) + '</span><span><b>' + esc(c.n) + '</b><small class="mut">' + (c.type === 'fixe' ? 'Charge fixe' : 'Charge variable') + '</small></span><div class="progress"><i style="width:' + Math.round(c.amount / Math.max(1, split.total) * 100) + '%;background:' + ['#0E7A4B', '#2E75C9', '#D9A441', '#8B5CF6', '#EF4444', '#0F766E'][i % 6] + '"></i></div><b>' + fmt(c.amount) + '</b></div>').join('');
  return head('Charges & dépenses', 'Les charges fixes et variables sont générées par salle. Chaque dépense est une écriture fictive modifiable.',
    '<button class="btn s" onclick="exportFin(\'charges\')">' + ICON('file-excel') + 'Excel</button><button class="btn p s" onclick="openExpense()">' + ICON('plus') + 'Ajouter une dépense</button>') +
    '<div class="grid g4">' +
      kpi('Charges fixes', fmt(split.fixe), '<span class="mut">loyer, salaires, énergie…</span>') +
      kpi('Charges variables', fmt(split.variable), '<span class="mut">marketing, commissions…</span>') +
      kpi('Total du mois', fmt(split.total), '<span class="' + (split.total <= f.rev ? 'up' : 'down') + '">' + (f.rev ? Math.round(split.total / f.rev * 100) : 0) + ' % du CA</span>') +
      kpi('Dépenses du jour', fmt(finDepRows(site).filter(x => sameDay(x.date, AUJ)).reduce((a, x) => a + x.amount, 0)), '<span class="mut">' + finDepRows(site).filter(x => sameDay(x.date, AUJ)).length + ' écriture(s)</span>') +
    '</div>' +
    '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><div><h3>Structure des charges</h3><p class="tiny mut">Part de chaque catégorie dans le total.</p></div><span class="badge b-off">' + (isNet ? 'réseau' : esc(siteName(site))) + '</span></div>' + cats + '</div>' +
      '<div class="card"><div class="chart-h"><h3>Dépenses enregistrées</h3><span class="badge b-warn">' + split.rows.length + ' catégories</span></div>' +
        '<div class="fin-note">' + ICON('circle-info') + '<span>Les charges sont des hypothèses de démonstration. Elles peuvent être ajustées pour tester un scénario avec les vrais chiffres Jumeaux Fitness.</span></div>' +
        '<button class="btn s w" style="margin-top:10px" onclick="openExpense()">' + ICON('plus') + 'Enregistrer une dépense</button></div>' +
    '</div>' +
    '<div class="card table-card"><div class="table-tools"><div class="chips">' +
      [['tous', 'Toutes'], ['fixe', 'Fixes'], ['variable', 'Variables']].map(x => '<button class="chip' + (S.depFilter === x[0] ? ' on' : '') + '" onclick="S.depFilter=\'' + x[0] + '\';go({finTab:\'charges\'})">' + x[1] + '</button>').join('') +
      '</div><span class="tiny mut">' + dep.length + ' écriture(s)</span></div>' +
      (rows ? '<div class="table-scroll"><table><thead><tr><th>Date</th><th>Libellé</th>' + (isNet ? '<th>Salle</th>' : '') + '<th>Type</th><th>Moyen</th><th>Montant</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : emptyState('file-invoice', 'Aucune dépense', 'Ajoutez une dépense ou changez de filtre.')) +
      '<p class="tiny mut" style="margin-top:10px">' + ICON('triangle-exclamation') + ' La suppression d’une dépense est locale à cette session et ne touche aucune comptabilité réelle.</p></div>';
}

function finCaisse(site) {
  const isNet = site === 'net';
  const ids = isNet ? ALL : [site];
  const cards = ids.map(id => {
    const d = D[id], cash = cashToday(id), decl = declaredToday(id), siteObj = SALLES.find(s => s.id === id);
    const close = d.caisseClose;
    return '<div class="card cash-card" style="--c:' + siteObj.color + '"><div class="chart-h"><div><h3>' + esc(siteObj.nom) + '</h3><p class="tiny mut">Caisse du ' + dayLabel(AUJ) + '</p></div><span class="badge ' + (close ? 'b-ok' : 'b-warn') + '">' + (close ? 'Clôturée' : 'Ouverte') + '</span></div>' +
      '<div class="cash-total"><small>Encaissé aujourd’hui</small><b>' + fmt(cash.total) + '</b><span class="tiny mut">' + cash.list.length + ' paiement(s) confirmé(s)</span></div>' +
      '<div class="cash-split">' + MOYENS.map(m => '<span><small>' + m + '</small><b>' + fmt(cash.by[m] || 0) + '</b></span>').join('') + '</div>' +
      (decl.length ? '<div class="fin-note warn">' + ICON('clock-rotate-left') + '<span><b>' + decl.length + ' déclaration(s) à vérifier</b> · ' + fmt(decl.reduce((a, p) => a + p.montant, 0)) + '</span></div>' : '') +
      (close ? '<p class="tiny mut">Clôture enregistrée · compté ' + fmt(close.compte) + ' · écart ' + fmt(close.ecart) + '</p>' : '') +
      '<div class="row gap6" style="margin-top:10px"><button class="btn s p" onclick="openCaisse(\'' + id + '\')">' + ICON('cash-register') + 'Clôturer / compter</button><button class="btn s" onclick="go({view:\'fin\',finSite:\'' + id + '\',finTab:\'journal\'})">Journal</button></div></div>';
  }).join('');
  const focused = isNet ? null : D[site];
  const todayRows = isNet ? [] : D[site].pay.filter(p => sameDay(p.date, AUJ)).map(p => {
    const m = findMembre(p.m) || { nom: p.m };
    return '<tr><td data-l="Heure">' + hhmm(p.date) + '</td><td data-l="Adhérent"><b>' + esc(m.nom) + '</b><small class="mut">' + p.ref + '</small></td><td data-l="Moyen">' + esc(p.moyen) + '</td><td data-l="Montant"><b>' + fmt(p.montant) + '</b></td><td data-l="Statut">' + bdg(p.st) + '</td><td>' + (p.st === 'déclaré' ? '<button class="btn s p" onclick="openReconcile(\'' + p.ref + '\')">Vérifier</button>' : (p.st === 'confirmé' ? '<button class="btn s" onclick="receiptRef(\'' + p.ref + '\')">Reçu</button>' : '')) + '</td></tr>';
  }).join('');
  return head('Caisse & rapprochement', 'Suivez l’argent réellement encaissé, les déclarations à vérifier et la clôture journalière.',
    '<button class="btn s" onclick="exportFin(\'caisse\')">' + ICON('file-excel') + 'Excel</button><button class="btn p s" onclick="openFinReport()">' + ICON('file-pdf') + 'Rapport PDF</button>') +
    '<div class="grid ' + (isNet ? 'g4' : 'g2') + '">' + cards + '</div>' +
    (focused ? '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><div><h3>Opérations du jour</h3><p class="tiny mut">' + esc(focused.nom) + ' · ' + dayLabel(AUJ) + '</p></div><span class="badge b-ok">' + focused.pay.filter(p => sameDay(p.date, AUJ)).length + '</span></div>' +
        (todayRows ? '<div class="table-scroll"><table><thead><tr><th>Heure</th><th>Adhérent</th><th>Moyen</th><th>Montant</th><th>Statut</th><th></th></tr></thead><tbody>' + todayRows + '</tbody></table></div>' : emptyState('cash-register', 'Aucune opération aujourd’hui', 'Les encaissements du jour apparaîtront ici.')) + '</div>' +
      '<div class="card"><div class="chart-h"><h3>Contrôle de caisse</h3><span class="badge b-off">simulation</span></div>' +
        '<div class="cash-recon"><div><small>Fond de caisse</small><b>' + fmt(focused.caisseFond) + '</b></div><div><small>Encaissements confirmés</small><b>' + fmt(cashToday(site).total) + '</b></div><div><small>Théorique en caisse</small><b>' + fmt(focused.caisseFond + cashToday(site).total) + '</b></div></div>' +
        '<div class="fin-note">' + ICON('shield-halved') + '<span>La clôture compare le montant compté au théorique. Un écart est enregistré dans le journal, sans impact réel.</span></div>' +
        '<button class="btn p w" style="margin-top:10px" onclick="openCaisse(\'' + site + '\')">' + ICON('cash-register') + 'Compter et clôturer</button></div>' +
    '</div>' : '') +
    '<div class="fin-note">' + ICON('circle-info') + '<span>Rapprochement : un paiement <b>déclaré</b> devient <b>encaissé</b> après vérification. Un paiement <b>en attente</b> peut être confirmé ou annulé. Les montants sont fictifs.</span></div>';
}

function finRapports(site) {
  const isNet = site === 'net';
  const f = isNet ? finNet() : finSite(site);
  const monthly = MOIS.map((m, i) => {
    const rev = isNet ? addv('rev')[i] : D[site].rev[i];
    const chg = isNet ? addv('chg')[i] : D[site].chg[i];
    const profit = rev - chg;
    return { m, rev, chg, profit, marge: rev ? Math.round(profit / rev * 100) : 0 };
  });
  const reportSites = S.role === 'compta' ? SALLES.filter(s => s.id === S.rsite) : SALLES;
  const siteRows = reportSites.map(s => {
    const x = finSite(s.id);
    return '<tr><td data-l="Salle"><span class="site-dot" style="background:' + s.color + '"></span><b>' + esc(s.nom) + '</b></td><td data-l="CA">' + fmt(x.rev) + '</td><td data-l="Charges">' + fmt(x.chg) + '</td><td data-l="Résultat"><b class="' + (x.profit >= 0 ? 't-ok' : 't-ko') + '">' + fmt(x.profit) + '</b><small class="mut">' + x.marge + ' %</small></td><td data-l="Encaissé">' + fmt(x.encaisse) + '</td><td data-l="Impayés">' + fmt(x.impayes) + '</td><td data-l="Recouvrement">' + x.recouvrement + ' %</td></tr>';
  }).join('');
  return head('Rapports & exports', 'Des états financiers prêts à imprimer ou à ouvrir dans Excel. Tous les montants restent des hypothèses locales.',
    '<button class="btn s" onclick="exportFin(\'synthese\')">' + ICON('file-excel') + 'Excel synthèse</button><button class="btn p s" onclick="openFinReport()">' + ICON('file-pdf') + 'PDF / impression</button>') +
    '<div class="grid g4">' +
      kpi('CA annualisé', fmt(f.rev * 12), '<span class="mut">projection linéaire</span>') +
      kpi('Charges annualisées', fmt(f.chg * 12), '<span class="mut">projection linéaire</span>') +
      kpi('Résultat annualisé', fmt(f.profit * 12), '<span class="' + (f.profit >= 0 ? 'up' : 'down') + '">simulation</span>') +
      kpi('Marge moyenne', f.marge + ' %', '<span class="mut">sur le mois en cours</span>') +
    '</div>' +
    '<div class="card table-card"><div class="chart-h"><h3>Rapport par établissement</h3><span class="badge b-off">FCFA</span></div>' +
      '<div class="table-scroll"><table><thead><tr><th>Salle</th><th>CA</th><th>Charges</th><th>Résultat</th><th>Encaissé</th><th>Impayés</th><th>Recouvrement</th></tr></thead><tbody>' + siteRows + '</tbody></table></div></div>' +
    '<div class="card table-card"><div class="chart-h"><div><h3>Synthèse mensuelle — 12 mois</h3><p class="tiny mut">CA, charges et résultat reconstitués.</p></div><button class="btn s" onclick="exportFin(\'mensuel\')">' + ICON('file-excel') + 'Excel</button></div>' +
      '<div class="table-scroll"><table><thead><tr><th>Mois</th><th>CA</th><th>Charges</th><th>Résultat</th><th>Marge</th></tr></thead><tbody>' +
        monthly.map(x => '<tr><td data-l="Mois"><b>' + x.m + '</b></td><td data-l="CA">' + fmt(x.rev) + '</td><td data-l="Charges">' + fmt(x.chg) + '</td><td data-l="Résultat" class="' + (x.profit >= 0 ? 't-ok' : 't-ko') + '">' + fmt(x.profit) + '</td><td data-l="Marge">' + x.marge + ' %</td></tr>').join('') +
      '</tbody></table></div></div>' +
    '<div class="grid g2"><div class="card"><h3>Exports disponibles</h3><p class="mut tiny">Fichiers générés localement. Le format Excel est un tableau HTML compatible .xls, sans macro.</p>' +
      '<div class="export-list">' +
        '<button onclick="exportFin(\'synthese\')">' + ICON('chart-pie') + '<span><b>Synthèse réseau</b><small>CA, charges, résultat par salle</small></span>' + ICON('download') + '</button>' +
        '<button onclick="exportFin(\'journal\')">' + ICON('receipt') + '<span><b>Journal des encaissements</b><small>Statuts, moyens et références</small></span>' + ICON('download') + '</button>' +
        '<button onclick="exportFin(\'charges\')">' + ICON('file-invoice-dollar') + '<span><b>Charges & dépenses</b><small>Fixes, variables et catégories</small></span>' + ICON('download') + '</button>' +
        '<button onclick="exportFin(\'caisse\')">' + ICON('cash-register') + '<span><b>Caisse du jour</b><small>Encaissements et déclarations</small></span>' + ICON('download') + '</button>' +
      '</div></div>' +
      '<div class="card"><h3>À valider avec vos vrais chiffres</h3><ul class="checklist">' +
        ['Remplacer les hypothèses de charges par les factures réelles', 'Vérifier les tarifs et la répartition des formules', 'Comparer les encaissements Wave / Orange Money / espèces', 'Valider les objectifs mensuels avec la direction', 'Confronter les prévisions à la saisonnalité réelle'].map(x => '<li>' + ICON('circle-check') + x + '</li>').join('') +
      '</ul><p class="tiny mut">' + ICON('triangle-exclamation') + ' Aucun gain financier n’est garanti. Les prévisions servent à discuter des hypothèses, pas à promettre un résultat.</p></div></div>';
}

function viewFin() {
  const site = S.finSite || 'net';
  const tab = S.finTab || 'synthese';
  const label = site === 'net' ? 'Tout le réseau' : siteName(site);
  const body = tab === 'journal' ? finJournal(site) :
    tab === 'charges' ? finCharges(site) :
    tab === 'caisse' ? finCaisse(site) :
    tab === 'rapports' ? finRapports(site) : finSynth(site);
  const tabs = FIN_TABS.map(t => '<button class="tab' + (tab === t[0] ? ' on' : '') + '" onclick="go({finTab:\'' + t[0] + '\'})">' + ICON(t[2]) + t[1] + '</button>').join('');
  return head('Finance & comptabilité', 'Journal, charges, caisse et rapports pour <b>' + esc(label) + '</b>. Chaque montant est une simulation locale.',
    '<button class="btn s" onclick="exportFin(\'synthese\')">' + ICON('file-excel') + 'Excel</button><button class="btn s" onclick="openFinReport()">' + ICON('file-pdf') + 'PDF</button><button class="btn p s" onclick="openExpense()">' + ICON('plus') + 'Dépense</button>') +
    '<div class="card table-tools fin-toolbar"><div class="chips">' + finSiteChips() + '</div><span class="tiny mut">' + ICON('flask') + ' Données fictives · session locale</span></div>' +
    '<div class="tabs fin-tabs" role="tablist">' + tabs + '</div>' + body;
}

// ---------------------------------------------------------------- PERFORMANCE
function viewPerf() {
  const p = perfNet();
  const rankRev = p.rows.slice().sort((a, b) => b.rev - a.rev);
  const rankAct = p.rows.slice().sort((a, b) => b.act - a.act);
  const revLeader = rankRev[0], actLeader = rankAct[0];
  const cards = p.rows.map((x, i) => {
    const s = SALLES.find(y => y.id === x.id);
    const rank = rankRev.findIndex(y => y.id === x.id) + 1;
    return '<article class="card perf-card" style="--c:' + s.color + '"><div class="chart-h"><div><h3>' + esc(x.nom) + '</h3><p class="tiny mut">' + esc(s.resp) + '</p></div><span class="badge b-off">#' + rank + ' CA</span></div>' +
      '<div class="perf-nums"><span><small>Actifs</small><b>' + x.act + '</b></span><span><small>CA</small><b>' + fmtShort(x.rev) + '</b></span><span><small>Résultat</small><b>' + fmtShort(x.profit) + '</b></span><span><small>Marge</small><b>' + x.marge + ' %</b></span></div>' +
      '<div class="perf-mini">' + [['Renouvellements', x.renouv], ['Nouveaux', x.nouv], ['Présences', x.pres], ['Impayés', x.impayes]].map(z => '<span><small>' + z[0] + '</small><b>' + (z[0] === 'Impayés' ? fmt(z[1]) : z[1]) + '</b></span>').join('') + '</div>' +
      '<div class="progress"><i style="width:' + x.taux + '%;background:' + s.color + '"></i></div><span class="tiny mut">' + x.taux + ' % d’actifs · panier ' + fmt(x.panier) + '</span>' +
      '<button class="btn s w" style="margin-top:10px" onclick="go({view:\'fin\',finSite:\'' + x.id + '\',finTab:\'synthese\'})">Voir la finance ' + ICON('arrow-right') + '</button></article>';
  }).join('');
  const rows = rankRev.map((x, i) => '<tr><td data-l="Rang"><b class="rank-n">' + (i + 1) + '</b></td><td data-l="Salle"><span class="site-dot" style="background:' + (SALLES.find(s => s.id === x.id) || {}).color + '"></span><b>' + esc(x.nom) + '</b></td>' +
    '<td data-l="Actifs">' + x.act + '</td><td data-l="CA">' + fmt(x.rev) + '</td><td data-l="Résultat">' + fmt(x.profit) + '<small class="mut">' + x.marge + ' %</small></td><td data-l="Renouvellements">' + x.renouv + '</td><td data-l="Nouveaux">' + x.nouv + '</td><td data-l="Présences">' + x.pres + '</td><td data-l="Impayés">' + fmt(x.impayes) + '</td><td data-l="Panier">' + fmt(x.panier) + '</td></tr>').join('');
  return head('Performance des salles', 'Comparez les quatre établissements sur une seule page : revenus, actifs, renouvellements, nouveaux, présences et impayés.',
    '<button class="btn s" onclick="go({view:\'fin\'})">' + ICON('scale-balanced') + 'Finance</button><button class="btn p s" onclick="startPres()">' + ICON('play') + 'Présenter</button>') +
    '<section class="insight"><span class="insight-ic">' + ICON('ranking-star') + '</span><div class="insight-copy"><span class="eyebrow">Comparaison immédiate</span>' +
      '<b>' + esc(revLeader.nom) + ' mène sur le CA (' + fmt(revLeader.rev) + '), ' + esc(actLeader.nom) + ' mène sur les actifs (' + actLeader.act + ').</b>' +
      '<p>Un même réseau peut avoir plusieurs logiques de performance. Cette vue aide à décider où renforcer la vente, où stabiliser la rétention et où accélérer le recouvrement.</p></div>' +
      '<div class="insight-facts"><span><small>CA réseau</small><b>' + fmt(p.rev) + '</b></span><span><small>Actifs</small><b>' + p.act + '</b></span><span><small>Impayés</small><b>' + fmt(p.impayes) + '</b></span></div></section>' +
    '<div class="grid g4">' +
      kpi('Actifs consolidés', p.act, '<span class="mut">' + net.tot + ' fiches au total</span>') +
      kpi('CA mensuel', fmt(p.rev), '<span class="up">' + ICON('arrow-trend-up') + ' réseau</span>') +
      kpi('Renouvellements (30 j)', p.renouv, '<span class="up">' + ICON('arrows-rotate') + ' ' + p.nouv + ' nouveaux</span>') +
      kpi('Impayés', fmt(p.impayes), '<span class="' + (p.impayes ? 'warn-t' : 'up') + '">à rapprocher en caisse</span>') +
    '</div>' +
    '<div class="grid g4">' + cards + '</div>' +
    '<div class="grid g2">' +
      bars(p.rows.map(x => Math.round(x.rev / 1e3)), p.rows.map(x => x.nom), 'CA par salle', ' k FCFA', { total: fmt(p.rev) }) +
      bars(p.rows.map(x => x.act), p.rows.map(x => x.nom), 'Adhérents actifs', '', { total: p.act + ' actifs' }) +
    '</div>' +
    '<div class="grid g2">' +
      bars(p.rows.map(x => x.renouv), p.rows.map(x => x.nom), 'Renouvellements — 30 jours', '', { total: p.renouv }) +
      bars(p.rows.map(x => x.nouv), p.rows.map(x => x.nom), 'Nouveaux adhérents — 30 jours', '', { total: p.nouv }) +
    '</div>' +
    '<div class="card table-card"><div class="chart-h"><div><h3>Tableau de performance</h3><p class="tiny mut">Classé par chiffre d’affaires. Les montants sont fictifs.</p></div><span class="badge b-ok">4 salles</span></div>' +
      '<div class="table-scroll"><table><thead><tr><th>Rang</th><th>Salle</th><th>Actifs</th><th>CA</th><th>Résultat</th><th>Renouv.</th><th>Nouveaux</th><th>Présences</th><th>Impayés</th><th>Panier</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
    '<div class="grid g2">' + activity('km') +
      '<div class="card"><div class="chart-h"><h3>Ce que cette vue permet de décider</h3><span class="badge b-off">lecture</span></div><ul class="checklist">' +
      ['Quelle salle génère le plus de revenus, et pourquoi', 'Où la base d’adhérents est la plus large', 'Quelle salle renouvelle le mieux', 'Où les nouveaux manquent malgré un bon CA', 'Quel établissement concentre les impayés', 'Quel panier moyen mérite une offre premium'].map(x => '<li>' + ICON('circle-check') + x + '</li>').join('') +
      '</ul><p class="tiny mut">' + ICON('triangle-exclamation') + ' Les écarts sont des hypothèses de démonstration, à confronter aux données réelles avant toute décision.</p></div>' +
    '</div>';
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
    return '<article class="card site-card"><div class="site-head"><span class="site-mark" style="--c:' + s.color + '"><img src="' + LOGO_MARK + '" alt="" aria-hidden="true"></span>' +
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
    '<div class="salle-lockup">' + logoChip('sm') + '<span class="site-brand"><i class="fa-solid fa-palette" aria-hidden="true"></i>' + esc(d.palette) + '</span></div>' +
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
  const sc = subCounts(id);
  const view = S.aboView || 'traiter';
  const cards = PLANS.map((p, i) => {
    const n = d.mem.filter(m => m.plan === i).length;
    const promo = promotionPour(p.m);
    const h = prixPlan(p.m, 'h'), f = prixPlan(p.m, 'f');
    return '<div class="card plan-card' + (promo ? ' promo' : p.pop ? ' pop' : '') + '" style="--c:' + p.c + '">' +
      (promo ? '<span class="plan-flag">Promo</span>' : p.pop ? '<span class="plan-flag">Le plus choisi</span>' : '') +
      '<span class="plan-name">' + p.n + '</span>' +
      '<div class="plan-pair"><span><small>Hommes</small><b>' + fmt(h) + '</b></span><span><small>Femmes</small><b>' + fmt(f) + '</b></span></div>' +
      '<span class="tiny mut">' + p.j + ' jours · ' + p.d + '</span>' +
      '<div class="plan-bar"><i style="width:' + Math.round(n / d.mem.length * 100) + '%"></i></div><span class="tiny mut"><b>' + n + '</b> adhérents · ' + Math.round(n / d.mem.length * 100) + ' %</span></div>';
  }).join('');

  const due7 = d.mem.filter(m => statut(m) === 'bientôt' && joursRestants(m) >= 4);
  const due3 = d.mem.filter(m => statut(m) === 'bientôt' && joursRestants(m) >= 2 && joursRestants(m) <= 3);
  const due1 = d.mem.filter(m => statut(m) === 'bientôt' && joursRestants(m) <= 1);
  const demands = d.mem.filter(m => m.demande && m.demande.statut === 'à traiter');
  const filters = [['traiter', 'À traiter', sc.bientot + sc.expires], ['expirés', 'Expirés', sc.expires], ['inactifs', 'Inactifs', sc.inactifs], ['demandes', 'Demandes', demands.length], ['tous', 'Tous', d.mem.length]];
  let list;
  if (view === 'traiter') list = d.mem.filter(m => ['bientôt', 'expiré'].includes(statut(m))).sort((a, b) => a.exp - b.exp);
  else if (view === 'expirés') list = d.mem.filter(m => statut(m) === 'expiré').sort((a, b) => a.exp - b.exp);
  else if (view === 'inactifs') list = d.mem.filter(inactif).sort((a, b) => lastVisit(a) - lastVisit(b));
  else if (view === 'demandes') list = demands.sort((a, b) => a.demande.at - b.demande.at);
  else list = d.mem.slice().sort((a, b) => a.exp - b.exp);

  const rows = list.slice(0, 40).map(m => {
    const st = statut(m), jr = joursRestants(m), alert = renewalAlert(m);
    const auto = '<button class="badge ' + (m.autoRenew ? 'b-ok' : 'b-off') + '" title="Activer ou désactiver le renouvellement automatique" onclick="toggleAutoRenew(\'' + m.id + '\')">' + ICON('rotate') + (m.autoRenew ? 'Auto' : 'Manuel') + '</button>';
    const demand = m.demande && m.demande.statut === 'à traiter'
      ? '<div class="sub-demand"><b>' + (m.demande.type === 'changement' ? 'Changement → ' + PLANS[m.demande.plan].n : 'Renouvellement demandé') + (m.demande.promo ? ' · offre promo' : '') + '</b><small>Demandé le ' + dstr(m.demande.at) + '</small>' +
        '<span class="row gap6"><button class="btn s p" onclick="treatDemand(\'' + m.id + '\',true)">Accepter</button><button class="btn s danger" onclick="treatDemand(\'' + m.id + '\',false)">Refuser</button></span></div>'
      : '';
    return '<tr' + (m.demande && m.demande.statut === 'à traiter' ? ' class="row-alert"' : '') + '><td data-l="Adhérent">' + avatar(m.nom) + '<b>' + esc(m.nom) + '</b><small class="mut">' + m.id + ' · ' + (inactif(m) ? 'inactif ' + Math.floor((AUJ - lastVisit(m)) / J) + ' j' : 'vu le ' + dstr(lastVisit(m))) + '</small>' + demand + '</td>' +
      '<td data-l="Formule">' + PLANS[m.plan].n + '<small class="mut">' + fmt(prixMembre(m)) + '</small></td>' +
      '<td data-l="Début">' + dstr(m.debut || m.inscription) + '</td>' +
      '<td data-l="Échéance">' + dstr(m.exp) + '<small class="' + (st === 'expiré' ? 't-ko' : st === 'bientôt' ? 'warn-t' : 'mut') + '">' + (jr >= 0 ? 'J-' + jr : 'expiré depuis ' + Math.abs(jr) + ' j') + '</small></td>' +
      '<td data-l="Alerte">' + (alert ? '<span class="badge ' + (alert === 'expiré' ? 'b-ko' : 'b-warn') + '">' + alert + '</span>' : '<span class="badge b-ok">OK</span>') + '<small class="mut">' + bdg(st) + '</small></td>' +
      '<td data-l="Auto">' + auto + '</td>' +
      '<td data-l="Actions"><div class="row gap6 no-wrap">' +
        '<button class="btn s p" onclick="renew(\'' + m.id + '\')">' + ICON('rotate') + 'Renouveler</button>' +
        '<button class="btn s icon" title="Changer de formule" aria-label="Changer de formule" onclick="openPlan(\'' + m.id + '\')">' + ICON('shuffle') + '</button>' +
        '<button class="btn s icon" title="Historique" aria-label="Historique" onclick="openHistory(\'' + m.id + '\')">' + ICON('clock-rotate-left') + '</button>' +
        '<button class="btn s icon ' + (m.susp ? 'p' : 'danger') + '" title="' + (m.susp ? 'Réactiver' : 'Suspendre temporairement') + '" aria-label="' + (m.susp ? 'Réactiver' : 'Suspendre') + '" onclick="toggleSusp(\'' + m.id + '\')">' + ICON(m.susp ? 'play' : 'pause') + '</button>' +
        '<button class="btn s icon" title="Fiche" aria-label="Fiche" onclick="fiche(\'' + m.id + '\')">' + ICON('id-card') + '</button>' +
      '</div></td></tr>';
  }).join('');

  const history = d.mem.flatMap(m => (m.renouv || []).map(r => ({ m, r }))).filter(x => +new Date(x.r.date) >= +AUJ - 120 * J).sort((a, b) => b.r.date - a.r.date).slice(0, 8);
  const historyRows = history.map(x => '<div class="act"><span class="act-ic ' + (x.r.type === 'changement' ? '' : 'ok') + '">' + ICON(x.r.type === 'changement' ? 'shuffle' : 'rotate') + '</span><span><b>' + esc(x.m.nom) + ' · ' + (x.r.type === 'changement' ? 'changement de formule' : 'renouvellement') + '</b><small>' + dstr(x.r.date) + ' · ' + PLANS[x.r.plan].n + (x.r.montant ? ' · ' + fmt(x.r.montant) : '') + ' · ' + esc(x.r.moyen || '—') + '</small></span><span class="badge b-off">' + (x.r.type === 'changement' ? 'formule' : 'auto') + '</span></div>').join('');

  return head('Abonnements', sc.actifs + ' actifs · ' + (sc.bientot + sc.expires) + ' à risque · ' + sc.demandes + ' demande(s) · ' + sc.inactifs + ' inactif(s)',
    '<button class="btn s" onclick="go({tab:\'pay\'})">' + ICON('money-bill-wave') + 'Voir la caisse</button><button class="btn p s" onclick="go({tab:\'mem\',filter:\'bientôt\'})">' + ICON('user-clock') + 'Traiter les échéances</button>') +
    '<div class="sub-alerts">' +
      '<div class="sub-alert"><span class="sub-alert-n">' + due7.length + '</span><span><b>Alerte J-7</b><small>Renouvellement à préparer</small></span>' + ICON('calendar-day') + '</div>' +
      '<div class="sub-alert warn"><span class="sub-alert-n">' + due3.length + '</span><span><b>Alerte J-3</b><small>Relance à envoyer</small></span>' + ICON('bell') + '</div>' +
      '<div class="sub-alert ko"><span class="sub-alert-n">' + due1.length + '</span><span><b>Alerte J-1</b><small>Dernier rappel</small></span>' + ICON('triangle-exclamation') + '</div>' +
      '<div class="sub-alert info"><span class="sub-alert-n">' + sc.auto + '</span><span><b>Auto-renouvellement</b><small>sur ' + d.mem.length + ' fiches</small></span>' + ICON('arrows-rotate') + '</div>' +
    '</div>' +
    '<div class="grid g3">' + cards + '</div>' +
    '<div class="grid g4">' +
      kpi('Actifs', sc.actifs, '<span class="up">' + ICON('circle-check') + ' accès immédiat</span>') +
      kpi('À risque', sc.bientot + sc.expires, '<span class="warn-t">J-7 et expirés</span>') +
      kpi('Expirés', sc.expires, '<span class="' + (sc.expires ? 'down' : 'up') + '">à reconquérir</span>') +
      kpi('Inactifs', sc.inactifs, '<span class="warn-t">' + ICON('user-clock') + ' > 21 jours sans visite</span>') +
    '</div>' +
    '<div class="card table-card"><div class="table-tools"><div class="chips">' +
      filters.map(f => '<button class="chip' + (view === f[0] ? ' on' : '') + '" onclick="S.aboView=\'' + f[0] + '\';go({tab:\'abo\'})">' + f[1] + '<span>' + f[2] + '</span></button>').join('') +
      '</div><span class="tiny mut">' + list.length + ' dossier(s) · renouvellement simulé</span></div>' +
      (rows ? '<div class="table-scroll"><table><thead><tr><th>Adhérent</th><th>Formule</th><th>Début</th><th>Échéance</th><th>Alerte</th><th>Auto</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : emptyState('circle-check', 'Aucun dossier dans ce filtre', 'Toutes les échéances sont peut-être déjà traitées.')) +
      '<p class="tiny mut" style="margin-top:10px">' + ICON('circle-info') + ' Un renouvellement met à jour l’échéance, l’historique et crée un reçu fictif. Aucun paiement réel n’est effectué.</p></div>' +
    '<div class="grid g2">' +
      '<div class="card"><div class="chart-h"><div><h3>Demandes à traiter</h3><p class="tiny mut">Demandes envoyées depuis l’espace adhérent.</p></div><span class="badge ' + (demands.length ? 'b-warn' : 'b-ok') + '">' + demands.length + '</span></div>' +
        (demands.length ? demands.slice(0, 5).map(m => '<div class="act"><span class="act-ic warn">' + ICON(m.demande.type === 'changement' ? 'shuffle' : 'rotate') + '</span><span><b>' + esc(m.nom) + '</b><small>' + (m.demande.type === 'changement' ? 'Changement vers ' + PLANS[m.demande.plan].n : 'Renouvellement ' + PLANS[m.demande.plan].n) + (m.demande.promo ? ' · offre promo' : '') + ' · ' + dstr(m.demande.at) + '</small></span><span class="row gap6"><button class="btn s p" onclick="treatDemand(\'' + m.id + '\',true)">Accepter</button><button class="btn s danger" onclick="treatDemand(\'' + m.id + '\',false)">Refuser</button></span></div>').join('') : '<p class="tiny mut">Aucune demande en attente. Les demandes de l’espace adhérent apparaîtront ici.</p>') +
      '</div>' +
      '<div class="card"><div class="chart-h"><div><h3>Historique des renouvellements</h3><p class="tiny mut">120 derniers jours · auto ou manuel.</p></div><span class="badge b-off">' + history.length + '</span></div>' +
        (historyRows || '<p class="tiny mut">Aucun renouvellement enregistré sur la période.</p>') +
      '</div>' +
    '</div>';
}

function sallePay(id, d, k) {
  const st = S.payFilter || 'tous';
  const list = d.pay.filter(p => st === 'tous' || p.st === st);
  const c30 = payIn(id, 30);
  const total = c30.filter(p => p.st === 'confirmé').reduce((a, p) => a + p.montant, 0);
  const declares = c30.filter(p => p.st === 'déclaré').reduce((a, p) => a + p.montant, 0);
  const pending = c30.filter(p => p.st === 'en attente').reduce((a, p) => a + p.montant, 0);
  const chips = ['tous', 'confirmé', 'déclaré', 'en attente', 'annulé'].map(f =>
    '<button class="chip' + (st === f ? ' on' : '') + '" onclick="S.payFilter=\'' + f + '\';go({tab:\'pay\'})">' +
    (f === 'tous' ? 'Tous' : payMeta(f).n) + '<span>' + (f === 'tous' ? d.pay.length : d.pay.filter(p => p.st === f).length) + '</span></button>').join('');
  const rows = list.slice(0, 30).map(p => {
    const m = findMembre(p.m) || { nom: p.m };
    const actionable = p.st === 'déclaré' || p.st === 'en attente';
    return '<tr><td data-l="Référence"><b class="mono">' + p.ref + '</b><small class="mut">' + esc(p.agent) + '</small></td>' +
      '<td data-l="Adhérent">' + avatar(m.nom) + esc(m.nom) + '</td>' +
      '<td data-l="Montant"><b>' + fmt(p.montant) + '</b></td>' +
      '<td data-l="Moyen">' + ICON(MOYENS_ICON[p.moyen] || 'wallet') + ' ' + esc(p.moyen) + '</td>' +
      '<td data-l="Date">' + dstr(p.date) + '</td><td data-l="Statut">' + bdg(p.st) + (actionable ? '<small class="warn-t tiny">à rapprocher</small>' : '') + '</td>' +
      '<td>' + (actionable ? '<button class="btn s p" onclick="openReconcile(\'' + p.ref + '\')">Vérifier</button>' : '<button class="btn s" onclick="receiptRef(\'' + p.ref + '\')">Reçu</button>') + '</td></tr>';
  }).join('');
  return head('Paiements', 'Chaque encaissement laisse une trace. Les paiements déclarés restent à vérifier avant d’être comptés en caisse.',
    '<button class="btn s" onclick="exportCSV(\'paiements\')">' + ICON('file-csv') + 'Exporter</button><button class="btn p s" onclick="newPayment()">' + ICON('plus') + 'Enregistrer un paiement</button>') +
    '<div class="grid g4">' + kpi('Encaissé (30 j)', fmt(total), '<span class="up">' + c30.filter(p => p.st === 'confirmé').length + ' reçus confirmés</span>') +
    kpi('Déclaré', fmt(declares), '<span class="warn-t">' + c30.filter(p => p.st === 'déclaré').length + ' à vérifier</span>') +
    kpi('En attente', fmt(pending), '<span class="warn-t">' + c30.filter(p => p.st === 'en attente').length + ' non réglé(s)</span>') +
    kpi('Recouvrement', (total + declares + pending ? Math.round(total / (total + declares + pending) * 100) : 100) + ' %', '<span class="mut">confirmé / total attendu</span>') + '</div>' +
    '<div class="card table-card"><div class="table-tools"><div class="chips">' + chips + '</div><span class="tiny mut">' + list.length + ' opérations</span></div>' +
    (rows ? '<div class="table-scroll"><table><thead><tr><th>Référence</th><th>Adhérent</th><th>Montant</th><th>Moyen</th><th>Date</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : emptyState('receipt', 'Aucun paiement', 'Modifiez le filtre pour afficher d’autres opérations.')) +
    '<p class="tiny mut" style="margin-top:10px">' + ICON('lock') + ' Aucune transaction réelle. Un paiement déclaré doit être rapproché avant d’être compté comme recette confirmée.</p></div>';
}

function sallePre(id, d, k) {
  const logs = d.pre.slice().reverse().slice(0, 10);
  const rows = logs.map(p => {
    const m = findMembre(p.m);
    return '<tr><td data-l="Heure"><b class="mono">' + hhmm(p.at) + '</b></td><td data-l="Adhérent">' + avatar(m.nom) + esc(m.nom) + '</td>' +
      '<td data-l="Type"><span class="type-pill">' + ICON(p.type === 'QR' ? 'qrcode' : 'hand-pointer') + p.type + '</span></td>' +
      '<td data-l="Traçabilité">' + (p.type === 'Manuel' && p.responsable
        ? '<b>' + esc(p.responsable) + '</b><small>' + esc(p.motif || '') + '</small>'
        : '—') + '</td>' +
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
        '<div class="table-scroll"><table><thead><tr><th>Heure</th><th>Adhérent</th><th>Type</th><th>Responsable / motif</th><th>Résultat</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
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

// ---------------------------------------------------------------- TARIFS & PROMOTION
function viewTarifs() {
  const offers = PROMO.offres || {};
  const active = !!PROMO.active && promoOffres().length > 0;
  const offreN = m => (offers[m] != null ? offers[m] : '');
  const fin = PROMO.fin ? new Date(PROMO.fin).toISOString().slice(0, 10) : '';
  const rows = PLANS.map(p => {
    const promo = promotionPour(p.m);
    const h = prixPlan(p.m, 'h'), f = prixPlan(p.m, 'f');
    const baseH = TARIFS.h * p.m, baseF = TARIFS.f * p.m;
    return '<tr><td data-l="Durée"><b>' + p.n + '</b><small class="mut">' + p.j + ' jours</small></td>' +
      '<td data-l="Hommes · base">' + fmt(baseH) + '</td>' +
      '<td data-l="Femmes · base">' + fmt(baseF) + '</td>' +
      '<td data-l="Prix appliqué">' + (promo
        ? '<b class="t-ok">' + fmt(h) + '</b><small class="mut">promo H / F · au lieu de ' + fmt(baseH) + ' H</small>'
        : '<b>' + fmt(h) + ' H</b><small class="mut">' + fmt(f) + ' F</small>') + '</td>' +
      '<td data-l="Économie">' + (promo
        ? '<span class="t-ok">' + fmt(Math.max(0, baseH - h)) + ' H</span><small class="mut">' + fmt(Math.max(0, baseF - f)) + ' F</small>'
        : '<span class="mut">—</span>') + '</td></tr>';
  }).join('');
  return head('Tarifs & promotion',
    'La Direction fixe les tarifs des quatre salles et pilote une promotion visible par tous les adhérents. <span class="pill inline"><span class="dot"></span>Montants fictifs</span>',
    '<button class="btn s" onclick="go({view:\'portal\'})">' + ICON('mobile-screen') + 'Voir l’espace adhérent</button>') +
    '<div class="grid g4">' +
      kpi('Tarif hommes', fmt(TARIFS.h) + ' <small class="kpi-of">/ mois</small>', '<span class="mut">exemple fictif pour 1 mois</span>') +
      kpi('Tarif femmes', fmt(TARIFS.f) + ' <small class="kpi-of">/ mois</small>', '<span class="mut">exemple fictif pour 1 mois</span>') +
      kpi('Promotion', active ? 'Active' : 'Inactive', '<span class="' + (active ? 'up' : 'mut') + '">' + (active ? ICON('tags') + ' ' + esc(PROMO.nom || 'Promotion') : 'aucune offre en cours') + '</span>') +
      kpi('Durées', '1 à 12', '<span class="mut">mois uniquement · sans trimestre</span>') +
    '</div>' +
    '<div class="callout warn">' + ICON('triangle-exclamation') + ' <span><b>Tarifs de démonstration.</b> Les 20 000 FCFA (hommes) et 15 000 FCFA (femmes) par mois, ainsi que la promotion, sont des valeurs fictives. Elles doivent être <b>validées par la Direction</b> avant tout usage réel.</span></div>' +
    '<div class="grid g2">' +
      '<div class="card"><h3>Tarifs de base</h3><p class="mut tiny">Prix mensuel appliqué aux nouveaux abonnements et aux renouvellements des quatre salles.</p>' +
        '<div class="f tarif-f2"><label>Hommes — FCFA / mois<input id="tarifH" type="number" min="500" step="500" value="' + TARIFS.h + '"></label>' +
        '<label>Femmes — FCFA / mois<input id="tarifF" type="number" min="500" step="500" value="' + TARIFS.f + '"></label></div>' +
        '<div class="tarif-ex"><span>' + ICON('calculator') + ' Exemple hors promotion</span><div class="tarif-ex-grid">' +
          [1, 3, 6, 12].map(m => '<div><small>' + m + ' mois</small><b>' + fmt(TARIFS.h * m) + ' H</b><em>' + fmt(TARIFS.f * m) + ' F</em></div>').join('') +
        '</div></div>' +
        '<div class="callout">' + ICON('circle-info') + ' Le prix sans promotion est linéaire : le tarif mensuel multiplié par la durée choisie.</div>' +
      '</div>' +
      '<div class="card"><h3>Promotion du réseau</h3><p class="mut tiny">Une seule promotion, valable dans toutes les salles et pour les hommes comme pour les femmes.</p>' +
        '<label class="check-line"><input type="checkbox" id="promoActive"' + (PROMO.active ? ' checked' : '') + '> Activer la promotion sur tout le réseau</label>' +
        '<div class="f"><label>Nom de la promotion<input id="promoNom" maxlength="60" value="' + esc(PROMO.nom || '') + '"></label>' +
        '<label>Fin de la promotion<input id="promoFin" type="date" value="' + fin + '"></label></div>' +
        '<p class="tiny mut" style="margin-top:12px">Prix promotionnels par durée. Laisser vide pour ne pas appliquer d’offre sur cette durée.</p>' +
        '<div class="f tarif-f3">' + [1, 2, 3].map(m => '<label>' + m + ' mois<input id="promo' + m + '" type="number" min="0" step="500" value="' + offreN(m) + '" placeholder="' + TARIFS.h * m + '"></label>').join('') + '</div>' +
        '<div class="row gap8" style="margin-top:14px"><button class="btn p" onclick="saveTarifs()">' + ICON('floppy-disk') + 'Enregistrer</button><button class="btn" onclick="resetTarifs()">' + ICON('rotate-left') + 'Valeurs d’origine</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="card table-card"><div class="table-tools"><div><h3>Grille complète · 1 à 12 mois</h3><p class="tiny mut">Prix total pour la durée choisie. La promotion remplace le tarif linéaire sur les durées concernées.</p></div>' +
      '<span class="badge ' + (active ? 'b-warn' : 'b-off') + '">' + (active ? ICON('tags') + ' Promotion active' : 'Sans promotion') + '</span></div>' +
      '<div class="table-scroll"><table><thead><tr><th>Durée</th><th>Hommes · base</th><th>Femmes · base</th><th>Prix appliqué</th><th>Économie</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="tiny mut" style="margin-top:10px">' + ICON('circle-info') + ' Les nouveaux abonnements, les renouvellements et les demandes de l’espace adhérent utilisent immédiatement ces tarifs. Les encaissements passés sont conservés.</p></div>';
}

function saveTarifs() {
  const h = Math.round(+$('tarifH').value || 0);
  const f = Math.round(+$('tarifF').value || 0);
  if (h <= 0 || f <= 0) return toast('Les deux tarifs mensuels doivent être supérieurs à zéro', 'ko');
  TARIFS.h = h;
  TARIFS.f = f;
  const offres = {};
  [1, 2, 3].forEach(m => {
    const v = Math.round(+$('promo' + m).value || 0);
    if (v > 0) offres[m] = v;
  });
  PROMO.offres = offres;
  PROMO.active = $('promoActive').checked && Object.keys(offres).length > 0;
  PROMO.nom = $('promoNom').value.trim() || 'Promotion du réseau';
  const fin = $('promoFin').value;
  PROMO.fin = fin ? new Date(fin + 'T23:59:59') : null;
  journal('Tarifs & promotion mis à jour', 'Hommes ' + fmt(h) + ' · Femmes ' + fmt(f) + (PROMO.active ? ' · promotion active' : ' · sans promotion'));
  recalc(); render();
  toast(PROMO.active ? 'Tarifs et promotion enregistrés' : 'Tarifs enregistrés · promotion désactivée', 'ok');
}

function resetTarifs() {
  TARIFS.h = 20000;
  TARIFS.f = 15000;
  PROMO.active = true;
  PROMO.nom = 'Promotion de lancement';
  PROMO.fin = addDays(45);
  PROMO.offres = { 1: 15000, 2: 27500, 3: 40000 };
  journal('Tarifs réinitialisés', 'Valeurs de démonstration restaurées');
  recalc(); render();
  toast('Tarifs d’origine restaurés', 'ok');
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
      '<div class="card"><h3>Mode présentation</h3><p class="mut tiny">Un parcours guidé de 21 étapes, piloté au clavier. Idéal devant un client.</p>' +
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
