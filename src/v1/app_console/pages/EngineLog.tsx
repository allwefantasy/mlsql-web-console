import React, {useEffect, useState} from 'react'
import {Button, Card, Divider, Form, List, Select} from 'antd'
import {FormattedMessage} from 'react-intl'
import AlertBox from "../../AlertBox";
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";

interface Props {
}
interface EngineCreateStatusResp {
    status:number,
    message: Array<string>,
}

const EngineLog = (props: Props) => {

    const [form] = Form.useForm()
    const [data,setData] = useState<Array<string>>([])
    const [logMsg,setLogMsg] = useState<Array<string>>([])
    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
    };

    useEffect(() => {
        const fetch = async () => {
            const proxy = new ActionProxy()
            const res = await proxy.get(RemoteAction.CLOUD_ENGINE_LIST, {})
            if (res.status === 200) {
              const temp = res.content as {data: Array<string>}
              setData(temp.data)
            }
        }
        fetch()
    }, [])

    const engines = ()=>{
        return data.map((item)=>{
            return <Select.Option value={item} key={item}>{item}</Select.Option>
        })
    }

    const selectChange = async (value:string)=>{
        const proxy = new ActionProxy()
        const res = await proxy.get(RemoteAction.CLOUD_ENGINE_STATUS, {owner: value})
        if (res.status === 200) {
            const temp = res.content as EngineCreateStatusResp
            setLogMsg(temp.message)
        }
    }

    const ui = () => {
        return (
            <>
                <div className="common-margin common-child-center" {...formItemLayout}>
                    <Card title={<FormattedMessage id={"cloud_engine_log"}/>} style={{width: "70%"}}>
                        <Form form={form}>
                            <Form.Item name={"name"} label={<FormattedMessage id={"a_3"}/>}>
                                <Select onChange={selectChange}>
                                    {engines()}
                                </Select>
                            </Form.Item>
                            <Divider orientation="left"><FormattedMessage id={"a_6"}/></Divider>
                            <List
                                bordered
                                dataSource={logMsg}
                                renderItem={item => (
                                    <List.Item>
                                        {item}
                                    </List.Item>
                                )}
                            />
                        </Form>
                    </Card>
                </div>
            </>
        )
    }

    return ui()

}

export {EngineLog}