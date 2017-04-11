({
    send : function(component, event, helper) {
        var messageEvent = component.getEvent("messageEvent");
        var text = event.source.get("v.label");
        messageEvent.setParams({
            "text": text
        });
        messageEvent.fire();
    }
})