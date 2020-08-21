import * as React from 'react';
import {Menu,Dropdown, Divider} from 'antd';
import {DownOutlined,BarChartOutlined} from '@ant-design/icons'
import Tools from '../../../common/Tools';

export const DropdownMenuUI = (superclass) => class extends superclass {
    dropdownStat = async (type,columnName)=>{
        this.setState({
            loading: true
        })
        const tableName = Tools.getTempTableName()
        switch(type){
            case "count":                                 
                await this.workshop.apply({
                    tableName: tableName,
                    sql: `select count(${Tools.getField(columnName)}) 
                    from ${this.workshop.getLastApplyTable().tableName}
                    as ${tableName}
                    ;`
                })
                this.setState({
                    loading: false
                }) 
                return
                
            case "count(distinct)":
                await this.workshop.apply({
                    tableName: tableName,
                    sql: `select count(distinct ${Tools.getField(columnName)}) 
                    from ${this.workshop.getLastApplyTable().tableName}
                    as ${tableName}
                    ;`
                })
                this.setState({
                    loading: false
                }) 
                return

        } 
        this.setState({
            loading: false
        })        

     }
     dropdown = (item)=>{
        const menu = (
            <Menu onClick={(evt)=>{
                this.dropdownStat(evt.key,item.name)
            }}>
              <Menu.Item key="count" icon={<BarChartOutlined />}>
                Count
              </Menu.Item>
              <Menu.Item key="count(distinct)" icon={<BarChartOutlined />}>
                Count&distinct
              </Menu.Item>              
            </Menu>
          );
          return <Dropdown overlay={menu}>
          <span>{item.name}<Divider type="vertical"/><DownOutlined/></span>
        </Dropdown>
     }
}