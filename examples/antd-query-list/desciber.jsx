import React, { useReducer } from 'react'
import { Divider, DatePicker, Icon, Input } from 'antd';
import { stringify } from 'query-string';
import { listener, page, fieldEnums, fieldAlias, queryCondition, tableColumn, columnRender } from '../../decorator';

const { RangePicker } = DatePicker

const initStore = {
  query: {},
  table: [],
  pagination: {
    pageIndex: 1,
    pageSize: 10,
    total: 100,
  },
}

function reducer(state, { type, payload }) {
  console.log('-----reducer', type, payload);
  switch (type) {
    case 'queryFormChange':
      return { ...state, query: { ...state.query, ...payload } };
    case 'tableDataChange':
      return { ...state, table: payload };
    case 'paginationChange':
      return { ...state, pagination: { ...state.pagination, ...payload } };
    case 'activeRowChange':
      return { ...state, activeRow: payload };
    case 'editRowChange':
      return { ...state, editRow: payload };
    default:
      throw new Error();
  }
}

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
  @tableColumn(999, ()=> {}, { dataIndex: 'id' })
  operate

  @columnRender('country')
  renderCountryCol([val, record]) {
    const [{ activeRow, editRow }, dispatch] = this.pageStore
    if (record === editRow) {
      return (
        <div>
          <Input />
          <Icon type="check" />
          <Icon
            type="close"
            onClick={() => {
              dispatch({ 'type': 'editRowChange', payload: null })
            }}
          />
        </div>
      )
    } if (record === activeRow && !editRow) {
      return (
        <div>
          <span>{val}</span>
          <Icon
            type="edit"
            style={{ marginLeft: 10 }}
            onClick={() => {
              dispatch({ type: 'editRowChange', payload: record })
              dispatch({ type: 'activeRowChange', payload: null })
            }}
          />
        </div>)
    }
    return val
  }

  usePageStore() {
    console.log('----usePageStore');
    this.pageStore = useReducer(reducer, initStore)
  }

  async onQuery(params) {
    console.log('------onQuery', params);
    // fetch
    const { default: resp } = await import('./__mock__/list.js')

    return resp.data
  }

  @listener('table-onRow-onMouseEnter')
  onMouseEnter(record) {
    const [, dispatch] = this.pageStore
    dispatch({ type: 'activeRowChange', payload: record })
  }

  @listener('table-onRow-onMouseLeave')
  onMouseLeave(record) {
    const [, dispatch] = this.pageStore
    dispatch({ type: 'activeRowChange', payload: null })
  }
  
}

export default QueryListDescriber