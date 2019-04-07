import React from 'react';
import ReactDOM from "react-dom";

import 'antd/dist/antd.css'

import QueryForm from '../../antd-parser/query-form'
import Table from '../../antd-parser/table'
import QueryListDescriber from './desciber';

const describer = new QueryListDescriber()

function App() {
  return (<div
    style={{
      width: '80%',
      margin: '30px auto',
    }}
  >
    <QueryForm describer={describer} />
    <Table describer={describer} />
  </div>)
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
