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

const { Step } = Steps;
const StepContent = styled.div`
margin-top: 16px;
border: 1px dashed #e9e9e9;
border-radius: 6px;
background-color: #fafafa;
min-height: 200px;
text-align: center;
padding-top: 80px;
`

export default class JoinStation extends mix(React.Component).with(
    StationCommonOp
) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.state = {
            currentStep: 0,
            steps: [
                <SelectJoinTable parent={this}></SelectJoinTable>,
                <SelectJoinField parent={this}></SelectJoinField>,
                <SelectProjectFields parent={this}></SelectProjectFields>]
        }
    }

    render() {
        return <div className="join-app">
            <div className={"station-menu"}>
                <ApplyOrSave handleTableInput={this.handleTableInput} ref={(et) => this.ApplyOrSaveRef = et} onSave={this.onSave} onApply={this.onApply} style={{ marginBottom: "30px" }}></ApplyOrSave>
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