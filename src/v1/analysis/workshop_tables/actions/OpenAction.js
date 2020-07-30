import ActionMaker from "../../../ActionMaker"

export const {handler:OpenActionHandler,action:OpenAction} = ActionMaker.buildHandler(async (action)=>{
    const {openTable,workshop} = action.data    
    workshop.newSession("temp","",openTable)                     
    return {        
        data: {}
    }
})