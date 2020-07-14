import * as React from "react";
import mix from "../../../common/mixin"
import { Form, Select, Steps } from 'antd';
import ApplyOrSave from "../ApplyOrSave";

import { StationCommonOp } from "../commonops/StationCommonOp";
import "./JoinStation.scss"
import SelectJoinField from "./SelectJoinField";
import SelectProjectFields from "./SelectProjectFields";
import SelectJoinTable from "./SelectJoinTable"
import styled from "styled-components"
import Tools from "../../../common/Tools";
import EngineService from "../../service/EngineService";

const { Step } = Steps;
const StepContent = styled.div`
border: 1px dashed #e9e9e9;
border-radius: 6px;
background-color: #fafafa;
min-height: 200px;
text-align: center;
padding-top: 80px;
width: 100%;
`

export default class JoinStation extends mix(React.Component).with(
    StationCommonOp
) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.joinInfo = { currentTable: this.workshop.currentTable }
        this.state = {
            currentStep: 0,
            steps: [
                <SelectJoinTable parent={this}></SelectJoinTable>,
                <SelectJoinField parent={this}></SelectJoinField>,
                <SelectProjectFields parent={this}></SelectProjectFields>]
        }
    }

    onApply = async () => {
        const currentTableName = this.workshop.currentTable.table
        const { joinTable, joinType, leftField, rightField, leftProjectFields, rightProjectFields } = this.joinInfo
         
        if(!leftProjectFields && !rightProjectFields){ 
            this.workshop.toggleMessage("Fields are not selected.")                                
            return
        }

        this.ApplyOrSaveRef.enter()                
        const tableRes = await EngineService.tableInfo(joinTable)        
        const joinTableInfo = tableRes.content
        const leftProjectFieldsStr = leftProjectFields.map(item => `${currentTableName}.\`${item}\``).join(",")
        const rightProjectFieldsStr = rightProjectFields.map(item => `${joinTable}.\`${item}\``).join(",")

        const leftFieldStr = `${currentTableName}.\`${leftField}\``
        const rightFieldStr = `${joinTable}.\`${rightField}\``

        const joinStr = `${joinType} ${joinTable} on ${leftFieldStr} = ${rightFieldStr}`


        let projectStr = ""
        if (leftProjectFieldsStr && rightProjectFieldsStr) {
            projectStr = leftProjectFieldsStr + "," + rightProjectFieldsStr
        }

        if (leftProjectFieldsStr && !rightProjectFieldsStr) {
            projectStr = leftProjectFieldsStr
        }

        if (!leftProjectFieldsStr && rightProjectFieldsStr) {
            projectStr = rightProjectFieldsStr
        }

        const tableName = Tools.getTempTableName()
        
        const sql = `${joinTableInfo.content} \n select ${projectStr} from ${currentTableName} ${joinStr} as ${tableName};`
        console.log(sql)
        await this.workshop.apply({ tableName, sql })
        this.ApplyOrSaveRef.exit()
        this.workshop.refreshOperateStation()
    }

    next = () => {
        this.setState({ currentStep: this.state.currentStep + 1 })
    }
    preview = () => {
        this.setState({ currentStep: this.state.currentStep - 1 })
    }

    render() {
        return <div className="join-app">
            <div className={"station-menu"}>
                <ApplyOrSave onRollback={this.onRollback}
                    handleTableInput={this.handleTableInput} ref={(et) => this.ApplyOrSaveRef = et}
                    onSave={this.onSave}
                    onApply={this.onApply}
                    style={{ marginBottom: "30px" }}></ApplyOrSave>
            </div>
            <div>
                <Steps current={this.state.currentStep}>
                    <Step key={0} title="Table" description="Choose the table you wanna join from workshop" />
                    <Step key={1} title="Join Condition " description="Choose the join condition in both tables" />
                    <Step key={2} title="Fields" description="Choose the fields you want from both tables" />
                </Steps>
            </div>
            <div className="join-app-form"> <StepContent>
                {this.state.steps[this.state.currentStep]}
            </StepContent></div>
        </div>
    }
}