import { ActionProxy } from '../../backend_service/ActionProxy';

const uuidv4 = require('uuid/v4');
export default class EngineService {
    static async killJob(jobName){  
        const client = new ActionProxy()
        const res = await client.runScript("!kill " + jobName+";", uuidv4(), {"queryType":"robot"})                        
        return res
    }
}