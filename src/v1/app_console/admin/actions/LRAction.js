import ActionMaker from "../../../ActionMaker"
import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"

export const { handler: LRActionHandler, action: LRAction } = ActionMaker.buildHandler(async (action) => {

    const { enableRegister = false, enableLogin = false,enableConsole = false } = action.data
    const client = new ActionProxy()
    const res = await client.post(RemoteAction.APP_SAVE, {
        login: enableLogin,
        register: enableRegister,
        console: enableConsole
    })

    if (res.status === 200) {
        return {
            data: {
                applySuccess: true
            }
        }
    }
    return {
        data: {
            error: res.content
        }
    }

})