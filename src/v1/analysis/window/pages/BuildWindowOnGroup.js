import React, { useState, useCallback, useEffect, useContext } from 'react';
import useSelectFields from '../../common/pages/SelectFieldsToOperate';
import { Form, Button, Divider, Input } from 'antd';
import { WindowStationContext } from '../WindowStation';
import { WindowStationActionNames } from '../actions/WindowStationReducer';


function BuildWindowOnGroup(props) {
    const { dispacher } = useContext(WindowStationContext)
    const { ui, operateFields, setError, form } = useSelectFields({
        workshop: props.workshop,
        fieldWrapper: (item) => {
            switch (item.field) {
                case "row window":
                    return <>
                        <Form.Item label="Preceding" name="preceding">
                            <Input placeholder={"number"} />
                        </Form.Item>
                        <Form.Item label="Following" name="following">
                            <Input placeholder={"number"} />
                        </Form.Item>
                    </>
                case "range window":
                    return <>
                        <Form.Item label="Preceding" name="preceding">
                            <Input placeholder={"number"} />
                        </Form.Item>
                        <Form.Item label="Following" name="following">
                            <Input placeholder={"number"} />
                        </Form.Item>
                    </>
            }
        },
        selectFields: [{ name: "row window" }, { name: "range window" }],
        selectFieldsLabel: "Window Type", selectFieldsMode: "single"
    })
    return (
        ui([<Form.Item>
            <Button type="primary" onClick={
                () => {
                    const { selectFieldsName } = form.getFieldValue()
                    const rowWindows = { ...form.getFieldValue(), windowType: selectFieldsName }                
                    dispacher({
                        type: WindowStationActionNames.buildRowWindows,
                        data: { rowWindows }
                    })
                }
            }>
                Next
            </Button><Divider type="vertical"/>
            <Button  onClick={
                ()=>{   
                                                         
                    dispacher({
                        type: "setState",
                        data: {current:1}
                    })                    
                }
            }>
                Previous
            </Button>
        </Form.Item>])
    )
}
export { BuildWindowOnGroup }