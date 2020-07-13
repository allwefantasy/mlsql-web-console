import * as React from "react";
import "./form.scss"
import {
    Form, Select, Button, message, Input
} from 'antd';
import { Icon } from '@ant-design/compatible';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {ADD_TEAMS_MEMBER, CREATE_TEAM, LIST_TEAMS} from "../../service/BackendConfig";


class InviteMember extends React.Component {

    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.state = {
            teams: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const api = new MLSQLAPI(ADD_TEAMS_MEMBER)
                api.request2(params, (resJson) => {
                    if (resJson["msg"] === "success") {
                        self.teamCards.setState({refresh: true})
                        message.success("Invite success", 3)
                    } else {
                        message.warning("Invite fail:" + resJson["msg"], 10)
                    }

                }, (failStr) => {
                    self.teamCards.setState({refresh: true})
                    message.error("Invite fail:" + failStr, 10)
                })
            }
        });
    }

    componentDidMount() {
        const api = new MLSQLAPI(LIST_TEAMS)
        const self = this
        api.request2({}, resJson => {
            self.setState({teams: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, 15)
        })
    }

    renderTeams = () => {
        return this.state.teams.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form ref={this.formRef} onSubmit={this.handleSubmit} className="login-form">

                <Form.Item>
                    {getFieldDecorator('teamName', {
                        rules: [
                            {required: true, message: 'Please choose the team name'}
                        ],
                    })(
                        <Select
                            placeholder="Team name"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderTeams()}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('userNames', {
                        rules: [
                            {required: true, message: 'Please input the user name you want invite'}
                        ],
                    })(
                        <Input prefix={<Icon type="team" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="User name, split with ','"/>
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

export const MLSQLInviteMember = InviteMember;