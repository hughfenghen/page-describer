import { Table } from 'antd';
import React from "react";

export default function List({ describer, ...props }) {
  const columns = describer.getTableColumns()
    .map(({ field, columnOpts: { dataIndex }, fieldAlias, render }) => ({
      key: field,
      dataIndex,
      title: fieldAlias,
      render,
    }))

  const [{ table: tableData, pagination: { pageIndex, pageSize, total } }, dispatch] = describer.pageStore
  
  const tablePage = {
    current: pageIndex,
    pageSize,
    total,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 页`,
    onChange: (pi, ps) => {
        dispatch({ type: 'paginationChange', payload: { pageIndex: pi, pageSize: ps } })
      describer.onQuery()
    }
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={tablePage}
        style={{ marginTop: '20px' }}
        {...props}
      />
    </div>)
}