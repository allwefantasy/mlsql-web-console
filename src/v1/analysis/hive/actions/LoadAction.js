import ActionMaker from "../../../ActionMaker"
import { ActionProxy } from "../../../../backend_service/ActionProxy"
import Tools from "../../../../common/Tools"

export const { handler: LoadActionHandler, action: LoadAction } = ActionMaker.buildHandler(async (action) => {
    const {dbName,node} = action.data
    const proxy = new ActionProxy()
    if(!dbName){        
        const res = await proxy.runScript(`!profiler sql "show databases";`,Tools.getJobName(),Tools.robotFetchParam())    
        //  const res = {status:200,content:{ "schema":{"type":"struct","fields":[{"name":"databaseName","type":"string","nullable":false,"metadata":{}}]},"data": [{"databaseName":"adl"},{"databaseName":"adl_db_algo1"},{"databaseName":"adl_db_bbs"},{"databaseName":"adl_db_biomart"},{"databaseName":"adl_db_chd"},{"databaseName":"adl_db_datateam"},{"databaseName":"adl_db_jobmd"},{"databaseName":"adl_db_openclass"},{"databaseName":"adl_db_search"},{"databaseName":"bdl"},{"databaseName":"bdl_db_bbs"},{"databaseName":"bdl_db_biomart"},{"databaseName":"bdl_db_chd"},{"databaseName":"bdl_db_datateam"},{"databaseName":"bdl_db_jobmd"},{"databaseName":"bdl_db_openclass"},{"databaseName":"bdl_db_tod"},{"databaseName":"bdl_db_yyh"},{"databaseName":"default"},{"databaseName":"dim"},{"databaseName":"kylin"},{"databaseName":"log"},{"databaseName":"log_db_ask"},{"databaseName":"log_db_bbs"},{"databaseName":"log_db_biomart"},{"databaseName":"log_db_chd"},{"databaseName":"log_db_common"},{"databaseName":"log_db_drugs"},{"databaseName":"log_db_ecd"},{"databaseName":"log_db_insight"},{"databaseName":"log_db_jobmd"},{"databaseName":"log_db_openclass"},{"databaseName":"log_db_other"},{"databaseName":"log_db_yyh"},{"databaseName":"log_dev"},{"databaseName":"odl"},{"databaseName":"odl_db_asms2"},{"databaseName":"odl_db_biz"},{"databaseName":"odl_db_ccrm"},{"databaseName":"odl_db_cems"},{"databaseName":"odl_db_chd"},{"databaseName":"odl_db_clinic"},{"databaseName":"odl_db_cms"},{"databaseName":"odl_db_crawler"},{"databaseName":"odl_db_crm"},{"databaseName":"odl_db_da_admin"},{"databaseName":"odl_db_data_label"},{"databaseName":"odl_db_datateam"},{"databaseName":"odl_db_di_product"},{"databaseName":"odl_db_dotcom"},{"databaseName":"odl_db_dxy_live"},{"databaseName":"odl_db_exam_prd"},{"databaseName":"odl_db_exam_user_prd"},{"databaseName":"odl_db_growingio"},{"databaseName":"odl_db_health_mgmt"},{"databaseName":"odl_db_industry"},{"databaseName":"odl_db_insight"},{"databaseName":"odl_db_jobmd"},{"databaseName":"odl_db_killmesh"},{"databaseName":"odl_db_mail_system"},{"databaseName":"odl_db_mall"},{"databaseName":"odl_db_masterdata"},{"databaseName":"odl_db_mcm"},{"databaseName":"odl_db_medical_brain"},{"databaseName":"odl_db_mesh"},{"databaseName":"odl_db_minisite_oa"},{"databaseName":"odl_db_mis"},{"databaseName":"odl_db_oc_activity"},{"databaseName":"odl_db_oc_course"},{"databaseName":"odl_db_oc_user"},{"databaseName":"odl_db_repository"},{"databaseName":"odl_db_rms"},{"databaseName":"odl_db_stat"},{"databaseName":"odl_db_stat_system"},{"databaseName":"odl_db_trademd"},{"databaseName":"odl_db_ycrm"},{"databaseName":"odl_snapshot"},{"databaseName":"original"},{"databaseName":"public"},{"databaseName":"recomm"},{"databaseName":"rpt"},{"databaseName":"sanbox"},{"databaseName":"sandbox"},{"databaseName":"temp"},{"databaseName":"temp_db_bbs"},{"databaseName":"temp_db_biomart"},{"databaseName":"temp_db_chd"},{"databaseName":"temp_db_jobmd"},{"databaseName":"temp_db_openclass"},{"databaseName":"temp_ztp"},{"databaseName":"tempdev"},{"databaseName":"tempskone"}]}}
        if (res.status === 200) {        
            const dbs  = res.content.data.map(item=>{                
                item["key"] = item.databaseName || item.namespace
                item["title"] = item.key
                item["isLeaf"] = false
                return item
            })
            return {
                data: {
                    dbs,...action.data
                }
            }
        }
    }

    if(dbName){
        await proxy.runScript(`!profiler sql "use ${dbName}";`,Tools.getJobName(),Tools.robotFetchParam())    
        const res = await proxy.runScript(`!profiler sql "show tables";`,Tools.getJobName(),Tools.robotFetchParam())            
        // const res = {status:200,content:[{database:dbName,tableName:"table1"},{database:dbName,tableName:"table2"}]}
        if (res.status === 200) {        
            const tables  = res.content.data.filter(item=>{
                const db = item.database || item.namespace
                return db === dbName
            }).map(item=>{
                item["key"] = `${dbName}.${item.tableName}`
                item["title"] = item.tableName
                item["isLeaf"] = true
                return item
            }) 
            node.dataRef.children =  tables
            return {
                data: {
                    tables,...action.data
                }
            }
        }
    }
    

    return {
        data: {...action.data}
    }
})