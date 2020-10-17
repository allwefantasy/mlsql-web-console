import React, {useEffect, useState} from 'react'
import {Form, Input, Result, Select} from 'antd'
import {FormattedMessage} from 'react-intl'
import {useUserConfig} from "../../analysis/common/pages/useUserConfig";
import UIMaker from "../../UIMaker";
import {EngineSelectComp} from "./EngineSelectComp";
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";

interface Props {
}

const DeleteCloudEngine = (props: Props) => {

    const [engine, setEngine] = useState("")
    const [engines, setEngines] = useState<string[]>([])
    const [errorDetail,setErrorDetail] = useState<string>("")


    useEffect(() => {
        const fetch = async () => {
            const proxy = new ActionProxy()
            const res = await proxy.get(RemoteAction.CLOUD_ENGINE_LIST, {})
            if (res.status === 200) {
                const temp = res.content as {data: Array<string>}
                setEngines(temp.data)
            }
        }
        fetch()
    }, [])


    const {ui, setError, setSuccess, getParams, setLoading} = useUserConfig()
    const submit = async () => {
        setError("")
        setErrorDetail("")
        setLoading(true)
        if(!engine){
            setError("a_5")
            return
        }
        const proxy = new ActionProxy()
        const res = await proxy.post(RemoteAction.CLOUD_DELETE_ENGINE, {owner:engine})
        if (res.status === 200) {
            setSuccess("delete_success")
        } else {
            setError("delete_fail")
            setErrorDetail(res.content)
        }
        setLoading(false)
    }

    const engineNames = ()=>{
        return engines.map((item)=>{
            return <Select.Option value={item} key={item}>{item}</Select.Option>
        })
    }

    const selectChange = async (value:string)=>{
        setEngine(value)
    }

    return ui({
        title: <FormattedMessage id="delete_cloud_engine"/>,
        submit,
        formItems: <>
            {errorDetail && <Result
                status="warning"
                extra={errorDetail}
            />}
            <Form.Item name={"name"} label={<FormattedMessage id={"a_6"}/>}>
                <Select onChange={selectChange}>
                    {engineNames()}
                </Select>
            </Form.Item>
        </>
    })

}

export {DeleteCloudEngine}