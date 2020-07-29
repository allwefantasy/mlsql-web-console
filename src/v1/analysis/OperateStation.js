import * as React from "react";
import mix from "../../common/mixin"
import "./OperateStation.scss"
import { Tabs, Radio } from 'antd';
import JoinStation from "./join/JoinStation";
import AggStation from "./agg/AggStation";
import ProjectStation from "./project/ProjectStation";
import FilterStation from "./filter/FilterStation";
import { OrderStation } from "./order/OrderStation";
import {LimitStation} from "./limit/LimitStation"
import { WindowStation } from "./window/WindowStation";
import { DashStation } from "./dash/DashStation";
import {FormattedMessage} from 'react-intl'
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
                <Tabs defaultActiveKey="1" tabPosition="left" key={this.state.key}>                
                <TabPane tab={<FormattedMessage id="project"/>}  key={1} >
                    <ProjectStation parent={this}></ProjectStation>
                </TabPane>
                <TabPane tab={<FormattedMessage id="filter"/>}  key={2} >
                    <FilterStation parent={this}></FilterStation>
                </TabPane>
                <TabPane tab={<FormattedMessage id="join"/>}  key={3}>
                    <JoinStation  parent={this}></JoinStation>
                </TabPane>
                <TabPane tab={<FormattedMessage id="agg"/>} key={4} >
                    <AggStation parent={this}></AggStation>
                </TabPane>
                <TabPane tab={<FormattedMessage id="order"/>} key={5} >
                    <OrderStation parent={this}></OrderStation>
                </TabPane>
                <TabPane tab={<FormattedMessage id="limit"/>} key={6} >
                    <LimitStation parent={this}></LimitStation>
                </TabPane>
                <TabPane tab={<FormattedMessage id="window"/>} key={7} >
                    <WindowStation parent={this}></WindowStation>
                </TabPane>
                <TabPane tab={<FormattedMessage id="dash"/>} key={8} >
                    <DashStation parent={this}></DashStation>
                </TabPane>
                </Tabs>
                </div>
            
        </div>
    }
}