import ActionMaker from "../../ActionMaker"
import { ActionProxy } from "../../../backend_service/ActionProxy"
import RemoteAction from "../../../backend_service/RemoteAction"

export const {handler:OpenScriptFileActionHandler,action:OpenScriptFileAction} = ActionMaker.buildHandler(async (action)=>{
    const client = new ActionProxy()
    const {node,consoleApp} = action.data
    if(!node.isDir){
        const res =  await client.get(RemoteAction.SCRIPT_FILE_GET,{id:node.id})
        if(res.status!==200){
            return {data:{
                error: `Fail to get file ${node.label}. Reason: ${res.content}`                
            }}
        }
        const scriptFile = res.content
        consoleApp.openExistsOrNewEditor({id: node.id, content: scriptFile.content, name: scriptFile.name})
      }
    return {data:{}}
})