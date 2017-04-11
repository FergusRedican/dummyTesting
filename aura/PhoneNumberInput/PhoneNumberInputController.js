({
	setPhone : function(component, event, helper) {
		var phone = component.find("phone").get("v.value");
        $A.get("e.c.PhoneNumberEvent").setParams({
            phone: phone
        }).fire();
	}
})