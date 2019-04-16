import React from "react";
import {MLSQLAPI, APIResponse, ServerError} from "../service/MLSQLAPI";
import * as backendConfig from "../service/BackendConfig";
import * as HTTP from "../service/HTTPMethod";
import Cookies from 'universal-cookie';


export class MLSQLAuth {

    isLogin() {
        return sessionStorage.getItem(HTTP.AccessToken.name) !== null
    }
    
    setUserName(username) {
        sessionStorage.setItem(HTTP.AccessToken.username, username);
    }

    getUserName() {
        return sessionStorage.getItem(HTTP.AccessToken.username);
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

    user(callback) {

        const api = new MLSQLAPI(backendConfig.USERNAME_URL)
        api.request2({}, (json) => {
            callback(json)
        }, (str) => {

        })
    }

    /**
     * @param {String} userName
     * @param {String} password
     */
    login(userName, password, _sCallBack, _errorCallBack) {
        this.setUserName(userName)
        this.registerOrLogin(backendConfig.LOGIN_URL, userName, password, _sCallBack, _errorCallBack)
    }

    logout() {
        sessionStorage.removeItem(HTTP.AccessToken.name)
        sessionStorage.removeItem(HTTP.AccessToken.username)
    }

    /**
     * @param {String} userName
     * @param {String} password
     */
    register(userName, password, _sCallBack, _errorCallBack) {
        this.setUserName(userName)
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
                const cookies = new Cookies();
                cookies.set(HTTP.AccessToken.name, apiResponse.accessToken, { path: '/' });
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
