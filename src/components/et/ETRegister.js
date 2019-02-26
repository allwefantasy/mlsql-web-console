import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';
import {ETLoadParams} from "./ETLoadParams";
import {ETPopTool} from "./ETPopTool";

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETRegister extends ETPopTool {

    componentDidMount() {
        const self = this
        const api = new MLSQLAPI(RUN_SCRIPT)

        api.runScript({}, `load model.\`list\` as output;`, (data) => {
            const dataForRender = []
            data.forEach(item => {
                dataForRender.push(<Option key={item.name} value={item.name}>{item.name}</Option>)
            })
            self.setState({dataForRender: dataForRender})
        }, fail => {

        })
    }

    makeMLSQL = () => {
        const self = this
        return `register ${self.data.sourceTypeV}.\`${self.data.pathV}\` as ${self.data.outputTableNameV};`
    }

    etName = (value) => {
        this.data.sourceTypeV = value
    }

    render() {
        return <div>
            {this.showTableName()}
            <br/>
            {this.showOutputTableName()}
            <br/>
            {this.showPathName()}
            <br/>
            <Row>
                <Col>
                    ET:<Select
                    onChange={this.etName}
                    showSearch
                    style={{width: 200}}
                    placeholder="Choose DataSource type"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{this.state.dataForRender}
                </Select>
                </Col>
            </Row>

        </div>
    }


}
