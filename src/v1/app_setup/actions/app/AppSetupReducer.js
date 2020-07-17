import { RegisterAction, RegisterActionHandler } from "./RegisterAction"
import { AddEngineActionHandler, AddEngineAction } from "./AddEngineAction"
import { SkipAddEngineActionHandler, SkipAddEngineAction } from "./SkipAddEngineAction"

class AppSetupActionNames {
    static registerAdmin="registerAdmin"
    static addEngine = "addEngine"
    static skipAddEngine = "skipAddEngine"

}
const AppSetupReducerHandlers = {
    [AppSetupActionNames.registerAdmin]: RegisterActionHandler,
    [AppSetupActionNames.addEngine]: AddEngineActionHandler,
    [AppSetupActionNames.skipAddEngine]: SkipAddEngineActionHandler
}

function AppSetupReducer(state, action) {
    switch (action.type) {
        case AppSetupActionNames.registerAdmin:
            return RegisterAction(state, action.data)
        case AppSetupActionNames.addEngine:
            return AddEngineAction(state, action.data)
        case AppSetupActionNames.skipAddEngine:
            return SkipAddEngineAction(state, action.data)
        default:
            return state;
    }
}

export {
    AppSetupActionNames,AppSetupReducerHandlers, AppSetupReducer
}
