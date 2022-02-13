import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import getAnnouncements from '@salesforce/apex/TodoHandler.getAnnouncements';
import ID_FIELD from "@salesforce/schema/Announcements__c.Id";
import READ_FIELD from "@salesforce/schema/Announcements__c.Read__c"

//LDS for the AnnoucementService
import { subscribe, MessageContext } from 'lightning/messageService';
import TASK_BOOKMARKED from '@salesforce/messageChannel/announcements__c';

export default class Announcement extends LightningElement {

    @api utilityTitle = 'Announcement';
    @track unreadTask = [];
    //@track tasks = [];
    isTask = false;
    loading;

    //LDS WIRE
    subscription = null;
    @wire(MessageContext) messageContext;
    
    //for the apexRefresh
    @track wiredResults;

    @wire(getAnnouncements)
    getBookmarked(result) {

        this.wiredResults = result;
        const { data, error } = result;

        if (data) {

            // this.tasks = data;
            this.error = undefined; 

            //filter out read task
            this.unreadTask = data.filter(function (todo) {
                if (!todo.Read__c)  
                    return todo;
            });

            this.isTask = this.unreadTask.length > 0;
            console.log('unread Task', JSON.stringify(this.unreadTask));
            this.loading = false;

        } else {
            this.unreadTask = undefined;
            // this.error = error;
            console.log('wired Handler error', error)
        }

    }

    connectedCallback() {

        // Subscribe to TASK_BOOKMARKED message
        this.subscription = subscribe(
            this.messageContext,
            TASK_BOOKMARKED,
            (message) => {
                this.handleTaskListUpdate(message);
            }
        );
        console.log('Subscribe', this.subscription);
        
    }    

    disconnectedCallback() {

        // Unsubscribe from TASK_BOOKMARKED message
        unsubscribe(this.subscription);
        this.subscription = null;

    }

    handleTaskListUpdate(message) {

        let data = message;
        console.log('message by lds', data);
        return refreshApex(this.wiredResults);

    }

    readHandler(event) {
        
        this.loading = true;

        let readId = event.target.value;
        //console.log('read task', readId);

        const fields = {};

        fields[ID_FIELD.fieldApiName] = readId;
        fields[READ_FIELD.fieldApiName] = true;
                
        const recordInput = {
            fields: fields
        };
        
        // LDS method to create record.
        updateRecord(recordInput)
            .then((record) => {
                console.log('done updating', record);
                return refreshApex(this.wiredResults);
            }).catch(error => {
                alert('Error: ' + JSON.stringify(error));
            });
    }

}