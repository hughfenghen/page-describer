import React from 'react'
import { Divider, DatePicker, Icon, Input } from 'antd';
import { stringify } from 'query-string';
import { listener, page, fieldEnums, fieldAlias, queryCondition, tableColumn, columnRender } from '../../decorator';

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
  @tableColumn(999, ()=> {}, { dataIndex: 'id' })
  operate

  @columnRender('country')
  renderCountryCol([val, record]) {
    if (record === this.edittingRow) {
      return (
        <div>
          <Input />
          <Icon type="check" />
          <Icon
            type="close"
            onClick={() => {
              // this.edittingRow = null
              // this.emit('force-update-table')
            }}
          />
        </div>
      )
    } if (record === this.mouseActiveRecord && !this.edittingRow) {
      return (
        <div>
          <span>{val}</span>
          <Icon
            type="edit"
            style={{ marginLeft: 10 }}
            onClick={() => {
              // this.edittingRow = record
              // this.mouseActiveRecord = null
              // this.emit('force-update-table')
            }}
          />
        </div>)
    }
    return val
  }

  @listener('query-list')
  async onQuery(params) {
    const resp = await fetch(`/api/task/list?${stringify(params)}`)
    const { data } = await resp.json()
    this.emit('table-data-change', data)
  }
}

export default QueryListDescriber