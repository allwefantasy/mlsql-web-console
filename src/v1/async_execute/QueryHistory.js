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
      this.queryApp = props.parent.queryApp
      this.client = new ActionProxy()
      this.state = {showDetail:false}
      

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
          const domTree = evt.target.parentNode.parentNode      
          // const jobName = domTree.children[1].innerText
          const num = [].slice.call(domTree.children).indexOf(currentTH)
          let field = ""
          switch (num){
            case 2: field= "content";break;
            case 4: field= "reason";break;
            case 7: field= "response";break;
          }          
          await this.showDetail(record.name,field)
          
        }} ><span style={{whiteSpace:"normal",wordWrap:"break-word",width:"100px"}}>{value}</span></Button>
      }
      
      let statusRender = (value)=>{
        let t = ""
        let cssStyle = {}
        switch (value) {
          case "fail": t = "danger"; break;
          case "success": t = "primary"; cssStyle ={backgroundColor:"green"}; break;
          case "running": t = "primary"; cssStyle ="";break;
        }
        
        return <Button type={t} style={cssStyle}>{value}</Button>
      }

      let killJobRender = (value)=>{  
        if(!value)  return <div></div>
        return <Button onClick={async (evt)=>{           
           const res = await EngineService.killJob(value)
           this.reload()
         }}>Kill</Button>
      }

      let showTableRender = (value,record)=>{
        return <Button type="link" onClick={async (evt)=>{               
          await this.showResponse(record.name)
        }}>{value}</Button>      
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
        detailContent:res.content[field],
        showDetail: true
      })
      
      if(this.detailConsole){            
        const op = new EditorOp(this.detailConsole)
        op.setText(res.content[field])
      }      
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
                    OkText="Ok">                    
         <AceEditor ref={(et)=>this.detailConsole=et}
                        height={"300px"}
                        width={"100%"}                        
                        mode="text"
                        theme="github"
                        name="detail_box"
        ></AceEditor>
        </Modal> 
        <Modal  
                    title={"View"}
                    visible={this.state.showResponse}
                    onCancel={this.toggleResponse}
                    onOk={this.toggleResponse}
                    cancelText="Cancel"
                    OkText="Ok">                    
        <MLSQLQueryDisplay ref={(_display)=>{this.respDisplay = _display}} parent={this}/>
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