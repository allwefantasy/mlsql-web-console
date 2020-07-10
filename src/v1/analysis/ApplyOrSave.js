import * as React from "react";
import { Menu, Button, Modal, Form, Input, FuncDesc } from 'antd';
import './ApplyOrSave.scss'

const { SubMenu } = Menu;
export default class ApplyOrSave extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
        this.state = { applyLoading: false,saveDiagram:false }
    }
    enter = () => {
        this.setState({ applyLoading: true })
    }
    exit = () => {
        this.setState({ applyLoading: false })
    }

    showSaveDiagram = ()=>{
      this.toggle()
    }

    toggle = () => {
        this.setState({ saveDiagram: !this.state.saveDiagram })
    }
    
    handleTableInput = ()=>{}

    render() {
        return <div style={this.props.style} className={this.props.className || "aos-box"}>
            <Modal title={"View"}
                visible={this.state.saveDiagram}
                onCancel={this.toggle}
                onOk={this.props.onSave}
                cancelText="Cancel"
                width="50%"
                OkText="Ok">
                <Form className="login-form">
                    <Form.Item><Input addonBefore="tableName" onChange={this.props.handleTableInput || this.handleTableInput} placeholder="" /></Form.Item>
                </Form>
            </Modal>
            <div className="aos-button"><Button loading={this.state.applyLoading} onClick={this.props.onApply} type="primary">Apply</Button></div>
            <div className="aos-button"><Button disabled={this.state.applyLoading} onClick={this.toggle} type="primary">Save As</Button></div>
        </div>
    }
}