(()=>{
const STORAGE_KEY='quizMathClass4Results_v1';
const form=document.getElementById('quizForm');
if(!form)return;

const answers={
 q1:'197,569,678,695,719,768,876,917,965',
 q2_1:'540',q2_2:'720',q2_3:'813',q2_4:'394',q2_5:'795',q2_6:'632',
 q3_1:'novecentottantasei',q3_2:'cinquecentosei',q3_3:'centottantasette',
 q3_4:'ottocentottantotto',q3_5:'quattrocentosettantacinque',q3_6:'duecentottantacinque',
 q4_1:'>',q4_2:'<',q4_3:'>',q4_4:'>',q4_5:'<',q4_6:'>',q4_7:'<',q4_8:'<',
 q5_1:'382',q5_2:'823',q5_3:'832',q5_4:'230',q5_5:'823',q5_6:'230',q5_7:'382',q5_8:'238',
 q6_1:'700 + 30 + 9',q6_2:'900 + 5',q6_3:'500 + 50 + 5',q6_4:'100 + 90 + 8',q6_5:'700 + 60 + 6',
 q7_1:'80+7',q7_2:'500+80+4',q7_3:'400+30+9',q7_4:'6',q7_5:'100+9',q7_6:'50+3',
 q8_1:'760',q8_2:'414',q8_3:'500',q8_4:'25',
 q9_1:'Rette parallele',q9_2:'Rette incidenti',q9_3:'Rette perpendicolari',
 q11_1:'GH',q11_2:'EF',q11_3:'AB e EF',q11_4:'6'
};
const labels={
 q1:'1. Ordine crescente',
 q2_1:'2. Cinquecentoquaranta',q2_2:'2. Settecentoventi',q2_3:'2. Ottocentotredici',q2_4:'2. Trecentonovantaquattro',q2_5:'2. Settecentonovantacinque',q2_6:'2. Seicentotrentadue',
 q3_1:'3. 986 in lettere',q3_2:'3. 506 in lettere',q3_3:'3. 187 in lettere',q3_4:'3. 888 in lettere',q3_5:'3. 475 in lettere',q3_6:'3. 285 in lettere',
 q4_1:'4. 340 ? 234',q4_2:'4. 798 ? 897',q4_3:'4. 298 ? 289',q4_4:'4. 908 ? 809',q4_5:'4. 908 ? 1000',q4_6:'4. 655 ? 556',q4_7:'4. 498 ? 984',q4_8:'4. 623 ? 632',
 q5_1:'5. 3 h 8 da 2 u',q5_2:'5. 82 da 3 u',q5_3:'5. 8 h 32 u',q5_4:'5. 23 da',q5_5:'5. 8 h 2 da 3 u',q5_6:'5. 230 u',q5_7:'5. 38 da 2 u',q5_8:'5. 238 u',
 q6_1:'6. 739',q6_2:'6. 905',q6_3:'6. 555',q6_4:'6. 198',q6_5:'6. 766',
 q7_1:'7. 87',q7_2:'7. 584',q7_3:'7. 439',q7_4:'7. 6',q7_5:'7. 109',q7_6:'7. 53',
 q8_1:'8. 675 + 76 + 9',q8_2:'8. 503 − 89',q8_3:'8. 125 × 4',q8_4:'8. 125 : 5',
 q9_1:'9. Prima figura',q9_2:'9. Seconda figura',q9_3:'9. Terza figura',
 q10_triangle:'10. Triangolo',q10_square:'10. Quadrato',q10_rectangle:'10. Rettangolo',
 q11_1:'11. Segmento più lungo',q11_2:'11. Segmento più corto',q11_3:'11. Segmenti sotto 5 quadretti',q11_4:'11. Lunghezza CD'
};
function norm(v){return String(v??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'').replace(/;/g,',').replace(/−/g,'-').trim()}
function updateProgress(){
 const required=[...form.querySelectorAll('input[required],select[required]')];
 const done=required.filter(x=>String(x.value).trim()!=='').length;
 const figDone=Object.values(figureState).filter(v=>v.complete).length;
 const total=required.length+3, num=done+figDone;
 document.getElementById('progress').style.width=(num/total*100)+'%';
 document.getElementById('progressText').textContent=num+' di '+total+' risposte completate';
}
form.addEventListener('input',updateProgress);form.addEventListener('change',updateProgress);

const figureState={triangle:{segments:[],complete:false},square:{segments:[],complete:false},rectangle:{segments:[],complete:false}};
const configs={
 triangle:{base:[[1,3],[5,3]],expected:['1,3|3,1','3,1|5,3']},
 square:{base:[[1,4],[5,4]],expected:['1,0|1,4','1,0|5,0','5,0|5,4']},
 rectangle:{base:[[1,4],[6,4]],expected:['1,1|1,4','1,1|6,1','6,1|6,4']}
};
function keySeg(a,b){const x=[a.join(','),b.join(',')].sort();return x.join('|')}
function initBoard(name){
 const svg=document.querySelector('[data-board="'+name+'"]');const cfg=configs[name],st=figureState[name];let first=null;
 const points=[];for(let y=0;y<=5;y++)for(let x=0;x<=7;x++)points.push([x,y]);
 function px(p){return [20+p[0]*36,20+p[1]*28]}
 function redraw(){
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  for(let y=0;y<=5;y++){const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',20);l.setAttribute('x2',272);l.setAttribute('y1',20+y*28);l.setAttribute('y2',20+y*28);l.setAttribute('stroke','#e2e6ef');svg.appendChild(l)}
  for(let x=0;x<=7;x++){const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('y1',20);l.setAttribute('y2',160);l.setAttribute('x1',20+x*36);l.setAttribute('x2',20+x*36);l.setAttribute('stroke','#e2e6ef');svg.appendChild(l)}
  const all=[{seg:cfg.base,base:true},...st.segments.map(seg=>({seg,base:false}))];
  all.forEach(o=>{const [a,b]=o.seg,[x1,y1]=px(a),[x2,y2]=px(b);const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);l.setAttribute('stroke',o.base?'#202a38':'#4f6fdc');l.setAttribute('stroke-width',o.base?'5':'4');l.setAttribute('stroke-linecap','round');svg.appendChild(l)});
  points.forEach(p=>{const [cx,cy]=px(p);const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',cx);c.setAttribute('cy',cy);c.setAttribute('r',first&&first[0]===p[0]&&first[1]===p[1]?'6':'4');c.setAttribute('fill',first&&first[0]===p[0]&&first[1]===p[1]?'#2f9e73':'#68707d');c.dataset.x=p[0];c.dataset.y=p[1];c.style.cursor='pointer';c.addEventListener('click',()=>pick(p));svg.appendChild(c)});
 }
 function pick(p){
  if(!first){first=p;redraw();return}
  if(first[0]===p[0]&&first[1]===p[1]){first=null;redraw();return}
  const k=keySeg(first,p),baseK=keySeg(...cfg.base);
  if(k!==baseK&&!st.segments.some(s=>keySeg(...s)===k))st.segments.push([first,p]);
  first=null;check();redraw();updateProgress();
 }
 function check(){const got=st.segments.map(s=>keySeg(...s));st.complete=cfg.expected.every(k=>got.includes(k))&&got.length===cfg.expected.length;document.querySelector('[data-fig-status="'+name+'"]').textContent=st.complete?'Figura completata ✓':'Segmenti inseriti: '+st.segments.length}
 document.querySelector('[data-reset-fig="'+name+'"]').addEventListener('click',()=>{st.segments=[];st.complete=false;first=null;check();redraw();updateProgress()});
 redraw();check();
}
Object.keys(configs).forEach(initBoard);

form.addEventListener('submit',async e=>{
 e.preventDefault();
 const missing=[...form.querySelectorAll('[required]')].some(x=>String(x.value).trim()==='');
 if(missing||!Object.values(figureState).every(v=>v.complete)){alert('Completa tutti gli esercizi prima di consegnare.');return}
 if(!confirm('Vuoi consegnare la verifica? Dopo l’invio non potrai modificarla.'))return;
 const details={};let score=0,total=0;
 Object.entries(answers).forEach(([k,correct])=>{
  const el=form.elements[k];const given=el?el.value:'';const ok=norm(given)===norm(correct);if(ok)score++;total++;
  details[k]={label:labels[k],answer:given,correctAnswer:correct,ok};
 });
 Object.entries(figureState).forEach(([name,st])=>{
   const k='q10_'+name,ok=st.complete;if(ok)score++;total++;
   details[k]={label:labels[k],answer:ok?'Figura costruita correttamente':'Figura non corretta',correctAnswer:'Figura corretta',ok};
 });
 const result={
   id:Date.now()+'-'+Math.random().toString(36).slice(2,8),
   nome:form.elements.nome.value.trim(),
   cognome:form.elements.cognome.value.trim(),
   createdAt:new Date().toISOString(),
   score,total,details
 };
 const submitButton=form.querySelector('button[type="submit"]');
 if(submitButton)submitButton.disabled=true;
 try{
   await window.ClasseLabSubmit.send('classe4-matematica-ingresso',result);
 }catch(error){
   if(submitButton)submitButton.disabled=false;
   alert('Consegna non registrata: '+error.message);
   return;
 }
 form.classList.add('hidden');document.getElementById('success').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});
});
updateProgress();
})();