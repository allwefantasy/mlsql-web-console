import ActionMaker from "../../../ActionMaker"
import Tools from "../../../../common/Tools"

export const {handler:ApplyActionHandler,action:ApplyAction} = ActionMaker.buildHandler(async (action)=>{
    const {workshop,values} = action.data
    if(Object.keys(values).length == 0){
        return {        
            data: {  
                ...action.data, 
                error: "Please configure order fields then click apply.",
                loading:false 
            }
        }
    }
    
    const tableName = Tools.getTempTableName()
    const orderStr = Object.keys(values).map(key=>{
        return ` ${Tools.getField(key)} ${values[key]} `
    }).join(",")

    const sql = `select * from ${workshop.getLastApplyTable().tableName}
    order by  ${orderStr}
    as ${tableName};`
           
    await workshop.apply({
        tableName,
        sql
    })
    return {        
        data: { 
            ...action.data, 
            loading:false          
        }
    }
})