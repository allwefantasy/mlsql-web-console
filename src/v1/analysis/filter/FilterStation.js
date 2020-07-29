import * as React from "react";
import { Tabs, Divider } from 'antd';
import ApplyOrSave from "../ApplyOrSave";
import '../common.scss'
import mix from "../../../common/mixin"
import { StationCommonOp } from "../commonops/StationCommonOp";
import Compare from "./Compare"
import GroupGroup from "./GroupGroup";
import ApplyGroup from "./ApplyGroup";
import Tools from "../../../common/Tools";
import { buildExpression } from "./FilterCondition";

const { TabPane } = Tabs;


export default class FilterStation extends mix(React.Component).with(StationCommonOp) {
    constructor(props) {
        super(props)
        this.workshop = props.parent.workshop
        this.conGroups = {}
        this.currentConditions = {}
    }

    static buildCondition = (items) => {
        return items.map(item => {
            return buildExpression(item)
        })
    }

    onNonGroupFilterApply = async (selectedRows) => {
        if (selectedRows.length === 0) {
            this.workshop.showInfo("Please select fields")
            return
        }
        const filterStr = selectedRows.flatMap(item => {
            return FilterStation.buildCondition([item])
        }).join(" and ")

        this.ApplyOrSaveRef.enter()
        const tableName = Tools.getTempTableName()
        const sql = `select * from ${this.workshop.getLastApplyTable().tableName} 
        where ${filterStr}
        as ${tableName};`

        await this.workshop.apply({ tableName, sql })
        this.ApplyOrSaveRef.exit()
        // this.workshop.refreshOperateStation()
    }
    onFilterApply = async () => {
        const groupName = this.applyGroup.groupName
        if (!groupName) {
            this.workshop.showInfo("Choose the group name to apply.")
            return
        }
        const group = this.conGroups[groupName]

        function buildFilter(group) {
            if (group.tp === "basic") {
                if (group.groupType === "and") {
                    return `(${FilterStation.buildCondition(group.data).join(" and ")})`
                } else return `(${FilterStation.buildCondition(group.data).join(" or ")})`
            } else {
                if (group.groupType === "and") {
                    const temp = group.data.flatMap(item => {
                        return buildFilter(item)
                    }).join(" and ")
                    return `(${temp})`
                } else {
                    const temp = group.data.flatMap(item => {
                        return buildFilter(item)
                    })
                    return `(${temp.join(" or ")})`
                }

            }

        }
        const filterStr = buildFilter(group)

        this.ApplyOrSaveRef.enter()
        const tableName = Tools.getTempTableName()
        const sql = `select * from ${this.workshop.getLastApplyTable().tableName} 
        where ${filterStr}
        as ${tableName};`

        await this.workshop.apply({ tableName, sql })
        this.ApplyOrSaveRef.exit()
        //this.workshop.refreshOperateStation()
    }

    render() {
        return <div>
            <div className={"station-menu"}>
                <Tabs defaultActiveKey="1" className={"station-tabs"}>

                    <TabPane tab="Add Conditions to Group" key="1">
                        <Compare ref={(et) => this.compare = et} parent={this} schemaFields={this.workshop.currentTable.schema.fields}></Compare>
                    </TabPane>
                    <TabPane tab="Apply Group" key="2">
                        <ApplyOrSave parent={this} onRollback={this.onRollback} handlePersit={this.handlePersit} handleTableInput={this.handleTableInput} ref={(et) => this.ApplyOrSaveRef = et} onSave={this.onSave} onApply={this.onFilterApply} style={{ marginBottom: "30px" }}></ApplyOrSave>
                        <Divider />
                        <ApplyGroup ref={(et) => this.applyGroup = et} parent={this} data={this.conGroups}></ApplyGroup>
                    </TabPane>
                    <TabPane tab="Add Groups to Group" key="3">
                        <GroupGroup ref={(et) => this.groupGroup = et} parent={this} data={this.conGroups}></GroupGroup>
                    </TabPane>

                </Tabs>
            </div>
            <div>

            </div>
        </div>
    }
}