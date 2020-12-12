import React, {useState, useCallback, useEffect} from 'react';
import {Button, Card, Form, Input, Modal, Select, Spin, Switch, Tooltip, Tree} from "antd";
import {FormattedMessage} from "react-intl";
import AlertBox from "../../AlertBox";
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";
import {TableOutlined} from "@ant-design/icons";
import {MysqlTreeActionNames} from "../../analysis/datasource/actions/MysqlTreeReducer";
import {useMySQLPartition} from "../../analysis/datasource/pages/useMySQLPartition";

const {DirectoryTree} = Tree

interface TreeItem {
    name: string;
    title: string;
    isLeaf: boolean;
    tables: Array<TreeItem>;

    children: Array<object>;
    key: string;
    id: string;
}

interface TablePartition {
    partitionColumn: string;
    lowerBound: number;
    upperBound: number;
    partitionNumValue: number;
    dbName: string;
    tableName: string;
}

interface Engine {
    name: string;
}

export function CreateIndexer() {
    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
    };
    const [form] = Form.useForm()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [dbs, setDbs] = useState<Array<any>>([])
    const [table, setTable] = useState<{ dbName: string, tableName: string } | null>(null)
    const [tp, setTp] = useState<TablePartition | null>(null)
    const [engines, setEngines] = useState<Array<Engine>>([])
    const {ui: PartitionUI, form: partitionForm, setOpenTable, setError: setPartitionError, partitionNumValue} = useMySQLPartition()
    const [enableSyncInterval, setEnableSyncInterval] = useState<boolean>(false)

    const fetch = async () => {
        const proxy = new ActionProxy()
        const res = await proxy.get(RemoteAction.DS_MYSQL_DBS, {})
        const treeData = res.content.data.map((item: TreeItem) => {
            item.key = item.name
            item.title = item.name
            item.isLeaf = false
            item.children = item.tables.map(table => {
                return {
                    id: `${item.name}.${table.name}`,
                    key: `${item.name}.${table.name}`,
                    title: table.name,
                    isLeaf: true,
                    icon: <TableOutlined/>
                }
            })
            return item
        })
        const engineResp = await proxy.get(RemoteAction.ENGINE_LIST, {})
        if (engineResp.status == 200) {
            const items = engineResp.content.data as Array<Engine>
            setEngines(items)
        }
        setDbs(treeData)
    }
    useEffect(() => {
        fetch()
    }, [])

    const submit = async () => {
        setSuccess("")
        setError("")
        const proxy = new ActionProxy()
        const params = form.getFieldsValue()
        if (!params["idCols"]) {
            setError("idCols is required")
            return
        }
        const newparams = Object.assign(params, tp)
        const res = await proxy.post(RemoteAction.MYSQL_INDEXER_CREATE, newparams)
        if (res.status === 200) {
            setSuccess("success")
        } else {
            setError(res.content)
        }
    }


    return <>
        <div className="common-margin common-child-center" {...formItemLayout}>
            <Card title={<FormattedMessage id={"create_indexer"}/>} style={{width: "70%"}}>
                <Form form={form}>
                    <Modal
                        title={<FormattedMessage id="mysql_parallel"/>}
                        visible={confirm}
                        onCancel={() => {
                            partitionForm.resetFields()
                            setConfirm(false)
                        }}
                        onOk={() => {
                            const partitionValues = partitionForm.getFieldsValue()
                            const {partitionColumn, lowerBound, upperBound} = partitionValues
                            if (partitionColumn) {
                                if (!lowerBound || !upperBound && partitionNumValue) {
                                    setPartitionError("lowerBound/upperBound/partitionNumValue should not be empty.")
                                    return
                                }
                            }

                            setTp({
                                partitionColumn,
                                lowerBound,
                                upperBound,
                                partitionNumValue,
                                dbName: table?.dbName || "",
                                tableName: table?.tableName || ""
                            })

                            partitionForm.resetFields()
                            setConfirm(false)
                        }}
                        cancelText="Cancel"
                        okText="Ok">
                        <PartitionUI/>
                    </Modal>
                    {error && <AlertBox message={<FormattedMessage id={error}/>}/>}
                    {success && <AlertBox title={<FormattedMessage id="congratulation"/>} type="success"
                                          message={<FormattedMessage id={success}/>}/>}
                    <Form.Item name={"_name"}>
                        <Spin tip="Loading..." spinning={loading}>
                            <DirectoryTree height={700}
                                           treeData={dbs}
                                           expandAction="click"
                                           onDoubleClick={(evt, node) => {
                                               if (!node.isLeaf) {
                                                   return
                                               }
                                               const [dbName, tableName] = (node.key as string).split(".")
                                               setTable({dbName, tableName})
                                               setOpenTable(node.key as string)
                                               setConfirm(true)
                                           }} onRightClick={({event, node}) => {
                            }}>
                            </DirectoryTree>
                        </Spin>
                    </Form.Item>
                    <Form.Item name={"name"} label={<FormattedMessage id="数据库表"/>}>
                        <span>{table ? table.dbName + "." + table.tableName : "未选择"}</span>
                    </Form.Item>

                    <Form.Item name={"indexerType"} label={<FormattedMessage id="索引类型"/>}>
                        <Select onChange={(value, option) => {
                            if (value === "parquet") {
                                setEnableSyncInterval(true)
                            }
                            if (value === "mysql") {
                                setEnableSyncInterval(false)
                            }
                        }}>
                            <Select.Option value={"mysql"}>实时</Select.Option>
                            <Select.Option value={"parquet"}>定时</Select.Option>
                        </Select>
                    </Form.Item>

                    {
                        enableSyncInterval ?
                            <Form.Item name={"syncInterval"} label={<FormattedMessage id="同步周期(小时)"/>}>
                                <Input/>
                            </Form.Item> : <></>
                    }

                    <Form.Item name={"idCols"} label={<FormattedMessage id="标识唯一组合键"/>}>
                        <Input/>
                    </Form.Item>

                    <Form.Item name={"engineName"} label={<FormattedMessage id="选择构建索引的引擎"/>}>
                        <Select>
                            {

                                engines.map(item => {
                                    return <Select.Option value={item.name}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    {/*<Form.Item name={"desc"}>*/}
                    {/*    <pre>*/}
                    {/*             第一次创建索引系统会分成两个阶段完成：*/}
                    {/*             1. 拉取全量数据，构建索引，期间有可能导致MySQL负载较重。建议从库，也可以重新选择然后重新调整并行度。*/}
                    {/*             2. 全量索引完成后，会自动通过binlog拉取，不会对MySQL造成影响。*/}
                    {/*    </pre>*/}
                    {/*</Form.Item>*/}

                    <Form.Item>
                        <Button type="primary" loading={loading} onClick={
                            submit
                        }><FormattedMessage id="apply"/></Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    </>
}




