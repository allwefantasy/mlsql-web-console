import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
import { RemoveFieldAction, RemoveFieldActionHandler } from '../../common/actions/RemoveFieldAction'
import { AddFieldAction, AddFieldActionHandler } from '../../common/actions/AddFieldAction'
import { CastAction, CastActionHandler } from './CastAction'

class CastFieldsActionNames {
    static ADD_FIELD = "addField"
    static REMOVE_FIELD = "removeField"
}
const CastFieldsHandlers = {
    ...CommonHandlers,
    [CastFieldsActionNames.ADD_FIELD]: AddFieldActionHandler,
    [CastFieldsActionNames.REMOVE_FIELD]: RemoveFieldActionHandler,
    apply: CastActionHandler
}
const CastFieldsActions = {
    ...CommonActions,
    [CastFieldsActionNames.ADD_FIELD]: AddFieldAction,
    [CastFieldsActionNames.REMOVE_FIELD]: RemoveFieldAction,
    apply: CastAction
}

function CastFieldsReducer(state, action) {
return CastFieldsActions[action.type](state, action.data)    
}
export { CastFieldsActionNames, CastFieldsReducer, CastFieldsHandlers }