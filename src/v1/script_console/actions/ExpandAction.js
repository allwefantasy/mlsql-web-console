import { ActionProxy } from "../../../backend_service/ActionProxy"
import RemoteAction from "../../../backend_service/RemoteAction"
import ActionMaker from "../../ActionMaker"

export const {handler:ExpandActionHandler,action:ExpandAction} = ActionMaker.buildHandler(async (action)=>{
    const {expandedKeys} = action.data
    const {expandedKeys:oldExpandedKeys} = action.__state
    const newExpanedKeys = expandedKeys.filter(item=>!oldExpandedKeys.includes(item))
    const newNoExpanedKeys = oldExpandedKeys.filter(item=>!expandedKeys.includes(item))
    const client = new ActionProxy()    
    newExpanedKeys.forEach(async element => {    
        await client.post(RemoteAction.SAVE_SCRIPT_FILE,{
            id: element,isExpanded:true 
        })
    });

    newNoExpanedKeys.forEach(async element => {        
        await client.post(RemoteAction.SAVE_SCRIPT_FILE,{
            id: element,isExpanded:false 
        })
    });

    return {        
        data: {
            expandedKeys
        }
    }
})