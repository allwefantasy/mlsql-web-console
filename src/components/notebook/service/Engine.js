import {MLSQLAPI} from "../../../service/MLSQLAPI";
import * as BackendConfig from "../../../service/BackendConfig";
import * as HTTP from "../../../service/HTTPMethod";

const uuidv4 = require('uuid/v4');

export default class Engine {

    /**
     * @param {Number} timeout
     */
    constructor(timeout) {
        this.timeout = timeout
    }

    /**
     * @param {string} sql
     * @param {(msg)=>{}} show_result
     */
    run = (sql, show_result, fail_result) => {
        const jobName = uuidv4()
        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)

        api.newRunScript({
            jobName: jobName,
            timeout: this.timeout
        }, sql, show_result, fail_result)


    }

    /**
     * @param {string} code
     * @param {string} scriptId
     * @param {(msg)=>{}} show_result
     */
    saveFile = (code, scriptId, show_result) => {
        const api = new MLSQLAPI(BackendConfig.CREATE_SCRIPT_FILE)
        api.request(HTTP.Method.POST, {
            id: scriptId,
            content: code
        }, (ok) => {
            if (ok.status != 200) {
                ok.json((wow) => {
                    show_result(wow["msg"])
                }, (jsonErr) => {
                    show_result(jsonErr)
                })
            } else {
                show_result("saved")
            }

        }, (fail) => {
            show_result(fail)
        })
    }
}