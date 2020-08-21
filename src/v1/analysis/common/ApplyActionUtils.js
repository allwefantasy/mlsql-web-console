import Tools from "../../../common/Tools"

class ApplyActionUtils {
     static async apply(action, validateInput, genSQL) {
        const { workshop, values } = action.data
        const { applySaveRollbackDispacher } = action.__state
        const msg = validateInput(values)
        if (msg) {
            applySaveRollbackDispacher({
                type: "setState",
                data: {
                    loading: false
                }
            })
            return {
                data: {
                    ...action.data,
                    error: msg,
                    loading: false
                }
            }
        }

        const { tableName, sql } = genSQL(workshop, values)

        const status = await workshop.apply({
            tableName,
            sql
        })
        if (status === 200) {
            workshop.refreshOperateStation()
        }
        applySaveRollbackDispacher({
            type: "setState",
            data: {
                loading: false
            }
        })
        return {
            data: {
                ...action.data,
                loading: false
            }
        }
    }
}

export default ApplyActionUtils
