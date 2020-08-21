import ActionMaker from "../../../ActionMaker"
import EngineService from "../../../service/EngineService"

export const { handler: LoadActionHandler, action: LoadAction } = ActionMaker.buildHandler(async (action) => {
    const res = await EngineService.tablesInWorkshop()
    if (res.status === 200) {
        const dbs = {}
        res.content.forEach(item => {
            if (!dbs[item.sessionId]) {
                dbs[item.sessionId] = [item.tableName]
            } else {
                dbs[item.sessionId].push(item.tableName)
            }
        })
        return {
            data: {
                dbs,...action.data
            }
        }
    }

    return {
        data: {...action.data}
    }
})