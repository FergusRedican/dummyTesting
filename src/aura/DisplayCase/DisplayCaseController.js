/*DisplayCaseController.js*/
({
	getCaseFromId : function(cmp, event) {
        var action = cmp.get("c.getCaseFromId");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.record", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})