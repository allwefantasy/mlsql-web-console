import React, {useState, useCallback, useEffect} from 'react';
import {Button, Card, Form, Popconfirm, Table} from "antd";
import {ActionProxy} from "../../../backend_service/ActionProxy";
import RemoteAction from "../../../backend_service/RemoteAction";
import moment from "moment";
import {FormattedMessage} from "react-intl";

interface MlsqlIndexer {
    id: number;
    name: string;
    status: number;
    lastStatus: number;
    lastFailMsg: string;
    lastExecuteTime: number;
    interval: number;
    content: string;
    indexerConfig: string;
}

export function IndexList() {
    const [result, setResult] = useState<Array<MlsqlIndexer>>([])
    const loadIndexers = async () => {
        const proxy = new ActionProxy()
        const res = await proxy.post(RemoteAction.INDEXER_LIST, {})
        if (res.status === 200) {
            const value = res.content as Array<MlsqlIndexer>
            setResult(value)
        }
    }
    const removeIndexer = async (name: string) => {
        const proxy = new ActionProxy()
        await proxy.post(RemoteAction.INDEXER_REMOVE, {
            name
        })
        loadIndexers()
    }
    useEffect(() => {
        loadIndexers()
    }, [])

    return <div className="common-margin common-child-center">
        <Table dataSource={result}>
            <Table.Column title="索引名称" dataIndex="name" key="name"/>
        </Table>
        <Table dataSource={result}>
            <Table.Column title="当前状态" dataIndex="status" key="status" render={(value, record, index) => {
                if (value === 0) {
                    return <>索引完成</>
                }
                if (value === 1) {
                    return <>索引中</>
                }
                return <></>
            }}/>
            <Table.Column title="上一次索引时间" dataIndex="lastExecuteTime" key="lastExecuteTime"
                          render={(value, record, index) => {
                              const date = new Date(value);
                              return <>{moment(date).format("YYYY-MM-DD hh:mm:ss")}</>
                          }}/>
            <Table.Column title="上一次索引状态" dataIndex="lastStatus" key="lastStatus" render={(value, record, index) => {
                if (value === 0) {
                    return <>索引完成</>
                }
                if (value === 1) {
                    return <>索引失败</>
                }
                return <></>
            }}/>

            <Table.Column title="上一次索引信息" width="200"
                          ellipsis={{showTitle: true}} dataIndex="lastFailMsg" key="lastFailMsg"
                          render={(value, record, index) => {
                              return <>{value}</>
                          }}/>

            <Table.Column title="操作" dataIndex="operate" key="operate" fixed='right' width="100px"
                          render={(value, record, index) => {
                              return <>
                                  <Popconfirm
                                      title="确认要删除该索引么？"
                                      okText="Yes"
                                      cancelText="No"
                                      onConfirm={() => {
                                          removeIndexer((record as { name: string }).name)
                                      }}
                                  >
                                      <Button>删除</Button>
                                  </Popconfirm>
                              </>
                          }}/>


        </Table>
    </div>
}




