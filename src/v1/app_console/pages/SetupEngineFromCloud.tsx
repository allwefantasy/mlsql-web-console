import React,{useEffect} from 'react'
import { useReducerAsync } from 'use-reducer-async'
import { SetupEngineFromCloudReducer, SetupEngineFromCloudHandlers } from './actions/SetupEngineFromCloudReducer'
import { FormattedMessage } from 'react-intl'
import {useUserConfig} from "../../analysis/common/pages/useUserConfig";
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";
import {Col, Divider, Form, Input, Result, Select, Slider, Switch} from "antd";
import {UseEngineCreateLoading} from "./UseEngineCreateLoading";
import {CommonActionNames} from "../../analysis/common/CommonActionNames";

interface Props {   
}

const initState = {
  loadingPage: false,
  engineName:  ""
}

const SetupEngineFromCloudContext = React.createContext<{state:any,dispacher:React.Dispatch<any>}|null>(null)

const SetupEngineFromCloud:React.FunctionComponent<Props> = (props) => {
    const [state, dispacher] = useReducerAsync(SetupEngineFromCloudReducer, initState, SetupEngineFromCloudHandlers)
    const {loadingPage,engineName} = state;
    const { ui, setError,getParams } = useUserConfig({width:"70%"})
    const submit = async ()=>{
        const proxy = new ActionProxy()
        const params = getParams()
        const res = await proxy.post(RemoteAction.CLOUD_CREATE_ENGINE,params)
        if(res.status === 200){
            setError("")
            dispacher({
                type: CommonActionNames.setState,
                data: {
                    loadingPage: true,
                    engineName: params["owner"]
                }

            })
        }else {
            try {
                setError(JSON.parse(res.content)?.message || "Unknown Error")
            }catch (e){
                setError(e.description)
            }

        }
    }

    useEffect(()=>{
      // const fetch = async()=>{          
      // }
      // fetch()
     },[])

    return (
        <SetupEngineFromCloudContext.Provider value={ { state,dispacher} }>
            <div>
                {
                    loadingPage ?
                        <UseEngineCreateLoading name={engineName}/>
                        : ui({
                        title: <FormattedMessage id="input_message"/>,
                        submit,
                        formItems: <>
                            <Result
                                status="warning"
                                title={<FormattedMessage id="a_1"/>}
                                extra={<FormattedMessage id="a_2"/>}
                            />
                            <Divider orientation="left"><FormattedMessage id="aliyun_related"/></Divider>
                            <Form.Item name={"owner"} label={<FormattedMessage id="engine_name"/>} help={"必填"}>
                                <Input />
                            </Form.Item>
                            <Form.Item name={"OSSBucket"} label={<FormattedMessage id="OSSBucket"/>} help={"默认bucket名称,比如：mlsql-release-repo"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"AccessKeyID"} label={<FormattedMessage id="access_key_id"/>} help={"必填"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"AccessKeySecret"} label={<FormattedMessage id="access_key_secret"/>} help={"必填"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"OSSAccessKeyID"} label={<FormattedMessage id="oss_access_key_id"/>} help={"默认同 AccessKeySecret"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"OSSAccessKeySecret"} label={<FormattedMessage id="oss_access_key_secret"/>} help={"默认同 AccessKeySecret"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"ReginID"} label={<FormattedMessage id="regin_id"/>} initialValue={"cn-hangzhou"}>
                                <Input/>
                            </Form.Item>
                            <Form.Item valuePropName="checked"  initialValue={true} name={"EndpointPublicAccess"} label={<FormattedMessage id="endpoint_public_access"/>} >
                                <Switch  />
                            </Form.Item>
                            <Divider orientation="left"><FormattedMessage id="cluster_related"/></Divider>
                            {/*<Form.Item name={"K8sAddress"} label={<FormattedMessage id="K8sAddress"/>} help={"选填"}>*/}
                            {/*    <Input/>*/}
                            {/*</Form.Item>*/}
                            <Form.Item name={"DriverCoreNum"} label={<FormattedMessage id="driver_core_num"/>} initialValue={1}>
                                <Slider
                                    min={0}
                                    max={8}
                                    marks={{
                                        1: '1c',
                                        2: '2c',
                                        4: '4c',
                                        8: '8c'
                                    }}
                                />
                            </Form.Item>
                            <Form.Item name={"DriverMemory"} label={<FormattedMessage id="driver_memory"/>} initialValue={2}>
                                <Slider
                                    min={0}
                                    max={8}
                                    marks={{
                                        2: '2g',
                                        4: '4g',
                                        8: '8g'
                                    }}
                                />
                            </Form.Item>
                            <Form.Item name={"ExecutorCoreNum"} label={<FormattedMessage id="executor_core_num"/>} initialValue={1}>
                                <Slider
                                    min={0}
                                    max={8}
                                    marks={{
                                        1: '1c',
                                        2: '2c',
                                        4: '4c',
                                        8: '8c'
                                    }}
                                />
                            </Form.Item>
                            <Form.Item name={"ExecutorMemory"} label={<FormattedMessage id="executor_memory"/>} initialValue={2}>
                                <Slider
                                    min={0}
                                    max={8}
                                    marks={{
                                        2: '2g',
                                        4: '4g',
                                        8: '8g'
                                    }}
                                />
                            </Form.Item>
                            <Form.Item name={"ExecutorNum"} label={<FormattedMessage id="executor_num"/>} initialValue={1}>
                                <Slider
                                    min={0}
                                    max={8}
                                    marks={{
                                        1: '1',
                                        4: '4',
                                        8: '8'
                                    }}
                                />
                            </Form.Item>
                            <Form.Item name={"EngineVersion"} label={<FormattedMessage id="engine_version"/>} initialValue={"2.1.0"}>
                                <Select>
                                    <Select.Option value={"2.1.0"}>2.1.0</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name={"JarEngineVersion"} label={<FormattedMessage id="jar_engine_version"/>} initialValue={"2.1.0-SNAPSHOT"}>
                                <Select>
                                    <Select.Option value={"2.1.0-SNAPSHOT"}>2.1.0-SNAPSHOT</Select.Option>
                                </Select>
                            </Form.Item>

                        </>
                    })
                }
          </div>
      </SetupEngineFromCloudContext.Provider>
    )
}

export { SetupEngineFromCloud, SetupEngineFromCloudContext}