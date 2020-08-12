import ActionMaker from "../../ActionMaker"
import { ActionProxy } from "../../../backend_service/ActionProxy"
import RemoteAction from "../../../backend_service/RemoteAction"

export const {handler:PublishAnalysisPluginActionHandler,action:PublishAnalysisPluginAction} = ActionMaker.buildHandler(async (action)=>{
    const client = new ActionProxy()
    const {node,consoleApp} = action.data
    if(!node.isDir){
        const res =  await client.post(RemoteAction.ANALYSIS_PLUGIN_PUBLISH,{id:node.id})
        if(res.status!==200){
            return {data:{
                error: `Fail to publish file ${node.label}. Reason: ${res.content}`                
            }}
        }                
    }
    // consoleApp.
    return {data:{}}
})