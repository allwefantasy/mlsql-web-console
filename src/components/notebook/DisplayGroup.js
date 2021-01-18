import React from 'react'
import DataTable from "./DataTable";
import MLSQLHTML, {MLSQLHTMLPanel} from "../dash/MLSQLHTML";
import AceEditor from "react-ace";
import {Collapse} from "antd";

export default class DisplayGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {errorMsg: ""}
    }


    refresh = (displayData) => {
        this.setState({displayData: displayData, errorMsg: ""})
        if (this.displayTableRef) {
            this.displayTableRef.refresh(this.state.displayData, {})
        }

        if (this.displayDashRef) {
            const item = this.state.displayData[0]
            this.displayDashRef.refresh(item)
        }

    }

    fail = (msg) => {
        this.setState({errorMsg: msg})
        if (this.editor) {
            this.editor.editor.setValue(msg)
        }
    }

    displayDash = () => {
        if (this.state.displayData && MLSQLHTML.isShouldRender(this.state.displayData)) {
            const item = this.state.displayData[0]
            return <MLSQLHTMLPanel data={item} ref={(et) => this.displayDashRef = et}></MLSQLHTMLPanel>
        } else {
            return <div></div>
        }

    }

    displayError = () => {
        if (this.state.errorMsg) {
            return <div><AceEditor
                maxLines={Infinity}
                width={"100%"}
                ref={et => {
                    this.editor = et
                }}
                value={this.state.errorMsg}
                mode="text"
                theme="ace/theme/textmate"

            /></div>
        } else {
            return <div></div>
        }
    }

    displayTable = () => {
        if (this.state.displayData) {
            if (this.state.displayData && MLSQLHTML.isShouldRender(this.state.displayData)) {
            } else {
                return <>
                    <Collapse style={{margin: "20px 0px", padding: "0px 0px"}} defaultActiveKey={"1"}>
                        <Collapse.Panel header="Result" key="1">
                            <DataTable data={this.state.displayData}
                                       ref={(et) => this.displayTableRef = et}></DataTable>
                        </Collapse.Panel>
                    </Collapse>
                </>
            }
        } else {
            return <div></div>
        }

    }

    render() {
        return <div>
            {this.displayError()}
            {
                this.displayTable()
            }{this.displayDash()}</div>

    }
}