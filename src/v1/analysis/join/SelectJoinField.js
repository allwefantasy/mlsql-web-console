import * as React from "react";
import { Form, Select, Button } from 'antd'
import EngineService from "../../service/EngineService";
const { Option } = Select;
export default class SelectJoinField extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.joinStation = props.parent
        this.currentTable = this.joinStation.joinInfo.currentTable.table
        this.joinTable = this.joinStation.joinInfo.joinTable
        this.state = {
            currentTableFields: [],
            joinTableFields: []
        }
    }
    reload = async () => {
        const currentTableSchema = this.joinStation.joinInfo.currentTable.schema
        const joinTable = await EngineService.tableInfo(this.joinTable)
        if (joinTable.status === 200) {
            this.setState({
                currentTableFields: currentTableSchema.fields,
                joinTableFields: JSON.parse(joinTable.content.tableSchema).fields
            })
        }
    }
    componentDidMount = async () => {
        await this.reload()
    }

    next = (values) => {
        this.joinStation.joinInfo = Object.assign(this.joinStation.joinInfo, values)
        this.joinStation.next()
    }
    render = () => {
        return <Form className="login-form" onFinish={this.next}>
            <Form.Item name="leftField" rules={[{ required: true, message: 'Please select condition field!' }]}>
                <Select
                    label="Current Table"
                    showSearch
                    style={{ width: 200 }}
                    placeholder={this.currentTable}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.currentTableFields.map(item => {
                        return <Option key={item.name} value={item.name}>{item.name}</Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="rightField" rules={[{ required: true, message: 'Please select condition field!' }]}>
                <Select
                    label="Join Table"
                    showSearch
                    style={{ width: 200 }}
                    placeholder={this.joinTable}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.joinTableFields.map(item => {
                        return <Option key={item.name} value={item.name}>{item.name}</Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Next
                </Button>
            </Form.Item>
        </Form>

    }
}