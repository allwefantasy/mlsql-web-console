const { SetStateActionHandler, SetStateAction } = require("../../app_console/admin/actions/SetStateAction");

const CommonHandlers = {
    setState: SetStateActionHandler,        
}
const CommonActions = {
    setState: SetStateAction,        
}

export  {CommonHandlers,CommonActions}