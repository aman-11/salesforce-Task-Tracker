import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import getTodoList from '@salesforce/apex/TodoHandler.getTodoList';
import updateTask from '@salesforce/apex/TodoHandler.updateTask';
import deleteTask from '@salesforce/apex/TodoHandler.deleteTask';
import emptyTodoTempl from './emptyTodoTemplate.html';
import todoTempl from './displayTodo.html';
import pubsub from 'c/pubsub'; 

//LDS for the AnnoucementService
import { publish, MessageContext } from 'lightning/messageService';
import TASK_BOOKMARKED from '@salesforce/messageChannel/announcements__c';

export default class DisplayTodo extends LightningElement {

    @track todos =[];
    @track taskCompleted=[];
    @track taskInProgress=[];
    @track error;
    @track loading = false;
    
    //Wired Apex result so it can be refreshed programmatically 
    @track wiredResults;

    //LDS WIRE
    @wire(MessageContext) messageContext;

    //get all the todo list
    @wire(getTodoList)
    getTodos(result) {

        this.wiredResults = result;
        const { data, error } = result;

        if (data) {

            this.todos = data;
            this.error = undefined;

            //filter ou inprogress and the completed task
            this.taskCompleted = data.filter(function (todo) {
                if (todo.Completed__c)
                    return todo;
            });

            this.taskInProgress = data.filter(function (todo) {
                if (!todo.Completed__c)
                    return todo;
            });

            console.log('taskCompleted', JSON.stringify(this.taskCompleted));
            console.log('taskInProgress', JSON.stringify(this.taskInProgress));
            

        } else {
            this.taskCompleted = undefined;
            this.taskInProgress = undefined;
            this.error = error;
        }

    }

    
    connectedCallback() {
        this.registerEvent();
    }

    render() {
        if ( this.taskCompleted && this.taskInProgress ) {
            return todoTempl;
        } else {
            return emptyTodoTempl;
        }
    }

    registerEvent() {
        
        console.log('registering the PubSub Event');
        pubsub.register('refreshTodos', this.handleEventRefresh.bind(this));

    }

    handleEventRefresh(payload) {
        
        this.loading = true;
        console.log('handleEventRefresh', payload);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: JSON.stringify(payload.message),
                variant: 'success'
            })
        );
        
        this.loading = false;
        return refreshApex(this.wiredResults);

    }

    bookmarkHandler(event) {

        let todo = event.target.value;

        //push to announcement
        let fields = { 'Name': todo.Name, 'Details__c': todo.Description__c };
        let objRecordInput = { 'apiName': 'Announcements__c', fields };
        
        // LDS method to create record.
        createRecord(objRecordInput).then(response => {

            if (response.id) {

                //LDS PUBLISH
                const message = {
                    messaeg: todo.Name + 'is Bookmarked!',
                 }
                publish(this.messageContext, TASK_BOOKMARKED, message);

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: todo.Name + 'is Bookmarked!',
                        variant: 'success'
                    })
                );
            }

        }).catch(error => {
            alert('Error: ' +JSON.stringify(error));
        });

    }

    completedHandler(event) {

        this.loading = true;

        let taskSeleted = event.target.value;
        console.log('ID to be Completed', taskSeleted);

        updateTask({ taskId: taskSeleted })
            .then( res => {
                console.log('response from update handler', res);
                
                // this.processList();
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Task Completed',
                        variant: 'success'
                    })
                );
                
                //console.log('refresh apex', this.wiredResults);
                return refreshApex(this.wiredResults);

            }).catch( err => {
                console.log('Update handler error:', err);
            })
        
        this.loading = false;
    }

    deleteHandler(event) {

        this.loading = true;

        let taskSeleted = event.target.value;
        console.log('ID to be deleted', taskSeleted);

        deleteTask({ taskId: taskSeleted })
            .then( res => {
                console.log('reeponse from delete handler', res);

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Task Deleted',
                        variant: 'success'
                    })
                );
                
                return refreshApex(this.wiredResults);

            }).catch( err => {
                console.log('Update handler error:', err);
            })
        
        this.loading = false;
    }

}