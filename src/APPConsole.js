import React, { Component } from 'react';
import './App.scss';
import { Alignment, Button, Navbar } from "@blueprintjs/core";
import { notification, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { LOGIN, MLSQLRegisterOrLogin, WelcomeMessage } from "./user/MLSQLRegisterOrLogin";
import { ANALYSIS_WORKSHOP, VIEW_CONSOLE, VIEW_DEMO, VIEW_SCRIPT_PLUGINS, VIEW_TEAM } from "./common/ViewConst"
import { MLSQLAuth } from "./user/MLSQLAuth";

const s = require('stripmargin');
s.inject()

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description
    });
};

class AppConsole extends Component {
    constructor(props) {
        super(props)
        this.menuRef = React.createRef()
        this.registerOrLoginRef = React.createRef()
        this.state = { currentView: ANALYSIS_WORKSHOP }
    }

    updateLoginoutStatus = () => {
        this.menuRef.current.updateLoginoutStatus()
        this.registerOrLoginRef.current.updateLoginoutStatus()
    }

    switchToTeam = () => {
        this.setState({ currentView: VIEW_TEAM })

    }

    switchToConsole = () => {
        this.setState({ currentView: VIEW_CONSOLE })
    }

    switchToDemo = () => {
        this.setState({ currentView: VIEW_DEMO })
    }

    switchToScriptPlugins = () => {
        this.setState({ currentView: VIEW_SCRIPT_PLUGINS })
    }

    switchToAnalysisWorkshop = () => {
        this.setState({ currentView: ANALYSIS_WORKSHOP })
    }

    switchToCnDoc = () => {
        window.open("http://docs.mlsql.tech/zh/", "_blank")
    }


    render() {

        const more = (
            <Menu>
                <Menu.Item>
                    <Button className="bp3-minimal" icon="document" text="Demo Center" onClick={this.switchToDemo} />
                </Menu.Item>
                <Menu.Item>
                    <Button className="bp3-minimal" icon="document" text="Team" onClick={this.switchToTeam} />
                </Menu.Item>
                <Menu.Item>
                    <Button className="bp3-minimal" icon="document" text="Script Plugins"
                        onClick={this.switchToScriptPlugins} />
                </Menu.Item>
                <Menu.Item>
                    <Button className="bp3-minimal" icon="document" text="中文文档"
                        onClick={this.switchToCnDoc} />
                </Menu.Item>
            </Menu>
        );
        const dropdownMore = <Dropdown overlay={more}>
            <Button className="bp3-minimal" onClick={e => e.preventDefault()}>More..</Button>
        </Dropdown>

        return (
            <div>
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>MLSQL Web Console</Navbar.Heading>
                        <Navbar.Divider />
                        <Button className="bp3-minimal" icon="home" text="Console" onClick={this.switchToConsole} />
                        <Button className="bp3-minimal" icon="document" text="Analysis Workshop" onClick={this.switchToAnalysisWorkshop} />
                        {dropdownMore}
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <WelcomeMessage ref={this.menuRef} parent={this} />
                    </Navbar.Group>
                </Navbar>
                <MLSQLRegisterOrLogin ref={this.registerOrLoginRef} parent={this} loginType={LOGIN} />


                <div style={{ bottom: "100px", textAlign: "center", width: "100%" }}>
                    MLSQL Licensed under the Apache License, Version 2.0. @<a className="copyright"
                        href="http://www.miitbeian.gov.cn/">浙ICP备18052520号</a>
                    <div>@<a target="_blank"
                        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802009683"><img
                            src="" />浙公网安备 33010802009683号</a></div>

                </div>
            </div>
        );
    }
}

export default AppConsole;
