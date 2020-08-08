import { CommonHandlers,CommonActions} from '../../../../v1/analysis/common/CommonHandlers'
import { CommonActionNames } from '../../../../v1/analysis/common//CommonActionNames'
import { ApplyActionHandler, ApplyAction } from '../../../../v1/analysis/common/actions/ApplyAction'
import {UnionApplyHandler,UnionApplyAction} from "./UnionApplyAction"
// --import--

class UnionStationActionNames {
static UnionApply = "UnionApply"
// --name--
}
const UnionStationHandlers = {
    ...CommonHandlers,
[CommonActionNames.APPLY]: ApplyActionHandler,
[UnionStationActionNames.UnionApply]: UnionApplyHandler,
// --handler--
}
const UnionStationActions = {
    ...CommonActions,
[CommonActionNames.APPLY]: ApplyAction,
[UnionStationActionNames.UnionApply]: UnionApplyAction,
// --action--
}

function UnionStationReducer(state, action) {
return UnionStationActions[action.type](state, action.data)    
}
export { UnionStationActionNames, UnionStationReducer, UnionStationHandlers }