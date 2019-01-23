import * as React from "react";
import {Button, FormGroup, InputGroup} from "@blueprintjs/core";
import './BackendForm.scss'
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {CLUSTER_MANAGER} from "../../service/BackendConfig";


export default class BackendForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {msg: ""}
        this.clusterMainPage = props.parent
    }

    _submit = () => {
        const {name, url, tag} = this.state
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        const self = this
        api.request2({
            action: "/backend/add",
            name: name,
            tag: tag,
            url: url
        }, (json) => {
            self.clusterMainPage.switchToBackendList()
        }, (str) => {
            this.setState({msg: str})
        })
    }

    submit = () => {
        this.validateForm()
    }

    validateForm = () => {
        const {name, url, tag} = this.state

        if (!name || !url || !tag) {
            this.setState({msg: `name, url ,tag should not empty`})
            return
        }

        if (!url.includes(":")) {
            this.setState({msg: `${url} should format like: ip/dns:port  `})
            return
        }

        const self = this
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        api.request2({
            action: "/backend/list"
        }, (json) => {
            const nameSet = new Set(json.map(x => x.name))

            if (nameSet.has(name)) {
                this.setState({msg: `${name} exists`})
                return
            }

            self._submit()
        }, (str) => {
            this.setState({msg: str})
        })

    }

    setName = (e) => {
        this.setState({name: e.target.value})
    }
    setTag = (e) => {
        this.setState({tag: e.target.value})
    }
    setUrl = (e) => {
        this.setState({url: e.target.value})
    }

    render() {
        return (<div>
                <FormGroup
                    helperText="name"
                    label="the name of backend"
                    labelFor="name"
                    labelInfo="(required)">
                    <InputGroup id="name" onChange={this.setName} placeholder="name"/>
                </FormGroup>
                <FormGroup
                    helperText="multi tag please use comma separate"
                    label="tag"
                    labelFor="tag"
                    labelInfo="(required)">
                    <InputGroup id="tag" onChange={this.setTag} placeholder="tag"/>
                </FormGroup>

                <FormGroup
                    helperText="address"
                    label="url"
                    labelFor="url"
                    labelInfo="(required)">
                    <InputGroup id="url" onChange={this.setUrl} placeholder="url e.g. 127.0.0.1:9003"/>
                </FormGroup>

                <Button type="submit" text="Add" onClick={this.submit}/>
                {this.state.msg !== "" && <div className="mlsql-backend-messagebox">{this.state.msg}</div>}
            </div>
        )
    }
}