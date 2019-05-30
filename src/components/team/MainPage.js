import * as React from "react";
import {
    Layout, Menu, Breadcrumb, Icon, Button
} from 'antd';
import {
    AUTH_VIEW_BASIC,
    CLUSTER_VIEW_BASIC,
    SETTING_VIEW_BASIC,
    SETUP_VIEW_BASIC,
    TEAM_VIEW_BASIC
} from "../../common/ViewConst";
import {TeamCards} from "./TeamCards";
import {ClusterCards} from "../cluster/ClusterCards";
import {AuthCards} from "../auth/AuthCards";
import Setup from "../demo/Setup";
import {SettingCards} from "./SettingCards";

const {
    Header, Content, Footer, Sider,
} = Layout;


export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.app = props.parent
        this.state = {
            currentView: SETUP_VIEW_BASIC
        }


    }

    switchToBasic = () => {
        this.setState({currentView: TEAM_VIEW_BASIC})
    }

    switchToSetup = () => {
        this.setState({currentView: SETUP_VIEW_BASIC})
    }

    switchToCluster = () => {
        this.setState({currentView: CLUSTER_VIEW_BASIC})
    }

    switchToAuth = () => {
        this.setState({currentView: AUTH_VIEW_BASIC})
    }

    switchToSetting = () => {
        this.setState({currentView: SETTING_VIEW_BASIC})
    }

    renderView = () => {
        if (this.state.currentView === SETUP_VIEW_BASIC) return <Setup/>
        if (this.state.currentView === TEAM_VIEW_BASIC) return <TeamCards/>
        if (this.state.currentView === CLUSTER_VIEW_BASIC) return <ClusterCards/>
        if (this.state.currentView === AUTH_VIEW_BASIC) return <AuthCards/>
        if (this.state.currentView === SETTING_VIEW_BASIC) return <SettingCards/>
    }


    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline">
                        <Menu.Item key="0">
                            <Button block onClick={this.switchToSetup}>Setup</Button>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <Button block onClick={this.switchToBasic}>Team</Button>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Button block onClick={this.switchToCluster}>Cluster</Button>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Button block onClick={this.switchToAuth}>Auth</Button>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Button block onClick={this.switchToSetting}>Setting</Button>
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