import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Form, Tag, Divider, Select, Button, Modal, Input, Switch } from 'antd'
import { useReducerAsync } from 'use-reducer-async'
import { ApplySaveRollbackReducer, ApplySaveRollbackHandlers } from './actions/ApplySaveRollbackReducer.js';
import AlertBox from '../AlertBox.js';


const initState = {
    saveDiagram: false,
    saveTablePersisted: false,
    loading: false,
    saveTableName: undefined,
    error: undefined
}

const ApplySaveRollbackContext = React.createContext()

function ApplySaveRollback(props) {
    //dispacher parent 
    const workshop = props.workshop
    const { dispacher: parentDispacher } = useContext(props.context)
    const [state, dispacher] = useReducerAsync(ApplySaveRollbackReducer, initState, ApplySaveRollbackHandlers)
    const { saveDiagram, saveTablePersisted, loading,error } = state
    return (
        <ApplySaveRollbackContext.Provider value={{ dispacher }}>
            {
                error && <AlertBox message={error}></AlertBox>
            }
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
                            saveDiagram: false,
                            workshop
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
                            data: { saveTableName: value.target.value }
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
                        type: "setState",
                        data: { applySaveRollbackDispacher: dispacher }
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