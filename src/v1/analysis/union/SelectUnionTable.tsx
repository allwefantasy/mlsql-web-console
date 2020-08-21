import * as React from 'react'
import { Form, Select } from 'antd'
import { FormattedMessage } from 'react-intl'
import EngineService from '../../service/EngineService'


interface Props {
}

interface TableInWorkshop {
    tableName:string
}
const { Option } = Select
const useSelectUnionTable = () => {
    // const {dispacher} = React.useContext(UnionStationContext)
    const [tables,setTables] = React.useState(Array<TableInWorkshop>())    
    const [form] = Form.useForm()
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
    const ui = ()=>{
        return (
          
            <Form form={form} className="login-form" >           
                <Form.Item label={<FormattedMessage id="union_table" />} name="unionTable" rules={[{ required: true, message: 'Please select union table!' }]}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Choose Join Table"
                        optionFilterProp="children"                    
                    > 
                    {items}                   
                    </Select>
                </Form.Item> 
                <Form.Item label={<FormattedMessage id="allow_duplicate" />} name="duplicate" rules={[{ required: true, message: 'Please select!' }]}>
                    <Select                        
                        style={{ width: 200 }}                        
                    > 
                      <Option value="true">true</Option>               
                      <Option value="false">false</Option>               
                    </Select>
                </Form.Item>            
            </Form>
        )
    }
    return {ui,form}
}

export { useSelectUnionTable }