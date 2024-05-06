# Meteor tutorial

First app w/ Meteor, built following their tutorial.

Below you'll find what i've got from and the translation of the tutorial guide

## Introduzione - Creazione dell'App

Dopo aver installato Meteor, il modo più facile per iniziare a creare un'app è usando il comando meteor create, volendo con l'opzione --blaze per avere il template blaze, e il nome del progetto:

```meteor create --blaze simple-todos-blaze --prototype```

I file creati nella cartella 'client' sono quelli che si occuperanno della parte client-side.
I file creati nella cartella 'server' sono quelli che settano la parte server.

Si può definire quali saranno i file main nel package.json.

## Methods

Senza methods, qualsiasi utente può editare qualsiasi parte del DB dal FE, senza check o controlli.
In meteor, il modo più facile per fare cambiamenti sul server in sicurezza è dichiarando dei metodi invece di chiamare insert, update o remove direttamente dal client.
Ogni nuova app creata con Meteor ha il package insecure installato per default, bisogno disinstallarlo con:

```meteor remove insecure```

Con i metodi, possiamo verificare se l'utente è autenticato e autorizzato a fare determinate azioni, e nel caso modificare il DB.
Un metodo Meteor è un modo di comunicare con il server usando la funzione Meteor.call, passando nome del metodo e argomenti: 

i.e. ```Meteor.methods({'tasks.insert'(text)```

Con i methods introduciamo controlli di sicurezza che vengono dichiarati e chiamati all'occorrenza. Si può pensare ad essi come a delle chiamate POST con varie features in più.

E' necessario scrivere un metodo per ogni operazione che verrà fatta client side/FE; ed è necessario che i metodi siano definiti sia lato back che lato front, così da aver accesso all'Optimistic Ui.

OptimisticUI: non è altro che la renderizzazione della probabile risposta del server, viene renderizzata allo scatenarsi dell'evento, prima che arrivi la risposta del server. Se la risposta è uguale a ciò che è stato renderizzato, nulla cambia; in caso contrario il FE rifletterà lo stato del server.

I methods hanno varie proprietà, a cui si accede con l'obj this.

Usiamo anche il package {check} per assicurare di inviare e ricevere i tipi di dato corretti.

Per utilizzare i methods lato client/FE bisogna importare il file dei metodi in server/main.js

Dopo aver definito e importato i methods bisogna, in questo caso, aggiornare i file dove usavamo le collections - App.js, Task.js

## Publications

Finora si è lavorato renderizzando totalità del DB lato client, così che chiamando ```tasks.find()``` vengano trovati tutti i record di quella collection.
Ma se l'utente volesse salvare dati privati e non renderizzare la totalità del DB ?
Dobbiamo controllora quali dati mandiamo al DB lato client

Come per ```insecure```, Meteor starta l'app con il package ```autopublish```, che sincronizza automaticamente tutto il content del DB con il lato client. Rimuoviamo con ```meteor remove autopublish```.

Senza ```autopublish``` dovremmo specificare esplicitamente cosa il server renderizza. Le funzioni di Meteor che fanno ciò sono ```Meteor.publish``` e ```Meteor.subscribe```:

- ```.publish```: permette di pubblicare i dati dal server al client

- ```.subscribe```: peremtte al client di richiedere i dati al server.

Per prima cosa bisogna aggiugnere una ```publication``` al server. Essa dovrà pubblicare tutte le task dell'utente autenticato. Come nei metodi si può usare ```this.userId``` nella publication function per avere accesso all'id autenticato.

Per far si che il server registri la pubblicazione dobbiamo importare il file ```Publications.js ```in ```server/main.js```

D'ora in poi possiamo effettuare ```subscribe``` a quella ```pubblication```.

Poiché vogliamo ricevere i cambiamenti dalla ```publication```, dovremmo fare ```subscribe``` ad essa dentro un ```Tracker.autorun```

```Tracker.autorun``` runna una funzione alla chiamata e un'altra ogni qualvolta le sue ```dependecies``` cambiano, che è perfetto per sapere quando i dati sono pronti per essere visualizzati dall'utente.

Chiamare ```Meteor.publish``` sul server registra una pubblicazione chiamata ```tasks```. Quando ```Meteor.subscribe``` è chiamato sul client con il nome della pubblicazione, il client sottoscrive a tutti i dati di qeulla pubblicazione, in questo caso a tutte le task nel DB per l'utente autenticato.

Bisogna anche far si che solo l'utente che ha creato le task possa effettuare determinate azioni. Per far ciò bisogna cambiare i metodi e controllare se l'utente autenticato è lo stesso che ha creato il task.

E' importante di fare ciò perché chiunque può accedere e cambiare i metodi via DevTools.