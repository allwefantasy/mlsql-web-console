import { CommonHandlers,CommonActions} from '../../common/CommonHandlers'
class DashStationActionNames {}
const DashStationHandlers = {
    ...CommonHandlers
}
const DashStationActions = {
    ...CommonActions
}

function DashStationReducer(state, action) {
return DashStationActions[action.type](state, action.data)    
}
export { DashStationActionNames, DashStationReducer, DashStationHandlers }