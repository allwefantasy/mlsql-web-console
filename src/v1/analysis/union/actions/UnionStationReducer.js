import { CommonHandlers,CommonActions} from '../../../../v1/analysis/common/CommonHandlers'
import { CommonActionNames } from '../../../../v1/analysis/common//CommonActionNames'
import { ApplyActionHandler, ApplyAction } from '../../../../v1/analysis/common/actions/ApplyAction'
// --import--

class UnionStationActionNames {
// --name--
}
const UnionStationHandlers = {
    ...CommonHandlers,
[CommonActionNames.APPLY]: ApplyActionHandler,
// --handler--
}
const UnionStationActions = {
    ...CommonActions,
[CommonActionNames.APPLY]: ApplyAction,
// --action--
}

function UnionStationReducer(state, action) {
return UnionStationActions[action.type](state, action.data)    
}
export { UnionStationActionNames, UnionStationReducer, UnionStationHandlers }