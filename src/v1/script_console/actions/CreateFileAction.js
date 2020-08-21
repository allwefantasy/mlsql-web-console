import ActionMaker from "../../ActionMaker"
import { ActionProxy } from "../../../backend_service/ActionProxy"
import RemoteAction from "../../../backend_service/RemoteAction"
import Tools from "../../../common/Tools"

export const { handler: CreateFileActionHandler, action: CreateFileAction } = ActionMaker.buildHandler(async (action) => {
    const client = new ActionProxy()
    const { createType, consoleApp,form,scriptContent=""} = action.data
    const {fileName} = form.getFieldValue()
    
    if(!fileName){
        return {data:{
            createFileError: "Please input the file name"
        }}
    }

    const { node } = action.__state
    
    let isDir = false
    switch (createType) {
        case "file": 
            isDir = false
            if(!fileName.endsWith(".mlsql") 
            && !fileName.endsWith(".nb") 
            && !fileName.endsWith(".py")){
                return {
                    data: {                        
                        createFileError: "fileName should end with .mlsql or .nb or .py"
                    }
                }
            }
            break;
        case "folder":
            isDir = true
            break;
    }

    const saveParams = {
        fileName: fileName,
        isDir: isDir,
        content: scriptContent,        
        parentId: node.id
    }

    const res = await client.post(RemoteAction.SAVE_SCRIPT_FILE,saveParams)
    
    return {
        data: {
            ...action.data,
            reloading: Tools.getJobName()
        }
    }
})