import * as React from "react";
import {
    Layout, Menu, Breadcrumb, Icon, Button
} from 'antd';
import {DEMO_VIEW_BASIC, DEMO_VIEW_BIGDL, DEMO_VIEW_NLP, DEMO_VIEW_STREAM} from "../../common/ViewConst";
import {Demos} from "./Demos";

const {
    Header, Content, Footer, Sider,
} = Layout;


export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.demosRef = React.createRef()

    }

    switchToBigDL = (e) => {
        this.demosRef.current.setState({currentView: DEMO_VIEW_BIGDL})
    }
    switchToNLP = (e) => {
        this.demosRef.current.setState({currentView: DEMO_VIEW_NLP})
    }

    switchToStream = (e) => {
        this.demosRef.current.setState({currentView: DEMO_VIEW_STREAM})
    }

    switchToBasic = () => {
        this.demosRef.current.setState({currentView: DEMO_VIEW_BASIC})
    }


    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline">
                        <Menu.Item key="0">
                            <Button block onClick={this.switchToBasic}>Basic Tutorial</Button>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <Button block onClick={this.switchToBigDL}>Cifar10</Button>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Button block onClick={this.switchToNLP}>NLP</Button>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Button block>Stream</Button>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Button block>Excel</Button>
                        </Menu.Item>

                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            <Demos ref={this.demosRef}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>

                    </Footer>
                </Layout>
            </Layout>
        );
    }
}