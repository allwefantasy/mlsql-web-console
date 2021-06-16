import React from 'react'

import { Button, Space } from 'antd'
import { LoadingOutlined, CaretRightOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
        const {
            onAddCell,
            onRemoveCell,
            disableDelete
        } = this.props
        return <div>
            <Space>
                {
                    this.state.isExecute ? <span onClick={this.cancelExecute}><LoadingOutlined /></span> :
                        <span onClick={this.evtExecute}><CaretRightOutlined /></span>
                    
                }
                <Button type="text" icon={<PlusCircleOutlined />} onClick={onAddCell}></Button>
                <Button type="text" disabled={disableDelete} icon={<MinusCircleOutlined />} onClick={onRemoveCell}></Button>
            </Space>
        </div>
    }
}