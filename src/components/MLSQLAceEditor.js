import * as React from "react";
import brace from 'brace';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';

import './MLSQLAceEditor.scss'
import 'antd/dist/antd.css';
import {Button} from 'antd';
import {MLSQLAPI} from "../service/MLSQLAPI";
import * as BackendConfig from "../service/BackendConfig";
import * as HTTP from "../service/HTTPMethod";
import {MLSQLAuth as Auth} from "../user/MLSQLAuth";

const uuidv4 = require('uuid/v4');


class MLSQLAceEditor extends React.Component {

    constructor(props) {
        super(props)
        this.queryApp = this.props.parent
        this.aceEditorRef = React.createRef()
        this.commandGroup = React.createRef()
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
        this.enterLoading()
        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
        const self = this
        self.getMessageBoxAceEditor().setValue("")

        const select = self.getSelection()
        let finalSQL = self.getAllText()

        const jobName = uuidv4()
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

                }, (jsonErr) => {
                    self.getMessageBoxAceEditor().setValue(jsonErr + "\nTime cost:" + measureTime() + "ms")
                })
            }, (fail) => {
                fail.value().content((str) => {
                    self.getMessageBoxAceEditor().setValue(str + "\nTime cost:" + measureTime() + "ms")
                })

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

    enterLoading = () => {
        this.commandGroup.current.setState({loading: true});
    }

    exitLoading = () => {
        this.commandGroup.current.setState({loading: false});
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

export default MLSQLAceEditor

