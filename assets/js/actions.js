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
      '<span><small>Formule</small><b>' + p.n + ' · ' + fmt(p.p) + '</b></span>' +
      '<span><small>Expiration</small><b>' + dstr(m.exp) + '</b></span>' +
      '<span><small>Temps restant</small><b class="' + (joursRestants(m) <= 7 ? 't-ko' : 't-ok') + '">' + (joursRestants(m) >= 0 ? joursRestants(m) + ' jours' : 'expiré') + '</b></span>' +
      '<span><small>Accès multi-salles</small><b>' + (m.multi ? 'Oui' : 'Non') + '</b></span>' +
    '</div></div>' +
    '<div class="f"><label>Nom complet<input id="en" value="' + esc(m.nom) + '"></label>' +
      '<label>Téléphone fictif<input id="et" value="' + esc(m.tel) + '" placeholder="7X XXX XX XX"></label>' +
      '<label>E-mail fictif<input id="em" value="' + esc(m.mail) + '" placeholder="adherent@demo.local"></label>' +
      '<label>Formule<select id="ep">' + PLANS.map((x, i) => '<option value="' + i + '"' + (i === m.plan ? ' selected' : '') + '>' + x.n + ' — ' + fmt(x.p) + '</option>').join('') + '</select></label>' +
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
    '<label>Formule<select id="ap">' + PLANS.map((p, i) => '<option value="' + i + '"' + (i === 1 ? ' selected' : '') + '>' + p.n + ' — ' + fmt(p.p) + ' (' + p.j + ' jours)</option>').join('') + '</select></label>' +
    '<label class="check-line"><input type="checkbox" id="am" checked> Accès multi-salles (formule annuelle incluse)</label></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="addM()">' + ICON('user-plus') + 'Créer l’adhérent</button><button class="btn" onclick="closeModal()">Annuler</button></div>',
    { title: 'Nouvel adhérent' });
  setTimeout(() => $('an')?.focus(), 60);
}

function addM() {
  const nom = ($('an').value || '').trim();
  if (!nom) return toast('Saisissez un nom complet', 'ko');
  const d = D[S.salle], pl = +$('ap').value;
  const nums = d.mem.map(m => +m.id.split('-')[1]);
  const next = (Math.max(0, ...nums) + 1);
  const id = S.salle.toUpperCase() + '-' + String(next).padStart(4, '0');
  const m = {
    id, nom, tel: $('at').value.trim(), mail: $('ae').value.trim(), plan: pl,
    exp: addDays(PLANS[pl].j), susp: false, home: S.salle, multi: $('am').checked,
    inscription: new Date(), naissance: new Date(1995, 0, 1), agent: 'Direction',
    derniere: new Date()
  };
  d.mem.unshift(m);
  d.pay.unshift({ ref: 'REC-' + S.salle.toUpperCase() + '-' + Date.now().toString().slice(-5), m: id, montant: PLANS[pl].p, moyen: 'Espèces', date: new Date(), st: 'confirmé', agent: 'Direction' });
  d.act.unshift(['Nouvel adhérent enregistré', nom]);
  d.freq[6] = (d.freq[6] || 0) + 0;
  recalc(); closeModal(); render();
  toast('Adhérent créé · reçu généré (simulation)', 'ok');
}

function renew(id) {
  const m = findMembre(id);
  if (!m) return;
  const d = D[m.home], base = m.exp > AUJ ? m.exp : AUJ;
  m.exp = new Date(+base + PLANS[m.plan].j * J);
  m.susp = false;
  d.pay.unshift({
    ref: 'REC-' + m.id + '-' + Date.now().toString().slice(-4),
    m: m.id, montant: PLANS[m.plan].p, moyen: 'Wave', date: new Date(), st: 'confirmé', agent: 'Direction'
  });
  d.act.unshift(['Abonnement renouvelé', m.nom]);
  journal('Renouvellement simulé', m.nom + ' · ' + PLANS[m.plan].n);
  recalc();
  closeModal(); render();
  toast('Renouvellement simulé — aucun paiement réel', 'ok');
}

function newPayment() {
  const d = D[S.salle];
  openModal('<h3>Enregistrer un paiement</h3><p class="tiny mut">Simulation : aucun débit réel ne sera effectué.</p>' +
    '<div class="f"><label>Adhérent<select id="npm">' + d.mem.map(m => '<option value="' + m.id + '">' + esc(m.nom) + ' — ' + m.id + '</option>').join('') + '</select></label>' +
    '<label>Formule<select id="npp">' + PLANS.map((p, i) => '<option value="' + i + '">' + p.n + ' — ' + fmt(p.p) + '</option>').join('') + '</select></label>' +
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
  d.pay.unshift({ ref: 'REC-' + S.salle.toUpperCase() + '-' + Date.now().toString().slice(-5), m: m.id, montant: PLANS[pl].p, moyen, date: new Date(), st, agent: 'Direction' });
  if ($('npren').checked) {
    m.plan = pl;
    m.exp = new Date(+Math.max(+AUJ, +m.exp) + PLANS[pl].j * J);
    m.susp = false;
  }
  d.act.unshift(['Paiement ' + st, m.nom]);
  journal('Paiement enregistré', fmt(PLANS[pl].p) + ' · ' + moyen + ' · ' + st);
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
  openModal('<div class="receipt" id="receipt"><div class="receipt-head"><div class="brand small"><span class="mark">' + ICON('dumbbell') + '</span><span class="brand-t">JUMEAUX <b>OS</b></span></div><span class="badge b-off">Reçu de démonstration</span></div>' +
    '<h3>Reçu ' + p.ref + '</h3><p class="tiny mut">Jumeaux Fitness — ' + esc(D[site].nom) + ' · ' + dstr(p.date) + '</p>' +
    '<div class="receipt-lines"><div><span>Adhérent</span><b>' + esc(m.nom) + '</b></div><div><span>Formule</span><b>' + PLANS[m.plan].n + '</b></div><div><span>Moyen</span><b>' + p.moyen + '</b></div><div><span>Statut</span><b>' + p.st + '</b></div></div>' +
    '<div class="receipt-total"><span>Total</span><b>' + fmt(p.montant) + '</b></div>' +
    '<p class="tiny mut">Document fictif sans valeur comptable. Aucun paiement réel n’a été effectué.</p></div>' +
    '<div class="row gap8" style="margin-top:16px"><button class="btn p" onclick="window.print()">' + ICON('print') + 'Imprimer</button><button class="btn" onclick="exportCSV(\'paiements\')">' + ICON('file-csv') + 'CSV</button><button class="btn" onclick="closeModal()">Fermer</button></div>',
    { title: 'Reçu ' + p.ref });
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
    '<header class="borne-head"><div class="brand"><span class="mark">' + ICON('dumbbell') + '</span><span class="brand-t">JUMEAUX <b>OS</b></span></div>' +
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
