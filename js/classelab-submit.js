(() => {
  const SUPABASE_URL = 'https://mfaiskfwdscbpjizehxl.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_DQC8x1bRXI_CYUJj_KDY0Q_29gSBgXh';
  const ENDPOINT = SUPABASE_URL + '/functions/v1/submit-quiz';

  function assignmentCode() {
    return (new URLSearchParams(location.search).get('a') || '').trim().toUpperCase();
  }

  function studentCode() {
    const el = document.getElementById('studentCode');
    return (el?.value || '').trim().toUpperCase();
  }

  function studentName(record) {
    return [record?.nome, record?.cognome].filter(Boolean).join(' ').trim();
  }

  async function send(quizKey, record) {
    const aCode = assignmentCode();
    const sCode = studentCode();
    if (!aCode) {
      throw new Error('Apri la prova dal link fornito dall’insegnante.');
    }
    if (!sCode) {
      throw new Error('Inserisci il codice alunno.');
    }

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
        body: JSON.stringify({
          assignmentCode: aCode,
          quizKey,
          studentCode: sCode,
          studentName: studentName(record),
          score: record.score,
          total: record.total,
          details: record.details || {}
        })
      });
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error('Connessione lenta: la prova non risulta ancora registrata. Premi di nuovo “Consegna”.');
      }
      throw new Error('Connessione non disponibile. Riprova senza chiudere la pagina.');
    } finally {
      clearTimeout(timeout);
    }

    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'La prova non è stata registrata. Riprova.');
    }
    return data;
  }

  function installGuard() {
    const input = document.getElementById('studentCode');
    if (input) {
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.addEventListener('input', () => {
        input.value = input.value.toUpperCase().replace(/\s+/g, '');
      });
    }

    if (!assignmentCode()) {
      const main = document.querySelector('main');
      const hero = document.querySelector('.hero');
      if (main && hero) {
        const note = document.createElement('section');
        note.className = 'card';
        note.style.border = '2px solid #d97706';
        note.innerHTML = '<strong>⚠️ Link non assegnato.</strong> Per consegnare la prova devi aprire il link ricevuto dall’insegnante.';
        hero.insertAdjacentElement('afterend', note);
      }
    }
  }

  window.ClasseLabSubmit = { send, assignmentCode };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installGuard);
  } else {
    installGuard();
  }
})();