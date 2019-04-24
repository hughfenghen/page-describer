import React, { useReducer } from 'react'
export { default as List } from './list.jsx'
export { default as Query } from './query.jsx'

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

export function defultReducer(state, { type, payload }) {
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

export function useQueryList(extraReducer) {
  return useReducer((...args) => {
    let state = defultReducer(...args)
    if (state === -1)
      state = extraReducer(...args)
    return state
  }, initStore)
}
