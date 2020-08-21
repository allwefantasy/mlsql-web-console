import { CommonHandlers, CommonActions } from '../../common/CommonHandlers'
import { BuildGroupAction, BuildGroupActionHandler } from './BuildGroupAction'
import { BuildOrderAction, BuildOrderActionHandler } from './BuildOrderAction'
import { BuildRowWindowsAction, BuildRowWindowsActionHandler } from './BuildRowWindowsAction'
import { WindowApplyActionHandler, WindowApplyAction } from './WindowApplyAction'
class WindowStationActionNames {
    static buildGroup = "buildGroup"
    static buildOrder = "buildOrder"
    static buildRowWindows = "buildRowWindows"
    static apply = "apply"
}
const WindowStationHandlers = {
    ...CommonHandlers,
    [WindowStationActionNames.buildGroup]: BuildGroupActionHandler,
    [WindowStationActionNames.buildOrder]: BuildOrderActionHandler,
    [WindowStationActionNames.buildRowWindows]: BuildRowWindowsActionHandler, 
    apply: WindowApplyActionHandler   
}
const WindowStationActions = {
    ...CommonActions,
    [WindowStationActionNames.buildGroup]: BuildGroupAction,
    [WindowStationActionNames.buildOrder]: BuildOrderAction,
    [WindowStationActionNames.buildRowWindows]: BuildRowWindowsAction,
    apply: WindowApplyAction 
}

function WindowStationReducer(state, action) {
    return WindowStationActions[action.type](state, action.data)
}
export { WindowStationActionNames, WindowStationReducer, WindowStationHandlers }