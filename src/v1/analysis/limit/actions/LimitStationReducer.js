import { CommonHandlers,CommonActions} from "../../common/CommonHandlers"
import { LimitApplyAction, LimitApplyActionHandler } from "./LimitApplyAction"

class LimitStationActionNames {}
const LimitStationHandlers = {
    ...CommonHandlers,apply:LimitApplyActionHandler
}
const LimitStationActions = {
    ...CommonActions,apply:LimitApplyAction
}

function LimitStationReducer(state, action) {
    return LimitStationActions[action.type](state, action.data)
}
export { LimitStationActionNames, LimitStationReducer, LimitStationHandlers }