import ActionMaker from "../../ActionMaker"

export const {handler:SwitchActionHandler,action:SwitchAction} = ActionMaker.buildHandler(async (action)=>{
    
    return {        
        data: {
            currentPage: action.data.currentPage
        }
    }
})