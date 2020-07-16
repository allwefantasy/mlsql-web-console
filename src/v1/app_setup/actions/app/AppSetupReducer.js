import { RegisterAction, RegisterActionHandler } from "./RegisterAction"
import { AddEngineActionHandler, AddEngineAction } from "./AddEngineAction"
import { SkipAddEngineActionHandler, SkipAddEngineAction } from "./SkipAddEngineAction"

class AppSetupEventConst {
    static REGISTER_ADMIN = "registerAdmin"

    static ADD_ENGINE = "addEngine"

    static SKIP_ADD_ENGINE = "skipAddEngine"

    static GO_CONSOLE = "goConsole"

    static GO_ADMIN = "goAdmin"
}

const AppSetupReducerHandlers = {
    registerAdmin: RegisterActionHandler,
    addEngine: AddEngineActionHandler,
    skipAddEngine: SkipAddEngineActionHandler
}

function AppSetupReducer(state, action) {
    switch (action.type) {
        case AppSetupEventConst.REGISTER_ADMIN:
            return RegisterAction(state, action.data)
        case AppSetupEventConst.ADD_ENGINE:
            return AddEngineAction(state, action.data)
        case AppSetupEventConst.SKIP_ADD_ENGINE:
            return SkipAddEngineAction(state, action.data)
        default:
            return state;
    }
}

export {
    AppSetupEventConst, AppSetupReducerHandlers, AppSetupReducer
}
