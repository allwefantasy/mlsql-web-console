import { CommonHandlers,CommonActions} from '../../../../v1/analysis/common/CommonHandlers'
import { CommonActionNames } from '../../../../v1/analysis/common//CommonActionNames'
import { ApplyActionHandler, ApplyAction } from '../../../../v1/analysis/common/actions/ApplyAction'
import {PivotApplyHandler,PivotApplyAction} from "./PivotApplyAction"
// --import--

class PivotStationActionNames {
static PivotApply = "PivotApply"
// --name--
}
const PivotStationHandlers = {
    ...CommonHandlers,
[CommonActionNames.APPLY]: ApplyActionHandler,
[PivotStationActionNames.PivotApply]: PivotApplyHandler,
// --handler--
}
const PivotStationActions = {
    ...CommonActions,
[CommonActionNames.APPLY]: ApplyAction,
[PivotStationActionNames.PivotApply]: PivotApplyAction,
// --action--
}

function PivotStationReducer(state, action) {
return PivotStationActions[action.type](state, action.data)    
}
export { PivotStationActionNames, PivotStationReducer, PivotStationHandlers }