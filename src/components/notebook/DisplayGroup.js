import React from 'react'
import DataTable from "./DataTable";
import MLSQLHTML, {MLSQLHTMLPanel} from "../dash/MLSQLHTML";

export default class DisplayGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    refresh = (displayData) => {
        this.setState({displayData: displayData})
        if (this.displayTableRef) {
            this.displayTableRef.refresh(this.state.displayData, {})
        }

        if (this.displayDashRef) {
            const item = this.state.displayData[0]
            this.displayDashRef.refresh(item)
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

    displayTable = () => {
        if (this.state.displayData) {
            return <DataTable data={this.state.displayData} ref={(et) => this.displayTableRef = et}></DataTable>
        } else {
            return <div></div>
        }

    }

    render() {
        return <div>{
            this.displayTable()
        }{this.displayDash()}</div>

    }
}