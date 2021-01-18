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

    addBlock = ()=>{
        this.notebook.createExecuteUnitAfterCurrent(this.executeUnit)
    }

    removeBlock = ()=>{
        this.notebook.removeExecuteUnitAfterCurrent(this.executeUnit)
    }

    render() {

        return <div>
            {
                this.state.isExecute ? <NewButton onClick={this.cancelExecute}><Icon type="sync" spin/></NewButton> :
                    <NewButton onClick={this.evtExecute}><Icon type="caret-right"/></NewButton>
            }
            <NewButton onClick={this.addBlock}>+</NewButton>
            <NewButton onClick={this.removeBlock}>-</NewButton>
        </div>
    }
}