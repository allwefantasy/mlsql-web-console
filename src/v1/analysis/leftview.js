import * as React from "react";
import { Tabs } from 'antd';
import AFileSystemTree from "./AFileSystemTree";
import ADeltaLakeTree from "./ADeltaLakeTree";
import "./leftview.scss"
import { FormattedMessage } from 'react-intl'
import { WorkshopTables } from "./workshop_tables/WorkshopTables";
import { HiveTables } from "./hive/HiveTables";

const { TabPane } = Tabs;
export default class LeftView extends React.Component {
    constructor(props) {
        super(props)
        this.workshop = props.parent
        this.state = {
            reloaWorkshop: undefined
        }
    }


    render() {
        return <Tabs defaultActiveKey="1" onTabClick={(key) => {
            if (key === "3") {
                if (this.deltaLakeTreeRef) {
                    this.deltaLakeTreeRef.reload()
                }
            }
            if (key === "4") {
                if (this.fileSystemTreeRef) {
                    this.fileSystemTreeRef.reload()
                }
            }
        }}>
            <TabPane tab={<FormattedMessage id="table_workshop" />} key="1">
                <div className="leftview-box" >
                    <WorkshopTables reload={this.state.reloaWorkshop} workshop={this.workshop}></WorkshopTables>
                </div>
            </TabPane>

            <TabPane tab={<FormattedMessage id="hive" />} key="2">
                <div className="leftview-box" >
                    <HiveTables/>
                </div>
            </TabPane>

            <TabPane tab={<FormattedMessage id="delta_lake" />} key="3">
                <div className="leftview-box" >
                    <ADeltaLakeTree ref={(et) => this.deltaLakeTreeRef = et} parent={this}></ADeltaLakeTree>
                </div>
            </TabPane>
            <TabPane tab={<FormattedMessage id="file_system" />} key="4">
                <div className="leftview-box">
                    <AFileSystemTree ref={(et) => this.fileSystemTreeRef = et} parent={this}></AFileSystemTree>
                </div>
            </TabPane>

        </Tabs>
    }
}