import { CommonHandlers,CommonActions} from '../../../../v1/analysis/common/CommonHandlers'
import { CommonActionNames } from '../../../../v1/analysis/common//CommonActionNames'
import { ApplyActionHandler, ApplyAction } from '../../../../v1/analysis/common/actions/ApplyAction'
// --import--

class AnalysisPluginStationActionNames {
// --name--
}
const AnalysisPluginStationHandlers = {
    ...CommonHandlers,
[CommonActionNames.APPLY]: ApplyActionHandler,
// --handler--
}
const AnalysisPluginStationActions = {
    ...CommonActions,
[CommonActionNames.APPLY]: ApplyAction,
// --action--
}

function AnalysisPluginStationReducer(state, action) {
return AnalysisPluginStationActions[action.type](state, action.data)    
}
export { AnalysisPluginStationActionNames, AnalysisPluginStationReducer, AnalysisPluginStationHandlers }