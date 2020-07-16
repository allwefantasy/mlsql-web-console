import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import { AppSetupEventConst } from "./AppSetupReducer"

const TemplateActionHandler = ({dispatch,getState,signal}) => { 
    const dispacher =  dispatch
    return async (action) => {
        const client = new ActionProxy()
        const { userName, password, password2 } = action.data        
        dispacher({ type: AppSetupEventConst._REGISTER_ADMIN, data:{} })
    }
}

function TemplateAction(state, data) {    
    return { ...state, ...data }
}

export { TemplateAction, TemplateActionHandler }