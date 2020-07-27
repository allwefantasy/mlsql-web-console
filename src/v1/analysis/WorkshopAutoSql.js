import Tools from "../../common/Tools"
import RemoteAction from "../../backend_service/RemoteAction"

export const WorkshopAutoSql = (superclass) => class extends superclass {
   getLastApplyTable = () => {
      return this.sqls[this.sqls.length - 1]
   }

   rollback = async (params)=>{
      if(this.sqls.length<2){
         this.toggleMessage("No apply to rollback.")
         return
      }
      const removeTable = this.sqls.pop()
      const currentTable = this.sqls.pop()
      await this.apply(currentTable)
   }

   /**
   * generate sql
   */
   apply = async (params) => {
      const { tableName, sql } = params
      this.sqls.push(params)
      const view = this.sqls.map(item => item.sql).join("")
      try{
         const res = await this.client.runScript(view, Tools.getJobName(), Tools.robotFetchParam())
         if (res.status !== 200) {
            this.sqls.pop()
            this.toggleMessage(res.content)
            return 500
         }
         const { data, schema } = res.content
         this.setCurrentTable("", "", tableName, schema, data)
         return 200
      }catch(e) {
         this.toggleMessage("Execute job fail;(Job is killed)")
         return 500
      }      
   }

   save = async (tableName, persist) => {
      if (this.sqls.length === 0) {
         this.toggleMessage("Sorry, current session have no applies.")
         return 500
      }
      const sql = `select * from ${this.getLastApplyTable().tableName} as ${tableName};`
      this.sqls.push({ tableName, sql })
      const finalSql = this.sqls.map(item => item.sql).join("\n")

      const persistJobName = Tools.getJobName()
      let extraParams = { status: 5 }// 5 view
      if (persist) {
         const persistSQL = `${finalSql}
         save overwrite ${tableName} as parquet.\`/__persisted__/${tableName}\`;`
         
         await this.client.runScript(persistSQL, persistJobName, {
            persistJobName,
            async: true
         })
         extraParams = { jobName: persistJobName, status: 1 }// 1 running
      }

      const res = await this.client.post(RemoteAction.ANALYSIS_SAVE, Object.assign({
         tableName,
         sql: finalSql,
         sessionId: this.sessionId,
         schema: JSON.stringify(this.currentTable.schema),
      }, extraParams))

      return res.status
   }
}