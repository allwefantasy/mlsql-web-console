import React, { useState, useCallback, useEffect } from 'react';
import { useCrudTable } from '../../../analysis/common/CrudTable';
import { Select, Form, Button, Switch, Divider } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';
import Tools from '../../../../common/Tools';


function ListMySQL() {
    const [reload, setReload] = useState(undefined)
    const proxy = new ActionProxy()
    const { ui, setData, setSchema, setEditorMode ,setError} = useCrudTable({
        submit: async ({ params, setLoading }) => {
            setLoading(true)
            setError(undefined)
            for (let i = 0; i < params.length; i++) {
                // const res = await proxy.post(RemoteAction.ENGINE_ADD, params[i])
                // if(res.status !== 200){
                //     setLoading(false)
                //     setError(res.content)
                //     return
                // }
            }
            setReload(Tools.getJobName())
            setLoading(false)
        },
        remove: async(row) =>{
            const res = await proxy.post(RemoteAction.DS_REMOVE,{id:row.id})
            if(res.status === 200){
                setSchema(res.content.schema)
                setData(res.content.data)
            }
        },
        renderConfig: {}
    })

    useEffect(() => {
        const fetch = async () => {
            const res = await proxy.get(RemoteAction.DS_LIST, {})
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
export { ListMySQL }