import * as React from 'react'
import { Form, Select, Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import EngineService from '../../service/EngineService'

interface Props {
}

interface TableInWorkshop {
    tableName:string
}
const { Option } = Select
const SelectUnionTable: React.FunctionComponent<Props> = (props) => {
    const [tables,setTables] = React.useState(Array<TableInWorkshop>())
    React.useEffect(()=>{
        const fetch = async()=>{
            const res = await EngineService.tablesInWorkshop()
            if(res.status === 200){
                const tables = res.content as Array<TableInWorkshop>
                setTables(tables)
            }
        }
        fetch()
    },[])

    const items = tables.map(table=>{
        return <Option value={table.tableName}>{table.tableName}</Option>
    })
    return (
        <Form className="login-form" >Ò
            <Form.Item label={<FormattedMessage id="union_table" />} name="joinTable" rules={[{ required: true, message: 'Please select union table!' }]}>
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Choose Join Table"
                    optionFilterProp="children"                    
                > 
                {items}                   
                </Select>
            </Form.Item>            
        </Form>
    )
}

export { SelectUnionTable }