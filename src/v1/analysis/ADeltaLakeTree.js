import * as React from "react";
import { Tree, Spin, Menu, Modal } from 'antd';
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