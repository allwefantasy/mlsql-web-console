import React, { useState, useCallback, useEffect } from 'react';
import { Form, Card, Input, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useUserConfig } from '../../common/pages/useUserConfig';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';


function MySQL() {
    const { ui, setError, setSuccess, form } = useUserConfig()
    const submit = async () => {
        let { host, port, db, user, password, name } = form.getFieldsValue()
        if (!name) {
            name = db
        }
        if (!port) {
            port = "3306"
        }
        const proxy = new ActionProxy()
        const res = await proxy.post(RemoteAction.DS_ADD, { 
            host, port, db, user, password, name, format: "jdbc",jType:"mysql" })
        if (res.status === 200) {
            setSuccess("Create Connect Success")
        } else {
            setError(res.content)
        }
    }

    return ui(
        {
            title: <FormattedMessage id="connect_mysql" />,
            submit,
            formItems: <>
                <Form.Item name="host" required={true} label={<FormattedMessage id="host" />}>
                    <Input placeholder="127.0.0.1" />
                </Form.Item>
                <Form.Item name="port" initialValue={"3306"} label={<FormattedMessage id="port" />}>
                    <Input />
                </Form.Item>
                <Form.Item name="db" required={true} label={<FormattedMessage id="db" />}>
                    <Input />
                </Form.Item>
                <Divider />
                <Form.Item name="user" required={true} label={<FormattedMessage id="user" />}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" required={true} label={<FormattedMessage id="password" />}>
                    <Input />
                </Form.Item>
                <Divider />
                <Form.Item name="name" label={<FormattedMessage id="alias" />}>
                    <Input />
                </Form.Item>
            </>
        }
    )
}
export { MySQL }