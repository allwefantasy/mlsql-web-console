import React from 'react'
import CodeBlock from "./CodeBlock";
import CommandGroup from "./CommandGroup";
import {MLSQLAPI} from "../../service/MLSQLAPI";
import * as BackendConfig from "../../service/BackendConfig";
import Engine from "./service/Engine";
import DisplayGroup from "./DisplayGroup";


export default class ExecuteUnit extends React.Component {
    constructor(props) {
        super(props)
        this.notebook = props.parent
        this.state = {}
    }

    execute = () => {
        const sql = this.codeBlock.originalEditor().getValue()
        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
        const engine = new Engine(api, 5 * 60 * 1000)
        engine.run(sql, (msg) => {
            this.displayGroup.setState({displayData: msg})
            this.notebook.nextExecuteUnit()
        })
    }


    render() {
        return <div>
            <CodeBlock ref={et => {
                this.codeBlock = et
            }} executeUnit={this}/>
            <CommandGroup ref={et => {
                this.commandGroup = et
            }} executeUnit={this}/>
            <DisplayGroup ref={et => this.displayGroup = et}/>

        </div>
    }
}

