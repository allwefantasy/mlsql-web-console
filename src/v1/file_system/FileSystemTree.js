import * as React from "react";
import { Tree ,Spin} from 'antd';
import EngineService from "../service/EngineService";

const { TreeNode, DirectoryTree } = Tree;
export default class FileSystemTree extends React.Component{
    constructor(props) {
        super(props)
        this.state={root:[],loading:false} 
        
    }

    getFileList = async(path)=> {
      const res = await EngineService.ls(path)        
      if(res.status===200 && !res.content[0]._corrupt_record){           
           const root = res.content.map(item => {               
               item["is_dir"] = this.isDir(item)
               item["key"] = item.path
               item["title"] = item.path.split("/").slice(-1)[0]
               item["isLeaf"] = !item.is_dir
               return item
           })
           return root
       }
       return []
    }
    
    isDir=(item)=>{
      return item.permission.startsWith("d")
    }
    
     onLoadData = async (treeNode)=> {
      treeNode.props.dataRef.children = await this.getFileList(treeNode.props.dataRef.path)
      this.setState({root:[...this.state.root]})
    }

    renderTreeNodes = data =>{
      return data.map(item=>{
        if(item.children){
          return <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf}  dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        }
        return <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf} dataRef={item} />;
      })
    }

    async reload(){      
       this.setState({loading:true})
       const root = await this.getFileList("/")
       this.setState({loading:false,root})
    }

    async componentDidMount(){
       await this.reload()
    }
    
    render(){
      return (
        <div>
          <Spin tip="Loading..." spinning={this.state.loading}>
         <DirectoryTree loadData={this.onLoadData} >
            {this.renderTreeNodes(this.state.root)}
        </DirectoryTree>
        </Spin>
        </div>
        
        
      )
    }
} 