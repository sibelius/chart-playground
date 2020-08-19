import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

ReactDOM.render(
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>
      <Root />
    </QueryParamProvider>
  </Router>,
  document.getElementById('root'),
);
