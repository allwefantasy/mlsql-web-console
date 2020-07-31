import React, { useState, useRef, useEffect } from 'react';
import { Tree, Spin, Menu, Form, Modal, Input } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { WorkshopTablesReducer, WorkshopTablesHandlers, WorkshopTablesActionNames } from './actions/WorkshopTablesReducer';
import { TableOutlined, DeleteOutlined, CloudUploadOutlined, FolderOpenOutlined, ContainerOutlined } from '@ant-design/icons'
import { useContextMenu } from '../../script_console/pages/ContextMenu';
const { TreeNode, DirectoryTree } = Tree;
const { SubMenu } = Menu;

const initState = {
    dbs: {},
    loading: false,
    openTable: undefined,
    confirm: false,
    reloading: undefined,

    exportTo: false,
    exportTable: {
        name: undefined,
        type: undefined
    }

}

const WorkshopTablesContext = React.createContext()

function WorkshopTables(props) {
    const { workshop, reload: externalReload } = props
    const [state, dispacher] = useReducerAsync(WorkshopTablesReducer, initState, WorkshopTablesHandlers)
    const { dbs, loading, openTable, confirm, reloading,
        exportTo, exportTable
    } = state
    const contextMenuRef = useRef()

    const [exportForm] = Form.useForm()

    const onRender = ({ rightClickNodeTreeItem, setRightClickNodeTreeItem, dispacher }) => {
        const { id } = rightClickNodeTreeItem

        return <Menu >
            <Menu.Item icon={<FolderOpenOutlined />} onClick={() => {
                dispacher({
                    type: WorkshopTablesActionNames.OPEN,
                    data: {
                        openTable: id,
                        workshop
                    }
                })
                dispacher({
                    type: "setState",
                    data: {
                        confirm: false
                    }
                })
                setRightClickNodeTreeItem(undefined)
            }} key={1}>Open Table</Menu.Item>

            <SubMenu icon={<ContainerOutlined />} title="Export">
                <Menu.Item icon={<CloudUploadOutlined />} onClick={() => {
                    dispacher({
                        type: "setState",
                        data: {
                            exportTable: {
                                name: id,
                                type: "hive"
                            },
                            exportTo: true,
                            workshop

                        }
                    })
                    setRightClickNodeTreeItem(undefined)
                }} key={1.1}>to Hive</Menu.Item>
                <Menu.Item icon={<CloudUploadOutlined />} onClick={() => {
                    dispacher({
                        type: "setState",
                        data: {
                            exportTable: {
                                name: id,
                                type: "delta"
                            },
                            exportTo: true,

                        }
                    })
                    setRightClickNodeTreeItem(undefined)
                }} key={1.2}>to Delta</Menu.Item>
                <Menu.Item icon={<CloudUploadOutlined />} onClick={() => {
                    dispacher({
                        type: "setState",
                        data: {
                            exportTable: {
                                name: id,
                                type: "file"
                            },
                            exportTo: true,
                        }
                    })
                    setRightClickNodeTreeItem(undefined)
                }} key={1.3}>to FileSystem</Menu.Item>
            </SubMenu>

            <Menu.Item onClick={() => {
                dispacher({
                    type: WorkshopTablesActionNames.DELETE,
                    data: {
                        id
                    }
                })
                setRightClickNodeTreeItem(undefined)
            }} key={2} icon={<DeleteOutlined />}>Delete</Menu.Item>
        </Menu>
    }
    const { onRightClick: popContextMenu, ui: contextMenu } = useContextMenu({ contextMenuRef, dispacher, onRender })

    useEffect(() => {
        dispacher({
            type: "setState",
            data: { loading: true }
        })
        dispacher({
            type: WorkshopTablesActionNames.LOAD,
            data: {
                loading: false
            }
        })
    }, [reloading, externalReload])
    return (
        <WorkshopTablesContext.Provider value={{ dispacher }}>
            <Modal
                title={`Export to ${exportTable.type}`}
                visible={exportTo}
                onCancel={() => {
                    dispacher({
                        type: "setState",
                        data: {
                            exportTo: false
                        }
                    })
                }}
                onOk={() => {
                    const { targetPath } = exportForm.getFieldsValue()
                    exportForm.resetFields()
                    dispacher({
                        type: WorkshopTablesActionNames.EXPORT_TO,
                        data: { exportTo: false, targetPath, workshop }
                    })
                }}
                cancelText="Cancel"
                OkText="Ok">
                <Form form={exportForm}>
                    <Form.Item rules={[
                        {
                            required: true,
                            message: 'Target is required.',
                        },
                    ]}
                        label="Target"
                        name="targetPath">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={`Open Table`}
                visible={confirm}
                onCancel={() => {
                    dispacher({
                        type: "setState",
                        data: {
                            confirm: false
                        }
                    })
                }}
                onOk={() => {
                    dispacher({
                        type: "dispatch",
                        data: { openTable }
                    })
                }}
                cancelText="Cancel"
                OkText="Ok">
                {`Open ${openTable}?`}
            </Modal>
            <Spin tip="Loading..." spinning={loading}>
                {contextMenu()}
                <DirectoryTree onDoubleClick={(evt, node) => {
                    dispacher({
                        type: WorkshopTablesActionNames.OPEN,
                        data: {
                            openTable: node.id,
                            workshop
                        }
                    })
                    dispacher({
                        type: "setState",
                        data: {
                            confirm: false
                        }
                    })
                }} onRightClick={popContextMenu}>
                    {
                        Object.entries(dbs).flatMap(([key, value]) => {
                            return value.map(item => {
                                return <TreeNode icon={<TableOutlined />} id={item} table={item} db={key} title={item} key={item} isLeaf />
                            })
                        })
                    }
                </DirectoryTree>
            </Spin>
        </WorkshopTablesContext.Provider>
    )
}
export { WorkshopTables, WorkshopTablesContext }