import * as React from "react";
import "./Teams.scss"
import {
    Card,
    Col,
    List, message, Row, Select
} from 'antd';
import Service from "./remote/Service";
import {Views} from "./remote/Views";
import {LIST_TEAMS} from "../../service/BackendConfig";
import {TeamTables} from "./TeamTables";
import {MLSQLAddTableForTeam} from "./AddTableForTeam";


export class RoleTables extends React.Component {
    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.apiUrl = props.apiUrl
        this.state = {
            teams: [],
            roles: []
        }
    }

    componentDidMount() {
        Service.fetchTeams(LIST_TEAMS, this, "teams")
    }

    selectTeam = (member) => {
        this.currentTeam = member
        Service.fetchRoles(this, member, "roles")
    }

    onRoleSelect = (roleName) => {
        this.currentRole = roleName
        Service.fetchTablesByRole(this, this.currentTeam, roleName, "tables")
    }

    refresh = () => {
        if (this.currentTeam && this.currentRole) {
            Service.fetchTablesByRole(this, this.currentTeam, this.currentRole, "tables")
        }
    }

    renderCommand = (tableNameId) => {
        const self = this
        return [<a onClick={() => {
            if (this.currentTeam && this.currentRole) {
                Service.removeRoleTable(this, this.currentTeam, this.currentRole, tableNameId, null, () => {
                    self.refresh()
                })
            }
        }
        }>remove</a>]
    }

    renderRoles = () => {
        return this.state.roles.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    sourceType = (item, defaultValue) => {
        if (item === "undefined") return defaultValue
        else return item
    }

    renderTables = () => {
        return <List
            dataSource={this.state.tables}
            renderItem={item => (
                <List.Item key={item.name} actions={this.renderCommand(item.id)}>
                    <List.Item.Meta
                        title={item.tableType + ":" + this.sourceType(item.sourceType, item.tableType) + ":" + item.name + ":" + item.operateType}
                    />
                </List.Item>
            )}
        >
        </List>
    }

    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col>
                        <Select
                            placeholder="Team name"
                            size={"large"}
                            style={{width: 200}}
                            onChange={this.selectTeam}
                        >
                            {Views.renderTeamsForSelect(this)}
                        </Select>
                    </Col>

                </Row>
                <br/>
                <Row gutter={16}>
                    <Col>
                        <Select
                            placeholder="role name"
                            size={"large"}
                            style={{width: 200}}
                            onChange={this.onRoleSelect}
                        >
                            {this.renderRoles()}
                        </Select>
                    </Col>

                </Row>


                <br/>
                <Row gutter={16}>
                    <Col>
                        {this.renderTables()}
                    </Col>

                </Row>

            </div>
        );
    }

}



