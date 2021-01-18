import React from 'react'
import { Icon } from '@ant-design/compatible';
import {Button} from "antd";
import styled from 'styled-components';

const NewButton = styled.button`
  margin: 10px 10px;  
`;
export default class CommandGroup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {isExecute: false}
        this.executeUnit= props.executeUnit
        this.notebook = props.executeUnit.notebook
    }

    evtExecute = () => {
        this.setState({isExecute: true})
        this.executeUnit.execute()
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