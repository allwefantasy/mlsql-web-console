import * as React from "react";
import brace from 'brace';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';

import '../MLSQLAceEditor.scss'
import 'antd/dist/antd.css';
import { Button, Tooltip, Progress } from 'antd';
import { MLSQLAPI } from "../../service/MLSQLAPI";
import * as BackendConfig from "../../service/BackendConfig";
import * as HTTP from "../../service/HTTPMethod";
import { Select } from 'antd';
import { Resizable } from "re-resizable";
import {ActionProxy} from '../../backend_service/ActionProxy'

const { Option } = Select;

const uuidv4 = require('uuid/v4');


class PythonACE extends React.Component {

    constructor(props) {
        super(props)
        this.language = this.props.language || "sql"
        this.queryApp = this.props.parent.queryApp

        this.state = { value: "", loading: false }
        
        this.executeQuery = this.executeQuery.bind(this)
        this.cancelQuery = this.cancelQuery.bind(this)
        this.queryLog = this.queryLog.bind(this)
        this.cancelQueryLog = this.cancelQueryLog.bind(this)
        
        this.log = {}
    }

    text = (value, scriptId) => {
        this.setState({ value: value, scriptId: scriptId }, () => {
            this.aceEditorRef.editor.setValue(value, 1)
        })

    }

    componentDidMount() {
        if (this.props.parentCallback) {
            this.props.parentCallback(this)
        }
    }

    onChange(newValue) {

    }

    executeSave = () => {
        const api = new MLSQLAPI(BackendConfig.CREATE_SCRIPT_FILE)
        const self = this

        const messageBox = this.getMessageBoxAceEditor()

        if (!self.state.scriptId) {
            messageBox.setValue("no file are opened, cannot executeSave")
            return
        }

        api.request(HTTP.Method.POST, {
            id: self.state.scriptId,
            content: self.getAceEditor().getValue()
        }, (ok) => {
            if (ok.status != 200) {
                ok.json((wow) => {
                    self.appendLog(wow["msg"])
                }, (jsonErr) => {
                    self.appendLog(jsonErr)
                })
            } else {
                self.appendLog("saved")
            }

        }, (fail) => {
            self.appendLog(fail)
        })

    }

    async executeQuery() {
        this.commandGroup.setState({loading:true})
        this.jobName = uuidv4()        
        const api = new ActionProxy()
        const self = this
        self.getMessageBoxAceEditor().setValue("")
        self.getDisplay().update(JSON.parse("[]"))

        const select = self.getSelection()
        let finalSQL = self.getAllText()


        if (select !== '') {
            finalSQL = select
        }

        const scriptId = self.state.scriptId
        this.queryLog()

        const res = await api.runScript(finalSQL, this.jobName, {
            scriptId: scriptId,
            runMode: "python",
            executeMode: "python"
        })
        
        if (res.status !== 200) {
            this.cancelQueryLog()
            this.appendLog(res.content) 
            this.commandGroup.setState({loading:false})           
            return
        }
        try {
            this.appendLog(res.content.join("\n"))
        }catch(ex){
            this.appendLog(res.content["msg"])
        }
        
        this.commandGroup.setState({loading:false})
    }

    async cancelQuery() {
        if (!this.jobName) return
        const jobName = uuidv4()
        const api = new ActionProxy()
        const res = await api.runScript("!kill " + this.jobName+";", jobName, {})                        
        try {
            this.appendLog(res.content[0]['description'])                
        }catch(e){
            this.appendLog(res.content)
        }
        
        this.jobName = null
        this.cancelQueryLog()
    }

    async cancelQueryLog(){
        if(this.intervalTimer){
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
        }
    }

    async queryLog() {    
        this.cancelQueryLog()
        this.intervalTimer = setInterval(async () => {
            const jobName = uuidv4()
            const api = new ActionProxy()
            console.log(`load _mlsql_.\`log/${this.log['offset']}\` where filePath="engine_log" as output;`)
            const res = await api.runScript(`load _mlsql_.\`log/${this.log['offset'] || -1}\` where filePath="engine_log" as output;`, jobName, {})
            const jsonObj = res.content[0]    
            if (jsonObj['value'].length > 0) {
                this.appendLog(jsonObj['value'].map(item=>{
                    return item.split("__MMMMMM__")[1]
                }).join("\n"))
            }
            this.log['offset'] = jsonObj["offset"]
        },2000)        
    }

    getAllText = () => {
        return this.getAceEditor().getValue()
    }

    getSelection = () => {
        let selectionRange = this.getAceEditor().getSelectionRange()
        let content = this.getAceEditor().session.getTextRange(selectionRange);
        return content
    }

    appendToEditor = (str) => {
        const editor = this.getAceEditor()
        const p = editor.getCursorPosition()
        editor.session.insert(p, str)
        editor.focus();
    }

    getAceEditor = () => {
        return this.aceEditorRef.editor
    }

    getMessageBoxAceEditor = () => {
        return this.queryApp.messageBox.current.editor
    }

    appendLog = (msg) => {
        const editor = this.getMessageBoxAceEditor()
        const session = editor.session
        session.insert({
            row: session.getLength(),
            column: 0
        }, "\n" + msg)
    }

    getDashBoard = () => {
        return this.queryApp.dash.current
    }

    getDisplay = () => {
        return this.queryApp.display.current
    }

    render() {
        const self = this
        return (
            <div className="mlsql-editor-area">

                <div onDragOver={(evt) => evt.preventDefault()} onDrop={this.etOver}>
                    <Resizable defaultSize={{ height: "500px" }} onResize={() => { this.aceEditorRef.current.editor.resize(); }}><AceEditor
                        ref={item => this.aceEditorRef=item}
                        mode={this.language}
                        theme="github"
                        width={"100%"}
                        height={"100%"}
                        onChange={this.onChange}
                        name="mlsql_editor"
                        fontSize={16}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        editorProps={{
                            $blockScrolling: Infinity
                        }}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
                            autoScrollEditorIntoView: true
                        }}
                    /></Resizable>
                </div>

                <CommandGroup ref={item => this.commandGroup=item} parent={this} />
            </div>
        )
    }

}

class CommandGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loading: false, timeout: "-1" }
        this.parent = props.parent
    }

    onChange = (value) => {
        this.setState({ timeout: value })
    }
    

    render() {
        return (
            <div className="mslql-editor-buttons">
                <Button onClick={this.parent.executeQuery}
                    loading={this.state.loading}>Run</Button>
                <Button onClick={this.parent.cancelQuery}>Cancel</Button>
                <Button onClick={this.parent.executeSave}>Save</Button>

            </div>
        )
    }

}


export default PythonACE

