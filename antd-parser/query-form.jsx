/* eslint-disable react/destructuring-assignment */
import { Button, Input, Form } from 'antd';
import React, { Component } from "react";

const FormItem = Form.Item

class QueryForm extends Component {
  constructor() {
    super()
    this.state = {
    }
  }

  componentDidMount() {
    this.props.describer.listen('trigger-query', this.onQuery)
  }

  onQuery = () => {
    const { getFieldsValue } = this.props.form
    const formData = getFieldsValue()

    this.props.describer.emit('query-list', formData)
  }

  reset = () => {
    this.props.form.resetFields()
  }
  
  render() {
    const {
      describer,
      form: { getFieldDecorator },
    } = this.props

    const formItems = describer.getQueryConditions()
    
    return (
      <div>
        <Form layout="inline">
          {formItems.map(({ field, fieldAlias, render, conditionOpts }) => 
            <FormItem
              label={fieldAlias}
              key={field}
            >
              {getFieldDecorator(field, conditionOpts || {})(
                render ? render() : <Input />
              )}
            </FormItem>)}
        </Form>
        <Button 
          onClick={this.onQuery} 
          type="primary"
          style={{ margin: '10px 20px 0 0'}}
        >查询
        </Button>
        <Button onClick={this.reset}>重置</Button>
      </div>)
  }
}

export default Form.create()(QueryForm)