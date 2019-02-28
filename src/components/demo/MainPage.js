import * as React from "react";
import {
    Layout, Menu, Breadcrumb, Icon, Button
} from 'antd';
import {DEMO_VIEW_BIGDL, DEMO_VIEW_NLP, DEMO_VIEW_STREAM} from "../../common/ViewConst";
import BigDL from "./BigDL";
import {NLP} from "./NLP";
import {Demos} from "./Demos";

const {
    Header, Content, Footer, Sider,
} = Layout;


export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.demosRef = React.createRef()

    }

    switchToBigDL = () => {
        this.demosRef.current.setState({currentView: DEMO_VIEW_BIGDL})
    }
    switchToNLP = () => {
        this.demosRef.current.setState({currentView: DEMO_VIEW_NLP})
    }

    switchToStream = () => {
        this.demosRef.current.setState({currentView: DEMO_VIEW_STREAM})
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
                            <span><a style={{color: "white"}} onClick={this.switchToNLP}>NLP</a></span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="desktop"/>
                            <span><a style={{color: "white"}}>Stream</a></span>
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