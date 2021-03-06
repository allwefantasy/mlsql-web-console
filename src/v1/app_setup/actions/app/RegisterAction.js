import { ActionProxy } from "../../../../backend_service/ActionProxy"
import RemoteAction from "../../../../backend_service/RemoteAction"
import UIMaker from "../../../UIMaker"
import ActionMaker from "../../../ActionMaker"

export const {handler:RegisterActionHandler,action:RegisterAction} = ActionMaker.buildHandler(async(action)=>{
        const { userName, password, password2 } = action.data        
        if (password !== password2) {            
            return {
                data: {
                    error: "Passwords are not matched"
                }
            }
        }
    
        const client = new ActionProxy()
        const res = await client.post(RemoteAction.REGISTER, {
            userName, password
        })
    
        let data = {}
        if (res.status !== 200) {
            data = {
                error: JSON.parse(res.content).msg
            }
        } else { 
            //login                
            UIMaker.setupLogin(res)
            data = {
                error: undefined, 
                logined: true,
                current: action.__state.current + 1               
            }
        }
        return {data}
        
})
