import React, { useState, useCallback, useEffect, useContext } from 'react';
import { WindowStationContext } from '../WindowStation';
import { ApplyFunc, useFieldTransform } from '../../common/pages/ApplyFunc';
import { Form, Button, Collapse, Divider,List,Typography } from 'antd';
import { WindowStationActionNames } from '../actions/WindowStationReducer';
const { Panel } = Collapse;


function ApplyFunction(props) {
    const { workshop } = props
    const { dispacher } = useContext(WindowStationContext)
    const { ui, form, getTransform, setError } = useFieldTransform({
        operateField: ""
    })
    const [loading, setLoading] = useState(false)    
    const [funcs, setFuncs] = useState([])

    return <>        
        {
            ui([
                <Form.Item>
                    <Button type="primary" loading={loading} onClick={
                        () => {
                            let functions = []  
                            if(funcs.length === 0){
                                const { field, isAgg, transformCode, columnName } = getTransform()
                                functions.push({ field, isAgg, transformCode, columnName })                            
                                if (!columnName) {
                                    setError("New Field Name is required.")
                                    return
                                }
                            } else {
                                functions = funcs
                            }                                                      
                            setLoading(true)
                            dispacher({
                                type: WindowStationActionNames.apply,
                                data: {
                                    setLoading,
                                    workshop,
                                    functions
                                }
                            })
                        }
                    }>
                        Apply
                </Button><Divider type="vertical"/> 
                <Button loading={loading} onClick={
                        () => {
                            const { field, isAgg, transformCode, columnName } = getTransform()
                            if (!columnName) {
                                setError("New Field Name is required.")
                                return
                            }
                            setFuncs(funcs.concat([{ field, isAgg, transformCode, columnName }]))
                            form.resetFields()
                        }
                    }>
                        Add
                </Button><Divider type="vertical"/>
            <Button  onClick={
                ()=>{   
                                                         
                    dispacher({
                        type: "setState",
                        data: {current:2}
                    })                    
                }
            }>
                Previous
            </Button>
                </Form.Item>
            ])
        }
        {
            funcs.length >0 &&  <List style={{width:"500px"}}
            header={<div>Added Functions</div>}            
            bordered
            dataSource={funcs.map(item=>`${item.transformCode} as ${item.columnName}`)}
            renderItem={item => (
              <List.Item>
                <Typography.Text mark>Func</Typography.Text> {item}
              </List.Item>
            )}
          />
        }
    </>
}
export { ApplyFunction }