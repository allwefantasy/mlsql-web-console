import React, {Component} from 'react';
import MLSQLAceEditor from './MLSQLAceEditor'
import {ScriptNodeTree} from './MLSQLTreeNode'
import './MLSQLQueryApp.scss'

class MLSQLQueryApp extends Component {

    render() {
        return (
            <div className="mlsql-queryapp">
                <ScriptNodeTree/>
                <MLSQLAceEditor/>
            </div>
        )
    }
}

export default MLSQLQueryApp