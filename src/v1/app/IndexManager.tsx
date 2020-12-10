import React, {useState, useCallback, useEffect} from 'react';
import {Menu} from 'antd';
import {MailOutlined, SettingOutlined} from '@ant-design/icons';
import {FormattedMessage} from "react-intl";
import {IndexList} from "./indexmanager/IndexerList";
import {CreateIndexer} from "./indexmanager/CreateIndexer";


const {SubMenu} = Menu;

function IndexManager() {
    const [currentPage, setCurrentPage] = useState("indexer_list")
    return (
        <div className="app-admin">
            <div className="app-admin-side">
                <Menu
                    style={{width: 256}}
                    defaultSelectedKeys={['indexer_list']}
                    defaultOpenKeys={['mysql_indexer_manager']}
                    mode="inline"
                >
                    <SubMenu
                        key="mysql_indexer_manager"
                        title={<span><MailOutlined/><span><FormattedMessage id="mysql_indexer_manager"/></span>
        </span>
                        }
                    >
                        <Menu.Item key="indexer_list" onClick={() => {
                            setCurrentPage("indexer_list")
                        }}><FormattedMessage id="indexer_list"/></Menu.Item>

                        <Menu.Item key="create_indexer" onClick={() => {
                            setCurrentPage("create_indexer")
                        }}><FormattedMessage id="create_indexer"/></Menu.Item>

                    </SubMenu>
                    <SubMenu
                        key="other_indexer_manager"
                        title={<span><MailOutlined/><span><FormattedMessage id="other_indexer_manager"/></span>
        </span>
                        }
                    >
                        <Menu.Item key="indexer_list2" onClick={() => {
                            setCurrentPage("indexer_list2")
                        }}><FormattedMessage id="indexer_list2"/></Menu.Item>

                        <Menu.Item key="create_indexer2" onClick={() => {
                            setCurrentPage("create_indexer2")
                        }}><FormattedMessage id="create_indexer2"/></Menu.Item>

                    </SubMenu>
                </Menu>
            </div>
            <div className="app-admin-main">
                {currentPage === "indexer_list" && <IndexList />}
                {currentPage === "create_indexer" && <CreateIndexer />}
            </div>
        </div>
    )
}

export {IndexManager}