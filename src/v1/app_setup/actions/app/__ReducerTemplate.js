class TemplateEventConst {
    
    static _GO_CONSOLE = "_goConsole"
    static GO_CONSOLE = "goConsole"

    static _GO_ADMIN = "_goAdmin"
    static GO_ADMIN = "goAdmin"
    
}

function TemplateReducer(state, action) {
    switch (action.type) {
        case AppEventConst._GO_ADMIN:
            return state
        case AppEventConst._GO_CONSOLE:
            return state
        default:
            return state;
    }
}

export {TemplateEventConst,TemplateReducer}