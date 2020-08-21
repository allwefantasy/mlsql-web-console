import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Tree, Spin, Menu, Input, Modal } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { HiveTablesReducer, HiveTablesHandlers, HiveTablesActionNames } from './actions/HiveTablesReducer';
import { TableOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useContextMenu } from '../../script_console/pages/ContextMenu';
import AnalysisWorkshop from '../workshop';
import { FormattedMessage } from 'react-intl';
import { usePartitionSelect } from './pages/usePartitionSelect';
const { TreeNode, DirectoryTree } = Tree;

const initState = {
    dbs: [],
    loading: false,
    openTable: undefined,
    confirm: false,
    reloading: undefined,
    expandedKeys: []
}

const HiveTablesContext = React.createContext()

function HiveTables(props) {
    const workshop = AnalysisWorkshop.workshop
    const { reload: externalReload } = props
    const [state, dispacher] = useReducerAsync(HiveTablesReducer, initState, HiveTablesHandlers)
    const { dbs, loading, openTable, confirm, reloading,
        search_dbs, expandedKeys
    } = state

    const { ui: PartitionSelect,
        form: partitionForm,
        setOpenTable: setOpenTableForPartition,
        setError: setPartitionError,
        partitionColumn,noPartition
    } = usePartitionSelect()
    const contextMenuRef = useRef()

    const onRender = ({ rightClickNodeTreeItem, setRightClickNodeTreeItem, dispacher }) => {
        const { id } = rightClickNodeTreeItem
        console.log(id)
        return <Menu >
            <Menu.Item icon={<FolderOpenOutlined />} onClick={() => {
                dispacher({
                    type: "setState",
                    data: {
                        confirm: true,
                        openTable: id
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

    useEffect(() => {
        setOpenTableForPartition(openTable)
    }, [setOpenTableForPartition, openTable])

    return (
        <HiveTablesContext.Provider value={{ dispacher }}>
            <Modal
                title={<FormattedMessage id="analysis_range" />}
                visible={confirm}
                onCancel={() => {
                    dispacher({
                        type: "setState",
                        data: {
                            confirm: false
                        }
                    })
                    partitionForm.resetFields()
                }}
                onOk={() => {
                    const partitionValues = partitionForm.getFieldsValue()
                    if (!noPartition && !partitionValues.tableRandom && !(partitionValues.tableStart && partitionValues.tableEnd)) {
                        setPartitionError("Partitions is required.")
                        return
                    }
                    dispacher({
                        type: HiveTablesActionNames.OPEN,
                        data: {
                            openTable,
                            workshop,
                            partitionValues,
                            partitionColumn
                        }
                    })
                    dispacher({
                        type: "setState",
                        data: {
                            confirm: false
                        }
                    })
                    partitionForm.resetFields()
                }}
                cancelText="Cancel"
                OkText="Ok">
                <PartitionSelect />
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
                <DirectoryTree height={700}
                    expandedKeys={expandedKeys}
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
                    } expandAction="click" onExpand={(expandedKeys) => {
                        dispacher({
                            type: "setState",
                            data: { expandedKeys }
                        })
                    }} onDoubleClick={(evt, node) => {
                        if (!node.isLeaf) {
                            return
                        }
                        dispacher({
                            type: "setState",
                            data: {
                                confirm: true,
                                openTable: node.key
                            }
                        })
                    }} onRightClick={({ event, node }) => {
                        if (node.isLeaf) {
                            popContextMenu({ event, node })
                        }
                    }}>
                </DirectoryTree>
            </Spin>
        </HiveTablesContext.Provider>
    )
}
export { HiveTables, HiveTablesContext }