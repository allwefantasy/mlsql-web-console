import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Form, Tag, Divider, Select, Button, Modal, Input, Switch } from 'antd'
import { CommonActionNames } from '../common/CommonActionNames';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl'
const { Option } = Select;


function AddJsonField(props) {
    const [form] = Form.useForm() 
    const {context,keyPaths} = props
    const {dispacher} = useContext(context)
    useEffect(()=>{
        props.forms.push(form)
    },[])
    return (
        <Form layout="inline" form={form} style={{marginBottom:"30px"}}>                                
        <Form.Item >
            <Button danger icon={<MinusOutlined />} onClick={() => {
                dispacher({
                    type: CommonActionNames.REMOVE_FIELD,
                    data: {form}
                })
            }}></Button>
        </Form.Item>
        <Form.Item label={<FormattedMessage id="add"/>} name={"path"} style={{ width: "300px" }}>
            <Select>
                {keyPaths.map(item => <Option key={item}>{item}</Option>)}
            </Select>
        </Form.Item>
        <Form.Item label={<FormattedMessage id="as"/>} name={"column"} style={{ width: "100px" }}>
            <Input />
        </Form.Item>                        
</Form>
    )
}
export {AddJsonField}