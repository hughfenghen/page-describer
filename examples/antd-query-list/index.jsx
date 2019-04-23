import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

console.log('============ index', React);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);