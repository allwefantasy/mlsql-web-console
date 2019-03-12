import * as React from "react";
import "./Teams.scss"
import {
    List, message
} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {
    ACCEPT_TEAMS_MEMBER,
    LIST_TEAMS,
    LIST_TEAMS_INVITED,
    LIST_TEAMS_MEMBER,
    REFUSE_TEAMS_MEMBER
} from "../../service/BackendConfig";
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
        Service.fetchTeams(this.apiUrl, this, "data")
    }

    accept = (evt) => {
        evt.preventDefault()
        Service.teamInvite(this, ACCEPT_TEAMS_MEMBER, this.teamName, null, () => {
            Service.fetchTeams(this.apiUrl, this, "data")
            this.teamCards.teamYourJoinRef.current.refresh()
        })
    }

    refuse = (evt) => {
        evt.preventDefault()
        Service.teamInvite(this, REFUSE_TEAMS_MEMBER, this.teamName, null, () => {
            Service.fetchTeams(this.apiUrl, this, "data")
        })
    }

    refresh = () => {
        Service.fetchTeams(this.apiUrl, this, "data")
    }
    renderCommand = (value) => {
        this.teamName = value
        if (this.apiUrl === LIST_TEAMS_INVITED) {
            return [<a onClick={this.accept}>accept</a>, <a onClick={this.refuse}>refuse</a>]
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


