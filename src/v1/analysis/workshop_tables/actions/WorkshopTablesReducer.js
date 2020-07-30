import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
import { LoadActionHandler, LoadAction } from './LoadAction'
import { OpenActionHandler, OpenAction } from './OpenAction'
import { DeleteActionHandler, DeleteAction } from './DeleteAction'
class WorkshopTablesActionNames {
    static LOAD = "load"
    static OPEN = "open"
    static DELETE = "delete"
}
const WorkshopTablesHandlers = {
    ...CommonHandlers,
    [WorkshopTablesActionNames.LOAD]:LoadActionHandler,
    [WorkshopTablesActionNames.OPEN]:OpenActionHandler,
    [WorkshopTablesActionNames.DELETE]:DeleteActionHandler,

}
const WorkshopTablesActions = {
    ...CommonActions,
    [WorkshopTablesActionNames.LOAD]:LoadAction,
    [WorkshopTablesActionNames.OPEN]:OpenAction,
    [WorkshopTablesActionNames.DELETE]:DeleteAction,
}

function WorkshopTablesReducer(state, action) {
return WorkshopTablesActions[action.type](state, action.data)    
}
export { WorkshopTablesActionNames, WorkshopTablesReducer, WorkshopTablesHandlers }