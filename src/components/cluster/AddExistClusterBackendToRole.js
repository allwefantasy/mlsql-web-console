import * as React from "react";
import {Button, Form, Icon, Input, message, Select} from "antd";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {ADD_TEAMS_ROLE, LIST_TEAMS} from "../../service/BackendConfig";
import TeamService from "../team/remote/Service";
import ClusterService from "./remote/Service";
import {Views} from "../team/remote/Views";

class AddExistClusterBackendToRole extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.state = {
            teams: [],
            roles: [],
            backends: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const {teamName, roleName, backendName} = params

                const tag = roleName.map(item => {
                    return teamName + "_" + item
                }).reduce((acc, item) => {
                    acc.push(item)
                    return acc
                }, []).join(",")

                ClusterService.updateBackendTags(self, backendName, tag, null, () => {
                    message.success("Update backend tags success")
                })
            }
        });
    }

    componentDidMount() {
        TeamService.fetchTeams(LIST_TEAMS, this, "teams")
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form ref={this.formRef} onSubmit={this.handleSubmit} className="login-form">

                <Form.Item>
                    {getFieldDecorator('teamName', {
                        rules: [{required: true, message: 'Please input the team name'}],
                    })(
                        Views.teamSelect(this, (teamName) => {
                            ClusterService.fetchBackendNamesByTeam(this, teamName, null, (backendNames) => {
                                ClusterService.fetchBackendsByNames(this, backendNames.map(item => {
                                    return item.name
                                }).join(","), "backends", () => {
                                    console.log(this.state.backends)
                                })
                            })
                            Views.onTeamSelect(this, teamName)
                        })
                    )}
                </Form.Item>


                <Form.Item>
                    {getFieldDecorator('roleName', {
                        rules: [{required: true, message: 'Please input the role name'}],
                    })(
                        Views.roleSelect(this, (roleName) => {
                        }, "multiple")
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('backendName', {
                        rules: [{required: true, message: 'Please input the backend name'}],
                    })(
                        Views.backendSelect(this, (backend) => {

                        }, "multiple")
                    )}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Confirm
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export const MLSQLAddExistClusterBackendToRole = AddExistClusterBackendToRole;