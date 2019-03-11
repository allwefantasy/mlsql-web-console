import * as React from "react";
import {Col, Row, Card, notification} from "antd";
import {MLSQLCreateTeamForm} from "./CreateTeam";
import {Teams} from "./Teams";
import {ADD_TEAMS_ROLE, LIST_TEAMS, LIST_TEAMS_INVITED, LIST_TEAMS_JOINED} from "../../service/BackendConfig";
import {InviteMember, MLSQLInviteMember} from "./InviteMember";
import {TeamMembers} from "./TeamMembers";
import {MLSQLAddRoleForTeam} from "./AddRoleForTeam";
import {TeamRoles} from "./TeamRoles";
import {MLSQLAddTableForTeam} from "./AddTableForTeam";
import {TeamTables} from "./TeamTables";
import {MLSQLAddTableForRole} from "./AddTableForRole";
import {RoleTables} from "./RoleTables";


export class TeamCards extends React.Component {

    constructor(props) {
        super(props)
        this.parent = props.parent
        this.state = {}
        this.teamRolesRef = React.createRef()
        this.teamMembersRef = React.createRef()
        this.teamsRef = React.createRef()
        this.roleTablesRef = React.createRef()
        this.teamTablesRef = React.createRef()
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description
        });
    };

    render() {
        return <div style={{background: '#ECECEC', padding: '30px'}}>
            <Row gutter={24}>
                <Col span={8}>
                    <Card title="Team belongs to you" bordered={false}><Teams parent={this} ref={this.teamsRef}
                                                                              apiUrl={LIST_TEAMS}/></Card>
                </Col>
                <Col span={8}>
                    <Card title="Team you join" bordered={false}><Teams parent={this}
                                                                        apiUrl={LIST_TEAMS_JOINED}/></Card>
                </Col>
                <Col span={8}>
                    <Card title="Create new team" bordered={false}>
                        <MLSQLCreateTeamForm parent={this}/>
                    </Card>
                </Col>
            </Row>
            <br/>
            <Row gutter={24}>
                <Col span={8}>
                    <Card title="Team inviting you" bordered={false}><Teams parent={this} apiUrl={LIST_TEAMS_INVITED}/></Card>
                </Col>
                <Col span={8}>
                    <Card title="View members By Team" bordered={false}><TeamMembers ref={this.teamMembersRef}
                                                                                     parent={this} apiUrl={LIST_TEAMS}/></Card>
                </Col>
                <Col span={8}>
                    <Card title="Invite members" bordered={false}>
                        <MLSQLInviteMember parent={this}/>
                    </Card>
                </Col>
            </Row>
            <br/>
            <Row gutter={24}>
                <Col span={8}>
                    <Card title="View Roles By Team" bordered={false}><TeamRoles ref={this.teamRolesRef}
                                                                                 parent={this} apiUrl={ADD_TEAMS_ROLE}/></Card>
                </Col>
                <Col span={8}>
                    <Card title="Add table to role" bordered={false}>
                        <MLSQLAddTableForRole parent={this}/>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Add role to Team" bordered={false}>
                        <MLSQLAddRoleForTeam parent={this}/>
                    </Card>
                </Col>
            </Row>
            <br/>
            <Row gutter={24}>
                <Col span={8}>
                    <Card title="View tables By Role" bordered={false}>
                        <RoleTables parent={this} ref={this.roleTablesRef}/>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Add Table to Team" bordered={false}>
                        <MLSQLAddTableForTeam parent={this}/>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}