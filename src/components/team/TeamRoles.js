import * as React from "react";
import "./Teams.scss"
import {
    List, message, Select
} from 'antd';
import Service from "./remote/Service";
import {Views} from "./remote/Views";
import {LIST_TEAMS} from "../../service/BackendConfig";


export class TeamRoles extends React.Component {
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
        Service.fetchTeams(LIST_TEAMS, this, "teams")
    }

    selectTeam = (member) => {
        this.currentTeam = member
        Service.fetchRoles(this, member, "roles")
    }

    refresh = () => {
        if(this.currentTeam){
            Service.fetchRoles(this, this.currentTeam, "roles")
        }
    }

    renderCommand = (roleName) => {
        return [<a onClick={() => {
            Service.removeRole(this, this.currentTeam, roleName)
            Service.fetchRoles(this, this.currentTeam, "roles")
        }
        }>remove</a>]
    }

    renderRoles = () => {
        return <List
            dataSource={this.state.roles}
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
                {this.renderRoles()}
            </div>
        );
    }

}



