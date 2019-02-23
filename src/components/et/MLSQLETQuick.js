import * as React from "react";
import {Collapse, Tabs} from 'antd';
import {Card, Col, Row} from 'antd';


const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

export class MLSQLETQuick extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Collapse style={{margin:"0px 0px",padding:"0px 0px"}}>
                <Panel header="Quick Menu" key="1">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="Card title" bordered={false} draggable={true}>Card content</Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Card title" bordered={false}>Card content</Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Card title" bordered={false}>Card content</Card>
                        </Col>
                    </Row>
                </Panel>
            </Collapse>
        )
    }
}