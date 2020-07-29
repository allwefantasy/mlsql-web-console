import ActionMaker from "../../../ActionMaker"
import Tools from "../../../../common/Tools"
import ApplyActionUtils from "../../common/ApplyActionUtils"

export const { handler: OrderApplyActionHandler, action: OrderApplyAction } = ActionMaker.buildHandler(async (action) => {
    return ApplyActionUtils.apply(action,
        (values) => {
            if (Object.keys(values).length === 0) {
                return "Please configure order fields then click apply"
            }
            return undefined
        },
        (workshop, values) => {
            const tableName = Tools.getTempTableName()
            const orderStr = Object.keys(values).map(key => {
                return ` ${Tools.getField(key)} ${values[key]} `
            }).join(",")

            const sql = `select * from ${workshop.getLastApplyTable().tableName}
            order by  ${orderStr}
            as ${tableName};`
            return { tableName, sql }
        })
})