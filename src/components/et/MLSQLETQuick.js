import * as React from "react";
import {Collapse, Tabs} from 'antd';
import {Card, Col, Row} from 'antd';
import {ETPop} from "./ETPop";
import Tag from "../../../node_modules/antd/lib/tag";


const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

export class MLSQLETQuick extends React.Component {
    constructor(props) {
        super(props)
        this.queryApp = props.parent
        this.state = {}
    }

    componentDidMount() {

    }

    onDragStart = (evt) => {
        evt.dataTransfer.setData("eventName", evt.target.getAttribute("name"));
        evt.dataTransfer.setData("popName", evt.target.getAttribute("help"));
        evt.dataTransfer.setData("processType", evt.target.getAttribute("processtype"));
    }

    makeMLSQL = (sql) => {
        this.queryApp.appendToEditor(sql)
    }


    renderPop = () => {
        if (this.state.etPop) {
            return <ETPop parent={this} title={this.state.popName}/>
        }
        return null
    }


    render() {
        return (
            <div>
                <Collapse style={{margin: "0px 0px", padding: "0px 0px"}}>
                    <Panel header="Quick Menu" key="1">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="Load Data" onDragStart={this.onDragStart} name={"load"}
                                      help={"Load file/db as table"}
                                      draggable={true}>There
                                    are so many datasources are
                                    supported.
                                    Just Drag&&Drop me to MLSQL editor</Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Save Data" onDragStart={this.onDragStart} name={"save"}
                                      help={"Save table into file/db "}
                                      draggable={true}>There
                                    are so many datasources are
                                    supported.
                                    Just Drag&&Drop me to MLSQL editor</Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Algorithms">
                                    <Tag onDragStart={this.onDragStart} name={"TfIdfInPlace"}
                                         help={"Use TfIdfInPlace vectorize text"}
                                         draggable={true} color="magenta">TfIdf</Tag>
                                    <Tag onDragStart={this.onDragStart} name={"RandomForest"}
                                         help={"Use RandomForest to train a model"}
                                         draggable={true} color="magenta">RandomForest</Tag>
                                </Card>
                            </Col>

                        </Row>
                        <br/>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="Register model as Function">
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card title="Register UDF/UDAF">
                                    <Tag onDragStart={this.onDragStart} name={"ScriptUDF"} processtype={"tool"}
                                         help={"Use ScriptUDF create udf"}
                                         draggable={true} color="magenta">Create UDF</Tag>
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card title="Tools">
                                    <Tag onDragStart={this.onDragStart} name={"DownloadExt"} processtype={"tool"}
                                         help={"Use DownloadExt to download files you have uploaded"}
                                         draggable={true} color="magenta">Download uploaded file</Tag>
                                </Card>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
                {this.renderPop()}
            </div>

        )
    }
}