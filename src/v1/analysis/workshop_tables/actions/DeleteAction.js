import ActionMaker from "../../../ActionMaker"
import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import Tools from "../../../../common/Tools"

export const {handler:DeleteActionHandler,action:DeleteAction} = ActionMaker.buildHandler(async (action)=>{
    const {id} = action.data
    const proxy = new ActionProxy()
    await proxy.get(RemoteAction.ANALYSIS_TABLE_DELETE,{tableName:id})
    return {        
        data: {
            reloading: Tools.getJobName()           
        }
    }
})