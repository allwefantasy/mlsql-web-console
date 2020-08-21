import React from 'react'
import PythonACE from './PythonACE';


export default class PythonEditor extends React.Component {
    constructor(props) {
        super(props)    
        this.queryApp = this.props.parent
    }

    addRef = (instance) => {  
        if(instance){
            this.editor = instance
        }      
    }
    

    componentDidMount() {
        if (this.props.parentCallback) {
            this.props.parentCallback(this)
        }
    }    

    text = (value, scriptId) => {        
        this.editor.text(value, scriptId)     
    }
    

    render() {
        return <div>
            <PythonACE parent={this} ref={et => this.addRef(et)} language="python"></PythonACE>
        </div>
    }
}