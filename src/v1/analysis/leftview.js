import * as React from "react";
import { Tabs } from 'antd';
import { ScriptNodeTree } from "../../components/MLSQLTreeNode";
import DeltaLakeTree from "../detla_lake/DeltaLakeTree";
import FileSystemTree from "../file_system/FileSystemTree";
import ADeltaLakeTree from "./ADeltaLakeTree";
const { TabPane } = Tabs;
export default class LeftView extends React.Component {
    constructor(props){
        super(props)
        this.workshop = props.parent        
    }
    render(){
       return <Tabs defaultActiveKey="1" style={{maxWidth:"350px"}} onTabClick={(key)=>{
        if(key==="2"){                            
            if(this.deltaLakeTreeRef){
                this.deltaLakeTreeRef.reload()
            }
        }                        
    }}>
       <TabPane tab="DeltaLake" key="1">
       <div className="mlsql-directory-tree">           
           <ADeltaLakeTree ref={(et)=> this.deltaLakeTreeRef = et} ></ADeltaLakeTree>
       </div>
       </TabPane>
       <TabPane tab="FileSystem" key="2">
       <div className="mlsql-directory-tree">
           <FileSystemTree ref={(et)=> this.fileSystemTreeRef = et}></FileSystemTree>
       </div>
       </TabPane>                 
     </Tabs>
    }
}