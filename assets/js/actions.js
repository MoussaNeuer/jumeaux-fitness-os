// ============================================================================
// Actions : fiches, création, renouvellement, paiements, QR, borne, caméra
// ============================================================================

function fiche(id) {
  const m = findMembre(id);
  if (!m) return toast('Adhérent introuvable', 'ko');
  const st = statut(m), p = PLANS[m.plan];
  const pays = D[m.home].pay.filter(x => x.m === m.id).slice(0, 3);
  openModal('<div class="row sp"><div><h3>' + esc(m.nom) + '</h3><p class="tiny mut">' + m.id + ' · ' + esc(D[m.home].nom) + '</p></div>' + bdg(st) + '</div>' +
    '<div class="fiche-top">' + qrSvg(m, 118) + '<div class="fiche-meta">' +
      '<span><small>Formule</small><b>' + p.n + ' · ' + fmt(prixMembre(m)) + '</b></span>' +
      '<span><small>Genre</small><b>' + (m.genre === 'f' ? 'Femme · ' + fmt(TARIFS.f) + '/mois' : 'Homme · ' + fmt(TARIFS.h) + '/mois') + '</b></span>' +
      '<span><small>Expiration</small><b>' + dstr(m.exp) + '</b></span>' +
      '<span><small>Temps restant</small><b class="' + (joursRestants(m) <= 7 ? 't-ko' : 't-ok') + '">' + (joursRestants(m) >= 0 ? joursRestants(m) + ' jours' : 'expiré') + '</b></span>' +
      '<span><small>Accès multi-salles</small><b>' + (m.multi ? 'Oui' : 'Non') + '</b></span>' +
    '</div></div>' +
    '<div class="f"><label>Nom complet<input id="en" value="' + esc(m.nom) + '"></label>' +
      '<label>Téléphone fictif<input id="et" value="' + esc(m.tel) + '" placeholder="7X XXX XX XX"></label>' +
      '<label>E-mail fictif<input id="em" value="' + esc(m.mail) + '" placeholder="adherent@demo.local"></label>' +
      '<label>Formule<select id="ep">' + PLANS.map((x, i) => '<option value="' + i + '"' + (i === m.plan ? ' selected' : '') + '>' + x.n + ' — ' + fmt(prixPlan(x.m, m.genre)) + (promotionPour(x.m) ? ' · promo' : '') + '</option>').join('') + '</select></label>' +
      '<label>Genre<select id="eg"><option value="h"' + (m.genre !== 'f' ? ' selected' : '') + '>Homme — ' + fmt(TARIFS.h) + '/mois</option><option value="f"' + (m.genre === 'f' ? ' selected' : '') + '>Femme — ' + fmt(TARIFS.f) + '/mois</option></select></label>' +
      '<label class="check-line"><input type="checkbox" id="emulti"' + (m.multi ? ' checked' : '') + '> Autoriser l’accès dans les autres salles</label></div>' +
    '<div class="mini-pays"><b class="tiny mut">Derniers paiements</b>' + (pays.length ? pays.map(x => '<span><b>' + dstr(x.date) + '</b><small>' + fmt(x.montant) + ' · ' + x.moyen + '</small>' + bdg(x.st) + '</span>').join('') : '<span class="tiny mut">Aucun paiement enregistré.</span>') + '</div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="saveM(\'' + m.id + '\')">' + ICON('check') + 'Enregistrer</button>' +
      '<button class="btn" onclick="closeModal();renew(\'' + m.id + '\')">' + ICON('rotate') + 'Renouveler</button>' +
      '<button class="btn" onclick="closeModal();showQr(\'' + m.id + '\')">' + ICON('qrcode') + 'QR</button></div>',
    { title: 'Fiche de ' + m.nom });
}

function saveM(id) {
  const m = findMembre(id);
  if (!m) return;
  m.nom = ($('en').value || m.nom).trim();
  m.tel = $('et').value.trim();
  m.mail = $('em').value.trim();
  m.plan = +$('ep').value;
  m.genre = $('eg').value;
  m.multi = $('emulti').checked;
  recalc();
  closeModal(); render();
  toast('Fiche mise à jour localement', 'ok');
}

function showQr(id) {
  const m = findMembre(id);
  if (!m) return;
  const link = checkinUrl(m, m.home);
  openModal('<div style="text-align:center"><h3>Carte numérique</h3><p class="tiny mut">' + esc(m.nom) + ' · ' + m.id + '</p>' +
    '<div class="qr-stage">' + qrSvg(m, 240) + '</div>' +
    '<p class="tiny mut" style="margin:10px 0">QR de démonstration. Scannez-le avec un téléphone pour ouvrir la borne d’accès.</p>' +
    '<div class="row gap8 center"><button class="btn p" onclick="closeModal();goCheckin(\'' + m.id + '\',\'' + m.home + '\')">' + ICON('door-open') + 'Ouvrir la borne</button>' +
    '<button class="btn" onclick="copyText(\'' + link + '\')">' + ICON('link') + 'Copier le lien</button>' +
    '<button class="btn icon" aria-label="Fermer" onclick="closeModal()">' + ICON('xmark') + '</button></div></div>', { title: 'QR — ' + m.nom });
}

function copyText(t) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(t).then(() => toast('Lien copié', 'ok'), () => toast('Copie impossible dans ce navigateur', 'ko'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('Lien copié', 'ok'); } catch (e) { toast('Copie impossible', 'ko'); }
    ta.remove();
  }
}

function addForm() {
  openModal('<h3>Nouvel adhérent</h3><p class="tiny mut">Création réelle dans les données fictives de ' + esc(D[S.salle].nom) + '.</p>' +
    '<div class="f"><label>Nom complet<input id="an" placeholder="Ex. Awa Ndiaye" autocomplete="off"></label>' +
    '<label>Téléphone fictif<input id="at" value="77 000 00 00"></label>' +
    '<label>E-mail fictif (optionnel)<input id="ae" placeholder="adherent@demo.local"></label>' +
    '<label>Genre<select id="ag"><option value="h">Homme — ' + fmt(TARIFS.h) + '/mois</option><option value="f">Femme — ' + fmt(TARIFS.f) + '/mois</option></select></label>' +
    '<label>Formule<select id="ap">' + PLANS.map((p, i) => '<option value="' + i + '"' + (i === 0 ? ' selected' : '') + '>' + planOptionText(p.m) + '</option>').join('') + '</select></label>' +
    '<label class="check-line"><input type="checkbox" id="am"> Accès multi-salles (offert avec la formule 12 mois)</label></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="addM()">' + ICON('user-plus') + 'Créer l’adhérent</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Nouvel adhérent' });
  setTimeout(() => $('an')?.focus(), 60);
}

function addM() {
  const nom = ($('an').value || '').trim();
  if (!nom) return toast('Saisissez un nom complet', 'ko');
  const d = D[S.salle], pl = +$('ap').value, genre = $('ag').value;
  const nums = d.mem.map(m => +m.id.split('-')[1]);
  const next = (Math.max(0, ...nums) + 1);
  const id = S.salle.toUpperCase() + '-' + String(next).padStart(4, '0');
  const montant = prixPlan(PLANS[pl].m, genre);
  const m = {
    id, nom, tel: $('at').value.trim(), mail: $('ae').value.trim(), plan: pl, genre,
    exp: addDays(PLANS[pl].j), debut: new Date(), susp: false, home: S.salle, multi: $('am').checked || PLANS[pl].m >= 12,
    inscription: new Date(), naissance: new Date(1995, 0, 1), agent: 'Direction',
    derniere: new Date(), autoRenew: false, renouv: [], resas: [], demande: null, demandeHist: []
  };
  d.mem.unshift(m);
  d.pay.unshift({ ref: 'REC-' + S.salle.toUpperCase() + '-' + Date.now().toString().slice(-5), m: id, montant, moyen: 'Espèces', date: new Date(), st: 'confirmé', agent: 'Direction' });
  d.act.unshift(['Nouvel adhérent enregistré', nom]);
  d.freq[6] = (d.freq[6] || 0) + 0;
  recalc(); closeModal(); render();
  toast('Adhérent créé · reçu généré (simulation)', 'ok');
}

function renew(id, opts) {
  const m = findMembre(id);
  if (!m) return;
  opts = opts || {};
  const d = D[m.home], base = m.exp > AUJ ? m.exp : AUJ;
  const moyen = opts.moyen || 'Wave';
  const st = opts.statut || 'confirmé';
  const montant = prixMembre(m);
  m.debut = new Date(+base);
  m.exp = new Date(+base + PLANS[m.plan].j * J);
  m.susp = false;
  m.renouv = m.renouv || [];
  m.renouv.unshift({ date: new Date(), plan: m.plan, montant, moyen, type: 'renouvellement' });
  if (m.demande && m.demande.type === 'renouvellement') closeDemand(m, 'acceptée', 'Renouvellement enregistré');
  d.pay.unshift({
    ref: 'REC-' + m.id + '-' + Date.now().toString().slice(-4),
    m: m.id, montant, moyen, date: new Date(), st,
    agent: opts.agent || 'Direction'
  });
  d.act.unshift(['Abonnement renouvelé', m.nom]);
  journal('Renouvellement simulé', m.nom + ' · ' + PLANS[m.plan].n + ' · ' + fmt(montant));
  recalc();
  closeModal(); render();
  toast(st === 'confirmé' ? 'Renouvellement simulé — aucun paiement réel' : 'Renouvellement déclaré, à vérifier en caisse', st === 'confirmé' ? 'ok' : 'warn');
}

function newPayment() {
  const d = D[S.salle];
  openModal('<h3>Enregistrer un paiement</h3><p class="tiny mut">Simulation : aucun débit réel ne sera effectué.</p>' +
    '<div class="f"><label>Adhérent<select id="npm">' + d.mem.map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + m.id + '</option>').join('') + '</select></label>' +
    '<label>Formule<select id="npp">' + PLANS.map((p, i) => '<option value="' + i + '">' + planOptionText(p.m) + '</option>').join('') + '</select></label>' +
    '<label>Moyen de paiement<select id="npmoy">' + MOYENS.map(x => '<option>' + x + '</option>').join('') + '</select></label>' +
    '<label>Statut<select id="npst"><option value="confirmé">Confirmé</option><option value="en attente">En attente de vérification</option></select></label>' +
    '<label class="check-line"><input type="checkbox" id="npren" checked> Prolonger l’abonnement de la durée de la formule</label></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="savePay()">' + ICON('cash-register') + 'Enregistrer</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Nouveau paiement' });
}

function savePay() {
  const d = D[S.salle], m = findMembre($('npm').value), pl = +$('npp').value;
  if (!m) return;
  const st = $('npst').value, moyen = $('npmoy').value;
  const montant = prixPlan(PLANS[pl].m, m.genre);
  d.pay.unshift({ ref: 'REC-' + S.salle.toUpperCase() + '-' + Date.now().toString().slice(-5), m: m.id, montant, moyen, date: new Date(), st, agent: 'Direction' });
  if ($('npren').checked) {
    m.plan = pl;
    m.exp = new Date(+Math.max(+AUJ, +m.exp) + PLANS[pl].j * J);
    m.susp = false;
    m.multi = m.multi || PLANS[pl].m >= 12;
  }
  d.act.unshift(['Paiement ' + st, m.nom]);
  journal('Paiement enregistré', fmt(montant) + ' · ' + moyen + ' · ' + st);
  recalc(); closeModal(); render();
  toast(st === 'confirmé' ? 'Paiement enregistré (simulation)' : 'Paiement placé en vérification', st === 'confirmé' ? 'ok' : 'warn');
}

function receipt(i) {
  const p = D[S.salle].pay[i];
  if (!p) return;
  receiptRef(p.ref);
}
function receiptRef(ref) {
  let p = null, site = null;
  for (const id of ALL_IDS) {
    const x = D[id].pay.find(y => y.ref === ref);
    if (x) { p = x; site = id; break; }
  }
  if (!p) return;
  const m = findMembre(p.m);
  openModal('<div class="receipt" id="receipt"><div class="receipt-head"><div class="brand small">' + logoChip('sm') + '</div><span class="badge b-off">Reçu de démonstration</span></div>' +
    '<h3>Reçu ' + p.ref + '</h3><p class="tiny mut">Jumeaux Fitness — ' + esc(D[site].nom) + ' · ' + dstr(p.date) + '</p>' +
    '<div class="receipt-lines"><div><span>Adhérent</span><b>' + esc(m.nom) + '</b></div><div><span>Formule</span><b>' + PLANS[m.plan].n + '</b></div><div><span>Moyen</span><b>' + p.moyen + '</b></div><div><span>Statut</span><b>' + p.st + '</b></div></div>' +
    '<div class="receipt-total"><span>Total</span><b>' + fmt(p.montant) + '</b></div>' +
    '<p class="tiny mut">Document fictif sans valeur comptable. Aucun paiement réel n’a été effectué.</p></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="window.print()">' + ICON('print') + 'Imprimer</button><button class="btn" onclick="downloadReceipt(\'' + p.ref + '\')">' + ICON('download') + 'Télécharger</button><button class="btn" onclick="exportCSV(\'paiements\')">' + ICON('file-csv') + 'CSV</button><button class="btn" onclick="closeModal()">Fermer</button></div>',
    { title: 'Reçu ' + p.ref });
}

function downloadReceipt(ref) {
  const f = findPayment(ref);
  if (!f) return;
  const p = f.pay, m = findMembre(p.m);
  const html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Reçu ' + esc(p.ref) + '</title>' +
    '<style>body{font-family:Arial,sans-serif;color:#111;max-width:640px;margin:40px auto;padding:24px;border:1px solid #ddd}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin:18px 0}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left;font-size:14px}.total{font-size:20px;font-weight:bold;text-align:right}.mut{color:#666;font-size:12px}</style></head><body>' +
    '<h1>Jumeaux Fitness OS — Reçu de démonstration</h1>' +
    '<p class="mut">Document fictif sans valeur comptable. Aucun paiement réel n’a été effectué.</p>' +
    '<table><tr><th>Référence</th><td>' + esc(p.ref) + '</td></tr><tr><th>Salle</th><td>' + esc(siteName(f.site)) + '</td></tr>' +
    '<tr><th>Adhérent</th><td>' + esc(m ? m.nom : p.m) + '</td></tr><tr><th>Formule</th><td>' + (m ? PLANS[m.plan].n : '—') + '</td></tr>' +
    '<tr><th>Date</th><td>' + dstr(p.date) + ' · ' + hhmm(p.date) + '</td></tr><tr><th>Moyen</th><td>' + esc(p.moyen) + '</td></tr>' +
    '<tr><th>Statut</th><td>' + esc(p.st) + '</td></tr></table><p class="total">Total : ' + fmt(p.montant) + '</p>' +
    '<p class="mut">Émis dans le navigateur le ' + dstr(new Date()) + ' — Jumeaux Fitness OS, démonstration locale.</p></body></html>';
  downloadFile('recu-' + ref + '.html', html, 'text/html;charset=utf-8');
  toast('Reçu téléchargé au format HTML', 'ok');
}

// ---------------------------------------------------------------- SCANNER
function scanResultHTML(r, m, meta) {
  const tone = r.tone;
  return '<div class="scan-result ' + tone + '"><span class="scan-result-ic">' + ICON(tone === 'ok' ? 'circle-check' : tone === 'warn' ? 'triangle-exclamation' : 'circle-xmark') + '</span>' +
    '<div><small>' + (tone === 'ok' ? 'Contrôle validé' : 'Contrôle refusé') + '</small><b>' + esc(r.title) + '</b><p>' + esc(r.msg) + '</p></div>' +
    '<time>' + hhmm(new Date()) + '</time></div>' +
    (m ? '<div class="scan-member">' + avatar(m.nom) + '<span><b>' + esc(m.nom) + '</b><small>' + m.id + ' · ' + PLANS[m.plan].n + ' · expire le ' + dstr(m.exp) + '</small></span>' + bdg(statut(m)) + '</div>' : '') +
    '<div class="row gap6" style="margin-top:10px">' + (m ? '<button class="btn s" onclick="fiche(\'' + m.id + '\')">Voir la fiche</button><button class="btn s" onclick="showQr(\'' + m.id + '\')">QR</button>' : '') + '<span class="tiny mut">' + esc(meta || '') + '</span></div>';
}

function scan(target) {
  const sel = $(target === 'kiosk' ? 'ksm' : 'sm');
  const site = $(target === 'kiosk' ? 'ksc' : 'sc');
  const scen = $(target === 'kiosk' ? 'kss' : 'ss');
  if (!sel) return;
  const id = sel.value, salleId = site ? site.value : S.salle;
  const m = findMembre(id);
  let r;
  if (scen && scen.value === 'inv') r = { tone: 'ko', code: 'invalide', title: 'QR non reconnu', msg: 'Ce code ne correspond à aucun adhérent.', m: null };
  else r = checkAccess(id, salleId);
  const box = target === 'kiosk' ? $('ksr') : $('sr');
  if (box) box.innerHTML = scanResultHTML(r, r.m, 'Contrôle à ' + D[salleId].nom);
  // Enregistrement local du passage
  if (r.m) {
    D[salleId].pre.push({ at: new Date(), m: r.m.id, ok: r.tone === 'ok', type: 'QR' });
    if (r.tone === 'ok') D[salleId].freq[6] = (D[salleId].freq[6] || 0) + 1;
    recalc();
  }
  const tone = r.tone === 'ok' ? 'ok' : r.tone === 'warn' ? 'warn' : 'ko';
  toast(r.title, tone);
}

function openScanner() {
  openModal('<h3>Borne de contrôle</h3><p class="tiny mut">Simulation plein écran — choisissez un adhérent ou scannez un QR réel.</p>' +
    '<div class="f"><label>Adhérent<select id="ksm">' + SALLES.map(s => '<optgroup label="' + s.nom + '">' + D[s.id].mem.slice(0, 12).map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + statut(m) + '</option>').join('') + '</optgroup>').join('') + '</select></label>' +
    '<label>Salle de contrôle<select id="ksc">' + SALLES.map(s => '<option value="' + s.id + '"' + (s.id === S.salle ? ' selected' : '') + '>' + s.nom + '</option>').join('') + '</select></label>' +
    '<label>Scénario<select id="kss"><option value="auto">Contrôle réel</option><option value="inv">QR invalide</option></select></label></div>' +
    '<button class="btn p w" style="margin-top:12px" onclick="scan(\'kiosk\')">' + ICON('qrcode') + 'Lancer le contrôle</button>' +
    '<div id="ksr" class="scan-slot" aria-live="polite"></div>', { title: 'Borne de contrôle' });
}

// ---------------------------------------------------------------- CAMÉRA
let _camStream = null, _camTimer = null, _camDetector = null;
function stopCamera() {
  clearInterval(_camTimer); _camTimer = null;
  if (_camStream) { _camStream.getTracks().forEach(t => t.stop()); _camStream = null; }
}
async function startCamera() {
  if (!('BarcodeDetector' in window)) {
    openModal('<h3>Caméra non disponible</h3><p class="mut">Ce navigateur ne fournit pas l’API de lecture de QR codes. La démonstration reste entièrement utilisable avec le sélecteur d’adhérent et le QR réel affiché dans l’espace membre.</p>' +
      '<div class="callout">' + ICON('circle-info') + ' Sur Chrome ou Android, la lecture caméra est disponible. Sur ordinateur, le sélecteur est plus rapide pour une présentation.</div>' +
      '<button class="btn w" style="margin-top:14px" onclick="closeModal()">Compris</button>', { title: 'Caméra' });
    return;
  }
  try {
    _camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch (e) {
    toast('Accès à la caméra refusé — utilisez le sélecteur', 'ko');
    return;
  }
  openModal('<h3>Scan caméra</h3><p class="tiny mut">Présentez le QR d’un adhérent devant la caméra.</p><div class="cam-wrap"><video id="cam" playsinline muted autoplay></video><span class="cam-frame"></span></div>' +
    '<p class="tiny mut" id="camMsg">Recherche d’un QR code…</p><button class="btn w" style="margin-top:10px" onclick="closeModal()">Arrêter</button>', { title: 'Scan caméra' });
  const v = $('cam');
  if (!v) return;
  v.srcObject = _camStream;
  await v.play().catch(() => {});
  _camDetector = _camDetector || new BarcodeDetector({ formats: ['qr_code'] });
  _camTimer = setInterval(async () => {
    try {
      const codes = await _camDetector.detect(v);
      if (!codes.length) return;
      const raw = codes[0].rawValue || '';
      let found = null;
      const hash = raw.includes('#') ? raw.split('#')[1] : '';
      const p = new URLSearchParams(hash);
      if (p.get('checkin')) found = decodeURIComponent(p.get('checkin'));
      if (!found) { const mm = raw.match(/([A-Z]{2}-\d{3,4})/i); if (mm) found = mm[1].toUpperCase(); }
      const m = findMembre(found);
      if (!m) { const msg = $('camMsg'); if (msg) msg.textContent = 'QR lu, mais adhérent inconnu. Réessayez.'; return; }
      stopCamera(); closeModal();
      const direct = $('sm');
      if (direct) {
        direct.value = m.id;
        const site = $('sc');
        if (site) site.value = S.salle;
        scan();
      } else {
        // La caméra remplace le sélecteur : on rouvre la borne avec
        // l’adhérent reconnu déjà choisi, puis on lance le contrôle.
        openScanner();
        const sel = $('ksm'), site = $('ksc');
        if (sel) {
          sel.value = m.id;
          if (site) site.value = S.salle;
          scan('kiosk');
        } else toast('QR reconnu : ' + m.nom + ' — ouvrez le back-office', 'ok');
      }
    } catch (e) {}
  }, 450);
}
window._stopCam = stopCamera;

// ---------------------------------------------------------------- BORNE / CHECK-IN
function goCheckin(id, salle) {
  location.hash = 'checkin=' + encodeURIComponent(id) + '&salle=' + encodeURIComponent(salle || S.salle);
}
function parseCheckin() {
  const raw = location.hash.replace(/^#/, '');
  if (!raw.startsWith('checkin=')) return null;
  const p = new URLSearchParams(raw);
  return { id: p.get('checkin') || '', salle: p.get('salle') || '' };
}
function viewCheckin() {
  const q = parseCheckin();
  if (!q) return landing();
  const m = findMembre(q.id);
  const salleId = q.salle && D[q.salle] ? q.salle : (m ? m.home : 'km');
  const r = checkAccess(q.id, salleId);
  const tone = r.tone;
  const site = D[salleId];
  return '<div class="borne ' + tone + '">' +
    '<header class="borne-head"><div class="brand">' + logoChip() + '</div>' +
      '<span class="borne-site">' + ICON('location-dot') + esc(site.nom) + '</span><time id="liveClock">' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '</time></header>' +
    '<main class="borne-main">' +
      '<div class="borne-icon">' + ICON(tone === 'ok' ? 'circle-check' : tone === 'warn' ? 'triangle-exclamation' : 'circle-xmark') + '</div>' +
      '<span class="borne-kicker">' + (tone === 'ok' ? 'Bienvenue' : 'Contrôle refusé') + '</span>' +
      '<h1>' + esc(r.title) + '</h1>' +
      '<p class="borne-msg">' + esc(r.msg) + '</p>' +
      (m ? '<div class="borne-card">' + avatar(m.nom) + '<div><b>' + esc(m.nom) + '</b><small>' + m.id + ' · ' + PLANS[m.plan].n + ' · ' + dstr(m.exp) + '</small></div>' + bdg(statut(m)) + '</div>' : '') +
      (tone !== 'ok' && m ? '<button class="btn p lg" onclick="renewFromBorne(\'' + m.id + '\')">' + ICON('rotate') + 'Proposer un renouvellement</button>' : '') +
      '<div class="borne-foot"><span>' + ICON('flask') + ' Borne de démonstration — données fictives</span>' +
      '<button class="btn s" onclick="closeBorne()">' + ICON('arrow-left') + 'Retour à la plateforme</button></div>' +
    '</main>' +
    '<div class="borne-scanline" aria-hidden="true"></div></div>';
}
function closeBorne() {
  history.replaceState(null, '', location.pathname + location.search);
  go({ view: 'land' });
}
function renewFromBorne(id) {
  const m = findMembre(id);
  if (!m) return;
  history.replaceState(null, '', location.pathname + location.search);
  S.view = 'salle'; S.salle = m.home; S.tab = 'mem'; S.q = m.id; S.page = 0;
  renew(id);
}

// ---------------------------------------------------------------- ABONNEMENTS
function closeDemand(m, statut, note) {
  if (!m.demande) return;
  m.demandeHist = m.demandeHist || [];
  m.demandeHist.unshift(Object.assign({}, m.demande, { statut, traite: new Date(), note: note || '' }));
  m.demande = null;
}

function treatDemand(id, accept) {
  const m = findMembre(id);
  if (!m || !m.demande) return;
  const dm = m.demande;
  if (!accept) {
    closeDemand(m, 'refusée');
    journal('Demande refusée', m.nom + ' · ' + (dm.type === 'changement' ? 'changement de formule' : 'renouvellement'));
    recalc(); render(); toast('Demande refusée (simulation)', 'warn');
    return;
  }
  if (dm.type === 'changement') {
    m.plan = dm.plan;
    closeDemand(m, 'acceptée');
    journal(dm.promo ? 'Offre promotionnelle acceptée' : 'Changement de formule accepté', m.nom + ' · ' + PLANS[m.plan].n);
    if (dm.promo) { renew(id, { agent: 'Direction' }); return; }
    recalc(); render(); toast('Formule mise à jour', 'ok');
  } else {
    closeDemand(m, 'acceptée');
    renew(id, { agent: 'Direction' });
  }
}

function toggleSusp(id) {
  const m = findMembre(id);
  if (!m) return;
  m.susp = !m.susp;
  journal(m.susp ? 'Abonnement suspendu' : 'Abonnement réactivé', m.nom + ' · ' + siteName(m.home));
  recalc(); render();
  toast(m.susp ? 'Abonnement suspendu temporairement' : 'Abonnement réactivé', m.susp ? 'warn' : 'ok');
}

function toggleAutoRenew(id) {
  const m = findMembre(id);
  if (!m) return;
  m.autoRenew = !m.autoRenew;
  journal('Renouvellement automatique ' + (m.autoRenew ? 'activé' : 'désactivé'), m.nom + ' · ' + siteName(m.home));
  recalc(); render();
  toast('Renouvellement automatique ' + (m.autoRenew ? 'activé' : 'désactivé') + ' (simulation)', m.autoRenew ? 'ok' : 'warn');
}

function openHistory(id) {
  const m = findMembre(id);
  if (!m) return;
  const rows = (m.renouv || []).slice().sort((a, b) => b.date - a.date);
  const dem = (m.demandeHist || []).slice();
  openModal('<div class="row sp"><div><h3>Historique de ' + esc(m.nom) + '</h3><p class="tiny mut">' + m.id + ' · ' + siteName(m.home) + '</p></div>' + bdg(statut(m)) + '</div>' +
    '<div class="recon-grid"><span><small>Formule</small><b>' + PLANS[m.plan].n + '</b></span><span><small>Début</small><b>' + dstr(m.debut || m.inscription) + '</b></span><span><small>Échéance</small><b>' + dstr(m.exp) + '</b></span><span><small>Auto</small><b>' + (m.autoRenew ? 'Activé' : 'Désactivé') + '</b></span></div>' +
    '<div class="chart-h" style="margin-top:14px"><h3>Renouvellements & changements</h3><span class="badge b-off">' + rows.length + '</span></div>' +
    (rows.length ? rows.slice(0, 10).map(r => '<div class="act"><span class="act-ic ' + (r.type === 'changement' ? '' : 'ok') + '">' + ICON(r.type === 'changement' ? 'shuffle' : 'rotate') + '</span><span><b>' + (r.type === 'changement' ? 'Changement de formule' : 'Renouvellement') + ' · ' + PLANS[r.plan].n + '</b><small>' + dstr(r.date) + (r.montant ? ' · ' + fmt(r.montant) : '') + ' · ' + esc(r.moyen || '—') + '</small></span><span class="badge b-ok">' + esc(r.type || 'renouvellement') + '</span></div>').join('') : '<p class="tiny mut">Aucun renouvellement enregistré.</p>') +
    (dem.length ? '<div class="chart-h" style="margin-top:14px"><h3>Demandes traitées</h3></div>' + dem.slice(0, 5).map(x => '<div class="act"><span class="act-ic">' + ICON(x.statut === 'acceptée' ? 'check' : 'xmark') + '</span><span><b>' + (x.type === 'changement' ? 'Changement de formule' : 'Renouvellement') + '</b><small>' + dstr(x.traite || x.at) + ' · ' + x.statut + '</small></span></div>').join('') : '') +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="closeModal();renew(\'' + m.id + '\')">' + ICON('rotate') + 'Renouveler</button><button class="btn" onclick="closeModal();openPlan(\'' + m.id + '\')">' + ICON('shuffle') + 'Changer de formule</button><button class="btn" onclick="closeModal()">Fermer</button></div>',
    { title: 'Historique — ' + m.nom });
}

function openPlan(id) {
  const m = findMembre(id);
  if (!m) return;
  openModal('<h3>Changer la formule</h3><p class="tiny mut">' + esc(m.nom) + ' · ' + m.id + ' · formule actuelle : ' + PLANS[m.plan].n + '</p>' +
    '<div class="f"><label>Nouvelle formule<select id="chgPlan">' + PLANS.map((p, i) => '<option value="' + i + '"' + (i === m.plan ? ' selected' : '') + '>' + planOptionText(p.m) + '</option>').join('') + '</select></label>' +
    '<label class="check-line"><input type="checkbox" id="chgHist" checked> Enregistrer le changement dans l’historique</label></div>' +
    '<div class="fin-note">' + ICON('circle-info') + '<span>La date d’échéance reste inchangée. Le changement est simulé et ne déclenche aucun paiement.</span></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="savePlan(\'' + m.id + '\')">' + ICON('check') + 'Appliquer</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Changer la formule' });
}

function savePlan(id) {
  const m = findMembre(id);
  if (!m) return;
  const next = +$('chgPlan').value;
  const prev = m.plan;
  if (next === prev) { closeModal(); return toast('Formule inchangée', 'warn'); }
  m.plan = next;
  m.multi = PLANS[next].m >= 12 || m.multi;
  if ($('chgHist') && $('chgHist').checked) {
    m.renouv = m.renouv || [];
    m.renouv.unshift({ date: new Date(), plan: next, montant: 0, moyen: '—', type: 'changement' });
  }
  journal('Formule modifiée', m.nom + ' · ' + PLANS[prev].n + ' → ' + PLANS[next].n);
  recalc(); closeModal(); render();
  toast('Formule changée en ' + PLANS[next].n, 'ok');
}

// ---------------------------------------------------------------- FINANCE
function newPaymentFin() {
  const defSite = S.role === 'compta' ? S.rsite : (S.finSite && S.finSite !== 'net' ? S.finSite : S.salle);
  const sites = S.role === 'compta' ? SALLES.filter(s => s.id === S.rsite) : SALLES;
  openModal('<h3>Encaisser un paiement</h3><p class="tiny mut">Écriture fictive ajoutée au journal de la session. Aucun débit réel.</p>' +
    '<div class="f"><label>Salle<select id="fps" onchange="finPayMembers()">' + sites.map(s => '<option value="' + s.id + '"' + (s.id === defSite ? ' selected' : '') + '>' + s.nom + '</option>').join('') + '</select></label>' +
    '<label>Adhérent<select id="fpm">' + D[defSite].mem.map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + m.id + '</option>').join('') + '</select></label>' +
    '<label>Formule<select id="fpp">' + PLANS.map((p, i) => '<option value="' + i + '">' + planOptionText(p.m) + '</option>').join('') + '</select></label>' +
    '<label>Moyen de paiement<select id="fpmoy">' + MOYENS.map(x => '<option>' + x + '</option>').join('') + '</select></label>' +
    '<label>Statut<select id="fpst"><option value="confirmé">Confirmé — encaissé</option><option value="déclaré">Déclaré — à vérifier</option><option value="en attente">En attente — non réglé</option></select></label>' +
    '<label class="check-line"><input type="checkbox" id="fppr"> Prolonger l’abonnement de la durée de la formule</label></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="savePayFin()">' + ICON('cash-register') + 'Enregistrer</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Nouvel encaissement' });
}

function finPayMembers() {
  const sel = $('fps'), target = $('fpm');
  if (!sel || !target) return;
  if (S.role === 'compta') sel.value = S.rsite;
  target.innerHTML = D[sel.value].mem.map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + m.id + '</option>').join('');
}

function savePayFin() {
  const site = $('fps').value, m = findMembre($('fpm').value), pl = +$('fpp').value;
  if (!canAccessFinanceSite(site)) return toast('Accès refusé à cette salle', 'ko');
  if (!m) return;
  const st = $('fpst').value, moyen = $('fpmoy').value, d = D[site];
  const montant = prixPlan(PLANS[pl].m, m.genre);
  d.pay.unshift({ ref: 'REC-' + site.toUpperCase() + '-' + Date.now().toString().slice(-5), m: m.id, montant, moyen, date: new Date(), st, agent: 'Direction' });
  if ($('fppr').checked) {
    m.plan = pl;
    m.exp = new Date(+Math.max(+AUJ, +m.exp) + PLANS[pl].j * J);
    m.susp = false;
    m.multi = m.multi || PLANS[pl].m >= 12;
    m.renouv = m.renouv || [];
    m.renouv.unshift({ date: new Date(), plan: pl, montant, moyen, type: 'renouvellement' });
  }
  d.act.unshift(['Paiement ' + st, m.nom]);
  journal('Encaissement ' + st, fmt(montant) + ' · ' + moyen + ' · ' + siteName(site));
  recalc(); closeModal(); render();
  toast(st === 'confirmé' ? 'Paiement encaissé (simulation)' : 'Paiement placé en ' + payMeta(st).n.toLowerCase(), st === 'confirmé' ? 'ok' : 'warn');
}

function openReconcile(ref) {
  const f = findPayment(ref);
  if (!f) return toast('Opération introuvable', 'ko');
  const p = f.pay, m = findMembre(p.m) || { nom: p.m, id: p.m };
  openModal('<div class="row sp"><div><h3>Rapprocher ' + p.ref + '</h3><p class="tiny mut">' + esc(m.nom) + ' · ' + esc(siteName(f.site)) + '</p></div>' + bdg(p.st) + '</div>' +
    '<div class="recon-grid"><span><small>Montant</small><b>' + fmt(p.montant) + '</b></span><span><small>Moyen</small><b>' + esc(p.moyen) + '</b></span><span><small>Date</small><b>' + dstr(p.date) + ' · ' + hhmm(p.date) + '</b></span><span><small>Enregistré par</small><b>' + esc(p.agent || '—') + '</b></span></div>' +
    '<div class="fin-note ' + (p.st === 'déclaré' ? 'warn' : '') + '">' + ICON(p.st === 'déclaré' ? 'clock-rotate-left' : 'hourglass-half') + '<span>' +
      (p.st === 'déclaré' ? '<b>Déclaré par l’adhérent.</b> Vérifiez le reçu Wave / Orange Money ou l’espèce en caisse avant de confirmer.' : '<b>En attente de règlement.</b> Confirmez uniquement si l’argent a été reçu, sinon annulez l’écriture.') + '</span></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="reconcilePay(\'' + p.ref + '\',\'confirmer\')">' + ICON('circle-check') + 'Confirmer l’encaissement</button>' +
    '<button class="btn danger" onclick="reconcilePay(\'' + p.ref + '\',\'annuler\')">' + ICON('ban') + 'Annuler</button>' +
    '<button class="btn" onclick="closeModal()">Fermer</button></div>' +
    '<p class="tiny mut" style="margin-top:10px">' + ICON('lock') + ' Le rapprochement est local à cette démonstration et ne touche aucun compte réel.</p>',
    { title: 'Rapprochement ' + p.ref });
}

function reconcilePay(ref, action) {
  const f = findPayment(ref);
  if (!f) return;
  if (!canAccessFinanceSite(f.site)) return toast('Accès refusé à cette salle', 'ko');
  const st = action === 'confirmer' ? 'confirmé' : 'annulé';
  paymentStatus(ref, st);
  const p = f.pay;
  journal('Paiement ' + (action === 'confirmer' ? 'confirmé' : 'annulé'), p.ref + ' · ' + fmt(p.montant) + ' · ' + siteName(f.site));
  closeModal(); render();
  toast(action === 'confirmer' ? 'Paiement confirmé et ajouté à la caisse' : 'Paiement annulé', action === 'confirmer' ? 'ok' : 'warn');
}

function openExpense() {
  const site = S.finSite && S.finSite !== 'net' ? S.finSite : S.salle;
  const sites = S.role === 'compta' ? SALLES.filter(s => s.id === S.rsite) : SALLES;
  openModal('<h3>Ajouter une dépense</h3><p class="tiny mut">Écriture fictive. Elle ajuste les charges de la salle dans cette session.</p>' +
    '<div class="f"><label>Salle<select id="exs">' + sites.map(s => '<option value="' + s.id + '"' + (s.id === site ? ' selected' : '') + '>' + s.nom + '</option>').join('') + '</select></label>' +
    '<label>Catégorie<select id="exc">' + CHARGE_CATS.map(c => '<option value="' + c.id + '">' + c.n + ' — ' + (c.type === 'fixe' ? 'fixe' : 'variable') + '</option>').join('') + '</select></label>' +
    '<label>Libellé<input id="exl" placeholder="Ex. Réparation tapis de course"></label>' +
    '<label>Montant (FCFA)<input id="exa" type="number" min="0" step="500" value="25000"></label>' +
    '<label>Date<input id="exd" type="date" value="' + new Date().toISOString().slice(0, 10) + '"></label>' +
    '<label>Moyen<select id="exm">' + MOYENS.map(x => '<option>' + x + '</option>').join('') + '</select></label>' +
    '<label class="check-line"><input type="checkbox" id="exr"> Dépense récurrente (information)</label></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="saveExpenseNow()">' + ICON('check') + 'Enregistrer</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Nouvelle dépense' });
}

function saveExpenseNow() {
  const site = $('exs').value, amount = Number($('exa').value);
  if (!canAccessFinanceSite(site)) return toast('Accès refusé à cette salle', 'ko');
  if (!amount || amount <= 0) return toast('Saisissez un montant valide', 'ko');
  const row = addExpense(site, {
    catId: $('exc').value, label: ($('exl').value || '').trim(), amount,
    date: $('exd').value || new Date(), moyen: $('exm').value,
    recurrent: $('exr').checked
  });
  if (!row) return;
  journal('Dépense enregistrée', row.label + ' · ' + fmt(row.amount) + ' · ' + siteName(site));
  closeModal();
  go({ view: 'fin', finSite: site, finTab: 'charges' });
  toast('Dépense ajoutée (simulation)', 'ok');
}

function delExpense(site, id) {
  const d = D[site];
  const row = d && d.dep.find(x => x.id === id);
  if (!row) return;
  openModal('<h3>Supprimer cette dépense ?</h3><p class="mut">' + esc(row.label) + ' · ' + fmt(row.amount) + ' · ' + esc(siteName(site)) + '</p>' +
    '<div class="fin-note warn">' + ICON('triangle-exclamation') + '<span>La suppression est immédiate dans les données fictives de cette session. Elle ne modifie aucune comptabilité réelle.</span></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn danger" onclick="removeExpenseNow(\'' + site + '\',\'' + id + '\')">' + ICON('trash') + 'Supprimer</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Supprimer une dépense' });
}

function removeExpenseNow(site, id) {
  const d = D[site], row = d && d.dep.find(x => x.id === id);
  if (!row) return;
  removeExpense(site, id);
  journal('Dépense supprimée', row.label + ' · ' + fmt(row.amount) + ' · ' + siteName(site));
  closeModal(); render();
  toast('Dépense supprimée (simulation)', 'ok');
}

function openCaisse(id) {
  const d = D[id], cash = cashToday(id), decl = declaredToday(id);
  if (!d) return;
  const fond = d.caisseFond || 50000;
  const theo = fond + cash.total;
  openModal('<div class="row sp"><div><h3>Clôture de caisse</h3><p class="tiny mut">' + esc(d.nom) + ' · ' + dayLabel(AUJ) + '</p></div><span class="badge ' + (d.caisseClose ? 'b-ok' : 'b-warn') + '">' + (d.caisseClose ? 'déjà clôturée' : 'ouverte') + '</span></div>' +
    '<div class="cash-recon"><div><small>Fond de caisse</small><b>' + fmt(fond) + '</b></div><div><small>Encaissements confirmés</small><b>' + fmt(cash.total) + '</b></div><div><small>Théorique en caisse</small><b>' + fmt(theo) + '</b></div></div>' +
    (decl.length ? '<div class="fin-note warn">' + ICON('clock-rotate-left') + '<span>' + decl.length + ' déclaration(s) à vérifier · ' + fmt(decl.reduce((a, p) => a + p.montant, 0)) + '. Elles ne sont pas comptées dans le théorique.</span></div>' : '') +
    '<div class="f"><label>Montant réellement compté (FCFA)<input id="caisseCount" type="number" min="0" step="500" value="' + theo + '"></label>' +
    '<label>Note de clôture<input id="caisseNote" placeholder="Ex. écart lié à un fond de caisse"></label></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="closeCaisseNow(\'' + id + '\')">' + ICON('cash-register') + 'Enregistrer la clôture</button><button class="btn" onclick="closeModal()">Annuler</button></div>' +
    '<p class="tiny mut" style="margin-top:10px">' + ICON('circle-info') + ' Un écart est enregistré dans le journal. Aucun mouvement d’argent réel.</p>',
    { title: 'Clôture — ' + d.nom });
}

function closeCaisseNow(id) {
  const d = D[id];
  if (!d) return;
  const fond = d.caisseFond || 50000;
  const cash = cashToday(id);
  const theo = fond + cash.total;
  const compte = Number($('caisseCount').value);
  if (isNaN(compte) || compte < 0) return toast('Saisissez un montant compté valide', 'ko');
  d.caisseClose = { at: new Date(), compte, ecart: compte - theo, note: ($('caisseNote').value || '').trim() };
  journal('Clôture de caisse', siteName(id) + ' · compté ' + fmt(compte) + ' · écart ' + fmt(compte - theo));
  closeModal(); render();
  toast(compte === theo ? 'Caisse clôturée, aucun écart' : 'Caisse clôturée avec un écart de ' + fmt(compte - theo), compte === theo ? 'ok' : 'warn');
}

function openFinReport() {
  const site = S.role === 'compta' ? S.rsite : (S.finSite || 'net'), isNet = site === 'net';
  const f = isNet ? finNet() : finSite(site);
  const label = isNet ? 'Tout le réseau' : siteName(site);
  const rows = isNet ? finNet().rows : [finSite(site)];
  openModal('<div class="fin-report" id="finReport"><div class="fin-report-head"><div><span class="eyebrow">Jumeaux Fitness OS</span><h2 class="serif">Rapport financier</h2><p class="tiny mut">' + esc(label) + ' · ' + dayLabel(AUJ) + ' · document de démonstration</p></div><span class="badge b-off">Simulation</span></div>' +
    '<div class="recon-grid"><span><small>CA du mois</small><b>' + fmt(f.rev) + '</b></span><span><small>Charges</small><b>' + fmt(f.chg) + '</b></span><span><small>Résultat estimé</small><b>' + fmt(f.profit) + '</b></span><span><small>Marge</small><b>' + f.marge + ' %</b></span></div>' +
    '<table class="report-table"><thead><tr><th>Salle</th><th>CA</th><th>Charges</th><th>Résultat</th><th>Encaissé 30 j</th><th>Impayés</th></tr></thead><tbody>' +
      rows.map(x => '<tr><td>' + esc(x.nom || x.site.nom) + '</td><td>' + fmt(x.rev) + '</td><td>' + fmt(x.chg) + '</td><td>' + fmt(x.profit) + '</td><td>' + fmt(x.encaisse) + '</td><td>' + fmt(x.impayes) + '</td></tr>').join('') +
      '<tr class="rep-total"><td><b>Total</b></td><td><b>' + fmt(f.rev) + '</b></td><td><b>' + fmt(f.chg) + '</b></td><td><b>' + fmt(f.profit) + '</b></td><td><b>' + fmt(f.encaisse) + '</b></td><td><b>' + fmt(f.impayes) + '</b></td></tr>' +
    '</tbody></table>' +
    '<div class="fin-report-foot"><span>Statuts : confirmé = encaissé, déclaré = à vérifier, en attente = non réglé.</span><span>Montants en FCFA · hypothèses fictives</span></div>' +
    '<p class="tiny mut">Aucun gain financier n’est garanti. Ce rapport doit être confronté aux vrais chiffres Jumeaux Fitness avant toute décision.</p></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="window.print()">' + ICON('print') + 'Imprimer / PDF</button><button class="btn" onclick="exportFin(\'synthese\')">' + ICON('file-excel') + 'Excel</button><button class="btn" onclick="closeModal()">Fermer</button></div>',
    { title: 'Rapport financier' });
}

function exportFin(kind) {
  const site = S.role === 'compta' ? S.rsite : (S.finSite || 'net'), isNet = site === 'net';
  const f = isNet ? finNet() : finSite(site);
  const label = isNet ? 'reseau' : site;
  let title = '', headers = [], rows = [];
  if (kind === 'journal') {
    title = 'Journal des encaissements';
    headers = ['Date', 'Heure', 'Référence', 'Salle', 'Adhérent', 'Montant FCFA', 'Moyen', 'Statut'];
    rows = finPayRows(site).map(p => [dstr(p.date), hhmm(p.date), p.ref, siteName(p.site), (findMembre(p.m) || {}).nom || p.m, p.montant, p.moyen, p.st]);
  } else if (kind === 'charges') {
    title = 'Charges et dépenses';
    headers = ['Date', 'Salle', 'Libellé', 'Catégorie', 'Type', 'Moyen', 'Montant FCFA'];
    rows = finDepRows(site).map(x => [dstr(x.date), siteName(x.site), x.label, (CHARGE_META[x.catId] || {}).n || x.catId, x.cat, x.moyen, x.amount]);
  } else if (kind === 'caisse') {
    title = 'Caisse du jour';
    headers = ['Salle', 'Heure', 'Référence', 'Adhérent', 'Montant FCFA', 'Moyen', 'Statut'];
    rows = (isNet ? ALL : [site]).flatMap(id => D[id].pay.filter(p => sameDay(p.date, AUJ)).map(p => [siteName(id), hhmm(p.date), p.ref, (findMembre(p.m) || {}).nom || p.m, p.montant, p.moyen, p.st]));
  } else if (kind === 'mensuel') {
    title = 'Synthèse mensuelle';
    headers = ['Mois', 'CA FCFA', 'Charges FCFA', 'Résultat FCFA', 'Marge %'];
    rows = MOIS.map((m, i) => {
      const rev = isNet ? addv('rev')[i] : D[site].rev[i];
      const chg = isNet ? addv('chg')[i] : D[site].chg[i];
      return [m, rev, chg, rev - chg, rev ? Math.round((rev - chg) / rev * 100) : 0];
    });
  } else {
    title = 'Synthèse financière — ' + (isNet ? 'réseau' : siteName(site));
    headers = ['Salle', 'CA', 'Charges', 'Résultat', 'Marge %', 'Encaissé 30 j', 'Déclaré', 'En attente', 'Impayés', 'Recouvrement %'];
    rows = (isNet ? f.rows : [finSite(site)]).map(x => [isNet ? x.nom : siteName(site), x.rev, x.chg, x.profit, x.marge, x.encaisse, x.declares, x.attente, x.impayes, x.recouvrement]);
  }
  downloadFile('jumeaux-finance-' + label + '-' + kind + '-' + new Date().toISOString().slice(0, 10) + '.xls', tableHTML(title, headers, rows), 'application/vnd.ms-excel;charset=utf-8');
  toast('Export Excel généré dans votre navigateur', 'ok');
}
