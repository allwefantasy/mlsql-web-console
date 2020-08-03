import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
import { OpenMySQLTableActionHandler, OpenMySQLTableAction } from './OpenMySQLTableAction'
class MysqlTreeActionNames {
    static OPEN = "open"
}
const MysqlTreeHandlers = {
    ...CommonHandlers,
    [MysqlTreeActionNames.OPEN]:OpenMySQLTableActionHandler
}
const MysqlTreeActions = {
    ...CommonActions,
    [MysqlTreeActionNames.OPEN]:OpenMySQLTableAction
}

function MysqlTreeReducer(state, action) {
return MysqlTreeActions[action.type](state, action.data)    
}
export { MysqlTreeActionNames, MysqlTreeReducer, MysqlTreeHandlers }