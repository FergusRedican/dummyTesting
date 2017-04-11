({
    fetchSchedules : function(cmp,event,helper) {
        var action = cmp.get("c.getSchedulesOfLineItem");
        
        //Column data for the table
        var scheduleColumns = [
            {
                'label':'Start Date',
                'name':'ScheduleDate',
                'type':'reference',
                'value':'Id'
            },
            {
                'label':'Quantity',
                'name':'Quantity',
                'type':'double'
            },
            {
                'label':'Comments',
                'name':'Description',
                'type':'string'
            }
        ];
        
        //Configuration data for the table to enable actions in the table
        var scheduleTableConfig = {
            "massSelect":false,
            "searchBox":false,
            "searchByColumn":false,
            "globalAction":[
                    {
                        "label":"New",
                        "type":"button",
                        "id":"addschedule",
                        "class":"slds-button slds-button--neutral"
                    }
                ],
            "rowAction":[
                {
                    "label":"Edit",
                    "type":"url",
                    "id":"editschedule"
                },
                {
                    "label":"Del",
                    "type":"url",
                    "id":"delschedule"
                }
            ]
            
        };  
                  
        if(cmp.get("v.lineItemId")){
          
            action.setParams({
                "lineItemId":cmp.get("v.lineItemId")
            });
            
            action.setCallback(this,function(resp){
                var state = resp.getState();
                if(cmp.isValid() && state === 'SUCCESS'){
                    //pass the records to be displayed
                    cmp.set("v.lineItemSchedules",resp.getReturnValue());
                    
                    //pass the column information
                    cmp.set("v.scheduleColumns",scheduleColumns);
                    
                    //pass the configuration of schedule table
                    cmp.set("v.scheduleTableConfig",scheduleTableConfig);
                    
                    //Workaround to solve the timing issue when rendering
                    window.setTimeout($A.getCallback(function(){
                        //initialize the datatable
                        cmp.find("scheduleTable").initialize();
                    }),500);
                    
                }
                else{
                    console.log(resp.getError());
                }
            });
        
            $A.enqueueAction(action);
        }
    },
    //method is invoked when click happens in edit,delete link is clicked on a row;
    //Add schedule and Complete schedule button.
    tabActionClicked : function(cmp,event,helper){
        
        //get the id of the action being fired
        var actionId = event.getParam('actionId');
        
        if(actionId == 'editschedule'){
            //get the row where click happened and its position 
            var rowIdx = event.getParam("index");
            var clickedRow = event.getParam('row');

            //store the row and its position will for editing
            cmp.set("v.rowIndex",rowIdx);
            cmp.set("v.selectedSchedule",clickedRow);

            //set the type of schedule operation being done
            cmp.set("v.scheduleOpType",'Edit');  

            //Now,lets open the schedule modal
            cmp.find("scheduleEditModal").open();
       }
       else if(actionId == 'addschedule'){
           //set the type of schedule operation being done
           cmp.set("v.scheduleOpType",'Add'); 
           
           //Now,lets open the schedule modal
           cmp.find("scheduleEditModal").open();
       }
       else if(actionId == 'delschedule'){
           //get the row where click happened and its position 
           var rowIdx = event.getParam("index");
           var clickedRow = event.getParam('row');
           
           //Call the deleteSchedule method in the helper
           helper.deleteSchedule(cmp,clickedRow.Id,rowIdx);
       }
    },
    //Inserts/Updates Schedule record when `Ok` button is clicked in the schedule modal
    saveSchedule : function(cmp,event,helper){
        var action = cmp.get("c.upsertSchedule");
        var schedule = cmp.get("v.selectedSchedule");    
        var selectedLineItemId = cmp.get("v.lineItemId");
        
        if(selectedLineItemId){
            //set the Opportunity Line Item lookup field of the schedule 
            schedule.OpportunityLineItemId = selectedLineItemId;
            console.log('now testing111aaa=' + cmp.get("v.scheduleOpType"));
            if(cmp.get("v.scheduleOpType") == 'Add'){
                console.log('now testing222');
                schedule.id = null;
            }
            console.log('now testing333');            
            action.setParams({
                "scheduleRec":schedule
            });
            
            action.setCallback(this,function(resp){
                var state = resp.getState();
                if(cmp.isValid() && state === 'SUCCESS'){
                    //if operation is add, then add the schedule row to the table
                    if(cmp.get("v.scheduleOpType") == 'Add'){
                        cmp.find("scheduleTable").addRow(resp.getReturnValue());
                    }
                    else{
                        var rowIdx = cmp.get("v.rowIndex");
                        // if operation is edit, then update the row in the table
                        cmp.find("scheduleTable").updateRow(rowIdx,schedule); 
                    }
                    helper.closeScheduleModal(cmp);
                }
                else{
                    console.log(resp.getError());
                }
            });
        
            $A.enqueueAction(action);
        }
        
    },
    closeScheduleModal : function(cmp,event,helper){
        helper.closeScheduleModal(cmp);
    }
})