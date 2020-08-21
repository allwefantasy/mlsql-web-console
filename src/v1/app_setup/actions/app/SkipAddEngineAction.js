import { AppSetupEventConst } from "./AppSetupReducer"
import ActionMaker from "../../../ActionMaker"

export const {handler:SkipAddEngineActionHandler,action:SkipAddEngineAction} = ActionMaker.buildHandler(async (action) => {        
    return {
        data: {
            error: undefined,
            current: action.__state.current + 1            
        }
    }
})