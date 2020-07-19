import React, { useState, useCallback, useEffect } from 'react';
import { Form, Tag, Divider, Select, Button,Modal,Input,Switch } from 'antd'
import { useReducerAsync } from 'use-reducer-async'
import { OrderStationReducer, OrderStationHandlers, OrderStationActionNames } from './actions/OrderStationReducer';
import AlertBox from '../../AlertBox';
import { checkout } from 'superagent';



const initState = {
    orderFileds: [],
    error: undefined,
    loading: false,
    saveDiagram: false,
    saveTableName: undefined,
    saveTablePersisted: false
}

const OrderStationContext = React.createContext()
const { Option } = Select;
function OrderStation(props) {
    const workshop = props.parent.workshop
    const fields = workshop.currentTable.schema.fields
    const [state, dispacher] = useReducerAsync(OrderStationReducer, initState, OrderStationHandlers)
    const { orderFileds, error, loading, saveDiagram, saveTableName, saveTablePersisted } = state

    const children = fields.map(item => {
        return <Option key={item.name}>{item.name}</Option>
    })


    return (
        <OrderStationContext.Provider value={{ dispacher }}>
            <div style={{ marginTop: "10px", "width": "400px" }}>
                {
                    error && <AlertBox message={error}></AlertBox>
                }
                <Form onFinish={(values) => {
                    dispacher({
                        type: "setState",
                        data: {
                            loading: true
                        }
                    })
                    dispacher({
                        type: "apply",
                        data: {
                            workshop,
                            values,
                            loading:false
                        }
                    })
                }} className="login-form" >
                    <Form.Item>
                        <Modal title={"View"}
                            visible={saveDiagram}
                            onCancel={
                                () => {
                                    dispacher({
                                        type: "setState",
                                        data: { saveDiagram: false }
                                    })
                                }
                            }
                            onOk={() => {
                                dispacher({
                                    type: "save",
                                    data: {
                                        saveDiagram: false
                                    }
                                })
                            }}
                            cancelText="Cancel"
                            width="50%"
                            OkText="Ok">
                            <Form className="login-form">
                                <Form.Item><Input addonBefore="tableName" onChange={(value) => {
                                    dispacher({
                                        type: "setState",
                                        data: { saveTableName: value }
                                    })
                                }} placeholder="" /></Form.Item>
                                <Form.Item label="Persist table(take more space):"><Switch onChange={
                                    (checked) => {
                                        dispacher({
                                            type: "setState",
                                            data: { saveTablePersisted: checked }
                                        })
                                    }
                                }></Switch></Form.Item>
                            </Form>
                        </Modal>
                        <Button loading={loading} type="primary" htmlType="submit" >Apply</Button>
                        <Divider type="vertical" />
                        <Button disabled={loading} onClick={() => {
                            dispacher({
                                type: "setState",
                                data: {
                                    saveDiagram: true
                                }
                            })
                        }}>Save As</Button>
                        <Divider type="vertical" />
                        <Button disabled={loading} onClick={() => {
                            dispacher({
                                type: "setState",
                                data: { loading: true }
                            })
                            dispacher({
                                type: "rollback",
                                data: { workshop,loading: false }
                            })
                        }} >Rollback</Button>
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