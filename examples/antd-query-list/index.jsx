import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";

import 'antd/dist/antd.css'

import QueryForm from '../../antd-parser/query-form'
import NormalTable from '../../antd-parser/normal-table'
import QueryListDescriber from './desciber';

const describer = new QueryListDescriber()

function App() {
  describer.usePageStore()
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
    <QueryForm describer={describer} />
    <NormalTable describer={describer} />
  </div>)
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
