// ===== Présentation =====
const STEPS = [
 [{view:'land'},'Vision Jumeaux Fitness OS','Une plateforme, quatre salles, une gestion intelligente.'],
 [{view:'etab'},'Les quatre établissements','Chaque salle a son propre espace et ses propres données.'],
 [{view:'net'},'Dashboard de la direction','Indicateurs consolidés, comparaison des salles, alertes.'],
 [{view:'salle',salle:'pa',tab:'dash'},'Gestion indépendante des salles','Changez de salle : toutes les données changent (ici Parcelles).'],
 [{view:'salle',salle:'km',tab:'mem',filter:'tous',q:'',page:0},'Gestion des adhérents','Recherche, filtres, fiche, QR, ajout simulé.'],
 [{view:'salle',salle:'km',tab:'abo'},'Abonnements et paiements','Renouvellement simulé, historique conservé, reçus.'],
 [{view:'salle',salle:'km',tab:'pre'},'Contrôle QR','Lancez un scan : autorisé, expiré, invalide ou autre salle.'],
 [{view:'portal'},'Espace adhérent','Carte numérique, QR, abonnement et reçus sur smartphone.'],
 [{view:'net'},'Bénéfices pour la direction','Moins d’erreurs, accueil plus rapide, vision réseau, expansion préparée.'],
 [{view:'land'},'Conclusion','Prochaine étape : un cadrage avec les responsables, puis un pilote dans une salle.']];
let ps = 0;
function startPres(){ document.body.classList.add('pres'); ps = 0; applyStep(); }
function endPres(){ document.body.classList.remove('pres'); if(document.fullscreenElement) document.exitFullscreen(); render(); }
function step(d){ ps = Math.max(0, Math.min(STEPS.length-1, ps+d)); applyStep(); }
function applyStep(){ const s = STEPS[ps]; if(s[0].view==='portal') S.logged = true; Object.assign(S, s[0]); render(); $('pt').textContent = s[1]; $('px').textContent = s[2]; $('pc').textContent = (ps+1)+' / '+STEPS.length; $('pp').style.width = (ps+1)/STEPS.length*100+'%'; }
document.addEventListener('keydown', e => { if(!document.body.classList.contains('pres')||/INPUT|SELECT/.test(e.target.tagName)) return; if(e.key==='ArrowRight') step(1); if(e.key==='ArrowLeft') step(-1); if(e.key==='Escape') endPres(); });
