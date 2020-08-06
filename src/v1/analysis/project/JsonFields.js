import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { Form, Tag, Divider, Select, Button, Modal, Input, Switch, Card } from 'antd'
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback';
import AlertBox from '../../AlertBox';
import AnalysisWorkshop from '../workshop';
import { JsonFieldsReducer, JsonFieldsHandlers } from './actions/JsonFieldsReducer';
import { CommonActionNames } from '../common/CommonActionNames';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Tools from '../../../common/Tools';
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
const { Option } = Select;


const initState = {
    error: undefined,
    //为了回调applySaveRollback组件  
    applySaveRollbackDispacher: undefined,
    operateFiled: undefined,
    keyPaths: [],
    forms: [],
    subFields: []
}

const JsonFieldsContext = React.createContext()

function JsonFields(props) {
    const workshop = AnalysisWorkshop.workshop
    const [form] = Form.useForm()
    const fields = workshop.currentTable.schema.fields
    const data = workshop.currentTable.data.slice(0, 10)

    const [state, dispacher] = useReducerAsync(JsonFieldsReducer, initState, JsonFieldsHandlers)
    const { operateFiled,
        keyPaths,
        error,
        applySaveRollbackDispacher,
        forms,
        subFields
    } = state
    const children = fields.map(item => {
        return <Option key={item.name}>{item.name}</Option>
    })

    useEffect(() => {
        if (operateFiled) {            
            dispacher({
                type: CommonActionNames.setState,
                data:{
                    subFields:[],
                    forms: []
                }
            })    

            const temp = new Set()            
            const tempObjs = data.map(item => {
                try{
                    return JSON.parse(item[operateFiled])
                }catch(e){
                    return undefined
                }
            }).filter(item=>  item !== undefined && 
                (typeof(item) === "object" || typeof(item) === "array"))

            console.log(tempObjs)

            tempObjs.forEach(obj => {
                Tools.keyPath("$", obj, (key) => {
                    temp.add(key)
                })
            })

            dispacher({
                type: CommonActionNames.setState,
                data: { keyPaths: [...temp] }
            })
        }
    }, [operateFiled])

    useEffect(() => {
        if (applySaveRollbackDispacher) {
            form.submit()
        }
    }, [applySaveRollbackDispacher])

    const apply = useCallback(({workshop,values,forms})=>{
         console.log(values)
         console.log(forms.map(item=>{
             return item.getFieldsValue()
         })) 
         applySaveRollbackDispacher.dispacher({
             type:"setState",
             data:{loading:false}
         })
    },[applySaveRollbackDispacher])

    return (
        <JsonFieldsContext.Provider value={{ dispacher }}>
            <div style={{ marginTop: "10px", "width": "600px" }}>
                {
                    error && <AlertBox message={error}></AlertBox>
                }
                <Form form={form} onFinish={(values) => {
                    const formValues = forms.map(item=>item.getFieldsValue())
                    dispacher({
                        type: "apply",
                        data: {
                            workshop,
                            values: {formValues,operateFiled}
                        }
                    })
                }} className="login-form" >
                    <Form.Item>
                        <ApplySaveRollback context={JsonFieldsContext} workshop={workshop} />
                    </Form.Item>
                    <Form.Item label={<FormattedMessage id="choose_json_field"/>} style={{ width: "300px" }}>
                        <Select
                            onChange={(value) => {
                                dispacher({
                                    type: CommonActionNames.setState,
                                    data: { operateFiled: value }
                                })
                            }}
                        >
                            {children}
                        </Select>
                    </Form.Item>
                </Form>
                {
                    operateFiled && <Card title={<Button icon={<PlusOutlined />} onClick={() => {
                        dispacher({
                            type: CommonActionNames.ADD_FIELD,
                            data: {}
                        })
                    }}></Button>}>
                        {
                            subFields
                        }
                    </Card>
                }



            </div>
        </JsonFieldsContext.Provider>
    )
}
export { JsonFields, JsonFieldsContext }