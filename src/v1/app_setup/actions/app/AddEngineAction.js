import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import ActionMaker from "../../../ActionMaker"

export const {handler:AddEngineActionHandler,action:AddEngineAction} = ActionMaker.buildHandler(async (action)=>{
    const client = new ActionProxy()
    const { name, url } = action.data    
    const res = await client.post(RemoteAction.ENGINE_ADD, { name, url })
    if (res.status !== 200) {
        return {            
            data: {
                error: JSON.parse(res.content).msg
            }
        }
    }        
    return {        
        data: {
            error: undefined,
            current: action.__state.current + 1  
        }
    }
})
