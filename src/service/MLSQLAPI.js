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
}

export class MLSQLAPI {

    constructor(url) {
        this.url = url;
    }


    request(method, body, successCallback, serverErrorCallback) {
        method = method.toUpperCase();
        if (method === 'GET') {
            body = undefined;
        }

        let formBody = [];
        for (let property in body) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(body[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        return fetch(this.url, {
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem('access_token') || ''
            },
            body: formBody.join("&")
        })
            .then((res) => {
                successCallback(new APIResponse(res.status, res.text(), res.headers.get("access-token")))
            }).catch((res) => {
                serverErrorCallback(new ServerError(res))
            })
    }
}