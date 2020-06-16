const { ActionProxy } = require("../backend_service/ActionProxy");
const { default: RemoteAction } = require("../backend_service/RemoteAction");

export default class CodeIntellegence {
     static async getSuggestList(sql,lineNum,columnNum){
    
    const restClient = new ActionProxy()

    const res = await restClient.post(RemoteAction.RUN,{
        executeMode: "autoSuggest",
        sql: sql, 
        lineNum: lineNum +1,
        columnNum: columnNum,
        isDebug: true 
    })

    if(res && res.status == 200){
        const wordList = res.content
        return wordList
    }else {
        return []
    } 
   } 
}