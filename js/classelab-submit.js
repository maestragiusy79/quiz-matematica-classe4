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
    if (codeInput) codeInput.value = studentCode();

    const nome = document.querySelector('[name="nome"], #nome');
    const cognome = document.querySelector('[name="cognome"], #cognome');
    if (nome) nome.value = displayName;
    if (cognome) cognome.value = '-';

    const identitySection = codeInput?.closest('section');
    if (identitySection) identitySection.style.display = 'none';
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
    const input = document.getElementById('studentCode');
    if (input && !params().get('s') && !params().get('p')) {
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.addEventListener('input', () => {
        input.value = input.value.toUpperCase().replace(/\s+/g, '');
      });
    }

    if (!assignmentCode()) {
      showWarning('Link non assegnato. Apri la prova dal link ricevuto dall’insegnante.');
      return;
    }

    if (!params().get('s') && !params().get('p')) {
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