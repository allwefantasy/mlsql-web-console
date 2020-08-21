import React, { useState, useCallback, useEffect } from 'react';
import { Form, Card, Select, Divider, Button } from 'antd';

function useDataConfig(props) {
    const workshop = props.parent.workshop
    const fields = workshop.currentTable.schema.fields.map(item => item.name)
    const [form] = Form.useForm()
    const [vType, setVtype] = useState()
    const [plugins, setPlugins] = useState([])

    const columns = fields.map(item => {
        return <Select.Option value={item}>{item}</Select.Option>
    })


    const onFieldsChange = useCallback((changeFields) => {
        changeFields.forEach(item => {
            if (item.name[0] === "vType") {
                setVtype(item.value)
            }
        })
    }, [])

    const ui = () => {
        return <Card title="Generic">
            <Form form={form} onFieldsChange={onFieldsChange}>
                <Form.Item label="Visulizaiton Plugin" name="vType">
                    <Select >
                        {
                            plugins.map(item => {
                                return <Select.Option value={item}>{item}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item label="X Column" name="xColumn">
                    <Select >
                        {columns}
                    </Select>
                </Form.Item>

                <Form.Item label="Y Column" name="yColumn">
                    <Select >
                        {columns}
                    </Select>
                </Form.Item>
            </Form>
        </Card>
    }
    return { ui, form, vType, setPlugins }
}
export { useDataConfig }