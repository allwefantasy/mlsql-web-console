import React, { useState, useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import '../AdminSetting.scss'
import {MailOutlined, SettingOutlined } from '@ant-design/icons';
import { DefaultBackend } from './DefaultBackend';

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
                                    <span>Analysis Workshop</span>
                                </span>
                            }
                        >
                            <Menu.Item key="default-backend" onClick={()=>{
                                
                            }}>Default Backend</Menu.Item>                            
                        </SubMenu> 
                                                                       
                    </Menu>
                </div>
                <div className="app-admin-main">
                     {currentPage==="default-backend" && <DefaultBackend/>}                     
                </div>
            </div>
    )
}
export {Settings}