import * as React from "react";
import { Tabs } from 'antd';
import { ScriptNodeTree } from "../../components/MLSQLTreeNode";
const { TabPane } = Tabs;
export default class LeftTreePane extends React.Component {
    constructor(props){
        super(props)
        this.queryApp = props.parent
    }
    render(){
       return <Tabs defaultActiveKey="1" style={{maxWidth:"350px"}}>
       <TabPane tab="Script" key="1">
       <div className="mlsql-directory-tree">
           <ScriptNodeTree ref={(et)=> this.scriptTreeRef = et} parent={this.queryApp}/>
       </div>
       </TabPane>
       <TabPane tab="DateLake" key="2">
       <div className="mlsql-directory-tree">
           2
       </div>
       </TabPane>
       <TabPane tab="FileSystem" key="3">
       <div className="mlsql-directory-tree">
           3
       </div>
       </TabPane> 
         
     </Tabs>
    }
}