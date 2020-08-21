import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
import { LoadActionHandler, LoadAction } from './LoadAction'
import { OpenActionHandler, OpenAction } from './OpenAction'
import { DeleteActionHandler, DeleteAction } from './DeleteAction'
import { ExportToActionHandler, ExportToAction } from './ExportToAction'
class WorkshopTablesActionNames {
    static LOAD = "load"
    static OPEN = "open"
    static DELETE = "delete"
    static EXPORT_TO = "exportTo"
}
const WorkshopTablesHandlers = {
    ...CommonHandlers,
    [WorkshopTablesActionNames.LOAD]:LoadActionHandler,
    [WorkshopTablesActionNames.OPEN]:OpenActionHandler,
    [WorkshopTablesActionNames.DELETE]:DeleteActionHandler,
    [WorkshopTablesActionNames.EXPORT_TO]:ExportToActionHandler,

}
const WorkshopTablesActions = {
    ...CommonActions,
    [WorkshopTablesActionNames.LOAD]:LoadAction,
    [WorkshopTablesActionNames.OPEN]:OpenAction,
    [WorkshopTablesActionNames.DELETE]:DeleteAction,
    [WorkshopTablesActionNames.EXPORT_TO]:ExportToAction,
}

function WorkshopTablesReducer(state, action) {
return WorkshopTablesActions[action.type](state, action.data)    
}
export { WorkshopTablesActionNames, WorkshopTablesReducer, WorkshopTablesHandlers }