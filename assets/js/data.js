// ===== Données fictives (DEMO DATA) =====
const AUJ = new Date('2026-11-02'), J = 864e5;
const rng = s => () => (s = s * 16807 % 2147483647) / 2147483647;
const PRE = ['Moussa','Awa','Cheikh','Fatou','Ibrahima','Mariama','Ousmane','Khady','Abdoulaye','Aminata','Modou','Ndeye','Pape','Sokhna','Mamadou','Rokhaya'];
const NOM = ['Diop','Fall','Ndiaye','Sow','Ba','Sarr','Diallo','Faye','Gueye','Mbaye','Seck','Thiam','Cissé','Kane'];
const PLANS = [{n:'Mensuel',j:30,p:15000},{n:'Trimestriel',j:90,p:40000},{n:'Annuel',j:365,p:140000}];
const MOYENS = ['Espèces','Wave','Orange Money','Autre'];
const MOIS = ['Déc','Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov'];
const SALLES = [{id:'km',nom:'Keur Massar',n:48,b:5.2,s:11,resp:'Cheikh Ndiaye'},{id:'yb',nom:'Yeumbeul',n:36,b:3.9,s:23,resp:'Awa Diallo'},{id:'gw',nom:'Guédiawaye',n:42,b:4.4,s:37,resp:'Ibrahima Sarr'},{id:'pa',nom:'Parcelles',n:54,b:6.1,s:41,resp:'Fatou Faye'}];
const fmt = n => n.toLocaleString('fr-FR').replace(/\u202f/g,' ') + ' FCFA';
const dstr = d => d.toLocaleDateString('fr-FR');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function statut(m){ if(m.susp) return 'suspendu'; const d = Math.ceil((m.exp - AUJ)/J); return d < 0 ? 'expiré' : d <= 7 ? 'bientôt' : 'actif'; }
function buildSalle(s){
  const r = rng(s.s * 97), mem = [], pay = [], pre = [];
  for(let i = 0; i < s.n; i++){
    const x = r(), plan = Math.floor(r()*3);
    const off = x < .62 ? 8 + r()*80 : x < .74 ? r()*7 : x < .92 ? -1 - r()*60 : 20;
    mem.push({id:s.id.toUpperCase()+'-'+String(i+1).padStart(4,'0'), nom:PRE[Math.floor(r()*16)]+' '+NOM[Math.floor(r()*14)], tel:'77 000 00 '+String(10+i).slice(-2), plan, exp:new Date(+AUJ + Math.floor(off)*J), susp:x >= .92, mail:''});
  }
  for(let i = 0; i < 26; i++){
    const m = mem[Math.floor(r()*s.n)], y = r();
    pay.push({ref:'REC-'+s.id.toUpperCase()+'-'+String(1000+i), m:m.id, montant:PLANS[m.plan].p, moyen:MOYENS[Math.floor(r()*4)], date:new Date(+AUJ - Math.floor(r()*30)*J), st:y < .8 ? 'confirmé' : y < .92 ? 'en attente' : 'annulé'});
  }
  for(let i = 0; i < 24; i++){
    const m = mem[Math.floor(r()*s.n)], ok = statut(m) === 'actif' || statut(m) === 'bientôt';
    pre.push({h:String(6+Math.floor(i/2)).padStart(2,'0')+':'+(i%2?'35':'10'), m:m.id, ok, type:r() < .8 ? 'QR' : 'Manuel'});
  }
  const rev = MOIS.map((_, i) => Math.round(s.b * (0.8 + i*.035 + r()*.15) * 1e5) * 1);
  const adh = MOIS.map((_, i) => Math.round(s.n * (0.6 + i*.036 + r()*.04)));
  const freq = [0,1,2,3,4,5,6].map(i => Math.round(s.n * (1.5 + r()*1.3 - (i === 6 ? .8 : 0))));
  const act = [['Nouvel adhérent enregistré',mem[0].nom],['Abonnement renouvelé',mem[3].nom],['Paiement enregistré',mem[5].nom],['Présence validée',mem[7].nom],['Abonnement expiré',mem[9].nom]];
  return {...s, mem, pay, pre, rev, adh, freq, act};
}
const D = {}; SALLES.forEach(s => D[s.id] = buildSalle(s));
const cnt = (s, st) => D[s].mem.filter(m => statut(m) === st).length;
const kp = id => ({tot:D[id].mem.length, act:D[id].mem.filter(m => ['actif','bientôt'].includes(statut(m))).length, exp:cnt(id,'expiré'), soon:cnt(id,'bientôt'), nouv:Math.round(D[id].n*.12), rev:D[id].rev[11], pres:D[id].freq[1], evo:Math.round((D[id].rev[11]/D[id].rev[10]-1)*1000)/10});
const ALL = SALLES.map(s => s.id);
const sum = (f) => ALL.reduce((a, id) => a + f(id), 0);
const net = {tot:sum(i=>kp(i).tot), act:sum(i=>kp(i).act), exp:sum(i=>kp(i).exp), nouv:sum(i=>kp(i).nouv), rev:sum(i=>kp(i).rev), pres:sum(i=>kp(i).pres), soon:sum(i=>kp(i).soon)};
const addv = f => [0,1,2,3,4,5,6,7,8,9,10,11].map(i => sum(id => D[id][f][i]));
