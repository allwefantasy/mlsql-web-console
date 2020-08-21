import {ActionProxy} from '../backend_service/ActionProxy'
const uuidv4 = require('uuid/v4');

export class LogMonitor {
    constructor(appendLog) {
        this.appendLog = appendLog
        this.log = {}
    }
    async cancelQueryLog() {
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
        }
    }

    async queryLog() {
        this.cancelQueryLog()
        this.intervalTimer = setInterval(async () => {
            const jobName = uuidv4()
            const api = new ActionProxy()            
            const res = await api.runScript(`load _mlsql_.\`log/${this.log['offset'] || -1}\` where filePath="engine_log" as output;`, jobName, {})
            const jsonObj = res.content[0]
            if (jsonObj['value'].length > 0) {
                this.appendLog(jsonObj['value'].map(item => {
                    return item.split("__MMMMMM__")[1]
                }).join("\n"))
            }
            this.log['offset'] = jsonObj["offset"]
        }, 2000)
    }
}