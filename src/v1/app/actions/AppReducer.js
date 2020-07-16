import { GoConsoleAction, GoAdminActionHandler, GoConsoleActionHandler, GoAdminAction, AppConfiguredAction } from "./go"

class AppEventConst {
    
    static GO_CONSOLE = "goConsole"
    static GO_ADMIN = "goAdmin"
    static appConfigured = "appConfigured"
}

const AppReducerHandlers = {
    goAdmin: GoAdminActionHandler,
    goConsole: GoConsoleActionHandler,
}

function AppReducer(state, action) {
    switch (action.type) {
        case AppEventConst.GO_ADMIN:
            return GoAdminAction(state, action.data)
        case AppEventConst.GO_CONSOLE:
            return GoConsoleAction(state, action.data)
        case AppEventConst.appConfigured:
            return AppConfiguredAction(state, action.data)
        default:
            return state;
    }
}

export { AppEventConst, AppReducer, AppReducerHandlers }