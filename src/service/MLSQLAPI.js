import * as HTTP from "../service/HTTPMethod";
import {MLSQLAuth as Auth} from "../user/MLSQLAuth";

const uuidv4 = require('uuid/v4');

export class ServerError {
    constructor(content) {
        this.value = content
    }
}

export class APIResponse {
    /**
     * @param {Number} status
     * @param {Promise<String>} content
     * @param {String} accessToken
     */
    constructor(status, content, accessToken) {
        this.status = status;
        this.content = content;
        this.accessToken = accessToken
    }

    json = (process, jsonErr) => {

        this.content.then((s) => {
            try {
                const jsonObj = JSON.parse(s)
                process(jsonObj)
            } catch (e) {
                jsonErr(s)
            }

        })
    }

}

export class MLSQLAPI {

    constructor(url) {
        this.url = url;
    }


    request2(params, successCallback, serverErrorCallback) {
        const self = this
        self.request(HTTP.Method.POST, params, (ok) => {
            ok.json((wow) => {
                successCallback(wow)
            }, (jsonErr) => {
                serverErrorCallback(jsonErr)
            })
        }, (fail) => {
            try {
                fail.value().content((str) => {
                    serverErrorCallback(str)
                })
            } catch (e) {
                serverErrorCallback(fail ? fail.toString() : "result is null")
            }

        })
    }

    runScript(params, sql, successCallback, serverErrorCallback) {
        const auth = new Auth()
        const jobName = uuidv4()
        const self = this
        auth.user((jsonRes) => {
            const {userName, backendTags} = jsonRes

            if (!backendTags) {
                serverErrorCallback(`
                
                ---------------Warning--------------------
                
                Please make sure you have backend configured. 
                If not, please contact admin;
                
                ------------------------------------------
                `)
                return
            }

            const finalParams = {
                sql: sql,
                owner: userName,
                jobName: jobName,
                sessionPerUser: true,
                show_stack: true,
                skipAuth: false,
                tags: backendTags || ""
            }
            Object.assign(finalParams, params)
            const background = params.background || false
            if (background) {
                Object.assign(finalParams, {async: true, callback: ""})
            }

            self.request(HTTP.Method.POST, finalParams, (ok) => {
                if (ok.status === 200) {
                    ok.json((wow) => {
                        successCallback(wow)
                    }, (jsonErr) => {
                        serverErrorCallback(jsonErr)
                    })
                } else {
                    try {
                        ok.content.then((str) => {
                            serverErrorCallback(str)
                        })
                    } catch (e) {
                        serverErrorCallback("backend status:" + ok.status)
                    }
                }

            }, (fail) => {
                try {
                    fail.value().content((str) => {
                        serverErrorCallback(str)
                    })
                } catch (e) {
                    serverErrorCallback(fail ? fail.toString() : "result is null")
                }

            })
        })
    }

    request(method, body, successCallback, serverErrorCallback) {
        method = method.toUpperCase();

        let formBody = [];
        for (let property in body) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(body[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        let newurl = this.url

        if (method === "GET") {
            newurl = newurl + "?" + formBody
            formBody = undefined
        } else {
            formBody = formBody.join("&")
        }
        return fetch(newurl, {
            method: method,
            timeout: 1000 * 60 * 60 * 24,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem(HTTP.AccessToken.name) || ''
            },
            body: formBody
        })
            .then((res) => {
                successCallback(new APIResponse(res.status, res.text(), res.headers.get(HTTP.AccessToken.name)))
            })
            .catch((res) => {
                serverErrorCallback(new ServerError(res))
            })
    }
}