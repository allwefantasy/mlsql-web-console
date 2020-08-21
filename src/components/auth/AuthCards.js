import * as React from "react";
import {Card, Col, Row} from "antd";
import {MLSQLAddTableForTeam} from "../team/AddTableForTeam";

import {RoleTables} from "../team/RoleTables";
import {MLSQLAddTableForRole} from "../team/AddTableForRole";


export class AuthCards extends React.Component {

    constructor(props) {
        super(props)
        this.parent = props.parent
        this.roleTablesRef = React.createRef()
        this.state = {}
    }

    render() {
        return <div style={{background: '#ECECEC', padding: '30px'}}>


            <Row gutter={24}>
                <Col span={12}>
                    <Card title="Add Table to Team" bordered={false}>
                        <MLSQLAddTableForTeam parent={this}/>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Add table to role" bordered={false}>
                        <MLSQLAddTableForRole parent={this}/>
                    </Card>
                </Col>
            </Row>
            <br/>

            <Row gutter={24}>
                <Col span={24}>
                    <Card title="View tables By Role" bordered={false}>
                        <RoleTables parent={this} ref={this.roleTablesRef}/>
                    </Card>
                </Col>

            </Row>
            <br/>

        </div>
    }
}