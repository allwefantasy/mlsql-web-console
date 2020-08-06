import ActionMaker from "../../../ActionMaker"

export const { handler: RemoveFieldActionHandler, action: RemoveFieldAction } = ActionMaker.buildHandler(async (action) => {
    const { form } = action.data
    const { forms, subFields } = action.__state
    const targetIndex= forms.indexOf(form)    
    forms.splice(targetIndex,1)    
    subFields.splice(targetIndex,1)
    return {
        data: {
            forms,
            subFields
        }
    }
})