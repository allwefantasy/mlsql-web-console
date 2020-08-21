import React, { useState, useCallback, useEffect } from 'react';
import { EngineSelectComp } from '../../pages/EngineSelectComp';
import { Form, Card, Button } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';
import UIMaker from '../../../UIMaker';
import { useUserConfig } from '../../../analysis/common/pages/useUserConfig';
import { FormattedMessage  } from 'react-intl'; 
import Tools from '../../../../common/Tools';


function DefaultBackend(props) {

    const { ui, setError,setSuccess } = useUserConfig()
    const [engine,setEngine] = useState(undefined)
    const submit = async () => {
        if(!engine){
          setError("set_default_backend_error")
          return
        }
        const proxy = new ActionProxy()
        const res = await proxy.post(RemoteAction.USER_EXTRA, { backend: engine })
        if (res.status === 200) {
            UIMaker.updateUser(res) 
            setSuccess("done")           
            return
        }
        setError(res.content)
    }

    return ui({
        title: <FormattedMessage id="set_default_backend"/>,
        submit,
        formItems: <>
            <Form.Item label={<FormattedMessage id="curent_value"/>}>
                {UIMaker.extraOption()["backend"] || "Not Set Yet"}
            </Form.Item>
            <Form.Item label={<FormattedMessage id="choose"/>}>
                <EngineSelectComp useEngine={(engine) => { setEngine(engine) }} />
            </Form.Item></>
    })
}
export { DefaultBackend }