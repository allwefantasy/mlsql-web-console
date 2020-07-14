import * as React from "react";
import { Tabs, Divider } from 'antd';
import ApplyOrSave from "../ApplyOrSave";
import '../common.scss'
import mix from "../../../common/mixin"
import { StationCommonOp } from "../commonops/StationCommonOp";
import Compare from "./Compare"
import OrGroup from "./OrGroup";
import ApplyGroup from "./ApplyGroup";

const { TabPane } = Tabs;


export default class FilterStation extends mix(React.Component).with(StationCommonOp) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.conGroups = {}
    }

    
    render() {
        return <div>
            <div className={"station-menu"}>                
                <Tabs defaultActiveKey="1" className={"station-tabs"}>
                    <TabPane tab="Compare" key="1">                                        
                    <Compare parent={this} schemaFields={this.workshop.currentTable.schema.fields}></Compare>
                    </TabPane>                    
                    <TabPane tab="Group Or" key="2">
                        <OrGroup parent={this} data={this.conGroups}></OrGroup>
                    </TabPane>
                    <TabPane tab="Group And" key="3">
                        Content of Tab Pane 3
                    </TabPane> 
                    <TabPane tab="Apply Group" key="4">
                        <ApplyOrSave onRollback={this.onRollback} handlePersit={this.handlePersit} handleTableInput={this.handleTableInput} ref={(et)=>this.ApplyOrSaveRef=et} onSave={this.onSave} onApply={this.onSelectApply} style={{marginBottom:"30px"}}></ApplyOrSave>
                        <Divider />
                        <ApplyGroup parent={this} data={this.conGroups}></ApplyGroup>
                    </TabPane>                    
                </Tabs>
            </div>
            <div>

            </div>
        </div>
    }
}