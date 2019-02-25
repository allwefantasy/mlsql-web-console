import * as React from "react";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {RUN_SCRIPT} from "../../service/BackendConfig";
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';
import {ETPopTool} from "./ETPopTool";

const InputGroup = Input.Group;
const Option = Select.Option;


export class ETPopDownload extends ETPopTool {

    makeMLSQL = () => {
        const self = this
        let paramsArray = []
        for (let k in this.data.params) {
            let v = this.data.params[k]
            paramsArray.push(k.replace(/\[group\]/g, '0') + "=" + "\"" + v + "\"")
        }

        if (paramsArray.length == 0) {
            paramsArray.push("keepVersion=\"true\"")
        }
        //run command as DownloadExt.`` where from="test2" and to="/tmp/jack";
        return `run command as ${this.name}.\`\` where 
${paramsArray.join(" and\n ")};`
    }

    render() {
        return <div>

            <InputGroup compact={true}>
                {this.state.dataForRender}
            </InputGroup>

        </div>
    }
}
