import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import { AppSetupEventConst } from "./AppSetupReducer"

const RegisterActionHandler = ({dispatch,getState,signal}) => { 
    const dispacher =  dispatch
    return async (action) => {
        const { userName, password, password2 } = action.data
        if (password !== password2) {
            dispacher({
                type: AppSetupEventConst._REGISTER_ADMIN,
                data: {
                    error: "Passwords are not matched"
                }
            })
            return
        }
    
        const client = new ActionProxy()
        const res = await client.post(RemoteAction.REGISTER, {
            userName, password
        })
    
        let data = {}
        if (res.status !== 200) {
            data = {
                error: JSON.parse(res.content).msg
            }
        } else {
            data = {
                error: undefined,
                _current: true
            }
        }
        dispacher({ type: AppSetupEventConst._REGISTER_ADMIN, data })
    }
}

function RegisterAction(state, data) {
    if (data["_current"]) {
        return { ...state, ...data, current: state.current + 1 }
    }
    return { ...state, ...data }
}

export { RegisterAction, RegisterActionHandler }