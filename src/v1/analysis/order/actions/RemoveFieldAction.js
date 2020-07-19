import ActionMaker from "../../../ActionMaker"

export const {handler:RemoveFieldActionHandler,action:RemoveFieldAction} = ActionMaker.buildHandler(async (action)=>{    
    const fields = action.data.fields
    const orderFileds = action.__state.orderFileds.filter(item=> !fields.includes(item.field))      
    return {
        data: {
            orderFileds
        }
    }
})