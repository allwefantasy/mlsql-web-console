import React from 'react';
import ReactDOM from 'react-dom';
import './mlsql.scss';
import './index.scss';
import {
    BrowserRouter,
    Route,
    withRouter, Redirect
} from 'react-router-dom';

import {
    LOGIN,
    REGISTER,
    MLSQLRegisterOrLogin,
    LoginButton,
    LogoutButton,
    RegisterButton, WelcomeMessage
} from "./user/MLSQLRegisterOrLogin";

import MLSQLQueryApp from './components/MLSQLQueryApp';
import {Navbar, Button, Alignment} from "@blueprintjs/core";
import * as serviceWorker from './serviceWorker';
import {MLSQLAuth as Auth} from "./user/MLSQLAuth";

const auth = new Auth()

const AuthRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        auth.isLogin() === true
            ? <Component {...props} />
            : <Redirect to='/'/>
    )}/>
)

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>MLSQL Web Console</Navbar.Heading>
                    <Navbar.Divider/>
                    <Button className="bp3-minimal" icon="home" text="Console"/>
                    <Button className="bp3-minimal" icon="document" text="Jobs"/>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <WelcomeMessage auth={auth}/>
                    {auth.isLogin() ? <LogoutButton/> : <LoginButton/>}
                    <RegisterButton/>
                </Navbar.Group>
            </Navbar>

            <Route exact path="/"
                   component={() => {
                       return <MLSQLRegisterOrLogin loginType={LOGIN}/>
                   }}/>
            <Route exact path="/register"
                   render={() => {
                       return <MLSQLRegisterOrLogin loginType={REGISTER}/>
                   }}/>
            <Route exact path="/logout"
                   render={() => {
                       return <MLSQLRegisterOrLogin loginType={LOGIN}/>
                   }}/>
            <AuthRoute exact path="/query" component={MLSQLQueryApp}/>
        </div>

    </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
