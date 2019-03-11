import * as React from "react";
import "./form.scss"
import {
    Form, Select, Button, message, Input, Icon
} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {
    ADD_ROLES_TABLE,
    ADD_TEAMS_MEMBER,
    ADD_TEAMS_ROLE,
    ADD_TEAMS_TABLE,
    CREATE_TEAM,
    LIST_TEAMS
} from "../../service/BackendConfig";
import Service from "./remote/Service";


class AddTableForRole extends React.Component {

    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.state = {
            teams: [],
            roles: [],
            tables: [],
            operateTypes: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const api = new MLSQLAPI(ADD_ROLES_TABLE)
                api.request2(params, (resJson) => {
                    if (resJson["msg"] === "success") {
                        self.teamCards.roleTablesRef.current.refresh()
                        message.success("Create  success", 3)
                    } else {
                        message.warning("Create  fail:" + resJson["msg"], 10)
                    }

                }, (failStr) => {
                    message.error("Create  fail:" + failStr, 10)
                })
            }
        });
    }

    componentDidMount() {
        Service.fetchTeams(LIST_TEAMS, this, "teams")
    }

    onTeamSelect = (teamName) => {
        Service.fetchRoles(this, teamName, "roles")
        Service.fetchTables(this, teamName, "tables")
        Service.fetchOperateTypes(this, "operateTypes")
    }

    renderTeams = () => {
        return this.state.teams.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }



    renderRoles = () => {
        return this.state.roles.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    renderTables = () => {
        return this.state.tables.map(item => {
            return <Select.Option key={item.name} value={item.id}>{item.name}</Select.Option>
        })
    }

    renderOperateTypes = () => {
        return this.state.operateTypes.map(item => {
            return <Select.Option key={item.value} name={item.value}>{item.value}</Select.Option>
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">

                <Form.Item>
                    {getFieldDecorator('teamName', {
                        rules: [
                            {required: true, message: 'Please choose the team name'}
                        ],
                    })(
                        <Select
                            placeholder="Team name"
                            size={"large"}
                            style={{width: 200}}
                            onChange={this.onTeamSelect}
                        >
                            {this.renderTeams()}
                        </Select>
                    )}
                </Form.Item>


                <Form.Item>
                    {getFieldDecorator('roleName', {
                        rules: [
                            {required: true, message: 'Please input the role name '}
                        ],
                    })(
                        <Select
                            placeholder="role name"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderRoles()}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('tableName', {
                        rules: [
                            {required: true, message: 'Please input the tableName name '}
                        ],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="table name"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderTables()}
                        </Select>
                    )}
                </Form.Item>


                <Form.Item>
                    {getFieldDecorator('operateType', {
                        rules: [
                            {required: true, message: 'Please input the operateType to Role '}
                        ],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="Operate type"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderOperateTypes()}
                        </Select>
                    )}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export const MLSQLAddTableForRole = Form.create({name: 'add_table_for_role'})(AddTableForRole);