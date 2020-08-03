import React, { useState, useCallback, useEffect } from 'react';
import { Spin, Form, Divider, Select, Alert } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import { FormattedMessage } from 'react-intl';

function usePartitionSelect() {

    const [openTable, setOpenTable] = useState("")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState(undefined)
    const [partitionColumn, setPartitionColumn] = useState(undefined)
    const [noPartition, setNoPartition] = useState(false)
    const [form] = Form.useForm()
    const proxy = new ActionProxy()

    useEffect(() => {
        const fetch = async () => {
            if (!openTable) return
            const [db, table] = openTable.split(".")
            setLoading(true)
            const res = await proxy.runScript(`!profiler sql 'show partitions ${db}.${table}';`)
            if (res.status === 200) {
                const data = res.content.map(item => {
                    //dt=2020-08-03/hour=12                    
                    const [column, value] = item.partition.split("/")[0].split("=")
                    if (!partitionColumn) {
                        setPartitionColumn(column)
                    }
                    return { column, value }
                })
                setData(data)
                setNoPartition(false)
                if (data.length === 0) {
                    setNoPartition(true)
                }
                // if (false) {
                //     setData([{ column: "hp_stat_date", value: "2017-01-02" }])
                //     setPartitionColumn("hp_stat_date")
                //     setNoPartition(false)
                // }

            }else {
                setData([])
                setNoPartition(true)                
            }
            setLoading(false)
        }
        fetch()
    }, [openTable])

    const options = data.map(item => {
        return <Select.Option value={item.value}>{item.value}</Select.Option>
    })
    const ui = () => {
        return <>
            <Spin spinning={loading}>
                {error && <Alert style={{ marginBottom: "30px" }} type="error" message={error} />}
                {
                    noPartition && <FormattedMessage id="no_partition_msg" />
                }
                {
                    !noPartition && <Form form={form}>
                        <Form.Item name="tableStart" label={<FormattedMessage id="table_start" />}>
                            <Select>
                                {options}
                            </Select>
                        </Form.Item>
                        <Form.Item name="tableEnd" label={<FormattedMessage id="table_end" />}>
                            <Select>
                                {options}
                            </Select>
                        </Form.Item>

                        <Divider />
                        <Form.Item name="tableRandom" label={<FormattedMessage id="table_random" />}>
                            <Select mode="tags">
                                {options}
                            </Select>
                        </Form.Item>
                    </Form>
                }
            </Spin>
        </>
    }
    return { ui, form, setOpenTable, setError, partitionColumn, noPartition }
}
export { usePartitionSelect }