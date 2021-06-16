import React from 'react'
import CodeBlock from "./CodeBlock";
import CommandGroup from "./CommandGroup";
import Engine from "./service/Engine";
import DisplayGroup from "./DisplayGroup";
import './notebook.scss'
export default class ExecuteUnit extends React.Component {
    constructor(props) {
        super(props)
        this.notebook = props.parent
    }

    execute = () => {
        const sql = this.codeBlock.originalEditor().getValue()
        const engine = new Engine(5 * 60 * 1000)
        this.props.saveNoteBook()
        engine.run(sql, (msg) => {
            this.displayGroup.refresh(msg)
            this.commandGroup.setState({isExecute: false})
            // this.notebook.nextExecuteUnit()
        }, msg => {
            this.displayGroup.fail(msg)
            this.commandGroup.setState({isExecute: false})
        })
    }

    codeBlockIsEmpty = () => {
        return this.getCodeStr() === ""
    }

    getCodeStr = () => {
        return this.codeBlock.originalEditor().getValue()
    }

    render() {

        const {
            initialCode,
            onAddCell,
            onRemoveCell,
            disableDelete
        } = this.props
        return <div className="mb5">
            <CodeBlock 
                initialCode={initialCode} 
                ref={et => { this.codeBlock = et }} 
                executeUnit={this}
                onChangeEditorValue={this.props.onChangeEditorValue}
            />
            <CommandGroup 
            ref={et => {this.commandGroup = et}}
            executeUnit={this}
            onAddCell={onAddCell}
            onRemoveCell={onRemoveCell}
            disableDelete={disableDelete}/>
            <DisplayGroup ref={et => this.displayGroup = et}/>

        </div>
    }
}

