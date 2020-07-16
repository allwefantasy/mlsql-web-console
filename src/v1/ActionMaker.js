class ActionMaker {
    static buildHandler(eventCallBack) {
        return {
            handler: ({ dispatch, getState, signal }) => {
                const dispacher = dispatch
                return async (action) => {
                    const data = await eventCallBack(action)
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
}

export default ActionMaker