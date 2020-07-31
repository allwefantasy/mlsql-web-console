import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { AdminSettingReducer, AdminSettingHandlers } from './actions/AdminSettingReducer';
import { Menu } from 'antd';
import './AdminSetting.scss'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { LRSettings } from './pages/LRSettings';
import {Engines} from './pages/Engines'
import ChangePassword from './pages/ChangePassword';

const { SubMenu } = Menu;


const initState = {
    currentPage: "website-settings"
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
                        defaultSelectedKeys={['website-settings']}
                        defaultOpenKeys={['console-settings']}
                        mode="inline"
                    >
                        <SubMenu
                            key="console-settings"
                            title={
                                <span>
                                    <MailOutlined />
                                    <span>Console Settings</span>
                                </span>
                            }
                        >
                            <Menu.Item key="website-settings" onClick={()=>{
                                dispacher({
                                    type:"setState",
                                    data:{currentPage:"website-settings"}
                                })
                            }}>Website Settings</Menu.Item> 
                            <Menu.Item key="change-admin-password" onClick={()=>{
                                dispacher({
                                    type:"setState",
                                    data:{currentPage:"change-admin-password"}
                                })
                            }}>Change Password</Menu.Item>                             
                        </SubMenu> 
                        <SubMenu
                            key="engine-settings"
                            title={
                                <span>
                                    <MailOutlined />
                                    <span>Engine Settings</span>
                                </span>
                            }
                        >
                            <Menu.Item onClick={()=>{
                                dispacher({
                                    type:"setState",
                                    data:{currentPage:"engines"}
                                })
                            }} key="engines">Engines</Menu.Item>                                                         
                        </SubMenu>                                               
                    </Menu>
                </div>
                <div className="app-admin-main">
                     {currentPage==="website-settings" && <LRSettings></LRSettings>}
                     {currentPage==="engines" && <Engines></Engines>} 
                     {currentPage === "change-admin-password" && <ChangePassword></ChangePassword>}                    
                </div>
            </div>
        </AdminSettingContext.Provider>
    )
}
export { AdminSetting, AdminSettingContext }