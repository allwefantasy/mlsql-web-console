import React, { useState, useRef, useEffect } from 'react';
import { Tree, Spin, Menu, Icon, Modal } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { HiveTablesReducer, HiveTablesHandlers, HiveTablesActionNames } from './actions/HiveTablesReducer';
import { TableOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useContextMenu } from '../../script_console/pages/ContextMenu';
import AnalysisWorkshop from '../workshop';
const { TreeNode, DirectoryTree } = Tree;

const initState = {
    dbs: [],
    tables: [],
    loading: false,
    openTable: undefined,
    confirm: false,
    reloading: undefined,    
}

const HiveTablesContext = React.createContext()

function HiveTables(props) {
    const workshop = AnalysisWorkshop.workshop
    const { reload: externalReload } = props
    const [state, dispacher] = useReducerAsync(HiveTablesReducer, initState, HiveTablesHandlers)
    const { dbs, tables, loading, openTable, confirm, reloading } = state
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

    const renderTreeNodes = data =>{
        return data.map(item=>{
          if(item.children){
            return <TreeNode title={item.title} id={item.key} key={item.key} isLeaf={item.isLeaf}  dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          }
          return <TreeNode title={item.title} id={item.key} key={item.key} isLeaf={item.isLeaf} dataRef={item} />;
        })
      }

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
                <DirectoryTree loadData={
                    async (node) => {
                        console.log(node)
                        dispacher({
                            type: HiveTablesActionNames.LOAD,
                            data: { dbName: node.key, node }
                        })
                    }
                } expandAction="click" onDoubleClick={(evt, node) => {
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
                }} onRightClick={popContextMenu}>
                    {
                        renderTreeNodes(dbs)
                    }
                </DirectoryTree>
            </Spin>
        </HiveTablesContext.Provider>
    )
}
export { HiveTables, HiveTablesContext }