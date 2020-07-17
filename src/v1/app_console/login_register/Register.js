import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Steps, Divider, PageHeader, Input, Form, Card, Button } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { AppConsoleContext } from '../AppConsole';
import UIMaker from '../../UIMaker';
import './Register.scss'


const initState = {

}

const RegisterContext = React.createContext()

function Register() {
    const { dispacher } = useContext(AppConsoleContext)
    const { formItemLayout, tailLayout } = UIMaker.formLayout1()
    // const [state, dispacher] = useReducerAsync(RegisterReducer, initState, RegisterHandlers)
    return (
        <RegisterContext.Provider value={{}}>
            <div className="app-console-main-register">
              <Card title="Register">
              <Form {...formItemLayout} className="login-form" onFinish={(values) => {
                dispacher({
                    type: "",
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