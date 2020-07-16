import { RegisterAction, RegisterActionHandler } from "./RegisterAction"

class AppSetupEventConst {
    static _REGISTER_ADMIN = "_registerAdmin"
    static REGISTER_ADMIN = "registerAdmin"
}

const AppSetupReducerHandlers = {
    registerAdmin: RegisterActionHandler
}

function AppSetupReducer(state, action) {
    switch (action.type) {
        case AppSetupEventConst._REGISTER_ADMIN:
            return RegisterAction(state, action.data)        
        default:
            return state;
    }
}

export {
    AppSetupEventConst, AppSetupReducerHandlers,AppSetupReducer
}
