import ActionMaker from "../../../ActionMaker"
import Tools from "../../../../common/Tools"

export const { handler: WindowApplyActionHandler, action: WindowApplyAction } = ActionMaker.buildHandler(async (action) => {
    const { groupFields,
        orderFields,
        rowWindows
         } = action.__state.result
    const {workshop,functions,setLoading} = action.data

    const partitionByStr = groupFields.map(item => {
        return Tools.getField(item.field)
    }).join(",")

    const orderBy = orderFields.map(item => {
        return `${Tools.getField(item.field)} ${item.value}`
    })

    let orderByStr = ""
    if (orderBy.length > 0) {
        orderByStr = `order by ${orderBy.join(",")}`
    }

    const { windowType, preceding, following } = rowWindows
    let windowStr = ""
    
    //UNBOUNDED /CURRENT ROW
    let precedingStr = preceding || "UNBOUNDED"
    let followingStr = following || "UNBOUNDED"
   
    if (windowType) {
        switch (windowType) {
            case "row window":
                windowStr = `ROWS BETWEEN ${precedingStr} PRECEDING and ${followingStr} FOLLOWING`
                break;
            case "range window":
                windowStr = `RANGE BETWEEN ${precedingStr} PRECEDING and ${followingStr} FOLLOWING`
                break;
        }
    }

    const selectStr = functions.map(item=>{
        const { field, isAgg, transformCode, columnName } = item
        return `${transformCode} over w as ${columnName}`
    }).join(",")

    const oldFields = workshop.currentTable.schema.fields.map(item=>Tools.getField(item.name)).join(",")
    const tableName = Tools.getTempTableName()
    const sql = `
     select ${oldFields},${selectStr}
     from ${workshop.getLastApplyTable().tableName} 
     window w as (
         partition by ${partitionByStr} ${orderByStr} ${windowStr}
     ) as ${tableName};
    `
    // console.log(sql)
    
    await workshop.apply({tableName,sql})
    // setLoading(false)
    workshop.refreshOperateStation()
    return {
        data: {}
    }
})