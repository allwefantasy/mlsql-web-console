import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Form, Tag, Divider, Select, Button,Modal,Input,Switch } from 'antd'
import { useReducerAsync } from 'use-reducer-async'
import { ApplySaveRollbackReducer, ApplySaveRollbackHandlers } from './actions/ApplySaveRollbackReducer.js';


const initState = {
    saveDiagram: false,
    saveTablePersisted: false,
    loading: false
}

const ApplySaveRollbackContext = React.createContext()

function ApplySaveRollback(props) {
    //dispacher parent 
    const workshop = props.parent.workshop
    const { dispacher: parentDispacher } = useContext(props.dispacher)
    const [state, dispacher] = useReducerAsync(ApplySaveRollbackReducer, initState, ApplySaveRollbackHandlers)
    const [saveDiagram, saveTablePersisted, loading] = state
    return (
        <ApplySaveRollbackContext.Provider value={{ dispacher }}>
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
            <Button loading={loading} type="primary" onClick={
                () => {
                    dispacher({
                        type: "setState",
                        data: {
                            loading: true
                        }
                    })
                    parentDispacher({
                        type:"apply",
                        data:{dispacher}
                    })
                }
            } >Apply</Button>
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
                    data: { workshop, loading: false }
                })
            }} >Rollback</Button>
        </ApplySaveRollbackContext.Provider>
    )
}
export { ApplySaveRollback, ApplySaveRollbackContext }