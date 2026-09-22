# ClasseLab

Piattaforma didattica in evoluzione per la scuola primaria.

## Obiettivo
Trasformare verifiche ed esercitazioni in attività digitali semplici da svolgere per gli alunni e facili da gestire per i docenti.

## Struttura attuale
- `/alunni/` → accesso alle prove;
- `/docenti/` → area docenti dimostrativa;
- `/classe4/` → attività di classe quarta;
- `/classe5/` → area predisposta per classe quinta;
- `/docente.html` → risultati della versione pilota.

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
La versione pubblicata su GitHub Pages è ancora una demo.

La password unica dell'Area docenti serve solamente per la dimostrazione e non rappresenta il sistema definitivo di autenticazione.

In futuro il front-end resterà su GitHub Pages mentre autenticazione, utenti, verifiche e risultati saranno gestiti da un database esterno con regole di accesso.

Vedi anche:
- `docs/ARCHITETTURA.md`
- `docs/MODELLO-DATI.md`
