import * as React from "react";
import {Button, Form, Icon, Input, message, Select} from "antd";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {
    ADD_TEAMS_ROLE,
    LIST_TEAMS,
    LIST_TEAMS_IN,
    LIST_TEAMS_JOINED, USER_SCHEDULER_TAGS_UPDATE,
    USER_TAGS_UPDATE
} from "../../service/BackendConfig";
import TeamService from "../team/remote/Service";
import ClusterService from "./remote/Service";
import {Views} from "../team/remote/Views";

class ConfigureSchedulerBackend extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.state = {
            teams: [],
            roles: [],
            tags: []

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const api = new MLSQLAPI(USER_TAGS_UPDATE)
                api.request2({backendTags: params.tag, isScheduler: true}, (resJson) => {
                    console.log(resJson)
                    console.log(params.tag)
                    if (resJson["backendTags"].includes(params.tag)) {
                        message.success("Set Default backend success", 3)
                    } else {
                        message.warning("Set Default backend fail:" + resJson["backendTags"], 10)
                    }

                }, (failStr) => {
                    message.error("Set Default backend fail:" + failStr, 10)
                })
            }
        });
    }

    componentDidMount() {
        TeamService.fetchTeams(LIST_TEAMS_IN, this, "teams")
    }

    renderTags = () => {
        return this.state.tags.map(item => {
            return <Select.Option key={item} name={item}>{item}</Select.Option>
        })
    }

    onRoleSelect = (roleName) => {
        const self = this
        this.currentRoleName = roleName
        const teamName = this.currentTeamName

        ClusterService.fetchBackends(this, {tag: teamName + "_" + roleName}, "backends", () => {
            if (self.state.backends.length > 0) {
                self.setState({tags: [teamName + "_" + roleName]})
            } else {
                self.setState({tags: []})
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const self = this
        return (
            <Form ref={this.formRef} onSubmit={this.handleSubmit} className="login-form">

                <Form.Item>
                    {getFieldDecorator('teamName', {
                        rules: [{required: true, message: 'Please input the team name'}],
                    })(
                        Views.teamSelect(self, (teamName) => {
                            Views.onTeamSelect(self, teamName)
                        })
                    )}
                </Form.Item>


                <Form.Item>
                    {getFieldDecorator('roleName', {
                        rules: [{required: true, message: 'Please input the role name'}],
                    })(
                        Views.roleSelect(self, (roleName) => {
                            self.onRoleSelect(roleName)
                        }, "default")
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('tag', {
                        rules: [
                            {required: true, message: 'Please input the tag name'}
                        ],
                    })(
                        <Select
                            mode="default"
                            placeholder="tag name"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderTags()}
                        </Select>
                    )}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Set Default
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export const MLSQLConfigureSchedulerDefaultBackend = ConfigureSchedulerBackend;