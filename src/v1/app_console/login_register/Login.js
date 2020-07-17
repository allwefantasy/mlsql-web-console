import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Steps, Divider, PageHeader, Input, Form, Card, Button } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { AppConsoleContext } from '../AppConsole';
import UIMaker from '../../UIMaker';
import './Register.scss'
import { AppConsoleActionNames } from '../actions/AppConsoleReducer';
import { LoginRegisterReducer, LoginRegisterHandlers, LoginRegisterActionNames } from './actions/LoginRegisterReducer';
import ActionMaker from '../../ActionMaker';


const initState = {
    logined: false
}

const LoginContext = React.createContext()

function Login() {
    const { formItemLayout, tailLayout } = UIMaker.formLayout1()
    const { dispacher:appConsoleDispacher } = useContext(AppConsoleContext)    
    
    const [state, dispacher] = useReducerAsync(LoginRegisterReducer, initState, LoginRegisterHandlers)
    const {logined} = state
    
    useEffect(() => {        
        appConsoleDispacher({
            type: AppConsoleActionNames.CHECK_LOGINED,
            data: { 
                logined
            }
        })
    }, [logined])

    return (
        <LoginContext.Provider>
            <div className="app-console-main-register">
                <Card title="Login">
                    <Form {...formItemLayout} className="login-form" onFinish={(values) => {
                        dispacher(ActionMaker.buildEvent(LoginRegisterActionNames.LOGIN, values))
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
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Go
        </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </LoginContext.Provider>
    )
}
export { Login, LoginContext }