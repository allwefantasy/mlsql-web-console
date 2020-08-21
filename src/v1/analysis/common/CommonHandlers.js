const { SetStateActionHandler, SetStateAction } = require("./actions/SetStateAction");

const CommonHandlers = {
    setState: SetStateActionHandler,        
}
const CommonActions = {
    setState: SetStateAction,        
}

export  {CommonHandlers,CommonActions}