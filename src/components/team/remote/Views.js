import {Select} from "antd";
import * as React from "react";
import TeamService from "./Service";

export class Views {
    static renderTeamsForSelect = (self) => {
        return self.state.teams.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    static onTeamSelect = (self, teamName) => {
        self.currentTeamName = teamName
        TeamService.fetchRoles(self, teamName, "roles")
    }


    static renderTeams = (self) => {
        return self.state.teams.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }


    static renderRoles = (self) => {
        return self.state.roles.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    static renderMembers = (self) => {
        return self.state.members.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    static renderBackends = (self) => {
        return self.state.backends.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }
    s
    static teamSelect = (self, onChangeCallback) => {
        return <Select
            placeholder="Team name"
            size={"large"}
            style={{width: 200}}
            onChange={onChangeCallback}
        >
            {Views.renderTeams(self)}
        </Select>
    }

    static roleSelect = (self, onChangeCallback, mode = "default") => {
        return <Select
            placeholder="role name"
            mode={mode}
            size={"large"}
            style={{width: 200}}
            onChange={onChangeCallback}
        >
            {Views.renderRoles(self)}
        </Select>
    }

    static backendSelect = (self, onChangeCallback, mode = "default") => {
        return <Select
            placeholder="backend name"
            mode={mode}
            size={"large"}
            style={{width: 200}}
            onChange={onChangeCallback}
        >
            {Views.renderBackends(self)}
        </Select>
    }

    static memberSelect = (self, onChangeCallback, mode = "default") => {
        return <Select
            placeholder="member name"
            mode={mode}
            size={"large"}
            style={{width: 200}}
            onChange={onChangeCallback}
        >
            {Views.renderMembers(self)}
        </Select>
    }
}