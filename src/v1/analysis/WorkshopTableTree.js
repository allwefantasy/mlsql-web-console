
import * as React from "react";
import { Tree, Spin, Menu, Icon, Modal } from 'antd';
import EngineService from "../service/EngineService";
const { TreeNode, DirectoryTree } = Tree;
export default class WorkshopTableTree extends React.Component {
    constructor(props) {
        super(props)
        this.state={dbs:{},loading:false} 
        
    }

    async reload(){
      this.setState({loading:true})
      const res = await EngineService.tablesInWorkshop()
      if(res.status===200){
           const dbs = {}
           res.content.forEach(item => {
              if(!dbs[item.sessionId]){
                dbs[item.sessionId] = [item.tableName] 
              }else {
                dbs[item.sessionId].push(item.tableName)  
              }
           })
           this.setState({dbs})
       }
       this.setState({loading:false})
    }

    show(){    
        return Object.entries(this.state.dbs).map(([key,value])=>{                   
            return <TreeNode title={key} key={key}>
               {value.map(item=>{                   
                   return <TreeNode title={item} key={item} isLeaf />
               })} 
            </TreeNode>
        })
    }

    async componentDidMount(){
       await this.reload()
    }
    
    render(){
      return (
        <Spin tip="Loading..." spinning={this.state.loading}>
        <DirectoryTree  >
        {this.show()}
        </DirectoryTree>
     </Spin>
        
        
      )
    }
}