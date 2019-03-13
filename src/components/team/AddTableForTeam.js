import * as React from "react";
import "./form.scss"
import {
    Form, Select, Button, message, Input, Icon
} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {ADD_TEAMS_MEMBER, ADD_TEAMS_ROLE, ADD_TEAMS_TABLE, CREATE_TEAM, LIST_TEAMS} from "../../service/BackendConfig";
import Service from "./remote/Service";


class AddTableForTeam extends React.Component {

    constructor(props) {
        super(props)
        this.teamCards = props.parent
        this.state = {
            teams: [],
            tableTypes: [],
            sourceTypes: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const self = this
        this.props.form.validateFields((err, params) => {
            if (!err) {
                const api = new MLSQLAPI(ADD_TEAMS_TABLE)
                api.request2(params, (resJson) => {
                    if (resJson["msg"] === "success") {
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
        Service.fetchTableTypes(this, "tableTypes")
        Service.fetchSourceTypes(this, "sourceTypes")

    }

    renderTeams = () => {
        return this.state.teams.map(item => {
            return <Select.Option key={item.name} name={item.name}>{item.name}</Select.Option>
        })
    }

    renderTableTypes = () => {
        return this.state.tableTypes.map(item => {
            return <Select.Option key={item.value} name={item.value}>{item.value}</Select.Option>
        })
    }

    renderSourceTypes = () => {
        return this.state.sourceTypes.map(item => {
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
                        >
                            {this.renderTeams()}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [
                            {required: true, message: 'Please input the table name'}
                        ],
                    })(
                        <Input prefix={<Icon type="table" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="table name"/>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('db', {
                        rules: [],
                    })(
                        <Input prefix={<Icon type="table" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="db name"/>
                    )}
                </Form.Item>


                <Form.Item>
                    {getFieldDecorator('tableType', {
                        rules: [
                            {required: true, message: 'Please input the table type you want to create'}
                        ],
                    })(
                        <Select
                            placeholder="table Type"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderTableTypes()}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('sourceType', {
                        rules: [],
                    })(
                        <Select
                            placeholder="source Type"
                            size={"large"}
                            style={{width: 200}}
                        >
                            {this.renderSourceTypes()}
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

export const MLSQLAddTableForTeam = Form.create({name: 'add_table_for_team'})(AddTableForTeam);