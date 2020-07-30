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
    static ENGINE_LIST = "/api_v1/engine/list"

    static SCRIPT_FILE_LIST = "/api_v1/script_file"

    static SCRIPT_FILE_GET = "/api_v1/script_file/get"

    static SCRIPT_FILE_REMOVE = "/api_v1/script_file/remove"

    static PLUGIN_LIST = "/api_v1/plugin/list"
    static PLUGIN_GET = "/api_v1/plugin/get"

    static USER_EXTRA = "/api_v1/user/extra/update"

    static APPLY_GET = "/api_v1/analysis/apply"


}