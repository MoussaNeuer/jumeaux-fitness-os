// ============================================================================
// Noyau applicatif : état, rendu, composants, graphiques, QR, modale, toasts
// ============================================================================

const S = {
  view: 'land', salle: 'km', tab: 'dash', filter: 'tous', q: '', page: 0,
  sort: 'id', dark: false, col: false, ptab: 'home', logged: false, live: false,
  zen: false, ticket: null, payFilter: 'tous', journal: [],
  teamSite: 'all', teamRole: 'all', teamQ: '',
  finSite: 'net', finTab: 'synthese', depFilter: 'tous',
  aboView: 'traiter', perfFocus: 'rev'
};

const $ = id => document.getElementById(id);
const ALL_IDS = SALLES.map(s => s.id);
const ICON = n => '<i class="fa-solid fa-' + n + '" aria-hidden="true"></i>';

// ---------- Logo officiel ----------
// Le logo source est un lockup sombre sur fond blanc : on l’affiche toujours
// dans une pastille blanche pour rester lisible sur les surfaces claires et sombres.
const LOGO_FULL = 'assets/images/logo.png?v=7.5';
const LOGO_MARK = 'assets/images/logo-mark.png?v=7.5';
function logoChip(cls) {
  return '<span class="logo-chip' + (cls ? ' ' + cls : '') + '">' +
    '<img class="logo-word" src="' + LOGO_FULL + '" alt="Jumeaux Fitness OS">' +
    '<img class="logo-mark" src="' + LOGO_MARK + '" alt="" aria-hidden="true">' +
    '</span>';
}

function go(patch) {
  const prevSalle = S.salle;
  Object.assign(S, patch || {});
  if (patch && patch.salle && patch.salle !== prevSalle) S.page = 0;
  render();
  if (!S.zen) {
    try { window.scrollTo({ top: 0, behavior: 'auto' }); }
    catch (e) { window.scrollTo(0, 0); }
  }
}

function toast(message, tone) {
  const el = $('toast');
  if (!el) return;
  el.innerHTML = ICON(tone === 'ok' ? 'circle-check' : tone === 'ko' ? 'circle-exclamation' : 'circle-info') + '<span>' + esc(message) + '</span>';
  el.dataset.tone = tone || 'info';
  el.classList.add('on');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('on'), 2800);
}

// ---------- Modale accessible ----------
let _lastFocus = null;
function openModal(html, opts) {
  const m = $('modal');
  if (!m) return;
  _lastFocus = document.activeElement;
  m.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true" aria-label="' + esc((opts && opts.title) || 'Fenêtre de démonstration') + '">' +
    '<button class="modal-x" aria-label="Fermer" onclick="closeModal()">' + ICON('xmark') + '</button>' + html + '</div>';
  m.classList.add('on');
  m.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
  const focusable = m.querySelector('input, select, textarea, button:not(.modal-x)');
  setTimeout(() => (focusable || m.querySelector('.modal-x')).focus(), 40);
}
function closeModal() {
  const m = $('modal');
  if (!m) return;
  if (typeof window._stopCam === 'function') window._stopCam();
  m.classList.remove('on');
  m.setAttribute('aria-hidden', 'true');
  m.innerHTML = '';
  document.body.classList.remove('locked');
  if (_lastFocus && _lastFocus.focus) _lastFocus.focus();
}
document.addEventListener('keydown', e => {
  const m = $('modal');
  if (!m || !m.classList.contains('on')) return;
  if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
  if (e.key !== 'Tab') return;
  const f = [...m.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
document.addEventListener('click', e => {
  if (e.target.id === 'modal') closeModal();
});

// ---------- Infobulles ----------
document.addEventListener('pointerover', e => {
  const t = e.target.closest && e.target.closest('[data-tip]');
  const b = $('tip');
  if (!b) return;
  if (!t) { b.classList.remove('on'); return; }
  b.textContent = t.dataset.tip;
  b.classList.add('on');
  const r = t.getBoundingClientRect();
  const x = Math.min(innerWidth - b.offsetWidth - 12, Math.max(8, r.left + r.width / 2 - b.offsetWidth / 2));
  const y = r.top > 46 ? r.top - b.offsetHeight - 8 : r.bottom + 8;
  b.style.left = x + 'px';
  b.style.top = y + 'px';
});
document.addEventListener('scroll', () => $('tip')?.classList.remove('on'), { passive: true });

// ---------- Thème ----------
function applyTheme() {
  document.documentElement.dataset.theme = S.dark ? 'dark' : '';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = S.dark ? '#080D0A' : '#07130D';
}
function toggleTheme() {
  S.dark = !S.dark;
  try { localStorage.setItem('jfos-theme', S.dark ? 'dark' : 'light'); } catch (e) {}
  applyTheme();
  render();
}
try { S.dark = localStorage.getItem('jfos-theme') === 'dark'; } catch (e) {}
applyTheme();

// ---------- Identité visuelle de la salle active ----------
// La direction conserve l'identité émeraude de la plateforme. Le back-office
// et l'espace adhérent prennent la couleur de la salle concernée.
function applySiteTheme() {
  let site = null;
  if (S.view === 'salle') site = S.salle;
  else if (S.view === 'portal' && ME && ME.home) site = ME.home;
  if (site && D[site]) document.body.dataset.site = site;
  else delete document.body.dataset.site;
  document.body.classList.toggle('site-context', !!(site && D[site]));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = site && D[site] ? D[site].color : (S.dark ? '#080D0A' : '#07130D');
}

// ---------- Composants ----------
const STATUT_META = {
  actif: ['b-ok', 'Actif'],
  'bientôt': ['b-warn', 'Expire bientôt'],
  expiré: ['b-ko', 'Expiré'],
  suspendu: ['b-off', 'Suspendu'],
  'confirmé': ['b-ok', 'Confirmé'],
  'déclaré': ['b-info', 'Déclaré'],
  'en attente': ['b-warn', 'En attente'],
  annulé: ['b-ko', 'Annulé'],
  autorisé: ['b-ok', 'Autorisé'],
  refusé: ['b-ko', 'Refusé'],
  'à traiter': ['b-warn', 'À traiter'],
  'en cours': ['b-info', 'En cours'],
  traité: ['b-ok', 'Traité'],
  'bientôt disponible': ['b-off', 'Bientôt']
};
function bdg(st) {
  const meta = STATUT_META[st] || ['b-off', st];
  return '<span class="badge ' + meta[0] + '"><i aria-hidden="true"></i>' + esc(meta[1]) + '</span>';
}

function avatar(nom, extra) {
  const hues = ['#0E7A4B', '#2563EB', '#B45309', '#9333EA', '#BE123C', '#0F766E'];
  const h = [...String(nom)].reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length;
  return '<span class="av' + (extra ? ' ' + extra : '') + '" style="--av:' + hues[h] + '" aria-hidden="true">' + esc(initials(nom)) + '</span>';
}

function kpi(label, value, extra, opts) {
  opts = opts || {};
  return '<div class="card kpi' + (opts.tone ? ' kpi-' + opts.tone : '') + '">' +
    '<span class="kpi-l">' + label + '</span>' +
    '<b class="kpi-v">' + value + '</b>' +
    (extra ? '<span class="kpi-x">' + extra + '</span>' : '') +
    (opts.spark ? '<span class="kpi-spark">' + opts.spark + '</span>' : '') +
    '</div>';
}

let _cid = 0;
function bars(vals, labels, title, unit, opts) {
  opts = opts || {};
  const id = 'bg' + (++_cid);
  const w = 380, h = 150, pad = 8, max = Math.max(...vals, 1);
  const bw = (w - pad * 2) / vals.length;
  const grid = [0, 1, 2, 3].map(i => '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (h - (i / 3) * (h - 22)) + '" y2="' + (h - (i / 3) * (h - 22)) + '" class="gl"/>').join('');
  const rects = vals.map((v, i) => {
    const bh = Math.max(2, (v / max) * (h - 26));
    return '<rect class="bar" data-tip="' + esc(labels[i] + ' : ' + fmtShort(v) + (unit || '')) + '" x="' + (pad + i * bw + bw * .16) + '" y="' + (h - bh) + '" width="' + (bw * .68) + '" height="' + bh + '" rx="5" style="animation-delay:' + i * 45 + 'ms"/>';
  }).join('');
  const text = labels.map((l, i) => '<text x="' + (pad + i * bw + bw / 2) + '" y="' + (h + 16) + '" text-anchor="middle">' + esc(l) + '</text>').join('');
  const total = opts.total ? '<span class="chart-total">' + opts.total + '</span>' : '';
  return '<div class="card chart"><div class="chart-h"><h3>' + title + '</h3>' + total + '</div>' +
    '<svg viewBox="0 0 ' + w + ' ' + (h + 24) + '" role="img" aria-label="' + esc(title + '. ' + vals.map((v, i) => labels[i] + ' ' + fmtShort(v)).join(', ')) + '">' +
    '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--g2)"/><stop offset="1" stop-color="var(--g)"/></linearGradient></defs>' +
    grid + '<g fill="url(#' + id + ')">' + rects + '</g>' + text + '</svg></div>';
}

function line(vals, labels, title, unit, opts) {
  opts = opts || {};
  const id = 'lg' + (++_cid);
  const w = 380, h = 150, padL = 10, padR = 10, top = 10;
  const max = Math.max(...vals) * 1.04, min = Math.min(...vals) * .88;
  const span = Math.max(1, max - min);
  const st = (w - padL - padR) / Math.max(1, vals.length - 1);
  const pts = vals.map((v, i) => [padL + i * st, top + (1 - (v - min) / span) * (h - top - 20)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = d + ' L' + (w - padR) + ',' + h + ' L' + padL + ',' + h + ' Z';
  const grid = [0, 1, 2, 3].map(i => '<line x1="' + padL + '" x2="' + (w - padR) + '" y1="' + (top + i * (h - 20) / 3) + '" y2="' + (top + i * (h - 20) / 3) + '" class="gl"/>').join('');
  const dots = pts.map((p, i) => '<circle class="ln-dot" data-tip="' + esc(labels[i] + ' : ' + fmtShort(vals[i]) + (unit || '')) + '" r="9" cx="' + p[0] + '" cy="' + p[1] + '" fill="transparent"/><circle class="ln-pt" r="2.6" cx="' + p[0] + '" cy="' + p[1] + '"/>').join('');
  const text = labels.map((l, i) => i % 2 ? '' : '<text x="' + pts[i][0] + '" y="' + (h + 14) + '" text-anchor="middle">' + esc(l) + '</text>').join('');
  const total = opts.total ? '<span class="chart-total">' + opts.total + '</span>' : '';
  return '<div class="card chart"><div class="chart-h"><h3>' + title + '</h3>' + total + '</div>' +
    '<svg viewBox="0 0 ' + w + ' ' + (h + 22) + '" role="img" aria-label="' + esc(title + '. ' + vals.map((v, i) => labels[i] + ' ' + fmtShort(v)).join(', ')) + '">' +
    '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--g2)" stop-opacity=".28"/><stop offset="1" stop-color="var(--g2)" stop-opacity="0"/></linearGradient></defs>' +
    grid + '<path class="ln-ar" d="' + area + '" fill="url(#' + id + ')"/>' +
    '<path class="ln" d="' + d + '"/>' + dots + text + '</svg></div>';
}

function donut(items, title, center) {
  // items: [{label, value, color}]
  const total = items.reduce((a, x) => a + x.value, 0) || 1;
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  const segs = items.map(x => {
    const len = x.value / total * C;
    const s = '<circle class="dn-seg" r="' + R + '" cx="72" cy="72" fill="none" stroke="' + x.color + '" stroke-width="16" stroke-dasharray="' + (len - 3) + ' ' + (C - len + 3) + '" stroke-dashoffset="' + (-offset) + '" data-tip="' + esc(x.label + ' : ' + x.value) + '"/>';
    offset += len;
    return s;
  }).join('');
  const legend = items.map(x => '<div class="dn-l"><i style="background:' + x.color + '"></i><span>' + esc(x.label) + '</span><b>' + x.value + '</b></div>').join('');
  return '<div class="card chart"><div class="chart-h"><h3>' + title + '</h3></div><div class="dn"><svg viewBox="0 0 144 144" role="img" aria-label="' + esc(title) + '">' +
    '<circle r="' + R + '" cx="72" cy="72" fill="none" stroke="var(--bd)" stroke-width="16"/>' + segs +
    '<text x="72" y="68" text-anchor="middle" class="dn-c">' + esc(center || total) + '</text><text x="72" y="86" text-anchor="middle" class="dn-s">total</text></svg><div class="dn-legend">' + legend + '</div></div></div>';
}

function spark(vals, tone) {
  const w = 90, h = 26, max = Math.max(...vals), min = Math.min(...vals), span = Math.max(1, max - min);
  const pts = vals.map((v, i) => (i / (vals.length - 1) * w).toFixed(1) + ',' + (h - 2 - (v - min) / span * (h - 4)).toFixed(1)).join(' ');
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="' + (tone || 'var(--g2)') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

// ---------- QR code réel (libellé de démonstration) ----------
function qrSvg(member, size, salleId) {
  const m = typeof member === 'string' ? findMembre(member) : member;
  size = size || 140;
  if (!m) return '<span class="qr qr-empty" style="width:' + size + 'px;height:' + size + 'px"><i class="fa-solid fa-qrcode"></i></span>';
  const payload = checkinUrl(m, salleId);
  let svg = '';
  if (typeof qrcode === 'function') {
    try {
      const q = qrcode(0, 'M');
      q.addData(payload);
      q.make();
      svg = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true, title: 'QR de démonstration de ' + m.nom, alt: 'Code QR de démonstration' });
    } catch (e) { svg = ''; }
  }
  if (!svg) {
    // Repli purement décoratif si la librairie est indisponible
    const n = 21; let c = '';
    const r = rng([...m.id].reduce((a, x) => a * 31 + x.charCodeAt(0), 7) % 2147483646 + 1);
    const fin = (x, y) => (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let on = r() > .5;
      if (fin(x, y)) { const a = x > 13 ? x - 14 : x, b = y > 13 ? y - 14 : y; on = a === 0 || a === 6 || b === 0 || b === 6 || (a > 1 && a < 5 && b > 1 && b < 5); }
      if (on) c += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    svg = '<svg viewBox="0 0 21 21" width="100%" height="100%" fill="#07130D" role="img" aria-label="QR décoratif">' + c + '</svg>';
  }
  return '<span class="qr" style="width:' + size + 'px;height:' + size + 'px">' + svg + '<span class="qr-badge">' + ICON('qrcode') + '</span></span>';
}

// ---------- Flux / activité ----------
function activity(id) {
  const d = D[id];
  return '<div class="card"><div class="chart-h"><h3>Activité récente</h3><span class="live-tag"><i></i>simulée</span></div>' +
    d.act.map((a, i) => '<div class="act"><span class="act-ic">' + ICON(['user-plus', 'arrows-rotate', 'money-bill-wave', 'qrcode', 'clock'][i % 5]) + '</span><span><b>' + esc(a[0]) + '</b><small>' + esc(a[1]) + '</small></span><time>il y a ' + (i * 7 + 3) + ' min</time></div>').join('') + '</div>';
}

function alerts() {
  const an = anomaliesNet();
  return '<div class="card"><div class="chart-h"><h3>À traiter aujourd’hui</h3><span class="badge b-warn">' + an.total + '</span></div>' +
    '<div class="act"><span class="act-ic warn">' + ICON('triangle-exclamation') + '</span><span><b>' + net.soon + ' abonnements expirent sous 7 jours</b><small>Relance automatique à valider</small></span></div>' +
    '<div class="act"><span class="act-ic warn">' + ICON('money-bill-wave') + '</span><span><b>' + an.pending + ' paiements à vérifier</b><small>Écart possible avec la caisse</small></span></div>' +
    '<div class="act"><span class="act-ic">' + ICON('user-clock') + '</span><span><b>' + an.noTel + ' fiches sans téléphone</b><small>Rappels et relances impossibles</small></span></div>' +
    '<button class="btn s w" style="margin-top:12px" onclick="go({view:\'salle\',tab:\'qual\'})">Ouvrir le centre de contrôle ' + ICON('arrow-right') + '</button></div>';
}

function emptyState(icon, title, text) {
  return '<div class="empty">' + ICON(icon) + '<b>' + esc(title) + '</b><span>' + esc(text) + '</span></div>';
}

// ---------- Téléchargements / export ----------
function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

function toCSV(rows) {
  return rows.map(r => r.map(v => {
    const s = String(v ?? '');
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(';')).join('\r\n');
}

function exportCSV(kind) {
  let rows = [], name = '';
  if (kind === 'membres') {
    rows.push(['Identifiant', 'Nom', 'Téléphone', 'E-mail', 'Salle', 'Formule', 'Expiration', 'Statut', 'Multi-salles']);
    SALLES.forEach(s => D[s.id].mem.forEach(m => rows.push([m.id, m.nom, m.tel, m.mail, s.nom, PLANS[m.plan].n, dstr(m.exp), statut(m), m.multi ? 'Oui' : 'Non'])));
    name = 'adherents';
  } else if (kind === 'paiements') {
    rows.push(['Référence', 'Adhérent', 'Montant FCFA', 'Moyen', 'Date', 'Statut', 'Encaissé par']);
    SALLES.forEach(s => D[s.id].pay.forEach(p => rows.push([p.ref, findMembre(p.m)?.nom || p.m, p.montant, p.moyen, dstr(p.date), p.st, p.agent])));
    name = 'paiements';
  } else {
    rows.push(['Salle', 'Date', 'Heure', 'Adhérent', 'Type', 'Responsable', 'Motif', 'Résultat']);
    SALLES.forEach(s => D[s.id].pre.forEach(p => rows.push([s.nom, dstr(p.at), hhmm(p.at), findMembre(p.m)?.nom || p.m, p.type, p.responsable || '', p.motif || '', p.ok ? 'Autorisé' : 'Refusé'])));
    name = 'presences';
  }
  downloadFile('jumeaux-' + name + '-' + new Date().toISOString().slice(0, 10) + '.csv', '\uFEFF' + toCSV(rows), 'text/csv;charset=utf-8');
  toast('Export CSV généré dans votre navigateur', 'ok');
}

// ---------- Tick d'horloge ----------
function clockTick() {
  const n = $('liveClock');
  if (n) n.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
