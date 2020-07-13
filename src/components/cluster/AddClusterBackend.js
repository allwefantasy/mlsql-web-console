import * as React from "react";
import {Button, Form, Input, message, Select} from "antd";
import { Icon } from '@ant-design/compatible';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {ADD_TEAMS_ROLE, LIST_TEAMS} from "../../service/BackendConfig";
import TeamService from "../team/remote/Service";
import ClusterService from "./remote/Service";

class AddClusterBackend extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.state = {
            teams: [],
            roles: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const {teamName, roleName, name, url} = params

                const tag = roleName.map(item => {
                    return teamName + "_" + item
                }).reduce((acc, item) => {
                    acc.push(item)
                    return acc
                }, []).join(",")
                ClusterService.addBackend(self, {
                    name: name,
                    url: url,
                    tag: tag,
                    teamName: teamName
                }, null, () => {
                    message.success("Add backend success")
                })
            }
        });
    }

    componentDidMount() {
        TeamService.fetchTeams(LIST_TEAMS, this, "teams")
    }

    onTeamSelect = (teamName) => {
        TeamService.fetchRoles(this, teamName, "roles")
    }


    renderTeams = () => {
        return this.state.teams.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }


    renderRoles = () => {
        return this.state.roles.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    checkBackendName = (rule, value, callback) => {
        ClusterService.checkBackendName(this, value, null, (resJson) => {
            if (resJson["msg"]) {
                callback("Name have been taken. Try another.")
            } else {
                callback()
            }
        })

    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form ref={this.formRef} onSubmit={this.handleSubmit} className="login-form">

                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [
                            {required: true, message: 'Please input the backend name'},
                            {validator: this.checkBackendName},
                        ],
                    })(
                        <Input prefix={<Icon type="table" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="backend name"/>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('url', {
                        rules: [
                            {required: true, message: 'Please input the url name'}
                        ],
                    })(
                        <Input prefix={<Icon type="table" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="url e.g. 127.0.0.1:9003"/>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('teamName', {
                        rules: [{required: true, message: 'Please input the team name'}],
                    })(
                        <Select
                            placeholder="Team name"
                            size={"large"}
                            style={{width: 200}}
                            onChange={this.onTeamSelect}
                        >
                            {this.renderTeams()}
                        </Select>
                    )}
                </Form.Item>


                <Form.Item>
                    {getFieldDecorator('roleName', {
                        rules: [{required: true, message: 'Please input the role name'}],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="role name"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderRoles()}
                        </Select>
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

export const MLSQLAddClusterBackend = AddClusterBackend;