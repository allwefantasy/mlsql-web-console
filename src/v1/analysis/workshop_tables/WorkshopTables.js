import React, { useState, useRef, useEffect } from 'react';
import { Tree, Spin, Menu, Icon, Modal } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { WorkshopTablesReducer, WorkshopTablesHandlers, WorkshopTablesActionNames } from './actions/WorkshopTablesReducer';
import { TableOutlined, DeleteOutlined ,FolderOpenOutlined} from '@ant-design/icons'
import { useContextMenu } from '../../script_console/pages/ContextMenu';
const { TreeNode, DirectoryTree } = Tree;

const initState = {
    dbs: {},
    loading: false,
    openTable: undefined,
    confirm: false,
    reloading: undefined
}

const WorkshopTablesContext = React.createContext()

function WorkshopTables(props) {
    const {workshop,reload:externalReload} = props
    const [state, dispacher] = useReducerAsync(WorkshopTablesReducer, initState, WorkshopTablesHandlers)
    const { dbs, loading ,openTable,confirm,reloading} = state
    const contextMenuRef = useRef()

    const onRender = ({ rightClickNodeTreeItem, setRightClickNodeTreeItem, dispacher }) => {
        const { id } = rightClickNodeTreeItem
             
        return <Menu >
            <Menu.Item icon={<FolderOpenOutlined />} onClick={() => {
                dispacher({
                    type: WorkshopTablesActionNames.OPEN,
                    data: {
                        openTable:id,
                        workshop                        
                    }
                })
                dispacher({
                    type: "setState",
                    data: {
                        confirm:false
                    }
                })
                setRightClickNodeTreeItem(undefined)
            }} key={1}>Open Table</Menu.Item>
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
    }, [reloading,externalReload])
    return (
        <WorkshopTablesContext.Provider value={{ dispacher }}>
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
                        data: {openTable}
                    })
                }}
                cancelText="Cancel"
                OkText="Ok">
                {`Open ${openTable}?`}
            </Modal>
            <Spin tip="Loading..." spinning={loading}>
                {contextMenu()}
                <DirectoryTree onDoubleClick={(evt,node)=>{
                    dispacher({
                        type: WorkshopTablesActionNames.OPEN,
                        data: {
                            openTable:node.id,
                            workshop                        
                        }
                    })
                    dispacher({
                        type: "setState",
                        data: {
                            confirm:false
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