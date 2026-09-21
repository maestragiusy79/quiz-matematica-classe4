(()=>{
const PASSWORD='classe4';
const K_CLASSES='classelab_classes_v1',K_TESTS='classelab_tests_v1',K_RESULTS='quizMathClass4Results_v1';
const q=s=>document.querySelector(s),qa=s=>Array.from(document.querySelectorAll(s));
const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function login(){
 const value=q('#teacherPassword').value.trim();
 const ok=value===PASSWORD;
 q('#loginError').hidden=ok;
 if(!ok)return;
 sessionStorage.setItem('classelab_teacher','1');
 showPanel();
}
function showPanel(){
 q('#loginPanel').hidden=true;
 q('#teacherPanel').hidden=false;
 renderAll();
}
function logout(){sessionStorage.removeItem('classelab_teacher');location.reload()}

q('#loginBtn').onclick=login;
q('#teacherPassword').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
q('#logoutBtn').onclick=logout;

function seed(){
 let classes=load(K_CLASSES);
 if(!classes.length){
  classes=[{id:'c4',name:'Classe quarta',year:'2026/27',notes:'Classe iniziale'}];
  save(K_CLASSES,classes);
 }
 let tests=load(K_TESTS);
 if(!tests.length){
  tests=[{id:'ingresso4',title:"Test d'ingresso di matematica",classId:'c4',subject:'Matematica',type:"Test d'ingresso",description:'Prova iniziale completa',url:'../classe4/test-ingresso/',fixed:true}];
  save(K_TESTS,tests);
 }
}
function renderAll(){seed();renderStats();renderClasses();renderTests();renderResults()}
function renderStats(){
 q('#statClasses').textContent=load(K_CLASSES).length;
 q('#statTests').textContent=load(K_TESTS).length;
 q('#statResults').textContent=load(K_RESULTS).length;
}
function renderClasses(){
 const data=load(K_CLASSES),box=q('#classesList');
 if(!data.length){box.innerHTML='<div class="empty">Nessuna classe ancora.</div>';return}
 let html='';
 data.forEach(c=>{
  html+='<div class="item"><h3>'+esc(c.name)+'</h3><div class="meta">'+esc(c.year||'')+'</div>';
  if(c.notes) html+='<div>'+esc(c.notes)+'</div>';
  html+='<div class="actions"><button class="danger-btn" data-del-class="'+c.id+'">Elimina</button></div></div>';
 });
 box.innerHTML=html;
 qa('[data-del-class]').forEach(b=>b.onclick=()=>{
  if(confirm('Eliminare questa classe?')){
   save(K_CLASSES,load(K_CLASSES).filter(x=>x.id!==b.dataset.delClass));
   renderAll();
  }
 });
 refreshClassSelect();
}
function refreshClassSelect(){
 const sel=q('#testClass'),curr=sel.value;
 sel.innerHTML='';
 load(K_CLASSES).forEach(c=>{
  const o=document.createElement('option');
  o.value=c.id;o.textContent=c.name;sel.appendChild(o);
 });
 if(curr)sel.value=curr;
}
q('#toggleClassForm').onclick=()=>q('#classForm').hidden=false;
q('#cancelClassForm').onclick=()=>{q('#classForm').hidden=true;q('#classForm').reset()};
q('#classForm').onsubmit=e=>{
 e.preventDefault();
 const a=load(K_CLASSES);
 a.push({id:uid(),name:q('#className').value.trim(),year:q('#classYear').value.trim(),notes:q('#classNotes').value.trim()});
 save(K_CLASSES,a);
 e.target.reset();e.target.hidden=true;renderAll();
};

function renderTests(){
 const tests=load(K_TESTS),classes=load(K_CLASSES),box=q('#testsList');
 const extra=tests.filter(t=>!t.fixed);
 if(!extra.length){box.innerHTML='<div class="empty">Nessun’altra verifica creata.</div>';return}
 let html='';
 extra.forEach(t=>{
  const cn=(classes.find(c=>c.id===t.classId)||{}).name||'Senza classe';
  html+='<div class="item"><h3>'+esc(t.title)+'</h3><div class="meta">'+esc(cn)+' · '+esc(t.subject)+' · '+esc(t.type)+'</div>';
  if(t.description) html+='<div>'+esc(t.description)+'</div>';
  html+='<div class="actions"><button class="danger-btn" data-del-test="'+t.id+'">Elimina</button></div></div>';
 });
 box.innerHTML=html;
 qa('[data-del-test]').forEach(b=>b.onclick=()=>{
  if(confirm('Eliminare questa verifica?')){
   save(K_TESTS,load(K_TESTS).filter(x=>x.id!==b.dataset.delTest));
   renderAll();
  }
 });
}
q('#toggleTestForm').onclick=()=>q('#testForm').hidden=false;
q('#cancelTestForm').onclick=()=>{q('#testForm').hidden=true;q('#testForm').reset();q('#testSubject').value='Matematica'};
q('#testForm').onsubmit=e=>{
 e.preventDefault();
 const a=load(K_TESTS);
 a.push({id:uid(),title:q('#testTitle').value.trim(),classId:q('#testClass').value,subject:q('#testSubject').value.trim(),type:q('#testType').value,description:q('#testDescription').value.trim(),url:'',fixed:false});
 save(K_TESTS,a);
 e.target.reset();q('#testSubject').value='Matematica';e.target.hidden=true;renderAll();
};
function renderResults(){
 const r=load(K_RESULTS),box=q('#resultsSummary');
 if(!r.length){box.innerHTML='<div class="empty">Nessuna consegna registrata su questo dispositivo.</div>';return}
 const avg=Math.round(r.reduce((s,x)=>s+((x.score||0)/(x.total||1))*100,0)/r.length);
 box.innerHTML="<div class=\"item\"><h3>Test d'ingresso di matematica · Classe quarta</h3><div class=\"meta\">"+r.length+" consegne</div><div>Media risultati: <strong>"+avg+"%</strong></div></div>";
}
function download(name,obj){
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));
 a.download=name;a.click();URL.revokeObjectURL(a.href);
}
q('#exportBtn').onclick=()=>download('risultati-classelab.json',load(K_RESULTS));

async function copyTestLink(button){
 const url=new URL('../classe4/test-ingresso/',location.href).href;
 await navigator.clipboard.writeText(url);
 const old=button.textContent;
 button.textContent='Link copiato ✓';
 setTimeout(()=>button.textContent=old,1400);
}
q('#copyActiveLink').onclick=()=>copyTestLink(q('#copyActiveLink'));
q('#copyActiveLink2').onclick=()=>copyTestLink(q('#copyActiveLink2'));

if(sessionStorage.getItem('classelab_teacher')==='1')showPanel();
})();