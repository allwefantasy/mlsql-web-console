import React, { useState, useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import '../AdminSetting.scss'
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import { DefaultBackend } from './DefaultBackend';
import { FormattedMessage } from 'react-intl';
import { ApplyTimeout } from './ApplyTimeout';
import ChangePassword from './ChangePassword';
import { Teams } from './Teams';
import { MySQL } from '../../../analysis/datasource/pages/MySQL';
import { ListMySQL } from '../../../analysis/datasource/pages/ListMySQL';
import {SetupEngineFromCloud} from "../../pages/SetupEngineFromCloud";
import {DeleteCloudEngine} from "../../pages/DeleteCloudEngine";
import {EngineLog} from "../../pages/EngineLog";
import {RegisterEngine} from "../../pages/RegisterEngine";

const { SubMenu } = Menu;
function Settings() {
    const [currentPage, setCurrentPage] = useState("default-backend")
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
                                <span><FormattedMessage id="analysis_workshop" /></span>
                            </span>
                        }
                    >
                        <Menu.Item key="default-backend" onClick={() => {
                            setCurrentPage("default-backend")
                        }}><FormattedMessage id="set_engine" /></Menu.Item>
                        <Menu.Item key="set-timeout" onClick={() => {
                            setCurrentPage("set-timeout")
                        }}><FormattedMessage id="set_timeout" /></Menu.Item>
                    </SubMenu>
                    <SubMenu key="user" title={
                        <span>
                            <MailOutlined />
                            <span><FormattedMessage id="user_settings" /></span>
                        </span>
                    }>
                        <Menu.Item key="change-admin-password"


                            onClick={() => {
                                setCurrentPage("change-admin-password")
                            }}><FormattedMessage id="change_password" /></Menu.Item>
                    </SubMenu>

                    <SubMenu key="team" title={
                        <span>
                            <MailOutlined />
                            <span><FormattedMessage id="team" /></span>
                        </span>
                    }>
                        <Menu.Item key="team_manager"
                            onClick={() => {
                                setCurrentPage("team_manager")
                            }}><FormattedMessage id="team_manager" /></Menu.Item>
                    </SubMenu>
                    <SubMenu key="datasource" title={
                        <span>
                            <MailOutlined />
                            <span><FormattedMessage id="datasource" /></span>
                        </span>
                    }>
                        <Menu.Item key="mysql"
                            onClick={() => {
                                setCurrentPage("mysql")
                            }}><FormattedMessage id="connect_mysql" /></Menu.Item>
                        <Menu.Item key="list_mysql"
                            onClick={() => {
                                setCurrentPage("list_mysql")
                            }}><FormattedMessage id="list_mysql" /></Menu.Item>
                    </SubMenu>

                    <SubMenu key="aliyun_cloud_engine" title={
                        <span>
                            <MailOutlined />
                            <span><FormattedMessage id="aliyun_cloud_engine" /></span>
                        </span>
                    }>
                        <Menu.Item key="create_cloud_engine"
                                   onClick={() => {
                                       setCurrentPage("create_cloud_engine")
                                   }}><FormattedMessage id="create_cloud_engine" /></Menu.Item>
                        <Menu.Item key="delete_cloud_engine"
                                   onClick={() => {
                                       setCurrentPage("delete_cloud_engine")
                                   }}><FormattedMessage id="delete_cloud_engine" /></Menu.Item>
                        <Menu.Item key="cloud_engine_log"
                                   onClick={() => {
                                       setCurrentPage("cloud_engine_log")
                                   }}><FormattedMessage id="cloud_engine_log" /></Menu.Item>
                    </SubMenu>

                    <SubMenu key="a_7" title={
                        <span>
                            <MailOutlined />
                            <span><FormattedMessage id="a_7" /></span>
                        </span>
                    }>
                        <Menu.Item key="a_8"
                                   onClick={() => {
                                       setCurrentPage("a_8")
                                   }}><FormattedMessage id="a_8" /></Menu.Item>
                    </SubMenu>

                </Menu>
            </div>
            <div className="app-admin-main">
                {currentPage === "default-backend" && <DefaultBackend />}
                {currentPage === "set-timeout" && <ApplyTimeout />}
                {currentPage === "change-admin-password" && <ChangePassword></ChangePassword>}
                {currentPage === "team_manager" && <Teams></Teams>}
                {currentPage === "mysql" && <MySQL />}
                {currentPage === "list_mysql" && <ListMySQL />}
                {currentPage === "create_cloud_engine" && <SetupEngineFromCloud />}
                {currentPage === "delete_cloud_engine" && <DeleteCloudEngine />}
                {currentPage === "cloud_engine_log" && <EngineLog />}
                {currentPage === "a_8" && <RegisterEngine />}
            </div>
        </div>
    )
}
export { Settings }