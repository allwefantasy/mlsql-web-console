import ActionMaker from "../../../ActionMaker"
import { ActionProxy } from "../../../../backend_service/ActionProxy"
import Tools from "../../../../common/Tools"

export const { handler: ExportToActionHandler, action: ExportToAction } = ActionMaker.buildHandler(async (action) => {
    const { targetPath, workshop } = action.data
    const { exportTable } = action.__state
    const { name: openTable, type } = exportTable

    const { sql, tableName } = await workshop.buildLoadSQL("temp", "", openTable)

    const runSql = (name) => {
        proxy.runScript(`
             ${sql}
             save ignore ${tableName} as ${name}.\`${targetPath}\`;
            `, Tools.getJobName(), { async: true })
    }
    const proxy = new ActionProxy()
    switch (type) {
        case "hive":
            runSql("hive")
            break
        case "file":
            runSql("parquet")
            break
        case "delta":
            runSql("delta")
            break

    }

    return {
        data: {
            ...action.data
        }
    }
})