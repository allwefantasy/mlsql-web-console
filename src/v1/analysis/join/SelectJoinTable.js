import * as React from "react";
import { Form, Select, Steps } from 'antd'
import EngineService from "../../service/EngineService"

const { Option } = Select;
export default class SelectJoinTable extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
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

    render = () => {
        return (<Form className="login-form">
        <Form.Item>
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
                    return <Option value={item.value}>{item.name}</Option>
                })}
            </Select>
        </Form.Item>
        <Form.Item>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select Join Type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Option value="inner join">Inner Join</Option>
                <Option value="left join">Left Join</Option>
                <Option value="right join">Right Join</Option>
                <Option value="full join">Full Join</Option>
            </Select>
        </Form.Item>
    </Form>)
    }
}