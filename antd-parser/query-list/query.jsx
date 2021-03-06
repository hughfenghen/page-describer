import { Button, Input, Form } from 'antd';
import React from "react";

const FormItem = Form.Item

export default function Query({ describer }) {
  const formItems = describer.getQueryConditions()
    .map((it) => ({
      ...it,
      el: it.element || <Input />,
    }))
  const [{ query }, dispatch] = describer.pageStore
 
  return (<div>
    <Form layout="inline">
      {formItems.map(({ field, fieldAlias, el }) =>
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
      onClick={describer.onQuery.bind(describer)}
      type="primary"
      style={{ margin: '10px 20px 0 0' }}
    >查询
    </Button>
    <Button onClick={() => { updateStore('query', {}) }}>重置</Button>
  </div>)
}