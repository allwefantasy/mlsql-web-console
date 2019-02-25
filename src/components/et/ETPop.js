import * as React from "react";
import Modal from "../../../node_modules/antd/lib/modal/Modal";
import {ETPopLoad} from "./ETPopLoad";
import {ETPopAlgorithm} from "./ETPopAlgorithm";
import {ETPopSave} from "./ETPopSave";

export class ETPop extends React.Component {
    constructor(props) {
        super(props)
        this.et = props.parent
        this.popChild = React.createRef()
        this.state = {etModalVisible: true, title: props.title}
        this.data = {}
    }

    disableEtModalVisible = () => {
        this.et.setState({etPop: false, etModalVisible: false})
    }
    enableEtModalVisible = () => {
        const sql = this.popChild.current.makeMLSQL()
        this.et.makeMLSQL(sql)
        this.et.setState({etPop: false, etModalVisible: false})
    }

    renderContent = () => {
        if (this.et.state.eventName === "load") {
            return <ETPopLoad parent={this} ref={this.popChild}/>
        }
        if (this.et.state.eventName === "save") {
            return <ETPopSave name={this.et.state.eventName} ref={this.popChild}/>
        } else {
            return <ETPopAlgorithm name={this.et.state.eventName} ref={this.popChild}/>
        }
        return null
    }


    render() {
        return (
            <div>
                <Modal
                    title={this.state.title}
                    visible={this.state.etModalVisible}
                    onCancel={this.disableEtModalVisible}
                    onOk={this.enableEtModalVisible}
                    okText="Ok"
                    cancelText="Cancel"
                >
                    {this.renderContent()}
                </Modal>
            </div>
        )
    }
}