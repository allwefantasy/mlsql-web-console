import { ActionProxy } from '../backend_service/ActionProxy';
import Tools from './Tools'

export const FormTypeEnum = {
    input: "input",
    select: "select",
    switch: "switch"    
}
export interface SetChunk {
    raw: string,
    key: string,
    comamnd: string
    original_command: string,
    option: Map<string, string>
    mode: string,
    formType: "input"
}

export interface SelectChunk {
    raw: string,
    tableName: string
}



export interface InputType {
    name: string
    label?: string
    formType:"input"
    onShow?:string
    required:false
}

export interface SelectType {
    name: string
    label?: string
    optionTable?: string
    optionSql?: string
    optionStr?: string
    selectMode:"multiple"
    formType:"select" 
    onShow?:string 
    required:false  
}

export interface SwitchType {
    name: string
    label?: string
    formType:"switch"
    onShow?:string
    required:false
}


type SQLChunk = SetChunk | SelectChunk

export type FormType = InputType | SelectType | SwitchType

export class SQLAnalysisUtils {
    private _sql: string
    private sqls: Array<SQLChunk> = []
    constructor(sql:string) {
        this._sql = sql        
    }
     build = async()=>  {
        const proxy = new ActionProxy()
        const analyzedScriptContent = await proxy.runScript(this._sql, Tools.getJobName(), { executeMode: "analyze" })
        if (analyzedScriptContent.status !== 200) {
            return this
        }
        this.sqls = analyzedScriptContent.content as Array<SQLChunk>
        return this
    }

    userInputs=()=> {
        const userInputs = this.sqls.filter(sql => {
            return (sql as SetChunk).mode === "defaultParam" 
        }).map(item => item as SetChunk)
        return userInputs
    }
    toSql=(values: {[key:string]:any}) =>{        
        const buffer = Object.keys(values).map(k => {
            const key = k
            const value = values[k]
            let newv = `'''${value}'''`
            if (!value) {
                newv = `""`
            }
            return `set ${key}=${newv};`
        })
        return `
          ${buffer.join("\n")}
          ${this._sql}
        `
    }
}