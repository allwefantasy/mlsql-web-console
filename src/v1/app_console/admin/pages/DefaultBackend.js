import React, { useState, useCallback, useEffect } from 'react';
import { EngineSelectComp } from '../../pages/EngineSelectComp';
import { Form, Card } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';
import UIMaker from '../../../UIMaker';


function DefaultBackend(props) {
    const [engine, setEngine] = useState(undefined)
    useEffect(() => {
        const save = async () => {
            const proxy = new ActionProxy()
            const res = await proxy.post(RemoteAction.USER_EXTRA, { backend: engine })
            UIMaker.updateUser(res)
        }
        if (engine) {
            save()
        }
    }, [engine])
    return (
        <div className="common-margin common-child-center">
            <Card title="Default Backend" style={{width:"50%"}}>
            <Form>
            <Form.Item label="currentValue">
                {UIMaker.extraOption()["backend"] || "Not Set Yet"}
            </Form.Item>
            <Form.Item label="Set default engine">
                <EngineSelectComp useEngine={(engine) => { setEngine(engine) }} />
            </Form.Item>
           </Form>
            </Card>
        </div>
    )
}
export { DefaultBackend }