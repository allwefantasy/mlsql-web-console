import * as React from "react";
import {Col, Row, Card, notification} from "antd";
import {MLSQLCreateTeamForm} from "./CreateTeam";
import {Teams} from "./Teams";
import {ADD_TEAMS_ROLE, LIST_TEAMS, LIST_TEAMS_INVITED, LIST_TEAMS_JOINED} from "../../service/BackendConfig";
import {InviteMember, MLSQLInviteMember} from "./InviteMember";
import {TeamMembers} from "./TeamMembers";
import {MLSQLAddRoleForTeam} from "./AddRoleForTeam";
import {TeamRoles} from "./TeamRoles";

import {MLSQLAddMemberForRole} from "./AddMemberForRole";
import {RoleMembers} from "./RoleMembers";


export class TeamCards extends React.Component {

    constructor(props) {
        super(props)
        this.parent = props.parent
        this.state = {}
        this.teamRolesRef = React.createRef()
        this.teamMembersRef = React.createRef()
        this.teamsRef = React.createRef()
        this.roleTablesRef = React.createRef()
        this.roleMembersRef = React.createRef()
        this.teamYourJoinRef = React.createRef()
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
                <Col span={16}>
                    <Card title="Team belongs to you" bordered={false}><Teams parent={this} ref={this.teamsRef}
                                                                              apiUrl={LIST_TEAMS}/></Card>
                </Col>

                <Col span={8}>
                    <Card title="Create new team" bordered={false}>
                        <MLSQLCreateTeamForm parent={this}/>
                    </Card>
                </Col>
            </Row>
            <br/>

            <Row gutter={24}>
                <Col span={16}>
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
                <Col span={12}>
                    <Card title="Team you join" bordered={false}><Teams parent={this} ref={this.teamYourJoinRef}
                                                                        apiUrl={LIST_TEAMS_JOINED}/></Card>
                </Col>

                <Col span={12}>
                    <Card title="Team inviting you" bordered={false}><Teams parent={this} apiUrl={LIST_TEAMS_INVITED}/></Card>
                </Col>

            </Row>
            <br/>


            <Row gutter={24}>

                <Col span={16}>
                    <Card title="View Roles By Team" bordered={false}><TeamRoles ref={this.teamRolesRef}
                                                                                 parent={this} apiUrl={ADD_TEAMS_ROLE}/></Card>
                </Col>

                <Col span={8}>
                    <Card title="Add role to Team" bordered={false}>
                        <MLSQLAddRoleForTeam parent={this}/>
                    </Card>
                </Col>

            </Row>
            <br/>


            <Row gutter={24}>
                <Col span={16}>
                    <Card title="View members By Role" bordered={false}>
                        <RoleMembers parent={this} ref={this.roleMembersRef}/>
                    </Card>
                </Col>


                <Col span={8}>
                    <Card title="Add Member to Role" bordered={false}>
                        <MLSQLAddMemberForRole parent={this}/>
                    </Card>
                </Col>

            </Row>
        </div>
    }
}