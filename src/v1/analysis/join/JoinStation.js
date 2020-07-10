import * as React from "react";
import mix from "../../../common/mixin"
import { Form, Select, Steps } from 'antd';
import ApplyOrSave from "../ApplyOrSave";
import SelectFields from "../project/SelectFields"
import { StationCommonOp } from "../commonops/StationCommonOp";
import "./JoinStation.scss"

const { Step } = Steps;
const { Option } = Select;


export default class JoinStation extends mix(React.Component).with(StationCommonOp) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
    }

    step1 = () => {
        return <Form className="login-form">
            <Form.Item>
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select Table"
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
                    placeholder="Select Join Type"
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
        </Form>

    }
    step2 = () => {
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
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                </Select>
            </Form.Item>
        </Form>


    }
    step3 = () => {
        return <div>
            <div>Table A:</div>
            <SelectFields ref={(et) => this.selectFieldsRef = et} parent={this}></SelectFields>
            <div>Table B:</div>
            <SelectFields ref={(et) => this.selectFieldsRef = et} parent={this}></SelectFields>
        </div>
    }

    render() {
        return <div className="join-app">
            <div className={"station-menu"}>
                <ApplyOrSave handleTableInput={this.handleTableInput} ref={(et) => this.ApplyOrSaveRef = et} onSave={this.onSave} onApply={this.onApply} style={{ marginBottom: "30px" }}></ApplyOrSave>

            </div>
            <div>
                <Steps current={0}>
                    <Step title="Table" description="Choose the table you wanna join from workshop">

                    </Step>

                    <Step title="Join Condition " description="Choose the join condition in both tables" />
                    <Step title="Fields" description="Choose the fields you want from both tables" />
                </Steps>
            </div>
            <div className="join-app-form"> {this.step3()}</div>
        </div>
    }
}