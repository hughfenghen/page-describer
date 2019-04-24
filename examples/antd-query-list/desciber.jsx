import React from 'react'
import { Divider, DatePicker, Icon, Input, Select } from 'antd';
import { listener, page, fieldEnums, fieldAlias, queryCondition, tableColumn, columnRender, conditionRender } from '../../decorator';

const { RangePicker } = DatePicker

@page
class QueryListDescriber {

  @fieldAlias('序号')
  @tableColumn(0)
  index

  @fieldAlias('关键字')
  @queryCondition(1)
  keywords

  @fieldAlias('国家')
  @queryCondition(2)
  @tableColumn(1)
  country

  @fieldAlias('状态')
  @queryCondition(3)
  @tableColumn(2)
  @fieldEnums([
    [1, '状态1'],
    [2, '状态2'],
    [3, '状态3'],
  ])
  status

  @fieldAlias('最近更新时间')
  @tableColumn(3)
  updateTime

  @fieldAlias('最近更新人')
  @tableColumn(4)
  operator

  @fieldAlias('更新时间')
  @queryCondition(4, <RangePicker />)
  updateTimeRange

  @fieldAlias('操作')
  @tableColumn(999)
  operate

  // 引用 useQueryList（包含state, dispatch） 的返回值
  pageStore = []

  reducer(state, { type, payload }) {
    switch (type) {
      case 'activeRowChange':
        return { ...state, activeRow: payload };
      case 'editRowChange':
        return { ...state, editRow: payload };
      default:
        throw new Error('not found reduce type: ' + type);
    }
  }

  @columnRender('country')
  renderCountryCol([val, record]) {
    const [{ activeRow, editRow }, dispatch] = this.pageStore
    if (record === editRow) {
      return (<>
          <Input />
          <Icon type="check" />
          <Icon
            type="close"
            onClick={() => {
              dispatch({ 'type': 'editRowChange', payload: null })
            }}
          />
        </>)
    } if (record === activeRow && !editRow) {
      return (<>
          <span>{val}</span>
          <Icon
            type="edit"
            style={{ marginLeft: 10 }}
            onClick={() => {
              dispatch({ type: 'editRowChange', payload: record })
              dispatch({ type: 'activeRowChange', payload: null })
            }}
          />
        </>)
    }
    return val
  }

  @columnRender('index')
  renderRowIndex([,, idx]) {
    const [{ pagination: { pageIndex, pageSize }}] = this.pageStore
    return (pageIndex - 1) * pageSize + idx + 1
  }

  @columnRender('operate')
  renderOperate([, { id }]) {
    return (<>
      <a>详情</a>
      <Divider type="vertical" />
      <a>删除</a>
    </>)
  }

  @columnRender('status')
  renderStatusCol([val], { enums }) {
    const item = enums.find(([key]) => val === key) || []
    return item[1] || val
  }

  @conditionRender('status')
  renderStatusQuery({ enums }) {
    return (<Select style={{ width: 100 }}>
      {enums.map(([value, label]) => (
        <Select.Option key={value}>{label}</Select.Option>))}
      </Select>)
  }

  @conditionRender('country')
  renderCountryQuery() {
    const [{ basicInfo: { country = [] }}] = this.pageStore
    return <Select style={{ width: 100 }}>
      {country.map(({ value, name }) => <Select.Option key={value}>
          {name}
        </Select.Option>)}
    </Select>
  }

  async onQuery() {
    const [{ query }, dispatch] = this.pageStore
    console.log('------onQuery', query);

    // fetch
    const { default: resp } = await import('./__mock__/list.js')
    const { list, total: ttl } = resp.data

    dispatch({ 
      type: 'tableDataChange', 
      payload: list.map((it) => Object.assign(it, { key: it.id })) 
    })
    dispatch({ type: 'paginationChange', payload: { total: ttl } })
  }

  async fetchBasicInfo() {
    console.log('------fetchBasicInfo');
    const [, dispatch] = this.pageStore

    // fetch
    const { default: resp } = await import('./__mock__/basic-info.js')

    dispatch({ type: 'basicInfoChange', payload: resp.data })
  }

  onMouseEnter(record) {
    const [, dispatch] = this.pageStore
    dispatch({ type: 'activeRowChange', payload: record })
  }

  onMouseLeave(record) {
    const [, dispatch] = this.pageStore
    dispatch({ type: 'activeRowChange', payload: null })
  }
  
}

export default QueryListDescriber