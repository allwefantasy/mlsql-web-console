import * as React from "react";
import Modal from "../../../node_modules/antd/lib/modal/Modal";
import {ETPopLoad} from "./ETPopLoad";
import {ETPopAlgorithm} from "./ETPopAlgorithm";
import {ETPopSave} from "./ETPopSave";
import {ETPopTool} from "./ETPopTool";
import {ETPopDownload} from "./ETPopDownload";
import {ETPopScriptUDF} from "./ETPopScriptUDF";
import {ETExample} from "./ETExample";
import {ETRegister} from "./ETRegister";
import ETStringIndex from "./ETStringIndex";

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
        }

        if (this.et.state.eventName === "DownloadExt") {
            return <ETPopDownload name={this.et.state.eventName} ref={this.popChild}/>
        }

        if (this.et.state.eventName === "ETStringIndex") {
            return <ETStringIndex name={this.et.state.eventName} ref={this.popChild}/>
        }

        if (this.et.state.eventName === "ETExample") {
            return <ETExample name={this.et.state.eventName} ref={this.popChild}/>
        }

        if (this.et.state.eventName === "ScriptUDF") {
            return <ETPopScriptUDF name={this.et.state.eventName} ref={this.popChild}/>
        }

        if (this.et.state.eventName === "register") {
            return <ETRegister name={this.et.state.eventName} ref={this.popChild} {...this.et.state}/>
        }

        if (this.et.state.processType === "tool") {
            return <ETPopTool name={this.et.state.eventName} ref={this.popChild} {...this.et.state}/>
        }

        return <ETPopAlgorithm name={this.et.state.eventName} ref={this.popChild}/>
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