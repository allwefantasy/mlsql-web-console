import ActionMaker from "../../../ActionMaker"
import Tools from "../../../../common/Tools"
import ApplyActionUtils from "../../common/ApplyActionUtils"


export const {handler:JsonFieldsApplyActionHandler,action:JsonFieldsApplyAction} = ActionMaker.buildHandler(async (action)=>{
    return ApplyActionUtils.apply(action,
        (values) => {
            const {formValues,operateFiled} = values
            if (!operateFiled || formValues.length === 0) {
                return "Please configure fields then click apply"
            }
            return undefined
        },
        (workshop, values) => {
            const tableName = Tools.getTempTableName()

            const {formValues,operateFiled} = values
            const jsonStr = formValues.map(item=>{
                return `get_json_object(${Tools.getField(operateFiled)},"${item.path}") as ${Tools.getField(item.column)}`
            }).join(",")            

            const sql = `select *,${jsonStr} from ${workshop.getLastApplyTable().tableName}            
            as ${tableName};`
            return { tableName, sql }
        })
})