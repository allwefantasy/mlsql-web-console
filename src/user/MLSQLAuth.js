import {MLSQLAPI, APIResponse, ServerError} from "../service/MLSQLAPI";
import * as backendConfig from "../service/BackendConfig";
import * as HTTP from "../service/HTTPMethod";
import React from "react";


export class MLSQLAuth {

    isLogin() {
        return sessionStorage.getItem(HTTP.AccessToken.name) !== null
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
            /**
             *  if server return unauthorized status, then we should
             *  remove our token since it maybe invalidate.
             */
            if (apiResponse.status === HTTP.Status.Unauthorized) {
                sessionStorage.removeItem(HTTP.AccessToken.name)
            } else {
                apiResponse.content.then((s => {
                    callback(JSON.parse(s)["userName"])
                })).catch((error) => {
                })
            }
        }

        api.request(HTTP.Method.GET, {}, sCallBack, (m) => {
            console.log(m)
        })
    }

    /**
     * @param {String} userName
     * @param {String} password
     */
    login(userName, password, _sCallBack, _errorCallBack) {
        this.registerOrLogin(backendConfig.LOGIN_URL, userName, password, _sCallBack, _errorCallBack)
    }

    /**
     * @param {String} userName
     * @param {String} password
     */
    register(userName, password, _sCallBack, _errorCallBack) {
        this.registerOrLogin(backendConfig.REGISTER_URL, userName, password, _sCallBack, _errorCallBack)
    }

    registerOrLogin(url, userName, password, _sCallBack, _errorCallBack) {
        const api = new MLSQLAPI(url)

        const body = {
            userName: userName,
            password: password
        }

        /**
         * @param  {APIResponse} apiResponse
         */
        const sCallBack = (apiResponse) => {
            if (apiResponse.accessToken) {
                sessionStorage.setItem(HTTP.AccessToken.name, apiResponse.accessToken)
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