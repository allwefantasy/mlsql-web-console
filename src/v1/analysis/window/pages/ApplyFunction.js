import React, { useState, useCallback, useEffect, useContext } from 'react';
import { WindowStationContext } from '../WindowStation';
import { ApplyFunc, useFieldTransform } from '../../common/pages/ApplyFunc';
import { Form, Button } from 'antd';
import { WindowStationActionNames } from '../actions/WindowStationReducer';


function ApplyFunction(props) {
    const { workshop } = props
    const { dispacher } = useContext(WindowStationContext)
    const { ui, form, getTransform,setError} = useFieldTransform({
        operateField: ""
    })
    const [loading,setLoading] = useState(false)
    return <>
        {
            ui([
                <Form.Item>
                    <Button type="primary" loading={loading} onClick={
                        () => {
                            const { field, isAgg, transformCode, columnName } = getTransform()
                            if(!columnName){
                                setError("New Field Name is required.")
                                return 
                            }
                            setLoading(true)
                            dispacher({
                                type: WindowStationActionNames.apply,
                                data: {setLoading,workshop,functions:[{ field, isAgg, transformCode, columnName }]}
                            })
                        }
                    }>
                        Apply
                </Button>
                </Form.Item>
            ])
        }
    </>
}
export { ApplyFunction }