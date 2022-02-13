global with sharing class TodoHandler {
    
    @auraEnabled
    public static Boolean createTodo( string task, string description, string taskType, string dueDate){
        try {
            if( task.length() > 0 && description.length() > 0  && taskType.length() > 0 && dueDate.length() > 0){
                system.debug('todo came'+ task +' '+description+' '+taskType+' '+dueDate);
                Todo__c todo = new Todo__c();
                todo.Name = String.valueOf(task);
                todo.Description__c = String.valueOf(description);
                todo.Type__c = String.valueOf(taskType);
                todo.Due_Date__c = Date.valueOf(dueDate);
                system.debug('todo to be'+ todo);
                insert todo;
                return true;
            }
        } catch (Exception e) {

            return false;

        }
        return true;
    }

    @AuraEnabled(cacheable=true)
    public static List<Todo__c> getTodoList(){
        try {
            
            List<Todo__c> todos = [SELECT Id, Name, Description__c, Completed__c, Type__c, Due_Date__c, Created_Date__c from Todo__c order by CreatedDate desc];
            return todos;

        } catch (Exception e) {
            system.debug('error'+e);
        }
        return null;
    }

    @AuraEnabled
    public static Boolean updateTask(string taskId){
        try {
            
            Todo__c todo = [SELECT Id, Completed__c from Todo__c WHERE Id =: taskId];
            todo.Completed__c = true;
            update todo;
            return true;

        } catch (Exception e) {
            system.debug('error'+ e);
            return false;
        }
    }

    @AuraEnabled
    public static Boolean deleteTask(string taskId){
        try {
            
            Todo__c todo = [SELECT Id from Todo__c WHERE Id =: taskId];
            delete todo;
            return true;

        } catch (Exception e) {
            system.debug('error'+ e);
            return false;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Announcements__c> getAnnouncements(){
        try {
            
            List<Announcements__c> data = [SELECT Id, Name, Details__c, Read__c from Announcements__c order by CreatedDate desc];
            return data;

        } catch (Exception e) {
            system.debug('error'+e);
        }
        return null;
    }

}