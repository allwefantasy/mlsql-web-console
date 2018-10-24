import React, { Component } from 'react';
import MLSQLAceEditor from './MLSQLAceEditor'
import { Button, Intent, Spinner } from "@blueprintjs/core";
import MLSQLTreeNode from './MLSQLTreeNode'
import './MLSQLQueryApp.scss'
class MLSQLQueryApp extends Component {

  render() {
    return (
      <div className="mlsql-queryapp">
        <MLSQLTreeNode />
        <MLSQLAceEditor />
        <div>
          <Button intent={Intent.PRIMARY}>运行</Button>
        </div>
      </div >
    )
  }
}
export default MLSQLQueryApp