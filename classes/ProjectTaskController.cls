public class ProjectTaskController {
    
    @AuraEnabled
    public static List<Project__c> getProjects(){
        return [SELECT Id,Name FROM Project__c];
    }
    
    @AuraEnabled
    public static List<Task__c> getTasksOfProject(String projectId){
        return [SELECT Id,Name,Start_Date__c,Due_Date__c,Stage__c,Description__c 
                FROM Task__c
                WHERE Project__c = :projectId];
    }  
    
    @AuraEnabled
    public static Task__c upsertTask(Task__c taskRec){
        upsert taskRec;
        return taskRec;
    }
    
    @AuraEnabled
    public static void markTasksAsCompleted(List<Task__c> tasks){
        update tasks;
    }
    
    @AuraEnabled
    public static void deleteTask(String taskId){
        delete new Task__c(id=taskId);
    }
    
}