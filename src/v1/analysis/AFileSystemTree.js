import * as React from "react";
import { Form, Spin, Input, Modal,Tree } from 'antd';
import FileSystemTree from "../file_system/FileSystemTree";
import mix from "../../common/mixin"
import { NewSessionOp } from "./NewSessionOp";
import { ETPopLoad } from "../../components/et/ETPopLoad";
const { TreeNode, DirectoryTree } = Tree;

export default class AFileSystemTree extends mix(FileSystemTree).with(NewSessionOp) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop        
    }
    
    showNewSession = (evt)=>{
        const currentTable = {table: evt.node.props.dataRef['path'],db: ""}
        this.setState({showNewSession:true,currentTable})
    }

    showTable = async (prefix,tp,options)=>{
        this.setState({showNewSession:false})        
        const {db,table} = this.state.currentTable
        this.workshop.newSession(prefix,tp,table,options)        
    }

    render = () => {
        return <div>
            <Modal
                title={`Open new session with [${this.currentTableName()}]?`}
                visible={this.state.showNewSession}
                onCancel={this.toggleNewSession}
                onOk={() => { this.showTable("file",this.loadPopRef.data.sourceTypeV,this.loadPopRef.data.params) }}
                cancelText="Cancel"
                OkText="Ok">
                    <ETPopLoad key={this.currentTableName()} ignorePath={true} ignoreTableName={true} ref={et=>this.loadPopRef=et}  parent={this}></ETPopLoad>
                 </Modal>
            <Spin tip="Loading..." spinning={this.state.loading}>
                <DirectoryTree loadData={this.onLoadData} onRightClick={this.showNewSession}>
                    {this.renderTreeNodes(this.state.root)}
                </DirectoryTree>
            </Spin>
        </div>
    }
}