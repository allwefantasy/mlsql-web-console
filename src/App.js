import React, {Component} from 'react';
import './App.scss';
import {Alignment, Button, Navbar} from "@blueprintjs/core";
import {notification} from 'antd';
import {LOGIN, MLSQLRegisterOrLogin, WelcomeMessage} from "./user/MLSQLRegisterOrLogin";
import {VIEW_CLUSTER, VIEW_CONSOLE, VIEW_DEMO} from "./common/ViewConst"
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

    switchToCluster = () => {
        const auth = new MLSQLAuth()
        const self = this
        auth.user((user) => {
            console.log(user["role"])
            if (user["role"] == "admin") {
                self.setState({currentView: VIEW_CLUSTER})
            } else {
                openNotificationWithIcon("error", "Auth Fail", "You are not allow to visit Cluster Manager")
            }
        })

    }

    switchToConsole = () => {
        this.setState({currentView: VIEW_CONSOLE})
    }

    switchToDemo = () => {
        this.setState({currentView: VIEW_DEMO})
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
                        <Button className="bp3-minimal" icon="document" text="Cluster" onClick={this.switchToCluster}/>
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
                </div>
            </div>
        );
    }
}

export default App;
