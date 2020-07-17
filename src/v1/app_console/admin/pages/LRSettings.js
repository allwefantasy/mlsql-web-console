import React, { useState, useCallback, useEffect } from 'react';
import { Steps, Spin, Switch, Alert, Form, Card, Button } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import UIMaker from '../../../UIMaker'
import { AdminSettingReducer, AdminSettingHandlers, AdminSettingActionNames } from '../actions/AdminSettingReducer';
import ActionMaker from '../../../ActionMaker';
import {ActionProxy} from '../../../../backend_service/ActionProxy'
import RemoteAction from '../../../../backend_service/RemoteAction';
import SpinBox from '../../../SpinBox';

const initState = {
    enableLogin: false,
    enableRegister: false,
    applySuccess: false,
    error: undefined,
    loading: true
}

const LRSettingsContext = React.createContext()

function LRSettings() {
    const [state, dispacher] = useReducerAsync(AdminSettingReducer, initState, AdminSettingHandlers)
    const { formItemLayout, tailLayout } = UIMaker.formLayout1()

    const { enableLogin, enableRegister,applySuccess,error,loading} = state

    async function getAppInfo() {        
        const client = new ActionProxy()
        const appInfo = await client.get(RemoteAction.APP_INFO, {})
        if (appInfo.status === 200) {             
            dispacher({
                type: AdminSettingActionNames.SET_STATE,
                data: {
                    enableLogin: Boolean(appInfo.content.login),
                    enableLogin: Boolean(appInfo.content.register),
                    loading: false
                }
            })
        }    
    }

    useEffect(()=>{
        getAppInfo()
    },[applySuccess,error])


    return (
        <LRSettingsContext.Provider value={{ dispacher }}>            
            {applySuccess && <Alert
                closable
                message="Success"
                description="Apply Success"
                type="success"
                showIcon
            />}
            {error && <Alert
                closable
                message="Fail"
                description={error}
                type="error"
                showIcon
            />}
            {                
                loading && <SpinBox></SpinBox>
            }
            {!loading && <Card title="Control Website Register/Login">
                <Form {...formItemLayout} className="login-form" onFinish={(values) => {
                    dispacher(ActionMaker.buildEvent(AdminSettingActionNames.LR_CONTROL, values))
                }}>
                    <Form.Item
                        label="Allow Register New User"
                        name="enableRegister"
                    >
                        <Switch defaultChecked={enableRegister} checkedChildren="enable" unCheckedChildren="shutdown" />
                    </Form.Item>

                    <Form.Item
                        label="Allow User Login"
                        name="enableLogin"
                    >
                        <Switch defaultChecked={enableLogin} checkedChildren="enable" unCheckedChildren="shutdown" />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Apply
        </Button>
                    </Form.Item>
                </Form>
            </Card>}            
        </LRSettingsContext.Provider>
    )
}
export { LRSettings, LRSettingsContext }