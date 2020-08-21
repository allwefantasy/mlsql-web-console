import * as React from "react";
import {Col, Row, Card, notification} from "antd";
import {ClusterBackends} from "./ClusterBackends";
import {MLSQLAddClusterBackend} from "./AddClusterBackend";
import {MLSQLAddTagToRole} from "./AddTagToRole";
import {MLSQLConfigureDefaultBackend} from "./ConfigureDefaultBackend";
import {MLSQLAddExistClusterBackendToRole} from "./AddExistClusterBackendToRole";
import {MLSQLConfigureSchedulerDefaultBackend} from "./ConfigureSchedulerBackend";


export class ClusterCards extends React.Component {

    constructor(props) {
        super(props)
        this.parent = props.parent
        this.backendsRef = React.createRef()
        this.state = {}
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description
        });
    };

    render() {
        return <div style={{background: '#ECECEC', padding: '30px'}}>
            <Row gutter={24}>
                <Col span={8}>
                    <Card title="Set default backend tag" bordered={false}>
                        <MLSQLConfigureDefaultBackend parent={this}/>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Set default scheduler backend tag" bordered={false}>
                        <MLSQLConfigureSchedulerDefaultBackend parent={this}/>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Add Backend" bordered={false}>
                        <MLSQLAddClusterBackend parent={this}/>
                    </Card>
                </Col>
            </Row>
            <br/>
            <Row gutter={24}>
                <Col span={24}>
                    <Card title="Your Backends" bordered={false}>
                        <ClusterBackends parent={this} ref={this.backendsRef}/>
                    </Card>
                </Col>

            </Row>
            <br/>

            <Row gutter={24}>
                <Col span={24}>
                    <Card title="Add role to backend" bordered={false}>
                        <MLSQLAddExistClusterBackendToRole parent={this}/>
                    </Card>
                </Col>

            </Row>

        </div>
    }
}