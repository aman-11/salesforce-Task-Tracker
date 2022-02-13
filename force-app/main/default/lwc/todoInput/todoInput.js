import { LightningElement, api, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STATUS_FIELD from '@salesforce/schema/Todo__c.Type__c';
import createTodo from '@salesforce/apex/TodoHandler.createTodo';
import pubsub from 'c/pubsub' ; 

export default class TodoInput extends LightningElement {

    @api utilityTitle = 'New Task';
    typelist = [];
    task='';
    description='';
    type;
    date;
    loading = false;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA', // Default record type Id
        fieldApiName: STATUS_FIELD
    })
    getTypeOptions({ error, data }){

        if (data) {
            console.log('option data from obj', data);
            this.typelist = data.values.map( obj => {
                return {
                    label: obj.label,
                    value: obj.value
                };
            });
            console.log( 'Options are ' + JSON.stringify( this.options ) );

        } else {

            console.log('error', error);
        }

    }

    handleTask(event) {
        this.task = event.target.value;
    }

    handleDescription(event) {
        this.description = event.target.value;
    }

    handleDate(event) {
        this.date = event.target.value;
    }

    handleType(event) {
        this.type = event.target.value;
    }

    handleSubmit(event) {
        event.preventDefault(); 
        if (this.task && this.description && this.type && this.date) {

            this.loading = true;
            console.log('data -->', this.task, this.description, this.type, this.date);

            //send to apex class to create task
            createTodo({ task: this.task, description: this.description, taskType: this.type, dueDate: this.date })
                .then((result) => { 
                    console.log('Task Created!', result);
                    this.task = '';
                    this.description = '';
                    this.type = '';
                    this.date = '';
                    this.loading = false;

                    let message = { "message": "New Task is going to be added!" };
                    pubsub.fire('refreshTodos', message);

                }).catch((error) => {
                    console.log('Inside Apex Create Task error', error);
                });

        } else {
            console.log('fill the details');
        }
    }

}
//{
//     controllerValues: {… },
    //    defaultValue: null,
//     url: '/services/data/v53.0/ui-api/object-info/Todo__c/picklist-values/012000000000000AAA/Type__c',
//     values: Array(4)
// }
//data.values
// values: Array(2)
// 0: {attributes: null, label: 'Completed', validFor: Array(0), value: 'Completed'}
// 1: {attributes: null, label: 'Doing', validFor: Array(0), value: 'Doing'}
//{Description__c=saass, Due_Date__c=2022-02-11 00:00:00, Type__c=Coding, Name=apex}