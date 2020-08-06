import ActionMaker from "../../../ActionMaker"


export const {handler:ApplyActionHandler,action:ApplyAction} = ActionMaker.buildHandler(async (action)=>{
    const {apply} = action.data     
    if(apply){
        apply(action.data)
    }
    return {        
        data: {
            ...action.data
        }
    }
})