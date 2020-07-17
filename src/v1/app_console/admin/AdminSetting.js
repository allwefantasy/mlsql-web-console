import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { AdminSettingReducer, AdminSettingHandlers } from './actions/AdminSettingReducer';
import { Menu } from 'antd';
import './AdminSetting.scss'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { LRSettings } from './pages/LRSettings';

const { SubMenu } = Menu;


const initState = {
    currentPage: "lr-settings"
}

const AdminSettingContext = React.createContext()

function AdminSetting() {
    const [state, dispacher] = useReducerAsync(AdminSettingReducer, initState, AdminSettingHandlers)
    const {currentPage} = state
    return (
        <AdminSettingContext.Provider value={{ dispacher }}>
            <div className="app-admin">
                <div className="app-admin-side">
                    <Menu
                        style={{ width: 256 }}
                        defaultSelectedKeys={['lr-settings']}
                        defaultOpenKeys={['console-settings']}
                        mode="inline"
                    >
                        <SubMenu
                            key="console-settings"
                            title={
                                <span>
                                    <MailOutlined />
                                    <span>Console settings</span>
                                </span>
                            }
                        >
                            <Menu.Item key="lr-settings">Login/Register Control</Menu.Item>                            
                        </SubMenu>                        
                    </Menu>
                </div>
                <div className="app-admin-main">
                     {currentPage==="lr-settings" && <LRSettings></LRSettings>}
                </div>
            </div>
        </AdminSettingContext.Provider>
    )
}
export { AdminSetting, AdminSettingContext }