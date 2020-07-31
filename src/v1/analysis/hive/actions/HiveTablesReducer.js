import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
import { LoadActionHandler,LoadAction } from './LoadAction'
import { OpenAction, OpenActionHandler } from './OpenAction'
import { SearchAction, SearchActionHandler } from './SearchAction'
class HiveTablesActionNames {
    static LOAD = "load"
    static OPEN = "open"
    static SEARCH = "search"
}
const HiveTablesHandlers = {
    ...CommonHandlers,
    [HiveTablesActionNames.LOAD]:LoadActionHandler,
    [HiveTablesActionNames.OPEN]: OpenActionHandler,
    [HiveTablesActionNames.SEARCH]: SearchActionHandler
}
const HiveTablesActions = {
    ...CommonActions,
    [HiveTablesActionNames.LOAD]:LoadAction,
    [HiveTablesActionNames.OPEN]: OpenAction,
    [HiveTablesActionNames.SEARCH]: SearchAction
}

function HiveTablesReducer(state, action) {
return HiveTablesActions[action.type](state, action.data)    
}
export { HiveTablesActionNames, HiveTablesReducer, HiveTablesHandlers }