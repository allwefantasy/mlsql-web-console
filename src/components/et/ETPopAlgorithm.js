import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETPopAlgorithm extends React.Component {
    constructor(props) {
        super(props)
        this.etpop = props.parent
        this.name = props.name
        this.data = {params: {}}
        this.state = {dataForRender: []}
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

        if (paramsArray.length == 0) {
            paramsArray.push("keepVersion=\"true\"")
        }

        return `train ${this.data.tableNameV} as ${this.name}.\`${this.data.pathV}\` where 
${paramsArray.join("\n")};`
    }

    render() {
        return <div>
            <span>Training data and model path:</span>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input type="text" onChange={this.tableName} size={"large"} addonBefore="tableName"
                               placeholder="the table of training data"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.path} type="text" size={"large"} addonBefore="Model save path"
                               placeholder="the location you save you model"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            <span>Algorithm parameters:</span>
            <InputGroup compact={true}>
                {this.state.dataForRender}
            </InputGroup>

        </div>
    }
}
