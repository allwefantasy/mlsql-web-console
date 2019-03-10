import * as React from "react";
import {
    Layout, Menu, Breadcrumb, Icon, Button
} from 'antd';
import {TEAM_VIEW_BASIC} from "../../common/ViewConst";
import {TeamCards} from "./TeamCards";

const {
    Header, Content, Footer, Sider,
} = Layout;


export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.demosRef = React.createRef()

    }

    switchToBasic = () => {
        this.demosRef.current.setState({currentView: TEAM_VIEW_BASIC})
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
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            <TeamCards/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>

                    </Footer>
                </Layout>
            </Layout>
        );
    }
}