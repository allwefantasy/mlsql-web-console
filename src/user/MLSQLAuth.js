import {MLSQLAPI, APIResponse, ServerError} from "../service/MLSQLAPI";
import * as backendConfig from "../service/BackendConfig";
import * as HTTP from "../service/HTTPMethod";

export class MLSQLAuth {

    isLogin() {
        return sessionStorage.getItem('access_token') !== null
    }

    /**
     *
     * @param callback {(userName)=>{}}
     */
    userName(callback) {

        const api = new MLSQLAPI(backendConfig.USERNAME_URL)

        /**
         * @param  {APIResponse} apiResponse
         */
        const sCallBack = (apiResponse) => {
            apiResponse.content.then((s => {
                callback(JSON.parse(s)["userName"])
            }))
        }

        api.request(HTTP.Method.GET, {}, sCallBack, (m) => {
            console.log(m)
        })
    }

    /**
     * @param {String} userName
     * @param {String} password
     */
    register(userName, password, _sCallBack, _errorCallBack) {
        const api = new MLSQLAPI(backendConfig.REGISTER_URL)

        const body = {
            userName: userName,
            password: password
        }

        /**
         * @param  {APIResponse} apiResponse
         */
        const sCallBack = (apiResponse) => {
            if (apiResponse.accessToken) {
                sessionStorage.setItem("access_token", apiResponse.accessToken)
            }
            _sCallBack(apiResponse)
        }
        /**
         *
         * @param {ServerError} serverError
         */
        const errorCallBack = (serverError) => {
            _errorCallBack(serverError)
        }
        api.request(HTTP.Method.POST, body, sCallBack, errorCallBack)
    }
}