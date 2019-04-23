
import { hot } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React, { useEffect, useReducer } from 'react';

import 'antd/dist/antd.css'
import { Query, List, useQueryList } from '../../antd-parser/query-list'
import QueryListDescriber from './desciber';

const describer = new QueryListDescriber()

const initStore = {
  basicInfo: {},
  query: {},
  table: [],
  pagination: {
    pageIndex: 1,
    pageSize: 10,
    total: 100,
  },
}

function defultReducer(state, { type, payload }) {
  switch (type) {
    case 'queryFormChange':
      return { ...state, query: { ...state.query, ...payload } };
    case 'tableDataChange':
      return { ...state, table: payload };
    case 'paginationChange':
      return { ...state, pagination: { ...state.pagination, ...payload } };
    case 'basicInfoChange':
      return { ...state, basicInfo: payload };
    default:
      return -1;
  }
}

// function useQueryList(extraReducer) {
//   return useReducer((...args) => {
//     let state = defultReducer(...args)
//     if (state === -1)
//       state = extraReducer(...args)
//     return state
//   }, initStore)
// }

console.log('============ app', React);

function App() {
  console.log(11111111, 'App');
  describer.pageStore = useQueryList(describer.reducer)
  // describer.usePageStore()
  // const [{ pagination }] = useReducer(defultReducer, {})
  useEffect(() => {
    describer.onQuery()
    describer.fetchBasicInfo()
  }, [])

  return (<div
    style={{
      width: '80%',
      margin: '30px auto',
    }}
  >
    <Query describer={describer} />
    <List describer={describer} />
  </div>)
}

export default App
// export default hot(module)(App)
