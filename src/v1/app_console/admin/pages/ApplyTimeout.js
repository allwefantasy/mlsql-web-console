import React, { useState, useCallback, useEffect } from 'react';
import { EngineSelectComp } from '../../pages/EngineSelectComp';
import { Form, Card, Button } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';
import UIMaker from '../../../UIMaker';
import { useUserConfig } from '../../../analysis/common/pages/useUserConfig';
import { FormattedMessage  } from 'react-intl'; 
import Tools from '../../../../common/Tools';
import { useIntegerStep } from '../../../analysis/common/pages/useIntegerStep';


function ApplyTimeout(props) {

    const { ui, setError,setSuccess } = useUserConfig()
    const {ui:timeoutUi,value:timoutValue} = useIntegerStep({
        initialValue:UIMaker.extraOption()["apply_timeout"] || 10
    })    
    const submit = async () => {
        if(!timoutValue){
          setError("set_default_backend_error")
          return
        }
        const proxy = new ActionProxy()
        const res = await proxy.post(RemoteAction.USER_EXTRA, { apply_timeout: timoutValue })
        if (res.status === 200) {
            UIMaker.updateUser(res) 
            setSuccess("done")           
            return
        }
        setError(res.content)
    }

    return ui({
        title: <FormattedMessage id="set_apply_timeout"/>,
        submit,
        formItems: <>
            <Form.Item label={<FormattedMessage id="curent_value"/>}>
                {timoutValue}
            </Form.Item>
            <Form.Item label={<FormattedMessage id="choose"/>}>
                {timeoutUi()}
            </Form.Item></>
    })
}
export { ApplyTimeout }