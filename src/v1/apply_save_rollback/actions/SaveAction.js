import ActionMaker from "../../ActionMaker"

export const {handler:SaveActionHandler,action:SaveAction} = ActionMaker.buildHandler(async (action)=>{
    const {workshop} = action.data
    const {saveTablePersisted,saveTableName} = action.__state
    if(!saveTableName) return {
        data:{error:"table name is required"}
    }    
    await workshop.save(saveTableName,saveTablePersisted)
    workshop.refreshTableWorkshop()
    return {        
        data: {...action.data,loading:false}
    }
})