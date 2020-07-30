import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
import { LoadActionHandler,LoadAction } from './LoadAction'
import { OpenAction, OpenActionHandler } from './OpenAction'
class HiveTablesActionNames {
    static LOAD = "load"
    static OPEN = "open"
}
const HiveTablesHandlers = {
    ...CommonHandlers,
    [HiveTablesActionNames.LOAD]:LoadActionHandler,
    [HiveTablesActionNames.OPEN]: OpenActionHandler
}
const HiveTablesActions = {
    ...CommonActions,
    [HiveTablesActionNames.LOAD]:LoadAction,
    [HiveTablesActionNames.OPEN]: OpenAction
}

function HiveTablesReducer(state, action) {
return HiveTablesActions[action.type](state, action.data)    
}
export { HiveTablesActionNames, HiveTablesReducer, HiveTablesHandlers }