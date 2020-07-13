import * as React from "react";
import { Form, Select, Button } from 'antd'
import EngineService from "../../service/EngineService"

const { Option } = Select;
export default class SelectJoinTable extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.joinStation = props.parent
        this.state = {
            tables: []
        }
    }

    reload = async () => {
        const res = await EngineService.tablesInWorkshop()
        let tables = []
        if (res.status === 200) {
            tables = res.content.map(item => {
                return {
                    name: item.tableName,
                    value: item.tableName
                }
            })
        }
        this.setState({ tables })
    }

    componentDidMount = async () => {
        await this.reload()
    }

    next = (values)=>{

        this.joinStation.joinInfo = Object.assign(this.joinStation.joinInfo,values) 
        this.joinStation.next()
    }
   

    render = () => {
        return (<Form className="login-form" onFinish={this.next}>
            <Form.Item name="joinType" rules={[{ required: true, message: 'Please select join type!' }]}>
                <Select                    
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select Join Type"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    <Option key="inner" value="inner join">Inner Join</Option>
                    <Option key="left" value="left join">Left Join</Option>
                    <Option key="right" value="right join">Right Join</Option>
                    <Option key="full" value="full join">Full Join</Option>
                </Select>
            </Form.Item>

            <Form.Item name="joinTable" rules={[{ required: true, message: 'Please select join table!' }]}>
                <Select                    
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Choose Join Table"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.tables.map((item) => {
                        return <Option key={item.name} value={item.value}>{item.name}</Option>
                    })}
                </Select>
            </Form.Item>
            
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Next
                </Button>
            </Form.Item>
        </Form>)
    }
}