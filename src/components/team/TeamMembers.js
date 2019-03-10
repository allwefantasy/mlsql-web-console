import * as React from "react";
import "./Teams.scss"
import {
    List, message, Select
} from 'antd';
import Service from "./remote/Service";
import {Views} from "./remote/Views";


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
        Service.fetchMembersByTeam(this, member, "members")
    }

    renderCommand = ()=>{

    }

    renderMembers = () => {
        return <List
            dataSource={this.state.members}
            renderItem={item => (
                <List.Item key={item.name}>
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