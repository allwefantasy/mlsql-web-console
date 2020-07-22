import UIMaker from "../../UIMaker"
import ActionMaker from "../../ActionMaker"

export const {handler:CheckLoginedActionHandler,action:CheckLoginedAction} = ActionMaker.buildHandler(async (action)=>{
    let currentPage = "console"
    if(action.__state.currentPage==="register" && !UIMaker.logined()){
        currentPage = "register"
    }
    return {        
        data: {
            ...action.data,
            logined: UIMaker.logined(),
            currentPage
        }
    }
})