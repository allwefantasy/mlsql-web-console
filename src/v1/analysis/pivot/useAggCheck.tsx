import React, { useState, useEffect, useContext } from 'react'
import { List, Form, Input, Checkbox } from 'antd'
import {PivotStationContext} from './PivotStation'

interface Props {
}

const aggList = [`avg`, `max`, `min`, `sum`, `count`]
const CheckboxGroup = Checkbox.Group

export const useAggCheck = () => {
    
    const [form] = Form.useForm()
    
    const ui = ()=>{
        return <>
            <Form form={form}>
                <Form.Item name="aggs">
                <CheckboxGroup
                            options={aggList}                                                        
                        /> 
                </Form.Item>
            </Form>
        </>
    }
    return {ui,form}
}