# Architettura funzionale di ClasseLab

## 1. Aree separate

### Area alunni
L'alunno svolge esclusivamente una prova assegnata dal docente.

Per consegnare servono:
- il link della prova contenente il codice di assegnazione;
- il codice personale dell'alunno.

L'alunno non accede direttamente alle tabelle Supabase e non può leggere risultati, soluzioni o dati di altri alunni.

### Area docenti
Ogni docente usa un account personale Supabase Auth.

Dopo l'accesso, la dashboard carica esclusivamente classi, prove e risultati consentiti dalle policy Row Level Security.

## 2. Modello di autorizzazione

Una classe ha un proprietario e può essere condivisa tramite `teacher_classes`.

Una verifica ha un proprietario e può essere condivisa tramite `test_permissions`.

La lettura dei risultati è consentita soltanto al proprietario, a un amministratore attivo o a un docente con il permesso specifico di visualizzare i risultati.

Il ruolo amministratore non è modificabile dal normale account docente.

## 3. Flusso docente

1. Login con email e password.
2. Creazione o selezione della classe.
3. Inserimento degli alunni e generazione dei codici personali.
4. Selezione di una prova dal catalogo delle prove pubblicate.
5. Attivazione della prova per una classe.
6. Creazione di un'assegnazione con codice casuale.
7. Copia del link generato e distribuzione agli alunni.
8. Consultazione delle consegne nell'Area docenti.
9. Apertura del dettaglio delle risposte ed eventuale correzione manuale.
10. Esportazione dei risultati in CSV.

## 4. Flusso alunno

1. L'alunno apre il link ricevuto.
2. Il link contiene il parametro di assegnazione.
3. L'alunno inserisce nome, cognome e codice personale.
4. Svolge la prova.
5. Il browser calcola il punteggio automatico previsto dalla prova.
6. Il browser invia il risultato alla Edge Function `submit-quiz`.
7. La funzione verifica assegnazione, prova, classe e codice alunno.
8. Solo dopo le verifiche la consegna viene scritta in Supabase.
9. Se la stessa assegnazione risulta già consegnata dallo stesso alunno, non viene creato un duplicato.

## 5. Componenti dati

Le tabelle principali sono:
- `profiles`;
- `classes`;
- `teacher_classes`;
- `tests`;
- `test_permissions`;
- `questions`;
- `question_keys`;
- `assignments`;
- `students`;
- `submissions`;
- `answers`.

Le prove statiche attuali salvano il dettaglio della consegna anche nel campo JSON `submissions.details`.

## 6. Sicurezza

- RLS è attiva sulle tabelle esposte.
- Le classi sono filtrate per proprietario/assegnazione.
- Le prove sono filtrate per proprietario/permesso.
- Le consegne sono leggibili soltanto da chi può vedere i risultati della relativa prova.
- La modifica delle consegne è più restrittiva della sola lettura.
- Un docente può aggiornare del proprio profilo soltanto il nome visualizzato; non può promuoversi ad amministratore né riattivare autonomamente un account.
- Le chiavi Supabase segrete non sono presenti nel front-end.
- Le consegne alunno passano da una Edge Function con controlli server-side.
- Il codice di assegnazione e il codice alunno devono entrambi corrispondere alla stessa classe.
- Per ciascuna assegnazione è ammessa una sola consegna per alunno.

## 7. Prove attualmente collegate

Sono collegate al flusso centralizzato:
- Matematica classe quarta · Test d'ingresso;
- Matematica classe quinta · Problemi e numeri;
- Matematica classe quinta · Misure, geometria, relazioni;
- Italiano classe seconda · Prova d'ascolto;
- Italiano classe seconda · Schede 1, 2 e 3.

Alcune attività includono risposte aperte: in questi casi la dashboard segnala che il punteggio mostrato è quello automatico e che è richiesta anche una correzione manuale.

## 8. Autenticazione

L'Area docenti supporta:
- registrazione;
- conferma email;
- accesso;
- reinvio email di conferma;
- recupero password;
- uscita dall'account.

Per un utilizzo esteso a molti docenti, l'invio email va configurato con un servizio SMTP affidabile e la futura gestione amministrativa degli inviti potrà essere aggiunta senza modificare il modello di isolamento già presente.
