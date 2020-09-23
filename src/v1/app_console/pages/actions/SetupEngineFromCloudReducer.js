import { CommonHandlers,CommonActions} from '../../../../v1/analysis/common/CommonHandlers'
import { CommonActionNames } from '../../../../v1/analysis/common//CommonActionNames'
import { ApplyActionHandler, ApplyAction } from '../../../../v1/analysis/common/actions/ApplyAction'
// --import--

class SetupEngineFromCloudActionNames {
// --name--
}
const SetupEngineFromCloudHandlers = {
    ...CommonHandlers,
[CommonActionNames.APPLY]: ApplyActionHandler,
// --handler--
}
const SetupEngineFromCloudActions = {
    ...CommonActions,
[CommonActionNames.APPLY]: ApplyAction,
// --action--
}

function SetupEngineFromCloudReducer(state, action) {
return SetupEngineFromCloudActions[action.type](state, action.data)    
}
export { SetupEngineFromCloudActionNames, SetupEngineFromCloudReducer, SetupEngineFromCloudHandlers }