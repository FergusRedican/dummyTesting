({
 fetchTasks : function(cmp, event, helper) {
 var action = cmp.get("c.getSchedulesOfLineItem");

 //Column data for the table
 var taskColumns = [
 {
 'label':'Quantity',
 'name':'Quantity',
 'type':'double'
 }
 ];

 //Configuration data for the table to enable actions in the table
 var taskTableConfig = {
 "massSelect":true,
 "globalAction":[
 {
 "label":"Add Task",
 "type":"button",
 "id":"addtask",
 "class":"slds-button slds-button--neutral"
 },
{
 "label":"Complete Task",
 "type":"button",
 "id":"completetask",
 "class":"slds-button slds-button--neutral"
 }
 ],
 "rowAction":[
 {
 "label":"Edit",
 "type":"url",
 "id":"edittask"
 },
 {
 "label":"Del",
 "type":"url",
 "id":"deltask"
 }
 ]

 };

 if(cmp.get("v.projectId")){

 action.setParams({
 "projectId":cmp.get("v.projectId")
 });

 action.setCallback(this,function(resp){
 var state = resp.getState();
 if(cmp.isValid() && state === 'SUCCESS'){
 //pass the records to be displayed
cmp.set("v.projectTasks",resp.getReturnValue());

//pass the column information
cmp.set("v.taskColumns",taskColumns);

//pass the configuration of task table
cmp.set("v.taskTableConfig",taskTableConfig);

//initialize the datatable
cmp.find("taskTable").initialize({
"order":[0,"desc"]
 });
 }
 else{
 console.log(resp.getError());
 }
 });

 $A.enqueueAction(action);
 }
 }    
})

({ tableActionHandler: function(cmp, event, helper){ //get the id of the action being fired var actionId = event.getParam('actionId'); if(actionId == 'edittask'){ //get the row where click happened and its position var rowIdx = event.getParam("index"); var clickedRow = event.getParam('row'); //store the row and its position will for editing cmp.set("v.rowIndex",rowIdx); cmp.set("v.selectedTask",clickedRow); //set the type of task operation being done cmp.set("v.taskOpType",'Edit'); //Now,lets open the task modal cmp.find("taskEditModal").open(); } else if(actionId == 'addtask'){ //set the type of task operation being done cmp.set("v.taskOpType",'Add'); //Now,lets open the task modal cmp.find("taskEditModal").open(); } }, //Inserts/Updates Task record when `Ok` button is clicked in the task modal saveTask : function(cmp,event,helper){ var action = cmp.get("c.upsertTask"); var task = cmp.get("v.selectedTask"); var selectedProjId = cmp.get("v.projectId"); if(selectedProjId){
     //set the Project lookup field of the task
 task.OpportunityLineItemId = selectedProjId;

 action.setParams({
 "taskRec":task
 });

 action.setCallback(this,function(resp){
 var state = resp.getState();
 if(cmp.isValid() && state === 'SUCCESS'){

//if operation is add, then add the task row to the table
if(cmp.get("v.taskOpType") == 'Add'){
 cmp.find("taskTable").addRow(resp.getReturnValue());
 }
else{
 var rowIdx = cmp.get("v.rowIndex");
 // if operation is edit, then update the row in the table
cmp.find("taskTable").updateRow(rowIdx,task);
 }

//Close the task modal
helper.closeTaskModal(cmp);
 }
 else{
 console.log(resp.getError());
 }
 });

 $A.enqueueAction(action);
 }

 }
})
                          
({
 tableActionHandler : function(cmp,event,helper){

 //get the id of the action being fired
 var actionId = event.getParam('actionId');

 if(actionId == 'edittask'){
 //get the row where click happened and its position
 var rowIdx = event.getParam("index");
 var clickedRow = event.getParam('row');

 //store the row and its position will for editing
 cmp.set("v.rowIndex",rowIdx);
 cmp.set("v.selectedTask",clickedRow);

 //set the type of task operation being done
 cmp.set("v.taskOpType",'Edit');

 //Now,lets open the task modal
 cmp.find("taskEditModal").open();
 }
 else if(actionId == 'addtask'){
 //set the type of task operation being done
 cmp.set("v.taskOpType",'Add');

 //Now,lets open the task modal
 cmp.find("taskEditModal").open();
 }
 else if(actionId == 'deltask'){
 //get the row where click happened and its position
 var rowIdx = event.getParam("index");
 var clickedRow = event.getParam('row');

 //Call the deletTask method in the helper
 helper.deleteTask(cmp,clickedRow.Id,rowIdx);
 }
 }}
 
({
 tableActionHandler: function(cmp,event,helper){

 //get the id of the action being fired
 var actionId = event.getParam('actionId');

 if(actionId == 'edittask'){
 //get the row where click happened and its position
 var rowIdx = event.getParam("index");
 var clickedRow = event.getParam('row');

 //store the row and its position will for editing
 cmp.set("v.rowIndex",rowIdx);
 cmp.set("v.selectedTask",clickedRow);

 //set the type of task operation being done
 cmp.set("v.taskOpType",'Edit');

 //Now,lets open the task modal
 cmp.find("taskEditModal").open();
 }
 else if(actionId == 'addtask'){
 //set the type of task operation being done
 cmp.set("v.taskOpType",'Add');

 //Now,lets open the task modal
 cmp.find("taskEditModal").open();
 }
 else if(actionId == 'deltask'){
 //get the row where click happened and its position
 var rowIdx = event.getParam("index");
 var clickedRow = event.getParam('row');

 //Call the deletTask method in the helper
 helper.deleteTask(cmp,clickedRow.Id,rowIdx);
 }
 else if(actionId == 'completetask'){
 //call the completeTasks method in the helper
 helper.completeTasks(cmp);
 }
 }}
})
 
})