import ConsoleOp from "./ConsoleOp";

export default class EditorOp extends ConsoleOp{
    constructor(comp){
      super(comp)
    }
    getText() {
        return this.editor.getValue()
    }

    getSelection(){
        let selectionRange = this.editor.getSelectionRange()
        let content = this.session.getTextRange(selectionRange);
        return content
    }
}