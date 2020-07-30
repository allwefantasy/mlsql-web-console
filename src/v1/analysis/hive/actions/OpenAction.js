import ActionMaker from "../../../ActionMaker"

export const {handler:OpenActionHandler,action:OpenAction} = ActionMaker.buildHandler(async (action)=>{
    const {openTable,workshop} = action.data 
    const [db,table] = openTable.split(".")
    workshop.newSession("hive",db,table)                     
    return {        
        data: {}
    }
})