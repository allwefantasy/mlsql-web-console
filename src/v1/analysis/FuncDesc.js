import * as React from "react";
import { Select, List, Input } from 'antd';
const { Option } = Select;

export default class FuncDesc extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    show = (func) => {
        this.setState({ func })
    }

    funcValue = () => {
        return <List.Item key="Func" >
            <List.Item.Meta title="Func" description={this.state.func.funcValue.extra.zhDoc}>
            </List.Item.Meta>
        </List.Item>
    }

    returnValue = () => {
        return <List.Item key="Return value" >
            <List.Item.Meta title="Return value" description={this.state.func.returnValue.extra.zhDoc}>
            </List.Item.Meta>
        </List.Item>
    }
  
    parameters = () => {
        return this.state.func.params.map(item => {
            return <List.Item key={item.name} >
                <List.Item.Meta title={item.name} description={item.extra.zhDoc}>                    
                </List.Item.Meta>
            </List.Item>
        })
    }

    render() {
        if (this.state.func) {
            return <List
                size="large"
                header={<div>{`Function [${this.state.func.value}] Info`}</div>}
                footer={<div></div>}
                bordered
            >
                {this.funcValue()}
                {this.returnValue()}
                {this.parameters()}
            </List>
        } else {
            return <div></div>
        }
    }
}