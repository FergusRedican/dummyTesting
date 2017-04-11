({
	send : function(component, event, helper) {
		var phone = component.find("phone").get("v.value");
        console.log(phone);
        $A.get("e.c:PhoneNumberEvent").setParams({
            phone: phone
       }).fire();
	}
})