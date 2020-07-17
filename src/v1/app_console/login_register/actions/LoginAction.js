import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import UIMaker from "../../../UIMaker"
import ActionMaker from "../../../ActionMaker"

export const {handler:LoginActionHandler,action:LoginAction} = ActionMaker.buildHandler(async (action)=>{
    const client = new ActionProxy()
    const res = await client.post(RemoteAction.LOGIN, action.data)
    if (res.status !== 200) {
        return {
            data:{logined:false}
        }
    }
    UIMaker.setupLogin(res)
    return {        
        data:{logined:true}
    }
})