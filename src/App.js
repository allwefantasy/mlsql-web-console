import React, {Component} from 'react';
import './App.scss';
import {Alignment, Button, Navbar} from "@blueprintjs/core";
import {LOGIN, MLSQLRegisterOrLogin, WelcomeMessage} from "./user/MLSQLRegisterOrLogin";
import {VIEW_CLUSTER, VIEW_CONSOLE} from "./common/ViewConst"

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
        this.setState({currentView: VIEW_CLUSTER})
    }

    switchToConsole = () => {
        this.setState({currentView: VIEW_CONSOLE})
    }

    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>MLSQL Web Console</Navbar.Heading>
                        <Navbar.Divider/>
                        <Button className="bp3-minimal" icon="home" text="Console" onClick={this.switchToConsole}/>
                        <Button className="bp3-minimal" icon="document" text="Cluster" onClick={this.switchToCluster}/>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <WelcomeMessage ref={this.menuRef} parent={this}/>
                    </Navbar.Group>
                </Navbar>
                <MLSQLRegisterOrLogin ref={this.registerOrLoginRef} parent={this} loginType={LOGIN}/>
            </div>
        );
    }
}

export default App;
