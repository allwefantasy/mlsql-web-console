import React,{useEffect,useState} from 'react'
import {Button, Card, Divider, Form, Input, List, Result, Select, Switch} from 'antd'
import { FormattedMessage } from 'react-intl'
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";
import AlertBox from "../../AlertBox";
interface Props {   
}

const RegisterEngine = (props:Props) => {
    
    const [form] = Form.useForm()
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        // const fetch = async()=>{          
        // }
        // fetch()
       },[])

    const submit = async ()=>{
        setError("")
        setSuccess("")
        const proxy = new ActionProxy()
        const params = form.getFieldsValue()
        const res = await proxy.post(RemoteAction.ENGINE_REGISTER,params)
        if(res.status === 200){
            setSuccess("success")
        }else {
            setError(res.content)
        }

    }

    const ui = () => {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <>
                <div className="common-margin common-child-center" {...formItemLayout}>
                    <Card title={<FormattedMessage id={"a_8"}/>} style={{width: "70%"}}>
                        <Form form={form}>
                            {error && <AlertBox message={<FormattedMessage id={error} />} />}
                            {success && <AlertBox title={<FormattedMessage id="congratulation"/>} type="success" message={<FormattedMessage id={success} />} />}
                            <Form.Item name={"name"} label={<FormattedMessage id="name"/>}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"url"} label={<FormattedMessage id="url"/>} >
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"home"} label={<FormattedMessage id="home"/>}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"consoleUrl"} label={<FormattedMessage id="consoleUrl"/>} initialValue={"http://analysis.mlsql.tech"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"fileServerUrl"} label={<FormattedMessage id="fileServerUrl"/>} initialValue={"http://analysis.mlsql.tech"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"authServerUrl"} label={<FormattedMessage id="authServerUrl"/>} initialValue={"http://analysis.mlsql.tech"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item valuePropName="checked"  initialValue={true} name={"skipAuth"} label={<FormattedMessage id="skipAuth"/>} >
                                <Switch  />
                            </Form.Item>
                            <Form.Item name={"extraOpts"} label={<FormattedMessage id="extraOpts"/>} initialValue={"{}"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"accessToken"} label={<FormattedMessage id="accessToken"/>}>
                                <Input/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" loading={loading} onClick={
                                    submit
                                }><FormattedMessage id="apply" /></Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </>
        )
    }

    return ui()
    
}

export { RegisterEngine }