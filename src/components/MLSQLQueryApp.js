import React, {Component} from 'react';
import MLSQLAceEditor from './MLSQLAceEditor'
import {ScriptNodeTree} from './MLSQLTreeNode'
import './MLSQLQueryApp.scss'
import AceEditor from "react-ace";
import {MLSQLQueryDisplay} from "./MLSQLQueryDisplay";
import {MLSQLDash} from "./query/MLSQLDash";
import {TabEditor} from "./editor/TabEditor";
import {MLSQLETQuick} from "./et/MLSQLETQuick";

class MLSQLQueryApp extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.state = {sqlContent: ""}
        this.directoryTree = React.createRef()
        this.editorGroup = React.createRef()
        this.messageBox = React.createRef()
        this.display = React.createRef()
        this.dash = React.createRef()
        this.etRef = React.createRef()

        // key is script id
        // value is editor ref
        this.fileToEditorMap = {}

    }

    openExistsOrNewEditor = (script) => {
        const self = this

        if (this.fileToEditorMap.hasOwnProperty(script.id)) {
            const editorRef = this.fileToEditorMap[script.id]
            editorRef.ref.text(script.content, script.id)
            this.editorGroup.current.onChange(editorRef.activeKey)

        } else {
            // if (!Object.values(this.fileToEditorMap).includes(this.getCurrentEditor())) {
            //
            //     //close current window
            //     this.editorGroup.current.remove(this.getCurrentEditor().activeKey)
            //
            //     const editorRef = this.getCurrentEditor()
            //     editorRef.ref.text(script.content, script.id)
            //     self.fileToEditorMap[script.id] = editorRef.ref
            //     const activeKey = editorRef.activeKey
            //
            //
            // }
            this.editorGroup.current.addFull(script.name, (editorRef) => {
                editorRef.ref.text(script.content, script.id)
                self.fileToEditorMap[script.id] = editorRef
            })

        }
    }

    closeEditor = (editorRef) => {
        const tempFileToEditorMap = Object.keys(this.fileToEditorMap).filter(key => {
            return this.fileToEditorMap[key].activeKey !== editorRef.activeKey
        }).reduce((pre, key) => {
            pre[key] = this.fileToEditorMap[key]
            return pre
        }, {})
        this.fileToEditorMap = tempFileToEditorMap
    }

    getCurrentEditor = () => {
        return this.editorGroup.current.getCurrentEditor()
    }


    setData = (data) => {
        this.queryResData = data
        this.dash.current.refresh()
    }

    render() {
        return (
            <div className="mlsql-queryapp">

                <div className="mlsql-directory-tree">
                    <ScriptNodeTree ref={this.directoryTree} parent={this}/>
                </div>
                <div className="mlsql-editor">
                    <div style={{marginBottom: "10px"}}>
                        <MLSQLETQuick ref={this.etRef} parent={this}/>
                    </div>
                    <TabEditor ref={this.editorGroup} parent={this}/>
                    <div className="mlsql-messagebox">
                        <AceEditor
                            height={"300px"}
                            width={"100%"}
                            ref={this.messageBox}
                            mode="text"
                            theme="github"
                            name="message_box"
                        />
                    </div>
                    <div>
                        <MLSQLDash ref={this.dash} parent={this}/>
                    </div>
                    <div className="mlsql-query-display">
                        <MLSQLQueryDisplay ref={this.display} parent={this}/></div>
                </div>
            </div>
        )
    }
}

export default MLSQLQueryApp