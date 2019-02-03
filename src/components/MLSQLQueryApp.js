import React, {Component} from 'react';
import MLSQLAceEditor from './MLSQLAceEditor'
import {ScriptNodeTree} from './MLSQLTreeNode'
import './MLSQLQueryApp.scss'
import AceEditor from "react-ace";
import {MLSQLQueryDisplay} from "./MLSQLQueryDisplay";
import {MLSQLDash} from "./query/MLSQLDash";

class MLSQLQueryApp extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.state = {sqlContent: ""}
        this.directoryTree = React.createRef()
        this.editor = React.createRef();
        this.messageBox = React.createRef();
        this.display = React.createRef();

    }

    render() {
        return (
            <div className="mlsql-queryapp">

                <div className="mlsql-directory-tree">
                    <ScriptNodeTree ref={this.directoryTree} parent={this}/>
                </div>
                <div className="mlsql-editor">
                    <MLSQLAceEditor ref={this.editor} parent={this}/>
                    <div className="mlsql-messagebox">
                        <AceEditor
                            height={"100px"}
                            width={"100%"}
                            ref={this.messageBox}
                            mode="text"
                            theme="github"
                            name="message_box"
                        />
                    </div>
                    <div>
                        <MLSQLDash/>
                    </div>
                    <div className="mlsql-query-display">
                        <MLSQLQueryDisplay ref={this.display} parent={this}/></div>
                </div>
            </div>
        )
    }
}

export default MLSQLQueryApp