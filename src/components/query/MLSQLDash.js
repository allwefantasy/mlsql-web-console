import React, {Component, PureComponent} from 'react';
import {Collapse} from 'antd';
import {UploadDropzone} from '../upload/UploadDropZone'
import 'ant-design-pro/dist/ant-design-pro.css';
import {TimelineChart, Pie} from 'ant-design-pro/lib/Charts';
import {Tabs} from 'antd';
import moment from 'moment'
import Row from "../../../node_modules/antd/lib/grid/row";
import Col from "../../../node_modules/antd/lib/grid/col";
import ChartCard from "../../../node_modules/ant-design-pro/lib/Charts/ChartCard";
import Tooltip from "../../../node_modules/antd/lib/tooltip";
import Icon from "../../../node_modules/antd/lib/icon";
import Bar from "../../../node_modules/ant-design-pro/lib/Charts/Bar";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Cell, Bar as JBar, Tooltip as JTooltip
} from 'recharts';
import MLSQLThreeDimScatterChart from "../dash/ScatterChart";
import MLSQLLineChart from "../dash/MLSQLLineChart";


const randomColor = require('randomcolor'); // import the script
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

function callback(key) {

}

export class MLSQLDash extends PureComponent {
    constructor(props) {
        super(props);
        this.queryApp = props.parent
        this.state = {data: [], dataForRender: [], titleMap: {}}
    }

    isStream = (data) => {
        if (data.length < 1) {
            return false
        }
        try {
            const item = JSON.parse(data[0]["value"])
            if (!item["runId"]) {
                return false
            }
        } catch (e) {
            return false
        }

        return true
    }

    static basicCheck = (data, fun) => {
        if (data.length < 1) {
            return false
        }

        try {
            return fun(data[0])
        } catch (e) {
            return false
        }

        return true
    }

    isResource = (data) => {
        return MLSQLDash.basicCheck(data, (item) => {
            return item.hasOwnProperty("activeTasks") && item.hasOwnProperty("totalCores") && item.hasOwnProperty("activeExecutorNum")
        })
    }

    isNormalXY = (data) => {
        return MLSQLDash.basicCheck(data, (item) => {
            return item.hasOwnProperty("x") && item.hasOwnProperty("y") && ((typeof item["y"]) === "number")
        })
    }


    xYRender = (data) => {
        return <Bar
            height={200}
            title="Bar"
            data={data}
        />
    }

    resourceRender = (data) => {
        const item = data[0]
        //totalExecutorNum
        const cpuRenderData = [{x: "used", y: item.activeTasks}, {x: "free", y: (item.totalCores - item.activeTasks)}]
        const gcRenderData = [{x: "taskTime", y: item.taskTime}, {x: "gcTime", y: (item.gcTime)}]
        const executorsRenderData = [{x: "used", y: item.activeExecutorNum}, {
            x: "free",
            y: (item.totalExecutorNum - item.activeExecutorNum)
        }]

        const memoryRenderData = item.totalMemory === -1 ? [] : [{x: "used", y: item.usedMemory / (1024 * 1024)}, {
            x: "free",
            y: (item.totalMemory - item.usedMemory) / (1024 * 1024)
        }]


        const shuffleInfo = (title, info, key) => {
            return <ChartCard
                title={title}
                action={
                    <Tooltip title={info}>
                        <Icon type="info-circle-o"/>
                    </Tooltip>
                }
                total={() => (
                    <span dangerouslySetInnerHTML={{__html: item.shuffleData[key] / (1024 * 1024)}}/>
                )}
            />
        }

        const diskSpilled = shuffleInfo("Disk Spilled", "The size(M) spilled in disk", "diskBytesSpilled")
        const memorySpilled = shuffleInfo("Memory Spilled", "The memory size(M) spilled in disk", "memoryBytesSpilled")
        const inputRecords = shuffleInfo("InputRecords", "Current active jobs have processed how many records", "inputRecords")

        return <div>
            <Row>
                <Col span={6}>
                    <Pie
                        hasLegend
                        title="CPU"
                        subTitle="CPU"
                        total={() => (
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: cpuRenderData.reduce((pre, now) => now.y + pre, 0)
                                }}
                            />
                        )}
                        data={cpuRenderData}
                        valueFormat={val => <span dangerouslySetInnerHTML={{__html: val}}/>}
                        height={200}
                    />
                </Col>
                <Col span={6}>
                    <Pie
                        hasLegend
                        title="Memory"
                        subTitle="Memory"
                        total={() => (
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: (memoryRenderData.reduce((pre, now) => now.y + pre, 0) + "").split("\.")[0] + "M"
                                }}
                            />
                        )}
                        data={memoryRenderData}
                        valueFormat={val => <span dangerouslySetInnerHTML={{__html: (val + "").split("\.")[0] + "M"}}/>}
                        height={200}
                    />
                </Col>
                <Col span={6}>
                    <Pie
                        hasLegend
                        title="Task/GC"
                        subTitle="Task/GC"
                        total={() => (
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: gcRenderData.reduce((pre, now) => now.y + pre, 0)
                                }}
                            />
                        )}
                        data={gcRenderData}
                        valueFormat={val => <span dangerouslySetInnerHTML={{__html: val}}/>}
                        height={200}
                    />
                </Col>
                <Col span={6}>
                    <Pie
                        hasLegend
                        title="Executors"
                        subTitle="Executors"
                        total={() => (
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: executorsRenderData.reduce((pre, now) => now.y + pre, 0)
                                }}
                            />
                        )}
                        data={executorsRenderData}
                        valueFormat={val => <span dangerouslySetInnerHTML={{__html: val}}/>}
                        height={200}
                    />
                </Col>
            </Row>

            <Row>
                <Col span={8}>
                    {diskSpilled}
                </Col>
                <Col span={8}>
                    {memorySpilled}
                </Col>
                <Col span={8}>
                    {inputRecords}
                </Col>

            </Row>


        </div>
    }

    renderDash = () => {
        const data = this.state.data
        if (this.isResource(data)) {
            return this.resourceRender(data)
        }
        if (this.isStream(data)) {
            return <div>
                <TimelineChart
                    height={200}
                    data={this.state.dataForRender}
                    titleMap={this.state.titleMap}
                />
                <TimelineChart
                    height={200}
                    data={this.state.dataForRender2}
                    titleMap={this.state.titleMap2}
                />
            </div>
        }

        if (MLSQLThreeDimScatterChart.isShouldRender(data)) {
            return MLSQLThreeDimScatterChart.render(data)
        }

        if (this.isNormalXY(data)) {
            return this.xYRender(data)
        }

        if (MLSQLLineChart.isShouldRender(data)) {
            return MLSQLLineChart.render(data)
        }

        return <div></div>

    }

    refresh() {
        try {
            const data = this.queryApp.queryResData || []
            this.setState({data: data})
            this.renderStream()
        } catch (e) {

        }

    }

    renderStream = () => {
        const data = this.state.data
        if (!this.isStream(data)) {
            return
        }

        const dataForRender = []
        const dataForRender2 = []
        data.forEach((item) => {
            const jsonItem = JSON.parse(item["value"])
            dataForRender.push({
                x: moment.utc(jsonItem.timestamp).toDate().getTime(),
                y1: jsonItem.inputRowsPerSecond,
                y2: jsonItem.processedRowsPerSecond
            })

            dataForRender2.push({
                x: moment.utc(jsonItem.timestamp).toDate().getTime(),
                y1: jsonItem.numInputRows
            })
        })
        this.setState({
            dataForRender: dataForRender,
            titleMap: {y1: "inputRowsPerSecond", y2: "processedRowsPerSecond"},
            dataForRender2: dataForRender2,
            titleMap2: {y1: "numInputRows"}
        })
    }
    renderRawData = () => {
        const data = this.state.data
        if (!this.isStream(data)) {
            return ""
        }
        const dataForRender = []
        data.forEach((item) => {
            const jsonItem = JSON.parse(item["value"])
            dataForRender.push(JSON.stringify(jsonItem, null, 2))
        })
        return dataForRender.join("\n")
    }

    render() {
        return (<Collapse onChange={callback}>
            <Panel header="Tools/Dashboard" key="1">
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Upload" key="1">
                        <UploadDropzone/>
                    </TabPane>
                    <TabPane tab="Dashboard" key="2">{this.renderDash()}</TabPane>
                    <TabPane tab="RawData" key="3">
                        <pre>{this.renderRawData()}</pre>
                    </TabPane>
                </Tabs>
            </Panel>
        </Collapse>)
    }

}