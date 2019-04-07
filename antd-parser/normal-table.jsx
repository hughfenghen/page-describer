import { Table } from 'antd';
import React from "react";

export default function NormalTable({ describer }) {
  const columns = describer.getTableColumns()
    .map(({ field, columnOpts: { dataIndex }, fieldAlias, render }) => ({
      key: field,
      dataIndex,
      title: fieldAlias,
      render,
    }))

  const [{ query, table: tableData, pagination: { pageIndex, pageSize, total } }, dispatch] = describer.pageStore
  
  async function onQuery() {
    const { list } = await describer.onQuery({ ...query, pageIndex, pageSize })
    dispatch({ type: 'tableDataChange', payload: list })
  }

  const tablePage = {
    current: pageIndex,
    pageSize,
    total,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 页`,
    onChange: (pi, ps) => {
      const payload = {
        pageIndex: pi,
        pageSize: ps,
      }
      dispatch({ type: 'paginationChange', payload})
      onQuery()
    }
  }

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
        dataSource={tableData}
        pagination={tablePage}
        style={{ marginTop: '20px' }}
      />
    </div>)
}