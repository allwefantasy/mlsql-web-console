import * as React from "react";
import MainPage from "./team/MainPage";
import {TEAM_VIEW_BASIC} from "../common/ViewConst";

export class MLSQLManagerApp extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div>
                <MainPage parent={this}/>
            </div>
        )
    }
}