import UIMaker from "../../UIMaker"
import ActionMaker from "../../ActionMaker"

export const {handler:CheckLoginedActionHandler,action:CheckLoginedAction} = ActionMaker.buildHandler(async (action)=>{
    return {        
        data: {
            ...action.data,
            logined: UIMaker.logined()
        }
    }
})