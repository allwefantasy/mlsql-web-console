import { RegisterAction, RegisterActionHandler } from "../../../app_setup/actions/app/RegisterAction"
import { LoginAction, LoginActionHandler } from "./LoginAction"

class LoginRegisterActionNames {
    static REGISTER = "register"
    static LOGIN = "login"
}
const LoginRegisterHandlers = {
    [LoginRegisterActionNames.REGISTER]: RegisterActionHandler,
    [LoginRegisterActionNames.LOGIN]: LoginActionHandler,
}

function LoginRegisterReducer(state, action) {
    switch (action.type) {
        case LoginRegisterActionNames.REGISTER:
            return RegisterAction(state, action.data)
        case LoginRegisterActionNames.LOGIN:
            return LoginAction(state, action.data)
        default:
            return state;
    }
}
export { LoginRegisterActionNames, LoginRegisterReducer, LoginRegisterHandlers }