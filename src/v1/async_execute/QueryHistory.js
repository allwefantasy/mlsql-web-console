import React from 'react';
import { ActionProxy } from "../../backend_service/ActionProxy"
import RemoteAction from '../../backend_service/RemoteAction';
import { MLSQLQueryDisplay } from '../../components/MLSQLQueryDisplay';
import { Button, Modal } from 'antd';
import EditorOp from '../comp_op/EditorOp'
import AceEditor from 'react-ace';
import EngineService from '../service/EngineService';

export default class QueryHistory extends React.Component {
    constructor(props){
      super(props)
      // here the queryApp is actually MLSQLACEEditor
      this.queryApp = props.parent.queryApp      
      this.client = new ActionProxy()
      this.state = {showDetail:false,executeAgainStatus:{}}
      

      let defaultRender =  (value,record)=>{
        return <Button type="link" onClick={async (evt)=>{
          // target button
          // parentNode th
          // parentNode tr
          // the second th is jobName
          // <tr><th>...</th></tr>
          const currentTH = evt.target.parentNode
          // another way get row index and column index
          // console.log(`${currentTH.parentElement.rowIndex}:${currentTH.cellIndex} `)
          // const domTree = evt.target.parentNode.parentNode      
          // const jobName = domTree.children[1].innerText
          // const num = [].slice.call(domTree.children).indexOf(currentTH)
          const num = currentTH.parentNode.cellIndex
          let field = ""
          switch (num){
            case 2: field= "content";break;
            case 4: field= "reason";break;
            case 7: field= "response";break;
          } 
          console.log(num)         
          await this.showDetail(record.name,field)
          
        }} ><span style={{whiteSpace:"normal",wordWrap:"break-word",width:"100px"}}>{value}</span></Button>
      }
      
      let statusRender = (value)=>{
        let t = ""
        let cssStyle = {}
        switch (value) {
          case "fail": t = "danger"; break;
          case "killed": t = "danger"; break;
          case "success": t = "primary"; cssStyle ={backgroundColor:"green"}; break;
          case "running": t = "primary";break;
        }
        
        return <Button type={t} style={cssStyle}>{value}</Button>
      }

      let killJobRender = (value,record)=>{  
        const jobName = record.name
        if(record.status!=="running"){
            return <Button type="primary" key={jobName} loading={this.state.executeAgainStatus[jobName]} onClick={async (evt)=>{  
               this.state.executeAgainStatus[jobName] = true 
               this.setState(this.state.executeAgainStatus)
               await EngineService.runJob(record.content)
               this.reload()
            }}>Execute again</Button>
        }
        return <Button key={jobName} onClick={async (evt)=>{           
           const res = await EngineService.killJob(jobName)
           this.reload()
         }}>Kill</Button>
      }

      let showTableRender = (value,record)=>{
        return <Button type="link" onClick={async (evt)=>{               
          await this.showResponse(record.name)
        }}><span style={{whiteSpace:"normal",wordWrap:"break-word",width:"100px"}}>{value}</span></Button>      
      }

      this.renderConfig = {
        render:{
          content: defaultRender,
          response: showTableRender,
          reason: defaultRender,
          status: statusRender,
          "__command__": killJobRender
        }
      }      
    }

    async reload(){
      this.setState({executeAgainStatus:{}})
      const res = await this.client.get(RemoteAction.JOB_LIST,{}) 
      if(res.status == 200){
        if(this.display){
            this.display.update(
              this.processData(res.content),
              this.renderConfig)
        }  
      }
    }

    processData(data){
       return data.map(item=>{
         const jobName = item["status"]==="running" ? item["jobName"] : ""
         return Object.assign(item,{"__command__":jobName})
       })
    }

    async showDetail(jobName,field){  
      const res = await this.client.get(RemoteAction.JOB_DETAIL,{jobName:jobName})      
      this.setState({        
        showDetail: true,
        detailConsoleMessage:res.content[field] 
      })           
    }

    async showResponse(jobName){  
      const res = await this.client.get(RemoteAction.JOB_DETAIL,{jobName:jobName})
      this.setState({        
        showResponse: true
      })            
      if(this.respDisplay){                         
        this.respDisplay.update(JSON.parse(res.content.response))
      }      
    }

    toggleDetail = ()=>{      
      this.setState({showDetail:!this.state.showDetail})
    }
    toggleResponse = ()=>{      
      this.setState({showResponse:!this.state.showResponse})
    }

   async componentDidMount(){
       await this.reload()
    }

    render(){
      return <div className="mlsql-query-display"> 
        <Modal  
                    title={"View"}
                    visible={this.state.showDetail}
                    onCancel={this.toggleDetail}
                    onOk={this.toggleDetail}
                    cancelText="Cancel" 
                    width="70%"                   
                    OkText="Ok">                    
         <AceEditor height={"300px"}
                        width={"100%"}                        
                        mode="text"
                        theme="github"
                        name="detail_box"
                        value={this.state.detailConsoleMessage||""}
        ></AceEditor>
        </Modal> 
        <Modal  
                    title={"View"}
                    visible={this.state.showResponse}
                    onCancel={this.toggleResponse}
                    onOk={this.toggleResponse}
                    cancelText="Cancel" 
                    width="70%"
                    OkText="Ok">                    
        <MLSQLQueryDisplay style={{overflow:"scroll"}} ref={(_display)=>{this.respDisplay = _display}} parent={this}/>
        </Modal> 
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={()=>{this.reload()}}>
            Reload
          </Button>          
        </div>     
        <MLSQLQueryDisplay ref={(_display)=>{this.display = _display}} parent={this}/>
      </div>
    }
}