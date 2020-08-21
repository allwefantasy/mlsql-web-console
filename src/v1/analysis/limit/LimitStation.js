import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { LimitStationReducer, LimitStationHandlers } from './actions/LimitStationReducer';
import AlertBox from '../../AlertBox';
import { Form, Tag, Divider, Select, Button,Modal,Input,Switch } from 'antd'
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback';


const initState = {
    limitSize: undefined,
    error: undefined,
    //为了回调applySaveRollback组件  
    applySaveRollbackDispacher: undefined
}

const LimitStationContext = React.createContext()

function LimitStation(props) {
    const workshop = props.parent.workshop
    const [state, dispacher] = useReducerAsync(LimitStationReducer, initState, LimitStationHandlers)
    const { limitSize, error, applySaveRollbackDispacher } = state
    const [form] = Form.useForm()

    useEffect(()=>{
        if(applySaveRollbackDispacher){
            form.submit()
        }       
    },[applySaveRollbackDispacher])

    return (
        <LimitStationContext.Provider value={{ dispacher }}>
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
                        <ApplySaveRollback context={LimitStationContext} workshop={workshop} />
                    </Form.Item>
                    <Form.Item name="limitSize">
                        <Input/>
                    </Form.Item>
                </Form>
            </div>

        </LimitStationContext.Provider>
    )
}
export { LimitStation, LimitStationContext }