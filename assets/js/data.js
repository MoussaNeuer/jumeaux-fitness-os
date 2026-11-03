// ============================================================================
// JUMEAUX FITNESS OS — Données fictives 100 % locales
// Aucune requête réseau, aucun stockage serveur, aucune donnée personnelle.
// ============================================================================

const J = 864e5;
const AUJ = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const rng = s => () => (s = s * 16807 % 2147483647) / 2147483647;
const addDays = n => new Date(+AUJ + Math.round(n) * J);

const PRE = ['Moussa', 'Awa', 'Cheikh', 'Fatou', 'Ibrahima', 'Mariama', 'Ousmane', 'Khady', 'Abdoulaye', 'Aminata', 'Modou', 'Ndèye', 'Pape', 'Sokhna', 'Mamadou', 'Rokhaya', 'Ibrahima', 'Adama', 'Bineta', 'Seydou'];
const NOM = ['Diop', 'Fall', 'Ndiaye', 'Sow', 'Ba', 'Sarr', 'Diallo', 'Faye', 'Gueye', 'Mbaye', 'Seck', 'Thiam', 'Cissé', 'Kane', 'Samb', 'Ndao'];
const AGENTS = ['Aïssatou Ba', 'Moussa Diop', 'Bineta Faye', 'Ousmane Sarr'];

const PLANS = [
  { n: 'Mensuel', j: 30, p: 15000, c: '#2FD07B', d: 'Pour découvrir sans engagement' },
  { n: 'Trimestriel', j: 90, p: 40000, c: '#D9A441', d: 'Le meilleur équilibre', pop: true },
  { n: 'Annuel', j: 365, p: 140000, c: '#7DD3FC', d: 'Accès multi-salles inclus' }
];
const MOYENS = ['Espèces', 'Wave', 'Orange Money', 'Carte bancaire'];
const MOYENS_ICON = { 'Espèces': 'money-bill-1', 'Wave': 'mobile-screen', 'Orange Money': 'mobile-screen', 'Carte bancaire': 'credit-card' };

const MOIS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(AUJ.getFullYear(), AUJ.getMonth() - 11 + i, 1);
  return d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
});
const JOURS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(+AUJ - (6 - i) * J);
  return d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
});

// Chaque salle possède son identité : violet, rouge ou jaune sur noir et blanc.
const SALLES = [
  { id: 'km', nom: 'Keur Massar', n: 48, b: 6.4, s: 11, resp: 'Cheikh Ndiaye', adresse: 'Rue 12, face au marché', tel: '33 800 00 01', ouvert: 2021, staff: 7, surface: 520, color: '#8B5CF6', palette: 'Violet · Noir · Blanc' },
  { id: 'yb', nom: 'Yeumbeul', n: 37, b: 4.8, s: 23, resp: 'Awa Diallo', adresse: 'Cité Aliou Sow, Yeumbeul Nord', tel: '33 800 00 02', ouvert: 2022, staff: 5, surface: 410, color: '#EF4444', palette: 'Rouge · Noir · Blanc' },
  { id: 'gw', nom: 'Guédiawaye', n: 42, b: 5.6, s: 37, resp: 'Ibrahima Sarr', adresse: 'Route des Niayes, Guédiawaye', tel: '33 800 00 03', ouvert: 2022, staff: 6, surface: 470, color: '#EAB308', palette: 'Jaune · Noir · Blanc' },
  { id: 'pa', nom: 'Parcelles', n: 54, b: 7.2, s: 41, resp: 'Fatou Faye', adresse: 'Parcelles Assainies, unité 15', tel: '33 800 00 04', ouvert: 2023, staff: 8, surface: 610, color: '#A855F7', palette: 'Violet · Noir · Blanc' }
];

// ---------- Équipe & accès (comptes fictifs, gérés par la direction) ----------
const ROLES = [
  { id: 'gerant', n: 'Gérant de salle', d: 'Pilotage complet de sa salle' },
  { id: 'accueil', n: 'Responsable accueil', d: 'Adhérents, caisse et contrôles' },
  { id: 'caisse', n: 'Caissier', d: 'Paiements et reçus uniquement' },
  { id: 'coach', n: 'Coach', d: 'Planning et présence des membres' }
];
const ROLE_META = ROLES.reduce((a, r) => (a[r.id] = r, a), {});

const MANAGERS = [
  { id: 'USR-001', nom: 'Cheikh Ndiaye', role: 'gerant', salle: 'km', mail: 'cheikh.ndiaye@jumeaux.demo', tel: '77 512 40 11', statut: 'actif', twofa: true, dernier: addDays(0), cree: addDays(-620), sessions: 2 },
  { id: 'USR-002', nom: 'Awa Diallo', role: 'gerant', salle: 'yb', mail: 'awa.diallo@jumeaux.demo', tel: '77 512 40 22', statut: 'actif', twofa: true, dernier: addDays(-1), cree: addDays(-510), sessions: 1 },
  { id: 'USR-003', nom: 'Ibrahima Sarr', role: 'gerant', salle: 'gw', mail: 'ibrahima.sarr@jumeaux.demo', tel: '77 512 40 33', statut: 'actif', twofa: true, dernier: addDays(0), cree: addDays(-470), sessions: 3 },
  { id: 'USR-004', nom: 'Fatou Faye', role: 'gerant', salle: 'pa', mail: 'fatou.faye@jumeaux.demo', tel: '77 512 40 44', statut: 'actif', twofa: true, dernier: addDays(-2), cree: addDays(-390), sessions: 1 },
  { id: 'USR-005', nom: 'Aïssatou Ba', role: 'accueil', salle: 'km', mail: 'aissatou.ba@jumeaux.demo', tel: '77 512 40 55', statut: 'actif', twofa: false, dernier: addDays(0), cree: addDays(-300), sessions: 1 },
  { id: 'USR-006', nom: 'Moussa Diop', role: 'caisse', salle: 'yb', mail: 'moussa.diop@jumeaux.demo', tel: '77 512 40 66', statut: 'actif', twofa: true, dernier: addDays(-1), cree: addDays(-260), sessions: 2 },
  { id: 'USR-007', nom: 'Bineta Faye', role: 'coach', salle: 'gw', mail: 'bineta.faye@jumeaux.demo', tel: '77 512 40 77', statut: 'actif', twofa: false, dernier: addDays(-4), cree: addDays(-190), sessions: 1 },
  { id: 'USR-008', nom: 'Ousmane Sarr', role: 'accueil', salle: 'pa', mail: 'ousmane.sarr@jumeaux.demo', tel: '77 512 40 88', statut: 'actif', twofa: true, dernier: addDays(-3), cree: addDays(-150), sessions: 1 },
  { id: 'USR-009', nom: 'Sokhna Seck', role: 'coach', salle: 'pa', mail: 'sokhna.seck@jumeaux.demo', tel: '77 512 40 99', statut: 'suspendu', twofa: false, dernier: addDays(-38), cree: addDays(-120), sessions: 0 }
];

const findManager = id => MANAGERS.find(m => m.id === id) || null;
const siteName = id => (SALLES.find(s => s.id === id) || { nom: 'Réseau' }).nom;

// ---------- Helpers d'affichage ----------
const fmt = n => Number(n).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ') + ' FCFA';
const fmtShort = n => Number(n).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');
const dstr = d => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const dayLabel = d => new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = nom => String(nom || '?').trim().split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase();
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '.').replace(/\.+/g, '.');
const hhmm = d => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const joursRestants = m => Math.ceil((m.exp - AUJ) / J);

function statut(m) {
  if (m.susp) return 'suspendu';
  const d = joursRestants(m);
  return d < 0 ? 'expiré' : d <= 7 ? 'bientôt' : 'actif';
}

// Salaire mensuel moyen encaissé par adhérent (formules lissées)
const planMensuel = p => PLANS[p].p / (PLANS[p].j / 30);

// ---------- Génération ----------
function buildSalle(s) {
  const r = rng(s.s * 97 + 11);
  const mem = [], pay = [], pre = [];

  for (let i = 0; i < s.n; i++) {
    const x = r(), plan = Math.floor(r() * 3);
    const prenom = PRE[Math.floor(r() * PRE.length)];
    const nomFam = NOM[Math.floor(r() * NOM.length)];
    const tel = r() < .07 ? '' : '7' + (Math.floor(r() * 2) + 7) + ' ' + String(100 + Math.floor(r() * 899)) + ' ' + String(10 + Math.floor(r() * 89)) + ' ' + String(10 + Math.floor(r() * 89));
    const mail = r() < .55 ? slug(prenom + ' ' + nomFam) + '@demo.local' : '';
    const off = x < .58 ? 9 + r() * 130 : x < .71 ? r() * 8 : x < .90 ? -1 - r() * 80 : 6 + r() * 25;
    mem.push({
      id: s.id.toUpperCase() + '-' + String(i + 1).padStart(4, '0'),
      nom: prenom + ' ' + nomFam,
      tel, mail, plan,
      exp: addDays(off),
      susp: x >= .90 && x < .935,
      home: s.id,
      multi: plan === 2 || r() < .22,
      inscription: addDays(-(25 + Math.floor(r() * 760))),
      naissance: new Date(1980 + Math.floor(r() * 25), Math.floor(r() * 12), 1 + Math.floor(r() * 27)),
      agent: AGENTS[Math.floor(r() * AGENTS.length)]
    });
  }

  // Fréquentation : 7 derniers jours, le dernier = aujourd'hui
  const freq = Array.from({ length: 7 }, (_, i) => {
    const base = s.n * (1.32 + (i / 7) * .22);
    const wave = i === 5 ? .18 : i === 6 ? -.42 : i === 0 ? .12 : 0;
    return Math.max(8, Math.round(base * (1 + wave) + (r() - .5) * 18));
  });

  // Revenus et adhérents sur 12 mois
  const rev = Array.from({ length: 12 }, (_, i) => Math.round(s.b * 1e5 * (0.78 + i * .031 + (r() - .5) * .07)));
  const adh = Array.from({ length: 12 }, (_, i) => Math.round(s.n * (0.58 + i * .038 + (r() - .5) * .05)));

  // Paiements récents
  for (let i = 0; i < 38; i++) {
    const m = mem[Math.floor(r() * s.n)];
    const y = r();
    const st = y < .78 ? 'confirmé' : y < .91 ? 'en attente' : 'annulé';
    pay.push({
      ref: 'REC-' + s.id.toUpperCase() + '-' + String(1200 + i),
      m: m.id,
      montant: PLANS[m.plan].p,
      moyen: MOYENS[Math.floor(r() * MOYENS.length)],
      date: addDays(-Math.floor(r() * 34)),
      st,
      agent: AGENTS[Math.floor(r() * AGENTS.length)]
    });
  }
  pay.sort((a, b) => b.date - a.date);

  // Présences du jour (cohérentes avec le compteur)
  const nb = freq[6];
  for (let i = 0; i < nb; i++) {
    const m = mem[Math.floor(r() * s.n)];
    const minutes = Math.round(6 * 60 + (i / Math.max(1, nb - 1)) * 15 * 60 + (r() - .5) * 50);
    const at = new Date(+AUJ + Math.max(0, Math.min(20 * 60, minutes)) * 60000);
    pre.push({
      at,
      m: m.id,
      ok: statut(m) === 'actif' || statut(m) === 'bientôt',
      type: r() < .84 ? 'QR' : 'Manuel'
    });
  }
  pre.sort((a, b) => a.at - b.at);

  const act = [
    ['Nouvel adhérent enregistré', mem[0].nom],
    ['Abonnement renouvelé', mem[3].nom],
    ['Paiement Wave enregistré', mem[5].nom],
    ['Présence validée par QR', mem[7].nom],
    ['Relance d’expiration envoyée', mem[9].nom]
  ];

  return { ...s, mem, pay, pre, rev, adh, freq, act };
}

const D = {};
SALLES.forEach(s => { D[s.id] = buildSalle(s); });
const ALL = SALLES.map(s => s.id);
const sum = f => ALL.reduce((a, id) => a + f(id), 0);

// Dernière visite calculée à partir des présences
ALL.forEach(id => {
  D[id].mem.forEach(m => {
    const p = D[id].pre.filter(x => x.m === m.id);
    m.derniere = p.length ? p[p.length - 1].at : addDays(-(2 + (m.inscription.getDate() % 9)));
  });
});

const cnt = (s, st) => D[s].mem.filter(m => statut(m) === st).length;

function kp(id) {
  const d = D[id], act = d.mem.filter(m => ['actif', 'bientôt'].includes(statut(m))).length;
  const evo = d.rev[11] && d.rev[10] ? (d.rev[11] / d.rev[10] - 1) * 100 : 0;
  const encaisse = d.pay.filter(p => p.st === 'confirmé').reduce((a, p) => a + p.montant, 0);
  const objectif = Math.round(d.b * 1e5 * 1.1);
  return {
    tot: d.mem.length,
    act,
    exp: cnt(id, 'expiré'),
    soon: cnt(id, 'bientôt'),
    susp: cnt(id, 'suspendu'),
    nouv: Math.round(d.n * .14),
    rev: d.rev[11],
    pres: d.freq[6],
    evo: Math.round(evo * 10) / 10,
    taux: Math.round((act / d.mem.length) * 100),
    encaisse,
    objectif,
    atteinte: Math.min(160, Math.round(encaisse / objectif * 100)),
    multi: d.mem.filter(m => m.multi).length
  };
}

let net = {};
function recalc() {
  net = {
    tot: sum(i => kp(i).tot),
    act: sum(i => kp(i).act),
    exp: sum(i => kp(i).exp),
    soon: sum(i => kp(i).soon),
    susp: sum(i => kp(i).susp),
    nouv: sum(i => kp(i).nouv),
    rev: sum(i => kp(i).rev),
    pres: sum(i => kp(i).pres),
    encaisse: sum(i => kp(i).encaisse),
    multi: sum(i => kp(i).multi)
  };
  net.taux = Math.round(net.act / net.tot * 100);
}
recalc();

const addv = f => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => sum(id => D[id][f][i]));

function findMembre(id) {
  if (!id) return null;
  const clean = decodeURIComponent(String(id)).trim().toUpperCase();
  for (const sid of ALL) {
    const m = D[sid].mem.find(x => x.id === clean);
    if (m) return m;
  }
  // Tolérance : identifiant partiel KM-12 → KM-0012
  const m = clean.match(/^([A-Z]{2})-(\d{1,4})$/);
  if (m) {
    const sid = m[1].toLowerCase();
    if (D[sid]) return D[sid].mem.find(x => x.id === sid.toUpperCase() + '-' + m[2].padStart(4, '0')) || null;
  }
  return null;
}

// ---------- Contrôle d'accès (règle métier simulée) ----------
function checkAccess(memberId, salleId) {
  const m = findMembre(memberId);
  if (!m) return { tone: 'ko', code: 'invalide', title: 'QR non reconnu', msg: 'Ce code ne correspond à aucun adhérent.', m: null };
  const st = statut(m);
  if (st === 'suspendu') return { tone: 'ko', code: 'suspendu', title: 'Accès refusé', msg: 'Abonnement suspendu — orientation vers l’accueil.', m };
  if (st === 'expiré') return { tone: 'ko', code: 'expire', title: 'Abonnement expiré', msg: 'Expiré depuis ' + Math.abs(joursRestants(m)) + ' jour(s) — proposer un renouvellement.', m };
  if (salleId && m.home !== salleId && !m.multi) return { tone: 'warn', code: 'site', title: 'Salle non autorisée', msg: 'La formule ' + PLANS[m.plan].n + ' ne couvre que ' + D[m.home].nom + '.', m };
  return { tone: 'ok', code: 'ok', title: 'Accès autorisé', msg: 'Bienvenue, ' + m.nom.split(' ')[0] + ' !', m };
}

function checkinUrl(m, salleId) {
  const base = location.href.split('#')[0];
  return base + '#checkin=' + encodeURIComponent(m.id) + '&salle=' + encodeURIComponent(salleId || m.home);
}

// ---------- Qualité des données (réduction des erreurs) ----------
function anomalies(id) {
  const d = D[id], seen = new Set(), dups = [];
  d.mem.forEach(m => {
    if (m.reviewed) return;
    const key = m.nom.toLowerCase();
    if (seen.has(key)) dups.push(m); else seen.add(key);
  });
  const noTel = d.mem.filter(m => !m.tel);
  const pending = d.pay.filter(p => p.st === 'en attente');
  const noMail = d.mem.filter(m => !m.mail);
  return {
    noTel, pending, dups,
    noMail: noMail.filter(m => !noTel.includes(m)),
    total: noTel.length + pending.length + dups.length
  };
}
const anomaliesNet = () => ALL.reduce((a, id) => { const x = anomalies(id); a.noTel += x.noTel.length; a.pending += x.pending.length; a.dups += x.dups.length; a.total += x.total; return a; }, { noTel: 0, pending: 0, dups: 0, total: 0 });

// ---------- Flux temps réel simulé ----------
const LIVE_AGENTS = ['Aïssatou', 'Moussa', 'Bineta', 'Ousmane'];
function pickLiveEvent() {
  const s = SALLES[Math.floor(Math.random() * SALLES.length)];
  const m = D[s.id].mem[Math.floor(Math.random() * D[s.id].mem.length)];
  const r = checkAccess(m.id, s.id);
  return {
    m, salle: s,
    tone: r.tone,
    title: r.title,
    type: Math.random() < .87 ? 'QR' : 'Manuel',
    at: new Date()
  };
}

// ---------- Projection d'expansion ----------
function projection({ membres, panier, charges, investissement }) {
  const ca = Math.round(membres * panier);
  const marge = Math.max(0, ca - charges);
  const seuil = panier > 0 ? Math.ceil(charges / panier) : 0;
  const retour = marge > 0 ? Math.ceil(investissement / marge) : null;
  const actuels = net.act;
  return { ca, marge, seuil, retour, caNet: ca * 12, membres, actuels, nouveaux: actuels + membres };
}

const PRIX_PANIER = Math.round(SALLES.reduce((a, s) => a + kp(s.id).rev, 0) / Math.max(1, net.act));
