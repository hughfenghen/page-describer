import React, { useEffect } from 'react';
import ReactDOM from "react-dom";

import 'antd/dist/antd.css'

import { Query, List } from '../../antd-parser/query-list'
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
    <Query describer={describer} />
    <List describer={describer} />
  </div>)
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
