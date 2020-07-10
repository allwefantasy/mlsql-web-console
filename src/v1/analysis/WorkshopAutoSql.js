import Tools from "../../common/Tools"
import RemoteAction from "../../backend_service/RemoteAction"

export const WorkshopAutoSql = (superclass) => class extends superclass {
   getLastApplyTable = () => {
      return this.sqls[this.sqls.length - 1]
   }


   /**
   * generate sql
   */
   apply = async (params) => {
      const { tableName, sql } = params
      this.sqls.push(params)
      const view = this.sqls.map(item => item.sql).join("")
      const res = await this.client.runScript(view, Tools.getJobName(), Tools.robotFetchParam())
      if (res.status != 200) {
         this.toggleMessage()
         this.showMessage(res.content)
         return 500
      }
      const { data, schema } = res.content
      this.setCurrentTable("", "", tableName, schema, data)
      return 200
   }

   save = async (tableName) => {
      if (this.sqls.length === 0) {
         this.showMessage("Sorry, current session have no applies.")
         return 500
      }
      const sql = `select * from ${this.getLastApplyTable().tableName} as ${tableName};`
      this.sqls.push({ tableName, sql })
      const finalSql = this.sqls.map(item => item.sql).join("\n")
      const res = await this.client.post(RemoteAction.ANALYSIS_SAVE, {
         tableName,
         sql: finalSql,
         sessionId: this.sessionId
      })
      return res.status
   }
}