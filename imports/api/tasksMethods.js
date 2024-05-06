/**
 * Methods:
 * 
 * Senza methods, qualsiasi utente può editare qualsiasi parte del DB dal FE, senza check o controlli.
 * Con i methods introduciamo controlli di sicurezza che vengono dichiarati e chiamati all'occorrenza. Si può pensare ad essi come a delle chiamate POST con varie features in più.
 * E' necessario scrivere un metodo per ogni operazione che verrà fatta client side/FE; ed è necessario che i metodi siano definiti sia lato back che lato front, così da aver accesso all'Optimistic Ui.
 * OptUI: non è altro che la renderizzazione della probabile risposta del server, viene renderizzata allo scatenarsi dell'evento, prima che arrivi la risposta del server. Se la risposta è uguale a ciò che è stato renderizzato, nulla cambia; in caso contrario il FE rifletterà lo stato del server.
 * I methods hanno varie proprietà, a cui si accede con l'obj this. 
 * Usiamo anche il package {check} per assicurare di inviare e ricevere i tipi di dato corretti.
 * 
 * Per utilizzare i methods lato client/FE basta importare questo file in server/main.js
 * 
 * Dopo aver definito e importato i methods bisogna, in questo caso, aggiornare i file dove usavamo le collections - App.js, Task.js
 * 
*/

import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';
import { error } from 'jquery';

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        if (!this.userId) {
            throw new Meteor.Error('Not Authorized');
        }

        TasksCollection.insert({
            text,
            createdAt: new Date,
            userId: this.userId,
        })
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized');
        }
        TasksCollection.remove(taskId);
    },
    'tasks.setIsChecked'(taskId, isChecked) {
        check(taskId, String),
            check(isChecked, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('Non autorizzato');
        }
        TasksCollection.update(taskId, {
            $set: {
                isChecked
            }
        });
    }
});