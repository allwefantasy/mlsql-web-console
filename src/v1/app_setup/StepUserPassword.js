import React, { useState, useContext } from 'react';
import { Steps, Divider, PageHeader, Input, Form, Card, Button } from 'antd';
import { AppSetupContext } from './app_setup';
import { AppSetupEventConst } from './AppSetupReducer';
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

function StepUserPassword() {

    const { dispacher } = useContext(AppSetupContext)

    return <Form {...formItemLayout} className="login-form" onFinish={(values) => {
        dispacher({
            type: AppSetupEventConst.REGISTER_ADMIN,
            data: values
        })
    }}>
        <Form.Item
            label="Admin Name"
            name="username"
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
            label="Admin Password"
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
            label="Repeated Admin Password"
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