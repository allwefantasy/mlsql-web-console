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
}