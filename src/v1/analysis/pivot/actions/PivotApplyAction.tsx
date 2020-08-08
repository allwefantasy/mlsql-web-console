import ActionMaker from "../../../../v1/ActionMaker"
import ApplyActionUtils from "../../common/ApplyActionUtils"
import AnalysisWorkshop from "../../workshop"
import Tools from "../../../../common/Tools"

export interface PivotApplyValues{
   columnLeft:string,
   columnHeader:string,
   columnSum: string,
   sunFunc:Array<string>
}
export const { handler: PivotApplyHandler, action: PivotApplyAction } = ActionMaker.buildHandler(async (action:{data:{}}) => {
    return ApplyActionUtils.apply(action,
        (values:PivotApplyValues) => {
            if (!values.columnHeader || !values.columnLeft || !values.columnSum ) {
                return "Three columns are required."
            }

            if(!(values.sunFunc?.length>0)){
                return "Agg funcs are required."
            }
            return undefined
        },
        (workshop:AnalysisWorkshop, values:PivotApplyValues) => {
            const tableName = Tools.getTempTableName()

            //`avg`, `max`, `min`, `sum`, `count`.
            const sql = `
            run ${workshop.getLastApplyTable().tableName} as Pivot.\`\` where 
            columnLeft="${values.columnLeft}"
            and columnHeader="${values.columnHeader}"
            and columnSum="${values.columnSum}"
            and sunFunc="${values.sunFunc.map(item=>{
                return `${item}(${Tools.getField(values.columnSum)})`
            }).join(",")}"
            as ${tableName};                         
            `
            return { tableName, sql }
        })
})