import React, { useState, useCallback, useEffect, useContext } from 'react';
import useSelectFields from '../../common/pages/SelectFieldsToOperate';
import {Form,Button, Divider} from 'antd';
import { WindowStationContext } from '../WindowStation';
import { WindowStationActionNames } from '../actions/WindowStationReducer';


function BuildGroup(props) {  
    const {dispacher} = useContext(WindowStationContext)  
    const {ui,operateFields,setError} = useSelectFields({
        workshop:props.workshop,
        fieldWrapper:(item)=>{return <></>}
    })    
    return (
        ui([<Form.Item key={"button"}>
            <Button type="primary" onClick={
                ()=>{   
                    if(operateFields.length===0){
                        setError("Fields are required.")
                        return 
                    }                 
                    dispacher({
                        type: WindowStationActionNames.buildGroup,
                        data: {groupFields:operateFields}
                    })                    
                }
            }>
                Next
            </Button>
        </Form.Item>])
    )
}
export {BuildGroup}