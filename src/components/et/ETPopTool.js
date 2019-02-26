import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETPopTool extends React.Component {
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

        api.runScript({}, `load modelParams.\`${self.name}\` as output;`, (data) => {
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

    makeMLSQL = () => {
        const self = this
        let paramsArray = []
        for (let k in this.data.params) {
            let v = this.data.params[k]
            paramsArray.push(k.replace(/\[group\]/g, '0') + "=" + "\"" + v + "\"")
        }

        let whereStr = ""
        if (paramsArray.length > 0) {
            whereStr = "where"
        }

        //run command as DownloadExt.`` where from="test2" and to="/tmp/jack";
        return `run ${this.data.tableNameV || "command"} as ${this.name}.\`${this.data.pathV}\` ${whereStr} ${paramsArray.join("and\n ")};`
    }

    showTableName = () => {
        if (this.state.tableHidden !== "true") {
            return <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.tableName} size={"large"} addonBefore="tableName"
                               placeholder="the table of training data"/>
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
        console.log(this.state.pathHidden)
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

    render() {
        return <div>
            {this.showTableName()}
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
