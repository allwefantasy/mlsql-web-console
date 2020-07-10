import { ActionProxy } from '../../backend_service/ActionProxy';
import RemoteAction from '../../backend_service/RemoteAction';

const uuidv4 = require('uuid/v4');
const client = new ActionProxy()
export default class EngineService {

    static async ls(path){ 
        const client = new ActionProxy()
        const res = await client.runScript(`!hdfs -ls -F ${path};`, uuidv4(), {"queryType":"robot"})
        return res        
    }

    static async killJob(jobName){  
        const res = await client.runScript("!kill " + jobName+";", uuidv4(), {"queryType":"robot"})
        //sync the status        
        await client.get(RemoteAction.JOB_KILL, {jobName:jobName})                        
        return res
    }

    static async runJob(sql,block=false){        
        const res = await client.runScript(sql, uuidv4(),{ "async": block}) 
        return res
    }

    static async showFunctions(){        
        const res = await client.runScript("",uuidv4(),{executeMode:"sqlFunctions"})
        return res
    }

    static async jobs(){
        const jobName = uuidv4()
        const res = await client.runScript(`load _mlsql_.\`jobs\` as wow;`,jobName ,{"queryType":"robot"}) 
        return {jobName,res} 
    }

    static async tablesInDeltaLake(){
        const jobName = uuidv4()
        const res = await client.runScript(`!delta show tables;`,jobName ,{"queryType":"robot"}) 
        return res
    }

    static async tablesInWorkshop(){        
        const res = await client.get(RemoteAction.ANALYSIS_TABLES ,{}) 
        return res
    }

    static async jobProgress(jobName){
        const res = await client.runScript(`load _mlsql_.\`jobs/get/${jobName}\` as wow;`,uuidv4(),{"queryType":"robot"})
        const empty_res =  {currentJobIndex:0,totalJobs:1}
        if(res.status===200){
            const jsonObj = res.content[0]
            if(!jsonObj){
                return empty_res
            }
            let currentJobIndex = jsonObj.progress.currentJobIndex
            let totalJobs = jsonObj.progress.totalJob
            if(totalJobs===1){
                const res2 = await client.runScript(`load _mlsql_.\`jobs/${jobName}\` as wow;`,uuidv4(),{"queryType":"robot"})                                
                currentJobIndex = res2.content[0].completedJobsNum
                totalJobs = res2.content[0].activeJobsNum + currentJobIndex               
            }
            return {currentJobIndex,totalJobs}
        }
        return empty_res
    }

    static async resourceInfo(){
        const res = await client.runScript(`load _mlsql_.\`resource\` as output;`,uuidv4(),{"queryType":"robot"})
        const totalCores = res.content[0].totalCores
        const activeTasks = res.content[0].activeTasks
        return {activeTasks,totalCores}
    }
}