import * as React from "react";
import {FormGroup, InputGroup, Button, Navbar} from '@blueprintjs/core'
import './MLSQLRegister.scss'
import {MLSQLAuth as Auth} from './MLSQLAuth'
import * as HTTP from "../service/HTTPMethod";
import MLSQLQueryApp from "../components/MLSQLQueryApp";


export const LOGIN = "login"
export const REGISTER = "register"

export class WelcomeMessage extends React.Component {

    constructor(props) {
        super(props)
        this.auth = new Auth()
        this.auth.userName((name) => {
            this.setState({userName: name})
        })
        this.app = this.props.parent
    }

    getLoginOrRegisterManager = () => {
        return this.app.registerOrLoginRef.current
    }


    isLogin = () => {
        return this.state != null && this.state.userName != null
    }

    logout = () => {
        this.auth.logout()
        this.updateLoginoutStatus()
    }

    updateLoginoutStatus = () => {
        this.setState({userName: null})
        this.getLoginOrRegisterManager().updateLoginoutStatus()

    }

    render() {
        const LoginButton = <Button className="bp3-minimal" icon="log-in" text="Login"/>

        const LogoutButton = <Button className="bp3-minimal" icon="log-out" text="Logout"
                                     onClick={this.updateLoginoutStatus}/>

        const RegisterButton = <Button className="bp3-minimal" icon="intersection" text="Register"/>
        return (
            <div>{this.isLogin() ? "welcome  " + this.state.userName : ""}
                {this.isLogin() ? LogoutButton : LoginButton}
                {RegisterButton}
            </div>
        )
    }
}

export class MLSQLRegisterOrLogin extends React.Component {
    constructor(props) {
        super(props)

        this.loginType = this.props.loginType
        this.auth = new Auth()
        this.app = this.props.parent
        /**
         * @type {{registerOrLoginSuccess: boolean, msg: string, userName: string, password: string}}
         */
        this.state = {
            registerOrLoginSuccess: false,
            msg: "",
            isLogin: this.auth.isLogin()
        }


    }

    getMenuView = () => {
        return this.app.menuRef.current
    }

    render() {
        if (this.state.isLogin) return <MLSQLQueryApp/>
        return (
            <div className="mlsql-register">
                <div className="mlsql-register-form">
                    <FormGroup
                        helperText="email"
                        label="userName"
                        labelFor="userName"
                        labelInfo="(required)">
                        <InputGroup id="userName" placeholder="email" onChange={this.userName}/>
                    </FormGroup>
                    <FormGroup
                        helperText="password"
                        label="password"
                        labelFor="password"
                        labelInfo="(required)">
                        <InputGroup id="password" type="password" placeholder="password" onChange={this.password}/>
                    </FormGroup>

                    <Button type="submit" text={this.loginType === LOGIN ? "Login" : "Register"}
                            onClick={this.loginType === LOGIN ? this.login : this.register}/>
                    {this.state.msg !== "" && <div className="mlsql-register-messagebox">{this.state.msg}</div>}
                </div>

            </div>
        )
    }

    userName = (e) => {
        this.setState({userName: e.target.value})
    }

    password = (e) => {
        this.setState({password: e.target.value})
    }

    updateLoginoutStatus = () => {
        this.setState({isLogin: this.auth.isLogin()})
    }

    /**
     * @param  {APIResponse} apiResponse
     */
    registerSuccess = (apiResponse) => {

        if (apiResponse.status === HTTP.Status.Success) {
            this.setState({
                registerOrLoginSuccess: true
            })
            this.getMenuView().updateLoginoutStatus()
        } else {
            const self = this;
            const log = (s) => {
                let msg = s;
                try {
                    msg = JSON.parse(s)["msg"]
                } catch (e) {
                }
                self.setState({msg: msg})
            }
            apiResponse.content.then(log).catch(log)

        }

    }

    /**
     *
     * @param {ServerError} serverError
     */
    registerFail = (serverError) => {
        this.setState({msg: serverError.value.message})
    }

    login = () => {
        const validator = new FormValidate(this)
        if (validator.validate()) {
            this.auth.login(
                this.state.userName,
                this.state.password, this.registerSuccess, this.registerFail)
        }
    }

    register = () => {
        const validator = new FormValidate(this)
        if (validator.validate()) {
            this.auth.register(
                this.state.userName,
                this.state.password, this.registerSuccess, this.registerFail)
        }
    }
}


class FormValidate {

    /**
     *
     * @param  {{registerSuccess: boolean, msg: string, userName: string, password: string}} state
     * @param {MLSQLRegisterOrLogin} parent
     */
    constructor(parent) {
        this.parent = parent
    }

    validate() {
        return this.validateUserName() && this.validatePassword()
    }


    validateUserName() {
        const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
        const isEmail = pattern.test(this.parent.state.userName);
        if (!isEmail) {
            this.parent.setState({msg: "userName should be email"})
        }
        return isEmail
    }

    validatePassword() {
        const normal = this.parent.state.password.length >= 4
        if (!normal) {
            this.parent.setState({"msg": "the length of password should > 4"})
        }
        return normal
    }


}

