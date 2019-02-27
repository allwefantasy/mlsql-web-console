import * as React from "react";
import {Col, Input, Row, Select} from "antd";
import ETBaseTool from "./ETBaseTool";

const InputGroup = Input.Group;

export default class ETStringIndex extends ETBaseTool {

    constructor(props) {
        super(props)
    }

    makeMLSQL = () => {

        let asStr = ""

        if (this.data.outputTableNameV) {
            asStr = `as ${this.data.outputTableNameV}`
        }

        const sqlTrain = super._makeMLSQL().replace(asStr, "")

        const sqlBatchPredict = `predict ${this.data.tableNameV} as ${this.name}.\`${this.data.pathV || ""}\` ${asStr};`

        return (`${sqlTrain}
        ${sqlBatchPredict}
        register ${this.name}.\`${this.data.pathV || ""}\` as ${this.data.functionNameV}; 
        `).stripMargin()
    }

    functionName = (evt) => {
        this.data.functionNameV = evt.target.value
    }

    render() {
        return <div>
            {this.showTableName()}
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.params} name={"inputCol"} type="text" size={"large"}
                               addonBefore={"inputCol"}
                               placeholder="inputCol"/>
                    </Col>
                </Row>
            </InputGroup>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.params} name={"outputCol"} type="text" size={"large"}
                               addonBefore={"outputCol"}
                               placeholder="inputCol"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>

            {this.showOutputTableName()}
            <br/>
            {this.showPathName()}
            <br/>
            <InputGroup compact={true}>
                <Row>
                    <Col>
                        <Input onChange={this.functionName} type="text" size={"large"} addonBefore={"functionName"}
                               placeholder="A function you can use to convert String to number or number to String"/>
                    </Col>
                </Row>
            </InputGroup>
            <br/>
            {this.state.dataForRender.length == 0 ? "" : <span>Parameters:</span>}
            <InputGroup compact={true}>
                {this.state.dataForRender}
            </InputGroup>

        </div>
    }
}