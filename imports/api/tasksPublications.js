import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.publish('tasks', function publishTasks(){
    return TasksCollection.find({userId: this.userId});
});

/**
 * Se usiamo this. dentro la funzione non possiamo usare una arrow func perché non ha lo scope adatto.
 */