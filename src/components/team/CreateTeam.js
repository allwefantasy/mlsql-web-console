import * as React from "react";
import "./form.scss"
import {
    Form,  Input, Button, message
} from 'antd';
import { Icon } from '@ant-design/compatible';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {CHECK_TEAM_NAME, CREATE_TEAM} from "../../service/BackendConfig";


class CreateTeamForm extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.teamCards = props.parent
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const api = new MLSQLAPI(CREATE_TEAM)
                api.request2(params, (resJson) => {
                    if (resJson["msg"] === "success") {
                        message.success("Create team success", 3)
                        if (self.teamCards.teamsRef) {
                            self.teamCards.teamsRef.current.refresh()
                        }
                    } else {
                        message.warning("Create team fail" + resJson["msg"], 10)
                    }

                }, (failStr) => {
                    message.error("Create team fail:" + failStr, 10)
                })
            }
        });
    }

    teamNameCheck = (rule, value, callback) => {
        if (value) {
            const api = new MLSQLAPI(CHECK_TEAM_NAME)
            api.request2({name: value}, (resJson) => {
                if (!resJson["msg"]) {
                    callback(`${value} have been taken. Try another`);
                }
                else callback()
            }, (failStr) => {
                callback('server error:' + failStr);
            })
        } else {
            callback()
        }

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form ref={this.formRef} onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [
                            {required: true, message: 'Please input the team name!'},
                            {validator: this.teamNameCheck}
                        ],
                    })(
                        <Input prefix={<Icon type="team" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Team name"/>
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export const MLSQLCreateTeamForm = CreateTeamForm