import React, { useContext} from 'react';
import { WindowStationContext } from '../WindowStation';
import useSelectFields from '../../common/pages/SelectFieldsToOperate';
import {Form,Button,Select,Divider} from 'antd';
import { WindowStationActionNames } from '../actions/WindowStationReducer';

function SetupGroupRowOrder(props) {
    const {dispacher} = useContext(WindowStationContext)  
    const {ui,operateFields,setError,form} = useSelectFields({
        workshop:props.workshop,
        fieldWrapper:(item)=>{return <Form.Item initialValue={"desc"} key={item.field} label={item.field} name={item.field}>
        <Select>
            <Select.Option value="desc">desc</Select.Option>
            <Select.Option value="asc">asc</Select.Option>
        </Select>
    </Form.Item>}
    })    
    return (
        ui([<Form.Item>
            <Button type="primary" onClick={
                ()=>{                     
                    const orderFieldsObj = form.getFieldValue() 
                    const orderFields = operateFields.map(item=>{
                        return {field:item.field, value:orderFieldsObj[item.field]}
                    })                   
                    dispacher({
                        type: WindowStationActionNames.buildOrder,
                        data: {orderFields:orderFields}
                    })                    
                }
            }>
                Next
            </Button>
            <Divider type="vertical"/>
            <Button  onClick={
                ()=>{   
                                                         
                    dispacher({
                        type: "setState",
                        data: {current:0}
                    })                    
                }
            }>
                Previous
            </Button>
        </Form.Item>])
    )
}
export {SetupGroupRowOrder}