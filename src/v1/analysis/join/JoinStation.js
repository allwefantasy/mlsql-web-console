import * as React from "react";
import mix from "../../../common/mixin"
import { Tabs, Radio, Menu } from 'antd';
import ApplyOrSave from "../ApplyOrSave";
import { StationCommonOp } from "../commonops/StationCommonOp";

const { TabPane } = Tabs;


export default class JoinStation extends mix(React.Component).with(StationCommonOp) {
    constructor(props) {
        super(props)
    }
    render() {
        return <div>
            <div className={"station-menu"}>
               <ApplyOrSave handleTableInput={this.handleTableInput} ref={(et)=>this.ApplyOrSaveRef=et} onSave={this.onSave} onApply={this.onApply} style={{marginBottom:"30px"}}></ApplyOrSave>
                        table1 left join table2 on table1.a = table2

            </div>
            <div>

            </div>
        </div>
    }
}