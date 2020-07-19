import * as React from "react";
import { Select, Form, Input } from 'antd';
import mix from "../../common/mixin"
import EngineService from "../service/EngineService";
import FuncDesc from "./FuncDesc";
import Tools from "../../common/Tools";
const { Option } = Select;

export default class ApplyFuncToField extends React.Component {
    constructor(props) {
        super(props)
        this.parent = props.parent
        this.operateField = props.operateField
        this.funcParams = {}
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
        const currentFunc = this.state.data.filter(item => item.value === value)[0]
        this.setState({ currentFunc })
        this.funcDescRef.show(currentFunc)
    }

    handleOperateInput = evt => {
        this.manuallyTransform = evt.target.value
    }

    handleNewName = evt => {
        this.newFuncName = evt.target.value
    }

    handleField = (evt) => {
        const name = evt.target.getAttribute("name")
        this.funcParams[name] = evt.target.value
    }

    showColumn = (item) => {
        this.funcParams[item.name] = this.operateField
        if (item.extra.column === "yes") {
            return this.operateField
        } else return ""
    }

    getTransform = () => {
        if(this.manuallyTransform){
            return {
                field:this.operateField,
                isAgg:false, 
                transformCode: this.manuallyTransform, 
                columnName: this.newFuncName 
            }
        }
        const params = []        
        this.state.currentFunc.params.forEach(item => {
            const v = this.funcParams[item.name]
            if (v) {
                if (item.extra.column === "yes") {
                    params.push(Tools.getField(v))
                }else if(item.dataType == "number" ||item.dataType == "boolean" ){
                    params.push(v)
                }
                else {
                    params.push(`"${v}"`)
                }
            }
        })
        const field = this.operateField
        const isAgg = this.state.currentFunc.funcValue.extra.agg === "yes"
        return {field,isAgg, transformCode: `${this.state.currentFunc.value}(${params.join(",")})`, columnName: this.newFuncName }
    }
    reload = () => {
        this.setState({
            key: Math.random(),
            data: [],
            value: undefined,
            funcPopUp: false,
            currentFunc: undefined
        })
        this.collect = {}
    }

    render() {
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
        return <Form className="login-form" key={this.state.key}>
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

            <Form.Item><FuncDesc ref={(et) => this.funcDescRef = et}></FuncDesc></Form.Item>
            {
                this.state.currentFunc ? this.state.currentFunc.params.map(item => {
                    return <Form.Item key={item.name}><Input name={item.name} onChange={this.handleField} addonBefore={item.name} defaultValue={this.showColumn(item)} />
                    </Form.Item>
                }) : <div></div>
            }
            <Form.Item><Input addonBefore="Mannual Transform" onChange={this.handleOperateInput} placeholder="" /></Form.Item>
            <Form.Item><Input addonBefore="New fieldName" onChange={this.handleNewName} placeholder="" /></Form.Item>
        </Form>
    }
}