import {MLSQLAPI} from "../../../service/MLSQLAPI";
import {message} from "antd";
import {CLUSTER_MANAGER, LIST_BACKENDS_BY_TEAM} from "../../../service/BackendConfig";

export default class Service {

    static MESSAGE_TIMEOUT = 10

    static fetchBackends(self, params, stateKey, callback) {
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        const newParams = Object.assign(params, {action: "/backend/list"})
        api.request2(newParams, resJson => {
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

    static checkBackendName(self, name, stateKey, callback) {
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        const newParams = Object.assign({name: name}, {action: "/backend/name/check"})
        api.request2(newParams, resJson => {
            if (stateKey) {
                self.setState({[stateKey]: resJson})
            }
            if (callback) {
                callback(resJson)
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchBackendsByNames(self, names, stateKey, callback) {
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        const newParams = Object.assign({names: names}, {action: "/backend/list/names"})
        api.request2(newParams, resJson => {
            if (stateKey) {
                self.setState({[stateKey]: resJson})
            }
            if (callback) {
                callback(resJson)
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static fetchBackendNamesByTeam(self, teamName, stateKey, callback) {
        const api = new MLSQLAPI(LIST_BACKENDS_BY_TEAM)
        api.request2({teamName: teamName}, resJson => {
            if (stateKey) {
                self.setState({[stateKey]: resJson})
            }
            if (callback) {
                callback(resJson)
            }
        }, failStr => {
            message.warning("load data fail:" + failStr, Service.MESSAGE_TIMEOUT)
        })
    }

    static addBackend(self, params, stateKey, callback) {
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        const newParams = Object.assign(params, {action: "/backend/add"})
        api.request2(newParams, resJson => {
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

    static removeBackend(self, backendName, stateKey, callback) {
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        const newParams = Object.assign({name: backendName}, {action: "/backend/remove"})
        api.request2(newParams, resJson => {
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

    static updateBackendTags(self, backendName, tags, stateKey, callback) {
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        const newParams = Object.assign({tags: tags, name: backendName}, {
            action: "/backend/tags/update",
            merge: "append"
        })
        api.request2(newParams, resJson => {
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