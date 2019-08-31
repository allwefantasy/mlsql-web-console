import {MLSQLAPI} from "../../../service/MLSQLAPI";

const uuidv4 = require('uuid/v4');

export default class Engine {

    /**
     * @param {MLSQLAPI} api
     * @param {Number} timeout
     */
    constructor(api, timeout) {
        this.api = api
        this.timeout = timeout
    }

    /**
     * @param {string} sql
     * @param {(msg)=>{}} show_result
     */
    run = (sql, show_result) => {
        const jobName = uuidv4()
        this.api.runScript({
            jobName: jobName,
            timeout: this.timeout
        }, sql, wow => {
            try {
                show_result(wow)
            } catch (e) {
                show_result(JSON.stringify(wow, null, 2))
            }
        }, fail => {
            let failRes = fail.toString()
            try {
                show_result(JSON.parse(failRes)["msg"])
            } catch (e) {
            }
        })
    }
}