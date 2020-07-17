import React, { useState, useContext, useEffect } from 'react';
import { Steps, Divider, PageHeader, Input, Form, Card, Button } from 'antd';
import { AppSetupContext } from '../app_setup';
import { AppSetupActionNames } from '../actions/app/AppSetupReducer';
import UIMaker from '../../UIMaker';


function AddEngines() {

    const { dispacher } = useContext(AppSetupContext)
    const {formItemLayout,tailLayout} = UIMaker.formLayout1()
    const requireField = { required: true,
        message: 'required'}

    return <Form {...formItemLayout} className="login-form" onFinish={(values) => {
        dispacher({
            type: AppSetupActionNames.addEngine,
            data: values
        })
    }}>
        <Form.Item
            label="Engine Name"
            name="name"
            rules={[requireField]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Engine Url"
            name="url"
            rules={[requireField]}
        >
            <Input/>
        </Form.Item>

        <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
                Go
        </Button>
        <Divider type="vertical"></Divider>
        <Button onClick={
            (e)=>{
              e.preventDefault()              
              dispacher({
                type: AppSetupActionNames.skipAddEngine,
                data: {}
            })
            }
        } htmlType="submit">
                Skip
        </Button>
        </Form.Item>
    </Form>
}

export default AddEngines