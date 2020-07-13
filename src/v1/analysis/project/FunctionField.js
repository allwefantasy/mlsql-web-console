import * as React from "react";
import { Tabs, Switch, Menu, Button, Modal, Input } from 'antd';
import ApplyFuncToField from "../ApplyFuncToField";
import ColumnOperate from "../ColumnOperate";
export default class FunctionField extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop

        const fields = this.workshop.currentTable.schema.fields

        const data = fields.map(item => {
            return { field: item.name, func: "", transformCode: "", "columnName": "" }
        })

        const config = {
            render: {
                func: (value, record) => {
                    return <Button dataref={record} onClick={() => { this.showAggFuncsAndApply(record) }}>Choose function</Button>
                },
                transformCode: (value, record) => {                
                    return <Input key={value} defaultValue={value} />
                },
                columnName: (value, record) => {                
                    return <Input key={value} defaultValue={value} />
                }
            }
        }
        this.state = { funcPopUp: false, data, config }
    }

    showAggFuncsAndApply = (record) => {
        this.operateField = record.field
        this.setState({ funcPopUp: true })
    }

    reload = () => {
        console.log(this.state.data)
        this.columnsRef.update(this.state.data, this.state.config)
    }

    componentDidMount() {
        this.reload()
    }

    handleFunc = () => {
        const { field, transformCode, columnName } = this.applyFuncToFieldRef.getTransform()
        const data = this.state.data.map(item => {
            if (item.field === field) {
                return { field, func: "", transformCode, columnName }
            }
            return item
        })        
        this.setState({ funcPopUp: false, data }, () => { this.reload() })
        this.applyFuncToFieldRef.reload()
    }

    getSelectFields = ()=>{        
        return this.state.data
    }

    render = () => {
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
            <ColumnOperate ref={et => this.columnsRef = et}></ColumnOperate>
        </div>
    }
}