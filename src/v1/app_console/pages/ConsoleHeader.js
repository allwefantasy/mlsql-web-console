import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { AppConsoleContext } from '../AppConsole';
import { Menu, Divider, Alert } from 'antd';
import { HomeOutlined, AppstoreOutlined, SettingOutlined, MoreOutlined, LogoutOutlined, SelectOutlined, LoginOutlined } from '@ant-design/icons';
import ActionMaker from '../../ActionMaker';
import { AppConsoleActionNames } from '../actions/AppConsoleReducer';
import UIMaker from '../../UIMaker';
import Modal from 'antd/lib/modal/Modal'
import { FormattedMessage  } from 'react-intl'; 
const { SubMenu } = Menu;

const ConsoleHeaderContext = React.createContext()

function ConsoleHeader(props) {
    const { currentPage, userLogined, isUserAdmin,appInfo } = props
    const { dispacher } = useContext(AppConsoleContext)
    const [current, setCurrent] = useState(currentPage)
    const [logined, setLogined] = useState(userLogined)
    const [isAdmin, setIsAdmin] = useState(isUserAdmin)
    const [leave, setLeave] = useState(undefined)

    const [enableConsole,setEnableConsole] = useState(false)
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
                if(e.key === "home"){
                    e.domEvent.preventDefault()
                    e.domEvent.stopPropagation()
                    return
                }           
                if (logined && current === "workshop" && e.key !== "workshop") {
                    tempCurrent.current = e.key
                    setLeave("Do you wanna leave workshop? Please make sure you have saved your work before you leave.")
                } else {
                    setCurrent(e.key)
                    dispacher(ActionMaker.buildEvent(
                        AppConsoleActionNames.SWITCH, { currentPage: e.key }
                    ))
                }

            }} selectedKeys={[current]} mode="horizontal">
                <Menu.Item  key="home">
                    <span style={{ fontSize: 32 }}>MLSQL Web Console</span>
                    <span style={{ fontSize: 11 }}>(Build _VERSION_)</span>
                </Menu.Item>
                <Divider type="vertical"></Divider>

                {!logined && <Menu.Item key="login" icon={<LoginOutlined />}>
                    <FormattedMessage id="login"/>
                </Menu.Item>}
                {!logined && <Menu.Item key="register" icon={<SelectOutlined />}>
                     <FormattedMessage id="register"/>                    
                </Menu.Item>}

                {logined && appInfo.enableConsole && <Menu.Item key="console" icon={<HomeOutlined />}>
                    <FormattedMessage id="console"/>
                </Menu.Item>}
                {logined && <Menu.Item key="workshop" icon={<AppstoreOutlined />}>
                   <FormattedMessage id="analysis_workshop"/>                    
                </Menu.Item>}
                {
                    logined && <Menu.Item key="settings" icon={<SettingOutlined />}>
                        <FormattedMessage id="settings"/>                    
                </Menu.Item>
                }
                {
                    logined && isAdmin && <Menu.Item key="admin" icon={<SettingOutlined />}>
                        <FormattedMessage id="admin"/>
                    </Menu.Item>
                }
                {
                    logined && <SubMenu icon={<MoreOutlined />} title={<FormattedMessage id="more"/>}>
                        <Menu.Item key="doc">中文文档</Menu.Item>
                        <Menu.Item key="engine">Engine</Menu.Item>
                        <Menu.Item key="logout" icon={<LogoutOutlined />}>Logout</Menu.Item>
                    </SubMenu>
                }
            </Menu>
        </ConsoleHeaderContext.Provider>
    )
}
export { ConsoleHeader, ConsoleHeaderContext }
