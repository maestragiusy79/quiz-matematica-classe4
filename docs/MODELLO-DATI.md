# Modello dati di ClasseLab

Questo documento descrive il modello dati attualmente utilizzato da Supabase.

## profiles
Profilo applicativo del docente collegato a `auth.users`.

Campi principali:
- `id`
- `display_name`
- `email`
- `role` (`teacher` o `admin`)
- `active`
- timestamp

Un docente normale può modificare soltanto il proprio nome visualizzato; ruolo e stato attivo non sono modificabili dal client docente.

## classes
Rappresenta le classi.

Campi principali:
- `id`
- `name`
- `school_year`
- `campus`
- `created_by`
- `active`
- `created_at`

## teacher_classes
Collega docenti e classi.

Campi:
- `teacher_id`
- `class_id`
- `subject`
- `role`
- `created_at`

## tests
Rappresenta le prove.

Campi principali:
- `id`
- `title`
- `class_id`
- `subject`
- `owner_id`
- `test_type`
- `description`
- `status`
- `external_key` — identifica una prova statica pubblicata;
- `public_path` — percorso GitHub Pages della prova;
- timestamp.

## test_permissions
Permessi aggiuntivi per condividere una prova con un altro docente.

Campi:
- `test_id`
- `teacher_id`
- `can_edit`
- `can_view_results`

## questions e question_keys
Struttura predisposta per future verifiche create dinamicamente nel database.

`questions` contiene testo, tipo, ordine e configurazione della domanda.

`question_keys` contiene soluzione e punteggio massimo ed è protetta separatamente.

## assignments
Associa una prova a una classe e produce il codice presente nel link distribuito agli alunni.

Campi:
- `id`
- `test_id`
- `class_id`
- `access_code`
- `opens_at`
- `closes_at`
- `active`
- `created_at`

## students
Anagrafica minima degli alunni.

Campi:
- `id`
- `student_code`
- `class_id`
- `display_name`
- `active`
- `created_at`

Il codice è univoco all'interno della classe.

## submissions
Rappresenta una consegna.

Campi principali:
- `id`
- `test_id`
- `student_id`
- `assignment_id`
- `student_name_snapshot`
- `started_at`
- `submitted_at`
- `score`
- `total`
- `status`
- `details` JSONB
- `created_at`

`details` contiene il dettaglio delle risposte delle prove statiche. Una combinazione assegnazione/alunno può produrre una sola consegna.

## answers
Tabella predisposta per le singole risposte delle prove dinamiche.

Campi:
- `submission_id`
- `question_id`
- `answer`
- `is_correct`
- `points`
- `created_at`

## Regole di autorizzazione

### Docente
Può accedere a una classe se:
- ne è il creatore;
- è associato tramite `teacher_classes`;
- è un amministratore attivo.

Può accedere a una prova se:
- ne è il proprietario;
- dispone di un record in `test_permissions`;
- è un amministratore attivo.

La lettura dei risultati richiede il permesso specifico previsto dal modello.

### Alunno
L'alunno non usa direttamente le API delle tabelle.

La consegna passa attraverso la Edge Function `submit-quiz`, che verifica contemporaneamente:
- codice assegnazione;
- prova;
- classe;
- codice alunno;
- stato attivo;
- eventuali date di apertura/chiusura;
- eventuale consegna precedente.

Solo dopo questi controlli viene creata la riga in `submissions`.
