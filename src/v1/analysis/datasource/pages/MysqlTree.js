import React, {  useRef, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { MysqlTreeReducer, MysqlTreeHandlers, MysqlTreeActionNames } from '../actions/MysqlTreeReducer';
import { useContextMenu } from '../../../script_console/pages/ContextMenu';
import { Menu,Spin,Tree,Modal } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import RemoteAction from '../../../../backend_service/RemoteAction';
import { FolderOpenOutlined, TableOutlined } from '@ant-design/icons';
import { useMySQLPartition } from './useMySQLPartition';
import AnalysisWorkshop from '../../workshop';
import { FormattedMessage } from 'react-intl';

const {DirectoryTree} = Tree
const initState = {
    dbs: [],    
    loading:false,
    confirm:false,
    openTable: undefined,
    error: undefined     
}

const MysqlTreeContext = React.createContext()

function MysqlTree() {
    const workshop = AnalysisWorkshop.workshop
    const [state, dispacher] = useReducerAsync(MysqlTreeReducer, initState, MysqlTreeHandlers)
    const {dbs,loading,confirm,openTable,error} = state

    const {ui:PartitionUI,form:partitionForm,setOpenTable,setError:setPartitionError,partitionNumValue} = useMySQLPartition()

    const contextMenuRef = useRef()

    const onRender = ({ rightClickNodeTreeItem, setRightClickNodeTreeItem, dispacher }) => {
        const { id } = rightClickNodeTreeItem        
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
        const fetch = async () => {
            dispacher({
                type: "setState",
                data: { loading: true }
            })
            const proxy = new ActionProxy()
            const res = await proxy.get(RemoteAction.DS_MYSQL_DBS, {})
            if (res.status === 200) {
                const treeData = res.content.data.map(item=>{
                    item.key = item.name
                    item.title = item.name
                    item.isLeaf = false
                    item.children = item.tables.map(table=>{
                        return {
                            id: `${item.name}.${table.name}`,
                            key: `${item.name}.${table.name}`,
                            title: table.name + (!table.options.indexer?"":"(已被索引)"),
                            isLeaf: true,
                            icon: <TableOutlined/>
                        }
                    })
                    return item
                })
                dispacher({
                    type: "setState",
                    data: { dbs: treeData}
                })                
            }

            dispacher({ 
                type: "setState",               
                data: { loading:false}
            }) 
        }
        fetch()
    }, [])

    useEffect(()=>{
        setOpenTable(openTable)
    },[openTable,setOpenTable])
   

    return (
        <div className="leftview-box">
        <MysqlTreeContext.Provider value={{ dispacher }}> 
        <Modal
                title={<FormattedMessage id="mysql_parallel" />}
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
                    const {partitionColumn,lowerBound,upperBound} = partitionValues
                    if(partitionColumn){
                        if(!lowerBound || !upperBound && partitionNumValue){
                            setPartitionError("lowerBound/upperBound/partitionNumValue should not be empty.")
                            return
                        }
                    }
                    
                    dispacher({
                        type: MysqlTreeActionNames.OPEN,
                        data: {
                            openTable,
                            workshop,
                            partitionValues,
                            partitionNumValue                            
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
                <PartitionUI />
            </Modal>           
           <Spin tip="Loading..." spinning={loading}>
                {contextMenu()}                
                <DirectoryTree height={700}                   
                    treeData={dbs}
                    expandAction="click" 
                    onDoubleClick={(evt, node) => {
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
        </MysqlTreeContext.Provider>
        </div>
    )
}
export { MysqlTree, MysqlTreeContext }