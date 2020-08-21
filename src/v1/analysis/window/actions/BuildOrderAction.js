import ActionMaker from "../../../ActionMaker"

export const {handler:BuildOrderActionHandler,action:BuildOrderAction} = ActionMaker.buildHandler(async (action)=>{
    const result = action.__state.result
    result.orderFields = action.data.orderFields
    return {        
        data: {
            current: action.__state.current + 1,
            result 
        }
    }
})