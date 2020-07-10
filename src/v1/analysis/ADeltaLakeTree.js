import * as React from "react";
import { Tree, Spin, Menu, Icon, Modal } from 'antd';
import DeltaLakeTree from "../detla_lake/DeltaLakeTree";
const { TreeNode, DirectoryTree } = Tree;
export default class ADeltaLakeTree extends DeltaLakeTree {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop        
    }
    tableClick = (evt) => {
        this.setState({
            rightClickNodeTreeItem: {
                pageX: evt.event.pageX,
                pageY: evt.event.pageY,
                table: evt.node.props['table'],
                db: evt.node.props['db']
            }
        })
    }
    show() {
        return Object.entries(this.state.dbs).map(([key, value]) => {
            return <TreeNode title={key} key={key}>
                {value.map(item => {
                    return <TreeNode title={item} table={item} db={key} key={item} isLeaf />
                })}
            </TreeNode>
        })
    }

    contextMenu() {
        if (!this.state.rightClickNodeTreeItem) {
            return <div></div>
        }
        const menu = <Menu style={{border:"solid"}}>
            <Menu.Item key='1'><Icon type='plus-circle' />"Open new session with this table"</Menu.Item>
            <Menu.Item key='2'><Icon type='plus-circle-o' />{'加下级'}</Menu.Item>
            <Menu.Item key='4'><Icon type='edit' />{'修改'}</Menu.Item>
            <Menu.Item key='3'><Icon type='minus-circle-o' />{'删除目录'}</Menu.Item>
        </Menu>
        const {pageX,pageY,db,table} = this.state.rightClickNodeTreeItem
        const tmpStyle = {
            position:"absolute", 
           left: `${pageX+30}px`,
           top: `${pageY-95}px`,
           backgroundColor: "yellow"
        }
        return <div style={tmpStyle}>{menu}</div>
    }    
    cancelConctextMenu=()=>{
        this.setState({rightClickNodeTreeItem:undefined})  
    }

    toggleNewSession = ()=>{
      this.setState({showNewSession:!this.state.showNewSession})
    }
    showNewSession = (evt)=>{
      const currentTable = {table: evt.node.props['table'],db: evt.node.props['db']}
      this.setState({showNewSession:true,currentTable})
    }

    currentTableName = ()=>{
        if(!this.state.currentTable){
            return ""
        }
      return this.state.currentTable.db + "." + this.state.currentTable.table
    }

    showTable = async ()=>{
        this.setState({showNewSession:false})        
        const {db,table} = this.state.currentTable
        this.workshop.newSession("delta",db,table)        
    }

    render() {

        return (

            <div>
                 <Modal  
                    title={`Open new session with [${this.currentTableName()}]?`}
                    visible={this.state.showNewSession}
                    onCancel={this.toggleNewSession}
                    onOk={this.showTable}
                    cancelText="Cancel"                     
                    OkText="Ok">                    
                   wowowowowow
                 </Modal>
                {this.contextMenu()}
                <Spin tip="Loading..." spinning={this.state.loading}>
                    <DirectoryTree onRightClick={this.showNewSession}>
                        {this.show()}
                    </DirectoryTree>
                </Spin>
            </div>


        )
    }
}