import { ActionProxy } from "../../backend_service/ActionProxy"
import RemoteAction from "../../backend_service/RemoteAction"
import EngineService from "../service/EngineService";
const uuidv4 = require('uuid/v4');

export default class AsyncExecuter {
    constructor(queryPanel){
      this.queryPanel = queryPanel
      this.client = new ActionProxy()
      this.jobName = uuidv4()
      this.editorOp = this.queryPanel.getEditorOp()
      this.consoleOp = this.queryPanel.getConsoleOp()
      const selectSQL = this.editorOp.getSelection()
      this.sql = selectSQL || this.editorOp.getText() 

      this.commandGroupRef = this.queryPanel.commandGroup.current
      //this.resourceProgressRef = this.queryPanel.resourceProgressRef
      this.jobProgressRef = this.queryPanel.jobProgressRef
      this.taskProgressRef = this.queryPanel.taskProgressRef.current
      
      this.displayRef = this.queryPanel.queryApp.display.current
      this.dashRef = this.queryPanel.queryApp.dash.current


      this.timeout = this.commandGroupRef.state.timeout
      this.logInfo = {}

      this.closed = false
    

      
    }

    log(msg){
        this.consoleOp.append(msg)
        return this
    }

    enterLoading = () => {
        this.commandGroupRef.setState({loading: true});
        //this.resourceProgressRef.enter({jobName: this.jobName})        
        //this.taskProgressRef.enter({jobName: this.jobName})        
    }

    exitLoading = () => {
        this.commandGroupRef.setState({loading: false});
        // this.jobProgressRef.exit()
        //this.resourceProgressRef.exit()
        //this.taskProgressRef.exit()        
    }

    prepare(){
        this.enterLoading()
        this.consoleOp.setText("")
        this.displayRef.update(JSON.parse("[]"))
    }
    measureTime(startTime) {
        this.exitLoading()
        const endTime = new Date().getTime()
        return endTime - startTime
    }



    async saveFile(params){
      const scriptId = this.queryPanel.state.scriptId
      if(!scriptId){
         this.log("No file are opened, cannot execute save action")
         return
      }
      const res = await this.client.post(RemoteAction.SAVE_SCRIPT_FILE,{
        id: scriptId,
        content: this.editorOp.getText()
      })
      if(res.status !== 200){
          this.log(res.content)
      }
      if(res.status === 200){
          this.log(`File[${scriptId}] have been saved.`)
      }
      return res

    }

    async run(params) {
        this.prepare()
        const startTime = new Date().getTime()
        const res = await this.client.runScript(this.sql, this.jobName, Object.assign(params,{
            jobName: this.jobName,
            async: true,
            timeout: this.timeout
        }))    
        
        if(res.status !== 200){                                    
            this.log("Fail to submit job" + "\nTime cost:" + this.measureTime(startTime) + "ms")            
            return []
        }

        this.intervalTimer = setInterval(async () => {            
            await this.monitorJob()
            await this.monitorLog()
        }, 1000)

        //refresh job list in dash
        if(this.dashRef.queryHistory){
            this.dashRef.queryHistory.reload()  
        }
        this.jobProgressRef.enter()
        return res
    }
    async cancelMonitor() {
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
        }
    }

    async monitorJob(){        
        const res = await this.client.get(RemoteAction.JOB_DETAIL,
            {
                jobName:this.jobName,                
            })
        const jobInfo = res.content
        // job fail
        if(jobInfo.status === 3){
           this.closed = true
           this.cancelMonitor() 
           this.exitLoading() 
           this.jobProgressRef.exit()
           this.log(jobInfo.reason)
        }
        // job success
        if(jobInfo.status === 2){
            this.closed = true
            this.cancelMonitor()
            this.exitLoading() 
            this.jobProgressRef.exit()
            this.displayRef.update(JSON.parse(jobInfo.response)) 
        }
    }

    async monitorLog(){
        const jobName = uuidv4()               
        const res = await this.client.runScript(`load _mlsql_.\`log/${this.logInfo['offset'] || -1}\` where filePath="engine_log" as output;`, jobName, {"queryType":"robot"})
        const jsonObj = res.content[0]
        if (jsonObj["value"] && jsonObj['value'].length > 0) {
            this.log(jsonObj['value'].map(item => {
                return item.split("__MMMMMM__")[1]
            }).join("\n"))
        }
        this.logInfo['offset'] = jsonObj["offset"]
    }

    

    async killJob(){
        if (!this.jobName) return
        const res = await EngineService.killJob(this.jobName)
        try {
            this.log(res.content[0]['description'])                
        }catch(e){
            this.log(res.content)
        }
        this.closed = true
        this.jobName = null
        this.cancelMonitor() 
        this.exitLoading()
        
    }
}