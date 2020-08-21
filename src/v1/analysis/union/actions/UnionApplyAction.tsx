import ActionMaker from "../../../../v1/ActionMaker"
import ApplyActionUtils from "../../common/ApplyActionUtils"
import AnalysisWorkshop from "../../workshop"
import Tools from "../../../../common/Tools"


export interface UnionApplyValues{
    unionTable:string,
    duplicate:boolean
 }
export const { handler: UnionApplyHandler, action: UnionApplyAction } = ActionMaker.buildHandler(async (action:{data:{}}) => {
    return ApplyActionUtils.apply(action,
        (values:UnionApplyValues) => {
            if (!values.unionTable ) {
                return "UnionTable is required."
            }            
            return undefined
        },
        (workshop:AnalysisWorkshop, values:UnionApplyValues) => {            
            const tableName = Tools.getTempTableName()

            let operator = "union"
            if(values.duplicate){
               operator = "UNION ALL" 
            }
            
            const sql = `
            select * from ${workshop.getLastApplyTable().tableName}
            ${operator}
            select * from ${Tools.getField(values.unionTable)}
            as ${tableName};                         
            `
            return { tableName, sql }
        })
})