import * as React from "react";
import {
    Layout, Menu, Breadcrumb, Icon, Button
} from 'antd';
import {CLUSTER_VIEW_BASIC, TEAM_VIEW_BASIC} from "../../common/ViewConst";
import {TeamCards} from "./TeamCards";
import {ClusterCards} from "../cluster/ClusterCards";

const {
    Header, Content, Footer, Sider,
} = Layout;


export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.app = props.parent
        this.state = {
            currentView: TEAM_VIEW_BASIC
        }


    }

    switchToBasic = () => {
        this.setState({currentView: TEAM_VIEW_BASIC})
    }

    switchToCluster = () => {
        this.setState({currentView: CLUSTER_VIEW_BASIC})
    }

    renderView = () => {
        if (this.state.currentView === TEAM_VIEW_BASIC) return <TeamCards/>
        if (this.state.currentView === CLUSTER_VIEW_BASIC) return <ClusterCards/>
    }


    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline">
                        <Menu.Item key="0">
                            <Button block onClick={this.switchToBasic}>Team</Button>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <Button block onClick={this.switchToCluster}>Cluster</Button>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            {this.renderView()}
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>

                    </Footer>
                </Layout>
            </Layout>
        );
    }
}