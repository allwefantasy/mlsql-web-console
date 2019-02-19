import React, {Component} from 'react';
import {Collapse} from 'antd';
import {UploadDropzone} from '../upload/UploadDropZone'
import 'ant-design-pro/dist/ant-design-pro.css';
import {TimelineChart} from 'ant-design-pro/lib/Charts';
import {Tabs} from 'antd';
import moment from 'moment'


const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

function callback(key) {

}

export class MLSQLDash extends Component {
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

    renderDash = () => {
        const data = this.state.data
        if (!this.isStream(data)) {
            return <div></div>
        }
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
                    <TabPane tab="RawData" key="3"><pre>{this.renderRawData()}</pre></TabPane>
                </Tabs>
            </Panel>
        </Collapse>)
    }

}