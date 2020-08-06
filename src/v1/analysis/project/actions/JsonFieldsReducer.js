import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
import { CommonActionNames } from '../../common/CommonActionNames'
import { AddFieldAction,AddFieldActionHandler } from './AddFieldAction'
import { RemoveFieldAction,RemoveFieldActionHandler } from './RemoveFieldAction'
import { JsonFieldsApplyActionHandler, JsonFieldsApplyAction } from './JsonFieldsApplyAction'

class JsonFieldsActionNames {
    
}

const JsonFieldsHandlers = {
    ...CommonHandlers,
    [CommonActionNames.ADD_FIELD]: AddFieldActionHandler,
    [CommonActionNames.REMOVE_FIELD]: RemoveFieldActionHandler,
    [CommonActionNames.APPLY]: JsonFieldsApplyActionHandler,
}
const JsonFieldsActions = {
    ...CommonActions,
    [CommonActionNames.ADD_FIELD]: AddFieldAction,
    [CommonActionNames.REMOVE_FIELD]: RemoveFieldAction,
    [CommonActionNames.APPLY]: JsonFieldsApplyAction,
}

function JsonFieldsReducer(state, action) {
return JsonFieldsActions[action.type](state, action.data)    
}
export { JsonFieldsActionNames, JsonFieldsReducer, JsonFieldsHandlers }