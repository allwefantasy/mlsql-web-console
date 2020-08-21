import * as React from "react";
import { Form, Table, Button, Modal, Input, Select, Divider, Collapse } from 'antd';
import ApplyOrSave from "../ApplyOrSave";
import { FilterCondition } from "./FilterCondition";
export default class Compare extends React.Component {
    constructor(props) {
        super(props)
        this.fitlerStation = props.parent
        this.workshop = props.parent.workshop
        this.state = this.wow(props.schemaFields)
        this.forms = {}
    }

    reload = (data) => {
        this.setState({ ...this.wow(data) })
    }

    wow = (schemaFields) => {
        const fields = schemaFields
        const data = fields.map(item => {
            return { key: item.name, field: item.name, dataType: item.type, compare: "=", condition: "", command: "" }
        })

        const columns = [
            {
                title: "field",
                dataIndex: "field"
            },
            {
                title: "dataType",
                dataIndex: "dataType",
                render: (value, record) => {

                    switch ((typeof value)) {
                        case 'object':
                            return <span>{value.type}</span>
                        default:
                            return <span>{value}</span>
                    }
                }
            },
            {
                title: "",
                dataIndex: "compare",
                render: (value, record) => {
                    return <FilterCondition forms={this.forms} record={record} workshop ={this.workshop}/>
                }
            }

        ]
        return { funcPopUp: false, data, columns }
    }

    buildSelectedRows = ()=>{
        const fieldToDataType = {}
        this.state.data.forEach(item=>{
            fieldToDataType[item.field] = item.dataType
        })

        const params = Object.entries(this.forms).map(([key,value])=>{
            const {compare,condition} = value.getFieldsValue()
            if(compare){
                return {field:key,compare,condition,dataType:fieldToDataType[key]}
            }
            return {}
        })
        if(!this.selectedRowKeys) {
            return []
        }
        return params.filter(item => this.selectedRowKeys.includes(item.field))
    }

    addGroup = (values) => {        
        const { groupName, groupType } = values
        if (!groupName || !groupType) {
            this.workshop.showInfo("Error: groupName and groupType is required.")
            return
        }
        if(!this.selectedRowKeys){
            this.workshop.showInfo("Please select fields")
            return
        }
        
        const selectedRows = this.buildSelectedRows()

        this.fitlerStation.conGroups[groupName] = { groupName, groupType, tp: "basic", data: selectedRows }
        if (this.fitlerStation.applyGroup) {
            this.fitlerStation.applyGroup.reload({ data: this.fitlerStation.conGroups })
        }
        if (this.fitlerStation.groupGroup) {
            this.fitlerStation.groupGroup.reload({ data: this.fitlerStation.conGroups })
        }        
        this.workshop.showInfo("Add successfully")
    }


    render = () => {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.selectedRowKeys = selectedRowKeys
            },
            getCheckboxProps: record => ({
                name: record.field
            })
        }
        return <div className="common-one-hundred-percent-width common-column-layout">                     
            <div style={{marginRight:"30px",width:"80%"}}>
            <ApplyOrSave parent={this} onRollback={this.fitlerStation.onRollback} handlePersit={this.fitlerStation.handlePersit} handleTableInput={this.fitlerStation.handleTableInput} ref={(et) => this.fitlerStation.ApplyOrSaveRef = et} onSave={this.fitlerStation.onSave} onApply={()=>{
                const selectedRows = this.buildSelectedRows()
                this.fitlerStation.onNonGroupFilterApply(selectedRows)
            }} style={{ marginBottom: "30px" }}></ApplyOrSave>                                  
            <Table pagination={{pageSize:5,hideOnSinglePage:true}}            
            rowSelection={{
                type: "checkbox",
                ...rowSelection,
            }} columns={this.state.columns}
                dataSource={this.state.data}>

            </Table>
            </div>
            <Form onFinish={this.addGroup}>
                <Form.Item name={"groupName"} label="Group Name"><Input></Input></Form.Item>
                <Form.Item name={"groupType"} label="Group Type" defaultValue={"and"}><Select >
                    <Select.Option value="and">and</Select.Option>
                    <Select.Option value="or">or</Select.Option>
                </Select></Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">Add selected conditions to group</Button>                    
                </Form.Item>
            </Form> 
        </div>
    }
}