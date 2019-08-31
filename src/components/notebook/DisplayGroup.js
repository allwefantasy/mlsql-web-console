import React from 'react'
import DataTable from "./DataTable";
import MLSQLHTML from "../dash/MLSQLHTML";

export default class DisplayGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    displayDash = () => {
        if (this.state.displayData && MLSQLHTML.isShouldRender(this.state.displayData)) {
            return MLSQLHTML.render(this.state.displayData)
        } else {
            return <div></div>
        }

    }

    displayTable = () => {
        if (this.state.displayData) {
            return <DataTable data={this.state.displayData}></DataTable>
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