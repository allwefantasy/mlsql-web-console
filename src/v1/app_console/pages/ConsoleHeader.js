import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { AppConsoleContext } from '../AppConsole';
import { Menu, Divider } from 'antd';
import { HomeOutlined, AppstoreOutlined, SettingOutlined, MoreOutlined, LogoutOutlined, SelectOutlined, LoginOutlined } from '@ant-design/icons';
import ActionMaker from '../../ActionMaker';
import { AppConsoleActionNames } from '../actions/AppConsoleReducer';
import UIMaker from '../../UIMaker';
const { SubMenu } = Menu;

const ConsoleHeaderContext = React.createContext()

function ConsoleHeader(props) {
    const { dispacher } = useContext(AppConsoleContext)    
    const [current, setCurrent] = useState(props.currentPage)
    const [logined, setLogined] = useState(UIMaker.logined())
    return (
        <ConsoleHeaderContext.Provider>
            <Menu onClick={(e) => {
                setCurrent(e.key)
                dispacher(ActionMaker.buildEvent(
                    AppConsoleActionNames.SWITCH, { currentPage: e.key }
                ))
            }} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="home">
                    <span style={{ fontSize: 32 }}>MLSQL Web Console</span>
                </Menu.Item>
                <Divider type="vertical"></Divider>

                {!logined && <Menu.Item key="login" icon={<LoginOutlined />}>
                    Login
                </Menu.Item>}
                {!logined && <Menu.Item key="register" icon={<SelectOutlined />}>
                    Register
                </Menu.Item>}

                {logined && <Menu.Item key="console" icon={<HomeOutlined />}>
                    Console
                </Menu.Item>}
                {logined && <Menu.Item key="workshop" icon={<AppstoreOutlined />}>
                    Analysis Workshop
                </Menu.Item>}
                {
                    logined && <Menu.Item key="admin" icon={<SettingOutlined />}>
                        Settings
                </Menu.Item>
                }
                {
                    logined && <SubMenu icon={<MoreOutlined />} title="More...">
                        <Menu.Item key="more:doc">中文文档</Menu.Item>
                        <Menu.Item key="more:logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
                    </SubMenu>
                }
            </Menu>
        </ConsoleHeaderContext.Provider>
    )
}
export { ConsoleHeader, ConsoleHeaderContext }