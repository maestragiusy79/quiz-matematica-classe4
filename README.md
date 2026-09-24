# ClasseLab

Piattaforma didattica in evoluzione per la scuola primaria.

## Obiettivo
Trasformare verifiche ed esercitazioni in attività digitali semplici da svolgere per gli alunni e facili da gestire per i docenti.

## Struttura attuale
- `/alunni/` → accesso alle prove;
- `/docenti/` → area docenti dimostrativa;
- `/classe4/` → attività di classe quarta;
- `/classe5/` → area predisposta per classe quinta;
- `/docente.html` → reindirizzamento alla nuova Area docenti.

## Prima prova attiva
Classe quarta → Matematica → Test d'ingresso.

## Regola fondamentale del progetto
ClasseLab sarà multi-docente.

Ogni docente dovrà avere un proprio account e potrà visualizzare solamente:
- le classi assegnate;
- le verifiche di cui è proprietario o per cui è autorizzato;
- le risposte e i risultati relativi a quelle verifiche.

Un docente non deve poter visualizzare prove o risultati appartenenti a un altro docente.

Esempio:
- Giusy → Matematica classe quarta + future prove comuni di Matematica classe quinta;
- altro docente → Italiano classe seconda;
- Giusy non vede le risposte di Italiano;
- il docente di Italiano non vede i risultati di Matematica di Giusy.

## Evoluzione prevista
- account personali dei docenti;
- autorizzazioni per docente;
- classi e discipline assegnate;
- proprietà delle verifiche;
- risultati filtrati per docente;
- database centralizzato;
- accesso da più dispositivi;
- creazione e duplicazione di verifiche.

## Stato attuale
Il front-end è pubblicato su GitHub Pages.

L'Area docenti è ora collegata a Supabase e supporta:
- account docente con email e password;
- classi salvate nel database;
- verifiche salvate nel database;
- risultati filtrati tramite Row Level Security.

Il test d'ingresso di matematica di classe quarta è ancora una prova statica pubblicata su GitHub Pages. Il prossimo passaggio è salvare anche le consegne degli alunni direttamente su Supabase, così i risultati saranno centralizzati e visibili solo al docente autorizzato.

Vedi anche:
- `docs/ARCHITETTURA.md`
- `docs/MODELLO-DATI.md`
