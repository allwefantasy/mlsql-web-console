import * as React from "react";
import {Col, Row, Card, notification} from "antd";
import {MLSQLCreateTeamForm} from "./CreateTeam";
import {Teams} from "./Teams";
import {LIST_TEAMS, LIST_TEAMS_INVITED, LIST_TEAMS_JOINED} from "../../service/BackendConfig";
import {InviteMember, MLSQLInviteMember} from "./InviteMember";
import {TeamMembers} from "./TeamMembers";


export class TeamCards extends React.Component {

    constructor(props) {
        super(props)
        this.parent = props.parent
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description
        });
    };

    render() {
        return <div style={{background: '#ECECEC', padding: '30px'}}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Team belongs to you" bordered={false}><Teams parent={this} apiUrl={LIST_TEAMS}/></Card>
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
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Team inviting you" bordered={false}><Teams parent={this} apiUrl={LIST_TEAMS_INVITED}/></Card>
                </Col>
                <Col span={8}>
                    <Card title="View members By Team" bordered={false}><TeamMembers parent={this} apiUrl={LIST_TEAMS}/></Card>
                </Col>
                <Col span={8}>
                    <Card title="Invite members" bordered={false}>
                        <MLSQLInviteMember parent={this}/>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}