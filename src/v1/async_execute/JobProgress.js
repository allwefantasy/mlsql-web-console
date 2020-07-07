import * as React from "react";
import Timer from "react-compound-timer"
import {Progress, Button} from 'antd';
import EngineService from "../service/EngineService";

export default class JobProgress extends React.Component {
    constructor(props) {
        super(props) 
        this.queryPanel = props.parent               
        this.state ={loading:false,progress:0}        
    }

    enter = (params) => {
        this.setState({loading:true})  
        this.intervalTimer = setInterval(async () => {                        
            const jobName = this.queryPanel.executor.jobName
            const {currentJobIndex,totalJobs} =  await EngineService.jobProgress(jobName)            
            this.setState({progress:(currentJobIndex/totalJobs)*100})
        },1000)
    }

    exit = () => {        
        if(this.intervalTimer){            
            clearInterval(this.intervalTimer)
            this.intervalTimer = null 
            this.finalTime = (this.timer.getTime() / 1000).toFixed(2) + "s"
            this.setState({loading:false})          
        }
    }

    render() {
        if(!this.state.loading) {
            if(this.finalTime){
                return <Button type="primary" style={{margin:"0px 0px 20px 0px"}}>
                   Time Cost: {this.finalTime}
                </Button>
            }else {
                return <div></div>
            }
        }
        return <div>                    
            <Button type="primary" style={{marginRight:"20px"}}>
            Time Cost:<Timer ref={(et)=> this.timer =et}>        
                <Timer.Minutes formatValue={value => `${value} m. `} /> 
                <Timer.Seconds formatValue={value => `${value} s. `}/>         
            </Timer></Button>
            <Progress type="circle" percent={this.state.progress} />
        </div>
    }
}