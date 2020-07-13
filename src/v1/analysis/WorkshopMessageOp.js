import EditorOp from "../comp_op/EditorOp"
export const WorkshopMessageOp = (superclass) => class extends superclass {
    toggleMessage  = (msg)=>{
        const showMessage = this.state.showMessage
        if(showMessage){
            this.setState({showMessage:!this.state.showMessage})        
        }else {
            this.setState({showMessage:!this.state.showMessage,consoleMessage:msg})        
        }
        
    }
}