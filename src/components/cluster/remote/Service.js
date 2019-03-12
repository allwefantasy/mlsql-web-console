import {MLSQLAPI} from "../../../service/MLSQLAPI";
import {message} from "antd";
import {CLUSTER_MANAGER} from "../../../service/BackendConfig";

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
}