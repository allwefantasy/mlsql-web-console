import React, {Component, PureComponent} from 'react';
import {Collapse} from 'antd';
import {UploadDropzone} from '../upload/UploadDropZone'
import 'ant-design-pro/dist/ant-design-pro.css';
import {Tabs} from 'antd';
import Bar from "../../../node_modules/ant-design-pro/lib/Charts/Bar";

import MLSQLThreeDimScatterChart from "../dash/MLSQLScatterChart";
import MLSQLLineChart from "../dash/MLSQLLineChart";
import MLSQLStream from "../dash/MLSQLStream";
import MLSQLResource from "../dash/MLSQLResource";
import MLSQLHTML from "../dash/MLSQLHTML";
import QueryHistory from "../../v1/async_execute/QueryHistory"
import ResourceProgress from '../../v1/async_execute/ResourceProgress';


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


    renderDash = () => {
        const data = this.state.data
        if (MLSQLResource.isShouldRender(data)) {
            return <MLSQLResource data={data} parent={this}/>
        }
        if (MLSQLStream.isShouldRender(data)) {
            return <MLSQLStream data={data} parent={this}/>
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

        if (MLSQLHTML.isShouldRender(data)) {
            return MLSQLHTML.render(data)
        }

        return <div></div>

    }

    refresh() {
        try {
            const data = this.queryApp.queryResData || []
            this.setState({data: data})
        } catch (e) {

        }

    }


    render() {
        return (<Collapse onChange={callback}>
            <Panel header="Tools/Dashboard" key="0">
                <Tabs defaultActiveKey="0" onChange={callback} onTabClick={(key)=>{
                        if(key==="0"){                            
                            this.resourceProgressRef.reload()
                        }                        
                    }}>
                    <TabPane tab="Cluster Info" key="0">
                     <ResourceProgress ref={(et)=>this.resourceProgressRef=et} parent={this}></ResourceProgress>
                    </TabPane>
                    <TabPane tab="Upload" key="1">
                        <UploadDropzone/>
                    </TabPane>
                    <TabPane tab="Dashboard" key="2">{this.renderDash()}</TabPane>
                    <TabPane tab="RawData" key="3">
                        <pre>{MLSQLStream.renderRawData(this.state.data)}</pre>
                    </TabPane>
                    <TabPane tab="History" key="4">
                        <QueryHistory ref={(et)=>this.queryHistory=et} parent={this}/>
                    </TabPane>

                    {/* <TabPane tab="Running jobs" key="5">
                        <QueryHistory ref={(et)=>this.queryHistory=et}/>
                    </TabPane> */}
                </Tabs>
            </Panel>
        </Collapse>)
    }

}