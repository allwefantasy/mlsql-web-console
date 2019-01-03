import * as React from "react";
import brace from 'brace';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';

import './MLSQLAceEditor.scss'
import {Button, Intent} from "@blueprintjs/core";
import {MLSQLAPI} from "../service/MLSQLAPI";
import * as BackendConfig from "../service/BackendConfig";
import * as HTTP from "../service/HTTPMethod";
import {MLSQLAuth as Auth} from "../user/MLSQLAuth";


class MLSQLAceEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {"value": ""}
        this.queryApp = this.props.parent
        this.aceEditorRef = React.createRef();
    }

    text = (value, scriptId) => {
        this.setState({value: value, scriptId: scriptId})
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
        const api = new MLSQLAPI(BackendConfig.RUN_SCRIPT)
        const self = this

        const select = self.getSelection()
        let finalSQL = self.getAllText()
        if (select != '') {
            finalSQL = select
        }
        const auth = new Auth()
        auth.userName((userName) => {
            api.request(HTTP.Method.POST, {sql: finalSQL, owner: userName}, (ok) => {
                ok.json((wow) => {
                    //render table
                    self.getDisplay().update(wow)
                })
            }, (fail) => {
                fail.value().content((str) => {
                    self.getMessageBoxAceEditor().setValue(str)
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
                    value={self.state.value}
                    highlightActiveLine={true}
                    editorProps={{$blockScrolling: true}}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                /></div>
                <div className="mslql-editor-buttons"><Button intent={Intent.PRIMARY}
                                                              onClick={this.executeQuery}>运行</Button><Button
                    intent={Intent.PRIMARY}
                    onClick={this.executeSave}>保存</Button></div>
            </div>
        )
    }

}

export default MLSQLAceEditor

