import * as React from "react";
import { Tabs } from 'antd';
import { ScriptNodeTree } from "../../components/MLSQLTreeNode";
import DeltaLakeTree from "../detla_lake/DeltaLakeTree";
import FileSystemTree from "../file_system/FileSystemTree";
const { TabPane } = Tabs;
export default class LeftTreePane extends React.Component {
    constructor(props){
        super(props)
        this.queryApp = props.parent
    }
    render(){
       return <Tabs defaultActiveKey="1" style={{maxWidth:"350px"}} onTabClick={(key)=>{
        if(key==="2"){                            
            if(this.deltaLakeTreeRef){
                this.deltaLakeTreeRef.reload()
            }
        }                        
    }}>
       <TabPane tab="Script" key="1">
       <div className="mlsql-directory-tree">
           <ScriptNodeTree ref={(et)=> this.scriptTreeRef = et} parent={this.queryApp}/>
       </div>
       </TabPane>
       <TabPane tab="DateLake" key="2">
       <div className="mlsql-directory-tree">
           <DeltaLakeTree ref={(et)=> this.deltaLakeTreeRef = et} ></DeltaLakeTree>
       </div>
       </TabPane>
       <TabPane tab="FileSystem" key="3">
       <div className="mlsql-directory-tree">
           <FileSystemTree ref={(et)=> this.fileSystemTreeRef = et}></FileSystemTree>
       </div>
       </TabPane> 
         
     </Tabs>
    }
}