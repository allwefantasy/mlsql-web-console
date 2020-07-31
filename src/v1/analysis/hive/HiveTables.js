import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Tree, Spin, Menu, Input, Modal } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { HiveTablesReducer, HiveTablesHandlers, HiveTablesActionNames } from './actions/HiveTablesReducer';
import { TableOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useContextMenu } from '../../script_console/pages/ContextMenu';
import AnalysisWorkshop from '../workshop';
import Tools from '../../../common/Tools';
const { TreeNode, DirectoryTree } = Tree;

const initState = {
    dbs: [],
    loading: false,
    openTable: undefined,
    confirm: false,
    reloading: undefined,
    expandedKeys:[]
}

const HiveTablesContext = React.createContext()

function HiveTables(props) {
    const workshop = AnalysisWorkshop.workshop
    const { reload: externalReload } = props
    const [state, dispacher] = useReducerAsync(HiveTablesReducer, initState, HiveTablesHandlers)
    const { dbs, loading, openTable, confirm, reloading ,
        search_dbs,expandedKeys
    } = state
    const contextMenuRef = useRef()

    const onRender = ({ rightClickNodeTreeItem, setRightClickNodeTreeItem, dispacher }) => {
        const { id } = rightClickNodeTreeItem

        return <Menu >
            <Menu.Item icon={<FolderOpenOutlined />} onClick={() => {
                dispacher({
                    type: HiveTablesActionNames.OPEN,
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
        </Menu>
    }
    const { onRightClick: popContextMenu, ui: contextMenu } = useContextMenu({ contextMenuRef, dispacher, onRender })

    useEffect(() => {
        dispacher({
            type: "setState",
            data: { loading: true }
        })
        dispacher({
            type: HiveTablesActionNames.LOAD,
            data: {
                loading: false
            }
        })
    }, [reloading, externalReload])

    return (
        <HiveTablesContext.Provider value={{ dispacher }}>
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
                        data: {
                            openTable: openTable,
                            workshop
                        }
                    })
                }}
                cancelText="Cancel"
                OkText="Ok">
                {`Open ${openTable}?`}
            </Modal>
            <Spin tip="Loading..." spinning={loading}>
                {contextMenu()}
                <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={
                    (e) => {
                        dispacher({
                            type: HiveTablesActionNames.SEARCH,
                            data: { searchValue: e.target.value }
                        })
                    }
                } />
                <DirectoryTree                 
                expandedKeys = {expandedKeys}                
                treeData={search_dbs || dbs} 
                loadData={
                    async (node) => {
                        dispacher({
                            type: "setState",
                            data: { loading: true }
                        })
                        dispacher({
                            type: HiveTablesActionNames.LOAD,
                            data: { dbName: node.key, node, loading: false }
                        })
                    }
                } expandAction="click" onExpand={(expandedKeys)=>{
                    dispacher({                        
                        type:"setState",
                        data: {expandedKeys}
                    })
                }} onDoubleClick={(evt, node) => {
                    if (!node.isLeaf) {
                        return
                    }
                    dispacher({
                        type: HiveTablesActionNames.OPEN,
                        data: {
                            openTable: node.key,
                            workshop
                        }
                    })
                    dispacher({
                        type: "setState",
                        data: {
                            confirm: false
                        }
                    })
                }} onRightClick={({event,node}) => {                    
                    if (node.isLeaf) {
                        popContextMenu({event,node})
                    }
                }}>
                </DirectoryTree>
            </Spin>
        </HiveTablesContext.Provider>
    )
}
export { HiveTables, HiveTablesContext }