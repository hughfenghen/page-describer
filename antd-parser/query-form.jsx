import { Button, Input, Form } from 'antd';
import React from "react";

const FormItem = Form.Item

export default function QueryForm({ describer }) {
  const formItems = describer.getQueryConditions()
    .map((it) => ({
      ...it,
      el: it.render ? it.render() : <Input />,
    }))
  const [{ query, pagination: { pageIndex, pageSize} }, dispatch] = describer.pageStore
 
  async function onQuery() { 
    const { list, total: ttl } = await describer.onQuery({...query, pageIndex, pageSize }) 
    dispatch({ type: 'tableDataChange', payload: list })
    dispatch({ type: 'paginationChange', payload: { total: ttl } })
  }

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
      onClick={onQuery}
      type="primary"
      style={{ margin: '10px 20px 0 0' }}
    >查询
      </Button>
    <Button onClick={() => { updateStore('query', {}) }}>重置</Button>
  </div>)
}