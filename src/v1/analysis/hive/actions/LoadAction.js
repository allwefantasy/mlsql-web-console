import * as React from "react";
import ActionMaker from "../../../ActionMaker"
import { ActionProxy } from "../../../../backend_service/ActionProxy"
import Tools from "../../../../common/Tools"
import { TableOutlined } from '@ant-design/icons'

export const { handler: LoadActionHandler, action: LoadAction } = ActionMaker.buildHandler(async (action) => {
    const {dbName,node} = action.data
    const proxy = new ActionProxy()
    if(!dbName){        
        let res = await proxy.runScript(`!profiler sql "show databases";`,Tools.getJobName(),Tools.robotFetchParam())                      
        if (res.status === 200) {        
            const dbs  = res.content.data.map(item=>{                
                item["key"] = item.databaseName || item.namespace
                item["title"] = item.key
                item["isLeaf"] = false
                item["children"] = []
                return item
            })
            return {
                data: {
                    dbs,...action.data
                }
            }
        }
    }

    if(dbName){
        await proxy.runScript(`!profiler sql "use ${dbName}";`,Tools.getJobName(),Tools.robotFetchParam())    
        let res = await proxy.runScript(`!profiler sql "show tables";`,Tools.getJobName(),Tools.robotFetchParam())                             
        if (res.status === 200) {        
            const tables  = res.content.data.filter(item=>{
                const db = item.database || item.namespace
                return db === dbName
            }).map(item=>{
                item["key"] = `${dbName}.${item.tableName}`
                item["title"] = item.tableName
                item["isLeaf"] = true
                item["icon"]=<TableOutlined />
                return item
            }) 
            const {dbs} = action.__state
            const newdbs = dbs.map(db => {
                if(db.key===dbName){
                    db.children = tables
                }
                return db
            });            
            return {
                data: {...action.data,dbs:newdbs}
            }
        }
    }
    

    return {
        data: {...action.data}
    }
})