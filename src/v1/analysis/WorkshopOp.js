import Tools from '../../common/Tools';
import EngineService from '../service/EngineService';

const uuidv4 = require('uuid/v4');
export const WorkshopOp = (superclass) => class extends superclass {

    newSession = async (prefix, db, table, options) => {
        this.sessionId = Tools.getJobName()
        this.showTable(prefix, db, table, options)
        return this
    }
    showTable = async (prefix, db, table, options) => {
        const tableName = Tools.getTempTableName()

        let dbPrefix = `${db}.`

        if (!db) {
            dbPrefix = ""
        }

        let sql = `select * from ${dbPrefix}${table} as ${tableName};`
        if (prefix === "delta") {
            sql = `load delta.\`${db}.${table}\` as ${tableName};`
        }

        if (prefix === "temp") {
            const res = await EngineService.tableInfo(table)
            const tableInfo = res.content
            if (tableInfo.status === 2) {
                sql = `load parquet.\`/__persisted__/${tableInfo.tableName}\`  as ${tableInfo.tableName};`
            } else {
                sql = tableInfo.content
            }
        }

        if (prefix === "file") {
            let whereBlock = "where "
            if (options) {
                whereBlock = whereBlock + Object.keys(options).map(k => {
                    const v = options[k]
                    return `${k.replace(/\[group\]/g, '0')}='''${v}'''`
                }).join(" and ")
            } else whereBlock = ""

            sql = `load ${db}.\`${table}\` ${whereBlock}  as ${tableName};`            
        }

        this.sqls.push({ tableName, sql })
        const res = await this.client.runScript(
            sql,
            Tools.getJobName(),
            Tools.robotFetchParam())
        if (res.status !== 200) {
            this.toggleMessage(`Fail to load ${tableName}: ${res.content}`)
            return
        }
        const { schema, data } = res.content
        this.setCurrentTable("", "", tableName, schema, data)
    }

    setCurrentTable = (prefix, db, table, schema, data) => {
        this.currentTable = { prefix, db, table, schema, data }
        this.updateDisplay(data)
    }

}