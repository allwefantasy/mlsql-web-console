export const WorkshopMessageOp = (superclass) => class extends superclass {
    toggleMessage  = ()=>{
        this.setState({showMessage:!this.state.showMessage})
    }
}