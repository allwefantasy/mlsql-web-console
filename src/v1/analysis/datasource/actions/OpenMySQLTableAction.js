import ActionMaker from "../../../ActionMaker"
import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import Tools from "../../../../common/Tools"

export const {handler:OpenMySQLTableActionHandler,action:OpenMySQLTableAction} = ActionMaker.buildHandler(async (action)=>{
    const {partitionValues,openTable,partitionNumValue,workshop} = action.data
    const [db,table] = openTable.split(".")
    const {partitionColumn,lowerBound,upperBound} = partitionValues
    const proxy = new ActionProxy()
    
    const connectRes = await proxy.get(RemoteAction.DS_MYSQL_CONNECT,{name:db}) 
    const tempTable = Tools.getTempTableName()
    let whereBlock = ""
    if(partitionColumn){         
        whereBlock = `where partitionColumn="${partitionColumn}" 
        and lowerBound="${lowerBound}" 
        and upperBound="${upperBound}"
        and numPartitions="${partitionNumValue}"
        `
    }

    const sql = `
      ${connectRes.content.connect}
      load jdbc.\`${openTable}\` ${whereBlock} as ${tempTable};    
    `
    workshop.newSession("jdbc", db, table,{__sql__: sql,__tableName__:tempTable})               

    return {        
        data: {
            ...action.data
        }
    }
})