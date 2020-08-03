import Tools from '../../common/Tools';
import EngineService from '../service/EngineService';

const uuidv4 = require('uuid/v4');
export const WorkshopOp = (superclass) => class extends superclass {

    newSession = async (prefix, db, table, options) => {
        this.showTable(prefix, db, table, options)
        return this
    }

    buildLoadSQL = async (prefix, db, table, options) => {
        let tableName = Tools.getTempTableName()

        let dbPrefix = `${db}.`

        if (!db) {
            dbPrefix = ""
        }

        let whereBlock = "where "
        if (options) {
            whereBlock = whereBlock + Object.keys(options).
                filter(k => 
                    k !== "__where__" 
                    && k !== "__sql__"
                    && k !== "__tableName__"
                    ).
                map(k => {
                    const v = options[k]
                    return `${k.replace(/\[group\]/g, '0')}='''${v}'''`
                }).join(" and ")
            if (whereBlock === "where ") {
                whereBlock = ""
            }
        } else whereBlock = ""

        // let sql = `select * from ${dbPrefix}${table} as ${tableName};`
        let sql = `load ${prefix}.\`${db}.${table}\` ${whereBlock} as ${tableName};`

        if (prefix === "delta") {
            sql = `load delta.\`${db}.${table}\` ${whereBlock} as ${tableName};`
        }

        if(prefix === "jdbc"){
            sql = options.__sql__ || `load jdbc.\`${db}.${table}\` ${whereBlock} as ${tableName};` 
            tableName = options.__tableName__ || tableName
        }

        if (prefix === "temp") {
            const res = await EngineService.tableInfo(table)
            const tableInfo = res.content
            if (tableInfo.status === 200) {
                sql = `load parquet.\`/__persisted__/${tableInfo.tableName}\`  as ${tableInfo.tableName};
                select * from ${tableInfo.tableName} as ${tableName};`
            } else {
                sql = `${tableInfo.content} 
                select * from ${tableInfo.tableName} as ${tableName};`
            }
        }

        if (prefix === "file") {
            sql = `load ${db}.\`${table}\` ${whereBlock}  as ${tableName};`
        }

        if (prefix === "hive") {
            let _whereBlock = "where "
            if (options && options.__where__) {
                _whereBlock = _whereBlock + options.__where__
            } else _whereBlock = ""

            const tempTableName = Tools.getTempTableName()
            sql = `load hive.\`${db}.${table}\` ${whereBlock} as ${tempTableName};`
            sql = sql + `select * from ${tempTableName} ${_whereBlock} as ${tableName};`
        }

        return { sql, tableName }
    }
    showTable = async (prefix, db, table, options) => {
        const { tableName, sql } = await this.buildLoadSQL(prefix, db, table, options)

        this.sqls.push({ tableName, sql })
        this.setState({ loadingTable: true })

        const res = await this.client.runScript(
            sql,
            Tools.getJobName(),
            Tools.robotFetchParam())
        this.setState({ loadingTable: false })
        if (res.status !== 200) {
            this.toggleMessage(`Fail to load ${tableName}: ${res.content}`)
            return
        }
        const { schema, data } = res.content
        this.setCurrentTable("", "", tableName, schema, data)
        this.sessionId = Tools.getJobName()
        this.setState({ sessionId: this.sessionId })
    }

    setCurrentTable = (prefix, db, table, schema, data) => {
        this.currentTable = { prefix, db, table, schema, data }
        this.updateDisplay(data, schema)
    }

}