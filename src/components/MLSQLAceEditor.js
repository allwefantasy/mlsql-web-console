import * as React from "react";
import brace from 'brace';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';

import './MLSQLAceEditor.scss'
import 'antd/dist/antd.css';
import {Button, Tooltip, Progress} from 'antd';
import {MLSQLAPI} from "../service/MLSQLAPI";
import * as BackendConfig from "../service/BackendConfig";
import * as HTTP from "../service/HTTPMethod";
import {assert} from "../common/tool"
import {ButtonToCommand} from "./et/ButtonToCommand";

const uuidv4 = require('uuid/v4');


class MLSQLAceEditor extends React.Component {

    constructor(props) {
        super(props)
        this.queryApp = this.props.parent
        this.aceEditorRef = React.createRef()
        this.commandGroup = React.createRef()
        this.resourceProgressRef = React.createRef()
        this.taskProgressRef = React.createRef()
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
            messageBox.setValue("saved")
        }, (fail) => {
        })

    }

    executeQuery = () => {
        const jobName = uuidv4()

        this.enterLoading(jobName)
        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
        const self = this
        self.getMessageBoxAceEditor().setValue("")
        self.getDisplay().update(JSON.parse("[]"))

        const select = self.getSelection()
        let finalSQL = self.getAllText()


        if (select !== '') {
            finalSQL = select
        }

        const startTime = new Date().getTime();

        function measureTime() {
            self.exitLoading()
            const endTime = new Date().getTime()
            return endTime - startTime
        }

        api.runScript({jobName: jobName, background: (this.state.background || false)}, finalSQL, (wow) => {
            try {
                self.queryApp.setData(wow)
                self.getDisplay().update(wow)
                self.appendLog("\nTime cost:" + measureTime() + "ms")
            } catch (e) {
                console.log(e)
                self.appendLog("Can not display the result. raw data:\n" + JSON.stringify(wow, null, 2))
            }
            self.exitLoading()

        }, (fail) => {
            self.exitLoading()
            let failRes = fail.toString()
            try {
                failRes = JSON.parse(failRes)["msg"]
            } catch (e) {
            }
            self.appendLog(failRes + "\nTime cost:" + measureTime() + "ms")
        })

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
        return this.aceEditorRef.current.editor
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

    enterLoading = (jobName) => {
        this.commandGroup.current.setState({loading: true});
        //this.resourceProgressRef.current.enter({jobName: jobName})
        //this.taskProgressRef.current.enter({jobName: jobName})
        this.logProgress = new LogProgress(this)
        this.logProgress.enter()
    }

    exitLoading = () => {
        this.commandGroup.current.setState({loading: false});
        //this.resourceProgressRef.current.exit()
        //this.taskProgressRef.current.exit()
        if (this.logProgress) {
            this.logProgress.exit()
        }
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
                <div onDragOver={(evt) => evt.preventDefault()} onDrop={this.etOver}><AceEditor
                    ref={this.aceEditorRef}
                    mode="sql"
                    theme="github"
                    width={"100%"}
                    height={"500px"}
                    onChange={this.onChange}
                    name="mlsql_editor"
                    fontSize={16}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value=""
                    editorProps={{
                        $blockScrolling: Infinity
                    }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                /></div>
                <CommandGroup ref={this.commandGroup} parent={this}/>
                <ResourceProgress ref={this.resourceProgressRef} parent={this}></ResourceProgress>
                <TaskProgress ref={this.taskProgressRef} parent={this}></TaskProgress>
            </div>
        )
    }

}

class CommandGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loading: false}
        this.parent = props.parent
    }

    render() {
        return (
            <div className="mslql-editor-buttons">
                <Button onClick={this.parent.executeQuery}
                        loading={this.state.loading}>Run</Button>
                <Button onClick={this.parent.executeSave}>Save</Button>
            </div>
        )
    }

}

class LogProgress {
    constructor(msgBox) {
        this.msgBox = msgBox
        this.logProgress = "loaded"
    }

    enter = (params) => {
        const self = this
        this.mark = true
        this.offset = -1
        setTimeout(() => {
            if (self.mark) {
                self.loading = true
                self.intervalTimer = setInterval(() => {
                        if (self.logProgress === "loading") {
                            return
                        }
                        self.logProgress = "loading"
                        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)

                        api.runScript({}, `load _mlsql_.\`log/${self.offset}\` where filePath="/tmp/__mlsql__/logs/mlsql_engine.log" as output;`, (jsonArray) => {
                            const jsonObj = jsonArray[0]
                            if (jsonObj['value'].length > 0) {
                                this.msgBox.appendLog(jsonObj['value'].join("\n"))
                            }
                            self.offset = jsonObj["offset"]
                            self.logProgress = "loaded"
                        }, (str) => {
                            self.logProgress = "loaded"
                            try {
                                this.msgBox.appendLog(str)
                            } catch (e) {
                                console.log(e)
                            }

                        })

                    }

                    , 2000)
            }

        }, 3000)

    }

    exit = () => {
        // we should wait some seconds since the log sometimes may delayed.
        const self = this
        setTimeout(() => {
            self.loading = false
            self.mark = false
            if (self.intervalTimer) {
                clearInterval(self.intervalTimer);
            }
        }, 5000)

    }

}

class ResourceProgress extends React.Component {
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
                            if (self.resourceCompute === "loading") {
                                return
                            }
                            self.resourceCompute = "loading"
                            const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
                            assert(params.hasOwnProperty("jobName"), "jobName is required")
                            const jobName = params["jobName"]
                            api.runScript({},
                                `load _mlsql_.\`resource/${jobName}\` as output;`, (jsonArray) => {
                                    const jsonObj = jsonArray[0]
                                    self.setState({
                                        percent: jsonObj.activeTasks / jsonObj.totalCores * 100,
                                        successPercent: jsonObj.currentJobGroupActiveTasks / jsonObj.totalCores * 100,
                                        title: `Resource (for all users): taken/Total: ${jsonObj.activeTasks}/${jsonObj.totalCores}(${jsonObj.currentJobGroupActiveTasks} you took)`
                                    })
                                    self.resourceCompute = "loaded"
                                }, (str) => {
                                    self.resourceCompute = "loaded"
                                    try {
                                        self.parent.appendLog(str)
                                    } catch (e) {
                                        console.log(e)
                                    }

                                })

                        }
                        ,
                        30000
                    )
                }

            }

            ,
            3000
        )

    }

    exit = () => {
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
                    , 30000)
            }

        }, 3000)

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

