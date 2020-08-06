import * as React from "react";
import { Tabs, Switch, Menu, Button, Modal, Input } from 'antd';
import ApplyFuncToField from "../ApplyFuncToField";
import ColumnOperate from "../ColumnOperate";
import AlertBox from "../../AlertBox";
export default class FunctionField extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.state = this.wow(props)
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.schemaFields !== prevProps.schemaFields) {
          this.setState({ ...this.wow(this.props) },()=>{
            this.reload()
          })
        }
      }

      wow = (props)=>{
        const fields = props.schemaFields

        const data = fields.map(item => {
            return { field: item.name, func: "", transformCode: "", "columnName": "" }
        })

        const config = {
            render: {
                func: (value, record) => {
                    return <Button key={record.field} dataref={record} onClick={() => { 
                        this.showAggFuncsAndApply(record) 
                    }}>Choose function</Button>
                },
                transformCode: (value, record) => {                
                    return value
                },
                columnName: (value, record) => {                
                    return value
                }
            }
        }
        return { funcPopUp: false, data, config }
      }

    showAggFuncsAndApply = (record) => {
        this.operateField = record.field
        this.setState({ funcPopUp: true })
    }

    reload = () => {        
        this.columnsRef.update(this.state.data, this.state.config)
    }

    componentDidMount() {
        this.reload()
    }

    handleFunc = () => {
        this.applyFuncToFieldRef.operateField = this.operateField
        const { field, transformCode, columnName,isAgg } = this.applyFuncToFieldRef.getTransform()
        if(!columnName){
           this.setState({"error":"New fieldName is required."}) 
           return 
        }
        const data = this.state.data.map(item => {
            if (item.field === field) {
                return { field, func: "", transformCode, columnName,isAgg}
            }
            return item
        })        
        this.setState({ funcPopUp: false, data,error:undefined }, () => { this.reload() })
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
                    this.setState({ funcPopUp: false,error:undefined })
                }}
                onOk={
                    this.handleFunc
                }
                cancelText="Cancel"
                width="50%"
                OkText="Ok">
                {this.state.error && <AlertBox message={this.state.error}></AlertBox>}
                <ApplyFuncToField parent={this} ref={(et) => this.applyFuncToFieldRef = et} operateField={this.operateField}></ApplyFuncToField>
            </Modal>
            <ColumnOperate ref={et => this.columnsRef = et}></ColumnOperate>
        </div>
    }
}