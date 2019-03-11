import * as React from "react";
import {Col, Row, Card, notification} from "antd";


export class ClusterCards extends React.Component {

    constructor(props) {
        super(props)
        this.parent = props.parent
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
                    <Card title="Add Backend" bordered={false}>

                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="List Backends" bordered={false}></Card>
                </Col>
                <Col span={8}>
                    <Card title="Set backend" bordered={false}>

                    </Card>
                </Col>
            </Row>

        </div>
    }
}