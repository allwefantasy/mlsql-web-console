import * as React from "react";
import mix from "../../common/mixin"
import { Tabs, Radio, Menu } from 'antd';
import './JoinStation.scss'
import './common.scss'
import ApplyOrSave from "./ApplyOrSave";

const { SubMenu } = Menu;


export default class JoinStation extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div>
            <div className={"station-menu"}>
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
            <div>

            </div>
        </div>
    }
}