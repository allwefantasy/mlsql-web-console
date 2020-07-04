import { ActionProxy } from "../../backend_service/ActionProxy"
import RemoteAction from "../../backend_service/RemoteAction"
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
      this.resourceProgressRef = this.queryPanel.resourceProgressRef.current
      this.jobProgressRef = this.queryPanel.jobProgress.current
      this.taskProgressRef = this.queryPanel.taskProgressRef.current
      console.log(this.queryPanel.queryApp)
      this.displayRef = this.queryPanel.queryApp.display.current
      this.dashRef = this.queryPanel.queryApp.dash.current


      this.timeout = this.commandGroupRef.state.timeout
    

      
    }

    log(msg){
        this.consoleOp.append(msg)
        return this
    }

    enterLoading = () => {
        this.commandGroupRef.setState({loading: true});
        //this.resourceProgressRef.enter({jobName: this.jobName})
        //this.jobProgressRef.enter({jobName: this.jobName})
        //this.taskProgressRef.enter({jobName: this.jobName})        
    }

    exitLoading = () => {
        this.commandGroupRef.setState({loading: false});
        //this.jobProgressRef.exit()
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
    async run(params) {
        this.prepare()
        const startTime = new Date().getTime()
        console.log("Execute "+this.jobName+ "\n"+this.sql)
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
            const jobName = uuidv4()
            const res = await this.client.get(RemoteAction.JOB_DETAIL,{jobName:this.jobName})
            const jobInfo = res.content
            // job fail
            if(jobInfo.status === 3){
               this.cancelCheckJob() 
               this.exitLoading() 
               this.log(jobInfo.response)
            }
            // job success
            if(jobInfo.status === 2){
                this.cancelCheckJob()
                this.exitLoading() 
                this.displayRef.update(JSON.parse(jobInfo.response)) 
            }
        }, 2000)

        //refresh job list in dash
        if(this.dashRef.queryHistory){
            this.dashRef.queryHistory.reload()  
        }
        return res.content
    }
    async cancelCheckJob() {
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
        }
    }
}