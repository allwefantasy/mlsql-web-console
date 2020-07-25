import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Divider } from 'antd';
import Tools from '../../../../common/Tools';


function useDashConfig(props) {
    const [form] = Form.useForm()
    const [pluginConfigs, setPluginConfigs] = useState([])

    console.log(pluginConfigs)
    const ui = () => {
        return <Form form={form}>
            {pluginConfigs.map(item => {
                return <Form.Item key={item.key} name={item.key} label={item.option.label || item.key} initialValue={Tools.unQuote(item.command)}>
                    <Input />
                </Form.Item>
            })}
        </Form>
    }
    return { ui, form, setPluginConfigs ,pluginConfigs}
}
export { useDashConfig }