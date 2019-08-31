import React from 'react'
import ExecuteUnit from "./ExecuteUnit";

export default class NodeBook extends React.Component {
    constructor(props) {
        super(props)
        this.executeUnits = [<ExecuteUnit parent={this}/>]
        this.state = {executeUnits: this.executeUnits}
    }

    nextExecuteUnit = () => {
        this.executeUnits.push(<ExecuteUnit parent={this}/>)
        this.setState({executeUnits: this.executeUnits})

    }

    componentDidMount() {
        if (this.props.parentCallback) {
            this.props.parentCallback(this)
        }
    }

    text = (value, scriptId) => {
        this.setState({value: value, scriptId: scriptId}, () => {

        })

    }

    render() {
        return <div>
            {
                this.state.executeUnits
            }
        </div>
    }
}