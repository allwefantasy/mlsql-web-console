import ActionMaker from "../../../ActionMaker"

export const {handler:BuildRowWindowsActionHandler,action:BuildRowWindowsAction} = ActionMaker.buildHandler(async (action)=>{
    const result = action.__state.result
    result.rowWindows = action.data.rowWindows
    return {        
        data: {
            current: action.__state.current + 1,
            result  
        }
    }
})