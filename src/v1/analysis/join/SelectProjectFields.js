import * as React from "react";
import SelectFields from "../project/SelectFields"

export default class SelectProjectFields  extends React.Component{
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.state = {
            
        }
    }

    render = () => {
        return <div>
            <div>Table A:</div>
            <SelectFields ref={(et) => this.selectFieldsRef = et} parent={this}></SelectFields>
            <div>Table B:</div>
            <SelectFields ref={(et) => this.selectFieldsRef = et} parent={this}></SelectFields>
        </div>
    }
}