import { RestResponse, Backend } from './backend/Backend'
import RemoteAction from './RemoteAction'
import { Method, Status } from './backend/RestConst'


export class ActionProxy {
  constructor() {
    this.backend = new Backend()
  }

  async userName() {
    const res = await this.get(RemoteAction.USER_NAME, {})
    return res
  }

  async runScript(sql, jobName, params) {
    const res = await this.userName()
    if (res.status !== 200) {
      return res
    }
    const { userName, backendTags } = res.content

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
    const temp = await this.post(RemoteAction.RUN, finalParams)
    return temp
  }

  /**
   * 
   * @param {string} action 
   * @param {{}} params 
   * @return {RestResponse}
   */
  async get(action, params) {
    const res = await this.backend.request(action, params, Method.GET)
    return res
  }

  /**
   * 
   * @param {string} action 
   * @param {{}} params 
   * @returns {RestResponse}
   */
  async post(action, params) {
    const res = await this.backend.request(action, params, Method.POST)
    return res
  }
}

