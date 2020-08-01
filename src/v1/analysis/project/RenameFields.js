import * as React from "react";
import { Transfer, Input, Form } from 'antd';
export default class RenameFields extends React.Component {
  constructor(props) {
    super(props)
    this.workshop = props.parent.workshop
    this.state = this.wow(props)
  }
  getSelectFields = () => {
    return this.formRef.getFieldValue()
  }
  wow(props) {
    const schemaFields = props.schemaFields.map(item => {
      return {
        title: item.name,
        key: item.name,
      }
    })
    const targetKeys = [];
    const data = schemaFields;
    return { data, targetKeys }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.schemaFields !== prevProps.schemaFields) {
      this.setState({ ...this.wow(this.props) })
    }
  }

  render() {
    return <Form labelCol={{ span: 6 }} ref={(et) => { this.formRef = et }}>
      {this.state.data.map(item => {
        return <Form.Item key={item.key} name={item.key} label={item.key} value={item.key}>
          <Input placeholder={"input the new name here"} />
          </Form.Item>
      })}
    </Form>
  }
}