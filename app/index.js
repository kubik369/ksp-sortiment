import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import App from './components/App';
import {rootReducer, getInitialState} from './rootReducer';

const store = createStore(
  rootReducer,
  getInitialState(),
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  )
);
const body = document.getElementById('root');

ReactDOM.render(<Provider store={store}><App /></Provider>, body);
