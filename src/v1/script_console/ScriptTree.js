import React, { useRef, useCallback, useEffect } from 'react';
import { Tree, Modal, Menu, Form, Input } from 'antd';
import { useReducerAsync } from 'use-reducer-async'
import { DownOutlined, FileOutlined, FolderOutlined, DeleteOutlined, FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { ScriptTreeReducer, ScriptTreeHandlers, ScriptTreeActionNames } from './actions/ScriptTreeReducer';
import { ActionProxy } from '../../backend_service/ActionProxy';
import RemoteAction from '../../backend_service/RemoteAction';
import MLSQLTreeNodeBuilder from '../../service/MLSQLTreeBuilder';
import SpinBox from '../SpinBox'
import { useContextMenuCallback, useContextMenu } from './pages/ContextMenu';
import Tools from '../../common/Tools';
import AlertBox from '../AlertBox'

const { DirectoryTree } = Tree


const initState = {
    nodes: [],
    error: undefined,
    createFileError: undefined,
    createType: undefined,
    createTitle: undefined,
    operateModal: false,
    reloading: undefined,
    loading: true,
    expandedKeys: []

}

const ScriptTreeContext = React.createContext()

function ScriptTree(props) {
    const { consoleApp } = props
    const [state, dispacher] = useReducerAsync(ScriptTreeReducer, initState, ScriptTreeHandlers)
    const { loading,
        nodes,
        error, createFileError,
        createType,
        operateModal,
        createTitle,
        reloading,
        expandedKeys
    } = state
    const client = new ActionProxy()
    const contextMenuRef = useRef()
    const [form] = Form.useForm()

    useEffect(() => {
        const getList = async () => {
            const res = await client.get(RemoteAction.SCRIPT_FILE_LIST, {})
            if (res.status !== 200) {
                return
            }

            const builder = new MLSQLTreeNodeBuilder()
            const treeRes = builder.build(res.content).sort((a, b) => {
                return a.id - b.id
            })


            const treeData = treeRes.map(item => {
                return builder.convert(item)
            })

            Tools.visitDown(treeData[0], (item) => {
                if (item.isExpanded) {
                    expandedKeys.push(item.id)
                }
            })

            dispacher({
                type: "setState",
                data: {
                    nodes: treeData,
                    loading: false,
                    expandedKeys
                }
            })
        }
        getList()
    }, [reloading])

    const onRender = ({rightClickNodeTreeItem, setRightClickNodeTreeItem, dispacher}) => {
        const { id } = rightClickNodeTreeItem
        let target = undefined

        Tools.visitDown(nodes[0], (item) => {
            if (item.id === id) {
                target = item
            }
        })
        if (id === nodes[0].id) {
            return <Menu >
                <Menu.Item icon={<FolderAddOutlined />} onClick={
                    () => {
                        dispacher({
                            type: "setState",
                            data: {
                                node: target,
                                createType: "folder",
                                createTitle: "Create Project",
                                operateModal: true
                            }
                        })
                    }
                }>Create Project</Menu.Item>
            </Menu>
        }

        if (!target.isDir) {
            return <Menu >
                <Menu.Item onClick={() => {                    
                    dispacher({
                        type: ScriptTreeActionNames.deleteScriptFile,
                        data: {
                            node: target
                        }
                    })
                    setRightClickNodeTreeItem(undefined)
                }} key={1}>Delete</Menu.Item>
            </Menu>
        }

        return <Menu >
            <Menu.Item icon={<FileAddOutlined />} onClick={() => {
                dispacher({
                    type: "setState",
                    data: {
                        node: target,
                        createType: "file",
                        createTitle: "Create File",
                        operateModal: true
                    }
                })
                setRightClickNodeTreeItem(undefined)
            }} key={1}>Create Script</Menu.Item>
            <Menu.Item icon={<FolderAddOutlined />} onClick={() => {
                dispacher({
                    type: "setState",
                    data: {
                        node: target,
                        createType: "folder",
                        createTitle: "Create Folder",
                        operateModal: true
                    }
                })
                setRightClickNodeTreeItem(undefined)
            }} key={2}>Create Folder</Menu.Item>
            <Menu.Item icon={<DeleteOutlined />} onClick={() => {
                dispacher({
                    type: ScriptTreeActionNames.deleteScriptFile,
                    data: {
                        node: target,
                    }
                })
                setRightClickNodeTreeItem(undefined)
            }} key={3}>Delete</Menu.Item>
        </Menu>
    }
    const { onRightClick: popContextMenu, ui: contextMenu } = useContextMenu({ contextMenuRef, dispacher, onRender })


    return (
        <ScriptTreeContext.Provider value={{ dispacher }}>
            {contextMenu()}
            <Modal
                title={createTitle}
                visible={operateModal}
                onCancel={() => {
                    dispacher({
                        type: "setState",
                        data: { operateModal: false }
                    })
                }}
                onOk={() => {
                    dispacher({
                        type: ScriptTreeActionNames.createScriptFile,
                        data: {
                            operateModal: false,
                            consoleApp, createType,
                            form
                        }
                    })
                }}
                cancelText="Cancel"
                OkText="Ok"
            >
                {
                    createFileError && <AlertBox message={createFileError}></AlertBox>
                }
                <Form form={form}>
                    <Form.Item name="fileName" label="File Name">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            {error && <AlertBox message={error}></AlertBox>}
            {loading && <SpinBox></SpinBox>}
            {!loading &&
                <DirectoryTree
                    onExpand={(expandedKeys) => {                        
                        dispacher({
                            type: ScriptTreeActionNames.expand,
                            data: { expandedKeys }
                        })
                    }}
                    autoExpandParent={true}
                    expandedKeys={
                        expandedKeys
                    }
                    onDoubleClick={(evt, node) => {
                        dispacher({
                            type: ScriptTreeActionNames.openScriptFile,
                            data: { consoleApp, node }
                        })
                    }}
                    expandAction="click"
                    onRightClick={popContextMenu}
                    switcherIcon={<DownOutlined />}
                    treeData={nodes}></DirectoryTree>}
        </ScriptTreeContext.Provider>
    )
}
export { ScriptTree, ScriptTreeContext }