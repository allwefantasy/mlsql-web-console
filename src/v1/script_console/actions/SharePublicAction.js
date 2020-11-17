import ActionMaker from "../../ActionMaker"
import { ActionProxy } from "../../../backend_service/ActionProxy"
import RemoteAction from "../../../backend_service/RemoteAction"

export const {handler:SharePublicHandler,action:SharePublicAction} = ActionMaker.buildHandler(async (action)=>{
    const client = new ActionProxy()
    const {node,_} = action.data
    const res =  await client.post(RemoteAction.SCRIPT_SHARE_PUBLIC,{id:node.id})
    if(res.status!==200){
        return {data:{
                error: `Fail to share ${node.label}. Reason: ${res.content}`
            }}
    }
    return {data:{}}
})