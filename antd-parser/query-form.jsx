import { Button, Input, Form } from 'antd';
import React, { useEffect, useState } from "react";

const FormItem = Form.Item

export default function QueryForm({ describer }) {
  const formItems = describer.getQueryConditions()
    .map((it) => ({
      ...it,
      el: it.render ? it.render() : <Input />,
    }))
  const [{ query, pagination: { pageIndex, pageSize} }, dispatch] = describer.pageStore
 
  return (<div>
    <Form layout="inline">
      {formItems.map(({ field, fieldAlias, el, conditionOpts }) =>
        <FormItem
          label={fieldAlias}
          key={field}
        >{React.cloneElement(el, {
          value: query[field],
          onChange(val) {
            dispatch({
              type: 'queryFormChange', 
              payload: { [field]: val && val.target ? val.target.value : val }
            })
          }
        })}
        </FormItem>)}
    </Form>
    <Button
      onClick={describer.onQuery}
      type="primary"
      style={{ margin: '10px 20px 0 0' }}
    >查询
    </Button>
    <Button onClick={() => { updateStore('query', {}) }}>重置</Button>
  </div>)
}