public class LineItemScheduleController {
    @AuraEnabled
    public static List<OpportunityLineItemSchedule> getSchedulesOfLineItem(String lineItemId){
     return [SELECT Id, Quantity, ScheduleDate, Description, OpportunityLineItemId
               FROM OpportunityLineItemSchedule
              WHERE OpportunityLineItemId=:lineItemId
              Order by ScheduleDate asc
            ];
    }
    
    @AuraEnabled
    public static List<OpportunityLineItem> getLineItems(){
        return [SELECT Id,Name FROM OpportunityLineItem];
    }   
    
    @AuraEnabled
    public static OpportunityLineItemSchedule upsertSchedule(OpportunityLineItemSchedule scheduleRec){
        // if Id is present, then update schedule else insert schedule
        // Format the Date to use day/month/year alone, removing time values added via JavaScript date picker.
        scheduleRec.ScheduleDate = date.newinstance(scheduleRec.ScheduleDate.year(), scheduleRec.ScheduleDate.month(), scheduleRec.ScheduleDate.day());
        upsert scheduleRec;

        return scheduleRec;
    }
    
    @AuraEnabled
    public static void deleteSchedule(String scheduleId){
        delete new OpportunityLineItemSchedule(id=scheduleId);
    }    
}