// ===== État =====
const S = {view:'land', salle:'km', tab:'dash', filter:'tous', q:'', page:0, sort:'id', dark:false, col:false, ptab:'home', logged:false};
const $ = id => document.getElementById(id);
function go(patch){ Object.assign(S, patch); render(); window.scrollTo(0,0); }
function toast(t){ const e = $('toast'); e.textContent = t; e.classList.add('on'); setTimeout(() => e.classList.remove('on'), 2200); }
function openModal(html){ $('modal').innerHTML = '<div class="card">'+html+'</div>'; $('modal').classList.add('on'); }
function closeModal(){ $('modal').classList.remove('on'); }
$('modal').onclick = e => { if(e.target.id === 'modal') closeModal(); };
document.addEventListener('mousemove', e => { const t = e.target.closest?.('[data-tip]'), b = $('tip'); if(t){ b.style.display='block'; b.textContent = t.dataset.tip; b.style.left = e.clientX+12+'px'; b.style.top = e.clientY+12+'px'; } else b.style.display='none'; });

// ===== Composants =====
const bdg = st => '<span class="badge '+({'actif':'b-ok','confirmé':'b-ok','bientôt':'b-warn','en attente':'b-warn','expiré':'b-ko','annulé':'b-ko','suspendu':'b-off'}[st]||'b-off')+'">'+st+'</span>';
const kpi = (l, v, e='') => '<div class="card kpi"><span>'+l+'</span><b>'+v+'</b>'+e+'</div>';
function bars(vals, labels, title, unit=''){
  const mx = Math.max(...vals), w = 360, h = 150, bw = w/vals.length;
  return '<div class="card"><h3>'+title+' <span class="demo">DEMO</span></h3><svg viewBox="0 0 '+w+' '+(h+18)+'" width="100%">'+vals.map((v,i)=>'<rect class="bar" data-tip="'+labels[i]+' : '+v.toLocaleString('fr-FR')+unit+'" x="'+(i*bw+4)+'" y="'+(h-v/mx*h)+'" width="'+(bw-8)+'" height="'+(v/mx*h)+'" rx="4" style="animation-delay:'+i*40+'ms"/><text x="'+(i*bw+bw/2)+'" y="'+(h+13)+'" text-anchor="middle">'+labels[i]+'</text>').join('')+'</svg></div>';
}
function line(vals, labels, title, unit=''){
  const mx = Math.max(...vals)*1.05, mn = Math.min(...vals)*.9, w = 360, h = 150, st = w/(vals.length-1);
  const pts = vals.map((v,i)=>[i*st, h-(v-mn)/(mx-mn)*h]);
  return '<div class="card"><h3>'+title+' <span class="demo">DEMO</span></h3><svg viewBox="0 0 '+(w)+' '+(h+18)+'" width="100%"><path class="ar" d="M0,'+h+' L'+pts.map(p=>p.join(',')).join(' L')+' L'+w+','+h+'Z"/><path class="ln" d="M'+pts.map(p=>p.join(',')).join(' L')+'"/>'+pts.map((p,i)=>'<circle r="7" cx="'+p[0]+'" cy="'+p[1]+'" fill="transparent" data-tip="'+labels[i]+' : '+vals[i].toLocaleString('fr-FR')+unit+'"/>').join('')+labels.map((l,i)=>i%2?'':'<text x="'+i*st+'" y="'+(h+13)+'" text-anchor="middle">'+l+'</text>').join('')+'</svg></div>';
}
function qrSvg(seed, size=150){
  const r = rng([...seed].reduce((a,c)=>a*31+c.charCodeAt(0),7)%2147483646+1), n = 21; let c = '';
  const fin = (x,y) => x<7&&y<7 || x>13&&y<7 || x<7&&y>13;
  for(let y=0;y<n;y++) for(let x=0;x<n;x++){
    let on = r() > .5;
    if(fin(x,y)){ const a = x>13?x-14:x, b = y>13?y-14:y; on = a==0||a==6||b==0||b==6||(a>1&&a<5&&b>1&&b<5); }
    if(on) c += '<rect x="'+x+'" y="'+y+'" width="1" height="1"/>';
  }
  return '<span class="qr"><svg viewBox="0 0 21 21" width="'+size+'" height="'+size+'" fill="#101512">'+c+'</svg></span>';
}
function activity(id){ return '<div class="card"><h3>Activité récente <span class="demo">DEMO</span></h3>'+D[id].act.map((a,i)=>'<div class="act"><b>'+a[0]+'</b><span class="mut">'+esc(a[1])+' · il y a '+(i*7+3)+' min</span></div>').join('')+'</div>'; }
function alerts(){ return '<div class="card"><h3>Alertes (exemples simulés)</h3><div class="act"><i class="fa-solid fa-triangle-exclamation" style="color:var(--org)"></i> '+net.soon+' abonnements arrivent à expiration cette semaine</div><div class="act"><i class="fa-solid fa-triangle-exclamation" style="color:var(--org)"></i> Paiements à vérifier : '+sum(i=>D[i].pay.filter(p=>p.st==='en attente').length)+'</div><div class="act"><i class="fa-solid fa-triangle-exclamation" style="color:var(--org)"></i> Établissement à surveiller : '+SALLES.reduce((a,s)=>kp(s.id).exp/kp(s.id).tot > kp(a.id).exp/kp(a.id).tot ? s : a).nom+' (taux d’expirés le plus élevé)</div></div>'; }
