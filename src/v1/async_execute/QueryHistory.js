import React from 'react';
import { ActionProxy } from "../../backend_service/ActionProxy"
import RemoteAction from '../../backend_service/RemoteAction';
import { MLSQLQueryDisplay } from '../../components/MLSQLQueryDisplay';

export default class QueryHistory extends React.Component {
    constructor(props){
      super(props)
      this.client = new ActionProxy()
    }

    reload(){
      this.componentDidMount()
    }

   async componentDidMount(){
    const res = await this.client.get(RemoteAction.JOB_LIST,{}) 
    if(res.status == 200){
      if(this.display){
          this.display.update(res.content,{})
      }  
    }
    }

    render(){
      return <div className="mlsql-query-display">        
        <MLSQLQueryDisplay ref={(_display)=>{this.display = _display}} parent={this}/>
      </div>
    }
}