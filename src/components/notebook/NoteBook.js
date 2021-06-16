import React from 'react'
import ExecuteUnit from "./ExecuteUnit";
import Engine from "./service/Engine";
import { cloneDeep } from 'lodash'

const CODE_SPLITTER = "set notebooksplitter='notebooksplitter';"

export default class NoteBook extends React.Component {
    constructor(props) {
        super(props)
        this.executeUnitRefs = []
        // this.executeUnits = [this.createNewExecuteUnit("")]
        this.state = {
            executeUnits: this.executeUnits,
            excuteList: [{id: '1', content: ''}]
        }
        this.engine = new Engine(5 * 60 * 1000)
        this.addCell = this.addCell.bind(this)
        this.removeCell = this.removeCell.bind(this);
    }

    // createNewExecuteUnit = (initialCode) => {
    //     return <ExecuteUnit parent={this} initialCode={initialCode} ref={et => this.addRef(et)}/>
    // }

    // addRef = (instance) => {
    //     // console.log(instance, 'int')
    //     if (instance) {
    //         this.executeUnitRefs.push(instance)
    //     }
    // }

    // nextExecuteUnit = () => {
    //     const isLastEmpty = () => {
    //         return this.executeUnitRefs.slice(-1)[0].codeBlockIsEmpty()
    //     }
    //     if (!isLastEmpty()) {
    //         this.executeUnits.push(this.createNewExecuteUnit())
    //         this.setState({executeUnits: this.executeUnits})
    //     }
    // }

    saveNoteBook = () => {
        // const value = this.executeUnitRefs.map((instance) => {
        //     return instance.getCodeStr()
        // }).join(CODE_SPLITTER)
        const value = this.state.excuteList.map(v => v.content).join(CODE_SPLITTER)

        this.engine.saveFile(value, this.scriptId, (msg) => {
        })
    }

    addCell (index) {
        const id = Math.max(...this.state.excuteList.map(v => v.id)) + 1
        const newList = cloneDeep(this.state.excuteList)
        newList.splice(index + 1, 0, {content: '', id})
        this.setState({
            excuteList: newList
        })
    }

    removeCell (cell) {
        const newList = this.state.excuteList.filter(v => v.id !== cell.id)
        this.setState({
            excuteList: newList
        })
    }

    componentDidMount() {
        if (this.props.parentCallback) {
            this.props.parentCallback(this)
        }
    }

    handleChangeEditorValue = (cell, value) => {
        let newList = cloneDeep(this.state.excuteList)
        const index = newList.findIndex(v => v.id === cell.id)
        newList[index].content = value
        this.setState({
            excuteList: newList
        })
    }

    text = (value, scriptId) => { // 初始化 ed
        this.scriptId = scriptId
        this.initialCode = value
        // if (value && value !== "undefined") {
        //     this.executeUnitRefs = []
        //     this.executeUnits = this.initialCode.split(CODE_SPLITTER).map((initialCode) => {
        //         return this.createNewExecuteUnit(initialCode)
        //     })
        //     this.setState({executeUnits: this.executeUnits})
        // }
        if (value) {
            const list = this.initialCode.split(CODE_SPLITTER).map((initialCode, index) => {
                return { content: initialCode, id: index }
            })
            this.setState({excuteList: list})
        }
    }

    render () {
        const { excuteList } = this.state
        return <div className="notebook">
            {
                excuteList.map((v, i) => {
                    return (<ExecuteUnit 
                        key={v.id} 
                        initialCode={v.content} 
                        id={v.id}
                        onAddCell={() => this.addCell(i)}
                        disableDelete={excuteList.length === 1}
                        onRemoveCell={() => this.removeCell(v)}
                        saveNoteBook={() => this.saveNoteBook(v)}
                        onChangeEditorValue={(value) => this.handleChangeEditorValue(v, value)}
                        />)
                })
            }
        </div>
    }
}