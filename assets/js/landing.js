// ===== Landing =====
const IC = n => '<i class="fa-solid fa-'+n+'"></i>';
const rv = i => ' rv" style="--d:'+i*80+'ms'; // apparition au scroll
function landing(){
  const col = ['#176B45','#1d7d52','#14583a','#22804f'];
  const cards = SALLES.map((s,i) => '<div class="card hv'+rv(i)+'"><div class="salle-img" style="background:linear-gradient(135deg,#101512,'+col[i]+')">'+IC('dumbbell')+'&nbsp;'+s.id.toUpperCase()+'</div><h3>Jumeaux Fitness — '+s.nom+'</h3><p class="mut" style="margin:6px 0 12px"><b data-count="'+kp(s.id).act+'">0</b> adhérents actifs (données fictives)</p><button class="btn s p" onclick="go({view:\'salle\',salle:\''+s.id+'\',tab:\'dash\'})">Explorer cet établissement<i class="fa-solid fa-arrow-right r"></i></button></div>').join('');
  const adv = [['network-wired','Gestion centralisée','Une vue unique sur les quatre salles.'],['store','Autonomie de chaque salle','Chaque équipe gère ses adhérents et ses encaissements.'],['arrows-rotate','Abonnements intelligents','Statuts clairs, renouvellements sans perte d’historique.'],['qrcode','Contrôle QR','Le résultat d’accès s’affiche en une seconde.'],['mobile-screen','Espace adhérent','Carte numérique, reçus et historique sur smartphone.'],['chart-line','Vision stratégique','Comparer les salles et préparer la suivante.']].map((a,i) => '<div class="card hv'+rv(i%3)+'"><div class="ic">'+IC(a[0])+'</div><h3>'+a[1]+'</h3><p class="mut">'+a[2]+'</p></div>').join('');
  const flow = [['crown','Direction générale'],['location-dot','Établissements'],['users','Équipes'],['dumbbell','Adhérents']].map((n,i) => (i?'<div class="arrow"></div>':'')+'<div class="node" style="--d:'+i*1.5+'s">'+IC(n[0])+n[1]+'</div>').join('');
  const mq = Array(4).fill(SALLES).flat().map(s => '<span>'+IC('location-dot')+' '+s.nom+'</span>').join('');
  return '<div id="prog"></div><div class="lnav"><div class="wrap nav"><div class="logo">'+IC('dumbbell')+' JUMEAUX FITNESS <i>OS</i></div><div class="links"><a href="#etab">Établissements</a><a href="#avantages">Avantages</a><a href="#apercu">Aperçu</a></div><div class="row"><button class="btn s" aria-label="Thème" onclick="toggleTheme()">'+IC('circle-half-stroke')+'</button><button class="btn s p" onclick="startPres()">'+IC('play')+'Mode présentation</button></div></div></div>'+
  '<div style="position:relative"><div class="hero-bg"><div class="blob b1"></div><div class="blob b2"></div></div><div class="wrap hero"><div><span class="pill fadein"><span class="dot"></span>Prototype interactif — données fictives</span><h1 class="hero-h" style="margin-top:18px"><span><i style="--d:.1s">One platform.</i></span><span><i style="--d:.25s">Four gyms.</i></span><span><i style="--d:.4s">One connected experience.</i></span></h1><p class="lead fadein">Une nouvelle expérience numérique pour piloter, connecter et développer l’ensemble du réseau Jumeaux Fitness.</p><div class="row fadein"><button class="btn p shine" onclick="go({view:\'net\'})">'+IC('rocket')+'Découvrir la plateforme</button><button class="btn" onclick="document.getElementById(\'etab\').scrollIntoView({behavior:\'smooth\'})">Explorer les quatre établissements</button></div><p class="mut fadein" style="margin-top:14px;font-size:13px">Une plateforme. Quatre salles. Une gestion intelligente.</p></div>'+
  '<div class="mock"><div class="card" style="padding:14px"><div class="grid g3" style="gap:10px">'+kpi('Adhérents actifs','<span data-count="'+net.act+'">0</span>')+kpi('Présences du jour','<span data-count="'+net.pres+'">0</span>')+kpi('Établissements','<span data-count="4">0</span>')+'</div><div style="margin-top:10px">'+line(addv('rev').map(v=>Math.round(v/1e4)/100),MOIS,'Revenus réseau sur 12 mois',' M FCFA')+'</div></div><span class="pill fl" style="top:-16px;right:8px">'+IC('qrcode')+'Accès autorisé</span><span class="pill fl" style="bottom:-16px;left:8px;animation-delay:-2.5s">'+IC('circle-check')+'Paiement Wave enregistré</span></div></div></div>'+
  '<div class="mq"><div>'+mq+'</div></div>'+
  '<div class="wrap"><div class="sec" id="etab"><h2 class="rv">Une vision, quatre établissements</h2><p class="mut rv" style="margin-bottom:18px">Une seule plateforme. Chaque salle garde ses propres données.</p><div class="grid g4">'+cards+'</div></div>'+
  '<div class="sec" id="avantages"><h2 class="rv" style="margin-bottom:18px">Pourquoi cette plateforme ?</h2><div class="grid g3">'+adv+'</div></div>'+
  '<div class="sec"><h2 class="rv" style="margin-bottom:22px">Une expérience connectée</h2><div class="flow">'+flow+'</div></div>'+
  '<div class="sec" id="apercu"><h2 class="rv">Aperçu du produit</h2><p class="mut rv" style="margin-bottom:18px">Les composants ci-dessous sont ceux du prototype.</p><div class="grid g2 rv">'+bars(D.km.freq,['L','M','M','J','V','S','D'],'Fréquentation hebdomadaire — Keur Massar')+activity('km')+'</div><div class="row rv" style="margin-top:16px"><button class="btn" onclick="go({view:\'portal\'})">'+IC('mobile-screen')+'Voir l’espace adhérent</button><button class="btn" onclick="go({view:\'salle\',tab:\'pre\'})">'+IC('qrcode')+'Tester le scanner QR</button></div></div>'+
  '<div class="final rv"><h2>Le futur de Jumeaux Fitness commence ici.</h2><div style="margin-top:20px"><button class="btn p shine" onclick="go({view:\'net\'})">Explorer la démonstration interactive</button></div></div>'+
  '<footer class="mut" style="padding:28px 0;font-size:13px">JUMEAUX FITNESS OS — Prototype de démonstration — données fictives, fonctionnalités simulées.</footer></div>';
}
// Effets : apparition au scroll, compteurs, barre de progression
function count(n){
  if(n.dataset.done) return; n.dataset.done = 1;
  const to = +n.dataset.count, t0 = performance.now();
  const tick = t => { const k = Math.min(1,(t-t0)/1200); n.textContent = Math.round(to*(1-Math.pow(1-k,3))); if(k<1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function initFx(){
  const io = new IntersectionObserver(es => es.forEach(e => { if(!e.isIntersecting) return; e.target.classList.add('in'); e.target.querySelectorAll('[data-count]').forEach(count); io.unobserve(e.target); }), {threshold:.15});
  document.querySelectorAll('.rv').forEach(n => io.observe(n));
  document.querySelectorAll('.hero [data-count]').forEach(count);
  onscroll = () => { const p = $('prog'); if(p) p.style.width = scrollY/Math.max(1,document.body.scrollHeight-innerHeight)*100+'%'; };
}
