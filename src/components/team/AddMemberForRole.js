import * as React from "react";
import "./form.scss"
import {
    Form, Select, Button, message, Input, Icon
} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {
    ADD_ROLES_MEMBER,
    ADD_TEAMS_MEMBER,
    ADD_TEAMS_ROLE,
    ADD_TEAMS_TABLE,
    CREATE_TEAM,
    LIST_TEAMS
} from "../../service/BackendConfig";
import Service from "./remote/Service";
import {Views} from "./remote/Views";


class AddMemberForRole extends React.Component {

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
                const api = new MLSQLAPI(ADD_ROLES_MEMBER)
                api.request2(params, (resJson) => {
                    console.log(resJson)
                    console.log("----")
                    if (resJson["msg"] === "success") {
                        if (self.teamCards.roleMembersRef) {
                            self.teamCards.roleMembersRef.current.refresh()
                        }
                        message.success("Create  success", 3)
                    } else {
                        message.warning("Create  fail:" + resJson["msg"], 10)
                    }

                }, (failStr) => {
                    message.error("Create  fail:" + failStr, 10)
                })
            }
        });
    }

    componentDidMount() {
        Service.fetchTeams(LIST_TEAMS, this, "teams")
    }

    onTeamSelect = (teamName) => {
        Views.onTeamSelect(this, teamName)
        Service.fetchMembersByTeam(this, teamName, "members")
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const self = this
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">

                <Form.Item>
                    {getFieldDecorator('teamName', {
                        rules: [
                            {required: true, message: 'Please choose the team name'}
                        ],
                    })(
                        Views.teamSelect(self, (teamName) => {
                            self.onTeamSelect(teamName)
                        })
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('roleName', {
                        rules: [
                            {required: true, message: 'Please input the role name'}
                        ],
                    })(
                        Views.roleSelect(self, () => {
                        }, "multiple")
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [
                            {required: true, message: 'Please input the member name'}
                        ],
                    })(
                        Views.memberSelect(self, () => {
                        }, "multiple")
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

export const MLSQLAddMemberForRole = Form.create({name: 'add_member_for_role'})(AddMemberForRole);