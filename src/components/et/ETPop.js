import * as React from "react";
import Modal from "../../../node_modules/antd/lib/modal/Modal";


export class ETPop extends React.Component {
    constructor(props) {
        super(props)
        this.queryEditor = props.parent
        this.state = {etModalVisible: true}
    }

    disableEtModalVisible = () => {
        this.setState({etModalVisible: false})
    }
    enableEtModalVisible = () => {
        this.setState({etModalVisible: false})
    }


    render() {
        return (
            <div>
                <Modal
                    title="Modal"
                    visible={this.state.etModalVisible}
                    onCancel={this.disableEtModalVisible}
                    onOk={this.enableEtModalVisible}
                    okText="确认"
                    cancelText="取消"
                >
                    <p>Bla bla ...</p>
                    <p>Bla bla ...</p>
                    <p>Bla bla ...</p>
                </Modal>
            </div>
        )
    }
}