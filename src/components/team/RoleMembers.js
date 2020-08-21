import * as React from "react";
import "./Teams.scss"
import {
    Card,
    Col,
    List, message, Row, Select
} from 'antd';
import Service from "./remote/Service";
import {Views} from "./remote/Views";
import {LIST_TEAMS} from "../../service/BackendConfig";
import {TeamTables} from "./TeamTables";
import {MLSQLAddTableForTeam} from "./AddTableForTeam";


export class RoleMembers extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.apiUrl = props.apiUrl
        this.state = {
            teams: [],
            roles: [],
            members: []
        }
    }

    componentDidMount() {
        Service.fetchTeams(LIST_TEAMS, this, "teams")
    }


    onRoleSelect = (roleName) => {
        this.currentRoleName = roleName
        Service.fetchMembersByRole(this, this.currentTeamName, this.currentRoleName, "members")
    }

    refresh = () => {
        if (this.currentTeamName && this.currentRoleName) {
            Service.fetchMembersByRole(this, this.currentTeamName, this.currentRoleName, "members")
        }
    }

    renderCommand = (userName) => {
        const self = this
        return [<a onClick={() => {
            if (this.currentTeamName && this.currentRoleName) {
                Service.removeRoleMember(this, this.currentTeamName, this.currentRoleName, userName, null, () => {
                    self.refresh()
                })
            }
        }
        }>remove</a>]
    }

    renderMembers = () => {
        return <List
            dataSource={this.state.members}
            renderItem={item => (
                <List.Item key={item.name} actions={this.renderCommand(item.name)}>
                    <List.Item.Meta
                        title={item.name}
                    />
                </List.Item>
            )}
        >
        </List>
    }

    render() {
        const self = this
        return (
            <div>
                <Row gutter={16}>
                    <Col>
                        {Views.teamSelect(self, (teamName) => {
                            Views.onTeamSelect(self, teamName)
                        })}
                    </Col>

                </Row>
                <br/>
                <Row gutter={16}>
                    <Col>
                        {Views.roleSelect(self, self.onRoleSelect, "default")}
                    </Col>

                </Row>


                <br/>
                <Row gutter={16}>
                    <Col>
                        {this.renderMembers()}
                    </Col>

                </Row>

            </div>
        );
    }

}



