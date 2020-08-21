import ActionMaker from "../../../ActionMaker"
import Tools from "../../../../common/Tools"

export const { handler: OpenActionHandler, action: OpenAction } = ActionMaker.buildHandler(async (action) => {
    const { openTable, workshop, partitionValues,partitionColumn} = action.data
    const [db, table] = openTable.split(".")

    const { tableRandom, tableStart, tableEnd } = partitionValues
    const partitionColumnName = partitionColumn && Tools.getField(partitionColumn)
    if (partitionColumn && tableRandom) {
        const inStr = partitionColumnName +" in (" + tableRandom.map(item=>`"${Tools.escapeQuote(item)}"`).join(",") + ")"
        workshop.newSession("hive", db, table,{__where__: inStr})
    }
    else if (partitionColumn && tableStart && tableEnd) {
        const con = `${partitionColumnName} >= ${Tools.quote(tableStart)} and ${Tools.quote(tableEnd)} >= ${partitionColumnName}  `
        workshop.newSession("hive", db, table,{__where__: con})
    }else {
        workshop.newSession("hive", db, table) 
    }
    return {
        data: {}
    }
})