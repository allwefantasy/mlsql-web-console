const uuidv4 = require("uuid/v4")
export default class Tools{    
    static getTempTableName=()=>{
        return (uuidv4()+"").replace(/-/g,"")
    }
    static getJobName=()=>{
        return uuidv4()+""
    }

    static robotFetchParam = ()=>{
        return {
            queryType:  "robot",
            fetchType:  "take",            
            includeSchema: true
        }
    }

    static robotFetchParamWithCollect = ()=>{
        return {
            queryType:  "robot",                       
            includeSchema: true
        }
    }

    static getField =(v)=>{
        if(v.startsWith("`") && v.endsWith("`")) return v
        return `\`${v}\`` 
    }

    static distinct=(arrays,field)=>{
        const tempF = {}
        return arrays.filter(item=>{
            if(item[field] in tempF){
                return false
            }else {
                tempF[item[field]] = item[field]
                return true
            }
        })
    }
}