import * as React from "react";
import { Select, Form, Input } from 'antd';
import mix from "../../common/mixin"
import EngineService from "../service/EngineService";
import FuncDesc from "./FuncDesc";
const { Option } = Select;

export default class ApplyFuncToField extends React.Component {
    constructor(props) {
        super(props)
        this.operateField = props.operateField
        this.collect = {}
        this.state = {
            data: [],
            value: undefined,
            funcPopUp: false,
            func: {},
            key: Math.random()
        }
    }

    handleSearch = async value => {
        if (value) {
            const res = await EngineService.showFunctions()
            const data = res.content.map((item) => {
                return {
                    value: item.key.table,
                    text: item.key.table,
                    funcValue: item.columns[0],
                    returnValue: item.columns[1],
                    params: item.columns.slice(2, item.columns.length)
                }
            })
            this.setState({ data })
        } else {
            this.setState({ data: [] })
        }
    }
    handleChange = value => {
        this.funcDescRef.show(this.state.data.filter(item => item.value === value)[0])         
    } 
    
    handleOperateInput = evt=>{
        this.collect.name = evt.target.value
    }
    handleNewName = evt=>{
        this.collect.newName = evt.target.value
    }

    render() {
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
        return <Form  className="login-form" key={this.state.key}>
            <Form.Item>
            <Select
                showSearch
                value={this.state.value}
                placeholder={"Search function"}
                defaultActiveFirstOption={false}
                showArrow={false}
                style={{ width: "200px" }}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={"type function name"}
            >
                {options}
            </Select>
            </Form.Item>
            
            <Form.Item><FuncDesc ref={(et)=>this.funcDescRef=et}></FuncDesc></Form.Item>
            <Form.Item><Input addonBefore="Operate" onChange={this.handleOperateInput} placeholder="" /></Form.Item>
            <Form.Item><Input addonBefore="New fieldName"  onChange={this.handleNewName} placeholder="" /></Form.Item>  
        </Form>
    }
}