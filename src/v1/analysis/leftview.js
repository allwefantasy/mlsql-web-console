import * as React from "react";
import { Tabs } from 'antd';
import AFileSystemTree from "./AFileSystemTree";
import ADeltaLakeTree from "./ADeltaLakeTree";
import WorkshopTableTree from "./WorkshopTableTree";
import "./leftview.scss"
import {FormattedMessage} from 'react-intl'

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
       <TabPane tab={<FormattedMessage id="table_workshop" />} key="1">
       <div className="leftview-box" >           
           <WorkshopTableTree ref={(et)=> this.workshopTableTreeRef = et} parent={this}></WorkshopTableTree>
       </div>
       </TabPane>

       <TabPane tab={<FormattedMessage id="delta_lake" />} key="2">
       <div className="leftview-box" >           
           <ADeltaLakeTree ref={(et)=> this.deltaLakeTreeRef = et} parent={this}></ADeltaLakeTree>
       </div>
       </TabPane>
       <TabPane tab={<FormattedMessage id="file_system"/>} key="3">
       <div className="leftview-box">
           <AFileSystemTree ref={(et)=> this.fileSystemTreeRef = et} parent={this}></AFileSystemTree>
       </div>
       </TabPane> 
                       
     </Tabs>
    }
}