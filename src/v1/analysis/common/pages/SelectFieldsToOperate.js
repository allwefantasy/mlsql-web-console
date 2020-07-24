import React, { useState, useCallback, useEffect } from 'react';
import { Form, Tag, Divider, Select, Button, Modal, Input, Switch } from 'antd'
import AlertBox from '../../../AlertBox';
import { ApplySaveRollback } from '../../../apply_save_rollback/ApplySaveRollback';
const { Option } = Select;
function useSelectFields(props) {
    const { workshop,
        dispacher,
        context,
        enableApply = false,
        fieldWrapper,submit,selectFields,
        selectFieldsLabel="Choose fields",
        selectFieldsMode="multiple"
    } = props
    const fields = selectFields || workshop.currentTable.schema.fields
    const [operateFields, setOperateFields] = useState([])
    const [error, setError] = useState(undefined)
    const [form] = Form.useForm()

    const children = fields.map(item => {
        return <Option key={item.name}>{item.name}</Option>
    })

    const ui = (commands) => {
        return <Form form={form} className="login-form" onFinish={submit} >
                {
                  error && <AlertBox onClose={()=>{setError(undefined)}} message={error}></AlertBox>
                }
                {enableApply && <Form.Item>
                    <ApplySaveRollback context={context} workshop={workshop} />
                </Form.Item>
                }
                <Form.Item label={selectFieldsLabel} name="selectFieldsName">
                    <Select
                        style={{"minWidth":"200px"}}                        
                        mode={selectFieldsMode}
                        onDeselect={value => {                            
                            setOperateFields(operateFields.filter(item => value !== item.field))
                        }}
                        onChange={(values) => {  
                            if(selectFieldsMode==="multiple"){
                                setOperateFields(values.map(field => {
                                    return { field }
                                }))
                            }else {
                                setOperateFields([{ field:values }])
                            }
                            
                        }}
                    >
                        {children}
                    </Select>
                </Form.Item>

                {operateFields.map(item => {
                    return fieldWrapper(item)
                })}

                {commands}

            </Form>        
    }

    return { ui, operateFields, form, setError }

}

export default useSelectFields

