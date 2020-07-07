import { BACKEND_URL, AccessToken } from './RestConst'
import { GlobalParamNames } from '../Dicts'

export class RestResponse {
    constructor(status, content) {
        this.status = status
        this.content = content
    }
}

export class Backend {

    constructor(url, fetch_config = {}) {
        this.url = url
        if (!this.url) {
            this.url = BACKEND_URL
        }
        this.fetch_config = fetch_config
    }

    async request(action, params, method = "GET") {
        method = method.toUpperCase();
        const userName = sessionStorage.getItem(GlobalParamNames.USER_NAME)
        //const loginToken = sessionStorage.getItem(GlobalParamNames.LOGIN_TOKEN)
        if (userName) {
            params[GlobalParamNames.USER_NAME] = userName
        }

        // if (loginToken) {
        //     params[GlobalParamNames.LOGIN_TOKEN] = loginToken
        // }

        let formBody = [];
        for (let property in params) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        let newurl = this.url + action

        if (formBody.length > 0) {
            newurl = newurl + "?"
        }

        if (method === "GET") {
            newurl = newurl + formBody.join("&")
            formBody = undefined
        } else {
            formBody = formBody.join("&")
        }

        const basic_config = {
            method: method,
            timeout: 1000 * 60 * 60 * 24,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem(AccessToken) || ''
            },
            body: formBody
        }

        const final_config = { ...basic_config, ...this.fetch_config }

        try {            
            const response = await fetch(newurl, final_config);
            if (!response.ok) {
                const error = await response.text()
                return new RestResponse(response.status, error);
            }
            const json = await response.json();
            return new RestResponse(200, json);
        } catch (err) {
            return new RestResponse(500, err);
        }
    }
}
