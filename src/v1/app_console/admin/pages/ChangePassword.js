import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Input, Form, Card, Button, Alert } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';



function ChangePassword() {
    const [error, setError] = useState(undefined)
    const [applySuccess, setApplySuccess] = useState(undefined)

    const submit = useCallback(async (values) => {
        const { password, newPassword, _newPassword } = values
        if (newPassword !== _newPassword) {
            setError("Two new passwords are not the same")
            return
        }
        const proxy = new ActionProxy()
        const res = proxy.post(RemoteAction.USER_CHANGE_PASSWORD, values)
        setApplySuccess("Update password successfully.")
    }, [])

    return <Card className="common-child-center">
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
        <Form className="login-form" onFinish={(values) => {
            submit(values)
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
                name="newPassword"
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
                name="_newPassword"
                rules={[
                    {
                        required: true,
                        message: 'Please input your new password again!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item >
                <Button type="primary" htmlType="submit">
                    Submit
            </Button>
            </Form.Item>
        </Form>
    </Card>
}

export default ChangePassword