import * as React from "react";
import { Tabs } from 'antd';
import DeltaLakeTree from "../detla_lake/DeltaLakeTree";
import FileSystemTree from "../file_system/FileSystemTree";
import "../../v1/analysis/leftview.scss"
import { ScriptTree } from "../script_console/ScriptTree";
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
        // if(key==="3"){                            
        //     if(this.fileSystemTreeRef){
        //         this.fileSystemTreeRef.reload()
        //     }
        // }                        
        }}>
        <TabPane tab="Script" key="1">
       <div className="leftview-box">
           <ScriptTree consoleApp = {this.queryApp}></ScriptTree> 
       </div>
       </TabPane>       
       <TabPane tab="DeltaLake" key="2">
       <div className="leftview-box">
           <DeltaLakeTree ref={(et)=> this.deltaLakeTreeRef = et} ></DeltaLakeTree>
       </div>
       </TabPane>
       <TabPane tab="FileSystem" key="3">
       <div className="leftview-box">
           <FileSystemTree ref={(et)=> this.fileSystemTreeRef = et}></FileSystemTree>
       </div>
       </TabPane> 
         
     </Tabs>
    }
}