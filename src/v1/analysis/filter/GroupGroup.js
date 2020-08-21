import * as React from "react";
import { Divider, Form, Table, Button, Modal, Input, Select } from 'antd';
import Tools from "../../../common/Tools";
export default class GroupGroup extends React.Component {
    constructor(props) {
        super(props)
        this.fitlerStation = props.parent
        this.workshop = props.parent.workshop
        this.state = this.wow(props)
    }

    reload = (data) => {
        this.setState({ ...this.wow(data) })
    }

    wow = (props) => {
        const fields = Object.keys(props.data).map(item => { return { groupName: item } })

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

    addGroup = (values) => {
        const { groupName, groupType } = values
        if (!groupName || !groupType) {
            this.workshop.showInfo("Error: groupName and groupType is required.")
            return
        }
        const selectedRows = this.selectedRowKeys.map(groupName => {
            return this.fitlerStation.conGroups[groupName]
        })
        this.fitlerStation.conGroups[groupName] = { groupName, groupType, tp: "group", data: selectedRows }
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
                name: record.title
            })
        }
        return <div >
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