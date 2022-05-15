import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/index'
import { Provider } from 'react-redux'

import { MoralisProvider } from 'react-moralis'
const { REACT_APP_MORALIS_APPLICATION_ID, REACT_APP_SERVER_URL } = process.env
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <MoralisProvider appId="EzhTz8yZErpkT2PLE4C5oGWVa260R2QfbbCjN5ni" serverUrl="https://h1wbicy9mjrh.usemoralis.com:2053/server">
        <App />
      </MoralisProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
