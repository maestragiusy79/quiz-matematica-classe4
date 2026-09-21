(()=>{
const PASS_HASH='62f78e6ced33b858ee667473acd0ca74b1bdb393452f5e060430754f8bf3017e';
const K_CLASSES='classelab_classes_v1',K_TESTS='classelab_tests_v1',K_RESULTS='quizMathClass4Results_v1';
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

async function sha256(s){
 const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
 return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function login(){
 const ok=(await sha256(q('#teacherPassword').value))===PASS_HASH;
 if(!ok){q('#loginError').hidden=false;return}
 sessionStorage.setItem('classelab_teacher','1');showPanel();
}
function showPanel(){
 q('#loginPanel').hidden=true;q('#teacherPanel').hidden=false;renderAll();
}
function logout(){sessionStorage.removeItem('classelab_teacher');location.reload()}
function nav(view){
 qa('.navbtn[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
 qa('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));
}
qa('.navbtn[data-view]').forEach(b=>b.onclick=()=>nav(b.dataset.view));
qa('[data-go]').forEach(b=>b.onclick=()=>nav(b.dataset.go));
q('#loginBtn').onclick=login;q('#teacherPassword').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
q('#logoutBtn').onclick=logout;

function seed(){
 let classes=load(K_CLASSES);
 if(!classes.length){classes=[{id:'c4',name:'Classe quarta',year:'2026/27',notes:'Classe iniziale'}];save(K_CLASSES,classes)}
 let tests=load(K_TESTS);
 if(!tests.length){tests=[{id:'ingresso4',title:"Test d'ingresso di matematica",classId:'c4',subject:'Matematica',type:"Test d'ingresso",description:'Prova iniziale completa',url:'../classe4/test-ingresso/',fixed:true}];save(K_TESTS,tests)}
}
function renderAll(){seed();renderStats();renderClasses();renderTests();renderResults()}
function renderStats(){
 q('#statClasses').textContent=load(K_CLASSES).length;
 q('#statTests').textContent=load(K_TESTS).length;
 q('#statResults').textContent=load(K_RESULTS).length;
}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderClasses(){
 const data=load(K_CLASSES),box=q('#classesList');
 box.innerHTML=data.length?'':"<div class='empty'>Nessuna classe ancora.</div>";
 data.forEach(c=>{
  const el=document.createElement('div');el.className='item';
  el.innerHTML='<div class="item-head"><div><h3>'+esc(c.name)+'</h3><div class="muted">'+esc(c.year||'')+'</div></div><span class="badge">Classe</span></div><p>'+esc(c.notes||'')+'</p><div class="actions"><button class="btn-small danger" data-del-class="'+c.id+'">Elimina</button></div>';
  box.appendChild(el);
 });
 qa('[data-del-class]').forEach(b=>b.onclick=()=>{if(confirm('Eliminare questa classe?')){save(K_CLASSES,load(K_CLASSES).filter(x=>x.id!==b.dataset.delClass));renderAll()}});
 refreshClassSelect();
}
function refreshClassSelect(){
 const sel=q('#testClass'),curr=sel.value;sel.innerHTML='';
 load(K_CLASSES).forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.name;sel.appendChild(o)});
 if(curr)sel.value=curr;
}
q('#classForm').onsubmit=e=>{
 e.preventDefault();const a=load(K_CLASSES);a.push({id:uid(),name:q('#className').value.trim(),year:q('#classYear').value.trim(),notes:q('#classNotes').value.trim()});save(K_CLASSES,a);e.target.reset();renderAll();
};
q('#testForm').onsubmit=e=>{
 e.preventDefault();const a=load(K_TESTS);a.push({id:uid(),title:q('#testTitle').value.trim(),classId:q('#testClass').value,subject:q('#testSubject').value.trim(),type:q('#testType').value,description:q('#testDescription').value.trim(),url:'',fixed:false});save(K_TESTS,a);e.target.reset();q('#testSubject').value='Matematica';renderAll();
};
function renderTests(){
 const tests=load(K_TESTS),classes=load(K_CLASSES),box=q('#testsList');box.innerHTML='';
 tests.forEach(t=>{
  const cn=classes.find(c=>c.id===t.classId)?.name||'Senza classe';
  const el=document.createElement('div');el.className='item';
  el.innerHTML='<div class="item-head"><div><h3>'+esc(t.title)+'</h3><div class="muted">'+esc(cn)+' · '+esc(t.subject)+' · '+esc(t.type)+'</div></div><span class="badge">'+(t.fixed?'Attiva':'Bozza')+'</span></div><p>'+esc(t.description||'')+'</p><div class="actions">'+(t.url?'<a class="btn-small primary" target="_blank" href="'+esc(t.url)+'">Apri</a><button class="btn-small" data-copy="'+t.id+'">Copia link</button>':'<button class="btn-small" disabled>Editor domande in preparazione</button>')+(t.fixed?'':'<button class="btn-small danger" data-del-test="'+t.id+'">Elimina</button>')+'</div>';
  box.appendChild(el);
 });
 qa('[data-copy]').forEach(b=>b.onclick=async()=>{const t=load(K_TESTS).find(x=>x.id===b.dataset.copy);if(t?.url){await navigator.clipboard.writeText(new URL(t.url,location.href).href);b.textContent='Link copiato ✓';setTimeout(()=>b.textContent='Copia link',1400)}});
 qa('[data-del-test]').forEach(b=>b.onclick=()=>{if(confirm('Eliminare questa verifica?')){save(K_TESTS,load(K_TESTS).filter(x=>x.id!==b.dataset.delTest));renderAll()}});
}
function renderResults(){
 const r=load(K_RESULTS),box=q('#resultsSummary');box.innerHTML='';
 if(!r.length){box.innerHTML='<div class="empty">Nessuna consegna registrata su questo dispositivo.</div>';return}
 const avg=Math.round(r.reduce((s,x)=>s+((x.score||0)/(x.total||1))*100,0)/r.length);
 box.innerHTML='<div class="item"><h3>Test d\'ingresso classe quarta</h3><p><strong>'+r.length+'</strong> consegne · media <strong>'+avg+'%</strong></p></div>';
}
function download(name,obj){
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));a.download=name;a.click();URL.revokeObjectURL(a.href);
}
q('#exportBtn').onclick=()=>download('risultati-classelab.json',load(K_RESULTS));
q('#exportAllBtn').onclick=()=>download('configurazione-classelab.json',{classes:load(K_CLASSES),tests:load(K_TESTS)});
q('#resetTeacherBtn').onclick=()=>{if(confirm('Azzero classi e verifiche locali?')){localStorage.removeItem(K_CLASSES);localStorage.removeItem(K_TESTS);renderAll()}};
if(sessionStorage.getItem('classelab_teacher')==='1')showPanel();
})();