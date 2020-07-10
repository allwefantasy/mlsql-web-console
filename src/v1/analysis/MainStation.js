import * as React from "react";
import mix from "../../common/mixin"
import { Tabs, Radio, Menu, Button, Modal } from 'antd';
import './JoinStation.scss'
import './common.scss'
import ApplyOrSave from "./ApplyOrSave";

const { SubMenu } = Menu;


export default class MainStation extends React.Component {
    constructor(props) {
        super(props)
        this.state = { popup: false }
    }

    wow = () => {

    }

    showSaveAs = () => {
        this.setState({ popup: true })
    }
    render() {
        return <div>
            <div>
                <Modal
                    title={`Save As Table`}
                    visible={this.state.popup}
                    onCancel={this.wow}
                    onOk={this.wow}
                    cancelText="Cancel"
                    width="70%"
                    OkText="Ok">

                </Modal>
                <div className="station-menu">
                    <ApplyOrSave></ApplyOrSave>
                    <Menu mode="horizontal">
                        <SubMenu title="Navigation Three - Submenu">
                            <Menu.ItemGroup title="Item 1">
                                <Menu.Item key="setting:1">Option 1</Menu.Item>
                                <Menu.Item key="setting:2">Option 2</Menu.Item>
                            </Menu.ItemGroup>
                            <Menu.ItemGroup title="Item 2">
                                <Menu.Item key="setting:3">Option 3</Menu.Item>
                                <Menu.Item key="setting:4">Option 4</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>
                        <Menu.Item key="alipay">
                            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                                Navigation Four - Link
          </a>
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
            <div>

            </div>
        </div>
    }
}