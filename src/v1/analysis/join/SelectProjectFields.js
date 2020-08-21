import * as React from "react";
import SelectFields from "../project/SelectFields"
import EngineService from "../../service/EngineService";
import { Button, Form } from "antd";

export default class SelectProjectFields  extends React.Component{
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop        
        this.joinStation = props.parent
        this.currentTable = this.joinStation.joinInfo.currentTable.table        
        this.joinTable = this.joinStation.joinInfo.joinTable
        this.state = {
            currentTableFields:[],
            joinTableFields:[] 
        }
    }

    reload = async () => {
        const currentTableSchema = this.joinStation.joinInfo.currentTable.schema                
        const joinTable = await EngineService.tableInfo(this.joinTable)    
        if (joinTable.status === 200) {
            this.setState({
                currentTableFields: currentTableSchema.fields,
                joinTableFields: JSON.parse(joinTable.content.tableSchema).fields
            })            
        }
    }

    componentDidMount = async () => {
        await this.reload()
    }
    
    handleLeft = (targetKeys)=>{        
        this.joinStation.joinInfo = Object.assign(this.joinStation.joinInfo, {
            leftProjectFields: targetKeys.targetKeys
        })        
    }

    handleRight = (targetKeys)=>{                
        this.joinStation.joinInfo = Object.assign(this.joinStation.joinInfo, {
            rightProjectFields:targetKeys.targetKeys
        })        
    }

    reset = ()=>{
        this.joinStation.parent.reload()
    } 

    render = () => {        
        return <Form  labelCol={ { span: 6 }}>            
            <Form.Item name="leftProjectFields" label="currentTable">
            <SelectFields handleChange={this.handleLeft} schemaFields={this.state.currentTableFields} ref={(et) => this.leftProjectFields = et} parent={this}></SelectFields>
            </Form.Item>
                        
            <Form.Item name="rightProjectFields" label={this.joinTable+""}>
            <SelectFields  handleChange={this.handleRight}  schemaFields={this.state.joinTableFields} ref={(et) => this.rightProjectFields = et} parent={this}></SelectFields>
            </Form.Item>
            
            <Form.Item>            
            <Form.Item> <Button danger>Reset</Button></Form.Item>
            </Form.Item>
        </Form>
    }
}