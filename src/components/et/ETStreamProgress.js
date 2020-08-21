import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETStreamProgress extends React.Component {
    constructor(props) {
        super(props)
        this.etpop = props.parent
        this.name = props.name
        this.data = {params: {}}
        this.state = {
            dataForRender: [],
            tableHidden: props.tableHidden,
            pathAlias: props.pathAlias,
            pathHidden: props.pathHidden
        }
    }

    componentDidMount() {
        const self = this
        const api = new MLSQLAPI(RUN_SCRIPT)

        api.runScript({}, `load _mlsql_.\`jobs\` as output;`, (data) => {

            const dataForRender = data.filter(item => {
                return item.jobType === "stream"
            }).map(item => {
                return <Option key={item.jobName} value={item.jobName}>{item.jobName}</Option>
            })

            self.setState({dataForRender: dataForRender})
        }, fail => {

        })
    }

    etName = (value) => {
        this.etName = value
    }
    makeMLSQL = () => {
        return `load _mlsql_.\`progress/${this.etName}\` as output;`
    }

    render() {
        return <div>
            <Row>
                <Col>
                    Stream Jobs:<Select
                    onChange={this.etName}
                    showSearch
                    style={{width: 200}}
                    placeholder="Choose Stream Name"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{this.state.dataForRender}
                </Select>
                </Col>
            </Row>
        </div>
    }
}
