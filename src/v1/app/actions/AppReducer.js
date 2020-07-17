import { GoConsoleAction, GoAdminActionHandler, GoConsoleActionHandler, GoAdminAction, AppConfiguredAction } from "./go"

class AppActionNames {
    
    static GO_CONSOLE = "goConsole"
    static GO_ADMIN = "goAdmin"
    static appConfigured = "appConfigured"
}

const AppReducerHandlers = {
    [AppActionNames.goAdmin]: GoAdminActionHandler,
    [AppActionNames.goConsole]: GoConsoleActionHandler,
}

function AppReducer(state, action) {
    switch (action.type) {
        case AppActionNames.GO_ADMIN:
            return GoAdminAction(state, action.data)
        case AppActionNames.GO_CONSOLE:
            return GoConsoleAction(state, action.data)
        case AppActionNames.appConfigured:
            return AppConfiguredAction(state, action.data)
        default:
            return state;
    }
}

export { AppActionNames, AppReducer, AppReducerHandlers }