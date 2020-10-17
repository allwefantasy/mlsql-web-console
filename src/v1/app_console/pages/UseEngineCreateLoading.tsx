import React,{useEffect,useState} from 'react'
import {Divider, Form, List, Typography} from 'antd'
import { FormattedMessage } from 'react-intl'
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";

interface Props {
    name:string
}

interface EngineCreateStatusResp {
    status:number,
    message: Array<string>,
}

const UseEngineCreateLoading:React.FunctionComponent<Props>  = (props:Props) => {
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


    return (
        <>
            <Divider orientation="left"><FormattedMessage id={"a_4"}/></Divider>
            <List
                bordered
                dataSource={resp?.message}
                renderItem={item => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
        </>
    )
    
}

export {UseEngineCreateLoading}