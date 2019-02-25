import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';
import {ETLoadParams} from "./ETLoadParams";

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETPopLoad extends React.Component {
    constructor(props) {
        super(props)
        this.etpop = props.parent
        this.data = {}
        this.state = {datasourcesRender: []}
        this.loadParamsRef = React.createRef()
    }


    componentDidMount() {
        const self = this
        const api = new MLSQLAPI(RUN_SCRIPT)

        api.runScript({}, "load _mlsql_.`datasources` as output;", (data) => {
            const datasourcesRender = []
            data.forEach(item => {
                datasourcesRender.push(<Option key={item.name} value={item.name}>{item.name}</Option>)
            })
            self.setState({datasourcesRender: datasourcesRender})
        }, fail => {

        })

    }

    sourceType = (value, evt) => {
        this.data.sourceTypeV = value
        const self = this
        const api = new MLSQLAPI(RUN_SCRIPT)
        api.runScript({}, `load _mlsql_.\`datasources/params/${value}\` as output;`, (data) => {
            const dataForRender = []
            data.forEach(item => {
                dataForRender.push(<Row>
                    <Col>
                        <Input style={{marginBottom: "10px"}} name={item.param} onChange={this.params} type="text"
                               addonBefore={item.param}
                               placeholder={item.description}/>
                    </Col>
                </Row>)
            })
            self.loadParamsRef.current.setState({dataForRender: dataForRender})
        }, fail => {

        })
    }

    path = (evt) => {
        this.data.pathV = evt.target.value
    }

    tableName = (evt) => {
        this.data.tableNameV = evt.target.value
    }

    makeMLSQL = () => {
        const self = this
        console.log(self.data)
        return `load ${self.data.sourceTypeV}.\`${self.data.pathV}\` where key="value" as ${self.data.tableNameV};`
    }

    render() {
        return <div>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        soureType:<Select
                        onChange={this.sourceType}
                        showSearch
                        style={{width: 200}}
                        placeholder="Choose DataSource type"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >{this.state.datasourcesRender}
                    </Select>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.path} type="text" label="Path" addonBefore="Path"
                               placeholder="File path or tableName"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.tableName} label="tableName" addonBefore="tableName"
                               placeholder="tableName"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <ETLoadParams parent={this} ref={this.loadParamsRef}/>
        </div>
    }
}
