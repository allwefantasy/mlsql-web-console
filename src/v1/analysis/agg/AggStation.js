import * as React from "react";
import mix from "../../../common/mixin"
import { Tabs, Switch, Menu, Button, Modal } from 'antd';
import ApplyOrSave from "../ApplyOrSave";
import ColumnOperate from "../ColumnOperate";
import { AggStationOp } from "./AggStationOp";
import ApplyFuncToField from "../ApplyFuncToField";
import { StationCommonOp } from "../commonops/StationCommonOp";

const { SubMenu } = Menu;


export default class AggStation extends mix(React.Component).with(StationCommonOp,AggStationOp) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.state = { funcPopUp: false }
        this.groupByFields = []
        // {name,newName}   
        this.aggFields = []
    }

    showAggFuncsAndApply = (record) => {
        this.operateField = record.field
        this.setState({ funcPopUp: true })        
    }

    reload = () => {
        const fields = this.workshop.currentTable.schema.fields
        const result = fields.map(item => {
            return { field: item.name, groupby: "", agg: "" }
        })
        const config = {
            render: {
                groupby: (value, record) => {
                    return <Switch key={record.field} defaultChecked={record._groupBy} onChange={(checked)=>{
                        this.enableGroupByField(checked,record)
                        record._groupBy = checked
                    }} dataref={record} />
                },
                agg: (value, record) => {
                    return <>
                    <Button key={record.field} style={{marginRight:"30px"}} dataref={record} onClick={() => {                         
                        this.showAggFuncsAndApply(record) 
                    }}>Choose function</Button><span>{record._agg && `(${record._agg})`||""}</span></>
                }
            }
        }
        this.columnsRef.update(result, config)
    }

    componentDidMount() {
        this.reload()
    }
    
    handleFunc = ()=>{ 
      this.applyFuncToFieldRef.operateField = this.operateField       
      const { field, transformCode, columnName } = this.applyFuncToFieldRef.getTransform()              
      const record = this.columnsRef.state.data.filter(item=>item.field === field)[0]
      record._agg = `${transformCode} as ${columnName}`
      this.generateProjectField(transformCode,columnName)
      this.setState({ funcPopUp: false })
      this.applyFuncToFieldRef.reload()
    }    

    render() {
        return <div>
            <div>
                <Modal
                    title={`Apply function to [${this.operateField}]`}
                    visible={this.state.funcPopUp}
                    onCancel={() => { 
                        this.setState({ funcPopUp: false }) 
                        this.applyFuncToFieldRef.setState({key:Math.random()})
                    }}
                    onOk={
                        this.handleFunc
                    }
                    cancelText="Cancel"
                    width="50%"
                    OkText="Ok">
                    <ApplyFuncToField parent={this} ref={(et)=>this.applyFuncToFieldRef=et} operateField={this.operateField}></ApplyFuncToField>
                </Modal>
                
                <div className="station-menu">
                   <ApplyOrSave parent={this} onRollback={this.onRollback} handlePersit={this.handlePersit} handleTableInput={this.handleTableInput} ref={(et)=>this.ApplyOrSaveRef=et} onSave={this.onSave} onApply={this.onApply} style={{marginBottom:"30px"}}></ApplyOrSave>
                </div>
            </div>
            <div>
                <ColumnOperate parent={this} ref={et => this.columnsRef = et}></ColumnOperate>
            </div>
        </div>
    }
}