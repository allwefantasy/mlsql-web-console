import React, {Component} from 'react';
import {Collapse} from 'antd';
import {UploadDropzone} from '../upload/UploadDropZone'
import 'ant-design-pro/dist/ant-design-pro.css';
import {TimelineChart} from 'ant-design-pro/lib/Charts';
import {Tabs} from 'antd';


const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}

const chartData = [];
for (let i = 0; i < 20; i += 1) {
    chartData.push({
        x: (new Date().getTime()) + (1000 * 60 * 30 * i),
        y1: Math.floor(Math.random() * 100) + 1000,
        y2: Math.floor(Math.random() * 100) + 10,
    });
}


export class MLSQLDash extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Collapse onChange={callback}>
            <Panel header="More" key="1">
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Upload" key="1">
                        <UploadDropzone/>
                    </TabPane>
                    <TabPane tab="Dashboard" key="2"><TimelineChart
                        height={200}
                        data={chartData}
                        titleMap={{y1: '客流量', y2: '支付笔数'}}
                    /></TabPane>
                    <TabPane tab="RawData" key="3">Content of Tab Pane 2</TabPane>
                </Tabs>
            </Panel>
        </Collapse>)
    }

}