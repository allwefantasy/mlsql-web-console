import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { ActionProxy } from '../../../backend_service/ActionProxy';
import RemoteAction from '../../../backend_service/RemoteAction';
import { Select } from 'antd';



function EngineSelectComp(props) {
    const [error, setError] = useState(undefined)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [engine, setEngine] = useState(undefined)
    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const proxy = new ActionProxy()
            const res = await proxy.get(RemoteAction.ENGINE_LIST, {})
            setData(res.content.data)
            if(res.content.data.length >0){
                setEngine(res.content.data[0].name)
            }            
            setLoading(false)
        }
        fetch()
    }, [])

    useEffect(()=>{
      props.useEngine(engine)
    },[engine])

    const selectEngine = (value) => {
        setEngine(value)
    }
    return (
        <Select onChange={selectEngine} style={{width: "120px"}}>
            {data.map(item=>{
                return <Select.Option value={item.name}>{item.name}</Select.Option>
            })}
        </Select>
    )
}
export { EngineSelectComp }