import { AppSetupEventConst } from "./AppSetupReducer"
import ActionMaker from "../../../ActionMaker"

const {handler:SkipAddEngineActionHandler} = ActionMaker.buildHandler(async (action) => {    
    return {
        data: {
            error: undefined,
            _current: true
        }
    }
})

function SkipAddEngineAction(state, data) {
    if (data["_current"]) {
        return { ...state, ...data, current: state.current + 1 }
    }
    return { ...state, ...data }
}

export { SkipAddEngineAction, SkipAddEngineActionHandler}