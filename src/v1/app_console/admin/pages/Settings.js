import React, { useState, useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import '../AdminSetting.scss'
import {MailOutlined, SettingOutlined } from '@ant-design/icons';
import { DefaultBackend } from './DefaultBackend';
import { FormattedMessage  } from 'react-intl'; 
import { ApplyTimeout } from './ApplyTimeout';

const { SubMenu } = Menu;
function Settings() {
    const [currentPage,setCurrentPage] = useState("default-backend")
    return (
        <div className="app-admin">
                <div className="app-admin-side">
                    <Menu
                        style={{ width: 256 }}
                        defaultSelectedKeys={['default-backend']}
                        defaultOpenKeys={['analysis-workshop']}
                        mode="inline"
                    >
                        <SubMenu
                            key="analysis-workshop"
                            title={
                                <span>
                                    <MailOutlined />
                                    <span><FormattedMessage id="analysis_workshop"/></span>
                                </span>
                            }
                        >
                            <Menu.Item key="default-backend" onClick={()=>{
                               setCurrentPage("default-backend") 
                            }}><FormattedMessage id="set_engine"/></Menu.Item> 
                            <Menu.Item key="set-timeout" onClick={()=>{
                                setCurrentPage("set-timeout")
                            }}><FormattedMessage id="set_timeout"/></Menu.Item>                            
                        </SubMenu> 
                                                                       
                    </Menu>
                </div>
                <div className="app-admin-main">
                     {currentPage==="default-backend" && <DefaultBackend/>}                     
                     {currentPage==="set-timeout" && <ApplyTimeout/>}                     
                </div>
            </div>
    )
}
export {Settings}