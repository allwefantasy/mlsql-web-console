import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { AppConsoleContext } from '../AppConsole';
import { Menu, Divider, Alert } from 'antd';
import { HomeOutlined, AppstoreOutlined, SettingOutlined, MoreOutlined, LogoutOutlined, SelectOutlined, LoginOutlined } from '@ant-design/icons';
import ActionMaker from '../../ActionMaker';
import { AppConsoleActionNames } from '../actions/AppConsoleReducer';
import UIMaker from '../../UIMaker';
import Modal from 'antd/lib/modal/Modal';
const { SubMenu } = Menu;

const ConsoleHeaderContext = React.createContext()

function ConsoleHeader(props) {
    const { currentPage, userLogined, isUserAdmin } = props
    const { dispacher } = useContext(AppConsoleContext)
    const [current, setCurrent] = useState(currentPage)
    const [logined, setLogined] = useState(userLogined)
    const [isAdmin, setIsAdmin] = useState(isUserAdmin)
    const [leave, setLeave] = useState(undefined)
    const tempCurrent = useRef()

    useEffect(() => {
        const { currentPage, userLogined, isUserAdmin } = props
        setCurrent(currentPage)
        setLogined(userLogined)
        setIsAdmin(isUserAdmin)
    }, [props]);

    return (
        <ConsoleHeaderContext.Provider>
            <Modal
                title={"Confirm"}
                visible={leave || false}
                onCancel={() => { setLeave(undefined) }}
                onOk={() => {
                    setLeave(undefined)
                    setCurrent(tempCurrent.current)
                    dispacher(ActionMaker.buildEvent(
                        AppConsoleActionNames.SWITCH, { currentPage: tempCurrent.current }
                    ))
                }}
                cancelText="Cancel"
                okText="Leave"
            >
                <Alert                    
                    description={leave}
                    type="info"
                />
            </Modal>
            <Menu onClick={(e) => {
                if (current === "workshop" && e.key !== "workshop") {
                    tempCurrent.current = e.key
                    setLeave("Do you wanna leave workshop? Please make sure you have saved your work before you leave.")
                } else {
                    setCurrent(e.key)
                    dispacher(ActionMaker.buildEvent(
                        AppConsoleActionNames.SWITCH, { currentPage: e.key }
                    ))
                }

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
                    logined && <Menu.Item key="settings" icon={<SettingOutlined />}>
                        Settings
                </Menu.Item>
                }
                {
                    logined && isAdmin && <Menu.Item key="admin" icon={<SettingOutlined />}>
                        Admin
                    </Menu.Item>
                }
                {
                    logined && <SubMenu icon={<MoreOutlined />} title="More...">
                        <Menu.Item key="doc">中文文档</Menu.Item>
                        <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
                    </SubMenu>
                }
            </Menu>
        </ConsoleHeaderContext.Provider>
    )
}
export { ConsoleHeader, ConsoleHeaderContext }