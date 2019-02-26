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
        const processType = evt.target.getAttribute("processtype")
        evt.dataTransfer.setData("eventName", evt.target.getAttribute("name"));
        evt.dataTransfer.setData("popName", evt.target.getAttribute("help"));
        evt.dataTransfer.setData("processType", processType);
        evt.dataTransfer.setData("pathAlias", evt.target.getAttribute("pathalias") || "");
        evt.dataTransfer.setData("tableHidden", evt.target.getAttribute("tablehidden") || false);
        evt.dataTransfer.setData("pathHidden", evt.target.getAttribute("pathhidden") || false);

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
                                    <Tag onDragStart={this.onDragStart} name={"ImageLoaderExt"} processtype={"tool"}
                                         help={"Use ImageLoaderExt to load images"}
                                         draggable={true} color="magenta">Load images</Tag>

                                    <Tag onDragStart={this.onDragStart} name={"JobList"} processtype={"direct"}
                                         draggable={true} color="magenta">Show jobs</Tag>
                                    <Tag onDragStart={this.onDragStart} name={"Kill"} processtype={"tool"}
                                         pathalias={"groupId or jobName"} tablehidden={"true"}
                                         help={"Kill your job"}
                                         draggable={true} color="magenta">Kill job</Tag>
                                    <Tag onDragStart={this.onDragStart} name={"ConnectMySQL"} processtype={"direct"}
                                         help={""}
                                         draggable={true} color="magenta">Connect MySQL</Tag>
                                    <Tag onDragStart={this.onDragStart} name={"JDBC"} processtype={"tool"}
                                         pathalias={"DB name in connect"} tablehidden={"false"}
                                         help={"Run DLL on MySQL"}
                                         draggable={true} color="magenta">MySQL DDL</Tag>
                                    <Tag onDragStart={this.onDragStart} name={"TreeBuildExt"} processtype={"tool"}
                                         pathalias={""} tablehidden={"false"} pathhidden={"true"}
                                         help={"Build tree from parent-child"}
                                         draggable={true} color="magenta">Parent-Child</Tag>
                                    <Tag onDragStart={this.onDragStart} name={"ETExample"} processtype={""}
                                         help={"Show Example of ET"}
                                         draggable={true} color="magenta">Show ET Example</Tag>
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