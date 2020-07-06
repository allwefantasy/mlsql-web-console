import { ActionProxy } from '../../backend_service/ActionProxy';
import RemoteAction from '../../backend_service/RemoteAction';

const uuidv4 = require('uuid/v4');
const client = new ActionProxy()
export default class EngineService {
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

    static async jobProgress(jobName){
        const res = await client.runScript(`load _mlsql_.\`jobs/get/${jobName}\` as wow;`,uuidv4(),{"queryType":"robot"})
        if(res.status===200){
            const jsonObj = res.content[0]
            const currentJobIndex = jsonObj.progress.currentJobIndex
            const totalJobs = jsonObj.progress.totalJob
            return {currentJobIndex,totalJobs}
        }
        return {currentJobIndex:0,totalJobs:0}
    }
}