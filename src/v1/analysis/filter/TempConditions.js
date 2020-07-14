import * as React from "react";
import { Tabs, Switch, Menu, Button, Modal, Input, Select } from 'antd';
import ApplyFuncToField from "../ApplyFuncToField";
import ColumnOperate from "../ColumnOperate";
export default class TempConditions extends React.Component {
     constructor(props){
         super(props)
         this.filterStation = props.parent
         this.workshop = props.parent.workshop
         this.state = {}
     }

     componentDidMount = ()=>{
        this.columnsRef.update(this.filterStation.tempConditions,{})
     }

     render = ()=>{
         return <ColumnOperate ref={et => this.columnsRef = et}></ColumnOperate>
     }
}