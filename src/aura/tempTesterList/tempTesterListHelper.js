({
 closeTaskModal : function(cmp){
 //Hide the task modal once editing is done
cmp.find("taskEditModal").close();

 //Reset the rowindex
 cmp.set("v.rowIndex",-1);

 //Reset the selectedTask
cmp.set("v.selectedTask",{'sobjectType':'OpportunityLineItemSchedule', 'Quantity':'', 'ScheduleDate':'', 'Description':'', 'OpportunityLineItemId':''});
},
})
                          
({
 //deletes the task record
 deleteTask : function(cmp,taskId,rowIdx) {
 var action = cmp.get("c.deleteTask");

 action.setParams({
 "taskId":taskId
 });
     
 action.setCallback(this,function(resp){
 var state = resp.getState();

 //if SUCCESS, delete the task row from the table
 if(cmp.isValid() && state === 'SUCCESS'){
 cmp.find("taskTable").deleteRow(rowIdx);
 }
 else{
 console.log(resp.getError());
 }
 });

 $A.enqueueAction(action);
 }
   
})
    
({
 completeTasks : function(cmp){

 //Retrieve the selectedTask rows in the table using v.selectedRows of the
Datatable Component
 var selectedTasks = cmp.find("taskTable").get("v.selectedRows");

 for(var i = 0;i < selectedTasks.length;i++){
 selectedTasks[i].Stage__c = 'Completed';
 selectedTasks[i] = JSON.parse(JSON.stringify(selectedTasks[i]));
 }

 var action = cmp.get("c.markTasksAsCompleted");

 action.setParams({
 "tasks":selectedTasks
 });

 action.setCallback(this,function(resp){
 var state = resp.getState();
 //if SUCCESS, call the rerenderRows() to reflect the changes in the
table
 if(cmp.isValid() && state === 'SUCCESS'){
 cmp.find("taskTable").rerenderRows();
 }
 else{
 console.log(resp.getError());
 }
 });

 $A.enqueueAction(action);
 }
})