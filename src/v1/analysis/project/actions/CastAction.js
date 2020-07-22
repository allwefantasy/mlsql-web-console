import ActionMaker from "../../../ActionMaker"
import Tools from "../../../../common/Tools"
import ApplyActionUtils from "../../common/ApplyActionUtils"

export const {handler:CastActionHandler,action:CastAction} = ActionMaker.buildHandler(async (action)=>{
    return ApplyActionUtils.apply(action,
        (values) => {
            if (Object.keys(values).length == 0) {
                return "Please configure cast fields then click apply"
            }
            return undefined
        },
        
        (workshop, values) => {
            const tableName = Tools.getTempTableName()
            const newCastFields = Object.keys(values).map(key => {
                return `cast(${Tools.getField(key)} as ${values[key]}) as ${Tools.getField(key)}`
            })

            const newFields = Object.keys(values)
            const fields = workshop.currentTable.schema.fields
            const oldFieldNames = fields.filter(item=>{
                return !newFields.includes(item.name)
            }).map(item=>{
                return Tools.getField(item.name)
            })

            const selectStr = (newCastFields.concat(oldFieldNames)).join(",")

            const sql = `select ${selectStr} from ${workshop.getLastApplyTable().tableName}            
            as ${tableName};`
            return { tableName, sql }
        })
})