
import * as React from "react";
import { Tree, Spin, Menu, Icon, Modal } from 'antd';
import EngineService from "../service/EngineService";
import { NewSessionOp } from "./NewSessionOp";
import mix from "../../common/mixin"
const { TreeNode, DirectoryTree } = Tree;

export default class WorkshopTableTree extends mix(React.Component).with(NewSessionOp) {
  constructor(props) {
    super(props)
    this.state = { dbs: {}, loading: false }
    this.workshop = props.parent.workshop  

  }

  async reload() {
    this.setState({ loading: true })
    const res = await EngineService.tablesInWorkshop()
    if (res.status === 200) {
      const dbs = {}
      res.content.forEach(item => {
        if (!dbs[item.sessionId]) {
          dbs[item.sessionId] = [item.tableName]
        } else {
          dbs[item.sessionId].push(item.tableName)
        }
      })
      this.setState({ dbs })
    }
    this.setState({ loading: false })
  }

  show() {
    return Object.entries(this.state.dbs).map(([key, value]) => {
      return <TreeNode title={key} key={key}>
        {value.map(item => {
          return <TreeNode table={value} db={key} title={item} key={item} isLeaf />
        })}
      </TreeNode>
    })
  }

  async componentDidMount() {
    await this.reload()
  }

  

  render() {
    return (
      <div>
        <Modal
          title={`Open new session with [${this.currentTableName()}]?`}
          visible={this.state.showNewSession}
          onCancel={this.toggleNewSession}
          onOk={()=>{this.showTable("temp")}}
          cancelText="Cancel"
          OkText="Ok">
          wowowowowow
                 </Modal>
        <Spin tip="Loading..." spinning={this.state.loading}>
          <DirectoryTree  onRightClick={this.showNewSession}>
            {this.show()}
          </DirectoryTree>
        </Spin>
      </div>


    )
  }
}