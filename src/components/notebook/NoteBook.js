import React from 'react'
import ExecuteUnit from "./ExecuteUnit";
import Engine from "./service/Engine";

const CODE_SPLITTER = "set notebooksplitter='notebooksplitter';"

export default class NodeBook extends React.Component {
    constructor(props) {
        super(props)
        this.executeUnitRefs = []
        this.executeUnits = [this.createNewExecuteUnit("")]
        this.state = {executeUnits: this.executeUnits}
        this.engine = new Engine(5 * 60 * 1000)
    }

    createNewExecuteUnit = (initialCode) => {
        return <ExecuteUnit parent={this} initialCode={initialCode} ref={et => this.addRef(et)}/>
    }

    addRef = (instance) => {
        if (instance) {
            this.executeUnitRefs.push(instance)
        }
    }

    nextExecuteUnit = () => {
        const isLastEmpty = () => {
            return this.executeUnitRefs.slice(-1)[0].codeBlockIsEmpty()
        }
        if (!isLastEmpty()) {
            this.executeUnits.push(this.createNewExecuteUnit())
            this.setState({executeUnits: this.executeUnits})
        }
    }

    createExecuteUnitAfterCurrent = (current)=>{
        const currentIndex = this.executeUnitRefs.indexOf(current)
        const newUnit = this.createNewExecuteUnit()
        this.executeUnits.splice(currentIndex+1,0,newUnit)
        this.setState({executeUnits: this.executeUnits})
    }

    removeExecuteUnitAfterCurrent = (current)=>{
        const currentIndex = this.executeUnitRefs.indexOf(current)
        this.executeUnits.splice(currentIndex,1)
        this.setState({executeUnits: this.executeUnits})
    }

    saveNoteBook = () => {
        const value = this.executeUnitRefs.map((instance) => {
            return instance.getCodeStr()
        }).join(CODE_SPLITTER)

        this.engine.saveFile(value, this.scriptId, (msg) => {
        })
    }

    componentDidMount() {
        if (this.props.parentCallback) {
            this.props.parentCallback(this)
        }
    }

    text = (value, scriptId) => {
        this.scriptId = scriptId
        this.initialCode = value
        if (value && value !== "undefined") {
            this.executeUnitRefs = []
            this.executeUnits = this.initialCode.split(CODE_SPLITTER).map((initialCode) => {
                return this.createNewExecuteUnit(initialCode)
            })
            this.setState({executeUnits: this.executeUnits})
        }
    }

    render() {
        return <div>
            {
                this.state.executeUnits
            }
        </div>
    }
}