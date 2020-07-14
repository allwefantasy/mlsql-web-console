import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';
import {ETLoadParams} from "./ETLoadParams";
import { ActionProxy } from "../../backend_service/ActionProxy";
import Tools from "../../common/Tools";

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETPopLoad extends React.Component {
    constructor(props) {
        super(props)
        this.etpop = props.parent
        this.data = {params:{}}
        this.state = {datasourcesRender: []}
        this.loadParamsRef = React.createRef()
    }


    componentDidMount = async () => {
        const self = this
        const client = new ActionProxy()
        const res = await client.runScript("load _mlsql_.`datasources` as output;",Tools.getJobName(),Tools.robotFetchParamWithCollect())
        const data = Tools.distinct(res.content.data,"name")
        const datasourcesRender = []
        data.forEach(item => {
            datasourcesRender.push(<Option key={item.name} value={item.name}>{item.name}</Option>)
        })
        this.setState({datasourcesRender: datasourcesRender})
    }

    params = (evt) => {
        this.data.params[evt.target.getAttribute("name")] = evt.target.value
    }


    sourceType = (value, evt) => {
        this.data.sourceTypeV = value
        const self = this
        const api = new MLSQLAPI(RUN_SCRIPT)
        api.runScript({}, `load _mlsql_.\`datasources/params/${value}\` as output;`, (data) => {
            const dataForRender = []
            data.forEach(item => {
                dataForRender.push(<Row key={`row-${item.param}`}>
                    <Col>
                        <Input key={`input-${item.param}`} style={{marginBottom: "10px"}} name={item.param} onChange={self.params} type="text"
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
        return `load ${self.data.sourceTypeV}.\`${self.data.pathV}\` ${whereStr} ${paramsArray.join("and\\n ")} as ${self.data.tableNameV};`
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
            {this.props.ignorePath? <div></div> : <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.path} type="text" label="Path" addonBefore="Path"
                               placeholder="File path or tableName"/>
                    </Col>
                </Row>
            </InputGroup>}
            <br/>
             {
                 this.props.ignoreTableName? <div></div>: <InputGroup compact={true}>
                 <Row>
                     <Col>
                         <Input type="text" onChange={this.tableName} label="tableName" addonBefore="tableName"
                                placeholder="tableName"/>
                     </Col>
                 </Row>
             </InputGroup>
             }
            <br/>
            <ETLoadParams parent={this} ref={this.loadParamsRef}/>
        </div>
    }
}
