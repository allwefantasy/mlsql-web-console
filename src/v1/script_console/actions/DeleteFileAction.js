import ActionMaker from "../../ActionMaker"
import { ActionProxy } from "../../../backend_service/ActionProxy"
import RemoteAction from "../../../backend_service/RemoteAction"
import Tools from "../../../common/Tools"

export const { handler: DeleteFileActionHandler, action: DeleteFileAction } = ActionMaker.buildHandler(async (action) => {
    const { node } = action.data
    await ActionProxy.client.post(RemoteAction.SCRIPT_FILE_REMOVE, {
        id: node.id
    })
    return {
        data: {
            ...action.data,
            reloading: Tools.getTempTableName()
        }
    }
})