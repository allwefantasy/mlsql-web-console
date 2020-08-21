import * as React from "react";
import "./Teams.scss"
import {
    List, message, Select
} from 'antd';
import Service from "./remote/Service";
import {Views} from "./remote/Views";
import {LIST_TEAMS} from "../../service/BackendConfig";


export class TeamTables extends React.Component {
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
        Service.fetchTables(this, member, "tables")
    }

    refresh = () => {
        if (this.currentTeam) {
            Service.fetchTables(this, this.currentTeam, "tables")
        }
    }

    renderCommand = (tableId) => {
        return [<a onClick={(evt) => {
            evt.preventDefault()
            Service.removeTable(this, this.currentTeam, tableId, null, () => {
                Service.fetchTables(this, this.currentTeam, "tables")
            })

        }
        }>remove</a>]
    }

    renderDB = (item) => {
        if (item.db !== "undefined" && item.db) {
            return item.db
        } else return "default"
    }

    renderRoles = () => {
        return <List
            dataSource={this.state.tables}
            renderItem={item => (
                <List.Item key={item.name} actions={this.renderCommand(item.id)}>
                    <List.Item.Meta
                        title={`${item.tableType}:${this.renderDB(item)}:${item.name}`}
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



