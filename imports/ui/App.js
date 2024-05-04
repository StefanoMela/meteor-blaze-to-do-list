import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection';
 
import './App.html';
 
Template.mainContainer.helpers({
  tasks() {
    return TasksCollection.find({}, {sort: {createdAt: -1} })
  }
});

Template.form.events({
  "submit .task-form"(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert task into collection
    TasksCollection.insert({
      text,
      createdAt: new Date() // current time
    });

    console.log(event)

    // clear form
    target.text.value = '';
  }
})