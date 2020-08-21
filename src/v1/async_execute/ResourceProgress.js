import * as React from "react";
import { Progress,Button } from "antd";
import EngineService from "../service/EngineService";
import "./ResourceProgress.scss"
export default class ResourceProgress extends React.Component {
    constructor(props) {
        super(props) 
        this.queryPanel = props.parent               
        this.state ={percent:0}        
    }

    async componentDidMount(){
      await this.reload()
    }

    async reload(){
       const {activeTasks,totalCores} = await EngineService.resourceInfo() 
       const {jobName,res}  = await EngineService.jobs() 
       const jobNum = res.content.filter((item)=>{
           return item.jobName !== jobName 
       }).length     
       this.setState({percent:activeTasks/totalCores*100,
        totalCores,activeTasks,jobNum})
    }

    enter = (params) => {
       
    }

    exit = () => {        
       
    }

    render() {
        return <div className="rp-main">
            
            <div className="rp-block">
            <div className="rp-name" >CPU Usage(total cores:{this.state.totalCores}): </div>
             <Progress percent={this.state.percent}   style={{maxWidth:"300px"}}/>                           
            </div> 

            <div className="rp-block">
            <div className="rp-name">Jobs Running: <span>{this.state.jobNum}</span></div>
                
            </div>            
        </div>
    }
}