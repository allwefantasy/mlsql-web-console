import * as React from "react";
import {FormGroup, InputGroup, Button} from '@blueprintjs/core'
import './MLSQLRegister.scss'
import {Redirect} from "react-router-dom";
import {MLSQLAuth as Auth} from './MLSQLAuth'
import * as HTTP from "../service/HTTPMethod";

export default class MLSQLRegister extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            registerSuccess: false,
            msg: ""
        }
        this.userName = this.userName.bind(this)
        this.password = this.password.bind(this)
        this.register = this.register.bind(this)
        this.auth = new Auth()
    }

    render() {

        if (this.state.registerSuccess === true) {
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
                        <InputGroup id="password" placeholder="password" onChange={this.password}/>
                    </FormGroup>
                    <Button type="submit" text="Register" onClick={this.register}/>
                    {this.state.msg !== "" && <div className="mlsql-register-messagebox">{this.state.msg}</div>}
                </div>

            </div>
        )
    }

    userName(e) {
        this.setState({userName: e.target.value})
    }

    password(e) {
        this.setState({password: e.target.value})
    }

    isLogin() {

    }

    /**
     * @param  {APIResponse} apiResponse
     */
    registerSuccess(apiResponse) {
        if (apiResponse.status === HTTP.Status.Success) {
            this.setState({
                registerSuccess: true
            })
        } else {
            const self = this;
            const log = (s) => {
                self.setState({msg: s})
            }
            apiResponse.content.then(log).catch(log)

        }

    }

    /**
     *
     * @param {ServerError} serverError
     */
    registerFail(serverError) {
        this.setState({msg: serverError.value.message})
    }

    register() {

        const _sCallBack = this.registerSuccess.bind(this)
        const _errorCallBack = this.registerFail.bind(this)
        this.auth.register(
            this.state.userName,
            this.state.password, _sCallBack, _errorCallBack)
    }
}

