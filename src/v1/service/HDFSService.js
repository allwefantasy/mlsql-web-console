export default class HDFSService {
    static async ls(path){ 
        const client = new ActionProxy()
        const res = await client.runScript(`!hdfs -ls -F ${path};"`, uuidv4(), {"queryType":"robot"})
        return res.content        
    }
}