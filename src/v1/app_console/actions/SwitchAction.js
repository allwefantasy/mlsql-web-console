import ActionMaker from "../../ActionMaker"
import { ActionProxy } from "../../../backend_service/ActionProxy"
import RemoteAction from "../../../backend_service/RemoteAction"
import { AccessToken } from "../../../backend_service/backend/RestConst"

export const {handler:SwitchActionHandler,action:SwitchAction} = ActionMaker.buildHandler(async (action)=>{
    if(action.data.currentPage === "logout"){
        const client = new ActionProxy()
        await client.post(RemoteAction.LOGOUT, {})        
        sessionStorage.removeItem(AccessToken.name)
        sessionStorage.removeItem("user")
        return {        
            data: {
                currentPage: "admin",
                logined: false
            }
        }
    }
    return {        
        data: {
            currentPage: action.data.currentPage
        }
    }
})