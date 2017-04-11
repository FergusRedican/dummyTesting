public class WB_MarqueeController {
    
    @AuraEnabled
    public String getMarqueMessage(){
        if (WB_Wallboard__c.getValues('marque_message') != null){
            return WB_Wallboard__c.getValues('marque_message').Value__c;
        }else{
            return '';
        }
    }    
}