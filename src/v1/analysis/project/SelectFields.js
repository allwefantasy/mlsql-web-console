import * as React from "react";
import { Transfer,Input } from 'antd';
export default class ProjectStation extends React.Component {
  constructor(props) {
    super(props)
    this.workshop = props.parent.workshop
    this.state = {}
  }
  componentDidMount() {
    this.getData()
  }

  getData= () => {
    const schemaFields = this.workshop.currentTable.schema.fields.map(item=>{
      return {
        title:item.name,
        key: item.name,                     
      }
    })
    const targetKeys = [];
    const data = schemaFields;  
    
    this.setState({ data, targetKeys });
  };

  filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  getSelectFields = ()=>{
    return this.state.targetKeys || []
  }

  // handleSearch = (dir, value) => {
  //   console.log('search:', dir, value);
  // };

  

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