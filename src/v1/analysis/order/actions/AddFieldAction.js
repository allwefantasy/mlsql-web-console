import { Form, Tag, Divider, Select } from "antd"
import ActionMaker from "../../../ActionMaker"

export const { handler: AddFieldActionHandler, action: AddFieldAction } = ActionMaker.buildHandler(async (action) => {    
    const orderFileds = action.data.fields.map(field=>{
        return {field}
    })
    
    return {
        data: {
            orderFileds
        }
    }
})