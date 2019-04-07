/* eslint-disable react/destructuring-assignment */
import { Table } from 'antd';
import React, { Component } from "react";

export default class TableList extends Component {

  listeners = []
  
  constructor(props) {
    super(props)

    this.state = {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 页`,
        onChange: (pageIndex, pageSize) => {
          const { pagination } = this.state
          this.setState({
            pagination: Object.assign(pagination, {
              current: pageIndex,
              pageSize,
            })
          })
          this.props.describer.emit('table-pagination-change', { pageIndex, pageSize })
        }
      }
    }
  }

  componentDidMount() {
    const { describer } = this.props
    this.listeners.push(
      describer.listen('table-data-change', this.onTableDataChange),
      describer.listen('force-update-table', () => {
        this.forceUpdate()
      })
    )
  }

  onTableDataChange = (tableData) => {
    const { pagination } = this.state
    this.setState({
      dataSource: tableData.list.map((it, idx) => ({ ...it, key: idx })),
      pagination: Object.assign(pagination, {
        total: tableData.total
      })
    })
  }

  componentWillUnmount() {
    this.listeners.forEach((rmHandler) => {
      rmHandler()
    })
  }

  render() {
    const { describer } = this.props
    const columns = describer.getTableColumns()
      .map(({ field, columnOpts: { dataIndex }, fieldAlias, render }) => ({
        key: field,
        dataIndex,
        title: fieldAlias,
        render,
      }))
    return (
      <div>
        <Table 
          onRow={(record) => {
            return {
              onMouseEnter: () => {
                describer.emit('table-onRow-onMouseEnter', record)
              },
              onMouseLeave: () => {
                describer.emit('table-onRow-onMouseLeave', record)
              }
            };
          }}
          columns={columns} 
          dataSource={this.state.dataSource}
          pagination={this.state.pagination}
          style={{ marginTop: '20px' }}
        />
      </div>)
  }
}
