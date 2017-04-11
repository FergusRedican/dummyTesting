global without sharing class WB_CaseViewController {

    @RemoteAction
    global static Map<String, Integer> getCaseStatuses() {
        Map<String, Integer> resultMap = new Map<String, Integer>();

        Schema.DescribeFieldResult fieldValues = Case.Origin.getDescribe();
        List<Schema.PicklistEntry> ple = fieldValues.getPicklistValues();

        for ( Schema.PicklistEntry f : ple) {
            resultMap.put(f.getValue(), 0);
        }

        AggregateResult[] groupedResults = [SELECT Origin, COUNT(Id) ct FROM Case WHERE isClosed = false GROUP BY Origin];
        System.debug('\n\nAGG REsultS: ' + groupedResults);
        for (AggregateResult ar : groupedResults) {
            resultMap.put((String)ar.get('Origin'), (Integer)ar.get('ct'));
        }
        System.debug('\n\nMAP: ' + resultMap);
        return resultMap;
    }
    @RemoteAction
    global static Integer getClosedCaseCount() {
        return [Select Count() from Case where isClosed = true];
    }
    public String highRange {
        get{
            if (WB_Wallboard__c.getValues('tile_color_range_high') != null)
                return WB_Wallboard__c.getValues('tile_color_range_high').Value__c;
            else
                return '0';
        }
    }
    public String lowRange {
        get{
            if (WB_Wallboard__c.getValues('tile_color_range_low') != null)
                return WB_Wallboard__c.getValues('tile_color_range_low').Value__c;
            else
                return '0';
        }
    }
    //Remote action for top advisors
    @RemoteAction
    global static List<User> getTopAdvisors() {
        //List<User> users = [SELECT FullPhotoUrl, Name, WB_Customer_Effort_Score__c FROM User WHERE Id IN
        //                    (SELECT UserId FROM LoginHistory WHERE loginType = 'Application') AND IsActive=true and WB_Customer_Effort_Score__c!=null
         //                   Order BY WB_Customer_Effort_Score__c Desc NULLS Last limit 5];
        List<User> users = [SELECT FullPhotoUrl, Name, WB_Customer_Effort_Score__c FROM User WHERE IsActive=true and WB_Customer_Effort_Score__c!=null
                            Order BY WB_Customer_Effort_Score__c Desc NULLS Last limit 5];
        if (!users.isEmpty()) {
            return users;
        } else {
            return null;
        }
    }

    public String marqueMessage
    {
        get{
            if (WB_Wallboard__c.getValues('marque_message') != null)
                return WB_Wallboard__c.getValues('marque_message').Value__c;
            else
                return '';
        }
    }

}