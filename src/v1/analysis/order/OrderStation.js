import React, { useState, useCallback, useEffect } from 'react';
import { Form, Tag, Divider, Select, Button,Modal,Input,Switch } from 'antd'
import { useReducerAsync } from 'use-reducer-async'
import { OrderStationReducer, OrderStationHandlers, OrderStationActionNames } from './actions/OrderStationReducer';
import AlertBox from '../../AlertBox';
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback';



const initState = {
    orderFileds: [],
    error: undefined,  
    //为了回调applySaveRollback组件  
    applySaveRollbackDispacher:undefined
}

const OrderStationContext = React.createContext()
const { Option } = Select;
function OrderStation(props) {
    const workshop = props.parent.workshop
    const fields = workshop.currentTable.schema.fields
    const [state, dispacher] = useReducerAsync(OrderStationReducer, initState, OrderStationHandlers)
    const { orderFileds, error,applySaveRollbackDispacher} = state
    const [form] = Form.useForm()

    const children = fields.map(item => {
        return <Option key={item.name}>{item.name}</Option>
    })
    
    useEffect(()=>{
        if(applySaveRollbackDispacher){
            form.submit()
        }       
    },[applySaveRollbackDispacher])

    return (
        <OrderStationContext.Provider value={{ dispacher }}>
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
                        <ApplySaveRollback context={OrderStationContext} workshop={workshop}/>
                    </Form.Item>
                    <Form.Item label="Choose fields" >
                        <Select
                            mode="multiple"
                            onDeselect={value => {
                                dispacher({
                                    type: OrderStationActionNames.REMOVE_FIELD,
                                    data: { fields: value }
                                })
                            }}
                            onChange={(value) => {
                                dispacher({
                                    type: OrderStationActionNames.ADD_FIELD,
                                    data: { fields: value }
                                })
                            }}
                        >
                            {children}
                        </Select>
                    </Form.Item>

                    {orderFileds.map(item => {
                        return <Form.Item initialValue={"desc"} key={item.field} label={item.field} name={item.field}>
                            <Select>
                                <Select.Option value="desc">desc</Select.Option>
                                <Select.Option value="asc">asc</Select.Option>
                            </Select>
                        </Form.Item>
                    })}
                </Form>
            </div>
        </OrderStationContext.Provider>
    )
}
export { OrderStation, OrderStationContext }