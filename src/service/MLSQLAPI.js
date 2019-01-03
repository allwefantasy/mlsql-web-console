import * as HTTP from "../service/HTTPMethod";

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

    json = (process) => {

        this.content.then((s) => {
            const jsonObj = JSON.parse(s)
            process(jsonObj)
        })
    }

}


export class MLSQLAPI {

    constructor(url) {
        this.url = url;
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