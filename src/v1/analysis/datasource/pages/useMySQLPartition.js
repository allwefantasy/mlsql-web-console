import React, { useState, useCallback, useEffect } from 'react';
import { Spin, Form, Divider, Select, Alert, Input } from 'antd';
import { ActionProxy } from '../../../../backend_service/ActionProxy';
import { FormattedMessage } from 'react-intl';
import { useIntegerStep } from '../../common/pages/useIntegerStep';
import Tools from '../../../../common/Tools';
import RemoteAction from '../../../../backend_service/RemoteAction';

function useMySQLPartition() {

    const [openTable, setOpenTable] = useState("")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState("")
    const [column, setColumn] = useState("")
    const [form] = Form.useForm()
    const proxy = new ActionProxy()

    const { ui: partitionNumUI, value: partitionNumValue } = useIntegerStep({
        initialValue: 10,
        min: 2,
        max: 100
    })

    useEffect(() => {
        if (openTable) {
            const [db, table] = openTable.split(".")
            const tempTable = Tools.getTempTableName()
            const fetch = async () => {                 
                const res = await proxy.runScript(`                
                load jdbc.\`${openTable}\` as ${tempTable};
                !desc ${tempTable};
               `, Tools.getJobName(), {...Tools.robotFetchParam(),__connect__:db})
               if(res.status===200){
                  setData(res.content.data)
               }else {
                   setData([])
               }
            }
            fetch()
        }
    }, [openTable])

   useEffect(()=>{
       if(column){
         const fetch = async ()=>{
             const [db, table] = openTable.split(".")

             const res = await proxy.get(RemoteAction.DS_MYSQL_COLUMN_INFO,{
                dbName:db,tableName:table, columnName:column
             }) 
             if(res.status === 200){                 
                 form.setFieldsValue({
                    lowerBound: res.content.min,
                    upperBound: res.content.max
                 })
             } 
         }
         fetch()
       }
   },[column,openTable])

    //
    const options = data.filter(item=>item.data_type !== "string").map(item => {
        return <Select.Option value={item.col_name}>{item.col_name}</Select.Option>
    })
    const ui = () => {
        if(options.length === 0){
            return <><FormattedMessage id="no_mysql_parallel"/></>
        }
        return <>
            <Spin spinning={loading}>
                {error && <Alert style={{ marginBottom: "30px" }} type="error" message={error} />}
                <Form form={form}>
                    <Form.Item name="partitionColumn" label={<FormattedMessage id="partitionColumn" />}>
                        <Select onChange = {(value)=>{                            
                            setColumn(value) 
                        }}>
                            {options}
                        </Select>
                    </Form.Item>
                    <Form.Item name="lowerBound" label={<FormattedMessage id="lowerBound" />}>
                        <Input />
                    </Form.Item>

                    <Divider />
                    <Form.Item name="upperBound" label={<FormattedMessage id="upperBound" />}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="numPartitions" label={<FormattedMessage id="numPartitions" />}>
                        {partitionNumUI()}
                    </Form.Item>
                </Form>
            </Spin>
        </>
    }
    return { ui, form, setOpenTable, setError,partitionNumValue }
}
export { useMySQLPartition }