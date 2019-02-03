import * as React from "react";
import {
    Layout, Menu, Breadcrumb, Icon, Button
} from 'antd';
import {MLSQLQueryDisplay} from "../MLSQLQueryDisplay";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {CLUSTER_MANAGER, USER_TAGS_UPDATE} from "../../service/BackendConfig";
import {CLUSTER_VIEW_BackendForm, CLUSTER_VIEW_BackendList, CLUSTER_VIEW_SetBackendTags} from "../../common/ViewConst";
import BackendForm from "./BackendForm";
import SetBackendTagsView from "./SetBackendTagsView";
import {MLSQLAuth} from "../../user/MLSQLAuth";

const {
    Header, Content, Footer, Sider,
} = Layout;

const SubMenu = Menu.SubMenu;

export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            currentView: CLUSTER_VIEW_BackendList
        };
        this.tableDisplayRef = React.createRef()
        this.backendFormRef = React.createRef()
        this.setBackendTagsViewRef = React.createRef()
    }


    deleteBackend = (id) => {
        const self = this
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        api.request2({
            id: id,
            action: "/backend/remove"
        }, (json) => {
            self.switchToBackendList()
        }, (str) => {

        })
    }

    loadBackends = () => {
        const self = this
        const api = new MLSQLAPI(CLUSTER_MANAGER)

        const auth = new MLSQLAuth()
        auth.user((jsonRes) => {
            const {userName, backendTags} = jsonRes
            api.request2({
                action: "/backend/list"
            }, (json) => {

                json.forEach((item) => {
                    let activeTag = ""
                    if (backendTags == item["tag"]) {
                        activeTag = <Button disabled={true} style={{color: "green"}}
                                            type="primary">Active</Button>
                    }
                    item["status"] = activeTag
                    item["operator"] = <div>
                        <Button type="danger" onClick={() => {
                            self.deleteBackend(item["id"])
                        }}>delete</Button>
                    </div>
                    delete item["tags"]

                })
                self.tableDisplayRef.current.update(json, {
                    render: {
                        operator: (value) => {
                            return <span>{value}</span>
                        },
                        status: (value) => {
                            return <span>{value}</span>
                        }
                    }
                })
            }, (str) => {

            })

        })


    }


    switchToBackendForm = () => {
        this.setState({currentView: CLUSTER_VIEW_BackendForm})
    }

    switchToBackendList = () => {
        this.setState({currentView: CLUSTER_VIEW_BackendList})
        this.loadBackends()
    }

    switchToSetBackendTags = () => {
        this.setState({currentView: CLUSTER_VIEW_SetBackendTags})
    }

    renderView = () => {
        if (this.state.currentView == CLUSTER_VIEW_BackendList) {
            this.loadBackends()
            return <MLSQLQueryDisplay ref={this.tableDisplayRef} parent={this}/>
        }
        if (this.state.currentView == CLUSTER_VIEW_BackendForm)
            return <BackendForm ref={this.backendFormRef} parent={this}/>

        if (this.state.currentView == CLUSTER_VIEW_SetBackendTags) {
            return <SetBackendTagsView ref={this.setBackendTagsViewRef} parent={this}/>
        }
    }

    renderViewIndex = () => {
        if (this.state.currentView == CLUSTER_VIEW_BackendList) {
            return '1'
        }
        if (this.state.currentView == CLUSTER_VIEW_BackendForm)
            return '2'

        if (this.state.currentView == CLUSTER_VIEW_SetBackendTags) {
            return '3'
        }
        return '1'
    }


    onCollapse = (collapsed) => {
        this.setState({collapsed});
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={[this.renderViewIndex()]} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="desktop"/>
                            <span><a style={{color: "white"}} onClick={this.switchToBackendList}>List Backend</a></span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop"/>
                            <span><a style={{color: "white"}} onClick={this.switchToBackendForm}>Add Backend</a></span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="desktop"/>
                            <span><a style={{color: "white"}}
                                     onClick={this.switchToSetBackendTags}>Set Console Backend</a></span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                        </Breadcrumb>
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