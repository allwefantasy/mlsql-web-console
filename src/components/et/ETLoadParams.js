import * as React from "react";
import {Input} from "antd";

const InputGroup = Input.Group;

export class ETLoadParams extends React.Component {
    constructor(props) {
        super(props)
        this.etPopLoad = props.parent
        this.state = {}
    }

    render() {
        return <div>
            <span>parameters:</span>
            <InputGroup compact={true}>
                {this.state.dataForRender}
            </InputGroup>
        </div>
    }
}