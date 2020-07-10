import * as React from "react";
import { Tabs, Radio } from 'antd';
import './JoinStation.scss'
import './common.scss'
import ApplyOrSave from "./ApplyOrSave";
import SelectFields from "./project/SelectFields"
import Tools from "../../common/Tools";

const { TabPane } = Tabs;


export default class ProjectStation extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
    }

    onApply = async ()=>{
       this.ApplyOrSaveRef.enter()
       const fields = this.selectFieldsRef.getSelectFields()
       if(fields.length === 0){
           this.workshop.showMessage("No fields are selected.")
           return
       }
       const tableName = Tools.getTempTableName()
       const sql = `select ${fields.join(",")} from ${this.workshop.getLastApplyTable().tableName} as ${tableName};`
       await this.workshop.apply({tableName,sql})
       this.ApplyOrSaveRef.exit()
       this.workshop.refreshOperateStation()
    }
    render() {
        return <div>
            <div className={"station-menu"}>
                
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Select" key="1">
                    <ApplyOrSave ref={(et)=>this.ApplyOrSaveRef=et}  onApply={this.onApply} style={{marginBottom:"30px"}}></ApplyOrSave>
                        <SelectFields ref={(et)=>this.selectFieldsRef=et} parent={this}></SelectFields>
                    </TabPane>
                    <TabPane tab="Rename" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="Function" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
            <div>

            </div>
        </div>
    }
}