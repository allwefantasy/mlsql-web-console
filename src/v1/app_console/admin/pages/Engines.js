import React, { useState, useCallback, useEffect } from 'react';
import { useCrudTable } from '../../../analysis/common/CrudTable';
import { Select, Form, Button, Switch, Divider } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';
import Tools from '../../../../common/Tools';


function Engines(props) {

    const [reload, setReload] = useState(undefined)
    const proxy = new ActionProxy()
    const { ui, setData, setSchema, setEditorMode ,setError} = useCrudTable({
        remove: async ({row,setLoading}) => {
            setLoading(true)
            setError(undefined)
            const res = await proxy.post(RemoteAction.ENGINE_REMOVE, {id:row.id})
            if(res.status !== 200){
                setLoading(false)
                setError(res.content)
                return
            }
            setReload(Tools.getJobName())
            setLoading(false)
        },
        submit: async ({ params, setLoading }) => {
            setLoading(true)
            setError(undefined)
            for (let i = 0; i < params.length; i++) {
                const res = await proxy.post(RemoteAction.ENGINE_ADD, params[i])
                if(res.status !== 200){
                    setLoading(false)
                    setError(res.content)
                    return
                }
            }
            setReload(Tools.getJobName())
            setLoading(false)
        },
        renderConfig: {
            skipAuth: ({ getKey }) => {
                return {
                    title: "skipAuth",
                    dataIndex: "skipAuth",
                    key: "skipAuth",
                    render: (text, row, index) => {
                        let value = true
                        if (text === 2) {
                            value = false
                        }
                        return <>
                            <Form.Item name={`params[${getKey(index)}].skipAuth`} initialValue={String(value)}>
                                <Select>
                                    <Select.Option value="true">true</Select.Option>
                                    <Select.Option value="false">false</Select.Option>
                                </Select>
                            </Form.Item>
                        </>
                    }

                }
            }
        }
    })

    useEffect(() => {
        const fetch = async () => {
            const res = await proxy.get(RemoteAction.ENGINE_LIST, {})
            if (res.status === 200) {
                setSchema(res.content.schema)
                setData(res.content.data)
            }
        }
        fetch()
    }, [reload])

    return <div className="common-margin">
        <Switch checkedChildren="Edit Mode" unCheckedChildren="View Mode" onChange={
            (checked) => {
                setEditorMode(checked)
            }
        } />
        <Divider type="horizontal" />
        {ui()}
    </div>
}

export { Engines }
