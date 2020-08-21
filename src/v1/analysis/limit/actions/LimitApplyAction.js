import ActionMaker from "../../../ActionMaker"
import Tools from "../../../../common/Tools"
import ApplyActionUtils from '../../common/ApplyActionUtils'

export const {handler:LimitApplyActionHandler,action:LimitApplyAction} = ActionMaker.buildHandler(async (action)=>{
    return ApplyActionUtils.apply(action,
        (values)=>{
            if(Object.keys(values).length == 0){
                return "Please configure limit size then click apply."
            }
            if(!values.limitSize){
                return "Please configure limit size then click apply."
            }
            return undefined
        },
        (workshop,values)=>{
            const tableName = Tools.getTempTableName()
            const limitStr = values.limitSize
            
            const sql = `select * from ${workshop.getLastApplyTable().tableName}
            limit  ${limitStr}
            as ${tableName};`
            return {tableName,sql}
        })    
})