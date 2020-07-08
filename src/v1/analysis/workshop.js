import * as React from "react";
import './workshop.scss'
import LeftView from "./leftview";
import {MLSQLQueryDisplay} from "../../components/MLSQLQueryDisplay"
import {WorkshopOp} from "./WorkshopOp";
import mix from "../../common/mixin"

export default class AnalysisWorkshop extends mix(React.Component).with(WorkshopOp) {
    constructor(props){
        super(props)         
    }
    render(){                               
        return <div className="ws-app">
            <div className="ws-left-pane">                
               <LeftView ref={(et)=>this.leftTreePaneRef = et} parent={this}></LeftView>
            </div>
            <div className="ws-right-pane">
                <div className="ws-operate-pane">MMMMMMMM</div>
                <div className="ws-table-pane">
                    <MLSQLQueryDisplay style={{width:"100%"}} ref={(et)=>this.displayRef=et} parent={this}/>
                </div>               
            </div>
        </div>
    }
} 