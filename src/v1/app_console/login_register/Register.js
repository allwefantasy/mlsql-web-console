import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Steps, Divider, Alert, Input, Form, Card, Button } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { AppConsoleContext } from '../AppConsole';
import UIMaker from '../../UIMaker';
import './Register.scss'
import { LoginRegisterActionNames, LoginRegisterReducer, LoginRegisterHandlers } from './actions/LoginRegisterReducer';
import { AppConsoleActionNames } from '../actions/AppConsoleReducer';
import { SetStateAction } from '../admin/actions/SetStateAction';
import AlertBox from '../../AlertBox';


const RegisterContext = React.createContext()
const initState = {
    logined: false,
    error: undefined
}
function Register() {
    const { dispacher: appConsoleDispacher } = useContext(AppConsoleContext)
    const { formItemLayout, tailLayout } = UIMaker.formLayout1()
    const [state, dispacher] = useReducerAsync(LoginRegisterReducer, initState, LoginRegisterHandlers)

    const { logined, error } = state

    useEffect(() => {        
        appConsoleDispacher({
            type: AppConsoleActionNames.CHECK_LOGINED,
            data: {}
        })
    }, [logined])

    return (
        <RegisterContext.Provider value={{}}>
            <div className="app-console-main-register">
                <Card title="Register">
                    {
                        error && <AlertBox type="error" message={error}></AlertBox>
                    }
                    <Form {...formItemLayout} className="login-form" onFinish={(values) => {
                        dispacher({
                            type: LoginRegisterActionNames.REGISTER,
                            data: values
                        })
                    }}>
                        <Form.Item
                            label="UserName"
                            name="userName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Repeated Password"
                            name="password2"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Go
        </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </RegisterContext.Provider>
    )
}
export { Register, RegisterContext }