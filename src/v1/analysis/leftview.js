import * as React from "react";
import { Tabs } from 'antd';
import { ScriptNodeTree } from "../../components/MLSQLTreeNode";
import DeltaLakeTree from "../detla_lake/DeltaLakeTree";
import FileSystemTree from "../file_system/FileSystemTree";
import ADeltaLakeTree from "./ADeltaLakeTree";
import WorkshopTableTree from "./WorkshopTableTree";
const { TabPane } = Tabs;
export default class LeftView extends React.Component {
    constructor(props){
        super(props)
        this.workshop = props.parent        
    }
    render(){
       return <Tabs defaultActiveKey="1"  onTabClick={(key)=>{
        if(key==="2"){                            
            if(this.deltaLakeTreeRef){
                this.deltaLakeTreeRef.reload()
            }
        }                        
    }}>
       <TabPane tab="Table Workshop" key="1">
       <div className="mlsql-directory-tree" >           
           <WorkshopTableTree ref={(et)=> this.workshopTableTreeRef = et} parent={this}></WorkshopTableTree>
       </div>
       </TabPane>

       <TabPane tab="DeltaLake" key="2">
       <div className="mlsql-directory-tree" >           
           <ADeltaLakeTree ref={(et)=> this.deltaLakeTreeRef = et} parent={this}></ADeltaLakeTree>
       </div>
       </TabPane>
       <TabPane tab="FileSystem" key="3">
       <div className="mlsql-directory-tree">
           <FileSystemTree ref={(et)=> this.fileSystemTreeRef = et} parent={this}></FileSystemTree>
       </div>
       </TabPane> 
                       
     </Tabs>
    }
}