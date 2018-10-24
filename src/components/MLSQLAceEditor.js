import React, { Component } from 'react';
import brace from 'brace';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';

import './MLSQLAceEditor.scss'


class MLSQLAceEditor extends Component {
  onChange(newValue) {
    console.log('change', newValue);
  }

  render() {
    return (
      <div id="MLSQLAceEditor-editor">
        <AceEditor
          mode="sql"
          theme="github"
          onChange={this.onChange}
          name="mlsql_editor"
          fontSize={16}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
    )
  }

}
// class MLSQLMode extends ace.acequire('ace/mode/text').Mode {
  
// }
export default MLSQLAceEditor

