import React, { Component } from 'react';
import MLSQLAceEditor from './MLSQLAceEditor'
import { Button, Intent, Spinner } from "@blueprintjs/core";
class MLSQLQueryApp extends Component {

  render() {
    return (
      <div>
        <MLSQLAceEditor />
        <div>
          <Button intent={Intent.PRIMARY}>运行</Button>
        </div>
      </div >
    )
  }
}
export default MLSQLQueryApp