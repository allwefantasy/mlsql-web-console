import { AppEventConst } from "./AppReducer"
import ActionMaker from "../../ActionMaker"

export const {handler: AppConfiguredActionHandler,action:AppConfiguredAction} = ActionMaker.buildHandler((action) => {
    return { data: action.data }
})

export  const {handler: GoAdminActionHandler,action: GoAdminAction} = ActionMaker.buildHandler((action) => {
    return { data: {appConfigured: true}}
})

export  const {handler:GoConsoleActionHandler,action: GoConsoleAction} = ActionMaker.buildHandler((action) => {
    return { data: {appConfigured: true} }
})

