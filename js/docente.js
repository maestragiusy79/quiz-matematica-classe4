(()=>{
const STORAGE_KEY='quizMathClass4Results_v1';
const PASSWORD_HASH='62f78e6ced33b858ee667473acd0ca74b1bdb393452f5e060430754f8bf3017e';
const login=document.getElementById('loginPanel'),panel=document.getElementById('teacherPanel'),tbody=document.getElementById('resultsBody');
async function sha256(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function getRows(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return[]}}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function render(){
 const rows=getRows().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
 tbody.innerHTML='';
 if(!rows.length){tbody.innerHTML='<tr><td colspan="6">Nessuna verifica salvata su questo dispositivo.</td></tr>';return}
 rows.forEach(r=>{const tr=document.createElement('tr');const pct=Math.round(r.score/r.total*100);tr.innerHTML='<td>'+esc(r.cognome)+' '+esc(r.nome)+'</td><td>'+new Date(r.createdAt).toLocaleString('it-IT')+'</td><td><span class="badge">'+r.score+'/'+r.total+'</span></td><td>'+pct+'%</td><td><button type="button" class="secondary open" data-id="'+esc(r.id)+'">Apri</button></td><td><button type="button" class="danger del" data-id="'+esc(r.id)+'">Elimina</button></td>';tbody.appendChild(tr)});
 document.querySelectorAll('.open').forEach(b=>b.addEventListener('click',()=>showDetail(b.dataset.id)));
 document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',()=>del(b.dataset.id)));
}
function showDetail(id){
 const r=getRows().find(x=>x.id===id);if(!r)return;
 document.getElementById('detailTitle').textContent=r.cognome+' '+r.nome+' — '+r.score+'/'+r.total;
 const box=document.getElementById('detailBox');box.innerHTML='';
 Object.values(r.details).forEach(d=>{const el=document.createElement('div');el.className='answer-line';el.innerHTML='<strong>'+esc(d.label)+'</strong><br>Risposta: '+esc(d.answer||'—')+'<br><span class="'+(d.ok?'ok':'ko')+'">'+(d.ok?'✓ Corretta':'✗ Errata')+'</span>'+(d.ok?'':'<br><span class="small">Soluzione: '+esc(d.correctAnswer)+'</span>');box.appendChild(el)});
 document.getElementById('detailPanel').classList.remove('hidden');document.getElementById('detailPanel').scrollIntoView({behavior:'smooth'});
}
function del(id){if(!confirm('Eliminare questo risultato?'))return;localStorage.setItem(STORAGE_KEY,JSON.stringify(getRows().filter(x=>x.id!==id)));document.getElementById('detailPanel').classList.add('hidden');render()}
document.getElementById('loginForm').addEventListener('submit',async e=>{e.preventDefault();const ok=await sha256(document.getElementById('password').value)===PASSWORD_HASH;if(!ok){document.getElementById('loginError').textContent='Password non corretta.';return}sessionStorage.setItem('quizTeacher','1');login.classList.add('hidden');panel.classList.remove('hidden');render()});
document.getElementById('logout').addEventListener('click',()=>{sessionStorage.removeItem('quizTeacher');location.reload()});
document.getElementById('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(getRows(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='risultati-matematica-classe4.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
document.getElementById('clearAll').addEventListener('click',()=>{if(confirm('Eliminare TUTTI i risultati salvati su questo dispositivo?')){localStorage.removeItem(STORAGE_KEY);render()}});
if(sessionStorage.getItem('quizTeacher')==='1'){login.classList.add('hidden');panel.classList.remove('hidden');render()}
})();