import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETPopSave extends React.Component {
    constructor(props) {
        super(props)
        this.etpop = props.parent
        this.data = {}
        this.state = {datasourcesRender: []}
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
    }

    saveMode = (value, evt) => {
        this.data.saveModeV = value
    }

    path = (evt) => {
        this.data.pathV = evt.target.value
    }

    tableName = (evt) => {
        this.data.tableNameV = evt.target.value
    }

    partitionBy = (evt) => {
        this.data.partitionByV = evt.target.value
    }

    fileNum = (evt) => {
        this.data.fileNumV = evt.target.value
    }

    makeMLSQL = () => {
        const self = this
        let partitionByStr = ""
        if (this.data.partitionByV) {
            partitionByStr = "partitionBy " + this.data.partitionByV
        }

        let fileNumStr = `key="value"`
        if (this.data.fileNumV) {
            fileNumStr = `fileNum="${this.data.fileNumV }"`
        }

        return `save ${self.data.saveModeV} ${self.data.tableNameV} as ${self.data.sourceTypeV}.\`${self.data.pathV}\` \n where ${fileNumStr} ${partitionByStr};`
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
                        SaveMode:<Select
                        onChange={this.saveMode}
                        showSearch
                        style={{width: 200}}
                        placeholder="Choose save mode type"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option key={"overwrite"} value={"overwrite"}>overwrite</Option>
                        <Option key={"append"} value={"append"}>append</Option>
                        <Option key={"errorIfExists"} value={"errorIfExists"}>errorIfExists</Option>
                        <Option key={"ignore"} value={"ignore"}>ignore</Option>
                    </Select>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.tableName} label="tableName" addonBefore="tableName"
                               placeholder="the tableName will be saved"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>

            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.path} type="text" addonBefore="Target Path"
                               placeholder="File path or tableName"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.partitionBy} addonBefore="partitionBy"
                               placeholder="partitionBy"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.fileNum} addonBefore="fileNum"
                               placeholder="fileNum"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>


        </div>
    }
}
