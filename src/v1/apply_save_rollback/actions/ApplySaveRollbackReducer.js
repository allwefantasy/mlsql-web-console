import { RollbackAction, RollbackActionHandler } from './RollbackAction'
import { SaveAction, SaveActionHandler } from './SaveAction'
import { SetStateActionHandler, SetStateAction } from '../../analysis/common/actions/SetStateAction'

class ApplySaveRollbackActionNames { }
const ApplySaveRollbackHandlers = {
    setState: SetStateActionHandler,
    rollback: RollbackActionHandler,
    save: SaveActionHandler
}

function ApplySaveRollbackReducer(state, action) {
    switch (action.type) {
        case "setState":
            return SetStateAction(state, action.data)
        case "rollback":
            return RollbackAction(state, action.data)
        case "save":
            return SaveAction(state, action.data)
        default:
            return state;
    }
}
export { ApplySaveRollbackActionNames, ApplySaveRollbackReducer, ApplySaveRollbackHandlers }