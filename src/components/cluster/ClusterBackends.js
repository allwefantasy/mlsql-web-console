import * as React from "react";
import Service from "./remote/Service";
import {MLSQLQueryDisplay} from "../MLSQLQueryDisplay";
import {Views as TeamViews} from "../team/remote/Views"
import TeamService from "../team/remote/Service"
import {Row, Col} from "antd";
import {LIST_TEAMS} from "../../service/BackendConfig";

export class ClusterBackends extends React.Component {
    constructor(props) {
        super(props)
        this.parent = props.parent
        this.dataViewer = React.createRef()
        this.state = {
            teams: [],
            roles: [],
            backends: []
        }
    }

    componentDidMount() {
        TeamService.fetchTeams(LIST_TEAMS, this, "teams")
    }

    renderBackends = () => {
        return <MLSQLQueryDisplay ref={this.dataViewer} parent={this}/>
    }

    onRoleSelect = (roleName) => {
        const self = this
        const tag = self.currentTeamName + "_" + roleName
        Service.fetchBackends(this, {
            tag: tag
        }, "backends", () => {
            self.dataViewer.current.update(self.state.backends.map(item => {
                const {ecsResourcePoolId, id, tags, ...newitem} = item;
                return newitem
            }), {})
        })
    }

    render() {
        const self = this
        return <div>
            <Row>
                <Col>
                    {TeamViews.teamSelect(self, (teamName) => {
                        TeamViews.onTeamSelect(self, teamName)
                    })}
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    {TeamViews.roleSelect(self, self.onRoleSelect)}
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    {this.renderBackends()}
                </Col>
            </Row>
        </div>

    }
}