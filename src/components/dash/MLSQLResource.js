import React, {Component} from 'react';
import {Pie, TimelineChart} from "../../../node_modules/ant-design-pro/lib/Charts";
import moment from "moment";
import ChartCard from "../../../node_modules/ant-design-pro/lib/Charts/ChartCard";
import Tooltip from "../../../node_modules/antd/lib/tooltip";
import Icon from "../../../node_modules/antd/lib/icon";
import Row from "../../../node_modules/antd/lib/grid/row";
import Col from "../../../node_modules/antd/lib/grid/col";


export default class MLSQLResource extends Component {

    constructor(props) {
        super(props);
        this.queryApp = props.parent.parent
        this.state = {data: props.data, dataForRender: [], titleMap: {}}
    }

    static isResource = (data) => {
        if (data.length < 1) {
            return false
        }
        const item = data[0]
        try {
            return item.hasOwnProperty("activeTasks") && item.hasOwnProperty("totalCores") && item.hasOwnProperty("activeExecutorNum")
        } catch (e) {
            return false
        }

    }

    static isShouldRender = (data) => {
        return MLSQLResource.isResource(data)
    }

    resourceRender = () => {
        const data = this.state.data
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

    render() {
        return this.resourceRender()
    }

}

