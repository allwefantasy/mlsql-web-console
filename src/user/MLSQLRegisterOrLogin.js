import * as React from "react";
import {FormGroup, InputGroup, Button} from '@blueprintjs/core'
import './MLSQLRegister.scss'
import {Redirect, withRouter} from "react-router-dom";
import {MLSQLAuth as Auth} from './MLSQLAuth'
import * as HTTP from "../service/HTTPMethod";


export const LOGIN = "login"
export const REGISTER = "register"

export const LoginButton = withRouter(
    ({history}) => {
        return <Button className="bp3-minimal" icon="log-in" text="Login" onClick={() => {
            {
                history.push('/')
            }
        }}/>
    }
)

export const LogoutButton = withRouter(
    ({history}) => {
        return <Button className="bp3-minimal" icon="log-out" text="Logout" onClick={() => {
            {
                history.push('/logout')
            }
        }}/>
    }
)

export const RegisterButton = withRouter(
    ({history}) => {
        return <Button className="bp3-minimal" icon="intersection" text="Register" onClick={() => {
            {
                history.push('/register')
            }
        }}/>
    }
)

export class WelcomeMessage extends React.Component {

    render() {
        this.props.auth.userName((name) => {
            this.setState({userName: name})
        })

        return (
            <div>welcome {this.state === null ? "" : this.state.userName}</div>
        )
    }
}

export class MLSQLRegisterOrLogin extends React.Component {
    constructor(props) {
        super(props)

        this.loginType = this.props.loginType

        /**
         * @type {{registerOrLoginSuccess: boolean, msg: string, userName: string, password: string}}
         */
        this.state = {
            registerOrLoginSuccess: false,
            msg: ""
        }

        this.auth = new Auth()
    }


    render() {

        if (this.auth.isLogin() || this.state.registerOrLoginSuccess === true) {
            return <Redirect to='/query'/>
        }
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

    /**
     * @param  {APIResponse} apiResponse
     */
    registerSuccess = (apiResponse) => {

        if (apiResponse.status === HTTP.Status.Success) {
            this.setState({
                registerOrLoginSuccess: true
            })
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

