import Tools from '../../common/Tools';

const uuidv4 = require('uuid/v4');
export const WorkshopOp = (superclass) => class extends superclass {
     
    newSession = async (prefix,db,table)=>{
        this.sessionId = Tools.getJobName()
        this.showTable(prefix,db,table)
        return this
    }
    showTable = async (prefix,db,table)=>{                         
        const tableName = Tools.getTempTableName()
        
        let dbPrefix = `${db}.`
        
        if(!db){
            dbPrefix = ""
        }
        
        let sql = `select * from ${dbPrefix}${table} as ${tableName};`
        if(prefix === "delta"){
            sql = `load delta.\`${db}.${table}\` as ${tableName};`
        }
        
        this.sqls.push({tableName,sql}) 
        const res = await this.client.runScript(
            sql,
            Tools.getJobName(),
            Tools.robotFetchParam())       
        const {schema,data} = res.content 
        this.setCurrentTable("","",tableName,schema,data)                             
    }

    setCurrentTable = (prefix,db,table,schema,data)=>{
      this.currentTable = {prefix,db,table,schema,data}
      this.updateDisplay(data)
    }    
   
}