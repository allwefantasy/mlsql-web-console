import * as React from "react";
import {
    Layout, Menu, Breadcrumb, Icon, Button
} from 'antd';
import {DEMO_VIEW_BIGDL} from "../../common/ViewConst";
import BigDL from "./BigDL";

const {
    Header, Content, Footer, Sider,
} = Layout;


export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentView: DEMO_VIEW_BIGDL
        }

    }

    switchToBigDL = () => {
        this.setState({currentView: DEMO_VIEW_BIGDL})
    }

    renderView = () => {
        if (this.state.currentView === DEMO_VIEW_BIGDL) {
            return <BigDL/>
        }
        return null
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="desktop"/>
                            <span><a style={{color: "white"}} onClick={this.switchToBigDL}>Cifar10</a></span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop"/>
                            <span><a style={{color: "white"}}>NLP</a></span>
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