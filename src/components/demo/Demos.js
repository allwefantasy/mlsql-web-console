import * as React from "react";
import {DEMO_VIEW_BIGDL, DEMO_VIEW_NLP} from "../../common/ViewConst";
import BigDL from "./BigDL";
import {NLP} from "./NLP";

export class Demos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentView: DEMO_VIEW_BIGDL
        }
    }

    renderView = () => {
        if (this.state.currentView === DEMO_VIEW_BIGDL) {
            return <BigDL/>
        }
        if (this.state.currentView === DEMO_VIEW_NLP) {
            return <NLP/>
        }
        return null
    }

    render() {
        return this.renderView()
    }
}