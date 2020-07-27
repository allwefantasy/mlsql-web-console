import * as React from "react";
import { Tree ,Spin} from 'antd';
import EngineService from "../service/EngineService";
import {TableOutlined} from '@ant-design/icons'

const { TreeNode, DirectoryTree } = Tree;
export default class DeltaLakeTree extends React.Component{
    constructor(props) {
        super(props)
        this.state={dbs:{},loading:false} 
        
    }

    async reload(){
      this.setState({loading:true})
      const res = await EngineService.tablesInDeltaLake()
      if(res.status===200){
           const dbs = {}
           res.content.forEach(item => {
              if(!dbs[item.database]){
                dbs[item.database] = [item.table] 
              }else {
                dbs[item.database].push(item.table)  
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
                   return <TreeNode icon={<TableOutlined />} title={item} key={`${key}.${item}`} isLeaf />
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