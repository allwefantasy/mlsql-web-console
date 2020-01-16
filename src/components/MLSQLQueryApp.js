import React, {Component} from 'react';
import MLSQLAceEditor from './MLSQLAceEditor'
import {ScriptNodeTree} from './MLSQLTreeNode'
import './MLSQLQueryApp.scss'
import AceEditor from "react-ace";
import {MLSQLQueryDisplay} from "./MLSQLQueryDisplay";
import {MLSQLDash} from "./query/MLSQLDash";
import {TabEditor} from "./editor/TabEditor";
import {MLSQLETQuick} from "./et/MLSQLETQuick";
import {Resizable} from "re-resizable";
import ExecuteUnit from "./notebook/ExecuteUnit";

class MLSQLQueryApp extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.state = {sqlContent: "", displayEditor: "normal"}
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
            this.editorGroup.current.addFull(script.name, (editorRef) => {
                editorRef.ref.text(script.content, script.id)
                self.fileToEditorMap[script.id] = editorRef
            })

        }

        if (script.name.endsWith(".nb")) {
            self.setState({displayEditor: "notebook"})
        }else if (script.name.endsWith(".py")) {
            self.setState({displayEditor: "pythoneditor"})
        } else {
            self.setState({displayEditor: "normal"})
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

    tableAndDash = () => {
        if (this.state.displayEditor !== "notebook" || this.state.displayEditor !== "pythoneditor") {
            return <div>
                <Resizable defaultSize={{height: "300px"}} onResize={() => {
                    this.messageBox.current.editor.resize();
                }}>
                    <AceEditor
                        height={"100%"}
                        width={"100%"}
                        ref={this.messageBox}
                        mode="text"
                        theme="github"
                        name="message_box"
                    />
                </Resizable>

                <div>
                    <MLSQLDash ref={this.dash} parent={this}/>
                </div>
                <div className="mlsql-query-display">
                    <MLSQLQueryDisplay ref={this.display} parent={this}/></div>
            </div>
        }

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
                    {this.tableAndDash()}
                </div>

            </div>
        )
    }
}

export default MLSQLQueryApp