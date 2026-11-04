// ============================================================================
// Page d'accueil commerciale
// ============================================================================
const rv = (i = 0) => ' rv" style="--d:' + i * 70 + 'ms';

function etabCard(s, i) {
  const k = kp(s.id);
  return '<article class="card etab-card hv' + rv(i) + '">' +
    '<div class="etab-top" style="--c:' + s.color + '">' +
      '<span class="etab-code">' + s.id.toUpperCase() + '</span>' +
      '<span class="etab-mark" aria-hidden="true">' + ICON('dumbbell') + '</span>' +
      '<span class="etab-open">Ouvert en ' + s.ouvert + '</span>' +
    '</div>' +
    '<div class="etab-body">' +
      '<h3>Jumeaux Fitness — ' + esc(s.nom) + '</h3>' +
      '<p class="mut">' + esc(s.adresse) + '</p>' +
      '<span class="site-tag" style="--c:' + s.color + '">' + ICON('palette') + esc(s.palette) + '</span>' +
      '<div class="etab-stats">' +
        '<span><b data-count="' + k.act + '">0</b>actifs</span>' +
        '<span><b data-count="' + Math.round(k.rev / 1000) + '">0</b>k FCFA / mois</span>' +
        '<span><b data-count="' + k.taux + '">0</b>% de rétention</span>' +
      '</div>' +
      '<button class="btn s w" onclick="go({view:\'salle\',salle:\'' + s.id + '\',tab:\'dash\'})">Ouvrir le back-office ' + ICON('arrow-right') + '</button>' +
    '</div></article>';
}

function landing() {
  const k = net;
  const revM = (k.rev / 1e6).toFixed(1).replace('.', ',');
  const monthly = addv('rev');
  const maxRev = Math.max(...monthly);
  const sparkBars = monthly.map((v, i) => '<i style="height:' + Math.max(8, v / maxRev * 100) + '%;--d:' + i * 50 + 'ms"></i>').join('');
  const mini = D.km.pay.slice(0, 3);
  const memory = D.km.mem.find(m => statut(m) === 'actif') || D.km.mem[0];

  const marquee = Array(3).fill(SALLES).flat().map(s =>
    '<span><i class="fa-solid fa-location-dot"></i>' + s.nom + '</span>'
  ).join('');

  const features = [
    ['users', 'Adhérents & abonnements', 'Une fiche unique par client : formule, échéance, historique, multi-salles. Plus de doublons.', 'Fiches, filtres, relances'],
    ['qrcode', 'Contrôle d’accès QR', 'Le QR de l’adhérent est lu en une seconde. Le résultat est clair, même sans connexion.', 'Autorisé · refusé · mauvaise salle'],
    ['money-bill-wave', 'Paiements traçables', 'Chaque encaissement génère une référence et un reçu. Wave, Orange Money, espèces ou carte.', 'Caisse, reçus, export'],
    ['shield-halved', 'Centre anti-erreurs', 'L’application détecte les fiches incomplètes, les doublons et les paiements à vérifier.', 'Correction en un clic'],
    ['chart-line', 'Statistiques du réseau', 'Comparez les salles, suivez les revenus et anticipez les départs. La version connectée sera en temps réel.', 'Vue direction consolidée'],
    ['mobile-screen', 'Espace adhérent', 'Carte numérique, QR, abonnement, reçus et historique accessibles depuis un smartphone.', 'Sans application à installer'],
    ['rocket', 'Prêt pour l’expansion', 'Ajoutez une salle sans changer d’outil. Les règles et les indicateurs suivent.', 'Projection à 5 salles'],
    ['handshake', 'Accueil plus rapide', 'L’équipe voit l’essentiel au premier regard et peut proposer le bon renouvellement.', '3 secondes par passage']
  ].map((f, i) =>
    '<article class="card feat hv' + rv(i % 4) + '"><span class="feat-ic">' + ICON(f[0]) + '</span>' +
    '<h3>' + f[1] + '</h3><p class="mut">' + f[2] + '</p><span class="feat-tag">' + f[3] + '</span></article>'
  ).join('');

  const steps = [
    ['07:30', 'L’adhérent arrive', 'L’accueil scanne son QR. Sa photo, sa formule et son échéance s’affichent. Accès validé en 3 secondes.', 'qrcode'],
    ['08:05', 'Le gérant encaisse', 'Un renouvellement trimestriel est réglé par Wave. Le reçu est généré, l’échéance mise à jour.', 'money-bill-wave'],
    ['12:40', 'La direction regarde', 'Keur Massar et Parcelles progressent. Les indicateurs des salles sont comparés sur un seul écran.', 'chart-pie'],
    ['18:15', 'La journée est close', 'Les présences, les impayés et les anomalies sont listés. Rien ne dépend d’un fichier Excel oublié.', 'clipboard-check']
  ].map((s, i) =>
    '<div class="step rv" style="--d:' + i * 80 + 'ms"><span class="step-time">' + s[0] + '</span><span class="step-dot">' + ICON(s[3]) + '</span>' +
    '<div><h3>' + s[1] + '</h3><p class="mut">' + s[2] + '</p></div></div>'
  ).join('');

  const entry = [
    ['chart-pie', 'Vue direction', 'Les 4 salles, les revenus, les alertes et le flux des passages.', 'go({view:\'net\'})', 'Ouvrir la direction', 'p'],
    ['store', 'Back-office d’une salle', 'Adhérents, abonnements, paiements, scanner QR et contrôle qualité.', 'go({view:\'salle\',salle:\'km\',tab:\'dash\'})', 'Entrer dans Keur Massar', ''],
    ['mobile-screen', 'Espace adhérent', 'La carte numérique telle que la voit le client, sur son téléphone.', 'go({view:\'portal\'})', 'Voir l’espace membre', '']
  ].map((e, i) =>
    '<button class="try rv" style="--d:' + i * 80 + 'ms" onclick="' + e[3] + '">' +
    '<span class="try-ic">' + ICON(e[0]) + '</span><b>' + e[1] + '</b><span class="mut">' + e[2] + '</span>' +
    '<span class="try-go">' + e[4] + ' ' + ICON('arrow-right') + '</span></button>'
  ).join('');

  return '<div id="prog"></div>' +

  // ---------------- Navigation ----------------
  '<header class="lnav"><div class="wrap nav">' +
    '<a class="brand" href="#top" aria-label="Jumeaux Fitness OS, accueil"><span class="mark">' + ICON('dumbbell') + '</span><span class="brand-t">JUMEAUX <b>OS</b></span></a>' +
    '<nav class="links" aria-label="Navigation principale"><a href="#produit">Le produit</a><a href="#fonctions">Fonctionnalités</a><a href="#etablissements">Établissements</a><a href="#demo">Essayer</a></nav>' +
    '<div class="row gap8">' +
      '<button class="btn icon" aria-label="Changer de thème" data-tip="Thème clair / sombre" onclick="toggleTheme()">' + ICON('circle-half-stroke') + '</button>' +
      '<button class="btn p s" onclick="startPres()">' + ICON('play') + '<span>Mode présentation</span></button>' +
    '</div>' +
  '</div></header>' +

  '<main id="top">' +
  // ---------------- Hero ----------------
  '<section class="hero">' +
    '<div class="hero-glow" aria-hidden="true"></div><div class="hero-grid-bg" aria-hidden="true"></div>' +
    '<div class="wrap hero-in">' +
      '<div class="hero-copy">' +
        '<span class="pill dark fadein"><span class="dot"></span>Démonstration interactive · données fictives</span>' +
        '<h1 class="hero-h" style="margin-top:22px">' +
          '<span><i style="--d:.05s">Une plateforme.</i></span>' +
          '<span><i style="--d:.18s">Quatre salles.</i></span>' +
          '<span><i style="--d:.31s" class="serif">Une expérience connectée.</i></span>' +
        '</h1>' +
        '<p class="lead fadein">Pilotez les adhérents, les abonnements, les accès et les paiements de tout le réseau Jumeaux Fitness — depuis un seul endroit, sans perdre l’autonomie de chaque salle.</p>' +
        '<div class="row gap12 fadein" style="margin-top:26px">' +
          '<button class="btn p lg shine" onclick="go({view:\'net\'})">' + ICON('rocket') + 'Découvrir la plateforme</button>' +
          '<a class="btn ghost lg" href="#demo">Voir la démonstration ' + ICON('arrow-down') + '</a>' +
        '</div>' +
        '<div class="hero-stats fadein">' +
          '<span><b data-count="' + k.act + '">0</b><small>adhérents actifs</small></span>' +
          '<span><b data-count="4">0</b><small>établissements</small></span>' +
          '<span><b data-count="' + Math.round(k.rev / 100000) / 10 + '" data-dec="1">0</b><small>M FCFA / mois</small></span>' +
        '</div>' +
        '<p class="hero-note fadein">' + ICON('circle-info') + 'Aucun compte, aucun serveur, aucune donnée envoyée. La caméra n’est activée que si vous la demandez. Tout fonctionne dans votre navigateur.</p>' +
      '</div>' +

      '<div class="mock fadein" aria-hidden="true">' +
        '<div class="win">' +
          '<div class="win-bar"><span class="win-dots"><i></i><i></i><i></i></span><span class="win-url">' + ICON('lock') + 'jumeaux-os.app / direction</span><span class="win-live"><i></i>direct</span></div>' +
          '<div class="win-body">' +
            '<aside class="win-side">' + ['chart-pie', 'users', 'qrcode', 'money-bill-wave', 'chart-line', 'gear'].map((x, i) => '<span class="' + (i === 0 ? 'on' : '') + '">' + ICON(x) + '</span>').join('') + '</aside>' +
            '<div class="win-main">' +
              '<div class="win-head"><div><small>Vue générale</small><b>Bonjour, direction</b></div><span class="win-pill">' + ICON('location-dot') + '4 salles</span></div>' +
              '<div class="win-kpis">' +
                '<div><small>Actifs</small><b data-count="' + k.act + '">0</b><em>+12 ce mois</em></div>' +
                '<div><small>Présences</small><b data-count="' + k.pres + '">0</b><em>aujourd’hui</em></div>' +
                '<div><small>Revenus</small><b>' + revM + '</b><em>M FCFA</em></div>' +
              '</div>' +
              '<div class="win-chart"><div class="win-chart-h"><span>Revenus réseau</span><span class="up">+12,4 %</span></div><div class="mini-bars">' + sparkBars + '</div></div>' +
              '<div class="win-list">' + mini.map(p => {
                const m = findMembre(p.m);
                return '<div class="win-row">' + avatar(m.nom) + '<span><b>' + esc(m.nom) + '</b><small>' + esc(p.moyen) + ' · ' + dstr(p.date) + '</small></span><em>' + fmtShort(p.montant) + '</em></div>';
              }).join('') + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="float-card">' + qrSvg(memory, 72) + '<div><small>Carte adhérent</small><b>' + esc(memory.nom) + '</b><span class="ok-t"><i></i>Actif · ' + joursRestants(memory) + ' jours</span></div></div>' +
        '<div class="float-pill ok">' + ICON('circle-check') + 'Accès autorisé <small>3 s</small></div>' +
        '<div class="float-pill pay">' + ICON('wave-square') + 'Wave · ' + fmt(40000) + '</div>' +
      '</div>' +
    '</div>' +
  '</section>' +

  // ---------------- Bandeau lieux ----------------
  '<div class="mq" aria-label="Les établissements du réseau"><div>' + marquee + '</div></div>' +

  // ---------------- Problème / réponse ----------------
  '<section class="wrap sec" id="produit">' +
    '<div class="sec-head">' +
      '<span class="eyebrow">Le quotidien, aujourd’hui</span>' +
      '<h2>Quatre salles, quatre façons de travailler.<br><span class="serif">Un seul pilotage.</span></h2>' +
      '<p class="mut">Les fichiers partagés, les cahiers et les messages WhatsApp finissent toujours par créer des écarts. La démonstration montre une alternative simple, pensée pour le terrain.</p>' +
    '</div>' +
    '<div class="grid g4">' +
      [['file-excel', 'Des données éparpillées', 'Chaque salle tient son fichier. La direction recompose le total à la main.'],
       ['triangle-exclamation', 'Des erreurs administratives', 'Doublons, oublis de renouvellement, paiements notés deux fois.'],
       ['stopwatch', 'Un accueil qui ralentit', 'Chercher une fiche pendant qu’un adhérent attend devant le comptoir.'],
       ['chart-line', 'Une vision en retard', 'Les chiffres du mois arrivent quand il est déjà trop tard pour réagir.']
      ].map((p, i) => '<article class="card pain hv' + rv(i) + '"><span class="pain-ic">' + ICON(p[0]) + '</span><h3>' + p[1] + '</h3><p class="mut">' + p[2] + '</p></article>').join('') +
    '</div>' +
    '<div class="answer rv">' +
      '<div><span class="eyebrow light">La réponse Jumeaux OS</span><h3 class="serif">« Le bon adhérent, la bonne formule, au bon endroit — en un coup d’œil. »</h3></div>' +
      '<div class="answer-stats">' +
        ['<b>1</b><small>fiche par adhérent</small>', '<b>3 s</b><small>par contrôle d’accès</small>', '<b>0</b><small>double saisie</small>', '<b>4</b><small>salles consolidées</small>'].map(x => '<span>' + x + '</span>').join('') +
      '</div>' +
    '</div>' +
    '<p class="tiny center mut" style="margin-top:12px">Objectifs indicatifs d’une organisation correctement configurée — à valider lors du pilote.</p>' +
  '</section>' +

  // ---------------- Dossier commercial 01–04 ----------------
  '<section class="wrap sec" id="dossier">' +
    '<div class="sec-head">' +
      '<span class="eyebrow">Le dossier de présentation</span>' +
      '<h2>Du problème constaté<br><span class="serif">au déploiement progressif.</span></h2>' +
      '<p class="mut max-md">Une trame simple à présenter au PDG : ce qui bloque aujourd’hui, ce que la plateforme propose, les bénéfices attendus — en scénarios, jamais en promesses — et la méthode de mise en service.</p>' +
    '</div>' +
    '<div class="pitch-grid">' +
      '<article class="card pitch-card hv' + rv(0) + '"><span class="pitch-num">01</span><span class="pitch-ic">' + ICON('triangle-exclamation') + '</span>' +
        '<h3>Les problèmes actuels</h3><p class="mut">Le réseau grandit, mais les outils restent artisanaux.</p>' +
        '<ul class="pitch-list">' +
          ['Fichiers Excel séparés par salle, consolidés à la main', 'Renouvellements oubliés et paiements notés deux fois', 'Aucune vision fiable des impayés et de la caisse du jour', 'Accueil ralenti par la recherche de fiches', 'Décisions prises sur des chiffres déjà périmés'].map(x => '<li>' + ICON('circle-xmark') + x + '</li>').join('') +
        '</ul>' +
        '<div class="pitch-scenario warn">' + ICON('calculator') + '<span><b>Coût du statu quo :</b> à chiffrer ensemble avec les vrais volumes. La démonstration ne prétend pas connaître les pertes réelles de Jumeaux Fitness.</span></div>' +
      '</article>' +
      '<article class="card pitch-card hv' + rv(1) + '"><span class="pitch-num">02</span><span class="pitch-ic">' + ICON('layer-group') + '</span>' +
        '<h3>La solution proposée</h3><p class="mut">Une plateforme unique, des espaces adaptés à chaque rôle.</p>' +
        '<ul class="pitch-list">' +
          ['Direction : consolidé financier, performance des quatre salles, alertes', 'Gérant : adhérents, abonnements, caisse et rapprochement', 'Accueil : QR d’accès, encaissement, reçu immédiat', 'Adhérent : carte numérique, paiement, présences, planning', 'Exports Excel / PDF et journal des opérations'].map(x => '<li>' + ICON('circle-check') + x + '</li>').join('') +
        '</ul>' +
        '<button class="btn s w" style="margin-top:12px" onclick="go({view:\'net\'})">' + ICON('arrow-right') + 'Voir la plateforme en action</button>' +
      '</article>' +
      '<article class="card pitch-card hv' + rv(2) + '"><span class="pitch-num">03</span><span class="pitch-ic">' + ICON('chart-line') + '</span>' +
        '<h3>Les bénéfices attendus</h3><p class="mut">Des objectifs mesurables, présentés comme des hypothèses.</p>' +
        '<div class="pitch-benefits">' +
          '<span><b>−50 %</b><small>temps de recherche d’une fiche <em>objectif pilote</em></small></span>' +
          '<span><b>+5 à 10 pts</b><small>recouvrement simulé <em>hypothèse</em></small></span>' +
          '<span><b>100 %</b><small>des relances tracées <em>objectif</em></small></span>' +
          '<span><b>1 écran</b><small>pour comparer les 4 salles <em>démo</em></small></span>' +
        '</div>' +
        '<div class="pitch-scenario info">' + ICON('flask') + '<span><b>Scénarios à valider :</b> les montants et pourcentages varient selon les tarifs, la saisonnalité et la discipline de caisse. Aucun gain n’est garanti.</span></div>' +
      '</article>' +
      '<article class="card pitch-card pitch-deploy hv' + rv(3) + '"><span class="pitch-num">04</span><span class="pitch-ic">' + ICON('route') + '</span>' +
        '<h3>Le plan de déploiement</h3><p class="mut">Cinq étapes, une salle pilote, puis une montée progressive.</p>' +
        '<div class="deploy">' +
          [['1', 'Présentation', 'Démonstration au PDG et aux gérants.', '1 h'],
           ['2', 'Validation', 'Périmètre, tarifs, rôles et règles multi-salles.', '1 semaine'],
           ['3', 'Développement', 'Adaptation aux vrais processus et données.', '4–6 semaines'],
           ['4', 'Tests sur une salle', 'Pilote à Keur Massar, formation et corrections.', '3–4 semaines'],
           ['5', 'Déploiement progressif', 'Extension aux trois autres salles, site par site.', '2–3 semaines']].map(s =>
            '<div class="deploy-step"><span class="deploy-n">' + s[0] + '</span><div><b>' + s[1] + '</b><small>' + s[2] + '</small></div><em>' + s[3] + '</em></div>').join('') +
        '</div>' +
        '<div class="pitch-scenario ok">' + ICON('flag-checkered') + '<span><b>Décision go / no-go</b> après le pilote, sur des critères validés ensemble — pas sur une promesse commerciale.</span></div>' +
      '</article>' +
    '</div>' +
    '<div class="pitch-final rv">' +
      '<div><span class="eyebrow light">Prochaine étape</span><h3 class="serif">Valider les hypothèses avec les vrais chiffres Jumeaux Fitness.</h3>' +
      '<p>La démonstration est prête. Il reste à confronter les tarifs, charges, impayés et objectifs aux données réelles, puis à cadrer le pilote.</p></div>' +
      '<div class="row gap8 wrap-row"><button class="btn p" onclick="go({view:\'fin\'})">' + ICON('scale-balanced') + 'Ouvrir la finance</button><button class="btn ghost" onclick="startPres()">' + ICON('play') + 'Lancer la présentation</button></div>' +
    '</div>' +
  '</section>' +

  // ---------------- Fonctionnalités ----------------
  '<section class="wrap sec" id="fonctions">' +
    '<div class="sec-head split">' +
      '<div><span class="eyebrow">Ce que l’on peut faire</span><h2>Huit briques,<br><span class="serif">une seule expérience.</span></h2></div>' +
      '<p class="mut max-sm">Chaque écran de la démonstration est cliquable. Rien n’est une maquette figée : les filtres, les scans, les renouvellements et les exports fonctionnent réellement, sur des données fictives.</p>' +
    '</div>' +
    '<div class="grid g4">' + features + '</div>' +
  '</section>' +

  // ---------------- Journée ----------------
  '<section class="wrap sec">' +
    '<div class="sec-head"><span class="eyebrow">Une journée avec Jumeaux OS</span><h2>Moins d’allers-retours.<br><span class="serif">Plus de temps pour les adhérents.</span></h2></div>' +
    '<div class="timeline">' + steps + '</div>' +
  '</section>' +

  // ---------------- Établissements ----------------
  '<section class="wrap sec" id="etablissements">' +
    '<div class="sec-head split"><div><span class="eyebrow">Le réseau</span><h2>Quatre établissements,<br><span class="serif">chacun chez soi.</span></h2></div>' +
    '<p class="mut max-sm">Une salle garde ses équipes, ses horaires et ses encaissements. La direction voit le total, jamais le désordre.</p></div>' +
    '<div class="grid g4">' + SALLES.map(etabCard).join('') + '</div>' +
  '</section>' +

  // ---------------- Essayer ----------------
  '<section class="wrap sec" id="demo">' +
    '<div class="sec-head"><span class="eyebrow">Essayez maintenant</span><h2>Trois portes d’entrée.<br><span class="serif">Aucune installation.</span></h2></div>' +
    '<div class="try-grid">' + entry + '</div>' +
    '<div class="demo-note rv">' + ICON('wand-magic-sparkles') + '<span><b>Astuce de démonstration.</b> Ouvrez le <a href="#" onclick="startPres();return false;">mode présentation</a> pour un parcours guidé de 17 étapes, ou testez le scanner QR dans le back-office de Keur Massar.</span></div>' +
  '</section>' +

  // ---------------- Expansion ----------------
  '<section class="wrap sec">' +
    '<div class="expansion rv">' +
      '<div class="exp-copy"><span class="eyebrow light">La suite</span><h2>Ouvrir la 5<sup>e</sup> salle ne devrait pas rouvrir un fichier Excel.</h2>' +
      '<p>Le réseau est déjà prêt : rôles, formules, règles multi-salles et indicateurs sont communs. La démonstration projette l’impact d’un nouvel établissement en quelques secondes.</p>' +
      '<button class="btn p" onclick="go({view:\'exp\'})">' + ICON('rocket') + 'Simuler une nouvelle salle</button></div>' +
      '<div class="exp-nums">' +
        '<div><small>Adhérents réseau</small><b data-count="' + k.act + '">0</b></div>' +
        '<div><small>Revenus mensuels</small><b>' + revM + '<em> M</em></b></div>' +
        '<div><small>Salles connectées</small><b>4<em> / 4</em></b></div>' +
      '</div>' +
    '</div>' +
  '</section>' +

  // ---------------- Conclusion ----------------
  '<section class="wrap sec">' +
    '<div class="final rv">' +
      '<span class="pill dark">' + ICON('circle-check') + 'Prototype prêt à être présenté</span>' +
      '<h2>Le futur de Jumeaux Fitness<br><span class="serif">commence par une démonstration.</span></h2>' +
      '<p>Explorez librement, puis cadrons ensemble la vraie plateforme : rôles, tarifs et règles multi-salles.</p>' +
      '<div class="row gap12 center">' +
        '<button class="btn p lg shine" onclick="go({view:\'net\'})">' + ICON('arrow-right') + 'Explorer la démonstration</button>' +
        '<button class="btn ghost lg" onclick="startPres()">' + ICON('play') + 'Lancer la présentation</button>' +
      '</div>' +
      '<small class="mut">Prototype commercial · données fictives · fonctionnalités simulées · aucun paiement réel</small>' +
    '</div>' +
  '</section>' +
  '</main>' +

  '<footer class="lfoot"><div class="wrap"><div class="brand small"><span class="mark">' + ICON('dumbbell') + '</span><span class="brand-t">JUMEAUX <b>OS</b></span></div>' +
  '<p class="mut">Jumeaux Fitness OS — démonstration statique HTML, CSS et JavaScript. Aucun backend, aucune donnée personnelle, aucun paiement réel.</p>' +
  '<div class="foot-links"><a href="#produit">Le produit</a><a href="#etablissements">Établissements</a><a href="#demo">Démonstration</a><button class="linkbtn" onclick="go({view:\'set\'})">Paramètres</button></div>' +
  '</div></footer>';
}

// ---------- Effets : apparition, compteurs, progression ----------
function count(node) {
  if (node.dataset.done) return;
  node.dataset.done = '1';
  const to = parseFloat(node.dataset.count);
  const dec = +(node.dataset.dec || 0);
  const t0 = performance.now();
  const dur = 1100;
  const tick = t => {
    const k = Math.min(1, (t - t0) / dur);
    const v = to * (1 - Math.pow(1 - k, 3));
    node.textContent = dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initFx() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(count);
      if (e.target.dataset.count) count(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(n => io.observe(n));
  document.querySelectorAll('.hero [data-count]').forEach(count);
  const onScroll = () => {
    const p = $('prog');
    if (p) p.style.width = (scrollY / Math.max(1, document.body.scrollHeight - innerHeight) * 100) + '%';
    document.querySelector('.lnav')?.classList.toggle('scrolled', scrollY > 12);
  };
  window.onscroll = onScroll;
  onScroll();
}
