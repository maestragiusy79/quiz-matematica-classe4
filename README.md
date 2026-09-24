# ClasseLab

Piattaforma didattica per la scuola primaria con prove digitali, consegne centralizzate e risultati separati per docente.

## Struttura
- `/alunni/` → accesso alle prove;
- `/docenti/` → Area docenti collegata a Supabase;
- `/classe2/` → prove di Italiano di classe seconda;
- `/classe4/` → prove di Matematica di classe quarta;
- `/classe5/` → prove di Matematica di classe quinta;
- `/docente.html` e `/docente-demo.html` → reindirizzamento alla nuova Area docenti.

## Flusso operativo
1. Il docente accede con email e password.
2. Crea una classe.
3. Inserisce gli alunni; a ciascuno viene associato un codice univoco.
4. Attiva una delle prove pubblicate per quella classe.
5. ClasseLab genera un link specifico con codice di assegnazione.
6. L'alunno apre quel link, inserisce il proprio codice e svolge la prova.
7. La consegna viene validata da una Supabase Edge Function e salvata nel database.
8. Il docente autorizzato vede punteggio, dettaglio delle risposte e può esportare i risultati in CSV.

## Prove collegate al database
- Classe quarta · Matematica · Test d'ingresso;
- Classe quinta · Matematica · Problemi e numeri;
- Classe quinta · Matematica · Misure, geometria, relazioni;
- Classe seconda · Italiano · Prova d'ascolto;
- Classe seconda · Italiano · Scheda 1;
- Classe seconda · Italiano · Scheda 2;
- Classe seconda · Italiano · Scheda 3.

Le consegne di queste prove non vengono più conservate nel solo browser: vengono registrate in Supabase.

## Sicurezza e separazione dei dati
ClasseLab è progettato come sistema multi-docente.

Ogni docente può visualizzare solamente:
- le classi di cui è proprietario o a cui è assegnato;
- le verifiche di cui è proprietario o per cui dispone di un permesso;
- le consegne e i risultati delle verifiche per cui può vedere i risultati.

La separazione è applicata nel database tramite Row Level Security (RLS), non soltanto nell'interfaccia.

Gli alunni non hanno accesso diretto alle tabelle del database. Le consegne passano attraverso la funzione server `submit-quiz`, che verifica:
- codice dell'assegnazione;
- prova corretta;
- classe corretta;
- codice alunno attivo;
- eventuale finestra temporale della prova;
- assenza di una consegna precedente per la stessa assegnazione.

Le chiavi segrete Supabase restano esclusivamente lato server.

## Area docenti
L'Area docenti supporta:
- account personale con email e password;
- recupero password e reinvio conferma email;
- creazione classi;
- gestione alunni e codici;
- attivazione delle prove pubblicate;
- generazione e copia dei link per gli alunni;
- elenco delle prove attive;
- visualizzazione di punteggi e dettagli delle risposte;
- indicazione delle attività che richiedono anche correzione manuale;
- esportazione risultati in CSV.

## Documentazione
- `docs/ARCHITETTURA.md`
- `docs/MODELLO-DATI.md`
