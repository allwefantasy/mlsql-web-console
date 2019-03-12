import {MLSQLAPI} from "../../../service/MLSQLAPI";
import {message} from "antd";
import {
    LIST_ROLES_MEMBER,
    LIST_ROLES_TABLE,
    LIST_TEAMS_MEMBER,
    LIST_TEAMS_ROLE, LIST_TEAMS_TABLES, REMOVE_ROLES_MEMBER, REMOVE_ROLES_TABLE,
    REMOVE_TEAMS_MEMBER,
    REMOVE_TEAMS_ROLE, REMOVE_TEAMS_TABLE, RUN_SCRIPT
} from "../../../service/BackendConfig";

export default class Service {

    static MESSAGE_TIMEOUT = 10

    static fetchTeams(apiUrl, self, stateKey = "data") {
        const api = new MLSQLAPI(apiUrl)
        api.request2({}, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchMembersByTeam(self, teamName, stateKey = "data") {
        const api = new MLSQLAPI(LIST_TEAMS_MEMBER)
        api.request2({teamName: teamName}, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchRoles(parent, teamName, stateKey = "data") {
        const api = new MLSQLAPI(LIST_TEAMS_ROLE)
        api.request2({teamName: teamName}, resJson => {
            parent.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchTablesByRole(parent, teamName, roleName, stateKey) {
        const api = new MLSQLAPI(LIST_ROLES_TABLE)
        api.request2({teamName: teamName, roleName: roleName}, resJson => {
            if (stateKey) {
                parent.setState({[stateKey]: resJson})
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static removeRoleMember(parent, teamName, roleName, userName, stateKey, callback) {
        const api = new MLSQLAPI(REMOVE_ROLES_MEMBER)
        api.request2({teamName: teamName, roleName: roleName, userName: userName}, resJson => {
            if (stateKey) {
                parent.setState({[stateKey]: resJson})
            }
            if (callback) {
                callback()
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchMembersByRole(parent, teamName, roleName, stateKey, callback) {
        const api = new MLSQLAPI(LIST_ROLES_MEMBER)
        api.request2({teamName: teamName, roleName: roleName}, resJson => {
            if (stateKey) {
                parent.setState({[stateKey]: resJson})
            }
            if (callback) {
                callback()
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static removeRole(parent, teamName, roleName) {
        const api = new MLSQLAPI(REMOVE_TEAMS_ROLE)
        api.request2({teamName: teamName, roleName: roleName}, resJson => {

        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static removeTeamMember(parent, teamName, userName, callback) {
        const api = new MLSQLAPI(REMOVE_TEAMS_MEMBER)
        api.request2({teamName: teamName, userName: userName}, resJson => {
            callback()
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static teamInvite(self, apiUrl, teamName, stateKey = "data") {
        const api = new MLSQLAPI(apiUrl)
        api.request2({teamName: teamName}, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchTables(self, teamName, stateKey = "data") {
        const api = new MLSQLAPI(LIST_TEAMS_TABLES)
        api.request2({teamName: teamName}, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static removeTable(self, teamName, tableId, stateKey, callback) {
        const api = new MLSQLAPI(REMOVE_TEAMS_TABLE)
        api.request2({teamName: teamName, tableId: tableId}, resJson => {
            if (stateKey) {
                self.setState({[stateKey]: resJson})
            }
            if (callback) {
                callback()
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchTableTypes(self, stateKey = "data") {
        const api = new MLSQLAPI(RUN_SCRIPT)
        api.runScript({}, `load _mlsql_.\`tables/tableTypes\` as output;`, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchSourceTypes(self, stateKey = "data") {
        const api = new MLSQLAPI(RUN_SCRIPT)
        api.runScript({}, `load _mlsql_.\`tables/sourceTypes\` as output;`, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchOperateTypes(self, stateKey) {
        const api = new MLSQLAPI(RUN_SCRIPT)
        api.runScript({}, `load _mlsql_.\`tables/operateTypes\` as output;`, resJson => {
            if (stateKey) {
                self.setState({[stateKey]: resJson})
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static removeRoleTable(self, teamName, roleName, tableId, stateKey, callback) {
        const api = new MLSQLAPI(REMOVE_ROLES_TABLE)
        api.request2({teamName: teamName, roleName: roleName, tableId: tableId}, resJson => {
            if (stateKey) {
                self.setState({[stateKey]: resJson})
            }
            if (callback) {
                callback()
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }
}