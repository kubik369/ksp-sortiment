import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import AppContainer from './containers/App';
import {store} from './store'

const body = document.getElementById('root');

ReactDOM.render(<Provider store={store}><AppContainer /></Provider>, body);
