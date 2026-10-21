(() => {
  const SUPABASE_URL = 'https://mfaiskfwdscbpjizehxl.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_DQC8x1bRXI_CYUJj_KDY0Q_29gSBgXh';
  const ENDPOINT = SUPABASE_URL + '/functions/v1/submit-quiz';

  const QUIZ_KEYS = [
    ['classe4/test-ingresso/', 'classe4-matematica-ingresso'],
    ['classe5/prova-iniziale-aritmetica/', 'classe5-matematica-aritmetica-iniziale'],
    ['classe5/prova-iniziale-geometria/', 'classe5-matematica-geometria-iniziale'],
    ['classe2/italiano/prova-ascolto/', 'classe2-italiano-ascolto'],
    ['classe2/italiano/scheda1/', 'classe2-italiano-scheda1'],
    ['classe2/italiano/scheda2/', 'classe2-italiano-scheda2'],
    ['classe2/italiano/scheda3/', 'classe2-italiano-scheda3']
  ];

  function params() {
    return new URLSearchParams(location.search);
  }

  function assignmentCode() {
    return (params().get('a') || '').trim().toUpperCase();
  }

  function studentCode() {
    const fromUrl = (params().get('s') || '').trim().toUpperCase();
    if (fromUrl) return fromUrl;
    const el = document.getElementById('studentCode');
    return (el?.value || '').trim().toUpperCase();
  }

  function portalToken() {
    return (params().get('p') || '').trim();
  }

  function quizKeyFromPath() {
    const path = location.pathname.toLowerCase();
    return (QUIZ_KEYS.find(([part]) => path.includes(part)) || [])[1] || '';
  }

  function studentName(record) {
    return [record?.nome, record?.cognome].filter(Boolean).join(' ').trim();
  }

  async function call(payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY
        },
        signal: controller.signal,
        body: JSON.stringify(payload)
      });
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error('Connessione lenta. Riprova senza chiudere la pagina.');
      }
      throw new Error('Connessione non disponibile. Riprova senza chiudere la pagina.');
    } finally {
      clearTimeout(timeout);
    }

    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Operazione non riuscita. Riprova.');
    }
    return data;
  }

  async function resolveStudent() {
    const aCode = assignmentCode();
    const sCode = studentCode();
    const pToken = portalToken();
    const quizKey = quizKeyFromPath();
    if (!aCode || (!sCode && !pToken) || !quizKey) return null;
    return call({
      action: 'resolve',
      assignmentCode: aCode,
      quizKey,
      studentCode: sCode || undefined,
      portalToken: pToken || undefined
    });
  }

  async function send(quizKey, record) {
    if (params().get('preview') === '1') {
      throw new Error('Sei in modalità anteprima docente: la consegna non viene registrata.');
    }
    const aCode = assignmentCode();
    const sCode = studentCode();
    const pToken = portalToken();
    if (!aCode) {
      throw new Error('Apri la prova dal tuo profilo ClasseLab.');
    }
    if (!sCode && !pToken) {
      throw new Error('Apri la prova dal tuo profilo personale ClasseLab.');
    }

    return call({
      assignmentCode: aCode,
      quizKey,
      studentCode: sCode || undefined,
      portalToken: pToken || undefined,
      studentName: studentName(record),
      score: record.score,
      total: record.total,
      details: record.details || {}
    });
  }

  function setIdentityFields(displayName) {
    const codeInput = document.getElementById('studentCode');
    const nome = document.querySelector('[name="nome"], #nome');
    const cognome = document.querySelector('[name="cognome"], #cognome');

    if (codeInput) {
      codeInput.value = studentCode() || 'PROFILE';
      codeInput.required = false;
    }
    if (nome) {
      nome.value = displayName || 'Alunno';
      nome.required = false;
    }
    if (cognome) {
      cognome.value = '-';
      cognome.required = false;
    }

    const sections = new Set([
      codeInput?.closest('section'),
      nome?.closest('section'),
      cognome?.closest('section')
    ].filter(Boolean));
    sections.forEach(section => section.style.display = 'none');
  }

  function hideIdentityFieldsImmediately() {
    const codeInput = document.getElementById('studentCode');
    const nome = document.querySelector('[name="nome"], #nome');
    const cognome = document.querySelector('[name="cognome"], #cognome');
    [codeInput, nome, cognome].forEach(input => {
      if (input) input.required = false;
    });
    const sections = new Set([
      codeInput?.closest('section'),
      nome?.closest('section'),
      cognome?.closest('section')
    ].filter(Boolean));
    sections.forEach(section => section.style.display = 'none');
  }

  function showIdentity(displayName, alreadySubmitted) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const old = document.getElementById('studentIdentity');
    if (old) old.remove();

    const box = document.createElement('section');
    box.id = 'studentIdentity';
    box.className = 'card';
    box.style.border = '2px solid #3456d1';
    box.style.background = '#f7f9ff';
    box.innerHTML = '<h2 style="margin:0">👤 Alunno: ' + escapeHtml(displayName) + '</h2>' +
      (alreadySubmitted ? '<p style="margin-bottom:0;color:#a15c00"><strong>Questa prova risulta già consegnata.</strong></p>' : '');
    hero.insertAdjacentElement('afterend', box);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function showWarning(message) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const note = document.createElement('section');
    note.className = 'card';
    note.style.border = '2px solid #d97706';
    note.innerHTML = '<strong>⚠️ ' + escapeHtml(message) + '</strong>';
    hero.insertAdjacentElement('afterend', note);
  }

  async function installGuard() {
    const pToken = portalToken();
    if (pToken || params().get('preview') === '1') {
      hideIdentityFieldsImmediately();
    }
    if (params().get('preview') === '1') {
      const hero = document.querySelector('.hero');
      if (hero) {
        const note = document.createElement('section');
        note.className = 'card';
        note.style.border = '2px solid #3456d1';
        note.style.background = '#f7f9ff';
        note.innerHTML = '<strong>👩‍🏫 Modalità anteprima docente.</strong> Puoi vedere il test, ma la consegna non verrà registrata.';
        hero.insertAdjacentElement('afterend', note);
      }
      return;
    }
    const input = document.getElementById('studentCode');

    if (!assignmentCode()) {
      showWarning('Link non assegnato. Apri la prova dal link ricevuto dall’insegnante.');
      return;
    }

    if (!params().get('p')) {
      hideIdentityFieldsImmediately();
      showWarning('Per svolgere la prova entra prima dal tuo profilo ClasseLab con nome e cognome.');
      return;
    }

    try {
      const data = await resolveStudent();
      if (!data) return;
      setIdentityFields(data.studentName || 'Alunno');
      showIdentity(data.studentName || 'Alunno', data.alreadySubmitted);
    } catch (error) {
      showWarning(error.message || 'Non riesco a riconoscere l’alunno da questo link.');
    }
  }

  window.ClasseLabSubmit = { send, assignmentCode, studentCode, portalToken, resolveStudent };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installGuard);
  } else {
    installGuard();
  }
})();