import { CommonHandlers,CommonActions} from '../../analysis/common/CommonHandlers'
import { OpenScriptFileActionHandler, OpenScriptFileAction } from './OpenScriptFileAction'
import { CreateFileActionHandler, CreateFileAction } from './CreateFileAction'
import { ExpandAction, ExpandActionHandler } from './ExpandAction'
import { DeleteFileActionHandler, DeleteFileAction } from './DeleteFileAction'
class ScriptTreeActionNames {
    static openScriptFile="openScriptFile"
    static createScriptFile="createScriptFile"
    static deleteScriptFile="deleteScriptFile"
    static expand="expand"
}
const ScriptTreeHandlers = {
    ...CommonHandlers,
    [ScriptTreeActionNames.openScriptFile]:OpenScriptFileActionHandler,
    [ScriptTreeActionNames.createScriptFile]:CreateFileActionHandler,
    [ScriptTreeActionNames.expand]:ExpandActionHandler,
    [ScriptTreeActionNames.deleteScriptFile]:DeleteFileActionHandler
}
const ScriptTreeActions = {
    ...CommonActions,
    [ScriptTreeActionNames.openScriptFile]:OpenScriptFileAction,
    [ScriptTreeActionNames.createScriptFile]:CreateFileAction,
    [ScriptTreeActionNames.expand]:ExpandAction,
    [ScriptTreeActionNames.deleteScriptFile]:DeleteFileAction
}

function ScriptTreeReducer(state, action) {
return ScriptTreeActions[action.type](state, action.data)    
}
export { ScriptTreeActionNames, ScriptTreeReducer, ScriptTreeHandlers }