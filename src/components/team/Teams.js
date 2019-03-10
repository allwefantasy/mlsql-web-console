import * as React from "react";
import "./Teams.scss"
import {
    List, message
} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {ACCEPT_TEAMS_MEMBER, LIST_TEAMS_INVITED, REFUSE_TEAMS_MEMBER} from "../../service/BackendConfig";
import Service from "./remote/Service";


export class Teams extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.apiUrl = props.apiUrl
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        Service.fetchTeams(this.apiUrl, this)
    }

    renderCommand = (value) => {
        const command = new InviteCommand(this, value)
        if (this.apiUrl === LIST_TEAMS_INVITED) {
            return [<a onClick={command.accept}>accept</a>, <a onClick={command.refuse}>refuse</a>]
        }
        return []
    }


    render() {
        return (
            <div>
                <List
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item key={item.name} actions={this.renderCommand(item.name)}>
                            <List.Item.Meta
                                title={<a href="#">{item.name}</a>}
                            />
                        </List.Item>
                    )}
                >
                </List>
            </div>
        );
    }
}

class InviteCommand {
    constructor(teams, teamName) {
        this.view = teams
        this.teamName = teamName
    }

    accept = (evt) => {
        evt.preventDefault()
        Service.teamInvite(this.view, ACCEPT_TEAMS_MEMBER, this.teamName)
    }

    refuse = (evt) => {
        evt.preventDefault()
        Service.teamInvite(this.view, REFUSE_TEAMS_MEMBER, this.teamName)
    }
}