import ActionMaker from "../../../ActionMaker"

export const {handler:BuildGroupActionHandler,action:BuildGroupAction} = ActionMaker.buildHandler(async (action)=>{
    const result = action.__state.result
    result.groupFields = action.data.groupFields
    return {        
        data: {
            current: action.__state.current + 1,
            result  
        }
    }
})