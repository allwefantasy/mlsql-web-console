import * as React from "react";
import {DEMO_VIEW_BASIC, DEMO_VIEW_BIGDL, DEMO_VIEW_NLP} from "../../common/ViewConst";
import BigDL from "./BigDL";
import {NLP} from "./NLP";
import {Basic} from "./Basic";

export class Demos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentView: DEMO_VIEW_BASIC
        }
    }

    renderView = () => {
        if (this.state.currentView === DEMO_VIEW_BIGDL) {
            return <BigDL/>
        }
        if (this.state.currentView === DEMO_VIEW_NLP) {
            return <NLP/>
        }
        if (this.state.currentView === DEMO_VIEW_BASIC) {
            return <Basic/>
        }
        return null
    }

    render() {
        return this.renderView()
    }
}