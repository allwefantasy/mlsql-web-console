import React, { useState, useContext, useEffect } from 'react';
import { Steps, Divider, PageHeader, Input, Form, Card, Button } from 'antd';
import { AppSetupContext } from '../app_setup';
import { AppSetupActionNames } from '../actions/app/AppSetupReducer';
import UIMaker from '../../UIMaker';


function StepUserPassword() {

    const { dispacher } = useContext(AppSetupContext)
    const {formItemLayout,tailLayout} = UIMaker.formLayout1()

    return <Form {...formItemLayout} className="login-form" onFinish={(values) => {
        dispacher({
            type: AppSetupActionNames.registerAdmin,
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
}

export default StepUserPassword