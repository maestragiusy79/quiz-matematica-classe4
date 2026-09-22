# Modello dati previsto

Questo documento definisce la struttura logica prima del collegamento del database.

## teachers
Rappresenta i docenti.

Campi previsti:
- id
- nome
- cognome
- email
- ruolo
- attivo

## classes
Rappresenta le classi.

Campi previsti:
- id
- nome
- anno_scolastico
- plesso
- attiva

## teacher_classes
Collega docenti e classi.

Campi previsti:
- teacher_id
- class_id
- disciplina
- ruolo

Questo permette che più docenti lavorino sulla stessa classe ma con discipline diverse.

## tests
Rappresenta le verifiche.

Campi previsti:
- id
- titolo
- class_id
- disciplina
- teacher_owner_id
- tipologia
- stato
- data_creazione

Regola principale:
`teacher_owner_id` determina il proprietario della verifica.

## questions
Rappresenta gli esercizi di una verifica.

Campi previsti:
- id
- test_id
- ordine
- tipo
- testo
- configurazione
- soluzione

## assignments
Definisce a chi e quando viene assegnata una prova.

Campi previsti:
- id
- test_id
- class_id
- codice_accesso
- data_apertura
- data_chiusura
- attiva

## students
Per la prima fase è preferibile usare un identificativo minimo.

Campi previsti:
- id
- codice_alunno
- class_id
- nome_visualizzato

I dati personali dovranno essere ridotti al minimo necessario.

## submissions
Rappresenta una consegna.

Campi previsti:
- id
- test_id
- student_id
- started_at
- submitted_at
- punteggio
- totale
- stato

## answers
Rappresenta le singole risposte.

Campi previsti:
- id
- submission_id
- question_id
- risposta
- corretta
- punteggio

## Regole di autorizzazione previste

### Docente
Può leggere una verifica solo se:
- è il proprietario della verifica; oppure
- esiste un'autorizzazione esplicita.

Può leggere una consegna solo se può leggere la verifica collegata.

### Alunno
Può:
- aprire una prova assegnata;
- inserire le proprie risposte;
- consegnare.

Non può:
- leggere le consegne altrui;
- leggere le soluzioni;
- consultare l'Area docenti.

## Esempio iniziale

### Utente Giusy
Autorizzazioni:
- Matematica classe quarta;
- Matematica classe quinta.

Verifiche iniziali:
- Test d'ingresso di Matematica classe quarta;
- future prove comuni di Matematica classe quinta.

### Secondo docente
Autorizzazioni:
- Italiano classe seconda.

Le rispettive verifiche e consegne rimangono separate.
