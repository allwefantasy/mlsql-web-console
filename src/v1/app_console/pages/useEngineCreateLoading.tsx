import React,{useEffect,useState} from 'react'
import { Form } from 'antd'
import { FormattedMessage } from 'react-intl'
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";
interface Props {
    name:string
}

interface EngineCreateStatusResp {
    status:number,
    message: Array<string>
}

const useEngineCreateLoading = (props:Props) => {
    
    const [form] = Form.useForm()
    const [resp,setResp] = useState<EngineCreateStatusResp|null>(null)
    const [timer,setTimer] = useState<any>(null)


    useEffect(()=>{
        const fetch = async()=>{
            const proxy = new ActionProxy()
            const res = await proxy.get(RemoteAction.CLOUD_ENGINE_STATUS,{owner: props.name})
            if(res.status === 200){
               const temp = res.content as EngineCreateStatusResp
                setResp(temp)
            }
        }
        const temp = setInterval(fetch,3000)
        setTimer(temp)
        return ()=>{
            clearInterval(timer)
        }
       },[])

    const ui = ()=>{
        return (
            <>
             <Form form={form}>
                 Status: {resp?.status}
                 Message: {resp?.message.join("\n")}
             </Form>          
            </>
        )
    }

    return {ui,form}
    
}

export { useEngineCreateLoading }