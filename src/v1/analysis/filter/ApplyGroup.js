import * as React from "react";
import { Divider, Form, Table, Button, Modal, Input, Select } from 'antd';
import ApplyFuncToField from "../ApplyFuncToField";
export default class ApplyGroup extends React.Component {
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
            <Table rowSelection={{
                type: "checkbox",
                ...rowSelection,
            }} columns={this.state.columns}
                dataSource={this.state.data}>

            </Table>
        </div>
    }
}