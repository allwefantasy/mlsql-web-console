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
                    return <Switch onChange={(checked)=>this.enableGroupByField(checked,record)} dataref={record} />
                },
                agg: (value, record) => {
                    return <Button dataref={record} onClick={() => { this.showAggFuncsAndApply(record) }}>Choose function</Button>
                }
            }
        }
        this.columnsRef.update(result, config)
    }

    componentDidMount() {
        this.reload()
    }
    
    handleFunc = ()=>{
      const {name,newName} = this.applyFuncToFieldRef.collect
      this.generateProjectField(name,newName)
      this.setState({ funcPopUp: false })
      this.applyFuncToFieldRef.setState({key:Math.random()})
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
                    <ApplyFuncToField ref={(et)=>this.applyFuncToFieldRef=et} operateField={this.operateField}></ApplyFuncToField>
                </Modal>
                
                <div className="station-menu">
                    <ApplyOrSave onApply={this.onApply} handleTableInput={this.handleTableInput} onSave={this.onSave} ref={et=>this.applyOrSaveRef=et}></ApplyOrSave>
                    <Menu mode="horizontal">
                        <SubMenu title="Navigation Three - Submenu">
                            <Menu.ItemGroup title="Item 1">
                                <Menu.Item key="setting:1">Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                            </Menu.ItemGroup>
                            <Menu.ItemGroup title="Item 2">
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>
                        <Menu.Item key="alipay">
                            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                                Navigation Four - Link</a>
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
            <div>
                <ColumnOperate ref={et => this.columnsRef = et}></ColumnOperate>
            </div>
        </div>
    }
}