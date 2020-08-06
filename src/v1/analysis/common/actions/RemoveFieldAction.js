import ActionMaker from "../../../ActionMaker"

export const { handler: RemoveFieldActionHandler, action: RemoveFieldAction } = ActionMaker.buildHandler(async (action) => {
    const fields = action.data.fields
    const operateFileds = action.__state.operateFileds.filter(item => fields !== item.field)
    return {
        data: {
            operateFileds
        }
    }
})