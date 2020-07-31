import * as React from "react";
import ActionMaker from "../../../ActionMaker"
import { ActionProxy } from "../../../../backend_service/ActionProxy"
import Tools from "../../../../common/Tools"
import { TableOutlined } from '@ant-design/icons'

export const { handler: LoadActionHandler, action: LoadAction } = ActionMaker.buildHandler(async (action) => {
    const {dbName,node} = action.data
    const proxy = new ActionProxy()
    if(!dbName){        
        let res = await proxy.runScript(`!profiler sql "show databases";`,Tools.getJobName(),Tools.robotFetchParam())              
        res = {status:200,content:{ "schema":{"type":"struct","fields":[{"name":"databaseName","type":"string","nullable":false,"metadata":{}}]},"data": [{"databaseName":"adl"},{"databaseName":"adl_db_algo1"},{"databaseName":"adl_db_bbs"},{"databaseName":"adl_db_biomart"},{"databaseName":"adl_db_chd"},{"databaseName":"adl_db_datateam"},{"databaseName":"adl_db_jobmd"},{"databaseName":"adl_db_openclass"},{"databaseName":"adl_db_search"},{"databaseName":"bdl"},{"databaseName":"bdl_db_bbs"},{"databaseName":"bdl_db_biomart"},{"databaseName":"bdl_db_chd"},{"databaseName":"bdl_db_datateam"},{"databaseName":"bdl_db_jobmd"},{"databaseName":"bdl_db_openclass"},{"databaseName":"bdl_db_tod"},{"databaseName":"bdl_db_yyh"},{"databaseName":"default"},{"databaseName":"dim"},{"databaseName":"kylin"},{"databaseName":"log"},{"databaseName":"log_db_ask"},{"databaseName":"log_db_bbs"},{"databaseName":"log_db_biomart"},{"databaseName":"log_db_chd"},{"databaseName":"log_db_common"},{"databaseName":"log_db_drugs"},{"databaseName":"log_db_ecd"},{"databaseName":"log_db_insight"},{"databaseName":"log_db_jobmd"},{"databaseName":"log_db_openclass"},{"databaseName":"log_db_other"},{"databaseName":"log_db_yyh"},{"databaseName":"log_dev"},{"databaseName":"odl"},{"databaseName":"odl_db_asms2"},{"databaseName":"odl_db_biz"},{"databaseName":"odl_db_ccrm"},{"databaseName":"odl_db_cems"},{"databaseName":"odl_db_chd"},{"databaseName":"odl_db_clinic"},{"databaseName":"odl_db_cms"},{"databaseName":"odl_db_crawler"},{"databaseName":"odl_db_crm"},{"databaseName":"odl_db_da_admin"},{"databaseName":"odl_db_data_label"},{"databaseName":"odl_db_datateam"},{"databaseName":"odl_db_di_product"},{"databaseName":"odl_db_dotcom"},{"databaseName":"odl_db_dxy_live"},{"databaseName":"odl_db_exam_prd"},{"databaseName":"odl_db_exam_user_prd"},{"databaseName":"odl_db_growingio"},{"databaseName":"odl_db_health_mgmt"},{"databaseName":"odl_db_industry"},{"databaseName":"odl_db_insight"},{"databaseName":"odl_db_jobmd"},{"databaseName":"odl_db_killmesh"},{"databaseName":"odl_db_mail_system"},{"databaseName":"odl_db_mall"},{"databaseName":"odl_db_masterdata"},{"databaseName":"odl_db_mcm"},{"databaseName":"odl_db_medical_brain"},{"databaseName":"odl_db_mesh"},{"databaseName":"odl_db_minisite_oa"},{"databaseName":"odl_db_mis"},{"databaseName":"odl_db_oc_activity"},{"databaseName":"odl_db_oc_course"},{"databaseName":"odl_db_oc_user"},{"databaseName":"odl_db_repository"},{"databaseName":"odl_db_rms"},{"databaseName":"odl_db_stat"},{"databaseName":"odl_db_stat_system"},{"databaseName":"odl_db_trademd"},{"databaseName":"odl_db_ycrm"},{"databaseName":"odl_snapshot"},{"databaseName":"original"},{"databaseName":"public"},{"databaseName":"recomm"},{"databaseName":"rpt"},{"databaseName":"sanbox"},{"databaseName":"sandbox"},{"databaseName":"temp"},{"databaseName":"temp_db_bbs"},{"databaseName":"temp_db_biomart"},{"databaseName":"temp_db_chd"},{"databaseName":"temp_db_jobmd"},{"databaseName":"temp_db_openclass"},{"databaseName":"temp_ztp"},{"databaseName":"tempdev"},{"databaseName":"tempskone"}]}}
        if (res.status === 200) {        
            const dbs  = res.content.data.map(item=>{                
                item["key"] = item.databaseName || item.namespace
                item["title"] = item.key
                item["isLeaf"] = false
                item["children"] = []
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
        let res = await proxy.runScript(`!profiler sql "show tables";`,Tools.getJobName(),Tools.robotFetchParam())                     
        res = {status:200,content:{ "schema":{"type":"struct","fields":[{"name":"database","type":"string","nullable":false,"metadata":{}},{"name":"tableName","type":"string","nullable":false,"metadata":{}},{"name":"isTemporary","type":"boolean","nullable":false,"metadata":{}}]},"data": [{"database":"adl_db_chd","tableName":"chd_user_transaction_attributes_di","isTemporary":false},{"database":"adl_db_chd","tableName":"customer_message_feedback_df","isTemporary":false},{"database":"adl_db_chd","tableName":"delivery_supplier_df","isTemporary":false},{"database":"adl_db_chd","tableName":"digital_marketing_wechat_article_score_df","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_17_module_impression_ctr_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_cms_name_title_df","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_ecommerce_repurchase_channel_df","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_ecommerce_repurchase_df","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_ecommerce_snapshot_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_health_mall_page_module_purchase_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_health_mall_pay_view_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_health_mall_view_track_1_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_health_mall_view_track_2_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_health_mall_view_track_3_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_health_mall_view_track_4_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_health_mall_view_track_5_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_healthy_mall_new_user_df","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_healthy_mall_pv_base_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_module_impression_ctr_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_session_base_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_spm_page_cnt_di","isTemporary":false},{"database":"adl_db_chd","tableName":"dxmm_user_active_di","isTemporary":false},{"database":"adl_db_chd","tableName":"enterprise_daily_trend","isTemporary":false},{"database":"adl_db_chd","tableName":"enterprise_daily_trend_clicks_di","isTemporary":false},{"database":"adl_db_chd","tableName":"enterprise_daily_user_active_di","isTemporary":false},{"database":"adl_db_chd","tableName":"enterprise_user_action_pv_di","isTemporary":false},{"database":"adl_db_chd","tableName":"enterprise_user_action_vote_df","isTemporary":false},{"database":"adl_db_chd","tableName":"enterprise_user_statistics","isTemporary":false},{"database":"adl_db_chd","tableName":"health_mall_page_transition_1_di","isTemporary":false},{"database":"adl_db_chd","tableName":"health_mall_page_transition_df","isTemporary":false},{"database":"adl_db_chd","tableName":"refund_ec_df","isTemporary":false},{"database":"adl_db_chd","tableName":"refund_ec_time_df","isTemporary":false},{"database":"adl_db_chd","tableName":"refund_feedback_df","isTemporary":false},{"database":"adl_db_chd","tableName":"refund_feedback_score_reason_df","isTemporary":false},{"database":"adl_db_chd","tableName":"refund_kn_df","isTemporary":false},{"database":"adl_db_chd","tableName":"refund_supplier_df","isTemporary":false},{"database":"adl_db_chd","tableName":"tag_profile_di","isTemporary":false},{"database":"adl_db_chd","tableName":"ticket_supplier_df","isTemporary":false},{"database":"adl_db_chd","tableName":"ticket_supplier_total_df","isTemporary":false},{"database":"adl_db_chd","tableName":"user_child_di","isTemporary":false},{"database":"adl_db_chd","tableName":"user_mom_di","isTemporary":false},{"database":"adl_db_chd","tableName":"user_profile_di","isTemporary":false},{"database":"adl_db_chd","tableName":"user_tag_acess_di","isTemporary":false},{"database":"","tableName":"10ca89b80bbe4d3db9762ab8c640cf96","isTemporary":true},{"database":"","tableName":"1f575ad608e146bfa9fa841c2d98620c","isTemporary":true},{"database":"","tableName":"2374ad31f55b4b7d8b3e5f7586ad1a51","isTemporary":true},{"database":"","tableName":"3819dda6a07a4abf88fa4a3827bd2b12","isTemporary":true},{"database":"","tableName":"816180e19f8446a2a02e66aa00320430","isTemporary":true},{"database":"","tableName":"90e92be4672b463d9b635baa9b6eb5a3","isTemporary":true},{"database":"","tableName":"af870b4ea5bc4f7ea66e2cde881cfd8b","isTemporary":true},{"database":"","tableName":"b19e112d7cb54d169d9862f3b4aa6827","isTemporary":true},{"database":"","tableName":"b2f5e1cfdf104698a3a3c54f610abf6b","isTemporary":true},{"database":"","tableName":"command","isTemporary":true},{"database":"","tableName":"d68b1261f9c749abb123bdeb168d30a0","isTemporary":true},{"database":"","tableName":"f56136d3760e46449a7b6c2ea7e1bbff","isTemporary":true},{"database":"","tableName":"output","isTemporary":true},{"database":"","tableName":"test1","isTemporary":true},{"database":"","tableName":"testaa","isTemporary":true}]}}
        if (res.status === 200) {        
            const tables  = res.content.data.filter(item=>{
                const db = item.database || item.namespace
                return db === dbName
            }).map(item=>{
                item["key"] = `${dbName}.${item.tableName}`
                item["title"] = item.tableName
                item["isLeaf"] = true
                item["icon"]=<TableOutlined />
                return item
            }) 
            const {dbs} = action.__state
            const newdbs = dbs.map(db => {
                if(db.key===dbName){
                    db.children = tables
                }
                return db
            });            
            return {
                data: {...action.data,dbs:newdbs}
            }
        }
    }
    

    return {
        data: {...action.data}
    }
})