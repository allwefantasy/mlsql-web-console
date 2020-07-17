import { SwitchAction, SwitchActionHandler } from "./SwitchAction";
import { CheckLoginedActionHandler, CheckLoginedAction } from "./CheckLoginedAction";
class AppConsoleActionNames {
    static SWITCH = "switch"    
    static CHECK_LOGINED = "checkLogined"
}
const AppConsoleHandlers = {
    [AppConsoleActionNames.SWITCH]: SwitchActionHandler,    
    [AppConsoleActionNames.CHECK_LOGINED]: CheckLoginedActionHandler
}

function AppConsoleReducer(state, action) {
    switch (action.type) {
        case AppConsoleActionNames.SWITCH:
            return SwitchAction(state, action.data)        
        case AppConsoleActionNames.CHECK_LOGINED:
            return CheckLoginedAction(state, action.data)
        default:
            return state;
    }
}
export { AppConsoleActionNames, AppConsoleReducer, AppConsoleHandlers }