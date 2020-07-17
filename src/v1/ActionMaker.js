class ActionMaker {
    static buildHandler(eventCallBack) {
        return {
            handler: ({ dispatch, getState, signal }) => {
                const dispacher = dispatch
                return async (action) => {
                    const data = await eventCallBack({ ...action, __state: getState() })
                    dispacher({
                        type: action.type,
                        ...data
                    })
                }
            },
            action: (state, data) => {
                return { ...state, ...data }
            }
        }
    }

    static buildEvent(name, params) {
        return {
            type: name,
            data: params
        }
    }
}

export default ActionMaker