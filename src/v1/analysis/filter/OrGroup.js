import * as React from "react";
import { Divider, Form, Table, Button, Modal, Input, Select } from 'antd';
import ApplyFuncToField from "../ApplyFuncToField";
export default class OrGroup extends React.Component {
    constructor(props) {
        super(props)
        this.fitlerStation = props.parent
        this.workshop = props.parent.workshop
        this.state = this.wow(props)
        this.params = []
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.data !== prevProps.data) {
            this.setState({ ...this.wow(this.props) })
        }
    }

    compareInput = (value, record) => {
        const items = this.params.filter(item => item.field === record.field)
        if (items.length == 1) {
            items[0]["compare"] = value
        } else {
            this.params.push({
                ...record,
                compare: value
            })
        }
    }

    conditionInput = (value, record) => {
        const items = this.params.filter(item => item.field === record.field)
        if (items.length === 1) {
            items[0]["condition"] = value
        } else {
            this.params.push({
                ...record,
                condition: value
            })
        }
    }    

    wow = (props) => {
        const fields = Object.keys(props.data).map(item=> {return {groupName:item}})

        const data = fields.map(item => {
            return { key: item.groupName, groupName: item.groupName }
        })

        const columns = [
            {
                title: "groupName",
                dataIndex: "groupName"
            }            
        ]
        return { funcPopUp: false, data, columns }
    }

    addGroup=(values)=>{
       const {groupName,groupType} = values    
       const selectedRows = this.params.filter(item=>this.selectedRowKeys.includes(item.field))       
       this.fitlerStation.conGroups[groupName] = {groupName,groupType,data:selectedRows}       
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
        return <div >
            <Modal
                title={`Apply function to [${this.operateField}]`}
                visible={this.state.funcPopUp}
                onCancel={() => {
                    this.applyFuncToFieldRef.reload()
                    this.setState({ funcPopUp: false })
                }}
                onOk={
                    this.handleFunc
                }
                cancelText="Cancel"
                width="50%"
                OkText="Ok">
                <ApplyFuncToField parent={this} ref={(et) => this.applyFuncToFieldRef = et} operateField={this.operateField}></ApplyFuncToField>
            </Modal>
            <Form onFinish={this.addGroup}>
                <Form.Item name={"groupName"} label="Group Name"><Input></Input></Form.Item>
                <Form.Item name={"groupType"} label="Group Type" defaultValue={"and"}><Select >
                    <Select.Option value="and">and</Select.Option>
                    <Select.Option value="or">or</Select.Option>
                </Select></Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">Add selected</Button>
                </Form.Item>
            </Form>
            <Table rowSelection={{
                type: "checkbox",
                ...rowSelection,
            }} columns={this.state.columns}
                dataSource={this.state.data}>

            </Table>
        </div>
    }
}