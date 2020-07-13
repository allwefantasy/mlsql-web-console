import * as React from "react";
import { Tabs, Radio } from 'antd';

import mix from "../../../common/mixin"
import { StationCommonOp } from "../commonops/StationCommonOp";

const { TabPane } = Tabs;


export default class FilterStation extends mix(React.Component).with(StationCommonOp) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
    }

    
    render() {
        return <div>
            <div className={"station-menu"}>
                
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Equal" key="1">
                    
                    </TabPane>
                    <TabPane tab="Enum" key="2">
                    
                    </TabPane>
                    <TabPane tab="Wildcard Match" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
            <div>

            </div>
        </div>
    }
}