import { AddFieldActionHandler, AddFieldAction } from "./AddFieldAction";
import { RemoveFieldActionHandler, RemoveFieldAction } from "./RemoveFieldAction";
import { SetStateAction, SetStateActionHandler } from "../../../app_console/admin/actions/SetStateAction";
import { OrderApplyActionHandler, OrderApplyAction } from "./OrderApplyAction";

class OrderStationActionNames {
    static ADD_FIELD = "addField"
    static REMOVE_FIELD = "removeField"
}

const OrderStationHandlers = {
    [OrderStationActionNames.ADD_FIELD]: AddFieldActionHandler,
    [OrderStationActionNames.REMOVE_FIELD]: RemoveFieldActionHandler,
    setState: SetStateActionHandler,    
    apply: OrderApplyActionHandler
}

const OrderStationActions = {
    [OrderStationActionNames.ADD_FIELD]: AddFieldAction,
    [OrderStationActionNames.REMOVE_FIELD]: RemoveFieldAction,
    setState: SetStateAction,    
    apply: OrderApplyAction
}

function OrderStationReducer(state, action) {
    return OrderStationActions[action.type](state, action.data)    
}
export { OrderStationActionNames, OrderStationReducer, OrderStationHandlers }