import * as React from "react";
import "./Teams.scss"
import {
    List, message, Select
} from 'antd';
import Service from "./remote/Service";
import {Views} from "./remote/Views";
import {LIST_TEAMS_MEMBER} from "../../service/BackendConfig";


export class TeamMembers extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.apiUrl = props.apiUrl
        this.state = {
            teams: [],
            members: []
        }
    }

    componentDidMount() {
        Service.fetchTeams(this.apiUrl, this, "teams")
    }

    selectTeam = (member) => {
        this.currentTeam = member
        Service.fetchMembersByTeam(this, member, "members")
    }

    renderCommand = (userName) => {
        const self = this
        return [<a onClick={() => {
            Service.removeTeamMember(self, self.currentTeam, userName, () => {
                Service.fetchMembersByTeam(self, self.currentTeam, "members")
            })
        }
        }>remove</a>]

    }

    renderMembers = () => {
        return <List
            dataSource={this.state.members}
            renderItem={item => (
                <List.Item key={item.name} actions={this.renderCommand(item.name)}>
                    <List.Item.Meta
                        title={<a href="#">{item.name}</a>}
                    />
                </List.Item>
            )}
        >
        </List>
    }

    render() {
        return (
            <div>
                <Select
                    placeholder="Team name"
                    size={"large"}
                    style={{width: 200}}
                    onChange={this.selectTeam}
                >
                    {Views.renderTeamsForSelect(this)}
                </Select>
                {this.renderMembers()}
            </div>
        );
    }
}