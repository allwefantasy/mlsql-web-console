import React from 'react'
import CodeBlock from "./CodeBlock";
import CommandGroup from "./CommandGroup";
import Engine from "./service/Engine";
import DisplayGroup from "./DisplayGroup";


export default class ExecuteUnit extends React.Component {
    constructor(props) {
        super(props)
        this.notebook = props.parent
    }

    execute = () => {
        const sql = this.codeBlock.originalEditor().getValue()
        const engine = new Engine(5 * 60 * 1000)
        engine.run(sql, (msg) => {
            this.displayGroup.setState({displayData: msg})
            this.notebook.nextExecuteUnit()
        })
    }

    codeBlockIsEmpty = () => {
        return this.getCodeStr() === ""
    }

    getCodeStr = () => {
        return this.codeBlock.originalEditor().getValue()
    }


    render() {
        return <div>
            <CodeBlock initialCode={this.props.initialCode} ref={et => {
                this.codeBlock = et
            }} executeUnit={this}/>
            <CommandGroup ref={et => {
                this.commandGroup = et
            }} executeUnit={this}/>
            <DisplayGroup ref={et => this.displayGroup = et}/>

        </div>
    }
}

