// ===== Actions =====
function fiche(id){
  const m = memb(id);
  openModal('<div class="row sp"><h3>'+esc(m.nom)+'</h3>'+bdg(statut(m))+'</div><div class="row" style="margin-top:12px">'+qrSvg(m.id,110)+'<div class="mut">'+m.id+'<br>'+PLANS[m.plan].n+' · expire le '+dstr(m.exp)+'<br><small>QR de démonstration</small></div></div><div class="f"><label>Nom<input id="en" value="'+esc(m.nom)+'"></label><label>Téléphone fictif<input id="et" value="'+esc(m.tel)+'"></label></div><div class="row" style="margin-top:14px"><button class="btn p" onclick="saveM(\''+m.id+'\')">Enregistrer</button><button class="btn" onclick="renew(\''+m.id+'\')">Simuler un renouvellement</button><button class="btn" onclick="closeModal()">Fermer</button></div>');
}
function saveM(id){ const m = memb(id); m.nom = $('en').value.trim() || m.nom; m.tel = $('et').value.trim() || m.tel; closeModal(); render(); toast('Fiche modifiée (local)'); }
function addForm(){ openModal('<h3>Nouvel adhérent (simulation)</h3><div class="f"><label>Nom complet<input id="an"></label><label>Téléphone fictif<input id="at" value="77 000 00 00"></label><label>Formule<select id="ap">'+PLANS.map((p,i)=>'<option value="'+i+'">'+p.n+' — '+fmt(p.p)+'</option>').join('')+'</select></label></div><div class="row" style="margin-top:14px"><button class="btn p" onclick="addM()">Créer</button><button class="btn" onclick="closeModal()">Annuler</button></div>'); }
function addM(){
  const nom = $('an').value.trim(); if(!nom) return toast('Saisissez un nom');
  const d = D[S.salle], p = +$('ap').value, id = S.salle.toUpperCase()+'-'+String(d.mem.length+1).padStart(4,'0');
  d.mem.unshift({id, nom, tel:$('at').value, plan:p, exp:new Date(+AUJ + PLANS[p].j*J), susp:false});
  d.pay.unshift({ref:'REC-'+id, m:id, montant:PLANS[p].p, moyen:'Espèces', date:AUJ, st:'confirmé'});
  d.act.unshift(['Nouvel adhérent enregistré', nom]);
  closeModal(); render(); toast('Adhérent créé (simulation)');
}
function renew(id){
  const m = memb(id), base = m.exp > AUJ ? m.exp : AUJ, d = D[id.slice(0,2).toLowerCase()];
  m.exp = new Date(+base + PLANS[m.plan].j*J); m.susp = false;
  d.pay.unshift({ref:'REC-'+id+'-R', m:id, montant:PLANS[m.plan].p, moyen:'Wave', date:AUJ, st:'confirmé'});
  d.act.unshift(['Abonnement renouvelé', m.nom]);
  closeModal(); render(); toast('Renouvellement simulé — aucun vrai paiement');
}
function receipt(i){
  const p = D[S.salle].pay[i], m = memb(p.m);
  openModal('<h3>Reçu fictif</h3><p class="mut">Jumeaux Fitness — '+D[S.salle].nom+'</p><hr style="border:0;border-top:1px solid var(--bd);margin:12px 0"><p>Référence : <b>'+p.ref+'</b></p><p>Adhérent : '+esc(m.nom)+'</p><p>Montant : <b>'+fmt(p.montant)+'</b> ('+p.moyen+')</p><p>Date : '+dstr(p.date)+' · '+p.st+'</p><p class="mut" style="margin-top:10px;font-size:12px">Document de démonstration — sans valeur comptable.</p><div class="row no" style="margin-top:14px"><button class="btn p" onclick="print()">Imprimer</button><button class="btn" onclick="closeModal()">Fermer</button></div>');
}
function scan(){
  const m = memb($('sm').value), sc = $('ss').value, st = statut(m);
  let r = ['Accès autorisé','Bienvenue, '+m.nom,'#157a3e'];
  if(sc==='inv') r = ['QR invalide','Code non reconnu','#DC4545'];
  else if(sc==='site') r = ['Établissement non autorisé','Cet abonnement n’est pas valable ici','#E5A23A'];
  else if(st==='expiré'||st==='suspendu') r = ['Abonnement '+st,'Orienter vers l’accueil','#DC4545'];
  $('sr').innerHTML = '<div class="scan" style="background:'+r[2]+'"><b>'+r[0]+'</b>'+esc(r[1])+'</div>';
}
function toggleTheme(){ S.dark = !S.dark; document.documentElement.dataset.theme = S.dark ? 'dark' : ''; }
