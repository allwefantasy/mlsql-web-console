import React from 'react'
import AceEditor from "react-ace";

/**
 * onLoad(editor){
  // Your editor options comes here
   editor.on('change', (arg, activeEditor) => {
      const aceEditor = activeEditor;
      const newHeight = aceEditor.getSession().getScreenLength() *
        (aceEditor.renderer.lineHeight + aceEditor.renderer.scrollBar.getWidth());
       aceEditor.container.style.height = `${newHeight}px`;
      aceEditor.resize();
    });
}
 */
export default class CodeBlock extends React.Component {

    originalEditor = () => {
        return this.editor.editor
    }

    componentDidMount() {
        this.originalEditor().container.style.lineHeight = 3
    }

    render() {
        return (
            <AceEditor
                maxLines={Infinity}
                width={"100%"}
                ref={et => {
                    this.editor = et
                }}
                mode="sql"
                theme="github"

            />
        )
    }
}