import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;
const {TextArea} = Input;


export default class ETBaseTool extends React.Component {
    constructor(props) {
        super(props)
        this.etpop = props.parent
        this.name = props.name
        this.data = {params: {}}
        this.state = {
            dataForRender: [],
            tableHidden: props.tableHidden,
            pathAlias: props.pathAlias,
            pathHidden: props.pathHidden,
            outputTableHidden: props.outputTableHidden,
            outputTableAlias: props.outputTableAlias,
            tableAlias: props.tableAlias
        }
    }

    renderParam = (item) => {
        if (item.param === "keepVersion" || item.param === "evaluateTable") {
            return null
        }
        if (item.param === "code" || item.param === "fitParam.[group].code") {
            return <Row><Col>{item.param}:<TextArea style={{marginBottom: "10px"}} name={item.param}
                                                    onChange={this.params}
                                                    type="text" rows={10}/></Col></Row>
        }
        return <Row key={item.param}>
            <Col>
                <Input style={{marginBottom: "10px"}} name={item.param} onChange={this.params} type="text"
                       addonBefore={item.param}
                       placeholder={item.description}/>
            </Col>
        </Row>
    }

    componentDidMount() {
        const self = this
        const api = new MLSQLAPI(RUN_SCRIPT)

        api.runScript({}, `load modelParams.\`${self.name}\` as output;`, (data) => {
            const dataForRender = []
            data.forEach(item => {
                const temp = this.renderParam(item)
                if (temp !== null) {
                    dataForRender.push(temp)
                    dataForRender.push(<br/>)
                }

            })
            self.setState({dataForRender: dataForRender})
        }, fail => {

        })
    }

    params = (evt) => {
        this.data.params[evt.target.getAttribute("name")] = evt.target.value
    }

    path = (evt) => {
        this.data.pathV = evt.target.value
    }

    tableName = (evt) => {
        this.data.tableNameV = evt.target.value
    }

    outputTableName = (evt) => {
        this.data.outputTableNameV = evt.target.value
    }

    _makeMLSQL() {
        const self = this
        let paramsArray = []
        for (let k in this.data.params) {
            let v = this.data.params[k]
            let rv = "\"" + v + "\""
            if (k === "code" || k === "fitParam.[group].code") {
                rv = "'''" + v + "'''"
            }
            paramsArray.push(k.replace(/\[group\]/g, '0') + "=" + rv)
        }

        let whereStr = ""
        if (paramsArray.length > 0) {
            whereStr = "where"
        }

        let asStr = ""

        if (this.data.outputTableNameV) {
            asStr = `as ${this.data.outputTableNameV}`
        }

        //run command as DownloadExt.`` where from="test2" and to="/tmp/jack";
        return `run ${this.data.tableNameV || "command"} as ${this.name}.\`${this.data.pathV || ""}\` ${whereStr} ${paramsArray.join("and\n ")} ${asStr};`
    }

    showTableName = () => {
        if (this.state.tableHidden !== "true") {
            return <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.tableName} size={"large"}
                               addonBefore={this.state.tableAlias ? this.state.tableAlias : "Input table"}
                               placeholder=""/>
                    </Col>
                </Row>
            </InputGroup>
        }
        return null
    }

    showOutputTableName = () => {
        if (this.state.outputTableHidden !== "true") {
            return <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.outputTableName} size={"large"}
                               addonBefore={this.state.outputTableAlias ? this.state.outputTableAlias : "Output table"}
                               placeholder=""/>
                    </Col>
                </Row>
            </InputGroup>
        }
        return null
    }

    pathNameForRender = () => {
        if (this.state.pathAlias) {
            return this.state.pathAlias
        } else {
            return "Save path"
        }
    }
    showPathName = () => {
        if (this.state.pathHidden !== "true") {
            return <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.path} type="text" size={"large"} addonBefore={this.pathNameForRender()}
                               placeholder=""/>
                    </Col>
                </Row>
            </InputGroup>
        }
        return ""
    }

    _render() {
        return <div>
            {this.showTableName()}
            <br/>
            {this.showOutputTableName()}
            <br/>
            {this.showPathName()}
            <br/>
            {this.state.dataForRender.length == 0 ? "" : <span>Parameters:</span>}
            <InputGroup compact={true}>
                {this.state.dataForRender}
            </InputGroup>

        </div>
    }
}
