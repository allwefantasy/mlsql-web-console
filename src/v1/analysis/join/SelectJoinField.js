import * as React from "react";
import { Form, Select, Steps } from 'antd'
const { Option } = Select;
export default class SelectJoinField extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.state = {
            
        }
    }
    reload = () =>{

    }
    render = () => {
        return <Form className="login-form" layout="inline">
        <Form.Item>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Table A"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
            </Select>
        </Form.Item>
        <Form.Item>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Table B"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Option value="inner join">Join</Option>
                <Option value="left join">Left Join</Option>
                <Option value="right join">Right Join</Option>
                <Option value="full join">Full Join</Option>
            </Select>
        </Form.Item>
    </Form>

    }
}