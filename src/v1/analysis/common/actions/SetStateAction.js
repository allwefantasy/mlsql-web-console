import ActionMaker from "../../../ActionMaker"

export const {handler:SetStateActionHandler,action:SetStateAction} = ActionMaker.buildHandler(async (action)=>{
    return {        
        data: {
            ...action.data  
        }
    }
})