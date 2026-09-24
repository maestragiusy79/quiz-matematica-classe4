# Architettura funzionale di ClasseLab

## 1. Due aree separate

### Area alunni
Gli alunni entrano nella piattaforma per svolgere una prova assegnata.

Non devono poter accedere:
- all'Area docenti;
- ai risultati degli altri alunni;
- alle soluzioni;
- alle verifiche non assegnate.

### Area docenti
Ogni docente avrà un account personale.

Dopo l'accesso il sistema dovrà mostrare solamente ciò che quel docente è autorizzato a vedere.

---

## 2. Principio di proprietà

Ogni verifica deve avere un docente proprietario.

Esempio iniziale:

### Giusy
Può visualizzare e gestire:
- Classe quarta → Matematica → Test d'ingresso;
- Classe quinta → Matematica → future prove comuni.

Può visualizzare:
- consegne;
- risposte degli alunni;
- punteggi;
- dettaglio degli esercizi;

ma esclusivamente per le proprie verifiche.

### Docente di Italiano di classe seconda
Può visualizzare e gestire:
- Classe seconda → Italiano → prove assegnate.

Può visualizzare esclusivamente i risultati di quelle prove.

---

## 3. Regola sui risultati

Il permesso di leggere una verifica e il permesso di leggere i suoi risultati devono essere collegati.

Un docente NON autorizzato:
- non vede la verifica nella propria dashboard;
- non vede l'elenco delle consegne;
- non vede i nomi degli alunni;
- non vede le risposte;
- non vede i punteggi;
- non può raggiungere i dati nemmeno conoscendo direttamente un URL.

La separazione dovrà quindi essere applicata nel database, non soltanto nell'interfaccia grafica.

---

## 4. Oggetti principali

La piattaforma dovrà gestire:

1. Docenti
2. Classi
3. Discipline
4. Verifiche
5. Domande/esercizi
6. Assegnazioni
7. Alunni o codici alunno
8. Consegne
9. Risposte
10. Permessi

---

## 5. Flusso docente

1. Il docente accede con il proprio account.
2. Il sistema identifica il docente.
3. Vengono caricate solo le sue classi/verifiche autorizzate.
4. Il docente apre una verifica.
5. Visualizza solo le consegne collegate a quella verifica.
6. Può consultare risultati, risposte e statistiche della propria prova.

---

## 6. Flusso alunno

1. L'alunno riceve un link o un codice prova.
2. Apre esclusivamente la prova assegnata.
3. Inserisce il proprio identificativo richiesto.
4. Svolge gli esercizi.
5. Consegna.
6. La consegna viene collegata alla verifica corretta.
7. Il risultato diventa visibile soltanto al docente autorizzato.

---

## 7. Stato attuale

GitHub Pages ospita il front-end e Supabase gestisce autenticazione e database dell'Area docenti.

L'Area docenti usa:
- account personali con email e password;
- profili docente separati;
- classi e verifiche nel database;
- Row Level Security per separare dati, prove e risultati tra docenti.

Le vecchie pagine con password unica sono state dismesse e rimandano all'Area docenti principale.

Resta da completare il collegamento delle prove svolte dagli alunni al database centrale e, per un uso esteso a più docenti, la configurazione affidabile dell'invio email di autenticazione.
