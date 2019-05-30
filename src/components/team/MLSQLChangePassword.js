import * as React from "react";
import {Button, Form, Icon, Input, message, Select} from "antd";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {CHNAGE_PASSWORD} from "../../service/BackendConfig";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.state = {
            teams: [],
            roles: [],
            members: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const api = new MLSQLAPI(CHNAGE_PASSWORD)
                api.request2(params, (resJson) => {
                    if (resJson["msg"] === "success") {
                        message.success("Success", 3)
                    } else {
                        message.warning("Fail:" + resJson["msg"], 10)
                    }

                }, (failStr) => {
                    message.error("Fail:" + failStr, 10)
                })
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">


                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [
                            {required: true, message: 'Please input the original password'}
                        ],
                    })(
                        <Input type={"password"} prefix={<Icon type="password" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="old password"/>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('newPassword', {
                        rules: [{required: true, message: 'Please input the new password'}],
                    })(
                        <Input type={"password"} prefix={<Icon type="password" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="new password"/>
                    )}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Apply
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export const MLSQLChangePassword = Form.create({name: 'change_password'})(ChangePassword);