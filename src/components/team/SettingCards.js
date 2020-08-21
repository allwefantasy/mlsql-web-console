import * as React from "react";
import {Card, Col, Row} from "antd";
import {MLSQLChangePassword} from "../team/MLSQLChangePassword";

export class SettingCards extends React.Component {

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
                    <Card title="Change password" bordered={false}>
                        <MLSQLChangePassword parent={this}/>
                    </Card>
                </Col>

            </Row>
            <br/>

        </div>
    }
}