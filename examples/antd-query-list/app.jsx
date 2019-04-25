
import { hot } from 'react-hot-loader';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.css'
import { Query, List, useQueryList } from '../../antd-parser/query-list'
import QueryListDescriber from './desciber';

const describer = new QueryListDescriber()

function App() {
  describer.pageStore = useQueryList(describer.reducer)
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
    <List 
      describer={describer} 
      onRow={(record) => {
        return {
          onMouseEnter: () => {
            describer.onMouseEnter(record)
          },
          onMouseLeave: () => {
            describer.onMouseLeave(record)
          }
        };
      }}
    />
  </div>)
}

// todo: if env === dev
const HotApp = hot(module)(App)

ReactDOM.render(
  <HotApp />,
  document.getElementById("root")
);