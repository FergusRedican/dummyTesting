({
    //deletes the schedule record
    deleteSchedule : function(cmp,scheduleId,rowIdx) {
        var action = cmp.get("c.deleteSchedule");  
        action.setParams({
            "scheduleId":scheduleId
        });    
        action.setCallback(this,function(resp){           
            var state = resp.getState();
            //if SUCCESS, delete the schedule row from the table
            if(cmp.isValid() && state === 'SUCCESS'){
                cmp.find("scheduleTable").deleteRow(rowIdx);
            }
            else{
                console.log(resp.getError());
            }
        });
        
        $A.enqueueAction(action);
    },
    closeScheduleModal : function(cmp){
        //Hide the schedule modal once editing is done
        cmp.find("scheduleEditModal").close();
        
        //Reset the temporary variables
        cmp.set("v.rowIndex",-1);
        
        //Reset the selectedSchedule
        cmp.set("v.selectedSchedule",{'sobjectType':'OpportunityLineItemSchedule', 'Id':'', 'Quantity':'', 'ScheduleDate':'', 'Description':'', 'OpportunityLineItemId':''});
    }
})