import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { Form, Tag, Divider, Select, Button,Modal,Input,Switch } from 'antd'
import { CastFieldsReducer, CastFieldsHandlers, CastFieldsActionNames } from './actions/CastFieldsReducer';
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback';
import { OrderStationActionNames } from '../order/actions/OrderStationReducer';
import AlertBox from '../../AlertBox';
const { Option } = Select;


const initState = {
    error: undefined,
    //为了回调applySaveRollback组件  
    applySaveRollbackDispacher: undefined,
    operateFileds:[]
}

const CastFieldsContext = React.createContext()

function CastFields(props) {
    const {workshop} = props
    const [form] = Form.useForm()
    const fields = workshop.currentTable.schema.fields
    const [state, dispacher] = useReducerAsync(CastFieldsReducer, initState, CastFieldsHandlers)
    const { operateFileds, error,applySaveRollbackDispacher} = state
    const children = fields.map(item => {
        return <Option key={item.name}>{item.name}</Option>
    })

    useEffect(()=>{
        if(applySaveRollbackDispacher){
            form.submit()
        }       
    },[applySaveRollbackDispacher])
    
    return (
        <CastFieldsContext.Provider value={{ dispacher }}>
            <div style={{ marginTop: "10px", "width": "400px" }}>
                {
                    error && <AlertBox message={error}></AlertBox>
                }
                <Form form={form} onFinish={(values) => {                    
                    dispacher({
                        type: "apply",
                        data: {
                            workshop,
                            values                                                    
                        }
                    })
                }} className="login-form" >
                    <Form.Item>
                        <ApplySaveRollback context={CastFieldsContext} workshop={workshop}/>
                    </Form.Item>
                    <Form.Item label="Choose fields" >
                        <Select
                            mode="multiple"
                            onDeselect={value => {
                                dispacher({
                                    type: CastFieldsActionNames.REMOVE_FIELD,
                                    data: { fields: value }
                                })
                            }}
                            onChange={(value) => {
                                dispacher({
                                    type: CastFieldsActionNames.ADD_FIELD,
                                    data: { fields: value }
                                })
                            }}
                        >
                            {children}
                        </Select>
                    </Form.Item>

                    {operateFileds.map(item => {
                        return <Form.Item key={item.field} label={`Cast ${item.field} to`} name={item.field}>
                            <Select>
                                <Select.Option value="int">int</Select.Option>
                                <Select.Option value="long">long</Select.Option>
                                <Select.Option value="double">double</Select.Option>
                                <Select.Option value="string">string</Select.Option>
                            </Select>
                        </Form.Item>
                    })}
                </Form>
            </div>
        </CastFieldsContext.Provider>
    )
}
export { CastFields, CastFieldsContext }