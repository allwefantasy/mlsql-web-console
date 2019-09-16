import * as React from "react";
import {
    Layout, Menu, Button
} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {ScriptPluginViewForm} from "./ScriptPluginView";


const {
    Header, Content, Footer, Sider,
} = Layout;


export default class MainPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {data_menu: [], data_plugin: []}
        this.collected_params = {}

    }

    componentDidMount() {
        const api = new MLSQLAPI(RUN_SCRIPT)
        api.newRunScript({}, `load delta.\`__mlsql__.plugins\` as plugins;
select * from plugins where pluginType="script" as output;`, json => {
            this.setState({data_menu: json}, () => {
                if (json.length > 0) {
                    this.showTut(json[0]['pluginName'])
                }
            })
        }, fail => {
        })


    }

    pushParam = (item) => {
        Object.assign(this.collected_params, item)
    }

    showTut = (pluginName) => {
        this.current_plugin_name = pluginName
        const api = new MLSQLAPI(RUN_SCRIPT)
        api.newRunScript({}, `!plugin script show ${pluginName}/plugin.json;`, json => {

            this.setState({
                data_plugin: json.map((item) => {
                    return JSON.parse(item['value'])[this.current_plugin_name]['compositor']
                })
            })
        }, fail => {
        })
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline">
                        {this.state.data_menu.map((item) => {
                                return (<Menu.Item key="0" onClick={() => {
                                    this.showTut(item['pluginName'])
                                }}>
                                    {item['pluginName']}
                                </Menu.Item>)
                            }
                        )}

                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}/>
                    <Content style={{margin: '0 16px'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            {this.state.data_plugin.map((item) => {
                                return <ScriptPluginViewForm parent={this}
                                                             steps={item}/>
                            })}
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>

                    </Footer>
                </Layout>
            </Layout>
        );
    }
}