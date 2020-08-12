import * as React from "react";
import mix from "../../common/mixin"
import "./OperateStation.scss"
import { Tabs, Radio } from 'antd';
import JoinStation from "./join/JoinStation";
import AggStation from "./agg/AggStation";
import ProjectStation from "./project/ProjectStation";
import FilterStation from "./filter/FilterStation";
import { OrderStation } from "./order/OrderStation";
import { LimitStation } from "./limit/LimitStation"
import { WindowStation } from "./window/WindowStation";
import { DashStation } from "./dash/DashStation";
import { FormattedMessage } from 'react-intl'
import { Resizable } from "re-resizable";
import AnalysisWorkshop from "./workshop";
import Tools from "../../common/Tools";
import { UnionStation } from "./union/UnionStation";
import { PivotStation } from "./pivot/PivotStation";
import { AnalysisPluginStation } from "./plugin/AnalysisPluginStation";
const { TabPane } = Tabs;

export default class OperateStation extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = AnalysisWorkshop.workshop
        this.state = { key: Tools.getJobName() }
    }

    reload = () => {
        this.setState({ key: Tools.getJobName() })
    }

    render() {
        return <div className="os-pane" style={{ backgroundColor: "white" }}>
            <div className="os-tabs">
                <Resizable style={{ borderBottom: "solid", width: "100%", overflow: "scroll" }}>
                    <Tabs defaultActiveKey="1" tabPosition="left" key={this.state.key}>
                        <TabPane tab={<FormattedMessage id="project" />} key={1} >
                            <ProjectStation parent={this}></ProjectStation>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="filter" />} key={2} >
                            <FilterStation parent={this}></FilterStation>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="agg" />} key={4} >
                            <AggStation parent={this}></AggStation>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="order" />} key={5} >
                            <OrderStation parent={this}></OrderStation>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="pivot" />} key={10} >
                            <PivotStation/>
                        </TabPane>
                        <TabPane tab={<FormattedMessage id="more" />} key={100}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<FormattedMessage id="join" />} key={3}>
                                    <JoinStation parent={this}></JoinStation>
                                </TabPane>
                                <TabPane tab={<FormattedMessage id="limit" />} key={6} >
                                    <LimitStation parent={this}></LimitStation>
                                </TabPane>
                                <TabPane tab={<FormattedMessage id="window" />} key={7} >
                                    <WindowStation parent={this}></WindowStation>
                                </TabPane>                                
                                <TabPane tab={<FormattedMessage id="union" />} key={9} >
                                    <UnionStation/>
                                </TabPane>
                                <TabPane tab={<FormattedMessage id="dash" />} key={8} >
                                    <DashStation parent={this}></DashStation>
                                </TabPane>
                                <TabPane tab={<FormattedMessage id="plugin" />} key={11} >
                                    <AnalysisPluginStation></AnalysisPluginStation>
                                </TabPane>
                            </Tabs>
                        </TabPane>

                    </Tabs>
                </Resizable>
            </div>

        </div >
    }
}