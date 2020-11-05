import * as React from "react";
import brace from 'brace';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import CodeIntellegence from '../v1/service/CodeIntellegence'

import './MLSQLAceEditor.scss'
import {Button, Tooltip, Progress, Divider} from 'antd';
import {MLSQLAPI} from "../service/MLSQLAPI";
import * as BackendConfig from "../service/BackendConfig";
import {assert} from "../common/tool"
import {ButtonToCommand} from "./et/ButtonToCommand";
import {Select} from 'antd';
import {Resizable} from "re-resizable";
import EditorOp from "../v1/comp_op/EditorOp";
import AsyncExecuter from "../v1/async_execute/AsyncExecuter";
import JobProgress from "../v1/async_execute/JobProgress";
import ResourceProgress from "../v1/async_execute/ResourceProgress";
import { EngineSelectComp } from "../v1/app_console/pages/EngineSelectComp";

const {Option} = Select;

const uuidv4 = require('uuid/v4');


class MLSQLAceEditor extends React.Component {

    constructor(props) {
        super(props)
        this.language = this.props.language || "sql"
        this.queryApp = this.props.parent
        this.aceEditorRef = React.createRef()
        this.commandGroup = React.createRef()        
        
        this.taskProgressRef = React.createRef()

        this.cancelQuery = this.cancelQuery.bind(this)
        this.executeQuery = this.executeQuery.bind(this)

        this.state = {value: "", loading: false}
    }

    text = (value, scriptId) => {
        this.setState({value: value, scriptId: scriptId}, () => {
            this.aceEditorRef.current.editor.setValue(value, 1)
        })

    }

    componentDidMount() {
        if (this.props.parentCallback) {
            this.props.parentCallback(this)
        }

        var staticWordCompleter = {
            getCompletions: async function(editor, session, pos, prefix, callback) {
                var wordList = await CodeIntellegence.getSuggestList(editor.getValue(),pos.row,pos.column)
                callback(null, wordList.map(function(word) {
                    let desc = ""
                    if("desc" in word.extra){
                        desc= word.extra["desc"]
                    }
                    return {
                        caption: word.name,
                        value: word.name,
                        meta: desc
                    };
                }));
        
            }
        }
        this.getAceEditor().completers = [staticWordCompleter]
    }

    onChange(newValue) {

    }

     executeSave = async ()=>{
        const executor = new AsyncExecuter(this)
        const res = await executor.saveFile({})
        return res  
    }

    async executeQuery(){
        if(this.executor && !this.executor.closed){
            this.log(`Job ${this.jobName} is still running.`)
            this.log(`Try to kill this job or wait it to finish`)
            return
        }
        this.executor = new AsyncExecuter(this)
        const res = await this.executor.run({})
        if(!this.executor.closed){
            this.executor.closed = true
        }
        return res
    }

    async cancelQuery() {
       if(this.executor){
          this.executor.killJob()
       } 
    }

    getAllText = () => {
        return this.getAceEditor().getValue()
    }

    getSelection = () => {
        return this.getEditorOp().getSelection()
    }

    appendToEditor = (str) => {
        return this.getEditorOp().insertAfterCursor(str)
    }

    getEditorOp=()=>{
        return new EditorOp(this.aceEditorRef.current)
    }

    getConsoleOp=()=>{
        return new EditorOp(this.queryApp.messageBox.current) 
    }

    getAceEditor = () => {
        return this.getEditorOp().editor
    }

    getMessageBoxAceEditor = () => {
        return this.getConsoleOp().editor
    }

    appendLog = (msg) => {
        return this.getConsoleOp().append(msg)
    }

    getDashBoard = () => {
        return this.queryApp.dash.current
    }

    getDisplay = () => {
        return this.queryApp.display.current
    }

    enterLoading = (jobName) => {
        this.commandGroup.current.setState({loading: true});
        this.resourceProgressRef.current.enter({jobName: jobName})
        this.jobProgressRef.enter({jobName: jobName})
        //this.taskProgressRef.current.enter({jobName: jobName})
    }

    exitLoading = () => {
        this.commandGroup.current.setState({loading: false});
        this.jobProgressRef.exit()
        this.resourceProgressRef.current.exit()
        //this.taskProgressRef.current.exit()
    }
    etOver = (evt) => {
        const et = this.queryApp.etRef.current
        const eventName = et.getData("eventName")
        const popName = et.getData("popName")
        const processType = et.getData("processType")
        const pathAlias = et.getData("pathAlias")
        const tableHidden = et.getData("tableHidden")
        const pathHidden = et.getData("pathHidden")
        const outputTableHidden = et.getData("outputTableHidden")
        const outputTableAlias = et.getData("outputTableAlias")
        const tableAlias = et.getData("tableAlias")

        if (processType === "direct") {
            this.appendToEditor(new ButtonToCommand().makeSQL(eventName))
        } else {
            et.setState({
                etPop: true,
                eventName: eventName,
                popName: popName,
                processType: processType,
                pathAlias: pathAlias,
                tableHidden: tableHidden,
                pathHidden: pathHidden,
                outputTableHidden: outputTableHidden,
                outputTableAlias: outputTableAlias,
                tableAlias: tableAlias
            })
        }

    }

    render() {
        const self = this
        return (
            <div className="mlsql-editor-area">

                <div onDragOver={(evt) => evt.preventDefault()} onDrop={this.etOver}>
                    <Resizable defaultSize={{height: "500px"}} onResize={()=>{this.aceEditorRef.current.editor.resize();}}><AceEditor
                        ref={this.aceEditorRef}
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

                <CommandGroup ref={this.commandGroup} parent={this}/>            
                <JobProgress ref={(et)=>{this.jobProgressRef=et}} parent={this}></JobProgress>
                <TaskProgress ref={this.taskProgressRef} parent={this}></TaskProgress>                
            </div>
        )
    }

}

class CommandGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loading: false, timeout: "-1"}
        this.parent = props.parent
    }

    onChange = (value) => {
        this.setState({timeout: value})
    }

    render() {
        return (
            <div className="mslql-editor-buttons">
                <Button onClick={this.parent.executeQuery}
                        loading={this.state.loading}>Run</Button>
                <Button onClick={this.parent.cancelQuery}>Cancel</Button>      
                <Button onClick={this.parent.executeSave}>Save</Button>                
                Job Timeout:<Select
                onChange={this.onChange}
                style={{width: "120px"}}
            >
                <Option value="10000">10s</Option>
                <Option value="30000">30s</Option>
                <Option value="60000">60s</Option>
                <Option value="1800000">30m</Option>
                <Option value="7200000">2h</Option>
                <Option value="28800000">8h</Option>
                <Option value="-1">unlimited</Option>
            </Select>
            <Divider type="vertical"/>
            Engine:<EngineSelectComp useEngine={(engine)=>{
                this.parent.engineName = engine                
            }}/>
            </div>
        )
    }

}


class TaskProgress extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loading: false, percent: 0, successPercent: 0, mark: false}
        this.parent = props.parent
    }

    enter = (params) => {
        const self = this
        this.setState({mark: true})

        setTimeout(() => {
            if (self.state.mark) {
                self.setState({loading: true})
                self.intervalTimer = setInterval(() => {

                        if (self.taskCompute === "loading") {
                            return
                        }
                        self.taskCompute = "loading"
                        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
                        assert(params.hasOwnProperty("jobName"), "jobName is required")
                        const jobName = params["jobName"]
                        api.runScript({}, `load _mlsql_.\`jobs/${jobName}\` as output;`, (jsonArray) => {
                            self.taskCompute = "loaded"
                            const _jsonObj = jsonArray[0]
                            const jsonObj = {
                                numTasks: 0,
                                numActiveTasks: 0,
                                numCompletedTasks: 0
                            }
                            _jsonObj["activeJobs"].forEach((item) => {
                                jsonObj["numTasks"] += item["numTasks"]
                                jsonObj["numActiveTasks"] += item["numActiveTasks"]
                                jsonObj["numCompletedTasks"] += item["numCompletedTasks"]
                            })
                            self.setState({
                                percent: jsonObj.numActiveTasks / jsonObj.numTasks * 100,
                                successPercent: jsonObj.numCompletedTasks / jsonObj.numTasks * 100,
                                title: `Tasks (for all stages): Succeeded/Total:\n${jsonObj.numCompletedTasks}/${jsonObj.numTasks}(${jsonObj.numActiveTasks} running)`
                            })
                        }, (str) => {
                            self.taskCompute = "loaded"
                            try {
                                self.parent.appendLog(str)
                            } catch (e) {
                                console.log(e)
                            }
                        })

                    }
                    , 1000)
            }

        }, 1000)

    }

    exit = () => {
        this.taskCompute = "loaded"
        this.resourceCompute = "loaded"
        this.setState({loading: false, percent: 0, successPercent: 0, mark: false})
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
        }
    }

    render() {
        if (!this.state.loading) return <div></div>
        return (
            <div>{this.state.title}
                <Progress percent={this.state.percent} successPercent={this.state.successPercent}/>
            </div>
        )
    }

}

export default MLSQLAceEditor

