import * as React from "react";
import mix from "../../common/mixin"
import "./OperateStation.scss"
import { Tabs, Radio } from 'antd';
import JoinStation from "./join/JoinStation";
import MainStation from "./MainStation";
import AggStation from "./agg/AggStation";
import ProjectStation from "./project/ProjectStation";
const { TabPane } = Tabs;

export default class OperateStation extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent
        this.state = { key: Math.random() }
    } 

    reload = ()=>{
        this.setState({key:Math.random()})
    }
       
    render() {
        return <div className="os-pane">
            <div className="os-tabs">
                <Tabs defaultActiveKey="3" tabPosition="left" key={this.state.key}>
                <TabPane tab="Main" key={0} >
                    <MainStation ></MainStation>
                </TabPane>
                <TabPane tab="Project" key={1} >
                    <ProjectStation parent={this}></ProjectStation>
                </TabPane>
                <TabPane tab="Filter" key={2} >
                    <AggStation parent={this}></AggStation>
                </TabPane>
                <TabPane tab="Join" key={3}>
                    <JoinStation  parent={this}></JoinStation>
                </TabPane>
                <TabPane tab="Agg" key={4} >
                    <AggStation parent={this}></AggStation>
                </TabPane>
                </Tabs></div>
            <div className="os-main"></div>
        </div>
    }
}