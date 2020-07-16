import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import { AppSetupEventConst } from "./AppSetupReducer"
import ActionMaker from "../../../ActionMaker"

const {handler:AddEngineActionHandler} = ActionMaker.buildHandler(async (action)=>{
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
            _current: true  
        }
    }
})


function AddEngineAction(state, data) {
    if (data["_current"]) {
        return { ...state, ...data, current: state.current + 1 }
    }
    return { ...state, ...data }
}

export { AddEngineAction, AddEngineActionHandler }