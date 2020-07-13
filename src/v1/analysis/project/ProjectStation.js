import * as React from "react";
import { Tabs, Radio } from 'antd';
import '../common.scss'
import ApplyOrSave from "../ApplyOrSave";
import SelectFields from "./SelectFields"
import Tools from "../../../common/Tools";
import mix from "../../../common/mixin"
import { StationCommonOp } from "../commonops/StationCommonOp";
import RenameFields from "./RenameFields";
import FunctionField from "./FunctionField";

const { TabPane } = Tabs;

export default class ProjectStation extends mix(React.Component).with(StationCommonOp) {
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

    onFuncApply = async ()=>{
        this.ApplyOrSaveRef.enter()
        const fields = this.functionFieldRef.getSelectFields()        
        const currentFields = this.workshop.currentTable.schema.fields.map(item=>item.name)
        if(fields.length === 0){
            this.workshop.showMessage("No fields are renamed.")
            return
        }
        const newFields = fields.map(item=>{                        
            if(item["transformCode"]){
                return `${item["transformCode"]} as ${item["columnName"]}`
            } else return `${item["field"]} as ${item["field"]}`
            
        })        
        const tableName = Tools.getTempTableName()  
        const sql = `select ${newFields.join(",")} from ${this.workshop.getLastApplyTable().tableName} as ${tableName};`        
        await this.workshop.apply({tableName,sql})
        this.ApplyOrSaveRef.exit()
        this.workshop.refreshOperateStation()
     }

     onRenameApply = async ()=>{
        this.ApplyOrSaveRef.enter()
        const fields = this.renameFieldsRef.getSelectFields()    
        const currentFields = this.workshop.currentTable.schema.fields.map(item=>item.name)
        
        if(fields.length === 0){
            this.workshop.showMessage("No fields are renamed.")
            return
        }
        const newFields = Object.keys(fields).map(item=>{
            return `${item} as ${fields[item]}`
        })
        
        const tempC = Object.keys(fields)
        const leftFieds = currentFields.filter(item=> !tempC.includes(item))
        const tableName = Tools.getTempTableName()  
        const sql = `select ${leftFieds.concat(newFields).join(",")} from ${this.workshop.getLastApplyTable().tableName} as ${tableName};`        
        await this.workshop.apply({tableName,sql})
        this.ApplyOrSaveRef.exit()
        this.workshop.refreshOperateStation()


     }


    render() {
        return <div>
            <div className={"station-menu"}>                
                <Tabs defaultActiveKey="3" className={"station-tabs"}>
                    <TabPane tab="Select Columns" key="1">
                    <ApplyOrSave handleTableInput={this.handleTableInput} ref={(et)=>this.ApplyOrSaveRef=et} onSave={this.onSave} onApply={this.onApply} style={{marginBottom:"30px"}}></ApplyOrSave>                        
                        <SelectFields schemaFields={this.workshop.currentTable.schema.fields} ref={(et)=>this.selectFieldsRef=et} parent={this}></SelectFields>
                    </TabPane>
                    <TabPane tab="Rename Columns" key="2">
                    <ApplyOrSave handleTableInput={this.handleTableInput} ref={(et)=>this.ApplyOrSaveRef=et} onSave={this.onSave} onApply={this.onRenameApply} style={{marginBottom:"30px"}}></ApplyOrSave>
                        <RenameFields schemaFields={this.workshop.currentTable.schema.fields} ref={(et)=>this.renameFieldsRef=et} parent={this}></RenameFields>
                    </TabPane>
                    <TabPane tab="Transform Columns" key="3">
                    <ApplyOrSave handleTableInput={this.handleTableInput} ref={(et)=>this.ApplyOrSaveRef=et} onSave={this.onSave} onApply={this.onFuncApply} style={{marginBottom:"30px"}}></ApplyOrSave>                        
                       <FunctionField ref={(et)=>this.functionFieldRef=et} parent={this}></FunctionField>
                    </TabPane>
                </Tabs>
            </div>
            <div>

            </div>
        </div>
    }
}