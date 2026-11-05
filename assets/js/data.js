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
const PRENOMS_F = new Set(['Awa', 'Fatou', 'Mariama', 'Khady', 'Aminata', 'Ndèye', 'Sokhna', 'Rokhaya', 'Bineta']);
const genreDe = prenom => (PRENOMS_F.has(prenom) ? 'f' : 'h');
const AGENTS = ['Aïssatou Ba', 'Moussa Diop', 'Bineta Faye', 'Ousmane Sarr'];

// ---------- Tarifs de la plateforme (modifiables par la Direction) ----------
// Prix de base pour UN mois. Les durées vont de 1 à 12 mois uniquement.
const TARIFS = {
  h: 20000,
  f: 15000
};

// Promotion globale au réseau : elle remplace le tarif linéaire pour les
// durées indiquées, pour les hommes comme pour les femmes.
const PROMO = {
  active: true,
  nom: 'Promotion de lancement',
  fin: addDays(45),
  offres: { 1: 15000, 2: 27500, 3: 40000 }
};

const PLAN_COLORS = ['#2FD07B', '#34D399', '#D9A441', '#F5C76A', '#7DD3FC', '#38BDF8', '#A78BFA', '#8B5CF6', '#F472B6', '#FB7185', '#F97316', '#94A3B8'];

const PLANS = Array.from({ length: 12 }, (_, i) => {
  const m = i + 1;
  return {
    n: m + ' mois',
    m,
    j: m * 30,
    c: PLAN_COLORS[i],
    d: m === 1 ? 'Sans engagement' : m === 12 ? 'Accès multi-salles inclus' : 'Engagement de ' + m + ' mois',
    pop: m === 3
  };
});

const tarifGenre = genre => (genre === 'f' ? TARIFS.f : TARIFS.h);
const promoEnCours = () => {
  if (!PROMO.active) return false;
  if (!PROMO.fin) return true;
  const fin = new Date(PROMO.fin);
  return isNaN(+fin) || +fin >= +AUJ;
};
const promotionPour = months => !!(promoEnCours() && PROMO.offres[months] != null && Number(PROMO.offres[months]) > 0);
const prixPlan = (months, genre) => promotionPour(months) ? Number(PROMO.offres[months]) : tarifGenre(genre) * months;
const prixMembre = m => prixPlan(PLANS[m.plan].m, m.genre);
const promoOffres = () => PLANS.filter(p => promotionPour(p.m)).map(p => ({
  mois: p.m,
  prix: Number(PROMO.offres[p.m]),
  baseH: TARIFS.h * p.m,
  baseF: TARIFS.f * p.m
}));
const promoOffre = months => promoOffres().find(x => x.mois === months) || null;

// Étiquette des formules dans les listes déroulantes.
function planOptionText(months) {
  const h = prixPlan(months, 'h'), f = prixPlan(months, 'f');
  const prix = h === f ? fmt(h) : fmt(h) + ' H · ' + fmt(f) + ' F';
  return months + ' mois — ' + prix + (promotionPour(months) ? ' · promo' : '');
}

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
  { id: 'km', nom: 'Keur Massar', n: 44, b: 7.2, s: 11, resp: 'Cheikh Ndiaye', adresse: 'Rue 12, face au marché', tel: '33 800 00 01', ouvert: 2021, staff: 7, surface: 520, color: '#8B5CF6', palette: 'Violet · Noir · Blanc' },
  { id: 'yb', nom: 'Yeumbeul', n: 58, b: 5.0, s: 23, resp: 'Awa Diallo', adresse: 'Cité Aliou Sow, Yeumbeul Nord', tel: '33 800 00 02', ouvert: 2022, staff: 5, surface: 410, color: '#EF4444', palette: 'Rouge · Noir · Blanc' },
  { id: 'gw', nom: 'Guédiawaye', n: 42, b: 5.6, s: 37, resp: 'Ibrahima Sarr', adresse: 'Route des Niayes, Guédiawaye', tel: '33 800 00 03', ouvert: 2022, staff: 6, surface: 470, color: '#EAB308', palette: 'Jaune · Noir · Blanc' },
  { id: 'pa', nom: 'Parcelles', n: 54, b: 7.2, s: 41, resp: 'Fatou Faye', adresse: 'Parcelles Assainies, unité 15', tel: '33 800 00 04', ouvert: 2023, staff: 8, surface: 610, color: '#A855F7', palette: 'Violet · Noir · Blanc' }
];

// ---------- Finance : catégories de charges et d'exploitation ----------
// Les montants sont des hypothèses de démonstration, pas des comptes réels.
const CHARGE_CATS = [
  { id: 'loyer', n: 'Loyer', type: 'fixe', icon: 'building', calc: s => Math.round(s.surface * 180 / 500) * 500 },
  { id: 'salaires', n: 'Salaires & charges', type: 'fixe', icon: 'users', calc: s => s.staff * 32000 },
  { id: 'energie', n: 'Énergie & eau', type: 'fixe', icon: 'bolt', calc: s => Math.round(s.surface * 70 / 100) * 100 },
  { id: 'internet', n: 'Internet & téléphonie', type: 'fixe', icon: 'wifi', calc: () => 25000 },
  { id: 'assurance', n: 'Assurance & sécurité', type: 'fixe', icon: 'shield-halved', calc: () => 35000 },
  { id: 'maintenance', n: 'Maintenance & entretien', type: 'fixe', icon: 'screwdriver-wrench', calc: s => Math.round(s.surface * 22 / 100) * 100 },
  { id: 'admin', n: 'Frais administratifs', type: 'fixe', icon: 'file-invoice', calc: () => 40000 },
  { id: 'marketing', n: 'Marketing local', type: 'variable', icon: 'bullhorn', share: .022 },
  { id: 'commissions', n: 'Commissions paiement', type: 'variable', icon: 'percent', share: .012 },
  { id: 'produits', n: 'Produits & consommables', type: 'variable', icon: 'bottle-water', share: .011 },
  { id: 'transport', n: 'Transport & logistique', type: 'variable', icon: 'truck', share: .006 },
  { id: 'divers', n: 'Dépenses diverses', type: 'variable', icon: 'receipt', share: .005 }
];
const CHARGE_META = CHARGE_CATS.reduce((a, c) => (a[c.id] = c, a), {});
const VAR_SHARE = CHARGE_CATS.filter(c => c.type === 'variable').reduce((a, c) => a + c.share, 0);

// Planning d'activités (aperçu simulé, sans réservation réelle).
const COURS = [
  { id: 'c1', jour: 1, h: '07:00', n: 'Cardio express', coach: 'Bineta', salle: 'Studio 1', places: 12, duree: 45 },
  { id: 'c2', jour: 1, h: '18:30', n: 'Renforcement', coach: 'Ibrahima', salle: 'Espace musculation', places: 10, duree: 60 },
  { id: 'c3', jour: 2, h: '19:00', n: 'Fit dance', coach: 'Awa', salle: 'Studio 2', places: 16, duree: 50 },
  { id: 'c4', jour: 3, h: '07:30', n: 'Mobilité & dos', coach: 'Sokhna', salle: 'Studio 1', places: 8, duree: 40 },
  { id: 'c5', jour: 4, h: '18:00', n: 'Circuit training', coach: 'Cheikh', salle: 'Espace musculation', places: 12, duree: 55 },
  { id: 'c6', jour: 5, h: '17:00', n: 'Cardio & endurance', coach: 'Fatou', salle: 'Studio 1', places: 14, duree: 45 },
  { id: 'c7', jour: 6, h: '10:00', n: 'Yoga du samedi', coach: 'Mariama', salle: 'Studio 2', places: 15, duree: 60 }
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

const lastVisit = m => new Date(m.derniere || m.inscription || AUJ);
const inactif = m => {
  const st = statut(m);
  return st !== 'expiré' && st !== 'suspendu' && (AUJ - lastVisit(m)) / J > 21;
};
const renewalAlert = m => {
  if (statut(m) === 'expiré') return 'expiré';
  const j = joursRestants(m);
  if (j <= 1) return 'J-1';
  if (j <= 3) return 'J-3';
  if (j <= 7) return 'J-7';
  return '';
};

// Équivalent mensuel encaissé par adhérent (promotion incluse si active)
const planMensuel = m => prixMembre(m) / PLANS[m.plan].m;

// ---------- Génération ----------
function buildSalle(s) {
  const r = rng(s.s * 97 + 11);
  const mem = [], pay = [], pre = [];

  // Répartition réaliste : les courtes durées restent majoritaires, les
  // engagements longs existent mais sont plus rares.
  const PLAN_POOL = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 10, 11];

  for (let i = 0; i < s.n; i++) {
    const x = r(), plan = PLAN_POOL[Math.floor(r() * PLAN_POOL.length)];
    const prenom = PRE[Math.floor(r() * PRE.length)];
    const nomFam = NOM[Math.floor(r() * NOM.length)];
    const genre = genreDe(prenom);
    const duree = PLANS[plan].j;
    const prix = prixPlan(PLANS[plan].m, genre);
    const tel = r() < .07 ? '' : '7' + (Math.floor(r() * 2) + 7) + ' ' + String(100 + Math.floor(r() * 899)) + ' ' + String(10 + Math.floor(r() * 89)) + ' ' + String(10 + Math.floor(r() * 89));
    const mail = r() < .55 ? slug(prenom + ' ' + nomFam) + '@demo.local' : '';
    const recent = r() < .10;
    const off = recent ? 0 : x < .52 ? 9 + r() * 130 : x < .68 ? r() * 8 : x < .88 ? -1 - r() * 80 : 6 + r() * 25;
    const inscription = recent
      ? addDays(-Math.floor(r() * 27))
      : new Date(Math.min(+addDays(-(25 + Math.floor(r() * 760))), +addDays(off - duree) - 4 * J));
    // Cycle cohérent : l'échéance reste dans la durée de la formule en cours
    // et la date de début ne peut donc jamais se situer dans le futur.
    const exp = new Date(Math.min(
      recent ? +addDays(Math.round((+inscription - +AUJ) / J) + duree) : +addDays(off),
      +AUJ + duree * J
    ));
    const debut = new Date(+exp - duree * J);
    const renouv = Array.from({ length: 1 + Math.floor(r() * 3) }, (_, k) => ({
      date: addDays(-(duree * (k + 1) + Math.floor(r() * 12))),
      plan, montant: prix, moyen: MOYENS[Math.floor(r() * MOYENS.length)]
    }));
    if (!recent && r() < .30) {
      renouv.unshift({ date: addDays(-Math.floor(r() * 26)), plan, montant: prix, moyen: MOYENS[Math.floor(r() * MOYENS.length)] });
    }
    const wantChange = !recent && r() < .045;
    mem.push({
      id: s.id.toUpperCase() + '-' + String(i + 1).padStart(4, '0'),
      nom: prenom + ' ' + nomFam,
      genre,
      tel, mail, plan,
      exp,
      debut,
      susp: x >= .90 && x < .935,
      autoRenew: r() < .42,
      renouv,
      resas: [],
      demande: !recent && r() < .075 ? {
        type: wantChange ? 'changement' : 'renouvellement',
        plan: wantChange ? (plan + 1) % PLANS.length : plan,
        at: addDays(-Math.floor(r() * 6)),
        statut: 'à traiter'
      } : null,
      demandeHist: [],
      home: s.id,
      multi: PLANS[plan].m >= 12 || r() < .22,
      inscription,
      naissance: new Date(1980 + Math.floor(r() * 25), Math.floor(r() * 12), 1 + Math.floor(r() * 27)),
      agent: AGENTS[Math.floor(r() * AGENTS.length)]
    });
  }

  // Fréquentation : 7 derniers jours, le dernier = aujourd'hui
  const freq = Array.from({ length: 7 }, (_, i) => {
    const base = s.n * (0.92 + (i / 7) * .16);
    const wave = i === 5 ? .16 : i === 6 ? -.40 : i === 0 ? .10 : 0;
    return Math.max(8, Math.round(base * (1 + wave) + (r() - .5) * 12));
  });

  // Revenus et adhérents sur 12 mois (hypothèses lissées)
  const rev = Array.from({ length: 12 }, (_, i) => Math.round(s.b * 1e5 * (0.82 + i * .026 + (r() - .5) * .05)));
  const adh = Array.from({ length: 12 }, (_, i) => Math.round(s.n * (0.58 + i * .038 + (r() - .5) * .05)));

  // ---------- Journal des paiements ----------
  let seq = 1200;
  const payRef = () => 'REC-' + s.id.toUpperCase() + '-' + String(seq++);
  const pickMoyen = () => MOYENS[Math.floor(r() * MOYENS.length)];
  const statusHist = () => {
    const y = r();
    return y < .80 ? 'confirmé' : y < .89 ? 'déclaré' : y < .96 ? 'en attente' : 'annulé';
  };

  // Historique : 31 à 120 jours, sous-ensemble de renouvellements.
  mem.forEach(m => {
    const n = r() < .48 ? 0 : 1 + Math.floor(r() * 2);
    for (let k = 0; k < n; k++) {
      pay.push({
        ref: payRef(), m: m.id, montant: prixMembre(m), moyen: pickMoyen(),
        date: addDays(-(31 + Math.floor(r() * 89))), st: statusHist(),
        agent: AGENTS[Math.floor(r() * AGENTS.length)]
      });
    }
  });

  // Mois en cours : encaissements liés aux échéances et aux passages en caisse.
  // On remplit un panier proche du CA mensuel pour éviter des recettes incohérentes.
  const dueRate = [.86, .74, .62, .50, .40, .33, .28, .24, .21, .19, .17, .15];
  const target = Math.round(rev[11] * (0.74 + r() * 0.06));
  const candidates = mem.filter(m => {
    const st = statut(m);
    if (st === 'expiré' || st === 'suspendu') return false;
    return r() < dueRate[PLANS[m.plan].m - 1] * (0.8 + r() * 0.4);
  }).map(m => ({ m, amount: prixMembre(m) }));
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  let acc = 0;
  candidates.forEach(c => {
    if (acc + c.amount > target) return;
    acc += c.amount;
    const y = r();
    pay.push({
      ref: payRef(), m: c.m.id, montant: c.amount, moyen: pickMoyen(),
      date: addDays(-Math.floor(r() * 29)), st: y < .84 ? 'confirmé' : y < .94 ? 'déclaré' : 'en attente',
      agent: AGENTS[Math.floor(r() * AGENTS.length)]
    });
  });
  if (acc < target * .82) {
    const c = candidates.slice().sort((a, b) => a.amount - b.amount)[0];
    if (c) pay.push({
      ref: payRef(), m: c.m.id, montant: c.amount, moyen: pickMoyen(),
      date: addDays(-1 - Math.floor(r() * 5)), st: 'confirmé', agent: AGENTS[0]
    });
  }
  // Un dossier déclaré et un dossier en attente garantissent la démonstration du rapprochement.
  {
    const pool = mem.filter(m => ['actif', 'bientôt'].includes(statut(m)));
    const md = pool[Math.floor(r() * pool.length)] || mem[0];
    const ma = pool[Math.floor(r() * pool.length)] || mem[1] || mem[0];
    pay.push({
      ref: payRef(), m: md.id, montant: prixMembre(md), moyen: 'Orange Money',
      date: addDays(-(2 + Math.floor(r() * 8))), st: 'déclaré', agent: AGENTS[1]
    });
    pay.push({
      ref: payRef(), m: ma.id, montant: prixMembre(ma), moyen: 'Espèces',
      date: addDays(-(8 + Math.floor(r() * 10))), st: 'en attente', agent: AGENTS[2]
    });
  }

  // Trois encaissements du jour + une déclaration à vérifier (rapprochement).
  for (let i = 0; i < 3; i++) {
    const m = mem[Math.min(s.n - 1, 8 + Math.floor(r() * Math.max(1, s.n - 8)))];
    pay.push({
      ref: 'REC-' + s.id.toUpperCase() + '-J' + (i + 1),
      m: m.id, montant: prixMembre(m),
      moyen: i === 1 ? 'Espèces' : i === 2 ? 'Orange Money' : 'Wave',
      date: new Date(+AUJ + (8 + i * 2) * 3600000 + 12 * 60000),
      st: 'confirmé', agent: AGENTS[i % AGENTS.length]
    });
  }
  {
    const m = mem[Math.min(s.n - 1, 22 + Math.floor(r() * Math.max(1, s.n - 22)))];
    pay.push({
      ref: 'REC-' + s.id.toUpperCase() + '-JD',
      m: m.id, montant: prixMembre(m), moyen: 'Wave',
      date: new Date(+AUJ + 10 * 3600000 + 5 * 60000),
      st: 'déclaré', agent: AGENTS[2 % AGENTS.length]
    });
  }
  pay.sort((a, b) => b.date - a.date);

  // Présences du jour (une seule par adhérent actif ou à renouveler).
  const todayPool = mem.filter(m => ['actif', 'bientôt'].includes(statut(m)));
  for (let i = todayPool.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [todayPool[i], todayPool[j]] = [todayPool[j], todayPool[i]];
  }
  const nb = Math.min(freq[6], todayPool.length);
  for (let i = 0; i < nb; i++) {
    const m = todayPool[i];
    const minutes = Math.round(6 * 60 + (i / Math.max(1, nb - 1)) * 15 * 60 + (r() - .5) * 50);
    pre.push({
      at: new Date(+AUJ + Math.max(0, Math.min(20 * 60, minutes)) * 60000),
      m: m.id,
      ok: true,
      type: r() < .84 ? 'QR' : 'Manuel'
    });
  }

  // Historique de fréquentation sur 70 jours : alimente le portail et détecte les inactifs.
  mem.forEach(m => {
    const y = r();
    const lastOff = y < .60 ? 1 + Math.floor(r() * 13) : y < .82 ? 15 + Math.floor(r() * 18) : 34 + Math.floor(r() * 35);
    const count = 1 + Math.floor(r() * 4);
    for (let k = 0; k < count; k++) {
      const off = lastOff + Math.floor(r() * 10);
      pre.push({
        at: new Date(+AUJ - off * J + (7 + Math.floor(r() * 14)) * 3600000 + Math.floor(r() * 60) * 60000),
        m: m.id, ok: true, type: r() < .86 ? 'QR' : 'Manuel'
      });
    }
  });
  pre.sort((a, b) => a.at - b.at);

  const act = [
    ['Nouvel adhérent enregistré', mem[0].nom],
    ['Abonnement renouvelé', mem[3].nom],
    ['Paiement Wave enregistré', mem[5].nom],
    ['Présence validée par QR', mem[7].nom],
    ['Relance d’expiration envoyée', mem[9].nom]
  ];

  return { ...s, mem, pay, pre, rev, adh, freq, act, caisseFond: 50000, caisseClose: null };
}

const D = {};
SALLES.forEach(s => { D[s.id] = buildSalle(s); });

// ---------- Génération financière (hypothèses de démonstration) ----------
function buildFinance(s) {
  const d = D[s.id], r = rng(s.s * 173 + 7);
  const fixedBase = CHARGE_CATS.filter(c => c.type === 'fixe').reduce((a, c) => a + c.calc(s), 0);
  d.chg = Array.from({ length: 12 }, (_, i) => {
    const fixedM = fixedBase * (.95 + i * .004);
    const varM = d.rev[i] * VAR_SHARE + (r() - .5) * 12000;
    return Math.round((fixedM + varM) / 500) * 500;
  });
  const fixedNow = Math.round(fixedBase / 500) * 500;
  const varNow = Math.round(d.rev[11] * VAR_SHARE / 500) * 500;
  d.chg[11] = fixedNow + varNow;

  d.dep = [];
  const today = Math.max(1, AUJ.getDate());
  const atDay = day => new Date(AUJ.getFullYear(), AUJ.getMonth(), Math.min(today, Math.max(1, day)), 10, 0);
  let seq = 1;
  const depId = () => 'DEP-' + s.id.toUpperCase() + '-' + String(seq++).padStart(3, '0');
  CHARGE_CATS.filter(c => c.type === 'fixe').forEach((c, i) => {
    d.dep.push({
      id: depId(), label: c.n, catId: c.id, cat: 'fixe', icon: c.icon,
      amount: c.calc(s), date: atDay(1 + (i % 3)), moyen: i === 1 ? 'Virement' : 'Prélèvement', recurrent: true
    });
  });
  const variableCats = CHARGE_CATS.filter(c => c.type === 'variable');
  let left = varNow;
  variableCats.forEach((c, i) => {
    const amount = i === variableCats.length - 1 ? left : Math.round(varNow * (c.share / VAR_SHARE) / 100) * 100;
    left -= amount;
    d.dep.push({
      id: depId(), label: c.n, catId: c.id, cat: 'variable', icon: c.icon,
      amount: Math.max(0, amount), date: atDay(today - (i % Math.max(1, today))), moyen: ['Espèces', 'Wave', 'Virement', 'Espèces', 'Espèces'][i] || 'Espèces', recurrent: false
    });
  });
  d.dep.sort((a, b) => b.date - a.date);
  d.chg[11] = d.dep.reduce((a, x) => a + x.amount, 0);
}
SALLES.forEach(buildFinance);

const ALL = SALLES.map(s => s.id);
const sum = f => ALL.reduce((a, id) => a + f(id), 0);

// Dernière visite calculée à partir des présences
ALL.forEach(id => {
  D[id].mem.forEach(m => {
    const p = D[id].pre.filter(x => x.m === m.id);
    m.derniere = p.length ? p[p.length - 1].at : addDays(-(4 + (m.inscription.getDate() % 40)));
  });
});

const cnt = (s, st) => D[s].mem.filter(m => statut(m) === st).length;

function kp(id) {
  const d = D[id];
  const active = d.mem.filter(m => ['actif', 'bientôt'].includes(statut(m)));
  const act = active.length;
  const evo = d.rev[11] && d.rev[10] ? (d.rev[11] / d.rev[10] - 1) * 100 : 0;
  const since = +AUJ - 30 * J;
  const p30 = d.pay.filter(p => +new Date(p.date) >= since);
  const totalSt = st => p30.filter(p => p.st === st).reduce((a, p) => a + p.montant, 0);
  const encaisse = totalSt('confirmé');
  const declares = totalSt('déclaré');
  const attente = totalSt('en attente');
  const annule = totalSt('annulé');
  const impayes = declares + attente;
  const late = p30.filter(p => (p.st === 'déclaré' || p.st === 'en attente') && +new Date(p.date) < +AUJ - 7 * J);
  const objectif = Math.round(d.rev[11] * 1.05 / 1000) * 1000;
  return {
    tot: d.mem.length,
    act,
    exp: cnt(id, 'expiré'),
    soon: cnt(id, 'bientôt'),
    susp: cnt(id, 'suspendu'),
    inactifs: d.mem.filter(inactif).length,
    nouv: d.mem.filter(m => +new Date(m.inscription) >= +AUJ - 30 * J).length,
    renouv: d.mem.reduce((a, m) => a + (m.renouv || []).filter(x => +new Date(x.date) >= +AUJ - 30 * J).length, 0),
    rev: d.rev[11],
    chg: d.chg[11],
    profit: d.rev[11] - d.chg[11],
    marge: d.rev[11] ? Math.round((d.rev[11] - d.chg[11]) / d.rev[11] * 100) : 0,
    pres: d.freq[6],
    evo: Math.round(evo * 10) / 10,
    taux: Math.round((act / d.mem.length) * 100),
    encaisse,
    declares,
    attente,
    annule,
    impayes,
    retard: late.reduce((a, p) => a + p.montant, 0),
    nbRetard: late.length,
    recouvrement: encaisse + impayes ? Math.round(encaisse / (encaisse + impayes) * 100) : 100,
    objectif,
    atteinte: objectif ? Math.min(140, Math.round(encaisse / objectif * 100)) : 0,
    multi: d.mem.filter(m => m.multi).length,
    panier: act ? Math.round(d.rev[11] / act) : 0
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
    chg: sum(i => kp(i).chg),
    profit: sum(i => kp(i).profit),
    pres: sum(i => kp(i).pres),
    encaisse: sum(i => kp(i).encaisse),
    declares: sum(i => kp(i).declares),
    attente: sum(i => kp(i).attente),
    annule: sum(i => kp(i).annule),
    impayes: sum(i => kp(i).impayes),
    retard: sum(i => kp(i).retard),
    inactifs: sum(i => kp(i).inactifs),
    renouv: sum(i => kp(i).renouv),
    multi: sum(i => kp(i).multi)
  };
  net.taux = Math.round(net.act / net.tot * 100);
  net.marge = net.rev ? Math.round(net.profit / net.rev * 100) : 0;
  net.recouvrement = net.encaisse + net.impayes ? Math.round(net.encaisse / (net.encaisse + net.impayes) * 100) : 100;
  net.objectif = sum(i => kp(i).objectif);
  net.atteinte = net.objectif ? Math.round(net.encaisse / net.objectif * 100) : 0;
}
recalc();

// ---------- Finance : statuts, caisse, charges, prévisions ----------
const PAY_META = {
  'confirmé': { n: 'Encaissé', tone: 'b-ok', icon: 'circle-check', d: 'Paiement confirmé et encaissé' },
  'déclaré': { n: 'Déclaré', tone: 'b-info', icon: 'clock-rotate-left', d: 'Déclaré par l’adhérent, à vérifier' },
  'en attente': { n: 'En attente', tone: 'b-warn', icon: 'hourglass-half', d: 'En attente de règlement' },
  'annulé': { n: 'Annulé', tone: 'b-ko', icon: 'ban', d: 'Transaction annulée' }
};
const payMeta = st => PAY_META[st] || { n: st, tone: 'b-mut', icon: 'circle-question', d: '' };
const sameDay = (a, b) => { const x = new Date(a), y = new Date(b); return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate(); };
const payIn = (id, days) => D[id].pay.filter(p => +new Date(p.date) >= +AUJ - days * J);

function findPayment(ref) {
  for (const id of ALL) {
    const p = D[id].pay.find(x => x.ref === ref);
    if (p) return { site: id, pay: p };
  }
  return null;
}

function paymentStatus(ref, st) {
  const f = findPayment(ref);
  if (!f || !PAY_META[st]) return false;
  f.pay.st = st;
  f.pay.traite = new Date();
  recalc();
  return true;
}

function cashToday(id) {
  const list = D[id].pay.filter(p => sameDay(p.date, AUJ) && p.st === 'confirmé');
  const by = {};
  list.forEach(p => { by[p.moyen] = (by[p.moyen] || 0) + p.montant; });
  return { total: list.reduce((a, p) => a + p.montant, 0), by, list };
}

function declaredToday(id) {
  return D[id].pay.filter(p => sameDay(p.date, AUJ) && p.st === 'déclaré');
}

function chargeSplit(id) {
  const d = D[id];
  const rows = CHARGE_CATS.map(c => ({
    ...c,
    amount: d.dep.filter(x => x.catId === c.id).reduce((a, x) => a + x.amount, 0)
  })).filter(x => x.amount > 0);
  const fixe = rows.filter(x => x.type === 'fixe').reduce((a, x) => a + x.amount, 0);
  const variable = rows.filter(x => x.type === 'variable').reduce((a, x) => a + x.amount, 0);
  return { rows, fixe, variable, total: fixe + variable };
}

function finSite(id) {
  const d = D[id], k = kp(id), split = chargeSplit(id), cash = cashToday(id);
  return {
    id, site: d, ...k,
    ca: k.rev,
    dep: d.dep.slice(),
    split,
    cash,
    declaresJour: declaredToday(id),
    mrr: d.mem.filter(m => ['actif', 'bientôt'].includes(statut(m))).reduce((a, m) => a + planMensuel(m), 0),
    forecast: forecast(id)
  };
}

function finNet() {
  const rows = ALL.map(finSite);
  const acc = rows.reduce((a, x) => {
    a.rev += x.rev; a.chg += x.chg; a.profit += x.profit;
    a.encaisse += x.encaisse; a.impayes += x.impayes; a.declares += x.declares;
    a.attente += x.attente; a.retard += x.retard; a.cash += x.cash.total;
    a.dep += x.split.total; a.nbDep += x.dep.length;
    a.declaresJour += x.declaresJour.length;
    return a;
  }, { rev: 0, chg: 0, profit: 0, encaisse: 0, impayes: 0, declares: 0, attente: 0, retard: 0, cash: 0, dep: 0, nbDep: 0, declaresJour: 0, rows });
  acc.marge = acc.rev ? Math.round(acc.profit / acc.rev * 100) : 0;
  acc.recouvrement = acc.encaisse + acc.impayes ? Math.round(acc.encaisse / (acc.encaisse + acc.impayes) * 100) : 100;
  acc.objectif = rows.reduce((a, x) => a + x.objectif, 0);
  acc.atteinte = acc.objectif ? Math.round(acc.encaisse / acc.objectif * 100) : 0;
  return acc;
}

function forecast(id) {
  const d = D[id];
  const growth = Math.max(-.02, Math.min(.07, (d.rev[11] / d.rev[8] - 1) / 3));
  return Array.from({ length: 3 }, (_, i) => {
    const ca = Math.round(d.rev[11] * Math.pow(1 + growth, i + 1) / 1000) * 1000;
    const chg = Math.round(d.chg[11] * Math.pow(1 + Math.max(0, growth * .45), i + 1) / 1000) * 1000;
    return { mois: i + 1, ca, chg, profit: ca - chg, marge: ca ? Math.round((ca - chg) / ca * 100) : 0 };
  });
}

function addExpense(siteId, data) {
  const d = D[siteId];
  if (!d) return null;
  const id = 'DEP-' + siteId.toUpperCase() + '-' + String(d.dep.length + 1).padStart(3, '0');
  const cat = CHARGE_META[data.catId] || CHARGE_META.divers;
  const row = {
    id, label: data.label || cat.n, catId: cat.id, cat: cat.type, icon: cat.icon,
    amount: Math.max(0, Math.round(Number(data.amount) || 0)),
    date: data.date ? new Date(data.date) : new Date(),
    moyen: data.moyen || 'Espèces', recurrent: !!data.recurrent
  };
  d.dep.unshift(row);
  d.chg[11] = d.dep.reduce((a, x) => a + x.amount, 0);
  recalc();
  return row;
}

function removeExpense(siteId, depId) {
  const d = D[siteId];
  if (!d) return false;
  const i = d.dep.findIndex(x => x.id === depId);
  if (i < 0) return false;
  d.dep.splice(i, 1);
  d.chg[11] = d.dep.reduce((a, x) => a + x.amount, 0);
  recalc();
  return true;
}

// ---------- Abonnements : compteurs et alertes ----------
function subCounts(id) {
  const d = D[id], k = kp(id);
  return {
    total: k.tot,
    actifs: k.act,
    bientot: k.soon,
    expires: k.exp,
    suspendus: k.susp,
    inactifs: k.inactifs,
    demandes: d.mem.filter(m => m.demande && m.demande.statut === 'à traiter').length,
    auto: d.mem.filter(m => m.autoRenew).length,
    aRenouveler: k.soon + k.exp
  };
}

function subDue(id, level) {
  const d = D[id];
  return d.mem.filter(m => {
    const st = statut(m);
    if (st === 'expiré') return level === 'expiré';
    if (level === 'bientôt') return st === 'bientôt';
    const j = joursRestants(m);
    return level === 'J-7' ? j <= 7 : level === 'J-3' ? j <= 3 : level === 'J-1' ? j <= 1 : false;
  });
}

// ---------- Performance des salles ----------
function perfSite(id) {
  const k = kp(id);
  return {
    id, nom: siteName(id),
    act: k.act, rev: k.rev, profit: k.profit, marge: k.marge,
    renouv: k.renouv, nouv: k.nouv, pres: k.pres, impayes: k.impayes,
    encaisse: k.encaisse, taux: k.taux, inactifs: k.inactifs,
    panier: k.panier, evo: k.evo
  };
}

function perfNet() {
  const rows = ALL.map(perfSite);
  return {
    rows,
    act: rows.reduce((a, x) => a + x.act, 0),
    rev: rows.reduce((a, x) => a + x.rev, 0),
    profit: rows.reduce((a, x) => a + x.profit, 0),
    renouv: rows.reduce((a, x) => a + x.renouv, 0),
    nouv: rows.reduce((a, x) => a + x.nouv, 0),
    pres: rows.reduce((a, x) => a + x.pres, 0),
    impayes: rows.reduce((a, x) => a + x.impayes, 0),
    encaisse: rows.reduce((a, x) => a + x.encaisse, 0),
    inactifs: rows.reduce((a, x) => a + x.inactifs, 0)
  };
}

// ---------- Exports tableur (HTML compatible .xls) ----------
function tableHTML(title, headers, rows) {
  return '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8">' +
    '<style>table{border-collapse:collapse}th,td{border:1px solid #999;padding:6px;font-family:Arial;font-size:12px}th{background:#0E7A4B;color:#fff}</style>' +
    '</head><body><h2>' + esc(title) + '</h2><table><thead><tr>' +
    headers.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
    rows.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') +
    '</tbody></table></body></html>';
}

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
