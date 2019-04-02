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