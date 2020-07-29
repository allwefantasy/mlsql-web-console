import * as React from "react";
import { Modal, Result, Tabs, Divider } from "antd"
import './workshop.scss'
import LeftView from "./leftview";
import SpinBox from "../SpinBox"
import { WorkshopOp } from "./WorkshopOp";
import { WorkshopAutoSql } from "./WorkshopAutoSql";
import mix from "../../common/mixin"
import { ActionProxy } from "../../backend_service/ActionProxy";
import OperateStation from "./OperateStation";
import AceEditor from 'react-ace';
import { WorkshopMessageOp } from "./WorkshopMessageOp";
import { WorkshopUIOp } from "./WorkshopUIOp";
import { Resizable } from "re-resizable";
import RealTimeViewTable from "./RealTimeViewTable";
import { RealTimeDash } from "./dash/pages/RealTimeDash";


class AnalysisWorkshop extends mix(React.Component).
    with(WorkshopOp,
        WorkshopAutoSql,
        WorkshopMessageOp,
        WorkshopUIOp) {
    static workshop = undefined
    constructor(props) {
        super(props)
        this.client = new ActionProxy()
        this.state = { tableLoading: false }
        // {tableName:...  sql:...}
        this.sqls = []
        AnalysisWorkshop.workshop = this
    }

    componentDidMount() {
        // for testing should remove
         this.newSession("delta", "public", "simpleData", { header: "true" })
    }

    operateStationView() {
        if (this.state.loadingTable) {
            return <SpinBox></SpinBox>
        }
        if (this.sessionId) {
            return <OperateStation ref={(et) => this.stationRef = et} parent={this}></OperateStation>
        } else {
            return <Result style={{ width: "100%" }}
                title="No Aanalysis Session Is Opened"
                subTitle="Right click the table in the left panel(DeltaLake/FileSystem) to begin your analysis"
            />
        }
    }

    render() {
        return <div className="ws-app">
            <div className="ws-left-pane">
                <Resizable style={{ paddingRight: "30px", borderRight: "solid" }}>
                    <LeftView ref={(et) => this.leftTreePaneRef = et} parent={this}></LeftView>
                </Resizable>
            </div>
            <div className="ws-right-pane">
                <Modal
                    title={"Message"}
                    visible={this.state.showMessage || false}
                    onCancel={this.toggleMessage}
                    onOk={this.toggleMessage}
                    cancelText="Cancel"
                    width="60%"
                    OkText="Ok"

                >
                    <AceEditor
                        height={"300px"}
                        width={"100%"}
                        mode="text"
                        theme="github"
                        name="detail_box"
                        value={this.state.consoleMessage || ""}
                    ></AceEditor>
                </Modal>
                <Modal
                    title={"Message"}
                    visible={this.state.showInfoMessage || false}
                    onCancel={() => { this.setState({ showInfoMessage: false }) }}
                    onOk={() => { this.setState({ showInfoMessage: false }) }}
                    cancelText="Cancel"
                    OkText="Ok"
                >
                    {this.state.infoMessage}
                </Modal>
                <div className="ws-operate-pane">
                    {this.operateStationView()}
                </div>
                <Divider></Divider>
                <div className="ws-table-pane">
                    <RealTimeViewTable style={{ width: "90%" }} ref={(et) => this.displayRef = et} parent={this} />
                </div>
            </div>
        </div>
    }
}
export default AnalysisWorkshop