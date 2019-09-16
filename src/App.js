import React, {Component} from 'react';
import './App.scss';
import {Alignment, Button, Navbar} from "@blueprintjs/core";
import {notification} from 'antd';
import {LOGIN, MLSQLRegisterOrLogin, WelcomeMessage} from "./user/MLSQLRegisterOrLogin";
import {VIEW_CLUSTER, VIEW_CONSOLE, VIEW_DEMO, VIEW_SCRIPT_PLUGINS, VIEW_TEAM} from "./common/ViewConst"
import {MLSQLAuth} from "./user/MLSQLAuth";

const s = require('stripmargin');
s.inject()

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description
    });
};

class App extends Component {
    constructor(props) {
        super(props)
        this.menuRef = React.createRef()
        this.registerOrLoginRef = React.createRef()
        this.state = {currentView: VIEW_CONSOLE}
    }

    updateLoginoutStatus = () => {
        this.menuRef.current.updateLoginoutStatus()
        this.registerOrLoginRef.current.updateLoginoutStatus()
    }

    switchToTeam = () => {
        this.setState({currentView: VIEW_TEAM})

    }

    switchToConsole = () => {
        this.setState({currentView: VIEW_CONSOLE})
    }

    switchToDemo = () => {
        this.setState({currentView: VIEW_DEMO})
    }

    switchToScriptPlugins = () => {
        this.setState({currentView: VIEW_SCRIPT_PLUGINS})
    }

    switchToCnDoc = () => {
        window.open("http://docs.mlsql.tech/zh/", "_blank")
    }


    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>MLSQL Web Console</Navbar.Heading>
                        <Navbar.Divider/>
                        <Button className="bp3-minimal" icon="home" text="Console" onClick={this.switchToConsole}/>
                        <Button className="bp3-minimal" icon="document" text="Demo Center" onClick={this.switchToDemo}/>
                        <Button className="bp3-minimal" icon="document" text="Team" onClick={this.switchToTeam}/>
                        <Button className="bp3-minimal" icon="document" text="Script Plugins"
                                onClick={this.switchToScriptPlugins}/>
                        <Button className="bp3-minimal" icon="document" text="中文文档"
                                onClick={this.switchToCnDoc}/>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <WelcomeMessage ref={this.menuRef} parent={this}/>
                    </Navbar.Group>
                </Navbar>
                <MLSQLRegisterOrLogin ref={this.registerOrLoginRef} parent={this} loginType={LOGIN}/>


                <div style={{bottom: "100px", textAlign: "center", width: "100%"}}>
                    MLSQL Licensed under the Apache License, Version 2.0. @<a className="copyright"
                                                                              href="http://www.miitbeian.gov.cn/">浙ICP备18052520号</a>
                    <div>@<a target="_blank"
                             href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802009683"><img
                        src=""/>浙公网安备 33010802009683号</a></div>

                </div>
            </div>
        );
    }
}

export default App;
