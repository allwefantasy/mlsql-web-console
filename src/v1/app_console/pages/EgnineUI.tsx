import React,{useEffect,useState} from 'react'
import UIMaker from "../../UIMaker";
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";
interface Props {
    url:string
}

const EngineUI = (props:Props) => {
    const [data, setData] = useState("")
    useEffect(() => {
        const fetch = async () => {
            const backend = UIMaker.extraOption()["backend"]
            const proxy = new ActionProxy()
            const res = await proxy.get(RemoteAction.ENGINE_LIST, {})
            if(backend){
                const backends = res.content.data as Array<{url:string,name:string}>
                const url = backends.filter((item)=>{
                    return item.name === backend
                })[0].url
                setData(url.split(":")[0]+":"+url.split(":")[1]+":4040")
            }
        }
        fetch()
    }, [])
    return (
        <>
            {
                data &&  <iframe
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    style={{width: '100%', height: "600px"}}
                    src={data}
                    frameBorder="0"
                    scrolling="yes"
                />
            }
        </>
    )
    
}

export { EngineUI }