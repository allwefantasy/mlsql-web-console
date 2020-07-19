export const {handler:RollbackActionHandler,action:RollbackAction} = ActionMaker.buildHandler(async (action)=>{
    const {workshop} = action.data
    await workshop.rollback()
    return {        
        data: action.data
    }
})