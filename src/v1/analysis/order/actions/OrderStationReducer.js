import { AddFieldActionHandler, AddFieldAction } from "./AddFieldAction";
import { RemoveFieldActionHandler, RemoveFieldAction } from "./RemoveFieldAction";
import { SetStateAction, SetStateActionHandler } from "../../../app_console/admin/actions/SetStateAction";
import { ApplyActionHandler, ApplyAction } from "./ApplyAction";

class OrderStationActionNames {
    static ADD_FIELD = "addField"
    static REMOVE_FIELD = "removeField"
}

const OrderStationHandlers = {
    [OrderStationActionNames.ADD_FIELD]: AddFieldActionHandler,
    [OrderStationActionNames.REMOVE_FIELD]: RemoveFieldActionHandler,
    setState: SetStateActionHandler,
    apply: ApplyActionHandler
}

function OrderStationReducer(state, action) {
    switch (action.type) {
        case OrderStationActionNames.ADD_FIELD:
            return AddFieldAction(state, action.data)
        case OrderStationActionNames.REMOVE_FIELD:
            return RemoveFieldAction(state, action.data)
        case "setState":
            return SetStateAction(state, action.data)
        case "apply":
            return ApplyAction(state, action.data)
        default:
            return state;
    }
}
export { OrderStationActionNames, OrderStationReducer, OrderStationHandlers }