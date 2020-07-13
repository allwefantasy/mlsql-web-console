import * as React from "react";
import { Tree, Spin, Menu, Modal } from 'antd';
import DeltaLakeTree from "../detla_lake/DeltaLakeTree";
import mix from "../../common/mixin"
import { NewSessionOp } from "./NewSessionOp";
const { TreeNode, DirectoryTree } = Tree;
export default class ADeltaLakeTree extends mix(DeltaLakeTree).with(NewSessionOp) {
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

    render() {

        return (
            <div>
                 <Modal  
                    title={`Open new session with [${this.currentTableName()}]?`}
                    visible={this.state.showNewSession}
                    onCancel={this.toggleNewSession}
                    onOk={()=>{this.showTable("delta")}}
                    cancelText="Cancel"                     
                    OkText="Ok">                    
                   wowowowowow
                 </Modal>                
                <Spin tip="Loading..." spinning={this.state.loading}>
                    <DirectoryTree onRightClick={this.showNewSession}>
                        {this.show()}
                    </DirectoryTree>
                </Spin>
            </div>


        )
    }
}