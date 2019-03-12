import * as React from "react";
import {Button, Form, Icon, Input, message, Select} from "antd";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {ADD_TEAMS_ROLE, LIST_TEAMS} from "../../service/BackendConfig";
import TeamService from "../team/remote/Service";
import ClusterService from "./remote/Service";

class AddTagToRole extends React.Component {
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
                const api = new MLSQLAPI(ADD_TEAMS_ROLE)
                api.request2(params, (resJson) => {
                    if (resJson["msg"] === "success") {
                        message.success("Create roles success", 3)
                        self.teamCards.teamsRef.current.refresh()
                    } else {
                        message.warning("Create roles fail:" + resJson["msg"], 10)
                    }

                }, (failStr) => {
                    message.error("Create roles fail:" + failStr, 10)
                })
            }
        });
    }

    componentDidMount() {
        const self = this
        TeamService.fetchTeams(LIST_TEAMS, this, "teams")
        ClusterService.fetchBackends(this, "backends", () => {
            const tagsWithDuplicate = self.state.backends.map(item => {
                return item.tags
            }).reduce((items, item) => {
                items.push(...item)
                return items
            }, [])
            const tags = new Set(tagsWithDuplicate)
            self.setState({tags: [...tags]})
        })
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

    renderTags = () => {
        return this.state.tags.map(item => {
            return <Select.Option key={item} name={item}>{item}</Select.Option>
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">

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
                    {getFieldDecorator('tag', {
                        rules: [
                            {required: true, message: 'Please input the tag name'}
                        ],
                    })(
                        <Select
                            mode="multiple"
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
                        Create
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export const MLSQLAddTagToRole = Form.create({name: 'add_tag_to_role'})(AddTagToRole);