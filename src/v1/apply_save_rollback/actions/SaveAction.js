export const {handler:SaveActionHandler,action:SaveAction} = ActionMaker.buildHandler(async (action)=>{

    return {        
        data: action.data
    }
})