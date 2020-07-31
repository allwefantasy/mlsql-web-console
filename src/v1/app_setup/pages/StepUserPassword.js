import React, { useState, useContext, useEffect } from 'react';
import { Steps, Divider, PageHeader, Input, Form, Card, Button } from 'antd';
import { AppSetupContext } from '../app_setup';
import { AppSetupActionNames } from '../actions/app/AppSetupReducer';
import UIMaker from '../../UIMaker';


function StepUserPassword() {

    const { dispacher } = useContext(AppSetupContext)
    const { formItemLayout, tailLayout } = UIMaker.formLayout1()

    return <Form {...formItemLayout} className="login-form" onFinish={(values) => {
        dispacher({
            type: AppSetupActionNames.registerAdmin,
            data: values
        })
    }}>        

        <Form.Item
            label="Oringinal Password"
            name="password"
            rules={[
                {
                    required: true,
                    message: 'Please input your oringinal password!',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>
        <Form.Item
            label="New Password"
            name="oldPassword"
            rules={[
                {
                    required: true,
                    message: 'Please input your new password!',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>
        <Form.Item
            label="New Password"
            name="password"
            rules={[
                {
                    required: true,
                    message: 'Please input your new password again!',
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