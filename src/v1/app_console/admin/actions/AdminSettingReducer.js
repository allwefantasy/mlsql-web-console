import { AdminSetting } from "../AdminSetting";
import { LRActionHandler, LRAction } from "./LRAction";
import { SetStateActionHandler, SetStateAction } from "./SetStateAction";

class AdminSettingActionNames {
    static LR_CONTROL = "lrControl"
    static SET_STATE = "setState"
}
const AdminSettingHandlers = {
    [AdminSettingActionNames.LR_CONTROL]: LRActionHandler,
    [AdminSettingActionNames.SET_STATE]: SetStateActionHandler
}

function AdminSettingReducer(state, action) {
    switch (action.type) {
        case AdminSettingActionNames.LR_CONTROL:            
            return LRAction(state, action.data)
        case AdminSettingActionNames.SET_STATE:
            return SetStateAction(state, action.data)
        default:
            return state;
    }
}
export { AdminSettingActionNames, AdminSettingReducer, AdminSettingHandlers }