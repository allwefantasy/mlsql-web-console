import React from 'react'
import {Icon} from "antd";

export default class CommandGroup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {isExecute: false, executeUnit: props.executeUnit}
    }

    evtExecute = () => {
        this.setState({isExecute: true})
        this.state.executeUnit.execute()
        this.setState({isExecute: false})
    }

    cancelExecute = () => {
        this.setState({isExecute: false})
    }

    render() {
        return <div>
            {
                this.state.isExecute ? <span onClick={this.cancelExecute}><Icon type="sync" spin/></span> :
                    <span onClick={this.evtExecute}><Icon type="caret-right"/></span>
            }
        </div>
    }
}