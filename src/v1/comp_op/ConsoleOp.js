export default class  ConsoleOp{
  constructor(consoleComp){
     this.inner = consoleComp 
     this.session = this.inner.editor.session
     this.editor = this.inner.editor    
  }

  setText(msg){
      this.editor.setValue(msg)
      return this
  }

  append(msg){
    this.session.insert({
        row: this.session.getLength(),
        column: 0
    }, "\n" + msg)
    return this
  }

  insertAfterCursor(msg){
    const p = this.editor.getCursorPosition()
    this.session.insert(p, msg)
    this.editor.focus()
    return this
  }
}