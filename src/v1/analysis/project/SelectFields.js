import * as React from "react";
import { Transfer,Input } from 'antd';
export default class SelectFields extends React.Component {
  constructor(props) {
    super(props)
    this.workshop = props.parent.workshop       
    this.state = this.wow(props)
  }
   
  
  wow(props){
    const schemaFields = props.schemaFields.map(item=>{
      return {
        title:item.name,
        key: item.name,                     
      }
    })
    const targetKeys = [];
    const data = schemaFields; 
    return {data,targetKeys}
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.schemaFields !== prevProps.schemaFields) {
        this.setState({...this.wow(this.props)})
    }
  }

  filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
    if(this.props.handleChange){
      this.props.handleChange({ targetKeys })
    }
  }

  getSelectFields = ()=>{
    return this.state.targetKeys || []
  }

 
  render() {
    return <Transfer
    dataSource={this.state.data}
    showSearch
    filterOption={this.filterOption}
    targetKeys={this.state.targetKeys}
    onChange={this.handleChange}
    // onSearch={this.handleSearch}    
    render={item => item.title}
  />
  }
}