export default class RemoteAction {
    static RUN = "/api_v1/run/script"
    static USER_NAME = "/api_v1/user/userName"
    static JOB_LIST = "/api_v1/job/list"
    static JOB_DETAIL = "/api_v1/job"
    static JOB_KILL = "/api_v1/job/kill"

    static SAVE_SCRIPT_FILE = "/api_v1/script_file"

    static ANALYSIS_TABLES = "/api_v1/analysis/tables"
    static ANALYSIS_TABLE_INFO = "/api_v1/analysis/table/get"
    static ANALYSIS_SAVE = "/api_v1/analysis/tables/save"
    static ANALYSIS_TABLE_DELETE = "/api_v1/analysis/table/delete"

    static APP_INFO = "/api_v1/app"
    static APP_SAVE = "/api_v1/app/save"

    static REGISTER = "/api_v1/user/register"
    static LOGIN = "/api_v1/user/login"
    static LOGOUT = "/api_v1/user/logout"

    static ENGINE_ADD = "/api_v1/engine/add"
    static ENGINE_REGISTER = "/api_v1/engine/register"
    static ENGINE_LIST = "/api_v1/engine/list"
    static ENGINE_REMOVE = "/api_v1/engine/remove"

    static SCRIPT_FILE_LIST = "/api_v1/script_file"

    static SCRIPT_FILE_GET = "/api_v1/script_file/get"

    static SCRIPT_FILE_REMOVE = "/api_v1/script_file/remove"

    static PLUGIN_LIST = "/api_v1/plugin/list"
    static PLUGIN_GET = "/api_v1/plugin/get"

    static ANALYSIS_PLUGIN_LIST = "/api_v1/script_file/plugins"
    static ANALYSIS_PLUGIN_GET = "/api_v1/script_file/plugin/get"
    static ANALYSIS_PLUGIN_PUBLISH = "/api_v1/script_file/plugin/publish"
    static SCRIPT_SHARE_PUBLIC = "/api_v1/script_file/share"

    static USER_EXTRA = "/api_v1/user/extra/update"
    static USER_CHANGE_PASSWORD = "/api_v1/changepassword"

    static APPLY_GET = "/api_v1/analysis/apply"

    static TEMA_LIST = "/api_v1/team" 
    
    static DS_ADD = "/api_v1/ds/add" 
    static DS_LIST = "/api_v1/ds/list"
    static DS_REMOVE = "/api_v1/ds/remove" 

    static DS_MYSQL_DBS= "/api_v1/ds/mysql/dbs"

    static DS_MYSQL_CONNECT = "/api_v1/ds/mysql/connect/get"
    static DS_MYSQL_COLUMN_INFO = "/api_v1/ds/mysql/column"

    static CLOUD_CREATE_ENGINE = "/api_v1/proxy/api/create_engine"
    static CLOUD_DELETE_ENGINE = "/api_v1/proxy/api/delete_engine"
    static CLOUD_ENGINE_STATUS = "/api_v1/proxy/api/status"
    static CLOUD_ENGINE_LIST = "/api_v1/proxy/api/list"

    static INDEXER_LIST = "/api_v1/indexer"
    static MYSQL_INDEXER_CREATE = "/api_v1/indexer/mysql/build"

}