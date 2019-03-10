import {MLSQLAPI} from "../../../service/MLSQLAPI";
import {message} from "antd";
import {LIST_TEAMS_MEMBER} from "../../../service/BackendConfig";

export default class Service {

    static fetchTeams(apiUrl, self, stateKey = "data") {
        const api = new MLSQLAPI(apiUrl)
        api.request2({}, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, 15)
        })
    }

    static fetchMembersByTeam(self, teamName, stateKey = "data") {
        const api = new MLSQLAPI(LIST_TEAMS_MEMBER)
        api.request2({teamName: teamName}, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, 15)
        })
    }

    static teamInvite(self, apiUrl, teamName, stateKey = "data") {
        const api = new MLSQLAPI(apiUrl)
        api.request2({teamName: teamName}, resJson => {
            self.setState({[stateKey]: resJson})
        }, failStr => {
            message.warning("load data fail:" + failStr, 15)
        })
    }
}