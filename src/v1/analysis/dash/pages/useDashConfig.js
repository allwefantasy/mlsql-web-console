import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input,  Divider, Card } from 'antd';
import RetinaImage from 'react-retina-image'
import Tools from '../../../../common/Tools';
import '../../../image.scss'


function useDashConfig(props) {
    const [form] = Form.useForm()
    const [pluginConfigs, setPluginConfigs] = useState([])
    const [imagePreview, setImagePreview] = useState()
    
    const ui = () => {
        return <Card title="Plugin Parameters">
            {imagePreview && <div className="image-wrapper" style={{width:"400px"}}>
                 <RetinaImage  src={imagePreview}/>
            </div>}
            <Form form={form}>
                {pluginConfigs.map(item => {
                    return <Form.Item key={item.key} name={item.key} label={item.option.label || item.key} initialValue={Tools.unQuote(item.command)}>
                        <Input />
                    </Form.Item>
                })}
            </Form>                        
        </Card>
    }
    return { ui, form, setPluginConfigs, pluginConfigs,setImagePreview }
}
export { useDashConfig }