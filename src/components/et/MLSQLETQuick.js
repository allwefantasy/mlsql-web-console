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
        this.itemData = {}
    }

    componentDidMount() {

    }

    setData = (k, v) => {
        this.itemData[k] = v
    }

    getData = (k) => {
        return this.itemData[k]
    }

    onDragStart = (evt) => {
        const processType = evt.target.getAttribute("processtype")
        this.setData("eventName", evt.target.getAttribute("name"));
        this.setData("popName", evt.target.getAttribute("help"));
        this.setData("processType", processType);
        this.setData("pathAlias", evt.target.getAttribute("pathalias") || "");
        this.setData("outputTableAlias", evt.target.getAttribute("outputtablealias") || "");
        this.setData("tableAlias", evt.target.getAttribute("tablealias") || "");
        this.setData("tableHidden", evt.target.getAttribute("tablehidden") || false);
        this.setData("pathHidden", evt.target.getAttribute("pathhidden") || false);
        this.setData("outputTableHidden", evt.target.getAttribute("outputtablehidden") || false);


    }

    makeMLSQL = (sql) => {
        this.queryApp.getCurrentEditor().appendToEditor(sql)
    }


    renderPop = () => {
        if (this.state.etPop) {
            return <ETPop parent={this} title={this.state.popName}/>
        }
        return null
    }


    etDoubleClick = (evt) => {
        this.onDragStart(evt)
        this.queryApp.getCurrentEditor().ref.etOver(evt)
    }

    render() {
        return (
            <div>
                <Collapse style={{margin: "0px 0px", padding: "0px 0px"}}>
                    <Panel header="Quick Menu" key="1">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title={"Load/Save Data"}>

                                    <Tag tyle={{marginBottom: "10px"}} title="Load/Save Data"
                                         onDragStart={this.onDragStart} name={"load"}
                                         help={"Load file/db as table"}
                                         draggable={true} color="magenta" onDoubleClick={this.etDoubleClick}>Load
                                        data</Tag>

                                    <Tag tyle={{marginBottom: "10px"}} title="Save Data" onDragStart={this.onDragStart}
                                         name={"save"}
                                         help={"Save table into file/db "}
                                         draggable={true} color="magenta" onDoubleClick={this.etDoubleClick}>Save data</Tag>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Algorithms">
                                    <Tag tyle={{marginBottom: "10px"}} onDragStart={this.onDragStart}
                                         name={"TfIdfInPlace"}
                                         help={"Use TfIdfInPlace vectorize text"}
                                         draggable={true} color="magenta" onDoubleClick={this.etDoubleClick}>TfIdf</Tag>

                                    <Tag tyle={{marginBottom: "10px"}} onDragStart={this.onDragStart}
                                         name={"Word2VecInPlace"}
                                         help={"Use Word2VecInPlace vectorize text"}
                                         draggable={true} color="magenta" onDoubleClick={this.etDoubleClick}>Word2vec</Tag>

                                    <Tag tyle={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"RandomForest"}
                                         help={"Use RandomForest to train a model"}
                                         draggable={true} color="magenta">RandomForest</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"PythonAlg"}
                                         help={"Run python lib to train"}
                                         draggable={true} color="magenta">Python Algorithm</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"BigDLClassifyExt"}
                                         help={"Use BigDL to develop deep learning algorithm"}
                                         draggable={true} color="magenta">Deep Learning</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"NaiveBayes"}
                                         help={"Use NaiveBayes"}
                                         draggable={true} color="magenta">NaiveBayes</Tag>
                                </Card>
                            </Col>

                            <Col span={8}>
                                <Card title="Python">
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"PythonEnvExt"} processtype={"tool"}
                                         help={"Create Python Env"}
                                         pathalias={"Temp directory"} tablehidden={"true"} pathhidden={"false"}
                                         outputtablehidden={"true"}
                                         draggable={true} color="magenta">Create Python Env</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"PythonParallelExt"} processtype={"tool"}
                                         help={"Run python project"}
                                         pathalias={"Temp directory"} tablehidden={"true"} pathhidden={"false"}
                                         outputtablehidden={"true"}
                                         draggable={true} color="magenta">Run python project</Tag>
                                </Card>
                            </Col>

                        </Row>
                        <br/>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="Register model as Function">
                                    <Tag onDragStart={this.onDragStart} name={"ScriptUDF"} processtype={"tool"} onDoubleClick={this.etDoubleClick}
                                         help={"Use ScriptUDF create udf"}
                                         draggable={true} color="magenta">Create UDF</Tag>

                                    <Tag onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"register"}
                                         help={"Register model to function "}
                                         pathalias={"Model saved path"}
                                         outputtablealias={"Function name"}
                                         tablealias={"Function name"}
                                         tablehidden={"true"}
                                         pathhidden={"false"}
                                         outputtablehidden={"false"}
                                         draggable={true} color="magenta">Register Model As Function</Tag>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Jobs">
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} name={"JobList"} onDoubleClick={this.etDoubleClick}
                                         processtype={"direct"}
                                         draggable={true} color="magenta">Show jobs</Tag>
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} name={"Kill"} onDoubleClick={this.etDoubleClick}
                                         processtype={"tool"}
                                         pathalias={"groupId or jobName"} tablehidden={"true"}
                                         help={"Kill your job"}
                                         draggable={true} color="magenta">Kill job</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"ETStreamProgress"} processtype={""}
                                         help={"Show Progress of Stream"}
                                         draggable={true} color="magenta">Show Stream Job Progress</Tag>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Tools">
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"DownloadExt"} processtype={"tool"}
                                         help={"Use DownloadExt to download files you have uploaded"}
                                         draggable={true} color="magenta">Download uploaded file</Tag>
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"ImageLoaderExt"} processtype={"tool"}
                                         help={"Use ImageLoaderExt to load images"}
                                         pathalias={""} tablehidden={"true"} pathhidden={"true"}
                                         outputtablehidden={"false"}
                                         draggable={true} color="magenta">Load images</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"ConnectMySQL"} processtype={"direct"}
                                         help={""}
                                         draggable={true} color="magenta">Connect MySQL</Tag>
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick} name={"JDBC"}
                                         processtype={"tool"}
                                         pathalias={"DB name in connect"} tablehidden={"false"}
                                         help={"Run DLL on MySQL"}
                                         draggable={true} color="magenta">MySQL DDL</Tag>
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"TreeBuildExt"} processtype={"tool"}
                                         pathalias={""} tablehidden={"false"} pathhidden={"true"}
                                         help={"Build tree from parent-child"}
                                         draggable={true} color="magenta">Parent-Child</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"ETExample"} processtype={""}
                                         help={"Show Example of ET"}
                                         draggable={true} color="magenta">Show ET Example</Tag>


                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"RepartitionExt"} processtype={"tool"}
                                         help={"Change Table Partition Num"}
                                         pathalias={""} tablehidden={"false"} pathhidden={"true"}
                                         outputtablehidden={"false"}
                                         draggable={true} color="magenta">Repartition table</Tag>
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"SendMessage"} processtype={"tool"}
                                         help={"Send email"}
                                         pathalias={""} tablehidden={"false"} pathhidden={"true"}
                                         outputtablehidden={"true"}
                                         draggable={true} color="magenta">Send Mail</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"CacheExt"} processtype={"tool"}
                                         help={"Cache table"}
                                         pathalias={""} tablehidden={"false"} pathhidden={"true"}
                                         outputtablehidden={"true"}
                                         draggable={true} color="magenta">Cache Table</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"StringIndex"} processtype={"tool"}
                                         help={"Convert String to number"}
                                         pathalias={"Mapping path"} tablehidden={"false"} pathhidden={"false"}
                                         outputtablehidden={"true"}
                                         draggable={true} color="magenta">Convert String to number</Tag>

                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"DownloadFile"} processtype={"tool"}
                                         help={"Download File"}
                                         pathalias={"Target file"} tablehidden={"true"} pathhidden={"false"}
                                         outputtablehidden={"true"}
                                         draggable={true} color="magenta">Download File to computer</Tag>
                                    <Tag style={{marginBottom: "10px"}} onDragStart={this.onDragStart} onDoubleClick={this.etDoubleClick}
                                         name={"ShowResource"}
                                         processtype={"direct"}
                                         draggable={true} color="magenta">Cluster Resource</Tag>


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
