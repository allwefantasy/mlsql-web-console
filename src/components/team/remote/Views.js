import {Select} from "antd";
import * as React from "react";

export class Views {
    static renderTeamsForSelect = (self) => {
        return self.state.teams.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    static renderTeamsWithSelect = (self) => {
        return <Select
            placeholder="Team name"
            size={"large"}
            style={{width: 200}}
        >
            {Views.renderTeams(self)}
        </Select>
    }
}