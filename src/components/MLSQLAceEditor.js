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
import {MLSQLAuth as Auth} from "../user/MLSQLAuth";
import {assert} from "../common/tool"

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
        this.setState({value: value, scriptId: scriptId})
        this.aceEditorRef.current.editor.setValue(value)
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

        const select = self.getSelection()
        let finalSQL = self.getAllText()


        if (select !== '') {
            finalSQL = select
        }

        const auth = new Auth()
        const startTime = new Date().getTime();

        function measureTime() {
            self.exitLoading()
            const endTime = new Date().getTime()
            return endTime - startTime
        }

        auth.userName((userName) => {

            api.request(HTTP.Method.POST, {
                sql: finalSQL,
                owner: userName,
                jobName: jobName,
                sessionPerUser: true,
                show_stack: true
            }, (ok) => {
                ok.json((wow) => {
                    //render table
                    try {
                        self.getDisplay().update(wow)
                        self.getMessageBoxAceEditor().setValue("\nTime cost:" + measureTime() + "ms")
                    } catch (e) {
                        self.getMessageBoxAceEditor().setValue("Can not display the result. raw data:\n" + JSON.stringify(wow))
                    }
                    self.exitLoading()
                }, (jsonErr) => {
                    self.exitLoading()
                    self.getMessageBoxAceEditor().setValue(jsonErr + "\nTime cost:" + measureTime() + "ms")
                })
            }, (fail) => {
                try {
                    fail.value().content((str) => {
                        self.getMessageBoxAceEditor().setValue(str + "\nTime cost:" + measureTime() + "ms")
                        self.exitLoading()
                    })
                } catch (e) {
                    console.log(fail)
                    self.exitLoading()
                }

            })
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

    getAceEditor = () => {
        return this.aceEditorRef.current.editor
    }

    getMessageBoxAceEditor = () => {
        return this.queryApp.messageBox.current.editor
    }

    getDisplay = () => {
        return this.queryApp.display.current
    }

    enterLoading = (jobName) => {
        this.commandGroup.current.setState({loading: true});
        this.resourceProgressRef.current.enter({jobName: jobName})
        this.taskProgressRef.current.enter({jobName: jobName})
    }

    exitLoading = () => {
        this.commandGroup.current.setState({loading: false});
        this.resourceProgressRef.current.exit()
        this.taskProgressRef.current.exit()
    }


    render() {
        const self = this

        return (
            <div className="mlsql-editor-area">
                <div><AceEditor
                    ref={this.aceEditorRef}
                    mode="sql"
                    theme="github"
                    width={"100%"}
                    height={"300px"}
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
                        loading={this.state.loading}>运行</Button>
                <Button onClick={this.parent.executeSave}>保存</Button>
            </div>
        )
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
                        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
                        assert(params.hasOwnProperty("jobName"), "jobName is required")
                        const jobName = params["jobName"]
                        api.runScript({}, `load _mlsql_.\`resource/${jobName}\` as output;`, (jsonArray) => {
                            const jsonObj = jsonArray[0]
                            self.setState({
                                percent: jsonObj.activeTasks / jsonObj.totalCores * 100,
                                successPercent: jsonObj.currentJobGroupActiveTasks / jsonObj.totalCores * 100,
                                title: `Resource (for all users): taken/Total: ${jsonObj.activeTasks}/${jsonObj.totalCores}(${jsonObj.currentJobGroupActiveTasks} you took)`
                            })
                        }, (str) => {
                            self.parent.getMessageBoxAceEditor().setValue(str)
                        })

                    }
                    , 2000)
            }

        }, 3000)

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
                        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
                        assert(params.hasOwnProperty("jobName"), "jobName is required")
                        const jobName = params["jobName"]
                        api.runScript({}, `load _mlsql_.\`jobs/${jobName}\` as output;`, (jsonArray) => {
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
                            self.parent.getMessageBoxAceEditor().setValue(str)
                        })

                    }
                    , 2000)
            }

        }, 3000)

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

export default MLSQLAceEditor

