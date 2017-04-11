({
 doInit : function(cmp, event, helper) {
 var action = cmp.get("c.getLineItems");

 action.setCallback(this,function(resp){
 var state = resp.getState();
 if(cmp.isValid() && state === 'SUCCESS'){
 cmp.set("v.lineitems",resp.getReturnValue());
 }
 else{
 console.log(resp.getError());
 }
 });

 $A.enqueueAction(action);
 },
})