import * as React from "react";
import {  Form,  Select } from 'antd';
import Tools from "../../../common/Tools";
export default class ApplyGroup extends React.Component {
    constructor(props) {
        super(props)
        this.fitlerStation = props.parent
        this.workshop = props.parent.workshop        
        this.state = this.wow(props)        
    }

    reload = (data)=>{
       this.setState({...this.wow(data)}) 
    }
      
    wow = (props) => {        
        const fields = Object.keys(props.data).map(item => { return { groupName: item } })

        const data = fields.map(item => {
            return { key: item.groupName, groupName: item.groupName }
        })              
        return { data,refresh:Math.random()}
    }

    onChange = (value) => {
        this.groupName = value
    }

    render = () => {

        return <div >
            <Form key={this.state.refresh}>                
                <Form.Item label="Select group name to apply:">
                    <Select onChange={this.onChange} >
                        {this.state.data.map(item => {                            
                            return <Select.Option key={item.key} value={item.groupName}>
                                {item.groupName}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    }
}